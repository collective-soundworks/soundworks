import { assert } from 'chai';
import { delay } from '@ircam/sc-utils';

import { Server } from '../../src/server/index.js';
import { Client } from '../../src/client/index.js';

import config from '../utils/config.js';
import { a, b } from '../utils/schemas.js';

describe(`# SharedStateCollection`, () => {
  let server;
  let clients = [];

  beforeEach(async () => {
    // ---------------------------------------------------
    // server
    // ---------------------------------------------------
    server = new Server(config);
    server.stateManager.registerSchema('a', a);
    server.stateManager.registerSchema('b', b);
    await server.start();

    // ---------------------------------------------------
    // clients
    // ---------------------------------------------------
    clients[0] = new Client({ role: 'test', ...config });
    clients[1] = new Client({ role: 'test', ...config });
    clients[2] = new Client({ role: 'test', ...config });
    await clients[0].start();
    await clients[1].start();
    await clients[2].start();
  });

  afterEach(async function() {
    server.stop();
  });

  describe(`## StateManager::getCollection(schemaName)`, () => {
    it(`should return a working state collection`, async () => {
      const client0 = clients[0];
      const client1 = clients[1];
      const client2 = clients[2];

      const stateb = await client0.stateManager.create('b');
      const stateA0 = await client0.stateManager.create('a');
      await stateA0.set({ int: 42 });
      const stateA1 = await client1.stateManager.create('a');
      await stateA1.set({ int: 21 });

      const collection = await client2.stateManager.getCollection('a');

      collection.sort((a, b) => a.get('int') < b.get('int') ? -1 : 1);

      const values = collection.getValues();
      assert.deepEqual(values, [ { bool: false, int: 21 }, { bool: false, int: 42 } ]);
      const ints = collection.get('int');
      assert.deepEqual(ints, [21, 42]);

      await stateA0.detach();

      await delay(50);

      const ints2 = collection.get('int');
      assert.deepEqual(ints2, [21]);

      await collection.detach();

      assert.equal(collection.length, 0);

      await stateb.delete();
      await stateA1.delete();
      await delay(50);
    });

    it(`should behave properly if getting same collection twice`, async () => {
      const state = await clients[0].stateManager.create('a');
      const collection1 = await clients[1].stateManager.getCollection('a');
      const collection2 = await clients[1].stateManager.getCollection('a');

      assert.equal(collection1.size, 1);
      assert.equal(collection2.size, 1);

      await state.delete();
      await delay(50); // delay is required here, see #73

      await collection1.detach();
      await collection2.detach();
    });

    it.skip(`[FIXME #74] getting same collection twice should return same instance`, async () => {
      const state = await clients[0].stateManager.create('a');
      const collection1 = await clients[1].stateManager.getCollection('a');
      const collection2 = await clients[1].stateManager.getCollection('a');

      assert.isTrue(collection1 === collection2);
    });

    it(`should not exclude locally created states by default`, async () => {
      const state = await clients[0].stateManager.create('a');
      const collection = await clients[0].stateManager.getCollection('a');

      assert.equal(collection.length, 1);

      await state.delete();
      await delay(50);
    });

    it(`should exclude locally created states is excludeLocal is set to true`, async () => {
      const state = await clients[0].stateManager.create('a');
      const collection = await clients[0].stateManager.getCollection('a', { excludeLocal: true });

      assert.equal(collection.length, 0);

      await state.delete();
      await delay(50);
    });

    it('should thow if collection, i.e. schemaName, does not exists', async () => {
      let errored = false;

      try {
        const collection = await server.stateManager.getCollection('do-not-exists');
      } catch (err) {
        console.log(err.message);
        errored = true;
      }

      if (!errored) {
        assert.fail('should have failed');
      }
    });
  });

  describe(`## size (alias length)`, async () => {
    it(`should have proper length`, async () => {
      const state1 = await clients[0].stateManager.create('a');
      const collection = await clients[1].stateManager.getCollection('a');
      // make sure the first collection doesn't "leak" into the other one, cf. 2058d6e
      const collection2 = await clients[1].stateManager.getCollection('a');

      assert.equal(collection.size, 1);
      assert.equal(collection.length, 1);

      const state2 = await clients[2].stateManager.create('a');
      await delay(50);

      assert.equal(collection.size, 2);
      assert.equal(collection.length, 2);

      await state1.delete();
      await state2.delete();
      await delay(50);

      assert.equal(collection.size, 0);
      assert.equal(collection.length, 0);
    });
  });

  describe(`## schemaName`, () => {
    it(`should return the schema name`, async () => {
      const collection = await clients[0].stateManager.getCollection('a');
      const schemaName = collection.schemaName;
      assert.equal(schemaName, 'a')

      await collection.detach();
    });
  });

  describe(`## getSchema()`, () => {
    it(`should return the schema name`, async () => {
      const collection = await clients[0].stateManager.getCollection('a');
      const schema = collection.getSchema();
      const expected = {
        "bool": {
          "default": false,
          "event": false,
          "filterChange": true,
          "immediate": false,
          "initValue": false,
          "metas": {},
          "nullable": false,
          "type": "boolean",
        },
        "int": {
          "default": 0,
          "event": false,
          "filterChange": true,
          "immediate": false,
          "initValue": 0,
          "max": 100,
          "metas": {},
          "min": 0,
          "nullable": false,
          "step": 1,
          "type": "integer",
        },
      };

      assert.deepEqual(schema, expected);

      await collection.detach();
    });
  });

  describe(`## getDefaults()`, () => {
    it(`should return the schema name`, async () => {
      const collection = await clients[0].stateManager.getCollection('a');
      const defaults = collection.getDefaults();
      const expected = {
        bool: false,
        int: 0,
      };

      assert.deepEqual(defaults, expected);

      await collection.detach();
    });
  });

  describe(`## set(updates, context = null)`, () => {
    it(`should properly progate updates`, async () => {
      const state0 = await clients[0].stateManager.create('a');
      const state1 = await clients[1].stateManager.create('a');
      // cross attached states
      const attached0 = await clients[1].stateManager.attach('a', state0.id);
      const attached1 = await clients[0].stateManager.attach('a', state1.id);

      const collection = await clients[2].stateManager.getCollection('a');

      assert.equal(collection.size, 2);

      const result = await collection.set({ bool: true });
      const expected = { bool: true };
      assert.deepEqual(result, expected);

      await delay(50);
      // should be propagated to everyone
      assert.equal(state0.get('bool'), true);
      assert.equal(state1.get('bool'), true);
      assert.equal(attached0.get('bool'), true);
      assert.equal(attached1.get('bool'), true);

      await state0.delete();
      await state1.delete();
      await collection.detach();
    });

    it(`test several collections from same schema`, async () => {
      const state0 = await clients[0].stateManager.create('a');
      const state1 = await clients[1].stateManager.create('a');
      // cross attached states
      const attached0 = await clients[1].stateManager.attach('a', state0.id);
      const attached1 = await clients[0].stateManager.attach('a', state1.id);

      const collection0 = await clients[2].stateManager.getCollection('a');
      const collection1 = await clients[0].stateManager.getCollection('a');

      assert.equal(collection0.size, 2);
      assert.equal(collection1.size, 2);

      // update from collection0
      await collection0.set({ bool: true });
      await delay(50);

      assert.equal(state0.get('bool'), true);
      assert.equal(state1.get('bool'), true);
      assert.equal(attached0.get('bool'), true);
      assert.equal(attached1.get('bool'), true);
      assert.deepEqual(collection0.get('bool'), [true, true]);
      assert.deepEqual(collection1.get('bool'), [true, true]);

      await collection0.set({ int: 42 });
      await delay(50);

      assert.equal(state0.get('int'), 42);
      assert.equal(state1.get('int'), 42);
      assert.equal(attached0.get('int'), 42);
      assert.equal(attached1.get('int'), 42);
      assert.deepEqual(collection0.get('int'), [42, 42]);
      assert.deepEqual(collection1.get('int'), [42, 42]);

      await state0.delete();
      await state1.delete();
      await collection0.detach();
      await collection1.detach();
    });

    it.skip(`test socket message numbers`, async () => {});

    it(`"normal" state communication should work as expected`, async () => {
      const state0 = await clients[0].stateManager.create('a');
      const state1 = await clients[1].stateManager.create('a');
      // cross attached states
      const attached0 = await clients[1].stateManager.attach('a', state0.id);
      const attached1 = await clients[0].stateManager.attach('a', state1.id);

      const collection = await clients[2].stateManager.getCollection('a');

      let onUpdateCalled = false;
      collection.onUpdate((state, updates) => {
        onUpdateCalled = true;
        assert.equal(state.id, state0.id);
        assert.deepEqual(updates, { bool: true });
      });

      await state0.set({ bool: true });
      await delay(50);
      // should be propagated to everyone
      assert.equal(state0.get('bool'), true);
      assert.equal(state1.get('bool'), false);
      assert.equal(attached0.get('bool'), true);
      assert.equal(attached1.get('bool'), false);
      assert.isTrue(onUpdateCalled);

      await state0.delete();
      await state1.delete();
      await collection.detach();
    });
  });

  describe(`## onUpdate(callback)`, () => {
    it(`should properly call onUpdate with state and updates as arguments`, async () => {
      const state = await clients[0].stateManager.create('a');
      const collection = await clients[1].stateManager.getCollection('a');

      let onUpdateCalled = false;

      collection.onUpdate((s, updates) => {
        onUpdateCalled = true;

        assert.equal(s.id, state.id);
        assert.equal(s.get('int'), 42);
        assert.equal(updates.int, 42);
      });

      await state.set({ int: 42 });
      await delay(50);

      if (onUpdateCalled === false) {
        assert.fail('onUpdate should have been called');
      }

      await state.delete();
      await delay(50);
    });
  });

  describe(`## onAttach(callback)`, () => {
    it(`should properly call onAttach callback with state as argument`, async () => {
      const collection = await clients[1].stateManager.getCollection('a');

      let onAttachCalled = false;
      let stateId = null;

      collection.onAttach((s) => {
        stateId = s.id;
        onAttachCalled = true;
      });

      const state = await clients[0].stateManager.create('a');
      await delay(50);

      assert.equal(stateId, state.id);

      await state.delete();
      await delay(50);

      if (onAttachCalled === false) {
        assert.fail('onAttach should have been called');
      }
    });
  });

  describe(`## onDetach()`, () => {
    it(`should properly call detach callback with state as attribute`, async () => {
      const state = await clients[0].stateManager.create('a');
      const collection = await clients[1].stateManager.getCollection('a');

      let onDetachCalled = false;

      collection.onDetach((s) => {
        assert.equal(s.id, state.id);
        onDetachCalled = true;
      });

      await state.delete();
      await delay(50);

      if (onDetachCalled === false) {
        assert.fail('onDetach should have been called');
      }
    });
  });

  describe(`## [Symbol.iterator]`, () => {
    // this tends to show a bug
    it(`should implement iterator API`, async () => {
      const state = await clients[0].stateManager.create('a');
      const collection = await clients[1].stateManager.getCollection('a');

      let size = 0;

      for (let s of collection) {
        assert.equal(state.id, s.id)
        size += 1;
      }

      await assert.equal(size, 1);
    });
  });
});
