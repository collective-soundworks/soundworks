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

var _ClientModule2 = require('./ClientModule');

var _ClientModule3 = _interopRequireDefault(_ClientModule2);

var _client = require('calibration/client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @todo - Revise entirelly, outdated.
 * @private
 */

var ClientCalibration = function (_ClientModule) {
  (0, _inherits3.default)(ClientCalibration, _ClientModule);

  /**
   * Function called when an update happened.
   *
   * See {@linkcode ClientCalibration~load}.
   *
   * @callback ClientCalibration~updateFunction
   **/

  /**
   * Constructor of the calibration client module.
   *
   * Note that {@linkcode ClientCalibration~start} method must be
   * called to restore a previous calibration.
   *
   * @constructs ClientCalibration
   * @param {Object} [params]
   * @param {String} [params.name='calibration'] name of module
   * @param {String} [params.color='black'] background
   * @param {ClientCalibration~updateFunction} [params.updateFunction]
   * Called whenever the calibration changed. First to complete the
   * start, by calling done, and then each time the calibration is
   * restored from the server, because this is asynchronous.
   */

  function ClientCalibration() {
    var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    (0, _classCallCheck3.default)(this, ClientCalibration);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ClientCalibration).call(this, params.name || 'calibration', true, params.color || 'black'));

    _this.ready = false;
    _this.started = false;

    // undefined is fine
    _this.updateFunction = params.updateFunction;

    _this.calibration = new _client2.default({
      sendFunction: _this.send,
      receiveFunction: _this.receive,
      updateFunction: function updateFunction() {
        _this._calibrationUpdated();
      }
    });

    _this.setCenteredViewContent('<p class="soft-blink">Calibration, stand by…</p>');
    return _this;
  }

  /**
   * Register the receive functions, and restore the calibration from
   * local storage, or from the server.
   *
   * @function ClientCalibration~start
   */


  (0, _createClass3.default)(ClientCalibration, [{
    key: 'start',
    value: function start() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(ClientCalibration.prototype), 'start', this).call(this);
      // load previous calibration on start.
      this.load();
      // done when actually loaded
    }

    /**
     * Save calibration locally, and on the server.
     *
     * @function ClientCalibration~save
     */

  }, {
    key: 'save',
    value: function save() {
      this.calibration.save();
    }

    /**
     * Load calibration locally, or from the server.
     *
     * The calibration is loaded from the server when no local
     * configuration is found. Note that loading from the server is
     * asynchronous. See {@linkcode ClientCalibration~updateFunction}
     * passed to the constructor.
     *
     * @function ClientCalibration~load
     */

  }, {
    key: 'load',
    value: function load() {
      this.calibration.load();
    }

    /**
     * Locally set the calibrated values.
     *
     * @function ClientCalibration~set
     * @param {calibration} params
     */

  }, {
    key: 'set',
    value: function set(params) {
      this.calibration.set(params);
    }

    /**
     * Locally get the calibrated values.
     *
     * Note that {@linkcode CalibrationClient~load} method must be
     * called to restore a previous calibration.
     *
     * @function ClientCalibration~get
     * @returns {calibration} or the empty object {} if no calibration
     * is available.
     */

  }, {
    key: 'get',
    value: function get() {
      return this.calibration.get();
    }
  }, {
    key: '_calibrationUpdated',
    value: function _calibrationUpdated() {
      if (!this.started) {
        this.started = true;
        this.done();
      }
      if (typeof this.updateFunction !== 'undefined') {
        this.updateFunction();
      }
    }
  }]);
  return ClientCalibration;
}(_ClientModule3.default);

