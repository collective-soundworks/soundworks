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

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _serviceManager = require('./serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

var _Signal = require('./Signal');

var _Signal2 = _interopRequireDefault(_Signal);

var _SignalAll = require('./SignalAll');

var _SignalAll2 = _interopRequireDefault(_SignalAll);

var log = (0, _debug2['default'])('soundworks:services');

var Service = (function (_Activity) {
  _inherits(Service, _Activity);

  function Service(id, hasNetwork) {
    var _this = this;

    _classCallCheck(this, Service);

    _get(Object.getPrototypeOf(Service.prototype), 'constructor', this).call(this, id, hasNetwork);

    this.requiredSignals.addObserver(function (value) {
      if (value) {
        _this.start();
        _this.hasStarted = true;
      } else {
        _this.stop();
      }
    });

    /**
     * Is set to `true` when a signal is ready to be consumed.
     * @type {Signal}
     */
    this.signals.ready = new _Signal2['default']();

    // add the serviceManager bootstart signal to the required signals
    this.requiredSignals.add(_serviceManager2['default'].signals.start);
  }

  _createClass(Service, [{
    key: 'ready',
    value: function ready() {
      this.stop();
      this.signals.ready.set(true);
      log('"' + this.id + '" ready');
    }
  }, {
    key: 'require',
    value: function require(id) {
      var service = _serviceManager2['default'].require(id);
      var signal = service.signals.ready;

      if (signal) this.requiredSignals.add(signal);else throw new Error('signal "continue" doesn\'t exist on service :', service);

      return service;
    }
  }, {
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(Service.prototype), 'start', this).call(this);
      log('"' + this.id + '" started');
    }
  }, {
    key: 'stop',
    value: function stop() {
      _get(Object.getPrototypeOf(Service.prototype), 'stop', this).call(this);
      log('"' + this.id + '" stopped');
    }
  }]);

  return Service;
})(_Activity3['default']);

