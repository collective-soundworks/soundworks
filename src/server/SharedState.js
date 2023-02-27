import BaseSharedState from '../common/BaseSharedState.js';

// this file exists only for documentation purposes

/**
 * @callback server.SharedState~onUpdateCallback
 * @param {Object} newValues - Key / value pairs of the updates that have been
 *  applied to the state.
 * @param {Object} oldValues - Key / value pairs of the updated params before
 *  the updates has been applied to the state.
 * @param {Mixed} [context=null] - Optionnal context object that has been passed
 *  with the values updates in the `set` call.
 */

/**
 * Delete the registered {@link server.SharedState~onUpdateCallback}.
 *
 * @callback server.SharedState~deleteOnUpdateCallback
 */

/**
 * The `SharedState` is one of the most important and versatile abstraction provided
 * by `soundworks`. It represents a set of parameters that are synchronized accross
 * every nodes of the application (clients and server) that declared some interest
 * to the shared state.
 *
 * A `SharedState` is created according to a "schema" (in the sense of a database
 * schema) that must be declared and registered server-side. Any number of `SharedState`s
 * can be created from a single schema.
 *
 * A shared state can be created both by the clients or by the server (in which case
 * it is generally considered as a global state of the application). Similarly any
 * node of the application (clients or server) can declare interest and "attach" to
 * a state created by another node. All node attached to a state can modify its values
 * and/or react to the modifications applied by other nodes.
 *
 * Tutorial: {@link https://soundworks.dev/guide/state-manager.html}
 *
 * ```
 * // server-side
 * import { Server } from '@soundworks/server/index.js';
 *
 * const server = new Server(config);
 * // declare and register the schema of a shared state.
 * server.stateManager.registerSchema('some-global-state', {
 *   myRandom: {
 *     type: 'float',
 *     default: 0,
 *   }
 * });
 *
 * await server.start();
 *
 * // create a global state server-side
 * const globalState = await server.stateManager.create('some-global-state');
 * // listen and react to the changes made by the clients
 * globalState.onUpdate(updates => console.log(updates));
 * ```
 *
 * ```
 * // client-side
 * import { Client } from '@soundworks/client.index.js';
 *
 * const client = new Client(config);
 * await client.start();
 *
 * // attach to the global state created by the server
 * const globalState = await client.stateManager.attach('some-global-state');
 *
 * // update the value of a `myRandom` parameter every seconds
 * setInterval(() => {
 *   globalState.set({ myRandom: Math.random() });
 * }, 1000);
 * ``
 *
 * @memberof server
 * @extends BaseSharedState
 * @inheritdoc
 * @hideconstructor
 * @see {server.StateManager}
 */
class SharedState extends BaseSharedState {}

export default SharedState;

