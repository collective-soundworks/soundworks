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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O2lDQUE4QixvQkFBb0I7Ozs7NkJBQ3pCLGdCQUFnQjs7Ozs7Ozs7SUFLcEIsaUJBQWlCO1lBQWpCLGlCQUFpQjs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFlekIsV0FmUSxpQkFBaUIsR0FtQjVCO1FBSkksTUFBTSx5REFBRztBQUNuQixnQkFBVSxFQUFFO0FBQ1YsWUFBSSxFQUFFLFlBQVk7QUFDbEIsWUFBSSxFQUFFLGtCQUFrQjtPQUN6QixFQUFFOzswQkFuQmMsaUJBQWlCOztBQW9CaEMsK0JBcEJlLGlCQUFpQiw2Q0FvQjFCLE1BQU0sQ0FBQyxJQUFJLElBQUksYUFBYSxFQUFFO0FBQ3BDLFFBQUksQ0FBQyxXQUFXLEdBQUcsbUNBQXNCLEVBQUUsVUFBVSxFQUFFLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO0dBQy9FOzs7Ozs7Ozs7ZUF0QmtCLGlCQUFpQjs7V0E4QjdCLGlCQUFDLE1BQU0sRUFBRTs7O0FBQ2QsaUNBL0JpQixpQkFBaUIseUNBK0JwQixNQUFNLEVBQUU7O0FBRXRCLFVBQU0sWUFBWSxHQUFHLFNBQWYsWUFBWSxDQUFJLEdBQUcsRUFBYzswQ0FBVCxJQUFJO0FBQUosY0FBSTs7O0FBQ2hDLGNBQUssSUFBSSxNQUFBLFNBQUMsTUFBTSxFQUFFLEdBQUcsU0FBSyxJQUFJLEVBQUMsQ0FBQztPQUNqQyxDQUFDOztBQUVGLFVBQU0sZUFBZSxHQUFHLFNBQWxCLGVBQWUsQ0FBSSxHQUFHLEVBQUUsUUFBUSxFQUFLO0FBQ3pDLGNBQUssT0FBTyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7T0FDckMsQ0FBQzs7QUFFRixVQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsZUFBZSxDQUFDLENBQUM7S0FDdkQ7OztTQTFDa0IsaUJBQWlCOzs7cUJBQWpCLGlCQUFpQiIsImZpbGUiOiJzcmMvY2xpZW50L0NsaWVudENoZWNraW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ2FsaWJyYXRpb25TZXJ2ZXIgZnJvbSAnY2FsaWJyYXRpb24vc2VydmVyJztcbmltcG9ydCBTZXJ2ZXJNb2R1bGUgZnJvbSAnLi9TZXJ2ZXJNb2R1bGUnO1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlcnZlckNhbGlicmF0aW9uIGV4dGVuZHMgU2VydmVyTW9kdWxlIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIG9mIHRoZSBjYWxpYnJhdGlvbiBzZXJ2ZXIgbW9kdWxlLlxuICAgKlxuICAgKiBOb3RlIHRoYXQgdGhlIHJlY2VpdmUgZnVuY3Rpb25zIGFyZSByZWdpc3RlcmVkIGJ5IHtAbGlua2NvZGVcbiAgICogQ2FsaWJyYXRpb25+Y29ubmVjdH0uXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RzIENhbGlicmF0aW9uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbcGFyYW1zXVxuICAgKiBAcGFyYW0ge09iamVjdH0gW3BhcmFtcy5wZXJzaXN0ZW50XVxuICAgKiBAcGFyYW0ge09iamVjdH0gW3BhcmFtcy5wZXJzaXN0ZW50LnBhdGg9Jy4uLy4uL2RhdGEnXSB3aGVyZSB0b1xuICAgKiBzdG9yZSB0aGUgcGVyc2lzdGVudCBmaWxlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbcGFyYW1zLnBlcnNpc3RlbnQuZmlsZT0nY2FsaWJyYXRpb24uanNvbiddIG5hbWVcbiAgICogb2YgdGhlIHBlcnNpc3RlbnQgZmlsZVxuICAgKi9cbiAgY29uc3RydWN0b3IocGFyYW1zID0ge1xuICAgIHBlcnNpc3RlbnQ6IHtcbiAgICAgIHBhdGg6ICcuLi8uLi9kYXRhJyxcbiAgICAgIGZpbGU6ICdjYWxpYnJhdGlvbi5qc29uJ1xuICAgIH0gfSApIHtcbiAgICAgIHN1cGVyKHBhcmFtcy5uYW1lIHx8ICdjYWxpYnJhdGlvbicpO1xuICAgICAgdGhpcy5jYWxpYnJhdGlvbiA9IG5ldyBDYWxpYnJhdGlvblNlcnZlcih7IHBlcnNpc3RlbnQ6IHBhcmFtcy5wZXJzaXN0ZW50IH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIHRoZSByZWNlaXZlIGZ1bmN0aW9ucy5cbiAgICpcbiAgICogQGZ1bmN0aW9uIENhbGlicmF0aW9ufmNvbm5lY3RcbiAgICogQHBhcmFtIHtTZXJ2ZXJDbGllbnR9IGNsaWVudFxuICAgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICBjb25zdCBzZW5kQ2FsbGJhY2sgPSAoY21kLCAuLi5hcmdzKSA9PiB7XG4gICAgICB0aGlzLnNlbmQoY2xpZW50LCBjbWQsIC4uLmFyZ3MpO1xuICAgIH07XG5cbiAgICBjb25zdCByZWNlaXZlQ2FsbGJhY2sgPSAoY21kLCBjYWxsYmFjaykgPT4ge1xuICAgICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgY21kLCBjYWxsYmFjayk7XG4gICAgfTtcblxuICAgIHRoaXMuY2FsaWJyYXRpb24uc3RhcnQoc2VuZENhbGxiYWNrLCByZWNlaXZlQ2FsbGJhY2spO1xuICB9XG5cbn1cbiJdfQ==