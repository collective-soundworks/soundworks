var ClientPlacementManager = require('./ClientPlacementManager');

'use strict';

var ClientPlacementManagerAssignedPlaces = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(ClientPlacementManagerAssignedPlaces, super$0);var proto$0={};
  function ClientPlacementManagerAssignedPlaces() {
    super$0.call(this);

    socket.on('place_available', this.updateInstructions.bind(this));
    socket.on('no_place_available', this.updateInstructions.bind(this))
  }if(super$0!==null)SP$0(ClientPlacementManagerAssignedPlaces,super$0);ClientPlacementManagerAssignedPlaces.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":ClientPlacementManagerAssignedPlaces,"configurable":true,"writable":true}});DP$0(ClientPlacementManagerAssignedPlaces,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  proto$0.updateInstructions = function() {var placeInfo = arguments[0];if(placeInfo === void 0)placeInfo = null;
    if (placeInfo) {
      this.__place = placeInfo.place;
      this.__position = placeInfo.position;
      this.__label = placeInfo.label;

      this.__placementDiv.innerHTML = "<p>Go to position</p>" + 
        "<div class='position circle'><span>" + this.__label + "</span></div>" +
        "<p class='small'>Touch the screen<br/>when you are ready.</p>";

      this.__placementDiv.addEventListener('click', this.clientReady.bind(this));
    } else {
      this.__placementDiv.innerHTML = "<p>All seats are taken, please try again later! =)</p>";
    }
  };

MIXIN$0(ClientPlacementManagerAssignedPlaces.prototype,proto$0);proto$0=void 0;return ClientPlacementManagerAssignedPlaces;})(ClientPlacementManager);

module.exports = ClientPlacementManagerAssignedPlaces;