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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1dGguanMiXSwibmFtZXMiOlsiU0VSVklDRV9JRCIsIkF1dGgiLCJkZWZhdWx0cyIsImNvbmZpZ0l0ZW0iLCJjb25maWd1cmUiLCJfcGFzc3dvcmQiLCJfc2hhcmVkQ29uZmlnIiwicmVxdWlyZSIsIm9wdGlvbnMiLCJnZXQiLCJyZWFkeSIsImNsaWVudCIsInJlY2VpdmUiLCJfb25BY2Nlc3NSZXF1ZXN0IiwicGFzc3dvcmQiLCJtYXRjaCIsInR5cGUiLCJzZW5kIiwiU2VydmljZSIsInNlcnZpY2VNYW5hZ2VyIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLGFBQWEsY0FBbkI7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFrQk1DLEk7OztBQUNKO0FBQ0Esa0JBQWM7QUFBQTs7QUFBQSxrSUFDTkQsVUFETTs7QUFHWixRQUFNRSxXQUFXO0FBQ2ZDLGtCQUFZO0FBREcsS0FBakI7O0FBSUEsVUFBS0MsU0FBTCxDQUFlRixRQUFmOztBQUVBOzs7O0FBSUEsVUFBS0csU0FBTCxHQUFpQixJQUFqQjtBQUNBLFVBQUtDLGFBQUwsR0FBcUIsTUFBS0MsT0FBTCxDQUFhLGVBQWIsQ0FBckI7QUFkWTtBQWViOztBQUVEOzs7Ozs4QkFDVUMsTyxFQUFTO0FBQ2pCLGtJQUFnQkEsT0FBaEI7QUFDRDs7QUFFRDs7Ozs0QkFDUTtBQUNOOztBQUVBLFdBQUtILFNBQUwsR0FBaUIsS0FBS0MsYUFBTCxDQUFtQkcsR0FBbkIsQ0FBdUIsS0FBS0QsT0FBTCxDQUFhTCxVQUFwQyxDQUFqQjs7QUFFQSxXQUFLTyxLQUFMO0FBQ0Q7O0FBRUQ7Ozs7NEJBQ1FDLE0sRUFBUTtBQUNkLFdBQUtDLE9BQUwsQ0FBYUQsTUFBYixFQUFxQixVQUFyQixFQUFpQyxLQUFLRSxnQkFBTCxDQUFzQkYsTUFBdEIsQ0FBakM7QUFDRDs7QUFFRDs7OztxQ0FDaUJBLE0sRUFBUTtBQUFBOztBQUN2QixhQUFPLFVBQUNHLFFBQUQsRUFBYztBQUNuQixZQUFJQyxjQUFKOztBQUVBLFlBQUksT0FBTyxPQUFLVixTQUFaLEtBQTBCLFFBQTlCLEVBQ0VVLFFBQVEsT0FBS1YsU0FBYixDQURGLEtBR0VVLFFBQVEsT0FBS1YsU0FBTCxDQUFlTSxPQUFPSyxJQUF0QixDQUFSOztBQUVGLFlBQUlGLGFBQWFDLEtBQWpCLEVBQ0UsT0FBS0UsSUFBTCxDQUFVTixNQUFWLEVBQWtCLFNBQWxCLEVBREYsS0FHRSxPQUFLTSxJQUFMLENBQVVOLE1BQVYsRUFBa0IsU0FBbEI7QUFDSCxPQVpEO0FBYUQ7OztFQXJEZ0JPLGlCOztBQXdEbkJDLHlCQUFlQyxRQUFmLENBQXdCcEIsVUFBeEIsRUFBb0NDLElBQXBDOztrQkFFZUEsSSIsImZpbGUiOiJBdXRoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCB7IGdldE9wdCB9IGZyb20gJy4uLy4uL3V0aWxzL2hlbHBlcnMnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6YXV0aCc7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgc2VydmVyIGAnYXV0aCdgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIGFsbG93cyB0byBsb2NrIHRoZSBhcHBsaWNhdGlvbiB0byBzcGVjaWZpYyB1c2VycyBieSBhZGRpbmcgYVxuICogc2ltcGxlIGxvZ2dpbmcgcGFnZSB0byB0aGUgY2xpZW50LlxuICpcbiAqIDxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPjogVGhpcyBzZXJ2aWNlIHNob3VsZG4ndCBiZSBjb25zaWRlcmVkXG4gKiBzZWN1cmUgZnJvbSBhIHByb2R1Y3Rpb24gcHJlc3BlY3RpdmUuXG4gKlxuICogX18qVGhlIHNlcnZpY2UgbXVzdCBiZSB1c2VkIHdpdGggaXRzIFtjbGllbnQtc2lkZSBjb3VudGVycGFydF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkF1dGh9Kl9fXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBbY29uZmlnSXRlbT0ncGFzc3dvcmQnXSAtIFBhdGggdG8gdGhlIHBhc3N3b3JkIGluIHRoZSBzZXJ2ZXIgY29uZmlndXJhdGlvbi5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyXG4gKiBAZXhhbXBsZVxuICogdGhpcy5hdXRoID0gdGhpcy5yZXF1aXJlKCdhdXRoJyk7XG4gKi9cbmNsYXNzIEF1dGggZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgLyoqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmUgaW5zdGFuY2lhdGVkIG1hbnVhbGx5XyAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lEKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgY29uZmlnSXRlbTogJ3Bhc3N3b3JkJ1xuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICAvKipcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEB0eXBlIHtTdHJpbmd8T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuX3Bhc3N3b3JkID0gbnVsbDtcbiAgICB0aGlzLl9zaGFyZWRDb25maWcgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1jb25maWcnKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBjb25maWd1cmUob3B0aW9ucykge1xuICAgIHN1cGVyLmNvbmZpZ3VyZShvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgdGhpcy5fcGFzc3dvcmQgPSB0aGlzLl9zaGFyZWRDb25maWcuZ2V0KHRoaXMub3B0aW9ucy5jb25maWdJdGVtKTtcblxuICAgIHRoaXMucmVhZHkoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdwYXNzd29yZCcsIHRoaXMuX29uQWNjZXNzUmVxdWVzdChjbGllbnQpKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25BY2Nlc3NSZXF1ZXN0KGNsaWVudCkge1xuICAgIHJldHVybiAocGFzc3dvcmQpID0+IHtcbiAgICAgIGxldCBtYXRjaDtcblxuICAgICAgaWYgKHR5cGVvZiB0aGlzLl9wYXNzd29yZCA9PT0gJ3N0cmluZycpXG4gICAgICAgIG1hdGNoID0gdGhpcy5fcGFzc3dvcmQ7XG4gICAgICBlbHNlXG4gICAgICAgIG1hdGNoID0gdGhpcy5fcGFzc3dvcmRbY2xpZW50LnR5cGVdO1xuXG4gICAgICBpZiAocGFzc3dvcmQgIT09IG1hdGNoKVxuICAgICAgICB0aGlzLnNlbmQoY2xpZW50LCAncmVmdXNlZCcpO1xuICAgICAgZWxzZVxuICAgICAgICB0aGlzLnNlbmQoY2xpZW50LCAnZ3JhbnRlZCcpO1xuICAgIH07XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgQXV0aCk7XG5cbmV4cG9ydCBkZWZhdWx0IEF1dGg7XG4iXX0=