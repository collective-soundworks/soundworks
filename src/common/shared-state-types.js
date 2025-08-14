/**
 * User defined name for a class of {@link SharedState}
 *
 * @typedef {string} SharedStateClassName
 */

/**
 * Description of a {@link SharedState} data structure that describes the structure
 * of a class of {@link SharedState} to be registered by {@link ServerStateManager#defineClass}
 *
 * A `SharedStateClassDescription` is the blueprint, or the definition from which
 * shared states from a given class can be created.
 *
 * It consists of a set of key / value pairs where the key is the name of
 * the parameter (cf. ${SharedStateParameterName}), and the value is an object
 * describing the parameter (cf. ${SharedStateParameterDescription}).
 *
 * @typedef {Object.<SharedStateParameterName, SharedStateParameterDescription>} SharedStateClassDescription
 *
 * @example
 * const myClassDescription = {
 *   triggerSound: {
 *     type: 'boolean',
 *     event: true,
 *   },
 *   volume: {
 *     type: 'float'
 *     default: 0,
 *     min: -80,
 *     max: 6,
 *   }
 * };
 *
 * server.stateManager.defineClass('my-class-name', myClassDescription);
 */

/**
 * User defined name of a parameter in a class of {@link SharedState}
 *
 * @typedef {string} SharedStateParameterName
 */

/**
 * Description of a parameter in a class of {@link SharedState}
 *
 * @typedef {object} SharedStateParameterDescription
 * @property {'boolean'|'string'|'integer'|'float'|'enum'|'any'} type - Type of the parameter.
 * @property {any} default - Default value of the parameter. Optional only if
 *  `nullable = true` or `event = true`
 * @property {boolean} [nullable=false] - Defines if the parameter is nullable.
 *   When `true` the parameter `default` is set to `null`.
 * @property {boolean} [event=false] - Define if the parameter is a volatile, i.e.
 *   its value only exists on an update and is set back to `null` after propagation.
 *   When `true`, `nullable` is automatically set to `true` and `default` to `null`.
 * @property {boolean} [required=false] - When set to true, the parameter must be
 *   provided at the creation of the shared state.
 * @property {boolean} [filterChange=true] - When set to `false`, an update will
 *   trigger the propagation of a parameter even when its value didn't change.
 *   This modifier provides a sort of middle ground between the default behavior
 *   (e.g. where only changed values are propagated) and the behavior of the `event`
 *   option (which has no state per se). Hence, setting this options to `false` if
 *   `event=true` makes no sens.
 * @property {boolean} [immediate=false] - When set to `true`, an update will
 *   trigger the update listeners immediately on the node that generated the update,
 *   before propagating the change on the network. This modifier is useful in cases
 *   the network would introduce a noticeable latency on the client.
 *   If for some reason the value is overridden server-side (e.g. in an `updateHook`)
 *   the listeners will be called again when the "real" value is received.
 *   Setting this modifier to `true` will trigger the `onUpdate` callback synchronously
 *   according to the `set` call.
 * @property {boolean} [local=false] - When set to true, the parameter is never
 *   propagated on the network (hence it is no longer a shared parameter :). This
 *   is useful to declare some common parameter (e.g. some interface state) that
 *   don't need to be shared but to stay in the shared state API paradigm.
 *   Setting this modifier to `true` will trigger the `onUpdate` callback synchronously
 *   according to the `set` call.
 * @property {boolean} [acknowledge=true] - When set to false, the acknowledgement
 *   is never sent back to the shared state that initiated an update. This can be
 *   useful to e.g. stream values to the network, but can lead to invalid state.
 *   Setting this modifier to `true` will trigger the `onUpdate` callback synchronously
 *   according to the `set` call.
 * @property {number} [min=-Number.MIN_VALUE] - Minimum value of the parameter. Only applies
 *   for `integer` and `float` types.
 * @property {number} [max=Number.MAX_VALUE] - Maximum value of the parameter. Only applies
 *   for `integer` and `float` types.
 * @property {Array<any>} [list] - Possible values of the parameter. Only applies and
 *   mandatory for `enum` type.
 * @property {object} [metas={}] - Optional metadata of the parameter.
 */

