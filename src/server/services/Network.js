import Activity from '../core/Activity';
import serviceManager from '../core/serviceManager';

const SERVICE_ID = 'service:network';

/**
 * Interface of the server `'network'` service.
 *
 * This service provides a generic way to create client to client communications
 * through websockets without server side custom code.
 *
 * __*The service must be used with its [client-side counterpart]{@link module:soundworks/client.Network}*__
 *
 * @memberof module:soundworks/server
 * @example
 * // inside the experience constructor
 * this.network = this.require('network');
 */
class Network extends Activity {
  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  constructor() {
    super(SERVICE_ID);
  }

  /** @private */
  connect(client) {
    super.connect(client);

    this.receive(client, 'send', this._onSend(client));
    this.receive(client, 'broadcast', this._onBroadcast(client));
  }

  /** @private */
  _onSend(client) {
    return (values) => {
      const clientTypes = values.shift();
      this.broadcast(clientTypes, client, 'receive', ...values);
    }
  }

  /** @private */
  _onBroadcast(client) {
    return (values) => this.broadcast(null, client, 'receive', ...values);
  }
}

serviceManager.register(SERVICE_ID, Network);

export default Network;
