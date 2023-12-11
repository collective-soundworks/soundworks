import { assert } from 'chai';
import { delay } from '@ircam/sc-utils';

import { Server } from '../../src/server/index.js';
import { Client } from '../../src/client/index.js';
import {
  OBSERVE_RESPONSE,
  OBSERVE_NOTIFICATION,
} from '../../src/common/constants.js';

import config from '../utils/config.js';
import { a } from '../utils/schemas.js';

describe('# schema options', () => {
  let server;
  let client1;
  let client2;

  before(async () => {
    // ---------------------------------------------------
    // server
    // ---------------------------------------------------
    server = new Server(config);
    server.stateManager.registerSchema('a', a);
    // server.stateManager.registerSchema('b', b);

    await server.start();

    // ---------------------------------------------------
    // clients
    // ---------------------------------------------------
    client1 = new Client({ role: 'test', ...config });
    await client1.start();

    client2 = new Client({ role: 'test', ...config });
    await client2.start();
  });

  after(async function() {
    server.stop();
  });

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
      const clientState = await client1.stateManager.attach('event-test');
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

      const state = await client1.stateManager.create('immediate-test');
      const attached = await client2.stateManager.attach('immediate-test');

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

      const state = await client1.stateManager.create('immediate-test-2');
      const attached = await client2.stateManager.attach('immediate-test-2');

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

      const state = await client1.stateManager.create('immediate-test-3');
      const attached = await client2.stateManager.attach('immediate-test-3');

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

  // Regression Test
  // when min and max are explicitely set to Infinity values, the schema is stringified
  // when sent over the network, provoking Infinity to be transformed to `null`
  //
  // JSON.parse({ a: Infinity });
  // > { "a": null }
  describe(`## Regression tests: integer and floats min and max`, () => {

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

      const clientInteger = await client1.stateManager.attach('test-integer');
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

      const clientFloat = await client1.stateManager.attach('test-float');
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
});
