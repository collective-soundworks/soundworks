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
 * Interface of the client `'welcome'` service.
 *
 * This service is used to create the home page of a *soundworks* application.
 * It also works in conjunction with the `platform` service to execute the hooks
 * provided to properly initialize requirements of the application (for example:
 * use the user touch event to enter the application to initialize a proper
 * `AudioContext`).
 *
 * _If any of the application's requirements fail, an error message is displayed
 * instead of the home page._
 *
 * @memberof module:soundworks/client
 *
 * @param {Object} options
 * @param {Boolean} [options.fullScreen=false] - If available on the platform, request full screen.
 * @param {Boolean} [options.showDialog=true] - Define if the service should use its view or not.
 *
 * @example
 * // inside the experience constructor
 * this.welcome = this.require('welcome', { fullScreen: true });
 */
class Welcome extends Service {
  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  constructor() {
    super(SERVICE_ID, false);

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
   * @private
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
