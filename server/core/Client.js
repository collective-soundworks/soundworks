// import logger from '../utils/logger';

"use strict";

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

Object.defineProperty(exports, "__esModule", {
		value: true
});
var _counter = 0;
function _getUID() {
		return _counter++;
}

/**
 * Client that connects to the server.
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

var Client = (function () {
		/**
   * @param {String} clientType Client type of the connected client.
   * @param {Socket} socket Socket object used to comminuate with the client.
   * @private
   */

		function Client(clientType, socket) {
				_classCallCheck(this, Client);

				/**
     * Client type (specified when initializing the {@link client} object on the client side with {@link client.init}).
     * @type {String}
     */
				this.type = clientType;

				/**
     * Index of the client.
     * @type {Number}
     */
				this.uid = _getUID();

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

		_createClass(Client, [{
				key: "destroy",
				value: function destroy() {
						this.uid = -1;
				}
		}]);

		return Client;
})();

exports["default"] = Client;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvY29yZS9DbGllbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFFQSxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUM7QUFDakIsU0FBUyxPQUFPLEdBQUc7QUFBRSxTQUFPLFFBQVEsRUFBRSxDQUFDO0NBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFxQnBCLE1BQU07Ozs7Ozs7QUFNZixXQU5TLE1BQU0sQ0FNZCxVQUFVLEVBQUUsTUFBTSxFQUFFOzBCQU5aLE1BQU07Ozs7OztBQVd2QixRQUFJLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQzs7Ozs7O0FBTXZCLFFBQUksQ0FBQyxHQUFHLEdBQUcsT0FBTyxFQUFFLENBQUM7Ozs7OztBQU1yQixRQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQzs7Ozs7Ozs7OztBQVV4QixRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQzs7Ozs7Ozs7O0FBU2xCLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0dBQ3RCOzs7Ozs7ZUEzQ2tCLE1BQU07O1dBZ0RsQixtQkFBRztBQUNSLFVBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7S0FDZjs7O1NBbERrQixNQUFNOzs7cUJBQU4sTUFBTSIsImZpbGUiOiJzcmMvc2VydmVyL2NvcmUvQ2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IGxvZ2dlciBmcm9tICcuLi91dGlscy9sb2dnZXInO1xuXG5sZXQgX2NvdW50ZXIgPSAwO1xuZnVuY3Rpb24gX2dldFVJRCgpIHsgcmV0dXJuIF9jb3VudGVyKys7IH1cblxuLyoqXG4gKiBDbGllbnQgdGhhdCBjb25uZWN0cyB0byB0aGUgc2VydmVyLlxuICpcbiAqIEVhY2ggdGltZSBhIGNsaWVudCBvZiB0eXBlIGAnY2xpZW50VHlwZSdgIGNvbm5lY3RzIHRvIHRoZSBzZXJ2ZXIsICpTb3VuZHdvcmtzKiBjcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIGBDbGllbnRgLlxuICogQW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzIGlzIHBhc3NlZCB0byB0aGUgYGNvbm5lY3RgIGFuZCBgZGlzY29ubmVjdGAgbWV0aG9kcyBvZiBhbGwgdGhlIHNlcnZlciBzaWRlIG1vZHVsZXMgdGhhdCBhcmUgbWFwcGVkIHRvIHRoZSBgJ2NsaWVudFR5cGUnYCBjbGllbnRzIChzZWUge0BsaW5rIHNlcnZlciNtYXB9KSwgYXMgd2VsbCBhcyB0byB0aGUgYGVudGVyYCBhbmQgYGV4aXRgIG1ldGhvZHMgb2YgYW55IHtAbGluayBzcmMvc2VydmVyL1BlcmZvcm1hbmNlLmpzflBlcmZvcm1hbmNlfSBjbGFzcyBtYXBwZWQgdG8gdGhhdCBzYW1lIGNsaWVudCB0eXBlLlxuICpcbiAqIFRoZSBjbGFzcyBpcyBhbHNvIHVzZWQgdG8gY29tbXVuaWNhdGUgd2l0aCB0aGUgY2xpZW50IHZpYSBXZWJTb2NrZXRzLlxuICpcbiAqIEBleGFtcGxlIGNsYXNzIE15UGVyZm9ybWFuY2UgZXh0ZW5kcyBQZXJmb3JtYW5jZSB7XG4gKiAgIC8vIC4uLlxuICpcbiAqICAgZW50ZXIoY2xpZW50KSB7XG4gKiAgICAgY29uc3QgbXNnID0gXCJXZWxjb21lIHRvIHRoZSBwZXJmb3JtYW5jZSFcIjtcbiAqICAgICBjbGllbnQuc2VuZCgnaW5pdCcsIG1zZyk7XG4gKiAgIH1cbiAqXG4gKiAgIC8vIC4uLlxuICogfVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnQge1xuXHQvKipcblx0ICogQHBhcmFtIHtTdHJpbmd9IGNsaWVudFR5cGUgQ2xpZW50IHR5cGUgb2YgdGhlIGNvbm5lY3RlZCBjbGllbnQuXG5cdCAqIEBwYXJhbSB7U29ja2V0fSBzb2NrZXQgU29ja2V0IG9iamVjdCB1c2VkIHRvIGNvbW1pbnVhdGUgd2l0aCB0aGUgY2xpZW50LlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0Y29uc3RydWN0b3IoY2xpZW50VHlwZSwgc29ja2V0KSB7XG5cdFx0LyoqXG5cdFx0ICogQ2xpZW50IHR5cGUgKHNwZWNpZmllZCB3aGVuIGluaXRpYWxpemluZyB0aGUge0BsaW5rIGNsaWVudH0gb2JqZWN0IG9uIHRoZSBjbGllbnQgc2lkZSB3aXRoIHtAbGluayBjbGllbnQuaW5pdH0pLlxuXHRcdCAqIEB0eXBlIHtTdHJpbmd9XG5cdFx0ICovXG4gICAgdGhpcy50eXBlID0gY2xpZW50VHlwZTtcblxuXHRcdC8qKlxuXHRcdCAqIEluZGV4IG9mIHRoZSBjbGllbnQuXG5cdFx0ICogQHR5cGUge051bWJlcn1cblx0XHQgKi9cbiAgICB0aGlzLnVpZCA9IF9nZXRVSUQoKTtcblxuXHRcdC8qKlxuXHRcdCAqIENvb3JkaW5hdGVzIG9mIHRoZSBjbGllbnQsIHN0b3JlZCBhcyBhbiBgW3g6TnVtYmVyLCB5Ok51bWJlcl1gIGFycmF5LlxuXHRcdCAqIEB0eXBlIHtOdW1iZXJbXX1cblx0XHQgKi9cbiAgICB0aGlzLmNvb3JkaW5hdGVzID0gbnVsbDtcblxuXHRcdC8qKlxuXHRcdCAqIFVzZWQgYnkgYW55IHtAbGluayBzcmMvc2VydmVyL1NlcnZlck1vZHVsZS5qc35TZXJ2ZXJNb2R1bGV9IHRvIGFzc29jaWF0ZSBkYXRhIHRvIGEgcGFydGljdWxhciBjbGllbnQuXG5cdFx0ICpcblx0XHQgKiBBbGwgdGhlIGRhdGEgYXNzb2NpYXRlZCB3aXRoIGEgbW9kdWxlIHdob3NlIGBuYW1lYCBpcyBgJ21vZHVsZU5hbWUnYCBpcyBhY2Nlc3NpYmxlIHRocm91Z2ggdGhlIGtleSBgbW9kdWxlTmFtZWAuXG5cdFx0ICogRm9yIGluc3RhbmNlLCB0aGUge0BsaW5rIHNyYy9zZXJ2ZXIvQ2hlY2tpbi5qc35DaGVja2lufSBtb2R1bGUga2VlcHMgdHJhY2sgb2YgY2xpZW50J3MgY2hlY2tpbiBpbmRleCBhbmQgbGFiZWwgaW4gYHRoaXMubW9kdWxlcy5jaGVja2luLmluZGV4YCBhbmQgYHRoaXMubW9kdWxlcy5jaGVja2luLmxhYmVsYC5cblx0XHQgKiBTaW1pbGFybHksIGEge0BsaW5rIHNyYy9zZXJ2ZXIvUGVyZm9ybWFuY2UuanN+UGVyZm9ybWFuY2V9IG1vZHVsZSB3aG9zZSBuYW1lIGlzIGAnbXlQZXJmb3JtYW5jZSdgIGNvdWxkIHJlcG9ydCB0aGUgY2xpZW50J3Mgc3RhdHVzIGluIGB0aGlzLm1vZHVsZXMubXlQZXJmb3JtYW5jZS5zdGF0dXNgLlxuXHRcdCAqIEB0eXBlIHtPYmplY3R9XG5cdFx0ICovXG4gICAgdGhpcy5tb2R1bGVzID0ge307XG5cblx0XHQvKipcblx0XHQgKiBTb2NrZXQgdXNlZCB0byBjb21tdW5pY2F0ZSB3aXRoIHRoZSBjbGllbnQuXG5cdFx0ICogQHR5cGUge1NvY2tldH1cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqIEB0b2RvIC5zb2NrZXQgLT4gLl9zb2NrZXQgKG1heWJlPylcblx0XHQgKi9cbiAgICAvLyB0aGlzLnNvY2tldCA9IHNvY2tldDtcbiAgICB0aGlzLnNvY2tldCA9IHNvY2tldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95IHRoZSBjbGllbnQuXG4gICAqL1xuICBkZXN0cm95KCkge1xuICAgIHRoaXMudWlkID0gLTE7XG4gIH1cbn1cbiJdfQ==