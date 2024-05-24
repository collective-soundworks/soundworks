import { assert } from 'chai';
import { delay } from '@ircam/sc-utils';

import { Server } from '../../src/server/index.js';
import { Client } from '../../src/client/index.js';
import { kSocketTerminate } from '../../src/client/ClientSocket.js';

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
    it('should be triggered when calling socket[kSocketTerminate]()', async () => {
      const client = new Client({ role: 'test',  ...config });
      await client.start();

      let closeCalled = false;
      client.socket.addListener('close', () => closeCalled = true);
      client.socket[kSocketTerminate]();

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

    it.skip('[long 12 seconds test, unskip manually] should be called when heartbeat is not received from server', async function() {
      this.timeout(20 * 1000);
      // server will send haertbeat ping to clients
      server.sockets._DEBUG_PREVENT_HEARTBEAT = true;

      const client = new Client({ role: 'test',  ...config });
      await client.start();

      let closeCalled = 0;
      client.socket.addListener('close', () => closeCalled += 1);

      await delay(12 * 1000);

      assert.equal(closeCalled, 1);
    });
  });
});


