import debug from 'debug';
import osc from 'osc';
import ServerActivity from '../core/ServerActivity';
import serverServiceManager from '../core/serverServiceManager';


const log = debug('soundworks:osc');
const SERVICE_ID = 'service:osc';

/**
 * Server only service for OSC communications withw external softwares
 * (e.g. Max). Only support UDP protocol.
 * @todo - define if other protocols should be supported.
 */
class Osc extends ServerActivity {
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

    // log(`message - address "${msg.address}"`, ...msg.args);
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
   * Register callbacks for OSC mesages. The server listens to OSC messages
   * at the address and port defined in the configuration of the {@link server}.
   * @param {String} wildcard - Wildcard of the OSC message.
   * @param {Function} callback - Callback function to be executed when an OSC
   *  message is received on the given address.
   */
  receive(address, callback) {
    const listener = { address, callback }
    this._listeners.push(listener);
  }

  /**
   * @todo - implement
   */
  broadcast() {}
}

serverServiceManager.register(SERVICE_ID, Osc);

export default Osc;

