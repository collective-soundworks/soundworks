import { assert }  from 'chai';

import { Server, Context as ServerContext } from '../src/server/index.js';
import { Client, Context as ClientContext } from '../src/client/index.js';
import { pluginDelayFactory } from './utils/plugin-delay.client.js';

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

    it(`should throw if no role in config`, () => {
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
          const client = new Client({ role: 'test' });
          assert.fail('should have thrown');
        } catch(err) {
          console.log(err.message);
          assert.ok('should throw');
        }
      });

      it(`should throw if no config.env is missing 1 or several entries`, () => {
        try {
          const client = new Client({ role: 'test', env: { useHttps: false } });
          assert.fail('should have thrown');
        } catch(err) {
          console.log(err.message);
          assert.ok('should throw');
        }
      });
    });
  });

  describe(`await client.init()`, () => {
    it(`should open the sockets`, async () => {
      const server = new Server(config);
      await server.init();
      await server.start();

      const client = new Client({ role: 'test', ...config });
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

    it(`should throw if invalid client role`, async () => {
      const server = new Server(config);
      await server.init();
      await server.start();

      const client = new Client({ role: 'unknown', ...config });

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

      const client = new Client({ role: 'test', ...config });
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

      const client = new Client({ role: 'test', ...config });
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

      const client = new Client({ role: 'test', ...config });
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

      const client = new Client({ role: 'test', ...config });

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

      const client = new Client({ role: 'test', ...config });
      await client.init();

      let contextStarted = false;
      class MyContext extends ClientContext {
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

      const client = new Client({ role: 'test', ...config });
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

      const client = new Client({ role: 'test', ...config });
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

    it('should properly stop if server is closed first', async () => {
      const server = new Server(config);
      await server.start();

      const client = new Client({ role: 'test', ...config });
      await client.start();

      await new Promise(resolve => setTimeout(resolve, 100));
      await server.stop();

      await new Promise(resolve => setTimeout(resolve, 100));
      await client.stop();
    });

    it(`should stop the contexts first and then the plugins`, async () => {
      const server = new Server(config);
      server.pluginManager.register('test-plugin', Plugin => {
        return class TestPlugin extends Plugin {}
      });

      await server.init();

      class ServerTestContext extends ServerContext {
        get name() { return 'test-context'; }
      }

      const serverTestContext = new ServerTestContext(server, 'test');
      // we call start after creating the context, so it is started
      await server.start();

      let counter = 0;
      let pluginStop = false;
      let contextStop = false;

      const client = new Client({ role: 'test', ...config });

      client.pluginManager.register('test-plugin', Plugin => {
        return class TestPlugin extends Plugin {
          async start() {
            await super.start();
            // just check that we are ok with that, and that we are not stuck
            // with some on-going processcf. sync
            this._intervalId = setInterval(() => {}, 500);
          }
          async stop() {
            await super.stop();

            clearInterval(this._intervalId);
            pluginStop = true;
            // should be called context.stop()
            counter += 1;
            assert.equal(counter, 2);
          }
        }
      });

      await client.init();

      class ClientTestContext extends ClientContext {
        get name() { return 'test-context'; }
        async stop() {
          await super.stop();
          contextStop = true;
          // should be called first
          counter += 1;
          assert.equal(counter, 1);
        }
      }

      const context = new ClientTestContext(client);
      await client.start();

      assert.equal(contextStop, false);
      assert.equal(pluginStop, false);
      // stop everything
      await client.stop();
      await server.stop();

      assert.equal(contextStop, true);
      assert.equal(pluginStop, true);
    });
  });

  describe('client.onStatusChange(state => {}) - state: (inited, started, stopped)', () => {
    let server;
    let client;

    before(async () => {
      server = new Server(config);
      await server.start();

      client = new Client({ role: 'test', ...config });
    });

    after(async () => {
      await server.stop();
    });

    it('should cleanly add and remove listeners', () => {
      const unsubscribe = client.onStatusChange(async () => {});
      unsubscribe();

      assert.equal(server._onStatusChangeCallbacks.size, 0)
    });

    it('should receive "inited" events', async () => {
      let counter = 0;

      const callback1 = async (status) => {
        await new Promise(resolve => setTimeout(resolve, 50));
        if (status === 'inited') {
          assert.equal(counter, 0);
        }
        counter++;
      }

      const callback2 = async (status) => {
        await new Promise(resolve => setTimeout(resolve, 100));
        if (status === 'inited') {
          assert.equal(counter, 1);
        }
        counter++;
      }

      const unsubscribe1 = client.onStatusChange(callback1);
      const unsubscribe2 = client.onStatusChange(callback2);

      await client.init();
      // assert await resolves after all callbacks
      assert.equal(counter, 2);

      unsubscribe1();
      unsubscribe2();
    });

    it('should receive "started" events', async () => {
      let counter = 0;

      const callback1 = async (status) => {
        await new Promise(resolve => setTimeout(resolve, 50));
        if (status === 'started') {
          assert.equal(counter, 0);
        }
        counter++;
      }

      const callback2 = async (status) => {
        await new Promise(resolve => setTimeout(resolve, 100));
        if (status === 'started') {
          assert.equal(counter, 1);
        }
        counter++;
      }

      const unsubscribe1 = client.onStatusChange(callback1);
      const unsubscribe2 = client.onStatusChange(callback2);

      await client.start();
      // assert await resolves after all callbacks
      assert.equal(counter, 2);

      unsubscribe1();
      unsubscribe2();
    });

    it('should receive "stopped" events', async () => {
      let counter = 0;

      const callback1 = async (status) => {
        await new Promise(resolve => setTimeout(resolve, 50));
        if (status === 'stopped') {
          assert.equal(counter, 0);
        }
        counter++;
      }

      const callback2 = async (status) => {
        await new Promise(resolve => setTimeout(resolve, 100));
        if (status === 'stopped') {
          assert.equal(counter, 1);
        }
        counter++;
      }

      const unsubscribe1 = client.onStatusChange(callback1);
      const unsubscribe2 = client.onStatusChange(callback2);

      await client.stop();
      // assert await resolves after all callbacks
      assert.equal(counter, 2);

      unsubscribe1();
      unsubscribe2();
    });
  });

  describe(`client.getAuditState()`, () => {
    it(`should throw if called before init`, async () => {
      const server = new Server(config);
      await server.start();

      const client = new Client({ role: 'test', ...config });

      let errored = false;

      try {
        await client.getAuditState();
      } catch(err) {
        console.log(err.message);
        errored = true;
      }

      if (!errored) {
        assert.fail('should throw');
      }

      await server.stop();
    });

    it(`should track number of connected clients`, async () => {
      const server = new Server(config);
      await server.start();

      const client = new Client({ role: 'test', ...config });
      await client.start();

      const auditState = await client.getAuditState();

      const numClients = auditState.get('numClients');
      assert.equal(numClients.test, 1);

      await server.stop();
    });
  });
});
