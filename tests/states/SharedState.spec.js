import { assert } from 'chai';
import { delay } from '@ircam/sc-utils';

import { Server } from '../../src/server/index.js';
import { Client } from '../../src/client/index.js';

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

      // DELETE_REQUEST is received first on the SharedStatePrivate which deletes
      // all its listeners.
      // Concurrently DETACH_REQUEST is sent but cannot have a response,
      // flush pending requests when DELETE_NOTIFICATION is received
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
