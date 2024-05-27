/**
 * User defined name for a class of {@link SharedState}
 *
 * @typedef {string} SharedStateClassName
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
 * @property {'boolean'|'string'|'integer'|'float'|'enum'|'any'} type - Type of the parameter
 * @property {any} default - Default value of the parameter. Optional only if
 *  `nullable = true` or `event = true`
 * @property {boolean} [nullable=false] - Defines if the parameter is nullable.
 *   When `true` the parameter `default` is set to `null`.
 * @property {boolean} [event=false] - Define if the parameter is a volatile, i.e.
 *   its value only exists on an update and is set back to `null` after propagation.
 *   When `true`, `nullable` is automatically set to `true` and `default` to `null`.
  * @property {boolean} [filterChange=true] - When set to `false`, an update will
 *   trigger the propagation of a parameter even when its value didn't change.
 *   This option provides a sort of middle ground between the default bahavior
 *   (e.g. where only changed values are propagated) and the behavior of the `event`
 *   option (which has no state per se). Hence, setting this options to `false` if
 *   `event=true` makes no sens.
  * @property {boolean} [immediate=false] - When set to `true`, an update will
 *   trigger the update listeners immediately on the node that generated the update,
 *   before propagating the change on the network.
 *   This option is usefull in cases the network would introduce a noticeable
 *   latency on the client.
 *   If for some reason the value is overriden server-side (e.g. in an `updateHook`)
 *   the listeners will be called again when the "real" value is received.
 * @property {number} [min=-Number.MIN_VALUE] - Minimum value of the parameter. Only applies
 *   for `integer` and `float` types.
 * @property {number} [max=Number.MAX_VALUE] - Maximum value of the parameter. Only applies
 *   for `integer` and `float` types.
 * @property {Array<any>} [list] - Possible values of the parameter. Only applies and
 *   mandatory for `enum` type.
 * @property {object} [metas={}] - Optional metadata of the parameter.
 */

/**
 * Description of a {@link SharedState} data structure that describes the structure
 * of a class of {@link SharedState} to be registered by {@link ServerStateManager#registerSchema}
 *
 * A schema is the blueprint, or the definition from which shared states from a
 * given class can be created.
 *
 * It consists of a set of key / value pairs where the key is the name of
 * the parameter (cf. ${SharedStateParameterName}), and the value is an object
 * describing the parameter (cf. ${SharedStateParameterDescription}).
 *
 * @typedef {Object.<SharedStateParameterName, SharedStateParameterDescription>} SharedStateSchema
 *
 * @example
 * const mySchema = {
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
 * server.stateManager.registerSchema('my-class-name', mySchema);
 */
