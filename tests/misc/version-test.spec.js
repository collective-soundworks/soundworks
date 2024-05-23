import { Server } from '../../src/server/index.js';
import { Client } from '../../src/client/index.js';
import { kClientVersionTest } from '../../src/client/Client.js';

import config from '../utils/config.js';

describe(`Client / Server version test`, () => {
  it(`client and server should check soundworks version used`, async () => {
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
});
