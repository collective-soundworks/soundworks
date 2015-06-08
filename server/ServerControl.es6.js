/**
 * @fileoverview Soundworks server side control module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var ServerModule = require('./ServerModule');
var server = require('./server');

class ServerControl extends ServerModule {
  constructor(options = {}) {
    super(options.name || 'control');

    this.parameters = {};
    this.commands = {};
    this.infos = {};
    this.clientTypes = [];
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

  addInfo(name, label, init) {
    this.infos[name] = {
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
      for (let clientType of this.clientTypes)
        server.broadcast(clientType, 'control' + ':parameter', name, value);
    }
  }

  setInfo(name, value) {
    var info = this.infos[name];

    if (info) {
      info.value = value;

      // send info to other clients
      for (let clientType of this.clientTypes)
        server.broadcast(clientType, 'control' + ':info', name, value);
    }
  }

  connect(client) {
    super.connect(client);

    var clientType = client.type;

    if (this.clientTypes.indexOf(clientType) < 0)
      this.clientTypes.push(clientType);

    // init control parameters, infos, and commands at client
    client.receive('control' + ':request', () => {
      client.send('control' + ':init', this.parameters, this.infos, this.commands);
    });

    // listen to control parameters
    client.receive('control' + ':parameter', (name, value) => {
      this.parameters[name].value = value;

      // send control parameter to other clients
      for (let clientType of this.clientTypes) {
        server.broadcast(clientType, 'control' + ':parameter', name, value);
      }

      this.emit('control:parameter', name, value);
    });

    // listen to conductor commands
    client.receive('control' + ':command', (name) => {
      this.commands[name].fun();
      this.emit('control:command', name);
    });
  }
}

module.exports = ServerControl;