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
    var hasNetwork = arguments.length <= 1 || arguments[1] === undefined ? 'true' : arguments[1];

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvc2NlbmVzL0V4cGVyaWVuY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozt5QkFBa0IsZUFBZTs7OzswQkFDZCxnQkFBZ0I7Ozs7NkJBQ2IsbUJBQW1COzs7O0lBR3BCLFVBQVU7WUFBVixVQUFVOztBQUNsQixXQURRLFVBQVUsR0FDdUI7OztRQUF4QyxFQUFFLHlEQUFHLFlBQVk7UUFBRSxVQUFVLHlEQUFHLE1BQU07OzBCQUQvQixVQUFVOztBQUUzQiwrQkFGaUIsVUFBVSw2Q0FFckIsRUFBRSxFQUFFLFVBQVUsRUFBRTs7QUFFdEIsUUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsVUFBQyxLQUFLLEVBQUs7QUFDMUMsVUFBSSxLQUFLLEVBQUU7QUFDVCxjQUFLLEtBQUssRUFBRSxDQUFDO0FBQ2IsY0FBSyxVQUFVLEdBQUcsSUFBSSxDQUFDO09BQ3hCLE1BQU07QUFDTCxjQUFLLElBQUksRUFBRSxDQUFDO09BQ2I7S0FDRixDQUFDLENBQUM7R0FDSjs7ZUFaa0IsVUFBVTs7V0FjekIsZ0JBQUc7QUFDTCxVQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsU0FBUyxFQUFFLENBQUMsUUFBUSxFQUFFLGFBQWEsQ0FBQyxFQUFFLENBQUM7S0FDN0Q7OztXQUVHLGdCQUFHO0FBQ0wsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ1osVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzdCOzs7V0FFSSxpQkFBRztBQUNOLGlDQXhCaUIsVUFBVSx1Q0F3QmI7QUFDZCxVQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ3BCOzs7V0FFRyxnQkFBRyxFQUVOOzs7V0FFRyxnQkFBRztBQUNMLFVBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbEIsaUNBbENpQixVQUFVLHNDQWtDZDtLQUNkOzs7U0FuQ2tCLFVBQVU7OztxQkFBVixVQUFVIiwiZmlsZSI6InNyYy9jbGllbnQvc2NlbmVzL0V4cGVyaWVuY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2NlbmUgZnJvbSAnLi4vY29yZS9TY2VuZSc7XG5pbXBvcnQgU2lnbmFsIGZyb20gJy4uL2NvcmUvU2lnbmFsJztcbmltcG9ydCBTaWduYWxBbGwgZnJvbSAnLi4vY29yZS9TaWduYWxBbGwnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV4cGVyaWVuY2UgZXh0ZW5kcyBTY2VuZSB7XG4gIGNvbnN0cnVjdG9yKGlkID0gJ2V4cGVyaWVuY2UnLCBoYXNOZXR3b3JrID0gJ3RydWUnKSB7XG4gICAgc3VwZXIoaWQsIGhhc05ldHdvcmspO1xuXG4gICAgdGhpcy5yZXF1aXJlZFNpZ25hbHMuYWRkT2JzZXJ2ZXIoKHZhbHVlKSA9PiB7XG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgICAgICB0aGlzLmhhc1N0YXJ0ZWQgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5ob2xkKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIHRoaXMudmlld09wdGlvbnMgPSB7IGNsYXNzTmFtZTogWydtb2R1bGUnLCAncGVyZm9ybWFuY2UnXSB9O1xuICB9XG5cbiAgZG9uZSgpIHtcbiAgICB0aGlzLnN0b3AoKTtcbiAgICB0aGlzLnNpZ25hbHMuZG9uZS5zZXQodHJ1ZSk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuICAgIHRoaXMuc2VuZCgnc3RhcnQnKTtcbiAgfVxuXG4gIGhvbGQoKSB7XG5cbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5zZW5kKCdzdG9wJyk7XG4gICAgc3VwZXIuc3RvcCgpO1xuICB9XG59XG4iXX0=