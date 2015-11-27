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
 * Error messages written in the `view` when the device doesn't pass the platform check.
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
 * [client] Check whether the device is compatible with the technologies used in the *Soundworks* library.
 *
 * Compatible devices are running on iOS 7 or above, or on Android 4.2 or above with the Chrome browser in version 35 or above.
 * If that is not the case, the module displays a blocking `view` and prevents the participant to go any further in the scenario.
 *
 * The module finishes its initialization immediately if the device passes the platform test, and never otherwise.
 */

var Platform = (function (_Module) {
  _inherits(Platform, _Module);

  /**
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvUGxhdGZvcm0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OzswQkFBNkIsYUFBYTs7d0JBQ3JCLFVBQVU7Ozs7c0JBQ1osVUFBVTs7Ozt1QkFDVixVQUFVOzs7Ozs7Ozs7OztBQVU3QixJQUFNLGVBQWUsR0FBRztBQUN0QixZQUFVLEVBQUUsaUVBQWlFO0FBQzdFLGdCQUFjLEVBQUUsNkRBQTZEO0FBQzdFLFNBQU8sRUFBRSxrRUFBa0U7Q0FDNUUsQ0FBQzs7Ozs7Ozs7Ozs7SUFVbUIsUUFBUTtZQUFSLFFBQVE7Ozs7Ozs7Ozs7OztBQVVoQixXQVZRLFFBQVEsR0FVRDtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBVkwsUUFBUTs7QUFXekIsK0JBWGlCLFFBQVEsNkNBV25CLE9BQU8sQ0FBQyxJQUFJLElBQUksZ0JBQWdCLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUU7O0FBRTdELFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7QUFDcEMsUUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztBQUN0QyxRQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxRQUFRLElBQUksZUFBZSxDQUFDO0FBQ3JELFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUM7R0FDeEM7Ozs7OztlQWpCa0IsUUFBUTs7V0FzQnRCLGlCQUFHO0FBQ04saUNBdkJpQixRQUFRLHVDQXVCWDs7QUFFZCxVQUFJLEdBQUcsR0FBRyxJQUFJLENBQUM7QUFDZixVQUFNLEVBQUUsR0FBRyxvQkFBTyxRQUFRLENBQUMsRUFBRSxDQUFDO0FBQzlCLFVBQU0sUUFBUSxHQUFHLG9CQUFPLFFBQVEsQ0FBQyxRQUFRLENBQUM7O0FBRTFDLFVBQUksSUFBSSxDQUFDLE9BQU8sRUFDZCxPQUFPLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFckIsVUFBSSx5QkFBYSxFQUFFO0FBQ2pCLFlBQUksRUFBRSxLQUFLLEtBQUssRUFBRTtBQUNoQixhQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7U0FDakMsTUFBTSxJQUFJLEVBQUUsS0FBSyxTQUFTLEVBQUU7QUFDM0IsYUFBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDO1NBQ3JDLE1BQU07QUFDTCxhQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7U0FDOUI7T0FDRixNQUFNLElBQUksQ0FBQyxRQUFRLElBQUksb0JBQU8sUUFBUSxDQUFDLEVBQUUsS0FBSyxPQUFPLEVBQUU7QUFDdEQsV0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO09BQzlCLE1BQU0sSUFBSSxvQkFBTyxRQUFRLENBQUMsRUFBRSxLQUFLLEtBQUssSUFBSSxzQkFBUyxFQUFFLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRTtBQUNwRSxXQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7T0FDakMsTUFBTSxJQUFJLG9CQUFPLFFBQVEsQ0FBQyxFQUFFLEtBQUssU0FBUyxJQUFJLHNCQUFTLEVBQUUsQ0FBQyxPQUFPLEdBQUcsS0FBSyxFQUFFO0FBQzFFLFdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQztPQUNyQzs7QUFFRCxVQUFJLEdBQUcsS0FBSyxJQUFJLEVBQUU7QUFDaEIsWUFBSSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxHQUFHLEdBQUcsR0FBRyxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO09BQ2xGLE1BQU07QUFDTCxZQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7T0FDYjtLQUNGOzs7Ozs7O1dBS00sbUJBQUc7QUFDUixpQ0EzRGlCLFFBQVEseUNBMkRUO0FBQ2hCLFVBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUNiOzs7U0E3RGtCLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6InNyYy9jbGllbnQvUGxhdGZvcm0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhdWRpb0NvbnRleHQgfSBmcm9tICd3YXZlcy1hdWRpbyc7XG5pbXBvcnQgcGxhdGZvcm0gZnJvbSAncGxhdGZvcm0nO1xuaW1wb3J0IGNsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQgTW9kdWxlIGZyb20gJy4vTW9kdWxlJztcblxuXG4vKipcbiAqIEVycm9yIG1lc3NhZ2VzIHdyaXR0ZW4gaW4gdGhlIGB2aWV3YCB3aGVuIHRoZSBkZXZpY2UgZG9lc24ndCBwYXNzIHRoZSBwbGF0Zm9ybSBjaGVjay5cbiAqIEB0eXBlIHtPYmplY3R9XG4gKiBAcHJvcGVydHkge3N0cmluZ30gaW9zVmVyc2lvblxuICogQHByb3BlcnR5IHtzdHJpbmd9IGFuZHJvaWRWZXJzaW9uXG4gKiBAcHJvcGVydHkge3N0cmluZ30gd3JvbmdPU1xuICovXG5jb25zdCBkZWZhdWx0TWVzc2FnZXMgPSB7XG4gIGlvc1ZlcnNpb246IFwiVGhpcyBhcHBsaWNhdGlvbiByZXF1aXJlcyBhdCBsZWFzdCBpT1MgNyB3aXRoIFNhZmFyaSBvciBDaHJvbWUuXCIsXG4gIGFuZHJvaWRWZXJzaW9uOiBcIlRoaXMgYXBwbGljYXRpb24gcmVxdWlyZXMgYXQgbGVhc3QgQW5kcm9pZCA0LjIgd2l0aCBDaHJvbWUuXCIsXG4gIHdyb25nT1M6IFwiVGhpcyBhcHBsaWNhdGlvbiBpcyBkZXNpZ25lZCBmb3IgaU9TIGFuZCBBbmRyb2lkIG1vYmlsZSBkZXZpY2VzLlwiXG59O1xuXG4vKipcbiAqIFtjbGllbnRdIENoZWNrIHdoZXRoZXIgdGhlIGRldmljZSBpcyBjb21wYXRpYmxlIHdpdGggdGhlIHRlY2hub2xvZ2llcyB1c2VkIGluIHRoZSAqU291bmR3b3JrcyogbGlicmFyeS5cbiAqXG4gKiBDb21wYXRpYmxlIGRldmljZXMgYXJlIHJ1bm5pbmcgb24gaU9TIDcgb3IgYWJvdmUsIG9yIG9uIEFuZHJvaWQgNC4yIG9yIGFib3ZlIHdpdGggdGhlIENocm9tZSBicm93c2VyIGluIHZlcnNpb24gMzUgb3IgYWJvdmUuXG4gKiBJZiB0aGF0IGlzIG5vdCB0aGUgY2FzZSwgdGhlIG1vZHVsZSBkaXNwbGF5cyBhIGJsb2NraW5nIGB2aWV3YCBhbmQgcHJldmVudHMgdGhlIHBhcnRpY2lwYW50IHRvIGdvIGFueSBmdXJ0aGVyIGluIHRoZSBzY2VuYXJpby5cbiAqXG4gKiBUaGUgbW9kdWxlIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbiBpbW1lZGlhdGVseSBpZiB0aGUgZGV2aWNlIHBhc3NlcyB0aGUgcGxhdGZvcm0gdGVzdCwgYW5kIG5ldmVyIG90aGVyd2lzZS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxhdGZvcm0gZXh0ZW5kcyBNb2R1bGUge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0ncGxhdGZvcm0tY2hlY2snXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvcj0nYmxhY2snXSBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBgdmlld2AuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5wcmVmaXg9JyddIEFkZGl0aW9uYWwgY29udGVudCBkaXNwbGF5ZWQgYmVmb3JlIHRoZSBlcnJvciBtZXNzYWdlICgqZS5nLiogYCdXZWxjb21lIHRvIE15IFNjZW5hcmlvISdgKS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLnBvc3RmaXg9JyddIEFkZGl0aW9uYWwgY29udGVudCBkaXNwbGF5ZWQgYWZ0ZXIgdGhlIGVycm9yIG1lc3NhZ2UgKCplLmcuKiBgJ1lvdSBjYW4gc3RpbGwgZW5qb3kgdGhlIHBlcmZvcm1hbmNlIHdpdGggb3RoZXJzISdgKS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm1lc3NhZ2VzPWRlZmF1bHRNZXNzYWdlc10gRXJyb3IgbWVzc2FnZXMgZGlzcGxheWVkIHdoZW4gdGhlIGRldmljZSBkb2Vzbid0IHBhc3MgdGhlIHBsYXRmb3JtIGNoZWNrLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmJ5cGFzcz1mYWxzZV0gV2hlbiBzZXQgdG8gYHRydWVgLCB0aGUgbW9kdWxlIGlzIGJ5cGFzc2VkIChjYWxscyB0aGUgYGRvbmVgbWV0aG9kIGltbWVkaWF0ZWx5KS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAncGxhdGZvcm0tY2hlY2snLCB0cnVlLCBvcHRpb25zLmNvbG9yKTtcblxuICAgIHRoaXMuX3ByZWZpeCA9IG9wdGlvbnMucHJlZml4IHx8ICcnO1xuICAgIHRoaXMuX3Bvc3RmaXggPSBvcHRpb25zLnBvc3RmaXggfHzCoCcnO1xuICAgIHRoaXMuX21lc3NhZ2VzID0gb3B0aW9ucy5tZXNzYWdlcyB8fCBkZWZhdWx0TWVzc2FnZXM7XG4gICAgdGhpcy5fYnlwYXNzID0gb3B0aW9ucy5ieXBhc3MgfHzCoGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgbGV0IG1zZyA9IG51bGw7XG4gICAgY29uc3Qgb3MgPSBjbGllbnQucGxhdGZvcm0ub3M7XG4gICAgY29uc3QgaXNNb2JpbGUgPSBjbGllbnQucGxhdGZvcm0uaXNNb2JpbGU7XG5cbiAgICBpZiAodGhpcy5fYnlwYXNzKVxuICAgICAgcmV0dXJuIHRoaXMuZG9uZSgpO1xuXG4gICAgaWYgKCFhdWRpb0NvbnRleHQpIHtcbiAgICAgIGlmIChvcyA9PT0gJ2lvcycpIHtcbiAgICAgICAgbXNnID0gdGhpcy5fbWVzc2FnZXMuaW9zVmVyc2lvbjtcbiAgICAgIH0gZWxzZSBpZiAob3MgPT09ICdhbmRyb2lkJykge1xuICAgICAgICBtc2cgPSB0aGlzLl9tZXNzYWdlcy5hbmRyb2lkVmVyc2lvbjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1zZyA9IHRoaXMuX21lc3NhZ2VzLndyb25nT1M7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICghaXNNb2JpbGUgfHwgY2xpZW50LnBsYXRmb3JtLm9zID09PSAnb3RoZXInKSB7XG4gICAgICBtc2cgPSB0aGlzLl9tZXNzYWdlcy53cm9uZ09TO1xuICAgIH0gZWxzZSBpZiAoY2xpZW50LnBsYXRmb3JtLm9zID09PSAnaW9zJyAmJiBwbGF0Zm9ybS5vcy52ZXJzaW9uIDwgJzcnKSB7XG4gICAgICBtc2cgPSB0aGlzLl9tZXNzYWdlcy5pb3NWZXJzaW9uO1xuICAgIH0gZWxzZSBpZiAoY2xpZW50LnBsYXRmb3JtLm9zID09PSAnYW5kcm9pZCcgJiYgcGxhdGZvcm0ub3MudmVyc2lvbiA8ICc0LjInKSB7XG4gICAgICBtc2cgPSB0aGlzLl9tZXNzYWdlcy5hbmRyb2lkVmVyc2lvbjtcbiAgICB9XG5cbiAgICBpZiAobXNnICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnNldENlbnRlcmVkVmlld0NvbnRlbnQodGhpcy5fcHJlZml4ICsgJzxwPicgKyBtc2cgKyAnPC9wPicgKyB0aGlzLl9wb3N0Zml4KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kb25lKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXN0YXJ0KCkge1xuICAgIHN1cGVyLnJlc3RhcnQoKTtcbiAgICB0aGlzLmRvbmUoKTtcbiAgfVxufVxuIl19