'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

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

var _displaySegmentedView = require('./display/SegmentedView');

var _displaySegmentedView2 = _interopRequireDefault(_displaySegmentedView);

var _screenfull = require('screenfull');

var _screenfull2 = _interopRequireDefault(_screenfull);

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
 * const welcomeDialog = new Welcome({
 *   wakeLock: true
 * });
 */

var Welcome = (function (_ClientModule) {
  _inherits(Welcome, _ClientModule);

  /**
   * @param {Object} [options={}] - Options.
   * @param {String} [options.name='welcome'] - Name of the module.
   * @param {Boolean} [options.activateAudio=true] - Indicates whether the module activates the Web Audio API when the participant touches the screen (useful on iOS devices).
   * @param {Boolean} [options.requireMobile=true] - Defines if the application requires the use of a mobile device.
   * @param {Boolean} [options.wakeLock=false] - Indicates whether the modules activates an ever-looping 1-pixel video to prevent the device from going idle.
   */

  function Welcome() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Welcome);

    _get(Object.getPrototypeOf(Welcome.prototype), 'constructor', this).call(this, options.name || 'welcome', options);

    var defaults = {
      requireMobile: true,
      activateAudio: true,
      fullScreen: false,
      wakeLock: false,
      showView: true,
      viewCtor: _displaySegmentedView2['default']
    };

    this.options = _Object$assign(defaults, options);

    // check platform
    this._defineAudioFileExtention();
    this._definePlatform();
    // initialize module
    this.init();
  }

  _createClass(Welcome, [{
    key: 'init',
    value: function init() {
      // build view according to the device and requirements
      var os = _client2['default'].platform.os;
      var version = parseFloat(_platform2['default'].os.version);
      var isMobile = _client2['default'].platform.isMobile;
      var requireMobile = this.options.requireMobile;
      var activateAudio = this.options.activateAudio;
      var error = null;

      if (activateAudio && !this._supportsWebAudio()) {
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

      if (this.options.showView) {
        if (!error) {
          this.events = { 'touchend': this.activateMedia.bind(this) };
        }

        this.viewCtor = options.viewCtor || _displaySegmentedView2['default'];
        this.view = this.createView();
      }
    }

    /**
     * @private
     */
  }, {
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(Welcome.prototype), 'start', this).call(this);
    }

    /**
     * @private
     */
  }, {
    key: 'restart',
    value: function restart() {
      _get(Object.getPrototypeOf(Welcome.prototype), 'restart', this).call(this);
      this.done();
    }
  }, {
    key: 'activateMedia',
    value: function activateMedia() {
      // if (this.content.error)
      //   return false;
      // http://www.html5rocks.com/en/mobile/fullscreen/?redirect_from_locale=fr
      if (this.options.fullScreen && _screenfull2['default'].enabled) _screenfull2['default'].request();

      if (this.options.activateAudio) this._activateAudio();

      if (this.options.wakeLock) this._requestWakeLock();

      this.done();
      // return true;
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

        if (os === 'AndroidOS') return 'android';else if (os === 'iOS') return 'ios';else return 'other';
      })();
    }
  }, {
    key: '_activateAudio',
    value: function _activateAudio() {
      var o = _wavesAudio.audioContext.createOscillator();
      var g = _wavesAudio.audioContext.createGain();
      g.gain.value = 0.000000001; // -180dB ?
      o.connect(g);
      g.connect(_wavesAudio.audioContext.destination);
      o.start(0);

      // prevent android to stop audio by keping the oscillator active
      if (_client2['default'].platform.os !== 'android') o.stop(_wavesAudio.audioContext.currentTime + 0.01);
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

  return Welcome;
})(_ClientModule3['default']);

