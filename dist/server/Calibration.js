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

var _Module2 = require('./Module');

var _Module3 = _interopRequireDefault(_Module2);

var Calibration = (function (_Module) {
  _inherits(Calibration, _Module);

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

  function Calibration() {
    var params = arguments.length <= 0 || arguments[0] === undefined ? {
      persistent: {
        path: '../../data',
        file: 'calibration.json'
      } } : arguments[0];

    _classCallCheck(this, Calibration);

    _get(Object.getPrototypeOf(Calibration.prototype), 'constructor', this).call(this, params.name || 'calibration');
    this.calibration = new _calibrationServer2['default']({ persistent: params.persistent });
  }

  /**
   * Register the receive functions.
   *
   * @function Calibration~connect
   * @param {ServerClient} client
   */

  _createClass(Calibration, [{
    key: 'connect',
    value: function connect(client) {
      _get(Object.getPrototypeOf(Calibration.prototype), 'connect', this).call(this, client);

      var sendCallback = function sendCallback(cmd) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        client.send.apply(client, [cmd].concat(args));
      };
      var receiveCallback = function receiveCallback(cmd, callback) {
        client.receive(cmd, callback);
      };
      this.calibration.start(sendCallback, receiveCallback);
    }
  }]);

  return Calibration;
})(_Module3['default']);

exports['default'] = Calibration;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvQ2FsaWJyYXRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztpQ0FBOEIsb0JBQW9COzs7O3VCQUMvQixVQUFVOzs7O0lBR1IsV0FBVztZQUFYLFdBQVc7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZW5CLFdBZlEsV0FBVyxHQW1CdEI7UUFKSSxNQUFNLHlEQUFHO0FBQ25CLGdCQUFVLEVBQUU7QUFDVixZQUFJLEVBQUUsWUFBWTtBQUNsQixZQUFJLEVBQUUsa0JBQWtCO09BQ3pCLEVBQUU7OzBCQW5CYyxXQUFXOztBQW9CMUIsK0JBcEJlLFdBQVcsNkNBb0JwQixNQUFNLENBQUMsSUFBSSxJQUFJLGFBQWEsRUFBRTtBQUNwQyxRQUFJLENBQUMsV0FBVyxHQUFHLG1DQUFzQixFQUFFLFVBQVUsRUFBRSxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztHQUMvRTs7Ozs7Ozs7O2VBdEJrQixXQUFXOztXQThCdkIsaUJBQUMsTUFBTSxFQUFFO0FBQ2QsaUNBL0JpQixXQUFXLHlDQStCZCxNQUFNLEVBQUU7O0FBRXRCLFVBQU0sWUFBWSxHQUFHLFNBQWYsWUFBWSxDQUFJLEdBQUcsRUFBYzswQ0FBVCxJQUFJO0FBQUosY0FBSTs7O0FBQU8sY0FBTSxDQUFDLElBQUksTUFBQSxDQUFYLE1BQU0sR0FBTSxHQUFHLFNBQUssSUFBSSxFQUFDLENBQUM7T0FBRSxDQUFDO0FBQ3RFLFVBQU0sZUFBZSxHQUFHLFNBQWxCLGVBQWUsQ0FBSSxHQUFHLEVBQUUsUUFBUSxFQUFLO0FBQUUsY0FBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7T0FBRSxDQUFDO0FBQzlFLFVBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxlQUFlLENBQUMsQ0FBQztLQUN2RDs7O1NBcENrQixXQUFXOzs7cUJBQVgsV0FBVyIsImZpbGUiOiJzcmMvc2VydmVyL0NhbGlicmF0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENhbGlicmF0aW9uU2VydmVyIGZyb20gJ2NhbGlicmF0aW9uL3NlcnZlcic7XG5pbXBvcnQgTW9kdWxlIGZyb20gJy4vTW9kdWxlJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYWxpYnJhdGlvbiBleHRlbmRzIE1vZHVsZSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBvZiB0aGUgY2FsaWJyYXRpb24gc2VydmVyIG1vZHVsZS5cbiAgICpcbiAgICogTm90ZSB0aGF0IHRoZSByZWNlaXZlIGZ1bmN0aW9ucyBhcmUgcmVnaXN0ZXJlZCBieSB7QGxpbmtjb2RlXG4gICAqIENhbGlicmF0aW9ufmNvbm5lY3R9LlxuICAgKlxuICAgKiBAY29uc3RydWN0cyBDYWxpYnJhdGlvblxuICAgKiBAcGFyYW0ge09iamVjdH0gW3BhcmFtc11cbiAgICogQHBhcmFtIHtPYmplY3R9IFtwYXJhbXMucGVyc2lzdGVudF1cbiAgICogQHBhcmFtIHtPYmplY3R9IFtwYXJhbXMucGVyc2lzdGVudC5wYXRoPScuLi8uLi9kYXRhJ10gd2hlcmUgdG9cbiAgICogc3RvcmUgdGhlIHBlcnNpc3RlbnQgZmlsZVxuICAgKiBAcGFyYW0ge09iamVjdH0gW3BhcmFtcy5wZXJzaXN0ZW50LmZpbGU9J2NhbGlicmF0aW9uLmpzb24nXSBuYW1lXG4gICAqIG9mIHRoZSBwZXJzaXN0ZW50IGZpbGVcbiAgICovXG4gIGNvbnN0cnVjdG9yKHBhcmFtcyA9IHtcbiAgICBwZXJzaXN0ZW50OiB7XG4gICAgICBwYXRoOiAnLi4vLi4vZGF0YScsXG4gICAgICBmaWxlOiAnY2FsaWJyYXRpb24uanNvbidcbiAgICB9IH0gKSB7XG4gICAgICBzdXBlcihwYXJhbXMubmFtZSB8fCAnY2FsaWJyYXRpb24nKTtcbiAgICAgIHRoaXMuY2FsaWJyYXRpb24gPSBuZXcgQ2FsaWJyYXRpb25TZXJ2ZXIoeyBwZXJzaXN0ZW50OiBwYXJhbXMucGVyc2lzdGVudCB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciB0aGUgcmVjZWl2ZSBmdW5jdGlvbnMuXG4gICAqXG4gICAqIEBmdW5jdGlvbiBDYWxpYnJhdGlvbn5jb25uZWN0XG4gICAqIEBwYXJhbSB7U2VydmVyQ2xpZW50fSBjbGllbnRcbiAgICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgY29uc3Qgc2VuZENhbGxiYWNrID0gKGNtZCwgLi4uYXJncykgPT4geyBjbGllbnQuc2VuZChjbWQsIC4uLmFyZ3MpOyB9O1xuICAgIGNvbnN0IHJlY2VpdmVDYWxsYmFjayA9IChjbWQsIGNhbGxiYWNrKSA9PiB7IGNsaWVudC5yZWNlaXZlKGNtZCwgY2FsbGJhY2spOyB9O1xuICAgIHRoaXMuY2FsaWJyYXRpb24uc3RhcnQoc2VuZENhbGxiYWNrLCByZWNlaXZlQ2FsbGJhY2spO1xuICB9XG5cbn1cblxuIl19