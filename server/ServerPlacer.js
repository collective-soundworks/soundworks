'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Module2 = require('./Module');

var _Module3 = _interopRequireDefault(_Module2);

/**
 * The {@link ServerPlacer} module allows to store the place of a client selected by the user through the interfacte provided by the {@link ClientPlacer}.
 */

var ServerPlacer = (function (_Module) {
  _inherits(ServerPlacer, _Module);

  /**
   * Creates an instance of the class.
   * @param {Object} [options={}] Options.
   * @param {Object} [options.name='placer'] Name of the module.
   */

  function ServerPlacer(options) {
    _classCallCheck(this, ServerPlacer);

    _get(Object.getPrototypeOf(ServerPlacer.prototype), 'constructor', this).call(this, options.name || 'placer');
  }

  /**
   * @private
   */

  _createClass(ServerPlacer, [{
    key: 'connect',
    value: function connect(client) {
      var _this = this;

      _get(Object.getPrototypeOf(ServerPlacer.prototype), 'connect', this).call(this, client);

      client.receive(this.name + ':information', function (index, label, coords) {
        client.modules[_this.name].index = index;
        client.modules[_this.name].label = label;
        client.coordinates = coords;
      });
    }
  }]);

  return ServerPlacer;
})(_Module3['default']);

exports['default'] = ServerPlacer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvU2VydmVyUGxhY2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7dUJBQW1CLFVBQVU7Ozs7Ozs7O0lBTVIsWUFBWTtZQUFaLFlBQVk7Ozs7Ozs7O0FBTXBCLFdBTlEsWUFBWSxDQU1uQixPQUFPLEVBQUU7MEJBTkYsWUFBWTs7QUFPN0IsK0JBUGlCLFlBQVksNkNBT3ZCLE9BQU8sQ0FBQyxJQUFJLElBQUksUUFBUSxFQUFFO0dBQ2pDOzs7Ozs7ZUFSa0IsWUFBWTs7V0FheEIsaUJBQUMsTUFBTSxFQUFFOzs7QUFDZCxpQ0FkaUIsWUFBWSx5Q0FjZixNQUFNLEVBQUU7O0FBRXRCLFlBQU0sQ0FBQyxPQUFPLENBQUksSUFBSSxDQUFDLElBQUksbUJBQWdCLFVBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUs7QUFDbkUsY0FBTSxDQUFDLE9BQU8sQ0FBQyxNQUFLLElBQUksQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDeEMsY0FBTSxDQUFDLE9BQU8sQ0FBQyxNQUFLLElBQUksQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDeEMsY0FBTSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7T0FDN0IsQ0FBQyxDQUFDO0tBQ0o7OztTQXJCa0IsWUFBWTs7O3FCQUFaLFlBQVkiLCJmaWxlIjoic3JjL3NlcnZlci9TZXJ2ZXJQbGFjZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTW9kdWxlIGZyb20gJy4vTW9kdWxlJztcblxuXG4vKipcbiAqIFRoZSB7QGxpbmsgU2VydmVyUGxhY2VyfSBtb2R1bGUgYWxsb3dzIHRvIHN0b3JlIHRoZSBwbGFjZSBvZiBhIGNsaWVudCBzZWxlY3RlZCBieSB0aGUgdXNlciB0aHJvdWdoIHRoZSBpbnRlcmZhY3RlIHByb3ZpZGVkIGJ5IHRoZSB7QGxpbmsgQ2xpZW50UGxhY2VyfS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmVyUGxhY2VyIGV4dGVuZHMgTW9kdWxlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5uYW1lPSdwbGFjZXInXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdwbGFjZXInKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICBjbGllbnQucmVjZWl2ZShgJHt0aGlzLm5hbWV9OmluZm9ybWF0aW9uYCwgKGluZGV4LCBsYWJlbCwgY29vcmRzKSA9PiB7XG4gICAgICBjbGllbnQubW9kdWxlc1t0aGlzLm5hbWVdLmluZGV4ID0gaW5kZXg7XG4gICAgICBjbGllbnQubW9kdWxlc1t0aGlzLm5hbWVdLmxhYmVsID0gbGFiZWw7XG4gICAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBjb29yZHM7XG4gICAgfSk7XG4gIH1cbn1cblxuIl19