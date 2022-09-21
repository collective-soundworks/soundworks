const assert = require('chai').assert;

const Server = require('../../server').Server;
const ServerAbstractExperience = require('../../server').AbstractExperience;

const Client = require('../../client').Client;
const ClientAbstractExperience = require('../../client').AbstractExperience;

const config = {
  app: {
    name: 'test-state-manager',
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
let client;

before(async () => {
  server = new Server();

  await server.init(config);
  const serverExperience = new ServerTestExperience(server, 'test');

  await server.start();
  serverExperience.start();

  client = new Client();
  await client.init({ clientType: 'test', ...config });
  const clientExperience = new ClientTestExperience(client);

  await client.start();
  clientExperience.start();
});

after(async () => {
  await server.stop();
});

// Regression Test
// when min and max are explicitely set to Infinity values, the schema is stringified
// when sent over the network, provoking Infinity to be transformed to `null`
//
// JSON.parse({ a: Infinity });
// > { "a": null }
describe(`integer and floats min and max`, () => {
  it(`[integer type] should propagate value when min and max are manually set to Infinity`, async function() {
    this.timeout(5 * 1000);

    const schema = {
      myInt: {
        type: 'integer',
        min: -Infinity,
        max: Infinity,
        default: 0,
      },
    };

    server.stateManager.registerSchema('test-integer', schema);

    const serverInteger = await server.stateManager.create('test-integer');
    const serverResult = [];

    serverInteger.subscribe(updates => serverResult.push(updates.myInt));

    const clientInteger = await client.stateManager.attach('test-integer');
    const clientResult = [];

    clientInteger.subscribe(updates => clientResult.push(updates.myInt));

    for (let i = 0; i < 10; i++) {
      await serverInteger.set({ myInt: Math.floor(Math.random() * 1000) });
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    for (let i = 0; i < 10; i++) {
      await clientInteger.set({ myInt: Math.floor(Math.random() * 1000) });
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    assert.deepEqual(clientResult, serverResult);
    console.log(clientResult, serverResult);
  });

  it(`[float type] should propagate value when min and max are manually set to Infinity`, async function() {
    this.timeout(5 * 1000);

    const schema = {
      myFloat: {
        type: 'float',
        min: -Infinity,
        max: Infinity,
        default: 0,
      },
    };

    server.stateManager.registerSchema('test-float', schema);

    const serverInteger = await server.stateManager.create('test-float');
    const serverResult = [];

    serverInteger.subscribe(updates => serverResult.push(updates.myFloat));

    const clientInteger = await client.stateManager.attach('test-float');
    const clientResult = [];

    clientInteger.subscribe(updates => clientResult.push(updates.myFloat));

    for (let i = 0; i < 10; i++) {
      await serverInteger.set({ myFloat: Math.random() });
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    for (let i = 0; i < 10; i++) {
      await clientInteger.set({ myFloat: Math.random() });
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    assert.deepEqual(clientResult, serverResult);
    console.log(clientResult, serverResult);
  });
});
