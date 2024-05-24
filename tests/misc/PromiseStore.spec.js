import { assert } from 'chai';
import PromiseStore from '../../src/common/PromiseStore.js';
// import { kStateManagerPromiseStore } from '../../src/common/BaseStateManager.js';

import { Server } from '../../src/server/index.js';
import { Client } from '../../src/client/index.js';

import config from '../utils/config.js';
import { a } from '../utils/schemas.js';

describe('# PromiseStore', () => {
  describe('## resolve(reqId)', () => {
    it('should fail with meaningfull error if reqId does not exists', () => {
      const store = new PromiseStore('test');

      let errored = false;

      try {
        store.resolve(null);
      } catch(err) {
        console.log(err.message);
        errored = true;
      }

      if (!errored) {
        assert.fail('should have thrown');
      }
    });
  });

  describe('## reject(reqId)', () => {
    it('should fail with meaningfull error if reqId does not exists', () => {
      const store = new PromiseStore('test');

      let errored = false;

      try {
        store.reject(null);
      } catch(err) {
        console.log(err.message);
        errored = true;
      }

      if (!errored) {
        assert.fail('should have thrown');
      }
    });
  });


  describe(`## MISC`, () => {
    it(`check consistency of PromiseStore in SharedState`, async () => {
      const server = new Server(config);
      server.stateManager.registerSchema('a', a);
      await server.start();

      const client = new Client({ role: 'test', ...config });
      await client.start();

      const state = await client.stateManager.create('a');
      const attached = await client.stateManager.attach('a');

      { // update promise
        const promise = state.set({ bool: true });
        assert.equal(state._promiseStore.store.size, 1);
        assert.equal(attached._promiseStore.store.size, 0);

        await promise;

        assert.equal(state._promiseStore.store.size, 0);
        assert.equal(attached._promiseStore.store.size, 0);
      }

      { // update promise
        const promise = attached.set({ int: 42 });
        assert.equal(state._promiseStore.store.size, 0);
        assert.equal(attached._promiseStore.store.size, 1);

        await promise;

        assert.equal(state._promiseStore.store.size, 0);
        assert.equal(attached._promiseStore.store.size, 0);
      }

      { // update fail promise, fail early, no promise created
        try {
          await state.set({ int: null });
        } catch(err) {
          console.log(err.message);
        }

        assert.equal(state._promiseStore.store.size, 0);
        assert.equal(attached._promiseStore.store.size, 0);
      }

      { // detach request
        const promise = attached.detach();
        assert.equal(state._promiseStore.store.size, 0);
        assert.equal(attached._promiseStore.store.size, 1);

        await promise;

        assert.equal(state._promiseStore.store.size, 0);
        assert.equal(attached._promiseStore.store.size, 0);
      }

      { // detach request
        const promise = state.delete();
        assert.equal(state._promiseStore.store.size, 1);

        await promise;

        assert.equal(state._promiseStore.store.size, 0);
      }

      await server.stop();
    });

    it(`stress test`, async () => {
      const server = new Server(config);
      server.stateManager.registerSchema('a', a);
      await server.start();

      const client = new Client({ role: 'test', ...config });
      await client.start();

      const state = await client.stateManager.create('a');

      const promises = [];
      for (let i = 0; i < 1e4; i++) {
        let promise = state.set({ int: Math.floor(Math.random() * 1e12) });
        assert.equal(state._promiseStore.store.size, i + 1);
        promises.push(promise);
      }

      assert.equal(state._promiseStore.store.size, 1e4);
      await Promise.all(promises);
      assert.equal(state._promiseStore.store.size, 0);

      await server.stop();
    });
  });
});
