/**
 * Configuration object for a client running in a browser runtime.
 *
 * @typedef BrowserClientConfig
 * @memberof client
 * @type {object}
 * @property {string} role - Role of the client in the application (e.g. 'player', 'controller').
 * @property {object} [app] - Application configration object.
 * @property {string} [app.name=''] - Name of the application.
 * @property {string} [app.author=''] - Name of the author.
 * @property {object} [env] - Environment configration object.
 * @property {string} [env.websockets={}] - Configuration options for websockets.
 * @property {string} [env.subpath=''] - If running behind a proxy, path to the application.
 */

/**
 * Configuration object for a client running in a node runtime.
 *
 * @typedef NodeClientConfig
 * @memberof client
 * @type {object}
 * @property {string} role - Role of the client in the application (e.g. 'player', 'controller').
 * @property {object} [app] - Application configration object.
 * @property {string} [app.name=''] - Name of the application.
 * @property {string} [app.author=''] - Name of the author.
 * @property {object} env - Environment configration object.
 * @property {boolean} env.serverAddress - Domain name or IP of the server.
 * @property {boolean} env.useHttps - Define is the server run in http or in https.
 * @property {boolean} env.port - Port on which the server is listening.
 * @property {string} [env.websockets={}] - Configuration options for websockets.
 * @property {string} [env.subpath=''] - If running behind a proxy, path to the application.
 */

/**
 * Client-side part of the `soundworks` framework.
 *
 * A `soundworks` client can run seamlessly in a browser or in a Node.js runtime.
 *
 * ```
 * import '@soundworks/helpers/polyfills.js';
 * import { Client } from '@soundworks/core/client.js';
 * import launcher from '@soundworks/helpers/launcher.js';
 *
 * // - General documentation: https://soundworks.dev/
 * // - API documentation:     https://soundworks.dev/api
 * // - Issue Tracker:         https://github.com/collective-soundworks/soundworks/issues
 * // - Wizard & Tools:        `npx soundworks`
 *
 * const config = window.SOUNDWORKS_CONFIG;
 *
 * async function main($container) {
 *   try {
 *     const client = new Client(config);
 *
 *     // client.pluginManager.register(pluginName, pluginFactory, {options}, [dependencies])
 *
 *     launcher.register(client, {
 *       initScreensContainer: $container,
 *       reloadOnVisibilityChange: false,
 *     });
 *
 *     await client.start();
 *
 *     $container.innerText = `client ${client.id} started`);
 *
 *   } catch(err) {
 *     console.error(err);
 *   }
 * }
 *
 * launcher.execute(main);
 * ```
 *
 * @namespace client
 */
export { default as Context } from './Context.js';
export { default as Client } from './Client.js';
