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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV4cGVyaWVuY2UuanMiXSwibmFtZXMiOlsiRXhwZXJpZW5jZSIsImhhc05ldHdvcmsiLCJzdGFydCIsImJpbmQiLCJyZXF1aXJlZFNpZ25hbHMiLCJhZGRPYnNlcnZlciIsIndhaXRGb3IiLCJzZXJ2aWNlTWFuYWdlciIsInNpZ25hbHMiLCJyZWFkeSIsIl9lcnJvclJlcG9ydGVyIiwicmVxdWlyZSIsImlkIiwib3B0aW9ucyIsInNlbmQiLCJBY3Rpdml0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBR0E7Ozs7Ozs7OztJQVNNQSxVOzs7QUFDSjs7OztBQUlBLHdCQUErQjtBQUFBLFFBQW5CQyxVQUFtQix1RUFBTixJQUFNO0FBQUE7O0FBQUEsOElBQ3ZCLFlBRHVCLEVBQ1RBLFVBRFM7O0FBRzdCLFVBQUtDLEtBQUwsR0FBYSxNQUFLQSxLQUFMLENBQVdDLElBQVgsT0FBYjs7QUFFQSxVQUFLQyxlQUFMLENBQXFCQyxXQUFyQixDQUFpQyxNQUFLSCxLQUF0QztBQUNBLFVBQUtJLE9BQUwsQ0FBYUMseUJBQWVDLE9BQWYsQ0FBdUJDLEtBQXBDOztBQUVBO0FBQ0EsUUFBSVIsVUFBSixFQUNFLE1BQUtTLGNBQUwsR0FBc0IsTUFBS0MsT0FBTCxDQUFhLGdCQUFiLENBQXRCO0FBVjJCO0FBVzlCOztBQUVEOzs7Ozs7Ozs7NEJBS1FDLEUsRUFBSUMsTyxFQUFTO0FBQ25CLGFBQU9OLHlCQUFlSSxPQUFmLENBQXVCQyxFQUF2QixFQUEyQkMsT0FBM0IsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozs0QkFLUTtBQUNOOztBQUVBLFVBQUksS0FBS1osVUFBVCxFQUNFLEtBQUthLElBQUwsQ0FBVSxPQUFWO0FBQ0g7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7OztFQTdDdUJDLGtCOztrQkFnRFZmLFUiLCJmaWxlIjoiRXhwZXJpZW5jZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBY3Rpdml0eSBmcm9tICcuL0FjdGl2aXR5JztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuL3NlcnZpY2VNYW5hZ2VyJztcblxuXG4vKipcbiAqIEJhc2UgY2xhc3MgdG8gYmUgZXh0ZW5kZWQgaW4gb3JkZXIgdG8gY3JlYXRlIHRoZSBjbGllbnQtc2lkZSBvZiBhIGN1c3RvbVxuICogZXhwZXJpZW5jZS5cbiAqXG4gKiBUaGUgdXNlciBkZWZpbmVkIGBFeHBlcmllbmNlYCBpcyB0aGUgbWFpbiBjb21wb25lbnQgb2YgYSBzb3VuZHdvcmtzIGFwcGxpY2F0aW9uLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBleHRlbmRzIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BY3Rpdml0eVxuICovXG5jbGFzcyBFeHBlcmllbmNlIGV4dGVuZHMgQWN0aXZpdHkge1xuICAvKipcbiAgICogQHBhcmFtIHtCb29sZWFufSBbaGFzTmV0d29yaz10cnVlXSAtIERlZmluZSBpZiB0aGUgZXhwZXJpZW5jZSByZXF1aXJlcyBhXG4gICAqICBzb2NrZXQgY29ubmVjdGlvbi5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGhhc05ldHdvcmsgPSB0cnVlKSB7XG4gICAgc3VwZXIoJ2V4cGVyaWVuY2UnLCBoYXNOZXR3b3JrKTtcblxuICAgIHRoaXMuc3RhcnQgPSB0aGlzLnN0YXJ0LmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLnJlcXVpcmVkU2lnbmFscy5hZGRPYnNlcnZlcih0aGlzLnN0YXJ0KTtcbiAgICB0aGlzLndhaXRGb3Ioc2VydmljZU1hbmFnZXIuc2lnbmFscy5yZWFkeSk7XG5cbiAgICAvLyBpZiB0aGUgZXhwZXJpZW5jZSBoYXMgbmV0d29yaywgcmVxdWlyZSBlcnJvclJlcG9ydGVyIHNlcnZpY2UgYnkgZGVmYXVsdFxuICAgIGlmIChoYXNOZXR3b3JrKVxuICAgICAgdGhpcy5fZXJyb3JSZXBvcnRlciA9IHRoaXMucmVxdWlyZSgnZXJyb3ItcmVwb3J0ZXInKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc2VydmljZSBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIFRoZSBpZGVudGlmaWVyIG9mIHRoZSBzZXJ2aWNlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFRoZSBvcHRpb25zIHRvIGNvbmZpZ3VyZSB0aGUgc2VydmljZS5cbiAgICovXG4gIHJlcXVpcmUoaWQsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gc2VydmljZU1hbmFnZXIucmVxdWlyZShpZCwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgdGhlIGV4cGVyaWVuY2UuIFRoaXMgbGlmZWN5Y2xlIG1ldGhvZCBpcyBjYWxsZWQgd2hlbiBhbGwgdGhlXG4gICAqIHJlcXVpcmVkIHNlcnZpY2VzIGFyZSBgcmVhZHlgIGFuZCB0aHVzIHRoZSBleHBlcmllbmNlIGNhbiBiZWdpbiB3aXRoIGFsbFxuICAgKiB0aGUgbmVjZXNzYXJ5IGluZm9ybWF0aW9ucyBhbmQgc2VydmljZXMgcmVhZHkgdG8gYmUgY29uc3VtZWQuXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgaWYgKHRoaXMuaGFzTmV0d29yaylcbiAgICAgIHRoaXMuc2VuZCgnZW50ZXInKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICAvLyBkb25lKCkge1xuICAvLyAgIGlmICh0aGlzLmhhc05ldHdvcmspXG4gIC8vICAgICB0aGlzLnNlbmQoJ2V4aXQnKTtcblxuICAvLyAgIHN1cGVyLmRvbmUoKTtcbiAgLy8gfVxufVxuXG5leHBvcnQgZGVmYXVsdCBFeHBlcmllbmNlO1xuIl19