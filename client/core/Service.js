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

    this._requiredSignals = new _SignalAll2['default']();
    this._requiredSignals.addObserver(function (value) {
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
    this._requiredSignals.add(_serviceManager2['default'].signals.start);
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

      if (signal) this._requiredSignals.add(signal);else throw new Error('signal "continue" doesn\'t exist on service :', service);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvY29yZS9TZXJ2aWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7eUJBQXFCLFlBQVk7Ozs7cUJBQ2YsT0FBTzs7Ozs4QkFDRSxrQkFBa0I7Ozs7c0JBQzFCLFVBQVU7Ozs7eUJBQ1AsYUFBYTs7OztBQUVuQyxJQUFNLEdBQUcsR0FBRyx3QkFBTSxxQkFBcUIsQ0FBQyxDQUFDOztJQUVwQixPQUFPO1lBQVAsT0FBTzs7QUFDZixXQURRLE9BQU8sQ0FDZCxFQUFFLEVBQUUsVUFBVSxFQUFFOzs7MEJBRFQsT0FBTzs7QUFFeEIsK0JBRmlCLE9BQU8sNkNBRWxCLEVBQUUsRUFBRSxVQUFVLEVBQUU7O0FBRXRCLFFBQUksQ0FBQyxnQkFBZ0IsR0FBRyw0QkFBZSxDQUFDO0FBQ3hDLFFBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsVUFBQyxLQUFLLEVBQUs7QUFDM0MsVUFBSSxLQUFLLEVBQUU7QUFDVCxjQUFLLEtBQUssRUFBRSxDQUFDO0FBQ2IsY0FBSyxVQUFVLEdBQUcsSUFBSSxDQUFDO09BQ3hCLE1BQU07QUFDTCxjQUFLLElBQUksRUFBRSxDQUFDO09BQ2I7S0FDRixDQUFDLENBQUM7Ozs7OztBQU1ILFFBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLHlCQUFZLENBQUM7OztBQUdsQyxRQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLDRCQUFlLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUN6RDs7ZUF0QmtCLE9BQU87O1dBd0JyQixpQkFBRztBQUNOLFVBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNaLFVBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM3QixTQUFHLE9BQUssSUFBSSxDQUFDLEVBQUUsYUFBVSxDQUFDO0tBQzNCOzs7V0FFTSxpQkFBQyxFQUFFLEVBQUU7QUFDVixVQUFNLE9BQU8sR0FBRyw0QkFBZSxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDM0MsVUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7O0FBRXJDLFVBQUksTUFBTSxFQUNSLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsS0FFbEMsTUFBTSxJQUFJLEtBQUssa0RBQWlELE9BQU8sQ0FBQyxDQUFDOztBQUUzRSxhQUFPLE9BQU8sQ0FBQztLQUNoQjs7O1dBRUksaUJBQUc7QUFDTixpQ0EzQ2lCLE9BQU8sdUNBMkNWO0FBQ2QsU0FBRyxPQUFLLElBQUksQ0FBQyxFQUFFLGVBQVksQ0FBQztLQUM3Qjs7O1dBRUcsZ0JBQUc7QUFDTCxpQ0FoRGlCLE9BQU8sc0NBZ0RYO0FBQ2IsU0FBRyxPQUFLLElBQUksQ0FBQyxFQUFFLGVBQVksQ0FBQztLQUM3Qjs7O1NBbERrQixPQUFPOzs7cUJBQVAsT0FBTyIsImZpbGUiOiJzcmMvY2xpZW50L2NvcmUvU2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBY3Rpdml0eSBmcm9tICcuL0FjdGl2aXR5JztcbmltcG9ydCBkZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgU2lnbmFsIGZyb20gJy4vU2lnbmFsJztcbmltcG9ydCBTaWduYWxBbGwgZnJvbSAnLi9TaWduYWxBbGwnO1xuXG5jb25zdCBsb2cgPSBkZWJ1Zygnc291bmR3b3JrczpzZXJ2aWNlcycpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2aWNlIGV4dGVuZHMgQWN0aXZpdHkge1xuICBjb25zdHJ1Y3RvcihpZCwgaGFzTmV0d29yaykge1xuICAgIHN1cGVyKGlkLCBoYXNOZXR3b3JrKTtcblxuICAgIHRoaXMuX3JlcXVpcmVkU2lnbmFscyA9IG5ldyBTaWduYWxBbGwoKTtcbiAgICB0aGlzLl9yZXF1aXJlZFNpZ25hbHMuYWRkT2JzZXJ2ZXIoKHZhbHVlKSA9PiB7XG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgICAgICB0aGlzLmhhc1N0YXJ0ZWQgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBJcyBzZXQgdG8gYHRydWVgIHdoZW4gYSBzaWduYWwgaXMgcmVhZHkgdG8gYmUgY29uc3VtZWQuXG4gICAgICogQHR5cGUge1NpZ25hbH1cbiAgICAgKi9cbiAgICB0aGlzLnNpZ25hbHMucmVhZHkgPSBuZXcgU2lnbmFsKCk7XG5cbiAgICAvLyBhZGQgdGhlIHNlcnZpY2VNYW5hZ2VyIGJvb3RzdGFydCBzaWduYWwgdG8gdGhlIHJlcXVpcmVkIHNpZ25hbHNcbiAgICB0aGlzLl9yZXF1aXJlZFNpZ25hbHMuYWRkKHNlcnZpY2VNYW5hZ2VyLnNpZ25hbHMuc3RhcnQpO1xuICB9XG5cbiAgcmVhZHkoKSB7XG4gICAgdGhpcy5zdG9wKCk7XG4gICAgdGhpcy5zaWduYWxzLnJlYWR5LnNldCh0cnVlKTtcbiAgICBsb2coYFwiJHt0aGlzLmlkfVwiIHJlYWR5YCk7XG4gIH1cblxuICByZXF1aXJlKGlkKSB7XG4gICAgY29uc3Qgc2VydmljZSA9IHNlcnZpY2VNYW5hZ2VyLnJlcXVpcmUoaWQpO1xuICAgIGNvbnN0IHNpZ25hbCA9IHNlcnZpY2Uuc2lnbmFscy5yZWFkeTtcblxuICAgIGlmIChzaWduYWwpXG4gICAgICB0aGlzLl9yZXF1aXJlZFNpZ25hbHMuYWRkKHNpZ25hbCk7XG4gICAgZWxzZVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBzaWduYWwgXCJjb250aW51ZVwiIGRvZXNuJ3QgZXhpc3Qgb24gc2VydmljZSA6YCwgc2VydmljZSk7XG5cbiAgICByZXR1cm4gc2VydmljZTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG4gICAgbG9nKGBcIiR7dGhpcy5pZH1cIiBzdGFydGVkYCk7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHN1cGVyLnN0b3AoKTtcbiAgICBsb2coYFwiJHt0aGlzLmlkfVwiIHN0b3BwZWRgKTtcbiAgfVxufVxuXG4iXX0=