import Service from '../core/Service';
import serviceManager from '../core/serviceManager';

const SERVICE_ID = 'service:file-system';
const isString = (value) => (typeof value === 'string' || value instanceof String);


/**
 * Interface for the client `'file-system'` service.
 *
 * This service allow to retrieve a list of file or directories from a given path.
 *
 * __*The service must be used with its [client-side counterpart]{@link module:soundworks/client.FileSystem}*__
 *
 * @memberof module:soundworks/client
 * @example
 * this.fileSystem = this.require('file-system', { list: 'audio' });
 */
class FileSystem extends Service {
  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  constructor() {
    super(SERVICE_ID, true);

    const defaults = { list: null };
    this.configure(defaults);

    this._cache = {};
    // as file system is async (server side), nothing guarantees response order
    this._requestId = 0;
  }

  init() {
    if (this.options.list !== null)
      this.getList(this.options.list);
    else
      this.ready();
  }

  start() {
    super.start();

    if (!this.hasStarted)
      this.init();
  }

  stop() {
    super.stop();
  }

  /**
   * @typedef {Object} module:soundworks/server.FileSystem~ListConfig
   * @property {String} path - Name of the folder to search into.
   * @property {RegExp} [match='*'] - RegExp used to filter the results.
   * @property {Boolean} [recursive=false] - Define if the search should be
   *  recursive.
   * @property {Boolean} [directories=false] - If true only return directories,
   *  files otherwise.
   */
  /**
   * Return a list of file according to the given configuration.
   *
   * @param {String|module:soundworks/server.FileSystem~ListConfig|Array<String>|Array<module:soundworks/server.FileSystem~ListConfig>} config -
   *  Details of the requested list(s). The requested files / directories must
   *  be publicly accessible.
   * @return {Promise<Array>|Promise<Array<Array>>} - Promise resolving with an
   *  an array containing the absolute urls of the files / directories.
   *  If `config` is an array, the results will be an array of arrays
   *  containing the result of each different request.
   *
   * @example:
   * // 1. Single list
   * // retrieve all the file in a folder
   * fileSystem.getList('my-directory').then((list) => ... );
   * // or, retrieve all the `.wav` files inside a given folder,
   * //search recursively
   * fileSystem.getList({
   *   path: 'my-directory',
   *   match: /\.wav/,
   *   recursive: true,
   * }).then((list) => ... );
   *
   * // 2. Multiple Requests
   * // retrieve all the file in 2 different folders, the returned value will be
   * // an array containing the 2 lists
   * fileSystem.getList(['my-directory1', 'my-directory2'])
   *   .then((lists) => ... );
   * // or
   * fileSystem.getList([{ ... }, { ... }])
   *   .then((lists) => ... );
   */
  getList(config) {
    // serialize the json config to properly handle RegExp, adapted from:
    // http://stackoverflow.com/questions/12075927/serialization-of-regexp#answer-33416684
    const _config = JSON.stringify(config, function(key, value) {
      if (value instanceof RegExp)
        return `__REGEXP ${value.toString()}`;
      else
        return value;
    });

    const key = isString(config) ? config : _config;

    if (this._cache[key])
      return this._cache[key];

    const promise = new Promise((resolve, reject) => {
      const id = this._requestId;
      const channel = `list:${id}`;
      this._requestId += 1;

      this.receive(channel, (results) => {
        // @note - socket.io remove the first listener if no func argument given
        //         should be done properly -> update socket and Activity
        this.removeListener(channel);
        resolve(results);

        if (this.options.list !== null && channel === 'list:0')
          this.ready();
      });

      this.send('request', id, _config);

      this._requestId += 1;
    });

    this._cache[key] = promise;
    return promise;
  }
}

serviceManager.register(SERVICE_ID, FileSystem);

export default FileSystem;
