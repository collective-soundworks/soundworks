import '@soundworks/helpers/polyfills.js';
import '@soundworks/helpers/catch-unhandled-errors.js';
import { loadConfig, configureHttpRouter } from '@soundworks/helpers/server.js';

import { Server } from '../../../../src/server/index.js';

// - General documentation: https://soundworks.dev/
// - API documentation:     https://soundworks.dev/api
// - Issue Tracker:         https://github.com/collective-soundworks/soundworks/issues
// - Wizard & Tools:        `npx soundworks`

const config = loadConfig(process.env.ENV, import.meta.url);

console.log(`
--------------------------------------------------------
- launching "${config.app.name}" in "${process.env.ENV || 'default'}" environment
- [pid: ${process.pid}]
--------------------------------------------------------
`);

const server = new Server(config);
configureHttpRouter(server);

server.stateManager.defineClass('globals', {
  done: {
    type: 'boolean',
    nullable: true,
    default: null,
    event: true,
  },
});

await server.start();

const globals = await server.stateManager.create('globals');

globals.onUpdate(updates => {
  console.log(updates);
  // forward updates to main process
  if (process.send !== undefined) {
    process.send(JSON.stringify(updates));
  }
});

if (process.send !== undefined) {
  // sent by parent process to quit server
  process.on('message', async msg => {
    if (msg === 'stop') {
      await server.stop();
    }
  });
}

