export default Plugin;
/**
 * Base class to extend for creating new soundworks plugins.
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