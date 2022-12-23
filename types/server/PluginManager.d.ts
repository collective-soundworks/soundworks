export default PluginManager;
/**
 * Manage the plugins lifecycle and their possible inter-dependencies.
 *
 * @memberof server
 */
declare class PluginManager extends BasePluginManager {
    register(id: any, factory?: any, options?: {}, deps?: any[]): void;
    /** private */
    checkRegisteredPlugins(registeredPlugins: any): void;
    /** @private */
    private addClient;
    /** @private */
    private removeClient;
}
import BasePluginManager from "../common/BasePluginManager.js";
//# sourceMappingURL=PluginManager.d.ts.map