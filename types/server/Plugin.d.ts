export default Plugin;
/**
 * Base class to extend in order to create the server-side counterpart of a
 * soundworks plugin.
 *
 * @memberof server
 *
 * @augments BasePlugin
 * @param {server.Server} server - Instance of the soundworks server.
 * @param {String} id - User defined id of the plugin, as given in {@link server.PluginManager#register}.
 */
declare class Plugin extends BasePlugin {
    constructor(server: any, id: any);
    /**
     * Instance of soundworks server.
     * @type {server.Server}
     * @see {@link server.Server}
     */
    server: server.Server;
    /** @private */
    private clients;
    /**
     * Method called when a client (which registered the client-side plugin),
     * connects to the application. Override this method if you need to perform
     * some particular logic (e.g. creating a shared state) for each clients.
     *
     * @param {server.Client} client
     */
    addClient(client: server.Client): Promise<void>;
    /**
     * Method called when a client (which registered the client-side plugin),
     * disconnects from the application. Override this method if you need to perform
     * some particular logic (e.g. creating a shared state) for each clients.
     *
     * @param {server.Client} client
     */
    removeClient(client: server.Client): Promise<void>;
}
import BasePlugin from "../common/BasePlugin.js";
//# sourceMappingURL=Plugin.d.ts.map