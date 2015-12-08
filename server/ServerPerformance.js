'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _ServerModule2 = require('./ServerModule');

var _ServerModule3 = _interopRequireDefault(_ServerModule2);

/**
 * [server] Base class used to build a performance on the client side.
 *
 * Along with the classic {@link Performance#connect} and {@link Performance#disconnect} methods, the base class has two additional methods:
 * - {@link Performance#enter}: called when the client enters the performance (*i.e.* when the {@link src/client/Performance.js~Performance} on the client side calls its {@link src/client/Performance.js~Performance#start} method);
 * - {@link Performance#exit}: called when the client leaves the performance (*i.e.* when the {@link src/client/Performance.js~Performance} on the client side calls its {@link src/client/Performance.js~Performance#done} method, or if the client disconnected from the server).
 *
 * The base class also keeps track of the clients who are currently in the performance (*i.e.* who entered but not exited yet) in the array `this.clients`.
 *
 * (See also {@link src/client/ClientPerformance.js~ClientPerformance} on the client side.)
 */

var ServerPerformance = (function (_ServerModule) {
  _inherits(ServerPerformance, _ServerModule);

  /**
    * Creates an instance of the class.
    * @param {Object} [options={}] Options.
    * @param {string} [options.name='performance'] Name of the module.
   */

  function ServerPerformance() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ServerPerformance);

    _get(Object.getPrototypeOf(ServerPerformance.prototype), 'constructor', this).call(this, options.name || 'performance');

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

  _createClass(ServerPerformance, [{
    key: 'connect',
    value: function connect(client) {
      var _this = this;

      _get(Object.getPrototypeOf(ServerPerformance.prototype), 'connect', this).call(this, client);

      // Listen for the `'performance:start'` socket message from the client.
      this.receive(client, 'start', function () {
        _this.enter(client);
      });

      // Listen for the `'performance:done'` socket message from the client.
      this.receive(client, 'done', function () {
        _this.exit(client);
      });
    }

    /**
     * Called when the client disconnects from the server.
     * @param {Client} client Disconnected client.
     */
  }, {
    key: 'disconnect',
    value: function disconnect(client) {
      _get(Object.getPrototypeOf(ServerPerformance.prototype), 'disconnect', this).call(this, client);

      // Call the `exit` method if the client previously entered the performance.
      if (client.modules[this.name].entered) this.exit(client);
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
      client.modules[this.name].entered = true;
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
      client.modules[this.name].entered = false;
    }
  }]);

  return ServerPerformance;
})(_ServerModule3['default']);

