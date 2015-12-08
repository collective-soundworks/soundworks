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

// @todo - problem of redondant dependency

var _platform = require('platform');

var _platform2 = _interopRequireDefault(_platform);

var _mobileDetect = require('mobile-detect');

var _mobileDetect2 = _interopRequireDefault(_mobileDetect);

/**
 * @private
 */
function _base64(format, base64) {
  return 'data:' + format + ';base64,' + base64;
}

/**
 * [client] Check whether the device is compatible with the technologies used in the *Soundworks* library.
 * The module should used at the very beginning of a scenario to activate the Web Audio API on iOS devices (with the `activateAudio` option).
 *
 * The module requires the participant to tap the screen in order to initialize the webAudio on iOS devices and to make the view disappear.
 *
 * Compatible devices are running on iOS 7 or above, or on Android 4.2 or above with the Chrome browser in version 35 or above.
 * If that is not the case, the module displays a blocking `view` and prevents the participant to go any further in the scenario.
 *
 * The module finishes its initialization when the user touches the screen if the device passes the platform test, and never otherwise.
 *
 * The module always has a view.
 *
 * @example
 * const welcomeDialog = new Dialog({
 *   name: 'welcome',
 *   activateAudio: true
 * });
 */

var Dialog = (function (_ClientModule) {
  _inherits(Dialog, _ClientModule);

  /**
   * @param {Object} [options={}] - Options.
   * @param {String} [options.name='welcome'] - Name of the module.
   * @param {Boolean} [options.activateAudio=true] - Indicates whether the module activates the Web Audio API when the participant touches the screen (useful on iOS devices).
   * @param {Boolean} [options.requireMobile=true] - Defines if the application requires the use of a mobile device.
   * @param {Boolean} [options.wakeLock=false] - Indicates whether the modules activates an ever-looping 1-pixel video to prevent the device from going idle.
   */

  function Dialog() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Dialog);

    _get(Object.getPrototypeOf(Dialog.prototype), 'constructor', this).call(this, options.name || 'welcome', options);

    this._requireMobile = options.requireMobile === false ? false : true;
    this._mustActivateAudio = options.activateAudio === false ? false : true;
    this._mustWakeLock = !!options.wakeLock;

    // check platform
    this._defineAudioFileExtention();
    this._definePlatform();

    // and build view according to the device and requirements
    var os = _client2['default'].platform.os;
    var version = parseFloat(_platform2['default'].os.version);
    var isMobile = _client2['default'].platform.isMobile;
    var requireMobile = this._requireMobile;
    var error = null;

    if (!this._supportsWebAudio()) {
      if (os === 'ios') {
        error = this.content.errorIosVersion;
      } else if (os === 'android') {
        error = this.content.errorAndroidVersion;
      } else if (requireMobile) {
        error = this.content.errorRequireMobile;
      } else {
        error = this.content.errorDefault;
      }
    } else if (requireMobile && (!isMobile || os === 'other')) {
      error = this.content.errorRequireMobile;
    } else if (os === 'ios' && version < 7) {
      error = this.content.errorIosVersion;
    } else if (os === 'android' && version < 4.2) {
      error = this.content.errorAndroidVersion;
    }

    this.content.error = error;

    if (!error) {
      this.events = { 'click': this._onClick.bind(this) };
    }

    if (options.view) {
      this.view = options.view;
    } else {
      this.view = this.createDefaultView();
    }
  }

  /**
   * @private
   */

  _createClass(Dialog, [{
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(Dialog.prototype), 'start', this).call(this);
      // Initialize hacks for wakeLocking
      if (this._mustWakeLock) {
        this._initWakeLock();
      }
    }

    /**
     * @private
     */
  }, {
    key: 'restart',
    value: function restart() {
      _get(Object.getPrototypeOf(Dialog.prototype), 'restart', this).call(this);
      this.done();
    }
  }, {
    key: '_onClick',
    value: function _onClick() {
      if (this._mustActivateAudio) this._activateAudio();

      if (this._mustWakeLock) this._requestWakeLock();

      this.done();
    }
  }, {
    key: '_supportsWebAudio',
    value: function _supportsWebAudio() {
      return !!_wavesAudio.audioContext;
    }
  }, {
    key: '_defineAudioFileExtention',
    value: function _defineAudioFileExtention() {
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
  }, {
    key: '_definePlatform',
    value: function _definePlatform() {
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
    key: '_activateAudio',
    value: function _activateAudio() {
      var o = _wavesAudio.audioContext.createOscillator();
      var g = _wavesAudio.audioContext.createGain();
      g.gain.value = 0;
      o.connect(g);
      g.connect(_wavesAudio.audioContext.destination);
      o.start(0);
      o.stop(_wavesAudio.audioContext.currentTime + 0.01);
    }

    // cf. https://github.com/borismus/webvr-boilerplate/blob/8abbc74cfa5976b9ab0c388cb0c51944008c6989/js/webvr-manager.js#L268-L289
  }, {
    key: '_initWakeLock',
    value: function _initWakeLock() {
      var _this = this;

      this._wakeLockVideo = document.createElement('video');

      this._wakeLockVideo.addEventListener('ended', function () {
        _this._wakeLockVideo.play();
      });
    }
  }, {
    key: '_requestWakeLock',
    value: function _requestWakeLock() {
      var os = _client2['default'].platform.os;
      this._releaseWakeClock();

      if (os === 'ios') {
        if (this._wakeLockTimer) return;

        this._wakeLockTimer = setInterval(function () {
          window.location = window.location;
          setTimeout(window.stop, 0);
        }, 30000);
      } else if (os === 'android') {
        if (this._wakeLockVideo.paused === false) return;

        this._wakeLockVideo.src = _base64('video/webm', 'GkXfowEAAAAAAAAfQoaBAUL3gQFC8oEEQvOBCEKChHdlYm1Ch4ECQoWBAhhTgGcBAAAAAAACWxFNm3RALE27i1OrhBVJqWZTrIHfTbuMU6uEFlSua1OsggEuTbuMU6uEHFO7a1OsggI+7AEAAAAAAACkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVSalmAQAAAAAAAEMq17GDD0JATYCMTGF2ZjU2LjQuMTAxV0GMTGF2ZjU2LjQuMTAxc6SQ20Yv/Elws73A/+KfEjM11ESJiEBkwAAAAAAAFlSuawEAAAAAAABHrgEAAAAAAAA+14EBc8WBAZyBACK1nIN1bmSGhVZfVlA4g4EBI+ODhAT3kNXgAQAAAAAAABKwgRC6gRBTwIEBVLCBEFS6gRAfQ7Z1AQAAAAAAALHngQCgAQAAAAAAAFyho4EAAIAQAgCdASoQABAAAEcIhYWIhYSIAgIADA1gAP7/q1CAdaEBAAAAAAAALaYBAAAAAAAAJO6BAaWfEAIAnQEqEAAQAABHCIWFiIWEiAICAAwNYAD+/7r/QKABAAAAAAAAQKGVgQBTALEBAAEQEAAYABhYL/QACAAAdaEBAAAAAAAAH6YBAAAAAAAAFu6BAaWRsQEAARAQABgAGFgv9AAIAAAcU7trAQAAAAAAABG7j7OBALeK94EB8YIBgfCBAw==');
        this._wakeLockVideo.play();
      }
    }
  }, {
    key: '_releaseWakeClock',
    value: function _releaseWakeClock() {
      var os = _client2['default'].platform.os;

      if (os === 'ios') {
        if (this._wakeLockTimer) {
          clearInterval(this._wakeLockTimer);
          this._wakeLockTimer = null;
        }
      } else if (os === 'android') {
        this._wakeLockVideo.pause();
        this._wakeLockVideo.src = '';
      }
    }
  }]);

  return Dialog;
})(_ClientModule3['default']);

