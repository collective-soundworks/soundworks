'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _Module2 = require('./Module');

var _Module3 = _interopRequireDefault(_Module2);

var _calibrationClient = require('calibration/client');

var _calibrationClient2 = _interopRequireDefault(_calibrationClient);

/**
 * @private
 */

var ClientCalibration = (function (_Module) {
  _inherits(ClientCalibration, _Module);

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

    _classCallCheck(this, ClientCalibration);

    _get(Object.getPrototypeOf(ClientCalibration.prototype), 'constructor', this).call(this, params.name || 'calibration', true, params.color || 'black');
    var that = this;

    this.ready = false;
    this.started = false;

    // undefined is fine
    this.updateFunction = params.updateFunction;

    this.calibration = new _calibrationClient2['default']({
      sendFunction: _client2['default'].send,
      receiveFunction: _client2['default'].receive,
      updateFunction: function updateFunction() {
        that._calibrationUpdated();
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
})(_Module3['default']);

exports['default'] = ClientCalibration;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50Q2FsaWJyYXRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztzQkFBbUIsVUFBVTs7Ozt1QkFDVixVQUFVOzs7O2lDQUNDLG9CQUFvQjs7Ozs7Ozs7SUFLN0IsaUJBQWlCO1lBQWpCLGlCQUFpQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF3QnpCLFdBeEJRLGlCQUFpQixHQXdCWDtRQUFiLE1BQU0seURBQUcsRUFBRTs7MEJBeEJKLGlCQUFpQjs7QUF5QmxDLCtCQXpCaUIsaUJBQWlCLDZDQXlCNUIsTUFBTSxDQUFDLElBQUksSUFBSSxhQUFhLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxLQUFLLElBQUksT0FBTyxFQUFFO0FBQ25FLFFBQU0sSUFBSSxHQUFHLElBQUksQ0FBQzs7QUFFbEIsUUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDbkIsUUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7OztBQUdyQixRQUFJLENBQUMsY0FBYyxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUM7O0FBRTVDLFFBQUksQ0FBQyxXQUFXLEdBQUcsbUNBQXNCO0FBQ3ZDLGtCQUFZLEVBQUUsb0JBQU8sSUFBSTtBQUN6QixxQkFBZSxFQUFFLG9CQUFPLE9BQU87QUFDL0Isb0JBQWMsRUFBRSwwQkFBTTtBQUFFLFlBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO09BQUU7S0FDdEQsQ0FBQyxDQUFDOztBQUVILFFBQUksQ0FBQyxzQkFBc0IsQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO0dBQ2pGOzs7Ozs7Ozs7ZUF6Q2tCLGlCQUFpQjs7V0FpRC9CLGlCQUFHO0FBQ04saUNBbERpQixpQkFBaUIsdUNBa0RwQjs7QUFFZCxVQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7O0tBRWI7Ozs7Ozs7OztXQU9HLGdCQUFHO0FBQ0wsVUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUN6Qjs7Ozs7Ozs7Ozs7Ozs7V0FZRyxnQkFBRztBQUNMLFVBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDekI7Ozs7Ozs7Ozs7V0FRRSxhQUFDLE1BQU0sRUFBRTtBQUNWLFVBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQzlCOzs7Ozs7Ozs7Ozs7OztXQVlFLGVBQUc7QUFDSixhQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUM7S0FDL0I7OztXQUVrQiwrQkFBRztBQUNwQixVQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNoQixZQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztBQUNwQixZQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7T0FDYjtBQUNELFVBQUcsT0FBTyxJQUFJLENBQUMsY0FBYyxLQUFLLFdBQVcsRUFBRTtBQUM3QyxZQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7T0FDdkI7S0FDRjs7O1NBL0drQixpQkFBaUI7OztxQkFBakIsaUJBQWlCIiwiZmlsZSI6InNyYy9jbGllbnQvQ2xpZW50Q2FsaWJyYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCBNb2R1bGUgZnJvbSAnLi9Nb2R1bGUnO1xuaW1wb3J0IENhbGlicmF0aW9uQ2xpZW50IGZyb20gJ2NhbGlicmF0aW9uL2NsaWVudCc7XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50Q2FsaWJyYXRpb24gZXh0ZW5kcyBNb2R1bGUge1xuICAvKipcbiAgICogRnVuY3Rpb24gY2FsbGVkIHdoZW4gYW4gdXBkYXRlIGhhcHBlbmVkLlxuICAgKlxuICAgKiBTZWUge0BsaW5rY29kZSBDbGllbnRDYWxpYnJhdGlvbn5sb2FkfS5cbiAgICpcbiAgICogQGNhbGxiYWNrIENsaWVudENhbGlicmF0aW9ufnVwZGF0ZUZ1bmN0aW9uXG4gICAqKi9cblxuICAvKipcbiAgICogQ29uc3RydWN0b3Igb2YgdGhlIGNhbGlicmF0aW9uIGNsaWVudCBtb2R1bGUuXG4gICAqXG4gICAqIE5vdGUgdGhhdCB7QGxpbmtjb2RlIENsaWVudENhbGlicmF0aW9ufnN0YXJ0fSBtZXRob2QgbXVzdCBiZVxuICAgKiBjYWxsZWQgdG8gcmVzdG9yZSBhIHByZXZpb3VzIGNhbGlicmF0aW9uLlxuICAgKlxuICAgKiBAY29uc3RydWN0cyBDbGllbnRDYWxpYnJhdGlvblxuICAgKiBAcGFyYW0ge09iamVjdH0gW3BhcmFtc11cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtwYXJhbXMubmFtZT0nY2FsaWJyYXRpb24nXSBuYW1lIG9mIG1vZHVsZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gW3BhcmFtcy5jb2xvcj0nYmxhY2snXSBiYWNrZ3JvdW5kXG4gICAqIEBwYXJhbSB7Q2xpZW50Q2FsaWJyYXRpb25+dXBkYXRlRnVuY3Rpb259IFtwYXJhbXMudXBkYXRlRnVuY3Rpb25dXG4gICAqIENhbGxlZCB3aGVuZXZlciB0aGUgY2FsaWJyYXRpb24gY2hhbmdlZC4gRmlyc3QgdG8gY29tcGxldGUgdGhlXG4gICAqIHN0YXJ0LCBieSBjYWxsaW5nIGRvbmUsIGFuZCB0aGVuIGVhY2ggdGltZSB0aGUgY2FsaWJyYXRpb24gaXNcbiAgICogcmVzdG9yZWQgZnJvbSB0aGUgc2VydmVyLCBiZWNhdXNlIHRoaXMgaXMgYXN5bmNocm9ub3VzLlxuICAgKi9cbiAgY29uc3RydWN0b3IocGFyYW1zID0ge30pIHtcbiAgICBzdXBlcihwYXJhbXMubmFtZSB8fCAnY2FsaWJyYXRpb24nLCB0cnVlLCBwYXJhbXMuY29sb3IgfHwgJ2JsYWNrJyk7XG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XG5cbiAgICB0aGlzLnJlYWR5ID0gZmFsc2U7XG4gICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XG5cbiAgICAvLyB1bmRlZmluZWQgaXMgZmluZVxuICAgIHRoaXMudXBkYXRlRnVuY3Rpb24gPSBwYXJhbXMudXBkYXRlRnVuY3Rpb247XG5cbiAgICB0aGlzLmNhbGlicmF0aW9uID0gbmV3IENhbGlicmF0aW9uQ2xpZW50KHtcbiAgICAgIHNlbmRGdW5jdGlvbjogY2xpZW50LnNlbmQsXG4gICAgICByZWNlaXZlRnVuY3Rpb246IGNsaWVudC5yZWNlaXZlLFxuICAgICAgdXBkYXRlRnVuY3Rpb246ICgpID0+IHsgdGhhdC5fY2FsaWJyYXRpb25VcGRhdGVkKCk7IH1cbiAgICB9KTtcblxuICAgIHRoaXMuc2V0Q2VudGVyZWRWaWV3Q29udGVudCgnPHAgY2xhc3M9XCJzb2Z0LWJsaW5rXCI+Q2FsaWJyYXRpb24sIHN0YW5kIGJ54oCmPC9wPicpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIHRoZSByZWNlaXZlIGZ1bmN0aW9ucywgYW5kIHJlc3RvcmUgdGhlIGNhbGlicmF0aW9uIGZyb21cbiAgICogbG9jYWwgc3RvcmFnZSwgb3IgZnJvbSB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBAZnVuY3Rpb24gQ2xpZW50Q2FsaWJyYXRpb25+c3RhcnRcbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG4gICAgLy8gbG9hZCBwcmV2aW91cyBjYWxpYnJhdGlvbiBvbiBzdGFydC5cbiAgICB0aGlzLmxvYWQoKTtcbiAgICAvLyBkb25lIHdoZW4gYWN0dWFsbHkgbG9hZGVkXG4gIH1cblxuICAvKipcbiAgICogU2F2ZSBjYWxpYnJhdGlvbiBsb2NhbGx5LCBhbmQgb24gdGhlIHNlcnZlci5cbiAgICpcbiAgICogQGZ1bmN0aW9uIENsaWVudENhbGlicmF0aW9ufnNhdmVcbiAgICovXG4gIHNhdmUoKSB7XG4gICAgdGhpcy5jYWxpYnJhdGlvbi5zYXZlKCk7XG4gIH1cblxuICAvKipcbiAgICogTG9hZCBjYWxpYnJhdGlvbiBsb2NhbGx5LCBvciBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIFRoZSBjYWxpYnJhdGlvbiBpcyBsb2FkZWQgZnJvbSB0aGUgc2VydmVyIHdoZW4gbm8gbG9jYWxcbiAgICogY29uZmlndXJhdGlvbiBpcyBmb3VuZC4gTm90ZSB0aGF0IGxvYWRpbmcgZnJvbSB0aGUgc2VydmVyIGlzXG4gICAqIGFzeW5jaHJvbm91cy4gU2VlIHtAbGlua2NvZGUgQ2xpZW50Q2FsaWJyYXRpb25+dXBkYXRlRnVuY3Rpb259XG4gICAqIHBhc3NlZCB0byB0aGUgY29uc3RydWN0b3IuXG4gICAqXG4gICAqIEBmdW5jdGlvbiBDbGllbnRDYWxpYnJhdGlvbn5sb2FkXG4gICAqL1xuICBsb2FkKCkge1xuICAgIHRoaXMuY2FsaWJyYXRpb24ubG9hZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIExvY2FsbHkgc2V0IHRoZSBjYWxpYnJhdGVkIHZhbHVlcy5cbiAgICpcbiAgICogQGZ1bmN0aW9uIENsaWVudENhbGlicmF0aW9ufnNldFxuICAgKiBAcGFyYW0ge2NhbGlicmF0aW9ufSBwYXJhbXNcbiAgICovXG4gIHNldChwYXJhbXMpIHtcbiAgICB0aGlzLmNhbGlicmF0aW9uLnNldChwYXJhbXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIExvY2FsbHkgZ2V0IHRoZSBjYWxpYnJhdGVkIHZhbHVlcy5cbiAgICpcbiAgICogTm90ZSB0aGF0IHtAbGlua2NvZGUgQ2FsaWJyYXRpb25DbGllbnR+bG9hZH0gbWV0aG9kIG11c3QgYmVcbiAgICogY2FsbGVkIHRvIHJlc3RvcmUgYSBwcmV2aW91cyBjYWxpYnJhdGlvbi5cbiAgICpcbiAgICogQGZ1bmN0aW9uIENsaWVudENhbGlicmF0aW9ufmdldFxuICAgKiBAcmV0dXJucyB7Y2FsaWJyYXRpb259IG9yIHRoZSBlbXB0eSBvYmplY3Qge30gaWYgbm8gY2FsaWJyYXRpb25cbiAgICogaXMgYXZhaWxhYmxlLlxuICAgKi9cbiAgZ2V0KCkge1xuICAgIHJldHVybiB0aGlzLmNhbGlicmF0aW9uLmdldCgpO1xuICB9XG5cbiAgX2NhbGlicmF0aW9uVXBkYXRlZCgpIHtcbiAgICBpZighdGhpcy5zdGFydGVkKSB7XG4gICAgICB0aGlzLnN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5kb25lKCk7XG4gICAgfVxuICAgIGlmKHR5cGVvZiB0aGlzLnVwZGF0ZUZ1bmN0aW9uICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhpcy51cGRhdGVGdW5jdGlvbigpO1xuICAgIH1cbiAgfVxufVxuIl19