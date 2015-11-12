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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvTG9jYXRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3VCQUFtQixVQUFVOzs7Ozs7OztJQU1SLE9BQU87WUFBUCxPQUFPOzs7Ozs7Ozs7QUFPZixXQVBRLE9BQU8sR0FPQTtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBUEwsT0FBTzs7QUFReEIsK0JBUmlCLE9BQU8sNkNBUWxCLE9BQU8sQ0FBQyxJQUFJLElBQUksU0FBUyxFQUFFOztBQUVqQyxRQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDO0dBQ3BDOzs7Ozs7ZUFYa0IsT0FBTzs7V0FnQm5CLGlCQUFDLE1BQU0sRUFBRTs7O0FBQ2QsaUNBakJpQixPQUFPLHlDQWlCVixNQUFNLEVBQUU7O0FBRXRCLFlBQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLEVBQUUsWUFBTTtBQUMzQyxZQUFJLE1BQUssS0FBSyxFQUFFO0FBQ2QsY0FBSSxPQUFPLEdBQUcsTUFBSyxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDdEMsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsTUFBSyxJQUFJLEdBQUcsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQzlDLE1BQU07QUFDTCxnQkFBTSxJQUFJLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1NBQzlDO09BQ0YsQ0FBQyxDQUFDOztBQUVILFlBQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxjQUFjLEVBQUUsVUFBQyxXQUFXLEVBQUs7QUFDMUQsY0FBTSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7T0FDbEMsQ0FBQyxDQUFDOztBQUVILFlBQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLEVBQUUsVUFBQyxXQUFXLEVBQUs7QUFDdEQsY0FBTSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7T0FDbEMsQ0FBQyxDQUFDO0tBQ0o7OztTQW5Da0IsT0FBTzs7O3FCQUFQLE9BQU8iLCJmaWxlIjoic3JjL3NlcnZlci9Mb2NhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE1vZHVsZSBmcm9tICcuL01vZHVsZSc7XG5cblxuLyoqXG4gKiBUaGUge0BsaW5rIExvY2F0b3J9IG1vZHVsZSBhbGxvd3MgdG8gc3RvcmUgdGhlIGNvb3JkaW5hdGVzIG9mIGEgY2xpZW50IHdoZW4gdGhlIHVzZXIgZW50ZXJzIGFuIGFwcHJveGltYXRlIGxvY2F0aW9uIHRocm91Z2ggdGhlIGludGVyZmFjdGUgcHJvdmlkZWQgYnkgdGhlIHtAbGluayBDbGllbnRMb2NhdG9yfS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9jYXRvciBleHRlbmRzIE1vZHVsZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMubmFtZT0nbG9jYXRvciddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLnNldHVwXSBTZXR1cCB1c2VkIGluIHRoZSBzY2VuYXJpbywgaWYgYW55IChjZi4ge0BsaW5rIFNlcnZlclNldHVwfSkuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ2xvY2F0b3InKTtcblxuICAgIHRoaXMuc2V0dXAgPSBvcHRpb25zLnNldHVwIHx8IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgY2xpZW50LnJlY2VpdmUodGhpcy5uYW1lICsgJzpyZXF1ZXN0JywgKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuc2V0dXApIHtcbiAgICAgICAgbGV0IHN1cmZhY2UgPSB0aGlzLnNldHVwLmdldFN1cmZhY2UoKTtcbiAgICAgICAgY2xpZW50LnNlbmQodGhpcy5uYW1lICsgJzpzdXJmYWNlJywgc3VyZmFjZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJMb2NhdG9yIHJlcXVpcmVzIGEgc2V0dXAuXCIpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY2xpZW50LnJlY2VpdmUodGhpcy5uYW1lICsgJzpjb29yZGluYXRlcycsIChjb29yZGluYXRlcykgPT4ge1xuICAgICAgY2xpZW50LmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXM7XG4gICAgfSk7XG5cbiAgICBjbGllbnQucmVjZWl2ZSh0aGlzLm5hbWUgKyAnOnJlc3RhcnQnLCAoY29vcmRpbmF0ZXMpID0+IHtcbiAgICAgIGNsaWVudC5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuICAgIH0pO1xuICB9XG59XG5cbiJdfQ==