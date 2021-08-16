const path = require('path');
const assert = require('chai').assert;

const Server = require('../../server').Server;
const ServerAbstractExperience = require('../../server').AbstractExperience;

const Client = require('../../client').Client;
const ClientAbstractExperience = require('../../client').AbstractExperience;

const config = require('./config');
const a = require('./schemas/a');
const b = require('./schemas/b');
const hookSchema = require('./schemas/hookSchema');

/**
 * NOTE
 * to automatically close the processes (server and clients) when all tests
 * are done, launch with:
 *
 * ```
 * mocha tests/state-manager --exit
 * ```
 */

class ServerTestExperience extends ServerAbstractExperience {
  constructor(server, clientTypes) {
    super(server, clientTypes);
  }
}

class ClientTestExperience extends ClientAbstractExperience {
  constructor(client) {
    super(client);
  }
}

let server;
let clients = [];
const numClients = 100;

before(async () => {
  // ---------------------------------------------------
  // server
  // ---------------------------------------------------
  server = new Server();

  // this is boring... should not be mandatory
  server.templateEngine = { compile: () => {} };
  server.templateDirectory = __dirname;

  await server.init(config);
  server.stateManager.registerSchema('a', a);
  server.stateManager.registerSchema('b', b);
  const serverExperience = new ServerTestExperience(server, 'test');

  await server.start();
  serverExperience.start();

  // ---------------------------------------------------
  // client
  // ---------------------------------------------------
  for (let i = 0; i < numClients; i++) {
    const client = new Client();
    await client.init({
      ...config,
      clientType: 'test',
    });
    // console.log('client inited');
    const clientExperience = new ClientTestExperience(client);

    await client.start();
    clientExperience.start();

    clients[i] = client;
  }

  console.log(`
> created ${numClients} clients
  `);
});

console.log('* ------------------------------------- *');
console.log('* @soundworks/core.StateManager');
console.log('* ------------------------------------- *');

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


describe('stateManager.observe((schemaName, stateId, nodeId) => {}) => unobserve', async () => {
  it(`should be notified of states created on the network`, async () => {
    const client = clients[0];

    await client.stateManager.create('a');

    return new Promise(async (resolve, reject) => {
      let numCalled = 0;
      const unobserve = server.stateManager.observe((schemaName, stateId, nodeId) => {
        assert.isString(schemaName);
        assert.equal(schemaName, 'a');
        assert.isNumber(stateId);
        assert.equal(stateId, numCalled);
        assert.isNumber(nodeId);
        assert.equal(nodeId, client.id);
        numCalled += 1;

        if (numCalled === 2) {
          unobserve();
          resolve();
        }
      });

      await client.stateManager.create('a');
    });
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
  });

  it('should create state with default values', async () => {
    const stateA = await server.stateManager.create('a', {
      bool: true,
      int: 42,
    });

    assert.equal(stateA.get('bool'), true);
    assert.equal(stateA.get('int'), 42);
  });

  it('should create several state of same kind', async () => {
    const a0 = await server.stateManager.create('a');
    const a1 = await server.stateManager.create('a');

    assert.notEqual(a0.id, a1.id);
  });
});

describe('async state.set(updates) => updates', () => {
  it('should return the updated values', async () => {
    const a = await server.stateManager.create('a');
    const updates = { bool: true };
    const result = await a.set(updates);

    assert.deepEqual(result, updates);
    assert.equal(a.get('bool'), true);
  });

  it('should return the update but not keep the value when [event=true]', async() => {
    const a = await server.stateManager.create('a');
    const updates = await a.set({ event: true });
    assert.deepEqual(updates, { event: true });
    assert.equal(a.get('event'), null);
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
  });
});