exports['default'] = Dialog;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvV2VsY29tZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzBCQUE2QixhQUFhOztzQkFDdkIsVUFBVTs7Ozs2QkFDSixnQkFBZ0I7Ozs7Ozt3QkFFcEIsVUFBVTs7Ozs0QkFDTixlQUFlOzs7Ozs7O0FBS3hDLFNBQVMsT0FBTyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUU7QUFDL0IsbUJBQWUsTUFBTSxnQkFBVyxNQUFNLENBQUc7Q0FDMUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFxQm9CLE1BQU07WUFBTixNQUFNOzs7Ozs7Ozs7O0FBUWQsV0FSUSxNQUFNLEdBUUM7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQVJMLE1BQU07O0FBU3ZCLCtCQVRpQixNQUFNLDZDQVNqQixPQUFPLENBQUMsSUFBSSxJQUFJLFNBQVMsRUFBRSxPQUFPLEVBQUU7O0FBRTFDLFFBQUksQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFDLGFBQWEsS0FBSyxLQUFLLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNyRSxRQUFJLENBQUMsa0JBQWtCLEdBQUcsT0FBTyxDQUFDLGFBQWEsS0FBSyxLQUFLLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQztBQUN6RSxRQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDOzs7QUFHeEMsUUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7QUFDakMsUUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDOzs7QUFHdkIsUUFBTSxFQUFFLEdBQUcsb0JBQU8sUUFBUSxDQUFDLEVBQUUsQ0FBQztBQUM5QixRQUFNLE9BQU8sR0FBRyxVQUFVLENBQUMsc0JBQVMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2hELFFBQU0sUUFBUSxHQUFHLG9CQUFPLFFBQVEsQ0FBQyxRQUFRLENBQUM7QUFDMUMsUUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQztBQUMxQyxR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QUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUM1QixZQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7T0FDOUI7S0FDRjs7O1NBeEtrQixNQUFNOzs7cUJBQU4sTUFBTSIsImZpbGUiOiJzcmMvY2xpZW50L1dlbGNvbWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhdWRpb0NvbnRleHQgfSBmcm9tICd3YXZlcy1hdWRpbyc7XG5pbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCBDbGllbnRNb2R1bGUgZnJvbSAnLi9DbGllbnRNb2R1bGUnO1xuLy8gQHRvZG8gLSBwcm9ibGVtIG9mIHJlZG9uZGFudCBkZXBlbmRlbmN5XG5pbXBvcnQgcGxhdGZvcm0gZnJvbSAncGxhdGZvcm0nO1xuaW1wb3J0IE1vYmlsZURldGVjdCBmcm9tICdtb2JpbGUtZGV0ZWN0JztcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBfYmFzZTY0KGZvcm1hdCwgYmFzZTY0KSB7XG4gIHJldHVybiBgZGF0YToke2Zvcm1hdH07YmFzZTY0LCR7YmFzZTY0fWA7XG59XG5cbi8qKlxuICogW2NsaWVudF0gQ2hlY2sgd2hldGhlciB0aGUgZGV2aWNlIGlzIGNvbXBhdGlibGUgd2l0aCB0aGUgdGVjaG5vbG9naWVzIHVzZWQgaW4gdGhlICpTb3VuZHdvcmtzKiBsaWJyYXJ5LlxuICogVGhlIG1vZHVsZSBzaG91bGQgdXNlZCBhdCB0aGUgdmVyeSBiZWdpbm5pbmcgb2YgYSBzY2VuYXJpbyB0byBhY3RpdmF0ZSB0aGUgV2ViIEF1ZGlvIEFQSSBvbiBpT1MgZGV2aWNlcyAod2l0aCB0aGUgYGFjdGl2YXRlQXVkaW9gIG9wdGlvbikuXG4gKlxuICogVGhlIG1vZHVsZSByZXF1aXJlcyB0aGUgcGFydGljaXBhbnQgdG8gdGFwIHRoZSBzY3JlZW4gaW4gb3JkZXIgdG8gaW5pdGlhbGl6ZSB0aGUgd2ViQXVkaW8gb24gaU9TIGRldmljZXMgYW5kIHRvIG1ha2UgdGhlIHZpZXcgZGlzYXBwZWFyLlxuICpcbiAqIENvbXBhdGlibGUgZGV2aWNlcyBhcmUgcnVubmluZyBvbiBpT1MgNyBvciBhYm92ZSwgb3Igb24gQW5kcm9pZCA0LjIgb3IgYWJvdmUgd2l0aCB0aGUgQ2hyb21lIGJyb3dzZXIgaW4gdmVyc2lvbiAzNSBvciBhYm92ZS5cbiAqIElmIHRoYXQgaXMgbm90IHRoZSBjYXNlLCB0aGUgbW9kdWxlIGRpc3BsYXlzIGEgYmxvY2tpbmcgYHZpZXdgIGFuZCBwcmV2ZW50cyB0aGUgcGFydGljaXBhbnQgdG8gZ28gYW55IGZ1cnRoZXIgaW4gdGhlIHNjZW5hcmlvLlxuICpcbiAqIFRoZSBtb2R1bGUgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uIHdoZW4gdGhlIHVzZXIgdG91Y2hlcyB0aGUgc2NyZWVuIGlmIHRoZSBkZXZpY2UgcGFzc2VzIHRoZSBwbGF0Zm9ybSB0ZXN0LCBhbmQgbmV2ZXIgb3RoZXJ3aXNlLlxuICpcbiAqIFRoZSBtb2R1bGUgYWx3YXlzIGhhcyBhIHZpZXcuXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IHdlbGNvbWVEaWFsb2cgPSBuZXcgRGlhbG9nKHtcbiAqICAgbmFtZTogJ3dlbGNvbWUnLFxuICogICBhY3RpdmF0ZUF1ZGlvOiB0cnVlXG4gKiB9KTtcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGlhbG9nIGV4dGVuZHMgQ2xpZW50TW9kdWxlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gLSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0nd2VsY29tZSddIC0gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmFjdGl2YXRlQXVkaW89dHJ1ZV0gLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgbW9kdWxlIGFjdGl2YXRlcyB0aGUgV2ViIEF1ZGlvIEFQSSB3aGVuIHRoZSBwYXJ0aWNpcGFudCB0b3VjaGVzIHRoZSBzY3JlZW4gKHVzZWZ1bCBvbiBpT1MgZGV2aWNlcykuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMucmVxdWlyZU1vYmlsZT10cnVlXSAtIERlZmluZXMgaWYgdGhlIGFwcGxpY2F0aW9uIHJlcXVpcmVzIHRoZSB1c2Ugb2YgYSBtb2JpbGUgZGV2aWNlLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLndha2VMb2NrPWZhbHNlXSAtIEluZGljYXRlcyB3aGV0aGVyIHRoZSBtb2R1bGVzIGFjdGl2YXRlcyBhbiBldmVyLWxvb3BpbmcgMS1waXhlbCB2aWRlbyB0byBwcmV2ZW50IHRoZSBkZXZpY2UgZnJvbSBnb2luZyBpZGxlLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICd3ZWxjb21lJywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl9yZXF1aXJlTW9iaWxlID0gb3B0aW9ucy5yZXF1aXJlTW9iaWxlID09PSBmYWxzZSA/IGZhbHNlIDogdHJ1ZTtcbiAgICB0aGlzLl9tdXN0QWN0aXZhdGVBdWRpbyA9IG9wdGlvbnMuYWN0aXZhdGVBdWRpbyA9PT0gZmFsc2UgPyBmYWxzZSA6IHRydWU7XG4gICAgdGhpcy5fbXVzdFdha2VMb2NrID0gISFvcHRpb25zLndha2VMb2NrO1xuXG4gICAgLy8gY2hlY2sgcGxhdGZvcm1cbiAgICB0aGlzLl9kZWZpbmVBdWRpb0ZpbGVFeHRlbnRpb24oKTtcbiAgICB0aGlzLl9kZWZpbmVQbGF0Zm9ybSgpO1xuXG4gICAgLy8gYW5kIGJ1aWxkIHZpZXcgYWNjb3JkaW5nIHRvIHRoZSBkZXZpY2UgYW5kIHJlcXVpcmVtZW50c1xuICAgIGNvbnN0IG9zID0gY2xpZW50LnBsYXRmb3JtLm9zO1xuICAgIGNvbnN0IHZlcnNpb24gPSBwYXJzZUZsb2F0KHBsYXRmb3JtLm9zLnZlcnNpb24pO1xuICAgIGNvbnN0IGlzTW9iaWxlID0gY2xpZW50LnBsYXRmb3JtLmlzTW9iaWxlO1xuICAgIGNvbnN0IHJlcXVpcmVNb2JpbGUgPSB0aGlzLl9yZXF1aXJlTW9iaWxlO1xuICAgIGxldCBlcnJvciA9IG51bGw7XG5cbiAgICBpZiAoIXRoaXMuX3N1cHBvcnRzV2ViQXVkaW8oKSkge1xuICAgICAgaWYgKG9zID09PSAnaW9zJykge1xuICAgICAgICBlcnJvciA9IHRoaXMuY29udGVudC5lcnJvcklvc1ZlcnNpb247XG4gICAgICB9IGVsc2UgaWYgKG9zID09PSAnYW5kcm9pZCcpIHtcbiAgICAgICAgZXJyb3IgPSB0aGlzLmNvbnRlbnQuZXJyb3JBbmRyb2lkVmVyc2lvbjtcbiAgICAgIH0gZWxzZSBpZiAocmVxdWlyZU1vYmlsZSkge1xuICAgICAgICBlcnJvciA9IHRoaXMuY29udGVudC5lcnJvclJlcXVpcmVNb2JpbGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlcnJvciA9IHRoaXMuY29udGVudC5lcnJvckRlZmF1bHQ7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChyZXF1aXJlTW9iaWxlICYmICghaXNNb2JpbGUgfHwgb3MgPT09ICdvdGhlcicpKSB7XG4gICAgICBlcnJvciA9IHRoaXMuY29udGVudC5lcnJvclJlcXVpcmVNb2JpbGU7XG4gICAgfSBlbHNlIGlmIChvcyA9PT0gJ2lvcycgJiYgdmVyc2lvbiA8IDcpIHtcbiAgICAgIGVycm9yID0gdGhpcy5jb250ZW50LmVycm9ySW9zVmVyc2lvbjtcbiAgICB9IGVsc2UgaWYgKG9zID09PSAnYW5kcm9pZCcgJiYgdmVyc2lvbiA8IDQuMikge1xuICAgICAgZXJyb3IgPSB0aGlzLmNvbnRlbnQuZXJyb3JBbmRyb2lkVmVyc2lvbjtcbiAgICB9XG5cbiAgICB0aGlzLmNvbnRlbnQuZXJyb3IgPSBlcnJvcjtcblxuICAgIGlmICghZXJyb3IpIHtcbiAgICAgIHRoaXMuZXZlbnRzID0geyAnY2xpY2snOiB0aGlzLl9vbkNsaWNrLmJpbmQodGhpcykgfTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy52aWV3KSB7XG4gICAgICB0aGlzLnZpZXcgPSBvcHRpb25zLnZpZXc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlRGVmYXVsdFZpZXcoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG4gICAgLy8gSW5pdGlhbGl6ZSBoYWNrcyBmb3Igd2FrZUxvY2tpbmdcbiAgICBpZiAodGhpcy5fbXVzdFdha2VMb2NrKSB7IHRoaXMuX2luaXRXYWtlTG9jaygpOyB9XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlc3RhcnQoKSB7XG4gICAgc3VwZXIucmVzdGFydCgpO1xuICAgIHRoaXMuZG9uZSgpO1xuICB9XG5cbiAgX29uQ2xpY2soKSB7XG4gICAgaWYgKHRoaXMuX211c3RBY3RpdmF0ZUF1ZGlvKVxuICAgICAgdGhpcy5fYWN0aXZhdGVBdWRpbygpO1xuXG4gICAgaWYgKHRoaXMuX211c3RXYWtlTG9jaylcbiAgICAgIHRoaXMuX3JlcXVlc3RXYWtlTG9jaygpO1xuXG4gICAgdGhpcy5kb25lKCk7XG4gIH1cblxuICBfc3VwcG9ydHNXZWJBdWRpbygpIHtcbiAgICByZXR1cm4gISFhdWRpb0NvbnRleHQ7XG4gIH1cblxuICBfZGVmaW5lQXVkaW9GaWxlRXh0ZW50aW9uKCkge1xuICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhdWRpbycpO1xuICAgIC8vIGh0dHA6Ly9kaXZlaW50b2h0bWw1LmluZm8vZXZlcnl0aGluZy5odG1sXG4gICAgaWYgKCEhKGEuY2FuUGxheVR5cGUgJiYgYS5jYW5QbGF5VHlwZSgnYXVkaW8vbXBlZzsnKSkpIHtcbiAgICAgIGNsaWVudC5wbGF0Zm9ybS5hdWRpb0ZpbGVFeHQgPSAnLm1wMyc7XG4gICAgfSBlbHNlIGlmICghIShhLmNhblBsYXlUeXBlICYmIGEuY2FuUGxheVR5cGUoJ2F1ZGlvL29nZzsgY29kZWNzPVwidm9yYmlzXCInKSkpIHtcbiAgICAgIGNsaWVudC5wbGF0Zm9ybS5hdWRpb0ZpbGVFeHQgPSAnLm9nZyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNsaWVudC5wbGF0Zm9ybS5hdWRpb0ZpbGVFeHQgPSAnLndhdic7XG4gICAgfVxuICB9XG5cbiAgX2RlZmluZVBsYXRmb3JtKCkge1xuICAgIGNvbnN0IHVhID0gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnRcbiAgICBjb25zdCBtZCA9IG5ldyBNb2JpbGVEZXRlY3QodWEpO1xuXG4gICAgY2xpZW50LnBsYXRmb3JtLmlzTW9iaWxlID0gKG1kLm1vYmlsZSgpICE9PSBudWxsKTsgLy8gdHJ1ZSBpZiBwaG9uZSBvciB0YWJsZXRcbiAgICBjbGllbnQucGxhdGZvcm0ub3MgPSAoZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgb3MgPSBtZC5vcygpO1xuXG4gICAgICBpZiAob3MgPT09ICdBbmRyb2lkT1MnKSB7XG4gICAgICAgIHJldHVybiAnYW5kcm9pZCc7XG4gICAgICB9IGVsc2UgaWYgKG9zID09PSAnaU9TJykge1xuICAgICAgICByZXR1cm4gJ2lvcyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gJ290aGVyJztcbiAgICAgIH1cbiAgICB9KSgpO1xuICB9XG5cbiAgX2FjdGl2YXRlQXVkaW8oKSB7XG4gICAgdmFyIG8gPSBhdWRpb0NvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xuICAgIHZhciBnID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgICBnLmdhaW4udmFsdWUgPSAwO1xuICAgIG8uY29ubmVjdChnKTtcbiAgICBnLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcbiAgICBvLnN0YXJ0KDApO1xuICAgIG8uc3RvcChhdWRpb0NvbnRleHQuY3VycmVudFRpbWUgKyAwLjAxKTtcbiAgfVxuXG4gIC8vIGNmLiBodHRwczovL2dpdGh1Yi5jb20vYm9yaXNtdXMvd2VidnItYm9pbGVycGxhdGUvYmxvYi84YWJiYzc0Y2ZhNTk3NmI5YWIwYzM4OGNiMGM1MTk0NDAwOGM2OTg5L2pzL3dlYnZyLW1hbmFnZXIuanMjTDI2OC1MMjg5XG4gIF9pbml0V2FrZUxvY2soKSB7XG4gICAgdGhpcy5fd2FrZUxvY2tWaWRlbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJyk7XG5cbiAgICB0aGlzLl93YWtlTG9ja1ZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ2VuZGVkJywgKCkgPT4ge1xuICAgICAgdGhpcy5fd2FrZUxvY2tWaWRlby5wbGF5KCk7XG4gICAgfSk7XG4gIH1cblxuICBfcmVxdWVzdFdha2VMb2NrKCkge1xuICAgIGNvbnN0IG9zID0gY2xpZW50LnBsYXRmb3JtLm9zO1xuICAgIHRoaXMuX3JlbGVhc2VXYWtlQ2xvY2soKTtcblxuICAgIGlmIChvcyA9PT0gJ2lvcycpIHtcbiAgICAgIGlmICh0aGlzLl93YWtlTG9ja1RpbWVyKSByZXR1cm47XG5cbiAgICAgIHRoaXMuX3dha2VMb2NrVGltZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IHdpbmRvdy5sb2NhdGlvbjtcbiAgICAgICAgc2V0VGltZW91dCh3aW5kb3cuc3RvcCwgMCk7XG4gICAgICB9LCAzMDAwMCk7XG4gICAgfSBlbHNlIGlmIChvcyA9PT0gJ2FuZHJvaWQnKSB7XG4gICAgICBpZiAodGhpcy5fd2FrZUxvY2tWaWRlby5wYXVzZWQgPT09IGZhbHNlKSByZXR1cm47XG5cbiAgICAgIHRoaXMuX3dha2VMb2NrVmlkZW8uc3JjID0gX2Jhc2U2NCgndmlkZW8vd2VibScsICdHa1hmb3dFQUFBQUFBQUFmUW9hQkFVTDNnUUZDOG9FRVF2T0JDRUtDaEhkbFltMUNoNEVDUW9XQkFoaFRnR2NCQUFBQUFBQUNXeEZObTNSQUxFMjdpMU9yaEJWSnFXWlRySUhmVGJ1TVU2dUVGbFN1YTFPc2dnRXVUYnVNVTZ1RUhGTzdhMU9zZ2dJKzdBRUFBQUFBQUFDa0FBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQVZTYWxtQVFBQUFBQUFBRU1xMTdHREQwSkFUWUNNVEdGMlpqVTJMalF1TVRBeFYwR01UR0YyWmpVMkxqUXVNVEF4YzZTUTIwWXYvRWx3czczQS8rS2ZFak0xMUVTSmlFQmt3QUFBQUFBQUZsU3Vhd0VBQUFBQUFBQkhyZ0VBQUFBQUFBQSsxNEVCYzhXQkFaeUJBQ0sxbklOMWJtU0doVlpmVmxBNGc0RUJJK09EaEFUM2tOWGdBUUFBQUFBQUFCS3dnUkM2Z1JCVHdJRUJWTENCRUZTNmdSQWZRN1oxQVFBQUFBQUFBTEhuZ1FDZ0FRQUFBQUFBQUZ5aG80RUFBSUFRQWdDZEFTb1FBQkFBQUVjSWhZV0loWVNJQWdJQURBMWdBUDcvcTFDQWRhRUJBQUFBQUFBQUxhWUJBQUFBQUFBQUpPNkJBYVdmRUFJQW5RRXFFQUFRQUFCSENJV0ZpSVdFaUFJQ0FBd05ZQUQrLzdyL1FLQUJBQUFBQUFBQVFLR1ZnUUJUQUxFQkFBRVFFQUFZQUJoWUwvUUFDQUFBZGFFQkFBQUFBQUFBSDZZQkFBQUFBQUFBRnU2QkFhV1JzUUVBQVJBUUFCZ0FHRmd2OUFBSUFBQWNVN3RyQVFBQUFBQUFBQkc3ajdPQkFMZUs5NEVCOFlJQmdmQ0JBdz09Jyk7XG4gICAgICB0aGlzLl93YWtlTG9ja1ZpZGVvLnBsYXkoKTtcbiAgICB9XG4gIH1cblxuICBfcmVsZWFzZVdha2VDbG9jaygpIHtcbiAgICBjb25zdCBvcyA9IGNsaWVudC5wbGF0Zm9ybS5vcztcblxuICAgIGlmIChvcyA9PT0gJ2lvcycpIHtcbiAgICAgIGlmICh0aGlzLl93YWtlTG9ja1RpbWVyKSB7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5fd2FrZUxvY2tUaW1lcik7XG4gICAgICAgIHRoaXMuX3dha2VMb2NrVGltZXIgPSBudWxsO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAob3MgPT09ICdhbmRyb2lkJykge1xuICAgICAgdGhpcy5fd2FrZUxvY2tWaWRlby5wYXVzZSgpO1xuICAgICAgdGhpcy5fd2FrZUxvY2tWaWRlby5zcmMgPSAnJztcbiAgICB9XG4gIH1cbn1cbiJdfQ==