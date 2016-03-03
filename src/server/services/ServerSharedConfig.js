import ServerActivity from '../core/ServerActivity';
import serverServiceManager from '../core/serverServiceManager';
import server from '../core/server';


const SERVICE_ID = 'service:shared-config';

/**
 * [server] This service acts as an accessor for the server config both server
 * and client sides.
 *
 */
class ServerSharedConfig extends ServerActivity {
  constructor() {
    super(SERVICE_ID);

    // this._clientTypeConfigPaths = {};

    this._cache = {};
  }

  /**
   * Adds an item of the server configuration has required by some type of clients.
   * @param {String} configPath - String representing the path to the configuration
   *  ex. `'setup.area'` will search for the `area` entry of the '`setup`' entry
   *  of the server configuration.
   * @param {Array<String>|<String>} - The name of the client types with whom the
   *  configuration entry must be shared.
   */
  // addItem(configPath, clientTypes) {
  //   // add given client type to mapped client types
  //   const options = { clientTypes };
  //   this.configure(options);

  //   if (typeof clientTypes === 'string')
  //     clientTypes = [clientTypes];

  //   clientTypes.forEach((type) => {
  //     if (!this._clientTypeConfigPaths[type])
  //       this._clientTypeConfigPaths[type] = [];

  //     this._clientTypeConfigPaths[type].push(configPath);
  //   });
  // }

  /**
   * Returns an item of the server configuration from its path. (Allow to use the
   * service server-side). Used server-side by other service to get
   * config informations
   * @param {String} configPath - String representing the path to the configuration
   *  ex. `'setup.area'` will search for the `area` entry of the '`setup`' entry
   *  of the server configuration.
   * returns {Object<String, Mixed>} - An object containing all the configuration
   *  informations, ordered with the configuration paths as keys.
   */
  getPath(path) {

  }

  /**
   * @todo - remove
   * Returns an item of the server configuration from its path. (Allow to use the
   * service server-side)
   * @param {String} configPath - String representing the path to the configuration
   *  ex. `'setup.area'` will search for the `area` entry of the '`setup`' entry
   *  of the server configuration.
   * returns {Object<String, Mixed>} - An object containing all the configuration
   *  informations, ordered with the configuration paths as keys.
   */
  get(configPaths) {
    if (!Array.isArray(configPaths))
      configPaths = [configPaths];

    const serverConfig = server.config;
    const config = {};

    configPaths.forEach((configPath) => {
      // 'setup.area' => ['setup', 'area'];
      const path = configPath.split('.');
      let tmp = serverConfig;
      // search path through config
      for (let i = 0, l = path.length; i < l; i++) {
        const attr = path[i];

        if (tmp[attr])
          tmp = tmp[attr];
        else
          throw new Error(`"${configPath}" does not exist in server config`);
      }

      config[configPath] = tmp;
    });

    return config;
  }

  /** @inheritdoc */
  connect(client) {
    this.receive(client, 'request', this._onRequest(client));
  }

  _generateObject(paths) {
    const key = paths.join(':');
    if (this._cache[key]) {}
  }

  _onRequest(client, paths) {
    // generate an optimized config bundle to return the client

    return () => {
      const configPaths = this._clientTypeConfigPaths[client.type];
      const config = this.get(configPaths);

      this.send(client, 'config', config);
    }
  }
}

serverServiceManager.register(SERVICE_ID, ServerSharedConfig);

export default ServerSharedConfig;
