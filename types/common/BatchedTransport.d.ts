export default BatchedTransport;
/**
 * This class proxies transports given the SharedStateManager to batch messages
 *
 * @param {number} [options.wait=0] - Wait for given number of milliseconds
 *  for stacking messages before emitting on the network. If 0 is given, network
 *  message is emitted on next microtask
 * @private
 */
declare class BatchedTransport {
    constructor(transport: any);
    _transport: any;
    _listeners: Map<any, any>;
    _stack: any[];
    _sending: boolean;
    addListener(channel: any, callback: any): void;
    emit(channel: any, ...args: any[]): Promise<void>;
    removeListener(channel: any, callback: any): void;
    removeAllListeners(channel?: any): void;
}
//# sourceMappingURL=BatchedTransport.d.ts.map