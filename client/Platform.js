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

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _ClientModule2 = require('./ClientModule');

var _ClientModule3 = _interopRequireDefault(_ClientModule2);

// @todo - remove one of these dependencies

var _platform = require('platform');

var _platform2 = _interopRequireDefault(_platform);

var _mobileDetect = require('mobile-detect');

var _mobileDetect2 = _interopRequireDefault(_mobileDetect);

/**
 * Error messages written in the `view` when the device doesn't pass the platform check.
 * @type {Object}
 * @property {string} iosVersion
 * @property {string} androidVersion
 * @property {string} wrongOS
 */
var defaultMessages = {
  iosVersion: 'This application requires at least iOS 7 with Safari or Chrome.',
  androidVersion: 'This application requires at least Android 4.2 with Chrome.',
  wrongOS: 'This application is designed for iOS and Android mobile devices.'
};

/**
 * [client] Check whether the device is compatible with the technologies used in the *Soundworks* library.
 *
 * Compatible devices are running on iOS 7 or above, or on Android 4.2 or above with the Chrome browser in version 35 or above.
 * If that is not the case, the module displays a blocking `view` and prevents the participant to go any further in the scenario.
 *
 * The module finishes its initialization immediately if the device passes the platform test, and never otherwise.
 */

var Platform = (function (_ClientModule) {
  _inherits(Platform, _ClientModule);

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

  _createClass(Platform, [{
    key: '_getPlatform',
    value: function _getPlatform() {
      var ua = window.navigator.userAgent;
      var md = new _mobileDetect2['default'](ua);
      _client2['default'].platform.isMobile = md.mobile() !== null; // true if phone or tablet
      _client2['default'].platform.os = (function () {
        var os = md.os();

        if (os === 'AndroidOS') {
          return 'android';
        } else if (os === 'iOS') {
          return 'ios';
        } else {
          return 'other';
        }
      })();
    }
  }, {
    key: '_getAudioFileExtention',
    value: function _getAudioFileExtention() {
      var a = document.createElement('audio');
      // http://diveintohtml5.info/everything.html
      if (!!(a.canPlayType && a.canPlayType('audio/mpeg;'))) {
        _client2['default'].platform.audioFileExt = '.mp3';
      } else if (!!(a.canPlayType && a.canPlayType('audio/ogg; codecs="vorbis"'))) {
        _client2['default'].platform.audioFileExt = '.ogg';
      } else {
        _client2['default'].platform.audioFileExt = '.wav';
      }
    }

    /**
     * @private
     */
  }, {
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(Platform.prototype), 'start', this).call(this);

      this._getPlatform();
      this._getAudioFileExtention();

      // display an error message if platform is not supported
      var msg = null;
      var os = _client2['default'].platform.os;
      var isMobile = _client2['default'].platform.isMobile;

      // bypass thos module for in browser testing
      if (this._bypass) {
        return this.done();
      }

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
})(_ClientModule3['default']);

exports['default'] = Platform;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvUGxhdGZvcm0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OzswQkFBNkIsYUFBYTs7c0JBQ3ZCLFVBQVU7Ozs7NkJBQ0osZ0JBQWdCOzs7Ozs7d0JBRXBCLFVBQVU7Ozs7NEJBQ04sZUFBZTs7Ozs7Ozs7Ozs7QUFVeEMsSUFBTSxlQUFlLEdBQUc7QUFDdEIsWUFBVSxFQUFFLGlFQUFpRTtBQUM3RSxnQkFBYyxFQUFFLDZEQUE2RDtBQUM3RSxTQUFPLEVBQUUsa0VBQWtFO0NBQzVFLENBQUM7Ozs7Ozs7Ozs7O0lBVW1CLFFBQVE7WUFBUixRQUFROzs7Ozs7Ozs7Ozs7QUFVaEIsV0FWUSxRQUFRLEdBVUQ7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQVZMLFFBQVE7O0FBV3pCLCtCQVhpQixRQUFRLDZDQVduQixPQUFPLENBQUMsSUFBSSxJQUFJLGdCQUFnQixFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsS0FBSyxFQUFFOztBQUU3RCxRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDO0FBQ3BDLFFBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUM7QUFDdEMsUUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsUUFBUSxJQUFJLGVBQWUsQ0FBQztBQUNyRCxRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDO0dBQ3hDOztlQWpCa0IsUUFBUTs7V0FtQmYsd0JBQUc7QUFDYixVQUFNLEVBQUUsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQTtBQUNyQyxVQUFNLEVBQUUsR0FBRyw4QkFBaUIsRUFBRSxDQUFDLENBQUM7QUFDaEMsMEJBQU8sUUFBUSxDQUFDLFFBQVEsR0FBSSxFQUFFLENBQUMsTUFBTSxFQUFFLEtBQUssSUFBSSxBQUFDLENBQUM7QUFDbEQsMEJBQU8sUUFBUSxDQUFD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LEVBQUUsQ0FBQztLQUNiOzs7U0E5RmtCLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6InNyYy9jbGllbnQvUGxhdGZvcm0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhdWRpb0NvbnRleHQgfSBmcm9tICd3YXZlcy1hdWRpbyc7XG5pbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCBDbGllbnRNb2R1bGUgZnJvbSAnLi9DbGllbnRNb2R1bGUnO1xuLy8gQHRvZG8gLSByZW1vdmUgb25lIG9mIHRoZXNlIGRlcGVuZGVuY2llc1xuaW1wb3J0IHBsYXRmb3JtIGZyb20gJ3BsYXRmb3JtJztcbmltcG9ydCBNb2JpbGVEZXRlY3QgZnJvbSAnbW9iaWxlLWRldGVjdCc7XG5cblxuLyoqXG4gKiBFcnJvciBtZXNzYWdlcyB3cml0dGVuIGluIHRoZSBgdmlld2Agd2hlbiB0aGUgZGV2aWNlIGRvZXNuJ3QgcGFzcyB0aGUgcGxhdGZvcm0gY2hlY2suXG4gKiBAdHlwZSB7T2JqZWN0fVxuICogQHByb3BlcnR5IHtzdHJpbmd9IGlvc1ZlcnNpb25cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBhbmRyb2lkVmVyc2lvblxuICogQHByb3BlcnR5IHtzdHJpbmd9IHdyb25nT1NcbiAqL1xuY29uc3QgZGVmYXVsdE1lc3NhZ2VzID0ge1xuICBpb3NWZXJzaW9uOiAnVGhpcyBhcHBsaWNhdGlvbiByZXF1aXJlcyBhdCBsZWFzdCBpT1MgNyB3aXRoIFNhZmFyaSBvciBDaHJvbWUuJyxcbiAgYW5kcm9pZFZlcnNpb246ICdUaGlzIGFwcGxpY2F0aW9uIHJlcXVpcmVzIGF0IGxlYXN0IEFuZHJvaWQgNC4yIHdpdGggQ2hyb21lLicsXG4gIHdyb25nT1M6ICdUaGlzIGFwcGxpY2F0aW9uIGlzIGRlc2lnbmVkIGZvciBpT1MgYW5kIEFuZHJvaWQgbW9iaWxlIGRldmljZXMuJ1xufTtcblxuLyoqXG4gKiBbY2xpZW50XSBDaGVjayB3aGV0aGVyIHRoZSBkZXZpY2UgaXMgY29tcGF0aWJsZSB3aXRoIHRoZSB0ZWNobm9sb2dpZXMgdXNlZCBpbiB0aGUgKlNvdW5kd29ya3MqIGxpYnJhcnkuXG4gKlxuICogQ29tcGF0aWJsZSBkZXZpY2VzIGFyZSBydW5uaW5nIG9uIGlPUyA3IG9yIGFib3ZlLCBvciBvbiBBbmRyb2lkIDQuMiBvciBhYm92ZSB3aXRoIHRoZSBDaHJvbWUgYnJvd3NlciBpbiB2ZXJzaW9uIDM1IG9yIGFib3ZlLlxuICogSWYgdGhhdCBpcyBub3QgdGhlIGNhc2UsIHRoZSBtb2R1bGUgZGlzcGxheXMgYSBibG9ja2luZyBgdmlld2AgYW5kIHByZXZlbnRzIHRoZSBwYXJ0aWNpcGFudCB0byBnbyBhbnkgZnVydGhlciBpbiB0aGUgc2NlbmFyaW8uXG4gKlxuICogVGhlIG1vZHVsZSBmaW5pc2hlcyBpdHMgaW5pdGlhbGl6YXRpb24gaW1tZWRpYXRlbHkgaWYgdGhlIGRldmljZSBwYXNzZXMgdGhlIHBsYXRmb3JtIHRlc3QsIGFuZCBuZXZlciBvdGhlcndpc2UuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXRmb3JtIGV4dGVuZHMgQ2xpZW50TW9kdWxlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm5hbWU9J3BsYXRmb3JtLWNoZWNrJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuY29sb3I9J2JsYWNrJ10gQmFja2dyb3VuZCBjb2xvciBvZiB0aGUgYHZpZXdgLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMucHJlZml4PScnXSBBZGRpdGlvbmFsIGNvbnRlbnQgZGlzcGxheWVkIGJlZm9yZSB0aGUgZXJyb3IgbWVzc2FnZSAoKmUuZy4qIGAnV2VsY29tZSB0byBNeSBTY2VuYXJpbyEnYCkuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5wb3N0Zml4PScnXSBBZGRpdGlvbmFsIGNvbnRlbnQgZGlzcGxheWVkIGFmdGVyIHRoZSBlcnJvciBtZXNzYWdlICgqZS5nLiogYCdZb3UgY2FuIHN0aWxsIGVuam95IHRoZSBwZXJmb3JtYW5jZSB3aXRoIG90aGVycyEnYCkuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5tZXNzYWdlcz1kZWZhdWx0TWVzc2FnZXNdIEVycm9yIG1lc3NhZ2VzIGRpc3BsYXllZCB3aGVuIHRoZSBkZXZpY2UgZG9lc24ndCBwYXNzIHRoZSBwbGF0Zm9ybSBjaGVjay5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5ieXBhc3M9ZmFsc2VdIFdoZW4gc2V0IHRvIGB0cnVlYCwgdGhlIG1vZHVsZSBpcyBieXBhc3NlZCAoY2FsbHMgdGhlIGBkb25lYG1ldGhvZCBpbW1lZGlhdGVseSkuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ3BsYXRmb3JtLWNoZWNrJywgdHJ1ZSwgb3B0aW9ucy5jb2xvcik7XG5cbiAgICB0aGlzLl9wcmVmaXggPSBvcHRpb25zLnByZWZpeCB8fCAnJztcbiAgICB0aGlzLl9wb3N0Zml4ID0gb3B0aW9ucy5wb3N0Zml4IHx8wqAnJztcbiAgICB0aGlzLl9tZXNzYWdlcyA9IG9wdGlvbnMubWVzc2FnZXMgfHwgZGVmYXVsdE1lc3NhZ2VzO1xuICAgIHRoaXMuX2J5cGFzcyA9IG9wdGlvbnMuYnlwYXNzIHx8wqBmYWxzZTtcbiAgfVxuXG4gIF9nZXRQbGF0Zm9ybSgpIHtcbiAgICBjb25zdCB1YSA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50XG4gICAgY29uc3QgbWQgPSBuZXcgTW9iaWxlRGV0ZWN0KHVhKTtcbiAgICBjbGllbnQucGxhdGZvcm0uaXNNb2JpbGUgPSAobWQubW9iaWxlKCkgIT09IG51bGwpOyAvLyB0cnVlIGlmIHBob25lIG9yIHRhYmxldFxuICAgIGNsaWVudC5wbGF0Zm9ybS5vcyA9ICgoKSA9PiB7XG4gICAgICBsZXQgb3MgPSBtZC5vcygpO1xuXG4gICAgICBpZiAob3MgPT09ICdBbmRyb2lkT1MnKSB7XG4gICAgICAgIHJldHVybiAnYW5kcm9pZCc7XG4gICAgICB9IGVsc2UgaWYgKG9zID09PSAnaU9TJykge1xuICAgICAgICByZXR1cm4gJ2lvcyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gJ290aGVyJztcbiAgICAgIH1cbiAgICB9KSgpO1xuICB9XG5cbiAgX2dldEF1ZGlvRmlsZUV4dGVudGlvbigpIHtcbiAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYXVkaW8nKTtcbiAgICAvLyBodHRwOi8vZGl2ZWludG9odG1sNS5pbmZvL2V2ZXJ5dGhpbmcuaHRtbFxuICAgIGlmICghIShhLmNhblBsYXlUeXBlICYmIGEuY2FuUGxheVR5cGUoJ2F1ZGlvL21wZWc7JykpKSB7XG4gICAgICBjbGllbnQucGxhdGZvcm0uYXVkaW9GaWxlRXh0ID0gJy5tcDMnO1xuICAgIH0gZWxzZSBpZiAoISEoYS5jYW5QbGF5VHlwZSAmJiBhLmNhblBsYXlUeXBlKCdhdWRpby9vZ2c7IGNvZGVjcz1cInZvcmJpc1wiJykpKSB7XG4gICAgICBjbGllbnQucGxhdGZvcm0uYXVkaW9GaWxlRXh0ID0gJy5vZ2cnO1xuICAgIH0gZWxzZSB7XG4gICAgICBjbGllbnQucGxhdGZvcm0uYXVkaW9GaWxlRXh0ID0gJy53YXYnO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIHRoaXMuX2dldFBsYXRmb3JtKCk7XG4gICAgdGhpcy5fZ2V0QXVkaW9GaWxlRXh0ZW50aW9uKCk7XG5cbiAgICAvLyBkaXNwbGF5IGFuIGVycm9yIG1lc3NhZ2UgaWYgcGxhdGZvcm0gaXMgbm90IHN1cHBvcnRlZFxuICAgIGxldCBtc2cgPSBudWxsO1xuICAgIGNvbnN0IG9zID0gY2xpZW50LnBsYXRmb3JtLm9zO1xuICAgIGNvbnN0IGlzTW9iaWxlID0gY2xpZW50LnBsYXRmb3JtLmlzTW9iaWxlO1xuXG4gICAgLy8gYnlwYXNzIHRob3MgbW9kdWxlIGZvciBpbiBicm93c2VyIHRlc3RpbmdcbiAgICBpZiAodGhpcy5fYnlwYXNzKSB7IHJldHVybiB0aGlzLmRvbmUoKTsgfVxuXG4gICAgaWYgKCFhdWRpb0NvbnRleHQpIHtcbiAgICAgIGlmIChvcyA9PT0gJ2lvcycpIHtcbiAgICAgICAgbXNnID0gdGhpcy5fbWVzc2FnZXMuaW9zVmVyc2lvbjtcbiAgICAgIH0gZWxzZSBpZiAob3MgPT09ICdhbmRyb2lkJykge1xuICAgICAgICBtc2cgPSB0aGlzLl9tZXNzYWdlcy5hbmRyb2lkVmVyc2lvbjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1zZyA9IHRoaXMuX21lc3NhZ2VzLndyb25nT1M7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICghaXNNb2JpbGUgfHwgY2xpZW50LnBsYXRmb3JtLm9zID09PSAnb3RoZXInKSB7XG4gICAgICBtc2cgPSB0aGlzLl9tZXNzYWdlcy53cm9uZ09TO1xuICAgIH0gZWxzZSBpZiAoY2xpZW50LnBsYXRmb3JtLm9zID09PSAnaW9zJyAmJiBwbGF0Zm9ybS5vcy52ZXJzaW9uIDwgJzcnKSB7XG4gICAgICBtc2cgPSB0aGlzLl9tZXNzYWdlcy5pb3NWZXJzaW9uO1xuICAgIH0gZWxzZSBpZiAoY2xpZW50LnBsYXRmb3JtLm9zID09PSAnYW5kcm9pZCcgJiYgcGxhdGZvcm0ub3MudmVyc2lvbiA8ICc0LjInKSB7XG4gICAgICBtc2cgPSB0aGlzLl9tZXNzYWdlcy5hbmRyb2lkVmVyc2lvbjtcbiAgICB9XG5cbiAgICBpZiAobXNnICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnNldENlbnRlcmVkVmlld0NvbnRlbnQoYCR7dGhpcy5fcHJlZml4fTxwPiR7bXNnfTwvcD4ke3RoaXMuX3Bvc3RmaXh9YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZG9uZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVzdGFydCgpIHtcbiAgICBzdXBlci5yZXN0YXJ0KCk7XG4gICAgdGhpcy5kb25lKCk7XG4gIH1cbn1cbiJdfQ==