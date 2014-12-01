var ServerSoloistManager = require('./ServerSoloistManager');
var server = require('./ServerIOSingleton');
var utils = require('./ServerUtils');

'use strict';

class ServerSoloistManagerRandomUrn extends ServerSoloistManager {
  constructor(clientManager) {
    super(clientManager);

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
  }

  addPlayer(client) {
    this.__urn.push(client);
    this.addSocketListener(client);
    client.socket.emit('current_soloists', this.__soloists.map((s) => s.getInfo()));

    console.log(
      '[RandomUrnServerSoloistManager][addPlayer] Player ' + client.socket.id + ' added.\n'
      + 'this.__urn: ' + this.__urn.map((c) => c.socket.id) + '\n'
      + 'this.__soloists: ' + this.__soloists.map((c) => c.socket.id) + '\n'
      + 'this.__unselectable: ' + this.__unselectable.map((c) => c.socket.id)
    );
  }

  addSocketListener(player) {
    player.socket.on('touchstart', () => {
      if (!player.userData.hasPlayed) {
        clearTimeout(player.__userData.timeout);
        player.__userData.timeout = setTimeout(() => {
          this.removeSoloist(player);
        }, this.__soloistPerformanceLength);
      }
    })
  }

  addSoloist() {
    if (this.needSoloist() && this.__urn.length > 0) {
      let soloistId = this.__availableSoloists.splice(0, 1)[0];
      let index = utils.getRandomInt(0, this.__urn.length - 1);
      let player = this.__urn.splice(index, 1)[0];
      server.io.of('/play').emit('new_soloist', player.getInfo());

      player.userData.soloistId = soloistId;
      player.__userData.timeout = setTimeout(() => {
        this.removeSoloist(player);
      }, this.__idlePeriodLength);

      this.__soloists.push(player);

      console.log(
        '[RandomUrnServerSoloistManager][addSoloist] Soloist ' + player.socket.id + ' added.\n'
        + 'this.__urn: ' + this.__urn.map((c) => c.socket.id) + '\n'
        + 'this.__soloists: ' + this.__soloists.map((c) => c.socket.id) + '\n'
        + 'this.__unselectable: ' + this.__unselectable.map((c) => c.socket.id)
      );
    } else {
      console.log("[RandomUrnServerSoloistManager][addSoloist] No soloist to add.")
    }
  }

  needSoloist() {
    return this.__availableSoloists.length > 0;
  }

  removePlayer(client) {
    var indexUrn = this.__urn.indexOf(client);
    var indexSoloist = this.__soloists.indexOf(client);
    var indexUnselectable = this.__unselectable.indexOf(client);
    var playerArray = null;

    if (indexUrn > -1) 
      this.__urn.splice(indexUrn, 1);
    else if (indexUnselectable > -1)
      this.__unselectable.splice(indexUnselectable, 1);
    else if (indexSoloist > -1) {
      let soloist = this.__soloists.splice(indexSoloist, 1)[0];
      this.__availableSoloists.push(soloist.userData.soloistId)
      soloist.userData.soloist = {};
      server.io.of('/play').emit('remove_soloist', soloist.getInfo());
    } else {
      console.log('[RandomUrnServerSoloistManager][removePlayer] Player ' + client.socket.id + 'not found.');
    }

    console.log("this.__availableSoloists", this.__availableSoloists);

    console.log(
      '[RandomUrnServerSoloistManager][removePlayer] Player ' + client.socket.id + ' removed.\n'
        + 'this.__urn: ' + this.__urn.map((c) => c.socket.id) + '\n'
        + 'this.__soloists: ' + this.__soloists.map((c) => c.socket.id) + '\n'
        + 'this.__unselectable: ' + this.__unselectable.map((c) => c.socket.id)
    );
  }

  removeSoloist(soloist) {
    var index = this.__soloists.indexOf(soloist);
    if (index > -1) {
      let soloist = this.__soloists.splice(index, 1)[0];
      this.__availableSoloists.push(soloist.userData.soloistId)
      soloist.userData.soloist = null;
      this.__unselectable.push(soloist);
      server.io.of('/play').emit('remove_soloist', soloist.getInfo());

      console.log(
        '[RandomUrnServerSoloistManager][removeSoloist] Soloist ' + soloist.socket.id + ' removed.\n'
        + 'this.__urn: ' + this.__urn.map((c) => c.socket.id) + '\n'
        + 'this.__soloists: ' + this.__soloists.map((c) => c.socket.id) + '\n'
        + 'this.__unselectable: ' + this.__unselectable.map((c) => c.socket.id)
      );

    } else {
      console.log("[RandomUrnServerSoloistManager][removeSoloist] Player " + soloist.socket.id + "not found in this.__soloists.");
    }
  }

  soloistsObserver(changes) {
    if (changes[0].removed.length > 0 && this.needSoloist())
      this.addSoloist();
  }

  transferUnselectedToUrn() {
    while (this.__unselectable.length > 0) // TODO: change this push the whole array at once
      this.__urn.push(this.__unselectable.pop());
    // this.__urn.splice(0, 0, this.__unselectable[0]);
    // utils.clearArray(this.__unselectable);

    console.log(
      '[RandomUrnServerSoloistManager][transferUnselectedToUrn]\n'
      + 'this.__urn: ' + this.__urn.map((c) => c.socket.id) + '\n'
      + 'this.__soloists: ' + this.__soloists.map((c) => c.socket.id) + '\n'
      + 'this.__unselectable: ' + this.__unselectable.map((c) => c.socket.id)
    );
  }

  unselectableObserver(changes) {
    if (changes[0].addedCount > 0 && this.needSoloist() && this.__urn.length === 0)
      this.transferUnselectedToUrn();
  }

  urnObserver(changes) {
    if (changes[0].addedCount > 0 && this.needSoloist())
      this.addSoloist();
    if (changes[0].removed.length > 0 && this.__urn.length === 0 && this.__unselectable.length > 0)
      this.transferUnselectedToUrn();
  }

}

module.exports = ServerSoloistManagerRandomUrn;