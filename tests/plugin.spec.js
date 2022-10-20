const assert = require('chai').assert;

const Server = require('../server').Server;
const ServerPlugin = require('../server/Plugin.js');
const serverPluginDelayFactory = require('./utils/plugin-delay.server.js');

const Client = require('../client').Client;
const ClientPlugin = require('../client/Plugin.js');
const clientPluginDelayFactory = require('./utils/plugin-delay.client.js');

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
  describe(`new Plugin(server|client, options)`, () => {
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

  describe(`[client] Plugin.state // @todo - should be the same server-side`, () => {
    it(`should propagate its inner state`, async () => {
      const server = new Server(config);
      server.pluginManager.register('stateful', (ServerPlugin) => class StatefulPlugin extends ServerPlugin {});

      await server.init();
      await server.start();

      const client = new Client({ clientType: 'test', ...config });
      client.pluginManager.register('stateful', (ClientPlugin) => class StatefulPlugin extends ClientPlugin {});
      await client.init();

      const plugin = await client.pluginManager.get('stateful');

      let numCalled = 0;
      plugin.onStateChange(state => {
        assert.isNumber(state.rand);
        numCalled += 1;
      });

      const rand1 = Math.random();
      plugin.propagateStateChange({ rand: rand1 });

      const rand2 = Math.random();
      plugin.propagateStateChange({ rand: rand2 });

      assert.equal(numCalled, 2);

      await server.stop();
    });

    it(`should be forwarded by the stateManager`, async () => {
      const server = new Server(config);
      server.pluginManager.register('stateful', (ServerPlugin) => class StatefulPlugin extends ServerPlugin {});

      await server.init();
      await server.start();

      let numCalled = 0;
      const client = new Client({ clientType: 'test', ...config });

      client.pluginManager.register('stateful', (ClientPlugin) => {
        return class StatefulPlugin extends ClientPlugin {
          constructor(client, id) {
            super(client, id);
            this.state = { rand: 0 };
          }
        }
      });

      client.pluginManager.onStateChange((plugins, updatedPlugin) => {
        assert.isNumber(plugins['stateful'].state.rand);

        if (updatedPlugin !== null) {
          assert.isNumber(updatedPlugin.state.rand);
        }

        numCalled += 1;
      });

      await client.init();

      const plugin = await client.pluginManager.get('stateful');

      const rand1 = Math.random();
      plugin.propagateStateChange({ rand: rand1 });

      const rand2 = Math.random();
      plugin.propagateStateChange({ rand: rand2 });

      assert.equal(numCalled, 3);

      await server.stop();
    });
  });
});
