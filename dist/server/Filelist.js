'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var fs = require('fs');

var ServerModule = require('./ServerModule');
// import ServerModule from './ServerModule.es6.js';

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
 * The {@link ServerFilelist} module allows to dynamically send a list of files stored on the server to the clients.
 */

var ServerFilelist = (function (_ServerModule) {
  _inherits(ServerFilelist, _ServerModule);

  // export default class ServerFilelist extends ServerModule {
  /**
   * Creates an instance of the class.
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='filelist'] Name of the module.
   */

  function ServerFilelist() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ServerFilelist);

    _get(Object.getPrototypeOf(ServerFilelist.prototype), 'constructor', this).call(this, options.name || 'filelist');
  }

  /**
   * @private
   */

  _createClass(ServerFilelist, [{
    key: 'connect',
    value: function connect(client) {
      var _this = this;

      _get(Object.getPrototypeOf(ServerFilelist.prototype), 'connect', this).call(this, client);

      client.receive(this.name + ':request', function (subfolder, extensions) {
        var filesList = [];

        fs.readdir('./public/' + subfolder, function (err, files) {
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

  return ServerFilelist;
})(ServerModule);

module.exports = ServerFilelist;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvRmlsZWxpc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7Ozs7Ozs7Ozs7QUFFYixJQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXpCLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOzs7QUFHL0MsU0FBUyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO0FBQzVDLE1BQUcsQ0FBQyxVQUFVLElBQUksVUFBVSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQ3ZDLE9BQU8sSUFBSSxDQUFDOzs7Ozs7O0FBRWQsc0NBQXNCLFVBQVUsNEdBQUU7VUFBekIsU0FBUzs7QUFDaEIsVUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDOztBQUVwRCxVQUFHLGNBQWMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsY0FBYyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxTQUFTLEVBQ3ZHLE9BQU8sSUFBSSxDQUFDO0tBQ2Y7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFRCxTQUFPLEtBQUssQ0FBQztDQUNkOzs7Ozs7SUFLSyxjQUFjO1lBQWQsY0FBYzs7Ozs7Ozs7O0FBT1AsV0FQUCxjQUFjLEdBT1E7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQVBwQixjQUFjOztBQVFoQiwrQkFSRSxjQUFjLDZDQVFWLE9BQU8sQ0FBQyxJQUFJLElBQUksVUFBVSxFQUFFO0dBQ25DOzs7Ozs7ZUFURyxjQUFjOztXQWNYLGlCQUFDLE1BQU0sRUFBRTs7O0FBQ2QsaUNBZkUsY0FBYyx5Q0FlRixNQUFNLEVBQUU7O0FBRXRCLFlBQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLEVBQUUsVUFBQyxTQUFTLEVBQUUsVUFBVSxFQUFLO0FBQ2hFLFlBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQzs7QUFFbkIsVUFBRSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsU0FBUyxFQUFFLFVBQUMsR0FBRyxFQUFFLEtBQUssRUFBSztBQUNsRCxjQUFJLEdBQUcsRUFBRSxNQUFNLEdBQUcsQ0FBQzs7Ozs7OztBQUVuQiwrQ0FBaUIsS0FBSyxpSEFBRTtrQkFBZixJQUFJOztBQUNYLGtCQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLElBQUksa0JBQWtCLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxFQUN6RCxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3hCOzs7Ozs7Ozs7Ozs7Ozs7O0FBRUQsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsTUFBSyxJQUFJLEdBQUcsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1NBQzlDLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUNKOzs7U0EvQkcsY0FBYztHQUFTLFlBQVk7O0FBa0N6QyxNQUFNLENBQUMsT0FBTyxHQUFHLGNBQWMsQ0FBQyIsImZpbGUiOiJzcmMvc2VydmVyL0ZpbGVsaXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5cbmNvbnN0IFNlcnZlck1vZHVsZSA9IHJlcXVpcmUoJy4vU2VydmVyTW9kdWxlJyk7XG4vLyBpbXBvcnQgU2VydmVyTW9kdWxlIGZyb20gJy4vU2VydmVyTW9kdWxlLmVzNi5qcyc7XG5cbmZ1bmN0aW9uIGNoZWNrRm9yRXh0ZW5zaW9ucyhmaWxlLCBleHRlbnNpb25zKSB7XG4gIGlmKCFleHRlbnNpb25zIHx8IGV4dGVuc2lvbnMubGVuZ3RoID09PSAwKVxuICAgIHJldHVybiB0cnVlO1xuXG4gIGZvciAobGV0IGV4dGVuc2lvbiBvZiBleHRlbnNpb25zKSB7XG4gICAgbGV0IGV4dGVuc2lvbkluZGV4ID0gZmlsZS5sZW5ndGggLSBleHRlbnNpb24ubGVuZ3RoO1xuXG4gICAgaWYoZXh0ZW5zaW9uSW5kZXggPj0gMCAmJiBmaWxlLnN1YnN0cmluZyhleHRlbnNpb25JbmRleCwgZXh0ZW5zaW9uSW5kZXggKyBleHRlbnNpb24ubGVuZ3RoKSA9PT0gZXh0ZW5zaW9uKVxuICAgICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogVGhlIHtAbGluayBTZXJ2ZXJGaWxlbGlzdH0gbW9kdWxlIGFsbG93cyB0byBkeW5hbWljYWxseSBzZW5kIGEgbGlzdCBvZiBmaWxlcyBzdG9yZWQgb24gdGhlIHNlcnZlciB0byB0aGUgY2xpZW50cy5cbiAqL1xuY2xhc3MgU2VydmVyRmlsZWxpc3QgZXh0ZW5kcyBTZXJ2ZXJNb2R1bGUge1xuLy8gZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmVyRmlsZWxpc3QgZXh0ZW5kcyBTZXJ2ZXJNb2R1bGUge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiB0aGUgY2xhc3MuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm5hbWU9J2ZpbGVsaXN0J10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdmaWxlbGlzdCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIGNsaWVudC5yZWNlaXZlKHRoaXMubmFtZSArICc6cmVxdWVzdCcsIChzdWJmb2xkZXIsIGV4dGVuc2lvbnMpID0+IHtcbiAgICAgIGxldCBmaWxlc0xpc3QgPSBbXTtcblxuICAgICAgZnMucmVhZGRpcignLi9wdWJsaWMvJyArIHN1YmZvbGRlciwgKGVyciwgZmlsZXMpID0+IHtcbiAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuXG4gICAgICAgIGZvciAobGV0IGZpbGUgb2YgZmlsZXMpIHtcbiAgICAgICAgICBpZiAoZmlsZVswXSAhPT0gJy4nICYmIGNoZWNrRm9yRXh0ZW5zaW9ucyhmaWxlLCBleHRlbnNpb25zKSlcbiAgICAgICAgICAgIGZpbGVzTGlzdC5wdXNoKGZpbGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2xpZW50LnNlbmQodGhpcy5uYW1lICsgJzpmaWxlcycsIGZpbGVzTGlzdCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNlcnZlckZpbGVsaXN0O1xuIl19