exports['default'] = Welcome;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvV2VsY29tZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7MEJBQTZCLGFBQWE7O3NCQUN2QixVQUFVOzs7OzZCQUNKLGdCQUFnQjs7Ozs7O3dCQUVwQixVQUFVOzs7OzRCQUNOLGVBQWU7Ozs7b0NBQ2QseUJBQXlCOzs7OzBCQUU1QixZQUFZOzs7Ozs7O0FBS25DLFNBQVMsT0FBTyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUU7QUFDL0IsbUJBQWUsTUFBTSxnQkFBVyxNQUFNLENBQUc7Q0FDMUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQW9Cb0IsT0FBTztZQUFQLE9BQU87Ozs7Ozs7Ozs7QUFRZixXQVJRLE9BQU8sR0FRQTtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBUkwsT0FBTzs7QUFTeEIsK0JBVGlCLE9BQU8sNkNBU2xCLE9BQU8sQ0FBQyxJQUFJLElBQUksU0FBUyxFQUFFLE9BQU8sRUFBRTs7QUFFMUMsUUFBTSxRQUFRLEdBQUc7QUFDZixtQkFBYSxFQUFFLElBQUk7QUFDbkIsbUJBQWEsRUFBRSxJQUFJO0FBQ25CLGdCQUFVLEVBQUUsS0FBSztBQUNqQixjQUFRLEVBQUUsS0FBSztBQUNmLGNBQVEsRUFBRSxJQUFJO0FBQ2QsY0FBUSxtQ0FBZTtLQUN4QixDQUFDOztBQUVGLFFBQUksQ0FBQyxPQUFPLEdBQUcsZUFBYyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7OztBQUdoRCxRQUFJLENBQUMseUJBQXlCLEVBQUUsQ0FBQztBQUNqQyxRQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7O0FBRXZCLFFBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztHQUNiOztlQTNCa0IsT0FBTzs7V0E2QnRCLGdCQUFHOztBQUVMLFVBQU0sRUFBRSxHQUFHLG9CQUFPLFFBQVEsQ0FBQyxFQUFFLENBQUM7QUFDOUIsVUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDLHNCQUFTLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztB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RSxDQUFDOztBQUU5QixVQUFJLEVBQUUsS0FBSyxLQUFLLEVBQUU7QUFDaEIsWUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO0FBQ3ZCLHVCQUFhLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ25DLGNBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO1NBQzVCO09BQ0YsTUFBTSxJQUFJLEVBQUUsS0FBSyxTQUFTLEVBQUU7QUFDM0IsWUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUM1QixZQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7T0FDOUI7S0FDRjs7O1NBMUxrQixPQUFPOzs7cUJBQVAsT0FBTyIsImZpbGUiOiJzcmMvY2xpZW50L1dlbGNvbWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhdWRpb0NvbnRleHQgfSBmcm9tICd3YXZlcy1hdWRpbyc7XG5pbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCBDbGllbnRNb2R1bGUgZnJvbSAnLi9DbGllbnRNb2R1bGUnO1xuLy8gQHRvZG8gLSBwcm9ibGVtIG9mIHJlZG9uZGFudCBkZXBlbmRlbmN5XG5pbXBvcnQgcGxhdGZvcm0gZnJvbSAncGxhdGZvcm0nO1xuaW1wb3J0IE1vYmlsZURldGVjdCBmcm9tICdtb2JpbGUtZGV0ZWN0JztcbmltcG9ydCBTZWdtZW50ZWRWaWV3IGZyb20gJy4vZGlzcGxheS9TZWdtZW50ZWRWaWV3JztcblxuaW1wb3J0IHNjcmVlbmZ1bGwgZnJvbSAnc2NyZWVuZnVsbCc7XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gX2Jhc2U2NChmb3JtYXQsIGJhc2U2NCkge1xuICByZXR1cm4gYGRhdGE6JHtmb3JtYXR9O2Jhc2U2NCwke2Jhc2U2NH1gO1xufVxuXG4vKipcbiAqIFtjbGllbnRdIENoZWNrIHdoZXRoZXIgdGhlIGRldmljZSBpcyBjb21wYXRpYmxlIHdpdGggdGhlIHRlY2hub2xvZ2llcyB1c2VkIGluIHRoZSAqU291bmR3b3JrcyogbGlicmFyeS5cbiAqIFRoZSBtb2R1bGUgc2hvdWxkIHVzZWQgYXQgdGhlIHZlcnkgYmVnaW5uaW5nIG9mIGEgc2NlbmFyaW8gdG8gYWN0aXZhdGUgdGhlIFdlYiBBdWRpbyBBUEkgb24gaU9TIGRldmljZXMgKHdpdGggdGhlIGBhY3RpdmF0ZUF1ZGlvYCBvcHRpb24pLlxuICpcbiAqIFRoZSBtb2R1bGUgcmVxdWlyZXMgdGhlIHBhcnRpY2lwYW50IHRvIHRhcCB0aGUgc2NyZWVuIGluIG9yZGVyIHRvIGluaXRpYWxpemUgdGhlIHdlYkF1ZGlvIG9uIGlPUyBkZXZpY2VzIGFuZCB0byBtYWtlIHRoZSB2aWV3IGRpc2FwcGVhci5cbiAqXG4gKiBDb21wYXRpYmxlIGRldmljZXMgYXJlIHJ1bm5pbmcgb24gaU9TIDcgb3IgYWJvdmUsIG9yIG9uIEFuZHJvaWQgNC4yIG9yIGFib3ZlIHdpdGggdGhlIENocm9tZSBicm93c2VyIGluIHZlcnNpb24gMzUgb3IgYWJvdmUuXG4gKiBJZiB0aGF0IGlzIG5vdCB0aGUgY2FzZSwgdGhlIG1vZHVsZSBkaXNwbGF5cyBhIGJsb2NraW5nIGB2aWV3YCBhbmQgcHJldmVudHMgdGhlIHBhcnRpY2lwYW50IHRvIGdvIGFueSBmdXJ0aGVyIGluIHRoZSBzY2VuYXJpby5cbiAqXG4gKiBUaGUgbW9kdWxlIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbiB3aGVuIHRoZSB1c2VyIHRvdWNoZXMgdGhlIHNjcmVlbiBpZiB0aGUgZGV2aWNlIHBhc3NlcyB0aGUgcGxhdGZvcm0gdGVzdCwgYW5kIG5ldmVyIG90aGVyd2lzZS5cbiAqXG4gKiBUaGUgbW9kdWxlIGFsd2F5cyBoYXMgYSB2aWV3LlxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCB3ZWxjb21lRGlhbG9nID0gbmV3IFdlbGNvbWUoe1xuICogICB3YWtlTG9jazogdHJ1ZVxuICogfSk7XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdlbGNvbWUgZXh0ZW5kcyBDbGllbnRNb2R1bGUge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSAtIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSd3ZWxjb21lJ10gLSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuYWN0aXZhdGVBdWRpbz10cnVlXSAtIEluZGljYXRlcyB3aGV0aGVyIHRoZSBtb2R1bGUgYWN0aXZhdGVzIHRoZSBXZWIgQXVkaW8gQVBJIHdoZW4gdGhlIHBhcnRpY2lwYW50IHRvdWNoZXMgdGhlIHNjcmVlbiAodXNlZnVsIG9uIGlPUyBkZXZpY2VzKS5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5yZXF1aXJlTW9iaWxlPXRydWVdIC0gRGVmaW5lcyBpZiB0aGUgYXBwbGljYXRpb24gcmVxdWlyZXMgdGhlIHVzZSBvZiBhIG1vYmlsZSBkZXZpY2UuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMud2FrZUxvY2s9ZmFsc2VdIC0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIG1vZHVsZXMgYWN0aXZhdGVzIGFuIGV2ZXItbG9vcGluZyAxLXBpeGVsIHZpZGVvIHRvIHByZXZlbnQgdGhlIGRldmljZSBmcm9tIGdvaW5nIGlkbGUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ3dlbGNvbWUnLCBvcHRpb25zKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgcmVxdWlyZU1vYmlsZTogdHJ1ZSxcbiAgICAgIGFjdGl2YXRlQXVkaW86IHRydWUsXG4gICAgICBmdWxsU2NyZWVuOiBmYWxzZSxcbiAgICAgIHdha2VMb2NrOiBmYWxzZSxcbiAgICAgIHNob3dWaWV3OiB0cnVlLFxuICAgICAgdmlld0N0b3I6IFNlZ21lbnRlZFZpZXcsXG4gICAgfTtcblxuICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oZGVmYXVsdHMsIG9wdGlvbnMpO1xuXG4gICAgLy8gY2hlY2sgcGxhdGZvcm1cbiAgICB0aGlzLl9kZWZpbmVBdWRpb0ZpbGVFeHRlbnRpb24oKTtcbiAgICB0aGlzLl9kZWZpbmVQbGF0Zm9ybSgpO1xuICAgIC8vIGluaXRpYWxpemUgbW9kdWxlXG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIC8vIGJ1aWxkIHZpZXcgYWNjb3JkaW5nIHRvIHRoZSBkZXZpY2UgYW5kIHJlcXVpcmVtZW50c1xuICAgIGNvbnN0IG9zID0gY2xpZW50LnBsYXRmb3JtLm9zO1xuICAgIGNvbnN0IHZlcnNpb24gPSBwYXJzZUZsb2F0KHBsYXRmb3JtLm9zLnZlcnNpb24pO1xuICAgIGNvbnN0IGlzTW9iaWxlID0gY2xpZW50LnBsYXRmb3JtLmlzTW9iaWxlO1xuICAgIGNvbnN0IHJlcXVpcmVNb2JpbGUgPSB0aGlzLm9wdGlvbnMucmVxdWlyZU1vYmlsZTtcbiAgICBjb25zdCBhY3RpdmF0ZUF1ZGlvID0gdGhpcy5vcHRpb25zLmFjdGl2YXRlQXVkaW87XG4gICAgbGV0IGVycm9yID0gbnVsbDtcblxuICAgIGlmIChhY3RpdmF0ZUF1ZGlvICYmICF0aGlzLl9zdXBwb3J0c1dlYkF1ZGlvKCkpIHtcbiAgICAgIGlmIChvcyA9PT0gJ2lvcycpIHtcbiAgICAgICAgZXJyb3IgPSB0aGlzLmNvbnRlbnQuZXJyb3JJb3NWZXJzaW9uO1xuICAgICAgfSBlbHNlIGlmIChvcyA9PT0gJ2FuZHJvaWQnKSB7XG4gICAgICAgIGVycm9yID0gdGhpcy5jb250ZW50LmVycm9yQW5kcm9pZFZlcnNpb247XG4gICAgICB9IGVsc2UgaWYgKHJlcXVpcmVNb2JpbGUpIHtcbiAgICAgICAgZXJyb3IgPSB0aGlzLmNvbnRlbnQuZXJyb3JSZXF1aXJlTW9iaWxlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZXJyb3IgPSB0aGlzLmNvbnRlbnQuZXJyb3JEZWZhdWx0O1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAocmVxdWlyZU1vYmlsZSAmJiAoIWlzTW9iaWxlIHx8IG9zID09PSAnb3RoZXInKSkge1xuICAgICAgZXJyb3IgPSB0aGlzLmNvbnRlbnQuZXJyb3JSZXF1aXJlTW9iaWxlO1xuICAgIH0gZWxzZSBpZiAob3MgPT09ICdpb3MnICYmIHZlcnNpb24gPCA3KSB7XG4gICAgICBlcnJvciA9IHRoaXMuY29udGVudC5lcnJvcklvc1ZlcnNpb247XG4gICAgfSBlbHNlIGlmIChvcyA9PT0gJ2FuZHJvaWQnICYmIHZlcnNpb24gPCA0LjIpIHtcbiAgICAgIGVycm9yID0gdGhpcy5jb250ZW50LmVycm9yQW5kcm9pZFZlcnNpb247XG4gICAgfVxuXG4gICAgdGhpcy5jb250ZW50LmVycm9yID0gZXJyb3I7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnNob3dWaWV3KSB7XG4gICAgICBpZiAoIWVycm9yKSB7XG4gICAgICAgIHRoaXMuZXZlbnRzID0geyAndG91Y2hlbmQnOiB0aGlzLmFjdGl2YXRlTWVkaWEuYmluZCh0aGlzKSB9O1xuICAgICAgfVxuXG4gICAgICB0aGlzLnZpZXdDdG9yID0gb3B0aW9ucy52aWV3Q3RvciB8fCBTZWdtZW50ZWRWaWV3O1xuICAgICAgdGhpcy52aWV3ID0gdGhpcy5jcmVhdGVWaWV3KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXN0YXJ0KCkge1xuICAgIHN1cGVyLnJlc3RhcnQoKTtcbiAgICB0aGlzLmRvbmUoKTtcbiAgfVxuXG4gIGFjdGl2YXRlTWVkaWEoKSB7XG4gICAgLy8gaWYgKHRoaXMuY29udGVudC5lcnJvcilcbiAgICAvLyAgIHJldHVybiBmYWxzZTtcbiAgICAvLyBodHRwOi8vd3d3Lmh0bWw1cm9ja3MuY29tL2VuL21vYmlsZS9mdWxsc2NyZWVuLz9yZWRpcmVjdF9mcm9tX2xvY2FsZT1mclxuICAgIGlmICh0aGlzLm9wdGlvbnMuZnVsbFNjcmVlbiAmJiBzY3JlZW5mdWxsLmVuYWJsZWQpXG4gICAgICBzY3JlZW5mdWxsLnJlcXVlc3QoKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuYWN0aXZhdGVBdWRpbylcbiAgICAgIHRoaXMuX2FjdGl2YXRlQXVkaW8oKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMud2FrZUxvY2spXG4gICAgICB0aGlzLl9yZXF1ZXN0V2FrZUxvY2soKTtcblxuICAgIHRoaXMuZG9uZSgpO1xuICAgIC8vIHJldHVybiB0cnVlO1xuICB9XG5cbiAgX3N1cHBvcnRzV2ViQXVkaW8oKSB7XG4gICAgcmV0dXJuICEhYXVkaW9Db250ZXh0O1xuICB9XG5cbiAgX2RlZmluZUF1ZGlvRmlsZUV4dGVudGlvbigpIHtcbiAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYXVkaW8nKTtcbiAgICAvLyBodHRwOi8vZGl2ZWludG9odG1sNS5pbmZvL2V2ZXJ5dGhpbmcuaHRtbFxuICAgIGlmICghIShhLmNhblBsYXlUeXBlICYmIGEuY2FuUGxheVR5cGUoJ2F1ZGlvL21wZWc7JykpKSB7XG4gICAgICBjbGllbnQucGxhdGZvcm0uYXVkaW9GaWxlRXh0ID0gJy5tcDMnO1xuICAgIH0gZWxzZSBpZiAoISEoYS5jYW5QbGF5VHlwZSAmJiBhLmNhblBsYXlUeXBlKCdhdWRpby9vZ2c7IGNvZGVjcz1cInZvcmJpc1wiJykpKSB7XG4gICAgICBjbGllbnQucGxhdGZvcm0uYXVkaW9GaWxlRXh0ID0gJy5vZ2cnO1xuICAgIH0gZWxzZSB7XG4gICAgICBjbGllbnQucGxhdGZvcm0uYXVkaW9GaWxlRXh0ID0gJy53YXYnO1xuICAgIH1cbiAgfVxuXG4gIF9kZWZpbmVQbGF0Zm9ybSgpIHtcbiAgICBjb25zdCB1YSA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50XG4gICAgY29uc3QgbWQgPSBuZXcgTW9iaWxlRGV0ZWN0KHVhKTtcblxuICAgIGNsaWVudC5wbGF0Zm9ybS5pc01vYmlsZSA9IChtZC5tb2JpbGUoKSAhPT0gbnVsbCk7IC8vIHRydWUgaWYgcGhvbmUgb3IgdGFibGV0XG4gICAgY2xpZW50LnBsYXRmb3JtLm9zID0gKGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IG9zID0gbWQub3MoKTtcblxuICAgICAgaWYgKG9zID09PSAnQW5kcm9pZE9TJylcbiAgICAgICAgcmV0dXJuICdhbmRyb2lkJztcbiAgICAgIGVsc2UgaWYgKG9zID09PSAnaU9TJylcbiAgICAgICAgcmV0dXJuICdpb3MnO1xuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gJ290aGVyJztcbiAgICB9KSgpO1xuICB9XG5cbiAgX2FjdGl2YXRlQXVkaW8oKSB7XG4gICAgdmFyIG8gPSBhdWRpb0NvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xuICAgIHZhciBnID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgICBnLmdhaW4udmFsdWUgPSAwLjAwMDAwMDAwMTsgLy8gLTE4MGRCID9cbiAgICBvLmNvbm5lY3QoZyk7XG4gICAgZy5jb25uZWN0KGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbik7XG4gICAgby5zdGFydCgwKTtcblxuICAgIC8vIHByZXZlbnQgYW5kcm9pZCB0byBzdG9wIGF1ZGlvIGJ5IGtlcGluZyB0aGUgb3NjaWxsYXRvciBhY3RpdmVcbiAgICBpZiAoY2xpZW50LnBsYXRmb3JtLm9zICE9PSAnYW5kcm9pZCcpXG4gICAgICBvLnN0b3AoYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lICsgMC4wMSk7XG4gIH1cblxuICAvLyBjZi4gaHR0cHM6Ly9naXRodWIuY29tL2JvcmlzbXVzL3dlYnZyLWJvaWxlcnBsYXRlL2Jsb2IvOGFiYmM3NGNmYTU5NzZiOWFiMGMzODhjYjBjNTE5NDQwMDhjNjk4OS9qcy93ZWJ2ci1tYW5hZ2VyLmpzI0wyNjgtTDI4OVxuICBfaW5pdFdha2VMb2NrKCkge1xuICAgIHRoaXMuX3dha2VMb2NrVmlkZW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd2aWRlbycpO1xuXG4gICAgdGhpcy5fd2FrZUxvY2tWaWRlby5hZGRFdmVudExpc3RlbmVyKCdlbmRlZCcsICgpID0+IHtcbiAgICAgIHRoaXMuX3dha2VMb2NrVmlkZW8ucGxheSgpO1xuICAgIH0pO1xuICB9XG5cbiAgX3JlcXVlc3RXYWtlTG9jaygpIHtcbiAgICBjb25zdCBvcyA9IGNsaWVudC5wbGF0Zm9ybS5vcztcbiAgICB0aGlzLl9yZWxlYXNlV2FrZUNsb2NrKCk7XG5cbiAgICBpZiAob3MgPT09ICdpb3MnKSB7XG4gICAgICBpZiAodGhpcy5fd2FrZUxvY2tUaW1lcikgcmV0dXJuO1xuXG4gICAgICB0aGlzLl93YWtlTG9ja1RpbWVyID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24gPSB3aW5kb3cubG9jYXRpb247XG4gICAgICAgIHNldFRpbWVvdXQod2luZG93LnN0b3AsIDApO1xuICAgICAgfSwgMzAwMDApO1xuICAgIH0gZWxzZSBpZiAob3MgPT09ICdhbmRyb2lkJykge1xuICAgICAgaWYgKHRoaXMuX3dha2VMb2NrVmlkZW8ucGF1c2VkID09PSBmYWxzZSkgcmV0dXJuO1xuXG4gICAgICB0aGlzLl93YWtlTG9ja1ZpZGVvLnNyYyA9IF9iYXNlNjQoJ3ZpZGVvL3dlYm0nLCAnR2tYZm93RUFBQUFBQUFBZlFvYUJBVUwzZ1FGQzhvRUVRdk9CQ0VLQ2hIZGxZbTFDaDRFQ1FvV0JBaGhUZ0djQkFBQUFBQUFDV3hGTm0zUkFMRTI3aTFPcmhCVkpxV1pUcklIZlRidU1VNnVFRmxTdWExT3NnZ0V1VGJ1TVU2dUVIRk83YTFPc2dnSSs3QUVBQUFBQUFBQ2tBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFWU2FsbUFRQUFBQUFBQUVNcTE3R0REMEpBVFlDTVRHRjJaalUyTGpRdU1UQXhWMEdNVEdGMlpqVTJMalF1TVRBeGM2U1EyMFl2L0Vsd3M3M0EvK0tmRWpNMTFFU0ppRUJrd0FBQUFBQUFGbFN1YXdFQUFBQUFBQUJIcmdFQUFBQUFBQUErMTRFQmM4V0JBWnlCQUNLMW5JTjFibVNHaFZaZlZsQTRnNEVCSStPRGhBVDNrTlhnQVFBQUFBQUFBQkt3Z1JDNmdSQlR3SUVCVkxDQkVGUzZnUkFmUTdaMUFRQUFBQUFBQUxIbmdRQ2dBUUFBQUFBQUFGeWhvNEVBQUlBUUFnQ2RBU29RQUJBQUFFY0loWVdJaFlTSUFnSUFEQTFnQVA3L3ExQ0FkYUVCQUFBQUFBQUFMYVlCQUFBQUFBQUFKTzZCQWFXZkVBSUFuUUVxRUFBUUFBQkhDSVdGaUlXRWlBSUNBQXdOWUFEKy83ci9RS0FCQUFBQUFBQUFRS0dWZ1FCVEFMRUJBQUVRRUFBWUFCaFlML1FBQ0FBQWRhRUJBQUFBQUFBQUg2WUJBQUFBQUFBQUZ1NkJBYVdSc1FFQUFSQVFBQmdBR0ZndjlBQUlBQUFjVTd0ckFRQUFBQUFBQUJHN2o3T0JBTGVLOTRFQjhZSUJnZkNCQXc9PScpO1xuICAgICAgdGhpcy5fd2FrZUxvY2tWaWRlby5wbGF5KCk7XG4gICAgfVxuICB9XG5cbiAgX3JlbGVhc2VXYWtlQ2xvY2soKSB7XG4gICAgY29uc3Qgb3MgPSBjbGllbnQucGxhdGZvcm0ub3M7XG5cbiAgICBpZiAob3MgPT09ICdpb3MnKSB7XG4gICAgICBpZiAodGhpcy5fd2FrZUxvY2tUaW1lcikge1xuICAgICAgICBjbGVhckludGVydmFsKHRoaXMuX3dha2VMb2NrVGltZXIpO1xuICAgICAgICB0aGlzLl93YWtlTG9ja1RpbWVyID0gbnVsbDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9zID09PSAnYW5kcm9pZCcpIHtcbiAgICAgIHRoaXMuX3dha2VMb2NrVmlkZW8ucGF1c2UoKTtcbiAgICAgIHRoaXMuX3dha2VMb2NrVmlkZW8uc3JjID0gJyc7XG4gICAgfVxuICB9XG59XG4iXX0=