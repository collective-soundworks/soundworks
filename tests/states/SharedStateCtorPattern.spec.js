import { delay } from '@ircam/sc-utils';
import { assert } from 'chai';

import { Server, SharedState } from '../../src/server/index.js';
import { Client, SharedState as SharedStateServer } from '../../src/client/index.js';
import { BATCHED_TRANSPORT_CHANNEL } from '../../src/common/constants.js';

import config from '../utils/config.js';
import { a, b } from '../utils/class-description.js';

describe('# SharedState', () => {
  let server;
  let client;

  beforeEach(async () => {
    // ---------------------------------------------------
    // server
    // ---------------------------------------------------
    config.env.noInternalState = true; // bypass audit state
    server = new Server(config);
    server.stateManager.defineClass('a', a);
    server.stateManager.defineClass('b', b);
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

  it('Entites should be exposed', () => {
    assert.notEqual(SharedState, undefined);
    assert.notEqual(SharedStateServer, undefined);
  });

  describe(`## constructor()`, () => {
    it('should throw if argument 1 is not Client or Server', () => {
      assert.throws(() => new SharedState({}, 'a'));
    });

    it('should throw if argument 2 is not Client or Server', () => {
      assert.throws(() => new SharedState({}, true));
    });

    it('should create a new SharedState instance (client)', () => {
      const a = new SharedState(client, 'a');
      assert.equal(a instanceof SharedState, true)
    });

    it('should create a new SharedState instance (server)', () => {
      const a = new SharedState(server, 'a');
      assert.equal(a instanceof SharedState, true)
    });

    it('should be backward compatible with `stateManager.create()`', async () => {
      const a = await server.stateManager.create('a');
      assert.deepEqual(a.getValues(), { bool: false, int: 0 });
    });
  });

  describe(`## await create(initValues = {})`, () => {
    it('should create a new SharedState instance (client)', async () => {
      const a = new SharedState(client, 'a');
      await a.create();
      assert.deepEqual(a.getValues(), { bool: false, int: 0 });
    });

    it('should create a new SharedState instance with init value (client)', async () => {
      const a = new SharedState(client, 'a');
      await a.create();
      assert.deepEqual(a.getValues(), { bool: false, int: 0 });
    });
  });

  describe(`## await attach(options)`, () => {
    it('should attach to an existing SharedState instance', async () => {
      const a = new SharedState(server, 'a');
      await a.create();

      const attached = new SharedState(client, 'a');
      await attached.attach();

      assert.equal(a.id, attached.id);
      assert.deepEqual(a.getValues(), { bool: false, int: 0 });
      assert.deepEqual(attached.getValues(), { bool: false, int: 0 });
    });

    it('should attach to an existing SharedState instance with options', async () => {
      const a = new SharedState(server, 'a');
      await a.create();

      const attached = new SharedState(client, 'a');
      await attached.attach({ blackList: ['bool'] });

      assert.equal(a.id, attached.id);
      assert.deepEqual(a.getValues(), { bool: false, int: 0 });
      assert.deepEqual(attached.getValues(), { int: 0 });
    });

    it('should attach to an existing SharedState instance with id and options', async () => {
      const a = new SharedState(server, 'a');
      await a.create();

      const attached = new SharedState(client, 'a');
      await attached.attach(a.id, { blackList: ['bool'] });

      assert.equal(a.id, attached.id);
      assert.deepEqual(a.getValues(), { bool: false, int: 0 });
      assert.deepEqual(attached.getValues(), { int: 0 });
    });
  });
});
