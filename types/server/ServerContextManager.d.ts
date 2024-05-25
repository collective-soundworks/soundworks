export const kContextManagerContexts: unique symbol;
export default ServerContextManager;
/**
 * Manage the different server-side contexts and their lifecycle.
 *
 * The `ServerContextManager` is automatically instantiated by the {@link server.Server}.
 *
 * _WARNING: Most of the time, you should not have to manipulate the context manager directly._
 *
 * @hideconstructor
 */
declare class ServerContextManager {
    /**
     * @param {server.Server} server - Instance of the soundworks server.
     */
    constructor(server: server.Server);
    /**
     * Retrieve a started context from its name.
     *
     * _WARNING: Most of the time, you should not have to call this method manually._
     *
     * @param {server.Context#name} contextName - Name of the context.
     */
    get(contextName: any): Promise<any>;
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
    [kContextManagerContexts]: ContextCollection;
    #private;
}
/** @private */
declare class ContextCollection {
    get length(): number;
    add(context: any): void;
    has(name: any): boolean;
    get(name: any): any;
    map(func: any): any[];
    filter(func: any): any[];
    #private;
}
