export default StateManager;
export namespace client {
    /**
     * ~ObserveCallback
     */
    type StateManager = () => any;
}
/**
 * @callback client.StateManager~ObserveCallback
 * @async
 * @param {String} schemaName - name of the schema
 * @param {Number} stateId - id of the state
 * @param {Number} nodeId - id of the node that created the state
 */
/**
 * The `StateManager` allows to create new {@link client.SharedState}s or attach
 * to {@link client.SharedState}s created by other nodes (clients or server). It
 * can also be used to track all the {@link client.SharedState}s that are created
 * by other nodes.
 *
 * An instance of `StateManager` is automatically created by the `soundworks.Client`
 * at initialization (cf. {@link client.Client#stateManager}).
 *
 * Tutorial: [https://collective-soundworks.github.io/tutorials/state-manager.html](https://collective-soundworks.github.io/tutorials/state-manager.html)
 *
 * ```
 * import { Client } from '@soundworks/client.index.js';
 *
 * const client = new Client(config);
 * await client.start();
 *
 * // attach to the global state created by the server
 * const globalState = await client.stateManager.attach('some-global-state');
 * ```
 *
 * @memberof client
 * @extends BaseStateManager
 * @inheritdoc
 * @hideconstructor
 * @see {@link client.SharedState}
 * @see {@link client.Client#stateManager}
 */
declare class StateManager extends BaseStateManager {
}
import BaseStateManager from "../common/BaseStateManager.js";
//# sourceMappingURL=StateManager.d.ts.map