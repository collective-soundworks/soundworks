import { AudioTimeEngine, audioContext } from 'waves-audio';
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
      assetsDomain: null,
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
    // this.receive('syncStartTime', value => this.syncStartTime = value);
    this.send('request');
  }

  /**
   * @private
   * @param {Object} bufferInfos - info on audio files that can be streamed
   */
  _onAcknowledgeResponse(bufferInfos) {
    console.log(bufferInfos);

    for (let id in bufferInfos) {
      bufferInfos[id].forEach(chunk => {
        if (this.options.assetsDomain !== null)
          chunk.url = this.options.assetsDomain + '/' + chunk.name;
        else
          chunk.url = chunk.name;
      });

      this.bufferInfos.set(id, bufferInfos[id]);
    }

    this.ready();
  }

  getStreamEngine(id) {
    if (!this.bufferInfos.has(id))
      throw new Error(`ndefined stream id: ${id}`)

    const engine = new StreamEngine({
      bufferInfos: this.bufferInfos.get(id),
      monitorInterval: this.options.monitorInterval,
      requiredAdvanceThreshold: this.options.requiredAdvanceThreshold,
    });

    return engine;
  }
}

class StreamEngine extends AudioTimeEngine {
  constructor(options) {
    super();

    this.outputNode = audioContext.createGain();

    this.bufferInfos = options.bufferInfos;
    this._monitorInterval = options.monitorInterval * 1000; // in ms

    const requiredAdvanceThreshold = options.requiredAdvanceThreshold;
    const buffersDuration = this.bufferInfos[0].duration;
    const minAdvanceChunks = 3;
    this.requiredAdvanceThreshold = Math.max(requiredAdvanceThreshold, buffersDuration * minAdvanceChunks);

    this._chunkIndex = -1;
    this._currentPosition = 0;
    this._cache = new Map();
    this._monitorPreloadTimeoutId = null;

    this._chunkSrc = null;

    this._monitorPreload = this._monitorPreload.bind(this);
  }

  get duration() {
    const bufferInfos = this.bufferInfos;
    const lastChunk = bufferInfos[bufferInfos.length - 1];
    const duration = lastChunk.start + lastChunk.duration;
    return duration;
  }

  _startMonitorPreload() {
    if (this._monitorPreloadTimeoutId === null)
      this._monitorPreload();
  }

  _stopMonitorPreload() {
    clearTimeout(this._monitorPreloadTimeoutId);
    this._monitorPreloadTimeoutId = null;
  }
  // monitor preload in `setInterval`
  _monitorPreload() {
    const advanceThreshold = this._currentPosition + this.requiredAdvanceThreshold;
    let index = this._chunkIndex;

    while (index < this.bufferInfos.length &&
      this.bufferInfos[index].start <= advanceThreshold) {

      if (!this._cache.has(index)) {
        const chunkIndex = index; // copy locally into block to avoid closure
        const startTime = this.bufferInfos[chunkIndex].start;
        const url = this.bufferInfos[chunkIndex].url;

        loadAudioBuffer(url).then(buffer => {
          this._cache.set(chunkIndex, buffer);
        });
      }

      index += 1;
    }

    this._monitorPreloadTimeoutId = setTimeout(this._monitorPreload, this._monitorInterval);
  }

  _clearCache(chunkIndex) {
    const position = this.bufferInfos[chunkIndex].start;
    const advanceThreshold = position + this.requiredAdvanceThreshold;
    const indexesToKeep = [];

    let index = chunkIndex;

    while (index < this.bufferInfos.length &&
      this.bufferInfos[index].start <= advanceThreshold) {

      indexesToKeep.push(index);
      index += 1;
    }

    for (let [key, value] of this._cache) {
      if (indexesToKeep.indexOf(key) === -1)
        this._cache.delete(key);
    }
  }

