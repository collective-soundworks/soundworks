import uuid from 'uuid';

/**
 * Server side representation of a client.
 */
export default class Client {
	/**
	 * @param {String} clientType - Client type of the connected client.
	 * @param {Socket} socket - Socket object used to comminuate with the client.
	 * @private
	 */
	constructor(clientType, socket) {
		/**
		 * Client type (specified when initializing the {@link client} object on the client side with {@link client.init}).
		 * @type {String}
		 */
    this.type = clientType;

		/**
		 * Index of the client.
		 * @type {Number}
		 */
    this.uuid = uuid.v4();

		/**
		 * Coordinates of the client, stored as an `[x:Number, y:Number]` array.
		 * @type {Array<Number>}
		 */
    this.coordinates = null;

    /**
     * Ticket index of the client.
     * @type {Number}
     */
    this.index = null;

    /**
     * Ticket label of the client.
     * @type {Number}
     */
    this.label = null;

		/**
		 * Used by the activities to associate data to a particular client.
		 *
		 * All the data associated with a activity whose `name` is `'activityName'` is accessible through the key `activityName`.
		 * For instance, the {@link src/server/Checkin.js~Checkin} activity keeps track of client's checkin index and label in `this.activities.checkin.index` and `this.activities.checkin.label`.
		 * Similarly, a {@link src/server/Performance.js~Performance} activity whose name is `'myPerformance'` could report the client's status in `this.activities.myPerformance.status`.
		 * @type {Object}
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
    this.socket.removeAllListeners();
    this.uuid = null;
  }
}
