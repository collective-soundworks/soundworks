'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _ClientModule2 = require('./ClientModule');

var _ClientModule3 = _interopRequireDefault(_ClientModule2);

var _calibrationClient = require('calibration/client');

var _calibrationClient2 = _interopRequireDefault(_calibrationClient);

/**
 * @todo - Revise entirelly, outdated.
 * @private
 */

var ClientCalibration = (function (_ClientModule) {
  _inherits(ClientCalibration, _ClientModule);

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
    var _this = this;

    var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ClientCalibration);

    _get(Object.getPrototypeOf(ClientCalibration.prototype), 'constructor', this).call(this, params.name || 'calibration', true, params.color || 'black');

    this.ready = false;
    this.started = false;

    // undefined is fine
    this.updateFunction = params.updateFunction;

    this.calibration = new _calibrationClient2['default']({
      sendFunction: this.send,
      receiveFunction: this.receive,
      updateFunction: function updateFunction() {
        _this._calibrationUpdated();
      }
    });

    this.setCenteredViewContent('<p class="soft-blink">Calibration, stand by…</p>');
  }

  /**
   * Register the receive functions, and restore the calibration from
   * local storage, or from the server.
   *
   * @function ClientCalibration~start
   */

  _createClass(ClientCalibration, [{
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(ClientCalibration.prototype), 'start', this).call(this);
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
})(_ClientModule3['default']);

