const path = require('path');
const assert = require('chai').assert;

const Server = require('../server').Server;
const serverPluginDelayFactory = require('@soundworks/plugin-delay/server').default;

const Client = require('../client').Client;
const PluginManager = require('../client/PluginManager').default;
const Plugin = require('../client/Plugin').default;
const pluginDelayFactory = require('@soundworks/plugin-delay/client').default;

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

// accepted error in delay plugin timeouts (in ms)
const TIMEOUT_ERROR = 15.;

describe(`client::PluginManager`, () => {
  let server = null;

  before(async function() {
    server = new Server(config);

    ['delay-1', 'delay-2', 'delay-3', 'delay-4'].forEach((id) => {
      server.pluginManager.register(id, serverPluginDelayFactory, {
        delayTime: 0.,
      });
    });

    await server.init();

    await server.start();
  });

  after(async () => {
    await server.stop();
  });

  describe(`(protected) new PluginManager(client)`, () => {
    it(`should throw if argument is not instance of Client`, () => {
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
    let client;

    beforeEach(() => {
      client = new Client({ clientType: 'test', ...config });
    });

    it(`should throw if first argument is not a string`, () => {
      let errored = false;
      try {
        client.pluginManager.register(true, pluginDelayFactory);
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
        client.pluginManager.register('plugin-id', factory);
      } catch(err) {
        console.log(err.message);
        errored = true;
      }
      if (!errored) { assert.fail('should fail'); }
    });

    it(`should throw if third argument is not an object`, () => {
      let errored = false;
      try {
        client.pluginManager.register('plugin-id', pluginDelayFactory, true);
      } catch(err) {
        console.log(err.message);
        errored = true;
      }
      if (!errored) { assert.fail('should fail'); }
    });

    it(`third argument should be optionnal`, () => {
      client.pluginManager.register('plugin-id', pluginDelayFactory);
      assert.ok('should pass');
    });

    it(`should throw if fourth argument is not an array`, () => {
      let errored = false;
      try {
        client.pluginManager.register('plugin-id', pluginDelayFactory, {}, true);
      } catch(err) {
        console.log(err.message);
        errored = true;
      }
      if (!errored) { assert.fail('should fail'); }
    });

    it(`fourth argument should be optionnal`, () => {
      client.pluginManager.register('plugin-id', pluginDelayFactory, {});
      assert.ok('should pass');
    });

    it(`should throw if id already registered`, () => {
      client.pluginManager.register('delay-1', pluginDelayFactory, {});

      let errored = false;
      try {
        client.pluginManager.register('delay-1', pluginDelayFactory, {});
      } catch(err) {
        console.log(err.message);
        errored = true;
      }
      if (!errored) { assert.fail('should fail'); }
    });

    it(`should throw if called after "client.init" (may change in the future)`, async () => {
      await client.init();

      let errored = false;
      try {
        client.pluginManager.register('delay-1', pluginDelayFactory, {});
      } catch(err) {
        console.log(err.message);
        errored = true;
      }
      if (!errored) { assert.fail('should fail'); }
    });

    it(`should allow to registered same plugin factory with different ids`, () => {
      const client = new Server(config);
      client.pluginManager.register('delay-1', pluginDelayFactory, {});
      client.pluginManager.register('delay-2', pluginDelayFactory, {});

      assert.ok('should not throw');
    });
  });

  describe(`(protected) await pluginManager.init()`, () => {
    it(`should throw if started twice`, async () => {
      client = new Client({ clientType: 'test', ...config });
      await client.init(); // run pluginManager.init()

      let errored = false;
      try {
        await client.pluginManager.init();
      } catch(err) {
        errored = true;
        console.log(err.message);
      }
      if (!errored) { assert.fail('should throw'); }
    });
  });

  describe(`await pluginManager.get(id)`, () => {
    it(`should throw if plugin id his not a string`, async () => {
      client = new Client({ clientType: 'test', ...config });

      let errored = false;
      try {
        await client.pluginManager.get(true);
      } catch(err) {
        errored = true;
        console.log(err.message);
      }
      if (!errored) { assert.fail('should throw'); }
    });

    it(`should throw if plugin id has not been registered`, async () => {
      client = new Client({ clientType: 'test', ...config });

      let errored = false;
      try {
        await client.pluginManager.get('delay-1');
      } catch(err) {
        errored = true;
        console.log(err.message);
      }
      if (!errored) { assert.fail('should throw'); }
    });

    it(`should be able to immediately get a plugin after client.init()`, async function() {
      client = new Client({ clientType: 'test', ...config });
      client.pluginManager.register('delay-1', pluginDelayFactory, { delayTime: 100 });

      await client.init();

      const startTime = Date.now();

      const plugin = await client.pluginManager.get('delay-1');

      const now = Date.now();
      const delta = now - startTime;
      assert.isBelow(delta, TIMEOUT_ERROR);

      assert.ok(plugin instanceof Plugin);
    });

    // @note - for now we just forbid this,
    // this could change in the future to dynamically import plugins at runtime
    // it(`should be able to register and await a plugin after client.init()`, async function() {
    //   client = new Client({ clientType: 'test', ...config });
    //   await client.init();

    //   client.pluginManager.register('delay-1', pluginDelayFactory, {
    //     delayTime: 100,
    //   });

    //   const startTime = Date.now();

    //   client.pluginManager.observe((statuses, updates) => {
    //     const now = Date.now();
    //     const delta = now - startTime;
    //     // assume we can 20ms jitter in the setTimeout
    //     if (updates['delay-1'] === 'inited') {
    //       assert.isBelow(Math.abs(delta - 0.), TIMEOUT_ERROR);
    //     } else if (updates['delay-1'] === 'started') {
    //       assert.isBelow(Math.abs(delta - 100), TIMEOUT_ERROR);
    //     }
    //   });

    //   const plugin = await client.pluginManager.get('delay-1');

    //   const now = Date.now();
    //   const delta = now - startTime;
    //   assert.isBelow(Math.abs(delta - 100), TIMEOUT_ERROR);

    //   assert.ok(plugin instanceof Plugin);
    // });
  });

  describe(`pluginManager.observe((statuses, updates) => {})`, () => {
    it(`should properly propagate statuses`, async function() {
      this.timeout(3 * 1000);

      client = new Client({ clientType: 'test', ...config });
      client.pluginManager.register('delay-1', pluginDelayFactory, {
        delayTime: 100,
      });

      const expected = [
        { 'delay-1': 'idle' },
        { 'delay-1': 'inited' },
        { 'delay-1': 'started' },
      ];
      let index = 0;

      client.pluginManager.observe(statuses => {
        assert.deepEqual(expected[index], statuses);
        index += 1;
      });

      await client.init();
    });

    it(`should be able to monitor plugin lifecycle`, async function() {
      this.timeout(3 * 1000);

      client = new Client({ clientType: 'test', ...config });
      client.pluginManager.register('delay-1', pluginDelayFactory, {
        delayTime: 100,
      });

      const startTime = Date.now();

      client.pluginManager.observe(statuses => {
        const now = Date.now();
        const delta = now - startTime;
        // assume we can 20ms jitter in the setTimeout
        if (statuses['delay-1'] === 'inited') {
          assert.isBelow(Math.abs(delta - 0), TIMEOUT_ERROR);
        } else if (statuses['delay-1'] === 'started') {
          assert.isBelow(Math.abs(delta - 100), TIMEOUT_ERROR);
        }
      });

      await client.init();
    });
  });

  describe(`plugin initialization lifecycle`, () => {
    it(`client should start if no plugins registered`, async function() {
      client = new Client({ clientType: 'test', ...config });
      await client.init();
      await client.start();

      assert.ok('client started');
      await client.stop();
    });

    it(`client should start if plugin registered`, async function() {
      client = new Client({ clientType: 'test', ...config });
      client.pluginManager.register('delay-1', pluginDelayFactory, { delayTime: 0.1 });
      await client.init();
      await client.start();

      assert.ok('client started');
      await client.stop();
    });

    it(`should propagate plugin start() errors`, async () => {
      client = new Client({ clientType: 'test', ...config });
      client.pluginManager.register('delay-1', pluginDelayFactory, {
        delayTime: 0.1,
        throwError: true,
      });

      let errored = false;
      try {
        await client.init();
      } catch(err) {
        console.log(err.message);
        errored = true;
      }
      if (!errored) { assert.fail('should throw'); }
    });

    it(`should be able to require several plugins in parallel`, async function() {
      this.timeout(3 * 1000);

      client = new Client({ clientType: 'test', ...config });
      client.pluginManager.register('delay-1', pluginDelayFactory, {
        delayTime: 100,
      });
      client.pluginManager.register('delay-2', pluginDelayFactory, {
        delayTime: 100,
      });

      await client.init();

      const startTime = Date.now();

      client.pluginManager.observe((statuses, updates) => {
        const now = Date.now();
        const delta = now - startTime;
        // assume we can 20ms jitter in the setTimeout
        if (updates['delay-1'] === 'inited') {
          assert.isBelow(Math.abs(delta - 0.), TIMEOUT_ERROR);
        } else if (updates['delay-1'] === 'started') {
          assert.isBelow(Math.abs(delta - 100), TIMEOUT_ERROR);
        }

        if (updates['delay-2'] === 'inited') {
          assert.isBelow(Math.abs(delta - 0.), TIMEOUT_ERROR);
        } else if (updates['delay-2'] === 'started') {
          assert.isBelow(Math.abs(delta - 100), TIMEOUT_ERROR);
        }
      });

      await client.start();
      await client.stop();
    });

    it(`should be able to chain plugin initialization`, async function() {
      this.timeout(3 * 1000);

      client = new Client({ clientType: 'test', ...config });

      client.pluginManager.register('delay-1', pluginDelayFactory, {
        delayTime: 100,
      });
      // delay-2 depends on delay-1
      client.pluginManager.register('delay-2', pluginDelayFactory, {
        delayTime: 100,
      }, ['delay-1']);

      await client.init();

      const startTime = Date.now();

      client.pluginManager.observe((statuses, updates) => {
        console.log(statuses);
        const now = Date.now();
        const delta = now - startTime;
        // assume we can 20ms jitter in the setTimeout
        if (updates['delay-1'] === 'inited') {
          assert.isBelow(Math.abs(delta - 0.), TIMEOUT_ERROR);
        } else if (updates['delay-1'] === 'started') {
          assert.isBelow(Math.abs(delta - 100), TIMEOUT_ERROR);
        }

        if (updates['delay-2'] === 'inited') {
          assert.isBelow(Math.abs(delta - 100), TIMEOUT_ERROR);
        } else if (updates['delay-2'] === 'started') {
          assert.isBelow(Math.abs(delta - 200), TIMEOUT_ERROR);
        }
      });

      await client.start();
      await client.stop();
    });

    it(`should support complex plugin dependency graphs`, async function() {
      this.timeout(3 * 1000);

      // delay-1 --> delay-2 --|
      // delay-3 --------------+-> delay-4

      client = new Client({ clientType: 'test', ...config });

      client.pluginManager.register('delay-1', pluginDelayFactory, {
        delayTime: 200,
      });
      // delay-2 depends on delay-1
      client.pluginManager.register('delay-2', pluginDelayFactory, {
        delayTime: 200,
      }, ['delay-1']);

      // delay 3 ready (at 0.6) after delay delay-2 (at 0.4)
      client.pluginManager.register('delay-3', pluginDelayFactory, {
        delayTime: 600,
      });

      client.pluginManager.register('delay-4', pluginDelayFactory, {
        delayTime: 200,
      }, ['delay-2', 'delay-3']);

      await client.init();

      const startTime = Date.now();

      client.pluginManager.observe((statuses, updates) => {
        const now = Date.now();
        const delta = now - startTime;
        // assume we can 20ms jitter in the setTimeout
        if (updates['delay-1'] === 'inited') {
          assert.isBelow(Math.abs(delta - 0.), TIMEOUT_ERROR);
        } else if (updates['delay-1'] === 'started') {
          assert.isBelow(Math.abs(delta - 200), TIMEOUT_ERROR);
        }

        if (updates['delay-2'] === 'inited') {
          assert.isBelow(Math.abs(delta - 200), TIMEOUT_ERROR);
        } else if (updates['delay-2'] === 'started') {
          assert.isBelow(Math.abs(delta - 400), TIMEOUT_ERROR);
        }

        if (updates['delay-3'] === 'inited') {
          assert.isBelow(Math.abs(delta - 0.), TIMEOUT_ERROR);
        } else if (updates['delay-3'] === 'started') {
          assert.isBelow(Math.abs(delta - 600), TIMEOUT_ERROR);
        }

        if (updates['delay-4'] === 'inited') {
          assert.isBelow(Math.abs(delta - 600), TIMEOUT_ERROR);
        } else if (updates['delay-4'] === 'started') {
          assert.isBelow(Math.abs(delta - 800), TIMEOUT_ERROR);
        }
      });

      await client.start();
      await client.stop();
    });
  });

  describe(`pluginManager.getRegisteredPlugins()`, () => {
    it(`should return the list of registered plugins`, () => {
      client = new Client({ clientType: 'test', ...config });
      client.pluginManager.register('delay-1', pluginDelayFactory, { delayTime: 0 });
      client.pluginManager.register('delay-2', pluginDelayFactory, { delayTime: 0 });

      const registeredPlugins = client.pluginManager.getRegisteredPlugins();
      assert.deepEqual(['delay-1', 'delay-2'], registeredPlugins)
    });
  });
});
