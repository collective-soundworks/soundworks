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
 * [server] Allow to indicate the approximate location of the client on a map (that graphically represents a {@link Setup}) via a dialog.
 *
 * (See also {@link src/client/ClientLocator.js~ClientLocator} on the client side.)
 */

var ServerLocator = (function (_Module) {
  _inherits(ServerLocator, _Module);

  /**
   * Creates an instance of the class.
   * @param {Object} [options={}] Options.
   * @param {Object} [options.name='locator'] Name of the module.
   * @param {Object} [options.setup] Setup used in the scenario, if any (cf. {@link ServerSetup}).
   */

  function ServerLocator() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ServerLocator);

    _get(Object.getPrototypeOf(ServerLocator.prototype), 'constructor', this).call(this, options.name || 'locator');

    /**
     * Setup used by the locator, if any.
     * @type {Setup}
     */
    this.setup = options.setup || null;
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
        if (_this.setup) {
          var surface = _this.setup.getSurface();
          _this.send(client, 'surface', surface);
        } else {
          throw new Error('ServerLocator requires a setup.');
        }
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
})(_Module3['default']);

exports['default'] = ServerLocator;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvU2VydmVyTG9jYXRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3VCQUFtQixVQUFVOzs7Ozs7Ozs7O0lBUVIsYUFBYTtZQUFiLGFBQWE7Ozs7Ozs7OztBQU9yQixXQVBRLGFBQWEsR0FPTjtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBUEwsYUFBYTs7QUFROUIsK0JBUmlCLGFBQWEsNkNBUXhCLE9BQU8sQ0FBQyxJQUFJLElBQUksU0FBUyxFQUFFOzs7Ozs7QUFNakMsUUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQztHQUNwQzs7Ozs7O2VBZmtCLGFBQWE7O1dBb0J6QixpQkFBQyxNQUFNLEVBQUU7OztBQUNkLGlDQXJCaUIsYUFBYSx5Q0FxQmhCLE1BQU0sRUFBRTs7QUFFdEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLFlBQU07QUFDcEMsWUFBSSxNQUFLLEtBQUssRUFBRTtBQUNkLGNBQU0sT0FBTyxHQUFHLE1BQUssS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ3hDLGdCQUFLLElBQUksQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQ3ZDLE1BQU07QUFDTCxnQkFBTSxJQUFJLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO1NBQ3BEO09BQ0YsQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLGFBQWEsRUFBRSxVQUFDLFdBQVcsRUFBSztBQUNuRCxjQUFNLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztPQUNsQyxDQUFDLENBQUM7O0FBRUgsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLFVBQUMsV0FBVyxFQUFLO0FBQy9DLGNBQU0sQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO09BQ2xDLENBQUMsQ0FBQztLQUNKOzs7U0F2Q2tCLGFBQWE7OztxQkFBYixhQUFhIiwiZmlsZSI6InNyYy9zZXJ2ZXIvU2VydmVyTG9jYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBNb2R1bGUgZnJvbSAnLi9Nb2R1bGUnO1xuXG5cbi8qKlxuICogW3NlcnZlcl0gQWxsb3cgdG8gaW5kaWNhdGUgdGhlIGFwcHJveGltYXRlIGxvY2F0aW9uIG9mIHRoZSBjbGllbnQgb24gYSBtYXAgKHRoYXQgZ3JhcGhpY2FsbHkgcmVwcmVzZW50cyBhIHtAbGluayBTZXR1cH0pIHZpYSBhIGRpYWxvZy5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9jbGllbnQvQ2xpZW50TG9jYXRvci5qc35DbGllbnRMb2NhdG9yfSBvbiB0aGUgY2xpZW50IHNpZGUuKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2ZXJMb2NhdG9yIGV4dGVuZHMgTW9kdWxlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5uYW1lPSdsb2NhdG9yJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMuc2V0dXBdIFNldHVwIHVzZWQgaW4gdGhlIHNjZW5hcmlvLCBpZiBhbnkgKGNmLiB7QGxpbmsgU2VydmVyU2V0dXB9KS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnbG9jYXRvcicpO1xuXG4gICAgLyoqXG4gICAgICogU2V0dXAgdXNlZCBieSB0aGUgbG9jYXRvciwgaWYgYW55LlxuICAgICAqIEB0eXBlIHtTZXR1cH1cbiAgICAgKi9cbiAgICB0aGlzLnNldHVwID0gb3B0aW9ucy5zZXR1cCB8fCBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdyZXF1ZXN0JywgKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuc2V0dXApIHtcbiAgICAgICAgY29uc3Qgc3VyZmFjZSA9IHRoaXMuc2V0dXAuZ2V0U3VyZmFjZSgpO1xuICAgICAgICB0aGlzLnNlbmQoY2xpZW50LCAnc3VyZmFjZScsIHN1cmZhY2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTZXJ2ZXJMb2NhdG9yIHJlcXVpcmVzIGEgc2V0dXAuJyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAnY29vcmRpbmF0ZXMnLCAoY29vcmRpbmF0ZXMpID0+IHtcbiAgICAgIGNsaWVudC5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuICAgIH0pO1xuXG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3Jlc3RhcnQnLCAoY29vcmRpbmF0ZXMpID0+IHtcbiAgICAgIGNsaWVudC5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuICAgIH0pO1xuICB9XG59XG4iXX0=