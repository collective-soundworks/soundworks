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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvU2VydmVyTG9jYXRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3VCQUFtQixVQUFVOzs7Ozs7OztJQU1SLGFBQWE7WUFBYixhQUFhOzs7Ozs7Ozs7QUFPckIsV0FQUSxhQUFhLEdBT047UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQVBMLGFBQWE7O0FBUTlCLCtCQVJpQixhQUFhLDZDQVF4QixPQUFPLENBQUMsSUFBSSxJQUFJLFNBQVMsRUFBRTs7Ozs7O0FBTWpDLFFBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUM7R0FDcEM7Ozs7OztlQWZrQixhQUFhOztXQW9CekIsaUJBQUMsTUFBTSxFQUFFOzs7QUFDZCxpQ0FyQmlCLGFBQWEseUNBcUJoQixNQUFNLEVBQUU7O0FBRXRCLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxZQUFNO0FBQ3BDLFlBQUksTUFBSyxLQUFLLEVBQUU7QUFDZCxjQUFJLE9BQU8sR0FBRyxNQUFLLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQztBQUN0QyxnQkFBSyxJQUFJLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztTQUN2QyxNQUFNO0FBQ0wsZ0JBQU0sSUFBSSxLQUFLLENBQUMsaUNBQWlDLENBQUMsQ0FBQztTQUNwRDtPQUNGLENBQUMsQ0FBQzs7QUFFSCxVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxhQUFhLEVBQUUsVUFBQyxXQUFXLEVBQUs7QUFDbkQsY0FBTSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7T0FDbEMsQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxVQUFDLFdBQVcsRUFBSztBQUMvQyxjQUFNLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztPQUNsQyxDQUFDLENBQUM7S0FDSjs7O1NBdkNrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiJzcmMvc2VydmVyL1NlcnZlckxvY2F0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTW9kdWxlIGZyb20gJy4vTW9kdWxlJztcblxuXG4vKipcbiAqIFRoZSB7QGxpbmsgU2VydmVyTG9jYXRvcn0gbW9kdWxlIGFsbG93cyB0byBzdG9yZSB0aGUgY29vcmRpbmF0ZXMgb2YgYSBjbGllbnQgd2hlbiB0aGUgdXNlciBlbnRlcnMgYW4gYXBwcm94aW1hdGUgbG9jYXRpb24gdGhyb3VnaCB0aGUgaW50ZXJmYWN0ZSBwcm92aWRlZCBieSB0aGUge0BsaW5rIENsaWVudExvY2F0b3J9LlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2ZXJMb2NhdG9yIGV4dGVuZHMgTW9kdWxlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5uYW1lPSdsb2NhdG9yJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMuc2V0dXBdIFNldHVwIHVzZWQgaW4gdGhlIHNjZW5hcmlvLCBpZiBhbnkgKGNmLiB7QGxpbmsgU2VydmVyU2V0dXB9KS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnbG9jYXRvcicpO1xuXG4gICAgLyoqXG4gICAgICogU2V0dXAgdXNlZCBieSB0aGUgbG9jYXRvciwgaWYgYW55LlxuICAgICAqIEB0eXBlIHtTZXR1cH1cbiAgICAgKi9cbiAgICB0aGlzLnNldHVwID0gb3B0aW9ucy5zZXR1cCB8fCBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdyZXF1ZXN0JywgKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuc2V0dXApIHtcbiAgICAgICAgbGV0IHN1cmZhY2UgPSB0aGlzLnNldHVwLmdldFN1cmZhY2UoKTtcbiAgICAgICAgdGhpcy5zZW5kKGNsaWVudCwgJ3N1cmZhY2UnLCBzdXJmYWNlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignU2VydmVyTG9jYXRvciByZXF1aXJlcyBhIHNldHVwLicpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ2Nvb3JkaW5hdGVzJywgKGNvb3JkaW5hdGVzKSA9PiB7XG4gICAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcztcbiAgICB9KTtcblxuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdyZXN0YXJ0JywgKGNvb3JkaW5hdGVzKSA9PiB7XG4gICAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcztcbiAgICB9KTtcbiAgfVxufVxuIl19