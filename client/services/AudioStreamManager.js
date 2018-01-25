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
      requiredAdvanceThreshold: 10 // in seconds
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
        var chunkPath = item[0].name;
        var dirname = _path2.default.dirname(chunkPath);
        var parts = dirname.split('/');
        var bufferId = parts.pop();

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

    console.log('AudioStream', bufferInfos);

    // arguments
    this.bufferInfos = bufferInfos;
    this.syncService = syncService;
    this.monitorInterval = monitorInterval * 1000; // in ms
    this.requiredAdvanceThreshold = requiredAdvanceThreshold;
    this.syncStartTime = syncStartTime;

    // local attr.
    this._sync = false;
    this._loop = false;
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
        var name = chunkInfos.name;
        // @todo - could probably be done more elegantly...
        var url = name.substr(name.indexOf('public') + 7, name.length - 1);

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
      var offset = startTime - this.syncService.getSyncTime();

      // - in `non sync` scenario, we want to take in account the latency induced
      // by the loading of the first chunk. This latency must then be applied
      // to all subsequent chunks.
      // - in `sync` scenarios, we just let the logical start time and computed
      // offset do their job...
      if (!this._sync) {
        //
        if (this._firstChunkNetworkLatencyOffset === undefined) this._firstChunkNetworkLatencyOffset = offset;

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
     * the stream audio will start (again asa the audio buffer is downloaded)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1ZGlvU3RyZWFtTWFuYWdlci5qcyJdLCJuYW1lcyI6WyJTRVJWSUNFX0lEIiwibG9nIiwibG9hZEF1ZGlvQnVmZmVyIiwidXJsIiwicHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJyZXF1ZXN0IiwiWE1MSHR0cFJlcXVlc3QiLCJvcGVuIiwicmVzcG9uc2VUeXBlIiwib25sb2FkIiwicmVzcG9uc2UiLCJkZWNvZGVBdWRpb0RhdGEiLCJzZW5kIiwiQXVkaW9TdHJlYW1NYW5hZ2VyIiwiYnVmZmVySW5mb3MiLCJzeW5jU3RhcnRUaW1lIiwiZGVmYXVsdHMiLCJtb25pdG9ySW50ZXJ2YWwiLCJyZXF1aXJlZEFkdmFuY2VUaHJlc2hvbGQiLCJjb25maWd1cmUiLCJzeW5jU2VydmljZSIsInJlcXVpcmUiLCJfb25BY2tub3dsZWRnZVJlc3BvbnNlIiwiYmluZCIsInJlY2VpdmUiLCJ2YWx1ZSIsImZvckVhY2giLCJpdGVtIiwiY2h1bmtQYXRoIiwibmFtZSIsImRpcm5hbWUiLCJwYXJ0cyIsInNwbGl0IiwiYnVmZmVySWQiLCJwb3AiLCJzZXQiLCJyZWFkeSIsIkF1ZGlvU3RyZWFtIiwib3B0aW9ucyIsImNvbnNvbGUiLCJfc3luYyIsIl9sb29wIiwiX21ldGFEYXRhIiwidW5kZWZpbmVkIiwiX3VybCIsIm91dHB1dCIsImNyZWF0ZUdhaW4iLCJfaW50ZXJ2YWxJZCIsIl9xdWV1ZUVuZFRpbWUiLCJfc3JjTWFwIiwiX3N0b3BSZXF1aXJlZCIsIl9yZXNldCIsIl9yZXF1ZXN0Q2h1bmtzIiwiX29uZW5kZWQiLCJfZmlyc3RDaHVua05ldHdvcmtMYXRlbmN5T2Zmc2V0IiwiX2N1cnJlbnRDaHVua0luZGV4IiwiX2ZpcnN0UGFja2V0U3RhdGUiLCJub2RlIiwiY29ubmVjdCIsIndhcm4iLCJ0aW1lIiwib2Zmc2V0IiwiaXNQbGF5aW5nIiwiYnVmZmVySW5mbyIsImdldCIsImR1cmF0aW9uIiwic3luYyIsInN5bmNUaW1lIiwiZ2V0U3luY1RpbWUiLCJzdGFydFRpbWUiLCJsb29wIiwiaW5kZXgiLCJvZmZzZXRJbkZpcnN0Q2h1bmsiLCJsZW5ndGgiLCJjaHVua0luZm9zIiwic3RhcnQiLCJlbmQiLCJzZXRJbnRlcnZhbCIsIm9uZW5kZWQiLCJfY2xlYXJSZXF1ZXN0Q2h1bmtzIiwibm93IiwiYXVkaW9UaW1lIiwiY3VycmVudFRpbWUiLCJzaXplIiwiY291bnRlciIsInNyYyIsInN0b3AiLCJjbGVhciIsImNodW5rU3RhcnRUaW1lIiwib3ZlcmxhcFN0YXJ0Iiwic3Vic3RyIiwiaW5kZXhPZiIsImN1cnJlbnRDaHVua0luZGV4IiwiaXNMYXN0Q2h1bmsiLCJ0aGVuIiwiYnVmZmVyIiwib3ZlcmxhcEVuZCIsIl9hZGRCdWZmZXJUb1F1ZXVlIiwiY2xlYXJJbnRlcnZhbCIsIm51bVNhbXBsZXNGYWRlSW4iLCJNYXRoIiwiZmxvb3IiLCJzYW1wbGVSYXRlIiwibnVtU2FtcGxlc0ZhZGVPdXQiLCJjaGFubmVsIiwibnVtYmVyT2ZDaGFubmVscyIsImNoYW5uZWxEYXRhIiwiZ2V0Q2hhbm5lbERhdGEiLCJpIiwiZ2FpbiIsImNyZWF0ZUJ1ZmZlclNvdXJjZSIsIm9ubGF0ZSIsImRlbGV0ZSIsIm9uZHJvcCIsImZpbGVuYW1lIiwiZXJyb3IiLCJ2YWwiLCJsYXN0Q2h1bmsiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLGFBQWEsOEJBQW5CO0FBQ0EsSUFBTUMsTUFBTSxxQkFBTSwwQ0FBTixDQUFaOztBQUVBO0FBQ0E7O0FBRUEsU0FBU0MsZUFBVCxDQUF5QkMsR0FBekIsRUFBOEI7QUFDNUIsTUFBTUMsVUFBVSxzQkFBWSxVQUFDQyxPQUFELEVBQVVDLE1BQVYsRUFBcUI7QUFDL0MsUUFBTUMsVUFBVSxJQUFJQyxjQUFKLEVBQWhCO0FBQ0FELFlBQVFFLElBQVIsQ0FBYSxLQUFiLEVBQW9CTixHQUFw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S0FBS3RELFNBQVQsRUFBb0I7QUFDbEJ2QixnQkFBUW9CLElBQVIsQ0FBYSwyQ0FBYjtBQUNBO0FBQ0Q7O0FBRUQsV0FBS2xCLEtBQUwsR0FBYTJFLEdBQWI7QUFDRCxLO3dCQUVVO0FBQ1QsYUFBTyxLQUFLM0UsS0FBWjtBQUNEOztBQUVEOzs7Ozs7d0JBR2U7QUFDYixVQUFNc0IsYUFBYSxLQUFLakQsV0FBTCxDQUFpQmtELEdBQWpCLENBQXFCLEtBQUtwQixJQUExQixDQUFuQjtBQUNBLFVBQU15RSxZQUFZdEQsV0FBV0EsV0FBV1UsTUFBWCxHQUFvQixDQUEvQixDQUFsQjtBQUNBLFVBQU1SLFdBQVdvRCxVQUFVMUMsS0FBVixHQUFrQjBDLFVBQVVwRCxRQUE3QztBQUNBLGFBQU9BLFFBQVA7QUFDRDs7Ozs7QUFrVUgseUJBQWVxRCxRQUFmLENBQXdCeEgsVUFBeEIsRUFBb0NlLGtCQUFwQztrQkFDZUEsa0IiLCJmaWxlIjoiQXVkaW9TdHJlYW1NYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYXVkaW9Db250ZXh0IH0gZnJvbSAnd2F2ZXMtYXVkaW8nO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgZGVidWcgZnJvbSAnZGVidWcnO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOmF1ZGlvLXN0cmVhbS1tYW5hZ2VyJztcbmNvbnN0IGxvZyA9IGRlYnVnKCdzb3VuZHdvcmtzOnNlcnZpY2VzOmF1ZGlvLXN0cmVhbS1tYW5hZ2VyJyk7XG5cbi8vIFRPRE86XG4vLyAtIHN1cHBvcnQgc3RyZWFtaW5nIG9mIGZpbGVzIG9mIHRvdGFsIGR1cmF0aW9uIHNob3J0ZXIgdGhhbiBwYWNrZXQgZHVyYXRpb25cblxuZnVuY3Rpb24gbG9hZEF1ZGlvQnVmZmVyKHVybCkge1xuICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICByZXF1ZXN0Lm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XG4gICAgcmVxdWVzdC5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInO1xuXG4gICAgcmVxdWVzdC5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IHJlcXVlc3QucmVzcG9uc2U7XG4gICAgICBhdWRpb0NvbnRleHQuZGVjb2RlQXVkaW9EYXRhKHJlc3BvbnNlLCByZXNvbHZlLCByZWplY3QpO1xuICAgIH1cblxuICAgIHJlcXVlc3Quc2VuZCgpO1xuICB9KTtcblxuICByZXR1cm4gcHJvbWlzZTtcbn1cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBjbGllbnQgYCdhdWRpby1zdHJlYW0tbWFuYWdlcidgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIGFsbG93cyB0byBzdHJlYW0gYXVkaW8gYnVmZmVycyB0byB0aGUgY2xpZW50IGR1cmluZyB0aGUgZXhwZXJpZW5jZVxuICogKG5vdCBwcmVsb2FkZWQpLiBJbnB1dCBhdWRpbyBmaWxlcyBhcmUgc2VnbWVudGVkIGJ5IHRoZSBzZXJ2ZXIgdXBvbiBzdGFydHVwXG4gKiBhbmQgc2VudCB0byB0aGUgY2xpZW50cyB1cG9uIHJlcXVlc3QuIFNlcnZpY2Ugb25seSBhY2NlcHRzIC53YXYgZmlsZXMgYXQgdGhlXG4gKiBtb21lbnQuIFRoZSBzZXJ2aWNlIG1haW4gb2JqZWN0aXZlIGlzIHRvIDEpIGVuYWJsZSBzeW5jZWQgc3RyZWFtaW5nIGJldHdlZW5cbiAqIGNsaWVudHMgKG5vdCBwcmVjaXNlIGlmIGJhc2VkIG9uIG1lZGlhRWxlbWVudFNvdXJjZXMpLCBhbmQgMikgcHJvdmlkZSBhblxuICogZXF1aXZhbGVudCB0byB0aGUgbWVkaWFFbGVtZW50U291cmNlIG9iamVjdCAoc3RyZWFtaW5nIGFzIGEgV2ViIEF1ZGlvIEFQSVxuICogbm9kZSkgdGhhdCBjb3VsZCBiZSBwbHVnZ2VkIHRvIGFueSBvdGhlciBub2RlIGluIFNhZmFyaSAoYnlwYXNzaW5nIGUuZy4gZ2FpblxuICogb3IgYW5hbHl6ZXIgbm9kZXMgd2hlbiBwbHVnZ2VkIHRvIG1lZGlhRWxlbWVudFNvdXJjZSkuXG4gKlxuICogX18qVGhlIHNlcnZpY2UgbXVzdCBiZSB1c2VkIHdpdGggaXRzIFtzZXJ2ZXItc2lkZSBjb3VudGVycGFydF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLkF1ZGlvU3RyZWFtTWFuYWdlcn0qX19cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtOdW1iZXJ9IG9wdGlvbnMubW9uaXRvckludGVydmFsIC0gSW50ZXJ2YWwgdGltZSAoaW4gc2VjKSBhdCB3aGljaCB0aGVcbiAqICBjbGllbnQgd2lsbCBjaGVjayBpZiBpdCBoYXMgZW5vdWdoIHByZWxvYWRlZCBhdWRpbyBkYXRhIHRvIGVuc3VyZSBzdHJlYW1pbmdcbiAqICBvciBpZiBpdCBuZWVkcyB0byByZXF1aXJlIHNvbWUgbW9yZS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBvcHRpb25zLnJlcXVpcmVkQWR2YW5jZVRocmVzaG9sZCAtIFRocmVzaG9sZCB0aW1lIChpbiBzZWMpIG9mXG4gKiAgcHJlbG9hZGVkIGF1ZGlvIGRhdGEgYmVsb3cgd2hpY2ggdGhlIGNsaWVudCB3aWxsIHJlcXVpcmUgYSBuZXcgYXVkaW8gY2h1bmsuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQGV4YW1wbGVcbiAqIC8vIHJlcXVpcmUgdGhlIGBhdWRpby1zdHJlYW0tbWFuYWdlcmAgKGluIGV4cGVyaWVuY2UgY29uc3RydWN0b3IpXG4gKiB0aGlzLmF1ZGlvU3RyZWFtTWFuYWdlciA9IHRoaXMucmVxdWlyZSgnYXVkaW8tc3RyZWFtLW1hbmFnZXInLCB7XG4gKiAgIG1vbml0b3JJbnRlcnZhbDogMSxcbiAqICAgcmVxdWlyZWRBZHZhbmNlVGhyZXNob2xkOiAxMFxuICogfSk7XG4gKlxuICogLy8gcmVxdWVzdCBuZXcgYXVkaW8gc3RyZWFtIGZyb20gdGhlIHN0cmVhbSBtYW5hZ2VyIChpbiBleHBlcmllbmNlIHN0YXJ0IG1ldGhvZClcbiAqIGNvbnN0IGF1ZGlvU3RyZWFtID0gdGhpcy5hdWRpb1N0cmVhbU1hbmFnZXIuZ2V0QXVkaW9TdHJlYW0oKTtcbiAqIC8vIHNldHVwIGFuZCBzdGFydCBhdWRpbyBzdHJlYW1cbiAqIGF1ZGlvU3RyZWFtLnVybCA9ICdteS1hdWRpby1maWxlLW5hbWUnOyAvLyB3aXRob3V0IGV4dGVuc2lvblxuICogLy8gY29ubmVjdCBhcyB5b3Ugd291bGQgYW55IGF1ZGlvIG5vZGUgZnJvbSB0aGUgd2ViIGF1ZGlvIGFwaVxuICogYXVkaW9TdHJlYW0uY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xuICogYXVkaW9TdHJlYW0ubG9vcCA9IGZhbHNlOyAvLyBkaXNhYmxlIGxvb3BcbiAqIGF1ZGlvU3RyZWFtLnN5bmMgPSBmYWxzZTsgLy8gZGlzYWJsZSBzeW5jaHJvbml6YXRpb25cbiAqIC8vIG1pbWljcyBBdWRpb0J1ZmZlclNvdXJjZU5vZGUgb25lbmRlZCBtZXRob2RcbiAqIGF1ZGlvU3RyZWFtLm9uZW5kZWQgPSBmdW5jdGlvbigpeyBjb25zb2xlLmxvZygnc3RyZWFtIGVuZGVkJyk7IH07XG4gKiBhdWRpb1N0cmVhbS5zdGFydCgpOyAvLyBzdGFydCBhdWRpbyBzdHJlYW1cbiAqL1xuXG5jbGFzcyBBdWRpb1N0cmVhbU1hbmFnZXIgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgLyoqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmUgaW5zdGFudGlhdGVkIG1hbnVhbGx5XyAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCBmYWxzZSk7XG5cbiAgICB0aGlzLmJ1ZmZlckluZm9zID0gbmV3IE1hcCgpO1xuICAgIC8vIGRlZmluZSBnZW5lcmFsIG9mZnNldCBpbiBzeW5jIGxvb3AgKGluIHNlYykgKG5vdCBwcm9wYWdhdGVkIHRvXG4gICAgLy8gYWxyZWFkeSBjcmVhdGVkIGF1ZGlvIHN0cmVhbXMgd2hlbiBtb2RpZmllZClcbiAgICB0aGlzLnN5bmNTdGFydFRpbWUgPSAwO1xuXG4gICAgLy8gY29uZmlndXJlIG9wdGlvbnNcbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIG1vbml0b3JJbnRlcnZhbDogMSwgLy8gaW4gc2Vjb25kc1xuICAgICAgcmVxdWlyZWRBZHZhbmNlVGhyZXNob2xkOiAxMCwgLy8gaW4gc2Vjb25kc1xuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICB0aGlzLnN5bmNTZXJ2aWNlID0gdGhpcy5yZXF1aXJlKCdzeW5jJyk7XG5cbiAgICB0aGlzLl9vbkFja25vd2xlZGdlUmVzcG9uc2UgPSB0aGlzLl9vbkFja25vd2xlZGdlUmVzcG9uc2UuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuICAgIC8vIHNlbmQgcmVxdWVzdCBmb3IgaW5mb3Mgb24gXCJzdHJlYW1hYmxlXCIgYXVkaW8gZmlsZXNcbiAgICB0aGlzLnJlY2VpdmUoJ2Fja25vd2xlZ2RlJywgdGhpcy5fb25BY2tub3dsZWRnZVJlc3BvbnNlKTtcbiAgICB0aGlzLnJlY2VpdmUoJ3N5bmNTdGFydFRpbWUnLCB2YWx1ZSA9PiB0aGlzLnN5bmNTdGFydFRpbWUgPSB2YWx1ZSk7XG4gICAgdGhpcy5zZW5kKCdyZXF1ZXN0Jyk7XG5cbiAgICAvLyBAdG9kbyAtIHNob3VsZCByZWNlaXZlIGEgc3luYyBzdGFydCB0aW1lIGZyb20gc2VydmVyXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtPYmplY3R9IGJ1ZmZlckluZm9zIC0gaW5mbyBvbiBhdWRpbyBmaWxlcyB0aGF0IGNhbiBiZSBzdHJlYW1lZFxuICAgKi9cbiAgX29uQWNrbm93bGVkZ2VSZXNwb25zZShidWZmZXJJbmZvcykge1xuICAgIGJ1ZmZlckluZm9zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGNvbnN0IGNodW5rUGF0aCA9IGl0ZW1bMF0ubmFtZTtcbiAgICAgIGNvbnN0IGRpcm5hbWUgPSBwYXRoLmRpcm5hbWUoY2h1bmtQYXRoKTtcbiAgICAgIGNvbnN0IHBhcnRzID0gZGlybmFtZS5zcGxpdCgnLycpO1xuICAgICAgY29uc3QgYnVmZmVySWQgPSBwYXJ0cy5wb3AoKTtcblxuICAgICAgdGhpcy5idWZmZXJJbmZvcy5zZXQoYnVmZmVySWQsIGl0ZW0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5yZWFkeSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBhIG5ldyBhdWRpbyBzdHJlYW0gbm9kZS5cbiAgICovXG4gIGdldEF1ZGlvU3RyZWFtKCkge1xuICAgIC8vIGNvbnNvbGUubG9nKHRoaXMuc3luY1N0YXJ0VGltZSwgdGhpcy5zeW5jU2VydmljZS5nZXRTeW5jVGltZSgpKTtcbiAgICByZXR1cm4gbmV3IEF1ZGlvU3RyZWFtKFxuICAgICAgdGhpcy5idWZmZXJJbmZvcyxcbiAgICAgIHRoaXMuc3luY1NlcnZpY2UsXG4gICAgICB0aGlzLm9wdGlvbnMubW9uaXRvckludGVydmFsLFxuICAgICAgdGhpcy5vcHRpb25zLnJlcXVpcmVkQWR2YW5jZVRocmVzaG9sZCxcbiAgICAgIHRoaXMuc3luY1N0YXJ0VGltZVxuICAgICk7XG4gIH1cblxufVxuXG4vKipcbiAqIEFuIGF1ZGlvIHN0cmVhbSBub2RlLCBiZWhhdmluZyBhcyB3b3VsZCBhIG1lZGlhRWxlbWVudFNvdXJjZSBub2RlLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBidWZmZXJJbmZvcyAtIE1hcCBvZiBzdHJlYW1hYmxlIGJ1ZmZlciBjaHVua3MgaW5mb3MuXG4gKiBAcGFyYW0ge09iamVjdH0gc3luY1NlcnZpY2UgLSBTb3VuZHdvcmtzIHN5bmMgc2VydmljZSwgdXNlZCBmb3Igc3luYyBtb2RlLlxuICogQHBhcmFtIHtOdW1iZXJ9IG1vbml0b3JJbnRlcnZhbCAtIFNlZSBBdWRpb1N0cmVhbU1hbmFnZXIncy5cbiAqIEBwYXJhbSB7TnVtYmVyfSByZXF1aXJlZEFkdmFuY2VUaHJlc2hvbGQgLSBTZWUgQXVkaW9TdHJlYW1NYW5hZ2VyJ3MuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BdWRpb1N0cmVhbU1hbmFnZXJcbiAqL1xuY2xhc3MgQXVkaW9TdHJlYW0ge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW50aWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKGJ1ZmZlckluZm9zLCBzeW5jU2VydmljZSwgbW9uaXRvckludGVydmFsLCByZXF1aXJlZEFkdmFuY2VUaHJlc2hvbGQsIHN5bmNTdGFydFRpbWUpIHtcbiAgICBjb25zb2xlLmxvZygnQXVkaW9TdHJlYW0nLCBidWZmZXJJbmZvcyk7XG5cbiAgICAvLyBhcmd1bWVudHNcbiAgICB0aGlzLmJ1ZmZlckluZm9zID0gYnVmZmVySW5mb3M7XG4gICAgdGhpcy5zeW5jU2VydmljZSA9IHN5bmNTZXJ2aWNlO1xuICAgIHRoaXMubW9uaXRvckludGVydmFsID0gbW9uaXRvckludGVydmFsICogMTAwMDsgLy8gaW4gbXNcbiAgICB0aGlzLnJlcXVpcmVkQWR2YW5jZVRocmVzaG9sZCA9IHJlcXVpcmVkQWR2YW5jZVRocmVzaG9sZDtcbiAgICB0aGlzLnN5bmNTdGFydFRpbWUgPSBzeW5jU3RhcnRUaW1lO1xuXG4gICAgLy8gbG9jYWwgYXR0ci5cbiAgICB0aGlzLl9zeW5jID0gZmFsc2U7XG4gICAgdGhpcy5fbG9vcCA9IGZhbHNlO1xuICAgIHRoaXMuX21ldGFEYXRhID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX3VybCA9IG51bGw7XG5cbiAgICB0aGlzLm91dHB1dCA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG5cbiAgICAvLyBzdHJlYW0gbW9uaXRvcmluZ1xuICAgIHRoaXMuX2ludGVydmFsSWQgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fcXVldWVFbmRUaW1lID0gMDtcbiAgICB0aGlzLl9zcmNNYXAgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5fc3RvcFJlcXVpcmVkID0gZmFsc2U7XG5cbiAgICB0aGlzLl9yZXNldCgpO1xuXG4gICAgdGhpcy5fcmVxdWVzdENodW5rcyA9IHRoaXMuX3JlcXVlc3RDaHVua3MuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbmVuZGVkID0gdGhpcy5fb25lbmRlZC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXQgLyByZXNldCBsb2NhbCBhdHRyaWJ1dGVzIChhdCBzdHJlYW0gY3JlYXRpb24gYW5kIHN0b3AoKSApLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3Jlc2V0KCkge1xuICAgIHRoaXMuX2ZpcnN0Q2h1bmtOZXR3b3JrTGF0ZW5jeU9mZnNldCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9jdXJyZW50Q2h1bmtJbmRleCA9IC0xO1xuICAgIHRoaXMuX2ZpcnN0UGFja2V0U3RhdGUgPSAwO1xuICB9XG5cbiAgLyoqXG4gICAqIERlZmluZSB1cmwgb2YgYXVkaW8gZmlsZSB0byBzdHJlYW0sIHNlbmQgbWV0YSBkYXRhIHJlcXVlc3QgdG8gc2VydmVyIGNvbmNlcm5pbmcgdGhpcyBmaWxlLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsIC0gUmVxdWVzdGVkIGZpbGUgbmFtZSwgd2l0aG91dCBleHRlbnNpb25cbiAgICovXG4gIHNldCB1cmwoZmlsZW5hbWUpIHtcbiAgICBpZiAodGhpcy5pc1BsYXlpbmcpIHtcbiAgICAgIGNvbnNvbGUud2FybignW1dBUk5JTkddIC0gQ2Fubm90IHNldCB1cmwgd2hpbGUgcGxheWluZycpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIGNoZWNrIGlmIHVybCBjb3JyZXNwb25kcyB0byBhIHN0cmVhbWFibGUgZmlsZVxuICAgIGlmICh0aGlzLmJ1ZmZlckluZm9zLmdldChmaWxlbmFtZSkpXG4gICAgICB0aGlzLl91cmwgPSBmaWxlbmFtZTtcbiAgICBlbHNlXG4gICAgICBjb25zb2xlLmVycm9yKGBbRVJST1JdIC0gJHtmaWxlbmFtZX0gdXJsIG5vdCBpbiAke3RoaXMuYnVmZmVySW5mb3N9IFxcbiAjIyMgdXJsIGRpc2NhcmRlZGApO1xuICB9XG5cbiAgZ2V0IHVybCgpIHtcbiAgICByZXR1cm4gdGhpcy5fdXJsO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldC9HZXQgc3luY2hyb25pemVkIG1vZGUgc3RhdHVzLiBpbiBub24gc3luYy4gbW9kZSwgdGhlIHN0cmVhbSBhdWRpb1xuICAgKiB3aWxsIHN0YXJ0IHdoZW5ldmVyIHRoZSBmaXJzdCBhdWRpbyBidWZmZXIgaXMgZG93bmxvYWRlZC4gaW4gc3luYy4gbW9kZSxcbiAgICogdGhlIHN0cmVhbSBhdWRpbyB3aWxsIHN0YXJ0IChhZ2FpbiBhc2EgdGhlIGF1ZGlvIGJ1ZmZlciBpcyBkb3dubG9hZGVkKVxuICAgKiB3aXRoIGFuIG9mZnNldCBpbiB0aGUgYnVmZmVyLCBhcyBpZiBpdCBzdGFydGVkIHBsYXlpbmcgZXhhY3RseSB3aGVuIHRoZVxuICAgKiBzdGFydCgpIGNvbW1hbmQgd2FzIGlzc3VlZC5cbiAgICpcbiAgICogQHBhcmFtIHtCb29sfSB2YWwgLSBFbmFibGUgLyBkaXNhYmxlIHN5bmNcbiAgICovXG4gIHNldCBzeW5jKHZhbCkge1xuICAgIGlmICh0aGlzLmlzUGxheWluZykge1xuICAgICAgY29uc29sZS53YXJuKCdbV0FSTklOR10gLSBDYW5ub3Qgc2V0IHN5bmMgd2hpbGUgcGxheWluZycpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX3N5bmMgPSB2YWw7XG4gIH1cblxuICBnZXQgc3luYygpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luYztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQvR2V0IGxvb3AgbW9kZS4gb25lbmRlZCgpIG1ldGhvZCBub3QgY2FsbGVkIGlmIGxvb3AgZW5hYmxlZC5cbiAgICogQHBhcmFtIHtCb29sfSB2YWwgLSBlbmFibGUgLyBkaXNhYmxlIHN5bmNcbiAgICovXG4gIHNldCBsb29wKHZhbCkge1xuICAgIGlmICh0aGlzLmlzUGxheWluZykge1xuICAgICAgY29uc29sZS53YXJuKCdbV0FSTklOR10gLSBDYW5ub3Qgc2V0IGxvb3Agd2hpbGUgcGxheWluZycpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2xvb3AgPSB2YWw7XG4gIH1cblxuICBnZXQgbG9vcCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbG9vcDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHRvdGFsIGR1cmF0aW9uIChpbiBzZWNzKSBvZiB0aGUgYXVkaW8gZmlsZSBjdXJyZW50bHkgc3RyZWFtZWQuXG4gICAqL1xuICBnZXQgZHVyYXRpb24oKSB7XG4gICAgY29uc3QgYnVmZmVySW5mbyA9IHRoaXMuYnVmZmVySW5mb3MuZ2V0KHRoaXMuX3VybCk7XG4gICAgY29uc3QgbGFzdENodW5rID0gYnVmZmVySW5mb1tidWZmZXJJbmZvLmxlbmd0aCAtIDFdO1xuICAgIGNvbnN0IGR1cmF0aW9uID0gbGFzdENodW5rLnN0YXJ0ICsgbGFzdENodW5rLmR1cmF0aW9uO1xuICAgIHJldHVybiBkdXJhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25uZWN0IHRoZSBzdHJlYW0gdG8gYW4gYXVkaW8gbm9kZS5cbiAgICpcbiAgICogQHBhcmFtIHtBdWRpb05vZGV9IG5vZGUgLSBBdWRpbyBub2RlIHRvIGNvbm5lY3QgdG8uXG4gICAqL1xuICBjb25uZWN0KG5vZGUpIHtcbiAgICB0aGlzLm91dHB1dC5jb25uZWN0KG5vZGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ldGhvZCBjYWxsZWQgd2hlbiBzdHJlYW0gZmluaXNoZWQgcGxheWluZyBvbiBpdHMgb3duICh3b24ndCBmaXJlIGlmIGxvb3BcbiAgICogZW5hYmxlZCkuXG4gICAqL1xuICBvbmVuZGVkKCkge31cblxuICAvKipcbiAgICogTWV0aG9kIGNhbGxlZCB3aGVuIHN0cmVhbSBkcm9wcyBhIHBhY2tldCAoYXJyaXZlZCB0b28gbGF0ZSkuXG4gICAqL1xuICBvbmRyb3AoKSB7XG4gICAgY29uc29sZS53YXJuKCdhdWRpb3N0cmVhbTogdG9vIGxvbmcgbG9hZGluZywgZGlzY2FyZGluZyBidWZmZXInKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXRob2QgY2FsbGVkIHdoZW4gc3RyZWFtIHJlY2VpdmVkIGEgcGFja2V0IGxhdGUsIGJ1dCBub3QgdG9vIG11Y2ggdG8gZHJvcFxuICAgKiBpdCAoZ2FwIGluIGF1ZGlvKS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgLSBkZWxheSB0aW1lLlxuICAgKi9cbiAgb25sYXRlKHRpbWUpIHt9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHN0cmVhbWluZyBhdWRpbyBzb3VyY2UuXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBvZmZzZXQgLSB0aW1lIGluIGJ1ZmZlciBmcm9tIHdoaWNoIHRvIHN0YXJ0IChpbiBzZWMpXG4gICAqL1xuICBzdGFydChvZmZzZXQgPSAwKSB7XG4gICAgaWYgKHRoaXMuaXNQbGF5aW5nKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1tXQVJOSU5HXSAtIHN0YXJ0KCkgZGlzY2FyZGVkLCBtdXN0IHN0b3AgZmlyc3QnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBjaGVjayBpZiB3ZSBkaXNwb3NlIG9mIHZhbGlkIHVybCB0byBleGVjdXRlIHN0YXJ0XG4gICAgaWYgKHRoaXMuX3VybCA9PT0gbnVsbCkge1xuICAgICAgY29uc29sZS53YXJuKCdbV0FSTklOR10gLSBzdGFydCgpIGRpc2NhcmRlZCwgbXVzdCBkZWZpbmUgdmFsaWQgdXJsIGZpcnN0Jyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gd2UgY29uc2lkZXIgdGhlIHN0cmVhbSBzdGFydGVkIG5vd1xuICAgIHRoaXMuaXNQbGF5aW5nID0gdHJ1ZTtcblxuICAgIGNvbnN0IGJ1ZmZlckluZm8gPSB0aGlzLmJ1ZmZlckluZm9zLmdldCh0aGlzLl91cmwpO1xuICAgIGNvbnN0IGR1cmF0aW9uID0gdGhpcy5kdXJhdGlvbjtcblxuICAgIGlmICh0aGlzLnN5bmMpIHtcbiAgICAgIGNvbnN0IHN5bmNUaW1lID0gdGhpcy5zeW5jU2VydmljZS5nZXRTeW5jVGltZSgpO1xuICAgICAgY29uc3Qgc3RhcnRUaW1lID0gdGhpcy5zeW5jU3RhcnRUaW1lO1xuICAgICAgb2Zmc2V0ID0gc3luY1RpbWUgLSBzdGFydFRpbWUgKyBvZmZzZXQ7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubG9vcClcbiAgICAgIG9mZnNldCA9IG9mZnNldCAlIGR1cmF0aW9uO1xuXG4gICAgLy8gdGhpcyBsb29rcyBjb2hlcmVudCBmb3IgYWxsIGNvbWJpbmF0aW9ucyBvZiBgbG9vcGAgYW5kIGBzeW5jYFxuICAgIC8vIGNvbnNvbGUubG9nKCdvZmZzZXQnLCBvZmZzZXQpO1xuICAgIC8vIGNvbnNvbGUubG9nKCdkdXJhdGlvbicsIGR1cmF0aW9uKTtcblxuICAgIGlmIChvZmZzZXQgPj0gZHVyYXRpb24pIHtcbiAgICAgIGNvbnNvbGUud2FybihgW1dBUk5JTkddIC0gc3RhcnQoKSBkaXNjYXJkZWQsIHJlcXVlc3RlZCBvZmZzZXRcbiAgICAgICAgKCR7b2Zmc2V0fSBzZWMpIGxhcmdlciB0aGFuIGZpbGUgZHVyYXRpb24gKCR7ZHVyYXRpb259IHNlYylgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBmaW5kIGluZGV4IG9mIHRoZSBjaHVuayBjb3JyZXNwb25kaW5nIHRvIGdpdmVuIG9mZnNldFxuICAgIGxldCBpbmRleCA9IDA7XG4gICAgbGV0IG9mZnNldEluRmlyc3RDaHVuayA9IDA7XG4gICAgLy8gY29uc29sZS5sb2coYnVmZmVySW5mbywgaW5kZXgsIGJ1ZmZlckluZm9baW5kZXhdKTtcblxuICAgIHdoaWxlICh0aGlzLl9jdXJyZW50Q2h1bmtJbmRleCA9PT0gLTEgJiYgaW5kZXggPCBidWZmZXJJbmZvLmxlbmd0aCkge1xuICAgICAgY29uc3QgY2h1bmtJbmZvcyA9IGJ1ZmZlckluZm9baW5kZXhdO1xuICAgICAgY29uc3Qgc3RhcnQgPSBjaHVua0luZm9zLnN0YXJ0O1xuICAgICAgY29uc3QgZW5kID0gc3RhcnQgKyBjaHVua0luZm9zLmR1cmF0aW9uO1xuXG4gICAgICBpZiAob2Zmc2V0ID49IHN0YXJ0ICYmIG9mZnNldCA8IGVuZCkge1xuICAgICAgICB0aGlzLl9jdXJyZW50Q2h1bmtJbmRleCA9IGluZGV4O1xuICAgICAgICBvZmZzZXRJbkZpcnN0Q2h1bmsgPSBvZmZzZXQgLSBzdGFydDtcbiAgICAgIH1cblxuICAgICAgaW5kZXggKz0gMTtcbiAgICB9XG5cbiAgICAvLyBoYW5kbGUgbmVnYXRpdmUgb2Zmc2V0LCBwaWNrIGZpcnN0IGNodW5rLiBUaGlzIGNhbiBiZSB1c2VmdWxsIHRvIHN0YXJ0XG4gICAgLy8gc3luY2VkIHN0cmVhbSB3aGlsZSBnaXZlIHRoZW0gc29tZSBkZWxheSB0byBwcmVsb2FkIHRoZSBmaXJzdCBjaHVua1xuICAgIGlmICh0aGlzLl9jdXJyZW50Q2h1bmtJbmRleCA9PT0gLTEgJiYgb2Zmc2V0IDwgMClcbiAgICAgIHRoaXMuX2N1cnJlbnRDaHVua0luZGV4ID0gMDtcblxuICAgIC8vIGNvbnNvbGUubG9nKCdBdWRpb1N0cmVhbS5zdGFydCgpJywgdGhpcy5fdXJsLCB0aGlzLl9jdXJyZW50Q2h1bmtJbmRleCk7XG4gICAgdGhpcy5fc3RvcFJlcXVpcmVkID0gZmFsc2U7XG4gICAgdGhpcy5fcXVldWVFbmRUaW1lID0gdGhpcy5zeW5jU2VydmljZS5nZXRTeW5jVGltZSgpIC0gb2Zmc2V0SW5GaXJzdENodW5rO1xuXG4gICAgLy8gQGltcG9ydGFudCAtIG5ldmVyIGNoYW5nZSB0aGUgb3JkZXIgb2YgdGhlc2UgMiBjYWxsc1xuICAgIHRoaXMuX2ludGVydmFsSWQgPSBzZXRJbnRlcnZhbCh0aGlzLl9yZXF1ZXN0Q2h1bmtzLCB0aGlzLm1vbml0b3JJbnRlcnZhbCk7XG4gICAgdGhpcy5fcmVxdWVzdENodW5rcygpO1xuICB9XG5cbiAgX29uZW5kZWQoKSB7XG4gICAgdGhpcy5pc1BsYXlpbmcgPSBmYWxzZTtcbiAgICB0aGlzLm9uZW5kZWQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9wIHRoZSBhdWRpbyBzdHJlYW0uIE1pbWljcyBBdWRpb0J1ZmZlclNvdXJjZU5vZGUgc3RvcCgpIG1ldGhvZC4gQSBzdG9wcGVkXG4gICAqIGF1ZGlvIHN0cmVhbSBjYW4gYmUgc3RhcnRlZCAobm8gbmVlZCB0byBjcmVhdGUgYSBuZXcgb25lIGFzIHJlcXVpcmVkIHdoZW5cbiAgICogdXNpbmcgYW4gQXVkaW9CdWZmZXJTb3VyY2VOb2RlKS5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IG9mZnNldCAtIG9mZnNldCB0aW1lIChpbiBzZWMpIGZyb20gbm93IGF0IHdoaWNoXG4gICAqICB0aGUgYXVkaW8gc3RyZWFtIHNob3VsZCBzdG9wIHBsYXlpbmcuXG4gICAqL1xuICBzdG9wKG9mZnNldCA9IDApIHtcbiAgICBpZiAoIXRoaXMuaXNQbGF5aW5nKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1tXQVJOSU5HXSAtIHN0b3AgZGlzY2FyZGVkLCBub3Qgc3RhcnRlZCBvciBhbHJlYWR5IGVuZGVkJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2ludGVydmFsSWQgIT09IHVuZGVmaW5lZClcbiAgICAgIHRoaXMuX2NsZWFyUmVxdWVzdENodW5rcygpO1xuXG5cbiAgICB0aGlzLl9zdG9wUmVxdWlyZWQgPSB0cnVlOyAvLyBhdm9pZCBwbGF5aW5nIGJ1ZmZlciB0aGF0IGFyZSBjdXJyZW50bHkgbG9hZGluZ1xuICAgIHRoaXMuX3Jlc2V0KCk7XG5cbiAgICBjb25zdCBub3cgPSB0aGlzLnN5bmNTZXJ2aWNlLmdldFN5bmNUaW1lKCk7XG4gICAgY29uc3QgYXVkaW9UaW1lID0gYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lO1xuICAgIGNvbnN0IHNpemUgPSB0aGlzLl9zcmNNYXAuc2l6ZTtcbiAgICBsZXQgY291bnRlciA9IDA7XG5cbiAgICB0aGlzLl9zcmNNYXAuZm9yRWFjaCgoc3JjLCBzdGFydFRpbWUpID0+IHtcbiAgICAgIGNvdW50ZXIgKz0gMTtcbiAgICAgIHNyYy5vbmVuZGVkID0gbnVsbDtcblxuICAgICAgLy8gcGljayBhIHNvdXJjZSBhcmJpdHJhcmlseSB0byB0cmlnZ2VyIHRoZSBgb25lbmRlZGAgZXZlbnQgcHJvcGVybHlcbiAgICAgIGlmIChjb3VudGVyID09PSBzaXplKVxuICAgICAgICBzcmMub25lbmRlZCA9IHRoaXMuX29uZW5kZWQ7XG5cbiAgICAgIGlmIChzdGFydFRpbWUgPCAobm93ICsgb2Zmc2V0KSB8fMKgc3JjLm9uZW5kZWQgIT09IG51bGwpXG4gICAgICAgIHNyYy5zdG9wKGF1ZGlvVGltZSArIG9mZnNldCk7XG4gICAgICBlbHNlXG4gICAgICAgIHNyYy5zdG9wKGF1ZGlvVGltZSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9zcmNNYXAuY2xlYXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiB3ZSBoYXZlIGVub3VnaCBcImxvY2FsIGJ1ZmZlciB0aW1lXCIgZm9yIHRoZSBhdWRpbyBzdHJlYW0sXG4gICAqIHJlcXVlc3QgbmV3IGJ1ZmZlciBjaHVua3Mgb3RoZXJ3aXNlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3JlcXVlc3RDaHVua3MoKSB7XG4gICAgY29uc3QgYnVmZmVySW5mbyA9IHRoaXMuYnVmZmVySW5mb3MuZ2V0KHRoaXMuX3VybCk7XG4gICAgY29uc3Qgbm93ID0gdGhpcy5zeW5jU2VydmljZS5nZXRTeW5jVGltZSgpO1xuXG4gICAgLy8gaGF2ZSB0byBkZWFsIHByb3Blcmx5IHdpdGhcbiAgICB3aGlsZSAodGhpcy5fcXVldWVFbmRUaW1lIC0gbm93IDw9IHRoaXMucmVxdWlyZWRBZHZhbmNlVGhyZXNob2xkKSB7XG4gICAgICAvLyBpbiBub24gc3luYyBtb2RlLCB3ZSB3YW50IHRoZSBzdGFydCB0aW1lIHRvIGJlIGRlbGF5ZWQgd2hlbiB0aGUgZmlyc3RcbiAgICAgIC8vIGJ1ZmZlciBpcyBhY3R1YWxseSByZWNlaXZlZCwgc28gd2UgbG9hZCBpdCBiZWZvcmUgcmVxdWVzdGluZyBuZXh0IG9uZXNcbiAgICAgIGlmICh0aGlzLl9maXJzdFBhY2tldFN0YXRlID09PSAxICYmICF0aGlzLl9zeW5jKVxuICAgICAgICByZXR1cm47XG5cbiAgICAgIGNvbnN0IGNodW5rSW5mb3MgPSBidWZmZXJJbmZvW3RoaXMuX2N1cnJlbnRDaHVua0luZGV4XTtcbiAgICAgIGNvbnN0IGNodW5rU3RhcnRUaW1lID0gdGhpcy5fcXVldWVFbmRUaW1lIC0gY2h1bmtJbmZvcy5vdmVybGFwU3RhcnQ7XG4gICAgICBjb25zdCBuYW1lID0gY2h1bmtJbmZvcy5uYW1lO1xuICAgICAgLy8gQHRvZG8gLSBjb3VsZCBwcm9iYWJseSBiZSBkb25lIG1vcmUgZWxlZ2FudGx5Li4uXG4gICAgICBjb25zdCB1cmwgPSBuYW1lLnN1YnN0cihuYW1lLmluZGV4T2YoJ3B1YmxpYycpICsgNywgbmFtZS5sZW5ndGggLSAxKTtcblxuICAgICAgLy8gZmxhZyB0aGF0IGZpcnN0IHBhY2tldCBoYXMgYmVlbiByZXF1aXJlZCBhbmQgdGhhdCB3ZSBtdXN0IGF3YWl0IGZvciBpdHNcbiAgICAgIC8vIGFycml2YWwgaW4gdW5zeW5jIG1vZGUgYmVmb3JlIGFza2luZyBmb3IgbW9yZSwgYXMgdGhlIG5ldHdvcmsgZGVsYXlcbiAgICAgIC8vIHdpbGwgZGVmaW5lIHRoZSBgdHJ1ZWAgc3RhcnQgdGltZVxuICAgICAgaWYgKHRoaXMuX2ZpcnN0UGFja2V0U3RhdGUgPT09IDAgJiYgIXRoaXMuX3N5bmMpXG4gICAgICAgIHRoaXMuX2ZpcnN0UGFja2V0U3RhdGUgPSAxO1xuXG4gICAgICAvLyBjb25zb2xlLmxvZygnY3VycmVudENodW5rSW5kZXgnLCB0aGlzLl9jdXJyZW50Q2h1bmtJbmRleCk7XG4gICAgICAvLyBjb25zb2xlLmxvZygndGltZUF0UXVldWVFbmQnLCB0aGlzLl9xdWV1ZUVuZFRpbWUpO1xuICAgICAgLy8gY29uc29sZS5sb2coJ2NodW5rU3RhcnRUaW1lJywgY2h1bmtTdGFydFRpbWUpO1xuXG4gICAgICBjb25zdCBjdXJyZW50Q2h1bmtJbmRleCA9IHRoaXMuX2N1cnJlbnRDaHVua0luZGV4O1xuXG4gICAgICB0aGlzLl9jdXJyZW50Q2h1bmtJbmRleCArPSAxO1xuICAgICAgdGhpcy5fcXVldWVFbmRUaW1lICs9IGNodW5rSW5mb3MuZHVyYXRpb247XG5cbiAgICAgIGxldCBpc0xhc3RDaHVuayA9IGZhbHNlO1xuXG4gICAgICBpZiAodGhpcy5fY3VycmVudENodW5rSW5kZXggPT09IGJ1ZmZlckluZm8ubGVuZ3RoKSB7XG4gICAgICAgIGlmICh0aGlzLl9sb29wKSB7XG4gICAgICAgICAgdGhpcy5fY3VycmVudENodW5rSW5kZXggPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGhhcyB0aGlzIG1ldGhvZCBpcyBjYWxsZWQgb25jZSBvdXRzaWRlIHRoZSBsb29wLCBpdCBtaWdodCBhcHBlbmRcbiAgICAgICAgICAvLyB0aGF0IHdlIGZpbmlzaCB0aGUgd2hvbGUgbG9hZGluZyB3aXRob3V0IGFjdHVhbGx5IGhhdmluZyBhblxuICAgICAgICAgIC8vIGludGVydmFsSWQsIG1heWJlIGhhbmRsZSB0aGlzIG1vcmUgcHJvcGVybHkgd2l0aCByZWNjdXJzaXZlXG4gICAgICAgICAgLy8gYHNldFRpbWVvdXRgc1xuICAgICAgICAgIGlmICh0aGlzLl9pbnRlcnZhbElkKVxuICAgICAgICAgICAgdGhpcy5fY2xlYXJSZXF1ZXN0Q2h1bmtzKCk7XG4gICAgICAgICAgLy8gYnV0IHJlc2V0IGxhdGVyIGFzIHRoZSBsYXN0IGNodW5rIHN0aWxsIG5lZWRzIHRoZSBjdXJyZW50IG9mZnNldHNcbiAgICAgICAgICBpc0xhc3RDaHVuayA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gbG9hZCBhbmQgYWRkIGJ1ZmZlciB0byBxdWV1ZVxuICAgICAgbG9hZEF1ZGlvQnVmZmVyKHVybCkudGhlbigoYnVmZmVyKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLl9zdG9wUmVxdWlyZWQpXG4gICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgIC8vIG1hcmsgdGhhdCBmaXJzdCBwYWNrZXQgYXJyaXZlZCBhbmQgdGhhdCB3ZSBjYW4gYXNrIGZvciBtb3JlXG4gICAgICAgIGlmICh0aGlzLl9maXJzdFBhY2tldFN0YXRlID09PSAxICYmICF0aGlzLl9zeW5jKVxuICAgICAgICAgIHRoaXMuX2ZpcnN0UGFja2V0U3RhdGUgPSAyO1xuXG4gICAgICAgIGNvbnN0IHsgb3ZlcmxhcFN0YXJ0LCBvdmVybGFwRW5kIH0gPSBjaHVua0luZm9zO1xuICAgICAgICB0aGlzLl9hZGRCdWZmZXJUb1F1ZXVlKGJ1ZmZlciwgY2h1bmtTdGFydFRpbWUsIG92ZXJsYXBTdGFydCwgb3ZlcmxhcEVuZCwgaXNMYXN0Q2h1bmspO1xuXG4gICAgICAgIGlmIChpc0xhc3RDaHVuaylcbiAgICAgICAgICB0aGlzLl9yZXNldCgpO1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChpc0xhc3RDaHVuaylcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFN0b3AgbG9va2luZyBmb3IgbmV3IGNodW5rc1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2NsZWFyUmVxdWVzdENodW5rcygpIHtcbiAgICAvLyBjb25zb2xlLmxvZyhgQXVkaW9TdHJlYW0uX2NsZWFyUmVxdWVzdENodW5rcygpICR7dGhpcy5fdXJsfSAtIGNsZWFySW50ZXJ2YWxgLCB0aGlzLl9pbnRlcnZhbElkKTtcbiAgICBjbGVhckludGVydmFsKHRoaXMuX2ludGVydmFsSWQpO1xuICAgIHRoaXMuX2ludGVydmFsSWQgPSB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGF1ZGlvIGJ1ZmZlciB0byBzdHJlYW0gcXVldWUuXG4gICAqXG4gICAqIEBwYXJhbSB7QXVkaW9CdWZmZXJ9IGJ1ZmZlciAtIEF1ZGlvIGJ1ZmZlciB0byBhZGQgdG8gcGxheWluZyBxdWV1ZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHN0YXJ0VGltZSAtIFRpbWUgYXQgd2hpY2ggYXVkaW8gYnVmZmVyIHBsYXlpbmcgaXMgZHVlLlxuICAgKiBAcGFyYW0ge051bWJlcn0gb3ZlcmxhcFN0YXJ0IC0gRHVyYXRpb24gKGluIHNlYykgb2YgdGhlIGFkZGl0aW9uYWwgYXVkaW9cbiAgICogIGNvbnRlbnQgYWRkZWQgYnkgdGhlIG5vZGUtYXVkaW8tc2xpY2VyIChvbiBzZXJ2ZXIgc2lkZSkgYXQgYXVkaW8gYnVmZmVyJ3NcbiAgICogIGhlYWQgKHVzZWQgaW4gZmFkZS1pbiBtZWNoYW5pc20gdG8gYXZvaWQgcGVyY2VpdmluZyBwb3RlbnRpYWwgLm1wM1xuICAgKiAgZW5jb2RpbmcgYXJ0aWZhY3RzIGludHJvZHVjZWQgd2hlbiBidWZmZXIgc3RhcnRzIHdpdGggbm9uLXplcm8gdmFsdWUpXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBvdmVybGFwRW5kIC0gRHVyYXRpb24gKGluIHNlYykgb2YgdGhlIGFkZGl0aW9uYWwgYXVkaW9cbiAgICogIGNvbnRlbnQgYWRkZWQgYXQgYXVkaW8gYnVmZmVyJ3MgdGFpbC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9hZGRCdWZmZXJUb1F1ZXVlKGJ1ZmZlciwgc3RhcnRUaW1lLCBvdmVybGFwU3RhcnQsIG92ZXJsYXBFbmQsIGlzTGFzdENodW5rKSB7XG4gICAgLy8gaGFyZC1jb2RlIG92ZXJsYXAgZmFkZS1pbiBhbmQgb3V0IGluIGJ1ZmZlclxuICAgIGNvbnN0IG51bVNhbXBsZXNGYWRlSW4gPSBNYXRoLmZsb29yKG92ZXJsYXBTdGFydCAqIGJ1ZmZlci5zYW1wbGVSYXRlKTtcbiAgICBjb25zdCBudW1TYW1wbGVzRmFkZU91dCA9IE1hdGguZmxvb3Iob3ZlcmxhcEVuZCAqIGJ1ZmZlci5zYW1wbGVSYXRlKTtcbiAgICAvLyBsb29wIG92ZXIgYXVkaW8gY2hhbm5lbHNcbiAgICBmb3IgKGxldCBjaGFubmVsID0gMDsgY2hhbm5lbCA8IGJ1ZmZlci5udW1iZXJPZkNoYW5uZWxzOyBjaGFubmVsKyspIHtcbiAgICAgIGNvbnN0IGNoYW5uZWxEYXRhID0gYnVmZmVyLmdldENoYW5uZWxEYXRhKGNoYW5uZWwpO1xuXG4gICAgICAvLyBmYWRlIGluXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVNhbXBsZXNGYWRlSW47IGkrKykge1xuICAgICAgICBjb25zdCBnYWluID0gaSAvIChudW1TYW1wbGVzRmFkZUluIC0gMSk7XG4gICAgICAgIGNoYW5uZWxEYXRhW2ldID0gY2hhbm5lbERhdGFbaV0gKiBnYWluO1xuICAgICAgfVxuXG4gICAgICAvLyBmYWRlIG91dFxuICAgICAgZm9yIChsZXQgaSA9IGNoYW5uZWxEYXRhLmxlbmd0aCAtIG51bVNhbXBsZXNGYWRlT3V0OyBpIDwgY2hhbm5lbERhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgZ2FpbiA9IChjaGFubmVsRGF0YS5sZW5ndGggLSBpIC0gMSkgLyAobnVtU2FtcGxlc0ZhZGVPdXQgLSAxKTtcbiAgICAgICAgY2hhbm5lbERhdGFbaV0gPSBjaGFubmVsRGF0YVtpXSAqIGdhaW47XG4gICAgICB9XG4gICAgfVxuXG5cbiAgICBjb25zdCBzeW5jVGltZSA9IHRoaXMuc3luY1NlcnZpY2UuZ2V0U3luY1RpbWUoKTtcbiAgICBjb25zdCBub3cgPSBhdWRpb0NvbnRleHQuY3VycmVudFRpbWU7XG4gICAgbGV0IG9mZnNldCA9IHN0YXJ0VGltZSAtIHRoaXMuc3luY1NlcnZpY2UuZ2V0U3luY1RpbWUoKTtcblxuICAgIC8vIC0gaW4gYG5vbiBzeW5jYCBzY2VuYXJpbywgd2Ugd2FudCB0byB0YWtlIGluIGFjY291bnQgdGhlIGxhdGVuY3kgaW5kdWNlZFxuICAgIC8vIGJ5IHRoZSBsb2FkaW5nIG9mIHRoZSBmaXJzdCBjaHVuay4gVGhpcyBsYXRlbmN5IG11c3QgdGhlbiBiZSBhcHBsaWVkXG4gICAgLy8gdG8gYWxsIHN1YnNlcXVlbnQgY2h1bmtzLlxuICAgIC8vIC0gaW4gYHN5bmNgIHNjZW5hcmlvcywgd2UganVzdCBsZXQgdGhlIGxvZ2ljYWwgc3RhcnQgdGltZSBhbmQgY29tcHV0ZWRcbiAgICAvLyBvZmZzZXQgZG8gdGhlaXIgam9iLi4uXG4gICAgaWYgKCF0aGlzLl9zeW5jKSB7XG4gICAgICAvL1xuICAgICAgaWYgKHRoaXMuX2ZpcnN0Q2h1bmtOZXR3b3JrTGF0ZW5jeU9mZnNldCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICB0aGlzLl9maXJzdENodW5rTmV0d29ya0xhdGVuY3lPZmZzZXQgPSBvZmZzZXQ7XG5cbiAgICAgIG9mZnNldCAtPSB0aGlzLl9maXJzdENodW5rTmV0d29ya0xhdGVuY3lPZmZzZXQ7XG4gICAgfVxuXG4gICAgLy8gaWYgY29tcHV0ZWQgb2Zmc2V0IGlzIHNtYWxsZXIgdGhhbiBkdXJhdGlvblxuICAgIGlmICgtb2Zmc2V0IDw9IGJ1ZmZlci5kdXJhdGlvbikge1xuICAgICAgLy8gY3JlYXRlIGF1ZGlvIHNvdXJjZVxuICAgICAgY29uc3Qgc3JjID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuICAgICAgc3JjLmNvbm5lY3QodGhpcy5vdXRwdXQpO1xuICAgICAgc3JjLmJ1ZmZlciA9IGJ1ZmZlcjtcblxuICAgICAgaWYgKG9mZnNldCA8IDApIHtcbiAgICAgICAgc3JjLnN0YXJ0KG5vdywgLW9mZnNldCk7XG4gICAgICAgIC8vIHRoZSBjYWxsYmFjayBzaG91bGQgYmUgY2FsbGVkIGFmdGVyIHN0YXJ0XG4gICAgICAgIHRoaXMub25sYXRlKC1vZmZzZXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3JjLnN0YXJ0KG5vdyArIG9mZnNldCwgMCk7XG4gICAgICB9XG5cblxuICAgICAgLy8ga2VlcCBhbmQgY2xlYW4gcmVmZXJlbmNlIHRvIHNvdXJjZVxuICAgICAgdGhpcy5fc3JjTWFwLnNldChzdGFydFRpbWUsIHNyYyk7XG5cbiAgICAgIHNyYy5vbmVuZGVkID0gKCkgPT4ge1xuICAgICAgICB0aGlzLl9zcmNNYXAuZGVsZXRlKHN0YXJ0VGltZSk7XG5cbiAgICAgICAgaWYgKGlzTGFzdENodW5rKVxuICAgICAgICAgIHRoaXMuX29uZW5kZWQoKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub25kcm9wKCk7XG4gICAgfVxuICB9XG5cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgQXVkaW9TdHJlYW1NYW5hZ2VyKTtcbmV4cG9ydCBkZWZhdWx0IEF1ZGlvU3RyZWFtTWFuYWdlcjtcbiJdfQ==