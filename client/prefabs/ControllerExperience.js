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

var _Experience2 = require('../core/Experience');

var _Experience3 = _interopRequireDefault(_Experience2);

var _View = require('../views/View');

var _View2 = _interopRequireDefault(_View);

var _ControllerScene = require('./ControllerScene');

var _ControllerScene2 = _interopRequireDefault(_ControllerScene);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Predefined experience to create a 1 line shared controller
 *
 * @deprecated
 * @memberof module:soundworks/client
 */
var ControllerExperience = function (_Experience) {
  (0, _inherits3.default)(ControllerExperience, _Experience);

  function ControllerExperience() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, ControllerExperience);

    var _this = (0, _possibleConstructorReturn3.default)(this, (ControllerExperience.__proto__ || (0, _getPrototypeOf2.default)(ControllerExperience)).call(this));

    console.error('[deprecated] ControllerExperience is deprecated, has moved in soundworks-template and will be removed in soundworks#v3.0.0. Please consider updating your application from soundworks-template');

    _this.sharedParams = _this.require('shared-params');
    _this.controllerScene = new _ControllerScene2.default(_this, _this.sharedParams);

    if (options.auth) _this.auth = _this.require('auth');
    return _this;
  }

  (0, _createClass3.default)(ControllerExperience, [{
    key: 'start',
    value: function start() {
      (0, _get3.default)(ControllerExperience.prototype.__proto__ || (0, _getPrototypeOf2.default)(ControllerExperience.prototype), 'start', this).call(this);

      this.view = new _View2.default();
      this.show();

      this.controllerScene.enter();
    }

    /**
     * Configure the GUI for a given parameter, this method only makes sens if
     * `options.hasGUI=true`.
     * @param {String} name - Name of the parameter to configure.
     * @param {Object} options - Options to configure the parameter GUI.
     * @param {String} options.type - Type of GUI to use. Each type of parameter can
     *  used with different GUI according to their type and comes with acceptable
     *  default values.
     * @param {Boolean} [options.show=true] - Display or not the GUI for this parameter.
     * @param {Boolean} [options.confirm=false] - Ask for confirmation when the value changes.
     */

  }, {
    key: 'setGuiOptions',
    value: function setGuiOptions(name, options) {
      this.controllerScene.setGuiOptions(name, options);
    }
  }, {
    key: 'container',
    get: function get() {
      return this.view.$el;
    }
  }]);
  return ControllerExperience;
}(_Experience3.default);

