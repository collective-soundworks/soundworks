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

var _Activity2 = require('./Activity');

var _Activity3 = _interopRequireDefault(_Activity2);

var _serviceManager = require('./serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Base class to be extended in order to create the client-side of a custom
 * experience.
 *
 * The user defined `Experience` is the main component of a soundworks application.
 *
 * @memberof module:soundworks/client
 * @extends module:soundworks/client.Activity
 */
var Experience = function (_Activity) {
  (0, _inherits3.default)(Experience, _Activity);

  /**
   * @param {Boolean} [hasNetwork=true] - Define if the experience requires a
   *  socket connection.
   */
  function Experience() {
    var hasNetwork = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    (0, _classCallCheck3.default)(this, Experience);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Experience.__proto__ || (0, _getPrototypeOf2.default)(Experience)).call(this, 'experience', hasNetwork));

    _this.start = _this.start.bind(_this);

    _this.requiredSignals.addObserver(_this.start);
    _this.waitFor(_serviceManager2.default.signals.ready);

    // if the experience has network, require errorReporter service by default
    if (hasNetwork) _this._errorReporter = _this.require('error-reporter');
    return _this;
  }

  /**
   * Returns a service configured with the given options.
   * @param {String} id - The identifier of the service.
   * @param {Object} options - The options to configure the service.
   */


  (0, _createClass3.default)(Experience, [{
    key: 'require',
    value: function require(id, options) {
      return _serviceManager2.default.require(id, options);
    }

    /**
     * Start the experience. This lifecycle method is called when all the
     * required services are `ready` and thus the experience can begin with all
     * the necessary informations and services ready to be consumed.
     */

  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)(Experience.prototype.__proto__ || (0, _getPrototypeOf2.default)(Experience.prototype), 'start', this).call(this);

      if (this.hasNetwork) this.send('enter');
    }

    /** @private */
    // done() {
    //   if (this.hasNetwork)
    //     this.send('exit');

    //   super.done();
    // }

  }]);
  return Experience;
}(_Activity3.default);

