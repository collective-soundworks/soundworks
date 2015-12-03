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

      client.receive(this.name + ':request', function (subfolder, extensions) {
        var filesList = [];

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

          client.send(_this.name + ':files', filesList);
        });
      });
    }
  }]);

  return ServerFileList;
})(_Module3['default']);

exports['default'] = ServerFileList;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvU2VydmVyRmlsZUxpc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O2tCQUFlLElBQUk7Ozs7dUJBQ0EsVUFBVTs7OztBQUc3QixTQUFTLGtCQUFrQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7QUFDNUMsTUFBSSxDQUFDLFVBQVUsSUFBSSxVQUFVLENBQUMsTUFBTSxLQUFLLENBQUMsRUFDeEMsT0FBTyxJQUFJLENBQUM7Ozs7Ozs7QUFFZCxzQ0FBc0IsVUFBVSw0R0FBRTtVQUF6QixTQUFTOztBQUNoQixVQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUM7O0FBRXBELFVBQUksY0FBYyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxjQUFjLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLFNBQVMsRUFDeEcsT0FBTyxJQUFJLENBQUM7S0FDZjs7Ozs7Ozs7Ozs7Ozs7OztBQUVELFNBQU8sS0FBSyxDQUFDO0NBQ2Q7Ozs7OztJQUtvQixjQUFjO1lBQWQsY0FBYzs7Ozs7Ozs7QUFNdEIsV0FOUSxjQUFjLEdBTVA7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQU5MLGNBQWM7O0FBTy9CLCtCQVBpQixjQUFjLDZDQU96QixPQUFPLENBQUMsSUFBSSxJQUFJLFVBQVUsRUFBRTtHQUNuQzs7Ozs7O2VBUmtCLGNBQWM7O1dBYTFCLGlCQUFDLE1BQU0sRUFBRTs7O0FBQ2QsaUNBZGlCLGNBQWMseUNBY2pCLE1BQU0sRUFBRTs7QUFFdEIsWUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLFVBQVUsRUFBRSxVQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUs7QUFDaEUsWUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDOztBQUVuQix3QkFBRyxPQUFPLENBQUMsV0FBVyxHQUFHLFNBQVMsRUFBRSxVQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUs7QUFDbEQsY0FBSSxHQUFHLEVBQUUsTUFBTSxHQUFHLENBQUM7Ozs7Ozs7QUFFbkIsK0NBQWlCLEtBQUssaUhBQUU7a0JBQWYsSUFBSTs7QUFDWCxrQkFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLGtCQUFrQixDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsRUFDekQsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUN4Qjs7Ozs7Ozs7Ozs7Ozs7OztBQUVELGdCQUFNLENBQUMsSUFBSSxDQUFDLE1BQUssSUFBSSxHQUFHLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztTQUM5QyxDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7S0FDSjs7O1NBOUJrQixjQUFjOzs7cUJBQWQsY0FBYyIsImZpbGUiOiJzcmMvc2VydmVyL1NlcnZlckZpbGVMaXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBNb2R1bGUgZnJvbSAnLi9Nb2R1bGUnO1xuXG5cbmZ1bmN0aW9uIGNoZWNrRm9yRXh0ZW5zaW9ucyhmaWxlLCBleHRlbnNpb25zKSB7XG4gIGlmICghZXh0ZW5zaW9ucyB8fCBleHRlbnNpb25zLmxlbmd0aCA9PT0gMClcbiAgICByZXR1cm4gdHJ1ZTtcblxuICBmb3IgKGxldCBleHRlbnNpb24gb2YgZXh0ZW5zaW9ucykge1xuICAgIGxldCBleHRlbnNpb25JbmRleCA9IGZpbGUubGVuZ3RoIC0gZXh0ZW5zaW9uLmxlbmd0aDtcblxuICAgIGlmIChleHRlbnNpb25JbmRleCA+PSAwICYmIGZpbGUuc3Vic3RyaW5nKGV4dGVuc2lvbkluZGV4LCBleHRlbnNpb25JbmRleCArIGV4dGVuc2lvbi5sZW5ndGgpID09PSBleHRlbnNpb24pXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBUaGUge0BsaW5rIFNlcnZlckZpbGVMaXN0fSBtb2R1bGUgYWxsb3dzIHRvIGR5bmFtaWNhbGx5IHNlbmQgYSBsaXN0IG9mIGZpbGVzIHN0b3JlZCBvbiB0aGUgc2VydmVyIHRvIHRoZSBjbGllbnRzLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2ZXJGaWxlTGlzdCBleHRlbmRzIE1vZHVsZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0nZmlsZWxpc3QnXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ2ZpbGVsaXN0Jyk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgY2xpZW50LnJlY2VpdmUodGhpcy5uYW1lICsgJzpyZXF1ZXN0JywgKHN1YmZvbGRlciwgZXh0ZW5zaW9ucykgPT4ge1xuICAgICAgbGV0IGZpbGVzTGlzdCA9IFtdO1xuXG4gICAgICBmcy5yZWFkZGlyKCcuL3B1YmxpYy8nICsgc3ViZm9sZGVyLCAoZXJyLCBmaWxlcykgPT4ge1xuICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG5cbiAgICAgICAgZm9yIChsZXQgZmlsZSBvZiBmaWxlcykge1xuICAgICAgICAgIGlmIChmaWxlWzBdICE9PSAnLicgJiYgY2hlY2tGb3JFeHRlbnNpb25zKGZpbGUsIGV4dGVuc2lvbnMpKVxuICAgICAgICAgICAgZmlsZXNMaXN0LnB1c2goZmlsZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjbGllbnQuc2VuZCh0aGlzLm5hbWUgKyAnOmZpbGVzJywgZmlsZXNMaXN0KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59XG5cbiJdfQ==