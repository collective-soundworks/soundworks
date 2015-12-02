// import input from './input';
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

// import client from './client';

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
      // client.send(this.name + ':start');
      this.send('start');
    }

    /**
     * Can be called to terminate the performance.
     * Sends a message to the server side module to indicate that the client exited the performance.
     */
  }, {
    key: 'done',
    value: function done() {
      // client.send(this.name + ':done');
      this.send('done');
      _get(Object.getPrototypeOf(Performance.prototype), 'done', this).call(this); // TODO: check if needs to be called lastly
    }
  }]);

  return Performance;
})(_Module3['default']);

exports['default'] = Performance;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvUGVyZm9ybWFuY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7dUJBQ21CLFVBQVU7Ozs7Ozs7Ozs7SUFPUixXQUFXO1lBQVgsV0FBVzs7Ozs7Ozs7O0FBT25CLFdBUFEsV0FBVyxHQU9KO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFQTCxXQUFXOztBQVE1QiwrQkFSaUIsV0FBVyw2Q0FRdEIsT0FBTyxDQUFDLElBQUksSUFBSSxhQUFhLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxLQUFLLElBQUksT0FBTyxFQUFFO0dBQ3RFOzs7Ozs7O2VBVGtCLFdBQVc7O1dBZXpCLGlCQUFHO0FBQ04saUNBaEJpQixXQUFXLHVDQWdCZDs7QUFFZCxVQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0tBQ25COzs7Ozs7OztXQU1HLGdCQUFHOztBQUVMLFVBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDakIsaUNBNUJpQixXQUFXLHNDQTRCZjtLQUNkOzs7U0E3QmtCLFdBQVc7OztxQkFBWCxXQUFXIiwiZmlsZSI6InNyYy9jbGllbnQvUGVyZm9ybWFuY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgaW5wdXQgZnJvbSAnLi9pbnB1dCc7XG5pbXBvcnQgTW9kdWxlIGZyb20gJy4vTW9kdWxlJztcbi8vIGltcG9ydCBjbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuXG5cbi8qKlxuICogVGhlIHtAbGluayBDbGllbnRQZXJmb3JtYW5jZX0gYmFzZSBjbGFzcyBjb25zdGl0dXRlcyBhIGJhc2lzIG9uIHdoaWNoIHRvIGJ1aWxkIGEgcGVyZm9ybWFuY2Ugb24gdGhlIGNsaWVudCBzaWRlLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQZXJmb3JtYW5jZSBleHRlbmRzIE1vZHVsZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy4gQWx3YXlzIGhhcyBhIHZpZXcuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm5hbWU9J3BlcmZvcm1hbmNlJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuY29sb3I9J2JsYWNrJ10gQmFja2dyb3VuZCBjb2xvciBvZiB0aGUgYHZpZXdgLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdwZXJmb3JtYW5jZScsIHRydWUsIG9wdGlvbnMuY29sb3IgfHwgJ2JsYWNrJyk7XG4gIH1cblxuICAvKipcbiAgICogQXV0b21hdGljYWxseSBjYWxsZWQgdG8gc3RhcnQgdGhlIG1vZHVsZS4gLy8gVE9ET1xuICAgKiBTZW5kcyBhIG1lc3NhZ2UgdG8gdGhlIHNlcnZlciBzaWRlIG1vZHVsZSB0byBpbmRpY2F0ZSB0aGF0IHRoZSBjbGllbnQgZW50ZXJlZCB0aGUgcGVyZm9ybWFuY2UuXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuICAgIC8vIGNsaWVudC5zZW5kKHRoaXMubmFtZSArICc6c3RhcnQnKTtcbiAgICB0aGlzLnNlbmQoJ3N0YXJ0JylcbiAgfVxuXG4gIC8qKlxuICAgKiBDYW4gYmUgY2FsbGVkIHRvIHRlcm1pbmF0ZSB0aGUgcGVyZm9ybWFuY2UuXG4gICAqIFNlbmRzIGEgbWVzc2FnZSB0byB0aGUgc2VydmVyIHNpZGUgbW9kdWxlIHRvIGluZGljYXRlIHRoYXQgdGhlIGNsaWVudCBleGl0ZWQgdGhlIHBlcmZvcm1hbmNlLlxuICAgKi9cbiAgZG9uZSgpIHtcbiAgICAvLyBjbGllbnQuc2VuZCh0aGlzLm5hbWUgKyAnOmRvbmUnKTtcbiAgICB0aGlzLnNlbmQoJ2RvbmUnKVxuICAgIHN1cGVyLmRvbmUoKTsgLy8gVE9ETzogY2hlY2sgaWYgbmVlZHMgdG8gYmUgY2FsbGVkIGxhc3RseVxuICB9XG59XG4iXX0=