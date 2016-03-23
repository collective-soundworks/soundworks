import Service from '../core/Service';
import serviceManager from '../core/serviceManager';

const SERVICE_ID = 'service:network';

/**
 * Interface of the client `'network'` service.
 *
 * This service provides a generic way to create client to client communications
 * through websockets without server side custom code.
 *
 * __*The service must be used with its [server-side counterpart]{@link module:soundworks/server.Network}*__
 *
 * @memberof module:soundworks/client
 * @example
 * // inside the experience constructor
 * this.network = this.require('network');
 * // when the experience has started, listen for events
 * this.network.receive('my:channel', (...args) => {
 *   // do something with `args`
 * });
 * // somewhere in the experience
 * this.network.send('player', 'my:channel', 42, false);
 */
class Network extends Service {
  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  constructor() {
    super(SERVICE_ID, true);

    const defaults = {};
    this.configure(defaults);

    this._listeners = {};
  }

  /** @private */
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

  /**
   * Send a message to given client type(s).
   * @param {String|Arrayw<String>} clientTypes - Client type(s) to send the
   *  message to.
   * @param {String} channel - Channel of the message.
   * @param {...Mixed} values - Values to send in the message.
   */
  send(clientTypes, channel, ...values) {
    values.unshift(clientTypes, channel);
    super.send('send', values);
  }

  /**
   * Send a message to all connected clients.
   * @param {String} channel - Channel of the message.
   * @param {...Mixed} values - Values to send in the message.
   */
  broadcast(channel, ...values) {
    values.unshift(channel);
    super.send('broadcast', values);
  }

  /**
   * Register a callback to be executed when a message is received on a given
   * channel.
   * @param {String} channel - Channel to listen to.
   * @param {Function} callback - Function to execute when a message is received.
   */
  receive(channel, callback) {
    if (!this._listeners[channel])
      this._listeners[channel] = [];

    this._listeners[channel].push(callback);
  }

  /**
   * Remove a callback from listening a given channel.
   * @param {String} channel - Channel to stop listening to.
   * @param {Function} callback - The previously registered callback function.
   */
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
