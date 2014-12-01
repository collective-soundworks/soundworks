'use strict';

var ServerSoloistManager = (function(){var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var proto$0={};
  function ServerSoloistManager(clientManager) {
    this.__clientManager = clientManager;
  }DP$0(ServerSoloistManager,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  proto$0.addPlayer = function(client) {
    
  };

  proto$0.removePlayer = function(client) {
    
  };

MIXIN$0(ServerSoloistManager.prototype,proto$0);proto$0=void 0;return ServerSoloistManager;})();

module.exports = ServerSoloistManager;