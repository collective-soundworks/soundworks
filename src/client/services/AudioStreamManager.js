import { AudioTimeEngine, audioContext } from 'waves-audio';
import debug from 'debug';
import urljoin from 'url-join';
import Service from '../core/Service';
import serviceManager from '../core/serviceManager';

const SERVICE_ID = 'service:audio-stream-manager';
const log = debug('soundworks:services:audio-stream-manager');

/**
 * number of chunks preloaded by the service for each stream
 * before getting `ready`
 */
const NUM_PRELOADED_CHUNKS = 2;

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
 */

class AudioStreamManager extends Service {
  /** _<span class="warning">__WARNING__</span> This class should never be instantiated manually_ */
  constructor() {
    super(SERVICE_ID, false);

    this.bufferInfosList = new Map();

    // configure options
    const defaults = {
      monitorInterval: 1, // in seconds
      requiredAdvanceThreshold: 10, // in seconds
      assetsDomain: '',
    };

    this.configure(defaults);
    this._preloadCache = new Map();

    this._onAcknowledgeResponse = this._onAcknowledgeResponse.bind(this);
  }

  get streamIds() {
    return Array.from(this.bufferInfosList.keys());
  }

  /** @private */
  start() {
    super.start();

    this.receive('acknowlegde', this._onAcknowledgeResponse);
    this.send('request');
  }

  /**
   * @private
   * @param {Object} bufferInfos - info on audio files that can be streamed
   */
  _onAcknowledgeResponse(bufferInfosList) {
    const preloadPromises = [];

    for (let id in bufferInfosList) {
      const bufferInfos = bufferInfosList[id];

      bufferInfos.forEach(chunk => {
        chunk.url = urljoin(this.options.assetsDomain, chunk.name);
      });

      // preload the NUM_PRELOADED_CHUNKS first chunk for each streams
      // before ready
      const cache = [];
      this._preloadCache.set(id, cache);

      for (let i = 0; i < Math.min(NUM_PRELOADED_CHUNKS, bufferInfos.length); i++) {
        const index = i;
        const url = bufferInfos[i].url;

        const promise = loadAudioBuffer(url).then(buffer => {
          cache[index] = buffer;
          Promise.resolve(buffer);
        });

        preloadPromises.push(promise);
      }

      this.bufferInfosList.set(id, bufferInfos);
    }

    Promise.all(preloadPromises).then(() => this.ready());
  }

  getStreamEngine(id) {
    if (!this.bufferInfosList.has(id))
      throw new Error(`Undefined stream id: ${id}`)

    const engine = new StreamEngine({
      bufferInfos: this.bufferInfosList.get(id),
      preloadedBuffers: this._preloadCache.get(id),
      monitorInterval: this.options.monitorInterval,
      requiredAdvanceThreshold: this.options.requiredAdvanceThreshold,
    });

    return engine;
  }
}

/**
 * Stream engine to consume in waves-audio masters, or masters provided by soundworks
 * Implement the transported interface
 */
class StreamEngine extends AudioTimeEngine {
  constructor(options) {
    super();

    this.outputNode = audioContext.createGain();

    this.bufferInfos = options.bufferInfos;
    this._monitorInterval = options.monitorInterval * 1000; // in ms

    this._cache = new Map();
    this._cache.set(0, options.preloadedBuffers[0]);
    this._cache.set(1, options.preloadedBuffers[1]);

    const requiredAdvanceThreshold = options.requiredAdvanceThreshold;
    const buffersDuration = this.bufferInfos[0].duration;
    const minAdvanceChunks = 3;
    this.requiredAdvanceThreshold = Math.max(requiredAdvanceThreshold, buffersDuration * minAdvanceChunks);

    this._chunkIndex = -1;
    this._currentPosition = 0;
    this._monitorPreloadTimeoutId = null;

    this._chunkSrc = null;

    this._monitorPreload = this._monitorPreload.bind(this);
  }

  disconnect(target = null) {
    super.disconnect(target);

    if (target === null)
      this._cache.clear();
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

  // @notes / @todos
  // - `playControl.pause` does not trigger this method, define if its a
  // problem in waves-masters or a bad implementation/approach here
  // - not called neither when the engine is removed from the
  // transport
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

      // @note - position < 0 seems to be already handled by the play control or the transport

      // clear files that won't be needed anymore from the cache
      this._clearCache(this._chunkIndex);

      if (this._cache.has(this._chunkIndex)) {
        this._startMonitorPreload();
        return position;
      } else {
        const promises = [];
        const chunkIndex = this._chunkIndex;

        for (let i = 0; i < NUM_PRELOADED_CHUNKS; i++) {
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
