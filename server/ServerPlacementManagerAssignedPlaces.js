var ServerPlacementManager = require('./ServerPlacementManager');
var utils = require('./ServerUtils');

'use strict';

var ServerPlacementManagerAssignedPlaces = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(ServerPlacementManagerAssignedPlaces, super$0);var proto$0={};
  function ServerPlacementManagerAssignedPlaces(topoModel) {
    super$0.call(this, topoModel);
  }if(super$0!==null)SP$0(ServerPlacementManagerAssignedPlaces,super$0);ServerPlacementManagerAssignedPlaces.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":ServerPlacementManagerAssignedPlaces,"configurable":true,"writable":true}});DP$0(ServerPlacementManagerAssignedPlaces,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  proto$0.requestPlace = function(client) {var this$0 = this;
    var socket = client.socket;

    if (this.__availablePlaces.length > 0) {
      // Get place and position
      var index = utils.getRandomInt(0, this.__availablePlaces.length - 1);
      var place = this.__availablePlaces.splice(index, 1)[0]; // TODO: handle different assignment methods (here, random).
      var label = this.__topoModel.getLabel(place);
      var position = this.__topoModel.getPosition(place);

      client.place = place;
      client.position = position;

      // Send to client
      socket.emit('place_available', { "label": label, "place": place, "position": position });

      // Wait for callback
      socket.on('placement_ready', function()  { // TOTO placement_ready
        this$0.emit('placement_ready', client);
      });
    } else {
      socket.emit('no_place_available');
    }
  };
MIXIN$0(ServerPlacementManagerAssignedPlaces.prototype,proto$0);proto$0=void 0;return ServerPlacementManagerAssignedPlaces;})(ServerPlacementManager);

module.exports = ServerPlacementManagerAssignedPlaces;