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
 * [server] Retrieve a list of files on the server in the public folder upon request of the client.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7a0JBQWUsSUFBSTs7OztvQkFDRixNQUFNOzs7OzZCQUNFLGdCQUFnQjs7OztBQUV6QyxTQUFTLGtCQUFrQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7QUFDNUMsTUFBSSxDQUFDLFVBQVUsSUFBSSxVQUFVLENBQUMsTUFBTSxLQUFLLENBQUMsRUFDeEMsT0FBTyxJQUFJLENBQUM7Ozs7Ozs7QUFFZCxzQ0FBc0IsVUFBVSw0R0FBRTtVQUF6QixTQUFTOztBQUNoQixVQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUM7O0FBRXBELFVBQUksY0FBYyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxjQUFjLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLFNBQVMsRUFDeEcsT0FBTyxJQUFJLENBQUM7S0FDZjs7Ozs7Ozs7Ozs7Ozs7OztBQUVELFNBQU8sS0FBSyxDQUFDO0NBQ2Q7Ozs7Ozs7O0lBT29CLGNBQWM7WUFBZCxjQUFjOzs7Ozs7O0FBS3RCLFdBTFEsY0FBYyxHQUtQO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFMTCxjQUFjOztBQU0vQiwrQkFOaUIsY0FBYyw2Q0FNekIsT0FBTyxDQUFDLElBQUksSUFBSSxVQUFVLEVBQUU7R0FDbkM7Ozs7OztlQVBrQixjQUFjOztXQVkxQixpQkFBQyxNQUFNLEVBQUU7OztBQUNkLGlDQWJpQixjQUFjLHlDQWFqQixNQUFNLEVBQUU7O0FBRXRCLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxVQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUs7QUFDekQsWUFBTSxTQUFTLEdBQUcsa0JBQUssSUFBSSxDQUFDLE1BQUssU0FBUyxDQUFDLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNwRSxZQUFNLFNBQVMsR0FBRyxFQUFFLENBQUM7O0FBRXJCLHdCQUFHLE9BQU8sQ0FBQyxTQUFTLEVBQUUsVUFBQyxHQUFHLEVBQUUsS0FBSyxFQUFLO0FBQ3BDLGNBQUksR0FBRyxFQUFFLE1BQU0sR0FBRyxDQUFDOzs7Ozs7O0FBRW5CLCtDQUFpQixLQUFLLGlIQUFFO2tCQUFmLElBQUk7O0FBQ1gsa0JBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLEVBQ3pELFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDeEI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFRCxnQkFBSyxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztTQUN2QyxDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7S0FDSjs7O1NBOUJrQixjQUFjOzs7cUJBQWQsY0FBYyIsImZpbGUiOiJzcmMvY2xpZW50L0NsaWVudENoZWNraW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgU2VydmVyTW9kdWxlIGZyb20gJy4vU2VydmVyTW9kdWxlJztcblxuZnVuY3Rpb24gY2hlY2tGb3JFeHRlbnNpb25zKGZpbGUsIGV4dGVuc2lvbnMpIHtcbiAgaWYgKCFleHRlbnNpb25zIHx8IGV4dGVuc2lvbnMubGVuZ3RoID09PSAwKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIGZvciAobGV0IGV4dGVuc2lvbiBvZiBleHRlbnNpb25zKSB7XG4gICAgbGV0IGV4dGVuc2lvbkluZGV4ID0gZmlsZS5sZW5ndGggLSBleHRlbnNpb24ubGVuZ3RoO1xuXG4gICAgaWYgKGV4dGVuc2lvbkluZGV4ID49IDAgJiYgZmlsZS5zdWJzdHJpbmcoZXh0ZW5zaW9uSW5kZXgsIGV4dGVuc2lvbkluZGV4ICsgZXh0ZW5zaW9uLmxlbmd0aCkgPT09IGV4dGVuc2lvbilcbiAgICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIFtzZXJ2ZXJdIFJldHJpZXZlIGEgbGlzdCBvZiBmaWxlcyBvbiB0aGUgc2VydmVyIGluIHRoZSBwdWJsaWMgZm9sZGVyIHVwb24gcmVxdWVzdCBvZiB0aGUgY2xpZW50LlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL2NsaWVudC9DbGllbnRGaWxlTGlzdC5qc35DbGllbnRGaWxlTGlzdH0gb24gdGhlIGNsaWVudCBzaWRlLilcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmVyRmlsZUxpc3QgZXh0ZW5kcyBTZXJ2ZXJNb2R1bGUge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0nZmlsZWxpc3QnXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ2ZpbGVsaXN0Jyk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3JlcXVlc3QnLCAoc3ViZm9sZGVyLCBleHRlbnNpb25zKSA9PiB7XG4gICAgICBjb25zdCBkaXJlY3RvcnkgPSBwYXRoLmpvaW4odGhpcy5hcHBDb25maWcucHVibGljRm9sZGVyLCBzdWJmb2xkZXIpO1xuICAgICAgY29uc3QgZmlsZXNMaXN0ID0gW107XG4gICAgICAvLyBAdG9kbyByZW1vdmUgaGFyZGNvZGVkIHBhdGggLSBnbG9iYWwgY29uZmlnID9cbiAgICAgIGZzLnJlYWRkaXIoZGlyZWN0b3J5LCAoZXJyLCBmaWxlcykgPT4ge1xuICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG5cbiAgICAgICAgZm9yIChsZXQgZmlsZSBvZiBmaWxlcykge1xuICAgICAgICAgIGlmIChmaWxlWzBdICE9PSAnLicgJiYgY2hlY2tGb3JFeHRlbnNpb25zKGZpbGUsIGV4dGVuc2lvbnMpKVxuICAgICAgICAgICAgZmlsZXNMaXN0LnB1c2goZmlsZSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNlbmQoY2xpZW50LCAnZmlsZXMnLCBmaWxlc0xpc3QpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==