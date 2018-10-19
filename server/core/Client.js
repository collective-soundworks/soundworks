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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNsaWVudC5qcyJdLCJuYW1lcyI6WyJDbGllbnQiLCJjbGllbnRUeXBlIiwic29ja2V0IiwidHlwZSIsInV1aWQiLCJ2NCIsImNvb3JkaW5hdGVzIiwiZ2VvcG9zaXRpb24iLCJpbmRleCIsImxhYmVsIiwiYWN0aXZpdGllcyIsInJlbW92ZUFsbExpc3RlbmVycyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBRUE7Ozs7O0lBS01BLE07QUFDTDs7Ozs7QUFLQSxrQkFBWUMsVUFBWixFQUF3QkMsTUFBeEIsRUFBZ0M7QUFBQTs7QUFDL0I7Ozs7Ozs7QUFPRSxTQUFLQyxJQUFMLEdBQVlGLFVBQVo7O0FBRUY7Ozs7Ozs7QUFPRSxTQUFLRyxJQUFMLEdBQVlBLGVBQUtDLEVBQUwsRUFBWjs7QUFFRjs7Ozs7OztBQU9FLFNBQUtDLFdBQUwsR0FBbUIsSUFBbkI7O0FBRUE7Ozs7Ozs7QUFPQSxTQUFLQyxXQUFMLEdBQW1CLElBQW5COztBQUVBOzs7Ozs7O0FBT0EsU0FBS0MsS0FBTCxHQUFhLElBQWI7O0FBRUE7Ozs7Ozs7QUFPQSxTQUFLQyxLQUFMLEdBQWEsSUFBYjs7QUFFRjs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkUsU0FBS0MsVUFBTCxHQUFrQixFQUFsQjs7QUFFRjs7Ozs7QUFLRSxTQUFLUixNQUFMLEdBQWNBLE1BQWQ7QUFDRDs7QUFFRDs7Ozs7Ozs7Z0NBSVk7QUFDVixhQUFPO0FBQ0xDLGNBQU0sS0FBS0EsSUFETjtBQUVMQyxjQUFNLEtBQUtBLElBRk47QUFHTEUscUJBQWEsS0FBS0EsV0FIYjtBQUlMRSxlQUFPLEtBQUtBLEtBSlA7QUFLTEMsZUFBTyxLQUFLQSxLQUxQO0FBTUxDLG9CQUFZLEtBQUtBO0FBTlosT0FBUDtBQVFEOztBQUVEOzs7Ozs7OEJBR1U7QUFDUixXQUFLUixNQUFMLENBQVlTLGtCQUFaO0FBQ0EsV0FBS1AsSUFBTCxHQUFZLElBQVo7QUFDRDs7Ozs7a0JBR1lKLE0iLCJmaWxlIjoiQ2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHV1aWQgZnJvbSAndXVpZCc7XG5cbi8qKlxuICogU2VydmVyIHNpZGUgcmVwcmVzZW50YXRpb24gb2YgYSBjbGllbnQuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlclxuICovXG5jbGFzcyBDbGllbnQge1xuXHQvKipcblx0ICogQHBhcmFtIHtTdHJpbmd9IGNsaWVudFR5cGUgLSBDbGllbnQgdHlwZSBvZiB0aGUgY29ubmVjdGVkIGNsaWVudC5cblx0ICogQHBhcmFtIHtTb2NrZXR9IHNvY2tldCAtIFNvY2tldCBvYmplY3QgdXNlZCB0byBjb21taW51YXRlIHdpdGggdGhlIGNsaWVudC5cblx0ICogQHByaXZhdGVcblx0ICovXG5cdGNvbnN0cnVjdG9yKGNsaWVudFR5cGUsIHNvY2tldCkge1xuXHRcdC8qKlxuXHRcdCAqIENsaWVudCB0eXBlIChzcGVjaWZpZWQgd2hlbiBpbml0aWFsaXppbmcgdGhlIHtAbGluayBjbGllbnR9IG9iamVjdCBvbiB0aGUgY2xpZW50IHNpZGUgd2l0aCB7QGxpbmsgY2xpZW50LmluaXR9KS5cblx0XHQgKiBAbmFtZSB0eXBlXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLkNsaWVudFxuICAgICAqIEBpbnN0YW5jZVxuXHRcdCAqL1xuICAgIHRoaXMudHlwZSA9IGNsaWVudFR5cGU7XG5cblx0XHQvKipcblx0XHQgKiBJbmRleCBvZiB0aGUgY2xpZW50LlxuXHRcdCAqIEBuYW1lIHV1aWRcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuQ2xpZW50XG4gICAgICogQGluc3RhbmNlXG5cdFx0ICovXG4gICAgdGhpcy51dWlkID0gdXVpZC52NCgpO1xuXG5cdFx0LyoqXG5cdFx0ICogQ29vcmRpbmF0ZXMgb2YgdGhlIGNsaWVudCwgc3RvcmVkIGFzIGFuIGBbeDpOdW1iZXIsIHk6TnVtYmVyXWAgYXJyYXkuXG5cdFx0ICogQG5hbWUgY29vcmRpbmF0ZXNcbiAgICAgKiBAdHlwZSB7QXJyYXk8TnVtYmVyPn1cbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLkNsaWVudFxuICAgICAqIEBpbnN0YW5jZVxuXHRcdCAqL1xuICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogR2VvcG9zaXRpb24gb2YgdGhlIGNsaWVudCBhcyByZXR1cm5lZCBieSBgZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uYFxuICAgICAqIEBuYW1lIGdlb3Bvc2l0aW9uXG4gICAgICogQHR5cCB7T2JqZWN0fVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuQ2xpZW50XG4gICAgICogQGluc3RhbmNlXG4gICAgICovXG4gICAgdGhpcy5nZW9wb3NpdGlvbiA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBUaWNrZXQgaW5kZXggb2YgdGhlIGNsaWVudC5cbiAgICAgKiBAbmFtZSBpbmRleFxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5DbGllbnRcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKi9cbiAgICB0aGlzLmluZGV4ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFRpY2tldCBsYWJlbCBvZiB0aGUgY2xpZW50LlxuICAgICAqIEBuYW1lIGxhYmVsXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLkNsaWVudFxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqL1xuICAgIHRoaXMubGFiZWwgPSBudWxsO1xuXG5cdFx0LyoqXG5cdFx0ICogVXNlZCBieSB0aGUgYWN0aXZpdGllcyB0byBhc3NvY2lhdGUgZGF0YSB0byBhIHBhcnRpY3VsYXIgY2xpZW50LlxuXHRcdCAqXG5cdFx0ICogQWxsIHRoZSBkYXRhIGFzc29jaWF0ZWQgd2l0aCBhIGFjdGl2aXR5IHdob3NlIGBuYW1lYCBpcyBgJ2FjdGl2aXR5TmFtZSdgXG4gICAgICogaXMgYWNjZXNzaWJsZSB0aHJvdWdoIHRoZSBrZXkgYGFjdGl2aXR5TmFtZWAuXG5cdFx0ICogRm9yIGluc3RhbmNlLCB0aGUge0BsaW5rIHNyYy9zZXJ2ZXIvQ2hlY2tpbi5qc35DaGVja2lufSBhY3Rpdml0eSBrZWVwc1xuICAgICAqIHRyYWNrIG9mIGNsaWVudCdzIGNoZWNraW4gaW5kZXggYW5kIGxhYmVsIGluIGB0aGlzLmFjdGl2aXRpZXMuY2hlY2tpbi5pbmRleGBcbiAgICAgKiBhbmQgYHRoaXMuYWN0aXZpdGllcy5jaGVja2luLmxhYmVsYC5cblx0XHQgKiBTaW1pbGFybHksIGEge0BsaW5rIHNyYy9zZXJ2ZXIvUGVyZm9ybWFuY2UuanN+UGVyZm9ybWFuY2V9IGFjdGl2aXR5IHdob3NlXG4gICAgICogbmFtZSBpcyBgJ215UGVyZm9ybWFuY2UnYCBjb3VsZCByZXBvcnQgdGhlIGNsaWVudCdzIHN0YXR1cyBpblxuICAgICAqIGB0aGlzLmFjdGl2aXRpZXMubXlQZXJmb3JtYW5jZS5zdGF0dXNgLlxuXHRcdCAqXG4gICAgICogQG5hbWUgYWN0aXZpdGllc1xuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5DbGllbnRcbiAgICAgKiBAaW5zdGFuY2Vcblx0XHQgKi9cbiAgICB0aGlzLmFjdGl2aXRpZXMgPSB7fTtcblxuXHRcdC8qKlxuXHRcdCAqIFNvY2tldCB1c2VkIHRvIGNvbW11bmljYXRlIHdpdGggdGhlIGNsaWVudC5cblx0XHQgKiBAdHlwZSB7U29ja2V0fVxuXHRcdCAqIEBwcml2YXRlXG5cdFx0ICovXG4gICAgdGhpcy5zb2NrZXQgPSBzb2NrZXQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIGxpZ2h0d2VpZ2h0IHZlcnNpb24gb2YgdGhlIGRhdGEgZGVmaW5pbmcgdGhlIGNsaWVudC5cbiAgICogQHJldHVybnMge09iamVjdH1cbiAgICovXG4gIHNlcmlhbGl6ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogdGhpcy50eXBlLFxuICAgICAgdXVpZDogdGhpcy51dWlkLFxuICAgICAgY29vcmRpbmF0ZXM6IHRoaXMuY29vcmRpbmF0ZXMsXG4gICAgICBpbmRleDogdGhpcy5pbmRleCxcbiAgICAgIGxhYmVsOiB0aGlzLmxhYmVsLFxuICAgICAgYWN0aXZpdGllczogdGhpcy5hY3Rpdml0aWVzLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogRGVzdHJveSB0aGUgY2xpZW50LlxuICAgKi9cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLnNvY2tldC5yZW1vdmVBbGxMaXN0ZW5lcnMoKTtcbiAgICB0aGlzLnV1aWQgPSBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENsaWVudDtcbiJdfQ==