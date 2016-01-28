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

var _SignalAll = require('./SignalAll');

var _SignalAll2 = _interopRequireDefault(_SignalAll);

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
    }
  }, {
    key: 'require',
    value: function require(id) {
      var service = _serviceManager2['default'].getInstance(id);
      var signal = service.signals.ready;

      if (signal) this._requiredSignals.add(signal);else throw new Error('signal "continue" doesn\'t exist on service :', service);

      return service;
    }
  }, {
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(Service.prototype), 'start', this).call(this);
      console.log('%c' + this.id + ':start', 'color: green');
    }
  }, {
    key: 'stop',
    value: function stop() {
      _get(Object.getPrototypeOf(Service.prototype), 'stop', this).call(this);
      console.log('%c' + this.id + ':stop', 'color: green');
    }
  }]);

  return Service;
})(_Activity3['default']);

exports['default'] = Service;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvY29yZS9TZXJ2aWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7eUJBQXFCLFlBQVk7Ozs7OEJBQ04sa0JBQWtCOzs7O3NCQUMxQixVQUFVOzs7O3lCQUNQLGFBQWE7Ozs7SUFFZCxPQUFPO1lBQVAsT0FBTzs7QUFDZixXQURRLE9BQU8sQ0FDZCxFQUFFLEVBQUUsVUFBVSxFQUFFOzs7MEJBRFQsT0FBTzs7QUFFeEIsK0JBRmlCLE9BQU8sNkNBRWxCLEVBQUUsRUFBRSxVQUFVLEVBQUU7O0FBRXRCLFFBQUksQ0FBQyxnQkFBZ0IsR0FBRyw0QkFBZSxDQUFDO0FBQ3hDLFFBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsVUFBQyxLQUFLLEVBQUs7QUFDM0MsVUFBSSxLQUFLLEVBQUU7QUFDVCxjQUFLLEtBQUssRUFBRSxDQUFDO0FBQ2IsY0FBSyxVQUFVLEdBQUcsSUFBSSxDQUFDO09BQ3hCLE1BQU07QUFDTCxjQUFLLElBQUksRUFBRSxDQUFDO09BQ2I7S0FDRixDQUFDLENBQUM7Ozs7OztBQU1ILFFBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLHlCQUFZLENBQUM7OztBQUdsQyxRQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLDRCQUFlLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUN6RDs7ZUF0QmtCLE9BQU87O1dBd0JyQixpQkFBRztBQUNOLFVBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNaLFVBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUM5Qjs7O1dBRU0saUJBQUMsRUFBRSxFQUFFO0FBQ1YsVUFBTSxPQUFPLEdBQUcsNEJBQWUsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQy9DLFVBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDOztBQUVyQyxVQUFJLE1BQU0sRUFDUixJQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEtBRWxDLE1BQU0sSUFBSSxLQUFLLGtEQUFpRCxPQUFPLENBQUMsQ0FBQzs7QUFFM0UsYUFBTyxPQUFPLENBQUM7S0FDaEI7OztXQUVJLGlCQUFHO0FBQ04saUNBMUNpQixPQUFPLHVDQTBDVjtBQUNkLGFBQU8sQ0FBQyxHQUFHLFFBQU0sSUFBSSxDQUFDLEVBQUUsYUFBVSxjQUFjLENBQUMsQ0FBQztLQUNuRDs7O1dBRUcsZ0JBQUc7QUFDTCxpQ0EvQ2lCLE9BQU8sc0NBK0NYO0FBQ2IsYUFBTyxDQUFDLEdBQUcsUUFBTSxJQUFJLENBQUMsRUFBRSxZQUFTLGNBQWMsQ0FBQyxDQUFDO0tBQ2xEOzs7U0FqRGtCLE9BQU87OztxQkFBUCxPQUFPIiwiZmlsZSI6InNyYy9jbGllbnQvY29yZS9TZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFjdGl2aXR5IGZyb20gJy4vQWN0aXZpdHknO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4vc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IFNpZ25hbCBmcm9tICcuL1NpZ25hbCc7XG5pbXBvcnQgU2lnbmFsQWxsIGZyb20gJy4vU2lnbmFsQWxsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmljZSBleHRlbmRzIEFjdGl2aXR5IHtcbiAgY29uc3RydWN0b3IoaWQsIGhhc05ldHdvcmspIHtcbiAgICBzdXBlcihpZCwgaGFzTmV0d29yayk7XG5cbiAgICB0aGlzLl9yZXF1aXJlZFNpZ25hbHMgPSBuZXcgU2lnbmFsQWxsKCk7XG4gICAgdGhpcy5fcmVxdWlyZWRTaWduYWxzLmFkZE9ic2VydmVyKCh2YWx1ZSkgPT4ge1xuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICAgICAgdGhpcy5oYXNTdGFydGVkID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogSXMgc2V0IHRvIGB0cnVlYCB3aGVuIGEgc2lnbmFsIGlzIHJlYWR5IHRvIGJlIGNvbnN1bWVkLlxuICAgICAqIEB0eXBlIHtTaWduYWx9XG4gICAgICovXG4gICAgdGhpcy5zaWduYWxzLnJlYWR5ID0gbmV3IFNpZ25hbCgpO1xuXG4gICAgLy8gYWRkIHRoZSBzZXJ2aWNlTWFuYWdlciBib290c3RhcnQgc2lnbmFsIHRvIHRoZSByZXF1aXJlZCBzaWduYWxzXG4gICAgdGhpcy5fcmVxdWlyZWRTaWduYWxzLmFkZChzZXJ2aWNlTWFuYWdlci5zaWduYWxzLnN0YXJ0KTtcbiAgfVxuXG4gIHJlYWR5KCkge1xuICAgIHRoaXMuc3RvcCgpO1xuICAgIHRoaXMuc2lnbmFscy5yZWFkeS5zZXQodHJ1ZSk7XG4gIH1cblxuICByZXF1aXJlKGlkKSB7XG4gICAgY29uc3Qgc2VydmljZSA9IHNlcnZpY2VNYW5hZ2VyLmdldEluc3RhbmNlKGlkKTtcbiAgICBjb25zdCBzaWduYWwgPSBzZXJ2aWNlLnNpZ25hbHMucmVhZHk7XG5cbiAgICBpZiAoc2lnbmFsKVxuICAgICAgdGhpcy5fcmVxdWlyZWRTaWduYWxzLmFkZChzaWduYWwpO1xuICAgIGVsc2VcbiAgICAgIHRocm93IG5ldyBFcnJvcihgc2lnbmFsIFwiY29udGludWVcIiBkb2Vzbid0IGV4aXN0IG9uIHNlcnZpY2UgOmAsIHNlcnZpY2UpO1xuXG4gICAgcmV0dXJuIHNlcnZpY2U7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuICAgIGNvbnNvbGUubG9nKGAlYyR7dGhpcy5pZH06c3RhcnRgLCAnY29sb3I6IGdyZWVuJyk7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHN1cGVyLnN0b3AoKTtcbiAgICBjb25zb2xlLmxvZyhgJWMke3RoaXMuaWR9OnN0b3BgLCAnY29sb3I6IGdyZWVuJyk7XG4gIH1cbn1cblxuIl19