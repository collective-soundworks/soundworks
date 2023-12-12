import { assert } from 'chai';

import { Server } from '../../src/server/index.js';
import { Client } from '../../src/client/index.js';
import Plugin from '../../src/server/Plugin.js';
import PluginManager from '../../src/server/PluginManager.js';

import pluginDelayServer from '../utils/PluginDelayServer.js';
import config from '../utils/config.js';

describe(`# PluginManagerServer`, () => {
  describe(`## [private] constructor(server)`, () => {
    it(`should throw if argument is not instance of Server`, () => {
      let errored = false;
      try {
        new PluginManager({});
      } catch(err) {
        console.log(err.message);
        errored = true;
      }
      if (!errored) { assert.fail('should fail'); }
    });
  });

  describe(`## register(id, pluginFactory)`, () => {
    let server;

    beforeEach(() => {
      server = new Server(config);
    });

    it(`should throw if first argument is not a string`, () => {
      let errored = false;
      try {
        server.pluginManager.register(true, pluginDelayServer);
      } catch(err) {
        console.log(err.message);
        errored = true;
      }
      if (!errored) { assert.fail('should fail'); }
    });

    it(`should throw if second argument is not an Plugin factory`, () => {
      function factory(Plugin) { return {}; }

      let errored = false;
      try {
        server.pluginManager.register('plugin-name', factory);
      } catch(err) {
        console.log(err.message);
        errored = true;
      }
      if (!errored) { assert.fail('should fail'); }
    });

    it(`should throw if third argument is not an object`, () => {
      let errored = false;
      try {
        server.pluginManager.register('plugin-name', pluginDelayServer, true);
      } catch(err) {
        console.log(err.message);
        errored = true;
      }
      if (!errored) { assert.fail('should fail'); }
    });

    it(`third argument should be optionnal`, () => {
      server.pluginManager.register('plugin-name', pluginDelayServer);
      assert.ok('should pass');
    });

    it(`should throw if fourth argument is not an array`, () => {
      let errored = false;
      try {
        server.pluginManager.register('plugin-name', pluginDelayServer, {}, true);
      } catch(err) {
        console.log(err.message);
        errored = true;
      }
      if (!errored) { assert.fail('should fail'); }
    });

    it(`fourth argument should be optionnal`, () => {
      server.pluginManager.register('plugin-name', pluginDelayServer, {});
      assert.ok('should pass');
    });

    it(`should throw if id already registered`, () => {
      const server = new Server(config);
      server.pluginManager.register('delay', pluginDelayServer, {});

      let errored = false;
      try {
        server.pluginManager.register('delay', pluginDelayServer, {});
      } catch(err) {
        console.log(err.message);
        errored = true;
      }
      if (!errored) { assert.fail('should fail'); }
    });

    it(`should throw if called after "server.init" (may change in the future)`, async () => {
      await server.init();

      let errored = false;
      try {
        server.pluginManager.register('delay-1', pluginDelayServer, {});
      } catch(err) {
        console.log(err.message);
        errored = true;
      }
      if (!errored) { assert.fail('should fail'); }
    });

    it(`should allow to registered same plugin factory with different ids`, () => {
      const server = new Server(config);
      server.pluginManager.register('delay-1', pluginDelayServer, {});
      server.pluginManager.register('delay-2', pluginDelayServer, {});

      assert.ok('should not throw');
    });
  });

  describe(`## [private] async init()`, () => {
    it(`should throw if started twice`, async () => {
      const server = new Server(config);
      await server.init(); // run pluginManager.start()

      let errored = false;
      try {
        await server.pluginManager.start();
      } catch(err) {
        errored = true;
        console.log(err.message);
      }
      if (!errored) { assert.fail('should throw'); }
    });
  });

  describe(`## async get(id)`, () => {
    it(`should throw if called before server.init()`, async () => {
      const server = new Server(config);
      server.pluginManager.register('delay', pluginDelayServer, { delayTime: 100 });

      let errored = false;
      try {
        await server.pluginManager.get('delay');
      } catch(err) {
        errored = true;
        console.log(err.message);
      }
      if (!errored) { assert.fail('should throw'); }
    });

    it(`should throw if plugin id his not a string`, async () => {
      const server = new Server(config);
      await server.init();

      let errored = false;
      try {
        await server.pluginManager.get(true);
      } catch(err) {
        errored = true;
        console.log(err.message);
      }
      if (!errored) { assert.fail('should throw'); }
    });

    it(`should throw if plugin id has not been registered`, async () => {
      const server = new Server(config);
      await server.init();

      let errored = false;
      try {
        await server.pluginManager.get('delay');
      } catch(err) {
        errored = true;
        console.log(err.message);
      }
      if (!errored) { assert.fail('should throw'); }
    });

    it(`plugin should be started and immediately available after server.init()`, async function() {
      const server = new Server(config);
      server.pluginManager.register('delay', pluginDelayServer, { delayTime: 100 });

      const TIMEOUT_ERROR = 15;
      await server.init();

      const startTime = Date.now();

      const plugin = await server.pluginManager.get('delay');
      // make sure we didn't get the delay in `get`
      assert.isBelow(Date.now() - startTime, TIMEOUT_ERROR);
      assert.equal(plugin.status, 'started');
      assert.ok(plugin instanceof Plugin);
    });

    // @note - for now we just forbid this,
    // this could change in the future to dynamically import plugins at runtime
    // it(`should be able to register and await a plugin after server.init()`, async function() {
    //   const server = new Server(config);
    //   await server.init();

    //   server.pluginManager.register('delay', pluginDelayServer, {
    //     delayTime: 100,
    //   });

    //   const startTime = Date.now();

    //   server.pluginManager.observe((statuses, updates) => {
    //     const now = Date.now();
    //     const delta = now - startTime;
    //     // assume we can 20ms jitter in the setTimeout
    //     if (updates['delay-1'] === 'inited') {
    //       assert.isBelow(Math.abs(delta - 0.), TIMEOUT_ERROR);
    //     } else if (updates['delay-1'] === 'started') {
    //       assert.isBelow(Math.abs(delta - 100), TIMEOUT_ERROR);
    //     }
    //   });

    //   const plugin = await server.pluginManager.get('delay');

    //   const now = Date.now();
    //   const delta = now - startTime;
    //   assert.isBelow(Math.abs(delta - 100), TIMEOUT_ERROR);

    //   assert.ok(plugin instanceof Plugin);
    // });
  });

  describe(`## onStateChange((plugins, updatedPlugin) => {})`, () => {
    it(`should properly propagate statuses`, async function() {
      this.timeout(3 * 1000);

      const server = new Server(config);
      server.pluginManager.register('delay', pluginDelayServer, {
        delayTime: 100,
      });

      const expected = [
        'idle',
        'inited',
        'started',
      ];
      let index = 0;

      server.pluginManager.onStateChange(plugins => {
        assert.deepEqual(expected[index], plugins['delay'].status);
        index += 1;
      });

      await server.init();
    });

    it(`should be able to monitor plugin lifecycle`, async function() {
      this.timeout(3 * 1000);

      const TIMEOUT_ERROR = 15

      const server = new Server(config);
      server.pluginManager.register('delay', pluginDelayServer, {
        delayTime: 100,
      });

      const startTime = Date.now();
      let onStateChangeCalled = false;

      server.pluginManager.onStateChange(plugins => {
        onStateChangeCalled = true;

        const now = Date.now();
        const delta = now - startTime;
        // assume we can 20ms jitter in the setTimeout
        if (plugins['delay'].status === 'inited') {
          assert.isBelow(Math.abs(delta - 0), TIMEOUT_ERROR);
        } else if (plugins['delay'].status === 'started') {
          assert.isBelow(Math.abs(delta - 100), TIMEOUT_ERROR);
        }
      });

      await server.init();

      if (!onStateChangeCalled) {
        assert.fail('onStateChange not called');
      }
    });
  });

  describe(`## [private] addClient(client)`, () => {
    it(`should properly add clients to Plugin`, async () => {
      let addClientCalled = false;

      const server = new Server(config);

      function testPluginFactory(Plugin) {
        return class TestPlugin extends Plugin {
          async addClient(client) {
            await super.addClient(client);
            addClientCalled = true;
          }
        }
      }

      server.pluginManager.register('test-plugin', testPluginFactory);
      await server.init();
      await server.start();

      const plugin = await server.pluginManager.get('test-plugin');

      const client = new Client({ role: 'test', ...config });
      client.pluginManager.register('test-plugin', (Plugin) => class TestPlugin extends Plugin {});
      await client.init();

      assert.equal(plugin.clients.size, 1);
      assert.equal(addClientCalled, true);

      await server.stop();
    });

    it(`should add clients only into registered plugins`, async () => {
      let addClientCalled = false;

      function testPluginFactory(Plugin) {
        return class TestPlugin extends Plugin {
          async addClient(client) {
            await super.addClient(client);
            assert.equal(this.clients.has(client), true);
            addClientCalled = true;
          }
        }
      }

      let addClientCalled2 = false;

      function testPluginFactory2(Plugin) {
        return class TestPlugin extends Plugin {
          async addClient(client) {
            await super.addClient(client);
            addClientCalled2 = true;
          }
        }
      }

      const server = new Server(config);
      server.pluginManager.register('test-plugin', testPluginFactory);
      server.pluginManager.register('test-plugin-2', testPluginFactory2);
      await server.init();
      await server.start();

      const client = new Client({ role: 'test', ...config });
      client.pluginManager.register('test-plugin', (Plugin) => class TestPlugin extends Plugin {});
      await client.init();
      await client.start();

      await server.stop();

      assert.equal(addClientCalled, true);
      assert.equal(addClientCalled2, false);
    });
  });

  describe(`## [private] removeClient(client)`, () => {
    it(`should be called on client.stop()`, async () => {
      let removeClientCalled = false;

      function testPluginFactory(Plugin) {
        return class TestPlugin extends Plugin {
          async removeClient(client) {
            await super.removeClient(client);
            removeClientCalled = true;
          }
        }
      }

      const server = new Server(config);
      server.pluginManager.register('test-plugin', testPluginFactory);
      await server.init();
      await server.start();

      const client = new Client({ role: 'test', ...config });
      client.pluginManager.register('test-plugin', (Plugin) => class TestPlugin extends Plugin {});
      await client.init();
      await client.start();

      await client.stop();
      // wait a bit for socket close event to propagate
      await new Promise(resolve => setTimeout(resolve, 50));
      await server.stop();

      assert.equal(removeClientCalled, true, `didn't call removeClient`);
    });

    it(`stateManager should still be usable`, async () => {
      let removeClientCalled = false;

      function testPluginFactory(Plugin) {
        return class TestPlugin extends Plugin {
          async removeClient(client) {
            await super.removeClient(client);

            removeClientCalled = true;
            assert.equal(this.server.stateManager._clientByNodeId.has(client.id), true);
            assert.equal(this.clients.has(client), false);
          }
        }
      }

      const server = new Server(config);
      server.pluginManager.register('test-plugin', testPluginFactory);
      await server.init();
      await server.start();

      const client = new Client({ role: 'test', ...config });
      client.pluginManager.register('test-plugin', (Plugin) => class TestPlugin extends Plugin {});
      await client.init();
      await client.start();

      await client.stop();
      // wait a bit for socket close event to propagate
      await new Promise(resolve => setTimeout(resolve, 50));
      await server.stop();

      assert.equal(removeClientCalled, true, `didn't call removeClient`);
    });

    it(`should add clients only into registered plugins`, async () => {
      let removeClientCalled = false;

      function testPluginFactory(Plugin) {
        return class TestPlugin extends Plugin {
          async removeClient(client) {
            await super.removeClient(client);
            removeClientCalled = true;
          }
        }
      }

      let removeClientCalled2 = false;

      function testPluginFactory2(Plugin) {
        return class TestPlugin extends Plugin {
          async removeClient(client) {
            await super.removeClient(client);
            removeClientCalled2 = true;
          }
        }
      }

      const server = new Server(config);
      server.pluginManager.register('test-plugin', testPluginFactory);
      server.pluginManager.register('test-plugin-2', testPluginFactory2);
      await server.init();
      await server.start();

      const client = new Client({ role: 'test', ...config });
      client.pluginManager.register('test-plugin', (Plugin) => class TestPlugin extends Plugin {});
      await client.init();
      await client.start();
      await client.stop();
      // wait a bit for socket close event to propagate
      await new Promise(resolve => setTimeout(resolve, 50));
      await server.stop();

      assert.equal(removeClientCalled, true, `didn't call removeClient`);
      assert.equal(removeClientCalled2, false, `wrongly called removeClient`);
    });
  });

  describe(`## [lifecycle] plugin initialization`, () => {
    it(`server should start if no plugins registered`, async function() {
      const server = new Server(config);
      await server.init();
      await server.start();

      assert.ok('server started');
      await server.stop();
    });

    it(`server should start if plugin registered`, async function() {
      const server = new Server(config);
      server.pluginManager.register('delay', pluginDelayServer, { delayTime: 0.1 });
      await server.init();
      await server.start();

      assert.ok('server started');
      await server.stop();
    });

    it(`should propagate plugin start() errors`, async () => {
      const server = new Server(config);
      server.pluginManager.register('delay', pluginDelayServer, {
        delayTime: 0.1,
        throwError: true,
      });

      let errored = false;
      try {
        await server.init();
      } catch(err) {
        console.log(err.message);
        errored = true;
      }
      if (!errored) { assert.fail('should throw'); }
    });

    it(`should be able to require several plugins in parallel`, async function() {
      this.timeout(3 * 1000);

      // delay-1 --|
      // delay-2 --|

      // accepted error in delay-plugin timeouts (in ms)
      const TIMEOUT_ERROR = 15.;
      const server = new Server(config);

      server.pluginManager.register('delay-1', pluginDelayServer, {
        delayTime: 100,
      });
      server.pluginManager.register('delay-2', pluginDelayServer, {
        delayTime: 100,
      });

      const startTime = Date.now();
      let onStateChangeCalled = false;

      server.pluginManager.onStateChange((plugins, updatedPlugin) => {
        onStateChangeCalled = true;

        if (updatedPlugin === null) { return }

        const now = Date.now();
        const delta = now - startTime;

        // assume we can 20ms jitter in the setTimeout
        if (updatedPlugin.id === 'delay-1' && updatedPlugin.status === 'inited') {
          assert.isBelow(Math.abs(delta - 0.), TIMEOUT_ERROR);
        } else if (updatedPlugin.id === 'delay-1' && updatedPlugin.status === 'started') {
          assert.isBelow(Math.abs(delta - 100), TIMEOUT_ERROR);
        }

        if (updatedPlugin.id === 'delay-2' && updatedPlugin.status === 'inited') {
          assert.isBelow(Math.abs(delta - 0.), TIMEOUT_ERROR);
        } else if (updatedPlugin.id === 'delay-2' && updatedPlugin.status === 'started') {
          assert.isBelow(Math.abs(delta - 100), TIMEOUT_ERROR);
        }
      });

      await server.start();
      await server.stop();

      if (!onStateChangeCalled) {
        assert.fail('onStateChange not called');
      }
    });

    it(`should be able to chain plugin initialization`, async function() {
      this.timeout(3 * 1000);

      // delay-1 --> delay-2 --|

      // accepted error in delay-plugin timeouts (in ms)
      const TIMEOUT_ERROR = 15.;
      const server = new Server(config);

      server.pluginManager.register('delay-1', pluginDelayServer, {
        delayTime: 100,
      });
      // delay-2 depends on delay-1
      server.pluginManager.register('delay-2', pluginDelayServer, {
        delayTime: 100,
      }, ['delay-1']);

      const startTime = Date.now();
      let onStateChangeCalled = false;

      server.pluginManager.onStateChange((plugins, updatedPlugin) => {
        onStateChangeCalled = true;

        if (updatedPlugin === null) { return; }

        const now = Date.now();
        const delta = now - startTime;

        // assume we can 20ms jitter in the setTimeout
        if (updatedPlugin.id === 'delay-1' && updatedPlugin.status === 'inited') {
          assert.isBelow(Math.abs(delta - 0.), TIMEOUT_ERROR);
        } else if (updatedPlugin.id === 'delay-1' && updatedPlugin.status === 'started') {
          assert.isBelow(Math.abs(delta - 100), TIMEOUT_ERROR);
        }

        if (updatedPlugin.id === 'delay-2' && updatedPlugin.status === 'inited') {
          assert.isBelow(Math.abs(delta - 100), TIMEOUT_ERROR);
        } else if (updatedPlugin.id === 'delay-2' && updatedPlugin.status === 'started') {
          assert.isBelow(Math.abs(delta - 200), TIMEOUT_ERROR);
        }
      });

      await server.start();
      await server.stop();

      if (!onStateChangeCalled) {
        assert.fail('onStateChange not called');
      }
    });

    it(`should support complex plugin dependency graphs`, async function() {
      this.timeout(3 * 1000);

      // delay-1 --> delay-2 --|
      // delay-3 --------------+--> delay-4 --|

      // accepted error in delay-plugin timeouts (in ms)
      const TIMEOUT_ERROR = 15.;
      const server = new Server(config);

      server.pluginManager.register('delay-1', pluginDelayServer, {
        delayTime: 200,
      });
      // delay-2 depends on delay-1
      server.pluginManager.register('delay-2', pluginDelayServer, {
        delayTime: 200,
      }, ['delay-1']);

      // delay 3 ready (at 0.6) after delay delay-2 (at 0.4)
      server.pluginManager.register('delay-3', pluginDelayServer, {
        delayTime: 600,
      });

      server.pluginManager.register('delay-4', pluginDelayServer, {
        delayTime: 200,
      }, ['delay-2', 'delay-3']);

      const startTime = Date.now();
      let onStateChangeCalled = false;

      server.pluginManager.onStateChange((plugins, updatedPlugin) => {
        onStateChangeCalled = true;

        if (updatedPlugin === null) { return; }

        const now = Date.now();
        const delta = now - startTime;

        // assume we can 20ms jitter in the setTimeout
        if (updatedPlugin.id === 'delay-1' && updatedPlugin.status === 'inited') {
          assert.isBelow(Math.abs(delta - 0.), TIMEOUT_ERROR);
        } else if (updatedPlugin.id === 'delay-1' && updatedPlugin.status === 'started') {
          assert.isBelow(Math.abs(delta - 200), TIMEOUT_ERROR);
        }

        if (updatedPlugin.id === 'delay-2' && updatedPlugin.status === 'inited') {
          assert.isBelow(Math.abs(delta - 200), TIMEOUT_ERROR);
        } else if (updatedPlugin.id === 'delay-2' && updatedPlugin.status === 'started') {
          assert.isBelow(Math.abs(delta - 400), TIMEOUT_ERROR);
        }

        if (updatedPlugin.id === 'delay-3' && updatedPlugin.status === 'inited') {
          assert.isBelow(Math.abs(delta - 0.), TIMEOUT_ERROR);
        } else if (updatedPlugin.id === 'delay-3' && updatedPlugin.status === 'started') {
          assert.isBelow(Math.abs(delta - 600), TIMEOUT_ERROR);
        }

        if (updatedPlugin.id === 'delay-4' && updatedPlugin.status === 'inited') {
          assert.isBelow(Math.abs(delta - 600), TIMEOUT_ERROR);
        } else if (updatedPlugin.id === 'delay-4' && updatedPlugin.status === 'started') {
          assert.isBelow(Math.abs(delta - 800), TIMEOUT_ERROR);
        }
      });

      await server.start();
      await server.stop();

      if (!onStateChangeCalled) {
        assert.fail('onStateChange not called');
      }
    });
  });
});
