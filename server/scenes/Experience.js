'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _corePier = require('../core/Pier');

var _corePier2 = _interopRequireDefault(_corePier);

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

var Experience = (function (_Pier) {
  _inherits(Experience, _Pier);

  /**
    * Creates an instance of the class.
    * @param {Object} [options={}] Options.
    * @param {string} [options.name='performance'] Name of the module.
   */

  function Experience() {
    var id = arguments.length <= 0 || arguments[0] === undefined ? 'experience' : arguments[0];
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    _classCallCheck(this, Experience);

    _get(Object.getPrototypeOf(Experience.prototype), 'constructor', this).call(this, id);

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

  _createClass(Experience, [{
    key: 'connect',
    value: function connect(client) {
      var _this = this;

      _get(Object.getPrototypeOf(Experience.prototype), 'connect', this).call(this, client);

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
      _get(Object.getPrototypeOf(Experience.prototype), 'disconnect', this).call(this, client);

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

  return Experience;
})(_corePier2['default']);

exports['default'] = Experience;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvc2NlbmVzL0V4cGVyaWVuY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozt3QkFBaUIsY0FBYzs7Ozs7Ozs7Ozs7Ozs7OztJQWNWLFVBQVU7WUFBVixVQUFVOzs7Ozs7OztBQU1sQixXQU5RLFVBQVUsR0FNZ0I7UUFBakMsRUFBRSx5REFBRyxZQUFZO1FBQUUsT0FBTyx5REFBRyxFQUFFOzswQkFOeEIsVUFBVTs7QUFPM0IsK0JBUGlCLFVBQVUsNkNBT3JCLEVBQUUsRUFBRTs7Ozs7O0FBTVYsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7R0FDbkI7Ozs7Ozs7ZUFka0IsVUFBVTs7V0FvQnRCLGlCQUFDLE1BQU0sRUFBRTs7O0FBQ2QsaUNBckJpQixVQUFVLHlDQXFCYixNQUFNLEVBQUU7OztBQUd0QixVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsWUFBTTtBQUNsQyxjQUFLLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztPQUNwQixDQUFDLENBQUM7OztBQUdILFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxZQUFNO0FBQ2pDLGNBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO09BQ25CLENBQUMsQ0FBQztLQUNKOzs7Ozs7OztXQU1TLG9CQUFDLE1BQU0sRUFBRTtBQUNqQixpQ0F2Q2lCLFVBQVUsNENBdUNWLE1BQU0sRUFBRTs7O0FBR3pCLFVBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUNqQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ3JCOzs7Ozs7OztXQU1JLGVBQUMsTUFBTSxFQUFFOztBQUVaLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDOzs7QUFHMUIsWUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztLQUN4Qzs7Ozs7Ozs7V0FNRyxjQUFDLE1BQU0sRUFBRTs7QUFFWCxVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMzQyxVQUFJLEtBQUssSUFBSSxDQUFDLEVBQ1osSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDOzs7QUFHaEMsWUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztLQUN6Qzs7O1NBdEVrQixVQUFVOzs7cUJBQVYsVUFBVSIsImZpbGUiOiJzcmMvc2VydmVyL3NjZW5lcy9FeHBlcmllbmNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFBpZXIgZnJvbSAnLi4vY29yZS9QaWVyJztcblxuXG4vKipcbiAqIEJhc2UgY2xhc3MgdXNlZCB0byBidWlsZCBhIHBlcmZvcm1hbmNlIG9uIHRoZSBjbGllbnQgc2lkZS5cbiAqXG4gKiBBbG9uZyB3aXRoIHRoZSBjbGFzc2ljIHtAbGluayBQZXJmb3JtYW5jZSNjb25uZWN0fSBhbmQge0BsaW5rIFBlcmZvcm1hbmNlI2Rpc2Nvbm5lY3R9IG1ldGhvZHMsIHRoZSBiYXNlIGNsYXNzIGhhcyB0d28gYWRkaXRpb25hbCBtZXRob2RzOlxuICogLSB7QGxpbmsgUGVyZm9ybWFuY2UjZW50ZXJ9OiBjYWxsZWQgd2hlbiB0aGUgY2xpZW50IGVudGVycyB0aGUgcGVyZm9ybWFuY2UgKCppLmUuKiB3aGVuIHRoZSB7QGxpbmsgc3JjL2NsaWVudC9QZXJmb3JtYW5jZS5qc35QZXJmb3JtYW5jZX0gb24gdGhlIGNsaWVudCBzaWRlIGNhbGxzIGl0cyB7QGxpbmsgc3JjL2NsaWVudC9QZXJmb3JtYW5jZS5qc35QZXJmb3JtYW5jZSNzdGFydH0gbWV0aG9kKTtcbiAqIC0ge0BsaW5rIFBlcmZvcm1hbmNlI2V4aXR9OiBjYWxsZWQgd2hlbiB0aGUgY2xpZW50IGxlYXZlcyB0aGUgcGVyZm9ybWFuY2UgKCppLmUuKiB3aGVuIHRoZSB7QGxpbmsgc3JjL2NsaWVudC9QZXJmb3JtYW5jZS5qc35QZXJmb3JtYW5jZX0gb24gdGhlIGNsaWVudCBzaWRlIGNhbGxzIGl0cyB7QGxpbmsgc3JjL2NsaWVudC9QZXJmb3JtYW5jZS5qc35QZXJmb3JtYW5jZSNkb25lfSBtZXRob2QsIG9yIGlmIHRoZSBjbGllbnQgZGlzY29ubmVjdGVkIGZyb20gdGhlIHNlcnZlcikuXG4gKlxuICogVGhlIGJhc2UgY2xhc3MgYWxzbyBrZWVwcyB0cmFjayBvZiB0aGUgY2xpZW50cyB3aG8gYXJlIGN1cnJlbnRseSBpbiB0aGUgcGVyZm9ybWFuY2UgKCppLmUuKiB3aG8gZW50ZXJlZCBidXQgbm90IGV4aXRlZCB5ZXQpIGluIHRoZSBhcnJheSBgdGhpcy5jbGllbnRzYC5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9jbGllbnQvQ2xpZW50UGVyZm9ybWFuY2UuanN+Q2xpZW50UGVyZm9ybWFuY2V9IG9uIHRoZSBjbGllbnQgc2lkZS4pXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV4cGVyaWVuY2UgZXh0ZW5kcyBQaWVyIHtcbiAgLyoqXG4gICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdwZXJmb3JtYW5jZSddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGlkID0gJ2V4cGVyaWVuY2UnLCBvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihpZCk7XG5cbiAgICAvKipcbiAgICAgKiBMaXN0IG9mIHRoZSBjbGllbnRzIHdobyBhcmUgY3VycmVudGx5IGluIHRoZSBwZXJmb3JtYW5jZSAoKmkuZS4qIHdobyBlbnRlcmVkIHRoZSBwZXJmb3JtYW5jZSBhbmQgaGF2ZSBub3QgZXhpdGVkIGl0IHlldCkuXG4gICAgICogQHR5cGUge0NsaWVudFtdfVxuICAgICAqL1xuICAgIHRoaXMuY2xpZW50cyA9IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBjbGllbnQgY29ubmVjdHMgdG8gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCBDb25uZWN0ZWQgY2xpZW50LlxuICAgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICAvLyBMaXN0ZW4gZm9yIHRoZSBgJ3BlcmZvcm1hbmNlOnN0YXJ0J2Agc29ja2V0IG1lc3NhZ2UgZnJvbSB0aGUgY2xpZW50LlxuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdzdGFydCcsICgpID0+IHtcbiAgICAgIHRoaXMuZW50ZXIoY2xpZW50KTtcbiAgICB9KTtcblxuICAgIC8vIExpc3RlbiBmb3IgdGhlIGAncGVyZm9ybWFuY2U6ZG9uZSdgIHNvY2tldCBtZXNzYWdlIGZyb20gdGhlIGNsaWVudC5cbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAnZG9uZScsICgpID0+IHtcbiAgICAgIHRoaXMuZXhpdChjbGllbnQpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBjbGllbnQgZGlzY29ubmVjdHMgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IERpc2Nvbm5lY3RlZCBjbGllbnQuXG4gICAqL1xuICBkaXNjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmRpc2Nvbm5lY3QoY2xpZW50KTtcblxuICAgIC8vIENhbGwgdGhlIGBleGl0YCBtZXRob2QgaWYgdGhlIGNsaWVudCBwcmV2aW91c2x5IGVudGVyZWQgdGhlIHBlcmZvcm1hbmNlLlxuICAgIGlmIChjbGllbnQubW9kdWxlc1t0aGlzLmlkXS5lbnRlcmVkKVxuICAgICAgdGhpcy5leGl0KGNsaWVudCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGNsaWVudCBzdGFydHMgdGhlIHBlcmZvcm1hbmNlIG9uIHRoZSBjbGllbnQgc2lkZS5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCBDbGllbnQgd2hvIGVudGVycyB0aGUgcGVyZm9ybWFuY2UuXG4gICAqL1xuICBlbnRlcihjbGllbnQpIHtcbiAgICAvLyBBZGQgdGhlIGNsaWVudCB0byB0aGUgYHRoaXMuY2xpZW50c2AgYXJyYXkuXG4gICAgdGhpcy5jbGllbnRzLnB1c2goY2xpZW50KTtcblxuICAgIC8vIFNldCBmbGFnLlxuICAgIGNsaWVudC5tb2R1bGVzW3RoaXMuaWRdLmVudGVyZWQgPSB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBjbGllbnQgZXhpdHMgdGhlIHBlcmZvcm1hbmNlIG9uIHRoZSBjbGllbnQgc2lkZSAoKmkuZS4qIHdoZW4gdGhlIGBkb25lYCBtZXRob2Qgb2YgdGhlIGNsaWVudCBzaWRlIG1vZHVsZSBpcyBjYWxsZWQsIG9yIHdoZW4gdGhlIGNsaWVudCBkaXNjb25uZWN0cyBmcm9tIHRoZSBzZXJ2ZXIpLlxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IENsaWVudCB3aG8gZXhpdHMgdGhlIHBlcmZvcm1hbmNlLlxuICAgKi9cbiAgZXhpdChjbGllbnQpIHtcbiAgICAvLyBSZW1vdmUgdGhlIGNsaWVudCBmcm9tIHRoZSBgdGhpcy5jbGllbnRzYCBhcnJheS5cbiAgICBjb25zdCBpbmRleCA9IHRoaXMuY2xpZW50cy5pbmRleE9mKGNsaWVudCk7XG4gICAgaWYgKGluZGV4ID49IDApXG4gICAgICB0aGlzLmNsaWVudHMuc3BsaWNlKGluZGV4LCAxKTtcblxuICAgIC8vIFJlbW92ZSBmbGFnLlxuICAgIGNsaWVudC5tb2R1bGVzW3RoaXMuaWRdLmVudGVyZWQgPSBmYWxzZTtcbiAgfVxufVxuIl19