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
import { default as TmpExperience } from './Experience';
import { default as TmpService } from './Service';
import { default as TmpClient } from './Client';

// (very) weird workaround to be able to:
//
// `import * as soundworks from '@soundworks/core/client'``
// or
// `import { Client } from '@soundworks/core/client'`
//
export const Experience = TmpExperience;
export const Service = TmpService;
export const Client = TmpClient;
export default undefined;

