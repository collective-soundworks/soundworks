'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _client = require('../core/client');

var _client2 = _interopRequireDefault(_client);

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _SegmentedView2 = require('../views/SegmentedView');

var _SegmentedView3 = _interopRequireDefault(_SegmentedView2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:auth';

/**
 * Interface for the view of the `auth` service.
 *
 * @interface AbstractAuthView
 * @extends module:soundworks/client.View
 */
/**
 * Set the callback that should be executed when the send action is executed
 * on the view.
 *
 * @function
 * @name AbstractAuthView.onSend
 * @param {Function} callback - The callback given by the `auth` service.
 */

var AuthView = function (_SegmentedView) {
  (0, _inherits3.default)(AuthView, _SegmentedView);

  function AuthView() {
    (0, _classCallCheck3.default)(this, AuthView);
    return (0, _possibleConstructorReturn3.default)(this, (AuthView.__proto__ || (0, _getPrototypeOf2.default)(AuthView)).apply(this, arguments));
  }

  (0, _createClass3.default)(AuthView, [{
    key: 'onSend',
    value: function onSend(callback) {
      var _this2 = this;

      this.installEvents({
        'touchstart #send': function touchstartSend() {
          var password = _this2.$el.querySelector('#password').value;

          if (password !== '') callback(password);
        }
      });
    }
  }]);
  return AuthView;
}(_SegmentedView3.default);

var defaultViewTemplate = '\n<% if (!rejected) { %>\n  <div class="section-top flex-middle">\n    <p><%= instructions %></p>\n  </div>\n  <div class="section-center flex-center">\n    <div>\n      <input type="password" id="password" />\n      <button class="btn" id="send"><%= send %></button>\n    </div>\n  </div>\n  <div class="section-bottom"></div>\n<% } else { %>\n  <div class="section-top"></div>\n  <div class="section-center flex-center">\n    <p><%= rejectMessage %></p>\n  </div>\n  <div class="section-bottom"></div>\n<% } %>';

var defaultViewContent = {
  instructions: 'Login',
  send: 'Send',
  rejectMessage: 'Sorry, you don\'t have access to this client',
  rejected: false
};

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
  function Auth(options) {
    (0, _classCallCheck3.default)(this, Auth);

    var _this3 = (0, _possibleConstructorReturn3.default)(this, (Auth.__proto__ || (0, _getPrototypeOf2.default)(Auth)).call(this, SERVICE_ID, true));

    var defaults = {
      viewPriority: 100,
      viewCtor: AuthView
    };

    _this3.configure(defaults);

    _this3._defaultViewTemplate = defaultViewTemplate;
    _this3._defaultViewContent = defaultViewContent;

    _this3._onAccesGrantedResponse = _this3._onAccesGrantedResponse.bind(_this3);
    _this3._onAccesRefusedResponse = _this3._onAccesRefusedResponse.bind(_this3);
    _this3._sendPassword = _this3._sendPassword.bind(_this3);
    return _this3;
  }

  /** @private */


  (0, _createClass3.default)(Auth, [{
    key: 'init',
    value: function init() {
      this._password = null;

      this.viewCtor = this.options.viewCtor;
      this.view = this.createView();
      this.view.onSend(this._sendPassword);
    }

    /** @private */

  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)(Auth.prototype.__proto__ || (0, _getPrototypeOf2.default)(Auth.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

      this.receive('granted', this._onAccesGrantedResponse);
      this.receive('refused', this._onAccesRefusedResponse);

      var storedPassword = localStorage.getItem('soundworks:service:auth');

      if (storedPassword !== null) {
        this._sendPassword(storedPassword);
      } else {
        this.show();
      }
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

    /** @private */

  }, {
    key: '_sendPassword',
    value: function _sendPassword(password) {
      this._password = password;
      this.send('password', password);
    }

    /** @private */

  }, {
    key: '_onAccesGrantedResponse',
    value: function _onAccesGrantedResponse() {
      localStorage.setItem('soundworks:service:auth', this._password);
      this.ready();
    }

    /** @private */

  }, {
    key: '_onAccesRefusedResponse',
    value: function _onAccesRefusedResponse() {
      this.view.content.rejected = true;
      this.view.render();
    }
  }]);
  return Auth;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, Auth);

exports.default = Auth;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1dGguanMiXSwibmFtZXMiOlsiU0VSVklDRV9JRCIsIkF1dGhWaWV3IiwiY2FsbGJhY2siLCJpbnN0YWxsRXZlbnRzIiwicGFzc3dvcmQiLCIkZWwiLCJxdWVyeVNlbGVjdG9yIiwidmFsdWUiLCJkZWZhdWx0Vmlld1RlbXBsYXRlIiwiZGVmYXVsdFZpZXdDb250ZW50IiwiaW5zdHJ1Y3Rpb25zIiwic2VuZCIsInJlamVjdE1lc3NhZ2UiLCJyZWplY3RlZCIsIkF1dGgiLCJvcHRpb25zIiwiZGVmYXVsdHMiLCJ2aWV3UHJpb3JpdHkiLCJ2aWV3Q3RvciIsImNvbmZpZ3VyZSIsIl9kZWZhdWx0Vmlld1RlbXBsYXRlIiwiX2RlZmF1bHRWaWV3Q29udGVudCIsIl9vbkFjY2VzR3JhbnRlZFJlc3BvbnNlIiwiYmluZCIsIl9vbkFjY2VzUmVmdXNlZFJlc3BvbnNlIiwiX3NlbmRQYXNzd29yZCIsIl9wYXNzd29yZCIsInZpZXciLCJjcmVhdGVWaWV3Iiwib25TZW5kIiwiaGFzU3RhcnRlZCIsImluaXQiLCJyZWNlaXZlIiwic3RvcmVkUGFzc3dvcmQiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwic2hvdyIsInJlbW92ZUxpc3RlbmVyIiwiaGlkZSIsInNldEl0ZW0iLCJyZWFkeSIsImNvbnRlbnQiLCJyZW5kZXIiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUdBLElBQU1BLGFBQWEsY0FBbkI7O0FBRUE7Ozs7OztBQU1BOzs7Ozs7Ozs7SUFRTUMsUTs7Ozs7Ozs7OzsyQkFDR0MsUSxFQUFVO0FBQUE7O0FBQ2YsV0FBS0MsYUFBTCxDQUFtQjtBQUNqQiw0QkFBb0IsMEJBQU07QUFDeEIsY0FBTUMsV0FBVyxPQUFLQyxHQUFMLENBQVNDLGFBQVQsQ0FBdUIsV0FBdkIsRUFBb0NDLEtBQXJEOztBQUVBLGNBQUlILGFBQWEsRUFBakIsRUFDRUYsU0FBU0UsUUFBVDtBQUNIO0FBTmdCLE9BQW5CO0FBUUQ7Ozs7O0FBR0gsSUFBTUksd2hCQUFOOztBQW9CQSxJQUFNQyxxQkFBcUI7QUFDekJDLGdCQUFjLE9BRFc7QUFFekJDLFFBQU0sTUFGbUI7QUFHekJDLCtEQUh5QjtBQUl6QkMsWUFBVTtBQUplLENBQTNCOztBQU9BOzs7Ozs7Ozs7Ozs7Ozs7O0lBZU1DLEk7OztBQUNKO0FBQ0EsZ0JBQVlDLE9BQVosRUFBcUI7QUFBQTs7QUFBQSxtSUFDYmYsVUFEYSxFQUNELElBREM7O0FBR25CLFFBQU1nQixXQUFXO0FBQ2ZDLG9CQUFjLEdBREM7QUFFZkMsZ0JBQVVqQjtBQUZLLEtBQWpCOztBQUtBLFdBQUtrQixTQUFMLENBQWVILFFBQWY7O0FBRUEsV0FBS0ksb0JBQUwsR0FBNEJaLG1CQUE1QjtBQUNBLFdBQUthLG1CQUFMLEdBQTJCWixrQkFBM0I7O0FBRUEsV0FBS2EsdUJBQUwsR0FBK0IsT0FBS0EsdUJBQUwsQ0FBNkJDLElBQTdCLFFBQS9CO0FBQ0EsV0FBS0MsdUJBQUwsR0FBK0IsT0FBS0EsdUJBQUwsQ0FBNkJELElBQTdCLFFBQS9CO0FBQ0EsV0FBS0UsYUFBTCxHQUFxQixPQUFLQSxhQUFMLENBQW1CRixJQUFuQixRQUFyQjtBQWZtQjtBQWdCcEI7O0FBRUQ7Ozs7OzJCQUNPO0FBQ0wsV0FBS0csU0FBTCxHQUFpQixJQUFqQjs7QUFFQSxXQUFLUixRQUFMLEdBQWdCLEtBQUtILE9BQUwsQ0FBYUcsUUFBN0I7QUFDQSxXQUFLUyxJQUFMLEdBQVksS0FBS0MsVUFBTCxFQUFaO0FBQ0EsV0FBS0QsSUFBTCxDQUFVRSxNQUFWLENBQWlCLEtBQUtKLGFBQXRCO0FBQ0Q7O0FBRUQ7Ozs7NEJBQ1E7QUFDTjs7QUFFQSxVQUFJLENBQUMsS0FBS0ssVUFBVixFQUNFLEtBQUtDLElBQUw7O0FBRUYsV0FBS0MsT0FBTCxDQUFhLFNBQWIsRUFBd0IsS0FBS1YsdUJBQTdCO0FBQ0EsV0FBS1UsT0FBTCxDQUFhLFNBQWIsRUFBd0IsS0FBS1IsdUJBQTdCOztBQUVBLFVBQU1TLGlCQUFpQkMsYUFBYUMsT0FBYixDQUFxQix5QkFBckIsQ0FBdkI7O0FBRUEsVUFBSUYsbUJBQW1CLElBQXZCLEVBQTZCO0FBQzNCLGFBQUtSLGFBQUwsQ0FBbUJRLGNBQW5CO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsYUFBS0csSUFBTDtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7MkJBQ087QUFDTDs7QUFFQSxXQUFLQyxjQUFMLENBQW9CLFNBQXBCLEVBQStCLEtBQUtmLHVCQUFwQztBQUNBLFdBQUtlLGNBQUwsQ0FBb0IsU0FBcEIsRUFBK0IsS0FBS2IsdUJBQXBDOztBQUVBLFdBQUtjLElBQUw7QUFDRDs7QUFFRDs7OztrQ0FDY2xDLFEsRUFBVTtBQUN0QixXQUFLc0IsU0FBTCxHQUFpQnRCLFFBQWpCO0FBQ0EsV0FBS08sSUFBTCxDQUFVLFVBQVYsRUFBc0JQLFFBQXRCO0FBQ0Q7O0FBRUQ7Ozs7OENBQzBCO0FBQ3hCOEIsbUJBQWFLLE9BQWIsQ0FBcUIseUJBQXJCLEVBQWdELEtBQUtiLFNBQXJEO0FBQ0EsV0FBS2MsS0FBTDtBQUNEOztBQUVEOzs7OzhDQUMwQjtBQUN4QixXQUFLYixJQUFMLENBQVVjLE9BQVYsQ0FBa0I1QixRQUFsQixHQUE2QixJQUE3QjtBQUNBLFdBQUtjLElBQUwsQ0FBVWUsTUFBVjtBQUNEOzs7OztBQUdILHlCQUFlQyxRQUFmLENBQXdCM0MsVUFBeEIsRUFBb0NjLElBQXBDOztrQkFFZUEsSSIsImZpbGUiOiJBdXRoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsaWVudCBmcm9tICcuLi9jb3JlL2NsaWVudCc7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IFNlZ21lbnRlZFZpZXcgZnJvbSAnLi4vdmlld3MvU2VnbWVudGVkVmlldyc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOmF1dGgnO1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIHZpZXcgb2YgdGhlIGBhdXRoYCBzZXJ2aWNlLlxuICpcbiAqIEBpbnRlcmZhY2UgQWJzdHJhY3RBdXRoVmlld1xuICogQGV4dGVuZHMgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXdcbiAqL1xuLyoqXG4gKiBTZXQgdGhlIGNhbGxiYWNrIHRoYXQgc2hvdWxkIGJlIGV4ZWN1dGVkIHdoZW4gdGhlIHNlbmQgYWN0aW9uIGlzIGV4ZWN1dGVkXG4gKiBvbiB0aGUgdmlldy5cbiAqXG4gKiBAZnVuY3Rpb25cbiAqIEBuYW1lIEFic3RyYWN0QXV0aFZpZXcub25TZW5kXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayBnaXZlbiBieSB0aGUgYGF1dGhgIHNlcnZpY2UuXG4gKi9cbmNsYXNzIEF1dGhWaWV3IGV4dGVuZHMgU2VnbWVudGVkVmlldyB7XG4gIG9uU2VuZChjYWxsYmFjaykge1xuICAgIHRoaXMuaW5zdGFsbEV2ZW50cyh7XG4gICAgICAndG91Y2hzdGFydCAjc2VuZCc6ICgpID0+IHtcbiAgICAgICAgY29uc3QgcGFzc3dvcmQgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcjcGFzc3dvcmQnKS52YWx1ZTtcblxuICAgICAgICBpZiAocGFzc3dvcmQgIT09ICcnKVxuICAgICAgICAgIGNhbGxiYWNrKHBhc3N3b3JkKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBkZWZhdWx0Vmlld1RlbXBsYXRlID0gYFxuPCUgaWYgKCFyZWplY3RlZCkgeyAlPlxuICA8ZGl2IGNsYXNzPVwic2VjdGlvbi10b3AgZmxleC1taWRkbGVcIj5cbiAgICA8cD48JT0gaW5zdHJ1Y3Rpb25zICU+PC9wPlxuICA8L2Rpdj5cbiAgPGRpdiBjbGFzcz1cInNlY3Rpb24tY2VudGVyIGZsZXgtY2VudGVyXCI+XG4gICAgPGRpdj5cbiAgICAgIDxpbnB1dCB0eXBlPVwicGFzc3dvcmRcIiBpZD1cInBhc3N3b3JkXCIgLz5cbiAgICAgIDxidXR0b24gY2xhc3M9XCJidG5cIiBpZD1cInNlbmRcIj48JT0gc2VuZCAlPjwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbiAgPGRpdiBjbGFzcz1cInNlY3Rpb24tYm90dG9tXCI+PC9kaXY+XG48JSB9IGVsc2UgeyAlPlxuICA8ZGl2IGNsYXNzPVwic2VjdGlvbi10b3BcIj48L2Rpdj5cbiAgPGRpdiBjbGFzcz1cInNlY3Rpb24tY2VudGVyIGZsZXgtY2VudGVyXCI+XG4gICAgPHA+PCU9IHJlamVjdE1lc3NhZ2UgJT48L3A+XG4gIDwvZGl2PlxuICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1ib3R0b21cIj48L2Rpdj5cbjwlIH0gJT5gO1xuXG5jb25zdCBkZWZhdWx0Vmlld0NvbnRlbnQgPSB7XG4gIGluc3RydWN0aW9uczogJ0xvZ2luJyxcbiAgc2VuZDogJ1NlbmQnLFxuICByZWplY3RNZXNzYWdlOiBgU29ycnksIHlvdSBkb24ndCBoYXZlIGFjY2VzcyB0byB0aGlzIGNsaWVudGAsXG4gIHJlamVjdGVkOiBmYWxzZSxcbn07XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgY2xpZW50IGBhdXRoYCBzZXJ2aWNlLlxuICpcbiAqIFRoaXMgc2VydmljZSBhbGxvd3MgdG8gbG9jayB0aGUgYXBwbGljYXRpb24gdG8gc3BlY2lmaWMgdXNlcnMgYnkgYWRkaW5nIGFcbiAqIHNpbXBsZSBsb2dnaW5nIHBhZ2UgdG8gdGhlIGNsaWVudC5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj46IFRoaXMgc2VydmljZSBzaG91bGRuJ3QgYmUgY29uc2lkZXJlZFxuICogc2VjdXJlIGZyb20gYSBwcm9kdWN0aW9uIHByZXNwZWN0aXZlLlxuICpcbiAqIF9fKlRoZSBzZXJ2aWNlIG11c3QgYmUgdXNlZCB3aXRoIGl0cyBbc2VydmVyLXNpZGUgY291bnRlcnBhcnRde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5BdXRofSpfX1xuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBleGFtcGxlXG4gKiB0aGlzLmF1dGggPSB0aGlzLnJlcXVpcmUoJ2F1dGgnKTtcbiAqL1xuY2xhc3MgQXV0aCBleHRlbmRzIFNlcnZpY2Uge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCB0cnVlKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgdmlld1ByaW9yaXR5OiAxMDAsXG4gICAgICB2aWV3Q3RvcjogQXV0aFZpZXcsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcblxuICAgIHRoaXMuX2RlZmF1bHRWaWV3VGVtcGxhdGUgPSBkZWZhdWx0Vmlld1RlbXBsYXRlO1xuICAgIHRoaXMuX2RlZmF1bHRWaWV3Q29udGVudCA9IGRlZmF1bHRWaWV3Q29udGVudDtcblxuICAgIHRoaXMuX29uQWNjZXNHcmFudGVkUmVzcG9uc2UgPSB0aGlzLl9vbkFjY2VzR3JhbnRlZFJlc3BvbnNlLmJpbmQodGhpcyk7XG4gICAgdGhpcy5fb25BY2Nlc1JlZnVzZWRSZXNwb25zZSA9IHRoaXMuX29uQWNjZXNSZWZ1c2VkUmVzcG9uc2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9zZW5kUGFzc3dvcmQgPSB0aGlzLl9zZW5kUGFzc3dvcmQuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBpbml0KCkge1xuICAgIHRoaXMuX3Bhc3N3b3JkID0gbnVsbDtcblxuICAgIHRoaXMudmlld0N0b3IgPSB0aGlzLm9wdGlvbnMudmlld0N0b3I7XG4gICAgdGhpcy52aWV3ID0gdGhpcy5jcmVhdGVWaWV3KCk7XG4gICAgdGhpcy52aWV3Lm9uU2VuZCh0aGlzLl9zZW5kUGFzc3dvcmQpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBpZiAoIXRoaXMuaGFzU3RhcnRlZClcbiAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgdGhpcy5yZWNlaXZlKCdncmFudGVkJywgdGhpcy5fb25BY2Nlc0dyYW50ZWRSZXNwb25zZSk7XG4gICAgdGhpcy5yZWNlaXZlKCdyZWZ1c2VkJywgdGhpcy5fb25BY2Nlc1JlZnVzZWRSZXNwb25zZSk7XG5cbiAgICBjb25zdCBzdG9yZWRQYXNzd29yZCA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdzb3VuZHdvcmtzOnNlcnZpY2U6YXV0aCcpO1xuXG4gICAgaWYgKHN0b3JlZFBhc3N3b3JkICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl9zZW5kUGFzc3dvcmQoc3RvcmVkUGFzc3dvcmQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNob3coKTtcbiAgICB9XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RvcCgpIHtcbiAgICBzdXBlci5zdG9wKCk7XG5cbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdncmFudGVkJywgdGhpcy5fb25BY2Nlc0dyYW50ZWRSZXNwb25zZSk7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcigncmVmdXNlZCcsIHRoaXMuX29uQWNjZXNSZWZ1c2VkUmVzcG9uc2UpO1xuXG4gICAgdGhpcy5oaWRlKCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX3NlbmRQYXNzd29yZChwYXNzd29yZCkge1xuICAgIHRoaXMuX3Bhc3N3b3JkID0gcGFzc3dvcmQ7XG4gICAgdGhpcy5zZW5kKCdwYXNzd29yZCcsIHBhc3N3b3JkKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25BY2Nlc0dyYW50ZWRSZXNwb25zZSgpIHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnc291bmR3b3JrczpzZXJ2aWNlOmF1dGgnLCB0aGlzLl9wYXNzd29yZCk7XG4gICAgdGhpcy5yZWFkeSgpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vbkFjY2VzUmVmdXNlZFJlc3BvbnNlKCkge1xuICAgIHRoaXMudmlldy5jb250ZW50LnJlamVjdGVkID0gdHJ1ZTtcbiAgICB0aGlzLnZpZXcucmVuZGVyKCk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgQXV0aCk7XG5cbmV4cG9ydCBkZWZhdWx0IEF1dGg7XG4iXX0=