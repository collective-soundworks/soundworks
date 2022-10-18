const assert = require('chai').assert;

const Server = require('../server').Server;
const serverPluginDelayFactory = require('@soundworks/plugin-delay/server').default;
const Client = require('../client').Client;
const clientPluginDelayFactory = require('@soundworks/plugin-delay/client').default;

const config = {
  app: {
    clients: {
      test: { target: 'node' },
    },
  },
  env: {
    type: 'development',
    port: 8081,
    serverIp: '127.0.0.1',
    useHttps: false,
    verbose: process.env.VERBOSE === '1' ? true : false,
  },
};

describe('Plugin', () => {
  describe(`new Plugin(server, options)`, () => {
    it(`should have a type`, async () => {
      const server = new Server(config);
      server.pluginManager.register('delay', serverPluginDelayFactory, {
        delayTime: 0,
      });

      await server.init();

      const pluginServer = await server.pluginManager.get('delay');

      await server.start();

      const client = new Client({ clientType: 'test', ...config });
      client.pluginManager.register('delay', clientPluginDelayFactory, {
        delayTime: 0,
      });
      await client.init();

      const pluginClient = await client.pluginManager.get('delay');

      console.log(pluginClient.type);
      assert.equal(pluginServer.type, 'PluginDelay');
      assert.equal(pluginClient.type, 'PluginDelay');

      await server.stop();
    });
  });
});
