import uuid from 'uuidv4';

function* idGenerator() {
  for (let i = 0; true; i++) {
    yield i;
  }
}

const generateId = idGenerator();

/**
 * Server side representation of a client.
 *
 * @memberof server
 */
class Client {
	/**
	 * @param {String} clientType - Client type of the connected client.
	 * @param {Socket} socket - Socket object used to comminuate with the client.
	 */
	constructor(clientType, socket) {
		/**
		 * Client type (specified when initializing the {@link client} object on the client side with {@link client.init}).
     * @type {String}
		 */
    this.type = clientType;

    /**
     * Unique session id (ever increasing number)
     * @type {Number}
     */
    this.id = generateId.next().value;

		/**
		 * Unique session id (uuidv4).
     * @type {String}
		 */
    this.uuid = uuid();

		/**
		 * Socket used to communicate with the client.
		 * @type {server.Socket}
     * @see {@link server.Socket}
		 */
    this.socket = socket;
  }

  /**
   * Destroy the client.
   */
  destroy() {
    this.uuid = null;
    this.id = null;
  }
}

export default Client;