exports.default = ClientCalibration;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNsaWVudENhbGlicmF0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7Ozs7Ozs7O0lBTXFCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF3Qm5CLFdBeEJtQixpQkF3Qm5CLEdBQXlCO1FBQWIsK0RBQVMsa0JBQUk7d0NBeEJOLG1CQXdCTTs7NkZBeEJOLDhCQXlCWCxPQUFPLElBQVAsSUFBZSxhQUFmLEVBQThCLE1BQU0sT0FBTyxLQUFQLElBQWdCLE9BQWhCLEdBRG5COztBQUd2QixVQUFLLEtBQUwsR0FBYSxLQUFiLENBSHVCO0FBSXZCLFVBQUssT0FBTCxHQUFlLEtBQWY7OztBQUp1QixTQU92QixDQUFLLGNBQUwsR0FBc0IsT0FBTyxjQUFQLENBUEM7O0FBU3ZCLFVBQUssV0FBTCxHQUFtQixxQkFBc0I7QUFDdkMsb0JBQWMsTUFBSyxJQUFMO0FBQ2QsdUJBQWlCLE1BQUssT0FBTDtBQUNqQixzQkFBZ0IsMEJBQU07QUFBRSxjQUFLLG1CQUFMLEdBQUY7T0FBTjtLQUhDLENBQW5CLENBVHVCOztBQWV2QixVQUFLLHNCQUFMLENBQTRCLGtEQUE1QixFQWZ1Qjs7R0FBekI7Ozs7Ozs7Ozs7NkJBeEJtQjs7NEJBZ0RYO0FBQ04sdURBakRpQix1REFpRGpCOztBQURNLFVBR04sQ0FBSyxJQUFMOztBQUhNOzs7Ozs7Ozs7OzJCQVlEO0FBQ0wsV0FBSyxXQUFMLENBQWlCLElBQWpCLEdBREs7Ozs7Ozs7Ozs7Ozs7Ozs7MkJBY0E7QUFDTCxXQUFLLFdBQUwsQ0FBaUIsSUFBakIsR0FESzs7Ozs7Ozs7Ozs7O3dCQVVILFFBQVE7QUFDVixXQUFLLFdBQUwsQ0FBaUIsR0FBakIsQ0FBcUIsTUFBckIsRUFEVTs7Ozs7Ozs7Ozs7Ozs7OzswQkFjTjtBQUNKLGFBQU8sS0FBSyxXQUFMLENBQWlCLEdBQWpCLEVBQVAsQ0FESTs7OzswQ0FJZ0I7QUFDcEIsVUFBSSxDQUFDLEtBQUssT0FBTCxFQUFjO0FBQ2pCLGFBQUssT0FBTCxHQUFlLElBQWYsQ0FEaUI7QUFFakIsYUFBSyxJQUFMLEdBRmlCO09BQW5CO0FBSUEsVUFBSSxPQUFPLEtBQUssY0FBTCxLQUF3QixXQUEvQixFQUE0QztBQUM5QyxhQUFLLGNBQUwsR0FEOEM7T0FBaEQ7OztTQTNHaUIiLCJmaWxlIjoiQ2xpZW50Q2FsaWJyYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ2xpZW50TW9kdWxlIGZyb20gJy4vQ2xpZW50TW9kdWxlJztcbmltcG9ydCBDYWxpYnJhdGlvbkNsaWVudCBmcm9tICdjYWxpYnJhdGlvbi9jbGllbnQnO1xuXG4vKipcbiAqIEB0b2RvIC0gUmV2aXNlIGVudGlyZWxseSwgb3V0ZGF0ZWQuXG4gKiBAcHJpdmF0ZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnRDYWxpYnJhdGlvbiBleHRlbmRzIENsaWVudE1vZHVsZSB7XG4gIC8qKlxuICAgKiBGdW5jdGlvbiBjYWxsZWQgd2hlbiBhbiB1cGRhdGUgaGFwcGVuZWQuXG4gICAqXG4gICAqIFNlZSB7QGxpbmtjb2RlIENsaWVudENhbGlicmF0aW9ufmxvYWR9LlxuICAgKlxuICAgKiBAY2FsbGJhY2sgQ2xpZW50Q2FsaWJyYXRpb25+dXBkYXRlRnVuY3Rpb25cbiAgICoqL1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBvZiB0aGUgY2FsaWJyYXRpb24gY2xpZW50IG1vZHVsZS5cbiAgICpcbiAgICogTm90ZSB0aGF0IHtAbGlua2NvZGUgQ2xpZW50Q2FsaWJyYXRpb25+c3RhcnR9IG1ldGhvZCBtdXN0IGJlXG4gICAqIGNhbGxlZCB0byByZXN0b3JlIGEgcHJldmlvdXMgY2FsaWJyYXRpb24uXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RzIENsaWVudENhbGlicmF0aW9uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbcGFyYW1zXVxuICAgKiBAcGFyYW0ge1N0cmluZ30gW3BhcmFtcy5uYW1lPSdjYWxpYnJhdGlvbiddIG5hbWUgb2YgbW9kdWxlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbcGFyYW1zLmNvbG9yPSdibGFjayddIGJhY2tncm91bmRcbiAgICogQHBhcmFtIHtDbGllbnRDYWxpYnJhdGlvbn51cGRhdGVGdW5jdGlvbn0gW3BhcmFtcy51cGRhdGVGdW5jdGlvbl1cbiAgICogQ2FsbGVkIHdoZW5ldmVyIHRoZSBjYWxpYnJhdGlvbiBjaGFuZ2VkLiBGaXJzdCB0byBjb21wbGV0ZSB0aGVcbiAgICogc3RhcnQsIGJ5IGNhbGxpbmcgZG9uZSwgYW5kIHRoZW4gZWFjaCB0aW1lIHRoZSBjYWxpYnJhdGlvbiBpc1xuICAgKiByZXN0b3JlZCBmcm9tIHRoZSBzZXJ2ZXIsIGJlY2F1c2UgdGhpcyBpcyBhc3luY2hyb25vdXMuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwYXJhbXMgPSB7fSkge1xuICAgIHN1cGVyKHBhcmFtcy5uYW1lIHx8ICdjYWxpYnJhdGlvbicsIHRydWUsIHBhcmFtcy5jb2xvciB8fCAnYmxhY2snKTtcblxuICAgIHRoaXMucmVhZHkgPSBmYWxzZTtcbiAgICB0aGlzLnN0YXJ0ZWQgPSBmYWxzZTtcblxuICAgIC8vIHVuZGVmaW5lZCBpcyBmaW5lXG4gICAgdGhpcy51cGRhdGVGdW5jdGlvbiA9IHBhcmFtcy51cGRhdGVGdW5jdGlvbjtcblxuICAgIHRoaXMuY2FsaWJyYXRpb24gPSBuZXcgQ2FsaWJyYXRpb25DbGllbnQoe1xuICAgICAgc2VuZEZ1bmN0aW9uOiB0aGlzLnNlbmQsXG4gICAgICByZWNlaXZlRnVuY3Rpb246IHRoaXMucmVjZWl2ZSxcbiAgICAgIHVwZGF0ZUZ1bmN0aW9uOiAoKSA9PiB7IHRoaXMuX2NhbGlicmF0aW9uVXBkYXRlZCgpOyB9XG4gICAgfSk7XG5cbiAgICB0aGlzLnNldENlbnRlcmVkVmlld0NvbnRlbnQoJzxwIGNsYXNzPVwic29mdC1ibGlua1wiPkNhbGlicmF0aW9uLCBzdGFuZCBieeKApjwvcD4nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciB0aGUgcmVjZWl2ZSBmdW5jdGlvbnMsIGFuZCByZXN0b3JlIHRoZSBjYWxpYnJhdGlvbiBmcm9tXG4gICAqIGxvY2FsIHN0b3JhZ2UsIG9yIGZyb20gdGhlIHNlcnZlci5cbiAgICpcbiAgICogQGZ1bmN0aW9uIENsaWVudENhbGlicmF0aW9ufnN0YXJ0XG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuICAgIC8vIGxvYWQgcHJldmlvdXMgY2FsaWJyYXRpb24gb24gc3RhcnQuXG4gICAgdGhpcy5sb2FkKCk7XG4gICAgLy8gZG9uZSB3aGVuIGFjdHVhbGx5IGxvYWRlZFxuICB9XG5cbiAgLyoqXG4gICAqIFNhdmUgY2FsaWJyYXRpb24gbG9jYWxseSwgYW5kIG9uIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEBmdW5jdGlvbiBDbGllbnRDYWxpYnJhdGlvbn5zYXZlXG4gICAqL1xuICBzYXZlKCkge1xuICAgIHRoaXMuY2FsaWJyYXRpb24uc2F2ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWQgY2FsaWJyYXRpb24gbG9jYWxseSwgb3IgZnJvbSB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBUaGUgY2FsaWJyYXRpb24gaXMgbG9hZGVkIGZyb20gdGhlIHNlcnZlciB3aGVuIG5vIGxvY2FsXG4gICAqIGNvbmZpZ3VyYXRpb24gaXMgZm91bmQuIE5vdGUgdGhhdCBsb2FkaW5nIGZyb20gdGhlIHNlcnZlciBpc1xuICAgKiBhc3luY2hyb25vdXMuIFNlZSB7QGxpbmtjb2RlIENsaWVudENhbGlicmF0aW9ufnVwZGF0ZUZ1bmN0aW9ufVxuICAgKiBwYXNzZWQgdG8gdGhlIGNvbnN0cnVjdG9yLlxuICAgKlxuICAgKiBAZnVuY3Rpb24gQ2xpZW50Q2FsaWJyYXRpb25+bG9hZFxuICAgKi9cbiAgbG9hZCgpIHtcbiAgICB0aGlzLmNhbGlicmF0aW9uLmxvYWQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2NhbGx5IHNldCB0aGUgY2FsaWJyYXRlZCB2YWx1ZXMuXG4gICAqXG4gICAqIEBmdW5jdGlvbiBDbGllbnRDYWxpYnJhdGlvbn5zZXRcbiAgICogQHBhcmFtIHtjYWxpYnJhdGlvbn0gcGFyYW1zXG4gICAqL1xuICBzZXQocGFyYW1zKSB7XG4gICAgdGhpcy5jYWxpYnJhdGlvbi5zZXQocGFyYW1zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2NhbGx5IGdldCB0aGUgY2FsaWJyYXRlZCB2YWx1ZXMuXG4gICAqXG4gICAqIE5vdGUgdGhhdCB7QGxpbmtjb2RlIENhbGlicmF0aW9uQ2xpZW50fmxvYWR9IG1ldGhvZCBtdXN0IGJlXG4gICAqIGNhbGxlZCB0byByZXN0b3JlIGEgcHJldmlvdXMgY2FsaWJyYXRpb24uXG4gICAqXG4gICAqIEBmdW5jdGlvbiBDbGllbnRDYWxpYnJhdGlvbn5nZXRcbiAgICogQHJldHVybnMge2NhbGlicmF0aW9ufSBvciB0aGUgZW1wdHkgb2JqZWN0IHt9IGlmIG5vIGNhbGlicmF0aW9uXG4gICAqIGlzIGF2YWlsYWJsZS5cbiAgICovXG4gIGdldCgpIHtcbiAgICByZXR1cm4gdGhpcy5jYWxpYnJhdGlvbi5nZXQoKTtcbiAgfVxuXG4gIF9jYWxpYnJhdGlvblVwZGF0ZWQoKSB7XG4gICAgaWYgKCF0aGlzLnN0YXJ0ZWQpIHtcbiAgICAgIHRoaXMuc3RhcnRlZCA9IHRydWU7XG4gICAgICB0aGlzLmRvbmUoKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB0aGlzLnVwZGF0ZUZ1bmN0aW9uICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhpcy51cGRhdGVGdW5jdGlvbigpO1xuICAgIH1cbiAgfVxufVxuIl19