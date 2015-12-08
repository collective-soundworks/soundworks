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
   * @param {Number} [options.width] Width of the space.
   * @param {Number} [options.height] Height of the space.
   */

  function ServerLocator() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ServerLocator);

    _get(Object.getPrototypeOf(ServerLocator.prototype), 'constructor', this).call(this, options.name || 'locator');

    /**
     * Width of the space.
     * @type {Number}
     */
    this.width = options.width || 10;

    /**
     * Height of the space.
     * @type {Number}
     */
    this.height = options.height || 10;
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
        _this.send(client, 'surface', width, height, background);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvU2VydmVyTG9jYXRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzZCQUF5QixnQkFBZ0I7Ozs7Ozs7Ozs7SUFRcEIsYUFBYTtZQUFiLGFBQWE7Ozs7Ozs7Ozs7QUFRckIsV0FSUSxhQUFhLEdBUU47UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQVJMLGFBQWE7O0FBUzlCLCtCQVRpQixhQUFhLDZDQVN4QixPQUFPLENBQUMsSUFBSSxJQUFJLFNBQVMsRUFBRTs7Ozs7O0FBTWpDLFFBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUM7Ozs7OztBQU1qQyxRQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDO0dBQ3BDOzs7Ozs7ZUF0QmtCLGFBQWE7O1dBMkJ6QixpQkFBQyxNQUFNLEVBQUU7OztBQUNkLGlDQTVCaUIsYUFBYSx5Q0E0QmhCLE1BQU0sRUFBRTs7QUFFdEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLFlBQU07QUFDcEMsY0FBSyxJQUFJLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO09BQ3pELENBQUMsQ0FBQzs7QUFFSCxVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxhQUFhLEVBQUUsVUFBQyxXQUFXLEVBQUs7QUFDbkQsY0FBTSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7T0FDbEMsQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxVQUFDLFdBQVcsRUFBSztBQUMvQyxjQUFNLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztPQUNsQyxDQUFDLENBQUM7S0FDSjs7O1NBekNrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiJzcmMvc2VydmVyL1NlcnZlckxvY2F0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmVyTW9kdWxlIGZyb20gJy4vU2VydmVyTW9kdWxlJztcblxuXG4vKipcbiAqIFtzZXJ2ZXJdIEFsbG93IHRvIGluZGljYXRlIHRoZSBhcHByb3hpbWF0ZSBsb2NhdGlvbiBvZiB0aGUgY2xpZW50IG9uIGEgbWFwLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL2NsaWVudC9DbGllbnRMb2NhdG9yLmpzfkNsaWVudExvY2F0b3J9IG9uIHRoZSBjbGllbnQgc2lkZS4pXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlcnZlckxvY2F0b3IgZXh0ZW5kcyBTZXJ2ZXJNb2R1bGUge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiB0aGUgY2xhc3MuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLm5hbWU9J2xvY2F0b3InXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy53aWR0aF0gV2lkdGggb2YgdGhlIHNwYWNlLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuaGVpZ2h0XSBIZWlnaHQgb2YgdGhlIHNwYWNlLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdsb2NhdG9yJyk7XG5cbiAgICAvKipcbiAgICAgKiBXaWR0aCBvZiB0aGUgc3BhY2UuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLndpZHRoID0gb3B0aW9ucy53aWR0aCB8fCAxMDtcblxuICAgIC8qKlxuICAgICAqIEhlaWdodCBvZiB0aGUgc3BhY2UuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmhlaWdodCA9IG9wdGlvbnMuaGVpZ2h0IHx8IDEwO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdyZXF1ZXN0JywgKCkgPT4ge1xuICAgICAgdGhpcy5zZW5kKGNsaWVudCwgJ3N1cmZhY2UnLCB3aWR0aCwgaGVpZ2h0LCBiYWNrZ3JvdW5kKTtcbiAgICB9KTtcblxuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdjb29yZGluYXRlcycsIChjb29yZGluYXRlcykgPT4ge1xuICAgICAgY2xpZW50LmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXM7XG4gICAgfSk7XG5cbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAncmVzdGFydCcsIChjb29yZGluYXRlcykgPT4ge1xuICAgICAgY2xpZW50LmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXM7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==