  _trigger(audioTime, position, speed) {
    const lastChunkIndex = this._chunkIndex - 1;

    // fade out old source
    if (lastChunkIndex >= 0 && this._chunkSrc) {
      const chunk = this.bufferInfos[lastChunkIndex];
      const overlapEnd = chunk.overlapEnd;
      const endTime = audioTime + overlapEnd;

      const { src, env } = this._chunkSrc;
      env.gain.setValueAtTime(1, audioTime);
      env.gain.linearRampToValueAtTime(0, endTime);

      src.stop(endTime);

      this._chunkSrc = null;
    }

    const env = audioContext.createGain();
    env.connect(this.outputNode);

    const src = audioContext.createBufferSource();
    src.connect(env);
    src.buffer = this._cache.get(this._chunkIndex);
    // @todo - src.playbackRate

    const { start, overlapStart } = this.bufferInfos[this._chunkIndex];
    const offset = position - start;

    if (overlapStart === 0 || offset !== 0) {
      env.gain.value = 1;
      env.gain.setValueAtTime(1, audioTime);
    } else {
      env.gain.value = 0;
      env.gain.setValueAtTime(0, audioTime);
      env.gain.linearRampToValueAtTime(1, audioTime + overlapStart);
    }

    src.start(audioTime, offset);

    this._chunkSrc = { src, env };
  }

  _halt(audioTime) {
    if (this._chunkSrc) {
      const { src, env } = this._chunkSrc;
      src.stop(audioTime);

      this._chunkSrc = null;
    }
  }

  // transported interface
  // should be enough to start and stop the engine
  syncPosition(currentTime, position, speed) {
    this._currentPosition = position;

    // try to get `.audioTime` from master, if the master does not provide it
    // we consider that `currentTime` is the `audioTime` (aka waves-audio master)
    const audioTime = this.master.audioTime ? this.master.audioTime : currentTime;
    this._halt(audioTime);

    if (speed <= 0 || position > this.duration) {
      // stop requesting chunks
      this._stopMonitorPreload();
      return Infinity;
    } else {
      // define current chunkIndex
      let index = 0;
      this._chunkIndex = -1;

      while (this._chunkIndex === -1 && index < this.bufferInfos.length) {
        const chunk = this.bufferInfos[index];
        const start = chunk.start;
        const end = start + chunk.duration;

        if (position >= start && position < end) {
          this._chunkIndex = index;
        }

        index += 1;
      }

      console.warn('@todo - `syncPosition` handle position < 0');
      // @todo - handle position < 0
      // if (this._chunkIndex === -1) {}
      this._clearCache(this._chunkIndex);

      if (this._cache.has(this._chunkIndex)) {
        this._startMonitorPreload();
        // go to advancePosition loop
        return position;
      } else {
        const numPreloadedBuffers = 2;
        const promises = [];
        const chunkIndex = this._chunkIndex;

        for (let i = 0; i < numPreloadedBuffers; i++) {
          const index = chunkIndex + i;

          if (index < this.bufferInfos.length) {
            const chunk = this.bufferInfos[index];
            const promise = loadAudioBuffer(chunk.url);

            promise.then(buffer => {
              this._cache.set(index, buffer);
              return Promise.resolve(buffer);
            });

            promises.push(promise);
          }
        }

        Promise.all(promises).then(buffers => {
          this.resetPosition();
          this._startMonitorPreload();
        });
      }
    }

    return position;
  }

  advancePosition(currentTime, position, speed) {
    this._currentPosition = position;
    // try to get `.audioTime` from master, if the master does not provide it
    // we consider that `currentTime` is the `audioTime` (aka waves-audio master)
    const audioTime = this.master.audioTime ? this.master.audioTime : currentTime;

    this._trigger(audioTime, position, speed);
    // remove buffer from cache
    this._cache.delete(this._chunkIndex);
    // define what should happen next
    this._chunkIndex += 1;

    if (this._chunkIndex >= this.bufferInfos.length) {
      this._chunkIndex = -1;
      this._stopMonitorPreload();

      return Infinity;
    } else {
      const nextChunk = this.bufferInfos[this._chunkIndex];
      const nextPosition = nextChunk.start;

      return nextPosition;
    }
  }
}

serviceManager.register(SERVICE_ID, AudioStreamManager);
export default AudioStreamManager;
