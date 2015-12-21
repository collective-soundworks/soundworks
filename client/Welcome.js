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

    this._requireMobile = options.requireMobile === false ? false : true;
    this._mustActivateAudio = options.activateAudio === false ? false : true;
    this._mustFullScreen = options.fullScreen === false ? false : true;
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
      this.viewCtor = options.viewCtor || _displaySegmentedView2['default'];
      this.view = this.createDefaultView();
    }
  }

  /**
   * @private
   */

  _createClass(Welcome, [{
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
    key: '_onClick',
    value: function _onClick() {
      // http://www.html5rocks.com/en/mobile/fullscreen/?redirect_from_locale=fr
      if (this._mustFullScreen && _screenfull2['default'].enabled) _screenfull2['default'].request();

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

  return Welcome;
})(_ClientModule3['default']);

exports['default'] = Welcome;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvV2VsY29tZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzBCQUE2QixhQUFhOztzQkFDdkIsVUFBVTs7Ozs2QkFDSixnQkFBZ0I7Ozs7Ozt3QkFFcEIsVUFBVTs7Ozs0QkFDTixlQUFlOzs7O29DQUNkLHlCQUF5Qjs7OzswQkFFNUIsWUFBWTs7Ozs7OztBQUtuQyxTQUFTLE9BQU8sQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFO0FBQy9CLG1CQUFlLE1BQU0sZ0JBQVcsTUFBTSxDQUFHO0NBQzFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFvQm9CLE9BQU87WUFBUCxPQUFPOzs7Ozs7Ozs7O0FBUWYsV0FSUSxPQUFPLEdBUUE7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQVJMLE9BQU87O0FBU3hCLCtCQVRpQixPQUFPLDZDQVNsQixPQUFPLENBQUMsSUFBSSxJQUFJLFNBQVMsRUFBRSxPQUFPLEVBQUU7O0FBRTFDLFFBQUksQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFDLGFBQWEsS0FBSyxLQUFLLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNyRSxRQUFJLENBQUMsa0JBQWtCLEdBQUcsT0FBTyxDQUFDLGFBQWEsS0FBSyxLQUFLLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQztBQUN6RSxRQUFJLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQyxVQUFVLEtBQUssS0FBSyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDbkUsUUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQzs7O0FBR3hDLFFBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO0FBQ2pDLFFBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQzs7O0FBR3ZCLFFBQU0sRUFBRSxHQUFHLG9CQUFPLFFBQVEsQ0FBQyxFQUFFLENBQUM7QUFDOUIsUUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDLHNCQUFTLEVBQUUsQ0FBQyxPQUFP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O0FBQ2hCLFlBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtBQUN2Qix1QkFBYSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNuQyxjQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztTQUM1QjtPQUNGLE1BQU0sSUFBSSxFQUFFLEtBQUssU0FBUyxFQUFFO0FBQzNCLFlBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDNUIsWUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO09BQzlCO0tBQ0Y7OztTQTVLa0IsT0FBTzs7O3FCQUFQLE9BQU8iLCJmaWxlIjoic3JjL2NsaWVudC9XZWxjb21lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYXVkaW9Db250ZXh0IH0gZnJvbSAnd2F2ZXMtYXVkaW8nO1xuaW1wb3J0IGNsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQgQ2xpZW50TW9kdWxlIGZyb20gJy4vQ2xpZW50TW9kdWxlJztcbi8vIEB0b2RvIC0gcHJvYmxlbSBvZiByZWRvbmRhbnQgZGVwZW5kZW5jeVxuaW1wb3J0IHBsYXRmb3JtIGZyb20gJ3BsYXRmb3JtJztcbmltcG9ydCBNb2JpbGVEZXRlY3QgZnJvbSAnbW9iaWxlLWRldGVjdCc7XG5pbXBvcnQgU2VnbWVudGVkVmlldyBmcm9tICcuL2Rpc3BsYXkvU2VnbWVudGVkVmlldyc7XG5cbmltcG9ydCBzY3JlZW5mdWxsIGZyb20gJ3NjcmVlbmZ1bGwnO1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIF9iYXNlNjQoZm9ybWF0LCBiYXNlNjQpIHtcbiAgcmV0dXJuIGBkYXRhOiR7Zm9ybWF0fTtiYXNlNjQsJHtiYXNlNjR9YDtcbn1cblxuLyoqXG4gKiBbY2xpZW50XSBDaGVjayB3aGV0aGVyIHRoZSBkZXZpY2UgaXMgY29tcGF0aWJsZSB3aXRoIHRoZSB0ZWNobm9sb2dpZXMgdXNlZCBpbiB0aGUgKlNvdW5kd29ya3MqIGxpYnJhcnkuXG4gKiBUaGUgbW9kdWxlIHNob3VsZCB1c2VkIGF0IHRoZSB2ZXJ5IGJlZ2lubmluZyBvZiBhIHNjZW5hcmlvIHRvIGFjdGl2YXRlIHRoZSBXZWIgQXVkaW8gQVBJIG9uIGlPUyBkZXZpY2VzICh3aXRoIHRoZSBgYWN0aXZhdGVBdWRpb2Agb3B0aW9uKS5cbiAqXG4gKiBUaGUgbW9kdWxlIHJlcXVpcmVzIHRoZSBwYXJ0aWNpcGFudCB0byB0YXAgdGhlIHNjcmVlbiBpbiBvcmRlciB0byBpbml0aWFsaXplIHRoZSB3ZWJBdWRpbyBvbiBpT1MgZGV2aWNlcyBhbmQgdG8gbWFrZSB0aGUgdmlldyBkaXNhcHBlYXIuXG4gKlxuICogQ29tcGF0aWJsZSBkZXZpY2VzIGFyZSBydW5uaW5nIG9uIGlPUyA3IG9yIGFib3ZlLCBvciBvbiBBbmRyb2lkIDQuMiBvciBhYm92ZSB3aXRoIHRoZSBDaHJvbWUgYnJvd3NlciBpbiB2ZXJzaW9uIDM1IG9yIGFib3ZlLlxuICogSWYgdGhhdCBpcyBub3QgdGhlIGNhc2UsIHRoZSBtb2R1bGUgZGlzcGxheXMgYSBibG9ja2luZyBgdmlld2AgYW5kIHByZXZlbnRzIHRoZSBwYXJ0aWNpcGFudCB0byBnbyBhbnkgZnVydGhlciBpbiB0aGUgc2NlbmFyaW8uXG4gKlxuICogVGhlIG1vZHVsZSBmaW5pc2hlcyBpdHMgaW5pdGlhbGl6YXRpb24gd2hlbiB0aGUgdXNlciB0b3VjaGVzIHRoZSBzY3JlZW4gaWYgdGhlIGRldmljZSBwYXNzZXMgdGhlIHBsYXRmb3JtIHRlc3QsIGFuZCBuZXZlciBvdGhlcndpc2UuXG4gKlxuICogVGhlIG1vZHVsZSBhbHdheXMgaGFzIGEgdmlldy5cbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3Qgd2VsY29tZURpYWxvZyA9IG5ldyBXZWxjb21lKHtcbiAqICAgd2FrZUxvY2s6IHRydWVcbiAqIH0pO1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXZWxjb21lIGV4dGVuZHMgQ2xpZW50TW9kdWxlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gLSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0nd2VsY29tZSddIC0gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmFjdGl2YXRlQXVkaW89dHJ1ZV0gLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgbW9kdWxlIGFjdGl2YXRlcyB0aGUgV2ViIEF1ZGlvIEFQSSB3aGVuIHRoZSBwYXJ0aWNpcGFudCB0b3VjaGVzIHRoZSBzY3JlZW4gKHVzZWZ1bCBvbiBpT1MgZGV2aWNlcykuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMucmVxdWlyZU1vYmlsZT10cnVlXSAtIERlZmluZXMgaWYgdGhlIGFwcGxpY2F0aW9uIHJlcXVpcmVzIHRoZSB1c2Ugb2YgYSBtb2JpbGUgZGV2aWNlLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLndha2VMb2NrPWZhbHNlXSAtIEluZGljYXRlcyB3aGV0aGVyIHRoZSBtb2R1bGVzIGFjdGl2YXRlcyBhbiBldmVyLWxvb3BpbmcgMS1waXhlbCB2aWRlbyB0byBwcmV2ZW50IHRoZSBkZXZpY2UgZnJvbSBnb2luZyBpZGxlLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICd3ZWxjb21lJywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl9yZXF1aXJlTW9iaWxlID0gb3B0aW9ucy5yZXF1aXJlTW9iaWxlID09PSBmYWxzZSA/IGZhbHNlIDogdHJ1ZTtcbiAgICB0aGlzLl9tdXN0QWN0aXZhdGVBdWRpbyA9IG9wdGlvbnMuYWN0aXZhdGVBdWRpbyA9PT0gZmFsc2UgPyBmYWxzZSA6IHRydWU7XG4gICAgdGhpcy5fbXVzdEZ1bGxTY3JlZW4gPSBvcHRpb25zLmZ1bGxTY3JlZW4gPT09IGZhbHNlID8gZmFsc2UgOiB0cnVlO1xuICAgIHRoaXMuX211c3RXYWtlTG9jayA9ICEhb3B0aW9ucy53YWtlTG9jaztcblxuICAgIC8vIGNoZWNrIHBsYXRmb3JtXG4gICAgdGhpcy5fZGVmaW5lQXVkaW9GaWxlRXh0ZW50aW9uKCk7XG4gICAgdGhpcy5fZGVmaW5lUGxhdGZvcm0oKTtcblxuICAgIC8vIGFuZCBidWlsZCB2aWV3IGFjY29yZGluZyB0byB0aGUgZGV2aWNlIGFuZCByZXF1aXJlbWVudHNcbiAgICBjb25zdCBvcyA9IGNsaWVudC5wbGF0Zm9ybS5vcztcbiAgICBjb25zdCB2ZXJzaW9uID0gcGFyc2VGbG9hdChwbGF0Zm9ybS5vcy52ZXJzaW9uKTtcbiAgICBjb25zdCBpc01vYmlsZSA9IGNsaWVudC5wbGF0Zm9ybS5pc01vYmlsZTtcbiAgICBjb25zdCByZXF1aXJlTW9iaWxlID0gdGhpcy5fcmVxdWlyZU1vYmlsZTtcbiAgICBsZXQgZXJyb3IgPSBudWxsO1xuXG4gICAgaWYgKCF0aGlzLl9zdXBwb3J0c1dlYkF1ZGlvKCkpIHtcbiAgICAgIGlmIChvcyA9PT0gJ2lvcycpIHtcbiAgICAgICAgZXJyb3IgPSB0aGlzLmNvbnRlbnQuZXJyb3JJb3NWZXJzaW9uO1xuICAgICAgfSBlbHNlIGlmIChvcyA9PT0gJ2FuZHJvaWQnKSB7XG4gICAgICAgIGVycm9yID0gdGhpcy5jb250ZW50LmVycm9yQW5kcm9pZFZlcnNpb247XG4gICAgICB9IGVsc2UgaWYgKHJlcXVpcmVNb2JpbGUpIHtcbiAgICAgICAgZXJyb3IgPSB0aGlzLmNvbnRlbnQuZXJyb3JSZXF1aXJlTW9iaWxlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZXJyb3IgPSB0aGlzLmNvbnRlbnQuZXJyb3JEZWZhdWx0O1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAocmVxdWlyZU1vYmlsZSAmJiAoIWlzTW9iaWxlIHx8IG9zID09PSAnb3RoZXInKSkge1xuICAgICAgZXJyb3IgPSB0aGlzLmNvbnRlbnQuZXJyb3JSZXF1aXJlTW9iaWxlO1xuICAgIH0gZWxzZSBpZiAob3MgPT09ICdpb3MnICYmIHZlcnNpb24gPCA3KSB7XG4gICAgICBlcnJvciA9IHRoaXMuY29udGVudC5lcnJvcklvc1ZlcnNpb247XG4gICAgfSBlbHNlIGlmIChvcyA9PT0gJ2FuZHJvaWQnICYmIHZlcnNpb24gPCA0LjIpIHtcbiAgICAgIGVycm9yID0gdGhpcy5jb250ZW50LmVycm9yQW5kcm9pZFZlcnNpb247XG4gICAgfVxuXG4gICAgdGhpcy5jb250ZW50LmVycm9yID0gZXJyb3I7XG5cbiAgICBpZiAoIWVycm9yKSB7XG4gICAgICB0aGlzLmV2ZW50cyA9IHsgJ2NsaWNrJzogdGhpcy5fb25DbGljay5iaW5kKHRoaXMpIH07XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMudmlldykge1xuICAgICAgdGhpcy52aWV3ID0gb3B0aW9ucy52aWV3O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnZpZXdDdG9yID0gb3B0aW9ucy52aWV3Q3RvciB8fCBTZWdtZW50ZWRWaWV3O1xuICAgICAgdGhpcy52aWV3ID0gdGhpcy5jcmVhdGVEZWZhdWx0VmlldygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVzdGFydCgpIHtcbiAgICBzdXBlci5yZXN0YXJ0KCk7XG4gICAgdGhpcy5kb25lKCk7XG4gIH1cblxuICBfb25DbGljaygpIHtcbiAgICAvLyBodHRwOi8vd3d3Lmh0bWw1cm9ja3MuY29tL2VuL21vYmlsZS9mdWxsc2NyZWVuLz9yZWRpcmVjdF9mcm9tX2xvY2FsZT1mclxuICAgIGlmICh0aGlzLl9tdXN0RnVsbFNjcmVlbiAmJiBzY3JlZW5mdWxsLmVuYWJsZWQpXG4gICAgICBzY3JlZW5mdWxsLnJlcXVlc3QoKTtcblxuICAgIGlmICh0aGlzLl9tdXN0QWN0aXZhdGVBdWRpbylcbiAgICAgIHRoaXMuX2FjdGl2YXRlQXVkaW8oKTtcblxuICAgIGlmICh0aGlzLl9tdXN0V2FrZUxvY2spXG4gICAgICB0aGlzLl9yZXF1ZXN0V2FrZUxvY2soKTtcblxuICAgIHRoaXMuZG9uZSgpO1xuICB9XG5cbiAgX3N1cHBvcnRzV2ViQXVkaW8oKSB7XG4gICAgcmV0dXJuICEhYXVkaW9Db250ZXh0O1xuICB9XG5cbiAgX2RlZmluZUF1ZGlvRmlsZUV4dGVudGlvbigpIHtcbiAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYXVkaW8nKTtcbiAgICAvLyBodHRwOi8vZGl2ZWludG9odG1sNS5pbmZvL2V2ZXJ5dGhpbmcuaHRtbFxuICAgIGlmICghIShhLmNhblBsYXlUeXBlICYmIGEuY2FuUGxheVR5cGUoJ2F1ZGlvL21wZWc7JykpKSB7XG4gICAgICBjbGllbnQucGxhdGZvcm0uYXVkaW9GaWxlRXh0ID0gJy5tcDMnO1xuICAgIH0gZWxzZSBpZiAoISEoYS5jYW5QbGF5VHlwZSAmJiBhLmNhblBsYXlUeXBlKCdhdWRpby9vZ2c7IGNvZGVjcz1cInZvcmJpc1wiJykpKSB7XG4gICAgICBjbGllbnQucGxhdGZvcm0uYXVkaW9GaWxlRXh0ID0gJy5vZ2cnO1xuICAgIH0gZWxzZSB7XG4gICAgICBjbGllbnQucGxhdGZvcm0uYXVkaW9GaWxlRXh0ID0gJy53YXYnO1xuICAgIH1cbiAgfVxuXG4gIF9kZWZpbmVQbGF0Zm9ybSgpIHtcbiAgICBjb25zdCB1YSA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50XG4gICAgY29uc3QgbWQgPSBuZXcgTW9iaWxlRGV0ZWN0KHVhKTtcblxuICAgIGNsaWVudC5wbGF0Zm9ybS5pc01vYmlsZSA9IChtZC5tb2JpbGUoKSAhPT0gbnVsbCk7IC8vIHRydWUgaWYgcGhvbmUgb3IgdGFibGV0XG4gICAgY2xpZW50LnBsYXRmb3JtLm9zID0gKGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IG9zID0gbWQub3MoKTtcblxuICAgICAgaWYgKG9zID09PSAnQW5kcm9pZE9TJykge1xuICAgICAgICByZXR1cm4gJ2FuZHJvaWQnO1xuICAgICAgfSBlbHNlIGlmIChvcyA9PT0gJ2lPUycpIHtcbiAgICAgICAgcmV0dXJuICdpb3MnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuICdvdGhlcic7XG4gICAgICB9XG4gICAgfSkoKTtcbiAgfVxuXG4gIF9hY3RpdmF0ZUF1ZGlvKCkge1xuICAgIHZhciBvID0gYXVkaW9Db250ZXh0LmNyZWF0ZU9zY2lsbGF0b3IoKTtcbiAgICB2YXIgZyA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG4gICAgZy5nYWluLnZhbHVlID0gMDtcbiAgICBvLmNvbm5lY3QoZyk7XG4gICAgZy5jb25uZWN0KGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbik7XG4gICAgby5zdGFydCgwKTtcbiAgICBvLnN0b3AoYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lICsgMC4wMSk7XG4gIH1cblxuICAvLyBjZi4gaHR0cHM6Ly9naXRodWIuY29tL2JvcmlzbXVzL3dlYnZyLWJvaWxlcnBsYXRlL2Jsb2IvOGFiYmM3NGNmYTU5NzZiOWFiMGMzODhjYjBjNTE5NDQwMDhjNjk4OS9qcy93ZWJ2ci1tYW5hZ2VyLmpzI0wyNjgtTDI4OVxuICBfaW5pdFdha2VMb2NrKCkge1xuICAgIHRoaXMuX3dha2VMb2NrVmlkZW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd2aWRlbycpO1xuXG4gICAgdGhpcy5fd2FrZUxvY2tWaWRlby5hZGRFdmVudExpc3RlbmVyKCdlbmRlZCcsICgpID0+IHtcbiAgICAgIHRoaXMuX3dha2VMb2NrVmlkZW8ucGxheSgpO1xuICAgIH0pO1xuICB9XG5cbiAgX3JlcXVlc3RXYWtlTG9jaygpIHtcbiAgICBjb25zdCBvcyA9IGNsaWVudC5wbGF0Zm9ybS5vcztcbiAgICB0aGlzLl9yZWxlYXNlV2FrZUNsb2NrKCk7XG5cbiAgICBpZiAob3MgPT09ICdpb3MnKSB7XG4gICAgICBpZiAodGhpcy5fd2FrZUxvY2tUaW1lcikgcmV0dXJuO1xuXG4gICAgICB0aGlzLl93YWtlTG9ja1RpbWVyID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24gPSB3aW5kb3cubG9jYXRpb247XG4gICAgICAgIHNldFRpbWVvdXQod2luZG93LnN0b3AsIDApO1xuICAgICAgfSwgMzAwMDApO1xuICAgIH0gZWxzZSBpZiAob3MgPT09ICdhbmRyb2lkJykge1xuICAgICAgaWYgKHRoaXMuX3dha2VMb2NrVmlkZW8ucGF1c2VkID09PSBmYWxzZSkgcmV0dXJuO1xuXG4gICAgICB0aGlzLl93YWtlTG9ja1ZpZGVvLnNyYyA9IF9iYXNlNjQoJ3ZpZGVvL3dlYm0nLCAnR2tYZm93RUFBQUFBQUFBZlFvYUJBVUwzZ1FGQzhvRUVRdk9CQ0VLQ2hIZGxZbTFDaDRFQ1FvV0JBaGhUZ0djQkFBQUFBQUFDV3hGTm0zUkFMRTI3aTFPcmhCVkpxV1pUcklIZlRidU1VNnVFRmxTdWExT3NnZ0V1VGJ1TVU2dUVIRk83YTFPc2dnSSs3QUVBQUFBQUFBQ2tBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFWU2FsbUFRQUFBQUFBQUVNcTE3R0REMEpBVFlDTVRHRjJaalUyTGpRdU1UQXhWMEdNVEdGMlpqVTJMalF1TVRBeGM2U1EyMFl2L0Vsd3M3M0EvK0tmRWpNMTFFU0ppRUJrd0FBQUFBQUFGbFN1YXdFQUFBQUFBQUJIcmdFQUFBQUFBQUErMTRFQmM4V0JBWnlCQUNLMW5JTjFibVNHaFZaZlZsQTRnNEVCSStPRGhBVDNrTlhnQVFBQUFBQUFBQkt3Z1JDNmdSQlR3SUVCVkxDQkVGUzZnUkFmUTdaMUFRQUFBQUFBQUxIbmdRQ2dBUUFBQUFBQUFGeWhvNEVBQUlBUUFnQ2RBU29RQUJBQUFFY0loWVdJaFlTSUFnSUFEQTFnQVA3L3ExQ0FkYUVCQUFBQUFBQUFMYVlCQUFBQUFBQUFKTzZCQWFXZkVBSUFuUUVxRUFBUUFBQkhDSVdGaUlXRWlBSUNBQXdOWUFEKy83ci9RS0FCQUFBQUFBQUFRS0dWZ1FCVEFMRUJBQUVRRUFBWUFCaFlML1FBQ0FBQWRhRUJBQUFBQUFBQUg2WUJBQUFBQUFBQUZ1NkJBYVdSc1FFQUFSQVFBQmdBR0ZndjlBQUlBQUFjVTd0ckFRQUFBQUFBQUJHN2o3T0JBTGVLOTRFQjhZSUJnZkNCQXc9PScpO1xuICAgICAgdGhpcy5fd2FrZUxvY2tWaWRlby5wbGF5KCk7XG4gICAgfVxuICB9XG5cbiAgX3JlbGVhc2VXYWtlQ2xvY2soKSB7XG4gICAgY29uc3Qgb3MgPSBjbGllbnQucGxhdGZvcm0ub3M7XG5cbiAgICBpZiAob3MgPT09ICdpb3MnKSB7XG4gICAgICBpZiAodGhpcy5fd2FrZUxvY2tUaW1lcikge1xuICAgICAgICBjbGVhckludGVydmFsKHRoaXMuX3dha2VMb2NrVGltZXIpO1xuICAgICAgICB0aGlzLl93YWtlTG9ja1RpbWVyID0gbnVsbDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9zID09PSAnYW5kcm9pZCcpIHtcbiAgICAgIHRoaXMuX3dha2VMb2NrVmlkZW8ucGF1c2UoKTtcbiAgICAgIHRoaXMuX3dha2VMb2NrVmlkZW8uc3JjID0gJyc7XG4gICAgfVxuICB9XG59XG4iXX0=