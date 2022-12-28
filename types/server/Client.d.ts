export default Client;
/**
 * Server-side representation of a `soundworks` client.
 *
 * @memberof server
 * @hideconstructor
 * @see {@link client.Client}
 */
declare class Client {
    /**
     * @param {String} role - Role of the client
     * @param {server.Socket} socket - Socket connection with the client
     */
    constructor(role: string, socket: server.Socket);
    /**
     * Client role, as specified in client side config {@link client.Client}.
     *
     * @type {String}
     */
    role: string;
    /**
     * Session Id (incremented positive number).
     *
     * @type {Number}
     */
    id: number;
    /**
     * Unique session Id (uuidv4).
     *
     * @type {String}
     */
    uuid: string;
    /**
     * Socket connection with the remote client {@link client.Client}.
     *
     * @type {server.Socket}
     */
    socket: server.Socket;
}
//# sourceMappingURL=Client.d.ts.map