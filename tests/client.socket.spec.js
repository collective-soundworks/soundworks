import { assert } from 'chai';

import { Server } from '../src/server/index.js';
import { Client } from '../src/client/index.js';

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


describe(`client.Socket`, () => {
  describe(`[node client] wait for the server to start`, () => {
    let server;

    after(async function() {
      await server.stop();
    });

    it(`should connect when server is launched later`, async function() {
      const client = new Client({ role: 'test', ...config });
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
