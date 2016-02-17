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

var _coreSignal = require('../core/Signal');

var _coreSignal2 = _interopRequireDefault(_coreSignal);

var _coreSignalAll = require('../core/SignalAll');

var _coreSignalAll2 = _interopRequireDefault(_coreSignalAll);

var Experience = (function (_Scene) {
  _inherits(Experience, _Scene);

  function Experience() {
    var _this = this;

    var id = arguments.length <= 0 || arguments[0] === undefined ? 'experience' : arguments[0];
    var hasNetwork = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    _classCallCheck(this, Experience);

    _get(Object.getPrototypeOf(Experience.prototype), 'constructor', this).call(this, id, hasNetwork);

    this.requiredSignals.addObserver(function (value) {
      if (value) {
        _this.start();
        _this.hasStarted = true;
      } else {
        _this.hold();
      }
    });

    // if the experience has network, require errorReporter service by default
    if (hasNetwork) this._errorReporter = this.require('error-reporter');
  }

  _createClass(Experience, [{
    key: 'init',
    value: function init() {
      this.viewOptions = { className: ['module', 'performance'] };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvc2NlbmVzL0V4cGVyaWVuY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozt5QkFBa0IsZUFBZTs7OzswQkFDZCxnQkFBZ0I7Ozs7NkJBQ2IsbUJBQW1COzs7O0lBR3BCLFVBQVU7WUFBVixVQUFVOztBQUNsQixXQURRLFVBQVUsR0FDcUI7OztRQUF0QyxFQUFFLHlEQUFHLFlBQVk7UUFBRSxVQUFVLHlEQUFHLElBQUk7OzBCQUQ3QixVQUFVOztBQUUzQiwrQkFGaUIsVUFBVSw2Q0FFckIsRUFBRSxFQUFFLFVBQVUsRUFBRTs7QUFFdEIsUUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsVUFBQyxLQUFLLEVBQUs7QUFDMUMsVUFBSSxLQUFLLEVBQUU7QUFDVCxjQUFLLEtBQUssRUFBRSxDQUFDO0FBQ2IsY0FBSyxVQUFVLEdBQUcsSUFBSSxDQUFDO09BQ3hCLE1BQU07QUFDTCxjQUFLLElBQUksRUFBRSxDQUFDO09BQ2I7S0FDRixDQUFDLENBQUM7OztBQUdILFFBQUksVUFBVSxFQUNaLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0dBQ3hEOztlQWhCa0IsVUFBVTs7V0FrQnpCLGdCQUFHO0FBQ0wsVUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLFNBQVMsRUFBRSxDQUFDLFFBQVEsRUFBRSxhQUFhLENBQUMsRUFBRSxDQUFDO0tBQzdEOzs7V0FFRyxnQkFBRztBQUNMLFVBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNaLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUM3Qjs7O1dBRUksaUJBQUc7QUFDTixpQ0E1QmlCLFVBQVUsdUNBNEJiO0FBQ2QsVUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNwQjs7O1dBRUcsZ0JBQUcsRUFFTjs7O1dBRUcsZ0JBQUc7QUFDTCxVQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2xCLGlDQXRDaUIsVUFBVSxzQ0FzQ2Q7S0FDZDs7O1NBdkNrQixVQUFVOzs7cUJBQVYsVUFBVSIsImZpbGUiOiJzcmMvY2xpZW50L3NjZW5lcy9FeHBlcmllbmNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNjZW5lIGZyb20gJy4uL2NvcmUvU2NlbmUnO1xuaW1wb3J0IFNpZ25hbCBmcm9tICcuLi9jb3JlL1NpZ25hbCc7XG5pbXBvcnQgU2lnbmFsQWxsIGZyb20gJy4uL2NvcmUvU2lnbmFsQWxsJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFeHBlcmllbmNlIGV4dGVuZHMgU2NlbmUge1xuICBjb25zdHJ1Y3RvcihpZCA9ICdleHBlcmllbmNlJywgaGFzTmV0d29yayA9IHRydWUpIHtcbiAgICBzdXBlcihpZCwgaGFzTmV0d29yayk7XG5cbiAgICB0aGlzLnJlcXVpcmVkU2lnbmFscy5hZGRPYnNlcnZlcigodmFsdWUpID0+IHtcbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgICAgIHRoaXMuaGFzU3RhcnRlZCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmhvbGQoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIGlmIHRoZSBleHBlcmllbmNlIGhhcyBuZXR3b3JrLCByZXF1aXJlIGVycm9yUmVwb3J0ZXIgc2VydmljZSBieSBkZWZhdWx0XG4gICAgaWYgKGhhc05ldHdvcmspXG4gICAgICB0aGlzLl9lcnJvclJlcG9ydGVyID0gdGhpcy5yZXF1aXJlKCdlcnJvci1yZXBvcnRlcicpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLnZpZXdPcHRpb25zID0geyBjbGFzc05hbWU6IFsnbW9kdWxlJywgJ3BlcmZvcm1hbmNlJ10gfTtcbiAgfVxuXG4gIGRvbmUoKSB7XG4gICAgdGhpcy5zdG9wKCk7XG4gICAgdGhpcy5zaWduYWxzLmRvbmUuc2V0KHRydWUpO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgICB0aGlzLnNlbmQoJ3N0YXJ0Jyk7XG4gIH1cblxuICBob2xkKCkge1xuXG4gIH1cblxuICBzdG9wKCkge1xuICAgIHRoaXMuc2VuZCgnc3RvcCcpO1xuICAgIHN1cGVyLnN0b3AoKTtcbiAgfVxufVxuIl19