'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _Scene2 = require('../core/Scene');

var _Scene3 = _interopRequireDefault(_Scene2);

var _server = require('../core/server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SCENE_ID = 'experience';

/**
 * Base class used to build a experience on the server side.
 *
 * Along with the classic {@link src/server/core/Activity#connect} and {@link src/server/core/Activity#disconnect} methods, the base class has two additional methods:
 * - {@link Experience#enter}: called when the client enters the `Experience` (*i.e.* when the {@link src/client/scene/Experience.js~Experience} on the client side calls its {@link src/client/scene/Experience.js~Experience#start} method);
 * - {@link Experience#exit}: called when the client leaves the `Experience` (*i.e.* when the {@link src/client/scene/Experience.js~Experience} on the client side calls its {@link src/client/scene/Experience.js~Experience#done} method, or if the client disconnected from the server).
 *
 * The base class also keeps track of the clients who are currently in the performance (*i.e.* who entered but not exited yet) in the array `this.clients`.
 *
 * (See also {@link src/client/scene/Experience.js~Experience} on the client side.)
 */

var Experience = function (_Scene) {
  (0, _inherits3.default)(Experience, _Scene);

  /**
   * Creates an instance of the class.
   * @param {String} clientType - The client type the experience should be
   *  mapped to. _(note: is used as the id of the activity)_
   */
  function Experience() {
    var clientType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _server2.default.config.defaultClientType;
    (0, _classCallCheck3.default)(this, Experience);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Experience.__proto__ || (0, _getPrototypeOf2.default)(Experience)).call(this, SCENE_ID, clientType));

    _this._errorReporter = _this.require('error-reporter');

    /**
     * List of the clients who are currently in the performance (*i.e.* who entered the performance and have not exited it yet).
     * @type {Client[]}
     */
    _this.clients = [];
    return _this;
  }

  /**
   * Called when the client connects to the server.
   * @param {Client} client Connected client.
   */


  (0, _createClass3.default)(Experience, [{
    key: 'connect',
    value: function connect(client) {
      var _this2 = this;

      (0, _get3.default)(Experience.prototype.__proto__ || (0, _getPrototypeOf2.default)(Experience.prototype), 'connect', this).call(this, client);

      // Listen for the `'enter'` and `'exit'` socket messages from the client.
      this.receive(client, 'enter', function () {
        return _this2.enter(client);
      });
      this.receive(client, 'exit', function () {
        return _this2.exit(client);
      });
    }

    /**
     * Called when the client disconnects from the server.
     * @param {Client} client Disconnected client.
     */

  }, {
    key: 'disconnect',
    value: function disconnect(client) {
      (0, _get3.default)(Experience.prototype.__proto__ || (0, _getPrototypeOf2.default)(Experience.prototype), 'disconnect', this).call(this, client);

      // Call the `exit` method if the client previously entered the performance.
      if (client.activities[this.id] && client.activities[this.id].entered) this.exit(client);
    }

    /**
     * Called when the client starts the performance on the client side.
     * @param {Client} client Client who enters the performance.
     */

  }, {
    key: 'enter',
    value: function enter(client) {
      // add the client to the `this.clients` array
      this.clients.push(client);
      // set flag
      client.activities[this.id].entered = true;
    }

    /**
     * Called when the client exits the performance on the client side (*i.e.*
     * when the `done` method of the client side experience is called, or when
     * the client disconnects from the server).
     * @param {Client} client - Client who exits the performance.
     */

  }, {
    key: 'exit',
    value: function exit(client) {
      // Remove the client from the `this.clients` array.
      var index = this.clients.indexOf(client);
      if (index >= 0) this.clients.splice(index, 1);

      // Remove flag.
      client.activities[this.id].entered = false;
    }
  }]);
  return Experience;
}(_Scene3.default);

