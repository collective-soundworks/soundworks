export default Client;
/**
 * Create a new soundworks client.
 *
 * The `Client` is the main entry point to access *soundworks* components
 * such as {@link client.Socket}, {@link client.PluginManager},
 * {@link client.StateManager} or {@link client.ContextManager}.
 * The client is responsible for the initialization lifecycle of the application.
 *
 * @memberof client
 * @throws Will throw if the given config object is invalid.
 * @example
 * import { Client } from '@soundworks/core/client.js';
 *
 * // create a new soundworks `Client` instance
 * const client = new Client({ role: 'player' });
 * // init and start the client
 * await client.start();
 */
declare class Client {
    /**
     * @param {object} config - Configuration of the soundworks client.
     */
    constructor(config: object);
    /**
     * Role of the client in the application.
     *
     * @type {string}
     */
    role: string;
    /**
     * Configuration object, typically contains the configuration sent by the
     * server.
     *
     * @todo typedef
     * @type {object}
     * @see {@link server.Server}.
     */
    config: object;
    /**
     * Session id of the client (incremeted positive number), generated and
     * retrieved by the server during `client.init`. The counter is reset when
     * the server restarts.
     *
     * @type {number}
     */
    id: number;
    /**
     * Unique session uuid of the client (uuidv4), generated and retrieved by
     * the server during {@link client.Client#init}.
     *
     * @type {string}
     */
    uuid: string;
    /**
     * Instance of the {@link client.Socket} class that handle websockets communications with
     * the server.
     *
     * @see {@link client.Socket}
     * @type {client.Socket}
     */
    socket: client.Socket;
    /**
     * Target platform of the client, i.e. 'browser' or 'node'.
     *
     * @type {string}
     */
    target: string;
    /**
     * Instance of the {@link client.ContextManager} class.
     *
     * The context manager requires the socket to be connected therefore it can be
     * accessed and used only after `client.init()` has been fulfilled.
     *
     * @see {@link client.ContextManager}
     * @type {client.ContextManager}
     */
    contextManager: client.ContextManager;
    /**
     * Instance of the {@link client.PluginManager} class.
     *
     * The plugin manager requires the socket to be connected therefore it can be
     * accessed and used only after `client.init()` has been fulfilled.
     *
     * @see {@link client.PluginManager}
     * @type {client.PluginManager}
     */
    pluginManager: client.PluginManager;
    /**
     * Instance of the {@link client.StateManager} class.
     *
     * The state manager requires the socket to be connected therefore it can be
     * accessed and used only after `client.init()` has been fulfilled.
     *
     * @see {@link client.StateManager}
     * @type {client.StateManager}
     */
    stateManager: client.StateManager;
    /**
     * Status of the client, 'idle', 'inited', 'started' or 'errored'.
     *
     * @type {string}
     */
    status: string;
    /** @private */
    private _auditState;
    /**
     * Method to be called before {@link client.Client#start} in the
     * initialization lifecycle of the soundworks client.
     *
     * - connect the sockets to be server
     * - do the handshake with soundwoks server (retrieve id, etc.)
     * - launch the state manager
     * - init registered plugin
     *
     * After calling `await client.init()`, the stateManaher and the pluginManager
     * can be safely used.
     *
     * @see {@link server.Server}
     */
    init(): Promise<void>;
    /**
     * Method to be called when {@link client.Client#init} has finished in the
     * initialization lifecycle of the soundworks client.
     *
     * - starts all the registered contexts
     *
     * @see {@link server.Server#start}
     */
    start(): Promise<void>;
    /**
     * Stop the client. Stops all started contexts, plugins and terminates the socket
     * connections.
     */
    stop(): Promise<void>;
    /**
     * Get the global audit state of the application. The audit state is lazily
     * attached to the client only if this method is called.
     *
     * @throws Will throw if called before `client.init()`
     */
    getAuditState(): Promise<any>;
}
//# sourceMappingURL=Client.d.ts.map