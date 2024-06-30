import { assert } from 'chai';

import { Server } from '../../src/server/index.js';
import { Client } from '../../src/client/index.js';

import config from '../utils/config.js';
import { a, b } from '../utils/schemas.js';

describe('# deprecated API', () => {
  it('SharedState#schemaName', async () => {
    const server = new Server(config);
    server.stateManager.registerSchema('a', a);
    await server.start();

    const aState = await server.stateManager.create('a');
    assert.equal(aState.schemaName, 'a');

    await server.stop();
  });
});
