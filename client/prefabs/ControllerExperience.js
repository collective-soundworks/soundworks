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
 * @memberof module:soundworks/client
 */
var ControllerExperience = function (_Experience) {
  (0, _inherits3.default)(ControllerExperience, _Experience);

  function ControllerExperience() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, ControllerExperience);

    var _this = (0, _possibleConstructorReturn3.default)(this, (ControllerExperience.__proto__ || (0, _getPrototypeOf2.default)(ControllerExperience)).call(this));

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbnRyb2xsZXJFeHBlcmllbmNlLmpzIl0sIm5hbWVzIjpbIkNvbnRyb2xsZXJFeHBlcmllbmNlIiwib3B0aW9ucyIsInNoYXJlZFBhcmFtcyIsInJlcXVpcmUiLCJjb250cm9sbGVyU2NlbmUiLCJhdXRoIiwidmlldyIsInNob3ciLCJlbnRlciIsIm5hbWUiLCJzZXRHdWlPcHRpb25zIiwiJGVsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUdBOzs7OztJQUtNQSxvQjs7O0FBQ0osa0NBQTBCO0FBQUEsUUFBZEMsT0FBYyx1RUFBSixFQUFJO0FBQUE7O0FBQUE7O0FBR3hCLFVBQUtDLFlBQUwsR0FBb0IsTUFBS0MsT0FBTCxDQUFhLGVBQWIsQ0FBcEI7QUFDQSxVQUFLQyxlQUFMLEdBQXVCLHFDQUEwQixNQUFLRixZQUEvQixDQUF2Qjs7QUFFQSxRQUFJRCxRQUFRSSxJQUFaLEVBQ0UsTUFBS0EsSUFBTCxHQUFZLE1BQUtGLE9BQUwsQ0FBYSxNQUFiLENBQVo7QUFQc0I7QUFRekI7Ozs7NEJBRU87QUFDTjs7QUFFQSxXQUFLRyxJQUFMLEdBQVksb0JBQVo7QUFDQSxXQUFLQyxJQUFMOztBQUVBLFdBQUtILGVBQUwsQ0FBcUJJLEtBQXJCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7O2tDQVdjQyxJLEVBQU1SLE8sRUFBUztBQUMzQixXQUFLRyxlQUFMLENBQXFCTSxhQUFyQixDQUFtQ0QsSUFBbkMsRUFBeUNSLE9BQXpDO0FBQ0Q7Ozt3QkFFZTtBQUNkLGFBQU8sS0FBS0ssSUFBTCxDQUFVSyxHQUFqQjtBQUNEOzs7OztrQkFHWVgsb0IiLCJmaWxlIjoiQ29udHJvbGxlckV4cGVyaWVuY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRXhwZXJpZW5jZSBmcm9tICcuLi9jb3JlL0V4cGVyaWVuY2UnO1xuaW1wb3J0IFZpZXcgZnJvbSAnLi4vdmlld3MvVmlldyc7XG5pbXBvcnQgQ29udHJvbGxlclNjZW5lIGZyb20gJy4vQ29udHJvbGxlclNjZW5lJztcblxuXG4vKipcbiAqIFByZWRlZmluZWQgZXhwZXJpZW5jZSB0byBjcmVhdGUgYSAxIGxpbmUgc2hhcmVkIGNvbnRyb2xsZXJcbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKi9cbmNsYXNzIENvbnRyb2xsZXJFeHBlcmllbmNlIGV4dGVuZHMgRXhwZXJpZW5jZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnNoYXJlZFBhcmFtcyA9IHRoaXMucmVxdWlyZSgnc2hhcmVkLXBhcmFtcycpO1xuICAgIHRoaXMuY29udHJvbGxlclNjZW5lID0gbmV3IENvbnRyb2xsZXJTY2VuZSh0aGlzLCB0aGlzLnNoYXJlZFBhcmFtcyk7XG5cbiAgICBpZiAob3B0aW9ucy5hdXRoKVxuICAgICAgdGhpcy5hdXRoID0gdGhpcy5yZXF1aXJlKCdhdXRoJyk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgdGhpcy52aWV3ID0gbmV3IFZpZXcoKTtcbiAgICB0aGlzLnNob3coKTtcblxuICAgIHRoaXMuY29udHJvbGxlclNjZW5lLmVudGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogQ29uZmlndXJlIHRoZSBHVUkgZm9yIGEgZ2l2ZW4gcGFyYW1ldGVyLCB0aGlzIG1ldGhvZCBvbmx5IG1ha2VzIHNlbnMgaWZcbiAgICogYG9wdGlvbnMuaGFzR1VJPXRydWVgLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlciB0byBjb25maWd1cmUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3B0aW9ucyB0byBjb25maWd1cmUgdGhlIHBhcmFtZXRlciBHVUkuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLnR5cGUgLSBUeXBlIG9mIEdVSSB0byB1c2UuIEVhY2ggdHlwZSBvZiBwYXJhbWV0ZXIgY2FuXG4gICAqICB1c2VkIHdpdGggZGlmZmVyZW50IEdVSSBhY2NvcmRpbmcgdG8gdGhlaXIgdHlwZSBhbmQgY29tZXMgd2l0aCBhY2NlcHRhYmxlXG4gICAqICBkZWZhdWx0IHZhbHVlcy5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5zaG93PXRydWVdIC0gRGlzcGxheSBvciBub3QgdGhlIEdVSSBmb3IgdGhpcyBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuY29uZmlybT1mYWxzZV0gLSBBc2sgZm9yIGNvbmZpcm1hdGlvbiB3aGVuIHRoZSB2YWx1ZSBjaGFuZ2VzLlxuICAgKi9cbiAgc2V0R3VpT3B0aW9ucyhuYW1lLCBvcHRpb25zKSB7XG4gICAgdGhpcy5jb250cm9sbGVyU2NlbmUuc2V0R3VpT3B0aW9ucyhuYW1lLCBvcHRpb25zKTtcbiAgfVxuXG4gIGdldCBjb250YWluZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMudmlldy4kZWw7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29udHJvbGxlckV4cGVyaWVuY2U7XG4iXX0=