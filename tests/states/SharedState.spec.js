import { delay, getTime } from '@ircam/sc-utils';
import { assert } from 'chai';

import { Server } from '../../src/server/index.js';
import { Client } from '../../src/client/index.js';
import { BATCHED_TRANSPORT_CHANNEL } from '../../src/common/constants.js';

import config from '../utils/config.js';
import { a, b } from '../utils/schemas.js';

describe('# SharedState', () => {
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

  describe('## async set(updates[, context]) => updates', () => {
    it('should throw if first argument is not an object', async () => {
      const a = await server.stateManager.create('a');

      let errored = false;

      try {
        await a.set('fail', true);
      } catch(err) {
        console.log(err.message);
        errored = true;
      }

      if (errored === false) {
        assert.fail('should throw error');
      }

      await a.delete();
    });

    it('should throw if second argument is not an object', async () => {
      const a = await server.stateManager.create('a');

      // weird stuff with async chai, did find better solution
      let errored = false;
      try {
        await a.set({}, 'fail');
      } catch(err) {
        console.log(err.message);
        errored = true;
      }

      if (errored === false) {
        assert.fail('should throw error');
      }

      await a.delete();
    });

    it('should throw on undefined param name', async () => {
      const a = await server.stateManager.create('a');

      // weird stuff with async chai, did find better solution
      let errored = false;
      try {
        await a.set({ unkown: true })
      } catch(err) {
        console.log(err.message);
        errored = true;
      }

      if (errored === false) {
        assert.fail('should throw error');
      }

      await a.delete();
    });

    it('should throw if value is of bad type', async () => {
      const a = await server.stateManager.create('a');

      // weird stuff with async chai, did find better solution
      let errored = false;
      try {
        await a.set({ bool: {} })
      } catch(err) {
        console.log(err.message);
        errored = true;
      }

      if (errored === false) {
        assert.fail('should throw error');
      }

      await a.delete();
    });

    it('should return the updated values', async () => {
      const a = await server.stateManager.create('a');
      const updates = { bool: true };
      const result = await a.set(updates);

      assert.deepEqual(result, updates);
      assert.equal(a.get('bool'), true);

      await a.delete();
    });

    it('should resolve after `onUpdate` even if onUpdate callback is async', async () => {
      const a = await server.stateManager.create('a');
      let asyncCallbackCalled = false;

      a.onUpdate(async updates => {
        await new Promise(resolve => setTimeout(resolve, 100));
        asyncCallbackCalled = true;
      });

      await a.set({ bool: true });
      assert.equal(asyncCallbackCalled, true);

      await a.delete();
    });

    it('should keep states of same kind isolated', async () => {
      const states = [];
      const numStates = 100;
      const numTests = 2000;

      for (let i = 0; i < numStates; i++) {
        const state = await server.stateManager.create('a');
        states[i] = state;
      }

      for (let i = 0; i < numTests; i++) {
        // pick random state
        const index = Math.floor(Math.random() * numStates);
        const state = states[index];
        const value = Math.floor(Math.random() * 99) + 1; // avoid 0 as it is the default value
        const updates = await state.set({ bool: true, int: value });
        assert.deepEqual(updates, { bool: true, int: value });

        for (let j = 0; j < numStates; j++) {
          const state = states[j];

          if (j === index) {
            assert.equal(state.get('bool'), true);
            assert.equal(state.get('int'), value);
            await state.set({ bool: false, int: 0 }); // reset
          } else {
            assert.equal(state.get('bool'), false);
            assert.equal(state.get('int'), 0);
          }
        }
      }

      for (let state of states) {
        await state.delete();
      }
    });
  });

  describe('## get(name) - ## getValues()', () => {
    it('get(name) `any` type should be a deep copy', async() => {
      server.stateManager.registerSchema('any', {
        ref: {
          type: 'any',
          default: {
            inner: { test: false },
          },
        },
      });

      const a = await server.stateManager.create('any');

      const ref1 = a.get('ref');
      ref1.test = true;
      ref1.inner.test = true;

      const ref2 = a.get('ref');
      assert.equal(ref2.test, undefined);
      assert.equal(ref2.inner.test, false);
    });

    it('getValues() `any` type should be a deep copy', async() => {
      server.stateManager.registerSchema('any-all', {
        ref: {
          type: 'any',
          default: {},
        },
      });

      const a = await server.stateManager.create('any-all');
      const ref1 = a.getValues();
      ref1.ref.test = true;
      const ref2 = a.get('ref');
      assert.equal(ref2.test, undefined);
    });
  });

  describe('## getUnsafe(name) - state.getValuesUnsafe()', () => {
    it('get(name) `any` type should be a reference', async() => {
      server.stateManager.registerSchema('any-unsafe', {
        ref: {
          type: 'any',
          default: {
            inner: { test: false },
          },
        },
      });

      const a = await server.stateManager.create('any-unsafe');

      const ref1 = a.getUnsafe('ref');
      const ref2 = a.getUnsafe('ref');

      assert.equal(ref1, ref2)
    });

    it('getValuesUnsafe() `any` type be a reference', async() => {
      server.stateManager.registerSchema('any-all-unsafe', {
        ref: {
          type: 'any',
          default: {},
        },
      });

      const a = await server.stateManager.create('any-all-unsafe');

      const ref1 = a.getValuesUnsafe();
      const ref2 = a.getValuesUnsafe();

      assert.equal(ref1.ref, ref2.ref);
    });
  });

  describe('## onUpdate((newValues, oldValues[, context = null]) => {}[, executeListener=false]) => unsubscribe', () => {
    it('should properly execute listeners', async () => {
      return new Promise(async (resolve, reject) => {
        const state = await server.stateManager.create('a');
        const attached = await client.stateManager.attach('a', state.id);

        const statePromise = new Promise((resolve) => {
          let step = 0;

          state.onUpdate((newValues, oldValues, context) => {
            if (step === 0) {
              assert.deepEqual(newValues, { bool: true, int: 42 });
              assert.deepEqual(oldValues, { bool: false, int: 0 });
              assert.deepEqual(context, null);
            } else if (step === 1) {
              assert.deepEqual(newValues, { bool: false, int: 76 });
              assert.deepEqual(oldValues, { bool: true, int: 42 });
              assert.deepEqual(context, { someContext: true });
              resolve();
            } else {
              reject('something wrong happened');
            }

            step += 1;
          });
        });

        const attachedPromise = new Promise((resolve) => {
          let step = 0;

          attached.onUpdate((newValues, oldValues, context) => {
            if (step === 0) {
              assert.deepEqual(newValues, { bool: true, int: 42 });
              assert.deepEqual(oldValues, { bool: false, int: 0 });
              assert.deepEqual(context, null);
            } else if (step === 1) {
              assert.deepEqual(newValues, { bool: false, int: 76 });
              assert.deepEqual(oldValues, { bool: true, int: 42 });
              assert.deepEqual(context, { someContext: true });
              resolve();
            } else {
              reject('something wrong happened');
            }

            step += 1;
          });
        });

        await state.set({ bool: true, int: 42 });
        await state.set({ bool: false, int: 76 }, { someContext: true });

        await Promise.all([statePromise, attachedPromise]);

        await state.delete();

        resolve();
      });
    });

    it(`should return working unsubscribe() function`, async () => {
      const a = await server.stateManager.create('a');

      let onUpdateCalled = false;
      const unsubsribe = a.onUpdate(updates => onUpdateCalled = true);

      unsubsribe();

      await a.set({ int: 1 });

      await new Promise(resolve => setTimeout(resolve, 100));

      assert.equal(onUpdateCalled, false);
      await a.delete();
    });

    it('should not execute immediately if `executeListener=false` (default)', async () => {
      const a = await server.stateManager.create('a');

      let onUpdateCalled = false;
      const unsubsribe = a.onUpdate(updates => { onUpdateCalled = true; }, false);

      await new Promise(resolve => setTimeout(resolve, 100));

      assert.equal(onUpdateCalled, false);
      await a.delete();
    });

    it('should execute immediately if `executeListener=true`', async () => {
      const a = await server.stateManager.create('a');

      let onUpdateCalled = false;
      const unsubsribe = a.onUpdate((newValues, oldValues, context) => {
        onUpdateCalled = true;
        assert.deepEqual(newValues, { bool: false, int: 0 });
        assert.deepEqual(oldValues, {});
        assert.deepEqual(context, null);
      }, true);

      await new Promise(resolve => setTimeout(resolve, 100));

      assert.equal(onUpdateCalled, true);
      await a.delete();
    });

    it('should copy stored value for "any" type to have a predictable behavior', async () => {
      server.stateManager.registerSchema('test-any', {
        any: {
          type: 'any',
          nullable: true,
          default: null,
        }
      });

      const state = await server.stateManager.create('test-any');
      let numCalled = 0;

      state.onUpdate(updates => {
        assert.equal(updates.any.num, numCalled);
        numCalled += 1;
      });

      // client code `data` and state underlying data should never be the same pointer
      const data = { num: 0 };

      await state.set({ any: data });
      assert.equal(state.get('any').num, 0);

      data.num = 1;

      await state.set({ any: data });
      assert.equal(state.get('any').num, 1);

      assert.equal(numCalled, 2);
    });
  });

  describe('## async detach()', () => {
    it('should not receive updates after detach', async () => {
      const a0 = await server.stateManager.create('a');
      const a1 = await server.stateManager.attach('a', a0.id);
      const a2 = await server.stateManager.attach('a', a0.id);

      let subscribeCalled = false;
      a1.onUpdate(() => subscribeCalled = true);

      await a1.detach();
      await a0.set({ bool: true });

      assert.equal(a0.get('bool'), true);
      assert.equal(a1.get('bool'), false);
      assert.equal(a2.get('bool'), true); // this one is still attached

      a0.delete();
      await new Promise(resolve => setTimeout(resolve, 200));

      if (subscribeCalled) {
        assert.fail('subscribe should not be called after detach');
      }
    });

    it('should call state.onDetach but not on onDelete if not owner', async () => {
      const a0 = await server.stateManager.create('a');
      const a1 = await server.stateManager.attach('a', a0.id);

      let onDetachCalled = false;
      let onDeleteCalled = false;
      a1.onDetach(() => onDetachCalled = true);
      a1.onDelete(() => onDeleteCalled = true);

      await a0.delete();

      assert.equal(onDetachCalled, true);
      assert.equal(onDeleteCalled, false);
    });

    it('should call state.onDetach and state.onDelete if owner', async () => {
      const a = await server.stateManager.create('a');

      let onDetachCalled = false;
      let onDeleteCalled = false;

      a.onDetach(() => onDetachCalled = true);
      a.onDelete(() => {
        onDeleteCalled = true;
        assert.equal(onDetachCalled, true);
      });

      await a.delete();

      assert.equal(onDetachCalled, true);
      assert.equal(onDeleteCalled, true);
    });

    it('should call state.onDetach and state.onDelete before delete() promise resolves', async () => {
      const a = await server.stateManager.create('a');

      let step = 0;
      let onDetachCalled = false;
      let onDeleteCalled = false;

      a.onDetach(async () => {
        await delay(50);
        step += 1;
        onDetachCalled = true;
        assert.equal(step, 1);
      });

      a.onDelete(async () => {
        await delay(50);
        step += 1;
        onDeleteCalled = true;
        assert.equal(step, 2);
      });

      await a.delete();

      step += 1;
      assert.equal(step, 3);
      assert.equal(onDetachCalled, true);
      assert.equal(onDeleteCalled, true);
    });

    it('should throw on a second `detach` call', async () => {
      const b = await server.stateManager.create('b');

      let index = 0;
      // should be called only once
      await b.onDetach(() => {
        if (index === 1) {
          assert.fail('should not call onDetach twice');
        }

        index += 1;
      });

      await b.detach();

      let errored = false;
      try {
        await b.detach();
      } catch (err) {
        console.log(err.message);
        errored = true;
      }

      if (!errored) {
        assert.fail();
      }
    });
  });

  describe(`## Race conditions`, () => {
    it(`should flush pending requests when state is deleted / detached`, async () => {
      const aCreated = await server.stateManager.create('a');
      const aAttached = await client.stateManager.attach('a');

      // - DELETE_REQUEST sent by `aCreated` is received first on the
      // SharedStatePrivate which deletes all its listeners.
      // - Concurrently DETACH_REQUEST is sent by `aAttached` but cannot have a response,
      // - Flush pending requests on `aAttached` when DELETE_NOTIFICATION is received

      aCreated.delete();

      let errored = false;

      try {
        await aAttached.detach();
      } catch (err) {
        console.log(err.message);
        errored = true;
      }

      if (!errored) {
        assert.fail('should have thrown');
      }
    });
  });
});

