import serviceManager from '../core/serviceManager';
import Service from '../core/Service';


const SERVICE_ID = 'service:shared-config';

class ClientSharedConfig extends Service {
  constructor() {
    super(SERVICE_ID, true);
  }

  init() {
    this.data = null;
  }

  start() {
    super.start();

    if (!this.hasStarted)
      this.init();

    this.send('request');

    this.receive('config', (data) => {
      this.data = data;
    });
  }

  get(path) {
    return this.data[path];
  }
}

serviceManager.register(SERVICE_ID, ClientSharedConfig);

export default ClientSharedConfig;
