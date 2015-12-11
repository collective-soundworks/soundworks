'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _ServerModule2 = require('./ServerModule');

var _ServerModule3 = _interopRequireDefault(_ServerModule2);

/**
 * [server] Allow to indicate the approximate location of the client on a map.
 *
 * (See also {@link src/client/ClientLocator.js~ClientLocator} on the client side.)
 */

var ServerLocator = (function (_ServerModule) {
  _inherits(ServerLocator, _ServerModule);

  /**
   * Creates an instance of the class.
   * @param {Object} [options={}] Options.
   * @param {Object} [options.name='locator'] Name of the module.
   * @param {Object} [options.setup] Setup defining dimensions and background.
   * @param {String[]} [options.setup.width] Width of the setup.
   * @param {String[]} [options.setup.height] Height of the setup.
   * @param {String[]} [options.setup.background] Background (image) of the setup.
   */

  function ServerLocator() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ServerLocator);

    _get(Object.getPrototypeOf(ServerLocator.prototype), 'constructor', this).call(this, options.name || 'locator');

    /**
     * Setup defining dimensions and background.
     * @type {Object}
     */
    this.setup = options.setup;
  }

  /**
   * @private
   */

  _createClass(ServerLocator, [{
    key: 'connect',
    value: function connect(client) {
      var _this = this;

      _get(Object.getPrototypeOf(ServerLocator.prototype), 'connect', this).call(this, client);

      this.receive(client, 'request', function () {
        var area = undefined;
        var setup = _this.setup;

        if (setup) {
          area = {
            width: setup.width,
            height: setup.height,
            background: setup.background
          };
        }

        _this.send(client, 'area', area);
      });

      this.receive(client, 'coordinates', function (coordinates) {
        client.coordinates = coordinates;
      });

      this.receive(client, 'restart', function (coordinates) {
        client.coordinates = coordinates;
      });
    }
  }]);

  return ServerLocator;
})(_ServerModule3['default']);

exports['default'] = ServerLocator;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvU2VydmVyTG9jYXRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzZCQUF5QixnQkFBZ0I7Ozs7Ozs7Ozs7SUFRcEIsYUFBYTtZQUFiLGFBQWE7Ozs7Ozs7Ozs7OztBQVVyQixXQVZRLGFBQWEsR0FVTjtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBVkwsYUFBYTs7QUFXOUIsK0JBWGlCLGFBQWEsNkNBV3hCLE9BQU8sQ0FBQyxJQUFJLElBQUksU0FBUyxFQUFFOzs7Ozs7QUFNakMsUUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO0dBQzVCOzs7Ozs7ZUFsQmtCLGFBQWE7O1dBdUJ6QixpQkFBQyxNQUFNLEVBQUU7OztBQUNkLGlDQXhCaUIsYUFBYSx5Q0F3QmhCLE1BQU0sRUFBRTs7QUFFdEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLFlBQU07QUFDcEMsWUFBSSxJQUFJLEdBQUcsU0FBUyxDQUFDO0FBQ3JCLFlBQUksS0FBSyxHQUFHLE1BQUssS0FBSyxDQUFDOztBQUV2QixZQUFHLEtBQUssRUFBRTtBQUNSLGNBQUksR0FBRztBQUNMLGlCQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUs7QUFDbEIsa0JBQU0sRUFBRSxLQUFLLENBQUMsTUFBTTtBQUNwQixzQkFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVO1dBQzdCLENBQUM7U0FDSDs7QUFFRCxjQUFLLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO09BQ2pDLENBQUMsQ0FBQzs7QUFFSCxVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxhQUFhLEVBQUUsVUFBQyxXQUFXLEVBQUs7QUFDbkQsY0FBTSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7T0FDbEMsQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxVQUFDLFdBQVcsRUFBSztBQUMvQyxjQUFNLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztPQUNsQyxDQUFDLENBQUM7S0FDSjs7O1NBaERrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiJzcmMvc2VydmVyL1NlcnZlckxvY2F0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmVyTW9kdWxlIGZyb20gJy4vU2VydmVyTW9kdWxlJztcblxuXG4vKipcbiAqIFtzZXJ2ZXJdIEFsbG93IHRvIGluZGljYXRlIHRoZSBhcHByb3hpbWF0ZSBsb2NhdGlvbiBvZiB0aGUgY2xpZW50IG9uIGEgbWFwLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL2NsaWVudC9DbGllbnRMb2NhdG9yLmpzfkNsaWVudExvY2F0b3J9IG9uIHRoZSBjbGllbnQgc2lkZS4pXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlcnZlckxvY2F0b3IgZXh0ZW5kcyBTZXJ2ZXJNb2R1bGUge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiB0aGUgY2xhc3MuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLm5hbWU9J2xvY2F0b3InXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5zZXR1cF0gU2V0dXAgZGVmaW5pbmcgZGltZW5zaW9ucyBhbmQgYmFja2dyb3VuZC5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW29wdGlvbnMuc2V0dXAud2lkdGhdIFdpZHRoIG9mIHRoZSBzZXR1cC5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW29wdGlvbnMuc2V0dXAuaGVpZ2h0XSBIZWlnaHQgb2YgdGhlIHNldHVwLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbb3B0aW9ucy5zZXR1cC5iYWNrZ3JvdW5kXSBCYWNrZ3JvdW5kIChpbWFnZSkgb2YgdGhlIHNldHVwLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdsb2NhdG9yJyk7XG5cbiAgICAvKipcbiAgICAgKiBTZXR1cCBkZWZpbmluZyBkaW1lbnNpb25zIGFuZCBiYWNrZ3JvdW5kLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5zZXR1cCA9IG9wdGlvbnMuc2V0dXA7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3JlcXVlc3QnLCAoKSA9PiB7XG4gICAgICBsZXQgYXJlYSA9IHVuZGVmaW5lZDtcbiAgICAgIGxldCBzZXR1cCA9IHRoaXMuc2V0dXA7XG5cbiAgICAgIGlmKHNldHVwKSB7XG4gICAgICAgIGFyZWEgPSB7XG4gICAgICAgICAgd2lkdGg6IHNldHVwLndpZHRoLFxuICAgICAgICAgIGhlaWdodDogc2V0dXAuaGVpZ2h0LFxuICAgICAgICAgIGJhY2tncm91bmQ6IHNldHVwLmJhY2tncm91bmQsXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2VuZChjbGllbnQsICdhcmVhJywgYXJlYSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAnY29vcmRpbmF0ZXMnLCAoY29vcmRpbmF0ZXMpID0+IHtcbiAgICAgIGNsaWVudC5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuICAgIH0pO1xuXG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3Jlc3RhcnQnLCAoY29vcmRpbmF0ZXMpID0+IHtcbiAgICAgIGNsaWVudC5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuICAgIH0pO1xuICB9XG59XG4iXX0=