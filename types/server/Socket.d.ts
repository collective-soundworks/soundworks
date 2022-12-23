export default Socket;
/**
 * Simple wrapper with simple pubsub system built on top of `ws` sockets.
 * The abstraction contains two different socket:
 * - one configured for string (JSON compatible) messages
 * - one configured with `binaryType=arraybuffer` for streaming data more
 *   efficiently.
 *
 * @see https://github.com/websockets/ws
 *
 * @memberof server
 */
declare class Socket {
    constructor(ws: any, binaryWs: any, rooms: any, sockets: any, options?: {});
    /**
     * Reference to the sockets object, is mainly dedicated to allow
     * broadcasting from a given socket instance.
     * @type {server.Sockets}
     * @example
     * socket.sockets.broadcast('my-room', this, 'update-value', 1);
     */
    sockets: server.Sockets;
    /**
     * `ws` socket instance configured with `binaryType=blob` (string)
     * @private
     * @type {Object}
     */
    private ws;
    /**
     * `ws` socket instance configured with `binaryType=arraybuffer` (TypedArray)
     * @private
     * @type {Object}
     */
    private binaryWs;
    /**
     * `ws` socket instance configured with `binaryType=arraybuffer` (TypedArray)
     * @private
     * @type {Map}
     */
    private rooms;
    /**
     * Configuration object
     * @type {Object}
     */
    config: any;
    _stringListeners: Map<any, any>;
    _binaryListeners: Map<any, any>;
    _isAlive: boolean;
    _intervalId: NodeJS.Timeout;
    /**
     * Called when the string socket closes (aka client reload).
     */
    /** @private */
    private terminate;
    /** @private */
    private _emit;
    /** @private */
    private _addListener;
    /** @private */
    private _removeListener;
    /** @private */
    private _removeAllListeners;
    /**
     * Add the socket to a room
     * @param {String} roomId - Id of the room
     */
    addToRoom(roomId: string): void;
    /**
     * Remove the socket from a room
     * @param {String} roomId - Id of the room
     */
    removeFromRoom(roomId: string): void;
    /**
     * Sends JSON compatible messages on a given channel
     *
     * @param {String} channel - Channel of the message
     * @param {...*} args - Arguments of the message (as many as needed, of any type)
     */
    send(channel: string, ...args: any[]): void;
    /**
     * Listen JSON compatible messages on a given channel
     *
     * @param {String} channel - Channel of the message
     * @param {Function} callback - Callback to execute when a message is received
     */
    addListener(channel: string, callback: Function): void;
    /**
     * Remove a listener from JSON compatible messages on a given channel
     *
     * @param {String} channel - Channel of the message
     * @param {Function} callback - Callback to cancel
     */
    removeListener(channel: string, callback: Function): void;
    /**
     * Remove all listeners from JSON compatible messages on a given channel
     *
     * @param {String} channel - Channel of the message
     */
    removeAllListeners(channel: string): void;
    /**
     * Sends binary messages on a given channel
     *
     * @param {String} channel - Channel of the message
     * @param {TypedArray} typedArray - Data to send
     */
    sendBinary(channel: string, typedArray: TypedArray): void;
    /**
     * Listen binary messages on a given channel
     *
     * @param {String} channel - Channel of the message
     * @param {Function} callback - Callback to execute when a message is received
     */
    addBinaryListener(channel: string, callback: Function): void;
    /**
     * Remove a listener from binary compatible messages on a given channel
     *
     * @param {String} channel - Channel of the message
     * @param {Function} callback - Callback to cancel
     */
    removeBinaryListener(channel: string, callback: Function): void;
    /**
     * Remove all listeners from binary compatible messages on a given channel
     *
     * @param {String} channel - Channel of the message
     */
    removeAllBinaryListeners(channel: string): void;
}
//# sourceMappingURL=Socket.d.ts.map