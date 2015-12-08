import log from './logger';

let nextClientIndex = 0;
const availableClientIndices = [];

function _getClientIndex() {
  var index = -1;

  if (availableClientIndices.length > 0) {
    availableClientIndices.sort(function(a, b) {
      return a - b;
    });

    index = availableClientIndices.splice(0, 1)[0];
  } else {
    index = nextClientIndex++;
  }

  return index;
}

function _releaseClientIndex(index) {
  availableClientIndices.push(index);
}

/**
 * [server] Client who connects to the server.
 *
 * Each time a client of type `'clientType'` connects to the server, *Soundworks* creates a new instance of `Client`.
 * An instance of the class is passed to the `connect` and `disconnect` methods of all the server side modules that are mapped to the `'clientType'` clients (see {@link server#map}), as well as to the `enter` and `exit` methods of any {@link src/server/Performance.js~Performance} class mapped to that same client type.
 *
 * The class is also used to communicate with the client via WebSockets.
 *
 * @example class MyPerformance extends Performance {
 *   // ...
 *
 *   enter(client) {
 *     const msg = "Welcome to the performance!";
 *     client.send('init', msg);
 *   }
 *
 *   // ...
 * }
 */
export default class Client {
	/**
	 * @param {String} clientType Client type of the connected client.
	 * @param {Socket} socket Socket object used to comminuate with the client.
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
    this.index = _getClientIndex();

		/**
		 * Coordinates of the client, stored as an `[x:Number, y:Number]` array.
		 * @type {Number[]}
		 */
    this.coordinates = null;

		/**
		 * Used by any {@link src/server/ServerModule.js~ServerModule} to associate data to a particular client.
		 *
		 * All the data associated with a module whose `name` is `'moduleName'` is accessible through the key `moduleName`.
		 * For instance, the {@link src/server/Checkin.js~Checkin} module keeps track of client's checkin index and label in `this.modules.checkin.index` and `this.modules.checkin.label`.
		 * Similarly, a {@link src/server/Performance.js~Performance} module whose name is `'myPerformance'` could report the client's status in `this.modules.myPerformance.status`.
		 * @type {Object}
		 */
    this.modules = {};

		/**
		 * Socket used to communicate with the client.
		 * @type {Socket}
		 * @private
		 * @todo .socket -> ._socket (maybe?)
		 */
    // this.socket = socket;
    this.socket = socket;
  }

  /**
   * Destroy the client.
   */
  destroy() {
    _releaseClientIndex(this.index);
    this.index = -1;
  }
}
