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

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _helpers = require('../../utils/helpers');

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:auth';

/**
 * Interface for the server `'auth'` service.
 *
 * This service allows to lock the application to specific users by adding a
 * simple logging page to the client.
 *
 * <span class="warning">__WARNING__</span>: This service shouldn't be considered
 * secure from a production prespective.
 *
 * __*The service must be used with its [client-side counterpart]{@link module:soundworks/client.Auth}*__
 *
 * @param {Object} options
 * @param {String} [configItem='password'] - Path to the password in the server configuration.
 *
 * @memberof module:soundworks/server
 * @example
 * this.auth = this.require('auth');
 */

var Auth = function (_Service) {
  (0, _inherits3.default)(Auth, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  function Auth() {
    (0, _classCallCheck3.default)(this, Auth);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Auth.__proto__ || (0, _getPrototypeOf2.default)(Auth)).call(this, SERVICE_ID));

    var defaults = {
      configItem: 'password'
    };

    _this.configure(defaults);

    /**
     * @private
     * @type {String|Object}
     */
    _this._password = null;
    _this._sharedConfig = _this.require('shared-config');
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(Auth, [{
    key: 'configure',
    value: function configure(options) {
      (0, _get3.default)(Auth.prototype.__proto__ || (0, _getPrototypeOf2.default)(Auth.prototype), 'configure', this).call(this, options);
    }

    /** @private */

  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)(Auth.prototype.__proto__ || (0, _getPrototypeOf2.default)(Auth.prototype), 'start', this).call(this);

      this._password = this._sharedConfig.get(this.options.configItem);

      this.ready();
    }

    /** @private */

  }, {
    key: 'connect',
    value: function connect(client) {
      this.receive(client, 'password', this._onAccessRequest(client));
    }

    /** @private */

  }, {
    key: '_onAccessRequest',
    value: function _onAccessRequest(client) {
      var _this2 = this;

      return function (password) {
        var match = void 0;

        if (typeof _this2._password === 'string') match = _this2._password;else match = _this2._password[client.type];

        if (password !== match) _this2.send(client, 'refused');else _this2.send(client, 'granted');
      };
    }
  }]);
  return Auth;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, Auth);

