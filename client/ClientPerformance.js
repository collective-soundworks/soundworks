'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _ClientModule2 = require('./ClientModule');

var _ClientModule3 = _interopRequireDefault(_ClientModule2);

/**
 * [client] Base class used to build a performance on the client side.
 *
 * The base class always has a view.
 *
 * (See also {@link src/server/ServerPerformance.js~ServerPerformance} on the server side.)
 */

var ClientPerformance = (function (_ClientModule) {
  _inherits(ClientPerformance, _ClientModule);

  /**
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='performance'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   */

  function ClientPerformance() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ClientPerformance);

    _get(Object.getPrototypeOf(ClientPerformance.prototype), 'constructor', this).call(this, options.name || 'performance', true, options.color || 'black');

    this.viewOptions = { className: ['module', 'performance'] };
  }

  /**
   * Start the module.
   *
   * Send a message to the server side module to indicate that the client entered the performance.
   *
   * **Note:** the method is called automatically when necessary, you should not call it manually.
   */

  _createClass(ClientPerformance, [{
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(ClientPerformance.prototype), 'start', this).call(this);
      this.send('start');
    }

    /**
     * Can be called to terminate the performance.
     * Send a message to the server side module to indicate that the client exited the performance.
     */
  }, {
    key: 'done',
    value: function done() {
      this.send('done');
      _get(Object.getPrototypeOf(ClientPerformance.prototype), 'done', this).call(this); // TODO: check if needs to be called lastly
    }
  }]);

  return ClientPerformance;
})(_ClientModule3['default']);

exports['default'] = ClientPerformance;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50UGVyZm9ybWFuY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs2QkFBeUIsZ0JBQWdCOzs7Ozs7Ozs7Ozs7SUFTcEIsaUJBQWlCO1lBQWpCLGlCQUFpQjs7Ozs7Ozs7QUFNekIsV0FOUSxpQkFBaUIsR0FNVjtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBTkwsaUJBQWlCOztBQU9sQywrQkFQaUIsaUJBQWlCLDZDQU81QixPQUFPLENBQUMsSUFBSSxJQUFJLGFBQWEsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLEtBQUssSUFBSSxPQUFPLEVBQUU7O0FBRXJFLFFBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxTQUFTLEVBQUUsQ0FBQyxRQUFRLEVBQUUsYUFBYSxDQUFDLEVBQUUsQ0FBQztHQUM3RDs7Ozs7Ozs7OztlQVZrQixpQkFBaUI7O1dBbUIvQixpQkFBRztBQUNOLGlDQXBCaUIsaUJBQWlCLHVDQW9CcEI7QUFDZCxVQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ3BCOzs7Ozs7OztXQU1HLGdCQUFHO0FBQ0wsVUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtBQUNqQixpQ0E5QmlCLGlCQUFpQixzQ0E4QnJCO0tBQ2Q7OztTQS9Ca0IsaUJBQWlCOzs7cUJBQWpCLGlCQUFpQiIsImZpbGUiOiJzcmMvY2xpZW50L0NsaWVudFBlcmZvcm1hbmNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENsaWVudE1vZHVsZSBmcm9tICcuL0NsaWVudE1vZHVsZSc7XG5cbi8qKlxuICogW2NsaWVudF0gQmFzZSBjbGFzcyB1c2VkIHRvIGJ1aWxkIGEgcGVyZm9ybWFuY2Ugb24gdGhlIGNsaWVudCBzaWRlLlxuICpcbiAqIFRoZSBiYXNlIGNsYXNzIGFsd2F5cyBoYXMgYSB2aWV3LlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL3NlcnZlci9TZXJ2ZXJQZXJmb3JtYW5jZS5qc35TZXJ2ZXJQZXJmb3JtYW5jZX0gb24gdGhlIHNlcnZlciBzaWRlLilcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50UGVyZm9ybWFuY2UgZXh0ZW5kcyBDbGllbnRNb2R1bGUge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0ncGVyZm9ybWFuY2UnXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvcj0nYmxhY2snXSBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBgdmlld2AuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ3BlcmZvcm1hbmNlJywgdHJ1ZSwgb3B0aW9ucy5jb2xvciB8fCAnYmxhY2snKTtcblxuICAgIHRoaXMudmlld09wdGlvbnMgPSB7IGNsYXNzTmFtZTogWydtb2R1bGUnLCAncGVyZm9ybWFuY2UnXSB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBtb2R1bGUuXG4gICAqXG4gICAqIFNlbmQgYSBtZXNzYWdlIHRvIHRoZSBzZXJ2ZXIgc2lkZSBtb2R1bGUgdG8gaW5kaWNhdGUgdGhhdCB0aGUgY2xpZW50IGVudGVyZWQgdGhlIHBlcmZvcm1hbmNlLlxuICAgKlxuICAgKiAqKk5vdGU6KiogdGhlIG1ldGhvZCBpcyBjYWxsZWQgYXV0b21hdGljYWxseSB3aGVuIG5lY2Vzc2FyeSwgeW91IHNob3VsZCBub3QgY2FsbCBpdCBtYW51YWxseS5cbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG4gICAgdGhpcy5zZW5kKCdzdGFydCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbiBiZSBjYWxsZWQgdG8gdGVybWluYXRlIHRoZSBwZXJmb3JtYW5jZS5cbiAgICogU2VuZCBhIG1lc3NhZ2UgdG8gdGhlIHNlcnZlciBzaWRlIG1vZHVsZSB0byBpbmRpY2F0ZSB0aGF0IHRoZSBjbGllbnQgZXhpdGVkIHRoZSBwZXJmb3JtYW5jZS5cbiAgICovXG4gIGRvbmUoKSB7XG4gICAgdGhpcy5zZW5kKCdkb25lJylcbiAgICBzdXBlci5kb25lKCk7IC8vIFRPRE86IGNoZWNrIGlmIG5lZWRzIHRvIGJlIGNhbGxlZCBsYXN0bHlcbiAgfVxufVxuIl19