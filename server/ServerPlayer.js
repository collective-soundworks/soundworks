'use strict';

var Player = (function(){var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var proto$0={};
	function Player(socket) {var place = arguments[1];if(place === void 0)place = null;var position = arguments[2];if(position === void 0)position = null;
    this.place = place;
    this.position = position;
    this.socket = socket;
    this.userData = {};
    this.__userData = {};
  }DP$0(Player,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  proto$0.getInfo = function() {
    var playerInfo = {
      place: this.place,
      position: this.position,
      socket: {
        id: this.socket.id
      },
      userData: this.userData
    };
    
    return playerInfo;
  };
MIXIN$0(Player.prototype,proto$0);proto$0=void 0;return Player;})();
  

module.exports = Player;