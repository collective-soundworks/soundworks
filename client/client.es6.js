/**
 * @fileoverview Soundworks client side socket i/o (singleton)
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

    var zIndex = this.modules.length * 100;

    // start all setups
    for (let mod of this.modules) {
      mod.on('done', () => {
        this.doneCount++;

        if (this.doneCount === this.modules.length)
          this.done();
      });

      if (mod.view) {
        mod.view.style.zIndex = zIndex;
        zIndex -= 100;
      }

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

    var prevModule = null;

    // start all module listeners
    for (let mod of this.modules) {
      if (prevModule) {
        prevModule.on('done', () => {
          mod.start();
        });
      }

      prevModule = mod;
    }

    // when last module of sequence is done, the sequence is done
    prevModule.on('done', () => {
      this.done();
    });

    // start first module of the sequence
    this.modules[0].start();
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

  socket.on('disconnect', () => {
  });
}

function serial(...modules) {
  return new SerialModule(modules);
}

function parallel(...modules) {
  return new ParallelModule(modules);
}

module.exports = client;