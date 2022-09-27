const path = require('node:path');
const assert = require('chai').assert;

const Server = require('../server').Server;
const ServerAbstractExperience = require('../server').AbstractExperience;

const Client = require('../client').Client;
const ClientAbstractExperience = require('../client').AbstractExperience;

const config = {
  app: {
    name: 'web-socket-connect-retry',
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

class ClientTestExperience extends ClientAbstractExperience {}

let client;
let server;

describe(`client.Socket`, () => {
  describe(`[node client] wait for the server to start`, () => {
    before(async function() {
      client = new Client();
    });

    after(async function() {
      await server.stop();
    });

    it(`should connect when server is launched later`, async function() {
      this.timeout(6 * 1000);

      const initPromise = new Promise(async (resolve) => {
        // client.init resolves only when connected
        // @note: the test is not reliable on this point...
        await client.init({ clientType: 'test', ...config });
        resolve();

        const clientExperience = new ClientTestExperience(client);

        await client.start();
        clientExperience.start();
      });
      // wait for 2 seconds
      await new Promise(resolve => setTimeout(resolve, 3000));

      const connectPromise = new Promise(async resolve => {
        class ServerTestExperience extends ServerAbstractExperience {
          enter(_client) {
            assert.equal(_client.id, client.id);
            resolve();
          }
        }

        server = new Server();
        await server.init(config);
        const serverExperience = new ServerTestExperience(server, 'test');

        await server.start();
        serverExperience.start();
      });

      return Promise.all([initPromise, connectPromise]);
    });
  });
});
