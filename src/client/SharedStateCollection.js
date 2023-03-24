import BaseSharedStateCollection from '../common/BaseSharedStateCollection.js';

// this file exists only for documentation purposesSharedStateCollection.js

/**
 * @callback client.SharedStateCollection~onUpdateCallback
 * @param {client.SharedState} state - State that triggered the update.
 * @param {Object} newValues - Key / value pairs of the updates that have been
 *  applied to the state.
 * @param {Object} oldValues - Key / value pairs of the updated params before
 *  the updates has been applied to the state.
 * @param {Mixed} [context=null] - Optionnal context object that has been passed
 *  with the values updates in the `set` call.
 */

/**
 * The `SharedStateCollection` interface represent a collection of all states
 * created from a given schema name on the network, at the execption of the ones
 * created by the current node.
 *
 * ```
 * const collection = await client.stateManager.getCollection('my-schema');
 * const allValues = collection.getValues();
 * collection.onUpdate((state, newValues, oldValues, context) => {
 *   // do something
 * });
 * ```
 * @memberof client
 * @extends BaseSharedStateCollection
 * @inheritdoc
 * @hideconstructor
 */
class SharedStateCollection extends BaseSharedStateCollection {}

export default SharedStateCollection;
