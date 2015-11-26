'use strict';

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Module = require('./Module');

var _Module2 = _interopRequireDefault(_Module);

var _mobileDetect = require('mobile-detect');

var _mobileDetect2 = _interopRequireDefault(_mobileDetect);

// debug - http://socket.io/docs/logging-and-debugging/#available-debugging-scopes
// localStorage.debug = '*';

/**
 * The `client` object contains the basic methods and attributes of the client.
 * @type {Object}
 */
var client = {

  /**
   * socket.io library client object, if any.
   * @type {Object}
   * @private
   */
  io: null,

  /**
   * Socket used to communicate with the server, if any.
   * @type {Socket}
   * @private
   */
  socket: null,

  /**
   * Information about the client platform.
   * @type {Object}
   * @property {String} os Operating system.
   * @property {Boolean} isMobile Indicates whether the client is running on a
   * mobile platform or not.
   * @property {String} audioFileExt Audio file extension to use, depending on
   * the platform ()
   */
  platform: {
    os: null,
    isMobile: null,
    audioFileExt: '',
    isForbidden: false
  },

  /**
   * Client type.
   * The client type is speficied in the argument of the `init` method. For
   * instance, `'player'` is the client type you should be using by default.
   * @type {String}
   */
  type: null,

  /**
   * Promise resolved when the server sends a message indicating that the client
   * can start the first mdule.
   * @type {Promise}
   * @private
   */
  ready: null,

  /**
   * Client index, given by the server.
   * @type {Number}
   */
  index: -1,

  /**
   * Client coordinates (if any) given by a {@link Locator}, {@link Placer} or
   * {@link Checkin} module. (Format: `[x:Number, y:Number]`.)
   * @type {Number[]}
   */
  coordinates: null,

  /**
   * The `init` method sets the client type and initializes a WebSocket connection associated with the given type.
   * @param {String} [clientType = 'player'] The client type.
   * @todo clarify clientType.
   * @param {Object} [options = {}] The options to initialize a client
   * @param {Boolean} [options.io] By default, a Soundworks application has a client and a server side. For a standalone application (client side only), use `options.io = false`.
   * @todo use default value for options.io in the documentation?
   * @param {String} [options.socketUrl] The URL of the WebSocket server.
   */
  init: function init() {
    var clientType = arguments.length <= 0 || arguments[0] === undefined ? 'player' : arguments[0];
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    client.type = clientType;
    client.io = null;

    if (options.io === undefined) {
      options.io = true;
    }
    if (options.socketUrl === undefined) {
      options.socketUrl = '';
    }

    if (options.io !== false) {
      var io = require('socket.io-client');

      client.io = io;
      client.socket = client.io(options.socketUrl + '/' + clientType, {
        transports: ['websocket']
      });

      client.ready = new _Promise(function (resolve) {
        client.receive('client:start', function (index) {
          client.index = index;
          resolve();
        });
      });
    }
  },

  /**
   * Start the module logic (*i.e.* the application).
   * @param {Function} startFun [todo]
   * @todo Clarify the param.
   * @return {Promise} The Promise return value.
   * @todo Clarify return value (promise).
   * @todo example
   */
  start: function start(startFun) {
    var module = startFun; // be compatible with previous version

    if (typeof startFun === 'function') module = startFun(_Module2['default'].sequential, _Module2['default'].parallel);

    var promise = module.createPromise();

    if (client.io) {
      client.ready.then(function () {
        return module.launch();
      });

      client.receive('disconnect', function () {
        // console.log('disconnect', client.index);
      });

      client.receive('reconnect', function () {
        // console.log('reconnect', client.index);
      });
    } else {
        // no client i/o, no server
        module.launch();
      }

    return promise;
  },

  /**
   * The `serial` method returns a `Module` that starts the given `...modules` in series. After starting the first module (by calling its `start` method), the next module in the series is started (with its `start` method) when the last module called its `done` method. When the last module calls `done`, the returned serial module calls its own `done` method.
   *
   * **Note:** you can compound serial module sequences with parallel module combinations (*e.g.* `client.serial(module1, client.parallel(module2, module3), module4);`).
   * @deprecated Use the new API with the {@link start} method.
   * @param {...Module} ...modules The modules to run in serial.
   * @return {Promise} [description]
   * @todo Clarify return value
   * @todo Remove
   */
  serial: function serial() {
    console.log('The function "client.serial" is deprecated. Please use the new API instead.');
    return _Module2['default'].sequential.apply(_Module2['default'], arguments);
  },

  /**
   * The `Module` returned by the `parallel` method starts the given `...modules` in parallel (with their `start` methods), and calls its `done` method after all modules called their own `done` methods.
   *
   * **Note:** you can compound parallel module combinations with serial module sequences (*e.g.* `client.parallel(module1, client.serial(module2, module3), module4);`).
   *
   * **Note:** the `view` of a module is always full screen, so in the case where modules run in parallel, their `view`s are stacked on top of each other using the `z-index` CSS property.
   * We use the order of the `parallel` method's arguments to determine the order of the stack (*e.g.* in `client.parallel(module1, module2, module3)`, the `view` of `module1` is displayed on top of the `view` of `module2`, which is displayed on top of the `view` of `module3`).
   * @deprecated Use the new API with the {@link start} method.
   * @param {...Module} modules The modules to run in parallel.
   * @return {Promise} [description]
   * @todo Clarify return value
   * @todo Remove
   */
  parallel: function parallel() {
    console.log('The function "client.parallel" is deprecated. Please use the new API instead.');
    return _Module2['default'].parallel.apply(_Module2['default'], arguments);
  },

  /**
   * Send a WebSocket message to the server.
   *
   * **Note:** on the server side, the server receives the message with the command {@link ServerClient#receive}.
   * @param {String} msg Name of the message to send.
   * @param {...*} args Arguments of the message (as many as needed, of any type).
   */
  send: function send(msg) {
    var _client$socket;

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    if (client.socket) (_client$socket = client.socket).emit.apply(_client$socket, [msg].concat(args));
  },

  /**
   * Listen for a WebSocket message from the server and execute a callback
   * function.
   *
   * **Note:** on the server side, the server sends the message with the command
   * {@link server.send}`.
   * @param {String} msg Name of the received message.
   * @param {Function} callback Callback function executed when the message is
   * received.
   */
  receive: function receive(msg, callback) {
    if (client.socket) {
      client.socket.removeListener(msg, callback);
      client.socket.on(msg, callback);
    }
  },

  /**
   * Remove a WebSocket message listener (set with the method {@link
   * client.receive}).
   * @param {String} msg Name of the received message.
   * @param {Function} callback Callback function executed when the message is
   * received.
   */
  removeListener: function removeListener(msg, callback) {
    if (client.socket) client.socket.removeListener(msg, callback);
  }
};

