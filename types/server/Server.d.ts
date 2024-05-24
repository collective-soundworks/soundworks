export const kServerOnSocketConnection: unique symbol;
export default Server;
/**
 * Configuration object for the server.
 */
export type ServerConfig = {
    /**
     * - Application configration object.
     */
    app?: {
        clients: object;
        name?: string;
        author?: string;
    };
    /**
     * - Environment configration object.
     */
    env?: {
        useHttps: boolean;
        serverAddress: string;
        port: number;
        httpsInfos?: obj;
        subpath?: string;
    };
};
/**
 * The `Server` class is the main entry point for the server-side of a soundworks
 * application.
 *
 * The `Server` instance allows to access soundworks components such as {@link server.StateManager},
 * {@link server.PluginManager},{@link server.Socket} or {@link server.ContextManager}.
 * Its is also responsible for handling the initialization lifecycles of the different
 * soundworks components.
 *
 * ```
 * import { Server } from '@soundworks/core/server';
 *
 * const server = new Server({
 *   app: {
 *     name: 'my-example-app',
 *     clients: {
 *       player: { target: 'browser', default: true },
 *       controller: { target: 'browser' },
 *       thing: { target: 'node' }
 *     },
 *   },
 *   env: {
 *     port: 8000,
 *   },
 * });
 *
 * await server.start();
 * ```
 *
 * According to the clients definitions provided in `config.app.clients`, the
 * server will automatically create a dedicated route for each browser client role.
 * For example, given the config object of the example above that defines two
 * different client roles for browser targets (i.e. `player` and `controller`):
 *
 * ```
 * config.app.clients = {
 *   player: { target: 'browser', default: true },
 *   controller: { target: 'browser' },
 * }
 * ```
 *
 * The server will listen to the following URLs:
 * - `http://127.0.0.1:8000/` for the `player` role, which is defined as the default client.
 * - `http://127.0.0.1:8000/controller` for the `controller` role.
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
     * Instance of the {@link server.PluginManager} class.
     *
     * @see {@link server.PluginManager}
     * @type {server.PluginManager}
     */
    pluginManager: server.PluginManager;
    /**
     * Instance of the {@link server.StateManager} class.
     *
     * @see {@link server.StateManager}
     * @type {server.StateManager}
     */
    stateManager: server.StateManager;
    /**
     * Instance of the {@link server.ContextManager} class.
     *
     * @see {@link server.ContextManager}
     * @type {server.ContextManager}
     */
    contextManager: server.ContextManager;
    /**
     * If `https` is required, hold informations about the certificates, e.g. if
     * self-signed, the dates of validity of the certificates, etc.
     */
    httpsInfos: {
        selfSigned: boolean;
        CN: string;
        altNames: string[];
        validFrom: string;
        validTo: string;
        isValid: boolean;
        daysRemaining: number;
    } | {
        selfSigned: boolean;
        CN?: undefined;
        altNames?: undefined;
        validFrom?: undefined;
        validTo?: undefined;
        isValid?: undefined;
        daysRemaining?: undefined;
    } | {
        selfSigned: boolean;
        CN?: undefined;
        altNames?: undefined;
        validFrom?: undefined;
        validTo?: undefined;
        isValid?: undefined;
        daysRemaining?: undefined;
    };
    /**
     * Status of the server, 'idle', 'inited', 'started' or 'errored'.
     *
     * @type {string}
     */
    status: string;
    /**
     * Simple key / value database with Promise based Map API store on filesystem,
     * basically a tiny wrapper around the `kvey` package.
     *
     * @private
     * @see {@link https://github.com/lukechilds/keyv}
     */
    private db;
    /** @private */
    private _applicationTemplateOptions;
    /** @private */
    private _onStatusChangeCallbacks;
    /** @private */
    private _onClientConnectCallbacks;
    /** @private */
    private _onClientDisconnectCallbacks;
    /** @private */
    private _auditState;
    /** @private */
    private _pendingConnectionTokens;
    /** @private */
    private _trustedClients;
    /**
     * Given config object merged with the following defaults:
     * @example
     * {
     *   env: {
     *     type: 'development',
     *     port: 8000,
     *     serverAddress: null,
     *     subpath: '',
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
     * Id of the server, a constant set to -1
     * @type {number}
     * @readonly
     */
    readonly get id(): number;
    /**
     * Instance of the express router.
     *
     * The router can be used to open new route, for example to expose a directory
     * of static assets (in default soundworks applications only the `public` is exposed).
     *
     * @see {@link https://github.com/expressjs/express}
     * @example
     * import { Server } from '@soundworks/core/server.js';
     * import express from 'express';
     *
     * // create the soundworks server instance
     * const server = new Server(config);
     *
     * // expose assets located in the `soundfiles` directory on the network
     * server.router.use('/soundfiles', express.static('soundfiles')));
     */
    get router(): any;
    /**
     * Raw Node.js `http` or `https` instance
     *
     * @see {@link https://nodejs.org/api/http.html}
     * @see {@link https://nodejs.org/api/https.html}
     */
    get httpServer(): any;
    /**
     * Instance of the {@link ServerSockets} class.
     *
     * @type {ServerSockets}
     */
    get sockets(): ServerSockets;
    /**
     * The `init` method is part of the initialization lifecycle of the `soundworks`
     * server. Most of the time, the `init` method will be implicitly called by the
     * {@link server.Server#start} method.
     *
     * In some situations you might want to call this method manually, in such cases
     * the method should be called before the {@link server.Server#start} method.
     *
     * What it does:
     * - create the audit state
     * - prepapre http(s) server and routing according to the informations
     * declared in `config.app.clients`
     * - initialize all registered plugins
     *
     * After `await server.init()` is fulfilled, the {@link server.Server#stateManager}
     * and all registered plugins can be safely used.
     *
     * @example
     * const server = new Server(config);
     * await server.init();
     * await server.start();
     * // or implicitly called by start
     * const server = new Server(config);
     * await server.start(); // init is called implicitely
     */
    init(): Promise<void>;
    /**
     * The `start` method is part of the initialization lifecycle of the `soundworks`
     * server. The `start` method will implicitly call the {@link server.Server#init}
     * method if it has not been called manually.
     *
     * What it does:
     * - implicitely call {@link server.Server#init} if not done manually
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
     * be usefull for unit testing or similar situations where you want to create
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
    /**
     * Open the route for a given client.
     * @private
     */
    private _openClientRoute;
    onClientConnect(callback: any): () => boolean;
    onClientDisconnect(callback: any): () => boolean;
    /**
     * Create namespaced databases for core and plugins
     * (kind of experimental API do not expose in doc for now)
     *
     * @note - introduced in v3.1.0-beta.1
     * @note - used by core and plugin-audio-streams
     * @private
     */
    private createNamespacedDb;
    onStatusChange(callback: any): () => boolean;
    /** @private */
    private _dispatchStatus;
    /**
     * Configure the server to work _out-of-the-box_ within the soundworks application
     * template provided by `@soundworks/create.
     *
     * - uses [template-literal](https://www.npmjs.com/package/template-literal) package
     * as html templateEngine
     * - define `.build/server/tmpl` as the directory in which html template can be
     * found
     * - define the `clientConfigFunction` function that return client compliant
     * config object to be injected in the html template.
     *
     * Also expose two public directory:
     * - the `public` directory which is exposed behind the root path
     * - the `./.build/public` directory which is exposed behind the `build` path
     *
     * _Note: except in very rare cases (so rare that they are quite difficult to imagine),
     * you should rely on these defaults._
     */
    useDefaultApplicationTemplate(): void;
    /**
     * Define custom template path, template engine, and clientConfig function.
     * This method is proposed for very advanced use-cases and should very probably
     * be improved. If you consider using this for some reason, please get in touch
     * first to explain your use-case :)
     */
    setCustomApplicationTemplateOptions(options: any): void;
    /**
     * Attach and retrieve the global audit state of the application.
     *
     * The audit state is a {@link server.SharedState} instance that keeps track of
     * global informations about the application such as, the number of connected
     * clients, network latency estimation, etc.
     *
     * The audit state is created by the server on start up.
     *
     * @returns {Promise<server.SharedState>}
     * @throws Will throw if called before `server.init()`
     * @see {@link server.SharedState}
     * @example
     * const auditState = await server.getAuditState();
     * auditState.onUpdate(() => console.log(auditState.getValues()), true);
     */
    getAuditState(): Promise<server.SharedState>;
    /** @private */
    private isProtected;
    /** @private */
    private isValidConnectionToken;
    /**
     * Check if the given client is trusted, i.e. config.env.type == 'production'
     * and the client is protected behind a password.
     *
     * @param {server.Client} client - Client to be tested
     * @returns {Boolean}
     */
    isTrustedClient(client: server.Client): boolean;
    /**
     * Check if the token from a client is trusted, i.e. config.env.type == 'production'
     * and the client is protected behind a password.
     *
     * @param {Number} clientId - Id of the client
     * @param {Number} clientIp - Ip of the client
     * @param {String} token - Token to be tested
     * @returns {Boolean}
     */
    isTrustedToken(clientId: number, clientIp: number, token: string): boolean;
    /**
     * Socket connection callback.
     * @private
     */
    private [kServerOnSocketConnection];
    #private;
}
import ServerSockets from './ServerSockets.js';
