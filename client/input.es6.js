/**
 * @fileoverview Soundworks (client side) sensor input module (singleton)
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var EventEmitter = require('events').EventEmitter;
var audioContext = require('waves-audio').audioContext;

// TODO: add deviceMotion and deviceOrientation input.
class InputModule extends EventEmitter {
  constructor() {
    super();

    this.handleDeviceOrientationEvent = this.handleDeviceOrientationEvent.bind(this); // since .bind() creates a new function, we can't use it directly in the add/removeEventListener.
    this.handleDeviceMotionEvent = this.handleDeviceMotionEvent.bind(this);
    this.handleTouchEvent = this.handleTouchEvent.bind(this);
  }

  /********************************
   *
   *  DeviceMotion
   *
   **/

  enableDeviceMotion() {
    window.addEventListener('devicemotion', this.handleDeviceMotionEvent, false);
  }

  disableDeviceMotion() {
    window.removeEventListener('devicemotion', this.handleDeviceMotionEvent, false);
  }

  handleDeviceMotionEvent(e) {
    var motionData = {
      "acceleration": e.acceleration,
      "accelerationIncludingGravity": e.accelerationIncludingGravity,
      "rotationRate": e.rotationRate,
      "timestamp": audioContext.currentTime
    };

    this.emit('devicemotion', motionData);
  }

  /********************************
   *
   *  DeviceOrientation
   *
   **/

  enableDeviceOrientation() {
    window.addEventListener('deviceorientation', this.handleDeviceOrientationEvent, false);
  }

  disableDeviceOrientation() {
    window.removeEventListener('deviceorientation', this.handleDeviceOrientationEvent, false);
  }

  handleDeviceOrientationEvent(e) {
    var orientationData = {
      "alpha": e.alpha,
      "beta": e.beta,
      "gamma": e.gamma,
      "timestamp": audioContext.currentTime
    };

    this.emit('deviceorientation', orientationData);
  }

  /********************************
   *
   *  (Multi)Touch
   *
   **/

  enableTouch(surface) {
    surface.addEventListener('touchcancel', this.handleTouchEvent, false);
    surface.addEventListener('touchend', this.handleTouchEvent, false);
    surface.addEventListener('touchmove', this.handleTouchEvent, false);
    surface.addEventListener('touchstart', this.handleTouchEvent, false);
  }

  disableTouch(surface) {
    surface.removeEventListener('touchcancel', this.handleTouchEvent, false);
    surface.removeEventListener('touchend', this.handleTouchEvent, false);
    surface.removeEventListener('touchmove', this.handleTouchEvent, false);
    surface.removeEventListener('touchstart', this.handleTouchEvent, false);
  }

  handleTouchEvent(e) {
    e.preventDefault(); // To prevent scrolling.

    for (let i = 0; i < e.changedTouches.length; i++) {
      var type = e.type;

      if(type === 'touchcancel')
        type = 'touchend';

      var touchData = {
        "event": type,
        "timestamp": audioContext.currentTime,
        "coordinates": [e.changedTouches[i].clientX, e.changedTouches[i].clientY],
        "identifier": e.changedTouches[i].identifier
      };

      this.emit(type, touchData);
    }
  }
}

module.exports = new InputModule();