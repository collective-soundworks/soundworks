import ServerActivity from '../core/ServerActivity';
import serverServiceManager from '../core/serverServiceManager';
import server from '../core/server';


const SERVICE_ID = 'service:shared-config';

class ServerSharedConfig extends ServerActivity {
  constructor() {
    super(SERVICE_ID);

    this._clientTypeConfigPaths = {};
  }

  start() {
    super.start();
  }

  addItem(configPath, clientType) {
    // add given client type to mapped client types
    const options = { clientType };
    this.configure(options);

    if (typeof clientType === 'string')
      clientType = [clientType];

    clientType.forEach((type) => {
      if (!this._clientTypeConfigPaths[type])
        this._clientTypeConfigPaths[type] = [];

      this._clientTypeConfigPaths[type].push(configPath);
    });
  }

  connect(client) {
    this.receive(client, 'request', this._onRequest(client));
  }

  _onRequest(client) {
    return () => {
      const configPaths = this._clientTypeConfigPaths[client.type];
      const serverConfig = server.config;
      const config = {};

      configPaths.forEach((configPath) => {
        // 'setup.area' => ['setup', 'area'];
        const path = configPath.split('.');
        let tmp = serverConfig;
        // search path trough config
        for (let i = 0, l = path.length; i < l; i++) {
          const attr = path[i];

          if (tmp[attr])
            tmp = tmp[attr];
          else
            throw new Error(`"${configPath}" does not exist in server config`);
        }

        config[configPath] = tmp;
      });

      this.send(client, 'config', config);
    }
  }
}

serverServiceManager.register(SERVICE_ID, ServerSharedConfig);

export default ServerSharedConfig;
