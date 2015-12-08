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
})(_ClientModule3['default']);

exports['default'] = ClientCalibration;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzZCQUF5QixnQkFBZ0I7Ozs7aUNBQ1gsb0JBQW9COzs7Ozs7OztJQUs3QixpQkFBaUI7WUFBakIsaUJBQWlCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdCekIsV0F4QlEsaUJBQWlCLEdBd0JYO1FBQWIsTUFBTSx5REFBRyxFQUFFOzswQkF4QkosaUJBQWlCOztBQXlCbEMsK0JBekJpQixpQkFBaUIsNkNBeUI1QixNQUFNLENBQUMsSUFBSSxJQUFJLGFBQWEsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLEtBQUssSUFBSSxPQUFPLEVBQUU7O0FBRW5FLFFBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ25CLFFBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDOzs7QUFHckIsUUFBSSxDQUFDLGNBQWMsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDOztBQUU1QyxRQUFJLENBQUMsV0FBVyxHQUFHLG1DQUFzQjtBQUN2QyxrQkFBWSxFQUFFLElBQUksQ0FBQyxJQUFJO0FBQ3ZCLHFCQUFlLEVBQUUsSUFBSSxDQUFDLE9BQU87QUFDN0Isb0JBQWMsRUFBRSwwQkFBTTtBQUFFLFlBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO09BQUU7S0FDdEQsQ0FBQyxDQUFDOztBQUVILFFBQUksQ0FBQyxzQkFBc0IsQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO0dBQ2pGOzs7Ozs7Ozs7ZUF4Q2tCLGlCQUFpQjs7V0FnRC9CLGlCQUFHO0FBQ04saUNBakRpQixpQkFBaUIsdUNBaURwQjs7QUFFZCxVQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7O0tBRWI7Ozs7Ozs7OztXQU9HLGdCQUFHO0FBQ0wsVUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUN6Qjs7Ozs7Ozs7Ozs7Ozs7V0FZRyxnQkFBRztBQUNMLFVBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDekI7Ozs7Ozs7Ozs7V0FRRSxhQUFDLE1BQU0sRUFBRTtBQUNWLFVBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQzlCOzs7Ozs7Ozs7Ozs7OztXQVlFLGVBQUc7QUFDSixhQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUM7S0FDL0I7OztXQUVrQiwrQkFBRztBQUNwQixVQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNqQixZQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztBQUNwQixZQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7T0FDYjtBQUNELFVBQUksT0FBTyxJQUFJLENBQUMsY0FBYyxLQUFLLFdBQVcsRUFBRTtBQUM5QyxZQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7T0FDdkI7S0FDRjs7O1NBOUdrQixpQkFBaUI7OztxQkFBakIsaUJBQWlCIiwiZmlsZSI6InNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDbGllbnRNb2R1bGUgZnJvbSAnLi9DbGllbnRNb2R1bGUnO1xuaW1wb3J0IENhbGlicmF0aW9uQ2xpZW50IGZyb20gJ2NhbGlicmF0aW9uL2NsaWVudCc7XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50Q2FsaWJyYXRpb24gZXh0ZW5kcyBDbGllbnRNb2R1bGUge1xuICAvKipcbiAgICogRnVuY3Rpb24gY2FsbGVkIHdoZW4gYW4gdXBkYXRlIGhhcHBlbmVkLlxuICAgKlxuICAgKiBTZWUge0BsaW5rY29kZSBDbGllbnRDYWxpYnJhdGlvbn5sb2FkfS5cbiAgICpcbiAgICogQGNhbGxiYWNrIENsaWVudENhbGlicmF0aW9ufnVwZGF0ZUZ1bmN0aW9uXG4gICAqKi9cblxuICAvKipcbiAgICogQ29uc3RydWN0b3Igb2YgdGhlIGNhbGlicmF0aW9uIGNsaWVudCBtb2R1bGUuXG4gICAqXG4gICAqIE5vdGUgdGhhdCB7QGxpbmtjb2RlIENsaWVudENhbGlicmF0aW9ufnN0YXJ0fSBtZXRob2QgbXVzdCBiZVxuICAgKiBjYWxsZWQgdG8gcmVzdG9yZSBhIHByZXZpb3VzIGNhbGlicmF0aW9uLlxuICAgKlxuICAgKiBAY29uc3RydWN0cyBDbGllbnRDYWxpYnJhdGlvblxuICAgKiBAcGFyYW0ge09iamVjdH0gW3BhcmFtc11cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtwYXJhbXMubmFtZT0nY2FsaWJyYXRpb24nXSBuYW1lIG9mIG1vZHVsZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gW3BhcmFtcy5jb2xvcj0nYmxhY2snXSBiYWNrZ3JvdW5kXG4gICAqIEBwYXJhbSB7Q2xpZW50Q2FsaWJyYXRpb25+dXBkYXRlRnVuY3Rpb259IFtwYXJhbXMudXBkYXRlRnVuY3Rpb25dXG4gICAqIENhbGxlZCB3aGVuZXZlciB0aGUgY2FsaWJyYXRpb24gY2hhbmdlZC4gRmlyc3QgdG8gY29tcGxldGUgdGhlXG4gICAqIHN0YXJ0LCBieSBjYWxsaW5nIGRvbmUsIGFuZCB0aGVuIGVhY2ggdGltZSB0aGUgY2FsaWJyYXRpb24gaXNcbiAgICogcmVzdG9yZWQgZnJvbSB0aGUgc2VydmVyLCBiZWNhdXNlIHRoaXMgaXMgYXN5bmNocm9ub3VzLlxuICAgKi9cbiAgY29uc3RydWN0b3IocGFyYW1zID0ge30pIHtcbiAgICBzdXBlcihwYXJhbXMubmFtZSB8fCAnY2FsaWJyYXRpb24nLCB0cnVlLCBwYXJhbXMuY29sb3IgfHwgJ2JsYWNrJyk7XG5cbiAgICB0aGlzLnJlYWR5ID0gZmFsc2U7XG4gICAgdGhpcy5zdGFydGVkID0gZmFsc2U7XG5cbiAgICAvLyB1bmRlZmluZWQgaXMgZmluZVxuICAgIHRoaXMudXBkYXRlRnVuY3Rpb24gPSBwYXJhbXMudXBkYXRlRnVuY3Rpb247XG5cbiAgICB0aGlzLmNhbGlicmF0aW9uID0gbmV3IENhbGlicmF0aW9uQ2xpZW50KHtcbiAgICAgIHNlbmRGdW5jdGlvbjogdGhpcy5zZW5kLFxuICAgICAgcmVjZWl2ZUZ1bmN0aW9uOiB0aGlzLnJlY2VpdmUsXG4gICAgICB1cGRhdGVGdW5jdGlvbjogKCkgPT4geyB0aGF0Ll9jYWxpYnJhdGlvblVwZGF0ZWQoKTsgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5zZXRDZW50ZXJlZFZpZXdDb250ZW50KCc8cCBjbGFzcz1cInNvZnQtYmxpbmtcIj5DYWxpYnJhdGlvbiwgc3RhbmQgYnnigKY8L3A+Jyk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgdGhlIHJlY2VpdmUgZnVuY3Rpb25zLCBhbmQgcmVzdG9yZSB0aGUgY2FsaWJyYXRpb24gZnJvbVxuICAgKiBsb2NhbCBzdG9yYWdlLCBvciBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEBmdW5jdGlvbiBDbGllbnRDYWxpYnJhdGlvbn5zdGFydFxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgICAvLyBsb2FkIHByZXZpb3VzIGNhbGlicmF0aW9uIG9uIHN0YXJ0LlxuICAgIHRoaXMubG9hZCgpO1xuICAgIC8vIGRvbmUgd2hlbiBhY3R1YWxseSBsb2FkZWRcbiAgfVxuXG4gIC8qKlxuICAgKiBTYXZlIGNhbGlicmF0aW9uIGxvY2FsbHksIGFuZCBvbiB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBAZnVuY3Rpb24gQ2xpZW50Q2FsaWJyYXRpb25+c2F2ZVxuICAgKi9cbiAgc2F2ZSgpIHtcbiAgICB0aGlzLmNhbGlicmF0aW9uLnNhdmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkIGNhbGlicmF0aW9uIGxvY2FsbHksIG9yIGZyb20gdGhlIHNlcnZlci5cbiAgICpcbiAgICogVGhlIGNhbGlicmF0aW9uIGlzIGxvYWRlZCBmcm9tIHRoZSBzZXJ2ZXIgd2hlbiBubyBsb2NhbFxuICAgKiBjb25maWd1cmF0aW9uIGlzIGZvdW5kLiBOb3RlIHRoYXQgbG9hZGluZyBmcm9tIHRoZSBzZXJ2ZXIgaXNcbiAgICogYXN5bmNocm9ub3VzLiBTZWUge0BsaW5rY29kZSBDbGllbnRDYWxpYnJhdGlvbn51cGRhdGVGdW5jdGlvbn1cbiAgICogcGFzc2VkIHRvIHRoZSBjb25zdHJ1Y3Rvci5cbiAgICpcbiAgICogQGZ1bmN0aW9uIENsaWVudENhbGlicmF0aW9ufmxvYWRcbiAgICovXG4gIGxvYWQoKSB7XG4gICAgdGhpcy5jYWxpYnJhdGlvbi5sb2FkKCk7XG4gIH1cblxuICAvKipcbiAgICogTG9jYWxseSBzZXQgdGhlIGNhbGlicmF0ZWQgdmFsdWVzLlxuICAgKlxuICAgKiBAZnVuY3Rpb24gQ2xpZW50Q2FsaWJyYXRpb25+c2V0XG4gICAqIEBwYXJhbSB7Y2FsaWJyYXRpb259IHBhcmFtc1xuICAgKi9cbiAgc2V0KHBhcmFtcykge1xuICAgIHRoaXMuY2FsaWJyYXRpb24uc2V0KHBhcmFtcyk7XG4gIH1cblxuICAvKipcbiAgICogTG9jYWxseSBnZXQgdGhlIGNhbGlicmF0ZWQgdmFsdWVzLlxuICAgKlxuICAgKiBOb3RlIHRoYXQge0BsaW5rY29kZSBDYWxpYnJhdGlvbkNsaWVudH5sb2FkfSBtZXRob2QgbXVzdCBiZVxuICAgKiBjYWxsZWQgdG8gcmVzdG9yZSBhIHByZXZpb3VzIGNhbGlicmF0aW9uLlxuICAgKlxuICAgKiBAZnVuY3Rpb24gQ2xpZW50Q2FsaWJyYXRpb25+Z2V0XG4gICAqIEByZXR1cm5zIHtjYWxpYnJhdGlvbn0gb3IgdGhlIGVtcHR5IG9iamVjdCB7fSBpZiBubyBjYWxpYnJhdGlvblxuICAgKiBpcyBhdmFpbGFibGUuXG4gICAqL1xuICBnZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FsaWJyYXRpb24uZ2V0KCk7XG4gIH1cblxuICBfY2FsaWJyYXRpb25VcGRhdGVkKCkge1xuICAgIGlmICghdGhpcy5zdGFydGVkKSB7XG4gICAgICB0aGlzLnN0YXJ0ZWQgPSB0cnVlO1xuICAgICAgdGhpcy5kb25lKCk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdGhpcy51cGRhdGVGdW5jdGlvbiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRoaXMudXBkYXRlRnVuY3Rpb24oKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==