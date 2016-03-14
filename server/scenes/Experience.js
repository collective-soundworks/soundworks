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
     * Called when the client exits the performance on the client side (*i.e.* when the `done` method of the client side experience is called, or when the client disconnects from the server).
     * @param {Client} client Client who exits the performance.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkV4cGVyaWVuY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBY3FCOzs7Ozs7Ozs7QUFNbkIsV0FObUIsVUFNbkIsR0FBc0c7UUFBOUMsbUVBQWEsaUJBQU8sTUFBUCxDQUFjLGlCQUFkLGdCQUFpQzt3Q0FObkYsWUFNbUY7OzZGQU5uRix1QkFPWCxlQUQ4Rjs7QUFHcEcsVUFBSyxhQUFMLENBQW1CLFVBQW5CLEVBSG9HOztBQUtwRyxVQUFLLGNBQUwsR0FBc0IsTUFBSyxPQUFMLENBQWEsZ0JBQWIsQ0FBdEI7Ozs7OztBQUxvRyxTQVdwRyxDQUFLLE9BQUwsR0FBZSxFQUFmLENBWG9HOztHQUF0Rzs7Ozs7Ozs7NkJBTm1COzs0QkF3QlgsUUFBUTs7O0FBQ2QsdURBekJpQixtREF5QkgsT0FBZDs7O0FBRGMsVUFJZCxDQUFLLE9BQUwsQ0FBYSxNQUFiLEVBQXFCLE9BQXJCLEVBQThCO2VBQU0sT0FBSyxLQUFMLENBQVcsTUFBWDtPQUFOLENBQTlCLENBSmM7QUFLZCxXQUFLLE9BQUwsQ0FBYSxNQUFiLEVBQXFCLE1BQXJCLEVBQTZCO2VBQU0sT0FBSyxJQUFMLENBQVUsTUFBVjtPQUFOLENBQTdCLENBTGM7Ozs7Ozs7Ozs7K0JBWUwsUUFBUTtBQUNqQix1REFyQ2lCLHNEQXFDQSxPQUFqQjs7O0FBRGlCLFVBSWIsT0FBTyxVQUFQLENBQWtCLEtBQUssRUFBTCxDQUFsQixDQUEyQixPQUEzQixFQUNGLEtBQUssSUFBTCxDQUFVLE1BQVYsRUFERjs7Ozs7Ozs7OzswQkFRSSxRQUFROztBQUVaLFdBQUssT0FBTCxDQUFhLElBQWIsQ0FBa0IsTUFBbEI7O0FBRlksWUFJWixDQUFPLFVBQVAsQ0FBa0IsS0FBSyxFQUFMLENBQWxCLENBQTJCLE9BQTNCLEdBQXFDLElBQXJDLENBSlk7Ozs7Ozs7Ozs7eUJBV1QsUUFBUTs7QUFFWCxVQUFNLFFBQVEsS0FBSyxPQUFMLENBQWEsT0FBYixDQUFxQixNQUFyQixDQUFSLENBRks7QUFHWCxVQUFJLFNBQVMsQ0FBVCxFQUNGLEtBQUssT0FBTCxDQUFhLE1BQWIsQ0FBb0IsS0FBcEIsRUFBMkIsQ0FBM0IsRUFERjs7O0FBSFcsWUFPWCxDQUFPLFVBQVAsQ0FBa0IsS0FBSyxFQUFMLENBQWxCLENBQTJCLE9BQTNCLEdBQXFDLEtBQXJDLENBUFc7OztTQTNETSIsImZpbGUiOiJFeHBlcmllbmNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFjdGl2aXR5IGZyb20gJy4uL2NvcmUvQWN0aXZpdHknO1xuaW1wb3J0IHNlcnZlciBmcm9tICcuLi9jb3JlL3NlcnZlcic7XG5cblxuLyoqXG4gKiBCYXNlIGNsYXNzIHVzZWQgdG8gYnVpbGQgYSBleHBlcmllbmNlIG9uIHRoZSBzZXJ2ZXIgc2lkZS5cbiAqXG4gKiBBbG9uZyB3aXRoIHRoZSBjbGFzc2ljIHtAbGluayBzcmMvc2VydmVyL2NvcmUvQWN0aXZpdHkjY29ubmVjdH0gYW5kIHtAbGluayBzcmMvc2VydmVyL2NvcmUvQWN0aXZpdHkjZGlzY29ubmVjdH0gbWV0aG9kcywgdGhlIGJhc2UgY2xhc3MgaGFzIHR3byBhZGRpdGlvbmFsIG1ldGhvZHM6XG4gKiAtIHtAbGluayBFeHBlcmllbmNlI2VudGVyfTogY2FsbGVkIHdoZW4gdGhlIGNsaWVudCBlbnRlcnMgdGhlIGBFeHBlcmllbmNlYCAoKmkuZS4qIHdoZW4gdGhlIHtAbGluayBzcmMvY2xpZW50L3NjZW5lL0V4cGVyaWVuY2UuanN+RXhwZXJpZW5jZX0gb24gdGhlIGNsaWVudCBzaWRlIGNhbGxzIGl0cyB7QGxpbmsgc3JjL2NsaWVudC9zY2VuZS9FeHBlcmllbmNlLmpzfkV4cGVyaWVuY2Ujc3RhcnR9IG1ldGhvZCk7XG4gKiAtIHtAbGluayBFeHBlcmllbmNlI2V4aXR9OiBjYWxsZWQgd2hlbiB0aGUgY2xpZW50IGxlYXZlcyB0aGUgYEV4cGVyaWVuY2VgICgqaS5lLiogd2hlbiB0aGUge0BsaW5rIHNyYy9jbGllbnQvc2NlbmUvRXhwZXJpZW5jZS5qc35FeHBlcmllbmNlfSBvbiB0aGUgY2xpZW50IHNpZGUgY2FsbHMgaXRzIHtAbGluayBzcmMvY2xpZW50L3NjZW5lL0V4cGVyaWVuY2UuanN+RXhwZXJpZW5jZSNkb25lfSBtZXRob2QsIG9yIGlmIHRoZSBjbGllbnQgZGlzY29ubmVjdGVkIGZyb20gdGhlIHNlcnZlcikuXG4gKlxuICogVGhlIGJhc2UgY2xhc3MgYWxzbyBrZWVwcyB0cmFjayBvZiB0aGUgY2xpZW50cyB3aG8gYXJlIGN1cnJlbnRseSBpbiB0aGUgcGVyZm9ybWFuY2UgKCppLmUuKiB3aG8gZW50ZXJlZCBidXQgbm90IGV4aXRlZCB5ZXQpIGluIHRoZSBhcnJheSBgdGhpcy5jbGllbnRzYC5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9jbGllbnQvc2NlbmUvRXhwZXJpZW5jZS5qc35FeHBlcmllbmNlfSBvbiB0aGUgY2xpZW50IHNpZGUuKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFeHBlcmllbmNlIGV4dGVuZHMgQWN0aXZpdHkge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiB0aGUgY2xhc3MuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjbGllbnRUeXBlIC0gVGhlIGNsaWVudCB0eXBlIHRoZSBleHBlcmllbmNlIHNob3VsZCBiZVxuICAgKiAgbWFwcGVkIHRvLiBfKG5vdGU6IGlzIHVzZWQgYXMgdGhlIGlkIG9mIHRoZSBhY3Rpdml0eSlfXG4gICAqL1xuICBjb25zdHJ1Y3RvcigvKiBpZCA9IHNlcnZlci5jb25maWcuZGVmYXVsdENsaWVudFR5cGUsICovIGNsaWVudFR5cGUgPSBzZXJ2ZXIuY29uZmlnLmRlZmF1bHRDbGllbnRUeXBlKSB7XG4gICAgc3VwZXIoJ2V4cGVyaWVuY2UnKTtcblxuICAgIHRoaXMuYWRkQ2xpZW50VHlwZShjbGllbnRUeXBlKTtcblxuICAgIHRoaXMuX2Vycm9yUmVwb3J0ZXIgPSB0aGlzLnJlcXVpcmUoJ2Vycm9yLXJlcG9ydGVyJyk7XG5cbiAgICAvKipcbiAgICAgKiBMaXN0IG9mIHRoZSBjbGllbnRzIHdobyBhcmUgY3VycmVudGx5IGluIHRoZSBwZXJmb3JtYW5jZSAoKmkuZS4qIHdobyBlbnRlcmVkIHRoZSBwZXJmb3JtYW5jZSBhbmQgaGF2ZSBub3QgZXhpdGVkIGl0IHlldCkuXG4gICAgICogQHR5cGUge0NsaWVudFtdfVxuICAgICAqL1xuICAgIHRoaXMuY2xpZW50cyA9IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBjbGllbnQgY29ubmVjdHMgdG8gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCBDb25uZWN0ZWQgY2xpZW50LlxuICAgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICAvLyBMaXN0ZW4gZm9yIHRoZSBgJ2VudGVyJ2AgYW5kIGAnZXhpdCdgIHNvY2tldCBtZXNzYWdlcyBmcm9tIHRoZSBjbGllbnQuXG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ2VudGVyJywgKCkgPT4gdGhpcy5lbnRlcihjbGllbnQpKTtcbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAnZXhpdCcsICgpID0+IHRoaXMuZXhpdChjbGllbnQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgY2xpZW50IGRpc2Nvbm5lY3RzIGZyb20gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCBEaXNjb25uZWN0ZWQgY2xpZW50LlxuICAgKi9cbiAgZGlzY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5kaXNjb25uZWN0KGNsaWVudCk7XG5cbiAgICAvLyBDYWxsIHRoZSBgZXhpdGAgbWV0aG9kIGlmIHRoZSBjbGllbnQgcHJldmlvdXNseSBlbnRlcmVkIHRoZSBwZXJmb3JtYW5jZS5cbiAgICBpZiAoY2xpZW50LmFjdGl2aXRpZXNbdGhpcy5pZF0uZW50ZXJlZClcbiAgICAgIHRoaXMuZXhpdChjbGllbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBjbGllbnQgc3RhcnRzIHRoZSBwZXJmb3JtYW5jZSBvbiB0aGUgY2xpZW50IHNpZGUuXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgQ2xpZW50IHdobyBlbnRlcnMgdGhlIHBlcmZvcm1hbmNlLlxuICAgKi9cbiAgZW50ZXIoY2xpZW50KSB7XG4gICAgLy8gYWRkIHRoZSBjbGllbnQgdG8gdGhlIGB0aGlzLmNsaWVudHNgIGFycmF5XG4gICAgdGhpcy5jbGllbnRzLnB1c2goY2xpZW50KTtcbiAgICAvLyBzZXQgZmxhZ1xuICAgIGNsaWVudC5hY3Rpdml0aWVzW3RoaXMuaWRdLmVudGVyZWQgPSB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBjbGllbnQgZXhpdHMgdGhlIHBlcmZvcm1hbmNlIG9uIHRoZSBjbGllbnQgc2lkZSAoKmkuZS4qIHdoZW4gdGhlIGBkb25lYCBtZXRob2Qgb2YgdGhlIGNsaWVudCBzaWRlIGV4cGVyaWVuY2UgaXMgY2FsbGVkLCBvciB3aGVuIHRoZSBjbGllbnQgZGlzY29ubmVjdHMgZnJvbSB0aGUgc2VydmVyKS5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCBDbGllbnQgd2hvIGV4aXRzIHRoZSBwZXJmb3JtYW5jZS5cbiAgICovXG4gIGV4aXQoY2xpZW50KSB7XG4gICAgLy8gUmVtb3ZlIHRoZSBjbGllbnQgZnJvbSB0aGUgYHRoaXMuY2xpZW50c2AgYXJyYXkuXG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmNsaWVudHMuaW5kZXhPZihjbGllbnQpO1xuICAgIGlmIChpbmRleCA+PSAwKVxuICAgICAgdGhpcy5jbGllbnRzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICAvLyBSZW1vdmUgZmxhZy5cbiAgICBjbGllbnQuYWN0aXZpdGllc1t0aGlzLmlkXS5lbnRlcmVkID0gZmFsc2U7XG4gIH1cbn1cbiJdfQ==