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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvc2NlbmVzL1NlcnZlckV4cGVyaWVuY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztrQ0FBMkIsd0JBQXdCOzs7Ozs7Ozs7Ozs7Ozs7O0lBYzlCLGdCQUFnQjtZQUFoQixnQkFBZ0I7Ozs7Ozs7O0FBTXhCLFdBTlEsZ0JBQWdCLENBTXZCLFVBQVUsRUFBRTswQkFOTCxnQkFBZ0I7O0FBT2pDLCtCQVBpQixnQkFBZ0IsNkNBTzNCLFVBQVUsRUFBRTs7QUFFbEIsUUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQzs7Ozs7O0FBTS9CLFFBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0dBQ25COzs7Ozs7O2VBaEJrQixnQkFBZ0I7O1dBc0I1QixpQkFBQyxNQUFNLEVBQUU7OztBQUNkLGlDQXZCaUIsZ0JBQWdCLHlDQXVCbkIsTUFBTSxFQUFFOzs7QUFHdEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFO2VBQU0sTUFBSyxLQUFLLENBQUMsTUFBTSxDQUFDO09BQUEsQ0FBQyxDQUFDO0FBQ3hELFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRTtlQUFNLE1BQUssSUFBSSxDQUFDLE1BQU0sQ0FBQztPQUFBLENBQUMsQ0FBQztLQUN2RDs7Ozs7Ozs7V0FNUyxvQkFBQyxNQUFNLEVBQUU7QUFDakIsaUNBbkNpQixnQkFBZ0IsNENBbUNoQixNQUFNLEVBQUU7OztBQUd6QixVQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sRUFDakMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUNyQjs7Ozs7Ozs7V0FNSSxlQUFDLE1BQU0sRUFBRTs7QUFFWixVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzs7O0FBRzFCLFlBQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7S0FDeEM7Ozs7Ozs7O1dBTUcsY0FBQyxNQUFNLEVBQUU7O0FBRVgsVUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0MsVUFBSSxLQUFLLElBQUksQ0FBQyxFQUNaLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQzs7O0FBR2hDLFlBQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7S0FDekM7OztTQWxFa0IsZ0JBQWdCOzs7cUJBQWhCLGdCQUFnQiIsImZpbGUiOiJzcmMvc2VydmVyL3NjZW5lcy9TZXJ2ZXJFeHBlcmllbmNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZlckFjdGl2aXR5IGZyb20gJy4uL2NvcmUvU2VydmVyQWN0aXZpdHknO1xuXG5cbi8qKlxuICogQmFzZSBjbGFzcyB1c2VkIHRvIGJ1aWxkIGEgcGVyZm9ybWFuY2Ugb24gdGhlIGNsaWVudCBzaWRlLlxuICpcbiAqIEFsb25nIHdpdGggdGhlIGNsYXNzaWMge0BsaW5rIFBlcmZvcm1hbmNlI2Nvbm5lY3R9IGFuZCB7QGxpbmsgUGVyZm9ybWFuY2UjZGlzY29ubmVjdH0gbWV0aG9kcywgdGhlIGJhc2UgY2xhc3MgaGFzIHR3byBhZGRpdGlvbmFsIG1ldGhvZHM6XG4gKiAtIHtAbGluayBQZXJmb3JtYW5jZSNlbnRlcn06IGNhbGxlZCB3aGVuIHRoZSBjbGllbnQgZW50ZXJzIHRoZSBwZXJmb3JtYW5jZSAoKmkuZS4qIHdoZW4gdGhlIHtAbGluayBzcmMvY2xpZW50L1BlcmZvcm1hbmNlLmpzflBlcmZvcm1hbmNlfSBvbiB0aGUgY2xpZW50IHNpZGUgY2FsbHMgaXRzIHtAbGluayBzcmMvY2xpZW50L1BlcmZvcm1hbmNlLmpzflBlcmZvcm1hbmNlI3N0YXJ0fSBtZXRob2QpO1xuICogLSB7QGxpbmsgUGVyZm9ybWFuY2UjZXhpdH06IGNhbGxlZCB3aGVuIHRoZSBjbGllbnQgbGVhdmVzIHRoZSBwZXJmb3JtYW5jZSAoKmkuZS4qIHdoZW4gdGhlIHtAbGluayBzcmMvY2xpZW50L1BlcmZvcm1hbmNlLmpzflBlcmZvcm1hbmNlfSBvbiB0aGUgY2xpZW50IHNpZGUgY2FsbHMgaXRzIHtAbGluayBzcmMvY2xpZW50L1BlcmZvcm1hbmNlLmpzflBlcmZvcm1hbmNlI2RvbmV9IG1ldGhvZCwgb3IgaWYgdGhlIGNsaWVudCBkaXNjb25uZWN0ZWQgZnJvbSB0aGUgc2VydmVyKS5cbiAqXG4gKiBUaGUgYmFzZSBjbGFzcyBhbHNvIGtlZXBzIHRyYWNrIG9mIHRoZSBjbGllbnRzIHdobyBhcmUgY3VycmVudGx5IGluIHRoZSBwZXJmb3JtYW5jZSAoKmkuZS4qIHdobyBlbnRlcmVkIGJ1dCBub3QgZXhpdGVkIHlldCkgaW4gdGhlIGFycmF5IGB0aGlzLmNsaWVudHNgLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL2NsaWVudC9DbGllbnRQZXJmb3JtYW5jZS5qc35DbGllbnRQZXJmb3JtYW5jZX0gb24gdGhlIGNsaWVudCBzaWRlLilcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmVyRXhwZXJpZW5jZSBleHRlbmRzIFNlcnZlckFjdGl2aXR5IHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2xpZW50VHlwZSAtIFRoZSBjbGllbnQgdHlwZSB0aGUgZXhwZXJpZW5jZSBzaG91bGQgYmVcbiAgICogIG1hcHBlZCB0by4gXyhub3RlOiBpcyB1c2VkIGFzIHRoZSBpZCBvZiB0aGUgYWN0aXZpdHkpX1xuICAgKi9cbiAgY29uc3RydWN0b3IoY2xpZW50VHlwZSkge1xuICAgIHN1cGVyKGNsaWVudFR5cGUpO1xuXG4gICAgdGhpcy5hZGRDbGllbnRUeXBlKGNsaWVudFR5cGUpO1xuXG4gICAgLyoqXG4gICAgICogTGlzdCBvZiB0aGUgY2xpZW50cyB3aG8gYXJlIGN1cnJlbnRseSBpbiB0aGUgcGVyZm9ybWFuY2UgKCppLmUuKiB3aG8gZW50ZXJlZCB0aGUgcGVyZm9ybWFuY2UgYW5kIGhhdmUgbm90IGV4aXRlZCBpdCB5ZXQpLlxuICAgICAqIEB0eXBlIHtDbGllbnRbXX1cbiAgICAgKi9cbiAgICB0aGlzLmNsaWVudHMgPSBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgY2xpZW50IGNvbm5lY3RzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgQ29ubmVjdGVkIGNsaWVudC5cbiAgICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgLy8gTGlzdGVuIGZvciB0aGUgYCdzdGFydCdgIGFuZCBgJ2RvbmUnYCBzb2NrZXQgbWVzc2FnZXMgZnJvbSB0aGUgY2xpZW50LlxuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdzdGFydCcsICgpID0+IHRoaXMuZW50ZXIoY2xpZW50KSk7XG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ2RvbmUnLCAoKSA9PiB0aGlzLmV4aXQoY2xpZW50KSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGNsaWVudCBkaXNjb25uZWN0cyBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgRGlzY29ubmVjdGVkIGNsaWVudC5cbiAgICovXG4gIGRpc2Nvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuZGlzY29ubmVjdChjbGllbnQpO1xuXG4gICAgLy8gQ2FsbCB0aGUgYGV4aXRgIG1ldGhvZCBpZiB0aGUgY2xpZW50IHByZXZpb3VzbHkgZW50ZXJlZCB0aGUgcGVyZm9ybWFuY2UuXG4gICAgaWYgKGNsaWVudC5tb2R1bGVzW3RoaXMuaWRdLmVudGVyZWQpXG4gICAgICB0aGlzLmV4aXQoY2xpZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgY2xpZW50IHN0YXJ0cyB0aGUgcGVyZm9ybWFuY2Ugb24gdGhlIGNsaWVudCBzaWRlLlxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IENsaWVudCB3aG8gZW50ZXJzIHRoZSBwZXJmb3JtYW5jZS5cbiAgICovXG4gIGVudGVyKGNsaWVudCkge1xuICAgIC8vIEFkZCB0aGUgY2xpZW50IHRvIHRoZSBgdGhpcy5jbGllbnRzYCBhcnJheS5cbiAgICB0aGlzLmNsaWVudHMucHVzaChjbGllbnQpO1xuXG4gICAgLy8gU2V0IGZsYWcuXG4gICAgY2xpZW50Lm1vZHVsZXNbdGhpcy5pZF0uZW50ZXJlZCA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGNsaWVudCBleGl0cyB0aGUgcGVyZm9ybWFuY2Ugb24gdGhlIGNsaWVudCBzaWRlICgqaS5lLiogd2hlbiB0aGUgYGRvbmVgIG1ldGhvZCBvZiB0aGUgY2xpZW50IHNpZGUgbW9kdWxlIGlzIGNhbGxlZCwgb3Igd2hlbiB0aGUgY2xpZW50IGRpc2Nvbm5lY3RzIGZyb20gdGhlIHNlcnZlcikuXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgQ2xpZW50IHdobyBleGl0cyB0aGUgcGVyZm9ybWFuY2UuXG4gICAqL1xuICBleGl0KGNsaWVudCkge1xuICAgIC8vIFJlbW92ZSB0aGUgY2xpZW50IGZyb20gdGhlIGB0aGlzLmNsaWVudHNgIGFycmF5LlxuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5jbGllbnRzLmluZGV4T2YoY2xpZW50KTtcbiAgICBpZiAoaW5kZXggPj0gMClcbiAgICAgIHRoaXMuY2xpZW50cy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgLy8gUmVtb3ZlIGZsYWcuXG4gICAgY2xpZW50Lm1vZHVsZXNbdGhpcy5pZF0uZW50ZXJlZCA9IGZhbHNlO1xuICB9XG59XG4iXX0=