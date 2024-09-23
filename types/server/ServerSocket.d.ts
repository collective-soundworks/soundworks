export const kSocketClientId: unique symbol;
export const kSocketTerminate: unique symbol;
export default ServerSocket;
/**
 * Simple publish / subscribe wrapper built on top of the
 * [ws](https://github.com/websockets/ws) library.
 *
 * An instance of {@link ServerSocket} is automatically created per client
 * when it connects (see {@link SeverClient#socket}).
 *
 * _Important: In most cases, you should consider using a {@link SharedState}
 * rather than directly using the Socket instance._
 *
 * @hideconstructor
 */
declare class ServerSocket {
    constructor(ws: any, sockets: any);
    /**
     * Reference to the @link{ServerSockets} instance.
     *
     * Allows for broadcasting from a given socket instance.
     *
     * @type {ServerSockets}
     * @example
     * socket.sockets.broadcast('my-room', this, 'update-value', 1);
     */
    get sockets(): ServerSockets;
    /**
     * Reay state of the underlying socket instance.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState}
     * @type {number}
     */
    get readyState(): number;
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
     * @param {Function} callback - Callback to execute when a message is received.
     *  Arguments of the callback function will match the arguments sent using the
     *  {@link ServerSocket#send} method.
     */
    addListener(channel: string, callback: Function): void;
    /**
     * Remove a listener of messages with JSON compatible data types from a given channel.
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
     * Add the socket to a room
     * @param {string} roomId - Id of the room.
     */
    addToRoom(roomId: string): void;
    /**
     * Remove the socket from a room
     * @param {string} roomId - Id of the room.
     */
    removeFromRoom(roomId: string): void;
    /**
     * Removes all listeners and immediately close the web socket.
     *
     * Is automatically called when socket is closed on the client side or when
     * Server is stopped
     *
     * @private
     */
    private [kSocketTerminate];
    #private;
}
