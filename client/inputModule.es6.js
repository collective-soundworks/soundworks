var audioContext = require('audio-context');
var EventEmitter = require('events').EventEmitter;

'use strict';

// TODO: add deviceMotion and deviceOrientation input.
class InputModule extends EventEmitter {
  constructor() {
    this.handleTouchEvent = this.handleTouchEvent.bind(this); // since .bind() creates a new function, we can't use it directly in the add/removeEventListener.
  }

  disableTouch(surface) {
    surface.removeEventListener('touchend', this.handleTouchEvent, false);
    surface.removeEventListener('touchmove', this.handleTouchEvent, false);
    surface.removeEventListener('touchstart', this.handleTouchEvent, false);
  }

  enableTouch(surface) {
    surface.addEventListener('touchend', this.handleTouchEvent, false);
    surface.addEventListener('touchmove', this.handleTouchEvent, false);
    surface.addEventListener('touchstart', this.handleTouchEvent, false);
  }

  handleTouchEvent(e) {
    e.preventDefault(); // To prevent scrolling.
    
    var touchData = {
      coordinates: [ e.changedTouches[0].clientX, e.changedTouches[0].clientY ],
      currentTime: audioContext.currentTime,
      event: e.type
    };
    
    this.emit(e.type, touchData);
  }
}

module.exports = new InputModule();