'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _input = require('./input');

var _input2 = _interopRequireDefault(_input);

var _Module2 = require('./Module');

var _Module3 = _interopRequireDefault(_Module2);

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

/**
 * The {@link ClientPerformance} base class constitutes a basis on which to build a performance on the client side.
 */

var Performance = (function (_Module) {
  _inherits(Performance, _Module);

  /**
   * Creates an instance of the class. Always has a view.
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='performance'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   */

  function Performance() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Performance);

    _get(Object.getPrototypeOf(Performance.prototype), 'constructor', this).call(this, options.name || 'performance', true, options.color || 'black');
  }

  /**
   * Automatically called to start the module. // TODO
   * Sends a message to the server side module to indicate that the client entered the performance.
   */

  _createClass(Performance, [{
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(Performance.prototype), 'start', this).call(this);
      _client2['default'].send(this.name + ':start');
    }

    /**
     * Can be called to terminate the performance.
     * Sends a message to the server side module to indicate that the client exited the performance.
     */
  }, {
    key: 'done',
    value: function done() {
      _client2['default'].send(this.name + ':done');
      _get(Object.getPrototypeOf(Performance.prototype), 'done', this).call(this); // TODO: check if needs to be called lastly
    }
  }]);

  return Performance;
})(_Module3['default']);

exports['default'] = Performance;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvUGVyZm9ybWFuY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztxQkFBa0IsU0FBUzs7Ozt1QkFDUixVQUFVOzs7O3NCQUNWLFVBQVU7Ozs7Ozs7O0lBTVIsV0FBVztZQUFYLFdBQVc7Ozs7Ozs7OztBQU9uQixXQVBRLFdBQVcsR0FPSjtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBUEwsV0FBVzs7QUFRNUIsK0JBUmlCLFdBQVcsNkNBUXRCLE9BQU8sQ0FBQyxJQUFJLElBQUksYUFBYSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsS0FBSyxJQUFJLE9BQU8sRUFBRTtHQUN0RTs7Ozs7OztlQVRrQixXQUFXOztXQWV6QixpQkFBRztBQUNOLGlDQWhCaUIsV0FBVyx1Q0FnQmQ7QUFDZCwwQkFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsQ0FBQztLQUNuQzs7Ozs7Ozs7V0FNRyxnQkFBRztBQUNMLDBCQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUFDO0FBQ2pDLGlDQTFCaUIsV0FBVyxzQ0EwQmY7S0FDZDs7O1NBM0JrQixXQUFXOzs7cUJBQVgsV0FBVyIsImZpbGUiOiJzcmMvY2xpZW50L1BlcmZvcm1hbmNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGlucHV0IGZyb20gJy4vaW5wdXQnO1xuaW1wb3J0IE1vZHVsZSBmcm9tICcuL01vZHVsZSc7XG5pbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50JztcblxuXG4vKipcbiAqIFRoZSB7QGxpbmsgQ2xpZW50UGVyZm9ybWFuY2V9IGJhc2UgY2xhc3MgY29uc3RpdHV0ZXMgYSBiYXNpcyBvbiB3aGljaCB0byBidWlsZCBhIHBlcmZvcm1hbmNlIG9uIHRoZSBjbGllbnQgc2lkZS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGVyZm9ybWFuY2UgZXh0ZW5kcyBNb2R1bGUge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiB0aGUgY2xhc3MuIEFsd2F5cyBoYXMgYSB2aWV3LlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdwZXJmb3JtYW5jZSddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9yPSdibGFjayddIEJhY2tncm91bmQgY29sb3Igb2YgdGhlIGB2aWV3YC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAncGVyZm9ybWFuY2UnLCB0cnVlLCBvcHRpb25zLmNvbG9yIHx8ICdibGFjaycpO1xuICB9XG5cbiAgLyoqXG4gICAqIEF1dG9tYXRpY2FsbHkgY2FsbGVkIHRvIHN0YXJ0IHRoZSBtb2R1bGUuIC8vIFRPRE9cbiAgICogU2VuZHMgYSBtZXNzYWdlIHRvIHRoZSBzZXJ2ZXIgc2lkZSBtb2R1bGUgdG8gaW5kaWNhdGUgdGhhdCB0aGUgY2xpZW50IGVudGVyZWQgdGhlIHBlcmZvcm1hbmNlLlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgICBjbGllbnQuc2VuZCh0aGlzLm5hbWUgKyAnOnN0YXJ0Jyk7XG4gIH1cblxuICAvKipcbiAgICogQ2FuIGJlIGNhbGxlZCB0byB0ZXJtaW5hdGUgdGhlIHBlcmZvcm1hbmNlLlxuICAgKiBTZW5kcyBhIG1lc3NhZ2UgdG8gdGhlIHNlcnZlciBzaWRlIG1vZHVsZSB0byBpbmRpY2F0ZSB0aGF0IHRoZSBjbGllbnQgZXhpdGVkIHRoZSBwZXJmb3JtYW5jZS5cbiAgICovXG4gIGRvbmUoKSB7XG4gICAgY2xpZW50LnNlbmQodGhpcy5uYW1lICsgJzpkb25lJyk7XG4gICAgc3VwZXIuZG9uZSgpOyAvLyBUT0RPOiBjaGVjayBpZiBuZWVkcyB0byBiZSBjYWxsZWQgbGFzdGx5XG4gIH1cbn1cbiJdfQ==