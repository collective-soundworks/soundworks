'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:file-system';
var isString = function isString(value) {
  return typeof value === 'string' || value instanceof String;
};

/**
 * Interface for the client `'file-system'` service.
 *
 * This service allow to retrieve a list of files or directories from a given path.
 * If a `list` option is given when requiring the service, the service marks
 * itself as `ready` when the file list is returned by the server.
 * The service can be used later to retrieve new file lists, each required list is
 * cached client-side to prevent useless network traffic.
 *
 * @param {Object} options
 * @param {String|module:soundworks/client.FileSystem~ListConfig|Array<String>|Array<module:soundworks/client.FileSystem~ListConfig>} option.list -
 *  List to
 *
 * __*The service must be used with its [client-side counterpart]{@link module:soundworks/client.FileSystem}*__
 *
 * @memberof module:soundworks/client
 * @example
 * // require and configure the `file-system` service inside the experience
 * // constructor, the file list to be retrive can be configured as a simple string
 * this.fileSystem = this.require('file-system', { list: 'audio' });
 * // ... or as a full {@link module:soundworks/client.FileSystem~ListConfig}
 * // object for better control over the returned file list
 * this.fileSystem = this.require('file-system', { list: {
 *     path: 'audio',
 *     match: /\.wav$/,
 *     recursive: true,
 *   }
 * });
 *
 * // given the following file system
 * // audio/
 * //   voice.mp3
 * //   voice.wav
 * //   drum/
 * //     kick.mp3
 * //     kick.wav
 * // the first query will return the following result:
 * > ['/audio/voice.mp3', 'audio/voice.wav']
 * // while the second one will return:
 * > ['/audio/voice.wav', 'audio/drum/kick.wav']
 *
 * @see {@link module:soundworks/client.FileSystem~ListConfig}
 */

