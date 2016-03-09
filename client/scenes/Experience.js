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
    var id = arguments.length <= 0 || arguments[0] === undefined ? _client2.default.type : arguments[0];
    var hasNetwork = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
    (0, _classCallCheck3.default)(this, Experience);


    // if the experience has network, require errorReporter service by default

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Experience).call(this, id, hasNetwork));

    if (hasNetwork) _this._errorReporter = _this.require('error-reporter');
    return _this;
  }

  (0, _createClass3.default)(Experience, [{
    key: 'init',
    value: function init() {
      this.viewOptions = { className: ['activity', 'experience'] };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV4cGVyaWVuY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztJQUVxQjs7O0FBQ25CLFdBRG1CLFVBQ25CLEdBQWlEO1FBQXJDLDJEQUFLLGlCQUFPLElBQVAsZ0JBQWdDO1FBQW5CLG1FQUFhLG9CQUFNO3dDQUQ5QixZQUM4Qjs7Ozs7NkZBRDlCLHVCQUVYLElBQUksYUFEcUM7O0FBSS9DLFFBQUksVUFBSixFQUNFLE1BQUssY0FBTCxHQUFzQixNQUFLLE9BQUwsQ0FBYSxnQkFBYixDQUF0QixDQURGO2lCQUorQztHQUFqRDs7NkJBRG1COzsyQkFTWjtBQUNMLFdBQUssV0FBTCxHQUFtQixFQUFFLFdBQVcsQ0FBQyxVQUFELEVBQWEsWUFBYixDQUFYLEVBQXJCLENBREs7Ozs7NEJBSUM7QUFDTix1REFkaUIsZ0RBY2pCLENBRE07O0FBR04sVUFBSSxLQUFLLFVBQUwsRUFDRixLQUFLLElBQUwsQ0FBVSxPQUFWLEVBREY7Ozs7Ozs7MkJBTUs7QUFDTCxVQUFJLEtBQUssVUFBTCxFQUNGLEtBQUssSUFBTCxDQUFVLE1BQVYsRUFERjs7QUFHQSx1REExQmlCLCtDQTBCakIsQ0FKSzs7O1NBdEJZIiwiZmlsZSI6IkV4cGVyaWVuY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2NlbmUgZnJvbSAnLi4vY29yZS9TY2VuZSc7XG5pbXBvcnQgU2lnbmFsIGZyb20gJy4uL2NvcmUvU2lnbmFsJztcbmltcG9ydCBTaWduYWxBbGwgZnJvbSAnLi4vY29yZS9TaWduYWxBbGwnO1xuaW1wb3J0IGNsaWVudCBmcm9tICcuLi9jb3JlL2NsaWVudCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV4cGVyaWVuY2UgZXh0ZW5kcyBTY2VuZSB7XG4gIGNvbnN0cnVjdG9yKGlkID0gY2xpZW50LnR5cGUsIGhhc05ldHdvcmsgPSB0cnVlKSB7XG4gICAgc3VwZXIoaWQsIGhhc05ldHdvcmspO1xuXG4gICAgLy8gaWYgdGhlIGV4cGVyaWVuY2UgaGFzIG5ldHdvcmssIHJlcXVpcmUgZXJyb3JSZXBvcnRlciBzZXJ2aWNlIGJ5IGRlZmF1bHRcbiAgICBpZiAoaGFzTmV0d29yaylcbiAgICAgIHRoaXMuX2Vycm9yUmVwb3J0ZXIgPSB0aGlzLnJlcXVpcmUoJ2Vycm9yLXJlcG9ydGVyJyk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIHRoaXMudmlld09wdGlvbnMgPSB7IGNsYXNzTmFtZTogWydhY3Rpdml0eScsICdleHBlcmllbmNlJ10gfTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBpZiAodGhpcy5oYXNOZXR3b3JrKVxuICAgICAgdGhpcy5zZW5kKCdlbnRlcicpO1xuICB9XG5cbiAgLy8gaG9sZCgpIHt9XG5cbiAgZG9uZSgpIHtcbiAgICBpZiAodGhpcy5oYXNOZXR3b3JrKVxuICAgICAgdGhpcy5zZW5kKCdleGl0Jyk7XG5cbiAgICBzdXBlci5kb25lKCk7XG4gIH1cbn1cbiJdfQ==