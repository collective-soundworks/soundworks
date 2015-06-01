/**
 * @fileoverview Soundworks client side platform check module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

// var client = require('./client');
var ClientModule = require('./ClientModule');
// var platform = require('platform');
const MobileDetect = require('mobile-detect');
const audioContext = require('waves-audio').audioContext;

// function parseVersionString(string) {
//   if (string) {
//     var a = string.split('.');

//     if (a[1] >= 0)
//       return parseFloat(a[0] + "." + a[1]);

//     return parseFloat(a[0]);
//   }

//   return null;
// }

var defaultMessages = {
  iosVersion: "This application requires at least iOS 7.",
  androidVersion: "This application requires at least Android 4.2.",
  // useChrome: "You have to use Chrome to run this application on an Android device.", // not used
  // updateChrome: "Please update Chrome to a more recent version to run this application.", // not used
  wrongOS: "This application is designed for iOS and Android mobile devices."
};

class ClientPlatform extends ClientModule {
  constructor(options = {}) {
    super(options.name || 'platform-check', true, options.color);

    this.prefix = options.prefix ||  '';
    this.postfix = options.postfix ||  '';
    this.messages = options.messages || defaultMessages;

    this.md = new MobileDetect(window.navigator.userAgent);
  }

  start() {
    super.start();

    this.isMobile = (this.md.mobile() !== null); // true if phone or tablet
    this.os = (() => {
      if (this.md.os() === 'AndroidOS') {
        return 'android';
      } else if (this.md.os() === 'iOS') {
        return 'ios';
      } else {
        return 'not supported';
      }
    })();

    // var osVersion = parseVersionString(platform.os.version);
    // var browserVersion = parseVersionString(platform.version);
    var msg = null;

    // if (!client.audioContext) {
    //   if (platform.os.family == "iOS") {
    //     if (osVersion < 7)
    //       msg = this.messages.iosVersion;
    //   } else if (platform.os.family == "Android") {
    //     if (osVersion < 4.2)
    //       msg = this.messages.androidVersion;
    //     else if (platform.name != 'Chrome Mobile')
    //       msg = this.messages.useChrome;
    //     else if (browserVersion < 35)
    //       msg = this.messages.updateChrome;
    //   } else {
    //     msg = this.messages.wrongOS;
    //   }
    // }
    // console.log(audioContext);
    // console.log(this.os);
    // console.log(this.isMobile);

    if (!audioContext) {
      if (this.os === 'ios') {
        msg = this.messages.iosVersion;
      } else if (this.os === 'android') {
        msg = this.messages.androidVersion;
      } else {
        msg = this.messages.wrongOS;
      }
    } else if (!this.isMobile) {
      msg = this.messages.wrongOS;
    }

    if (msg !== null) {
      this.setCenteredViewContent(this.prefix + '<p>' + msg + '</p>' + this.postfix);
    } else {
      this.done();
    }
  }
}

module.exports = ClientPlatform;
