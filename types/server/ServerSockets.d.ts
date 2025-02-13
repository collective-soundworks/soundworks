export const kSocketsStart: unique symbol;
export const kSocketsStop: unique symbol;
export const kSocketsDeleteSocket: unique symbol;
export const kSocketsLatencyStatsWorker: unique symbol;
export const kSocketsDebugPreventHeartBeat: unique symbol;
export default ServerSockets;
/**
 * Manage all {@link ServerSocket} instances.
 *
 * _Important: In most cases, you should consider using a {@link SharedState}
 * rather than directly using the ServerSocket instance._
 */
declare class ServerSockets {
    constructor(server: any, config: any);
    /** @private */
    private entries;
    /** @private */
    private keys;
    /** @private */
    private values;
    forEach(func: any): void;
    /**
     * Initialize sockets, all sockets are added to two rooms by default:
     * - to the room corresponding to the client `role`
     * - to the '*' room that holds all connected sockets
     * @private
     */
    private [kSocketsStart];
    /**
     * Terminate all existing sockets.
     * @private
     */
    private [kSocketsStop];
    /**
     * Delete given socket.
     * @private
     */
    private [kSocketsDeleteSocket];
    [kSocketsLatencyStatsWorker]: any;
    [kSocketsDebugPreventHeartBeat]: boolean;
    #private;
}
