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
      };
    }
  }, {
    key: '_startRecord',
    value: function _startRecord(client) {
      var _this3 = this;

      return function (data) {
        console.log('start');
        var index = data[0];
        var infos = _this3._getBufferInfos(client, index);
        infos.pointer = 0;
        infos.chunkIndex = 0;
        infos.full = false;
      };
    }
  }, {
    key: '_stopRecord',
    value: function _stopRecord(client) {
      var _this4 = this;

      return function (data) {
        console.log('stop');
        var index = data[0];
        var infos = _this4._getBufferInfos(client, index);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNoYXJlZFJlY29yZGVyLmpzIl0sIm5hbWVzIjpbIlNFUlZJQ0VfSUQiLCJTaGFyZWRSZWNvcmRlciIsImRlZmF1bHRzIiwiZGlyZWN0b3J5IiwiYnVmZmVycyIsIl9yYXdTb2NrZXQiLCJyZXF1aXJlIiwicHJvdG9jb2wiLCJjaGFubmVsIiwidHlwZSIsInJlYWR5IiwiY2xpZW50IiwicmVjZWl2ZSIsIl9jcmVhdGVCdWZmZXIiLCJfc3RhcnRSZWNvcmQiLCJfc3RvcFJlY29yZCIsIl9yZWNvcmRCbG9jayIsImluZGV4IiwiYnVmZmVySWQiLCJ1dWlkIiwiaW5mb3MiLCJidWZmZXIiLCJGbG9hdDMyQXJyYXkiLCJsZW5ndGgiLCJjaHVua0hvcCIsImNodW5rUGVyaW9kIiwic2FtcGxlUmF0ZSIsImNodW5rU2l6ZSIsImNodW5rRHVyYXRpb24iLCJwb2ludGVyIiwiY2h1bmtJbmRleCIsImRhdGEiLCJjb25zb2xlIiwibG9nIiwiX2dldEJ1ZmZlckluZm9zIiwiZnVsbCIsInN0YXJ0IiwiX2ZpbmFsaXplQ2h1bmsiLCJlbmQiLCJuYW1lIiwiY2h1bmsiLCJzZXQiLCJzdWJhcnJheSIsImVuY29kZSIsImNoYW5uZWxEYXRhIiwidGhlbiIsImZpbGVuYW1lIiwiY2xpZW50UGF0aCIsImpvaW4iLCJzZXJ2ZXJQYXRoIiwicHJvY2VzcyIsImN3ZCIsInN0cmVhbSIsImNyZWF0ZVdyaXRlU3RyZWFtIiwib24iLCJfbm90aWZ5Q2h1bmsiLCJ3cml0ZSIsIkJ1ZmZlciIsInBhdGgiLCJicm9hZGNhc3QiLCJlbWl0IiwicHJldlBvaW50ZXIiLCJjdXJyZW50UG9pbnRlciIsImhvcCIsInNpemUiLCJudW1DaHVua3MiLCJudW1MZWZ0IiwibnVtQ29weSIsIk1hdGgiLCJtaW4iLCJ0b0NvcHkiLCJfdmVyaWZ5Q2h1bmsiLCJjeWNsaWMiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7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QUFNb0QsTUFBUCxJQUFpQnBELE1BQU1TLE9BQU4sS0FBa0JULE1BQU1HLE1BQTdDLEVBQ0VTLFFBQVFDLEdBQVIsQ0FBWSxlQUFaOztBQUVGO0FBQ0EsWUFBSWIsTUFBTW9ELE1BQU4sSUFBZ0JwRCxNQUFNUyxPQUFOLEtBQWtCVCxNQUFNRyxNQUE1QyxFQUFvRDtBQUNsREgsZ0JBQU1lLElBQU4sR0FBYSxJQUFiO0FBQ0FmLGdCQUFNUyxPQUFOLEdBQWdCLENBQWhCOztBQUVBLGNBQUlzQyxVQUFVNUMsTUFBZCxFQUFzQjtBQUNwQixnQkFBTStDLFVBQVNqRCxPQUFPcUIsUUFBUCxDQUFnQnlCLE9BQWhCLENBQWY7QUFDQS9DLGtCQUFNQyxNQUFOLENBQWFvQixHQUFiLENBQWlCNkIsT0FBakIsRUFBeUIsQ0FBekI7QUFDQWxELGtCQUFNUyxPQUFOLElBQWlCeUMsUUFBTy9DLE1BQXhCO0FBQ0Q7O0FBRUQsaUJBQUtnRCxZQUFMLENBQWtCbkQsS0FBbEIsRUFBeUJ5QyxXQUF6QixFQUFzQ3pDLE1BQU1TLE9BQTVDO0FBQ0Q7QUFDRixPQWxDRDtBQW1DRDs7Ozs7QUFHSCx5QkFBZTRDLFFBQWYsQ0FBd0J6RSxVQUF4QixFQUFvQ0MsY0FBcEM7O2tCQUVlQSxjIiwiZmlsZSI6IlNoYXJlZFJlY29yZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCB3YXZFbmNvZGVyIGZyb20gJ3dhdi1lbmNvZGVyJztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOnNoYXJlZC1yZWNvcmRlcic7XG5cblxuY2xhc3MgU2hhcmVkUmVjb3JkZXIgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGRpcmVjdG9yeTogJ3B1YmxpYydcbiAgICB9O1xuXG4gICAgdGhpcy5idWZmZXJzID0gbmV3IE1hcCgpO1xuICAgIC8vIHRoaXMuc3RhY2tzID0ge307XG5cbiAgICB0aGlzLl9yYXdTb2NrZXQgPSB0aGlzLnJlcXVpcmUoJ3Jhdy1zb2NrZXQnLCB7XG4gICAgICBwcm90b2NvbDogW1xuICAgICAgICB7IGNoYW5uZWw6ICdzaGFyZWQtcmVjb3JkZXI6c3RhcnQtcmVjb3JkJywgdHlwZTogJ1VpbnQ4JyB9LFxuICAgICAgICB7IGNoYW5uZWw6ICdzaGFyZWQtcmVjb3JkZXI6c3RvcC1yZWNvcmQnLCB0eXBlOiAnVWludDgnIH0sXG4gICAgICAgIHsgY2hhbm5lbDogJ3NoYXJlZC1yZWNvcmRlcjpuZXctYmxvY2snLCB0eXBlOiAnRmxvYXQzMicgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgdGhpcy5yZWFkeSgpO1xuICB9XG5cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICAvLyBwcm9kdWNlclxuICAgIC8vIEB0b2RvIC0gZGVmaW5lIGlmIHRoZSBjbGllbnQgaXMgYSBwcm9kdWNlciBpbiB0aGUgaGFuZHNoYWtlXG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ2NyZWF0ZS1idWZmZXInLCB0aGlzLl9jcmVhdGVCdWZmZXIoY2xpZW50KSk7XG5cbiAgICB0aGlzLl9yYXdTb2NrZXQucmVjZWl2ZShjbGllbnQsICdzaGFyZWQtcmVjb3JkZXI6c3RhcnQtcmVjb3JkJywgdGhpcy5fc3RhcnRSZWNvcmQoY2xpZW50KSk7XG4gICAgdGhpcy5fcmF3U29ja2V0LnJlY2VpdmUoY2xpZW50LCAnc2hhcmVkLXJlY29yZGVyOnN0b3AtcmVjb3JkJywgdGhpcy5fc3RvcFJlY29yZChjbGllbnQpKTtcbiAgICB0aGlzLl9yYXdTb2NrZXQucmVjZWl2ZShjbGllbnQsICdzaGFyZWQtcmVjb3JkZXI6bmV3LWJsb2NrJywgdGhpcy5fcmVjb3JkQmxvY2soY2xpZW50KSk7XG4gIH1cblxuICBkaXNjb25uZWN0KGNsaWVudCkge1xuXG4gIH1cblxuICAvLyByZW1vdmUgdGhhdC4uLlxuICBfZ2V0QnVmZmVySW5mb3MoY2xpZW50LCBpbmRleCkge1xuICAgIGNvbnN0IGJ1ZmZlcklkID0gYCR7Y2xpZW50LnV1aWR9OiR7aW5kZXh9YDtcbiAgICByZXR1cm4gdGhpcy5idWZmZXJzW2J1ZmZlcklkXTtcbiAgfVxuXG4gIF9jcmVhdGVCdWZmZXIoY2xpZW50KSB7XG4gICAgY29uc3QgdXVpZCA9IGNsaWVudC51dWlkO1xuXG4gICAgcmV0dXJuIChpbmZvcykgPT4ge1xuICAgICAgLy8gcHJlcGFyZSB0aGUgYnVmZmVyXG4gICAgICBpbmZvcy5idWZmZXIgPSBuZXcgRmxvYXQzMkFycmF5KGluZm9zLmxlbmd0aCk7XG4gICAgICBpbmZvcy5jaHVua0hvcCA9IGluZm9zLmNodW5rUGVyaW9kICogaW5mb3Muc2FtcGxlUmF0ZTsgLy8gcGVyaW9kIGluIHNhbXBsZXNcbiAgICAgIGluZm9zLmNodW5rU2l6ZSA9IGluZm9zLmNodW5rRHVyYXRpb24gKiBpbmZvcy5zYW1wbGVSYXRlO1xuICAgICAgLy8gaW5pdGlhbGl6ZSBwb2ludGVyc1xuICAgICAgaW5mb3MucG9pbnRlciA9IDA7XG4gICAgICBpbmZvcy5jaHVua0luZGV4ID0gMDtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGluZm9zLCBpbmZvcy5jaHVua1BlcmlvZCwgaW5mb3Muc2FtcGxlUmF0ZSk7XG5cbiAgICAgIGNvbnN0IGJ1ZmZlcklkID0gYCR7dXVpZH06JHtpbmZvcy5pbmRleH1gO1xuICAgICAgdGhpcy5idWZmZXJzW2J1ZmZlcklkXSA9IGluZm9zO1xuICAgIH07XG4gIH1cblxuICBfc3RhcnRSZWNvcmQoY2xpZW50KSB7XG4gICAgcmV0dXJuIChkYXRhKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnc3RhcnQnKTtcbiAgICAgIGNvbnN0IGluZGV4ID0gZGF0YVswXTtcbiAgICAgIGNvbnN0IGluZm9zID0gdGhpcy5fZ2V0QnVmZmVySW5mb3MoY2xpZW50LCBpbmRleCk7XG4gICAgICBpbmZvcy5wb2ludGVyID0gMDtcbiAgICAgIGluZm9zLmNodW5rSW5kZXggPSAwO1xuICAgICAgaW5mb3MuZnVsbCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIF9zdG9wUmVjb3JkKGNsaWVudCkge1xuICAgIHJldHVybiAoZGF0YSkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ3N0b3AnKTtcbiAgICAgIGNvbnN0IGluZGV4ID0gZGF0YVswXTtcbiAgICAgIGNvbnN0IGluZm9zID0gdGhpcy5fZ2V0QnVmZmVySW5mb3MoY2xpZW50LCBpbmRleCk7XG5cbiAgICAgIC8vIGZpbmFsaXplIGN1cnJlbnQgY2h1bmsgd2l0aCBhdmFpbGFibGUgZGF0YVxuICAgICAgY29uc3Qgc3RhcnQgPSBpbmZvcy5jaHVua0luZGV4ICogaW5mb3MuY2h1bmtIb3A7XG4gICAgICB0aGlzLl9maW5hbGl6ZUNodW5rKGluZm9zLCBzdGFydCwgaW5mb3MucG9pbnRlcik7XG4gICAgfVxuICB9XG5cbiAgX2ZpbmFsaXplQ2h1bmsoaW5mb3MsIHN0YXJ0LCBlbmQpIHtcbiAgICAvLyBjb25zdCBzdGFydFRpbWUgPSBzdGFydCAvIGluZm9zLnNhbXBsZVJhdGU7XG4gICAgLy8gY29uc3QgZW5kVGltZSA9IGVuZCAvIGluZm9zLnNhbXBsZVJhdGU7XG4gICAgLy8gY29uc29sZS5sb2coJ2ZpbmFsaXplQnVmZmVyJywgaW5mb3MubmFtZSwgaW5mb3MuY2h1bmtJbmRleCwgc3RhcnQsIHN0YXJ0VGltZSArICdzJywgZW5kLCBlbmRUaW1lICsgJ3MnKTtcblxuICAgIGNvbnN0IHsgbmFtZSwgY2h1bmtJbmRleCwgYnVmZmVyIH0gPSBpbmZvcztcbiAgICBsZXQgY2h1bms7XG5cbiAgICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgICBjaHVuayA9IG5ldyBGbG9hdDMyQXJyYXkoZW5kIC0gc3RhcnQpO1xuICAgICAgY2h1bmsuc2V0KGJ1ZmZlci5zdWJhcnJheShzdGFydCksIDApO1xuICAgICAgY2h1bmsuc2V0KGJ1ZmZlci5zdWJhcnJheSgwLCBlbmQpLCAtc3RhcnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjaHVuayA9IGJ1ZmZlci5zdWJhcnJheShzdGFydCwgZW5kKTtcbiAgICB9XG5cbiAgICB3YXZFbmNvZGVyLmVuY29kZSh7XG4gICAgICBzYW1wbGVSYXRlOiBpbmZvcy5zYW1wbGVSYXRlLFxuICAgICAgY2hhbm5lbERhdGE6IFtjaHVua10sXG4gICAgfSkudGhlbigoYnVmZmVyKSA9PiB7XG4gICAgICBjb25zdCBmaWxlbmFtZSA9IGAke2luZm9zLm5hbWV9LSR7Y2h1bmtJbmRleH0ud2F2YDtcbiAgICAgIC8vIEB0b2RvIC0gcmVtb3ZlIGhhcmQgY29kZWQgcGF0aFxuICAgICAgY29uc3QgY2xpZW50UGF0aCA9IHBhdGguam9pbignc291bmRzJywgZmlsZW5hbWUpO1xuICAgICAgY29uc3Qgc2VydmVyUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAncHVibGljJywgY2xpZW50UGF0aCk7XG4gICAgICAvLyB3cml0ZSBlbmNvZGVkIGJ1ZmZlciBpbnRvIGEgZmlsZVxuICAgICAgY29uc3Qgc3RyZWFtID0gZnMuY3JlYXRlV3JpdGVTdHJlYW0oc2VydmVyUGF0aCk7XG4gICAgICBzdHJlYW0ub24oJ2ZpbmlzaCcsICgpID0+IHRoaXMuX25vdGlmeUNodW5rKG5hbWUsIGNodW5rSW5kZXgsIGNsaWVudFBhdGgpKTtcbiAgICAgIHN0cmVhbS53cml0ZShuZXcgQnVmZmVyKGJ1ZmZlcikpO1xuICAgICAgc3RyZWFtLmVuZCgpO1xuICAgIH0pO1xuICB9XG5cbiAgX25vdGlmeUNodW5rKG5hbWUsIGNodW5rSW5kZXgsIHBhdGgpIHtcbiAgICAvLyBAdG9kbyAtIHNob3VsZCBzZW5kIG9ubHkgdG8gY29uc3VtZXJzIGNsaWVudCB0eXBlc1xuICAgIGNvbnNvbGUubG9nKGBub3RpZnkgXCIke25hbWV9XCIgLSBjaHVua0luZGV4OiAke2NodW5rSW5kZXh9IC0gJHtwYXRofWApO1xuICAgIHRoaXMuYnJvYWRjYXN0KG51bGwsIG51bGwsICdhdmFpbGFibGUtZmlsZScsIG5hbWUsIGNodW5rSW5kZXgsIHBhdGgpO1xuICAgIC8vIGVtaXQgZm9yIHNlcnZlciBzaWRlXG4gICAgdGhpcy5lbWl0KCdhdmFpbGFibGUtZmlsZScsIG5hbWUsIGNodW5rSW5kZXgsIHBhdGgpO1xuICB9XG5cbiAgLy8gQGZpeG1lIC0gdGhpcyBpbXBsZW1lbnRhdGlvbiBhc3N1bWUgdGhhdCB0aGUgYmxvY2sgc2l6ZSBjYW5ub3QgYmUgbGFyZ2VyXG4gIC8vIHRoYW4gdGhlIGhvcCBzaXplLCBjYW5ub3QgaGF2ZSBtdWx0aXBsZSBvdXRwdXQgY2h1bmsgaW4gb25lIGluY29tbWluZyBibG9ja1xuICBfdmVyaWZ5Q2h1bmsoaW5mb3MsIHByZXZQb2ludGVyLCBjdXJyZW50UG9pbnRlcikge1xuICAgIGNvbnN0IGZ1bGwgPSBpbmZvcy5mdWxsO1xuICAgIGNvbnN0IGNodW5rSW5kZXggPSBpbmZvcy5jaHVua0luZGV4O1xuICAgIGNvbnN0IGhvcCA9IGluZm9zLmNodW5rSG9wO1xuICAgIGNvbnN0IHNpemUgPSBpbmZvcy5jaHVua1NpemU7XG4gICAgY29uc3QgbGVuZ3RoID0gaW5mb3MubGVuZ3RoO1xuXG4gICAgbGV0IGVuZCA9IGNodW5rSW5kZXggKiBob3AgKyBzaXplO1xuXG4gICAgaWYgKGVuZCA+IGxlbmd0aClcbiAgICAgIGVuZCA9IGVuZCAtIGxlbmd0aDtcblxuICAgIGNvbnN0IHN0YXJ0ID0gZW5kIC0gc2l6ZTtcblxuICAgIGlmICghZnVsbCAmJiBzdGFydCA8IDApXG4gICAgICByZXR1cm47XG5cbiAgICBpZiAoZW5kID4gcHJldlBvaW50ZXIgJiYgZW5kIDw9IGN1cnJlbnRQb2ludGVyKSB7XG4gICAgICB0aGlzLl9maW5hbGl6ZUNodW5rKGluZm9zLCBzdGFydCwgZW5kKTtcbiAgICAgIGluZm9zLmNodW5rSW5kZXggPSAoaW5mb3MuY2h1bmtJbmRleCArIDEpICUgaW5mb3MubnVtQ2h1bmtzO1xuICAgIH1cbiAgfVxuXG4gIF9yZWNvcmRCbG9jayhjbGllbnQpIHtcbiAgICBjb25zdCB1dWlkID0gY2xpZW50LnV1aWQ7XG5cbiAgICByZXR1cm4gKGRhdGEpID0+IHtcbiAgICAgIGNvbnN0IGluZGV4ID0gZGF0YVswXTtcbiAgICAgIGNvbnN0IGJ1ZmZlciA9IGRhdGEuc3ViYXJyYXkoMSk7XG4gICAgICBjb25zdCBidWZmZXJJZCA9IGAke3V1aWR9OiR7aW5kZXh9YDtcbiAgICAgIGNvbnN0IGxlbmd0aCA9IGJ1ZmZlci5sZW5ndGg7XG4gICAgICBjb25zdCBpbmZvcyA9IHRoaXMuYnVmZmVyc1tidWZmZXJJZF07XG4gICAgICBjb25zdCBwcmV2UG9pbnRlciA9IGluZm9zLnBvaW50ZXI7XG5cbiAgICAgIGNvbnN0IG51bUxlZnQgPSBpbmZvcy5sZW5ndGggLSBpbmZvcy5wb2ludGVyO1xuICAgICAgY29uc3QgbnVtQ29weSA9IE1hdGgubWluKG51bUxlZnQsIGxlbmd0aCk7XG4gICAgICBjb25zdCB0b0NvcHkgPSBidWZmZXIuc3ViYXJyYXkoMCwgbnVtQ29weSk7XG4gICAgICAvLyBAdG9kbyAtIGhhbmRsZSB0aGUgZW5kIG9mIHRoZSBidWZmZXIgcHJvcGVybHlcbiAgICAgIGluZm9zLmJ1ZmZlci5zZXQodG9Db3B5LCBpbmZvcy5wb2ludGVyKTtcbiAgICAgIGluZm9zLnBvaW50ZXIgKz0gdG9Db3B5Lmxlbmd0aDtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGluZm9zLnBvaW50ZXIsIHRvQ29weS5sZW5ndGgsIGluZm9zLmxlbmd0aCk7XG5cbiAgICAgIHRoaXMuX3ZlcmlmeUNodW5rKGluZm9zLCBwcmV2UG9pbnRlciwgaW5mb3MucG9pbnRlcik7XG5cbiAgICAgIGlmICghaW5mb3MuY3ljbGljICYmIGluZm9zLnBvaW50ZXIgPT09IGluZm9zLmxlbmd0aClcbiAgICAgICAgY29uc29sZS5sb2coJ2VuZCByZWNvcmRpbmcnKTtcblxuICAgICAgLy8gaWYgY3ljbGljIGJ1ZmZlciAtIHJlaW5pdCBwb2ludGVyIGFuZCBjb3B5IHJlc3Qgb2YgdGhlIGluY29tbWluZyBidWZmZXJcbiAgICAgIGlmIChpbmZvcy5jeWNsaWMgJiYgaW5mb3MucG9pbnRlciA9PT0gaW5mb3MubGVuZ3RoKSB7XG4gICAgICAgIGluZm9zLmZ1bGwgPSB0cnVlO1xuICAgICAgICBpbmZvcy5wb2ludGVyID0gMDtcblxuICAgICAgICBpZiAobnVtQ29weSA8IGxlbmd0aCkge1xuICAgICAgICAgIGNvbnN0IHRvQ29weSA9IGJ1ZmZlci5zdWJhcnJheShudW1Db3B5KTtcbiAgICAgICAgICBpbmZvcy5idWZmZXIuc2V0KHRvQ29weSwgMCk7XG4gICAgICAgICAgaW5mb3MucG9pbnRlciArPSB0b0NvcHkubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fdmVyaWZ5Q2h1bmsoaW5mb3MsIHByZXZQb2ludGVyLCBpbmZvcy5wb2ludGVyKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgU2hhcmVkUmVjb3JkZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBTaGFyZWRSZWNvcmRlcjtcbiJdfQ==