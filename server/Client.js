'use strict';

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

/**
 * The {@link Client} module is used to keep track of each connected client and to communicate with it via WebSockets.
 * Each time a client of type `clientType` connects to the server, *Soundworks* creates a new instance of `Client`.
 * An instance of the class is passed to the `connect` and `disconnect` methods of all the server side modules that are mapped to the `clientType` clients (see {@link server.map}), as well as to the `enter` and `exit` methods of any {@link ServerPerformance} class mapped to that same client type.
 */

var Client =
/**
 * Creates an instance of the class.
 * @param {String} clientType Client type of the connected client.
 * @param {Socket} socket Socket object used to comminuate with the client.
 */
function Client(clientType, socket) {
	_classCallCheck(this, Client);

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
	// this.socket = socket;
	this.socket = socket;
}

/**
 * Sends a WebSocket message to the client.
 * @param {String} msg Name of the message.
 * @param {...*} args Arguments of the message (as many as needed, of any type).
 */
// send(msg, ...args) {
//   this.socket.emit(msg, ...args);

//   log.trace({ socket: this.socket, clientType: this.type, channel: msg, arguments: args }, 'socket.send');
// }

/**
 * Sends a volatile WebSocket message to the client, *i.e.* a non-blocking WebSocket message.
 * @param {String} msg Name of the message to send.
 * @param {...*} args Arguments of the message (as many as needed, of any type).
 */
// sendVolatile(msg, ...args) {
//   this.socket.volatile.emit(msg, ...args);

//   log.trace({ socket: this.socket, clientType: this.type, channel: msg, arguments: args }, 'socket.sendVolatile');
// }

/**
 * Executes a callback function when it receives a WebSocket message from the client.
 * @param {String} msg Name of the received message.
 * @param {Function} callback Callback function executed when the message is received.
 */
// receive(msg, callback) {
//   var _callback = (function(...args) {
//     callback.apply(this.socket, args);

//     log.trace({ socket: this.socket, clientType: this.type, channel: msg, arguments: args }, 'socket.receive');
//   }).bind(this);

//   this.socket.on(msg, _callback);
// }

/**
 * Sends a WebSocket message to all the other clients of the same type (*i.e.* all the clients of type `this.clientType`, excluding this client).
 * @param {String} msg Name of the message to broadcast.
 * @param {...*} args Arguments of the message (as many as needed, of any type).
 */
// broadcast(msg, ...args) {
//   this.socket.broadcast.emit(msg, ...args);

//   log.trace({ socket: this.socket, clientType: this.type, channel: msg, arguments: args }, 'socket.broadcast');
// }
;

