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

var _coreClient = require('../core/client');

var _coreClient2 = _interopRequireDefault(_coreClient);

var Experience = (function (_Scene) {
  _inherits(Experience, _Scene);

  function Experience() {
    var id = arguments.length <= 0 || arguments[0] === undefined ? _coreClient2['default'].type : arguments[0];
    var hasNetwork = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    _classCallCheck(this, Experience);

    _get(Object.getPrototypeOf(Experience.prototype), 'constructor', this).call(this, id, hasNetwork);

    // if the experience has network, require errorReporter service by default
    if (hasNetwork) this._errorReporter = this.require('error-reporter');
  }

  _createClass(Experience, [{
    key: 'init',
    value: function init() {
      this.viewOptions = { className: ['activity', 'experience'] };
    }
  }, {
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(Experience.prototype), 'start', this).call(this);

      if (this.hasNetwork) this.send('enter');
    }

    // hold() {}

  }, {
    key: 'done',
    value: function done() {
      if (this.hasNetwork) this.send('exit');

      _get(Object.getPrototypeOf(Experience.prototype), 'done', this).call(this);
    }
  }]);

  return Experience;
})(_coreScene2['default']);

exports['default'] = Experience;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L3NjZW5lcy9FeHBlcmllbmNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7eUJBQWtCLGVBQWU7Ozs7MEJBQ2QsZ0JBQWdCOzs7OzZCQUNiLG1CQUFtQjs7OzswQkFDdEIsZ0JBQWdCOzs7O0lBRWQsVUFBVTtZQUFWLFVBQVU7O0FBQ2xCLFdBRFEsVUFBVSxHQUNvQjtRQUFyQyxFQUFFLHlEQUFHLHdCQUFPLElBQUk7UUFBRSxVQUFVLHlEQUFHLElBQUk7OzBCQUQ1QixVQUFVOztBQUUzQiwrQkFGaUIsVUFBVSw2Q0FFckIsRUFBRSxFQUFFLFVBQVUsRUFBRTs7O0FBR3RCLFFBQUksVUFBVSxFQUNaLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0dBQ3hEOztlQVBrQixVQUFVOztXQVN6QixnQkFBRztBQUNMLFVBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxTQUFTLEVBQUUsQ0FBQyxVQUFVLEVBQUUsWUFBWSxDQUFDLEVBQUUsQ0FBQztLQUM5RDs7O1dBRUksaUJBQUc7QUFDTixpQ0FkaUIsVUFBVSx1Q0FjYjs7QUFFZCxVQUFJLElBQUksQ0FBQyxVQUFVLEVBQ2pCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDdEI7Ozs7OztXQUlHLGdCQUFHO0FBQ0wsVUFBSSxJQUFJLENBQUMsVUFBVSxFQUNqQixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUVwQixpQ0ExQmlCLFVBQVUsc0NBMEJkO0tBQ2Q7OztTQTNCa0IsVUFBVTs7O3FCQUFWLFVBQVUiLCJmaWxlIjoiL1VzZXJzL3NjaG5lbGwvRGV2ZWxvcG1lbnQvd2ViL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9zb3VuZHdvcmtzL3NyYy9jbGllbnQvc2NlbmVzL0V4cGVyaWVuY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2NlbmUgZnJvbSAnLi4vY29yZS9TY2VuZSc7XG5pbXBvcnQgU2lnbmFsIGZyb20gJy4uL2NvcmUvU2lnbmFsJztcbmltcG9ydCBTaWduYWxBbGwgZnJvbSAnLi4vY29yZS9TaWduYWxBbGwnO1xuaW1wb3J0IGNsaWVudCBmcm9tICcuLi9jb3JlL2NsaWVudCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV4cGVyaWVuY2UgZXh0ZW5kcyBTY2VuZSB7XG4gIGNvbnN0cnVjdG9yKGlkID0gY2xpZW50LnR5cGUsIGhhc05ldHdvcmsgPSB0cnVlKSB7XG4gICAgc3VwZXIoaWQsIGhhc05ldHdvcmspO1xuXG4gICAgLy8gaWYgdGhlIGV4cGVyaWVuY2UgaGFzIG5ldHdvcmssIHJlcXVpcmUgZXJyb3JSZXBvcnRlciBzZXJ2aWNlIGJ5IGRlZmF1bHRcbiAgICBpZiAoaGFzTmV0d29yaylcbiAgICAgIHRoaXMuX2Vycm9yUmVwb3J0ZXIgPSB0aGlzLnJlcXVpcmUoJ2Vycm9yLXJlcG9ydGVyJyk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIHRoaXMudmlld09wdGlvbnMgPSB7IGNsYXNzTmFtZTogWydhY3Rpdml0eScsICdleHBlcmllbmNlJ10gfTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBpZiAodGhpcy5oYXNOZXR3b3JrKVxuICAgICAgdGhpcy5zZW5kKCdlbnRlcicpO1xuICB9XG5cbiAgLy8gaG9sZCgpIHt9XG5cbiAgZG9uZSgpIHtcbiAgICBpZiAodGhpcy5oYXNOZXR3b3JrKVxuICAgICAgdGhpcy5zZW5kKCdleGl0Jyk7XG5cbiAgICBzdXBlci5kb25lKCk7XG4gIH1cbn1cbiJdfQ==