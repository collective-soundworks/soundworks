export default Context;
/**
 * Base class to extend in order to implement a new Context.
 *
 * In the `soundworks` paradigm, a client has a "role" (e.g. _player_, _controller_)
 * see {@link client.Client#role}) and can be in different "contexts" (e.g. different
 * part of the experience such as sections of a music piece, etc.). This class
 * provides a simple and unified way to model these reccuring aspects of an application.
 *
 * You can also think of a `Context` as a state of a state machine from which a
 * client can `enter()` or `exit()` (be aware that `soundworks` does not provide
 * an implementation for the state machine).
 *
 * Optionally, a `Context` can also have a server-side counterpart to perform
 * some logic (e.g. updating some global shared state) when a client enters or exits
 * the context. In such case, `soundworks` guarantees that the server-side
 * logic is executed before the `enter()` and `exit()` promises are fulfilled.
 *
 * ```
 * import { Client, Context } from '@soundworks/core/index.js'
 *
 * const client = new Client(config);
 *
 * class MyContext extends Context {
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
     * The soundworks client instance.
     */
    client: Client;
    /**
     * Status of the context, i.e. 'idle', 'inited', 'started', 'errored'
     */
    status: string;
    /**
     * Name of the context. Defaults to the class name, override to use a user-defined name.
     *
     * @returns {string} - Name of the context.
     * @example
     * class MyContext extends Context {
     *   get name() {
     *     return 'my-user-defined-context-name';
     *   }
     * }
     */
    get name(): string;
    /**
     * Start the context. This method is automatically called when `await client.start()`
     * is called, or lazilly called when entering the context (i.e. `context.enter()`)
     * if the context has been created after `client.start()`.
     *
     * In some situation, you might want to implement this method to handle application
     * wise behavior regardeless the client enters or exists the context.
     */
    start(): Promise<void>;
    /**
     * Stop the context. This method is automatically called when `await client.stop()`
     * is called.
     *
     * In some situation, you might want to implement this method to handle application
     * wise behavior regardeless the client enters or exists the context.
     */
    stop(): Promise<void>;
    /**
     * Enter the context. Implement this method to define the logic that should be
     * done (e.g. creating a shared state, etc.) when the context is entered.
     *
     * If a server-side part of the context is defined (i.e. a context with the same
     * {@link client.Context#name}), the corresponding server-side `enter()` method
     * will be executed before the returned Promise is fulfilled.
     *
     * If the context has not been started yet, the `start` method is implicitely executed.
     *
     * @returns {Promise} - Promise that resolves when the context is entered.
     * @example
     * class MyContext extends Context {
     *   async enter() {
     *     await super.enter();
     *     this.state = await this.client.stateManager.create('my-context-state');
     *   }
     *
     *   async exit() {
     *     await super.exit();
     *     await this.state.delete();
     *   }
     * }
     */
    enter(): Promise<any>;
    /**
     * Exit the context. Implement this method to define the logic that should be
     * done (e.g. delete a shared state, etc.) when the context is exited.
     *
     * If a server-side part of the context is defined (i.e. a context with the same
     * {@link client.Context#name}), the corresponding server-side `exit()` method
     * will be executed before the returned Promise is fulfilled.
     *
     * @returns {Promise} - Promise that resolves when the context is exited.
     * @example
     * class MyContext extends Context {
     *   async enter() {
     *     await super.enter();
     *     this.state = await this.client.stateManager.create('my-context-state');
     *   }
     *
     *   async exit() {
     *     await super.exit();
     *     await this.state.delete();
     *   }
     * }
     */
    exit(): Promise<any>;
}
import Client from "./Client.js";
//# sourceMappingURL=Context.d.ts.map