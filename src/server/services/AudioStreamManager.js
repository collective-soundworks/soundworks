import path from 'path';
import Service from '../core/Service';
import serviceManager from '../core/serviceManager';
import { Slicer } from 'node-audio-slicer';

const SERVICE_ID = 'service:audio-stream-manager';

/**
 * Interface for the server `'audio-stream-manager'` service.
 *
 * @warning - unstable
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
 * @example
 * // define list of "streamable" audio files
 * let audioFiles = [
 *   './public/stream/my-audio-file.wav',
 *   './public/stream/another-audio-file.wav',
 * ];
 *
 * // require service
 * this.audioStreamManager = this.require('audio-stream-manager', { audioFiles });
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

    this._sync = this.require('sync');

    this._clients = new Set();
  }

  /**
   * Set common (sync) start time for AudioStream in sync mode.
   * The value is propagated to every connected clients and newly connected
   * clients.
   */
  set syncStartTime(time) {
    this._syncStartTime = time;

    this._clients.forEach(client => {
      this.send(client, 'syncStartTime', this._syncStartTime);
    });
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
    this._clients.add(client);
    this.receive(client, 'request', this._onRequest(client));
  }

  disconnect(client) {
    this._clients.delete(client);
  }

  /** @private */
  _onRequest(client) {
    return () => {
      this.send(client, 'acknowlegde', this.bufferInfos);

      // has already started in sync mode
      if (this._syncStartTime !== null)
        this.send(client, 'syncStartTime', this._syncStartTime);
    }
  }

  /**
   * Segment audio files listed into audioFiles into chunks for streaming.
   *
   * @param {Array<String>} audioFiles - list of paths towards audio files to chunk.
   * @param {Object} callback - Function to call when slicing completed.
   */
  prepareStreamChunks(audioFiles, publicDirectory, callback) {
    const bufferInfos = [];

    const slicer = new Slicer({
      compress: this.options.compress,
      duration: this.options.duration,
      overlap: this.options.overlap
    });

    // try avoid hardcore parallel processing that crashes the server
    // (ulimit issue) when lots of audioFiles to process
    let index = 0;

    function sliceNext() {
      const item = path.join(publicDirectory, audioFiles[index]);
      const prefixRegExp = new RegExp(`^${publicDirectory}`);

      slicer.slice(item, chunkList => {
        const chunks = chunkList.map(chunk => {
          chunk.name = chunk.name.replace(prefixRegExp, '');
          return chunk;
        });

        bufferInfos.push(chunks);

        index += 1;

        if (index >= audioFiles.length)
          callback(bufferInfos);
        else
          sliceNext();
      });
    }

    sliceNext();
  }

}

serviceManager.register(SERVICE_ID, AudioStreamManager);

export default AudioStreamManager;
