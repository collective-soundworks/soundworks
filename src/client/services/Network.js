/**
 * @todo
 * A generic service for inter-client communications (based on client.type)
 * without server side custom code
 */

import Service from '../core/Service';
import serviceManager from '../core/serviceManager';

const SERVICE_ID = 'service:network';

class Network extends Service {
  constructor() {
    super(SERVICE_ID, true);

    const defaults = {};
    this.configure(defaults);

    this._listeners = {};
  }

  start() {
    super.start();

    // common logic for receivers
    super.receive('receive', (...values) => {
      const channel = values.shift();
      const listeners = this._listeners[channel];

      if (Array.isArray(listeners))
        listeners.forEach((callback) => callback(...values));
    });

    this.ready();
  }

  send(clientTypes, channel, ...values) {
    values.unshift(clientTypes, channel);
    super.send('send', values);
  }

  broadcast(channel, ...values) {
    values.unshift(channel);
    super.send('broadcast', values);
  }

  receive(channel, callback) {
    if (!this._listeners[channel])
      this._listeners[channel] = [];

    this._listeners[channel].push(callback);
  }

  removeListener(channel, callback) {
    const listeners = this._listeners[channel];

    if (Array.isArray(listeners)) {
      const index = listeners.indexOf(callback);

      if (index !== -1)
        listeners.splice(index, 1);
    }
  }
}

serviceManager.register(SERVICE_ID, Network);

export default Network;
