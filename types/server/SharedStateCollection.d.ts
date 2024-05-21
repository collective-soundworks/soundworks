export default SharedStateCollection;
export namespace server {
    /**
     * ~onUpdateCallback
     */
    type SharedStateCollection = (state: server.SharedState, newValues: any, oldValues: any, context?: Mixed) => any;
}
/**
 * @callback server.SharedStateCollection~onUpdateCallback
 * @param {server.SharedState} state - State that triggered the update.
 * @param {Object} newValues - Key / value pairs of the updates that have been
 *  applied to the state.
 * @param {Object} oldValues - Key / value pairs of the updated params before
 *  the updates has been applied to the state.
 * @param {Mixed} [context=null] - Optionnal context object that has been passed
 *  with the values updates in the `set` call.
 */
/**
 * The `SharedStateCollection` interface represent a collection of all states
 * created from a given schema name on the network.
 *
 * It can optionnaly exclude the states created by the current node.
 *
 * See {@link server.StateManager#getCollection} for factory method API
 *
 * ```
 * const collection = await server.stateManager.getCollection('my-schema');
 * const allValues = collection.getValues();
 * collection.onUpdate((state, newValues, oldValues, context) => {
 *   // do something
 * });
 * ```
 * @memberof server
 * @extends BaseSharedStateCollection
 * @inheritdoc
 * @hideconstructor
 */
declare class SharedStateCollection extends BaseSharedStateCollection {
}
import BaseSharedStateCollection from '../common/BaseSharedStateCollection.js';
//# sourceMappingURL=SharedStateCollection.d.ts.map