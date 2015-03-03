/**
 * @fileoverview Soundworks client side platform check module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var audioContext = require('audio-context');
var ClientModule = require('./ClientModule');
var platform = require('platform');

function parseVersionString(string) {
  if (string) {
    var a = string.split('.');

    if (a[1] >= 0)
      return parseFloat(a[0] + "." + a[1]);

    return parseFloat(a[0]);
  }

  return null;
}

class ClientPlatform extends ClientModule {
  constructor(options = {}) {
    super('platform-check', true, options.color || 'black');
  }

  start() {
    super.start();

    var osVersion = parseVersionString(platform.os.version);
    var browserVersion = parseVersionString(platform.version);
    var msg = null;

    if (platform.os.family == "iOS") {
      if (osVersion < 7)
        msg = "This application requires at least iOS 7.<br/>You have iOS " + platform.os.version + ".";
    } else if (platform.os.family == "Android") {
      if (osVersion < 4.2)
        msg = "This application requires at least Android 4.2.<br/>You have Android " + platform.os.version + ".";
      else if (platform.name != 'Chrome Mobile')
        msg = "You have to use Chrome to run this application on an Android device.";
      else if (browserVersion < 35)
        msg = "Consider updating Chrome to a more recent version to run this application.";
    } else {
      msg = "This application is designed for mobile devices and currently runs on iOS or Android only.";
    }

    if (msg !== null) {
      this.__createViewContent();
      this.viewContent.innerHTML = msg;
    } else {
      this.done();
    }
  }

}

module.exports = ClientPlatform;