/**
 * @fileoverview Matrix client side socket i/o (singleton)
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
"use strict";

var client = {
  init: init,
  start: start,
  socket: null,
  serial: serial,
  parallel: parallel
};

var EventEmitter = require('events').EventEmitter;
var ClientModule = require('./ClientModule');

class ParallelModule extends ClientModule {
  constructor(modules) {
    super('parallel', false);
    this.modules = modules;
    this.doneCount = 0;
  }

  start() {
    super.start();

    // start all setups
    for (let mod of this.modules) {
      mod.on('done', () => {
        this.doneCount++;

        if (this.doneCount === this.modules.length)
          this.done();
      });

      mod.start();
    }
  }
}

class SerialModule extends ClientModule {
  constructor(modules) {
    super('serial', false);
    this.modules = modules;
  }

  start() {
    super.start();

    var lastModule = null;

    // start all setups
    for (let mod of this.modules) {
      if (lastModule) {
        lastModule.on('done', () => {
          mod.start();
        });
      } else {
        mod.start();
      }

      lastModule = mod;
    }

    lastModule.on('done', () => {
      this.done();
    });
  }
}

function init(namespace) {
  client.socket = io(namespace);
}

function start(theModule) {
  var socket = client.socket;

  // client/server handshake: send "ready" to server ...
  socket.emit('client_ready');

  // ... wait for server's "start" ("server ready") to start modules
  socket.on('server_ready', () => {
    theModule.start();
  });
}

function serial(...modules) {
  return new SerialModule(modules);
}

function parallel(...modules) {
  return new ParallelModule(modules);
}

module.exports = client;