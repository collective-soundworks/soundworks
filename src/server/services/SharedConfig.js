import Activity from '../core/Activity';
import serviceManager from '../core/serviceManager';
import server from '../core/server';


const SERVICE_ID = 'service:shared-config';

/**
 * Interface of the server `'shared-config'` service.
 *
 * This service can be use with its client-side counterpart in order to share
 * some server configuration items with the clients, or server-side only to act
 * as an accessor of the server configuration.
 *
 * __*The service can be use with its [client-side counterpart]{@link module:soundworks/client.SharedConfig}*__
 *
 * @memberof module:soundworks/server
 * @example
 * // inside experience constructor
 * this.sharedConfig = this.require('shared-config');
 * // access a configuration item for server-side use
 * const area = this.sharedConfig.get('setup.area');
 * // share this item with client of type `player`
 * this.sharedConfig.share('setup.area', 'player');
 */
class SharedConfig extends Activity {
  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  constructor() {
    super(SERVICE_ID);

    this._cache = {};
    this._clientItemsMap = {};
  }

  /** @inheritdoc */
  connect(client) {
    this.receive(client, 'request', this._onRequest(client));
  }

  /**
   * Returns an item of the server configuration from its path. For server-side use.
   * @param {String} item - String representing the path to the configuration.
   *  For example `'setup.area'` will retrieve the value (here an object)
   *  corresponding to the `area` key inside the `setup` entry of the server
   *  configuration.
   * @returns {Mixed} - Value of the requested item. Returns `null` if
   *  the given item does not exists.
   */
  get(item) {
    const parts = item.split('.');
    let value = server.config;
    // search item through config
    parts.forEach((attr) => {
      if (value[attr])
        value = value[attr];
      else
        value = null;
    });

    return value;
  }

  /**
   * Add a configuration item to be shared with a specific client.
   * @param {String} item - Key to the configuration item (_ex:_ `'setup.area'`)
   * @param {String} clientType - Client type whom the data should be shared.
   */
  share(item, clientType) {
    if (!this._clientItemsMap[clientType])
      this._clientItemsMap[clientType] = new Set();;

    this._clientItemsMap[clientType].add(item);
  }

  /**
   * Generate a object according to the given items. The result is cached.
   * @private
   * @param {Array<String>} items - The path to the items to be shared.
   * @returns {Object} - An optimized object containing all the requested items.
   */
  _getValues(clientType) {
    if (this._cache[clientType])
      return this._cache[clientType];

    const items = this._clientItemsMap[clientType];
    const serverConfig = server.config;
    const data = {};

    // build data tree
    items.forEach((item) => {
      const parts = item.split('.');
      let pointer = data;

      parts.forEach((attr) => {
        if (!pointer[attr])
          pointer[attr] = {};

        pointer = pointer[attr];
      });
    });

    // populate previously builded tree
    items.forEach((item) => {
      const parts = item.split('.');
      const len = parts.length;
      let value = serverConfig;
      let pointer = data;

      parts.forEach((attr, index) => {
        value = value[attr];

        if (index < len - 1)
          pointer = pointer[attr];
        else
          pointer[attr] = value;
      });
    });

    this._cache[clientType] = data;
    return data;
  }

  _onRequest(client) {
    // generate an optimized config bundle to return the client
    return (items) => {
      items.forEach((item) => this.share(item, client.type));

      const config = this._getValues(client.type);
      this.send(client, 'config', config);
    }
  }
}

serviceManager.register(SERVICE_ID, SharedConfig);

export default SharedConfig;
