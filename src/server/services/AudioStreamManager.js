import path from 'path';
import fs from 'fs';
import Service from '../core/Service';
import serviceManager from '../core/serviceManager';
import Slicer from '../utils/Slicer';
import cache from '../utils/cache';

const SERVICE_ID = 'service:audio-stream-manager';

/**
 * Interface for the server `'audio-stream-manager'` service.
 *
 * This service allows to stream audio buffers to the client during the experience
 * (not preloaded). Input audio files are segmented by the server upon startup and
 * sent to the clients upon request. Service only accepts .wav files at the moment.
 * Service main objective is to 1) enable synced streaming between clients (not precise
 * if based on mediaElementSources), and 2) provide an equivalent to the mediaElementSource
 * object (streaming as a Web Audio API node) that could be plugged to any other node in Safari
 * (bypassing e.g. gain or analyzer nodes when plugged to mediaElementSource).
 *
 * __*The service should be used with its [client-side counterpart]{@link module:soundworks/client.AudioStreamManager}*__
 *
 * @param {Object} options
 * @param {Array<String>} options.audioFiles - list of paths towards would-be-streamable audio files.
 * @param {Bool} options.compress - Generate .mp3 stream chunks if set to true. Keep input file extension otherwise.
 * @param {Number} options.duration - Audio chunks duration (in sec).
 * @param {Number} options.overlap - Duration of additional audio samples added to head and tail of streamed audio
 *  buffers. Paired with a fade-in fade-out mechanism on client's side, this allows to hide distortions induced by
 *  mp3 encoding of audio chunks not starting / finishing with zeroed samples.
 *
 * @memberof module:soundworks/server
 *
 * @example
 * // define list of "streamable" audio files
 * const audioFiles = [
 *   'stream/my-audio-file.wav',
 *   'stream/another-audio-file.wav',
 * ];
 *
 * // require service
 * this.audioStreamManager = this.require('audio-stream-manager', { audioFiles });
 *
 */
class AudioStreamManager extends Service {
  /** _<span class="warning">__WARNING__</span> This class should never be instantiated manually_ */
  constructor() {
    super(SERVICE_ID);

    const defaults = {
      audioFiles: null,
      compress: true,
      duration: 4,
      overlap: 0.1,
      publicDirectory: 'public',
    };

    this.configure(defaults);
  }

  /** @private */
  configure(options) {
    super.configure(options);
  }

  /** @private */
  start() {
    super.start();

    if (this.options.audioFiles === null) { 
      this.ready();
    } else {
      const { audioFiles, publicDirectory } = this.options;

      this.prepareStreamChunks(audioFiles, publicDirectory, bufferInfos => {
        this.bufferInfos = bufferInfos;
        this.ready();
      });
    }
  }

  /** @private */
  connect(client) {
    this.receive(client, 'request', this._onRequest(client));
  }

  /** @private */
  _onRequest(client) {
    return () => this.send(client, 'acknowlegde', this.bufferInfos);
  }

  /**
   * Segment audio files listed into audioFiles into chunks for streaming.
   *
   * @param {Array<String>} audioFiles - list of paths towards audio files to chunk.
   * @param {Object} callback - Function to call when slicing completed.
   */
  prepareStreamChunks(audioFiles, publicDirectory, callback) {
    const streamIds = Object.keys(audioFiles);
    const numFiles = streamIds.length;
    const bufferInfos = {};
    // try avoid hardcore parallel processing that crashes the server
    // (ulimit issue) when lots of audioFiles to process
    let index = 0;

    const slicer = new Slicer({
      compress: this.options.compress,
      duration: this.options.duration,
      overlap: this.options.overlap
    });

    function next() {
      index += 1;

      if (index >= numFiles)
        callback(bufferInfos);
      else
        processFile();
    }

    function processFile() {
      const streamId = streamIds[index];
      // const fileId = ;
      const filename = path.join(publicDirectory, audioFiles[streamId]);

      const cachedItem = cache.read(SERVICE_ID, streamId);
      const stats = fs.statSync(filename);
      const lastModified = stats.mtimeMs;

      if (cachedItem && lastModified === cachedItem.lastModified) {
        bufferInfos[streamId] = cachedItem.chunks;
        return next();
      }

      slicer.slice(filename, chunkList => {
        const chunks = chunkList.map(chunk => {
          chunk.name = path.relative(publicDirectory, chunk.name);
          return chunk;
        });

        console.log(`[${SERVICE_ID}]`, 'processed stream:', `"${streamId}"`, `(${chunks.length} chunks)`);
        bufferInfos[streamId] = chunks;
        // cache informations
        cache.write(SERVICE_ID, streamId, { lastModified, chunks })

        next();
      });
    }

    processFile();
  }

}

serviceManager.register(SERVICE_ID, AudioStreamManager);

export default AudioStreamManager;
