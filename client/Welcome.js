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
      this.view = this.createView();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvV2VsY29tZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzBCQUE2QixhQUFhOztzQkFDdkIsVUFBVTs7Ozs2QkFDSixnQkFBZ0I7Ozs7Ozt3QkFFcEIsVUFBVTs7Ozs0QkFDTixlQUFlOzs7O29DQUNkLHlCQUF5Qjs7OzswQkFFNUIsWUFBWTs7Ozs7OztBQUtuQyxTQUFTLE9BQU8sQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFO0FBQy9CLG1CQUFlLE1BQU0sZ0JBQVcsTUFBTSxDQUFHO0NBQzFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFvQm9CLE9BQU87WUFBUCxPQUFPOzs7Ozs7Ozs7O0FBUWYsV0FSUSxPQUFPLEdBUUE7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQVJMLE9BQU87O0FBU3hCLCtCQVRpQixPQUFPLDZDQVNsQixPQUFPLENBQUMsSUFBSSxJQUFJLFNBQVMsRUFBRSxPQUFPLEVBQUU7O0FBRTFDLFFBQUksQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFDLGFBQWEsS0FBSyxLQUFLLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNyRSxRQUFJLENBQUMsa0JBQWtCLEdBQUcsT0FBTyxDQUFDLGFBQWEsS0FBSyxLQUFLLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQztBQUN6RSxRQUFJLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQyxVQUFVLEtBQUssS0FBSyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDbkUsUUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQzs7O0FBR3hDLFFBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO0FBQ2pDLFFBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQzs7O0FBR3ZCLFFBQU0sRUFBRSxHQUFHLG9CQUFPLFFBQVEsQ0FBQyxFQUFFLENBQUM7QUFDOUIsUUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDLHNCQUFTLEVBQUUsQ0FBQyxPQUFP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QUNoQixZQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7QUFDdkIsdUJBQWEsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDbkMsY0FBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7U0FDNUI7T0FDRixNQUFNLElBQUksRUFBRSxLQUFLLFNBQVMsRUFBRTtBQUMzQixZQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQzVCLFlBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztPQUM5QjtLQUNGOzs7U0E1S2tCLE9BQU87OztxQkFBUCxPQUFPIiwiZmlsZSI6InNyYy9jbGllbnQvV2VsY29tZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGF1ZGlvQ29udGV4dCB9IGZyb20gJ3dhdmVzLWF1ZGlvJztcbmltcG9ydCBjbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IENsaWVudE1vZHVsZSBmcm9tICcuL0NsaWVudE1vZHVsZSc7XG4vLyBAdG9kbyAtIHByb2JsZW0gb2YgcmVkb25kYW50IGRlcGVuZGVuY3lcbmltcG9ydCBwbGF0Zm9ybSBmcm9tICdwbGF0Zm9ybSc7XG5pbXBvcnQgTW9iaWxlRGV0ZWN0IGZyb20gJ21vYmlsZS1kZXRlY3QnO1xuaW1wb3J0IFNlZ21lbnRlZFZpZXcgZnJvbSAnLi9kaXNwbGF5L1NlZ21lbnRlZFZpZXcnO1xuXG5pbXBvcnQgc2NyZWVuZnVsbCBmcm9tICdzY3JlZW5mdWxsJztcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBfYmFzZTY0KGZvcm1hdCwgYmFzZTY0KSB7XG4gIHJldHVybiBgZGF0YToke2Zvcm1hdH07YmFzZTY0LCR7YmFzZTY0fWA7XG59XG5cbi8qKlxuICogW2NsaWVudF0gQ2hlY2sgd2hldGhlciB0aGUgZGV2aWNlIGlzIGNvbXBhdGlibGUgd2l0aCB0aGUgdGVjaG5vbG9naWVzIHVzZWQgaW4gdGhlICpTb3VuZHdvcmtzKiBsaWJyYXJ5LlxuICogVGhlIG1vZHVsZSBzaG91bGQgdXNlZCBhdCB0aGUgdmVyeSBiZWdpbm5pbmcgb2YgYSBzY2VuYXJpbyB0byBhY3RpdmF0ZSB0aGUgV2ViIEF1ZGlvIEFQSSBvbiBpT1MgZGV2aWNlcyAod2l0aCB0aGUgYGFjdGl2YXRlQXVkaW9gIG9wdGlvbikuXG4gKlxuICogVGhlIG1vZHVsZSByZXF1aXJlcyB0aGUgcGFydGljaXBhbnQgdG8gdGFwIHRoZSBzY3JlZW4gaW4gb3JkZXIgdG8gaW5pdGlhbGl6ZSB0aGUgd2ViQXVkaW8gb24gaU9TIGRldmljZXMgYW5kIHRvIG1ha2UgdGhlIHZpZXcgZGlzYXBwZWFyLlxuICpcbiAqIENvbXBhdGlibGUgZGV2aWNlcyBhcmUgcnVubmluZyBvbiBpT1MgNyBvciBhYm92ZSwgb3Igb24gQW5kcm9pZCA0LjIgb3IgYWJvdmUgd2l0aCB0aGUgQ2hyb21lIGJyb3dzZXIgaW4gdmVyc2lvbiAzNSBvciBhYm92ZS5cbiAqIElmIHRoYXQgaXMgbm90IHRoZSBjYXNlLCB0aGUgbW9kdWxlIGRpc3BsYXlzIGEgYmxvY2tpbmcgYHZpZXdgIGFuZCBwcmV2ZW50cyB0aGUgcGFydGljaXBhbnQgdG8gZ28gYW55IGZ1cnRoZXIgaW4gdGhlIHNjZW5hcmlvLlxuICpcbiAqIFRoZSBtb2R1bGUgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uIHdoZW4gdGhlIHVzZXIgdG91Y2hlcyB0aGUgc2NyZWVuIGlmIHRoZSBkZXZpY2UgcGFzc2VzIHRoZSBwbGF0Zm9ybSB0ZXN0LCBhbmQgbmV2ZXIgb3RoZXJ3aXNlLlxuICpcbiAqIFRoZSBtb2R1bGUgYWx3YXlzIGhhcyBhIHZpZXcuXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IHdlbGNvbWVEaWFsb2cgPSBuZXcgV2VsY29tZSh7XG4gKiAgIHdha2VMb2NrOiB0cnVlXG4gKiB9KTtcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2VsY29tZSBleHRlbmRzIENsaWVudE1vZHVsZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIC0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm5hbWU9J3dlbGNvbWUnXSAtIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5hY3RpdmF0ZUF1ZGlvPXRydWVdIC0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIG1vZHVsZSBhY3RpdmF0ZXMgdGhlIFdlYiBBdWRpbyBBUEkgd2hlbiB0aGUgcGFydGljaXBhbnQgdG91Y2hlcyB0aGUgc2NyZWVuICh1c2VmdWwgb24gaU9TIGRldmljZXMpLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnJlcXVpcmVNb2JpbGU9dHJ1ZV0gLSBEZWZpbmVzIGlmIHRoZSBhcHBsaWNhdGlvbiByZXF1aXJlcyB0aGUgdXNlIG9mIGEgbW9iaWxlIGRldmljZS5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy53YWtlTG9jaz1mYWxzZV0gLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgbW9kdWxlcyBhY3RpdmF0ZXMgYW4gZXZlci1sb29waW5nIDEtcGl4ZWwgdmlkZW8gdG8gcHJldmVudCB0aGUgZGV2aWNlIGZyb20gZ29pbmcgaWRsZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnd2VsY29tZScsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5fcmVxdWlyZU1vYmlsZSA9IG9wdGlvbnMucmVxdWlyZU1vYmlsZSA9PT0gZmFsc2UgPyBmYWxzZSA6IHRydWU7XG4gICAgdGhpcy5fbXVzdEFjdGl2YXRlQXVkaW8gPSBvcHRpb25zLmFjdGl2YXRlQXVkaW8gPT09IGZhbHNlID8gZmFsc2UgOiB0cnVlO1xuICAgIHRoaXMuX211c3RGdWxsU2NyZWVuID0gb3B0aW9ucy5mdWxsU2NyZWVuID09PSBmYWxzZSA/IGZhbHNlIDogdHJ1ZTtcbiAgICB0aGlzLl9tdXN0V2FrZUxvY2sgPSAhIW9wdGlvbnMud2FrZUxvY2s7XG5cbiAgICAvLyBjaGVjayBwbGF0Zm9ybVxuICAgIHRoaXMuX2RlZmluZUF1ZGlvRmlsZUV4dGVudGlvbigpO1xuICAgIHRoaXMuX2RlZmluZVBsYXRmb3JtKCk7XG5cbiAgICAvLyBhbmQgYnVpbGQgdmlldyBhY2NvcmRpbmcgdG8gdGhlIGRldmljZSBhbmQgcmVxdWlyZW1lbnRzXG4gICAgY29uc3Qgb3MgPSBjbGllbnQucGxhdGZvcm0ub3M7XG4gICAgY29uc3QgdmVyc2lvbiA9IHBhcnNlRmxvYXQocGxhdGZvcm0ub3MudmVyc2lvbik7XG4gICAgY29uc3QgaXNNb2JpbGUgPSBjbGllbnQucGxhdGZvcm0uaXNNb2JpbGU7XG4gICAgY29uc3QgcmVxdWlyZU1vYmlsZSA9IHRoaXMuX3JlcXVpcmVNb2JpbGU7XG4gICAgbGV0IGVycm9yID0gbnVsbDtcblxuICAgIGlmICghdGhpcy5fc3VwcG9ydHNXZWJBdWRpbygpKSB7XG4gICAgICBpZiAob3MgPT09ICdpb3MnKSB7XG4gICAgICAgIGVycm9yID0gdGhpcy5jb250ZW50LmVycm9ySW9zVmVyc2lvbjtcbiAgICAgIH0gZWxzZSBpZiAob3MgPT09ICdhbmRyb2lkJykge1xuICAgICAgICBlcnJvciA9IHRoaXMuY29udGVudC5lcnJvckFuZHJvaWRWZXJzaW9uO1xuICAgICAgfSBlbHNlIGlmIChyZXF1aXJlTW9iaWxlKSB7XG4gICAgICAgIGVycm9yID0gdGhpcy5jb250ZW50LmVycm9yUmVxdWlyZU1vYmlsZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVycm9yID0gdGhpcy5jb250ZW50LmVycm9yRGVmYXVsdDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHJlcXVpcmVNb2JpbGUgJiYgKCFpc01vYmlsZSB8fCBvcyA9PT0gJ290aGVyJykpIHtcbiAgICAgIGVycm9yID0gdGhpcy5jb250ZW50LmVycm9yUmVxdWlyZU1vYmlsZTtcbiAgICB9IGVsc2UgaWYgKG9zID09PSAnaW9zJyAmJiB2ZXJzaW9uIDwgNykge1xuICAgICAgZXJyb3IgPSB0aGlzLmNvbnRlbnQuZXJyb3JJb3NWZXJzaW9uO1xuICAgIH0gZWxzZSBpZiAob3MgPT09ICdhbmRyb2lkJyAmJiB2ZXJzaW9uIDwgNC4yKSB7XG4gICAgICBlcnJvciA9IHRoaXMuY29udGVudC5lcnJvckFuZHJvaWRWZXJzaW9uO1xuICAgIH1cblxuICAgIHRoaXMuY29udGVudC5lcnJvciA9IGVycm9yO1xuXG4gICAgaWYgKCFlcnJvcikge1xuICAgICAgdGhpcy5ldmVudHMgPSB7ICdjbGljayc6IHRoaXMuX29uQ2xpY2suYmluZCh0aGlzKSB9O1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnZpZXcpIHtcbiAgICAgIHRoaXMudmlldyA9IG9wdGlvbnMudmlldztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy52aWV3Q3RvciA9IG9wdGlvbnMudmlld0N0b3IgfHwgU2VnbWVudGVkVmlldztcbiAgICAgIHRoaXMudmlldyA9IHRoaXMuY3JlYXRlVmlldygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVzdGFydCgpIHtcbiAgICBzdXBlci5yZXN0YXJ0KCk7XG4gICAgdGhpcy5kb25lKCk7XG4gIH1cblxuICBfb25DbGljaygpIHtcbiAgICAvLyBodHRwOi8vd3d3Lmh0bWw1cm9ja3MuY29tL2VuL21vYmlsZS9mdWxsc2NyZWVuLz9yZWRpcmVjdF9mcm9tX2xvY2FsZT1mclxuICAgIGlmICh0aGlzLl9tdXN0RnVsbFNjcmVlbiAmJiBzY3JlZW5mdWxsLmVuYWJsZWQpXG4gICAgICBzY3JlZW5mdWxsLnJlcXVlc3QoKTtcblxuICAgIGlmICh0aGlzLl9tdXN0QWN0aXZhdGVBdWRpbylcbiAgICAgIHRoaXMuX2FjdGl2YXRlQXVkaW8oKTtcblxuICAgIGlmICh0aGlzLl9tdXN0V2FrZUxvY2spXG4gICAgICB0aGlzLl9yZXF1ZXN0V2FrZUxvY2soKTtcblxuICAgIHRoaXMuZG9uZSgpO1xuICB9XG5cbiAgX3N1cHBvcnRzV2ViQXVkaW8oKSB7XG4gICAgcmV0dXJuICEhYXVkaW9Db250ZXh0O1xuICB9XG5cbiAgX2RlZmluZUF1ZGlvRmlsZUV4dGVudGlvbigpIHtcbiAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYXVkaW8nKTtcbiAgICAvLyBodHRwOi8vZGl2ZWludG9odG1sNS5pbmZvL2V2ZXJ5dGhpbmcuaHRtbFxuICAgIGlmICghIShhLmNhblBsYXlUeXBlICYmIGEuY2FuUGxheVR5cGUoJ2F1ZGlvL21wZWc7JykpKSB7XG4gICAgICBjbGllbnQucGxhdGZvcm0uYXVkaW9GaWxlRXh0ID0gJy5tcDMnO1xuICAgIH0gZWxzZSBpZiAoISEoYS5jYW5QbGF5VHlwZSAmJiBhLmNhblBsYXlUeXBlKCdhdWRpby9vZ2c7IGNvZGVjcz1cInZvcmJpc1wiJykpKSB7XG4gICAgICBjbGllbnQucGxhdGZvcm0uYXVkaW9GaWxlRXh0ID0gJy5vZ2cnO1xuICAgIH0gZWxzZSB7XG4gICAgICBjbGllbnQucGxhdGZvcm0uYXVkaW9GaWxlRXh0ID0gJy53YXYnO1xuICAgIH1cbiAgfVxuXG4gIF9kZWZpbmVQbGF0Zm9ybSgpIHtcbiAgICBjb25zdCB1YSA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50XG4gICAgY29uc3QgbWQgPSBuZXcgTW9iaWxlRGV0ZWN0KHVhKTtcblxuICAgIGNsaWVudC5wbGF0Zm9ybS5pc01vYmlsZSA9IChtZC5tb2JpbGUoKSAhPT0gbnVsbCk7IC8vIHRydWUgaWYgcGhvbmUgb3IgdGFibGV0XG4gICAgY2xpZW50LnBsYXRmb3JtLm9zID0gKGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IG9zID0gbWQub3MoKTtcblxuICAgICAgaWYgKG9zID09PSAnQW5kcm9pZE9TJykge1xuICAgICAgICByZXR1cm4gJ2FuZHJvaWQnO1xuICAgICAgfSBlbHNlIGlmIChvcyA9PT0gJ2lPUycpIHtcbiAgICAgICAgcmV0dXJuICdpb3MnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuICdvdGhlcic7XG4gICAgICB9XG4gICAgfSkoKTtcbiAgfVxuXG4gIF9hY3RpdmF0ZUF1ZGlvKCkge1xuICAgIHZhciBvID0gYXVkaW9Db250ZXh0LmNyZWF0ZU9zY2lsbGF0b3IoKTtcbiAgICB2YXIgZyA9IGF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG4gICAgZy5nYWluLnZhbHVlID0gMDtcbiAgICBvLmNvbm5lY3QoZyk7XG4gICAgZy5jb25uZWN0KGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbik7XG4gICAgby5zdGFydCgwKTtcbiAgICBvLnN0b3AoYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lICsgMC4wMSk7XG4gIH1cblxuICAvLyBjZi4gaHR0cHM6Ly9naXRodWIuY29tL2JvcmlzbXVzL3dlYnZyLWJvaWxlcnBsYXRlL2Jsb2IvOGFiYmM3NGNmYTU5NzZiOWFiMGMzODhjYjBjNTE5NDQwMDhjNjk4OS9qcy93ZWJ2ci1tYW5hZ2VyLmpzI0wyNjgtTDI4OVxuICBfaW5pdFdha2VMb2NrKCkge1xuICAgIHRoaXMuX3dha2VMb2NrVmlkZW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd2aWRlbycpO1xuXG4gICAgdGhpcy5fd2FrZUxvY2tWaWRlby5hZGRFdmVudExpc3RlbmVyKCdlbmRlZCcsICgpID0+IHtcbiAgICAgIHRoaXMuX3dha2VMb2NrVmlkZW8ucGxheSgpO1xuICAgIH0pO1xuICB9XG5cbiAgX3JlcXVlc3RXYWtlTG9jaygpIHtcbiAgICBjb25zdCBvcyA9IGNsaWVudC5wbGF0Zm9ybS5vcztcbiAgICB0aGlzLl9yZWxlYXNlV2FrZUNsb2NrKCk7XG5cbiAgICBpZiAob3MgPT09ICdpb3MnKSB7XG4gICAgICBpZiAodGhpcy5fd2FrZUxvY2tUaW1lcikgcmV0dXJuO1xuXG4gICAgICB0aGlzLl93YWtlTG9ja1RpbWVyID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24gPSB3aW5kb3cubG9jYXRpb247XG4gICAgICAgIHNldFRpbWVvdXQod2luZG93LnN0b3AsIDApO1xuICAgICAgfSwgMzAwMDApO1xuICAgIH0gZWxzZSBpZiAob3MgPT09ICdhbmRyb2lkJykge1xuICAgICAgaWYgKHRoaXMuX3dha2VMb2NrVmlkZW8ucGF1c2VkID09PSBmYWxzZSkgcmV0dXJuO1xuXG4gICAgICB0aGlzLl93YWtlTG9ja1ZpZGVvLnNyYyA9IF9iYXNlNjQoJ3ZpZGVvL3dlYm0nLCAnR2tYZm93RUFBQUFBQUFBZlFvYUJBVUwzZ1FGQzhvRUVRdk9CQ0VLQ2hIZGxZbTFDaDRFQ1FvV0JBaGhUZ0djQkFBQUFBQUFDV3hGTm0zUkFMRTI3aTFPcmhCVkpxV1pUcklIZlRidU1VNnVFRmxTdWExT3NnZ0V1VGJ1TVU2dUVIRk83YTFPc2dnSSs3QUVBQUFBQUFBQ2tBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFWU2FsbUFRQUFBQUFBQUVNcTE3R0REMEpBVFlDTVRHRjJaalUyTGpRdU1UQXhWMEdNVEdGMlpqVTJMalF1TVRBeGM2U1EyMFl2L0Vsd3M3M0EvK0tmRWpNMTFFU0ppRUJrd0FBQUFBQUFGbFN1YXdFQUFBQUFBQUJIcmdFQUFBQUFBQUErMTRFQmM4V0JBWnlCQUNLMW5JTjFibVNHaFZaZlZsQTRnNEVCSStPRGhBVDNrTlhnQVFBQUFBQUFBQkt3Z1JDNmdSQlR3SUVCVkxDQkVGUzZnUkFmUTdaMUFRQUFBQUFBQUxIbmdRQ2dBUUFBQUFBQUFGeWhvNEVBQUlBUUFnQ2RBU29RQUJBQUFFY0loWVdJaFlTSUFnSUFEQTFnQVA3L3ExQ0FkYUVCQUFBQUFBQUFMYVlCQUFBQUFBQUFKTzZCQWFXZkVBSUFuUUVxRUFBUUFBQkhDSVdGaUlXRWlBSUNBQXdOWUFEKy83ci9RS0FCQUFBQUFBQUFRS0dWZ1FCVEFMRUJBQUVRRUFBWUFCaFlML1FBQ0FBQWRhRUJBQUFBQUFBQUg2WUJBQUFBQUFBQUZ1NkJBYVdSc1FFQUFSQVFBQmdBR0ZndjlBQUlBQUFjVTd0ckFRQUFBQUFBQUJHN2o3T0JBTGVLOTRFQjhZSUJnZkNCQXc9PScpO1xuICAgICAgdGhpcy5fd2FrZUxvY2tWaWRlby5wbGF5KCk7XG4gICAgfVxuICB9XG5cbiAgX3JlbGVhc2VXYWtlQ2xvY2soKSB7XG4gICAgY29uc3Qgb3MgPSBjbGllbnQucGxhdGZvcm0ub3M7XG5cbiAgICBpZiAob3MgPT09ICdpb3MnKSB7XG4gICAgICBpZiAodGhpcy5fd2FrZUxvY2tUaW1lcikge1xuICAgICAgICBjbGVhckludGVydmFsKHRoaXMuX3dha2VMb2NrVGltZXIpO1xuICAgICAgICB0aGlzLl93YWtlTG9ja1RpbWVyID0gbnVsbDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9zID09PSAnYW5kcm9pZCcpIHtcbiAgICAgIHRoaXMuX3dha2VMb2NrVmlkZW8ucGF1c2UoKTtcbiAgICAgIHRoaXMuX3dha2VMb2NrVmlkZW8uc3JjID0gJyc7XG4gICAgfVxuICB9XG59XG4iXX0=