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


// load an audio buffer from server's disk (based on XMLHttpRequest)
function loadAudioBuffer(chunkName) {
  var promise = new _promise2.default(function (resolve, reject) {
    // create request
    var request = new XMLHttpRequest();
    request.open('GET', chunkName, true);
    request.responseType = 'arraybuffer';
    // define request callback
    request.onload = function () {
      _wavesAudio.audioContext.decodeAudioData(request.response, function (buffer) {
        resolve(buffer);
      }, function (e) {
        reject(e);
      });
    };
    // send request
    request.send();
  });
  return promise;
}

/**
 * Interface for the client `'audio-stream-manager'` service.
 *
 * This service allows to stream audio buffers to the client during the experience
 * (not preloaded). Input audio files are segmented by the server upon startup and 
 * sent to the clients upon request. Service only accepts .wav files at the moment.
 * Service main objective is to 1) enable synced streaming between clients (not precise
 * if based on mediaElementSources), and 2) provide an equivalent to the mediaElementSource
 * object (streaming as a Web Audio API node) that could be plugged to any other node in Safari
 * (bypassing e.g. gain or analyzer nodes when plugged to mediaElementSource).
 *
 * __*The service must be used with its [server-side counterpart]{@link module:soundworks/server.AudioStreamManager}*__
 *
 * @param {Object} options
 * @param {Number} options.monitorInterval - Interval time (in sec) at which the client will check if it has enough 
 *  preloaded audio data to ensure streaming or if it needs to require some more.
 * @param {Number} options.requiredAdvanceThreshold - Threshold time (in sec) of preloaded audio data below which 
 *  the client will require a new audio chunk.
 *
 * @memberof module:soundworks/client
 * @example
 * // require the `audio-stream-manager` (in experience constructor)
 * this.audioStreamManager = this.require('audio-stream-manager', {monitorInterval: 1, requiredAdvanceThreshold: 10});
 *
 * // request new audio stream from the stream manager (in experience start method)
 * let audioStream = this.audioStreamManager.getAudioStream();
 * // setup and start audio stream
 * audioStream.url = 'my-audio-file-name'; // without extension
 * audioStream.connect( audioContext.destination ); // connect as you would any audio node from the web audio api
 * audioStream.loop = false; // disable loop
 * audioStream.sync = false; // disable synchronization
 * audioStream.onended = function(){ console.log('stream ended'); }; // mimics AudioBufferSourceNode onended method
 * audioStream.start(); // start audio stream
 */

