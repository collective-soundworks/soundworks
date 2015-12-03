'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
		value: true
});

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var nextClientIndex = 0;
var availableClientIndices = [];

function _getClientIndex() {
		var index = -1;

		if (availableClientIndices.length > 0) {
				availableClientIndices.sort(function (a, b) {
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

		_createClass(Client, [{
				key: 'destroy',
				value: function destroy() {
						_releaseClientIndex(this.index);
						this.index = -1;
				}
		}]);

		return Client;
})();

exports['default'] = Client;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvQ2xpZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztzQkFBZ0IsVUFBVTs7OztBQUUxQixJQUFJLGVBQWUsR0FBRyxDQUFDLENBQUM7QUFDeEIsSUFBTSxzQkFBc0IsR0FBRyxFQUFFLENBQUM7O0FBRWxDLFNBQVMsZUFBZSxHQUFHO0FBQ3pCLE1BQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDOztBQUVmLE1BQUksc0JBQXNCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUNyQywwQkFBc0IsQ0FBQyxJQUFJLENBQUMsVUFBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3pDLGFBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNkLENBQUMsQ0FBQzs7QUFFSCxTQUFLLEdBQUcsc0JBQXNCLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztHQUNoRCxNQUFNO0FBQ0wsU0FBSyxHQUFHLGVBQWUsRUFBRSxDQUFDO0dBQzNCOztBQUVELFNBQU8sS0FBSyxDQUFDO0NBQ2Q7O0FBRUQsU0FBUyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUU7QUFDbEMsd0JBQXNCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0NBQ3BDOzs7Ozs7OztJQU9vQixNQUFNOzs7Ozs7O0FBTWYsV0FOUyxNQUFNLENBTWQsVUFBVSxFQUFFLE1BQU0sRUFBRTswQkFOWixNQUFNOzs7Ozs7QUFXdkIsUUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7Ozs7OztBQU12QixRQUFJLENBQUMsS0FBSyxHQUFHLGVBQWUsRUFBRSxDQUFDOzs7Ozs7QUFNL0IsUUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7Ozs7Ozs7OztBQVN4QixRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQzs7Ozs7Ozs7QUFRbEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7R0FDdEI7O2VBekNrQixNQUFNOztXQTJDbEIsbUJBQUc7QUFDUix5QkFBbUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDaEMsVUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztLQUNqQjs7O1NBOUNrQixNQUFNOzs7cUJBQU4sTUFBTSIsImZpbGUiOiJzcmMvc2VydmVyL0NsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBsb2cgZnJvbSAnLi9sb2dnZXInO1xuXG5sZXQgbmV4dENsaWVudEluZGV4ID0gMDtcbmNvbnN0IGF2YWlsYWJsZUNsaWVudEluZGljZXMgPSBbXTtcblxuZnVuY3Rpb24gX2dldENsaWVudEluZGV4KCkge1xuICB2YXIgaW5kZXggPSAtMTtcblxuICBpZiAoYXZhaWxhYmxlQ2xpZW50SW5kaWNlcy5sZW5ndGggPiAwKSB7XG4gICAgYXZhaWxhYmxlQ2xpZW50SW5kaWNlcy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgIHJldHVybiBhIC0gYjtcbiAgICB9KTtcblxuICAgIGluZGV4ID0gYXZhaWxhYmxlQ2xpZW50SW5kaWNlcy5zcGxpY2UoMCwgMSlbMF07XG4gIH0gZWxzZSB7XG4gICAgaW5kZXggPSBuZXh0Q2xpZW50SW5kZXgrKztcbiAgfVxuXG4gIHJldHVybiBpbmRleDtcbn1cblxuZnVuY3Rpb24gX3JlbGVhc2VDbGllbnRJbmRleChpbmRleCkge1xuICBhdmFpbGFibGVDbGllbnRJbmRpY2VzLnB1c2goaW5kZXgpO1xufVxuXG4vKipcbiAqIFRoZSB7QGxpbmsgQ2xpZW50fSBtb2R1bGUgaXMgdXNlZCB0byBrZWVwIHRyYWNrIG9mIGVhY2ggY29ubmVjdGVkIGNsaWVudCBhbmQgdG8gY29tbXVuaWNhdGUgd2l0aCBpdCB2aWEgV2ViU29ja2V0cy5cbiAqIEVhY2ggdGltZSBhIGNsaWVudCBvZiB0eXBlIGBjbGllbnRUeXBlYCBjb25uZWN0cyB0byB0aGUgc2VydmVyLCAqU291bmR3b3JrcyogY3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiBgQ2xpZW50YC5cbiAqIEFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcyBpcyBwYXNzZWQgdG8gdGhlIGBjb25uZWN0YCBhbmQgYGRpc2Nvbm5lY3RgIG1ldGhvZHMgb2YgYWxsIHRoZSBzZXJ2ZXIgc2lkZSBtb2R1bGVzIHRoYXQgYXJlIG1hcHBlZCB0byB0aGUgYGNsaWVudFR5cGVgIGNsaWVudHMgKHNlZSB7QGxpbmsgc2VydmVyLm1hcH0pLCBhcyB3ZWxsIGFzIHRvIHRoZSBgZW50ZXJgIGFuZCBgZXhpdGAgbWV0aG9kcyBvZiBhbnkge0BsaW5rIFNlcnZlclBlcmZvcm1hbmNlfSBjbGFzcyBtYXBwZWQgdG8gdGhhdCBzYW1lIGNsaWVudCB0eXBlLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnQge1xuXHQvKipcblx0ICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiB0aGUgY2xhc3MuXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBjbGllbnRUeXBlIENsaWVudCB0eXBlIG9mIHRoZSBjb25uZWN0ZWQgY2xpZW50LlxuXHQgKiBAcGFyYW0ge1NvY2tldH0gc29ja2V0IFNvY2tldCBvYmplY3QgdXNlZCB0byBjb21taW51YXRlIHdpdGggdGhlIGNsaWVudC5cblx0ICovXG5cdGNvbnN0cnVjdG9yKGNsaWVudFR5cGUsIHNvY2tldCkge1xuXHRcdC8qKlxuXHRcdCAqIENsaWVudCB0eXBlIChzcGVjaWZpZWQgd2hlbiBpbml0aWFsaXppbmcgdGhlIHtAbGluayBjbGllbnR9IG9iamVjdCBvbiB0aGUgY2xpZW50IHNpZGUgd2l0aCB7QGxpbmsgY2xpZW50LmluaXR9KS5cblx0XHQgKiBAdHlwZSB7U3RyaW5nfVxuXHRcdCAqL1xuICAgIHRoaXMudHlwZSA9IGNsaWVudFR5cGU7XG5cblx0XHQvKipcblx0XHQgKiBJbmRleCBvZiB0aGUgY2xpZW50IGFzIHNldCBieSB0aGUge0BsaW5rIFNlcnZlckNoZWNraW59IG1vZHVsZS5cblx0XHQgKiBAdHlwZSB7TnVtYmVyfVxuXHRcdCAqL1xuICAgIHRoaXMuaW5kZXggPSBfZ2V0Q2xpZW50SW5kZXgoKTtcblxuXHRcdC8qKlxuXHRcdCAqIENvb3JkaW5hdGVzIG9mIHRoZSBjbGllbnQgaW4gdGhlIHNwYWNlLCBzdG9yZWQgYXMgYW4gYFt4LCB5XWAgYXJyYXkuXG5cdFx0ICogQHR5cGUge051bWJlcltdfVxuXHRcdCAqL1xuICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBudWxsO1xuXG5cdFx0LyoqXG5cdFx0ICogVXNlZCBieSBhbnkge0BsaW5rIFNlcnZlck1vZHVsZX0gdG8gYXNzb2NpYXRlIGRhdGEgdG8gYSBwYXJ0aWN1bGFyIGNsaWVudC5cblx0XHQgKiBBbGwgdGhlIGRhdGEgYXNzb2NpYXRlZCB3aXRoIGEgbW9kdWxlIHdob3NlIGBuYW1lYCBpcyBgbW9kdWxlTmFtZWAgaXMgYWNjZXNzaWJsZSB0aHJvdWdoIHRoZSBrZXkgYG1vZHVsZU5hbWVgLlxuXHRcdCAqIEZvciBpbnN0YW5jZSwgdGhlIHtAbGluayBTZXJ2ZXJTeW5jfSBtb2R1bGUga2VlcHMgdHJhY2sgb2YgdGhlIHRpbWUgb2Zmc2V0IGJldHdlZW4gdGhlIGNsaWVudCBhbmQgdGhlIHN5bmMgY2xvY2tzIGluIGB0aGlzLm1vZHVsZXMuc3luYy50aW1lT2Zmc2V0YC5cblx0XHQgKiBTaW1pbGFybHksIGEge0BsaW5rIFNlcnZlclBlcmZvcm1hbmNlfSBtb2R1bGUgY291bGQga2VlcCB0cmFjayBvZiBlYWNoIGNsaWVudCdzIHN0YXR1cyBpbiBgdGhpcy5tb2R1bGVzLm15UGVyZm9ybWFuY2VOYW1lLnN0YXR1c2AuXG5cdFx0ICogQHR5cGUge09iamVjdH1cblx0XHQgKi9cbiAgICB0aGlzLm1vZHVsZXMgPSB7fTtcblxuXHRcdC8qKlxuXHRcdCAqIFNvY2tldCB1c2VkIHRvIGNvbW11bmljYXRlIHdpdGggdGhlIGNsaWVudC5cblx0XHQgKiBAdHlwZSB7U29ja2V0fVxuXHRcdCAqIEB0b2RvIG1ha2UgcHJpdmF0ZT9cblx0XHQgKi9cbiAgICAvLyB0aGlzLnNvY2tldCA9IHNvY2tldDtcbiAgICB0aGlzLnNvY2tldCA9IHNvY2tldDtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgX3JlbGVhc2VDbGllbnRJbmRleCh0aGlzLmluZGV4KTtcbiAgICB0aGlzLmluZGV4ID0gLTE7XG4gIH1cblxufVxuXG4iXX0=