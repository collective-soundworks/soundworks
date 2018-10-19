'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

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

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _wavesAudio = require('waves-audio');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:audio-stream-manager';
var log = (0, _debug2.default)('soundworks:services:audio-stream-manager');

// TODO:
// - support streaming of files of total duration shorter than packet duration

function loadAudioBuffer(url) {
  var promise = new _promise2.default(function (resolve, reject) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    request.onload = function () {
      var response = request.response;
      _wavesAudio.audioContext.decodeAudioData(response, resolve, reject);
    };

    request.send();
  });

  return promise;
}

/**
 * Interface for the client `'audio-stream-manager'` service.
 *
 * @warning - unstable
 *
 * This service allows to stream audio buffers to the client during the experience
 * (not preloaded). Input audio files are segmented by the server upon startup
 * and sent to the clients upon request. Service only accepts .wav files at the
 * moment. The service main objective is to 1) enable synced streaming between
 * clients (not precise if based on mediaElementSources), and 2) provide an
 * equivalent to the mediaElementSource object (streaming as a Web Audio API
 * node) that could be plugged to any other node in Safari (bypassing e.g. gain
 * or analyzer nodes when plugged to mediaElementSource).
 *
 * __*The service must be used with its [server-side counterpart]{@link module:soundworks/server.AudioStreamManager}*__
 *
 * @param {Object} options
 * @param {Number} options.monitorInterval - Interval time (in sec) at which the
 *  client will check if it has enough preloaded audio data to ensure streaming
 *  or if it needs to require some more.
 * @param {Number} options.requiredAdvanceThreshold - Threshold time (in sec) of
 *  preloaded audio data below which the client will require a new audio chunk.
 *
 * @memberof module:soundworks/client
 * @example
 * // require the `audio-stream-manager` (in experience constructor)
 * this.audioStreamManager = this.require('audio-stream-manager', {
 *   monitorInterval: 1,
 *   requiredAdvanceThreshold: 10
 * });
 *
 * // request new audio stream from the stream manager (in experience start method)
 * const audioStream = this.audioStreamManager.getAudioStream();
 * // setup and start audio stream
 * audioStream.url = 'my-audio-file-name'; // without extension
 * // connect as you would any audio node from the web audio api
 * audioStream.connect(audioContext.destination);
 * audioStream.loop = false; // disable loop
 * audioStream.sync = false; // disable synchronization
 * // mimics AudioBufferSourceNode onended method
 * audioStream.onended = function(){ console.log('stream ended'); };
 * audioStream.start(); // start audio stream
 */

var AudioStreamManager = function (_Service) {
  (0, _inherits3.default)(AudioStreamManager, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instantiated manually_ */
  function AudioStreamManager() {
    (0, _classCallCheck3.default)(this, AudioStreamManager);

    var _this = (0, _possibleConstructorReturn3.default)(this, (AudioStreamManager.__proto__ || (0, _getPrototypeOf2.default)(AudioStreamManager)).call(this, SERVICE_ID, false));

    console.error('[deprecated] AudioStreamManager unstable API is now deprecated - API will change in soundworks#v3.0.0, please consider updating your application');

    _this.bufferInfos = new _map2.default();
    // define general offset in sync loop (in sec) (not propagated to
    // already created audio streams when modified)
    _this.syncStartTime = 0;

    // configure options
    var defaults = {
      monitorInterval: 1, // in seconds
      requiredAdvanceThreshold: 10, // in seconds
      assetsDomain: null
    };

    _this.configure(defaults);

    _this.syncService = _this.require('sync');

    _this._onAcknowledgeResponse = _this._onAcknowledgeResponse.bind(_this);
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(AudioStreamManager, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      (0, _get3.default)(AudioStreamManager.prototype.__proto__ || (0, _getPrototypeOf2.default)(AudioStreamManager.prototype), 'start', this).call(this);
      // send request for infos on "streamable" audio files
      this.receive('acknowlegde', this._onAcknowledgeResponse);
      this.receive('syncStartTime', function (value) {
        return _this2.syncStartTime = value;
      });
      this.send('request');

      // @todo - should receive a sync start time from server
    }

    /**
     * @private
     * @param {Object} bufferInfos - info on audio files that can be streamed
     */

  }, {
    key: '_onAcknowledgeResponse',
    value: function _onAcknowledgeResponse(bufferInfos) {
      var _this3 = this;

      for (var id in bufferInfos) {
        bufferInfos[id].forEach(function (chunk) {
          if (_this3.options.assetsDomain !== null) chunk.url = _this3.options.assetsDomain + '/' + chunk.name;else chunk.url = chunk.name;
        });

        this.bufferInfos.set(id, bufferInfos[id]);
      }

      this.ready();
    }

    /**
     * Return a new audio stream node.
     */

  }, {
    key: 'getAudioStream',
    value: function getAudioStream() {
      // console.log(this.syncStartTime, this.syncService.getSyncTime());
      return new AudioStream(this.bufferInfos, this.syncService, this.options.monitorInterval, this.options.requiredAdvanceThreshold, this.syncStartTime);
    }
  }, {
    key: 'getStreamEngine',
    value: function getStreamEngine(url) {
      var engine = new StreamEngine({});

      return engine;
    }
  }]);
  return AudioStreamManager;
}(_Service3.default);

/**
 * An audio stream node, behaving as would a mediaElementSource node.
 *
 * @param {Object} bufferInfos - Map of streamable buffer chunks infos.
 * @param {Object} syncService - Soundworks sync service, used for sync mode.
 * @param {Number} monitorInterval - See AudioStreamManager's.
 * @param {Number} requiredAdvanceThreshold - See AudioStreamManager's.
 *
 * @memberof module:soundworks/client.AudioStreamManager
 */


