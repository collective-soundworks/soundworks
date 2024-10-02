import '@soundworks/helpers/polyfills.js';
import { Server } from '@soundworks/core/server.js';

import { loadConfig } from '../utils/load-config.js';
import '../utils/catch-unhandled-errors.js';

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

/**
 * Create the soundworks server
 */
const server = new Server(config);
// configure the server for usage within this application template
server.useDefaultApplicationTemplate();

/**
 * Register plugins and schemas
 */
server.stateManager.defineClass('globals', {
  done: {
    type: 'boolean',
    nullable: true,
    default: null,
    event: true,
  },
});

/**
 * Launch application (init plugins, http server, etc.)
 */
await server.start();

const globals = await server.stateManager.create('globals');

globals.onUpdate(updates => {
  // console.log(JSON.stringify(updates));

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