describe.only('state.subscribe(updates => {}) => unsubscribe', () => {
  it('should be notified with updates when an update is made', async () => {
    const a = await server.stateManager.create('a');

    return new Promise(async (resolve, reject) => {
      a.subscribe(updates => {
        assert.deepEqual(updates, { bool: true });
        resolve();
      });

      await a.set({ bool: true });
    });
  });

  it('default options [event=false, filterChange=true] should behave correctly', async () => {
    const a = await server.stateManager.create('a');
    let counter = 0;

    a.subscribe(updates => {
      assert.deepEqual(updates, { bool: true });
      counter += 1;
    });

    await a.set({ bool: true });
    await a.set({ bool: true });
    await a.set({ bool: true });

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        assert.equal(counter, 1);
        resolve();
      }, 100);
    });
  });

  it('[event=true] should behave correctl', async () => {
    const a = await server.stateManager.create('a');
    const numEvents = 5;
    let counter = 0;

    a.subscribe(updates => {
      assert.deepEqual(updates, { event: true });
      counter += 1;
    });

    let updates;
    for (let i = 0; i < numEvents; i++) {
      updates = await a.set({ event: true });
      // returned updates object has the proper value
      assert.deepEqual(updates, { event: true });
      // but value is null if read from state
      assert.equal(a.get('event'), null);
      updates = null;
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        assert.equal(counter, numEvents);
        resolve();
      }, 100);
    });
  });

  it('[filterChange=false] should behave correctly', async () => {
    const a = await server.stateManager.create('a');
    const numEvents = 5;
    let counter = 0;

    a.subscribe(updates => {
      assert.deepEqual(updates, { doNotFilterChange: true });
      counter += 1;
    });

    for (let i = 0; i < numEvents; i++) {
      await a.set({ doNotFilterChange: true });
      // contrary to `event` the value is still stored into the state
      assert.equal(a.get('doNotFilterChange'), true);
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        assert.equal(counter, numEvents);
        resolve();
      }, 100);
    });
  });

  it(`should return working unsubscribe() function`, async () => {
    const a = await server.stateManager.create('a');

    const unsubsribe = a.subscribe(updates => {
      assert.fail('should not be called')
    });

    unsubsribe();

    await a.set({ int: 1 });

    return new Promise((resolve, reject) => {
      setTimeout(resolve, 100);
    });
  });
});

describe('await stateManager.attach(schema[, stateId]) => state', () => {
  it('should propagate updates to all attached states', async () => {
    const a0 = await server.stateManager.create('a');
    const a1 = await server.stateManager.attach('a', a0.id);
    const a2 = await server.stateManager.attach('a', a0.id);

    return new Promise(async (resolve, reject) => {
      const called = [0, 0, 0];

      [a0, a1, a2].forEach((state, index) => {
        state.subscribe(updates => {
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

      setTimeout(() => {
        assert.equal(called[0], 300);
        assert.equal(called[1], 300);
        assert.equal(called[2], 300);
        resolve();
      }, 200);
    });
  });
});

describe('await state.detach()', () => {
  it('should not receive updates after detach', async () => {
    const a0 = await server.stateManager.create('a');
    const a1 = await server.stateManager.attach('a', a0.id);
    const a2 = await server.stateManager.attach('a', a0.id);

    return new Promise(async (resolve, reject) => {
      a1.subscribe(() => assert.fail('subscribe should not be called'));

      await a1.detach();
      await a0.set({ bool: true });

      assert.equal(a0.get('bool'), true);
      assert.equal(a1.get('bool'), false);
      assert.equal(a2.get('bool'), true); // this one is still attached

      setTimeout(resolve, 200);
    });
  });

  it('should call state.onDetach', async () => {
    const a0 = await server.stateManager.create('a');
    const a1 = await server.stateManager.attach('a', a0.id);

    return new Promise(async (resolve, reject) => {
      a1.onDetach(() => {
        // timeout to see if onDelete is called
        setTimeout(resolve, 100);
      });
      a1.onDelete(() => assert.fail('should call onDelete when not owner'));

      await a1.detach();
    });
  });

  it('should call state.onDetach and state.onDelete if owner', async () => {
    const a = await server.stateManager.create('a');

    return new Promise(async (resolve, reject) => {
      let detachedCalled = false;
      a.onDetach(() => detachedCalled = true);
      a.onDelete(() => {
        assert.equal(detachedCalled, true);
        resolve();
      });

      await a.detach();
    });
  });

  it('should call state.onDetach and state.onDelete on attached states if owner', async () => {
    const a0 = await server.stateManager.create('a');
    const a1 = await server.stateManager.attach('a', a0.id);

    return new Promise(async (resolve, reject) => {
      let detachedCalled = false;
      a1.onDetach(() => detachedCalled = true);
      a1.onDelete(() => {
        assert.equal(detachedCalled, true);
        resolve();
      });

      await a0.detach();
    });
  });

  it('should throw on a second `detach` call', async () => {
    const a = await server.stateManager.create('a');
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
    assert.throws(() => b.detach());
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
        allDetach = detachCalled.reduce((acc, value) => acc && value, true);
        allDelete = deleteCalled.reduce((acc, value) => acc && value, true);

        assert.equal(allDetach, true);
        assert.equal(allDelete, true);
        resolve();
      }, 200);
    });
  });
});

