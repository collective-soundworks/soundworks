var server = require('./ServerIOSingleton');
var EventEmitter = require('events').EventEmitter;

'use strict';

var ServerConnectionManager = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(ServerConnectionManager, super$0);
  function ServerConnectionManager() {var this$0 = this;
    server.io.of('/play').on('connection', function(socket)  {
      console.log('global connection', socket.id);
      this$0.emit('connected', socket);

      socket.on('disconnect', function()  {
        this$0.emit('disconnected', socket);
      })
    });
  }if(super$0!==null)SP$0(ServerConnectionManager,super$0);ServerConnectionManager.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":ServerConnectionManager,"configurable":true,"writable":true}});DP$0(ServerConnectionManager,"prototype",{"configurable":false,"enumerable":false,"writable":false});
;return ServerConnectionManager;})(EventEmitter);

module.exports = ServerConnectionManager;

// TODO: handle /admin.html page