'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

var _wavesAudio = require('waves-audio');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:shared-recorder';

// const filter = filename => true;

var SharedRecorder = function (_Service) {
  (0, _inherits3.default)(SharedRecorder, _Service);

  function SharedRecorder() {
    (0, _classCallCheck3.default)(this, SharedRecorder);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SharedRecorder.__proto__ || (0, _getPrototypeOf2.default)(SharedRecorder)).call(this, SERVICE_ID));

    var defaults = {
      recorder: false
    };

    _this.configure(defaults);

    _this._rawSocket = _this.require('raw-socket');
    _this._audioBufferManager = _this.require('audio-buffer-manager');
    _this._platfform = null;

    _this._gain = 1;

    _this._listeners = new _map2.default();
    _this._streams = {};
    _this._buffers = {};
    _this._bufferNames = [];

    _this._onAvailableFile = _this._onAvailableFile.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(SharedRecorder, [{
    key: 'configure',
    value: function configure(options) {
      if (options.recorder === true) {
        this._platfform = this.require('platform', {
          features: ['audio-input', 'web-audio']
        });
      }

      (0, _get3.default)(SharedRecorder.prototype.__proto__ || (0, _getPrototypeOf2.default)(SharedRecorder.prototype), 'configure', this).call(this, options);
    }
  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)(SharedRecorder.prototype.__proto__ || (0, _getPrototypeOf2.default)(SharedRecorder.prototype), 'start', this).call(this);

      this.receive('available-file', this._onAvailableFile);

      // @todo - implement a handshake to notify the server about who
      // is a consumer and who is a recorder.
      this.ready();
    }
  }, {
    key: 'setGain',
    value: function setGain(value) {
      this._gain = value;
    }

    /** Consumer interface */

    /**
     * Get notifications for new available files
     *
     * @param {String} name - Id of the buffer.
     * @param {Number} phase - If ring buffer, phase of the buffer.
     * @param {String} filename - Path of the file on the server.
     */

  }, {
    key: '_onAvailableFile',
    value: function _onAvailableFile(name, phase, filename) {
      var _this2 = this;

      var listener = this._listeners.get(name);

      if (listener) {
        var filter = listener.filter,
            callback = listener.callback;


        if (filter.length === 0 || filter.indexOf(phase) !== -1) {
          var description = (0, _defineProperty3.default)({}, name, (0, _defineProperty3.default)({}, phase, filename));

          this._audioBufferManager.loadFiles(description).then(function () {
            var audioBuffer = _this2._audioBufferManager.get(name, phase);
            callback(audioBuffer, phase);
          }).catch(function (err) {
            return console.error(err.stack);
          });
        }
      }
    }

    /**
     *
     *
     */

  }, {
    key: 'addListener',
    value: function addListener(name, filter, callback) {
      this._listeners.set(name, { filter: filter, callback: callback });
    }
  }, {
    key: 'removeListener',
    value: function removeListener(name) {
      this._listeners.delete(name);
    }

    /** Recorder interface */

  }, {
    key: '_getIndex',
    value: function _getIndex(name) {
      var index = this._bufferNames.indexOf(name);

      if (index === -1) {
        index = this._bufferNames.length;
        this._bufferNames[index] = name;
      }

      return index;
    }

    /**
     * @param {String} name - Name of the record buffer.
     * @param {Number} chunkDuration - Duration of each chunk in second.
     * @param {Number} chunkPeriod - Period between each chunk.
     * @param {Number} numChunks - Number of chunk in the recording.
     * @param {Boolean} cyclic - Define if ring buffer or not.
     */

  }, {
    key: 'createBuffer',
    value: function createBuffer(name, chunkDuration, chunkPeriod, numChunks) {
      var cyclic = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;

      // client specific index of the given name
      var index = this._getIndex(name);
      var infos = { index: index, name: name, chunkDuration: chunkDuration, chunkPeriod: chunkPeriod, numChunks: numChunks, cyclic: cyclic };
      var sampleRate = _wavesAudio.audioContext.sampleRate;
      var length = void 0;

      if (!cyclic) length = chunkPeriod * (numChunks - 1) + chunkDuration;else length = chunkPeriod * numChunks;

      infos.length = length * sampleRate;
      infos.sampleRate = sampleRate;

      // keep a local copy of the informations
      this._buffers[name] = infos;
      this.send('create-buffer', infos);
    }
  }, {
    key: 'startRecord',
    value: function startRecord(name) {
      var _this3 = this;

      var infos = this._buffers[name];
      var stream = this._streams[name];

      if (!infos) throw new Error('Cannot start non existing buffer: "' + name + '"');else if (stream) this._disconnectGraph(name);

      var index = infos.index;

      // if not cyclic to be able to stop the record
      if (infos.cyclic === false) infos.pointer = 0;

      // send start message (reinit buffer pointer)
      var msg = new Uint8Array(1);
      msg[0] = index;
      this._rawSocket.send('shared-recorder:start-record', msg);

      // start recording
      var bufferSize = 4096;
      var buffer = new Float32Array(bufferSize + 1);
      buffer[0] = index;

      navigator.getUserMedia({ audio: true }, function (stream) {
        var scriptProcessor = _wavesAudio.audioContext.createScriptProcessor(bufferSize, 1, 1);
        scriptProcessor.connect(_wavesAudio.audioContext.destination);
        scriptProcessor.onaudioprocess = function (e) {
          var data = e.inputBuffer.getChannelData(0);

          if (_this3._gain !== 1) {
            var gain = _this3._gain;
            var length = data.length;

            for (var i = 0; i < length; i++) {
              data[i] *= gain;
            }
          }

          buffer.set(data, 1);
          _this3._rawSocket.send('shared-recorder:new-block', buffer);

          // maintain a local pointer to trigger `stopRecord` at the end of the buffer
          if (infos.cyclic === false) {
            infos.pointer += bufferSize;

            if (infos.pointer >= infos.length) _this3._disconnectGraph(infos.name);
          }
        };

        var audioIn = _wavesAudio.audioContext.createMediaStreamSource(stream);
        audioIn.connect(scriptProcessor);

        _this3._streams[name] = { stream: stream, audioIn: audioIn, scriptProcessor: scriptProcessor };
      }, function (err) {
        console.error(err.stack);
      });
    }

    /**
     * @param {String} name - Name of the buffer.
     */

  }, {
    key: 'stopRecord',
    value: function stopRecord(name) {
      if (!this._streams[name]) return;

      // send stop message
      var index = this._getIndex(name);
      var msg = new Uint8Array(1);
      msg[0] = index;
      this._rawSocket.send('shared-recorder:stop-record', msg);

      this._disconnectGraph(name);
    }
  }, {
    key: '_disconnectGraph',
    value: function _disconnectGraph(name) {
      var _streams$name = this._streams[name],
          stream = _streams$name.stream,
          audioIn = _streams$name.audioIn,
          scriptProcessor = _streams$name.scriptProcessor;

      scriptProcessor.disconnect();
      audioIn.disconnect();

      stream.getTracks()[0].stop();
      delete this._streams[name];
    }
  }]);
  return SharedRecorder;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, SharedRecorder);

