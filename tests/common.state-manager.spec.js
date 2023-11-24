import { assert } from 'chai';
import { delay } from '@ircam/sc-utils';

import { Server } from '../src/server/index.js';
import { Client } from '../src/client/index.js';
import {
  OBSERVE_RESPONSE,
  OBSERVE_NOTIFICATION,
} from '../src/common/constants.js';


const a = {
  bool: {
    type: 'boolean',
    default: false,
  },
  int: {
    type: 'integer',
    min: 0,
    max: 100,
    default: 0,
    step: 1,
  },
};

const b = {
  bool: {
    type: 'boolean',
    default: true,
  },
  int: {
    type: 'integer',
    min: 0,
    max: 100,
    default: 20,
    step: 1,
  },
};

const config = {
  app: {
    clients: {
      test: { target: 'node' },
    },
  },
  env: {
    type: 'development',
    port: 8081,
    serverAddress: '127.0.0.1',
    useHttps: false,
    verbose: process.env.VERBOSE === '1' ? true : false,
  },
};

let server;
let clients = [];
let client; // clients[0]
const numClients = 100;

describe(`common::StateManager`, () => {
  before(async () => {
    // ---------------------------------------------------
    // server
    // ---------------------------------------------------
    server = new Server(config);
    server.stateManager.registerSchema('a', a);
    server.stateManager.registerSchema('b', b);

    await server.init();
    await server.start();

    // ---------------------------------------------------
    // clients
    // ---------------------------------------------------
    for (let i = 0; i < numClients; i++) {
      const client = new Client({ role: 'test', ...config });
      await client.init();
      await client.start();

      clients[i] = client;
    }

    client = clients[0];

    console.log(`
  > created ${numClients} clients
    `);
  });

  after(async function() {
    server.stop();
  });

  describe('stateManager.registerSchema(schemaName, definition)', () => {
    it('should register schema', () => {
      assert.throws(() => {
        server.stateManager.registerSchema('a', a);
      }, Error, '[stateManager.registerSchema] cannot register schema with name: "a", schema name already exists');

    });

    it ('should register another schema reusing same definition', () => {
      server.stateManager.registerSchema('aa', a);
    });
  });


  describe('stateManager.observe([schemaName, ] callback) => Promise<unobserve>', async () => {
    it(`should be notified of states created on the network`, async () => {
      let numCalled = 0;

      const state1 = await client.stateManager.create('a');

      const unobserve = await server.stateManager.observe((schemaName, stateId, nodeId) => {
        assert.equal(schemaName, 'a');
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

      const unobserve1 = await server.stateManager.observe(async (schemaName, stateId, nodeId) => {
        numCalled += 1;
      });

      assert.equal(numCalled, 1);

      await state1.delete();
      unobserve1();

      const unobserve2 = await server.stateManager.observe(async (schemaName, stateId, nodeId) => {
        numCalled += 1;
      });

      assert.equal(numCalled, 1);
      unobserve2();

      state1.delete();
    });

    it(`returned Promise should resolve after async observe callback`, async () => {
      let numCalled = 0;
      const state1 = await client.stateManager.create('a');

      const unobserve = await server.stateManager.observe(async (schemaName, stateId, nodeId) => {
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

      const unobserve = await server.stateManager.observe(async (schemaName, stateId, nodeId) => {
        numCalled += 1;
      });

      assert.equal(numCalled, 1);

      let notificationReceived = false;
      // check low level transport messages
      server.stateManager.client.transport.addListener(OBSERVE_NOTIFICATION, () => {
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

    it(`should not be notified of states created by same node`, async () => {
      const state1 = await client.stateManager.create('a');

      let observeCalled = false;

      const unobserve = await client.stateManager.observe('a', (schemaName, stateId, nodeId) => {
        observeCalled = true;
      });

      const state2 = await client.stateManager.create('a');

      await new Promise(resolve => setTimeout(resolve, 300));

      if (observeCalled === true) {
        assert.fail('observe should not have been called')
      }

      await state1.delete();
      await state2.delete();
    });

    it(`should properly behave with several observers`, async () => {
      let responsesReceived = 0;

      server.stateManager.client.transport.addListener(OBSERVE_RESPONSE, () => {
        responsesReceived += 1;
      });

      let notificationsReceived = 0;

      server.stateManager.client.transport.addListener(OBSERVE_NOTIFICATION, () => {
        notificationsReceived += 1;
      });


      let numCalled = 0;
      const state1 = await client.stateManager.create('a');

      const unobserve1 = await server.stateManager.observe(async (schemaName, stateId, nodeId) => {
        numCalled += 1;
      });

      const unobserve2 = await server.stateManager.observe(async (schemaName, stateId, nodeId) => {
        numCalled += 1;
      });

      // each observer receives its own response and is called
      assert.equal(responsesReceived, 2);
      assert.equal(notificationsReceived, 0);
      assert.equal(numCalled, 2);

      const state2 = await client.stateManager.create('a');

      // 1 notifications received, but both observers called
      assert.equal(responsesReceived, 2);
      assert.equal(notificationsReceived, 1);
      assert.equal(numCalled, 4);

      // delete first observer
      unobserve1();

      const state3 = await client.stateManager.create('a');

      // 1 notifications received, but only second observer called
      assert.equal(responsesReceived, 2);
      assert.equal(notificationsReceived, 2);
      assert.equal(numCalled, 5);

      // delete second observer
      unobserve2();

      const state4 = await client.stateManager.create('a');
      // nothing should happen
      assert.equal(responsesReceived, 2);
      assert.equal(notificationsReceived, 2);
      assert.equal(numCalled, 5);

      await state1.delete();
      await state2.delete();
      await state3.delete();
      await state4.delete();
    });

    it(`should properly behave with filtered schema name: observe(schemaName, callback)`, async () => {
      const a1 = await client.stateManager.create('a');
      const b1 = await client.stateManager.create('b');

      let starCalled = 0;
      let filteredCalled = 0;

      const other = clients[1];

      const unobserveStar = await other.stateManager.observe(async (schemaName, stateId) => {
        starCalled += 1;
      });

      const unobserveFiltered = await other.stateManager.observe('a', async (schemaName, stateId) => {
        filteredCalled += 1;
      });

      assert.equal(starCalled, 2);
      assert.equal(filteredCalled, 1);

      const a2 = await client.stateManager.create('a');
      await new Promise(resolve => setTimeout(resolve, 100));
      assert.equal(starCalled, 3);
      assert.equal(filteredCalled, 2);

      const b2 = await client.stateManager.create('b');
      await new Promise(resolve => setTimeout(resolve, 100));
      assert.equal(starCalled, 4);
      assert.equal(filteredCalled, 2);

      unobserveStar();

      const a3 = await client.stateManager.create('a');
      await new Promise(resolve => setTimeout(resolve, 100));
      assert.equal(starCalled, 4);
      assert.equal(filteredCalled, 3);

      unobserveFiltered();

      const a4 = await client.stateManager.create('a');
      await new Promise(resolve => setTimeout(resolve, 100));
      assert.equal(starCalled, 4);
      assert.equal(filteredCalled, 3);

      await a1.delete();
      await a2.delete();
      await a3.delete();
      await a4.delete();
      await b1.delete();
      await b2.delete();
    });
  });

  describe('async stateManager.create(schemaName) => state', () => {
    it('should create state', async () => {
      const stateA = await server.stateManager.create('a');
      const stateB = await server.stateManager.create('a');

      assert.isNumber(stateA.id);
      assert.isNumber(stateA.remoteId);
      assert.isNumber(stateB.id);
      assert.isNumber(stateB.remoteId);

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
  });

  describe('async state.set(updates[, context]) => updates', () => {
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

  describe('state.get(name) - state.getValues()', () => {
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

  describe('state.getUnsafe(name) - state.getValuesUnsafe()', () => {
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

  describe('state.onUpdate((newValues, oldValues[, context = null]) => {}[, executeListener=false]) => unsubscribe', () => {
    it('should properly execute listeners', async () => {
      return new Promise(async (resolve, reject) => {
        const state = await server.stateManager.create('a');
        const attached = await clients[0].stateManager.attach('a', state.id);

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

  describe('schema options', () => {
    it('default options [event=false, filterChange=true, immediate=false] should behave correctly', async () => {
      const a = await server.stateManager.create('a');
      let counter = 0;

      a.onUpdate(updates => {
        try {
          assert.deepEqual(updates, { bool: true });
          counter += 1;
        } catch(err) {
          reject(err);
        }
      });

      await a.set({ bool: true });
      await a.set({ bool: true });
      await a.set({ bool: true });

      await new Promise(resolve => setTimeout(resolve, 200));
      assert.equal(counter, 1);

      await a.delete();
    });

    it('[event=true] should behave correctly', async () => {
      return new Promise(async (resolve, reject) => {
        server.stateManager.registerSchema('event-test', {
          value: {
            type: 'boolean',
            event: true,
          }
        });
        const state = await server.stateManager.create('event-test');
        const numEvents = 5;
        let counter = 0;

        assert.equal(state.get('value'), null);

        // should be able to read if called from a subscription
        function readInSubscribe() {
          assert.equal(state.get('value'), true);
        }

        state.onUpdate(updates => {
          try {
            assert.deepEqual(updates, { value: true });
            readInSubscribe();
            counter += 1;
          } catch(err) {
            reject(err);
          }
        });

        let updates;
        for (let i = 0; i < numEvents; i++) {
          updates = await state.set({ value: true });
          // returned updates object has the proper value
          assert.deepEqual(updates, { value: true });
          // but value is null if read from state
          assert.equal(state.get('value'), null);
          updates = null;
        }

        // client-side
        const clientState = await client.stateManager.attach('event-test');
        assert.equal(clientState.get('value'), null);

        setTimeout(() => {
          assert.equal(counter, numEvents);
          resolve();
        }, 100);
      });
    });

    it('[filterChange=false] should behave correctly', async () => {
      return new Promise(async (resolve, reject) => {
        server.stateManager.registerSchema('filter-change-test', {
          value: {
            type: 'boolean',
            default: true,
            filterChange: false,
          }
        });
        const state = await server.stateManager.create('filter-change-test');
        const numCalls = 5;
        let counter = 0;

        state.onUpdate(updates => {
          try {
            assert.deepEqual(updates, { value: true });
            counter += 1;
          } catch(err) {
            reject(err);
          }
        });

        for (let i = 0; i < numCalls; i++) {
          await state.set({ value: true });
          // contrary to `event` the value is still stored into the state
          assert.equal(state.get('value'), true);
        }


        setTimeout(() => {
          // try {
            assert.equal(counter, numCalls);
            resolve();
          // } catch(err) {
          //   reject(err);
          // }
        }, 100);
      });
    });

    it('[immediate=true] (w/ [event=false, filterChange=true]) should behave correctly', async () => {
      return new Promise(async (resolve, reject) => {
        server.stateManager.registerSchema('immediate-test', {
          immediateValue: {
            type: 'integer',
            default: 0,
            immediate: true,
          },
          normalValue: {
            type: 'integer',
            default: 0,
          }
        });

        let subscribeCalledBeforeHook = false;

        server.stateManager.registerUpdateHook('immediate-test', (updates, currentValues) => {
          try {
            // assert.fail();
            assert.isTrue(subscribeCalledBeforeHook, 'subscribe should be called before hook');
          } catch(err) {
            reject(err);
          }

          if (updates.immediateValue === 2) {
            return {
              ...updates,
              immediateValue: 3,
            }
          }

          return updates;
        });

        const state = await clients[0].stateManager.create('immediate-test');
        const attached = await clients[1].stateManager.attach('immediate-test');

        const statePromise = new Promise((resolve) => {
          let call = 0;

          state.onUpdate(updates => {
            if (call === 0) {
              subscribeCalledBeforeHook = true;

              try {
                assert.deepEqual(updates, { immediateValue: 1 });
              } catch(err) {
                reject(err);
              }
            } else if (call === 1) {
              try {
                assert.deepEqual(updates, { normalValue: 10 });
                resolve();
              } catch(err) {
                reject(err);
              }
            } else if (call === 2) {
              // call from immedaite
              try {
                assert.deepEqual(updates, { immediateValue: 2 });
                resolve();
              } catch(err) {
                reject(err);
              }
            } else if (call === 3) {
              // call from server override
              try {
                assert.deepEqual(updates, { immediateValue: 3 });
                resolve();
              } catch(err) {
                reject(err);
              }
            } else {
              reject('creator: something went wrong');
            }

            call += 1;
          });
        });

        // should be notified normally if not initiator of the update
        const attachedPromise = new Promise((resolve) => {
          let call = 0;

          attached.onUpdate(updates => {
            if (call === 0) {
              try {
                assert.deepEqual(updates, { immediateValue: 1, normalValue: 10 });
                resolve();
              } catch(err) {
                reject(err);
              }
            } else if (call === 1) {
              try {
                assert.deepEqual(updates, { immediateValue: 3 });
                resolve();
              } catch(err) {
                reject(err);
              }
            } else {
              reject('attached: something went wrong');
            }

            call += 1;
          });
        });

        // invalid value
        try {
          await state.set({ immediateValue: 1, normalValue: 10 });
          // this should not trigger anything
          await state.set({ immediateValue: 1, normalValue: 10 });
          // if the value is overriden server-side, initiator should be called twice
          // while attached should be called once with final value
          await state.set({ immediateValue: 2 });
        } catch(err) {
          reject(err);
        }

        Promise.all([statePromise, attachedPromise]).then(() => resolve());
      });
    });

    it('[immediate=true, event=true] should behave correctly', async () => {
      return new Promise(async (resolve, reject) => {
        server.stateManager.registerSchema('immediate-test-2', {
          immediateValue: {
            type: 'integer',
            default: 0,
            immediate: true,
            event: true,
          },
          normalValue: {
            type: 'integer',
            default: 0,
          }
        });

        const state = await clients[0].stateManager.create('immediate-test-2');
        const attached = await clients[1].stateManager.attach('immediate-test-2');

        const statePromise = new Promise((resolve) => {
          let call = 0;

          state.onUpdate(updates => {
            if (call === 0) {
              try {
                assert.deepEqual(updates, { immediateValue: 1 });
              } catch(err) {
                reject(err);
              }
            } else if (call === 1) {
              try {
                assert.deepEqual(updates, { normalValue: 10 });
              } catch(err) {
                reject(err);
              }
            } else if (call === 2) {
              // as it's an event it should be retriggered
              try {
                assert.deepEqual(updates, { immediateValue: 1 });
                resolve();
              } catch(err) {
                reject(err);
              }
            } else {
              reject('creator: something wrong happened');
            }

            call += 1;
          });
        });

        // should be notified normally if not initiator of the update
        const attachedPromise = new Promise((resolve) => {
          let call = 0;

          attached.onUpdate(updates => {
            if (call === 0) {
              try {
                assert.deepEqual(updates, { immediateValue: 1, normalValue: 10 });
                resolve();
              } catch(err) {
                reject(err);
              }
            } else if (call === 1) {
              try {
                assert.deepEqual(updates, { immediateValue: 1 });
                resolve();
              } catch(err) {
                reject(err);
              }
            } else {
              reject('attached: something wrong happened');
            }

            call += 1;
          });
        });

        // invalid value
        try {
          await state.set({ immediateValue: 1, normalValue: 10 });
          // this should not trigger anything
          await state.set({ immediateValue: 1, normalValue: 10 });
        } catch(err) {
          reject(err);
        }

        Promise.all([statePromise, attachedPromise]).then(() => resolve());
      });
    });

    it('[immediate=true, filterChange=false] should behave correctly', async () => {
      return new Promise(async (resolve, reject) => {
        server.stateManager.registerSchema('immediate-test-3', {
          immediateValue: {
            type: 'integer',
            default: 0,
            immediate: true,
            filterChange: false,
          },
          normalValue: {
            type: 'integer',
            default: 0,
          }
        });

        const state = await clients[0].stateManager.create('immediate-test-3');
        const attached = await clients[1].stateManager.attach('immediate-test-3');

        const statePromise = new Promise((resolve) => {
          let call = 0;

          state.onUpdate(updates => {
            if (call === 0) {
              try {
                assert.deepEqual(updates, { immediateValue: 1 });
              } catch(err) {
                reject(err);
              }
            } else if (call === 1) {
              try {
                assert.deepEqual(updates, { normalValue: 10 });
              } catch(err) {
                reject(err);
              }
            } else if (call === 2) {
              // as it's an event it should be retriggered
              try {
                assert.deepEqual(updates, { immediateValue: 1 });
                resolve();
              } catch(err) {
                reject(err);
              }
            } else {
              reject('creator: something wrong happened');
            }

            call += 1;
          });
        });

        // should be notified normally if not initiator of the update
        const attachedPromise = new Promise((resolve) => {
          let call = 0;
          attached.onUpdate(updates => {
            if (call === 0) {
              try {
                assert.deepEqual(updates, { immediateValue: 1, normalValue: 10 });
                resolve();
              } catch(err) {
                reject(err);
              }
            } else if (call === 1) {
              try {
                assert.deepEqual(updates, { immediateValue: 1 });
                resolve();
              } catch(err) {
                reject(err);
              }
            } else {
              reject('attached: something wrong happened');
            }

            call += 1;
          });
        });

        // invalid value
        try {
          await state.set({ immediateValue: 1, normalValue: 10 });
          // this should not trigger anything
          await state.set({ immediateValue: 1, normalValue: 10 });
        } catch(err) {
          reject(err);
        }

        Promise.all([statePromise, attachedPromise]).then(() => resolve());
      });
    });
  });

  describe('await stateManager.attach(schema[, stateId]) => state', () => {
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

    it('should propagate updates to all attached states (client)', async () => {
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
  });

  describe('await state.detach()', () => {
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

  describe('stateManager.deleteSchema(name)', () => {
    it('should call state.onDetach and state.onDelete on all states of its kind', async () => {
      const a0 = await server.stateManager.create('aa');
      const a1 = await server.stateManager.attach('aa', a0.id);
      const b0 = await server.stateManager.create('aa');
      const b1 = await server.stateManager.attach('aa', b0.id);

      return new Promise(async (resolve, reject) => {
        const detachCalled = [false, false, false, false];
        const deleteCalled = [false, false, false, false];

        [a0, a1, b0, b1].forEach((state, index) => {
          state.onDetach(() => detachCalled[index] = true);
          state.onDelete(() => deleteCalled[index] = true);
        });

        server.stateManager.deleteSchema('aa');

        setTimeout(() => {
          assert.deepEqual([true, true, true, true], detachCalled);
          // onDelete is not called on attached state
          assert.deepEqual([true, false, true, false], deleteCalled);
          resolve();
        }, 200);
      });
    });
  });

  describe(`await getCollection()`, () => {
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

      await new Promise(resolve => setTimeout(resolve, 100));

      const ints2 = collection.get('int');
      assert.deepEqual(ints2, [21]);

      await collection.detach();

      assert.equal(collection.length, 0);

      await stateb.delete();
      await stateA1.delete();
    });

    it(`collection should not contain own node state`, async () => {
      const state = await client.stateManager.create('a');
      const collection = await client.stateManager.getCollection('a');

      assert.equal(collection.length, 0);

      await state.delete();
    });

    it(`collection.set(updates, context = null)`, async () => {
      const state = await client.stateManager.create('a');
      const collection = await clients[1].stateManager.getCollection('a');

      const results = await collection.set({ bool: true });
      const expected = [ { bool: true } ];

      assert.deepEqual(expected, results);

      await state.delete();
    });

    it(`collection.onUpdate(callback)`, async () => {
      const state = await client.stateManager.create('a');

      const collection = await clients[1].stateManager.getCollection('a');

      let onUpdateCalled = false;

      collection.onUpdate((s, updates) => {
        onUpdateCalled = true;

        assert.equal(s.get('int'), 42);
        assert.equal(updates.int, 42);
      });

      await state.set({ int: 42 });
      await new Promise(resolve => setTimeout(resolve, 100));

      if (onUpdateCalled === false) {
        assert.fail('onUpdate should have been called');
      }

      await state.delete();
    });

    it(`collection.onAttach(callback)`, async () => {
      const collection = await clients[1].stateManager.getCollection('a');

      let onAttachCalled = false;

      collection.onAttach((s) => {
        onAttachCalled = true;
      });

      const state = await client.stateManager.create('a');

      await new Promise(resolve => setTimeout(resolve, 100));

      await state.delete();

      if (onAttachCalled === false) {
        assert.fail('onAttach should have been called');
      }
    });

    it(`collection.onDetach(callback)`, async () => {
      const state = await client.stateManager.create('a');
      const collection = await clients[1].stateManager.getCollection('a');

      let onDetachCalled = false;

      collection.onDetach((s) => {
        onDetachCalled = true;
      });

      await state.delete();

      await new Promise(resolve => setTimeout(resolve, 100));

      if (onDetachCalled === false) {
        assert.fail('onDetach should have been called');
      }
    });

    // this tends to show a bug
    it.skip(`collection [Symbol.iterator]`, async () => {
      const state = await client.stateManager.create('a');
      const collection = await clients[1].stateManager.getCollection('a');

      let size = 0;

      for (let state of collection) {
        size += 1;
      }

      await assert.equal(size, 1);
    });
  });

  describe('stateManager.registerUpdateHook(schemaName, updateHook)', () => {
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
      const hClient = await clients[0].stateManager.attach('hooked');

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

  describe('WebSocket transport', () => {
    it('should work properly with async transport - brute force testing', async function() {
      this.timeout(5 * 1000);

      console.time('  + brute force time');
      const global = await server.stateManager.create('a');
      const attached = [];

      for (let [index, client] of clients.entries()) {
        const state = await client.stateManager.attach('a', global.id);
        attached[index] = state;
      }

      // propagate value from server
      attached.forEach(state => {
        const expected = { int: 1 };
        const unsubscribe = state.onUpdate(values => {
          assert.deepEqual(values, expected);
          expected.int += 1;
          if (values.int === 100) {
            unsubscribe();
          }
        });
      });

      for (let i = 1; i <= 100; i++) {
        await global.set({ int: i });
      }

      // proagate value from clients
      attached.forEach(state => {
        const expected = { int: 1 };
        const unsubscribe = state.onUpdate(values => {
          assert.deepEqual(values, expected);
          expected.int += 1;
          if (values.int === 100) {
            unsubscribe();
          }
        });
      });

      for (let i = 1; i <= 100; i++) {
        const clientState = attached[Math.floor(Math.random() * attached.length)]
        await clientState.set({ int: i });
      }

      const detachCalled = new Array(100);
      const deleteCalled = new Array(100);
      detachCalled.fill(false);
      deleteCalled.fill(false);

      attached.forEach((state, index) => {
        state.onDetach(() => detachCalled[index] = true);
        // onDelete is not called on attached states
        state.onDelete(() => deleteCalled[index] = true);
      });

      // detach half clients and update
      for (let [index, state] of attached.entries()) {
        if (index >= 50) {
          await state.detach();
        }

        const expected = { int: 1 };
        const unsubscribe = state.onUpdate(values => {
          if (index < 50) {
            assert.deepEqual(values, expected);
            expected.int += 1;

            if (values.int === 100) {
              unsubscribe();
            }
          } else {
            console.log(index)
            assert.fail(`should be detached`);
          }
        });
      }

      detachCalled.forEach((value, index) => assert.equal(value, index >= 50));

      for (let i = 1; i <= 100; i++) {
        await global.set({ int: i });
      }

      await global.detach();
      console.timeEnd('  + brute force time');
      // wait for message propagation
      await delay(100);

      detachCalled.forEach((value, index) => assert.equal(value, true));
      deleteCalled.forEach((value, index) => assert.equal(value, false));
    });

    it(`should keep message order in case of modification by the server in the subscribe callback (1)`, async () => {
      return new Promise(async (resolve, reject) => {
        const messages = [
          { int: 11 },
          { int: 12 },
        ];

        const state = await client.stateManager.create('a');
        const attached = await server.stateManager.attach('a', state.id);

        let messageIndex = 0;
        state.onUpdate(values => {
          assert.deepEqual(values, messages[messageIndex]);
          messageIndex += 1;

          if (messageIndex === 2) {
            resolve();
          }
        });

        attached.onUpdate(values => {
          if (values.int === messages[0].int) {
            attached.set(messages[1]);
          }
        });

        state.set(messages[0]);
      });
    });

    it(`should keep message order in case of modification by the server in the subscribe callback (2)`, async () => {
      return new Promise(async (resolve, reject) => {
        const messages = [
          { int: 11 },
          { int: 12 },
        ];

        const state = await server.stateManager.create('a');
        const attached = await client.stateManager.attach('a', state.id);

        let messageIndex = 0;
        attached.onUpdate(values => {
          assert.deepEqual(values, messages[messageIndex]);
          messageIndex += 1;

          if (messageIndex === 2) {
            resolve();
          }
        });

        state.onUpdate(values => {
          if (values.int === messages[0].int) {
            state.set(messages[1]);
          }
        });

        state.set(messages[0]);
      });
    });

    it(`should keep message order in case of modification by the server in the subscribe callback (3)`, async () => {
      return new Promise(async (resolve, reject) => {
        const messages = [
          { int: 11 },
          { int: 12 },
        ];

        const state = await server.stateManager.create('a');
        const attached = await client.stateManager.attach('a', state.id);

        let messageIndex = 0;

        attached.onUpdate(values => {
          assert.deepEqual(values, messages[messageIndex]);
          messageIndex += 1;

          if (messageIndex === 2) {
            resolve();
          }
        });

        state.onUpdate(values => {
          if (values.int === messages[0].int) {
            state.set(messages[1]);
          }
        });

        attached.set(messages[0]);
      });
    });
  });

  // Regression Test
  // when min and max are explicitely set to Infinity values, the schema is stringified
  // when sent over the network, provoking Infinity to be transformed to `null`
  //
  // JSON.parse({ a: Infinity });
  // > { "a": null }
  describe(`integer and floats min and max`, () => {

    it(`[integer type] should properly set boundaries and propagate values when min and max are manually set to Infinity`, async function() {
      this.timeout(5 * 1000);

      const schema = {
        myInt: {
          type: 'integer',
          min: -Infinity,
          max: Infinity,
          default: 0,
        },
      };

      server.stateManager.registerSchema('test-integer', schema);

      const serverInteger = await server.stateManager.create('test-integer');
      const serverResult = [];

      serverInteger.onUpdate(updates => serverResult.push(updates.myInt));

      const clientInteger = await client.stateManager.attach('test-integer');
      const clientResult = [];

      clientInteger.onUpdate(updates => clientResult.push(updates.myInt));

      for (let i = 0; i < 10; i++) {
        await serverInteger.set({ myInt: Math.floor(Math.random() * 1000) });
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      for (let i = 0; i < 10; i++) {
        await clientInteger.set({ myInt: Math.floor(Math.random() * 1000) });
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      assert.deepEqual(clientResult, serverResult);

      let { min, max } = clientInteger.getSchema('myInt');
      assert.equal(min, -Infinity);
      assert.equal(max, Infinity);
    });

    it(`[float type] should properly set boundaries and propagate values when min and max are manually set to Infinity`, async function() {
      this.timeout(5 * 1000);

      const schema = {
        myFloat: {
          type: 'float',
          min: -Infinity,
          max: Infinity,
          default: 0,
        },
      };

      server.stateManager.registerSchema('test-float', schema);

      const serverInteger = await server.stateManager.create('test-float');
      const serverResult = [];

      serverInteger.onUpdate(updates => serverResult.push(updates.myFloat));

      const clientFloat = await client.stateManager.attach('test-float');
      const clientResult = [];

      clientFloat.onUpdate(updates => clientResult.push(updates.myFloat));

      for (let i = 0; i < 10; i++) {
        await serverInteger.set({ myFloat: Math.random() });
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      for (let i = 0; i < 10; i++) {
        await clientFloat.set({ myFloat: Math.random() });
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      assert.deepEqual(clientResult, serverResult);

      let { min, max } = clientFloat.getSchema('myFloat');
      assert.equal(min, -Infinity);
      assert.equal(max, Infinity);
    });
  });

  // describe(`concurrency/order issue between attach and update notification, cf. #18`, () => {
  //   it(`should do things in the right order...`, async function() {
  //     this.timeout(5 * 1000);

  //     const schema = { a: { type: 'boolean', default: false } };
  //     server.stateManager.registerSchema('test-concurrency', schema);

  //     const unobserve = server.stateManager.observe(async (schemaName, stateId, nodeId) => {
  //       const state = await server.stateManager.attach(schemaName, stateId, nodeId);
  //       await state.set({ a: true });
  //     });

  //     let count = 0;

  //     for (let client of clients) {
  //       const state = await client.stateManager.create('test-concurrency');
  //       // const rand = parseInt(Math.random() * 100000);
  //       // console.time(rand);
  //       assert.deepEqual(state.getValues(), { a: false });

  //       state.onUpdate(updates => {
  //         // console.timeEnd(rand);
  //         assert.deepEqual(state.getValues(), { a: true });
  //         count += 1;
  //       });
  //     }

  //     await new Promise(resolve => setTimeout(resolve, 100));
  //     assert.equal(count, clients.length);
  //   });
  // });

  describe(`stateManager quick requests`, async () => {

    ['server', 'client'].forEach( s => {
      it(`${s} should be able to quickly create states (await)`, async () => {
        let source = (s === 'server' ? server : client);
        const states = [];
        for(let s = 0; s < 3; ++s) {
          const state = await source.stateManager.create('a', { int: s } );
          states.push(state);
        }
      });

      it(`${s} should be able to quickly create states (no await)`, async () => {
        let source = (s === 'server' ? server : client);
        const states = [];
        for(let s = 0; s < 3; ++s) {
          // no await
          const state = source.stateManager.create('a', { int: s } );
          states.push(state);
        }
        await Promise.all(states);
      });

      it(`${s} should be able to quickly create states (await), then delete them (await)`, async () => {
        let source = (s === 'server' ? server : client);
        const states = [];
        for(let s = 0; s < 3; ++s) {
          const state = await source.stateManager.create('a', { int: s } );
          states.push(state);
        }

        states.forEach( async (state) => {
          await state.delete();
        });

      });

      it(`${s} should be able to quickly create states (no await), then delete them (no await)`, async () => {
        let source = (s === 'server' ? server : client);
        const states = [];
        for(let s = 0; s < 3; ++s) {
          // no await
          const state = source.stateManager.create('a', { int: s } );
          states.push(state);
        }

        const deletions = [];
        states.forEach((state) => {
          deletions.push(state.then(s => s.delete() ) );
        });

        await Promise.all(deletions);
      });

      // client seem to fail except on last run
      it(`again, ${s} should be able to quickly create states (no await), then delete them (no await)`, async () => {
        let source = (s === 'server' ? server : client);
        const states = [];
        for(let s = 0; s < 3; ++s) {
          // no await
          const state = source.stateManager.create('a', { int: s } );
          states.push(state);
        }

        const deletions = [];
        states.forEach((state) => {
          deletions.push(state.then(s => s.delete() ) );
        });

        await Promise.all(deletions);
      });



    });


  }); // source: server or client


}); // quick state create and deletion

