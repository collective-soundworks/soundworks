import { assert } from 'chai';
import { delay } from '@ircam/sc-utils';

import { Server } from '../../src/server/index.js';
import { Client } from '../../src/client/index.js';
import { BATCHED_TRANSPORT_CHANNEL } from '../../src/common/constants.js';

import config from '../utils/config.js';
import { a, aExpectedDescription, b } from '../utils/class-description.js';

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

  describe(`## StateManager::getCollection(className)`, () => {
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

    it('should thow if collection, i.e. className, does not exists', async () => {
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

  describe(`## className`, () => {
    it(`should return the schema name`, async () => {
      const collection = await clients[0].stateManager.getCollection('a');
      const className = collection.className;
      assert.equal(className, 'a')

      await collection.detach();
    });
  });

  describe(`## getDescription()`, () => {
    it(`should return the class description`, async () => {
      const collection = await clients[0].stateManager.getCollection('a');
      const description = collection.getDescription();
      assert.deepEqual(description, aExpectedDescription);

      await collection.detach();
    });
  });

  describe(`## getDefaults()`, () => {
    it(`should return the default values`, async () => {
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
      const expected = [{ bool: true }, { bool: true }];
      assert.deepEqual(result, expected);

      await delay(50);
      // should be propagated to everyone
      assert.equal(state0.get('bool'), true);
      assert.equal(state1.get('bool'), true);
      assert.equal(attached0.get('bool'), true);
      assert.equal(attached1.get('bool'), true);

      await collection.detach();
      await state0.delete();
      await state1.delete();
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

      await collection0.detach();
      await collection1.detach();

      await state0.delete();
      await state1.delete();
    });

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

      await collection.detach();

      await state0.delete();
      await state1.delete();
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

    it('should not propagate event parameters on first call if `executeListener=true`', async () => {
      server.stateManager.registerSchema('with-event', {
        bool: { type: 'boolean', event: true, },
        int: { type: 'integer', default: 20, },
      });
      const state = await server.stateManager.create('with-event');
      const collection = await server.stateManager.getCollection('with-event');

      let onUpdateCalled = false;
      collection.onUpdate((state, newValues, oldValues, context) => {
        onUpdateCalled = true;
        assert.deepEqual(newValues, { int: 20 });
        assert.deepEqual(oldValues, {});
        assert.deepEqual(context, null);
      }, true);

      await delay(10);

      assert.equal(onUpdateCalled, true);
      server.stateManager.deleteSchema('with-event');
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

  describe(`## Batched transport`, () => {
    it(`should send only one message on update requests and response`, async () => {
      // launch new server so we can grab the server side representation of the client
      const localConfig = structuredClone(config);
      localConfig.env.port = 8083;

      const server = new Server(localConfig);
      server.stateManager.registerSchema('a', a);
      await server.start();

      let states = [];
      const numStates = 1000;

      for (let i = 0; i < numStates; i++) {
        const state = await server.stateManager.create('a');
        states.push(state);
      }

      let batchedRequests = 0;
      let batchedResponses = 0;

      server.onClientConnect(client => {
        client.socket.addListener(BATCHED_TRANSPORT_CHANNEL, (args) => {
          // console.log('server BATCHED_TRANSPORT_CHANNEL');
          batchedRequests += 1;
        });
      });

      const client = new Client({ role: 'test', ...localConfig });
      await client.start();

      // update response
      client.socket.addListener(BATCHED_TRANSPORT_CHANNEL, (args) => {
        // console.log('client BATCHED_TRANSPORT_CHANNEL', args);
        batchedResponses += 1;
      });

      const collection = await client.stateManager.getCollection('a');
      await collection.set({ int: 42 });

      // // await delay(20);
      const expected = new Array(numStates).fill(42);
      assert.deepEqual(collection.get('int'), expected);

      // console.log(collection.get('int'));
      // 1 message for getSchema request / response
      // 1 message for observe request / response
      // 1 message for attach requests / responses
      // 1 message for update requests / responses
      assert.equal(batchedRequests, 4);
      assert.equal(batchedResponses, 4);

      await collection.detach();
      for (let i = 0; i < states.length; i++) {
        await states[i].delete();
      }
      await client.stop();
      await server.stop();
    });
  });
});

describe('# SharedStateCollection - filtered collection', () => {
  let server;
  let clients = [];

  beforeEach(async () => {
    // ---------------------------------------------------
    // server
    // ---------------------------------------------------
    server = new Server(config);
    server.stateManager.registerSchema('filtered', {
      bool: {
        type: 'boolean',
        default: false,
      },
      int: {
        type: 'integer',
        default: 0,
      },
      string: {
        type: 'string',
        default: 'a',
      },
    });
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

  describe(`## getCollection(className, filter)`, () => {
    it(`should throw if filter contains invalid keys`, async () => {
      const owned1 = await clients[0].stateManager.create('filtered');
      const owned2 = await clients[1].stateManager.create('filtered');
      let errored = false;

      try {
        const attached = await clients[2].stateManager.getCollection('filtered', ['invalid', 'toto']);
      } catch (err) {
        console.log(err.message);
        errored = true;
      }

      assert.isTrue(errored);
    });

    it(`should return valid collection`, async () => {
      const owned1 = await clients[0].stateManager.create('filtered');
      const owned2 = await clients[1].stateManager.create('filtered');
      const attached = await clients[2].stateManager.getCollection('filtered', ['bool', 'string']);

      assert.equal(attached.size, 2);
    });
  });

  describe(`## onUpdate(callback)`, () => {
    it(`should propagate only filtered keys`, async () => {
      const filter = ['bool', 'string'];
      const owned1 = await clients[0].stateManager.create('filtered');
      const owned2 = await clients[1].stateManager.create('filtered');
      const attached = await clients[2].stateManager.getCollection('filtered', filter);
      const expected = { bool: true, int: 1, string: 'b' };

      owned1.onUpdate(updates => {
        assert.deepEqual(updates, expected);
      });

      attached.onUpdate((state, updates) => {
        assert.deepEqual(Object.keys(updates), filter);
      });

      await owned1.set(expected);
      await delay(20);
    });

    it(`should not propagate if filtered updates is empty object`, async () => {
      const filter = ['bool', 'string'];
      const owned1 = await clients[0].stateManager.create('filtered');
      const owned2 = await clients[1].stateManager.create('filtered');
      const attached = await clients[2].stateManager.getCollection('filtered', filter);
      const expected = { int: 1 };
      let batchedResponses = 0;
      let callbackExecuted = false;

      clients[2].socket.addListener(BATCHED_TRANSPORT_CHANNEL, (args) => {
        batchedResponses += 1;
      });

      owned1.onUpdate(updates => {
        assert.deepEqual(updates, expected);
      });

      attached.onUpdate((state, updates) => {
        callbackExecuted = true;
      });

      await owned1.set(expected);
      await delay(20);

      assert.isFalse(callbackExecuted);
      assert.equal(batchedResponses, 0);
    });
  });

  describe(`## set(updates)`, () => {
    it(`should throw early if trying to set modify a param which is not filtered`, async () => {
      const filter = ['bool', 'string'];
      const owned1 = await clients[0].stateManager.create('filtered');
      const owned2 = await clients[1].stateManager.create('filtered');
      const attached = await clients[2].stateManager.getCollection('filtered', filter);
      let onUpdateCalled = false;
      let errored = false;

      owned1.onUpdate(() => onUpdateCalled = true);

      try {
        await attached.set({ int: 42 });
      } catch (err) {
        console.log(err.message);
        errored = true;
      }

      await delay(20);

      assert.isTrue(errored);
      assert.isFalse(onUpdateCalled);
    });
  });

  describe(`## get(name)`, () => {
    it(`should throw if trying to access a param which is not filtered`, async () => {
      const filter = ['bool', 'string'];
      const owned1 = await clients[0].stateManager.create('filtered');
      const owned2 = await clients[1].stateManager.create('filtered');
      const attached = await clients[2].stateManager.getCollection('filtered', filter);
      let errored = false;

      try {
        await attached.get('int');
      } catch (err) {
        console.log(err.message);
        errored = true;
      }

      await delay(20);

      assert.isTrue(errored);
    });
  });

  describe(`## getUnsafe(name)`, () => {
    it(`should throw if trying to access a param which is not filtered`, async () => {
      const filter = ['bool', 'string'];
      const owned1 = await clients[0].stateManager.create('filtered');
      const owned2 = await clients[1].stateManager.create('filtered');
      const attached = await clients[2].stateManager.getCollection('filtered', filter);
      let errored = false;

      try {
        await attached.getUnsafe('int');
      } catch (err) {
        console.log(err.message);
        errored = true;
      }

      await delay(20);

      assert.isTrue(errored);
    });
  });

  describe(`## getValues()`, () => {
    it(`should return a filtered object`, async () => {
      const filter = ['bool', 'string'];
      const owned1 = await clients[0].stateManager.create('filtered');
      const owned2 = await clients[1].stateManager.create('filtered');
      const attached = await clients[2].stateManager.getCollection('filtered', filter);

      await owned1.set({ bool: true });
      await delay(20);

      const values = attached.getValues();
      assert.deepEqual(values, [
        { bool: true, string: 'a' },
        { bool: false, string: 'a' },
      ]);
    });
  });

  describe(`## getValuesUnsafe()`, () => {
    it(`should return a filtered object`, async () => {
      const filter = ['bool', 'string'];
      const owned1 = await clients[0].stateManager.create('filtered');
      const owned2 = await clients[1].stateManager.create('filtered');
      const attached = await clients[2].stateManager.getCollection('filtered', filter);

      await owned1.set({ bool: true });
      await delay(20);

      const values = attached.getValuesUnsafe();
      assert.deepEqual(values, [
        { bool: true, string: 'a' },
        { bool: false, string: 'a' },
      ]);
    });
  });
});
