import ClientModule from './ClientModule';


/**
 * [client] Retrieve a list of files on the server in the `/public` folder upon request of the client.
 *
 * The module can filter the file list by extensions. It never has a view.
 *
 * The module finishes its initialization when it receives the file list from the server.
 *
 * (See also {@link src/server/ServerFileList.js~ServerFileList} on the server side.)
 *
 * @example // Retrieve the mp3 file list in the folder `/recordings`
 * const filelist = new ClientFileList({
 *   folder: '/recordings',
 *   extensions: ['.mp3']
 * });
 */
export default class ClientFileList extends ClientModule {
  /**
   * @param {Object} [options={}] Options.
   * @param {Object} [options.name='filelist'] Name of the module.
   * @param {String} [options.folder=''] Subfolder of `/public` in which to retrieve the file list.
   * @param {String[]} [options.extentions=undefined] Extensions of the files to retrieve.
   */
  constructor(options = {}) {
    super(options.name || 'filelist', false);

    this.options = Object.assign({
      folder: '',
      extensions: undefined,
    }, options)

    /**
     * Array of file paths sent by the server.
     * @type {String[]}
     */
    this.files = null; // @todo - make sure this doesn't need to be reinit.

    this._onFileResponse = this._onFileResponse.bind(this);
  }

  /** @private */
  start() {
    super.start();

    this.send('request', this.options.folder, this.options.extensions);
    this.receive('files', this._onFileResponse);
  }

  /** @private */
  stop() {
    super.stop();
    this.removeListener('files', this._onFileResponse);
  }

  _onFileResponse(files) {
    this.files = files;
    // this.emit('files', files); // @todo - remove ?
    this.done();
  }
}
