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

    this.motionData = {
      timestamp: 0,
      acceleration: 0,
      accelerationIncludingGravity: 0,
      rotationRate: 0,
    };

    this.touchData = {
      timestamp: 0,
      identifier: 0,
      event: '',
      coordinates: [0, 0]
    };

    this.orientationData = {
      alpha: 0,
      beta: 0,
      gamma: 0,
      timestamp: 0
    };

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
    var motionData = this.motionData;
    motionData.timestamp = audioContext.currentTime;
    motionData.acceleration = e.acceleration;
    motionData.accelerationIncludingGravity = e.accelerationIncludingGravity;
    motionData.rotationRate = e.rotationRate;

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
    var orientationData = this.orientationData;
    orientationData.timestamp = audioContext.currentTime;
    orientationData.alpha = e.alpha;
    orientationData.beta = e.beta;
    orientationData.gamma = e.gamma;

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

      if (type === 'touchcancel')
        type = 'touchend';

      var touchData = this.touchData;
      touchData.timestamp = audioContext.currentTime;
      touchData.identifier = e.changedTouches[i].identifier;
      touchData.event = type;
      touchData.coordinates[0] = e.changedTouches[i].clientX;
      touchData.coordinates[1] = e.changedTouches[i].clientY;

      this.emit(type, touchData);
    }
  }
}

module.exports = new InputModule();