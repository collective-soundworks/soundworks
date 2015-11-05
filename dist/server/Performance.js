'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var ServerModule = require('./ServerModule');
// import ServerModule from './ServerModule.es6.js';

/**
 * The {@link ServerPerformance} base class constitutes a basis on which to build a performance on the server side.
 * Its particularity is to keep track of the clients who are currently in the performance with the array `this.clients`, and to have the `enter` and `exit` methods that inform the module when the client entered the performance (*i.e.* when the `performance` on the client side called its `start` method) and left it (*i.e.* when the `performance` on the client side called its `done` method, or if the client disconnected from the server).
 *
 */

var ServerPerformance = (function (_ServerModule) {
  _inherits(ServerPerformance, _ServerModule);

  // export default class ServerPerformance extends ServerModule {
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
     * Contains the list of the clients who are currently in the performance (*i.e.* who started the performance and have not exited it yet).
     * @type {ServerClient[]}
     */
    this.clients = [];
  }

  /**
   * Called when the client connects to the server.
   * @param {ServerClient} client The connected client.
   * @private
   */

  _createClass(ServerPerformance, [{
    key: 'connect',
    value: function connect(client) {
      var _this = this;

      _get(Object.getPrototypeOf(ServerPerformance.prototype), 'connect', this).call(this, client);

      // Listen for the `'performance:start'` socket message from the client.
      client.receive(this.name + ':start', function () {
        _this.enter(client);
      });

      // Listen for the `'performance:done'` socket message from the client.
      client.receive(this.name + ':done', function () {
        _this.exit(client);
      });
    }

    /**
     * Called when the client disconnects from the server.
     * @param {ServerClient} client The connected client.
     * @private
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
     * @param {ServerClient} client The client that starts the performance.
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
     * @param {ServerClient} client The client that exits the performance.
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
})(ServerModule);

module.exports = ServerPerformance;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvUGVyZm9ybWFuY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7Ozs7Ozs7O0FBRWIsSUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7Ozs7Ozs7OztJQVF6QyxpQkFBaUI7WUFBakIsaUJBQWlCOzs7Ozs7Ozs7QUFPVixXQVBQLGlCQUFpQixHQU9LO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFQcEIsaUJBQWlCOztBQVFuQiwrQkFSRSxpQkFBaUIsNkNBUWIsT0FBTyxDQUFDLElBQUksSUFBSSxhQUFhLEVBQUU7Ozs7OztBQU1yQyxRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztHQUNuQjs7Ozs7Ozs7ZUFmRyxpQkFBaUI7O1dBc0JkLGlCQUFDLE1BQU0sRUFBRTs7O0FBQ2QsaUNBdkJFLGlCQUFpQix5Q0F1QkwsTUFBTSxFQUFFOzs7QUFHdEIsWUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsRUFBRSxZQUFNO0FBQ3pDLGNBQUssS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO09BQ3BCLENBQUMsQ0FBQzs7O0FBR0gsWUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sRUFBRSxZQUFNO0FBQ3hDLGNBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO09BQ25CLENBQUMsQ0FBQztLQUNKOzs7Ozs7Ozs7V0FPUyxvQkFBQyxNQUFNLEVBQUU7QUFDakIsaUNBMUNFLGlCQUFpQiw0Q0EwQ0YsTUFBTSxFQUFFOzs7QUFHekIsVUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQ25DLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDckI7Ozs7Ozs7O1dBTUksZUFBQyxNQUFNLEVBQUU7O0FBRVosVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7OztBQUcxQixZQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0tBQzFDOzs7Ozs7OztXQU1HLGNBQUMsTUFBTSxFQUFFOztBQUVYLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNDLFVBQUksS0FBSyxJQUFJLENBQUMsRUFDWixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7OztBQUdoQyxZQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0tBQzNDOzs7U0F6RUcsaUJBQWlCO0dBQVMsWUFBWTs7QUE0RTVDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsaUJBQWlCLENBQUMiLCJmaWxlIjoic3JjL3NlcnZlci9QZXJmb3JtYW5jZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuY29uc3QgU2VydmVyTW9kdWxlID0gcmVxdWlyZSgnLi9TZXJ2ZXJNb2R1bGUnKTtcbi8vIGltcG9ydCBTZXJ2ZXJNb2R1bGUgZnJvbSAnLi9TZXJ2ZXJNb2R1bGUuZXM2LmpzJztcblxuLyoqXG4gKiBUaGUge0BsaW5rIFNlcnZlclBlcmZvcm1hbmNlfSBiYXNlIGNsYXNzIGNvbnN0aXR1dGVzIGEgYmFzaXMgb24gd2hpY2ggdG8gYnVpbGQgYSBwZXJmb3JtYW5jZSBvbiB0aGUgc2VydmVyIHNpZGUuXG4gKiBJdHMgcGFydGljdWxhcml0eSBpcyB0byBrZWVwIHRyYWNrIG9mIHRoZSBjbGllbnRzIHdobyBhcmUgY3VycmVudGx5IGluIHRoZSBwZXJmb3JtYW5jZSB3aXRoIHRoZSBhcnJheSBgdGhpcy5jbGllbnRzYCwgYW5kIHRvIGhhdmUgdGhlIGBlbnRlcmAgYW5kIGBleGl0YCBtZXRob2RzIHRoYXQgaW5mb3JtIHRoZSBtb2R1bGUgd2hlbiB0aGUgY2xpZW50IGVudGVyZWQgdGhlIHBlcmZvcm1hbmNlICgqaS5lLiogd2hlbiB0aGUgYHBlcmZvcm1hbmNlYCBvbiB0aGUgY2xpZW50IHNpZGUgY2FsbGVkIGl0cyBgc3RhcnRgIG1ldGhvZCkgYW5kIGxlZnQgaXQgKCppLmUuKiB3aGVuIHRoZSBgcGVyZm9ybWFuY2VgIG9uIHRoZSBjbGllbnQgc2lkZSBjYWxsZWQgaXRzIGBkb25lYCBtZXRob2QsIG9yIGlmIHRoZSBjbGllbnQgZGlzY29ubmVjdGVkIGZyb20gdGhlIHNlcnZlcikuXG4gKlxuICovXG5jbGFzcyBTZXJ2ZXJQZXJmb3JtYW5jZSBleHRlbmRzIFNlcnZlck1vZHVsZSB7XG4vLyBleHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2ZXJQZXJmb3JtYW5jZSBleHRlbmRzIFNlcnZlck1vZHVsZSB7XG4gIC8qKlxuICAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiB0aGUgY2xhc3MuXG4gICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMubmFtZT0ncGVyZm9ybWFuY2UnXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ3BlcmZvcm1hbmNlJyk7XG5cbiAgICAvKipcbiAgICAgKiBDb250YWlucyB0aGUgbGlzdCBvZiB0aGUgY2xpZW50cyB3aG8gYXJlIGN1cnJlbnRseSBpbiB0aGUgcGVyZm9ybWFuY2UgKCppLmUuKiB3aG8gc3RhcnRlZCB0aGUgcGVyZm9ybWFuY2UgYW5kIGhhdmUgbm90IGV4aXRlZCBpdCB5ZXQpLlxuICAgICAqIEB0eXBlIHtTZXJ2ZXJDbGllbnRbXX1cbiAgICAgKi9cbiAgICB0aGlzLmNsaWVudHMgPSBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgY2xpZW50IGNvbm5lY3RzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7U2VydmVyQ2xpZW50fSBjbGllbnQgVGhlIGNvbm5lY3RlZCBjbGllbnQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIC8vIExpc3RlbiBmb3IgdGhlIGAncGVyZm9ybWFuY2U6c3RhcnQnYCBzb2NrZXQgbWVzc2FnZSBmcm9tIHRoZSBjbGllbnQuXG4gICAgY2xpZW50LnJlY2VpdmUodGhpcy5uYW1lICsgJzpzdGFydCcsICgpID0+IHtcbiAgICAgIHRoaXMuZW50ZXIoY2xpZW50KTtcbiAgICB9KTtcblxuICAgIC8vIExpc3RlbiBmb3IgdGhlIGAncGVyZm9ybWFuY2U6ZG9uZSdgIHNvY2tldCBtZXNzYWdlIGZyb20gdGhlIGNsaWVudC5cbiAgICBjbGllbnQucmVjZWl2ZSh0aGlzLm5hbWUgKyAnOmRvbmUnLCAoKSA9PiB7XG4gICAgICB0aGlzLmV4aXQoY2xpZW50KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgY2xpZW50IGRpc2Nvbm5lY3RzIGZyb20gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtTZXJ2ZXJDbGllbnR9IGNsaWVudCBUaGUgY29ubmVjdGVkIGNsaWVudC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRpc2Nvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuZGlzY29ubmVjdChjbGllbnQpO1xuXG4gICAgLy8gQ2FsbCB0aGUgYGV4aXRgIG1ldGhvZCBpZiB0aGUgY2xpZW50IHByZXZpb3VzbHkgZW50ZXJlZCB0aGUgcGVyZm9ybWFuY2UuXG4gICAgaWYgKGNsaWVudC5tb2R1bGVzW3RoaXMubmFtZV0uZW50ZXJlZClcbiAgICAgIHRoaXMuZXhpdChjbGllbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBjbGllbnQgc3RhcnRzIHRoZSBwZXJmb3JtYW5jZSBvbiB0aGUgY2xpZW50IHNpZGUuXG4gICAqIEBwYXJhbSB7U2VydmVyQ2xpZW50fSBjbGllbnQgVGhlIGNsaWVudCB0aGF0IHN0YXJ0cyB0aGUgcGVyZm9ybWFuY2UuXG4gICAqL1xuICBlbnRlcihjbGllbnQpIHtcbiAgICAvLyBBZGQgdGhlIGNsaWVudCB0byB0aGUgYHRoaXMuY2xpZW50c2AgYXJyYXkuXG4gICAgdGhpcy5jbGllbnRzLnB1c2goY2xpZW50KTtcblxuICAgIC8vIFNldCBmbGFnLlxuICAgIGNsaWVudC5tb2R1bGVzW3RoaXMubmFtZV0uZW50ZXJlZCA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGNsaWVudCBleGl0cyB0aGUgcGVyZm9ybWFuY2Ugb24gdGhlIGNsaWVudCBzaWRlICgqaS5lLiogd2hlbiB0aGUgYGRvbmVgIG1ldGhvZCBvZiB0aGUgY2xpZW50IHNpZGUgbW9kdWxlIGlzIGNhbGxlZCwgb3Igd2hlbiB0aGUgY2xpZW50IGRpc2Nvbm5lY3RzIGZyb20gdGhlIHNlcnZlcikuXG4gICAqIEBwYXJhbSB7U2VydmVyQ2xpZW50fSBjbGllbnQgVGhlIGNsaWVudCB0aGF0IGV4aXRzIHRoZSBwZXJmb3JtYW5jZS5cbiAgICovXG4gIGV4aXQoY2xpZW50KSB7XG4gICAgLy8gUmVtb3ZlIHRoZSBjbGllbnQgZnJvbSB0aGUgYHRoaXMuY2xpZW50c2AgYXJyYXkuXG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmNsaWVudHMuaW5kZXhPZihjbGllbnQpO1xuICAgIGlmIChpbmRleCA+PSAwKVxuICAgICAgdGhpcy5jbGllbnRzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICAvLyBSZW1vdmUgZmxhZy5cbiAgICBjbGllbnQubW9kdWxlc1t0aGlzLm5hbWVdLmVudGVyZWQgPSBmYWxzZTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNlcnZlclBlcmZvcm1hbmNlO1xuIl19