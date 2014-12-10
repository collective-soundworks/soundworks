/**
 * @fileoverview Matrix server side soloist manager randomly assigning soloists using an urn
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ServerSoloistManager = require('./ServerSoloistManager');
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

class ServerSoloistManagerRandomUrn extends ServerSoloistManager {
  constructor() {
    super();

    this.idlePeriodLength = 2000; // in milliseconds
    this.simultaneousSoloists = 2;
    this.soloistPerformanceLength = 4000; // in milliseconds

    this.availableSoloists = createIdentityArray(this.simultaneousSoloists);

    this.soloists = [];
    this.unselectable = [];
    this.urn = [];
  }

  init(playerManager) {
    this.urn = playerManager.playing.slice();

    Array.observe(this.urn, this.urnObserver.bind(this));
    Array.observe(this.unselectable, this.unselectableObserver.bind(this));
    Array.observe(this.soloists, this.soloistsObserver.bind(this));
  }

  addPlayer(player) {
    this.urn.push(player);
    this.addSocketListener(player);
    player.socket.emit('soloists_set', this.soloists.map((s) => s.getInfo()));

    // console.log(
    //   '[RandomUrnServerSoloistManager][addPlayer] Player ' + player.socket.id + ' added.\n' +
    //   'this.urn: ' + this.urn.map((c) => c.socket.id) + '\n' +
    //   'this.soloists: ' + this.soloists.map((c) => c.socket.id) + '\n' +
    //   'this.unselectable: ' + this.unselectable.map((c) => c.socket.id)
    // );
  }

  addSocketListener(player) {
    player.socket.on('touchstart', () => {
      if (!player.publicState.hasPlayed) {
        clearTimeout(player.privateState.timeout);
        player.privateState.timeout = setTimeout(() => {
          this.removeSoloist(player);
        }, this.soloistPerformanceLength);
      }
    });
  }

  addSoloist() {
    var io = ioServer.io;
    if (this.needSoloist() && this.urn.length > 0) {
      let soloistId = this.availableSoloists.splice(0, 1)[0];
      let index = getRandomInt(0, this.urn.length - 1);
      let player = this.urn.splice(index, 1)[0];
      io.of('/play').emit('soloist_add', player.getInfo());

      player.publicState.soloistId = soloistId;
      player.privateState.timeout = setTimeout(() => {
        this.removeSoloist(player);
      }, this.idlePeriodLength);

      this.soloists.push(player);

      // console.log(
      //   '[RandomUrnServerSoloistManager][addSoloist] Soloist ' + player.socket.id + ' added.\n' +
      //   'this.urn: ' + this.urn.map((c) => c.socket.id) + '\n' +
      //   'this.soloists: ' + this.soloists.map((c) => c.socket.id) + '\n' +
      //   'this.unselectable: ' + this.unselectable.map((c) => c.socket.id)
      // );
    } else {
      // console.log("[RandomUrnServerSoloistManager][addSoloist] No soloist to add.")
    }
  }

  needSoloist() {
    return this.availableSoloists.length > 0;
  }

  removePlayer(player) {
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
      // console.log('[RandomUrnServerSoloistManager][removePlayer] Player ' + player.socket.id + 'not found.');
    }

    // console.log("this.availableSoloists", this.availableSoloists);

    // console.log(
    //   '[RandomUrnServerSoloistManager][removePlayer] Player ' + player.socket.id + ' removed.\n' +
    //   'this.urn: ' + this.urn.map((c) => c.socket.id) + '\n' +
    //   'this.soloists: ' + this.soloists.map((c) => c.socket.id) + '\n' +
    //   'this.unselectable: ' + this.unselectable.map((c) => c.socket.id)
    // );
  }

  removeSoloist(soloist) {
    var io = ioServer.io;
    var index = this.soloists.indexOf(soloist);
    if (index > -1) {
      let soloist = this.soloists.splice(index, 1)[0];
      this.availableSoloists.push(soloist.publicState.soloistId);
      soloist.publicState.soloist = null;
      this.unselectable.push(soloist);
      io.of('/play').emit('soloist_remove', soloist.getInfo());

      // console.log(
      //   '[RandomUrnServerSoloistManager][removeSoloist] Soloist ' + soloist.socket.id + ' removed.\n' +
      //   'this.urn: ' + this.urn.map((c) => c.socket.id) + '\n' +
      //   'this.soloists: ' + this.soloists.map((c) => c.socket.id) + '\n' +
      //   'this.unselectable: ' + this.unselectable.map((c) => c.socket.id)
      // );

    } else {
      // console.log("[RandomUrnServerSoloistManager][removeSoloist] Player " + soloist.socket.id + "not found in this.soloists.");
    }
  }

  soloistsObserver(changes) {
    if (changes[0].removed.length > 0 && this.needSoloist())
      this.addSoloist();
  }

  transferUnselectedToUrn() {
    while (this.unselectable.length > 0) // TODO: change this push the whole array at once
      this.urn.push(this.unselectable.pop());
    // this.urn.splice(0, 0, this.unselectable[0]);
    // clearArray(this.unselectable);

    // console.log(
    //   '[RandomUrnServerSoloistManager][transferUnselectedToUrn]\n' +
    //   'this.urn: ' + this.urn.map((c) => c.socket.id) + '\n' +
    //   'this.soloists: ' + this.soloists.map((c) => c.socket.id) + '\n' +
    //   'this.unselectable: ' + this.unselectable.map((c) => c.socket.id)
    // );
  }

  unselectableObserver(changes) {
    if (changes[0].addedCount > 0 && this.needSoloist() && this.urn.length === 0)
      this.transferUnselectedToUrn();
  }

  urnObserver(changes) {
    if (changes[0].addedCount > 0 && this.needSoloist())
      this.addSoloist();
    if (changes[0].removed.length > 0 && this.urn.length === 0 && this.unselectable.length > 0)
      this.transferUnselectedToUrn();
  }

}

module.exports = ServerSoloistManagerRandomUrn;