exports.default = ControllerExperience;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbnRyb2xsZXJFeHBlcmllbmNlLmpzIl0sIm5hbWVzIjpbIkNvbnRyb2xsZXJFeHBlcmllbmNlIiwib3B0aW9ucyIsImNvbnNvbGUiLCJlcnJvciIsInNoYXJlZFBhcmFtcyIsInJlcXVpcmUiLCJjb250cm9sbGVyU2NlbmUiLCJDb250cm9sbGVyU2NlbmUiLCJhdXRoIiwidmlldyIsIlZpZXciLCJzaG93IiwiZW50ZXIiLCJuYW1lIiwic2V0R3VpT3B0aW9ucyIsIiRlbCIsIkV4cGVyaWVuY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBR0E7Ozs7OztJQU1NQSxvQjs7O0FBQ0osa0NBQTBCO0FBQUEsUUFBZEMsT0FBYyx1RUFBSixFQUFJO0FBQUE7O0FBQUE7O0FBR3hCQyxZQUFRQyxLQUFSLENBQWMsZ01BQWQ7O0FBRUEsVUFBS0MsWUFBTCxHQUFvQixNQUFLQyxPQUFMLENBQWEsZUFBYixDQUFwQjtBQUNBLFVBQUtDLGVBQUwsR0FBdUIsSUFBSUMseUJBQUosUUFBMEIsTUFBS0gsWUFBL0IsQ0FBdkI7O0FBRUEsUUFBSUgsUUFBUU8sSUFBWixFQUNFLE1BQUtBLElBQUwsR0FBWSxNQUFLSCxPQUFMLENBQWEsTUFBYixDQUFaO0FBVHNCO0FBVXpCOzs7OzRCQUVPO0FBQ047O0FBRUEsV0FBS0ksSUFBTCxHQUFZLElBQUlDLGNBQUosRUFBWjtBQUNBLFdBQUtDLElBQUw7O0FBRUEsV0FBS0wsZUFBTCxDQUFxQk0sS0FBckI7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7a0NBV2NDLEksRUFBTVosTyxFQUFTO0FBQzNCLFdBQUtLLGVBQUwsQ0FBcUJRLGFBQXJCLENBQW1DRCxJQUFuQyxFQUF5Q1osT0FBekM7QUFDRDs7O3dCQUVlO0FBQ2QsYUFBTyxLQUFLUSxJQUFMLENBQVVNLEdBQWpCO0FBQ0Q7OztFQXZDZ0NDLG9COztrQkEwQ3BCaEIsb0IiLCJmaWxlIjoiQ29udHJvbGxlckV4cGVyaWVuY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRXhwZXJpZW5jZSBmcm9tICcuLi9jb3JlL0V4cGVyaWVuY2UnO1xuaW1wb3J0IFZpZXcgZnJvbSAnLi4vdmlld3MvVmlldyc7XG5pbXBvcnQgQ29udHJvbGxlclNjZW5lIGZyb20gJy4vQ29udHJvbGxlclNjZW5lJztcblxuXG4vKipcbiAqIFByZWRlZmluZWQgZXhwZXJpZW5jZSB0byBjcmVhdGUgYSAxIGxpbmUgc2hhcmVkIGNvbnRyb2xsZXJcbiAqXG4gKiBAZGVwcmVjYXRlZFxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICovXG5jbGFzcyBDb250cm9sbGVyRXhwZXJpZW5jZSBleHRlbmRzIEV4cGVyaWVuY2Uge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcigpO1xuXG4gICAgY29uc29sZS5lcnJvcignW2RlcHJlY2F0ZWRdIENvbnRyb2xsZXJFeHBlcmllbmNlIGlzIGRlcHJlY2F0ZWQsIGhhcyBtb3ZlZCBpbiBzb3VuZHdvcmtzLXRlbXBsYXRlIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gc291bmR3b3JrcyN2My4wLjAuIFBsZWFzZSBjb25zaWRlciB1cGRhdGluZyB5b3VyIGFwcGxpY2F0aW9uIGZyb20gc291bmR3b3Jrcy10ZW1wbGF0ZScpO1xuXG4gICAgdGhpcy5zaGFyZWRQYXJhbXMgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1wYXJhbXMnKTtcbiAgICB0aGlzLmNvbnRyb2xsZXJTY2VuZSA9IG5ldyBDb250cm9sbGVyU2NlbmUodGhpcywgdGhpcy5zaGFyZWRQYXJhbXMpO1xuXG4gICAgaWYgKG9wdGlvbnMuYXV0aClcbiAgICAgIHRoaXMuYXV0aCA9IHRoaXMucmVxdWlyZSgnYXV0aCcpO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIHRoaXMudmlldyA9IG5ldyBWaWV3KCk7XG4gICAgdGhpcy5zaG93KCk7XG5cbiAgICB0aGlzLmNvbnRyb2xsZXJTY2VuZS5lbnRlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyZSB0aGUgR1VJIGZvciBhIGdpdmVuIHBhcmFtZXRlciwgdGhpcyBtZXRob2Qgb25seSBtYWtlcyBzZW5zIGlmXG4gICAqIGBvcHRpb25zLmhhc0dVST10cnVlYC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIgdG8gY29uZmlndXJlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE9wdGlvbnMgdG8gY29uZmlndXJlIHRoZSBwYXJhbWV0ZXIgR1VJLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy50eXBlIC0gVHlwZSBvZiBHVUkgdG8gdXNlLiBFYWNoIHR5cGUgb2YgcGFyYW1ldGVyIGNhblxuICAgKiAgdXNlZCB3aXRoIGRpZmZlcmVudCBHVUkgYWNjb3JkaW5nIHRvIHRoZWlyIHR5cGUgYW5kIGNvbWVzIHdpdGggYWNjZXB0YWJsZVxuICAgKiAgZGVmYXVsdCB2YWx1ZXMuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuc2hvdz10cnVlXSAtIERpc3BsYXkgb3Igbm90IHRoZSBHVUkgZm9yIHRoaXMgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmNvbmZpcm09ZmFsc2VdIC0gQXNrIGZvciBjb25maXJtYXRpb24gd2hlbiB0aGUgdmFsdWUgY2hhbmdlcy5cbiAgICovXG4gIHNldEd1aU9wdGlvbnMobmFtZSwgb3B0aW9ucykge1xuICAgIHRoaXMuY29udHJvbGxlclNjZW5lLnNldEd1aU9wdGlvbnMobmFtZSwgb3B0aW9ucyk7XG4gIH1cblxuICBnZXQgY29udGFpbmVyKCkge1xuICAgIHJldHVybiB0aGlzLnZpZXcuJGVsO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbnRyb2xsZXJFeHBlcmllbmNlO1xuIl19