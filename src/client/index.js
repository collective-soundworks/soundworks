/**
 * Client-side part of the *soundworks* framework. In the soundworks paradigm,
 * A client is a node of the application that can run seamlessly in a browser
 * or in a Node.js context.
 *
 * @namespace client
 * @example
 * import { Client } from '@soundworks/core/client.js';
 *
 * const client = new Client(config);
 * await client.start();
 */
export { default as Context } from './Context.js';
export { default as Client } from './Client.js';
