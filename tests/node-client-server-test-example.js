const path = require('path');
const Server = require('@soundworks/core/server').Server;
const ServerAbstractExperience = require('@soundworks/core/server').AbstractExperience;
const Client = require('@soundworks/core/client').Client;
const ClientAbstractExperience = require('@soundworks/core/client').AbstractExperience;
// const serverPluginFactory = require('../server').default;
// const clientPluginFactory = require('../client').default;

// mixed config for server and client
const config = {
  app: {
    name: 'test-plugin-logger',
    clients: {
      test: {
        target: 'node',
      },
    },
  },
  env: {
    "type": "development",
    "port": 8081,
    "assetsDomain": "",
    "serverIp": "127.0.0.1",
    "websockets": {
      "path": "socket",
      "url": "",
      "pingInterval": 5000
    },
    "useHttps": false,
    "httpsInfos": {
      "key": null,
      "cert": null,
    },
  },

  // client only config
  clientType: 'test',
};

class ServerTestExperience extends ServerAbstractExperience {
  constructor(server, clientTypes) {
    super(server, clientTypes);
  }

  start() {
    console.log('[server] experience started');
  }

  connect(client) {
    console.log(`[server] client ${client.id} connected`);
  }
}

class ClientTestExperience extends ClientAbstractExperience {
  constructor(client) {
    super(client);
  }

  start() {
    console.log('[client] experience started');
    console.log(`[client] client ${client.id}`);
  }
}

(async function() {
  // ---------------------------------------------------
  // server
  // ---------------------------------------------------
  const server = new Server();

  // this is boring... should not be mandatory
  server.templateEngine = { compile: () => {} };
  server.templateDirectory = process.cwd();

  // server.pluginManager.register('logger', serverPluginFactory, {
  //   directory: path.join(process.cwd(), 'logs'),
  // });
  await server.init(config);
  const serverTestExperience = new ServerTestExperience(server, 'test');

  await server.start();
  serverTestExperience.start();

  // ---------------------------------------------------
  // client
  // ---------------------------------------------------
  const client = new Client();
  // client.pluginManager.register('logger', serverPluginFactory, {
  //   directory: path.join(process.cwd(), 'logs'),
  // });

  await client.init(config);
  const clientTestExperience = new ClientTestExperience(client);

  await client.start();
  clientTestExperience.start();
}());


































