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
 * [server] Retrieve a list of files on the server in the `/public` folder upon request of the client.
 *
 * (See also {@link src/client/ClientFilelist.js~ClientFilelist} on the client side.)
 */

var ServerFileList = (function (_Module) {
  _inherits(ServerFileList, _Module);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvU2VydmVyRmlsZUxpc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O2tCQUFlLElBQUk7Ozs7dUJBQ0EsVUFBVTs7OztBQUU3QixTQUFTLGtCQUFrQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7QUFDNUMsTUFBSSxDQUFDLFVBQVUsSUFBSSxVQUFVLENBQUMsTUFBTSxLQUFLLENBQUMsRUFDeEMsT0FBTyxJQUFJLENBQUM7Ozs7Ozs7QUFFZCxzQ0FBc0IsVUFBVSw0R0FBRTtVQUF6QixTQUFTOztBQUNoQixVQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUM7O0FBRXBELFVBQUksY0FBYyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxjQUFjLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLFNBQVMsRUFDeEcsT0FBTyxJQUFJLENBQUM7S0FDZjs7Ozs7Ozs7Ozs7Ozs7OztBQUVELFNBQU8sS0FBSyxDQUFDO0NBQ2Q7Ozs7Ozs7O0lBT29CLGNBQWM7WUFBZCxjQUFjOzs7Ozs7O0FBS3RCLFdBTFEsY0FBYyxHQUtQO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFMTCxjQUFjOztBQU0vQiwrQkFOaUIsY0FBYyw2Q0FNekIsT0FBTyxDQUFDLElBQUksSUFBSSxVQUFVLEVBQUU7R0FDbkM7Ozs7OztlQVBrQixjQUFjOztXQVkxQixpQkFBQyxNQUFNLEVBQUU7OztBQUNkLGlDQWJpQixjQUFjLHlDQWFqQixNQUFNLEVBQUU7O0FBRXRCLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxVQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUs7QUFDekQsWUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDOzs7QUFHbkIsd0JBQUcsT0FBTyxDQUFDLFdBQVcsR0FBRyxTQUFTLEVBQUUsVUFBQyxHQUFHLEVBQUUsS0FBSyxFQUFLO0FBQ2xELGNBQUksR0FBRyxFQUFFLE1BQU0sR0FBRyxDQUFDOzs7Ozs7O0FBRW5CLCtDQUFpQixLQUFLLGlIQUFFO2tCQUFmLElBQUk7O0FBQ1gsa0JBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLEVBQ3pELFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDeEI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFRCxnQkFBSyxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztTQUN2QyxDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7S0FDSjs7O1NBOUJrQixjQUFjOzs7cUJBQWQsY0FBYyIsImZpbGUiOiJzcmMvc2VydmVyL1NlcnZlckZpbGVMaXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBNb2R1bGUgZnJvbSAnLi9Nb2R1bGUnO1xuXG5mdW5jdGlvbiBjaGVja0ZvckV4dGVuc2lvbnMoZmlsZSwgZXh0ZW5zaW9ucykge1xuICBpZiAoIWV4dGVuc2lvbnMgfHwgZXh0ZW5zaW9ucy5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgZm9yIChsZXQgZXh0ZW5zaW9uIG9mIGV4dGVuc2lvbnMpIHtcbiAgICBsZXQgZXh0ZW5zaW9uSW5kZXggPSBmaWxlLmxlbmd0aCAtIGV4dGVuc2lvbi5sZW5ndGg7XG5cbiAgICBpZiAoZXh0ZW5zaW9uSW5kZXggPj0gMCAmJiBmaWxlLnN1YnN0cmluZyhleHRlbnNpb25JbmRleCwgZXh0ZW5zaW9uSW5kZXggKyBleHRlbnNpb24ubGVuZ3RoKSA9PT0gZXh0ZW5zaW9uKVxuICAgICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogW3NlcnZlcl0gUmV0cmlldmUgYSBsaXN0IG9mIGZpbGVzIG9uIHRoZSBzZXJ2ZXIgaW4gdGhlIGAvcHVibGljYCBmb2xkZXIgdXBvbiByZXF1ZXN0IG9mIHRoZSBjbGllbnQuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvY2xpZW50L0NsaWVudEZpbGVsaXN0LmpzfkNsaWVudEZpbGVsaXN0fSBvbiB0aGUgY2xpZW50IHNpZGUuKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2ZXJGaWxlTGlzdCBleHRlbmRzIE1vZHVsZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdmaWxlbGlzdCddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnZmlsZWxpc3QnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAncmVxdWVzdCcsIChzdWJmb2xkZXIsIGV4dGVuc2lvbnMpID0+IHtcbiAgICAgIGxldCBmaWxlc0xpc3QgPSBbXTtcblxuICAgICAgLy8gQHRvZG8gcmVtb3ZlIGhhcmRjb2RlZCBwYXRoIC0gZ2xvYmFsIGNvbmZpZyA/XG4gICAgICBmcy5yZWFkZGlyKCcuL3B1YmxpYy8nICsgc3ViZm9sZGVyLCAoZXJyLCBmaWxlcykgPT4ge1xuICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG5cbiAgICAgICAgZm9yIChsZXQgZmlsZSBvZiBmaWxlcykge1xuICAgICAgICAgIGlmIChmaWxlWzBdICE9PSAnLicgJiYgY2hlY2tGb3JFeHRlbnNpb25zKGZpbGUsIGV4dGVuc2lvbnMpKVxuICAgICAgICAgICAgZmlsZXNMaXN0LnB1c2goZmlsZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNlbmQoY2xpZW50LCAnZmlsZXMnLCBmaWxlc0xpc3QpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==