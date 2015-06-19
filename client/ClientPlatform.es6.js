/**
 * @fileoverview Soundworks client side platform check module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var client = require('./client');
var ClientModule = require('./ClientModule');
const audioContext = require('waves-audio').audioContext;
const platform = require('platform');

var defaultMessages = {
  iosVersion: "This application requires at least iOS 7 with Safari or Chrome.",
  androidVersion: "This application requires at least Android 4.2 with Chrome.",
  wrongOS: "This application is designed for iOS and Android mobile devices."
};

class ClientPlatform extends ClientModule {
  constructor(options = {}) {
    super(options.name || 'platform-check', true, options.color);

    this.prefix = options.prefix ||  '';
    this.postfix = options.postfix ||  '';
    this.messages = options.messages || defaultMessages;
    this.bypass = options.bypass || false;
  }

  start() {
    super.start();

    let msg = null;
    const os = client.platform.os;
    const isMobile = client.platform.isMobile;

    if (this.bypass) 
      return this.done();

    if (!audioContext) {
      if (os === 'ios') {
        msg = this.messages.iosVersion;
      } else if (os === 'android') {
        msg = this.messages.androidVersion;
      } else {
        msg = this.messages.wrongOS;
      }
    } else if (!isMobile || client.platform.os === 'other') {
      msg = this.messages.wrongOS;
    } else if (client.platform.os === 'ios') {
      let version = platform.os.version.split('.');

      if(version[0] < 7)
        msg = this.messages.iosVersion;
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
