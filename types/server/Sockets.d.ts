export default Sockets;
/**
 * Manager all {@link server.Socket} instances.
 *
 * Most of the time, you shouldn't have to use this class instance directely, but
 * it could be usefull in some situations, for broadcasting messages, creating rooms, etc.
 *
 * @memberof server
 */
declare class Sockets {
    /** @private */
    private _wss;
    /** @private */
    private _rooms;
    /** @private */
    private _initializationCache;
    /** @private */
    private _latencyStatsWorker;
    /** @private */
    private _auditState;
    /** @private */
    private _DEBUG_PREVENT_HEARTBEAT;
    /**
     * Initialize sockets, all sockets are added to two rooms by default:
     * - to the room corresponding to the client `role`
     * - to the '*' room that holds all connected sockets
     *
     * @private
     */
    private start;
    /**
     * Terminate all existing sockets
     *
     * @private
     */
    private terminate;
    /** @private */
    private _broadcast;
    /**
     * Add a socket to a room
     *
     * @param {server.Socket} socket - Socket to add to the room.
     * @param {String} roomId - Id of the room.
     */
    addToRoom(socket: server.Socket, roomId: string): void;
    /**
     * Remove a socket from a room
     *
     * @param {server.Socket} socket - Socket to remove from the room.
     * @param {String} roomId - Id of the room.
     */
    removeFromRoom(socket: server.Socket, roomId: string): void;
    /**
     * Send a message of JSON compatible data types to all client of given room(s).
     * If no room is specified, the message is sent to all clients.
     *
     *
     * @param {String|Array} roomsIds - Ids of the rooms that must receive
     *  the message. If `null` the message is sent to all clients.
     * @param {server.Socket} excludeSocket - Optionnal socket to ignore when
     *  broadcasting the message, typically the client at the origin of the message.
     * @param {String} channel - Channel name.
     * @param {...*} args - Payload of the message. As many arguments as needed, of
     *  JSON compatible data types (i.e. string, number, boolean, object, array and null).
     */
    broadcast(roomIds: any, excludeSocket: server.Socket, channel: string, ...args: any[]): void;
    /**
     * Send a binary message to all client of given room(s). If no room is specified
     * specified, the message is sent to all clients.
     *
     * @param {String|Array} roomsIds - Ids of the rooms that must receive
     *  the message. If `null` the message is sent to all clients.
     * @param {server.Socket} excludeSocket - Optionnal socket to ignore when
     *  broadcasting the message, typically the client at the origin of the message.
     * @param {string} channel - Channel name.
     * @param {TypedArray} typedArray - Binary data to be sent.
     */
    broadcastBinary(roomIds: any, excludeSocket: server.Socket, channel: string, typedArray: TypedArray): void;
}
//# sourceMappingURL=Sockets.d.ts.map