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

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _Activity2 = require('./Activity');

var _Activity3 = _interopRequireDefault(_Activity2);

var _serviceManager = require('./serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

var _Signal = require('./Signal');

var _Signal2 = _interopRequireDefault(_Signal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @memberof module:soundworks/client
 * @extends module:soundworks/client.Activity
 */

var Scene = function (_Activity) {
  (0, _inherits3.default)(Scene, _Activity);

  function Scene(id, hasNetwork) {
    (0, _classCallCheck3.default)(this, Scene);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Scene).call(this, id, hasNetwork));

    _this.requiredSignals.addObserver(function (value) {
      if (value) {
        _this.start();
        _this.hasStarted = true;
      } /* else {
        this.hold(); // pause / resume
        } */
    });

    _this.signals.done = new _Signal2.default();
    _this.requiredSignals.add(_serviceManager2.default.signals.ready);
    return _this;
  }

  /**
   * Returns a service configured with the given options.
   * @param {String} id - The identifier of the service.
   * @param {Object} options - The options to configure the service.
   */


  (0, _createClass3.default)(Scene, [{
    key: 'require',
    value: function require(id, options) {
      return _serviceManager2.default.require(id, options);
    }

    /**
     * Add a signal to the required signals in order for the `Scene` instance
     * to start.
     * @param {Signal} signal - The signal that must be waited for.
     * @private
     */

  }, {
    key: 'waitFor',
    value: function waitFor(signal) {
      this.requiredSignals.add(signal);
    }

    /**
     * Mark the `Scene` as terminated. The call of this method is a
     * responsibility of the client code.
     * @private
     */

  }, {
    key: 'done',
    value: function done() {
      this.hide();
      this.signals.done.set(true);
    }
  }]);
  return Scene;
}(_Activity3.default);

exports.default = Scene;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNjZW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7OztJQU1NOzs7QUFDSixXQURJLEtBQ0osQ0FBWSxFQUFaLEVBQWdCLFVBQWhCLEVBQTRCO3dDQUR4QixPQUN3Qjs7NkZBRHhCLGtCQUVJLElBQUksYUFEZ0I7O0FBRzFCLFVBQUssZUFBTCxDQUFxQixXQUFyQixDQUFpQyxVQUFDLEtBQUQsRUFBVztBQUMxQyxVQUFJLEtBQUosRUFBVztBQUNULGNBQUssS0FBTCxHQURTO0FBRVQsY0FBSyxVQUFMLEdBQWtCLElBQWxCLENBRlM7T0FBWDs7O0FBRDBDLEtBQVgsQ0FBakMsQ0FIMEI7O0FBYTFCLFVBQUssT0FBTCxDQUFhLElBQWIsR0FBb0Isc0JBQXBCLENBYjBCO0FBYzFCLFVBQUssZUFBTCxDQUFxQixHQUFyQixDQUF5Qix5QkFBZSxPQUFmLENBQXVCLEtBQXZCLENBQXpCLENBZDBCOztHQUE1Qjs7Ozs7Ozs7OzZCQURJOzs0QkF1QkksSUFBSSxTQUFTO0FBQ25CLGFBQU8seUJBQWUsT0FBZixDQUF1QixFQUF2QixFQUEyQixPQUEzQixDQUFQLENBRG1COzs7Ozs7Ozs7Ozs7NEJBVWIsUUFBUTtBQUNkLFdBQUssZUFBTCxDQUFxQixHQUFyQixDQUF5QixNQUF6QixFQURjOzs7Ozs7Ozs7OzsyQkFTVDtBQUNMLFdBQUssSUFBTCxHQURLO0FBRUwsV0FBSyxPQUFMLENBQWEsSUFBYixDQUFrQixHQUFsQixDQUFzQixJQUF0QixFQUZLOzs7U0ExQ0g7OztrQkFnRFMiLCJmaWxlIjoiU2NlbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWN0aXZpdHkgZnJvbSAnLi9BY3Rpdml0eSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgU2lnbmFsIGZyb20gJy4vU2lnbmFsJztcblxuLyoqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAZXh0ZW5kcyBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWN0aXZpdHlcbiAqL1xuY2xhc3MgU2NlbmUgZXh0ZW5kcyBBY3Rpdml0eSB7XG4gIGNvbnN0cnVjdG9yKGlkLCBoYXNOZXR3b3JrKSB7XG4gICAgc3VwZXIoaWQsIGhhc05ldHdvcmspO1xuXG4gICAgdGhpcy5yZXF1aXJlZFNpZ25hbHMuYWRkT2JzZXJ2ZXIoKHZhbHVlKSA9PiB7XG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgICAgICB0aGlzLmhhc1N0YXJ0ZWQgPSB0cnVlO1xuICAgICAgfSAvKiBlbHNlIHtcbiAgICAgICAgdGhpcy5ob2xkKCk7IC8vIHBhdXNlIC8gcmVzdW1lXG4gICAgICB9ICovXG4gICAgfSk7XG5cblxuICAgIHRoaXMuc2lnbmFscy5kb25lID0gbmV3IFNpZ25hbCgpO1xuICAgIHRoaXMucmVxdWlyZWRTaWduYWxzLmFkZChzZXJ2aWNlTWFuYWdlci5zaWduYWxzLnJlYWR5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc2VydmljZSBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIFRoZSBpZGVudGlmaWVyIG9mIHRoZSBzZXJ2aWNlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFRoZSBvcHRpb25zIHRvIGNvbmZpZ3VyZSB0aGUgc2VydmljZS5cbiAgICovXG4gIHJlcXVpcmUoaWQsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gc2VydmljZU1hbmFnZXIucmVxdWlyZShpZCwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgc2lnbmFsIHRvIHRoZSByZXF1aXJlZCBzaWduYWxzIGluIG9yZGVyIGZvciB0aGUgYFNjZW5lYCBpbnN0YW5jZVxuICAgKiB0byBzdGFydC5cbiAgICogQHBhcmFtIHtTaWduYWx9IHNpZ25hbCAtIFRoZSBzaWduYWwgdGhhdCBtdXN0IGJlIHdhaXRlZCBmb3IuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICB3YWl0Rm9yKHNpZ25hbCkge1xuICAgIHRoaXMucmVxdWlyZWRTaWduYWxzLmFkZChzaWduYWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hcmsgdGhlIGBTY2VuZWAgYXMgdGVybWluYXRlZC4gVGhlIGNhbGwgb2YgdGhpcyBtZXRob2QgaXMgYVxuICAgKiByZXNwb25zaWJpbGl0eSBvZiB0aGUgY2xpZW50IGNvZGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkb25lKCkge1xuICAgIHRoaXMuaGlkZSgpO1xuICAgIHRoaXMuc2lnbmFscy5kb25lLnNldCh0cnVlKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTY2VuZTtcbiJdfQ==