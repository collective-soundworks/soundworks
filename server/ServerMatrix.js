var ServerPlayerManager = require('./ServerPlayerManager');
var ServerConnectionManager = require('./ServerConnectionManager');
var ServerDynamicModel = require('./ServerDynamicModel');
var ServerPlacementManager = require('./ServerPlacementManager');
var ServerPreparationManager = require('./ServerPreparationManager');
var ServerSync = require('./ServerSync');
var ServerTopologyModel = require('./ServerTopologyModel');

'use strict';

var ServerMatrix = (function(){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var proto$0={};
  function ServerMatrix(matrixParameters) {
    var topologyModel = new ServerTopologyModel(matrixParameters, this.setup);
  }DP$0(ServerMatrix,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  proto$0.setup = function() {
    var topologyModel = this;
    var clientManager = new ServerPlayerManager();
    var connectionManager = new ServerConnectionManager();
    var dynamicModel = new ServerDynamicModel();
    var placementManager = new ServerPlacementManager(topologyModel);
    var preparationManager = new ServerPreparationManager(placementManager);

    connectionManager.on('connected', function(socket)  {
      topologyModel.sendToClient(socket);
      clientManager.connect(socket);
    });

    connectionManager.on('disconnected', function(socket)  {
      clientManager.disconnect(socket);
    });

    clientManager.on('connected', function(client)  {
      placementManager.requestPlace(client);
    });

    clientManager.on('disconnected', function(client)  {
      dynamicModel.removeParticipant(client);
      placementManager.releasePlace(client);
    });

    preparationManager.on('ready', function(client)  {
      clientManager.clientReady(client);
    });

    clientManager.on('playing', function(client)  {
      dynamicModel.addParticipant(client);
    });
  };
MIXIN$0(ServerMatrix.prototype,proto$0);proto$0=void 0;return ServerMatrix;})();

module.exports = ServerMatrix;