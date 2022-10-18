import 'source-map-support/register';
import path from 'node:path';

import { Server } from '../../../../server/index.js';
import getConfig from '../utils/getConfig.js';

const ENV = process.env.ENV || 'default';
const config = getConfig(ENV);
// config.env.verbose = true;

const server = new Server(config);
server.setDefaultTemplateConfig();

if (config.env.verbose) {
  console.log(`
--------------------------------------------------------
- launching "${config.app.name}" in "${ENV}" environment
- [pid: ${process.pid}]
--------------------------------------------------------
  `);
}

const globalsSchema = {
  done: {
    type: 'boolean',
    nullable: true,
    default: null,
    event: true,
  },
};

server.stateManager.registerSchema('globals', globalsSchema);

(async function launch() {
  try {
    await server.init();

    const globals = await server.stateManager.create('globals');
    globals.subscribe(updates => {
      // forward updates to main process
      if (process.send !== undefined) {
        process.send(JSON.stringify(updates));
      }
    });

    // start all the things
    await server.start();

    // this is run from test suite
    if (process.send !== undefined) {
      process.send('soundworks:started'); // is sent by soundworks `soundworks:server:started`
      // sent by parent process to quit server
      process.on('message', async msg => {
        if (msg === 'stop') {
          await server.stop();
        }
      });
    }

  } catch (err) {
    console.error(err.stack);
  }
})();

process.on('unhandledRejection', (reason, p) => {
  console.log('> Unhandled Promise Rejection');
  console.log(reason);
});
