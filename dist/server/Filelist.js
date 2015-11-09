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
 * The {@link FileList} module allows to dynamically send a list of files stored on the server to the clients.
 */

var FileList = (function (_Module) {
  _inherits(FileList, _Module);

  /**
   * Creates an instance of the class.
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='filelist'] Name of the module.
   */

  function FileList() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, FileList);

    _get(Object.getPrototypeOf(FileList.prototype), 'constructor', this).call(this, options.name || 'filelist');
  }

  /**
   * @private
   */

  _createClass(FileList, [{
    key: 'connect',
    value: function connect(client) {
      var _this = this;

      _get(Object.getPrototypeOf(FileList.prototype), 'connect', this).call(this, client);

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

  return FileList;
})(_Module3['default']);

exports['default'] = FileList;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvRmlsZWxpc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O2tCQUFlLElBQUk7Ozs7dUJBQ0EsVUFBVTs7OztBQUc3QixTQUFTLGtCQUFrQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7QUFDNUMsTUFBRyxDQUFDLFVBQVUsSUFBSSxVQUFVLENBQUMsTUFBTSxLQUFLLENBQUMsRUFDdkMsT0FBTyxJQUFJLENBQUM7Ozs7Ozs7QUFFZCxzQ0FBc0IsVUFBVSw0R0FBRTtVQUF6QixTQUFTOztBQUNoQixVQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUM7O0FBRXBELFVBQUcsY0FBYyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxjQUFjLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLFNBQVMsRUFDdkcsT0FBTyxJQUFJLENBQUM7S0FDZjs7Ozs7Ozs7Ozs7Ozs7OztBQUVELFNBQU8sS0FBSyxDQUFDO0NBQ2Q7Ozs7OztJQUtvQixRQUFRO1lBQVIsUUFBUTs7Ozs7Ozs7QUFNaEIsV0FOUSxRQUFRLEdBTUQ7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQU5MLFFBQVE7O0FBT3pCLCtCQVBpQixRQUFRLDZDQU9uQixPQUFPLENBQUMsSUFBSSxJQUFJLFVBQVUsRUFBRTtHQUNuQzs7Ozs7O2VBUmtCLFFBQVE7O1dBYXBCLGlCQUFDLE1BQU0sRUFBRTs7O0FBQ2QsaUNBZGlCLFFBQVEseUNBY1gsTUFBTSxFQUFFOztBQUV0QixZQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsVUFBVSxFQUFFLFVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBSztBQUNoRSxZQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7O0FBRW5CLHdCQUFHLE9BQU8sQ0FBQyxXQUFXLEdBQUcsU0FBUyxFQUFFLFVBQUMsR0FBRyxFQUFFLEtBQUssRUFBSztBQUNsRCxjQUFJLEdBQUcsRUFBRSxNQUFNLEdBQUcsQ0FBQzs7Ozs7OztBQUVuQiwrQ0FBaUIsS0FBSyxpSEFBRTtrQkFBZixJQUFJOztBQUNYLGtCQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksa0JBQWtCLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxFQUN6RCxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3hCOzs7Ozs7Ozs7Ozs7Ozs7O0FBRUQsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsTUFBSyxJQUFJLEdBQUcsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1NBQzlDLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUNKOzs7U0E5QmtCLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6InNyYy9zZXJ2ZXIvRmlsZWxpc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IE1vZHVsZSBmcm9tICcuL01vZHVsZSc7XG5cblxuZnVuY3Rpb24gY2hlY2tGb3JFeHRlbnNpb25zKGZpbGUsIGV4dGVuc2lvbnMpIHtcbiAgaWYoIWV4dGVuc2lvbnMgfHwgZXh0ZW5zaW9ucy5sZW5ndGggPT09IDApXG4gICAgcmV0dXJuIHRydWU7XG5cbiAgZm9yIChsZXQgZXh0ZW5zaW9uIG9mIGV4dGVuc2lvbnMpIHtcbiAgICBsZXQgZXh0ZW5zaW9uSW5kZXggPSBmaWxlLmxlbmd0aCAtIGV4dGVuc2lvbi5sZW5ndGg7XG5cbiAgICBpZihleHRlbnNpb25JbmRleCA+PSAwICYmIGZpbGUuc3Vic3RyaW5nKGV4dGVuc2lvbkluZGV4LCBleHRlbnNpb25JbmRleCArIGV4dGVuc2lvbi5sZW5ndGgpID09PSBleHRlbnNpb24pXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBUaGUge0BsaW5rIEZpbGVMaXN0fSBtb2R1bGUgYWxsb3dzIHRvIGR5bmFtaWNhbGx5IHNlbmQgYSBsaXN0IG9mIGZpbGVzIHN0b3JlZCBvbiB0aGUgc2VydmVyIHRvIHRoZSBjbGllbnRzLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGaWxlTGlzdCBleHRlbmRzIE1vZHVsZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0nZmlsZWxpc3QnXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ2ZpbGVsaXN0Jyk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgY2xpZW50LnJlY2VpdmUodGhpcy5uYW1lICsgJzpyZXF1ZXN0JywgKHN1YmZvbGRlciwgZXh0ZW5zaW9ucykgPT4ge1xuICAgICAgbGV0IGZpbGVzTGlzdCA9IFtdO1xuXG4gICAgICBmcy5yZWFkZGlyKCcuL3B1YmxpYy8nICsgc3ViZm9sZGVyLCAoZXJyLCBmaWxlcykgPT4ge1xuICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG5cbiAgICAgICAgZm9yIChsZXQgZmlsZSBvZiBmaWxlcykge1xuICAgICAgICAgIGlmIChmaWxlWzBdICE9PSAnLicgJiYgY2hlY2tGb3JFeHRlbnNpb25zKGZpbGUsIGV4dGVuc2lvbnMpKVxuICAgICAgICAgICAgZmlsZXNMaXN0LnB1c2goZmlsZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjbGllbnQuc2VuZCh0aGlzLm5hbWUgKyAnOmZpbGVzJywgZmlsZXNMaXN0KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59XG5cbiJdfQ==