window.container = window.container || document.getElementById('container');
var EventEmitter = require('events').EventEmitter;
var AudioCue = require('./ClientAudioCue');

'use strict';

var ClientPlacementManager = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(ClientPlacementManager, super$0);var proto$0={};
  function ClientPlacementManager() {
    this.__label = null;
    this.__place = null;
    this.__position = null;

    this.__placementDiv = this.createPlacementDiv();
  }if(super$0!==null)SP$0(ClientPlacementManager,super$0);ClientPlacementManager.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":ClientPlacementManager,"configurable":true,"writable":true}});DP$0(ClientPlacementManager,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  proto$0.clientReady = function() {
    socket.emit('placement_ready');
    this.emit('ready', this.getPlaceInfo());

    AudioCue.beep();
    this.hidePlacementDiv();
  };

  proto$0.createPlacementDiv = function() {
    var placementDiv = document.createElement('div');

    placementDiv.setAttribute('id', 'placement');
    placementDiv.classList.add('info');
    
    container.appendChild(placementDiv);
    
    return placementDiv;
  };

  proto$0.getPlaceInfo = function() {
    var placeInfo = { "label": this.__label, "place": this.__place, "position": this.__position };
    return placeInfo;
  };

  proto$0.hidePlacementDiv = function() {
    this.__placementDiv.classList.add('hidden');
  };

MIXIN$0(ClientPlacementManager.prototype,proto$0);proto$0=void 0;return ClientPlacementManager;})(EventEmitter);

module.exports = ClientPlacementManager;