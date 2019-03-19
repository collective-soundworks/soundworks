'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

var _wavEncoder = require('wav-encoder');

var _wavEncoder2 = _interopRequireDefault(_wavEncoder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:shared-recorder';

var SharedRecorder = function (_Service) {
  (0, _inherits3.default)(SharedRecorder, _Service);

  function SharedRecorder() {
    (0, _classCallCheck3.default)(this, SharedRecorder);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SharedRecorder.__proto__ || (0, _getPrototypeOf2.default)(SharedRecorder)).call(this, SERVICE_ID));

    var defaults = {
      directory: 'public'
    };

    _this.buffers = new _map2.default();
    // this.stacks = {};

    _this._rawSocket = _this.require('raw-socket', {
      protocol: [{ channel: 'shared-recorder:start-record', type: 'Uint8' }, { channel: 'shared-recorder:stop-record', type: 'Uint8' }, { channel: 'shared-recorder:new-block', type: 'Float32' }]
    });
    return _this;
  }

  (0, _createClass3.default)(SharedRecorder, [{
    key: 'start',
    value: function start() {
      (0, _get3.default)(SharedRecorder.prototype.__proto__ || (0, _getPrototypeOf2.default)(SharedRecorder.prototype), 'start', this).call(this);

      this.ready();
    }
  }, {
    key: 'connect',
    value: function connect(client) {
      // producer
      // @todo - define if the client is a producer in the handshake
      this.receive(client, 'create-buffer', this._createBuffer(client));

      this._rawSocket.receive(client, 'shared-recorder:start-record', this._startRecord(client));
      this._rawSocket.receive(client, 'shared-recorder:stop-record', this._stopRecord(client));
      this._rawSocket.receive(client, 'shared-recorder:new-block', this._recordBlock(client));
    }
  }, {
    key: 'disconnect',
    value: function disconnect(client) {}

    // remove that...

  }, {
    key: '_getBufferInfos',
    value: function _getBufferInfos(client, index) {
      var bufferId = client.uuid + ':' + index;
      return this.buffers[bufferId];
    }
  }, {
    key: '_createBuffer',
    value: function _createBuffer(client) {
      var _this2 = this;

      var uuid = client.uuid;

      return function (infos) {
        // prepare the buffer
        infos.buffer = new Float32Array(infos.length);
        infos.chunkHop = infos.chunkPeriod * infos.sampleRate; // period in samples
        infos.chunkSize = infos.chunkDuration * infos.sampleRate;
        // initialize pointers
        infos.pointer = 0;
        infos.chunkIndex = 0;
        // console.log(infos, infos.chunkPeriod, infos.sampleRate);

        var bufferId = uuid + ':' + infos.index;
        _this2.buffers[bufferId] = infos;

        console.log('create buffer');
      };
    }
  }, {
    key: '_startRecord',
    value: function _startRecord(client) {
      var _this3 = this;

      return function (data) {
        var index = data[0];
        var infos = _this3._getBufferInfos(client, index);
        infos.pointer = 0;
        infos.chunkIndex = 0;
        infos.full = false;
        console.log('start', index);
      };
    }
  }, {
    key: '_stopRecord',
    value: function _stopRecord(client) {
      var _this4 = this;

      return function (data) {
        var index = data[0];
        var infos = _this4._getBufferInfos(client, index);
        console.log('stop', index);

        // finalize current chunk with available data
        var start = infos.chunkIndex * infos.chunkHop;
        _this4._finalizeChunk(infos, start, infos.pointer);
      };
    }
  }, {
    key: '_finalizeChunk',
    value: function _finalizeChunk(infos, start, end) {
      var _this5 = this;

      // const startTime = start / infos.sampleRate;
      // const endTime = end / infos.sampleRate;
      // console.log('finalizeBuffer', infos.name, infos.chunkIndex, start, startTime + 's', end, endTime + 's');

      var name = infos.name,
          chunkIndex = infos.chunkIndex,
          buffer = infos.buffer;

      var chunk = void 0;

      if (start < 0) {
        chunk = new Float32Array(end - start);
        chunk.set(buffer.subarray(start), 0);
        chunk.set(buffer.subarray(0, end), -start);
      } else {
        chunk = buffer.subarray(start, end);
      }

      _wavEncoder2.default.encode({
        sampleRate: infos.sampleRate,
        channelData: [chunk]
      }).then(function (buffer) {
        var filename = infos.name + '-' + chunkIndex + '.wav';
        // @todo - remove hard coded path
        var clientPath = _path2.default.join('sounds', filename);
        var serverPath = _path2.default.join(process.cwd(), 'public', clientPath);
        // write encoded buffer into a file
        var stream = _fs2.default.createWriteStream(serverPath);
        stream.on('finish', function () {
          return _this5._notifyChunk(name, chunkIndex, clientPath);
        });
        stream.write(new Buffer(buffer));
        stream.end();
      });
    }
  }, {
    key: '_notifyChunk',
    value: function _notifyChunk(name, chunkIndex, path) {
      // @todo - should send only to consumers client types
      console.log('notify "' + name + '" - chunkIndex: ' + chunkIndex + ' - ' + path);
      this.broadcast(null, null, 'available-file', name, chunkIndex, path);
      // emit for server side
      this.emit('available-file', name, chunkIndex, path);
    }

    // @fixme - this implementation assume that the block size cannot be larger
    // than the hop size, cannot have multiple output chunk in one incomming block

  }, {
    key: '_verifyChunk',
    value: function _verifyChunk(infos, prevPointer, currentPointer) {
      var full = infos.full;
      var chunkIndex = infos.chunkIndex;
      var hop = infos.chunkHop;
      var size = infos.chunkSize;
      var length = infos.length;

      var end = chunkIndex * hop + size;

      if (end > length) end = end - length;

      var start = end - size;

      if (!full && start < 0) return;

      if (end > prevPointer && end <= currentPointer) {
        this._finalizeChunk(infos, start, end);
        infos.chunkIndex = (infos.chunkIndex + 1) % infos.numChunks;
      }
    }
  }, {
    key: '_recordBlock',
    value: function _recordBlock(client) {
      var _this6 = this;

      var uuid = client.uuid;

      return function (data) {
        var index = data[0];
        var buffer = data.subarray(1);
        var bufferId = uuid + ':' + index;
        var length = buffer.length;
        var infos = _this6.buffers[bufferId];
        var prevPointer = infos.pointer;

        var numLeft = infos.length - infos.pointer;
        var numCopy = Math.min(numLeft, length);
        var toCopy = buffer.subarray(0, numCopy);
        // @todo - handle the end of the buffer properly
        infos.buffer.set(toCopy, infos.pointer);
        infos.pointer += toCopy.length;
        // console.log(infos.pointer, toCopy.length, infos.length);

        _this6._verifyChunk(infos, prevPointer, infos.pointer);

        if (!infos.cyclic && infos.pointer === infos.length) console.log('end recording');

        // if cyclic buffer - reinit pointer and copy rest of the incomming buffer
        if (infos.cyclic && infos.pointer === infos.length) {
          infos.full = true;
          infos.pointer = 0;

          if (numCopy < length) {
            var _toCopy = buffer.subarray(numCopy);
            infos.buffer.set(_toCopy, 0);
            infos.pointer += _toCopy.length;
          }

          _this6._verifyChunk(infos, prevPointer, infos.pointer);
        }
      };
    }
  }]);
  return SharedRecorder;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, SharedRecorder);

