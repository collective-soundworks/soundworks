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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1dGguanMiXSwibmFtZXMiOlsiU0VSVklDRV9JRCIsIkxPQ0FMX1NUT1JBR0VfS0VZIiwiQXV0aCIsImRlZmF1bHRzIiwidmlld1ByaW9yaXR5IiwiY29uZmlndXJlIiwiX3Bhc3N3b3JkIiwiX29uQWNjZXNHcmFudGVkUmVzcG9uc2UiLCJiaW5kIiwiX29uQWNjZXNSZWZ1c2VkUmVzcG9uc2UiLCJfc2VuZFBhc3N3b3JkIiwiX3Jlc2V0UGFzc3dvcmQiLCJ2aWV3Iiwic2V0U2VuZFBhc3N3b3JkQ2FsbGJhY2siLCJzZXRSZXNldENhbGxiYWNrIiwicmVjZWl2ZSIsInN0b3JlZFBhc3N3b3JkIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsInNob3ciLCJyZW1vdmVMaXN0ZW5lciIsImhpZGUiLCJyZW1vdmVJdGVtIiwicGFzc3dvcmQiLCJzZW5kIiwidXBkYXRlUmVqZWN0ZWRTdGF0dXMiLCJzZXRJdGVtIiwicmVhZHkiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBOzs7Ozs7OztBQVFBOzs7Ozs7Ozs7Ozs7O0FBYUE7Ozs7Ozs7Ozs7Ozs7QUFhQTs7Ozs7Ozs7Ozs7OztBQWFBOzs7Ozs7Ozs7QUFTQTs7Ozs7Ozs7QUFTQSxJQUFNQSxhQUFhLGNBQW5CO0FBQ0EsSUFBTUMsb0NBQWtDRCxVQUF4Qzs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7OztJQWVNRSxJOzs7QUFDSjtBQUNBLGtCQUFjO0FBQUE7O0FBQUEsa0lBQ05GLFVBRE0sRUFDTSxJQUROOztBQUdaLFFBQU1HLFdBQVc7QUFDZkMsb0JBQWM7QUFEQyxLQUFqQjs7QUFJQSxVQUFLQyxTQUFMLENBQWVGLFFBQWY7O0FBRUEsVUFBS0csU0FBTCxHQUFpQixJQUFqQjs7QUFFQSxVQUFLQyx1QkFBTCxHQUErQixNQUFLQSx1QkFBTCxDQUE2QkMsSUFBN0IsT0FBL0I7QUFDQSxVQUFLQyx1QkFBTCxHQUErQixNQUFLQSx1QkFBTCxDQUE2QkQsSUFBN0IsT0FBL0I7QUFDQSxVQUFLRSxhQUFMLEdBQXFCLE1BQUtBLGFBQUwsQ0FBbUJGLElBQW5CLE9BQXJCO0FBQ0EsVUFBS0csY0FBTCxHQUFzQixNQUFLQSxjQUFMLENBQW9CSCxJQUFwQixPQUF0QjtBQWRZO0FBZWI7O0FBRUQ7Ozs7OzRCQUNRO0FBQ047O0FBRUEsV0FBS0ksSUFBTCxDQUFVQyx1QkFBVixDQUFrQyxLQUFLSCxhQUF2QztBQUNBLFdBQUtFLElBQUwsQ0FBVUUsZ0JBQVYsQ0FBMkIsS0FBS0gsY0FBaEM7O0FBRUEsV0FBS0ksT0FBTCxDQUFhLFNBQWIsRUFBd0IsS0FBS1IsdUJBQTdCO0FBQ0EsV0FBS1EsT0FBTCxDQUFhLFNBQWIsRUFBd0IsS0FBS04sdUJBQTdCOztBQUVBLFVBQU1PLGlCQUFpQkMsYUFBYUMsT0FBYixDQUFxQmpCLGlCQUFyQixDQUF2Qjs7QUFFQSxVQUFJZSxtQkFBbUIsSUFBdkIsRUFDRSxLQUFLTixhQUFMLENBQW1CTSxjQUFuQjs7QUFFRixXQUFLRyxJQUFMO0FBQ0Q7O0FBRUQ7Ozs7MkJBQ087QUFDTDs7QUFFQSxXQUFLQyxjQUFMLENBQW9CLFNBQXBCLEVBQStCLEtBQUtiLHVCQUFwQztBQUNBLFdBQUthLGNBQUwsQ0FBb0IsU0FBcEIsRUFBK0IsS0FBS1gsdUJBQXBDOztBQUVBLFdBQUtZLElBQUw7QUFDRDs7QUFFRDs7Ozs7Ozs7OzZCQU1TO0FBQ1BKLG1CQUFhSyxVQUFiLENBQXdCckIsaUJBQXhCO0FBQ0Q7O0FBRUQ7Ozs7a0NBQ2NzQixRLEVBQVU7QUFDdEIsV0FBS2pCLFNBQUwsR0FBaUJpQixRQUFqQjtBQUNBLFdBQUtDLElBQUwsQ0FBVSxVQUFWLEVBQXNCRCxRQUF0QjtBQUNEOztBQUVEOzs7O3FDQUNpQjtBQUNmLFdBQUtqQixTQUFMLEdBQWlCLElBQWpCO0FBQ0FXLG1CQUFhSyxVQUFiLENBQXdCckIsaUJBQXhCOztBQUVBLFdBQUtXLElBQUwsQ0FBVWEsb0JBQVYsQ0FBK0IsS0FBL0I7QUFDRDs7QUFFRDs7Ozs4Q0FDMEI7QUFDeEJSLG1CQUFhUyxPQUFiLENBQXFCekIsaUJBQXJCLEVBQXdDLEtBQUtLLFNBQTdDO0FBQ0EsV0FBS3FCLEtBQUw7QUFDRDs7QUFFRDs7Ozs4Q0FDMEI7QUFDeEIsV0FBS2YsSUFBTCxDQUFVYSxvQkFBVixDQUErQixJQUEvQjtBQUNEOzs7OztBQUdILHlCQUFlRyxRQUFmLENBQXdCNUIsVUFBeEIsRUFBb0NFLElBQXBDOztrQkFFZUEsSSIsImZpbGUiOiJBdXRoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsaWVudCBmcm9tICcuLi9jb3JlL2NsaWVudCc7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IFNlZ21lbnRlZFZpZXcgZnJvbSAnLi4vdmlld3MvU2VnbWVudGVkVmlldyc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbi8qKlxuICogQVBJIG9mIGEgY29tcGxpYW50IHZpZXcgZm9yIHRoZSBgYXV0aGAgc2VydmljZS5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAaW50ZXJmYWNlIEFic3RyYWN0QXV0aFZpZXdcbiAqIEBleHRlbmRzIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BYnN0cmFjdFZpZXdcbiAqIEBhYnN0cmFjdFxuICovXG4vKipcbiAqIFJlZ2lzdGVyIHRoZSBmdW5jdGlvbiB0aGF0IHNob3VsZCBiZSBleGVjdXRlZCB3aGVuIHRoZSBwYXNzd29yZCBpcyBzdWJtaXR0ZWRcbiAqIGJ5IHRoZSB1c2VyLlxuICpcbiAqIEBuYW1lIHNldFNlbmRQYXNzd29yZENhbGxiYWNrXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0QXV0aFZpZXdcbiAqIEBmdW5jdGlvblxuICogQGFic3RyYWN0XG4gKiBAaW5zdGFuY2VcbiAqXG4gKiBAcGFyYW0ge3NlbmRQYXNzd29yZENhbGxiYWNrfSBjYWxsYmFjayAtIENhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiB0aGUgdXNlclxuICogIHN1Ym1pdCB0aGUgcGFzc3dvcmRcbiAqL1xuLyoqXG4gKiBSZWdpc3RlciB0aGUgZnVuY3Rpb24gdGhhdCBzaG91bGQgYmUgZXhlY3V0ZWQgd2hlbiB0aGUgcGFzc3dvcmQgaXMgcmVzZXRcbiAqIGJ5IHRoZSB1c2VyLlxuICpcbiAqIEBuYW1lIHNldFJlc2V0UGFzc3dvcmRDYWxsYmFja1xuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BYnN0cmFjdEF1dGhWaWV3XG4gKiBAZnVuY3Rpb25cbiAqIEBhYnN0cmFjdFxuICogQGluc3RhbmNlXG4gKlxuICogQHBhcmFtIHtzZXRSZXNldENhbGxiYWNrfSBjYWxsYmFjayAtXG4gKiAgQ2FsbGJhY2sgdG8gZXhlY3V0ZSB3aGVuIHRoZSB1c2VyIHJlc2V0IHRoZSBwYXNzd29yZFxuICovXG4vKipcbiAqIFVwZGF0ZSB0aGUgdmlldyBhY2NvcmRpbmcgdG8gdGhlIHJlc3BvbnNlIHRvIHRoZSBzdWJtaXR0ZWQgcGFzc3dvcmQuXG4gKlxuICogQG5hbWUgdXBkYXRlUmVqZWN0ZWRTdGF0dXNcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWJzdHJhY3RBdXRoVmlld1xuICogQGZ1bmN0aW9uXG4gKiBAYWJzdHJhY3RcbiAqIEBpbnN0YW5jZVxuICpcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gdmFsdWUgLSBgdHJ1ZWAgaWYgdGhlIHN1Ym1pdHRlZCBwYXNzd29yZCBpcyByZWplY3RlZCxcbiAqICBgZmFsc2VgIHdoZW4gdGhlIHBhc3N3b3JkIGlzIHJlc2V0LlxuICovXG5cbi8qKlxuICogQ2FsbGJhY2sgdG8gZXhlY3V0ZSB3aGVuIHRoZSB1c2VyIHN1Ym1pdCB0aGUgcGFzc3dvcmQuXG4gKlxuICogQGNhbGxiYWNrXG4gKiBAbmFtZSBzZW5kUGFzc3dvcmRDYWxsYmFja1xuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BYnN0cmFjdEF1dGhWaWV3XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHBhc3N3b3JkIC0gUGFzc3dvcmQgZ2l2ZW4gYnkgdGhlIHVzZXIuXG4gKi9cbi8qKlxuICogQ2FsbGJhY2sgdG8gZXhlY3V0ZSB3aGVuIHRoZSB1c2VyIHJlc2V0IHRoZSBwYXNzd29yZC5cbiAqXG4gKiBAY2FsbGJhY2tcbiAqIEBuYW1lIHJlc2V0Q2FsbGJhY2tcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWJzdHJhY3RBdXRoVmlld1xuICovXG5cblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOmF1dGgnO1xuY29uc3QgTE9DQUxfU1RPUkFHRV9LRVkgPSBgc291bmR3b3Jrczoke1NFUlZJQ0VfSUR9YDtcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBjbGllbnQgYGF1dGhgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIGFsbG93cyB0byBsb2NrIHRoZSBhcHBsaWNhdGlvbiB0byBzcGVjaWZpYyB1c2VycyBieSBhZGRpbmcgYVxuICogc2ltcGxlIGxvZ2dpbmcgcGFnZSB0byB0aGUgY2xpZW50LlxuICpcbiAqIDxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPjogVGhpcyBzZXJ2aWNlIHNob3VsZG4ndCBiZSBjb25zaWRlcmVkXG4gKiBzZWN1cmUgZnJvbSBhIHByb2R1Y3Rpb24gcHJlc3BlY3RpdmUuXG4gKlxuICogX18qVGhlIHNlcnZpY2UgbXVzdCBiZSB1c2VkIHdpdGggaXRzIFtzZXJ2ZXItc2lkZSBjb3VudGVycGFydF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLkF1dGh9Kl9fXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQGV4YW1wbGVcbiAqIHRoaXMuYXV0aCA9IHRoaXMucmVxdWlyZSgnYXV0aCcpO1xuICovXG5jbGFzcyBBdXRoIGV4dGVuZHMgU2VydmljZSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbmNpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgdHJ1ZSk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIHZpZXdQcmlvcml0eTogMTAwLFxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICB0aGlzLl9wYXNzd29yZCA9IG51bGw7XG5cbiAgICB0aGlzLl9vbkFjY2VzR3JhbnRlZFJlc3BvbnNlID0gdGhpcy5fb25BY2Nlc0dyYW50ZWRSZXNwb25zZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uQWNjZXNSZWZ1c2VkUmVzcG9uc2UgPSB0aGlzLl9vbkFjY2VzUmVmdXNlZFJlc3BvbnNlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fc2VuZFBhc3N3b3JkID0gdGhpcy5fc2VuZFBhc3N3b3JkLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fcmVzZXRQYXNzd29yZCA9IHRoaXMuX3Jlc2V0UGFzc3dvcmQuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgdGhpcy52aWV3LnNldFNlbmRQYXNzd29yZENhbGxiYWNrKHRoaXMuX3NlbmRQYXNzd29yZCk7XG4gICAgdGhpcy52aWV3LnNldFJlc2V0Q2FsbGJhY2sodGhpcy5fcmVzZXRQYXNzd29yZCk7XG5cbiAgICB0aGlzLnJlY2VpdmUoJ2dyYW50ZWQnLCB0aGlzLl9vbkFjY2VzR3JhbnRlZFJlc3BvbnNlKTtcbiAgICB0aGlzLnJlY2VpdmUoJ3JlZnVzZWQnLCB0aGlzLl9vbkFjY2VzUmVmdXNlZFJlc3BvbnNlKTtcblxuICAgIGNvbnN0IHN0b3JlZFBhc3N3b3JkID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oTE9DQUxfU1RPUkFHRV9LRVkpO1xuXG4gICAgaWYgKHN0b3JlZFBhc3N3b3JkICE9PSBudWxsKVxuICAgICAgdGhpcy5fc2VuZFBhc3N3b3JkKHN0b3JlZFBhc3N3b3JkKTtcblxuICAgIHRoaXMuc2hvdygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0b3AoKSB7XG4gICAgc3VwZXIuc3RvcCgpO1xuXG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignZ3JhbnRlZCcsIHRoaXMuX29uQWNjZXNHcmFudGVkUmVzcG9uc2UpO1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ3JlZnVzZWQnLCB0aGlzLl9vbkFjY2VzUmVmdXNlZFJlc3BvbnNlKTtcblxuICAgIHRoaXMuaGlkZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSB0aGUgc3RvcmVkIHBhc3N3b3JkIGZyb20gbG9jYWwgc3RvcmFnZS4gVGhpcyBtZXRob2QgaXMgYWltZWQgYXRcbiAgICogYmVpbmcgY2FsbGVkIGZyb20gaW5zaWRlIGFuIGV4cGVyaWVuY2UgLyBjb250cm9sbGVyLiBBbnkgVUkgdXBkYXRlXG4gICAqIHJlc3VsdGluZyBmcm9tIHRoZSBjYWxsIG9mIHRoaXMgbWV0aG9kIHNob3VsZCB0aGVuIGJlIGhhbmRsZWQgZnJvbSB0aGVcbiAgICogZXhwZXJpZW5jZS5cbiAgICovXG4gIGxvZ291dCgpIHtcbiAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShMT0NBTF9TVE9SQUdFX0tFWSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX3NlbmRQYXNzd29yZChwYXNzd29yZCkge1xuICAgIHRoaXMuX3Bhc3N3b3JkID0gcGFzc3dvcmQ7XG4gICAgdGhpcy5zZW5kKCdwYXNzd29yZCcsIHBhc3N3b3JkKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfcmVzZXRQYXNzd29yZCgpIHtcbiAgICB0aGlzLl9wYXNzd29yZCA9IG51bGw7XG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oTE9DQUxfU1RPUkFHRV9LRVkpO1xuXG4gICAgdGhpcy52aWV3LnVwZGF0ZVJlamVjdGVkU3RhdHVzKGZhbHNlKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25BY2Nlc0dyYW50ZWRSZXNwb25zZSgpIHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShMT0NBTF9TVE9SQUdFX0tFWSwgdGhpcy5fcGFzc3dvcmQpO1xuICAgIHRoaXMucmVhZHkoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25BY2Nlc1JlZnVzZWRSZXNwb25zZSgpIHtcbiAgICB0aGlzLnZpZXcudXBkYXRlUmVqZWN0ZWRTdGF0dXModHJ1ZSk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgQXV0aCk7XG5cbmV4cG9ydCBkZWZhdWx0IEF1dGg7XG4iXX0=