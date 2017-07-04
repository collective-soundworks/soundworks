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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZpbGVTeXN0ZW0uanMiXSwibmFtZXMiOlsiU0VSVklDRV9JRCIsImlzU3RyaW5nIiwidmFsdWUiLCJTdHJpbmciLCJGaWxlU3lzdGVtIiwiZGVmYXVsdHMiLCJsaXN0IiwiY29uZmlndXJlIiwiX2NhY2hlIiwiX3JlcXVlc3RJZCIsIm9wdGlvbnMiLCJnZXRMaXN0IiwicmVhZHkiLCJjb25maWciLCJfY29uZmlnIiwia2V5IiwiUmVnRXhwIiwidG9TdHJpbmciLCJwcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImlkIiwiY2hhbm5lbCIsInJlY2VpdmUiLCJyZXN1bHRzIiwicmVtb3ZlTGlzdGVuZXIiLCJmaWxlTGlzdCIsInNlbmQiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxhQUFhLHFCQUFuQjtBQUNBLElBQU1DLFdBQVcsU0FBWEEsUUFBVyxDQUFDQyxLQUFEO0FBQUEsU0FBWSxPQUFPQSxLQUFQLEtBQWlCLFFBQWpCLElBQTZCQSxpQkFBaUJDLE1BQTFEO0FBQUEsQ0FBakI7O0FBR0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBMkNNQyxVOzs7QUFDSjtBQUNBLHdCQUFjO0FBQUE7O0FBQUEsOElBQ05KLFVBRE0sRUFDTSxJQUROOztBQUdaLFFBQU1LLFdBQVcsRUFBRUMsTUFBTSxJQUFSLEVBQWpCO0FBQ0EsVUFBS0MsU0FBTCxDQUFlRixRQUFmOztBQUVBLFVBQUtHLE1BQUwsR0FBYyxFQUFkO0FBQ0E7QUFDQSxVQUFLQyxVQUFMLEdBQWtCLENBQWxCO0FBUlk7QUFTYjs7Ozs0QkFFTztBQUNOOztBQUVBLFVBQUksS0FBS0MsT0FBTCxDQUFhSixJQUFiLEtBQXNCLElBQTFCLEVBQ0UsS0FBS0ssT0FBTCxDQUFhLEtBQUtELE9BQUwsQ0FBYUosSUFBMUIsRUFERixLQUdFLEtBQUtNLEtBQUw7QUFDSDs7OzJCQUVNO0FBQ0w7QUFDRDs7QUFFRDs7Ozs7Ozs7O0FBU0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzRCQWdDUUMsTSxFQUFRO0FBQUE7O0FBQ2Q7QUFDQTtBQUNBLFVBQU1DLFVBQVUseUJBQWVELE1BQWYsRUFBdUIsVUFBU0UsR0FBVCxFQUFjYixLQUFkLEVBQXFCO0FBQzFELFlBQUlBLGlCQUFpQmMsTUFBckIsRUFDRSxxQkFBbUJkLE1BQU1lLFFBQU4sRUFBbkIsQ0FERixLQUdFLE9BQU9mLEtBQVA7QUFDSCxPQUxlLENBQWhCOztBQU9BLFVBQU1hLE1BQU1kLFNBQVNZLE1BQVQsSUFBbUJBLE1BQW5CLEdBQTRCQyxPQUF4Qzs7QUFFQSxVQUFJLEtBQUtOLE1BQUwsQ0FBWU8sR0FBWixDQUFKLEVBQ0UsT0FBTyxLQUFLUCxNQUFMLENBQVlPLEdBQVosQ0FBUDs7QUFFRixVQUFNRyxVQUFVLHNCQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUMvQyxZQUFNQyxLQUFLLE9BQUtaLFVBQWhCO0FBQ0EsWUFBTWEsb0JBQWtCRCxFQUF4QjtBQUNBLGVBQUtaLFVBQUwsSUFBbUIsQ0FBbkI7O0FBRUEsZUFBS2MsT0FBTCxDQUFhRCxPQUFiLEVBQXNCLFVBQUNFLE9BQUQsRUFBYTtBQUNqQztBQUNBO0FBQ0EsaUJBQUtDLGNBQUwsQ0FBb0JILE9BQXBCO0FBQ0FILGtCQUFRSyxPQUFSOztBQUVBLGNBQUksT0FBS2QsT0FBTCxDQUFhSixJQUFiLEtBQXNCLElBQXRCLElBQThCZ0IsWUFBWSxRQUE5QyxFQUNFLE9BQUtJLFFBQUwsR0FBZ0JGLE9BQWhCO0FBQ0EsaUJBQUtaLEtBQUw7QUFDSCxTQVREOztBQVdBLGVBQUtlLElBQUwsQ0FBVSxTQUFWLEVBQXFCTixFQUFyQixFQUF5QlAsT0FBekI7O0FBRUEsZUFBS0wsVUFBTCxJQUFtQixDQUFuQjtBQUNELE9BbkJlLENBQWhCOztBQXFCQSxXQUFLRCxNQUFMLENBQVlPLEdBQVosSUFBbUJHLE9BQW5CO0FBQ0EsYUFBT0EsT0FBUDtBQUNEOzs7OztBQUdILHlCQUFlVSxRQUFmLENBQXdCNUIsVUFBeEIsRUFBb0NJLFVBQXBDOztrQkFFZUEsVSIsImZpbGUiOiJGaWxlU3lzdGVtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOmZpbGUtc3lzdGVtJztcbmNvbnN0IGlzU3RyaW5nID0gKHZhbHVlKSA9PiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyB8fCB2YWx1ZSBpbnN0YW5jZW9mIFN0cmluZyk7XG5cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBjbGllbnQgYCdmaWxlLXN5c3RlbSdgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIGFsbG93IHRvIHJldHJpZXZlIGEgbGlzdCBvZiBmaWxlcyBvciBkaXJlY3RvcmllcyBmcm9tIGEgZ2l2ZW4gcGF0aC5cbiAqIElmIGEgYGxpc3RgIG9wdGlvbiBpcyBnaXZlbiB3aGVuIHJlcXVpcmluZyB0aGUgc2VydmljZSwgdGhlIHNlcnZpY2UgbWFya3NcbiAqIGl0c2VsZiBhcyBgcmVhZHlgIHdoZW4gdGhlIGZpbGUgbGlzdCBpcyByZXR1cm5lZCBieSB0aGUgc2VydmVyLlxuICogVGhlIHNlcnZpY2UgY2FuIGJlIHVzZWQgbGF0ZXIgdG8gcmV0cmlldmUgbmV3IGZpbGUgbGlzdHMsIGVhY2ggcmVxdWlyZWQgbGlzdCBpc1xuICogY2FjaGVkIGNsaWVudC1zaWRlIHRvIHByZXZlbnQgdXNlbGVzcyBuZXR3b3JrIHRyYWZmaWMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7U3RyaW5nfG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5GaWxlU3lzdGVtfkxpc3RDb25maWd8QXJyYXk8U3RyaW5nPnxBcnJheTxtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuRmlsZVN5c3RlbX5MaXN0Q29uZmlnPn0gb3B0aW9uLmxpc3QgLVxuICogIExpc3QgdG9cbiAqXG4gKiBfXypUaGUgc2VydmljZSBtdXN0IGJlIHVzZWQgd2l0aCBpdHMgW2NsaWVudC1zaWRlIGNvdW50ZXJwYXJ0XXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuRmlsZVN5c3RlbX0qX19cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAZXhhbXBsZVxuICogLy8gcmVxdWlyZSBhbmQgY29uZmlndXJlIHRoZSBgZmlsZS1zeXN0ZW1gIHNlcnZpY2UgaW5zaWRlIHRoZSBleHBlcmllbmNlXG4gKiAvLyBjb25zdHJ1Y3RvciwgdGhlIGZpbGUgbGlzdCB0byBiZSByZXRyaXZlIGNhbiBiZSBjb25maWd1cmVkIGFzIGEgc2ltcGxlIHN0cmluZ1xuICogdGhpcy5maWxlU3lzdGVtID0gdGhpcy5yZXF1aXJlKCdmaWxlLXN5c3RlbScsIHsgbGlzdDogJ2F1ZGlvJyB9KTtcbiAqIC8vIC4uLiBvciBhcyBhIGZ1bGwge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5GaWxlU3lzdGVtfkxpc3RDb25maWd9XG4gKiAvLyBvYmplY3QgZm9yIGJldHRlciBjb250cm9sIG92ZXIgdGhlIHJldHVybmVkIGZpbGUgbGlzdFxuICogdGhpcy5maWxlU3lzdGVtID0gdGhpcy5yZXF1aXJlKCdmaWxlLXN5c3RlbScsIHsgbGlzdDoge1xuICogICAgIHBhdGg6ICdhdWRpbycsXG4gKiAgICAgbWF0Y2g6IC9cXC53YXYkLyxcbiAqICAgICByZWN1cnNpdmU6IHRydWUsXG4gKiAgIH1cbiAqIH0pO1xuICpcbiAqIC8vIGdpdmVuIHRoZSBmb2xsb3dpbmcgZmlsZSBzeXN0ZW1cbiAqIC8vIGF1ZGlvL1xuICogLy8gICB2b2ljZS5tcDNcbiAqIC8vICAgdm9pY2Uud2F2XG4gKiAvLyAgIGRydW0vXG4gKiAvLyAgICAga2ljay5tcDNcbiAqIC8vICAgICBraWNrLndhdlxuICogLy8gdGhlIGZpcnN0IHF1ZXJ5IHdpbGwgcmV0dXJuIHRoZSBmb2xsb3dpbmcgcmVzdWx0OlxuICogPiBbJy9hdWRpby92b2ljZS5tcDMnLCAnYXVkaW8vdm9pY2Uud2F2J11cbiAqIC8vIHdoaWxlIHRoZSBzZWNvbmQgb25lIHdpbGwgcmV0dXJuOlxuICogPiBbJy9hdWRpby92b2ljZS53YXYnLCAnYXVkaW8vZHJ1bS9raWNrLndhdiddXG4gKlxuICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkZpbGVTeXN0ZW1+TGlzdENvbmZpZ31cbiAqL1xuY2xhc3MgRmlsZVN5c3RlbSBleHRlbmRzIFNlcnZpY2Uge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIHRydWUpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7IGxpc3Q6IG51bGwgfTtcbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICB0aGlzLl9jYWNoZSA9IHt9O1xuICAgIC8vIGFzIGZpbGUgc3lzdGVtIGlzIGFzeW5jIChzZXJ2ZXIgc2lkZSksIG5vdGhpbmcgZ3VhcmFudGVlcyByZXNwb25zZSBvcmRlclxuICAgIHRoaXMuX3JlcXVlc3RJZCA9IDA7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5saXN0ICE9PSBudWxsKVxuICAgICAgdGhpcy5nZXRMaXN0KHRoaXMub3B0aW9ucy5saXN0KTtcbiAgICBlbHNlXG4gICAgICB0aGlzLnJlYWR5KCk7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHN1cGVyLnN0b3AoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiB7T2JqZWN0fSBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuRmlsZVN5c3RlbX5MaXN0Q29uZmlnXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBwYXRoIC0gTmFtZSBvZiB0aGUgZm9sZGVyIHRvIHNlYXJjaCBpbnRvLlxuICAgKiBAcHJvcGVydHkge1JlZ0V4cH0gW21hdGNoPScqJ10gLSBSZWdFeHAgdXNlZCB0byBmaWx0ZXIgdGhlIHJlc3VsdHMuXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gW3JlY3Vyc2l2ZT1mYWxzZV0gLSBGbGFnIHdoZXRoZXIgdGhlIHNlYXJjaCBzaG91bGQgYmVcbiAgICogIHJlY3Vyc2l2ZS5cbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBbZGlyZWN0b3JpZXM9ZmFsc2VdIC0gSWYgdHJ1ZSBvbmx5IHJldHVybiBkaXJlY3RvcmllcyxcbiAgICogIGZpbGVzIG90aGVyd2lzZS5cbiAgICovXG4gIC8qKlxuICAgKiBSZXR1cm4gYSBsaXN0IG9mIGZpbGUgYWNjb3JkaW5nIHRvIHRoZSBnaXZlbiBjb25maWd1cmF0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ3xtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuRmlsZVN5c3RlbX5MaXN0Q29uZmlnfEFycmF5PFN0cmluZz58QXJyYXk8bW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkZpbGVTeXN0ZW1+TGlzdENvbmZpZz59IGNvbmZpZyAtXG4gICAqICBEZXRhaWxzIG9mIHRoZSByZXF1ZXN0ZWQgbGlzdChzKS4gVGhlIHJlcXVlc3RlZCBmaWxlcyBvciBkaXJlY3RvcmllcyBtdXN0XG4gICAqICBiZSBwdWJsaWNseSBhY2Nlc3NpYmxlLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlPEFycmF5PnxQcm9taXNlPEFycmF5PEFycmF5Pj59IC0gUHJvbWlzZSByZXNvbHZpbmcgd2l0aCBhblxuICAgKiAgYW4gYXJyYXkgY29udGFpbmluZyB0aGUgYWJzb2x1dGUgdXJscyBvZiB0aGUgZmlsZXMgb3IgZGlyZWN0b3JpZXMuXG4gICAqICBJZiBgY29uZmlnYCBpcyBhbiBhcnJheSwgdGhlIHJlc3VsdHMgd2lsbCBiZSBhbiBhcnJheSBvZiBhcnJheXNcbiAgICogIGNvbnRhaW5pbmcgdGhlIHJlc3VsdCBvZiBlYWNoIGRpZmZlcmVudCByZXF1ZXN0LlxuICAgKlxuICAgKiBAZXhhbXBsZTpcbiAgICogLy8gMS4gU2luZ2xlIGxpc3RcbiAgICogLy8gcmV0cmlldmUgYWxsIHRoZSBmaWxlIGluIGEgZm9sZGVyXG4gICAqIGZpbGVTeXN0ZW0uZ2V0TGlzdCgnbXktZGlyZWN0b3J5JykudGhlbigobGlzdCkgPT4gLi4uICk7XG4gICAqIC8vIG9yLCByZXRyaWV2ZSBhbGwgdGhlIGAud2F2YCBmaWxlcyBpbnNpZGUgYSBnaXZlbiBmb2xkZXIsXG4gICAqIC8vc2VhcmNoIHJlY3Vyc2l2ZWx5XG4gICAqIGZpbGVTeXN0ZW0uZ2V0TGlzdCh7XG4gICAqICAgcGF0aDogJ215LWRpcmVjdG9yeScsXG4gICAqICAgbWF0Y2g6IC9cXC53YXYvLFxuICAgKiAgIHJlY3Vyc2l2ZTogdHJ1ZSxcbiAgICogfSkudGhlbigobGlzdCkgPT4gLi4uICk7XG4gICAqXG4gICAqIC8vIDIuIE11bHRpcGxlIFJlcXVlc3RzXG4gICAqIC8vIHJldHJpZXZlIGFsbCB0aGUgZmlsZSBpbiAyIGRpZmZlcmVudCBmb2xkZXJzLCB0aGUgcmV0dXJuZWQgdmFsdWUgd2lsbCBiZVxuICAgKiAvLyBhbiBhcnJheSBjb250YWluaW5nIHRoZSAyIGxpc3RzXG4gICAqIGZpbGVTeXN0ZW0uZ2V0TGlzdChbJ215LWRpcmVjdG9yeTEnLCAnbXktZGlyZWN0b3J5MiddKVxuICAgKiAgIC50aGVuKChsaXN0cykgPT4gLi4uICk7XG4gICAqIC8vIG9yXG4gICAqIGZpbGVTeXN0ZW0uZ2V0TGlzdChbeyAuLi4gfSwgeyAuLi4gfV0pXG4gICAqICAgLnRoZW4oKGxpc3RzKSA9PiAuLi4gKTtcbiAgICovXG4gIGdldExpc3QoY29uZmlnKSB7XG4gICAgLy8gc2VyaWFsaXplIHRoZSBqc29uIGNvbmZpZyB0byBwcm9wZXJseSBoYW5kbGUgUmVnRXhwLCBhZGFwdGVkIGZyb206XG4gICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMjA3NTkyNy9zZXJpYWxpemF0aW9uLW9mLXJlZ2V4cCNhbnN3ZXItMzM0MTY2ODRcbiAgICBjb25zdCBfY29uZmlnID0gSlNPTi5zdHJpbmdpZnkoY29uZmlnLCBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG4gICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBSZWdFeHApXG4gICAgICAgIHJldHVybiBgX19SRUdFWFAgJHt2YWx1ZS50b1N0cmluZygpfWA7XG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGtleSA9IGlzU3RyaW5nKGNvbmZpZykgPyBjb25maWcgOiBfY29uZmlnO1xuXG4gICAgaWYgKHRoaXMuX2NhY2hlW2tleV0pXG4gICAgICByZXR1cm4gdGhpcy5fY2FjaGVba2V5XTtcblxuICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBpZCA9IHRoaXMuX3JlcXVlc3RJZDtcbiAgICAgIGNvbnN0IGNoYW5uZWwgPSBgbGlzdDoke2lkfWA7XG4gICAgICB0aGlzLl9yZXF1ZXN0SWQgKz0gMTtcblxuICAgICAgdGhpcy5yZWNlaXZlKGNoYW5uZWwsIChyZXN1bHRzKSA9PiB7XG4gICAgICAgIC8vIEBub3RlIC0gc29ja2V0LmlvIHJlbW92ZSB0aGUgZmlyc3QgbGlzdGVuZXIgaWYgbm8gZnVuYyBhcmd1bWVudCBnaXZlblxuICAgICAgICAvLyAgICAgICAgIHNob3VsZCBiZSBkb25lIHByb3Blcmx5IC0+IHVwZGF0ZSBzb2NrZXQgYW5kIEFjdGl2aXR5XG4gICAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoY2hhbm5lbCk7XG4gICAgICAgIHJlc29sdmUocmVzdWx0cyk7XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5saXN0ICE9PSBudWxsICYmIGNoYW5uZWwgPT09ICdsaXN0OjAnKVxuICAgICAgICAgIHRoaXMuZmlsZUxpc3QgPSByZXN1bHRzO1xuICAgICAgICAgIHRoaXMucmVhZHkoKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLnNlbmQoJ3JlcXVlc3QnLCBpZCwgX2NvbmZpZyk7XG5cbiAgICAgIHRoaXMuX3JlcXVlc3RJZCArPSAxO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fY2FjaGVba2V5XSA9IHByb21pc2U7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgRmlsZVN5c3RlbSk7XG5cbmV4cG9ydCBkZWZhdWx0IEZpbGVTeXN0ZW07XG4iXX0=