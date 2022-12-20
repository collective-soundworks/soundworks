import { v4 as uuid } from 'uuid';

import { idGenerator } from '../common/utils.js';

const generateId = idGenerator();

/**
 * Server side representation of a client.
 *
 * @memberof server
 */
class Client {
  /**
   * @param {String} role - Role of the client
   * @param {server.Socket} socket - Socket connection with the client
   */
  constructor(role, socket) {
    /**
     * Client type, as specified in client side config {@link client.Client}.
     *
     * @see {@link client.Client}
     * @type {String}
     */
    this.role = role;

    /**
     * Session id (incremeted positive number).
     * The counter is reset when the server restarts.
     * @type {Number}
     */
    this.id = generateId.next().value;

    /**
     * Unique session id (uuidv4).
     * @type {String}
     */
    this.uuid = uuid();

    /**
     * Socket connection with the remote {@link client.Client}.
     * @type {server.Socket}
     */
    this.socket = socket;
  }

  /**
   * Destroy the client.
   * @private
   */
  destroy() {
    this.uuid = null;
    this.id = null;
  }
}

export default Client;
