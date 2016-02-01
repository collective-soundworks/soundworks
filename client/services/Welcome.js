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
        if (!error) this.events = { 'touchend': this.activateMedia.bind(this) };

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvc2VydmljZXMvV2VsY29tZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzBCQUE2QixhQUFhOzswQkFDdkIsZ0JBQWdCOzs7OzBCQUNaLFlBQVk7Ozs7b0NBQ1QsMEJBQTBCOzs7OzJCQUNoQyxpQkFBaUI7Ozs7a0NBQ1Ysd0JBQXdCOzs7Ozs7NEJBRzFCLGVBQWU7Ozs7d0JBQ25CLFVBQVU7Ozs7Ozs7QUFLL0IsU0FBUyxPQUFPLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRTtBQUMvQixtQkFBZSxNQUFNLGdCQUFXLE1BQU0sQ0FBRztDQUMxQzs7QUFFRCxJQUFNLFVBQVUsR0FBRyxpQkFBaUIsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBb0IvQixPQUFPO1lBQVAsT0FBTzs7QUFDQSxXQURQLE9BQU8sR0FDRzswQkFEVixPQUFPOztBQUVULCtCQUZFLE9BQU8sNkNBRUgsVUFBVSxFQUFFLEtBQUssRUFBRTs7Ozs7Ozs7O0FBU3pCLFFBQU0sUUFBUSxHQUFHO0FBQ2YsbUJBQWEsRUFBRSxJQUFJO0FBQ25CLG1CQUFhLEVBQUUsSUFBSTtBQUNuQixnQkFBVSxFQUFFLEtBQUs7QUFDakIsY0FBUSxFQUFFLEtBQUs7QUFDZixnQkFBVSxFQUFFLElBQUk7QUFDaEIsY0FBUSxtQ0FBZTtBQUN2QixrQkFBWSxFQUFFLEVBQUU7S0FDakIsQ0FBQzs7QUFFRixRQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDOzs7QUFHekIsUUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7QUFDakMsUUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0dBQ3hCOzs7O2VBMUJHLE9BQU87O1dBNEJQLGdCQUFHOztBQUVMLFVBQU0sRUFBRSxHQUFHLHdCQUFPLFFBQVEsQ0FBQyxFQUFFLENBQUM7QUFDOUIsVUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDLHNCQUFTLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNoRCxVQUFN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S0FBSyxLQUFLLEVBQUUsT0FBTzs7QUFFakQsWUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDLFlBQVksRUFBRSxrM0JBQWszQixDQUFDLENBQUM7QUFDcDZCLFlBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUM7T0FDNUI7S0FDRjs7O1dBRWdCLDZCQUFHO0FBQ2xCLFVBQU0sRUFBRSxHQUFHLHdCQUFPLFFBQVEsQ0FBQyxFQUFFLENBQUM7O0FBRTlCLFVBQUksRUFBRSxLQUFLLEtBQUssRUFBRTtBQUNoQixZQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7QUFDdkIsdUJBQWEsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDbkMsY0FBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7U0FDNUI7T0FDRixNQUFNLElBQUksRUFBRSxLQUFLLFNBQVMsRUFBRTtBQUMzQixZQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQzVCLFlBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztPQUM5QjtLQUNGOzs7U0E3TEcsT0FBTzs7O0FBaU1iLGdDQUFlLFFBQVEsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7O3FCQUU5QixPQUFPIiwiZmlsZSI6InNyYy9jbGllbnQvc2VydmljZXMvV2VsY29tZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGF1ZGlvQ29udGV4dCB9IGZyb20gJ3dhdmVzLWF1ZGlvJztcbmltcG9ydCBjbGllbnQgZnJvbSAnLi4vY29yZS9jbGllbnQnO1xuaW1wb3J0IHNjcmVlbmZ1bGwgZnJvbSAnc2NyZWVuZnVsbCc7XG5pbXBvcnQgU2VnbWVudGVkVmlldyBmcm9tICcuLi9kaXNwbGF5L1NlZ21lbnRlZFZpZXcnO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuLy8gQHRvZG8gLSByZWRvbmRhbnQgZGVwZW5kZW5jaWVzXG5pbXBvcnQgTW9iaWxlRGV0ZWN0IGZyb20gJ21vYmlsZS1kZXRlY3QnO1xuaW1wb3J0IHBsYXRmb3JtIGZyb20gJ3BsYXRmb3JtJztcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBfYmFzZTY0KGZvcm1hdCwgYmFzZTY0KSB7XG4gIHJldHVybiBgZGF0YToke2Zvcm1hdH07YmFzZTY0LCR7YmFzZTY0fWA7XG59XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTp3ZWxjb21lJztcblxuLyoqXG4gKiBbY2xpZW50XSBDaGVjayB3aGV0aGVyIHRoZSBkZXZpY2UgaXMgY29tcGF0aWJsZSB3aXRoIHRoZSB0ZWNobm9sb2dpZXMgdXNlZCBpbiB0aGUgKlNvdW5kd29ya3MqIGxpYnJhcnkuXG4gKiBUaGUgbW9kdWxlIHNob3VsZCB1c2VkIGF0IHRoZSB2ZXJ5IGJlZ2lubmluZyBvZiBhIHNjZW5hcmlvIHRvIGFjdGl2YXRlIHRoZSBXZWIgQXVkaW8gQVBJIG9uIGlPUyBkZXZpY2VzICh3aXRoIHRoZSBgYWN0aXZhdGVBdWRpb2Agb3B0aW9uKS5cbiAqXG4gKiBUaGUgbW9kdWxlIHJlcXVpcmVzIHRoZSBwYXJ0aWNpcGFudCB0byB0YXAgdGhlIHNjcmVlbiBpbiBvcmRlciB0byBpbml0aWFsaXplIHRoZSB3ZWJBdWRpbyBvbiBpT1MgZGV2aWNlcyBhbmQgdG8gbWFrZSB0aGUgdmlldyBkaXNhcHBlYXIuXG4gKlxuICogQ29tcGF0aWJsZSBkZXZpY2VzIGFyZSBydW5uaW5nIG9uIGlPUyA3IG9yIGFib3ZlLCBvciBvbiBBbmRyb2lkIDQuMiBvciBhYm92ZSB3aXRoIHRoZSBDaHJvbWUgYnJvd3NlciBpbiB2ZXJzaW9uIDM1IG9yIGFib3ZlLlxuICogSWYgdGhhdCBpcyBub3QgdGhlIGNhc2UsIHRoZSBtb2R1bGUgZGlzcGxheXMgYSBibG9ja2luZyBgdmlld2AgYW5kIHByZXZlbnRzIHRoZSBwYXJ0aWNpcGFudCB0byBnbyBhbnkgZnVydGhlciBpbiB0aGUgc2NlbmFyaW8uXG4gKlxuICogVGhlIG1vZHVsZSBmaW5pc2hlcyBpdHMgaW5pdGlhbGl6YXRpb24gd2hlbiB0aGUgdXNlciB0b3VjaGVzIHRoZSBzY3JlZW4gaWYgdGhlIGRldmljZSBwYXNzZXMgdGhlIHBsYXRmb3JtIHRlc3QsIGFuZCBuZXZlciBvdGhlcndpc2UuXG4gKlxuICogVGhlIG1vZHVsZSBhbHdheXMgaGFzIGEgdmlldy5cbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3Qgd2VsY29tZURpYWxvZyA9IG5ldyBXZWxjb21lKHtcbiAqICAgd2FrZUxvY2s6IHRydWVcbiAqIH0pO1xuICovXG5jbGFzcyBXZWxjb21lIGV4dGVuZHMgU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIGZhbHNlKTtcblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtPYmplY3R9IFtkZWZhdWx0cz17fV0gLSBPcHRpb25zLlxuICAgICAqIEB0eXBlIHtTdHJpbmd9IFtkZWZhdWx0cy5uYW1lPSd3ZWxjb21lJ10gLSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAgICogQHR5cGUge0Jvb2xlYW59IFtkZWZhdWx0cy5hY3RpdmF0ZUF1ZGlvPXRydWVdIC0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIG1vZHVsZSBhY3RpdmF0ZXMgdGhlIFdlYiBBdWRpbyBBUEkgd2hlbiB0aGUgcGFydGljaXBhbnQgdG91Y2hlcyB0aGUgc2NyZWVuICh1c2VmdWwgb24gaU9TIGRldmljZXMpLlxuICAgICAqIEB0eXBlIHtCb29sZWFufSBbZGVmYXVsdHMucmVxdWlyZU1vYmlsZT10cnVlXSAtIERlZmluZXMgaWYgdGhlIGFwcGxpY2F0aW9uIHJlcXVpcmVzIHRoZSB1c2Ugb2YgYSBtb2JpbGUgZGV2aWNlLlxuICAgICAqIEB0eXBlIHtCb29sZWFufSBbZGVmYXVsdHMud2FrZUxvY2s9ZmFsc2VdIC0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIG1vZHVsZXMgYWN0aXZhdGVzIGFuIGV2ZXItbG9vcGluZyAxLXBpeGVsIHZpZGVvIHRvIHByZXZlbnQgdGhlIGRldmljZSBmcm9tIGdvaW5nIGlkbGUuXG4gICAgICovXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICByZXF1aXJlTW9iaWxlOiB0cnVlLFxuICAgICAgYWN0aXZhdGVBdWRpbzogdHJ1ZSxcbiAgICAgIGZ1bGxTY3JlZW46IGZhbHNlLFxuICAgICAgd2FrZUxvY2s6IGZhbHNlLFxuICAgICAgc2hvd0RpYWxvZzogdHJ1ZSxcbiAgICAgIHZpZXdDdG9yOiBTZWdtZW50ZWRWaWV3LFxuICAgICAgdmlld1ByaW9yaXR5OiAxMCxcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuXG4gICAgLy8gY2hlY2sgcGxhdGZvcm1cbiAgICB0aGlzLl9kZWZpbmVBdWRpb0ZpbGVFeHRlbnRpb24oKTtcbiAgICB0aGlzLl9kZWZpbmVQbGF0Zm9ybSgpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICAvLyBidWlsZCB2aWV3IGFjY29yZGluZyB0byB0aGUgZGV2aWNlIGFuZCByZXF1aXJlbWVudHNcbiAgICBjb25zdCBvcyA9IGNsaWVudC5wbGF0Zm9ybS5vcztcbiAgICBjb25zdCB2ZXJzaW9uID0gcGFyc2VGbG9hdChwbGF0Zm9ybS5vcy52ZXJzaW9uKTtcbiAgICBjb25zdCBpc01vYmlsZSA9IGNsaWVudC5wbGF0Zm9ybS5pc01vYmlsZTtcbiAgICBjb25zdCByZXF1aXJlTW9iaWxlID0gdGhpcy5vcHRpb25zLnJlcXVpcmVNb2JpbGU7XG4gICAgY29uc3QgYWN0aXZhdGVBdWRpbyA9IHRoaXMub3B0aW9ucy5hY3RpdmF0ZUF1ZGlvO1xuICAgIGNvbnN0IGNvbnRlbnQgPSB0aGlzLmNvbnRlbnQ7XG4gICAgbGV0IGVycm9yID0gbnVsbDtcblxuICAgIGlmIChhY3RpdmF0ZUF1ZGlvICYmICF0aGlzLl9zdXBwb3J0c1dlYkF1ZGlvKCkpIHtcbiAgICAgIGlmIChvcyA9PT0gJ2lvcycpIHtcbiAgICAgICAgZXJyb3IgPSBjb250ZW50LmVycm9ySW9zVmVyc2lvbjtcbiAgICAgIH0gZWxzZSBpZiAob3MgPT09ICdhbmRyb2lkJykge1xuICAgICAgICBlcnJvciA9IGNvbnRlbnQuZXJyb3JBbmRyb2lkVmVyc2lvbjtcbiAgICAgIH0gZWxzZSBpZiAocmVxdWlyZU1vYmlsZSkge1xuICAgICAgICBlcnJvciA9IGNvbnRlbnQuZXJyb3JSZXF1aXJlTW9iaWxlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZXJyb3IgPSBjb250ZW50LmVycm9yRGVmYXVsdDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHJlcXVpcmVNb2JpbGUgJiYgKCFpc01vYmlsZSB8fCBvcyA9PT0gJ290aGVyJykpIHtcbiAgICAgIGVycm9yID0gY29udGVudC5lcnJvclJlcXVpcmVNb2JpbGU7XG4gICAgfSBlbHNlIGlmIChvcyA9PT0gJ2lvcycgJiYgdmVyc2lvbiA8IDcpIHtcbiAgICAgIGVycm9yID0gY29udGVudC5lcnJvcklvc1ZlcnNpb247XG4gICAgfSBlbHNlIGlmIChvcyA9PT0gJ2FuZHJvaWQnICYmIHZlcnNpb24gPCA0LjIpIHtcbiAgICAgIGVycm9yID0gY29udGVudC5lcnJvckFuZHJvaWRWZXJzaW9uO1xuICAgIH1cblxuICAgIGNvbnRlbnQuZXJyb3IgPSBlcnJvcjtcbiAgICBjbGllbnQuY29tcGF0aWJsZSA9IGVycm9yID09PSBudWxsID8gdHJ1ZSA6IGZhbHNlO1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5zaG93RGlhbG9nKSB7XG4gICAgICBpZiAoIWVycm9yKVxuICAgICAgICB0aGlzLmV2ZW50cyA9IHsgJ3RvdWNoZW5kJzogdGhpcy5hY3RpdmF0ZU1lZGlhLmJpbmQodGhpcykgfTtcblxuICAgICAgdGhpcy52aWV3Q3RvciA9IHRoaXMub3B0aW9ucy52aWV3Q3RvcjtcbiAgICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlVmlldygpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBpZiAoIXRoaXMuaGFzU3RhcnRlZClcbiAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuc2hvd0RpYWxvZylcbiAgICAgIHRoaXMucmVhZHkoKTtcbiAgICBlbHNlXG4gICAgICB0aGlzLnNob3coKTtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5oaWRlKCk7XG4gICAgc3VwZXIuc3RvcCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFjdGl2YXRlIG1lZGlhIGFzIGRlZmluZWQgaW4gYHRoaXMub3B0aW9uc2AuXG4gICAqL1xuICBhY3RpdmF0ZU1lZGlhKCkge1xuICAgIGlmIChjbGllbnQucmVqZWN0ZWQpIHsgcmV0dXJuOyB9XG4gICAgLy8gaHR0cDovL3d3dy5odG1sNXJvY2tzLmNvbS9lbi9tb2JpbGUvZnVsbHNjcmVlbi8/cmVkaXJlY3RfZnJvbV9sb2NhbGU9ZnJcbiAgICBpZiAodGhpcy5vcHRpb25zLmZ1bGxTY3JlZW4gJiYgc2NyZWVuZnVsbC5lbmFibGVkKVxuICAgICAgc2NyZWVuZnVsbC5yZXF1ZXN0KCk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmFjdGl2YXRlQXVkaW8pXG4gICAgICB0aGlzLl9hY3RpdmF0ZUF1ZGlvKCk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLndha2VMb2NrKVxuICAgICAgdGhpcy5fcmVxdWVzdFdha2VMb2NrKCk7XG5cbiAgICB0aGlzLnJlYWR5KCk7XG4gIH1cblxuICBfc3VwcG9ydHNXZWJBdWRpbygpIHtcbiAgICByZXR1cm4gISFhdWRpb0NvbnRleHQ7XG4gIH1cblxuICBfZGVmaW5lQXVkaW9GaWxlRXh0ZW50aW9uKCkge1xuICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhdWRpbycpO1xuICAgIC8vIGh0dHA6Ly9kaXZlaW50b2h0bWw1LmluZm8vZXZlcnl0aGluZy5odG1sXG4gICAgaWYgKCEhKGEuY2FuUGxheVR5cGUgJiYgYS5jYW5QbGF5VHlwZSgnYXVkaW8vbXBlZzsnKSkpIHtcbiAgICAgIGNsaWVudC5wbGF0Zm9ybS5hdWRpb0ZpbGVFeHQgPSAnLm1wMyc7XG4gICAgfSBlbHNlIGlmICghIShhLmNhblBsYXlUeXBlICYmIGEuY2FuUGxheVR5cGUoJ2F1ZGlvL29nZzsgY29kZWNzPVwidm9yYmlzXCInKSkpIHtcbiAgICAgIGNsaWVudC5wbGF0Zm9ybS5hdWRpb0ZpbGVFeHQgPSAnLm9nZyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNsaWVudC5wbGF0Zm9ybS5hdWRpb0ZpbGVFeHQgPSAnLndhdic7XG4gICAgfVxuICB9XG5cbiAgX2RlZmluZVBsYXRmb3JtKCkge1xuICAgIGNvbnN0IHVhID0gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnRcbiAgICBjb25zdCBtZCA9IG5ldyBNb2JpbGVEZXRlY3QodWEpO1xuXG4gICAgY2xpZW50LnBsYXRmb3JtLmlzTW9iaWxlID0gKG1kLm1vYmlsZSgpICE9PSBudWxsKTsgLy8gdHJ1ZSBpZiBwaG9uZSBvciB0YWJsZXRcbiAgICBjbGllbnQucGxhdGZvcm0ub3MgPSAoZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgb3MgPSBtZC5vcygpO1xuXG4gICAgICBpZiAob3MgPT09ICdBbmRyb2lkT1MnKVxuICAgICAgICByZXR1cm4gJ2FuZHJvaWQnO1xuICAgICAgZWxzZSBpZiAob3MgPT09ICdpT1MnKVxuICAgICAgICByZXR1cm4gJ2lvcyc7XG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiAnb3RoZXInO1xuICAgIH0pKCk7XG4gIH1cblxuICBfYWN0aXZhdGVBdWRpbygpIHtcbiAgICB2YXIgbyA9IGF1ZGlvQ29udGV4dC5jcmVhdGVPc2NpbGxhdG9yKCk7XG4gICAgdmFyIGcgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuICAgIGcuZ2Fpbi52YWx1ZSA9IDAuMDAwMDAwMDAxOyAvLyAtMTgwZEIgP1xuICAgIG8uY29ubmVjdChnKTtcbiAgICBnLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcbiAgICBvLnN0YXJ0KDApO1xuXG4gICAgLy8gcHJldmVudCBhbmRyb2lkIHRvIHN0b3AgYXVkaW8gYnkga2VwaW5nIHRoZSBvc2NpbGxhdG9yIGFjdGl2ZVxuICAgIGlmIChjbGllbnQucGxhdGZvcm0ub3MgIT09ICdhbmRyb2lkJylcbiAgICAgIG8uc3RvcChhdWRpb0NvbnRleHQuY3VycmVudFRpbWUgKyAwLjAxKTtcbiAgfVxuXG4gIC8vIGNmLiBodHRwczovL2dpdGh1Yi5jb20vYm9yaXNtdXMvd2VidnItYm9pbGVycGxhdGUvYmxvYi84YWJiYzc0Y2ZhNTk3NmI5YWIwYzM4OGNiMGM1MTk0NDAwOGM2OTg5L2pzL3dlYnZyLW1hbmFnZXIuanMjTDI2OC1MMjg5XG4gIF9pbml0V2FrZUxvY2soKSB7XG4gICAgdGhpcy5fd2FrZUxvY2tWaWRlbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJyk7XG5cbiAgICB0aGlzLl93YWtlTG9ja1ZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ2VuZGVkJywgKCkgPT4ge1xuICAgICAgdGhpcy5fd2FrZUxvY2tWaWRlby5wbGF5KCk7XG4gICAgfSk7XG4gIH1cblxuICBfcmVxdWVzdFdha2VMb2NrKCkge1xuICAgIGNvbnN0IG9zID0gY2xpZW50LnBsYXRmb3JtLm9zO1xuICAgIHRoaXMuX3JlbGVhc2VXYWtlQ2xvY2soKTtcblxuICAgIGlmIChvcyA9PT0gJ2lvcycpIHtcbiAgICAgIGlmICh0aGlzLl93YWtlTG9ja1RpbWVyKSByZXR1cm47XG5cbiAgICAgIHRoaXMuX3dha2VMb2NrVGltZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IHdpbmRvdy5sb2NhdGlvbjtcbiAgICAgICAgc2V0VGltZW91dCh3aW5kb3cuc3RvcCwgMCk7XG4gICAgICB9LCAzMDAwMCk7XG4gICAgfSBlbHNlIGlmIChvcyA9PT0gJ2FuZHJvaWQnKSB7XG4gICAgICBpZiAodGhpcy5fd2FrZUxvY2tWaWRlby5wYXVzZWQgPT09IGZhbHNlKSByZXR1cm47XG5cbiAgICAgIHRoaXMuX3dha2VMb2NrVmlkZW8uc3JjID0gX2Jhc2U2NCgndmlkZW8vd2VibScsICdHa1hmb3dFQUFBQUFBQUFmUW9hQkFVTDNnUUZDOG9FRVF2T0JDRUtDaEhkbFltMUNoNEVDUW9XQkFoaFRnR2NCQUFBQUFBQUNXeEZObTNSQUxFMjdpMU9yaEJWSnFXWlRySUhmVGJ1TVU2dUVGbFN1YTFPc2dnRXVUYnVNVTZ1RUhGTzdhMU9zZ2dJKzdBRUFBQUFBQUFDa0FBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQVZTYWxtQVFBQUFBQUFBRU1xMTdHREQwSkFUWUNNVEdGMlpqVTJMalF1TVRBeFYwR01UR0YyWmpVMkxqUXVNVEF4YzZTUTIwWXYvRWx3czczQS8rS2ZFak0xMUVTSmlFQmt3QUFBQUFBQUZsU3Vhd0VBQUFBQUFBQkhyZ0VBQUFBQUFBQSsxNEVCYzhXQkFaeUJBQ0sxbklOMWJtU0doVlpmVmxBNGc0RUJJK09EaEFUM2tOWGdBUUFBQUFBQUFCS3dnUkM2Z1JCVHdJRUJWTENCRUZTNmdSQWZRN1oxQVFBQUFBQUFBTEhuZ1FDZ0FRQUFBQUFBQUZ5aG80RUFBSUFRQWdDZEFTb1FBQkFBQUVjSWhZV0loWVNJQWdJQURBMWdBUDcvcTFDQWRhRUJBQUFBQUFBQUxhWUJBQUFBQUFBQUpPNkJBYVdmRUFJQW5RRXFFQUFRQUFCSENJV0ZpSVdFaUFJQ0FBd05ZQUQrLzdyL1FLQUJBQUFBQUFBQVFLR1ZnUUJUQUxFQkFBRVFFQUFZQUJoWUwvUUFDQUFBZGFFQkFBQUFBQUFBSDZZQkFBQUFBQUFBRnU2QkFhV1JzUUVBQVJBUUFCZ0FHRmd2OUFBSUFBQWNVN3RyQVFBQUFBQUFBQkc3ajdPQkFMZUs5NEVCOFlJQmdmQ0JBdz09Jyk7XG4gICAgICB0aGlzLl93YWtlTG9ja1ZpZGVvLnBsYXkoKTtcbiAgICB9XG4gIH1cblxuICBfcmVsZWFzZVdha2VDbG9jaygpIHtcbiAgICBjb25zdCBvcyA9IGNsaWVudC5wbGF0Zm9ybS5vcztcblxuICAgIGlmIChvcyA9PT0gJ2lvcycpIHtcbiAgICAgIGlmICh0aGlzLl93YWtlTG9ja1RpbWVyKSB7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5fd2FrZUxvY2tUaW1lcik7XG4gICAgICAgIHRoaXMuX3dha2VMb2NrVGltZXIgPSBudWxsO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAob3MgPT09ICdhbmRyb2lkJykge1xuICAgICAgdGhpcy5fd2FrZUxvY2tWaWRlby5wYXVzZSgpO1xuICAgICAgdGhpcy5fd2FrZUxvY2tWaWRlby5zcmMgPSAnJztcbiAgICB9XG4gIH1cbn1cblxuLy8gcmVnaXN0ZXIgaW4gZmFjdG9yeVxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgV2VsY29tZSk7XG5cbmV4cG9ydCBkZWZhdWx0IFdlbGNvbWU7XG5cbiJdfQ==