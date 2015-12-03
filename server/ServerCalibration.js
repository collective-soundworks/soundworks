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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvU2VydmVyQ2FsaWJyYXRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztpQ0FBOEIsb0JBQW9COzs7OzZCQUN6QixnQkFBZ0I7Ozs7Ozs7O0lBS3BCLGlCQUFpQjtZQUFqQixpQkFBaUI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZXpCLFdBZlEsaUJBQWlCLEdBbUI1QjtRQUpJLE1BQU0seURBQUc7QUFDbkIsZ0JBQVUsRUFBRTtBQUNWLFlBQUksRUFBRSxZQUFZO0FBQ2xCLFlBQUksRUFBRSxrQkFBa0I7T0FDekIsRUFBRTs7MEJBbkJjLGlCQUFpQjs7QUFvQmhDLCtCQXBCZSxpQkFBaUIsNkNBb0IxQixNQUFNLENBQUMsSUFBSSxJQUFJLGFBQWEsRUFBRTtBQUNwQyxRQUFJLENBQUMsV0FBVyxHQUFHLG1DQUFzQixFQUFFLFVBQVUsRUFBRSxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztHQUMvRTs7Ozs7Ozs7O2VBdEJrQixpQkFBaUI7O1dBOEI3QixpQkFBQyxNQUFNLEVBQUU7OztBQUNkLGlDQS9CaUIsaUJBQWlCLHlDQStCcEIsTUFBTSxFQUFFOztBQUV0QixVQUFNLFlBQVksR0FBRyxTQUFmLFlBQVksQ0FBSSxHQUFHLEVBQWM7MENBQVQsSUFBSTtBQUFKLGNBQUk7OztBQUNoQyxjQUFLLElBQUksTUFBQSxTQUFDLE1BQU0sRUFBRSxHQUFHLFNBQUssSUFBSSxFQUFDLENBQUM7T0FDakMsQ0FBQzs7QUFFRixVQUFNLGVBQWUsR0FBRyxTQUFsQixlQUFlLENBQUksR0FBRyxFQUFFLFFBQVEsRUFBSztBQUN6QyxjQUFLLE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO09BQ3JDLENBQUM7O0FBRUYsVUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFLGVBQWUsQ0FBQyxDQUFDO0tBQ3ZEOzs7U0ExQ2tCLGlCQUFpQjs7O3FCQUFqQixpQkFBaUIiLCJmaWxlIjoic3JjL3NlcnZlci9TZXJ2ZXJDYWxpYnJhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDYWxpYnJhdGlvblNlcnZlciBmcm9tICdjYWxpYnJhdGlvbi9zZXJ2ZXInO1xuaW1wb3J0IFNlcnZlck1vZHVsZSBmcm9tICcuL1NlcnZlck1vZHVsZSc7XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmVyQ2FsaWJyYXRpb24gZXh0ZW5kcyBTZXJ2ZXJNb2R1bGUge1xuICAvKipcbiAgICogQ29uc3RydWN0b3Igb2YgdGhlIGNhbGlicmF0aW9uIHNlcnZlciBtb2R1bGUuXG4gICAqXG4gICAqIE5vdGUgdGhhdCB0aGUgcmVjZWl2ZSBmdW5jdGlvbnMgYXJlIHJlZ2lzdGVyZWQgYnkge0BsaW5rY29kZVxuICAgKiBDYWxpYnJhdGlvbn5jb25uZWN0fS5cbiAgICpcbiAgICogQGNvbnN0cnVjdHMgQ2FsaWJyYXRpb25cbiAgICogQHBhcmFtIHtPYmplY3R9IFtwYXJhbXNdXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbcGFyYW1zLnBlcnNpc3RlbnRdXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbcGFyYW1zLnBlcnNpc3RlbnQucGF0aD0nLi4vLi4vZGF0YSddIHdoZXJlIHRvXG4gICAqIHN0b3JlIHRoZSBwZXJzaXN0ZW50IGZpbGVcbiAgICogQHBhcmFtIHtPYmplY3R9IFtwYXJhbXMucGVyc2lzdGVudC5maWxlPSdjYWxpYnJhdGlvbi5qc29uJ10gbmFtZVxuICAgKiBvZiB0aGUgcGVyc2lzdGVudCBmaWxlXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwYXJhbXMgPSB7XG4gICAgcGVyc2lzdGVudDoge1xuICAgICAgcGF0aDogJy4uLy4uL2RhdGEnLFxuICAgICAgZmlsZTogJ2NhbGlicmF0aW9uLmpzb24nXG4gICAgfSB9ICkge1xuICAgICAgc3VwZXIocGFyYW1zLm5hbWUgfHwgJ2NhbGlicmF0aW9uJyk7XG4gICAgICB0aGlzLmNhbGlicmF0aW9uID0gbmV3IENhbGlicmF0aW9uU2VydmVyKHsgcGVyc2lzdGVudDogcGFyYW1zLnBlcnNpc3RlbnQgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgdGhlIHJlY2VpdmUgZnVuY3Rpb25zLlxuICAgKlxuICAgKiBAZnVuY3Rpb24gQ2FsaWJyYXRpb25+Y29ubmVjdFxuICAgKiBAcGFyYW0ge1NlcnZlckNsaWVudH0gY2xpZW50XG4gICAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIGNvbnN0IHNlbmRDYWxsYmFjayA9IChjbWQsIC4uLmFyZ3MpID0+IHtcbiAgICAgIHRoaXMuc2VuZChjbGllbnQsIGNtZCwgLi4uYXJncyk7XG4gICAgfTtcblxuICAgIGNvbnN0IHJlY2VpdmVDYWxsYmFjayA9IChjbWQsIGNhbGxiYWNrKSA9PiB7XG4gICAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCBjbWQsIGNhbGxiYWNrKTtcbiAgICB9O1xuXG4gICAgdGhpcy5jYWxpYnJhdGlvbi5zdGFydChzZW5kQ2FsbGJhY2ssIHJlY2VpdmVDYWxsYmFjayk7XG4gIH1cblxufVxuIl19