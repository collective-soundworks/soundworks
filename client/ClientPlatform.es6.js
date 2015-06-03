/**
 * @fileoverview Soundworks client side platform check module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var client = require('./client');
var ClientModule = require('./ClientModule');
const audioContext = require('waves-audio').audioContext;

var defaultMessages = {
  iosVersion: "This application requires at least iOS 7.",
  androidVersion: "This application requires at least Android 4.2.",
  wrongOS: "This application is designed for iOS and Android mobile devices."
};

class ClientPlatform extends ClientModule {
  constructor(options = {}) {
    super(options.name || 'platform-check', true, options.color);

    this.prefix = options.prefix ||  '';
    this.postfix = options.postfix ||  '';
    this.messages = options.messages || defaultMessages;
  }

  start() {
    super.start();

    let msg = null;
    const os = client.platform.os;
    const isMobile = client.platform.isMobile;

    if (!audioContext) {
      if (os === 'ios') {
        msg = this.messages.iosVersion;
      } else if (os === 'android') {
        msg = this.messages.androidVersion;
      } else {
        msg = this.messages.wrongOS;
      }
    } else if (!isMobile) {
      msg = this.messages.wrongOS;
    }

    if (msg !== null) {
      this.setCenteredViewContent(this.prefix + '<p>' + msg + '</p>' + this.postfix);
    } else {
      this.done();
    }
  }

  restart() {
    super.restart();

    this.done();
  }
}

module.exports = ClientPlatform;