describe(`# SharedState - Batched transport`, () => {
  it(`wait = 0 - should send only one message on consecutive synchronous update requests`, async () => {
    // launch new server so we can grab the server side representation of the client
    // @note to self - please explain... this looks like a bug...
    const localConfig = structuredClone(config);
    localConfig.env.port = 8082;

    const server = new Server(localConfig);
    server.stateManager.registerSchema('a', a);
    await server.start();

    let batchedRequests = 0;
    let batchedResponses = 0;

    server.onClientConnect(client => {
      client.socket.addListener(BATCHED_TRANSPORT_CHANNEL, (args) => {
        batchedRequests += 1;
      });
    });

    const client = new Client({ role: 'test', ...localConfig });
    await client.start();

    // update response
    client.socket.addListener(BATCHED_TRANSPORT_CHANNEL, (args) => {
      batchedResponses += 1;
    });

    const state = await client.stateManager.create('a');

    state.set({ bool: true });

    for (let i = 1; i <= 42; i++) {
      state.set({ int: i });
    }

    await delay(20);
    // make sure the state is up to date
    assert.equal(state.get('int'), 42);
    // 1 message for create request / response (i.e.await client.stateManager.create)
    // 1 message for the batched updates requests / responses
    assert.equal(batchedRequests, 2);
    assert.equal(batchedResponses, 2);

    state.delete();
    await client.stop();
    await server.stop();
  });

  it(`transportBatchTimeout > 0 - server should send only one message on consecutive asynchronous update requests`, async () => {
    // launch new server so we can grab the server side representation of the client
    // @note to self - please explain...
    const localConfig = structuredClone(config);
    localConfig.env.port = 8082;

    const server = new Server(localConfig);
    server.stateManager.configure({ transportBatchTimeout: 20 });
    server.stateManager.registerSchema('a', a);
    await server.start();

    let batchedRequests = 0;
    let batchedResponses = 0;

    server.onClientConnect(client => {
      client.socket.addListener(BATCHED_TRANSPORT_CHANNEL, (args) => {
        batchedRequests += 1;
      });
    });

    const client = new Client({ role: 'test', ...localConfig });
    await client.start();

    // update response
    client.socket.addListener(BATCHED_TRANSPORT_CHANNEL, (args) => {
      batchedResponses += 1;
    });

    const state = await client.stateManager.create('a');

    for (let i = 1; i <= 10; i++) {
      await delay(1);
      state.set({ int: i });
    }

    await delay(30);
    // make sure the state is up to date
    assert.equal(state.get('int'), 10);
    // 1 message for create request / response (i.e.await client.stateManager.create)
    // 10 message for the updates requests
    assert.equal(batchedRequests, 11);
    // 1 message for create request / response (i.e.await client.stateManager.create)
    // 1 message for the updates responses
    assert.equal(batchedResponses, 2);

    state.delete();
    await client.stop();
    await server.stop();
  });

  it(`transportBatchTimeout > 0 - client should send only one message on consecutive asynchronous update requests`, async () => {
    // launch new server so we can grab the server side representation of the client
    // @note to self - please explain...
    const localConfig = structuredClone(config);
    localConfig.env.port = 8082;

    const server = new Server(localConfig);
    server.stateManager.registerSchema('a', a);
    await server.start();

    let batchedRequests = 0;
    let batchedResponses = 0;

    server.onClientConnect(client => {
      client.socket.addListener(BATCHED_TRANSPORT_CHANNEL, (args) => {
        // console.log('requests', args);
        batchedRequests += 1;
      });
    });

    const client = new Client({ role: 'test', ...localConfig });
    client.stateManager.configure({ transportBatchTimeout: 20 });
    await client.start();

    // update response
    client.socket.addListener(BATCHED_TRANSPORT_CHANNEL, (args) => {
      // console.log('responses', args);
      batchedResponses += 1;
    });

    const state = await client.stateManager.create('a');

    for (let i = 1; i <= 10; i++) {
      await delay(1);
      state.set({ int: i });
    }

    await delay(30);
    // make sure the state is up to date
    assert.equal(state.get('int'), 10);
    // 1 message for create request / response (i.e.await client.stateManager.create)
    // 1 message for the updates requests
    assert.equal(batchedRequests, 2);
    // 1 message for create request / response (i.e.await client.stateManager.create)
    // only 1 message for the updates responses as they are handled in a batch by the server
    assert.equal(batchedResponses, 2);

    state.delete();
    await client.stop();
    await server.stop();
  });

  it.only(`transportBatchTimeout > 0 - attached states should not be delayed more than expected [same client]`, async () => {
    const localConfig = structuredClone(config);
    localConfig.env.port = 8082;

    const server = new Server(localConfig);
    server.stateManager.configure({ transportBatchTimeout: 10 });
    server.stateManager.registerSchema('a', a);
    await server.start();

    const client = new Client({ role: 'test', ...localConfig });
    await client.start();

    const owned = await client.stateManager.create('a');
    const attached = await client.stateManager.attach('a');

    let updateRequest;
    let ownedReceived;
    let attachedReceived;

    owned.onUpdate(updates => ownedReceived = getTime());
    attached.onUpdate(updates => attachedReceived = getTime());

    updateRequest = getTime();
    owned.set({ int: 42 });

    await delay(50);

    // accpet 5ms of network latency
    assert.isAbove(ownedReceived - updateRequest, 0.01);
    assert.isBelow(ownedReceived - updateRequest, 0.015);

    assert.isAbove(attachedReceived - updateRequest, 0.01);
    assert.isBelow(attachedReceived - updateRequest, 0.015);

    owned.delete();
    await client.stop();
    await server.stop();
  });

  it.only(`transportBatchTimeout > 0 - attached states should not be delayed more than expected [different clients]`, async () => {
    const localConfig = structuredClone(config);
    localConfig.env.port = 8082;

    const server = new Server(localConfig);
    server.stateManager.configure({ transportBatchTimeout: 10 });
    server.stateManager.registerSchema('a', a);
    await server.start();

    const client1 = new Client({ role: 'test', ...localConfig });
    await client1.start();

    const client2 = new Client({ role: 'test', ...localConfig });
    await client2.start();

    const owned = await client1.stateManager.create('a');
    const attached = await client2.stateManager.attach('a');

    let updateRequest;
    let ownedReceived;
    let attachedReceived;

    owned.onUpdate(updates => ownedReceived = getTime());
    attached.onUpdate(updates => attachedReceived = getTime());

    updateRequest = getTime();
    owned.set({ int: 42 });

    await delay(50);

    // accpet 5ms of network latency
    assert.isAbove(ownedReceived - updateRequest, 0.01);
    assert.isBelow(ownedReceived - updateRequest, 0.015);

    assert.isAbove(attachedReceived - updateRequest, 0.01);
    assert.isBelow(attachedReceived - updateRequest, 0.015);

    owned.delete();
    await client1.stop();
    await client2.stop();
    await server.stop();
  });

  it.only(`transportBatchTimeout > 0 - attached states should not be delayed more than expected [owned by server]`, async () => {
    const localConfig = structuredClone(config);
    localConfig.env.port = 8082;

    const server = new Server(localConfig);
    server.stateManager.configure({ transportBatchTimeout: 10 });
    server.stateManager.registerSchema('a', a);
    await server.start();

    const client1 = new Client({ role: 'test', ...localConfig });
    await client1.start();

    const client2 = new Client({ role: 'test', ...localConfig });
    await client2.start();

    const owned = await server.stateManager.create('a');
    const attached1 = await client1.stateManager.attach('a');
    const attached2 = await client2.stateManager.attach('a');

    let updateRequest;
    let attached1Received;
    let attached2Received;

    attached1.onUpdate(updates => attached1Received = getTime());
    attached2.onUpdate(updates => attached2Received = getTime());

    updateRequest = getTime();
    attached1.set({ int: 42 });

    await delay(50);

    // accpet 5ms of network latency
    assert.isAbove(attached1Received - updateRequest, 0.01);
    assert.isBelow(attached1Received - updateRequest, 0.015);

    assert.isAbove(attached2Received - updateRequest, 0.01);
    assert.isBelow(attached2Received - updateRequest, 0.015);

    owned.delete();
    await client1.stop();
    await client2.stop();
    await server.stop();
  });

  // it.skip(`Flushing PromiseStore should not crash the server`, async () => {
  //   // launch new server so we can grab the server side representation of the client
  //   // @note to self - please explain...
  //   const localConfig = structuredClone(config);
  //   localConfig.env.port = 8082;

  //   const server = new Server(localConfig);
  //   server.stateManager.configure({ transportBatchTimeout: 100 });
  //   server.stateManager.registerSchema('a', a);
  //   await server.start();

  //   const client = new Client({ role: 'test', ...localConfig });
  //   await client.start();

  //   const state = await client.stateManager.create('a');
  //   const attached = await server.stateManager.attach('a');

  //   try {
  //     // server request update
  //     attached.set({ int: 42 });
  //     // client stop for some reason, so the PromiseStore is flushed
  //     await delay(10);
  //     await client.stop();

  //     await delay(1000);
  //   } catch (err) {
  //     console.log(err.message);
  //   }
  //   // state.delete();
  //   // await server.stop();
  // });
});
