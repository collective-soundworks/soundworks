import serviceManager from '../core/serviceManager';
import Service from '../core/Service';


const SERVICE_ID = 'service:shared-config';

/**
 * This service allows to retrieve part of the server configuration to client.
 */
class ClientSharedConfig extends Service {
  constructor() {
    super(SERVICE_ID, true);

    this._onConfigResponse = this._onConfigResponse.bind(this);
  }

  /** @inheritdoc */
  init() {
    this.data = null;
  }

  /** @inheritdoc */
  start() {
    super.start();

    if (!this.hasStarted)
      this.init();

    this.send('request');
    this.receive('config', this._onConfigResponse);
  }

  /**
   * Retrieve a configuration entry from its path, as defined in server side
   * service's `addItem` method.
   * @param {String} path - The path of the configuration (ex: `'setup.area'`)
   * @return {Mixed}
   */
  get(path) {
    return this.data[path];
  }

  _onConfigResponse(data) {
    this.data = data;
    this.ready();
  }
}

serviceManager.register(SERVICE_ID, ClientSharedConfig);

export default ClientSharedConfig;
