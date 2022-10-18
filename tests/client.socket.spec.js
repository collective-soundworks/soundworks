const path = require('node:path');
const assert = require('chai').assert;

const Server = require('../server').Server;
const Client = require('../client').Client;

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

let client;
let server;

describe(`client.Socket`, () => {
  describe(`[node client] wait for the server to start`, () => {
    before(async function() {
      // config.env.verbose = true;
      client = new Client({ clientType: 'test', ...config });
    });

    after(async function() {
      await server.stop();
    });

    it(`should connect when server is launched later`, async function() {
      this.timeout(6 * 1000);

      const initPromise = new Promise(async (resolve) => {
        // client.init resolves only when connected
        await client.init();
        resolve();
      });

      // wait for 3 seconds and start the server
      await new Promise(resolve => setTimeout(resolve, 3000));

      server = new Server(config);
      await server.init();
      await server.start();

      return initPromise;
    });
  });
});
