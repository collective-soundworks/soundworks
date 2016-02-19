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

var _coreServer = require('../core/server');

var _coreServer2 = _interopRequireDefault(_coreServer);

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

var ServerExperience = (function (_ServerActivity) {
  _inherits(ServerExperience, _ServerActivity);

  /**
   * Creates an instance of the class.
   * @param {String} clientType - The client type the experience should be
   *  mapped to. _(note: is used as the id of the activity)_
   */

  function ServerExperience() {
    var id = arguments.length <= 0 || arguments[0] === undefined ? _coreServer2['default'].config.defaultClientType : arguments[0];
    var clientType = arguments.length <= 1 || arguments[1] === undefined ? id : arguments[1];
    return (function () {
      _classCallCheck(this, ServerExperience);

      _get(Object.getPrototypeOf(ServerExperience.prototype), 'constructor', this).call(this, id);

      this.addClientType(clientType);

      this._errorReporter = this.require('error-reporter');

      /**
       * List of the clients who are currently in the performance (*i.e.* who entered the performance and have not exited it yet).
       * @type {Client[]}
       */
      this.clients = [];
    }).apply(this, arguments);
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

      // Listen for the `'enter'` and `'exit'` socket messages from the client.
      this.receive(client, 'enter', function () {
        return _this.enter(client);
      });
      this.receive(client, 'exit', function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9zZXJ2ZXIvc2NlbmVzL1NlcnZlckV4cGVyaWVuY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztrQ0FBMkIsd0JBQXdCOzs7OzBCQUNoQyxnQkFBZ0I7Ozs7Ozs7Ozs7Ozs7Ozs7SUFjZCxnQkFBZ0I7WUFBaEIsZ0JBQWdCOzs7Ozs7OztBQU14QixXQU5RLGdCQUFnQjtRQU12QixFQUFFLHlEQUFHLHdCQUFPLE1BQU0sQ0FBQyxpQkFBaUI7UUFBRSxVQUFVLHlEQUFHLEVBQUU7d0JBQUU7NEJBTmhELGdCQUFnQjs7QUFPakMsaUNBUGlCLGdCQUFnQiw2Q0FPM0IsRUFBRSxFQUFFOztBQUVWLFVBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7O0FBRS9CLFVBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOzs7Ozs7QUFNckQsVUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7S0FDbkI7R0FBQTs7Ozs7OztlQWxCa0IsZ0JBQWdCOztXQXdCNUIsaUJBQUMsTUFBTSxFQUFFOzs7QUFDZCxpQ0F6QmlCLGdCQUFnQix5Q0F5Qm5CLE1BQU0sRUFBRTs7O0FBR3RCLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRTtlQUFNLE1BQUssS0FBSyxDQUFDLE1BQU0sQ0FBQztPQUFBLENBQUMsQ0FBQztBQUN4RCxVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUU7ZUFBTSxNQUFLLElBQUksQ0FBQyxNQUFNLENBQUM7T0FBQSxDQUFDLENBQUM7S0FDdkQ7Ozs7Ozs7O1dBTVMsb0JBQUMsTUFBTSxFQUFFO0FBQ2pCLGlDQXJDaUIsZ0JBQWdCLDRDQXFDaEIsTUFBTSxFQUFFOzs7QUFHekIsVUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQ2pDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDckI7Ozs7Ozs7O1dBTUksZUFBQyxNQUFNLEVBQUU7O0FBRVosVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7OztBQUcxQixZQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0tBQ3hDOzs7Ozs7OztXQU1HLGNBQUMsTUFBTSxFQUFFOztBQUVYLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNDLFVBQUksS0FBSyxJQUFJLENBQUMsRUFDWixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7OztBQUdoQyxZQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0tBQ3pDOzs7U0FwRWtCLGdCQUFnQjs7O3FCQUFoQixnQkFBZ0IiLCJmaWxlIjoiL1VzZXJzL21hdHVzemV3c2tpL2Rldi9jb3NpbWEvbGliL3NvdW5kd29ya3Mvc3JjL3NlcnZlci9zY2VuZXMvU2VydmVyRXhwZXJpZW5jZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2ZXJBY3Rpdml0eSBmcm9tICcuLi9jb3JlL1NlcnZlckFjdGl2aXR5JztcbmltcG9ydCBzZXJ2ZXIgZnJvbSAnLi4vY29yZS9zZXJ2ZXInO1xuXG5cbi8qKlxuICogQmFzZSBjbGFzcyB1c2VkIHRvIGJ1aWxkIGEgZXhwZXJpZW5jZSBvbiB0aGUgc2VydmVyIHNpZGUuXG4gKlxuICogQWxvbmcgd2l0aCB0aGUgY2xhc3NpYyB7QGxpbmsgc3JjL3NlcnZlci9jb3JlL1NlcnZlckFjdGl2aXR5I2Nvbm5lY3R9IGFuZCB7QGxpbmsgc3JjL3NlcnZlci9jb3JlL1NlcnZlckFjdGl2aXR5I2Rpc2Nvbm5lY3R9IG1ldGhvZHMsIHRoZSBiYXNlIGNsYXNzIGhhcyB0d28gYWRkaXRpb25hbCBtZXRob2RzOlxuICogLSB7QGxpbmsgU2VydmVyRXhwZXJpZW5jZSNlbnRlcn06IGNhbGxlZCB3aGVuIHRoZSBjbGllbnQgZW50ZXJzIHRoZSBgRXhwZXJpZW5jZWAgKCppLmUuKiB3aGVuIHRoZSB7QGxpbmsgc3JjL2NsaWVudC9zY2VuZS9FeHBlcmllbmNlLmpzfkV4cGVyaWVuY2V9IG9uIHRoZSBjbGllbnQgc2lkZSBjYWxscyBpdHMge0BsaW5rIHNyYy9jbGllbnQvc2NlbmUvRXhwZXJpZW5jZS5qc35FeHBlcmllbmNlI3N0YXJ0fSBtZXRob2QpO1xuICogLSB7QGxpbmsgU2VydmVyRXhwZXJpZW5jZSNleGl0fTogY2FsbGVkIHdoZW4gdGhlIGNsaWVudCBsZWF2ZXMgdGhlIGBFeHBlcmllbmNlYCAoKmkuZS4qIHdoZW4gdGhlIHtAbGluayBzcmMvY2xpZW50L3NjZW5lL0V4cGVyaWVuY2UuanN+RXhwZXJpZW5jZX0gb24gdGhlIGNsaWVudCBzaWRlIGNhbGxzIGl0cyB7QGxpbmsgc3JjL2NsaWVudC9zY2VuZS9FeHBlcmllbmNlLmpzfkV4cGVyaWVuY2UjZG9uZX0gbWV0aG9kLCBvciBpZiB0aGUgY2xpZW50IGRpc2Nvbm5lY3RlZCBmcm9tIHRoZSBzZXJ2ZXIpLlxuICpcbiAqIFRoZSBiYXNlIGNsYXNzIGFsc28ga2VlcHMgdHJhY2sgb2YgdGhlIGNsaWVudHMgd2hvIGFyZSBjdXJyZW50bHkgaW4gdGhlIHBlcmZvcm1hbmNlICgqaS5lLiogd2hvIGVudGVyZWQgYnV0IG5vdCBleGl0ZWQgeWV0KSBpbiB0aGUgYXJyYXkgYHRoaXMuY2xpZW50c2AuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvY2xpZW50L3NjZW5lL0V4cGVyaWVuY2UuanN+RXhwZXJpZW5jZX0gb24gdGhlIGNsaWVudCBzaWRlLilcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmVyRXhwZXJpZW5jZSBleHRlbmRzIFNlcnZlckFjdGl2aXR5IHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2xpZW50VHlwZSAtIFRoZSBjbGllbnQgdHlwZSB0aGUgZXhwZXJpZW5jZSBzaG91bGQgYmVcbiAgICogIG1hcHBlZCB0by4gXyhub3RlOiBpcyB1c2VkIGFzIHRoZSBpZCBvZiB0aGUgYWN0aXZpdHkpX1xuICAgKi9cbiAgY29uc3RydWN0b3IoaWQgPSBzZXJ2ZXIuY29uZmlnLmRlZmF1bHRDbGllbnRUeXBlLCBjbGllbnRUeXBlID0gaWQpIHtcbiAgICBzdXBlcihpZCk7XG5cbiAgICB0aGlzLmFkZENsaWVudFR5cGUoY2xpZW50VHlwZSk7XG5cbiAgICB0aGlzLl9lcnJvclJlcG9ydGVyID0gdGhpcy5yZXF1aXJlKCdlcnJvci1yZXBvcnRlcicpO1xuXG4gICAgLyoqXG4gICAgICogTGlzdCBvZiB0aGUgY2xpZW50cyB3aG8gYXJlIGN1cnJlbnRseSBpbiB0aGUgcGVyZm9ybWFuY2UgKCppLmUuKiB3aG8gZW50ZXJlZCB0aGUgcGVyZm9ybWFuY2UgYW5kIGhhdmUgbm90IGV4aXRlZCBpdCB5ZXQpLlxuICAgICAqIEB0eXBlIHtDbGllbnRbXX1cbiAgICAgKi9cbiAgICB0aGlzLmNsaWVudHMgPSBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgY2xpZW50IGNvbm5lY3RzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgQ29ubmVjdGVkIGNsaWVudC5cbiAgICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgLy8gTGlzdGVuIGZvciB0aGUgYCdlbnRlcidgIGFuZCBgJ2V4aXQnYCBzb2NrZXQgbWVzc2FnZXMgZnJvbSB0aGUgY2xpZW50LlxuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdlbnRlcicsICgpID0+IHRoaXMuZW50ZXIoY2xpZW50KSk7XG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ2V4aXQnLCAoKSA9PiB0aGlzLmV4aXQoY2xpZW50KSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGNsaWVudCBkaXNjb25uZWN0cyBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgRGlzY29ubmVjdGVkIGNsaWVudC5cbiAgICovXG4gIGRpc2Nvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuZGlzY29ubmVjdChjbGllbnQpO1xuXG4gICAgLy8gQ2FsbCB0aGUgYGV4aXRgIG1ldGhvZCBpZiB0aGUgY2xpZW50IHByZXZpb3VzbHkgZW50ZXJlZCB0aGUgcGVyZm9ybWFuY2UuXG4gICAgaWYgKGNsaWVudC5tb2R1bGVzW3RoaXMuaWRdLmVudGVyZWQpXG4gICAgICB0aGlzLmV4aXQoY2xpZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgY2xpZW50IHN0YXJ0cyB0aGUgcGVyZm9ybWFuY2Ugb24gdGhlIGNsaWVudCBzaWRlLlxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IENsaWVudCB3aG8gZW50ZXJzIHRoZSBwZXJmb3JtYW5jZS5cbiAgICovXG4gIGVudGVyKGNsaWVudCkge1xuICAgIC8vIEFkZCB0aGUgY2xpZW50IHRvIHRoZSBgdGhpcy5jbGllbnRzYCBhcnJheS5cbiAgICB0aGlzLmNsaWVudHMucHVzaChjbGllbnQpO1xuXG4gICAgLy8gU2V0IGZsYWcuXG4gICAgY2xpZW50Lm1vZHVsZXNbdGhpcy5pZF0uZW50ZXJlZCA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGNsaWVudCBleGl0cyB0aGUgcGVyZm9ybWFuY2Ugb24gdGhlIGNsaWVudCBzaWRlICgqaS5lLiogd2hlbiB0aGUgYGRvbmVgIG1ldGhvZCBvZiB0aGUgY2xpZW50IHNpZGUgbW9kdWxlIGlzIGNhbGxlZCwgb3Igd2hlbiB0aGUgY2xpZW50IGRpc2Nvbm5lY3RzIGZyb20gdGhlIHNlcnZlcikuXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgQ2xpZW50IHdobyBleGl0cyB0aGUgcGVyZm9ybWFuY2UuXG4gICAqL1xuICBleGl0KGNsaWVudCkge1xuICAgIC8vIFJlbW92ZSB0aGUgY2xpZW50IGZyb20gdGhlIGB0aGlzLmNsaWVudHNgIGFycmF5LlxuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5jbGllbnRzLmluZGV4T2YoY2xpZW50KTtcbiAgICBpZiAoaW5kZXggPj0gMClcbiAgICAgIHRoaXMuY2xpZW50cy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgLy8gUmVtb3ZlIGZsYWcuXG4gICAgY2xpZW50Lm1vZHVsZXNbdGhpcy5pZF0uZW50ZXJlZCA9IGZhbHNlO1xuICB9XG59XG4iXX0=