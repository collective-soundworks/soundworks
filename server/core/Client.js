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
 * Server side representation of a client.
 */

var Client = function () {
  /**
   * @param {String} clientType - Client type of the connected client.
   * @param {Socket} socket - Socket object used to comminuate with the client.
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
     * Used by the activities to associate data to a particular client.
     *
     * All the data associated with a activity whose `name` is `'activityName'` is accessible through the key `activityName`.
     * For instance, the {@link src/server/Checkin.js~Checkin} activity keeps track of client's checkin index and label in `this.activities.checkin.index` and `this.activities.checkin.label`.
     * Similarly, a {@link src/server/Performance.js~Performance} activity whose name is `'myPerformance'` could report the client's status in `this.activities.myPerformance.status`.
     * @type {Object}
     */
    this.activities = {};

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
        activities: this.activities
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNsaWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7O0lBS3FCOzs7Ozs7O0FBTXBCLFdBTm9CLE1BTXBCLENBQVksVUFBWixFQUF3QixNQUF4QixFQUFnQzt3Q0FOWixRQU1ZOzs7Ozs7QUFLN0IsU0FBSyxJQUFMLEdBQVksVUFBWjs7Ozs7O0FBTDZCLFFBVzdCLENBQUssSUFBTCxHQUFZLGVBQUssRUFBTCxFQUFaOzs7Ozs7QUFYNkIsUUFpQjdCLENBQUssV0FBTCxHQUFtQixJQUFuQjs7Ozs7O0FBakI2QixRQXVCN0IsQ0FBSyxLQUFMLEdBQWEsSUFBYjs7Ozs7O0FBdkI2QixRQTZCN0IsQ0FBSyxLQUFMLEdBQWEsSUFBYjs7Ozs7Ozs7OztBQTdCNkIsUUF1QzdCLENBQUssVUFBTCxHQUFrQixFQUFsQjs7Ozs7OztBQXZDNkIsUUE4QzdCLENBQUssTUFBTCxHQUFjLE1BQWQsQ0E5QzZCO0dBQWhDOzs7Ozs7Ozs2QkFOb0I7O2dDQTJEUDtBQUNWLGFBQU87QUFDTCxjQUFNLEtBQUssSUFBTDtBQUNOLGNBQU0sS0FBSyxJQUFMO0FBQ04scUJBQWEsS0FBSyxXQUFMO0FBQ2IsZUFBTyxLQUFLLEtBQUw7QUFDUCxlQUFPLEtBQUssS0FBTDtBQUNQLG9CQUFZLEtBQUssVUFBTDtPQU5kLENBRFU7Ozs7Ozs7Ozs4QkFjRjtBQUNSLFdBQUssTUFBTCxDQUFZLGtCQUFaLEdBRFE7QUFFUixXQUFLLElBQUwsR0FBWSxJQUFaLENBRlE7OztTQXpFUyIsImZpbGUiOiJDbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdXVpZCBmcm9tICd1dWlkJztcblxuLyoqXG4gKiBTZXJ2ZXIgc2lkZSByZXByZXNlbnRhdGlvbiBvZiBhIGNsaWVudC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2xpZW50IHtcblx0LyoqXG5cdCAqIEBwYXJhbSB7U3RyaW5nfSBjbGllbnRUeXBlIC0gQ2xpZW50IHR5cGUgb2YgdGhlIGNvbm5lY3RlZCBjbGllbnQuXG5cdCAqIEBwYXJhbSB7U29ja2V0fSBzb2NrZXQgLSBTb2NrZXQgb2JqZWN0IHVzZWQgdG8gY29tbWludWF0ZSB3aXRoIHRoZSBjbGllbnQuXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRjb25zdHJ1Y3RvcihjbGllbnRUeXBlLCBzb2NrZXQpIHtcblx0XHQvKipcblx0XHQgKiBDbGllbnQgdHlwZSAoc3BlY2lmaWVkIHdoZW4gaW5pdGlhbGl6aW5nIHRoZSB7QGxpbmsgY2xpZW50fSBvYmplY3Qgb24gdGhlIGNsaWVudCBzaWRlIHdpdGgge0BsaW5rIGNsaWVudC5pbml0fSkuXG5cdFx0ICogQHR5cGUge1N0cmluZ31cblx0XHQgKi9cbiAgICB0aGlzLnR5cGUgPSBjbGllbnRUeXBlO1xuXG5cdFx0LyoqXG5cdFx0ICogSW5kZXggb2YgdGhlIGNsaWVudC5cblx0XHQgKiBAdHlwZSB7TnVtYmVyfVxuXHRcdCAqL1xuICAgIHRoaXMudXVpZCA9IHV1aWQudjQoKTtcblxuXHRcdC8qKlxuXHRcdCAqIENvb3JkaW5hdGVzIG9mIHRoZSBjbGllbnQsIHN0b3JlZCBhcyBhbiBgW3g6TnVtYmVyLCB5Ok51bWJlcl1gIGFycmF5LlxuXHRcdCAqIEB0eXBlIHtBcnJheTxOdW1iZXI+fVxuXHRcdCAqL1xuICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogVGlja2V0IGluZGV4IG9mIHRoZSBjbGllbnQuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmluZGV4ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFRpY2tldCBsYWJlbCBvZiB0aGUgY2xpZW50LlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5sYWJlbCA9IG51bGw7XG5cblx0XHQvKipcblx0XHQgKiBVc2VkIGJ5IHRoZSBhY3Rpdml0aWVzIHRvIGFzc29jaWF0ZSBkYXRhIHRvIGEgcGFydGljdWxhciBjbGllbnQuXG5cdFx0ICpcblx0XHQgKiBBbGwgdGhlIGRhdGEgYXNzb2NpYXRlZCB3aXRoIGEgYWN0aXZpdHkgd2hvc2UgYG5hbWVgIGlzIGAnYWN0aXZpdHlOYW1lJ2AgaXMgYWNjZXNzaWJsZSB0aHJvdWdoIHRoZSBrZXkgYGFjdGl2aXR5TmFtZWAuXG5cdFx0ICogRm9yIGluc3RhbmNlLCB0aGUge0BsaW5rIHNyYy9zZXJ2ZXIvQ2hlY2tpbi5qc35DaGVja2lufSBhY3Rpdml0eSBrZWVwcyB0cmFjayBvZiBjbGllbnQncyBjaGVja2luIGluZGV4IGFuZCBsYWJlbCBpbiBgdGhpcy5hY3Rpdml0aWVzLmNoZWNraW4uaW5kZXhgIGFuZCBgdGhpcy5hY3Rpdml0aWVzLmNoZWNraW4ubGFiZWxgLlxuXHRcdCAqIFNpbWlsYXJseSwgYSB7QGxpbmsgc3JjL3NlcnZlci9QZXJmb3JtYW5jZS5qc35QZXJmb3JtYW5jZX0gYWN0aXZpdHkgd2hvc2UgbmFtZSBpcyBgJ215UGVyZm9ybWFuY2UnYCBjb3VsZCByZXBvcnQgdGhlIGNsaWVudCdzIHN0YXR1cyBpbiBgdGhpcy5hY3Rpdml0aWVzLm15UGVyZm9ybWFuY2Uuc3RhdHVzYC5cblx0XHQgKiBAdHlwZSB7T2JqZWN0fVxuXHRcdCAqL1xuICAgIHRoaXMuYWN0aXZpdGllcyA9IHt9O1xuXG5cdFx0LyoqXG5cdFx0ICogU29ja2V0IHVzZWQgdG8gY29tbXVuaWNhdGUgd2l0aCB0aGUgY2xpZW50LlxuXHRcdCAqIEB0eXBlIHtTb2NrZXR9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cbiAgICB0aGlzLnNvY2tldCA9IHNvY2tldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgbGlnaHR3ZWlnaHQgdmVyc2lvbiBvZiB0aGUgZGF0YSBkZWZpbmluZyB0aGUgY2xpZW50LlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgKi9cbiAgc2VyaWFsaXplKCkge1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgICB1dWlkOiB0aGlzLnV1aWQsXG4gICAgICBjb29yZGluYXRlczogdGhpcy5jb29yZGluYXRlcyxcbiAgICAgIGluZGV4OiB0aGlzLmluZGV4LFxuICAgICAgbGFiZWw6IHRoaXMubGFiZWwsXG4gICAgICBhY3Rpdml0aWVzOiB0aGlzLmFjdGl2aXRpZXMsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95IHRoZSBjbGllbnQuXG4gICAqL1xuICBkZXN0cm95KCkge1xuICAgIHRoaXMuc29ja2V0LnJlbW92ZUFsbExpc3RlbmVycygpO1xuICAgIHRoaXMudXVpZCA9IG51bGw7XG4gIH1cbn1cbiJdfQ==