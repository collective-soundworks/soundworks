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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvV2VsY29tZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzBCQUE2QixhQUFhOztzQkFDdkIsVUFBVTs7Ozs2QkFDSixnQkFBZ0I7Ozs7Ozt3QkFFcEIsVUFBVTs7Ozs0QkFDTixlQUFlOzs7Ozs7O0FBTXhDLFNBQVMsT0FBTyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUU7QUFDL0IsbUJBQWUsTUFBTSxnQkFBVyxNQUFNLENBQUc7Q0FDMUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFxQm9CLE1BQU07WUFBTixNQUFNOzs7Ozs7Ozs7O0FBUWQsV0FSUSxNQUFNLEdBUUM7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQVJMLE1BQU07O0FBU3ZCLCtCQVRpQixNQUFNLDZDQVNqQixPQUFPLENBQUMsSUFBSSxJQUFJLFNBQVMsRUFBRSxPQUFPLEVBQUU7O0FBRTFDLFFBQUksQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFDLGFBQWEsS0FBSyxLQUFLLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNyRSxRQUFJLENBQUMsa0JBQWtCLEdBQUcsT0FBTyxDQUFDLGFBQWEsS0FBSyxLQUFLLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQztBQUN6RSxRQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDOzs7QUFHeEMsUUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7QUFDakMsUUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDOzs7QUFHdkIsUUFBTSxFQUFFLEdBQUcsb0JBQU8sUUFBUSxDQUFDLEVBQUUsQ0FBQztBQUM5QixRQUFNLE9BQU8sR0FBRyxVQUFVLENBQUMsc0JBQVMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2hELFFBQU0sUUFBUSxHQUFHLG9CQUFPLFFBQVEsQ0FBQyxRQUFRLENBQUM7QUFDMUMsUUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQztBQUMxQyxR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QUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUM1QixZQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7T0FDOUI7S0FDRjs7O1NBeEtrQixNQUFNOzs7cUJBQU4sTUFBTSIsImZpbGUiOiJzcmMvY2xpZW50L1dlbGNvbWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhdWRpb0NvbnRleHQgfSBmcm9tICd3YXZlcy1hdWRpbyc7XG5pbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCBDbGllbnRNb2R1bGUgZnJvbSAnLi9DbGllbnRNb2R1bGUnO1xuLy8gQHRvZG8gLSBwcm9ibGVtIG9mIHJlZG9uZGFudCBkZXBlbmRlbmN5XG5pbXBvcnQgcGxhdGZvcm0gZnJvbSAncGxhdGZvcm0nO1xuaW1wb3J0IE1vYmlsZURldGVjdCBmcm9tICdtb2JpbGUtZGV0ZWN0JztcblxuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIF9iYXNlNjQoZm9ybWF0LCBiYXNlNjQpIHtcbiAgcmV0dXJuIGBkYXRhOiR7Zm9ybWF0fTtiYXNlNjQsJHtiYXNlNjR9YDtcbn1cblxuLyoqXG4gKiBbY2xpZW50XSBDaGVjayB3aGV0aGVyIHRoZSBkZXZpY2UgaXMgY29tcGF0aWJsZSB3aXRoIHRoZSB0ZWNobm9sb2dpZXMgdXNlZCBpbiB0aGUgKlNvdW5kd29ya3MqIGxpYnJhcnkuXG4gKiBUaGUgbW9kdWxlIHNob3VsZCB1c2VkIGF0IHRoZSB2ZXJ5IGJlZ2lubmluZyBvZiBhIHNjZW5hcmlvIHRvIGFjdGl2YXRlIHRoZSBXZWIgQXVkaW8gQVBJIG9uIGlPUyBkZXZpY2VzICh3aXRoIHRoZSBgYWN0aXZhdGVBdWRpb2Agb3B0aW9uKS5cbiAqXG4gKiBUaGUgbW9kdWxlIHJlcXVpcmVzIHRoZSBwYXJ0aWNpcGFudCB0byB0YXAgdGhlIHNjcmVlbiBpbiBvcmRlciB0byBpbml0aWFsaXplIHRoZSB3ZWJBdWRpbyBvbiBpT1MgZGV2aWNlcyBhbmQgdG8gbWFrZSB0aGUgdmlldyBkaXNhcHBlYXIuXG4gKlxuICogQ29tcGF0aWJsZSBkZXZpY2VzIGFyZSBydW5uaW5nIG9uIGlPUyA3IG9yIGFib3ZlLCBvciBvbiBBbmRyb2lkIDQuMiBvciBhYm92ZSB3aXRoIHRoZSBDaHJvbWUgYnJvd3NlciBpbiB2ZXJzaW9uIDM1IG9yIGFib3ZlLlxuICogSWYgdGhhdCBpcyBub3QgdGhlIGNhc2UsIHRoZSBtb2R1bGUgZGlzcGxheXMgYSBibG9ja2luZyBgdmlld2AgYW5kIHByZXZlbnRzIHRoZSBwYXJ0aWNpcGFudCB0byBnbyBhbnkgZnVydGhlciBpbiB0aGUgc2NlbmFyaW8uXG4gKlxuICogVGhlIG1vZHVsZSBmaW5pc2hlcyBpdHMgaW5pdGlhbGl6YXRpb24gd2hlbiB0aGUgdXNlciB0b3VjaGVzIHRoZSBzY3JlZW4gaWYgdGhlIGRldmljZSBwYXNzZXMgdGhlIHBsYXRmb3JtIHRlc3QsIGFuZCBuZXZlciBvdGhlcndpc2UuXG4gKlxuICogVGhlIG1vZHVsZSBhbHdheXMgaGFzIGEgdmlldy5cbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3Qgd2VsY29tZURpYWxvZyA9IG5ldyBEaWFsb2coe1xuICogICBuYW1lOiAnd2VsY29tZScsXG4gKiAgIGFjdGl2YXRlQXVkaW86IHRydWVcbiAqIH0pO1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEaWFsb2cgZXh0ZW5kcyBDbGllbnRNb2R1bGUge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSAtIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSd3ZWxjb21lJ10gLSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuYWN0aXZhdGVBdWRpbz10cnVlXSAtIEluZGljYXRlcyB3aGV0aGVyIHRoZSBtb2R1bGUgYWN0aXZhdGVzIHRoZSBXZWIgQXVkaW8gQVBJIHdoZW4gdGhlIHBhcnRpY2lwYW50IHRvdWNoZXMgdGhlIHNjcmVlbiAodXNlZnVsIG9uIGlPUyBkZXZpY2VzKS5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5yZXF1aXJlTW9iaWxlPXRydWVdIC0gRGVmaW5lcyBpZiB0aGUgYXBwbGljYXRpb24gcmVxdWlyZXMgdGhlIHVzZSBvZiBhIG1vYmlsZSBkZXZpY2UuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMud2FrZUxvY2s9ZmFsc2VdIC0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIG1vZHVsZXMgYWN0aXZhdGVzIGFuIGV2ZXItbG9vcGluZyAxLXBpeGVsIHZpZGVvIHRvIHByZXZlbnQgdGhlIGRldmljZSBmcm9tIGdvaW5nIGlkbGUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ3dlbGNvbWUnLCBvcHRpb25zKTtcblxuICAgIHRoaXMuX3JlcXVpcmVNb2JpbGUgPSBvcHRpb25zLnJlcXVpcmVNb2JpbGUgPT09IGZhbHNlID8gZmFsc2UgOiB0cnVlO1xuICAgIHRoaXMuX211c3RBY3RpdmF0ZUF1ZGlvID0gb3B0aW9ucy5hY3RpdmF0ZUF1ZGlvID09PSBmYWxzZSA/IGZhbHNlIDogdHJ1ZTtcbiAgICB0aGlzLl9tdXN0V2FrZUxvY2sgPSAhIW9wdGlvbnMud2FrZUxvY2s7XG5cbiAgICAvLyBjaGVjayBwbGF0Zm9ybVxuICAgIHRoaXMuX2RlZmluZUF1ZGlvRmlsZUV4dGVudGlvbigpO1xuICAgIHRoaXMuX2RlZmluZVBsYXRmb3JtKCk7XG5cbiAgICAvLyBhbmQgYnVpbGQgdmlldyBhY2NvcmRpbmcgdG8gdGhlIGRldmljZSBhbmQgcmVxdWlyZW1lbnRzXG4gICAgY29uc3Qgb3MgPSBjbGllbnQucGxhdGZvcm0ub3M7XG4gICAgY29uc3QgdmVyc2lvbiA9IHBhcnNlRmxvYXQocGxhdGZvcm0ub3MudmVyc2lvbik7XG4gICAgY29uc3QgaXNNb2JpbGUgPSBjbGllbnQucGxhdGZvcm0uaXNNb2JpbGU7XG4gICAgY29uc3QgcmVxdWlyZU1vYmlsZSA9IHRoaXMuX3JlcXVpcmVNb2JpbGU7XG4gICAgbGV0IGVycm9yID0gbnVsbDtcblxuICAgIGlmICghdGhpcy5fc3VwcG9ydHNXZWJBdWRpbygpKSB7XG4gICAgICBpZiAob3MgPT09ICdpb3MnKSB7XG4gICAgICAgIGVycm9yID0gdGhpcy5jb250ZW50LmVycm9ySW9zVmVyc2lvbjtcbiAgICAgIH0gZWxzZSBpZiAob3MgPT09ICdhbmRyb2lkJykge1xuICAgICAgICBlcnJvciA9IHRoaXMuY29udGVudC5lcnJvckFuZHJvaWRWZXJzaW9uO1xuICAgICAgfSBlbHNlIGlmIChyZXF1aXJlTW9iaWxlKSB7XG4gICAgICAgIGVycm9yID0gdGhpcy5jb250ZW50LmVycm9yUmVxdWlyZU1vYmlsZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVycm9yID0gdGhpcy5jb250ZW50LmVycm9yRGVmYXVsdDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHJlcXVpcmVNb2JpbGUgJiYgKCFpc01vYmlsZSB8fCBvcyA9PT0gJ290aGVyJykpIHtcbiAgICAgIGVycm9yID0gdGhpcy5jb250ZW50LmVycm9yUmVxdWlyZU1vYmlsZTtcbiAgICB9IGVsc2UgaWYgKG9zID09PSAnaW9zJyAmJiB2ZXJzaW9uIDwgNykge1xuICAgICAgZXJyb3IgPSB0aGlzLmNvbnRlbnQuZXJyb3JJb3NWZXJzaW9uO1xuICAgIH0gZWxzZSBpZiAob3MgPT09ICdhbmRyb2lkJyAmJiB2ZXJzaW9uIDwgNC4yKSB7XG4gICAgICBlcnJvciA9IHRoaXMuY29udGVudC5lcnJvckFuZHJvaWRWZXJzaW9uO1xuICAgIH1cblxuICAgIHRoaXMuY29udGVudC5lcnJvciA9IGVycm9yO1xuXG4gICAgaWYgKCFlcnJvcikge1xuICAgICAgdGhpcy5ldmVudHMgPSB7ICdjbGljayc6IHRoaXMuX29uQ2xpY2suYmluZCh0aGlzKSB9O1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnZpZXcpIHtcbiAgICAgIHRoaXMudmlldyA9IG9wdGlvbnMudmlldztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy52aWV3ID0gdGhpcy5jcmVhdGVEZWZhdWx0VmlldygpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgICAvLyBJbml0aWFsaXplIGhhY2tzIGZvciB3YWtlTG9ja2luZ1xuICAgIGlmICh0aGlzLl9tdXN0V2FrZUxvY2spIHsgdGhpcy5faW5pdFdha2VMb2NrKCk7IH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVzdGFydCgpIHtcbiAgICBzdXBlci5yZXN0YXJ0KCk7XG4gICAgdGhpcy5kb25lKCk7XG4gIH1cblxuICBfb25DbGljaygpIHtcbiAgICBpZiAodGhpcy5fbXVzdEFjdGl2YXRlQXVkaW8pXG4gICAgICB0aGlzLl9hY3RpdmF0ZUF1ZGlvKCk7XG5cbiAgICBpZiAodGhpcy5fbXVzdFdha2VMb2NrKVxuICAgICAgdGhpcy5fcmVxdWVzdFdha2VMb2NrKCk7XG5cbiAgICB0aGlzLmRvbmUoKTtcbiAgfVxuXG4gIF9zdXBwb3J0c1dlYkF1ZGlvKCkge1xuICAgIHJldHVybiAhIWF1ZGlvQ29udGV4dDtcbiAgfVxuXG4gIF9kZWZpbmVBdWRpb0ZpbGVFeHRlbnRpb24oKSB7XG4gICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2F1ZGlvJyk7XG4gICAgLy8gaHR0cDovL2RpdmVpbnRvaHRtbDUuaW5mby9ldmVyeXRoaW5nLmh0bWxcbiAgICBpZiAoISEoYS5jYW5QbGF5VHlwZSAmJiBhLmNhblBsYXlUeXBlKCdhdWRpby9tcGVnOycpKSkge1xuICAgICAgY2xpZW50LnBsYXRmb3JtLmF1ZGlvRmlsZUV4dCA9ICcubXAzJztcbiAgICB9IGVsc2UgaWYgKCEhKGEuY2FuUGxheVR5cGUgJiYgYS5jYW5QbGF5VHlwZSgnYXVkaW8vb2dnOyBjb2RlY3M9XCJ2b3JiaXNcIicpKSkge1xuICAgICAgY2xpZW50LnBsYXRmb3JtLmF1ZGlvRmlsZUV4dCA9ICcub2dnJztcbiAgICB9IGVsc2Uge1xuICAgICAgY2xpZW50LnBsYXRmb3JtLmF1ZGlvRmlsZUV4dCA9ICcud2F2JztcbiAgICB9XG4gIH1cblxuICBfZGVmaW5lUGxhdGZvcm0oKSB7XG4gICAgY29uc3QgdWEgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudFxuICAgIGNvbnN0IG1kID0gbmV3IE1vYmlsZURldGVjdCh1YSk7XG5cbiAgICBjbGllbnQucGxhdGZvcm0uaXNNb2JpbGUgPSAobWQubW9iaWxlKCkgIT09IG51bGwpOyAvLyB0cnVlIGlmIHBob25lIG9yIHRhYmxldFxuICAgIGNsaWVudC5wbGF0Zm9ybS5vcyA9IChmdW5jdGlvbigpIHtcbiAgICAgIGxldCBvcyA9IG1kLm9zKCk7XG5cbiAgICAgIGlmIChvcyA9PT0gJ0FuZHJvaWRPUycpIHtcbiAgICAgICAgcmV0dXJuICdhbmRyb2lkJztcbiAgICAgIH0gZWxzZSBpZiAob3MgPT09ICdpT1MnKSB7XG4gICAgICAgIHJldHVybiAnaW9zJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAnb3RoZXInO1xuICAgICAgfVxuICAgIH0pKCk7XG4gIH1cblxuICBfYWN0aXZhdGVBdWRpbygpIHtcbiAgICB2YXIgbyA9IGF1ZGlvQ29udGV4dC5jcmVhdGVPc2NpbGxhdG9yKCk7XG4gICAgdmFyIGcgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuICAgIGcuZ2Fpbi52YWx1ZSA9IDA7XG4gICAgby5jb25uZWN0KGcpO1xuICAgIGcuY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xuICAgIG8uc3RhcnQoMCk7XG4gICAgby5zdG9wKGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSArIDAuMDEpO1xuICB9XG5cbiAgLy8gY2YuIGh0dHBzOi8vZ2l0aHViLmNvbS9ib3Jpc211cy93ZWJ2ci1ib2lsZXJwbGF0ZS9ibG9iLzhhYmJjNzRjZmE1OTc2YjlhYjBjMzg4Y2IwYzUxOTQ0MDA4YzY5ODkvanMvd2VidnItbWFuYWdlci5qcyNMMjY4LUwyODlcbiAgX2luaXRXYWtlTG9jaygpIHtcbiAgICB0aGlzLl93YWtlTG9ja1ZpZGVvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndmlkZW8nKTtcblxuICAgIHRoaXMuX3dha2VMb2NrVmlkZW8uYWRkRXZlbnRMaXN0ZW5lcignZW5kZWQnLCAoKSA9PiB7XG4gICAgICB0aGlzLl93YWtlTG9ja1ZpZGVvLnBsYXkoKTtcbiAgICB9KTtcbiAgfVxuXG4gIF9yZXF1ZXN0V2FrZUxvY2soKSB7XG4gICAgY29uc3Qgb3MgPSBjbGllbnQucGxhdGZvcm0ub3M7XG4gICAgdGhpcy5fcmVsZWFzZVdha2VDbG9jaygpO1xuXG4gICAgaWYgKG9zID09PSAnaW9zJykge1xuICAgICAgaWYgKHRoaXMuX3dha2VMb2NrVGltZXIpIHJldHVybjtcblxuICAgICAgdGhpcy5fd2FrZUxvY2tUaW1lciA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uID0gd2luZG93LmxvY2F0aW9uO1xuICAgICAgICBzZXRUaW1lb3V0KHdpbmRvdy5zdG9wLCAwKTtcbiAgICAgIH0sIDMwMDAwKTtcbiAgICB9IGVsc2UgaWYgKG9zID09PSAnYW5kcm9pZCcpIHtcbiAgICAgIGlmICh0aGlzLl93YWtlTG9ja1ZpZGVvLnBhdXNlZCA9PT0gZmFsc2UpIHJldHVybjtcblxuICAgICAgdGhpcy5fd2FrZUxvY2tWaWRlby5zcmMgPSBfYmFzZTY0KCd2aWRlby93ZWJtJywgJ0drWGZvd0VBQUFBQUFBQWZRb2FCQVVMM2dRRkM4b0VFUXZPQkNFS0NoSGRsWW0xQ2g0RUNRb1dCQWhoVGdHY0JBQUFBQUFBQ1d4Rk5tM1JBTEUyN2kxT3JoQlZKcVdaVHJJSGZUYnVNVTZ1RUZsU3VhMU9zZ2dFdVRidU1VNnVFSEZPN2ExT3NnZ0krN0FFQUFBQUFBQUNrQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBVlNhbG1BUUFBQUFBQUFFTXExN0dERDBKQVRZQ01UR0YyWmpVMkxqUXVNVEF4VjBHTVRHRjJaalUyTGpRdU1UQXhjNlNRMjBZdi9FbHdzNzNBLytLZkVqTTExRVNKaUVCa3dBQUFBQUFBRmxTdWF3RUFBQUFBQUFCSHJnRUFBQUFBQUFBKzE0RUJjOFdCQVp5QkFDSzFuSU4xYm1TR2hWWmZWbEE0ZzRFQkkrT0RoQVQza05YZ0FRQUFBQUFBQUJLd2dSQzZnUkJUd0lFQlZMQ0JFRlM2Z1JBZlE3WjFBUUFBQUFBQUFMSG5nUUNnQVFBQUFBQUFBRnlobzRFQUFJQVFBZ0NkQVNvUUFCQUFBRWNJaFlXSWhZU0lBZ0lBREExZ0FQNy9xMUNBZGFFQkFBQUFBQUFBTGFZQkFBQUFBQUFBSk82QkFhV2ZFQUlBblFFcUVBQVFBQUJIQ0lXRmlJV0VpQUlDQUF3TllBRCsvN3IvUUtBQkFBQUFBQUFBUUtHVmdRQlRBTEVCQUFFUUVBQVlBQmhZTC9RQUNBQUFkYUVCQUFBQUFBQUFINllCQUFBQUFBQUFGdTZCQWFXUnNRRUFBUkFRQUJnQUdGZ3Y5QUFJQUFBY1U3dHJBUUFBQUFBQUFCRzdqN09CQUxlSzk0RUI4WUlCZ2ZDQkF3PT0nKTtcbiAgICAgIHRoaXMuX3dha2VMb2NrVmlkZW8ucGxheSgpO1xuICAgIH1cbiAgfVxuXG4gIF9yZWxlYXNlV2FrZUNsb2NrKCkge1xuICAgIGNvbnN0IG9zID0gY2xpZW50LnBsYXRmb3JtLm9zO1xuXG4gICAgaWYgKG9zID09PSAnaW9zJykge1xuICAgICAgaWYgKHRoaXMuX3dha2VMb2NrVGltZXIpIHtcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLl93YWtlTG9ja1RpbWVyKTtcbiAgICAgICAgdGhpcy5fd2FrZUxvY2tUaW1lciA9IG51bGw7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChvcyA9PT0gJ2FuZHJvaWQnKSB7XG4gICAgICB0aGlzLl93YWtlTG9ja1ZpZGVvLnBhdXNlKCk7XG4gICAgICB0aGlzLl93YWtlTG9ja1ZpZGVvLnNyYyA9ICcnO1xuICAgIH1cbiAgfVxufVxuIl19