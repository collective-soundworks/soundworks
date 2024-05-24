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
     * Register the context into the manager. Is called in context constructor.
     *
     * @param {ClientContext} context - The context to be registered.
     * @private
     */
    private register;
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
     * Start all registered contexts. Called during `client.start()`
     * @private
     */
    private start;
    /**
     * Stop all registered contexts. Called during `client.stop()`
     * @private
     */
    private stop;
    #private;
}
