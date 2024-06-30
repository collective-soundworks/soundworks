export const kServerClientToken: unique symbol;
export default ServerClient;
/**
 * Server-side representation of a `soundworks` client.
 *
 * @hideconstructor
 * @see {@link Client}
 */
declare class ServerClient {
    /**
     * @param {String} role - Role of the client
     * @param {ServerSocket} socket - Socket connection with the client
     */
    constructor(role: string, socket: ServerSocket);
    /**
     * Client role, as specified in client side config {@link Client}.
     *
     * @type {String}
     */
    get role(): string;
    /**
     * Session Id (incremented positive number).
     *
     * @type {Number}
     */
    get id(): number;
    /**
     * Unique session Id (uuidv4).
     *
     * @type {String}
     */
    get uuid(): string;
    /**
     * Socket connection with the remote {@link Client}.
     *
     * @type {ServerSocket}
     */
    get socket(): ServerSocket;
    /**
     * Is set in server[kServerOnSocketConnection]
     * @private
     */
    private [kServerClientToken];
    #private;
}
