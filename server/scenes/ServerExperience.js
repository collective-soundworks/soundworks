'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreServerActivity = require('../core/ServerActivity');

var _coreServerActivity2 = _interopRequireDefault(_coreServerActivity);

/**
 * Base class used to build a performance on the client side.
 *
 * Along with the classic {@link Performance#connect} and {@link Performance#disconnect} methods, the base class has two additional methods:
 * - {@link Performance#enter}: called when the client enters the performance (*i.e.* when the {@link src/client/Performance.js~Performance} on the client side calls its {@link src/client/Performance.js~Performance#start} method);
 * - {@link Performance#exit}: called when the client leaves the performance (*i.e.* when the {@link src/client/Performance.js~Performance} on the client side calls its {@link src/client/Performance.js~Performance#done} method, or if the client disconnected from the server).
 *
 * The base class also keeps track of the clients who are currently in the performance (*i.e.* who entered but not exited yet) in the array `this.clients`.
 *
 * (See also {@link src/client/ClientPerformance.js~ClientPerformance} on the client side.)
 */

var ServerExperience = (function (_ServerActivity) {
  _inherits(ServerExperience, _ServerActivity);

  /**
    * Creates an instance of the class.
    * @param {String} id - The id of the module, should its client-side counterpart.
   */

  function ServerExperience() {
    var id = arguments.length <= 0 || arguments[0] === undefined ? 'experience' : arguments[0];

    _classCallCheck(this, ServerExperience);

    _get(Object.getPrototypeOf(ServerExperience.prototype), 'constructor', this).call(this, id);

    /**
     * List of the clients who are currently in the performance (*i.e.* who entered the performance and have not exited it yet).
     * @type {Client[]}
     */
    this.clients = [];
  }

  /**
   * Called when the client connects to the server.
   * @param {Client} client Connected client.
   */

  _createClass(ServerExperience, [{
    key: 'connect',
    value: function connect(client) {
      var _this = this;

      _get(Object.getPrototypeOf(ServerExperience.prototype), 'connect', this).call(this, client);

      // Listen for the `'start'` and `'done'` socket messages from the client.
      this.receive(client, 'start', function () {
        return _this.enter(client);
      });
      this.receive(client, 'done', function () {
        return _this.exit(client);
      });
    }

    /**
     * Called when the client disconnects from the server.
     * @param {Client} client Disconnected client.
     */
  }, {
    key: 'disconnect',
    value: function disconnect(client) {
      _get(Object.getPrototypeOf(ServerExperience.prototype), 'disconnect', this).call(this, client);

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
})(_coreServerActivity2['default']);

exports['default'] = ServerExperience;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvc2NlbmVzL1NlcnZlckV4cGVyaWVuY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztrQ0FBMkIsd0JBQXdCOzs7Ozs7Ozs7Ozs7Ozs7O0lBYzlCLGdCQUFnQjtZQUFoQixnQkFBZ0I7Ozs7Ozs7QUFLeEIsV0FMUSxnQkFBZ0IsR0FLSjtRQUFuQixFQUFFLHlEQUFHLFlBQVk7OzBCQUxWLGdCQUFnQjs7QUFNakMsK0JBTmlCLGdCQUFnQiw2Q0FNM0IsRUFBRSxFQUFFOzs7Ozs7QUFNVixRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztHQUNuQjs7Ozs7OztlQWJrQixnQkFBZ0I7O1dBbUI1QixpQkFBQyxNQUFNLEVBQUU7OztBQUNkLGlDQXBCaUIsZ0JBQWdCLHlDQW9CbkIsTUFBTSxFQUFFOzs7QUFHdEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFO2VBQU0sTUFBSyxLQUFLLENBQUMsTUFBTSxDQUFDO09BQUEsQ0FBQyxDQUFDO0FBQ3hELFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRTtlQUFNLE1BQUssSUFBSSxDQUFDLE1BQU0sQ0FBQztPQUFBLENBQUMsQ0FBQztLQUN2RDs7Ozs7Ozs7V0FNUyxvQkFBQyxNQUFNLEVBQUU7QUFDakIsaUNBaENpQixnQkFBZ0IsNENBZ0NoQixNQUFNLEVBQUU7OztBQUd6QixVQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFDakMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUNyQjs7Ozs7Ozs7V0FNSSxlQUFDLE1BQU0sRUFBRTs7QUFFWixVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzs7O0FBRzFCLFlBQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7S0FDeEM7Ozs7Ozs7O1dBTUcsY0FBQyxNQUFNLEVBQUU7O0FBRVgsVUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0MsVUFBSSxLQUFLLElBQUksQ0FBQyxFQUNaLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQzs7O0FBR2hDLFlBQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7S0FDekM7OztTQS9Ea0IsZ0JBQWdCOzs7cUJBQWhCLGdCQUFnQiIsImZpbGUiOiJzcmMvc2VydmVyL3NjZW5lcy9TZXJ2ZXJFeHBlcmllbmNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZlckFjdGl2aXR5IGZyb20gJy4uL2NvcmUvU2VydmVyQWN0aXZpdHknO1xuXG5cbi8qKlxuICogQmFzZSBjbGFzcyB1c2VkIHRvIGJ1aWxkIGEgcGVyZm9ybWFuY2Ugb24gdGhlIGNsaWVudCBzaWRlLlxuICpcbiAqIEFsb25nIHdpdGggdGhlIGNsYXNzaWMge0BsaW5rIFBlcmZvcm1hbmNlI2Nvbm5lY3R9IGFuZCB7QGxpbmsgUGVyZm9ybWFuY2UjZGlzY29ubmVjdH0gbWV0aG9kcywgdGhlIGJhc2UgY2xhc3MgaGFzIHR3byBhZGRpdGlvbmFsIG1ldGhvZHM6XG4gKiAtIHtAbGluayBQZXJmb3JtYW5jZSNlbnRlcn06IGNhbGxlZCB3aGVuIHRoZSBjbGllbnQgZW50ZXJzIHRoZSBwZXJmb3JtYW5jZSAoKmkuZS4qIHdoZW4gdGhlIHtAbGluayBzcmMvY2xpZW50L1BlcmZvcm1hbmNlLmpzflBlcmZvcm1hbmNlfSBvbiB0aGUgY2xpZW50IHNpZGUgY2FsbHMgaXRzIHtAbGluayBzcmMvY2xpZW50L1BlcmZvcm1hbmNlLmpzflBlcmZvcm1hbmNlI3N0YXJ0fSBtZXRob2QpO1xuICogLSB7QGxpbmsgUGVyZm9ybWFuY2UjZXhpdH06IGNhbGxlZCB3aGVuIHRoZSBjbGllbnQgbGVhdmVzIHRoZSBwZXJmb3JtYW5jZSAoKmkuZS4qIHdoZW4gdGhlIHtAbGluayBzcmMvY2xpZW50L1BlcmZvcm1hbmNlLmpzflBlcmZvcm1hbmNlfSBvbiB0aGUgY2xpZW50IHNpZGUgY2FsbHMgaXRzIHtAbGluayBzcmMvY2xpZW50L1BlcmZvcm1hbmNlLmpzflBlcmZvcm1hbmNlI2RvbmV9IG1ldGhvZCwgb3IgaWYgdGhlIGNsaWVudCBkaXNjb25uZWN0ZWQgZnJvbSB0aGUgc2VydmVyKS5cbiAqXG4gKiBUaGUgYmFzZSBjbGFzcyBhbHNvIGtlZXBzIHRyYWNrIG9mIHRoZSBjbGllbnRzIHdobyBhcmUgY3VycmVudGx5IGluIHRoZSBwZXJmb3JtYW5jZSAoKmkuZS4qIHdobyBlbnRlcmVkIGJ1dCBub3QgZXhpdGVkIHlldCkgaW4gdGhlIGFycmF5IGB0aGlzLmNsaWVudHNgLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL2NsaWVudC9DbGllbnRQZXJmb3JtYW5jZS5qc35DbGllbnRQZXJmb3JtYW5jZX0gb24gdGhlIGNsaWVudCBzaWRlLilcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmVyRXhwZXJpZW5jZSBleHRlbmRzIFNlcnZlckFjdGl2aXR5IHtcbiAgLyoqXG4gICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy5cbiAgICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIFRoZSBpZCBvZiB0aGUgbW9kdWxlLCBzaG91bGQgaXRzIGNsaWVudC1zaWRlIGNvdW50ZXJwYXJ0LlxuICAgKi9cbiAgY29uc3RydWN0b3IoaWQgPSAnZXhwZXJpZW5jZScpIHtcbiAgICBzdXBlcihpZCk7XG5cbiAgICAvKipcbiAgICAgKiBMaXN0IG9mIHRoZSBjbGllbnRzIHdobyBhcmUgY3VycmVudGx5IGluIHRoZSBwZXJmb3JtYW5jZSAoKmkuZS4qIHdobyBlbnRlcmVkIHRoZSBwZXJmb3JtYW5jZSBhbmQgaGF2ZSBub3QgZXhpdGVkIGl0IHlldCkuXG4gICAgICogQHR5cGUge0NsaWVudFtdfVxuICAgICAqL1xuICAgIHRoaXMuY2xpZW50cyA9IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBjbGllbnQgY29ubmVjdHMgdG8gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCBDb25uZWN0ZWQgY2xpZW50LlxuICAgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICAvLyBMaXN0ZW4gZm9yIHRoZSBgJ3N0YXJ0J2AgYW5kIGAnZG9uZSdgIHNvY2tldCBtZXNzYWdlcyBmcm9tIHRoZSBjbGllbnQuXG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3N0YXJ0JywgKCkgPT4gdGhpcy5lbnRlcihjbGllbnQpKTtcbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAnZG9uZScsICgpID0+IHRoaXMuZXhpdChjbGllbnQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgY2xpZW50IGRpc2Nvbm5lY3RzIGZyb20gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCBEaXNjb25uZWN0ZWQgY2xpZW50LlxuICAgKi9cbiAgZGlzY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5kaXNjb25uZWN0KGNsaWVudCk7XG5cbiAgICAvLyBDYWxsIHRoZSBgZXhpdGAgbWV0aG9kIGlmIHRoZSBjbGllbnQgcHJldmlvdXNseSBlbnRlcmVkIHRoZSBwZXJmb3JtYW5jZS5cbiAgICBpZiAoY2xpZW50Lm1vZHVsZXNbdGhpcy5pZF0uZW50ZXJlZClcbiAgICAgIHRoaXMuZXhpdChjbGllbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBjbGllbnQgc3RhcnRzIHRoZSBwZXJmb3JtYW5jZSBvbiB0aGUgY2xpZW50IHNpZGUuXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgQ2xpZW50IHdobyBlbnRlcnMgdGhlIHBlcmZvcm1hbmNlLlxuICAgKi9cbiAgZW50ZXIoY2xpZW50KSB7XG4gICAgLy8gQWRkIHRoZSBjbGllbnQgdG8gdGhlIGB0aGlzLmNsaWVudHNgIGFycmF5LlxuICAgIHRoaXMuY2xpZW50cy5wdXNoKGNsaWVudCk7XG5cbiAgICAvLyBTZXQgZmxhZy5cbiAgICBjbGllbnQubW9kdWxlc1t0aGlzLmlkXS5lbnRlcmVkID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgY2xpZW50IGV4aXRzIHRoZSBwZXJmb3JtYW5jZSBvbiB0aGUgY2xpZW50IHNpZGUgKCppLmUuKiB3aGVuIHRoZSBgZG9uZWAgbWV0aG9kIG9mIHRoZSBjbGllbnQgc2lkZSBtb2R1bGUgaXMgY2FsbGVkLCBvciB3aGVuIHRoZSBjbGllbnQgZGlzY29ubmVjdHMgZnJvbSB0aGUgc2VydmVyKS5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCBDbGllbnQgd2hvIGV4aXRzIHRoZSBwZXJmb3JtYW5jZS5cbiAgICovXG4gIGV4aXQoY2xpZW50KSB7XG4gICAgLy8gUmVtb3ZlIHRoZSBjbGllbnQgZnJvbSB0aGUgYHRoaXMuY2xpZW50c2AgYXJyYXkuXG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmNsaWVudHMuaW5kZXhPZihjbGllbnQpO1xuICAgIGlmIChpbmRleCA+PSAwKVxuICAgICAgdGhpcy5jbGllbnRzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICAvLyBSZW1vdmUgZmxhZy5cbiAgICBjbGllbnQubW9kdWxlc1t0aGlzLmlkXS5lbnRlcmVkID0gZmFsc2U7XG4gIH1cbn1cbiJdfQ==