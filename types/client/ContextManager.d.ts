export default ContextManager;
/**
 * Manage the different contexts and their lifecycle.
 *
 * _WARNING: Most of the time, you should not have to manipulate the context manager directly._
 *
 * @memberof client
 * @hideconstructor
 */
declare class ContextManager {
    /** @private */
    private _contexts;
    /** @private */
    private _contextStartPromises;
    /**
     * Register the context into the manager. Is called in context constructor.
     *
     * @param {client.Context} context - The context to be registered.
     * @private
     */
    private register;
    /**
     * Retrieve a started context from its name.
     *
     * _WARNING: Most of the time, you should not have to call this method manually._
     *
     * @param {string} contextName - Name of the context, a given in its constructor
     */
    get(contextName: string): Promise<any>;
    /**
     * Start all registered contexts. Called during `client.start()`
     *
     * @private
     */
    private start;
    /**
     * Stop all registered contexts. Called during `client.stop()`
     *
     * @private
     */
    private stop;
}
//# sourceMappingURL=ContextManager.d.ts.map