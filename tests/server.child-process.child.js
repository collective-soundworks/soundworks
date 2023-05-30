import { Server } from '../src/server/index.js';

const config = {
  app: {
    clients: {
      'test': { target: 'node' },
    },
  },
  env: {
    type: 'development',
    port: 8081,
    serverAddress: '127.0.0.1',
    useHttps: false,
    verbose: false,
  },
};

const server = new Server(config);

await server.init();
await server.start();
await server.stop();
