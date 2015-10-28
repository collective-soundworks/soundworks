'use strict';

const log = require('./logger');

/**
 * The `ServerClient` module is used to keep track of each connected client and to communicate with it via WebSockets.
 * Each time a client of type `clientType` connects to the server, *Soundworks* creates a new instance of `ServerClient`.
 * An instance of the class is passed to the `connect` and `disconnect` methods of all the server side modules that are mapped to the `clientType` clients (see {@link server.map}), as well as to the `enter` and `exit` methods of any {@link ServerPerformance} class mapped to that same client type.
 */
export default class ServerClient {
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
    this.index = -1;

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
    this.socket = socket;
  }

	/**
	 * Sends a WebSocket message to the client.
	 * @param {String} msg Name of the message.
	 * @param {...*} args Arguments of the message (as many as needed, of any type).
	 */
  send(msg, ...args) {
    log.trace({ socket: this.socket, clientType: this.type, channel: msg, arguments: args }, 'socket.send');
    this.socket.emit(msg, ...args);
  }

	/**
	 * Sends a volatile WebSocket message to the client, *i.e.* a non-blocking WebSocket message.
	 * @param {String} msg Name of the message to send.
	 * @param {...*} args Arguments of the message (as many as needed, of any type).
	 */
  sendVolatile(msg, ...args) {
    log.trace({ socket: this.socket, clientType: this.type, channel: msg, arguments: args }, 'socket.sendVolatile');
    this.socket.volatile.emit(msg, ...args);
  }

	/**
	 * Executes a callback function when it receives a WebSocket message from the client.
	 * @param {String} msg Name of the received message.
	 * @param {Function} callback Callback function executed when the message is received.
	 */
  receive(msg, callback) {
    var _callback = (function(...args) {
      log.trace({ socket: this.socket, clientType: this.type, channel: msg, arguments: args }, 'socket.receive');
      callback.apply(this.socket, args);
    }).bind(this);

    this.socket.on(msg, _callback);
  }

	/**
	 * Sends a WebSocket message to all the other clients of the same type (*i.e.* all the clients of type `this.clientType`, excluding this client).
	 * @param {String} msg Name of the message to broadcast.
	 * @param {...*} args Arguments of the message (as many as needed, of any type).
	 */
  broadcast(msg, ...args) {
    log.trace({ socket: this.socket, clientType: this.type, channel: msg, arguments: args }, 'socket.broadcast');
    this.socket.broadcast.emit(msg, ...args);
  }
}
