/**
 * @fileoverview Soundworks client side dialog module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var client = require('./client');
var ClientModule = require('./ClientModule');
var audioContext = require('waves-audio').audioContext;

function base64(format, base64) {
  return `data:${format};base64,${base64}`;
}

class ClientDialog extends ClientModule {
  constructor(options = {}) {
    super(options.name || 'dialog', true, options.color);

    this._mustActivateAudio = options.activateAudio || false;
    this._mustWakeLock = options.wakeLock ||  true;
    this._text = options.text || "Hello!";

    this._clickHandler = this._clickHandler.bind(this);
  }

  start() {
    super.start();
    this.setCenteredViewContent(this._text);

    // initialize video element for wakeLocking
    this._initWakeLock();
    // install click listener
    this.view.addEventListener('click', () => {
      if (this._mustActivateAudio)
        this._activateAudio();

      if (this._mustWakeLock)
        this._requestWakeLock();

      this.done();
    });
  }

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
    o.stop(audioContext.currentTime + 0.000001);
  }

  << << << < HEAD
  _clickHandler() {
    if (this._mustActivateAudio)
      this._activateAudio();

    this.view.removeEventListener('click', this._clickHandler);
    this.done(); === === =
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

        this._wakeLockVideo.src = base64('video/webm', 'GkXfowEAAAAAAAAfQoaBAUL3gQFC8oEEQvOBCEKChHdlYm1Ch4ECQoWBAhhTgGcBAAAAAAACWxFNm3RALE27i1OrhBVJqWZTrIHfTbuMU6uEFlSua1OsggEuTbuMU6uEHFO7a1OsggI+7AEAAAAAAACkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVSalmAQAAAAAAAEMq17GDD0JATYCMTGF2ZjU2LjQuMTAxV0GMTGF2ZjU2LjQuMTAxc6SQ20Yv/Elws73A/+KfEjM11ESJiEBkwAAAAAAAFlSuawEAAAAAAABHrgEAAAAAAAA+14EBc8WBAZyBACK1nIN1bmSGhVZfVlA4g4EBI+ODhAT3kNXgAQAAAAAAABKwgRC6gRBTwIEBVLCBEFS6gRAfQ7Z1AQAAAAAAALHngQCgAQAAAAAAAFyho4EAAIAQAgCdASoQABAAAEcIhYWIhYSIAgIADA1gAP7/q1CAdaEBAAAAAAAALaYBAAAAAAAAJO6BAaWfEAIAnQEqEAAQAABHCIWFiIWEiAICAAwNYAD+/7r/QKABAAAAAAAAQKGVgQBTALEBAAEQEAAYABhYL/QACAAAdaEBAAAAAAAAH6YBAAAAAAAAFu6BAaWRsQEAARAQABgAGFgv9AAIAAAcU7trAQAAAAAAABG7j7OBALeK94EB8YIBgfCBAw==');
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
      } >>> >>> > 0794814 a4a240a654cf4cab10c7b4fffc7f432a0
    }
  }

  module.exports = ClientDialog;