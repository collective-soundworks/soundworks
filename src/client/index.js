/**
 * Client-side part of the *soundworks* framework.
 * Can run seamlessly in a browser or in node.js.
 *
 * @module @soundworks/core/client
 *
 * @example
 * import soundworks from '@soundworks/core/client';
 *
 * // create a new `soundworks.Client` instance
 * const client = new soundworks.Client();
 * // register a pre-defined or user-defined service
 * client.registerService('my-service', myServiceFactory);
 * // initialize the client (mainly connect and initialize WebSockets)
 * await client.init(config);
 * // create application specific experience
 * // must extends `soundworks.Experience`
 * const playerExperience = new PlayerExperience(client);
 * // init required services, if any
 * await client.start();
 * // when everything is ready, start the experience
 * playerExperience.start();
 */
import { default as _Experience } from './Experience.js';
// import { default as TmpService } from './Service';
import { default as _Client } from './Client.js';

// (very) weird workaround to be able to:
//
// `import soundworks from '@soundworks/core/client'``
// or
// `import { Client } from '@soundworks/core/client'`
//
export const Experience = _Experience;
export const Client = _Client;

// export default {
//   Experience: _Experience,
//   Client: _Client,
// };

