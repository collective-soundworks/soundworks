export const kSocketTerminate: unique symbol;
export default ClientSocket;
/**
 * The ClientSocket class is a simple publish / subscribe wrapper built on top of the
 * [isomorphic-ws](https://github.com/heineiuo/isomorphic-ws) library.
 * An instance of `ClientSocket` is automatically created by the `soundworks.Client`
 * (see {@link Client#socket}).
 *
 * _Important: In most cases, you should consider using a {@link SharedState}
 * rather than directly using the sockets._
 *
 * The ClientSocket class concurrently opens two different WebSockets:
 * - a socket configured with `binaryType = 'blob'` for JSON compatible data
 *  types (i.e. string, number, boolean, object, array and null).
 * - a socket configured with `binaryType= 'arraybuffer'` for efficient streaming
 *  of binary data.
 *
 * Both sockets re-emits all "native" ws events ('open', 'upgrade', 'close', 'error'
 *  and 'message'.
 *
 * @hideconstructor
 */
declare class ClientSocket {
    constructor(role: any, config: any, socketOptions: any);
    /**
     * Initialize a websocket connection with the server. Automatically called
     * during {@link Client#init}
     *
     * @param {string} role - Role of the client (see {@link Client#role})
     * @param {object} config - Configuration of the sockets
     * @private
     */
    private init;
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
     *  {@link ServerSocket#send} method.
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
     * Removes all listeners and immediately close the two sockets. Is automatically
     * called on `client.stop()`
     *
     * Is also called when a disconnection is detected by the heartbeat (note that
     * in this case, the launcher will call `client.stop()` but the listeners are
     * already cleared so the event will be trigerred only once.
     */
    [kSocketTerminate](): Promise<void>;
    #private;
}
