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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9jbGllbnQvc2NlbmVzL0V4cGVyaWVuY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozt5QkFBa0IsZUFBZTs7OzswQkFDZCxnQkFBZ0I7Ozs7NkJBQ2IsbUJBQW1COzs7OzBCQUN0QixnQkFBZ0I7Ozs7SUFFZCxVQUFVO1lBQVYsVUFBVTs7QUFDbEIsV0FEUSxVQUFVLEdBQ29CO1FBQXJDLEVBQUUseURBQUcsd0JBQU8sSUFBSTtRQUFFLFVBQVUseURBQUcsSUFBSTs7MEJBRDVCLFVBQVU7O0FBRTNCLCtCQUZpQixVQUFVLDZDQUVyQixFQUFFLEVBQUUsVUFBVSxFQUFFOzs7QUFHdEIsUUFBSSxVQUFVLEVBQ1osSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7R0FDeEQ7O2VBUGtCLFVBQVU7O1dBU3pCLGdCQUFHO0FBQ0wsVUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLFNBQVMsRUFBRSxDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsRUFBRSxDQUFDO0tBQzlEOzs7V0FFSSxpQkFBRztBQUNOLGlDQWRpQixVQUFVLHVDQWNiOztBQUVkLFVBQUksSUFBSSxDQUFDLFVBQVUsRUFDakIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUN0Qjs7Ozs7O1dBSUcsZ0JBQUc7QUFDTCxVQUFJLElBQUksQ0FBQyxVQUFVLEVBQ2pCLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRXBCLGlDQTFCaUIsVUFBVSxzQ0EwQmQ7S0FDZDs7O1NBM0JrQixVQUFVOzs7cUJBQVYsVUFBVSIsImZpbGUiOiIvVXNlcnMvbWF0dXN6ZXdza2kvZGV2L2Nvc2ltYS9saWIvc291bmR3b3Jrcy9zcmMvY2xpZW50L3NjZW5lcy9FeHBlcmllbmNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNjZW5lIGZyb20gJy4uL2NvcmUvU2NlbmUnO1xuaW1wb3J0IFNpZ25hbCBmcm9tICcuLi9jb3JlL1NpZ25hbCc7XG5pbXBvcnQgU2lnbmFsQWxsIGZyb20gJy4uL2NvcmUvU2lnbmFsQWxsJztcbmltcG9ydCBjbGllbnQgZnJvbSAnLi4vY29yZS9jbGllbnQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFeHBlcmllbmNlIGV4dGVuZHMgU2NlbmUge1xuICBjb25zdHJ1Y3RvcihpZCA9IGNsaWVudC50eXBlLCBoYXNOZXR3b3JrID0gdHJ1ZSkge1xuICAgIHN1cGVyKGlkLCBoYXNOZXR3b3JrKTtcblxuICAgIC8vIGlmIHRoZSBleHBlcmllbmNlIGhhcyBuZXR3b3JrLCByZXF1aXJlIGVycm9yUmVwb3J0ZXIgc2VydmljZSBieSBkZWZhdWx0XG4gICAgaWYgKGhhc05ldHdvcmspXG4gICAgICB0aGlzLl9lcnJvclJlcG9ydGVyID0gdGhpcy5yZXF1aXJlKCdlcnJvci1yZXBvcnRlcicpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLnZpZXdPcHRpb25zID0geyBjbGFzc05hbWU6IFsnYWN0aXZpdHknLCAnZXhwZXJpZW5jZSddIH07XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgaWYgKHRoaXMuaGFzTmV0d29yaylcbiAgICAgIHRoaXMuc2VuZCgnZW50ZXInKTtcbiAgfVxuXG4gIC8vIGhvbGQoKSB7fVxuXG4gIGRvbmUoKSB7XG4gICAgaWYgKHRoaXMuaGFzTmV0d29yaylcbiAgICAgIHRoaXMuc2VuZCgnZXhpdCcpO1xuXG4gICAgc3VwZXIuZG9uZSgpO1xuICB9XG59XG4iXX0=