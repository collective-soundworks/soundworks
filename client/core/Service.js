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
    key: 'init',
    value: function init() {}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlcnZpY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTSxNQUFNLHFCQUFNLHFCQUFOLENBQVo7O0lBRXFCLE87OztBQUNuQixtQkFBWSxFQUFaLEVBQWdCLFVBQWhCLEVBQTRCO0FBQUE7O0FBQUEsaUhBQ3BCLEVBRG9CLEVBQ2hCLFVBRGdCOztBQUcxQixVQUFLLGVBQUwsQ0FBcUIsV0FBckIsQ0FBaUMsVUFBQyxLQUFELEVBQVc7QUFDMUMsVUFBSSxLQUFKLEVBQVc7QUFDVCxjQUFLLEtBQUw7QUFDQSxjQUFLLFVBQUwsR0FBa0IsSUFBbEI7QUFDRCxPQUhELE1BR087QUFDTCxjQUFLLElBQUw7QUFDRDtBQUNGLEtBUEQ7Ozs7OztBQWFBLFVBQUssT0FBTCxDQUFhLEtBQWIsR0FBcUIsc0JBQXJCOztBQUVBLFVBQUssZUFBTCxDQUFxQixHQUFyQixDQUF5Qix5QkFBZSxPQUFmLENBQXVCLEtBQWhEO0FBbEIwQjtBQW1CM0I7Ozs7NEJBRU87QUFDTixXQUFLLElBQUw7QUFDQSxnQkFBUSxLQUFLLEVBQWI7QUFDQSxXQUFLLE9BQUwsQ0FBYSxLQUFiLENBQW1CLEdBQW5CLENBQXVCLElBQXZCO0FBQ0Q7Ozs0QkFFTyxFLEVBQUksTyxFQUFTO0FBQ25CLFVBQU0sVUFBVSx5QkFBZSxPQUFmLENBQXVCLEVBQXZCLEVBQTJCLE9BQTNCLENBQWhCO0FBQ0EsVUFBTSxTQUFTLFFBQVEsT0FBUixDQUFnQixLQUEvQjs7QUFFQSxVQUFJLE1BQUosRUFDRSxLQUFLLGVBQUwsQ0FBcUIsR0FBckIsQ0FBeUIsTUFBekIsRUFERixLQUdFLE1BQU0sSUFBSSxLQUFKLGtEQUEwRCxPQUExRCxDQUFOOztBQUVGLGFBQU8sT0FBUDtBQUNEOzs7MkJBRU0sQ0FBRTs7OzRCQUVEO0FBQ04sZ0JBQVEsS0FBSyxFQUFiO0FBQ0E7QUFDRDs7OzJCQUVNO0FBQ0wsZ0JBQVEsS0FBSyxFQUFiO0FBQ0E7QUFDRDs7Ozs7a0JBbERrQixPIiwiZmlsZSI6IlNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWN0aXZpdHkgZnJvbSAnLi9BY3Rpdml0eSc7XG5pbXBvcnQgZGVidWcgZnJvbSAnZGVidWcnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4vc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IFNpZ25hbCBmcm9tICcuL1NpZ25hbCc7XG5pbXBvcnQgU2lnbmFsQWxsIGZyb20gJy4vU2lnbmFsQWxsJztcblxuY29uc3QgbG9nID0gZGVidWcoJ3NvdW5kd29ya3M6c2VydmljZXMnKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmljZSBleHRlbmRzIEFjdGl2aXR5IHtcbiAgY29uc3RydWN0b3IoaWQsIGhhc05ldHdvcmspIHtcbiAgICBzdXBlcihpZCwgaGFzTmV0d29yayk7XG5cbiAgICB0aGlzLnJlcXVpcmVkU2lnbmFscy5hZGRPYnNlcnZlcigodmFsdWUpID0+IHtcbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgICAgIHRoaXMuaGFzU3RhcnRlZCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIElzIHNldCB0byBgdHJ1ZWAgd2hlbiBhIHNpZ25hbCBpcyByZWFkeSB0byBiZSBjb25zdW1lZC5cbiAgICAgKiBAdHlwZSB7U2lnbmFsfVxuICAgICAqL1xuICAgIHRoaXMuc2lnbmFscy5yZWFkeSA9IG5ldyBTaWduYWwoKTtcbiAgICAvLyBhZGQgdGhlIHNlcnZpY2VNYW5hZ2VyIGJvb3RzdGFydCBzaWduYWwgdG8gdGhlIHJlcXVpcmVkIHNpZ25hbHNcbiAgICB0aGlzLnJlcXVpcmVkU2lnbmFscy5hZGQoc2VydmljZU1hbmFnZXIuc2lnbmFscy5zdGFydCk7XG4gIH1cblxuICByZWFkeSgpIHtcbiAgICB0aGlzLnN0b3AoKTtcbiAgICBsb2coYFwiJHt0aGlzLmlkfVwiIHJlYWR5YCk7XG4gICAgdGhpcy5zaWduYWxzLnJlYWR5LnNldCh0cnVlKTtcbiAgfVxuXG4gIHJlcXVpcmUoaWQsIG9wdGlvbnMpIHtcbiAgICBjb25zdCBzZXJ2aWNlID0gc2VydmljZU1hbmFnZXIucmVxdWlyZShpZCwgb3B0aW9ucyk7XG4gICAgY29uc3Qgc2lnbmFsID0gc2VydmljZS5zaWduYWxzLnJlYWR5O1xuXG4gICAgaWYgKHNpZ25hbClcbiAgICAgIHRoaXMucmVxdWlyZWRTaWduYWxzLmFkZChzaWduYWwpO1xuICAgIGVsc2VcbiAgICAgIHRocm93IG5ldyBFcnJvcihgc2lnbmFsIFwiY29udGludWVcIiBkb2Vzbid0IGV4aXN0IG9uIHNlcnZpY2UgOmAsIHNlcnZpY2UpO1xuXG4gICAgcmV0dXJuIHNlcnZpY2U7XG4gIH1cblxuICBpbml0KCkge31cblxuICBzdGFydCgpIHtcbiAgICBsb2coYFwiJHt0aGlzLmlkfVwiIHN0YXJ0ZWRgKTtcbiAgICBzdXBlci5zdGFydCgpO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICBsb2coYFwiJHt0aGlzLmlkfVwiIHN0b3BwZWRgKTtcbiAgICBzdXBlci5zdG9wKCk7XG4gIH1cbn1cblxuIl19