var AudioStream = function () {
  /** _<span class="warning">__WARNING__</span> This class should never be instantiated manually_ */
  function AudioStream(bufferInfos, syncService, monitorInterval, requiredAdvanceThreshold, syncStartTime) {
    (0, _classCallCheck3.default)(this, AudioStream);

    // arguments
    this.bufferInfos = bufferInfos;
    this.syncService = syncService;
    this.monitorInterval = monitorInterval * 1000; // in ms
    this.requiredAdvanceThreshold = requiredAdvanceThreshold;
    this.syncStartTime = syncStartTime;

    // local attr.
    this._sync = false;
    this._loop = false;
    this._periodic = false;
    this._metaData = undefined;
    this._url = null;

    this.output = _wavesAudio.audioContext.createGain();

    // stream monitoring
    this._intervalId = undefined;
    this._queueEndTime = 0;
    this._srcMap = new _map2.default();
    this._stopRequired = false;

    this._reset();

    this._requestChunks = this._requestChunks.bind(this);
    this._onended = this._onended.bind(this);
  }

  /**
   * Init / reset local attributes (at stream creation and stop() ).
   * @private
   */


  (0, _createClass3.default)(AudioStream, [{
    key: '_reset',
    value: function _reset() {
      this._firstChunkNetworkLatencyOffset = undefined;
      this._currentChunkIndex = -1;
      this._firstPacketState = 0;
    }

    /**
     * Define url of audio file to stream, send meta data request to server concerning this file.
     *
     * @param {String} url - Requested file name, without extension
     */

  }, {
    key: 'connect',


    /**
     * Connect the stream to an audio node.
     *
     * @param {AudioNode} node - Audio node to connect to.
     */
    value: function connect(node) {
      this.output.connect(node);
    }

    /**
     * Method called when stream finished playing on its own (won't fire if loop
     * enabled).
     */

  }, {
    key: 'onended',
    value: function onended() {}

    /**
     * Method called when stream drops a packet (arrived too late).
     */

  }, {
    key: 'ondrop',
    value: function ondrop() {
      console.warn('audiostream: too long loading, discarding buffer');
    }

    /**
     * Method called when stream received a packet late, but not too much to drop
     * it (gap in audio).
     * @param {Number} time - delay time.
     */

  }, {
    key: 'onlate',
    value: function onlate(time) {}

    /**
     * Start streaming audio source.
     * @warning - offset doesn't seem to make sens when not loop and not periodic
     *
     * @param {Number} offset - time in buffer from which to start (in sec)
     */

  }, {
    key: 'start',
    value: function start() {
      var offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      if (this.isPlaying) {
        console.warn('[WARNING] - start() discarded, must stop first');
        return;
      }

      // check if we dispose of valid url to execute start
      if (this._url === null) {
        console.warn('[WARNING] - start() discarded, must define valid url first');
        return;
      }

      // we consider the stream started now
      this.isPlaying = true;

      var bufferInfo = this.bufferInfos.get(this._url);
      var duration = this.duration;

      if (this.sync) {
        var syncTime = this.syncService.getSyncTime();
        var startTime = this.syncStartTime;
        offset = syncTime - startTime + offset;
      }

      if (this.loop) offset = offset % duration;

      // this looks coherent for all combinations of `loop` and `sync`
      // console.log('offset', offset);
      // console.log('duration', duration);

      if (offset >= duration) {
        console.warn('[WARNING] - start() discarded, requested offset\n        (' + offset + ' sec) larger than file duration (' + duration + ' sec)');
        return;
      }

      // find index of the chunk corresponding to given offset
      var index = 0;
      var offsetInFirstChunk = 0;
      // console.log(bufferInfo, index, bufferInfo[index]);

      while (this._currentChunkIndex === -1 && index < bufferInfo.length) {
        var chunkInfos = bufferInfo[index];
        var start = chunkInfos.start;
        var end = start + chunkInfos.duration;

        if (offset >= start && offset < end) {
          this._currentChunkIndex = index;
          offsetInFirstChunk = offset - start;
        }

        index += 1;
      }

      // handle negative offset, pick first chunk. This can be usefull to start
      // synced stream while give them some delay to preload the first chunk
      if (this._currentChunkIndex === -1 && offset < 0) this._currentChunkIndex = 0;

      // console.log('AudioStream.start()', this._url, this._currentChunkIndex);
      this._stopRequired = false;
      this._queueEndTime = this.syncService.getSyncTime() - offsetInFirstChunk;

      // @important - never change the order of these 2 calls
      this._intervalId = setInterval(this._requestChunks, this.monitorInterval);
      this._requestChunks();
    }
  }, {
    key: '_onended',
    value: function _onended() {
      this.isPlaying = false;
      this.onended();
    }

    /**
     * Stop the audio stream. Mimics AudioBufferSourceNode stop() method. A stopped
     * audio stream can be started (no need to create a new one as required when
     * using an AudioBufferSourceNode).
     *
     * @param {Number} offset - offset time (in sec) from now at which
     *  the audio stream should stop playing.
     */

  }, {
    key: 'stop',
    value: function stop() {
      var _this4 = this;

      var offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      if (!this.isPlaying) {
        console.warn('[WARNING] - stop discarded, not started or already ended');
        return;
      }

      if (this._intervalId !== undefined) this._clearRequestChunks();

      this._stopRequired = true; // avoid playing buffer that are currently loading
      this._reset();

      var now = this.syncService.getSyncTime();
      var audioTime = _wavesAudio.audioContext.currentTime;
      var size = this._srcMap.size;
      var counter = 0;

      this._srcMap.forEach(function (src, startTime) {
        counter += 1;
        src.onended = null;

        // pick a source arbitrarily to trigger the `onended` event properly
        if (counter === size) src.onended = _this4._onended;

        if (startTime < now + offset || src.onended !== null) src.stop(audioTime + offset);else src.stop(audioTime);
      });

      this._srcMap.clear();
    }

    /**
     * Check if we have enough "local buffer time" for the audio stream,
     * request new buffer chunks otherwise.
     * @private
     */

  }, {
    key: '_requestChunks',
    value: function _requestChunks() {
      var _this5 = this;

      var bufferInfo = this.bufferInfos.get(this._url);
      var now = this.syncService.getSyncTime();

      // have to deal properly with

      var _loop = function _loop() {
        // in non sync mode, we want the start time to be delayed when the first
        // buffer is actually received, so we load it before requesting next ones
        if (_this5._firstPacketState === 1 && !_this5._sync) return {
            v: void 0
          };

        var chunkInfos = bufferInfo[_this5._currentChunkIndex];
        var chunkStartTime = _this5._queueEndTime - chunkInfos.overlapStart;
        var url = chunkInfos.url;

        // flag that first packet has been required and that we must await for its
        // arrival in unsync mode before asking for more, as the network delay
        // will define the `true` start time
        if (_this5._firstPacketState === 0 && !_this5._sync) _this5._firstPacketState = 1;

        // console.log('currentChunkIndex', this._currentChunkIndex);
        // console.log('timeAtQueueEnd', this._queueEndTime);
        // console.log('chunkStartTime', chunkStartTime);

        var currentChunkIndex = _this5._currentChunkIndex;

        _this5._currentChunkIndex += 1;
        _this5._queueEndTime += chunkInfos.duration;

        var isLastChunk = false;

        if (_this5._currentChunkIndex === bufferInfo.length) {
          if (_this5._loop) {
            _this5._currentChunkIndex = 0;
          } else {
            // has this method is called once outside the loop, it might append
            // that we finish the whole loading without actually having an
            // intervalId, maybe handle this more properly with reccursive
            // `setTimeout`s
            if (_this5._intervalId) _this5._clearRequestChunks();
            // but reset later as the last chunk still needs the current offsets
            isLastChunk = true;
          }
        }

        // load and add buffer to queue
        loadAudioBuffer(url).then(function (buffer) {
          if (_this5._stopRequired) return;

          // mark that first packet arrived and that we can ask for more
          if (_this5._firstPacketState === 1 && !_this5._sync) _this5._firstPacketState = 2;

          var overlapStart = chunkInfos.overlapStart,
              overlapEnd = chunkInfos.overlapEnd;

          _this5._addBufferToQueue(buffer, chunkStartTime, overlapStart, overlapEnd, isLastChunk);

          if (isLastChunk) _this5._reset();
        });

        if (isLastChunk) return 'break';
      };

      _loop2: while (this._queueEndTime - now <= this.requiredAdvanceThreshold) {
        var _ret = _loop();

        switch (_ret) {
          case 'break':
            break _loop2;

          default:
            if ((typeof _ret === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret)) === "object") return _ret.v;
        }
      }
    }

    /**
     * Stop looking for new chunks
     * @private
     */

  }, {
    key: '_clearRequestChunks',
    value: function _clearRequestChunks() {
      // console.log(`AudioStream._clearRequestChunks() ${this._url} - clearInterval`, this._intervalId);
      clearInterval(this._intervalId);
      this._intervalId = undefined;
    }

    /**
     * Add audio buffer to stream queue.
     *
     * @param {AudioBuffer} buffer - Audio buffer to add to playing queue.
     * @param {Number} startTime - Time at which audio buffer playing is due.
     * @param {Number} overlapStart - Duration (in sec) of the additional audio
     *  content added by the node-audio-slicer (on server side) at audio buffer's
     *  head (used in fade-in mechanism to avoid perceiving potential .mp3
     *  encoding artifacts introduced when buffer starts with non-zero value)
     * @param {Number} overlapEnd - Duration (in sec) of the additional audio
     *  content added at audio buffer's tail.
     * @private
     */

  }, {
    key: '_addBufferToQueue',
    value: function _addBufferToQueue(buffer, startTime, overlapStart, overlapEnd, isLastChunk) {
      var _this6 = this;

      // hard-code overlap fade-in and out in buffer
      var numSamplesFadeIn = Math.floor(overlapStart * buffer.sampleRate);
      var numSamplesFadeOut = Math.floor(overlapEnd * buffer.sampleRate);
      // loop over audio channels
      for (var channel = 0; channel < buffer.numberOfChannels; channel++) {
        var channelData = buffer.getChannelData(channel);

        // fade in
        for (var i = 0; i < numSamplesFadeIn; i++) {
          var gain = i / (numSamplesFadeIn - 1);
          channelData[i] = channelData[i] * gain;
        }

        // fade out
        for (var _i = channelData.length - numSamplesFadeOut; _i < channelData.length; _i++) {
          var _gain = (channelData.length - _i - 1) / (numSamplesFadeOut - 1);
          channelData[_i] = channelData[_i] * _gain;
        }
      }

      var syncTime = this.syncService.getSyncTime();
      var now = _wavesAudio.audioContext.currentTime;
      var offset = startTime - syncTime;

      // - in `non sync` scenario, we want to take in account the latency induced
      // by the loading of the first chunk. This latency must then be applied
      // to all subsequent chunks.
      // - in `sync` scenarios, we just let the logical start time and computed
      // offset do their job...
      // - in `periodic` scenarios we don't want to compensate for the loading time
      if (!this._sync && !this._periodic) {
        //
        if (this._firstChunkNetworkLatencyOffset === undefined) {
          this._firstChunkNetworkLatencyOffset = offset;
        }

        offset -= this._firstChunkNetworkLatencyOffset;
      }

      // if computed offset is smaller than duration
      if (-offset <= buffer.duration) {
        // create audio source
        var src = _wavesAudio.audioContext.createBufferSource();
        src.connect(this.output);
        src.buffer = buffer;

        if (offset < 0) {
          src.start(now, -offset);
          // the callback should be called after start
          this.onlate(-offset);
        } else {
          src.start(now + offset, 0);
        }

        // keep and clean reference to source
        this._srcMap.set(startTime, src);

        src.onended = function () {
          _this6._srcMap.delete(startTime);

          if (isLastChunk) _this6._onended();
        };
      } else {
        this.ondrop();
      }
    }
  }, {
    key: 'url',
    set: function set(filename) {
      if (this.isPlaying) {
        console.warn('[WARNING] - Cannot set url while playing');
        return;
      }

      // check if url corresponds to a streamable file
      if (this.bufferInfos.get(filename)) this._url = filename;else console.error('[ERROR] - ' + filename + ' url not in ' + this.bufferInfos + ' \n ### url discarded');
    },
    get: function get() {
      return this._url;
    }

    /**
     * Set/Get synchronized mode status. in non sync. mode, the stream audio
     * will start whenever the first audio buffer is downloaded. in sync. mode,
     * the stream audio will start (again whan the audio buffer is downloaded)
     * with an offset in the buffer, as if it started playing exactly when the
     * start() command was issued.
     *
     * @param {Bool} val - Enable / disable sync
     */

  }, {
    key: 'sync',
    set: function set(val) {
      if (this.isPlaying) {
        console.warn('[WARNING] - Cannot set sync while playing');
        return;
      }

      this._sync = val;
    },
    get: function get() {
      return this._sync;
    }

    /**
     * Set/Get loop mode. onended() method not called if loop enabled.
     * @param {Bool} val - enable / disable sync
     */

  }, {
    key: 'loop',
    set: function set(val) {
      if (this.isPlaying) {
        console.warn('[WARNING] - Cannot set loop while playing');
        return;
      }

      this._loop = val;
    },
    get: function get() {
      return this._loop;
    }

    /**
     * Set/Get periodic mode. we don't want the stream to be synchronized to
     * a common origin, but have them aligned on a grid. aka, we don't wan't to
     * compensate for the loading time, when starting with an offset.
     * @param {Bool} val - enable / disable periodic
     */

  }, {
    key: 'periodic',
    set: function set(val) {
      if (this.isPlaying) {
        console.warn('[WARNING] - Cannot set loop while playing');
        return;
      }

      this._periodic = val;
    },
    get: function get() {
      return this._periodic;
    }

    /**
     * Return the total duration (in secs) of the audio file currently streamed.
     */

  }, {
    key: 'duration',
    get: function get() {
      var bufferInfo = this.bufferInfos.get(this._url);
      var lastChunk = bufferInfo[bufferInfo.length - 1];
      var duration = lastChunk.start + lastChunk.duration;
      return duration;
    }
  }]);
  return AudioStream;
}();

