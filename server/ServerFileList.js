'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _ServerModule2 = require('./ServerModule');

var _ServerModule3 = _interopRequireDefault(_ServerModule2);

function checkForExtensions(file, extensions) {
  if (!extensions || extensions.length === 0) return true;

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = _getIterator(extensions), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var extension = _step.value;

      var extensionIndex = file.length - extension.length;

      if (extensionIndex >= 0 && file.substring(extensionIndex, extensionIndex + extension.length) === extension) return true;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator['return']) {
        _iterator['return']();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return false;
}

/**
 * Retrieve a list of files on the server in the public folder upon request of the client.
 *
 * (See also {@link src/client/ClientFileList.js~ClientFileList} on the client side.)
 */

var ServerFileList = (function (_ServerModule) {
  _inherits(ServerFileList, _ServerModule);

  /**
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='filelist'] Name of the module.
   */

  function ServerFileList() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ServerFileList);

    _get(Object.getPrototypeOf(ServerFileList.prototype), 'constructor', this).call(this, options.name || 'filelist');
  }

  /**
   * @private
   */

  _createClass(ServerFileList, [{
    key: 'connect',
    value: function connect(client) {
      var _this = this;

      _get(Object.getPrototypeOf(ServerFileList.prototype), 'connect', this).call(this, client);

      this.receive(client, 'request', function (subfolder, extensions) {
        var directory = _path2['default'].join(_this.appConfig.publicFolder, subfolder);
        var filesList = [];
        // @todo remove hardcoded path - global config ?
        _fs2['default'].readdir(directory, function (err, files) {
          if (err) throw err;

          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = _getIterator(files), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var file = _step2.value;

              if (file[0] !== '.' && checkForExtensions(file, extensions)) filesList.push(file);
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                _iterator2['return']();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }

          _this.send(client, 'files', filesList);
        });
      });
    }
  }]);

  return ServerFileList;
})(_ServerModule3['default']);

