/**
 * @fileoverview Soundworks server side conductor module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ServerModule = require('./ServerModule');
var server = require('./server');

class ServerConductor extends ServerModule {
  constructor() {
    this.controls = {};
    this.commands = {};
    this.displays = {};
  }

  addControlNumber(name, label, min, max, step, init) {
    this.controls[name] = {
      type: 'number',
      name: name,
      label: label,
      min: min,
      max: max,
      step: step,
      value: init
    };
  }

  addControlSelect(name, label, options, init) {
    this.controls[name] = {
      type: 'select',
      name: name,
      label: label,
      options: options,
      value: init
    };
  }

  addCommand(name, label, fun) {
    this.commands[name] = {
      name: name,
      label: label,
      fun: fun
    };
  }

  addDisplay(name, label, init) {
    this.displays[name] = {
      name: name,
      label: label,
      value: init
    };
  }

  connect(client) {
    var socket = client.socket;

    // listen to conductor parameters
    for (let key of Object.keys(this.controls)) {
      socket.on('conductor_control', (name, val) => {
        this.controls[name].value = val;

        // send conductor control parameter to conductor clients
        socket.broadcast.emit('conductor_control', name, val);

        // propagate control parameter to players
        server.io.of('/player').emit('conductor_control', name, val);
      });
    }

    // listen to conductor commands
    for (let key of Object.keys(this.commands)) {
      socket.on('conductor_command', (name) => {
        this.commands[name].fun();
      });
    }

    // init conductor controls, displays, and commands at conductor client
    socket.emit("conductor_init", this.controls, this.displays, this.commands);
  }
}

module.exports = ServerConductor;