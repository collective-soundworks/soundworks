const path = require('path');
const assert = require('chai').assert;

const Server = require('../server').Server;
const ServerAbstractExperience = require('../server').AbstractExperience;

const Client = require('../client').Client;
const ClientAbstractExperience = require('../client').AbstractExperience;

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
;

class ServerTestExperience extends ServerAbstractExperience {}
class ClientTestExperience extends ClientAbstractExperience {}

describe('client::Client', () => {
  describe(`await client.start()`, async function() {
    it(`should throw if client type/role has no correspondance server-side`, async () => {
      const server = new Server();
      await server.init(config);
      const serverExperience = new ServerTestExperience(server, 'test');
      await server.start();

      const client = new Client();
      await client.init({ clientType: 'unknown', ...config });

      try {
        await client.start();
        assert.fail(`client should not start`);
      } catch(err) {
        assert.ok(`client should crash`);
      }

      await server.stop();
    });
  });
});
