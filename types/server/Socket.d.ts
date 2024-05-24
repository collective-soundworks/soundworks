export const kSocketClientId: unique symbol;
export const kSocketTerminate: unique symbol;
export default Socket;
/**
 * Simple publish / subscribe wrapper built on top of the
 * [ws](https://github.com/websockets/ws) library.
 *
 * An instance of {@link server.Socket} is automatically created per client
 * when it connects (see {@link server.Client#socket}).
 *
 * _Important: In most cases, you should consider using a {@link client.SharedState}
 * rather than directly using the Socket instance._
 *
 * The Socket class contains two different WebSockets:
 * - a socket configured with `binaryType = 'blob'` for JSON compatible data
 *  types (i.e. string, number, boolean, object, array and null).
 * - a socket configured with `binaryType= 'arraybuffer'` for efficient streaming
 *  of binary data.
 *
 * @memberof server
 * @hideconstructor
 */
declare class Socket {
    constructor(ws: any, sockets: any);
    /**
     * Reference to the @link{server.Sockets} instance.
     *
     * Allows for broadcasting from a given socket instance.
     *
     * @type {server.Sockets}
     * @example
     * socket.sockets.broadcast('my-room', this, 'update-value', 1);
     */
    get sockets(): server.Sockets;
    get readyState(): any;
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
     *  {@link server.Socket#send} method.
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
     */
    [kSocketTerminate](): void;
    #private;
}
