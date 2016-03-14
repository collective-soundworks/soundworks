import client from '../core/client';
import screenfull from 'screenfull';
import SegmentedView from '../views/SegmentedView';
import Service from '../core/Service';
import serviceManager from '../core/serviceManager';


/**
 * @private
 */
function _base64(format, base64) {
  return `data:${format};base64,${base64}`;
}

const SERVICE_ID = 'service:welcome';

/**
 * [client] Check whether the device is compatible with the technologies used in the *Soundworks* library.
 * The service should used at the very beginning of a scenario to activate the Web Audio API on iOS devices (with the `activateAudio` option).
 *
 * The service requires the participant to tap the screen in order to initialize the webAudio on iOS devices and to make the view disappear.
 *
 * Compatible devices are running on iOS 7 or above, or on Android 4.2 or above with the Chrome browser in version 35 or above.
 * If that is not the case, the service displays a blocking `view` and prevents the participant to go any further in the scenario.
 *
 * The service finishes its initialization when the user touches the screen if the device passes the platform test, and never otherwise.
 */
class Welcome extends Service {
  constructor() {
    super(SERVICE_ID, false);

    /**
     * @type {Object} [defaults={}] - Options.
     * @type {String} [defaults.name='welcome'] - Name of the service.
     * @type {Boolean} [defaults.activateAudio=true] - Indicates whether the service activates the Web Audio API when the participant touches the screen (useful on iOS devices).
     * @type {Boolean} [defaults.requireMobile=true] - Defines if the application requires the use of a mobile device.
     * @type {Boolean} [defaults.wakeLock=false] - Indicates whether the service activates an ever-looping 1-pixel video to prevent the device from going idle.
     */
    const defaults = {
      fullScreen: false,
      wakeLock: false,
      showDialog: true,
      viewCtor: SegmentedView,
      viewPriority: 10,
    };

    this.configure(defaults);

    this._platform = this.require('platform');
  }

  init() {
    if (this.options.showDialog) {
      this.viewCtor = this.options.viewCtor;
      this.view = this.createView();
    }
  }

  start() {
    super.start();

    if (!this.hasStarted)
      this.init();

    // execute start hooks from the platform
    const startHooks = this._platform.getStartHooks();
    startHooks.forEach((hook) => hook());

    if (!this.options.showDialog)
      this.ready();
    else
      this.show();

    // install events for interaction hook
    const event = client.platform.isMobile ? 'touchend' : 'click';
    this.view.installEvents({ [event]: this._onInteraction.bind(this) });
  }

  stop() {
    this.hide();
    super.stop();
  }

  /**
   * Execute `interactions` hooks from the `platform` service.
   * Also activate the media according to the `options`.
   */
  _onInteraction() {
    // execute interaction hooks from the platform
    const interactionHooks = this._platform.getInteractionHooks();
    interactionHooks.forEach((hook) => hook());

    // http://www.html5rocks.com/en/mobile/fullscreen/?redirect_from_locale=fr
    if (this.options.fullScreen && screenfull.enabled)
      screenfull.request();

    if (this.options.wakeLock)
      this._initWakeLock();

    this.ready();
  }

  // hacks to keep the device awake...
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

serviceManager.register(SERVICE_ID, Welcome);

export default Welcome;
