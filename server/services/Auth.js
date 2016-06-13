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

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Auth).call(this, SERVICE_ID));

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
      (0, _get3.default)((0, _getPrototypeOf2.default)(Auth.prototype), 'configure', this).call(this, options);
    }

    /** @private */

  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(Auth.prototype), 'start', this).call(this);

      this._password = this._sharedConfig.get(this.options.configItem);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1dGguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7Ozs7O0FBRUEsSUFBTSxhQUFhLGNBQW5COzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFvQk0sSTs7Ozs7QUFFSixrQkFBYztBQUFBOztBQUFBLDhHQUNOLFVBRE07O0FBR1osUUFBTSxXQUFXO0FBQ2Ysa0JBQVk7QUFERyxLQUFqQjs7QUFJQSxVQUFLLFNBQUwsQ0FBZSxRQUFmOzs7Ozs7QUFNQSxVQUFLLFNBQUwsR0FBaUIsSUFBakI7QUFDQSxVQUFLLGFBQUwsR0FBcUIsTUFBSyxPQUFMLENBQWEsZUFBYixDQUFyQjtBQWRZO0FBZWI7Ozs7Ozs7OEJBR1MsTyxFQUFTO0FBQ2pCLHNHQUFnQixPQUFoQjtBQUNEOzs7Ozs7NEJBR087QUFDTjs7QUFFQSxXQUFLLFNBQUwsR0FBaUIsS0FBSyxhQUFMLENBQW1CLEdBQW5CLENBQXVCLEtBQUssT0FBTCxDQUFhLFVBQXBDLENBQWpCO0FBQ0Q7Ozs7Ozs0QkFHTyxNLEVBQVE7QUFDZCxXQUFLLE9BQUwsQ0FBYSxNQUFiLEVBQXFCLFVBQXJCLEVBQWlDLEtBQUssZ0JBQUwsQ0FBc0IsTUFBdEIsQ0FBakM7QUFDRDs7Ozs7O3FDQUdnQixNLEVBQVE7QUFBQTs7QUFDdkIsYUFBTyxVQUFDLFFBQUQsRUFBYztBQUNuQixZQUFJLGNBQUo7O0FBRUEsWUFBSSxPQUFPLE9BQUssU0FBWixLQUEwQixRQUE5QixFQUNFLFFBQVEsT0FBSyxTQUFiLENBREYsS0FHRSxRQUFRLE9BQUssU0FBTCxDQUFlLE9BQU8sSUFBdEIsQ0FBUjs7QUFFRixZQUFJLGFBQWEsS0FBakIsRUFDRSxPQUFLLElBQUwsQ0FBVSxNQUFWLEVBQWtCLFNBQWxCLEVBREYsS0FHRSxPQUFLLElBQUwsQ0FBVSxNQUFWLEVBQWtCLFNBQWxCO0FBQ0gsT0FaRDtBQWFEOzs7OztBQUdILHlCQUFlLFFBQWYsQ0FBd0IsVUFBeEIsRUFBb0MsSUFBcEM7O2tCQUVlLEkiLCJmaWxlIjoiQXV0aC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgeyBnZXRPcHQgfSBmcm9tICcuLi8uLi91dGlscy9oZWxwZXJzJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOmF1dGgnO1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIHNlcnZlciBgJ2F1dGgnYCBzZXJ2aWNlLlxuICpcbiAqIFRoaXMgc2VydmljZSBhbGxvd3MgdG8gbG9jayB0aGUgYXBwbGljYXRpb24gdG8gc3BlY2lmaWMgdXNlcnMgYnkgYWRkaW5nIGFcbiAqIHNpbXBsZSBsb2dnaW5nIHBhZ2UgdG8gdGhlIGNsaWVudC5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj46IFRoaXMgc2VydmljZSBzaG91bGRuJ3QgYmUgY29uc2lkZXJlZFxuICogc2VjdXJlIGZyb20gYSBwcm9kdWN0aW9uIHByZXNwZWN0aXZlLlxuICpcbiAqIF9fKlRoZSBzZXJ2aWNlIG11c3QgYmUgdXNlZCB3aXRoIGl0cyBbY2xpZW50LXNpZGUgY291bnRlcnBhcnRde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BdXRofSpfX1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge1N0cmluZ30gW2NvbmZpZ0l0ZW09J3Bhc3N3b3JkJ10gLSBQYXRoIHRvIHRoZSBwYXNzd29yZCBpbiB0aGUgc2VydmVyIGNvbmZpZ3VyYXRpb24uXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlclxuICogQGV4YW1wbGVcbiAqIHRoaXMuYXV0aCA9IHRoaXMucmVxdWlyZSgnYXV0aCcpO1xuICovXG5jbGFzcyBBdXRoIGV4dGVuZHMgU2VydmljZSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbmNpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGNvbmZpZ0l0ZW06ICdwYXNzd29yZCdcbiAgICB9XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICAvKipcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEB0eXBlIHtTdHJpbmd8T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuX3Bhc3N3b3JkID0gbnVsbDtcbiAgICB0aGlzLl9zaGFyZWRDb25maWcgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1jb25maWcnKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBjb25maWd1cmUob3B0aW9ucykge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgdGhpcy5fcGFzc3dvcmQgPSB0aGlzLl9zaGFyZWRDb25maWcuZ2V0KHRoaXMub3B0aW9ucy5jb25maWdJdGVtKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdwYXNzd29yZCcsIHRoaXMuX29uQWNjZXNzUmVxdWVzdChjbGllbnQpKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25BY2Nlc3NSZXF1ZXN0KGNsaWVudCkge1xuICAgIHJldHVybiAocGFzc3dvcmQpID0+IHtcbiAgICAgIGxldCBtYXRjaDtcblxuICAgICAgaWYgKHR5cGVvZiB0aGlzLl9wYXNzd29yZCA9PT0gJ3N0cmluZycpXG4gICAgICAgIG1hdGNoID0gdGhpcy5fcGFzc3dvcmQ7XG4gICAgICBlbHNlXG4gICAgICAgIG1hdGNoID0gdGhpcy5fcGFzc3dvcmRbY2xpZW50LnR5cGVdO1xuXG4gICAgICBpZiAocGFzc3dvcmQgIT09IG1hdGNoKVxuICAgICAgICB0aGlzLnNlbmQoY2xpZW50LCAncmVmdXNlZCcpO1xuICAgICAgZWxzZVxuICAgICAgICB0aGlzLnNlbmQoY2xpZW50LCAnZ3JhbnRlZCcpO1xuICAgIH1cbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBBdXRoKTtcblxuZXhwb3J0IGRlZmF1bHQgQXV0aDtcbiJdfQ==