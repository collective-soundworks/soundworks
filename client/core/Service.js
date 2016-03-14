'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _debug2.default)('soundworks:services');

var Service = function (_Activity) {
  (0, _inherits3.default)(Service, _Activity);

  function Service(id, hasNetwork) {
    (0, _classCallCheck3.default)(this, Service);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Service).call(this, id, hasNetwork));

    _this.requiredSignals.addObserver(function (value) {
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
    _this.signals.ready = new _Signal2.default();
    // add the serviceManager bootstart signal to the required signals
    _this.requiredSignals.add(_serviceManager2.default.signals.start);
    return _this;
  }

  (0, _createClass3.default)(Service, [{
    key: 'ready',
    value: function ready() {
      this.stop();
      log('"' + this.id + '" ready');
      this.signals.ready.set(true);
    }
  }, {
    key: 'require',
    value: function require(id, options) {
      var service = _serviceManager2.default.require(id, options);
      var signal = service.signals.ready;

      if (signal) this.requiredSignals.add(signal);else throw new Error('signal "continue" doesn\'t exist on service :', service);

      return service;
    }
  }, {
    key: 'start',
    value: function start() {
      log('"' + this.id + '" started');
      (0, _get3.default)((0, _getPrototypeOf2.default)(Service.prototype), 'start', this).call(this);
    }
  }, {
    key: 'stop',
    value: function stop() {
      log('"' + this.id + '" stopped');
      (0, _get3.default)((0, _getPrototypeOf2.default)(Service.prototype), 'stop', this).call(this);
    }
  }]);
  return Service;
}(_Activity3.default);

