export default Socket;
/**
 * The Socket class is a simple publish / subscribe wrapper built on top of the
 * [isomorphic-ws](https://github.com/heineiuo/isomorphic-ws) library.
 * An instance of `Socket` is automatically created by the `soundworks.Client`
 * (see {@link client.Client#socket}).
 *
 * _Important: In most cases, you should consider using a {@link client.SharedState}
 * rather than directly using the sockets._
 *
 * The Socket class concurrently opens two different WebSockets:
 * - a socket configured with `binaryType = 'blob'` for JSON compatible data
 *  types (i.e. string, number, boolean, object, array and null).
 * - a socket configured with `binaryType= 'arraybuffer'` for efficient streaming
 *  of binary data.
 *
 * Both sockets re-emits all "native" ws events ('open', 'upgrade', 'close', 'error'
 *  and 'message'.
 *
 * @memberof client
 * @hideconstructor
 */
declare class Socket {
    /**
     * WebSocket instance configured with `binaryType = 'blob'`.
     *
     * @private
     */
    private ws;
    /**
     * WebSocket instance configured with `binaryType = 'arraybuffer'`.
     *
     * @private
     */
    private binaryWs;
    /** @private */
    private _stringListeners;
    /** @private */
    private _binaryListeners;
    /** @private */
    private _heartbeatId;
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
     * Removes all listeners and immediately close the two sockets. Is automatically
     * called on `client.stop()`
     *
     * Is also called when a disconnection is detected by the heartbeat (note that
     * in this case, the launcher will call `client.stop()` but the listeners are
     * already cleared so the event will be trigerred only once)
     *
     * @private
     */
    private terminate;
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
     * Send messages with JSON compatible data types on a given channel.
     *
     * @param {string} channel - Channel name.
     * @param {...*} args - Payload of the message. As many arguments as needed, of
     *  JSON compatible data types (i.e. string, number, boolean, object, array and null).
     */
    send(channel: string, ...args: any[]): void;
    /**
     * Listen messages with JSON compatible data types on a given channel.
     *
     * @param {string} channel - Channel name.
     * @param {Function} callback - Callback to execute when a message is received,
     *  arguments of the callback function will match the arguments sent using the
     *  {@link server.Socket#send} method.
     */
    addListener(channel: string, callback: Function): void;
    /**
     * Remove a listener from JSON compatible messages on a given channel.
     *
     * @param {string} channel - Channel name.
     * @param {Function} callback - Callback to remove.
     */
    removeListener(channel: string, callback: Function): void;
    /**
     * Remove all listeners of messages with JSON compatible data types.
     *
     * @param {string} channel - Channel name.
     */
    removeAllListeners(channel?: string): void;
    /**
     * Send binary messages on a given channel.
     *
     * @param {string} channel - Channel name.
     * @param {TypedArray} typedArray - Binary data to be sent.
     */
    sendBinary(channel: string, typedArray: TypedArray): void;
    /**
     * Listen binary messages on a given channel
     *
     * @param {string} channel - Channel name.
     * @param {Function} callback - Callback to execute when a message is received.
     */
    addBinaryListener(channel: string, callback: Function): void;
    /**
     * Remove a listener of binary compatible messages from a given channel
     *
     * @param {string} channel - Channel name.
     * @param {Function} callback - Callback to remove.
     */
    removeBinaryListener(channel: string, callback: Function): void;
    /**
     * Remove all listeners of binary compatible messages on a given channel
     *
     * @param {string} channel - Channel of the message.
     */
    removeAllBinaryListeners(channel?: string): void;
}
//# sourceMappingURL=Socket.d.ts.map