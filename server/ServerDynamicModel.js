'use strict';

var ServerDynamicModel = (function(){var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var proto$0={};
  function ServerDynamicModel(clientManager, topologyModel) {
    this.__clientManager = clientManager;
    this.__topologyModel = topologyModel;
  }DP$0(ServerDynamicModel,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  proto$0.addParticipant = function(client) {
    this.inputListener(client.socket);
  };

  proto$0.inputListener = function(socket) {

  };

  proto$0.removeParticipant = function(client) {
    
  };
MIXIN$0(ServerDynamicModel.prototype,proto$0);proto$0=void 0;return ServerDynamicModel;})();

module.exports = ServerDynamicModel;