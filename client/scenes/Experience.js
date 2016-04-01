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
   * @param {Boolean} [hasNetwork=true] - Define if the experience needs a
   *  socket connection or not.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV4cGVyaWVuY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7SUFXTTs7Ozs7Ozs7QUFLSixXQUxJLFVBS0osR0FBK0I7UUFBbkIsbUVBQWEsb0JBQU07d0NBTDNCLFlBSzJCOzs7OzZGQUwzQix1QkFNSSxjQUFjLGFBRFM7O0FBRzdCLFFBQUksVUFBSixFQUNFLE1BQUssY0FBTCxHQUFzQixNQUFLLE9BQUwsQ0FBYSxnQkFBYixDQUF0QixDQURGO2lCQUg2QjtHQUEvQjs7Ozs7Ozs7Ozs7Ozs7OzZCQUxJOzsyQkF1Qkc7OztpQ0FFTTtBQUNYLFVBQUksS0FBSyxXQUFMLEVBQWtCO0FBQ3BCLFlBQUksTUFBTSxPQUFOLENBQWMsS0FBSyxXQUFMLENBQWlCLFNBQWpCLENBQWxCLEVBQ0UsS0FBSyxXQUFMLENBQWlCLFVBQWpCLENBQTRCLElBQTVCLENBQWlDLGlCQUFPLElBQVAsQ0FBakMsQ0FERixLQUVLLElBQUksT0FBTyxLQUFLLFdBQUwsQ0FBaUIsU0FBakIsS0FBK0IsUUFBdEMsRUFDUCxLQUFLLFdBQUwsQ0FBaUIsU0FBakIsR0FBNkIsQ0FBQyxLQUFLLFdBQUwsQ0FBaUIsU0FBakIsRUFBNEIsaUJBQU8sSUFBUCxDQUExRCxDQURHLEtBR0gsS0FBSyxXQUFMLENBQWlCLFNBQWpCLEdBQTZCLGlCQUFPLElBQVAsQ0FIMUI7T0FIUDs7QUFTQSw4REFuQ0UscURBbUNGLENBVlc7Ozs7Ozs7Ozs7OzRCQWtCTDtBQUNOLHVEQTVDRSxnREE0Q0YsQ0FETTs7QUFHTixVQUFJLEtBQUssVUFBTCxFQUNGLEtBQUssSUFBTCxDQUFVLE9BQVYsRUFERjs7Ozs7OzsyQkFLSztBQUNMLFVBQUksS0FBSyxVQUFMLEVBQ0YsS0FBSyxJQUFMLENBQVUsTUFBVixFQURGOztBQUdBLHVEQXZERSwrQ0F1REYsQ0FKSzs7O1NBbkRIOzs7a0JBMkRTIiwiZmlsZSI6IkV4cGVyaWVuY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2NlbmUgZnJvbSAnLi4vY29yZS9TY2VuZSc7XG5pbXBvcnQgU2lnbmFsIGZyb20gJy4uL2NvcmUvU2lnbmFsJztcbmltcG9ydCBTaWduYWxBbGwgZnJvbSAnLi4vY29yZS9TaWduYWxBbGwnO1xuaW1wb3J0IGNsaWVudCBmcm9tICcuLi9jb3JlL2NsaWVudCc7XG5cbi8qKlxuICogQmFzZSBjbGFzcyB0byBiZSBleHRlbmRlZCBpbiBvcmRlciB0byBjcmVhdGUgdGhlIGNsaWVudC1zaWRlIG9mIGEgY3VzdG9tXG4gKiBleHBlcmllbmNlLlxuICpcbiAqIFRoZSB1c2VyIGRlZmluZWQgYEV4cGVyaWVuY2VgIGlzIHRoZSBtYWluIGNvbXBvbmVudCBvZiBhIHNvdW5kd29ya3MgYXBwbGljYXRpb24uXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQGV4dGVuZHMgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlNjZW5lXG4gKi9cbmNsYXNzIEV4cGVyaWVuY2UgZXh0ZW5kcyBTY2VuZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtoYXNOZXR3b3JrPXRydWVdIC0gRGVmaW5lIGlmIHRoZSBleHBlcmllbmNlIG5lZWRzIGFcbiAgICogIHNvY2tldCBjb25uZWN0aW9uIG9yIG5vdC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGhhc05ldHdvcmsgPSB0cnVlKSB7XG4gICAgc3VwZXIoJ2V4cGVyaWVuY2UnLCBoYXNOZXR3b3JrKTtcbiAgICAvLyBpZiB0aGUgZXhwZXJpZW5jZSBoYXMgbmV0d29yaywgcmVxdWlyZSBlcnJvclJlcG9ydGVyIHNlcnZpY2UgYnkgZGVmYXVsdFxuICAgIGlmIChoYXNOZXR3b3JrKVxuICAgICAgdGhpcy5fZXJyb3JSZXBvcnRlciA9IHRoaXMucmVxdWlyZSgnZXJyb3ItcmVwb3J0ZXInKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnRlcmZhY2UgbWV0aG9kIHRvIGltcGxlbWVudCBpbiBlYWNoIGV4cGVyaWVuY2UuIFRoaXMgbWV0aG9kIGlzIHBhcnQgb2YgdGhlXG4gICAqIGV4cGVyaWVuY2UgbGlmZWN5Y2xlIGFuZCBzaG91bGQgYmUgY2FsbGVkIHdoZW5cbiAgICogW2BFeHBlcmllbmNlI3N0YXJ0YF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkV4cGVyaWVuY2Ujc3RhcnR9XG4gICAqIGlzIGNhbGxlZCBmb3IgdGhlIGZpcnN0IHRpbWUuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIC8vIGluIE15RXhwZXJpZW5jZSNzdGFydFxuICAgKiBpZiAodGhpcy5oYXNTdGFydGVkKVxuICAgKiAgIHRoaXMuaW5pdCgpO1xuICAgKi9cbiAgaW5pdCgpIHt9XG5cbiAgY3JlYXRlVmlldygpIHtcbiAgICBpZiAodGhpcy52aWV3T3B0aW9ucykge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy52aWV3T3B0aW9ucy5jbGFzc05hbWUpKVxuICAgICAgICB0aGlzLnZpZXdPcHRpb25zLmNsaWVudFR5cGUucHVzaChjbGllbnQudHlwZSk7XG4gICAgICBlbHNlIGlmICh0eXBlb2YgdGhpcy52aWV3T3B0aW9ucy5jbGFzc05hbWUgPT09ICdzdHJpbmcnKVxuICAgICAgICB0aGlzLnZpZXdPcHRpb25zLmNsYXNzTmFtZSA9IFt0aGlzLnZpZXdPcHRpb25zLmNsYXNzTmFtZSwgY2xpZW50LnR5cGVdO1xuICAgICAgZWxzZVxuICAgICAgICB0aGlzLnZpZXdPcHRpb25zLmNsYXNzTmFtZSA9IGNsaWVudC50eXBlO1xuICAgIH1cblxuICAgIHJldHVybiBzdXBlci5jcmVhdGVWaWV3KCk7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgdGhlIGV4cGVyaWVuY2UuIFRoaXMgbGlmZWN5Y2xlIG1ldGhvZCBpcyBjYWxsZWQgd2hlbiBhbGwgdGhlXG4gICAqIHJlcXVpcmVkIHNlcnZpY2VzIGFyZSBgcmVhZHlgIGFuZCB0aHVzIHRoZSBleHBlcmllbmNlIGNhbiBiZWdpbiB3aXRoIGFsbFxuICAgKiB0aGUgbmVjZXNzYXJ5IGluZm9ybWF0aW9ucyBhbmQgc2VydmljZXMgcmVhZHkgdG8gYmUgY29uc3VtZWQuXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgaWYgKHRoaXMuaGFzTmV0d29yaylcbiAgICAgIHRoaXMuc2VuZCgnZW50ZXInKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBkb25lKCkge1xuICAgIGlmICh0aGlzLmhhc05ldHdvcmspXG4gICAgICB0aGlzLnNlbmQoJ2V4aXQnKTtcblxuICAgIHN1cGVyLmRvbmUoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBFeHBlcmllbmNlO1xuIl19