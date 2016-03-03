import serviceManager from '../core/serviceManager';
import Service from '../core/Service';
import client from '../core/client';


const SERVICE_ID = 'service:shared-config';

/**
 * This service allows to retrieve part of the server configuration to client.
 */
class ClientSharedConfig extends Service {
  constructor() {
    super(SERVICE_ID, true);

    /**
     * Configuration items required by the client.
     * @type {Array}
     */
    this._items = [];

    this._onConfigResponse = this._onConfigResponse.bind(this);
  }

  /** @inheritdoc */
  configure(options) {
    if (options.items) {
      this._items = this._items.concat(options.items);
      delete options.items;
    }

    super.configure(options);
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

    this.send('request', this._items);
    this.receive('config', this._onConfigResponse);
  }

  /**
   * Retrieve a configuration value from its key item, as defined in server side
   * service's `addItem` method.
   * @param {String} item - The item of the configuration (ex: `'setup.area'`)
   * @return {Mixed}
   */
  get(item) {
    const parts = item.split('.');
    let tmp = this.data;

    parts.forEach((attr) => tmp = tmp[attr]);

    return tmp;
  }

  _onConfigResponse(data) {
    this.data = client.config = data;
    this.ready();
  }
}

serviceManager.register(SERVICE_ID, ClientSharedConfig);

export default ClientSharedConfig;
