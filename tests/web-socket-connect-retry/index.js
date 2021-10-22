const path = require('path');

const Server = require('../../server').Server;
const ServerAbstractExperience = require('../../server').AbstractExperience;

const Client = require('../../client').Client;
const ClientAbstractExperience = require('../../client').AbstractExperience;

const config = require('./config');


class ServerTestExperience extends ServerAbstractExperience {
  constructor(server, clientTypes) {
    super(server, clientTypes);
  }
}

class ClientTestExperience extends ClientAbstractExperience {
  constructor(client) {
    super(client);
  }

  start() {
    console.log('> client properly started, quit...');
    process.exit(0);
  }
}

(async function() {
  // launch server after 4 seconds
  // @note: this must be done first as the client will hang the process
  console.log('> launching server in 2s');
  setTimeout(async () => {
    console.log('> launching server');
    server = new Server();

    // this is boring... should not be mandatory
    server.templateEngine = { compile: () => {} };
    server.templateDirectory = __dirname;

    await server.init(config);
    const serverExperience = new ServerTestExperience(server, 'test');

    await server.start();
    serverExperience.start();
  }, 2000);

  console.log('> launching client');
  try {
    const client = new Client();
    await client.init({
      clientType: 'test',
      ...config,
    });

    const clientExperience = new ClientTestExperience(client);

    await client.start();
    clientExperience.start();
  } catch(err) {
    console.log(err);
  }

}());

