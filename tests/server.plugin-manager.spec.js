const path = require('path');
const assert = require('chai').assert;

const Server = require('../server').Server;
const Client = require('../client').Client;
const ServerAbstractExperience = require('../server').AbstractExperience;
const Plugin = require('../server/Plugin.js').default;
const PluginManager = require('../server/PluginManager.js').default;
const pluginDelayFactory = require('./utils/plugin-delay.server.js');

config = {
  app: {
    name: 'plugin-manager-test',
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

// accepted error in delay-plugin timeouts (in ms)
const TIMEOUT_ERROR = 15.;

describe(`server::PluginManager`, () => {
  describe(`(protected) new PluginManager(server)`, () => {
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

  describe(`register(id, pluginFactory)`, () => {
    let server;

    beforeEach(() => {
      server = new Server(config);
    });

    it(`should throw if first argument is not a string`, () => {
      let errored = false;
      try {
        server.pluginManager.register(true, pluginDelayFactory);
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
        server.pluginManager.register('plugin-name', pluginDelayFactory, true);
      } catch(err) {
        console.log(err.message);
        errored = true;
      }
      if (!errored) { assert.fail('should fail'); }
    });

    it(`third argument should be optionnal`, () => {
      server.pluginManager.register('plugin-name', pluginDelayFactory);
      assert.ok('should pass');
    });

    it(`should throw if fourth argument is not an array`, () => {
      let errored = false;
      try {
        server.pluginManager.register('plugin-name', pluginDelayFactory, {}, true);
      } catch(err) {
        console.log(err.message);
        errored = true;
      }
      if (!errored) { assert.fail('should fail'); }
    });

    it(`fourth argument should be optionnal`, () => {
      server.pluginManager.register('plugin-name', pluginDelayFactory, {});
      assert.ok('should pass');
    });

    it(`should throw if id already registered`, () => {
      const server = new Server(config);
      server.pluginManager.register('delay', pluginDelayFactory, {});

      let errored = false;
      try {
        server.pluginManager.register('delay', pluginDelayFactory, {});
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
        server.pluginManager.register('delay-1', pluginDelayFactory, {});
      } catch(err) {
        console.log(err.message);
        errored = true;
      }
      if (!errored) { assert.fail('should fail'); }
    });

    it(`should allow to registered same plugin factory with different ids`, () => {
      const server = new Server(config);
      server.pluginManager.register('delay-1', pluginDelayFactory, {});
      server.pluginManager.register('delay-2', pluginDelayFactory, {});

      assert.ok('should not throw');
    });
  });

  describe(`[protected] await pluginManager.init()`, () => {
    it(`should throw if started twice`, async () => {
      const server = new Server(config);
      await server.init(); // run pluginManager.init()

      let errored = false;
      try {
        await server.pluginManager.init();
      } catch(err) {
        errored = true;
        console.log(err.message);
      }
      if (!errored) { assert.fail('should throw'); }
    });
  });

  describe(`await pluginManager.get(id)`, () => {
    it(`should throw if plugin id his not a string`, async () => {
      const server = new Server(config);

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

      let errored = false;
      try {
        await server.pluginManager.get('delay');
      } catch(err) {
        errored = true;
        console.log(err.message);
      }
      if (!errored) { assert.fail('should throw'); }
    });

    it(`should be able to immediately get a plugin after server.init()`, async function() {
      const server = new Server(config);
      server.pluginManager.register('delay', pluginDelayFactory, { delayTime: 100 });

      await server.init();

      const startTime = Date.now();

      const plugin = await server.pluginManager.get('delay');

      const now = Date.now();
      const delta = now - startTime;
      assert.isBelow(delta, TIMEOUT_ERROR);

      assert.ok(plugin instanceof Plugin);
    });

    // @note - for now we just forbid this,
    // this could change in the future to dynamically import plugins at runtime
    // it(`should be able to register and await a plugin after server.init()`, async function() {
    //   const server = new Server(config);
    //   await server.init();

    //   server.pluginManager.register('delay', pluginDelayFactory, {
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

  describe(`pluginManager.onStateChange((plugins, updatedPlugin) => {})`, () => {
    it(`should properly propagate statuses`, async function() {
      this.timeout(3 * 1000);

      const server = new Server(config);
      server.pluginManager.register('delay', pluginDelayFactory, {
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

      const server = new Server(config);
      server.pluginManager.register('delay', pluginDelayFactory, {
        delayTime: 100,
      });

      const startTime = Date.now();

      server.pluginManager.onStateChange(plugins => {
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
    });
  });

  describe(`[protected] pluginManager.addClient(client)`, () => {
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

      const client = new Client({ clientType: 'test', ...config });
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

      addClientCalled2 = false;

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

      const client = new Client({ clientType: 'test', ...config });
      client.pluginManager.register('test-plugin', (Plugin) => class TestPlugin extends Plugin {});
      await client.init();
      await client.start();

      await server.stop();

      assert.equal(addClientCalled, true);
      assert.equal(addClientCalled2, false);
    });
  });

  describe(`[protected] pluginManager.removeClient(client)`, () => {
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

      const client = new Client({ clientType: 'test', ...config });
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

      const client = new Client({ clientType: 'test', ...config });
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

      removeClientCalled2 = false;

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

      const client = new Client({ clientType: 'test', ...config });
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

  describe(`plugin initialization lifecycle`, () => {
    it(`server should start if no plugins registered`, async function() {
      const server = new Server(config);
      await server.init();
      await server.start();

      assert.ok('server started');
      await server.stop();
    });

    it(`server should start if plugin registered`, async function() {
      const server = new Server(config);
      server.pluginManager.register('delay', pluginDelayFactory, { delayTime: 0.1 });
      await server.init();
      await server.start();

      assert.ok('server started');
      await server.stop();
    });

    it(`should propagate plugin start() errors`, async () => {
      const server = new Server(config);
      server.pluginManager.register('delay', pluginDelayFactory, {
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

      const server = new Server(config);
      server.pluginManager.register('delay-1', pluginDelayFactory, {
        delayTime: 100,
      });
      server.pluginManager.register('delay-2', pluginDelayFactory, {
        delayTime: 100,
      });

      await server.init();

      const startTime = Date.now();

      server.pluginManager.onStateChange((plugins, updatedPlugin) => {
        const now = Date.now();
        const delta = now - startTime;
        // assume we can 20ms jitter in the setTimeout
        if (updatedPlugin['delay-1'].status === 'inited') {
          assert.isBelow(Math.abs(delta - 0.), TIMEOUT_ERROR);
        } else if (updatedPlugin['delay-1'].status === 'started') {
          assert.isBelow(Math.abs(delta - 100), TIMEOUT_ERROR);
        }

        if (updatedPlugin['delay-2'].status === 'inited') {
          assert.isBelow(Math.abs(delta - 0.), TIMEOUT_ERROR);
        } else if (updatedPlugin['delay-2'].status === 'started') {
          assert.isBelow(Math.abs(delta - 100), TIMEOUT_ERROR);
        }
      });

      await server.start();
      await server.stop();
    });

    it(`should be able to chain plugin initialization`, async function() {
      this.timeout(3 * 1000);

      const server = new Server(config);

      server.pluginManager.register('delay-1', pluginDelayFactory, {
        delayTime: 100,
      });
      // delay-2 depends on delay-1
      server.pluginManager.register('delay-2', pluginDelayFactory, {
        delayTime: 100,
      }, ['delay-1']);

      await server.init();

      const startTime = Date.now();

      server.pluginManager.onStateChange((plugins, updatedPlugin) => {
        console.log(statuses);
        const now = Date.now();
        const delta = now - startTime;
        // assume we can 20ms jitter in the setTimeout
        if (updatedPlugin['delay-1'].status === 'inited') {
          assert.isBelow(Math.abs(delta - 0.), TIMEOUT_ERROR);
        } else if (updatedPlugin['delay-1'].status === 'started') {
          assert.isBelow(Math.abs(delta - 100), TIMEOUT_ERROR);
        }

        if (updatedPlugin['delay-2'].status === 'inited') {
          assert.isBelow(Math.abs(delta - 100), TIMEOUT_ERROR);
        } else if (updatedPlugin['delay-2'].status === 'started') {
          assert.isBelow(Math.abs(delta - 200), TIMEOUT_ERROR);
        }
      });

      await server.start();
      await server.stop();
    });

    it(`should support complex plugin dependency graphs`, async function() {
      this.timeout(3 * 1000);

      // delay-1 --> delay-2 --|
      // delay-3 --------------+-> delay-4

      const server = new Server(config);

      server.pluginManager.register('delay-1', pluginDelayFactory, {
        delayTime: 200,
      });
      // delay-2 depends on delay-1
      server.pluginManager.register('delay-2', pluginDelayFactory, {
        delayTime: 200,
      }, ['delay-1']);

      // delay 3 ready (at 0.6) after delay delay-2 (at 0.4)
      server.pluginManager.register('delay-3', pluginDelayFactory, {
        delayTime: 600,
      });

      server.pluginManager.register('delay-4', pluginDelayFactory, {
        delayTime: 200,
      }, ['delay-2', 'delay-3']);

      await server.init();

      const startTime = Date.now();

      server.pluginManager.onStateChange((plugins, updatedPlugin) => {
        const now = Date.now();
        const delta = now - startTime;
        // assume we can 20ms jitter in the setTimeout
        if (updatedPlugin['delay-1'].status === 'inited') {
          assert.isBelow(Math.abs(delta - 0.), TIMEOUT_ERROR);
        } else if (updatedPlugin['delay-1'].status === 'started') {
          assert.isBelow(Math.abs(delta - 200), TIMEOUT_ERROR);
        }

        if (updatedPlugin['delay-2'].status === 'inited') {
          assert.isBelow(Math.abs(delta - 200), TIMEOUT_ERROR);
        } else if (updatedPlugin['delay-2'].status === 'started') {
          assert.isBelow(Math.abs(delta - 400), TIMEOUT_ERROR);
        }

        if (updatedPlugin['delay-3'].status === 'inited') {
          assert.isBelow(Math.abs(delta - 0.), TIMEOUT_ERROR);
        } else if (updatedPlugin['delay-3'].status === 'started') {
          assert.isBelow(Math.abs(delta - 600), TIMEOUT_ERROR);
        }

        if (updatedPlugin['delay-4'].status === 'inited') {
          assert.isBelow(Math.abs(delta - 600), TIMEOUT_ERROR);
        } else if (updatedPlugin['delay-4'].status === 'started') {
          assert.isBelow(Math.abs(delta - 800), TIMEOUT_ERROR);
        }
      });

      await server.start();
      await server.stop();
    });
  });
});
