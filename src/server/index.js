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
import _Server from './Server.js';
import _Context from './Context.js';

export const Context = _Context;
export const Server = _Server;

export default {
  Context: _Context,
  Server: _Server,
};
