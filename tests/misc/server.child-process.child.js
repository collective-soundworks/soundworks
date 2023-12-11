import { Server } from '../../src/server/index.js';
import config from '../utils/config.js';

const server = new Server(config);

await server.init();
await server.start();
await server.stop();
