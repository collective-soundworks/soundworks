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

var _client = require('../core/client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Base class to be extended in order to create the client-side of a custom
 * experience.
 *
 * The user defined `Experience` is the main component of a soundworks application.
 *
 * @memberof module:soundworks/client
 * @extends module:soundworks/client.Scene
 */

var Experience = function (_Scene) {
  (0, _inherits3.default)(Experience, _Scene);

  /**
   * @param {Boolean} [hasNetwork=true] - Define if the experience requires a
   *  socket connection.
   */

  function Experience() {
    var hasNetwork = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
    (0, _classCallCheck3.default)(this, Experience);

    // if the experience has network, require errorReporter service by default

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Experience).call(this, 'experience', hasNetwork));

    if (hasNetwork) _this._errorReporter = _this.require('error-reporter');
    return _this;
  }

  /**
   * Interface method to implement in each experience. This method is part of the
   * experience lifecycle and should be called when
   * [`Experience#start`]{@link module:soundworks/client.Experience#start}
   * is called for the first time.
   *
   * @example
   * // in MyExperience#start
   * if (this.hasStarted)
   *   this.init();
   */


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

    /**
     * Start the experience. This lifecycle method is called when all the
     * required services are `ready` and thus the experience can begin with all
     * the necessary informations and services ready to be consumed.
     */

  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(Experience.prototype), 'start', this).call(this);

      if (this.hasNetwork) this.send('enter');
    }

    /** @private */

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV4cGVyaWVuY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7OztJQVdNLFU7Ozs7Ozs7O0FBS0osd0JBQStCO0FBQUEsUUFBbkIsVUFBbUIseURBQU4sSUFBTTtBQUFBOzs7O0FBQUEsb0hBQ3ZCLFlBRHVCLEVBQ1QsVUFEUzs7QUFHN0IsUUFBSSxVQUFKLEVBQ0UsTUFBSyxjQUFMLEdBQXNCLE1BQUssT0FBTCxDQUFhLGdCQUFiLENBQXRCO0FBSjJCO0FBSzlCOzs7Ozs7Ozs7Ozs7Ozs7OzsyQkFhTSxDQUFFOzs7aUNBRUk7QUFDWCxVQUFJLEtBQUssV0FBVCxFQUFzQjtBQUNwQixZQUFJLE1BQU0sT0FBTixDQUFjLEtBQUssV0FBTCxDQUFpQixTQUEvQixDQUFKLEVBQ0UsS0FBSyxXQUFMLENBQWlCLFVBQWpCLENBQTRCLElBQTVCLENBQWlDLGlCQUFPLElBQXhDLEVBREYsS0FFSyxJQUFJLE9BQU8sS0FBSyxXQUFMLENBQWlCLFNBQXhCLEtBQXNDLFFBQTFDLEVBQ0gsS0FBSyxXQUFMLENBQWlCLFNBQWpCLEdBQTZCLENBQUMsS0FBSyxXQUFMLENBQWlCLFNBQWxCLEVBQTZCLGlCQUFPLElBQXBDLENBQTdCLENBREcsS0FHSCxLQUFLLFdBQUwsQ0FBaUIsU0FBakIsR0FBNkIsaUJBQU8sSUFBcEM7QUFDSDs7QUFFRDtBQUNEOzs7Ozs7Ozs7OzRCQU9PO0FBQ047O0FBRUEsVUFBSSxLQUFLLFVBQVQsRUFDRSxLQUFLLElBQUwsQ0FBVSxPQUFWO0FBQ0g7Ozs7OzsyQkFHTTtBQUNMLFVBQUksS0FBSyxVQUFULEVBQ0UsS0FBSyxJQUFMLENBQVUsTUFBVjs7QUFFRjtBQUNEOzs7OztrQkFHWSxVIiwiZmlsZSI6IkV4cGVyaWVuY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2NlbmUgZnJvbSAnLi4vY29yZS9TY2VuZSc7XG5pbXBvcnQgY2xpZW50IGZyb20gJy4uL2NvcmUvY2xpZW50JztcblxuLyoqXG4gKiBCYXNlIGNsYXNzIHRvIGJlIGV4dGVuZGVkIGluIG9yZGVyIHRvIGNyZWF0ZSB0aGUgY2xpZW50LXNpZGUgb2YgYSBjdXN0b21cbiAqIGV4cGVyaWVuY2UuXG4gKlxuICogVGhlIHVzZXIgZGVmaW5lZCBgRXhwZXJpZW5jZWAgaXMgdGhlIG1haW4gY29tcG9uZW50IG9mIGEgc291bmR3b3JrcyBhcHBsaWNhdGlvbi5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAZXh0ZW5kcyBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuU2NlbmVcbiAqL1xuY2xhc3MgRXhwZXJpZW5jZSBleHRlbmRzIFNjZW5lIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2hhc05ldHdvcms9dHJ1ZV0gLSBEZWZpbmUgaWYgdGhlIGV4cGVyaWVuY2UgcmVxdWlyZXMgYVxuICAgKiAgc29ja2V0IGNvbm5lY3Rpb24uXG4gICAqL1xuICBjb25zdHJ1Y3RvcihoYXNOZXR3b3JrID0gdHJ1ZSkge1xuICAgIHN1cGVyKCdleHBlcmllbmNlJywgaGFzTmV0d29yayk7XG4gICAgLy8gaWYgdGhlIGV4cGVyaWVuY2UgaGFzIG5ldHdvcmssIHJlcXVpcmUgZXJyb3JSZXBvcnRlciBzZXJ2aWNlIGJ5IGRlZmF1bHRcbiAgICBpZiAoaGFzTmV0d29yaylcbiAgICAgIHRoaXMuX2Vycm9yUmVwb3J0ZXIgPSB0aGlzLnJlcXVpcmUoJ2Vycm9yLXJlcG9ydGVyJyk7XG4gIH1cblxuICAvKipcbiAgICogSW50ZXJmYWNlIG1ldGhvZCB0byBpbXBsZW1lbnQgaW4gZWFjaCBleHBlcmllbmNlLiBUaGlzIG1ldGhvZCBpcyBwYXJ0IG9mIHRoZVxuICAgKiBleHBlcmllbmNlIGxpZmVjeWNsZSBhbmQgc2hvdWxkIGJlIGNhbGxlZCB3aGVuXG4gICAqIFtgRXhwZXJpZW5jZSNzdGFydGBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5FeHBlcmllbmNlI3N0YXJ0fVxuICAgKiBpcyBjYWxsZWQgZm9yIHRoZSBmaXJzdCB0aW1lLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiAvLyBpbiBNeUV4cGVyaWVuY2Ujc3RhcnRcbiAgICogaWYgKHRoaXMuaGFzU3RhcnRlZClcbiAgICogICB0aGlzLmluaXQoKTtcbiAgICovXG4gIGluaXQoKSB7fVxuXG4gIGNyZWF0ZVZpZXcoKSB7XG4gICAgaWYgKHRoaXMudmlld09wdGlvbnMpIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHRoaXMudmlld09wdGlvbnMuY2xhc3NOYW1lKSlcbiAgICAgICAgdGhpcy52aWV3T3B0aW9ucy5jbGllbnRUeXBlLnB1c2goY2xpZW50LnR5cGUpO1xuICAgICAgZWxzZSBpZiAodHlwZW9mIHRoaXMudmlld09wdGlvbnMuY2xhc3NOYW1lID09PSAnc3RyaW5nJylcbiAgICAgICAgdGhpcy52aWV3T3B0aW9ucy5jbGFzc05hbWUgPSBbdGhpcy52aWV3T3B0aW9ucy5jbGFzc05hbWUsIGNsaWVudC50eXBlXTtcbiAgICAgIGVsc2VcbiAgICAgICAgdGhpcy52aWV3T3B0aW9ucy5jbGFzc05hbWUgPSBjbGllbnQudHlwZTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3VwZXIuY3JlYXRlVmlldygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBleHBlcmllbmNlLiBUaGlzIGxpZmVjeWNsZSBtZXRob2QgaXMgY2FsbGVkIHdoZW4gYWxsIHRoZVxuICAgKiByZXF1aXJlZCBzZXJ2aWNlcyBhcmUgYHJlYWR5YCBhbmQgdGh1cyB0aGUgZXhwZXJpZW5jZSBjYW4gYmVnaW4gd2l0aCBhbGxcbiAgICogdGhlIG5lY2Vzc2FyeSBpbmZvcm1hdGlvbnMgYW5kIHNlcnZpY2VzIHJlYWR5IHRvIGJlIGNvbnN1bWVkLlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICh0aGlzLmhhc05ldHdvcmspXG4gICAgICB0aGlzLnNlbmQoJ2VudGVyJyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgZG9uZSgpIHtcbiAgICBpZiAodGhpcy5oYXNOZXR3b3JrKVxuICAgICAgdGhpcy5zZW5kKCdleGl0Jyk7XG5cbiAgICBzdXBlci5kb25lKCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRXhwZXJpZW5jZTtcbiJdfQ==