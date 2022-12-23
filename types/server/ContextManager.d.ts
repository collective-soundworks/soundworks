export default ContextManager;
/**
 * Manage the different server-side contexts and their lifecycle. The `ContextManager`
 * is automatically instantiated by the {@link server.Server}.
 *
 * _WARNING: Most of the time, you should not have to manipulate the context manager directly._
 *
 * @memberof server
 */
declare class ContextManager {
    /**
     * @param {server.Server} server - Instance of the soundworks server.
     */
    constructor(server: server.Server);
    /** @private */
    private server;
    /** @private */
    private _contexts;
    /** @private */
    private _contextStartPromises;
    /**
     * Register a context in the manager.
     * This method is called in the {@link server.Context} constructor
     *
     * @param {server.Context} context - Context instance to register.
     *
     * @private
     */
    private register;
    /**
     * Retrieve a started context from its name.
     *
     * @see {server.Context#name}
     * @param {String} contextName - Name of the context.
     *
     * @private
     */
    private get;
    /**
     * Called when a client connects to the server (websocket handshake)
     *
     * @param {server.Client} client
     *
     * @private
     */
    private addClient;
    /**
     * Called when a client connects to the server (websocket 'close' event)
     *
     * @param {server.Client} client
     *
     * @private
     */
    private removeClient;
    /**
     * Start all contexts registered before `await server.start()`.
     * Called on {@link server.Server#start}
     *
     * @private
     */
    private start;
    /**
     * Stop all contexts. Called on {@link server.Server#stop}
     *
     * @private
     */
    private stop;
}
//# sourceMappingURL=ContextManager.d.ts.map