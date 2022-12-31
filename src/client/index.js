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