exports['default'] = Service;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvY29yZS9TZXJ2aWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7eUJBQXFCLFlBQVk7Ozs7cUJBQ2YsT0FBTzs7Ozs4QkFDRSxrQkFBa0I7Ozs7c0JBQzFCLFVBQVU7Ozs7eUJBQ1AsYUFBYTs7OztBQUVuQyxJQUFNLEdBQUcsR0FBRyx3QkFBTSxxQkFBcUIsQ0FBQyxDQUFDOztJQUVwQixPQUFPO1lBQVAsT0FBTzs7QUFDZixXQURRLE9BQU8sQ0FDZCxFQUFFLEVBQUUsVUFBVSxFQUFFOzs7MEJBRFQsT0FBTzs7QUFFeEIsK0JBRmlCLE9BQU8sNkNBRWxCLEVBQUUsRUFBRSxVQUFVLEVBQUU7O0FBRXRCLFFBQUksQ0FBQyxlQUFlLENBQUMsV0FBVyxDQUFDLFVBQUMsS0FBSyxFQUFLO0FBQzFDLFVBQUksS0FBSyxFQUFFO0FBQ1QsY0FBSyxLQUFLLEVBQUUsQ0FBQztBQUNiLGNBQUssVUFBVSxHQUFHLElBQUksQ0FBQztPQUN4QixNQUFNO0FBQ0wsY0FBSyxJQUFJLEVBQUUsQ0FBQztPQUNiO0tBQ0YsQ0FBQyxDQUFDOzs7Ozs7QUFNSCxRQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyx5QkFBWSxDQUFDOzs7QUFHbEMsUUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsNEJBQWUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0dBQ3hEOztlQXJCa0IsT0FBTzs7V0F1QnJCLGlCQUFHO0FBQ04sVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ1osVUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdCLFNBQUcsT0FBSyxJQUFJLENBQUMsRUFBRSxhQUFVLENBQUM7S0FDM0I7OztXQUVNLGlCQUFDLEVBQUUsRUFBRTtBQUNWLFVBQU0sT0FBTyxHQUFHLDRCQUFlLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUMzQyxVQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQzs7QUFFckMsVUFBSSxNQUFNLEVBQ1IsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsS0FFakMsTUFBTSxJQUFJLEtBQUssa0RBQWlELE9BQU8sQ0FBQyxDQUFDOztBQUUzRSxhQUFPLE9BQU8sQ0FBQztLQUNoQjs7O1dBRUksaUJBQUc7QUFDTixpQ0ExQ2lCLE9BQU8sdUNBMENWO0FBQ2QsU0FBRyxPQUFLLElBQUksQ0FBQyxFQUFFLGVBQVksQ0FBQztLQUM3Qjs7O1dBRUcsZ0JBQUc7QUFDTCxpQ0EvQ2lCLE9BQU8sc0NBK0NYO0FBQ2IsU0FBRyxPQUFLLElBQUksQ0FBQyxFQUFFLGVBQVksQ0FBQztLQUM3Qjs7O1NBakRrQixPQUFPOzs7cUJBQVAsT0FBTyIsImZpbGUiOiJzcmMvY2xpZW50L2NvcmUvU2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBY3Rpdml0eSBmcm9tICcuL0FjdGl2aXR5JztcbmltcG9ydCBkZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgU2lnbmFsIGZyb20gJy4vU2lnbmFsJztcbmltcG9ydCBTaWduYWxBbGwgZnJvbSAnLi9TaWduYWxBbGwnO1xuXG5jb25zdCBsb2cgPSBkZWJ1Zygnc291bmR3b3JrczpzZXJ2aWNlcycpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2aWNlIGV4dGVuZHMgQWN0aXZpdHkge1xuICBjb25zdHJ1Y3RvcihpZCwgaGFzTmV0d29yaykge1xuICAgIHN1cGVyKGlkLCBoYXNOZXR3b3JrKTtcblxuICAgIHRoaXMucmVxdWlyZWRTaWduYWxzLmFkZE9ic2VydmVyKCh2YWx1ZSkgPT4ge1xuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICAgICAgdGhpcy5oYXNTdGFydGVkID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogSXMgc2V0IHRvIGB0cnVlYCB3aGVuIGEgc2lnbmFsIGlzIHJlYWR5IHRvIGJlIGNvbnN1bWVkLlxuICAgICAqIEB0eXBlIHtTaWduYWx9XG4gICAgICovXG4gICAgdGhpcy5zaWduYWxzLnJlYWR5ID0gbmV3IFNpZ25hbCgpO1xuXG4gICAgLy8gYWRkIHRoZSBzZXJ2aWNlTWFuYWdlciBib290c3RhcnQgc2lnbmFsIHRvIHRoZSByZXF1aXJlZCBzaWduYWxzXG4gICAgdGhpcy5yZXF1aXJlZFNpZ25hbHMuYWRkKHNlcnZpY2VNYW5hZ2VyLnNpZ25hbHMuc3RhcnQpO1xuICB9XG5cbiAgcmVhZHkoKSB7XG4gICAgdGhpcy5zdG9wKCk7XG4gICAgdGhpcy5zaWduYWxzLnJlYWR5LnNldCh0cnVlKTtcbiAgICBsb2coYFwiJHt0aGlzLmlkfVwiIHJlYWR5YCk7XG4gIH1cblxuICByZXF1aXJlKGlkKSB7XG4gICAgY29uc3Qgc2VydmljZSA9IHNlcnZpY2VNYW5hZ2VyLnJlcXVpcmUoaWQpO1xuICAgIGNvbnN0IHNpZ25hbCA9IHNlcnZpY2Uuc2lnbmFscy5yZWFkeTtcblxuICAgIGlmIChzaWduYWwpXG4gICAgICB0aGlzLnJlcXVpcmVkU2lnbmFscy5hZGQoc2lnbmFsKTtcbiAgICBlbHNlXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYHNpZ25hbCBcImNvbnRpbnVlXCIgZG9lc24ndCBleGlzdCBvbiBzZXJ2aWNlIDpgLCBzZXJ2aWNlKTtcblxuICAgIHJldHVybiBzZXJ2aWNlO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgICBsb2coYFwiJHt0aGlzLmlkfVwiIHN0YXJ0ZWRgKTtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgc3VwZXIuc3RvcCgpO1xuICAgIGxvZyhgXCIke3RoaXMuaWR9XCIgc3RvcHBlZGApO1xuICB9XG59XG5cbiJdfQ==