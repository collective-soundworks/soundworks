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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvQ2xpZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztzQkFBZ0IsVUFBVTs7OztBQUUxQixJQUFJLGVBQWUsR0FBRyxDQUFDLENBQUM7QUFDeEIsSUFBTSxzQkFBc0IsR0FBRyxFQUFFLENBQUM7O0FBRWxDLFNBQVMsZUFBZSxHQUFHO0FBQ3pCLE1BQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDOztBQUVmLE1BQUksc0JBQXNCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtBQUNyQywwQkFBc0IsQ0FBQyxJQUFJLENBQUMsVUFBUyxDQUFDLEVBQUUsQ0FBQyxFQUFFO0FBQ3pDLGFBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNkLENBQUMsQ0FBQzs7QUFFSCxTQUFLLEdBQUcsc0JBQXNCLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztHQUNoRCxNQUFNO0FBQ0wsU0FBSyxHQUFHLGVBQWUsRUFBRSxDQUFDO0dBQzNCOztBQUVELFNBQU8sS0FBSyxDQUFDO0NBQ2Q7O0FBRUQsU0FBUyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUU7QUFDbEMsd0JBQXNCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0NBQ3BDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBcUJvQixNQUFNOzs7Ozs7O0FBTWYsV0FOUyxNQUFNLENBTWQsVUFBVSxFQUFFLE1BQU0sRUFBRTswQkFOWixNQUFNOzs7Ozs7QUFXdkIsUUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7Ozs7OztBQU12QixRQUFJLENBQUMsS0FBSyxHQUFHLGVBQWUsRUFBRSxDQUFDOzs7Ozs7QUFNL0IsUUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7Ozs7Ozs7Ozs7QUFVeEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7Ozs7Ozs7OztBQVNsQixRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztHQUN0Qjs7Ozs7O2VBM0NrQixNQUFNOztXQWdEbEIsbUJBQUc7QUFDUix5QkFBbUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDaEMsVUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztLQUNqQjs7O1NBbkRrQixNQUFNOzs7cUJBQU4sTUFBTSIsImZpbGUiOiJzcmMvc2VydmVyL0NsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBsb2cgZnJvbSAnLi9sb2dnZXInO1xuXG5sZXQgbmV4dENsaWVudEluZGV4ID0gMDtcbmNvbnN0IGF2YWlsYWJsZUNsaWVudEluZGljZXMgPSBbXTtcblxuZnVuY3Rpb24gX2dldENsaWVudEluZGV4KCkge1xuICB2YXIgaW5kZXggPSAtMTtcblxuICBpZiAoYXZhaWxhYmxlQ2xpZW50SW5kaWNlcy5sZW5ndGggPiAwKSB7XG4gICAgYXZhaWxhYmxlQ2xpZW50SW5kaWNlcy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgIHJldHVybiBhIC0gYjtcbiAgICB9KTtcblxuICAgIGluZGV4ID0gYXZhaWxhYmxlQ2xpZW50SW5kaWNlcy5zcGxpY2UoMCwgMSlbMF07XG4gIH0gZWxzZSB7XG4gICAgaW5kZXggPSBuZXh0Q2xpZW50SW5kZXgrKztcbiAgfVxuXG4gIHJldHVybiBpbmRleDtcbn1cblxuZnVuY3Rpb24gX3JlbGVhc2VDbGllbnRJbmRleChpbmRleCkge1xuICBhdmFpbGFibGVDbGllbnRJbmRpY2VzLnB1c2goaW5kZXgpO1xufVxuXG4vKipcbiAqIFtzZXJ2ZXJdIENsaWVudCB3aG8gY29ubmVjdHMgdG8gdGhlIHNlcnZlci5cbiAqXG4gKiBFYWNoIHRpbWUgYSBjbGllbnQgb2YgdHlwZSBgJ2NsaWVudFR5cGUnYCBjb25uZWN0cyB0byB0aGUgc2VydmVyLCAqU291bmR3b3JrcyogY3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiBgQ2xpZW50YC5cbiAqIEFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcyBpcyBwYXNzZWQgdG8gdGhlIGBjb25uZWN0YCBhbmQgYGRpc2Nvbm5lY3RgIG1ldGhvZHMgb2YgYWxsIHRoZSBzZXJ2ZXIgc2lkZSBtb2R1bGVzIHRoYXQgYXJlIG1hcHBlZCB0byB0aGUgYCdjbGllbnRUeXBlJ2AgY2xpZW50cyAoc2VlIHtAbGluayBzZXJ2ZXIjbWFwfSksIGFzIHdlbGwgYXMgdG8gdGhlIGBlbnRlcmAgYW5kIGBleGl0YCBtZXRob2RzIG9mIGFueSB7QGxpbmsgc3JjL3NlcnZlci9QZXJmb3JtYW5jZS5qc35QZXJmb3JtYW5jZX0gY2xhc3MgbWFwcGVkIHRvIHRoYXQgc2FtZSBjbGllbnQgdHlwZS5cbiAqXG4gKiBUaGUgY2xhc3MgaXMgYWxzbyB1c2VkIHRvIGNvbW11bmljYXRlIHdpdGggdGhlIGNsaWVudCB2aWEgV2ViU29ja2V0cy5cbiAqXG4gKiBAZXhhbXBsZSBjbGFzcyBNeVBlcmZvcm1hbmNlIGV4dGVuZHMgUGVyZm9ybWFuY2Uge1xuICogICAvLyAuLi5cbiAqXG4gKiAgIGVudGVyKGNsaWVudCkge1xuICogICAgIGNvbnN0IG1zZyA9IFwiV2VsY29tZSB0byB0aGUgcGVyZm9ybWFuY2UhXCI7XG4gKiAgICAgY2xpZW50LnNlbmQoJ2luaXQnLCBtc2cpO1xuICogICB9XG4gKlxuICogICAvLyAuLi5cbiAqIH1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50IHtcblx0LyoqXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBjbGllbnRUeXBlIENsaWVudCB0eXBlIG9mIHRoZSBjb25uZWN0ZWQgY2xpZW50LlxuXHQgKiBAcGFyYW0ge1NvY2tldH0gc29ja2V0IFNvY2tldCBvYmplY3QgdXNlZCB0byBjb21taW51YXRlIHdpdGggdGhlIGNsaWVudC5cblx0ICogQHByaXZhdGVcblx0ICovXG5cdGNvbnN0cnVjdG9yKGNsaWVudFR5cGUsIHNvY2tldCkge1xuXHRcdC8qKlxuXHRcdCAqIENsaWVudCB0eXBlIChzcGVjaWZpZWQgd2hlbiBpbml0aWFsaXppbmcgdGhlIHtAbGluayBjbGllbnR9IG9iamVjdCBvbiB0aGUgY2xpZW50IHNpZGUgd2l0aCB7QGxpbmsgY2xpZW50LmluaXR9KS5cblx0XHQgKiBAdHlwZSB7U3RyaW5nfVxuXHRcdCAqL1xuICAgIHRoaXMudHlwZSA9IGNsaWVudFR5cGU7XG5cblx0XHQvKipcblx0XHQgKiBJbmRleCBvZiB0aGUgY2xpZW50LlxuXHRcdCAqIEB0eXBlIHtOdW1iZXJ9XG5cdFx0ICovXG4gICAgdGhpcy5pbmRleCA9IF9nZXRDbGllbnRJbmRleCgpO1xuXG5cdFx0LyoqXG5cdFx0ICogQ29vcmRpbmF0ZXMgb2YgdGhlIGNsaWVudCwgc3RvcmVkIGFzIGFuIGBbeDpOdW1iZXIsIHk6TnVtYmVyXWAgYXJyYXkuXG5cdFx0ICogQHR5cGUge051bWJlcltdfVxuXHRcdCAqL1xuICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBudWxsO1xuXG5cdFx0LyoqXG5cdFx0ICogVXNlZCBieSBhbnkge0BsaW5rIHNyYy9zZXJ2ZXIvU2VydmVyTW9kdWxlLmpzflNlcnZlck1vZHVsZX0gdG8gYXNzb2NpYXRlIGRhdGEgdG8gYSBwYXJ0aWN1bGFyIGNsaWVudC5cblx0XHQgKlxuXHRcdCAqIEFsbCB0aGUgZGF0YSBhc3NvY2lhdGVkIHdpdGggYSBtb2R1bGUgd2hvc2UgYG5hbWVgIGlzIGAnbW9kdWxlTmFtZSdgIGlzIGFjY2Vzc2libGUgdGhyb3VnaCB0aGUga2V5IGBtb2R1bGVOYW1lYC5cblx0XHQgKiBGb3IgaW5zdGFuY2UsIHRoZSB7QGxpbmsgc3JjL3NlcnZlci9DaGVja2luLmpzfkNoZWNraW59IG1vZHVsZSBrZWVwcyB0cmFjayBvZiBjbGllbnQncyBjaGVja2luIGluZGV4IGFuZCBsYWJlbCBpbiBgdGhpcy5tb2R1bGVzLmNoZWNraW4uaW5kZXhgIGFuZCBgdGhpcy5tb2R1bGVzLmNoZWNraW4ubGFiZWxgLlxuXHRcdCAqIFNpbWlsYXJseSwgYSB7QGxpbmsgc3JjL3NlcnZlci9QZXJmb3JtYW5jZS5qc35QZXJmb3JtYW5jZX0gbW9kdWxlIHdob3NlIG5hbWUgaXMgYCdteVBlcmZvcm1hbmNlJ2AgY291bGQgcmVwb3J0IHRoZSBjbGllbnQncyBzdGF0dXMgaW4gYHRoaXMubW9kdWxlcy5teVBlcmZvcm1hbmNlLnN0YXR1c2AuXG5cdFx0ICogQHR5cGUge09iamVjdH1cblx0XHQgKi9cbiAgICB0aGlzLm1vZHVsZXMgPSB7fTtcblxuXHRcdC8qKlxuXHRcdCAqIFNvY2tldCB1c2VkIHRvIGNvbW11bmljYXRlIHdpdGggdGhlIGNsaWVudC5cblx0XHQgKiBAdHlwZSB7U29ja2V0fVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICogQHRvZG8gLnNvY2tldCAtPiAuX3NvY2tldCAobWF5YmU/KVxuXHRcdCAqL1xuICAgIC8vIHRoaXMuc29ja2V0ID0gc29ja2V0O1xuICAgIHRoaXMuc29ja2V0ID0gc29ja2V0O1xuICB9XG5cbiAgLyoqXG4gICAqIERlc3Ryb3kgdGhlIGNsaWVudC5cbiAgICovXG4gIGRlc3Ryb3koKSB7XG4gICAgX3JlbGVhc2VDbGllbnRJbmRleCh0aGlzLmluZGV4KTtcbiAgICB0aGlzLmluZGV4ID0gLTE7XG4gIH1cbn1cbiJdfQ==