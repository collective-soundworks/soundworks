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

var _client = require('../core/client');

var _client2 = _interopRequireDefault(_client);

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _SegmentedView = require('../views/SegmentedView');

var _SegmentedView2 = _interopRequireDefault(_SegmentedView);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * API of a compliant view for the `auth` service.
 *
 * @memberof module:soundworks/client
 * @interface AbstractAuthView
 * @extends module:soundworks/client.AbstractView
 * @abstract
 */
/**
 * Register the function that should be executed when the password is submitted
 * by the user.
 *
 * @name setSendPasswordCallback
 * @memberof module:soundworks/client.AbstractAuthView
 * @function
 * @abstract
 * @instance
 *
 * @param {sendPasswordCallback} callback - Callback to execute when the user
 *  submit the password
 */
/**
 * Register the function that should be executed when the password is reset
 * by the user.
 *
 * @name setResetPasswordCallback
 * @memberof module:soundworks/client.AbstractAuthView
 * @function
 * @abstract
 * @instance
 *
 * @param {setResetCallback} callback -
 *  Callback to execute when the user reset the password
 */
/**
 * Update the view according to the response to the submitted password.
 *
 * @name updateRejectedStatus
 * @memberof module:soundworks/client.AbstractAuthView
 * @function
 * @abstract
 * @instance
 *
 * @param {Boolean} value - `true` if the submitted password is rejected,
 *  `false` when the password is reset.
 */

/**
 * Callback to execute when the user submit the password.
 *
 * @callback
 * @name sendPasswordCallback
 * @memberof module:soundworks/client.AbstractAuthView
 *
 * @param {String} password - Password given by the user.
 */
/**
 * Callback to execute when the user reset the password.
 *
 * @callback
 * @name resetCallback
 * @memberof module:soundworks/client.AbstractAuthView
 */

var SERVICE_ID = 'service:auth';
var LOCAL_STORAGE_KEY = 'soundworks:' + SERVICE_ID;

/**
 * Interface for the client `auth` service.
 *
 * This service allows to lock the application to specific users by adding a
 * simple logging page to the client.
 *
 * <span class="warning">__WARNING__</span>: This service shouldn't be considered
 * secure from a production prespective.
 *
 * __*The service must be used with its [server-side counterpart]{@link module:soundworks/server.Auth}*__
 *
 * @memberof module:soundworks/client
 * @example
 * this.auth = this.require('auth');
 */

var Auth = function (_Service) {
  (0, _inherits3.default)(Auth, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  function Auth() {
    (0, _classCallCheck3.default)(this, Auth);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Auth.__proto__ || (0, _getPrototypeOf2.default)(Auth)).call(this, SERVICE_ID, true));

    var defaults = {
      viewPriority: 100
    };

    _this.configure(defaults);

    _this._password = null;

    _this._onAccesGrantedResponse = _this._onAccesGrantedResponse.bind(_this);
    _this._onAccesRefusedResponse = _this._onAccesRefusedResponse.bind(_this);
    _this._sendPassword = _this._sendPassword.bind(_this);
    _this._resetPassword = _this._resetPassword.bind(_this);
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(Auth, [{
    key: 'start',
    value: function start() {
      (0, _get3.default)(Auth.prototype.__proto__ || (0, _getPrototypeOf2.default)(Auth.prototype), 'start', this).call(this);

      this.view.setSendPasswordCallback(this._sendPassword);
      this.view.setResetCallback(this._resetPassword);

      this.receive('granted', this._onAccesGrantedResponse);
      this.receive('refused', this._onAccesRefusedResponse);

      var storedPassword = localStorage.getItem(LOCAL_STORAGE_KEY);

      if (storedPassword !== null) this._sendPassword(storedPassword);

      this.show();
    }

    /** @private */

  }, {
    key: 'stop',
    value: function stop() {
      (0, _get3.default)(Auth.prototype.__proto__ || (0, _getPrototypeOf2.default)(Auth.prototype), 'stop', this).call(this);

      this.removeListener('granted', this._onAccesGrantedResponse);
      this.removeListener('refused', this._onAccesRefusedResponse);

      this.hide();
    }

    /**
     * Remove the stored password from local storage. This method is aimed at
     * being called from inside an experience / controller. Any UI update
     * resulting from the call of this method should then be handled from the
     * experience.
     */

  }, {
    key: 'logout',
    value: function logout() {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }

    /** @private */

  }, {
    key: '_sendPassword',
    value: function _sendPassword(password) {
      this._password = password;
      this.send('password', password);
    }

    /** @private */

  }, {
    key: '_resetPassword',
    value: function _resetPassword() {
      this._password = null;
      localStorage.removeItem(LOCAL_STORAGE_KEY);

      this.view.updateRejectedStatus(false);
    }

    /** @private */

  }, {
    key: '_onAccesGrantedResponse',
    value: function _onAccesGrantedResponse() {
      localStorage.setItem(LOCAL_STORAGE_KEY, this._password);
      this.ready();
    }

    /** @private */

  }, {
    key: '_onAccesRefusedResponse',
    value: function _onAccesRefusedResponse() {
      this.view.updateRejectedStatus(true);
    }
  }]);
  return Auth;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, Auth);

