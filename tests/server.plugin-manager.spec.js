const path = require('path');
const assert = require('chai').assert;

const Server = require('../server').Server;
const ServerAbstractExperience = require('../server').AbstractExperience;
const pluginDelayFactory = require('@soundworks/plugin-delay/server').default;

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

describe(`server::PluginManager`, () => {

  describe(`pluginManager.register(name, pluginFactory)`, () => {
    it(`should throw if name already registered`, () => {
      const server = new Server();
      server.pluginManager.register('delay', pluginDelayFactory, {});

      assert.throws(() => {
        server.pluginManager.register('delay', pluginDelayFactory, {});
      });
    });
  });

  describe(`pluginManager.get(name[, _experience])`, () => {
    it(`should throw if plugin name has not been registered`, () => {
      const server = new Server();

      assert.throws(() => {
        server.pluginManager.get('delay');
      });
    });

    // @note - this API should be "private", should be reviewed
    it(`should throw if plugin required after server.start()`, async function() {
      const server = new Server();
      server.pluginManager.register('delay', pluginDelayFactory, {});
      await server.init(config);

      class ServerTestExperience extends ServerAbstractExperience {
        constructor(server, clientTypes) {
          super(server, clientTypes);
          // do not require plugin heres
        }
      }
      const experience = new ServerTestExperience(server, 'test');

      await server.start();

      assert.throws(() => {
        server.pluginManager.get('delay', experience);
      });

      await server.stop();
    });
  });

  describe(`pluginManager.getRequiredPlugins(clientType = null)`, async function() {
    // @note - this API should be "private", should be reviewed
    it(`should returned the list of plugin given client type`, async function() {
      const server = new Server();
      server.pluginManager.register('delay', pluginDelayFactory, {
        startedDelayTime: 0.1,
        readyDelayTime: 0.1,
      });
      await server.init(config);

      class ServerTestExperience extends ServerAbstractExperience {
        constructor(server, clientTypes) {
          super(server, clientTypes);
          this.require('delay');
        }
      }
      const experience = new ServerTestExperience(server, 'test');
      await server.start();

      const expected = ['delay'];
      const result = server.pluginManager.getRequiredPlugins('test');
      assert.deepEqual(expected, result);

      await server.stop();
    });
  });

  describe(`pluginManager.observe((statuses, updates) => {})`, () => {
    it(`should properly propagate statuses`, async function() {
      this.timeout(3 * 1000);

      const server = new Server();
      server.pluginManager.register('delay', pluginDelayFactory, {
        startedDelayTime: 0.1,
        readyDelayTime: 0.1,
      });
      await server.init(config);

      class ServerTestExperience extends ServerAbstractExperience {
        constructor(server, clientTypes) {
          super(server, clientTypes);
          this.require('delay');
        }
      }
      const experience = new ServerTestExperience(server, 'test');

      const startTime = Date.now() / 1000.;

      const expected = [
        { delay: 'idle' },
        { delay: 'started' },
        { delay: 'ready' },
      ];
      let index = 0;

      server.pluginManager.observe(statuses => {
        assert.deepEqual(expected[index], statuses);
        index += 1;
      });

      await server.start();
      await server.stop();
    });

    it(`should be able to monitor plugin lifecycle`, async function() {
      this.timeout(3 * 1000);

      const server = new Server();
      server.pluginManager.register('delay', pluginDelayFactory, {
        startedDelayTime: 0.1,
        readyDelayTime: 0.1,
      });
      await server.init(config);

      class ServerTestExperience extends ServerAbstractExperience {
        constructor(server, clientTypes) {
          super(server, clientTypes);
          this.require('delay');
        }
      }
      const experience = new ServerTestExperience(server, 'test');

      const startTime = Date.now() / 1000.;

      server.pluginManager.observe(status => {
        const now = Date.now() / 1000.;
        const delta = now - startTime;
        // assume we can 20ms jitter in the setTimeout
        if (status['delay'] === 'started') {
          assert.isBelow(Math.abs(delta - 0.1), TIMEOUT_ERROR);
        } else if (status['delay'] === 'ready') {
          assert.isBelow(Math.abs(delta - 0.2), TIMEOUT_ERROR);
        }
      });

      await server.start();
      await server.stop();
    });
  });

  describe(`plugin initialization lifecycle`, () => {
    it(`should start if no plugins registered`, async function() {
      const server = new Server();
      await server.init(config);
      // start plugin manager
      await server.start();
      assert.ok('server started');
      await server.stop();
    });

    it(`should be able to require several plugins in parallel`, async function() {
      this.timeout(3 * 1000);

      const server = new Server();
      server.pluginManager.register('delay-1', pluginDelayFactory, {
        startedDelayTime: 0.1,
        readyDelayTime: 0.1,
      });
      server.pluginManager.register('delay-2', pluginDelayFactory, {
        startedDelayTime: 0.1,
        readyDelayTime: 0.1,
      });

      await server.init(config);

      class ServerTestExperience extends ServerAbstractExperience {
        constructor(server, clientTypes) {
          super(server, clientTypes);
          this.require('delay-1');
          this.require('delay-2');
        }
      }
      const experience = new ServerTestExperience(server, 'test');

      const startTime = Date.now() / 1000.;

      server.pluginManager.observe((statuses, updates) => {
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

      await server.start();
      await server.stop();
    });

    it(`should be able to chain plugin initialization`, async function() {
      this.timeout(3 * 1000);

      class ServerTestExperience extends ServerAbstractExperience {
        constructor(server, clientTypes) {
          super(server, clientTypes);
          this.require('delay-1');
          this.require('delay-2');
        }
      }

      const server = new Server();

      server.pluginManager.register('delay-1', pluginDelayFactory, {
        startedDelayTime: 0.1,
        readyDelayTime: 0.1,
      });
      // delay-2 depends on delay-1
      server.pluginManager.register('delay-2', pluginDelayFactory, {
        startedDelayTime: 0.1,
        readyDelayTime: 0.1,
      }, ['delay-1']);

      await server.init(config);
      const experience = new ServerTestExperience(server, 'test');

      const startTime = Date.now() / 1000.;

      server.pluginManager.observe((statuses, updates) => {
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

      await server.start();
      await server.stop();
    });

    it(`should support complex plugin dependency graphs`, async function() {
      this.timeout(3 * 1000);

      // delay-1 --> delay-2 --|
      // delay-3 --------------+-> delay-4

      class ServerTestExperience extends ServerAbstractExperience {
        constructor(server, clientTypes) {
          super(server, clientTypes);
          this.require('delay-1');
          this.require('delay-2');
          this.require('delay-3');
          this.require('delay-4');
        }
      }

      const server = new Server();

      server.pluginManager.register('delay-1', pluginDelayFactory, {
        startedDelayTime: 0.1,
        readyDelayTime: 0.1,
      });
      // delay-2 depends on delay-1
      server.pluginManager.register('delay-2', pluginDelayFactory, {
        startedDelayTime: 0.1,
        readyDelayTime: 0.1,
      }, ['delay-1']);

      // delay 3 ready (at 0.6) after delay delay-2 (at 0.4)
      server.pluginManager.register('delay-3', pluginDelayFactory, {
        startedDelayTime: 0.3,
        readyDelayTime: 0.3,
      });

      server.pluginManager.register('delay-4', pluginDelayFactory, {
        startedDelayTime: 0.1,
        readyDelayTime: 0.1,
      }, ['delay-2', 'delay-3']);

      await server.init(config);
      const experience = new ServerTestExperience(server, 'test');

      const startTime = Date.now() / 1000.;

      server.pluginManager.observe((statuses, updates) => {
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

      await server.start();
      await server.stop();
    });

  });

});
