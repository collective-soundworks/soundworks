import serviceManager from '../core/serviceManager';
import Service from '../core/Service';
import client from '../core/client';


const SERVICE_ID = 'service:shared-config';

/**
 * Interface of the client `'shared-config'` service.
 *
 * This service allows to share parts of the server configuration to the clients.
 *
 * __*The service must be used with its [server-side counterpart]{@link module:soundworks/server.SharedConfig}*__
 *
 * @param {Object} options
 * @param {Array<String>} options.items - List of the configuration items
 *  required by the server. The given strings follow a convention defining a path
 *  to the required configuration item, for example `'setup.area'` will retrieve
 *  the value (here an object) corresponding to the `area` key inside the `setup`
 *  entry of the server configuration.
 *
 * @memberof module:soundworks/client
 * @example
 * // inside the experience constructor
 * this.sharedConfig = this.require('shared-config', { items: ['setup.area'] });
 * // when the experience has started
 * const areaWidth = this.sharedConfig.get('setup.area.width');
 */
class SharedConfig extends Service {
  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  constructor() {
    super(SERVICE_ID, true);

    /**
     * Configuration items required by the client.
     * @type {Array}
     * @private
     */
    this._items = [];

    this._onConfigResponse = this._onConfigResponse.bind(this);
  }

  /** @private */
  configure(options) {
    if (options.items) {
      this._items = this._items.concat(options.items);
      delete options.items;
    }

    super.configure(options);
  }

  /** @private */
  init() {
    /**
     * Object containing all the configuration items shared by the server. The
     * object is flattened in order to minimize the needed communications between
     * the client and the server.
     * @type {Object}
     */
    this.data = null;
  }

  /** @private */
  start() {
    super.start();

    if (!this.hasStarted)
      this.init();

    this.send('request', this._items);
    this.receive('config', this._onConfigResponse);
  }

  /** @private */
  _onConfigResponse(data) {
    this.data = client.config = data;
    this.ready();
  }

  /**
   * Retrieve a configuration value from its key item, as defined in server side
   * service's `addItem` method or in client-side `items` option.
   * @param {String} item - Key to the configuration item (_ex:_ `'setup.area'`)
   * @return {Mixed}
   */
  get(item) {
    const parts = item.split('.');
    let tmp = this.data;

    parts.forEach((attr) => tmp = tmp[attr]);

    return tmp;
  }
}

serviceManager.register(SERVICE_ID, SharedConfig);

export default SharedConfig;
