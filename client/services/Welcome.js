'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _defineProperty = require('babel-runtime/helpers/define-property')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _wavesAudio = require('waves-audio');

var _coreClient = require('../core/client');

var _coreClient2 = _interopRequireDefault(_coreClient);

var _screenfull = require('screenfull');

var _screenfull2 = _interopRequireDefault(_screenfull);

var _displaySegmentedView = require('../display/SegmentedView');

var _displaySegmentedView2 = _interopRequireDefault(_displaySegmentedView);

var _coreService = require('../core/Service');

var _coreService2 = _interopRequireDefault(_coreService);

var _coreServiceManager = require('../core/serviceManager');

var _coreServiceManager2 = _interopRequireDefault(_coreServiceManager);

// @todo - redondant dependencies

var _mobileDetect = require('mobile-detect');

var _mobileDetect2 = _interopRequireDefault(_mobileDetect);

var _platform = require('platform');

var _platform2 = _interopRequireDefault(_platform);

/**
 * @private
 */
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

var Welcome = (function (_Service) {
  _inherits(Welcome, _Service);

  function Welcome() {
    _classCallCheck(this, Welcome);

    _get(Object.getPrototypeOf(Welcome.prototype), 'constructor', this).call(this, SERVICE_ID, false);

    /**
     * @type {Object} [defaults={}] - Options.
     * @type {String} [defaults.name='welcome'] - Name of the module.
     * @type {Boolean} [defaults.activateAudio=true] - Indicates whether the module activates the Web Audio API when the participant touches the screen (useful on iOS devices).
     * @type {Boolean} [defaults.requireMobile=true] - Defines if the application requires the use of a mobile device.
     * @type {Boolean} [defaults.wakeLock=false] - Indicates whether the modules activates an ever-looping 1-pixel video to prevent the device from going idle.
     */
    var defaults = {
      requireMobile: true,
      activateAudio: true,
      fullScreen: false,
      wakeLock: false,
      showDialog: true,
      viewCtor: _displaySegmentedView2['default'],
      viewPriority: 10
    };

    this.configure(defaults);

    // check platform
    this._defineAudioFileExtention();
    this._definePlatform();
  }

  // register in factory

  _createClass(Welcome, [{
    key: 'init',
    value: function init() {
      // build view according to the device and requirements
      var os = _coreClient2['default'].platform.os;
      var version = parseFloat(_platform2['default'].os.version);
      var isMobile = _coreClient2['default'].platform.isMobile;
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
      _coreClient2['default'].compatible = error === null ? true : false;

      if (this.options.showDialog) {
        if (!error) {
          var _event = isMobile ? 'touchend' : 'click';
          this.events = _defineProperty({}, _event, this.activateMedia.bind(this));
        }

        this.viewCtor = this.options.viewCtor;
        this.view = this.createView();
      }
    }
  }, {
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(Welcome.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

      if (!this.options.showDialog) this.ready();else this.show();
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.hide();
      _get(Object.getPrototypeOf(Welcome.prototype), 'stop', this).call(this);
    }

    /**
     * Activate media as defined in `this.options`.
     */
  }, {
    key: 'activateMedia',
    value: function activateMedia() {
      if (_coreClient2['default'].rejected) {
        return;
      }
      // http://www.html5rocks.com/en/mobile/fullscreen/?redirect_from_locale=fr
      if (this.options.fullScreen && _screenfull2['default'].enabled) _screenfull2['default'].request();

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
        _coreClient2['default'].platform.audioFileExt = '.mp3';
      } else if (!!(a.canPlayType && a.canPlayType('audio/ogg; codecs="vorbis"'))) {
        _coreClient2['default'].platform.audioFileExt = '.ogg';
      } else {
        _coreClient2['default'].platform.audioFileExt = '.wav';
      }
    }
  }, {
    key: '_definePlatform',
    value: function _definePlatform() {
      var ua = window.navigator.userAgent;
      var md = new _mobileDetect2['default'](ua);

      _coreClient2['default'].platform.isMobile = md.mobile() !== null; // true if phone or tablet
      _coreClient2['default'].platform.os = (function () {
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
      if (_coreClient2['default'].platform.os !== 'android') o.stop(_wavesAudio.audioContext.currentTime + 0.01);
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
      var os = _coreClient2['default'].platform.os;
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
      var os = _coreClient2['default'].platform.os;

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
})(_coreService2['default']);

_coreServiceManager2['default'].register(SERVICE_ID, Welcome);

exports['default'] = Welcome;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvc2VydmljZXMvV2VsY29tZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7MEJBQTZCLGFBQWE7OzBCQUN2QixnQkFBZ0I7Ozs7MEJBQ1osWUFBWTs7OztvQ0FDVCwwQkFBMEI7Ozs7MkJBQ2hDLGlCQUFpQjs7OztrQ0FDVix3QkFBd0I7Ozs7Ozs0QkFHMUIsZUFBZTs7Ozt3QkFDbkIsVUFBVTs7Ozs7OztBQUsvQixTQUFTLE9BQU8sQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFO0FBQy9CLG1CQUFlLE1BQU0sZ0JBQVcsTUFBTSxDQUFHO0NBQzFDOztBQUVELElBQU0sVUFBVSxHQUFHLGlCQUFpQixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFvQi9CLE9BQU87WUFBUCxPQUFPOztBQUNBLFdBRFAsT0FBTyxHQUNHOzBCQURWLE9BQU87O0FBRVQsK0JBRkUsT0FBTyw2Q0FFSCxVQUFVLEVBQUUsS0FBSyxFQUFFOzs7Ozs7Ozs7QUFTekIsUUFBTSxRQUFRLEdBQUc7QUFDZixtQkFBYSxFQUFFLElBQUk7QUFDbkIsbUJBQWEsRUFBRSxJQUFJO0FBQ25CLGdCQUFVLEVBQUUsS0FBSztBQUNqQixjQUFRLEVBQUUsS0FBSztBQUNmLGdCQUFVLEVBQUUsSUFBSTtBQUNoQixjQUFRLG1DQUFlO0FBQ3ZCLGtCQUFZLEVBQUUsRUFBRTtLQUNqQixDQUFDOztBQUVGLFFBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7OztBQUd6QixRQUFJLENBQUMseUJBQXlCLEVBQUUsQ0FBQztBQUNqQyxRQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7R0FDeEI7Ozs7ZUExQkcsT0FBTzs7V0E0QlAsZ0JBQUc7O0FBRUwsVUFBTSxFQUFFLEdBQUcsd0JBQU8sUUFBUSxDQUFDLEVBQUUsQ0FBQztBQUM5QixVQUFNLE9BQU8sR0FBRyxVQUFVLENBQUMsc0JBQVMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2hELFVB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QUksRUFBRSxLQUFLLFNBQVMsRUFBRTtBQUMzQixZQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxLQUFLLEtBQUssRUFBRSxPQUFPOztBQUVqRCxZQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsWUFBWSxFQUFFLGszQkFBazNCLENBQUMsQ0FBQztBQUNwNkIsWUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztPQUM1QjtLQUNGOzs7V0FFZ0IsNkJBQUc7QUFDbEIsVUFBTSxFQUFFLEdBQUcsd0JBQU8sUUFBUSxDQUFDLEVBQUUsQ0FBQzs7QUFFOUIsVUFBSSxFQUFFLEtBQUssS0FBSyxFQUFFO0FBQ2hCLFlBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtBQUN2Qix1QkFBYSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNuQyxjQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztTQUM1QjtPQUNGLE1BQU0sSUFBSSxFQUFFLEtBQUssU0FBUyxFQUFFO0FBQzNCLFlBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDNUIsWUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO09BQzlCO0tBQ0Y7OztTQS9MRyxPQUFPOzs7QUFtTWIsZ0NBQWUsUUFBUSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQzs7cUJBRTlCLE9BQU8iLCJmaWxlIjoic3JjL2NsaWVudC9zZXJ2aWNlcy9XZWxjb21lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYXVkaW9Db250ZXh0IH0gZnJvbSAnd2F2ZXMtYXVkaW8nO1xuaW1wb3J0IGNsaWVudCBmcm9tICcuLi9jb3JlL2NsaWVudCc7XG5pbXBvcnQgc2NyZWVuZnVsbCBmcm9tICdzY3JlZW5mdWxsJztcbmltcG9ydCBTZWdtZW50ZWRWaWV3IGZyb20gJy4uL2Rpc3BsYXkvU2VnbWVudGVkVmlldyc7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuXG4vLyBAdG9kbyAtIHJlZG9uZGFudCBkZXBlbmRlbmNpZXNcbmltcG9ydCBNb2JpbGVEZXRlY3QgZnJvbSAnbW9iaWxlLWRldGVjdCc7XG5pbXBvcnQgcGxhdGZvcm0gZnJvbSAncGxhdGZvcm0nO1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIF9iYXNlNjQoZm9ybWF0LCBiYXNlNjQpIHtcbiAgcmV0dXJuIGBkYXRhOiR7Zm9ybWF0fTtiYXNlNjQsJHtiYXNlNjR9YDtcbn1cblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOndlbGNvbWUnO1xuXG4vKipcbiAqIFtjbGllbnRdIENoZWNrIHdoZXRoZXIgdGhlIGRldmljZSBpcyBjb21wYXRpYmxlIHdpdGggdGhlIHRlY2hub2xvZ2llcyB1c2VkIGluIHRoZSAqU291bmR3b3JrcyogbGlicmFyeS5cbiAqIFRoZSBtb2R1bGUgc2hvdWxkIHVzZWQgYXQgdGhlIHZlcnkgYmVnaW5uaW5nIG9mIGEgc2NlbmFyaW8gdG8gYWN0aXZhdGUgdGhlIFdlYiBBdWRpbyBBUEkgb24gaU9TIGRldmljZXMgKHdpdGggdGhlIGBhY3RpdmF0ZUF1ZGlvYCBvcHRpb24pLlxuICpcbiAqIFRoZSBtb2R1bGUgcmVxdWlyZXMgdGhlIHBhcnRpY2lwYW50IHRvIHRhcCB0aGUgc2NyZWVuIGluIG9yZGVyIHRvIGluaXRpYWxpemUgdGhlIHdlYkF1ZGlvIG9uIGlPUyBkZXZpY2VzIGFuZCB0byBtYWtlIHRoZSB2aWV3IGRpc2FwcGVhci5cbiAqXG4gKiBDb21wYXRpYmxlIGRldmljZXMgYXJlIHJ1bm5pbmcgb24gaU9TIDcgb3IgYWJvdmUsIG9yIG9uIEFuZHJvaWQgNC4yIG9yIGFib3ZlIHdpdGggdGhlIENocm9tZSBicm93c2VyIGluIHZlcnNpb24gMzUgb3IgYWJvdmUuXG4gKiBJZiB0aGF0IGlzIG5vdCB0aGUgY2FzZSwgdGhlIG1vZHVsZSBkaXNwbGF5cyBhIGJsb2NraW5nIGB2aWV3YCBhbmQgcHJldmVudHMgdGhlIHBhcnRpY2lwYW50IHRvIGdvIGFueSBmdXJ0aGVyIGluIHRoZSBzY2VuYXJpby5cbiAqXG4gKiBUaGUgbW9kdWxlIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbiB3aGVuIHRoZSB1c2VyIHRvdWNoZXMgdGhlIHNjcmVlbiBpZiB0aGUgZGV2aWNlIHBhc3NlcyB0aGUgcGxhdGZvcm0gdGVzdCwgYW5kIG5ldmVyIG90aGVyd2lzZS5cbiAqXG4gKiBUaGUgbW9kdWxlIGFsd2F5cyBoYXMgYSB2aWV3LlxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCB3ZWxjb21lRGlhbG9nID0gbmV3IFdlbGNvbWUoe1xuICogICB3YWtlTG9jazogdHJ1ZVxuICogfSk7XG4gKi9cbmNsYXNzIFdlbGNvbWUgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgZmFsc2UpO1xuXG4gICAgLyoqXG4gICAgICogQHR5cGUge09iamVjdH0gW2RlZmF1bHRzPXt9XSAtIE9wdGlvbnMuXG4gICAgICogQHR5cGUge1N0cmluZ30gW2RlZmF1bHRzLm5hbWU9J3dlbGNvbWUnXSAtIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn0gW2RlZmF1bHRzLmFjdGl2YXRlQXVkaW89dHJ1ZV0gLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgbW9kdWxlIGFjdGl2YXRlcyB0aGUgV2ViIEF1ZGlvIEFQSSB3aGVuIHRoZSBwYXJ0aWNpcGFudCB0b3VjaGVzIHRoZSBzY3JlZW4gKHVzZWZ1bCBvbiBpT1MgZGV2aWNlcykuXG4gICAgICogQHR5cGUge0Jvb2xlYW59IFtkZWZhdWx0cy5yZXF1aXJlTW9iaWxlPXRydWVdIC0gRGVmaW5lcyBpZiB0aGUgYXBwbGljYXRpb24gcmVxdWlyZXMgdGhlIHVzZSBvZiBhIG1vYmlsZSBkZXZpY2UuXG4gICAgICogQHR5cGUge0Jvb2xlYW59IFtkZWZhdWx0cy53YWtlTG9jaz1mYWxzZV0gLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgbW9kdWxlcyBhY3RpdmF0ZXMgYW4gZXZlci1sb29waW5nIDEtcGl4ZWwgdmlkZW8gdG8gcHJldmVudCB0aGUgZGV2aWNlIGZyb20gZ29pbmcgaWRsZS5cbiAgICAgKi9cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIHJlcXVpcmVNb2JpbGU6IHRydWUsXG4gICAgICBhY3RpdmF0ZUF1ZGlvOiB0cnVlLFxuICAgICAgZnVsbFNjcmVlbjogZmFsc2UsXG4gICAgICB3YWtlTG9jazogZmFsc2UsXG4gICAgICBzaG93RGlhbG9nOiB0cnVlLFxuICAgICAgdmlld0N0b3I6IFNlZ21lbnRlZFZpZXcsXG4gICAgICB2aWV3UHJpb3JpdHk6IDEwLFxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICAvLyBjaGVjayBwbGF0Zm9ybVxuICAgIHRoaXMuX2RlZmluZUF1ZGlvRmlsZUV4dGVudGlvbigpO1xuICAgIHRoaXMuX2RlZmluZVBsYXRmb3JtKCk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIC8vIGJ1aWxkIHZpZXcgYWNjb3JkaW5nIHRvIHRoZSBkZXZpY2UgYW5kIHJlcXVpcmVtZW50c1xuICAgIGNvbnN0IG9zID0gY2xpZW50LnBsYXRmb3JtLm9zO1xuICAgIGNvbnN0IHZlcnNpb24gPSBwYXJzZUZsb2F0KHBsYXRmb3JtLm9zLnZlcnNpb24pO1xuICAgIGNvbnN0IGlzTW9iaWxlID0gY2xpZW50LnBsYXRmb3JtLmlzTW9iaWxlO1xuICAgIGNvbnN0IHJlcXVpcmVNb2JpbGUgPSB0aGlzLm9wdGlvbnMucmVxdWlyZU1vYmlsZTtcbiAgICBjb25zdCBhY3RpdmF0ZUF1ZGlvID0gdGhpcy5vcHRpb25zLmFjdGl2YXRlQXVkaW87XG4gICAgY29uc3QgY29udGVudCA9IHRoaXMuY29udGVudDtcbiAgICBsZXQgZXJyb3IgPSBudWxsO1xuXG4gICAgaWYgKGFjdGl2YXRlQXVkaW8gJiYgIXRoaXMuX3N1cHBvcnRzV2ViQXVkaW8oKSkge1xuICAgICAgaWYgKG9zID09PSAnaW9zJykge1xuICAgICAgICBlcnJvciA9IGNvbnRlbnQuZXJyb3JJb3NWZXJzaW9uO1xuICAgICAgfSBlbHNlIGlmIChvcyA9PT0gJ2FuZHJvaWQnKSB7XG4gICAgICAgIGVycm9yID0gY29udGVudC5lcnJvckFuZHJvaWRWZXJzaW9uO1xuICAgICAgfSBlbHNlIGlmIChyZXF1aXJlTW9iaWxlKSB7XG4gICAgICAgIGVycm9yID0gY29udGVudC5lcnJvclJlcXVpcmVNb2JpbGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlcnJvciA9IGNvbnRlbnQuZXJyb3JEZWZhdWx0O1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAocmVxdWlyZU1vYmlsZSAmJiAoIWlzTW9iaWxlIHx8IG9zID09PSAnb3RoZXInKSkge1xuICAgICAgZXJyb3IgPSBjb250ZW50LmVycm9yUmVxdWlyZU1vYmlsZTtcbiAgICB9IGVsc2UgaWYgKG9zID09PSAnaW9zJyAmJiB2ZXJzaW9uIDwgNykge1xuICAgICAgZXJyb3IgPSBjb250ZW50LmVycm9ySW9zVmVyc2lvbjtcbiAgICB9IGVsc2UgaWYgKG9zID09PSAnYW5kcm9pZCcgJiYgdmVyc2lvbiA8IDQuMikge1xuICAgICAgZXJyb3IgPSBjb250ZW50LmVycm9yQW5kcm9pZFZlcnNpb247XG4gICAgfVxuXG4gICAgY29udGVudC5lcnJvciA9IGVycm9yO1xuICAgIGNsaWVudC5jb21wYXRpYmxlID0gZXJyb3IgPT09IG51bGwgPyB0cnVlIDogZmFsc2U7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnNob3dEaWFsb2cpIHtcbiAgICAgIGlmICghZXJyb3IpIHtcbiAgICAgICAgY29uc3QgZXZlbnQgPSBpc01vYmlsZSA/ICd0b3VjaGVuZCcgOiAnY2xpY2snO1xuICAgICAgICB0aGlzLmV2ZW50cyA9IHsgW2V2ZW50XTogdGhpcy5hY3RpdmF0ZU1lZGlhLmJpbmQodGhpcykgfTtcbiAgICAgIH1cblxuICAgICAgdGhpcy52aWV3Q3RvciA9IHRoaXMub3B0aW9ucy52aWV3Q3RvcjtcbiAgICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlVmlldygpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBpZiAoIXRoaXMuaGFzU3RhcnRlZClcbiAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuc2hvd0RpYWxvZylcbiAgICAgIHRoaXMucmVhZHkoKTtcbiAgICBlbHNlXG4gICAgICB0aGlzLnNob3coKTtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5oaWRlKCk7XG4gICAgc3VwZXIuc3RvcCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFjdGl2YXRlIG1lZGlhIGFzIGRlZmluZWQgaW4gYHRoaXMub3B0aW9uc2AuXG4gICAqL1xuICBhY3RpdmF0ZU1lZGlhKCkge1xuICAgIGlmIChjbGllbnQucmVqZWN0ZWQpIHsgcmV0dXJuOyB9XG4gICAgLy8gaHR0cDovL3d3dy5odG1sNXJvY2tzLmNvbS9lbi9tb2JpbGUvZnVsbHNjcmVlbi8/cmVkaXJlY3RfZnJvbV9sb2NhbGU9ZnJcbiAgICBpZiAodGhpcy5vcHRpb25zLmZ1bGxTY3JlZW4gJiYgc2NyZWVuZnVsbC5lbmFibGVkKVxuICAgICAgc2NyZWVuZnVsbC5yZXF1ZXN0KCk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmFjdGl2YXRlQXVkaW8pXG4gICAgICB0aGlzLl9hY3RpdmF0ZUF1ZGlvKCk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLndha2VMb2NrKVxuICAgICAgdGhpcy5fcmVxdWVzdFdha2VMb2NrKCk7XG5cbiAgICB0aGlzLnJlYWR5KCk7XG4gIH1cblxuICBfc3VwcG9ydHNXZWJBdWRpbygpIHtcbiAgICByZXR1cm4gISFhdWRpb0NvbnRleHQ7XG4gIH1cblxuICBfZGVmaW5lQXVkaW9GaWxlRXh0ZW50aW9uKCkge1xuICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhdWRpbycpO1xuICAgIC8vIGh0dHA6Ly9kaXZlaW50b2h0bWw1LmluZm8vZXZlcnl0aGluZy5odG1sXG4gICAgaWYgKCEhKGEuY2FuUGxheVR5cGUgJiYgYS5jYW5QbGF5VHlwZSgnYXVkaW8vbXBlZzsnKSkpIHtcbiAgICAgIGNsaWVudC5wbGF0Zm9ybS5hdWRpb0ZpbGVFeHQgPSAnLm1wMyc7XG4gICAgfSBlbHNlIGlmICghIShhLmNhblBsYXlUeXBlICYmIGEuY2FuUGxheVR5cGUoJ2F1ZGlvL29nZzsgY29kZWNzPVwidm9yYmlzXCInKSkpIHtcbiAgICAgIGNsaWVudC5wbGF0Zm9ybS5hdWRpb0ZpbGVFeHQgPSAnLm9nZyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNsaWVudC5wbGF0Zm9ybS5hdWRpb0ZpbGVFeHQgPSAnLndhdic7XG4gICAgfVxuICB9XG5cbiAgX2RlZmluZVBsYXRmb3JtKCkge1xuICAgIGNvbnN0IHVhID0gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnRcbiAgICBjb25zdCBtZCA9IG5ldyBNb2JpbGVEZXRlY3QodWEpO1xuXG4gICAgY2xpZW50LnBsYXRmb3JtLmlzTW9iaWxlID0gKG1kLm1vYmlsZSgpICE9PSBudWxsKTsgLy8gdHJ1ZSBpZiBwaG9uZSBvciB0YWJsZXRcbiAgICBjbGllbnQucGxhdGZvcm0ub3MgPSAoZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgb3MgPSBtZC5vcygpO1xuXG4gICAgICBpZiAob3MgPT09ICdBbmRyb2lkT1MnKVxuICAgICAgICByZXR1cm4gJ2FuZHJvaWQnO1xuICAgICAgZWxzZSBpZiAob3MgPT09ICdpT1MnKVxuICAgICAgICByZXR1cm4gJ2lvcyc7XG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiAnb3RoZXInO1xuICAgIH0pKCk7XG4gIH1cblxuICBfYWN0aXZhdGVBdWRpbygpIHtcbiAgICB2YXIgbyA9IGF1ZGlvQ29udGV4dC5jcmVhdGVPc2NpbGxhdG9yKCk7XG4gICAgdmFyIGcgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuICAgIGcuZ2Fpbi52YWx1ZSA9IDAuMDAwMDAwMDAxOyAvLyAtMTgwZEIgP1xuICAgIG8uY29ubmVjdChnKTtcbiAgICBnLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcbiAgICBvLnN0YXJ0KDApO1xuXG4gICAgLy8gcHJldmVudCBhbmRyb2lkIHRvIHN0b3AgYXVkaW8gYnkga2VwaW5nIHRoZSBvc2NpbGxhdG9yIGFjdGl2ZVxuICAgIGlmIChjbGllbnQucGxhdGZvcm0ub3MgIT09ICdhbmRyb2lkJylcbiAgICAgIG8uc3RvcChhdWRpb0NvbnRleHQuY3VycmVudFRpbWUgKyAwLjAxKTtcbiAgfVxuXG4gIC8vIGNmLiBodHRwczovL2dpdGh1Yi5jb20vYm9yaXNtdXMvd2VidnItYm9pbGVycGxhdGUvYmxvYi84YWJiYzc0Y2ZhNTk3NmI5YWIwYzM4OGNiMGM1MTk0NDAwOGM2OTg5L2pzL3dlYnZyLW1hbmFnZXIuanMjTDI2OC1MMjg5XG4gIF9pbml0V2FrZUxvY2soKSB7XG4gICAgdGhpcy5fd2FrZUxvY2tWaWRlbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJyk7XG5cbiAgICB0aGlzLl93YWtlTG9ja1ZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ2VuZGVkJywgKCkgPT4ge1xuICAgICAgdGhpcy5fd2FrZUxvY2tWaWRlby5wbGF5KCk7XG4gICAgfSk7XG4gIH1cblxuICBfcmVxdWVzdFdha2VMb2NrKCkge1xuICAgIGNvbnN0IG9zID0gY2xpZW50LnBsYXRmb3JtLm9zO1xuICAgIHRoaXMuX3JlbGVhc2VXYWtlQ2xvY2soKTtcblxuICAgIGlmIChvcyA9PT0gJ2lvcycpIHtcbiAgICAgIGlmICh0aGlzLl93YWtlTG9ja1RpbWVyKSByZXR1cm47XG5cbiAgICAgIHRoaXMuX3dha2VMb2NrVGltZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IHdpbmRvdy5sb2NhdGlvbjtcbiAgICAgICAgc2V0VGltZW91dCh3aW5kb3cuc3RvcCwgMCk7XG4gICAgICB9LCAzMDAwMCk7XG4gICAgfSBlbHNlIGlmIChvcyA9PT0gJ2FuZHJvaWQnKSB7XG4gICAgICBpZiAodGhpcy5fd2FrZUxvY2tWaWRlby5wYXVzZWQgPT09IGZhbHNlKSByZXR1cm47XG5cbiAgICAgIHRoaXMuX3dha2VMb2NrVmlkZW8uc3JjID0gX2Jhc2U2NCgndmlkZW8vd2VibScsICdHa1hmb3dFQUFBQUFBQUFmUW9hQkFVTDNnUUZDOG9FRVF2T0JDRUtDaEhkbFltMUNoNEVDUW9XQkFoaFRnR2NCQUFBQUFBQUNXeEZObTNSQUxFMjdpMU9yaEJWSnFXWlRySUhmVGJ1TVU2dUVGbFN1YTFPc2dnRXVUYnVNVTZ1RUhGTzdhMU9zZ2dJKzdBRUFBQUFBQUFDa0FBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQVZTYWxtQVFBQUFBQUFBRU1xMTdHREQwSkFUWUNNVEdGMlpqVTJMalF1TVRBeFYwR01UR0YyWmpVMkxqUXVNVEF4YzZTUTIwWXYvRWx3czczQS8rS2ZFak0xMUVTSmlFQmt3QUFBQUFBQUZsU3Vhd0VBQUFBQUFBQkhyZ0VBQUFBQUFBQSsxNEVCYzhXQkFaeUJBQ0sxbklOMWJtU0doVlpmVmxBNGc0RUJJK09EaEFUM2tOWGdBUUFBQUFBQUFCS3dnUkM2Z1JCVHdJRUJWTENCRUZTNmdSQWZRN1oxQVFBQUFBQUFBTEhuZ1FDZ0FRQUFBQUFBQUZ5aG80RUFBSUFRQWdDZEFTb1FBQkFBQUVjSWhZV0loWVNJQWdJQURBMWdBUDcvcTFDQWRhRUJBQUFBQUFBQUxhWUJBQUFBQUFBQUpPNkJBYVdmRUFJQW5RRXFFQUFRQUFCSENJV0ZpSVdFaUFJQ0FBd05ZQUQrLzdyL1FLQUJBQUFBQUFBQVFLR1ZnUUJUQUxFQkFBRVFFQUFZQUJoWUwvUUFDQUFBZGFFQkFBQUFBQUFBSDZZQkFBQUFBQUFBRnU2QkFhV1JzUUVBQVJBUUFCZ0FHRmd2OUFBSUFBQWNVN3RyQVFBQUFBQUFBQkc3ajdPQkFMZUs5NEVCOFlJQmdmQ0JBdz09Jyk7XG4gICAgICB0aGlzLl93YWtlTG9ja1ZpZGVvLnBsYXkoKTtcbiAgICB9XG4gIH1cblxuICBfcmVsZWFzZVdha2VDbG9jaygpIHtcbiAgICBjb25zdCBvcyA9IGNsaWVudC5wbGF0Zm9ybS5vcztcblxuICAgIGlmIChvcyA9PT0gJ2lvcycpIHtcbiAgICAgIGlmICh0aGlzLl93YWtlTG9ja1RpbWVyKSB7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5fd2FrZUxvY2tUaW1lcik7XG4gICAgICAgIHRoaXMuX3dha2VMb2NrVGltZXIgPSBudWxsO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAob3MgPT09ICdhbmRyb2lkJykge1xuICAgICAgdGhpcy5fd2FrZUxvY2tWaWRlby5wYXVzZSgpO1xuICAgICAgdGhpcy5fd2FrZUxvY2tWaWRlby5zcmMgPSAnJztcbiAgICB9XG4gIH1cbn1cblxuLy8gcmVnaXN0ZXIgaW4gZmFjdG9yeVxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgV2VsY29tZSk7XG5cbmV4cG9ydCBkZWZhdWx0IFdlbGNvbWU7XG5cbiJdfQ==