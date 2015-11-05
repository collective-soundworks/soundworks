'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var log = require('./logger');

/**
 * The {@link ServerClient} module is used to keep track of each connected client and to communicate with it via WebSockets.
 * Each time a client of type `clientType` connects to the server, *Soundworks* creates a new instance of `ServerClient`.
 * An instance of the class is passed to the `connect` and `disconnect` methods of all the server side modules that are mapped to the `clientType` clients (see {@link server.map}), as well as to the `enter` and `exit` methods of any {@link ServerPerformance} class mapped to that same client type.
 */

var ServerClient = (function () {
		// export default class ServerClient {
		/**
   * Creates an instance of the class.
   * @param {String} clientType Client type of the connected client.
   * @param {Socket} socket Socket object used to comminuate with the client.
   */

		function ServerClient(clientType, socket) {
				_classCallCheck(this, ServerClient);

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

		_createClass(ServerClient, [{
				key: 'send',
				value: function send(msg) {
						var _socket;

						for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
								args[_key - 1] = arguments[_key];
						}

						log.trace({ socket: this.socket, clientType: this.type, channel: msg, arguments: args }, 'socket.send');
						(_socket = this.socket).emit.apply(_socket, [msg].concat(args));
				}

				/**
     * Sends a volatile WebSocket message to the client, *i.e.* a non-blocking WebSocket message.
     * @param {String} msg Name of the message to send.
     * @param {...*} args Arguments of the message (as many as needed, of any type).
     */
		}, {
				key: 'sendVolatile',
				value: function sendVolatile(msg) {
						var _socket$volatile;

						for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
								args[_key2 - 1] = arguments[_key2];
						}

						log.trace({ socket: this.socket, clientType: this.type, channel: msg, arguments: args }, 'socket.sendVolatile');
						(_socket$volatile = this.socket.volatile).emit.apply(_socket$volatile, [msg].concat(args));
				}

				/**
     * Executes a callback function when it receives a WebSocket message from the client.
     * @param {String} msg Name of the received message.
     * @param {Function} callback Callback function executed when the message is received.
     */
		}, {
				key: 'receive',
				value: function receive(msg, callback) {
						var _callback = (function () {
								for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
										args[_key3] = arguments[_key3];
								}

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
		}, {
				key: 'broadcast',
				value: function broadcast(msg) {
						var _socket$broadcast;

						for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
								args[_key4 - 1] = arguments[_key4];
						}

						log.trace({ socket: this.socket, clientType: this.type, channel: msg, arguments: args }, 'socket.broadcast');
						(_socket$broadcast = this.socket.broadcast).emit.apply(_socket$broadcast, [msg].concat(args));
				}
		}]);

		return ServerClient;
})();

