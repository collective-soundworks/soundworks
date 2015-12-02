'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Module2 = require('./Module');

var _Module3 = _interopRequireDefault(_Module2);

/**
 * The {@link Performance} base class constitutes a basis on which to build a performance on the server side.
 * Its particularity is to keep track of the clients who are currently in the performance with the array `this.clients`, and to have the `enter` and `exit` methods that inform the module when the client entered the performance (*i.e.* when the `performance` on the client side called its `start` method) and left it (*i.e.* when the `performance` on the client side called its `done` method, or if the client disconnected from the server).
 *
 */

var Performance = (function (_Module) {
  _inherits(Performance, _Module);

  /**
    * Creates an instance of the class.
    * @param {Object} [options={}] Options.
    * @param {string} [options.name='performance'] Name of the module.
   */

  function Performance() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Performance);

    _get(Object.getPrototypeOf(Performance.prototype), 'constructor', this).call(this, options.name || 'performance');

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

  _createClass(Performance, [{
    key: 'connect',
    value: function connect(client) {
      var _this = this;

      _get(Object.getPrototypeOf(Performance.prototype), 'connect', this).call(this, client);

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
     * @param {ServerClient} client The connected client.
     * @private
     */
  }, {
    key: 'disconnect',
    value: function disconnect(client) {
      _get(Object.getPrototypeOf(Performance.prototype), 'disconnect', this).call(this, client);

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

  return Performance;
})(_Module3['default']);

exports['default'] = Performance;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvUGVyZm9ybWFuY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozt1QkFBbUIsVUFBVTs7Ozs7Ozs7OztJQVFSLFdBQVc7WUFBWCxXQUFXOzs7Ozs7OztBQU1uQixXQU5RLFdBQVcsR0FNSjtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBTkwsV0FBVzs7QUFPNUIsK0JBUGlCLFdBQVcsNkNBT3RCLE9BQU8sQ0FBQyxJQUFJLElBQUksYUFBYSxFQUFFOzs7Ozs7QUFNckMsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7R0FDbkI7Ozs7Ozs7O2VBZGtCLFdBQVc7O1dBcUJ2QixpQkFBQyxNQUFNLEVBQUU7OztBQUNkLGlDQXRCaUIsV0FBVyx5Q0FzQmQsTUFBTSxFQUFFOzs7QUFHdEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFlBQU07QUFDbEMsY0FBSyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7T0FDcEIsQ0FBQyxDQUFDOzs7QUFHSCxVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsWUFBTTtBQUNqQyxjQUFLLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztPQUNuQixDQUFDLENBQUM7S0FDSjs7Ozs7Ozs7O1dBT1Msb0JBQUMsTUFBTSxFQUFFO0FBQ2pCLGlDQXpDaUIsV0FBVyw0Q0F5Q1gsTUFBTSxFQUFFOzs7QUFHekIsVUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQ25DLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDckI7Ozs7Ozs7O1dBTUksZUFBQyxNQUFNLEVBQUU7O0FBRVosVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7OztBQUcxQixZQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0tBQzFDOzs7Ozs7OztXQU1HLGNBQUMsTUFBTSxFQUFFOztBQUVYLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNDLFVBQUksS0FBSyxJQUFJLENBQUMsRUFDWixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7OztBQUdoQyxZQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0tBQzNDOzs7U0F4RWtCLFdBQVc7OztxQkFBWCxXQUFXIiwiZmlsZSI6InNyYy9zZXJ2ZXIvUGVyZm9ybWFuY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTW9kdWxlIGZyb20gJy4vTW9kdWxlJztcblxuXG4vKipcbiAqIFRoZSB7QGxpbmsgUGVyZm9ybWFuY2V9IGJhc2UgY2xhc3MgY29uc3RpdHV0ZXMgYSBiYXNpcyBvbiB3aGljaCB0byBidWlsZCBhIHBlcmZvcm1hbmNlIG9uIHRoZSBzZXJ2ZXIgc2lkZS5cbiAqIEl0cyBwYXJ0aWN1bGFyaXR5IGlzIHRvIGtlZXAgdHJhY2sgb2YgdGhlIGNsaWVudHMgd2hvIGFyZSBjdXJyZW50bHkgaW4gdGhlIHBlcmZvcm1hbmNlIHdpdGggdGhlIGFycmF5IGB0aGlzLmNsaWVudHNgLCBhbmQgdG8gaGF2ZSB0aGUgYGVudGVyYCBhbmQgYGV4aXRgIG1ldGhvZHMgdGhhdCBpbmZvcm0gdGhlIG1vZHVsZSB3aGVuIHRoZSBjbGllbnQgZW50ZXJlZCB0aGUgcGVyZm9ybWFuY2UgKCppLmUuKiB3aGVuIHRoZSBgcGVyZm9ybWFuY2VgIG9uIHRoZSBjbGllbnQgc2lkZSBjYWxsZWQgaXRzIGBzdGFydGAgbWV0aG9kKSBhbmQgbGVmdCBpdCAoKmkuZS4qIHdoZW4gdGhlIGBwZXJmb3JtYW5jZWAgb24gdGhlIGNsaWVudCBzaWRlIGNhbGxlZCBpdHMgYGRvbmVgIG1ldGhvZCwgb3IgaWYgdGhlIGNsaWVudCBkaXNjb25uZWN0ZWQgZnJvbSB0aGUgc2VydmVyKS5cbiAqXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBlcmZvcm1hbmNlIGV4dGVuZHMgTW9kdWxlIHtcbiAgLyoqXG4gICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdwZXJmb3JtYW5jZSddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAncGVyZm9ybWFuY2UnKTtcblxuICAgIC8qKlxuICAgICAqIENvbnRhaW5zIHRoZSBsaXN0IG9mIHRoZSBjbGllbnRzIHdobyBhcmUgY3VycmVudGx5IGluIHRoZSBwZXJmb3JtYW5jZSAoKmkuZS4qIHdobyBzdGFydGVkIHRoZSBwZXJmb3JtYW5jZSBhbmQgaGF2ZSBub3QgZXhpdGVkIGl0IHlldCkuXG4gICAgICogQHR5cGUge1NlcnZlckNsaWVudFtdfVxuICAgICAqL1xuICAgIHRoaXMuY2xpZW50cyA9IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBjbGllbnQgY29ubmVjdHMgdG8gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtTZXJ2ZXJDbGllbnR9IGNsaWVudCBUaGUgY29ubmVjdGVkIGNsaWVudC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgLy8gTGlzdGVuIGZvciB0aGUgYCdwZXJmb3JtYW5jZTpzdGFydCdgIHNvY2tldCBtZXNzYWdlIGZyb20gdGhlIGNsaWVudC5cbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAnc3RhcnQnLCAoKSA9PiB7XG4gICAgICB0aGlzLmVudGVyKGNsaWVudCk7XG4gICAgfSk7XG5cbiAgICAvLyBMaXN0ZW4gZm9yIHRoZSBgJ3BlcmZvcm1hbmNlOmRvbmUnYCBzb2NrZXQgbWVzc2FnZSBmcm9tIHRoZSBjbGllbnQuXG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ2RvbmUnLCAoKSA9PiB7XG4gICAgICB0aGlzLmV4aXQoY2xpZW50KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgY2xpZW50IGRpc2Nvbm5lY3RzIGZyb20gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtTZXJ2ZXJDbGllbnR9IGNsaWVudCBUaGUgY29ubmVjdGVkIGNsaWVudC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRpc2Nvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuZGlzY29ubmVjdChjbGllbnQpO1xuXG4gICAgLy8gQ2FsbCB0aGUgYGV4aXRgIG1ldGhvZCBpZiB0aGUgY2xpZW50IHByZXZpb3VzbHkgZW50ZXJlZCB0aGUgcGVyZm9ybWFuY2UuXG4gICAgaWYgKGNsaWVudC5tb2R1bGVzW3RoaXMubmFtZV0uZW50ZXJlZClcbiAgICAgIHRoaXMuZXhpdChjbGllbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBjbGllbnQgc3RhcnRzIHRoZSBwZXJmb3JtYW5jZSBvbiB0aGUgY2xpZW50IHNpZGUuXG4gICAqIEBwYXJhbSB7U2VydmVyQ2xpZW50fSBjbGllbnQgVGhlIGNsaWVudCB0aGF0IHN0YXJ0cyB0aGUgcGVyZm9ybWFuY2UuXG4gICAqL1xuICBlbnRlcihjbGllbnQpIHtcbiAgICAvLyBBZGQgdGhlIGNsaWVudCB0byB0aGUgYHRoaXMuY2xpZW50c2AgYXJyYXkuXG4gICAgdGhpcy5jbGllbnRzLnB1c2goY2xpZW50KTtcblxuICAgIC8vIFNldCBmbGFnLlxuICAgIGNsaWVudC5tb2R1bGVzW3RoaXMubmFtZV0uZW50ZXJlZCA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGNsaWVudCBleGl0cyB0aGUgcGVyZm9ybWFuY2Ugb24gdGhlIGNsaWVudCBzaWRlICgqaS5lLiogd2hlbiB0aGUgYGRvbmVgIG1ldGhvZCBvZiB0aGUgY2xpZW50IHNpZGUgbW9kdWxlIGlzIGNhbGxlZCwgb3Igd2hlbiB0aGUgY2xpZW50IGRpc2Nvbm5lY3RzIGZyb20gdGhlIHNlcnZlcikuXG4gICAqIEBwYXJhbSB7U2VydmVyQ2xpZW50fSBjbGllbnQgVGhlIGNsaWVudCB0aGF0IGV4aXRzIHRoZSBwZXJmb3JtYW5jZS5cbiAgICovXG4gIGV4aXQoY2xpZW50KSB7XG4gICAgLy8gUmVtb3ZlIHRoZSBjbGllbnQgZnJvbSB0aGUgYHRoaXMuY2xpZW50c2AgYXJyYXkuXG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmNsaWVudHMuaW5kZXhPZihjbGllbnQpO1xuICAgIGlmIChpbmRleCA+PSAwKVxuICAgICAgdGhpcy5jbGllbnRzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICAvLyBSZW1vdmUgZmxhZy5cbiAgICBjbGllbnQubW9kdWxlc1t0aGlzLm5hbWVdLmVudGVyZWQgPSBmYWxzZTtcbiAgfVxufVxuXG4iXX0=