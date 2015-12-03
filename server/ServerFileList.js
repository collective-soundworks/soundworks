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
 * [server] Retrieve a list of files on the server in the public folder upon request of the client.
 *
 * (See also {@link src/client/ClientFileList.js~ClientFileList} on the client side.)
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
})(_Module3['default']);

exports['default'] = ServerFileList;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvU2VydmVyRmlsZUxpc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O2tCQUFlLElBQUk7Ozs7b0JBQ0YsTUFBTTs7Ozt1QkFDSixVQUFVOzs7O0FBRTdCLFNBQVMsa0JBQWtCLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtBQUM1QyxNQUFJLENBQUMsVUFBVSxJQUFJLFVBQVUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUN4QyxPQUFPLElBQUksQ0FBQzs7Ozs7OztBQUVkLHNDQUFzQixVQUFVLDRHQUFFO1VBQXpCLFNBQVM7O0FBQ2hCLFVBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQzs7QUFFcEQsVUFBSSxjQUFjLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFLGNBQWMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssU0FBUyxFQUN4RyxPQUFPLElBQUksQ0FBQztLQUNmOzs7Ozs7Ozs7Ozs7Ozs7O0FBRUQsU0FBTyxLQUFLLENBQUM7Q0FDZDs7Ozs7Ozs7SUFPb0IsY0FBYztZQUFkLGNBQWM7Ozs7Ozs7QUFLdEIsV0FMUSxjQUFjLEdBS1A7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQUxMLGNBQWM7O0FBTS9CLCtCQU5pQixjQUFjLDZDQU16QixPQUFPLENBQUMsSUFBSSxJQUFJLFVBQVUsRUFBRTtHQUNuQzs7Ozs7O2VBUGtCLGNBQWM7O1dBWTFCLGlCQUFDLE1BQU0sRUFBRTs7O0FBQ2QsaUNBYmlCLGNBQWMseUNBYWpCLE1BQU0sRUFBRTs7QUFFdEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLFVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBSztBQUN6RCxZQUFNLFNBQVMsR0FBRyxrQkFBSyxJQUFJLENBQUMsTUFBSyxTQUFTLENBQUMsWUFBWSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ3BFLFlBQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQzs7QUFFckIsd0JBQUcsT0FBTyxDQUFDLFNBQVMsRUFBRSxVQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUs7QUFDcEMsY0FBSSxHQUFHLEVBQUUsTUFBTSxHQUFHLENBQUM7Ozs7Ozs7QUFFbkIsK0NBQWlCLEtBQUssaUhBQUU7a0JBQWYsSUFBSTs7QUFDWCxrQkFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLGtCQUFrQixDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsRUFDekQsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUN4Qjs7Ozs7Ozs7Ozs7Ozs7OztBQUVELGdCQUFLLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1NBQ3ZDLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUNKOzs7U0E5QmtCLGNBQWM7OztxQkFBZCxjQUFjIiwiZmlsZSI6InNyYy9zZXJ2ZXIvU2VydmVyRmlsZUxpc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgTW9kdWxlIGZyb20gJy4vTW9kdWxlJztcblxuZnVuY3Rpb24gY2hlY2tGb3JFeHRlbnNpb25zKGZpbGUsIGV4dGVuc2lvbnMpIHtcbiAgaWYgKCFleHRlbnNpb25zIHx8IGV4dGVuc2lvbnMubGVuZ3RoID09PSAwKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIGZvciAobGV0IGV4dGVuc2lvbiBvZiBleHRlbnNpb25zKSB7XG4gICAgbGV0IGV4dGVuc2lvbkluZGV4ID0gZmlsZS5sZW5ndGggLSBleHRlbnNpb24ubGVuZ3RoO1xuXG4gICAgaWYgKGV4dGVuc2lvbkluZGV4ID49IDAgJiYgZmlsZS5zdWJzdHJpbmcoZXh0ZW5zaW9uSW5kZXgsIGV4dGVuc2lvbkluZGV4ICsgZXh0ZW5zaW9uLmxlbmd0aCkgPT09IGV4dGVuc2lvbilcbiAgICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIFtzZXJ2ZXJdIFJldHJpZXZlIGEgbGlzdCBvZiBmaWxlcyBvbiB0aGUgc2VydmVyIGluIHRoZSBwdWJsaWMgZm9sZGVyIHVwb24gcmVxdWVzdCBvZiB0aGUgY2xpZW50LlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL2NsaWVudC9DbGllbnRGaWxlTGlzdC5qc35DbGllbnRGaWxlTGlzdH0gb24gdGhlIGNsaWVudCBzaWRlLilcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmVyRmlsZUxpc3QgZXh0ZW5kcyBNb2R1bGUge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0nZmlsZWxpc3QnXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ2ZpbGVsaXN0Jyk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3JlcXVlc3QnLCAoc3ViZm9sZGVyLCBleHRlbnNpb25zKSA9PiB7XG4gICAgICBjb25zdCBkaXJlY3RvcnkgPSBwYXRoLmpvaW4odGhpcy5hcHBDb25maWcucHVibGljRm9sZGVyLCBzdWJmb2xkZXIpO1xuICAgICAgY29uc3QgZmlsZXNMaXN0ID0gW107XG4gICAgICAvLyBAdG9kbyByZW1vdmUgaGFyZGNvZGVkIHBhdGggLSBnbG9iYWwgY29uZmlnID9cbiAgICAgIGZzLnJlYWRkaXIoZGlyZWN0b3J5LCAoZXJyLCBmaWxlcykgPT4ge1xuICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG5cbiAgICAgICAgZm9yIChsZXQgZmlsZSBvZiBmaWxlcykge1xuICAgICAgICAgIGlmIChmaWxlWzBdICE9PSAnLicgJiYgY2hlY2tGb3JFeHRlbnNpb25zKGZpbGUsIGV4dGVuc2lvbnMpKVxuICAgICAgICAgICAgZmlsZXNMaXN0LnB1c2goZmlsZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNlbmQoY2xpZW50LCAnZmlsZXMnLCBmaWxlc0xpc3QpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==