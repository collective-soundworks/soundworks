/**
 * Server-side part of the *soundworks* framework.
 *
 * ```
 * import '@soundworks/helpers/polyfills.js';
 * import { Server } from '@soundworks/core/server.js';
 * import { loadConfig } from '../utils/load-config.js';
 *
 * // - General documentation: https://soundworks.dev/
 * // - API documentation:     https://soundworks.dev/api
 * // - Issue Tracker:         https://github.com/collective-soundworks/soundworks/issues
 * // - Wizard & Tools:        `npx soundworks`
 *
 * const config = loadConfig(process.env.ENV, import.meta.url);
 *
 * const server = new Server(config);
 * server.setDefaultTemplateConfig();
 *
 * await server.start();
 * ```
 *
 * @namespace server
 */
export { default as Server } from './Server.js';
export { default as Context } from './Context.js';
