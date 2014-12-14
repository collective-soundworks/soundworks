/**
 * @fileoverview Matrix client side performance manager base class
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ClientPerformance = require('./ClientPerformance');
var inputModule = require('./inputModule');
var ioClient = require('./ioClient');

class ClientPerformanceSoloists extends ClientPerformance {
  constructor(params) {
    super(params);

    var socket = ioClient.socket;

    socket.on('soloists_init', (soloistList) => {
      this.initSoloists(soloistList);
    });

    socket.on('soloist_add', (soloist) => {
      this.addSoloist(soloist);
    });

    socket.on('soloist_remove', (soloist) => {
      this.removeSoloist(soloist);
    });
  }

  initSoloists(soloistList) {

  }

  addSoloist(soloist) {

  }

  removeSoloist(soloist) {

  }
}

module.exports = ClientPerformanceSoloists;