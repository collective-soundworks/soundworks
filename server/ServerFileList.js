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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvc2VydmVyL1NlcnZlckZpbGVMaXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztrQkFBZSxJQUFJOzs7O29CQUNGLE1BQU07Ozs7NkJBQ0UsZ0JBQWdCOzs7O0FBRXpDLFNBQVMsa0JBQWtCLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtBQUM1QyxNQUFJLENBQUMsVUFBVSxJQUFJLFVBQVUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUN4QyxPQUFPLElBQUksQ0FBQzs7Ozs7OztBQUVkLHNDQUFzQixVQUFVLDRHQUFFO1VBQXpCLFNBQVM7O0FBQ2hCLFVBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQzs7QUFFcEQsVUFBSSxjQUFjLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFLGNBQWMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssU0FBUyxFQUN4RyxPQUFPLElBQUksQ0FBQztLQUNmOzs7Ozs7Ozs7Ozs7Ozs7O0FBRUQsU0FBTyxLQUFLLENBQUM7Q0FDZDs7Ozs7Ozs7SUFPb0IsY0FBYztZQUFkLGNBQWM7Ozs7Ozs7QUFLdEIsV0FMUSxjQUFjLEdBS1A7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQUxMLGNBQWM7O0FBTS9CLCtCQU5pQixjQUFjLDZDQU16QixPQUFPLENBQUMsSUFBSSxJQUFJLFVBQVUsRUFBRTtHQUNuQzs7Ozs7O2VBUGtCLGNBQWM7O1dBWTFCLGlCQUFDLE1BQU0sRUFBRTs7O0FBQ2QsaUNBYmlCLGNBQWMseUNBYWpCLE1BQU0sRUFBRTs7QUFFdEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLFVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBSztBQUN6RCxZQUFNLFNBQVMsR0FBRyxrQkFBSyxJQUFJLENBQUMsTUFBSyxTQUFTLENBQUMsWUFBWSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ3BFLFlBQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQzs7QUFFckIsd0JBQUcsT0FBTyxDQUFDLFNBQVMsRUFBRSxVQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUs7QUFDcEMsY0FBSSxHQUFHLEVBQUUsTUFBTSxHQUFHLENBQUM7Ozs7Ozs7QUFFbkIsK0NBQWlCLEtBQUssaUhBQUU7a0JBQWYsSUFBSTs7QUFDWCxrQkFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLGtCQUFrQixDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsRUFDekQsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUN4Qjs7Ozs7Ozs7Ozs7Ozs7OztBQUVELGdCQUFLLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1NBQ3ZDLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUNKOzs7U0E5QmtCLGNBQWM7OztxQkFBZCxjQUFjIiwiZmlsZSI6Ii9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvc2VydmVyL1NlcnZlckZpbGVMaXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IFNlcnZlck1vZHVsZSBmcm9tICcuL1NlcnZlck1vZHVsZSc7XG5cbmZ1bmN0aW9uIGNoZWNrRm9yRXh0ZW5zaW9ucyhmaWxlLCBleHRlbnNpb25zKSB7XG4gIGlmICghZXh0ZW5zaW9ucyB8fCBleHRlbnNpb25zLmxlbmd0aCA9PT0gMClcbiAgICByZXR1cm4gdHJ1ZTtcblxuICBmb3IgKGxldCBleHRlbnNpb24gb2YgZXh0ZW5zaW9ucykge1xuICAgIGxldCBleHRlbnNpb25JbmRleCA9IGZpbGUubGVuZ3RoIC0gZXh0ZW5zaW9uLmxlbmd0aDtcblxuICAgIGlmIChleHRlbnNpb25JbmRleCA+PSAwICYmIGZpbGUuc3Vic3RyaW5nKGV4dGVuc2lvbkluZGV4LCBleHRlbnNpb25JbmRleCArIGV4dGVuc2lvbi5sZW5ndGgpID09PSBleHRlbnNpb24pXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBSZXRyaWV2ZSBhIGxpc3Qgb2YgZmlsZXMgb24gdGhlIHNlcnZlciBpbiB0aGUgcHVibGljIGZvbGRlciB1cG9uIHJlcXVlc3Qgb2YgdGhlIGNsaWVudC5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9jbGllbnQvQ2xpZW50RmlsZUxpc3QuanN+Q2xpZW50RmlsZUxpc3R9IG9uIHRoZSBjbGllbnQgc2lkZS4pXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlcnZlckZpbGVMaXN0IGV4dGVuZHMgU2VydmVyTW9kdWxlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm5hbWU9J2ZpbGVsaXN0J10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdmaWxlbGlzdCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdyZXF1ZXN0JywgKHN1YmZvbGRlciwgZXh0ZW5zaW9ucykgPT4ge1xuICAgICAgY29uc3QgZGlyZWN0b3J5ID0gcGF0aC5qb2luKHRoaXMuYXBwQ29uZmlnLnB1YmxpY0ZvbGRlciwgc3ViZm9sZGVyKTtcbiAgICAgIGNvbnN0IGZpbGVzTGlzdCA9IFtdO1xuICAgICAgLy8gQHRvZG8gcmVtb3ZlIGhhcmRjb2RlZCBwYXRoIC0gZ2xvYmFsIGNvbmZpZyA/XG4gICAgICBmcy5yZWFkZGlyKGRpcmVjdG9yeSwgKGVyciwgZmlsZXMpID0+IHtcbiAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuXG4gICAgICAgIGZvciAobGV0IGZpbGUgb2YgZmlsZXMpIHtcbiAgICAgICAgICBpZiAoZmlsZVswXSAhPT0gJy4nICYmIGNoZWNrRm9yRXh0ZW5zaW9ucyhmaWxlLCBleHRlbnNpb25zKSlcbiAgICAgICAgICAgIGZpbGVzTGlzdC5wdXNoKGZpbGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZW5kKGNsaWVudCwgJ2ZpbGVzJywgZmlsZXNMaXN0KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59XG4iXX0=