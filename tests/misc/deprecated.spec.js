import { assert } from 'chai';

import { Server } from '../../src/server/index.js';
import { Client } from '../../src/client/index.js';

import config from '../utils/config.js';
import { a, aExpectedDescription } from '../utils/class-description.js';

describe('from v4.0.0-alpha.29', () => {
  describe('# deprecated API', () => {
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

    it('StateManager#getSchema()', async () => {
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

    it('ServerStateManager#registerUpdateHook()', async () => {
      const server = new Server(config);
      server.stateManager.defineClass('a', a);
      await server.start();

      await server.stateManager.onUpdateHook('a', () => {}); // actual
      await server.stateManager.registerUpdateHook('a', () => {}); // deprecated

      server.stateManager.deleteClass('a');
      await server.stop();
    });
  });

  describe('# removed API', () => {
    it('SharedState#set(updates, context)', async () => {
      const server = new Server(config);
      server.stateManager.defineClass('a', a);
      await server.start();

      let errored = false;
      const state = await server.stateManager.create('a');
      try {
        await state.set({}, {});
      } catch (err) {
        errored = true;
        console.log(err.message);
      }

      assert.isTrue(errored);
      await server.stop();
    });
  });
});
