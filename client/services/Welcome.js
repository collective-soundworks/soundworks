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

var _SegmentedView = require('../display/SegmentedView');

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
//# sourceMappingURL=data:application/json;base64,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QUFzQixZQUFZLFlBQU07QUFDdEMsaUJBQU8sUUFBUCxHQUFrQixPQUFPLFFBQVAsQ0FEb0I7QUFFdEMscUJBQVcsT0FBTyxJQUFQLEVBQWEsQ0FBeEIsRUFGc0M7U0FBTixFQUcvQixLQUhtQixDQUF0QixDQUhnQjtPQUFsQixNQU9PLElBQUksT0FBTyxTQUFQLEVBQWtCO0FBQzNCLFlBQUksS0FBSyxjQUFMLENBQW9CLE1BQXBCLEtBQStCLEtBQS9CLEVBQXNDLE9BQTFDOztBQUVBLGFBQUssY0FBTCxDQUFvQixHQUFwQixHQUEwQixRQUFRLFlBQVIsRUFBc0IsazNCQUF0QixDQUExQixDQUgyQjtBQUkzQixhQUFLLGNBQUwsQ0FBb0IsSUFBcEIsR0FKMkI7T0FBdEI7Ozs7d0NBUVc7QUFDbEIsVUFBTSxLQUFLLGlCQUFPLFFBQVAsQ0FBZ0IsRUFBaEIsQ0FETzs7QUFHbEIsVUFBSSxPQUFPLEtBQVAsRUFBYztBQUNoQixZQUFJLEtBQUssY0FBTCxFQUFxQjtBQUN2Qix3QkFBYyxLQUFLLGNBQUwsQ0FBZCxDQUR1QjtBQUV2QixlQUFLLGNBQUwsR0FBc0IsSUFBdEIsQ0FGdUI7U0FBekI7T0FERixNQUtPLElBQUksT0FBTyxTQUFQLEVBQWtCO0FBQzNCLGFBQUssY0FBTCxDQUFvQixLQUFwQixHQUQyQjtBQUUzQixhQUFLLGNBQUwsQ0FBb0IsR0FBcEIsR0FBMEIsRUFBMUIsQ0FGMkI7T0FBdEI7OztTQTFMTDs7Ozs7O0FBa01OLHlCQUFlLFFBQWYsQ0FBd0IsVUFBeEIsRUFBb0MsT0FBcEM7O2tCQUVlIiwiZmlsZSI6IldlbGNvbWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhdWRpb0NvbnRleHQgfSBmcm9tICd3YXZlcy1hdWRpbyc7XG5pbXBvcnQgY2xpZW50IGZyb20gJy4uL2NvcmUvY2xpZW50JztcbmltcG9ydCBzY3JlZW5mdWxsIGZyb20gJ3NjcmVlbmZ1bGwnO1xuaW1wb3J0IFNlZ21lbnRlZFZpZXcgZnJvbSAnLi4vZGlzcGxheS9TZWdtZW50ZWRWaWV3JztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbi8vIEB0b2RvIC0gcmVkb25kYW50IGRlcGVuZGVuY2llc1xuaW1wb3J0IE1vYmlsZURldGVjdCBmcm9tICdtb2JpbGUtZGV0ZWN0JztcbmltcG9ydCBwbGF0Zm9ybSBmcm9tICdwbGF0Zm9ybSc7XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gX2Jhc2U2NChmb3JtYXQsIGJhc2U2NCkge1xuICByZXR1cm4gYGRhdGE6JHtmb3JtYXR9O2Jhc2U2NCwke2Jhc2U2NH1gO1xufVxuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6d2VsY29tZSc7XG5cbi8qKlxuICogW2NsaWVudF0gQ2hlY2sgd2hldGhlciB0aGUgZGV2aWNlIGlzIGNvbXBhdGlibGUgd2l0aCB0aGUgdGVjaG5vbG9naWVzIHVzZWQgaW4gdGhlICpTb3VuZHdvcmtzKiBsaWJyYXJ5LlxuICogVGhlIG1vZHVsZSBzaG91bGQgdXNlZCBhdCB0aGUgdmVyeSBiZWdpbm5pbmcgb2YgYSBzY2VuYXJpbyB0byBhY3RpdmF0ZSB0aGUgV2ViIEF1ZGlvIEFQSSBvbiBpT1MgZGV2aWNlcyAod2l0aCB0aGUgYGFjdGl2YXRlQXVkaW9gIG9wdGlvbikuXG4gKlxuICogVGhlIG1vZHVsZSByZXF1aXJlcyB0aGUgcGFydGljaXBhbnQgdG8gdGFwIHRoZSBzY3JlZW4gaW4gb3JkZXIgdG8gaW5pdGlhbGl6ZSB0aGUgd2ViQXVkaW8gb24gaU9TIGRldmljZXMgYW5kIHRvIG1ha2UgdGhlIHZpZXcgZGlzYXBwZWFyLlxuICpcbiAqIENvbXBhdGlibGUgZGV2aWNlcyBhcmUgcnVubmluZyBvbiBpT1MgNyBvciBhYm92ZSwgb3Igb24gQW5kcm9pZCA0LjIgb3IgYWJvdmUgd2l0aCB0aGUgQ2hyb21lIGJyb3dzZXIgaW4gdmVyc2lvbiAzNSBvciBhYm92ZS5cbiAqIElmIHRoYXQgaXMgbm90IHRoZSBjYXNlLCB0aGUgbW9kdWxlIGRpc3BsYXlzIGEgYmxvY2tpbmcgYHZpZXdgIGFuZCBwcmV2ZW50cyB0aGUgcGFydGljaXBhbnQgdG8gZ28gYW55IGZ1cnRoZXIgaW4gdGhlIHNjZW5hcmlvLlxuICpcbiAqIFRoZSBtb2R1bGUgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uIHdoZW4gdGhlIHVzZXIgdG91Y2hlcyB0aGUgc2NyZWVuIGlmIHRoZSBkZXZpY2UgcGFzc2VzIHRoZSBwbGF0Zm9ybSB0ZXN0LCBhbmQgbmV2ZXIgb3RoZXJ3aXNlLlxuICpcbiAqIFRoZSBtb2R1bGUgYWx3YXlzIGhhcyBhIHZpZXcuXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IHdlbGNvbWVEaWFsb2cgPSBuZXcgV2VsY29tZSh7XG4gKiAgIHdha2VMb2NrOiB0cnVlXG4gKiB9KTtcbiAqL1xuY2xhc3MgV2VsY29tZSBleHRlbmRzIFNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCBmYWxzZSk7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7T2JqZWN0fSBbZGVmYXVsdHM9e31dIC0gT3B0aW9ucy5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfSBbZGVmYXVsdHMubmFtZT0nd2VsY29tZSddIC0gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgICAqIEB0eXBlIHtCb29sZWFufSBbZGVmYXVsdHMuYWN0aXZhdGVBdWRpbz10cnVlXSAtIEluZGljYXRlcyB3aGV0aGVyIHRoZSBtb2R1bGUgYWN0aXZhdGVzIHRoZSBXZWIgQXVkaW8gQVBJIHdoZW4gdGhlIHBhcnRpY2lwYW50IHRvdWNoZXMgdGhlIHNjcmVlbiAodXNlZnVsIG9uIGlPUyBkZXZpY2VzKS5cbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn0gW2RlZmF1bHRzLnJlcXVpcmVNb2JpbGU9dHJ1ZV0gLSBEZWZpbmVzIGlmIHRoZSBhcHBsaWNhdGlvbiByZXF1aXJlcyB0aGUgdXNlIG9mIGEgbW9iaWxlIGRldmljZS5cbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn0gW2RlZmF1bHRzLndha2VMb2NrPWZhbHNlXSAtIEluZGljYXRlcyB3aGV0aGVyIHRoZSBtb2R1bGVzIGFjdGl2YXRlcyBhbiBldmVyLWxvb3BpbmcgMS1waXhlbCB2aWRlbyB0byBwcmV2ZW50IHRoZSBkZXZpY2UgZnJvbSBnb2luZyBpZGxlLlxuICAgICAqL1xuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgcmVxdWlyZU1vYmlsZTogdHJ1ZSxcbiAgICAgIGFjdGl2YXRlQXVkaW86IHRydWUsXG4gICAgICBmdWxsU2NyZWVuOiBmYWxzZSxcbiAgICAgIHdha2VMb2NrOiBmYWxzZSxcbiAgICAgIHNob3dEaWFsb2c6IHRydWUsXG4gICAgICB2aWV3Q3RvcjogU2VnbWVudGVkVmlldyxcbiAgICAgIHZpZXdQcmlvcml0eTogMTAsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcbiAgICAvLyBjaGVjayBwbGF0Zm9ybVxuICAgIHRoaXMuX2RlZmluZUF1ZGlvRmlsZUV4dGVudGlvbigpO1xuICAgIHRoaXMuX2RlZmluZVBsYXRmb3JtKCk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIC8vIGJ1aWxkIHZpZXcgYWNjb3JkaW5nIHRvIHRoZSBkZXZpY2UgYW5kIHJlcXVpcmVtZW50c1xuICAgIGNvbnN0IG9zID0gY2xpZW50LnBsYXRmb3JtLm9zO1xuICAgIGNvbnN0IHZlcnNpb24gPSBwYXJzZUZsb2F0KHBsYXRmb3JtLm9zLnZlcnNpb24pO1xuICAgIGNvbnN0IGlzTW9iaWxlID0gY2xpZW50LnBsYXRmb3JtLmlzTW9iaWxlO1xuICAgIGNvbnN0IHJlcXVpcmVNb2JpbGUgPSB0aGlzLm9wdGlvbnMucmVxdWlyZU1vYmlsZTtcbiAgICBjb25zdCBhY3RpdmF0ZUF1ZGlvID0gdGhpcy5vcHRpb25zLmFjdGl2YXRlQXVkaW87XG4gICAgY29uc3QgY29udGVudCA9IHRoaXMuY29udGVudDtcbiAgICBsZXQgZXJyb3IgPSBudWxsO1xuXG4gICAgaWYgKGFjdGl2YXRlQXVkaW8gJiYgIXRoaXMuX3N1cHBvcnRzV2ViQXVkaW8oKSkge1xuICAgICAgaWYgKG9zID09PSAnaW9zJykge1xuICAgICAgICBlcnJvciA9IGNvbnRlbnQuZXJyb3JJb3NWZXJzaW9uO1xuICAgICAgfSBlbHNlIGlmIChvcyA9PT0gJ2FuZHJvaWQnKSB7XG4gICAgICAgIGVycm9yID0gY29udGVudC5lcnJvckFuZHJvaWRWZXJzaW9uO1xuICAgICAgfSBlbHNlIGlmIChyZXF1aXJlTW9iaWxlKSB7XG4gICAgICAgIGVycm9yID0gY29udGVudC5lcnJvclJlcXVpcmVNb2JpbGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlcnJvciA9IGNvbnRlbnQuZXJyb3JEZWZhdWx0O1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAocmVxdWlyZU1vYmlsZSAmJiAoIWlzTW9iaWxlIHx8IG9zID09PSAnb3RoZXInKSkge1xuICAgICAgZXJyb3IgPSBjb250ZW50LmVycm9yUmVxdWlyZU1vYmlsZTtcbiAgICB9IGVsc2UgaWYgKG9zID09PSAnaW9zJyAmJiB2ZXJzaW9uIDwgNykge1xuICAgICAgZXJyb3IgPSBjb250ZW50LmVycm9ySW9zVmVyc2lvbjtcbiAgICB9IGVsc2UgaWYgKG9zID09PSAnYW5kcm9pZCcgJiYgdmVyc2lvbiA8IDQuMikge1xuICAgICAgZXJyb3IgPSBjb250ZW50LmVycm9yQW5kcm9pZFZlcnNpb247XG4gICAgfVxuXG4gICAgY29udGVudC5lcnJvciA9IGVycm9yO1xuICAgIGNsaWVudC5jb21wYXRpYmxlID0gZXJyb3IgPT09IG51bGwgPyB0cnVlIDogZmFsc2U7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnNob3dEaWFsb2cpIHtcbiAgICAgIGlmICghZXJyb3IpIHtcbiAgICAgICAgY29uc3QgZXZlbnQgPSBpc01vYmlsZSA/ICd0b3VjaGVuZCcgOiAnY2xpY2snO1xuICAgICAgICB0aGlzLmV2ZW50cyA9IHsgW2V2ZW50XTogdGhpcy5hY3RpdmF0ZU1lZGlhLmJpbmQodGhpcykgfTtcbiAgICAgIH1cblxuICAgICAgdGhpcy52aWV3Q3RvciA9IHRoaXMub3B0aW9ucy52aWV3Q3RvcjtcbiAgICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlVmlldygpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBpZiAoIXRoaXMuaGFzU3RhcnRlZClcbiAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuc2hvd0RpYWxvZylcbiAgICAgIHRoaXMucmVhZHkoKTtcbiAgICBlbHNlXG4gICAgICB0aGlzLnNob3coKTtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5oaWRlKCk7XG4gICAgc3VwZXIuc3RvcCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFjdGl2YXRlIG1lZGlhIGFzIGRlZmluZWQgaW4gYHRoaXMub3B0aW9uc2AuXG4gICAqL1xuICBhY3RpdmF0ZU1lZGlhKCkge1xuICAgIGlmIChjbGllbnQucmVqZWN0ZWQpIHsgcmV0dXJuOyB9XG4gICAgLy8gaHR0cDovL3d3dy5odG1sNXJvY2tzLmNvbS9lbi9tb2JpbGUvZnVsbHNjcmVlbi8/cmVkaXJlY3RfZnJvbV9sb2NhbGU9ZnJcbiAgICBpZiAodGhpcy5vcHRpb25zLmZ1bGxTY3JlZW4gJiYgc2NyZWVuZnVsbC5lbmFibGVkKVxuICAgICAgc2NyZWVuZnVsbC5yZXF1ZXN0KCk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmFjdGl2YXRlQXVkaW8pXG4gICAgICB0aGlzLl9hY3RpdmF0ZUF1ZGlvKCk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLndha2VMb2NrKVxuICAgICAgdGhpcy5fcmVxdWVzdFdha2VMb2NrKCk7XG5cbiAgICB0aGlzLnJlYWR5KCk7XG4gIH1cblxuICBfc3VwcG9ydHNXZWJBdWRpbygpIHtcbiAgICByZXR1cm4gISFhdWRpb0NvbnRleHQ7XG4gIH1cblxuICBfZGVmaW5lQXVkaW9GaWxlRXh0ZW50aW9uKCkge1xuICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhdWRpbycpO1xuICAgIC8vIGh0dHA6Ly9kaXZlaW50b2h0bWw1LmluZm8vZXZlcnl0aGluZy5odG1sXG4gICAgaWYgKCEhKGEuY2FuUGxheVR5cGUgJiYgYS5jYW5QbGF5VHlwZSgnYXVkaW8vbXBlZzsnKSkpIHtcbiAgICAgIGNsaWVudC5wbGF0Zm9ybS5hdWRpb0ZpbGVFeHQgPSAnLm1wMyc7XG4gICAgfSBlbHNlIGlmICghIShhLmNhblBsYXlUeXBlICYmIGEuY2FuUGxheVR5cGUoJ2F1ZGlvL29nZzsgY29kZWNzPVwidm9yYmlzXCInKSkpIHtcbiAgICAgIGNsaWVudC5wbGF0Zm9ybS5hdWRpb0ZpbGVFeHQgPSAnLm9nZyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNsaWVudC5wbGF0Zm9ybS5hdWRpb0ZpbGVFeHQgPSAnLndhdic7XG4gICAgfVxuICB9XG5cbiAgX2RlZmluZVBsYXRmb3JtKCkge1xuICAgIGNvbnN0IHVhID0gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnRcbiAgICBjb25zdCBtZCA9IG5ldyBNb2JpbGVEZXRlY3QodWEpO1xuXG4gICAgY2xpZW50LnBsYXRmb3JtLmlzTW9iaWxlID0gKG1kLm1vYmlsZSgpICE9PSBudWxsKTsgLy8gdHJ1ZSBpZiBwaG9uZSBvciB0YWJsZXRcbiAgICBjbGllbnQucGxhdGZvcm0ub3MgPSAoZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgb3MgPSBtZC5vcygpO1xuXG4gICAgICBpZiAob3MgPT09ICdBbmRyb2lkT1MnKVxuICAgICAgICByZXR1cm4gJ2FuZHJvaWQnO1xuICAgICAgZWxzZSBpZiAob3MgPT09ICdpT1MnKVxuICAgICAgICByZXR1cm4gJ2lvcyc7XG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiAnb3RoZXInO1xuICAgIH0pKCk7XG4gIH1cblxuICBfYWN0aXZhdGVBdWRpbygpIHtcbiAgICB2YXIgbyA9IGF1ZGlvQ29udGV4dC5jcmVhdGVPc2NpbGxhdG9yKCk7XG4gICAgdmFyIGcgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuICAgIGcuZ2Fpbi52YWx1ZSA9IDAuMDAwMDAwMDAxOyAvLyAtMTgwZEIgP1xuICAgIG8uY29ubmVjdChnKTtcbiAgICBnLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcbiAgICBvLnN0YXJ0KDApO1xuXG4gICAgLy8gcHJldmVudCBhbmRyb2lkIHRvIHN0b3AgYXVkaW8gYnkga2VwaW5nIHRoZSBvc2NpbGxhdG9yIGFjdGl2ZVxuICAgIGlmIChjbGllbnQucGxhdGZvcm0ub3MgIT09ICdhbmRyb2lkJylcbiAgICAgIG8uc3RvcChhdWRpb0NvbnRleHQuY3VycmVudFRpbWUgKyAwLjAxKTtcbiAgfVxuXG4gIC8vIGNmLiBodHRwczovL2dpdGh1Yi5jb20vYm9yaXNtdXMvd2VidnItYm9pbGVycGxhdGUvYmxvYi84YWJiYzc0Y2ZhNTk3NmI5YWIwYzM4OGNiMGM1MTk0NDAwOGM2OTg5L2pzL3dlYnZyLW1hbmFnZXIuanMjTDI2OC1MMjg5XG4gIF9pbml0V2FrZUxvY2soKSB7XG4gICAgdGhpcy5fd2FrZUxvY2tWaWRlbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJyk7XG5cbiAgICB0aGlzLl93YWtlTG9ja1ZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ2VuZGVkJywgKCkgPT4ge1xuICAgICAgdGhpcy5fd2FrZUxvY2tWaWRlby5wbGF5KCk7XG4gICAgfSk7XG4gIH1cblxuICBfcmVxdWVzdFdha2VMb2NrKCkge1xuICAgIGNvbnN0IG9zID0gY2xpZW50LnBsYXRmb3JtLm9zO1xuICAgIHRoaXMuX3JlbGVhc2VXYWtlQ2xvY2soKTtcblxuICAgIGlmIChvcyA9PT0gJ2lvcycpIHtcbiAgICAgIGlmICh0aGlzLl93YWtlTG9ja1RpbWVyKSByZXR1cm47XG5cbiAgICAgIHRoaXMuX3dha2VMb2NrVGltZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IHdpbmRvdy5sb2NhdGlvbjtcbiAgICAgICAgc2V0VGltZW91dCh3aW5kb3cuc3RvcCwgMCk7XG4gICAgICB9LCAzMDAwMCk7XG4gICAgfSBlbHNlIGlmIChvcyA9PT0gJ2FuZHJvaWQnKSB7XG4gICAgICBpZiAodGhpcy5fd2FrZUxvY2tWaWRlby5wYXVzZWQgPT09IGZhbHNlKSByZXR1cm47XG5cbiAgICAgIHRoaXMuX3dha2VMb2NrVmlkZW8uc3JjID0gX2Jhc2U2NCgndmlkZW8vd2VibScsICdHa1hmb3dFQUFBQUFBQUFmUW9hQkFVTDNnUUZDOG9FRVF2T0JDRUtDaEhkbFltMUNoNEVDUW9XQkFoaFRnR2NCQUFBQUFBQUNXeEZObTNSQUxFMjdpMU9yaEJWSnFXWlRySUhmVGJ1TVU2dUVGbFN1YTFPc2dnRXVUYnVNVTZ1RUhGTzdhMU9zZ2dJKzdBRUFBQUFBQUFDa0FBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQVZTYWxtQVFBQUFBQUFBRU1xMTdHREQwSkFUWUNNVEdGMlpqVTJMalF1TVRBeFYwR01UR0YyWmpVMkxqUXVNVEF4YzZTUTIwWXYvRWx3czczQS8rS2ZFak0xMUVTSmlFQmt3QUFBQUFBQUZsU3Vhd0VBQUFBQUFBQkhyZ0VBQUFBQUFBQSsxNEVCYzhXQkFaeUJBQ0sxbklOMWJtU0doVlpmVmxBNGc0RUJJK09EaEFUM2tOWGdBUUFBQUFBQUFCS3dnUkM2Z1JCVHdJRUJWTENCRUZTNmdSQWZRN1oxQVFBQUFBQUFBTEhuZ1FDZ0FRQUFBQUFBQUZ5aG80RUFBSUFRQWdDZEFTb1FBQkFBQUVjSWhZV0loWVNJQWdJQURBMWdBUDcvcTFDQWRhRUJBQUFBQUFBQUxhWUJBQUFBQUFBQUpPNkJBYVdmRUFJQW5RRXFFQUFRQUFCSENJV0ZpSVdFaUFJQ0FBd05ZQUQrLzdyL1FLQUJBQUFBQUFBQVFLR1ZnUUJUQUxFQkFBRVFFQUFZQUJoWUwvUUFDQUFBZGFFQkFBQUFBQUFBSDZZQkFBQUFBQUFBRnU2QkFhV1JzUUVBQVJBUUFCZ0FHRmd2OUFBSUFBQWNVN3RyQVFBQUFBQUFBQkc3ajdPQkFMZUs5NEVCOFlJQmdmQ0JBdz09Jyk7XG4gICAgICB0aGlzLl93YWtlTG9ja1ZpZGVvLnBsYXkoKTtcbiAgICB9XG4gIH1cblxuICBfcmVsZWFzZVdha2VDbG9jaygpIHtcbiAgICBjb25zdCBvcyA9IGNsaWVudC5wbGF0Zm9ybS5vcztcblxuICAgIGlmIChvcyA9PT0gJ2lvcycpIHtcbiAgICAgIGlmICh0aGlzLl93YWtlTG9ja1RpbWVyKSB7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5fd2FrZUxvY2tUaW1lcik7XG4gICAgICAgIHRoaXMuX3dha2VMb2NrVGltZXIgPSBudWxsO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAob3MgPT09ICdhbmRyb2lkJykge1xuICAgICAgdGhpcy5fd2FrZUxvY2tWaWRlby5wYXVzZSgpO1xuICAgICAgdGhpcy5fd2FrZUxvY2tWaWRlby5zcmMgPSAnJztcbiAgICB9XG4gIH1cbn1cblxuLy8gcmVnaXN0ZXIgaW4gZmFjdG9yeVxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgV2VsY29tZSk7XG5cbmV4cG9ydCBkZWZhdWx0IFdlbGNvbWU7XG5cbiJdfQ==