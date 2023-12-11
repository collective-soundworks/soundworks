import { assert } from 'chai';

import { Server } from '../../src/server/index.js';
import { Client } from '../../src/client/index.js';

import config from '../utils/config.js';

describe(`# node client socket`, () => {
  let server;

  after(async function() {
    await server.stop();
  });

  it(`should wait for the server to start`, async function() {
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
