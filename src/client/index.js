/**
 * Client-side part of the *soundworks* framework.
 * Can run seamlessly in a browser or in node.js.
 *
 * @namespace client
 *
 * @example
 * import soundworks from '@soundworks/core/client';
 *
 * // create a new `soundworks.Client` instance
 * const client = new soundworks.Client();
 * // register a pre-defined or user-defined plugin
 * client.registerService('my-plugin', myServiceFactory);
 * // initialize the client (mainly connect and initialize WebSockets)
 * await client.init(config);
 * // create application specific experience
 * // must extends `soundworks.Experience`
 * const playerExperience = new PlayerExperience(client);
 * // init required plugins, if any
 * await client.start();
 * // when everything is ready, start the experience
 * playerExperience.start();
 */
import _Context from './Context.js';
import _Client from './Client.js';

// `import soundworks from '@soundworks/core/client'``
// or
// `import { Client } from '@soundworks/core/client'`
export const Context = _Context;
export const Client = _Client;

export default {
  Context: _Context,
  Client: _Client,
};

