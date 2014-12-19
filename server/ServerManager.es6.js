/**
 * @fileoverview Matrix server side manager
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ServerSetupMulti = require('./ServerSetupMulti');
var ioServer = require('./ioServer');

class ServerManager {
  constructor(namespace, setup, performance, topology) {

    if (Array.isArray(setup))
      setup = new ServerSetupMulti(setup);

    this.topology = topology;
    this.setup = setup;
    this.performance = performance;

    performance.managers[namespace] = this;

    var io = ioServer.io;
    io.of(namespace).on('connection', (socket) => {
      var client = this.connect(socket);

      socket.on('client_ready', () => {
        this.ready(socket, client);
      });

      socket.on('disconnect', () => {
        this.disconnect(socket, client);
      });

      // start client
      socket.emit('client_start');
    });
  }

  connect(socket) {
    var client = null;
    return client;
  }

  ready(socket, client) {

  }

  disconnect(socket, client) {

  }
}

module.exports = ServerManager;