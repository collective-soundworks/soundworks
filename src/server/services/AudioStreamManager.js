const Slicer = require('node-audio-slicer').Slicer;
import Service from '../core/Service';
import { getOpt } from '../../utils/helpers';
import serviceManager from '../core/serviceManager';

const SERVICE_ID = 'service:audio-stream-manager';

/**
 * Interface for the server `'audio-stream-manager'` service.
 *
 * @memberof module:soundworks/server
 * @example
 * // inside the experience constructor
 * this.audioStreamManager = this.require('audio-stream-manager');
 */
class AudioStreamManager extends Service {
  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  constructor() {
    super(SERVICE_ID);

    // services
    this._sync = this.require('sync');

    // config
    const defaults = {
      audioFiles: '',
      compress: true,
      duration: 4,
      oveerlap: 0.1
    };
    this.configure(defaults);
  }

  /** @private */
  configure(options) {
    super.configure(options);
  }

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

  connect(client) {
    this.receive(client, 'request', this._onRequest(client));
  }

  /** @private */
  _onRequest(client) {
    return () => { this.send(client, 'acknowlegde', this.bufferInfos); };
  }

  /*
   * prepare chunks of files for streaming
   * args: audioFiles: array of audio files to chunk
   * callback: method launched when slicing over
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