// get informations about client
var ua = window.navigator.userAgent;
var md = new _mobileDetect2['default'](ua);
client.platform.isMobile = md.mobile() !== null; // true if phone or tablet
client.platform.os = (function () {
  var os = md.os();

  if (os === 'AndroidOS') {
    return 'android';
  } else if (os === 'iOS') {
    return 'ios';
  } else {
    return 'other';
  }
})();

// audio file extention check
var a = document.createElement('audio');
// http://diveintohtml5.info/everything.html
if (!!(a.canPlayType && a.canPlayType('audio/mpeg;'))) {
  client.platform.audioFileExt = '.mp3';
} else if (!!(a.canPlayType && a.canPlayType('audio/ogg; codecs="vorbis"'))) {
  client.platform.audioFileExt = '.ogg';
} else {
  client.platform.audioFileExt = '.wav';
}

exports['default'] = client;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvY2xpZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7c0JBQW1CLFVBQVU7Ozs7NEJBQ0osZUFBZTs7Ozs7Ozs7Ozs7QUFTeEMsSUFBSSxNQUFNLEdBQUc7Ozs7Ozs7QUFPWCxJQUFFLEVBQUUsSUFBSTs7Ozs7OztBQU9SLFFBQU0sRUFBRSxJQUFJOzs7Ozs7Ozs7OztBQVdaLFVBQVEsRUFBRTtBQUNSLE1BQUUsRUFBRSxJQUFJO0FBQ1IsWUFBUSxFQUFFLElBQUk7QUFDZCxnQkFBWSxFQUFFLEVBQUU7QUFDaEIsZUFBVyxFQUFFLEtBQUs7R0FDbkI7Ozs7Ozs7O0FBUUQsTUFBSSxFQUFFLElBQUk7Ozs7Ozs7O0FBUVYsT0FBSyxFQUFFLElBQUk7Ozs7OztBQU1YLE9BQUssRUFBRSxDQUFDLENBQUM7Ozs7Ozs7QUFPVCxhQUFXLEVBQUUsSUFBSTs7Ozs7Ozs7Ozs7QUFXakIsTUFBSSxFQUFFLGdCQUF5QztRQUF4QyxVQUFVLHlEQUFHLFFBQVE7UUFBRSxPQUFPLHlEQUFHLEVBQUU7O0FBQ3hDLFVBQU0sQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDO0FBQ3pCLFVBQU0sQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDOztBQUVqQixRQUFJLE9BQU8sQ0FBQyxFQUFFLEtBQUssU0FBUyxFQUFFO0FBQUUsYUFBTyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUM7S0FBRTtBQUNwRCxRQUFJLE9BQU8sQ0FBQyxTQUFTLEtBQUssU0FBUyxFQUFFO0FBQUUsYUFBTyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7S0FBRTs7QUFFaEUsUUFBSSxPQUFPLENBQUMsRUFBRSxLQUFLLEtBQUssRUFBRTtBQUN4QixVQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQzs7QUFFckMsWUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDZixZQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FB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RSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQzs7QUFFakIsTUFBSSxFQUFFLEtBQUssV0FBVyxFQUFFO0FBQ3RCLFdBQU8sU0FBUyxDQUFDO0dBQ2xCLE1BQU0sSUFBSSxFQUFFLEtBQUssS0FBSyxFQUFFO0FBQ3ZCLFdBQU8sS0FBSyxDQUFDO0dBQ2QsTUFBTTtBQUNMLFdBQU8sT0FBTyxDQUFDO0dBQ2hCO0NBQ0YsQ0FBQSxFQUFHLENBQUM7OztBQUdMLElBQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxXQUFXLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQSxBQUFDLEVBQUU7QUFDckQsUUFBTSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDO0NBQ3ZDLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFdBQVcsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDLDRCQUE0QixDQUFDLENBQUEsQUFBQyxFQUFFO0FBQzNFLFFBQU0sQ0FBQyxRQUFRLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQztDQUN2QyxNQUFNO0FBQ0wsUUFBTSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDO0NBQ3ZDOztxQkFFYyxNQUFNIiwiZmlsZSI6InNyYy9jbGllbnQvY2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE1vZHVsZSBmcm9tICcuL01vZHVsZSc7XG5pbXBvcnQgTW9iaWxlRGV0ZWN0IGZyb20gJ21vYmlsZS1kZXRlY3QnO1xuXG4vLyBkZWJ1ZyAtIGh0dHA6Ly9zb2NrZXQuaW8vZG9jcy9sb2dnaW5nLWFuZC1kZWJ1Z2dpbmcvI2F2YWlsYWJsZS1kZWJ1Z2dpbmctc2NvcGVzXG4vLyBsb2NhbFN0b3JhZ2UuZGVidWcgPSAnKic7XG5cbi8qKlxuICogVGhlIGBjbGllbnRgIG9iamVjdCBjb250YWlucyB0aGUgYmFzaWMgbWV0aG9kcyBhbmQgYXR0cmlidXRlcyBvZiB0aGUgY2xpZW50LlxuICogQHR5cGUge09iamVjdH1cbiAqL1xudmFyIGNsaWVudCA9IHtcblxuICAvKipcbiAgICogc29ja2V0LmlvIGxpYnJhcnkgY2xpZW50IG9iamVjdCwgaWYgYW55LlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaW86IG51bGwsXG5cbiAgLyoqXG4gICAqIFNvY2tldCB1c2VkIHRvIGNvbW11bmljYXRlIHdpdGggdGhlIHNlcnZlciwgaWYgYW55LlxuICAgKiBAdHlwZSB7U29ja2V0fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc29ja2V0OiBudWxsLFxuXG4gIC8qKlxuICAgKiBJbmZvcm1hdGlvbiBhYm91dCB0aGUgY2xpZW50IHBsYXRmb3JtLlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gb3MgT3BlcmF0aW5nIHN5c3RlbS5cbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBpc01vYmlsZSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgY2xpZW50IGlzIHJ1bm5pbmcgb24gYVxuICAgKiBtb2JpbGUgcGxhdGZvcm0gb3Igbm90LlxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gYXVkaW9GaWxlRXh0IEF1ZGlvIGZpbGUgZXh0ZW5zaW9uIHRvIHVzZSwgZGVwZW5kaW5nIG9uXG4gICAqIHRoZSBwbGF0Zm9ybSAoKVxuICAgKi9cbiAgcGxhdGZvcm06IHtcbiAgICBvczogbnVsbCxcbiAgICBpc01vYmlsZTogbnVsbCxcbiAgICBhdWRpb0ZpbGVFeHQ6ICcnLFxuICAgIGlzRm9yYmlkZGVuOiBmYWxzZVxuICB9LFxuXG4gIC8qKlxuICAgKiBDbGllbnQgdHlwZS5cbiAgICogVGhlIGNsaWVudCB0eXBlIGlzIHNwZWZpY2llZCBpbiB0aGUgYXJndW1lbnQgb2YgdGhlIGBpbml0YCBtZXRob2QuIEZvclxuICAgKiBpbnN0YW5jZSwgYCdwbGF5ZXInYCBpcyB0aGUgY2xpZW50IHR5cGUgeW91IHNob3VsZCBiZSB1c2luZyBieSBkZWZhdWx0LlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgdHlwZTogbnVsbCxcblxuICAvKipcbiAgICogUHJvbWlzZSByZXNvbHZlZCB3aGVuIHRoZSBzZXJ2ZXIgc2VuZHMgYSBtZXNzYWdlIGluZGljYXRpbmcgdGhhdCB0aGUgY2xpZW50XG4gICAqIGNhbiBzdGFydCB0aGUgZmlyc3QgbWR1bGUuXG4gICAqIEB0eXBlIHtQcm9taXNlfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVhZHk6IG51bGwsXG5cbiAgLyoqXG4gICAqIENsaWVudCBpbmRleCwgZ2l2ZW4gYnkgdGhlIHNlcnZlci5cbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGluZGV4OiAtMSxcblxuICAvKipcbiAgICogQ2xpZW50IGNvb3JkaW5hdGVzIChpZiBhbnkpIGdpdmVuIGJ5IGEge0BsaW5rIExvY2F0b3J9LCB7QGxpbmsgUGxhY2VyfSBvclxuICAgKiB7QGxpbmsgQ2hlY2tpbn0gbW9kdWxlLiAoRm9ybWF0OiBgW3g6TnVtYmVyLCB5Ok51bWJlcl1gLilcbiAgICogQHR5cGUge051bWJlcltdfVxuICAgKi9cbiAgY29vcmRpbmF0ZXM6IG51bGwsXG5cbiAgLyoqXG4gICAqIFRoZSBgaW5pdGAgbWV0aG9kIHNldHMgdGhlIGNsaWVudCB0eXBlIGFuZCBpbml0aWFsaXplcyBhIFdlYlNvY2tldCBjb25uZWN0aW9uIGFzc29jaWF0ZWQgd2l0aCB0aGUgZ2l2ZW4gdHlwZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtjbGllbnRUeXBlID0gJ3BsYXllciddIFRoZSBjbGllbnQgdHlwZS5cbiAgICogQHRvZG8gY2xhcmlmeSBjbGllbnRUeXBlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMgPSB7fV0gVGhlIG9wdGlvbnMgdG8gaW5pdGlhbGl6ZSBhIGNsaWVudFxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmlvXSBCeSBkZWZhdWx0LCBhIFNvdW5kd29ya3MgYXBwbGljYXRpb24gaGFzIGEgY2xpZW50IGFuZCBhIHNlcnZlciBzaWRlLiBGb3IgYSBzdGFuZGFsb25lIGFwcGxpY2F0aW9uIChjbGllbnQgc2lkZSBvbmx5KSwgdXNlIGBvcHRpb25zLmlvID0gZmFsc2VgLlxuICAgKiBAdG9kbyB1c2UgZGVmYXVsdCB2YWx1ZSBmb3Igb3B0aW9ucy5pbyBpbiB0aGUgZG9jdW1lbnRhdGlvbj9cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLnNvY2tldFVybF0gVGhlIFVSTCBvZiB0aGUgV2ViU29ja2V0IHNlcnZlci5cbiAgICovXG4gIGluaXQ6IChjbGllbnRUeXBlID0gJ3BsYXllcicsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICAgIGNsaWVudC50eXBlID0gY2xpZW50VHlwZTtcbiAgICBjbGllbnQuaW8gPSBudWxsO1xuXG4gICAgaWYgKG9wdGlvbnMuaW8gPT09IHVuZGVmaW5lZCkgeyBvcHRpb25zLmlvID0gdHJ1ZTsgfVxuICAgIGlmIChvcHRpb25zLnNvY2tldFVybCA9PT0gdW5kZWZpbmVkKSB7IG9wdGlvbnMuc29ja2V0VXJsID0gJyc7IH1cblxuICAgIGlmIChvcHRpb25zLmlvICE9PSBmYWxzZSkge1xuICAgICAgdmFyIGlvID0gcmVxdWlyZSgnc29ja2V0LmlvLWNsaWVudCcpO1xuXG4gICAgICBjbGllbnQuaW8gPSBpbztcbiAgICAgIGNsaWVudC5zb2NrZXQgPSBjbGllbnQuaW8ob3B0aW9ucy5zb2NrZXRVcmwgKyAnLycgKyBjbGllbnRUeXBlLCB7XG4gICAgICAgIHRyYW5zcG9ydHM6IFsnd2Vic29ja2V0J11cbiAgICAgIH0pO1xuXG4gICAgICBjbGllbnQucmVhZHkgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICBjbGllbnQucmVjZWl2ZSgnY2xpZW50OnN0YXJ0JywgKGluZGV4KSA9PiB7XG4gICAgICAgICAgY2xpZW50LmluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogU3RhcnQgdGhlIG1vZHVsZSBsb2dpYyAoKmkuZS4qIHRoZSBhcHBsaWNhdGlvbikuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IHN0YXJ0RnVuIFt0b2RvXVxuICAgKiBAdG9kbyBDbGFyaWZ5IHRoZSBwYXJhbS5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gVGhlIFByb21pc2UgcmV0dXJuIHZhbHVlLlxuICAgKiBAdG9kbyBDbGFyaWZ5IHJldHVybiB2YWx1ZSAocHJvbWlzZSkuXG4gICAqIEB0b2RvIGV4YW1wbGVcbiAgICovXG4gIHN0YXJ0OiAoc3RhcnRGdW4pID0+IHtcbiAgICBsZXQgbW9kdWxlID0gc3RhcnRGdW47IC8vIGJlIGNvbXBhdGlibGUgd2l0aCBwcmV2aW91cyB2ZXJzaW9uXG5cbiAgICBpZiAodHlwZW9mIHN0YXJ0RnVuID09PSAnZnVuY3Rpb24nKVxuICAgICAgbW9kdWxlID0gc3RhcnRGdW4oTW9kdWxlLnNlcXVlbnRpYWwsIE1vZHVsZS5wYXJhbGxlbCk7XG5cbiAgICBsZXQgcHJvbWlzZSA9IG1vZHVsZS5jcmVhdGVQcm9taXNlKCk7XG5cbiAgICBpZiAoY2xpZW50LmlvKSB7XG4gICAgICBjbGllbnQucmVhZHlcbiAgICAgICAgLnRoZW4oKCkgPT4gbW9kdWxlLmxhdW5jaCgpKTtcblxuICAgICAgY2xpZW50LnJlY2VpdmUoJ2Rpc2Nvbm5lY3QnLCAoKSA9PiB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdkaXNjb25uZWN0JywgY2xpZW50LmluZGV4KTtcbiAgICAgIH0pO1xuXG4gICAgICBjbGllbnQucmVjZWl2ZSgncmVjb25uZWN0JywgKCkgPT4ge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygncmVjb25uZWN0JywgY2xpZW50LmluZGV4KTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBubyBjbGllbnQgaS9vLCBubyBzZXJ2ZXJcbiAgICAgIG1vZHVsZS5sYXVuY2goKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfSxcblxuICAvKipcbiAgICogVGhlIGBzZXJpYWxgIG1ldGhvZCByZXR1cm5zIGEgYE1vZHVsZWAgdGhhdCBzdGFydHMgdGhlIGdpdmVuIGAuLi5tb2R1bGVzYCBpbiBzZXJpZXMuIEFmdGVyIHN0YXJ0aW5nIHRoZSBmaXJzdCBtb2R1bGUgKGJ5IGNhbGxpbmcgaXRzIGBzdGFydGAgbWV0aG9kKSwgdGhlIG5leHQgbW9kdWxlIGluIHRoZSBzZXJpZXMgaXMgc3RhcnRlZCAod2l0aCBpdHMgYHN0YXJ0YCBtZXRob2QpIHdoZW4gdGhlIGxhc3QgbW9kdWxlIGNhbGxlZCBpdHMgYGRvbmVgIG1ldGhvZC4gV2hlbiB0aGUgbGFzdCBtb2R1bGUgY2FsbHMgYGRvbmVgLCB0aGUgcmV0dXJuZWQgc2VyaWFsIG1vZHVsZSBjYWxscyBpdHMgb3duIGBkb25lYCBtZXRob2QuXG4gICAqXG4gICAqICoqTm90ZToqKiB5b3UgY2FuIGNvbXBvdW5kIHNlcmlhbCBtb2R1bGUgc2VxdWVuY2VzIHdpdGggcGFyYWxsZWwgbW9kdWxlIGNvbWJpbmF0aW9ucyAoKmUuZy4qIGBjbGllbnQuc2VyaWFsKG1vZHVsZTEsIGNsaWVudC5wYXJhbGxlbChtb2R1bGUyLCBtb2R1bGUzKSwgbW9kdWxlNCk7YCkuXG4gICAqIEBkZXByZWNhdGVkIFVzZSB0aGUgbmV3IEFQSSB3aXRoIHRoZSB7QGxpbmsgc3RhcnR9IG1ldGhvZC5cbiAgICogQHBhcmFtIHsuLi5Nb2R1bGV9IC4uLm1vZHVsZXMgVGhlIG1vZHVsZXMgdG8gcnVuIGluIHNlcmlhbC5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gW2Rlc2NyaXB0aW9uXVxuICAgKiBAdG9kbyBDbGFyaWZ5IHJldHVybiB2YWx1ZVxuICAgKiBAdG9kbyBSZW1vdmVcbiAgICovXG4gIHNlcmlhbDogKC4uLm1vZHVsZXMpID0+IHtcbiAgICBjb25zb2xlLmxvZygnVGhlIGZ1bmN0aW9uIFwiY2xpZW50LnNlcmlhbFwiIGlzIGRlcHJlY2F0ZWQuIFBsZWFzZSB1c2UgdGhlIG5ldyBBUEkgaW5zdGVhZC4nKTtcbiAgICByZXR1cm4gTW9kdWxlLnNlcXVlbnRpYWwoLi4ubW9kdWxlcyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFRoZSBgTW9kdWxlYCByZXR1cm5lZCBieSB0aGUgYHBhcmFsbGVsYCBtZXRob2Qgc3RhcnRzIHRoZSBnaXZlbiBgLi4ubW9kdWxlc2AgaW4gcGFyYWxsZWwgKHdpdGggdGhlaXIgYHN0YXJ0YCBtZXRob2RzKSwgYW5kIGNhbGxzIGl0cyBgZG9uZWAgbWV0aG9kIGFmdGVyIGFsbCBtb2R1bGVzIGNhbGxlZCB0aGVpciBvd24gYGRvbmVgIG1ldGhvZHMuXG4gICAqXG4gICAqICoqTm90ZToqKiB5b3UgY2FuIGNvbXBvdW5kIHBhcmFsbGVsIG1vZHVsZSBjb21iaW5hdGlvbnMgd2l0aCBzZXJpYWwgbW9kdWxlIHNlcXVlbmNlcyAoKmUuZy4qIGBjbGllbnQucGFyYWxsZWwobW9kdWxlMSwgY2xpZW50LnNlcmlhbChtb2R1bGUyLCBtb2R1bGUzKSwgbW9kdWxlNCk7YCkuXG4gICAqXG4gICAqICoqTm90ZToqKiB0aGUgYHZpZXdgIG9mIGEgbW9kdWxlIGlzIGFsd2F5cyBmdWxsIHNjcmVlbiwgc28gaW4gdGhlIGNhc2Ugd2hlcmUgbW9kdWxlcyBydW4gaW4gcGFyYWxsZWwsIHRoZWlyIGB2aWV3YHMgYXJlIHN0YWNrZWQgb24gdG9wIG9mIGVhY2ggb3RoZXIgdXNpbmcgdGhlIGB6LWluZGV4YCBDU1MgcHJvcGVydHkuXG4gICAqIFdlIHVzZSB0aGUgb3JkZXIgb2YgdGhlIGBwYXJhbGxlbGAgbWV0aG9kJ3MgYXJndW1lbnRzIHRvIGRldGVybWluZSB0aGUgb3JkZXIgb2YgdGhlIHN0YWNrICgqZS5nLiogaW4gYGNsaWVudC5wYXJhbGxlbChtb2R1bGUxLCBtb2R1bGUyLCBtb2R1bGUzKWAsIHRoZSBgdmlld2Agb2YgYG1vZHVsZTFgIGlzIGRpc3BsYXllZCBvbiB0b3Agb2YgdGhlIGB2aWV3YCBvZiBgbW9kdWxlMmAsIHdoaWNoIGlzIGRpc3BsYXllZCBvbiB0b3Agb2YgdGhlIGB2aWV3YCBvZiBgbW9kdWxlM2ApLlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgdGhlIG5ldyBBUEkgd2l0aCB0aGUge0BsaW5rIHN0YXJ0fSBtZXRob2QuXG4gICAqIEBwYXJhbSB7Li4uTW9kdWxlfSBtb2R1bGVzIFRoZSBtb2R1bGVzIHRvIHJ1biBpbiBwYXJhbGxlbC5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gW2Rlc2NyaXB0aW9uXVxuICAgKiBAdG9kbyBDbGFyaWZ5IHJldHVybiB2YWx1ZVxuICAgKiBAdG9kbyBSZW1vdmVcbiAgICovXG4gIHBhcmFsbGVsOiAoLi4ubW9kdWxlcykgPT4ge1xuICAgIGNvbnNvbGUubG9nKCdUaGUgZnVuY3Rpb24gXCJjbGllbnQucGFyYWxsZWxcIiBpcyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIHRoZSBuZXcgQVBJIGluc3RlYWQuJyk7XG4gICAgcmV0dXJuIE1vZHVsZS5wYXJhbGxlbCguLi5tb2R1bGVzKTtcbiAgfSxcblxuICAvKipcbiAgICogU2VuZCBhIFdlYlNvY2tldCBtZXNzYWdlIHRvIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqICoqTm90ZToqKiBvbiB0aGUgc2VydmVyIHNpZGUsIHRoZSBzZXJ2ZXIgcmVjZWl2ZXMgdGhlIG1lc3NhZ2Ugd2l0aCB0aGUgY29tbWFuZCB7QGxpbmsgU2VydmVyQ2xpZW50I3JlY2VpdmV9LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbXNnIE5hbWUgb2YgdGhlIG1lc3NhZ2UgdG8gc2VuZC5cbiAgICogQHBhcmFtIHsuLi4qfSBhcmdzIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cbiAgICovXG4gIHNlbmQ6IChtc2csIC4uLmFyZ3MpID0+IHtcbiAgICBpZiAoY2xpZW50LnNvY2tldClcbiAgICAgIGNsaWVudC5zb2NrZXQuZW1pdChtc2csIC4uLmFyZ3MpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBMaXN0ZW4gZm9yIGEgV2ViU29ja2V0IG1lc3NhZ2UgZnJvbSB0aGUgc2VydmVyIGFuZCBleGVjdXRlIGEgY2FsbGJhY2tcbiAgICogZnVuY3Rpb24uXG4gICAqXG4gICAqICoqTm90ZToqKiBvbiB0aGUgc2VydmVyIHNpZGUsIHRoZSBzZXJ2ZXIgc2VuZHMgdGhlIG1lc3NhZ2Ugd2l0aCB0aGUgY29tbWFuZFxuICAgKiB7QGxpbmsgc2VydmVyLnNlbmR9YC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG1zZyBOYW1lIG9mIHRoZSByZWNlaXZlZCBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsYmFjayBmdW5jdGlvbiBleGVjdXRlZCB3aGVuIHRoZSBtZXNzYWdlIGlzXG4gICAqIHJlY2VpdmVkLlxuICAgKi9cbiAgcmVjZWl2ZTogZnVuY3Rpb24gKG1zZywgY2FsbGJhY2spIHtcbiAgICBpZiAoY2xpZW50LnNvY2tldCkge1xuICAgICAgY2xpZW50LnNvY2tldC5yZW1vdmVMaXN0ZW5lcihtc2csIGNhbGxiYWNrKTtcbiAgICAgIGNsaWVudC5zb2NrZXQub24obXNnLCBjYWxsYmFjayk7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBXZWJTb2NrZXQgbWVzc2FnZSBsaXN0ZW5lciAoc2V0IHdpdGggdGhlIG1ldGhvZCB7QGxpbmtcbiAgICogY2xpZW50LnJlY2VpdmV9KS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG1zZyBOYW1lIG9mIHRoZSByZWNlaXZlZCBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayBDYWxsYmFjayBmdW5jdGlvbiBleGVjdXRlZCB3aGVuIHRoZSBtZXNzYWdlIGlzXG4gICAqIHJlY2VpdmVkLlxuICAgKi9cbiAgcmVtb3ZlTGlzdGVuZXI6IGZ1bmN0aW9uIChtc2csIGNhbGxiYWNrKSB7XG4gICAgaWYgKGNsaWVudC5zb2NrZXQpXG4gICAgICBjbGllbnQuc29ja2V0LnJlbW92ZUxpc3RlbmVyKG1zZywgY2FsbGJhY2spO1xuICB9XG59O1xuXG4vLyBnZXQgaW5mb3JtYXRpb25zIGFib3V0IGNsaWVudFxuY29uc3QgdWEgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudFxuY29uc3QgbWQgPSBuZXcgTW9iaWxlRGV0ZWN0KHVhKTtcbmNsaWVudC5wbGF0Zm9ybS5pc01vYmlsZSA9IChtZC5tb2JpbGUoKSAhPT0gbnVsbCk7IC8vIHRydWUgaWYgcGhvbmUgb3IgdGFibGV0XG5jbGllbnQucGxhdGZvcm0ub3MgPSAoKCkgPT4ge1xuICBsZXQgb3MgPSBtZC5vcygpO1xuXG4gIGlmIChvcyA9PT0gJ0FuZHJvaWRPUycpIHtcbiAgICByZXR1cm4gJ2FuZHJvaWQnO1xuICB9IGVsc2UgaWYgKG9zID09PSAnaU9TJykge1xuICAgIHJldHVybiAnaW9zJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJ290aGVyJztcbiAgfVxufSkoKTtcblxuLy8gYXVkaW8gZmlsZSBleHRlbnRpb24gY2hlY2tcbmNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhdWRpbycpO1xuLy8gaHR0cDovL2RpdmVpbnRvaHRtbDUuaW5mby9ldmVyeXRoaW5nLmh0bWxcbmlmICghIShhLmNhblBsYXlUeXBlICYmIGEuY2FuUGxheVR5cGUoJ2F1ZGlvL21wZWc7JykpKSB7XG4gIGNsaWVudC5wbGF0Zm9ybS5hdWRpb0ZpbGVFeHQgPSAnLm1wMyc7XG59IGVsc2UgaWYgKCEhKGEuY2FuUGxheVR5cGUgJiYgYS5jYW5QbGF5VHlwZSgnYXVkaW8vb2dnOyBjb2RlY3M9XCJ2b3JiaXNcIicpKSkge1xuICBjbGllbnQucGxhdGZvcm0uYXVkaW9GaWxlRXh0ID0gJy5vZ2cnO1xufSBlbHNlIHtcbiAgY2xpZW50LnBsYXRmb3JtLmF1ZGlvRmlsZUV4dCA9ICcud2F2Jztcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xpZW50O1xuIl19