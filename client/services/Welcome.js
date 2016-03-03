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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L3NlcnZpY2VzL1dlbGNvbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OzBCQUE2QixhQUFhOzswQkFDdkIsZ0JBQWdCOzs7OzBCQUNaLFlBQVk7Ozs7b0NBQ1QsMEJBQTBCOzs7OzJCQUNoQyxpQkFBaUI7Ozs7a0NBQ1Ysd0JBQXdCOzs7Ozs7NEJBRzFCLGVBQWU7Ozs7d0JBQ25CLFVBQVU7Ozs7Ozs7QUFLL0IsU0FBUyxPQUFPLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRTtBQUMvQixtQkFBZSxNQUFNLGdCQUFXLE1BQU0sQ0FBRztDQUMxQzs7QUFFRCxJQUFNLFVBQVUsR0FBRyxpQkFBaUIsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBb0IvQixPQUFPO1lBQVAsT0FBTzs7QUFDQSxXQURQLE9BQU8sR0FDRzswQkFEVixPQUFPOztBQUVULCtCQUZFLE9BQU8sNkNBRUgsVUFBVSxFQUFFLEtBQUssRUFBRTs7Ozs7Ozs7O0FBU3pCLFFBQU0sUUFBUSxHQUFHO0FBQ2YsbUJBQWEsRUFBRSxJQUFJO0FBQ25CLG1CQUFhLEVBQUUsSUFBSTtBQUNuQixnQkFBVSxFQUFFLEtBQUs7QUFDakIsY0FBUSxFQUFFLEtBQUs7QUFDZixnQkFBVSxFQUFFLElBQUk7QUFDaEIsY0FBUSxtQ0FBZTtBQUN2QixrQkFBWSxFQUFFLEVBQUU7S0FDakIsQ0FBQzs7QUFFRixRQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDOzs7QUFHekIsUUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7QUFDakMsUUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0dBQ3hCOzs7O2VBMUJHLE9BQU87O1dBNEJQLGdCQUFHOztBQUVMLFVBQU0sRUFBRSxHQUFHLHdCQUFPLFFBQVEsQ0FBQyxFQUFFLENBQUM7QUFDOUIs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LElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztTQUM1QixFQUFFLEtBQUssQ0FBQyxDQUFDO09BQ1gsTUFBTSxJQUFJLEVBQUUsS0FBSyxTQUFTLEVBQUU7QUFDM0IsWUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sS0FBSyxLQUFLLEVBQUUsT0FBTzs7QUFFakQsWUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDLFlBQVksRUFBRSxrM0JBQWszQixDQUFDLENBQUM7QUFDcDZCLFlBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUM7T0FDNUI7S0FDRjs7O1dBRWdCLDZCQUFHO0FBQ2xCLFVBQU0sRUFBRSxHQUFHLHdCQUFPLFFBQVEsQ0FBQyxFQUFFLENBQUM7O0FBRTlCLFVBQUksRUFBRSxLQUFLLEtBQUssRUFBRTtBQUNoQixZQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7QUFDdkIsdUJBQWEsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDbkMsY0FBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7U0FDNUI7T0FDRixNQUFNLElBQUksRUFBRSxLQUFLLFNBQVMsRUFBRTtBQUMzQixZQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQzVCLFlBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztPQUM5QjtLQUNGOzs7U0EvTEcsT0FBTzs7O0FBbU1iLGdDQUFlLFFBQVEsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7O3FCQUU5QixPQUFPIiwiZmlsZSI6Ii9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L3NlcnZpY2VzL1dlbGNvbWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhdWRpb0NvbnRleHQgfSBmcm9tICd3YXZlcy1hdWRpbyc7XG5pbXBvcnQgY2xpZW50IGZyb20gJy4uL2NvcmUvY2xpZW50JztcbmltcG9ydCBzY3JlZW5mdWxsIGZyb20gJ3NjcmVlbmZ1bGwnO1xuaW1wb3J0IFNlZ21lbnRlZFZpZXcgZnJvbSAnLi4vZGlzcGxheS9TZWdtZW50ZWRWaWV3JztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbi8vIEB0b2RvIC0gcmVkb25kYW50IGRlcGVuZGVuY2llc1xuaW1wb3J0IE1vYmlsZURldGVjdCBmcm9tICdtb2JpbGUtZGV0ZWN0JztcbmltcG9ydCBwbGF0Zm9ybSBmcm9tICdwbGF0Zm9ybSc7XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gX2Jhc2U2NChmb3JtYXQsIGJhc2U2NCkge1xuICByZXR1cm4gYGRhdGE6JHtmb3JtYXR9O2Jhc2U2NCwke2Jhc2U2NH1gO1xufVxuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6d2VsY29tZSc7XG5cbi8qKlxuICogW2NsaWVudF0gQ2hlY2sgd2hldGhlciB0aGUgZGV2aWNlIGlzIGNvbXBhdGlibGUgd2l0aCB0aGUgdGVjaG5vbG9naWVzIHVzZWQgaW4gdGhlICpTb3VuZHdvcmtzKiBsaWJyYXJ5LlxuICogVGhlIG1vZHVsZSBzaG91bGQgdXNlZCBhdCB0aGUgdmVyeSBiZWdpbm5pbmcgb2YgYSBzY2VuYXJpbyB0byBhY3RpdmF0ZSB0aGUgV2ViIEF1ZGlvIEFQSSBvbiBpT1MgZGV2aWNlcyAod2l0aCB0aGUgYGFjdGl2YXRlQXVkaW9gIG9wdGlvbikuXG4gKlxuICogVGhlIG1vZHVsZSByZXF1aXJlcyB0aGUgcGFydGljaXBhbnQgdG8gdGFwIHRoZSBzY3JlZW4gaW4gb3JkZXIgdG8gaW5pdGlhbGl6ZSB0aGUgd2ViQXVkaW8gb24gaU9TIGRldmljZXMgYW5kIHRvIG1ha2UgdGhlIHZpZXcgZGlzYXBwZWFyLlxuICpcbiAqIENvbXBhdGlibGUgZGV2aWNlcyBhcmUgcnVubmluZyBvbiBpT1MgNyBvciBhYm92ZSwgb3Igb24gQW5kcm9pZCA0LjIgb3IgYWJvdmUgd2l0aCB0aGUgQ2hyb21lIGJyb3dzZXIgaW4gdmVyc2lvbiAzNSBvciBhYm92ZS5cbiAqIElmIHRoYXQgaXMgbm90IHRoZSBjYXNlLCB0aGUgbW9kdWxlIGRpc3BsYXlzIGEgYmxvY2tpbmcgYHZpZXdgIGFuZCBwcmV2ZW50cyB0aGUgcGFydGljaXBhbnQgdG8gZ28gYW55IGZ1cnRoZXIgaW4gdGhlIHNjZW5hcmlvLlxuICpcbiAqIFRoZSBtb2R1bGUgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uIHdoZW4gdGhlIHVzZXIgdG91Y2hlcyB0aGUgc2NyZWVuIGlmIHRoZSBkZXZpY2UgcGFzc2VzIHRoZSBwbGF0Zm9ybSB0ZXN0LCBhbmQgbmV2ZXIgb3RoZXJ3aXNlLlxuICpcbiAqIFRoZSBtb2R1bGUgYWx3YXlzIGhhcyBhIHZpZXcuXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IHdlbGNvbWVEaWFsb2cgPSBuZXcgV2VsY29tZSh7XG4gKiAgIHdha2VMb2NrOiB0cnVlXG4gKiB9KTtcbiAqL1xuY2xhc3MgV2VsY29tZSBleHRlbmRzIFNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCBmYWxzZSk7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7T2JqZWN0fSBbZGVmYXVsdHM9e31dIC0gT3B0aW9ucy5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfSBbZGVmYXVsdHMubmFtZT0nd2VsY29tZSddIC0gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgICAqIEB0eXBlIHtCb29sZWFufSBbZGVmYXVsdHMuYWN0aXZhdGVBdWRpbz10cnVlXSAtIEluZGljYXRlcyB3aGV0aGVyIHRoZSBtb2R1bGUgYWN0aXZhdGVzIHRoZSBXZWIgQXVkaW8gQVBJIHdoZW4gdGhlIHBhcnRpY2lwYW50IHRvdWNoZXMgdGhlIHNjcmVlbiAodXNlZnVsIG9uIGlPUyBkZXZpY2VzKS5cbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn0gW2RlZmF1bHRzLnJlcXVpcmVNb2JpbGU9dHJ1ZV0gLSBEZWZpbmVzIGlmIHRoZSBhcHBsaWNhdGlvbiByZXF1aXJlcyB0aGUgdXNlIG9mIGEgbW9iaWxlIGRldmljZS5cbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn0gW2RlZmF1bHRzLndha2VMb2NrPWZhbHNlXSAtIEluZGljYXRlcyB3aGV0aGVyIHRoZSBtb2R1bGVzIGFjdGl2YXRlcyBhbiBldmVyLWxvb3BpbmcgMS1waXhlbCB2aWRlbyB0byBwcmV2ZW50IHRoZSBkZXZpY2UgZnJvbSBnb2luZyBpZGxlLlxuICAgICAqL1xuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgcmVxdWlyZU1vYmlsZTogdHJ1ZSxcbiAgICAgIGFjdGl2YXRlQXVkaW86IHRydWUsXG4gICAgICBmdWxsU2NyZWVuOiBmYWxzZSxcbiAgICAgIHdha2VMb2NrOiBmYWxzZSxcbiAgICAgIHNob3dEaWFsb2c6IHRydWUsXG4gICAgICB2aWV3Q3RvcjogU2VnbWVudGVkVmlldyxcbiAgICAgIHZpZXdQcmlvcml0eTogMTAsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcblxuICAgIC8vIGNoZWNrIHBsYXRmb3JtXG4gICAgdGhpcy5fZGVmaW5lQXVkaW9GaWxlRXh0ZW50aW9uKCk7XG4gICAgdGhpcy5fZGVmaW5lUGxhdGZvcm0oKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgLy8gYnVpbGQgdmlldyBhY2NvcmRpbmcgdG8gdGhlIGRldmljZSBhbmQgcmVxdWlyZW1lbnRzXG4gICAgY29uc3Qgb3MgPSBjbGllbnQucGxhdGZvcm0ub3M7XG4gICAgY29uc3QgdmVyc2lvbiA9IHBhcnNlRmxvYXQocGxhdGZvcm0ub3MudmVyc2lvbik7XG4gICAgY29uc3QgaXNNb2JpbGUgPSBjbGllbnQucGxhdGZvcm0uaXNNb2JpbGU7XG4gICAgY29uc3QgcmVxdWlyZU1vYmlsZSA9IHRoaXMub3B0aW9ucy5yZXF1aXJlTW9iaWxlO1xuICAgIGNvbnN0IGFjdGl2YXRlQXVkaW8gPSB0aGlzLm9wdGlvbnMuYWN0aXZhdGVBdWRpbztcbiAgICBjb25zdCBjb250ZW50ID0gdGhpcy5jb250ZW50O1xuICAgIGxldCBlcnJvciA9IG51bGw7XG5cbiAgICBpZiAoYWN0aXZhdGVBdWRpbyAmJiAhdGhpcy5fc3VwcG9ydHNXZWJBdWRpbygpKSB7XG4gICAgICBpZiAob3MgPT09ICdpb3MnKSB7XG4gICAgICAgIGVycm9yID0gY29udGVudC5lcnJvcklvc1ZlcnNpb247XG4gICAgICB9IGVsc2UgaWYgKG9zID09PSAnYW5kcm9pZCcpIHtcbiAgICAgICAgZXJyb3IgPSBjb250ZW50LmVycm9yQW5kcm9pZFZlcnNpb247XG4gICAgICB9IGVsc2UgaWYgKHJlcXVpcmVNb2JpbGUpIHtcbiAgICAgICAgZXJyb3IgPSBjb250ZW50LmVycm9yUmVxdWlyZU1vYmlsZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVycm9yID0gY29udGVudC5lcnJvckRlZmF1bHQ7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChyZXF1aXJlTW9iaWxlICYmICghaXNNb2JpbGUgfHwgb3MgPT09ICdvdGhlcicpKSB7XG4gICAgICBlcnJvciA9IGNvbnRlbnQuZXJyb3JSZXF1aXJlTW9iaWxlO1xuICAgIH0gZWxzZSBpZiAob3MgPT09ICdpb3MnICYmIHZlcnNpb24gPCA3KSB7XG4gICAgICBlcnJvciA9IGNvbnRlbnQuZXJyb3JJb3NWZXJzaW9uO1xuICAgIH0gZWxzZSBpZiAob3MgPT09ICdhbmRyb2lkJyAmJiB2ZXJzaW9uIDwgNC4yKSB7XG4gICAgICBlcnJvciA9IGNvbnRlbnQuZXJyb3JBbmRyb2lkVmVyc2lvbjtcbiAgICB9XG5cbiAgICBjb250ZW50LmVycm9yID0gZXJyb3I7XG4gICAgY2xpZW50LmNvbXBhdGlibGUgPSBlcnJvciA9PT0gbnVsbCA/IHRydWUgOiBmYWxzZTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuc2hvd0RpYWxvZykge1xuICAgICAgaWYgKCFlcnJvcikge1xuICAgICAgICBjb25zdCBldmVudCA9IGlzTW9iaWxlID8gJ3RvdWNoZW5kJyA6ICdjbGljayc7XG4gICAgICAgIHRoaXMuZXZlbnRzID0geyBbZXZlbnRdOiB0aGlzLmFjdGl2YXRlTWVkaWEuYmluZCh0aGlzKSB9O1xuICAgICAgfVxuXG4gICAgICB0aGlzLnZpZXdDdG9yID0gdGhpcy5vcHRpb25zLnZpZXdDdG9yO1xuICAgICAgdGhpcy52aWV3ID0gdGhpcy5jcmVhdGVWaWV3KCk7XG4gICAgfVxuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICghdGhpcy5oYXNTdGFydGVkKVxuICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICBpZiAoIXRoaXMub3B0aW9ucy5zaG93RGlhbG9nKVxuICAgICAgdGhpcy5yZWFkeSgpO1xuICAgIGVsc2VcbiAgICAgIHRoaXMuc2hvdygpO1xuICB9XG5cbiAgc3RvcCgpIHtcbiAgICB0aGlzLmhpZGUoKTtcbiAgICBzdXBlci5zdG9wKCk7XG4gIH1cblxuICAvKipcbiAgICogQWN0aXZhdGUgbWVkaWEgYXMgZGVmaW5lZCBpbiBgdGhpcy5vcHRpb25zYC5cbiAgICovXG4gIGFjdGl2YXRlTWVkaWEoKSB7XG4gICAgaWYgKGNsaWVudC5yZWplY3RlZCkgeyByZXR1cm47IH1cbiAgICAvLyBodHRwOi8vd3d3Lmh0bWw1cm9ja3MuY29tL2VuL21vYmlsZS9mdWxsc2NyZWVuLz9yZWRpcmVjdF9mcm9tX2xvY2FsZT1mclxuICAgIGlmICh0aGlzLm9wdGlvbnMuZnVsbFNjcmVlbiAmJiBzY3JlZW5mdWxsLmVuYWJsZWQpXG4gICAgICBzY3JlZW5mdWxsLnJlcXVlc3QoKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuYWN0aXZhdGVBdWRpbylcbiAgICAgIHRoaXMuX2FjdGl2YXRlQXVkaW8oKTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMud2FrZUxvY2spXG4gICAgICB0aGlzLl9yZXF1ZXN0V2FrZUxvY2soKTtcblxuICAgIHRoaXMucmVhZHkoKTtcbiAgfVxuXG4gIF9zdXBwb3J0c1dlYkF1ZGlvKCkge1xuICAgIHJldHVybiAhIWF1ZGlvQ29udGV4dDtcbiAgfVxuXG4gIF9kZWZpbmVBdWRpb0ZpbGVFeHRlbnRpb24oKSB7XG4gICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2F1ZGlvJyk7XG4gICAgLy8gaHR0cDovL2RpdmVpbnRvaHRtbDUuaW5mby9ldmVyeXRoaW5nLmh0bWxcbiAgICBpZiAoISEoYS5jYW5QbGF5VHlwZSAmJiBhLmNhblBsYXlUeXBlKCdhdWRpby9tcGVnOycpKSkge1xuICAgICAgY2xpZW50LnBsYXRmb3JtLmF1ZGlvRmlsZUV4dCA9ICcubXAzJztcbiAgICB9IGVsc2UgaWYgKCEhKGEuY2FuUGxheVR5cGUgJiYgYS5jYW5QbGF5VHlwZSgnYXVkaW8vb2dnOyBjb2RlY3M9XCJ2b3JiaXNcIicpKSkge1xuICAgICAgY2xpZW50LnBsYXRmb3JtLmF1ZGlvRmlsZUV4dCA9ICcub2dnJztcbiAgICB9IGVsc2Uge1xuICAgICAgY2xpZW50LnBsYXRmb3JtLmF1ZGlvRmlsZUV4dCA9ICcud2F2JztcbiAgICB9XG4gIH1cblxuICBfZGVmaW5lUGxhdGZvcm0oKSB7XG4gICAgY29uc3QgdWEgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudFxuICAgIGNvbnN0IG1kID0gbmV3IE1vYmlsZURldGVjdCh1YSk7XG5cbiAgICBjbGllbnQucGxhdGZvcm0uaXNNb2JpbGUgPSAobWQubW9iaWxlKCkgIT09IG51bGwpOyAvLyB0cnVlIGlmIHBob25lIG9yIHRhYmxldFxuICAgIGNsaWVudC5wbGF0Zm9ybS5vcyA9IChmdW5jdGlvbigpIHtcbiAgICAgIGxldCBvcyA9IG1kLm9zKCk7XG5cbiAgICAgIGlmIChvcyA9PT0gJ0FuZHJvaWRPUycpXG4gICAgICAgIHJldHVybiAnYW5kcm9pZCc7XG4gICAgICBlbHNlIGlmIChvcyA9PT0gJ2lPUycpXG4gICAgICAgIHJldHVybiAnaW9zJztcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuICdvdGhlcic7XG4gICAgfSkoKTtcbiAgfVxuXG4gIF9hY3RpdmF0ZUF1ZGlvKCkge1xuICAgIHZhciBvID0gYXVkaW9Db250ZXh0LmNyZWF0ZU9zY2lsbGF0b3IoKTtcbiAgICB2YXIgZyA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG4gICAgZy5nYWluLnZhbHVlID0gMC4wMDAwMDAwMDE7IC8vIC0xODBkQiA/XG4gICAgby5jb25uZWN0KGcpO1xuICAgIGcuY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xuICAgIG8uc3RhcnQoMCk7XG5cbiAgICAvLyBwcmV2ZW50IGFuZHJvaWQgdG8gc3RvcCBhdWRpbyBieSBrZXBpbmcgdGhlIG9zY2lsbGF0b3IgYWN0aXZlXG4gICAgaWYgKGNsaWVudC5wbGF0Zm9ybS5vcyAhPT0gJ2FuZHJvaWQnKVxuICAgICAgby5zdG9wKGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSArIDAuMDEpO1xuICB9XG5cbiAgLy8gY2YuIGh0dHBzOi8vZ2l0aHViLmNvbS9ib3Jpc211cy93ZWJ2ci1ib2lsZXJwbGF0ZS9ibG9iLzhhYmJjNzRjZmE1OTc2YjlhYjBjMzg4Y2IwYzUxOTQ0MDA4YzY5ODkvanMvd2VidnItbWFuYWdlci5qcyNMMjY4LUwyODlcbiAgX2luaXRXYWtlTG9jaygpIHtcbiAgICB0aGlzLl93YWtlTG9ja1ZpZGVvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndmlkZW8nKTtcblxuICAgIHRoaXMuX3dha2VMb2NrVmlkZW8uYWRkRXZlbnRMaXN0ZW5lcignZW5kZWQnLCAoKSA9PiB7XG4gICAgICB0aGlzLl93YWtlTG9ja1ZpZGVvLnBsYXkoKTtcbiAgICB9KTtcbiAgfVxuXG4gIF9yZXF1ZXN0V2FrZUxvY2soKSB7XG4gICAgY29uc3Qgb3MgPSBjbGllbnQucGxhdGZvcm0ub3M7XG4gICAgdGhpcy5fcmVsZWFzZVdha2VDbG9jaygpO1xuXG4gICAgaWYgKG9zID09PSAnaW9zJykge1xuICAgICAgaWYgKHRoaXMuX3dha2VMb2NrVGltZXIpIHJldHVybjtcblxuICAgICAgdGhpcy5fd2FrZUxvY2tUaW1lciA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uID0gd2luZG93LmxvY2F0aW9uO1xuICAgICAgICBzZXRUaW1lb3V0KHdpbmRvdy5zdG9wLCAwKTtcbiAgICAgIH0sIDMwMDAwKTtcbiAgICB9IGVsc2UgaWYgKG9zID09PSAnYW5kcm9pZCcpIHtcbiAgICAgIGlmICh0aGlzLl93YWtlTG9ja1ZpZGVvLnBhdXNlZCA9PT0gZmFsc2UpIHJldHVybjtcblxuICAgICAgdGhpcy5fd2FrZUxvY2tWaWRlby5zcmMgPSBfYmFzZTY0KCd2aWRlby93ZWJtJywgJ0drWGZvd0VBQUFBQUFBQWZRb2FCQVVMM2dRRkM4b0VFUXZPQkNFS0NoSGRsWW0xQ2g0RUNRb1dCQWhoVGdHY0JBQUFBQUFBQ1d4Rk5tM1JBTEUyN2kxT3JoQlZKcVdaVHJJSGZUYnVNVTZ1RUZsU3VhMU9zZ2dFdVRidU1VNnVFSEZPN2ExT3NnZ0krN0FFQUFBQUFBQUNrQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBVlNhbG1BUUFBQUFBQUFFTXExN0dERDBKQVRZQ01UR0YyWmpVMkxqUXVNVEF4VjBHTVRHRjJaalUyTGpRdU1UQXhjNlNRMjBZdi9FbHdzNzNBLytLZkVqTTExRVNKaUVCa3dBQUFBQUFBRmxTdWF3RUFBQUFBQUFCSHJnRUFBQUFBQUFBKzE0RUJjOFdCQVp5QkFDSzFuSU4xYm1TR2hWWmZWbEE0ZzRFQkkrT0RoQVQza05YZ0FRQUFBQUFBQUJLd2dSQzZnUkJUd0lFQlZMQ0JFRlM2Z1JBZlE3WjFBUUFBQUFBQUFMSG5nUUNnQVFBQUFBQUFBRnlobzRFQUFJQVFBZ0NkQVNvUUFCQUFBRWNJaFlXSWhZU0lBZ0lBREExZ0FQNy9xMUNBZGFFQkFBQUFBQUFBTGFZQkFBQUFBQUFBSk82QkFhV2ZFQUlBblFFcUVBQVFBQUJIQ0lXRmlJV0VpQUlDQUF3TllBRCsvN3IvUUtBQkFBQUFBQUFBUUtHVmdRQlRBTEVCQUFFUUVBQVlBQmhZTC9RQUNBQUFkYUVCQUFBQUFBQUFINllCQUFBQUFBQUFGdTZCQWFXUnNRRUFBUkFRQUJnQUdGZ3Y5QUFJQUFBY1U3dHJBUUFBQUFBQUFCRzdqN09CQUxlSzk0RUI4WUlCZ2ZDQkF3PT0nKTtcbiAgICAgIHRoaXMuX3dha2VMb2NrVmlkZW8ucGxheSgpO1xuICAgIH1cbiAgfVxuXG4gIF9yZWxlYXNlV2FrZUNsb2NrKCkge1xuICAgIGNvbnN0IG9zID0gY2xpZW50LnBsYXRmb3JtLm9zO1xuXG4gICAgaWYgKG9zID09PSAnaW9zJykge1xuICAgICAgaWYgKHRoaXMuX3dha2VMb2NrVGltZXIpIHtcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLl93YWtlTG9ja1RpbWVyKTtcbiAgICAgICAgdGhpcy5fd2FrZUxvY2tUaW1lciA9IG51bGw7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChvcyA9PT0gJ2FuZHJvaWQnKSB7XG4gICAgICB0aGlzLl93YWtlTG9ja1ZpZGVvLnBhdXNlKCk7XG4gICAgICB0aGlzLl93YWtlTG9ja1ZpZGVvLnNyYyA9ICcnO1xuICAgIH1cbiAgfVxufVxuXG4vLyByZWdpc3RlciBpbiBmYWN0b3J5XG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBXZWxjb21lKTtcblxuZXhwb3J0IGRlZmF1bHQgV2VsY29tZTtcblxuIl19