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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9jbGllbnQvc2VydmljZXMvV2VsY29tZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7MEJBQTZCLGFBQWE7OzBCQUN2QixnQkFBZ0I7Ozs7MEJBQ1osWUFBWTs7OztvQ0FDVCwwQkFBMEI7Ozs7MkJBQ2hDLGlCQUFpQjs7OztrQ0FDVix3QkFBd0I7Ozs7Ozs0QkFHMUIsZUFBZTs7Ozt3QkFDbkIsVUFBVTs7Ozs7OztBQUsvQixTQUFTLE9BQU8sQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFO0FBQy9CLG1CQUFlLE1BQU0sZ0JBQVcsTUFBTSxDQUFHO0NBQzFDOztBQUVELElBQU0sVUFBVSxHQUFHLGlCQUFpQixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFvQi9CLE9BQU87WUFBUCxPQUFPOztBQUNBLFdBRFAsT0FBTyxHQUNHOzBCQURWLE9BQU87O0FBRVQsK0JBRkUsT0FBTyw2Q0FFSCxVQUFVLEVBQUUsS0FBSyxFQUFFOzs7Ozs7Ozs7QUFTekIsUUFBTSxRQUFRLEdBQUc7QUFDZixtQkFBYSxFQUFFLElBQUk7QUFDbkIsbUJBQWEsRUFBRSxJQUFJO0FBQ25CLGdCQUFVLEVBQUUsS0FBSztBQUNqQixjQUFRLEVBQUUsS0FBSztBQUNmLGdCQUFVLEVBQUUsSUFBSTtBQUNoQixjQUFRLG1DQUFlO0FBQ3ZCLGtCQUFZLEVBQUUsRUFBRTtLQUNqQixDQUFDOztBQUVGLFFBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRXpCLFFBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO0FBQ2pDLFFBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztHQUN4Qjs7OztlQXpCRyxPQUFPOztXQTJCUCxnQkFBRzs7QUFFTCxVQUFNLEVBQUUsR0FBRyx3QkFBTyxRQUFRLENBQUMsRUFBRSxDQUFDO0FBQzlCLFVBQU0sT0FBTyxHQUFHLFVBQVUs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LENBQUM7U0FDNUIsRUFBRSxLQUFLLENBQUMsQ0FBQztPQUNYLE1BQU0sSUFBSSxFQUFFLEtBQUssU0FBUyxFQUFFO0FBQzNCLFlBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEtBQUssS0FBSyxFQUFFLE9BQU87O0FBRWpELFlBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxZQUFZLEVBQUUsazNCQUFrM0IsQ0FBQyxDQUFDO0FBQ3A2QixZQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDO09BQzVCO0tBQ0Y7OztXQUVnQiw2QkFBRztBQUNsQixVQUFNLEVBQUUsR0FBRyx3QkFBTyxRQUFRLENBQUMsRUFBRSxDQUFDOztBQUU5QixVQUFJLEVBQUUsS0FBSyxLQUFLLEVBQUU7QUFDaEIsWUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO0FBQ3ZCLHVCQUFhLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ25DLGNBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO1NBQzVCO09BQ0YsTUFBTSxJQUFJLEVBQUUsS0FBSyxTQUFTLEVBQUU7QUFDM0IsWUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUM1QixZQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7T0FDOUI7S0FDRjs7O1NBOUxHLE9BQU87OztBQWtNYixnQ0FBZSxRQUFRLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDOztxQkFFOUIsT0FBTyIsImZpbGUiOiIvVXNlcnMvbWF0dXN6ZXdza2kvZGV2L2Nvc2ltYS9saWIvc291bmR3b3Jrcy9zcmMvY2xpZW50L3NlcnZpY2VzL1dlbGNvbWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhdWRpb0NvbnRleHQgfSBmcm9tICd3YXZlcy1hdWRpbyc7XG5pbXBvcnQgY2xpZW50IGZyb20gJy4uL2NvcmUvY2xpZW50JztcbmltcG9ydCBzY3JlZW5mdWxsIGZyb20gJ3NjcmVlbmZ1bGwnO1xuaW1wb3J0IFNlZ21lbnRlZFZpZXcgZnJvbSAnLi4vZGlzcGxheS9TZWdtZW50ZWRWaWV3JztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbi8vIEB0b2RvIC0gcmVkb25kYW50IGRlcGVuZGVuY2llc1xuaW1wb3J0IE1vYmlsZURldGVjdCBmcm9tICdtb2JpbGUtZGV0ZWN0JztcbmltcG9ydCBwbGF0Zm9ybSBmcm9tICdwbGF0Zm9ybSc7XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gX2Jhc2U2NChmb3JtYXQsIGJhc2U2NCkge1xuICByZXR1cm4gYGRhdGE6JHtmb3JtYXR9O2Jhc2U2NCwke2Jhc2U2NH1gO1xufVxuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6d2VsY29tZSc7XG5cbi8qKlxuICogW2NsaWVudF0gQ2hlY2sgd2hldGhlciB0aGUgZGV2aWNlIGlzIGNvbXBhdGlibGUgd2l0aCB0aGUgdGVjaG5vbG9naWVzIHVzZWQgaW4gdGhlICpTb3VuZHdvcmtzKiBsaWJyYXJ5LlxuICogVGhlIG1vZHVsZSBzaG91bGQgdXNlZCBhdCB0aGUgdmVyeSBiZWdpbm5pbmcgb2YgYSBzY2VuYXJpbyB0byBhY3RpdmF0ZSB0aGUgV2ViIEF1ZGlvIEFQSSBvbiBpT1MgZGV2aWNlcyAod2l0aCB0aGUgYGFjdGl2YXRlQXVkaW9gIG9wdGlvbikuXG4gKlxuICogVGhlIG1vZHVsZSByZXF1aXJlcyB0aGUgcGFydGljaXBhbnQgdG8gdGFwIHRoZSBzY3JlZW4gaW4gb3JkZXIgdG8gaW5pdGlhbGl6ZSB0aGUgd2ViQXVkaW8gb24gaU9TIGRldmljZXMgYW5kIHRvIG1ha2UgdGhlIHZpZXcgZGlzYXBwZWFyLlxuICpcbiAqIENvbXBhdGlibGUgZGV2aWNlcyBhcmUgcnVubmluZyBvbiBpT1MgNyBvciBhYm92ZSwgb3Igb24gQW5kcm9pZCA0LjIgb3IgYWJvdmUgd2l0aCB0aGUgQ2hyb21lIGJyb3dzZXIgaW4gdmVyc2lvbiAzNSBvciBhYm92ZS5cbiAqIElmIHRoYXQgaXMgbm90IHRoZSBjYXNlLCB0aGUgbW9kdWxlIGRpc3BsYXlzIGEgYmxvY2tpbmcgYHZpZXdgIGFuZCBwcmV2ZW50cyB0aGUgcGFydGljaXBhbnQgdG8gZ28gYW55IGZ1cnRoZXIgaW4gdGhlIHNjZW5hcmlvLlxuICpcbiAqIFRoZSBtb2R1bGUgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uIHdoZW4gdGhlIHVzZXIgdG91Y2hlcyB0aGUgc2NyZWVuIGlmIHRoZSBkZXZpY2UgcGFzc2VzIHRoZSBwbGF0Zm9ybSB0ZXN0LCBhbmQgbmV2ZXIgb3RoZXJ3aXNlLlxuICpcbiAqIFRoZSBtb2R1bGUgYWx3YXlzIGhhcyBhIHZpZXcuXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IHdlbGNvbWVEaWFsb2cgPSBuZXcgV2VsY29tZSh7XG4gKiAgIHdha2VMb2NrOiB0cnVlXG4gKiB9KTtcbiAqL1xuY2xhc3MgV2VsY29tZSBleHRlbmRzIFNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCBmYWxzZSk7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7T2JqZWN0fSBbZGVmYXVsdHM9e31dIC0gT3B0aW9ucy5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfSBbZGVmYXVsdHMubmFtZT0nd2VsY29tZSddIC0gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgICAqIEB0eXBlIHtCb29sZWFufSBbZGVmYXVsdHMuYWN0aXZhdGVBdWRpbz10cnVlXSAtIEluZGljYXRlcyB3aGV0aGVyIHRoZSBtb2R1bGUgYWN0aXZhdGVzIHRoZSBXZWIgQXVkaW8gQVBJIHdoZW4gdGhlIHBhcnRpY2lwYW50IHRvdWNoZXMgdGhlIHNjcmVlbiAodXNlZnVsIG9uIGlPUyBkZXZpY2VzKS5cbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn0gW2RlZmF1bHRzLnJlcXVpcmVNb2JpbGU9dHJ1ZV0gLSBEZWZpbmVzIGlmIHRoZSBhcHBsaWNhdGlvbiByZXF1aXJlcyB0aGUgdXNlIG9mIGEgbW9iaWxlIGRldmljZS5cbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn0gW2RlZmF1bHRzLndha2VMb2NrPWZhbHNlXSAtIEluZGljYXRlcyB3aGV0aGVyIHRoZSBtb2R1bGVzIGFjdGl2YXRlcyBhbiBldmVyLWxvb3BpbmcgMS1waXhlbCB2aWRlbyB0byBwcmV2ZW50IHRoZSBkZXZpY2UgZnJvbSBnb2luZyBpZGxlLlxuICAgICAqL1xuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgcmVxdWlyZU1vYmlsZTogdHJ1ZSxcbiAgICAgIGFjdGl2YXRlQXVkaW86IHRydWUsXG4gICAgICBmdWxsU2NyZWVuOiBmYWxzZSxcbiAgICAgIHdha2VMb2NrOiBmYWxzZSxcbiAgICAgIHNob3dEaWFsb2c6IHRydWUsXG4gICAgICB2aWV3Q3RvcjogU2VnbWVudGVkVmlldyxcbiAgICAgIHZpZXdQcmlvcml0eTogMTAsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcbiAgICAvLyBjaGVjayBwbGF0Zm9ybVxuICAgIHRoaXMuX2RlZmluZUF1ZGlvRmlsZUV4dGVudGlvbigpO1xuICAgIHRoaXMuX2RlZmluZVBsYXRmb3JtKCk7XG4gIH1cblxuICBpbml0KCkge1xuICAgIC8vIGJ1aWxkIHZpZXcgYWNjb3JkaW5nIHRvIHRoZSBkZXZpY2UgYW5kIHJlcXVpcmVtZW50c1xuICAgIGNvbnN0IG9zID0gY2xpZW50LnBsYXRmb3JtLm9zO1xuICAgIGNvbnN0IHZlcnNpb24gPSBwYXJzZUZsb2F0KHBsYXRmb3JtLm9zLnZlcnNpb24pO1xuICAgIGNvbnN0IGlzTW9iaWxlID0gY2xpZW50LnBsYXRmb3JtLmlzTW9iaWxlO1xuICAgIGNvbnN0IHJlcXVpcmVNb2JpbGUgPSB0aGlzLm9wdGlvbnMucmVxdWlyZU1vYmlsZTtcbiAgICBjb25zdCBhY3RpdmF0ZUF1ZGlvID0gdGhpcy5vcHRpb25zLmFjdGl2YXRlQXVkaW87XG4gICAgY29uc3QgY29udGVudCA9IHRoaXMuY29udGVudDtcbiAgICBsZXQgZXJyb3IgPSBudWxsO1xuXG4gICAgaWYgKGFjdGl2YXRlQXVkaW8gJiYgIXRoaXMuX3N1cHBvcnRzV2ViQXVkaW8oKSkge1xuICAgICAgaWYgKG9zID09PSAnaW9zJykge1xuICAgICAgICBlcnJvciA9IGNvbnRlbnQuZXJyb3JJb3NWZXJzaW9uO1xuICAgICAgfSBlbHNlIGlmIChvcyA9PT0gJ2FuZHJvaWQnKSB7XG4gICAgICAgIGVycm9yID0gY29udGVudC5lcnJvckFuZHJvaWRWZXJzaW9uO1xuICAgICAgfSBlbHNlIGlmIChyZXF1aXJlTW9iaWxlKSB7XG4gICAgICAgIGVycm9yID0gY29udGVudC5lcnJvclJlcXVpcmVNb2JpbGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlcnJvciA9IGNvbnRlbnQuZXJyb3JEZWZhdWx0O1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAocmVxdWlyZU1vYmlsZSAmJiAoIWlzTW9iaWxlIHx8IG9zID09PSAnb3RoZXInKSkge1xuICAgICAgZXJyb3IgPSBjb250ZW50LmVycm9yUmVxdWlyZU1vYmlsZTtcbiAgICB9IGVsc2UgaWYgKG9zID09PSAnaW9zJyAmJiB2ZXJzaW9uIDwgNykge1xuICAgICAgZXJyb3IgPSBjb250ZW50LmVycm9ySW9zVmVyc2lvbjtcbiAgICB9IGVsc2UgaWYgKG9zID09PSAnYW5kcm9pZCcgJiYgdmVyc2lvbiA8IDQuMikge1xuICAgICAgZXJyb3IgPSBjb250ZW50LmVycm9yQW5kcm9pZFZlcnNpb247XG4gICAgfVxuXG4gICAgY29udGVudC5lcnJvciA9IGVycm9yO1xuICAgIGNsaWVudC5jb21wYXRpYmxlID0gZXJyb3IgPT09IG51bGwgPyB0cnVlIDogZmFsc2U7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnNob3dEaWFsb2cpIHtcbiAgICAgIGlmICghZXJyb3IpIHtcbiAgICAgICAgY29uc3QgZXZlbnQgPSBpc01vYmlsZSA/ICd0b3VjaGVuZCcgOiAnY2xpY2snO1xuICAgICAgICB0aGlzLmV2ZW50cyA9IHsgW2V2ZW50XTogdGhpcy5hY3RpdmF0ZU1lZGlhLmJpbmQodGhpcykgfTtcbiAgICAgIH1cblxuICAgICAgdGhpcy52aWV3Q3RvciA9IHRoaXMub3B0aW9ucy52aWV3Q3RvcjtcbiAgICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlVmlldygpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBpZiAoIXRoaXMuaGFzU3RhcnRlZClcbiAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMuc2hvd0RpYWxvZylcbiAgICAgIHRoaXMucmVhZHkoKTtcbiAgICBlbHNlXG4gICAgICB0aGlzLnNob3coKTtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5oaWRlKCk7XG4gICAgc3VwZXIuc3RvcCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFjdGl2YXRlIG1lZGlhIGFzIGRlZmluZWQgaW4gYHRoaXMub3B0aW9uc2AuXG4gICAqL1xuICBhY3RpdmF0ZU1lZGlhKCkge1xuICAgIGlmIChjbGllbnQucmVqZWN0ZWQpIHsgcmV0dXJuOyB9XG4gICAgLy8gaHR0cDovL3d3dy5odG1sNXJvY2tzLmNvbS9lbi9tb2JpbGUvZnVsbHNjcmVlbi8/cmVkaXJlY3RfZnJvbV9sb2NhbGU9ZnJcbiAgICBpZiAodGhpcy5vcHRpb25zLmZ1bGxTY3JlZW4gJiYgc2NyZWVuZnVsbC5lbmFibGVkKVxuICAgICAgc2NyZWVuZnVsbC5yZXF1ZXN0KCk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmFjdGl2YXRlQXVkaW8pXG4gICAgICB0aGlzLl9hY3RpdmF0ZUF1ZGlvKCk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLndha2VMb2NrKVxuICAgICAgdGhpcy5fcmVxdWVzdFdha2VMb2NrKCk7XG5cbiAgICB0aGlzLnJlYWR5KCk7XG4gIH1cblxuICBfc3VwcG9ydHNXZWJBdWRpbygpIHtcbiAgICByZXR1cm4gISFhdWRpb0NvbnRleHQ7XG4gIH1cblxuICBfZGVmaW5lQXVkaW9GaWxlRXh0ZW50aW9uKCkge1xuICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhdWRpbycpO1xuICAgIC8vIGh0dHA6Ly9kaXZlaW50b2h0bWw1LmluZm8vZXZlcnl0aGluZy5odG1sXG4gICAgaWYgKCEhKGEuY2FuUGxheVR5cGUgJiYgYS5jYW5QbGF5VHlwZSgnYXVkaW8vbXBlZzsnKSkpIHtcbiAgICAgIGNsaWVudC5wbGF0Zm9ybS5hdWRpb0ZpbGVFeHQgPSAnLm1wMyc7XG4gICAgfSBlbHNlIGlmICghIShhLmNhblBsYXlUeXBlICYmIGEuY2FuUGxheVR5cGUoJ2F1ZGlvL29nZzsgY29kZWNzPVwidm9yYmlzXCInKSkpIHtcbiAgICAgIGNsaWVudC5wbGF0Zm9ybS5hdWRpb0ZpbGVFeHQgPSAnLm9nZyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNsaWVudC5wbGF0Zm9ybS5hdWRpb0ZpbGVFeHQgPSAnLndhdic7XG4gICAgfVxuICB9XG5cbiAgX2RlZmluZVBsYXRmb3JtKCkge1xuICAgIGNvbnN0IHVhID0gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnRcbiAgICBjb25zdCBtZCA9IG5ldyBNb2JpbGVEZXRlY3QodWEpO1xuXG4gICAgY2xpZW50LnBsYXRmb3JtLmlzTW9iaWxlID0gKG1kLm1vYmlsZSgpICE9PSBudWxsKTsgLy8gdHJ1ZSBpZiBwaG9uZSBvciB0YWJsZXRcbiAgICBjbGllbnQucGxhdGZvcm0ub3MgPSAoZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgb3MgPSBtZC5vcygpO1xuXG4gICAgICBpZiAob3MgPT09ICdBbmRyb2lkT1MnKVxuICAgICAgICByZXR1cm4gJ2FuZHJvaWQnO1xuICAgICAgZWxzZSBpZiAob3MgPT09ICdpT1MnKVxuICAgICAgICByZXR1cm4gJ2lvcyc7XG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiAnb3RoZXInO1xuICAgIH0pKCk7XG4gIH1cblxuICBfYWN0aXZhdGVBdWRpbygpIHtcbiAgICB2YXIgbyA9IGF1ZGlvQ29udGV4dC5jcmVhdGVPc2NpbGxhdG9yKCk7XG4gICAgdmFyIGcgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuICAgIGcuZ2Fpbi52YWx1ZSA9IDAuMDAwMDAwMDAxOyAvLyAtMTgwZEIgP1xuICAgIG8uY29ubmVjdChnKTtcbiAgICBnLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcbiAgICBvLnN0YXJ0KDApO1xuXG4gICAgLy8gcHJldmVudCBhbmRyb2lkIHRvIHN0b3AgYXVkaW8gYnkga2VwaW5nIHRoZSBvc2NpbGxhdG9yIGFjdGl2ZVxuICAgIGlmIChjbGllbnQucGxhdGZvcm0ub3MgIT09ICdhbmRyb2lkJylcbiAgICAgIG8uc3RvcChhdWRpb0NvbnRleHQuY3VycmVudFRpbWUgKyAwLjAxKTtcbiAgfVxuXG4gIC8vIGNmLiBodHRwczovL2dpdGh1Yi5jb20vYm9yaXNtdXMvd2VidnItYm9pbGVycGxhdGUvYmxvYi84YWJiYzc0Y2ZhNTk3NmI5YWIwYzM4OGNiMGM1MTk0NDAwOGM2OTg5L2pzL3dlYnZyLW1hbmFnZXIuanMjTDI2OC1MMjg5XG4gIF9pbml0V2FrZUxvY2soKSB7XG4gICAgdGhpcy5fd2FrZUxvY2tWaWRlbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJyk7XG5cbiAgICB0aGlzLl93YWtlTG9ja1ZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoJ2VuZGVkJywgKCkgPT4ge1xuICAgICAgdGhpcy5fd2FrZUxvY2tWaWRlby5wbGF5KCk7XG4gICAgfSk7XG4gIH1cblxuICBfcmVxdWVzdFdha2VMb2NrKCkge1xuICAgIGNvbnN0IG9zID0gY2xpZW50LnBsYXRmb3JtLm9zO1xuICAgIHRoaXMuX3JlbGVhc2VXYWtlQ2xvY2soKTtcblxuICAgIGlmIChvcyA9PT0gJ2lvcycpIHtcbiAgICAgIGlmICh0aGlzLl93YWtlTG9ja1RpbWVyKSByZXR1cm47XG5cbiAgICAgIHRoaXMuX3dha2VMb2NrVGltZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbiA9IHdpbmRvdy5sb2NhdGlvbjtcbiAgICAgICAgc2V0VGltZW91dCh3aW5kb3cuc3RvcCwgMCk7XG4gICAgICB9LCAzMDAwMCk7XG4gICAgfSBlbHNlIGlmIChvcyA9PT0gJ2FuZHJvaWQnKSB7XG4gICAgICBpZiAodGhpcy5fd2FrZUxvY2tWaWRlby5wYXVzZWQgPT09IGZhbHNlKSByZXR1cm47XG5cbiAgICAgIHRoaXMuX3dha2VMb2NrVmlkZW8uc3JjID0gX2Jhc2U2NCgndmlkZW8vd2VibScsICdHa1hmb3dFQUFBQUFBQUFmUW9hQkFVTDNnUUZDOG9FRVF2T0JDRUtDaEhkbFltMUNoNEVDUW9XQkFoaFRnR2NCQUFBQUFBQUNXeEZObTNSQUxFMjdpMU9yaEJWSnFXWlRySUhmVGJ1TVU2dUVGbFN1YTFPc2dnRXVUYnVNVTZ1RUhGTzdhMU9zZ2dJKzdBRUFBQUFBQUFDa0FBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQVZTYWxtQVFBQUFBQUFBRU1xMTdHREQwSkFUWUNNVEdGMlpqVTJMalF1TVRBeFYwR01UR0YyWmpVMkxqUXVNVEF4YzZTUTIwWXYvRWx3czczQS8rS2ZFak0xMUVTSmlFQmt3QUFBQUFBQUZsU3Vhd0VBQUFBQUFBQkhyZ0VBQUFBQUFBQSsxNEVCYzhXQkFaeUJBQ0sxbklOMWJtU0doVlpmVmxBNGc0RUJJK09EaEFUM2tOWGdBUUFBQUFBQUFCS3dnUkM2Z1JCVHdJRUJWTENCRUZTNmdSQWZRN1oxQVFBQUFBQUFBTEhuZ1FDZ0FRQUFBQUFBQUZ5aG80RUFBSUFRQWdDZEFTb1FBQkFBQUVjSWhZV0loWVNJQWdJQURBMWdBUDcvcTFDQWRhRUJBQUFBQUFBQUxhWUJBQUFBQUFBQUpPNkJBYVdmRUFJQW5RRXFFQUFRQUFCSENJV0ZpSVdFaUFJQ0FBd05ZQUQrLzdyL1FLQUJBQUFBQUFBQVFLR1ZnUUJUQUxFQkFBRVFFQUFZQUJoWUwvUUFDQUFBZGFFQkFBQUFBQUFBSDZZQkFBQUFBQUFBRnU2QkFhV1JzUUVBQVJBUUFCZ0FHRmd2OUFBSUFBQWNVN3RyQVFBQUFBQUFBQkc3ajdPQkFMZUs5NEVCOFlJQmdmQ0JBdz09Jyk7XG4gICAgICB0aGlzLl93YWtlTG9ja1ZpZGVvLnBsYXkoKTtcbiAgICB9XG4gIH1cblxuICBfcmVsZWFzZVdha2VDbG9jaygpIHtcbiAgICBjb25zdCBvcyA9IGNsaWVudC5wbGF0Zm9ybS5vcztcblxuICAgIGlmIChvcyA9PT0gJ2lvcycpIHtcbiAgICAgIGlmICh0aGlzLl93YWtlTG9ja1RpbWVyKSB7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5fd2FrZUxvY2tUaW1lcik7XG4gICAgICAgIHRoaXMuX3dha2VMb2NrVGltZXIgPSBudWxsO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAob3MgPT09ICdhbmRyb2lkJykge1xuICAgICAgdGhpcy5fd2FrZUxvY2tWaWRlby5wYXVzZSgpO1xuICAgICAgdGhpcy5fd2FrZUxvY2tWaWRlby5zcmMgPSAnJztcbiAgICB9XG4gIH1cbn1cblxuLy8gcmVnaXN0ZXIgaW4gZmFjdG9yeVxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgV2VsY29tZSk7XG5cbmV4cG9ydCBkZWZhdWx0IFdlbGNvbWU7XG5cbiJdfQ==