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

var _Module2 = require('./Module');

var _Module3 = _interopRequireDefault(_Module2);

// @todo - remove one of these dependencies

var _platform = require('platform');

var _platform2 = _interopRequireDefault(_platform);

var _mobileDetect = require('mobile-detect');

var _mobileDetect2 = _interopRequireDefault(_mobileDetect);

/**
 * Messages written in the view when the device can't pass the platform check.
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
})(_Module3['default']);

exports['default'] = Platform;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvUGxhdGZvcm0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OzswQkFBNkIsYUFBYTs7c0JBQ3ZCLFVBQVU7Ozs7dUJBQ1YsVUFBVTs7Ozs7O3dCQUVSLFVBQVU7Ozs7NEJBQ04sZUFBZTs7Ozs7Ozs7Ozs7QUFVeEMsSUFBTSxlQUFlLEdBQUc7QUFDdEIsWUFBVSxFQUFFLGlFQUFpRTtBQUM3RSxnQkFBYyxFQUFFLDZEQUE2RDtBQUM3RSxTQUFPLEVBQUUsa0VBQWtFO0NBQzVFLENBQUM7Ozs7Ozs7OztJQVFtQixRQUFRO1lBQVIsUUFBUTs7Ozs7Ozs7Ozs7OztBQVdoQixXQVhRLFFBQVEsR0FXRDtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBWEwsUUFBUTs7QUFZekIsK0JBWmlCLFFBQVEsNkNBWW5CLE9BQU8sQ0FBQyxJQUFJLElBQUksZ0JBQWdCLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUU7O0FBRTdELFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7QUFDcEMsUUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztBQUN0QyxRQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxRQUFRLElBQUksZUFBZSxDQUFDO0FBQ3JELFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUM7R0FDeEM7O2VBbEJrQixRQUFROztXQW9CZix3QkFBRztBQUNiLFVBQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFBO0FBQ3JDLFVBQU0sRUFBRSxHQUFHLDhCQUFpQixFQUFFLENBQUMsQ0FBQztBQUNoQywwQkFBTyxRQUFRLENBQUMsUUFBUSxHQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxJQUFJLEFBQUMsQ0FBQztBQUNsRCwwQkFBTyxRQUFRLENBQUMsRUFB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RSxDQUFDO0tBQ2I7OztTQS9Ga0IsUUFBUTs7O3FCQUFSLFFBQVEiLCJmaWxlIjoic3JjL2NsaWVudC9QbGF0Zm9ybS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGF1ZGlvQ29udGV4dCB9IGZyb20gJ3dhdmVzLWF1ZGlvJztcbmltcG9ydCBjbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IE1vZHVsZSBmcm9tICcuL01vZHVsZSc7XG4vLyBAdG9kbyAtIHJlbW92ZSBvbmUgb2YgdGhlc2UgZGVwZW5kZW5jaWVzXG5pbXBvcnQgcGxhdGZvcm0gZnJvbSAncGxhdGZvcm0nO1xuaW1wb3J0IE1vYmlsZURldGVjdCBmcm9tICdtb2JpbGUtZGV0ZWN0JztcblxuXG4vKipcbiAqIE1lc3NhZ2VzIHdyaXR0ZW4gaW4gdGhlIHZpZXcgd2hlbiB0aGUgZGV2aWNlIGNhbid0IHBhc3MgdGhlIHBsYXRmb3JtIGNoZWNrLlxuICogQHR5cGUge09iamVjdH1cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBpb3NWZXJzaW9uXG4gKiBAcHJvcGVydHkge3N0cmluZ30gYW5kcm9pZFZlcnNpb25cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB3cm9uZ09TXG4gKi9cbmNvbnN0IGRlZmF1bHRNZXNzYWdlcyA9IHtcbiAgaW9zVmVyc2lvbjogJ1RoaXMgYXBwbGljYXRpb24gcmVxdWlyZXMgYXQgbGVhc3QgaU9TIDcgd2l0aCBTYWZhcmkgb3IgQ2hyb21lLicsXG4gIGFuZHJvaWRWZXJzaW9uOiAnVGhpcyBhcHBsaWNhdGlvbiByZXF1aXJlcyBhdCBsZWFzdCBBbmRyb2lkIDQuMiB3aXRoIENocm9tZS4nLFxuICB3cm9uZ09TOiAnVGhpcyBhcHBsaWNhdGlvbiBpcyBkZXNpZ25lZCBmb3IgaU9TIGFuZCBBbmRyb2lkIG1vYmlsZSBkZXZpY2VzLidcbn07XG5cbi8qKlxuICogVGhlIHtAbGluayBDbGllbnRQbGF0Zm9ybX0gY2hlY2tzIHdoZXRoZXIgdGhlIGRldmljZSBpcyBjb21wYXRpYmxlIHdpdGggdGhlIHRlY2hub2xvZ2llcyB1c2VkIGluIHRoZSAqU291bmR3b3JrcyogbGlicmFyeS5cbiAqIChDb21wYXRpYmxlIGRldmljZXMgYXJlIHJ1bm5pbmcgb24gaU9TIDcgb3IgYWJvdmUsIG9yIG9uIEFuZHJvaWQgNC4yIG9yIGFib3ZlIHdpdGggdGhlIENocm9tZSBicm93c2VyIGluIHZlcnNpb24gMzUgb3IgYWJvdmUuKVxuICogSWYgdGhhdCBpcyBub3QgdGhlIGNhc2UsIHRoZSBtb2R1bGUgZGlzcGxheXMgYSBibG9ja2luZyB2aWV3IGFuZCBwcmV2ZW50cyB0aGUgcGFydGljaXBhbnQgdG8gZ28gYW55IGZ1cnRoZXIgaW4gdGhlIHNjZW5hcmlvLlxuICogVGhlIHtAbGluayBDbGllbnRQbGF0Zm9ybX0gbW9kdWxlIGNhbGxzIGl0cyBgZG9uZWAgbWV0aG9kIGltbWVkaWF0ZWx5IGlmIHRoZSBkZXZpY2UgcGFzc2VzIHRoZSBwbGF0Zm9ybSB0ZXN0LCBhbmQgbmV2ZXIgb3RoZXJ3aXNlLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF0Zm9ybSBleHRlbmRzIE1vZHVsZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy4gQWx3YXlzIGhhcyBhIHZpZXcuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm5hbWU9J3BsYXRmb3JtLWNoZWNrJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuY29sb3I9J2JsYWNrJ10gQmFja2dyb3VuZCBjb2xvciBvZiB0aGUgYHZpZXdgLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMucHJlZml4PScnXSBBZGRpdGlvbmFsIGNvbnRlbnQgZGlzcGxheWVkIGJlZm9yZSB0aGUgZXJyb3IgbWVzc2FnZSAoKmUuZy4qIGAnV2VsY29tZSB0byBNeSBTY2VuYXJpbyEnYCkuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5wb3N0Zml4PScnXSBBZGRpdGlvbmFsIGNvbnRlbnQgZGlzcGxheWVkIGFmdGVyIHRoZSBlcnJvciBtZXNzYWdlICgqZS5nLiogYCdZb3UgY2FuIHN0aWxsIGVuam95IHRoZSBwZXJmb3JtYW5jZSB3aXRoIG90aGVycyEnYCkuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5tZXNzYWdlcz1kZWZhdWx0TWVzc2FnZXNdIEVycm9yIG1lc3NhZ2VzIGRpc3BsYXllZCB3aGVuIHRoZSBkZXZpY2UgZG9lc24ndCBwYXNzIHRoZSBwbGF0Zm9ybSBjaGVjay5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5ieXBhc3M9ZmFsc2VdIFdoZW4gc2V0IHRvIGB0cnVlYCwgdGhlIG1vZHVsZSBpcyBieXBhc3NlZCAoY2FsbHMgdGhlIGBkb25lYG1ldGhvZCBpbW1lZGlhdGVseSkuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ3BsYXRmb3JtLWNoZWNrJywgdHJ1ZSwgb3B0aW9ucy5jb2xvcik7XG5cbiAgICB0aGlzLl9wcmVmaXggPSBvcHRpb25zLnByZWZpeCB8fCAnJztcbiAgICB0aGlzLl9wb3N0Zml4ID0gb3B0aW9ucy5wb3N0Zml4IHx8wqAnJztcbiAgICB0aGlzLl9tZXNzYWdlcyA9IG9wdGlvbnMubWVzc2FnZXMgfHwgZGVmYXVsdE1lc3NhZ2VzO1xuICAgIHRoaXMuX2J5cGFzcyA9IG9wdGlvbnMuYnlwYXNzIHx8wqBmYWxzZTtcbiAgfVxuXG4gIF9nZXRQbGF0Zm9ybSgpIHtcbiAgICBjb25zdCB1YSA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50XG4gICAgY29uc3QgbWQgPSBuZXcgTW9iaWxlRGV0ZWN0KHVhKTtcbiAgICBjbGllbnQucGxhdGZvcm0uaXNNb2JpbGUgPSAobWQubW9iaWxlKCkgIT09IG51bGwpOyAvLyB0cnVlIGlmIHBob25lIG9yIHRhYmxldFxuICAgIGNsaWVudC5wbGF0Zm9ybS5vcyA9ICgoKSA9PiB7XG4gICAgICBsZXQgb3MgPSBtZC5vcygpO1xuXG4gICAgICBpZiAob3MgPT09ICdBbmRyb2lkT1MnKSB7XG4gICAgICAgIHJldHVybiAnYW5kcm9pZCc7XG4gICAgICB9IGVsc2UgaWYgKG9zID09PSAnaU9TJykge1xuICAgICAgICByZXR1cm4gJ2lvcyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gJ290aGVyJztcbiAgICAgIH1cbiAgICB9KSgpO1xuICB9XG5cbiAgX2dldEF1ZGlvRmlsZUV4dGVudGlvbigpIHtcbiAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYXVkaW8nKTtcbiAgICAvLyBodHRwOi8vZGl2ZWludG9odG1sNS5pbmZvL2V2ZXJ5dGhpbmcuaHRtbFxuICAgIGlmICghIShhLmNhblBsYXlUeXBlICYmIGEuY2FuUGxheVR5cGUoJ2F1ZGlvL21wZWc7JykpKSB7XG4gICAgICBjbGllbnQucGxhdGZvcm0uYXVkaW9GaWxlRXh0ID0gJy5tcDMnO1xuICAgIH0gZWxzZSBpZiAoISEoYS5jYW5QbGF5VHlwZSAmJiBhLmNhblBsYXlUeXBlKCdhdWRpby9vZ2c7IGNvZGVjcz1cInZvcmJpc1wiJykpKSB7XG4gICAgICBjbGllbnQucGxhdGZvcm0uYXVkaW9GaWxlRXh0ID0gJy5vZ2cnO1xuICAgIH0gZWxzZSB7XG4gICAgICBjbGllbnQucGxhdGZvcm0uYXVkaW9GaWxlRXh0ID0gJy53YXYnO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIHRoaXMuX2dldFBsYXRmb3JtKCk7XG4gICAgdGhpcy5fZ2V0QXVkaW9GaWxlRXh0ZW50aW9uKCk7XG5cbiAgICAvLyBkaXNwbGF5IGFuIGVycm9yIG1lc3NhZ2UgaWYgcGxhdGZvcm0gaXMgbm90IHN1cHBvcnRlZFxuICAgIGxldCBtc2cgPSBudWxsO1xuICAgIGNvbnN0IG9zID0gY2xpZW50LnBsYXRmb3JtLm9zO1xuICAgIGNvbnN0IGlzTW9iaWxlID0gY2xpZW50LnBsYXRmb3JtLmlzTW9iaWxlO1xuXG4gICAgLy8gYnlwYXNzIHRob3MgbW9kdWxlIGZvciBpbiBicm93c2VyIHRlc3RpbmdcbiAgICBpZiAodGhpcy5fYnlwYXNzKSB7IHJldHVybiB0aGlzLmRvbmUoKTsgfVxuXG4gICAgaWYgKCFhdWRpb0NvbnRleHQpIHtcbiAgICAgIGlmIChvcyA9PT0gJ2lvcycpIHtcbiAgICAgICAgbXNnID0gdGhpcy5fbWVzc2FnZXMuaW9zVmVyc2lvbjtcbiAgICAgIH0gZWxzZSBpZiAob3MgPT09ICdhbmRyb2lkJykge1xuICAgICAgICBtc2cgPSB0aGlzLl9tZXNzYWdlcy5hbmRyb2lkVmVyc2lvbjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1zZyA9IHRoaXMuX21lc3NhZ2VzLndyb25nT1M7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICghaXNNb2JpbGUgfHwgY2xpZW50LnBsYXRmb3JtLm9zID09PSAnb3RoZXInKSB7XG4gICAgICBtc2cgPSB0aGlzLl9tZXNzYWdlcy53cm9uZ09TO1xuICAgIH0gZWxzZSBpZiAoY2xpZW50LnBsYXRmb3JtLm9zID09PSAnaW9zJyAmJiBwbGF0Zm9ybS5vcy52ZXJzaW9uIDwgJzcnKSB7XG4gICAgICBtc2cgPSB0aGlzLl9tZXNzYWdlcy5pb3NWZXJzaW9uO1xuICAgIH0gZWxzZSBpZiAoY2xpZW50LnBsYXRmb3JtLm9zID09PSAnYW5kcm9pZCcgJiYgcGxhdGZvcm0ub3MudmVyc2lvbiA8ICc0LjInKSB7XG4gICAgICBtc2cgPSB0aGlzLl9tZXNzYWdlcy5hbmRyb2lkVmVyc2lvbjtcbiAgICB9XG5cbiAgICBpZiAobXNnICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnNldENlbnRlcmVkVmlld0NvbnRlbnQoYCR7dGhpcy5fcHJlZml4fTxwPiR7bXNnfTwvcD4ke3RoaXMuX3Bvc3RmaXh9YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZG9uZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVzdGFydCgpIHtcbiAgICBzdXBlci5yZXN0YXJ0KCk7XG4gICAgdGhpcy5kb25lKCk7XG4gIH1cbn1cbiJdfQ==