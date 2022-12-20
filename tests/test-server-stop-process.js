import { Server } from './src/server/index.js';

const server = new Server({
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
    verbose: true,
  },
});

await server.start();

setTimeout(async () => {
  console.log('server stop');
  await server.stop();
}, 1000);