exports.default = Auth;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1dGguanMiXSwibmFtZXMiOlsiU0VSVklDRV9JRCIsIkxPQ0FMX1NUT1JBR0VfS0VZIiwiQXV0aCIsImRlZmF1bHRzIiwidmlld1ByaW9yaXR5IiwiY29uZmlndXJlIiwiX3Bhc3N3b3JkIiwiX29uQWNjZXNHcmFudGVkUmVzcG9uc2UiLCJiaW5kIiwiX29uQWNjZXNSZWZ1c2VkUmVzcG9uc2UiLCJfc2VuZFBhc3N3b3JkIiwiX3Jlc2V0UGFzc3dvcmQiLCJ2aWV3Iiwic2V0U2VuZFBhc3N3b3JkQ2FsbGJhY2siLCJzZXRSZXNldENhbGxiYWNrIiwicmVjZWl2ZSIsInN0b3JlZFBhc3N3b3JkIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsInNob3ciLCJyZW1vdmVMaXN0ZW5lciIsImhpZGUiLCJyZW1vdmVJdGVtIiwicGFzc3dvcmQiLCJzZW5kIiwidXBkYXRlUmVqZWN0ZWRTdGF0dXMiLCJzZXRJdGVtIiwicmVhZHkiLCJTZXJ2aWNlIiwic2VydmljZU1hbmFnZXIiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBOzs7Ozs7OztBQVFBOzs7Ozs7Ozs7Ozs7O0FBYUE7Ozs7Ozs7Ozs7Ozs7QUFhQTs7Ozs7Ozs7Ozs7OztBQWFBOzs7Ozs7Ozs7QUFTQTs7Ozs7Ozs7QUFTQSxJQUFNQSxhQUFhLGNBQW5CO0FBQ0EsSUFBTUMsb0NBQWtDRCxVQUF4Qzs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7OztJQWVNRSxJOzs7QUFDSjtBQUNBLGtCQUFjO0FBQUE7O0FBQUEsa0lBQ05GLFVBRE0sRUFDTSxJQUROOztBQUdaLFFBQU1HLFdBQVc7QUFDZkMsb0JBQWM7QUFEQyxLQUFqQjs7QUFJQSxVQUFLQyxTQUFMLENBQWVGLFFBQWY7O0FBRUEsVUFBS0csU0FBTCxHQUFpQixJQUFqQjs7QUFFQSxVQUFLQyx1QkFBTCxHQUErQixNQUFLQSx1QkFBTCxDQUE2QkMsSUFBN0IsT0FBL0I7QUFDQSxVQUFLQyx1QkFBTCxHQUErQixNQUFLQSx1QkFBTCxDQUE2QkQsSUFBN0IsT0FBL0I7QUFDQSxVQUFLRSxhQUFMLEdBQXFCLE1BQUtBLGFBQUwsQ0FBbUJGLElBQW5CLE9BQXJCO0FBQ0EsVUFBS0csY0FBTCxHQUFzQixNQUFLQSxjQUFMLENBQW9CSCxJQUFwQixPQUF0QjtBQWRZO0FBZWI7O0FBRUQ7Ozs7OzRCQUNRO0FBQ047O0FBRUEsV0FBS0ksSUFBTCxDQUFVQyx1QkFBVixDQUFrQyxLQUFLSCxhQUF2QztBQUNBLFdBQUtFLElBQUwsQ0FBVUUsZ0JBQVYsQ0FBMkIsS0FBS0gsY0FBaEM7O0FBRUEsV0FBS0ksT0FBTCxDQUFhLFNBQWIsRUFBd0IsS0FBS1IsdUJBQTdCO0FBQ0EsV0FBS1EsT0FBTCxDQUFhLFNBQWIsRUFBd0IsS0FBS04sdUJBQTdCOztBQUVBLFVBQU1PLGlCQUFpQkMsYUFBYUMsT0FBYixDQUFxQmpCLGlCQUFyQixDQUF2Qjs7QUFFQSxVQUFJZSxtQkFBbUIsSUFBdkIsRUFDRSxLQUFLTixhQUFMLENBQW1CTSxjQUFuQjs7QUFFRixXQUFLRyxJQUFMO0FBQ0Q7O0FBRUQ7Ozs7MkJBQ087QUFDTDs7QUFFQSxXQUFLQyxjQUFMLENBQW9CLFNBQXBCLEVBQStCLEtBQUtiLHVCQUFwQztBQUNBLFdBQUthLGNBQUwsQ0FBb0IsU0FBcEIsRUFBK0IsS0FBS1gsdUJBQXBDOztBQUVBLFdBQUtZLElBQUw7QUFDRDs7QUFFRDs7Ozs7Ozs7OzZCQU1TO0FBQ1BKLG1CQUFhSyxVQUFiLENBQXdCckIsaUJBQXhCO0FBQ0Q7O0FBRUQ7Ozs7a0NBQ2NzQixRLEVBQVU7QUFDdEIsV0FBS2pCLFNBQUwsR0FBaUJpQixRQUFqQjtBQUNBLFdBQUtDLElBQUwsQ0FBVSxVQUFWLEVBQXNCRCxRQUF0QjtBQUNEOztBQUVEOzs7O3FDQUNpQjtBQUNmLFdBQUtqQixTQUFMLEdBQWlCLElBQWpCO0FBQ0FXLG1CQUFhSyxVQUFiLENBQXdCckIsaUJBQXhCOztBQUVBLFdBQUtXLElBQUwsQ0FBVWEsb0JBQVYsQ0FBK0IsS0FBL0I7QUFDRDs7QUFFRDs7Ozs4Q0FDMEI7QUFDeEJSLG1CQUFhUyxPQUFiLENBQXFCekIsaUJBQXJCLEVBQXdDLEtBQUtLLFNBQTdDO0FBQ0EsV0FBS3FCLEtBQUw7QUFDRDs7QUFFRDs7Ozs4Q0FDMEI7QUFDeEIsV0FBS2YsSUFBTCxDQUFVYSxvQkFBVixDQUErQixJQUEvQjtBQUNEOzs7RUFoRmdCRyxpQjs7QUFtRm5CQyx5QkFBZUMsUUFBZixDQUF3QjlCLFVBQXhCLEVBQW9DRSxJQUFwQzs7a0JBRWVBLEkiLCJmaWxlIjoiQXV0aC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbGllbnQgZnJvbSAnLi4vY29yZS9jbGllbnQnO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBTZWdtZW50ZWRWaWV3IGZyb20gJy4uL3ZpZXdzL1NlZ21lbnRlZFZpZXcnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuXG4vKipcbiAqIEFQSSBvZiBhIGNvbXBsaWFudCB2aWV3IGZvciB0aGUgYGF1dGhgIHNlcnZpY2UuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQGludGVyZmFjZSBBYnN0cmFjdEF1dGhWaWV3XG4gKiBAZXh0ZW5kcyBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWJzdHJhY3RWaWV3XG4gKiBAYWJzdHJhY3RcbiAqL1xuLyoqXG4gKiBSZWdpc3RlciB0aGUgZnVuY3Rpb24gdGhhdCBzaG91bGQgYmUgZXhlY3V0ZWQgd2hlbiB0aGUgcGFzc3dvcmQgaXMgc3VibWl0dGVkXG4gKiBieSB0aGUgdXNlci5cbiAqXG4gKiBAbmFtZSBzZXRTZW5kUGFzc3dvcmRDYWxsYmFja1xuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BYnN0cmFjdEF1dGhWaWV3XG4gKiBAZnVuY3Rpb25cbiAqIEBhYnN0cmFjdFxuICogQGluc3RhbmNlXG4gKlxuICogQHBhcmFtIHtzZW5kUGFzc3dvcmRDYWxsYmFja30gY2FsbGJhY2sgLSBDYWxsYmFjayB0byBleGVjdXRlIHdoZW4gdGhlIHVzZXJcbiAqICBzdWJtaXQgdGhlIHBhc3N3b3JkXG4gKi9cbi8qKlxuICogUmVnaXN0ZXIgdGhlIGZ1bmN0aW9uIHRoYXQgc2hvdWxkIGJlIGV4ZWN1dGVkIHdoZW4gdGhlIHBhc3N3b3JkIGlzIHJlc2V0XG4gKiBieSB0aGUgdXNlci5cbiAqXG4gKiBAbmFtZSBzZXRSZXNldFBhc3N3b3JkQ2FsbGJhY2tcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWJzdHJhY3RBdXRoVmlld1xuICogQGZ1bmN0aW9uXG4gKiBAYWJzdHJhY3RcbiAqIEBpbnN0YW5jZVxuICpcbiAqIEBwYXJhbSB7c2V0UmVzZXRDYWxsYmFja30gY2FsbGJhY2sgLVxuICogIENhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiB0aGUgdXNlciByZXNldCB0aGUgcGFzc3dvcmRcbiAqL1xuLyoqXG4gKiBVcGRhdGUgdGhlIHZpZXcgYWNjb3JkaW5nIHRvIHRoZSByZXNwb25zZSB0byB0aGUgc3VibWl0dGVkIHBhc3N3b3JkLlxuICpcbiAqIEBuYW1lIHVwZGF0ZVJlamVjdGVkU3RhdHVzXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0QXV0aFZpZXdcbiAqIEBmdW5jdGlvblxuICogQGFic3RyYWN0XG4gKiBAaW5zdGFuY2VcbiAqXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHZhbHVlIC0gYHRydWVgIGlmIHRoZSBzdWJtaXR0ZWQgcGFzc3dvcmQgaXMgcmVqZWN0ZWQsXG4gKiAgYGZhbHNlYCB3aGVuIHRoZSBwYXNzd29yZCBpcyByZXNldC5cbiAqL1xuXG4vKipcbiAqIENhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiB0aGUgdXNlciBzdWJtaXQgdGhlIHBhc3N3b3JkLlxuICpcbiAqIEBjYWxsYmFja1xuICogQG5hbWUgc2VuZFBhc3N3b3JkQ2FsbGJhY2tcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWJzdHJhY3RBdXRoVmlld1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXNzd29yZCAtIFBhc3N3b3JkIGdpdmVuIGJ5IHRoZSB1c2VyLlxuICovXG4vKipcbiAqIENhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiB0aGUgdXNlciByZXNldCB0aGUgcGFzc3dvcmQuXG4gKlxuICogQGNhbGxiYWNrXG4gKiBAbmFtZSByZXNldENhbGxiYWNrXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0QXV0aFZpZXdcbiAqL1xuXG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTphdXRoJztcbmNvbnN0IExPQ0FMX1NUT1JBR0VfS0VZID0gYHNvdW5kd29ya3M6JHtTRVJWSUNFX0lEfWA7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgY2xpZW50IGBhdXRoYCBzZXJ2aWNlLlxuICpcbiAqIFRoaXMgc2VydmljZSBhbGxvd3MgdG8gbG9jayB0aGUgYXBwbGljYXRpb24gdG8gc3BlY2lmaWMgdXNlcnMgYnkgYWRkaW5nIGFcbiAqIHNpbXBsZSBsb2dnaW5nIHBhZ2UgdG8gdGhlIGNsaWVudC5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj46IFRoaXMgc2VydmljZSBzaG91bGRuJ3QgYmUgY29uc2lkZXJlZFxuICogc2VjdXJlIGZyb20gYSBwcm9kdWN0aW9uIHByZXNwZWN0aXZlLlxuICpcbiAqIF9fKlRoZSBzZXJ2aWNlIG11c3QgYmUgdXNlZCB3aXRoIGl0cyBbc2VydmVyLXNpZGUgY291bnRlcnBhcnRde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5BdXRofSpfX1xuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBleGFtcGxlXG4gKiB0aGlzLmF1dGggPSB0aGlzLnJlcXVpcmUoJ2F1dGgnKTtcbiAqL1xuY2xhc3MgQXV0aCBleHRlbmRzIFNlcnZpY2Uge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIHRydWUpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICB2aWV3UHJpb3JpdHk6IDEwMCxcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuXG4gICAgdGhpcy5fcGFzc3dvcmQgPSBudWxsO1xuXG4gICAgdGhpcy5fb25BY2Nlc0dyYW50ZWRSZXNwb25zZSA9IHRoaXMuX29uQWNjZXNHcmFudGVkUmVzcG9uc2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbkFjY2VzUmVmdXNlZFJlc3BvbnNlID0gdGhpcy5fb25BY2Nlc1JlZnVzZWRSZXNwb25zZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX3NlbmRQYXNzd29yZCA9IHRoaXMuX3NlbmRQYXNzd29yZC5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX3Jlc2V0UGFzc3dvcmQgPSB0aGlzLl9yZXNldFBhc3N3b3JkLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIHRoaXMudmlldy5zZXRTZW5kUGFzc3dvcmRDYWxsYmFjayh0aGlzLl9zZW5kUGFzc3dvcmQpO1xuICAgIHRoaXMudmlldy5zZXRSZXNldENhbGxiYWNrKHRoaXMuX3Jlc2V0UGFzc3dvcmQpO1xuXG4gICAgdGhpcy5yZWNlaXZlKCdncmFudGVkJywgdGhpcy5fb25BY2Nlc0dyYW50ZWRSZXNwb25zZSk7XG4gICAgdGhpcy5yZWNlaXZlKCdyZWZ1c2VkJywgdGhpcy5fb25BY2Nlc1JlZnVzZWRSZXNwb25zZSk7XG5cbiAgICBjb25zdCBzdG9yZWRQYXNzd29yZCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKExPQ0FMX1NUT1JBR0VfS0VZKTtcblxuICAgIGlmIChzdG9yZWRQYXNzd29yZCAhPT0gbnVsbClcbiAgICAgIHRoaXMuX3NlbmRQYXNzd29yZChzdG9yZWRQYXNzd29yZCk7XG5cbiAgICB0aGlzLnNob3coKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdG9wKCkge1xuICAgIHN1cGVyLnN0b3AoKTtcblxuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ2dyYW50ZWQnLCB0aGlzLl9vbkFjY2VzR3JhbnRlZFJlc3BvbnNlKTtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdyZWZ1c2VkJywgdGhpcy5fb25BY2Nlc1JlZnVzZWRSZXNwb25zZSk7XG5cbiAgICB0aGlzLmhpZGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgdGhlIHN0b3JlZCBwYXNzd29yZCBmcm9tIGxvY2FsIHN0b3JhZ2UuIFRoaXMgbWV0aG9kIGlzIGFpbWVkIGF0XG4gICAqIGJlaW5nIGNhbGxlZCBmcm9tIGluc2lkZSBhbiBleHBlcmllbmNlIC8gY29udHJvbGxlci4gQW55IFVJIHVwZGF0ZVxuICAgKiByZXN1bHRpbmcgZnJvbSB0aGUgY2FsbCBvZiB0aGlzIG1ldGhvZCBzaG91bGQgdGhlbiBiZSBoYW5kbGVkIGZyb20gdGhlXG4gICAqIGV4cGVyaWVuY2UuXG4gICAqL1xuICBsb2dvdXQoKSB7XG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oTE9DQUxfU1RPUkFHRV9LRVkpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9zZW5kUGFzc3dvcmQocGFzc3dvcmQpIHtcbiAgICB0aGlzLl9wYXNzd29yZCA9IHBhc3N3b3JkO1xuICAgIHRoaXMuc2VuZCgncGFzc3dvcmQnLCBwYXNzd29yZCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX3Jlc2V0UGFzc3dvcmQoKSB7XG4gICAgdGhpcy5fcGFzc3dvcmQgPSBudWxsO1xuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKExPQ0FMX1NUT1JBR0VfS0VZKTtcblxuICAgIHRoaXMudmlldy51cGRhdGVSZWplY3RlZFN0YXR1cyhmYWxzZSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uQWNjZXNHcmFudGVkUmVzcG9uc2UoKSB7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oTE9DQUxfU1RPUkFHRV9LRVksIHRoaXMuX3Bhc3N3b3JkKTtcbiAgICB0aGlzLnJlYWR5KCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uQWNjZXNSZWZ1c2VkUmVzcG9uc2UoKSB7XG4gICAgdGhpcy52aWV3LnVwZGF0ZVJlamVjdGVkU3RhdHVzKHRydWUpO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIEF1dGgpO1xuXG5leHBvcnQgZGVmYXVsdCBBdXRoO1xuIl19