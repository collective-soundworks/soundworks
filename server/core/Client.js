'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

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
    this.uuid = _uuid2['default'].v4();

    /**
     * Coordinates of the client, stored as an `[x:Number, y:Number]` array.
     * @type {Array<Number>}
     */
    this.coordinates = null;

    /**
     * Ticket index of the client.
     * @type {Number}
     */
    this.index = null;

    /**
     * Ticket label of the client.
     * @type {Number}
     */
    this.label = null;

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
     */
    this.socket = socket;
  }

  /**
   * Returns a lightweight version of the data defining the client.
   * @returns {Object}
   */

  _createClass(Client, [{
    key: 'serialize',
    value: function serialize() {
      return {
        type: this.type,
        uuid: this.uuid,
        coordinates: this.coordinates,
        index: this.index,
        label: this.label,
        modules: this.modules
      };
    }

    /**
     * Destroy the client.
     */
  }, {
    key: 'destroy',
    value: function destroy() {
      this.socket.removeAllListeners();
      this.uuid = null;
    }
  }]);

  return Client;
})();

exports['default'] = Client;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvY29yZS9DbGllbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O29CQUFpQixNQUFNOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFzQkYsTUFBTTs7Ozs7OztBQU1mLFdBTlMsTUFBTSxDQU1kLFVBQVUsRUFBRSxNQUFNLEVBQUU7MEJBTlosTUFBTTs7Ozs7O0FBV3ZCLFFBQUksQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDOzs7Ozs7QUFNdkIsUUFBSSxDQUFDLElBQUksR0FBRyxrQkFBSyxFQUFFLEVBQUUsQ0FBQzs7Ozs7O0FBTXRCLFFBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDOzs7Ozs7QUFNeEIsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7Ozs7OztBQU1sQixRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQzs7Ozs7Ozs7OztBQVVsQixRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQzs7Ozs7OztBQU9sQixRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztHQUN0Qjs7Ozs7OztlQXJEa0IsTUFBTTs7V0EyRGhCLHFCQUFHO0FBQ1YsYUFBTztBQUNMLFlBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtBQUNmLFlBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtBQUNmLG1CQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVc7QUFDN0IsYUFBSyxFQUFFLElBQUksQ0FBQyxLQUFLO0FBQ2pCLGFBQUssRUFBRSxJQUFJLENBQUMsS0FBSztBQUNqQixlQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87T0FDdEIsQ0FBQztLQUNIOzs7Ozs7O1dBS00sbUJBQUc7QUFDUixVQUFJLENBQUMsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUM7QUFDakMsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7S0FDbEI7OztTQTVFa0IsTUFBTTs7O3FCQUFOLE1BQU0iLCJmaWxlIjoic3JjL3NlcnZlci9jb3JlL0NsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB1dWlkIGZyb20gJ3V1aWQnO1xuXG5cbi8qKlxuICogQ2xpZW50IHRoYXQgY29ubmVjdHMgdG8gdGhlIHNlcnZlci5cbiAqXG4gKiBFYWNoIHRpbWUgYSBjbGllbnQgb2YgdHlwZSBgJ2NsaWVudFR5cGUnYCBjb25uZWN0cyB0byB0aGUgc2VydmVyLCAqU291bmR3b3JrcyogY3JlYXRlcyBhIG5ldyBpbnN0YW5jZSBvZiBgQ2xpZW50YC5cbiAqIEFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcyBpcyBwYXNzZWQgdG8gdGhlIGBjb25uZWN0YCBhbmQgYGRpc2Nvbm5lY3RgIG1ldGhvZHMgb2YgYWxsIHRoZSBzZXJ2ZXIgc2lkZSBtb2R1bGVzIHRoYXQgYXJlIG1hcHBlZCB0byB0aGUgYCdjbGllbnRUeXBlJ2AgY2xpZW50cyAoc2VlIHtAbGluayBzZXJ2ZXIjbWFwfSksIGFzIHdlbGwgYXMgdG8gdGhlIGBlbnRlcmAgYW5kIGBleGl0YCBtZXRob2RzIG9mIGFueSB7QGxpbmsgc3JjL3NlcnZlci9QZXJmb3JtYW5jZS5qc35QZXJmb3JtYW5jZX0gY2xhc3MgbWFwcGVkIHRvIHRoYXQgc2FtZSBjbGllbnQgdHlwZS5cbiAqXG4gKiBUaGUgY2xhc3MgaXMgYWxzbyB1c2VkIHRvIGNvbW11bmljYXRlIHdpdGggdGhlIGNsaWVudCB2aWEgV2ViU29ja2V0cy5cbiAqXG4gKiBAZXhhbXBsZSBjbGFzcyBNeVBlcmZvcm1hbmNlIGV4dGVuZHMgUGVyZm9ybWFuY2Uge1xuICogICAvLyAuLi5cbiAqXG4gKiAgIGVudGVyKGNsaWVudCkge1xuICogICAgIGNvbnN0IG1zZyA9IFwiV2VsY29tZSB0byB0aGUgcGVyZm9ybWFuY2UhXCI7XG4gKiAgICAgY2xpZW50LnNlbmQoJ2luaXQnLCBtc2cpO1xuICogICB9XG4gKlxuICogICAvLyAuLi5cbiAqIH1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50IHtcblx0LyoqXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBjbGllbnRUeXBlIENsaWVudCB0eXBlIG9mIHRoZSBjb25uZWN0ZWQgY2xpZW50LlxuXHQgKiBAcGFyYW0ge1NvY2tldH0gc29ja2V0IFNvY2tldCBvYmplY3QgdXNlZCB0byBjb21taW51YXRlIHdpdGggdGhlIGNsaWVudC5cblx0ICogQHByaXZhdGVcblx0ICovXG5cdGNvbnN0cnVjdG9yKGNsaWVudFR5cGUsIHNvY2tldCkge1xuXHRcdC8qKlxuXHRcdCAqIENsaWVudCB0eXBlIChzcGVjaWZpZWQgd2hlbiBpbml0aWFsaXppbmcgdGhlIHtAbGluayBjbGllbnR9IG9iamVjdCBvbiB0aGUgY2xpZW50IHNpZGUgd2l0aCB7QGxpbmsgY2xpZW50LmluaXR9KS5cblx0XHQgKiBAdHlwZSB7U3RyaW5nfVxuXHRcdCAqL1xuICAgIHRoaXMudHlwZSA9IGNsaWVudFR5cGU7XG5cblx0XHQvKipcblx0XHQgKiBJbmRleCBvZiB0aGUgY2xpZW50LlxuXHRcdCAqIEB0eXBlIHtOdW1iZXJ9XG5cdFx0ICovXG4gICAgdGhpcy51dWlkID0gdXVpZC52NCgpO1xuXG5cdFx0LyoqXG5cdFx0ICogQ29vcmRpbmF0ZXMgb2YgdGhlIGNsaWVudCwgc3RvcmVkIGFzIGFuIGBbeDpOdW1iZXIsIHk6TnVtYmVyXWAgYXJyYXkuXG5cdFx0ICogQHR5cGUge0FycmF5PE51bWJlcj59XG5cdFx0ICovXG4gICAgdGhpcy5jb29yZGluYXRlcyA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBUaWNrZXQgaW5kZXggb2YgdGhlIGNsaWVudC5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuaW5kZXggPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogVGlja2V0IGxhYmVsIG9mIHRoZSBjbGllbnQuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmxhYmVsID0gbnVsbDtcblxuXHRcdC8qKlxuXHRcdCAqIFVzZWQgYnkgYW55IHtAbGluayBzcmMvc2VydmVyL1NlcnZlck1vZHVsZS5qc35TZXJ2ZXJNb2R1bGV9IHRvIGFzc29jaWF0ZSBkYXRhIHRvIGEgcGFydGljdWxhciBjbGllbnQuXG5cdFx0ICpcblx0XHQgKiBBbGwgdGhlIGRhdGEgYXNzb2NpYXRlZCB3aXRoIGEgbW9kdWxlIHdob3NlIGBuYW1lYCBpcyBgJ21vZHVsZU5hbWUnYCBpcyBhY2Nlc3NpYmxlIHRocm91Z2ggdGhlIGtleSBgbW9kdWxlTmFtZWAuXG5cdFx0ICogRm9yIGluc3RhbmNlLCB0aGUge0BsaW5rIHNyYy9zZXJ2ZXIvQ2hlY2tpbi5qc35DaGVja2lufSBtb2R1bGUga2VlcHMgdHJhY2sgb2YgY2xpZW50J3MgY2hlY2tpbiBpbmRleCBhbmQgbGFiZWwgaW4gYHRoaXMubW9kdWxlcy5jaGVja2luLmluZGV4YCBhbmQgYHRoaXMubW9kdWxlcy5jaGVja2luLmxhYmVsYC5cblx0XHQgKiBTaW1pbGFybHksIGEge0BsaW5rIHNyYy9zZXJ2ZXIvUGVyZm9ybWFuY2UuanN+UGVyZm9ybWFuY2V9IG1vZHVsZSB3aG9zZSBuYW1lIGlzIGAnbXlQZXJmb3JtYW5jZSdgIGNvdWxkIHJlcG9ydCB0aGUgY2xpZW50J3Mgc3RhdHVzIGluIGB0aGlzLm1vZHVsZXMubXlQZXJmb3JtYW5jZS5zdGF0dXNgLlxuXHRcdCAqIEB0eXBlIHtPYmplY3R9XG5cdFx0ICovXG4gICAgdGhpcy5tb2R1bGVzID0ge307XG5cblx0XHQvKipcblx0XHQgKiBTb2NrZXQgdXNlZCB0byBjb21tdW5pY2F0ZSB3aXRoIHRoZSBjbGllbnQuXG5cdFx0ICogQHR5cGUge1NvY2tldH1cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuICAgIHRoaXMuc29ja2V0ID0gc29ja2V0O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBsaWdodHdlaWdodCB2ZXJzaW9uIG9mIHRoZSBkYXRhIGRlZmluaW5nIHRoZSBjbGllbnQuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9XG4gICAqL1xuICBzZXJpYWxpemUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6IHRoaXMudHlwZSxcbiAgICAgIHV1aWQ6IHRoaXMudXVpZCxcbiAgICAgIGNvb3JkaW5hdGVzOiB0aGlzLmNvb3JkaW5hdGVzLFxuICAgICAgaW5kZXg6IHRoaXMuaW5kZXgsXG4gICAgICBsYWJlbDogdGhpcy5sYWJlbCxcbiAgICAgIG1vZHVsZXM6IHRoaXMubW9kdWxlcyxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIERlc3Ryb3kgdGhlIGNsaWVudC5cbiAgICovXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5zb2NrZXQucmVtb3ZlQWxsTGlzdGVuZXJzKCk7XG4gICAgdGhpcy51dWlkID0gbnVsbDtcbiAgfVxufVxuIl19