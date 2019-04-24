import uuid from 'uuid';

/**
 * Server side representation of a client.
 *
 * @memberof module:soundworks/server
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
		 * Index of the client.
		 * @name uuid
     * @type {Number}
     * @memberof module:soundworks/server.Client
     * @instance
		 */
    this.uuid = uuid.v4();

		/**
		 * Coordinates of the client, stored as an `[x:Number, y:Number]` array.
		 * @name coordinates
     * @type {Array<Number>}
     * @memberof module:soundworks/server.Client
     * @instance
		 */
    this.coordinates = null;

    /**
     * Geoposition of the client as returned by `geolocation.getCurrentPosition`
     * @name geoposition
     * @typ {Object}
     * @memberof module:soundworks/server.Client
     * @instance
     */
    this.geoposition = null;

    /**
     * Ticket index of the client.
     * @name index
     * @type {Number}
     * @memberof module:soundworks/server.Client
     * @instance
     */
    this.index = null;

    /**
     * Ticket label of the client.
     * @name label
     * @type {Number}
     * @memberof module:soundworks/server.Client
     * @instance
     */
    this.label = null;

		/**
		 * Used by the activities to associate data to a particular client.
		 *
		 * All the data associated with a activity whose `name` is `'activityName'`
     * is accessible through the key `activityName`.
		 * For instance, the {@link src/server/Checkin.js~Checkin} activity keeps
     * track of client's checkin index and label in `this.activities.checkin.index`
     * and `this.activities.checkin.label`.
		 * Similarly, a {@link src/server/Performance.js~Performance} activity whose
     * name is `'myPerformance'` could report the client's status in
     * `this.activities.myPerformance.status`.
		 *
     * @name activities
     * @type {Object}
     * @memberof module:soundworks/server.Client
     * @instance
		 */
    this.activities = {};

		/**
		 * Socket used to communicate with the client.
		 * @type {Socket}
		 * @private
		 */
    this.socket = socket;
  }

  /**
   * Returns a lightweight version of the data defining the client.
   * @returns {Object}
   */
  serialize() {
    return {
      type: this.type,
      uuid: this.uuid,
      coordinates: this.coordinates,
      index: this.index,
      label: this.label,
      activities: this.activities,
    };
  }

  /**
   * Destroy the client.
   */
  destroy() {
    this.uuid = null;
  }
}

export default Client;
