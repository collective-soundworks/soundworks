'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var Client = function () {
  /**
   * @param {String} clientType Client type of the connected client.
   * @param {Socket} socket Socket object used to comminuate with the client.
   * @private
   */

  function Client(clientType, socket) {
    (0, _classCallCheck3.default)(this, Client);

    /**
     * Client type (specified when initializing the {@link client} object on the client side with {@link client.init}).
     * @type {String}
     */
    this.type = clientType;

    /**
     * Index of the client.
     * @type {Number}
     */
    this.uuid = _uuid2.default.v4();

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


  (0, _createClass3.default)(Client, [{
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
}();

exports.default = Client;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNsaWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXNCcUI7Ozs7Ozs7QUFNcEIsV0FOb0IsTUFNcEIsQ0FBWSxVQUFaLEVBQXdCLE1BQXhCLEVBQWdDO3dDQU5aLFFBTVk7Ozs7OztBQUs3QixTQUFLLElBQUwsR0FBWSxVQUFaOzs7Ozs7QUFMNkIsUUFXN0IsQ0FBSyxJQUFMLEdBQVksZUFBSyxFQUFMLEVBQVo7Ozs7OztBQVg2QixRQWlCN0IsQ0FBSyxXQUFMLEdBQW1CLElBQW5COzs7Ozs7QUFqQjZCLFFBdUI3QixDQUFLLEtBQUwsR0FBYSxJQUFiOzs7Ozs7QUF2QjZCLFFBNkI3QixDQUFLLEtBQUwsR0FBYSxJQUFiOzs7Ozs7Ozs7O0FBN0I2QixRQXVDN0IsQ0FBSyxPQUFMLEdBQWUsRUFBZjs7Ozs7OztBQXZDNkIsUUE4QzdCLENBQUssTUFBTCxHQUFjLE1BQWQsQ0E5QzZCO0dBQWhDOzs7Ozs7Ozs2QkFOb0I7O2dDQTJEUDtBQUNWLGFBQU87QUFDTCxjQUFNLEtBQUssSUFBTDtBQUNOLGNBQU0sS0FBSyxJQUFMO0FBQ04scUJBQWEsS0FBSyxXQUFMO0FBQ2IsZUFBTyxLQUFLLEtBQUw7QUFDUCxlQUFPLEtBQUssS0FBTDtBQUNQLGlCQUFTLEtBQUssT0FBTDtPQU5YLENBRFU7Ozs7Ozs7Ozs4QkFjRjtBQUNSLFdBQUssTUFBTCxDQUFZLGtCQUFaLEdBRFE7QUFFUixXQUFLLElBQUwsR0FBWSxJQUFaLENBRlE7OztTQXpFUyIsImZpbGUiOiJDbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdXVpZCBmcm9tICd1dWlkJztcblxuXG4vKipcbiAqIENsaWVudCB0aGF0IGNvbm5lY3RzIHRvIHRoZSBzZXJ2ZXIuXG4gKlxuICogRWFjaCB0aW1lIGEgY2xpZW50IG9mIHR5cGUgYCdjbGllbnRUeXBlJ2AgY29ubmVjdHMgdG8gdGhlIHNlcnZlciwgKlNvdW5kd29ya3MqIGNyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgYENsaWVudGAuXG4gKiBBbiBpbnN0YW5jZSBvZiB0aGUgY2xhc3MgaXMgcGFzc2VkIHRvIHRoZSBgY29ubmVjdGAgYW5kIGBkaXNjb25uZWN0YCBtZXRob2RzIG9mIGFsbCB0aGUgc2VydmVyIHNpZGUgbW9kdWxlcyB0aGF0IGFyZSBtYXBwZWQgdG8gdGhlIGAnY2xpZW50VHlwZSdgIGNsaWVudHMgKHNlZSB7QGxpbmsgc2VydmVyI21hcH0pLCBhcyB3ZWxsIGFzIHRvIHRoZSBgZW50ZXJgIGFuZCBgZXhpdGAgbWV0aG9kcyBvZiBhbnkge0BsaW5rIHNyYy9zZXJ2ZXIvUGVyZm9ybWFuY2UuanN+UGVyZm9ybWFuY2V9IGNsYXNzIG1hcHBlZCB0byB0aGF0IHNhbWUgY2xpZW50IHR5cGUuXG4gKlxuICogVGhlIGNsYXNzIGlzIGFsc28gdXNlZCB0byBjb21tdW5pY2F0ZSB3aXRoIHRoZSBjbGllbnQgdmlhIFdlYlNvY2tldHMuXG4gKlxuICogQGV4YW1wbGUgY2xhc3MgTXlQZXJmb3JtYW5jZSBleHRlbmRzIFBlcmZvcm1hbmNlIHtcbiAqICAgLy8gLi4uXG4gKlxuICogICBlbnRlcihjbGllbnQpIHtcbiAqICAgICBjb25zdCBtc2cgPSBcIldlbGNvbWUgdG8gdGhlIHBlcmZvcm1hbmNlIVwiO1xuICogICAgIGNsaWVudC5zZW5kKCdpbml0JywgbXNnKTtcbiAqICAgfVxuICpcbiAqICAgLy8gLi4uXG4gKiB9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudCB7XG5cdC8qKlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gY2xpZW50VHlwZSBDbGllbnQgdHlwZSBvZiB0aGUgY29ubmVjdGVkIGNsaWVudC5cblx0ICogQHBhcmFtIHtTb2NrZXR9IHNvY2tldCBTb2NrZXQgb2JqZWN0IHVzZWQgdG8gY29tbWludWF0ZSB3aXRoIHRoZSBjbGllbnQuXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcihjbGllbnRUeXBlLCBzb2NrZXQpIHtcblx0XHQvKipcblx0XHQgKiBDbGllbnQgdHlwZSAoc3BlY2lmaWVkIHdoZW4gaW5pdGlhbGl6aW5nIHRoZSB7QGxpbmsgY2xpZW50fSBvYmplY3Qgb24gdGhlIGNsaWVudCBzaWRlIHdpdGgge0BsaW5rIGNsaWVudC5pbml0fSkuXG5cdFx0ICogQHR5cGUge1N0cmluZ31cblx0XHQgKi9cbiAgICB0aGlzLnR5cGUgPSBjbGllbnRUeXBlO1xuXG5cdFx0LyoqXG5cdFx0ICogSW5kZXggb2YgdGhlIGNsaWVudC5cblx0XHQgKiBAdHlwZSB7TnVtYmVyfVxuXHRcdCAqL1xuICAgIHRoaXMudXVpZCA9IHV1aWQudjQoKTtcblxuXHRcdC8qKlxuXHRcdCAqIENvb3JkaW5hdGVzIG9mIHRoZSBjbGllbnQsIHN0b3JlZCBhcyBhbiBgW3g6TnVtYmVyLCB5Ok51bWJlcl1gIGFycmF5LlxuXHRcdCAqIEB0eXBlIHtBcnJheTxOdW1iZXI+fVxuXHRcdCAqL1xuICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogVGlja2V0IGluZGV4IG9mIHRoZSBjbGllbnQuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmluZGV4ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFRpY2tldCBsYWJlbCBvZiB0aGUgY2xpZW50LlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5sYWJlbCA9IG51bGw7XG5cblx0XHQvKipcblx0XHQgKiBVc2VkIGJ5IGFueSB7QGxpbmsgc3JjL3NlcnZlci9TZXJ2ZXJNb2R1bGUuanN+U2VydmVyTW9kdWxlfSB0byBhc3NvY2lhdGUgZGF0YSB0byBhIHBhcnRpY3VsYXIgY2xpZW50LlxuXHRcdCAqXG5cdFx0ICogQWxsIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCBhIG1vZHVsZSB3aG9zZSBgbmFtZWAgaXMgYCdtb2R1bGVOYW1lJ2AgaXMgYWNjZXNzaWJsZSB0aHJvdWdoIHRoZSBrZXkgYG1vZHVsZU5hbWVgLlxuXHRcdCAqIEZvciBpbnN0YW5jZSwgdGhlIHtAbGluayBzcmMvc2VydmVyL0NoZWNraW4uanN+Q2hlY2tpbn0gbW9kdWxlIGtlZXBzIHRyYWNrIG9mIGNsaWVudCdzIGNoZWNraW4gaW5kZXggYW5kIGxhYmVsIGluIGB0aGlzLm1vZHVsZXMuY2hlY2tpbi5pbmRleGAgYW5kIGB0aGlzLm1vZHVsZXMuY2hlY2tpbi5sYWJlbGAuXG5cdFx0ICogU2ltaWxhcmx5LCBhIHtAbGluayBzcmMvc2VydmVyL1BlcmZvcm1hbmNlLmpzflBlcmZvcm1hbmNlfSBtb2R1bGUgd2hvc2UgbmFtZSBpcyBgJ215UGVyZm9ybWFuY2UnYCBjb3VsZCByZXBvcnQgdGhlIGNsaWVudCdzIHN0YXR1cyBpbiBgdGhpcy5tb2R1bGVzLm15UGVyZm9ybWFuY2Uuc3RhdHVzYC5cblx0XHQgKiBAdHlwZSB7T2JqZWN0fVxuXHRcdCAqL1xuICAgIHRoaXMubW9kdWxlcyA9IHt9O1xuXG5cdFx0LyoqXG5cdFx0ICogU29ja2V0IHVzZWQgdG8gY29tbXVuaWNhdGUgd2l0aCB0aGUgY2xpZW50LlxuXHRcdCAqIEB0eXBlIHtTb2NrZXR9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cbiAgICB0aGlzLnNvY2tldCA9IHNvY2tldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgbGlnaHR3ZWlnaHQgdmVyc2lvbiBvZiB0aGUgZGF0YSBkZWZpbmluZyB0aGUgY2xpZW50LlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgKi9cbiAgc2VyaWFsaXplKCkge1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgICB1dWlkOiB0aGlzLnV1aWQsXG4gICAgICBjb29yZGluYXRlczogdGhpcy5jb29yZGluYXRlcyxcbiAgICAgIGluZGV4OiB0aGlzLmluZGV4LFxuICAgICAgbGFiZWw6IHRoaXMubGFiZWwsXG4gICAgICBtb2R1bGVzOiB0aGlzLm1vZHVsZXMsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95IHRoZSBjbGllbnQuXG4gICAqL1xuICBkZXN0cm95KCkge1xuICAgIHRoaXMuc29ja2V0LnJlbW92ZUFsbExpc3RlbmVycygpO1xuICAgIHRoaXMudXVpZCA9IG51bGw7XG4gIH1cbn1cbiJdfQ==