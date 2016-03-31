import debug from 'debug';
import osc from 'osc';
import Activity from '../core/Activity';
import serviceManager from '../core/serviceManager';


const log = debug('soundworks:osc');
const SERVICE_ID = 'service:osc';

/**
 * Interface of the server `'osc'` service.
 *
 * This server-only service provides support for OSC communications with an extenal
 * software (e.g. Max). The configuration of the service (url and port) should be
 * defined in the server configuration, cf. {@link module:soundworks/server.envConfig}.
 *
 * The service currently only supports UDP protocol.
 *
 * @memberof module:soundworks/server
 * @example
 * // inside the experience constructor
 * this.osc = this.require('osc');
 * // when the experience has started, listen for incomming message
 * this.osc.receive('/osc/channel1', (values) => {
 *   // do something with `values`
 * });
 * // send a message
 * this.osc.send('/osc/channel2', [0.618, true]);
 */
class Osc extends Activity {
  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  constructor() {
    super(SERVICE_ID);

    const defaults = {
      oscConfigItem: 'osc',
      // protocol: 'udp',
    }

    this.configure(defaults);

    this._listeners = [];
    this._sharedConfigService = this.require('shared-config');

    this._onMessage = this._onMessage.bind(this);
  }

  /** @private */
  start() {
    const oscConfig = this._sharedConfigService.get(this.options.oscConfigItem);

    this.osc = new osc.UDPPort({
      // This is the port we're listening on.
      localAddress: oscConfig.receiveAddress,
      localPort: oscConfig.receivePort,
      // This is the port we use to send messages.
      remoteAddress: oscConfig.sendAddress,
      remotePort: oscConfig.sendPort,
    });

    this.osc.on('ready', () => {
      const receive = `${oscConfig.receiveAddress}:${oscConfig.receivePort}`;
      const send = `${oscConfig.sendAddress}:${oscConfig.sendPort}`;

      log(`[OSC over UDP] Receiving on ${receive}`);
      log(`[OSC over UDP] Sending on ${send}`);
    });

    this.osc.on('message', this._onMessage);
    this.osc.open();
  }

  /**
   * Apply all the listeners according to the address of the message.
   * @private
   */
  _onMessage(msg) {
    this._listeners.forEach((listener) => {
      if (msg.address === listener.address)
        listener.callback(...msg.args)
    });

    log(`message - address "${msg.address}"`, ...msg.args);
  }

  /**
   * Send an OSC message.
   * @param {String} address - Address of the OSC message.
   * @param {Array} args - Arguments of the OSC message.
   * @param {String} [url=null] - URL to send the OSC message to (if not specified,
   *  uses the port defined in the OSC configuration of the {@link server}).
   * @param {Number} [port=null]- Port to send the message to (if not specified,
   *  uses the port defined in the OSC configuration of the {@link server}).
   */
  send(address, args, url = null, port = null) {
    const msg = { address, args };

    try {
      if (url && port)
        this.osc.send(msg, url, port);
      else
        this.osc.send(msg); // use defaults (as defined in the config)
    } catch (e) {
      console.log('Error while sending OSC message:', e);
    }

    log(`send - address "${address}"`, ...args);
  }

  /**
   * Register callbacks for OSC mesages. The server listens for OSC messages
   * at the address and port defined in the configuration of the {@link server}.
   * @param {String} address - Wildcard of the OSC message.
   * @param {Function} callback - Callback function to be executed when an OSC
   *  message is received on the given address.
   */
  receive(address, callback) {
    const listener = { address, callback }
    this._listeners.push(listener);
  }

  /**
   * @todo - implement
   * @private
   */
  removeListener(address, callback) {}
}

serviceManager.register(SERVICE_ID, Osc);

export default Osc;
