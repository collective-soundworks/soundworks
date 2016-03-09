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

var _ServerActivity2 = require('../core/ServerActivity');

var _ServerActivity3 = _interopRequireDefault(_ServerActivity2);

var _server = require('../core/server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Base class used to build a experience on the server side.
 *
 * Along with the classic {@link src/server/core/ServerActivity#connect} and {@link src/server/core/ServerActivity#disconnect} methods, the base class has two additional methods:
 * - {@link ServerExperience#enter}: called when the client enters the `Experience` (*i.e.* when the {@link src/client/scene/Experience.js~Experience} on the client side calls its {@link src/client/scene/Experience.js~Experience#start} method);
 * - {@link ServerExperience#exit}: called when the client leaves the `Experience` (*i.e.* when the {@link src/client/scene/Experience.js~Experience} on the client side calls its {@link src/client/scene/Experience.js~Experience#done} method, or if the client disconnected from the server).
 *
 * The base class also keeps track of the clients who are currently in the performance (*i.e.* who entered but not exited yet) in the array `this.clients`.
 *
 * (See also {@link src/client/scene/Experience.js~Experience} on the client side.)
 */

var ServerExperience = function (_ServerActivity) {
  (0, _inherits3.default)(ServerExperience, _ServerActivity);

  /**
   * Creates an instance of the class.
   * @param {String} clientType - The client type the experience should be
   *  mapped to. _(note: is used as the id of the activity)_
   */

  function ServerExperience() {
    var id = arguments.length <= 0 || arguments[0] === undefined ? _server2.default.config.defaultClientType : arguments[0];
    var clientType = arguments.length <= 1 || arguments[1] === undefined ? id : arguments[1];
    (0, _classCallCheck3.default)(this, ServerExperience);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ServerExperience).call(this, id));

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


  (0, _createClass3.default)(ServerExperience, [{
    key: 'connect',
    value: function connect(client) {
      var _this2 = this;

      (0, _get3.default)((0, _getPrototypeOf2.default)(ServerExperience.prototype), 'connect', this).call(this, client);

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
      (0, _get3.default)((0, _getPrototypeOf2.default)(ServerExperience.prototype), 'disconnect', this).call(this, client);

      // Call the `exit` method if the client previously entered the performance.
      if (client.modules[this.id].entered) this.exit(client);
    }

    /**
     * Called when the client starts the performance on the client side.
     * @param {Client} client Client who enters the performance.
     */

  }, {
    key: 'enter',
    value: function enter(client) {
      // Add the client to the `this.clients` array.
      this.clients.push(client);

      // Set flag.
      client.modules[this.id].entered = true;
    }

    /**
     * Called when the client exits the performance on the client side (*i.e.* when the `done` method of the client side module is called, or when the client disconnects from the server).
     * @param {Client} client Client who exits the performance.
     */

  }, {
    key: 'exit',
    value: function exit(client) {
      // Remove the client from the `this.clients` array.
      var index = this.clients.indexOf(client);
      if (index >= 0) this.clients.splice(index, 1);

      // Remove flag.
      client.modules[this.id].entered = false;
    }
  }]);
  return ServerExperience;
}(_ServerActivity3.default);

exports.default = ServerExperience;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlcnZlckV4cGVyaWVuY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBY3FCOzs7Ozs7Ozs7QUFNbkIsV0FObUIsZ0JBTW5CLEdBQW1FO1FBQXZELDJEQUFLLGlCQUFPLE1BQVAsQ0FBYyxpQkFBZCxnQkFBa0Q7UUFBakIsbUVBQWEsa0JBQUk7d0NBTmhELGtCQU1nRDs7NkZBTmhELDZCQU9YLEtBRDJEOztBQUdqRSxVQUFLLGFBQUwsQ0FBbUIsVUFBbkIsRUFIaUU7O0FBS2pFLFVBQUssY0FBTCxHQUFzQixNQUFLLE9BQUwsQ0FBYSxnQkFBYixDQUF0Qjs7Ozs7O0FBTGlFLFNBV2pFLENBQUssT0FBTCxHQUFlLEVBQWYsQ0FYaUU7O0dBQW5FOzs7Ozs7Ozs2QkFObUI7OzRCQXdCWCxRQUFROzs7QUFDZCx1REF6QmlCLHlEQXlCSCxPQUFkOzs7QUFEYyxVQUlkLENBQUssT0FBTCxDQUFhLE1BQWIsRUFBcUIsT0FBckIsRUFBOEI7ZUFBTSxPQUFLLEtBQUwsQ0FBVyxNQUFYO09BQU4sQ0FBOUIsQ0FKYztBQUtkLFdBQUssT0FBTCxDQUFhLE1BQWIsRUFBcUIsTUFBckIsRUFBNkI7ZUFBTSxPQUFLLElBQUwsQ0FBVSxNQUFWO09BQU4sQ0FBN0IsQ0FMYzs7Ozs7Ozs7OzsrQkFZTCxRQUFRO0FBQ2pCLHVEQXJDaUIsNERBcUNBLE9BQWpCOzs7QUFEaUIsVUFJYixPQUFPLE9BQVAsQ0FBZSxLQUFLLEVBQUwsQ0FBZixDQUF3QixPQUF4QixFQUNGLEtBQUssSUFBTCxDQUFVLE1BQVYsRUFERjs7Ozs7Ozs7OzswQkFRSSxRQUFROztBQUVaLFdBQUssT0FBTCxDQUFhLElBQWIsQ0FBa0IsTUFBbEI7OztBQUZZLFlBS1osQ0FBTyxPQUFQLENBQWUsS0FBSyxFQUFMLENBQWYsQ0FBd0IsT0FBeEIsR0FBa0MsSUFBbEMsQ0FMWTs7Ozs7Ozs7Ozt5QkFZVCxRQUFROztBQUVYLFVBQU0sUUFBUSxLQUFLLE9BQUwsQ0FBYSxPQUFiLENBQXFCLE1BQXJCLENBQVIsQ0FGSztBQUdYLFVBQUksU0FBUyxDQUFULEVBQ0YsS0FBSyxPQUFMLENBQWEsTUFBYixDQUFvQixLQUFwQixFQUEyQixDQUEzQixFQURGOzs7QUFIVyxZQU9YLENBQU8sT0FBUCxDQUFlLEtBQUssRUFBTCxDQUFmLENBQXdCLE9BQXhCLEdBQWtDLEtBQWxDLENBUFc7OztTQTVETSIsImZpbGUiOiJTZXJ2ZXJFeHBlcmllbmNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZlckFjdGl2aXR5IGZyb20gJy4uL2NvcmUvU2VydmVyQWN0aXZpdHknO1xuaW1wb3J0IHNlcnZlciBmcm9tICcuLi9jb3JlL3NlcnZlcic7XG5cblxuLyoqXG4gKiBCYXNlIGNsYXNzIHVzZWQgdG8gYnVpbGQgYSBleHBlcmllbmNlIG9uIHRoZSBzZXJ2ZXIgc2lkZS5cbiAqXG4gKiBBbG9uZyB3aXRoIHRoZSBjbGFzc2ljIHtAbGluayBzcmMvc2VydmVyL2NvcmUvU2VydmVyQWN0aXZpdHkjY29ubmVjdH0gYW5kIHtAbGluayBzcmMvc2VydmVyL2NvcmUvU2VydmVyQWN0aXZpdHkjZGlzY29ubmVjdH0gbWV0aG9kcywgdGhlIGJhc2UgY2xhc3MgaGFzIHR3byBhZGRpdGlvbmFsIG1ldGhvZHM6XG4gKiAtIHtAbGluayBTZXJ2ZXJFeHBlcmllbmNlI2VudGVyfTogY2FsbGVkIHdoZW4gdGhlIGNsaWVudCBlbnRlcnMgdGhlIGBFeHBlcmllbmNlYCAoKmkuZS4qIHdoZW4gdGhlIHtAbGluayBzcmMvY2xpZW50L3NjZW5lL0V4cGVyaWVuY2UuanN+RXhwZXJpZW5jZX0gb24gdGhlIGNsaWVudCBzaWRlIGNhbGxzIGl0cyB7QGxpbmsgc3JjL2NsaWVudC9zY2VuZS9FeHBlcmllbmNlLmpzfkV4cGVyaWVuY2Ujc3RhcnR9IG1ldGhvZCk7XG4gKiAtIHtAbGluayBTZXJ2ZXJFeHBlcmllbmNlI2V4aXR9OiBjYWxsZWQgd2hlbiB0aGUgY2xpZW50IGxlYXZlcyB0aGUgYEV4cGVyaWVuY2VgICgqaS5lLiogd2hlbiB0aGUge0BsaW5rIHNyYy9jbGllbnQvc2NlbmUvRXhwZXJpZW5jZS5qc35FeHBlcmllbmNlfSBvbiB0aGUgY2xpZW50IHNpZGUgY2FsbHMgaXRzIHtAbGluayBzcmMvY2xpZW50L3NjZW5lL0V4cGVyaWVuY2UuanN+RXhwZXJpZW5jZSNkb25lfSBtZXRob2QsIG9yIGlmIHRoZSBjbGllbnQgZGlzY29ubmVjdGVkIGZyb20gdGhlIHNlcnZlcikuXG4gKlxuICogVGhlIGJhc2UgY2xhc3MgYWxzbyBrZWVwcyB0cmFjayBvZiB0aGUgY2xpZW50cyB3aG8gYXJlIGN1cnJlbnRseSBpbiB0aGUgcGVyZm9ybWFuY2UgKCppLmUuKiB3aG8gZW50ZXJlZCBidXQgbm90IGV4aXRlZCB5ZXQpIGluIHRoZSBhcnJheSBgdGhpcy5jbGllbnRzYC5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9jbGllbnQvc2NlbmUvRXhwZXJpZW5jZS5qc35FeHBlcmllbmNlfSBvbiB0aGUgY2xpZW50IHNpZGUuKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2ZXJFeHBlcmllbmNlIGV4dGVuZHMgU2VydmVyQWN0aXZpdHkge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiB0aGUgY2xhc3MuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjbGllbnRUeXBlIC0gVGhlIGNsaWVudCB0eXBlIHRoZSBleHBlcmllbmNlIHNob3VsZCBiZVxuICAgKiAgbWFwcGVkIHRvLiBfKG5vdGU6IGlzIHVzZWQgYXMgdGhlIGlkIG9mIHRoZSBhY3Rpdml0eSlfXG4gICAqL1xuICBjb25zdHJ1Y3RvcihpZCA9IHNlcnZlci5jb25maWcuZGVmYXVsdENsaWVudFR5cGUsIGNsaWVudFR5cGUgPSBpZCkge1xuICAgIHN1cGVyKGlkKTtcblxuICAgIHRoaXMuYWRkQ2xpZW50VHlwZShjbGllbnRUeXBlKTtcblxuICAgIHRoaXMuX2Vycm9yUmVwb3J0ZXIgPSB0aGlzLnJlcXVpcmUoJ2Vycm9yLXJlcG9ydGVyJyk7XG5cbiAgICAvKipcbiAgICAgKiBMaXN0IG9mIHRoZSBjbGllbnRzIHdobyBhcmUgY3VycmVudGx5IGluIHRoZSBwZXJmb3JtYW5jZSAoKmkuZS4qIHdobyBlbnRlcmVkIHRoZSBwZXJmb3JtYW5jZSBhbmQgaGF2ZSBub3QgZXhpdGVkIGl0IHlldCkuXG4gICAgICogQHR5cGUge0NsaWVudFtdfVxuICAgICAqL1xuICAgIHRoaXMuY2xpZW50cyA9IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBjbGllbnQgY29ubmVjdHMgdG8gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCBDb25uZWN0ZWQgY2xpZW50LlxuICAgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICAvLyBMaXN0ZW4gZm9yIHRoZSBgJ2VudGVyJ2AgYW5kIGAnZXhpdCdgIHNvY2tldCBtZXNzYWdlcyBmcm9tIHRoZSBjbGllbnQuXG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ2VudGVyJywgKCkgPT4gdGhpcy5lbnRlcihjbGllbnQpKTtcbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAnZXhpdCcsICgpID0+IHRoaXMuZXhpdChjbGllbnQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgY2xpZW50IGRpc2Nvbm5lY3RzIGZyb20gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCBEaXNjb25uZWN0ZWQgY2xpZW50LlxuICAgKi9cbiAgZGlzY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5kaXNjb25uZWN0KGNsaWVudCk7XG5cbiAgICAvLyBDYWxsIHRoZSBgZXhpdGAgbWV0aG9kIGlmIHRoZSBjbGllbnQgcHJldmlvdXNseSBlbnRlcmVkIHRoZSBwZXJmb3JtYW5jZS5cbiAgICBpZiAoY2xpZW50Lm1vZHVsZXNbdGhpcy5pZF0uZW50ZXJlZClcbiAgICAgIHRoaXMuZXhpdChjbGllbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBjbGllbnQgc3RhcnRzIHRoZSBwZXJmb3JtYW5jZSBvbiB0aGUgY2xpZW50IHNpZGUuXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgQ2xpZW50IHdobyBlbnRlcnMgdGhlIHBlcmZvcm1hbmNlLlxuICAgKi9cbiAgZW50ZXIoY2xpZW50KSB7XG4gICAgLy8gQWRkIHRoZSBjbGllbnQgdG8gdGhlIGB0aGlzLmNsaWVudHNgIGFycmF5LlxuICAgIHRoaXMuY2xpZW50cy5wdXNoKGNsaWVudCk7XG5cbiAgICAvLyBTZXQgZmxhZy5cbiAgICBjbGllbnQubW9kdWxlc1t0aGlzLmlkXS5lbnRlcmVkID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgY2xpZW50IGV4aXRzIHRoZSBwZXJmb3JtYW5jZSBvbiB0aGUgY2xpZW50IHNpZGUgKCppLmUuKiB3aGVuIHRoZSBgZG9uZWAgbWV0aG9kIG9mIHRoZSBjbGllbnQgc2lkZSBtb2R1bGUgaXMgY2FsbGVkLCBvciB3aGVuIHRoZSBjbGllbnQgZGlzY29ubmVjdHMgZnJvbSB0aGUgc2VydmVyKS5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCBDbGllbnQgd2hvIGV4aXRzIHRoZSBwZXJmb3JtYW5jZS5cbiAgICovXG4gIGV4aXQoY2xpZW50KSB7XG4gICAgLy8gUmVtb3ZlIHRoZSBjbGllbnQgZnJvbSB0aGUgYHRoaXMuY2xpZW50c2AgYXJyYXkuXG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmNsaWVudHMuaW5kZXhPZihjbGllbnQpO1xuICAgIGlmIChpbmRleCA+PSAwKVxuICAgICAgdGhpcy5jbGllbnRzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICAvLyBSZW1vdmUgZmxhZy5cbiAgICBjbGllbnQubW9kdWxlc1t0aGlzLmlkXS5lbnRlcmVkID0gZmFsc2U7XG4gIH1cbn1cbiJdfQ==