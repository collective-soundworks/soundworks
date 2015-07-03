/**
 * @fileoverview Soundworks server side control module
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

const ServerModule = require('./ServerModule');
const server = require('./server');

class ServerControl extends ServerModule {
  constructor(options = {}) {
    super('control');

    this.events = {};
    this.clientTypes = [];
  }

  addNumber(name, label, min, max, step, init, clientTypes = null) {
    this.events[name] = {
      type: 'number',
      name: name,
      label: label,
      min: min,
      max: max,
      step: step,
      value: init,
      clientTypes: clientTypes
    };
  }

  addSelect(name, label, options, init, clientTypes = null) {
    this.events[name] = {
      type: 'select',
      name: name,
      label: label,
      options: options,
      value: init,
      clientTypes: clientTypes
    };
  }

  addInfo(name, label, init, clientTypes = null) {
    this.events[name] = {
      type: 'info',
      name: name,
      label: label,
      value: init,
      clientTypes: clientTypes
    };
  }

  addCommand(name, label, fun, clientTypes = null) {
    this.events[name] = {
      type: 'command',
      name: name,
      label: label,
      value: undefined,
      clientTypes: clientTypes
    };
  }

  broadcast(name, value) {
    let event = this.events[name];

    if (event) {
      event.value = value;

      let clientTypes = event.clientTypes || this.clientTypes;

      // propagate parameter to clients
      for (let clientType of clientTypes)
        server.broadcast(clientType, 'control:event', name, value);

      this.emit('control:event', name, value);
    } else {
      console.log('server control: received unknown event "' + name + '"');      
    }
  }

  connect(client) {
    super.connect(client);

    let clientType = client.type;

    if (this.clientTypes.indexOf(clientType) < 0)
      this.clientTypes.push(clientType);

    // init control parameters, infos, and commands at client
    client.receive('control:request', () => {
      client.send('control:init', this.events);
    });

    // listen to control parameters
    client.receive('control:event', (name, value) => {
      this.broadcast(name, value);
    });
  }
}

module.exports = ServerControl;