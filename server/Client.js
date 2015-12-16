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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvQ2xpZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztzQkFBZ0IsVUFBVTs7OztBQUUxQixJQUFJLGVBQWUsR0FBRyxDQUFDLENBQUM7QUFDeEIsSUFBTSxzQkFBc0IsR0FBRyxFQUFFLENBQUM7O0FBRWxDLFNBQVMsZUFBZSxHQUFHO0FBQ3pCLE1BQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDOztBQUVmLE1BQUksc0JBQXNCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUNyQywwQkFBc0IsQ0FBQyxJQUFJLENBQUMsVUFBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3pDLGFBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNkLENBQUMsQ0FBQzs7QUFFSCxTQUFLLEdBQUcsc0JBQXNCLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztHQUNoRCxNQUFNO0FBQ0wsU0FBSyxHQUFHLGVBQWUsRUFBRSxDQUFDO0dBQzNCOztBQUVELFNBQU8sS0FBSyxDQUFDO0NBQ2Q7O0FBRUQsU0FBUyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUU7QUFDbEMsd0JBQXNCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0NBQ3BDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBcUJvQixNQUFNOzs7Ozs7O0FBTWYsV0FOUyxNQUFNLENBTWQsVUFBVSxFQUFFLE1BQU0sRUFBRTswQkFOWixNQUFNOzs7Ozs7QUFXdkIsUUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7Ozs7OztBQU12QixRQUFJLENBQUMsS0FBSyxHQUFHLGVBQWUsRUFBRSxDQUFDOzs7Ozs7QUFNL0IsUUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7Ozs7Ozs7Ozs7QUFVeEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7Ozs7Ozs7OztBQVNsQixRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztHQUN0Qjs7Ozs7O2VBM0NrQixNQUFNOztXQWdEbEIsbUJBQUc7QUFDUix5QkFBbUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDaEMsVUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztLQUNqQjs7O1NBbkRrQixNQUFNOzs7cUJBQU4sTUFBTSIsImZpbGUiOiJzcmMvc2VydmVyL0NsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBsb2cgZnJvbSAnLi9sb2dnZXInO1xuXG5sZXQgbmV4dENsaWVudEluZGV4ID0gMDtcbmNvbnN0IGF2YWlsYWJsZUNsaWVudEluZGljZXMgPSBbXTtcblxuZnVuY3Rpb24gX2dldENsaWVudEluZGV4KCkge1xuICB2YXIgaW5kZXggPSAtMTtcblxuICBpZiAoYXZhaWxhYmxlQ2xpZW50SW5kaWNlcy5sZW5ndGggPiAwKSB7XG4gICAgYXZhaWxhYmxlQ2xpZW50SW5kaWNlcy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgIHJldHVybiBhIC0gYjtcbiAgICB9KTtcblxuICAgIGluZGV4ID0gYXZhaWxhYmxlQ2xpZW50SW5kaWNlcy5zcGxpY2UoMCwgMSlbMF07XG4gIH0gZWxzZSB7XG4gICAgaW5kZXggPSBuZXh0Q2xpZW50SW5kZXgrKztcbiAgfVxuXG4gIHJldHVybiBpbmRleDtcbn1cblxuZnVuY3Rpb24gX3JlbGVhc2VDbGllbnRJbmRleChpbmRleCkge1xuICBhdmFpbGFibGVDbGllbnRJbmRpY2VzLnB1c2goaW5kZXgpO1xufVxuXG4vKipcbiAqIENsaWVudCB0aGF0IGNvbm5lY3RzIHRvIHRoZSBzZXJ2ZXIuXG4gKlxuICogRWFjaCB0aW1lIGEgY2xpZW50IG9mIHR5cGUgYCdjbGllbnRUeXBlJ2AgY29ubmVjdHMgdG8gdGhlIHNlcnZlciwgKlNvdW5kd29ya3MqIGNyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgYENsaWVudGAuXG4gKiBBbiBpbnN0YW5jZSBvZiB0aGUgY2xhc3MgaXMgcGFzc2VkIHRvIHRoZSBgY29ubmVjdGAgYW5kIGBkaXNjb25uZWN0YCBtZXRob2RzIG9mIGFsbCB0aGUgc2VydmVyIHNpZGUgbW9kdWxlcyB0aGF0IGFyZSBtYXBwZWQgdG8gdGhlIGAnY2xpZW50VHlwZSdgIGNsaWVudHMgKHNlZSB7QGxpbmsgc2VydmVyI21hcH0pLCBhcyB3ZWxsIGFzIHRvIHRoZSBgZW50ZXJgIGFuZCBgZXhpdGAgbWV0aG9kcyBvZiBhbnkge0BsaW5rIHNyYy9zZXJ2ZXIvUGVyZm9ybWFuY2UuanN+UGVyZm9ybWFuY2V9IGNsYXNzIG1hcHBlZCB0byB0aGF0IHNhbWUgY2xpZW50IHR5cGUuXG4gKlxuICogVGhlIGNsYXNzIGlzIGFsc28gdXNlZCB0byBjb21tdW5pY2F0ZSB3aXRoIHRoZSBjbGllbnQgdmlhIFdlYlNvY2tldHMuXG4gKlxuICogQGV4YW1wbGUgY2xhc3MgTXlQZXJmb3JtYW5jZSBleHRlbmRzIFBlcmZvcm1hbmNlIHtcbiAqICAgLy8gLi4uXG4gKlxuICogICBlbnRlcihjbGllbnQpIHtcbiAqICAgICBjb25zdCBtc2cgPSBcIldlbGNvbWUgdG8gdGhlIHBlcmZvcm1hbmNlIVwiO1xuICogICAgIGNsaWVudC5zZW5kKCdpbml0JywgbXNnKTtcbiAqICAgfVxuICpcbiAqICAgLy8gLi4uXG4gKiB9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudCB7XG5cdC8qKlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gY2xpZW50VHlwZSBDbGllbnQgdHlwZSBvZiB0aGUgY29ubmVjdGVkIGNsaWVudC5cblx0ICogQHBhcmFtIHtTb2NrZXR9IHNvY2tldCBTb2NrZXQgb2JqZWN0IHVzZWQgdG8gY29tbWludWF0ZSB3aXRoIHRoZSBjbGllbnQuXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcihjbGllbnRUeXBlLCBzb2NrZXQpIHtcblx0XHQvKipcblx0XHQgKiBDbGllbnQgdHlwZSAoc3BlY2lmaWVkIHdoZW4gaW5pdGlhbGl6aW5nIHRoZSB7QGxpbmsgY2xpZW50fSBvYmplY3Qgb24gdGhlIGNsaWVudCBzaWRlIHdpdGgge0BsaW5rIGNsaWVudC5pbml0fSkuXG5cdFx0ICogQHR5cGUge1N0cmluZ31cblx0XHQgKi9cbiAgICB0aGlzLnR5cGUgPSBjbGllbnRUeXBlO1xuXG5cdFx0LyoqXG5cdFx0ICogSW5kZXggb2YgdGhlIGNsaWVudC5cblx0XHQgKiBAdHlwZSB7TnVtYmVyfVxuXHRcdCAqL1xuICAgIHRoaXMuaW5kZXggPSBfZ2V0Q2xpZW50SW5kZXgoKTtcblxuXHRcdC8qKlxuXHRcdCAqIENvb3JkaW5hdGVzIG9mIHRoZSBjbGllbnQsIHN0b3JlZCBhcyBhbiBgW3g6TnVtYmVyLCB5Ok51bWJlcl1gIGFycmF5LlxuXHRcdCAqIEB0eXBlIHtOdW1iZXJbXX1cblx0XHQgKi9cbiAgICB0aGlzLmNvb3JkaW5hdGVzID0gbnVsbDtcblxuXHRcdC8qKlxuXHRcdCAqIFVzZWQgYnkgYW55IHtAbGluayBzcmMvc2VydmVyL1NlcnZlck1vZHVsZS5qc35TZXJ2ZXJNb2R1bGV9IHRvIGFzc29jaWF0ZSBkYXRhIHRvIGEgcGFydGljdWxhciBjbGllbnQuXG5cdFx0ICpcblx0XHQgKiBBbGwgdGhlIGRhdGEgYXNzb2NpYXRlZCB3aXRoIGEgbW9kdWxlIHdob3NlIGBuYW1lYCBpcyBgJ21vZHVsZU5hbWUnYCBpcyBhY2Nlc3NpYmxlIHRocm91Z2ggdGhlIGtleSBgbW9kdWxlTmFtZWAuXG5cdFx0ICogRm9yIGluc3RhbmNlLCB0aGUge0BsaW5rIHNyYy9zZXJ2ZXIvQ2hlY2tpbi5qc35DaGVja2lufSBtb2R1bGUga2VlcHMgdHJhY2sgb2YgY2xpZW50J3MgY2hlY2tpbiBpbmRleCBhbmQgbGFiZWwgaW4gYHRoaXMubW9kdWxlcy5jaGVja2luLmluZGV4YCBhbmQgYHRoaXMubW9kdWxlcy5jaGVja2luLmxhYmVsYC5cblx0XHQgKiBTaW1pbGFybHksIGEge0BsaW5rIHNyYy9zZXJ2ZXIvUGVyZm9ybWFuY2UuanN+UGVyZm9ybWFuY2V9IG1vZHVsZSB3aG9zZSBuYW1lIGlzIGAnbXlQZXJmb3JtYW5jZSdgIGNvdWxkIHJlcG9ydCB0aGUgY2xpZW50J3Mgc3RhdHVzIGluIGB0aGlzLm1vZHVsZXMubXlQZXJmb3JtYW5jZS5zdGF0dXNgLlxuXHRcdCAqIEB0eXBlIHtPYmplY3R9XG5cdFx0ICovXG4gICAgdGhpcy5tb2R1bGVzID0ge307XG5cblx0XHQvKipcblx0XHQgKiBTb2NrZXQgdXNlZCB0byBjb21tdW5pY2F0ZSB3aXRoIHRoZSBjbGllbnQuXG5cdFx0ICogQHR5cGUge1NvY2tldH1cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqIEB0b2RvIC5zb2NrZXQgLT4gLl9zb2NrZXQgKG1heWJlPylcblx0XHQgKi9cbiAgICAvLyB0aGlzLnNvY2tldCA9IHNvY2tldDtcbiAgICB0aGlzLnNvY2tldCA9IHNvY2tldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95IHRoZSBjbGllbnQuXG4gICAqL1xuICBkZXN0cm95KCkge1xuICAgIF9yZWxlYXNlQ2xpZW50SW5kZXgodGhpcy5pbmRleCk7XG4gICAgdGhpcy5pbmRleCA9IC0xO1xuICB9XG59XG4iXX0=