const path = require('path');
const assert = require('chai').assert;

const Server = require('../../server').Server;
const ServerAbstractExperience = require('../../server').AbstractExperience;

const Client = require('../../client').Client;
const ClientAbstractExperience = require('../../client').AbstractExperience;

config = {
  app: {
    name: 'terminate-server-test',
    clients: {
      test: { target: 'node' },
    },
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

class ClientTestExperience extends ClientAbstractExperience {
  start() { console.log('> client started'); }
}

let server;

beforeEach(async () => {
  server = new Server();

  await server.init(config);
  // @note - client type should not be mandatory
  const serverTestExperience = new ServerTestExperience(server, 'test');

  await server.start();
  serverTestExperience.start();
});

describe('await server.stop()', () => {
  it('should stop the server properly', async () => {
    await server.stop();
    assert.isOk('server and process should stop', 'server and process should stop');
  });

  it('should stop the server even if a client is connected', async() => {
    const client = new Client();
    await client.init({ clientType: 'test', ...config });
    const testExperience = new ClientTestExperience(client);
    await client.start();
    testExperience.start();

    console.log('server.stop()')
    await server.stop();
    assert.isOk('server and process should stop', 'server and process should stop');
  });
});
