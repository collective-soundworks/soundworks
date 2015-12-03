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

var _Module2 = require('./Module');

var _Module3 = _interopRequireDefault(_Module2);

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
 * The {@link ServerFileList} module allows to dynamically send a list of files stored on the server to the clients.
 */

var ServerFileList = (function (_Module) {
  _inherits(ServerFileList, _Module);

  /**
   * Creates an instance of the class.
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
        var filesList = [];

        // @todo remove hardcoded path - global config ?
        _fs2['default'].readdir('./public/' + subfolder, function (err, files) {
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
})(_Module3['default']);

exports['default'] = ServerFileList;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvU2VydmVyRmlsZUxpc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O2tCQUFlLElBQUk7Ozs7dUJBQ0EsVUFBVTs7OztBQUc3QixTQUFTLGtCQUFrQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7QUFDNUMsTUFBSSxDQUFDLFVBQVUsSUFBSSxVQUFVLENBQUMsTUFBTSxLQUFLLENBQUMsRUFDeEMsT0FBTyxJQUFJLENBQUM7Ozs7Ozs7QUFFZCxzQ0FBc0IsVUFBVSw0R0FBRTtVQUF6QixTQUFTOztBQUNoQixVQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUM7O0FBRXBELFVBQUksY0FBYyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxjQUFjLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLFNBQVMsRUFDeEcsT0FBTyxJQUFJLENBQUM7S0FDZjs7Ozs7Ozs7Ozs7Ozs7OztBQUVELFNBQU8sS0FBSyxDQUFDO0NBQ2Q7Ozs7OztJQUtvQixjQUFjO1lBQWQsY0FBYzs7Ozs7Ozs7QUFNdEIsV0FOUSxjQUFjLEdBTVA7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQU5MLGNBQWM7O0FBTy9CLCtCQVBpQixjQUFjLDZDQU96QixPQUFPLENBQUMsSUFBSSxJQUFJLFVBQVUsRUFBRTtHQUNuQzs7Ozs7O2VBUmtCLGNBQWM7O1dBYTFCLGlCQUFDLE1BQU0sRUFBRTs7O0FBQ2QsaUNBZGlCLGNBQWMseUNBY2pCLE1BQU0sRUFBRTs7QUFFdEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLFVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBSztBQUN6RCxZQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7OztBQUduQix3QkFBRyxPQUFPLENBQUMsV0FBVyxHQUFHLFNBQVMsRUFBRSxVQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUs7QUFDbEQsY0FBSSxHQUFHLEVBQUUsTUFBTSxHQUFHLENBQUM7Ozs7Ozs7QUFFbkIsK0NBQWlCLEtBQUssaUhBQUU7a0JBQWYsSUFBSTs7QUFDWCxrQkFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLGtCQUFrQixDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsRUFDekQsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUN4Qjs7Ozs7Ozs7Ozs7Ozs7OztBQUVELGdCQUFLLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1NBQ3ZDLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUNKOzs7U0EvQmtCLGNBQWM7OztxQkFBZCxjQUFjIiwiZmlsZSI6InNyYy9zZXJ2ZXIvU2VydmVyRmlsZUxpc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IE1vZHVsZSBmcm9tICcuL01vZHVsZSc7XG5cblxuZnVuY3Rpb24gY2hlY2tGb3JFeHRlbnNpb25zKGZpbGUsIGV4dGVuc2lvbnMpIHtcbiAgaWYgKCFleHRlbnNpb25zIHx8IGV4dGVuc2lvbnMubGVuZ3RoID09PSAwKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIGZvciAobGV0IGV4dGVuc2lvbiBvZiBleHRlbnNpb25zKSB7XG4gICAgbGV0IGV4dGVuc2lvbkluZGV4ID0gZmlsZS5sZW5ndGggLSBleHRlbnNpb24ubGVuZ3RoO1xuXG4gICAgaWYgKGV4dGVuc2lvbkluZGV4ID49IDAgJiYgZmlsZS5zdWJzdHJpbmcoZXh0ZW5zaW9uSW5kZXgsIGV4dGVuc2lvbkluZGV4ICsgZXh0ZW5zaW9uLmxlbmd0aCkgPT09IGV4dGVuc2lvbilcbiAgICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIFRoZSB7QGxpbmsgU2VydmVyRmlsZUxpc3R9IG1vZHVsZSBhbGxvd3MgdG8gZHluYW1pY2FsbHkgc2VuZCBhIGxpc3Qgb2YgZmlsZXMgc3RvcmVkIG9uIHRoZSBzZXJ2ZXIgdG8gdGhlIGNsaWVudHMuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlcnZlckZpbGVMaXN0IGV4dGVuZHMgTW9kdWxlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdmaWxlbGlzdCddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnZmlsZWxpc3QnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAncmVxdWVzdCcsIChzdWJmb2xkZXIsIGV4dGVuc2lvbnMpID0+IHtcbiAgICAgIGxldCBmaWxlc0xpc3QgPSBbXTtcblxuICAgICAgLy8gQHRvZG8gcmVtb3ZlIGhhcmRjb2RlZCBwYXRoIC0gZ2xvYmFsIGNvbmZpZyA/XG4gICAgICBmcy5yZWFkZGlyKCcuL3B1YmxpYy8nICsgc3ViZm9sZGVyLCAoZXJyLCBmaWxlcykgPT4ge1xuICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG5cbiAgICAgICAgZm9yIChsZXQgZmlsZSBvZiBmaWxlcykge1xuICAgICAgICAgIGlmIChmaWxlWzBdICE9PSAnLicgJiYgY2hlY2tGb3JFeHRlbnNpb25zKGZpbGUsIGV4dGVuc2lvbnMpKVxuICAgICAgICAgICAgZmlsZXNMaXN0LnB1c2goZmlsZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNlbmQoY2xpZW50LCAnZmlsZXMnLCBmaWxlc0xpc3QpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cblxuIl19