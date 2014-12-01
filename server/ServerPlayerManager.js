var Player = require('./ServerPlayer');
var EventEmitter = require('events').EventEmitter;

'use strict';

var ServerPlayerManager = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(ServerPlayerManager, super$0);var proto$0={};
  function ServerPlayerManager() {
    this.__pending = [];
    this.__playing = [];
    this.__sockets = {};
  }if(super$0!==null)SP$0(ServerPlayerManager,super$0);ServerPlayerManager.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":ServerPlayerManager,"configurable":true,"writable":true}});DP$0(ServerPlayerManager,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  proto$0.connect = function(socket) {
    var client = new Player(socket);

    this.__pending.push(client);
    this.__sockets[socket.id] = client;
    socket.join('pending');

    console.log(
      '[ServerClientManager][connect] Client ' + socket.id + ' connected.\n' +
      'this.__pending: ' + this.__pending.map(function(c)  {return c.socket.id}) + '\n' +
      'this.__playing: ' + this.__playing.map(function(c)  {return c.socket.id})
    );

    this.emit('connected', client);
  };

  proto$0.disconnect = function(socket) {
    var client = this.__sockets[socket.id];
    var index = this.__pending.indexOf(client);
    var clientArray = null;

    if (index > -1) {
      clientArray = this.__pending;
    } else {
      index = this.__playing.indexOf(client);

      if (index >= 0)
        clientArray = this.__playing;
    }

    if (clientArray) {
      client.socket.broadcast.emit('remove_player', client.getInfo());
      clientArray.splice(index, 1); // remove client from pending or playing array
      delete this.__sockets[socket.id];

      console.log(
        '[ServerClientManager][disconnect] Client ' + socket.id + ' disconnected.\n' +
        'this.__pending: ' + this.__pending.map(function(c)  {return c.socket.id}) + '\n' +
        'this.__playing: ' + this.__playing.map(function(c)  {return c.socket.id})
      );
      
      this.emit('disconnected', client);
    }
  };

  proto$0.clientReady = function(client) {
    var index = this.__pending.indexOf(client);

    if (index > -1) {
      this.__pending.splice(index, 1);
      this.__playing.push(client);

      var currentState = this.__playing.map(function(c)  {return c.getInfo()});
      client.socket.emit('current_state', currentState);
      client.socket.broadcast.emit('new_player', client.getInfo());

      client.socket.leave('pending');
      client.socket.join('playing');

      this.emit('playing', client);
    }

    console.log(
      '[ServerClientManager][clientReady] Client ' + client.socket.id + ' playing.\n' +
      'this.__pending: ' + this.__pending.map(function(c)  {return c.socket.id}) + '\n' +
      'this.__playing: ' + this.__playing.map(function(c)  {return c.socket.id})
    );
  };
MIXIN$0(ServerPlayerManager.prototype,proto$0);proto$0=void 0;return ServerPlayerManager;})(EventEmitter);

module.exports = ServerPlayerManager;