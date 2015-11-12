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

var Calibration = (function (_Module) {
  _inherits(Calibration, _Module);

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

  function Calibration() {
    var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Calibration);

    _get(Object.getPrototypeOf(Calibration.prototype), 'constructor', this).call(this, params.name || 'calibration', true, params.color || 'black');
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

  _createClass(Calibration, [{
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(Calibration.prototype), 'start', this).call(this);
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

  return Calibration;
})(_Module3['default']);

exports['default'] = Calibration;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2FsaWJyYXRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztzQkFBbUIsVUFBVTs7Ozt1QkFDVixVQUFVOzs7O2lDQUNDLG9CQUFvQjs7OztJQUc3QixXQUFXO1lBQVgsV0FBVzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF3Qm5CLFdBeEJRLFdBQVcsR0F3Qkw7UUFBYixNQUFNLHlEQUFHLEVBQUU7OzBCQXhCSixXQUFXOztBQXlCNUIsK0JBekJpQixXQUFXLDZDQXlCdEIsTUFBTSxDQUFDLElBQUksSUFBSSxhQUFhLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxLQUFLLElBQUksT0FBTyxFQUFFO0FBQ25FLFFBQU0sSUFBSSxHQUFHLElBQUksQ0FBQzs7QUFFbEIsUUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDbkIsUUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7OztBQUdyQixRQUFJLENBQUMsY0FBYyxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUM7O0FBRTVDLFFBQUksQ0FBQyxXQUFXLEdBQUcsbUNBQXNCO0FBQ3ZDLGtCQUFZLEVBQUUsb0JBQU8sSUFBSTtBQUN6QixxQkFBZSxFQUFFLG9CQUFPLE9BQU87QUFDL0Isb0JBQWMsRUFBRSwwQkFBTTtBQUFFLFlBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO09BQUU7S0FDdEQsQ0FBQyxDQUFDOztBQUVILFFBQUksQ0FBQyxzQkFBc0IsQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO0dBQ2pGOzs7Ozs7Ozs7ZUF6Q2tCLFdBQVc7O1dBaUR6QixpQkFBRztBQUNOLGlDQWxEaUIsV0FBVyx1Q0FrRGQ7O0FBRWQsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDOztLQUViOzs7Ozs7Ozs7V0FPRyxnQkFBRztBQUNMLFVBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDekI7Ozs7Ozs7Ozs7Ozs7O1dBWUcsZ0JBQUc7QUFDTCxVQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ3pCOzs7Ozs7Ozs7O1dBUUUsYUFBQyxNQUFNLEVBQUU7QUFDVixVQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUM5Qjs7Ozs7Ozs7Ozs7Ozs7V0FZRSxlQUFHO0FBQ0osYUFBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDO0tBQy9COzs7V0FFa0IsK0JBQUc7QUFDcEIsVUFBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDaEIsWUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDcEIsWUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO09BQ2I7QUFDRCxVQUFHLE9BQU8sSUFBSSxDQUFDLGNBQWMsS0FBSyxXQUFXLEVBQUU7QUFDN0MsWUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO09BQ3ZCO0tBQ0Y7OztTQS9Ha0IsV0FBVzs7O3FCQUFYLFdBQVciLCJmaWxlIjoic3JjL2NsaWVudC9DYWxpYnJhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IE1vZHVsZSBmcm9tICcuL01vZHVsZSc7XG5pbXBvcnQgQ2FsaWJyYXRpb25DbGllbnQgZnJvbSAnY2FsaWJyYXRpb24vY2xpZW50JztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYWxpYnJhdGlvbiBleHRlbmRzIE1vZHVsZSB7XG4gIC8qKlxuICAgKiBGdW5jdGlvbiBjYWxsZWQgd2hlbiBhbiB1cGRhdGUgaGFwcGVuZWQuXG4gICAqXG4gICAqIFNlZSB7QGxpbmtjb2RlIENsaWVudENhbGlicmF0aW9ufmxvYWR9LlxuICAgKlxuICAgKiBAY2FsbGJhY2sgQ2xpZW50Q2FsaWJyYXRpb25+dXBkYXRlRnVuY3Rpb25cbiAgICoqL1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBvZiB0aGUgY2FsaWJyYXRpb24gY2xpZW50IG1vZHVsZS5cbiAgICpcbiAgICogTm90ZSB0aGF0IHtAbGlua2NvZGUgQ2xpZW50Q2FsaWJyYXRpb25+c3RhcnR9IG1ldGhvZCBtdXN0IGJlXG4gICAqIGNhbGxlZCB0byByZXN0b3JlIGEgcHJldmlvdXMgY2FsaWJyYXRpb24uXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RzIENsaWVudENhbGlicmF0aW9uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbcGFyYW1zXVxuICAgKiBAcGFyYW0ge1N0cmluZ30gW3BhcmFtcy5uYW1lPSdjYWxpYnJhdGlvbiddIG5hbWUgb2YgbW9kdWxlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbcGFyYW1zLmNvbG9yPSdibGFjayddIGJhY2tncm91bmRcbiAgICogQHBhcmFtIHtDbGllbnRDYWxpYnJhdGlvbn51cGRhdGVGdW5jdGlvbn0gW3BhcmFtcy51cGRhdGVGdW5jdGlvbl1cbiAgICogQ2FsbGVkIHdoZW5ldmVyIHRoZSBjYWxpYnJhdGlvbiBjaGFuZ2VkLiBGaXJzdCB0byBjb21wbGV0ZSB0aGVcbiAgICogc3RhcnQsIGJ5IGNhbGxpbmcgZG9uZSwgYW5kIHRoZW4gZWFjaCB0aW1lIHRoZSBjYWxpYnJhdGlvbiBpc1xuICAgKiByZXN0b3JlZCBmcm9tIHRoZSBzZXJ2ZXIsIGJlY2F1c2UgdGhpcyBpcyBhc3luY2hyb25vdXMuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwYXJhbXMgPSB7fSkge1xuICAgIHN1cGVyKHBhcmFtcy5uYW1lIHx8ICdjYWxpYnJhdGlvbicsIHRydWUsIHBhcmFtcy5jb2xvciB8fCAnYmxhY2snKTtcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcblxuICAgIHRoaXMucmVhZHkgPSBmYWxzZTtcbiAgICB0aGlzLnN0YXJ0ZWQgPSBmYWxzZTtcblxuICAgIC8vIHVuZGVmaW5lZCBpcyBmaW5lXG4gICAgdGhpcy51cGRhdGVGdW5jdGlvbiA9IHBhcmFtcy51cGRhdGVGdW5jdGlvbjtcblxuICAgIHRoaXMuY2FsaWJyYXRpb24gPSBuZXcgQ2FsaWJyYXRpb25DbGllbnQoe1xuICAgICAgc2VuZEZ1bmN0aW9uOiBjbGllbnQuc2VuZCxcbiAgICAgIHJlY2VpdmVGdW5jdGlvbjogY2xpZW50LnJlY2VpdmUsXG4gICAgICB1cGRhdGVGdW5jdGlvbjogKCkgPT4geyB0aGF0Ll9jYWxpYnJhdGlvblVwZGF0ZWQoKTsgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5zZXRDZW50ZXJlZFZpZXdDb250ZW50KCc8cCBjbGFzcz1cInNvZnQtYmxpbmtcIj5DYWxpYnJhdGlvbiwgc3RhbmQgYnnigKY8L3A+Jyk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgdGhlIHJlY2VpdmUgZnVuY3Rpb25zLCBhbmQgcmVzdG9yZSB0aGUgY2FsaWJyYXRpb24gZnJvbVxuICAgKiBsb2NhbCBzdG9yYWdlLCBvciBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEBmdW5jdGlvbiBDbGllbnRDYWxpYnJhdGlvbn5zdGFydFxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgICAvLyBsb2FkIHByZXZpb3VzIGNhbGlicmF0aW9uIG9uIHN0YXJ0LlxuICAgIHRoaXMubG9hZCgpO1xuICAgIC8vIGRvbmUgd2hlbiBhY3R1YWxseSBsb2FkZWRcbiAgfVxuXG4gIC8qKlxuICAgKiBTYXZlIGNhbGlicmF0aW9uIGxvY2FsbHksIGFuZCBvbiB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBAZnVuY3Rpb24gQ2xpZW50Q2FsaWJyYXRpb25+c2F2ZVxuICAgKi9cbiAgc2F2ZSgpIHtcbiAgICB0aGlzLmNhbGlicmF0aW9uLnNhdmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkIGNhbGlicmF0aW9uIGxvY2FsbHksIG9yIGZyb20gdGhlIHNlcnZlci5cbiAgICpcbiAgICogVGhlIGNhbGlicmF0aW9uIGlzIGxvYWRlZCBmcm9tIHRoZSBzZXJ2ZXIgd2hlbiBubyBsb2NhbFxuICAgKiBjb25maWd1cmF0aW9uIGlzIGZvdW5kLiBOb3RlIHRoYXQgbG9hZGluZyBmcm9tIHRoZSBzZXJ2ZXIgaXNcbiAgICogYXN5bmNocm9ub3VzLiBTZWUge0BsaW5rY29kZSBDbGllbnRDYWxpYnJhdGlvbn51cGRhdGVGdW5jdGlvbn1cbiAgICogcGFzc2VkIHRvIHRoZSBjb25zdHJ1Y3Rvci5cbiAgICpcbiAgICogQGZ1bmN0aW9uIENsaWVudENhbGlicmF0aW9ufmxvYWRcbiAgICovXG4gIGxvYWQoKSB7XG4gICAgdGhpcy5jYWxpYnJhdGlvbi5sb2FkKCk7XG4gIH1cblxuICAvKipcbiAgICogTG9jYWxseSBzZXQgdGhlIGNhbGlicmF0ZWQgdmFsdWVzLlxuICAgKlxuICAgKiBAZnVuY3Rpb24gQ2xpZW50Q2FsaWJyYXRpb25+c2V0XG4gICAqIEBwYXJhbSB7Y2FsaWJyYXRpb259IHBhcmFtc1xuICAgKi9cbiAgc2V0KHBhcmFtcykge1xuICAgIHRoaXMuY2FsaWJyYXRpb24uc2V0KHBhcmFtcyk7XG4gIH1cblxuICAvKipcbiAgICogTG9jYWxseSBnZXQgdGhlIGNhbGlicmF0ZWQgdmFsdWVzLlxuICAgKlxuICAgKiBOb3RlIHRoYXQge0BsaW5rY29kZSBDYWxpYnJhdGlvbkNsaWVudH5sb2FkfSBtZXRob2QgbXVzdCBiZVxuICAgKiBjYWxsZWQgdG8gcmVzdG9yZSBhIHByZXZpb3VzIGNhbGlicmF0aW9uLlxuICAgKlxuICAgKiBAZnVuY3Rpb24gQ2xpZW50Q2FsaWJyYXRpb25+Z2V0XG4gICAqIEByZXR1cm5zIHtjYWxpYnJhdGlvbn0gb3IgdGhlIGVtcHR5IG9iamVjdCB7fSBpZiBubyBjYWxpYnJhdGlvblxuICAgKiBpcyBhdmFpbGFibGUuXG4gICAqL1xuICBnZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FsaWJyYXRpb24uZ2V0KCk7XG4gIH1cblxuICBfY2FsaWJyYXRpb25VcGRhdGVkKCkge1xuICAgIGlmKCF0aGlzLnN0YXJ0ZWQpIHtcbiAgICAgIHRoaXMuc3RhcnRlZCA9IHRydWU7XG4gICAgICB0aGlzLmRvbmUoKTtcbiAgICB9XG4gICAgaWYodHlwZW9mIHRoaXMudXBkYXRlRnVuY3Rpb24gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzLnVwZGF0ZUZ1bmN0aW9uKCk7XG4gICAgfVxuICB9XG59XG4iXX0=