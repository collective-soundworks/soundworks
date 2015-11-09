'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

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

var Client = (function () {
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
				this.socket = socket;
		}

		/**
   * Sends a WebSocket message to the client.
   * @param {String} msg Name of the message.
   * @param {...*} args Arguments of the message (as many as needed, of any type).
   */

		_createClass(Client, [{
				key: 'send',
				value: function send(msg) {
						var _socket;

						for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
								args[_key - 1] = arguments[_key];
						}

						_logger2['default'].trace({ socket: this.socket, clientType: this.type, channel: msg, arguments: args }, 'socket.send');
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

						_logger2['default'].trace({ socket: this.socket, clientType: this.type, channel: msg, arguments: args }, 'socket.sendVolatile');
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

								_logger2['default'].trace({ socket: this.socket, clientType: this.type, channel: msg, arguments: args }, 'socket.receive');
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

						_logger2['default'].trace({ socket: this.socket, clientType: this.type, channel: msg, arguments: args }, 'socket.broadcast');
						(_socket$broadcast = this.socket.broadcast).emit.apply(_socket$broadcast, [msg].concat(args));
				}
		}]);

		return Client;
})();

exports['default'] = Client;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvQ2xpZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztzQkFBZ0IsVUFBVTs7Ozs7Ozs7OztJQVFMLE1BQU07Ozs7Ozs7QUFNZixXQU5TLE1BQU0sQ0FNZCxVQUFVLEVBQUUsTUFBTSxFQUFFOzBCQU5aLE1BQU07Ozs7OztBQVd2QixRQUFJLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQzs7Ozs7O0FBTXZCLFFBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7Ozs7OztBQU1oQixRQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQzs7Ozs7Ozs7O0FBU3hCLFFBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDOzs7Ozs7O0FBT2xCLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0dBQ3RCOzs7Ozs7OztlQXhDa0IsTUFBTTs7V0ErQ3JCLGNBQUMsR0FBRyxFQUFXOzs7d0NBQU4sSUFBSTtBQUFKLFlBQUk7OztBQUNmLDBCQUFJLEtBQUssQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFFLGFBQWEsQ0FBQyxDQUFDO0FBQ3hHLGlCQUFBLElBQUksQ0FBQyxNQUFNLEVBQUMsSUFBSSxNQUFBLFdBQUMsR0FBRyxTQUFLLElBQUksRUFBQyxDQUFDO0tBQ2hDOzs7Ozs7Ozs7V0FPVyxzQkFBQyxHQUFHLEVBQVc7Ozt5Q0FBTixJQUFJO0FBQUosWUFBSTs7O0FBQ3ZCLDBCQUFJLEtBQUssQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFFLHFCQUFxQixDQUFDLENBQUM7QUFDaEgsMEJBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUMsSUFBSSxNQUFBLG9CQUFDLEdBQUcsU0FBSyxJQUFJLEVBQUMsQ0FBQztLQUN6Qzs7Ozs7Ozs7O1dBT00saUJBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRTtBQUNyQixVQUFJLFNBQVMsR0FBRyxDQUFDLFlBQWtCOzJDQUFOLElBQUk7QUFBSixjQUFJOzs7QUFDL0IsNEJBQUksS0FBSyxDQUFDLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztBQUMzRyxnQkFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO09BQ25DLENBQUEsQ0FBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRWQsVUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0tBQ2hDOzs7Ozs7Ozs7V0FPUSxtQkFBQyxHQUFHLEVBQVc7Ozt5Q0FBTixJQUFJO0FBQUosWUFBSTs7O0FBQ3BCLDBCQUFJLEtBQUssQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFFLGtCQUFrQixDQUFDLENBQUM7QUFDN0csMkJBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUMsSUFBSSxNQUFBLHFCQUFDLEdBQUcsU0FBSyxJQUFJLEVBQUMsQ0FBQztLQUMxQzs7O1NBcEZrQixNQUFNOzs7cUJBQU4sTUFBTSIsImZpbGUiOiJzcmMvc2VydmVyL0NsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBsb2cgZnJvbSAnLi9sb2dnZXInO1xuXG5cbi8qKlxuICogVGhlIHtAbGluayBDbGllbnR9IG1vZHVsZSBpcyB1c2VkIHRvIGtlZXAgdHJhY2sgb2YgZWFjaCBjb25uZWN0ZWQgY2xpZW50IGFuZCB0byBjb21tdW5pY2F0ZSB3aXRoIGl0IHZpYSBXZWJTb2NrZXRzLlxuICogRWFjaCB0aW1lIGEgY2xpZW50IG9mIHR5cGUgYGNsaWVudFR5cGVgIGNvbm5lY3RzIHRvIHRoZSBzZXJ2ZXIsICpTb3VuZHdvcmtzKiBjcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIGBDbGllbnRgLlxuICogQW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzIGlzIHBhc3NlZCB0byB0aGUgYGNvbm5lY3RgIGFuZCBgZGlzY29ubmVjdGAgbWV0aG9kcyBvZiBhbGwgdGhlIHNlcnZlciBzaWRlIG1vZHVsZXMgdGhhdCBhcmUgbWFwcGVkIHRvIHRoZSBgY2xpZW50VHlwZWAgY2xpZW50cyAoc2VlIHtAbGluayBzZXJ2ZXIubWFwfSksIGFzIHdlbGwgYXMgdG8gdGhlIGBlbnRlcmAgYW5kIGBleGl0YCBtZXRob2RzIG9mIGFueSB7QGxpbmsgU2VydmVyUGVyZm9ybWFuY2V9IGNsYXNzIG1hcHBlZCB0byB0aGF0IHNhbWUgY2xpZW50IHR5cGUuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudCB7XG5cdC8qKlxuXHQgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy5cblx0ICogQHBhcmFtIHtTdHJpbmd9IGNsaWVudFR5cGUgQ2xpZW50IHR5cGUgb2YgdGhlIGNvbm5lY3RlZCBjbGllbnQuXG5cdCAqIEBwYXJhbSB7U29ja2V0fSBzb2NrZXQgU29ja2V0IG9iamVjdCB1c2VkIHRvIGNvbW1pbnVhdGUgd2l0aCB0aGUgY2xpZW50LlxuXHQgKi9cblx0Y29uc3RydWN0b3IoY2xpZW50VHlwZSwgc29ja2V0KSB7XG5cdFx0LyoqXG5cdFx0ICogQ2xpZW50IHR5cGUgKHNwZWNpZmllZCB3aGVuIGluaXRpYWxpemluZyB0aGUge0BsaW5rIGNsaWVudH0gb2JqZWN0IG9uIHRoZSBjbGllbnQgc2lkZSB3aXRoIHtAbGluayBjbGllbnQuaW5pdH0pLlxuXHRcdCAqIEB0eXBlIHtTdHJpbmd9XG5cdFx0ICovXG4gICAgdGhpcy50eXBlID0gY2xpZW50VHlwZTtcblxuXHRcdC8qKlxuXHRcdCAqIEluZGV4IG9mIHRoZSBjbGllbnQgYXMgc2V0IGJ5IHRoZSB7QGxpbmsgU2VydmVyQ2hlY2tpbn0gbW9kdWxlLlxuXHRcdCAqIEB0eXBlIHtOdW1iZXJ9XG5cdFx0ICovXG4gICAgdGhpcy5pbmRleCA9IC0xO1xuXG5cdFx0LyoqXG5cdFx0ICogQ29vcmRpbmF0ZXMgb2YgdGhlIGNsaWVudCBpbiB0aGUgc3BhY2UsIHN0b3JlZCBhcyBhbiBgW3gsIHldYCBhcnJheS5cblx0XHQgKiBAdHlwZSB7TnVtYmVyW119XG5cdFx0ICovXG4gICAgdGhpcy5jb29yZGluYXRlcyA9IG51bGw7XG5cblx0XHQvKipcblx0XHQgKiBVc2VkIGJ5IGFueSB7QGxpbmsgU2VydmVyTW9kdWxlfSB0byBhc3NvY2lhdGUgZGF0YSB0byBhIHBhcnRpY3VsYXIgY2xpZW50LlxuXHRcdCAqIEFsbCB0aGUgZGF0YSBhc3NvY2lhdGVkIHdpdGggYSBtb2R1bGUgd2hvc2UgYG5hbWVgIGlzIGBtb2R1bGVOYW1lYCBpcyBhY2Nlc3NpYmxlIHRocm91Z2ggdGhlIGtleSBgbW9kdWxlTmFtZWAuXG5cdFx0ICogRm9yIGluc3RhbmNlLCB0aGUge0BsaW5rIFNlcnZlclN5bmN9IG1vZHVsZSBrZWVwcyB0cmFjayBvZiB0aGUgdGltZSBvZmZzZXQgYmV0d2VlbiB0aGUgY2xpZW50IGFuZCB0aGUgc3luYyBjbG9ja3MgaW4gYHRoaXMubW9kdWxlcy5zeW5jLnRpbWVPZmZzZXRgLlxuXHRcdCAqIFNpbWlsYXJseSwgYSB7QGxpbmsgU2VydmVyUGVyZm9ybWFuY2V9IG1vZHVsZSBjb3VsZCBrZWVwIHRyYWNrIG9mIGVhY2ggY2xpZW50J3Mgc3RhdHVzIGluIGB0aGlzLm1vZHVsZXMubXlQZXJmb3JtYW5jZU5hbWUuc3RhdHVzYC5cblx0XHQgKiBAdHlwZSB7T2JqZWN0fVxuXHRcdCAqL1xuICAgIHRoaXMubW9kdWxlcyA9IHt9O1xuXG5cdFx0LyoqXG5cdFx0ICogU29ja2V0IHVzZWQgdG8gY29tbXVuaWNhdGUgd2l0aCB0aGUgY2xpZW50LlxuXHRcdCAqIEB0eXBlIHtTb2NrZXR9XG5cdFx0ICogQHRvZG8gbWFrZSBwcml2YXRlP1xuXHRcdCAqL1xuICAgIHRoaXMuc29ja2V0ID0gc29ja2V0O1xuICB9XG5cblx0LyoqXG5cdCAqIFNlbmRzIGEgV2ViU29ja2V0IG1lc3NhZ2UgdG8gdGhlIGNsaWVudC5cblx0ICogQHBhcmFtIHtTdHJpbmd9IG1zZyBOYW1lIG9mIHRoZSBtZXNzYWdlLlxuXHQgKiBAcGFyYW0gey4uLip9IGFyZ3MgQXJndW1lbnRzIG9mIHRoZSBtZXNzYWdlIChhcyBtYW55IGFzIG5lZWRlZCwgb2YgYW55IHR5cGUpLlxuXHQgKi9cbiAgc2VuZChtc2csIC4uLmFyZ3MpIHtcbiAgICBsb2cudHJhY2UoeyBzb2NrZXQ6IHRoaXMuc29ja2V0LCBjbGllbnRUeXBlOiB0aGlzLnR5cGUsIGNoYW5uZWw6IG1zZywgYXJndW1lbnRzOiBhcmdzIH0sICdzb2NrZXQuc2VuZCcpO1xuICAgIHRoaXMuc29ja2V0LmVtaXQobXNnLCAuLi5hcmdzKTtcbiAgfVxuXG5cdC8qKlxuXHQgKiBTZW5kcyBhIHZvbGF0aWxlIFdlYlNvY2tldCBtZXNzYWdlIHRvIHRoZSBjbGllbnQsICppLmUuKiBhIG5vbi1ibG9ja2luZyBXZWJTb2NrZXQgbWVzc2FnZS5cblx0ICogQHBhcmFtIHtTdHJpbmd9IG1zZyBOYW1lIG9mIHRoZSBtZXNzYWdlIHRvIHNlbmQuXG5cdCAqIEBwYXJhbSB7Li4uKn0gYXJncyBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG5cdCAqL1xuICBzZW5kVm9sYXRpbGUobXNnLCAuLi5hcmdzKSB7XG4gICAgbG9nLnRyYWNlKHsgc29ja2V0OiB0aGlzLnNvY2tldCwgY2xpZW50VHlwZTogdGhpcy50eXBlLCBjaGFubmVsOiBtc2csIGFyZ3VtZW50czogYXJncyB9LCAnc29ja2V0LnNlbmRWb2xhdGlsZScpO1xuICAgIHRoaXMuc29ja2V0LnZvbGF0aWxlLmVtaXQobXNnLCAuLi5hcmdzKTtcbiAgfVxuXG5cdC8qKlxuXHQgKiBFeGVjdXRlcyBhIGNhbGxiYWNrIGZ1bmN0aW9uIHdoZW4gaXQgcmVjZWl2ZXMgYSBXZWJTb2NrZXQgbWVzc2FnZSBmcm9tIHRoZSBjbGllbnQuXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBtc2cgTmFtZSBvZiB0aGUgcmVjZWl2ZWQgbWVzc2FnZS5cblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGJhY2sgZnVuY3Rpb24gZXhlY3V0ZWQgd2hlbiB0aGUgbWVzc2FnZSBpcyByZWNlaXZlZC5cblx0ICovXG4gIHJlY2VpdmUobXNnLCBjYWxsYmFjaykge1xuICAgIHZhciBfY2FsbGJhY2sgPSAoZnVuY3Rpb24oLi4uYXJncykge1xuICAgICAgbG9nLnRyYWNlKHsgc29ja2V0OiB0aGlzLnNvY2tldCwgY2xpZW50VHlwZTogdGhpcy50eXBlLCBjaGFubmVsOiBtc2csIGFyZ3VtZW50czogYXJncyB9LCAnc29ja2V0LnJlY2VpdmUnKTtcbiAgICAgIGNhbGxiYWNrLmFwcGx5KHRoaXMuc29ja2V0LCBhcmdzKTtcbiAgICB9KS5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5zb2NrZXQub24obXNnLCBfY2FsbGJhY2spO1xuICB9XG5cblx0LyoqXG5cdCAqIFNlbmRzIGEgV2ViU29ja2V0IG1lc3NhZ2UgdG8gYWxsIHRoZSBvdGhlciBjbGllbnRzIG9mIHRoZSBzYW1lIHR5cGUgKCppLmUuKiBhbGwgdGhlIGNsaWVudHMgb2YgdHlwZSBgdGhpcy5jbGllbnRUeXBlYCwgZXhjbHVkaW5nIHRoaXMgY2xpZW50KS5cblx0ICogQHBhcmFtIHtTdHJpbmd9IG1zZyBOYW1lIG9mIHRoZSBtZXNzYWdlIHRvIGJyb2FkY2FzdC5cblx0ICogQHBhcmFtIHsuLi4qfSBhcmdzIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cblx0ICovXG4gIGJyb2FkY2FzdChtc2csIC4uLmFyZ3MpIHtcbiAgICBsb2cudHJhY2UoeyBzb2NrZXQ6IHRoaXMuc29ja2V0LCBjbGllbnRUeXBlOiB0aGlzLnR5cGUsIGNoYW5uZWw6IG1zZywgYXJndW1lbnRzOiBhcmdzIH0sICdzb2NrZXQuYnJvYWRjYXN0Jyk7XG4gICAgdGhpcy5zb2NrZXQuYnJvYWRjYXN0LmVtaXQobXNnLCAuLi5hcmdzKTtcbiAgfVxufVxuXG4iXX0=