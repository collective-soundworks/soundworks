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
     * @param {client.BrowserClientConfig|client.NodeClientConfig} config -
     *  Configuration of the soundworks client.
     * @throws Will throw if the given config object is invalid.
     */
    constructor(config: client.BrowserClientConfig | client.NodeClientConfig);
    /**
     * Role of the client in the application.
     *
     * @type {string}
     */
    role: string;
    /**
     * Configuration object.
     *
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
     * Runtime platform on which the client is executed, i.e. 'browser' or 'node'.
     *
     * @type {string}
     */
    target: string;
    /**
     * Instance of the {@link client.ContextManager} class.
     *
     * The context manager can be safely used after `client.init()` has been fulfilled.
     *
     * @see {@link client.ContextManager}
     * @type {client.ContextManager}
     */
    contextManager: client.ContextManager;
    /**
     * Instance of the {@link client.PluginManager} class.
     *
     * The context manager can be safely used after `client.init()` has been fulfilled.
     *
     * @see {@link client.PluginManager}
     * @type {client.PluginManager}
     */
    pluginManager: client.PluginManager;
    /**
     * Instance of the {@link client.StateManager} class.
     *
     * The context manager can be safely used after `client.init()` has been fulfilled.
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
    private _onStatusChangeCallbacks;
    /** @private */
    private _auditState;
    /**
     * The `init` method is part of the initialization lifecycle of the `soundworks`
     * client. Most of the time, the `init` method will be implicitly called by the
     * {@link client.Client#start} method.
     *
     * In some situations you might want to call this method manually, in such cases
     * the method should be called before the {@link client.Client#start} method.
     *
     * What it does:
     * - connect the sockets to be server
     * - perform the handshake with soundworks server (retrieve id, etc.)
     * - launch the state manager
     * - initialize all registered plugin
     *
     * After `await client.init()` is fulfilled, the {@link client.Client#stateManager},
     * the {@link client.Client#pluginManager} and the {@link client.Client#socket}
     * can be safely used.
     *
     * @example
     * import { Client } from '@soundworks/core/client.js'
     *
     * const client = new Client(config);
     * // optionnal explicit call of `init` before `start`
     * await client.init();
     * await client.start();
     */
    init(): Promise<void>;
    /**
     * The `start` method is part of the initialization lifecycle of the `soundworks`
     * client. The `start` method will implicitly call the {@link client.Client#init}
     * method if it has not been called manually.
     *
     * What it does:
     * - optionnaly call {@link client.Client#init}
     * - starts all the already created contexts (see {@link client.Context})
     *
     * @example
     * import { Client } from '@soundworks/core/client.js'
     *
     * const client = new Client(config);
     * await client.start();
     */
    start(): Promise<void>;
    /**
     * Stops all started contexts, plugins and terminates the socket connections.
     *
     * In most situations, you might not need to call this method. However, it can
     * be usefull for unit testing or similar situations where you want to create
     * and delete several clients in the same process.
     *
     * @example
     * import { Client } from '@soundworks/core/client.js'
     *
     * const client = new Client(config);
     * await client.start();
     *
     * await new Promise(resolve => setTimeout(resolve, 1000));
     * await client.stop();
     */
    stop(): Promise<void>;
    /**
     * Attach and retrieve the global audit state of the application.
     *
     * The audit state is a {@link client.SharedState} instance that keeps track of
     * global informations about the application such as, the number of connected
     * clients, network latency estimation, etc. It is usefull for controller client
     * roles to give the user an overview about the state of the application.
     *
     * The audit state is lazily attached to the client only if this method is called.
     *
     * @returns {Promise<client.SharedState>}
     * @throws Will throw if called before `client.init()`
     * @see {@link client.SharedState}
     * @example
     * const auditState = await client.getAuditState();
     * auditState.onUpdate(() => console.log(auditState.getValues()), true);
     */
    getAuditState(): Promise<client.SharedState>;
    /**
     * Listen for the status change ('inited', 'started', 'stopped') of the client.
     *
     * @param {Function} callback - Listener to the status change.
     * @returns {Function} Delete the listener.
     */
    onStatusChange(callback: Function): Function;
    /** @private */
    private _dispatchStatus;
}
//# sourceMappingURL=Client.d.ts.map