import { audioContext } from 'waves-audio';
import path from 'path';
import debug from 'debug';
import Service from '../core/Service';
import serviceManager from '../core/serviceManager';

const SERVICE_ID = 'service:audio-stream-manager';
const log = debug('soundworks:services:audio-stream-manager');

// TODO:
// - support streaming of files of total duration shorter than packet duration

function loadAudioBuffer(url) {
  const promise = new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    request.onload = () => {
      const response = request.response;
      audioContext.decodeAudioData(response, resolve, reject);
    }

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

class AudioStreamManager extends Service {
  /** _<span class="warning">__WARNING__</span> This class should never be instantiated manually_ */
  constructor() {
    super(SERVICE_ID, false);

    this.bufferInfos = new Map();
    // define general offset in sync loop (in sec) (not propagated to
    // already created audio streams when modified)
    this.syncStartTime = 0;

    // configure options
    const defaults = {
      monitorInterval: 1, // in seconds
      requiredAdvanceThreshold: 10, // in seconds
      assetsDomain: '',
    };

    this.configure(defaults);

    this.syncService = this.require('sync');

    this._onAcknowledgeResponse = this._onAcknowledgeResponse.bind(this);
  }

  /** @private */
  start() {
    super.start();
    // send request for infos on "streamable" audio files
    this.receive('acknowlegde', this._onAcknowledgeResponse);
    this.receive('syncStartTime', value => this.syncStartTime = value);
    this.send('request');

    // @todo - should receive a sync start time from server
  }

  /**
   * @private
   * @param {Object} bufferInfos - info on audio files that can be streamed
   */
  _onAcknowledgeResponse(bufferInfos) {
    bufferInfos.forEach((item) => {
      // @todo - this has to be reviewed, not robust
      const chunkPath = item[0].name;
      const dirname = path.dirname(chunkPath);
      const parts = dirname.split('/');
      const bufferId = parts.pop();

      item.forEach(chunk => {
        chunk.url = chunk.name.replace('public/', this.options.assetsDomain);
      });

      this.bufferInfos.set(bufferId, item);
    });

    this.ready();
  }

  /**
   * Return a new audio stream node.
   */
  getAudioStream() {
    // console.log(this.syncStartTime, this.syncService.getSyncTime());
    return new AudioStream(
      this.bufferInfos,
      this.syncService,
      this.options.monitorInterval,
      this.options.requiredAdvanceThreshold,
      this.syncStartTime
    );
  }

}

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
    this.syncStartTime = syncStartTime;

    // local attr.
    this._sync = false;
    this._loop = false;
    this._periodic = false;
    this._metaData = undefined;
    this._url = null;

    this.output = audioContext.createGain();

    // stream monitoring
    this._intervalId = undefined;
    this._queueEndTime = 0;
    this._srcMap = new Map();
    this._stopRequired = false;

    this._reset();

    this._requestChunks = this._requestChunks.bind(this);
    this._onended = this._onended.bind(this);
  }

  /**
   * Init / reset local attributes (at stream creation and stop() ).
   * @private
   */
  _reset() {
    this._firstChunkNetworkLatencyOffset = undefined;
    this._currentChunkIndex = -1;
    this._firstPacketState = 0;
  }

  /**
   * Define url of audio file to stream, send meta data request to server concerning this file.
   *
   * @param {String} url - Requested file name, without extension
   */
  set url(filename) {
    if (this.isPlaying) {
      console.warn('[WARNING] - Cannot set url while playing');
      return;
    }

    // check if url corresponds to a streamable file
    if (this.bufferInfos.get(filename))
      this._url = filename;
    else
      console.error(`[ERROR] - ${filename} url not in ${this.bufferInfos} \n ### url discarded`);
  }

  get url() {
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
  set sync(val) {
    if (this.isPlaying) {
      console.warn('[WARNING] - Cannot set sync while playing');
      return;
    }

    this._sync = val;
  }

  get sync() {
    return this._sync;
  }

  /**
   * Set/Get loop mode. onended() method not called if loop enabled.
   * @param {Bool} val - enable / disable sync
   */
  set loop(val) {
    if (this.isPlaying) {
      console.warn('[WARNING] - Cannot set loop while playing');
      return;
    }

    this._loop = val;
  }

  get loop() {
    return this._loop;
  }

  /**
   * Set/Get periodic mode. we don't want the stream to be synchronized to
   * a common origin, but have them aligned on a grid. aka, we don't wan't to
   * compensate for the loading time, when starting with an offset.
   * @param {Bool} val - enable / disable periodic
   */
  set periodic(val) {
    if (this.isPlaying) {
      console.warn('[WARNING] - Cannot set loop while playing');
      return;
    }

    this._periodic = val;
  }

  get periodic() {
    return this._periodic;
  }

  /**
   * Return the total duration (in secs) of the audio file currently streamed.
   */
  get duration() {
    const bufferInfo = this.bufferInfos.get(this._url);
    const lastChunk = bufferInfo[bufferInfo.length - 1];
    const duration = lastChunk.start + lastChunk.duration;
    return duration;
  }

  /**
   * Connect the stream to an audio node.
   *
   * @param {AudioNode} node - Audio node to connect to.
   */
  connect(node) {
    this.output.connect(node);
  }

  /**
   * Method called when stream finished playing on its own (won't fire if loop
   * enabled).
   */
  onended() {}

  /**
   * Method called when stream drops a packet (arrived too late).
   */
  ondrop() {
    console.warn('audiostream: too long loading, discarding buffer');
  }

  /**
   * Method called when stream received a packet late, but not too much to drop
   * it (gap in audio).
   * @param {Number} time - delay time.
   */
  onlate(time) {}

  /**
   * Start streaming audio source.
   * @warning - offset doesn't seem to make sens when not loop and not periodic
   *
   * @param {Number} offset - time in buffer from which to start (in sec)
   */
  start(offset = 0) {
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

    const bufferInfo = this.bufferInfos.get(this._url);
    const duration = this.duration;

    if (this.sync) {
      const syncTime = this.syncService.getSyncTime();
      const startTime = this.syncStartTime;
      offset = syncTime - startTime + offset;
    }

    if (this.loop)
      offset = offset % duration;

    // this looks coherent for all combinations of `loop` and `sync`
    // console.log('offset', offset);
    // console.log('duration', duration);

    if (offset >= duration) {
      console.warn(`[WARNING] - start() discarded, requested offset
        (${offset} sec) larger than file duration (${duration} sec)`);
      return;
    }

    // find index of the chunk corresponding to given offset
    let index = 0;
    let offsetInFirstChunk = 0;
    // console.log(bufferInfo, index, bufferInfo[index]);

    while (this._currentChunkIndex === -1 && index < bufferInfo.length) {
      const chunkInfos = bufferInfo[index];
      const start = chunkInfos.start;
      const end = start + chunkInfos.duration;

      if (offset >= start && offset < end) {
        this._currentChunkIndex = index;
        offsetInFirstChunk = offset - start;
      }

      index += 1;
    }

    // handle negative offset, pick first chunk. This can be usefull to start
    // synced stream while give them some delay to preload the first chunk
    if (this._currentChunkIndex === -1 && offset < 0)
      this._currentChunkIndex = 0;

    // console.log('AudioStream.start()', this._url, this._currentChunkIndex);
    this._stopRequired = false;
    this._queueEndTime = this.syncService.getSyncTime() - offsetInFirstChunk;

    // @important - never change the order of these 2 calls
    this._intervalId = setInterval(this._requestChunks, this.monitorInterval);
    this._requestChunks();
  }

  _onended() {
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
  stop(offset = 0) {
    if (!this.isPlaying) {
      console.warn('[WARNING] - stop discarded, not started or already ended');
      return;
    }

    if (this._intervalId !== undefined)
      this._clearRequestChunks();


    this._stopRequired = true; // avoid playing buffer that are currently loading
    this._reset();

    const now = this.syncService.getSyncTime();
    const audioTime = audioContext.currentTime;
    const size = this._srcMap.size;
    let counter = 0;

    this._srcMap.forEach((src, startTime) => {
      counter += 1;
      src.onended = null;

      // pick a source arbitrarily to trigger the `onended` event properly
      if (counter === size)
        src.onended = this._onended;

      if (startTime < (now + offset) || src.onended !== null)
        src.stop(audioTime + offset);
      else
        src.stop(audioTime);
    });

    this._srcMap.clear();
  }

  /**
   * Check if we have enough "local buffer time" for the audio stream,
   * request new buffer chunks otherwise.
   * @private
   */
  _requestChunks() {
    const bufferInfo = this.bufferInfos.get(this._url);
    const now = this.syncService.getSyncTime();

    // have to deal properly with
    while (this._queueEndTime - now <= this.requiredAdvanceThreshold) {
      // in non sync mode, we want the start time to be delayed when the first
      // buffer is actually received, so we load it before requesting next ones
      if (this._firstPacketState === 1 && !this._sync)
        return;

      const chunkInfos = bufferInfo[this._currentChunkIndex];
      const chunkStartTime = this._queueEndTime - chunkInfos.overlapStart;
      const url = chunkInfos.url;

      // flag that first packet has been required and that we must await for its
      // arrival in unsync mode before asking for more, as the network delay
      // will define the `true` start time
      if (this._firstPacketState === 0 && !this._sync)
        this._firstPacketState = 1;

      // console.log('currentChunkIndex', this._currentChunkIndex);
      // console.log('timeAtQueueEnd', this._queueEndTime);
      // console.log('chunkStartTime', chunkStartTime);

      const currentChunkIndex = this._currentChunkIndex;

      this._currentChunkIndex += 1;
      this._queueEndTime += chunkInfos.duration;

      let isLastChunk = false;

      if (this._currentChunkIndex === bufferInfo.length) {
        if (this._loop) {
          this._currentChunkIndex = 0;
        } else {
          // has this method is called once outside the loop, it might append
          // that we finish the whole loading without actually having an
          // intervalId, maybe handle this more properly with reccursive
          // `setTimeout`s
          if (this._intervalId)
            this._clearRequestChunks();
          // but reset later as the last chunk still needs the current offsets
          isLastChunk = true;
        }
      }

      // load and add buffer to queue
      loadAudioBuffer(url).then((buffer) => {
        if (this._stopRequired)
          return;

        // mark that first packet arrived and that we can ask for more
        if (this._firstPacketState === 1 && !this._sync)
          this._firstPacketState = 2;

        const { overlapStart, overlapEnd } = chunkInfos;
        this._addBufferToQueue(buffer, chunkStartTime, overlapStart, overlapEnd, isLastChunk);

        if (isLastChunk)
          this._reset();
      });

      if (isLastChunk)
        break;
    }
  }

  /**
   * Stop looking for new chunks
   * @private
   */
  _clearRequestChunks() {
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
  _addBufferToQueue(buffer, startTime, overlapStart, overlapEnd, isLastChunk) {
    // hard-code overlap fade-in and out in buffer
    const numSamplesFadeIn = Math.floor(overlapStart * buffer.sampleRate);
    const numSamplesFadeOut = Math.floor(overlapEnd * buffer.sampleRate);
    // loop over audio channels
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel);

      // fade in
      for (let i = 0; i < numSamplesFadeIn; i++) {
        const gain = i / (numSamplesFadeIn - 1);
        channelData[i] = channelData[i] * gain;
      }

      // fade out
      for (let i = channelData.length - numSamplesFadeOut; i < channelData.length; i++) {
        const gain = (channelData.length - i - 1) / (numSamplesFadeOut - 1);
        channelData[i] = channelData[i] * gain;
      }
    }


    const syncTime = this.syncService.getSyncTime();
    const now = audioContext.currentTime;
    let offset = startTime - syncTime;

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
      const src = audioContext.createBufferSource();
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

      src.onended = () => {
        this._srcMap.delete(startTime);

        if (isLastChunk)
          this._onended();
      };
    } else {
      this.ondrop();
    }
  }

}

serviceManager.register(SERVICE_ID, AudioStreamManager);
export default AudioStreamManager;
