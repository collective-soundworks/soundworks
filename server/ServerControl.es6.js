/**
 * @fileoverview Soundworks server side control module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ServerModule = require('./ServerModule');
var server = require('./server');

class ServerControl extends ServerModule {
  constructor() {
    this.parameters = {};
    this.commands = {};
    this.displays = {};
    this.namespaces = [];
  }

  addParameterNumber(name, label, min, max, step, init) {
    this.parameters[name] = {
      type: 'number',
      name: name,
      label: label,
      min: min,
      max: max,
      step: step,
      value: init
    };
  }

  addParameterSelect(name, label, options, init) {
    this.parameters[name] = {
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
    var namespace = socket.nsp;

    if (this.namespaces.indexOf(namespace) < 0)
      this.namespaces.push(namespace);

    // listen to control parameters
    socket.on('control_parameter', (name, val) => {
      this.parameters[name].value = val;

      // send control parameter to other clients
      for(let namespace of this.namespaces)
        namespace.emit('control_parameter', name, val);
    });

    // listen to conductor commands
    socket.on('control_command', (name) => {
      this.commands[name].fun();
    });

    // init control parameters, displays, and commands at client
    socket.emit("control_init", this.parameters, this.displays, this.commands);
  }
}

module.exports = ServerControl;