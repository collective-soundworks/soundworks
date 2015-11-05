'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var audioContext = require('waves-audio').audioContext;
var platform = require('platform');
var client = require('./client');
var ClientModule = require('./ClientModule');
// import client from './client.es6.js';
// import ClientModule from './ClientModule.es6.js';

/**
 * Messages written in the view when the device can't pass the platform check.
 * @type {Object}
 * @property {string} iosVersion
 * @property {string} androidVersion
 * @property {string} wrongOS
 */
var defaultMessages = {
  iosVersion: "This application requires at least iOS 7 with Safari or Chrome.",
  androidVersion: "This application requires at least Android 4.2 with Chrome.",
  wrongOS: "This application is designed for iOS and Android mobile devices."
};

/**
 * The {@link ClientPlatform} checks whether the device is compatible with the technologies used in the *Soundworks* library.
 * (Compatible devices are running on iOS 7 or above, or on Android 4.2 or above with the Chrome browser in version 35 or above.)
 * If that is not the case, the module displays a blocking view and prevents the participant to go any further in the scenario.
 * The {@link ClientPlatform} module calls its `done` method immediately if the device passes the platform test, and never otherwise.
 */

var ClientPlatform = (function (_ClientModule) {
  _inherits(ClientPlatform, _ClientModule);

  // export default class ClientPlatform extends ClientModule {
  /**
   * Creates an instance of the class. Always has a view.
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='platform-check'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   * @param {String} [options.prefix=''] Additional content displayed before the error message (*e.g.* `'Welcome to My Scenario!'`).
   * @param {String} [options.postfix=''] Additional content displayed after the error message (*e.g.* `'You can still enjoy the performance with others!'`).
   * @param {String} [options.messages=defaultMessages] Error messages displayed when the device doesn't pass the platform check.
   * @param {Boolean} [options.bypass=false] When set to `true`, the module is bypassed (calls the `done`method immediately).
   */

  function ClientPlatform() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ClientPlatform);

    _get(Object.getPrototypeOf(ClientPlatform.prototype), 'constructor', this).call(this, options.name || 'platform-check', true, options.color);

    this._prefix = options.prefix || '';
    this._postfix = options.postfix || '';
    this._messages = options.messages || defaultMessages;
    this._bypass = options.bypass || false;
  }

  _createClass(ClientPlatform, [{
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(ClientPlatform.prototype), 'start', this).call(this);

      var msg = null;
      var os = client.platform.os;
      var isMobile = client.platform.isMobile;

      if (this._bypass) return this.done();

      if (!audioContext) {
        if (os === 'ios') {
          msg = this._messages.iosVersion;
        } else if (os === 'android') {
          msg = this._messages.androidVersion;
        } else {
          msg = this._messages.wrongOS;
        }
      } else if (!isMobile || client.platform.os === 'other') {
        msg = this._messages.wrongOS;
      } else if (client.platform.os === 'ios' && platform.os.version < '7') {
        msg = this._messages.iosVersion;
      } else if (client.platform.os === 'android' && platform.os.version < '4.2') {
        msg = this._messages.androidVersion;
      }

      if (msg !== null) {
        this.setCenteredViewContent(this._prefix + '<p>' + msg + '</p>' + this._postfix);
      } else {
        this.done();
      }
    }
  }, {
    key: 'restart',
    value: function restart() {
      _get(Object.getPrototypeOf(ClientPlatform.prototype), 'restart', this).call(this);
      this.done();
    }
  }]);

  return ClientPlatform;
})(ClientModule);

