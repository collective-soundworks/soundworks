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

var _Module2 = require('./Module');

var _Module3 = _interopRequireDefault(_Module2);

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
 * const welcomeDialog = new ClientDialog({
 *   name: 'welcome',
 *   text: 'Welcome to this awesome scenario!',
 *   color: 'alizarin',
 *   activateWebAudio: true
 * });
 */

var Dialog = (function (_Module) {
  _inherits(Dialog, _Module);

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
})(_Module3['default']);

exports['default'] = Dialog;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvRGlhbG9nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7MEJBQTZCLGFBQWE7O3NCQUN2QixVQUFVOzs7O3VCQUNWLFVBQVU7Ozs7Ozs7QUFLN0IsU0FBUyxPQUFPLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRTtBQUMvQixtQkFBZSxNQUFNLGdCQUFXLE1BQU0sQ0FBRztDQUMxQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBb0JvQixNQUFNO1lBQU4sTUFBTTs7Ozs7Ozs7Ozs7QUFTZCxXQVRRLE1BQU0sR0FTQztRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBVEwsTUFBTTs7QUFVdkIsK0JBVmlCLE1BQU0sNkNBVWpCLE9BQU8sQ0FBQyxJQUFJLElBQUksUUFBUSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsS0FBSyxFQUFFOztBQUVyRCxRQUFJLENBQUMsa0JBQWtCLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7QUFDbEQsUUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQztBQUN4QyxRQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxJQUFJLElBQUksUUFBUSxDQUFDOztBQUV0QyxRQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQ3BEOzs7Ozs7ZUFqQmtCLE1BQU07O1dBc0JwQixpQkFBRztBQUNOLGlDQXZCaUIsTUFBTSx1Q0F1QlQ7OztBQUdkLFVBQUksQ0FBQyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7OztBQUd4QyxVQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7OztBQUdyQixVQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7S0FDekQ7Ozs7Ozs7V0FLTSxtQkFBRztBQUNSLGlD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bnRleHQgfSBmcm9tICd3YXZlcy1hdWRpbyc7XG5pbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCBNb2R1bGUgZnJvbSAnLi9Nb2R1bGUnO1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIF9iYXNlNjQoZm9ybWF0LCBiYXNlNjQpIHtcbiAgcmV0dXJuIGBkYXRhOiR7Zm9ybWF0fTtiYXNlNjQsJHtiYXNlNjR9YDtcbn1cblxuLyoqXG4gKiBbY2xpZW50XSBEaXNwbGF5IGEgZnVsbCBzY3JlZW4gZGlhbG9nLlxuICpcbiAqIFRoZSBtb2R1bGUgcmVxdWlyZXMgdGhlIHBhcnRpY2lwYW50IHRvIHRhcCB0aGUgc2NyZWVuIHRvIG1ha2UgdGhlIHZpZXcgZGlzYXBwZWFyLlxuICogVGhlIG1vZHVsZSBpcyBhbHNvIHVzZWQgYXQgdGhlIHZlcnkgYmVnaW5uaW5nIG9mIGEgc2NlbmFyaW8gdG8gYWN0aXZhdGUgdGhlIFdlYiBBdWRpbyBBUEkgb24gaU9TIGRldmljZXMgKHdpdGggdGhlIG9wdGlvbiBgYWN0aXZhdGVXZWJBdWRpb2ApLlxuICpcbiAqIFRoZSBtb2R1bGUgYWx3YXlzIGhhcyBhIHZpZXcuXG4gKlxuICogVGhlIG1vZHVsZSBmaW5pc2hlcyBpdHMgaW5pdGlhbHphdGlvbiB3aGVuIHRoZSB1c2VyIHRhcHMgdGhlIHNjcmVlbi5cbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3Qgd2VsY29tZURpYWxvZyA9IG5ldyBDbGllbnREaWFsb2coe1xuICogICBuYW1lOiAnd2VsY29tZScsXG4gKiAgIHRleHQ6ICdXZWxjb21lIHRvIHRoaXMgYXdlc29tZSBzY2VuYXJpbyEnLFxuICogICBjb2xvcjogJ2FsaXphcmluJyxcbiAqICAgYWN0aXZhdGVXZWJBdWRpbzogdHJ1ZVxuICogfSk7XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERpYWxvZyBleHRlbmRzIE1vZHVsZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdkaWFsb2cnXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5jb2xvcj0nYmxhY2snXSBCYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSBgdmlld2AuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy50ZXh0PSdIZWxsbyEnXSBUZXh0IHRvIGJlIGRpc3BsYXllZCBpbiB0aGUgYHZpZXdgLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmFjdGl2YXRlQXVkaW89ZmFsc2VdIEluZGljYXRlcyB3aGV0aGVyIHRoZSBtb2R1bGUgYWN0aXZhdGVzIHRoZSBXZWIgQXVkaW8gQVBJIHdoZW4gdGhlIHBhcnRpY2lwYW50IHRvdWNoZXMgdGhlIHNjcmVlbiAodXNlZnVsIG9uIGlPUyBkZXZpY2VzKS5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy53YWtlTG9jaz1mYWxzZV0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIG1vZHVsZXMgYWN0aXZhdGVzIGFuIGV2ZXItbG9vcGluZyAxLXBpeGVsIHZpZGVvIHRvIHByZXZlbnQgdGhlIGRldmljZSBmcm9tIGdvaW5nIGlkbGUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ2RpYWxvZycsIHRydWUsIG9wdGlvbnMuY29sb3IpO1xuXG4gICAgdGhpcy5fbXVzdEFjdGl2YXRlQXVkaW8gPSAhIW9wdGlvbnMuYWN0aXZhdGVBdWRpbztcbiAgICB0aGlzLl9tdXN0V2FrZUxvY2sgPSAhIW9wdGlvbnMud2FrZUxvY2s7XG4gICAgdGhpcy5fdGV4dCA9IG9wdGlvbnMudGV4dCB8fCBcIkhlbGxvIVwiO1xuXG4gICAgdGhpcy5fY2xpY2tIYW5kbGVyID0gdGhpcy5fY2xpY2tIYW5kbGVyLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICAvLyBEaXNwbGF5IHRleHRcbiAgICB0aGlzLnNldENlbnRlcmVkVmlld0NvbnRlbnQodGhpcy5fdGV4dCk7XG5cbiAgICAvLyBJbml0aWFsaXplIHZpZGVvIGVsZW1lbnQgZm9yIHdha2VMb2NraW5nXG4gICAgdGhpcy5faW5pdFdha2VMb2NrKCk7XG5cbiAgICAvLyBBZGQgY2xpY2sgbGlzdG5lbmVyXG4gICAgdGhpcy52aWV3LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fY2xpY2tIYW5kbGVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVzdGFydCgpIHtcbiAgICBzdXBlci5yZXN0YXJ0KCk7XG4gICAgdGhpcy5kb25lKCk7XG4gIH1cblxuICBfYWN0aXZhdGVBdWRpbygpIHtcbiAgICB2YXIgbyA9IGF1ZGlvQ29udGV4dC5jcmVhdGVPc2NpbGxhdG9yKCk7XG4gICAgdmFyIGcgPSBhdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuICAgIGcuZ2Fpbi52YWx1ZSA9IDA7XG4gICAgby5jb25uZWN0KGcpO1xuICAgIGcuY29ubmVjdChhdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xuICAgIG8uc3RhcnQoMCk7XG4gICAgby5zdG9wKGF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSArIDAuMDEpO1xuICB9XG5cbiAgX2NsaWNrSGFuZGxlcigpIHtcbiAgICBpZiAodGhpcy5fbXVzdEFjdGl2YXRlQXVkaW8pXG4gICAgICB0aGlzLl9hY3RpdmF0ZUF1ZGlvKCk7XG5cbiAgICBpZiAodGhpcy5fbXVzdFdha2VMb2NrKVxuICAgICAgdGhpcy5fcmVxdWVzdFdha2VMb2NrKCk7XG5cbiAgICB0aGlzLnZpZXcucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl9jbGlja0hhbmRsZXIpO1xuXG4gICAgdGhpcy5kb25lKCk7XG4gIH1cblxuICAvLyBjZi4gaHR0cHM6Ly9naXRodWIuY29tL2JvcmlzbXVzL3dlYnZyLWJvaWxlcnBsYXRlL2Jsb2IvOGFiYmM3NGNmYTU5NzZiOWFiMGMzODhjYjBjNTE5NDQwMDhjNjk4OS9qcy93ZWJ2ci1tYW5hZ2VyLmpzI0wyNjgtTDI4OVxuICBfaW5pdFdha2VMb2NrKCkge1xuICAgIHRoaXMuX3dha2VMb2NrVmlkZW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd2aWRlbycpO1xuXG4gICAgdGhpcy5fd2FrZUxvY2tWaWRlby5hZGRFdmVudExpc3RlbmVyKCdlbmRlZCcsICgpID0+IHtcbiAgICAgIHRoaXMuX3dha2VMb2NrVmlkZW8ucGxheSgpO1xuICAgIH0pO1xuICB9XG5cbiAgX3JlcXVlc3RXYWtlTG9jaygpIHtcbiAgICBjb25zdCBvcyA9IGNsaWVudC5wbGF0Zm9ybS5vcztcbiAgICB0aGlzLl9yZWxlYXNlV2FrZUNsb2NrKCk7XG5cbiAgICBpZiAob3MgPT09ICdpb3MnKSB7XG4gICAgICBpZiAodGhpcy5fd2FrZUxvY2tUaW1lcikgcmV0dXJuO1xuXG4gICAgICB0aGlzLl93YWtlTG9ja1RpbWVyID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24gPSB3aW5kb3cubG9jYXRpb247XG4gICAgICAgIHNldFRpbWVvdXQod2luZG93LnN0b3AsIDApO1xuICAgICAgfSwgMzAwMDApO1xuICAgIH0gZWxzZSBpZiAob3MgPT09ICdhbmRyb2lkJykge1xuICAgICAgaWYgKHRoaXMuX3dha2VMb2NrVmlkZW8ucGF1c2VkID09PSBmYWxzZSkgcmV0dXJuO1xuXG4gICAgICB0aGlzLl93YWtlTG9ja1ZpZGVvLnNyYyA9IF9iYXNlNjQoJ3ZpZGVvL3dlYm0nLCAnR2tYZm93RUFBQUFBQUFBZlFvYUJBVUwzZ1FGQzhvRUVRdk9CQ0VLQ2hIZGxZbTFDaDRFQ1FvV0JBaGhUZ0djQkFBQUFBQUFDV3hGTm0zUkFMRTI3aTFPcmhCVkpxV1pUcklIZlRidU1VNnVFRmxTdWExT3NnZ0V1VGJ1TVU2dUVIRk83YTFPc2dnSSs3QUVBQUFBQUFBQ2tBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFWU2FsbUFRQUFBQUFBQUVNcTE3R0REMEpBVFlDTVRHRjJaalUyTGpRdU1UQXhWMEdNVEdGMlpqVTJMalF1TVRBeGM2U1EyMFl2L0Vsd3M3M0EvK0tmRWpNMTFFU0ppRUJrd0FBQUFBQUFGbFN1YXdFQUFBQUFBQUJIcmdFQUFBQUFBQUErMTRFQmM4V0JBWnlCQUNLMW5JTjFibVNHaFZaZlZsQTRnNEVCSStPRGhBVDNrTlhnQVFBQUFBQUFBQkt3Z1JDNmdSQlR3SUVCVkxDQkVGUzZnUkFmUTdaMUFRQUFBQUFBQUxIbmdRQ2dBUUFBQUFBQUFGeWhvNEVBQUlBUUFnQ2RBU29RQUJBQUFFY0loWVdJaFlTSUFnSUFEQTFnQVA3L3ExQ0FkYUVCQUFBQUFBQUFMYVlCQUFBQUFBQUFKTzZCQWFXZkVBSUFuUUVxRUFBUUFBQkhDSVdGaUlXRWlBSUNBQXdOWUFEKy83ci9RS0FCQUFBQUFBQUFRS0dWZ1FCVEFMRUJBQUVRRUFBWUFCaFlML1FBQ0FBQWRhRUJBQUFBQUFBQUg2WUJBQUFBQUFBQUZ1NkJBYVdSc1FFQUFSQVFBQmdBR0ZndjlBQUlBQUFjVTd0ckFRQUFBQUFBQUJHN2o3T0JBTGVLOTRFQjhZSUJnZkNCQXc9PScpO1xuICAgICAgdGhpcy5fd2FrZUxvY2tWaWRlby5wbGF5KCk7XG4gICAgfVxuICB9XG5cbiAgX3JlbGVhc2VXYWtlQ2xvY2soKSB7XG4gICAgY29uc3Qgb3MgPSBjbGllbnQucGxhdGZvcm0ub3M7XG5cbiAgICBpZiAob3MgPT09ICdpb3MnKSB7XG4gICAgICBpZiAodGhpcy5fd2FrZUxvY2tUaW1lcikge1xuICAgICAgICBjbGVhckludGVydmFsKHRoaXMuX3dha2VMb2NrVGltZXIpO1xuICAgICAgICB0aGlzLl93YWtlTG9ja1RpbWVyID0gbnVsbDtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9zID09PSAnYW5kcm9pZCcpIHtcbiAgICAgIHRoaXMuX3dha2VMb2NrVmlkZW8ucGF1c2UoKTtcbiAgICAgIHRoaXMuX3dha2VMb2NrVmlkZW8uc3JjID0gJyc7XG4gICAgfVxuICB9XG59XG4iXX0=