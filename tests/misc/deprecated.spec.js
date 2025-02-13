import { assert } from 'chai';

import { Server } from '../../src/server/index.js';
import { Client } from '../../src/client/index.js';

import config from '../utils/config.js';
import {
  aClassDescription,
  expectedFullClassDescription,
  expectedInstanceFullClassDescription,
} from '../utils/class-description.js';

describe('from v4.0.0-alpha.29', () => {
  describe('# deprecated API', () => {
    it('SharedState#schemaName', async () => {
      const server = new Server(config);
      server.stateManager.defineClass('aClassDescription', aClassDescription);
      await server.start();

      const state = await server.stateManager.create('aClassDescription', { required: true });
      assert.equal(state.className, 'aClassDescription'); // actual
      assert.equal(state.schemaName, 'aClassDescription'); // deprecated
      server.stateManager.deleteClass('aClassDescription');
      await server.stop();
    });

    it('SharedStateCollection#schemaName', async () => {
      const server = new Server(config);
      server.stateManager.defineClass('aClassDescription', aClassDescription);
      await server.start();

      const collection = await server.stateManager.getCollection('aClassDescription');
      assert.equal(collection.className, 'aClassDescription'); // actual
      assert.equal(collection.schemaName, 'aClassDescription'); // deprecated
      server.stateManager.deleteClass('aClassDescription');
      await server.stop();
    });

    it('SharedState#getSchema(name = null)', async () => {
      const server = new Server(config);
      server.stateManager.defineClass('aClassDescription', aClassDescription);
      await server.start();

      const state = await server.stateManager.create('aClassDescription', { required: true });
      assert.deepEqual(state.getDescription(), expectedInstanceFullClassDescription); // actual
      assert.deepEqual(state.getSchema(), expectedInstanceFullClassDescription); // deprecated
      server.stateManager.deleteClass('aClassDescription');
      await server.stop();
    });

    it('SharedStateCollection#getSchema(name = null)', async () => {
      const server = new Server(config);
      server.stateManager.defineClass('aClassDescription', aClassDescription);
      await server.start();

      const collection = await server.stateManager.getCollection('aClassDescription');
      assert.deepEqual(collection.getDescription(), expectedFullClassDescription); // actual
      assert.deepEqual(collection.getSchema(), expectedFullClassDescription); // deprecated
      server.stateManager.deleteClass('aClassDescription');
      await server.stop();
    });

    it('StateManager#getSchema()', async () => {
      const server = new Server(config);
      server.stateManager.defineClass('aClassDescription', aClassDescription);
      await server.start();

      const classDescription = await server.stateManager.getClassDescription('aClassDescription'); // actual
      assert.deepEqual(classDescription, expectedFullClassDescription);

      const schema = await server.stateManager.getSchema('aClassDescription'); // deprecated
      assert.deepEqual(schema, expectedFullClassDescription);

      server.stateManager.deleteClass('aClassDescription');
      await server.stop();
    });

    it('Client#target, ClientDescription#target -> runtime', async () => {
      const config = {
        app: {
          name: 'plugin-manager-test',
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
        }
      };

      const server = new Server(config);
      await server.start();

      const client = new Client({ ...config, role: 'test' });
      await client.start();
      assert.equal(client.runtime, 'node'); // actual
      assert.equal(client.target, 'node'); // deprecated

      await client.stop();
      await server.stop();
    });

    it('ServerEnvConfig#subpath -> baseUrl', async () => {
      const config = {
        app: {
          name: 'plugin-manager-test',
          clients: {
            test: { runtime: 'node' },
          },
        },
        env: {
          type: 'development',
          subpath: 'coucou',
          port: 8081,
          serverAddress: '127.0.0.1',
          useHttps: false,
          verbose: process.env.VERBOSE === '1' ? true : false,
        }
      };

      const server = new Server(config);
      await server.start();

      assert.equal(server.config.env.baseUrl, 'coucou');
      assert.equal(server.config.env.subpath, undefined);

      await server.stop();
    });

    it(`should populate server[kServerApplicationTemplateOptions]`, () => {
      const server = new Server(config);
      server.useDefaultApplicationTemplate();
    });
  });

  describe('# removed API', () => {
    it('SharedState#set(updates, context)', async () => {
      const server = new Server(config);
      server.stateManager.defineClass('aClassDescription', aClassDescription);
      await server.start();

      let errored = false;
      const state = await server.stateManager.create('aClassDescription', { required: true });
      try {
        await state.set({}, {});
      } catch (err) {
        errored = true;
        console.log(err.message);
      }

      assert.isTrue(errored);
      await server.stop();
    });
  });
});
