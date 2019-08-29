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
export { default as Experience } from './Experience';
export { default as Service } from './Service';
export { default as Client } from './Client';
