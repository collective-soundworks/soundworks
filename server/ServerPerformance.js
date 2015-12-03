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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvU2VydmVyUGVyZm9ybWFuY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs2QkFBeUIsZ0JBQWdCOzs7Ozs7Ozs7Ozs7Ozs7O0lBY3BCLGlCQUFpQjtZQUFqQixpQkFBaUI7Ozs7Ozs7O0FBTXpCLFdBTlEsaUJBQWlCLEdBTVY7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQU5MLGlCQUFpQjs7QUFPbEMsK0JBUGlCLGlCQUFpQiw2Q0FPNUIsT0FBTyxDQUFDLElBQUksSUFBSSxhQUFhLEVBQUU7Ozs7OztBQU1yQyxRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztHQUNuQjs7Ozs7OztlQWRrQixpQkFBaUI7O1dBb0I3QixpQkFBQyxNQUFNLEVBQUU7OztBQUNkLGlDQXJCaUIsaUJBQWlCLHlDQXFCcEIsTUFBTSxFQUFFOzs7QUFHdEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFlBQU07QUFDbEMsY0FBSyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7T0FDcEIsQ0FBQyxDQUFDOzs7QUFHSCxVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsWUFBTTtBQUNqQyxjQUFLLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztPQUNuQixDQUFDLENBQUM7S0FDSjs7Ozs7Ozs7V0FNUyxvQkFBQyxNQUFNLEVBQUU7QUFDakIsaUNBdkNpQixpQkFBaUIsNENBdUNqQixNQUFNLEVBQUU7OztBQUd6QixVQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFDbkMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUNyQjs7Ozs7Ozs7V0FNSSxlQUFDLE1BQU0sRUFBRTs7QUFFWixVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzs7O0FBRzFCLFlBQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7S0FDMUM7Ozs7Ozs7O1dBTUcsY0FBQyxNQUFNLEVBQUU7O0FBRVgsVUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0MsVUFBSSxLQUFLLElBQUksQ0FBQyxFQUNaLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQzs7O0FBR2hDLFlBQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7S0FDM0M7OztTQXRFa0IsaUJBQWlCOzs7cUJBQWpCLGlCQUFpQiIsImZpbGUiOiJzcmMvc2VydmVyL1NlcnZlclBlcmZvcm1hbmNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZlck1vZHVsZSBmcm9tICcuL1NlcnZlck1vZHVsZSc7XG5cblxuLyoqXG4gKiBbc2VydmVyXSBCYXNlIGNsYXNzIHVzZWQgdG8gYnVpbGQgYSBwZXJmb3JtYW5jZSBvbiB0aGUgY2xpZW50IHNpZGUuXG4gKlxuICogQWxvbmcgd2l0aCB0aGUgY2xhc3NpYyB7QGxpbmsgUGVyZm9ybWFuY2UjY29ubmVjdH0gYW5kIHtAbGluayBQZXJmb3JtYW5jZSNkaXNjb25uZWN0fSBtZXRob2RzLCB0aGUgYmFzZSBjbGFzcyBoYXMgdHdvIGFkZGl0aW9uYWwgbWV0aG9kczpcbiAqIC0ge0BsaW5rIFBlcmZvcm1hbmNlI2VudGVyfTogY2FsbGVkIHdoZW4gdGhlIGNsaWVudCBlbnRlcnMgdGhlIHBlcmZvcm1hbmNlICgqaS5lLiogd2hlbiB0aGUge0BsaW5rIHNyYy9jbGllbnQvUGVyZm9ybWFuY2UuanN+UGVyZm9ybWFuY2V9IG9uIHRoZSBjbGllbnQgc2lkZSBjYWxscyBpdHMge0BsaW5rIHNyYy9jbGllbnQvUGVyZm9ybWFuY2UuanN+UGVyZm9ybWFuY2Ujc3RhcnR9IG1ldGhvZCk7XG4gKiAtIHtAbGluayBQZXJmb3JtYW5jZSNleGl0fTogY2FsbGVkIHdoZW4gdGhlIGNsaWVudCBsZWF2ZXMgdGhlIHBlcmZvcm1hbmNlICgqaS5lLiogd2hlbiB0aGUge0BsaW5rIHNyYy9jbGllbnQvUGVyZm9ybWFuY2UuanN+UGVyZm9ybWFuY2V9IG9uIHRoZSBjbGllbnQgc2lkZSBjYWxscyBpdHMge0BsaW5rIHNyYy9jbGllbnQvUGVyZm9ybWFuY2UuanN+UGVyZm9ybWFuY2UjZG9uZX0gbWV0aG9kLCBvciBpZiB0aGUgY2xpZW50IGRpc2Nvbm5lY3RlZCBmcm9tIHRoZSBzZXJ2ZXIpLlxuICpcbiAqIFRoZSBiYXNlIGNsYXNzIGFsc28ga2VlcHMgdHJhY2sgb2YgdGhlIGNsaWVudHMgd2hvIGFyZSBjdXJyZW50bHkgaW4gdGhlIHBlcmZvcm1hbmNlICgqaS5lLiogd2hvIGVudGVyZWQgYnV0IG5vdCBleGl0ZWQgeWV0KSBpbiB0aGUgYXJyYXkgYHRoaXMuY2xpZW50c2AuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvY2xpZW50L0NsaWVudFBlcmZvcm1hbmNlLmpzfkNsaWVudFBlcmZvcm1hbmNlfSBvbiB0aGUgY2xpZW50IHNpZGUuKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2ZXJQZXJmb3JtYW5jZSBleHRlbmRzIFNlcnZlck1vZHVsZSB7XG4gIC8qKlxuICAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiB0aGUgY2xhc3MuXG4gICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMubmFtZT0ncGVyZm9ybWFuY2UnXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ3BlcmZvcm1hbmNlJyk7XG5cbiAgICAvKipcbiAgICAgKiBMaXN0IG9mIHRoZSBjbGllbnRzIHdobyBhcmUgY3VycmVudGx5IGluIHRoZSBwZXJmb3JtYW5jZSAoKmkuZS4qIHdobyBlbnRlcmVkIHRoZSBwZXJmb3JtYW5jZSBhbmQgaGF2ZSBub3QgZXhpdGVkIGl0IHlldCkuXG4gICAgICogQHR5cGUge0NsaWVudFtdfVxuICAgICAqL1xuICAgIHRoaXMuY2xpZW50cyA9IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBjbGllbnQgY29ubmVjdHMgdG8gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCBDb25uZWN0ZWQgY2xpZW50LlxuICAgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICAvLyBMaXN0ZW4gZm9yIHRoZSBgJ3BlcmZvcm1hbmNlOnN0YXJ0J2Agc29ja2V0IG1lc3NhZ2UgZnJvbSB0aGUgY2xpZW50LlxuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdzdGFydCcsICgpID0+IHtcbiAgICAgIHRoaXMuZW50ZXIoY2xpZW50KTtcbiAgICB9KTtcblxuICAgIC8vIExpc3RlbiBmb3IgdGhlIGAncGVyZm9ybWFuY2U6ZG9uZSdgIHNvY2tldCBtZXNzYWdlIGZyb20gdGhlIGNsaWVudC5cbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAnZG9uZScsICgpID0+IHtcbiAgICAgIHRoaXMuZXhpdChjbGllbnQpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBjbGllbnQgZGlzY29ubmVjdHMgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IERpc2Nvbm5lY3RlZCBjbGllbnQuXG4gICAqL1xuICBkaXNjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmRpc2Nvbm5lY3QoY2xpZW50KTtcblxuICAgIC8vIENhbGwgdGhlIGBleGl0YCBtZXRob2QgaWYgdGhlIGNsaWVudCBwcmV2aW91c2x5IGVudGVyZWQgdGhlIHBlcmZvcm1hbmNlLlxuICAgIGlmIChjbGllbnQubW9kdWxlc1t0aGlzLm5hbWVdLmVudGVyZWQpXG4gICAgICB0aGlzLmV4aXQoY2xpZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgY2xpZW50IHN0YXJ0cyB0aGUgcGVyZm9ybWFuY2Ugb24gdGhlIGNsaWVudCBzaWRlLlxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IENsaWVudCB3aG8gZW50ZXJzIHRoZSBwZXJmb3JtYW5jZS5cbiAgICovXG4gIGVudGVyKGNsaWVudCkge1xuICAgIC8vIEFkZCB0aGUgY2xpZW50IHRvIHRoZSBgdGhpcy5jbGllbnRzYCBhcnJheS5cbiAgICB0aGlzLmNsaWVudHMucHVzaChjbGllbnQpO1xuXG4gICAgLy8gU2V0IGZsYWcuXG4gICAgY2xpZW50Lm1vZHVsZXNbdGhpcy5uYW1lXS5lbnRlcmVkID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgY2xpZW50IGV4aXRzIHRoZSBwZXJmb3JtYW5jZSBvbiB0aGUgY2xpZW50IHNpZGUgKCppLmUuKiB3aGVuIHRoZSBgZG9uZWAgbWV0aG9kIG9mIHRoZSBjbGllbnQgc2lkZSBtb2R1bGUgaXMgY2FsbGVkLCBvciB3aGVuIHRoZSBjbGllbnQgZGlzY29ubmVjdHMgZnJvbSB0aGUgc2VydmVyKS5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCBDbGllbnQgd2hvIGV4aXRzIHRoZSBwZXJmb3JtYW5jZS5cbiAgICovXG4gIGV4aXQoY2xpZW50KSB7XG4gICAgLy8gUmVtb3ZlIHRoZSBjbGllbnQgZnJvbSB0aGUgYHRoaXMuY2xpZW50c2AgYXJyYXkuXG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmNsaWVudHMuaW5kZXhPZihjbGllbnQpO1xuICAgIGlmIChpbmRleCA+PSAwKVxuICAgICAgdGhpcy5jbGllbnRzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICAvLyBSZW1vdmUgZmxhZy5cbiAgICBjbGllbnQubW9kdWxlc1t0aGlzLm5hbWVdLmVudGVyZWQgPSBmYWxzZTtcbiAgfVxufVxuIl19