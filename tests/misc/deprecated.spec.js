import { assert } from 'chai';

import { Server } from '../../src/server/index.js';
import { Client } from '../../src/client/index.js';

import config from '../utils/config.js';
import { a, aExpectedDescription } from '../utils/class-description.js';

describe('# deprecated API', () => {
  describe('from v4.0.0-alpha.29', () => {
    it('SharedState#schemaName', async () => {
      const server = new Server(config);
      server.stateManager.defineClass('a', a);
      await server.start();

      const state = await server.stateManager.create('a');
      assert.equal(state.className, 'a'); // actual
      assert.equal(state.schemaName, 'a'); // deprecated
      server.stateManager.deleteClass('a');
      await server.stop();
    });

    it('SharedStateCollection#schemaName', async () => {
      const server = new Server(config);
      server.stateManager.defineClass('a', a);
      await server.start();

      const collection = await server.stateManager.getCollection('a');
      assert.equal(collection.className, 'a'); // actual
      assert.equal(collection.schemaName, 'a'); // deprecated
      server.stateManager.deleteClass('a');
      await server.stop();
    });

    it('SharedState#getSchema(name = null)', async () => {
      const server = new Server(config);
      server.stateManager.defineClass('a', a);
      await server.start();

      const state = await server.stateManager.create('a');
      assert.deepEqual(state.getDescription(), aExpectedDescription); // actual
      assert.deepEqual(state.getSchema(), aExpectedDescription); // deprecated
      server.stateManager.deleteClass('a');
      await server.stop();
    });

    it('SharedStateCollection#getSchema(name = null)', async () => {
      const server = new Server(config);
      server.stateManager.defineClass('a', a);
      await server.start();

      const collection = await server.stateManager.getCollection('a');
      assert.deepEqual(collection.getDescription(), aExpectedDescription); // actual
      assert.deepEqual(collection.getSchema(), aExpectedDescription); // deprecated
      server.stateManager.deleteClass('a');
      await server.stop();
    });

    it('SharedStateManager#getSchema()', async () => {
      const server = new Server(config);
      server.stateManager.defineClass('a', a);
      await server.start();

      const classDescription = await server.stateManager.getClassDescription('a'); // actual
      assert.deepEqual(classDescription, aExpectedDescription);

      const schema = await server.stateManager.getSchema('a'); // deprecated
      assert.deepEqual(schema, aExpectedDescription);

      server.stateManager.deleteClass('a');
      await server.stop();
    });
  });
});
