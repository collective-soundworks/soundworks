import client from './client';
import Module from './Module';

/**
 * [client] Retrieve a list of files on the server in the `/public` folder.
 *
 * The module can filter the file list by extensions. It never has a view.
 *
 * The module finishes its initialization when it receives the file list from the server.
 *
 * @example // Retrieve the mp3 file list in the folder `/recordings`
 * const filelist = new Filelist({
 *   folder: '/recordings',
 *   extensions: ['.mp3']
 * });
 */
export default class Filelist extends Module {
  /**
   * @param {Object} [options={}] Options.
   * @param {Object} [options.name='filelist'] Name of the module.
   * @param {String} [options.folder=''] Subfolder of `/public` in which to retrieve the file list.
   * @param {String[]} [options.extentions=undefined] Extensions of the files to retrieve.
   */
  constructor(options = {}) {
    super(options.name || 'filelist', false);

    /**
     * Array of file paths sent by the server.
     * @type {String[]}
     */
    this.files = null;

    this._folder = options.folder || '';
    this._extensions = options.extensions || undefined;
  }

  /**
   * Starts the module.
   * Sends a request to the server and listens for the answer.
   * @emits {this.name + ':files'} The file path list when it is received from the server.
   */
  start() {
    super.start();

    client.send(this.name + ':request', this._folder, this._extensions);

    client.receive(this.name + ':files', (files) => {
      this.files = files;
      this.emit(this.name + ':files', files);
      this.done();
    }, this);
  }
}