exports['default'] = Client;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvQ2xpZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7c0JBQWdCLFVBQVU7Ozs7Ozs7Ozs7SUFPTCxNQUFNOzs7Ozs7QUFNZixTQU5TLE1BQU0sQ0FNZCxVQUFVLEVBQUUsTUFBTSxFQUFFO3VCQU5aLE1BQU07Ozs7OztBQVd2QixLQUFJLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQzs7Ozs7O0FBTXZCLEtBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7Ozs7OztBQU1oQixLQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQzs7Ozs7Ozs7O0FBU3hCLEtBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDOzs7Ozs7OztBQVFsQixLQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztDQUN0Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3FCQXpDa0IsTUFBTSIsImZpbGUiOiJzcmMvc2VydmVyL0NsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBsb2cgZnJvbSAnLi9sb2dnZXInO1xuXG4vKipcbiAqIFRoZSB7QGxpbmsgQ2xpZW50fSBtb2R1bGUgaXMgdXNlZCB0byBrZWVwIHRyYWNrIG9mIGVhY2ggY29ubmVjdGVkIGNsaWVudCBhbmQgdG8gY29tbXVuaWNhdGUgd2l0aCBpdCB2aWEgV2ViU29ja2V0cy5cbiAqIEVhY2ggdGltZSBhIGNsaWVudCBvZiB0eXBlIGBjbGllbnRUeXBlYCBjb25uZWN0cyB0byB0aGUgc2VydmVyLCAqU291bmR3b3JrcyogY3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiBgQ2xpZW50YC5cbiAqIEFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcyBpcyBwYXNzZWQgdG8gdGhlIGBjb25uZWN0YCBhbmQgYGRpc2Nvbm5lY3RgIG1ldGhvZHMgb2YgYWxsIHRoZSBzZXJ2ZXIgc2lkZSBtb2R1bGVzIHRoYXQgYXJlIG1hcHBlZCB0byB0aGUgYGNsaWVudFR5cGVgIGNsaWVudHMgKHNlZSB7QGxpbmsgc2VydmVyLm1hcH0pLCBhcyB3ZWxsIGFzIHRvIHRoZSBgZW50ZXJgIGFuZCBgZXhpdGAgbWV0aG9kcyBvZiBhbnkge0BsaW5rIFNlcnZlclBlcmZvcm1hbmNlfSBjbGFzcyBtYXBwZWQgdG8gdGhhdCBzYW1lIGNsaWVudCB0eXBlLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnQge1xuXHQvKipcblx0ICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiB0aGUgY2xhc3MuXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBjbGllbnRUeXBlIENsaWVudCB0eXBlIG9mIHRoZSBjb25uZWN0ZWQgY2xpZW50LlxuXHQgKiBAcGFyYW0ge1NvY2tldH0gc29ja2V0IFNvY2tldCBvYmplY3QgdXNlZCB0byBjb21taW51YXRlIHdpdGggdGhlIGNsaWVudC5cblx0ICovXG5cdGNvbnN0cnVjdG9yKGNsaWVudFR5cGUsIHNvY2tldCkge1xuXHRcdC8qKlxuXHRcdCAqIENsaWVudCB0eXBlIChzcGVjaWZpZWQgd2hlbiBpbml0aWFsaXppbmcgdGhlIHtAbGluayBjbGllbnR9IG9iamVjdCBvbiB0aGUgY2xpZW50IHNpZGUgd2l0aCB7QGxpbmsgY2xpZW50LmluaXR9KS5cblx0XHQgKiBAdHlwZSB7U3RyaW5nfVxuXHRcdCAqL1xuICAgIHRoaXMudHlwZSA9IGNsaWVudFR5cGU7XG5cblx0XHQvKipcblx0XHQgKiBJbmRleCBvZiB0aGUgY2xpZW50IGFzIHNldCBieSB0aGUge0BsaW5rIFNlcnZlckNoZWNraW59IG1vZHVsZS5cblx0XHQgKiBAdHlwZSB7TnVtYmVyfVxuXHRcdCAqL1xuICAgIHRoaXMuaW5kZXggPSAtMTtcblxuXHRcdC8qKlxuXHRcdCAqIENvb3JkaW5hdGVzIG9mIHRoZSBjbGllbnQgaW4gdGhlIHNwYWNlLCBzdG9yZWQgYXMgYW4gYFt4LCB5XWAgYXJyYXkuXG5cdFx0ICogQHR5cGUge051bWJlcltdfVxuXHRcdCAqL1xuICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBudWxsO1xuXG5cdFx0LyoqXG5cdFx0ICogVXNlZCBieSBhbnkge0BsaW5rIFNlcnZlck1vZHVsZX0gdG8gYXNzb2NpYXRlIGRhdGEgdG8gYSBwYXJ0aWN1bGFyIGNsaWVudC5cblx0XHQgKiBBbGwgdGhlIGRhdGEgYXNzb2NpYXRlZCB3aXRoIGEgbW9kdWxlIHdob3NlIGBuYW1lYCBpcyBgbW9kdWxlTmFtZWAgaXMgYWNjZXNzaWJsZSB0aHJvdWdoIHRoZSBrZXkgYG1vZHVsZU5hbWVgLlxuXHRcdCAqIEZvciBpbnN0YW5jZSwgdGhlIHtAbGluayBTZXJ2ZXJTeW5jfSBtb2R1bGUga2VlcHMgdHJhY2sgb2YgdGhlIHRpbWUgb2Zmc2V0IGJldHdlZW4gdGhlIGNsaWVudCBhbmQgdGhlIHN5bmMgY2xvY2tzIGluIGB0aGlzLm1vZHVsZXMuc3luYy50aW1lT2Zmc2V0YC5cblx0XHQgKiBTaW1pbGFybHksIGEge0BsaW5rIFNlcnZlclBlcmZvcm1hbmNlfSBtb2R1bGUgY291bGQga2VlcCB0cmFjayBvZiBlYWNoIGNsaWVudCdzIHN0YXR1cyBpbiBgdGhpcy5tb2R1bGVzLm15UGVyZm9ybWFuY2VOYW1lLnN0YXR1c2AuXG5cdFx0ICogQHR5cGUge09iamVjdH1cblx0XHQgKi9cbiAgICB0aGlzLm1vZHVsZXMgPSB7fTtcblxuXHRcdC8qKlxuXHRcdCAqIFNvY2tldCB1c2VkIHRvIGNvbW11bmljYXRlIHdpdGggdGhlIGNsaWVudC5cblx0XHQgKiBAdHlwZSB7U29ja2V0fVxuXHRcdCAqIEB0b2RvIG1ha2UgcHJpdmF0ZT9cblx0XHQgKi9cbiAgICAvLyB0aGlzLnNvY2tldCA9IHNvY2tldDtcbiAgICB0aGlzLnNvY2tldCA9IHNvY2tldDtcbiAgfVxuXG5cdC8qKlxuXHQgKiBTZW5kcyBhIFdlYlNvY2tldCBtZXNzYWdlIHRvIHRoZSBjbGllbnQuXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBtc2cgTmFtZSBvZiB0aGUgbWVzc2FnZS5cblx0ICogQHBhcmFtIHsuLi4qfSBhcmdzIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cblx0ICovXG4gIC8vIHNlbmQobXNnLCAuLi5hcmdzKSB7XG4gIC8vICAgdGhpcy5zb2NrZXQuZW1pdChtc2csIC4uLmFyZ3MpO1xuXG4gIC8vICAgbG9nLnRyYWNlKHsgc29ja2V0OiB0aGlzLnNvY2tldCwgY2xpZW50VHlwZTogdGhpcy50eXBlLCBjaGFubmVsOiBtc2csIGFyZ3VtZW50czogYXJncyB9LCAnc29ja2V0LnNlbmQnKTtcbiAgLy8gfVxuXG5cdC8qKlxuXHQgKiBTZW5kcyBhIHZvbGF0aWxlIFdlYlNvY2tldCBtZXNzYWdlIHRvIHRoZSBjbGllbnQsICppLmUuKiBhIG5vbi1ibG9ja2luZyBXZWJTb2NrZXQgbWVzc2FnZS5cblx0ICogQHBhcmFtIHtTdHJpbmd9IG1zZyBOYW1lIG9mIHRoZSBtZXNzYWdlIHRvIHNlbmQuXG5cdCAqIEBwYXJhbSB7Li4uKn0gYXJncyBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG5cdCAqL1xuICAvLyBzZW5kVm9sYXRpbGUobXNnLCAuLi5hcmdzKSB7XG4gIC8vICAgdGhpcy5zb2NrZXQudm9sYXRpbGUuZW1pdChtc2csIC4uLmFyZ3MpO1xuXG4gIC8vICAgbG9nLnRyYWNlKHsgc29ja2V0OiB0aGlzLnNvY2tldCwgY2xpZW50VHlwZTogdGhpcy50eXBlLCBjaGFubmVsOiBtc2csIGFyZ3VtZW50czogYXJncyB9LCAnc29ja2V0LnNlbmRWb2xhdGlsZScpO1xuICAvLyB9XG5cblx0LyoqXG5cdCAqIEV4ZWN1dGVzIGEgY2FsbGJhY2sgZnVuY3Rpb24gd2hlbiBpdCByZWNlaXZlcyBhIFdlYlNvY2tldCBtZXNzYWdlIGZyb20gdGhlIGNsaWVudC5cblx0ICogQHBhcmFtIHtTdHJpbmd9IG1zZyBOYW1lIG9mIHRoZSByZWNlaXZlZCBtZXNzYWdlLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsYmFjayBmdW5jdGlvbiBleGVjdXRlZCB3aGVuIHRoZSBtZXNzYWdlIGlzIHJlY2VpdmVkLlxuXHQgKi9cbiAgLy8gcmVjZWl2ZShtc2csIGNhbGxiYWNrKSB7XG4gIC8vICAgdmFyIF9jYWxsYmFjayA9IChmdW5jdGlvbiguLi5hcmdzKSB7XG4gIC8vICAgICBjYWxsYmFjay5hcHBseSh0aGlzLnNvY2tldCwgYXJncyk7XG5cbiAgLy8gICAgIGxvZy50cmFjZSh7IHNvY2tldDogdGhpcy5zb2NrZXQsIGNsaWVudFR5cGU6IHRoaXMudHlwZSwgY2hhbm5lbDogbXNnLCBhcmd1bWVudHM6IGFyZ3MgfSwgJ3NvY2tldC5yZWNlaXZlJyk7XG4gIC8vICAgfSkuYmluZCh0aGlzKTtcblxuICAvLyAgIHRoaXMuc29ja2V0Lm9uKG1zZywgX2NhbGxiYWNrKTtcbiAgLy8gfVxuXG5cdC8qKlxuXHQgKiBTZW5kcyBhIFdlYlNvY2tldCBtZXNzYWdlIHRvIGFsbCB0aGUgb3RoZXIgY2xpZW50cyBvZiB0aGUgc2FtZSB0eXBlICgqaS5lLiogYWxsIHRoZSBjbGllbnRzIG9mIHR5cGUgYHRoaXMuY2xpZW50VHlwZWAsIGV4Y2x1ZGluZyB0aGlzIGNsaWVudCkuXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBtc2cgTmFtZSBvZiB0aGUgbWVzc2FnZSB0byBicm9hZGNhc3QuXG5cdCAqIEBwYXJhbSB7Li4uKn0gYXJncyBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG5cdCAqL1xuICAvLyBicm9hZGNhc3QobXNnLCAuLi5hcmdzKSB7XG4gIC8vICAgdGhpcy5zb2NrZXQuYnJvYWRjYXN0LmVtaXQobXNnLCAuLi5hcmdzKTtcblxuICAvLyAgIGxvZy50cmFjZSh7IHNvY2tldDogdGhpcy5zb2NrZXQsIGNsaWVudFR5cGU6IHRoaXMudHlwZSwgY2hhbm5lbDogbXNnLCBhcmd1bWVudHM6IGFyZ3MgfSwgJ3NvY2tldC5icm9hZGNhc3QnKTtcbiAgLy8gfVxufVxuXG4iXX0=