var FileSystem = function (_Service) {
  (0, _inherits3.default)(FileSystem, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  function FileSystem() {
    (0, _classCallCheck3.default)(this, FileSystem);

    var _this = (0, _possibleConstructorReturn3.default)(this, (FileSystem.__proto__ || (0, _getPrototypeOf2.default)(FileSystem)).call(this, SERVICE_ID, true));

    var defaults = { list: null };
    _this.configure(defaults);

    _this._cache = {};
    // as file system is async (server side), nothing guarantees response order
    _this._requestId = 0;
    return _this;
  }

  (0, _createClass3.default)(FileSystem, [{
    key: 'start',
    value: function start() {
      (0, _get3.default)(FileSystem.prototype.__proto__ || (0, _getPrototypeOf2.default)(FileSystem.prototype), 'start', this).call(this);

      if (this.options.list !== null) this.getList(this.options.list);else this.ready();
    }
  }, {
    key: 'stop',
    value: function stop() {
      (0, _get3.default)(FileSystem.prototype.__proto__ || (0, _getPrototypeOf2.default)(FileSystem.prototype), 'stop', this).call(this);
    }

    /**
     * @typedef {Object} module:soundworks/client.FileSystem~ListConfig
     * @property {String} path - Name of the folder to search into.
     * @property {RegExp} [match='*'] - RegExp used to filter the results.
     * @property {Boolean} [recursive=false] - Flag whether the search should be
     *  recursive.
     * @property {Boolean} [directories=false] - If true only return directories,
     *  files otherwise.
     */
    /**
     * Return a list of file according to the given configuration.
     *
     * @param {String|module:soundworks/client.FileSystem~ListConfig|Array<String>|Array<module:soundworks/client.FileSystem~ListConfig>} config -
     *  Details of the requested list(s). The requested files or directories must
     *  be publicly accessible.
     * @return {Promise<Array>|Promise<Array<Array>>} - Promise resolving with an
     *  an array containing the absolute urls of the files or directories.
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

  }, {
    key: 'getList',
    value: function getList(config) {
      var _this2 = this;

      // serialize the json config to properly handle RegExp, adapted from:
      // http://stackoverflow.com/questions/12075927/serialization-of-regexp#answer-33416684
      var _config = (0, _stringify2.default)(config, function (key, value) {
        if (value instanceof RegExp) return '__REGEXP ' + value.toString();else return value;
      });

      var key = isString(config) ? config : _config;

      if (this._cache[key]) return this._cache[key];

      var promise = new _promise2.default(function (resolve, reject) {
        var id = _this2._requestId;
        var channel = 'list:' + id;
        _this2._requestId += 1;

        _this2.receive(channel, function (results) {
          // @note - socket.io remove the first listener if no func argument given
          //         should be done properly -> update socket and Activity
          _this2.removeListener(channel);
          resolve(results);

          if (_this2.options.list !== null && channel === 'list:0') _this2.fileList = results;
          _this2.ready();
        });

        _this2.send('request', id, _config);

        _this2._requestId += 1;
      });

      this._cache[key] = promise;
      return promise;
    }
  }]);
  return FileSystem;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, FileSystem);

exports.default = FileSystem;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZpbGVTeXN0ZW0uanMiXSwibmFtZXMiOlsiU0VSVklDRV9JRCIsImlzU3RyaW5nIiwidmFsdWUiLCJTdHJpbmciLCJGaWxlU3lzdGVtIiwiZGVmYXVsdHMiLCJsaXN0IiwiY29uZmlndXJlIiwiX2NhY2hlIiwiX3JlcXVlc3RJZCIsIm9wdGlvbnMiLCJnZXRMaXN0IiwicmVhZHkiLCJjb25maWciLCJfY29uZmlnIiwia2V5IiwiUmVnRXhwIiwidG9TdHJpbmciLCJwcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImlkIiwiY2hhbm5lbCIsInJlY2VpdmUiLCJyZXN1bHRzIiwicmVtb3ZlTGlzdGVuZXIiLCJmaWxlTGlzdCIsInNlbmQiLCJTZXJ2aWNlIiwic2VydmljZU1hbmFnZXIiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxhQUFhLHFCQUFuQjtBQUNBLElBQU1DLFdBQVcsU0FBWEEsUUFBVyxDQUFDQyxLQUFEO0FBQUEsU0FBWSxPQUFPQSxLQUFQLEtBQWlCLFFBQWpCLElBQTZCQSxpQkFBaUJDLE1BQTFEO0FBQUEsQ0FBakI7O0FBR0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBMkNNQyxVOzs7QUFDSjtBQUNBLHdCQUFjO0FBQUE7O0FBQUEsOElBQ05KLFVBRE0sRUFDTSxJQUROOztBQUdaLFFBQU1LLFdBQVcsRUFBRUMsTUFBTSxJQUFSLEVBQWpCO0FBQ0EsVUFBS0MsU0FBTCxDQUFlRixRQUFmOztBQUVBLFVBQUtHLE1BQUwsR0FBYyxFQUFkO0FBQ0E7QUFDQSxVQUFLQyxVQUFMLEdBQWtCLENBQWxCO0FBUlk7QUFTYjs7Ozs0QkFFTztBQUNOOztBQUVBLFVBQUksS0FBS0MsT0FBTCxDQUFhSixJQUFiLEtBQXNCLElBQTFCLEVBQ0UsS0FBS0ssT0FBTCxDQUFhLEtBQUtELE9BQUwsQ0FBYUosSUFBMUIsRUFERixLQUdFLEtBQUtNLEtBQUw7QUFDSDs7OzJCQUVNO0FBQ0w7QUFDRDs7QUFFRDs7Ozs7Ozs7O0FBU0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzRCQWdDUUMsTSxFQUFRO0FBQUE7O0FBQ2Q7QUFDQTtBQUNBLFVBQU1DLFVBQVUseUJBQWVELE1BQWYsRUFBdUIsVUFBU0UsR0FBVCxFQUFjYixLQUFkLEVBQXFCO0FBQzFELFlBQUlBLGlCQUFpQmMsTUFBckIsRUFDRSxxQkFBbUJkLE1BQU1lLFFBQU4sRUFBbkIsQ0FERixLQUdFLE9BQU9mLEtBQVA7QUFDSCxPQUxlLENBQWhCOztBQU9BLFVBQU1hLE1BQU1kLFNBQVNZLE1BQVQsSUFBbUJBLE1BQW5CLEdBQTRCQyxPQUF4Qzs7QUFFQSxVQUFJLEtBQUtOLE1BQUwsQ0FBWU8sR0FBWixDQUFKLEVBQ0UsT0FBTyxLQUFLUCxNQUFMLENBQVlPLEdBQVosQ0FBUDs7QUFFRixVQUFNRyxVQUFVLHNCQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUMvQyxZQUFNQyxLQUFLLE9BQUtaLFVBQWhCO0FBQ0EsWUFBTWEsb0JBQWtCRCxFQUF4QjtBQUNBLGVBQUtaLFVBQUwsSUFBbUIsQ0FBbkI7O0FBRUEsZUFBS2MsT0FBTCxDQUFhRCxPQUFiLEVBQXNCLFVBQUNFLE9BQUQsRUFBYTtBQUNqQztBQUNBO0FBQ0EsaUJBQUtDLGNBQUwsQ0FBb0JILE9BQXBCO0FBQ0FILGtCQUFRSyxPQUFSOztBQUVBLGNBQUksT0FBS2QsT0FBTCxDQUFhSixJQUFiLEtBQXNCLElBQXRCLElBQThCZ0IsWUFBWSxRQUE5QyxFQUNFLE9BQUtJLFFBQUwsR0FBZ0JGLE9BQWhCO0FBQ0EsaUJBQUtaLEtBQUw7QUFDSCxTQVREOztBQVdBLGVBQUtlLElBQUwsQ0FBVSxTQUFWLEVBQXFCTixFQUFyQixFQUF5QlAsT0FBekI7O0FBRUEsZUFBS0wsVUFBTCxJQUFtQixDQUFuQjtBQUNELE9BbkJlLENBQWhCOztBQXFCQSxXQUFLRCxNQUFMLENBQVlPLEdBQVosSUFBbUJHLE9BQW5CO0FBQ0EsYUFBT0EsT0FBUDtBQUNEOzs7RUF6R3NCVSxpQjs7QUE0R3pCQyx5QkFBZUMsUUFBZixDQUF3QjlCLFVBQXhCLEVBQW9DSSxVQUFwQzs7a0JBRWVBLFUiLCJmaWxlIjoiRmlsZVN5c3RlbS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpmaWxlLXN5c3RlbSc7XG5jb25zdCBpc1N0cmluZyA9ICh2YWx1ZSkgPT4gKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgfHwgdmFsdWUgaW5zdGFuY2VvZiBTdHJpbmcpO1xuXG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgY2xpZW50IGAnZmlsZS1zeXN0ZW0nYCBzZXJ2aWNlLlxuICpcbiAqIFRoaXMgc2VydmljZSBhbGxvdyB0byByZXRyaWV2ZSBhIGxpc3Qgb2YgZmlsZXMgb3IgZGlyZWN0b3JpZXMgZnJvbSBhIGdpdmVuIHBhdGguXG4gKiBJZiBhIGBsaXN0YCBvcHRpb24gaXMgZ2l2ZW4gd2hlbiByZXF1aXJpbmcgdGhlIHNlcnZpY2UsIHRoZSBzZXJ2aWNlIG1hcmtzXG4gKiBpdHNlbGYgYXMgYHJlYWR5YCB3aGVuIHRoZSBmaWxlIGxpc3QgaXMgcmV0dXJuZWQgYnkgdGhlIHNlcnZlci5cbiAqIFRoZSBzZXJ2aWNlIGNhbiBiZSB1c2VkIGxhdGVyIHRvIHJldHJpZXZlIG5ldyBmaWxlIGxpc3RzLCBlYWNoIHJlcXVpcmVkIGxpc3QgaXNcbiAqIGNhY2hlZCBjbGllbnQtc2lkZSB0byBwcmV2ZW50IHVzZWxlc3MgbmV0d29yayB0cmFmZmljLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge1N0cmluZ3xtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuRmlsZVN5c3RlbX5MaXN0Q29uZmlnfEFycmF5PFN0cmluZz58QXJyYXk8bW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkZpbGVTeXN0ZW1+TGlzdENvbmZpZz59IG9wdGlvbi5saXN0IC1cbiAqICBMaXN0IHRvXG4gKlxuICogX18qVGhlIHNlcnZpY2UgbXVzdCBiZSB1c2VkIHdpdGggaXRzIFtjbGllbnQtc2lkZSBjb3VudGVycGFydF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkZpbGVTeXN0ZW19Kl9fXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQGV4YW1wbGVcbiAqIC8vIHJlcXVpcmUgYW5kIGNvbmZpZ3VyZSB0aGUgYGZpbGUtc3lzdGVtYCBzZXJ2aWNlIGluc2lkZSB0aGUgZXhwZXJpZW5jZVxuICogLy8gY29uc3RydWN0b3IsIHRoZSBmaWxlIGxpc3QgdG8gYmUgcmV0cml2ZSBjYW4gYmUgY29uZmlndXJlZCBhcyBhIHNpbXBsZSBzdHJpbmdcbiAqIHRoaXMuZmlsZVN5c3RlbSA9IHRoaXMucmVxdWlyZSgnZmlsZS1zeXN0ZW0nLCB7IGxpc3Q6ICdhdWRpbycgfSk7XG4gKiAvLyAuLi4gb3IgYXMgYSBmdWxsIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuRmlsZVN5c3RlbX5MaXN0Q29uZmlnfVxuICogLy8gb2JqZWN0IGZvciBiZXR0ZXIgY29udHJvbCBvdmVyIHRoZSByZXR1cm5lZCBmaWxlIGxpc3RcbiAqIHRoaXMuZmlsZVN5c3RlbSA9IHRoaXMucmVxdWlyZSgnZmlsZS1zeXN0ZW0nLCB7IGxpc3Q6IHtcbiAqICAgICBwYXRoOiAnYXVkaW8nLFxuICogICAgIG1hdGNoOiAvXFwud2F2JC8sXG4gKiAgICAgcmVjdXJzaXZlOiB0cnVlLFxuICogICB9XG4gKiB9KTtcbiAqXG4gKiAvLyBnaXZlbiB0aGUgZm9sbG93aW5nIGZpbGUgc3lzdGVtXG4gKiAvLyBhdWRpby9cbiAqIC8vICAgdm9pY2UubXAzXG4gKiAvLyAgIHZvaWNlLndhdlxuICogLy8gICBkcnVtL1xuICogLy8gICAgIGtpY2subXAzXG4gKiAvLyAgICAga2ljay53YXZcbiAqIC8vIHRoZSBmaXJzdCBxdWVyeSB3aWxsIHJldHVybiB0aGUgZm9sbG93aW5nIHJlc3VsdDpcbiAqID4gWycvYXVkaW8vdm9pY2UubXAzJywgJ2F1ZGlvL3ZvaWNlLndhdiddXG4gKiAvLyB3aGlsZSB0aGUgc2Vjb25kIG9uZSB3aWxsIHJldHVybjpcbiAqID4gWycvYXVkaW8vdm9pY2Uud2F2JywgJ2F1ZGlvL2RydW0va2ljay53YXYnXVxuICpcbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5GaWxlU3lzdGVtfkxpc3RDb25maWd9XG4gKi9cbmNsYXNzIEZpbGVTeXN0ZW0gZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgLyoqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmUgaW5zdGFuY2lhdGVkIG1hbnVhbGx5XyAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCB0cnVlKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0geyBsaXN0OiBudWxsIH07XG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuXG4gICAgdGhpcy5fY2FjaGUgPSB7fTtcbiAgICAvLyBhcyBmaWxlIHN5c3RlbSBpcyBhc3luYyAoc2VydmVyIHNpZGUpLCBub3RoaW5nIGd1YXJhbnRlZXMgcmVzcG9uc2Ugb3JkZXJcbiAgICB0aGlzLl9yZXF1ZXN0SWQgPSAwO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMubGlzdCAhPT0gbnVsbClcbiAgICAgIHRoaXMuZ2V0TGlzdCh0aGlzLm9wdGlvbnMubGlzdCk7XG4gICAgZWxzZVxuICAgICAgdGhpcy5yZWFkeSgpO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICBzdXBlci5zdG9wKCk7XG4gIH1cblxuICAvKipcbiAgICogQHR5cGVkZWYge09iamVjdH0gbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkZpbGVTeXN0ZW1+TGlzdENvbmZpZ1xuICAgKiBAcHJvcGVydHkge1N0cmluZ30gcGF0aCAtIE5hbWUgb2YgdGhlIGZvbGRlciB0byBzZWFyY2ggaW50by5cbiAgICogQHByb3BlcnR5IHtSZWdFeHB9IFttYXRjaD0nKiddIC0gUmVnRXhwIHVzZWQgdG8gZmlsdGVyIHRoZSByZXN1bHRzLlxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IFtyZWN1cnNpdmU9ZmFsc2VdIC0gRmxhZyB3aGV0aGVyIHRoZSBzZWFyY2ggc2hvdWxkIGJlXG4gICAqICByZWN1cnNpdmUuXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gW2RpcmVjdG9yaWVzPWZhbHNlXSAtIElmIHRydWUgb25seSByZXR1cm4gZGlyZWN0b3JpZXMsXG4gICAqICBmaWxlcyBvdGhlcndpc2UuXG4gICAqL1xuICAvKipcbiAgICogUmV0dXJuIGEgbGlzdCBvZiBmaWxlIGFjY29yZGluZyB0byB0aGUgZ2l2ZW4gY29uZmlndXJhdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd8bW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkZpbGVTeXN0ZW1+TGlzdENvbmZpZ3xBcnJheTxTdHJpbmc+fEFycmF5PG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5GaWxlU3lzdGVtfkxpc3RDb25maWc+fSBjb25maWcgLVxuICAgKiAgRGV0YWlscyBvZiB0aGUgcmVxdWVzdGVkIGxpc3QocykuIFRoZSByZXF1ZXN0ZWQgZmlsZXMgb3IgZGlyZWN0b3JpZXMgbXVzdFxuICAgKiAgYmUgcHVibGljbHkgYWNjZXNzaWJsZS5cbiAgICogQHJldHVybiB7UHJvbWlzZTxBcnJheT58UHJvbWlzZTxBcnJheTxBcnJheT4+fSAtIFByb21pc2UgcmVzb2x2aW5nIHdpdGggYW5cbiAgICogIGFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIGFic29sdXRlIHVybHMgb2YgdGhlIGZpbGVzIG9yIGRpcmVjdG9yaWVzLlxuICAgKiAgSWYgYGNvbmZpZ2AgaXMgYW4gYXJyYXksIHRoZSByZXN1bHRzIHdpbGwgYmUgYW4gYXJyYXkgb2YgYXJyYXlzXG4gICAqICBjb250YWluaW5nIHRoZSByZXN1bHQgb2YgZWFjaCBkaWZmZXJlbnQgcmVxdWVzdC5cbiAgICpcbiAgICogQGV4YW1wbGU6XG4gICAqIC8vIDEuIFNpbmdsZSBsaXN0XG4gICAqIC8vIHJldHJpZXZlIGFsbCB0aGUgZmlsZSBpbiBhIGZvbGRlclxuICAgKiBmaWxlU3lzdGVtLmdldExpc3QoJ215LWRpcmVjdG9yeScpLnRoZW4oKGxpc3QpID0+IC4uLiApO1xuICAgKiAvLyBvciwgcmV0cmlldmUgYWxsIHRoZSBgLndhdmAgZmlsZXMgaW5zaWRlIGEgZ2l2ZW4gZm9sZGVyLFxuICAgKiAvL3NlYXJjaCByZWN1cnNpdmVseVxuICAgKiBmaWxlU3lzdGVtLmdldExpc3Qoe1xuICAgKiAgIHBhdGg6ICdteS1kaXJlY3RvcnknLFxuICAgKiAgIG1hdGNoOiAvXFwud2F2LyxcbiAgICogICByZWN1cnNpdmU6IHRydWUsXG4gICAqIH0pLnRoZW4oKGxpc3QpID0+IC4uLiApO1xuICAgKlxuICAgKiAvLyAyLiBNdWx0aXBsZSBSZXF1ZXN0c1xuICAgKiAvLyByZXRyaWV2ZSBhbGwgdGhlIGZpbGUgaW4gMiBkaWZmZXJlbnQgZm9sZGVycywgdGhlIHJldHVybmVkIHZhbHVlIHdpbGwgYmVcbiAgICogLy8gYW4gYXJyYXkgY29udGFpbmluZyB0aGUgMiBsaXN0c1xuICAgKiBmaWxlU3lzdGVtLmdldExpc3QoWydteS1kaXJlY3RvcnkxJywgJ215LWRpcmVjdG9yeTInXSlcbiAgICogICAudGhlbigobGlzdHMpID0+IC4uLiApO1xuICAgKiAvLyBvclxuICAgKiBmaWxlU3lzdGVtLmdldExpc3QoW3sgLi4uIH0sIHsgLi4uIH1dKVxuICAgKiAgIC50aGVuKChsaXN0cykgPT4gLi4uICk7XG4gICAqL1xuICBnZXRMaXN0KGNvbmZpZykge1xuICAgIC8vIHNlcmlhbGl6ZSB0aGUganNvbiBjb25maWcgdG8gcHJvcGVybHkgaGFuZGxlIFJlZ0V4cCwgYWRhcHRlZCBmcm9tOlxuICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTIwNzU5Mjcvc2VyaWFsaXphdGlvbi1vZi1yZWdleHAjYW5zd2VyLTMzNDE2Njg0XG4gICAgY29uc3QgX2NvbmZpZyA9IEpTT04uc3RyaW5naWZ5KGNvbmZpZywgZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgUmVnRXhwKVxuICAgICAgICByZXR1cm4gYF9fUkVHRVhQICR7dmFsdWUudG9TdHJpbmcoKX1gO1xuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfSk7XG5cbiAgICBjb25zdCBrZXkgPSBpc1N0cmluZyhjb25maWcpID8gY29uZmlnIDogX2NvbmZpZztcblxuICAgIGlmICh0aGlzLl9jYWNoZVtrZXldKVxuICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlW2tleV07XG5cbiAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgaWQgPSB0aGlzLl9yZXF1ZXN0SWQ7XG4gICAgICBjb25zdCBjaGFubmVsID0gYGxpc3Q6JHtpZH1gO1xuICAgICAgdGhpcy5fcmVxdWVzdElkICs9IDE7XG5cbiAgICAgIHRoaXMucmVjZWl2ZShjaGFubmVsLCAocmVzdWx0cykgPT4ge1xuICAgICAgICAvLyBAbm90ZSAtIHNvY2tldC5pbyByZW1vdmUgdGhlIGZpcnN0IGxpc3RlbmVyIGlmIG5vIGZ1bmMgYXJndW1lbnQgZ2l2ZW5cbiAgICAgICAgLy8gICAgICAgICBzaG91bGQgYmUgZG9uZSBwcm9wZXJseSAtPiB1cGRhdGUgc29ja2V0IGFuZCBBY3Rpdml0eVxuICAgICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKGNoYW5uZWwpO1xuICAgICAgICByZXNvbHZlKHJlc3VsdHMpO1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMubGlzdCAhPT0gbnVsbCAmJiBjaGFubmVsID09PSAnbGlzdDowJylcbiAgICAgICAgICB0aGlzLmZpbGVMaXN0ID0gcmVzdWx0cztcbiAgICAgICAgICB0aGlzLnJlYWR5KCk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5zZW5kKCdyZXF1ZXN0JywgaWQsIF9jb25maWcpO1xuXG4gICAgICB0aGlzLl9yZXF1ZXN0SWQgKz0gMTtcbiAgICB9KTtcblxuICAgIHRoaXMuX2NhY2hlW2tleV0gPSBwcm9taXNlO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIEZpbGVTeXN0ZW0pO1xuXG5leHBvcnQgZGVmYXVsdCBGaWxlU3lzdGVtO1xuIl19