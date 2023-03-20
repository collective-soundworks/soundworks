import { idGenerator } from '@ircam/sc-utils';
import { v4 as uuid } from 'uuid';

const generateId = idGenerator();

/**
 * Server-side representation of a `soundworks` client.
 *
 * @memberof server
 * @hideconstructor
 * @see {@link client.Client}
 */
class Client {
  /**
   * @param {String} role - Role of the client
   * @param {server.Socket} socket - Socket connection with the client
   */
  constructor(role, socket) {
    /**
     * Client role, as specified in client side config {@link client.Client}.
     *
     * @type {String}
     */
    this.role = role;

    /**
     * Session Id (incremented positive number).
     *
     * @type {Number}
     */
    this.id = generateId.next().value;

    /**
     * Unique session Id (uuidv4).
     *
     * @type {String}
     */
    this.uuid = uuid();

    /**
     * Socket connection with the remote client {@link client.Client}.
     *
     * @type {server.Socket}
     */
    this.socket = socket;

    /**
     * Is set in server._onSocketConnection
     * @private
     */
    this.token = null;
  }
}

export default Client;
