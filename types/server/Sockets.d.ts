export const kSocketsRemoveFromAllRooms: unique symbol;
export const kSocketsLatencyStatsWorker: unique symbol;
export const kSocketsDebugPreventHeartBeat: unique symbol;
export default Sockets;
/**
 * Manage all {@link server.Socket} instances.
 *
 * _Important: In most cases, you should consider using a {@link client.SharedState}
 * rather than directly using the Socket instance._
 *
 * @memberof server
 */
declare class Sockets {
    /**
     * Initialize sockets, all sockets are added to two rooms by default:
     * - to the room corresponding to the client `role`
     * - to the '*' room that holds all connected sockets
     *
     * @private
     */
    private start;
    /**
     * Terminate all existing sockets.
     * @private
     */
    private terminate;
    /**
     * Add a socket to a room.
     *
     * _Note that in most cases, you should use a shared state instead_
     *
     * @param {server.Socket} socket - Socket to add to the room.
     * @param {String} roomId - Id of the room.
     */
    addToRoom(socket: server.Socket, roomId: string): void;
    /**
     * Remove a socket from a room.
     *
     * _Note that in most cases, you should use a shared state instead_
     *
     * @param {server.Socket} socket - Socket to remove from the room.
     * @param {String} roomId - Id of the room.
     */
    removeFromRoom(socket: server.Socket, roomId: string): void;
    /**
     * Send a message to all clients os given room(s). If no room is specified,
     * the message is sent to all clients.
     *
     * _Note that in most cases, you should use a shared state instead_
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
    #private;
}
