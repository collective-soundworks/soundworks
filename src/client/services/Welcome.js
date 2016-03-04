import { audioContext } from 'waves-audio';
import client from '../core/client';
import screenfull from 'screenfull';
import SegmentedView from '../display/SegmentedView';
import Service from '../core/Service';
import serviceManager from '../core/serviceManager';

// @todo - redondant dependencies
import MobileDetect from 'mobile-detect';
import platform from 'platform';

/**
 * @private
 */
function _base64(format, base64) {
  return `data:${format};base64,${base64}`;
}

const SERVICE_ID = 'service:welcome';

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
class Welcome extends Service {
  constructor() {
    super(SERVICE_ID, false);

    /**
     * @type {Object} [defaults={}] - Options.
     * @type {String} [defaults.name='welcome'] - Name of the module.
     * @type {Boolean} [defaults.activateAudio=true] - Indicates whether the module activates the Web Audio API when the participant touches the screen (useful on iOS devices).
     * @type {Boolean} [defaults.requireMobile=true] - Defines if the application requires the use of a mobile device.
     * @type {Boolean} [defaults.wakeLock=false] - Indicates whether the modules activates an ever-looping 1-pixel video to prevent the device from going idle.
     */
    const defaults = {
      requireMobile: true,
      activateAudio: true,
      fullScreen: false,
      wakeLock: false,
      showDialog: true,
      viewCtor: SegmentedView,
      viewPriority: 10,
    };

    this.configure(defaults);
    // check platform
    this._defineAudioFileExtention();
    this._definePlatform();
  }

  init() {
    // build view according to the device and requirements
    const os = client.platform.os;
    const version = parseFloat(platform.os.version);
    const isMobile = client.platform.isMobile;
    const requireMobile = this.options.requireMobile;
    const activateAudio = this.options.activateAudio;
    const content = this.content;
    let error = null;

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
    client.compatible = error === null ? true : false;

    if (this.options.showDialog) {
      if (!error) {
        const event = isMobile ? 'touchend' : 'click';
        this.events = { [event]: this.activateMedia.bind(this) };
      }

      this.viewCtor = this.options.viewCtor;
      this.view = this.createView();
    }
  }

  start() {
    super.start();

    if (!this.hasStarted)
      this.init();

    if (!this.options.showDialog)
      this.ready();
    else
      this.show();
  }

  stop() {
    this.hide();
    super.stop();
  }

  /**
   * Activate media as defined in `this.options`.
   */
  activateMedia() {
    if (client.rejected) { return; }
    // http://www.html5rocks.com/en/mobile/fullscreen/?redirect_from_locale=fr
    if (this.options.fullScreen && screenfull.enabled)
      screenfull.request();

    if (this.options.activateAudio)
      this._activateAudio();

    if (this.options.wakeLock)
      this._requestWakeLock();

    this.ready();
  }

  _supportsWebAudio() {
    return !!audioContext;
  }

  _defineAudioFileExtention() {
    const a = document.createElement('audio');
    // http://diveintohtml5.info/everything.html
    if (!!(a.canPlayType && a.canPlayType('audio/mpeg;'))) {
      client.platform.audioFileExt = '.mp3';
    } else if (!!(a.canPlayType && a.canPlayType('audio/ogg; codecs="vorbis"'))) {
      client.platform.audioFileExt = '.ogg';
    } else {
      client.platform.audioFileExt = '.wav';
    }
  }

  _definePlatform() {
    const ua = window.navigator.userAgent
    const md = new MobileDetect(ua);

    client.platform.isMobile = (md.mobile() !== null); // true if phone or tablet
    client.platform.os = (function() {
      let os = md.os();

      if (os === 'AndroidOS')
        return 'android';
      else if (os === 'iOS')
        return 'ios';
      else
        return 'other';
    })();
  }

  _activateAudio() {
    var o = audioContext.createOscillator();
    var g = audioContext.createGain();
    g.gain.value = 0.000000001; // -180dB ?
    o.connect(g);
    g.connect(audioContext.destination);
    o.start(0);

    // prevent android to stop audio by keping the oscillator active
    if (client.platform.os !== 'android')
      o.stop(audioContext.currentTime + 0.01);
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

// register in factory
serviceManager.register(SERVICE_ID, Welcome);

export default Welcome;

