// @todo - remove EventEmitter? (Implement our own listeners)
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _events = require('events');

/**
 * The {@link Module} base class is used to create a *Soundworks* module on the server side.
 * Each module should have a {@link Module#connect} and a {@link Module#disconnect} method.
 * Any module mapped to the type of client `clientType` (thanks to the {@link server#map} method) would call its {@link Module#connect} method when such a client connects to the server, and its {@link Module#disconnect} method when such a client disconnects from the server.
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

var Module = (function (_EventEmitter) {
  _inherits(Module, _EventEmitter);

  /**
    * Creates an instance of the class.
    * @param {Object} [options={}] The options.
    * @param {string} [options.name='unnamed'] The name of the module.
   */

  function Module(name) {
    _classCallCheck(this, Module);

    _get(Object.getPrototypeOf(Module.prototype), 'constructor', this).call(this);
    /**
     * The name of the module.
     * @type {string}
     */
    this.name = name;
  }

  /**
   * Called when the `client` connects to the server.
   * This method should handle the logic of the module on the server side. For instance, it can take care of the communication with the client side module by setting up WebSocket message listeners and sending WebSocket messages, or it can add the client to a list to keep track of all the connected clients.
   * @param {ModuleClient} client The connected client.
   */

  _createClass(Module, [{
    key: 'connect',
    value: function connect(client) {
      // Setup an object
      client.modules[this.name] = {};
    }

    /**
     * Called when the client `client` disconnects from the server.
     * This method should handle the logic when that happens. For instance, it can remove the socket message listeners, or remove the client from the list that keeps track of the connected clients.
     * @param {ModuleClient} client The disconnected client.
     */
  }, {
    key: 'disconnect',
    value: function disconnect(client) {
      // delete client.modules[this.name] // TODO?
    }
  }]);

  return Module;
})(_events.EventEmitter);

