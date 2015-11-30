import log from './logger';


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
    this.index = -1;

		/**
		 * Coordinates of the client in the setup, stored as an `[x:Number, y:Number]` array.
		 * @type {Number[]}
		 */
    this.coordinates = null;

		/**
		 * Used by any {@link src/server/Module.js~Module} to associate data to a particular client.
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
    this.socket = socket;
  }

	/**
	 * Send a WebSocket message to the client.
	 * @param {String} msg Name of the message.
	 * @param {...*} args Arguments of the message (as many as needed, of any type).
	 */
  send(msg, ...args) {
    log.trace({ socket: this.socket, clientType: this.type, channel: msg, arguments: args }, 'socket.send');
    this.socket.emit(msg, ...args);
  }

	/**
	 * Send a volatile WebSocket message to the client, *i.e.* a non-blocking WebSocket message.
	 * @param {String} msg Name of the message to send.
	 * @param {...*} args Arguments of the message (as many as needed, of any type).
	 */
  sendVolatile(msg, ...args) {
    log.trace({ socket: this.socket, clientType: this.type, channel: msg, arguments: args }, 'socket.sendVolatile');
    this.socket.volatile.emit(msg, ...args);
  }

	/**
	 * Execute a callback function when it receives a WebSocket message from the client.
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
	 * Send a WebSocket message to all the other clients of the same type (*i.e.* all the clients of type `this.clientType`, excluding this client).
	 * @param {String} msg Name of the message to broadcast.
	 * @param {...*} args Arguments of the message (as many as needed, of any type).
	 */
  broadcast(msg, ...args) {
    log.trace({ socket: this.socket, clientType: this.type, channel: msg, arguments: args }, 'socket.broadcast');
    this.socket.broadcast.emit(msg, ...args);
  }
}
