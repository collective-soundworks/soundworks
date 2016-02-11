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
    key: "serialize",
    value: function serialize() {
      return {
        type: this.type,
        uid: this.uid,
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
    key: "destroy",
    value: function destroy() {
      this.uid = -1;
    }
  }]);

  return Client;
})();

exports["default"] = Client;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvY29yZS9DbGllbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFFQSxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUM7QUFDakIsU0FBUyxPQUFPLEdBQUc7QUFBRSxTQUFPLFFBQVEsRUFBRSxDQUFDO0NBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFxQnBCLE1BQU07Ozs7Ozs7QUFNZixXQU5TLE1BQU0sQ0FNZCxVQUFVLEVBQUUsTUFBTSxFQUFFOzBCQU5aLE1BQU07Ozs7OztBQVd2QixRQUFJLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQzs7Ozs7O0FBTXZCLFFBQUksQ0FBQyxHQUFHLEdBQUcsT0FBTyxFQUFFLENBQUM7Ozs7OztBQU1yQixRQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQzs7Ozs7O0FBTXhCLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDOzs7Ozs7QUFNbEIsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7Ozs7Ozs7Ozs7QUFVbEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7Ozs7Ozs7QUFPbEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7R0FDdEI7Ozs7Ozs7ZUFyRGtCLE1BQU07O1dBMkRoQixxQkFBRztBQUNWLGFBQU87QUFDTCxZQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7QUFDZixXQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7QUFDYixtQkFBVyxFQUFFLElBQUksQ0FBQyxXQUFXO0FBQzdCLGFBQUssRUFBRSxJQUFJLENBQUMsS0FBSztBQUNqQixhQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7QUFDakIsZUFBTyxFQUFFLElBQUksQ0FBQyxPQUFPO09BQ3RCLENBQUM7S0FDSDs7Ozs7OztXQUtNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztLQUNmOzs7U0EzRWtCLE1BQU07OztxQkFBTixNQUFNIiwiZmlsZSI6InNyYy9zZXJ2ZXIvY29yZS9DbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgbG9nZ2VyIGZyb20gJy4uL3V0aWxzL2xvZ2dlcic7XG5cbmxldCBfY291bnRlciA9IDA7XG5mdW5jdGlvbiBfZ2V0VUlEKCkgeyByZXR1cm4gX2NvdW50ZXIrKzsgfVxuXG4vKipcbiAqIENsaWVudCB0aGF0IGNvbm5lY3RzIHRvIHRoZSBzZXJ2ZXIuXG4gKlxuICogRWFjaCB0aW1lIGEgY2xpZW50IG9mIHR5cGUgYCdjbGllbnRUeXBlJ2AgY29ubmVjdHMgdG8gdGhlIHNlcnZlciwgKlNvdW5kd29ya3MqIGNyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgYENsaWVudGAuXG4gKiBBbiBpbnN0YW5jZSBvZiB0aGUgY2xhc3MgaXMgcGFzc2VkIHRvIHRoZSBgY29ubmVjdGAgYW5kIGBkaXNjb25uZWN0YCBtZXRob2RzIG9mIGFsbCB0aGUgc2VydmVyIHNpZGUgbW9kdWxlcyB0aGF0IGFyZSBtYXBwZWQgdG8gdGhlIGAnY2xpZW50VHlwZSdgIGNsaWVudHMgKHNlZSB7QGxpbmsgc2VydmVyI21hcH0pLCBhcyB3ZWxsIGFzIHRvIHRoZSBgZW50ZXJgIGFuZCBgZXhpdGAgbWV0aG9kcyBvZiBhbnkge0BsaW5rIHNyYy9zZXJ2ZXIvUGVyZm9ybWFuY2UuanN+UGVyZm9ybWFuY2V9IGNsYXNzIG1hcHBlZCB0byB0aGF0IHNhbWUgY2xpZW50IHR5cGUuXG4gKlxuICogVGhlIGNsYXNzIGlzIGFsc28gdXNlZCB0byBjb21tdW5pY2F0ZSB3aXRoIHRoZSBjbGllbnQgdmlhIFdlYlNvY2tldHMuXG4gKlxuICogQGV4YW1wbGUgY2xhc3MgTXlQZXJmb3JtYW5jZSBleHRlbmRzIFBlcmZvcm1hbmNlIHtcbiAqICAgLy8gLi4uXG4gKlxuICogICBlbnRlcihjbGllbnQpIHtcbiAqICAgICBjb25zdCBtc2cgPSBcIldlbGNvbWUgdG8gdGhlIHBlcmZvcm1hbmNlIVwiO1xuICogICAgIGNsaWVudC5zZW5kKCdpbml0JywgbXNnKTtcbiAqICAgfVxuICpcbiAqICAgLy8gLi4uXG4gKiB9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudCB7XG5cdC8qKlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gY2xpZW50VHlwZSBDbGllbnQgdHlwZSBvZiB0aGUgY29ubmVjdGVkIGNsaWVudC5cblx0ICogQHBhcmFtIHtTb2NrZXR9IHNvY2tldCBTb2NrZXQgb2JqZWN0IHVzZWQgdG8gY29tbWludWF0ZSB3aXRoIHRoZSBjbGllbnQuXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcihjbGllbnRUeXBlLCBzb2NrZXQpIHtcblx0XHQvKipcblx0XHQgKiBDbGllbnQgdHlwZSAoc3BlY2lmaWVkIHdoZW4gaW5pdGlhbGl6aW5nIHRoZSB7QGxpbmsgY2xpZW50fSBvYmplY3Qgb24gdGhlIGNsaWVudCBzaWRlIHdpdGgge0BsaW5rIGNsaWVudC5pbml0fSkuXG5cdFx0ICogQHR5cGUge1N0cmluZ31cblx0XHQgKi9cbiAgICB0aGlzLnR5cGUgPSBjbGllbnRUeXBlO1xuXG5cdFx0LyoqXG5cdFx0ICogSW5kZXggb2YgdGhlIGNsaWVudC5cblx0XHQgKiBAdHlwZSB7TnVtYmVyfVxuXHRcdCAqL1xuICAgIHRoaXMudWlkID0gX2dldFVJRCgpO1xuXG5cdFx0LyoqXG5cdFx0ICogQ29vcmRpbmF0ZXMgb2YgdGhlIGNsaWVudCwgc3RvcmVkIGFzIGFuIGBbeDpOdW1iZXIsIHk6TnVtYmVyXWAgYXJyYXkuXG5cdFx0ICogQHR5cGUge0FycmF5PE51bWJlcj59XG5cdFx0ICovXG4gICAgdGhpcy5jb29yZGluYXRlcyA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBUaWNrZXQgaW5kZXggb2YgdGhlIGNsaWVudC5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuaW5kZXggPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogVGlja2V0IGxhYmVsIG9mIHRoZSBjbGllbnQuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmxhYmVsID0gbnVsbDtcblxuXHRcdC8qKlxuXHRcdCAqIFVzZWQgYnkgYW55IHtAbGluayBzcmMvc2VydmVyL1NlcnZlck1vZHVsZS5qc35TZXJ2ZXJNb2R1bGV9IHRvIGFzc29jaWF0ZSBkYXRhIHRvIGEgcGFydGljdWxhciBjbGllbnQuXG5cdFx0ICpcblx0XHQgKiBBbGwgdGhlIGRhdGEgYXNzb2NpYXRlZCB3aXRoIGEgbW9kdWxlIHdob3NlIGBuYW1lYCBpcyBgJ21vZHVsZU5hbWUnYCBpcyBhY2Nlc3NpYmxlIHRocm91Z2ggdGhlIGtleSBgbW9kdWxlTmFtZWAuXG5cdFx0ICogRm9yIGluc3RhbmNlLCB0aGUge0BsaW5rIHNyYy9zZXJ2ZXIvQ2hlY2tpbi5qc35DaGVja2lufSBtb2R1bGUga2VlcHMgdHJhY2sgb2YgY2xpZW50J3MgY2hlY2tpbiBpbmRleCBhbmQgbGFiZWwgaW4gYHRoaXMubW9kdWxlcy5jaGVja2luLmluZGV4YCBhbmQgYHRoaXMubW9kdWxlcy5jaGVja2luLmxhYmVsYC5cblx0XHQgKiBTaW1pbGFybHksIGEge0BsaW5rIHNyYy9zZXJ2ZXIvUGVyZm9ybWFuY2UuanN+UGVyZm9ybWFuY2V9IG1vZHVsZSB3aG9zZSBuYW1lIGlzIGAnbXlQZXJmb3JtYW5jZSdgIGNvdWxkIHJlcG9ydCB0aGUgY2xpZW50J3Mgc3RhdHVzIGluIGB0aGlzLm1vZHVsZXMubXlQZXJmb3JtYW5jZS5zdGF0dXNgLlxuXHRcdCAqIEB0eXBlIHtPYmplY3R9XG5cdFx0ICovXG4gICAgdGhpcy5tb2R1bGVzID0ge307XG5cblx0XHQvKipcblx0XHQgKiBTb2NrZXQgdXNlZCB0byBjb21tdW5pY2F0ZSB3aXRoIHRoZSBjbGllbnQuXG5cdFx0ICogQHR5cGUge1NvY2tldH1cblx0XHQgKiBAcHJpdmF0ZVxuXHRcdCAqL1xuICAgIHRoaXMuc29ja2V0ID0gc29ja2V0O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBsaWdodHdlaWdodCB2ZXJzaW9uIG9mIHRoZSBkYXRhIGRlZmluaW5nIHRoZSBjbGllbnQuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9XG4gICAqL1xuICBzZXJpYWxpemUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6IHRoaXMudHlwZSxcbiAgICAgIHVpZDogdGhpcy51aWQsXG4gICAgICBjb29yZGluYXRlczogdGhpcy5jb29yZGluYXRlcyxcbiAgICAgIGluZGV4OiB0aGlzLmluZGV4LFxuICAgICAgbGFiZWw6IHRoaXMubGFiZWwsXG4gICAgICBtb2R1bGVzOiB0aGlzLm1vZHVsZXMsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95IHRoZSBjbGllbnQuXG4gICAqL1xuICBkZXN0cm95KCkge1xuICAgIHRoaXMudWlkID0gLTE7XG4gIH1cbn1cbiJdfQ==