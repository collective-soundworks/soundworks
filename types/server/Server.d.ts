export const kServerOnSocketConnection: unique symbol;
export const kServerIsValidConnectionToken: unique symbol;
export const kServerOnStatusChangeCallbacks: unique symbol;
export default Server;
/**
 * The `Server` class is the main entry point for soundworks server-side project.
 *
 * The `Server` instance allows to access soundworks components such as {@link ServerStateManager},
 * {@link ServerPluginManager}, {@link ServerSocket} or {@link ServerContextManager}.
 * Its is also responsible for handling the initialization lifecycle of the different
 * soundworks components.
 *
 * ```
 * import { Server } from '@soundworks/core/server';
 *
 * const server = new Server({
 *   app: {
 *     name: 'my-example-app',
 *     clients: {
 *       player: { runtime: 'browser', default: true },
 *       controller: { runtime: 'browser' },
 *       thing: { runtime: 'node' }
 *     },
 *   },
 *   env: {
 *     port: 8000,
 *   },
 * });
 *
 * await server.start();
 * ```
 */
declare class Server {
    /**
     * @param {ServerConfig} config - Configuration object for the server.
     * @throws
     * - If `config.app.clients` is empty.
     * - If a `node` client is defined but `config.env.serverAddress` is not defined.
     * - if `config.env.useHttps` is `true` and `config.env.httpsInfos` is not `null`
     *   (which generates self signed certificated), `config.env.httpsInfos.cert` and
     *   `config.env.httpsInfos.key` should point to valid cert files.
     */
    constructor(config: ServerConfig);
    /**
     * Given config object merged with the following defaults:
     * @example
     * {
     *   env: {
     *     type: 'development',
     *     port: 8000,
     *     serverAddress: null,
     *     baseUrl: '',
     *     useHttps: false,
     *     httpsInfos: null,
     *     crossOriginIsolated: true,
     *     verbose: true,
     *   },
     *   app: {
     *     name: 'soundworks',
     *     clients: {},
     *   }
     * }
     * @type {ServerConfig}
     */
    get config(): ServerConfig;
    /**
     * Package version.
     *
     * @type {string}
     */
    get version(): string;
    /**
     * Id of the server, a constant set to `-1`
     * @type {number}
     * @readonly
     */
    readonly get id(): number;
    /**
     * Status of the server.
     *
     * @type {'idle'|'inited'|'started'|'errored'}
     */
    get status(): "idle" | "inited" | "started" | "errored";
    set router(router: any);
    /**
     * Instance of the router if any.
     *
     * The router can be used to open new route, for example to expose a directory
     * of static assets (in default soundworks applications only the `public` is exposed).
     *
     * @example
     * import { Server } from '@soundworks/core/server.js';
     * import { loadConfig, configureHttpRouter } from '@soundworks/helpers/server.js';
     *
     * // create the server instance
     * const server = new Server(loadConfig());
     * // configure the express router provided by the helpers
     * configureHttpRouter(server);
     *
     * // expose assets located in the `soundfiles` directory on the network
     * server.router.use('/soundfiles', express.static('soundfiles')));
     */
    get router(): any;
    /**
     * Instance of the Node.js `http.Server` or `https.Server`
     *
     * @see {@link https://nodejs.org/api/http.html#class-httpserver}
     * @see {@link https://nodejs.org/api/https.html#class-httpsserver}
     */
    get httpServer(): any;
    /**
     * Simple key / value filesystem database with Promise based Map API.
     *
     * Basically a tiny wrapper around the {@link https://github.com/lukechilds/keyv} package.
     */
    get db(): any;
    /**
     * Instance of the {@link ServerSockets} class.
     *
     * @type {ServerSockets}
     */
    get sockets(): ServerSockets;
    /**
     * Instance of the {@link ServerPluginManager} class.
     *
     * @type {ServerPluginManager}
     */
    get pluginManager(): ServerPluginManager<any>;
    /**
     * Instance of the {@link ServerStateManager} class.
     *
     * @type {ServerStateManager}
     */
    get stateManager(): ServerStateManager;
    /**
     * Instance of the {@link ServerContextManager} class.
     *
     * @type {ServerContextManager}
     */
    get contextManager(): ServerContextManager<any>;
    /**
     * Register a callback to execute when status change.
     *
     * Status are dispatched in the following order:
     * - 'http-server-ready'
     * - 'inited'
     * - 'started'
     * - 'stopped'
     * during the lifecycle of the server. If an error occurs the 'errored' status is propagated.
     *
     * @param {function} callback
     */
    onStatusChange(callback: Function): () => boolean;
    /**
     * Attach and retrieve the global audit state of the application.
     *
     * The audit state is a {@link SharedState} instance that keeps track of
     * global information about the application such as, the number of connected
     * clients, network latency estimation, etc.
     *
     * The audit state is created by the server on start up.
     *
     * @returns {Promise<SharedState>}
     * @throws Will throw if called before `server.init()`
     *
     * @example
     * const auditState = await server.getAuditState();
     * auditState.onUpdate(() => console.log(auditState.getValues()), true);
     */
    getAuditState(): Promise<SharedState>;
    /**
     * The `init` method is part of the initialization lifecycle of the `soundworks`
     * server. Most of the time, the `init` method will be implicitly called by the
     * {@link Server#start} method.
     *
     * In some situations you might want to call this method manually, in such cases
     * the method should be called before the {@link Server#start} method.
     *
     * What it does:
     * 1) Create the audit state
     * 2) Create the HTTP(s) server
     * 3) Initialize registered plugins
     *
     * Between steps 2 and 3, the 'http-server-ready' event status is dispatched so
     * that consumer code can register its router before plugin initialization:
     * ```js
     * server.onStatusChange(status => {
     *   if (status === 'http-server-ready') {
     *     server.httpServer.on('request', router);
     *   }
     * });
     * ```
     *
     * After `await server.init()` is fulfilled, the {@link Server#stateManager}
     * and all registered plugins can be safely used.
     *
     * @example
     * const server = new Server(config);
     * await server.init();
     * await server.start();
     * // or implicitly called by start
     * const server = new Server(config);
     * await server.start(); // init is called implicitly
     */
    init(): Promise<void>;
    /**
     * The `start` method is part of the initialization lifecycle of the `soundworks`
     * server. The `start` method will implicitly call the {@link Server#init}
     * method if it has not been called manually.
     *
     * What it does:
     * - implicitly call {@link Server#init} if not done manually
     * - launch the HTTP and WebSocket servers
     * - start all created contexts. To this end, you will have to call `server.init`
     * manually and instantiate the contexts between `server.init()` and `server.start()`
     *
     * After `await server.start()` the server is ready to accept incoming connections
     *
     * @example
     * import { Server } from '@soundworks/core/server.js'
     *
     * const server = new Server(config);
     * await server.start();
     */
    start(): Promise<any>;
    /**
     * Stops all started contexts, plugins, close all the socket connections and
     * the http(s) server.
     *
     * In most situations, you might not need to call this method. However, it can
     * be useful for unit testing or similar situations where you want to create
     * and delete several servers in the same process.
     *
     * @example
     * import { Server } from '@soundworks/core/server.js'
     *
     * const server = new Server(config);
     * await server.start();
     *
     * await new Promise(resolve => setTimeout(resolve, 1000));
     * await server.stop();
     */
    stop(): Promise<void>;
    onClientConnect(callback: any): () => boolean;
    onClientDisconnect(callback: any): () => boolean;
    /** @private */
    private isProtectedClientRole;
    /**
     * Generate a token to secure client connection.
     *
     * The token should be passed to the client-side `Client` config object, it will
     * be internally used to check the WebSocket connection and reject it if the
     * token is invalid.
     */
    generateAuthToken(req: any): string;
    /**
     * Check if the given client is trusted, i.e. config.env.type == 'production'
     * and the client is protected behind a password.
     *
     * @param {ServerClient} client - Client to be tested
     * @returns {boolean}
     */
    isTrustedClient(client: ServerClient): boolean;
    /**
     * Check if the token from a client is trusted, i.e. config.env.type == 'production'
     * and the client is protected behind a password.
     *
     * @param {number} clientId - Id of the client
     * @param {string} clientIp - Ip of the client
     * @param {string} token - Token to be tested
     * @returns {boolean}
     */
    isTrustedToken(clientId: number, clientIp: string, token: string): boolean;
    /**
     * Create namespaced databases for core and plugins
     * (kind of experimental API do not expose in doc for now)
     *
     * @note - introduced in v3.1.0-beta.1
     * @note - used by core and plugin-audio-streams
     * @private
     */
    private createNamespacedDb;
    /**
     * @deprecated
     */
    useDefaultApplicationTemplate(): void;
    /**
     * Socket connection callback.
     * @private
     */
    private [kServerOnSocketConnection];
    /** @private */
    private [kServerIsValidConnectionToken];
    /** @private */
    private [kServerOnStatusChangeCallbacks];
    #private;
}
import ServerSockets from './ServerSockets.js';
import ServerPluginManager from './ServerPluginManager.js';
import ServerStateManager from './ServerStateManager.js';
import ServerContextManager from './ServerContextManager.js';
import ServerClient from './ServerClient.js';
//# sourceMappingURL=Server.d.ts.map