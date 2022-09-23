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

before(async function() {
  this.timeout(10 * 1000);

  server = new Server();

  const callback1 = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(1);
  }

  const callback2 = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(2);
  }

  const callback3 = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(3);
  }

  server.addListener('inited', callback1);
  server.removeListener('inited', callback1);
  console.log(server._listeners)

  server.addListener('inited', callback1);
  server.addListener('inited', callback2);
  server.addListener('inited', callback3);

  server.addListener('started', callback1);
  server.addListener('started', callback2);
  server.addListener('started', callback3);

  await server.init(config);
  // @note - client type should not be mandatory
  const serverTestExperience = new ServerTestExperience(server, 'test');

  await server.start();
  serverTestExperience.start();
});

describe('server events (inited, started)', () => {
  it('should not crash', async function() {
    await server.stop();
  });
  // it('should stop the server properly', async () => {
  //   await server.stop();
  //   assert.isOk('server and process should stop', 'server and process should stop');
  // });

  // it('should stop the server even if a client is connected', async() => {
  //   const client = new Client();
  //   await client.init({ clientType: 'test', ...config });
  //   const testExperience = new ClientTestExperience(client);
  //   await client.start();
  //   testExperience.start();

  //   console.log('server.stop()')
  //   await server.stop();
  //   assert.isOk('server and process should stop', 'server and process should stop');
  // });
});
