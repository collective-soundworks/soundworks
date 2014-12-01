var ServerSoloistManager = require('./ServerSoloistManager');
var server = require('./ServerIOSingleton');
var utils = require('./ServerUtils');

'use strict';

var ServerSoloistManagerRandomUrn = (function(super$0){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var SP$0 = Object.setPrototypeOf||function(o,p){if(PRS$0){o["__proto__"]=p;}else {DP$0(o,"__proto__",{"value":p,"configurable":true,"enumerable":false,"writable":true});}return o};var OC$0 = Object.create;if(!PRS$0)MIXIN$0(ServerSoloistManagerRandomUrn, super$0);var proto$0={};
  function ServerSoloistManagerRandomUrn(clientManager) {
    super$0.call(this, clientManager);

    this.__idlePeriodLength = 1000; // in milliseconds
    this.__simultaneousSoloists = 2;
    this.__soloistPerformanceLength = 3000; // in milliseconds

    this.__availableSoloists = utils.createIdentityArray(this.__simultaneousSoloists);

    this.__soloists = [];
    this.__unselectable = [];
    this.__urn = clientManager.__playing.slice();

    Array.observe(this.__urn, this.urnObserver.bind(this));
    Array.observe(this.__unselectable, this.unselectableObserver.bind(this));
    Array.observe(this.__soloists, this.soloistsObserver.bind(this));
  }if(super$0!==null)SP$0(ServerSoloistManagerRandomUrn,super$0);ServerSoloistManagerRandomUrn.prototype = OC$0(super$0!==null?super$0.prototype:null,{"constructor":{"value":ServerSoloistManagerRandomUrn,"configurable":true,"writable":true}});DP$0(ServerSoloistManagerRandomUrn,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  proto$0.addPlayer = function(client) {
    this.__urn.push(client);
    this.addSocketListener(client);
    client.socket.emit('current_soloists', this.__soloists.map(function(s)  {return s.getInfo()}));

    console.log(
      '[RandomUrnServerSoloistManager][addPlayer] Player ' + client.socket.id + ' added.\n'
      + 'this.__urn: ' + this.__urn.map(function(c)  {return c.socket.id}) + '\n'
      + 'this.__soloists: ' + this.__soloists.map(function(c)  {return c.socket.id}) + '\n'
      + 'this.__unselectable: ' + this.__unselectable.map(function(c)  {return c.socket.id})
    );
  };

  proto$0.addSocketListener = function(player) {var this$0 = this;
    player.socket.on('touchstart', function()  {
      if (!player.userData.hasPlayed) {
        clearTimeout(player.__userData.timeout);
        player.__userData.timeout = setTimeout(function()  {
          this$0.removeSoloist(player);
        }, this$0.__soloistPerformanceLength);
      }
    })
  };

  proto$0.addSoloist = function() {var this$0 = this;
    if (this.needSoloist() && this.__urn.length > 0) {
      var soloistId = this.__availableSoloists.splice(0, 1)[0];
      var index = utils.getRandomInt(0, this.__urn.length - 1);
      var player = this.__urn.splice(index, 1)[0];
      server.io.of('/play').emit('new_soloist', player.getInfo());

      player.userData.soloistId = soloistId;
      player.__userData.timeout = setTimeout(function()  {
        this$0.removeSoloist(player);
      }, this.__idlePeriodLength);

      this.__soloists.push(player);

      console.log(
        '[RandomUrnServerSoloistManager][addSoloist] Soloist ' + player.socket.id + ' added.\n'
        + 'this.__urn: ' + this.__urn.map(function(c)  {return c.socket.id}) + '\n'
        + 'this.__soloists: ' + this.__soloists.map(function(c)  {return c.socket.id}) + '\n'
        + 'this.__unselectable: ' + this.__unselectable.map(function(c)  {return c.socket.id})
      );
    } else {
      console.log("[RandomUrnServerSoloistManager][addSoloist] No soloist to add.")
    }
  };

  proto$0.needSoloist = function() {
    return this.__availableSoloists.length > 0;
  };

  proto$0.removePlayer = function(client) {
    var indexUrn = this.__urn.indexOf(client);
    var indexSoloist = this.__soloists.indexOf(client);
    var indexUnselectable = this.__unselectable.indexOf(client);
    var playerArray = null;

    if (indexUrn > -1) 
      this.__urn.splice(indexUrn, 1);
    else if (indexUnselectable > -1)
      this.__unselectable.splice(indexUnselectable, 1);
    else if (indexSoloist > -1) {
      var soloist = this.__soloists.splice(indexSoloist, 1)[0];
      this.__availableSoloists.push(soloist.userData.soloistId)
      soloist.userData.soloist = {};
      server.io.of('/play').emit('remove_soloist', soloist.getInfo());
    } else {
      console.log('[RandomUrnServerSoloistManager][removePlayer] Player ' + client.socket.id + 'not found.');
    }

    console.log("this.__availableSoloists", this.__availableSoloists);

    console.log(
      '[RandomUrnServerSoloistManager][removePlayer] Player ' + client.socket.id + ' removed.\n'
        + 'this.__urn: ' + this.__urn.map(function(c)  {return c.socket.id}) + '\n'
        + 'this.__soloists: ' + this.__soloists.map(function(c)  {return c.socket.id}) + '\n'
        + 'this.__unselectable: ' + this.__unselectable.map(function(c)  {return c.socket.id})
    );
  };

  proto$0.removeSoloist = function(soloist) {
    var index = this.__soloists.indexOf(soloist);
    if (index > -1) {
      var soloist$0 = this.__soloists.splice(index, 1)[0];
      this.__availableSoloists.push(soloist$0.userData.soloistId)
      soloist$0.userData.soloist = null;
      this.__unselectable.push(soloist$0);
      server.io.of('/play').emit('remove_soloist', soloist$0.getInfo());

      console.log(
        '[RandomUrnServerSoloistManager][removeSoloist] Soloist ' + soloist$0.socket.id + ' removed.\n'
        + 'this.__urn: ' + this.__urn.map(function(c)  {return c.socket.id}) + '\n'
        + 'this.__soloists: ' + this.__soloists.map(function(c)  {return c.socket.id}) + '\n'
        + 'this.__unselectable: ' + this.__unselectable.map(function(c)  {return c.socket.id})
      );

    } else {
      console.log("[RandomUrnServerSoloistManager][removeSoloist] Player " + soloist.socket.id + "not found in this.__soloists.");
    }
  };

  proto$0.soloistsObserver = function(changes) {
    if (changes[0].removed.length > 0 && this.needSoloist())
      this.addSoloist();
  };

  proto$0.transferUnselectedToUrn = function() {
    while (this.__unselectable.length > 0) // TODO: change this push the whole array at once
      this.__urn.push(this.__unselectable.pop());
    // this.__urn.splice(0, 0, this.__unselectable[0]);
    // utils.clearArray(this.__unselectable);

    console.log(
      '[RandomUrnServerSoloistManager][transferUnselectedToUrn]\n'
      + 'this.__urn: ' + this.__urn.map(function(c)  {return c.socket.id}) + '\n'
      + 'this.__soloists: ' + this.__soloists.map(function(c)  {return c.socket.id}) + '\n'
      + 'this.__unselectable: ' + this.__unselectable.map(function(c)  {return c.socket.id})
    );
  };

  proto$0.unselectableObserver = function(changes) {
    if (changes[0].addedCount > 0 && this.needSoloist() && this.__urn.length === 0)
      this.transferUnselectedToUrn();
  };

  proto$0.urnObserver = function(changes) {
    if (changes[0].addedCount > 0 && this.needSoloist())
      this.addSoloist();
    if (changes[0].removed.length > 0 && this.__urn.length === 0 && this.__unselectable.length > 0)
      this.transferUnselectedToUrn();
  };

MIXIN$0(ServerSoloistManagerRandomUrn.prototype,proto$0);proto$0=void 0;return ServerSoloistManagerRandomUrn;})(ServerSoloistManager);

module.exports = ServerSoloistManagerRandomUrn;