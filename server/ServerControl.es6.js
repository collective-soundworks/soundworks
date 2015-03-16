/**
 * @fileoverview Soundworks server side control module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ServerModule = require('./ServerModule');
var server = require('./server');

class ServerControl extends ServerModule {
  constructor() {
    super();

    this.parameters = {};
    this.commands = {};
    this.informations = {};
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

  addInformation(name, label, init) {
    this.informations[name] = {
      name: name,
      label: label,
      value: init
    };
  }

  setParameter(name, value) {
    var parameter = this.parameters[name];

    if (parameter) {
      parameter.value = value;

      // send parameter to other clients
      for (let namespace of this.namespaces)
        namespace.emit('control:parameter', name, value);
    }
  }

  setInformation(name, value) {
    var information = this.informations[name];

    if (information) {
      information.value = value;

      // send information to other clients
      for (let namespace of this.namespaces)
        namespace.emit('control:information', name, value);
    }
  }

  connect(client) {
    super.connect(client);

    var namespace = client.namespace;

    if (this.namespaces.indexOf(namespace) < 0)
      this.namespaces.push(namespace);

    // listen to control parameters
    client.receive('control:parameter', (name, value) => {
      this.parameters[name].value = value;

      // send control parameter to other clients
      for (let namespace of this.namespaces)
        namespace.emit('control:parameter', name, value);
    });

    // listen to conductor commands
    client.receive('control:command', (name) => {
      this.commands[name].fun();
    });

    // init control parameters, informations, and commands at client
    client.send('control:init', this.parameters, this.informations, this.commands);
  }
}

module.exports = ServerControl;