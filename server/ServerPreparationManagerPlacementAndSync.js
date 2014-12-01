var ServerPreparationManager = require('./ServerPreparationManager');

'use strict';

var ServerPreparationManagerPlaceAndSync = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(ServerPreparationManagerPlaceAndSync, super$0);
  function ServerPreparationManagerPlaceAndSync(placementManager, syncModule) {var this$0 = this;
    this.__placementManager = placementManager;
    this.__syncModule = syncModule;

    this.__state = { placementManager: false, syncModule: false };

    // TODO: use Promises
    this.__placementManager.on('placement_ready', function(client)  {
      this$0.__state.placementManager = true;
      if (this$0.__state.placementManager && this$0.__state.syncModule) {
        this$0.emit('ready', client);
      }
    });

    this.__syncModule.on('sync_ready', function(client)  {
      this$0.__state.syncModule = true;
      if (this$0.__state.placementManager && this$0.__state.syncModule) {
        this$0.emit('ready', client);
      }
    });
  }if(super$0!==null)SP$0(ServerPreparationManagerPlaceAndSync,super$0);ServerPreparationManagerPlaceAndSync.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":ServerPreparationManagerPlaceAndSync,"configurable":true,"writable":true}});DP$0(ServerPreparationManagerPlaceAndSync,"prototype",{"configurable":false,"enumerable":false,"writable":false});
  
;return ServerPreparationManagerPlaceAndSync;})(ServerPreparationManager);

module.exports = ServerPreparationManagerPlaceAndSync;