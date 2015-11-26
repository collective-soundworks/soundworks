'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _wavesAudio = require('waves-audio');

var _platform = require('platform');

var _platform2 = _interopRequireDefault(_platform);

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _Module2 = require('./Module');

var _Module3 = _interopRequireDefault(_Module2);

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

var Platform = (function (_Module) {
  _inherits(Platform, _Module);

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

  function Platform() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Platform);

    _get(Object.getPrototypeOf(Platform.prototype), 'constructor', this).call(this, options.name || 'platform-check', true, options.color);

    this._prefix = options.prefix || '';
    this._postfix = options.postfix || '';
    this._messages = options.messages || defaultMessages;
    this._bypass = options.bypass || false;
  }

  /**
   * @private
   */

  _createClass(Platform, [{
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(Platform.prototype), 'start', this).call(this);

      var msg = null;
      var os = _client2['default'].platform.os;
      var isMobile = _client2['default'].platform.isMobile;

      if (this._bypass) return this.done();

      if (!_wavesAudio.audioContext) {
        if (os === 'ios') {
          msg = this._messages.iosVersion;
        } else if (os === 'android') {
          msg = this._messages.androidVersion;
        } else {
          msg = this._messages.wrongOS;
        }
      } else if (!isMobile || _client2['default'].platform.os === 'other') {
        msg = this._messages.wrongOS;
      } else if (_client2['default'].platform.os === 'ios' && _platform2['default'].os.version < '7') {
        msg = this._messages.iosVersion;
      } else if (_client2['default'].platform.os === 'android' && _platform2['default'].os.version < '4.2') {
        msg = this._messages.androidVersion;
      }

      if (msg !== null) {
        this.setCenteredViewContent(this._prefix + '<p>' + msg + '</p>' + this._postfix);
      } else {
        this.done();
      }
    }

    /**
     * @private
     */
  }, {
    key: 'restart',
    value: function restart() {
      _get(Object.getPrototypeOf(Platform.prototype), 'restart', this).call(this);
      this.done();
    }
  }]);

  return Platform;
})(_Module3['default']);