exports.default = Experience;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV4cGVyaWVuY2UuanMiXSwibmFtZXMiOlsiU0NFTkVfSUQiLCJFeHBlcmllbmNlIiwiY2xpZW50VHlwZSIsImNvbmZpZyIsImRlZmF1bHRDbGllbnRUeXBlIiwiX2Vycm9yUmVwb3J0ZXIiLCJyZXF1aXJlIiwiY2xpZW50cyIsImNsaWVudCIsInJlY2VpdmUiLCJlbnRlciIsImV4aXQiLCJhY3Rpdml0aWVzIiwiaWQiLCJlbnRlcmVkIiwicHVzaCIsImluZGV4IiwiaW5kZXhPZiIsInNwbGljZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsV0FBVyxZQUFqQjs7QUFFQTs7Ozs7Ozs7Ozs7O0lBV3FCQyxVOzs7QUFDbkI7Ozs7O0FBS0Esd0JBQTBEO0FBQUEsUUFBOUNDLFVBQThDLHVFQUFqQyxpQkFBT0MsTUFBUCxDQUFjQyxpQkFBbUI7QUFBQTs7QUFBQSw4SUFDbERKLFFBRGtELEVBQ3hDRSxVQUR3Qzs7QUFHeEQsVUFBS0csY0FBTCxHQUFzQixNQUFLQyxPQUFMLENBQWEsZ0JBQWIsQ0FBdEI7O0FBRUE7Ozs7QUFJQSxVQUFLQyxPQUFMLEdBQWUsRUFBZjtBQVR3RDtBQVV6RDs7QUFFRDs7Ozs7Ozs7NEJBSVFDLE0sRUFBUTtBQUFBOztBQUNkLDRJQUFjQSxNQUFkOztBQUVBO0FBQ0EsV0FBS0MsT0FBTCxDQUFhRCxNQUFiLEVBQXFCLE9BQXJCLEVBQThCO0FBQUEsZUFBTSxPQUFLRSxLQUFMLENBQVdGLE1BQVgsQ0FBTjtBQUFBLE9BQTlCO0FBQ0EsV0FBS0MsT0FBTCxDQUFhRCxNQUFiLEVBQXFCLE1BQXJCLEVBQTZCO0FBQUEsZUFBTSxPQUFLRyxJQUFMLENBQVVILE1BQVYsQ0FBTjtBQUFBLE9BQTdCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7K0JBSVdBLE0sRUFBUTtBQUNqQiwrSUFBaUJBLE1BQWpCOztBQUVBO0FBQ0EsVUFBSUEsT0FBT0ksVUFBUCxDQUFrQixLQUFLQyxFQUF2QixLQUE4QkwsT0FBT0ksVUFBUCxDQUFrQixLQUFLQyxFQUF2QixFQUEyQkMsT0FBN0QsRUFDRSxLQUFLSCxJQUFMLENBQVVILE1BQVY7QUFDSDs7QUFFRDs7Ozs7OzswQkFJTUEsTSxFQUFRO0FBQ1o7QUFDQSxXQUFLRCxPQUFMLENBQWFRLElBQWIsQ0FBa0JQLE1BQWxCO0FBQ0E7QUFDQUEsYUFBT0ksVUFBUCxDQUFrQixLQUFLQyxFQUF2QixFQUEyQkMsT0FBM0IsR0FBcUMsSUFBckM7QUFDRDs7QUFFRDs7Ozs7Ozs7O3lCQU1LTixNLEVBQVE7QUFDWDtBQUNBLFVBQU1RLFFBQVEsS0FBS1QsT0FBTCxDQUFhVSxPQUFiLENBQXFCVCxNQUFyQixDQUFkO0FBQ0EsVUFBSVEsU0FBUyxDQUFiLEVBQ0UsS0FBS1QsT0FBTCxDQUFhVyxNQUFiLENBQW9CRixLQUFwQixFQUEyQixDQUEzQjs7QUFFRjtBQUNBUixhQUFPSSxVQUFQLENBQWtCLEtBQUtDLEVBQXZCLEVBQTJCQyxPQUEzQixHQUFxQyxLQUFyQztBQUNEOzs7OztrQkFuRWtCYixVIiwiZmlsZSI6IkV4cGVyaWVuY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2NlbmUgZnJvbSAnLi4vY29yZS9TY2VuZSc7XG5pbXBvcnQgc2VydmVyIGZyb20gJy4uL2NvcmUvc2VydmVyJztcblxuY29uc3QgU0NFTkVfSUQgPSAnZXhwZXJpZW5jZSc7XG5cbi8qKlxuICogQmFzZSBjbGFzcyB1c2VkIHRvIGJ1aWxkIGEgZXhwZXJpZW5jZSBvbiB0aGUgc2VydmVyIHNpZGUuXG4gKlxuICogQWxvbmcgd2l0aCB0aGUgY2xhc3NpYyB7QGxpbmsgc3JjL3NlcnZlci9jb3JlL0FjdGl2aXR5I2Nvbm5lY3R9IGFuZCB7QGxpbmsgc3JjL3NlcnZlci9jb3JlL0FjdGl2aXR5I2Rpc2Nvbm5lY3R9IG1ldGhvZHMsIHRoZSBiYXNlIGNsYXNzIGhhcyB0d28gYWRkaXRpb25hbCBtZXRob2RzOlxuICogLSB7QGxpbmsgRXhwZXJpZW5jZSNlbnRlcn06IGNhbGxlZCB3aGVuIHRoZSBjbGllbnQgZW50ZXJzIHRoZSBgRXhwZXJpZW5jZWAgKCppLmUuKiB3aGVuIHRoZSB7QGxpbmsgc3JjL2NsaWVudC9zY2VuZS9FeHBlcmllbmNlLmpzfkV4cGVyaWVuY2V9IG9uIHRoZSBjbGllbnQgc2lkZSBjYWxscyBpdHMge0BsaW5rIHNyYy9jbGllbnQvc2NlbmUvRXhwZXJpZW5jZS5qc35FeHBlcmllbmNlI3N0YXJ0fSBtZXRob2QpO1xuICogLSB7QGxpbmsgRXhwZXJpZW5jZSNleGl0fTogY2FsbGVkIHdoZW4gdGhlIGNsaWVudCBsZWF2ZXMgdGhlIGBFeHBlcmllbmNlYCAoKmkuZS4qIHdoZW4gdGhlIHtAbGluayBzcmMvY2xpZW50L3NjZW5lL0V4cGVyaWVuY2UuanN+RXhwZXJpZW5jZX0gb24gdGhlIGNsaWVudCBzaWRlIGNhbGxzIGl0cyB7QGxpbmsgc3JjL2NsaWVudC9zY2VuZS9FeHBlcmllbmNlLmpzfkV4cGVyaWVuY2UjZG9uZX0gbWV0aG9kLCBvciBpZiB0aGUgY2xpZW50IGRpc2Nvbm5lY3RlZCBmcm9tIHRoZSBzZXJ2ZXIpLlxuICpcbiAqIFRoZSBiYXNlIGNsYXNzIGFsc28ga2VlcHMgdHJhY2sgb2YgdGhlIGNsaWVudHMgd2hvIGFyZSBjdXJyZW50bHkgaW4gdGhlIHBlcmZvcm1hbmNlICgqaS5lLiogd2hvIGVudGVyZWQgYnV0IG5vdCBleGl0ZWQgeWV0KSBpbiB0aGUgYXJyYXkgYHRoaXMuY2xpZW50c2AuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvY2xpZW50L3NjZW5lL0V4cGVyaWVuY2UuanN+RXhwZXJpZW5jZX0gb24gdGhlIGNsaWVudCBzaWRlLilcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXhwZXJpZW5jZSBleHRlbmRzIFNjZW5lIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2xpZW50VHlwZSAtIFRoZSBjbGllbnQgdHlwZSB0aGUgZXhwZXJpZW5jZSBzaG91bGQgYmVcbiAgICogIG1hcHBlZCB0by4gXyhub3RlOiBpcyB1c2VkIGFzIHRoZSBpZCBvZiB0aGUgYWN0aXZpdHkpX1xuICAgKi9cbiAgY29uc3RydWN0b3IoY2xpZW50VHlwZSA9IHNlcnZlci5jb25maWcuZGVmYXVsdENsaWVudFR5cGUpIHtcbiAgICBzdXBlcihTQ0VORV9JRCwgY2xpZW50VHlwZSk7XG5cbiAgICB0aGlzLl9lcnJvclJlcG9ydGVyID0gdGhpcy5yZXF1aXJlKCdlcnJvci1yZXBvcnRlcicpO1xuXG4gICAgLyoqXG4gICAgICogTGlzdCBvZiB0aGUgY2xpZW50cyB3aG8gYXJlIGN1cnJlbnRseSBpbiB0aGUgcGVyZm9ybWFuY2UgKCppLmUuKiB3aG8gZW50ZXJlZCB0aGUgcGVyZm9ybWFuY2UgYW5kIGhhdmUgbm90IGV4aXRlZCBpdCB5ZXQpLlxuICAgICAqIEB0eXBlIHtDbGllbnRbXX1cbiAgICAgKi9cbiAgICB0aGlzLmNsaWVudHMgPSBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgY2xpZW50IGNvbm5lY3RzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgQ29ubmVjdGVkIGNsaWVudC5cbiAgICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgLy8gTGlzdGVuIGZvciB0aGUgYCdlbnRlcidgIGFuZCBgJ2V4aXQnYCBzb2NrZXQgbWVzc2FnZXMgZnJvbSB0aGUgY2xpZW50LlxuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdlbnRlcicsICgpID0+IHRoaXMuZW50ZXIoY2xpZW50KSk7XG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ2V4aXQnLCAoKSA9PiB0aGlzLmV4aXQoY2xpZW50KSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGNsaWVudCBkaXNjb25uZWN0cyBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgRGlzY29ubmVjdGVkIGNsaWVudC5cbiAgICovXG4gIGRpc2Nvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuZGlzY29ubmVjdChjbGllbnQpO1xuXG4gICAgLy8gQ2FsbCB0aGUgYGV4aXRgIG1ldGhvZCBpZiB0aGUgY2xpZW50IHByZXZpb3VzbHkgZW50ZXJlZCB0aGUgcGVyZm9ybWFuY2UuXG4gICAgaWYgKGNsaWVudC5hY3Rpdml0aWVzW3RoaXMuaWRdICYmIGNsaWVudC5hY3Rpdml0aWVzW3RoaXMuaWRdLmVudGVyZWQpXG4gICAgICB0aGlzLmV4aXQoY2xpZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgY2xpZW50IHN0YXJ0cyB0aGUgcGVyZm9ybWFuY2Ugb24gdGhlIGNsaWVudCBzaWRlLlxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IENsaWVudCB3aG8gZW50ZXJzIHRoZSBwZXJmb3JtYW5jZS5cbiAgICovXG4gIGVudGVyKGNsaWVudCkge1xuICAgIC8vIGFkZCB0aGUgY2xpZW50IHRvIHRoZSBgdGhpcy5jbGllbnRzYCBhcnJheVxuICAgIHRoaXMuY2xpZW50cy5wdXNoKGNsaWVudCk7XG4gICAgLy8gc2V0IGZsYWdcbiAgICBjbGllbnQuYWN0aXZpdGllc1t0aGlzLmlkXS5lbnRlcmVkID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgY2xpZW50IGV4aXRzIHRoZSBwZXJmb3JtYW5jZSBvbiB0aGUgY2xpZW50IHNpZGUgKCppLmUuKlxuICAgKiB3aGVuIHRoZSBgZG9uZWAgbWV0aG9kIG9mIHRoZSBjbGllbnQgc2lkZSBleHBlcmllbmNlIGlzIGNhbGxlZCwgb3Igd2hlblxuICAgKiB0aGUgY2xpZW50IGRpc2Nvbm5lY3RzIGZyb20gdGhlIHNlcnZlcikuXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgLSBDbGllbnQgd2hvIGV4aXRzIHRoZSBwZXJmb3JtYW5jZS5cbiAgICovXG4gIGV4aXQoY2xpZW50KSB7XG4gICAgLy8gUmVtb3ZlIHRoZSBjbGllbnQgZnJvbSB0aGUgYHRoaXMuY2xpZW50c2AgYXJyYXkuXG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmNsaWVudHMuaW5kZXhPZihjbGllbnQpO1xuICAgIGlmIChpbmRleCA+PSAwKVxuICAgICAgdGhpcy5jbGllbnRzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICAvLyBSZW1vdmUgZmxhZy5cbiAgICBjbGllbnQuYWN0aXZpdGllc1t0aGlzLmlkXS5lbnRlcmVkID0gZmFsc2U7XG4gIH1cbn1cbiJdfQ==