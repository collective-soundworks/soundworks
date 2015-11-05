'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var EventEmitter = require('events').EventEmitter; // TODO: remove EventEmitter? (Implement our own listeners)

/**
 * The {@link ServerModule} base class is used to create a *Soundworks* module on the server side.
 * Each module should have a {@link ServerModule#connect} and a {@link ServerModule#disconnect} method.
 * Any module mapped to the type of client `clientType` (thanks to the {@link server#map} method) would call its {@link ServerModule#connect} method when such a client connects to the server, and its {@link ServerModule#disconnect} method when such a client disconnects from the server.
 * @example
 * class MyModule extends serverSide.Module {
 *   constructor('my-module-name') {
 *     ... // anything the constructor needs
 *   }
 *
 *   connect(client) {
 *     ... // what the module has to do when a client connects to the server
 *   }
 *
 *   disconnect(client) {
 *     ... // what the module has to do when a client disconnects from the server
 *   }
 * }
 */

var ServerModule = (function (_EventEmitter) {
  _inherits(ServerModule, _EventEmitter);

  // export default class ServerModule extends EventEmitter {
  /**
    * Creates an instance of the class.
    * @param {Object} [options={}] The options.
    * @param {string} [options.name='unnamed'] The name of the module.
   */

  function ServerModule(name) {
    _classCallCheck(this, ServerModule);

    _get(Object.getPrototypeOf(ServerModule.prototype), 'constructor', this).call(this);

    /**
     * The name of the module.
     * @type {string}
     */
    this.name = name;
  }

  /**
   * Called when the `client` connects to the server.
   * This method should handle the logic of the module on the server side. For instance, it can take care of the communication with the client side module by setting up WebSocket message listeners and sending WebSocket messages, or it can add the client to a list to keep track of all the connected clients.
   * @param {ServerClient} client The connected client.
   */

  _createClass(ServerModule, [{
    key: 'connect',
    value: function connect(client) {
      // Setup an object
      client.modules[this.name] = {};
    }

    /**
     * Called when the client `client` disconnects from the server.
     * This method should handle the logic when that happens. For instance, it can remove the socket message listeners, or remove the client from the list that keeps track of the connected clients.
     * @param {ServerClient} client The disconnected client.
     */
  }, {
    key: 'disconnect',
    value: function disconnect(client) {
      // delete client.modules[this.name] // TODO?
    }
  }]);

  return ServerModule;
})(EventEmitter);

