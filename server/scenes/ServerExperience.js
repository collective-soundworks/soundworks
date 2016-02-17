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
   * @param {String} clientType - The client type the experience should be
   *  mapped to. _(note: is used as the id of the activity)_
   */

  function ServerExperience(clientType) {
    _classCallCheck(this, ServerExperience);

    _get(Object.getPrototypeOf(ServerExperience.prototype), 'constructor', this).call(this, clientType);

    this.addClientType(clientType);

    this._errorReporter = this.require('error-reporter');

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvc2NlbmVzL1NlcnZlckV4cGVyaWVuY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztrQ0FBMkIsd0JBQXdCOzs7Ozs7Ozs7Ozs7Ozs7O0lBYzlCLGdCQUFnQjtZQUFoQixnQkFBZ0I7Ozs7Ozs7O0FBTXhCLFdBTlEsZ0JBQWdCLENBTXZCLFVBQVUsRUFBRTswQkFOTCxnQkFBZ0I7O0FBT2pDLCtCQVBpQixnQkFBZ0IsNkNBTzNCLFVBQVUsRUFBRTs7QUFFbEIsUUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQzs7QUFFL0IsUUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7Ozs7OztBQU1yRCxRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztHQUNuQjs7Ozs7OztlQWxCa0IsZ0JBQWdCOztXQXdCNUIsaUJBQUMsTUFBTSxFQUFFOzs7QUFDZCxpQ0F6QmlCLGdCQUFnQix5Q0F5Qm5CLE1BQU0sRUFBRTs7O0FBR3RCLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRTtlQUFNLE1BQUssS0FBSyxDQUFDLE1BQU0sQ0FBQztPQUFBLENBQUMsQ0FBQztBQUN4RCxVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUU7ZUFBTSxNQUFLLElBQUksQ0FBQyxNQUFNLENBQUM7T0FBQSxDQUFDLENBQUM7S0FDdkQ7Ozs7Ozs7O1dBTVMsb0JBQUMsTUFBTSxFQUFFO0FBQ2pCLGlDQXJDaUIsZ0JBQWdCLDRDQXFDaEIsTUFBTSxFQUFFOzs7QUFHekIsVUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQ2pDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDckI7Ozs7Ozs7O1dBTUksZUFBQyxNQUFNLEVBQUU7O0FBRVosVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7OztBQUcxQixZQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0tBQ3hDOzs7Ozs7OztXQU1HLGNBQUMsTUFBTSxFQUFFOztBQUVYLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNDLFVBQUksS0FBSyxJQUFJLENBQUMsRUFDWixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7OztBQUdoQyxZQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0tBQ3pDOzs7U0FwRWtCLGdCQUFnQjs7O3FCQUFoQixnQkFBZ0IiLCJmaWxlIjoic3JjL3NlcnZlci9zY2VuZXMvU2VydmVyRXhwZXJpZW5jZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2ZXJBY3Rpdml0eSBmcm9tICcuLi9jb3JlL1NlcnZlckFjdGl2aXR5JztcblxuXG4vKipcbiAqIEJhc2UgY2xhc3MgdXNlZCB0byBidWlsZCBhIHBlcmZvcm1hbmNlIG9uIHRoZSBjbGllbnQgc2lkZS5cbiAqXG4gKiBBbG9uZyB3aXRoIHRoZSBjbGFzc2ljIHtAbGluayBQZXJmb3JtYW5jZSNjb25uZWN0fSBhbmQge0BsaW5rIFBlcmZvcm1hbmNlI2Rpc2Nvbm5lY3R9IG1ldGhvZHMsIHRoZSBiYXNlIGNsYXNzIGhhcyB0d28gYWRkaXRpb25hbCBtZXRob2RzOlxuICogLSB7QGxpbmsgUGVyZm9ybWFuY2UjZW50ZXJ9OiBjYWxsZWQgd2hlbiB0aGUgY2xpZW50IGVudGVycyB0aGUgcGVyZm9ybWFuY2UgKCppLmUuKiB3aGVuIHRoZSB7QGxpbmsgc3JjL2NsaWVudC9QZXJmb3JtYW5jZS5qc35QZXJmb3JtYW5jZX0gb24gdGhlIGNsaWVudCBzaWRlIGNhbGxzIGl0cyB7QGxpbmsgc3JjL2NsaWVudC9QZXJmb3JtYW5jZS5qc35QZXJmb3JtYW5jZSNzdGFydH0gbWV0aG9kKTtcbiAqIC0ge0BsaW5rIFBlcmZvcm1hbmNlI2V4aXR9OiBjYWxsZWQgd2hlbiB0aGUgY2xpZW50IGxlYXZlcyB0aGUgcGVyZm9ybWFuY2UgKCppLmUuKiB3aGVuIHRoZSB7QGxpbmsgc3JjL2NsaWVudC9QZXJmb3JtYW5jZS5qc35QZXJmb3JtYW5jZX0gb24gdGhlIGNsaWVudCBzaWRlIGNhbGxzIGl0cyB7QGxpbmsgc3JjL2NsaWVudC9QZXJmb3JtYW5jZS5qc35QZXJmb3JtYW5jZSNkb25lfSBtZXRob2QsIG9yIGlmIHRoZSBjbGllbnQgZGlzY29ubmVjdGVkIGZyb20gdGhlIHNlcnZlcikuXG4gKlxuICogVGhlIGJhc2UgY2xhc3MgYWxzbyBrZWVwcyB0cmFjayBvZiB0aGUgY2xpZW50cyB3aG8gYXJlIGN1cnJlbnRseSBpbiB0aGUgcGVyZm9ybWFuY2UgKCppLmUuKiB3aG8gZW50ZXJlZCBidXQgbm90IGV4aXRlZCB5ZXQpIGluIHRoZSBhcnJheSBgdGhpcy5jbGllbnRzYC5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9jbGllbnQvQ2xpZW50UGVyZm9ybWFuY2UuanN+Q2xpZW50UGVyZm9ybWFuY2V9IG9uIHRoZSBjbGllbnQgc2lkZS4pXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlcnZlckV4cGVyaWVuY2UgZXh0ZW5kcyBTZXJ2ZXJBY3Rpdml0eSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNsaWVudFR5cGUgLSBUaGUgY2xpZW50IHR5cGUgdGhlIGV4cGVyaWVuY2Ugc2hvdWxkIGJlXG4gICAqICBtYXBwZWQgdG8uIF8obm90ZTogaXMgdXNlZCBhcyB0aGUgaWQgb2YgdGhlIGFjdGl2aXR5KV9cbiAgICovXG4gIGNvbnN0cnVjdG9yKGNsaWVudFR5cGUpIHtcbiAgICBzdXBlcihjbGllbnRUeXBlKTtcblxuICAgIHRoaXMuYWRkQ2xpZW50VHlwZShjbGllbnRUeXBlKTtcblxuICAgIHRoaXMuX2Vycm9yUmVwb3J0ZXIgPSB0aGlzLnJlcXVpcmUoJ2Vycm9yLXJlcG9ydGVyJyk7XG5cbiAgICAvKipcbiAgICAgKiBMaXN0IG9mIHRoZSBjbGllbnRzIHdobyBhcmUgY3VycmVudGx5IGluIHRoZSBwZXJmb3JtYW5jZSAoKmkuZS4qIHdobyBlbnRlcmVkIHRoZSBwZXJmb3JtYW5jZSBhbmQgaGF2ZSBub3QgZXhpdGVkIGl0IHlldCkuXG4gICAgICogQHR5cGUge0NsaWVudFtdfVxuICAgICAqL1xuICAgIHRoaXMuY2xpZW50cyA9IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBjbGllbnQgY29ubmVjdHMgdG8gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCBDb25uZWN0ZWQgY2xpZW50LlxuICAgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICAvLyBMaXN0ZW4gZm9yIHRoZSBgJ3N0YXJ0J2AgYW5kIGAnZG9uZSdgIHNvY2tldCBtZXNzYWdlcyBmcm9tIHRoZSBjbGllbnQuXG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3N0YXJ0JywgKCkgPT4gdGhpcy5lbnRlcihjbGllbnQpKTtcbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAnZG9uZScsICgpID0+IHRoaXMuZXhpdChjbGllbnQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgY2xpZW50IGRpc2Nvbm5lY3RzIGZyb20gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCBEaXNjb25uZWN0ZWQgY2xpZW50LlxuICAgKi9cbiAgZGlzY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5kaXNjb25uZWN0KGNsaWVudCk7XG5cbiAgICAvLyBDYWxsIHRoZSBgZXhpdGAgbWV0aG9kIGlmIHRoZSBjbGllbnQgcHJldmlvdXNseSBlbnRlcmVkIHRoZSBwZXJmb3JtYW5jZS5cbiAgICBpZiAoY2xpZW50Lm1vZHVsZXNbdGhpcy5pZF0uZW50ZXJlZClcbiAgICAgIHRoaXMuZXhpdChjbGllbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBjbGllbnQgc3RhcnRzIHRoZSBwZXJmb3JtYW5jZSBvbiB0aGUgY2xpZW50IHNpZGUuXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgQ2xpZW50IHdobyBlbnRlcnMgdGhlIHBlcmZvcm1hbmNlLlxuICAgKi9cbiAgZW50ZXIoY2xpZW50KSB7XG4gICAgLy8gQWRkIHRoZSBjbGllbnQgdG8gdGhlIGB0aGlzLmNsaWVudHNgIGFycmF5LlxuICAgIHRoaXMuY2xpZW50cy5wdXNoKGNsaWVudCk7XG5cbiAgICAvLyBTZXQgZmxhZy5cbiAgICBjbGllbnQubW9kdWxlc1t0aGlzLmlkXS5lbnRlcmVkID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgY2xpZW50IGV4aXRzIHRoZSBwZXJmb3JtYW5jZSBvbiB0aGUgY2xpZW50IHNpZGUgKCppLmUuKiB3aGVuIHRoZSBgZG9uZWAgbWV0aG9kIG9mIHRoZSBjbGllbnQgc2lkZSBtb2R1bGUgaXMgY2FsbGVkLCBvciB3aGVuIHRoZSBjbGllbnQgZGlzY29ubmVjdHMgZnJvbSB0aGUgc2VydmVyKS5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCBDbGllbnQgd2hvIGV4aXRzIHRoZSBwZXJmb3JtYW5jZS5cbiAgICovXG4gIGV4aXQoY2xpZW50KSB7XG4gICAgLy8gUmVtb3ZlIHRoZSBjbGllbnQgZnJvbSB0aGUgYHRoaXMuY2xpZW50c2AgYXJyYXkuXG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmNsaWVudHMuaW5kZXhPZihjbGllbnQpO1xuICAgIGlmIChpbmRleCA+PSAwKVxuICAgICAgdGhpcy5jbGllbnRzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICAvLyBSZW1vdmUgZmxhZy5cbiAgICBjbGllbnQubW9kdWxlc1t0aGlzLmlkXS5lbnRlcmVkID0gZmFsc2U7XG4gIH1cbn1cbiJdfQ==