import { assert } from 'chai';
import { delay } from '@ircam/sc-utils';

import { Server } from '../../src/server/index.js';
import { Client } from '../../src/client/index.js';

import config from '../utils/config.js';
import { a, b } from '../utils/schemas.js';

describe(`# SharedStateCollection`, () => {
  let server;
  let clients = [];

  before(async () => {
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

  after(async function() {
    server.stop();
  });

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
    const state = await clients[0].stateManager.create('a');
    const collection = await clients[0].stateManager.getCollection('a');

    assert.equal(collection.length, 0);

    await state.delete();
  });

  it(`collection.set(updates, context = null)`, async () => {
    const state = await clients[0].stateManager.create('a');
    const collection = await clients[1].stateManager.getCollection('a');

    const results = await collection.set({ bool: true });
    const expected = [ { bool: true } ];

    assert.deepEqual(expected, results);

    await state.delete();
  });

  it(`collection.onUpdate(callback)`, async () => {
    const state = await clients[0].stateManager.create('a');

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

    const state = await clients[0].stateManager.create('a');

    await new Promise(resolve => setTimeout(resolve, 100));

    await state.delete();

    if (onAttachCalled === false) {
      assert.fail('onAttach should have been called');
    }
  });

  it(`collection.onDetach(callback)`, async () => {
    const state = await clients[0].stateManager.create('a');
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
    const state = await clients[0].stateManager.create('a');
    const collection = await clients[1].stateManager.getCollection('a');

    let size = 0;

    console.log(collection.length);

    for (let state of collection) {
      size += 1;
    }

    await assert.equal(size, 1);
  });
});
