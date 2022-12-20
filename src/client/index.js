/**
 * Client-side part of the *soundworks* framework.
 *
 * Can run seamlessly in a browser or in a Node.js context.
 *
 * @namespace client
 *
 * @example
 * import { Client } from '@soundworks/core/client.js';
 *
 * const client = new Client(config);
 * await client.start();
 */
export { default as Context } from './Context.js';
export { default as Client } from './Client.js';