exports.default = Service;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlcnZpY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTSxNQUFNLHFCQUFNLHFCQUFOLENBQU47O0lBRWU7OztBQUNuQixXQURtQixPQUNuQixDQUFZLEVBQVosRUFBZ0IsVUFBaEIsRUFBNEI7d0NBRFQsU0FDUzs7NkZBRFQsb0JBRVgsSUFBSSxhQURnQjs7QUFHMUIsVUFBSyxlQUFMLENBQXFCLFdBQXJCLENBQWlDLFVBQUMsS0FBRCxFQUFXO0FBQzFDLFVBQUksS0FBSixFQUFXO0FBQ1QsY0FBSyxLQUFMLEdBRFM7QUFFVCxjQUFLLFVBQUwsR0FBa0IsSUFBbEIsQ0FGUztPQUFYLE1BR087QUFDTCxjQUFLLElBQUwsR0FESztPQUhQO0tBRCtCLENBQWpDOzs7Ozs7QUFIMEIsU0FnQjFCLENBQUssT0FBTCxDQUFhLEtBQWIsR0FBcUIsc0JBQXJCOztBQWhCMEIsU0FrQjFCLENBQUssZUFBTCxDQUFxQixHQUFyQixDQUF5Qix5QkFBZSxPQUFmLENBQXVCLEtBQXZCLENBQXpCLENBbEIwQjs7R0FBNUI7OzZCQURtQjs7NEJBc0JYO0FBQ04sV0FBSyxJQUFMLEdBRE07QUFFTixnQkFBUSxLQUFLLEVBQUwsWUFBUixFQUZNO0FBR04sV0FBSyxPQUFMLENBQWEsS0FBYixDQUFtQixHQUFuQixDQUF1QixJQUF2QixFQUhNOzs7OzRCQU1BLElBQUksU0FBUztBQUNuQixVQUFNLFVBQVUseUJBQWUsT0FBZixDQUF1QixFQUF2QixFQUEyQixPQUEzQixDQUFWLENBRGE7QUFFbkIsVUFBTSxTQUFTLFFBQVEsT0FBUixDQUFnQixLQUFoQixDQUZJOztBQUluQixVQUFJLE1BQUosRUFDRSxLQUFLLGVBQUwsQ0FBcUIsR0FBckIsQ0FBeUIsTUFBekIsRUFERixLQUdFLE1BQU0sSUFBSSxLQUFKLGtEQUEwRCxPQUExRCxDQUFOLENBSEY7O0FBS0EsYUFBTyxPQUFQLENBVG1COzs7OzRCQVliO0FBQ04sZ0JBQVEsS0FBSyxFQUFMLGNBQVIsRUFETTtBQUVOLHVEQTFDaUIsNkNBMENqQixDQUZNOzs7OzJCQUtEO0FBQ0wsZ0JBQVEsS0FBSyxFQUFMLGNBQVIsRUFESztBQUVMLHVEQS9DaUIsNENBK0NqQixDQUZLOzs7U0E3Q1kiLCJmaWxlIjoiU2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBY3Rpdml0eSBmcm9tICcuL0FjdGl2aXR5JztcbmltcG9ydCBkZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgU2lnbmFsIGZyb20gJy4vU2lnbmFsJztcbmltcG9ydCBTaWduYWxBbGwgZnJvbSAnLi9TaWduYWxBbGwnO1xuXG5jb25zdCBsb2cgPSBkZWJ1Zygnc291bmR3b3JrczpzZXJ2aWNlcycpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2aWNlIGV4dGVuZHMgQWN0aXZpdHkge1xuICBjb25zdHJ1Y3RvcihpZCwgaGFzTmV0d29yaykge1xuICAgIHN1cGVyKGlkLCBoYXNOZXR3b3JrKTtcblxuICAgIHRoaXMucmVxdWlyZWRTaWduYWxzLmFkZE9ic2VydmVyKCh2YWx1ZSkgPT4ge1xuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICAgICAgdGhpcy5oYXNTdGFydGVkID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogSXMgc2V0IHRvIGB0cnVlYCB3aGVuIGEgc2lnbmFsIGlzIHJlYWR5IHRvIGJlIGNvbnN1bWVkLlxuICAgICAqIEB0eXBlIHtTaWduYWx9XG4gICAgICovXG4gICAgdGhpcy5zaWduYWxzLnJlYWR5ID0gbmV3IFNpZ25hbCgpO1xuICAgIC8vIGFkZCB0aGUgc2VydmljZU1hbmFnZXIgYm9vdHN0YXJ0IHNpZ25hbCB0byB0aGUgcmVxdWlyZWQgc2lnbmFsc1xuICAgIHRoaXMucmVxdWlyZWRTaWduYWxzLmFkZChzZXJ2aWNlTWFuYWdlci5zaWduYWxzLnN0YXJ0KTtcbiAgfVxuXG4gIHJlYWR5KCkge1xuICAgIHRoaXMuc3RvcCgpO1xuICAgIGxvZyhgXCIke3RoaXMuaWR9XCIgcmVhZHlgKTtcbiAgICB0aGlzLnNpZ25hbHMucmVhZHkuc2V0KHRydWUpO1xuICB9XG5cbiAgcmVxdWlyZShpZCwgb3B0aW9ucykge1xuICAgIGNvbnN0IHNlcnZpY2UgPSBzZXJ2aWNlTWFuYWdlci5yZXF1aXJlKGlkLCBvcHRpb25zKTtcbiAgICBjb25zdCBzaWduYWwgPSBzZXJ2aWNlLnNpZ25hbHMucmVhZHk7XG5cbiAgICBpZiAoc2lnbmFsKVxuICAgICAgdGhpcy5yZXF1aXJlZFNpZ25hbHMuYWRkKHNpZ25hbCk7XG4gICAgZWxzZVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBzaWduYWwgXCJjb250aW51ZVwiIGRvZXNuJ3QgZXhpc3Qgb24gc2VydmljZSA6YCwgc2VydmljZSk7XG5cbiAgICByZXR1cm4gc2VydmljZTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIGxvZyhgXCIke3RoaXMuaWR9XCIgc3RhcnRlZGApO1xuICAgIHN1cGVyLnN0YXJ0KCk7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIGxvZyhgXCIke3RoaXMuaWR9XCIgc3RvcHBlZGApO1xuICAgIHN1cGVyLnN0b3AoKTtcbiAgfVxufVxuXG4iXX0=