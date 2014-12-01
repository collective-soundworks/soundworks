var audioContext = require('audio-context');
var EventEmitter = require('events').EventEmitter;

'use strict';

// TODO: add deviceMotion and deviceOrientation input.
var ClientInput = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(ClientInput, super$0);var proto$0={};
  function ClientInput() {
    this.__handleTouchEvent = this.handleTouchEvent.bind(this); // since .bind() creates a new function, we can't use it directly in the add/removeEventListener.
  }if(super$0!==null)SP$0(ClientInput,super$0);ClientInput.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":ClientInput,"configurable":true,"writable":true}});DP$0(ClientInput,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  proto$0.disableTouch = function(surface) {
    surface.removeEventListener('touchend', this.__handleTouchEvent, false);
    surface.removeEventListener('touchmove', this.__handleTouchEvent, false);
    surface.removeEventListener('touchstart', this.__handleTouchEvent, false);
  };

  proto$0.enableTouch = function(surface) {
    surface.addEventListener('touchend', this.__handleTouchEvent, false);
    surface.addEventListener('touchmove', this.__handleTouchEvent, false);
    surface.addEventListener('touchstart', this.__handleTouchEvent, false);
  };

  proto$0.handleTouchEvent = function(e) {
    e.preventDefault(); // To prevent scrolling.
    
    var touchData = {
      coordinates: [ e.changedTouches[0].clientX, e.changedTouches[0].clientY ],
      currentTime: audioContext.currentTime,
      event: e.type
    };
    
    this.emit(e.type, touchData);
  };
MIXIN$0(ClientInput.prototype,proto$0);proto$0=void 0;return ClientInput;})(EventEmitter);

module.exports = ClientInput;