var EventEmitter = require('events').EventEmitter;

'use strict';

var ServerPlacementManager = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(ServerPlacementManager, super$0);var proto$0={};
  function ServerPlacementManager(topoModel) {
    this.__topoModel = topoModel;
    this.__availablePlaces = []; // Indices of topoModel .__positions and .__labels arrays.

    for (var i = 0; i < this.__topoModel.__labels.length; i++)
      this.__availablePlaces.push(i);
  }if(super$0!==null)SP$0(ServerPlacementManager,super$0);ServerPlacementManager.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":ServerPlacementManager,"configurable":true,"writable":true}});DP$0(ServerPlacementManager,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  proto$0.requestPlace = function(client) {
    if (this.__availablePlaces.length > 0) {
      var place = this.__availablePlaces.splice(0, 1)[0];
      client.place = place;
      client.position = this.__topoModel.__positions[place];
    }

    this.emit('placement_ready', client); // Send 'ready' when the client is ready.
  };

  proto$0.releasePlace = function(client) {
    var place = client.place;

    if (place !== null) {
      this.__availablePlaces.push(place);
      client.place = null;
      client.position = null;
    }
  };
MIXIN$0(ServerPlacementManager.prototype,proto$0);proto$0=void 0;return ServerPlacementManager;})(EventEmitter);

module.exports = ServerPlacementManager;