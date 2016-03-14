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

var _Scene2 = require('../core/Scene');

var _Scene3 = _interopRequireDefault(_Scene2);

var _Signal = require('../core/Signal');

var _Signal2 = _interopRequireDefault(_Signal);

var _SignalAll = require('../core/SignalAll');

var _SignalAll2 = _interopRequireDefault(_SignalAll);

var _client = require('../core/client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Experience = function (_Scene) {
  (0, _inherits3.default)(Experience, _Scene);

  function Experience() {
    var hasNetwork = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
    (0, _classCallCheck3.default)(this, Experience);

    // if the experience has network, require errorReporter service by default

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Experience).call(this, 'experience', hasNetwork));

    if (hasNetwork) _this._errorReporter = _this.require('error-reporter');
    return _this;
  }

  (0, _createClass3.default)(Experience, [{
    key: 'init',
    value: function init() {}
  }, {
    key: 'createView',
    value: function createView() {
      if (this.viewOptions) {
        if (Array.isArray(this.viewOptions.className)) this.viewOptions.clientType.push(_client2.default.type);else if (typeof this.viewOptions.className === 'string') this.viewOptions.className = [this.viewOptions.className, _client2.default.type];else this.viewOptions.className = _client2.default.type;
      }

      return (0, _get3.default)((0, _getPrototypeOf2.default)(Experience.prototype), 'createView', this).call(this);
    }
  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(Experience.prototype), 'start', this).call(this);

      if (this.hasNetwork) this.send('enter');
    }

    // hold() {}

  }, {
    key: 'done',
    value: function done() {
      if (this.hasNetwork) this.send('exit');

      (0, _get3.default)((0, _getPrototypeOf2.default)(Experience.prototype), 'done', this).call(this);
    }
  }]);
  return Experience;
}(_Scene3.default);

exports.default = Experience;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV4cGVyaWVuY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztJQUVxQjs7O0FBQ25CLFdBRG1CLFVBQ25CLEdBQXVEO1FBQW5CLG1FQUFhLG9CQUFNO3dDQURwQyxZQUNvQzs7Ozs2RkFEcEMsdUJBRVgsY0FBYyxhQURpQzs7QUFHckQsUUFBSSxVQUFKLEVBQ0UsTUFBSyxjQUFMLEdBQXNCLE1BQUssT0FBTCxDQUFhLGdCQUFiLENBQXRCLENBREY7aUJBSHFEO0dBQXZEOzs2QkFEbUI7OzJCQVFaOzs7aUNBRU07QUFDWCxVQUFJLEtBQUssV0FBTCxFQUFrQjtBQUNwQixZQUFJLE1BQU0sT0FBTixDQUFjLEtBQUssV0FBTCxDQUFpQixTQUFqQixDQUFsQixFQUNFLEtBQUssV0FBTCxDQUFpQixVQUFqQixDQUE0QixJQUE1QixDQUFpQyxpQkFBTyxJQUFQLENBQWpDLENBREYsS0FFSyxJQUFJLE9BQU8sS0FBSyxXQUFMLENBQWlCLFNBQWpCLEtBQStCLFFBQXRDLEVBQ1AsS0FBSyxXQUFMLENBQWlCLFNBQWpCLEdBQTZCLENBQUMsS0FBSyxXQUFMLENBQWlCLFNBQWpCLEVBQTRCLGlCQUFPLElBQVAsQ0FBMUQsQ0FERyxLQUdILEtBQUssV0FBTCxDQUFpQixTQUFqQixHQUE2QixpQkFBTyxJQUFQLENBSDFCO09BSFA7O0FBU0EsOERBcEJpQixxREFvQmpCLENBVlc7Ozs7NEJBYUw7QUFDTix1REF4QmlCLGdEQXdCakIsQ0FETTs7QUFHTixVQUFJLEtBQUssVUFBTCxFQUNGLEtBQUssSUFBTCxDQUFVLE9BQVYsRUFERjs7Ozs7OzsyQkFNSztBQUNMLFVBQUksS0FBSyxVQUFMLEVBQ0YsS0FBSyxJQUFMLENBQVUsTUFBVixFQURGOztBQUdBLHVEQXBDaUIsK0NBb0NqQixDQUpLOzs7U0FoQ1kiLCJmaWxlIjoiRXhwZXJpZW5jZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTY2VuZSBmcm9tICcuLi9jb3JlL1NjZW5lJztcbmltcG9ydCBTaWduYWwgZnJvbSAnLi4vY29yZS9TaWduYWwnO1xuaW1wb3J0IFNpZ25hbEFsbCBmcm9tICcuLi9jb3JlL1NpZ25hbEFsbCc7XG5pbXBvcnQgY2xpZW50IGZyb20gJy4uL2NvcmUvY2xpZW50JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXhwZXJpZW5jZSBleHRlbmRzIFNjZW5lIHtcbiAgY29uc3RydWN0b3IoLyogaWQgPSBjbGllbnQudHlwZSwgKi8gaGFzTmV0d29yayA9IHRydWUpIHtcbiAgICBzdXBlcignZXhwZXJpZW5jZScsIGhhc05ldHdvcmspO1xuICAgIC8vIGlmIHRoZSBleHBlcmllbmNlIGhhcyBuZXR3b3JrLCByZXF1aXJlIGVycm9yUmVwb3J0ZXIgc2VydmljZSBieSBkZWZhdWx0XG4gICAgaWYgKGhhc05ldHdvcmspXG4gICAgICB0aGlzLl9lcnJvclJlcG9ydGVyID0gdGhpcy5yZXF1aXJlKCdlcnJvci1yZXBvcnRlcicpO1xuICB9XG5cbiAgaW5pdCgpIHt9XG5cbiAgY3JlYXRlVmlldygpIHtcbiAgICBpZiAodGhpcy52aWV3T3B0aW9ucykge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy52aWV3T3B0aW9ucy5jbGFzc05hbWUpKVxuICAgICAgICB0aGlzLnZpZXdPcHRpb25zLmNsaWVudFR5cGUucHVzaChjbGllbnQudHlwZSk7XG4gICAgICBlbHNlIGlmICh0eXBlb2YgdGhpcy52aWV3T3B0aW9ucy5jbGFzc05hbWUgPT09ICdzdHJpbmcnKVxuICAgICAgICB0aGlzLnZpZXdPcHRpb25zLmNsYXNzTmFtZSA9IFt0aGlzLnZpZXdPcHRpb25zLmNsYXNzTmFtZSwgY2xpZW50LnR5cGVdO1xuICAgICAgZWxzZVxuICAgICAgICB0aGlzLnZpZXdPcHRpb25zLmNsYXNzTmFtZSA9IGNsaWVudC50eXBlO1xuICAgIH1cblxuICAgIHJldHVybiBzdXBlci5jcmVhdGVWaWV3KCk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgaWYgKHRoaXMuaGFzTmV0d29yaylcbiAgICAgIHRoaXMuc2VuZCgnZW50ZXInKTtcbiAgfVxuXG4gIC8vIGhvbGQoKSB7fVxuXG4gIGRvbmUoKSB7XG4gICAgaWYgKHRoaXMuaGFzTmV0d29yaylcbiAgICAgIHRoaXMuc2VuZCgnZXhpdCcpO1xuXG4gICAgc3VwZXIuZG9uZSgpO1xuICB9XG59XG4iXX0=