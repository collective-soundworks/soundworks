var IO = require('socket.io');

var ServerIOSingleton = (function(){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var proto$0={};
  
  function ServerIOSingleton() {
    this.server = null;
    this.io = null;
  }DP$0(ServerIOSingleton,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  proto$0.initIO = function() {var server = arguments[0];if(server === void 0)server = null;
    this.server = this.server || server;
    if (!this.server) return;
    
    this.io = new IO(this.server);
    return this.io;
  };

MIXIN$0(ServerIOSingleton.prototype,proto$0);proto$0=void 0;return ServerIOSingleton;})();

// Everyone will use this instance with the same instantiated IO.
module.exports = new ServerIOSingleton();