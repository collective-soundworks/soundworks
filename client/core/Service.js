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
      log('"' + this.id + '" ready');
      this.signals.ready.set(true);
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
      log('"' + this.id + '" started');
      _get(Object.getPrototypeOf(Service.prototype), 'start', this).call(this);
    }
  }, {
    key: 'stop',
    value: function stop() {
      log('"' + this.id + '" stopped');
      _get(Object.getPrototypeOf(Service.prototype), 'stop', this).call(this);
    }
  }]);

  return Service;
})(_Activity3['default']);

exports['default'] = Service;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L2NvcmUvU2VydmljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3lCQUFxQixZQUFZOzs7O3FCQUNmLE9BQU87Ozs7OEJBQ0Usa0JBQWtCOzs7O3NCQUMxQixVQUFVOzs7O3lCQUNQLGFBQWE7Ozs7QUFFbkMsSUFBTSxHQUFHLEdBQUcsd0JBQU0scUJBQXFCLENBQUMsQ0FBQzs7SUFFcEIsT0FBTztZQUFQLE9BQU87O0FBQ2YsV0FEUSxPQUFPLENBQ2QsRUFBRSxFQUFFLFVBQVUsRUFBRTs7OzBCQURULE9BQU87O0FBRXhCLCtCQUZpQixPQUFPLDZDQUVsQixFQUFFLEVBQUUsVUFBVSxFQUFFOztBQUV0QixRQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxVQUFDLEtBQUssRUFBSztBQUMxQyxVQUFJLEtBQUssRUFBRTtBQUNULGNBQUssS0FBSyxFQUFFLENBQUM7QUFDYixjQUFLLFVBQVUsR0FBRyxJQUFJLENBQUM7T0FDeEIsTUFBTTtBQUNMLGNBQUssSUFBSSxFQUFFLENBQUM7T0FDYjtLQUNGLENBQUMsQ0FBQzs7Ozs7O0FBTUgsUUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcseUJBQVksQ0FBQzs7O0FBR2xDLFFBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLDRCQUFlLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUN4RDs7ZUFyQmtCLE9BQU87O1dBdUJyQixpQkFBRztBQUNOLFVBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNaLFNBQUcsT0FBSyxJQUFJLENBQUMsRUFBRSxhQUFVLENBQUM7QUFDMUIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzlCOzs7V0FFTSxpQkFBQyxFQUFFLEVBQUU7QUFDVixVQUFNLE9BQU8sR0FBRyw0QkFBZSxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDM0MsVUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7O0FBRXJDLFVBQUksTUFBTSxFQUNSLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBRWpDLE1BQU0sSUFBSSxLQUFLLGtEQUFpRCxPQUFPLENBQUMsQ0FBQzs7QUFFM0UsYUFBTyxPQUFPLENBQUM7S0FDaEI7OztXQUVJLGlCQUFHO0FBQ04sU0FBRyxPQUFLLElBQUksQ0FBQyxFQUFFLGVBQVksQ0FBQztBQUM1QixpQ0EzQ2lCLE9BQU8sdUNBMkNWO0tBQ2Y7OztXQUVHLGdCQUFHO0FBQ0wsU0FBRyxPQUFLLElBQUksQ0FBQyxFQUFFLGVBQVksQ0FBQztBQUM1QixpQ0FoRGlCLE9BQU8sc0NBZ0RYO0tBQ2Q7OztTQWpEa0IsT0FBTzs7O3FCQUFQLE9BQU8iLCJmaWxlIjoiL1VzZXJzL3NjaG5lbGwvRGV2ZWxvcG1lbnQvd2ViL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9zb3VuZHdvcmtzL3NyYy9jbGllbnQvY29yZS9TZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFjdGl2aXR5IGZyb20gJy4vQWN0aXZpdHknO1xuaW1wb3J0IGRlYnVnIGZyb20gJ2RlYnVnJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCBTaWduYWwgZnJvbSAnLi9TaWduYWwnO1xuaW1wb3J0IFNpZ25hbEFsbCBmcm9tICcuL1NpZ25hbEFsbCc7XG5cbmNvbnN0IGxvZyA9IGRlYnVnKCdzb3VuZHdvcmtzOnNlcnZpY2VzJyk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlcnZpY2UgZXh0ZW5kcyBBY3Rpdml0eSB7XG4gIGNvbnN0cnVjdG9yKGlkLCBoYXNOZXR3b3JrKSB7XG4gICAgc3VwZXIoaWQsIGhhc05ldHdvcmspO1xuXG4gICAgdGhpcy5yZXF1aXJlZFNpZ25hbHMuYWRkT2JzZXJ2ZXIoKHZhbHVlKSA9PiB7XG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgICAgICB0aGlzLmhhc1N0YXJ0ZWQgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBJcyBzZXQgdG8gYHRydWVgIHdoZW4gYSBzaWduYWwgaXMgcmVhZHkgdG8gYmUgY29uc3VtZWQuXG4gICAgICogQHR5cGUge1NpZ25hbH1cbiAgICAgKi9cbiAgICB0aGlzLnNpZ25hbHMucmVhZHkgPSBuZXcgU2lnbmFsKCk7XG5cbiAgICAvLyBhZGQgdGhlIHNlcnZpY2VNYW5hZ2VyIGJvb3RzdGFydCBzaWduYWwgdG8gdGhlIHJlcXVpcmVkIHNpZ25hbHNcbiAgICB0aGlzLnJlcXVpcmVkU2lnbmFscy5hZGQoc2VydmljZU1hbmFnZXIuc2lnbmFscy5zdGFydCk7XG4gIH1cblxuICByZWFkeSgpIHtcbiAgICB0aGlzLnN0b3AoKTtcbiAgICBsb2coYFwiJHt0aGlzLmlkfVwiIHJlYWR5YCk7XG4gICAgdGhpcy5zaWduYWxzLnJlYWR5LnNldCh0cnVlKTtcbiAgfVxuXG4gIHJlcXVpcmUoaWQpIHtcbiAgICBjb25zdCBzZXJ2aWNlID0gc2VydmljZU1hbmFnZXIucmVxdWlyZShpZCk7XG4gICAgY29uc3Qgc2lnbmFsID0gc2VydmljZS5zaWduYWxzLnJlYWR5O1xuXG4gICAgaWYgKHNpZ25hbClcbiAgICAgIHRoaXMucmVxdWlyZWRTaWduYWxzLmFkZChzaWduYWwpO1xuICAgIGVsc2VcbiAgICAgIHRocm93IG5ldyBFcnJvcihgc2lnbmFsIFwiY29udGludWVcIiBkb2Vzbid0IGV4aXN0IG9uIHNlcnZpY2UgOmAsIHNlcnZpY2UpO1xuXG4gICAgcmV0dXJuIHNlcnZpY2U7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBsb2coYFwiJHt0aGlzLmlkfVwiIHN0YXJ0ZWRgKTtcbiAgICBzdXBlci5zdGFydCgpO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICBsb2coYFwiJHt0aGlzLmlkfVwiIHN0b3BwZWRgKTtcbiAgICBzdXBlci5zdG9wKCk7XG4gIH1cbn1cblxuIl19