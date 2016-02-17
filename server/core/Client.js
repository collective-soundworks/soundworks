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
      this.socket.removeAllListeners();
      this.uid = -1;
    }
  }]);

  return Client;
})();

exports["default"] = Client;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvY29yZS9DbGllbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFFQSxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUM7QUFDakIsU0FBUyxPQUFPLEdBQUc7QUFBRSxTQUFPLFFBQVEsRUFBRSxDQUFDO0NBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFxQnBCLE1BQU07Ozs7Ozs7QUFNZixXQU5TLE1BQU0sQ0FNZCxVQUFVLEVBQUUsTUFBTSxFQUFFOzBCQU5aLE1BQU07Ozs7OztBQVd2QixRQUFJLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQzs7Ozs7O0FBTXZCLFFBQUksQ0FBQyxHQUFHLEdBQUcsT0FBTyxFQUFFLENBQUM7Ozs7OztBQU1yQixRQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQzs7Ozs7O0FBTXhCLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDOzs7Ozs7QUFNbEIsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7Ozs7Ozs7Ozs7QUFVbEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7Ozs7Ozs7QUFPbEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7R0FDdEI7Ozs7Ozs7ZUFyRGtCLE1BQU07O1dBMkRoQixxQkFBRztBQUNWLGFBQU87QUFDTCxZQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7QUFDZixXQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7QUFDYixtQkFBVyxFQUFFLElBQUksQ0FBQyxXQUFXO0FBQzdCLGFBQUssRUFBRSxJQUFJLENBQUMsS0FBSztBQUNqQixhQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7QUFDakIsZUFBTyxFQUFFLElBQUksQ0FBQyxPQUFPO09BQ3RCLENBQUM7S0FDSDs7Ozs7OztXQUtNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0FBQ2pDLFVBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7S0FDZjs7O1NBNUVrQixNQUFNOzs7cUJBQU4sTUFBTSIsImZpbGUiOiJzcmMvc2VydmVyL2NvcmUvQ2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IGxvZ2dlciBmcm9tICcuLi91dGlscy9sb2dnZXInO1xuXG5sZXQgX2NvdW50ZXIgPSAwO1xuZnVuY3Rpb24gX2dldFVJRCgpIHsgcmV0dXJuIF9jb3VudGVyKys7IH1cblxuLyoqXG4gKiBDbGllbnQgdGhhdCBjb25uZWN0cyB0byB0aGUgc2VydmVyLlxuICpcbiAqIEVhY2ggdGltZSBhIGNsaWVudCBvZiB0eXBlIGAnY2xpZW50VHlwZSdgIGNvbm5lY3RzIHRvIHRoZSBzZXJ2ZXIsICpTb3VuZHdvcmtzKiBjcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIGBDbGllbnRgLlxuICogQW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzIGlzIHBhc3NlZCB0byB0aGUgYGNvbm5lY3RgIGFuZCBgZGlzY29ubmVjdGAgbWV0aG9kcyBvZiBhbGwgdGhlIHNlcnZlciBzaWRlIG1vZHVsZXMgdGhhdCBhcmUgbWFwcGVkIHRvIHRoZSBgJ2NsaWVudFR5cGUnYCBjbGllbnRzIChzZWUge0BsaW5rIHNlcnZlciNtYXB9KSwgYXMgd2VsbCBhcyB0byB0aGUgYGVudGVyYCBhbmQgYGV4aXRgIG1ldGhvZHMgb2YgYW55IHtAbGluayBzcmMvc2VydmVyL1BlcmZvcm1hbmNlLmpzflBlcmZvcm1hbmNlfSBjbGFzcyBtYXBwZWQgdG8gdGhhdCBzYW1lIGNsaWVudCB0eXBlLlxuICpcbiAqIFRoZSBjbGFzcyBpcyBhbHNvIHVzZWQgdG8gY29tbXVuaWNhdGUgd2l0aCB0aGUgY2xpZW50IHZpYSBXZWJTb2NrZXRzLlxuICpcbiAqIEBleGFtcGxlIGNsYXNzIE15UGVyZm9ybWFuY2UgZXh0ZW5kcyBQZXJmb3JtYW5jZSB7XG4gKiAgIC8vIC4uLlxuICpcbiAqICAgZW50ZXIoY2xpZW50KSB7XG4gKiAgICAgY29uc3QgbXNnID0gXCJXZWxjb21lIHRvIHRoZSBwZXJmb3JtYW5jZSFcIjtcbiAqICAgICBjbGllbnQuc2VuZCgnaW5pdCcsIG1zZyk7XG4gKiAgIH1cbiAqXG4gKiAgIC8vIC4uLlxuICogfVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnQge1xuXHQvKipcblx0ICogQHBhcmFtIHtTdHJpbmd9IGNsaWVudFR5cGUgQ2xpZW50IHR5cGUgb2YgdGhlIGNvbm5lY3RlZCBjbGllbnQuXG5cdCAqIEBwYXJhbSB7U29ja2V0fSBzb2NrZXQgU29ja2V0IG9iamVjdCB1c2VkIHRvIGNvbW1pbnVhdGUgd2l0aCB0aGUgY2xpZW50LlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0Y29uc3RydWN0b3IoY2xpZW50VHlwZSwgc29ja2V0KSB7XG5cdFx0LyoqXG5cdFx0ICogQ2xpZW50IHR5cGUgKHNwZWNpZmllZCB3aGVuIGluaXRpYWxpemluZyB0aGUge0BsaW5rIGNsaWVudH0gb2JqZWN0IG9uIHRoZSBjbGllbnQgc2lkZSB3aXRoIHtAbGluayBjbGllbnQuaW5pdH0pLlxuXHRcdCAqIEB0eXBlIHtTdHJpbmd9XG5cdFx0ICovXG4gICAgdGhpcy50eXBlID0gY2xpZW50VHlwZTtcblxuXHRcdC8qKlxuXHRcdCAqIEluZGV4IG9mIHRoZSBjbGllbnQuXG5cdFx0ICogQHR5cGUge051bWJlcn1cblx0XHQgKi9cbiAgICB0aGlzLnVpZCA9IF9nZXRVSUQoKTtcblxuXHRcdC8qKlxuXHRcdCAqIENvb3JkaW5hdGVzIG9mIHRoZSBjbGllbnQsIHN0b3JlZCBhcyBhbiBgW3g6TnVtYmVyLCB5Ok51bWJlcl1gIGFycmF5LlxuXHRcdCAqIEB0eXBlIHtBcnJheTxOdW1iZXI+fVxuXHRcdCAqL1xuICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogVGlja2V0IGluZGV4IG9mIHRoZSBjbGllbnQuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmluZGV4ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFRpY2tldCBsYWJlbCBvZiB0aGUgY2xpZW50LlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5sYWJlbCA9IG51bGw7XG5cblx0XHQvKipcblx0XHQgKiBVc2VkIGJ5IGFueSB7QGxpbmsgc3JjL3NlcnZlci9TZXJ2ZXJNb2R1bGUuanN+U2VydmVyTW9kdWxlfSB0byBhc3NvY2lhdGUgZGF0YSB0byBhIHBhcnRpY3VsYXIgY2xpZW50LlxuXHRcdCAqXG5cdFx0ICogQWxsIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCBhIG1vZHVsZSB3aG9zZSBgbmFtZWAgaXMgYCdtb2R1bGVOYW1lJ2AgaXMgYWNjZXNzaWJsZSB0aHJvdWdoIHRoZSBrZXkgYG1vZHVsZU5hbWVgLlxuXHRcdCAqIEZvciBpbnN0YW5jZSwgdGhlIHtAbGluayBzcmMvc2VydmVyL0NoZWNraW4uanN+Q2hlY2tpbn0gbW9kdWxlIGtlZXBzIHRyYWNrIG9mIGNsaWVudCdzIGNoZWNraW4gaW5kZXggYW5kIGxhYmVsIGluIGB0aGlzLm1vZHVsZXMuY2hlY2tpbi5pbmRleGAgYW5kIGB0aGlzLm1vZHVsZXMuY2hlY2tpbi5sYWJlbGAuXG5cdFx0ICogU2ltaWxhcmx5LCBhIHtAbGluayBzcmMvc2VydmVyL1BlcmZvcm1hbmNlLmpzflBlcmZvcm1hbmNlfSBtb2R1bGUgd2hvc2UgbmFtZSBpcyBgJ215UGVyZm9ybWFuY2UnYCBjb3VsZCByZXBvcnQgdGhlIGNsaWVudCdzIHN0YXR1cyBpbiBgdGhpcy5tb2R1bGVzLm15UGVyZm9ybWFuY2Uuc3RhdHVzYC5cblx0XHQgKiBAdHlwZSB7T2JqZWN0fVxuXHRcdCAqL1xuICAgIHRoaXMubW9kdWxlcyA9IHt9O1xuXG5cdFx0LyoqXG5cdFx0ICogU29ja2V0IHVzZWQgdG8gY29tbXVuaWNhdGUgd2l0aCB0aGUgY2xpZW50LlxuXHRcdCAqIEB0eXBlIHtTb2NrZXR9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cbiAgICB0aGlzLnNvY2tldCA9IHNvY2tldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgbGlnaHR3ZWlnaHQgdmVyc2lvbiBvZiB0aGUgZGF0YSBkZWZpbmluZyB0aGUgY2xpZW50LlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgKi9cbiAgc2VyaWFsaXplKCkge1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgICB1aWQ6IHRoaXMudWlkLFxuICAgICAgY29vcmRpbmF0ZXM6IHRoaXMuY29vcmRpbmF0ZXMsXG4gICAgICBpbmRleDogdGhpcy5pbmRleCxcbiAgICAgIGxhYmVsOiB0aGlzLmxhYmVsLFxuICAgICAgbW9kdWxlczogdGhpcy5tb2R1bGVzLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogRGVzdHJveSB0aGUgY2xpZW50LlxuICAgKi9cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLnNvY2tldC5yZW1vdmVBbGxMaXN0ZW5lcnMoKTtcbiAgICB0aGlzLnVpZCA9IC0xO1xuICB9XG59XG4iXX0=