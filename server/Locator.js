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
 * The {@link Locator} module allows to store the coordinates of a client when the user enters an approximate location through the interfacte provided by the {@link ClientLocator}.
 */

var Locator = (function (_Module) {
  _inherits(Locator, _Module);

  /**
   * Creates an instance of the class.
   * @param {Object} [options={}] Options.
   * @param {Object} [options.name='locator'] Name of the module.
   * @param {Object} [options.setup] Setup used in the scenario, if any (cf. {@link ServerSetup}).
   */

  function Locator() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Locator);

    _get(Object.getPrototypeOf(Locator.prototype), 'constructor', this).call(this, options.name || 'locator');

    /**
     * Setup used by the locator, if any.
     * @type {Setup}
     */
    this.setup = options.setup || null;
  }

  /**
   * @private
   */

  _createClass(Locator, [{
    key: 'connect',
    value: function connect(client) {
      var _this = this;

      _get(Object.getPrototypeOf(Locator.prototype), 'connect', this).call(this, client);

      client.receive(this.name + ':request', function () {
        if (_this.setup) {
          var surface = _this.setup.getSurface();
          client.send(_this.name + ':surface', surface);
        } else {
          throw new Error("Locator requires a setup.");
        }
      });

      client.receive(this.name + ':coordinates', function (coordinates) {
        client.coordinates = coordinates;
      });

      client.receive(this.name + ':restart', function (coordinates) {
        client.coordinates = coordinates;
      });
    }
  }]);

  return Locator;
})(_Module3['default']);

exports['default'] = Locator;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvTG9jYXRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3VCQUFtQixVQUFVOzs7Ozs7OztJQU1SLE9BQU87WUFBUCxPQUFPOzs7Ozs7Ozs7QUFPZixXQVBRLE9BQU8sR0FPQTtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBUEwsT0FBTzs7QUFReEIsK0JBUmlCLE9BQU8sNkNBUWxCLE9BQU8sQ0FBQyxJQUFJLElBQUksU0FBUyxFQUFFOzs7Ozs7QUFNakMsUUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQztHQUNwQzs7Ozs7O2VBZmtCLE9BQU87O1dBb0JuQixpQkFBQyxNQUFNLEVBQUU7OztBQUNkLGlDQXJCaUIsT0FBTyx5Q0FxQlYsTUFBTSxFQUFFOztBQUV0QixZQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsVUFBVSxFQUFFLFlBQU07QUFDM0MsWUFBSSxNQUFLLEtBQUssRUFBRTtBQUNkLGNBQUksT0FBTyxHQUFHLE1BQUssS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ3RDLGdCQUFNLENBQUMsSUFBSSxDQUFDLE1BQUssSUFBSSxHQUFHLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztTQUM5QyxNQUFNO0FBQ0wsZ0JBQU0sSUFBSSxLQUFLLENBQUMsMkJBQTJCLENBQUMsQ0FBQztTQUM5QztPQUNGLENBQUMsQ0FBQzs7QUFFSCxZQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsY0FBYyxFQUFFLFVBQUMsV0FBVyxFQUFLO0FBQzFELGNBQU0sQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO09BQ2xDLENBQUMsQ0FBQzs7QUFFSCxZQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsVUFBVSxFQUFFLFVBQUMsV0FBVyxFQUFLO0FBQ3RELGNBQU0sQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO09BQ2xDLENBQUMsQ0FBQztLQUNKOzs7U0F2Q2tCLE9BQU87OztxQkFBUCxPQUFPIiwiZmlsZSI6InNyYy9zZXJ2ZXIvTG9jYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBNb2R1bGUgZnJvbSAnLi9Nb2R1bGUnO1xuXG5cbi8qKlxuICogVGhlIHtAbGluayBMb2NhdG9yfSBtb2R1bGUgYWxsb3dzIHRvIHN0b3JlIHRoZSBjb29yZGluYXRlcyBvZiBhIGNsaWVudCB3aGVuIHRoZSB1c2VyIGVudGVycyBhbiBhcHByb3hpbWF0ZSBsb2NhdGlvbiB0aHJvdWdoIHRoZSBpbnRlcmZhY3RlIHByb3ZpZGVkIGJ5IHRoZSB7QGxpbmsgQ2xpZW50TG9jYXRvcn0uXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvY2F0b3IgZXh0ZW5kcyBNb2R1bGUge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiB0aGUgY2xhc3MuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLm5hbWU9J2xvY2F0b3InXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5zZXR1cF0gU2V0dXAgdXNlZCBpbiB0aGUgc2NlbmFyaW8sIGlmIGFueSAoY2YuIHtAbGluayBTZXJ2ZXJTZXR1cH0pLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdsb2NhdG9yJyk7XG5cbiAgICAvKipcbiAgICAgKiBTZXR1cCB1c2VkIGJ5IHRoZSBsb2NhdG9yLCBpZiBhbnkuXG4gICAgICogQHR5cGUge1NldHVwfVxuICAgICAqL1xuICAgIHRoaXMuc2V0dXAgPSBvcHRpb25zLnNldHVwIHx8IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgY2xpZW50LnJlY2VpdmUodGhpcy5uYW1lICsgJzpyZXF1ZXN0JywgKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuc2V0dXApIHtcbiAgICAgICAgbGV0IHN1cmZhY2UgPSB0aGlzLnNldHVwLmdldFN1cmZhY2UoKTtcbiAgICAgICAgY2xpZW50LnNlbmQodGhpcy5uYW1lICsgJzpzdXJmYWNlJywgc3VyZmFjZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJMb2NhdG9yIHJlcXVpcmVzIGEgc2V0dXAuXCIpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY2xpZW50LnJlY2VpdmUodGhpcy5uYW1lICsgJzpjb29yZGluYXRlcycsIChjb29yZGluYXRlcykgPT4ge1xuICAgICAgY2xpZW50LmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXM7XG4gICAgfSk7XG5cbiAgICBjbGllbnQucmVjZWl2ZSh0aGlzLm5hbWUgKyAnOnJlc3RhcnQnLCAoY29vcmRpbmF0ZXMpID0+IHtcbiAgICAgIGNsaWVudC5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuICAgIH0pO1xuICB9XG59XG4iXX0=