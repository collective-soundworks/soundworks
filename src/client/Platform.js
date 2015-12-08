import { audioContext } from 'waves-audio';
import client from './client';
import ClientModule from './ClientModule';
// @todo - remove one of these dependencies
import platform from 'platform';
import MobileDetect from 'mobile-detect';


/**
 * Error messages written in the `view` when the device doesn't pass the platform check.
 * @type {Object}
 * @property {string} iosVersion
 * @property {string} androidVersion
 * @property {string} wrongOS
 */
const defaultMessages = {
  iosVersion: 'This application requires at least iOS 7 with Safari or Chrome.',
  androidVersion: 'This application requires at least Android 4.2 with Chrome.',
  wrongOS: 'This application is designed for iOS and Android mobile devices.'
};

/**
 * [client] Check whether the device is compatible with the technologies used in the *Soundworks* library.
 *
 * Compatible devices are running on iOS 7 or above, or on Android 4.2 or above with the Chrome browser in version 35 or above.
 * If that is not the case, the module displays a blocking `view` and prevents the participant to go any further in the scenario.
 *
 * The module finishes its initialization immediately if the device passes the platform test, and never otherwise.
 */
export default class Platform extends ClientModule {
  /**
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='platform-check'] Name of the module.
   * @param {String} [options.color='black'] Background color of the `view`.
   * @param {String} [options.prefix=''] Additional content displayed before the error message (*e.g.* `'Welcome to My Scenario!'`).
   * @param {String} [options.postfix=''] Additional content displayed after the error message (*e.g.* `'You can still enjoy the performance with others!'`).
   * @param {String} [options.messages=defaultMessages] Error messages displayed when the device doesn't pass the platform check.
   * @param {Boolean} [options.bypass=false] When set to `true`, the module is bypassed (calls the `done`method immediately).
   */
  constructor(options = {}) {
    super(options.name || 'platform-check', true, options.color);

    this._prefix = options.prefix || '';
    this._postfix = options.postfix || '';
    this._messages = options.messages || defaultMessages;
    this._bypass = options.bypass || false;
  }

  _getPlatform() {
    const ua = window.navigator.userAgent
    const md = new MobileDetect(ua);
    client.platform.isMobile = (md.mobile() !== null); // true if phone or tablet
    client.platform.os = (() => {
      let os = md.os();

      if (os === 'AndroidOS') {
        return 'android';
      } else if (os === 'iOS') {
        return 'ios';
      } else {
        return 'other';
      }
    })();
  }

  _getAudioFileExtention() {
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

  /**
   * @private
   */
  start() {
    super.start();

    this._getPlatform();
    this._getAudioFileExtention();

    // display an error message if platform is not supported
    let msg = null;
    const os = client.platform.os;
    const isMobile = client.platform.isMobile;

    // bypass thos module for in browser testing
    if (this._bypass) { return this.done(); }

    if (!audioContext) {
      if (os === 'ios') {
        msg = this._messages.iosVersion;
      } else if (os === 'android') {
        msg = this._messages.androidVersion;
      } else {
        msg = this._messages.wrongOS;
      }
    } else if (!isMobile || client.platform.os === 'other') {
      msg = this._messages.wrongOS;
    } else if (client.platform.os === 'ios' && platform.os.version < '7') {
      msg = this._messages.iosVersion;
    } else if (client.platform.os === 'android' && platform.os.version < '4.2') {
      msg = this._messages.androidVersion;
    }

    if (msg !== null) {
      this.setCenteredViewContent(`${this._prefix}<p>${msg}</p>${this._postfix}`);
    } else {
      this.done();
    }
  }

  /**
   * @private
   */
  restart() {
    super.restart();
    this.done();
  }
}
