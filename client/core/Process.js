'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _events = require('events');

var _Signal = require('./Signal');

var _Signal2 = _interopRequireDefault(_Signal);

/**
 * A process defines the simpliest unit of the framework.
 * It is defined by a signal `active` and 2 methods: `start` and `stop`=.
 */

var Process = (function (_EventEmitter) {
  _inherits(Process, _EventEmitter);

  function Process(id) {
    _classCallCheck(this, Process);

    _get(Object.getPrototypeOf(Process.prototype), 'constructor', this).call(this);
    /**
     * Name of the module.
     * @type {String}
     */
    this.id = id;

    /**
     * Signals defining the process state.
     * @type {Object}
     */
    this.signals = {};
    this.signals.active = new _Signal2['default']();
  }

  /**
   * Start a process.
   */

  _createClass(Process, [{
    key: 'start',
    value: function start() {
      this.signals.active.set(true);
    }

    /**
     * Stop a process.
     */
  }, {
    key: 'stop',
    value: function stop() {
      this.signals.active.set(false);
    }
  }]);

  return Process;
})(_events.EventEmitter);

exports['default'] = Process;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvY29yZS9Qcm9jZXNzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBQTZCLFFBQVE7O3NCQUNsQixVQUFVOzs7Ozs7Ozs7SUFNUixPQUFPO1lBQVAsT0FBTzs7QUFDZixXQURRLE9BQU8sQ0FDZCxFQUFFLEVBQUU7MEJBREcsT0FBTzs7QUFFeEIsK0JBRmlCLE9BQU8sNkNBRWhCOzs7OztBQUtSLFFBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDOzs7Ozs7QUFNYixRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUNsQixRQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyx5QkFBWSxDQUFDO0dBQ3BDOzs7Ozs7ZUFma0IsT0FBTzs7V0FvQnJCLGlCQUFHO0FBQ04sVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQy9COzs7Ozs7O1dBS0csZ0JBQUc7QUFDTCxVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDaEM7OztTQTdCa0IsT0FBTzs7O3FCQUFQLE9BQU8iLCJmaWxlIjoic3JjL2NsaWVudC9jb3JlL1Byb2Nlc3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuaW1wb3J0IFNpZ25hbCBmcm9tICcuL1NpZ25hbCc7XG5cbi8qKlxuICogQSBwcm9jZXNzIGRlZmluZXMgdGhlIHNpbXBsaWVzdCB1bml0IG9mIHRoZSBmcmFtZXdvcmsuXG4gKiBJdCBpcyBkZWZpbmVkIGJ5IGEgc2lnbmFsIGBhY3RpdmVgIGFuZCAyIG1ldGhvZHM6IGBzdGFydGAgYW5kIGBzdG9wYD0uXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFByb2Nlc3MgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBjb25zdHJ1Y3RvcihpZCkge1xuICAgIHN1cGVyKCk7XG4gICAgLyoqXG4gICAgICogTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5pZCA9IGlkO1xuXG4gICAgLyoqXG4gICAgICogU2lnbmFscyBkZWZpbmluZyB0aGUgcHJvY2VzcyBzdGF0ZS5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuc2lnbmFscyA9IHt9O1xuICAgIHRoaXMuc2lnbmFscy5hY3RpdmUgPSBuZXcgU2lnbmFsKCk7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgYSBwcm9jZXNzLlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgdGhpcy5zaWduYWxzLmFjdGl2ZS5zZXQodHJ1ZSk7XG4gIH1cblxuICAvKipcbiAgICogU3RvcCBhIHByb2Nlc3MuXG4gICAqL1xuICBzdG9wKCkge1xuICAgIHRoaXMuc2lnbmFscy5hY3RpdmUuc2V0KGZhbHNlKTtcbiAgfVxuXG59XG4iXX0=