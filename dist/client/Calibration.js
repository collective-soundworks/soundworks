'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var Calibration = require('calibration/client');
var client = require('./client');
var ClientModule = require('./ClientModule');
// import client from './client';
// import ClientModule from './ClientModule.es6.js';

var ClientCalibration = (function (_ClientModule) {
  _inherits(ClientCalibration, _ClientModule);

  // export default class ClientCalibration extends ClientModule {
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

    this.calibration = new Calibration({
      sendFunction: client.send,
      receiveFunction: client.receive,
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
})(ClientModule);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2FsaWJyYXRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7Ozs7Ozs7O0FBRWIsSUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDbEQsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ25DLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOzs7O0lBSXpDLGlCQUFpQjtZQUFqQixpQkFBaUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCVixXQXpCUCxpQkFBaUIsR0F5Qkk7UUFBYixNQUFNLHlEQUFHLEVBQUU7OzBCQXpCbkIsaUJBQWlCOztBQTBCbkIsK0JBMUJFLGlCQUFpQiw2Q0EwQmIsTUFBTSxDQUFDLElBQUksSUFBSSxhQUFhLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxLQUFLLElBQUksT0FBTyxFQUFFO0FBQ25FLFFBQU0sSUFBSSxHQUFHLElBQUksQ0FBQzs7QUFFbEIsUUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDbkIsUUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7OztBQUdyQixRQUFJLENBQUMsY0FBYyxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUM7O0FBRTVDLFFBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxXQUFXLENBQUM7QUFDakMsa0JBQVksRUFBRSxNQUFNLENBQUMsSUFBSTtBQUN6QixxQkFBZSxFQUFFLE1BQU0sQ0FBQyxPQUFPO0FBQy9CLG9CQUFjLEVBQUUsMEJBQU07QUFBRSxZQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztPQUFFO0tBQ3RELENBQUMsQ0FBQzs7QUFFSCxRQUFJLENBQUMsc0JBQXNCLENBQUMsa0RBQWtELENBQUMsQ0FBQztHQUNqRjs7Ozs7Ozs7O2VBMUNHLGlCQUFpQjs7V0FrRGhCLGlCQUFHO0FBQ04saUNBbkRFLGlCQUFpQix1Q0FtREw7O0FBRWQsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDOztLQUViOzs7Ozs7Ozs7V0FPRyxnQkFBRztBQUNMLFVBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDekI7Ozs7Ozs7Ozs7Ozs7O1dBWUcsZ0JBQUc7QUFDTCxVQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ3pCOzs7Ozs7Ozs7O1dBUUUsYUFBQyxNQUFNLEVBQUU7QUFDVixVQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUM5Qjs7Ozs7Ozs7Ozs7Ozs7V0FZRSxlQUFHO0FBQ0osYUFBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDO0tBQy9COzs7V0FFa0IsK0JBQUc7QUFDcEIsVUFBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDaEIsWUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7QUFDcEIsWUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO09BQ2I7QUFDRCxVQUFHLE9BQU8sSUFBSSxDQUFDLGNBQWMsS0FBSyxXQUFXLEVBQUU7QUFDN0MsWUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO09BQ3ZCO0tBQ0Y7OztTQWhIRyxpQkFBaUI7R0FBUyxZQUFZIiwiZmlsZSI6InNyYy9jbGllbnQvQ2FsaWJyYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmNvbnN0IENhbGlicmF0aW9uID0gcmVxdWlyZSgnY2FsaWJyYXRpb24vY2xpZW50Jyk7XG5jb25zdCBjbGllbnQgPSByZXF1aXJlKCcuL2NsaWVudCcpO1xuY29uc3QgQ2xpZW50TW9kdWxlID0gcmVxdWlyZSgnLi9DbGllbnRNb2R1bGUnKTtcbi8vIGltcG9ydCBjbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuLy8gaW1wb3J0IENsaWVudE1vZHVsZSBmcm9tICcuL0NsaWVudE1vZHVsZS5lczYuanMnO1xuXG5jbGFzcyBDbGllbnRDYWxpYnJhdGlvbiBleHRlbmRzIENsaWVudE1vZHVsZSB7XG4vLyBleHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnRDYWxpYnJhdGlvbiBleHRlbmRzIENsaWVudE1vZHVsZSB7XG4gIC8qKlxuICAgKiBGdW5jdGlvbiBjYWxsZWQgd2hlbiBhbiB1cGRhdGUgaGFwcGVuZWQuXG4gICAqXG4gICAqIFNlZSB7QGxpbmtjb2RlIENsaWVudENhbGlicmF0aW9ufmxvYWR9LlxuICAgKlxuICAgKiBAY2FsbGJhY2sgQ2xpZW50Q2FsaWJyYXRpb25+dXBkYXRlRnVuY3Rpb25cbiAgICoqL1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBvZiB0aGUgY2FsaWJyYXRpb24gY2xpZW50IG1vZHVsZS5cbiAgICpcbiAgICogTm90ZSB0aGF0IHtAbGlua2NvZGUgQ2xpZW50Q2FsaWJyYXRpb25+c3RhcnR9IG1ldGhvZCBtdXN0IGJlXG4gICAqIGNhbGxlZCB0byByZXN0b3JlIGEgcHJldmlvdXMgY2FsaWJyYXRpb24uXG4gICAqXG4gICAqIEBjb25zdHJ1Y3RzIENsaWVudENhbGlicmF0aW9uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbcGFyYW1zXVxuICAgKiBAcGFyYW0ge1N0cmluZ30gW3BhcmFtcy5uYW1lPSdjYWxpYnJhdGlvbiddIG5hbWUgb2YgbW9kdWxlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbcGFyYW1zLmNvbG9yPSdibGFjayddIGJhY2tncm91bmRcbiAgICogQHBhcmFtIHtDbGllbnRDYWxpYnJhdGlvbn51cGRhdGVGdW5jdGlvbn0gW3BhcmFtcy51cGRhdGVGdW5jdGlvbl1cbiAgICogQ2FsbGVkIHdoZW5ldmVyIHRoZSBjYWxpYnJhdGlvbiBjaGFuZ2VkLiBGaXJzdCB0byBjb21wbGV0ZSB0aGVcbiAgICogc3RhcnQsIGJ5IGNhbGxpbmcgZG9uZSwgYW5kIHRoZW4gZWFjaCB0aW1lIHRoZSBjYWxpYnJhdGlvbiBpc1xuICAgKiByZXN0b3JlZCBmcm9tIHRoZSBzZXJ2ZXIsIGJlY2F1c2UgdGhpcyBpcyBhc3luY2hyb25vdXMuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwYXJhbXMgPSB7fSkge1xuICAgIHN1cGVyKHBhcmFtcy5uYW1lIHx8ICdjYWxpYnJhdGlvbicsIHRydWUsIHBhcmFtcy5jb2xvciB8fCAnYmxhY2snKTtcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcblxuICAgIHRoaXMucmVhZHkgPSBmYWxzZTtcbiAgICB0aGlzLnN0YXJ0ZWQgPSBmYWxzZTtcblxuICAgIC8vIHVuZGVmaW5lZCBpcyBmaW5lXG4gICAgdGhpcy51cGRhdGVGdW5jdGlvbiA9IHBhcmFtcy51cGRhdGVGdW5jdGlvbjtcblxuICAgIHRoaXMuY2FsaWJyYXRpb24gPSBuZXcgQ2FsaWJyYXRpb24oe1xuICAgICAgc2VuZEZ1bmN0aW9uOiBjbGllbnQuc2VuZCxcbiAgICAgIHJlY2VpdmVGdW5jdGlvbjogY2xpZW50LnJlY2VpdmUsXG4gICAgICB1cGRhdGVGdW5jdGlvbjogKCkgPT4geyB0aGF0Ll9jYWxpYnJhdGlvblVwZGF0ZWQoKTsgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5zZXRDZW50ZXJlZFZpZXdDb250ZW50KCc8cCBjbGFzcz1cInNvZnQtYmxpbmtcIj5DYWxpYnJhdGlvbiwgc3RhbmQgYnnigKY8L3A+Jyk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgdGhlIHJlY2VpdmUgZnVuY3Rpb25zLCBhbmQgcmVzdG9yZSB0aGUgY2FsaWJyYXRpb24gZnJvbVxuICAgKiBsb2NhbCBzdG9yYWdlLCBvciBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEBmdW5jdGlvbiBDbGllbnRDYWxpYnJhdGlvbn5zdGFydFxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgICAvLyBsb2FkIHByZXZpb3VzIGNhbGlicmF0aW9uIG9uIHN0YXJ0LlxuICAgIHRoaXMubG9hZCgpO1xuICAgIC8vIGRvbmUgd2hlbiBhY3R1YWxseSBsb2FkZWRcbiAgfVxuXG4gIC8qKlxuICAgKiBTYXZlIGNhbGlicmF0aW9uIGxvY2FsbHksIGFuZCBvbiB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBAZnVuY3Rpb24gQ2xpZW50Q2FsaWJyYXRpb25+c2F2ZVxuICAgKi9cbiAgc2F2ZSgpIHtcbiAgICB0aGlzLmNhbGlicmF0aW9uLnNhdmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkIGNhbGlicmF0aW9uIGxvY2FsbHksIG9yIGZyb20gdGhlIHNlcnZlci5cbiAgICpcbiAgICogVGhlIGNhbGlicmF0aW9uIGlzIGxvYWRlZCBmcm9tIHRoZSBzZXJ2ZXIgd2hlbiBubyBsb2NhbFxuICAgKiBjb25maWd1cmF0aW9uIGlzIGZvdW5kLiBOb3RlIHRoYXQgbG9hZGluZyBmcm9tIHRoZSBzZXJ2ZXIgaXNcbiAgICogYXN5bmNocm9ub3VzLiBTZWUge0BsaW5rY29kZSBDbGllbnRDYWxpYnJhdGlvbn51cGRhdGVGdW5jdGlvbn1cbiAgICogcGFzc2VkIHRvIHRoZSBjb25zdHJ1Y3Rvci5cbiAgICpcbiAgICogQGZ1bmN0aW9uIENsaWVudENhbGlicmF0aW9ufmxvYWRcbiAgICovXG4gIGxvYWQoKSB7XG4gICAgdGhpcy5jYWxpYnJhdGlvbi5sb2FkKCk7XG4gIH1cblxuICAvKipcbiAgICogTG9jYWxseSBzZXQgdGhlIGNhbGlicmF0ZWQgdmFsdWVzLlxuICAgKlxuICAgKiBAZnVuY3Rpb24gQ2xpZW50Q2FsaWJyYXRpb25+c2V0XG4gICAqIEBwYXJhbSB7Y2FsaWJyYXRpb259IHBhcmFtc1xuICAgKi9cbiAgc2V0KHBhcmFtcykge1xuICAgIHRoaXMuY2FsaWJyYXRpb24uc2V0KHBhcmFtcyk7XG4gIH1cblxuICAvKipcbiAgICogTG9jYWxseSBnZXQgdGhlIGNhbGlicmF0ZWQgdmFsdWVzLlxuICAgKlxuICAgKiBOb3RlIHRoYXQge0BsaW5rY29kZSBDYWxpYnJhdGlvbkNsaWVudH5sb2FkfSBtZXRob2QgbXVzdCBiZVxuICAgKiBjYWxsZWQgdG8gcmVzdG9yZSBhIHByZXZpb3VzIGNhbGlicmF0aW9uLlxuICAgKlxuICAgKiBAZnVuY3Rpb24gQ2xpZW50Q2FsaWJyYXRpb25+Z2V0XG4gICAqIEByZXR1cm5zIHtjYWxpYnJhdGlvbn0gb3IgdGhlIGVtcHR5IG9iamVjdCB7fSBpZiBubyBjYWxpYnJhdGlvblxuICAgKiBpcyBhdmFpbGFibGUuXG4gICAqL1xuICBnZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FsaWJyYXRpb24uZ2V0KCk7XG4gIH1cblxuICBfY2FsaWJyYXRpb25VcGRhdGVkKCkge1xuICAgIGlmKCF0aGlzLnN0YXJ0ZWQpIHtcbiAgICAgIHRoaXMuc3RhcnRlZCA9IHRydWU7XG4gICAgICB0aGlzLmRvbmUoKTtcbiAgICB9XG4gICAgaWYodHlwZW9mIHRoaXMudXBkYXRlRnVuY3Rpb24gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzLnVwZGF0ZUZ1bmN0aW9uKCk7XG4gICAgfVxuICB9XG59XG4iXX0=