exports['default'] = ServerPerformance;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzZCQUF5QixnQkFBZ0I7Ozs7Ozs7Ozs7Ozs7Ozs7SUFjcEIsaUJBQWlCO1lBQWpCLGlCQUFpQjs7Ozs7Ozs7QUFNekIsV0FOUSxpQkFBaUIsR0FNVjtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBTkwsaUJBQWlCOztBQU9sQywrQkFQaUIsaUJBQWlCLDZDQU81QixPQUFPLENBQUMsSUFBSSxJQUFJLGFBQWEsRUFBRTs7Ozs7O0FBTXJDLFFBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0dBQ25COzs7Ozs7O2VBZGtCLGlCQUFpQjs7V0FvQjdCLGlCQUFDLE1BQU0sRUFBRTs7O0FBQ2QsaUNBckJpQixpQkFBaUIseUNBcUJwQixNQUFNLEVBQUU7OztBQUd0QixVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsWUFBTTtBQUNsQyxjQUFLLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztPQUNwQixDQUFDLENBQUM7OztBQUdILFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxZQUFNO0FBQ2pDLGNBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO09BQ25CLENBQUMsQ0FBQztLQUNKOzs7Ozs7OztXQU1TLG9CQUFDLE1BQU0sRUFBRTtBQUNqQixpQ0F2Q2lCLGlCQUFpQiw0Q0F1Q2pCLE1BQU0sRUFBRTs7O0FBR3pCLFVBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUNuQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ3JCOzs7Ozs7OztXQU1JLGVBQUMsTUFBTSxFQUFFOztBQUVaLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDOzs7QUFHMUIsWUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztLQUMxQzs7Ozs7Ozs7V0FNRyxjQUFDLE1BQU0sRUFBRTs7QUFFWCxVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMzQyxVQUFJLEtBQUssSUFBSSxDQUFDLEVBQ1osSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDOzs7QUFHaEMsWUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztLQUMzQzs7O1NBdEVrQixpQkFBaUI7OztxQkFBakIsaUJBQWlCIiwiZmlsZSI6InNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2ZXJNb2R1bGUgZnJvbSAnLi9TZXJ2ZXJNb2R1bGUnO1xuXG5cbi8qKlxuICogW3NlcnZlcl0gQmFzZSBjbGFzcyB1c2VkIHRvIGJ1aWxkIGEgcGVyZm9ybWFuY2Ugb24gdGhlIGNsaWVudCBzaWRlLlxuICpcbiAqIEFsb25nIHdpdGggdGhlIGNsYXNzaWMge0BsaW5rIFBlcmZvcm1hbmNlI2Nvbm5lY3R9IGFuZCB7QGxpbmsgUGVyZm9ybWFuY2UjZGlzY29ubmVjdH0gbWV0aG9kcywgdGhlIGJhc2UgY2xhc3MgaGFzIHR3byBhZGRpdGlvbmFsIG1ldGhvZHM6XG4gKiAtIHtAbGluayBQZXJmb3JtYW5jZSNlbnRlcn06IGNhbGxlZCB3aGVuIHRoZSBjbGllbnQgZW50ZXJzIHRoZSBwZXJmb3JtYW5jZSAoKmkuZS4qIHdoZW4gdGhlIHtAbGluayBzcmMvY2xpZW50L1BlcmZvcm1hbmNlLmpzflBlcmZvcm1hbmNlfSBvbiB0aGUgY2xpZW50IHNpZGUgY2FsbHMgaXRzIHtAbGluayBzcmMvY2xpZW50L1BlcmZvcm1hbmNlLmpzflBlcmZvcm1hbmNlI3N0YXJ0fSBtZXRob2QpO1xuICogLSB7QGxpbmsgUGVyZm9ybWFuY2UjZXhpdH06IGNhbGxlZCB3aGVuIHRoZSBjbGllbnQgbGVhdmVzIHRoZSBwZXJmb3JtYW5jZSAoKmkuZS4qIHdoZW4gdGhlIHtAbGluayBzcmMvY2xpZW50L1BlcmZvcm1hbmNlLmpzflBlcmZvcm1hbmNlfSBvbiB0aGUgY2xpZW50IHNpZGUgY2FsbHMgaXRzIHtAbGluayBzcmMvY2xpZW50L1BlcmZvcm1hbmNlLmpzflBlcmZvcm1hbmNlI2RvbmV9IG1ldGhvZCwgb3IgaWYgdGhlIGNsaWVudCBkaXNjb25uZWN0ZWQgZnJvbSB0aGUgc2VydmVyKS5cbiAqXG4gKiBUaGUgYmFzZSBjbGFzcyBhbHNvIGtlZXBzIHRyYWNrIG9mIHRoZSBjbGllbnRzIHdobyBhcmUgY3VycmVudGx5IGluIHRoZSBwZXJmb3JtYW5jZSAoKmkuZS4qIHdobyBlbnRlcmVkIGJ1dCBub3QgZXhpdGVkIHlldCkgaW4gdGhlIGFycmF5IGB0aGlzLmNsaWVudHNgLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL2NsaWVudC9DbGllbnRQZXJmb3JtYW5jZS5qc35DbGllbnRQZXJmb3JtYW5jZX0gb24gdGhlIGNsaWVudCBzaWRlLilcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmVyUGVyZm9ybWFuY2UgZXh0ZW5kcyBTZXJ2ZXJNb2R1bGUge1xuICAvKipcbiAgICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLlxuICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLm5hbWU9J3BlcmZvcm1hbmNlJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdwZXJmb3JtYW5jZScpO1xuXG4gICAgLyoqXG4gICAgICogTGlzdCBvZiB0aGUgY2xpZW50cyB3aG8gYXJlIGN1cnJlbnRseSBpbiB0aGUgcGVyZm9ybWFuY2UgKCppLmUuKiB3aG8gZW50ZXJlZCB0aGUgcGVyZm9ybWFuY2UgYW5kIGhhdmUgbm90IGV4aXRlZCBpdCB5ZXQpLlxuICAgICAqIEB0eXBlIHtDbGllbnRbXX1cbiAgICAgKi9cbiAgICB0aGlzLmNsaWVudHMgPSBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgY2xpZW50IGNvbm5lY3RzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgQ29ubmVjdGVkIGNsaWVudC5cbiAgICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgLy8gTGlzdGVuIGZvciB0aGUgYCdwZXJmb3JtYW5jZTpzdGFydCdgIHNvY2tldCBtZXNzYWdlIGZyb20gdGhlIGNsaWVudC5cbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAnc3RhcnQnLCAoKSA9PiB7XG4gICAgICB0aGlzLmVudGVyKGNsaWVudCk7XG4gICAgfSk7XG5cbiAgICAvLyBMaXN0ZW4gZm9yIHRoZSBgJ3BlcmZvcm1hbmNlOmRvbmUnYCBzb2NrZXQgbWVzc2FnZSBmcm9tIHRoZSBjbGllbnQuXG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ2RvbmUnLCAoKSA9PiB7XG4gICAgICB0aGlzLmV4aXQoY2xpZW50KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgY2xpZW50IGRpc2Nvbm5lY3RzIGZyb20gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCBEaXNjb25uZWN0ZWQgY2xpZW50LlxuICAgKi9cbiAgZGlzY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5kaXNjb25uZWN0KGNsaWVudCk7XG5cbiAgICAvLyBDYWxsIHRoZSBgZXhpdGAgbWV0aG9kIGlmIHRoZSBjbGllbnQgcHJldmlvdXNseSBlbnRlcmVkIHRoZSBwZXJmb3JtYW5jZS5cbiAgICBpZiAoY2xpZW50Lm1vZHVsZXNbdGhpcy5uYW1lXS5lbnRlcmVkKVxuICAgICAgdGhpcy5leGl0KGNsaWVudCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGNsaWVudCBzdGFydHMgdGhlIHBlcmZvcm1hbmNlIG9uIHRoZSBjbGllbnQgc2lkZS5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCBDbGllbnQgd2hvIGVudGVycyB0aGUgcGVyZm9ybWFuY2UuXG4gICAqL1xuICBlbnRlcihjbGllbnQpIHtcbiAgICAvLyBBZGQgdGhlIGNsaWVudCB0byB0aGUgYHRoaXMuY2xpZW50c2AgYXJyYXkuXG4gICAgdGhpcy5jbGllbnRzLnB1c2goY2xpZW50KTtcblxuICAgIC8vIFNldCBmbGFnLlxuICAgIGNsaWVudC5tb2R1bGVzW3RoaXMubmFtZV0uZW50ZXJlZCA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGNsaWVudCBleGl0cyB0aGUgcGVyZm9ybWFuY2Ugb24gdGhlIGNsaWVudCBzaWRlICgqaS5lLiogd2hlbiB0aGUgYGRvbmVgIG1ldGhvZCBvZiB0aGUgY2xpZW50IHNpZGUgbW9kdWxlIGlzIGNhbGxlZCwgb3Igd2hlbiB0aGUgY2xpZW50IGRpc2Nvbm5lY3RzIGZyb20gdGhlIHNlcnZlcikuXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgQ2xpZW50IHdobyBleGl0cyB0aGUgcGVyZm9ybWFuY2UuXG4gICAqL1xuICBleGl0KGNsaWVudCkge1xuICAgIC8vIFJlbW92ZSB0aGUgY2xpZW50IGZyb20gdGhlIGB0aGlzLmNsaWVudHNgIGFycmF5LlxuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5jbGllbnRzLmluZGV4T2YoY2xpZW50KTtcbiAgICBpZiAoaW5kZXggPj0gMClcbiAgICAgIHRoaXMuY2xpZW50cy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgLy8gUmVtb3ZlIGZsYWcuXG4gICAgY2xpZW50Lm1vZHVsZXNbdGhpcy5uYW1lXS5lbnRlcmVkID0gZmFsc2U7XG4gIH1cbn1cbiJdfQ==