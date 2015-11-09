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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvUGVyZm9ybWFuY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozt1QkFBbUIsVUFBVTs7Ozs7Ozs7OztJQVFSLFdBQVc7WUFBWCxXQUFXOzs7Ozs7OztBQU1uQixXQU5RLFdBQVcsR0FNSjtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBTkwsV0FBVzs7QUFPNUIsK0JBUGlCLFdBQVcsNkNBT3RCLE9BQU8sQ0FBQyxJQUFJLElBQUksYUFBYSxFQUFFOzs7Ozs7QUFNckMsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7R0FDbkI7Ozs7Ozs7O2VBZGtCLFdBQVc7O1dBcUJ2QixpQkFBQyxNQUFNLEVBQUU7OztBQUNkLGlDQXRCaUIsV0FBVyx5Q0FzQmQsTUFBTSxFQUFFOzs7QUFHdEIsWUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsRUFBRSxZQUFNO0FBQ3pDLGNBQUssS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO09BQ3BCLENBQUMsQ0FBQzs7O0FBR0gsWUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sRUFBRSxZQUFNO0FBQ3hDLGNBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO09BQ25CLENBQUMsQ0FBQztLQUNKOzs7Ozs7Ozs7V0FPUyxvQkFBQyxNQUFNLEVBQUU7QUFDakIsaUNBekNpQixXQUFXLDRDQXlDWCxNQUFNLEVBQUU7OztBQUd6QixVQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFDbkMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUNyQjs7Ozs7Ozs7V0FNSSxlQUFDLE1BQU0sRUFBRTs7QUFFWixVQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzs7O0FBRzFCLFlBQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7S0FDMUM7Ozs7Ozs7O1dBTUcsY0FBQyxNQUFNLEVBQUU7O0FBRVgsVUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0MsVUFBSSxLQUFLLElBQUksQ0FBQyxFQUNaLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQzs7O0FBR2hDLFlBQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7S0FDM0M7OztTQXhFa0IsV0FBVzs7O3FCQUFYLFdBQVciLCJmaWxlIjoic3JjL3NlcnZlci9QZXJmb3JtYW5jZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBNb2R1bGUgZnJvbSAnLi9Nb2R1bGUnO1xuXG5cbi8qKlxuICogVGhlIHtAbGluayBQZXJmb3JtYW5jZX0gYmFzZSBjbGFzcyBjb25zdGl0dXRlcyBhIGJhc2lzIG9uIHdoaWNoIHRvIGJ1aWxkIGEgcGVyZm9ybWFuY2Ugb24gdGhlIHNlcnZlciBzaWRlLlxuICogSXRzIHBhcnRpY3VsYXJpdHkgaXMgdG8ga2VlcCB0cmFjayBvZiB0aGUgY2xpZW50cyB3aG8gYXJlIGN1cnJlbnRseSBpbiB0aGUgcGVyZm9ybWFuY2Ugd2l0aCB0aGUgYXJyYXkgYHRoaXMuY2xpZW50c2AsIGFuZCB0byBoYXZlIHRoZSBgZW50ZXJgIGFuZCBgZXhpdGAgbWV0aG9kcyB0aGF0IGluZm9ybSB0aGUgbW9kdWxlIHdoZW4gdGhlIGNsaWVudCBlbnRlcmVkIHRoZSBwZXJmb3JtYW5jZSAoKmkuZS4qIHdoZW4gdGhlIGBwZXJmb3JtYW5jZWAgb24gdGhlIGNsaWVudCBzaWRlIGNhbGxlZCBpdHMgYHN0YXJ0YCBtZXRob2QpIGFuZCBsZWZ0IGl0ICgqaS5lLiogd2hlbiB0aGUgYHBlcmZvcm1hbmNlYCBvbiB0aGUgY2xpZW50IHNpZGUgY2FsbGVkIGl0cyBgZG9uZWAgbWV0aG9kLCBvciBpZiB0aGUgY2xpZW50IGRpc2Nvbm5lY3RlZCBmcm9tIHRoZSBzZXJ2ZXIpLlxuICpcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGVyZm9ybWFuY2UgZXh0ZW5kcyBNb2R1bGUge1xuICAvKipcbiAgICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLlxuICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLm5hbWU9J3BlcmZvcm1hbmNlJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdwZXJmb3JtYW5jZScpO1xuXG4gICAgLyoqXG4gICAgICogQ29udGFpbnMgdGhlIGxpc3Qgb2YgdGhlIGNsaWVudHMgd2hvIGFyZSBjdXJyZW50bHkgaW4gdGhlIHBlcmZvcm1hbmNlICgqaS5lLiogd2hvIHN0YXJ0ZWQgdGhlIHBlcmZvcm1hbmNlIGFuZCBoYXZlIG5vdCBleGl0ZWQgaXQgeWV0KS5cbiAgICAgKiBAdHlwZSB7U2VydmVyQ2xpZW50W119XG4gICAgICovXG4gICAgdGhpcy5jbGllbnRzID0gW107XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGNsaWVudCBjb25uZWN0cyB0byB0aGUgc2VydmVyLlxuICAgKiBAcGFyYW0ge1NlcnZlckNsaWVudH0gY2xpZW50IFRoZSBjb25uZWN0ZWQgY2xpZW50LlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICAvLyBMaXN0ZW4gZm9yIHRoZSBgJ3BlcmZvcm1hbmNlOnN0YXJ0J2Agc29ja2V0IG1lc3NhZ2UgZnJvbSB0aGUgY2xpZW50LlxuICAgIGNsaWVudC5yZWNlaXZlKHRoaXMubmFtZSArICc6c3RhcnQnLCAoKSA9PiB7XG4gICAgICB0aGlzLmVudGVyKGNsaWVudCk7XG4gICAgfSk7XG5cbiAgICAvLyBMaXN0ZW4gZm9yIHRoZSBgJ3BlcmZvcm1hbmNlOmRvbmUnYCBzb2NrZXQgbWVzc2FnZSBmcm9tIHRoZSBjbGllbnQuXG4gICAgY2xpZW50LnJlY2VpdmUodGhpcy5uYW1lICsgJzpkb25lJywgKCkgPT4ge1xuICAgICAgdGhpcy5leGl0KGNsaWVudCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGNsaWVudCBkaXNjb25uZWN0cyBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7U2VydmVyQ2xpZW50fSBjbGllbnQgVGhlIGNvbm5lY3RlZCBjbGllbnQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkaXNjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmRpc2Nvbm5lY3QoY2xpZW50KTtcblxuICAgIC8vIENhbGwgdGhlIGBleGl0YCBtZXRob2QgaWYgdGhlIGNsaWVudCBwcmV2aW91c2x5IGVudGVyZWQgdGhlIHBlcmZvcm1hbmNlLlxuICAgIGlmIChjbGllbnQubW9kdWxlc1t0aGlzLm5hbWVdLmVudGVyZWQpXG4gICAgICB0aGlzLmV4aXQoY2xpZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgY2xpZW50IHN0YXJ0cyB0aGUgcGVyZm9ybWFuY2Ugb24gdGhlIGNsaWVudCBzaWRlLlxuICAgKiBAcGFyYW0ge1NlcnZlckNsaWVudH0gY2xpZW50IFRoZSBjbGllbnQgdGhhdCBzdGFydHMgdGhlIHBlcmZvcm1hbmNlLlxuICAgKi9cbiAgZW50ZXIoY2xpZW50KSB7XG4gICAgLy8gQWRkIHRoZSBjbGllbnQgdG8gdGhlIGB0aGlzLmNsaWVudHNgIGFycmF5LlxuICAgIHRoaXMuY2xpZW50cy5wdXNoKGNsaWVudCk7XG5cbiAgICAvLyBTZXQgZmxhZy5cbiAgICBjbGllbnQubW9kdWxlc1t0aGlzLm5hbWVdLmVudGVyZWQgPSB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBjbGllbnQgZXhpdHMgdGhlIHBlcmZvcm1hbmNlIG9uIHRoZSBjbGllbnQgc2lkZSAoKmkuZS4qIHdoZW4gdGhlIGBkb25lYCBtZXRob2Qgb2YgdGhlIGNsaWVudCBzaWRlIG1vZHVsZSBpcyBjYWxsZWQsIG9yIHdoZW4gdGhlIGNsaWVudCBkaXNjb25uZWN0cyBmcm9tIHRoZSBzZXJ2ZXIpLlxuICAgKiBAcGFyYW0ge1NlcnZlckNsaWVudH0gY2xpZW50IFRoZSBjbGllbnQgdGhhdCBleGl0cyB0aGUgcGVyZm9ybWFuY2UuXG4gICAqL1xuICBleGl0KGNsaWVudCkge1xuICAgIC8vIFJlbW92ZSB0aGUgY2xpZW50IGZyb20gdGhlIGB0aGlzLmNsaWVudHNgIGFycmF5LlxuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5jbGllbnRzLmluZGV4T2YoY2xpZW50KTtcbiAgICBpZiAoaW5kZXggPj0gMClcbiAgICAgIHRoaXMuY2xpZW50cy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgLy8gUmVtb3ZlIGZsYWcuXG4gICAgY2xpZW50Lm1vZHVsZXNbdGhpcy5uYW1lXS5lbnRlcmVkID0gZmFsc2U7XG4gIH1cbn1cblxuIl19