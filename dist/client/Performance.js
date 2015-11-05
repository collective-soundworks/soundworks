'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var client = require('./client');
var ClientModule = require('./ClientModule');
// import client from './client.es6.js';
// import ClientModule from './ClientModule.es6.js';

/**
 * The {@link ClientPerformance} base class constitutes a basis on which to build a performance on the client side.
 */

var ClientPerformance = (function (_ClientModule) {
  _inherits(ClientPerformance, _ClientModule);

  // export default class ClientPerformance extends ClientModule {
  /**
   * Creates an instance of the class. Always has a view.
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='performance'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   */

  function ClientPerformance() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ClientPerformance);

    _get(Object.getPrototypeOf(ClientPerformance.prototype), 'constructor', this).call(this, options.name || 'performance', true, options.color || 'black');
  }

  /**
   * Automatically called to start the module. // TODO
   * Sends a message to the server side module to indicate that the client entered the performance.
   */

  _createClass(ClientPerformance, [{
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(ClientPerformance.prototype), 'start', this).call(this);
      client.send(this.name + ':start');
    }

    /**
     * Can be called to terminate the performance.
     * Sends a message to the server side module to indicate that the client exited the performance.
     */
  }, {
    key: 'done',
    value: function done() {
      client.send(this.name + ':done');
      _get(Object.getPrototypeOf(ClientPerformance.prototype), 'done', this).call(this); // TODO: check if needs to be called lastly
    }
  }]);

  return ClientPerformance;
})(ClientModule);

module.exports = ClientPerformance;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvUGVyZm9ybWFuY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7Ozs7Ozs7O0FBRWIsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ25DLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOzs7Ozs7OztJQU96QyxpQkFBaUI7WUFBakIsaUJBQWlCOzs7Ozs7Ozs7O0FBUVYsV0FSUCxpQkFBaUIsR0FRSztRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBUnBCLGlCQUFpQjs7QUFTbkIsK0JBVEUsaUJBQWlCLDZDQVNiLE9BQU8sQ0FBQyxJQUFJLElBQUksYUFBYSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsS0FBSyxJQUFJLE9BQU8sRUFBRTtHQUN0RTs7Ozs7OztlQVZHLGlCQUFpQjs7V0FnQmhCLGlCQUFHO0FBQ04saUNBakJFLGlCQUFpQix1Q0FpQkw7QUFDZCxZQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLENBQUM7S0FDbkM7Ozs7Ozs7O1dBTUcsZ0JBQUc7QUFDTCxZQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUM7QUFDakMsaUNBM0JFLGlCQUFpQixzQ0EyQk47S0FDZDs7O1NBNUJHLGlCQUFpQjtHQUFTLFlBQVk7O0FBK0I1QyxNQUFNLENBQUMsT0FBTyxHQUFHLGlCQUFpQixDQUFBIiwiZmlsZSI6InNyYy9jbGllbnQvUGVyZm9ybWFuY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGNsaWVudCA9IHJlcXVpcmUoJy4vY2xpZW50Jyk7XG5jb25zdCBDbGllbnRNb2R1bGUgPSByZXF1aXJlKCcuL0NsaWVudE1vZHVsZScpO1xuLy8gaW1wb3J0IGNsaWVudCBmcm9tICcuL2NsaWVudC5lczYuanMnO1xuLy8gaW1wb3J0IENsaWVudE1vZHVsZSBmcm9tICcuL0NsaWVudE1vZHVsZS5lczYuanMnO1xuXG4vKipcbiAqIFRoZSB7QGxpbmsgQ2xpZW50UGVyZm9ybWFuY2V9IGJhc2UgY2xhc3MgY29uc3RpdHV0ZXMgYSBiYXNpcyBvbiB3aGljaCB0byBidWlsZCBhIHBlcmZvcm1hbmNlIG9uIHRoZSBjbGllbnQgc2lkZS5cbiAqL1xuY2xhc3MgQ2xpZW50UGVyZm9ybWFuY2UgZXh0ZW5kcyBDbGllbnRNb2R1bGUge1xuLy8gZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50UGVyZm9ybWFuY2UgZXh0ZW5kcyBDbGllbnRNb2R1bGUge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiB0aGUgY2xhc3MuIEFsd2F5cyBoYXMgYSB2aWV3LlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdwZXJmb3JtYW5jZSddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9yPSdibGFjayddIEJhY2tncm91bmQgY29sb3Igb2YgdGhlIGB2aWV3YC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAncGVyZm9ybWFuY2UnLCB0cnVlLCBvcHRpb25zLmNvbG9yIHx8ICdibGFjaycpO1xuICB9XG5cbiAgLyoqXG4gICAqIEF1dG9tYXRpY2FsbHkgY2FsbGVkIHRvIHN0YXJ0IHRoZSBtb2R1bGUuIC8vIFRPRE9cbiAgICogU2VuZHMgYSBtZXNzYWdlIHRvIHRoZSBzZXJ2ZXIgc2lkZSBtb2R1bGUgdG8gaW5kaWNhdGUgdGhhdCB0aGUgY2xpZW50IGVudGVyZWQgdGhlIHBlcmZvcm1hbmNlLlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgICBjbGllbnQuc2VuZCh0aGlzLm5hbWUgKyAnOnN0YXJ0Jyk7XG4gIH1cblxuICAvKipcbiAgICogQ2FuIGJlIGNhbGxlZCB0byB0ZXJtaW5hdGUgdGhlIHBlcmZvcm1hbmNlLlxuICAgKiBTZW5kcyBhIG1lc3NhZ2UgdG8gdGhlIHNlcnZlciBzaWRlIG1vZHVsZSB0byBpbmRpY2F0ZSB0aGF0IHRoZSBjbGllbnQgZXhpdGVkIHRoZSBwZXJmb3JtYW5jZS5cbiAgICovXG4gIGRvbmUoKSB7XG4gICAgY2xpZW50LnNlbmQodGhpcy5uYW1lICsgJzpkb25lJyk7XG4gICAgc3VwZXIuZG9uZSgpOyAvLyBUT0RPOiBjaGVjayBpZiBuZWVkcyB0byBiZSBjYWxsZWQgbGFzdGx5XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDbGllbnRQZXJmb3JtYW5jZVxuIl19