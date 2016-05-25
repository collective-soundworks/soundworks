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

var _Activity2 = require('../core/Activity');

var _Activity3 = _interopRequireDefault(_Activity2);

var _server = require('../core/server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var Experience = function (_Activity) {
  (0, _inherits3.default)(Experience, _Activity);

  /**
   * Creates an instance of the class.
   * @param {String} clientType - The client type the experience should be
   *  mapped to. _(note: is used as the id of the activity)_
   */

  function Experience() {
    var clientType = arguments.length <= 0 || arguments[0] === undefined ? _server2.default.config.defaultClientType : arguments[0];
    (0, _classCallCheck3.default)(this, Experience);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Experience).call(this, 'experience'));

    _this.addClientType(clientType);

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

      (0, _get3.default)((0, _getPrototypeOf2.default)(Experience.prototype), 'connect', this).call(this, client);

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
      (0, _get3.default)((0, _getPrototypeOf2.default)(Experience.prototype), 'disconnect', this).call(this, client);

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
}(_Activity3.default);

exports.default = Experience;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV4cGVyaWVuY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBY3FCLFU7Ozs7Ozs7OztBQU1uQix3QkFBMEQ7QUFBQSxRQUE5QyxVQUE4Qyx5REFBakMsaUJBQU8sTUFBUCxDQUFjLGlCQUFtQjtBQUFBOztBQUFBLG9IQUNsRCxZQURrRDs7QUFHeEQsVUFBSyxhQUFMLENBQW1CLFVBQW5COztBQUVBLFVBQUssY0FBTCxHQUFzQixNQUFLLE9BQUwsQ0FBYSxnQkFBYixDQUF0Qjs7Ozs7O0FBTUEsVUFBSyxPQUFMLEdBQWUsRUFBZjtBQVh3RDtBQVl6RDs7Ozs7Ozs7Ozs0QkFNTyxNLEVBQVE7QUFBQTs7QUFDZCwwR0FBYyxNQUFkOzs7QUFHQSxXQUFLLE9BQUwsQ0FBYSxNQUFiLEVBQXFCLE9BQXJCLEVBQThCO0FBQUEsZUFBTSxPQUFLLEtBQUwsQ0FBVyxNQUFYLENBQU47QUFBQSxPQUE5QjtBQUNBLFdBQUssT0FBTCxDQUFhLE1BQWIsRUFBcUIsTUFBckIsRUFBNkI7QUFBQSxlQUFNLE9BQUssSUFBTCxDQUFVLE1BQVYsQ0FBTjtBQUFBLE9BQTdCO0FBQ0Q7Ozs7Ozs7OzsrQkFNVSxNLEVBQVE7QUFDakIsNkdBQWlCLE1BQWpCOzs7QUFHQSxVQUFJLE9BQU8sVUFBUCxDQUFrQixLQUFLLEVBQXZCLEtBQThCLE9BQU8sVUFBUCxDQUFrQixLQUFLLEVBQXZCLEVBQTJCLE9BQTdELEVBQ0UsS0FBSyxJQUFMLENBQVUsTUFBVjtBQUNIOzs7Ozs7Ozs7MEJBTUssTSxFQUFROztBQUVaLFdBQUssT0FBTCxDQUFhLElBQWIsQ0FBa0IsTUFBbEI7O0FBRUEsYUFBTyxVQUFQLENBQWtCLEtBQUssRUFBdkIsRUFBMkIsT0FBM0IsR0FBcUMsSUFBckM7QUFDRDs7Ozs7Ozs7Ozs7eUJBUUksTSxFQUFROztBQUVYLFVBQU0sUUFBUSxLQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLE1BQXJCLENBQWQ7QUFDQSxVQUFJLFNBQVMsQ0FBYixFQUNFLEtBQUssT0FBTCxDQUFhLE1BQWIsQ0FBb0IsS0FBcEIsRUFBMkIsQ0FBM0I7OztBQUdGLGFBQU8sVUFBUCxDQUFrQixLQUFLLEVBQXZCLEVBQTJCLE9BQTNCLEdBQXFDLEtBQXJDO0FBQ0Q7Ozs7O2tCQXJFa0IsVSIsImZpbGUiOiJFeHBlcmllbmNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFjdGl2aXR5IGZyb20gJy4uL2NvcmUvQWN0aXZpdHknO1xuaW1wb3J0IHNlcnZlciBmcm9tICcuLi9jb3JlL3NlcnZlcic7XG5cblxuLyoqXG4gKiBCYXNlIGNsYXNzIHVzZWQgdG8gYnVpbGQgYSBleHBlcmllbmNlIG9uIHRoZSBzZXJ2ZXIgc2lkZS5cbiAqXG4gKiBBbG9uZyB3aXRoIHRoZSBjbGFzc2ljIHtAbGluayBzcmMvc2VydmVyL2NvcmUvQWN0aXZpdHkjY29ubmVjdH0gYW5kIHtAbGluayBzcmMvc2VydmVyL2NvcmUvQWN0aXZpdHkjZGlzY29ubmVjdH0gbWV0aG9kcywgdGhlIGJhc2UgY2xhc3MgaGFzIHR3byBhZGRpdGlvbmFsIG1ldGhvZHM6XG4gKiAtIHtAbGluayBFeHBlcmllbmNlI2VudGVyfTogY2FsbGVkIHdoZW4gdGhlIGNsaWVudCBlbnRlcnMgdGhlIGBFeHBlcmllbmNlYCAoKmkuZS4qIHdoZW4gdGhlIHtAbGluayBzcmMvY2xpZW50L3NjZW5lL0V4cGVyaWVuY2UuanN+RXhwZXJpZW5jZX0gb24gdGhlIGNsaWVudCBzaWRlIGNhbGxzIGl0cyB7QGxpbmsgc3JjL2NsaWVudC9zY2VuZS9FeHBlcmllbmNlLmpzfkV4cGVyaWVuY2Ujc3RhcnR9IG1ldGhvZCk7XG4gKiAtIHtAbGluayBFeHBlcmllbmNlI2V4aXR9OiBjYWxsZWQgd2hlbiB0aGUgY2xpZW50IGxlYXZlcyB0aGUgYEV4cGVyaWVuY2VgICgqaS5lLiogd2hlbiB0aGUge0BsaW5rIHNyYy9jbGllbnQvc2NlbmUvRXhwZXJpZW5jZS5qc35FeHBlcmllbmNlfSBvbiB0aGUgY2xpZW50IHNpZGUgY2FsbHMgaXRzIHtAbGluayBzcmMvY2xpZW50L3NjZW5lL0V4cGVyaWVuY2UuanN+RXhwZXJpZW5jZSNkb25lfSBtZXRob2QsIG9yIGlmIHRoZSBjbGllbnQgZGlzY29ubmVjdGVkIGZyb20gdGhlIHNlcnZlcikuXG4gKlxuICogVGhlIGJhc2UgY2xhc3MgYWxzbyBrZWVwcyB0cmFjayBvZiB0aGUgY2xpZW50cyB3aG8gYXJlIGN1cnJlbnRseSBpbiB0aGUgcGVyZm9ybWFuY2UgKCppLmUuKiB3aG8gZW50ZXJlZCBidXQgbm90IGV4aXRlZCB5ZXQpIGluIHRoZSBhcnJheSBgdGhpcy5jbGllbnRzYC5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9jbGllbnQvc2NlbmUvRXhwZXJpZW5jZS5qc35FeHBlcmllbmNlfSBvbiB0aGUgY2xpZW50IHNpZGUuKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFeHBlcmllbmNlIGV4dGVuZHMgQWN0aXZpdHkge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiB0aGUgY2xhc3MuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjbGllbnRUeXBlIC0gVGhlIGNsaWVudCB0eXBlIHRoZSBleHBlcmllbmNlIHNob3VsZCBiZVxuICAgKiAgbWFwcGVkIHRvLiBfKG5vdGU6IGlzIHVzZWQgYXMgdGhlIGlkIG9mIHRoZSBhY3Rpdml0eSlfXG4gICAqL1xuICBjb25zdHJ1Y3RvcihjbGllbnRUeXBlID0gc2VydmVyLmNvbmZpZy5kZWZhdWx0Q2xpZW50VHlwZSkge1xuICAgIHN1cGVyKCdleHBlcmllbmNlJyk7XG5cbiAgICB0aGlzLmFkZENsaWVudFR5cGUoY2xpZW50VHlwZSk7XG5cbiAgICB0aGlzLl9lcnJvclJlcG9ydGVyID0gdGhpcy5yZXF1aXJlKCdlcnJvci1yZXBvcnRlcicpO1xuXG4gICAgLyoqXG4gICAgICogTGlzdCBvZiB0aGUgY2xpZW50cyB3aG8gYXJlIGN1cnJlbnRseSBpbiB0aGUgcGVyZm9ybWFuY2UgKCppLmUuKiB3aG8gZW50ZXJlZCB0aGUgcGVyZm9ybWFuY2UgYW5kIGhhdmUgbm90IGV4aXRlZCBpdCB5ZXQpLlxuICAgICAqIEB0eXBlIHtDbGllbnRbXX1cbiAgICAgKi9cbiAgICB0aGlzLmNsaWVudHMgPSBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgY2xpZW50IGNvbm5lY3RzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgQ29ubmVjdGVkIGNsaWVudC5cbiAgICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgLy8gTGlzdGVuIGZvciB0aGUgYCdlbnRlcidgIGFuZCBgJ2V4aXQnYCBzb2NrZXQgbWVzc2FnZXMgZnJvbSB0aGUgY2xpZW50LlxuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdlbnRlcicsICgpID0+IHRoaXMuZW50ZXIoY2xpZW50KSk7XG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ2V4aXQnLCAoKSA9PiB0aGlzLmV4aXQoY2xpZW50KSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGNsaWVudCBkaXNjb25uZWN0cyBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgRGlzY29ubmVjdGVkIGNsaWVudC5cbiAgICovXG4gIGRpc2Nvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuZGlzY29ubmVjdChjbGllbnQpO1xuXG4gICAgLy8gQ2FsbCB0aGUgYGV4aXRgIG1ldGhvZCBpZiB0aGUgY2xpZW50IHByZXZpb3VzbHkgZW50ZXJlZCB0aGUgcGVyZm9ybWFuY2UuXG4gICAgaWYgKGNsaWVudC5hY3Rpdml0aWVzW3RoaXMuaWRdICYmIGNsaWVudC5hY3Rpdml0aWVzW3RoaXMuaWRdLmVudGVyZWQpXG4gICAgICB0aGlzLmV4aXQoY2xpZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgY2xpZW50IHN0YXJ0cyB0aGUgcGVyZm9ybWFuY2Ugb24gdGhlIGNsaWVudCBzaWRlLlxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IENsaWVudCB3aG8gZW50ZXJzIHRoZSBwZXJmb3JtYW5jZS5cbiAgICovXG4gIGVudGVyKGNsaWVudCkge1xuICAgIC8vIGFkZCB0aGUgY2xpZW50IHRvIHRoZSBgdGhpcy5jbGllbnRzYCBhcnJheVxuICAgIHRoaXMuY2xpZW50cy5wdXNoKGNsaWVudCk7XG4gICAgLy8gc2V0IGZsYWdcbiAgICBjbGllbnQuYWN0aXZpdGllc1t0aGlzLmlkXS5lbnRlcmVkID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgY2xpZW50IGV4aXRzIHRoZSBwZXJmb3JtYW5jZSBvbiB0aGUgY2xpZW50IHNpZGUgKCppLmUuKlxuICAgKiB3aGVuIHRoZSBgZG9uZWAgbWV0aG9kIG9mIHRoZSBjbGllbnQgc2lkZSBleHBlcmllbmNlIGlzIGNhbGxlZCwgb3Igd2hlblxuICAgKiB0aGUgY2xpZW50IGRpc2Nvbm5lY3RzIGZyb20gdGhlIHNlcnZlcikuXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgLSBDbGllbnQgd2hvIGV4aXRzIHRoZSBwZXJmb3JtYW5jZS5cbiAgICovXG4gIGV4aXQoY2xpZW50KSB7XG4gICAgLy8gUmVtb3ZlIHRoZSBjbGllbnQgZnJvbSB0aGUgYHRoaXMuY2xpZW50c2AgYXJyYXkuXG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmNsaWVudHMuaW5kZXhPZihjbGllbnQpO1xuICAgIGlmIChpbmRleCA+PSAwKVxuICAgICAgdGhpcy5jbGllbnRzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICAvLyBSZW1vdmUgZmxhZy5cbiAgICBjbGllbnQuYWN0aXZpdGllc1t0aGlzLmlkXS5lbnRlcmVkID0gZmFsc2U7XG4gIH1cbn1cbiJdfQ==