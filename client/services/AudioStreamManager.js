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

    _this.bufferInfos = new _map2.default();
    // define general offset in sync loop (in sec) (not propagated to
    // already created audio streams when modified)
    _this.syncStartTime = 0;

    // configure options
    var defaults = {
      monitorInterval: 1, // in seconds
      requiredAdvanceThreshold: 10, // in seconds
      assetsDomain: ''
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

      bufferInfos.forEach(function (item) {
        // @todo - this has to be reviewed, not robust
        var chunkPath = item[0].name;
        var dirname = _path2.default.dirname(chunkPath);
        var parts = dirname.split('/');
        var bufferId = parts.pop();

        item.forEach(function (chunk) {
          chunk.url = chunk.name.replace('public/', _this3.options.assetsDomain);
        });

        _this3.bufferInfos.set(bufferId, item);
      });

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1ZGlvU3RyZWFtTWFuYWdlci5qcyJdLCJuYW1lcyI6WyJTRVJWSUNFX0lEIiwibG9nIiwibG9hZEF1ZGlvQnVmZmVyIiwidXJsIiwicHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJyZXF1ZXN0IiwiWE1MSHR0cFJlcXVlc3QiLCJvcGVuIiwicmVzcG9uc2VUeXBlIiwib25sb2FkIiwicmVzcG9uc2UiLCJkZWNvZGVBdWRpb0RhdGEiLCJzZW5kIiwiQXVkaW9TdHJlYW1NYW5hZ2VyIiwiYnVmZmVySW5mb3MiLCJzeW5jU3RhcnRUaW1lIiwiZGVmYXVsdHMiLCJtb25pdG9ySW50ZXJ2YWwiLCJyZXF1aXJlZEFkdmFuY2VUaHJlc2hvbGQiLCJhc3NldHNEb21haW4iLCJjb25maWd1cmUiLCJzeW5jU2VydmljZSIsInJlcXVpcmUiLCJfb25BY2tub3dsZWRnZVJlc3BvbnNlIiwiYmluZCIsInJlY2VpdmUiLCJ2YWx1ZSIsImZvckVhY2giLCJpdGVtIiwiY2h1bmtQYXRoIiwibmFtZSIsImRpcm5hbWUiLCJwYXJ0cyIsInNwbGl0IiwiYnVmZmVySWQiLCJwb3AiLCJjaHVuayIsInJlcGxhY2UiLCJvcHRpb25zIiwic2V0IiwicmVhZHkiLCJBdWRpb1N0cmVhbSIsIl9zeW5jIiwiX2xvb3AiLCJfcGVyaW9kaWMiLCJfbWV0YURhdGEiLCJ1bmRlZmluZWQiLCJfdXJsIiwib3V0cHV0IiwiY3JlYXRlR2FpbiIsIl9pbnRlcnZhbElkIiwiX3F1ZXVlRW5kVGltZSIsIl9zcmNNYXAiLCJfc3RvcFJlcXVpcmVkIiwiX3Jlc2V0IiwiX3JlcXVlc3RDaHVua3MiLCJfb25lbmRlZCIsIl9maXJzdENodW5rTmV0d29ya0xhdGVuY3lPZmZzZXQiLCJfY3VycmVudENodW5rSW5kZXgiLCJfZmlyc3RQYWNrZXRTdGF0ZSIsIm5vZGUiLCJjb25uZWN0IiwiY29uc29sZSIsIndhcm4iLCJ0aW1lIiwib2Zmc2V0IiwiaXNQbGF5aW5nIiwiYnVmZmVySW5mbyIsImdldCIsImR1cmF0aW9uIiwic3luYyIsInN5bmNUaW1lIiwiZ2V0U3luY1RpbWUiLCJzdGFydFRpbWUiLCJsb29wIiwiaW5kZXgiLCJvZmZzZXRJbkZpcnN0Q2h1bmsiLCJsZW5ndGgiLCJjaHVua0luZm9zIiwic3RhcnQiLCJlbmQiLCJzZXRJbnRlcnZhbCIsIm9uZW5kZWQiLCJfY2xlYXJSZXF1ZXN0Q2h1bmtzIiwibm93IiwiYXVkaW9UaW1lIiwiY3VycmVudFRpbWUiLCJzaXplIiwiY291bnRlciIsInNyYyIsInN0b3AiLCJjbGVhciIsImNodW5rU3RhcnRUaW1lIiwib3ZlcmxhcFN0YXJ0IiwiY3VycmVudENodW5rSW5kZXgiLCJpc0xhc3RDaHVuayIsInRoZW4iLCJidWZmZXIiLCJvdmVybGFwRW5kIiwiX2FkZEJ1ZmZlclRvUXVldWUiLCJjbGVhckludGVydmFsIiwibnVtU2FtcGxlc0ZhZGVJbiIsIk1hdGgiLCJmbG9vciIsInNhbXBsZVJhdGUiLCJudW1TYW1wbGVzRmFkZU91dCIsImNoYW5uZWwiLCJudW1iZXJPZkNoYW5uZWxzIiwiY2hhbm5lbERhdGEiLCJnZXRDaGFubmVsRGF0YSIsImkiLCJnYWluIiwiY3JlYXRlQnVmZmVyU291cmNlIiwib25sYXRlIiwiZGVsZXRlIiwib25kcm9wIiwiZmlsZW5hbWUiLCJlcnJvciIsInZhbCIsImxhc3RDaHVuayIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsYUFBYSw4QkFBbkI7QUFDQSxJQUFNQyxNQUFNLHFCQUFNLDBDQUFOLENBQVo7O0FBRUE7QUFDQTs7QUFFQSxTQUFTQyxlQUFULENBQXlCQyxHQUF6QixFQUE4QjtBQUM1QixNQUFNQyxVQUFVLHNCQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUMvQyxRQUFNQyxVQUFVLElBQUlDLGNBQUosRUFBaEI7QUFDQUQsWUFBUUUs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S0FBSzVFLEtBQVo7QUFDRDs7QUFFRDs7Ozs7OztzQkFJUzRFLEcsRUFBSztBQUNaLFVBQUksS0FBS3BELFNBQVQsRUFBb0I7QUFDbEJKLGdCQUFRQyxJQUFSLENBQWEsMkNBQWI7QUFDQTtBQUNEOztBQUVELFdBQUtwQixLQUFMLEdBQWEyRSxHQUFiO0FBQ0QsSzt3QkFFVTtBQUNULGFBQU8sS0FBSzNFLEtBQVo7QUFDRDs7QUFFRDs7Ozs7Ozs7O3NCQU1hMkUsRyxFQUFLO0FBQ2hCLFVBQUksS0FBS3BELFNBQVQsRUFBb0I7QUFDbEJKLGdCQUFRQyxJQUFSLENBQWEsMkNBQWI7QUFDQTtBQUNEOztBQUVELFdBQUtuQixTQUFMLEdBQWlCMEUsR0FBakI7QUFDRCxLO3dCQUVjO0FBQ2IsYUFBTyxLQUFLMUUsU0FBWjtBQUNEOztBQUVEOzs7Ozs7d0JBR2U7QUFDYixVQUFNdUIsYUFBYSxLQUFLckQsV0FBTCxDQUFpQnNELEdBQWpCLENBQXFCLEtBQUtyQixJQUExQixDQUFuQjtBQUNBLFVBQU13RSxZQUFZcEQsV0FBV0EsV0FBV1UsTUFBWCxHQUFvQixDQUEvQixDQUFsQjtBQUNBLFVBQU1SLFdBQVdrRCxVQUFVeEMsS0FBVixHQUFrQndDLFVBQVVsRCxRQUE3QztBQUNBLGFBQU9BLFFBQVA7QUFDRDs7Ozs7QUFtVUgseUJBQWVtRCxRQUFmLENBQXdCMUgsVUFBeEIsRUFBb0NlLGtCQUFwQztrQkFDZUEsa0IiLCJmaWxlIjoiQXVkaW9TdHJlYW1NYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYXVkaW9Db250ZXh0IH0gZnJvbSAnd2F2ZXMtYXVkaW8nO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgZGVidWcgZnJvbSAnZGVidWcnO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOmF1ZGlvLXN0cmVhbS1tYW5hZ2VyJztcbmNvbnN0IGxvZyA9IGRlYnVnKCdzb3VuZHdvcmtzOnNlcnZpY2VzOmF1ZGlvLXN0cmVhbS1tYW5hZ2VyJyk7XG5cbi8vIFRPRE86XG4vLyAtIHN1cHBvcnQgc3RyZWFtaW5nIG9mIGZpbGVzIG9mIHRvdGFsIGR1cmF0aW9uIHNob3J0ZXIgdGhhbiBwYWNrZXQgZHVyYXRpb25cblxuZnVuY3Rpb24gbG9hZEF1ZGlvQnVmZmVyKHVybCkge1xuICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICByZXF1ZXN0Lm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XG4gICAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInO1xuXG4gICAgcmVxdWVzdC5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IHJlcXVlc3QucmVzcG9uc2U7XG4gICAgICBhdWRpb0NvbnRleHQuZGVjb2RlQXVkaW9EYXRhKHJlc3BvbnNlLCByZXNvbHZlLCByZWplY3QpO1xuICAgIH1cblxuICAgIHJlcXVlc3Quc2VuZCgpO1xuICB9KTtcblxuICByZXR1cm4gcHJvbWlzZTtcbn1cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBjbGllbnQgYCdhdWRpby1zdHJlYW0tbWFuYWdlcidgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIGFsbG93cyB0byBzdHJlYW0gYXVkaW8gYnVmZmVycyB0byB0aGUgY2xpZW50IGR1cmluZyB0aGUgZXhwZXJpZW5jZVxuICogKG5vdCBwcmVsb2FkZWQpLiBJbnB1dCBhdWRpbyBmaWxlcyBhcmUgc2VnbWVudGVkIGJ5IHRoZSBzZXJ2ZXIgdXBvbiBzdGFydHVwXG4gKiBhbmQgc2VudCB0byB0aGUgY2xpZW50cyB1cG9uIHJlcXVlc3QuIFNlcnZpY2Ugb25seSBhY2NlcHRzIC53YXYgZmlsZXMgYXQgdGhlXG4gKiBtb21lbnQuIFRoZSBzZXJ2aWNlIG1haW4gb2JqZWN0aXZlIGlzIHRvIDEpIGVuYWJsZSBzeW5jZWQgc3RyZWFtaW5nIGJldHdlZW5cbiAqIGNsaWVudHMgKG5vdCBwcmVjaXNlIGlmIGJhc2VkIG9uIG1lZGlhRWxlbWVudFNvdXJjZXMpLCBhbmQgMikgcHJvdmlkZSBhblxuICogZXF1aXZhbGVudCB0byB0aGUgbWVkaWFFbGVtZW50U291cmNlIG9iamVjdCAoc3RyZWFtaW5nIGFzIGEgV2ViIEF1ZGlvIEFQSVxuICogbm9kZSkgdGhhdCBjb3VsZCBiZSBwbHVnZ2VkIHRvIGFueSBvdGhlciBub2RlIGluIFNhZmFyaSAoYnlwYXNzaW5nIGUuZy4gZ2FpblxuICogb3IgYW5hbHl6ZXIgbm9kZXMgd2hlbiBwbHVnZ2VkIHRvIG1lZGlhRWxlbWVudFNvdXJjZSkuXG4gKlxuICogX18qVGhlIHNlcnZpY2UgbXVzdCBiZSB1c2VkIHdpdGggaXRzIFtzZXJ2ZXItc2lkZSBjb3VudGVycGFydF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLkF1ZGlvU3RyZWFtTWFuYWdlcn0qX19cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtOdW1iZXJ9IG9wdGlvbnMubW9uaXRvckludGVydmFsIC0gSW50ZXJ2YWwgdGltZSAoaW4gc2VjKSBhdCB3aGljaCB0aGVcbiAqICBjbGllbnQgd2lsbCBjaGVjayBpZiBpdCBoYXMgZW5vdWdoIHByZWxvYWRlZCBhdWRpbyBkYXRhIHRvIGVuc3VyZSBzdHJlYW1pbmdcbiAqICBvciBpZiBpdCBuZWVkcyB0byByZXF1aXJlIHNvbWUgbW9yZS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBvcHRpb25zLnJlcXVpcmVkQWR2YW5jZVRocmVzaG9sZCAtIFRocmVzaG9sZCB0aW1lIChpbiBzZWMpIG9mXG4gKiAgcHJlbG9hZGVkIGF1ZGlvIGRhdGEgYmVsb3cgd2hpY2ggdGhlIGNsaWVudCB3aWxsIHJlcXVpcmUgYSBuZXcgYXVkaW8gY2h1bmsuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQGV4YW1wbGVcbiAqIC8vIHJlcXVpcmUgdGhlIGBhdWRpby1zdHJlYW0tbWFuYWdlcmAgKGluIGV4cGVyaWVuY2UgY29uc3RydWN0b3IpXG4gKiB0aGlzLmF1ZGlvU3RyZWFtTWFuYWdlciA9IHRoaXMucmVxdWlyZSgnYXVkaW8tc3RyZWFtLW1hbmFnZXInLCB7XG4gKiAgIG1vbml0b3JJbnRlcnZhbDogMSxcbiAqICAgcmVxdWlyZWRBZHZhbmNlVGhyZXNob2xkOiAxMFxuICogfSk7XG4gKlxuICogLy8gcmVxdWVzdCBuZXcgYXVkaW8gc3RyZWFtIGZyb20gdGhlIHN0cmVhbSBtYW5hZ2VyIChpbiBleHBlcmllbmNlIHN0YXJ0IG1ldGhvZClcbiAqIGNvbnN0IGF1ZGlvU3RyZWFtID0gdGhpcy5hdWRpb1N0cmVhbU1hbmFnZXIuZ2V0QXVkaW9TdHJlYW0oKTtcbiAqIC8vIHNldHVwIGFuZCBzdGFydCBhdWRpbyBzdHJlYW1cbiAqIGF1ZGlvU3RyZWFtLnVybCA9ICdteS1hdWRpby1maWxlLW5hbWUnOyAvLyB3aXRob3V0IGV4dGVuc2lvblxuICogLy8gY29ubmVjdCBhcyB5b3Ugd291bGQgYW55IGF1ZGlvIG5vZGUgZnJvbSB0aGUgd2ViIGF1ZGlvIGFwaVxuICogYXVkaW9TdHJlYW0uY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xuICogYXVkaW9TdHJlYW0ubG9vcCA9IGZhbHNlOyAvLyBkaXNhYmxlIGxvb3BcbiAqIGF1ZGlvU3RyZWFtLnN5bmMgPSBmYWxzZTsgLy8gZGlzYWJsZSBzeW5jaHJvbml6YXRpb25cbiAqIC8vIG1pbWljcyBBdWRpb0J1ZmZlclNvdXJjZU5vZGUgb25lbmRlZCBtZXRob2RcbiAqIGF1ZGlvU3RyZWFtLm9uZW5kZWQgPSBmdW5jdGlvbigpeyBjb25zb2xlLmxvZygnc3RyZWFtIGVuZGVkJyk7IH07XG4gKiBhdWRpb1N0cmVhbS5zdGFydCgpOyAvLyBzdGFydCBhdWRpbyBzdHJlYW1cbiAqL1xuXG5jbGFzcyBBdWRpb1N0cmVhbU1hbmFnZXIgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgLyoqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmUgaW5zdGFudGlhdGVkIG1hbnVhbGx5XyAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCBmYWxzZSk7XG5cbiAgICB0aGlzLmJ1ZmZlckluZm9zID0gbmV3IE1hcCgpO1xuICAgIC8vIGRlZmluZSBnZW5lcmFsIG9mZnNldCBpbiBzeW5jIGxvb3AgKGluIHNlYykgKG5vdCBwcm9wYWdhdGVkIHRvXG4gICAgLy8gYWxyZWFkeSBjcmVhdGVkIGF1ZGlvIHN0cmVhbXMgd2hlbiBtb2RpZmllZClcbiAgICB0aGlzLnN5bmNTdGFydFRpbWUgPSAwO1xuXG4gICAgLy8gY29uZmlndXJlIG9wdGlvbnNcbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIG1vbml0b3JJbnRlcnZhbDogMSwgLy8gaW4gc2Vjb25kc1xuICAgICAgcmVxdWlyZWRBZHZhbmNlVGhyZXNob2xkOiAxMCwgLy8gaW4gc2Vjb25kc1xuICAgICAgYXNzZXRzRG9tYWluOiAnJyxcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuXG4gICAgdGhpcy5zeW5jU2VydmljZSA9IHRoaXMucmVxdWlyZSgnc3luYycpO1xuXG4gICAgdGhpcy5fb25BY2tub3dsZWRnZVJlc3BvbnNlID0gdGhpcy5fb25BY2tub3dsZWRnZVJlc3BvbnNlLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgICAvLyBzZW5kIHJlcXVlc3QgZm9yIGluZm9zIG9uIFwic3RyZWFtYWJsZVwiIGF1ZGlvIGZpbGVzXG4gICAgdGhpcy5yZWNlaXZlKCdhY2tub3dsZWdkZScsIHRoaXMuX29uQWNrbm93bGVkZ2VSZXNwb25zZSk7XG4gICAgdGhpcy5yZWNlaXZlKCdzeW5jU3RhcnRUaW1lJywgdmFsdWUgPT4gdGhpcy5zeW5jU3RhcnRUaW1lID0gdmFsdWUpO1xuICAgIHRoaXMuc2VuZCgncmVxdWVzdCcpO1xuXG4gICAgLy8gQHRvZG8gLSBzaG91bGQgcmVjZWl2ZSBhIHN5bmMgc3RhcnQgdGltZSBmcm9tIHNlcnZlclxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBidWZmZXJJbmZvcyAtIGluZm8gb24gYXVkaW8gZmlsZXMgdGhhdCBjYW4gYmUgc3RyZWFtZWRcbiAgICovXG4gIF9vbkFja25vd2xlZGdlUmVzcG9uc2UoYnVmZmVySW5mb3MpIHtcbiAgICBidWZmZXJJbmZvcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAvLyBAdG9kbyAtIHRoaXMgaGFzIHRvIGJlIHJldmlld2VkLCBub3Qgcm9idXN0XG4gICAgICBjb25zdCBjaHVua1BhdGggPSBpdGVtWzBdLm5hbWU7XG4gICAgICBjb25zdCBkaXJuYW1lID0gcGF0aC5kaXJuYW1lKGNodW5rUGF0aCk7XG4gICAgICBjb25zdCBwYXJ0cyA9IGRpcm5hbWUuc3BsaXQoJy8nKTtcbiAgICAgIGNvbnN0IGJ1ZmZlcklkID0gcGFydHMucG9wKCk7XG5cbiAgICAgIGl0ZW0uZm9yRWFjaChjaHVuayA9PiB7XG4gICAgICAgIGNodW5rLnVybCA9IGNodW5rLm5hbWUucmVwbGFjZSgncHVibGljLycsIHRoaXMub3B0aW9ucy5hc3NldHNEb21haW4pO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuYnVmZmVySW5mb3Muc2V0KGJ1ZmZlcklkLCBpdGVtKTtcbiAgICB9KTtcblxuICAgIHRoaXMucmVhZHkoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYSBuZXcgYXVkaW8gc3RyZWFtIG5vZGUuXG4gICAqL1xuICBnZXRBdWRpb1N0cmVhbSgpIHtcbiAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnN5bmNTdGFydFRpbWUsIHRoaXMuc3luY1NlcnZpY2UuZ2V0U3luY1RpbWUoKSk7XG4gICAgcmV0dXJuIG5ldyBBdWRpb1N0cmVhbShcbiAgICAgIHRoaXMuYnVmZmVySW5mb3MsXG4gICAgICB0aGlzLnN5bmNTZXJ2aWNlLFxuICAgICAgdGhpcy5vcHRpb25zLm1vbml0b3JJbnRlcnZhbCxcbiAgICAgIHRoaXMub3B0aW9ucy5yZXF1aXJlZEFkdmFuY2VUaHJlc2hvbGQsXG4gICAgICB0aGlzLnN5bmNTdGFydFRpbWVcbiAgICApO1xuICB9XG5cbn1cblxuLyoqXG4gKiBBbiBhdWRpbyBzdHJlYW0gbm9kZSwgYmVoYXZpbmcgYXMgd291bGQgYSBtZWRpYUVsZW1lbnRTb3VyY2Ugbm9kZS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYnVmZmVySW5mb3MgLSBNYXAgb2Ygc3RyZWFtYWJsZSBidWZmZXIgY2h1bmtzIGluZm9zLlxuICogQHBhcmFtIHtPYmplY3R9IHN5bmNTZXJ2aWNlIC0gU291bmR3b3JrcyBzeW5jIHNlcnZpY2UsIHVzZWQgZm9yIHN5bmMgbW9kZS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBtb25pdG9ySW50ZXJ2YWwgLSBTZWUgQXVkaW9TdHJlYW1NYW5hZ2VyJ3MuXG4gKiBAcGFyYW0ge051bWJlcn0gcmVxdWlyZWRBZHZhbmNlVGhyZXNob2xkIC0gU2VlIEF1ZGlvU3RyZWFtTWFuYWdlcidzLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQXVkaW9TdHJlYW1NYW5hZ2VyXG4gKi9cbmNsYXNzIEF1ZGlvU3RyZWFtIHtcbiAgLyoqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmUgaW5zdGFudGlhdGVkIG1hbnVhbGx5XyAqL1xuICBjb25zdHJ1Y3RvcihidWZmZXJJbmZvcywgc3luY1NlcnZpY2UsIG1vbml0b3JJbnRlcnZhbCwgcmVxdWlyZWRBZHZhbmNlVGhyZXNob2xkLCBzeW5jU3RhcnRUaW1lKSB7XG4gICAgLy8gYXJndW1lbnRzXG4gICAgdGhpcy5idWZmZXJJbmZvcyA9IGJ1ZmZlckluZm9zO1xuICAgIHRoaXMuc3luY1NlcnZpY2UgPSBzeW5jU2VydmljZTtcbiAgICB0aGlzLm1vbml0b3JJbnRlcnZhbCA9IG1vbml0b3JJbnRlcnZhbCAqIDEwMDA7IC8vIGluIG1zXG4gICAgdGhpcy5yZXF1aXJlZEFkdmFuY2VUaHJlc2hvbGQgPSByZXF1aXJlZEFkdmFuY2VUaHJlc2hvbGQ7XG4gICAgdGhpcy5zeW5jU3RhcnRUaW1lID0gc3luY1N0YXJ0VGltZTtcblxuICAgIC8vIGxvY2FsIGF0dHIuXG4gICAgdGhpcy5fc3luYyA9IGZhbHNlO1xuICAgIHRoaXMuX2xvb3AgPSBmYWxzZTtcbiAgICB0aGlzLl9wZXJpb2RpYyA9IGZhbHNlO1xuICAgIHRoaXMuX21ldGFEYXRhID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX3VybCA9IG51bGw7XG5cbiAgICB0aGlzLm91dHB1dCA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG5cbiAgICAvLyBzdHJlYW0gbW9uaXRvcmluZ1xuICAgIHRoaXMuX2ludGVydmFsSWQgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fcXVldWVFbmRUaW1lID0gMDtcbiAgICB0aGlzLl9zcmNNYXAgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5fc3RvcFJlcXVpcmVkID0gZmFsc2U7XG5cbiAgICB0aGlzLl9yZXNldCgpO1xuXG4gICAgdGhpcy5fcmVxdWVzdENodW5rcyA9IHRoaXMuX3JlcXVlc3RDaHVua3MuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbmVuZGVkID0gdGhpcy5fb25lbmRlZC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXQgLyByZXNldCBsb2NhbCBhdHRyaWJ1dGVzIChhdCBzdHJlYW0gY3JlYXRpb24gYW5kIHN0b3AoKSApLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3Jlc2V0KCkge1xuICAgIHRoaXMuX2ZpcnN0Q2h1bmtOZXR3b3JrTGF0ZW5jeU9mZnNldCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9jdXJyZW50Q2h1bmtJbmRleCA9IC0xO1xuICAgIHRoaXMuX2ZpcnN0UGFja2V0U3RhdGUgPSAwO1xuICB9XG5cbiAgLyoqXG4gICAqIERlZmluZSB1cmwgb2YgYXVkaW8gZmlsZSB0byBzdHJlYW0sIHNlbmQgbWV0YSBkYXRhIHJlcXVlc3QgdG8gc2VydmVyIGNvbmNlcm5pbmcgdGhpcyBmaWxlLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsIC0gUmVxdWVzdGVkIGZpbGUgbmFtZSwgd2l0aG91dCBleHRlbnNpb25cbiAgICovXG4gIHNldCB1cmwoZmlsZW5hbWUpIHtcbiAgICBpZiAodGhpcy5pc1BsYXlpbmcpIHtcbiAgICAgIGNvbnNvbGUud2FybignW1dBUk5JTkddIC0gQ2Fubm90IHNldCB1cmwgd2hpbGUgcGxheWluZycpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIGNoZWNrIGlmIHVybCBjb3JyZXNwb25kcyB0byBhIHN0cmVhbWFibGUgZmlsZVxuICAgIGlmICh0aGlzLmJ1ZmZlckluZm9zLmdldChmaWxlbmFtZSkpXG4gICAgICB0aGlzLl91cmwgPSBmaWxlbmFtZTtcbiAgICBlbHNlXG4gICAgICBjb25zb2xlLmVycm9yKGBbRVJST1JdIC0gJHtmaWxlbmFtZX0gdXJsIG5vdCBpbiAke3RoaXMuYnVmZmVySW5mb3N9IFxcbiAjIyMgdXJsIGRpc2NhcmRlZGApO1xuICB9XG5cbiAgZ2V0IHVybCgpIHtcbiAgICByZXR1cm4gdGhpcy5fdXJsO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldC9HZXQgc3luY2hyb25pemVkIG1vZGUgc3RhdHVzLiBpbiBub24gc3luYy4gbW9kZSwgdGhlIHN0cmVhbSBhdWRpb1xuICAgKiB3aWxsIHN0YXJ0IHdoZW5ldmVyIHRoZSBmaXJzdCBhdWRpbyBidWZmZXIgaXMgZG93bmxvYWRlZC4gaW4gc3luYy4gbW9kZSxcbiAgICogdGhlIHN0cmVhbSBhdWRpbyB3aWxsIHN0YXJ0IChhZ2FpbiB3aGFuIHRoZSBhdWRpbyBidWZmZXIgaXMgZG93bmxvYWRlZClcbiAgICogd2l0aCBhbiBvZmZzZXQgaW4gdGhlIGJ1ZmZlciwgYXMgaWYgaXQgc3RhcnRlZCBwbGF5aW5nIGV4YWN0bHkgd2hlbiB0aGVcbiAgICogc3RhcnQoKSBjb21tYW5kIHdhcyBpc3N1ZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7Qm9vbH0gdmFsIC0gRW5hYmxlIC8gZGlzYWJsZSBzeW5jXG4gICAqL1xuICBzZXQgc3luYyh2YWwpIHtcbiAgICBpZiAodGhpcy5pc1BsYXlpbmcpIHtcbiAgICAgIGNvbnNvbGUud2FybignW1dBUk5JTkddIC0gQ2Fubm90IHNldCBzeW5jIHdoaWxlIHBsYXlpbmcnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9zeW5jID0gdmFsO1xuICB9XG5cbiAgZ2V0IHN5bmMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N5bmM7XG4gIH1cblxuICAvKipcbiAgICogU2V0L0dldCBsb29wIG1vZGUuIG9uZW5kZWQoKSBtZXRob2Qgbm90IGNhbGxlZCBpZiBsb29wIGVuYWJsZWQuXG4gICAqIEBwYXJhbSB7Qm9vbH0gdmFsIC0gZW5hYmxlIC8gZGlzYWJsZSBzeW5jXG4gICAqL1xuICBzZXQgbG9vcCh2YWwpIHtcbiAgICBpZiAodGhpcy5pc1BsYXlpbmcpIHtcbiAgICAgIGNvbnNvbGUud2FybignW1dBUk5JTkddIC0gQ2Fubm90IHNldCBsb29wIHdoaWxlIHBsYXlpbmcnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9sb29wID0gdmFsO1xuICB9XG5cbiAgZ2V0IGxvb3AoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xvb3A7XG4gIH1cblxuICAvKipcbiAgICogU2V0L0dldCBwZXJpb2RpYyBtb2RlLiB3ZSBkb24ndCB3YW50IHRoZSBzdHJlYW0gdG8gYmUgc3luY2hyb25pemVkIHRvXG4gICAqIGEgY29tbW9uIG9yaWdpbiwgYnV0IGhhdmUgdGhlbSBhbGlnbmVkIG9uIGEgZ3JpZC4gYWthLCB3ZSBkb24ndCB3YW4ndCB0b1xuICAgKiBjb21wZW5zYXRlIGZvciB0aGUgbG9hZGluZyB0aW1lLCB3aGVuIHN0YXJ0aW5nIHdpdGggYW4gb2Zmc2V0LlxuICAgKiBAcGFyYW0ge0Jvb2x9IHZhbCAtIGVuYWJsZSAvIGRpc2FibGUgcGVyaW9kaWNcbiAgICovXG4gIHNldCBwZXJpb2RpYyh2YWwpIHtcbiAgICBpZiAodGhpcy5pc1BsYXlpbmcpIHtcbiAgICAgIGNvbnNvbGUud2FybignW1dBUk5JTkddIC0gQ2Fubm90IHNldCBsb29wIHdoaWxlIHBsYXlpbmcnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLl9wZXJpb2RpYyA9IHZhbDtcbiAgfVxuXG4gIGdldCBwZXJpb2RpYygpIHtcbiAgICByZXR1cm4gdGhpcy5fcGVyaW9kaWM7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSB0b3RhbCBkdXJhdGlvbiAoaW4gc2Vjcykgb2YgdGhlIGF1ZGlvIGZpbGUgY3VycmVudGx5IHN0cmVhbWVkLlxuICAgKi9cbiAgZ2V0IGR1cmF0aW9uKCkge1xuICAgIGNvbnN0IGJ1ZmZlckluZm8gPSB0aGlzLmJ1ZmZlckluZm9zLmdldCh0aGlzLl91cmwpO1xuICAgIGNvbnN0IGxhc3RDaHVuayA9IGJ1ZmZlckluZm9bYnVmZmVySW5mby5sZW5ndGggLSAxXTtcbiAgICBjb25zdCBkdXJhdGlvbiA9IGxhc3RDaHVuay5zdGFydCArIGxhc3RDaHVuay5kdXJhdGlvbjtcbiAgICByZXR1cm4gZHVyYXRpb247XG4gIH1cblxuICAvKipcbiAgICogQ29ubmVjdCB0aGUgc3RyZWFtIHRvIGFuIGF1ZGlvIG5vZGUuXG4gICAqXG4gICAqIEBwYXJhbSB7QXVkaW9Ob2RlfSBub2RlIC0gQXVkaW8gbm9kZSB0byBjb25uZWN0IHRvLlxuICAgKi9cbiAgY29ubmVjdChub2RlKSB7XG4gICAgdGhpcy5vdXRwdXQuY29ubmVjdChub2RlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXRob2QgY2FsbGVkIHdoZW4gc3RyZWFtIGZpbmlzaGVkIHBsYXlpbmcgb24gaXRzIG93biAod29uJ3QgZmlyZSBpZiBsb29wXG4gICAqIGVuYWJsZWQpLlxuICAgKi9cbiAgb25lbmRlZCgpIHt9XG5cbiAgLyoqXG4gICAqIE1ldGhvZCBjYWxsZWQgd2hlbiBzdHJlYW0gZHJvcHMgYSBwYWNrZXQgKGFycml2ZWQgdG9vIGxhdGUpLlxuICAgKi9cbiAgb25kcm9wKCkge1xuICAgIGNvbnNvbGUud2FybignYXVkaW9zdHJlYW06IHRvbyBsb25nIGxvYWRpbmcsIGRpc2NhcmRpbmcgYnVmZmVyJyk7XG4gIH1cblxuICAvKipcbiAgICogTWV0aG9kIGNhbGxlZCB3aGVuIHN0cmVhbSByZWNlaXZlZCBhIHBhY2tldCBsYXRlLCBidXQgbm90IHRvbyBtdWNoIHRvIGRyb3BcbiAgICogaXQgKGdhcCBpbiBhdWRpbykuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lIC0gZGVsYXkgdGltZS5cbiAgICovXG4gIG9ubGF0ZSh0aW1lKSB7fVxuXG4gIC8qKlxuICAgKiBTdGFydCBzdHJlYW1pbmcgYXVkaW8gc291cmNlLlxuICAgKiBAd2FybmluZyAtIG9mZnNldCBkb2Vzbid0IHNlZW0gdG8gbWFrZSBzZW5zIHdoZW4gbm90IGxvb3AgYW5kIG5vdCBwZXJpb2RpY1xuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gb2Zmc2V0IC0gdGltZSBpbiBidWZmZXIgZnJvbSB3aGljaCB0byBzdGFydCAoaW4gc2VjKVxuICAgKi9cbiAgc3RhcnQob2Zmc2V0ID0gMCkge1xuICAgIGlmICh0aGlzLmlzUGxheWluZykge1xuICAgICAgY29uc29sZS53YXJuKCdbV0FSTklOR10gLSBzdGFydCgpIGRpc2NhcmRlZCwgbXVzdCBzdG9wIGZpcnN0Jyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gY2hlY2sgaWYgd2UgZGlzcG9zZSBvZiB2YWxpZCB1cmwgdG8gZXhlY3V0ZSBzdGFydFxuICAgIGlmICh0aGlzLl91cmwgPT09IG51bGwpIHtcbiAgICAgIGNvbnNvbGUud2FybignW1dBUk5JTkddIC0gc3RhcnQoKSBkaXNjYXJkZWQsIG11c3QgZGVmaW5lIHZhbGlkIHVybCBmaXJzdCcpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIHdlIGNvbnNpZGVyIHRoZSBzdHJlYW0gc3RhcnRlZCBub3dcbiAgICB0aGlzLmlzUGxheWluZyA9IHRydWU7XG5cbiAgICBjb25zdCBidWZmZXJJbmZvID0gdGhpcy5idWZmZXJJbmZvcy5nZXQodGhpcy5fdXJsKTtcbiAgICBjb25zdCBkdXJhdGlvbiA9IHRoaXMuZHVyYXRpb247XG5cbiAgICBpZiAodGhpcy5zeW5jKSB7XG4gICAgICBjb25zdCBzeW5jVGltZSA9IHRoaXMuc3luY1NlcnZpY2UuZ2V0U3luY1RpbWUoKTtcbiAgICAgIGNvbnN0IHN0YXJ0VGltZSA9IHRoaXMuc3luY1N0YXJ0VGltZTtcbiAgICAgIG9mZnNldCA9IHN5bmNUaW1lIC0gc3RhcnRUaW1lICsgb2Zmc2V0O1xuICAgIH1cblxuICAgIGlmICh0aGlzLmxvb3ApXG4gICAgICBvZmZzZXQgPSBvZmZzZXQgJSBkdXJhdGlvbjtcblxuICAgIC8vIHRoaXMgbG9va3MgY29oZXJlbnQgZm9yIGFsbCBjb21iaW5hdGlvbnMgb2YgYGxvb3BgIGFuZCBgc3luY2BcbiAgICAvLyBjb25zb2xlLmxvZygnb2Zmc2V0Jywgb2Zmc2V0KTtcbiAgICAvLyBjb25zb2xlLmxvZygnZHVyYXRpb24nLCBkdXJhdGlvbik7XG5cbiAgICBpZiAob2Zmc2V0ID49IGR1cmF0aW9uKSB7XG4gICAgICBjb25zb2xlLndhcm4oYFtXQVJOSU5HXSAtIHN0YXJ0KCkgZGlzY2FyZGVkLCByZXF1ZXN0ZWQgb2Zmc2V0XG4gICAgICAgICgke29mZnNldH0gc2VjKSBsYXJnZXIgdGhhbiBmaWxlIGR1cmF0aW9uICgke2R1cmF0aW9ufSBzZWMpYCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gZmluZCBpbmRleCBvZiB0aGUgY2h1bmsgY29ycmVzcG9uZGluZyB0byBnaXZlbiBvZmZzZXRcbiAgICBsZXQgaW5kZXggPSAwO1xuICAgIGxldCBvZmZzZXRJbkZpcnN0Q2h1bmsgPSAwO1xuICAgIC8vIGNvbnNvbGUubG9nKGJ1ZmZlckluZm8sIGluZGV4LCBidWZmZXJJbmZvW2luZGV4XSk7XG5cbiAgICB3aGlsZSAodGhpcy5fY3VycmVudENodW5rSW5kZXggPT09IC0xICYmIGluZGV4IDwgYnVmZmVySW5mby5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGNodW5rSW5mb3MgPSBidWZmZXJJbmZvW2luZGV4XTtcbiAgICAgIGNvbnN0IHN0YXJ0ID0gY2h1bmtJbmZvcy5zdGFydDtcbiAgICAgIGNvbnN0IGVuZCA9IHN0YXJ0ICsgY2h1bmtJbmZvcy5kdXJhdGlvbjtcblxuICAgICAgaWYgKG9mZnNldCA+PSBzdGFydCAmJiBvZmZzZXQgPCBlbmQpIHtcbiAgICAgICAgdGhpcy5fY3VycmVudENodW5rSW5kZXggPSBpbmRleDtcbiAgICAgICAgb2Zmc2V0SW5GaXJzdENodW5rID0gb2Zmc2V0IC0gc3RhcnQ7XG4gICAgICB9XG5cbiAgICAgIGluZGV4ICs9IDE7XG4gICAgfVxuXG4gICAgLy8gaGFuZGxlIG5lZ2F0aXZlIG9mZnNldCwgcGljayBmaXJzdCBjaHVuay4gVGhpcyBjYW4gYmUgdXNlZnVsbCB0byBzdGFydFxuICAgIC8vIHN5bmNlZCBzdHJlYW0gd2hpbGUgZ2l2ZSB0aGVtIHNvbWUgZGVsYXkgdG8gcHJlbG9hZCB0aGUgZmlyc3QgY2h1bmtcbiAgICBpZiAodGhpcy5fY3VycmVudENodW5rSW5kZXggPT09IC0xICYmIG9mZnNldCA8IDApXG4gICAgICB0aGlzLl9jdXJyZW50Q2h1bmtJbmRleCA9IDA7XG5cbiAgICAvLyBjb25zb2xlLmxvZygnQXVkaW9TdHJlYW0uc3RhcnQoKScsIHRoaXMuX3VybCwgdGhpcy5fY3VycmVudENodW5rSW5kZXgpO1xuICAgIHRoaXMuX3N0b3BSZXF1aXJlZCA9IGZhbHNlO1xuICAgIHRoaXMuX3F1ZXVlRW5kVGltZSA9IHRoaXMuc3luY1NlcnZpY2UuZ2V0U3luY1RpbWUoKSAtIG9mZnNldEluRmlyc3RDaHVuaztcblxuICAgIC8vIEBpbXBvcnRhbnQgLSBuZXZlciBjaGFuZ2UgdGhlIG9yZGVyIG9mIHRoZXNlIDIgY2FsbHNcbiAgICB0aGlzLl9pbnRlcnZhbElkID0gc2V0SW50ZXJ2YWwodGhpcy5fcmVxdWVzdENodW5rcywgdGhpcy5tb25pdG9ySW50ZXJ2YWwpO1xuICAgIHRoaXMuX3JlcXVlc3RDaHVua3MoKTtcbiAgfVxuXG4gIF9vbmVuZGVkKCkge1xuICAgIHRoaXMuaXNQbGF5aW5nID0gZmFsc2U7XG4gICAgdGhpcy5vbmVuZGVkKCk7XG4gIH1cblxuICAvKipcbiAgICogU3RvcCB0aGUgYXVkaW8gc3RyZWFtLiBNaW1pY3MgQXVkaW9CdWZmZXJTb3VyY2VOb2RlIHN0b3AoKSBtZXRob2QuIEEgc3RvcHBlZFxuICAgKiBhdWRpbyBzdHJlYW0gY2FuIGJlIHN0YXJ0ZWQgKG5vIG5lZWQgdG8gY3JlYXRlIGEgbmV3IG9uZSBhcyByZXF1aXJlZCB3aGVuXG4gICAqIHVzaW5nIGFuIEF1ZGlvQnVmZmVyU291cmNlTm9kZSkuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBvZmZzZXQgLSBvZmZzZXQgdGltZSAoaW4gc2VjKSBmcm9tIG5vdyBhdCB3aGljaFxuICAgKiAgdGhlIGF1ZGlvIHN0cmVhbSBzaG91bGQgc3RvcCBwbGF5aW5nLlxuICAgKi9cbiAgc3RvcChvZmZzZXQgPSAwKSB7XG4gICAgaWYgKCF0aGlzLmlzUGxheWluZykge1xuICAgICAgY29uc29sZS53YXJuKCdbV0FSTklOR10gLSBzdG9wIGRpc2NhcmRlZCwgbm90IHN0YXJ0ZWQgb3IgYWxyZWFkeSBlbmRlZCcpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9pbnRlcnZhbElkICE9PSB1bmRlZmluZWQpXG4gICAgICB0aGlzLl9jbGVhclJlcXVlc3RDaHVua3MoKTtcblxuXG4gICAgdGhpcy5fc3RvcFJlcXVpcmVkID0gdHJ1ZTsgLy8gYXZvaWQgcGxheWluZyBidWZmZXIgdGhhdCBhcmUgY3VycmVudGx5IGxvYWRpbmdcbiAgICB0aGlzLl9yZXNldCgpO1xuXG4gICAgY29uc3Qgbm93ID0gdGhpcy5zeW5jU2VydmljZS5nZXRTeW5jVGltZSgpO1xuICAgIGNvbnN0IGF1ZGlvVGltZSA9IGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcbiAgICBjb25zdCBzaXplID0gdGhpcy5fc3JjTWFwLnNpemU7XG4gICAgbGV0IGNvdW50ZXIgPSAwO1xuXG4gICAgdGhpcy5fc3JjTWFwLmZvckVhY2goKHNyYywgc3RhcnRUaW1lKSA9PiB7XG4gICAgICBjb3VudGVyICs9IDE7XG4gICAgICBzcmMub25lbmRlZCA9IG51bGw7XG5cbiAgICAgIC8vIHBpY2sgYSBzb3VyY2UgYXJiaXRyYXJpbHkgdG8gdHJpZ2dlciB0aGUgYG9uZW5kZWRgIGV2ZW50IHByb3Blcmx5XG4gICAgICBpZiAoY291bnRlciA9PT0gc2l6ZSlcbiAgICAgICAgc3JjLm9uZW5kZWQgPSB0aGlzLl9vbmVuZGVkO1xuXG4gICAgICBpZiAoc3RhcnRUaW1lIDwgKG5vdyArIG9mZnNldCkgfHzCoHNyYy5vbmVuZGVkICE9PSBudWxsKVxuICAgICAgICBzcmMuc3RvcChhdWRpb1RpbWUgKyBvZmZzZXQpO1xuICAgICAgZWxzZVxuICAgICAgICBzcmMuc3RvcChhdWRpb1RpbWUpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fc3JjTWFwLmNsZWFyKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgd2UgaGF2ZSBlbm91Z2ggXCJsb2NhbCBidWZmZXIgdGltZVwiIGZvciB0aGUgYXVkaW8gc3RyZWFtLFxuICAgKiByZXF1ZXN0IG5ldyBidWZmZXIgY2h1bmtzIG90aGVyd2lzZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9yZXF1ZXN0Q2h1bmtzKCkge1xuICAgIGNvbnN0IGJ1ZmZlckluZm8gPSB0aGlzLmJ1ZmZlckluZm9zLmdldCh0aGlzLl91cmwpO1xuICAgIGNvbnN0IG5vdyA9IHRoaXMuc3luY1NlcnZpY2UuZ2V0U3luY1RpbWUoKTtcblxuICAgIC8vIGhhdmUgdG8gZGVhbCBwcm9wZXJseSB3aXRoXG4gICAgd2hpbGUgKHRoaXMuX3F1ZXVlRW5kVGltZSAtIG5vdyA8PSB0aGlzLnJlcXVpcmVkQWR2YW5jZVRocmVzaG9sZCkge1xuICAgICAgLy8gaW4gbm9uIHN5bmMgbW9kZSwgd2Ugd2FudCB0aGUgc3RhcnQgdGltZSB0byBiZSBkZWxheWVkIHdoZW4gdGhlIGZpcnN0XG4gICAgICAvLyBidWZmZXIgaXMgYWN0dWFsbHkgcmVjZWl2ZWQsIHNvIHdlIGxvYWQgaXQgYmVmb3JlIHJlcXVlc3RpbmcgbmV4dCBvbmVzXG4gICAgICBpZiAodGhpcy5fZmlyc3RQYWNrZXRTdGF0ZSA9PT0gMSAmJiAhdGhpcy5fc3luYylcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICBjb25zdCBjaHVua0luZm9zID0gYnVmZmVySW5mb1t0aGlzLl9jdXJyZW50Q2h1bmtJbmRleF07XG4gICAgICBjb25zdCBjaHVua1N0YXJ0VGltZSA9IHRoaXMuX3F1ZXVlRW5kVGltZSAtIGNodW5rSW5mb3Mub3ZlcmxhcFN0YXJ0O1xuICAgICAgY29uc3QgdXJsID0gY2h1bmtJbmZvcy51cmw7XG5cbiAgICAgIC8vIGZsYWcgdGhhdCBmaXJzdCBwYWNrZXQgaGFzIGJlZW4gcmVxdWlyZWQgYW5kIHRoYXQgd2UgbXVzdCBhd2FpdCBmb3IgaXRzXG4gICAgICAvLyBhcnJpdmFsIGluIHVuc3luYyBtb2RlIGJlZm9yZSBhc2tpbmcgZm9yIG1vcmUsIGFzIHRoZSBuZXR3b3JrIGRlbGF5XG4gICAgICAvLyB3aWxsIGRlZmluZSB0aGUgYHRydWVgIHN0YXJ0IHRpbWVcbiAgICAgIGlmICh0aGlzLl9maXJzdFBhY2tldFN0YXRlID09PSAwICYmICF0aGlzLl9zeW5jKVxuICAgICAgICB0aGlzLl9maXJzdFBhY2tldFN0YXRlID0gMTtcblxuICAgICAgLy8gY29uc29sZS5sb2coJ2N1cnJlbnRDaHVua0luZGV4JywgdGhpcy5fY3VycmVudENodW5rSW5kZXgpO1xuICAgICAgLy8gY29uc29sZS5sb2coJ3RpbWVBdFF1ZXVlRW5kJywgdGhpcy5fcXVldWVFbmRUaW1lKTtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCdjaHVua1N0YXJ0VGltZScsIGNodW5rU3RhcnRUaW1lKTtcblxuICAgICAgY29uc3QgY3VycmVudENodW5rSW5kZXggPSB0aGlzLl9jdXJyZW50Q2h1bmtJbmRleDtcblxuICAgICAgdGhpcy5fY3VycmVudENodW5rSW5kZXggKz0gMTtcbiAgICAgIHRoaXMuX3F1ZXVlRW5kVGltZSArPSBjaHVua0luZm9zLmR1cmF0aW9uO1xuXG4gICAgICBsZXQgaXNMYXN0Q2h1bmsgPSBmYWxzZTtcblxuICAgICAgaWYgKHRoaXMuX2N1cnJlbnRDaHVua0luZGV4ID09PSBidWZmZXJJbmZvLmxlbmd0aCkge1xuICAgICAgICBpZiAodGhpcy5fbG9vcCkge1xuICAgICAgICAgIHRoaXMuX2N1cnJlbnRDaHVua0luZGV4ID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBoYXMgdGhpcyBtZXRob2QgaXMgY2FsbGVkIG9uY2Ugb3V0c2lkZSB0aGUgbG9vcCwgaXQgbWlnaHQgYXBwZW5kXG4gICAgICAgICAgLy8gdGhhdCB3ZSBmaW5pc2ggdGhlIHdob2xlIGxvYWRpbmcgd2l0aG91dCBhY3R1YWxseSBoYXZpbmcgYW5cbiAgICAgICAgICAvLyBpbnRlcnZhbElkLCBtYXliZSBoYW5kbGUgdGhpcyBtb3JlIHByb3Blcmx5IHdpdGggcmVjY3Vyc2l2ZVxuICAgICAgICAgIC8vIGBzZXRUaW1lb3V0YHNcbiAgICAgICAgICBpZiAodGhpcy5faW50ZXJ2YWxJZClcbiAgICAgICAgICAgIHRoaXMuX2NsZWFyUmVxdWVzdENodW5rcygpO1xuICAgICAgICAgIC8vIGJ1dCByZXNldCBsYXRlciBhcyB0aGUgbGFzdCBjaHVuayBzdGlsbCBuZWVkcyB0aGUgY3VycmVudCBvZmZzZXRzXG4gICAgICAgICAgaXNMYXN0Q2h1bmsgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIGxvYWQgYW5kIGFkZCBidWZmZXIgdG8gcXVldWVcbiAgICAgIGxvYWRBdWRpb0J1ZmZlcih1cmwpLnRoZW4oKGJ1ZmZlcikgPT4ge1xuICAgICAgICBpZiAodGhpcy5fc3RvcFJlcXVpcmVkKVxuICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAvLyBtYXJrIHRoYXQgZmlyc3QgcGFja2V0IGFycml2ZWQgYW5kIHRoYXQgd2UgY2FuIGFzayBmb3IgbW9yZVxuICAgICAgICBpZiAodGhpcy5fZmlyc3RQYWNrZXRTdGF0ZSA9PT0gMSAmJiAhdGhpcy5fc3luYylcbiAgICAgICAgICB0aGlzLl9maXJzdFBhY2tldFN0YXRlID0gMjtcblxuICAgICAgICBjb25zdCB7IG92ZXJsYXBTdGFydCwgb3ZlcmxhcEVuZCB9ID0gY2h1bmtJbmZvcztcbiAgICAgICAgdGhpcy5fYWRkQnVmZmVyVG9RdWV1ZShidWZmZXIsIGNodW5rU3RhcnRUaW1lLCBvdmVybGFwU3RhcnQsIG92ZXJsYXBFbmQsIGlzTGFzdENodW5rKTtcblxuICAgICAgICBpZiAoaXNMYXN0Q2h1bmspXG4gICAgICAgICAgdGhpcy5fcmVzZXQoKTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoaXNMYXN0Q2h1bmspXG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9wIGxvb2tpbmcgZm9yIG5ldyBjaHVua3NcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9jbGVhclJlcXVlc3RDaHVua3MoKSB7XG4gICAgLy8gY29uc29sZS5sb2coYEF1ZGlvU3RyZWFtLl9jbGVhclJlcXVlc3RDaHVua3MoKSAke3RoaXMuX3VybH0gLSBjbGVhckludGVydmFsYCwgdGhpcy5faW50ZXJ2YWxJZCk7XG4gICAgY2xlYXJJbnRlcnZhbCh0aGlzLl9pbnRlcnZhbElkKTtcbiAgICB0aGlzLl9pbnRlcnZhbElkID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhdWRpbyBidWZmZXIgdG8gc3RyZWFtIHF1ZXVlLlxuICAgKlxuICAgKiBAcGFyYW0ge0F1ZGlvQnVmZmVyfSBidWZmZXIgLSBBdWRpbyBidWZmZXIgdG8gYWRkIHRvIHBsYXlpbmcgcXVldWUuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzdGFydFRpbWUgLSBUaW1lIGF0IHdoaWNoIGF1ZGlvIGJ1ZmZlciBwbGF5aW5nIGlzIGR1ZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IG92ZXJsYXBTdGFydCAtIER1cmF0aW9uIChpbiBzZWMpIG9mIHRoZSBhZGRpdGlvbmFsIGF1ZGlvXG4gICAqICBjb250ZW50IGFkZGVkIGJ5IHRoZSBub2RlLWF1ZGlvLXNsaWNlciAob24gc2VydmVyIHNpZGUpIGF0IGF1ZGlvIGJ1ZmZlcidzXG4gICAqICBoZWFkICh1c2VkIGluIGZhZGUtaW4gbWVjaGFuaXNtIHRvIGF2b2lkIHBlcmNlaXZpbmcgcG90ZW50aWFsIC5tcDNcbiAgICogIGVuY29kaW5nIGFydGlmYWN0cyBpbnRyb2R1Y2VkIHdoZW4gYnVmZmVyIHN0YXJ0cyB3aXRoIG5vbi16ZXJvIHZhbHVlKVxuICAgKiBAcGFyYW0ge051bWJlcn0gb3ZlcmxhcEVuZCAtIER1cmF0aW9uIChpbiBzZWMpIG9mIHRoZSBhZGRpdGlvbmFsIGF1ZGlvXG4gICAqICBjb250ZW50IGFkZGVkIGF0IGF1ZGlvIGJ1ZmZlcidzIHRhaWwuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfYWRkQnVmZmVyVG9RdWV1ZShidWZmZXIsIHN0YXJ0VGltZSwgb3ZlcmxhcFN0YXJ0LCBvdmVybGFwRW5kLCBpc0xhc3RDaHVuaykge1xuICAgIC8vIGhhcmQtY29kZSBvdmVybGFwIGZhZGUtaW4gYW5kIG91dCBpbiBidWZmZXJcbiAgICBjb25zdCBudW1TYW1wbGVzRmFkZUluID0gTWF0aC5mbG9vcihvdmVybGFwU3RhcnQgKiBidWZmZXIuc2FtcGxlUmF0ZSk7XG4gICAgY29uc3QgbnVtU2FtcGxlc0ZhZGVPdXQgPSBNYXRoLmZsb29yKG92ZXJsYXBFbmQgKiBidWZmZXIuc2FtcGxlUmF0ZSk7XG4gICAgLy8gbG9vcCBvdmVyIGF1ZGlvIGNoYW5uZWxzXG4gICAgZm9yIChsZXQgY2hhbm5lbCA9IDA7IGNoYW5uZWwgPCBidWZmZXIubnVtYmVyT2ZDaGFubmVsczsgY2hhbm5lbCsrKSB7XG4gICAgICBjb25zdCBjaGFubmVsRGF0YSA9IGJ1ZmZlci5nZXRDaGFubmVsRGF0YShjaGFubmVsKTtcblxuICAgICAgLy8gZmFkZSBpblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1TYW1wbGVzRmFkZUluOyBpKyspIHtcbiAgICAgICAgY29uc3QgZ2FpbiA9IGkgLyAobnVtU2FtcGxlc0ZhZGVJbiAtIDEpO1xuICAgICAgICBjaGFubmVsRGF0YVtpXSA9IGNoYW5uZWxEYXRhW2ldICogZ2FpbjtcbiAgICAgIH1cblxuICAgICAgLy8gZmFkZSBvdXRcbiAgICAgIGZvciAobGV0IGkgPSBjaGFubmVsRGF0YS5sZW5ndGggLSBudW1TYW1wbGVzRmFkZU91dDsgaSA8IGNoYW5uZWxEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGdhaW4gPSAoY2hhbm5lbERhdGEubGVuZ3RoIC0gaSAtIDEpIC8gKG51bVNhbXBsZXNGYWRlT3V0IC0gMSk7XG4gICAgICAgIGNoYW5uZWxEYXRhW2ldID0gY2hhbm5lbERhdGFbaV0gKiBnYWluO1xuICAgICAgfVxuICAgIH1cblxuXG4gICAgY29uc3Qgc3luY1RpbWUgPSB0aGlzLnN5bmNTZXJ2aWNlLmdldFN5bmNUaW1lKCk7XG4gICAgY29uc3Qgbm93ID0gYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lO1xuICAgIGxldCBvZmZzZXQgPSBzdGFydFRpbWUgLSBzeW5jVGltZTtcblxuICAgIC8vIC0gaW4gYG5vbiBzeW5jYCBzY2VuYXJpbywgd2Ugd2FudCB0byB0YWtlIGluIGFjY291bnQgdGhlIGxhdGVuY3kgaW5kdWNlZFxuICAgIC8vIGJ5IHRoZSBsb2FkaW5nIG9mIHRoZSBmaXJzdCBjaHVuay4gVGhpcyBsYXRlbmN5IG11c3QgdGhlbiBiZSBhcHBsaWVkXG4gICAgLy8gdG8gYWxsIHN1YnNlcXVlbnQgY2h1bmtzLlxuICAgIC8vIC0gaW4gYHN5bmNgIHNjZW5hcmlvcywgd2UganVzdCBsZXQgdGhlIGxvZ2ljYWwgc3RhcnQgdGltZSBhbmQgY29tcHV0ZWRcbiAgICAvLyBvZmZzZXQgZG8gdGhlaXIgam9iLi4uXG4gICAgLy8gLSBpbiBgcGVyaW9kaWNgIHNjZW5hcmlvcyB3ZSBkb24ndCB3YW50IHRvIGNvbXBlbnNhdGUgZm9yIHRoZSBsb2FkaW5nIHRpbWVcbiAgICBpZiAoIXRoaXMuX3N5bmMgJiYgIXRoaXMuX3BlcmlvZGljKSB7XG4gICAgICAvL1xuICAgICAgaWYgKHRoaXMuX2ZpcnN0Q2h1bmtOZXR3b3JrTGF0ZW5jeU9mZnNldCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuX2ZpcnN0Q2h1bmtOZXR3b3JrTGF0ZW5jeU9mZnNldCA9IG9mZnNldDtcbiAgICAgIH1cblxuICAgICAgb2Zmc2V0IC09IHRoaXMuX2ZpcnN0Q2h1bmtOZXR3b3JrTGF0ZW5jeU9mZnNldDtcbiAgICB9XG5cbiAgICAvLyBpZiBjb21wdXRlZCBvZmZzZXQgaXMgc21hbGxlciB0aGFuIGR1cmF0aW9uXG4gICAgaWYgKC1vZmZzZXQgPD0gYnVmZmVyLmR1cmF0aW9uKSB7XG4gICAgICAvLyBjcmVhdGUgYXVkaW8gc291cmNlXG4gICAgICBjb25zdCBzcmMgPSBhdWRpb0NvbnRleHQuY3JlYXRlQnVmZmVyU291cmNlKCk7XG4gICAgICBzcmMuY29ubmVjdCh0aGlzLm91dHB1dCk7XG4gICAgICBzcmMuYnVmZmVyID0gYnVmZmVyO1xuXG4gICAgICBpZiAob2Zmc2V0IDwgMCkge1xuICAgICAgICBzcmMuc3RhcnQobm93LCAtb2Zmc2V0KTtcbiAgICAgICAgLy8gdGhlIGNhbGxiYWNrIHNob3VsZCBiZSBjYWxsZWQgYWZ0ZXIgc3RhcnRcbiAgICAgICAgdGhpcy5vbmxhdGUoLW9mZnNldCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzcmMuc3RhcnQobm93ICsgb2Zmc2V0LCAwKTtcbiAgICAgIH1cblxuXG4gICAgICAvLyBrZWVwIGFuZCBjbGVhbiByZWZlcmVuY2UgdG8gc291cmNlXG4gICAgICB0aGlzLl9zcmNNYXAuc2V0KHN0YXJ0VGltZSwgc3JjKTtcblxuICAgICAgc3JjLm9uZW5kZWQgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuX3NyY01hcC5kZWxldGUoc3RhcnRUaW1lKTtcblxuICAgICAgICBpZiAoaXNMYXN0Q2h1bmspXG4gICAgICAgICAgdGhpcy5fb25lbmRlZCgpO1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vbmRyb3AoKTtcbiAgICB9XG4gIH1cblxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBBdWRpb1N0cmVhbU1hbmFnZXIpO1xuZXhwb3J0IGRlZmF1bHQgQXVkaW9TdHJlYW1NYW5hZ2VyO1xuIl19