describe('stateManager.setUpdateHook(schemaName, updateHook)', () => {
  it('should execute hook properly', async () => {
    server.stateManager.registerSchema('hooked', hookSchema);
    server.stateManager.registerUpdateHook('hooked', (updates, currentValues) => {
      updates.value = `${updates.name}-value`;
      return updates;
    });

    const hServer = await server.stateManager.create('hooked');
    const hClient = await clients[0].stateManager.attach('hooked');

    const serverPromise = new Promise(resolve => {
      hServer.subscribe(updates => {
        assert.equal(updates.value, `${updates.name}-value`);
        resolve();
      });
    });

    const clientPromise = new Promise(resolve => {
      hClient.subscribe(updates => {
        assert.equal(updates.value, `${updates.name}-value`);
        resolve();
      });
    });

    await hServer.set({ name: 'test' });

    assert.deepEqual(hServer.getValues(), { name: 'test', value: 'test-value' });

    await Promise.all([serverPromise, clientPromise]);
    server.stateManager.deleteSchema('hooked');

    return Promise.resolve();
  });

  it('hook API should be `hook(updates, currentValues)`', async () => {
    return new Promise(async resolve => {
      server.stateManager.registerSchema('hooked', hookSchema);
      server.stateManager.registerUpdateHook('hooked', (updates, currentValues) => {
        assert.deepEqual(updates, { name: 'test' });
        assert.deepEqual(currentValues, { name: null, value: null });
        resolve();
        return updates;
      });

      const h = await server.stateManager.create('hooked');

      await h.set({ name: 'test' });

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

    assert.deepEqual(h1.getValues(), { name: 'test', value: 'test-value' });
    assert.deepEqual(h2.getValues(), { name: null, value: null });

    server.stateManager.deleteSchema('hooked');
    return Promise.resolve();
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
    assert.deepEqual(h.getValues(), { name: 'test', value: 'async-ok' });

    server.stateManager.deleteSchema('hooked');
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
    assert.deepEqual(h.getValues(), { name: 'test', value: 'ok-2' });

    server.stateManager.deleteSchema('hooked');
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

    await h.set({ name: 'test-1' });
    assert.deepEqual(h.getValues(), { name: 'test-1', value: 'ok-2' });

    unregister(); // remove second hook

    await h.set({ name: 'test-2' });
    assert.deepEqual(h.getValues(), { name: 'test-2', value: 'ok-1' });

    server.stateManager.deleteSchema('hooked');
  });
});

describe('WebSocket transport', () => {
  it('should work properly with async transport - brute force testing', async () => {
    const global = await server.stateManager.create('a');
    const attached = [];

    for (let [index, client] of clients.entries()) {
      const state = await client.stateManager.attach('a', global.id);
      attached[index] = state;
    }

    // propagate value from server
    attached.forEach(state => {
      const expected = { int: 1 };
      const unsubscribe = state.subscribe(values => {
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
      const unsubscribe = state.subscribe(values => {
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
      state.onDelete(() => deleteCalled[index] = true);
    });

    // detach half clients and update
    for (let [index, state] of attached.entries()) {
      if (index >= 50) {
        await state.detach();
      }

      const expected = { int: 1 };
      const unsubscribe = state.subscribe(values => {
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

    for (let i = 1; i <= 100; i++) {
      await global.set({ int: i });
    }


    global.detach();

    return new Promise((resolve) => {
      setTimeout(() => {
        detachCalled.forEach(value => assert.equal(value, true));
        deleteCalled.forEach((value, index) => assert.equal(value, index < 50));
        resolve();
      }, 1000);
    });
  });

  it(`should keep message order in case of modification by the server in the subscribe callback (1)`, async () => {
    return new Promise(async (resolve, reject) => {
      const messages = [
        { int: 11 },
        { int: 12 },
      ];

      const client = clients[0];
      const state = await client.stateManager.create('a');
      const attached = await server.stateManager.attach('a', state.id);

      let messageIndex = 0;
      state.subscribe(values => {
        assert.deepEqual(values, messages[messageIndex]);
        messageIndex += 1;

        if (messageIndex === 2) {
          resolve();
        }
      });

      attached.subscribe(values => {
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

      const client = clients[0];
      const state = await server.stateManager.create('a');
      const attached = await client.stateManager.attach('a', state.id);

      let messageIndex = 0;
      attached.subscribe(values => {
        assert.deepEqual(values, messages[messageIndex]);
        messageIndex += 1;

        if (messageIndex === 2) {
          resolve();
        }
      });

      state.subscribe(values => {
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

      const client = clients[0];
      const state = await server.stateManager.create('a');
      const attached = await client.stateManager.attach('a', state.id);

      let messageIndex = 0;

      attached.subscribe(values => {
        assert.deepEqual(values, messages[messageIndex]);
        messageIndex += 1;

        if (messageIndex === 2) {
          resolve();
        }
      });

      state.subscribe(values => {
        if (values.int === messages[0].int) {
          state.set(messages[1]);
        }
      });

      attached.set(messages[0]);
    });
  });
});








