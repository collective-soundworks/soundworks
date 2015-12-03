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
 * [client] Base class used to build a performance on the client side.
 *
 * The base class always has a view.
 *
 * (See also {@link src/server/ServerPerformance.js~ServerPerformance} on the server side.)
 */

var ClientPerformance = (function (_Module) {
  _inherits(ClientPerformance, _Module);

  /**
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
})(_Module3['default']);

exports['default'] = ClientPerformance;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50UGVyZm9ybWFuY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozt1QkFBbUIsVUFBVTs7Ozs7Ozs7Ozs7O0lBVVIsaUJBQWlCO1lBQWpCLGlCQUFpQjs7Ozs7Ozs7QUFNekIsV0FOUSxpQkFBaUIsR0FNVjtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBTkwsaUJBQWlCOztBQU9sQywrQkFQaUIsaUJBQWlCLDZDQU81QixPQUFPLENBQUMsSUFBSSxJQUFJLGFBQWEsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLEtBQUssSUFBSSxPQUFPLEVBQUU7R0FDdEU7Ozs7Ozs7Ozs7ZUFSa0IsaUJBQWlCOztXQWlCL0IsaUJBQUc7QUFDTixpQ0FsQmlCLGlCQUFpQix1Q0FrQnBCO0FBQ2QsVUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtLQUNuQjs7Ozs7Ozs7V0FNRyxnQkFBRztBQUNMLFVBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDakIsaUNBNUJpQixpQkFBaUIsc0NBNEJyQjtLQUNkOzs7U0E3QmtCLGlCQUFpQjs7O3FCQUFqQixpQkFBaUIiLCJmaWxlIjoic3JjL2NsaWVudC9DbGllbnRQZXJmb3JtYW5jZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBNb2R1bGUgZnJvbSAnLi9Nb2R1bGUnO1xuXG5cbi8qKlxuICogW2NsaWVudF0gQmFzZSBjbGFzcyB1c2VkIHRvIGJ1aWxkIGEgcGVyZm9ybWFuY2Ugb24gdGhlIGNsaWVudCBzaWRlLlxuICpcbiAqIFRoZSBiYXNlIGNsYXNzIGFsd2F5cyBoYXMgYSB2aWV3LlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL3NlcnZlci9TZXJ2ZXJQZXJmb3JtYW5jZS5qc35TZXJ2ZXJQZXJmb3JtYW5jZX0gb24gdGhlIHNlcnZlciBzaWRlLilcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50UGVyZm9ybWFuY2UgZXh0ZW5kcyBNb2R1bGUge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0ncGVyZm9ybWFuY2UnXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvcj0nYmxhY2snXSBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBgdmlld2AuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ3BlcmZvcm1hbmNlJywgdHJ1ZSwgb3B0aW9ucy5jb2xvciB8fCAnYmxhY2snKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgbW9kdWxlLlxuICAgKlxuICAgKiBTZW5kIGEgbWVzc2FnZSB0byB0aGUgc2VydmVyIHNpZGUgbW9kdWxlIHRvIGluZGljYXRlIHRoYXQgdGhlIGNsaWVudCBlbnRlcmVkIHRoZSBwZXJmb3JtYW5jZS5cbiAgICpcbiAgICogKipOb3RlOioqIHRoZSBtZXRob2QgaXMgY2FsbGVkIGF1dG9tYXRpY2FsbHkgd2hlbiBuZWNlc3NhcnksIHlvdSBzaG91bGQgbm90IGNhbGwgaXQgbWFudWFsbHkuXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuICAgIHRoaXMuc2VuZCgnc3RhcnQnKVxuICB9XG5cbiAgLyoqXG4gICAqIENhbiBiZSBjYWxsZWQgdG8gdGVybWluYXRlIHRoZSBwZXJmb3JtYW5jZS5cbiAgICogU2VuZCBhIG1lc3NhZ2UgdG8gdGhlIHNlcnZlciBzaWRlIG1vZHVsZSB0byBpbmRpY2F0ZSB0aGF0IHRoZSBjbGllbnQgZXhpdGVkIHRoZSBwZXJmb3JtYW5jZS5cbiAgICovXG4gIGRvbmUoKSB7XG4gICAgdGhpcy5zZW5kKCdkb25lJylcbiAgICBzdXBlci5kb25lKCk7IC8vIFRPRE86IGNoZWNrIGlmIG5lZWRzIHRvIGJlIGNhbGxlZCBsYXN0bHlcbiAgfVxufVxuIl19