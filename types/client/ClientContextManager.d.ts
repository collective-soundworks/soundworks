export const kClientContextManagerStart: unique symbol;
export const kClientContextManagerStop: unique symbol;
export const kClientContextManagerRegister: unique symbol;
export default ClientContextManager;
/**
 * Manage the different contexts and their lifecycle.
 *
 * See {@link Client#contextManager}
 *
 * _WARNING: In most cases, you should not have to manipulate the context manager directly._
 *
 * @hideconstructor
 */
declare class ClientContextManager {
    /**
     * Retrieve a started context from its name.
     *
     * _WARNING: Most of the time, you should not have to call this method manually._
     *
     * @param {string} contextName - Name of the context.
     * @returns {Promise<ClientContext>}
     */
    get(contextName: string): Promise<ClientContext>;
    /**
     * Register the context into the manager. Is called in context constructor.
     *
     * @param {ClientContext} context - The context to be registered.
     * @private
     */
    private [kClientContextManagerRegister];
    /**
     * Start all registered contexts. Called during `client.start()`
     * @private
     */
    private [kClientContextManagerStart];
    /**
     * Stop all registered contexts. Called during `client.stop()`
     * @private
     */
    private [kClientContextManagerStop];
    #private;
}
