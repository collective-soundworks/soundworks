'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _calibrationServer = require('calibration/server');

var _calibrationServer2 = _interopRequireDefault(_calibrationServer);

var _ServerModule2 = require('./ServerModule');

var _ServerModule3 = _interopRequireDefault(_ServerModule2);

/**
 * @private
 */

var ServerCalibration = (function (_ServerModule) {
  _inherits(ServerCalibration, _ServerModule);

  /**
   * Constructor of the calibration server module.
   *
   * Note that the receive functions are registered by {@linkcode
   * Calibration~connect}.
   *
   * @constructs Calibration
   * @param {Object} [params]
   * @param {Object} [params.persistent]
   * @param {Object} [params.persistent.path='../../data'] where to
   * store the persistent file
   * @param {Object} [params.persistent.file='calibration.json'] name
   * of the persistent file
   */

  function ServerCalibration() {
    var params = arguments.length <= 0 || arguments[0] === undefined ? {
      persistent: {
        path: '../../data',
        file: 'calibration.json'
      } } : arguments[0];

    _classCallCheck(this, ServerCalibration);

    _get(Object.getPrototypeOf(ServerCalibration.prototype), 'constructor', this).call(this, params.name || 'calibration');
    this.calibration = new _calibrationServer2['default']({ persistent: params.persistent });
  }

  /**
   * Register the receive functions.
   *
   * @function Calibration~connect
   * @param {ServerClient} client
   */

  _createClass(ServerCalibration, [{
    key: 'connect',
    value: function connect(client) {
      var _this = this;

      _get(Object.getPrototypeOf(ServerCalibration.prototype), 'connect', this).call(this, client);

      var sendCallback = function sendCallback(cmd) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        _this.send.apply(_this, [client, cmd].concat(args));
      };

      var receiveCallback = function receiveCallback(cmd, callback) {
        _this.receive(client, cmd, callback);
      };

      this.calibration.start(sendCallback, receiveCallback);
    }
  }]);

  return ServerCalibration;
})(_ServerModule3['default']);

