/**
 * Server-side part of the *soundworks* framework.
 *
 * @namespace server
 *
 * @example
 * import { Server } from '@soundworks/core/server.js';
 *
 * const server = new Server(config);
 * await server.start();
 */
export { default as Server } from './Server.js';
export { default as Context } from './Context.js';
