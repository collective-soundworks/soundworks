export default Socket;
/**
 * The Socket class is a simple publish / subscribe wrapper built on top of the
 * [ws](https://github.com/websockets/ws) library. An instance of {@link server.Socket}
 * is automatically created per client when it connects (see {@link server.Client#socket}).
 *
 * _Important: In most cases, you should consider using a {@link client.SharedState}
 * rather than directly using the sockets._
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
    constructor(ws: any, binaryWs: any, rooms: any, sockets: any);
    /**
     * `ws` socket instance configured with `binaryType=blob` (string)
     *
     * @type {object}
     * @private
     */
    private ws;
    /**
     * `ws` socket instance configured with `binaryType=arraybuffer` (TypedArray)
     *
     * @type {object}
     * @private
     */
    private binaryWs;
    /**
     * Reference to the sockets object, is mainly dedicated to allow
     * broadcasting from a given socket instance.
     *
     * @type {server.Sockets}
     * @example
     * socket.sockets.broadcast('my-room', this, 'update-value', 1);
     */
    sockets: server.Sockets;
    /**
     * Reference to the rooms object
     *
     * @type {Map}
     * @private
     */
    private rooms;
    /** @private */
    private _stringListeners;
    /** @private */
    private _binaryListeners;
    /** @private */
    private _heartbeatId;
    /** @private */
    private _isAlive;
    /**
     * Removes all listeners and immediately close the two sockets. Is automatically
     * called on `server.stop()`
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
     * Add the socket to a room
     *
     * @param {string} roomId - Id of the room.
     */
    addToRoom(roomId: string): void;
    /**
     * Remove the socket from a room
     *
     * @param {string} roomId - Id of the room.
     */
    removeFromRoom(roomId: string): void;
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