_serviceManager2.default.register(SERVICE_ID, AudioStreamManager);
exports.default = AudioStreamManager;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1ZGlvU3RyZWFtTWFuYWdlci5qcyJdLCJuYW1lcyI6WyJTRVJWSUNFX0lEIiwibG9nIiwibG9hZEF1ZGlvQnVmZmVyIiwidXJsIiwicHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJyZXF1ZXN0IiwiWE1MSHR0cFJlcXVlc3QiLCJvcGVuIiwicmVzcG9uc2VUeXBlIiwib25sb2FkIiwicmVzcG9uc2UiLCJhdWRpb0NvbnRleHQiLCJkZWNvZGVBdWRpb0RhdGEiLCJzZW5kIiwiQXVkaW9TdHJlYW1NYW5hZ2VyIiwiY29uc29sZSIsImVycm9yIiwiYnVmZmVySW5mb3MiLCJzeW5jU3RhcnRUaW1lIiwiZGVmYXVsdHMiLCJtb25pdG9ySW50ZXJ2YWwiLCJyZXF1aXJlZEFkdmFuY2VUaHJlc2hvbGQiLCJhc3NldHNEb21haW4iLCJjb25maWd1cmUiLCJzeW5jU2VydmljZSIsInJlcXVpcmUiLCJfb25BY2tub3dsZWRnZVJlc3BvbnNlIiwiYmluZCIsInJlY2VpdmUiLCJ2YWx1ZSIsImlkIiwiZm9yRWFjaCIsIm9wdGlvbnMiLCJjaHVuayIsIm5hbWUiLCJzZXQiLCJyZWFkeSIsIkF1ZGlvU3RyZWFtIiwiZW5naW5lIiwiU3RyZWFtRW5naW5lIiwiU2VydmljZSIsIl9zeW5jIiwiX2xvb3AiLCJfcGVyaW9kaWMiLCJfbWV0YURhdGEiLCJ1bmRlZmluZWQiLCJfdXJsIiwib3V0cHV0IiwiY3JlYXRlR2FpbiIsIl9pbnRlcnZhbElkIiwiX3F1ZXVlRW5kVGltZSIsIl9zcmNNYXAiLCJfc3RvcFJlcXVpcmVkIiwiX3Jlc2V0IiwiX3JlcXVlc3RDaHVua3MiLCJfb25lbmRlZCIsIl9maXJzdENodW5rTmV0d29ya0xhdGVuY3lPZmZzZXQiLCJfY3VycmVudENodW5rSW5kZXgiLCJfZmlyc3RQYWNrZXRTdGF0ZSIsIm5vZGUiLCJjb25uZWN0Iiwid2FybiIsInRpbWUiLCJvZmZzZXQiLCJpc1BsYXlpbmciLCJidWZmZXJJbmZvIiwiZ2V0IiwiZHVyYXRpb24iLCJzeW5jIiwic3luY1RpbWUiLCJnZXRTeW5jVGltZSIsInN0YXJ0VGltZSIsImxvb3AiLCJpbmRleCIsIm9mZnNldEluRmlyc3RDaHVuayIsImxlbmd0aCIsImNodW5rSW5mb3MiLCJzdGFydCIsImVuZCIsInNldEludGVydmFsIiwib25lbmRlZCIsIl9jbGVhclJlcXVlc3RDaHVua3MiLCJub3ciLCJhdWRpb1RpbWUiLCJjdXJyZW50VGltZSIsInNpemUiLCJjb3VudGVyIiwic3JjIiwic3RvcCIsImNsZWFyIiwiY2h1bmtTdGFydFRpbWUiLCJvdmVybGFwU3RhcnQiLCJjdXJyZW50Q2h1bmtJbmRleCIsImlzTGFzdENodW5rIiwidGhlbiIsImJ1ZmZlciIsIm92ZXJsYXBFbmQiLCJfYWRkQnVmZmVyVG9RdWV1ZSIsImNsZWFySW50ZXJ2YWwiLCJudW1TYW1wbGVzRmFkZUluIiwiTWF0aCIsImZsb29yIiwic2FtcGxlUmF0ZSIsIm51bVNhbXBsZXNGYWRlT3V0IiwiY2hhbm5lbCIsIm51bWJlck9mQ2hhbm5lbHMiLCJjaGFubmVsRGF0YSIsImdldENoYW5uZWxEYXRhIiwiaSIsImdhaW4iLCJjcmVhdGVCdWZmZXJTb3VyY2UiLCJvbmxhdGUiLCJkZWxldGUiLCJvbmRyb3AiLCJmaWxlbmFtZSIsInZhbCIsImxhc3RDaHVuayIsInNlcnZpY2VNYW5hZ2VyIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxhQUFhLDhCQUFuQjtBQUNBLElBQU1DLE1BQU0scUJBQU0sMENBQU4sQ0FBWjs7QUFFQTtBQUNBOztBQUVBLFNBQVNDLGVBQVQsQ0FBeUJDLEdBQXpCLEVBQThCO0FBQzVCLE1BQU1DLFVBQVUsc0JBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQy9DLFFBQU1DLFVBQVUsSUFBSUMsY0FBSixFQUFoQjtBQUNBRCxZQUFRRSxJ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QWEsMkNBQWI7QUFDQTtBQUNEOztBQUVELFdBQUtwQixLQUFMLEdBQWEwRSxHQUFiO0FBQ0QsSzt3QkFFVTtBQUNULGFBQU8sS0FBSzFFLEtBQVo7QUFDRDs7QUFFRDs7Ozs7OztzQkFJUzBFLEcsRUFBSztBQUNaLFVBQUksS0FBS25ELFNBQVQsRUFBb0I7QUFDbEJqRCxnQkFBUThDLElBQVIsQ0FBYSwyQ0FBYjtBQUNBO0FBQ0Q7O0FBRUQsV0FBS25CLEtBQUwsR0FBYXlFLEdBQWI7QUFDRCxLO3dCQUVVO0FBQ1QsYUFBTyxLQUFLekUsS0FBWjtBQUNEOztBQUVEOzs7Ozs7Ozs7c0JBTWF5RSxHLEVBQUs7QUFDaEIsVUFBSSxLQUFLbkQsU0FBVCxFQUFvQjtBQUNsQmpELGdCQUFROEMsSUFBUixDQUFhLDJDQUFiO0FBQ0E7QUFDRDs7QUFFRCxXQUFLbEIsU0FBTCxHQUFpQndFLEdBQWpCO0FBQ0QsSzt3QkFFYztBQUNiLGFBQU8sS0FBS3hFLFNBQVo7QUFDRDs7QUFFRDs7Ozs7O3dCQUdlO0FBQ2IsVUFBTXNCLGFBQWEsS0FBS2hELFdBQUwsQ0FBaUJpRCxHQUFqQixDQUFxQixLQUFLcEIsSUFBMUIsQ0FBbkI7QUFDQSxVQUFNc0UsWUFBWW5ELFdBQVdBLFdBQVdVLE1BQVgsR0FBb0IsQ0FBL0IsQ0FBbEI7QUFDQSxVQUFNUixXQUFXaUQsVUFBVXZDLEtBQVYsR0FBa0J1QyxVQUFVakQsUUFBN0M7QUFDQSxhQUFPQSxRQUFQO0FBQ0Q7Ozs7O0FBbVVIa0QseUJBQWVDLFFBQWYsQ0FBd0J4SCxVQUF4QixFQUFvQ2dCLGtCQUFwQztrQkFDZUEsa0IiLCJmaWxlIjoiQXVkaW9TdHJlYW1NYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYXVkaW9Db250ZXh0IH0gZnJvbSAnd2F2ZXMtYXVkaW8nO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgZGVidWcgZnJvbSAnZGVidWcnO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOmF1ZGlvLXN0cmVhbS1tYW5hZ2VyJztcbmNvbnN0IGxvZyA9IGRlYnVnKCdzb3VuZHdvcmtzOnNlcnZpY2VzOmF1ZGlvLXN0cmVhbS1tYW5hZ2VyJyk7XG5cbi8vIFRPRE86XG4vLyAtIHN1cHBvcnQgc3RyZWFtaW5nIG9mIGZpbGVzIG9mIHRvdGFsIGR1cmF0aW9uIHNob3J0ZXIgdGhhbiBwYWNrZXQgZHVyYXRpb25cblxuZnVuY3Rpb24gbG9hZEF1ZGlvQnVmZmVyKHVybCkge1xuICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICByZXF1ZXN0Lm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XG4gICAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInO1xuXG4gICAgcmVxdWVzdC5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IHJlcXVlc3QucmVzcG9uc2U7XG4gICAgICBhdWRpb0NvbnRleHQuZGVjb2RlQXVkaW9EYXRhKHJlc3BvbnNlLCByZXNvbHZlLCByZWplY3QpO1xuICAgIH1cblxuICAgIHJlcXVlc3Quc2VuZCgpO1xuICB9KTtcblxuICByZXR1cm4gcHJvbWlzZTtcbn1cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBjbGllbnQgYCdhdWRpby1zdHJlYW0tbWFuYWdlcidgIHNlcnZpY2UuXG4gKlxuICogQHdhcm5pbmcgLSB1bnN0YWJsZVxuICpcbiAqIFRoaXMgc2VydmljZSBhbGxvd3MgdG8gc3RyZWFtIGF1ZGlvIGJ1ZmZlcnMgdG8gdGhlIGNsaWVudCBkdXJpbmcgdGhlIGV4cGVyaWVuY2VcbiAqIChub3QgcHJlbG9hZGVkKS4gSW5wdXQgYXVkaW8gZmlsZXMgYXJlIHNlZ21lbnRlZCBieSB0aGUgc2VydmVyIHVwb24gc3RhcnR1cFxuICogYW5kIHNlbnQgdG8gdGhlIGNsaWVudHMgdXBvbiByZXF1ZXN0LiBTZXJ2aWNlIG9ubHkgYWNjZXB0cyAud2F2IGZpbGVzIGF0IHRoZVxuICogbW9tZW50LiBUaGUgc2VydmljZSBtYWluIG9iamVjdGl2ZSBpcyB0byAxKSBlbmFibGUgc3luY2VkIHN0cmVhbWluZyBiZXR3ZWVuXG4gKiBjbGllbnRzIChub3QgcHJlY2lzZSBpZiBiYXNlZCBvbiBtZWRpYUVsZW1lbnRTb3VyY2VzKSwgYW5kIDIpIHByb3ZpZGUgYW5cbiAqIGVxdWl2YWxlbnQgdG8gdGhlIG1lZGlhRWxlbWVudFNvdXJjZSBvYmplY3QgKHN0cmVhbWluZyBhcyBhIFdlYiBBdWRpbyBBUElcbiAqIG5vZGUpIHRoYXQgY291bGQgYmUgcGx1Z2dlZCB0byBhbnkgb3RoZXIgbm9kZSBpbiBTYWZhcmkgKGJ5cGFzc2luZyBlLmcuIGdhaW5cbiAqIG9yIGFuYWx5emVyIG5vZGVzIHdoZW4gcGx1Z2dlZCB0byBtZWRpYUVsZW1lbnRTb3VyY2UpLlxuICpcbiAqIF9fKlRoZSBzZXJ2aWNlIG11c3QgYmUgdXNlZCB3aXRoIGl0cyBbc2VydmVyLXNpZGUgY291bnRlcnBhcnRde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5BdWRpb1N0cmVhbU1hbmFnZXJ9Kl9fXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7TnVtYmVyfSBvcHRpb25zLm1vbml0b3JJbnRlcnZhbCAtIEludGVydmFsIHRpbWUgKGluIHNlYykgYXQgd2hpY2ggdGhlXG4gKiAgY2xpZW50IHdpbGwgY2hlY2sgaWYgaXQgaGFzIGVub3VnaCBwcmVsb2FkZWQgYXVkaW8gZGF0YSB0byBlbnN1cmUgc3RyZWFtaW5nXG4gKiAgb3IgaWYgaXQgbmVlZHMgdG8gcmVxdWlyZSBzb21lIG1vcmUuXG4gKiBAcGFyYW0ge051bWJlcn0gb3B0aW9ucy5yZXF1aXJlZEFkdmFuY2VUaHJlc2hvbGQgLSBUaHJlc2hvbGQgdGltZSAoaW4gc2VjKSBvZlxuICogIHByZWxvYWRlZCBhdWRpbyBkYXRhIGJlbG93IHdoaWNoIHRoZSBjbGllbnQgd2lsbCByZXF1aXJlIGEgbmV3IGF1ZGlvIGNodW5rLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBleGFtcGxlXG4gKiAvLyByZXF1aXJlIHRoZSBgYXVkaW8tc3RyZWFtLW1hbmFnZXJgIChpbiBleHBlcmllbmNlIGNvbnN0cnVjdG9yKVxuICogdGhpcy5hdWRpb1N0cmVhbU1hbmFnZXIgPSB0aGlzLnJlcXVpcmUoJ2F1ZGlvLXN0cmVhbS1tYW5hZ2VyJywge1xuICogICBtb25pdG9ySW50ZXJ2YWw6IDEsXG4gKiAgIHJlcXVpcmVkQWR2YW5jZVRocmVzaG9sZDogMTBcbiAqIH0pO1xuICpcbiAqIC8vIHJlcXVlc3QgbmV3IGF1ZGlvIHN0cmVhbSBmcm9tIHRoZSBzdHJlYW0gbWFuYWdlciAoaW4gZXhwZXJpZW5jZSBzdGFydCBtZXRob2QpXG4gKiBjb25zdCBhdWRpb1N0cmVhbSA9IHRoaXMuYXVkaW9TdHJlYW1NYW5hZ2VyLmdldEF1ZGlvU3RyZWFtKCk7XG4gKiAvLyBzZXR1cCBhbmQgc3RhcnQgYXVkaW8gc3RyZWFtXG4gKiBhdWRpb1N0cmVhbS51cmwgPSAnbXktYXVkaW8tZmlsZS1uYW1lJzsgLy8gd2l0aG91dCBleHRlbnNpb25cbiAqIC8vIGNvbm5lY3QgYXMgeW91IHdvdWxkIGFueSBhdWRpbyBub2RlIGZyb20gdGhlIHdlYiBhdWRpbyBhcGlcbiAqIGF1ZGlvU3RyZWFtLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcbiAqIGF1ZGlvU3RyZWFtLmxvb3AgPSBmYWxzZTsgLy8gZGlzYWJsZSBsb29wXG4gKiBhdWRpb1N0cmVhbS5zeW5jID0gZmFsc2U7IC8vIGRpc2FibGUgc3luY2hyb25pemF0aW9uXG4gKiAvLyBtaW1pY3MgQXVkaW9CdWZmZXJTb3VyY2VOb2RlIG9uZW5kZWQgbWV0aG9kXG4gKiBhdWRpb1N0cmVhbS5vbmVuZGVkID0gZnVuY3Rpb24oKXsgY29uc29sZS5sb2coJ3N0cmVhbSBlbmRlZCcpOyB9O1xuICogYXVkaW9TdHJlYW0uc3RhcnQoKTsgLy8gc3RhcnQgYXVkaW8gc3RyZWFtXG4gKi9cblxuY2xhc3MgQXVkaW9TdHJlYW1NYW5hZ2VyIGV4dGVuZHMgU2VydmljZSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbnRpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgZmFsc2UpO1xuXG4gICAgY29uc29sZS5lcnJvcignW2RlcHJlY2F0ZWRdIEF1ZGlvU3RyZWFtTWFuYWdlciB1bnN0YWJsZSBBUEkgaXMgbm93IGRlcHJlY2F0ZWQgLSBBUEkgd2lsbCBjaGFuZ2UgaW4gc291bmR3b3JrcyN2My4wLjAsIHBsZWFzZSBjb25zaWRlciB1cGRhdGluZyB5b3VyIGFwcGxpY2F0aW9uJyk7XG5cbiAgICB0aGlzLmJ1ZmZlckluZm9zID0gbmV3IE1hcCgpO1xuICAgIC8vIGRlZmluZSBnZW5lcmFsIG9mZnNldCBpbiBzeW5jIGxvb3AgKGluIHNlYykgKG5vdCBwcm9wYWdhdGVkIHRvXG4gICAgLy8gYWxyZWFkeSBjcmVhdGVkIGF1ZGlvIHN0cmVhbXMgd2hlbiBtb2RpZmllZClcbiAgICB0aGlzLnN5bmNTdGFydFRpbWUgPSAwO1xuXG4gICAgLy8gY29uZmlndXJlIG9wdGlvbnNcbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIG1vbml0b3JJbnRlcnZhbDogMSwgLy8gaW4gc2Vjb25kc1xuICAgICAgcmVxdWlyZWRBZHZhbmNlVGhyZXNob2xkOiAxMCwgLy8gaW4gc2Vjb25kc1xuICAgICAgYXNzZXRzRG9tYWluOiBudWxsLFxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICB0aGlzLnN5bmNTZXJ2aWNlID0gdGhpcy5yZXF1aXJlKCdzeW5jJyk7XG5cbiAgICB0aGlzLl9vbkFja25vd2xlZGdlUmVzcG9uc2UgPSB0aGlzLl9vbkFja25vd2xlZGdlUmVzcG9uc2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuICAgIC8vIHNlbmQgcmVxdWVzdCBmb3IgaW5mb3Mgb24gXCJzdHJlYW1hYmxlXCIgYXVkaW8gZmlsZXNcbiAgICB0aGlzLnJlY2VpdmUoJ2Fja25vd2xlZ2RlJywgdGhpcy5fb25BY2tub3dsZWRnZVJlc3BvbnNlKTtcbiAgICB0aGlzLnJlY2VpdmUoJ3N5bmNTdGFydFRpbWUnLCB2YWx1ZSA9PiB0aGlzLnN5bmNTdGFydFRpbWUgPSB2YWx1ZSk7XG4gICAgdGhpcy5zZW5kKCdyZXF1ZXN0Jyk7XG5cbiAgICAvLyBAdG9kbyAtIHNob3VsZCByZWNlaXZlIGEgc3luYyBzdGFydCB0aW1lIGZyb20gc2VydmVyXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtPYmplY3R9IGJ1ZmZlckluZm9zIC0gaW5mbyBvbiBhdWRpbyBmaWxlcyB0aGF0IGNhbiBiZSBzdHJlYW1lZFxuICAgKi9cbiAgX29uQWNrbm93bGVkZ2VSZXNwb25zZShidWZmZXJJbmZvcykge1xuICAgIGZvciAobGV0IGlkIGluIGJ1ZmZlckluZm9zKSB7XG4gICAgICBidWZmZXJJbmZvc1tpZF0uZm9yRWFjaChjaHVuayA9PiB7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYXNzZXRzRG9tYWluICE9PSBudWxsKVxuICAgICAgICAgIGNodW5rLnVybCA9IHRoaXMub3B0aW9ucy5hc3NldHNEb21haW4gKyAnLycgKyBjaHVuay5uYW1lO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgY2h1bmsudXJsID0gY2h1bmsubmFtZTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmJ1ZmZlckluZm9zLnNldChpZCwgYnVmZmVySW5mb3NbaWRdKTtcbiAgICB9XG5cbiAgICB0aGlzLnJlYWR5KCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGEgbmV3IGF1ZGlvIHN0cmVhbSBub2RlLlxuICAgKi9cbiAgZ2V0QXVkaW9TdHJlYW0oKSB7XG4gICAgLy8gY29uc29sZS5sb2codGhpcy5zeW5jU3RhcnRUaW1lLCB0aGlzLnN5bmNTZXJ2aWNlLmdldFN5bmNUaW1lKCkpO1xuICAgIHJldHVybiBuZXcgQXVkaW9TdHJlYW0oXG4gICAgICB0aGlzLmJ1ZmZlckluZm9zLFxuICAgICAgdGhpcy5zeW5jU2VydmljZSxcbiAgICAgIHRoaXMub3B0aW9ucy5tb25pdG9ySW50ZXJ2YWwsXG4gICAgICB0aGlzLm9wdGlvbnMucmVxdWlyZWRBZHZhbmNlVGhyZXNob2xkLFxuICAgICAgdGhpcy5zeW5jU3RhcnRUaW1lXG4gICAgKTtcbiAgfVxuXG4gIGdldFN0cmVhbUVuZ2luZSh1cmwpIHtcbiAgICBjb25zdCBlbmdpbmUgPSBuZXcgU3RyZWFtRW5naW5lKHtcblxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGVuZ2luZTtcbiAgfVxufVxuXG4vKipcbiAqIEFuIGF1ZGlvIHN0cmVhbSBub2RlLCBiZWhhdmluZyBhcyB3b3VsZCBhIG1lZGlhRWxlbWVudFNvdXJjZSBub2RlLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBidWZmZXJJbmZvcyAtIE1hcCBvZiBzdHJlYW1hYmxlIGJ1ZmZlciBjaHVua3MgaW5mb3MuXG4gKiBAcGFyYW0ge09iamVjdH0gc3luY1NlcnZpY2UgLSBTb3VuZHdvcmtzIHN5bmMgc2VydmljZSwgdXNlZCBmb3Igc3luYyBtb2RlLlxuICogQHBhcmFtIHtOdW1iZXJ9IG1vbml0b3JJbnRlcnZhbCAtIFNlZSBBdWRpb1N0cmVhbU1hbmFnZXIncy5cbiAqIEBwYXJhbSB7TnVtYmVyfSByZXF1aXJlZEFkdmFuY2VUaHJlc2hvbGQgLSBTZWUgQXVkaW9TdHJlYW1NYW5hZ2VyJ3MuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BdWRpb1N0cmVhbU1hbmFnZXJcbiAqL1xuY2xhc3MgQXVkaW9TdHJlYW0ge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW50aWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKGJ1ZmZlckluZm9zLCBzeW5jU2VydmljZSwgbW9uaXRvckludGVydmFsLCByZXF1aXJlZEFkdmFuY2VUaHJlc2hvbGQsIHN5bmNTdGFydFRpbWUpIHtcbiAgICAvLyBhcmd1bWVudHNcbiAgICB0aGlzLmJ1ZmZlckluZm9zID0gYnVmZmVySW5mb3M7XG4gICAgdGhpcy5zeW5jU2VydmljZSA9IHN5bmNTZXJ2aWNlO1xuICAgIHRoaXMubW9uaXRvckludGVydmFsID0gbW9uaXRvckludGVydmFsICogMTAwMDsgLy8gaW4gbXNcbiAgICB0aGlzLnJlcXVpcmVkQWR2YW5jZVRocmVzaG9sZCA9IHJlcXVpcmVkQWR2YW5jZVRocmVzaG9sZDtcbiAgICB0aGlzLnN5bmNTdGFydFRpbWUgPSBzeW5jU3RhcnRUaW1lO1xuXG4gICAgLy8gbG9jYWwgYXR0ci5cbiAgICB0aGlzLl9zeW5jID0gZmFsc2U7XG4gICAgdGhpcy5fbG9vcCA9IGZhbHNlO1xuICAgIHRoaXMuX3BlcmlvZGljID0gZmFsc2U7XG4gICAgdGhpcy5fbWV0YURhdGEgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fdXJsID0gbnVsbDtcblxuICAgIHRoaXMub3V0cHV0ID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcblxuICAgIC8vIHN0cmVhbSBtb25pdG9yaW5nXG4gICAgdGhpcy5faW50ZXJ2YWxJZCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9xdWV1ZUVuZFRpbWUgPSAwO1xuICAgIHRoaXMuX3NyY01hcCA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLl9zdG9wUmVxdWlyZWQgPSBmYWxzZTtcblxuICAgIHRoaXMuX3Jlc2V0KCk7XG5cbiAgICB0aGlzLl9yZXF1ZXN0Q2h1bmtzID0gdGhpcy5fcmVxdWVzdENodW5rcy5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uZW5kZWQgPSB0aGlzLl9vbmVuZGVkLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogSW5pdCAvIHJlc2V0IGxvY2FsIGF0dHJpYnV0ZXMgKGF0IHN0cmVhbSBjcmVhdGlvbiBhbmQgc3RvcCgpICkuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfcmVzZXQoKSB7XG4gICAgdGhpcy5fZmlyc3RDaHVua05ldHdvcmtMYXRlbmN5T2Zmc2V0ID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX2N1cnJlbnRDaHVua0luZGV4ID0gLTE7XG4gICAgdGhpcy5fZmlyc3RQYWNrZXRTdGF0ZSA9IDA7XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lIHVybCBvZiBhdWRpbyBmaWxlIHRvIHN0cmVhbSwgc2VuZCBtZXRhIGRhdGEgcmVxdWVzdCB0byBzZXJ2ZXIgY29uY2VybmluZyB0aGlzIGZpbGUuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgLSBSZXF1ZXN0ZWQgZmlsZSBuYW1lLCB3aXRob3V0IGV4dGVuc2lvblxuICAgKi9cbiAgc2V0IHVybChmaWxlbmFtZSkge1xuICAgIGlmICh0aGlzLmlzUGxheWluZykge1xuICAgICAgY29uc29sZS53YXJuKCdbV0FSTklOR10gLSBDYW5ub3Qgc2V0IHVybCB3aGlsZSBwbGF5aW5nJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gY2hlY2sgaWYgdXJsIGNvcnJlc3BvbmRzIHRvIGEgc3RyZWFtYWJsZSBmaWxlXG4gICAgaWYgKHRoaXMuYnVmZmVySW5mb3MuZ2V0KGZpbGVuYW1lKSlcbiAgICAgIHRoaXMuX3VybCA9IGZpbGVuYW1lO1xuICAgIGVsc2VcbiAgICAgIGNvbnNvbGUuZXJyb3IoYFtFUlJPUl0gLSAke2ZpbGVuYW1lfSB1cmwgbm90IGluICR7dGhpcy5idWZmZXJJbmZvc30gXFxuICMjIyB1cmwgZGlzY2FyZGVkYCk7XG4gIH1cblxuICBnZXQgdXJsKCkge1xuICAgIHJldHVybiB0aGlzLl91cmw7XG4gIH1cblxuICAvKipcbiAgICogU2V0L0dldCBzeW5jaHJvbml6ZWQgbW9kZSBzdGF0dXMuIGluIG5vbiBzeW5jLiBtb2RlLCB0aGUgc3RyZWFtIGF1ZGlvXG4gICAqIHdpbGwgc3RhcnQgd2hlbmV2ZXIgdGhlIGZpcnN0IGF1ZGlvIGJ1ZmZlciBpcyBkb3dubG9hZGVkLiBpbiBzeW5jLiBtb2RlLFxuICAgKiB0aGUgc3RyZWFtIGF1ZGlvIHdpbGwgc3RhcnQgKGFnYWluIHdoYW4gdGhlIGF1ZGlvIGJ1ZmZlciBpcyBkb3dubG9hZGVkKVxuICAgKiB3aXRoIGFuIG9mZnNldCBpbiB0aGUgYnVmZmVyLCBhcyBpZiBpdCBzdGFydGVkIHBsYXlpbmcgZXhhY3RseSB3aGVuIHRoZVxuICAgKiBzdGFydCgpIGNvbW1hbmQgd2FzIGlzc3VlZC5cbiAgICpcbiAgICogQHBhcmFtIHtCb29sfSB2YWwgLSBFbmFibGUgLyBkaXNhYmxlIHN5bmNcbiAgICovXG4gIHNldCBzeW5jKHZhbCkge1xuICAgIGlmICh0aGlzLmlzUGxheWluZykge1xuICAgICAgY29uc29sZS53YXJuKCdbV0FSTklOR10gLSBDYW5ub3Qgc2V0IHN5bmMgd2hpbGUgcGxheWluZycpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX3N5bmMgPSB2YWw7XG4gIH1cblxuICBnZXQgc3luYygpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luYztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQvR2V0IGxvb3AgbW9kZS4gb25lbmRlZCgpIG1ldGhvZCBub3QgY2FsbGVkIGlmIGxvb3AgZW5hYmxlZC5cbiAgICogQHBhcmFtIHtCb29sfSB2YWwgLSBlbmFibGUgLyBkaXNhYmxlIHN5bmNcbiAgICovXG4gIHNldCBsb29wKHZhbCkge1xuICAgIGlmICh0aGlzLmlzUGxheWluZykge1xuICAgICAgY29uc29sZS53YXJuKCdbV0FSTklOR10gLSBDYW5ub3Qgc2V0IGxvb3Agd2hpbGUgcGxheWluZycpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2xvb3AgPSB2YWw7XG4gIH1cblxuICBnZXQgbG9vcCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbG9vcDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQvR2V0IHBlcmlvZGljIG1vZGUuIHdlIGRvbid0IHdhbnQgdGhlIHN0cmVhbSB0byBiZSBzeW5jaHJvbml6ZWQgdG9cbiAgICogYSBjb21tb24gb3JpZ2luLCBidXQgaGF2ZSB0aGVtIGFsaWduZWQgb24gYSBncmlkLiBha2EsIHdlIGRvbid0IHdhbid0IHRvXG4gICAqIGNvbXBlbnNhdGUgZm9yIHRoZSBsb2FkaW5nIHRpbWUsIHdoZW4gc3RhcnRpbmcgd2l0aCBhbiBvZmZzZXQuXG4gICAqIEBwYXJhbSB7Qm9vbH0gdmFsIC0gZW5hYmxlIC8gZGlzYWJsZSBwZXJpb2RpY1xuICAgKi9cbiAgc2V0IHBlcmlvZGljKHZhbCkge1xuICAgIGlmICh0aGlzLmlzUGxheWluZykge1xuICAgICAgY29uc29sZS53YXJuKCdbV0FSTklOR10gLSBDYW5ub3Qgc2V0IGxvb3Agd2hpbGUgcGxheWluZycpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX3BlcmlvZGljID0gdmFsO1xuICB9XG5cbiAgZ2V0IHBlcmlvZGljKCkge1xuICAgIHJldHVybiB0aGlzLl9wZXJpb2RpYztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHRvdGFsIGR1cmF0aW9uIChpbiBzZWNzKSBvZiB0aGUgYXVkaW8gZmlsZSBjdXJyZW50bHkgc3RyZWFtZWQuXG4gICAqL1xuICBnZXQgZHVyYXRpb24oKSB7XG4gICAgY29uc3QgYnVmZmVySW5mbyA9IHRoaXMuYnVmZmVySW5mb3MuZ2V0KHRoaXMuX3VybCk7XG4gICAgY29uc3QgbGFzdENodW5rID0gYnVmZmVySW5mb1tidWZmZXJJbmZvLmxlbmd0aCAtIDFdO1xuICAgIGNvbnN0IGR1cmF0aW9uID0gbGFzdENodW5rLnN0YXJ0ICsgbGFzdENodW5rLmR1cmF0aW9uO1xuICAgIHJldHVybiBkdXJhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25uZWN0IHRoZSBzdHJlYW0gdG8gYW4gYXVkaW8gbm9kZS5cbiAgICpcbiAgICogQHBhcmFtIHtBdWRpb05vZGV9IG5vZGUgLSBBdWRpbyBub2RlIHRvIGNvbm5lY3QgdG8uXG4gICAqL1xuICBjb25uZWN0KG5vZGUpIHtcbiAgICB0aGlzLm91dHB1dC5jb25uZWN0KG5vZGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ldGhvZCBjYWxsZWQgd2hlbiBzdHJlYW0gZmluaXNoZWQgcGxheWluZyBvbiBpdHMgb3duICh3b24ndCBmaXJlIGlmIGxvb3BcbiAgICogZW5hYmxlZCkuXG4gICAqL1xuICBvbmVuZGVkKCkge31cblxuICAvKipcbiAgICogTWV0aG9kIGNhbGxlZCB3aGVuIHN0cmVhbSBkcm9wcyBhIHBhY2tldCAoYXJyaXZlZCB0b28gbGF0ZSkuXG4gICAqL1xuICBvbmRyb3AoKSB7XG4gICAgY29uc29sZS53YXJuKCdhdWRpb3N0cmVhbTogdG9vIGxvbmcgbG9hZGluZywgZGlzY2FyZGluZyBidWZmZXInKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXRob2QgY2FsbGVkIHdoZW4gc3RyZWFtIHJlY2VpdmVkIGEgcGFja2V0IGxhdGUsIGJ1dCBub3QgdG9vIG11Y2ggdG8gZHJvcFxuICAgKiBpdCAoZ2FwIGluIGF1ZGlvKS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgLSBkZWxheSB0aW1lLlxuICAgKi9cbiAgb25sYXRlKHRpbWUpIHt9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHN0cmVhbWluZyBhdWRpbyBzb3VyY2UuXG4gICAqIEB3YXJuaW5nIC0gb2Zmc2V0IGRvZXNuJ3Qgc2VlbSB0byBtYWtlIHNlbnMgd2hlbiBub3QgbG9vcCBhbmQgbm90IHBlcmlvZGljXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBvZmZzZXQgLSB0aW1lIGluIGJ1ZmZlciBmcm9tIHdoaWNoIHRvIHN0YXJ0IChpbiBzZWMpXG4gICAqL1xuICBzdGFydChvZmZzZXQgPSAwKSB7XG4gICAgaWYgKHRoaXMuaXNQbGF5aW5nKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1tXQVJOSU5HXSAtIHN0YXJ0KCkgZGlzY2FyZGVkLCBtdXN0IHN0b3AgZmlyc3QnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBjaGVjayBpZiB3ZSBkaXNwb3NlIG9mIHZhbGlkIHVybCB0byBleGVjdXRlIHN0YXJ0XG4gICAgaWYgKHRoaXMuX3VybCA9PT0gbnVsbCkge1xuICAgICAgY29uc29sZS53YXJuKCdbV0FSTklOR10gLSBzdGFydCgpIGRpc2NhcmRlZCwgbXVzdCBkZWZpbmUgdmFsaWQgdXJsIGZpcnN0Jyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gd2UgY29uc2lkZXIgdGhlIHN0cmVhbSBzdGFydGVkIG5vd1xuICAgIHRoaXMuaXNQbGF5aW5nID0gdHJ1ZTtcblxuICAgIGNvbnN0IGJ1ZmZlckluZm8gPSB0aGlzLmJ1ZmZlckluZm9zLmdldCh0aGlzLl91cmwpO1xuICAgIGNvbnN0IGR1cmF0aW9uID0gdGhpcy5kdXJhdGlvbjtcblxuICAgIGlmICh0aGlzLnN5bmMpIHtcbiAgICAgIGNvbnN0IHN5bmNUaW1lID0gdGhpcy5zeW5jU2VydmljZS5nZXRTeW5jVGltZSgpO1xuICAgICAgY29uc3Qgc3RhcnRUaW1lID0gdGhpcy5zeW5jU3RhcnRUaW1lO1xuICAgICAgb2Zmc2V0ID0gc3luY1RpbWUgLSBzdGFydFRpbWUgKyBvZmZzZXQ7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubG9vcClcbiAgICAgIG9mZnNldCA9IG9mZnNldCAlIGR1cmF0aW9uO1xuXG4gICAgLy8gdGhpcyBsb29rcyBjb2hlcmVudCBmb3IgYWxsIGNvbWJpbmF0aW9ucyBvZiBgbG9vcGAgYW5kIGBzeW5jYFxuICAgIC8vIGNvbnNvbGUubG9nKCdvZmZzZXQnLCBvZmZzZXQpO1xuICAgIC8vIGNvbnNvbGUubG9nKCdkdXJhdGlvbicsIGR1cmF0aW9uKTtcblxuICAgIGlmIChvZmZzZXQgPj0gZHVyYXRpb24pIHtcbiAgICAgIGNvbnNvbGUud2FybihgW1dBUk5JTkddIC0gc3RhcnQoKSBkaXNjYXJkZWQsIHJlcXVlc3RlZCBvZmZzZXRcbiAgICAgICAgKCR7b2Zmc2V0fSBzZWMpIGxhcmdlciB0aGFuIGZpbGUgZHVyYXRpb24gKCR7ZHVyYXRpb259IHNlYylgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBmaW5kIGluZGV4IG9mIHRoZSBjaHVuayBjb3JyZXNwb25kaW5nIHRvIGdpdmVuIG9mZnNldFxuICAgIGxldCBpbmRleCA9IDA7XG4gICAgbGV0IG9mZnNldEluRmlyc3RDaHVuayA9IDA7XG4gICAgLy8gY29uc29sZS5sb2coYnVmZmVySW5mbywgaW5kZXgsIGJ1ZmZlckluZm9baW5kZXhdKTtcblxuICAgIHdoaWxlICh0aGlzLl9jdXJyZW50Q2h1bmtJbmRleCA9PT0gLTEgJiYgaW5kZXggPCBidWZmZXJJbmZvLmxlbmd0aCkge1xuICAgICAgY29uc3QgY2h1bmtJbmZvcyA9IGJ1ZmZlckluZm9baW5kZXhdO1xuICAgICAgY29uc3Qgc3RhcnQgPSBjaHVua0luZm9zLnN0YXJ0O1xuICAgICAgY29uc3QgZW5kID0gc3RhcnQgKyBjaHVua0luZm9zLmR1cmF0aW9uO1xuXG4gICAgICBpZiAob2Zmc2V0ID49IHN0YXJ0ICYmIG9mZnNldCA8IGVuZCkge1xuICAgICAgICB0aGlzLl9jdXJyZW50Q2h1bmtJbmRleCA9IGluZGV4O1xuICAgICAgICBvZmZzZXRJbkZpcnN0Q2h1bmsgPSBvZmZzZXQgLSBzdGFydDtcbiAgICAgIH1cblxuICAgICAgaW5kZXggKz0gMTtcbiAgICB9XG5cbiAgICAvLyBoYW5kbGUgbmVnYXRpdmUgb2Zmc2V0LCBwaWNrIGZpcnN0IGNodW5rLiBUaGlzIGNhbiBiZSB1c2VmdWxsIHRvIHN0YXJ0XG4gICAgLy8gc3luY2VkIHN0cmVhbSB3aGlsZSBnaXZlIHRoZW0gc29tZSBkZWxheSB0byBwcmVsb2FkIHRoZSBmaXJzdCBjaHVua1xuICAgIGlmICh0aGlzLl9jdXJyZW50Q2h1bmtJbmRleCA9PT0gLTEgJiYgb2Zmc2V0IDwgMClcbiAgICAgIHRoaXMuX2N1cnJlbnRDaHVua0luZGV4ID0gMDtcblxuICAgIC8vIGNvbnNvbGUubG9nKCdBdWRpb1N0cmVhbS5zdGFydCgpJywgdGhpcy5fdXJsLCB0aGlzLl9jdXJyZW50Q2h1bmtJbmRleCk7XG4gICAgdGhpcy5fc3RvcFJlcXVpcmVkID0gZmFsc2U7XG4gICAgdGhpcy5fcXVldWVFbmRUaW1lID0gdGhpcy5zeW5jU2VydmljZS5nZXRTeW5jVGltZSgpIC0gb2Zmc2V0SW5GaXJzdENodW5rO1xuXG4gICAgLy8gQGltcG9ydGFudCAtIG5ldmVyIGNoYW5nZSB0aGUgb3JkZXIgb2YgdGhlc2UgMiBjYWxsc1xuICAgIHRoaXMuX2ludGVydmFsSWQgPSBzZXRJbnRlcnZhbCh0aGlzLl9yZXF1ZXN0Q2h1bmtzLCB0aGlzLm1vbml0b3JJbnRlcnZhbCk7XG4gICAgdGhpcy5fcmVxdWVzdENodW5rcygpO1xuICB9XG5cbiAgX29uZW5kZWQoKSB7XG4gICAgdGhpcy5pc1BsYXlpbmcgPSBmYWxzZTtcbiAgICB0aGlzLm9uZW5kZWQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9wIHRoZSBhdWRpbyBzdHJlYW0uIE1pbWljcyBBdWRpb0J1ZmZlclNvdXJjZU5vZGUgc3RvcCgpIG1ldGhvZC4gQSBzdG9wcGVkXG4gICAqIGF1ZGlvIHN0cmVhbSBjYW4gYmUgc3RhcnRlZCAobm8gbmVlZCB0byBjcmVhdGUgYSBuZXcgb25lIGFzIHJlcXVpcmVkIHdoZW5cbiAgICogdXNpbmcgYW4gQXVkaW9CdWZmZXJTb3VyY2VOb2RlKS5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG9mZnNldCAtIG9mZnNldCB0aW1lIChpbiBzZWMpIGZyb20gbm93IGF0IHdoaWNoXG4gICAqICB0aGUgYXVkaW8gc3RyZWFtIHNob3VsZCBzdG9wIHBsYXlpbmcuXG4gICAqL1xuICBzdG9wKG9mZnNldCA9IDApIHtcbiAgICBpZiAoIXRoaXMuaXNQbGF5aW5nKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1tXQVJOSU5HXSAtIHN0b3AgZGlzY2FyZGVkLCBub3Qgc3RhcnRlZCBvciBhbHJlYWR5IGVuZGVkJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2ludGVydmFsSWQgIT09IHVuZGVmaW5lZClcbiAgICAgIHRoaXMuX2NsZWFyUmVxdWVzdENodW5rcygpO1xuXG5cbiAgICB0aGlzLl9zdG9wUmVxdWlyZWQgPSB0cnVlOyAvLyBhdm9pZCBwbGF5aW5nIGJ1ZmZlciB0aGF0IGFyZSBjdXJyZW50bHkgbG9hZGluZ1xuICAgIHRoaXMuX3Jlc2V0KCk7XG5cbiAgICBjb25zdCBub3cgPSB0aGlzLnN5bmNTZXJ2aWNlLmdldFN5bmNUaW1lKCk7XG4gICAgY29uc3QgYXVkaW9UaW1lID0gYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lO1xuICAgIGNvbnN0IHNpemUgPSB0aGlzLl9zcmNNYXAuc2l6ZTtcbiAgICBsZXQgY291bnRlciA9IDA7XG5cbiAgICB0aGlzLl9zcmNNYXAuZm9yRWFjaCgoc3JjLCBzdGFydFRpbWUpID0+IHtcbiAgICAgIGNvdW50ZXIgKz0gMTtcbiAgICAgIHNyYy5vbmVuZGVkID0gbnVsbDtcblxuICAgICAgLy8gcGljayBhIHNvdXJjZSBhcmJpdHJhcmlseSB0byB0cmlnZ2VyIHRoZSBgb25lbmRlZGAgZXZlbnQgcHJvcGVybHlcbiAgICAgIGlmIChjb3VudGVyID09PSBzaXplKVxuICAgICAgICBzcmMub25lbmRlZCA9IHRoaXMuX29uZW5kZWQ7XG5cbiAgICAgIGlmIChzdGFydFRpbWUgPCAobm93ICsgb2Zmc2V0KSB8fMKgc3JjLm9uZW5kZWQgIT09IG51bGwpXG4gICAgICAgIHNyYy5zdG9wKGF1ZGlvVGltZSArIG9mZnNldCk7XG4gICAgICBlbHNlXG4gICAgICAgIHNyYy5zdG9wKGF1ZGlvVGltZSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9zcmNNYXAuY2xlYXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB3ZSBoYXZlIGVub3VnaCBcImxvY2FsIGJ1ZmZlciB0aW1lXCIgZm9yIHRoZSBhdWRpbyBzdHJlYW0sXG4gICAqIHJlcXVlc3QgbmV3IGJ1ZmZlciBjaHVua3Mgb3RoZXJ3aXNlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3JlcXVlc3RDaHVua3MoKSB7XG4gICAgY29uc3QgYnVmZmVySW5mbyA9IHRoaXMuYnVmZmVySW5mb3MuZ2V0KHRoaXMuX3VybCk7XG4gICAgY29uc3Qgbm93ID0gdGhpcy5zeW5jU2VydmljZS5nZXRTeW5jVGltZSgpO1xuXG4gICAgLy8gaGF2ZSB0byBkZWFsIHByb3Blcmx5IHdpdGhcbiAgICB3aGlsZSAodGhpcy5fcXVldWVFbmRUaW1lIC0gbm93IDw9IHRoaXMucmVxdWlyZWRBZHZhbmNlVGhyZXNob2xkKSB7XG4gICAgICAvLyBpbiBub24gc3luYyBtb2RlLCB3ZSB3YW50IHRoZSBzdGFydCB0aW1lIHRvIGJlIGRlbGF5ZWQgd2hlbiB0aGUgZmlyc3RcbiAgICAgIC8vIGJ1ZmZlciBpcyBhY3R1YWxseSByZWNlaXZlZCwgc28gd2UgbG9hZCBpdCBiZWZvcmUgcmVxdWVzdGluZyBuZXh0IG9uZXNcbiAgICAgIGlmICh0aGlzLl9maXJzdFBhY2tldFN0YXRlID09PSAxICYmICF0aGlzLl9zeW5jKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIGNvbnN0IGNodW5rSW5mb3MgPSBidWZmZXJJbmZvW3RoaXMuX2N1cnJlbnRDaHVua0luZGV4XTtcbiAgICAgIGNvbnN0IGNodW5rU3RhcnRUaW1lID0gdGhpcy5fcXVldWVFbmRUaW1lIC0gY2h1bmtJbmZvcy5vdmVybGFwU3RhcnQ7XG4gICAgICBjb25zdCB1cmwgPSBjaHVua0luZm9zLnVybDtcblxuICAgICAgLy8gZmxhZyB0aGF0IGZpcnN0IHBhY2tldCBoYXMgYmVlbiByZXF1aXJlZCBhbmQgdGhhdCB3ZSBtdXN0IGF3YWl0IGZvciBpdHNcbiAgICAgIC8vIGFycml2YWwgaW4gdW5zeW5jIG1vZGUgYmVmb3JlIGFza2luZyBmb3IgbW9yZSwgYXMgdGhlIG5ldHdvcmsgZGVsYXlcbiAgICAgIC8vIHdpbGwgZGVmaW5lIHRoZSBgdHJ1ZWAgc3RhcnQgdGltZVxuICAgICAgaWYgKHRoaXMuX2ZpcnN0UGFja2V0U3RhdGUgPT09IDAgJiYgIXRoaXMuX3N5bmMpXG4gICAgICAgIHRoaXMuX2ZpcnN0UGFja2V0U3RhdGUgPSAxO1xuXG4gICAgICAvLyBjb25zb2xlLmxvZygnY3VycmVudENodW5rSW5kZXgnLCB0aGlzLl9jdXJyZW50Q2h1bmtJbmRleCk7XG4gICAgICAvLyBjb25zb2xlLmxvZygndGltZUF0UXVldWVFbmQnLCB0aGlzLl9xdWV1ZUVuZFRpbWUpO1xuICAgICAgLy8gY29uc29sZS5sb2coJ2NodW5rU3RhcnRUaW1lJywgY2h1bmtTdGFydFRpbWUpO1xuXG4gICAgICBjb25zdCBjdXJyZW50Q2h1bmtJbmRleCA9IHRoaXMuX2N1cnJlbnRDaHVua0luZGV4O1xuXG4gICAgICB0aGlzLl9jdXJyZW50Q2h1bmtJbmRleCArPSAxO1xuICAgICAgdGhpcy5fcXVldWVFbmRUaW1lICs9IGNodW5rSW5mb3MuZHVyYXRpb247XG5cbiAgICAgIGxldCBpc0xhc3RDaHVuayA9IGZhbHNlO1xuXG4gICAgICBpZiAodGhpcy5fY3VycmVudENodW5rSW5kZXggPT09IGJ1ZmZlckluZm8ubGVuZ3RoKSB7XG4gICAgICAgIGlmICh0aGlzLl9sb29wKSB7XG4gICAgICAgICAgdGhpcy5fY3VycmVudENodW5rSW5kZXggPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGhhcyB0aGlzIG1ldGhvZCBpcyBjYWxsZWQgb25jZSBvdXRzaWRlIHRoZSBsb29wLCBpdCBtaWdodCBhcHBlbmRcbiAgICAgICAgICAvLyB0aGF0IHdlIGZpbmlzaCB0aGUgd2hvbGUgbG9hZGluZyB3aXRob3V0IGFjdHVhbGx5IGhhdmluZyBhblxuICAgICAgICAgIC8vIGludGVydmFsSWQsIG1heWJlIGhhbmRsZSB0aGlzIG1vcmUgcHJvcGVybHkgd2l0aCByZWNjdXJzaXZlXG4gICAgICAgICAgLy8gYHNldFRpbWVvdXRgc1xuICAgICAgICAgIGlmICh0aGlzLl9pbnRlcnZhbElkKVxuICAgICAgICAgICAgdGhpcy5fY2xlYXJSZXF1ZXN0Q2h1bmtzKCk7XG4gICAgICAgICAgLy8gYnV0IHJlc2V0IGxhdGVyIGFzIHRoZSBsYXN0IGNodW5rIHN0aWxsIG5lZWRzIHRoZSBjdXJyZW50IG9mZnNldHNcbiAgICAgICAgICBpc0xhc3RDaHVuayA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gbG9hZCBhbmQgYWRkIGJ1ZmZlciB0byBxdWV1ZVxuICAgICAgbG9hZEF1ZGlvQnVmZmVyKHVybCkudGhlbigoYnVmZmVyKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLl9zdG9wUmVxdWlyZWQpXG4gICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIC8vIG1hcmsgdGhhdCBmaXJzdCBwYWNrZXQgYXJyaXZlZCBhbmQgdGhhdCB3ZSBjYW4gYXNrIGZvciBtb3JlXG4gICAgICAgIGlmICh0aGlzLl9maXJzdFBhY2tldFN0YXRlID09PSAxICYmICF0aGlzLl9zeW5jKVxuICAgICAgICAgIHRoaXMuX2ZpcnN0UGFja2V0U3RhdGUgPSAyO1xuXG4gICAgICAgIGNvbnN0IHsgb3ZlcmxhcFN0YXJ0LCBvdmVybGFwRW5kIH0gPSBjaHVua0luZm9zO1xuICAgICAgICB0aGlzLl9hZGRCdWZmZXJUb1F1ZXVlKGJ1ZmZlciwgY2h1bmtTdGFydFRpbWUsIG92ZXJsYXBTdGFydCwgb3ZlcmxhcEVuZCwgaXNMYXN0Q2h1bmspO1xuXG4gICAgICAgIGlmIChpc0xhc3RDaHVuaylcbiAgICAgICAgICB0aGlzLl9yZXNldCgpO1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChpc0xhc3RDaHVuaylcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFN0b3AgbG9va2luZyBmb3IgbmV3IGNodW5rc1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2NsZWFyUmVxdWVzdENodW5rcygpIHtcbiAgICAvLyBjb25zb2xlLmxvZyhgQXVkaW9TdHJlYW0uX2NsZWFyUmVxdWVzdENodW5rcygpICR7dGhpcy5fdXJsfSAtIGNsZWFySW50ZXJ2YWxgLCB0aGlzLl9pbnRlcnZhbElkKTtcbiAgICBjbGVhckludGVydmFsKHRoaXMuX2ludGVydmFsSWQpO1xuICAgIHRoaXMuX2ludGVydmFsSWQgPSB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGF1ZGlvIGJ1ZmZlciB0byBzdHJlYW0gcXVldWUuXG4gICAqXG4gICAqIEBwYXJhbSB7QXVkaW9CdWZmZXJ9IGJ1ZmZlciAtIEF1ZGlvIGJ1ZmZlciB0byBhZGQgdG8gcGxheWluZyBxdWV1ZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHN0YXJ0VGltZSAtIFRpbWUgYXQgd2hpY2ggYXVkaW8gYnVmZmVyIHBsYXlpbmcgaXMgZHVlLlxuICAgKiBAcGFyYW0ge051bWJlcn0gb3ZlcmxhcFN0YXJ0IC0gRHVyYXRpb24gKGluIHNlYykgb2YgdGhlIGFkZGl0aW9uYWwgYXVkaW9cbiAgICogIGNvbnRlbnQgYWRkZWQgYnkgdGhlIG5vZGUtYXVkaW8tc2xpY2VyIChvbiBzZXJ2ZXIgc2lkZSkgYXQgYXVkaW8gYnVmZmVyJ3NcbiAgICogIGhlYWQgKHVzZWQgaW4gZmFkZS1pbiBtZWNoYW5pc20gdG8gYXZvaWQgcGVyY2VpdmluZyBwb3RlbnRpYWwgLm1wM1xuICAgKiAgZW5jb2RpbmcgYXJ0aWZhY3RzIGludHJvZHVjZWQgd2hlbiBidWZmZXIgc3RhcnRzIHdpdGggbm9uLXplcm8gdmFsdWUpXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBvdmVybGFwRW5kIC0gRHVyYXRpb24gKGluIHNlYykgb2YgdGhlIGFkZGl0aW9uYWwgYXVkaW9cbiAgICogIGNvbnRlbnQgYWRkZWQgYXQgYXVkaW8gYnVmZmVyJ3MgdGFpbC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9hZGRCdWZmZXJUb1F1ZXVlKGJ1ZmZlciwgc3RhcnRUaW1lLCBvdmVybGFwU3RhcnQsIG92ZXJsYXBFbmQsIGlzTGFzdENodW5rKSB7XG4gICAgLy8gaGFyZC1jb2RlIG92ZXJsYXAgZmFkZS1pbiBhbmQgb3V0IGluIGJ1ZmZlclxuICAgIGNvbnN0IG51bVNhbXBsZXNGYWRlSW4gPSBNYXRoLmZsb29yKG92ZXJsYXBTdGFydCAqIGJ1ZmZlci5zYW1wbGVSYXRlKTtcbiAgICBjb25zdCBudW1TYW1wbGVzRmFkZU91dCA9IE1hdGguZmxvb3Iob3ZlcmxhcEVuZCAqIGJ1ZmZlci5zYW1wbGVSYXRlKTtcbiAgICAvLyBsb29wIG92ZXIgYXVkaW8gY2hhbm5lbHNcbiAgICBmb3IgKGxldCBjaGFubmVsID0gMDsgY2hhbm5lbCA8IGJ1ZmZlci5udW1iZXJPZkNoYW5uZWxzOyBjaGFubmVsKyspIHtcbiAgICAgIGNvbnN0IGNoYW5uZWxEYXRhID0gYnVmZmVyLmdldENoYW5uZWxEYXRhKGNoYW5uZWwpO1xuXG4gICAgICAvLyBmYWRlIGluXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVNhbXBsZXNGYWRlSW47IGkrKykge1xuICAgICAgICBjb25zdCBnYWluID0gaSAvIChudW1TYW1wbGVzRmFkZUluIC0gMSk7XG4gICAgICAgIGNoYW5uZWxEYXRhW2ldID0gY2hhbm5lbERhdGFbaV0gKiBnYWluO1xuICAgICAgfVxuXG4gICAgICAvLyBmYWRlIG91dFxuICAgICAgZm9yIChsZXQgaSA9IGNoYW5uZWxEYXRhLmxlbmd0aCAtIG51bVNhbXBsZXNGYWRlT3V0OyBpIDwgY2hhbm5lbERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgZ2FpbiA9IChjaGFubmVsRGF0YS5sZW5ndGggLSBpIC0gMSkgLyAobnVtU2FtcGxlc0ZhZGVPdXQgLSAxKTtcbiAgICAgICAgY2hhbm5lbERhdGFbaV0gPSBjaGFubmVsRGF0YVtpXSAqIGdhaW47XG4gICAgICB9XG4gICAgfVxuXG5cbiAgICBjb25zdCBzeW5jVGltZSA9IHRoaXMuc3luY1NlcnZpY2UuZ2V0U3luY1RpbWUoKTtcbiAgICBjb25zdCBub3cgPSBhdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG4gICAgbGV0IG9mZnNldCA9IHN0YXJ0VGltZSAtIHN5bmNUaW1lO1xuXG4gICAgLy8gLSBpbiBgbm9uIHN5bmNgIHNjZW5hcmlvLCB3ZSB3YW50IHRvIHRha2UgaW4gYWNjb3VudCB0aGUgbGF0ZW5jeSBpbmR1Y2VkXG4gICAgLy8gYnkgdGhlIGxvYWRpbmcgb2YgdGhlIGZpcnN0IGNodW5rLiBUaGlzIGxhdGVuY3kgbXVzdCB0aGVuIGJlIGFwcGxpZWRcbiAgICAvLyB0byBhbGwgc3Vic2VxdWVudCBjaHVua3MuXG4gICAgLy8gLSBpbiBgc3luY2Agc2NlbmFyaW9zLCB3ZSBqdXN0IGxldCB0aGUgbG9naWNhbCBzdGFydCB0aW1lIGFuZCBjb21wdXRlZFxuICAgIC8vIG9mZnNldCBkbyB0aGVpciBqb2IuLi5cbiAgICAvLyAtIGluIGBwZXJpb2RpY2Agc2NlbmFyaW9zIHdlIGRvbid0IHdhbnQgdG8gY29tcGVuc2F0ZSBmb3IgdGhlIGxvYWRpbmcgdGltZVxuICAgIGlmICghdGhpcy5fc3luYyAmJiAhdGhpcy5fcGVyaW9kaWMpIHtcbiAgICAgIC8vXG4gICAgICBpZiAodGhpcy5fZmlyc3RDaHVua05ldHdvcmtMYXRlbmN5T2Zmc2V0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5fZmlyc3RDaHVua05ldHdvcmtMYXRlbmN5T2Zmc2V0ID0gb2Zmc2V0O1xuICAgICAgfVxuXG4gICAgICBvZmZzZXQgLT0gdGhpcy5fZmlyc3RDaHVua05ldHdvcmtMYXRlbmN5T2Zmc2V0O1xuICAgIH1cblxuICAgIC8vIGlmIGNvbXB1dGVkIG9mZnNldCBpcyBzbWFsbGVyIHRoYW4gZHVyYXRpb25cbiAgICBpZiAoLW9mZnNldCA8PSBidWZmZXIuZHVyYXRpb24pIHtcbiAgICAgIC8vIGNyZWF0ZSBhdWRpbyBzb3VyY2VcbiAgICAgIGNvbnN0IHNyYyA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcbiAgICAgIHNyYy5jb25uZWN0KHRoaXMub3V0cHV0KTtcbiAgICAgIHNyYy5idWZmZXIgPSBidWZmZXI7XG5cbiAgICAgIGlmIChvZmZzZXQgPCAwKSB7XG4gICAgICAgIHNyYy5zdGFydChub3csIC1vZmZzZXQpO1xuICAgICAgICAvLyB0aGUgY2FsbGJhY2sgc2hvdWxkIGJlIGNhbGxlZCBhZnRlciBzdGFydFxuICAgICAgICB0aGlzLm9ubGF0ZSgtb2Zmc2V0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNyYy5zdGFydChub3cgKyBvZmZzZXQsIDApO1xuICAgICAgfVxuXG5cbiAgICAgIC8vIGtlZXAgYW5kIGNsZWFuIHJlZmVyZW5jZSB0byBzb3VyY2VcbiAgICAgIHRoaXMuX3NyY01hcC5zZXQoc3RhcnRUaW1lLCBzcmMpO1xuXG4gICAgICBzcmMub25lbmRlZCA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5fc3JjTWFwLmRlbGV0ZShzdGFydFRpbWUpO1xuXG4gICAgICAgIGlmIChpc0xhc3RDaHVuaylcbiAgICAgICAgICB0aGlzLl9vbmVuZGVkKCk7XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9uZHJvcCgpO1xuICAgIH1cbiAgfVxuXG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIEF1ZGlvU3RyZWFtTWFuYWdlcik7XG5leHBvcnQgZGVmYXVsdCBBdWRpb1N0cmVhbU1hbmFnZXI7XG4iXX0=