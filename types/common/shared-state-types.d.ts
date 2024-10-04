/**
 * User defined name for a class of {@link SharedState }
 */
type SharedStateClassName = string;
/**
 * Description of a {@link SharedState } data structure that describes the structure
 * of a class of {@link SharedState } to be registered by {@link ServerStateManagerdefineClass }
 *
 * A `SharedStateClassDescription` is the blueprint, or the definition from which
 * shared states from a given class can be created.
 *
 * It consists of a set of key / value pairs where the key is the name of
 * the parameter (cf. ${SharedStateParameterName}), and the value is an object
 * describing the parameter (cf. ${SharedStateParameterDescription}).
 */
type SharedStateClassDescription = any;
/**
 * User defined name of a parameter in a class of {@link SharedState }
 */
type SharedStateParameterName = string;
/**
 * Description of a parameter in a class of {@link SharedState }
 */
type SharedStateParameterDescription = {
    /**
     * - Type of the parameter
     */
    type: 'boolean' | 'string' | 'integer' | 'float' | 'enum' | 'any';
    /**
     * - Default value of the parameter. Optional only if
     * `nullable = true` or `event = true`
     */
    default: any;
    /**
     * - Defines if the parameter is nullable.
     * When `true` the parameter `default` is set to `null`.
     */
    nullable?: boolean;
    /**
     * - Define if the parameter is a volatile, i.e.
     * its value only exists on an update and is set back to `null` after propagation.
     * When `true`, `nullable` is automatically set to `true` and `default` to `null`.
     */
    event?: boolean;
    /**
     * - When set to `false`, an update will
     * trigger the propagation of a parameter even when its value didn't change.
     * This option provides a sort of middle ground between the default bahavior
     * (e.g. where only changed values are propagated) and the behavior of the `event`
     * option (which has no state per se). Hence, setting this options to `false` if
     * `event=true` makes no sens.
     */
    filterChange?: boolean;
    /**
     * - When set to `true`, an update will
     * trigger the update listeners immediately on the node that generated the update,
     * before propagating the change on the network.
     * This option is usefull in cases the network would introduce a noticeable
     * latency on the client.
     * If for some reason the value is overriden server-side (e.g. in an `updateHook`)
     * the listeners will be called again when the "real" value is received.
     */
    immediate?: boolean;
    /**
     * - When set to true, the parameter is never
     * propagated on the network (hence it is no longer a shared parameter :). This
     * is usefull to declare some common parameter (e.g. some interface state) that
     * don't need to be shared but to stay in the shared state API paradigm.
     */
    local?: boolean;
    /**
     * - Minimum value of the parameter. Only applies
     * for `integer` and `float` types.
     */
    min?: number;
    /**
     * - Maximum value of the parameter. Only applies
     * for `integer` and `float` types.
     */
    max?: number;
    /**
     * - Possible values of the parameter. Only applies and
     * mandatory for `enum` type.
     */
    list?: Array<any>;
    /**
     * - Optional metadata of the parameter.
     */
    metas?: object;
};
