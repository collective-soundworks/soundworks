const path = require('path');
const assert = require('chai').assert;

const Server = require('../../server').Server;
const ServerAbstractExperience = require('../../server').AbstractExperience;

const

config = {
  app: {
    name: 'terminate-server-test',
    clients: {}, // we don't have clients here
  },
  env: {
    type: 'development',
    port: 8081,
    serverIp: '127.0.0.1',
    useHttps: false,
  },
};
;

class ServerTestExperience extends ServerAbstractExperience {
  start() { console.log('> server started'); }
}

let server;

before(async () => {
  // ---------------------------------------------------
  // server
  // ---------------------------------------------------
  server = new Server();
  // @note - these two should not be mandatory
  server.templateEngine = { compile: () => {} };
  server.templateDirectory = __dirname;

  await server.init(config);
  // @note - client type should not be mandatory
  const serverTestExperience = new ServerTestExperience(server, []);

  await server.start();
  serverTestExperience.start();
});

describe('await server.stop()', () => {
    it('should stop the server properly', async () => {
      await server.stop();
      assert.isOk('server and process should stop', 'server and process should stop');
  });
});
