import ServerActivity from '../core/ServerActivity';
import serviceManager from '../core/serviceManager';

const SERVICE_ID = 'service:network';

class ServerNetwork extends ServerActivity {
  constructor() {
    super(SERVICE_ID);
  }

  connect(client) {
    super.connect(client);

    this.receive(client, 'send', this._onSend(client));
    this.receive(client, 'broadcast', this._onBroadcast(client));
  }

  _onSend(client) {
    return (values) => {
      const clientTypes = values.shift();
      this.broadcast(clientTypes, client, 'receive', ...values);
    }
  }

  _onBroadcast(client) {
    return (values) => this.broadcast(null, client, 'receive', ...values);
  }
}

serviceManager.register(SERVICE_ID, ServerNetwork);

export default ServerNetwork;