exports.default = SharedRecorder;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNoYXJlZFJlY29yZGVyLmpzIl0sIm5hbWVzIjpbIlNFUlZJQ0VfSUQiLCJTaGFyZWRSZWNvcmRlciIsImRlZmF1bHRzIiwicmVjb3JkZXIiLCJjb25maWd1cmUiLCJfcmF3U29ja2V0IiwicmVxdWlyZSIsIl9hdWRpb0J1ZmZlck1hbmFnZXIiLCJfcGxhdGZmb3JtIiwiX2dhaW4iLCJfbGlzdGVuZXJzIiwiX3N0cmVhbXMiLCJfYnVmZmVycyIsIl9idWZmZXJOYW1lcyIsIl9vbkF2YWlsYWJsZUZpbGUiLCJiaW5kIiwib3B0aW9ucyIsImZlYXR1cmVzIiwicmVjZWl2ZSIsInJlYWR5IiwidmFsdWUiLCJuYW1lIiwicGhhc2UiLCJmaWxlbmFtZSIsImxpc3RlbmVyIiwiZ2V0IiwiZmlsdGVyIiwiY2FsbGJhY2siLCJsZW5ndGgiLCJpbmRleE9mIiwiZGVzY3JpcHRpb24iLCJsb2FkRmlsZXMiLCJ0aGVuIiwiYXVkaW9CdWZmZXIiLCJjYXRjaCIsImVyciIsImNvbnNvbGUiLCJlcnJvciIsInN0YWNrIiwic2V0IiwiZGVsZXRlIiwiaW5kZXgiLCJjaHVua0R1cmF0aW9uIiwiY2h1bmtQZXJpb2QiLCJudW1DaHVua3MiLCJjeWNsaWMiLCJfZ2V0SW5kZXgiLCJpbmZvcyIsInNhbXBsZVJhdGUiLCJhdWRpb0NvbnRleHQiLCJzZW5kIiwic3RyZWFtIiwiRXJyb3IiLCJfZGlzY29ubmVjdEdyYXBoIiwicG9pbnRlciIsIm1zZyIsIlVpbnQ4QXJyYXkiLCJidWZmZXJTaXplIiwiYnVmZmVyIiwiRmxvYXQzMkFycmF5IiwibmF2aWdhdG9yIiwiZ2V0VXNlck1lZGlhIiwiYXVkaW8iLCJzY3JpcHRQcm9jZXNzb3IiLCJjcmVhdGVTY3JpcHRQcm9jZXNzb3IiLCJjb25uZWN0IiwiZGVzdGluYXRpb24iLCJvbmF1ZGlvcHJvY2VzcyIsImUiLCJkYXRhIiwiaW5wdXRCdWZmZXIiLCJnZXRDaGFubmVsRGF0YSIsImdhaW4iLCJpIiwiYXVkaW9JbiIsImNyZWF0ZU1lZGlhU3RyZWFtU291cmNlIiwiZGlzY29ubmVjdCIsImdldFRyYWNrcyIsInN0b3AiLCJTZXJ2aWNlIiwic2VydmljZU1hbmFnZXIiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQSxJQUFNQSxhQUFhLHlCQUFuQjs7QUFFQTs7SUFFTUMsYzs7O0FBQ0osNEJBQWM7QUFBQTs7QUFBQSxzSkFDTkQsVUFETTs7QUFHWixRQUFNRSxXQUFXO0FBQ2ZDLGdCQUFVO0FBREssS0FBakI7O0FBSUEsVUFBS0MsU0FBTCxDQUFlRixRQUFmOztBQUVBLFVBQUtHLFVBQUwsR0FBa0IsTUFBS0MsT0FBTCxDQUFhLFlBQWIsQ0FBbEI7QUFDQSxVQUFLQyxtQkFBTCxHQUEyQixNQUFLRCxPQUFMLENBQWEsc0JBQWIsQ0FBM0I7QUFDQSxVQUFLRSxVQUFMLEdBQWtCLElBQWxCOztBQUVBLFVBQUtDLEtBQUwsR0FBYSxDQUFiOztBQUVBLFVBQUtDLFVBQUwsR0FBa0IsbUJBQWxCO0FBQ0EsVUFBS0MsUUFBTCxHQUFnQixFQUFoQjtBQUNBLFVBQUtDLFFBQUwsR0FBZ0IsRUFBaEI7QUFDQSxVQUFLQyxZQUFMLEdBQW9CLEVBQXBCOztBQUVBLFVBQUtDLGdCQUFMLEdBQXdCLE1BQUtBLGdCQUFMLENBQXNCQyxJQUF0QixPQUF4QjtBQXBCWTtBQXFCYjs7Ozs4QkFFU0MsTyxFQUFTO0FBQ2pCLFVBQUlBLFFBQVFiLFFBQVIsS0FBcUIsSUFBekIsRUFBK0I7QUFDN0IsYUFBS0ssVUFBTCxHQUFrQixLQUFLRixPQUFMLENBQWEsVUFBYixFQUF5QjtBQUN6Q1csb0JBQVUsQ0FBQyxhQUFELEVBQWdCLFdBQWhCO0FBRCtCLFNBQXpCLENBQWxCO0FBR0Q7O0FBRUQsc0pBQWdCRCxPQUFoQjtBQUNEOzs7NEJBRU87QUFDTjs7QUFFQSxXQUFLRSxPQUFMLENBQWEsZ0JBQWIsRUFBK0IsS0FBS0osZ0JBQXBDOztBQUVBO0FBQ0E7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QWNVLElBQWQsQ0FEeEI7QUFBQSxVQUNiOEIsTUFEYSxpQkFDYkEsTUFEYTtBQUFBLFVBQ0x1QixPQURLLGlCQUNMQSxPQURLO0FBQUEsVUFDSVgsZUFESixpQkFDSUEsZUFESjs7QUFFckJBLHNCQUFnQmEsVUFBaEI7QUFDQUYsY0FBUUUsVUFBUjs7QUFFQXpCLGFBQU8wQixTQUFQLEdBQW1CLENBQW5CLEVBQXNCQyxJQUF0QjtBQUNBLGFBQU8sS0FBS25FLFFBQUwsQ0FBY1UsSUFBZCxDQUFQO0FBQ0Q7OztFQWxOMEIwRCxpQjs7QUFxTjdCQyx5QkFBZUMsUUFBZixDQUF3QmpGLFVBQXhCLEVBQW9DQyxjQUFwQzs7a0JBRWVBLGMiLCJmaWxlIjoiU2hhcmVkUmVjb3JkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IHsgYXVkaW9Db250ZXh0IH0gZnJvbSAnd2F2ZXMtYXVkaW8nO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6c2hhcmVkLXJlY29yZGVyJztcblxuLy8gY29uc3QgZmlsdGVyID0gZmlsZW5hbWUgPT4gdHJ1ZTtcblxuY2xhc3MgU2hhcmVkUmVjb3JkZXIgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIHJlY29yZGVyOiBmYWxzZSxcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuXG4gICAgdGhpcy5fcmF3U29ja2V0ID0gdGhpcy5yZXF1aXJlKCdyYXctc29ja2V0Jyk7XG4gICAgdGhpcy5fYXVkaW9CdWZmZXJNYW5hZ2VyID0gdGhpcy5yZXF1aXJlKCdhdWRpby1idWZmZXItbWFuYWdlcicpO1xuICAgIHRoaXMuX3BsYXRmZm9ybSA9IG51bGw7XG5cbiAgICB0aGlzLl9nYWluID0gMTtcblxuICAgIHRoaXMuX2xpc3RlbmVycyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLl9zdHJlYW1zID0ge307XG4gICAgdGhpcy5fYnVmZmVycyA9IHt9O1xuICAgIHRoaXMuX2J1ZmZlck5hbWVzID0gW107XG5cbiAgICB0aGlzLl9vbkF2YWlsYWJsZUZpbGUgPSB0aGlzLl9vbkF2YWlsYWJsZUZpbGUuYmluZCh0aGlzKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZShvcHRpb25zKSB7XG4gICAgaWYgKG9wdGlvbnMucmVjb3JkZXIgPT09IHRydWUpIHtcbiAgICAgIHRoaXMuX3BsYXRmZm9ybSA9IHRoaXMucmVxdWlyZSgncGxhdGZvcm0nLCB7XG4gICAgICAgIGZlYXR1cmVzOiBbJ2F1ZGlvLWlucHV0JywgJ3dlYi1hdWRpbyddLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgc3VwZXIuY29uZmlndXJlKG9wdGlvbnMpO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIHRoaXMucmVjZWl2ZSgnYXZhaWxhYmxlLWZpbGUnLCB0aGlzLl9vbkF2YWlsYWJsZUZpbGUpO1xuXG4gICAgLy8gQHRvZG8gLSBpbXBsZW1lbnQgYSBoYW5kc2hha2UgdG8gbm90aWZ5IHRoZSBzZXJ2ZXIgYWJvdXQgd2hvXG4gICAgLy8gaXMgYSBjb25zdW1lciBhbmQgd2hvIGlzIGEgcmVjb3JkZXIuXG4gICAgdGhpcy5yZWFkeSgpO1xuICB9XG5cbiAgc2V0R2Fpbih2YWx1ZSkge1xuICAgIHRoaXMuX2dhaW4gPSB2YWx1ZTtcbiAgfVxuXG4gIC8qKiBDb25zdW1lciBpbnRlcmZhY2UgKi9cblxuICAvKipcbiAgICogR2V0IG5vdGlmaWNhdGlvbnMgZm9yIG5ldyBhdmFpbGFibGUgZmlsZXNcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBJZCBvZiB0aGUgYnVmZmVyLlxuICAgKiBAcGFyYW0ge051bWJlcn0gcGhhc2UgLSBJZiByaW5nIGJ1ZmZlciwgcGhhc2Ugb2YgdGhlIGJ1ZmZlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGZpbGVuYW1lIC0gUGF0aCBvZiB0aGUgZmlsZSBvbiB0aGUgc2VydmVyLlxuICAgKi9cbiAgX29uQXZhaWxhYmxlRmlsZShuYW1lLCBwaGFzZSwgZmlsZW5hbWUpIHtcbiAgICBjb25zdCBsaXN0ZW5lciA9IHRoaXMuX2xpc3RlbmVycy5nZXQobmFtZSk7XG5cbiAgICBpZiAobGlzdGVuZXIpIHtcbiAgICAgIGNvbnN0IHsgZmlsdGVyLCBjYWxsYmFjayB9ID0gbGlzdGVuZXI7XG5cbiAgICAgIGlmIChmaWx0ZXIubGVuZ3RoID09PSAwIHx8wqBmaWx0ZXIuaW5kZXhPZihwaGFzZSkgIT09IC0xKSB7XG4gICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0geyBbbmFtZV06IHsgW3BoYXNlXTogZmlsZW5hbWUgfSB9O1xuXG4gICAgICAgIHRoaXMuX2F1ZGlvQnVmZmVyTWFuYWdlclxuICAgICAgICAgIC5sb2FkRmlsZXMoZGVzY3JpcHRpb24pXG4gICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgYXVkaW9CdWZmZXIgPSB0aGlzLl9hdWRpb0J1ZmZlck1hbmFnZXIuZ2V0KG5hbWUsIHBoYXNlKTtcbiAgICAgICAgICAgIGNhbGxiYWNrKGF1ZGlvQnVmZmVyLCBwaGFzZSk7XG4gICAgICAgICAgfSlcbiAgICAgICAgICAuY2F0Y2goKGVycikgPT4gY29uc29sZS5lcnJvcihlcnIuc3RhY2spKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICpcbiAgICpcbiAgICovXG4gIGFkZExpc3RlbmVyKG5hbWUsIGZpbHRlciwgY2FsbGJhY2spIHtcbiAgICB0aGlzLl9saXN0ZW5lcnMuc2V0KG5hbWUsIHsgZmlsdGVyLCBjYWxsYmFjayB9KTtcbiAgfVxuXG4gIHJlbW92ZUxpc3RlbmVyKG5hbWUpIHtcbiAgICB0aGlzLl9saXN0ZW5lcnMuZGVsZXRlKG5hbWUpO1xuICB9XG5cblxuICAvKiogUmVjb3JkZXIgaW50ZXJmYWNlICovXG5cbiAgX2dldEluZGV4KG5hbWUpIHtcbiAgICBsZXQgaW5kZXggPSB0aGlzLl9idWZmZXJOYW1lcy5pbmRleE9mKG5hbWUpO1xuXG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgaW5kZXggPSB0aGlzLl9idWZmZXJOYW1lcy5sZW5ndGg7XG4gICAgICB0aGlzLl9idWZmZXJOYW1lc1tpbmRleF0gPSBuYW1lO1xuICAgIH1cblxuICAgIHJldHVybiBpbmRleDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHJlY29yZCBidWZmZXIuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBjaHVua0R1cmF0aW9uIC0gRHVyYXRpb24gb2YgZWFjaCBjaHVuayBpbiBzZWNvbmQuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBjaHVua1BlcmlvZCAtIFBlcmlvZCBiZXR3ZWVuIGVhY2ggY2h1bmsuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBudW1DaHVua3MgLSBOdW1iZXIgb2YgY2h1bmsgaW4gdGhlIHJlY29yZGluZy5cbiAgICogQHBhcmFtIHtCb29sZWFufSBjeWNsaWMgLSBEZWZpbmUgaWYgcmluZyBidWZmZXIgb3Igbm90LlxuICAgKi9cbiAgY3JlYXRlQnVmZmVyKG5hbWUsIGNodW5rRHVyYXRpb24sIGNodW5rUGVyaW9kLCBudW1DaHVua3MsIGN5Y2xpYyA9IHRydWUpIHtcbiAgICAvLyBjbGllbnQgc3BlY2lmaWMgaW5kZXggb2YgdGhlIGdpdmVuIG5hbWVcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuX2dldEluZGV4KG5hbWUpO1xuICAgIGNvbnN0IGluZm9zID0geyBpbmRleCwgbmFtZSwgY2h1bmtEdXJhdGlvbiwgY2h1bmtQZXJpb2QsIG51bUNodW5rcywgY3ljbGljIH07XG4gICAgY29uc3Qgc2FtcGxlUmF0ZSA9IGF1ZGlvQ29udGV4dC5zYW1wbGVSYXRlO1xuICAgIGxldCBsZW5ndGg7XG5cbiAgICBpZiAoIWN5Y2xpYylcbiAgICAgIGxlbmd0aCA9IGNodW5rUGVyaW9kICogKG51bUNodW5rcyAtIDEpICsgY2h1bmtEdXJhdGlvbjtcbiAgICBlbHNlXG4gICAgICBsZW5ndGggPSBjaHVua1BlcmlvZCAqIG51bUNodW5rcztcblxuICAgIGluZm9zLmxlbmd0aCA9IGxlbmd0aCAqIHNhbXBsZVJhdGU7XG4gICAgaW5mb3Muc2FtcGxlUmF0ZSA9IHNhbXBsZVJhdGU7XG5cbiAgICAvLyBrZWVwIGEgbG9jYWwgY29weSBvZiB0aGUgaW5mb3JtYXRpb25zXG4gICAgdGhpcy5fYnVmZmVyc1tuYW1lXSA9IGluZm9zO1xuICAgIHRoaXMuc2VuZCgnY3JlYXRlLWJ1ZmZlcicsIGluZm9zKTtcbiAgfVxuXG4gIHN0YXJ0UmVjb3JkKG5hbWUpIHtcbiAgICBjb25zdCBpbmZvcyA9IHRoaXMuX2J1ZmZlcnNbbmFtZV07XG4gICAgY29uc3Qgc3RyZWFtID0gdGhpcy5fc3RyZWFtc1tuYW1lXTtcblxuICAgIGlmICghaW5mb3MpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCBzdGFydCBub24gZXhpc3RpbmcgYnVmZmVyOiBcIiR7bmFtZX1cImApO1xuICAgIGVsc2UgaWYgKHN0cmVhbSlcbiAgICAgIHRoaXMuX2Rpc2Nvbm5lY3RHcmFwaChuYW1lKTtcblxuICAgIGNvbnN0IGluZGV4ID0gaW5mb3MuaW5kZXg7XG5cbiAgICAvLyBpZiBub3QgY3ljbGljIHRvIGJlIGFibGUgdG8gc3RvcCB0aGUgcmVjb3JkXG4gICAgaWYgKGluZm9zLmN5Y2xpYyA9PT0gZmFsc2UpXG4gICAgICBpbmZvcy5wb2ludGVyID0gMDtcblxuICAgIC8vIHNlbmQgc3RhcnQgbWVzc2FnZSAocmVpbml0IGJ1ZmZlciBwb2ludGVyKVxuICAgIGNvbnN0IG1zZyA9IG5ldyBVaW50OEFycmF5KDEpO1xuICAgIG1zZ1swXSA9IGluZGV4O1xuICAgIHRoaXMuX3Jhd1NvY2tldC5zZW5kKCdzaGFyZWQtcmVjb3JkZXI6c3RhcnQtcmVjb3JkJywgbXNnKTtcblxuICAgIC8vIHN0YXJ0IHJlY29yZGluZ1xuICAgIGNvbnN0IGJ1ZmZlclNpemUgPSA0MDk2O1xuICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBGbG9hdDMyQXJyYXkoYnVmZmVyU2l6ZSArIDEpO1xuICAgIGJ1ZmZlclswXSA9IGluZGV4O1xuXG4gICAgbmF2aWdhdG9yLmdldFVzZXJNZWRpYSh7IGF1ZGlvOiB0cnVlIH0sIChzdHJlYW0pID0+IHtcbiAgICAgIGNvbnN0IHNjcmlwdFByb2Nlc3NvciA9IGF1ZGlvQ29udGV4dC5jcmVhdGVTY3JpcHRQcm9jZXNzb3IoYnVmZmVyU2l6ZSwgMSwgMSk7XG4gICAgICBzY3JpcHRQcm9jZXNzb3IuY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xuICAgICAgc2NyaXB0UHJvY2Vzc29yLm9uYXVkaW9wcm9jZXNzID0gKGUpID0+IHtcbiAgICAgICAgY29uc3QgZGF0YSA9IGUuaW5wdXRCdWZmZXIuZ2V0Q2hhbm5lbERhdGEoMCk7XG5cbiAgICAgICAgaWYgKHRoaXMuX2dhaW4gIT09IDEpIHtcbiAgICAgICAgICBjb25zdCBnYWluID0gdGhpcy5fZ2FpbjtcbiAgICAgICAgICBjb25zdCBsZW5ndGggPSBkYXRhLmxlbmd0aDtcblxuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspXG4gICAgICAgICAgICBkYXRhW2ldICo9IGdhaW47XG4gICAgICAgIH1cblxuICAgICAgICBidWZmZXIuc2V0KGRhdGEsIDEpO1xuICAgICAgICB0aGlzLl9yYXdTb2NrZXQuc2VuZCgnc2hhcmVkLXJlY29yZGVyOm5ldy1ibG9jaycsIGJ1ZmZlcik7XG5cbiAgICAgICAgLy8gbWFpbnRhaW4gYSBsb2NhbCBwb2ludGVyIHRvIHRyaWdnZXIgYHN0b3BSZWNvcmRgIGF0IHRoZSBlbmQgb2YgdGhlIGJ1ZmZlclxuICAgICAgICBpZiAoaW5mb3MuY3ljbGljID09PSBmYWxzZSkge1xuICAgICAgICAgIGluZm9zLnBvaW50ZXIgKz0gYnVmZmVyU2l6ZTtcblxuICAgICAgICAgIGlmIChpbmZvcy5wb2ludGVyID49IGluZm9zLmxlbmd0aClcbiAgICAgICAgICAgIHRoaXMuX2Rpc2Nvbm5lY3RHcmFwaChpbmZvcy5uYW1lKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBhdWRpb0luID0gYXVkaW9Db250ZXh0LmNyZWF0ZU1lZGlhU3RyZWFtU291cmNlKHN0cmVhbSk7XG4gICAgICBhdWRpb0luLmNvbm5lY3Qoc2NyaXB0UHJvY2Vzc29yKTtcblxuICAgICAgdGhpcy5fc3RyZWFtc1tuYW1lXSA9IHsgc3RyZWFtLCBhdWRpb0luLCBzY3JpcHRQcm9jZXNzb3IgfTtcbiAgICB9LCBmdW5jdGlvbihlcnIpIHsgY29uc29sZS5lcnJvcihlcnIuc3RhY2spOyB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIGJ1ZmZlci5cbiAgICovXG4gIHN0b3BSZWNvcmQobmFtZSkge1xuICAgIGlmICghdGhpcy5fc3RyZWFtc1tuYW1lXSkgcmV0dXJuO1xuXG4gICAgLy8gc2VuZCBzdG9wIG1lc3NhZ2VcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuX2dldEluZGV4KG5hbWUpO1xuICAgIGNvbnN0IG1zZyA9IG5ldyBVaW50OEFycmF5KDEpO1xuICAgIG1zZ1swXSA9IGluZGV4O1xuICAgIHRoaXMuX3Jhd1NvY2tldC5zZW5kKCdzaGFyZWQtcmVjb3JkZXI6c3RvcC1yZWNvcmQnLCBtc2cpO1xuXG4gICAgdGhpcy5fZGlzY29ubmVjdEdyYXBoKG5hbWUpO1xuICB9XG5cbiAgX2Rpc2Nvbm5lY3RHcmFwaChuYW1lKSB7XG4gICAgY29uc3QgeyBzdHJlYW0sIGF1ZGlvSW4sIHNjcmlwdFByb2Nlc3NvciB9ID0gdGhpcy5fc3RyZWFtc1tuYW1lXTtcbiAgICBzY3JpcHRQcm9jZXNzb3IuZGlzY29ubmVjdCgpO1xuICAgIGF1ZGlvSW4uZGlzY29ubmVjdCgpO1xuXG4gICAgc3RyZWFtLmdldFRyYWNrcygpWzBdLnN0b3AoKTtcbiAgICBkZWxldGUgdGhpcy5fc3RyZWFtc1tuYW1lXTtcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBTaGFyZWRSZWNvcmRlcik7XG5cbmV4cG9ydCBkZWZhdWx0IFNoYXJlZFJlY29yZGVyO1xuIl19