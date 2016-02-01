// import CanvasView from '../display/CanvasView';
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreScene = require('../core/Scene');

var _coreScene2 = _interopRequireDefault(_coreScene);

var _coreServiceManager = require('../core/serviceManager');

var _coreServiceManager2 = _interopRequireDefault(_coreServiceManager);

var _coreSignal = require('../core/Signal');

var _coreSignal2 = _interopRequireDefault(_coreSignal);

var _coreSignalAll = require('../core/SignalAll');

var _coreSignalAll2 = _interopRequireDefault(_coreSignalAll);

var Experience = (function (_Scene) {
  _inherits(Experience, _Scene);

  function Experience() {
    var _this = this;

    var id = arguments.length <= 0 || arguments[0] === undefined ? 'experience' : arguments[0];
    var hasNetwork = arguments.length <= 1 || arguments[1] === undefined ? 'true' : arguments[1];

    _classCallCheck(this, Experience);

    _get(Object.getPrototypeOf(Experience.prototype), 'constructor', this).call(this, id, hasNetwork);

    this._requiredSignals = new _coreSignalAll2['default']();
    this._requiredSignals.addObserver(function (value) {
      if (value) {
        _this.start();
        _this.hasStarted = true;
      } else {
        _this.hold();
      }
    });

    this._requiredSignals.add(_coreServiceManager2['default'].signals.ready);
  }

  _createClass(Experience, [{
    key: 'init',
    value: function init() {
      this.viewOptions = { className: ['module', 'performance'] };
    }
  }, {
    key: 'require',
    value: function require(id, options) {
      return _coreServiceManager2['default'].require(id, options);
    }
  }, {
    key: 'done',
    value: function done() {
      this.stop();
      this.signals.done.set(true);
    }
  }, {
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(Experience.prototype), 'start', this).call(this);
      this.send('start');
    }
  }, {
    key: 'hold',
    value: function hold() {}
  }, {
    key: 'stop',
    value: function stop() {
      this.send('stop');
      _get(Object.getPrototypeOf(Experience.prototype), 'stop', this).call(this);
    }
  }]);

  return Experience;
})(_coreScene2['default']);

exports['default'] = Experience;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvc2NlbmVzL0V4cGVyaWVuY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7eUJBQ2tCLGVBQWU7Ozs7a0NBQ04sd0JBQXdCOzs7OzBCQUNoQyxnQkFBZ0I7Ozs7NkJBQ2IsbUJBQW1COzs7O0lBR3BCLFVBQVU7WUFBVixVQUFVOztBQUNsQixXQURRLFVBQVUsR0FDdUI7OztRQUF4QyxFQUFFLHlEQUFHLFlBQVk7UUFBRSxVQUFVLHlEQUFHLE1BQU07OzBCQUQvQixVQUFVOztBQUUzQiwrQkFGaUIsVUFBVSw2Q0FFckIsRUFBRSxFQUFFLFVBQVUsRUFBRTs7QUFFdEIsUUFBSSxDQUFDLGdCQUFnQixHQUFHLGdDQUFlLENBQUM7QUFDeEMsUUFBSSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxVQUFDLEtBQUssRUFBSztBQUMzQyxVQUFJLEtBQUssRUFBRTtBQUNULGNBQUssS0FBSyxFQUFFLENBQUM7QUFDYixjQUFLLFVBQVUsR0FBRyxJQUFJLENBQUM7T0FDeEIsTUFBTTtBQUNMLGNBQUssSUFBSSxFQUFFLENBQUM7T0FDYjtLQUNGLENBQUMsQ0FBQzs7QUFFSCxRQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLGdDQUFlLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUN6RDs7ZUFma0IsVUFBVTs7V0FpQnpCLGdCQUFHO0FBQ0wsVUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLFNBQVMsRUFBRSxDQUFDLFFBQVEsRUFBRSxhQUFhLENBQUMsRUFBRSxDQUFDO0tBQzdEOzs7V0FFTSxpQkFBQyxFQUFFLEVBQUUsT0FBTyxFQUFFO0FBQ25CLGFBQU8sZ0NBQWUsT0FBTyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztLQUM1Qzs7O1dBRUcsZ0JBQUc7QUFDTCxVQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDWixVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDN0I7OztXQUVJLGlCQUFHO0FBQ04saUNBL0JpQixVQUFVLHVDQStCYjtBQUNkLFVBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDcEI7OztXQUVHLGdCQUFHLEVBRU47OztXQUVHLGdCQUFHO0FBQ0wsVUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNsQixpQ0F6Q2lCLFVBQVUsc0NBeUNkO0tBQ2Q7OztTQTFDa0IsVUFBVTs7O3FCQUFWLFVBQVUiLCJmaWxlIjoic3JjL2NsaWVudC9zY2VuZXMvRXhwZXJpZW5jZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCBDYW52YXNWaWV3IGZyb20gJy4uL2Rpc3BsYXkvQ2FudmFzVmlldyc7XG5pbXBvcnQgU2NlbmUgZnJvbSAnLi4vY29yZS9TY2VuZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgU2lnbmFsIGZyb20gJy4uL2NvcmUvU2lnbmFsJztcbmltcG9ydCBTaWduYWxBbGwgZnJvbSAnLi4vY29yZS9TaWduYWxBbGwnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV4cGVyaWVuY2UgZXh0ZW5kcyBTY2VuZSB7XG4gIGNvbnN0cnVjdG9yKGlkID0gJ2V4cGVyaWVuY2UnLCBoYXNOZXR3b3JrID0gJ3RydWUnKSB7XG4gICAgc3VwZXIoaWQsIGhhc05ldHdvcmspO1xuXG4gICAgdGhpcy5fcmVxdWlyZWRTaWduYWxzID0gbmV3IFNpZ25hbEFsbCgpO1xuICAgIHRoaXMuX3JlcXVpcmVkU2lnbmFscy5hZGRPYnNlcnZlcigodmFsdWUpID0+IHtcbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgICAgIHRoaXMuaGFzU3RhcnRlZCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmhvbGQoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuX3JlcXVpcmVkU2lnbmFscy5hZGQoc2VydmljZU1hbmFnZXIuc2lnbmFscy5yZWFkeSk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIHRoaXMudmlld09wdGlvbnMgPSB7IGNsYXNzTmFtZTogWydtb2R1bGUnLCAncGVyZm9ybWFuY2UnXSB9O1xuICB9XG5cbiAgcmVxdWlyZShpZCwgb3B0aW9ucykge1xuICAgIHJldHVybiBzZXJ2aWNlTWFuYWdlci5yZXF1aXJlKGlkLCBvcHRpb25zKTtcbiAgfVxuXG4gIGRvbmUoKSB7XG4gICAgdGhpcy5zdG9wKCk7XG4gICAgdGhpcy5zaWduYWxzLmRvbmUuc2V0KHRydWUpO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgICB0aGlzLnNlbmQoJ3N0YXJ0Jyk7XG4gIH1cblxuICBob2xkKCkge1xuXG4gIH1cblxuICBzdG9wKCkge1xuICAgIHRoaXMuc2VuZCgnc3RvcCcpO1xuICAgIHN1cGVyLnN0b3AoKTtcbiAgfVxufVxuIl19