import fs from 'node:fs';
import path from 'node:path';
import * as url from 'node:url';

import { delay } from '@ircam/sc-utils';
import { assert } from 'chai';
import dotenv from 'dotenv';
import merge from 'lodash.merge';
import tcpp from 'tcp-ping';

import { Server, ServerContext } from '../../src/server/index.js';
import { Client } from '../../src/client/index.js';

import {
  kServerOnStatusChangeCallbacks,
  kServerApplicationTemplateOptions,
} from '../../src/server/Server.js';

import config from '../utils/config.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

describe('# server::Server', () => {
  describe(`## new Server(config)`, () => {
    it(`should throw if invalid config object`, () => {

      let errored = false;
      try {
        const server = new Server();
      } catch (err) {
        console.log(err.message);
        errored = true;
      }
      if (!errored) {
        assert.fail('should have thrown');
      }
    });

    it(`should throw if no client(s) defined in config`, () => {
      const wrongConfig = merge({}, config);
      wrongConfig.app.clients = {};

      let errored = false;
      try {
        const server = new Server(wrongConfig);
      } catch (err) {
        console.log(err.message);
        errored = true;
      }
      if (!errored) {
        assert.fail('should have thrown');
      }
    });

    it(`should throw if httpsInfos is not null or object`, () => {
      const wrongConfig = merge({}, config);
      wrongConfig.env.useHttps = true;
      wrongConfig.env.httpsInfos = 42;

      let errored = false;
      try {
        const server = new Server(wrongConfig);
      } catch (err) {
        console.log(err.message);
        errored = true;
      }
      if (!errored) {
        assert.fail('should have thrown');
      }
    });

    it(`should throw if httpsInfos is badly formatted`, () => {
      const wrongConfig = merge({}, config);
      wrongConfig.env.useHttps = true;
      wrongConfig.env.httpsInfos = { cert: 'dummy' };

      let errored = false;
      try {
        const server = new Server(wrongConfig);
      } catch (err) {
        console.log(err.message);
        errored = true;
      }
      if (!errored) {
        assert.fail('should have thrown');
      }
    });

    it(`should throw if httpsInfos.cert does not exists`, () => {
      const wrongConfig = merge({}, config);
      wrongConfig.env.useHttps = true;
      wrongConfig.env.httpsInfos = { cert: 'dummy.pem', key: 'dummy.pem' };

      let errored = false;
      try {
        const server = new Server(wrongConfig);
      } catch (err) {
        console.log(err.message);
        errored = true;
      }
      if (!errored) {
        assert.fail('should have thrown');
      }
    });

    it(`should throw if httpsInfos.key does not exists`, () => {
      const wrongConfig = merge({}, config);
      wrongConfig.env.useHttps = true;
      wrongConfig.env.httpsInfos = { cert: __filename, key: 'dummy.pem' };

      let errored = false;
      try {
        const server = new Server(wrongConfig);
      } catch (err) {
        console.log(err.message);
        errored = true;
      }
      if (!errored) {
        assert.fail('should have thrown');
      }
    });
  });

  describe(`## await server.init()`, () => {
    it('should throw if browser client is declared and `setDefaultTemplateConfig` or `setCustomTemplateConfig` have not been called', async () => {
      const browserConfig = merge({}, config);
      browserConfig.app.clients.hello = { target: 'browser' };

      const server = new Server(browserConfig);

      let errored = false;
      try {
        await server.init();
      } catch(err) {
        errored = true;
        console.log(err.message);
      }
      if (!errored) { assert.fail('should have thrown'); }
    });

    it(`should throw if invalid https cert file given`, async () => {
      const envPathname = path.join(__dirname, '.env');

      if (!fs.existsSync(envPathname)) {
        assert.ok('no .env file, skip this test');
        return;
      }

      const envBuffer = fs.readFileSync(envPathname);
      const env = dotenv.parse(envBuffer);

      const wrongConfig = merge({}, config);
      wrongConfig.env.useHttps = true;
      wrongConfig.env.httpsInfos = {
        cert: __filename, // this is an invalid cert file
        key: env.HTTPS_KEY,
      };

      const server = new Server(wrongConfig);

      let errored = false;
      try {
        await server.init();
      } catch(err) {
        errored = true;
        console.log(err.message);
      }
      if (!errored) { assert.fail('should have thrown'); }
    });

    it(`should throw if invalid https key file given`, async () => {
      const envPathname = path.join(__dirname, '.env');

      if (!fs.existsSync(envPathname)) {
        assert.ok('no .env file, skip this test');
        return;
      }

      const envBuffer = fs.readFileSync(envPathname);
      const env = dotenv.parse(envBuffer);

      const wrongConfig = merge({}, config);
      wrongConfig.env.useHttps = true;
      wrongConfig.env.httpsInfos = {
        cert: env.HTTPS_CERT,
        key: __filename, // this is invalid
      };

      const server = new Server(wrongConfig);

      let errored = false;
      try {
        await server.init();
      } catch(err) {
        errored = true;
        console.log(err.message);
      }
      if (!errored) { assert.fail('should have thrown'); }
    });

    it(`should use self-signed certificates if both cert and key file are null`, async () => {
      const selfSignedConfig = merge({}, config);
      selfSignedConfig.env.useHttps = true;
      selfSignedConfig.env.httpsInfos = {
        cert: null,
        key: null, // this is invalid
      };

      const server = new Server(selfSignedConfig);
      await server.init();
    });

    it(`should store self-signed certificated in db`, async () => {
      // these test crash the CI for some reason,just ignore them in CI too
      const envPathname = path.join(__dirname, '.env');

      if (!fs.existsSync(envPathname)) {
        assert.ok('no .env file, skip this test');
        return;
      }

      const selfSignedConfig = merge({}, config);
      selfSignedConfig.env.useHttps = true;

      const server = new Server(selfSignedConfig);
      await server.init();

      const cert = await server.db.get('httpsCert');
      const key = await server.db.get('httpsKey');

      assert.isDefined(cert);
      assert.isDefined(key);
    });

    //
    // NOTE:
    // the subsequent tests will exit early if the `.env` file is not found in the
    // tests directory, making it work should be straightforward reading the code...
    //
    it(`should get infos about valid certificates`, async () => {
      const envPathname = path.join(__dirname, '.env');

      if (!fs.existsSync(envPathname)) {
        assert.ok('no .env file, skip this test');
        return;
      }

      const envBuffer = fs.readFileSync(envPathname);
      const env = dotenv.parse(envBuffer);

      const httpsConfig = merge({}, config);
      httpsConfig.env.useHttps = true;
      httpsConfig.env.httpsInfos = {
        key: env.HTTPS_KEY,
        cert: env.HTTPS_CERT,
      };

      const server = new Server(httpsConfig);
      await server.init();

      assert.notEqual(server.httpsInfos, null);
      assert.equal(server.httpsInfos.selfSigned, false);
      assert.isDefined(server.httpsInfos.validFrom);
      assert.isDefined(server.httpsInfos.validTo);
      assert.isDefined(server.httpsInfos.isValid);
    });

    it(`should get infos about self-signed certificates`, async () => {
      // these test crash the CI for some reason,just ignore them in CI too
      const envPathname = path.join(__dirname, '.env');

      if (!fs.existsSync(envPathname)) {
        assert.ok('no .env file, skip this test');
        return;
      }

      const httpsConfig = merge({}, config);
      httpsConfig.env.useHttps = true;
      httpsConfig.env.httpsInfos = null;

      const server = new Server(httpsConfig);
      await server.init();

      assert.notEqual(server.httpsInfos, null);
      assert.equal(server.httpsInfos.selfSigned, true);
      assert.isUndefined(server.httpsInfos.validFrom);
      assert.isUndefined(server.httpsInfos.validTo);
      assert.isUndefined(server.httpsInfos.isValid);
    });
  });

  describe(`## await server.start()`, () => {
    it(`should launch the server (http)`, async () => {
      const server = new Server(config);
      await server.init();
      await server.start();

      return new Promise((resolve, reject) => {
        tcpp.probe('127.0.0.1', config.env.port, async function(err, available) {
          if (err) {
            console.log(err);
            return;
          }

          if (available) {
            assert.ok('server is responding');
          } else {
            assert.fail('server not responding');
          }

          await server.stop();
          resolve();
        });
      });
    });

    it(`should launch the server (self-signed https)`, async () => {
      // these test crash the CI for some reason,just ignore them in CI too
      const envPathname = path.join(__dirname, '.env');

      if (!fs.existsSync(envPathname)) {
        assert.ok('no .env file, skip this test');
        return;
      }

      const selfSignedConfig = merge({}, config);
      selfSignedConfig.env.useHttps = true;

      const server = new Server(selfSignedConfig);
      await server.init();
      await server.start();

      return new Promise((resolve, reject) => {
        tcpp.probe('127.0.0.1', config.env.port, async function(err, available) {
          if (err) {
            console.log(err);
            return;
          }

          if (available) {
            assert.ok('server is responding');
          } else {
            assert.fail('server not responding');
          }

          await server.stop();
          resolve();
        });
      });
    });

    //
    // NOTE:
    // the subsequent tests will exit early if the `.env` file is not found in the
    // tests directory, making it work should be straightforward reading the code...
    //
    it(`should launch the server (valid https)`, async () => {
      const envPathname = path.join(__dirname, '.env');

      if (!fs.existsSync(envPathname)) {
        assert.ok('no .env file, skip this test');
        return;
      }

      const envBuffer = fs.readFileSync(envPathname);
      const env = dotenv.parse(envBuffer);

      const httpsConfigs = merge({}, config);
      httpsConfigs.env.useHttps = true;
      httpsConfigs.env.httpsInfos = {
        cert: env.HTTPS_CERT,
        key: env.HTTPS_KEY,
      };

      const server = new Server(httpsConfigs);
      await server.init();
      await server.start();

      return new Promise((resolve, reject) => {
        tcpp.probe('127.0.0.1', config.env.port, async function(err, available) {
          if (err) {
            console.log(err);
            return;
          }

          if (available) {
            assert.ok('server is responding');
          } else {
            assert.fail('server not responding');
          }

          await server.stop();
          resolve();
        });
      });
    });
  });

  describe('## await server.stop()', () => {
    it('should throw if stop() is called before start()', async () => {
      const server = new Server(config);

      await server.init();

      let errored = false;
      try {
        await server.stop();
      } catch(err) {
        console.log(err.message);
        errored = true;
      }
      if (!errored) { assert.fail('should have failed'); }
    });

    it('should stop the server', async () => {
      const server = new Server(config);

      await server.init();
      await server.start();
      await server.stop();
      assert.isOk('server and process should stop');
    });

    // this will stop after a timeout
    it('should stop the server even if a client is connected', async() => {
      const server = new Server(config);

      await server.init();
      await server.start();

      const client = new Client({ role: 'test', ...config });
      await client.init();
      await client.start();

      await server.stop();
      assert.isOk('server and process should stop');
    });

    it(`should stop the contexts first and then the plugins`, async () => {
      let counter = 0;
      let pluginStop = false;
      let contextStop = false;

      const server = new Server(config);
      server.pluginManager.register('test-plugin', Plugin => {
        return class TestPlugin extends Plugin {
          async start() {
            await super.start();
            // just check that we are ok with that, and that we are not stuck
            // with some on-going processcf. sync
            this._intervalId = setInterval(() => {}, 500);
          }
          // should be called after context.stop()
          async stop() {
            await super.stop();

            clearInterval(this._intervalId);

            counter += 1;
            pluginStop = true;
            assert.equal(counter, 2);
          }
        }
      });
      await server.init();

      class ServerTestContext extends ServerContext {
        get name() { return 'test-context'; }
        // should be called first
        async stop() {
          await super.stop();

          counter += 1;
          contextStop = true;
          assert.equal(counter, 1);
        }
      }
      const serverTestContext = new ServerTestContext(server, 'test');

      // we call start after creating the context, so it is started
      await server.start();
      await server.stop();

      assert.equal(contextStop, true);
      assert.equal(pluginStop, true);
    });
  });

  describe('## server.onStatusChange(state => {}) - state: (inited, started, stopped)', () => {
    let server;

    before(async () => {
      server = new Server(config);
    });

    it('should cleanly add and remove listeners', () => {
      const unsubscribe = server.onStatusChange(async () => {});
      unsubscribe();

      assert.equal(server[kServerOnStatusChangeCallbacks].size, 0)
    });

    it('should receive "inited" events', async () => {
      let counter = 0;

      const callback1 = async (status) => {
        await new Promise(resolve => setTimeout(resolve, 50));
        if (status === 'inited') {
          assert.equal(counter, 0);
        }
        counter++;
      }

      const callback2 = async (status) => {
        await new Promise(resolve => setTimeout(resolve, 100));
        if (status === 'inited') {
          assert.equal(counter, 1);
        }
        counter++;
      }

      const unsubscribe1 = server.onStatusChange(callback1);
      const unsubscribe2 = server.onStatusChange(callback2);

      await server.init();
      // assert await resolves after all callbacks
      assert.equal(counter, 2);

      unsubscribe1();
      unsubscribe2();
    });

    it('should receive "started" events', async () => {
      let counter = 0;

      const callback1 = async (status) => {
        await new Promise(resolve => setTimeout(resolve, 50));
        if (status === 'started') {
          assert.equal(counter, 0);
        }
        counter++;
      }

      const callback2 = async (status) => {
        await new Promise(resolve => setTimeout(resolve, 100));
        if (status === 'started') {
          assert.equal(counter, 1);
        }
        counter++;
      }

      const unsubscribe1 = server.onStatusChange(callback1);
      const unsubscribe2 = server.onStatusChange(callback2);

      await server.start();
      // assert await resolves after all callbacks
      assert.equal(counter, 2);

      unsubscribe1();
      unsubscribe2();
    });

    it('should receive "stopped" events', async () => {
      let counter = 0;

      const callback1 = async (status) => {
        await new Promise(resolve => setTimeout(resolve, 50));
        if (status === 'stopped') {
          assert.equal(counter, 0);
        }
        counter++;
      }

      const callback2 = async (status) => {
        await new Promise(resolve => setTimeout(resolve, 100));
        if (status === 'stopped') {
          assert.equal(counter, 1);
        }
        counter++;
      }

      const unsubscribe1 = server.onStatusChange(callback1);
      const unsubscribe2 = server.onStatusChange(callback2);

      await server.stop();
      // assert await resolves after all callbacks
      assert.equal(counter, 2);

      unsubscribe1();
      unsubscribe2();
    });
  });

  describe(`## server.useDefaultApplicationTemplate()`, () => {
    it(`should populate server[kServerApplicationTemplateOptions]`, () => {
      const server = new Server(config);
      server.useDefaultApplicationTemplate();

      assert.notEqual(server[kServerApplicationTemplateOptions].templateEngine, null);
      assert.notEqual(server[kServerApplicationTemplateOptions].templatePath, null);
      assert.notEqual(server[kServerApplicationTemplateOptions].clientConfigFunction, null);
    });
  });

  describe(`## server.setCustomApplicationTemplateOptions(options)`, () => {
    it(`should override server[kServerApplicationTemplateOptions]`, () => {
      const server = new Server(config);
      server.useDefaultApplicationTemplate();
      // returns the config to be sent to the client
      const clientConfigFunction = (role, config, httpRequest) => {
        return {
          role: role,
          app: {
            name: config.app.name,
            author: config.app.author,
          },
          env: {
            type: config.env.type,
            websockets: config.env.websockets,
            subpath: config.env.subpath,
          },
          additionnalInfos: 42
        }
      }

      server.setCustomApplicationTemplateOptions({ clientConfigFunction });

      assert.notEqual(server[kServerApplicationTemplateOptions].templateEngine, null);
      assert.notEqual(server[kServerApplicationTemplateOptions].templatePath, null);
      assert.equal(server[kServerApplicationTemplateOptions].clientConfigFunction, clientConfigFunction);
    });
  });

  describe(`## server.getAuditState()`, () => {
    it(`should throw if called before init`, async () => {
      const server = new Server(config);

      let errored = false;
      try {
        await server.getAuditState();
      } catch(err) {
        console.log(err.message);
        errored = true;
      }

      if (!errored) {
        assert.fail('should throw');
      }
    });

    it(`should track number of connected clients`, async () => {
      const server = new Server(config);
      await server.start();

      const auditState = await server.getAuditState();

      {
        const numClients = auditState.get('numClients');
        assert.equal(numClients.test, 0);
      }

      const client = new Client({ role: 'test', ...config });
      await client.start();

      {
        const numClients = auditState.get('numClients');
        assert.equal(numClients.test, 1);
      }

      await client.stop();
      // wait for the server to clean things
      await new Promise(resolve => setTimeout(resolve, 50));

      {
        const numClients = auditState.get('numClients');
        assert.equal(numClients.test, 0);
      }

      // await auditState.delete();
      await server.stop();
      console.log('server stopped');
    });
  });

  describe(`## server.onClientConnect(func)`, () => {
    it(`should be called`, async () => {
      const server = new Server(config);
      await server.start();

      let onConnectCalled = false;
      let onConnectClientId = null;

      server.onClientConnect(client => {
        onConnectCalled = true;
        onConnectClientId = client.id;
      });

      const client = new Client({ role: 'test', ...config });
      await client.start();

      await delay(20);

      assert.equal(onConnectCalled, true);
      assert.equal(onConnectClientId, client.id);

      await client.stop();
      await server.stop();
    });
  });

  describe(`## server.onClientDisconnect(func)`, () => {
    it(`should be called`, async () => {
      const server = new Server(config);
      await server.start();

      let onDisconnectCalled = false;
      let onDisconnectClientId = null;

      server.onClientDisconnect(client => {
        onDisconnectCalled = true;
        onDisconnectClientId = client.id;
      });

      const client = new Client({ role: 'test', ...config });
      await client.start();
      await client.stop();

      await delay(20);

      assert.equal(onDisconnectCalled, true);
      assert.equal(onDisconnectClientId, client.id);

      await server.stop();
    });
  });
});
