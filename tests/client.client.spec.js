const path = require('path');
const assert = require('chai').assert;
const merge = require('lodash.merge');

const Server = require('../server').Server;
const Client = require('../client').Client;
const Context = require('../client').Context;
const pluginDelayFactory = require('@soundworks/plugin-delay/client').default;

config = {
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

describe('client::Client', () => {
  describe(`new Client(config)`, () => {
    it(`should throw if no config is given`, () => {
      try {
        const client = new Client();
        assert.fail('should have thrown');
      } catch(err) {
        console.log(err.message);
        assert.ok('should throw');
      }
    });

    it(`should throw if no clientType in config`, () => {
      try {
        const client = new Client({});
        assert.fail('should have thrown');
      } catch(err) {
        console.log(err.message);
        assert.ok('should throw');
      }
    });

    describe(`node clients only`, () => {
      it(`should throw if no config.env is missing`, () => {
        try {
          const client = new Client({ clientType: 'test' });
          assert.fail('should have thrown');
        } catch(err) {
          console.log(err.message);
          assert.ok('should throw');
        }
      });

      it(`should throw if no config.env is missing 1 or several entries`, () => {
        try {
          const client = new Client({ clientType: 'test', env: { useHttps: false } });
          assert.fail('should have thrown');
        } catch(err) {
          console.log(err.message);
          assert.ok('should throw');
        }
      });
    });
  });

  describe(`await client.init()`, () => {
    it(`should have opened socket`, async () => {
      const server = new Server(config);
      await server.init();
      await server.start();

      const client = new Client({ clientType: 'test', ...config });
      await client.init();

      let socketMessageReceived = false;
      client.socket.addListener('hello', () => {
        socketMessageReceived = true;
      });

      server.sockets.broadcast('*', null, 'hello');
      await new Promise(resolve => setTimeout(resolve, 200));

      assert.equal(socketMessageReceived, true);

      await server.stop();
    });

    it(`should throw if invalid client type/role`, async () => {
      const server = new Server(config);
      await server.init();
      await server.start();

      const client = new Client({ clientType: 'unknown', ...config });

      let errored = false;
      try {
        await client.init();
      } catch(err) {
        console.log(err.message);
        errored = true;
      }
      if (!errored) { assert.fail('should throw'); }

      await server.stop();
    });

    it(`should throw if invalid plugin list`, async () => {
      const server = new Server(config);
      await server.init();
      await server.start();

      const client = new Client({ clientType: 'test', ...config });
      client.pluginManager.register('unknown-server-side', pluginDelayFactory, { delayTime: 0 });

      let errored = false;
      try {
        await client.init();
      } catch(err) {
        console.log(err.message);
        errored = true;
      }
      if (!errored) { assert.fail('should throw'); }

      await server.stop();
    });

    it(`should have id and uuid set`, async () => {
      const server = new Server(config);
      await server.init();
      await server.start();

      const client = new Client({ clientType: 'test', ...config });
      await client.init();

      assert.notEqual(client.id, null);
      assert.notEqual(client.uuid, null);

      await server.stop();
    });

    it(`should have inited the state manager`, async () => {
      const server = new Server(config);
      server.stateManager.registerSchema('test', { a: { type: 'boolean', default: true } });

      await server.init();
      await server.start();

      const client = new Client({ clientType: 'test', ...config });
      await client.init();

      const state = await client.stateManager.create('test');
      assert.deepEqual(state.getValues(), { a: true });

      await server.stop();
    });
  });

  describe(`await client.start()`, () => {
    it(`should throw if called before init()`, async () => {
      const server = new Server(config);
      await server.init();
      await server.start();

      const client = new Client({ clientType: 'test', ...config });

      try {
        await client.start();
        assert.fail('should have thrown');
      } catch(err) {
        console.log(err.message);
        assert.ok('should throw');
      }

      await server.stop();
    });

    it(`should start registered context(s)`, async () => {
      const server = new Server(config);
      await server.init();
      await server.start();

      const client = new Client({ clientType: 'test', ...config });
      await client.init();

      let contextStarted = false;
      class MyContext extends Context {
        async start() {
          super.start();
          contextStarted = true;
        }
      }
      const context = new MyContext(client);

      await client.start();
      assert.equal(contextStarted, true);

      await server.stop();
    });
  });

  describe(`await client.stop()`, () => {
    it(`should throw if called before start()`, async () => {
      const server = new Server(config);
      await server.init();
      await server.start();

      const client = new Client({ clientType: 'test', ...config });
      await client.init();

      try {
        await client.stop();
        assert.fail('should have thrown');
      } catch(err) {
        console.log(err.message);
        assert.ok('should throw');
      }

      await server.stop();
    });

    it(`should close the socket`, async () => {
      const server = new Server(config);
      await server.init();
      await server.start();

      const client = new Client({ clientType: 'test', ...config });
      await client.init();
      await client.start();

      let socketMessageReceived = false;
      client.socket.addListener('hello', () => {
        console.log('message received');
        socketMessageReceived = true;
      });

      await client.stop();

      server.sockets.broadcast('*', null, 'hello');
      await new Promise(resolve => setTimeout(resolve, 200));

      assert.equal(socketMessageReceived, false);

      await server.stop();
    });

  });
});
