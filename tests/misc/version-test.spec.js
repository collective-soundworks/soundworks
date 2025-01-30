import fs from 'node:fs';

import { Server, version as serverVersion } from '../../src/server/index.js';
import { Client, version as clientVersion } from '../../src/client/index.js';
import { kClientVersionTest } from '../../src/client/Client.js';

import { assert } from 'chai';

import config from '../utils/config.js';
const { version } = JSON.parse(fs.readFileSync('package.json').toString());

describe(`# Client / Server test versions discrepancies`, () => {
  it(`client and server should check soundworks version used`, async () => {
    // The warning message is logged twice as both server and client will produce it
    const server = new Server(config);
    await server.start();

    const client = new Client({
      role: 'test',
      [kClientVersionTest]: 'not-a-version',
      ...config,
    });

    await client.start();
    await client.stop();
    await server.stop();
  });

  it('should properly export version', () => {
    assert.equal(serverVersion, version);
    assert.equal(clientVersion, version);
  });
});
