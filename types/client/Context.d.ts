export default Context;
/**
 * Base class to extend for implementing a client of a soundworks application.
 *
 * @memberof client
 */
declare class Context {
    /**
     * @param {client.Client} client - The soundworks client instance.
     * @throws Will throw if the first argument is not a soundworks client instance.
     */
    constructor(client: client.Client);
    /**
     * The soundworks client instance
     */
    client: Client;
    /**
     * Status os the context ['idle', 'inited', 'started', 'errored']
     */
    status: string;
    /**
     * Getter that returns the name of the context, override to use a user-defined name
     *
     * @returns {string} - Name of the context.
     */
    get name(): string;
    /**
     * Start the context, this method is automatically called when `await client.start()`
     * is called.
     *
     * Should be overriden to handle application wise behavior regardeless the client
     * enters or exists the context.
     */
    start(): Promise<void>;
    /**
     * Stop the context, this method is automatically called when `await client.stop()`
     * is called.
     *
     * Should be overriden to handle application wise behavior regardeless the client
     * enters or exists the context.
     */
    stop(): Promise<void>;
    /**
     * Enter the context. If a server-side part of the context is defined (i.e. a
     * context with the same class name or user-defined name), the corresponding
     * server-side `enter()` method will be executed before the returned Promise
     * resolves.
     *
     * If the context has not been started yet, the `start` method is lazily called.
     *
     * @returns {Promise} - Promise that resolves when the context is entered.
     */
    enter(): Promise<any>;
    /**
     * Exit the context. If a server-side part of the context is defined (i.e. a
     * context with the same class name or user-defined name), the corresponding
     * server-side `exit()` method will be executed before the returned Promise
     * resolves.
     *
     *
     * @returns {Promise} - Promise that resolves when the context is exited.
     */
    exit(): Promise<any>;
}
import Client from "./Client.js";
//# sourceMappingURL=Context.d.ts.map