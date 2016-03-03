'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Activity2 = require('./Activity');

var _Activity3 = _interopRequireDefault(_Activity2);

var _serviceManager = require('./serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

var _Signal = require('./Signal');

var _Signal2 = _interopRequireDefault(_Signal);

var Scene = (function (_Activity) {
  _inherits(Scene, _Activity);

  function Scene(id, hasNetwork) {
    var _this = this;

    _classCallCheck(this, Scene);

    _get(Object.getPrototypeOf(Scene.prototype), 'constructor', this).call(this, id, hasNetwork);

    this.requiredSignals.addObserver(function (value) {
      if (value) {
        _this.start();
        _this.hasStarted = true;
      } /* else {
        this.hold(); // pause / resume
        } */
    });

    this.signals.done = new _Signal2['default']();
    this.requiredSignals.add(_serviceManager2['default'].signals.ready);
  }

  /**
   * Returns a service configured with the given options.
   * @param {String} id - The identifier of the service.
   * @param {Object} options - The options to configure the service.
   */

  _createClass(Scene, [{
    key: 'require',
    value: function require(id, options) {
      return _serviceManager2['default'].require(id, options);
    }

    /**
     * Add a signal to the required signals for start.
     * @param {Signal} signal - The signal that must be waited for.
     */
  }, {
    key: 'waitFor',
    value: function waitFor(signal) {
      this.requiredSignals.add(signal);
    }

    /**
     * Mark the `Scene` as terminated. The call of this method is a responsibility
     * of the client code.
     */
  }, {
    key: 'done',
    value: function done() {
      this.hide();
      this.signals.done.set(true);
    }
  }]);

  return Scene;
})(_Activity3['default']);

exports['default'] = Scene;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L2NvcmUvU2NlbmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozt5QkFBcUIsWUFBWTs7Ozs4QkFDTixrQkFBa0I7Ozs7c0JBQzFCLFVBQVU7Ozs7SUFHUixLQUFLO1lBQUwsS0FBSzs7QUFDYixXQURRLEtBQUssQ0FDWixFQUFFLEVBQUUsVUFBVSxFQUFFOzs7MEJBRFQsS0FBSzs7QUFFdEIsK0JBRmlCLEtBQUssNkNBRWhCLEVBQUUsRUFBRSxVQUFVLEVBQUU7O0FBRXRCLFFBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLFVBQUMsS0FBSyxFQUFLO0FBQzFDLFVBQUksS0FBSyxFQUFFO0FBQ1QsY0FBSyxLQUFLLEVBQUUsQ0FBQztBQUNiLGNBQUssVUFBVSxHQUFHLElBQUksQ0FBQztPQUN4Qjs7O0tBR0YsQ0FBQyxDQUFDOztBQUdILFFBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFHLHlCQUFZLENBQUM7QUFDakMsUUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsNEJBQWUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0dBQ3hEOzs7Ozs7OztlQWhCa0IsS0FBSzs7V0F1QmpCLGlCQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUU7QUFDbkIsYUFBTyw0QkFBZSxPQUFPLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQzVDOzs7Ozs7OztXQU1NLGlCQUFDLE1BQU0sRUFBRTtBQUNkLFVBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ2xDOzs7Ozs7OztXQU1HLGdCQUFHO0FBQ0wsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ1osVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzdCOzs7U0ExQ2tCLEtBQUs7OztxQkFBTCxLQUFLIiwiZmlsZSI6Ii9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L2NvcmUvU2NlbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWN0aXZpdHkgZnJvbSAnLi9BY3Rpdml0eSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgU2lnbmFsIGZyb20gJy4vU2lnbmFsJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY2VuZSBleHRlbmRzIEFjdGl2aXR5IHtcbiAgY29uc3RydWN0b3IoaWQsIGhhc05ldHdvcmspIHtcbiAgICBzdXBlcihpZCwgaGFzTmV0d29yayk7XG5cbiAgICB0aGlzLnJlcXVpcmVkU2lnbmFscy5hZGRPYnNlcnZlcigodmFsdWUpID0+IHtcbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgICAgIHRoaXMuaGFzU3RhcnRlZCA9IHRydWU7XG4gICAgICB9IC8qIGVsc2Uge1xuICAgICAgICB0aGlzLmhvbGQoKTsgLy8gcGF1c2UgLyByZXN1bWVcbiAgICAgIH0gKi9cbiAgICB9KTtcblxuXG4gICAgdGhpcy5zaWduYWxzLmRvbmUgPSBuZXcgU2lnbmFsKCk7XG4gICAgdGhpcy5yZXF1aXJlZFNpZ25hbHMuYWRkKHNlcnZpY2VNYW5hZ2VyLnNpZ25hbHMucmVhZHkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzZXJ2aWNlIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gVGhlIGlkZW50aWZpZXIgb2YgdGhlIHNlcnZpY2UuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gVGhlIG9wdGlvbnMgdG8gY29uZmlndXJlIHRoZSBzZXJ2aWNlLlxuICAgKi9cbiAgcmVxdWlyZShpZCwgb3B0aW9ucykge1xuICAgIHJldHVybiBzZXJ2aWNlTWFuYWdlci5yZXF1aXJlKGlkLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBzaWduYWwgdG8gdGhlIHJlcXVpcmVkIHNpZ25hbHMgZm9yIHN0YXJ0LlxuICAgKiBAcGFyYW0ge1NpZ25hbH0gc2lnbmFsIC0gVGhlIHNpZ25hbCB0aGF0IG11c3QgYmUgd2FpdGVkIGZvci5cbiAgICovXG4gIHdhaXRGb3Ioc2lnbmFsKSB7XG4gICAgdGhpcy5yZXF1aXJlZFNpZ25hbHMuYWRkKHNpZ25hbCk7XG4gIH1cblxuICAvKipcbiAgICogTWFyayB0aGUgYFNjZW5lYCBhcyB0ZXJtaW5hdGVkLiBUaGUgY2FsbCBvZiB0aGlzIG1ldGhvZCBpcyBhIHJlc3BvbnNpYmlsaXR5XG4gICAqIG9mIHRoZSBjbGllbnQgY29kZS5cbiAgICovXG4gIGRvbmUoKSB7XG4gICAgdGhpcy5oaWRlKCk7XG4gICAgdGhpcy5zaWduYWxzLmRvbmUuc2V0KHRydWUpO1xuICB9XG59XG4iXX0=