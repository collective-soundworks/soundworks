'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _Experience2 = require('../core/Experience');

var _Experience3 = _interopRequireDefault(_Experience2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Server-side experience to create 1 liner controllers
 *
 * @memberof module:soundworks/server
 */
var ControllerExperience = function (_Experience) {
  (0, _inherits3.default)(ControllerExperience, _Experience);

  function ControllerExperience(clientTypes) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck3.default)(this, ControllerExperience);

    /**
     * Instance of the server-side `shared-params` service.
     * @type {module:soundworks/server.SharedParams}
     * @name sharedParams
     * @instance
     * @memberof module:soundworks/server.ControllerExperience
     */
    var _this = (0, _possibleConstructorReturn3.default)(this, (ControllerExperience.__proto__ || (0, _getPrototypeOf2.default)(ControllerExperience)).call(this, clientTypes));

    _this.sharedParams = _this.require('shared-params');

    if (options.auth) _this.auth = _this.require('auth');
    return _this;
  }

  return ControllerExperience;
}(_Experience3.default);

exports.default = ControllerExperience;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbnRyb2xsZXJFeHBlcmllbmNlLmpzIl0sIm5hbWVzIjpbIkNvbnRyb2xsZXJFeHBlcmllbmNlIiwiY2xpZW50VHlwZXMiLCJvcHRpb25zIiwic2hhcmVkUGFyYW1zIiwicmVxdWlyZSIsImF1dGgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBRUE7Ozs7O0lBS01BLG9COzs7QUFDSixnQ0FBWUMsV0FBWixFQUF1QztBQUFBLFFBQWRDLE9BQWMsdUVBQUosRUFBSTtBQUFBOztBQUdyQzs7Ozs7OztBQUhxQyxrS0FDL0JELFdBRCtCOztBQVVyQyxVQUFLRSxZQUFMLEdBQW9CLE1BQUtDLE9BQUwsQ0FBYSxlQUFiLENBQXBCOztBQUVBLFFBQUlGLFFBQVFHLElBQVosRUFDRSxNQUFLQSxJQUFMLEdBQVksTUFBS0QsT0FBTCxDQUFhLE1BQWIsQ0FBWjtBQWJtQztBQWN0Qzs7Ozs7a0JBR1lKLG9CIiwiZmlsZSI6IkNvbnRyb2xsZXJFeHBlcmllbmNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEV4cGVyaWVuY2UgZnJvbSAnLi4vY29yZS9FeHBlcmllbmNlJztcblxuLyoqXG4gKiBTZXJ2ZXItc2lkZSBleHBlcmllbmNlIHRvIGNyZWF0ZSAxIGxpbmVyIGNvbnRyb2xsZXJzXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlclxuICovXG5jbGFzcyBDb250cm9sbGVyRXhwZXJpZW5jZSBleHRlbmRzIEV4cGVyaWVuY2Uge1xuICBjb25zdHJ1Y3RvcihjbGllbnRUeXBlcywgb3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoY2xpZW50VHlwZXMpO1xuXG4gICAgLyoqXG4gICAgICogSW5zdGFuY2Ugb2YgdGhlIHNlcnZlci1zaWRlIGBzaGFyZWQtcGFyYW1zYCBzZXJ2aWNlLlxuICAgICAqIEB0eXBlIHttb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuU2hhcmVkUGFyYW1zfVxuICAgICAqIEBuYW1lIHNoYXJlZFBhcmFtc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuQ29udHJvbGxlckV4cGVyaWVuY2VcbiAgICAgKi9cbiAgICB0aGlzLnNoYXJlZFBhcmFtcyA9IHRoaXMucmVxdWlyZSgnc2hhcmVkLXBhcmFtcycpO1xuXG4gICAgaWYgKG9wdGlvbnMuYXV0aClcbiAgICAgIHRoaXMuYXV0aCA9IHRoaXMucmVxdWlyZSgnYXV0aCcpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbnRyb2xsZXJFeHBlcmllbmNlO1xuIl19