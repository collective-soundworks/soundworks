import { audioContext } from 'waves-audio';
import client from './client';
import Module from './Module';

/**
 * @private
 */
function _base64(format, base64) {
  return `data:${format};base64,${base64}`;
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
 *   text: 'Welcome to this awesome <i>Soundworks</i>-based application!',
 *   color: 'alizarin',
 *   activateWebAudio: true
 * });
 */
export default class Dialog extends Module {
  /**
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='dialog'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   * @param {String} [options.text='Hello!'] Text to be displayed in the `view`.
   * @param {Boolean} [options.activateAudio=false] Indicates whether the module activates the Web Audio API when the participant touches the screen (useful on iOS devices).
   * @param {Boolean} [options.wakeLock=false] Indicates whether the modules activates an ever-looping 1-pixel video to prevent the device from going idle.
   */
  constructor(options = {}) {
    super(options.name || 'dialog', true, options.color);

    this._mustActivateAudio = !!options.activateAudio;
    this._mustWakeLock = !!options.wakeLock;
    this._text = options.text || "Hello!";

    this._clickHandler = this._clickHandler.bind(this);
  }

  /**
   * @private
   */
  start() {
    super.start();

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
  restart() {
    super.restart();
    this.done();
  }

  _activateAudio() {
    var o = audioContext.createOscillator();
    var g = audioContext.createGain();
    g.gain.value = 0;
    o.connect(g);
    g.connect(audioContext.destination);
    o.start(0);
    o.stop(audioContext.currentTime + 0.01);
  }

  _clickHandler() {
    if (this._mustActivateAudio)
      this._activateAudio();

    if (this._mustWakeLock)
      this._requestWakeLock();

    this.view.removeEventListener('click', this._clickHandler);

    this.done();
  }

  // cf. https://github.com/borismus/webvr-boilerplate/blob/8abbc74cfa5976b9ab0c388cb0c51944008c6989/js/webvr-manager.js#L268-L289
  _initWakeLock() {
    this._wakeLockVideo = document.createElement('video');

    this._wakeLockVideo.addEventListener('ended', () => {
      this._wakeLockVideo.play();
    });
  }

  _requestWakeLock() {
    const os = client.platform.os;
    this._releaseWakeClock();

    if (os === 'ios') {
      if (this._wakeLockTimer) return;

      this._wakeLockTimer = setInterval(() => {
        window.location = window.location;
        setTimeout(window.stop, 0);
      }, 30000);
    } else if (os === 'android') {
      if (this._wakeLockVideo.paused === false) return;

      this._wakeLockVideo.src = _base64('video/webm', 'GkXfowEAAAAAAAAfQoaBAUL3gQFC8oEEQvOBCEKChHdlYm1Ch4ECQoWBAhhTgGcBAAAAAAACWxFNm3RALE27i1OrhBVJqWZTrIHfTbuMU6uEFlSua1OsggEuTbuMU6uEHFO7a1OsggI+7AEAAAAAAACkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVSalmAQAAAAAAAEMq17GDD0JATYCMTGF2ZjU2LjQuMTAxV0GMTGF2ZjU2LjQuMTAxc6SQ20Yv/Elws73A/+KfEjM11ESJiEBkwAAAAAAAFlSuawEAAAAAAABHrgEAAAAAAAA+14EBc8WBAZyBACK1nIN1bmSGhVZfVlA4g4EBI+ODhAT3kNXgAQAAAAAAABKwgRC6gRBTwIEBVLCBEFS6gRAfQ7Z1AQAAAAAAALHngQCgAQAAAAAAAFyho4EAAIAQAgCdASoQABAAAEcIhYWIhYSIAgIADA1gAP7/q1CAdaEBAAAAAAAALaYBAAAAAAAAJO6BAaWfEAIAnQEqEAAQAABHCIWFiIWEiAICAAwNYAD+/7r/QKABAAAAAAAAQKGVgQBTALEBAAEQEAAYABhYL/QACAAAdaEBAAAAAAAAH6YBAAAAAAAAFu6BAaWRsQEAARAQABgAGFgv9AAIAAAcU7trAQAAAAAAABG7j7OBALeK94EB8YIBgfCBAw==');
      this._wakeLockVideo.play();
    }
  }

  _releaseWakeClock() {
    const os = client.platform.os;

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
}
