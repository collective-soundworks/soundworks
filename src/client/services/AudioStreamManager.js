import { audioContext } from 'waves-audio';
import debug from 'debug';
import Service from '../core/Service';
import serviceManager from '../core/serviceManager';

const SERVICE_ID = 'service:audio-stream-manager';
const log = debug('soundworks:services:audio-stream-manager');

// TODO:
// - support streaming of files of total duration shorter than packet duration


// load an audio buffer from server's disk (based on XMLHttpRequest)
function loadAudioBuffer(chunkName) {
  const promise = new Promise((resolve, reject) => {
    // create request
    var request = new XMLHttpRequest();
    request.open('GET', chunkName, true);
    request.responseType = 'arraybuffer';
    // define request callback
    request.onload = () => {
        audioContext.decodeAudioData(request.response, (buffer) => {
          resolve(buffer);
        }, (e) => { reject(e); });
      }
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

class AudioStreamManager extends Service {
  /** _<span class="warning">__WARNING__</span> This class should never be instantiated manually_ */
  constructor() {
    super(SERVICE_ID, false);
    // locals
    this.bufferInfos = new Map();
    this.syncStartTime = 0; // Define general offset in sync loop (in sec) (not propagated to already created audio streams when modified)
    // configure options
    const defaults = {
      monitorInterval: 1, // in seconds
      requiredAdvanceThreshold: 10, // in seconds
    };
    this.configure(defaults);
    // services
    this.syncService = this.require('sync');
    // bindings
    this._onAcknowledgeResponse = this._onAcknowledgeResponse.bind(this);
  }

  /** @private */
  start() {
    super.start();
    // send request for infos on "streamable" audio files
    this.receive('acknowlegde', this._onAcknowledgeResponse);
    this.send('request');
  }

  /**
   * @private
   * @param {Object} bufferInfos - info on audio files that can be streamed
   */
  _onAcknowledgeResponse(bufferInfos) {
    // shape buffer infos
    bufferInfos.forEach((item) => {
      // get file name (assume at least 1 chunk in item)
      let fileName = item[0].name.split("/").pop();
      fileName = fileName.substr(fileName.indexOf("-") + 1, fileName.lastIndexOf(".") - 2);
      // save in locals
      this.bufferInfos.set(fileName, item);
    });

    // flag service as ready
    this.ready();
  }

  /**
   * Return a new audio stream node.
   */
  getAudioStream() {
    return new AudioStream(this.bufferInfos, this.syncService, this.options.monitorInterval, this.options.requiredAdvanceThreshold, this.syncStartTime);
  }

}

// register / export service
serviceManager.register(SERVICE_ID, AudioStreamManager);
export default AudioStreamManager;

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
class AudioStream {
  /** _<span class="warning">__WARNING__</span> This class should never be instantiated manually_ */
  constructor(bufferInfos, syncService, monitorInterval, requiredAdvanceThreshold, syncStartTime) {

    // arguments
    this.bufferInfos = bufferInfos;
    this.syncService = syncService;
    this.monitorInterval = monitorInterval * 1000; // in ms
    this.requiredAdvanceThreshold = requiredAdvanceThreshold;

    // local attr.
    this._sync = false;
    this._loop = false;
    this._metaData = undefined;
    this._out = audioContext.createGain();
    this._syncStartTime = syncStartTime;

    // stream monitoring
    this._chunkRequestCallbackInterval = undefined;
    this._ctx_time_when_queue_ends = 0;
    this._srcMap = new Map();
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
  _reset() {
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
  set url(fileName) {
    // discard if currently playing
    if (this.isPlaying()) {
      console.warn('set url ignored while playing');
      return;
    }
    // check if url corresponds with a streamable file
    if (this.bufferInfos.get(fileName)) { this._url = fileName; }
    // discard otherwise
    else { console.error(fileName, 'url not in', this.bufferInfos, ', \n ### url discarded'); }
  }

  /**
   * Set/Get synchronized mode status. in non sync. mode, the stream audio
   * will start whenever the first audio buffer is downloaded. in sync. mode, 
   * the stream audio will start (again asa the audio buffer is downloaded) 
   * with an offset in the buffer, as if it started playing exactly when the 
   * start() command was issued.
   * @param {Bool} val - enable / disable sync
   **/
  set sync(val) {
    if (this.isPlaying()) {
      console.warn('set sync ignored while playing');
      return;
    }
    this._sync = val;
  }
  get sync() {
    return this._sync; }

  /**
   * Set/Get loop mode. onended() method not called if loop enabled.
   * @param {Bool} val - enable / disable sync
   **/
  set loop(val) {
    if (this.isPlaying()) {
      console.warn('set loop ignored while playing');
      return;
    }
    this._loop = val;
  }
  get loop() {
    return this._loop; }


  /**
   * Return the total duration (in secs) of the audio file currently streamed.
   **/
  get duration() {
    let bufferInfo = this.bufferInfos.get(this._url);
    let endBuffer = bufferInfo[bufferInfo.length - 1];
    let duration = endBuffer.start + endBuffer.duration;
    return duration;
  }

  /**
   * Connect audio stream to an audio node.
   * @param {AudioNode} node - node to connect to.
   **/
  connect(node) {
    this._out.connect(node);
  }

  /**
   * Method called when stream finished playing on its own (won't fire if loop enabled).
   **/
  onended() {}

  /**
   * Method called when stream drops a packet (arrived too late).
   **/
  ondrop() {
    console.warn('audiostream: too long loading, discarding buffer');
  }

  /**
   * Method called when stream received a packet late, but not too much to drop it (gap in audio).
   * @param {Number} time - delay time.
   **/
  onlate(time) {}  

  /**
   * Return true if stream is playing, false otherwise.
   **/
  isPlaying() {
    if (this._chunkRequestCallbackInterval === undefined) {
      return false;
    } else {
      return true
    }
  }

  /** 
   * Start streaming audio source.
   * @param {Number} offset - time in buffer from which to start (in sec).
   **/
  start(offset) {

    // check if we dispose of valid url to execute start
    if (this._url === undefined) {
      console.warn('start command discarded, must define valid url first');
      return;
    }

    // get total duration of targetted audio file
    let bufferInfo = this.bufferInfos.get(this._url);
    let duration = this.duration;

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
        if (offset >= duration) {  console.error('req. offset above file duration', offset, duration); }
      }
      // sync in "running loop" mode
      else { offset = ( this.syncService.getSyncTime() - this._syncStartTime ) % duration; }
    }
    // set default offset if not defined
    else { offset = (offset !== undefined) ? offset : 0; }

    // init queue timer
    this._ctx_time_when_queue_ends = this.syncService.getSyncTime();

    // find first index in buffer list for given offset
    let index = 1;
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
  _chunkRequestCallback() {

    // get array of streamed chunks info
    let bufferInfo = this.bufferInfos.get(this._url);

    // loop: do we need to request more chunks? if so, do, increment time flag, ask again
    while (this._ctx_time_when_queue_ends - this.syncService.getSyncTime() <= this.requiredAdvanceThreshold) {

      // mechanism to force await first buffer to offset whole queue in unsync mode
      if (this._firstPacketState == 1 && !this._sync) {
        return;
      }

      // get current working chunk info
      const metaBuffer = bufferInfo[this._currentBufferIndex];

      // get context absolute time at which current buffer must be started
      // this "const" here allows to define a unique ctx_startTime per while loop that will 
      // be used in its corresponding loadAudioBuffer callback. (hence not to worry in sync.
      // mode if the first loaded audio buffer is not the first requested)
      const ctx_startTime = this._ctx_time_when_queue_ends - metaBuffer.overlapStart;

      // get buffer name (remove "public" from address)
      let chunkName = metaBuffer.name.substr(metaBuffer.name.indexOf('public') + 7, metaBuffer.name.length - 1);

      // load and add buffer to queue
      loadAudioBuffer(chunkName).then((buffer) => {
        // discard if stop required since
        if (this._stopRequired) {
          return;
        }
        this._addBufferToQueue(buffer, ctx_startTime, metaBuffer.overlapStart, metaBuffer.overlapEnd);
        // mark that first packet arrived and that we can ask for more
        if (this._firstPacketState == 1 && !this._sync) { this._firstPacketState = 2; }
      });

      // flag that first packet has been required and that we must await for its arrival in unsync mode before asking for more
      if (this._firstPacketState == 0 && !this._sync) { this._firstPacketState = 1; }

      // increment
      this._currentBufferIndex += 1;
      this._ctx_time_when_queue_ends += metaBuffer.duration;
      // need to increment queue time of only a percentage of first buffer duration (for sync mode)
      if (!this._offsetInFirstBufferAccountedFor) {
        this._ctx_time_when_queue_ends -= this._offsetInFirstBuffer;
        this._offsetInFirstBufferAccountedFor = true;
      }

      // check if reached end of chunk list (i.e. end of file) at next iteration
      if (this._currentBufferIndex === bufferInfo.length) {
        if (this._loop) { this._currentBufferIndex = 0; } else {
          // soft stop
          this._drop();
          // activate onended callback (todo: should be called by last AudioBufferSource rather than with setTimeout) 
          const timeBeforeEnd = this._ctx_time_when_queue_ends - this.syncService.getSyncTime();
          setTimeout(() => { this.onended(); }, timeBeforeEnd * 1000);
          return;
        }
      }

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
  _addBufferToQueue(buffer, startTime, overlapStart, overlapEnd) {

    // get relative start time (in  how many seconds from now must the buffer be played)
    let relStartTime = startTime - this.syncService.getSyncTime();

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
      this.ondrop();
      return;
    }

    // console.log( 'add buffer to queue starting at', startTime, 'i.e. in', relStartTime, 'sec' );

    // hard-code overlap fade-in and out into buffer
    let nSampFadeIn = Math.floor(overlapStart * buffer.sampleRate);
    let nSampFadeOut = Math.floor(overlapEnd * buffer.sampleRate);
    // loop over audio channels
    for (let chId = 0; chId < buffer.numberOfChannels; chId++) {
      // get ref to audio data
      let chData = buffer.getChannelData(chId);
      // fade in
      for (var i = 0; i < nSampFadeIn; i++) {
        chData[i] = chData[i] * (i / (nSampFadeIn - 1));
      }
      // fade out
      for (let i = chData.length - nSampFadeOut; i < chData.length; i++) {
        chData[i] = chData[i] * (chData.length - i - 1) / (nSampFadeOut - 1);
      }
    }

    // create audio source
    let src = audioContext.createBufferSource();
    src.buffer = buffer;
    // connect graph
    src.connect(this._out);

    // start source now (not from beginning since we're already late)
    const now = audioContext.currentTime;
    if (relStartTime < 0) { 
      this.onlate(-relStartTime);
      src.start(now, -relStartTime); 
    }
    // start source delayed (from beginning in abs(relStartTime) seconds)
    else { src.start(now + relStartTime, 0); }
    // keep ref. to source
    this._srcMap.set(startTime, src);
    // source removes itself from locals when ended
    src.onended = () => { this._srcMap.delete(startTime); };
  }

  /** 
   * Stop the audio stream. Mimics AudioBufferSourceNode stop() method. A stopped 
   * audio stream can be started (no need to create a new one as required when using
   * an AudioBufferSourceNode).
   * @param {Number} when - offset time (in sec) from now (when command issued) at which
   *  the audio stream should stop playing.
   **/
  stop(when = 0) {
    // no need to stop if not started
    if (!this.isPlaying()) {
      console.warn('stop discarded, must start first');
      return;
    }
    this._drop();
    // flag stop required to avoid playing newly loaded buffers
    this._stopRequired = true;
    // kill sources
    this._srcMap.forEach((src, startTime) => {
      // if source due to start after stop time
      if (startTime >= this.syncService.getSyncTime() + when) { src.stop(audioContext.currentTime); }
      // stop all sources currently playing in "when" (don't care if source then stopped by itself)
      else { src.stop(audioContext.currentTime + when); }
    });
  }

  /**
   * local stop: end streaming requests, clear streaming callbacks, etc.
   * in short, stop all but stop the audio sources, to use _drop() rather 
   * than stop() in "audio file over and not loop" scenario.
   * @private
   **/
  _drop() {
    // reset local values
    this._reset();
    // kill callback
    clearInterval(this._chunkRequestCallbackInterval);
    this._chunkRequestCallbackInterval = undefined;
  }

}