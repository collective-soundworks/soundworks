import BaseStateManager from '../common/BaseStateManager.js';

/**
 * @callback ClientStateManager~ObserveCallback
 * @async
 * @param {String} schemaName - name of the schema
 * @param {Number} stateId - id of the state
 * @param {Number} nodeId - id of the node that created the state
 */

/**
 * The `ClientStateManager` allows to create new {@link SharedState}s, or attach
 * to {@link SharedState}s created by other nodes (clients or server). It
 * can also track all the {@link SharedState}s created by other nodes.
 *
 * An instance of `ClientStateManager` is automatically created by the `soundworks.Client`
 * at initialization (cf. {@link client.Client#stateManager}).
 *
 * See {@link client.Client#stateManager}
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
 * ```
 *
 * @extends BaseStateManager
 * @inheritdoc
 * @hideconstructor
 */
class ClientStateManager extends BaseStateManager {}

export default ClientStateManager;