module.exports = ClientPlatform;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvUGxhdGZvcm0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7Ozs7Ozs7O0FBRWIsSUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFlBQVksQ0FBQztBQUN6RCxJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDckMsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ25DLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOzs7Ozs7Ozs7OztBQVcvQyxJQUFNLGVBQWUsR0FBRztBQUN0QixZQUFVLEVBQUUsaUVBQWlFO0FBQzdFLGdCQUFjLEVBQUUsNkRBQTZEO0FBQzdFLFNBQU8sRUFBRSxrRUFBa0U7Q0FDNUUsQ0FBQzs7Ozs7Ozs7O0lBUUksY0FBYztZQUFkLGNBQWM7Ozs7Ozs7Ozs7Ozs7O0FBWVAsV0FaUCxjQUFjLEdBWVE7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQVpwQixjQUFjOztBQWFoQiwrQkFiRSxjQUFjLDZDQWFWLE9BQU8sQ0FBQyxJQUFJLElBQUksZ0JBQWdCLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUU7O0FBRTdELFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7QUFDcEMsUUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztBQUN0QyxRQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxRQUFRLElBQUksZUFBZSxDQUFDO0FBQ3JELFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUM7R0FDeEM7O2VBbkJHLGNBQWM7O1dBcUJiLGlCQUFHO0FBQ04saUNBdEJFLGNBQWMsdUNBc0JGOztBQUVkLFVBQUksR0FBRyxHQUFHLElBQUksQ0FBQztBQUNmLFVBQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDO0FBQzlCLFVBQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDOztBQUUxQyxVQUFJLElBQUksQ0FBQyxPQUFPLEVBQ2QsT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRXJCLFVBQUksQ0FBQyxZQUFZLEVBQUU7QUFDakIsWUFBSSxFQUFFLEtBQUssS0FBSyxFQUFFO0FBQ2hCLGFBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztTQUNqQyxNQUFNLElBQUksRUFBRSxLQUFLLFNBQVMsRUFBRTtBQUMzQixhQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUM7U0FDckMsTUFBTTtBQUNMLGFBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztTQUM5QjtPQUNGLE1BQU0sSUFBSSxDQUFDLFFBQVEsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsS0FBSyxPQUFPLEVBQUU7QUFDdEQsV0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO09BQzlCLE1BQU0sSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsS0FBSyxLQUFLLElBQUksUUFBUSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEdBQUcsR0FBRyxFQUFFO0FBQ3BFLFdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztPQUNqQyxNQUFNLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEtBQUssU0FBUyxJQUFJLFFBQVEsQ0FBQyxFQUFFLENBQUMsT0FBTyxHQUFHLEtBQUssRUFBRTtBQUMxRSxXQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUM7T0FDckM7O0FBRUQsVUFBSSxHQUFHLEtBQUssSUFBSSxFQUFFO0FBQ2hCLFlBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssR0FBRyxHQUFHLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztPQUNsRixNQUFNO0FBQ0wsWUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO09BQ2I7S0FDRjs7O1dBRU0sbUJBQUc7QUFDUixpQ0F2REUsY0FBYyx5Q0F1REE7QUFDaEIsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2I7OztTQXpERyxjQUFjO0dBQVMsWUFBWTs7QUE0RHpDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsY0FBYyxDQUFDIiwiZmlsZSI6InNyYy9jbGllbnQvUGxhdGZvcm0uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmNvbnN0IGF1ZGlvQ29udGV4dCA9IHJlcXVpcmUoJ3dhdmVzLWF1ZGlvJykuYXVkaW9Db250ZXh0O1xuY29uc3QgcGxhdGZvcm0gPSByZXF1aXJlKCdwbGF0Zm9ybScpO1xuY29uc3QgY2xpZW50ID0gcmVxdWlyZSgnLi9jbGllbnQnKTtcbmNvbnN0IENsaWVudE1vZHVsZSA9IHJlcXVpcmUoJy4vQ2xpZW50TW9kdWxlJyk7XG4vLyBpbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50LmVzNi5qcyc7XG4vLyBpbXBvcnQgQ2xpZW50TW9kdWxlIGZyb20gJy4vQ2xpZW50TW9kdWxlLmVzNi5qcyc7XG5cbi8qKlxuICogTWVzc2FnZXMgd3JpdHRlbiBpbiB0aGUgdmlldyB3aGVuIHRoZSBkZXZpY2UgY2FuJ3QgcGFzcyB0aGUgcGxhdGZvcm0gY2hlY2suXG4gKiBAdHlwZSB7T2JqZWN0fVxuICogQHByb3BlcnR5IHtzdHJpbmd9IGlvc1ZlcnNpb25cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBhbmRyb2lkVmVyc2lvblxuICogQHByb3BlcnR5IHtzdHJpbmd9IHdyb25nT1NcbiAqL1xuY29uc3QgZGVmYXVsdE1lc3NhZ2VzID0ge1xuICBpb3NWZXJzaW9uOiBcIlRoaXMgYXBwbGljYXRpb24gcmVxdWlyZXMgYXQgbGVhc3QgaU9TIDcgd2l0aCBTYWZhcmkgb3IgQ2hyb21lLlwiLFxuICBhbmRyb2lkVmVyc2lvbjogXCJUaGlzIGFwcGxpY2F0aW9uIHJlcXVpcmVzIGF0IGxlYXN0IEFuZHJvaWQgNC4yIHdpdGggQ2hyb21lLlwiLFxuICB3cm9uZ09TOiBcIlRoaXMgYXBwbGljYXRpb24gaXMgZGVzaWduZWQgZm9yIGlPUyBhbmQgQW5kcm9pZCBtb2JpbGUgZGV2aWNlcy5cIlxufTtcblxuLyoqXG4gKiBUaGUge0BsaW5rIENsaWVudFBsYXRmb3JtfSBjaGVja3Mgd2hldGhlciB0aGUgZGV2aWNlIGlzIGNvbXBhdGlibGUgd2l0aCB0aGUgdGVjaG5vbG9naWVzIHVzZWQgaW4gdGhlICpTb3VuZHdvcmtzKiBsaWJyYXJ5LlxuICogKENvbXBhdGlibGUgZGV2aWNlcyBhcmUgcnVubmluZyBvbiBpT1MgNyBvciBhYm92ZSwgb3Igb24gQW5kcm9pZCA0LjIgb3IgYWJvdmUgd2l0aCB0aGUgQ2hyb21lIGJyb3dzZXIgaW4gdmVyc2lvbiAzNSBvciBhYm92ZS4pXG4gKiBJZiB0aGF0IGlzIG5vdCB0aGUgY2FzZSwgdGhlIG1vZHVsZSBkaXNwbGF5cyBhIGJsb2NraW5nIHZpZXcgYW5kIHByZXZlbnRzIHRoZSBwYXJ0aWNpcGFudCB0byBnbyBhbnkgZnVydGhlciBpbiB0aGUgc2NlbmFyaW8uXG4gKiBUaGUge0BsaW5rIENsaWVudFBsYXRmb3JtfSBtb2R1bGUgY2FsbHMgaXRzIGBkb25lYCBtZXRob2QgaW1tZWRpYXRlbHkgaWYgdGhlIGRldmljZSBwYXNzZXMgdGhlIHBsYXRmb3JtIHRlc3QsIGFuZCBuZXZlciBvdGhlcndpc2UuXG4gKi9cbmNsYXNzIENsaWVudFBsYXRmb3JtIGV4dGVuZHMgQ2xpZW50TW9kdWxlIHtcbi8vIGV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudFBsYXRmb3JtIGV4dGVuZHMgQ2xpZW50TW9kdWxlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLiBBbHdheXMgaGFzIGEgdmlldy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0ncGxhdGZvcm0tY2hlY2snXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvcj0nYmxhY2snXSBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBgdmlld2AuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5wcmVmaXg9JyddIEFkZGl0aW9uYWwgY29udGVudCBkaXNwbGF5ZWQgYmVmb3JlIHRoZSBlcnJvciBtZXNzYWdlICgqZS5nLiogYCdXZWxjb21lIHRvIE15IFNjZW5hcmlvISdgKS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLnBvc3RmaXg9JyddIEFkZGl0aW9uYWwgY29udGVudCBkaXNwbGF5ZWQgYWZ0ZXIgdGhlIGVycm9yIG1lc3NhZ2UgKCplLmcuKiBgJ1lvdSBjYW4gc3RpbGwgZW5qb3kgdGhlIHBlcmZvcm1hbmNlIHdpdGggb3RoZXJzISdgKS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm1lc3NhZ2VzPWRlZmF1bHRNZXNzYWdlc10gRXJyb3IgbWVzc2FnZXMgZGlzcGxheWVkIHdoZW4gdGhlIGRldmljZSBkb2Vzbid0IHBhc3MgdGhlIHBsYXRmb3JtIGNoZWNrLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmJ5cGFzcz1mYWxzZV0gV2hlbiBzZXQgdG8gYHRydWVgLCB0aGUgbW9kdWxlIGlzIGJ5cGFzc2VkIChjYWxscyB0aGUgYGRvbmVgbWV0aG9kIGltbWVkaWF0ZWx5KS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAncGxhdGZvcm0tY2hlY2snLCB0cnVlLCBvcHRpb25zLmNvbG9yKTtcblxuICAgIHRoaXMuX3ByZWZpeCA9IG9wdGlvbnMucHJlZml4IHx8ICcnO1xuICAgIHRoaXMuX3Bvc3RmaXggPSBvcHRpb25zLnBvc3RmaXggfHzCoCcnO1xuICAgIHRoaXMuX21lc3NhZ2VzID0gb3B0aW9ucy5tZXNzYWdlcyB8fCBkZWZhdWx0TWVzc2FnZXM7XG4gICAgdGhpcy5fYnlwYXNzID0gb3B0aW9ucy5ieXBhc3MgfHzCoGZhbHNlO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGxldCBtc2cgPSBudWxsO1xuICAgIGNvbnN0IG9zID0gY2xpZW50LnBsYXRmb3JtLm9zO1xuICAgIGNvbnN0IGlzTW9iaWxlID0gY2xpZW50LnBsYXRmb3JtLmlzTW9iaWxlO1xuXG4gICAgaWYgKHRoaXMuX2J5cGFzcylcbiAgICAgIHJldHVybiB0aGlzLmRvbmUoKTtcblxuICAgIGlmICghYXVkaW9Db250ZXh0KSB7XG4gICAgICBpZiAob3MgPT09ICdpb3MnKSB7XG4gICAgICAgIG1zZyA9IHRoaXMuX21lc3NhZ2VzLmlvc1ZlcnNpb247XG4gICAgICB9IGVsc2UgaWYgKG9zID09PSAnYW5kcm9pZCcpIHtcbiAgICAgICAgbXNnID0gdGhpcy5fbWVzc2FnZXMuYW5kcm9pZFZlcnNpb247XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtc2cgPSB0aGlzLl9tZXNzYWdlcy53cm9uZ09TO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIWlzTW9iaWxlIHx8IGNsaWVudC5wbGF0Zm9ybS5vcyA9PT0gJ290aGVyJykge1xuICAgICAgbXNnID0gdGhpcy5fbWVzc2FnZXMud3JvbmdPUztcbiAgICB9IGVsc2UgaWYgKGNsaWVudC5wbGF0Zm9ybS5vcyA9PT0gJ2lvcycgJiYgcGxhdGZvcm0ub3MudmVyc2lvbiA8ICc3Jykge1xuICAgICAgbXNnID0gdGhpcy5fbWVzc2FnZXMuaW9zVmVyc2lvbjtcbiAgICB9IGVsc2UgaWYgKGNsaWVudC5wbGF0Zm9ybS5vcyA9PT0gJ2FuZHJvaWQnICYmIHBsYXRmb3JtLm9zLnZlcnNpb24gPCAnNC4yJykge1xuICAgICAgbXNnID0gdGhpcy5fbWVzc2FnZXMuYW5kcm9pZFZlcnNpb247XG4gICAgfVxuXG4gICAgaWYgKG1zZyAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5zZXRDZW50ZXJlZFZpZXdDb250ZW50KHRoaXMuX3ByZWZpeCArICc8cD4nICsgbXNnICsgJzwvcD4nICsgdGhpcy5fcG9zdGZpeCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZG9uZSgpO1xuICAgIH1cbiAgfVxuXG4gIHJlc3RhcnQoKSB7XG4gICAgc3VwZXIucmVzdGFydCgpO1xuICAgIHRoaXMuZG9uZSgpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ2xpZW50UGxhdGZvcm07XG4iXX0=