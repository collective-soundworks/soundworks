export default Context;
/**
 * Base class to extend for implementing a new Context.
 *
 * In the *soundworks* paradigm, a client has a "role" (see {@link client.Client#role})
 * and can be in different "contexts" (e.g. some part of the experience, different
 * sections of a music piece, etc.). This class gives a simple way to model these
 * reccuring aspects of an application.
 *
 * You can also think of a `Context` as a state in a state machine from which a
 * client can `enter()` or `exit()` (be aware that soundworks does however not
 * provide any implementation for the state machine out of the box).
 *
 * The `Context` can optionnaly allow to perform server-side logic when a client
 * enters or exits the context. In such case, soundworks guarantees that the server-side
 * logic is done before the `enter()` and `exit()` promises are fulfilled.
 *
 * ```
 * import { Client, Context } from '@soundworks/core/index.js'
 *
 * const client = new Client(config);
 *
 * class MyContext {
 *   async enter() {
 *     await super.enter();
 *     console.log(`client ${this.client.id} entered my context`);
 *   }
 *
 *   async exit() {
 *     await super.exit();
 *     console.log(`client ${this.client.id} exited my context`);
 *   }
 * }
 * const myContext = new MyContext(client);
 *
 * await client.start();
 * await myContext.enter();
 *
 * await new Promise(resolve => setTimeout(resolve, 2000));
 * await myContext.exit();
 * ```
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