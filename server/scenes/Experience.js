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
      if (client.activities[this.id].entered) this.exit(client);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV4cGVyaWVuY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBY3FCOzs7Ozs7Ozs7QUFNbkIsV0FObUIsVUFNbkIsR0FBc0c7UUFBOUMsbUVBQWEsaUJBQU8sTUFBUCxDQUFjLGlCQUFkLGdCQUFpQzt3Q0FObkYsWUFNbUY7OzZGQU5uRix1QkFPWCxlQUQ4Rjs7QUFHcEcsVUFBSyxhQUFMLENBQW1CLFVBQW5CLEVBSG9HOztBQUtwRyxVQUFLLGNBQUwsR0FBc0IsTUFBSyxPQUFMLENBQWEsZ0JBQWIsQ0FBdEI7Ozs7OztBQUxvRyxTQVdwRyxDQUFLLE9BQUwsR0FBZSxFQUFmLENBWG9HOztHQUF0Rzs7Ozs7Ozs7NkJBTm1COzs0QkF3QlgsUUFBUTs7O0FBQ2QsdURBekJpQixtREF5QkgsT0FBZDs7O0FBRGMsVUFJZCxDQUFLLE9BQUwsQ0FBYSxNQUFiLEVBQXFCLE9BQXJCLEVBQThCO2VBQU0sT0FBSyxLQUFMLENBQVcsTUFBWDtPQUFOLENBQTlCLENBSmM7QUFLZCxXQUFLLE9BQUwsQ0FBYSxNQUFiLEVBQXFCLE1BQXJCLEVBQTZCO2VBQU0sT0FBSyxJQUFMLENBQVUsTUFBVjtPQUFOLENBQTdCLENBTGM7Ozs7Ozs7Ozs7K0JBWUwsUUFBUTtBQUNqQix1REFyQ2lCLHNEQXFDQSxPQUFqQjs7O0FBRGlCLFVBSWIsT0FBTyxVQUFQLENBQWtCLEtBQUssRUFBTCxDQUFsQixDQUEyQixPQUEzQixFQUNGLEtBQUssSUFBTCxDQUFVLE1BQVYsRUFERjs7Ozs7Ozs7OzswQkFRSSxRQUFROztBQUVaLFdBQUssT0FBTCxDQUFhLElBQWIsQ0FBa0IsTUFBbEI7O0FBRlksWUFJWixDQUFPLFVBQVAsQ0FBa0IsS0FBSyxFQUFMLENBQWxCLENBQTJCLE9BQTNCLEdBQXFDLElBQXJDLENBSlk7Ozs7Ozs7Ozs7Ozt5QkFhVCxRQUFROztBQUVYLFVBQU0sUUFBUSxLQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLE1BQXJCLENBQVIsQ0FGSztBQUdYLFVBQUksU0FBUyxDQUFULEVBQ0YsS0FBSyxPQUFMLENBQWEsTUFBYixDQUFvQixLQUFwQixFQUEyQixDQUEzQixFQURGOzs7QUFIVyxZQU9YLENBQU8sVUFBUCxDQUFrQixLQUFLLEVBQUwsQ0FBbEIsQ0FBMkIsT0FBM0IsR0FBcUMsS0FBckMsQ0FQVzs7O1NBN0RNIiwiZmlsZSI6IkV4cGVyaWVuY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWN0aXZpdHkgZnJvbSAnLi4vY29yZS9BY3Rpdml0eSc7XG5pbXBvcnQgc2VydmVyIGZyb20gJy4uL2NvcmUvc2VydmVyJztcblxuXG4vKipcbiAqIEJhc2UgY2xhc3MgdXNlZCB0byBidWlsZCBhIGV4cGVyaWVuY2Ugb24gdGhlIHNlcnZlciBzaWRlLlxuICpcbiAqIEFsb25nIHdpdGggdGhlIGNsYXNzaWMge0BsaW5rIHNyYy9zZXJ2ZXIvY29yZS9BY3Rpdml0eSNjb25uZWN0fSBhbmQge0BsaW5rIHNyYy9zZXJ2ZXIvY29yZS9BY3Rpdml0eSNkaXNjb25uZWN0fSBtZXRob2RzLCB0aGUgYmFzZSBjbGFzcyBoYXMgdHdvIGFkZGl0aW9uYWwgbWV0aG9kczpcbiAqIC0ge0BsaW5rIEV4cGVyaWVuY2UjZW50ZXJ9OiBjYWxsZWQgd2hlbiB0aGUgY2xpZW50IGVudGVycyB0aGUgYEV4cGVyaWVuY2VgICgqaS5lLiogd2hlbiB0aGUge0BsaW5rIHNyYy9jbGllbnQvc2NlbmUvRXhwZXJpZW5jZS5qc35FeHBlcmllbmNlfSBvbiB0aGUgY2xpZW50IHNpZGUgY2FsbHMgaXRzIHtAbGluayBzcmMvY2xpZW50L3NjZW5lL0V4cGVyaWVuY2UuanN+RXhwZXJpZW5jZSNzdGFydH0gbWV0aG9kKTtcbiAqIC0ge0BsaW5rIEV4cGVyaWVuY2UjZXhpdH06IGNhbGxlZCB3aGVuIHRoZSBjbGllbnQgbGVhdmVzIHRoZSBgRXhwZXJpZW5jZWAgKCppLmUuKiB3aGVuIHRoZSB7QGxpbmsgc3JjL2NsaWVudC9zY2VuZS9FeHBlcmllbmNlLmpzfkV4cGVyaWVuY2V9IG9uIHRoZSBjbGllbnQgc2lkZSBjYWxscyBpdHMge0BsaW5rIHNyYy9jbGllbnQvc2NlbmUvRXhwZXJpZW5jZS5qc35FeHBlcmllbmNlI2RvbmV9IG1ldGhvZCwgb3IgaWYgdGhlIGNsaWVudCBkaXNjb25uZWN0ZWQgZnJvbSB0aGUgc2VydmVyKS5cbiAqXG4gKiBUaGUgYmFzZSBjbGFzcyBhbHNvIGtlZXBzIHRyYWNrIG9mIHRoZSBjbGllbnRzIHdobyBhcmUgY3VycmVudGx5IGluIHRoZSBwZXJmb3JtYW5jZSAoKmkuZS4qIHdobyBlbnRlcmVkIGJ1dCBub3QgZXhpdGVkIHlldCkgaW4gdGhlIGFycmF5IGB0aGlzLmNsaWVudHNgLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL2NsaWVudC9zY2VuZS9FeHBlcmllbmNlLmpzfkV4cGVyaWVuY2V9IG9uIHRoZSBjbGllbnQgc2lkZS4pXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV4cGVyaWVuY2UgZXh0ZW5kcyBBY3Rpdml0eSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNsaWVudFR5cGUgLSBUaGUgY2xpZW50IHR5cGUgdGhlIGV4cGVyaWVuY2Ugc2hvdWxkIGJlXG4gICAqICBtYXBwZWQgdG8uIF8obm90ZTogaXMgdXNlZCBhcyB0aGUgaWQgb2YgdGhlIGFjdGl2aXR5KV9cbiAgICovXG4gIGNvbnN0cnVjdG9yKC8qIGlkID0gc2VydmVyLmNvbmZpZy5kZWZhdWx0Q2xpZW50VHlwZSwgKi8gY2xpZW50VHlwZSA9IHNlcnZlci5jb25maWcuZGVmYXVsdENsaWVudFR5cGUpIHtcbiAgICBzdXBlcignZXhwZXJpZW5jZScpO1xuXG4gICAgdGhpcy5hZGRDbGllbnRUeXBlKGNsaWVudFR5cGUpO1xuXG4gICAgdGhpcy5fZXJyb3JSZXBvcnRlciA9IHRoaXMucmVxdWlyZSgnZXJyb3ItcmVwb3J0ZXInKTtcblxuICAgIC8qKlxuICAgICAqIExpc3Qgb2YgdGhlIGNsaWVudHMgd2hvIGFyZSBjdXJyZW50bHkgaW4gdGhlIHBlcmZvcm1hbmNlICgqaS5lLiogd2hvIGVudGVyZWQgdGhlIHBlcmZvcm1hbmNlIGFuZCBoYXZlIG5vdCBleGl0ZWQgaXQgeWV0KS5cbiAgICAgKiBAdHlwZSB7Q2xpZW50W119XG4gICAgICovXG4gICAgdGhpcy5jbGllbnRzID0gW107XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGNsaWVudCBjb25uZWN0cyB0byB0aGUgc2VydmVyLlxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IENvbm5lY3RlZCBjbGllbnQuXG4gICAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIC8vIExpc3RlbiBmb3IgdGhlIGAnZW50ZXInYCBhbmQgYCdleGl0J2Agc29ja2V0IG1lc3NhZ2VzIGZyb20gdGhlIGNsaWVudC5cbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAnZW50ZXInLCAoKSA9PiB0aGlzLmVudGVyKGNsaWVudCkpO1xuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdleGl0JywgKCkgPT4gdGhpcy5leGl0KGNsaWVudCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBjbGllbnQgZGlzY29ubmVjdHMgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IERpc2Nvbm5lY3RlZCBjbGllbnQuXG4gICAqL1xuICBkaXNjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmRpc2Nvbm5lY3QoY2xpZW50KTtcblxuICAgIC8vIENhbGwgdGhlIGBleGl0YCBtZXRob2QgaWYgdGhlIGNsaWVudCBwcmV2aW91c2x5IGVudGVyZWQgdGhlIHBlcmZvcm1hbmNlLlxuICAgIGlmIChjbGllbnQuYWN0aXZpdGllc1t0aGlzLmlkXS5lbnRlcmVkKVxuICAgICAgdGhpcy5leGl0KGNsaWVudCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGNsaWVudCBzdGFydHMgdGhlIHBlcmZvcm1hbmNlIG9uIHRoZSBjbGllbnQgc2lkZS5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCBDbGllbnQgd2hvIGVudGVycyB0aGUgcGVyZm9ybWFuY2UuXG4gICAqL1xuICBlbnRlcihjbGllbnQpIHtcbiAgICAvLyBhZGQgdGhlIGNsaWVudCB0byB0aGUgYHRoaXMuY2xpZW50c2AgYXJyYXlcbiAgICB0aGlzLmNsaWVudHMucHVzaChjbGllbnQpO1xuICAgIC8vIHNldCBmbGFnXG4gICAgY2xpZW50LmFjdGl2aXRpZXNbdGhpcy5pZF0uZW50ZXJlZCA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGNsaWVudCBleGl0cyB0aGUgcGVyZm9ybWFuY2Ugb24gdGhlIGNsaWVudCBzaWRlICgqaS5lLipcbiAgICogd2hlbiB0aGUgYGRvbmVgIG1ldGhvZCBvZiB0aGUgY2xpZW50IHNpZGUgZXhwZXJpZW5jZSBpcyBjYWxsZWQsIG9yIHdoZW5cbiAgICogdGhlIGNsaWVudCBkaXNjb25uZWN0cyBmcm9tIHRoZSBzZXJ2ZXIpLlxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IC0gQ2xpZW50IHdobyBleGl0cyB0aGUgcGVyZm9ybWFuY2UuXG4gICAqL1xuICBleGl0KGNsaWVudCkge1xuICAgIC8vIFJlbW92ZSB0aGUgY2xpZW50IGZyb20gdGhlIGB0aGlzLmNsaWVudHNgIGFycmF5LlxuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5jbGllbnRzLmluZGV4T2YoY2xpZW50KTtcbiAgICBpZiAoaW5kZXggPj0gMClcbiAgICAgIHRoaXMuY2xpZW50cy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgLy8gUmVtb3ZlIGZsYWcuXG4gICAgY2xpZW50LmFjdGl2aXRpZXNbdGhpcy5pZF0uZW50ZXJlZCA9IGZhbHNlO1xuICB9XG59XG4iXX0=