var AudioStreamManager = function (_Service) {
  (0, _inherits3.default)(AudioStreamManager, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instantiated manually_ */
  function AudioStreamManager() {
    (0, _classCallCheck3.default)(this, AudioStreamManager);

    // locals
    var _this = (0, _possibleConstructorReturn3.default)(this, (AudioStreamManager.__proto__ || (0, _getPrototypeOf2.default)(AudioStreamManager)).call(this, SERVICE_ID, false));

    _this.bufferInfos = new _map2.default();
    // configure options
    var defaults = {
      monitorInterval: 1, // in seconds
      requiredAdvanceThreshold: 10 // in seconds
    };
    _this.configure(defaults);
    // services
    _this.syncService = _this.require('sync');
    // bindings
    _this._onAcknowledgeResponse = _this._onAcknowledgeResponse.bind(_this);
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(AudioStreamManager, [{
    key: 'start',
    value: function start() {
      (0, _get3.default)(AudioStreamManager.prototype.__proto__ || (0, _getPrototypeOf2.default)(AudioStreamManager.prototype), 'start', this).call(this);
      // send request for infos on "streamable" audio files
      this.receive('acknowlegde', this._onAcknowledgeResponse);
      this.send('request');
    }

    /**
     * @private
     * @param {Object} bufferInfos - info on audio files that can be streamed
     */

  }, {
    key: '_onAcknowledgeResponse',
    value: function _onAcknowledgeResponse(bufferInfos) {
      var _this2 = this;

      // shape buffer infos
      bufferInfos.forEach(function (item) {
        // get file name (assume at least 1 chunk in item)
        var fileName = item[0].name.split("/").pop();
        fileName = fileName.substr(fileName.indexOf("-") + 1, fileName.lastIndexOf(".") - 2);
        // save in locals
        _this2.bufferInfos.set(fileName, item);
      });

      // flag service as ready
      this.ready();
    }

    /**
     * Return a new audio stream node.
     */

  }, {
    key: 'getAudioStream',
    value: function getAudioStream() {
      return new AudioStream(this.bufferInfos, this.syncService, this.options.monitorInterval, this.options.requiredAdvanceThreshold);
    }
  }]);
  return AudioStreamManager;
}(_Service3.default);

// register / export service


_serviceManager2.default.register(SERVICE_ID, AudioStreamManager);
exports.default = AudioStreamManager;

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
  function AudioStream(bufferInfos, syncService, monitorInterval, requiredAdvanceThreshold) {
    (0, _classCallCheck3.default)(this, AudioStream);


    // arguments
    this.bufferInfos = bufferInfos;
    this.syncService = syncService;
    this.monitorInterval = monitorInterval * 1000; // in ms
    this.requiredAdvanceThreshold = requiredAdvanceThreshold;

    // local attr.
    this._sync = false;
    this._loop = false;
    this._metaData = undefined;
    this._out = _wavesAudio.audioContext.createGain();

    // stream monitoring
    this._chunkRequestCallbackInterval = undefined;
    this._ctx_time_when_queue_ends = 0;
    this._srcMap = new _map2.default();
    this._reset();
    this._stopRequired = false;

    // bind
    this._chunkRequestCallback = this._chunkRequestCallback.bind(this);
    this.onended = this.onended.bind(this);
  }

  /**
   * Init / reset local attributes (at stream creation and stop() ).
   * @private
   **/


  (0, _createClass3.default)(AudioStream, [{
    key: '_reset',
    value: function _reset() {
      this._offsetInFirstBuffer = 0;
      this._offsetInFirstBufferAccountedFor = false;
      this._ctxStartTime = -1;
      this._unsyncStartOffset = undefined;
      this._currentBufferIndex = -1;
      this._firstPacketState = 0;
    }

    /** 
     * Define url of audio file to stream, send meta data request to server concerning this file.
     * @param {String} url - requested file name, without extension
     **/

  }, {
    key: 'connect',


    /**
     * Connect audio stream to an audio node.
     * @param {AudioNode} node - node to connect to.
     **/
    value: function connect(node) {
      this._out.connect(node);
    }

    /**
     * Method called when stream finished playing on its own (won't fire if loop enabled).
     **/

  }, {
    key: 'onended',
    value: function onended() {}

    /**
     * Return true if stream is playing, false otherwise.
     **/

  }, {
    key: 'isPlaying',
    value: function isPlaying() {
      if (this._chunkRequestCallbackInterval === undefined) {
        return false;
      } else {
        return true;
      }
    }

    /** 
     * Start streaming audio source.
     * @param {Number} offset - time in buffer from which to start (in sec).
     **/

  }, {
    key: 'start',
    value: function start(offset) {

      // check if we dispose of valid url to execute start
      if (this._url === undefined) {
        console.warn('start command discarded, must define valid url first');
        return;
      }

      // get total duration of targetted audio file
      var bufferInfo = this.bufferInfos.get(this._url);
      var duration = this.duration;

      // make sure offset requested is valid
      if (offset >= duration || offset < 0) {
        console.warn('requested offset:', offset, 'sec. larger than file duration:', duration, 'sec, start() discarded');
        return;
      }

      // unflag stop required
      this._stopRequired = false;

      // if sync, either use offset for quatization start or sync with running loop 
      if (this._sync) {
        // quantization mode: start with offset in file to match period (offset must be computed accordingly, in parent who calls this method)
        if (offset !== undefined) {
          if (offset >= duration) {
            console.error('req. offset above file duration', offset, duration);
          }
        }
        // sync in "running loop" mode
        else {
            offset = this.syncService.getSyncTime() % duration;
          }
      }
      // set default offset if not defined
      else {
          offset = offset !== undefined ? offset : 0;
        }

      // init queue timer
      this._ctx_time_when_queue_ends = this.syncService.getSyncTime();

      // find first index in buffer list for given offset
      var index = 1;
      while (this._currentBufferIndex < 0) {
        // if index corresponds to the buffer after the one we want || last index in buffer
        if (index === bufferInfo.length || offset < bufferInfo[index].start) {
          this._currentBufferIndex = index - 1;
          this._offsetInFirstBuffer = offset - bufferInfo[this._currentBufferIndex].start;
          // console.log('global offset:', offset, 'local offset:', this._offsetInFirstBuffer, 'file starts at:', bufferInfo[this._currentBufferIndex].start, 'total dur:', duration);
        }
        index += 1;
      }

      // start stream request chunks callback
      this._chunkRequestCallback(); // start with one call right now
      this._chunkRequestCallbackInterval = setInterval(this._chunkRequestCallback, this.monitorInterval);
    }

    /** 
     * Check if we have enough "local buffer time" for the audio stream, 
     * request new buffer chunks otherwise.
     * @private
     **/

  }, {
    key: '_chunkRequestCallback',
    value: function _chunkRequestCallback() {
      var _this3 = this;

      // get array of streamed chunks info
      var bufferInfo = this.bufferInfos.get(this._url);

      // loop: do we need to request more chunks? if so, do, increment time flag, ask again

      var _loop = function _loop() {

        // mechanism to force await first buffer to offset whole queue in unsync mode
        if (_this3._firstPacketState == 1 && !_this3._sync) {
          return {
            v: void 0
          };
        }

        // get current working chunk info
        var metaBuffer = bufferInfo[_this3._currentBufferIndex];

        // get context absolute time at which current buffer must be started
        // this "const" here allows to define a unique ctx_startTime per while loop that will 
        // be used in its corresponding loadAudioBuffer callback. (hence not to worry in sync.
        // mode if the first loaded audio buffer is not the first requested)
        var ctx_startTime = _this3._ctx_time_when_queue_ends - metaBuffer.overlapStart;

        // get buffer name (remove "public" from address)
        var chunkName = metaBuffer.name.substr(metaBuffer.name.indexOf('public') + 7, metaBuffer.name.length - 1);

        // load and add buffer to queue
        loadAudioBuffer(chunkName).then(function (buffer) {
          // discard if stop required since
          if (_this3._stopRequired) {
            return;
          }
          _this3._addBufferToQueue(buffer, ctx_startTime, metaBuffer.overlapStart, metaBuffer.overlapEnd);
          // mark that first packet arrived and that we can ask for more
          if (_this3._firstPacketState == 1 && !_this3._sync) {
            _this3._firstPacketState = 2;
          }
        });

        // flag that first packet has been required and that we must await for its arrival in unsync mode before asking for more
        if (_this3._firstPacketState == 0 && !_this3._sync) {
          _this3._firstPacketState = 1;
        }

        // increment
        _this3._currentBufferIndex += 1;
        _this3._ctx_time_when_queue_ends += metaBuffer.duration;
        // need to increment queue time of only a percentage of first buffer duration (for sync mode)
        if (!_this3._offsetInFirstBufferAccountedFor) {
          _this3._ctx_time_when_queue_ends -= _this3._offsetInFirstBuffer;
          _this3._offsetInFirstBufferAccountedFor = true;
        }

        // check if reached end of chunk list (i.e. end of file) at next iteration
        if (_this3._currentBufferIndex === bufferInfo.length) {
          if (_this3._loop) {
            _this3._currentBufferIndex = 0;
          } else {
            // soft stop
            _this3._drop();
            // activate onended callback (todo: should be called by last AudioBufferSource rather than with setTimeout) 
            var timeBeforeEnd = _this3._ctx_time_when_queue_ends - _this3.syncService.getSyncTime();
            setTimeout(function () {
              _this3.onended();
            }, timeBeforeEnd * 1000);
            return {
              v: void 0
            };
          }
        }
      };

      while (this._ctx_time_when_queue_ends - this.syncService.getSyncTime() <= this.requiredAdvanceThreshold) {
        var _ret = _loop();

        if ((typeof _ret === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret)) === "object") return _ret.v;
      }
    }

    /**
     * Add audio buffer to stream queue.
     * @param {AudioBuffer} buffer - Audio buffer to add to playing queue.
     * @param {Number} startTime - Time at which audio buffer playing is due.
     * @param {Number} overlapStart - Duration (in sec) of the additional audio content added by the 
     *  node-audio-slicer (on server side) at audio buffer's head (used in fade-in mechanism to avoid
     *  perceiving potential .mp3 encoding artifacts introduced when buffer starts with non-zero value)
     * @param {Number} overlapEnd - Duration (in sec) of the additional audio content added at audio 
     * buffer's tail.
     * @private
     **/

  }, {
    key: '_addBufferToQueue',
    value: function _addBufferToQueue(buffer, startTime, overlapStart, overlapEnd) {
      var _this4 = this;

      // get relative start time (in  how many seconds from now must the buffer be played)
      var relStartTime = startTime - this.syncService.getSyncTime();

      // non sync scenario: should play whole first buffer when downloaded
      if (!this._sync) {
        // first packet: keep track off init offset (MUST BE FIRST PACKET REGARDING TIME LINE, hence _firstPacketState based mechanism above)
        if (this._unsyncStartOffset === undefined) {
          this._unsyncStartOffset = relStartTime;
        }
        relStartTime -= this._unsyncStartOffset;
      }
      // sync scenario: should play in first buffer to stay in sync
      else {
          // hack: use _unsyncStartOffset to check if first time we come here
          if (this._unsyncStartOffset === undefined) {
            this._unsyncStartOffset = -1; // just so we don't come here again
            relStartTime -= this._offsetInFirstBuffer;
          }
        }

      // if then relStartTime is above source buffer duration
      if (-relStartTime >= buffer.duration) {
        console.warn('audiostream: too long loading, discarding buffer');
        return;
      }

      // console.log( 'add buffer to queue starting at', startTime, 'i.e. in', relStartTime, 'sec' );

      // hard-code overlap fade-in and out into buffer
      var nSampFadeIn = Math.floor(overlapStart * buffer.sampleRate);
      var nSampFadeOut = Math.floor(overlapEnd * buffer.sampleRate);
      // loop over audio channels
      for (var chId = 0; chId < buffer.numberOfChannels; chId++) {
        // get ref to audio data
        var chData = buffer.getChannelData(chId);
        // fade in
        for (var i = 0; i < nSampFadeIn; i++) {
          chData[i] = chData[i] * (i / (nSampFadeIn - 1));
        }
        // fade out
        for (var _i = chData.length - nSampFadeOut; _i < chData.length; _i++) {
          chData[_i] = chData[_i] * (chData.length - _i - 1) / (nSampFadeOut - 1);
        }
      }

      // create audio source
      var src = _wavesAudio.audioContext.createBufferSource();
      src.buffer = buffer;
      // connect graph
      src.connect(this._out);

      // start source now (not from beginning since we're already late)
      var now = _wavesAudio.audioContext.currentTime;
      if (relStartTime < 0) {
        src.start(now, -relStartTime);
      }
      // start source delayed (from beginning in abs(relStartTime) seconds)
      else {
          src.start(now + relStartTime, 0);
        }
      // keep ref. to source
      this._srcMap.set(startTime, src);
      // source removes itself from locals when ended
      src.onended = function () {
        _this4._srcMap.delete(startTime);
      };
    }

    /** 
     * Stop the audio stream. Mimics AudioBufferSourceNode stop() method. A stopped 
     * audio stream can be started (no need to create a new one as required when using
     * an AudioBufferSourceNode).
     * @param {Number} when - offset time (in sec) from now (when command issued) at which
     *  the audio stream should stop playing.
     **/

  }, {
    key: 'stop',
    value: function stop() {
      var _this5 = this;

      var when = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      // no need to stop if not started
      if (!this.isPlaying()) {
        console.warn('stop discarded, must start first');
        return;
      }
      this._drop();
      // flag stop required to avoid playing newly loaded buffers
      this._stopRequired = true;
      // kill sources
      this._srcMap.forEach(function (src, startTime) {
        // if source due to start after stop time
        if (startTime >= _this5.syncService.getSyncTime() + when) {
          src.stop(_wavesAudio.audioContext.currentTime);
        }
        // stop all sources currently playing in "when" (don't care if source then stopped by itself)
        else {
            src.stop(_wavesAudio.audioContext.currentTime + when);
          }
      });
    }

    /**
     * local stop: end streaming requests, clear streaming callbacks, etc.
     * in short, stop all but stop the audio sources, to use _drop() rather 
     * than stop() in "audio file over and not loop" scenario.
     * @private
     **/

  }, {
    key: '_drop',
    value: function _drop() {
      // reset local values
      this._reset();
      // kill callback
      clearInterval(this._chunkRequestCallbackInterval);
      this._chunkRequestCallbackInterval = undefined;
    }
  }, {
    key: 'url',
    set: function set(fileName) {
      // discard if currently playing
      if (this.isPlaying()) {
        console.warn('set url ignored while playing');
        return;
      }
      // check if url corresponds with a streamable file
      if (this.bufferInfos.get(fileName)) {
        this._url = fileName;
      }
      // discard otherwise
      else {
          console.error(fileName, 'url not in', this.bufferInfos, ', \n ### url discarded');
        }
    }

    /**
     * Set/Get synchronized mode status. in non sync. mode, the stream audio
     * will start whenever the first audio buffer is downloaded. in sync. mode, 
     * the stream audio will start (again asa the audio buffer is downloaded) 
     * with an offset in the buffer, as if it started playing exactly when the 
     * start() command was issued.
     * @param {Bool} val - enable / disable sync
     **/

  }, {
    key: 'sync',
    set: function set(val) {
      if (this.isPlaying()) {
        console.warn('set sync ignored while playing');
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
     **/

  }, {
    key: 'loop',
    set: function set(val) {
      if (this.isPlaying()) {
        console.warn('set loop ignored while playing');
        return;
      }
      this._loop = val;
    },
    get: function get() {
      return this._loop;
    }

    /**
     * Return the total duration (in secs) of the audio file currently streamed.
     **/

  }, {
    key: 'duration',
    get: function get() {
      var bufferInfo = this.bufferInfos.get(this._url);
      var endBuffer = bufferInfo[bufferInfo.length - 1];
      var duration = endBuffer.start + endBuffer.duration;
      return duration;
    }
  }]);
  return AudioStream;
}();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1ZGlvU3RyZWFtTWFuYWdlci5qcyJdLCJuYW1lcyI6WyJTRVJWSUNFX0lEIiwibG9nIiwibG9hZEF1ZGlvQnVmZmVyIiwiY2h1bmtOYW1lIiwicHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJyZXF1ZXN0IiwiWE1MSHR0cFJlcXVlc3QiLCJvcGVuIiwicmVzcG9uc2VUeXBlIiwib25sb2FkIiwiZGVjb2RlQXVkaW9EYXRhIiwicmVzcG9uc2UiLCJidWZmZXIiLCJlIiwic2VuZCIsIkF1ZGlvU3RyZWFtTWFuYWdlciIsImJ1ZmZlckluZm9zIiwiZGVmYXVsdHMiLCJtb25pdG9ySW50ZXJ2YWwiLCJyZXF1aXJlZEFkdmFuY2VUaHJlc2hvbGQiLCJjb25maWd1cmUiLCJzeW5jU2VydmljZSIsInJlcXVpcmUiLCJfb25BY2tub3dsZWRnZVJlc3BvbnNlIiwiYmluZCIsInJlY2VpdmUiLCJmb3JFYWNoIiwiaXRlbSIsImZpbGVOYW1lIiwibmFtZSIsInNwbGl0IiwicG9wIiwic3Vic3RyIiwiaW5kZXhPZiIsImxhc3RJbmRleE9mIiwic2V0IiwicmVhZHkiLCJBdWRpb1N0cmVhbSIsIm9wdGlvbnMiLCJyZWdpc3RlciIsIl9zeW5jIiwiX2xvb3AiLCJfbWV0YURhdGEiLCJ1bmRlZmluZWQiLCJfb3V0IiwiY3JlYXRlR2FpbiIsIl9jaHVua1JlcXVlc3RDYWxsYmFja0ludGVydmFsIiwiX2N0eF90aW1lX3doZW5fcXVldWVfZW5kcyIsIl9zcmNNYXAiLCJfcmVzZXQiLCJfc3RvcFJlcXVpcmVkIiwiX2NodW5rUmVxdWVzdENhbGxiYWNrIiwib25lbmRlZCIsIl9vZmZzZXRJbkZpcnN0QnVmZmVyIiwiX29mZnNldEluRmlyc3RCdWZmZXJBY2NvdW50ZWRGb3IiLCJfY3R4U3RhcnRUaW1lIiwiX3Vuc3luY1N0YXJ0T2Zmc2V0IiwiX2N1cnJlbnRCdWZmZXJJbmRleCIsIl9maXJzdFBhY2tldFN0YXRlIiwibm9kZSIsImNvbm5lY3QiLCJvZmZzZXQiLCJfdXJsIiwiY29uc29sZSIsIndhcm4iLCJidWZmZXJJbmZvIiwiZ2V0IiwiZHVyYXRpb24iLCJlcnJvciIsImdldFN5bmNUaW1lIiwiaW5kZXgiLCJsZW5ndGgiLCJzdGFydCIsInNldEludGVydmFsIiwibWV0YUJ1ZmZlciIsImN0eF9zdGFydFRpbWUiLCJvdmVybGFwU3RhcnQiLCJ0aGVuIiwiX2FkZEJ1ZmZlclRvUXVldWUiLCJvdmVybGFwRW5kIiwiX2Ryb3AiLCJ0aW1lQmVmb3JlRW5kIiwic2V0VGltZW91dCIsInN0YXJ0VGltZSIsInJlbFN0YXJ0VGltZSIsIm5TYW1wRmFkZUluIiwiTWF0aCIsImZsb29yIiwic2FtcGxlUmF0ZSIsIm5TYW1wRmFkZU91dCIsImNoSWQiLCJudW1iZXJPZkNoYW5uZWxzIiwiY2hEYXRhIiwiZ2V0Q2hhbm5lbERhdGEiLCJpIiwic3JjIiwiY3JlYXRlQnVmZmVyU291cmNlIiwibm93IiwiY3VycmVudFRpbWUiLCJkZWxldGUiLCJ3aGVuIiwiaXNQbGF5aW5nIiwic3RvcCIsImNsZWFySW50ZXJ2YWwiLCJ2YWwiLCJlbmRCdWZmZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsYUFBYSw4QkFBbkI7QUFDQSxJQUFNQyxNQUFNLHFCQUFNLDBDQUFOLENBQVo7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQSxTQUFTQyxlQUFULENBQXlCQyxTQUF6QixFQUFvQztBQUNsQyxNQUFNQyxVQUFVLHNCQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUMvQztBQUNBLFFBQUlDLFVBQVUsSUFBSUMsY0FBSixFQUFkO0FBQ0FELFlBQVFFLElBQVIsQ0FBYSxLQUFiLEVBQW9CTixTQUFwQixFQUErQixJQUEvQjtBQUNBSSxZQUFRRyxZQUFSLEdBQXVCLGFBQXZCO0FBQ0E7QUFDQUgsWUFBUUksTUFBUixHQUFpQixZQUFNO0FBQ25CLCtCQUFhQyxl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VUFBSSxLQUFLeUUsU0FBTCxFQUFKLEVBQXNCO0FBQ3BCdEMsZ0JBQVFDLElBQVIsQ0FBYSwrQkFBYjtBQUNBO0FBQ0Q7QUFDRDtBQUNBLFVBQUksS0FBS2hELFdBQUwsQ0FBaUJrRCxHQUFqQixDQUFxQnRDLFFBQXJCLENBQUosRUFBb0M7QUFBRSxhQUFLa0MsSUFBTCxHQUFZbEMsUUFBWjtBQUF1QjtBQUM3RDtBQURBLFdBRUs7QUFBRW1DLGtCQUFRSyxLQUFSLENBQWN4QyxRQUFkLEVBQXdCLFlBQXhCLEVBQXNDLEtBQUtaLFdBQTNDLEVBQXdELHdCQUF4RDtBQUFvRjtBQUM1Rjs7QUFFRDs7Ozs7Ozs7Ozs7c0JBUVN3RixHLEVBQUs7QUFDWixVQUFJLEtBQUtILFNBQUwsRUFBSixFQUFzQjtBQUNwQnRDLGdCQUFRQyxJQUFSLENBQWEsZ0NBQWI7QUFDQTtBQUNEO0FBQ0QsV0FBS3hCLEtBQUwsR0FBYWdFLEdBQWI7QUFDRCxLO3dCQUNVO0FBQ1QsYUFBTyxLQUFLaEUsS0FBWjtBQUFvQjs7QUFFdEI7Ozs7Ozs7c0JBSVNnRSxHLEVBQUs7QUFDWixVQUFJLEtBQUtILFNBQUwsRUFBSixFQUFzQjtBQUNwQnRDLGdCQUFRQyxJQUFSLENBQWEsZ0NBQWI7QUFDQTtBQUNEO0FBQ0QsV0FBS3ZCLEtBQUwsR0FBYStELEdBQWI7QUFDRCxLO3dCQUNVO0FBQ1QsYUFBTyxLQUFLL0QsS0FBWjtBQUFvQjs7QUFHdEI7Ozs7Ozt3QkFHZTtBQUNiLFVBQUl3QixhQUFhLEtBQUtqRCxXQUFMLENBQWlCa0QsR0FBakIsQ0FBcUIsS0FBS0osSUFBMUIsQ0FBakI7QUFDQSxVQUFJMkMsWUFBWXhDLFdBQVdBLFdBQVdNLE1BQVgsR0FBb0IsQ0FBL0IsQ0FBaEI7QUFDQSxVQUFJSixXQUFXc0MsVUFBVWpDLEtBQVYsR0FBa0JpQyxVQUFVdEMsUUFBM0M7QUFDQSxhQUFPQSxRQUFQO0FBQ0QiLCJmaWxlIjoiQXVkaW9TdHJlYW1NYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYXVkaW9Db250ZXh0IH0gZnJvbSAnd2F2ZXMtYXVkaW8nO1xuaW1wb3J0IGRlYnVnIGZyb20gJ2RlYnVnJztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTphdWRpby1zdHJlYW0tbWFuYWdlcic7XG5jb25zdCBsb2cgPSBkZWJ1Zygnc291bmR3b3JrczpzZXJ2aWNlczphdWRpby1zdHJlYW0tbWFuYWdlcicpO1xuXG4vLyBUT0RPOlxuLy8gLSBzdXBwb3J0IHN0cmVhbWluZyBvZiBmaWxlcyBvZiB0b3RhbCBkdXJhdGlvbiBzaG9ydGVyIHRoYW4gcGFja2V0IGR1cmF0aW9uXG5cblxuLy8gbG9hZCBhbiBhdWRpbyBidWZmZXIgZnJvbSBzZXJ2ZXIncyBkaXNrIChiYXNlZCBvbiBYTUxIdHRwUmVxdWVzdClcbmZ1bmN0aW9uIGxvYWRBdWRpb0J1ZmZlcihjaHVua05hbWUpIHtcbiAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAvLyBjcmVhdGUgcmVxdWVzdFxuICAgIHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgcmVxdWVzdC5vcGVuKCdHRVQnLCBjaHVua05hbWUsIHRydWUpO1xuICAgIHJlcXVlc3QucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJztcbiAgICAvLyBkZWZpbmUgcmVxdWVzdCBjYWxsYmFja1xuICAgIHJlcXVlc3Qub25sb2FkID0gKCkgPT4ge1xuICAgICAgICBhdWRpb0NvbnRleHQuZGVjb2RlQXVkaW9EYXRhKHJlcXVlc3QucmVzcG9uc2UsIChidWZmZXIpID0+IHtcbiAgICAgICAgICByZXNvbHZlKGJ1ZmZlcik7XG4gICAgICAgIH0sIChlKSA9PiB7IHJlamVjdChlKTsgfSk7XG4gICAgICB9XG4gICAgICAvLyBzZW5kIHJlcXVlc3RcbiAgICByZXF1ZXN0LnNlbmQoKTtcbiAgfSk7XG4gIHJldHVybiBwcm9taXNlO1xufVxuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIGNsaWVudCBgJ2F1ZGlvLXN0cmVhbS1tYW5hZ2VyJ2Agc2VydmljZS5cbiAqXG4gKiBUaGlzIHNlcnZpY2UgYWxsb3dzIHRvIHN0cmVhbSBhdWRpbyBidWZmZXJzIHRvIHRoZSBjbGllbnQgZHVyaW5nIHRoZSBleHBlcmllbmNlXG4gKiAobm90IHByZWxvYWRlZCkuIElucHV0IGF1ZGlvIGZpbGVzIGFyZSBzZWdtZW50ZWQgYnkgdGhlIHNlcnZlciB1cG9uIHN0YXJ0dXAgYW5kIFxuICogc2VudCB0byB0aGUgY2xpZW50cyB1cG9uIHJlcXVlc3QuIFNlcnZpY2Ugb25seSBhY2NlcHRzIC53YXYgZmlsZXMgYXQgdGhlIG1vbWVudC5cbiAqIFNlcnZpY2UgbWFpbiBvYmplY3RpdmUgaXMgdG8gMSkgZW5hYmxlIHN5bmNlZCBzdHJlYW1pbmcgYmV0d2VlbiBjbGllbnRzIChub3QgcHJlY2lzZVxuICogaWYgYmFzZWQgb24gbWVkaWFFbGVtZW50U291cmNlcyksIGFuZCAyKSBwcm92aWRlIGFuIGVxdWl2YWxlbnQgdG8gdGhlIG1lZGlhRWxlbWVudFNvdXJjZVxuICogb2JqZWN0IChzdHJlYW1pbmcgYXMgYSBXZWIgQXVkaW8gQVBJIG5vZGUpIHRoYXQgY291bGQgYmUgcGx1Z2dlZCB0byBhbnkgb3RoZXIgbm9kZSBpbiBTYWZhcmlcbiAqIChieXBhc3NpbmcgZS5nLiBnYWluIG9yIGFuYWx5emVyIG5vZGVzIHdoZW4gcGx1Z2dlZCB0byBtZWRpYUVsZW1lbnRTb3VyY2UpLlxuICpcbiAqIF9fKlRoZSBzZXJ2aWNlIG11c3QgYmUgdXNlZCB3aXRoIGl0cyBbc2VydmVyLXNpZGUgY291bnRlcnBhcnRde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5BdWRpb1N0cmVhbU1hbmFnZXJ9Kl9fXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7TnVtYmVyfSBvcHRpb25zLm1vbml0b3JJbnRlcnZhbCAtIEludGVydmFsIHRpbWUgKGluIHNlYykgYXQgd2hpY2ggdGhlIGNsaWVudCB3aWxsIGNoZWNrIGlmIGl0IGhhcyBlbm91Z2ggXG4gKiAgcHJlbG9hZGVkIGF1ZGlvIGRhdGEgdG8gZW5zdXJlIHN0cmVhbWluZyBvciBpZiBpdCBuZWVkcyB0byByZXF1aXJlIHNvbWUgbW9yZS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBvcHRpb25zLnJlcXVpcmVkQWR2YW5jZVRocmVzaG9sZCAtIFRocmVzaG9sZCB0aW1lIChpbiBzZWMpIG9mIHByZWxvYWRlZCBhdWRpbyBkYXRhIGJlbG93IHdoaWNoIFxuICogIHRoZSBjbGllbnQgd2lsbCByZXF1aXJlIGEgbmV3IGF1ZGlvIGNodW5rLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBleGFtcGxlXG4gKiAvLyByZXF1aXJlIHRoZSBgYXVkaW8tc3RyZWFtLW1hbmFnZXJgIChpbiBleHBlcmllbmNlIGNvbnN0cnVjdG9yKVxuICogdGhpcy5hdWRpb1N0cmVhbU1hbmFnZXIgPSB0aGlzLnJlcXVpcmUoJ2F1ZGlvLXN0cmVhbS1tYW5hZ2VyJywge21vbml0b3JJbnRlcnZhbDogMSwgcmVxdWlyZWRBZHZhbmNlVGhyZXNob2xkOiAxMH0pO1xuICpcbiAqIC8vIHJlcXVlc3QgbmV3IGF1ZGlvIHN0cmVhbSBmcm9tIHRoZSBzdHJlYW0gbWFuYWdlciAoaW4gZXhwZXJpZW5jZSBzdGFydCBtZXRob2QpXG4gKiBsZXQgYXVkaW9TdHJlYW0gPSB0aGlzLmF1ZGlvU3RyZWFtTWFuYWdlci5nZXRBdWRpb1N0cmVhbSgpO1xuICogLy8gc2V0dXAgYW5kIHN0YXJ0IGF1ZGlvIHN0cmVhbVxuICogYXVkaW9TdHJlYW0udXJsID0gJ215LWF1ZGlvLWZpbGUtbmFtZSc7IC8vIHdpdGhvdXQgZXh0ZW5zaW9uXG4gKiBhdWRpb1N0cmVhbS5jb25uZWN0KCBhdWRpb0NvbnRleHQuZGVzdGluYXRpb24gKTsgLy8gY29ubmVjdCBhcyB5b3Ugd291bGQgYW55IGF1ZGlvIG5vZGUgZnJvbSB0aGUgd2ViIGF1ZGlvIGFwaVxuICogYXVkaW9TdHJlYW0ubG9vcCA9IGZhbHNlOyAvLyBkaXNhYmxlIGxvb3BcbiAqIGF1ZGlvU3RyZWFtLnN5bmMgPSBmYWxzZTsgLy8gZGlzYWJsZSBzeW5jaHJvbml6YXRpb25cbiAqIGF1ZGlvU3RyZWFtLm9uZW5kZWQgPSBmdW5jdGlvbigpeyBjb25zb2xlLmxvZygnc3RyZWFtIGVuZGVkJyk7IH07IC8vIG1pbWljcyBBdWRpb0J1ZmZlclNvdXJjZU5vZGUgb25lbmRlZCBtZXRob2RcbiAqIGF1ZGlvU3RyZWFtLnN0YXJ0KCk7IC8vIHN0YXJ0IGF1ZGlvIHN0cmVhbVxuICovXG5cbmNsYXNzIEF1ZGlvU3RyZWFtTWFuYWdlciBleHRlbmRzIFNlcnZpY2Uge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW50aWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIGZhbHNlKTtcbiAgICAvLyBsb2NhbHNcbiAgICB0aGlzLmJ1ZmZlckluZm9zID0gbmV3IE1hcCgpO1xuICAgIC8vIGNvbmZpZ3VyZSBvcHRpb25zXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBtb25pdG9ySW50ZXJ2YWw6IDEsIC8vIGluIHNlY29uZHNcbiAgICAgIHJlcXVpcmVkQWR2YW5jZVRocmVzaG9sZDogMTAsIC8vIGluIHNlY29uZHNcbiAgICB9O1xuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcbiAgICAvLyBzZXJ2aWNlc1xuICAgIHRoaXMuc3luY1NlcnZpY2UgPSB0aGlzLnJlcXVpcmUoJ3N5bmMnKTtcbiAgICAvLyBiaW5kaW5nc1xuICAgIHRoaXMuX29uQWNrbm93bGVkZ2VSZXNwb25zZSA9IHRoaXMuX29uQWNrbm93bGVkZ2VSZXNwb25zZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG4gICAgLy8gc2VuZCByZXF1ZXN0IGZvciBpbmZvcyBvbiBcInN0cmVhbWFibGVcIiBhdWRpbyBmaWxlc1xuICAgIHRoaXMucmVjZWl2ZSgnYWNrbm93bGVnZGUnLCB0aGlzLl9vbkFja25vd2xlZGdlUmVzcG9uc2UpO1xuICAgIHRoaXMuc2VuZCgncmVxdWVzdCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBidWZmZXJJbmZvcyAtIGluZm8gb24gYXVkaW8gZmlsZXMgdGhhdCBjYW4gYmUgc3RyZWFtZWRcbiAgICovXG4gIF9vbkFja25vd2xlZGdlUmVzcG9uc2UoYnVmZmVySW5mb3MpIHtcbiAgICAvLyBzaGFwZSBidWZmZXIgaW5mb3NcbiAgICBidWZmZXJJbmZvcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAvLyBnZXQgZmlsZSBuYW1lIChhc3N1bWUgYXQgbGVhc3QgMSBjaHVuayBpbiBpdGVtKVxuICAgICAgbGV0IGZpbGVOYW1lID0gaXRlbVswXS5uYW1lLnNwbGl0KFwiL1wiKS5wb3AoKTtcbiAgICAgIGZpbGVOYW1lID0gZmlsZU5hbWUuc3Vic3RyKGZpbGVOYW1lLmluZGV4T2YoXCItXCIpICsgMSwgZmlsZU5hbWUubGFzdEluZGV4T2YoXCIuXCIpIC0gMik7XG4gICAgICAvLyBzYXZlIGluIGxvY2Fsc1xuICAgICAgdGhpcy5idWZmZXJJbmZvcy5zZXQoZmlsZU5hbWUsIGl0ZW0pO1xuICAgIH0pO1xuXG4gICAgLy8gZmxhZyBzZXJ2aWNlIGFzIHJlYWR5XG4gICAgdGhpcy5yZWFkeSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBhIG5ldyBhdWRpbyBzdHJlYW0gbm9kZS5cbiAgICovXG4gIGdldEF1ZGlvU3RyZWFtKCkge1xuICAgIHJldHVybiBuZXcgQXVkaW9TdHJlYW0odGhpcy5idWZmZXJJbmZvcywgdGhpcy5zeW5jU2VydmljZSwgdGhpcy5vcHRpb25zLm1vbml0b3JJbnRlcnZhbCwgdGhpcy5vcHRpb25zLnJlcXVpcmVkQWR2YW5jZVRocmVzaG9sZCk7XG4gIH1cblxufVxuXG4vLyByZWdpc3RlciAvIGV4cG9ydCBzZXJ2aWNlXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBBdWRpb1N0cmVhbU1hbmFnZXIpO1xuZXhwb3J0IGRlZmF1bHQgQXVkaW9TdHJlYW1NYW5hZ2VyO1xuXG4vKipcbiAqIEFuIGF1ZGlvIHN0cmVhbSBub2RlLCBiZWhhdmluZyBhcyB3b3VsZCBhIG1lZGlhRWxlbWVudFNvdXJjZSBub2RlLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBidWZmZXJJbmZvcyAtIE1hcCBvZiBzdHJlYW1hYmxlIGJ1ZmZlciBjaHVua3MgaW5mb3MuXG4gKiBAcGFyYW0ge09iamVjdH0gc3luY1NlcnZpY2UgLSBTb3VuZHdvcmtzIHN5bmMgc2VydmljZSwgdXNlZCBmb3Igc3luYyBtb2RlLlxuICogQHBhcmFtIHtOdW1iZXJ9IG1vbml0b3JJbnRlcnZhbCAtIFNlZSBBdWRpb1N0cmVhbU1hbmFnZXIncy5cbiAqIEBwYXJhbSB7TnVtYmVyfSByZXF1aXJlZEFkdmFuY2VUaHJlc2hvbGQgLSBTZWUgQXVkaW9TdHJlYW1NYW5hZ2VyJ3MuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BdWRpb1N0cmVhbU1hbmFnZXJcbiAqL1xuY2xhc3MgQXVkaW9TdHJlYW0ge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW50aWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKGJ1ZmZlckluZm9zLCBzeW5jU2VydmljZSwgbW9uaXRvckludGVydmFsLCByZXF1aXJlZEFkdmFuY2VUaHJlc2hvbGQpIHtcblxuICAgIC8vIGFyZ3VtZW50c1xuICAgIHRoaXMuYnVmZmVySW5mb3MgPSBidWZmZXJJbmZvcztcbiAgICB0aGlzLnN5bmNTZXJ2aWNlID0gc3luY1NlcnZpY2U7XG4gICAgdGhpcy5tb25pdG9ySW50ZXJ2YWwgPSBtb25pdG9ySW50ZXJ2YWwgKiAxMDAwOyAvLyBpbiBtc1xuICAgIHRoaXMucmVxdWlyZWRBZHZhbmNlVGhyZXNob2xkID0gcmVxdWlyZWRBZHZhbmNlVGhyZXNob2xkO1xuXG4gICAgLy8gbG9jYWwgYXR0ci5cbiAgICB0aGlzLl9zeW5jID0gZmFsc2U7XG4gICAgdGhpcy5fbG9vcCA9IGZhbHNlO1xuICAgIHRoaXMuX21ldGFEYXRhID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX291dCA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG5cbiAgICAvLyBzdHJlYW0gbW9uaXRvcmluZ1xuICAgIHRoaXMuX2NodW5rUmVxdWVzdENhbGxiYWNrSW50ZXJ2YWwgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fY3R4X3RpbWVfd2hlbl9xdWV1ZV9lbmRzID0gMDtcbiAgICB0aGlzLl9zcmNNYXAgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5fcmVzZXQoKTtcbiAgICB0aGlzLl9zdG9wUmVxdWlyZWQgPSBmYWxzZTtcblxuICAgIC8vIGJpbmRcbiAgICB0aGlzLl9jaHVua1JlcXVlc3RDYWxsYmFjayA9IHRoaXMuX2NodW5rUmVxdWVzdENhbGxiYWNrLmJpbmQodGhpcyk7XG4gICAgdGhpcy5vbmVuZGVkID0gdGhpcy5vbmVuZGVkLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogSW5pdCAvIHJlc2V0IGxvY2FsIGF0dHJpYnV0ZXMgKGF0IHN0cmVhbSBjcmVhdGlvbiBhbmQgc3RvcCgpICkuXG4gICAqIEBwcml2YXRlXG4gICAqKi9cbiAgX3Jlc2V0KCkge1xuICAgIHRoaXMuX29mZnNldEluRmlyc3RCdWZmZXIgPSAwO1xuICAgIHRoaXMuX29mZnNldEluRmlyc3RCdWZmZXJBY2NvdW50ZWRGb3IgPSBmYWxzZTtcbiAgICB0aGlzLl9jdHhTdGFydFRpbWUgPSAtMTtcbiAgICB0aGlzLl91bnN5bmNTdGFydE9mZnNldCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9jdXJyZW50QnVmZmVySW5kZXggPSAtMTtcbiAgICB0aGlzLl9maXJzdFBhY2tldFN0YXRlID0gMDtcbiAgfVxuXG4gIC8qKiBcbiAgICogRGVmaW5lIHVybCBvZiBhdWRpbyBmaWxlIHRvIHN0cmVhbSwgc2VuZCBtZXRhIGRhdGEgcmVxdWVzdCB0byBzZXJ2ZXIgY29uY2VybmluZyB0aGlzIGZpbGUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgLSByZXF1ZXN0ZWQgZmlsZSBuYW1lLCB3aXRob3V0IGV4dGVuc2lvblxuICAgKiovXG4gIHNldCB1cmwoZmlsZU5hbWUpIHtcbiAgICAvLyBkaXNjYXJkIGlmIGN1cnJlbnRseSBwbGF5aW5nXG4gICAgaWYgKHRoaXMuaXNQbGF5aW5nKCkpIHtcbiAgICAgIGNvbnNvbGUud2Fybignc2V0IHVybCBpZ25vcmVkIHdoaWxlIHBsYXlpbmcnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gY2hlY2sgaWYgdXJsIGNvcnJlc3BvbmRzIHdpdGggYSBzdHJlYW1hYmxlIGZpbGVcbiAgICBpZiAodGhpcy5idWZmZXJJbmZvcy5nZXQoZmlsZU5hbWUpKSB7IHRoaXMuX3VybCA9IGZpbGVOYW1lOyB9XG4gICAgLy8gZGlzY2FyZCBvdGhlcndpc2VcbiAgICBlbHNlIHsgY29uc29sZS5lcnJvcihmaWxlTmFtZSwgJ3VybCBub3QgaW4nLCB0aGlzLmJ1ZmZlckluZm9zLCAnLCBcXG4gIyMjIHVybCBkaXNjYXJkZWQnKTsgfVxuICB9XG5cbiAgLyoqXG4gICAqIFNldC9HZXQgc3luY2hyb25pemVkIG1vZGUgc3RhdHVzLiBpbiBub24gc3luYy4gbW9kZSwgdGhlIHN0cmVhbSBhdWRpb1xuICAgKiB3aWxsIHN0YXJ0IHdoZW5ldmVyIHRoZSBmaXJzdCBhdWRpbyBidWZmZXIgaXMgZG93bmxvYWRlZC4gaW4gc3luYy4gbW9kZSwgXG4gICAqIHRoZSBzdHJlYW0gYXVkaW8gd2lsbCBzdGFydCAoYWdhaW4gYXNhIHRoZSBhdWRpbyBidWZmZXIgaXMgZG93bmxvYWRlZCkgXG4gICAqIHdpdGggYW4gb2Zmc2V0IGluIHRoZSBidWZmZXIsIGFzIGlmIGl0IHN0YXJ0ZWQgcGxheWluZyBleGFjdGx5IHdoZW4gdGhlIFxuICAgKiBzdGFydCgpIGNvbW1hbmQgd2FzIGlzc3VlZC5cbiAgICogQHBhcmFtIHtCb29sfSB2YWwgLSBlbmFibGUgLyBkaXNhYmxlIHN5bmNcbiAgICoqL1xuICBzZXQgc3luYyh2YWwpIHtcbiAgICBpZiAodGhpcy5pc1BsYXlpbmcoKSkge1xuICAgICAgY29uc29sZS53YXJuKCdzZXQgc3luYyBpZ25vcmVkIHdoaWxlIHBsYXlpbmcnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5fc3luYyA9IHZhbDtcbiAgfVxuICBnZXQgc3luYygpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luYzsgfVxuXG4gIC8qKlxuICAgKiBTZXQvR2V0IGxvb3AgbW9kZS4gb25lbmRlZCgpIG1ldGhvZCBub3QgY2FsbGVkIGlmIGxvb3AgZW5hYmxlZC5cbiAgICogQHBhcmFtIHtCb29sfSB2YWwgLSBlbmFibGUgLyBkaXNhYmxlIHN5bmNcbiAgICoqL1xuICBzZXQgbG9vcCh2YWwpIHtcbiAgICBpZiAodGhpcy5pc1BsYXlpbmcoKSkge1xuICAgICAgY29uc29sZS53YXJuKCdzZXQgbG9vcCBpZ25vcmVkIHdoaWxlIHBsYXlpbmcnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5fbG9vcCA9IHZhbDtcbiAgfVxuICBnZXQgbG9vcCgpIHtcbiAgICByZXR1cm4gdGhpcy5fbG9vcDsgfVxuXG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgdG90YWwgZHVyYXRpb24gKGluIHNlY3MpIG9mIHRoZSBhdWRpbyBmaWxlIGN1cnJlbnRseSBzdHJlYW1lZC5cbiAgICoqL1xuICBnZXQgZHVyYXRpb24oKSB7XG4gICAgbGV0IGJ1ZmZlckluZm8gPSB0aGlzLmJ1ZmZlckluZm9zLmdldCh0aGlzLl91cmwpO1xuICAgIGxldCBlbmRCdWZmZXIgPSBidWZmZXJJbmZvW2J1ZmZlckluZm8ubGVuZ3RoIC0gMV07XG4gICAgbGV0IGR1cmF0aW9uID0gZW5kQnVmZmVyLnN0YXJ0ICsgZW5kQnVmZmVyLmR1cmF0aW9uO1xuICAgIHJldHVybiBkdXJhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25uZWN0IGF1ZGlvIHN0cmVhbSB0byBhbiBhdWRpbyBub2RlLlxuICAgKiBAcGFyYW0ge0F1ZGlvTm9kZX0gbm9kZSAtIG5vZGUgdG8gY29ubmVjdCB0by5cbiAgICoqL1xuICBjb25uZWN0KG5vZGUpIHtcbiAgICB0aGlzLl9vdXQuY29ubmVjdChub2RlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXRob2QgY2FsbGVkIHdoZW4gc3RyZWFtIGZpbmlzaGVkIHBsYXlpbmcgb24gaXRzIG93biAod29uJ3QgZmlyZSBpZiBsb29wIGVuYWJsZWQpLlxuICAgKiovXG4gIG9uZW5kZWQoKSB7fVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdHJ1ZSBpZiBzdHJlYW0gaXMgcGxheWluZywgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKiovXG4gIGlzUGxheWluZygpIHtcbiAgICBpZiAodGhpcy5fY2h1bmtSZXF1ZXN0Q2FsbGJhY2tJbnRlcnZhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG5cbiAgLyoqIFxuICAgKiBTdGFydCBzdHJlYW1pbmcgYXVkaW8gc291cmNlLlxuICAgKiBAcGFyYW0ge051bWJlcn0gb2Zmc2V0IC0gdGltZSBpbiBidWZmZXIgZnJvbSB3aGljaCB0byBzdGFydCAoaW4gc2VjKS5cbiAgICoqL1xuICBzdGFydChvZmZzZXQpIHtcblxuICAgIC8vIGNoZWNrIGlmIHdlIGRpc3Bvc2Ugb2YgdmFsaWQgdXJsIHRvIGV4ZWN1dGUgc3RhcnRcbiAgICBpZiAodGhpcy5fdXJsID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnNvbGUud2Fybignc3RhcnQgY29tbWFuZCBkaXNjYXJkZWQsIG11c3QgZGVmaW5lIHZhbGlkIHVybCBmaXJzdCcpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIGdldCB0b3RhbCBkdXJhdGlvbiBvZiB0YXJnZXR0ZWQgYXVkaW8gZmlsZVxuICAgIGxldCBidWZmZXJJbmZvID0gdGhpcy5idWZmZXJJbmZvcy5nZXQodGhpcy5fdXJsKTtcbiAgICBsZXQgZHVyYXRpb24gPSB0aGlzLmR1cmF0aW9uO1xuXG4gICAgLy8gbWFrZSBzdXJlIG9mZnNldCByZXF1ZXN0ZWQgaXMgdmFsaWRcbiAgICBpZiAob2Zmc2V0ID49IGR1cmF0aW9uIHx8IG9mZnNldCA8IDApIHtcbiAgICAgIGNvbnNvbGUud2FybigncmVxdWVzdGVkIG9mZnNldDonLCBvZmZzZXQsICdzZWMuIGxhcmdlciB0aGFuIGZpbGUgZHVyYXRpb246JywgZHVyYXRpb24sICdzZWMsIHN0YXJ0KCkgZGlzY2FyZGVkJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gdW5mbGFnIHN0b3AgcmVxdWlyZWRcbiAgICB0aGlzLl9zdG9wUmVxdWlyZWQgPSBmYWxzZTtcblxuICAgIC8vIGlmIHN5bmMsIGVpdGhlciB1c2Ugb2Zmc2V0IGZvciBxdWF0aXphdGlvbiBzdGFydCBvciBzeW5jIHdpdGggcnVubmluZyBsb29wIFxuICAgIGlmICh0aGlzLl9zeW5jKSB7XG4gICAgICAvLyBxdWFudGl6YXRpb24gbW9kZTogc3RhcnQgd2l0aCBvZmZzZXQgaW4gZmlsZSB0byBtYXRjaCBwZXJpb2QgKG9mZnNldCBtdXN0IGJlIGNvbXB1dGVkIGFjY29yZGluZ2x5LCBpbiBwYXJlbnQgd2hvIGNhbGxzIHRoaXMgbWV0aG9kKVxuICAgICAgaWYgKG9mZnNldCAhPT0gdW5kZWZpbmVkKSB7wqBcbiAgICAgICAgaWYgKG9mZnNldCA+PSBkdXJhdGlvbikge8KgIGNvbnNvbGUuZXJyb3IoJ3JlcS4gb2Zmc2V0IGFib3ZlIGZpbGUgZHVyYXRpb24nLCBvZmZzZXQsIGR1cmF0aW9uKTsgfVxuICAgICAgfVxuICAgICAgLy8gc3luYyBpbiBcInJ1bm5pbmcgbG9vcFwiIG1vZGVcbiAgICAgIGVsc2UgeyBvZmZzZXQgPSB0aGlzLnN5bmNTZXJ2aWNlLmdldFN5bmNUaW1lKCkgJSBkdXJhdGlvbjsgfVxuICAgIH1cbiAgICAvLyBzZXQgZGVmYXVsdCBvZmZzZXQgaWYgbm90IGRlZmluZWRcbiAgICBlbHNlIHsgb2Zmc2V0ID0gKG9mZnNldCAhPT0gdW5kZWZpbmVkKSA/IG9mZnNldCA6IDA7IH1cblxuICAgIC8vIGluaXQgcXVldWUgdGltZXJcbiAgICB0aGlzLl9jdHhfdGltZV93aGVuX3F1ZXVlX2VuZHMgPSB0aGlzLnN5bmNTZXJ2aWNlLmdldFN5bmNUaW1lKCk7XG5cbiAgICAvLyBmaW5kIGZpcnN0IGluZGV4IGluIGJ1ZmZlciBsaXN0IGZvciBnaXZlbiBvZmZzZXRcbiAgICBsZXQgaW5kZXggPSAxO1xuICAgIHdoaWxlICh0aGlzLl9jdXJyZW50QnVmZmVySW5kZXggPCAwKSB7XG4gICAgICAvLyBpZiBpbmRleCBjb3JyZXNwb25kcyB0byB0aGUgYnVmZmVyIGFmdGVyIHRoZSBvbmUgd2Ugd2FudCB8fMKgbGFzdCBpbmRleCBpbiBidWZmZXJcbiAgICAgIGlmIChpbmRleCA9PT0gYnVmZmVySW5mby5sZW5ndGggfHwgb2Zmc2V0IDwgYnVmZmVySW5mb1tpbmRleF0uc3RhcnQpIHtcbiAgICAgICAgdGhpcy5fY3VycmVudEJ1ZmZlckluZGV4ID0gaW5kZXggLSAxO1xuICAgICAgICB0aGlzLl9vZmZzZXRJbkZpcnN0QnVmZmVyID0gb2Zmc2V0IC0gYnVmZmVySW5mb1t0aGlzLl9jdXJyZW50QnVmZmVySW5kZXhdLnN0YXJ0O1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnZ2xvYmFsIG9mZnNldDonLCBvZmZzZXQsICdsb2NhbCBvZmZzZXQ6JywgdGhpcy5fb2Zmc2V0SW5GaXJzdEJ1ZmZlciwgJ2ZpbGUgc3RhcnRzIGF0OicsIGJ1ZmZlckluZm9bdGhpcy5fY3VycmVudEJ1ZmZlckluZGV4XS5zdGFydCwgJ3RvdGFsIGR1cjonLCBkdXJhdGlvbik7XG4gICAgICB9XG4gICAgICBpbmRleCArPSAxO1xuICAgIH1cblxuICAgIC8vIHN0YXJ0IHN0cmVhbSByZXF1ZXN0IGNodW5rcyBjYWxsYmFja1xuICAgIHRoaXMuX2NodW5rUmVxdWVzdENhbGxiYWNrKCk7IC8vIHN0YXJ0IHdpdGggb25lIGNhbGwgcmlnaHQgbm93XG4gICAgdGhpcy5fY2h1bmtSZXF1ZXN0Q2FsbGJhY2tJbnRlcnZhbCA9IHNldEludGVydmFsKHRoaXMuX2NodW5rUmVxdWVzdENhbGxiYWNrLCB0aGlzLm1vbml0b3JJbnRlcnZhbCk7XG4gIH1cblxuICAvKiogXG4gICAqIENoZWNrIGlmIHdlIGhhdmUgZW5vdWdoIFwibG9jYWwgYnVmZmVyIHRpbWVcIiBmb3IgdGhlIGF1ZGlvIHN0cmVhbSwgXG4gICAqIHJlcXVlc3QgbmV3IGJ1ZmZlciBjaHVua3Mgb3RoZXJ3aXNlLlxuICAgKiBAcHJpdmF0ZVxuICAgKiovXG4gIF9jaHVua1JlcXVlc3RDYWxsYmFjaygpIHtcblxuICAgIC8vIGdldCBhcnJheSBvZiBzdHJlYW1lZCBjaHVua3MgaW5mb1xuICAgIGxldCBidWZmZXJJbmZvID0gdGhpcy5idWZmZXJJbmZvcy5nZXQodGhpcy5fdXJsKTtcblxuICAgIC8vIGxvb3A6IGRvIHdlIG5lZWQgdG8gcmVxdWVzdCBtb3JlIGNodW5rcz8gaWYgc28sIGRvLCBpbmNyZW1lbnQgdGltZSBmbGFnLCBhc2sgYWdhaW5cbiAgICB3aGlsZSAodGhpcy5fY3R4X3RpbWVfd2hlbl9xdWV1ZV9lbmRzIC0gdGhpcy5zeW5jU2VydmljZS5nZXRTeW5jVGltZSgpIDw9IHRoaXMucmVxdWlyZWRBZHZhbmNlVGhyZXNob2xkKSB7XG5cbiAgICAgIC8vIG1lY2hhbmlzbSB0byBmb3JjZSBhd2FpdCBmaXJzdCBidWZmZXIgdG8gb2Zmc2V0IHdob2xlIHF1ZXVlIGluIHVuc3luYyBtb2RlXG4gICAgICBpZiAodGhpcy5fZmlyc3RQYWNrZXRTdGF0ZSA9PSAxICYmICF0aGlzLl9zeW5jKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gZ2V0IGN1cnJlbnQgd29ya2luZyBjaHVuayBpbmZvXG4gICAgICBjb25zdCBtZXRhQnVmZmVyID0gYnVmZmVySW5mb1t0aGlzLl9jdXJyZW50QnVmZmVySW5kZXhdO1xuXG4gICAgICAvLyBnZXQgY29udGV4dCBhYnNvbHV0ZSB0aW1lIGF0IHdoaWNoIGN1cnJlbnQgYnVmZmVyIG11c3QgYmUgc3RhcnRlZFxuICAgICAgLy8gdGhpcyBcImNvbnN0XCIgaGVyZSBhbGxvd3MgdG8gZGVmaW5lIGEgdW5pcXVlIGN0eF9zdGFydFRpbWUgcGVyIHdoaWxlIGxvb3AgdGhhdCB3aWxsIFxuICAgICAgLy8gYmUgdXNlZCBpbiBpdHMgY29ycmVzcG9uZGluZyBsb2FkQXVkaW9CdWZmZXIgY2FsbGJhY2suIChoZW5jZSBub3QgdG8gd29ycnkgaW4gc3luYy5cbiAgICAgIC8vIG1vZGUgaWYgdGhlIGZpcnN0IGxvYWRlZCBhdWRpbyBidWZmZXIgaXMgbm90IHRoZSBmaXJzdCByZXF1ZXN0ZWQpXG4gICAgICBjb25zdCBjdHhfc3RhcnRUaW1lID0gdGhpcy5fY3R4X3RpbWVfd2hlbl9xdWV1ZV9lbmRzIC0gbWV0YUJ1ZmZlci5vdmVybGFwU3RhcnQ7XG5cbiAgICAgIC8vIGdldCBidWZmZXIgbmFtZSAocmVtb3ZlIFwicHVibGljXCIgZnJvbSBhZGRyZXNzKVxuICAgICAgbGV0IGNodW5rTmFtZSA9IG1ldGFCdWZmZXIubmFtZS5zdWJzdHIobWV0YUJ1ZmZlci5uYW1lLmluZGV4T2YoJ3B1YmxpYycpICsgNywgbWV0YUJ1ZmZlci5uYW1lLmxlbmd0aCAtIDEpO1xuXG4gICAgICAvLyBsb2FkIGFuZCBhZGQgYnVmZmVyIHRvIHF1ZXVlXG4gICAgICBsb2FkQXVkaW9CdWZmZXIoY2h1bmtOYW1lKS50aGVuKChidWZmZXIpID0+IHtcbiAgICAgICAgLy8gZGlzY2FyZCBpZiBzdG9wIHJlcXVpcmVkIHNpbmNlXG4gICAgICAgIGlmICh0aGlzLl9zdG9wUmVxdWlyZWQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fYWRkQnVmZmVyVG9RdWV1ZShidWZmZXIsIGN0eF9zdGFydFRpbWUsIG1ldGFCdWZmZXIub3ZlcmxhcFN0YXJ0LCBtZXRhQnVmZmVyLm92ZXJsYXBFbmQpO1xuICAgICAgICAvLyBtYXJrIHRoYXQgZmlyc3QgcGFja2V0IGFycml2ZWQgYW5kIHRoYXQgd2UgY2FuIGFzayBmb3IgbW9yZVxuICAgICAgICBpZiAodGhpcy5fZmlyc3RQYWNrZXRTdGF0ZSA9PSAxICYmICF0aGlzLl9zeW5jKSB7IHRoaXMuX2ZpcnN0UGFja2V0U3RhdGUgPSAyOyB9XG4gICAgICB9KTtcblxuICAgICAgLy8gZmxhZyB0aGF0IGZpcnN0IHBhY2tldCBoYXMgYmVlbiByZXF1aXJlZCBhbmQgdGhhdCB3ZSBtdXN0IGF3YWl0IGZvciBpdHMgYXJyaXZhbCBpbiB1bnN5bmMgbW9kZSBiZWZvcmUgYXNraW5nIGZvciBtb3JlXG4gICAgICBpZiAodGhpcy5fZmlyc3RQYWNrZXRTdGF0ZSA9PSAwICYmICF0aGlzLl9zeW5jKSB7IHRoaXMuX2ZpcnN0UGFja2V0U3RhdGUgPSAxOyB9XG5cbiAgICAgIC8vIGluY3JlbWVudFxuICAgICAgdGhpcy5fY3VycmVudEJ1ZmZlckluZGV4ICs9IDE7XG4gICAgICB0aGlzLl9jdHhfdGltZV93aGVuX3F1ZXVlX2VuZHMgKz0gbWV0YUJ1ZmZlci5kdXJhdGlvbjtcbiAgICAgIC8vIG5lZWQgdG8gaW5jcmVtZW50IHF1ZXVlIHRpbWUgb2Ygb25seSBhIHBlcmNlbnRhZ2Ugb2YgZmlyc3QgYnVmZmVyIGR1cmF0aW9uIChmb3Igc3luYyBtb2RlKVxuICAgICAgaWYgKCF0aGlzLl9vZmZzZXRJbkZpcnN0QnVmZmVyQWNjb3VudGVkRm9yKSB7XG4gICAgICAgIHRoaXMuX2N0eF90aW1lX3doZW5fcXVldWVfZW5kcyAtPSB0aGlzLl9vZmZzZXRJbkZpcnN0QnVmZmVyO1xuICAgICAgICB0aGlzLl9vZmZzZXRJbkZpcnN0QnVmZmVyQWNjb3VudGVkRm9yID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgLy8gY2hlY2sgaWYgcmVhY2hlZCBlbmQgb2YgY2h1bmsgbGlzdCAoaS5lLiBlbmQgb2YgZmlsZSkgYXQgbmV4dCBpdGVyYXRpb25cbiAgICAgIGlmICh0aGlzLl9jdXJyZW50QnVmZmVySW5kZXggPT09IGJ1ZmZlckluZm8ubGVuZ3RoKSB7XG4gICAgICAgIGlmICh0aGlzLl9sb29wKSB7IHRoaXMuX2N1cnJlbnRCdWZmZXJJbmRleCA9IDA7IH0gZWxzZSB7XG4gICAgICAgICAgLy8gc29mdCBzdG9wXG4gICAgICAgICAgdGhpcy5fZHJvcCgpO1xuICAgICAgICAgIC8vIGFjdGl2YXRlIG9uZW5kZWQgY2FsbGJhY2sgKHRvZG86IHNob3VsZCBiZSBjYWxsZWQgYnkgbGFzdCBBdWRpb0J1ZmZlclNvdXJjZSByYXRoZXIgdGhhbiB3aXRoIHNldFRpbWVvdXQpIFxuICAgICAgICAgIGNvbnN0IHRpbWVCZWZvcmVFbmQgPSB0aGlzLl9jdHhfdGltZV93aGVuX3F1ZXVlX2VuZHMgLSB0aGlzLnN5bmNTZXJ2aWNlLmdldFN5bmNUaW1lKCk7XG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IHRoaXMub25lbmRlZCgpOyB9LCB0aW1lQmVmb3JlRW5kICogMTAwMCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIGF1ZGlvIGJ1ZmZlciB0byBzdHJlYW0gcXVldWUuXG4gICAqIEBwYXJhbSB7QXVkaW9CdWZmZXJ9IGJ1ZmZlciAtIEF1ZGlvIGJ1ZmZlciB0byBhZGQgdG8gcGxheWluZyBxdWV1ZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHN0YXJ0VGltZSAtIFRpbWUgYXQgd2hpY2ggYXVkaW8gYnVmZmVyIHBsYXlpbmcgaXMgZHVlLlxuICAgKiBAcGFyYW0ge051bWJlcn0gb3ZlcmxhcFN0YXJ0IC0gRHVyYXRpb24gKGluIHNlYykgb2YgdGhlIGFkZGl0aW9uYWwgYXVkaW8gY29udGVudCBhZGRlZCBieSB0aGUgXG4gICAqICBub2RlLWF1ZGlvLXNsaWNlciAob24gc2VydmVyIHNpZGUpIGF0IGF1ZGlvIGJ1ZmZlcidzIGhlYWQgKHVzZWQgaW4gZmFkZS1pbiBtZWNoYW5pc20gdG8gYXZvaWRcbiAgICogIHBlcmNlaXZpbmcgcG90ZW50aWFsIC5tcDMgZW5jb2RpbmcgYXJ0aWZhY3RzIGludHJvZHVjZWQgd2hlbiBidWZmZXIgc3RhcnRzIHdpdGggbm9uLXplcm8gdmFsdWUpXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBvdmVybGFwRW5kIC0gRHVyYXRpb24gKGluIHNlYykgb2YgdGhlIGFkZGl0aW9uYWwgYXVkaW8gY29udGVudCBhZGRlZCBhdCBhdWRpbyBcbiAgICogYnVmZmVyJ3MgdGFpbC5cbiAgICogQHByaXZhdGVcbiAgICoqL1xuICBfYWRkQnVmZmVyVG9RdWV1ZShidWZmZXIsIHN0YXJ0VGltZSwgb3ZlcmxhcFN0YXJ0LCBvdmVybGFwRW5kKSB7XG5cbiAgICAvLyBnZXQgcmVsYXRpdmUgc3RhcnQgdGltZSAoaW4gIGhvdyBtYW55IHNlY29uZHMgZnJvbSBub3cgbXVzdCB0aGUgYnVmZmVyIGJlIHBsYXllZClcbiAgICBsZXQgcmVsU3RhcnRUaW1lID0gc3RhcnRUaW1lIC0gdGhpcy5zeW5jU2VydmljZS5nZXRTeW5jVGltZSgpO1xuXG4gICAgLy8gbm9uIHN5bmMgc2NlbmFyaW86IHNob3VsZCBwbGF5IHdob2xlIGZpcnN0IGJ1ZmZlciB3aGVuIGRvd25sb2FkZWRcbiAgICBpZiAoIXRoaXMuX3N5bmMpIHtcbiAgICAgIC8vIGZpcnN0IHBhY2tldDoga2VlcCB0cmFjayBvZmYgaW5pdCBvZmZzZXQgKE1VU1QgQkUgRklSU1QgUEFDS0VUIFJFR0FSRElORyBUSU1FIExJTkUsIGhlbmNlIF9maXJzdFBhY2tldFN0YXRlIGJhc2VkIG1lY2hhbmlzbSBhYm92ZSlcbiAgICAgIGlmICh0aGlzLl91bnN5bmNTdGFydE9mZnNldCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuX3Vuc3luY1N0YXJ0T2Zmc2V0ID0gcmVsU3RhcnRUaW1lO1xuICAgICAgfVxuICAgICAgcmVsU3RhcnRUaW1lIC09IHRoaXMuX3Vuc3luY1N0YXJ0T2Zmc2V0O1xuICAgIH1cbiAgICAvLyBzeW5jIHNjZW5hcmlvOiBzaG91bGQgcGxheSBpbiBmaXJzdCBidWZmZXIgdG8gc3RheSBpbiBzeW5jXG4gICAgZWxzZSB7XG4gICAgICAvLyBoYWNrOiB1c2UgX3Vuc3luY1N0YXJ0T2Zmc2V0IHRvIGNoZWNrIGlmIGZpcnN0IHRpbWUgd2UgY29tZSBoZXJlXG4gICAgICBpZiAodGhpcy5fdW5zeW5jU3RhcnRPZmZzZXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLl91bnN5bmNTdGFydE9mZnNldCA9IC0xOyAvLyBqdXN0IHNvIHdlIGRvbid0IGNvbWUgaGVyZSBhZ2FpblxuICAgICAgICByZWxTdGFydFRpbWUgLT0gdGhpcy5fb2Zmc2V0SW5GaXJzdEJ1ZmZlcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBpZiB0aGVuIHJlbFN0YXJ0VGltZSBpcyBhYm92ZSBzb3VyY2UgYnVmZmVyIGR1cmF0aW9uXG4gICAgaWYgKC1yZWxTdGFydFRpbWUgPj0gYnVmZmVyLmR1cmF0aW9uKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ2F1ZGlvc3RyZWFtOiB0b28gbG9uZyBsb2FkaW5nLCBkaXNjYXJkaW5nIGJ1ZmZlcicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIGNvbnNvbGUubG9nKCAnYWRkIGJ1ZmZlciB0byBxdWV1ZSBzdGFydGluZyBhdCcsIHN0YXJ0VGltZSwgJ2kuZS4gaW4nLCByZWxTdGFydFRpbWUsICdzZWMnICk7XG5cbiAgICAvLyBoYXJkLWNvZGUgb3ZlcmxhcCBmYWRlLWluIGFuZCBvdXQgaW50byBidWZmZXJcbiAgICBsZXQgblNhbXBGYWRlSW4gPSBNYXRoLmZsb29yKG92ZXJsYXBTdGFydCAqIGJ1ZmZlci5zYW1wbGVSYXRlKTtcbiAgICBsZXQgblNhbXBGYWRlT3V0ID0gTWF0aC5mbG9vcihvdmVybGFwRW5kICogYnVmZmVyLnNhbXBsZVJhdGUpO1xuICAgIC8vIGxvb3Agb3ZlciBhdWRpbyBjaGFubmVsc1xuICAgIGZvciAobGV0IGNoSWQgPSAwOyBjaElkIDwgYnVmZmVyLm51bWJlck9mQ2hhbm5lbHM7IGNoSWQrKykge1xuICAgICAgLy8gZ2V0IHJlZiB0byBhdWRpbyBkYXRhXG4gICAgICBsZXQgY2hEYXRhID0gYnVmZmVyLmdldENoYW5uZWxEYXRhKGNoSWQpO1xuICAgICAgLy8gZmFkZSBpblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuU2FtcEZhZGVJbjsgaSsrKSB7XG4gICAgICAgIGNoRGF0YVtpXSA9IGNoRGF0YVtpXSAqIChpIC8gKG5TYW1wRmFkZUluIC0gMSkpO1xuICAgICAgfVxuICAgICAgLy8gZmFkZSBvdXRcbiAgICAgIGZvciAobGV0IGkgPSBjaERhdGEubGVuZ3RoIC0gblNhbXBGYWRlT3V0OyBpIDwgY2hEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNoRGF0YVtpXSA9IGNoRGF0YVtpXSAqIChjaERhdGEubGVuZ3RoIC0gaSAtIDEpIC8gKG5TYW1wRmFkZU91dCAtIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNyZWF0ZSBhdWRpbyBzb3VyY2VcbiAgICBsZXQgc3JjID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuICAgIHNyYy5idWZmZXIgPSBidWZmZXI7XG4gICAgLy8gY29ubmVjdCBncmFwaFxuICAgIHNyYy5jb25uZWN0KHRoaXMuX291dCk7XG5cbiAgICAvLyBzdGFydCBzb3VyY2Ugbm93IChub3QgZnJvbSBiZWdpbm5pbmcgc2luY2Ugd2UncmUgYWxyZWFkeSBsYXRlKVxuICAgIGNvbnN0IG5vdyA9IGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZTtcbiAgICBpZiAocmVsU3RhcnRUaW1lIDwgMCkgeyBzcmMuc3RhcnQobm93LCAtcmVsU3RhcnRUaW1lKTsgfVxuICAgIC8vIHN0YXJ0IHNvdXJjZSBkZWxheWVkIChmcm9tIGJlZ2lubmluZyBpbiBhYnMocmVsU3RhcnRUaW1lKSBzZWNvbmRzKVxuICAgIGVsc2UgeyBzcmMuc3RhcnQobm93ICsgcmVsU3RhcnRUaW1lLCAwKTsgfVxuICAgIC8vIGtlZXAgcmVmLiB0byBzb3VyY2VcbiAgICB0aGlzLl9zcmNNYXAuc2V0KHN0YXJ0VGltZSwgc3JjKTtcbiAgICAvLyBzb3VyY2UgcmVtb3ZlcyBpdHNlbGYgZnJvbSBsb2NhbHMgd2hlbiBlbmRlZFxuICAgIHNyYy5vbmVuZGVkID0gKCkgPT4geyB0aGlzLl9zcmNNYXAuZGVsZXRlKHN0YXJ0VGltZSk7IH07XG4gIH1cblxuICAvKiogXG4gICAqIFN0b3AgdGhlIGF1ZGlvIHN0cmVhbS4gTWltaWNzIEF1ZGlvQnVmZmVyU291cmNlTm9kZSBzdG9wKCkgbWV0aG9kLiBBIHN0b3BwZWQgXG4gICAqIGF1ZGlvIHN0cmVhbSBjYW4gYmUgc3RhcnRlZCAobm8gbmVlZCB0byBjcmVhdGUgYSBuZXcgb25lIGFzIHJlcXVpcmVkIHdoZW4gdXNpbmdcbiAgICogYW4gQXVkaW9CdWZmZXJTb3VyY2VOb2RlKS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHdoZW4gLSBvZmZzZXQgdGltZSAoaW4gc2VjKSBmcm9tIG5vdyAod2hlbiBjb21tYW5kIGlzc3VlZCkgYXQgd2hpY2hcbiAgICogIHRoZSBhdWRpbyBzdHJlYW0gc2hvdWxkIHN0b3AgcGxheWluZy5cbiAgICoqL1xuICBzdG9wKHdoZW4gPSAwKSB7XG4gICAgLy8gbm8gbmVlZCB0byBzdG9wIGlmIG5vdCBzdGFydGVkXG4gICAgaWYgKCF0aGlzLmlzUGxheWluZygpKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ3N0b3AgZGlzY2FyZGVkLCBtdXN0IHN0YXJ0IGZpcnN0Jyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX2Ryb3AoKTtcbiAgICAvLyBmbGFnIHN0b3AgcmVxdWlyZWQgdG8gYXZvaWQgcGxheWluZyBuZXdseSBsb2FkZWQgYnVmZmVyc1xuICAgIHRoaXMuX3N0b3BSZXF1aXJlZCA9IHRydWU7XG4gICAgLy8ga2lsbCBzb3VyY2VzXG4gICAgdGhpcy5fc3JjTWFwLmZvckVhY2goKHNyYywgc3RhcnRUaW1lKSA9PiB7XG4gICAgICAvLyBpZiBzb3VyY2UgZHVlIHRvIHN0YXJ0IGFmdGVyIHN0b3AgdGltZVxuICAgICAgaWYgKHN0YXJ0VGltZSA+PSB0aGlzLnN5bmNTZXJ2aWNlLmdldFN5bmNUaW1lKCkgKyB3aGVuKSB7IHNyYy5zdG9wKGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSk7IH1cbiAgICAgIC8vIHN0b3AgYWxsIHNvdXJjZXMgY3VycmVudGx5IHBsYXlpbmcgaW4gXCJ3aGVuXCIgKGRvbid0IGNhcmUgaWYgc291cmNlIHRoZW4gc3RvcHBlZCBieSBpdHNlbGYpXG4gICAgICBlbHNlIHsgc3JjLnN0b3AoYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lICsgd2hlbik7IH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBsb2NhbCBzdG9wOiBlbmQgc3RyZWFtaW5nIHJlcXVlc3RzLCBjbGVhciBzdHJlYW1pbmcgY2FsbGJhY2tzLCBldGMuXG4gICAqIGluIHNob3J0LCBzdG9wIGFsbCBidXQgc3RvcCB0aGUgYXVkaW8gc291cmNlcywgdG8gdXNlIF9kcm9wKCkgcmF0aGVyIFxuICAgKiB0aGFuIHN0b3AoKSBpbiBcImF1ZGlvIGZpbGUgb3ZlciBhbmQgbm90IGxvb3BcIiBzY2VuYXJpby5cbiAgICogQHByaXZhdGVcbiAgICoqL1xuICBfZHJvcCgpIHtcbiAgICAvLyByZXNldCBsb2NhbCB2YWx1ZXNcbiAgICB0aGlzLl9yZXNldCgpO1xuICAgIC8vIGtpbGwgY2FsbGJhY2tcbiAgICBjbGVhckludGVydmFsKHRoaXMuX2NodW5rUmVxdWVzdENhbGxiYWNrSW50ZXJ2YWwpO1xuICAgIHRoaXMuX2NodW5rUmVxdWVzdENhbGxiYWNrSW50ZXJ2YWwgPSB1bmRlZmluZWQ7XG4gIH1cblxufSJdfQ==