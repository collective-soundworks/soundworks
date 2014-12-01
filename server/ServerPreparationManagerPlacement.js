var ServerPreparationManager = require('./ServerPreparationManager');

'use strict';

var ServerPreparationManagerPlacement = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(ServerPreparationManagerPlacement, super$0);
  function ServerPreparationManagerPlacement(placementManager) {var this$0 = this;
    this.__placementManager = placementManager;
    this.__state = { placementManager: false };

    this.__placementManager.on('placement_ready', function(client)  {
      this$0.__state.placementManager = true;
      this$0.emit('ready', client);
    });
  }if(super$0!==null)SP$0(ServerPreparationManagerPlacement,super$0);ServerPreparationManagerPlacement.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":ServerPreparationManagerPlacement,"configurable":true,"writable":true}});DP$0(ServerPreparationManagerPlacement,"prototype",{"configurable":false,"enumerable":false,"writable":false});
;return ServerPreparationManagerPlacement;})(ServerPreparationManager);

module.exports = ServerPreparationManagerPlacement;