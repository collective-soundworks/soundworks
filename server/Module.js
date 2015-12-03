// @todo - remove EventEmitter? (Implement our own listeners)
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _comm = require('./comm');

var _comm2 = _interopRequireDefault(_comm);

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
   * @param {ModuleClient} client - The connected client.
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
     * @param {ModuleClient} client - The disconnected client.
     */
  }, {
    key: 'disconnect',
    value: function disconnect(client) {}
    // delete client.modules[this.name] // TODO?

    /**
     * Listen a WebSocket message.
     * @param {Client} client - The client that must listen to the message.
     * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.name}:channel`).
     * @param {...*} callback - The callback to execute when a message is received.
     */

  }, {
    key: 'receive',
    value: function receive(client, channel, callback) {
      var namespacedChannel = this.name + ':' + channel;
      _comm2['default'].receive(client, namespacedChannel, callback);
    }

    /**
     * Sends a WebSocket message to the client.
     * @param {Client} client - The client to send the message to.
     * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.name}:channel`).
     * @param {...*} args - Arguments of the message (as many as needed, of any type).
     */
  }, {
    key: 'send',
    value: function send(client, channel) {
      var namespacedChannel = this.name + ':' + channel;

      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      _comm2['default'].send.apply(_comm2['default'], [client, namespacedChannel].concat(args));
    }

    /**
     * Sends a WebSocket message to all the clients belonging to the same `clientType` as `client`. (`client` does not receive a message)
     * @param {Client} client - The client which peers must receive the message
     * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.name}:channel`).
     * @param {...*} args - Arguments of the message (as many as needed, of any type).
     */
  }, {
    key: 'sendPeers',
    value: function sendPeers(client, channel) {
      var namespacedChannel = this.name + ':' + channel;

      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      _comm2['default'].sendPeers.apply(_comm2['default'], [client, namespacedChannel].concat(args));
    }

    /**
     * Sends a message to all client of given `clientType` or `clientType`s. If not specified, the message is sent to all clients
     * @param {String|Array} clientType - The `clientType`(s) that must receive the message.
     * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.name}:channel`).
     * @param {...*} args - Arguments of the message (as many as needed, of any type).
     */
  }, {
    key: 'broadcast',
    value: function broadcast(clientType, channel) {
      var namespacedChannel = this.name + ':' + channel;

      for (var _len3 = arguments.length, args = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
        args[_key3 - 2] = arguments[_key3];
      }

      _comm2['default'].broadcast.apply(_comm2['default'], [clientType, namespacedChannel].concat(args));
    }
  }]);

  return Module;
})(_events.EventEmitter);

