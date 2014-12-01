'use strict';

var ServerTopologyModel = (function(){var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var proto$0={};
  function ServerTopologyModel(readyCallback) {
    this.__labels = [];
    this.__positions = [];
    this.__readyCallback = readyCallback; // Placeholder only.
  }DP$0(ServerTopologyModel,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  proto$0.getLabel = function(place) {
    return this.__labels[place];
  };

  proto$0.getPosition = function(place) {
    return this.__positions[place];
  };

  proto$0.getTopology = function() {
    var matrixTopology = { "labels": this.__labels, "positions": this.__positions };
    return matrixTopology;
  };

  proto$0.sendToClient = function(socket) {
    socket.emit('topology', this.getTopology());
  };
MIXIN$0(ServerTopologyModel.prototype,proto$0);proto$0=void 0;return ServerTopologyModel;})();

module.exports = ServerTopologyModel;