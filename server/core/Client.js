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
 *
 * @memberof module:soundworks/server
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
     * @name type
       * @type {String}
       * @memberof module:soundworks/server.Client
       * @instance
     */
    this.type = clientType;

    /**
     * Index of the client.
     * @name uuid
       * @type {Number}
       * @memberof module:soundworks/server.Client
       * @instance
     */
    this.uuid = _uuid2.default.v4();

    /**
     * Coordinates of the client, stored as an `[x:Number, y:Number]` array.
     * @name coordinates
       * @type {Array<Number>}
       * @memberof module:soundworks/server.Client
       * @instance
     */
    this.coordinates = null;

    /**
     * Geoposition of the client as returned by `geolocation.getCurrentPosition`
     * @name geoposition
     * @typ {Object}
     * @memberof module:soundworks/server.Client
     * @instance
     */
    this.geoposition = null;

    /**
     * Ticket index of the client.
     * @name index
     * @type {Number}
     * @memberof module:soundworks/server.Client
     * @instance
     */
    this.index = null;

    /**
     * Ticket label of the client.
     * @name label
     * @type {Number}
     * @memberof module:soundworks/server.Client
     * @instance
     */
    this.label = null;

    /**
     * Used by the activities to associate data to a particular client.
     *
     * All the data associated with a activity whose `name` is `'activityName'`
       * is accessible through the key `activityName`.
     * For instance, the {@link src/server/Checkin.js~Checkin} activity keeps
       * track of client's checkin index and label in `this.activities.checkin.index`
       * and `this.activities.checkin.label`.
     * Similarly, a {@link src/server/Performance.js~Performance} activity whose
       * name is `'myPerformance'` could report the client's status in
       * `this.activities.myPerformance.status`.
     *
       * @name activities
       * @type {Object}
       * @memberof module:soundworks/server.Client
       * @instance
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNsaWVudC5qcyJdLCJuYW1lcyI6WyJDbGllbnQiLCJjbGllbnRUeXBlIiwic29ja2V0IiwidHlwZSIsInV1aWQiLCJ2NCIsImNvb3JkaW5hdGVzIiwiZ2VvcG9zaXRpb24iLCJpbmRleCIsImxhYmVsIiwiYWN0aXZpdGllcyIsInJlbW92ZUFsbExpc3RlbmVycyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBRUE7Ozs7O0lBS01BLE07QUFDTDs7Ozs7QUFLQSxrQkFBWUMsVUFBWixFQUF3QkMsTUFBeEIsRUFBZ0M7QUFBQTs7QUFDL0I7Ozs7Ozs7QUFPRSxTQUFLQyxJQUFMLEdBQVlGLFVBQVo7O0FBRUY7Ozs7Ozs7QUFPRSxTQUFLRyxJQUFMLEdBQVksZUFBS0MsRUFBTCxFQUFaOztBQUVGOzs7Ozs7O0FBT0UsU0FBS0MsV0FBTCxHQUFtQixJQUFuQjs7QUFFQTs7Ozs7OztBQU9BLFNBQUtDLFdBQUwsR0FBbUIsSUFBbkI7O0FBRUE7Ozs7Ozs7QUFPQSxTQUFLQyxLQUFMLEdBQWEsSUFBYjs7QUFFQTs7Ozs7OztBQU9BLFNBQUtDLEtBQUwsR0FBYSxJQUFiOztBQUVGOzs7Ozs7Ozs7Ozs7Ozs7OztBQWlCRSxTQUFLQyxVQUFMLEdBQWtCLEVBQWxCOztBQUVGOzs7OztBQUtFLFNBQUtSLE1BQUwsR0FBY0EsTUFBZDtBQUNEOztBQUVEOzs7Ozs7OztnQ0FJWTtBQUNWLGFBQU87QUFDTEMsY0FBTSxLQUFLQSxJQUROO0FBRUxDLGNBQU0sS0FBS0EsSUFGTjtBQUdMRSxxQkFBYSxLQUFLQSxXQUhiO0FBSUxFLGVBQU8sS0FBS0EsS0FKUDtBQUtMQyxlQUFPLEtBQUtBLEtBTFA7QUFNTEMsb0JBQVksS0FBS0E7QUFOWixPQUFQO0FBUUQ7O0FBRUQ7Ozs7Ozs4QkFHVTtBQUNSLFdBQUtSLE1BQUwsQ0FBWVMsa0JBQVo7QUFDQSxXQUFLUCxJQUFMLEdBQVksSUFBWjtBQUNEOzs7OztrQkFHWUosTSIsImZpbGUiOiJDbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdXVpZCBmcm9tICd1dWlkJztcblxuLyoqXG4gKiBTZXJ2ZXIgc2lkZSByZXByZXNlbnRhdGlvbiBvZiBhIGNsaWVudC5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyXG4gKi9cbmNsYXNzIENsaWVudCB7XG5cdC8qKlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gY2xpZW50VHlwZSAtIENsaWVudCB0eXBlIG9mIHRoZSBjb25uZWN0ZWQgY2xpZW50LlxuXHQgKiBAcGFyYW0ge1NvY2tldH0gc29ja2V0IC0gU29ja2V0IG9iamVjdCB1c2VkIHRvIGNvbW1pbnVhdGUgd2l0aCB0aGUgY2xpZW50LlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0Y29uc3RydWN0b3IoY2xpZW50VHlwZSwgc29ja2V0KSB7XG5cdFx0LyoqXG5cdFx0ICogQ2xpZW50IHR5cGUgKHNwZWNpZmllZCB3aGVuIGluaXRpYWxpemluZyB0aGUge0BsaW5rIGNsaWVudH0gb2JqZWN0IG9uIHRoZSBjbGllbnQgc2lkZSB3aXRoIHtAbGluayBjbGllbnQuaW5pdH0pLlxuXHRcdCAqIEBuYW1lIHR5cGVcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuQ2xpZW50XG4gICAgICogQGluc3RhbmNlXG5cdFx0ICovXG4gICAgdGhpcy50eXBlID0gY2xpZW50VHlwZTtcblxuXHRcdC8qKlxuXHRcdCAqIEluZGV4IG9mIHRoZSBjbGllbnQuXG5cdFx0ICogQG5hbWUgdXVpZFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5DbGllbnRcbiAgICAgKiBAaW5zdGFuY2Vcblx0XHQgKi9cbiAgICB0aGlzLnV1aWQgPSB1dWlkLnY0KCk7XG5cblx0XHQvKipcblx0XHQgKiBDb29yZGluYXRlcyBvZiB0aGUgY2xpZW50LCBzdG9yZWQgYXMgYW4gYFt4Ok51bWJlciwgeTpOdW1iZXJdYCBhcnJheS5cblx0XHQgKiBAbmFtZSBjb29yZGluYXRlc1xuICAgICAqIEB0eXBlIHtBcnJheTxOdW1iZXI+fVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuQ2xpZW50XG4gICAgICogQGluc3RhbmNlXG5cdFx0ICovXG4gICAgdGhpcy5jb29yZGluYXRlcyA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBHZW9wb3NpdGlvbiBvZiB0aGUgY2xpZW50IGFzIHJldHVybmVkIGJ5IGBnZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb25gXG4gICAgICogQG5hbWUgZ2VvcG9zaXRpb25cbiAgICAgKiBAdHlwIHtPYmplY3R9XG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5DbGllbnRcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKi9cbiAgICB0aGlzLmdlb3Bvc2l0aW9uID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFRpY2tldCBpbmRleCBvZiB0aGUgY2xpZW50LlxuICAgICAqIEBuYW1lIGluZGV4XG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLkNsaWVudFxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqL1xuICAgIHRoaXMuaW5kZXggPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogVGlja2V0IGxhYmVsIG9mIHRoZSBjbGllbnQuXG4gICAgICogQG5hbWUgbGFiZWxcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuQ2xpZW50XG4gICAgICogQGluc3RhbmNlXG4gICAgICovXG4gICAgdGhpcy5sYWJlbCA9IG51bGw7XG5cblx0XHQvKipcblx0XHQgKiBVc2VkIGJ5IHRoZSBhY3Rpdml0aWVzIHRvIGFzc29jaWF0ZSBkYXRhIHRvIGEgcGFydGljdWxhciBjbGllbnQuXG5cdFx0ICpcblx0XHQgKiBBbGwgdGhlIGRhdGEgYXNzb2NpYXRlZCB3aXRoIGEgYWN0aXZpdHkgd2hvc2UgYG5hbWVgIGlzIGAnYWN0aXZpdHlOYW1lJ2BcbiAgICAgKiBpcyBhY2Nlc3NpYmxlIHRocm91Z2ggdGhlIGtleSBgYWN0aXZpdHlOYW1lYC5cblx0XHQgKiBGb3IgaW5zdGFuY2UsIHRoZSB7QGxpbmsgc3JjL3NlcnZlci9DaGVja2luLmpzfkNoZWNraW59IGFjdGl2aXR5IGtlZXBzXG4gICAgICogdHJhY2sgb2YgY2xpZW50J3MgY2hlY2tpbiBpbmRleCBhbmQgbGFiZWwgaW4gYHRoaXMuYWN0aXZpdGllcy5jaGVja2luLmluZGV4YFxuICAgICAqIGFuZCBgdGhpcy5hY3Rpdml0aWVzLmNoZWNraW4ubGFiZWxgLlxuXHRcdCAqIFNpbWlsYXJseSwgYSB7QGxpbmsgc3JjL3NlcnZlci9QZXJmb3JtYW5jZS5qc35QZXJmb3JtYW5jZX0gYWN0aXZpdHkgd2hvc2VcbiAgICAgKiBuYW1lIGlzIGAnbXlQZXJmb3JtYW5jZSdgIGNvdWxkIHJlcG9ydCB0aGUgY2xpZW50J3Mgc3RhdHVzIGluXG4gICAgICogYHRoaXMuYWN0aXZpdGllcy5teVBlcmZvcm1hbmNlLnN0YXR1c2AuXG5cdFx0ICpcbiAgICAgKiBAbmFtZSBhY3Rpdml0aWVzXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLkNsaWVudFxuICAgICAqIEBpbnN0YW5jZVxuXHRcdCAqL1xuICAgIHRoaXMuYWN0aXZpdGllcyA9IHt9O1xuXG5cdFx0LyoqXG5cdFx0ICogU29ja2V0IHVzZWQgdG8gY29tbXVuaWNhdGUgd2l0aCB0aGUgY2xpZW50LlxuXHRcdCAqIEB0eXBlIHtTb2NrZXR9XG5cdFx0ICogQHByaXZhdGVcblx0XHQgKi9cbiAgICB0aGlzLnNvY2tldCA9IHNvY2tldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgbGlnaHR3ZWlnaHQgdmVyc2lvbiBvZiB0aGUgZGF0YSBkZWZpbmluZyB0aGUgY2xpZW50LlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgKi9cbiAgc2VyaWFsaXplKCkge1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgICB1dWlkOiB0aGlzLnV1aWQsXG4gICAgICBjb29yZGluYXRlczogdGhpcy5jb29yZGluYXRlcyxcbiAgICAgIGluZGV4OiB0aGlzLmluZGV4LFxuICAgICAgbGFiZWw6IHRoaXMubGFiZWwsXG4gICAgICBhY3Rpdml0aWVzOiB0aGlzLmFjdGl2aXRpZXMsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95IHRoZSBjbGllbnQuXG4gICAqL1xuICBkZXN0cm95KCkge1xuICAgIHRoaXMuc29ja2V0LnJlbW92ZUFsbExpc3RlbmVycygpO1xuICAgIHRoaXMudXVpZCA9IG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2xpZW50O1xuIl19