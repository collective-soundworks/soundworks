import ServerActivity from '../core/ServerActivity';
import serverServiceManager from '../core/serverServiceManager';
import server from '../core/server';


const SERVICE_ID = 'service:shared-config';

/**
 * [server] Service that acts as an accessor for the server config for both
 * server and client sides.
 */
class ServerSharedConfig extends ServerActivity {
  constructor() {
    super(SERVICE_ID);

    this._cache = {};
  }

  /** @inheritdoc */
  connect(client) {
    this.receive(client, 'request', this._onRequest(client));
  }

  /**
   * Returns an item of the server configuration from its path. For server-side use.
   * @param {String} item - String representing the path to the configuration
   *  ex. `'setup.area'` will search for the `area` entry of the '`setup`' entry
   *  of the server configuration.
   * @returns {Mixed} - The value of the request item. Returns `null` if
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
   * Generate a object according to the given items. The result is cached
   * @param {Array<String>} items - The path to the items to be shared.
   * @returns {Object} - An optimized object containing all the requested items.
   */
  _generateFromItems(items) {
    const key = items.join(':');

    if (this._cache[key])
      return this._cache[key];

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

    this._cache[key] = data;
    return data;
  }

  _onRequest(client) {
    // generate an optimized config bundle to return the client
    return (items) => {
      const config = this._generateFromItems(items);
      this.send(client, 'config', config);
    }
  }
}

serverServiceManager.register(SERVICE_ID, ServerSharedConfig);

export default ServerSharedConfig;
