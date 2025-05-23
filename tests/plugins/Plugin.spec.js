import { assert } from 'chai';

import { Server, ServerPlugin } from '../../src/server/index.js';
import { Client, ClientPlugin } from '../../src/client/index.js';

import ServerPluginDelay from '../utils/ServerPluginDelay.js';
import ClientPluginDelay from '../utils/ClientPluginDelay.js';
import config from '../utils/config.js';

describe('# Plugin', () => {
  describe(`## constructor(server|client, options)`, () => {
    it(`id and type should be readonly`, async () => {
      const server = new Server(config);
      server.pluginManager.register('delay', ServerPluginDelay, {
        delayTime: 0,
      });

      await server.init();

      const pluginServer = await server.pluginManager.get('delay');

      await server.start();

      const client = new Client({ role: 'test', ...config });
      client.pluginManager.register('delay', ClientPluginDelay, {
        delayTime: 0,
      });
      await client.init();

      const pluginClient = await client.pluginManager.get('delay');

      assert.equal(pluginServer.id, 'delay');
      assert.equal(pluginServer.type, 'ServerPluginDelay');
      assert.equal(pluginClient.id, 'delay');
      assert.equal(pluginClient.type, 'ClientPluginDelay');

      // id and type are readonly
      assert.throws(() => pluginServer.id = 'coucou');
      assert.throws(() => pluginServer.type = 'coucou');
      assert.throws(() => pluginClient.id = 'coucou');
      assert.throws(() => pluginClient.type = 'coucou');

      await server.stop();
    });

    it('should throw if server-side plugin is registered client-side', async () => {
      const server = new Server(config);
      server.pluginManager.register('delay', ServerPluginDelay);

      await server.start();
      const client = new Client({ role: 'test', ...config });

      let errored = false;
      try {
        client.pluginManager.register('delay', ServerPluginDelay);
      } catch (err) {
        console.log(err.message);
        errored = true;
      }

      await server.stop();
      assert.isTrue(errored);
    });

    it('should throw if client-side plugin is registered server-side', async () => {
      const server = new Server(config);
      let errored = false;
      try {
        server.pluginManager.register('delay', ClientPluginDelay);
      } catch (err) {
        console.log(err.message);
        errored = true;
      }

      assert.isTrue(errored);
    });
  });

  describe(`## [client] Plugin.state propagation`, () => {
    it(`should propagate its inner state`, async () => {
      const server = new Server(config);
      server.pluginManager.register('stateful', class StatefulPlugin extends ServerPlugin {});

      await server.init();
      await server.start();

      const client = new Client({ role: 'test', ...config });
      client.pluginManager.register('stateful', class StatefulPlugin extends ClientPlugin {});
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
      server.pluginManager.register('stateful', class StatefulPlugin extends ServerPlugin {});

      await server.init();
      await server.start();

      let numCalled = 0;
      const client = new Client({ role: 'test', ...config });

      client.pluginManager.register('stateful', class StatefulPlugin extends ClientPlugin {
        constructor(client, id) {
          super(client, id);
          this.state = { rand: 0 };
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

  describe(`## [client|server] Require plugin within plugin`, () => {
    it(`should work`, async function() {
      this.timeout(2000);

      const server = new Server(config);

      server.pluginManager.register('dependent', class Dependant extends ServerPlugin {
        constructor(server, id) {
          super(server, id);

          this.server.pluginManager.register('delay', ServerPluginDelay, { delayTime: 200 })
          this.server.pluginManager.addDependency(this.id, 'delay');
        }
      });

      // accepted error in delay plugin timeouts (in ms)
      const TIMEOUT_ERROR = 15.;
      const startTime = Date.now();

      server.pluginManager.onStateChange((plugins, updatedPlugin) => {
        const now = Date.now();
        const delta = now - startTime;

        if (updatedPlugin) {
          if (updatedPlugin.id === 'delay' && updatedPlugin.status === 'inited') {
            assert.isBelow(Math.abs(delta - 0.), TIMEOUT_ERROR);
          } else if (updatedPlugin.id === 'delay' && updatedPlugin.status === 'started') {
            assert.isBelow(Math.abs(delta - 200), TIMEOUT_ERROR);
          } else if (updatedPlugin.id === 'dependent' && updatedPlugin.status === 'inited') {
            assert.isBelow(Math.abs(delta - 200.), TIMEOUT_ERROR);
          } else if (updatedPlugin.id === 'dependent' && updatedPlugin.status === 'started') {
            assert.isBelow(Math.abs(delta - 200), TIMEOUT_ERROR);
          }
        }
      });

      await server.start();

      const client = new Client({ role: 'test', ...config });

      client.pluginManager.register('dependent', class Dependant extends ClientPlugin {
        constructor(client, id) {
          super(client, id);

          this.client.pluginManager.register('delay', ClientPluginDelay, { delayTime: 200 })
          this.client.pluginManager.addDependency(this.id, 'delay');
        }
      });

      const CLIENT_TIMEOUT_ERROR = 50.; // larger error as the socket must be setup, etc.
      const clientStartTime = Date.now();

      client.pluginManager.onStateChange((plugins, updatedPlugin) => {
        const now = Date.now();
        const delta = now - clientStartTime;

        if (updatedPlugin) {
          if (updatedPlugin.id === 'delay' && updatedPlugin.status === 'inited') {
            assert.isBelow(Math.abs(delta - 0.), CLIENT_TIMEOUT_ERROR);
          } else if (updatedPlugin.id === 'delay' && updatedPlugin.status === 'started') {
            assert.isBelow(Math.abs(delta - 200), CLIENT_TIMEOUT_ERROR);
          } else if (updatedPlugin.id === 'dependent' && updatedPlugin.status === 'inited') {
            assert.isBelow(Math.abs(delta - 200.), CLIENT_TIMEOUT_ERROR);
          } else if (updatedPlugin.id === 'dependent' && updatedPlugin.status === 'started') {
            assert.isBelow(Math.abs(delta - 200), CLIENT_TIMEOUT_ERROR);
          }
        }
      });

      await client.start();

      await server.stop();
    });
  });

  describe(`## [server] Plugin.state propagation`, () => {
    it('PluginManager should properly propagate plugin state', async () => {
      const server = new Server(config);

      server.pluginManager.register('stateful', class StatefulPlugin extends ServerPlugin {
        constructor(client, id) {
          super(client, id);
          this.state = { rand: 0 };
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
  });
});