exports.default = SharedRecorder;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNoYXJlZFJlY29yZGVyLmpzIl0sIm5hbWVzIjpbIlNFUlZJQ0VfSUQiLCJTaGFyZWRSZWNvcmRlciIsImRlZmF1bHRzIiwiZGlyZWN0b3J5IiwiYnVmZmVycyIsIl9yYXdTb2NrZXQiLCJyZXF1aXJlIiwicHJvdG9jb2wiLCJjaGFubmVsIiwidHlwZSIsInJlYWR5IiwiY2xpZW50IiwicmVjZWl2ZSIsIl9jcmVhdGVCdWZmZXIiLCJfc3RhcnRSZWNvcmQiLCJfc3RvcFJlY29yZCIsIl9yZWNvcmRCbG9jayIsImluZGV4IiwiYnVmZmVySWQiLCJ1dWlkIiwiaW5mb3MiLCJidWZmZXIiLCJGbG9hdDMyQXJyYXkiLCJsZW5ndGgiLCJjaHVua0hvcCIsImNodW5rUGVyaW9kIiwic2FtcGxlUmF0ZSIsImNodW5rU2l6ZSIsImNodW5rRHVyYXRpb24iLCJwb2ludGVyIiwiY2h1bmtJbmRleCIsImNvbnNvbGUiLCJsb2ciLCJkYXRhIiwiX2dldEJ1ZmZlckluZm9zIiwiZnVsbCIsInN0YXJ0IiwiX2ZpbmFsaXplQ2h1bmsiLCJlbmQiLCJuYW1lIiwiY2h1bmsiLCJzZXQiLCJzdWJhcnJheSIsIndhdkVuY29kZXIiLCJlbmNvZGUiLCJjaGFubmVsRGF0YSIsInRoZW4iLCJmaWxlbmFtZSIsImNsaWVudFBhdGgiLCJwYXRoIiwiam9pbiIsInNlcnZlclBhdGgiLCJwcm9jZXNzIiwiY3dkIiwic3RyZWFtIiwiZnMiLCJjcmVhdGVXcml0ZVN0cmVhbSIsIm9uIiwiX25vdGlmeUNodW5rIiwid3JpdGUiLCJCdWZmZXIiLCJicm9hZGNhc3QiLCJlbWl0IiwicHJldlBvaW50ZXIiLCJjdXJyZW50UG9pbnRlciIsImhvcCIsInNpemUiLCJudW1DaHVua3MiLCJudW1MZWZ0IiwibnVtQ29weSIsIk1hdGgiLCJtaW4iLCJ0b0NvcHkiLCJfdmVyaWZ5Q2h1bmsiLCJjeWNsaWMiLCJTZXJ2aWNlIiwic2VydmljZU1hbmFnZXIiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7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QUFpQjJDLE9BQU9qRCxNQUF4QjtBQUNBOztBQUVBLGVBQUtrRCxZQUFMLENBQWtCckQsS0FBbEIsRUFBeUIyQyxXQUF6QixFQUFzQzNDLE1BQU1TLE9BQTVDOztBQUVBLFlBQUksQ0FBQ1QsTUFBTXNELE1BQVAsSUFBaUJ0RCxNQUFNUyxPQUFOLEtBQWtCVCxNQUFNRyxNQUE3QyxFQUNFUSxRQUFRQyxHQUFSLENBQVksZUFBWjs7QUFFRjtBQUNBLFlBQUlaLE1BQU1zRCxNQUFOLElBQWdCdEQsTUFBTVMsT0FBTixLQUFrQlQsTUFBTUcsTUFBNUMsRUFBb0Q7QUFDbERILGdCQUFNZSxJQUFOLEdBQWEsSUFBYjtBQUNBZixnQkFBTVMsT0FBTixHQUFnQixDQUFoQjs7QUFFQSxjQUFJd0MsVUFBVTlDLE1BQWQsRUFBc0I7QUFDcEIsZ0JBQU1pRCxVQUFTbkQsT0FBT3FCLFFBQVAsQ0FBZ0IyQixPQUFoQixDQUFmO0FBQ0FqRCxrQkFBTUMsTUFBTixDQUFhb0IsR0FBYixDQUFpQitCLE9BQWpCLEVBQXlCLENBQXpCO0FBQ0FwRCxrQkFBTVMsT0FBTixJQUFpQjJDLFFBQU9qRCxNQUF4QjtBQUNEOztBQUVELGlCQUFLa0QsWUFBTCxDQUFrQnJELEtBQWxCLEVBQXlCMkMsV0FBekIsRUFBc0MzQyxNQUFNUyxPQUE1QztBQUNEO0FBQ0YsT0FsQ0Q7QUFtQ0Q7OztFQWhNMEI4QyxpQjs7QUFtTTdCQyx5QkFBZUMsUUFBZixDQUF3QjdFLFVBQXhCLEVBQW9DQyxjQUFwQzs7a0JBRWVBLGMiLCJmaWxlIjoiU2hhcmVkUmVjb3JkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IHdhdkVuY29kZXIgZnJvbSAnd2F2LWVuY29kZXInO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6c2hhcmVkLXJlY29yZGVyJztcblxuXG5jbGFzcyBTaGFyZWRSZWNvcmRlciBleHRlbmRzIFNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lEKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgZGlyZWN0b3J5OiAncHVibGljJ1xuICAgIH07XG5cbiAgICB0aGlzLmJ1ZmZlcnMgPSBuZXcgTWFwKCk7XG4gICAgLy8gdGhpcy5zdGFja3MgPSB7fTtcblxuICAgIHRoaXMuX3Jhd1NvY2tldCA9IHRoaXMucmVxdWlyZSgncmF3LXNvY2tldCcsIHtcbiAgICAgIHByb3RvY29sOiBbXG4gICAgICAgIHsgY2hhbm5lbDogJ3NoYXJlZC1yZWNvcmRlcjpzdGFydC1yZWNvcmQnLCB0eXBlOiAnVWludDgnIH0sXG4gICAgICAgIHsgY2hhbm5lbDogJ3NoYXJlZC1yZWNvcmRlcjpzdG9wLXJlY29yZCcsIHR5cGU6ICdVaW50OCcgfSxcbiAgICAgICAgeyBjaGFubmVsOiAnc2hhcmVkLXJlY29yZGVyOm5ldy1ibG9jaycsIHR5cGU6ICdGbG9hdDMyJyB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICB0aGlzLnJlYWR5KCk7XG4gIH1cblxuICBjb25uZWN0KGNsaWVudCkge1xuICAgIC8vIHByb2R1Y2VyXG4gICAgLy8gQHRvZG8gLSBkZWZpbmUgaWYgdGhlIGNsaWVudCBpcyBhIHByb2R1Y2VyIGluIHRoZSBoYW5kc2hha2VcbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAnY3JlYXRlLWJ1ZmZlcicsIHRoaXMuX2NyZWF0ZUJ1ZmZlcihjbGllbnQpKTtcblxuICAgIHRoaXMuX3Jhd1NvY2tldC5yZWNlaXZlKGNsaWVudCwgJ3NoYXJlZC1yZWNvcmRlcjpzdGFydC1yZWNvcmQnLCB0aGlzLl9zdGFydFJlY29yZChjbGllbnQpKTtcbiAgICB0aGlzLl9yYXdTb2NrZXQucmVjZWl2ZShjbGllbnQsICdzaGFyZWQtcmVjb3JkZXI6c3RvcC1yZWNvcmQnLCB0aGlzLl9zdG9wUmVjb3JkKGNsaWVudCkpO1xuICAgIHRoaXMuX3Jhd1NvY2tldC5yZWNlaXZlKGNsaWVudCwgJ3NoYXJlZC1yZWNvcmRlcjpuZXctYmxvY2snLCB0aGlzLl9yZWNvcmRCbG9jayhjbGllbnQpKTtcbiAgfVxuXG4gIGRpc2Nvbm5lY3QoY2xpZW50KSB7XG5cbiAgfVxuXG4gIC8vIHJlbW92ZSB0aGF0Li4uXG4gIF9nZXRCdWZmZXJJbmZvcyhjbGllbnQsIGluZGV4KSB7XG4gICAgY29uc3QgYnVmZmVySWQgPSBgJHtjbGllbnQudXVpZH06JHtpbmRleH1gO1xuICAgIHJldHVybiB0aGlzLmJ1ZmZlcnNbYnVmZmVySWRdO1xuICB9XG5cbiAgX2NyZWF0ZUJ1ZmZlcihjbGllbnQpIHtcbiAgICBjb25zdCB1dWlkID0gY2xpZW50LnV1aWQ7XG5cbiAgICByZXR1cm4gKGluZm9zKSA9PiB7XG4gICAgICAvLyBwcmVwYXJlIHRoZSBidWZmZXJcbiAgICAgIGluZm9zLmJ1ZmZlciA9IG5ldyBGbG9hdDMyQXJyYXkoaW5mb3MubGVuZ3RoKTtcbiAgICAgIGluZm9zLmNodW5rSG9wID0gaW5mb3MuY2h1bmtQZXJpb2QgKiBpbmZvcy5zYW1wbGVSYXRlOyAvLyBwZXJpb2QgaW4gc2FtcGxlc1xuICAgICAgaW5mb3MuY2h1bmtTaXplID0gaW5mb3MuY2h1bmtEdXJhdGlvbiAqIGluZm9zLnNhbXBsZVJhdGU7XG4gICAgICAvLyBpbml0aWFsaXplIHBvaW50ZXJzXG4gICAgICBpbmZvcy5wb2ludGVyID0gMDtcbiAgICAgIGluZm9zLmNodW5rSW5kZXggPSAwO1xuICAgICAgLy8gY29uc29sZS5sb2coaW5mb3MsIGluZm9zLmNodW5rUGVyaW9kLCBpbmZvcy5zYW1wbGVSYXRlKTtcblxuICAgICAgY29uc3QgYnVmZmVySWQgPSBgJHt1dWlkfToke2luZm9zLmluZGV4fWA7XG4gICAgICB0aGlzLmJ1ZmZlcnNbYnVmZmVySWRdID0gaW5mb3M7XG5cbiAgICAgIGNvbnNvbGUubG9nKCdjcmVhdGUgYnVmZmVyJyk7XG4gICAgfTtcbiAgfVxuXG4gIF9zdGFydFJlY29yZChjbGllbnQpIHtcbiAgICByZXR1cm4gKGRhdGEpID0+IHtcbiAgICAgIGNvbnN0IGluZGV4ID0gZGF0YVswXTtcbiAgICAgIGNvbnN0IGluZm9zID0gdGhpcy5fZ2V0QnVmZmVySW5mb3MoY2xpZW50LCBpbmRleCk7XG4gICAgICBpbmZvcy5wb2ludGVyID0gMDtcbiAgICAgIGluZm9zLmNodW5rSW5kZXggPSAwO1xuICAgICAgaW5mb3MuZnVsbCA9IGZhbHNlO1xuICAgICAgY29uc29sZS5sb2coJ3N0YXJ0JywgaW5kZXgpO1xuICAgIH1cbiAgfVxuXG4gIF9zdG9wUmVjb3JkKGNsaWVudCkge1xuICAgIHJldHVybiAoZGF0YSkgPT4ge1xuICAgICAgY29uc3QgaW5kZXggPSBkYXRhWzBdO1xuICAgICAgY29uc3QgaW5mb3MgPSB0aGlzLl9nZXRCdWZmZXJJbmZvcyhjbGllbnQsIGluZGV4KTtcbiAgICAgIGNvbnNvbGUubG9nKCdzdG9wJywgaW5kZXgpO1xuXG4gICAgICAvLyBmaW5hbGl6ZSBjdXJyZW50IGNodW5rIHdpdGggYXZhaWxhYmxlIGRhdGFcbiAgICAgIGNvbnN0IHN0YXJ0ID0gaW5mb3MuY2h1bmtJbmRleCAqIGluZm9zLmNodW5rSG9wO1xuICAgICAgdGhpcy5fZmluYWxpemVDaHVuayhpbmZvcywgc3RhcnQsIGluZm9zLnBvaW50ZXIpO1xuICAgIH1cbiAgfVxuXG4gIF9maW5hbGl6ZUNodW5rKGluZm9zLCBzdGFydCwgZW5kKSB7XG4gICAgLy8gY29uc3Qgc3RhcnRUaW1lID0gc3RhcnQgLyBpbmZvcy5zYW1wbGVSYXRlO1xuICAgIC8vIGNvbnN0IGVuZFRpbWUgPSBlbmQgLyBpbmZvcy5zYW1wbGVSYXRlO1xuICAgIC8vIGNvbnNvbGUubG9nKCdmaW5hbGl6ZUJ1ZmZlcicsIGluZm9zLm5hbWUsIGluZm9zLmNodW5rSW5kZXgsIHN0YXJ0LCBzdGFydFRpbWUgKyAncycsIGVuZCwgZW5kVGltZSArICdzJyk7XG5cbiAgICBjb25zdCB7IG5hbWUsIGNodW5rSW5kZXgsIGJ1ZmZlciB9ID0gaW5mb3M7XG4gICAgbGV0IGNodW5rO1xuXG4gICAgaWYgKHN0YXJ0IDwgMCkge1xuICAgICAgY2h1bmsgPSBuZXcgRmxvYXQzMkFycmF5KGVuZCAtIHN0YXJ0KTtcbiAgICAgIGNodW5rLnNldChidWZmZXIuc3ViYXJyYXkoc3RhcnQpLCAwKTtcbiAgICAgIGNodW5rLnNldChidWZmZXIuc3ViYXJyYXkoMCwgZW5kKSwgLXN0YXJ0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2h1bmsgPSBidWZmZXIuc3ViYXJyYXkoc3RhcnQsIGVuZCk7XG4gICAgfVxuXG4gICAgd2F2RW5jb2Rlci5lbmNvZGUoe1xuICAgICAgc2FtcGxlUmF0ZTogaW5mb3Muc2FtcGxlUmF0ZSxcbiAgICAgIGNoYW5uZWxEYXRhOiBbY2h1bmtdLFxuICAgIH0pLnRoZW4oKGJ1ZmZlcikgPT4ge1xuICAgICAgY29uc3QgZmlsZW5hbWUgPSBgJHtpbmZvcy5uYW1lfS0ke2NodW5rSW5kZXh9LndhdmA7XG4gICAgICAvLyBAdG9kbyAtIHJlbW92ZSBoYXJkIGNvZGVkIHBhdGhcbiAgICAgIGNvbnN0IGNsaWVudFBhdGggPSBwYXRoLmpvaW4oJ3NvdW5kcycsIGZpbGVuYW1lKTtcbiAgICAgIGNvbnN0IHNlcnZlclBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ3B1YmxpYycsIGNsaWVudFBhdGgpO1xuICAgICAgLy8gd3JpdGUgZW5jb2RlZCBidWZmZXIgaW50byBhIGZpbGVcbiAgICAgIGNvbnN0IHN0cmVhbSA9IGZzLmNyZWF0ZVdyaXRlU3RyZWFtKHNlcnZlclBhdGgpO1xuICAgICAgc3RyZWFtLm9uKCdmaW5pc2gnLCAoKSA9PiB0aGlzLl9ub3RpZnlDaHVuayhuYW1lLCBjaHVua0luZGV4LCBjbGllbnRQYXRoKSk7XG4gICAgICBzdHJlYW0ud3JpdGUobmV3IEJ1ZmZlcihidWZmZXIpKTtcbiAgICAgIHN0cmVhbS5lbmQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIF9ub3RpZnlDaHVuayhuYW1lLCBjaHVua0luZGV4LCBwYXRoKSB7XG4gICAgLy8gQHRvZG8gLSBzaG91bGQgc2VuZCBvbmx5IHRvIGNvbnN1bWVycyBjbGllbnQgdHlwZXNcbiAgICBjb25zb2xlLmxvZyhgbm90aWZ5IFwiJHtuYW1lfVwiIC0gY2h1bmtJbmRleDogJHtjaHVua0luZGV4fSAtICR7cGF0aH1gKTtcbiAgICB0aGlzLmJyb2FkY2FzdChudWxsLCBudWxsLCAnYXZhaWxhYmxlLWZpbGUnLCBuYW1lLCBjaHVua0luZGV4LCBwYXRoKTtcbiAgICAvLyBlbWl0IGZvciBzZXJ2ZXIgc2lkZVxuICAgIHRoaXMuZW1pdCgnYXZhaWxhYmxlLWZpbGUnLCBuYW1lLCBjaHVua0luZGV4LCBwYXRoKTtcbiAgfVxuXG4gIC8vIEBmaXhtZSAtIHRoaXMgaW1wbGVtZW50YXRpb24gYXNzdW1lIHRoYXQgdGhlIGJsb2NrIHNpemUgY2Fubm90IGJlIGxhcmdlclxuICAvLyB0aGFuIHRoZSBob3Agc2l6ZSwgY2Fubm90IGhhdmUgbXVsdGlwbGUgb3V0cHV0IGNodW5rIGluIG9uZSBpbmNvbW1pbmcgYmxvY2tcbiAgX3ZlcmlmeUNodW5rKGluZm9zLCBwcmV2UG9pbnRlciwgY3VycmVudFBvaW50ZXIpIHtcbiAgICBjb25zdCBmdWxsID0gaW5mb3MuZnVsbDtcbiAgICBjb25zdCBjaHVua0luZGV4ID0gaW5mb3MuY2h1bmtJbmRleDtcbiAgICBjb25zdCBob3AgPSBpbmZvcy5jaHVua0hvcDtcbiAgICBjb25zdCBzaXplID0gaW5mb3MuY2h1bmtTaXplO1xuICAgIGNvbnN0IGxlbmd0aCA9IGluZm9zLmxlbmd0aDtcblxuICAgIGxldCBlbmQgPSBjaHVua0luZGV4ICogaG9wICsgc2l6ZTtcblxuICAgIGlmIChlbmQgPiBsZW5ndGgpXG4gICAgICBlbmQgPSBlbmQgLSBsZW5ndGg7XG5cbiAgICBjb25zdCBzdGFydCA9IGVuZCAtIHNpemU7XG5cbiAgICBpZiAoIWZ1bGwgJiYgc3RhcnQgPCAwKVxuICAgICAgcmV0dXJuO1xuXG4gICAgaWYgKGVuZCA+IHByZXZQb2ludGVyICYmIGVuZCA8PSBjdXJyZW50UG9pbnRlcikge1xuICAgICAgdGhpcy5fZmluYWxpemVDaHVuayhpbmZvcywgc3RhcnQsIGVuZCk7XG4gICAgICBpbmZvcy5jaHVua0luZGV4ID0gKGluZm9zLmNodW5rSW5kZXggKyAxKSAlIGluZm9zLm51bUNodW5rcztcbiAgICB9XG4gIH1cblxuICBfcmVjb3JkQmxvY2soY2xpZW50KSB7XG4gICAgY29uc3QgdXVpZCA9IGNsaWVudC51dWlkO1xuXG4gICAgcmV0dXJuIChkYXRhKSA9PiB7XG4gICAgICBjb25zdCBpbmRleCA9IGRhdGFbMF07XG4gICAgICBjb25zdCBidWZmZXIgPSBkYXRhLnN1YmFycmF5KDEpO1xuICAgICAgY29uc3QgYnVmZmVySWQgPSBgJHt1dWlkfToke2luZGV4fWA7XG4gICAgICBjb25zdCBsZW5ndGggPSBidWZmZXIubGVuZ3RoO1xuICAgICAgY29uc3QgaW5mb3MgPSB0aGlzLmJ1ZmZlcnNbYnVmZmVySWRdO1xuICAgICAgY29uc3QgcHJldlBvaW50ZXIgPSBpbmZvcy5wb2ludGVyO1xuXG4gICAgICBjb25zdCBudW1MZWZ0ID0gaW5mb3MubGVuZ3RoIC0gaW5mb3MucG9pbnRlcjtcbiAgICAgIGNvbnN0IG51bUNvcHkgPSBNYXRoLm1pbihudW1MZWZ0LCBsZW5ndGgpO1xuICAgICAgY29uc3QgdG9Db3B5ID0gYnVmZmVyLnN1YmFycmF5KDAsIG51bUNvcHkpO1xuICAgICAgLy8gQHRvZG8gLSBoYW5kbGUgdGhlIGVuZCBvZiB0aGUgYnVmZmVyIHByb3Blcmx5XG4gICAgICBpbmZvcy5idWZmZXIuc2V0KHRvQ29weSwgaW5mb3MucG9pbnRlcik7XG4gICAgICBpbmZvcy5wb2ludGVyICs9IHRvQ29weS5sZW5ndGg7XG4gICAgICAvLyBjb25zb2xlLmxvZyhpbmZvcy5wb2ludGVyLCB0b0NvcHkubGVuZ3RoLCBpbmZvcy5sZW5ndGgpO1xuXG4gICAgICB0aGlzLl92ZXJpZnlDaHVuayhpbmZvcywgcHJldlBvaW50ZXIsIGluZm9zLnBvaW50ZXIpO1xuXG4gICAgICBpZiAoIWluZm9zLmN5Y2xpYyAmJiBpbmZvcy5wb2ludGVyID09PSBpbmZvcy5sZW5ndGgpXG4gICAgICAgIGNvbnNvbGUubG9nKCdlbmQgcmVjb3JkaW5nJyk7XG5cbiAgICAgIC8vIGlmIGN5Y2xpYyBidWZmZXIgLSByZWluaXQgcG9pbnRlciBhbmQgY29weSByZXN0IG9mIHRoZSBpbmNvbW1pbmcgYnVmZmVyXG4gICAgICBpZiAoaW5mb3MuY3ljbGljICYmIGluZm9zLnBvaW50ZXIgPT09IGluZm9zLmxlbmd0aCkge1xuICAgICAgICBpbmZvcy5mdWxsID0gdHJ1ZTtcbiAgICAgICAgaW5mb3MucG9pbnRlciA9IDA7XG5cbiAgICAgICAgaWYgKG51bUNvcHkgPCBsZW5ndGgpIHtcbiAgICAgICAgICBjb25zdCB0b0NvcHkgPSBidWZmZXIuc3ViYXJyYXkobnVtQ29weSk7XG4gICAgICAgICAgaW5mb3MuYnVmZmVyLnNldCh0b0NvcHksIDApO1xuICAgICAgICAgIGluZm9zLnBvaW50ZXIgKz0gdG9Db3B5Lmxlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX3ZlcmlmeUNodW5rKGluZm9zLCBwcmV2UG9pbnRlciwgaW5mb3MucG9pbnRlcik7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIFNoYXJlZFJlY29yZGVyKTtcblxuZXhwb3J0IGRlZmF1bHQgU2hhcmVkUmVjb3JkZXI7XG4iXX0=