exports['default'] = ServerCalibration;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvc2VydmVyL1NlcnZlckNhbGlicmF0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7aUNBQThCLG9CQUFvQjs7Ozs2QkFDekIsZ0JBQWdCOzs7Ozs7OztJQUtwQixpQkFBaUI7WUFBakIsaUJBQWlCOzs7Ozs7Ozs7Ozs7Ozs7OztBQWV6QixXQWZRLGlCQUFpQixHQW1CNUI7UUFKSSxNQUFNLHlEQUFHO0FBQ25CLGdCQUFVLEVBQUU7QUFDVixZQUFJLEVBQUUsWUFBWTtBQUNsQixZQUFJLEVBQUUsa0JBQWtCO09BQ3pCLEVBQUU7OzBCQW5CYyxpQkFBaUI7O0FBb0JoQywrQkFwQmUsaUJBQWlCLDZDQW9CMUIsTUFBTSxDQUFDLElBQUksSUFBSSxhQUFhLEVBQUU7QUFDcEMsUUFBSSxDQUFDLFdBQVcsR0FBRyxtQ0FBc0IsRUFBRSxVQUFVLEVBQUUsTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7R0FDL0U7Ozs7Ozs7OztlQXRCa0IsaUJBQWlCOztXQThCN0IsaUJBQUMsTUFBTSxFQUFFOzs7QUFDZCxpQ0EvQmlCLGlCQUFpQix5Q0ErQnBCLE1BQU0sRUFBRTs7QUFFdEIsVUFBTSxZQUFZLEdBQUcsU0FBZixZQUFZLENBQUksR0FBRyxFQUFjOzBDQUFULElBQUk7QUFBSixjQUFJOzs7QUFDaEMsY0FBSyxJQUFJLE1BQUEsU0FBQyxNQUFNLEVBQUUsR0FBRyxTQUFLLElBQUksRUFBQyxDQUFDO09BQ2pDLENBQUM7O0FBRUYsVUFBTSxlQUFlLEdBQUcsU0FBbEIsZUFBZSxDQUFJLEdBQUcsRUFBRSxRQUFRLEVBQUs7QUFDekMsY0FBSyxPQUFPLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztPQUNyQyxDQUFDOztBQUVGLFVBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxlQUFlLENBQUMsQ0FBQztLQUN2RDs7O1NBMUNrQixpQkFBaUI7OztxQkFBakIsaUJBQWlCIiwiZmlsZSI6Ii9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvc2VydmVyL1NlcnZlckNhbGlicmF0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENhbGlicmF0aW9uU2VydmVyIGZyb20gJ2NhbGlicmF0aW9uL3NlcnZlcic7XG5pbXBvcnQgU2VydmVyTW9kdWxlIGZyb20gJy4vU2VydmVyTW9kdWxlJztcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2ZXJDYWxpYnJhdGlvbiBleHRlbmRzIFNlcnZlck1vZHVsZSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBvZiB0aGUgY2FsaWJyYXRpb24gc2VydmVyIG1vZHVsZS5cbiAgICpcbiAgICogTm90ZSB0aGF0IHRoZSByZWNlaXZlIGZ1bmN0aW9ucyBhcmUgcmVnaXN0ZXJlZCBieSB7QGxpbmtjb2RlXG4gICAqIENhbGlicmF0aW9ufmNvbm5lY3R9LlxuICAgKlxuICAgKiBAY29uc3RydWN0cyBDYWxpYnJhdGlvblxuICAgKiBAcGFyYW0ge09iamVjdH0gW3BhcmFtc11cbiAgICogQHBhcmFtIHtPYmplY3R9IFtwYXJhbXMucGVyc2lzdGVudF1cbiAgICogQHBhcmFtIHtPYmplY3R9IFtwYXJhbXMucGVyc2lzdGVudC5wYXRoPScuLi8uLi9kYXRhJ10gd2hlcmUgdG9cbiAgICogc3RvcmUgdGhlIHBlcnNpc3RlbnQgZmlsZVxuICAgKiBAcGFyYW0ge09iamVjdH0gW3BhcmFtcy5wZXJzaXN0ZW50LmZpbGU9J2NhbGlicmF0aW9uLmpzb24nXSBuYW1lXG4gICAqIG9mIHRoZSBwZXJzaXN0ZW50IGZpbGVcbiAgICovXG4gIGNvbnN0cnVjdG9yKHBhcmFtcyA9IHtcbiAgICBwZXJzaXN0ZW50OiB7XG4gICAgICBwYXRoOiAnLi4vLi4vZGF0YScsXG4gICAgICBmaWxlOiAnY2FsaWJyYXRpb24uanNvbidcbiAgICB9IH0gKSB7XG4gICAgICBzdXBlcihwYXJhbXMubmFtZSB8fCAnY2FsaWJyYXRpb24nKTtcbiAgICAgIHRoaXMuY2FsaWJyYXRpb24gPSBuZXcgQ2FsaWJyYXRpb25TZXJ2ZXIoeyBwZXJzaXN0ZW50OiBwYXJhbXMucGVyc2lzdGVudCB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciB0aGUgcmVjZWl2ZSBmdW5jdGlvbnMuXG4gICAqXG4gICAqIEBmdW5jdGlvbiBDYWxpYnJhdGlvbn5jb25uZWN0XG4gICAqIEBwYXJhbSB7U2VydmVyQ2xpZW50fSBjbGllbnRcbiAgICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgY29uc3Qgc2VuZENhbGxiYWNrID0gKGNtZCwgLi4uYXJncykgPT4ge1xuICAgICAgdGhpcy5zZW5kKGNsaWVudCwgY21kLCAuLi5hcmdzKTtcbiAgICB9O1xuXG4gICAgY29uc3QgcmVjZWl2ZUNhbGxiYWNrID0gKGNtZCwgY2FsbGJhY2spID0+IHtcbiAgICAgIHRoaXMucmVjZWl2ZShjbGllbnQsIGNtZCwgY2FsbGJhY2spO1xuICAgIH07XG5cbiAgICB0aGlzLmNhbGlicmF0aW9uLnN0YXJ0KHNlbmRDYWxsYmFjaywgcmVjZWl2ZUNhbGxiYWNrKTtcbiAgfVxuXG59XG4iXX0=