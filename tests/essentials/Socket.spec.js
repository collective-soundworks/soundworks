import { assert } from 'chai';
import { delay } from '@ircam/sc-utils';

import { Server } from '../../src/server/index.js';
import { Client } from '../../src/client/index.js';

import config from '../utils/config.js';

describe('# client::Socket', () => {
  let server;

  beforeEach(async () => {
    server = new Server(config);
    await server.start();
  });

  afterEach(async () => {
    if (server.status !== 'stopped') {
      await server.stop();
    }
  });

  describe(`## "close" event`, () => {
    it('should be triggered when calling socket.terminate()', async () => {
      const client = new Client({ role: 'test',  ...config });
      await client.start();

      let closeCalled = false;
      client.socket.addListener('close', () => closeCalled = true);
      client.socket.terminate();

      await delay(10);

      assert.equal(closeCalled, true);

      await client.stop();
    });

    it('should be called when server is stopped', async () => {
      const client = new Client({ role: 'test',  ...config });
      await client.start();

      let closeCalled = false;
      client.socket.addListener('close', () => closeCalled = true);

      await server.stop();
      await delay(10);
      assert.equal(closeCalled, true);
    });
  });
});