exports['default'] = ServerFileList;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9zZXJ2ZXIvU2VydmVyRmlsZUxpc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O2tCQUFlLElBQUk7Ozs7b0JBQ0YsTUFBTTs7Ozs2QkFDRSxnQkFBZ0I7Ozs7QUFFekMsU0FBUyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO0FBQzVDLE1BQUksQ0FBQyxVQUFVLElBQUksVUFBVSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQ3hDLE9BQU8sSUFBSSxDQUFDOzs7Ozs7O0FBRWQsc0NBQXNCLFVBQVUsNEdBQUU7VUFBekIsU0FBUzs7QUFDaEIsVUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDOztBQUVwRCxVQUFJLGNBQWMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsY0FBYyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxTQUFTLEVBQ3hHLE9BQU8sSUFBSSxDQUFDO0tBQ2Y7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFRCxTQUFPLEtBQUssQ0FBQztDQUNkOzs7Ozs7OztJQU9vQixjQUFjO1lBQWQsY0FBYzs7Ozs7OztBQUt0QixXQUxRLGNBQWMsR0FLUDtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBTEwsY0FBYzs7QUFNL0IsK0JBTmlCLGNBQWMsNkNBTXpCLE9BQU8sQ0FBQyxJQUFJLElBQUksVUFBVSxFQUFFO0dBQ25DOzs7Ozs7ZUFQa0IsY0FBYzs7V0FZMUIsaUJBQUMsTUFBTSxFQUFFOzs7QUFDZCxpQ0FiaUIsY0FBYyx5Q0FhakIsTUFBTSxFQUFFOztBQUV0QixVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsVUFBQyxTQUFTLEVBQUUsVUFBVSxFQUFLO0FBQ3pELFlBQU0sU0FBUyxHQUFHLGtCQUFLLElBQUksQ0FBQyxNQUFLLFNBQVMsQ0FBQyxZQUFZLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDcEUsWUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDOztBQUVyQix3QkFBRyxPQUFPLENBQUMsU0FBUyxFQUFFLFVBQUMsR0FBRyxFQUFFLEtBQUssRUFBSztBQUNwQyxjQUFJLEdBQUcsRUFBRSxNQUFNLEdBQUcsQ0FBQzs7Ozs7OztBQUVuQiwrQ0FBaUIsS0FBSyxpSEFBRTtrQkFBZixJQUFJOztBQUNYLGtCQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksa0JBQWtCLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxFQUN6RCxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3hCOzs7Ozs7Ozs7Ozs7Ozs7O0FBRUQsZ0JBQUssSUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7U0FDdkMsQ0FBQyxDQUFDO09BQ0osQ0FBQyxDQUFDO0tBQ0o7OztTQTlCa0IsY0FBYzs7O3FCQUFkLGNBQWMiLCJmaWxlIjoiL1VzZXJzL21hdHVzemV3c2tpL2Rldi9jb3NpbWEvbGliL3NvdW5kd29ya3Mvc3JjL3NlcnZlci9TZXJ2ZXJGaWxlTGlzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBTZXJ2ZXJNb2R1bGUgZnJvbSAnLi9TZXJ2ZXJNb2R1bGUnO1xuXG5mdW5jdGlvbiBjaGVja0ZvckV4dGVuc2lvbnMoZmlsZSwgZXh0ZW5zaW9ucykge1xuICBpZiAoIWV4dGVuc2lvbnMgfHwgZXh0ZW5zaW9ucy5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgZm9yIChsZXQgZXh0ZW5zaW9uIG9mIGV4dGVuc2lvbnMpIHtcbiAgICBsZXQgZXh0ZW5zaW9uSW5kZXggPSBmaWxlLmxlbmd0aCAtIGV4dGVuc2lvbi5sZW5ndGg7XG5cbiAgICBpZiAoZXh0ZW5zaW9uSW5kZXggPj0gMCAmJiBmaWxlLnN1YnN0cmluZyhleHRlbnNpb25JbmRleCwgZXh0ZW5zaW9uSW5kZXggKyBleHRlbnNpb24ubGVuZ3RoKSA9PT0gZXh0ZW5zaW9uKVxuICAgICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogUmV0cmlldmUgYSBsaXN0IG9mIGZpbGVzIG9uIHRoZSBzZXJ2ZXIgaW4gdGhlIHB1YmxpYyBmb2xkZXIgdXBvbiByZXF1ZXN0IG9mIHRoZSBjbGllbnQuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvY2xpZW50L0NsaWVudEZpbGVMaXN0LmpzfkNsaWVudEZpbGVMaXN0fSBvbiB0aGUgY2xpZW50IHNpZGUuKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2ZXJGaWxlTGlzdCBleHRlbmRzIFNlcnZlck1vZHVsZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdmaWxlbGlzdCddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnZmlsZWxpc3QnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAncmVxdWVzdCcsIChzdWJmb2xkZXIsIGV4dGVuc2lvbnMpID0+IHtcbiAgICAgIGNvbnN0IGRpcmVjdG9yeSA9IHBhdGguam9pbih0aGlzLmFwcENvbmZpZy5wdWJsaWNGb2xkZXIsIHN1YmZvbGRlcik7XG4gICAgICBjb25zdCBmaWxlc0xpc3QgPSBbXTtcbiAgICAgIC8vIEB0b2RvIHJlbW92ZSBoYXJkY29kZWQgcGF0aCAtIGdsb2JhbCBjb25maWcgP1xuICAgICAgZnMucmVhZGRpcihkaXJlY3RvcnksIChlcnIsIGZpbGVzKSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcblxuICAgICAgICBmb3IgKGxldCBmaWxlIG9mIGZpbGVzKSB7XG4gICAgICAgICAgaWYgKGZpbGVbMF0gIT09ICcuJyAmJiBjaGVja0ZvckV4dGVuc2lvbnMoZmlsZSwgZXh0ZW5zaW9ucykpXG4gICAgICAgICAgICBmaWxlc0xpc3QucHVzaChmaWxlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2VuZChjbGllbnQsICdmaWxlcycsIGZpbGVzTGlzdCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuIl19