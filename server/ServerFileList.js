'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _ServerModule2 = require('./ServerModule');

var _ServerModule3 = _interopRequireDefault(_ServerModule2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function checkForExtensions(file, extensions) {
  if (!extensions || extensions.length === 0) return true;

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = (0, _getIterator3.default)(extensions), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var extension = _step.value;

      var extensionIndex = file.length - extension.length;

      if (extensionIndex >= 0 && file.substring(extensionIndex, extensionIndex + extension.length) === extension) return true;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
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

var ServerFileList = function (_ServerModule) {
  (0, _inherits3.default)(ServerFileList, _ServerModule);

  /**
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='filelist'] Name of the module.
   */

  function ServerFileList() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    (0, _classCallCheck3.default)(this, ServerFileList);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ServerFileList).call(this, options.name || 'filelist'));
  }

  /**
   * @private
   */


  (0, _createClass3.default)(ServerFileList, [{
    key: 'connect',
    value: function connect(client) {
      var _this2 = this;

      (0, _get3.default)((0, _getPrototypeOf2.default)(ServerFileList.prototype), 'connect', this).call(this, client);

      this.receive(client, 'request', function (subfolder, extensions) {
        var directory = _path2.default.join(_this2.appConfig.publicFolder, subfolder);
        var filesList = [];
        // @todo remove hardcoded path - global config ?
        _fs2.default.readdir(directory, function (err, files) {
          if (err) throw err;

          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = (0, _getIterator3.default)(files), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var file = _step2.value;

              if (file[0] !== '.' && checkForExtensions(file, extensions)) filesList.push(file);
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }

          _this2.send(client, 'files', filesList);
        });
      });
    }
  }]);
  return ServerFileList;
}(_ServerModule3.default);

exports.default = ServerFileList;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlcnZlckZpbGVMaXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLFNBQVMsa0JBQVQsQ0FBNEIsSUFBNUIsRUFBa0MsVUFBbEMsRUFBOEM7QUFDNUMsTUFBSSxDQUFDLFVBQUQsSUFBZSxXQUFXLE1BQVgsS0FBc0IsQ0FBdEIsRUFDakIsT0FBTyxJQUFQLENBREY7O3VDQUQ0Qzs7Ozs7QUFJNUMsb0RBQXNCLGtCQUF0QixvR0FBa0M7VUFBekIsd0JBQXlCOztBQUNoQyxVQUFJLGlCQUFpQixLQUFLLE1BQUwsR0FBYyxVQUFVLE1BQVYsQ0FESDs7QUFHaEMsVUFBSSxrQkFBa0IsQ0FBbEIsSUFBdUIsS0FBSyxTQUFMLENBQWUsY0FBZixFQUErQixpQkFBaUIsVUFBVSxNQUFWLENBQWhELEtBQXNFLFNBQXRFLEVBQ3pCLE9BQU8sSUFBUCxDQURGO0tBSEY7Ozs7Ozs7Ozs7Ozs7O0dBSjRDOztBQVc1QyxTQUFPLEtBQVAsQ0FYNEM7Q0FBOUM7Ozs7Ozs7O0lBbUJxQjs7Ozs7Ozs7QUFLbkIsV0FMbUIsY0FLbkIsR0FBMEI7UUFBZCxnRUFBVSxrQkFBSTt3Q0FMUCxnQkFLTzt3RkFMUCwyQkFNWCxRQUFRLElBQVIsSUFBZ0IsVUFBaEIsR0FEa0I7R0FBMUI7Ozs7Ozs7NkJBTG1COzs0QkFZWCxRQUFROzs7QUFDZCx1REFiaUIsdURBYUgsT0FBZCxDQURjOztBQUdkLFdBQUssT0FBTCxDQUFhLE1BQWIsRUFBcUIsU0FBckIsRUFBZ0MsVUFBQyxTQUFELEVBQVksVUFBWixFQUEyQjtBQUN6RCxZQUFNLFlBQVksZUFBSyxJQUFMLENBQVUsT0FBSyxTQUFMLENBQWUsWUFBZixFQUE2QixTQUF2QyxDQUFaLENBRG1EO0FBRXpELFlBQU0sWUFBWSxFQUFaOztBQUZtRCxvQkFJekQsQ0FBRyxPQUFILENBQVcsU0FBWCxFQUFzQixVQUFDLEdBQUQsRUFBTSxLQUFOLEVBQWdCO0FBQ3BDLGNBQUksR0FBSixFQUFTLE1BQU0sR0FBTixDQUFUOztnREFEb0M7Ozs7O0FBR3BDLDZEQUFpQixjQUFqQix3R0FBd0I7a0JBQWYsb0JBQWU7O0FBQ3RCLGtCQUFJLEtBQUssQ0FBTCxNQUFZLEdBQVosSUFBbUIsbUJBQW1CLElBQW5CLEVBQXlCLFVBQXpCLENBQW5CLEVBQ0YsVUFBVSxJQUFWLENBQWUsSUFBZixFQURGO2FBREY7Ozs7Ozs7Ozs7Ozs7O1dBSG9DOztBQVFwQyxpQkFBSyxJQUFMLENBQVUsTUFBVixFQUFrQixPQUFsQixFQUEyQixTQUEzQixFQVJvQztTQUFoQixDQUF0QixDQUp5RDtPQUEzQixDQUFoQyxDQUhjOzs7U0FaRyIsImZpbGUiOiJTZXJ2ZXJGaWxlTGlzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBTZXJ2ZXJNb2R1bGUgZnJvbSAnLi9TZXJ2ZXJNb2R1bGUnO1xuXG5mdW5jdGlvbiBjaGVja0ZvckV4dGVuc2lvbnMoZmlsZSwgZXh0ZW5zaW9ucykge1xuICBpZiAoIWV4dGVuc2lvbnMgfHwgZXh0ZW5zaW9ucy5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgZm9yIChsZXQgZXh0ZW5zaW9uIG9mIGV4dGVuc2lvbnMpIHtcbiAgICBsZXQgZXh0ZW5zaW9uSW5kZXggPSBmaWxlLmxlbmd0aCAtIGV4dGVuc2lvbi5sZW5ndGg7XG5cbiAgICBpZiAoZXh0ZW5zaW9uSW5kZXggPj0gMCAmJiBmaWxlLnN1YnN0cmluZyhleHRlbnNpb25JbmRleCwgZXh0ZW5zaW9uSW5kZXggKyBleHRlbnNpb24ubGVuZ3RoKSA9PT0gZXh0ZW5zaW9uKVxuICAgICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogUmV0cmlldmUgYSBsaXN0IG9mIGZpbGVzIG9uIHRoZSBzZXJ2ZXIgaW4gdGhlIHB1YmxpYyBmb2xkZXIgdXBvbiByZXF1ZXN0IG9mIHRoZSBjbGllbnQuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvY2xpZW50L0NsaWVudEZpbGVMaXN0LmpzfkNsaWVudEZpbGVMaXN0fSBvbiB0aGUgY2xpZW50IHNpZGUuKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2ZXJGaWxlTGlzdCBleHRlbmRzIFNlcnZlck1vZHVsZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdmaWxlbGlzdCddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnZmlsZWxpc3QnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAncmVxdWVzdCcsIChzdWJmb2xkZXIsIGV4dGVuc2lvbnMpID0+IHtcbiAgICAgIGNvbnN0IGRpcmVjdG9yeSA9IHBhdGguam9pbih0aGlzLmFwcENvbmZpZy5wdWJsaWNGb2xkZXIsIHN1YmZvbGRlcik7XG4gICAgICBjb25zdCBmaWxlc0xpc3QgPSBbXTtcbiAgICAgIC8vIEB0b2RvIHJlbW92ZSBoYXJkY29kZWQgcGF0aCAtIGdsb2JhbCBjb25maWcgP1xuICAgICAgZnMucmVhZGRpcihkaXJlY3RvcnksIChlcnIsIGZpbGVzKSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcblxuICAgICAgICBmb3IgKGxldCBmaWxlIG9mIGZpbGVzKSB7XG4gICAgICAgICAgaWYgKGZpbGVbMF0gIT09ICcuJyAmJiBjaGVja0ZvckV4dGVuc2lvbnMoZmlsZSwgZXh0ZW5zaW9ucykpXG4gICAgICAgICAgICBmaWxlc0xpc3QucHVzaChmaWxlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2VuZChjbGllbnQsICdmaWxlcycsIGZpbGVzTGlzdCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuIl19