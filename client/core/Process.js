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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L2NvcmUvUHJvY2Vzcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3NCQUE2QixRQUFROztzQkFDbEIsVUFBVTs7Ozs7Ozs7O0lBTVIsT0FBTztZQUFQLE9BQU87O0FBQ2YsV0FEUSxPQUFPLENBQ2QsRUFBRSxFQUFFOzBCQURHLE9BQU87O0FBRXhCLCtCQUZpQixPQUFPLDZDQUVoQjs7Ozs7QUFLUixRQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQzs7Ozs7O0FBTWIsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDbEIsUUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcseUJBQVksQ0FBQztHQUNwQzs7Ozs7O2VBZmtCLE9BQU87O1dBb0JyQixpQkFBRztBQUNOLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUMvQjs7Ozs7OztXQUtHLGdCQUFHO0FBQ0wsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ2hDOzs7U0E3QmtCLE9BQU87OztxQkFBUCxPQUFPIiwiZmlsZSI6Ii9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L2NvcmUvUHJvY2Vzcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgU2lnbmFsIGZyb20gJy4vU2lnbmFsJztcblxuLyoqXG4gKiBBIHByb2Nlc3MgZGVmaW5lcyB0aGUgc2ltcGxpZXN0IHVuaXQgb2YgdGhlIGZyYW1ld29yay5cbiAqIEl0IGlzIGRlZmluZWQgYnkgYSBzaWduYWwgYGFjdGl2ZWAgYW5kIDIgbWV0aG9kczogYHN0YXJ0YCBhbmQgYHN0b3BgPS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJvY2VzcyBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKGlkKSB7XG4gICAgc3VwZXIoKTtcbiAgICAvKipcbiAgICAgKiBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLmlkID0gaWQ7XG5cbiAgICAvKipcbiAgICAgKiBTaWduYWxzIGRlZmluaW5nIHRoZSBwcm9jZXNzIHN0YXRlLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5zaWduYWxzID0ge307XG4gICAgdGhpcy5zaWduYWxzLmFjdGl2ZSA9IG5ldyBTaWduYWwoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCBhIHByb2Nlc3MuXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICB0aGlzLnNpZ25hbHMuYWN0aXZlLnNldCh0cnVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9wIGEgcHJvY2Vzcy5cbiAgICovXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5zaWduYWxzLmFjdGl2ZS5zZXQoZmFsc2UpO1xuICB9XG5cbn1cbiJdfQ==