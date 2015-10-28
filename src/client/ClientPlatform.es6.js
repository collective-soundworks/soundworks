'use strict';

const audioContext = require('waves-audio').audioContext;
const platform = require('platform');

import client from './client.es6.js';
import ClientModule from './ClientModule.es6.js';

/**
 * Messages written in the view when the device can't pass the platform check.
 * @type {Object}
 * @property {string} iosVersion
 * @property {string} androidVersion
 * @property {string} wrongOS
 */
const defaultMessages = {
  iosVersion: "This application requires at least iOS 7 with Safari or Chrome.",
  androidVersion: "This application requires at least Android 4.2 with Chrome.",
  wrongOS: "This application is designed for iOS and Android mobile devices."
};

/**
 * The `ClientPlatform` checks whether the device is compatible with the technologies used in the *Soundworks* library.
 * (Compatible devices are running on iOS 7 or above, or on Android 4.2 or above with the Chrome browser in version 35 or above.)
 * If that is not the case, the module displays a blocking view and prevents the participant to go any further in the scenario.
 * The `ClientPlatform` module calls its `done` method immediately if the device passes the platform test, and never otherwise.
 */
export default class ClientPlatform extends ClientModule {
  /**
   * Creates an instance of the class. Always has a view.
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

  start() {
    super.start();

    let msg = null;
    const os = client.platform.os;
    const isMobile = client.platform.isMobile;

    if (this._bypass)
      return this.done();

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
      this.setCenteredViewContent(this._prefix + '<p>' + msg + '</p>' + this._postfix);
    } else {
      this.done();
    }
  }

  restart() {
    super.restart();
    this.done();
  }
}
