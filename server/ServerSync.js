'use strict';

var ServerSync = (function(){var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var proto$0={};
	function ServerSync() {
    this.__pingLimit = 10;
    this.__serverStartTime = Date.now() / 1000;
  }DP$0(ServerSync,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  proto$0.pingRequest = function(socket) {
    socket.emit('ping_request');
  };

  proto$0.setPingLimit = function(n) {
    this.__pingLimit = n;
  };

  proto$0.startInitialSyncWithClient = function(socket) {
    socket.emit('init_sync', {
      pingLimit: this.__pingLimit,
      serverStartTime: this.__serverStartTime
    });

    this.startSyncWithClient(socket);
  };

  proto$0.startSyncWithClient = function(socket) {
    this.pingRequest(socket);

    socket.on('ping', function(pingTime_clientTime)  {
      var pongTime_serverTime = Date.now() / 1000;
      socket.emit('pong', {
        pingTime_clientTime: pingTime_clientTime,
        pongTime_serverTime: pongTime_serverTime
      });
    });
  };

MIXIN$0(ServerSync.prototype,proto$0);proto$0=void 0;return ServerSync;})();

module.exports = new ServerSync();