export default Context;
/**
 * Base class to extend in order to create the server-side counterpart of
 * a {@link client.Context}. If not defined, a default context will be created
 * and used by the server.
 *
 * @memberof server
 */
declare class Context {
    constructor(server: any, roles?: any[]);
    /**
     * soundworks server
     * @type {server.Server}
     */
    server: server.Server;
    /**
     * List of clients that are currently in this context
     * @type {Client[]}
     */
    clients: Client[];
    /**
     * Status of the context ('idle', 'inited', 'started' or 'errored')
     * @type {String}
     */
    status: string;
    roles: Set<any>;
    /**
     * Name of the context, default to the class name.
     * Override the `get name()` getter to use a user-defined context name.
     */
    get name(): string;
    /**
     * Method automatically called when the server starts, or lazilly called if
     * the context is created after `server.start()`
     *
     * _WARNING: this method should never be called manually._
     */
    start(): Promise<void>;
    /**
     * Method automatically called when the server stops.
     *
     * _WARNING: this method should never be called manually._
     */
    stop(): Promise<void>;
    /**
     * Method automatically called when the client enters the context.
     *
     * _WARNING: this method should never be called manually._
     */
    enter(client: any): Promise<void>;
    /**
     * Method automatically called when the client exits the context.
     *
     * _WARNING: this method should never be called manually._
     */
    exit(client: any): Promise<void>;
}
import Client from "./Client.js";
//# sourceMappingURL=Context.d.ts.map