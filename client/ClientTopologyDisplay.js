var utils = require('./ClientUtils');

'use strict';

var ClientTopologyDisplay = (function(){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var proto$0={};
  function ClientTopologyDisplay(topology, parent) {
    this.__labels = topology.labels;
    this.__positions = topology.positions;

    this.__height = this.getTopoHeight();
    this.__width = this.getTopoWidth();

    this.__parent = parent;
  }DP$0(ClientTopologyDisplay,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  proto$0.getTopoHeight = function() {
    var max = utils.getMaxOfArray(this.__positions.map(function(p)  {return p[1]}));
    var min = utils.getMinOfArray(this.__positions.map(function(p)  {return p[1]}));
    var height = max - min;

    return height;
  };

  proto$0.getTopoWidth = function() {
    var max = utils.getMaxOfArray(this.__positions.map(function(p)  {return p[0]}));
    var min = utils.getMinOfArray(this.__positions.map(function(p)  {return p[0]}));
    var width = max - min;

    return width;
  };
MIXIN$0(ClientTopologyDisplay.prototype,proto$0);proto$0=void 0;return ClientTopologyDisplay;})();

module.exports = ClientTopologyDisplay;