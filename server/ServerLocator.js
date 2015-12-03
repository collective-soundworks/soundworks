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
 * The {@link ServerLocator} module allows to store the coordinates of a client when the user enters an approximate location through the interfacte provided by the {@link ClientLocator}.
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

      client.receive(this.name + ':request', function () {
        if (_this.setup) {
          var surface = _this.setup.getSurface();
          client.send(_this.name + ':surface', surface);
        } else {
          throw new Error('ServerLocator requires a setup.');
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

  return ServerLocator;
})(_Module3['default']);

exports['default'] = ServerLocator;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvU2VydmVyTG9jYXRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3VCQUFtQixVQUFVOzs7Ozs7OztJQU1SLGFBQWE7WUFBYixhQUFhOzs7Ozs7Ozs7QUFPckIsV0FQUSxhQUFhLEdBT047UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQVBMLGFBQWE7O0FBUTlCLCtCQVJpQixhQUFhLDZDQVF4QixPQUFPLENBQUMsSUFBSSxJQUFJLFNBQVMsRUFBRTs7Ozs7O0FBTWpDLFFBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUM7R0FDcEM7Ozs7OztlQWZrQixhQUFhOztXQW9CekIsaUJBQUMsTUFBTSxFQUFFOzs7QUFDZCxpQ0FyQmlCLGFBQWEseUNBcUJoQixNQUFNLEVBQUU7O0FBRXRCLFlBQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLEVBQUUsWUFBTTtBQUMzQyxZQUFJLE1BQUssS0FBSyxFQUFFO0FBQ2QsY0FBSSxPQUFPLEdBQUcsTUFBSyxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDdEMsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsTUFBSyxJQUFJLEdBQUcsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQzlDLE1BQU07QUFDTCxnQkFBTSxJQUFJLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO1NBQ3BEO09BQ0YsQ0FBQyxDQUFDOztBQUVILFlBQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxjQUFjLEVBQUUsVUFBQyxXQUFXLEVBQUs7QUFDMUQsY0FBTSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7T0FDbEMsQ0FBQyxDQUFDOztBQUVILFlBQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLEVBQUUsVUFBQyxXQUFXLEVBQUs7QUFDdEQsY0FBTSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7T0FDbEMsQ0FBQyxDQUFDO0tBQ0o7OztTQXZDa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoic3JjL3NlcnZlci9TZXJ2ZXJMb2NhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE1vZHVsZSBmcm9tICcuL01vZHVsZSc7XG5cblxuLyoqXG4gKiBUaGUge0BsaW5rIFNlcnZlckxvY2F0b3J9IG1vZHVsZSBhbGxvd3MgdG8gc3RvcmUgdGhlIGNvb3JkaW5hdGVzIG9mIGEgY2xpZW50IHdoZW4gdGhlIHVzZXIgZW50ZXJzIGFuIGFwcHJveGltYXRlIGxvY2F0aW9uIHRocm91Z2ggdGhlIGludGVyZmFjdGUgcHJvdmlkZWQgYnkgdGhlIHtAbGluayBDbGllbnRMb2NhdG9yfS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmVyTG9jYXRvciBleHRlbmRzIE1vZHVsZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMubmFtZT0nbG9jYXRvciddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLnNldHVwXSBTZXR1cCB1c2VkIGluIHRoZSBzY2VuYXJpbywgaWYgYW55IChjZi4ge0BsaW5rIFNlcnZlclNldHVwfSkuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ2xvY2F0b3InKTtcblxuICAgIC8qKlxuICAgICAqIFNldHVwIHVzZWQgYnkgdGhlIGxvY2F0b3IsIGlmIGFueS5cbiAgICAgKiBAdHlwZSB7U2V0dXB9XG4gICAgICovXG4gICAgdGhpcy5zZXR1cCA9IG9wdGlvbnMuc2V0dXAgfHwgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICBjbGllbnQucmVjZWl2ZSh0aGlzLm5hbWUgKyAnOnJlcXVlc3QnLCAoKSA9PiB7XG4gICAgICBpZiAodGhpcy5zZXR1cCkge1xuICAgICAgICBsZXQgc3VyZmFjZSA9IHRoaXMuc2V0dXAuZ2V0U3VyZmFjZSgpO1xuICAgICAgICBjbGllbnQuc2VuZCh0aGlzLm5hbWUgKyAnOnN1cmZhY2UnLCBzdXJmYWNlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignU2VydmVyTG9jYXRvciByZXF1aXJlcyBhIHNldHVwLicpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY2xpZW50LnJlY2VpdmUodGhpcy5uYW1lICsgJzpjb29yZGluYXRlcycsIChjb29yZGluYXRlcykgPT4ge1xuICAgICAgY2xpZW50LmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXM7XG4gICAgfSk7XG5cbiAgICBjbGllbnQucmVjZWl2ZSh0aGlzLm5hbWUgKyAnOnJlc3RhcnQnLCAoY29vcmRpbmF0ZXMpID0+IHtcbiAgICAgIGNsaWVudC5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuICAgIH0pO1xuICB9XG59XG4iXX0=