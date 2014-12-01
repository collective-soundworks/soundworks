var ClientDisplayInterface = require('./ClientDisplayInterface');

'use strict';

var ClientDynamicModel = (function(){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var proto$0={};
  function ClientDynamicModel(input) {
    this.__label = null;
    this.__place = null;
    this.__position = null;

    this.__input = input;
  }DP$0(ClientDynamicModel,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  proto$0.start = function(placeInfo) {
    this.__label = placeInfo.label;
    this.__place = placeInfo.place;
    this.__position = placeInfo.position;

    var displayInterface = new ClientDisplayInterface();
  };

MIXIN$0(ClientDynamicModel.prototype,proto$0);proto$0=void 0;return ClientDynamicModel;})();

module.exports = ClientDynamicModel;