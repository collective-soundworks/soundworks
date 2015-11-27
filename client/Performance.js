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
 * [client] Base class used to build a performance on the client side.
 *
 * The base class always has a view.
 */

var Performance = (function (_Module) {
  _inherits(Performance, _Module);

  /**
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
   * Start the module.
   *
   * Send a message to the server side module to indicate that the client entered the performance.
   *
   * **Note:** the method is called automatically when necessary, you should not call it manually.
   */

  _createClass(Performance, [{
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(Performance.prototype), 'start', this).call(this);
      _client2['default'].send(this.name + ':start');
    }

    /**
     * Can be called to terminate the performance.
     * Send a message to the server side module to indicate that the client exited the performance.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvUGVyZm9ybWFuY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztxQkFBa0IsU0FBUzs7Ozt1QkFDUixVQUFVOzs7O3NCQUNWLFVBQVU7Ozs7Ozs7Ozs7SUFRUixXQUFXO1lBQVgsV0FBVzs7Ozs7Ozs7QUFNbkIsV0FOUSxXQUFXLEdBTUo7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQU5MLFdBQVc7O0FBTzVCLCtCQVBpQixXQUFXLDZDQU90QixPQUFPLENBQUMsSUFBSSxJQUFJLGFBQWEsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLEtBQUssSUFBSSxPQUFPLEVBQUU7R0FDdEU7Ozs7Ozs7Ozs7ZUFSa0IsV0FBVzs7V0FpQnpCLGlCQUFHO0FBQ04saUNBbEJpQixXQUFXLHVDQWtCZDtBQUNkLDBCQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxDQUFDO0tBQ25DOzs7Ozs7OztXQU1HLGdCQUFHO0FBQ0wsMEJBQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUM7QUFDakMsaUNBNUJpQixXQUFXLHNDQTRCZjtLQUNkOzs7U0E3QmtCLFdBQVc7OztxQkFBWCxXQUFXIiwiZmlsZSI6InNyYy9jbGllbnQvUGVyZm9ybWFuY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgaW5wdXQgZnJvbSAnLi9pbnB1dCc7XG5pbXBvcnQgTW9kdWxlIGZyb20gJy4vTW9kdWxlJztcbmltcG9ydCBjbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuXG5cbi8qKlxuICogW2NsaWVudF0gQmFzZSBjbGFzcyB1c2VkIHRvIGJ1aWxkIGEgcGVyZm9ybWFuY2Ugb24gdGhlIGNsaWVudCBzaWRlLlxuICpcbiAqIFRoZSBiYXNlIGNsYXNzIGFsd2F5cyBoYXMgYSB2aWV3LlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQZXJmb3JtYW5jZSBleHRlbmRzIE1vZHVsZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdwZXJmb3JtYW5jZSddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9yPSdibGFjayddIEJhY2tncm91bmQgY29sb3Igb2YgdGhlIGB2aWV3YC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAncGVyZm9ybWFuY2UnLCB0cnVlLCBvcHRpb25zLmNvbG9yIHx8ICdibGFjaycpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBtb2R1bGUuXG4gICAqXG4gICAqIFNlbmQgYSBtZXNzYWdlIHRvIHRoZSBzZXJ2ZXIgc2lkZSBtb2R1bGUgdG8gaW5kaWNhdGUgdGhhdCB0aGUgY2xpZW50IGVudGVyZWQgdGhlIHBlcmZvcm1hbmNlLlxuICAgKlxuICAgKiAqKk5vdGU6KiogdGhlIG1ldGhvZCBpcyBjYWxsZWQgYXV0b21hdGljYWxseSB3aGVuIG5lY2Vzc2FyeSwgeW91IHNob3VsZCBub3QgY2FsbCBpdCBtYW51YWxseS5cbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG4gICAgY2xpZW50LnNlbmQodGhpcy5uYW1lICsgJzpzdGFydCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbiBiZSBjYWxsZWQgdG8gdGVybWluYXRlIHRoZSBwZXJmb3JtYW5jZS5cbiAgICogU2VuZCBhIG1lc3NhZ2UgdG8gdGhlIHNlcnZlciBzaWRlIG1vZHVsZSB0byBpbmRpY2F0ZSB0aGF0IHRoZSBjbGllbnQgZXhpdGVkIHRoZSBwZXJmb3JtYW5jZS5cbiAgICovXG4gIGRvbmUoKSB7XG4gICAgY2xpZW50LnNlbmQodGhpcy5uYW1lICsgJzpkb25lJyk7XG4gICAgc3VwZXIuZG9uZSgpOyAvLyBUT0RPOiBjaGVjayBpZiBuZWVkcyB0byBiZSBjYWxsZWQgbGFzdGx5XG4gIH1cbn1cbiJdfQ==