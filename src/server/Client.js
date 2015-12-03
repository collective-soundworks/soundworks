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
 * The {@link Client} module is used to keep track of each connected client and to communicate with it via WebSockets.
 * Each time a client of type `clientType` connects to the server, *Soundworks* creates a new instance of `Client`.
 * An instance of the class is passed to the `connect` and `disconnect` methods of all the server side modules that are mapped to the `clientType` clients (see {@link server.map}), as well as to the `enter` and `exit` methods of any {@link ServerPerformance} class mapped to that same client type.
 */
export default class Client {
	/**
	 * Creates an instance of the class.
	 * @param {String} clientType Client type of the connected client.
	 * @param {Socket} socket Socket object used to comminuate with the client.
	 */
	constructor(clientType, socket) {
		/**
		 * Client type (specified when initializing the {@link client} object on the client side with {@link client.init}).
		 * @type {String}
		 */
    this.type = clientType;

		/**
		 * Index of the client as set by the {@link ServerCheckin} module.
		 * @type {Number}
		 */
    this.index = _getClientIndex();

		/**
		 * Coordinates of the client in the space, stored as an `[x, y]` array.
		 * @type {Number[]}
		 */
    this.coordinates = null;

		/**
		 * Used by any {@link ServerModule} to associate data to a particular client.
		 * All the data associated with a module whose `name` is `moduleName` is accessible through the key `moduleName`.
		 * For instance, the {@link ServerSync} module keeps track of the time offset between the client and the sync clocks in `this.modules.sync.timeOffset`.
		 * Similarly, a {@link ServerPerformance} module could keep track of each client's status in `this.modules.myPerformanceName.status`.
		 * @type {Object}
		 */
    this.modules = {};

		/**
		 * Socket used to communicate with the client.
		 * @type {Socket}
		 * @todo make private?
		 */
    // this.socket = socket;
    this.socket = socket;
  }

  destroy() {
    _releaseClientIndex(this.index);
    this.index = -1;
  }

}

