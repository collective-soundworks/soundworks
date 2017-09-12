const Slicer = require('node-audio-slicer').Slicer;
import Service from '../core/Service';
import { getOpt } from '../../utils/helpers';
import serviceManager from '../core/serviceManager';

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
 * @example
 * // Require and configure `audio-stream-manager` service (inside experience constructor).
 * // define list of "streamable" audio files
 * let audioFiles = [
 *   './public/stream/my-audio-file.wav',
 *   './public/stream/another-audio-file.wav',
 * ];
 * // require service
 * this.audioStreamManager = this.require('audio-stream-manager', {audioFiles: audioFiles});
 */

class AudioStreamManager extends Service {
  /** _<span class="warning">__WARNING__</span> This class should never be instantiated manually_ */
  constructor() {
    super(SERVICE_ID);

    // services
    this._sync = this.require('sync');

    // config
    const defaults = {
      audioFiles: '',
      compress: true,
      duration: 4,
      overlap: 0.1
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

    // skip chunk creation if no audio file defined in input list
    if (this.options.audioFiles === '') { 
      this.ready();
      return;
    }

    this.prepareStreamChunks(this.options.audioFiles, (bufferInfos) => {
      this.bufferInfos = bufferInfos;
      this.ready();
    });
  }

  /** @private */
  connect(client) {
    this.receive(client, 'request', this._onRequest(client));
  }

  /** @private */
  _onRequest(client) {
    return () => this.send(client, 'acknowlegde', this.bufferInfos);
  }

  /*
   * Segment audio files listed into audioFiles into chunks for streaming.
   * @param {Array<String>} audioFiles - list of paths towards audio files to chunk.
   * @param {Object} callback - Function to call when slicing completed.
   */
  prepareStreamChunks(audioFiles, callback) {
    // output array
    let bufferInfos = [];

    // init slicer
    let slicer = new Slicer({
      compress: this.options.compress,
      duration: this.options.duration,
      overlap: this.options.overlap
    });

    // loop over input audio files
    audioFiles.forEach((item, id) => {
      // slice current audio file
      slicer.slice(item, (chunkList) => {
        // feed local array
        bufferInfos.push(chunkList);
        // return local map when all file processed
        if (bufferInfos.length >= audioFiles.length) {
          callback(bufferInfos);
        }
      });
    });
  }

}

serviceManager.register(SERVICE_ID, AudioStreamManager);

export default AudioStreamManager;
