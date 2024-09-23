export const kClientVersionTest: unique symbol;
export const kClientOnStatusChangeCallbacks: unique symbol;
export default Client;
/**
 * The `Client` class is the main entry point for the client-side of a soundworks
 * application.
 *
 * A `soundworks` client can run seamlessly in a browser or in a Node.js runtime.
 *
 * It provides an access to the different soundworks components such as the {@link ClientStateManager},
 * {@link ClientPluginManager}, {@link ClientSocket} and the {@link ClientContextManager}.
 *
 * ```
 * import { Client } from '@soundworks/core/client.js';
 * // create a `Client` instance
 * const client = new Client({
 *   role: 'player',
 *   env: {
 *     useHttps: false,
 *     serverAddress: 'localhost',
 *     port: 8000,
 *   },
 * });
 * // start the client
 * await client.start();
 * ```
 */
declare class Client {
    /**
     * @param {ClientConfig} config - Configuration of the soundworks client.
     * @throws Will throw if the given config object is invalid.
     */
    constructor(config: ClientConfig);
    /**
     * Package version.
     *
     * @type {string}
     */
    get version(): string;
    /**
     * Role of the client in the application.
     *
     * @type {string}
     */
    get role(): string;
    /**
     * Configuration object.
     *
     * @type {ClientConfig}
     */
    get config(): ClientConfig;
    /**
     * Session id of the client.
     *
     * Incremeted positive integer generated and retrieved by the server during
     * `client.init`. The counter is reset when the server restarts.
     *
     * @type {number}
     */
    get id(): number;
    /**
     * Unique session uuid of the client (uuidv4).
     *
     * Generated and retrieved by the server during {@link Client#init}.
     * @type {string}
     */
    get uuid(): string;
    /**
     * Runtime platform on which the client is executed, i.e. 'browser' or 'node'.
     *
     * @type {string}
     */
    get target(): string;
    /**
     * Instance of the {@link client.Socket} class.
     *
     * @see {@link ClientSocket}
     * @type {ClientSocket}
     */
    get socket(): ClientSocket;
    /**
     * Instance of the {@link ClientContextManager} class.
     *
     * The context manager can be safely used after `client.init()` has been fulfilled.
     *
     * @see {@link ClientContextManager}
     * @type {ClientContextManager}
     */
    get contextManager(): ClientContextManager;
    /**
     * Instance of the {@link ClientPluginManager} class.
     *
     * The context manager can be safely used after `client.init()` has been fulfilled.
     *
     * @see {@link ClientPluginManager}
     * @type {ClientPluginManager}
     */
    get pluginManager(): ClientPluginManager;
    /**
     * Instance of the {@link ClientStateManager} class.
     *
     * The context manager can be safely used after `client.init()` has been fulfilled.
     *
     * @see {@link ClientStateManager}
     * @type {ClientStateManager}
     */
    get stateManager(): ClientStateManager;
    /**
     * Status of the client.
     *
     * @type {'idle'|'inited'|'started'|'errored'}
     */
    get status(): "idle" | "inited" | "started" | "errored";
    /**
     * The `init` method is part of the initialization lifecycle of the `soundworks`
     * client. Most of the time, the `init` method will be implicitly called by the
     * {@link Client#start} method.
     *
     * In some situations you might want to call this method manually, in such cases
     * the method should be called before the {@link Client#start} method.
     *
     * What it does:
     * - connect the sockets to be server
     * - perform the handshake with soundworks server (retrieve id, etc.)
     * - launch the state manager
     * - initialize all registered plugin
     *
     * After `await client.init()` is fulfilled, the {@link Client#stateManager},
     * the {@link Client#pluginManager} and the {@link Client#socket}
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
     * client. The `start` method will implicitly call the {@link Client#init}
     * method if it has not been called manually.
     *
     * What it does:
     * - implicitly call {@link Client#init} if not done manually
     * - start all created contexts. For that to happen, you will have to call `client.init`
     * manually and instantiate the contexts between `client.init()` and `client.start()`
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
     * The audit state is a {@link SharedState} instance that keeps track of
     * global informations about the application such as, the number of connected
     * clients, network latency estimation, etc. It is usefull for controller client
     * roles to give the user an overview about the state of the application.
     *
     * The audit state is lazily attached to the client only if this method is called.
     *
     * @returns {Promise<SharedState>}
     * @throws Will throw if called before `client.init()`
     * @see {@link SharedState}
     * @example
     * const auditState = await client.getAuditState();
     * auditState.onUpdate(() => console.log(auditState.getValues()), true);
     */
    getAuditState(): Promise<SharedState>;
    /**
     * Listen for the status change ('inited', 'started', 'stopped') of the client.
     *
     * @param {Function} callback - Listener to the status change.
     * @returns {Function} Function that delete the listener when executed.
     */
    onStatusChange(callback: Function): Function;
    [kClientOnStatusChangeCallbacks]: Set<any>;
    #private;
}
import ClientSocket from './ClientSocket.js';
import ClientContextManager from './ClientContextManager.js';
import ClientPluginManager from './ClientPluginManager.js';
import ClientStateManager from './ClientStateManager.js';
