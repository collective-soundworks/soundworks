const fs = require('fs');
const path = require('path');
const assert = require('chai').assert;

const dotenv = require('dotenv');
const merge = require('lodash.merge');
const tcpp = require('tcp-ping');

const Server = require('../server').Server;
const Client = require('../client').Client;

const config = {
  app: {
    clients: {
      test: { target: 'node' },
    },
  },
  env: {
    type: 'development',
    port: 8081,
    serverIp: '127.0.0.1',
    useHttps: false,
    verbose: process.env.VERBOSE === '1' ? true : false,
  },
};

describe('server::Server', () => {
  describe(`new Server(config)`, () => {
    it(`should throw if invalid config object`, () => {
      try {
        const server = new Server();
        assert.fail('should have thrown if no clients declared');
      } catch (err) {
        console.log(err.message);
        assert.ok('should throw');
      }
    });

    it(`should throw if no client(s) defined in config`, () => {
      const wrongConfig = merge({}, config);
      wrongConfig.app.clients = {};

      try {
        const server = new Server(wrongConfig);
        assert.fail('should have thrown if no clients declared');
      } catch (err) {
        console.log(err.message);
        assert.ok('should throw');
      }
    });

    it(`should throw if httpsInfos is not null or object`, () => {
      const wrongConfig = merge({}, config);
      wrongConfig.env.useHttps = true;
      wrongConfig.env.httpsInfos = 42;

      try {
        const server = new Server(wrongConfig);
        assert.fail('should have thrown if no clients declared');
      } catch (err) {
        console.log(err.message);
        assert.ok('should throw');
      }
    });

    it(`should throw if httpsInfos is badly formatted`, () => {
      const wrongConfig = merge({}, config);
      wrongConfig.env.useHttps = true;
      wrongConfig.env.httpsInfos = { cert: 'dummy' };

      try {
        const server = new Server(wrongConfig);
        assert.fail('should have thrown if no clients declared');
      } catch (err) {
        console.log(err.message);
        assert.ok('should throw');
      }
    });

    it(`should throw if httpsInfos.cert does not exists`, () => {
      const wrongConfig = merge({}, config);
      wrongConfig.env.useHttps = true;
      wrongConfig.env.httpsInfos = { cert: 'dummy.pem', key: 'dummy.pem' };

      try {
        const server = new Server(wrongConfig);
        assert.fail('should have thrown if no clients declared');
      } catch (err) {
        console.log(err.message);
        assert.ok('should throw');
      }
    });

    it(`should throw if httpsInfos.key does not exists`, () => {
      const wrongConfig = merge({}, config);
      wrongConfig.env.useHttps = true;
      wrongConfig.env.httpsInfos = { cert: __filename, key: 'dummy.pem' };

      try {
        const server = new Server(wrongConfig);
        assert.fail('should have thrown if no clients declared');
      } catch (err) {
        console.log(err.message);
        assert.ok('should throw');
      }
    });
  });

  describe(`await server.init()`, () => {
    it('should throw if browser client is declared and `setDefaultTemplateConfig` or `setCustomTemplateConfig` have not been called', async () => {
      const browserConfig = merge({}, config);
      browserConfig.app.clients.hello = { target: 'browser' };

      const server = new Server(browserConfig);

      try {
        await server.init();
        assert.fail('should throw');
      } catch(err) {
        console.log(err.message);
        assert.ok('should require some template config');
      }
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
        cert: __filename, // this is invalid
        key: env.HTTPS_KEY,
      };

      const server = new Server(wrongConfig);

      try {
        await server.init();
        assert.fail('should have thrown');
      } catch (err) {
        console.log(err.message);
        assert.ok('should throw');
      }
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

      try {
        await server.init();
        assert.fail('should have thrown');
      } catch (err) {
        console.log(err.message);
        assert.ok('should throw');
      }
    });

    it(`should store self-signed certificated in db`, async () => {
      const selfSignedConfig = merge({}, config);
      selfSignedConfig.env.useHttps = true;

      const server = new Server(selfSignedConfig);
      await server.init();

      const cert = await server.db.get('httpsCert');
      const key = await server.db.get('httpsKey');

      assert.isDefined(cert);
      assert.isDefined(key);
    });

    describe('Check https infos', () => {
      // this test will exit early if the `.env` file is not found in the tests
      // directory, making it work should be straightforward reading the code...
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

        server = new Server(httpsConfig);
        await server.init();

        assert.notEqual(server.httpsInfos, null);
        assert.equal(server.httpsInfos.selfSigned, false);
        assert.isDefined(server.httpsInfos.validFrom);
        assert.isDefined(server.httpsInfos.validTo);
        assert.isDefined(server.httpsInfos.isValid);
      });

      it(`should get infos about self-signed certificates`, async () => {
        const httpsConfig = merge({}, config);
        httpsConfig.env.useHttps = true;
        httpsConfig.env.httpsInfos = null;

        server = new Server(httpsConfig);
        await server.init();

        assert.notEqual(server.httpsInfos, null);
        assert.equal(server.httpsInfos.selfSigned, true);
        assert.isUndefined(server.httpsInfos.validFrom);
        assert.isUndefined(server.httpsInfos.validTo);
        assert.isUndefined(server.httpsInfos.isValid);
      });
    });
  });

  describe(`await server.start()`, () => {
    it(`should throw start() is called before init()`, async () => {
      server = new Server(config);

      try {
        await server.start();
        assert.fail('server.start() should not terminate');
      } catch(err) {
        console.log(err.message);
        assert.ok('server.start() should throw');
      }
    });

    it(`should launch the server (http)`, async () => {
      server = new Server(config);
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
      const selfSignedConfig = merge({}, config);
      selfSignedConfig.env.useHttps = true;

      server = new Server(selfSignedConfig);
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

      server = new Server(httpsConfigs);
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

  describe('await server.stop()', () => {

    beforeEach(async () => {
      server = new Server(config);

      await server.init();
      await server.start();
    });

    it('should throw stop() is called before start()', async () => {
      await server.stop();
      assert.isOk('server and process should stop');
    });

    it('should stop the server', async () => {
      await server.stop();
      assert.isOk('server and process should stop');
    });

    it('should stop the server even if a client is connected', async() => {
      const client = new Client({ clientType: 'test', ...config });
      await client.init();
      await client.start();

      await server.stop();
      assert.isOk('server and process should stop');
    });
  });

  describe('server.add|removeListener(function) - Events (inited, started, stopped)', () => {
    before(async () => {
      server = new Server(config);
    });

    it('should cleanly add and remove listeners', () => {
      const callback = async () => {};

      server.addListener('inited', callback);
      server.removeListener('inited', callback);

      assert.equal(server._listeners.size, 0)
    });

    it('should execute "inited" listeners', async () => {
      let counter = 0;

      const callback1 = async () => {
        await new Promise(resolve => setTimeout(resolve, 200));
        assert.equal(counter, 0);
        counter++;
      }

      const callback2 = async () => {
        await new Promise(resolve => setTimeout(resolve, 200));
        assert.equal(counter, 1);
        counter++;
      }

      server.addListener('inited', callback1);
      server.addListener('inited', callback2);

      await server.init();
      // assert await resolves after all callbacks
      assert.equal(counter, 2);
    });

    it('should execute "started" listeners', async () => {
      let counter = 0;

      const callback1 = async () => {
        await new Promise(resolve => setTimeout(resolve, 200));
        assert.equal(counter, 0);
        counter++;
      }

      const callback2 = async () => {
        await new Promise(resolve => setTimeout(resolve, 200));
        assert.equal(counter, 1);
        counter++;
      }

      server.addListener('started', callback1);
      server.addListener('started', callback2);

      await server.start();
      // assert await resolves after all callbacks
      assert.equal(counter, 2);
    });

    it('should execute "stopped" listeners', async () => {
      let counter = 0;

      const callback1 = async () => {
        await new Promise(resolve => setTimeout(resolve, 200));
        assert.equal(counter, 0);
        counter++;
      }

      const callback2 = async () => {
        await new Promise(resolve => setTimeout(resolve, 200));
        assert.equal(counter, 1);
        counter++;
      }

      server.addListener('stopped', callback1);
      server.addListener('stopped', callback2);

      await server.stop();
      // assert await resolves after all callbacks
      assert.equal(counter, 2);
    });
  });

  describe(`server.setDefaultTemplateConfig()`, () => {
    it(`should populate server._applicationTemplateConfig`, () => {
      const server = new Server(config);
      server.setDefaultTemplateConfig();

      assert.notEqual(server._applicationTemplateConfig.templateEngine, null);
      assert.notEqual(server._applicationTemplateConfig.templatePath, null);
      assert.notEqual(server._applicationTemplateConfig.clientConfigFunction, null);
    });
  });

  describe(`server.setCustomTemplateConfig(options)`, () => {
    it(`should override server._applicationTemplateConfig`, () => {
      const server = new Server(config);
      server.setDefaultTemplateConfig();
      // returns the config to be sent to the client
      const clientConfigFunction = (clientType, config, httpRequest) => {
        return {
          clientType: clientType,
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

      server.setCustomTemplateConfig({ clientConfigFunction });

      assert.notEqual(server._applicationTemplateConfig.templateEngine, null);
      assert.notEqual(server._applicationTemplateConfig.templatePath, null);
      assert.equal(server._applicationTemplateConfig.clientConfigFunction, clientConfigFunction);
    });
  });

});