module.exports = ServerModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvTW9kdWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7Ozs7Ozs7OztBQUViLElBQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxZQUFZLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFxQjlDLFlBQVk7WUFBWixZQUFZOzs7Ozs7Ozs7QUFPTCxXQVBQLFlBQVksQ0FPSixJQUFJLEVBQUU7MEJBUGQsWUFBWTs7QUFRZCwrQkFSRSxZQUFZLDZDQVFOOzs7Ozs7QUFNUixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztHQUNsQjs7Ozs7Ozs7ZUFmRyxZQUFZOztXQXNCVCxpQkFBQyxNQUFNLEVBQUU7O0FBRWQsWUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0tBQ2hDOzs7Ozs7Ozs7V0FPUyxvQkFBQyxNQUFNLEVBQUU7O0tBRWxCOzs7U0FsQ0csWUFBWTtHQUFTLFlBQVk7O0FBcUN2QyxNQUFNLENBQUMsT0FBTyxHQUFHLFlBQVksQ0FBQyIsImZpbGUiOiJzcmMvc2VydmVyL01vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuY29uc3QgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyOyAvLyBUT0RPOiByZW1vdmUgRXZlbnRFbWl0dGVyPyAoSW1wbGVtZW50IG91ciBvd24gbGlzdGVuZXJzKVxuXG4vKipcbiAqIFRoZSB7QGxpbmsgU2VydmVyTW9kdWxlfSBiYXNlIGNsYXNzIGlzIHVzZWQgdG8gY3JlYXRlIGEgKlNvdW5kd29ya3MqIG1vZHVsZSBvbiB0aGUgc2VydmVyIHNpZGUuXG4gKiBFYWNoIG1vZHVsZSBzaG91bGQgaGF2ZSBhIHtAbGluayBTZXJ2ZXJNb2R1bGUjY29ubmVjdH0gYW5kIGEge0BsaW5rIFNlcnZlck1vZHVsZSNkaXNjb25uZWN0fSBtZXRob2QuXG4gKiBBbnkgbW9kdWxlIG1hcHBlZCB0byB0aGUgdHlwZSBvZiBjbGllbnQgYGNsaWVudFR5cGVgICh0aGFua3MgdG8gdGhlIHtAbGluayBzZXJ2ZXIjbWFwfSBtZXRob2QpIHdvdWxkIGNhbGwgaXRzIHtAbGluayBTZXJ2ZXJNb2R1bGUjY29ubmVjdH0gbWV0aG9kIHdoZW4gc3VjaCBhIGNsaWVudCBjb25uZWN0cyB0byB0aGUgc2VydmVyLCBhbmQgaXRzIHtAbGluayBTZXJ2ZXJNb2R1bGUjZGlzY29ubmVjdH0gbWV0aG9kIHdoZW4gc3VjaCBhIGNsaWVudCBkaXNjb25uZWN0cyBmcm9tIHRoZSBzZXJ2ZXIuXG4gKiBAZXhhbXBsZVxuICogY2xhc3MgTXlNb2R1bGUgZXh0ZW5kcyBzZXJ2ZXJTaWRlLk1vZHVsZSB7XG4gKiAgIGNvbnN0cnVjdG9yKCdteS1tb2R1bGUtbmFtZScpIHtcbiAqICAgICAuLi4gLy8gYW55dGhpbmcgdGhlIGNvbnN0cnVjdG9yIG5lZWRzXG4gKiAgIH1cbiAqXG4gKiAgIGNvbm5lY3QoY2xpZW50KSB7XG4gKiAgICAgLi4uIC8vIHdoYXQgdGhlIG1vZHVsZSBoYXMgdG8gZG8gd2hlbiBhIGNsaWVudCBjb25uZWN0cyB0byB0aGUgc2VydmVyXG4gKiAgIH1cbiAqXG4gKiAgIGRpc2Nvbm5lY3QoY2xpZW50KSB7XG4gKiAgICAgLi4uIC8vIHdoYXQgdGhlIG1vZHVsZSBoYXMgdG8gZG8gd2hlbiBhIGNsaWVudCBkaXNjb25uZWN0cyBmcm9tIHRoZSBzZXJ2ZXJcbiAqICAgfVxuICogfVxuICovXG5jbGFzcyBTZXJ2ZXJNb2R1bGUgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuLy8gZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmVyTW9kdWxlIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgLyoqXG4gICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gVGhlIG9wdGlvbnMuXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMubmFtZT0ndW5uYW1lZCddIFRoZSBuYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBgY2xpZW50YCBjb25uZWN0cyB0byB0aGUgc2VydmVyLlxuICAgKiBUaGlzIG1ldGhvZCBzaG91bGQgaGFuZGxlIHRoZSBsb2dpYyBvZiB0aGUgbW9kdWxlIG9uIHRoZSBzZXJ2ZXIgc2lkZS4gRm9yIGluc3RhbmNlLCBpdCBjYW4gdGFrZSBjYXJlIG9mIHRoZSBjb21tdW5pY2F0aW9uIHdpdGggdGhlIGNsaWVudCBzaWRlIG1vZHVsZSBieSBzZXR0aW5nIHVwIFdlYlNvY2tldCBtZXNzYWdlIGxpc3RlbmVycyBhbmQgc2VuZGluZyBXZWJTb2NrZXQgbWVzc2FnZXMsIG9yIGl0IGNhbiBhZGQgdGhlIGNsaWVudCB0byBhIGxpc3QgdG8ga2VlcCB0cmFjayBvZiBhbGwgdGhlIGNvbm5lY3RlZCBjbGllbnRzLlxuICAgKiBAcGFyYW0ge1NlcnZlckNsaWVudH0gY2xpZW50IFRoZSBjb25uZWN0ZWQgY2xpZW50LlxuICAgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICAvLyBTZXR1cCBhbiBvYmplY3RcbiAgICBjbGllbnQubW9kdWxlc1t0aGlzLm5hbWVdID0ge307XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGNsaWVudCBgY2xpZW50YCBkaXNjb25uZWN0cyBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIFRoaXMgbWV0aG9kIHNob3VsZCBoYW5kbGUgdGhlIGxvZ2ljIHdoZW4gdGhhdCBoYXBwZW5zLiBGb3IgaW5zdGFuY2UsIGl0IGNhbiByZW1vdmUgdGhlIHNvY2tldCBtZXNzYWdlIGxpc3RlbmVycywgb3IgcmVtb3ZlIHRoZSBjbGllbnQgZnJvbSB0aGUgbGlzdCB0aGF0IGtlZXBzIHRyYWNrIG9mIHRoZSBjb25uZWN0ZWQgY2xpZW50cy5cbiAgICogQHBhcmFtIHtTZXJ2ZXJDbGllbnR9IGNsaWVudCBUaGUgZGlzY29ubmVjdGVkIGNsaWVudC5cbiAgICovXG4gIGRpc2Nvbm5lY3QoY2xpZW50KSB7XG4gICAgLy8gZGVsZXRlIGNsaWVudC5tb2R1bGVzW3RoaXMubmFtZV0gLy8gVE9ETz9cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNlcnZlck1vZHVsZTtcbiJdfQ==