const path = require('path');
const assert = require('chai').assert;

const Server = require('../server').Server;
const ServerAbstractExperience = require('../server').AbstractExperience;
const serverPluginDelayFactory = require('@soundworks/plugin-delay/server').default;

const Client = require('../client').Client;
const ClientAbstractExperience = require('../client').AbstractExperience;
const clientPluginDelayFactory = require('@soundworks/plugin-delay/client').default;

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

// accepted error in delay plugin timeouts
const TIMEOUT_ERROR = 0.025;

describe(`client::PluginManager`, () => {
  let server = null;

  before(async function() {
    class ServerTestExperience extends ServerAbstractExperience {
      constructor(server, clientTypes) {
        super(server, clientTypes);
        this.require('delay-1');
        this.require('delay-2');
        this.require('delay-3');
        this.require('delay-4');
      }
    }

    server = new Server();

    ['delay-1', 'delay-2', 'delay-3', 'delay-4'].forEach((name) => {
      server.pluginManager.register(name, serverPluginDelayFactory, {
        startedDelayTime: 0.,
        readyDelayTime: 0.,
      });
    });

    await server.init(config);
    const experience = new ServerTestExperience(server, 'test');

    await server.start();
  });

  after(async () => {
    await server.stop();
  });

  describe(`pluginManager.register(name, pluginFactory)`, () => {
    it(`should throw if name already registered`, () => {
      const client = new Client();
      server.pluginManager.register('delay', clientPluginDelayFactory, {});

      assert.throws(() => {
        server.pluginManager.register('delay', clientPluginDelayFactory, {});
      });
    });
  });

  describe(`pluginManager.get(name[, _experience])`, () => {
    it(`should throw if plugin name has not been registered`, () => {
      const client = new Client();

      assert.throws(() => {
        client.pluginManager.get('delay');
      });
    });

    // this is often the case with filesystem for example
    it(`should be able to get plugin without experience binding`, async function() {
      const client = new Client();
      client.pluginManager.register('delay-1', clientPluginDelayFactory, {});
      await client.init({ clientType: 'test', ...config });

      const plugin = client.pluginManager.get('delay-1');
    });

    // this is more a Client implementation detail than a state manager one
    // this is a problem...
    it(`[FIXME] should throw if required client side but not server side`, async function() {
      const client = new Client();
      // 'delay' does not exists server side
      client.pluginManager.register('delay', clientPluginDelayFactory, {});
      await client.init({ clientType: 'test', ...config });

      class ClientTestExperience extends ClientAbstractExperience {
        constructor(client) {
          super(client);
          this.require('delay');
        }
      }

      const experience = new ClientTestExperience(client);

      try {
        await client.start();
        assert.fail('should not go here');
      } catch(err) {
        // console.log('heiho', err);
        assert.ok('error has been thrown');
      }
    });

    // @note - this API should be "private", should be reviewed
    it(`should throw if plugin required after client.start()`, async function() {
      const client = new Client();
      client.pluginManager.register('delay-1', clientPluginDelayFactory, {});
      await client.init({ clientType: 'test', ...config });

      class ClientTestExperience extends ClientAbstractExperience {
        constructor(client) {
          super(client);
          // do not require plugin heres
        }
      }
      const experience = new ClientTestExperience(client);

      await client.start();

      assert.throws(() => {
        client.pluginManager.get('delay-1', experience);
      });

      await client.stop();
    });


  });

  describe(`pluginManager.observe((statuses, updates) => {})`, () => {
    it(`should properly propagate statuses`, async function() {
      this.timeout(3 * 1000);

      const client = new Client();
      client.pluginManager.register('delay-1', clientPluginDelayFactory, {
        startedDelayTime: 0.1,
        readyDelayTime: 0.1,
      });
      await client.init({ clientType: 'test', ...config });

      class ClientTestExperience extends ClientAbstractExperience {
        constructor(client) {
          super(client);
          this.require('delay-1');
        }
      }
      const experience = new ClientTestExperience(client, 'test');

      const startTime = Date.now() / 1000.;

      const expected = [
        { 'delay-1': 'idle' },
        { 'delay-1': 'started' },
        { 'delay-1': 'ready' },
      ];
      let index = 0;

      client.pluginManager.observe(statuses => {
        assert.deepEqual(expected[index], statuses);
        index += 1;
      });

      await client.start();
      await client.stop();
    });

    it(`should be able to monitor plugin lifecycle`, async function() {
      this.timeout(3 * 1000);

      const client = new Client();
      client.pluginManager.register('delay-1', clientPluginDelayFactory, {
        startedDelayTime: 0.1,
        readyDelayTime: 0.1,
      });
      await client.init({ clientType: 'test', ...config });

      class ClientTestExperience extends ClientAbstractExperience {
        constructor(client) {
          super(client);
          this.require('delay-1');
        }
      }
      const experience = new ClientTestExperience(client, 'test');

      const startTime = Date.now() / 1000.;

      client.pluginManager.observe(status => {
        const now = Date.now() / 1000.;
        const delta = now - startTime;
        // assume we can 20ms jitter in the setTimeout
        if (status['delay'] === 'started') {
          assert.isBelow(Math.abs(delta - 0.1), TIMEOUT_ERROR);
        } else if (status['delay'] === 'ready') {
          assert.isBelow(Math.abs(delta - 0.2), TIMEOUT_ERROR);
        }
      });

      await client.start();
      await client.stop();
    });
  });

  describe(`plugin initialization lifecycle`, () => {
    it(`client should start if no plugins registered`, async function() {
      const client = new Client();
      await client.init({ clientType: 'test', ...config });
      // start plugin manager
      await client.start();
      assert.ok('client started');
      await client.stop();
    });

    it(`should be able to require several plugins in parallel`, async function() {
      this.timeout(3 * 1000);

      const client = new Client();
      client.pluginManager.register('delay-1', clientPluginDelayFactory, {
        startedDelayTime: 0.1,
        readyDelayTime: 0.1,
      });
      client.pluginManager.register('delay-2', clientPluginDelayFactory, {
        startedDelayTime: 0.1,
        readyDelayTime: 0.1,
      });

      await client.init({ clientType: 'test', ...config });

      class ClientTestExperience extends ClientAbstractExperience {
        constructor(client) {
          super(client);
          this.require('delay-1');
          this.require('delay-2');
        }
      }
      const experience = new ClientTestExperience(client, 'test');

      const startTime = Date.now() / 1000.;

      client.pluginManager.observe((statuses, updates) => {
        const now = Date.now() / 1000.;
        const delta = now - startTime;
        // assume we can 20ms jitter in the setTimeout
        if (updates['delay-1'] === 'started') {
          assert.isBelow(Math.abs(delta - 0.1), TIMEOUT_ERROR);
        } else if (updates['delay-1'] === 'ready') {
          assert.isBelow(Math.abs(delta - 0.2), TIMEOUT_ERROR);
        }

        if (updates['delay-2'] === 'started') {
          assert.isBelow(Math.abs(delta - 0.1), TIMEOUT_ERROR);
        } else if (updates['delay-2'] === 'ready') {
          assert.isBelow(Math.abs(delta - 0.2), TIMEOUT_ERROR);
        }
      });

      await client.start();
      await client.stop();
    });

    it(`should be able to chain plugin initialization`, async function() {
      this.timeout(3 * 1000);

      const client = new Client();

      client.pluginManager.register('delay-1', clientPluginDelayFactory, {
        startedDelayTime: 0.1,
        readyDelayTime: 0.1,
      });
      // delay-2 depends on delay-1
      client.pluginManager.register('delay-2', clientPluginDelayFactory, {
        startedDelayTime: 0.1,
        readyDelayTime: 0.1,
      }, ['delay-1']);

      await client.init({ clientType: 'test', ...config });

      class ClientTestExperience extends ClientAbstractExperience {
        constructor(client) {
          super(client);
          this.require('delay-1');
          this.require('delay-2');
        }
      }

      const experience = new ClientTestExperience(client, 'test');

      const startTime = Date.now() / 1000.;

      client.pluginManager.observe((statuses, updates) => {
        const now = Date.now() / 1000.;
        const delta = now - startTime;
        // assume we can 20ms jitter in the setTimeout
        if (updates['delay-1'] === 'started') {
          assert.isBelow(Math.abs(delta - 0.1), TIMEOUT_ERROR);
        } else if (updates['delay-1'] === 'ready') {
          assert.isBelow(Math.abs(delta - 0.2), TIMEOUT_ERROR);
        }

        if (updates['delay-2'] === 'started') {
          assert.isBelow(Math.abs(delta - 0.3), TIMEOUT_ERROR);
        } else if (updates['delay-2'] === 'ready') {
          assert.isBelow(Math.abs(delta - 0.4), TIMEOUT_ERROR);
        }
      });

      await client.start();
      await client.stop();
    });

    it(`should support complex plugin dependency graphs`, async function() {
      this.timeout(3 * 1000);

      // delay-1 --> delay-2 --|
      // delay-3 --------------+-> delay-4

      const client = new Client();

      client.pluginManager.register('delay-1', clientPluginDelayFactory, {
        startedDelayTime: 0.1,
        readyDelayTime: 0.1,
      });
      // delay-2 depends on delay-1
      client.pluginManager.register('delay-2', clientPluginDelayFactory, {
        startedDelayTime: 0.1,
        readyDelayTime: 0.1,
      }, ['delay-1']);

      // delay 3 ready (at 0.6) after delay delay-2 (at 0.4)
      client.pluginManager.register('delay-3', clientPluginDelayFactory, {
        startedDelayTime: 0.3,
        readyDelayTime: 0.3,
      });

      client.pluginManager.register('delay-4', clientPluginDelayFactory, {
        startedDelayTime: 0.1,
        readyDelayTime: 0.1,
      }, ['delay-2', 'delay-3']);

      await client.init({ clientType: 'test', ...config });

      class ClientTestExperience extends ClientAbstractExperience {
        constructor(client) {
          super(client);
          this.require('delay-1');
          this.require('delay-2');
          this.require('delay-3');
          this.require('delay-4');
        }
      }

      const experience = new ClientTestExperience(client, 'test');

      const startTime = Date.now() / 1000.;

      client.pluginManager.observe((statuses, updates) => {
        const now = Date.now() / 1000.;
        const delta = now - startTime;
        // assume we can 20ms jitter in the setTimeout
        if (updates['delay-1'] === 'started') {
          assert.isBelow(Math.abs(delta - 0.1), TIMEOUT_ERROR);
        } else if (updates['delay-1'] === 'ready') {
          assert.isBelow(Math.abs(delta - 0.2), TIMEOUT_ERROR);
        }

        if (updates['delay-2'] === 'started') {
          assert.isBelow(Math.abs(delta - 0.3), TIMEOUT_ERROR);
        } else if (updates['delay-2'] === 'ready') {
          assert.isBelow(Math.abs(delta - 0.4), TIMEOUT_ERROR);
        }

        if (updates['delay-3'] === 'started') {
          assert.isBelow(Math.abs(delta - 0.3), TIMEOUT_ERROR);
        } else if (updates['delay-3'] === 'ready') {
          assert.isBelow(Math.abs(delta - 0.6), TIMEOUT_ERROR);
        }

        if (updates['delay-4'] === 'started') {
          assert.isBelow(Math.abs(delta - 0.7), TIMEOUT_ERROR);
        } else if (updates['delay-4'] === 'ready') {
          assert.isBelow(Math.abs(delta - 0.8), TIMEOUT_ERROR);
        }
      });

      await client.start();
      await client.stop();
    });
  });

  describe(`[@protected] pluginManager.getRequiredPlugins(clientType = null)`, async function() {
    // @note - this API should be "private", should be reviewed
    it(`should return required plugins`, async function() {
      const client = new Client();
      client.pluginManager.register('delay-1', clientPluginDelayFactory, {});
      await client.init({ clientType: 'test', ...config });

      class ClientTestExperience extends ClientAbstractExperience {
        constructor(client) {
          super(client);
          this.require('delay-1');
        }
      }

      const experience = new ClientTestExperience(client);

      const expected = ['delay-1'];
      const result = client.pluginManager.getRequiredPlugins();
      assert.deepEqual(expected, result);
    });
  });
});
