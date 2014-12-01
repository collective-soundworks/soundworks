var audioContext = require('audio-context');
var EventEmitter = require('events').EventEmitter;

'use strict';

// TODO: add deviceMotion and deviceOrientation input.
class ClientInput extends EventEmitter {
  constructor() {
    this.__handleTouchEvent = this.handleTouchEvent.bind(this); // since .bind() creates a new function, we can't use it directly in the add/removeEventListener.
  }

  disableTouch(surface) {
    surface.removeEventListener('touchend', this.__handleTouchEvent, false);
    surface.removeEventListener('touchmove', this.__handleTouchEvent, false);
    surface.removeEventListener('touchstart', this.__handleTouchEvent, false);
  }

  enableTouch(surface) {
    surface.addEventListener('touchend', this.__handleTouchEvent, false);
    surface.addEventListener('touchmove', this.__handleTouchEvent, false);
    surface.addEventListener('touchstart', this.__handleTouchEvent, false);
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

module.exports = ClientInput;