exports['default'] = Module;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvTW9kdWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztzQkFDNkIsUUFBUTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXNCaEIsTUFBTTtZQUFOLE1BQU07Ozs7Ozs7O0FBTWQsV0FOUSxNQUFNLENBTWIsSUFBSSxFQUFFOzBCQU5DLE1BQU07O0FBT3ZCLCtCQVBpQixNQUFNLDZDQU9mOzs7OztBQUtSLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0dBQ2xCOzs7Ozs7OztlQWJrQixNQUFNOztXQW9CbEIsaUJBQUMsTUFBTSxFQUFFOztBQUVkLFlBQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztLQUNoQzs7Ozs7Ozs7O1dBT1Msb0JBQUMsTUFBTSxFQUFFOztLQUVsQjs7O1NBaENrQixNQUFNOzs7cUJBQU4sTUFBTSIsImZpbGUiOiJzcmMvc2VydmVyL01vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEB0b2RvIC0gcmVtb3ZlIEV2ZW50RW1pdHRlcj8gKEltcGxlbWVudCBvdXIgb3duIGxpc3RlbmVycylcbmltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5cblxuLyoqXG4gKiBUaGUge0BsaW5rIE1vZHVsZX0gYmFzZSBjbGFzcyBpcyB1c2VkIHRvIGNyZWF0ZSBhICpTb3VuZHdvcmtzKiBtb2R1bGUgb24gdGhlIHNlcnZlciBzaWRlLlxuICogRWFjaCBtb2R1bGUgc2hvdWxkIGhhdmUgYSB7QGxpbmsgTW9kdWxlI2Nvbm5lY3R9IGFuZCBhIHtAbGluayBNb2R1bGUjZGlzY29ubmVjdH0gbWV0aG9kLlxuICogQW55IG1vZHVsZSBtYXBwZWQgdG8gdGhlIHR5cGUgb2YgY2xpZW50IGBjbGllbnRUeXBlYCAodGhhbmtzIHRvIHRoZSB7QGxpbmsgc2VydmVyI21hcH0gbWV0aG9kKSB3b3VsZCBjYWxsIGl0cyB7QGxpbmsgTW9kdWxlI2Nvbm5lY3R9IG1ldGhvZCB3aGVuIHN1Y2ggYSBjbGllbnQgY29ubmVjdHMgdG8gdGhlIHNlcnZlciwgYW5kIGl0cyB7QGxpbmsgTW9kdWxlI2Rpc2Nvbm5lY3R9IG1ldGhvZCB3aGVuIHN1Y2ggYSBjbGllbnQgZGlzY29ubmVjdHMgZnJvbSB0aGUgc2VydmVyLlxuICogQGV4YW1wbGVcbiAqIGNsYXNzIE15TW9kdWxlIGV4dGVuZHMgc2VydmVyU2lkZS5Nb2R1bGUge1xuICogICBjb25zdHJ1Y3RvcignbXktbW9kdWxlLW5hbWUnKSB7XG4gKiAgICAgLi4uIC8vIGFueXRoaW5nIHRoZSBjb25zdHJ1Y3RvciBuZWVkc1xuICogICB9XG4gKlxuICogICBjb25uZWN0KGNsaWVudCkge1xuICogICAgIC4uLiAvLyB3aGF0IHRoZSBtb2R1bGUgaGFzIHRvIGRvIHdoZW4gYSBjbGllbnQgY29ubmVjdHMgdG8gdGhlIHNlcnZlclxuICogICB9XG4gKlxuICogICBkaXNjb25uZWN0KGNsaWVudCkge1xuICogICAgIC4uLiAvLyB3aGF0IHRoZSBtb2R1bGUgaGFzIHRvIGRvIHdoZW4gYSBjbGllbnQgZGlzY29ubmVjdHMgZnJvbSB0aGUgc2VydmVyXG4gKiAgIH1cbiAqIH1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTW9kdWxlIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgLyoqXG4gICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gVGhlIG9wdGlvbnMuXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMubmFtZT0ndW5uYW1lZCddIFRoZSBuYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgc3VwZXIoKTtcbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgYGNsaWVudGAgY29ubmVjdHMgdG8gdGhlIHNlcnZlci5cbiAgICogVGhpcyBtZXRob2Qgc2hvdWxkIGhhbmRsZSB0aGUgbG9naWMgb2YgdGhlIG1vZHVsZSBvbiB0aGUgc2VydmVyIHNpZGUuIEZvciBpbnN0YW5jZSwgaXQgY2FuIHRha2UgY2FyZSBvZiB0aGUgY29tbXVuaWNhdGlvbiB3aXRoIHRoZSBjbGllbnQgc2lkZSBtb2R1bGUgYnkgc2V0dGluZyB1cCBXZWJTb2NrZXQgbWVzc2FnZSBsaXN0ZW5lcnMgYW5kIHNlbmRpbmcgV2ViU29ja2V0IG1lc3NhZ2VzLCBvciBpdCBjYW4gYWRkIHRoZSBjbGllbnQgdG8gYSBsaXN0IHRvIGtlZXAgdHJhY2sgb2YgYWxsIHRoZSBjb25uZWN0ZWQgY2xpZW50cy5cbiAgICogQHBhcmFtIHtNb2R1bGVDbGllbnR9IGNsaWVudCBUaGUgY29ubmVjdGVkIGNsaWVudC5cbiAgICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgLy8gU2V0dXAgYW4gb2JqZWN0XG4gICAgY2xpZW50Lm1vZHVsZXNbdGhpcy5uYW1lXSA9IHt9O1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBjbGllbnQgYGNsaWVudGAgZGlzY29ubmVjdHMgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBUaGlzIG1ldGhvZCBzaG91bGQgaGFuZGxlIHRoZSBsb2dpYyB3aGVuIHRoYXQgaGFwcGVucy4gRm9yIGluc3RhbmNlLCBpdCBjYW4gcmVtb3ZlIHRoZSBzb2NrZXQgbWVzc2FnZSBsaXN0ZW5lcnMsIG9yIHJlbW92ZSB0aGUgY2xpZW50IGZyb20gdGhlIGxpc3QgdGhhdCBrZWVwcyB0cmFjayBvZiB0aGUgY29ubmVjdGVkIGNsaWVudHMuXG4gICAqIEBwYXJhbSB7TW9kdWxlQ2xpZW50fSBjbGllbnQgVGhlIGRpc2Nvbm5lY3RlZCBjbGllbnQuXG4gICAqL1xuICBkaXNjb25uZWN0KGNsaWVudCkge1xuICAgIC8vIGRlbGV0ZSBjbGllbnQubW9kdWxlc1t0aGlzLm5hbWVdIC8vIFRPRE8/XG4gIH1cbn1cblxuIl19