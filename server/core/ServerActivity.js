'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _toConsumableArray = require('babel-runtime/helpers/to-consumable-array')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _sockets = require('./sockets');

var _sockets2 = _interopRequireDefault(_sockets);

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

var _events = require('events');

// @todo - remove EventEmitter ? (Implement our own listeners)

/**
 * Base class used to create any *Soundworks* piers on the server side.
 *
 * While the sequence of user interactions and exchanges between client and server is determined on the client side, the server side modules are ready to receive requests from the corresponding client side modules as soon as a client is connected to the server.
 *
 * Each module should have a {@link ServerModule#connect} and a {@link ServerModule#disconnect} methods.
 * Any module mapped to the type of client `'clientType'` (thanks to the {@link server#map} method) calls its {@link ServerModule#connect} method when such a client connects to the server, and its {@link ServerModule#disconnect} method when such a client disconnects from the server.
 *
 * (See also {@link src/client/ClientModule.js~ClientModule} on the client side.)
 *
 * **Note:** a more complete example of how to write a module is in the [Example](manual/example.html) section.
 *
 * @example
 * class MyPier extends Pier {
 *   constructor(name) {
 *     super(name);
 *
 *     // ...
 *   }
 *
 *   connect(client) {
 *     super.connect(client);
 *
 *     // ...
 *   }
 *
 *   disconnect(client) {
 *     super.disconnect(client);
 *
 *     // ...
 *   }
 * }
 */

var ServerActivity = (function (_EventEmitter) {
  _inherits(ServerActivity, _EventEmitter);

  /**
    * Creates an instance of the class.
    * @param {Object} [options={}] The options.
    * @param {string} [options.name='unnamed'] The name of the module.
   */

  function ServerActivity(id) {
    _classCallCheck(this, ServerActivity);

    _get(Object.getPrototypeOf(ServerActivity.prototype), 'constructor', this).call(this);

    /**
     * The id of the activity. This id must match a client side `Activity` id in order
     * to create the socket channel between the activity and its client side peer
     * @type {string}
     */
    this.id = id;

    /**
     * The client types on which the activity should be mapped
     * @type {Array}
     * @private
     */
    this._clientTypes = [];

    /**
     * The options of the activity
     */
    this.options = {};
  }

  _createClass(ServerActivity, [{
    key: 'start',
    value: function start() {}

    /**
     * @param {String|Array} val - The client type(s) on which the activity should be mapped
     */
  }, {
    key: 'addClientType',
    value: function addClientType() {
      for (var _len = arguments.length, val = Array(_len), _key = 0; _key < _len; _key++) {
        val[_key] = arguments[_key];
      }

      console.log(val);
      this._clientTypes = this._clientTypes.concat(val);
      _server2['default'].setMap(this._clientTypes, this);
    }

    /**
     * Configure the activity.
     * @param {Object} options
     */
  }, {
    key: 'configure',
    value: function configure(options) {
      if (options.clientType) {
        this.addClientType.apply(this, _toConsumableArray(options.clientType));
        delete options.clientType;
      }

      _Object$assign(this.options, options);
    }

    /**
     * Called when the `client` connects to the server.
     *
     * This method should handle the logic of the module on the server side.
     * For instance, it can take care of the communication with the client side module by setting up WebSocket message listeners and sending WebSocket messages, or it can add the client to a list to keep track of all the connected clients.
     * @param {Client} client Connected client.
     */
  }, {
    key: 'connect',
    value: function connect(client) {
      // Setup an object
      client.modules[this.id] = {};
    }

    /**
     * Called when the client `client` disconnects from the server.
     *
     * This method should handle the logic when that happens.
     * For instance, it can remove the socket message listeners, or remove the client from the list that keeps track of the connected clients.
     * @param {Client} client Disconnected client.
     */
  }, {
    key: 'disconnect',
    value: function disconnect(client) {}
    // delete client.modules[this.id] // maybe needed by other modules

    /**
     * Listen a WebSocket message.
     * @param {Client} client - The client that must listen to the message.
     * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.id}:channel`).
     * @param {...*} callback - The callback to execute when a message is received.
     */

  }, {
    key: 'receive',
    value: function receive(client, channel, callback) {
      var namespacedChannel = this.id + ':' + channel;
      _sockets2['default'].receive(client, namespacedChannel, callback);
    }

    /**
     * Sends a WebSocket message to the client.
     * @param {Client} client - The client to send the message to.
     * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.id}:channel`).
     * @param {...*} args - Arguments of the message (as many as needed, of any type).
     */
  }, {
    key: 'send',
    value: function send(client, channel) {
      var namespacedChannel = this.id + ':' + channel;

      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      _sockets2['default'].send.apply(_sockets2['default'], [client, namespacedChannel].concat(args));
    }

    /**
     * Sends a message to all client of given `clientType` or `clientType`s. If not specified, the message is sent to all clients
     * @param {String|Array} clientType - The `clientType`(s) that must receive the message.
     * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.id}:channel`).
     * @param {...*} args - Arguments of the message (as many as needed, of any type).
     */
  }, {
    key: 'broadcast',
    value: function broadcast(clientType, excludeClient, channel) {
      var namespacedChannel = this.id + ':' + channel;

      for (var _len3 = arguments.length, args = Array(_len3 > 3 ? _len3 - 3 : 0), _key3 = 3; _key3 < _len3; _key3++) {
        args[_key3 - 3] = arguments[_key3];
      }

      _sockets2['default'].broadcast.apply(_sockets2['default'], [clientType, excludeClient, namespacedChannel].concat(args));
    }
  }]);

  return ServerActivity;
})(_events.EventEmitter);