exports['default'] = Platform;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvUGxhdGZvcm0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OzswQkFBNkIsYUFBYTs7d0JBQ3JCLFVBQVU7Ozs7c0JBQ1osVUFBVTs7Ozt1QkFDVixVQUFVOzs7Ozs7Ozs7OztBQVU3QixJQUFNLGVBQWUsR0FBRztBQUN0QixZQUFVLEVBQUUsaUVBQWlFO0FBQzdFLGdCQUFjLEVBQUUsNkRBQTZEO0FBQzdFLFNBQU8sRUFBRSxrRUFBa0U7Q0FDNUUsQ0FBQzs7Ozs7Ozs7O0lBUW1CLFFBQVE7WUFBUixRQUFROzs7Ozs7Ozs7Ozs7O0FBV2hCLFdBWFEsUUFBUSxHQVdEO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFYTCxRQUFROztBQVl6QiwrQkFaaUIsUUFBUSw2Q0FZbkIsT0FBTyxDQUFDLElBQUksSUFBSSxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLEtBQUssRUFBRTs7QUFFN0QsUUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQztBQUNwQyxRQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO0FBQ3RDLFFBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLFFBQVEsSUFBSSxlQUFlLENBQUM7QUFDckQsUUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQztHQUN4Qzs7Ozs7O2VBbEJrQixRQUFROztXQXVCdEIsaUJBQUc7QUFDTixpQ0F4QmlCLFFBQVEsdUNBd0JYOztBQUVkLFVBQUksR0FBRyxHQUFHLElBQUksQ0FBQztBQUNmLFVBQU0sRUFBRSxHQUFHLG9CQUFPLFFBQVEsQ0FBQyxFQUFFLENBQUM7QUFDOUIsVUFBTSxRQUFRLEdBQUcsb0JBQU8sUUFBUSxDQUFDLFFBQVEsQ0FBQzs7QUFFMUMsVUFBSSxJQUFJLENBQUMsT0FBTyxFQUNkLE9BQU8sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDOztBQUVyQixVQUFJLHlCQUFhLEVBQUU7QUFDakIsWUFBSSxFQUFFLEtBQUssS0FBSyxFQUFFO0FBQ2hCLGFBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztTQUNqQyxNQUFNLElBQUksRUFBRSxLQUFLLFNBQVMsRUFBRTtBQUMzQixhQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUM7U0FDckMsTUFBTTtBQUNMLGFBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztTQUM5QjtPQUNGLE1BQU0sSUFBSSxDQUFDLFFBQVEsSUFBSSxvQkFBTyxRQUFRLENBQUMsRUFBRSxLQUFLLE9BQU8sRUFBRTtBQUN0RCxXQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7T0FDOUIsTUFBTSxJQUFJLG9CQUFPLFFBQVEsQ0FBQyxFQUFFLEtBQUssS0FBSyxJQUFJLHNCQUFTLEVBQUUsQ0FBQyxPQUFPLEdBQUcsR0FBRyxFQUFFO0FBQ3BFLFdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztPQUNqQyxNQUFNLElBQUksb0JBQU8sUUFBUSxDQUFDLEVBQUUsS0FBSyxTQUFTLElBQUksc0JBQVMsRUFBRSxDQUFDLE9BQU8sR0FBRyxLQUFLLEVBQUU7QUFDMUUsV0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDO09BQ3JDOztBQUVELFVBQUksR0FBRyxLQUFLLElBQUksRUFBRTtBQUNoQixZQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7T0FDbEYsTUFBTTtBQUNMLFlBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztPQUNiO0tBQ0Y7Ozs7Ozs7V0FLTSxtQkFBRztBQUNSLGlDQTVEaUIsUUFBUSx5Q0E0RFQ7QUFDaEIsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2I7OztTQTlEa0IsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoic3JjL2NsaWVudC9QbGF0Zm9ybS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGF1ZGlvQ29udGV4dCB9IGZyb20gJ3dhdmVzLWF1ZGlvJztcbmltcG9ydCBwbGF0Zm9ybSBmcm9tICdwbGF0Zm9ybSc7XG5pbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCBNb2R1bGUgZnJvbSAnLi9Nb2R1bGUnO1xuXG5cbi8qKlxuICogTWVzc2FnZXMgd3JpdHRlbiBpbiB0aGUgdmlldyB3aGVuIHRoZSBkZXZpY2UgY2FuJ3QgcGFzcyB0aGUgcGxhdGZvcm0gY2hlY2suXG4gKiBAdHlwZSB7T2JqZWN0fVxuICogQHByb3BlcnR5IHtzdHJpbmd9IGlvc1ZlcnNpb25cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBhbmRyb2lkVmVyc2lvblxuICogQHByb3BlcnR5IHtzdHJpbmd9IHdyb25nT1NcbiAqL1xuY29uc3QgZGVmYXVsdE1lc3NhZ2VzID0ge1xuICBpb3NWZXJzaW9uOiBcIlRoaXMgYXBwbGljYXRpb24gcmVxdWlyZXMgYXQgbGVhc3QgaU9TIDcgd2l0aCBTYWZhcmkgb3IgQ2hyb21lLlwiLFxuICBhbmRyb2lkVmVyc2lvbjogXCJUaGlzIGFwcGxpY2F0aW9uIHJlcXVpcmVzIGF0IGxlYXN0IEFuZHJvaWQgNC4yIHdpdGggQ2hyb21lLlwiLFxuICB3cm9uZ09TOiBcIlRoaXMgYXBwbGljYXRpb24gaXMgZGVzaWduZWQgZm9yIGlPUyBhbmQgQW5kcm9pZCBtb2JpbGUgZGV2aWNlcy5cIlxufTtcblxuLyoqXG4gKiBUaGUge0BsaW5rIENsaWVudFBsYXRmb3JtfSBjaGVja3Mgd2hldGhlciB0aGUgZGV2aWNlIGlzIGNvbXBhdGlibGUgd2l0aCB0aGUgdGVjaG5vbG9naWVzIHVzZWQgaW4gdGhlICpTb3VuZHdvcmtzKiBsaWJyYXJ5LlxuICogKENvbXBhdGlibGUgZGV2aWNlcyBhcmUgcnVubmluZyBvbiBpT1MgNyBvciBhYm92ZSwgb3Igb24gQW5kcm9pZCA0LjIgb3IgYWJvdmUgd2l0aCB0aGUgQ2hyb21lIGJyb3dzZXIgaW4gdmVyc2lvbiAzNSBvciBhYm92ZS4pXG4gKiBJZiB0aGF0IGlzIG5vdCB0aGUgY2FzZSwgdGhlIG1vZHVsZSBkaXNwbGF5cyBhIGJsb2NraW5nIHZpZXcgYW5kIHByZXZlbnRzIHRoZSBwYXJ0aWNpcGFudCB0byBnbyBhbnkgZnVydGhlciBpbiB0aGUgc2NlbmFyaW8uXG4gKiBUaGUge0BsaW5rIENsaWVudFBsYXRmb3JtfSBtb2R1bGUgY2FsbHMgaXRzIGBkb25lYCBtZXRob2QgaW1tZWRpYXRlbHkgaWYgdGhlIGRldmljZSBwYXNzZXMgdGhlIHBsYXRmb3JtIHRlc3QsIGFuZCBuZXZlciBvdGhlcndpc2UuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXRmb3JtIGV4dGVuZHMgTW9kdWxlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLiBBbHdheXMgaGFzIGEgdmlldy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0ncGxhdGZvcm0tY2hlY2snXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvcj0nYmxhY2snXSBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBgdmlld2AuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5wcmVmaXg9JyddIEFkZGl0aW9uYWwgY29udGVudCBkaXNwbGF5ZWQgYmVmb3JlIHRoZSBlcnJvciBtZXNzYWdlICgqZS5nLiogYCdXZWxjb21lIHRvIE15IFNjZW5hcmlvISdgKS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLnBvc3RmaXg9JyddIEFkZGl0aW9uYWwgY29udGVudCBkaXNwbGF5ZWQgYWZ0ZXIgdGhlIGVycm9yIG1lc3NhZ2UgKCplLmcuKiBgJ1lvdSBjYW4gc3RpbGwgZW5qb3kgdGhlIHBlcmZvcm1hbmNlIHdpdGggb3RoZXJzISdgKS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm1lc3NhZ2VzPWRlZmF1bHRNZXNzYWdlc10gRXJyb3IgbWVzc2FnZXMgZGlzcGxheWVkIHdoZW4gdGhlIGRldmljZSBkb2Vzbid0IHBhc3MgdGhlIHBsYXRmb3JtIGNoZWNrLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmJ5cGFzcz1mYWxzZV0gV2hlbiBzZXQgdG8gYHRydWVgLCB0aGUgbW9kdWxlIGlzIGJ5cGFzc2VkIChjYWxscyB0aGUgYGRvbmVgbWV0aG9kIGltbWVkaWF0ZWx5KS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAncGxhdGZvcm0tY2hlY2snLCB0cnVlLCBvcHRpb25zLmNvbG9yKTtcblxuICAgIHRoaXMuX3ByZWZpeCA9IG9wdGlvbnMucHJlZml4IHx8ICcnO1xuICAgIHRoaXMuX3Bvc3RmaXggPSBvcHRpb25zLnBvc3RmaXggfHzCoCcnO1xuICAgIHRoaXMuX21lc3NhZ2VzID0gb3B0aW9ucy5tZXNzYWdlcyB8fCBkZWZhdWx0TWVzc2FnZXM7XG4gICAgdGhpcy5fYnlwYXNzID0gb3B0aW9ucy5ieXBhc3MgfHzCoGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgbGV0IG1zZyA9IG51bGw7XG4gICAgY29uc3Qgb3MgPSBjbGllbnQucGxhdGZvcm0ub3M7XG4gICAgY29uc3QgaXNNb2JpbGUgPSBjbGllbnQucGxhdGZvcm0uaXNNb2JpbGU7XG5cbiAgICBpZiAodGhpcy5fYnlwYXNzKVxuICAgICAgcmV0dXJuIHRoaXMuZG9uZSgpO1xuXG4gICAgaWYgKCFhdWRpb0NvbnRleHQpIHtcbiAgICAgIGlmIChvcyA9PT0gJ2lvcycpIHtcbiAgICAgICAgbXNnID0gdGhpcy5fbWVzc2FnZXMuaW9zVmVyc2lvbjtcbiAgICAgIH0gZWxzZSBpZiAob3MgPT09ICdhbmRyb2lkJykge1xuICAgICAgICBtc2cgPSB0aGlzLl9tZXNzYWdlcy5hbmRyb2lkVmVyc2lvbjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1zZyA9IHRoaXMuX21lc3NhZ2VzLndyb25nT1M7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICghaXNNb2JpbGUgfHwgY2xpZW50LnBsYXRmb3JtLm9zID09PSAnb3RoZXInKSB7XG4gICAgICBtc2cgPSB0aGlzLl9tZXNzYWdlcy53cm9uZ09TO1xuICAgIH0gZWxzZSBpZiAoY2xpZW50LnBsYXRmb3JtLm9zID09PSAnaW9zJyAmJiBwbGF0Zm9ybS5vcy52ZXJzaW9uIDwgJzcnKSB7XG4gICAgICBtc2cgPSB0aGlzLl9tZXNzYWdlcy5pb3NWZXJzaW9uO1xuICAgIH0gZWxzZSBpZiAoY2xpZW50LnBsYXRmb3JtLm9zID09PSAnYW5kcm9pZCcgJiYgcGxhdGZvcm0ub3MudmVyc2lvbiA8ICc0LjInKSB7XG4gICAgICBtc2cgPSB0aGlzLl9tZXNzYWdlcy5hbmRyb2lkVmVyc2lvbjtcbiAgICB9XG5cbiAgICBpZiAobXNnICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnNldENlbnRlcmVkVmlld0NvbnRlbnQodGhpcy5fcHJlZml4ICsgJzxwPicgKyBtc2cgKyAnPC9wPicgKyB0aGlzLl9wb3N0Zml4KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kb25lKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXN0YXJ0KCkge1xuICAgIHN1cGVyLnJlc3RhcnQoKTtcbiAgICB0aGlzLmRvbmUoKTtcbiAgfVxufVxuIl19