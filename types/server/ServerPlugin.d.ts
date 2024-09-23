export default ServerPlugin;
/**
 * Base class to extend in order to create the server-side counterpart of a
 * `soundworks` plugin.
 *
 * In the `soundworks` paradigm, a plugin is a component that allows to extend
 * the framework capabilities by encapsulating common and reusable logic in
 * an application wise perspective. For example, plugins are available to handle
 * clock synchronization, to deal with the file system, etc. Plugin should always
 * have both a client-side and a server-side part.
 *
 * See [https://soundworks.dev/guide/ecosystem](https://soundworks.dev/guide/ecosystem)
 * for more informations on the available plugins.
 *
 * _Creating new plugins should be considered an advanced usage._
 *
 * @extends BasePlugin
 * @inheritdoc
 */
declare class ServerPlugin extends BasePlugin {
    /**
     * @param {Server} server - The soundworks server instance.
     * @param {string} id - User defined id of the plugin as defined in
     *  {@link ServerPluginManager#register}.
     */
    constructor(server: Server, id: string);
    /**
     * Instance of soundworks server.
     * @type {Server}
     * @see {@link Server}
     */
    get server(): Server;
    /**
     * Set of the clients registered in the plugin.
     * @type {Set<ServerClient>}
     * @see {@link ServerClient}
     */
    get clients(): Set<ServerClient>;
    /**
     * Method called when a client (which registered the client-side plugin),
     * connects to the application. Override this method if you need to perform
     * some particular logic (e.g. creating a shared state) for each clients.
     *
     * @param {ServerClient} client
     */
    addClient(client: ServerClient): Promise<void>;
    /**
     * Method called when a client (which registered the client-side plugin),
     * disconnects from the application. Override this method if you need to perform
     * some particular logic (e.g. creating a shared state) for each clients.
     *
     * @param {ServerClient} client
     */
    removeClient(client: ServerClient): Promise<void>;
    #private;
}
import BasePlugin from '../common/BasePlugin.js';