exports.default = Auth;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1dGguanMiXSwibmFtZXMiOlsiU0VSVklDRV9JRCIsIkF1dGgiLCJkZWZhdWx0cyIsImNvbmZpZ0l0ZW0iLCJjb25maWd1cmUiLCJfcGFzc3dvcmQiLCJfc2hhcmVkQ29uZmlnIiwicmVxdWlyZSIsIm9wdGlvbnMiLCJnZXQiLCJyZWFkeSIsImNsaWVudCIsInJlY2VpdmUiLCJfb25BY2Nlc3NSZXF1ZXN0IiwicGFzc3dvcmQiLCJtYXRjaCIsInR5cGUiLCJzZW5kIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLGFBQWEsY0FBbkI7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFrQk1DLEk7OztBQUNKO0FBQ0Esa0JBQWM7QUFBQTs7QUFBQSxrSUFDTkQsVUFETTs7QUFHWixRQUFNRSxXQUFXO0FBQ2ZDLGtCQUFZO0FBREcsS0FBakI7O0FBSUEsVUFBS0MsU0FBTCxDQUFlRixRQUFmOztBQUVBOzs7O0FBSUEsVUFBS0csU0FBTCxHQUFpQixJQUFqQjtBQUNBLFVBQUtDLGFBQUwsR0FBcUIsTUFBS0MsT0FBTCxDQUFhLGVBQWIsQ0FBckI7QUFkWTtBQWViOztBQUVEOzs7Ozs4QkFDVUMsTyxFQUFTO0FBQ2pCLGtJQUFnQkEsT0FBaEI7QUFDRDs7QUFFRDs7Ozs0QkFDUTtBQUNOOztBQUVBLFdBQUtILFNBQUwsR0FBaUIsS0FBS0MsYUFBTCxDQUFtQkcsR0FBbkIsQ0FBdUIsS0FBS0QsT0FBTCxDQUFhTCxVQUFwQyxDQUFqQjs7QUFFQSxXQUFLTyxLQUFMO0FBQ0Q7O0FBRUQ7Ozs7NEJBQ1FDLE0sRUFBUTtBQUNkLFdBQUtDLE9BQUwsQ0FBYUQsTUFBYixFQUFxQixVQUFyQixFQUFpQyxLQUFLRSxnQkFBTCxDQUFzQkYsTUFBdEIsQ0FBakM7QUFDRDs7QUFFRDs7OztxQ0FDaUJBLE0sRUFBUTtBQUFBOztBQUN2QixhQUFPLFVBQUNHLFFBQUQsRUFBYztBQUNuQixZQUFJQyxjQUFKOztBQUVBLFlBQUksT0FBTyxPQUFLVixTQUFaLEtBQTBCLFFBQTlCLEVBQ0VVLFFBQVEsT0FBS1YsU0FBYixDQURGLEtBR0VVLFFBQVEsT0FBS1YsU0FBTCxDQUFlTSxPQUFPSyxJQUF0QixDQUFSOztBQUVGLFlBQUlGLGFBQWFDLEtBQWpCLEVBQ0UsT0FBS0UsSUFBTCxDQUFVTixNQUFWLEVBQWtCLFNBQWxCLEVBREYsS0FHRSxPQUFLTSxJQUFMLENBQVVOLE1BQVYsRUFBa0IsU0FBbEI7QUFDSCxPQVpEO0FBYUQ7Ozs7O0FBR0gseUJBQWVPLFFBQWYsQ0FBd0JsQixVQUF4QixFQUFvQ0MsSUFBcEM7O2tCQUVlQSxJIiwiZmlsZSI6IkF1dGguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHsgZ2V0T3B0IH0gZnJvbSAnLi4vLi4vdXRpbHMvaGVscGVycyc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTphdXRoJztcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBzZXJ2ZXIgYCdhdXRoJ2Agc2VydmljZS5cbiAqXG4gKiBUaGlzIHNlcnZpY2UgYWxsb3dzIHRvIGxvY2sgdGhlIGFwcGxpY2F0aW9uIHRvIHNwZWNpZmljIHVzZXJzIGJ5IGFkZGluZyBhXG4gKiBzaW1wbGUgbG9nZ2luZyBwYWdlIHRvIHRoZSBjbGllbnQuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+OiBUaGlzIHNlcnZpY2Ugc2hvdWxkbid0IGJlIGNvbnNpZGVyZWRcbiAqIHNlY3VyZSBmcm9tIGEgcHJvZHVjdGlvbiBwcmVzcGVjdGl2ZS5cbiAqXG4gKiBfXypUaGUgc2VydmljZSBtdXN0IGJlIHVzZWQgd2l0aCBpdHMgW2NsaWVudC1zaWRlIGNvdW50ZXJwYXJ0XXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQXV0aH0qX19cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtTdHJpbmd9IFtjb25maWdJdGVtPSdwYXNzd29yZCddIC0gUGF0aCB0byB0aGUgcGFzc3dvcmQgaW4gdGhlIHNlcnZlciBjb25maWd1cmF0aW9uLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXJcbiAqIEBleGFtcGxlXG4gKiB0aGlzLmF1dGggPSB0aGlzLnJlcXVpcmUoJ2F1dGgnKTtcbiAqL1xuY2xhc3MgQXV0aCBleHRlbmRzIFNlcnZpY2Uge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBjb25maWdJdGVtOiAncGFzc3dvcmQnXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHR5cGUge1N0cmluZ3xPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5fcGFzc3dvcmQgPSBudWxsO1xuICAgIHRoaXMuX3NoYXJlZENvbmZpZyA9IHRoaXMucmVxdWlyZSgnc2hhcmVkLWNvbmZpZycpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGNvbmZpZ3VyZShvcHRpb25zKSB7XG4gICAgc3VwZXIuY29uZmlndXJlKG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICB0aGlzLl9wYXNzd29yZCA9IHRoaXMuX3NoYXJlZENvbmZpZy5nZXQodGhpcy5vcHRpb25zLmNvbmZpZ0l0ZW0pO1xuXG4gICAgdGhpcy5yZWFkeSgpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3Bhc3N3b3JkJywgdGhpcy5fb25BY2Nlc3NSZXF1ZXN0KGNsaWVudCkpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vbkFjY2Vzc1JlcXVlc3QoY2xpZW50KSB7XG4gICAgcmV0dXJuIChwYXNzd29yZCkgPT4ge1xuICAgICAgbGV0IG1hdGNoO1xuXG4gICAgICBpZiAodHlwZW9mIHRoaXMuX3Bhc3N3b3JkID09PSAnc3RyaW5nJylcbiAgICAgICAgbWF0Y2ggPSB0aGlzLl9wYXNzd29yZDtcbiAgICAgIGVsc2VcbiAgICAgICAgbWF0Y2ggPSB0aGlzLl9wYXNzd29yZFtjbGllbnQudHlwZV07XG5cbiAgICAgIGlmIChwYXNzd29yZCAhPT0gbWF0Y2gpXG4gICAgICAgIHRoaXMuc2VuZChjbGllbnQsICdyZWZ1c2VkJyk7XG4gICAgICBlbHNlXG4gICAgICAgIHRoaXMuc2VuZChjbGllbnQsICdncmFudGVkJyk7XG4gICAgfTtcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBBdXRoKTtcblxuZXhwb3J0IGRlZmF1bHQgQXV0aDtcbiJdfQ==