exports['default'] = Module;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvTW9kdWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQUNpQixRQUFROzs7O3NCQUNJLFFBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFxQmhCLE1BQU07WUFBTixNQUFNOzs7Ozs7OztBQU1kLFdBTlEsTUFBTSxDQU1iLElBQUksRUFBRTswQkFOQyxNQUFNOztBQU92QiwrQkFQaUIsTUFBTSw2Q0FPZjs7Ozs7QUFLUixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztHQUNsQjs7Ozs7Ozs7ZUFia0IsTUFBTTs7V0FvQmxCLGlCQUFDLE1BQU0sRUFBRTs7QUFFZCxZQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7S0FDaEM7Ozs7Ozs7OztXQU9TLG9CQUFDLE1BQU0sRUFBRSxFQUVsQjs7Ozs7Ozs7O0FBQUE7OztXQVFNLGlCQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQ2pDLFVBQU0saUJBQWlCLEdBQU0sSUFBSSxDQUFDLElBQUksU0FBSSxPQUFPLEFBQUUsQ0FBQztBQUNwRCx3QkFBSyxPQUFPLENBQUMsTUFBTSxFQUFFLGlCQUFpQixFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQ25EOzs7Ozs7Ozs7O1dBUUcsY0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFXO0FBQzdCLFVBQU0saUJBQWlCLEdBQU0sSUFBSSxDQUFDLElBQUksU0FBSSxPQUFPLEFBQUUsQ0FBQzs7d0NBRDdCLElBQUk7QUFBSixZQUFJOzs7QUFFM0Isd0JBQUssSUFBSSxNQUFBLHFCQUFDLE1BQU0sRUFBRSxpQkFBaUIsU0FBSyxJQUFJLEVBQUMsQ0FBQztLQUMvQzs7Ozs7Ozs7OztXQVFRLG1CQUFDLE1BQU0sRUFBRSxPQUFPLEVBQVc7QUFDbEMsVUFBTSxpQkFBaUIsR0FBTSxJQUFJLENBQUMsSUFBSSxTQUFJLE9BQU8sQUFBRSxDQUFDOzt5Q0FEeEIsSUFBSTtBQUFKLFlBQUk7OztBQUVoQyx3QkFBSyxTQUFTLE1BQUEscUJBQUMsTUFBTSxFQUFFLGlCQUFpQixTQUFLLElBQUksRUFBQyxDQUFDO0tBQ3BEOzs7Ozs7Ozs7O1dBUVEsbUJBQUMsVUFBVSxFQUFFLE9BQU8sRUFBVztBQUN0QyxVQUFNLGlCQUFpQixHQUFNLElBQUksQ0FBQyxJQUFJLFNBQUksT0FBTyxBQUFFLENBQUM7O3lDQURwQixJQUFJO0FBQUosWUFBSTs7O0FBRXBDLHdCQUFLLFNBQVMsTUFBQSxxQkFBQyxVQUFVLEVBQUUsaUJBQWlCLFNBQUssSUFBSSxFQUFDLENBQUM7S0FDeEQ7OztTQTVFa0IsTUFBTTs7O3FCQUFOLE1BQU0iLCJmaWxlIjoic3JjL3NlcnZlci9Nb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAdG9kbyAtIHJlbW92ZSBFdmVudEVtaXR0ZXI/IChJbXBsZW1lbnQgb3VyIG93biBsaXN0ZW5lcnMpXG5pbXBvcnQgY29tbSBmcm9tICcuL2NvbW0nO1xuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcblxuLyoqXG4gKiBUaGUge0BsaW5rIE1vZHVsZX0gYmFzZSBjbGFzcyBpcyB1c2VkIHRvIGNyZWF0ZSBhICpTb3VuZHdvcmtzKiBtb2R1bGUgb24gdGhlIHNlcnZlciBzaWRlLlxuICogRWFjaCBtb2R1bGUgc2hvdWxkIGhhdmUgYSB7QGxpbmsgTW9kdWxlI2Nvbm5lY3R9IGFuZCBhIHtAbGluayBNb2R1bGUjZGlzY29ubmVjdH0gbWV0aG9kLlxuICogQW55IG1vZHVsZSBtYXBwZWQgdG8gdGhlIHR5cGUgb2YgY2xpZW50IGBjbGllbnRUeXBlYCAodGhhbmtzIHRvIHRoZSB7QGxpbmsgc2VydmVyI21hcH0gbWV0aG9kKSB3b3VsZCBjYWxsIGl0cyB7QGxpbmsgTW9kdWxlI2Nvbm5lY3R9IG1ldGhvZCB3aGVuIHN1Y2ggYSBjbGllbnQgY29ubmVjdHMgdG8gdGhlIHNlcnZlciwgYW5kIGl0cyB7QGxpbmsgTW9kdWxlI2Rpc2Nvbm5lY3R9IG1ldGhvZCB3aGVuIHN1Y2ggYSBjbGllbnQgZGlzY29ubmVjdHMgZnJvbSB0aGUgc2VydmVyLlxuICogQGV4YW1wbGVcbiAqIGNsYXNzIE15TW9kdWxlIGV4dGVuZHMgc2VydmVyU2lkZS5Nb2R1bGUge1xuICogICBjb25zdHJ1Y3RvcignbXktbW9kdWxlLW5hbWUnKSB7XG4gKiAgICAgLi4uIC8vIGFueXRoaW5nIHRoZSBjb25zdHJ1Y3RvciBuZWVkc1xuICogICB9XG4gKlxuICogICBjb25uZWN0KGNsaWVudCkge1xuICogICAgIC4uLiAvLyB3aGF0IHRoZSBtb2R1bGUgaGFzIHRvIGRvIHdoZW4gYSBjbGllbnQgY29ubmVjdHMgdG8gdGhlIHNlcnZlclxuICogICB9XG4gKlxuICogICBkaXNjb25uZWN0KGNsaWVudCkge1xuICogICAgIC4uLiAvLyB3aGF0IHRoZSBtb2R1bGUgaGFzIHRvIGRvIHdoZW4gYSBjbGllbnQgZGlzY29ubmVjdHMgZnJvbSB0aGUgc2VydmVyXG4gKiAgIH1cbiAqIH1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTW9kdWxlIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgLyoqXG4gICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gVGhlIG9wdGlvbnMuXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMubmFtZT0ndW5uYW1lZCddIFRoZSBuYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgc3VwZXIoKTtcbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgYGNsaWVudGAgY29ubmVjdHMgdG8gdGhlIHNlcnZlci5cbiAgICogVGhpcyBtZXRob2Qgc2hvdWxkIGhhbmRsZSB0aGUgbG9naWMgb2YgdGhlIG1vZHVsZSBvbiB0aGUgc2VydmVyIHNpZGUuIEZvciBpbnN0YW5jZSwgaXQgY2FuIHRha2UgY2FyZSBvZiB0aGUgY29tbXVuaWNhdGlvbiB3aXRoIHRoZSBjbGllbnQgc2lkZSBtb2R1bGUgYnkgc2V0dGluZyB1cCBXZWJTb2NrZXQgbWVzc2FnZSBsaXN0ZW5lcnMgYW5kIHNlbmRpbmcgV2ViU29ja2V0IG1lc3NhZ2VzLCBvciBpdCBjYW4gYWRkIHRoZSBjbGllbnQgdG8gYSBsaXN0IHRvIGtlZXAgdHJhY2sgb2YgYWxsIHRoZSBjb25uZWN0ZWQgY2xpZW50cy5cbiAgICogQHBhcmFtIHtNb2R1bGVDbGllbnR9IGNsaWVudCAtIFRoZSBjb25uZWN0ZWQgY2xpZW50LlxuICAgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICAvLyBTZXR1cCBhbiBvYmplY3RcbiAgICBjbGllbnQubW9kdWxlc1t0aGlzLm5hbWVdID0ge307XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGNsaWVudCBgY2xpZW50YCBkaXNjb25uZWN0cyBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIFRoaXMgbWV0aG9kIHNob3VsZCBoYW5kbGUgdGhlIGxvZ2ljIHdoZW4gdGhhdCBoYXBwZW5zLiBGb3IgaW5zdGFuY2UsIGl0IGNhbiByZW1vdmUgdGhlIHNvY2tldCBtZXNzYWdlIGxpc3RlbmVycywgb3IgcmVtb3ZlIHRoZSBjbGllbnQgZnJvbSB0aGUgbGlzdCB0aGF0IGtlZXBzIHRyYWNrIG9mIHRoZSBjb25uZWN0ZWQgY2xpZW50cy5cbiAgICogQHBhcmFtIHtNb2R1bGVDbGllbnR9IGNsaWVudCAtIFRoZSBkaXNjb25uZWN0ZWQgY2xpZW50LlxuICAgKi9cbiAgZGlzY29ubmVjdChjbGllbnQpIHtcbiAgICAvLyBkZWxldGUgY2xpZW50Lm1vZHVsZXNbdGhpcy5uYW1lXSAvLyBUT0RPP1xuICB9XG5cbiAgLyoqXG4gICAqIExpc3RlbiBhIFdlYlNvY2tldCBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IC0gVGhlIGNsaWVudCB0aGF0IG11c3QgbGlzdGVuIHRvIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5IG5hbWVzcGFjZWQgd2l0aCB0aGUgbW9kdWxlJ3MgbmFtZTogYCR7dGhpcy5uYW1lfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7Li4uKn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gZXhlY3V0ZSB3aGVuIGEgbWVzc2FnZSBpcyByZWNlaXZlZC5cbiAgICovXG4gIHJlY2VpdmUoY2xpZW50LCBjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IG5hbWVzcGFjZWRDaGFubmVsID0gYCR7dGhpcy5uYW1lfToke2NoYW5uZWx9YDtcbiAgICBjb21tLnJlY2VpdmUoY2xpZW50LCBuYW1lc3BhY2VkQ2hhbm5lbCwgY2FsbGJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgV2ViU29ja2V0IG1lc3NhZ2UgdG8gdGhlIGNsaWVudC5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCAtIFRoZSBjbGllbnQgdG8gc2VuZCB0aGUgbWVzc2FnZSB0by5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseSBuYW1lc3BhY2VkIHdpdGggdGhlIG1vZHVsZSdzIG5hbWU6IGAke3RoaXMubmFtZX06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gICAqL1xuICBzZW5kKGNsaWVudCwgY2hhbm5lbCwgLi4uYXJncykge1xuICAgIGNvbnN0IG5hbWVzcGFjZWRDaGFubmVsID0gYCR7dGhpcy5uYW1lfToke2NoYW5uZWx9YDtcbiAgICBjb21tLnNlbmQoY2xpZW50LCBuYW1lc3BhY2VkQ2hhbm5lbCwgLi4uYXJncyk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZHMgYSBXZWJTb2NrZXQgbWVzc2FnZSB0byBhbGwgdGhlIGNsaWVudHMgYmVsb25naW5nIHRvIHRoZSBzYW1lIGBjbGllbnRUeXBlYCBhcyBgY2xpZW50YC4gKGBjbGllbnRgIGRvZXMgbm90IHJlY2VpdmUgYSBtZXNzYWdlKVxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IC0gVGhlIGNsaWVudCB3aGljaCBwZWVycyBtdXN0IHJlY2VpdmUgdGhlIG1lc3NhZ2VcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseSBuYW1lc3BhY2VkIHdpdGggdGhlIG1vZHVsZSdzIG5hbWU6IGAke3RoaXMubmFtZX06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gICAqL1xuICBzZW5kUGVlcnMoY2xpZW50LCBjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgY29uc3QgbmFtZXNwYWNlZENoYW5uZWwgPSBgJHt0aGlzLm5hbWV9OiR7Y2hhbm5lbH1gO1xuICAgIGNvbW0uc2VuZFBlZXJzKGNsaWVudCwgbmFtZXNwYWNlZENoYW5uZWwsIC4uLmFyZ3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgbWVzc2FnZSB0byBhbGwgY2xpZW50IG9mIGdpdmVuIGBjbGllbnRUeXBlYCBvciBgY2xpZW50VHlwZWBzLiBJZiBub3Qgc3BlY2lmaWVkLCB0aGUgbWVzc2FnZSBpcyBzZW50IHRvIGFsbCBjbGllbnRzXG4gICAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBjbGllbnRUeXBlIC0gVGhlIGBjbGllbnRUeXBlYChzKSB0aGF0IG11c3QgcmVjZWl2ZSB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseSBuYW1lc3BhY2VkIHdpdGggdGhlIG1vZHVsZSdzIG5hbWU6IGAke3RoaXMubmFtZX06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gICAqL1xuICBicm9hZGNhc3QoY2xpZW50VHlwZSwgY2hhbm5lbCwgLi4uYXJncykge1xuICAgIGNvbnN0IG5hbWVzcGFjZWRDaGFubmVsID0gYCR7dGhpcy5uYW1lfToke2NoYW5uZWx9YDtcbiAgICBjb21tLmJyb2FkY2FzdChjbGllbnRUeXBlLCBuYW1lc3BhY2VkQ2hhbm5lbCwgLi4uYXJncyk7XG4gIH1cbn1cblxuXG5cblxuIl19