module.exports = ServerClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvQ2xpZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7Ozs7O0FBRWIsSUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDOzs7Ozs7OztJQU8xQixZQUFZOzs7Ozs7OztBQU9OLFdBUE4sWUFBWSxDQU9MLFVBQVUsRUFBRSxNQUFNLEVBQUU7MEJBUDNCLFlBQVk7Ozs7OztBQVlkLFFBQUksQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDOzs7Ozs7QUFNdkIsUUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQzs7Ozs7O0FBTWhCLFFBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDOzs7Ozs7Ozs7QUFTeEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7Ozs7Ozs7QUFPbEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7R0FDdEI7Ozs7Ozs7O2VBekNHLFlBQVk7O1dBZ0RaLGNBQUMsR0FBRyxFQUFXOzs7d0NBQU4sSUFBSTtBQUFKLFlBQUk7OztBQUNmLFNBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsRUFBRSxhQUFhLENBQUMsQ0FBQztBQUN4RyxpQkFBQSxJQUFJLENBQUMsTUFBTSxFQUFDLElBQUksTUFBQSxXQUFDLEdBQUcsU0FBSyxJQUFJLEVBQUMsQ0FBQztLQUNoQzs7Ozs7Ozs7O1dBT1csc0JBQUMsR0FBRyxFQUFXOzs7eUNBQU4sSUFBSTtBQUFKLFlBQUk7OztBQUN2QixTQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUUscUJBQXFCLENBQUMsQ0FBQztBQUNoSCwwQkFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBQyxJQUFJLE1BQUEsb0JBQUMsR0FBRyxTQUFLLElBQUksRUFBQyxDQUFDO0tBQ3pDOzs7Ozs7Ozs7V0FPTSxpQkFBQyxHQUFHLEVBQUUsUUFBUSxFQUFFO0FBQ3JCLFVBQUksU0FBUyxHQUFHLENBQUMsWUFBa0I7MkNBQU4sSUFBSTtBQUFKLGNBQUk7OztBQUMvQixXQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztBQUMzRyxnQkFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO09BQ25DLENBQUEsQ0FBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRWQsVUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0tBQ2hDOzs7Ozs7Ozs7V0FPUSxtQkFBQyxHQUFHLEVBQVc7Ozt5Q0FBTixJQUFJO0FBQUosWUFBSTs7O0FBQ3BCLFNBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO0FBQzdHLDJCQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFDLElBQUksTUFBQSxxQkFBQyxHQUFHLFNBQUssSUFBSSxFQUFDLENBQUM7S0FDMUM7OztTQXJGRyxZQUFZOzs7QUF3RmxCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDIiwiZmlsZSI6InNyYy9zZXJ2ZXIvQ2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCBsb2cgPSByZXF1aXJlKCcuL2xvZ2dlcicpO1xuXG4vKipcbiAqIFRoZSB7QGxpbmsgU2VydmVyQ2xpZW50fSBtb2R1bGUgaXMgdXNlZCB0byBrZWVwIHRyYWNrIG9mIGVhY2ggY29ubmVjdGVkIGNsaWVudCBhbmQgdG8gY29tbXVuaWNhdGUgd2l0aCBpdCB2aWEgV2ViU29ja2V0cy5cbiAqIEVhY2ggdGltZSBhIGNsaWVudCBvZiB0eXBlIGBjbGllbnRUeXBlYCBjb25uZWN0cyB0byB0aGUgc2VydmVyLCAqU291bmR3b3JrcyogY3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiBgU2VydmVyQ2xpZW50YC5cbiAqIEFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcyBpcyBwYXNzZWQgdG8gdGhlIGBjb25uZWN0YCBhbmQgYGRpc2Nvbm5lY3RgIG1ldGhvZHMgb2YgYWxsIHRoZSBzZXJ2ZXIgc2lkZSBtb2R1bGVzIHRoYXQgYXJlIG1hcHBlZCB0byB0aGUgYGNsaWVudFR5cGVgIGNsaWVudHMgKHNlZSB7QGxpbmsgc2VydmVyLm1hcH0pLCBhcyB3ZWxsIGFzIHRvIHRoZSBgZW50ZXJgIGFuZCBgZXhpdGAgbWV0aG9kcyBvZiBhbnkge0BsaW5rIFNlcnZlclBlcmZvcm1hbmNlfSBjbGFzcyBtYXBwZWQgdG8gdGhhdCBzYW1lIGNsaWVudCB0eXBlLlxuICovXG5jbGFzcyBTZXJ2ZXJDbGllbnQge1xuLy8gZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmVyQ2xpZW50IHtcblx0LyoqXG5cdCAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gY2xpZW50VHlwZSBDbGllbnQgdHlwZSBvZiB0aGUgY29ubmVjdGVkIGNsaWVudC5cblx0ICogQHBhcmFtIHtTb2NrZXR9IHNvY2tldCBTb2NrZXQgb2JqZWN0IHVzZWQgdG8gY29tbWludWF0ZSB3aXRoIHRoZSBjbGllbnQuXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcihjbGllbnRUeXBlLCBzb2NrZXQpIHtcblx0XHQvKipcblx0XHQgKiBDbGllbnQgdHlwZSAoc3BlY2lmaWVkIHdoZW4gaW5pdGlhbGl6aW5nIHRoZSB7QGxpbmsgY2xpZW50fSBvYmplY3Qgb24gdGhlIGNsaWVudCBzaWRlIHdpdGgge0BsaW5rIGNsaWVudC5pbml0fSkuXG5cdFx0ICogQHR5cGUge1N0cmluZ31cblx0XHQgKi9cbiAgICB0aGlzLnR5cGUgPSBjbGllbnRUeXBlO1xuXG5cdFx0LyoqXG5cdFx0ICogSW5kZXggb2YgdGhlIGNsaWVudCBhcyBzZXQgYnkgdGhlIHtAbGluayBTZXJ2ZXJDaGVja2lufSBtb2R1bGUuXG5cdFx0ICogQHR5cGUge051bWJlcn1cblx0XHQgKi9cbiAgICB0aGlzLmluZGV4ID0gLTE7XG5cblx0XHQvKipcblx0XHQgKiBDb29yZGluYXRlcyBvZiB0aGUgY2xpZW50IGluIHRoZSBzcGFjZSwgc3RvcmVkIGFzIGFuIGBbeCwgeV1gIGFycmF5LlxuXHRcdCAqIEB0eXBlIHtOdW1iZXJbXX1cblx0XHQgKi9cbiAgICB0aGlzLmNvb3JkaW5hdGVzID0gbnVsbDtcblxuXHRcdC8qKlxuXHRcdCAqIFVzZWQgYnkgYW55IHtAbGluayBTZXJ2ZXJNb2R1bGV9IHRvIGFzc29jaWF0ZSBkYXRhIHRvIGEgcGFydGljdWxhciBjbGllbnQuXG5cdFx0ICogQWxsIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCBhIG1vZHVsZSB3aG9zZSBgbmFtZWAgaXMgYG1vZHVsZU5hbWVgIGlzIGFjY2Vzc2libGUgdGhyb3VnaCB0aGUga2V5IGBtb2R1bGVOYW1lYC5cblx0XHQgKiBGb3IgaW5zdGFuY2UsIHRoZSB7QGxpbmsgU2VydmVyU3luY30gbW9kdWxlIGtlZXBzIHRyYWNrIG9mIHRoZSB0aW1lIG9mZnNldCBiZXR3ZWVuIHRoZSBjbGllbnQgYW5kIHRoZSBzeW5jIGNsb2NrcyBpbiBgdGhpcy5tb2R1bGVzLnN5bmMudGltZU9mZnNldGAuXG5cdFx0ICogU2ltaWxhcmx5LCBhIHtAbGluayBTZXJ2ZXJQZXJmb3JtYW5jZX0gbW9kdWxlIGNvdWxkIGtlZXAgdHJhY2sgb2YgZWFjaCBjbGllbnQncyBzdGF0dXMgaW4gYHRoaXMubW9kdWxlcy5teVBlcmZvcm1hbmNlTmFtZS5zdGF0dXNgLlxuXHRcdCAqIEB0eXBlIHtPYmplY3R9XG5cdFx0ICovXG4gICAgdGhpcy5tb2R1bGVzID0ge307XG5cblx0XHQvKipcblx0XHQgKiBTb2NrZXQgdXNlZCB0byBjb21tdW5pY2F0ZSB3aXRoIHRoZSBjbGllbnQuXG5cdFx0ICogQHR5cGUge1NvY2tldH1cblx0XHQgKiBAdG9kbyBtYWtlIHByaXZhdGU/XG5cdFx0ICovXG4gICAgdGhpcy5zb2NrZXQgPSBzb2NrZXQ7XG4gIH1cblxuXHQvKipcblx0ICogU2VuZHMgYSBXZWJTb2NrZXQgbWVzc2FnZSB0byB0aGUgY2xpZW50LlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gbXNnIE5hbWUgb2YgdGhlIG1lc3NhZ2UuXG5cdCAqIEBwYXJhbSB7Li4uKn0gYXJncyBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG5cdCAqL1xuICBzZW5kKG1zZywgLi4uYXJncykge1xuICAgIGxvZy50cmFjZSh7IHNvY2tldDogdGhpcy5zb2NrZXQsIGNsaWVudFR5cGU6IHRoaXMudHlwZSwgY2hhbm5lbDogbXNnLCBhcmd1bWVudHM6IGFyZ3MgfSwgJ3NvY2tldC5zZW5kJyk7XG4gICAgdGhpcy5zb2NrZXQuZW1pdChtc2csIC4uLmFyZ3MpO1xuICB9XG5cblx0LyoqXG5cdCAqIFNlbmRzIGEgdm9sYXRpbGUgV2ViU29ja2V0IG1lc3NhZ2UgdG8gdGhlIGNsaWVudCwgKmkuZS4qIGEgbm9uLWJsb2NraW5nIFdlYlNvY2tldCBtZXNzYWdlLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gbXNnIE5hbWUgb2YgdGhlIG1lc3NhZ2UgdG8gc2VuZC5cblx0ICogQHBhcmFtIHsuLi4qfSBhcmdzIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cblx0ICovXG4gIHNlbmRWb2xhdGlsZShtc2csIC4uLmFyZ3MpIHtcbiAgICBsb2cudHJhY2UoeyBzb2NrZXQ6IHRoaXMuc29ja2V0LCBjbGllbnRUeXBlOiB0aGlzLnR5cGUsIGNoYW5uZWw6IG1zZywgYXJndW1lbnRzOiBhcmdzIH0sICdzb2NrZXQuc2VuZFZvbGF0aWxlJyk7XG4gICAgdGhpcy5zb2NrZXQudm9sYXRpbGUuZW1pdChtc2csIC4uLmFyZ3MpO1xuICB9XG5cblx0LyoqXG5cdCAqIEV4ZWN1dGVzIGEgY2FsbGJhY2sgZnVuY3Rpb24gd2hlbiBpdCByZWNlaXZlcyBhIFdlYlNvY2tldCBtZXNzYWdlIGZyb20gdGhlIGNsaWVudC5cblx0ICogQHBhcmFtIHtTdHJpbmd9IG1zZyBOYW1lIG9mIHRoZSByZWNlaXZlZCBtZXNzYWdlLlxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsYmFjayBmdW5jdGlvbiBleGVjdXRlZCB3aGVuIHRoZSBtZXNzYWdlIGlzIHJlY2VpdmVkLlxuXHQgKi9cbiAgcmVjZWl2ZShtc2csIGNhbGxiYWNrKSB7XG4gICAgdmFyIF9jYWxsYmFjayA9IChmdW5jdGlvbiguLi5hcmdzKSB7XG4gICAgICBsb2cudHJhY2UoeyBzb2NrZXQ6IHRoaXMuc29ja2V0LCBjbGllbnRUeXBlOiB0aGlzLnR5cGUsIGNoYW5uZWw6IG1zZywgYXJndW1lbnRzOiBhcmdzIH0sICdzb2NrZXQucmVjZWl2ZScpO1xuICAgICAgY2FsbGJhY2suYXBwbHkodGhpcy5zb2NrZXQsIGFyZ3MpO1xuICAgIH0pLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLnNvY2tldC5vbihtc2csIF9jYWxsYmFjayk7XG4gIH1cblxuXHQvKipcblx0ICogU2VuZHMgYSBXZWJTb2NrZXQgbWVzc2FnZSB0byBhbGwgdGhlIG90aGVyIGNsaWVudHMgb2YgdGhlIHNhbWUgdHlwZSAoKmkuZS4qIGFsbCB0aGUgY2xpZW50cyBvZiB0eXBlIGB0aGlzLmNsaWVudFR5cGVgLCBleGNsdWRpbmcgdGhpcyBjbGllbnQpLlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gbXNnIE5hbWUgb2YgdGhlIG1lc3NhZ2UgdG8gYnJvYWRjYXN0LlxuXHQgKiBAcGFyYW0gey4uLip9IGFyZ3MgQXJndW1lbnRzIG9mIHRoZSBtZXNzYWdlIChhcyBtYW55IGFzIG5lZWRlZCwgb2YgYW55IHR5cGUpLlxuXHQgKi9cbiAgYnJvYWRjYXN0KG1zZywgLi4uYXJncykge1xuICAgIGxvZy50cmFjZSh7IHNvY2tldDogdGhpcy5zb2NrZXQsIGNsaWVudFR5cGU6IHRoaXMudHlwZSwgY2hhbm5lbDogbXNnLCBhcmd1bWVudHM6IGFyZ3MgfSwgJ3NvY2tldC5icm9hZGNhc3QnKTtcbiAgICB0aGlzLnNvY2tldC5icm9hZGNhc3QuZW1pdChtc2csIC4uLmFyZ3MpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2VydmVyQ2xpZW50O1xuIl19