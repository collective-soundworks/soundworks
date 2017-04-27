'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _klaw = require('klaw');

var _klaw2 = _interopRequireDefault(_klaw);

var _path2 = require('path');

var _path3 = _interopRequireDefault(_path2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:file-system';
var cwd = process.cwd();
var isString = function isString(value) {
  return typeof value === 'string' || value instanceof String;
};

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

var FileSystem = function (_Service) {
  (0, _inherits3.default)(FileSystem, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  function FileSystem() {
    (0, _classCallCheck3.default)(this, FileSystem);

    var _this = (0, _possibleConstructorReturn3.default)(this, (FileSystem.__proto__ || (0, _getPrototypeOf2.default)(FileSystem)).call(this, SERVICE_ID));

    var defaults = {
      configItem: 'publicDirectory',
      enableCache: true
    };

    _this.configure(defaults);

    _this._cache = []; // keep results in cache to avoid too much I/O calls
    _this._sharedConfig = _this.require('shared-config');
    return _this;
  }

  (0, _createClass3.default)(FileSystem, [{
    key: 'start',
    value: function start() {
      (0, _get3.default)(FileSystem.prototype.__proto__ || (0, _getPrototypeOf2.default)(FileSystem.prototype), 'start', this).call(this);

      var configItem = this.options.configItem;
      this._publicDir = this._sharedConfig.get(configItem);

      if (!this._publicDir) throw new Error('"' + SERVICE_ID + '": server.config.' + configItem + ' is not defined');

      this._enableCache = !!this.options.enableCache;

      this.ready();
    }
  }, {
    key: 'connect',
    value: function connect(client) {
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

  }, {
    key: 'getList',
    value: function getList(config) {
      var _this2 = this;

      var returnAll = true;

      if (!Array.isArray(config)) {
        config = [config];
        returnAll = false;
      }

      var stack = config.map(function (item) {
        if (isString(item)) item = { path: item };

        var _item = item,
            path = _item.path,
            match = _item.match,
            recursive = _item.recursive,
            directories = _item.directories;

        return _this2._getList(path, match, recursive, directories);
      });

      if (returnAll === false) return stack[0]; // a single promise
      else return _promise2.default.all(stack);
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

  }, {
    key: '_getList',
    value: function _getList() {
      var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var match = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '*';

      var _this3 = this;

      var recursive = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var directories = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      if (path === null) throw new Error(SERVICE_ID + ' - path not defined');

      // wilcard
      if (match === '*') match = /.*/;

      var key = path + ':' + match + ':' + recursive + ':' + directories;

      if (this._enableCache && this._cache[key]) return _promise2.default.resolve(this._cache[key]);

      var testCwd = new RegExp('^' + cwd);
      var dir = _path3.default.normalize(path);
      var results = [];

      // make the given path absolute if not
      if (!testCwd.test(dir)) dir = _path3.default.join(cwd, dir);

      console.log(dir);
      var promise = new _promise2.default(function (resolve, reject) {
        (0, _klaw2.default)(dir).on('data', function (item) {
          var basename = _path3.default.basename(item.path);
          var dirname = _path3.default.dirname(item.path);

          if (
          // ignore current directory
          item.path === dir ||
          // ignore common hidden system file patterns
          basename === 'thumbs.db' || /^\./.test(basename) === true) {
            return;
          }

          if (directories && item.stats.isDirectory() || !directories && item.stats.isFile()) {
            if (recursive || !recursive && dirname === dir) results.push(item.path);
          }
        }).on('end', function () {
          // remove `dir` the paths and test against the regExp
          results = results.filter(function (entry) {
            entry = entry.replace(_path3.default.join(dir, _path3.default.sep), '');
            return match.test(entry);
          });

          // keep in cache and resolve promise
          if (_this3._enableCache) _this3._cache[key] = results;

          resolve(results);
        }).on('error', function (err) {
          console.error(SERVICE_ID, '-', err.message);
        });
      });

      return promise;
    }
  }, {
    key: '_onRequest',
    value: function _onRequest(client) {
      var _this4 = this;

      return function (id, config) {
        // unserialize the json config to return proper RegExp, adapted from:
        // http://stackoverflow.com/questions/12075927/serialization-of-regexp#answer-33416684
        config = JSON.parse(config, function (key, value) {
          if (key === 'match' && value.toString().indexOf('__REGEXP ') === 0) {
            var fragments = value.split('__REGEXP ')[1].match(/\/(.*?)\/([gimy])?$/);
            var pattern = fragments[1].replace('\\\\', '\\');
            var flag = fragments[2] || '';
            return new RegExp(pattern, flag);
          } else {
            return value;
          }
        });

        var testCwd = new RegExp('^' + cwd);
        var publicDir = _this4._publicDir;

        if (!testCwd.test(publicDir)) publicDir = _path3.default.join(cwd, publicDir);

        // force the search in the public directory
        function prependPath(item) {
          if (Array.isArray(item)) return item.map(prependPath);

          if (isString(item)) item = _path3.default.join(publicDir, item);else item.path = _path3.default.join(publicDir, item.path);

          return item;
        }

        config = prependPath(config);

        // get results
        _this4.getList(config).then(function (results) {
          function formatToUrl(entry) {
            if (Array.isArray(entry)) return entry.map(formatToUrl);

            entry = entry.replace(publicDir, '');
            entry = entry.replace('\\', '/'); // window paths to url

            if (!/^\//.test(entry)) entry = '/' + entry;

            return entry;
          }

          // remove all file system informations and create an absolute url
          results = formatToUrl(results);

          _this4.send(client, 'list:' + id, results);
        }).catch(function (err) {
          return console.error(err.stack);
        });
      };
    }
  }]);
  return FileSystem;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, FileSystem);

exports.default = FileSystem;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZpbGVTeXN0ZW0uanMiXSwibmFtZXMiOlsiU0VSVklDRV9JRCIsImN3ZCIsInByb2Nlc3MiLCJpc1N0cmluZyIsInZhbHVlIiwiU3RyaW5nIiwiRmlsZVN5c3RlbSIsImRlZmF1bHRzIiwiY29uZmlnSXRlbSIsImVuYWJsZUNhY2hlIiwiY29uZmlndXJlIiwiX2NhY2hlIiwiX3NoYXJlZENvbmZpZyIsInJlcXVpcmUiLCJvcHRpb25zIiwiX3B1YmxpY0RpciIsImdldCIsIkVycm9yIiwiX2VuYWJsZUNhY2hlIiwicmVhZHkiLCJjbGllbnQiLCJyZWNlaXZlIiwiX29uUmVxdWVzdCIsImNvbmZpZyIsInJldHVybkFsbCIsIkFycmF5IiwiaXNBcnJheSIsInN0YWNrIiwibWFwIiwiaXRlbSIsInBhdGgiLCJtYXRjaCIsInJlY3Vyc2l2ZSIsImRpcmVjdG9yaWVzIiwiX2dldExpc3QiLCJhbGwiLCJrZXkiLCJyZXNvbHZlIiwidGVzdEN3ZCIsIlJlZ0V4cCIsImRpciIsIm5vcm1hbGl6ZSIsInJlc3VsdHMiLCJ0ZXN0Iiwiam9pbiIsImNvbnNvbGUiLCJsb2ciLCJwcm9taXNlIiwicmVqZWN0Iiwib24iLCJiYXNlbmFtZSIsImRpcm5hbWUiLCJzdGF0cyIsImlzRGlyZWN0b3J5IiwiaXNGaWxlIiwicHVzaCIsImZpbHRlciIsImVudHJ5IiwicmVwbGFjZSIsInNlcCIsImVyciIsImVycm9yIiwibWVzc2FnZSIsImlkIiwiSlNPTiIsInBhcnNlIiwidG9TdHJpbmciLCJpbmRleE9mIiwiZnJhZ21lbnRzIiwic3BsaXQiLCJwYXR0ZXJuIiwiZmxhZyIsInB1YmxpY0RpciIsInByZXBlbmRQYXRoIiwiZ2V0TGlzdCIsInRoZW4iLCJmb3JtYXRUb1VybCIsInNlbmQiLCJjYXRjaCIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsYUFBYSxxQkFBbkI7QUFDQSxJQUFNQyxNQUFNQyxRQUFRRCxHQUFSLEVBQVo7QUFDQSxJQUFNRSxXQUFXLFNBQVhBLFFBQVcsQ0FBQ0MsS0FBRDtBQUFBLFNBQVksT0FBT0EsS0FBUCxLQUFpQixRQUFqQixJQUE2QkEsaUJBQWlCQyxNQUExRDtBQUFBLENBQWpCOztBQUdBOzs7Ozs7Ozs7Ozs7SUFXTUMsVTs7O0FBQ0o7QUFDQSx3QkFBYztBQUFBOztBQUFBLDhJQUNOTixVQURNOztBQUdaLFFBQU1PLFdBQVc7QUFDZkMsa0JBQVksaUJBREc7QUFFZkMsbUJBQWE7QUFGRSxLQUFqQjs7QUFLQSxVQUFLQyxTQUFMLENBQWVILFFBQWY7O0FBRUEsVUFBS0ksTUFBTCxHQUFjLEVBQWQsQ0FWWSxDQVVNO0FBQ2xCLFVBQUtDLGFBQUwsR0FBcUIsTUFBS0MsT0FBTCxDQUFhLGVBQWIsQ0FBckI7QUFYWTtBQVliOzs7OzRCQUVPO0FBQ047O0FBRUEsVUFBTUwsYUFBYSxLQUFLTSxPQUFMLENBQWFOLFVBQWhDO0FBQ0EsV0FBS08sVUFBTCxHQUFrQixLQUFLSCxhQUFMLENBQW1CSSxHQUFuQixDQUF1QlIsVUFBdkIsQ0FBbEI7O0FBRUEsVUFBSSxDQUFDLEtBQUtPLFVBQVYsRUFDRSxNQUFNLElBQUlFLEtBQUosT0FBY2pCLFVBQWQseUJBQTRDUSxVQUE1QyxxQkFBTjs7QUFFRixXQUFLVSxZQUFMLEdBQW9CLENBQUMsQ0FBQyxLQUFLSixPQUFMLENBQWFMLFdBQW5DOztBQUVBLFdBQUtVLEtBQUw7QUFDRDs7OzRCQUVPQyxNLEVBQVE7QUFDZCxXQUFLQyxPQUFMLENBQWFELE1BQWIsRUFBcUIsU0FBckIsRUFBZ0MsS0FBS0UsVUFBTCxDQUFnQkYsTUFBaEIsQ0FBaEM7QUFDRDs7QUFFRDs7Ozs7Ozs7O0FBU0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs0QkE4QlFHLE0sRUFBUTtBQUFBOztBQUNkLFVBQUlDLFlBQVksSUFBaEI7O0FBRUEsVUFBSSxDQUFDQyxNQUFNQyxPQUFOLENBQWNILE1BQWQsQ0FBTCxFQUE0QjtBQUMxQkEsaUJBQVMsQ0FBQ0EsTUFBRCxDQUFUO0FBQ0FDLG9CQUFZLEtBQVo7QUFDRDs7QUFFRCxVQUFNRyxRQUFRSixPQUFPSyxHQUFQLENBQVcsVUFBQ0MsSUFBRCxFQUFVO0FBQ2pDLFlBQUkxQixTQUFTMEIsSUFBVCxDQUFKLEVBQ0VBLE9BQU8sRUFBRUMsTUFBTUQsSUFBUixFQUFQOztBQUYrQixvQkFJZUEsSUFKZjtBQUFBLFlBSXpCQyxJQUp5QixTQUl6QkEsSUFKeUI7QUFBQSxZQUluQkMsS0FKbUIsU0FJbkJBLEtBSm1CO0FBQUEsWUFJWkMsU0FKWSxTQUlaQSxTQUpZO0FBQUEsWUFJREMsV0FKQyxTQUlEQSxXQUpDOztBQUtqQyxlQUFPLE9BQUtDLFFBQUwsQ0FBY0osSUFBZCxFQUFvQkMsS0FBcEIsRUFBMkJDLFNBQTNCLEVBQXNDQyxXQUF0QyxDQUFQO0FBQ0QsT0FOYSxDQUFkOztBQVFBLFVBQUlULGNBQWMsS0FBbEIsRUFDRSxPQUFPRyxNQUFNLENBQU4sQ0FBUCxDQURGLENBQ21CO0FBRG5CLFdBR0UsT0FBTyxrQkFBUVEsR0FBUixDQUFZUixLQUFaLENBQVA7QUFDSDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7OzsrQkFhMkU7QUFBQSxVQUFsRUcsSUFBa0UsdUVBQTNELElBQTJEO0FBQUEsVUFBckRDLEtBQXFELHVFQUE3QyxHQUE2Qzs7QUFBQTs7QUFBQSxVQUF4Q0MsU0FBd0MsdUVBQTVCLEtBQTRCO0FBQUEsVUFBckJDLFdBQXFCLHVFQUFQLEtBQU87O0FBQ3pFLFVBQUlILFNBQVMsSUFBYixFQUNFLE1BQU0sSUFBSWIsS0FBSixDQUFhakIsVUFBYix5QkFBTjs7QUFFRjtBQUNBLFVBQUkrQixVQUFVLEdBQWQsRUFDRUEsUUFBUSxJQUFSOztBQUVGLFVBQU1LLE1BQVNOLElBQVQsU0FBaUJDLEtBQWpCLFNBQTBCQyxTQUExQixTQUF1Q0MsV0FBN0M7O0FBRUEsVUFBSSxLQUFLZixZQUFMLElBQXFCLEtBQUtQLE1BQUwsQ0FBWXlCLEdBQVosQ0FBekIsRUFDRSxPQUFPLGtCQUFRQyxPQUFSLENBQWdCLEtBQUsxQixNQUFMLENBQVl5QixHQUFaLENBQWhCLENBQVA7O0FBRUYsVUFBTUUsVUFBVSxJQUFJQyxNQUFKLE9BQWV0QyxHQUFmLENBQWhCO0FBQ0EsVUFBSXVDLE1BQU0sZUFBTUMsU0FBTixDQUFnQlgsSUFBaEIsQ0FBVjtBQUNBLFVBQUlZLFVBQVUsRUFBZDs7QUFFQTtBQUNBLFVBQUksQ0FBQ0osUUFBUUssSUFBUixDQUFhSCxHQUFiLENBQUwsRUFDRUEsTUFBTSxlQUFNSSxJQUFOLENBQVczQyxHQUFYLEVBQWdCdUMsR0FBaEIsQ0FBTjs7QUFFRkssY0FBUUMsR0FBUixDQUFZTixHQUFaO0FBQ0EsVUFBTU8sVUFBVSxzQkFBWSxVQUFDVixPQUFELEVBQVVXLE1BQVYsRUFBcUI7QUFDL0MsNEJBQUtSLEdBQUwsRUFDR1MsRUFESCxDQUNNLE1BRE4sRUFDYyxVQUFDcEIsSUFBRCxFQUFVO0FBQ3BCLGNBQU1xQixXQUFXLGVBQU1BLFFBQU4sQ0FBZXJCLEtBQUtDLElBQXBCLENBQWpCO0FBQ0EsY0FBTXFCLFVBQVUsZUFBTUEsT0FBTixDQUFjdEIsS0FBS0MsSUFBbkIsQ0FBaEI7O0FBRUE7QUFDRTtBQUNBRCxlQUFLQyxJQUFMLEtBQWNVLEdBQWQ7QUFDQTtBQUNBVSx1QkFBYSxXQUZiLElBR0EsTUFBTVAsSUFBTixDQUFXTyxRQUFYLE1BQXlCLElBTDNCLEVBTUU7QUFDQTtBQUNEOztBQUVELGNBQ0dqQixlQUFlSixLQUFLdUIsS0FBTCxDQUFXQyxXQUFYLEVBQWhCLElBQ0MsQ0FBQ3BCLFdBQUQsSUFBZ0JKLEtBQUt1QixLQUFMLENBQVdFLE1BQVgsRUFGbkIsRUFHRTtBQUNBLGdCQUFJdEIsYUFBYyxDQUFDQSxTQUFELElBQWNtQixZQUFZWCxHQUE1QyxFQUNFRSxRQUFRYSxJQUFSLENBQWExQixLQUFLQyxJQUFsQjtBQUNIO0FBQ0YsU0F0QkgsRUFzQkttQixFQXRCTCxDQXNCUSxLQXRCUixFQXNCZSxZQUFNO0FBQ2pCO0FBQ0FQLG9CQUFVQSxRQUFRYyxNQUFSLENBQWUsVUFBQ0MsS0FBRCxFQUFXO0FBQ2xDQSxvQkFBUUEsTUFBTUMsT0FBTixDQUFjLGVBQU1kLElBQU4sQ0FBV0osR0FBWCxFQUFnQixlQUFNbUIsR0FBdEIsQ0FBZCxFQUEwQyxFQUExQyxDQUFSO0FBQ0EsbUJBQU81QixNQUFNWSxJQUFOLENBQVdjLEtBQVgsQ0FBUDtBQUNELFdBSFMsQ0FBVjs7QUFLQTtBQUNBLGNBQUksT0FBS3ZDLFlBQVQsRUFDRSxPQUFLUCxNQUFMLENBQVl5QixHQUFaLElBQW1CTSxPQUFuQjs7QUFFRkwsa0JBQVFLLE9BQVI7QUFDRCxTQWxDSCxFQWtDS08sRUFsQ0wsQ0FrQ1EsT0FsQ1IsRUFrQ2lCLFVBQVNXLEdBQVQsRUFBYztBQUMzQmYsa0JBQVFnQixLQUFSLENBQWM3RCxVQUFkLEVBQTBCLEdBQTFCLEVBQStCNEQsSUFBSUUsT0FBbkM7QUFDRCxTQXBDSDtBQXFDRCxPQXRDZSxDQUFoQjs7QUF3Q0EsYUFBT2YsT0FBUDtBQUNEOzs7K0JBRVUzQixNLEVBQVE7QUFBQTs7QUFDakIsYUFBTyxVQUFDMkMsRUFBRCxFQUFLeEMsTUFBTCxFQUFnQjtBQUNyQjtBQUNBO0FBQ0FBLGlCQUFTeUMsS0FBS0MsS0FBTCxDQUFXMUMsTUFBWCxFQUFtQixVQUFTYSxHQUFULEVBQWNoQyxLQUFkLEVBQXFCO0FBQy9DLGNBQUlnQyxRQUFRLE9BQVIsSUFBbUJoQyxNQUFNOEQsUUFBTixHQUFpQkMsT0FBakIsQ0FBeUIsV0FBekIsTUFBMEMsQ0FBakUsRUFBb0U7QUFDbEUsZ0JBQU1DLFlBQVloRSxNQUFNaUUsS0FBTixDQUFZLFdBQVosRUFBeUIsQ0FBekIsRUFBNEJ0QyxLQUE1QixDQUFrQyxxQkFBbEMsQ0FBbEI7QUFDQSxnQkFBTXVDLFVBQVVGLFVBQVUsQ0FBVixFQUFhVixPQUFiLENBQXFCLE1BQXJCLEVBQTZCLElBQTdCLENBQWhCO0FBQ0EsZ0JBQU1hLE9BQU9ILFVBQVUsQ0FBVixLQUFnQixFQUE3QjtBQUNBLG1CQUFPLElBQUk3QixNQUFKLENBQVcrQixPQUFYLEVBQW9CQyxJQUFwQixDQUFQO0FBQ0QsV0FMRCxNQUtPO0FBQ0wsbUJBQU9uRSxLQUFQO0FBQ0Q7QUFDRixTQVRRLENBQVQ7O0FBV0EsWUFBTWtDLFVBQVUsSUFBSUMsTUFBSixPQUFldEMsR0FBZixDQUFoQjtBQUNBLFlBQUl1RSxZQUFZLE9BQUt6RCxVQUFyQjs7QUFFQSxZQUFJLENBQUN1QixRQUFRSyxJQUFSLENBQWE2QixTQUFiLENBQUwsRUFDRUEsWUFBWSxlQUFNNUIsSUFBTixDQUFXM0MsR0FBWCxFQUFnQnVFLFNBQWhCLENBQVo7O0FBRUY7QUFDQSxpQkFBU0MsV0FBVCxDQUFxQjVDLElBQXJCLEVBQTJCO0FBQ3pCLGNBQUlKLE1BQU1DLE9BQU4sQ0FBY0csSUFBZCxDQUFKLEVBQ0UsT0FBT0EsS0FBS0QsR0FBTCxDQUFTNkMsV0FBVCxDQUFQOztBQUVGLGNBQUl0RSxTQUFTMEIsSUFBVCxDQUFKLEVBQ0VBLE9BQU8sZUFBTWUsSUFBTixDQUFXNEIsU0FBWCxFQUFzQjNDLElBQXRCLENBQVAsQ0FERixLQUdFQSxLQUFLQyxJQUFMLEdBQVksZUFBTWMsSUFBTixDQUFXNEIsU0FBWCxFQUFzQjNDLEtBQUtDLElBQTNCLENBQVo7O0FBRUYsaUJBQU9ELElBQVA7QUFDRDs7QUFFRE4saUJBQVNrRCxZQUFZbEQsTUFBWixDQUFUOztBQUVBO0FBQ0EsZUFBS21ELE9BQUwsQ0FBYW5ELE1BQWIsRUFDR29ELElBREgsQ0FDUSxVQUFDakMsT0FBRCxFQUFhO0FBQ2pCLG1CQUFTa0MsV0FBVCxDQUFxQm5CLEtBQXJCLEVBQTRCO0FBQzFCLGdCQUFJaEMsTUFBTUMsT0FBTixDQUFjK0IsS0FBZCxDQUFKLEVBQ0UsT0FBT0EsTUFBTTdCLEdBQU4sQ0FBVWdELFdBQVYsQ0FBUDs7QUFFRm5CLG9CQUFRQSxNQUFNQyxPQUFOLENBQWNjLFNBQWQsRUFBeUIsRUFBekIsQ0FBUjtBQUNBZixvQkFBUUEsTUFBTUMsT0FBTixDQUFjLElBQWQsRUFBb0IsR0FBcEIsQ0FBUixDQUwwQixDQUtROztBQUVsQyxnQkFBSSxDQUFDLE1BQU1mLElBQU4sQ0FBV2MsS0FBWCxDQUFMLEVBQ0VBLFFBQVEsTUFBTUEsS0FBZDs7QUFFRixtQkFBT0EsS0FBUDtBQUNEOztBQUVEO0FBQ0FmLG9CQUFVa0MsWUFBWWxDLE9BQVosQ0FBVjs7QUFFQSxpQkFBS21DLElBQUwsQ0FBVXpELE1BQVYsWUFBMEIyQyxFQUExQixFQUFnQ3JCLE9BQWhDO0FBQ0QsU0FuQkgsRUFvQkdvQyxLQXBCSCxDQW9CUyxVQUFDbEIsR0FBRDtBQUFBLGlCQUFTZixRQUFRZ0IsS0FBUixDQUFjRCxJQUFJakMsS0FBbEIsQ0FBVDtBQUFBLFNBcEJUO0FBcUJELE9BekREO0FBMEREOzs7OztBQUdILHlCQUFlb0QsUUFBZixDQUF3Qi9FLFVBQXhCLEVBQW9DTSxVQUFwQzs7a0JBRWVBLFUiLCJmaWxlIjoiRmlsZVN5c3RlbS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgZnNlIGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCBrbGF3IGZyb20gJ2tsYXcnO1xuaW1wb3J0IF9wYXRoIGZyb20gJ3BhdGgnO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6ZmlsZS1zeXN0ZW0nO1xuY29uc3QgY3dkID0gcHJvY2Vzcy5jd2QoKTtcbmNvbnN0IGlzU3RyaW5nID0gKHZhbHVlKSA9PiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyB8fCB2YWx1ZSBpbnN0YW5jZW9mIFN0cmluZyk7XG5cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBzZXJ2ZXIgYCdmaWxlLXN5c3RlbSdgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIGFsbG93IHRvIHJldHJpZXZlIGEgbGlzdCBvZiBmaWxlcyBvciBkaXJlY3RvcmllcyBmcm9tIGEgZ2l2ZW4gcGF0aC5cbiAqXG4gKiBfXypUaGUgc2VydmljZSBtdXN0IGJlIHVzZWQgd2l0aCBpdHMgW3NlcnZlci1zaWRlIGNvdW50ZXJwYXJ0XXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuRmlsZVN5c3RlbX0qX19cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyXG4gKiBAZXhhbXBsZVxuICogdGhpcy5maWxlU3lzdGVtID0gdGhpcy5yZXF1aXJlKCdmaWxlLXN5c3RlbScpO1xuICovXG5jbGFzcyBGaWxlU3lzdGVtIGV4dGVuZHMgU2VydmljZSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbmNpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGNvbmZpZ0l0ZW06ICdwdWJsaWNEaXJlY3RvcnknLFxuICAgICAgZW5hYmxlQ2FjaGU6IHRydWUsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcblxuICAgIHRoaXMuX2NhY2hlID0gW107IC8vIGtlZXAgcmVzdWx0cyBpbiBjYWNoZSB0byBhdm9pZCB0b28gbXVjaCBJL08gY2FsbHNcbiAgICB0aGlzLl9zaGFyZWRDb25maWcgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1jb25maWcnKTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBjb25zdCBjb25maWdJdGVtID0gdGhpcy5vcHRpb25zLmNvbmZpZ0l0ZW07XG4gICAgdGhpcy5fcHVibGljRGlyID0gdGhpcy5fc2hhcmVkQ29uZmlnLmdldChjb25maWdJdGVtKTtcblxuICAgIGlmICghdGhpcy5fcHVibGljRGlyKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBcIiR7U0VSVklDRV9JRH1cIjogc2VydmVyLmNvbmZpZy4ke2NvbmZpZ0l0ZW19IGlzIG5vdCBkZWZpbmVkYCk7XG5cbiAgICB0aGlzLl9lbmFibGVDYWNoZSA9ICEhdGhpcy5vcHRpb25zLmVuYWJsZUNhY2hlO1xuXG4gICAgdGhpcy5yZWFkeSgpO1xuICB9XG5cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAncmVxdWVzdCcsIHRoaXMuX29uUmVxdWVzdChjbGllbnQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiB7T2JqZWN0fSBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuRmlsZVN5c3RlbX5MaXN0Q29uZmlnXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBwYXRoIC0gTmFtZSBvZiB0aGUgZm9sZGVyIHRvIHNlYXJjaCBpbnRvLlxuICAgKiBAcHJvcGVydHkge1JlZ0V4cH0gW21hdGNoPScqJ10gLSBSZWdFeHAgdXNlZCB0byBmaWx0ZXIgdGhlIHJlc3VsdHMuXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gW3JlY3Vyc2l2ZT1mYWxzZV0gLSBEZWZpbmUgaWYgdGhlIHNlYXJjaCBzaG91bGQgYmVcbiAgICogIHJlY3Vyc2l2ZS5cbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBbZGlyZWN0b3JpZXM9ZmFsc2VdIC0gSWYgdHJ1ZSBvbmx5IHJldHVybiBkaXJlY3RvcmllcyxcbiAgICogIGZpbGVzIG90aGVyd2lzZS5cbiAgICovXG4gIC8qKlxuICAgKiBSZXR1cm4gYSBsaXN0IG9mIGZpbGVzIGFjY29yZGluZyB0byB0aGUgZ2l2ZW4gY29uZmlndXJhdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd8bW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLkZpbGVTeXN0ZW1+TGlzdENvbmZpZ3xBcnJheTxTdHJpbmc+fEFycmF5PG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5GaWxlU3lzdGVtfkxpc3RDb25maWc+fSBjb25maWcgLVxuICAgKiAgRGV0YWlscyBvZiB0aGUgcmVxdWVzdGVkIGZpbGUgbGlzdChzKS5cbiAgICogQHJldHVybiB7UHJvbWlzZTxBcnJheT58UHJvbWlzZTxBcnJheTxBcnJheT4+fSAtIFByb21pc2UgcmVzb2x2aW5nIHdpdGggYW5cbiAgICogIGFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIGFic29sdXRlIHBhdGhzIG9mIHRoZSBmaWxlcyAvIGRpcmVjdG9yaWVzLlxuICAgKiAgSWYgYGNvbmZpZ2AgaXMgYW4gYXJyYXksIHRoZSByZXN1bHRzIHdpbGwgYmUgYW4gYXJyYXkgb2YgYXJyYXlzXG4gICAqICBjb250YWluaW5nIHRoZSByZXN1bHQgb2YgZWFjaCBkaWZmZXJlbnQgcmVxdWVzdC5cbiAgICpcbiAgICogQGV4YW1wbGU6XG4gICAqIC8vIDEuIFNpbmdsZSBsaXN0XG4gICAqIC8vIHJldHJpZXZlIGFsbCB0aGUgZmlsZSBpbiBhIGZvbGRlclxuICAgKiBmaWxlU3lzdGVtLmdldExpc3QoJ215LWRpcmVjdG9yeScpLnRoZW4oKGZpbGVzKSA9PiAuLi4gKTtcbiAgICogLy8gb3IsIHJldHJpZXZlIGFsbCB0aGUgYC53YXZgIGZpbGVzIGluc2lkZSBhIGdpdmVuIGZvbGRlciwgc2VhcmNoIHJlY3Vyc2l2ZWx5XG4gICAqIGZpbGVTeXN0ZW0uZ2V0TGlzdCh7XG4gICAqICAgcGF0aDogJ215LWRpcmVjdG9yeScsXG4gICAqICAgbWF0Y2g6IC9cXC53YXYvLFxuICAgKiAgIHJlY3Vyc2l2ZTogdHJ1ZSxcbiAgICogfSkudGhlbigoZmlsZXMpID0+IC4uLiApO1xuICAgKlxuICAgKiAvLyAyLiBNdWx0aXBsZSBSZXF1ZXN0c1xuICAgKiAvLyByZXRyaWV2ZSBhbGwgdGhlIGZpbGUgaW4gMiBkaWZmZXJlbnQgZm9sZGVycywgdGhlIHJldHVybmVkIHZhbHVlIHdpbGwgYmVcbiAgICogLy8gYW4gYXJyYXkgY29udGFpbmluZyB0aGUgMiBmaWxlIGxpc3RzXG4gICAqIGZpbGVTeXN0ZW0uZ2V0TGlzdChbJ215LWRpcmVjdG9yeTEnLCAnbXktZGlyZWN0b3J5MiddKVxuICAgKiAgIC50aGVuKChhcnJheUxpc3QpID0+IC4uLiApO1xuICAgKiAvLyBvclxuICAgKiBmaWxlU3lzdGVtLmdldExpc3QoW3sgLi4uIH0sIHsgLi4uIH1dKVxuICAgKiAgIC50aGVuKChhcnJheUxpc3QpID0+IC4uLiApO1xuICAgKi9cbiAgZ2V0TGlzdChjb25maWcpIHtcbiAgICBsZXQgcmV0dXJuQWxsID0gdHJ1ZTtcblxuICAgIGlmICghQXJyYXkuaXNBcnJheShjb25maWcpKSB7XG4gICAgICBjb25maWcgPSBbY29uZmlnXTtcbiAgICAgIHJldHVybkFsbCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IHN0YWNrID0gY29uZmlnLm1hcCgoaXRlbSkgPT4ge1xuICAgICAgaWYgKGlzU3RyaW5nKGl0ZW0pKVxuICAgICAgICBpdGVtID0geyBwYXRoOiBpdGVtIH07XG5cbiAgICAgIGNvbnN0IHsgcGF0aCwgbWF0Y2gsIHJlY3Vyc2l2ZSwgZGlyZWN0b3JpZXMgfSA9IGl0ZW07XG4gICAgICByZXR1cm4gdGhpcy5fZ2V0TGlzdChwYXRoLCBtYXRjaCwgcmVjdXJzaXZlLCBkaXJlY3Rvcmllcyk7XG4gICAgfSk7XG5cbiAgICBpZiAocmV0dXJuQWxsID09PSBmYWxzZSlcbiAgICAgIHJldHVybiBzdGFja1swXTsgLy8gYSBzaW5nbGUgcHJvbWlzZVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBQcm9taXNlLmFsbChzdGFjayk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGEgbGlzdCBvZiBmaWxlcyBpbnNpZGUgYSBnaXZlbiBkaXJlY3RvcnkuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoIC0gVGhlIGRpcmVjdG9yeSB0byBzZWFyY2ggaW50by5cbiAgICogQHBhcmFtIHtSZWdFeHB9IFttYXRjaD0nKiddIC0gQSBSZWdFeHAgdG8gZmlsdGVyIHRoZSByZXN1bHRzICh0aGVcbiAgICogIHdpbGRjYXJkICcqJyBpcyBhY2NlcHRlZCkuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW3JlY3Vyc2l2ZT1mYWxzZV0gLSBEZWZpbmUgaWYgdGhlIHNlYXJjaCBzaG91bGQgYmVcbiAgICogIHJlY3Vyc2l2ZSBvciBub3RcbiAgICogQHBhcmFtIHtCb29sZWFufSBbZGlyZWN0b3JpZXM9ZmFsc2VdIC0gRGVmaW5lIGlmIHRoZSByZXN1bHQgc2hvdWxkIGNvbnRhaW5cbiAgICogIGEgbGlzdCBvZiBmaWxlcyBvciBhIGxpc3Qgb2YgZGlyZWN0b3JpZXMuXG4gICAqIEByZXR1cm4ge0FycmF5fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2dldExpc3QocGF0aCA9IG51bGwsIG1hdGNoID0gJyonLCByZWN1cnNpdmUgPSBmYWxzZSwgZGlyZWN0b3JpZXMgPSBmYWxzZSkge1xuICAgIGlmIChwYXRoID09PSBudWxsKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke1NFUlZJQ0VfSUR9IC0gcGF0aCBub3QgZGVmaW5lZGApO1xuXG4gICAgLy8gd2lsY2FyZFxuICAgIGlmIChtYXRjaCA9PT0gJyonKVxuICAgICAgbWF0Y2ggPSAvLiovO1xuXG4gICAgY29uc3Qga2V5ID0gYCR7cGF0aH06JHttYXRjaH06JHtyZWN1cnNpdmV9OiR7ZGlyZWN0b3JpZXN9YDtcblxuICAgIGlmICh0aGlzLl9lbmFibGVDYWNoZSAmJiB0aGlzLl9jYWNoZVtrZXldKVxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh0aGlzLl9jYWNoZVtrZXldKTtcblxuICAgIGNvbnN0IHRlc3RDd2QgPSBuZXcgUmVnRXhwKGBeJHtjd2R9YCk7XG4gICAgbGV0IGRpciA9IF9wYXRoLm5vcm1hbGl6ZShwYXRoKTtcbiAgICBsZXQgcmVzdWx0cyA9IFtdO1xuXG4gICAgLy8gbWFrZSB0aGUgZ2l2ZW4gcGF0aCBhYnNvbHV0ZSBpZiBub3RcbiAgICBpZiAoIXRlc3RDd2QudGVzdChkaXIpKVxuICAgICAgZGlyID0gX3BhdGguam9pbihjd2QsIGRpcik7XG5cbiAgICBjb25zb2xlLmxvZyhkaXIpO1xuICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBrbGF3KGRpcilcbiAgICAgICAgLm9uKCdkYXRhJywgKGl0ZW0pID0+IHtcbiAgICAgICAgICBjb25zdCBiYXNlbmFtZSA9IF9wYXRoLmJhc2VuYW1lKGl0ZW0ucGF0aCk7XG4gICAgICAgICAgY29uc3QgZGlybmFtZSA9IF9wYXRoLmRpcm5hbWUoaXRlbS5wYXRoKTtcblxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIC8vIGlnbm9yZSBjdXJyZW50IGRpcmVjdG9yeVxuICAgICAgICAgICAgaXRlbS5wYXRoID09PSBkaXIgfHzCoFxuICAgICAgICAgICAgLy8gaWdub3JlIGNvbW1vbiBoaWRkZW4gc3lzdGVtIGZpbGUgcGF0dGVybnNcbiAgICAgICAgICAgIGJhc2VuYW1lID09PSAndGh1bWJzLmRiJyB8fFxuICAgICAgICAgICAgL15cXC4vLnRlc3QoYmFzZW5hbWUpID09PSB0cnVlXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgKGRpcmVjdG9yaWVzICYmIGl0ZW0uc3RhdHMuaXNEaXJlY3RvcnkoKSkgfHzCoFxuICAgICAgICAgICAgKCFkaXJlY3RvcmllcyAmJiBpdGVtLnN0YXRzLmlzRmlsZSgpKVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgaWYgKHJlY3Vyc2l2ZSB8fMKgKCFyZWN1cnNpdmUgJiYgZGlybmFtZSA9PT0gZGlyKSlcbiAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKGl0ZW0ucGF0aCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KS5vbignZW5kJywgKCkgPT4ge1xuICAgICAgICAgIC8vIHJlbW92ZSBgZGlyYCB0aGUgcGF0aHMgYW5kIHRlc3QgYWdhaW5zdCB0aGUgcmVnRXhwXG4gICAgICAgICAgcmVzdWx0cyA9IHJlc3VsdHMuZmlsdGVyKChlbnRyeSkgPT4ge1xuICAgICAgICAgICAgZW50cnkgPSBlbnRyeS5yZXBsYWNlKF9wYXRoLmpvaW4oZGlyLCBfcGF0aC5zZXApLCAnJyk7XG4gICAgICAgICAgICByZXR1cm4gbWF0Y2gudGVzdChlbnRyeSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvLyBrZWVwIGluIGNhY2hlIGFuZCByZXNvbHZlIHByb21pc2VcbiAgICAgICAgICBpZiAodGhpcy5fZW5hYmxlQ2FjaGUpXG4gICAgICAgICAgICB0aGlzLl9jYWNoZVtrZXldID0gcmVzdWx0cztcblxuICAgICAgICAgIHJlc29sdmUocmVzdWx0cyk7XG4gICAgICAgIH0pLm9uKCdlcnJvcicsIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoU0VSVklDRV9JRCwgJy0nLCBlcnIubWVzc2FnZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICBfb25SZXF1ZXN0KGNsaWVudCkge1xuICAgIHJldHVybiAoaWQsIGNvbmZpZykgPT4ge1xuICAgICAgLy8gdW5zZXJpYWxpemUgdGhlIGpzb24gY29uZmlnIHRvIHJldHVybiBwcm9wZXIgUmVnRXhwLCBhZGFwdGVkIGZyb206XG4gICAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEyMDc1OTI3L3NlcmlhbGl6YXRpb24tb2YtcmVnZXhwI2Fuc3dlci0zMzQxNjY4NFxuICAgICAgY29uZmlnID0gSlNPTi5wYXJzZShjb25maWcsIGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKGtleSA9PT0gJ21hdGNoJyAmJiB2YWx1ZS50b1N0cmluZygpLmluZGV4T2YoJ19fUkVHRVhQICcpID09PSAwKSB7XG4gICAgICAgICAgY29uc3QgZnJhZ21lbnRzID0gdmFsdWUuc3BsaXQoJ19fUkVHRVhQICcpWzFdLm1hdGNoKC9cXC8oLio/KVxcLyhbZ2lteV0pPyQvKTtcbiAgICAgICAgICBjb25zdCBwYXR0ZXJuID0gZnJhZ21lbnRzWzFdLnJlcGxhY2UoJ1xcXFxcXFxcJywgJ1xcXFwnKTtcbiAgICAgICAgICBjb25zdCBmbGFnID0gZnJhZ21lbnRzWzJdIHx8wqAnJztcbiAgICAgICAgICByZXR1cm4gbmV3IFJlZ0V4cChwYXR0ZXJuLCBmbGFnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCB0ZXN0Q3dkID0gbmV3IFJlZ0V4cChgXiR7Y3dkfWApO1xuICAgICAgbGV0IHB1YmxpY0RpciA9IHRoaXMuX3B1YmxpY0RpcjtcblxuICAgICAgaWYgKCF0ZXN0Q3dkLnRlc3QocHVibGljRGlyKSlcbiAgICAgICAgcHVibGljRGlyID0gX3BhdGguam9pbihjd2QsIHB1YmxpY0Rpcik7XG5cbiAgICAgIC8vIGZvcmNlIHRoZSBzZWFyY2ggaW4gdGhlIHB1YmxpYyBkaXJlY3RvcnlcbiAgICAgIGZ1bmN0aW9uIHByZXBlbmRQYXRoKGl0ZW0pIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaXRlbSkpXG4gICAgICAgICAgcmV0dXJuIGl0ZW0ubWFwKHByZXBlbmRQYXRoKTtcblxuICAgICAgICBpZiAoaXNTdHJpbmcoaXRlbSkpXG4gICAgICAgICAgaXRlbSA9IF9wYXRoLmpvaW4ocHVibGljRGlyLCBpdGVtKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGl0ZW0ucGF0aCA9IF9wYXRoLmpvaW4ocHVibGljRGlyLCBpdGVtLnBhdGgpO1xuXG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgfVxuXG4gICAgICBjb25maWcgPSBwcmVwZW5kUGF0aChjb25maWcpO1xuXG4gICAgICAvLyBnZXQgcmVzdWx0c1xuICAgICAgdGhpcy5nZXRMaXN0KGNvbmZpZylcbiAgICAgICAgLnRoZW4oKHJlc3VsdHMpID0+IHtcbiAgICAgICAgICBmdW5jdGlvbiBmb3JtYXRUb1VybChlbnRyeSkge1xuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZW50cnkpKVxuICAgICAgICAgICAgICByZXR1cm4gZW50cnkubWFwKGZvcm1hdFRvVXJsKTtcblxuICAgICAgICAgICAgZW50cnkgPSBlbnRyeS5yZXBsYWNlKHB1YmxpY0RpciwgJycpO1xuICAgICAgICAgICAgZW50cnkgPSBlbnRyeS5yZXBsYWNlKCdcXFxcJywgJy8nKTsgLy8gd2luZG93IHBhdGhzIHRvIHVybFxuXG4gICAgICAgICAgICBpZiAoIS9eXFwvLy50ZXN0KGVudHJ5KSlcbiAgICAgICAgICAgICAgZW50cnkgPSAnLycgKyBlbnRyeTtcblxuICAgICAgICAgICAgcmV0dXJuIGVudHJ5O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIHJlbW92ZSBhbGwgZmlsZSBzeXN0ZW0gaW5mb3JtYXRpb25zIGFuZCBjcmVhdGUgYW4gYWJzb2x1dGUgdXJsXG4gICAgICAgICAgcmVzdWx0cyA9IGZvcm1hdFRvVXJsKHJlc3VsdHMpO1xuXG4gICAgICAgICAgdGhpcy5zZW5kKGNsaWVudCwgYGxpc3Q6JHtpZH1gLCByZXN1bHRzKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKChlcnIpID0+IGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrKSk7XG4gICAgfTtcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBGaWxlU3lzdGVtKTtcblxuZXhwb3J0IGRlZmF1bHQgRmlsZVN5c3RlbTtcbiJdfQ==