import Service from '../core/Service';
import serviceManager from '../core/serviceManager';
import fse from 'fs-extra';
import klaw from 'klaw';
import _path from 'path';

const SERVICE_ID = 'service:file-system';
const cwd = process.cwd();
const isString = (value) => (typeof value === 'string' || value instanceof String);


/**
 * Interface for the server `'file-system'` service.
 *
 * This service allow to retrieve a list of files or directories from a given path.
 *
 * __*The service must be used with its [server-side counterpart]{@link module:soundworks/server.FileSystem}*__
 *
 * @memberof module:soundworks/server
 * @example
 * this.fileSystem = this.require('file-system');
 */
class FileSystem extends Service {
  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  constructor() {
    super(SERVICE_ID);

    const defaults = {
      configItem: 'publicDirectory',
      enableCache: true,
    };

    this.configure(defaults);

    this._cache = []; // keep results in cache to avoid too much I/O calls
    this._sharedConfig = this.require('shared-config');
  }

  start() {
    super.start();

    const configItem = this.options.configItem;
    this._publicDir = this._sharedConfig.get(configItem);

    if (!this._publicDir)
      throw new Error(`"${SERVICE_ID}": server.config.${configItem} is not defined`);

    this._enableCache = !!this.options.enableCache;

    this.ready();
  }

  connect(client) {
    this.receive(client, 'request', this._onRequest(client));
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
   * Return a list of files according to the given configuration.
   *
   * @param {String|module:soundworks/server.FileSystem~ListConfig|Array<String>|Array<module:soundworks/server.FileSystem~ListConfig>} config -
   *  Details of the requested file list(s).
   * @return {Promise<Array>|Promise<Array<Array>>} - Promise resolving with an
   *  an array containing the absolute paths of the files / directories.
   *  If `config` is an array, the results will be an array of arrays
   *  containing the result of each different request.
   *
   * @example:
   * // 1. Single list
   * // retrieve all the file in a folder
   * fileSystem.getList('my-directory').then((files) => ... );
   * // or, retrieve all the `.wav` files inside a given folder, search recursively
   * fileSystem.getList({
   *   path: 'my-directory',
   *   match: /\.wav/,
   *   recursive: true,
   * }).then((files) => ... );
   *
   * // 2. Multiple Requests
   * // retrieve all the file in 2 different folders, the returned value will be
   * // an array containing the 2 file lists
   * fileSystem.getList(['my-directory1', 'my-directory2'])
   *   .then((arrayList) => ... );
   * // or
   * fileSystem.getList([{ ... }, { ... }])
   *   .then((arrayList) => ... );
   */
  getList(config) {
    let returnAll = true;

    if (!Array.isArray(config)) {
      config = [config];
      returnAll = false;
    }

    const stack = config.map((item) => {
      if (isString(item))
        item = { path: item };

      const { path, match, recursive, directories } = item;
      return this._getList(path, match, recursive, directories);
    });

    if (returnAll === false)
      return stack[0]; // a single promise
    else
      return Promise.all(stack);
  }

  /**
   * Return a list of files inside a given directory.
   *
   * @param {String} path - The directory to search into.
   * @param {RegExp} [match='*'] - A RegExp to filter the results (the
   *  wildcard '*' is accepted).
   * @param {Boolean} [recursive=false] - Define if the search should be
   *  recursive or not
   * @param {Boolean} [directories=false] - Define if the result should contain
   *  a list of files or a list of directories.
   * @return {Array}
   * @private
   */
  _getList(path = null, match = '*', recursive = false, directories = false) {
    if (path === null)
      throw new Error(`${SERVICE_ID} - path not defined`);

    // wilcard
    if (match === '*')
      match = /.*/;

    const key = `${path}:${match}:${recursive}:${directories}`;

    if (this._enableCache && this._cache[key])
      return Promise.resolve(this._cache[key]);

    const testCwd = new RegExp(`^${cwd}`);
    let dir = _path.normalize(path);
    let results = [];

    // make the given path absolute if not
    if (!testCwd.test(dir))
      dir = _path.join(cwd, dir);

    console.log(dir);
    const promise = new Promise((resolve, reject) => {
      klaw(dir)
        .on('data', (item) => {
          const basename = _path.basename(item.path);
          const dirname = _path.dirname(item.path);

          if (
            // ignore current directory
            item.path === dir || 
            // ignore common hidden system file patterns
            basename === 'thumbs.db' ||
            /^\./.test(basename) === true
          ) {
            return;
          }

          if (
            (directories && item.stats.isDirectory()) || 
            (!directories && item.stats.isFile())
          ) {
            if (recursive || (!recursive && dirname === dir))
              results.push(item.path);
          }
        }).on('end', () => {
          // remove `dir` the paths and test against the regExp
          results = results.filter((entry) => {
            entry = entry.replace(_path.join(dir, _path.sep), '');
            return match.test(entry);
          });

          // keep in cache and resolve promise
          if (this._enableCache)
            this._cache[key] = results;

          resolve(results);
        }).on('error', function(err) {
          console.error(SERVICE_ID, '-', err.message);
        });
    });

    return promise;
  }

  _onRequest(client) {
    return (id, config) => {
      // unserialize the json config to return proper RegExp, adapted from:
      // http://stackoverflow.com/questions/12075927/serialization-of-regexp#answer-33416684
      config = JSON.parse(config, function(key, value) {
        if (key === 'match' && value.toString().indexOf('__REGEXP ') === 0) {
          const fragments = value.split('__REGEXP ')[1].match(/\/(.*?)\/([gimy])?$/);
          const pattern = fragments[1].replace('\\\\', '\\');
          const flag = fragments[2] || '';
          return new RegExp(pattern, flag);
        } else {
          return value;
        }
      });

      const testCwd = new RegExp(`^${cwd}`);
      let publicDir = this._publicDir;

      if (!testCwd.test(publicDir))
        publicDir = _path.join(cwd, publicDir);

      // force the search in the public directory
      function prependPath(item) {
        if (Array.isArray(item))
          return item.map(prependPath);

        if (isString(item))
          item = _path.join(publicDir, item);
        else
          item.path = _path.join(publicDir, item.path);

        return item;
      }

      config = prependPath(config);

      // get results
      this.getList(config)
        .then((results) => {
          function formatToUrl(entry) {
            if (Array.isArray(entry))
              return entry.map(formatToUrl);

            entry = entry.replace(publicDir, '');
            entry = entry.replace('\\', '/'); // window paths to url

            if (!/^\//.test(entry))
              entry = '/' + entry;

            return entry;
          }

          // remove all file system informations and create an absolute url
          results = formatToUrl(results);

          this.send(client, `list:${id}`, results);
        })
        .catch((err) => console.error(err.stack));
    };
  }
}

serviceManager.register(SERVICE_ID, FileSystem);

export default FileSystem;
