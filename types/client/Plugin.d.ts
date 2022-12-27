export default Plugin;
/**
 * Base class to extend for creating new *soundworks* plugins.
 *
 * In the *soundworks* paradigm, a plugin is a component that allows to extend
 * the framework capabilities by encapsulating common and reusable logic in
 * an application wise perspective. For example, plugins are available to handle
 * clock synchronization, to deal with the file system, etc.
 *
 * See [https://soundworks.dev/guide/ecosystem](https://soundworks.dev/guide/ecosystem)
 * for more informations on the available plugins.
 *
 * _Creating new plugins should be considered as an advanced usage._
 *
 * @memberof client
 * @extends BasePlugin
 */
declare class Plugin extends BasePlugin {
    /**
     * @param {client.Client} client - The soundworks client instance.
     * @param {string} id - User defined id of the plugin as defined in
     *  {@link client.PluginManager#register}.
     * @see {@link client.PluginManager#register}
     */
    constructor(client: client.Client, id: string);
    /**
     * Instance of soundworks client.
     *
     * @type {client.Client}
     * @see {@link client.Client}
     */
    client: client.Client;
}
import BasePlugin from "../common/BasePlugin.js";
//# sourceMappingURL=Plugin.d.ts.map