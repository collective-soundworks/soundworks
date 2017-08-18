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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNsaWVudC5qcyJdLCJuYW1lcyI6WyJDbGllbnQiLCJjbGllbnRUeXBlIiwic29ja2V0IiwidHlwZSIsInV1aWQiLCJ2NCIsImNvb3JkaW5hdGVzIiwiaW5kZXgiLCJsYWJlbCIsImFjdGl2aXRpZXMiLCJyZW1vdmVBbGxMaXN0ZW5lcnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztBQUVBOzs7SUFHcUJBLE07QUFDcEI7Ozs7O0FBS0Esa0JBQVlDLFVBQVosRUFBd0JDLE1BQXhCLEVBQWdDO0FBQUE7O0FBQy9COzs7O0FBSUUsU0FBS0MsSUFBTCxHQUFZRixVQUFaOztBQUVGOzs7O0FBSUUsU0FBS0csSUFBTCxHQUFZLGVBQUtDLEVBQUwsRUFBWjs7QUFFRjs7OztBQUlFLFNBQUtDLFdBQUwsR0FBbUIsSUFBbkI7O0FBRUE7Ozs7QUFJQSxTQUFLQyxLQUFMLEdBQWEsSUFBYjs7QUFFQTs7OztBQUlBLFNBQUtDLEtBQUwsR0FBYSxJQUFiOztBQUVGOzs7Ozs7OztBQVFFLFNBQUtDLFVBQUwsR0FBa0IsRUFBbEI7O0FBRUY7Ozs7O0FBS0UsU0FBS1AsTUFBTCxHQUFjQSxNQUFkO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O2dDQUlZO0FBQ1YsYUFBTztBQUNMQyxjQUFNLEtBQUtBLElBRE47QUFFTEMsY0FBTSxLQUFLQSxJQUZOO0FBR0xFLHFCQUFhLEtBQUtBLFdBSGI7QUFJTEMsZUFBTyxLQUFLQSxLQUpQO0FBS0xDLGVBQU8sS0FBS0EsS0FMUDtBQU1MQyxvQkFBWSxLQUFLQTtBQU5aLE9BQVA7QUFRRDs7QUFFRDs7Ozs7OzhCQUdVO0FBQ1IsV0FBS1AsTUFBTCxDQUFZUSxrQkFBWjtBQUNBLFdBQUtOLElBQUwsR0FBWSxJQUFaO0FBQ0Q7Ozs7O2tCQTVFa0JKLE0iLCJmaWxlIjoiQ2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHV1aWQgZnJvbSAndXVpZCc7XG5cbi8qKlxuICogU2VydmVyIHNpZGUgcmVwcmVzZW50YXRpb24gb2YgYSBjbGllbnQuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudCB7XG5cdC8qKlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gY2xpZW50VHlwZSAtIENsaWVudCB0eXBlIG9mIHRoZSBjb25uZWN0ZWQgY2xpZW50LlxuXHQgKiBAcGFyYW0ge1NvY2tldH0gc29ja2V0IC0gU29ja2V0IG9iamVjdCB1c2VkIHRvIGNvbW1pbnVhdGUgd2l0aCB0aGUgY2xpZW50LlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0Y29uc3RydWN0b3IoY2xpZW50VHlwZSwgc29ja2V0KSB7XG5cdFx0LyoqXG5cdFx0ICogQ2xpZW50IHR5cGUgKHNwZWNpZmllZCB3aGVuIGluaXRpYWxpemluZyB0aGUge0BsaW5rIGNsaWVudH0gb2JqZWN0IG9uIHRoZSBjbGllbnQgc2lkZSB3aXRoIHtAbGluayBjbGllbnQuaW5pdH0pLlxuXHRcdCAqIEB0eXBlIHtTdHJpbmd9XG5cdFx0ICovXG4gICAgdGhpcy50eXBlID0gY2xpZW50VHlwZTtcblxuXHRcdC8qKlxuXHRcdCAqIEluZGV4IG9mIHRoZSBjbGllbnQuXG5cdFx0ICogQHR5cGUge051bWJlcn1cblx0XHQgKi9cbiAgICB0aGlzLnV1aWQgPSB1dWlkLnY0KCk7XG5cblx0XHQvKipcblx0XHQgKiBDb29yZGluYXRlcyBvZiB0aGUgY2xpZW50LCBzdG9yZWQgYXMgYW4gYFt4Ok51bWJlciwgeTpOdW1iZXJdYCBhcnJheS5cblx0XHQgKiBAdHlwZSB7QXJyYXk8TnVtYmVyPn1cblx0XHQgKi9cbiAgICB0aGlzLmNvb3JkaW5hdGVzID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFRpY2tldCBpbmRleCBvZiB0aGUgY2xpZW50LlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5pbmRleCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBUaWNrZXQgbGFiZWwgb2YgdGhlIGNsaWVudC5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMubGFiZWwgPSBudWxsO1xuXG5cdFx0LyoqXG5cdFx0ICogVXNlZCBieSB0aGUgYWN0aXZpdGllcyB0byBhc3NvY2lhdGUgZGF0YSB0byBhIHBhcnRpY3VsYXIgY2xpZW50LlxuXHRcdCAqXG5cdFx0ICogQWxsIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCBhIGFjdGl2aXR5IHdob3NlIGBuYW1lYCBpcyBgJ2FjdGl2aXR5TmFtZSdgIGlzIGFjY2Vzc2libGUgdGhyb3VnaCB0aGUga2V5IGBhY3Rpdml0eU5hbWVgLlxuXHRcdCAqIEZvciBpbnN0YW5jZSwgdGhlIHtAbGluayBzcmMvc2VydmVyL0NoZWNraW4uanN+Q2hlY2tpbn0gYWN0aXZpdHkga2VlcHMgdHJhY2sgb2YgY2xpZW50J3MgY2hlY2tpbiBpbmRleCBhbmQgbGFiZWwgaW4gYHRoaXMuYWN0aXZpdGllcy5jaGVja2luLmluZGV4YCBhbmQgYHRoaXMuYWN0aXZpdGllcy5jaGVja2luLmxhYmVsYC5cblx0XHQgKiBTaW1pbGFybHksIGEge0BsaW5rIHNyYy9zZXJ2ZXIvUGVyZm9ybWFuY2UuanN+UGVyZm9ybWFuY2V9IGFjdGl2aXR5IHdob3NlIG5hbWUgaXMgYCdteVBlcmZvcm1hbmNlJ2AgY291bGQgcmVwb3J0IHRoZSBjbGllbnQncyBzdGF0dXMgaW4gYHRoaXMuYWN0aXZpdGllcy5teVBlcmZvcm1hbmNlLnN0YXR1c2AuXG5cdFx0ICogQHR5cGUge09iamVjdH1cblx0XHQgKi9cbiAgICB0aGlzLmFjdGl2aXRpZXMgPSB7fTtcblxuXHRcdC8qKlxuXHRcdCAqIFNvY2tldCB1c2VkIHRvIGNvbW11bmljYXRlIHdpdGggdGhlIGNsaWVudC5cblx0XHQgKiBAdHlwZSB7U29ja2V0fVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG4gICAgdGhpcy5zb2NrZXQgPSBzb2NrZXQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIGxpZ2h0d2VpZ2h0IHZlcnNpb24gb2YgdGhlIGRhdGEgZGVmaW5pbmcgdGhlIGNsaWVudC5cbiAgICogQHJldHVybnMge09iamVjdH1cbiAgICovXG4gIHNlcmlhbGl6ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogdGhpcy50eXBlLFxuICAgICAgdXVpZDogdGhpcy51dWlkLFxuICAgICAgY29vcmRpbmF0ZXM6IHRoaXMuY29vcmRpbmF0ZXMsXG4gICAgICBpbmRleDogdGhpcy5pbmRleCxcbiAgICAgIGxhYmVsOiB0aGlzLmxhYmVsLFxuICAgICAgYWN0aXZpdGllczogdGhpcy5hY3Rpdml0aWVzLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogRGVzdHJveSB0aGUgY2xpZW50LlxuICAgKi9cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLnNvY2tldC5yZW1vdmVBbGxMaXN0ZW5lcnMoKTtcbiAgICB0aGlzLnV1aWQgPSBudWxsO1xuICB9XG59XG4iXX0=