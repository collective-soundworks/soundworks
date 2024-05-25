export const kSocketsStart: unique symbol;
export const kSocketsStop: unique symbol;
export const kSocketsRemoveFromAllRooms: unique symbol;
export const kSocketsLatencyStatsWorker: unique symbol;
export const kSocketsDebugPreventHeartBeat: unique symbol;
export default ServerSockets;
/**
 * Manage all {@link ServerSocket} instances.
 *
 * _Important: In most cases, you should consider using a {@link SharedState}
 * rather than directly using the Socket instance._
 */
declare class ServerSockets {
    constructor(server: any, config: any);
    /**
     * Add a socket to a room.
     *
     * _Note that in most cases, you should use a {@link SharedState} instead_
     *
     * @param {ServerSocket} socket - Socket to add to the room.
     * @param {String} roomId - Id of the room.
     */
    addToRoom(socket: ServerSocket, roomId: string): void;
    /**
     * Remove a socket from a room.
     *
     * _Note that in most cases, you should use a {@link SharedState} instead_
     *
     * @param {ServerSocket} socket - Socket to remove from the room.
     * @param {String} roomId - Id of the room.
     */
    removeFromRoom(socket: ServerSocket, roomId: string): void;
    /**
     * Send a message to all clients os given room(s). If no room is specified,
     * the message is sent to all clients.
     *
     * _Note that in most cases, you should use a {@link SharedState} instead_
     *
     * @param {String|Array} roomsIds - Ids of the rooms that must receive
     *  the message. If `null` the message is sent to all clients.
     * @param {ServerSocket} excludeSocket - Optionnal socket to ignore when
     *  broadcasting the message, typically the client at the origin of the message.
     * @param {String} channel - Channel name.
     * @param {...*} args - Payload of the message. As many arguments as needed, of
     *  JSON compatible data types (i.e. string, number, boolean, object, array and null).
     */
    broadcast(roomIds: any, excludeSocket: ServerSocket, channel: string, ...args: any[]): void;
    #private;
}
