'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var ServerModule = require('./ServerModule');
// import ServerModule from './ServerModule.es6.js';

/**
 * The {@link ServerPlacer} module allows to store the place of a client selected by the user through the interfacte provided by the {@link ClientPlacer}.
 */

var ServerPlacer = (function (_ServerModule) {
  _inherits(ServerPlacer, _ServerModule);

  // export default class ServerPlacer extends ServerModule {
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
})(ServerModule);

module.exports = ServerPlacer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvUGxhY2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7Ozs7Ozs7OztBQUViLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOzs7Ozs7O0lBTXpDLFlBQVk7WUFBWixZQUFZOzs7Ozs7Ozs7QUFPTCxXQVBQLFlBQVksQ0FPSixPQUFPLEVBQUU7MEJBUGpCLFlBQVk7O0FBUWQsK0JBUkUsWUFBWSw2Q0FRUixPQUFPLENBQUMsSUFBSSxJQUFJLFFBQVEsRUFBRTtHQUNqQzs7Ozs7O2VBVEcsWUFBWTs7V0FjVCxpQkFBQyxNQUFNLEVBQUU7OztBQUNkLGlDQWZFLFlBQVkseUNBZUEsTUFBTSxFQUFFOztBQUV0QixZQUFNLENBQUMsT0FBTyxDQUFJLElBQUksQ0FBQyxJQUFJLG1CQUFnQixVQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFLO0FBQ25FLGNBQU0sQ0FBQyxPQUFPLENBQUMsTUFBSyxJQUFJLENBQUMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ3hDLGNBQU0sQ0FBQyxPQUFPLENBQUMsTUFBSyxJQUFJLENBQUMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ3hDLGNBQU0sQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDO09BQzdCLENBQUMsQ0FBQztLQUNKOzs7U0F0QkcsWUFBWTtHQUFTLFlBQVk7O0FBeUJ2QyxNQUFNLENBQUMsT0FBTyxHQUFHLFlBQVksQ0FBQyIsImZpbGUiOiJzcmMvc2VydmVyL1BsYWNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuY29uc3QgU2VydmVyTW9kdWxlID0gcmVxdWlyZSgnLi9TZXJ2ZXJNb2R1bGUnKTtcbi8vIGltcG9ydCBTZXJ2ZXJNb2R1bGUgZnJvbSAnLi9TZXJ2ZXJNb2R1bGUuZXM2LmpzJztcblxuLyoqXG4gKiBUaGUge0BsaW5rIFNlcnZlclBsYWNlcn0gbW9kdWxlIGFsbG93cyB0byBzdG9yZSB0aGUgcGxhY2Ugb2YgYSBjbGllbnQgc2VsZWN0ZWQgYnkgdGhlIHVzZXIgdGhyb3VnaCB0aGUgaW50ZXJmYWN0ZSBwcm92aWRlZCBieSB0aGUge0BsaW5rIENsaWVudFBsYWNlcn0uXG4gKi9cbmNsYXNzIFNlcnZlclBsYWNlciBleHRlbmRzIFNlcnZlck1vZHVsZSB7XG4vLyBleHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2ZXJQbGFjZXIgZXh0ZW5kcyBTZXJ2ZXJNb2R1bGUge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiB0aGUgY2xhc3MuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLm5hbWU9J3BsYWNlciddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ3BsYWNlcicpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIGNsaWVudC5yZWNlaXZlKGAke3RoaXMubmFtZX06aW5mb3JtYXRpb25gLCAoaW5kZXgsIGxhYmVsLCBjb29yZHMpID0+IHtcbiAgICAgIGNsaWVudC5tb2R1bGVzW3RoaXMubmFtZV0uaW5kZXggPSBpbmRleDtcbiAgICAgIGNsaWVudC5tb2R1bGVzW3RoaXMubmFtZV0ubGFiZWwgPSBsYWJlbDtcbiAgICAgIGNsaWVudC5jb29yZGluYXRlcyA9IGNvb3JkcztcbiAgICB9KTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNlcnZlclBsYWNlcjtcbiJdfQ==