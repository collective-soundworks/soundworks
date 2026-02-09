export default BatchedTransport;
/**
 * This class proxies transports, i.e. WebSockets, to batch message sends
 * @private
 */
declare class BatchedTransport {
    constructor(transport: any);
    addListener(channel: any, callback: any): void;
    emit(channel: any, ...args: any[]): Promise<void>;
    removeListener(channel: any, callback: any): void;
    removeAllListeners(channel?: any): void;
    #private;
}
//# sourceMappingURL=BatchedTransport.d.ts.map