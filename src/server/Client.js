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
 * @memberof @soundworks/core/server
 */
class Client {
	/**
	 * @param {String} clientType - Client type of the connected client.
	 * @param {Socket} socket - Socket object used to comminuate with the client.
	 * @private
	 */
	constructor(clientType, socket) {
		/**
		 * Client type (specified when initializing the {@link client} object on the client side with {@link client.init}).
		 * @name type
     * @type {String}
     * @memberof module:soundworks/server.Client
     * @instance
		 */
    this.type = clientType;

    /**
     * Unique session id (ever increasing number)
     * @name id
     * @type {Number}
     * @memberof module:soundworks/server.Client
     * @instance
     */
    this.id = generateId.next().value;

		/**
		 * Unique session id (uuidv4).
		 * @name uuid
     * @type {String}
     * @memberof module:soundworks/server.Client
     * @instance
		 */
    this.uuid = uuid();

		/**
		 * Socket used to communicate with the client.
		 * @type {Socket}
		 * @private
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
