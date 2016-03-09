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
    value: function require(id) {
      var service = _serviceManager2.default.require(id);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlcnZpY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTSxNQUFNLHFCQUFNLHFCQUFOLENBQU47O0lBRWU7OztBQUNuQixXQURtQixPQUNuQixDQUFZLEVBQVosRUFBZ0IsVUFBaEIsRUFBNEI7d0NBRFQsU0FDUzs7NkZBRFQsb0JBRVgsSUFBSSxhQURnQjs7QUFHMUIsVUFBSyxlQUFMLENBQXFCLFdBQXJCLENBQWlDLFVBQUMsS0FBRCxFQUFXO0FBQzFDLFVBQUksS0FBSixFQUFXO0FBQ1QsY0FBSyxLQUFMLEdBRFM7QUFFVCxjQUFLLFVBQUwsR0FBa0IsSUFBbEIsQ0FGUztPQUFYLE1BR087QUFDTCxjQUFLLElBQUwsR0FESztPQUhQO0tBRCtCLENBQWpDOzs7Ozs7QUFIMEIsU0FnQjFCLENBQUssT0FBTCxDQUFhLEtBQWIsR0FBcUIsc0JBQXJCOzs7QUFoQjBCLFNBbUIxQixDQUFLLGVBQUwsQ0FBcUIsR0FBckIsQ0FBeUIseUJBQWUsT0FBZixDQUF1QixLQUF2QixDQUF6QixDQW5CMEI7O0dBQTVCOzs2QkFEbUI7OzRCQXVCWDtBQUNOLFdBQUssSUFBTCxHQURNO0FBRU4sZ0JBQVEsS0FBSyxFQUFMLFlBQVIsRUFGTTtBQUdOLFdBQUssT0FBTCxDQUFhLEtBQWIsQ0FBbUIsR0FBbkIsQ0FBdUIsSUFBdkIsRUFITTs7Ozs0QkFNQSxJQUFJO0FBQ1YsVUFBTSxVQUFVLHlCQUFlLE9BQWYsQ0FBdUIsRUFBdkIsQ0FBVixDQURJO0FBRVYsVUFBTSxTQUFTLFFBQVEsT0FBUixDQUFnQixLQUFoQixDQUZMOztBQUlWLFVBQUksTUFBSixFQUNFLEtBQUssZUFBTCxDQUFxQixHQUFyQixDQUF5QixNQUF6QixFQURGLEtBR0UsTUFBTSxJQUFJLEtBQUosa0RBQTBELE9BQTFELENBQU4sQ0FIRjs7QUFLQSxhQUFPLE9BQVAsQ0FUVTs7Ozs0QkFZSjtBQUNOLGdCQUFRLEtBQUssRUFBTCxjQUFSLEVBRE07QUFFTix1REEzQ2lCLDZDQTJDakIsQ0FGTTs7OzsyQkFLRDtBQUNMLGdCQUFRLEtBQUssRUFBTCxjQUFSLEVBREs7QUFFTCx1REFoRGlCLDRDQWdEakIsQ0FGSzs7O1NBOUNZIiwiZmlsZSI6IlNlcnZpY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWN0aXZpdHkgZnJvbSAnLi9BY3Rpdml0eSc7XG5pbXBvcnQgZGVidWcgZnJvbSAnZGVidWcnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4vc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IFNpZ25hbCBmcm9tICcuL1NpZ25hbCc7XG5pbXBvcnQgU2lnbmFsQWxsIGZyb20gJy4vU2lnbmFsQWxsJztcblxuY29uc3QgbG9nID0gZGVidWcoJ3NvdW5kd29ya3M6c2VydmljZXMnKTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmljZSBleHRlbmRzIEFjdGl2aXR5IHtcbiAgY29uc3RydWN0b3IoaWQsIGhhc05ldHdvcmspIHtcbiAgICBzdXBlcihpZCwgaGFzTmV0d29yayk7XG5cbiAgICB0aGlzLnJlcXVpcmVkU2lnbmFscy5hZGRPYnNlcnZlcigodmFsdWUpID0+IHtcbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgICAgIHRoaXMuaGFzU3RhcnRlZCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIElzIHNldCB0byBgdHJ1ZWAgd2hlbiBhIHNpZ25hbCBpcyByZWFkeSB0byBiZSBjb25zdW1lZC5cbiAgICAgKiBAdHlwZSB7U2lnbmFsfVxuICAgICAqL1xuICAgIHRoaXMuc2lnbmFscy5yZWFkeSA9IG5ldyBTaWduYWwoKTtcblxuICAgIC8vIGFkZCB0aGUgc2VydmljZU1hbmFnZXIgYm9vdHN0YXJ0IHNpZ25hbCB0byB0aGUgcmVxdWlyZWQgc2lnbmFsc1xuICAgIHRoaXMucmVxdWlyZWRTaWduYWxzLmFkZChzZXJ2aWNlTWFuYWdlci5zaWduYWxzLnN0YXJ0KTtcbiAgfVxuXG4gIHJlYWR5KCkge1xuICAgIHRoaXMuc3RvcCgpO1xuICAgIGxvZyhgXCIke3RoaXMuaWR9XCIgcmVhZHlgKTtcbiAgICB0aGlzLnNpZ25hbHMucmVhZHkuc2V0KHRydWUpO1xuICB9XG5cbiAgcmVxdWlyZShpZCkge1xuICAgIGNvbnN0IHNlcnZpY2UgPSBzZXJ2aWNlTWFuYWdlci5yZXF1aXJlKGlkKTtcbiAgICBjb25zdCBzaWduYWwgPSBzZXJ2aWNlLnNpZ25hbHMucmVhZHk7XG5cbiAgICBpZiAoc2lnbmFsKVxuICAgICAgdGhpcy5yZXF1aXJlZFNpZ25hbHMuYWRkKHNpZ25hbCk7XG4gICAgZWxzZVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBzaWduYWwgXCJjb250aW51ZVwiIGRvZXNuJ3QgZXhpc3Qgb24gc2VydmljZSA6YCwgc2VydmljZSk7XG5cbiAgICByZXR1cm4gc2VydmljZTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIGxvZyhgXCIke3RoaXMuaWR9XCIgc3RhcnRlZGApO1xuICAgIHN1cGVyLnN0YXJ0KCk7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIGxvZyhgXCIke3RoaXMuaWR9XCIgc3RvcHBlZGApO1xuICAgIHN1cGVyLnN0b3AoKTtcbiAgfVxufVxuXG4iXX0=