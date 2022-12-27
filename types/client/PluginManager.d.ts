export default PluginManager;
/**
 * The `PluginManager` allows to register, initialize and retrieve _soundworks_ plugins.
 *
 * Be aware that plugins should always be registered both client-side and server-side,
 * and be registered before {@link client.Client.start()} or {@link server.Client.start()}
 * are called.
 *
 * For more advanced use-cases, plugins can also be registered several times using
 * different user-defined ids.
 *
 * Refer to the plugins' documentation for more precise examples, and the specific API
 * the expose.
 *
 * ```
 * import { Client } from '@soundworks/core/client.js';
 * import platformPlugin from '@soundworks/platform-sync/client.js';
 *
 * const client = new Client({ role: 'player' });
 * client.pluginManager.register('sync', pluginSync);
 *
 * await client.start();
 *
 * const sync = await client.pluginManager.get('sync');
 *
 * setInterval(() => {
 *   // log the estimated global synced clock alongside the local clock.
 *   console.log(sync.getSyncTime(), sync.getLocalTime());
 * }, 1000);
 * ```
 *
 * @memberof client
 * @extends BasePluginManager
 * @inheritdoc
 * @hideconstructor
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