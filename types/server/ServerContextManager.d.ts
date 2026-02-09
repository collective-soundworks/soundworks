export const kServerContextManagerStart: unique symbol;
export const kServerContextManagerStop: unique symbol;
export const kServerContextManagerAddClient: unique symbol;
export const kServerContextManagerRemoveClient: unique symbol;
export const kServerContextManagerRegister: unique symbol;
export const kServerContextManagerContexts: unique symbol;
export default ServerContextManager;
/**
 * Manage the different server-side contexts and their lifecycle.
 *
 * The `ServerContextManager` is automatically instantiated by the {@link Server}.
 *
 * _WARNING: Most of the time, you should not have to manipulate the context manager directly._
 *
 * @template T
 */
declare class ServerContextManager<T> {
    /**
     * @param {Server} server - Instance of the soundworks server.
     * @hideconstructor
     */
    constructor(server: Server);
    /**
     * Retrieve a started context from its name.
     *
     * _WARNING: Most of the time, you should not have to call this method manually._
     *
     * @param {string} contextName - Name of the context.
     * @return {Promise<T<ServerContext>>}
     */
    get(contextName: string): Promise<T<ServerContext>>;
    /**
     * Register a context in the manager.
     * This method is called in the {@link ServerContext} constructor
     *
     * @param {ServerContext} context - Context instance to register.
     *
     * @private
     */
    private [kServerContextManagerRegister];
    /**
     * Start all contexts registered before `await server.start()`.
     * Called on {@link Server#start}
     *
     * @private
     */
    private [kServerContextManagerStart];
    /**
     * Stop all contexts. Called on {@link Server#stop}
     *
     * @private
     */
    private [kServerContextManagerStop];
    /**
     * Called when a client connects to the server (websocket handshake)
     *
     * @param {ServerClient} client
     *
     * @private
     */
    private [kServerContextManagerAddClient];
    /**
     * Called when a client connects to the server (websocket 'close' event)
     *
     * @param {ServerClient} client
     *
     * @private
     */
    private [kServerContextManagerRemoveClient];
    /** @private */
    private [kServerContextManagerContexts];
    #private;
}
import ServerContext from './ServerContext.js';
import Server from './Server.js';
//# sourceMappingURL=ServerContextManager.d.ts.map