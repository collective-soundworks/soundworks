'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _server = require('calibration/server');

var _server2 = _interopRequireDefault(_server);

var _ServerModule2 = require('./ServerModule');

var _ServerModule3 = _interopRequireDefault(_ServerModule2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @private
 */

var ServerCalibration = function (_ServerModule) {
  (0, _inherits3.default)(ServerCalibration, _ServerModule);

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
    (0, _classCallCheck3.default)(this, ServerCalibration);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ServerCalibration).call(this, params.name || 'calibration'));

    _this.calibration = new _server2.default({ persistent: params.persistent });
    return _this;
  }

  /**
   * Register the receive functions.
   *
   * @function Calibration~connect
   * @param {ServerClient} client
   */


  (0, _createClass3.default)(ServerCalibration, [{
    key: 'connect',
    value: function connect(client) {
      var _this2 = this;

      (0, _get3.default)((0, _getPrototypeOf2.default)(ServerCalibration.prototype), 'connect', this).call(this, client);

      var sendCallback = function sendCallback(cmd) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        _this2.send.apply(_this2, [client, cmd].concat(args));
      };

      var receiveCallback = function receiveCallback(cmd, callback) {
        _this2.receive(client, cmd, callback);
      };

      this.calibration.start(sendCallback, receiveCallback);
    }
  }]);
  return ServerCalibration;
}(_ServerModule3.default);

exports.default = ServerCalibration;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlcnZlckNhbGlicmF0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7Ozs7Ozs7SUFLcUI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWVuQixXQWZtQixpQkFlbkIsR0FJUTtRQUpJLCtEQUFTO0FBQ25CLGtCQUFZO0FBQ1YsY0FBTSxZQUFOO0FBQ0EsY0FBTSxrQkFBTjtPQUZGLGtCQUdNO3dDQW5CVyxtQkFtQlg7OzZGQW5CVyw4QkFvQlQsT0FBTyxJQUFQLElBQWUsYUFBZixHQURGOztBQUVKLFVBQUssV0FBTCxHQUFtQixxQkFBc0IsRUFBRSxZQUFZLE9BQU8sVUFBUCxFQUFwQyxDQUFuQixDQUZJOztHQUpSOzs7Ozs7Ozs7OzZCQWZtQjs7NEJBOEJYLFFBQVE7OztBQUNkLHVEQS9CaUIsMERBK0JILE9BQWQsQ0FEYzs7QUFHZCxVQUFNLGVBQWUsU0FBZixZQUFlLENBQUMsR0FBRCxFQUFrQjswQ0FBVDs7U0FBUzs7QUFDckMsZUFBSyxJQUFMLGdCQUFVLFFBQVEsWUFBUSxLQUExQixFQURxQztPQUFsQixDQUhQOztBQU9kLFVBQU0sa0JBQWtCLFNBQWxCLGVBQWtCLENBQUMsR0FBRCxFQUFNLFFBQU4sRUFBbUI7QUFDekMsZUFBSyxPQUFMLENBQWEsTUFBYixFQUFxQixHQUFyQixFQUEwQixRQUExQixFQUR5QztPQUFuQixDQVBWOztBQVdkLFdBQUssV0FBTCxDQUFpQixLQUFqQixDQUF1QixZQUF2QixFQUFxQyxlQUFyQyxFQVhjOzs7U0E5QkciLCJmaWxlIjoiU2VydmVyQ2FsaWJyYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ2FsaWJyYXRpb25TZXJ2ZXIgZnJvbSAnY2FsaWJyYXRpb24vc2VydmVyJztcbmltcG9ydCBTZXJ2ZXJNb2R1bGUgZnJvbSAnLi9TZXJ2ZXJNb2R1bGUnO1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlcnZlckNhbGlicmF0aW9uIGV4dGVuZHMgU2VydmVyTW9kdWxlIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIG9mIHRoZSBjYWxpYnJhdGlvbiBzZXJ2ZXIgbW9kdWxlLlxuICAgKlxuICAgKiBOb3RlIHRoYXQgdGhlIHJlY2VpdmUgZnVuY3Rpb25zIGFyZSByZWdpc3RlcmVkIGJ5IHtAbGlua2NvZGVcbiAgICogQ2FsaWJyYXRpb25+Y29ubmVjdH0uXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RzIENhbGlicmF0aW9uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbcGFyYW1zXVxuICAgKiBAcGFyYW0ge09iamVjdH0gW3BhcmFtcy5wZXJzaXN0ZW50XVxuICAgKiBAcGFyYW0ge09iamVjdH0gW3BhcmFtcy5wZXJzaXN0ZW50LnBhdGg9Jy4uLy4uL2RhdGEnXSB3aGVyZSB0b1xuICAgKiBzdG9yZSB0aGUgcGVyc2lzdGVudCBmaWxlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbcGFyYW1zLnBlcnNpc3RlbnQuZmlsZT0nY2FsaWJyYXRpb24uanNvbiddIG5hbWVcbiAgICogb2YgdGhlIHBlcnNpc3RlbnQgZmlsZVxuICAgKi9cbiAgY29uc3RydWN0b3IocGFyYW1zID0ge1xuICAgIHBlcnNpc3RlbnQ6IHtcbiAgICAgIHBhdGg6ICcuLi8uLi9kYXRhJyxcbiAgICAgIGZpbGU6ICdjYWxpYnJhdGlvbi5qc29uJ1xuICAgIH0gfSApIHtcbiAgICAgIHN1cGVyKHBhcmFtcy5uYW1lIHx8ICdjYWxpYnJhdGlvbicpO1xuICAgICAgdGhpcy5jYWxpYnJhdGlvbiA9IG5ldyBDYWxpYnJhdGlvblNlcnZlcih7IHBlcnNpc3RlbnQ6IHBhcmFtcy5wZXJzaXN0ZW50IH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIHRoZSByZWNlaXZlIGZ1bmN0aW9ucy5cbiAgICpcbiAgICogQGZ1bmN0aW9uIENhbGlicmF0aW9ufmNvbm5lY3RcbiAgICogQHBhcmFtIHtTZXJ2ZXJDbGllbnR9IGNsaWVudFxuICAgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICBjb25zdCBzZW5kQ2FsbGJhY2sgPSAoY21kLCAuLi5hcmdzKSA9PiB7XG4gICAgICB0aGlzLnNlbmQoY2xpZW50LCBjbWQsIC4uLmFyZ3MpO1xuICAgIH07XG5cbiAgICBjb25zdCByZWNlaXZlQ2FsbGJhY2sgPSAoY21kLCBjYWxsYmFjaykgPT4ge1xuICAgICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgY21kLCBjYWxsYmFjayk7XG4gICAgfTtcblxuICAgIHRoaXMuY2FsaWJyYXRpb24uc3RhcnQoc2VuZENhbGxiYWNrLCByZWNlaXZlQ2FsbGJhY2spO1xuICB9XG5cbn1cbiJdfQ==