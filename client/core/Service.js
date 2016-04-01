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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlcnZpY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTSxNQUFNLHFCQUFNLHFCQUFOLENBQU47O0lBRWU7OztBQUNuQixXQURtQixPQUNuQixDQUFZLEVBQVosRUFBZ0IsVUFBaEIsRUFBNEI7d0NBRFQsU0FDUzs7NkZBRFQsb0JBRVgsSUFBSSxhQURnQjs7QUFHMUIsVUFBSyxlQUFMLENBQXFCLFdBQXJCLENBQWlDLFVBQUMsS0FBRCxFQUFXO0FBQzFDLFVBQUksS0FBSixFQUFXO0FBQ1QsY0FBSyxLQUFMLEdBRFM7QUFFVCxjQUFLLFVBQUwsR0FBa0IsSUFBbEIsQ0FGUztPQUFYLE1BR087QUFDTCxjQUFLLElBQUwsR0FESztPQUhQO0tBRCtCLENBQWpDOzs7Ozs7QUFIMEIsU0FnQjFCLENBQUssT0FBTCxDQUFhLEtBQWIsR0FBcUIsc0JBQXJCOztBQWhCMEIsU0FrQjFCLENBQUssZUFBTCxDQUFxQixHQUFyQixDQUF5Qix5QkFBZSxPQUFmLENBQXVCLEtBQXZCLENBQXpCLENBbEIwQjs7R0FBNUI7OzZCQURtQjs7NEJBc0JYO0FBQ04sV0FBSyxJQUFMLEdBRE07QUFFTixnQkFBUSxLQUFLLEVBQUwsWUFBUixFQUZNO0FBR04sV0FBSyxPQUFMLENBQWEsS0FBYixDQUFtQixHQUFuQixDQUF1QixJQUF2QixFQUhNOzs7OzRCQU1BLElBQUksU0FBUztBQUNuQixVQUFNLFVBQVUseUJBQWUsT0FBZixDQUF1QixFQUF2QixFQUEyQixPQUEzQixDQUFWLENBRGE7QUFFbkIsVUFBTSxTQUFTLFFBQVEsT0FBUixDQUFnQixLQUFoQixDQUZJOztBQUluQixVQUFJLE1BQUosRUFDRSxLQUFLLGVBQUwsQ0FBcUIsR0FBckIsQ0FBeUIsTUFBekIsRUFERixLQUdFLE1BQU0sSUFBSSxLQUFKLGtEQUEwRCxPQUExRCxDQUFOLENBSEY7O0FBS0EsYUFBTyxPQUFQLENBVG1COzs7OzJCQVlkOzs7NEJBRUM7QUFDTixnQkFBUSxLQUFLLEVBQUwsY0FBUixFQURNO0FBRU4sdURBNUNpQiw2Q0E0Q2pCLENBRk07Ozs7MkJBS0Q7QUFDTCxnQkFBUSxLQUFLLEVBQUwsY0FBUixFQURLO0FBRUwsdURBakRpQiw0Q0FpRGpCLENBRks7OztTQS9DWSIsImZpbGUiOiJTZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFjdGl2aXR5IGZyb20gJy4vQWN0aXZpdHknO1xuaW1wb3J0IGRlYnVnIGZyb20gJ2RlYnVnJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCBTaWduYWwgZnJvbSAnLi9TaWduYWwnO1xuaW1wb3J0IFNpZ25hbEFsbCBmcm9tICcuL1NpZ25hbEFsbCc7XG5cbmNvbnN0IGxvZyA9IGRlYnVnKCdzb3VuZHdvcmtzOnNlcnZpY2VzJyk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlcnZpY2UgZXh0ZW5kcyBBY3Rpdml0eSB7XG4gIGNvbnN0cnVjdG9yKGlkLCBoYXNOZXR3b3JrKSB7XG4gICAgc3VwZXIoaWQsIGhhc05ldHdvcmspO1xuXG4gICAgdGhpcy5yZXF1aXJlZFNpZ25hbHMuYWRkT2JzZXJ2ZXIoKHZhbHVlKSA9PiB7XG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgICAgICB0aGlzLmhhc1N0YXJ0ZWQgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBJcyBzZXQgdG8gYHRydWVgIHdoZW4gYSBzaWduYWwgaXMgcmVhZHkgdG8gYmUgY29uc3VtZWQuXG4gICAgICogQHR5cGUge1NpZ25hbH1cbiAgICAgKi9cbiAgICB0aGlzLnNpZ25hbHMucmVhZHkgPSBuZXcgU2lnbmFsKCk7XG4gICAgLy8gYWRkIHRoZSBzZXJ2aWNlTWFuYWdlciBib290c3RhcnQgc2lnbmFsIHRvIHRoZSByZXF1aXJlZCBzaWduYWxzXG4gICAgdGhpcy5yZXF1aXJlZFNpZ25hbHMuYWRkKHNlcnZpY2VNYW5hZ2VyLnNpZ25hbHMuc3RhcnQpO1xuICB9XG5cbiAgcmVhZHkoKSB7XG4gICAgdGhpcy5zdG9wKCk7XG4gICAgbG9nKGBcIiR7dGhpcy5pZH1cIiByZWFkeWApO1xuICAgIHRoaXMuc2lnbmFscy5yZWFkeS5zZXQodHJ1ZSk7XG4gIH1cblxuICByZXF1aXJlKGlkLCBvcHRpb25zKSB7XG4gICAgY29uc3Qgc2VydmljZSA9IHNlcnZpY2VNYW5hZ2VyLnJlcXVpcmUoaWQsIG9wdGlvbnMpO1xuICAgIGNvbnN0IHNpZ25hbCA9IHNlcnZpY2Uuc2lnbmFscy5yZWFkeTtcblxuICAgIGlmIChzaWduYWwpXG4gICAgICB0aGlzLnJlcXVpcmVkU2lnbmFscy5hZGQoc2lnbmFsKTtcbiAgICBlbHNlXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYHNpZ25hbCBcImNvbnRpbnVlXCIgZG9lc24ndCBleGlzdCBvbiBzZXJ2aWNlIDpgLCBzZXJ2aWNlKTtcblxuICAgIHJldHVybiBzZXJ2aWNlO1xuICB9XG5cbiAgaW5pdCgpIHt9XG5cbiAgc3RhcnQoKSB7XG4gICAgbG9nKGBcIiR7dGhpcy5pZH1cIiBzdGFydGVkYCk7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgbG9nKGBcIiR7dGhpcy5pZH1cIiBzdG9wcGVkYCk7XG4gICAgc3VwZXIuc3RvcCgpO1xuICB9XG59XG5cbiJdfQ==