import Service from '../core/Service';
import serviceManager from '../core/serviceManager';

const SERVICE_ID = 'service:audio-buffer-manager';

/**
 * Interface for the server `'audio-buffer-manager'` service.
 *
 * @memberof module:soundworks/server
 * @example
 * // inside the experience constructor
 * this.audioBufferManager = this.require('audio-buffer-manager');
 */
class AudioBufferManager extends Service {
  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  constructor() {
    super(SERVICE_ID);

    this._fileSystem = this.require('file-system');
  }

  start() {
    super.start();

    this.ready();
  }
}

serviceManager.register(SERVICE_ID, AudioBufferManager);

export default AudioBufferManager;
