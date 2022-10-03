const path = require('path');
const assert = require('chai').assert;

const Server = require('../server').Server;
const ServerAbstractExperience = require('../server').AbstractExperience;

const Client = require('../client').Client;
const ClientAbstractExperience = require('../client').AbstractExperience;

config = {
  app: {
    name: 'terminate-server-test',
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
;

class ServerTestExperience extends ServerAbstractExperience {}
class ClientTestExperience extends ClientAbstractExperience {}

describe('server::Server', () => {
  describe(`await server.start()`, () => {
    it(`should throw if config not found for declared clientType`, async () => {
      server = new Server();

      await server.init(config);
      const serverTestExperience = new ServerTestExperience(server, 'unknown');

      try {
        await server.start();
        assert.fail('server.start() should not terminate');
      } catch(err) {
        assert.ok('server.start() should throw');
      }
    });
  });

  describe('await server.stop()', () => {

    beforeEach(async () => {
      server = new Server();

      await server.init(config);
      const serverTestExperience = new ServerTestExperience(server, 'test');
      await server.start();
      serverTestExperience.start();
    });


    it('should stop the server', async () => {
      await server.stop();
      assert.isOk('server and process should stop');
    });

    it('should stop the server even if a client is connected', async() => {
      const client = new Client();
      await client.init({ clientType: 'test', ...config });
      const testExperience = new ClientTestExperience(client);
      await client.start();
      testExperience.start();

      await server.stop();
      assert.isOk('server and process should stop');
    });
  });


  describe('server events (inited, started)', () => {
    before(async () => {
      server = new Server();
    });

    it('should cleanly add and remove properly', () => {
      const callback = async () => {};

      server.addListener('inited', callback);
      server.removeListener('inited', callback);

      assert.equal(server._listeners.size, 0)
    });

    it('should execute "inited" listeners', async () => {
      let counter = 0;

      const callback1 = async () => {
        await new Promise(resolve => setTimeout(resolve, 200));
        assert.equal(counter, 0);
        counter++;
      }

      const callback2 = async () => {
        await new Promise(resolve => setTimeout(resolve, 200));
        assert.equal(counter, 1);
        counter++;
      }

      server.addListener('inited', callback1);
      server.addListener('inited', callback2);

      await server.init(config);
      // assert await resolves after all callbacks
      assert.equal(counter, 2);
    });

    it('should execute "started" listeners', async () => {
      let counter = 0;

      const callback1 = async () => {
        await new Promise(resolve => setTimeout(resolve, 200));
        assert.equal(counter, 0);
        counter++;
      }

      const callback2 = async () => {
        await new Promise(resolve => setTimeout(resolve, 200));
        assert.equal(counter, 1);
        counter++;
      }

      server.addListener('started', callback1);
      server.addListener('started', callback2);

      await server.start();
      // assert await resolves after all callbacks
      assert.equal(counter, 2);
    });

    it('should execute "stopped" listeners', async () => {
      let counter = 0;

      const callback1 = async () => {
        await new Promise(resolve => setTimeout(resolve, 200));
        assert.equal(counter, 0);
        counter++;
      }

      const callback2 = async () => {
        await new Promise(resolve => setTimeout(resolve, 200));
        assert.equal(counter, 1);
        counter++;
      }

      server.addListener('stopped', callback1);
      server.addListener('stopped', callback2);

      await server.stop();
      // assert await resolves after all callbacks
      assert.equal(counter, 2);
    });
  });
});
