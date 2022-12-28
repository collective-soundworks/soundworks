export default Server;
/**
 * Server side entry point for a `soundworks` application.
 *
 * This object hosts configuration informations, as well as methods to
 * initialize and start the application. It is also responsible for creating
 * the static file (http) server as well as the socket server.
 *
 * @memberof server
 *
 * @param {server.ServerConfig} config
 * @example
 * import { Server } from '@soundworks/core/server';
 * const server = new Server({
 *   app: {
 *     name: 'my-example-app',
 *     clients: { myClient: { target: 'node' } },
 *   },
 *   env: {
 *     port: 8888,
 *   },
 * });
 * await server.init();
 * await server.start();
 */
declare class Server {
    constructor(config: any);
    /**
     * Configuration informations.
     * Defaults to:
     * ```
     * {
     *   env: {
     *     type: 'development',
     *     port: 8000,
     *     subfolder: '',
     *     useHttps: false,
     *     httpsInfos: null,
     *   },
     *   app: {
     *     name: 'soundworks',
     *     clients: {},
     *   },
     * }
     * ```
     */
    config: any;
    /**
     * Router. Internally use polka.
     * (cf. {@link https://github.com/lukeed/polka})
     */
    router: any;
    /**
     * Http(s) server instance. The node `http` or `https` module instance
     * (cf. {@link https://nodejs.org/api/http.html})
     */
    httpServer: any;
    /**
     * Key / value storage with Promise based Map API
     * basically a wrapper around kvey (cf. {@link https://github.com/lukechilds/keyv})
     * @private
     */
    private db;
    /**
     * The {@link server.Sockets} instance. A small wrapper around
     * [`ws`](https://github.com/websockets/ws) server.
     * @see {@link server.Sockets}
     * @type {server.Sockets}
     */
    sockets: server.Sockets;
    /**
     * The {@link server.PluginManager} instance.
     * @see {@link server.PluginManager}
     * @type {server.PluginManager}
     */
    pluginManager: server.PluginManager;
    /**
     * The {@link server.StateManager} instance.
     * @see {@link server.StateManager}
     * @type {server.StateManager}
     */
    stateManager: server.StateManager;
    /**
     * The {@link server.ContextManager} instance.
     *
     */
    contextManager: ContextManager;
    /**
     * If https is required, will contain informations about the certificates
     * (self-signed, validity dates, etc.)
     */
    httpsInfos: {
        selfSigned: boolean;
        CN: any;
        altNames: any;
        validFrom: any;
        validTo: any;
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
     * Current status of the server ['idle', 'inited', 'started']
     */
    status: string;
    /** @private */
    private _applicationTemplateConfig;
    /** @private */
    private _onStatusChangeCallbacks;
    /** @private */
    private _auditState;
    /**
     * Method to be called before `start` in the initialization lifecycle of the
     * soundworks server. Note that if `init()`` is not explicitely called, `start()`
     *  will call it implicitely.
     *
     * What it does:
     * - create the audit state
     * - prepapre http(s) server and routing according to the informations
     * declared in `config.app.clients`
     * - starts all registered plugins
     *
     * After `await server.init()`, you can safely use the StateManager, as well
     * as any registered Plugins.
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
     * Method to be called when `init` step is done in the initialization
     * lifecycle of the soundworks server. If `server.init()` has not been called
     * explicitely, `server.start()` will call it automatically.
     *
     * What it does:
     * - starts all registered contexts (context are automatically registered
     * when instantiated)
     * - start the web socket server
     * - launch the HTTP server on given port
     *
     * After `await server.start()` the server is ready to accept incoming connexions
     */
    start(): Promise<any>;
    /**
     * Stop the server, close all existing WebSocket connections.
     * Mainly usefull for test.
     */
    stop(): Promise<void>;
    /**
     * Open the route for a given client.
     * @private
     */
    private _openClientRoute;
    /**
     * Socket connection callback.
     * @private
     */
    private _onSocketConnection;
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
     * Configure the server to work out-of-the box with the soundworks-template
     * directory tree structure.
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
     */
    setDefaultTemplateConfig(): void;
    /**
     * Define your own template path, template engine, and clientConfig function.
     * This method is for very advanced use-cases and only be used if you know what
     * you are doing. As such its behavior could probably be improved a lot...
     *
     * If you end up using this, please contact me to explain your use-case :)
     */
    setCustomTemplateConfig(options: any): void;
    /**
     * Get the global audit state of the application.
     *
     * @throws Will throw if called before `server.init()`
     */
    getAuditState(): Promise<any>;
}
import ContextManager from "./ContextManager.js";
//# sourceMappingURL=Server.d.ts.map