import { assert } from 'chai';

import { Server } from '../../src/server/index.js';
import { Client } from '../../src/client/index.js';
import ClientPluginManager from '../../src/client/ClientPluginManager.js';
import ClientPlugin from '../../src/client/ClientPlugin.js';
import ServerPluginDelay from '../utils/ServerPluginDelay.js';
import ClientPluginDelay from '../utils/ClientPluginDelay.js';
import config from '../utils/config.js';

describe(`# PluginManagerClient`, () => {
  let server = null;

  beforeEach(async function() {
    server = new Server(config);

    ['delay-1', 'delay-2', 'delay-3', 'delay-4'].forEach((id) => {
      server.pluginManager.register(id, ServerPluginDelay, {
        delayTime: 0.,
      });
    });

    await server.start();
  });

  afterEach(async () => {
    await server.stop();
  });

  describe(`## [private] constructor(client)`, () => {
    it(`should throw if argument is not instance of Client`, () => {
      let errored = false;
      try {
        new ClientPluginManager({});
      } catch(err) {
        console.log(err.message);
        errored = true;
      }
      if (!errored) { assert.fail('should fail'); }
    });
  });

  describe(`## register(id, pluginFactory)`, () => {
    let client;

    beforeEach(() => {
      client = new Client({ role: 'test', ...config });
    });

    it(`should throw if first argument is not a string`, () => {
      let errored = false;
      try {
        client.pluginManager.register(true, ClientPluginDelay);
      } catch(err) {
        console.log(err.message);
        errored = true;
      }
      if (!errored) { assert.fail('should fail'); }
    });

    it(`should throw if second argument does not extend ClientPlugin`, () => {
      class Test {}

      let errored = false;
      try {
        client.pluginManager.register('plugin-id', Test);
      } catch(err) {
        console.log(err.message);
        errored = true;
      }
      if (!errored) { assert.fail('should fail'); }
    });

    it(`should throw if third argument is not an object`, () => {
      let errored = false;
      try {
        client.pluginManager.register('plugin-id', ClientPluginDelay, true);
      } catch(err) {
        console.log(err.message);
        errored = true;
      }
      if (!errored) { assert.fail('should fail'); }
    });

    it(`third argument should be optionnal`, () => {
      client.pluginManager.register('plugin-id', ClientPluginDelay);
      assert.ok('should pass');
    });

    it(`should throw if fourth argument is not an array`, () => {
      let errored = false;
      try {
        client.pluginManager.register('plugin-id', ClientPluginDelay, {}, true);
      } catch(err) {
        console.log(err.message);
        errored = true;
      }
      if (!errored) { assert.fail('should fail'); }
    });

    it(`fourth argument should be optionnal`, () => {
      client.pluginManager.register('plugin-id', ClientPluginDelay, {});
      assert.ok('should pass');
    });

    it(`should throw if id already registered`, () => {
      client.pluginManager.register('delay-1', ClientPluginDelay, {});

      let errored = false;
      try {
        client.pluginManager.register('delay-1', ClientPluginDelay, {});
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
        client.pluginManager.register('delay-1', ClientPluginDelay, {});
      } catch(err) {
        console.log(err.message);
        errored = true;
      }
      if (!errored) { assert.fail('should fail'); }
    });

    it(`should allow to registered same plugin factory with different ids`, () => {
      client.pluginManager.register('delay-1', ClientPluginDelay, {});
      client.pluginManager.register('delay-2', ClientPluginDelay, {});

      assert.ok('should not throw');
    });

    it(`should throw when registering server side plugin on client side`, async () => {
      let errored = false;

      try {
        client.pluginManager.register('delay-1', ServerPluginDelay, {});
      } catch (err) {
        console.log(err.message);
        errored = true;
      }

      if (!errored) {
        assert.fail(`should have thrown`);
      }
    });
  });

  describe(`## async get(id)`, () => {
    it(`should throw if called before server.init()`, async () => {
      const client = new Client({ role: 'test', ...config });
      client.pluginManager.register('delay', ClientPluginDelay, { delayTime: 100 });

      let errored = false;
      try {
        await client.pluginManager.get('delay');
      } catch(err) {
        errored = true;
        console.log(err.message);
      }
      if (!errored) { assert.fail('should throw'); }
    });

    it(`should throw if plugin id his not a string`, async () => {
      const client = new Client({ role: 'test', ...config });

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
      const client = new Client({ role: 'test', ...config });

      let errored = false;
      try {
        await client.pluginManager.get('delay-1');
      } catch(err) {
        errored = true;
        console.log(err.message);
      }
      if (!errored) { assert.fail('should throw'); }
    });

    it(`plugin should be started and immediately available after server.init()`, async function() {
      const client = new Client({ role: 'test', ...config });
      client.pluginManager.register('delay-1', ClientPluginDelay, { delayTime: 100 });

      const TIMEOUT_ERROR = 30;
      await client.init();

      const startTime = Date.now();

      const plugin = await client.pluginManager.get('delay-1');

      assert.isBelow(Date.now() - startTime, TIMEOUT_ERROR);
      assert.equal(plugin.status, 'started');
      assert.ok(plugin instanceof ClientPlugin);
    });

    // @note - for now we just forbid this,
    // this could change in the future to dynamically import plugins at runtime
    // it(`should be able to register and await a plugin after client.init()`, async function() {
    //   client = new Client({ role: 'test', ...config });
    //   await client.init();

    //   client.pluginManager.register('delay-1', ClientPluginDelay, {
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

  describe(`## onStateChange((states, updatedPlugin) => {})`, () => {
    it(`should properly propagate statuses`, async function() {
      this.timeout(3 * 1000);

      const client = new Client({ role: 'test', ...config });
      client.pluginManager.register('delay-1', ClientPluginDelay, {
        delayTime: 100,
      });

      const expected = [
        'idle',
        'inited',
        'started',
      ];
      let index = 0;

      client.pluginManager.onStateChange(plugins => {
        assert.deepStrictEqual(expected[index], plugins['delay-1']. status);
        index += 1;
      });

      await client.init();
    });

    it(`should be able to monitor plugin lifecycle`, async function() {
      this.timeout(3 * 1000);

      const client = new Client({ role: 'test', ...config });
      client.pluginManager.register('delay-1', ClientPluginDelay, {
        delayTime: 100,
      });

      const TIMEOUT_ERROR = 30;
      const startTime = Date.now();
      let onStateChangeCalled = false;

      client.pluginManager.onStateChange(plugins => {
        onStateChangeCalled = true;
        const now = Date.now();
        const delta = now - startTime;
        // assume we can 20ms jitter in the setTimeout
        if (plugins['delay-1'].status === 'inited') {
          assert.isBelow(Math.abs(delta - 0), TIMEOUT_ERROR);
        } else if (plugins['delay-1'].status === 'started') {
          assert.isBelow(Math.abs(delta - 100), TIMEOUT_ERROR);
        }
      });

      await client.init();

      if (!onStateChangeCalled) {
        assert.fail('onStateChange not called');
      }
    });
  });

  describe(`## getRegisteredPlugins()`, () => {
    it(`should return the list of registered plugins`, () => {
      const client = new Client({ role: 'test', ...config });
      client.pluginManager.register('delay-1', ClientPluginDelay, { delayTime: 0 });
      client.pluginManager.register('delay-2', ClientPluginDelay, { delayTime: 0 });

      const registeredPlugins = client.pluginManager.getRegisteredPlugins();
      assert.deepEqual(['delay-1', 'delay-2'], registeredPlugins)
    });
  });

  describe(`## [lifecyle] plugin initialization`, () => {
    it(`client should start if no plugins registered`, async function() {
      const client = new Client({ role: 'test', ...config });
      await client.init();
      await client.start();

      assert.ok('client started');
      await client.stop();
    });

    it(`client should start if plugin registered`, async function() {
      const client = new Client({ role: 'test', ...config });
      client.pluginManager.register('delay-1', ClientPluginDelay, { delayTime: 0.1 });
      await client.init();
      await client.start();

      assert.ok('client started');
      await client.stop();
    });

    it(`should propagate plugin start() errors`, async () => {
      const client = new Client({ role: 'test', ...config });
      client.pluginManager.register('delay-1', ClientPluginDelay, {
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

      // delay-1 --|
      // delay-2 --|

      const client = new Client({ role: 'test', ...config });
      client.pluginManager.register('delay-1', ClientPluginDelay, {
        delayTime: 100,
      });
      client.pluginManager.register('delay-2', ClientPluginDelay, {
        delayTime: 100,
      });

      const TIMEOUT_ERROR = 30; // take websocket connection latency into account
      const startTime = Date.now();
      let onStateChangeCalled = false;

      client.pluginManager.onStateChange((plugins, updatedPlugin) => {
        onStateChangeCalled = true;
        if (!updatedPlugin) { return }

        const now = Date.now();
        const delta = now - startTime;
        // assume we some jitter in the setTimeout
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

      await client.start();
      await client.stop();

      if (!onStateChangeCalled) {
        assert.fail('onStateChange not called');
      }
    });

    it(`should be able to chain plugin initialization`, async function() {
      this.timeout(3 * 1000);

      // delay-1 --> delay-2 --|

      const client = new Client({ role: 'test', ...config });

      client.pluginManager.register('delay-1', ClientPluginDelay, {
        delayTime: 100,
      });
      // delay-2 depends on delay-1
      client.pluginManager.register('delay-2', ClientPluginDelay, {
        delayTime: 100,
      }, ['delay-1']);

      const TIMEOUT_ERROR = 30; // take websocket connection latency into account
      const startTime = Date.now();
      let onStateChangeCalled = false;

      client.pluginManager.onStateChange((plugins, updatedPlugin) => {
        onStateChangeCalled = true;
        if (!updatedPlugin) { return }

        const now = Date.now();
        const delta = now - startTime;
        // assume we can 20ms jitter in the setTimeout
        if (updatedPlugin.id === 'delay-1' && updatedPlugin.status === 'inited') {
          assert.isBelow(Math.abs(delta - 0.), TIMEOUT_ERROR);
        } else if (updatedPlugin.id === 'delay-1' && updatedPlugin === 'started') {
          assert.isBelow(Math.abs(delta - 100), TIMEOUT_ERROR);
        }

        if (updatedPlugin.id === 'delay-2' && updatedPlugin.status === 'inited') {
          assert.isBelow(Math.abs(delta - 100), TIMEOUT_ERROR);
        } else if (updatedPlugin.id === 'delay-2' && updatedPlugin === 'started') {
          assert.isBelow(Math.abs(delta - 200), TIMEOUT_ERROR);
        }
      });

      await client.start();
      await client.stop();

      if (!onStateChangeCalled) {
        assert.fail('onStateChange not called');
      }
    });

    it(`should support complex plugin dependency graphs`, async function() {
      this.timeout(3 * 1000);

      // delay-1 --> delay-2 --|
      // delay-3 --------------+-> delay-4

      const client = new Client({ role: 'test', ...config });

      client.pluginManager.register('delay-1', ClientPluginDelay, {
        delayTime: 200,
      });
      // delay-2 depends on delay-1
      client.pluginManager.register('delay-2', ClientPluginDelay, {
        delayTime: 200,
      }, ['delay-1']);

      // delay 3 ready (at 0.6) after delay delay-2 (at 0.4)
      client.pluginManager.register('delay-3', ClientPluginDelay, {
        delayTime: 600,
      });

      client.pluginManager.register('delay-4', ClientPluginDelay, {
        delayTime: 200,
      }, ['delay-2', 'delay-3']);

      const TIMEOUT_ERROR = 30; // take websocket connection latency into account
      const startTime = Date.now();
      let onStateChangeCalled = false;

      client.pluginManager.onStateChange((plugins, updatedPlugin) => {
        onStateChangeCalled = true;
        if (!updatedPlugin) { return }

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

      await client.start();
      await client.stop();

      if (!onStateChangeCalled) {
        assert.fail('onStateChange not called');
      }
    });
  });
});
