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

      this.receive(client, 'information', function (index, label, coords) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvU2VydmVyUGxhY2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7dUJBQW1CLFVBQVU7Ozs7Ozs7O0lBTVIsWUFBWTtZQUFaLFlBQVk7Ozs7Ozs7O0FBTXBCLFdBTlEsWUFBWSxDQU1uQixPQUFPLEVBQUU7MEJBTkYsWUFBWTs7QUFPN0IsK0JBUGlCLFlBQVksNkNBT3ZCLE9BQU8sQ0FBQyxJQUFJLElBQUksUUFBUSxFQUFFO0dBQ2pDOzs7Ozs7ZUFSa0IsWUFBWTs7V0FheEIsaUJBQUMsTUFBTSxFQUFFOzs7QUFDZCxpQ0FkaUIsWUFBWSx5Q0FjZixNQUFNLEVBQUU7O0FBRXRCLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLGFBQWEsRUFBRSxVQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFLO0FBQzVELGNBQU0sQ0FBQyxPQUFPLENBQUMsTUFBSyxJQUFJLENBQUMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ3hDLGNBQU0sQ0FBQyxPQUFPLENBQUMsTUFBSyxJQUFJLENBQUMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ3hDLGNBQU0sQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDO09BQzdCLENBQUMsQ0FBQztLQUNKOzs7U0FyQmtCLFlBQVk7OztxQkFBWixZQUFZIiwiZmlsZSI6InNyYy9zZXJ2ZXIvU2VydmVyUGxhY2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE1vZHVsZSBmcm9tICcuL01vZHVsZSc7XG5cblxuLyoqXG4gKiBUaGUge0BsaW5rIFNlcnZlclBsYWNlcn0gbW9kdWxlIGFsbG93cyB0byBzdG9yZSB0aGUgcGxhY2Ugb2YgYSBjbGllbnQgc2VsZWN0ZWQgYnkgdGhlIHVzZXIgdGhyb3VnaCB0aGUgaW50ZXJmYWN0ZSBwcm92aWRlZCBieSB0aGUge0BsaW5rIENsaWVudFBsYWNlcn0uXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlcnZlclBsYWNlciBleHRlbmRzIE1vZHVsZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMubmFtZT0ncGxhY2VyJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAncGxhY2VyJyk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ2luZm9ybWF0aW9uJywgKGluZGV4LCBsYWJlbCwgY29vcmRzKSA9PiB7XG4gICAgICBjbGllbnQubW9kdWxlc1t0aGlzLm5hbWVdLmluZGV4ID0gaW5kZXg7XG4gICAgICBjbGllbnQubW9kdWxlc1t0aGlzLm5hbWVdLmxhYmVsID0gbGFiZWw7XG4gICAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBjb29yZHM7XG4gICAgfSk7XG4gIH1cbn1cblxuIl19