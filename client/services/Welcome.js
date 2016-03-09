'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _wavesAudio = require('waves-audio');

var _client = require('../core/client');

var _client2 = _interopRequireDefault(_client);

var _screenfull = require('screenfull');

var _screenfull2 = _interopRequireDefault(_screenfull);

var _SegmentedView = require('../views/SegmentedView');

var _SegmentedView2 = _interopRequireDefault(_SegmentedView);

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

var _mobileDetect = require('mobile-detect');

var _mobileDetect2 = _interopRequireDefault(_mobileDetect);

var _platform = require('platform');

var _platform2 = _interopRequireDefault(_platform);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @private
 */


// @todo - redondant dependencies
function _base64(format, base64) {
  return 'data:' + format + ';base64,' + base64;
}

var SERVICE_ID = 'service:welcome';

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

var Welcome = function (_Service) {
  (0, _inherits3.default)(Welcome, _Service);

  function Welcome() {
    (0, _classCallCheck3.default)(this, Welcome);


    /**
     * @type {Object} [defaults={}] - Options.
     * @type {String} [defaults.name='welcome'] - Name of the module.
     * @type {Boolean} [defaults.activateAudio=true] - Indicates whether the module activates the Web Audio API when the participant touches the screen (useful on iOS devices).
     * @type {Boolean} [defaults.requireMobile=true] - Defines if the application requires the use of a mobile device.
     * @type {Boolean} [defaults.wakeLock=false] - Indicates whether the modules activates an ever-looping 1-pixel video to prevent the device from going idle.
     */

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Welcome).call(this, SERVICE_ID, false));

    var defaults = {
      requireMobile: true,
      activateAudio: true,
      fullScreen: false,
      wakeLock: false,
      showDialog: true,
      viewCtor: _SegmentedView2.default,
      viewPriority: 10
    };

    _this.configure(defaults);
    // check platform
    _this._defineAudioFileExtention();
    _this._definePlatform();
    return _this;
  }

  (0, _createClass3.default)(Welcome, [{
    key: 'init',
    value: function init() {
      // build view according to the device and requirements
      var os = _client2.default.platform.os;
      var version = parseFloat(_platform2.default.os.version);
      var isMobile = _client2.default.platform.isMobile;
      var requireMobile = this.options.requireMobile;
      var activateAudio = this.options.activateAudio;
      var content = this.content;
      var error = null;

      if (activateAudio && !this._supportsWebAudio()) {
        if (os === 'ios') {
          error = content.errorIosVersion;
        } else if (os === 'android') {
          error = content.errorAndroidVersion;
        } else if (requireMobile) {
          error = content.errorRequireMobile;
        } else {
          error = content.errorDefault;
        }
      } else if (requireMobile && (!isMobile || os === 'other')) {
        error = content.errorRequireMobile;
      } else if (os === 'ios' && version < 7) {
        error = content.errorIosVersion;
      } else if (os === 'android' && version < 4.2) {
        error = content.errorAndroidVersion;
      }

      content.error = error;
      _client2.default.compatible = error === null ? true : false;

      if (this.options.showDialog) {
        if (!error) {
          var event = isMobile ? 'touchend' : 'click';
          this.events = (0, _defineProperty3.default)({}, event, this.activateMedia.bind(this));
        }

        this.viewCtor = this.options.viewCtor;
        this.view = this.createView();
      }
    }
  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(Welcome.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

      if (!this.options.showDialog) this.ready();else this.show();
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.hide();
      (0, _get3.default)((0, _getPrototypeOf2.default)(Welcome.prototype), 'stop', this).call(this);
    }

    /**
     * Activate media as defined in `this.options`.
     */

  }, {
    key: 'activateMedia',
    value: function activateMedia() {
      if (_client2.default.rejected) {
        return;
      }
      // http://www.html5rocks.com/en/mobile/fullscreen/?redirect_from_locale=fr
      if (this.options.fullScreen && _screenfull2.default.enabled) _screenfull2.default.request();

      if (this.options.activateAudio) this._activateAudio();

      if (this.options.wakeLock) this._requestWakeLock();

      this.ready();
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
        _client2.default.platform.audioFileExt = '.mp3';
      } else if (!!(a.canPlayType && a.canPlayType('audio/ogg; codecs="vorbis"'))) {
        _client2.default.platform.audioFileExt = '.ogg';
      } else {
        _client2.default.platform.audioFileExt = '.wav';
      }
    }
  }, {
    key: '_definePlatform',
    value: function _definePlatform() {
      var ua = window.navigator.userAgent;
      var md = new _mobileDetect2.default(ua);

      _client2.default.platform.isMobile = md.mobile() !== null; // true if phone or tablet
      _client2.default.platform.os = function () {
        var os = md.os();

        if (os === 'AndroidOS') return 'android';else if (os === 'iOS') return 'ios';else return 'other';
      }();
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
      if (_client2.default.platform.os !== 'android') o.stop(_wavesAudio.audioContext.currentTime + 0.01);
    }

    // cf. https://github.com/borismus/webvr-boilerplate/blob/8abbc74cfa5976b9ab0c388cb0c51944008c6989/js/webvr-manager.js#L268-L289

  }, {
    key: '_initWakeLock',
    value: function _initWakeLock() {
      var _this2 = this;

      this._wakeLockVideo = document.createElement('video');

      this._wakeLockVideo.addEventListener('ended', function () {
        _this2._wakeLockVideo.play();
      });
    }
  }, {
    key: '_requestWakeLock',
    value: function _requestWakeLock() {
      var os = _client2.default.platform.os;
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
      var os = _client2.default.platform.os;

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
}(_Service3.default);

// register in factory


_serviceManager2.default.register(SERVICE_ID, Welcome);

exports.default = Welcome;
//# sourceMappingURL=data:application/json;base64,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QUFzQixZQUFZLFlBQU07QUFDdEMsaUJBQU8sUUFBUCxHQUFrQixPQUFPLFFBQVAsQ0FEb0I7QUFFdEMscUJBQVcsT0FBTyxJQUFQLEVBQWEsQ0FBeEIsRUFGc0M7U0FBTixFQUcvQixLQUhtQixDQUF0QixDQUhnQjtPQUFsQixNQU9PLElBQUksT0FBTyxTQUFQLEVBQWtCO0FBQzNCLFlBQUksS0FBSyxjQUFMLENBQW9CLE1BQXBCLEtBQStCLEtBQS9CLEVBQXNDLE9BQTFDOztBQUVBLGFBQUssY0FBTCxDQUFvQixHQUFwQixHQUEwQixRQUFRLFlBQVIsRUFBc0IsazNCQUF0QixDQUExQixDQUgyQjtBQUkzQixhQUFLLGNBQUwsQ0FBb0IsSUFBcEIsR0FKMkI7T0FBdEI7Ozs7d0NBUVc7QUFDbEIsVUFBTSxLQUFLLGlCQUFPLFFBQVAsQ0FBZ0IsRUFBaEIsQ0FETzs7QUFHbEIsVUFBSSxPQUFPLEtBQVAsRUFBYztBQUNoQixZQUFJLEtBQUssY0FBTCxFQUFxQjtBQUN2Qix3QkFBYyxLQUFLLGNBQUwsQ0FBZCxDQUR1QjtBQUV2QixlQUFLLGNBQUwsR0FBc0IsSUFBdEIsQ0FGdUI7U0FBekI7T0FERixNQUtPLElBQUksT0FBTyxTQUFQLEVBQWtCO0FBQzNCLGFBQUssY0FBTCxDQUFvQixLQUFwQixHQUQyQjtBQUUzQixhQUFLLGNBQUwsQ0FBb0IsR0FBcEIsR0FBMEIsRUFBMUIsQ0FGMkI7T0FBdEI7OztTQTFMTDs7Ozs7O0FBa01OLHlCQUFlLFFBQWYsQ0FBd0IsVUFBeEIsRUFBb0MsT0FBcEM7O2tCQUVlIiwiZmlsZSI6IldlbGNvbWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhdWRpb0NvbnRleHQgfSBmcm9tICd3YXZlcy1hdWRpbyc7XG5pbXBvcnQgY2xpZW50IGZyb20gJy4uL2NvcmUvY2xpZW50JztcbmltcG9ydCBzY3JlZW5mdWxsIGZyb20gJ3NjcmVlbmZ1bGwnO1xuaW1wb3J0IFNlZ21lbnRlZFZpZXcgZnJvbSAnLi4vdmlld3MvU2VnbWVudGVkVmlldyc7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuXG4vLyBAdG9kbyAtIHJlZG9uZGFudCBkZXBlbmRlbmNpZXNcbmltcG9ydCBNb2JpbGVEZXRlY3QgZnJvbSAnbW9iaWxlLWRldGVjdCc7XG5pbXBvcnQgcGxhdGZvcm0gZnJvbSAncGxhdGZvcm0nO1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIF9iYXNlNjQoZm9ybWF0LCBiYXNlNjQpIHtcbiAgcmV0dXJuIGBkYXRhOiR7Zm9ybWF0fTtiYXNlNjQsJHtiYXNlNjR9YDtcbn1cblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOndlbGNvbWUnO1xuXG4vKipcbiAqIFtjbGllbnRdIENoZWNrIHdoZXRoZXIgdGhlIGRldmljZSBpcyBjb21wYXRpYmxlIHdpdGggdGhlIHRlY2hub2xvZ2llcyB1c2VkIGluIHRoZSAqU291bmR3b3JrcyogbGlicmFyeS5cbiAqIFRoZSBtb2R1bGUgc2hvdWxkIHVzZWQgYXQgdGhlIHZlcnkgYmVnaW5uaW5nIG9mIGEgc2NlbmFyaW8gdG8gYWN0aXZhdGUgdGhlIFdlYiBBdWRpbyBBUEkgb24gaU9TIGRldmljZXMgKHdpdGggdGhlIGBhY3RpdmF0ZUF1ZGlvYCBvcHRpb24pLlxuICpcbiAqIFRoZSBtb2R1bGUgcmVxdWlyZXMgdGhlIHBhcnRpY2lwYW50IHRvIHRhcCB0aGUgc2NyZWVuIGluIG9yZGVyIHRvIGluaXRpYWxpemUgdGhlIHdlYkF1ZGlvIG9uIGlPUyBkZXZpY2VzIGFuZCB0byBtYWtlIHRoZSB2aWV3IGRpc2FwcGVhci5cbiAqXG4gKiBDb21wYXRpYmxlIGRldmljZXMgYXJlIHJ1bm5pbmcgb24gaU9TIDcgb3IgYWJvdmUsIG9yIG9uIEFuZHJvaWQgNC4yIG9yIGFib3ZlIHdpdGggdGhlIENocm9tZSBicm93c2VyIGluIHZlcnNpb24gMzUgb3IgYWJvdmUuXG4gKiBJZiB0aGF0IGlzIG5vdCB0aGUgY2FzZSwgdGhlIG1vZHVsZSBkaXNwbGF5cyBhIGJsb2NraW5nIGB2aWV3YCBhbmQgcHJldmVudHMgdGhlIHBhcnRpY2lwYW50IHRvIGdvIGFueSBmdXJ0aGVyIGluIHRoZSBzY2VuYXJpby5cbiAqXG4gKiBUaGUgbW9kdWxlIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbiB3aGVuIHRoZSB1c2VyIHRvdWNoZXMgdGhlIHNjcmVlbiBpZiB0aGUgZGV2aWNlIHBhc3NlcyB0aGUgcGxhdGZvcm0gdGVzdCwgYW5kIG5ldmVyIG90aGVyd2lzZS5cbiAqXG4gKiBUaGUgbW9kdWxlIGFsd2F5cyBoYXMgYSB2aWV3LlxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCB3ZWxjb21lRGlhbG9nID0gbmV3IFdlbGNvbWUoe1xuICogICB3YWtlTG9jazogdHJ1ZVxuICogfSk7XG4gKi9cbmNsYXNzIFdlbGNvbWUgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgZmFsc2UpO1xuXG4gICAgLyoqXG4gICAgICogQHR5cGUge09iamVjdH0gW2RlZmF1bHRzPXt9XSAtIE9wdGlvbnMuXG4gICAgICogQHR5cGUge1N0cmluZ30gW2RlZmF1bHRzLm5hbWU9J3dlbGNvbWUnXSAtIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn0gW2RlZmF1bHRzLmFjdGl2YXRlQXVkaW89dHJ1ZV0gLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgbW9kdWxlIGFjdGl2YXRlcyB0aGUgV2ViIEF1ZGlvIEFQSSB3aGVuIHRoZSBwYXJ0aWNpcGFudCB0b3VjaGVzIHRoZSBzY3JlZW4gKHVzZWZ1bCBvbiBpT1MgZGV2aWNlcykuXG4gICAgICogQHR5cGUge0Jvb2xlYW59IFtkZWZhdWx0cy5yZXF1aXJlTW9iaWxlPXRydWVdIC0gRGVmaW5lcyBpZiB0aGUgYXBwbGljYXRpb24gcmVxdWlyZXMgdGhlIHVzZSBvZiBhIG1vYmlsZSBkZXZpY2UuXG4gICAgICogQHR5cGUge0Jvb2xlYW59IFtkZWZhdWx0cy53YWtlTG9jaz1mYWxzZV0gLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgbW9kdWxlcyBhY3RpdmF0ZXMgYW4gZXZlci1sb29waW5nIDEtcGl4ZWwgdmlkZW8gdG8gcHJldmVudCB0aGUgZGV2aWNlIGZyb20gZ29pbmcgaWRsZS5cbiAgICAgKi9cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIHJlcXVpcmVNb2JpbGU6IHRydWUsXG4gICAgICBhY3RpdmF0ZUF1ZGlvOiB0cnVlLFxuICAgICAgZnVsbFNjcmVlbjogZmFsc2UsXG4gICAgICB3YWtlTG9jazogZmFsc2UsXG4gICAgICBzaG93RGlhbG9nOiB0cnVlLFxuICAgICAgdmlld0N0b3I6IFNlZ21lbnRlZFZpZXcsXG4gICAgICB2aWV3UHJpb3JpdHk6IDEwLFxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG4gICAgLy8gY2hlY2sgcGxhdGZvcm1cbiAgICB0aGlzLl9kZWZpbmVBdWRpb0ZpbGVFeHRlbnRpb24oKTtcbiAgICB0aGlzLl9kZWZpbmVQbGF0Zm9ybSgpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICAvLyBidWlsZCB2aWV3IGFjY29yZGluZyB0byB0aGUgZGV2aWNlIGFuZCByZXF1aXJlbWVudHNcbiAgICBjb25zdCBvcyA9IGNsaWVudC5wbGF0Zm9ybS5vcztcbiAgICBjb25zdCB2ZXJzaW9uID0gcGFyc2VGbG9hdChwbGF0Zm9ybS5vcy52ZXJzaW9uKTtcbiAgICBjb25zdCBpc01vYmlsZSA9IGNsaWVudC5wbGF0Zm9ybS5pc01vYmlsZTtcbiAgICBjb25zdCByZXF1aXJlTW9iaWxlID0gdGhpcy5vcHRpb25zLnJlcXVpcmVNb2JpbGU7XG4gICAgY29uc3QgYWN0aXZhdGVBdWRpbyA9IHRoaXMub3B0aW9ucy5hY3RpdmF0ZUF1ZGlvO1xuICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLmNvbnRlbnQ7XG4gICAgbGV0IGVycm9yID0gbnVsbDtcblxuICAgIGlmIChhY3RpdmF0ZUF1ZGlvICYmICF0aGlzLl9zdXBwb3J0c1dlYkF1ZGlvKCkpIHtcbiAgICAgIGlmIChvcyA9PT0gJ2lvcycpIHtcbiAgICAgICAgZXJyb3IgPSBjb250ZW50LmVycm9ySW9zVmVyc2lvbjtcbiAgICAgIH0gZWxzZSBpZiAob3MgPT09ICdhbmRyb2lkJykge1xuICAgICAgICBlcnJvciA9IGNvbnRlbnQuZXJyb3JBbmRyb2lkVmVyc2lvbjtcbiAgICAgIH0gZWxzZSBpZiAocmVxdWlyZU1vYmlsZSkge1xuICAgICAgICBlcnJvciA9IGNvbnRlbnQuZXJyb3JSZXF1aXJlTW9iaWxlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZXJyb3IgPSBjb250ZW50LmVycm9yRGVmYXVsdDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHJlcXVpcmVNb2JpbGUgJiYgKCFpc01vYmlsZSB8fCBvcyA9PT0gJ290aGVyJykpIHtcbiAgICAgIGVycm9yID0gY29udGVudC5lcnJvclJlcXVpcmVNb2JpbGU7XG4gICAgfSBlbHNlIGlmIChvcyA9PT0gJ2lvcycgJiYgdmVyc2lvbiA8IDcpIHtcbiAgICAgIGVycm9yID0gY29udGVudC5lcnJvcklvc1ZlcnNpb247XG4gICAgfSBlbHNlIGlmIChvcyA9PT0gJ2FuZHJvaWQnICYmIHZlcnNpb24gPCA0LjIpIHtcbiAgICAgIGVycm9yID0gY29udGVudC5lcnJvckFuZHJvaWRWZXJzaW9uO1xuICAgIH1cblxuICAgIGNvbnRlbnQuZXJyb3IgPSBlcnJvcjtcbiAgICBjbGllbnQuY29tcGF0aWJsZSA9IGVycm9yID09PSBudWxsID8gdHJ1ZSA6IGZhbHNlO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5zaG93RGlhbG9nKSB7XG4gICAgICBpZiAoIWVycm9yKSB7XG4gICAgICAgIGNvbnN0IGV2ZW50ID0gaXNNb2JpbGUgPyAndG91Y2hlbmQnIDogJ2NsaWNrJztcbiAgICAgICAgdGhpcy5ldmVudHMgPSB7IFtldmVudF06IHRoaXMuYWN0aXZhdGVNZWRpYS5iaW5kKHRoaXMpIH07XG4gICAgICB9XG5cbiAgICAgIHRoaXMudmlld0N0b3IgPSB0aGlzLm9wdGlvbnMudmlld0N0b3I7XG4gICAgICB0aGlzLnZpZXcgPSB0aGlzLmNyZWF0ZVZpZXcoKTtcbiAgICB9XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgaWYgKCF0aGlzLmhhc1N0YXJ0ZWQpXG4gICAgICB0aGlzLmluaXQoKTtcblxuICAgIGlmICghdGhpcy5vcHRpb25zLnNob3dEaWFsb2cpXG4gICAgICB0aGlzLnJlYWR5KCk7XG4gICAgZWxzZVxuICAgICAgdGhpcy5zaG93KCk7XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHRoaXMuaGlkZSgpO1xuICAgIHN1cGVyLnN0b3AoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBY3RpdmF0ZSBtZWRpYSBhcyBkZWZpbmVkIGluIGB0aGlzLm9wdGlvbnNgLlxuICAgKi9cbiAgYWN0aXZhdGVNZWRpYSgpIHtcbiAgICBpZiAoY2xpZW50LnJlamVjdGVkKSB7IHJldHVybjsgfVxuICAgIC8vIGh0dHA6Ly93d3cuaHRtbDVyb2Nrcy5jb20vZW4vbW9iaWxlL2Z1bGxzY3JlZW4vP3JlZGlyZWN0X2Zyb21fbG9jYWxlPWZyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5mdWxsU2NyZWVuICYmIHNjcmVlbmZ1bGwuZW5hYmxlZClcbiAgICAgIHNjcmVlbmZ1bGwucmVxdWVzdCgpO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5hY3RpdmF0ZUF1ZGlvKVxuICAgICAgdGhpcy5fYWN0aXZhdGVBdWRpbygpO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy53YWtlTG9jaylcbiAgICAgIHRoaXMuX3JlcXVlc3RXYWtlTG9jaygpO1xuXG4gICAgdGhpcy5yZWFkeSgpO1xuICB9XG5cbiAgX3N1cHBvcnRzV2ViQXVkaW8oKSB7XG4gICAgcmV0dXJuICEhYXVkaW9Db250ZXh0O1xuICB9XG5cbiAgX2RlZmluZUF1ZGlvRmlsZUV4dGVudGlvbigpIHtcbiAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYXVkaW8nKTtcbiAgICAvLyBodHRwOi8vZGl2ZWludG9odG1sNS5pbmZvL2V2ZXJ5dGhpbmcuaHRtbFxuICAgIGlmICghIShhLmNhblBsYXlUeXBlICYmIGEuY2FuUGxheVR5cGUoJ2F1ZGlvL21wZWc7JykpKSB7XG4gICAgICBjbGllbnQucGxhdGZvcm0uYXVkaW9GaWxlRXh0ID0gJy5tcDMnO1xuICAgIH0gZWxzZSBpZiAoISEoYS5jYW5QbGF5VHlwZSAmJiBhLmNhblBsYXlUeXBlKCdhdWRpby9vZ2c7IGNvZGVjcz1cInZvcmJpc1wiJykpKSB7XG4gICAgICBjbGllbnQucGxhdGZvcm0uYXVkaW9GaWxlRXh0ID0gJy5vZ2cnO1xuICAgIH0gZWxzZSB7XG4gICAgICBjbGllbnQucGxhdGZvcm0uYXVkaW9GaWxlRXh0ID0gJy53YXYnO1xuICAgIH1cbiAgfVxuXG4gIF9kZWZpbmVQbGF0Zm9ybSgpIHtcbiAgICBjb25zdCB1YSA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50XG4gICAgY29uc3QgbWQgPSBuZXcgTW9iaWxlRGV0ZWN0KHVhKTtcblxuICAgIGNsaWVudC5wbGF0Zm9ybS5pc01vYmlsZSA9IChtZC5tb2JpbGUoKSAhPT0gbnVsbCk7IC8vIHRydWUgaWYgcGhvbmUgb3IgdGFibGV0XG4gICAgY2xpZW50LnBsYXRmb3JtLm9zID0gKGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IG9zID0gbWQub3MoKTtcblxuICAgICAgaWYgKG9zID09PSAnQW5kcm9pZE9TJylcbiAgICAgICAgcmV0dXJuICdhbmRyb2lkJztcbiAgICAgIGVsc2UgaWYgKG9zID09PSAnaU9TJylcbiAgICAgICAgcmV0dXJuICdpb3MnO1xuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gJ290aGVyJztcbiAgICB9KSgpO1xuICB9XG5cbiAgX2FjdGl2YXRlQXVkaW8oKSB7XG4gICAgdmFyIG8gPSBhdWRpb0NvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xuICAgIHZhciBnID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgICBnLmdhaW4udmFsdWUgPSAwLjAwMDAwMDAwMTsgLy8gLTE4MGRCID9cbiAgICBvLmNvbm5lY3QoZyk7XG4gICAgZy5jb25uZWN0KGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbik7XG4gICAgby5zdGFydCgwKTtcblxuICAgIC8vIHByZXZlbnQgYW5kcm9pZCB0byBzdG9wIGF1ZGlvIGJ5IGtlcGluZyB0aGUgb3NjaWxsYXRvciBhY3RpdmVcbiAgICBpZiAoY2xpZW50LnBsYXRmb3JtLm9zICE9PSAnYW5kcm9pZCcpXG4gICAgICBvLnN0b3AoYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lICsgMC4wMSk7XG4gIH1cblxuICAvLyBjZi4gaHR0cHM6Ly9naXRodWIuY29tL2JvcmlzbXVzL3dlYnZyLWJvaWxlcnBsYXRlL2Jsb2IvOGFiYmM3NGNmYTU5NzZiOWFiMGMzODhjYjBjNTE5NDQwMDhjNjk4OS9qcy93ZWJ2ci1tYW5hZ2VyLmpzI0wyNjgtTDI4OVxuICBfaW5pdFdha2VMb2NrKCkge1xuICAgIHRoaXMuX3dha2VMb2NrVmlkZW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd2aWRlbycpO1xuXG4gICAgdGhpcy5fd2FrZUxvY2tWaWRlby5hZGRFdmVudExpc3RlbmVyKCdlbmRlZCcsICgpID0+IHtcbiAgICAgIHRoaXMuX3dha2VMb2NrVmlkZW8ucGxheSgpO1xuICAgIH0pO1xuICB9XG5cbiAgX3JlcXVlc3RXYWtlTG9jaygpIHtcbiAgICBjb25zdCBvcyA9IGNsaWVudC5wbGF0Zm9ybS5vcztcbiAgICB0aGlzLl9yZWxlYXNlV2FrZUNsb2NrKCk7XG5cbiAgICBpZiAob3MgPT09ICdpb3MnKSB7XG4gICAgICBpZiAodGhpcy5fd2FrZUxvY2tUaW1lcikgcmV0dXJuO1xuXG4gICAgICB0aGlzLl93YWtlTG9ja1RpbWVyID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24gPSB3aW5kb3cubG9jYXRpb247XG4gICAgICAgIHNldFRpbWVvdXQod2luZG93LnN0b3AsIDApO1xuICAgICAgfSwgMzAwMDApO1xuICAgIH0gZWxzZSBpZiAob3MgPT09ICdhbmRyb2lkJykge1xuICAgICAgaWYgKHRoaXMuX3dha2VMb2NrVmlkZW8ucGF1c2VkID09PSBmYWxzZSkgcmV0dXJuO1xuXG4gICAgICB0aGlzLl93YWtlTG9ja1ZpZGVvLnNyYyA9IF9iYXNlNjQoJ3ZpZGVvL3dlYm0nLCAnR2tYZm93RUFBQUFBQUFBZlFvYUJBVUwzZ1FGQzhvRUVRdk9CQ0VLQ2hIZGxZbTFDaDRFQ1FvV0JBaGhUZ0djQkFBQUFBQUFDV3hGTm0zUkFMRTI3aTFPcmhCVkpxV1pUcklIZlRidU1VNnVFRmxTdWExT3NnZ0V1VGJ1TVU2dUVIRk83YTFPc2dnSSs3QUVBQUFBQUFBQ2tBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFWU2FsbUFRQUFBQUFBQUVNcTE3R0REMEpBVFlDTVRHRjJaalUyTGpRdU1UQXhWMEdNVEdGMlpqVTJMalF1TVRBeGM2U1EyMFl2L0Vsd3M3M0EvK0tmRWpNMTFFU0ppRUJrd0FBQUFBQUFGbFN1YXdFQUFBQUFBQUJIcmdFQUFBQUFBQUErMTRFQmM4V0JBWnlCQUNLMW5JTjFibVNHaFZaZlZsQTRnNEVCSStPRGhBVDNrTlhnQVFBQUFBQUFBQkt3Z1JDNmdSQlR3SUVCVkxDQkVGUzZnUkFmUTdaMUFRQUFBQUFBQUxIbmdRQ2dBUUFBQUFBQUFGeWhvNEVBQUlBUUFnQ2RBU29RQUJBQUFFY0loWVdJaFlTSUFnSUFEQTFnQVA3L3ExQ0FkYUVCQUFBQUFBQUFMYVlCQUFBQUFBQUFKTzZCQWFXZkVBSUFuUUVxRUFBUUFBQkhDSVdGaUlXRWlBSUNBQXdOWUFEKy83ci9RS0FCQUFBQUFBQUFRS0dWZ1FCVEFMRUJBQUVRRUFBWUFCaFlML1FBQ0FBQWRhRUJBQUFBQUFBQUg2WUJBQUFBQUFBQUZ1NkJBYVdSc1FFQUFSQVFBQmdBR0ZndjlBQUlBQUFjVTd0ckFRQUFBQUFBQUJHN2o3T0JBTGVLOTRFQjhZSUJnZkNCQXc9PScpO1xuICAgICAgdGhpcy5fd2FrZUxvY2tWaWRlby5wbGF5KCk7XG4gICAgfVxuICB9XG5cbiAgX3JlbGVhc2VXYWtlQ2xvY2soKSB7XG4gICAgY29uc3Qgb3MgPSBjbGllbnQucGxhdGZvcm0ub3M7XG5cbiAgICBpZiAob3MgPT09ICdpb3MnKSB7XG4gICAgICBpZiAodGhpcy5fd2FrZUxvY2tUaW1lcikge1xuICAgICAgICBjbGVhckludGVydmFsKHRoaXMuX3dha2VMb2NrVGltZXIpO1xuICAgICAgICB0aGlzLl93YWtlTG9ja1RpbWVyID0gbnVsbDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9zID09PSAnYW5kcm9pZCcpIHtcbiAgICAgIHRoaXMuX3dha2VMb2NrVmlkZW8ucGF1c2UoKTtcbiAgICAgIHRoaXMuX3dha2VMb2NrVmlkZW8uc3JjID0gJyc7XG4gICAgfVxuICB9XG59XG5cbi8vIHJlZ2lzdGVyIGluIGZhY3RvcnlcbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIFdlbGNvbWUpO1xuXG5leHBvcnQgZGVmYXVsdCBXZWxjb21lO1xuXG4iXX0=