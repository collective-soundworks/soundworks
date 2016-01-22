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

var _displayCanvasView = require('./display/CanvasView');

var _displayCanvasView2 = _interopRequireDefault(_displayCanvasView);

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
   * Start the module and send a message to the server side module to indicate that the client enters the performance.
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
     * The performance module should not be resetted while launched, instead it should resynchronize (aka restart) with the server.
     */
  }, {
    key: 'reset',
    value: function reset() {
      this.restart();
    }

    /**
     * Can be called to terminate the performance.
     * Send a message to the server side module to indicate that the client exits the performance.
     */
  }, {
    key: 'done',
    value: function done() {
      this.send('done');
      _get(Object.getPrototypeOf(ClientPerformance.prototype), 'done', this).call(this);
    }
  }]);

  return ClientPerformance;
})(_ClientModule3['default']);

exports['default'] = ClientPerformance;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50UGVyZm9ybWFuY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs2QkFBeUIsZ0JBQWdCOzs7O2lDQUNsQixzQkFBc0I7Ozs7Ozs7Ozs7OztJQVN4QixpQkFBaUI7WUFBakIsaUJBQWlCOzs7Ozs7OztBQU16QixXQU5RLGlCQUFpQixHQU1WO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFOTCxpQkFBaUI7O0FBT2xDLCtCQVBpQixpQkFBaUIsNkNBTzVCLE9BQU8sQ0FBQyxJQUFJLElBQUksYUFBYSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsS0FBSyxJQUFJLE9BQU8sRUFBRTs7QUFFckUsUUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLFNBQVMsRUFBRSxDQUFDLFFBQVEsRUFBRSxhQUFhLENBQUMsRUFBRSxDQUFDO0dBQzdEOzs7Ozs7OztlQVZrQixpQkFBaUI7O1dBaUIvQixpQkFBRztBQUNOLGlDQWxCaUIsaUJBQWlCLHVDQWtCcEI7QUFDZCxVQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ3BCOzs7Ozs7O1dBS0ksaUJBQUc7QUFDTixVQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDaEI7Ozs7Ozs7O1dBTUcsZ0JBQUc7QUFDTCxVQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2xCLGlDQW5DaUIsaUJBQWlCLHNDQW1DckI7S0FDZDs7O1NBcENrQixpQkFBaUI7OztxQkFBakIsaUJBQWlCIiwiZmlsZSI6InNyYy9jbGllbnQvQ2xpZW50UGVyZm9ybWFuY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ2xpZW50TW9kdWxlIGZyb20gJy4vQ2xpZW50TW9kdWxlJztcbmltcG9ydCBDYW52YXNWaWV3IGZyb20gJy4vZGlzcGxheS9DYW52YXNWaWV3JztcblxuLyoqXG4gKiBbY2xpZW50XSBCYXNlIGNsYXNzIHVzZWQgdG8gYnVpbGQgYSBwZXJmb3JtYW5jZSBvbiB0aGUgY2xpZW50IHNpZGUuXG4gKlxuICogVGhlIGJhc2UgY2xhc3MgYWx3YXlzIGhhcyBhIHZpZXcuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvc2VydmVyL1NlcnZlclBlcmZvcm1hbmNlLmpzflNlcnZlclBlcmZvcm1hbmNlfSBvbiB0aGUgc2VydmVyIHNpZGUuKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnRQZXJmb3JtYW5jZSBleHRlbmRzIENsaWVudE1vZHVsZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdwZXJmb3JtYW5jZSddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmNvbG9yPSdibGFjayddIEJhY2tncm91bmQgY29sb3Igb2YgdGhlIGB2aWV3YC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAncGVyZm9ybWFuY2UnLCB0cnVlLCBvcHRpb25zLmNvbG9yIHx8ICdibGFjaycpO1xuXG4gICAgdGhpcy52aWV3T3B0aW9ucyA9IHsgY2xhc3NOYW1lOiBbJ21vZHVsZScsICdwZXJmb3JtYW5jZSddIH07XG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgdGhlIG1vZHVsZSBhbmQgc2VuZCBhIG1lc3NhZ2UgdG8gdGhlIHNlcnZlciBzaWRlIG1vZHVsZSB0byBpbmRpY2F0ZSB0aGF0IHRoZSBjbGllbnQgZW50ZXJzIHRoZSBwZXJmb3JtYW5jZS5cbiAgICpcbiAgICogKipOb3RlOioqIHRoZSBtZXRob2QgaXMgY2FsbGVkIGF1dG9tYXRpY2FsbHkgd2hlbiBuZWNlc3NhcnksIHlvdSBzaG91bGQgbm90IGNhbGwgaXQgbWFudWFsbHkuXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuICAgIHRoaXMuc2VuZCgnc3RhcnQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgcGVyZm9ybWFuY2UgbW9kdWxlIHNob3VsZCBub3QgYmUgcmVzZXR0ZWQgd2hpbGUgbGF1bmNoZWQsIGluc3RlYWQgaXQgc2hvdWxkIHJlc3luY2hyb25pemUgKGFrYSByZXN0YXJ0KSB3aXRoIHRoZSBzZXJ2ZXIuXG4gICAqL1xuICByZXNldCgpIHtcbiAgICB0aGlzLnJlc3RhcnQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYW4gYmUgY2FsbGVkIHRvIHRlcm1pbmF0ZSB0aGUgcGVyZm9ybWFuY2UuXG4gICAqIFNlbmQgYSBtZXNzYWdlIHRvIHRoZSBzZXJ2ZXIgc2lkZSBtb2R1bGUgdG8gaW5kaWNhdGUgdGhhdCB0aGUgY2xpZW50IGV4aXRzIHRoZSBwZXJmb3JtYW5jZS5cbiAgICovXG4gIGRvbmUoKSB7XG4gICAgdGhpcy5zZW5kKCdkb25lJyk7XG4gICAgc3VwZXIuZG9uZSgpO1xuICB9XG59XG4iXX0=