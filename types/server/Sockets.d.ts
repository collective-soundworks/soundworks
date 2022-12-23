export default Sockets;
/**
 * Websocket server that creates and host all {@link server.Socket} instance.
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
    /**
     * Initialize sockets, all sockets are added by default added to two rooms:
     * - to the room corresponding to the client `role`
     * - to the '*' that holds all connected sockets
     *
     * @private
     */
    private start;
    /** @protected */
    protected terminate(): void;
    /** @private */
    private _broadcast;
    /**
     * Add a socket to a room
     *
     * @param {server.Socket} socket - Socket to add to the room.
     * @param {String} roomId - Id of the room
     */
    addToRoom(socket: server.Socket, roomId: string): void;
    /**
     * Remove a socket from a room
     *
     * @param {server.Socket} socket - Socket to remove from the room.
     * @param {String} [roomId=null] - Id of the room
     */
    removeFromRoom(socket: server.Socket, roomId?: string): void;
    /**
     * Send a string message to all client of given room(s). If no room
     * not specified, the message is sent to all clients
     *
     * @param {String|Array} roomsIds - Ids of the rooms that must receive
     *  the message. If null the message is sent to all clients
     * @param {server.Socket} excludeSocket - Optionnal
     *  socket to ignore when broadcasting the message, typically the client
     *  at the origin of the message
     * @param {String} channel - Channel of the message
     * @param {...*} args - Arguments of the message (as many as needed, of any type)
     */
    broadcast(roomIds: any, excludeSocket: server.Socket, channel: string, ...args: any[]): void;
    /**
     * Send a binary message (TypedArray) to all client of given room(s). If no room
     * not specified, the message is sent to all clients
     *
     * @param {String|Array} roomsIds - Ids of the rooms that must receive
     *  the message. If null the message is sent to all clients
     * @param {server.Socket} excludeSocket - Optionnal
     *  socket to ignore when broadcasting the message, typically the client
     *  at the origin of the message
     * @param {String} channel - Channel of the message
     * @param {...*} args - Arguments of the message (as many as needed, of any type)
     */
    broadcastBinary(roomIds: any, excludeSocket: server.Socket, channel: string, typedArray: any): void;
}
//# sourceMappingURL=Sockets.d.ts.map