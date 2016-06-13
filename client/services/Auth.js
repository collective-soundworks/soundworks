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
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(AuthView).apply(this, arguments));
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

    var _this3 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Auth).call(this, SERVICE_ID, true));

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
      (0, _get3.default)((0, _getPrototypeOf2.default)(Auth.prototype), 'start', this).call(this);

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
      (0, _get3.default)((0, _getPrototypeOf2.default)(Auth.prototype), 'stop', this).call(this);

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
//# sourceMappingURL=data:application/json;base64,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Jy4uL2NvcmUvY2xpZW50JztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgU2VnbWVudGVkVmlldyBmcm9tICcuLi92aWV3cy9TZWdtZW50ZWRWaWV3JztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6YXV0aCc7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgdmlldyBvZiB0aGUgYGF1dGhgIHNlcnZpY2UuXG4gKlxuICogQGludGVyZmFjZSBBYnN0cmFjdEF1dGhWaWV3XG4gKiBAZXh0ZW5kcyBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlld1xuICovXG4vKipcbiAqIFNldCB0aGUgY2FsbGJhY2sgdGhhdCBzaG91bGQgYmUgZXhlY3V0ZWQgd2hlbiB0aGUgc2VuZCBhY3Rpb24gaXMgZXhlY3V0ZWRcbiAqIG9uIHRoZSB2aWV3LlxuICpcbiAqIEBmdW5jdGlvblxuICogQG5hbWUgQWJzdHJhY3RBdXRoVmlldy5vblNlbmRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIGdpdmVuIGJ5IHRoZSBgYXV0aGAgc2VydmljZS5cbiAqL1xuY2xhc3MgQXV0aFZpZXcgZXh0ZW5kcyBTZWdtZW50ZWRWaWV3IHtcbiAgb25TZW5kKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5pbnN0YWxsRXZlbnRzKHtcbiAgICAgICd0b3VjaHN0YXJ0ICNzZW5kJzogKCkgPT4ge1xuICAgICAgICBjb25zdCBwYXNzd29yZCA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJyNwYXNzd29yZCcpLnZhbHVlO1xuXG4gICAgICAgIGlmIChwYXNzd29yZCAhPT0gJycpXG4gICAgICAgICAgY2FsbGJhY2socGFzc3dvcmQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IGRlZmF1bHRWaWV3VGVtcGxhdGUgPSBgXG48JSBpZiAoIXJlamVjdGVkKSB7ICU+XG4gIDxkaXYgY2xhc3M9XCJzZWN0aW9uLXRvcCBmbGV4LW1pZGRsZVwiPlxuICAgIDxwPjwlPSBpbnN0cnVjdGlvbnMgJT48L3A+XG4gIDwvZGl2PlxuICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1jZW50ZXIgZmxleC1jZW50ZXJcIj5cbiAgICA8ZGl2PlxuICAgICAgPGlucHV0IHR5cGU9XCJwYXNzd29yZFwiIGlkPVwicGFzc3dvcmRcIiAvPlxuICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0blwiIGlkPVwic2VuZFwiPjwlPSBzZW5kICU+PC9idXR0b24+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1ib3R0b21cIj48L2Rpdj5cbjwlIH0gZWxzZSB7ICU+XG4gIDxkaXYgY2xhc3M9XCJzZWN0aW9uLXRvcFwiPjwvZGl2PlxuICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1jZW50ZXIgZmxleC1jZW50ZXJcIj5cbiAgICA8cD48JT0gcmVqZWN0TWVzc2FnZSAlPjwvcD5cbiAgPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWJvdHRvbVwiPjwvZGl2PlxuPCUgfSAlPmA7XG5cbmNvbnN0IGRlZmF1bHRWaWV3Q29udGVudCA9IHtcbiAgaW5zdHJ1Y3Rpb25zOiAnTG9naW4nLFxuICBzZW5kOiAnU2VuZCcsXG4gIHJlamVjdE1lc3NhZ2U6IGBTb3JyeSwgeW91IGRvbid0IGhhdmUgYWNjZXNzIHRvIHRoaXMgY2xpZW50YCxcbiAgcmVqZWN0ZWQ6IGZhbHNlLFxufTtcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBjbGllbnQgYGF1dGhgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIGFsbG93cyB0byBsb2NrIHRoZSBhcHBsaWNhdGlvbiB0byBzcGVjaWZpYyB1c2VycyBieSBhZGRpbmcgYVxuICogc2ltcGxlIGxvZ2dpbmcgcGFnZSB0byB0aGUgY2xpZW50LlxuICpcbiAqIDxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPjogVGhpcyBzZXJ2aWNlIHNob3VsZG4ndCBiZSBjb25zaWRlcmVkXG4gKiBzZWN1cmUgZnJvbSBhIHByb2R1Y3Rpb24gcHJlc3BlY3RpdmUuXG4gKlxuICogX18qVGhlIHNlcnZpY2UgbXVzdCBiZSB1c2VkIHdpdGggaXRzIFtzZXJ2ZXItc2lkZSBjb3VudGVycGFydF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLkF1dGh9Kl9fXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQGV4YW1wbGVcbiAqIHRoaXMuYXV0aCA9IHRoaXMucmVxdWlyZSgnYXV0aCcpO1xuICovXG5jbGFzcyBBdXRoIGV4dGVuZHMgU2VydmljZSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbmNpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIHRydWUpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICB2aWV3UHJpb3JpdHk6IDEwMCxcbiAgICAgIHZpZXdDdG9yOiBBdXRoVmlldyxcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuXG4gICAgdGhpcy5fZGVmYXVsdFZpZXdUZW1wbGF0ZSA9IGRlZmF1bHRWaWV3VGVtcGxhdGU7XG4gICAgdGhpcy5fZGVmYXVsdFZpZXdDb250ZW50ID0gZGVmYXVsdFZpZXdDb250ZW50O1xuXG4gICAgdGhpcy5fb25BY2Nlc0dyYW50ZWRSZXNwb25zZSA9IHRoaXMuX29uQWNjZXNHcmFudGVkUmVzcG9uc2UuYmluZCh0aGlzKTtcbiAgICB0aGlzLl9vbkFjY2VzUmVmdXNlZFJlc3BvbnNlID0gdGhpcy5fb25BY2Nlc1JlZnVzZWRSZXNwb25zZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX3NlbmRQYXNzd29yZCA9IHRoaXMuX3NlbmRQYXNzd29yZC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGluaXQoKSB7XG4gICAgdGhpcy5fcGFzc3dvcmQgPSBudWxsO1xuXG4gICAgdGhpcy52aWV3Q3RvciA9IHRoaXMub3B0aW9ucy52aWV3Q3RvcjtcbiAgICB0aGlzLnZpZXcgPSB0aGlzLmNyZWF0ZVZpZXcoKTtcbiAgICB0aGlzLnZpZXcub25TZW5kKHRoaXMuX3NlbmRQYXNzd29yZCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICghdGhpcy5oYXNTdGFydGVkKVxuICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICB0aGlzLnJlY2VpdmUoJ2dyYW50ZWQnLCB0aGlzLl9vbkFjY2VzR3JhbnRlZFJlc3BvbnNlKTtcbiAgICB0aGlzLnJlY2VpdmUoJ3JlZnVzZWQnLCB0aGlzLl9vbkFjY2VzUmVmdXNlZFJlc3BvbnNlKTtcblxuICAgIGNvbnN0IHN0b3JlZFBhc3N3b3JkID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3NvdW5kd29ya3M6c2VydmljZTphdXRoJyk7XG5cbiAgICBpZiAoc3RvcmVkUGFzc3dvcmQgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuX3NlbmRQYXNzd29yZChzdG9yZWRQYXNzd29yZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2hvdygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdG9wKCkge1xuICAgIHN1cGVyLnN0b3AoKTtcblxuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ2dyYW50ZWQnLCB0aGlzLl9vbkFjY2VzR3JhbnRlZFJlc3BvbnNlKTtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdyZWZ1c2VkJywgdGhpcy5fb25BY2Nlc1JlZnVzZWRSZXNwb25zZSk7XG5cbiAgICB0aGlzLmhpZGUoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfc2VuZFBhc3N3b3JkKHBhc3N3b3JkKSB7XG4gICAgdGhpcy5fcGFzc3dvcmQgPSBwYXNzd29yZDtcbiAgICB0aGlzLnNlbmQoJ3Bhc3N3b3JkJywgcGFzc3dvcmQpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vbkFjY2VzR3JhbnRlZFJlc3BvbnNlKCkge1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdzb3VuZHdvcmtzOnNlcnZpY2U6YXV0aCcsIHRoaXMuX3Bhc3N3b3JkKTtcbiAgICB0aGlzLnJlYWR5KCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uQWNjZXNSZWZ1c2VkUmVzcG9uc2UoKSB7XG4gICAgdGhpcy52aWV3LmNvbnRlbnQucmVqZWN0ZWQgPSB0cnVlO1xuICAgIHRoaXMudmlldy5yZW5kZXIoKTtcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBBdXRoKTtcblxuZXhwb3J0IGRlZmF1bHQgQXV0aDtcbiJdfQ==