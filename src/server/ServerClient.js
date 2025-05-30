import { counter } from '@ircam/sc-utils';
import { v4 as uuid } from 'uuid';

const generateId = counter();

export const kServerClientToken = Symbol('soundworks:server-client-token');

/**
 * Server-side representation of a client.
 *
 * @hideconstructor
 * @see {@link Client}
 */
class ServerClient {
  #role = null;
  #id = null;
  #uuid = null;
  #socket = null;

  /**
   * @param {String} role - Role of the client
   * @param {ServerSocket} socket - Socket connection with the client
   */
  constructor(role, socket) {
    this.#role = role;
    this.#id = generateId();
    this.#uuid = uuid();
    this.#socket = socket;

    /**
     * Set in `server[kServerOnSocketConnection]`
     * @private
     */
    this[kServerClientToken] = null;
  }

  /**
   * Client role, as specified in client side config {@link Client}.
   *
   * @type {String}
   */
  get role() {
    return this.#role;
  }

  /**
   * Session Id (incremented positive number).
   *
   * @type {Number}
   */
  get id() {
    return this.#id;
  }

  /**
   * Unique session Id (uuidv4).
   *
   * @type {String}
   */
  get uuid() {
    return this.#uuid;
  }

  /**
   * Socket connection with the remote {@link Client}.
   *
   * @type {ServerSocket}
   */
  get socket() {
    return this.#socket;
  }
}

export default ServerClient;
