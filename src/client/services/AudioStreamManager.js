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
    request.open('GET', `${url}?id=${Math.random()}`, true);
    request.responseType = 'arraybuffer';

    request.onload = () => {
      const response = request.response;
      audioContext.decodeAudioData(response, buffer => {
        resolve(buffer);
      }, (err) => {
        reject();
      });
    }

    request.send();
  });

  return promise;
}


/**
 * bufferInfo description
 *
 * |                            start
 *  <------------------->       duration
 *  <->                         overlapStart
 *                       <->    overlapEnd
 */

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
    if (!this.bufferInfosList.has(id)) {
      throw new Error(`Undefined stream id: ${id}`)
    }

    const engine = new StreamEngine({
      bufferInfos: this.bufferInfosList.get(id),
      preloadedBuffers: this._preloadCache.get(id),
      monitorInterval: this.options.monitorInterval,
      requiredAdvanceThreshold: this.options.requiredAdvanceThreshold,
    });

    // only use that when the stream is created for the first time
    this._preloadCache.delete(id);

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
    // @todo - if one of these buffer has been corrupted by an envelop
    if (options.preloadedBuffers) {
      this._addToCache(0, options.preloadedBuffers[0]);
      this._addToCache(1, options.preloadedBuffers[1]);
    }

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

    if (target === null) {
      this._cache.clear();
    }
  }

  get duration() {
    const bufferInfos = this.bufferInfos;
    const lastChunk = bufferInfos[bufferInfos.length - 1];
    const duration = lastChunk.start + lastChunk.duration;
    return duration;
  }

  _startMonitorPreload() {
    if (this._monitorPreloadTimeoutId === null) {
      this._monitorPreload();
    }
  }

  _stopMonitorPreload() {
    clearTimeout(this._monitorPreloadTimeoutId);
    this._monitorPreloadTimeoutId = null;
  }

  _addToCache(index, buffer) {
    this._cache.set(index, { buffer });
  }
  // monitor preload in `setInterval`
  _monitorPreload() {
    // @note - should not happen but be defensive
    if (this._chunkIndex === -1) {
      this._monitorPreloadTimeoutId = null;
      return;
    }

    const advanceThreshold = this._currentPosition + this.requiredAdvanceThreshold;
    let index = this._chunkIndex;

    while (index < this.bufferInfos.length &&
      this.bufferInfos[index].start <= advanceThreshold) {

      if (!this._cache.has(index)) {
        const chunkIndex = index; // copy locally into block to avoid closure
        const startTime = this.bufferInfos[chunkIndex].start;
        const url = this.bufferInfos[chunkIndex].url;

        loadAudioBuffer(url).then(buffer => {
          this._addToCache(chunkIndex, buffer);
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

    while (
      index < this.bufferInfos.length &&
      this.bufferInfos[index].start <= advanceThreshold
    ) {
      indexesToKeep.push(index);
      index += 1;
    }

    for (let [key, value] of this._cache) {
      if (indexesToKeep.indexOf(key) === -1) {
        this._cache.delete(key);
      }
    }
  }

  _trigger(audioTime, position, speed) {
    const { start, duration, overlapStart, overlapEnd } = this.bufferInfos[this._chunkIndex];
    const offset = position - start;
    const cached = this._cache.get(this._chunkIndex);
    let buffer = null;

    try {
      buffer = cached.buffer;
    } catch(err) {
      console.error(err.stack);
      console.log('Undefined buffer at this._chunkIndex', this._chunkIndex);
      return;
    }

    // once triggered, the buffer is always removed from cache
    // so we don't need to worry about corruuting it the buffer
    const fadeInStartPosition = offset;
    const fadeInDuration = offset > 0 ? 0.005 : overlapStart;
    const fadeOutStartPosition = Math.max(duration, fadeInStartPosition + fadeInDuration);
    const fadeOutDuration = Math.min(overlapEnd, duration + overlapEnd - fadeOutStartPosition);

    const fadeInStartSample = Math.floor(fadeInStartPosition * buffer.sampleRate);
    const fadeInNumSamples = Math.floor(fadeInDuration * buffer.sampleRate);
    const fadeOutStartSample = Math.floor(fadeOutStartPosition * buffer.sampleRate);
    const fadeOutNumSamples = Math.floor(fadeOutDuration * buffer.sampleRate);

    for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
      const channelData = buffer.getChannelData(channel);
      // fade in
      for (let i = 0; i < fadeInNumSamples; i++) {
        const index = i + fadeInStartSample;
        channelData[index] *= i / fadeInNumSamples;
      }

      // fade out
      for (let i = 0; i < fadeOutNumSamples; i++) {
        const index = fadeOutStartSample + fadeOutNumSamples - i; // go backward
        channelData[index] *= i / fadeOutNumSamples;
      }
    }

    const src = audioContext.createBufferSource();
    src.buffer = buffer;
    src.connect(this.outputNode);
    src.start(audioTime, offset);

    this._chunkSrc = src;
  }

  _halt(audioTime) {
    if (this._chunkSrc) {
      // const { src, env } = this._chunkSrc;
      const src = this._chunkSrc;
      // @todo - check
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
    const audioTime = this.master.audioTime;

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

      // @note - negative positions are already handled by the transport and playControl

      // clear files that won't be needed anymore from the cache
      this._clearCache(this._chunkIndex);

      if (this._cache.has(this._chunkIndex)) {
        // defer preloading to leave engine a bit alone with its own problems...
        setTimeout(() => this._startMonitorPreload(), 500);
        return position;

      } else {
        const promises = [];
        const indexes = [];
        const chunkIndex = this._chunkIndex;

        for (let i = 0; i < NUM_PRELOADED_CHUNKS; i++) {
          const index = chunkIndex + i;

          if (index < this.bufferInfos.length && !this._cache.has(index)) {
            indexes.push(index);
            const chunk = this.bufferInfos[index];
            const promise = loadAudioBuffer(chunk.url);

            promise.then(buffer => {
              this._addToCache(index, buffer);
              return Promise.resolve(buffer);
            });

            promises.push(promise);
          }
        }

        Promise.all(promises).then(buffers => {
          this.resetPosition();
        });

        return Infinity;
      }
    }
  }

  advancePosition(currentTime, position, speed) {
    // remove previous buffer from cache
    this._cache.delete(this._chunkIndex - 1);

    this._currentPosition = position;
    const audioTime = this.master.audioTime;
    // trigger new chunk
    this._trigger(audioTime, position, speed);

    this._chunkIndex += 1;

    if (this._chunkIndex >= this.bufferInfos.length) {
      this._stopMonitorPreload();
      // monitor preload relies on a valid chunk index
      this._chunkIndex = -1;

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
