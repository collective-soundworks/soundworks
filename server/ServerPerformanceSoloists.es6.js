/**
 * @fileoverview Matrix server side soloist manager randomly assigning soloists using an urn
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ServerPerformance = require('./ServerPerformance');
var ioServer = require('./ioServer');

function clearArray(a) {
  while (a.length > 0)
    a.pop();
}

function createIdentityArray(n) {
  var a = [];
  for (let i = 0; i < n; i++) {
    a.push(i);
  }
  return a;
}

function getRandomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

// TODO: add other modes than 'randomurn'
class ServerPerformanceSoloist extends ServerPerformance {
  constructor(params = {}) {
    super();

    this.idleDuration = params.idleDuration || 2000; // in milliseconds
    this.numSoloists = params.numSoloists || 2;
    this.soloistDuration = params.soloDuration || 4000; // in milliseconds

    this.availableSoloists = createIdentityArray(this.numSoloists);

    this.soloists = [];
    this.unselectable = [];
    this.urn = [];

    Array.observe(this.urn, (changes) => {
      if (changes[0].addedCount > 0 && this.__needSoloist())
        this.__addSoloist();

      if (changes[0].removed.length > 0 && this.urn.length === 0 && this.unselectable.length > 0)
        this.__transferUnselectedToUrn();
    });

    Array.observe(this.unselectable, (changes) => {
      if (changes[0].addedCount > 0 && this.__needSoloist() && this.urn.length === 0)
        this.__transferUnselectedToUrn();
    });

    Array.observe(this.soloists, (changes) => {
      if (changes[0].removed.length > 0 && this.__needSoloist())
        this.__addSoloist();
    });
  }

  connect(socket, player) {
    this.urn.push(player);
    this.__addSocketListener(player);
    player.socket.emit('soloists_init', this.soloists.map((s) => s.getInfo()));

    // console.log(
    //   '[ServerPerformanceSoloist][connect] Player ' + player.socket.id + ' added.\n' +
    //   'this.urn: ' + this.urn.map((c) => c.socket.id) + '\n' +
    //   'this.soloists: ' + this.soloists.map((c) => c.socket.id) + '\n' +
    //   'this.unselectable: ' + this.unselectable.map((c) => c.socket.id)
    // );
  }

  disconnect(socket, player) {
    var io = ioServer.io;
    var indexUrn = this.urn.indexOf(player);
    var indexSoloist = this.soloists.indexOf(player);
    var indexUnselectable = this.unselectable.indexOf(player);
    var playerArray = null;

    if (indexUrn > -1)
      this.urn.splice(indexUrn, 1);
    else if (indexUnselectable > -1)
      this.unselectable.splice(indexUnselectable, 1);
    else if (indexSoloist > -1) {
      let soloist = this.soloists.splice(indexSoloist, 1)[0];
      this.availableSoloists.push(soloist.publicState.soloistId);
      soloist.publicState.soloist = null;
      io.of('/play').emit('soloist_remove', soloist.getInfo());
    } else {
      // console.log('[ServerPerformanceSoloist][disconnect] Player ' + player.socket.id + 'not found.');
    }

    // console.log("this.availableSoloists", this.availableSoloists);

    // console.log(
    //   '[ServerPerformanceSoloist][disconnect] Player ' + player.socket.id + ' removed.\n' +
    //   'this.urn: ' + this.urn.map((c) => c.socket.id) + '\n' +
    //   'this.soloists: ' + this.soloists.map((c) => c.socket.id) + '\n' +
    //   'this.unselectable: ' + this.unselectable.map((c) => c.socket.id)
    // );
  }

  __addSocketListener(player) {
    player.socket.on('touchstart', () => {
      if (!player.publicState.hasPlayed) {
        clearTimeout(player.privateState.timeout);
        player.privateState.timeout = setTimeout(() => {
          this.__removeSoloist(player);
        }, this.soloistDuration);
      }
    });
  }

  __addSoloist() {
    var io = ioServer.io;
    if (this.__needSoloist() && this.urn.length > 0) {
      let soloistId = this.availableSoloists.splice(0, 1)[0];
      let index = getRandomInt(0, this.urn.length - 1);
      let player = this.urn.splice(index, 1)[0];
      io.of('/play').emit('soloist_add', player.getInfo());

      player.publicState.soloistId = soloistId;
      player.privateState.timeout = setTimeout(() => {
        this.__removeSoloist(player);
      }, this.idleDuration);

      this.soloists.push(player);

      // console.log(
      //   '[ServerPerformanceSoloist][addSoloist] Soloist ' + player.socket.id + ' added.\n' +
      //   'this.urn: ' + this.urn.map((c) => c.socket.id) + '\n' +
      //   'this.soloists: ' + this.soloists.map((c) => c.socket.id) + '\n' +
      //   'this.unselectable: ' + this.unselectable.map((c) => c.socket.id)
      // );
    } else {
      // console.log("[ServerPerformanceSoloist][addSoloist] No soloist to add.")
    }
  }

  __removeSoloist(soloist) {
    var io = ioServer.io;
    var index = this.soloists.indexOf(soloist);

    if (index > -1) {
      soloist = this.soloists.splice(index, 1)[0];
      this.availableSoloists.push(soloist.publicState.soloistId);
      soloist.publicState.soloist = null;
      this.unselectable.push(soloist);
      io.of('/play').emit('soloist_remove', soloist.getInfo());

      // console.log(
      //   '[ServerPerformanceSoloist][removeSoloist] Soloist ' + soloist.socket.id + ' removed.\n' +
      //   'this.urn: ' + this.urn.map((c) => c.socket.id) + '\n' +
      //   'this.soloists: ' + this.soloists.map((c) => c.socket.id) + '\n' +
      //   'this.unselectable: ' + this.unselectable.map((c) => c.socket.id)
      // );

    } else {
      // console.log("[ServerPerformanceSoloist][removeSoloist] Player " + soloist.socket.id + "not found in this.soloists.");
    }
  }

  __transferUnselectedToUrn() {
    while (this.unselectable.length > 0) // TODO: change this push the whole array at once
      this.urn.push(this.unselectable.pop());
    // this.urn.splice(0, 0, this.unselectable[0]);
    // clearArray(this.unselectable);

    // console.log(
    //   '[ServerPerformanceSoloist][transferUnselectedToUrn]\n' +
    //   'this.urn: ' + this.urn.map((c) => c.socket.id) + '\n' +
    //   'this.soloists: ' + this.soloists.map((c) => c.socket.id) + '\n' +
    //   'this.unselectable: ' + this.unselectable.map((c) => c.socket.id)
    // );
  }

  __needSoloist() {
    return this.availableSoloists.length > 0;
  }
}

module.exports = ServerPerformanceSoloist;