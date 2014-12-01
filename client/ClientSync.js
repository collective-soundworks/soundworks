var audioContext = require('audio-context');

'use strict';

var ClientSync = (function(){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var proto$0={};
  function ClientSync() {
    this.__pingCount = 0;
    this.__pongCount = 0;
    this.__pingLimit = 0;
    this.__serverStartTime = 0;
    this.__timeOffset = 0;
    this.__timeOffsets = [];
    this.__travelTimes = [];
  }DP$0(ClientSync,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  proto$0.resetPingCount = function() {
    this.__pingCount = 0;
  };

  proto$0.sendPing = function() {
    this.__pingCount++;
    socket.emit('ping', audioContext.currentTime);
  };

  proto$0.setup = function() {var this$0 = this;
    // Required to start audioContext timer in Safari.
    // Otherwise, audioContext.currentTime is stuck
    // at 0.
    audioContext.createGain();

    // Gets parameters from the server.
    socket.on('init_sync', function(data)  {
      this$0.__pingLimit = data.pingLimit;
      this$0.__serverStartTime = data.serverStartTime;
    });

    // When the client receives a ping request from
    // the server, start the ping/pong exchange.
    socket.on('ping_request', function()  {
      console.log('Ping request from the server.');
      this$0.resetPingCount();
      this$0.sendPing();
    });

    // When the client receives a 'pong' from the
    // server, calculate the travel time and the
    // time offset.
    // Repeat as many times as needed (__pingLimit).
    socket.on('pong', function(time)  {
      console.log('\'pong\'.');
      this$0.__pongCount++;
      var now = audioContext.currentTime,
          travelTime = now - time.pingTime_clientTime,
          timeOffset = time.pongTime_serverTime - (now - travelTime / 2);
      this$0.__travelTimes.push(travelTime);
      this$0.__timeOffsets.push(timeOffset);
      if (this$0.__pingCount < this$0.__pingLimit) {
        this$0.sendPing();
      } else {
        this$0.__timeOffset = this$0.__timeOffsets.reduce(function(p, q)  {return p + q}) / this$0.__timeOffsets.length;
      }
    });
  };
MIXIN$0(ClientSync.prototype,proto$0);proto$0=void 0;return ClientSync;})();

module.exports = new ClientSync();