exports['default'] = ClientCalibration;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50Q2FsaWJyYXRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs2QkFBeUIsZ0JBQWdCOzs7O2lDQUNYLG9CQUFvQjs7Ozs7Ozs7O0lBTTdCLGlCQUFpQjtZQUFqQixpQkFBaUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBd0J6QixXQXhCUSxpQkFBaUIsR0F3Qlg7OztRQUFiLE1BQU0seURBQUcsRUFBRTs7MEJBeEJKLGlCQUFpQjs7QUF5QmxDLCtCQXpCaUIsaUJBQWlCLDZDQXlCNUIsTUFBTSxDQUFDLElBQUksSUFBSSxhQUFhLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxLQUFLLElBQUksT0FBTyxFQUFFOztBQUVuRSxRQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNuQixRQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQzs7O0FBR3JCLFFBQUksQ0FBQyxjQUFjLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQzs7QUFFNUMsUUFBSSxDQUFDLFdBQVcsR0FBRyxtQ0FBc0I7QUFDdkMsa0JBQVksRUFBRSxJQUFJLENBQUMsSUFBSTtBQUN2QixxQkFBZSxFQUFFLElBQUksQ0FBQyxPQUFPO0FBQzdCLG9CQUFjLEVBQUUsMEJBQU07QUFBRSxjQUFLLG1CQUFtQixFQUFFLENBQUM7T0FBRTtLQUN0RCxDQUFDLENBQUM7O0FBRUgsUUFBSSxDQUFDLHNCQUFzQixDQUFDLGtEQUFrRCxDQUFDLENBQUM7R0FDakY7Ozs7Ozs7OztlQXhDa0IsaUJBQWlCOztXQWdEL0IsaUJBQUc7QUFDTixpQ0FqRGlCLGlCQUFpQix1Q0FpRHBCOztBQUVkLFVBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7S0FFYjs7Ozs7Ozs7O1dBT0csZ0JBQUc7QUFDTCxVQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ3pCOzs7Ozs7Ozs7Ozs7OztXQVlHLGdCQUFHO0FBQ0wsVUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUN6Qjs7Ozs7Ozs7OztXQVFFLGFBQUMsTUFBTSxFQUFFO0FBQ1YsVUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDOUI7Ozs7Ozs7Ozs7Ozs7O1dBWUUsZUFBRztBQUNKLGFBQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztLQUMvQjs7O1dBRWtCLCtCQUFHO0FBQ3BCLFVBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQ2pCLFlBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQ3BCLFlBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztPQUNiO0FBQ0QsVUFBSSxPQUFPLElBQUksQ0FBQyxjQUFjLEtBQUssV0FBVyxFQUFFO0FBQzlDLFlBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztPQUN2QjtLQUNGOzs7U0E5R2tCLGlCQUFpQjs7O3FCQUFqQixpQkFBaUIiLCJmaWxlIjoic3JjL2NsaWVudC9DbGllbnRDYWxpYnJhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDbGllbnRNb2R1bGUgZnJvbSAnLi9DbGllbnRNb2R1bGUnO1xuaW1wb3J0IENhbGlicmF0aW9uQ2xpZW50IGZyb20gJ2NhbGlicmF0aW9uL2NsaWVudCc7XG5cbi8qKlxuICogQHRvZG8gLSBSZXZpc2UgZW50aXJlbGx5LCBvdXRkYXRlZC5cbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudENhbGlicmF0aW9uIGV4dGVuZHMgQ2xpZW50TW9kdWxlIHtcbiAgLyoqXG4gICAqIEZ1bmN0aW9uIGNhbGxlZCB3aGVuIGFuIHVwZGF0ZSBoYXBwZW5lZC5cbiAgICpcbiAgICogU2VlIHtAbGlua2NvZGUgQ2xpZW50Q2FsaWJyYXRpb25+bG9hZH0uXG4gICAqXG4gICAqIEBjYWxsYmFjayBDbGllbnRDYWxpYnJhdGlvbn51cGRhdGVGdW5jdGlvblxuICAgKiovXG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIG9mIHRoZSBjYWxpYnJhdGlvbiBjbGllbnQgbW9kdWxlLlxuICAgKlxuICAgKiBOb3RlIHRoYXQge0BsaW5rY29kZSBDbGllbnRDYWxpYnJhdGlvbn5zdGFydH0gbWV0aG9kIG11c3QgYmVcbiAgICogY2FsbGVkIHRvIHJlc3RvcmUgYSBwcmV2aW91cyBjYWxpYnJhdGlvbi5cbiAgICpcbiAgICogQGNvbnN0cnVjdHMgQ2xpZW50Q2FsaWJyYXRpb25cbiAgICogQHBhcmFtIHtPYmplY3R9IFtwYXJhbXNdXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbcGFyYW1zLm5hbWU9J2NhbGlicmF0aW9uJ10gbmFtZSBvZiBtb2R1bGVcbiAgICogQHBhcmFtIHtTdHJpbmd9IFtwYXJhbXMuY29sb3I9J2JsYWNrJ10gYmFja2dyb3VuZFxuICAgKiBAcGFyYW0ge0NsaWVudENhbGlicmF0aW9ufnVwZGF0ZUZ1bmN0aW9ufSBbcGFyYW1zLnVwZGF0ZUZ1bmN0aW9uXVxuICAgKiBDYWxsZWQgd2hlbmV2ZXIgdGhlIGNhbGlicmF0aW9uIGNoYW5nZWQuIEZpcnN0IHRvIGNvbXBsZXRlIHRoZVxuICAgKiBzdGFydCwgYnkgY2FsbGluZyBkb25lLCBhbmQgdGhlbiBlYWNoIHRpbWUgdGhlIGNhbGlicmF0aW9uIGlzXG4gICAqIHJlc3RvcmVkIGZyb20gdGhlIHNlcnZlciwgYmVjYXVzZSB0aGlzIGlzIGFzeW5jaHJvbm91cy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHBhcmFtcyA9IHt9KSB7XG4gICAgc3VwZXIocGFyYW1zLm5hbWUgfHwgJ2NhbGlicmF0aW9uJywgdHJ1ZSwgcGFyYW1zLmNvbG9yIHx8ICdibGFjaycpO1xuXG4gICAgdGhpcy5yZWFkeSA9IGZhbHNlO1xuICAgIHRoaXMuc3RhcnRlZCA9IGZhbHNlO1xuXG4gICAgLy8gdW5kZWZpbmVkIGlzIGZpbmVcbiAgICB0aGlzLnVwZGF0ZUZ1bmN0aW9uID0gcGFyYW1zLnVwZGF0ZUZ1bmN0aW9uO1xuXG4gICAgdGhpcy5jYWxpYnJhdGlvbiA9IG5ldyBDYWxpYnJhdGlvbkNsaWVudCh7XG4gICAgICBzZW5kRnVuY3Rpb246IHRoaXMuc2VuZCxcbiAgICAgIHJlY2VpdmVGdW5jdGlvbjogdGhpcy5yZWNlaXZlLFxuICAgICAgdXBkYXRlRnVuY3Rpb246ICgpID0+IHsgdGhpcy5fY2FsaWJyYXRpb25VcGRhdGVkKCk7IH1cbiAgICB9KTtcblxuICAgIHRoaXMuc2V0Q2VudGVyZWRWaWV3Q29udGVudCgnPHAgY2xhc3M9XCJzb2Z0LWJsaW5rXCI+Q2FsaWJyYXRpb24sIHN0YW5kIGJ54oCmPC9wPicpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIHRoZSByZWNlaXZlIGZ1bmN0aW9ucywgYW5kIHJlc3RvcmUgdGhlIGNhbGlicmF0aW9uIGZyb21cbiAgICogbG9jYWwgc3RvcmFnZSwgb3IgZnJvbSB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBAZnVuY3Rpb24gQ2xpZW50Q2FsaWJyYXRpb25+c3RhcnRcbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG4gICAgLy8gbG9hZCBwcmV2aW91cyBjYWxpYnJhdGlvbiBvbiBzdGFydC5cbiAgICB0aGlzLmxvYWQoKTtcbiAgICAvLyBkb25lIHdoZW4gYWN0dWFsbHkgbG9hZGVkXG4gIH1cblxuICAvKipcbiAgICogU2F2ZSBjYWxpYnJhdGlvbiBsb2NhbGx5LCBhbmQgb24gdGhlIHNlcnZlci5cbiAgICpcbiAgICogQGZ1bmN0aW9uIENsaWVudENhbGlicmF0aW9ufnNhdmVcbiAgICovXG4gIHNhdmUoKSB7XG4gICAgdGhpcy5jYWxpYnJhdGlvbi5zYXZlKCk7XG4gIH1cblxuICAvKipcbiAgICogTG9hZCBjYWxpYnJhdGlvbiBsb2NhbGx5LCBvciBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIFRoZSBjYWxpYnJhdGlvbiBpcyBsb2FkZWQgZnJvbSB0aGUgc2VydmVyIHdoZW4gbm8gbG9jYWxcbiAgICogY29uZmlndXJhdGlvbiBpcyBmb3VuZC4gTm90ZSB0aGF0IGxvYWRpbmcgZnJvbSB0aGUgc2VydmVyIGlzXG4gICAqIGFzeW5jaHJvbm91cy4gU2VlIHtAbGlua2NvZGUgQ2xpZW50Q2FsaWJyYXRpb25+dXBkYXRlRnVuY3Rpb259XG4gICAqIHBhc3NlZCB0byB0aGUgY29uc3RydWN0b3IuXG4gICAqXG4gICAqIEBmdW5jdGlvbiBDbGllbnRDYWxpYnJhdGlvbn5sb2FkXG4gICAqL1xuICBsb2FkKCkge1xuICAgIHRoaXMuY2FsaWJyYXRpb24ubG9hZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIExvY2FsbHkgc2V0IHRoZSBjYWxpYnJhdGVkIHZhbHVlcy5cbiAgICpcbiAgICogQGZ1bmN0aW9uIENsaWVudENhbGlicmF0aW9ufnNldFxuICAgKiBAcGFyYW0ge2NhbGlicmF0aW9ufSBwYXJhbXNcbiAgICovXG4gIHNldChwYXJhbXMpIHtcbiAgICB0aGlzLmNhbGlicmF0aW9uLnNldChwYXJhbXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIExvY2FsbHkgZ2V0IHRoZSBjYWxpYnJhdGVkIHZhbHVlcy5cbiAgICpcbiAgICogTm90ZSB0aGF0IHtAbGlua2NvZGUgQ2FsaWJyYXRpb25DbGllbnR+bG9hZH0gbWV0aG9kIG11c3QgYmVcbiAgICogY2FsbGVkIHRvIHJlc3RvcmUgYSBwcmV2aW91cyBjYWxpYnJhdGlvbi5cbiAgICpcbiAgICogQGZ1bmN0aW9uIENsaWVudENhbGlicmF0aW9ufmdldFxuICAgKiBAcmV0dXJucyB7Y2FsaWJyYXRpb259IG9yIHRoZSBlbXB0eSBvYmplY3Qge30gaWYgbm8gY2FsaWJyYXRpb25cbiAgICogaXMgYXZhaWxhYmxlLlxuICAgKi9cbiAgZ2V0KCkge1xuICAgIHJldHVybiB0aGlzLmNhbGlicmF0aW9uLmdldCgpO1xuICB9XG5cbiAgX2NhbGlicmF0aW9uVXBkYXRlZCgpIHtcbiAgICBpZiAoIXRoaXMuc3RhcnRlZCkge1xuICAgICAgdGhpcy5zdGFydGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuZG9uZSgpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHRoaXMudXBkYXRlRnVuY3Rpb24gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzLnVwZGF0ZUZ1bmN0aW9uKCk7XG4gICAgfVxuICB9XG59XG4iXX0=