exports['default'] = ServerActivity;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvY29yZS9TZXJ2ZXJBY3Rpdml0eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt1QkFBb0IsV0FBVzs7OztzQkFDWixVQUFVOzs7O3NCQUNBLFFBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBcUNoQixjQUFjO1lBQWQsY0FBYzs7Ozs7Ozs7QUFNdEIsV0FOUSxjQUFjLENBTXJCLEVBQUUsRUFBRTswQkFORyxjQUFjOztBQU8vQiwrQkFQaUIsY0FBYyw2Q0FPdkI7Ozs7Ozs7QUFPUixRQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQzs7Ozs7OztBQU9iLFFBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDOzs7OztBQUt2QixRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztHQUNuQjs7ZUEzQmtCLGNBQWM7O1dBNkI1QixpQkFBRyxFQUFFOzs7Ozs7O1dBS0cseUJBQVM7d0NBQUwsR0FBRztBQUFILFdBQUc7OztBQUNsQixhQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2pCLFVBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbEQsMEJBQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDeEM7Ozs7Ozs7O1dBTVEsbUJBQUMsT0FBTyxFQUFFO0FBQ2pCLFVBQUksT0FBTyxDQUFDLFVBQVUsRUFBRTtBQUN0QixZQUFJLENBQUMsYUFBYSxNQUFBLENBQWxCLElBQUkscUJBQWtCLE9BQU8sQ0FBQyxVQUFVLEVBQUMsQ0FBQztBQUMxQyxlQUFPLE9BQU8sQ0FBQyxVQUFVLENBQUM7T0FDM0I7O0FBRUQscUJBQWMsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztLQUN0Qzs7Ozs7Ozs7Ozs7V0FTTSxpQkFBQyxNQUFNLEVBQUU7O0FBRWQsWUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDO0tBQzlCOzs7Ozs7Ozs7OztXQVNTLG9CQUFDLE1BQU0sRUFBRSxFQUVsQjs7Ozs7Ozs7O0FBQUE7OztXQVFNLGlCQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQ2pDLFVBQU0saUJBQWlCLEdBQU0sSUFBSSxDQUFDLEVBQUUsU0FBSSxPQUFPLEFBQUUsQ0FBQztBQUNsRCwyQkFBUSxPQUFPLENBQUMsTUFBTSxFQUFFLGlCQUFpQixFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQ3REOzs7Ozs7Ozs7O1dBUUcsY0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFXO0FBQzdCLFVBQU0saUJBQWlCLEdBQU0sSUFBSSxDQUFDLEVBQUUsU0FBSSxPQUFPLEFBQUUsQ0FBQzs7eUNBRDNCLElBQUk7QUFBSixZQUFJOzs7QUFFM0IsMkJBQVEsSUFBSSxNQUFBLHdCQUFDLE1BQU0sRUFBRSxpQkFBaUIsU0FBSyxJQUFJLEVBQUMsQ0FBQztLQUNsRDs7Ozs7Ozs7OztXQVFRLG1CQUFDLFVBQVUsRUFBRSxhQUFhLEVBQUUsT0FBTyxFQUFXO0FBQ3JELFVBQU0saUJBQWlCLEdBQU0sSUFBSSxDQUFDLEVBQUUsU0FBSSxPQUFPLEFBQUUsQ0FBQzs7eUNBREgsSUFBSTtBQUFKLFlBQUk7OztBQUVuRCwyQkFBUSxTQUFTLE1BQUEsd0JBQUMsVUFBVSxFQUFFLGFBQWEsRUFBRSxpQkFBaUIsU0FBSyxJQUFJLEVBQUMsQ0FBQztLQUMxRTs7O1NBM0drQixjQUFjOzs7cUJBQWQsY0FBYyIsImZpbGUiOiJzcmMvc2VydmVyL2NvcmUvU2VydmVyQWN0aXZpdHkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc29ja2V0cyBmcm9tICcuL3NvY2tldHMnO1xuaW1wb3J0IHNlcnZlciBmcm9tICcuL3NlcnZlcic7XG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuXG4vLyBAdG9kbyAtIHJlbW92ZSBFdmVudEVtaXR0ZXIgPyAoSW1wbGVtZW50IG91ciBvd24gbGlzdGVuZXJzKVxuXG4vKipcbiAqIEJhc2UgY2xhc3MgdXNlZCB0byBjcmVhdGUgYW55ICpTb3VuZHdvcmtzKiBwaWVycyBvbiB0aGUgc2VydmVyIHNpZGUuXG4gKlxuICogV2hpbGUgdGhlIHNlcXVlbmNlIG9mIHVzZXIgaW50ZXJhY3Rpb25zIGFuZCBleGNoYW5nZXMgYmV0d2VlbiBjbGllbnQgYW5kIHNlcnZlciBpcyBkZXRlcm1pbmVkIG9uIHRoZSBjbGllbnQgc2lkZSwgdGhlIHNlcnZlciBzaWRlIG1vZHVsZXMgYXJlIHJlYWR5IHRvIHJlY2VpdmUgcmVxdWVzdHMgZnJvbSB0aGUgY29ycmVzcG9uZGluZyBjbGllbnQgc2lkZSBtb2R1bGVzIGFzIHNvb24gYXMgYSBjbGllbnQgaXMgY29ubmVjdGVkIHRvIHRoZSBzZXJ2ZXIuXG4gKlxuICogRWFjaCBtb2R1bGUgc2hvdWxkIGhhdmUgYSB7QGxpbmsgU2VydmVyTW9kdWxlI2Nvbm5lY3R9IGFuZCBhIHtAbGluayBTZXJ2ZXJNb2R1bGUjZGlzY29ubmVjdH0gbWV0aG9kcy5cbiAqIEFueSBtb2R1bGUgbWFwcGVkIHRvIHRoZSB0eXBlIG9mIGNsaWVudCBgJ2NsaWVudFR5cGUnYCAodGhhbmtzIHRvIHRoZSB7QGxpbmsgc2VydmVyI21hcH0gbWV0aG9kKSBjYWxscyBpdHMge0BsaW5rIFNlcnZlck1vZHVsZSNjb25uZWN0fSBtZXRob2Qgd2hlbiBzdWNoIGEgY2xpZW50IGNvbm5lY3RzIHRvIHRoZSBzZXJ2ZXIsIGFuZCBpdHMge0BsaW5rIFNlcnZlck1vZHVsZSNkaXNjb25uZWN0fSBtZXRob2Qgd2hlbiBzdWNoIGEgY2xpZW50IGRpc2Nvbm5lY3RzIGZyb20gdGhlIHNlcnZlci5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9jbGllbnQvQ2xpZW50TW9kdWxlLmpzfkNsaWVudE1vZHVsZX0gb24gdGhlIGNsaWVudCBzaWRlLilcbiAqXG4gKiAqKk5vdGU6KiogYSBtb3JlIGNvbXBsZXRlIGV4YW1wbGUgb2YgaG93IHRvIHdyaXRlIGEgbW9kdWxlIGlzIGluIHRoZSBbRXhhbXBsZV0obWFudWFsL2V4YW1wbGUuaHRtbCkgc2VjdGlvbi5cbiAqXG4gKiBAZXhhbXBsZVxuICogY2xhc3MgTXlQaWVyIGV4dGVuZHMgUGllciB7XG4gKiAgIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAqICAgICBzdXBlcihuYW1lKTtcbiAqXG4gKiAgICAgLy8gLi4uXG4gKiAgIH1cbiAqXG4gKiAgIGNvbm5lY3QoY2xpZW50KSB7XG4gKiAgICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuICpcbiAqICAgICAvLyAuLi5cbiAqICAgfVxuICpcbiAqICAgZGlzY29ubmVjdChjbGllbnQpIHtcbiAqICAgICBzdXBlci5kaXNjb25uZWN0KGNsaWVudCk7XG4gKlxuICogICAgIC8vIC4uLlxuICogICB9XG4gKiB9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlcnZlckFjdGl2aXR5IGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgLyoqXG4gICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gVGhlIG9wdGlvbnMuXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMubmFtZT0ndW5uYW1lZCddIFRoZSBuYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihpZCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgaWQgb2YgdGhlIGFjdGl2aXR5LiBUaGlzIGlkIG11c3QgbWF0Y2ggYSBjbGllbnQgc2lkZSBgQWN0aXZpdHlgIGlkIGluIG9yZGVyXG4gICAgICogdG8gY3JlYXRlIHRoZSBzb2NrZXQgY2hhbm5lbCBiZXR3ZWVuIHRoZSBhY3Rpdml0eSBhbmQgaXRzIGNsaWVudCBzaWRlIHBlZXJcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMuaWQgPSBpZDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBjbGllbnQgdHlwZXMgb24gd2hpY2ggdGhlIGFjdGl2aXR5IHNob3VsZCBiZSBtYXBwZWRcbiAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9jbGllbnRUeXBlcyA9IFtdO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG9wdGlvbnMgb2YgdGhlIGFjdGl2aXR5XG4gICAgICovXG4gICAgdGhpcy5vcHRpb25zID0ge307XG4gIH1cblxuICBzdGFydCgpIHt9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSB2YWwgLSBUaGUgY2xpZW50IHR5cGUocykgb24gd2hpY2ggdGhlIGFjdGl2aXR5IHNob3VsZCBiZSBtYXBwZWRcbiAgICovXG4gIGFkZENsaWVudFR5cGUoLi4udmFsKSB7XG4gICAgY29uc29sZS5sb2codmFsKTtcbiAgICB0aGlzLl9jbGllbnRUeXBlcyA9IHRoaXMuX2NsaWVudFR5cGVzLmNvbmNhdCh2YWwpO1xuICAgIHNlcnZlci5zZXRNYXAodGhpcy5fY2xpZW50VHlwZXMsIHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyZSB0aGUgYWN0aXZpdHkuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAqL1xuICBjb25maWd1cmUob3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zLmNsaWVudFR5cGUpIHtcbiAgICAgIHRoaXMuYWRkQ2xpZW50VHlwZSguLi5vcHRpb25zLmNsaWVudFR5cGUpO1xuICAgICAgZGVsZXRlIG9wdGlvbnMuY2xpZW50VHlwZTtcbiAgICB9XG5cbiAgICBPYmplY3QuYXNzaWduKHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGBjbGllbnRgIGNvbm5lY3RzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIHNob3VsZCBoYW5kbGUgdGhlIGxvZ2ljIG9mIHRoZSBtb2R1bGUgb24gdGhlIHNlcnZlciBzaWRlLlxuICAgKiBGb3IgaW5zdGFuY2UsIGl0IGNhbiB0YWtlIGNhcmUgb2YgdGhlIGNvbW11bmljYXRpb24gd2l0aCB0aGUgY2xpZW50IHNpZGUgbW9kdWxlIGJ5IHNldHRpbmcgdXAgV2ViU29ja2V0IG1lc3NhZ2UgbGlzdGVuZXJzIGFuZCBzZW5kaW5nIFdlYlNvY2tldCBtZXNzYWdlcywgb3IgaXQgY2FuIGFkZCB0aGUgY2xpZW50IHRvIGEgbGlzdCB0byBrZWVwIHRyYWNrIG9mIGFsbCB0aGUgY29ubmVjdGVkIGNsaWVudHMuXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgQ29ubmVjdGVkIGNsaWVudC5cbiAgICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgLy8gU2V0dXAgYW4gb2JqZWN0XG4gICAgY2xpZW50Lm1vZHVsZXNbdGhpcy5pZF0gPSB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgY2xpZW50IGBjbGllbnRgIGRpc2Nvbm5lY3RzIGZyb20gdGhlIHNlcnZlci5cbiAgICpcbiAgICogVGhpcyBtZXRob2Qgc2hvdWxkIGhhbmRsZSB0aGUgbG9naWMgd2hlbiB0aGF0IGhhcHBlbnMuXG4gICAqIEZvciBpbnN0YW5jZSwgaXQgY2FuIHJlbW92ZSB0aGUgc29ja2V0IG1lc3NhZ2UgbGlzdGVuZXJzLCBvciByZW1vdmUgdGhlIGNsaWVudCBmcm9tIHRoZSBsaXN0IHRoYXQga2VlcHMgdHJhY2sgb2YgdGhlIGNvbm5lY3RlZCBjbGllbnRzLlxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IERpc2Nvbm5lY3RlZCBjbGllbnQuXG4gICAqL1xuICBkaXNjb25uZWN0KGNsaWVudCkge1xuICAgIC8vIGRlbGV0ZSBjbGllbnQubW9kdWxlc1t0aGlzLmlkXSAvLyBtYXliZSBuZWVkZWQgYnkgb3RoZXIgbW9kdWxlc1xuICB9XG5cbiAgLyoqXG4gICAqIExpc3RlbiBhIFdlYlNvY2tldCBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IC0gVGhlIGNsaWVudCB0aGF0IG11c3QgbGlzdGVuIHRvIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5IG5hbWVzcGFjZWQgd2l0aCB0aGUgbW9kdWxlJ3MgbmFtZTogYCR7dGhpcy5pZH06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0gey4uLip9IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiBhIG1lc3NhZ2UgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICByZWNlaXZlKGNsaWVudCwgY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBuYW1lc3BhY2VkQ2hhbm5lbCA9IGAke3RoaXMuaWR9OiR7Y2hhbm5lbH1gO1xuICAgIHNvY2tldHMucmVjZWl2ZShjbGllbnQsIG5hbWVzcGFjZWRDaGFubmVsLCBjYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZHMgYSBXZWJTb2NrZXQgbWVzc2FnZSB0byB0aGUgY2xpZW50LlxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IC0gVGhlIGNsaWVudCB0byBzZW5kIHRoZSBtZXNzYWdlIHRvLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5IG5hbWVzcGFjZWQgd2l0aCB0aGUgbW9kdWxlJ3MgbmFtZTogYCR7dGhpcy5pZH06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gICAqL1xuICBzZW5kKGNsaWVudCwgY2hhbm5lbCwgLi4uYXJncykge1xuICAgIGNvbnN0IG5hbWVzcGFjZWRDaGFubmVsID0gYCR7dGhpcy5pZH06JHtjaGFubmVsfWA7XG4gICAgc29ja2V0cy5zZW5kKGNsaWVudCwgbmFtZXNwYWNlZENoYW5uZWwsIC4uLmFyZ3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgbWVzc2FnZSB0byBhbGwgY2xpZW50IG9mIGdpdmVuIGBjbGllbnRUeXBlYCBvciBgY2xpZW50VHlwZWBzLiBJZiBub3Qgc3BlY2lmaWVkLCB0aGUgbWVzc2FnZSBpcyBzZW50IHRvIGFsbCBjbGllbnRzXG4gICAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBjbGllbnRUeXBlIC0gVGhlIGBjbGllbnRUeXBlYChzKSB0aGF0IG11c3QgcmVjZWl2ZSB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseSBuYW1lc3BhY2VkIHdpdGggdGhlIG1vZHVsZSdzIG5hbWU6IGAke3RoaXMuaWR9OmNoYW5uZWxgKS5cbiAgICogQHBhcmFtIHsuLi4qfSBhcmdzIC0gQXJndW1lbnRzIG9mIHRoZSBtZXNzYWdlIChhcyBtYW55IGFzIG5lZWRlZCwgb2YgYW55IHR5cGUpLlxuICAgKi9cbiAgYnJvYWRjYXN0KGNsaWVudFR5cGUsIGV4Y2x1ZGVDbGllbnQsIGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBjb25zdCBuYW1lc3BhY2VkQ2hhbm5lbCA9IGAke3RoaXMuaWR9OiR7Y2hhbm5lbH1gO1xuICAgIHNvY2tldHMuYnJvYWRjYXN0KGNsaWVudFR5cGUsIGV4Y2x1ZGVDbGllbnQsIG5hbWVzcGFjZWRDaGFubmVsLCAuLi5hcmdzKTtcbiAgfVxufVxuIl19