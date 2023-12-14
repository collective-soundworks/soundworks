import { assert } from 'chai';
import { delay } from '@ircam/sc-utils';

import { Server } from '../../src/server/index.js';
import { Client } from '../../src/client/index.js';

import config from '../utils/config.js';
import { a, b } from '../utils/schemas.js';

describe('# SharedStates - Stress test', () => {
  let server;
  let clients = [];
  let client; // clients[0]
  const numClients = 100;

  beforeEach(async () => {
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
  });

  afterEach(async function() {
    server.stop();
  });

  describe('## WebSocket transport', () => {
    it('should work properly with async transport - brute force testing', async function() {
      this.timeout(5 * 1000);

      console.time('      + brute force time');
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
      console.timeEnd('      + brute force time');
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

  describe(`## stateManager quick requests`, async () => {
    ['server', 'client'].forEach(sourceName => {
      it(`${sourceName} should be able to quickly create states (await)`, async () => {
        const source = sourceName === 'server' ? server : client;
        const states = [];

        for (let i = 0; i < 50; ++i) {
          const state = await source.stateManager.create('a', { int: i });
          states.push(state);
        }

        assert.equal(states.length, 50);
      });

      it(`${sourceName} should be able to quickly create states (no await)`, async () => {
        const source = sourceName === 'server' ? server : client;
        const states = [];

        for (let i = 0; i < 50; ++i) {
          // no await
          const state = source.stateManager.create('a', { int: i });
          states.push(state);
        }
        await Promise.all(states);
      });

      it(`${sourceName} should be able to quickly create states (await), then delete them (await)`, async () => {
        const source = sourceName === 'server' ? server : client;
        const states = [];

        for (let i = 0; i < 50; ++i) {
          const state = await source.stateManager.create('a', { int: i });
          states.push(state);
        }

        // warning: `forEach` is not asynchronous
        for (let state of states) {
          await state.delete();
        }
      });

      it(`${sourceName} should be able to quickly create states (no await), then delete them (no await)`, async () => {
        const source = sourceName === 'server' ? server : client;
        const states = [];

        for (let i = 0; i < 50; ++i) {
          // no await
          const state = source.stateManager.create('a', { int: i });
          states.push(state);
        }

        const deletions = [];
        states.forEach((state) => {
          deletions.push(state.then(s => s.delete()));
        });

        await Promise.all(deletions);
      });

      // client seem to fail except on last run
      it(`again, ${sourceName} should be able to quickly create states (no await), then delete them (no await)`, async () => {
        const source = sourceName === 'server' ? server : client;
        const states = [];

        for (let i = 0; i < 50; ++i) {
          // no await
          const state = source.stateManager.create('a', { int: i });
          states.push(state);
        }

        const deletions = [];
        states.forEach((state) => {
          deletions.push(state.then(s => s.delete()));
        });

        await Promise.all(deletions);
      });
    });
  });

  describe(`## StateCollection`, () => {
    it.skip(`brute force test`, async () => {})
  });
});
