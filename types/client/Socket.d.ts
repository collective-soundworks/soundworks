export default Socket;
/**
 * The Socket class is a simple publish / subscribe wrapper built on top of the
 * [isomorphic-ws](https://github.com/heineiuo/isomorphic-ws) library.
 * An instance of `Socket` is automatically created by the `soundworks.Client`.
 *
 * _Important: In most cases, you should consider using a {@link client.SharedState} rather than
 * sending messages directly through the sockets._
 *
 * The Socket class concurrently opens two different WebSockets:
 * - a socket configured with `binaryType = 'string'` for JSON compatible string
 *  messages.
 * - a socket configured with `binaryType=arraybuffer` for efficient streaming
 *  of binary data.
 *
 * Both sockets re-emits all "native" ws events ('open', 'upgrade', 'close', 'error'
 *  and 'message'.
 *
 * See {@link client.Client#socket}
 *
 * @memberof client
 * @hideconstructor
 */
declare class Socket {
    /**
     * WebSocket instance w/ string protocol, i.e. `binaryType = 'string'`.
     *
     * @private
     */
    private ws;
    /**
     * WebSocket instance w/ binary protocol, i.e. `binaryType = 'arraybuffer'`.
     *
     * @private
     */
    private binaryWs;
    /** @private */
    private _stringListeners;
    /** @private */
    private _binaryListeners;
    /**
     * Initialize a websocket connection with the server. Automatically called
     * during `client.init()`
     *
     * @param {string} role - Role of the client (see {@link client.Client#role})
     * @param {object} config - Configuration of the sockets
     * @protected
     * @ignore
     */
    protected init(role: string, config: object): Promise<void>;
    /**
     * @param {boolean} binary - Emit to either the string or binary socket.
     * @param {string} channel - Channel name.
     * @param {...*} args - Content of the message.
     * @private
     */
    private _emit;
    /**
     * @param {Function[]} listeners - List of listeners, either for the string or binary socket.
     * @param {string} channel - Channel name.
     * @param {Function} callback - The function to be added to the listeners.
     * @private
     */
    private _addListener;
    /**
     * @param {Function[]} listeners - List of listeners, either for the string or binary socket.
     * @param {string} channel - Channel name.
     * @param {Function} callback - The function to be removed from the listeners.
     * @private
     */
    private _removeListener;
    /**
     * @param {Function[]} listeners - List of listeners, either for the string or binary socket.
     * @param {string} [channel=null] - Channel name of the listeners to remove. If null
     *  all the listeners are cleared.
     * @private
     */
    private _removeAllListeners;
    /**
     * Send JSON compatible messages on a given channel.
     *
     * @param {string} channel - Channel name of the message.
     * @param {...*} args - Message list, as many as needed, of any serializable type).
     */
    send(channel: string, ...args: any[]): void;
    /**
     * Listen to JSON compatible messages on a given channel.
     *
     * @param {string} channel - Channel name of the message.
     * @param {Function} callback - Callback to execute when a message is received.
     */
    addListener(channel: string, callback: Function): void;
    /**
     * Remove a listener from JSON compatible messages on a given channel.
     *
     * @param {string} channel - Channel name of the message.
     * @param {Function} callback - Callback to remove.
     */
    removeListener(channel: string, callback: Function): void;
    /**
     * Remove all listeners from JSON compatible messages on a given channel.
     *
     * @param {string} channel - Channel name of the message.
     */
    removeAllListeners(channel?: string): void;
    /**
     * Send binary messages on a given channel.
     *
     * @param {string} channel - Channel name of the message.
     * @param {TypedArray} typedArray - Binary data to be sent.
     */
    sendBinary(channel: string, typedArray: TypedArray): void;
    /**
     * Listen binary messages on a given channel.
     *
     * @param {string} channel - Channel name of the message.
     * @param {Function} callback - Callback to execute when a message is received.
     */
    addBinaryListener(channel: string, callback: Function): void;
    /**
     * Remove a listener from binary compatible messages on a given channel
     *
     * @param {string} channel - Channel of the message.
     * @param {Function} callback - Callback to cancel.
     */
    removeBinaryListener(channel: string, callback: Function): void;
    /**
     * Remove all listeners from binary compatible messages on a given channel
     *
     * @param {string} channel - Channel of the message.
     */
    removeAllBinaryListeners(channel?: string): void;
    /**
     * Removes all listeners and immediately close the two sockets.
     */
    terminate(): Promise<void>;
}
//# sourceMappingURL=Socket.d.ts.map