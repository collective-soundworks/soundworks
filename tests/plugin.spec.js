import { assert } from 'chai';

import { Server } from '../src/server/index.js';
import { Client } from '../src/client/index.js';
import ServerPlugin from '../src/server/Plugin.js';
import ClientPlugin from '../src/client/Plugin.js';
import { pluginDelayFactory as serverPluginDelayFactory } from './utils/plugin-delay.server.js';
import { pluginDelayFactory as clientPluginDelayFactory } from './utils/plugin-delay.client.js';

const config = {
  app: {
    clients: {
      test: { target: 'node' },
    },
  },
  env: {
    type: 'development',
    port: 8081,
    serverAddress: '127.0.0.1',
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

      const client = new Client({ role: 'test', ...config });
      client.pluginManager.register('delay', clientPluginDelayFactory, {
        delayTime: 0,
      });
      await client.init();

      const pluginClient = await client.pluginManager.get('delay');

      assert.equal(pluginServer.type, 'PluginDelay');
      assert.equal(pluginClient.type, 'PluginDelay');

      await server.stop();
    });
  });

  describe(`[client] Plugin.state propagation`, () => {
    it(`should propagate its inner state`, async () => {
      const server = new Server(config);
      server.pluginManager.register('stateful', (ServerPlugin) => class StatefulPlugin extends ServerPlugin {});

      await server.init();
      await server.start();

      const client = new Client({ role: 'test', ...config });
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
      server.pluginManager.register('stateful', (Plugin) => {
        return class StatefulPlugin extends Plugin {}
      });

      await server.init();
      await server.start();

      let numCalled = 0;
      const client = new Client({ role: 'test', ...config });

      client.pluginManager.register('stateful', (Plugin) => {
        return class StatefulPlugin extends Plugin {
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
      plugin.propagateStateChange({ rand: Math.random() });
      plugin.propagateStateChange({ rand: Math.random() });
      // should equal 5
      // - 3 status ('idle', 'inited', 'started') because we call client.init()
      // - 2 due to the `plugin.propagateStateChange`
      assert.equal(numCalled, 5);

      await server.stop();
    });
  });

  describe(`[server] Plugin.state propagation`, () => {
    it('should implement the tests', async () => {
      const server = new Server(config);
      server.pluginManager.register('stateful', (ClientPlugin) => {
        return class StatefulPlugin extends ClientPlugin {
          constructor(client, id) {
            super(client, id);
            this.state = { rand: 0 };
          }
        }
      });

      let numCalled = 0;

      server.pluginManager.onStateChange((plugins, updatedPlugin) => {
        assert.isNumber(plugins['stateful'].state.rand);

        if (updatedPlugin !== null) {
          assert.isNumber(updatedPlugin.state.rand);
        }

        numCalled += 1;
      });

      await server.init();
      await server.start();

      const plugin = await server.pluginManager.get('stateful');
      plugin.propagateStateChange({ rand: Math.random() });
      plugin.propagateStateChange({ rand: Math.random() });
      // should equal 5
      // - 3 status ('idle', 'inited', 'started') because we call client.init()
      // - 2 due to the `plugin.propagateStateChange`
      assert.equal(numCalled, 5);

      await server.stop();
    });
  })
});
