const path = require('node:path');
const assert = require('chai').assert;

const Server = require('../server').Server;
const ServerContext = require('../server').Context;

const Client = require('../client').Client;
const ClientContext = require('../client').Context;

const config = {
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

describe('Contexts', () => {
  describe(`contructor()`, () => {
    it(`[server] should throw if first argument is not instance of Server`,  async () => {
      const server = new Server(config);
      await server.init();

      class ServerTestContext extends ServerContext {}
      try {
        const serverTestContext = new ServerTestContext({}, 'test');
        assert.fail('should have thrown if server is not passed as argument');
      } catch(err) {
        console.log(err.message);
        assert.ok('should throw');
      }
    });

    it(`[server] should throw if creating several context with same name`,  async () => {
      const server = new Server(config);
      await server.init();

      class ServerTestContext extends ServerContext {}

      let errored = false;
      try {
        const serverTestContext = new ServerTestContext(server, 'test');
        const serverTestContext2 = new ServerTestContext(server, 'test');
      } catch(err) {
        console.log(err.message);
        errored = true;
      }
      if (!errored) { assert.fail('should have thrown'); }
    });

    it(`[client] should throw if first argument is not instance of Client`, async () => {
            // server
      const server = new Server(config);
      await server.init();
      await server.start();

      // client
      const client = new Client({ clientType: 'test', ...config });
      await client.init();
      class TestContext extends ClientContext {}

      let errored = false;
      try {
        const clientTestContext = new TestContext({});
      } catch(err) {
        console.log(err.message);
        errored = true;
      }
      if (!errored) { assert.fail('should have thrown if client is not passed as arguments'); }

      await server.stop();
    });

    it(`should be able to override context name (default is ClassName)`,  async () => {
      const server = new Server(config);
      await server.init();

      let serverSideEntered = false;
      let clientSideEntered = false;

      class ServerTestContext extends ServerContext {
        get name() { return 'user-defined'; }

        async enter(client) {
          await super.enter(client);
          serverSideEntered = true;
        }
      }

      const serverTestContext = new ServerTestContext(server, 'test');

      await server.start();

      const client = new Client({ clientType: 'test', ...config });
      await client.init();
      // server and client context have different ClassName but same `name`
      class ClientTestContext extends ClientContext {
        get name() { return 'user-defined'; }

        async enter() {
          await super.enter();
          clientSideEntered = true;
        }
      }
      const clientTestContext = new ClientTestContext(client);

      await client.start();
      await clientTestContext.enter();

      assert.equal(serverSideEntered, true, 'should have entered server-side context');
      assert.equal(clientSideEntered, true, 'should have entered client-side context');

      await server.stop();
    });

    it(`[server] should throw if registering contexts with the same user defined name`,  async () => {
      const server = new Server(config);
      await server.init();

      class ServerTestContext1 extends ServerContext {
        get name() { return 'user-defined'; }
      }

      class ServerTestContext2 extends ServerContext {
        get name() { return 'user-defined'; }
      }

      const serverTestContext1 = new ServerTestContext1(server, 'test');
      let errored = false;
      try {
        const serverTestContext2 = new ServerTestContext2(server, 'test');
      } catch(err) {
        console.log(err.message);
        errored = true;
      }
      if (!errored) { assert.fail('should throw'); }
    });
  })

  describe(`.start()`, () => {
    it(`[server] should be called by server.start()`, async () => {
      // server
      const server = new Server(config);
      await server.init();

      let serverStartCalled = false;
      class ServerTestContext extends ServerContext {
        async start() {
          await super.start();
          serverStartCalled = true;
        }
      }

      const serverTestContext = new ServerTestContext(server, 'test');
      await server.start();

      assert.equal(serverStartCalled, true);

      await server.stop();
    });

    it(`[client] should be called by client.start()`, async () => {
      // server
      const server = new Server(config);
      await server.init();
      await server.start();

      // client
      const client = new Client({ clientType: 'test', ...config });
      await client.init();

      let clientStartCalled = false;
      class ClientTestContext extends ClientContext {
        async start() {
          await super.start();
          clientStartCalled = true;
        }
      }

      const clientTestContext = new ClientTestContext(client);
      await client.start();

      assert.equal(clientStartCalled, true);

      await server.stop();
    });
  });

  describe(`.enter()`, () => {
    it(`should throw if client is not given to server::Context.enter(client)`, async () => {
      // server
      const server = new Server(config);
      await server.init();

      let errored = false;
      // need to wrap to get same name
      {
        class TestContext extends ServerContext {
          async enter(client) {
            try {
              await super.enter();
            } catch(err) {
              console.log(err.message);
              errored = true;
            }
          }
        }

        const serverTestContext = new TestContext(server, 'test');
      }
      await server.start();

      // client
      const client = new Client({ clientType: 'test', ...config });
      await client.init();

      class TestContext extends ClientContext {}
      const clientTestContext = new TestContext(client);

      await client.start();
      await clientTestContext.enter();

      if (!errored) { assert.fail('should have thrown'); }

      await server.stop();
    });

    it(`should properly enter context (first server-side then client-side)`, async () => {
      // server
      const server = new Server(config);
      await server.init();

      let enterStep = 0;

      // need to wrap to get same name
      {
        class TestContext extends ServerContext {
          async enter(client) {
            await super.enter(client);

            assert.equal(enterStep, 1);
            enterStep += 1;
          }
        }

        const serverTestContext = new TestContext(server, 'test');
      }

      await server.start();

      // client
      const client = new Client({ clientType: 'test', ...config });
      await client.init();

      // define 2 contexts so we don't fall into the automatic .enter() path
      class TestContext extends ClientContext {
        async enter() {
          assert.equal(enterStep, 0);
          enterStep += 1;

          await super.enter();

          assert.equal(enterStep, 2);
          enterStep += 1;
        }
      }

      const clientTestContext = new TestContext(client);

      await client.start();
      await clientTestContext.enter();

      assert.equal(enterStep, 3, 'enter was not called');

      await server.stop();
    });

    it(`server should use DefaultContext if context not defined server-side`, async () => {
      // server
      const server = new Server(config);
      await server.init();
      await server.start();

      // client
      const client = new Client({ clientType: 'test', ...config });
      await client.init();

      let entered = false;
      // define 2 contexts so we don't fall into the automatic .enter() path
      class ClientOnlyContext extends ClientContext {
        async enter() {
          await super.enter();
          assert.ok('entered');
          entered = true;
        }
      }

      const clientTestContext = new ClientOnlyContext(client);

      await client.start();
      await clientTestContext.enter();

      assert.equal(entered, true, 'enter() was not called');
      assert.equal(server.contextManager._contexts.inner.length, 1, 'default context was not created');

      await server.stop();
    });

    it(`should throw if already in context`, async () => {
      // server
      const server = new Server(config);
      await server.init();
      await server.start();

      // client
      const client = new Client({ clientType: 'test', ...config });
      await client.init();

      class TestContext extends ClientContext {};

      const clientTestContext = new TestContext(client);

      await client.start();
      await clientTestContext.enter();

      let errored = false;
      try {
        await clientTestContext.enter();
      } catch(err) {
        console.log(err.message);
        errored = true;
      }
      if (!errored) { assert.fail('should not enter twice'); }

      await server.stop();
    });

    it(`should throw if client type is not registered as a possible type for context`, async () => {
      // server
      const server = new Server(config);
      await server.init();
      await server.start();

      {
        class TestContext extends ServerContext {};
        const serverTestContext = new TestContext(server, 'other');
      }
      // client
      const client = new Client({ clientType: 'test', ...config });
      await client.init();

      class TestContext extends ClientContext {};
      const clientTestContext = new TestContext(client);
      class TestContext2 extends ClientContext {};
      const clientTestContext2 = new TestContext2(client);

      await client.start();

      let errored = false;
      try {
        await clientTestContext.enter();
      } catch(err) {
        console.log(err.message);
        errored = true;
      }
      if (!errored) { assert.fail('should have thrown'); }

      await server.stop();
    });
  });

  describe(`.exit()`, () => {
    it(`should throw if client is not given to server::Context.exit(client)`, async () => {
      // server
      const server = new Server(config);
      await server.init();

      let errored = false;
      // need to wrap to get same name
      {
        class TestContext extends ServerContext {
          async exit(client) {
            try {
              // await super.exit(client);
              await super.exit();
            } catch(err) {
              console.log(err.message);
              errored = true;
            }
          }
        }

        const serverTestContext = new TestContext(server, 'test');
      }
      await server.start();

      // client
      const client = new Client({ clientType: 'test', ...config });
      await client.init();
      // only 1 context registered, .enter() will be called automatically
      class TestContext extends ClientContext {}
      const clientTestContext = new TestContext(client);

      await client.start();
      await clientTestContext.enter();
      await clientTestContext.exit();

      await server.stop();

      if (!errored) { assert.fail('should throw'); }
    });

    it(`should throw if client is not in context`, async () => {
      // server
      const server = new Server(config);
      await server.init();
      await server.start();

      // client
      const client = new Client({ clientType: 'test', ...config });
      await client.init();
      // only 1 context registered, .enter() will be called automatically
      class TestContext extends ClientContext {}
      const clientTestContext = new TestContext(client);

      await client.start();

      await clientTestContext.enter();
      await clientTestContext.exit();

      let errored = false;
      try {
        await clientTestContext.exit();
      } catch(err) {
        console.log(err.message);
        errored = true;
      }
      if (!errored) { assert.fail('should have thrown'); }

      await server.stop();
    });

    it(`should properly exit context (first server-side then client-side)`, async () => {
      // server
      const server = new Server(config);
      await server.init();

      let exitStep = 0;

      // need to wrap to get same name
      {
        class TestContext extends ServerContext {
          async exit(client) {
            await super.exit(client);

            assert.equal(exitStep, 1);
            exitStep += 1;
          }
        }

        const serverTestContext = new TestContext(server, 'test');
      }

      await server.start();

      // client
      const client = new Client({ clientType: 'test', ...config });
      await client.init();

      // define 2 contexts so we don't fall into the automatic .enter() path
      class TestContext extends ClientContext {
        async exit() {
          assert.equal(exitStep, 0);
          exitStep += 1;

          await super.exit();

          assert.equal(exitStep, 2);
          exitStep += 1;
        }
      }

      const clientTestContext = new TestContext(client);

      await client.start();

      await clientTestContext.enter();
      await clientTestContext.exit();

      assert.equal(exitStep, 3, 'exit() was not called');
      await server.stop();
    });
  });

  describe(`dynamic creation & runtime support`, () => {
    it(`should suuport the creation of new contexts at runtime, i.e. after "soundworks.start()"`, async () => {
      const server = new Server(config);
      await server.init();
      await server.start();

      const client = new Client({ clientType: 'test', ...config });
      await client.init();
      await client.start();

      let serverStartCalled = false;
      let serverEnterCalled = false;

      class MyServerContext extends ServerContext {
        get name() { return 'allow-runtime'; }

        async start() {
          await super.start();
          serverStartCalled = true;
        }

        async enter(client) {
          await super.enter(client);
          serverEnterCalled = true;
        }
      }

      let clientStartCalled = false;
      let clientEnterCalled = false;

      class MyClientContext extends ClientContext {
        get name() { return 'allow-runtime'; }

        async start() {
          await super.start();
          clientStartCalled = true;
        }

        async enter(client) {
          await super.enter(client);
          clientEnterCalled = true;
        }
      }

      const serverContext = new MyServerContext(server, 'test');
      const clientContext = new MyClientContext(client);

      await clientContext.enter();

      await server.stop();

      assert.equal(serverStartCalled, true, 'should call server.start()');
      assert.equal(serverEnterCalled, true, 'should call server.enter()');
      assert.equal(clientStartCalled, true, 'should call client.start()');
      assert.equal(clientEnterCalled, true, 'should call client.enter()');
    });
  });

  describe(`serial / parallel contexts`, () => {
    // not that this test works with DefaultContext server-side
    it(`should support any serial / parallel combinaison of contexts`, async () => {
      const server = new Server(config);
      await server.init();
      await server.start();

      const client = new Client({ clientType: 'test', ...config });
      await client.init();

      // let now =
      let enteredAlpha = null;
      let exitedAlpha = null;

      let start = Date.now();

      class AlphaContext extends ClientContext {
        async enter() {
          await super.enter();
          enteredAlpha = (Date.now()) - start;
        }

        async exit() {
          await super.exit();
          exitedAlpha = (Date.now()) - start;
        }
      }

      let enteredBeta = null;
      let exitedBeta = null;

      class BetaContext extends ClientContext {
        async enter() {
          await super.enter();
          enteredBeta = (Date.now()) - start;
        }

        async exit() {
          await super.exit();
          exitedBeta = (Date.now()) - start;
        }
      }

      let enteredGamma = null;
      let exitedGamma = null;

      class GammaContext extends ClientContext {
        async enter() {
          await super.enter();
          enteredGamma = (Date.now()) - start;
        }

        async exit() {
          await super.exit();
          exitedGamma = (Date.now()) - start;
        }
      }

      const alpha = new AlphaContext(client);
      const beta = new BetaContext(client);
      const gamma = new GammaContext(client);

      await client.start();
      // alpha entered at 0
      await alpha.enter();
      await new Promise(resolve => setTimeout(resolve, 200));
      // alpha exit and beta enter at 0.2 (serial)
      await alpha.exit();
      await beta.enter();
      await new Promise(resolve => setTimeout(resolve, 200));
      // gamma enter at 0.4 (beta and gamma run in parallel)
      await gamma.enter();
      await new Promise(resolve => setTimeout(resolve, 200));
      // beta and gamma exit at 0.6
      await beta.exit();
      await gamma.exit();

      // we add the errors here
      const TIMEOUT_ERROR = 30; // in ms
      // alpha entered at 0
      assert.notEqual(enteredAlpha, null, 'should have entered alpha');
      assert.isBelow(Math.abs(enteredAlpha), TIMEOUT_ERROR, 'wrong alpha enter time');
      // alpha exit and beta enter at 0.2
      assert.notEqual(exitedAlpha, null, 'should have exited alpha');
      assert.isBelow(Math.abs(exitedAlpha - 200), TIMEOUT_ERROR, 'wrong alpha exit time');
      assert.notEqual(enteredBeta, null, 'should have entered beta');
      assert.isBelow(Math.abs(enteredBeta - 200), TIMEOUT_ERROR, 'wrong beta enter time');
      // gamma enter at 0.4 (beta and gamme run in parallel)
      assert.notEqual(enteredGamma, null, 'should have entered gamma');
      assert.isBelow(Math.abs(enteredGamma - 400), TIMEOUT_ERROR, 'wrong beta enter time');
      // beta and gamma exit at 0.6
      assert.notEqual(exitedBeta, null, 'should have exited beta');
      assert.isBelow(Math.abs(exitedBeta - 600), TIMEOUT_ERROR, 'wrong beta exit time');
      assert.notEqual(exitedGamma, null, 'should have exited gamma');
      assert.isBelow(Math.abs(exitedGamma - 600), TIMEOUT_ERROR, 'wrong gamma exit time');

      await server.stop();
    });
  });

  describe('server.contextManager', () => {
    describe('[protected] contextManager.removeClient(client)', () => {
      it(`should properly remove client when client stops`, async () => {
        const server = new Server(config);
        await server.init();
        await server.start();

        const client = new Client({ clientType: 'test', ...config });
        await client.init();

        class MyClientContext extends ClientContext {}
        const context = new MyClientContext(client);

        await client.start();
        await context.enter();

        await client.stop();
        // wait a bit to let the message propagate
        await new Promise(resolve => setTimeout(resolve, 50));
        const serverContext = await server.contextManager.get('MyClientContext');
        assert.equal(serverContext.clients.size, 0);

        await server.stop();

      });
    });
  });
});
