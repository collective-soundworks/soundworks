export default Client;
/**
 * The `Client` class is the main entry point for  the client-side of soundworks
 * application.
 *
 * A `Client` instance allows to access soundworks components such as {@link client.StateManager},
 * {@link client.PluginManager},{@link client.Socket} or {@link client.ContextManager}.
 * Its is also responsible for handling the initialization lifecycles of the different
 * soundworks components.
 *
 * ```
 * import { Client } from '@soundworks/core/client.js';
 *
 * // create a new soundworks `Client` instance
 * const client = new Client({ role: 'player' });
 * // init and start the client
 * await client.start();
 * ```
 *
 * @memberof client
 */
declare class Client {
    /**
     * @param {client.BrowserClientConfig} config - Configuration of the soundworks client.
     * @throws Will throw if the given config object is invalid.
     */
    constructor(config: client.BrowserClientConfig);
    /**
     * Role of the client in the application.
     *
     * @type {string}
     */
    role: string;
    /**
     * Configuration object.
     *
     * @todo typedef
     * @type {client.BrowserClientConfig|client.NodeClientConfig}
     */
    config: client.BrowserClientConfig | client.NodeClientConfig;
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
     * Runtime platform in which the client is executed, i.e. 'browser' or 'node'.
     *
     * @type {string}
     */
    target: string;
    /**
     * Instance of the {@link client.ContextManager} class.
     *
     * The context manager requires the socket to be connected therefore it can be
     * safely used only after `client.init()` has been fulfilled.
     *
     * @see {@link client.ContextManager}
     * @type {client.ContextManager}
     */
    contextManager: client.ContextManager;
    /**
     * Instance of the {@link client.PluginManager} class.
     *
     * The plugin manager requires the socket to be connected therefore it can be
     * safely used only after `client.init()` has been fulfilled.
     *
     * @see {@link client.PluginManager}
     * @type {client.PluginManager}
     */
    pluginManager: client.PluginManager;
    /**
     * Instance of the {@link client.StateManager} class.
     *
     * The state manager requires the socket to be connected therefore it can be
     * safely used only after `client.init()` has been fulfilled.
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
     * Method to be called before {@link client.Client#start} in the initialization
     * lifecycle of the soundworks client.
     *
     * This method is implicitely called by {@link client.Client#start} if not done
     * explictely by the user code.
     *
     * What it does:
     * - connect the sockets to be server
     * - perform the handshake with soundworks server (retrieve id, etc.)
     * - launch the state manager
     * - initialize all registered plugin
     *
     * After `await client.init()`, the {@link client.StateManager}
     * and the {@link client.PluginManager}  can be safely used.
     */
    init(): Promise<void>;
    /**
     * Method to be called when {@link client.Client#init} has finished in the
     * initialization lifecycle of the soundworks client.
     *
     * Calling `client.start()` will lazily execute `client.init` if `init has not been
     * call manually
     *
     * What it does:
     * - starts all the registered contexts
     */
    start(): Promise<void>;
    /**
     * Stop the client. Stops all started contexts, plugins and terminates the socket
     * connections.
     */
    stop(): Promise<void>;
    /**
     * Get the global audit state of the application. The audit tracks global informations
     * such as the number of connected clients, network latency estimation, etc. It is
     * usefull for controller clients that should give the user some overview about
     * the state of the application.
     *
     * The audit state is lazily attached to the client only if this method is called.
     *
     * @throws Will throw if called before `client.init()`
     */
    getAuditState(): Promise<any>;
}
//# sourceMappingURL=Client.d.ts.map