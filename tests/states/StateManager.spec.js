import { assert } from 'chai';
import { delay } from '@ircam/sc-utils';

import { Server } from '../../src/server/index.js';
import { Client } from '../../src/client/index.js';
import {
  OBSERVE_RESPONSE,
  OBSERVE_NOTIFICATION,
} from '../../src/common/constants.js';
import {
  kStateManagerClient
} from '../../src/common/BaseStateManager.js';
import SharedState from '../../src/common/SharedState.js';

import config from '../utils/config.js';
import { a, aExpectedDescription, b } from '../utils/class-description.js';

describe(`# StateManager`, () => {
  let server;
  let client;

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
    client = new Client({ role: 'test', ...config });
    await client.start();
  });

  afterEach(async function() {
    server.stop();
  });

  describe('## [server] registerSchema(className, definition)', () => {
    it('should throw if reusing same schema name', () => {
      assert.throws(() => {
        server.stateManager.registerSchema('a', a);
      }, Error, '[stateManager.registerSchema] cannot register schema with name: "a", schema name already exists');

    });

    it ('should register same definition with another name', () => {
      server.stateManager.registerSchema('aa', a);
    });
  });

  describe(`## getSchema(className)`, () => {
    it(`should throw if node is not inited`, async () => {
      const localConfig = structuredClone(config);
      localConfig.env.port = 8082;

      const server = new Server(config);
      server.stateManager.registerSchema('a', a);

      let errored = false;

      try {
        await server.stateManager.getSchema('a');
      } catch (err) {
        console.log(err.message);
        errored = true;
      }

      assert.isTrue(errored);
    });

    it(`should return the description`, async () => {
      const description = await client.stateManager.getSchema('a');
      assert.deepEqual(description, aExpectedDescription);
    });

    it(`should throw if given name does not exists`, async () => {
      let errored = false;

      try {
        await client.stateManager.getSchema('do-not-exists');
      } catch (err) {
        console.log(err.message);
        errored = true;
      }

      if (!errored) {
        assert.fail('should have thrown');
      }
    });
  });

  describe('## async create(className[, initValues]) => state', () => {
    it(`should throw if node is not inited`, async () => {
      const localConfig = structuredClone(config);
      localConfig.env.port = 8082;

      const server = new Server(config);
      server.stateManager.registerSchema('a', a);

      let errored = false;

      try {
        await server.stateManager.create('a');
      } catch (err) {
        console.log(err.message);
        errored = true;
      }

      assert.isTrue(errored);
    });

    it('should create a shared state', async () => {
      const stateA = await server.stateManager.create('a');
      const stateB = await server.stateManager.create('a');

      assert.isTrue(stateA instanceof SharedState);
      assert.isTrue(stateB instanceof SharedState);

      await stateA.delete();
      await stateB.delete();
    });

    it('should create state with default values', async () => {
      const stateA = await server.stateManager.create('a', {
        bool: true,
        int: 42,
      });

      assert.equal(stateA.get('bool'), true);
      assert.equal(stateA.get('int'), 42);

      await stateA.delete();
    });

    it('should create several state of same kind', async () => {
      const a0 = await server.stateManager.create('a');
      const a1 = await server.stateManager.create('a');

      assert.notEqual(a0.id, a1.id);

      await a0.delete();
      await a1.delete();
    });

    it('[server] should properly handle wrong default values', async () => {
      // cf. SharedState.spec.js 'should throw if value is of bad type'
      let errored = false;

      try {
        const state = await server.stateManager.create('a', { int: 'test' });
      } catch (err) {
        console.log(err.message);
        errored = true;
      }

      if (errored === false) {
        assert.fail(`should throw error`);
      }
    });

    it('[client] should properly handle wrong default values', async () => {
      // cf. SharedState.spec.js 'should throw if value is of bad type'
      let errored = false;

      try {
        const state = await client.stateManager.create('a', { int: 'test' });
      } catch (err) {
        console.log(err.message);
        errored = true;
      }

      if (errored === false) {
        assert.fail(`should throw error`);
      }
    });
  });

  describe('## async attach(className[, stateId]) => state', () => {
    it(`should throw if node is not inited`, async () => {
      const localConfig = structuredClone(config);
      localConfig.env.port = 8082;

      const server = new Server(config);
      server.stateManager.registerSchema('a', a);

      let errored = false;

      try {
        await server.stateManager.attach('a');
      } catch (err) {
        console.log(err.message);
        errored = true;
      }

      assert.isTrue(errored);
    });

    it('should propagate updates to all attached states (server)', async () => {
      const a0 = await server.stateManager.create('a');
      const a1 = await server.stateManager.attach('a', a0.id);
      const a2 = await server.stateManager.attach('a', a0.id);

      const called = [0, 0, 0];

      [a0, a1, a2].forEach((state, index) => {
        state.onUpdate(updates => {
          assert.equal(updates.int, called[index] % 100 + 1);
          called[index] += 1;
        });
      });

      for (let state of [a0, a1, a2]) {
        for (let i = 1; i <= 100; i++) {
          await state.set({ int: i });
          // no need to wait for propagation eveything is synchronous server-side,

          assert.equal(a0.get('int'), i);
          assert.equal(a1.get('int'), i);
          assert.equal(a2.get('int'), i);
        }
      }

      await new Promise(resolve => setTimeout(resolve, 200));
      assert.equal(called[0], 300);
      assert.equal(called[1], 300);
      assert.equal(called[2], 300);

      await a0.delete();
    });

    it('should propagate updates to all attached states (client)', async function() {
      this.timeout(10000);

      const a0 = await client.stateManager.create('a');
      const a1 = await client.stateManager.attach('a', a0.id);
      const a2 = await client.stateManager.attach('a', a0.id);

      const called = [0, 0, 0];

      [a0, a1, a2].forEach((state, index) => {
        state.onUpdate(updates => {
          assert.equal(updates.int, called[index] % 100 + 1);
          called[index] += 1;
        });
      });

      for (let state of [a0, a1, a2]) {
        for (let i = 1; i <= 100; i++) {
          await state.set({ int: i });
          await delay(10); // wait for update propagation

          assert.equal(a0.get('int'), i);
          assert.equal(a1.get('int'), i);
          assert.equal(a2.get('int'), i);
        }
      }

      await delay(200)
      await a0.delete();

      assert.equal(called[0], 300);
      assert.equal(called[1], 300);
      assert.equal(called[2], 300);

    });
  });

  describe('## [server] deleteSchema(name)', () => {
    it('should call state.onDetach and state.onDelete on all states of its kind', async () => {
      server.stateManager.registerSchema('a-delete', a);

      const a0 = await server.stateManager.create('a-delete');
      const a1 = await server.stateManager.attach('a-delete', a0.id);
      const b0 = await server.stateManager.create('a-delete');
      const b1 = await server.stateManager.attach('a-delete', b0.id);

      return new Promise(async (resolve, reject) => {
        const detachCalled = [false, false, false, false];
        const deleteCalled = [false, false, false, false];

        [a0, a1, b0, b1].forEach((state, index) => {
          state.onDetach(() => detachCalled[index] = true);
          state.onDelete(() => deleteCalled[index] = true);
        });

        server.stateManager.deleteSchema('a-delete');

        setTimeout(() => {
          assert.deepEqual([true, true, true, true], detachCalled);
          // onDelete is not called on attached state
          assert.deepEqual([true, false, true, false], deleteCalled);
          resolve();
        }, 200);
      });
    });

    // cf. https://github.com/collective-soundworks/soundworks/issues/71
    it(`should not propagate deleted schema in observe`, async () => {
      server.stateManager.registerSchema('a-delete-observe', a);

      const state = await client.stateManager.create('a-delete-observe');
      let deleteCalled = false;;
      // assert
      state.onDelete(() => {
        deleteCalled = true;
      });

      server.stateManager.deleteSchema('a-delete-observe');
      await delay(100);

      assert.equal(deleteCalled, true);

      let observeCalled = false;
      const unobserve = await server.stateManager.observe((className, stateId) => {
        observeCalled = true;
      });

      await delay(100); // is not needed as observe should await, but just to make sure

      assert.equal(observeCalled, false);
      unobserve();
    });
  });

  describe('## observe(callback) => Promise<unobserve>', async () => {
    it(`should throw if node is not inited`, async () => {
      const localConfig = structuredClone(config);
      localConfig.env.port = 8082;

      const server = new Server(config);
      server.stateManager.registerSchema('a', a);

      let errored = false;

      try {
        await server.stateManager.observe('a', () => {});
      } catch (err) {
        console.log(err.message);
        errored = true;
      }

      assert.isTrue(errored);
    });

    it(`should be notified of states created on the network`, async () => {
      let numCalled = 0;

      const state1 = await client.stateManager.create('a');

      const unobserve = await server.stateManager.observe((className, stateId, nodeId) => {
        assert.equal(className, 'a');
        assert.isNumber(stateId);
        assert.equal(nodeId, client.id);

        numCalled += 1;
      });

      assert.equal(numCalled, 1);
      // observe is sync server-side, no need to wait
      const state2 = await client.stateManager.create('a');
      assert.equal(numCalled, 2);

      unobserve();

      const state3 = await client.stateManager.create('a');
      assert.equal(numCalled, 2);

      await state1.delete();
      await state2.delete();
      await state3.delete();
    });

    it(`should not be notified of deleted states`, async () => {
      let numCalled = 0;
      const state1 = await client.stateManager.create('a');

      const unobserve1 = await server.stateManager.observe(async (className, stateId, nodeId) => {
        numCalled += 1;
      });

      assert.equal(numCalled, 1);

      await state1.delete();
      unobserve1();

      const unobserve2 = await server.stateManager.observe(async (className, stateId, nodeId) => {
        numCalled += 1;
      });

      assert.equal(numCalled, 1);
      unobserve2();

      state1.delete();
    });

    it(`returned Promise should resolve after async observe callback`, async () => {
      let numCalled = 0;
      const state1 = await client.stateManager.create('a');

      const unobserve = await server.stateManager.observe(async (className, stateId, nodeId) => {
        // we just make it wait for the first call, to simplify the test
        if (numCalled === 0) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        numCalled += 1;
      });

      assert.equal(numCalled, 1);
      // observe is sync server-side, no need to wait
      const state2 = await client.stateManager.create('a');
      assert.equal(numCalled, 2);

      unobserve();

      const state3 = await client.stateManager.create('a');
      assert.equal(numCalled, 2);

      await state1.delete();
      await state2.delete();
      await state3.delete();
    });

    it(`should not receive messages on transport after unobserve`, async () => {
      let numCalled = 0;
      const state1 = await client.stateManager.create('a');

      const unobserve = await server.stateManager.observe(async (className, stateId, nodeId) => {
        numCalled += 1;
      });

      assert.equal(numCalled, 1);

      let notificationReceived = false;
      // check low level transport messages
      server.stateManager[kStateManagerClient].transport.addListener(OBSERVE_NOTIFICATION, () => {
        notificationReceived = true;
      });

      unobserve();
      const state2 = await client.stateManager.create('a');

      if (notificationReceived) {
        assert.fail('should not receive notification from transport');
      }

      await state1.delete();
      await state2.delete();
    });

    it(`should properly behave with several observers`, async () => {
      const other = new Client({ role: 'test', ...config });
      await other.start();

      let responsesReceived = 0;

      other.stateManager[kStateManagerClient].transport.addListener(OBSERVE_RESPONSE, () => {
        responsesReceived += 1;
      });

      let notificationsReceived = 0;

      other.stateManager[kStateManagerClient].transport.addListener(OBSERVE_NOTIFICATION, () => {
        notificationsReceived += 1;
      });


      let numCalled = 0;
      const state1 = await client.stateManager.create('a');

      const unobserve1 = await other.stateManager.observe(async (className, stateId, nodeId) => {
        numCalled += 1;
      });

      const unobserve2 = await other.stateManager.observe(async (className, stateId, nodeId) => {
        numCalled += 1;
      });

      await delay(50);

      // each observer receives its own response and is called
      assert.equal(responsesReceived, 2, 'responsesReceived');
      assert.equal(notificationsReceived, 0, 'notificationsReceived');
      assert.equal(numCalled, 2, 'numCalled');

      const state2 = await client.stateManager.create('a');
      await delay(50);

      // 1 notifications received, but both observers called
      assert.equal(responsesReceived, 2, 'responsesReceived');
      assert.equal(notificationsReceived, 1, 'notificationsReceived');
      assert.equal(numCalled, 4, 'numCalled');

      // delete first observer
      unobserve1();

      const state3 = await client.stateManager.create('a');
      await delay(50);

      // 1 notifications received, but only second observer called
      assert.equal(responsesReceived, 2, 'responsesReceived');
      assert.equal(notificationsReceived, 2, 'notificationsReceived');
      assert.equal(numCalled, 5, 'numCalled');

      // delete second observer
      unobserve2();

      const state4 = await client.stateManager.create('a');
      await delay(50);
      // nothing should happen
      assert.equal(responsesReceived, 2);
      assert.equal(notificationsReceived, 2);
      assert.equal(numCalled, 5);

      await state1.delete();
      await state2.delete();
      await state3.delete();
      await state4.delete();
    });

    it(`observe should properly behave with race condition`, async () => {
      const other = new Client({ role: 'test', ...config });
      await other.start();

      // make sure we don't have this:
      // OBSERVE_RESPONSE 1 []
      // OBSERVE_NOTIFICATION [ 'a', 1, 0 ]
      // OBSERVE_NOTIFICATION [ 'a', 1, 0 ] // this should not be executed
      // OBSERVE_RESPONSE 1 [ [ 'a', 1, 0 ] ]

      let firstObserverNumCalled = 0;
      let secondObserverNumCalled = 0;
      let responsesReceived = 0;
      let notificationsReceived = 0;

      other.stateManager[kStateManagerClient].transport.addListener(OBSERVE_RESPONSE, (...args) => {
        // console.log('OBSERVE_RESPONSE', ...args);
        responsesReceived += 1;
      });

      other.stateManager[kStateManagerClient].transport.addListener(OBSERVE_NOTIFICATION, (...args) => {
        // console.log('OBSERVE_NOTIFICATION', args);
        notificationsReceived += 1;
      });

      const state1 = await client.stateManager.create('a');

      const unobserve1 = await other.stateManager.observe(async (className, stateId, nodeId) => {
        firstObserverNumCalled += 1;
      });
      // other receives UPDATE_NOTIFICATION now

      const state2 = await client.stateManager.create('a');

      const unobserve2 = await other.stateManager.observe(async (className, stateId, nodeId) => {
        secondObserverNumCalled += 1;
      });

      await state1.delete();
      await state2.delete();
      delay(50);

      assert.equal(firstObserverNumCalled, 2); // 1 within OBSERVE, 1 for NOTIFICATION
      assert.equal(secondObserverNumCalled, 2); // 2 within OBSERVE
      assert.equal(responsesReceived, 2); // for each observer
      assert.equal(notificationsReceived, 1); // only for first observer
    });
  });

  describe('## observe(className, callback) => Promise<unobserve>', async () => {
    it(`should properly behave`, async () => {
      const a1 = await client.stateManager.create('a');
      const b1 = await client.stateManager.create('b');

      let starCalled = 0;
      let filteredCalled = 0;

      const other = new Client({ role: 'test', ...config });
      await other.start();

      const unobserveStar = await other.stateManager.observe(async (className, stateId) => {
        starCalled += 1;
      });

      const unobserveFiltered = await other.stateManager.observe('a', async (className, stateId) => {
        filteredCalled += 1;
      });

      assert.equal(starCalled, 2);
      assert.equal(filteredCalled, 1);

      const a2 = await client.stateManager.create('a');
      await delay(100)
      assert.equal(starCalled, 3);
      assert.equal(filteredCalled, 2);

      const b2 = await client.stateManager.create('b');
      await delay(100)
      assert.equal(starCalled, 4);
      assert.equal(filteredCalled, 2);

      unobserveStar();

      const a3 = await client.stateManager.create('a');
      await delay(100)
      assert.equal(starCalled, 4);
      assert.equal(filteredCalled, 3);

      unobserveFiltered();

      const a4 = await client.stateManager.create('a');
      await delay(100)
      assert.equal(starCalled, 4);
      assert.equal(filteredCalled, 3);

      await a1.delete();
      await a2.delete();
      await a3.delete();
      await a4.delete();
      await b1.delete();
      await b2.delete();
    });

    it(`should thow if given schema name does not exists`, async () => {
      let errored = false;

      try {
        await client.stateManager.observe('do-not-exist', () => {});
      } catch (err) {
        console.log(err.message);
        errored = true;
      }

      if (!errored) {
        assert.fail('should have thrown');
      }
    });

    it(`[FIXME #69] should be notified of all states created, even by same node`, async () => {
      const state1 = await client.stateManager.create('a');

      let observeCalled = 0;

      const unobserve = await client.stateManager.observe('a', (className, stateId, nodeId) => {
        // console.log(className, stateId, state1.id);
        observeCalled +=1;
      });

      const state2 = await client.stateManager.create('a');
      await delay(50);

      assert.equal(observeCalled, 2);

      await state1.delete();
      await state2.delete();
      unobserve();
    });
  });

  describe('## observe(className, callback, options) => Promise<unobserve>', async () => {
    it(`API should not throw`, async () => {
      const unobserve = await client.stateManager.observe('a', function() {}, {
        excludeLocal: true,
      });
      unobserve();
    });

    it(`should not be notified of states created by same node if option.excludeLocal = true`, async () => {
      const state1 = await client.stateManager.create('a');

      let observeCalled = false;

      const unobserve = await client.stateManager.observe('a', (className, stateId, nodeId) => {
        observeCalled = true;
      }, { excludeLocal: true });

      const state2 = await client.stateManager.create('a');
      await delay(50);

      if (observeCalled === true) {
        assert.fail('observe should not have been called')
      }

      await state1.delete();
      await state2.delete();
    });
  });

  describe('## getCollection(className) => Promise<SharedStateCollection>', async () => {
    it(`should throw if node is not inited`, async () => {
      const localConfig = structuredClone(config);
      localConfig.env.port = 8082;

      const server = new Server(config);
      server.stateManager.registerSchema('a', a);

      let errored = false;

      try {
        await server.stateManager.getCollection('a');
      } catch (err) {
        console.log(err.message);
        errored = true;
      }

      assert.isTrue(errored);
    });
  });

  describe('## [server] registerUpdateHook(className, updateHook)', () => {
    const hookSchema = {
      name: {
        type: 'string',
        default: null,
        nullable: true,
      },
      // value will be updated according to name from hook
      value: {
        type: 'string',
        default: null,
        nullable: true,
      },
    };

    it('should properly execute hook', async () => {
      server.stateManager.registerSchema('hooked', hookSchema);
      server.stateManager.registerUpdateHook('hooked', (updates, currentValues) => {
        updates.value = `${updates.name}-value`;
        return updates;
      });

      const hServer = await server.stateManager.create('hooked');
      const hClient = await client.stateManager.attach('hooked');

      const serverPromise = new Promise((resolve, reject) => {
        hServer.onUpdate(updates => {
          try {
            assert.equal(updates.value, `${updates.name}-value`);
            resolve();
          } catch(err) {
            reject(err);
          }
        });
      });

      const clientPromise = new Promise((resolve, reject) => {
        hClient.onUpdate(updates => {
          try {
            assert.equal(updates.value, `${updates.name}-value`);
            resolve();
          } catch(err) {
            reject(err);
          }
        });
      });

      await hServer.set({ name: 'test' });

      assert.deepEqual(hServer.getValues(), { name: 'test', value: 'test-value' });

      // @todo - review, this is weird
      try {
        await Promise.all([serverPromise, clientPromise]);
        server.stateManager.deleteSchema('hooked');
        return Promise.resolve();
      } catch(err) {
        server.stateManager.deleteSchema('hooked');
        return Promise.reject(err);
      }
    });

    it('hook API should be `hook(updates, currentValues, context)`', async () => {
      return new Promise(async (resolve, reject) => {
        server.stateManager.registerSchema('hooked', hookSchema);
        server.stateManager.registerUpdateHook('hooked', (updates, currentValues, context) => {
          try {
            assert.deepEqual(updates, { name: 'test' });
            assert.deepEqual(currentValues, { name: null, value: null });
            assert.deepEqual(context, { myContext: true });
            resolve();
          } catch(err) {
            reject(err);
          }
          return updates;
        });

        const h = await server.stateManager.create('hooked');

        await h.set({ name: 'test' }, { myContext: true });

        server.stateManager.deleteSchema('hooked');
      });
    });


    it('should not mess around when several states of same kind are created', async () => {
      server.stateManager.registerSchema('hooked', hookSchema);
      server.stateManager.registerUpdateHook('hooked', (updates, currentValues) => {
        // just apply name to value
        updates.value = `${updates.name}-value`;
        return updates;
      });

      const h1 = await server.stateManager.create('hooked');
      const h2 = await server.stateManager.create('hooked');

      await h1.set({ name: 'test' });

      try {
        assert.deepEqual(h1.getValues(), { name: 'test', value: 'test-value' });
        assert.deepEqual(h2.getValues(), { name: null, value: null });

        server.stateManager.deleteSchema('hooked');
        return Promise.resolve();
      } catch(err) {
        server.stateManager.deleteSchema('hooked');
        return Promise.reject(err);
      }
    });

    it('should support asynchronous operation', async () => {
      server.stateManager.registerSchema('hooked', hookSchema);
      server.stateManager.registerUpdateHook('hooked', async (updates, currentValues) => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve({
              ...updates,
              value: 'async-ok',
            });
          }, 50);
        });
      });

      const h = await server.stateManager.create('hooked');

      await h.set({ name: 'test' });

      try {
        assert.deepEqual(h.getValues(), { name: 'test', value: 'async-ok' });
        server.stateManager.deleteSchema('hooked');
        return Promise.resolve();
      } catch(err) {
        server.stateManager.deleteSchema('hooked');
        return Promise.reject(err);
      }
    });

    it('should apply several hooks in registation order', async () => {
      server.stateManager.registerSchema('hooked', hookSchema);
      server.stateManager.registerUpdateHook('hooked', (updates, currentValues) => {
        return { ...updates, value: 'ok-1' };
      });

      server.stateManager.registerUpdateHook('hooked', (updates, currentValues) => {
        return { ...updates, value: 'ok-2' };
      });

      const h = await server.stateManager.create('hooked');

      await h.set({ name: 'test' });

      try {
        assert.deepEqual(h.getValues(), { name: 'test', value: 'ok-2' });
        server.stateManager.deleteSchema('hooked');
        return Promise.resolve();
      } catch(err) {
        server.stateManager.deleteSchema('hooked');
        return Promise.reject(err);
      }
    });

    it('should unregister hooks properly', async () => {
      server.stateManager.registerSchema('hooked', hookSchema);
      server.stateManager.registerUpdateHook('hooked', (updates, currentValues) => {
        return { ...updates, value: 'ok-1' };
      });

      const unregister = server.stateManager.registerUpdateHook('hooked', (updates, currentValues) => {
        return { ...updates, value: 'ok-2' };
      });

      const h = await server.stateManager.create('hooked');

      try {
        await h.set({ name: 'test-1' });
        assert.deepEqual(h.getValues(), { name: 'test-1', value: 'ok-2' });

        unregister(); // remove second hook

        await h.set({ name: 'test-2' });
        assert.deepEqual(h.getValues(), { name: 'test-2', value: 'ok-1' });

        server.stateManager.deleteSchema('hooked');
      } catch(err) {
        server.stateManager.deleteSchema('hooked');
        return Promise.reject(err);
      }
    });

    it('should abort when explicitly returning `null`', async () => {
      server.stateManager.registerSchema('hooked', hookSchema);
      server.stateManager.registerUpdateHook('hooked', (updates, currentValues) => {
        assert.ok('hook called');
        return null;
      });

      server.stateManager.registerUpdateHook('hooked', (updates, currentValues) => {
        assert.fail('should not be called', updates);
        return { ...updates, value: 'ok-2' };
      });

      const h = await server.stateManager.create('hooked');

      try {
        await h.set({ name: 'test' });
        // should have changed
        assert.deepEqual(h.getValues(), { name: null, value: null });

        server.stateManager.deleteSchema('hooked');
      } catch(err) {
        server.stateManager.deleteSchema('hooked');
        return Promise.reject(err);
      }
    });

    it('should abort when explicitly returning `null` (w/ immediate option)', async () => {
      server.stateManager.registerSchema('hooked', {
        value: {
          type: 'string',
          default: null,
          nullable: true,
          immediate: true,
        },
      });

      server.stateManager.registerUpdateHook('hooked', (updates, currentValues) => {
        assert.ok('hook called');
        return null;
      });

      const h = await server.stateManager.create('hooked');

      try {
        await h.set({ value: 'test' });
        // should have changed
        assert.deepEqual(h.getValues(), { value: null });

        server.stateManager.deleteSchema('hooked');
      } catch(err) {
        server.stateManager.deleteSchema('hooked');
        return Promise.reject(err);
      }
    });

    it('should continue when implicitly returning `undefined`', async () => {
      server.stateManager.registerSchema('hooked', hookSchema);

      server.stateManager.registerUpdateHook('hooked', (updates, currentValues) => {
        if (updates.name === 'test-1') {
          return {
            ...updates,
            value: 'ok',
          };
        }
        // implicitely return undefined on test-2
      });

      const h = await server.stateManager.create('hooked');

      try {
        await h.set({ name: 'test-1' });
        assert.deepEqual(h.getValues(), { name: 'test-1', value: 'ok' });

        await h.set({ name: 'test-2' });
        assert.deepEqual(h.getValues(), { name: 'test-2', value: 'ok' });

        server.stateManager.deleteSchema('hooked');
      } catch(err) {
        server.stateManager.deleteSchema('hooked');
        return Promise.reject(err);
      }
    });
  });
});
