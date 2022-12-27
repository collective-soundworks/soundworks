/**
 * Configuration object for the server.
 *
 * @typedef ServerConfig
 * @memberof server
 * @type {object}
 * @property {object} [app] - Application configration object.
 * @property {object} app.clients - Definition of the application clients.
 * @property {string} [app.name=''] - Name of the application.
 * @property {string} [app.author=''] - Name of the author.
 * @property {object} [env] - Environment configration object.
 * @property {boolean} env.port - Port on which the server is listening.
 * @property {boolean} env.useHttps - Define is the server run in http or in https.
 * @property {boolean} [env.httpsInfos={}] - Path to cert files for https.
 * @property {boolean} env.serverAddress - Domain name or IP of the server.
 *  Mandatory if node clients are defined
 * @property {string} [env.websockets={}] - Configuration options for websockets.
 * @property {string} [env.subpath=''] - If running behind a proxy, path to the application.
 */

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