exports.default = Experience;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV4cGVyaWVuY2UuanMiXSwibmFtZXMiOlsiRXhwZXJpZW5jZSIsImhhc05ldHdvcmsiLCJzdGFydCIsImJpbmQiLCJyZXF1aXJlZFNpZ25hbHMiLCJhZGRPYnNlcnZlciIsIndhaXRGb3IiLCJzaWduYWxzIiwicmVhZHkiLCJfZXJyb3JSZXBvcnRlciIsInJlcXVpcmUiLCJpZCIsIm9wdGlvbnMiLCJzZW5kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFHQTs7Ozs7Ozs7O0lBU01BLFU7OztBQUNKOzs7O0FBSUEsd0JBQStCO0FBQUEsUUFBbkJDLFVBQW1CLHVFQUFOLElBQU07QUFBQTs7QUFBQSw4SUFDdkIsWUFEdUIsRUFDVEEsVUFEUzs7QUFHN0IsVUFBS0MsS0FBTCxHQUFhLE1BQUtBLEtBQUwsQ0FBV0MsSUFBWCxPQUFiOztBQUVBLFVBQUtDLGVBQUwsQ0FBcUJDLFdBQXJCLENBQWlDLE1BQUtILEtBQXRDO0FBQ0EsVUFBS0ksT0FBTCxDQUFhLHlCQUFlQyxPQUFmLENBQXVCQyxLQUFwQzs7QUFFQTtBQUNBLFFBQUlQLFVBQUosRUFDRSxNQUFLUSxjQUFMLEdBQXNCLE1BQUtDLE9BQUwsQ0FBYSxnQkFBYixDQUF0QjtBQVYyQjtBQVc5Qjs7QUFFRDs7Ozs7Ozs7OzRCQUtRQyxFLEVBQUlDLE8sRUFBUztBQUNuQixhQUFPLHlCQUFlRixPQUFmLENBQXVCQyxFQUF2QixFQUEyQkMsT0FBM0IsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozs0QkFLUTtBQUNOOztBQUVBLFVBQUksS0FBS1gsVUFBVCxFQUNFLEtBQUtZLElBQUwsQ0FBVSxPQUFWO0FBQ0g7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7O2tCQUdhYixVIiwiZmlsZSI6IkV4cGVyaWVuY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWN0aXZpdHkgZnJvbSAnLi9BY3Rpdml0eSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi9zZXJ2aWNlTWFuYWdlcic7XG5cblxuLyoqXG4gKiBCYXNlIGNsYXNzIHRvIGJlIGV4dGVuZGVkIGluIG9yZGVyIHRvIGNyZWF0ZSB0aGUgY2xpZW50LXNpZGUgb2YgYSBjdXN0b21cbiAqIGV4cGVyaWVuY2UuXG4gKlxuICogVGhlIHVzZXIgZGVmaW5lZCBgRXhwZXJpZW5jZWAgaXMgdGhlIG1haW4gY29tcG9uZW50IG9mIGEgc291bmR3b3JrcyBhcHBsaWNhdGlvbi5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAZXh0ZW5kcyBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWN0aXZpdHlcbiAqL1xuY2xhc3MgRXhwZXJpZW5jZSBleHRlbmRzIEFjdGl2aXR5IHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2hhc05ldHdvcms9dHJ1ZV0gLSBEZWZpbmUgaWYgdGhlIGV4cGVyaWVuY2UgcmVxdWlyZXMgYVxuICAgKiAgc29ja2V0IGNvbm5lY3Rpb24uXG4gICAqL1xuICBjb25zdHJ1Y3RvcihoYXNOZXR3b3JrID0gdHJ1ZSkge1xuICAgIHN1cGVyKCdleHBlcmllbmNlJywgaGFzTmV0d29yayk7XG5cbiAgICB0aGlzLnN0YXJ0ID0gdGhpcy5zdGFydC5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5yZXF1aXJlZFNpZ25hbHMuYWRkT2JzZXJ2ZXIodGhpcy5zdGFydCk7XG4gICAgdGhpcy53YWl0Rm9yKHNlcnZpY2VNYW5hZ2VyLnNpZ25hbHMucmVhZHkpO1xuXG4gICAgLy8gaWYgdGhlIGV4cGVyaWVuY2UgaGFzIG5ldHdvcmssIHJlcXVpcmUgZXJyb3JSZXBvcnRlciBzZXJ2aWNlIGJ5IGRlZmF1bHRcbiAgICBpZiAoaGFzTmV0d29yaylcbiAgICAgIHRoaXMuX2Vycm9yUmVwb3J0ZXIgPSB0aGlzLnJlcXVpcmUoJ2Vycm9yLXJlcG9ydGVyJyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHNlcnZpY2UgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBUaGUgaWRlbnRpZmllciBvZiB0aGUgc2VydmljZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBUaGUgb3B0aW9ucyB0byBjb25maWd1cmUgdGhlIHNlcnZpY2UuXG4gICAqL1xuICByZXF1aXJlKGlkLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIHNlcnZpY2VNYW5hZ2VyLnJlcXVpcmUoaWQsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBleHBlcmllbmNlLiBUaGlzIGxpZmVjeWNsZSBtZXRob2QgaXMgY2FsbGVkIHdoZW4gYWxsIHRoZVxuICAgKiByZXF1aXJlZCBzZXJ2aWNlcyBhcmUgYHJlYWR5YCBhbmQgdGh1cyB0aGUgZXhwZXJpZW5jZSBjYW4gYmVnaW4gd2l0aCBhbGxcbiAgICogdGhlIG5lY2Vzc2FyeSBpbmZvcm1hdGlvbnMgYW5kIHNlcnZpY2VzIHJlYWR5IHRvIGJlIGNvbnN1bWVkLlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICh0aGlzLmhhc05ldHdvcmspXG4gICAgICB0aGlzLnNlbmQoJ2VudGVyJyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgLy8gZG9uZSgpIHtcbiAgLy8gICBpZiAodGhpcy5oYXNOZXR3b3JrKVxuICAvLyAgICAgdGhpcy5zZW5kKCdleGl0Jyk7XG5cbiAgLy8gICBzdXBlci5kb25lKCk7XG4gIC8vIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRXhwZXJpZW5jZTtcbiJdfQ==