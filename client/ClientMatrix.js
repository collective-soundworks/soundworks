var ClientPlacementManager = require('./ClientPlacementManager');
var ClientDisplayInterface = require('./ClientDisplayInterface');
var ClientInput = require('./ClientInput');
var ClientDynamicModel = require('./ClientDynamicModel');
// var ClientSyncModule = require('./Client.SyncModule');


'use strict';

var ClientMatrix = (function(){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};
  function ClientMatrix() {

    socket.on('topology', function(topology)  {
      var input = new ClientInput();
      var placementManager = new ClientPlacementManager();
      var dynamicModel = new ClientDynamicModel(input);

      placementManager.on('ready', function(placeInfo)  {
        dynamicModel.start(placeInfo);
      });

    });

  }DP$0(ClientMatrix,"prototype",{"configurable":false,"enumerable":false,"writable":false});
;return ClientMatrix;})();

module.exports = ClientMatrix;