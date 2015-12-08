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

/**
 * @private
 */
function _base64(format, base64) {
  return 'data:' + format + ';base64,' + base64;
}

/**
 * [client] Display a full screen dialog.
 *
 * The module requires the participant to tap the screen to make the view disappear.
 * The module is also used at the very beginning of a scenario to activate the Web Audio API on iOS devices (with the option `activateWebAudio`).
 *
 * The module always has a view.
 *
 * The module finishes its initialzation when the user taps the screen.
 *
 * @example
 * const welcomeDialog = new Dialog({
 *   name: 'welcome',
 *   text: 'Welcome to this awesome <i>Soundworks</i>-based application!',
 *   color: 'alizarin',
 *   activateWebAudio: true
 * });
 */

var Dialog = (function (_ClientModule) {
  _inherits(Dialog, _ClientModule);

  /**
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='dialog'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   * @param {String} [options.text='Hello!'] Text to be displayed in the `view`.
   * @param {Boolean} [options.activateAudio=false] Indicates whether the module activates the Web Audio API when the participant touches the screen (useful on iOS devices).
   * @param {Boolean} [options.wakeLock=false] Indicates whether the modules activates an ever-looping 1-pixel video to prevent the device from going idle.
   */

  function Dialog() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Dialog);

    _get(Object.getPrototypeOf(Dialog.prototype), 'constructor', this).call(this, options.name || 'dialog', true, options.color);

    this._mustActivateAudio = !!options.activateAudio;
    this._mustWakeLock = !!options.wakeLock;
    this._text = options.text || "Hello!";

    this._clickHandler = this._clickHandler.bind(this);
  }

  /**
   * @private
   */

  _createClass(Dialog, [{
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(Dialog.prototype), 'start', this).call(this);

      // Display text
      this.setCenteredViewContent(this._text);

      // Initialize video element for wakeLocking
      this._initWakeLock();

      // Add click listnener
      this.view.addEventListener('click', this._clickHandler);
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
  }, {
    key: '_clickHandler',
    value: function _clickHandler() {
      if (this._mustActivateAudio) this._activateAudio();

      if (this._mustWakeLock) this._requestWakeLock();

      this.view.removeEventListener('click', this._clickHandler);

      this.done();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzBCQUE2QixhQUFhOztzQkFDdkIsVUFBVTs7Ozs2QkFDSixnQkFBZ0I7Ozs7Ozs7QUFLekMsU0FBUyxPQUFPLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRTtBQUMvQixtQkFBZSxNQUFNLGdCQUFXLE1BQU0sQ0FBRztDQUMxQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBb0JvQixNQUFNO1lBQU4sTUFBTTs7Ozs7Ozs7Ozs7QUFTZCxXQVRRLE1BQU0sR0FTQztRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBVEwsTUFBTTs7QUFVdkIsK0JBVmlCLE1BQU0sNkNBVWpCLE9BQU8sQ0FBQyxJQUFJLElBQUksUUFBUSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsS0FBSyxFQUFFOztBQUVyRCxRQUFJLENBQUMsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7QUFDbEQsUUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztBQUN4QyxRQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxJQUFJLElBQUksUUFBUSxDQUFDOztBQUV0QyxRQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQ3BEOzs7Ozs7ZUFqQmtCLE1BQU07O1dBc0JwQixpQkFBRztBQUNOLGlDQXZCaUIsTUFBTSx1Q0F1QlQ7OztBQUdkLFVBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7OztBQUd4QyxVQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7OztBQUdyQixVQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7S0FDekQ7Ozs7Ozs7V0FLTSxtQkFB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aW1wb3J0IHsgYXVkaW9Db250ZXh0IH0gZnJvbSAnd2F2ZXMtYXVkaW8nO1xuaW1wb3J0IGNsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQgQ2xpZW50TW9kdWxlIGZyb20gJy4vQ2xpZW50TW9kdWxlJztcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBfYmFzZTY0KGZvcm1hdCwgYmFzZTY0KSB7XG4gIHJldHVybiBgZGF0YToke2Zvcm1hdH07YmFzZTY0LCR7YmFzZTY0fWA7XG59XG5cbi8qKlxuICogW2NsaWVudF0gRGlzcGxheSBhIGZ1bGwgc2NyZWVuIGRpYWxvZy5cbiAqXG4gKiBUaGUgbW9kdWxlIHJlcXVpcmVzIHRoZSBwYXJ0aWNpcGFudCB0byB0YXAgdGhlIHNjcmVlbiB0byBtYWtlIHRoZSB2aWV3IGRpc2FwcGVhci5cbiAqIFRoZSBtb2R1bGUgaXMgYWxzbyB1c2VkIGF0IHRoZSB2ZXJ5IGJlZ2lubmluZyBvZiBhIHNjZW5hcmlvIHRvIGFjdGl2YXRlIHRoZSBXZWIgQXVkaW8gQVBJIG9uIGlPUyBkZXZpY2VzICh3aXRoIHRoZSBvcHRpb24gYGFjdGl2YXRlV2ViQXVkaW9gKS5cbiAqXG4gKiBUaGUgbW9kdWxlIGFsd2F5cyBoYXMgYSB2aWV3LlxuICpcbiAqIFRoZSBtb2R1bGUgZmluaXNoZXMgaXRzIGluaXRpYWx6YXRpb24gd2hlbiB0aGUgdXNlciB0YXBzIHRoZSBzY3JlZW4uXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IHdlbGNvbWVEaWFsb2cgPSBuZXcgRGlhbG9nKHtcbiAqICAgbmFtZTogJ3dlbGNvbWUnLFxuICogICB0ZXh0OiAnV2VsY29tZSB0byB0aGlzIGF3ZXNvbWUgPGk+U291bmR3b3JrczwvaT4tYmFzZWQgYXBwbGljYXRpb24hJyxcbiAqICAgY29sb3I6ICdhbGl6YXJpbicsXG4gKiAgIGFjdGl2YXRlV2ViQXVkaW86IHRydWVcbiAqIH0pO1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEaWFsb2cgZXh0ZW5kcyBDbGllbnRNb2R1bGUge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0nZGlhbG9nJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuY29sb3I9J2JsYWNrJ10gQmFja2dyb3VuZCBjb2xvciBvZiB0aGUgYHZpZXdgLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMudGV4dD0nSGVsbG8hJ10gVGV4dCB0byBiZSBkaXNwbGF5ZWQgaW4gdGhlIGB2aWV3YC5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5hY3RpdmF0ZUF1ZGlvPWZhbHNlXSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgbW9kdWxlIGFjdGl2YXRlcyB0aGUgV2ViIEF1ZGlvIEFQSSB3aGVuIHRoZSBwYXJ0aWNpcGFudCB0b3VjaGVzIHRoZSBzY3JlZW4gKHVzZWZ1bCBvbiBpT1MgZGV2aWNlcykuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMud2FrZUxvY2s9ZmFsc2VdIEluZGljYXRlcyB3aGV0aGVyIHRoZSBtb2R1bGVzIGFjdGl2YXRlcyBhbiBldmVyLWxvb3BpbmcgMS1waXhlbCB2aWRlbyB0byBwcmV2ZW50IHRoZSBkZXZpY2UgZnJvbSBnb2luZyBpZGxlLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdkaWFsb2cnLCB0cnVlLCBvcHRpb25zLmNvbG9yKTtcblxuICAgIHRoaXMuX211c3RBY3RpdmF0ZUF1ZGlvID0gISFvcHRpb25zLmFjdGl2YXRlQXVkaW87XG4gICAgdGhpcy5fbXVzdFdha2VMb2NrID0gISFvcHRpb25zLndha2VMb2NrO1xuICAgIHRoaXMuX3RleHQgPSBvcHRpb25zLnRleHQgfHwgXCJIZWxsbyFcIjtcblxuICAgIHRoaXMuX2NsaWNrSGFuZGxlciA9IHRoaXMuX2NsaWNrSGFuZGxlci5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgLy8gRGlzcGxheSB0ZXh0XG4gICAgdGhpcy5zZXRDZW50ZXJlZFZpZXdDb250ZW50KHRoaXMuX3RleHQpO1xuXG4gICAgLy8gSW5pdGlhbGl6ZSB2aWRlbyBlbGVtZW50IGZvciB3YWtlTG9ja2luZ1xuICAgIHRoaXMuX2luaXRXYWtlTG9jaygpO1xuXG4gICAgLy8gQWRkIGNsaWNrIGxpc3RuZW5lclxuICAgIHRoaXMudmlldy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX2NsaWNrSGFuZGxlcik7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlc3RhcnQoKSB7XG4gICAgc3VwZXIucmVzdGFydCgpO1xuICAgIHRoaXMuZG9uZSgpO1xuICB9XG5cbiAgX2FjdGl2YXRlQXVkaW8oKSB7XG4gICAgdmFyIG8gPSBhdWRpb0NvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xuICAgIHZhciBnID0gYXVkaW9Db250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgICBnLmdhaW4udmFsdWUgPSAwO1xuICAgIG8uY29ubmVjdChnKTtcbiAgICBnLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcbiAgICBvLnN0YXJ0KDApO1xuICAgIG8uc3RvcChhdWRpb0NvbnRleHQuY3VycmVudFRpbWUgKyAwLjAxKTtcbiAgfVxuXG4gIF9jbGlja0hhbmRsZXIoKSB7XG4gICAgaWYgKHRoaXMuX211c3RBY3RpdmF0ZUF1ZGlvKVxuICAgICAgdGhpcy5fYWN0aXZhdGVBdWRpbygpO1xuXG4gICAgaWYgKHRoaXMuX211c3RXYWtlTG9jaylcbiAgICAgIHRoaXMuX3JlcXVlc3RXYWtlTG9jaygpO1xuXG4gICAgdGhpcy52aWV3LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fY2xpY2tIYW5kbGVyKTtcblxuICAgIHRoaXMuZG9uZSgpO1xuICB9XG5cbiAgLy8gY2YuIGh0dHBzOi8vZ2l0aHViLmNvbS9ib3Jpc211cy93ZWJ2ci1ib2lsZXJwbGF0ZS9ibG9iLzhhYmJjNzRjZmE1OTc2YjlhYjBjMzg4Y2IwYzUxOTQ0MDA4YzY5ODkvanMvd2VidnItbWFuYWdlci5qcyNMMjY4LUwyODlcbiAgX2luaXRXYWtlTG9jaygpIHtcbiAgICB0aGlzLl93YWtlTG9ja1ZpZGVvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndmlkZW8nKTtcblxuICAgIHRoaXMuX3dha2VMb2NrVmlkZW8uYWRkRXZlbnRMaXN0ZW5lcignZW5kZWQnLCAoKSA9PiB7XG4gICAgICB0aGlzLl93YWtlTG9ja1ZpZGVvLnBsYXkoKTtcbiAgICB9KTtcbiAgfVxuXG4gIF9yZXF1ZXN0V2FrZUxvY2soKSB7XG4gICAgY29uc3Qgb3MgPSBjbGllbnQucGxhdGZvcm0ub3M7XG4gICAgdGhpcy5fcmVsZWFzZVdha2VDbG9jaygpO1xuXG4gICAgaWYgKG9zID09PSAnaW9zJykge1xuICAgICAgaWYgKHRoaXMuX3dha2VMb2NrVGltZXIpIHJldHVybjtcblxuICAgICAgdGhpcy5fd2FrZUxvY2tUaW1lciA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uID0gd2luZG93LmxvY2F0aW9uO1xuICAgICAgICBzZXRUaW1lb3V0KHdpbmRvdy5zdG9wLCAwKTtcbiAgICAgIH0sIDMwMDAwKTtcbiAgICB9IGVsc2UgaWYgKG9zID09PSAnYW5kcm9pZCcpIHtcbiAgICAgIGlmICh0aGlzLl93YWtlTG9ja1ZpZGVvLnBhdXNlZCA9PT0gZmFsc2UpIHJldHVybjtcblxuICAgICAgdGhpcy5fd2FrZUxvY2tWaWRlby5zcmMgPSBfYmFzZTY0KCd2aWRlby93ZWJtJywgJ0drWGZvd0VBQUFBQUFBQWZRb2FCQVVMM2dRRkM4b0VFUXZPQkNFS0NoSGRsWW0xQ2g0RUNRb1dCQWhoVGdHY0JBQUFBQUFBQ1d4Rk5tM1JBTEUyN2kxT3JoQlZKcVdaVHJJSGZUYnVNVTZ1RUZsU3VhMU9zZ2dFdVRidU1VNnVFSEZPN2ExT3NnZ0krN0FFQUFBQUFBQUNrQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBVlNhbG1BUUFBQUFBQUFFTXExN0dERDBKQVRZQ01UR0YyWmpVMkxqUXVNVEF4VjBHTVRHRjJaalUyTGpRdU1UQXhjNlNRMjBZdi9FbHdzNzNBLytLZkVqTTExRVNKaUVCa3dBQUFBQUFBRmxTdWF3RUFBQUFBQUFCSHJnRUFBQUFBQUFBKzE0RUJjOFdCQVp5QkFDSzFuSU4xYm1TR2hWWmZWbEE0ZzRFQkkrT0RoQVQza05YZ0FRQUFBQUFBQUJLd2dSQzZnUkJUd0lFQlZMQ0JFRlM2Z1JBZlE3WjFBUUFBQUFBQUFMSG5nUUNnQVFBQUFBQUFBRnlobzRFQUFJQVFBZ0NkQVNvUUFCQUFBRWNJaFlXSWhZU0lBZ0lBREExZ0FQNy9xMUNBZGFFQkFBQUFBQUFBTGFZQkFBQUFBQUFBSk82QkFhV2ZFQUlBblFFcUVBQVFBQUJIQ0lXRmlJV0VpQUlDQUF3TllBRCsvN3IvUUtBQkFBQUFBQUFBUUtHVmdRQlRBTEVCQUFFUUVBQVlBQmhZTC9RQUNBQUFkYUVCQUFBQUFBQUFINllCQUFBQUFBQUFGdTZCQWFXUnNRRUFBUkFRQUJnQUdGZ3Y5QUFJQUFBY1U3dHJBUUFBQUFBQUFCRzdqN09CQUxlSzk0RUI4WUlCZ2ZDQkF3PT0nKTtcbiAgICAgIHRoaXMuX3dha2VMb2NrVmlkZW8ucGxheSgpO1xuICAgIH1cbiAgfVxuXG4gIF9yZWxlYXNlV2FrZUNsb2NrKCkge1xuICAgIGNvbnN0IG9zID0gY2xpZW50LnBsYXRmb3JtLm9zO1xuXG4gICAgaWYgKG9zID09PSAnaW9zJykge1xuICAgICAgaWYgKHRoaXMuX3dha2VMb2NrVGltZXIpIHtcbiAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLl93YWtlTG9ja1RpbWVyKTtcbiAgICAgICAgdGhpcy5fd2FrZUxvY2tUaW1lciA9IG51bGw7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChvcyA9PT0gJ2FuZHJvaWQnKSB7XG4gICAgICB0aGlzLl93YWtlTG9ja1ZpZGVvLnBhdXNlKCk7XG4gICAgICB0aGlzLl93YWtlTG9ja1ZpZGVvLnNyYyA9ICcnO1xuICAgIH1cbiAgfVxufVxuIl19