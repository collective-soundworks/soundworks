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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvc2VydmVyL2NvcmUvQ2xpZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztvQkFBaUIsTUFBTTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBc0JGLE1BQU07Ozs7Ozs7QUFNZixXQU5TLE1BQU0sQ0FNZCxVQUFVLEVBQUUsTUFBTSxFQUFFOzBCQU5aLE1BQU07Ozs7OztBQVd2QixRQUFJLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQzs7Ozs7O0FBTXZCLFFBQUksQ0FBQyxJQUFJLEdBQUcsa0JBQUssRUFBRSxFQUFFLENBQUM7Ozs7OztBQU10QixRQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQzs7Ozs7O0FBTXhCLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDOzs7Ozs7QUFNbEIsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7Ozs7Ozs7Ozs7QUFVbEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7Ozs7Ozs7QUFPbEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7R0FDdEI7Ozs7Ozs7ZUFyRGtCLE1BQU07O1dBMkRoQixxQkFBRztBQUNWLGFBQU87QUFDTCxZQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7QUFDZixZQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7QUFDZixtQkFBVyxFQUFFLElBQUksQ0FBQyxXQUFXO0FBQzdCLGFBQUssRUFBRSxJQUFJLENBQUMsS0FBSztBQUNqQixhQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7QUFDakIsZUFBTyxFQUFFLElBQUksQ0FBQyxPQUFPO09BQ3RCLENBQUM7S0FDSDs7Ozs7OztXQUtNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0FBQ2pDLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0tBQ2xCOzs7U0E1RWtCLE1BQU07OztxQkFBTixNQUFNIiwiZmlsZSI6Ii9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvc2VydmVyL2NvcmUvQ2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHV1aWQgZnJvbSAndXVpZCc7XG5cblxuLyoqXG4gKiBDbGllbnQgdGhhdCBjb25uZWN0cyB0byB0aGUgc2VydmVyLlxuICpcbiAqIEVhY2ggdGltZSBhIGNsaWVudCBvZiB0eXBlIGAnY2xpZW50VHlwZSdgIGNvbm5lY3RzIHRvIHRoZSBzZXJ2ZXIsICpTb3VuZHdvcmtzKiBjcmVhdGVzIGEgbmV3IGluc3RhbmNlIG9mIGBDbGllbnRgLlxuICogQW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzIGlzIHBhc3NlZCB0byB0aGUgYGNvbm5lY3RgIGFuZCBgZGlzY29ubmVjdGAgbWV0aG9kcyBvZiBhbGwgdGhlIHNlcnZlciBzaWRlIG1vZHVsZXMgdGhhdCBhcmUgbWFwcGVkIHRvIHRoZSBgJ2NsaWVudFR5cGUnYCBjbGllbnRzIChzZWUge0BsaW5rIHNlcnZlciNtYXB9KSwgYXMgd2VsbCBhcyB0byB0aGUgYGVudGVyYCBhbmQgYGV4aXRgIG1ldGhvZHMgb2YgYW55IHtAbGluayBzcmMvc2VydmVyL1BlcmZvcm1hbmNlLmpzflBlcmZvcm1hbmNlfSBjbGFzcyBtYXBwZWQgdG8gdGhhdCBzYW1lIGNsaWVudCB0eXBlLlxuICpcbiAqIFRoZSBjbGFzcyBpcyBhbHNvIHVzZWQgdG8gY29tbXVuaWNhdGUgd2l0aCB0aGUgY2xpZW50IHZpYSBXZWJTb2NrZXRzLlxuICpcbiAqIEBleGFtcGxlIGNsYXNzIE15UGVyZm9ybWFuY2UgZXh0ZW5kcyBQZXJmb3JtYW5jZSB7XG4gKiAgIC8vIC4uLlxuICpcbiAqICAgZW50ZXIoY2xpZW50KSB7XG4gKiAgICAgY29uc3QgbXNnID0gXCJXZWxjb21lIHRvIHRoZSBwZXJmb3JtYW5jZSFcIjtcbiAqICAgICBjbGllbnQuc2VuZCgnaW5pdCcsIG1zZyk7XG4gKiAgIH1cbiAqXG4gKiAgIC8vIC4uLlxuICogfVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnQge1xuXHQvKipcblx0ICogQHBhcmFtIHtTdHJpbmd9IGNsaWVudFR5cGUgQ2xpZW50IHR5cGUgb2YgdGhlIGNvbm5lY3RlZCBjbGllbnQuXG5cdCAqIEBwYXJhbSB7U29ja2V0fSBzb2NrZXQgU29ja2V0IG9iamVjdCB1c2VkIHRvIGNvbW1pbnVhdGUgd2l0aCB0aGUgY2xpZW50LlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0Y29uc3RydWN0b3IoY2xpZW50VHlwZSwgc29ja2V0KSB7XG5cdFx0LyoqXG5cdFx0ICogQ2xpZW50IHR5cGUgKHNwZWNpZmllZCB3aGVuIGluaXRpYWxpemluZyB0aGUge0BsaW5rIGNsaWVudH0gb2JqZWN0IG9uIHRoZSBjbGllbnQgc2lkZSB3aXRoIHtAbGluayBjbGllbnQuaW5pdH0pLlxuXHRcdCAqIEB0eXBlIHtTdHJpbmd9XG5cdFx0ICovXG4gICAgdGhpcy50eXBlID0gY2xpZW50VHlwZTtcblxuXHRcdC8qKlxuXHRcdCAqIEluZGV4IG9mIHRoZSBjbGllbnQuXG5cdFx0ICogQHR5cGUge051bWJlcn1cblx0XHQgKi9cbiAgICB0aGlzLnV1aWQgPSB1dWlkLnY0KCk7XG5cblx0XHQvKipcblx0XHQgKiBDb29yZGluYXRlcyBvZiB0aGUgY2xpZW50LCBzdG9yZWQgYXMgYW4gYFt4Ok51bWJlciwgeTpOdW1iZXJdYCBhcnJheS5cblx0XHQgKiBAdHlwZSB7QXJyYXk8TnVtYmVyPn1cblx0XHQgKi9cbiAgICB0aGlzLmNvb3JkaW5hdGVzID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFRpY2tldCBpbmRleCBvZiB0aGUgY2xpZW50LlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5pbmRleCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBUaWNrZXQgbGFiZWwgb2YgdGhlIGNsaWVudC5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMubGFiZWwgPSBudWxsO1xuXG5cdFx0LyoqXG5cdFx0ICogVXNlZCBieSBhbnkge0BsaW5rIHNyYy9zZXJ2ZXIvU2VydmVyTW9kdWxlLmpzflNlcnZlck1vZHVsZX0gdG8gYXNzb2NpYXRlIGRhdGEgdG8gYSBwYXJ0aWN1bGFyIGNsaWVudC5cblx0XHQgKlxuXHRcdCAqIEFsbCB0aGUgZGF0YSBhc3NvY2lhdGVkIHdpdGggYSBtb2R1bGUgd2hvc2UgYG5hbWVgIGlzIGAnbW9kdWxlTmFtZSdgIGlzIGFjY2Vzc2libGUgdGhyb3VnaCB0aGUga2V5IGBtb2R1bGVOYW1lYC5cblx0XHQgKiBGb3IgaW5zdGFuY2UsIHRoZSB7QGxpbmsgc3JjL3NlcnZlci9DaGVja2luLmpzfkNoZWNraW59IG1vZHVsZSBrZWVwcyB0cmFjayBvZiBjbGllbnQncyBjaGVja2luIGluZGV4IGFuZCBsYWJlbCBpbiBgdGhpcy5tb2R1bGVzLmNoZWNraW4uaW5kZXhgIGFuZCBgdGhpcy5tb2R1bGVzLmNoZWNraW4ubGFiZWxgLlxuXHRcdCAqIFNpbWlsYXJseSwgYSB7QGxpbmsgc3JjL3NlcnZlci9QZXJmb3JtYW5jZS5qc35QZXJmb3JtYW5jZX0gbW9kdWxlIHdob3NlIG5hbWUgaXMgYCdteVBlcmZvcm1hbmNlJ2AgY291bGQgcmVwb3J0IHRoZSBjbGllbnQncyBzdGF0dXMgaW4gYHRoaXMubW9kdWxlcy5teVBlcmZvcm1hbmNlLnN0YXR1c2AuXG5cdFx0ICogQHR5cGUge09iamVjdH1cblx0XHQgKi9cbiAgICB0aGlzLm1vZHVsZXMgPSB7fTtcblxuXHRcdC8qKlxuXHRcdCAqIFNvY2tldCB1c2VkIHRvIGNvbW11bmljYXRlIHdpdGggdGhlIGNsaWVudC5cblx0XHQgKiBAdHlwZSB7U29ja2V0fVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG4gICAgdGhpcy5zb2NrZXQgPSBzb2NrZXQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIGxpZ2h0d2VpZ2h0IHZlcnNpb24gb2YgdGhlIGRhdGEgZGVmaW5pbmcgdGhlIGNsaWVudC5cbiAgICogQHJldHVybnMge09iamVjdH1cbiAgICovXG4gIHNlcmlhbGl6ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogdGhpcy50eXBlLFxuICAgICAgdXVpZDogdGhpcy51dWlkLFxuICAgICAgY29vcmRpbmF0ZXM6IHRoaXMuY29vcmRpbmF0ZXMsXG4gICAgICBpbmRleDogdGhpcy5pbmRleCxcbiAgICAgIGxhYmVsOiB0aGlzLmxhYmVsLFxuICAgICAgbW9kdWxlczogdGhpcy5tb2R1bGVzLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogRGVzdHJveSB0aGUgY2xpZW50LlxuICAgKi9cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLnNvY2tldC5yZW1vdmVBbGxMaXN0ZW5lcnMoKTtcbiAgICB0aGlzLnV1aWQgPSBudWxsO1xuICB9XG59XG4iXX0=