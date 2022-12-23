export default PluginManager;
/**
 * Manage the plugins lifecycle and their possible inter-dependencies.
 *
 * @memberof client
 * @extends BasePluginManager
 * @inheritdoc
 */
declare class PluginManager extends BasePluginManager {
    /**
     * @param {client.Client} client - The soundworks client instance.
     */
    constructor(client: client.Client);
    register(id: any, factory: any, options?: {}, deps?: any[]): void;
    /**
     * @protected
     * @ignore
     */
    protected getRegisteredPlugins(): any[];
}
import BasePluginManager from "../common/BasePluginManager.js";
//# sourceMappingURL=PluginManager.d.ts.map