'use strict';

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Module = require('./Module');

var _Module2 = _interopRequireDefault(_Module);

var _com2 = require('./com');

var _com3 = _interopRequireDefault(_com2);

var _mobileDetect = require('mobile-detect');

var _mobileDetect2 = _interopRequireDefault(_mobileDetect);

// debug - http://socket.io/docs/logging-and-debugging/#available-debugging-scopes
// localStorage.debug = '*';

/**
 * The `client` object contains the basic methods and attributes of the client.
 * @type {Object}
 */
exports['default'] = {

  /**
   * socket.io library client object, if any.
   * @type {Object}
   * @private
   */
  // io: null,

  /**
   * Socket used to communicate with the server, if any.
   * @type {Socket}
   * @private
   */
  // socket: null,

  com: null,

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
    var _this = this;

    var clientType = arguments.length <= 0 || arguments[0] === undefined ? 'player' : arguments[0];
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    this.send = this.send.bind(this);
    this.receive = this.receive.bind(this);
    this.removeListener = this.removeListener.bind(this);

    this.type = clientType;

    options = _Object$assign({
      io: true,
      socketUrl: '',
      transports: ['websocket']
    }, options);

    if (options.io !== false) {
      // initialize socket communications
      this.com = _com3['default'].initialize(clientType, options);

      this.ready = new _Promise(function (resolve) {
        console.log('????');
        _this.com.receive('client:start', function (index) {
          _this.index = index;
          resolve();
        });
      });
    } else {
      this.ready = _Promise.resolve(true);
    }

    // --------------------------------------------------------------------
    // @note: move into Platform ? create a dedicated service ?
    // get informations about client
    var ua = window.navigator.userAgent;
    var md = new _mobileDetect2['default'](ua);
    this.platform.isMobile = md.mobile() !== null; // true if phone or tablet
    this.platform.os = (function () {
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
      this.platform.audioFileExt = '.mp3';
    } else if (!!(a.canPlayType && a.canPlayType('audio/ogg; codecs="vorbis"'))) {
      this.platform.audioFileExt = '.ogg';
    } else {
      this.platform.audioFileExt = '.wav';
    }
    // --------------------------------------------------------------------
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

    if (typeof startFun === 'function') {
      module = startFun(_Module2['default'].sequential, _Module2['default'].parallel);
    }

    var promise = module.createPromise();
    this.ready.then(function () {
      return module.launch();
    });

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
    var _com;

    if (!this.com) {
      return;
    }

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    (_com = this.com).send.apply(_com, [msg].concat(args));
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
    if (!this.com) {
      return;
    }
    this.com.receive(msg, callback);
  },

  /**
   * Remove a WebSocket message listener (set with the method {@link
   * client.receive}).
   * @param {String} msg Name of the received message.
   * @param {Function} callback Callback function executed when the message is
   * received.
   */
  removeListener: function removeListener(msg, callback) {
    if (!this.com) {
      return;
    }
    this.com.removeListener(msg, callback);
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvY2xpZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztzQkFBbUIsVUFBVTs7OztvQkFDYixPQUFPOzs7OzRCQUNFLGVBQWU7Ozs7Ozs7Ozs7O3FCQVN6Qjs7Ozs7Ozs7Ozs7Ozs7OztBQWdCYixLQUFHLEVBQUUsSUFBSTs7Ozs7Ozs7Ozs7QUFXVCxVQUFRLEVBQUU7QUFDUixNQUFFLEVBQUUsSUFBSTtBQUNSLFlBQVEsRUFBRSxJQUFJO0FBQ2QsZ0JBQVksRUFBRSxFQUFFO0FBQ2hCLGVBQVcsRUFBRSxLQUFLO0dBQ25COzs7Ozs7OztBQVFELE1BQUksRUFBRSxJQUFJOzs7Ozs7OztBQVFWLE9BQUssRUFBRSxJQUFJOzs7Ozs7QUFNWCxPQUFLLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7O0FBT1QsYUFBVyxFQUFFLElBQUk7Ozs7Ozs7Ozs7O0FBV2pCLE1BQUksRUFBQSxnQkFBc0M7OztRQUFyQyxVQUFVLHlEQUFHLFFBQVE7UUFBRSxPQUFPLHlEQUFHLEVBQUU7O0FBQ3RDLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakMsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2QyxRQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVyRCxRQUFJLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQzs7QUFFdkIsV0FBTyxHQUFHLGVBQWM7QUFDdEIsUUFBRSxFQUFFLElBQUk7QUFDUixlQUFTLEVBQUUsRUFBRTtBQUNiLGdCQUFVLEVBQUUsQ0FBQyxXQUFXLENBQUM7S0FDMUIsRUFBRSxPQUFPLENBQUMsQ0FBQzs7QUFFWixRQUFJLE9BQU8sQ0FBQyxFQUFFLEtBQUssS0FBSyxFQUFFOztBQUV4QixVQUFJ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LENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtBQUFFLGFBQU87S0FBRTs7c0NBRGYsSUFBSTtBQUFKLFVBQUk7OztBQUVmLFlBQUEsSUFBSSxDQUFDLEdBQUcsRUFBQyxJQUFJLE1BQUEsUUFBQyxHQUFHLFNBQUssSUFBSSxFQUFDLENBQUM7R0FDN0I7Ozs7Ozs7Ozs7OztBQVlELFNBQU8sRUFBQSxpQkFBQyxHQUFHLEVBQUUsUUFBUSxFQUFFO0FBQ3JCLFFBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO0FBQUUsYUFBTztLQUFFO0FBQzFCLFFBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztHQUNqQzs7Ozs7Ozs7O0FBU0QsZ0JBQWMsRUFBQSx3QkFBQyxHQUFHLEVBQUUsUUFBUSxFQUFFO0FBQzVCLFFBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO0FBQUUsYUFBTztLQUFFO0FBQzFCLFFBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztHQUN4QztDQUNGIiwiZmlsZSI6InNyYy9jbGllbnQvY2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE1vZHVsZSBmcm9tICcuL01vZHVsZSc7XG5pbXBvcnQgY29tIGZyb20gJy4vY29tJztcbmltcG9ydCBNb2JpbGVEZXRlY3QgZnJvbSAnbW9iaWxlLWRldGVjdCc7XG5cbi8vIGRlYnVnIC0gaHR0cDovL3NvY2tldC5pby9kb2NzL2xvZ2dpbmctYW5kLWRlYnVnZ2luZy8jYXZhaWxhYmxlLWRlYnVnZ2luZy1zY29wZXNcbi8vIGxvY2FsU3RvcmFnZS5kZWJ1ZyA9ICcqJztcblxuLyoqXG4gKiBUaGUgYGNsaWVudGAgb2JqZWN0IGNvbnRhaW5zIHRoZSBiYXNpYyBtZXRob2RzIGFuZCBhdHRyaWJ1dGVzIG9mIHRoZSBjbGllbnQuXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5leHBvcnQgZGVmYXVsdCB7XG5cbiAgLyoqXG4gICAqIHNvY2tldC5pbyBsaWJyYXJ5IGNsaWVudCBvYmplY3QsIGlmIGFueS5cbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIC8vIGlvOiBudWxsLFxuXG4gIC8qKlxuICAgKiBTb2NrZXQgdXNlZCB0byBjb21tdW5pY2F0ZSB3aXRoIHRoZSBzZXJ2ZXIsIGlmIGFueS5cbiAgICogQHR5cGUge1NvY2tldH1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIC8vIHNvY2tldDogbnVsbCxcblxuICBjb206IG51bGwsXG5cbiAgLyoqXG4gICAqIEluZm9ybWF0aW9uIGFib3V0IHRoZSBjbGllbnQgcGxhdGZvcm0uXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBvcyBPcGVyYXRpbmcgc3lzdGVtLlxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGlzTW9iaWxlIEluZGljYXRlcyB3aGV0aGVyIHRoZSBjbGllbnQgaXMgcnVubmluZyBvbiBhXG4gICAqIG1vYmlsZSBwbGF0Zm9ybSBvciBub3QuXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBhdWRpb0ZpbGVFeHQgQXVkaW8gZmlsZSBleHRlbnNpb24gdG8gdXNlLCBkZXBlbmRpbmcgb25cbiAgICogdGhlIHBsYXRmb3JtICgpXG4gICAqL1xuICBwbGF0Zm9ybToge1xuICAgIG9zOiBudWxsLFxuICAgIGlzTW9iaWxlOiBudWxsLFxuICAgIGF1ZGlvRmlsZUV4dDogJycsXG4gICAgaXNGb3JiaWRkZW46IGZhbHNlXG4gIH0sXG5cbiAgLyoqXG4gICAqIENsaWVudCB0eXBlLlxuICAgKiBUaGUgY2xpZW50IHR5cGUgaXMgc3BlZmljaWVkIGluIHRoZSBhcmd1bWVudCBvZiB0aGUgYGluaXRgIG1ldGhvZC4gRm9yXG4gICAqIGluc3RhbmNlLCBgJ3BsYXllcidgIGlzIHRoZSBjbGllbnQgdHlwZSB5b3Ugc2hvdWxkIGJlIHVzaW5nIGJ5IGRlZmF1bHQuXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICB0eXBlOiBudWxsLFxuXG4gIC8qKlxuICAgKiBQcm9taXNlIHJlc29sdmVkIHdoZW4gdGhlIHNlcnZlciBzZW5kcyBhIG1lc3NhZ2UgaW5kaWNhdGluZyB0aGF0IHRoZSBjbGllbnRcbiAgICogY2FuIHN0YXJ0IHRoZSBmaXJzdCBtZHVsZS5cbiAgICogQHR5cGUge1Byb21pc2V9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZWFkeTogbnVsbCxcblxuICAvKipcbiAgICogQ2xpZW50IGluZGV4LCBnaXZlbiBieSB0aGUgc2VydmVyLlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgaW5kZXg6IC0xLFxuXG4gIC8qKlxuICAgKiBDbGllbnQgY29vcmRpbmF0ZXMgKGlmIGFueSkgZ2l2ZW4gYnkgYSB7QGxpbmsgTG9jYXRvcn0sIHtAbGluayBQbGFjZXJ9IG9yXG4gICAqIHtAbGluayBDaGVja2lufSBtb2R1bGUuIChGb3JtYXQ6IGBbeDpOdW1iZXIsIHk6TnVtYmVyXWAuKVxuICAgKiBAdHlwZSB7TnVtYmVyW119XG4gICAqL1xuICBjb29yZGluYXRlczogbnVsbCxcblxuICAvKipcbiAgICogVGhlIGBpbml0YCBtZXRob2Qgc2V0cyB0aGUgY2xpZW50IHR5cGUgYW5kIGluaXRpYWxpemVzIGEgV2ViU29ja2V0IGNvbm5lY3Rpb24gYXNzb2NpYXRlZCB3aXRoIHRoZSBnaXZlbiB0eXBlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW2NsaWVudFR5cGUgPSAncGxheWVyJ10gVGhlIGNsaWVudCB0eXBlLlxuICAgKiBAdG9kbyBjbGFyaWZ5IGNsaWVudFR5cGUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucyA9IHt9XSBUaGUgb3B0aW9ucyB0byBpbml0aWFsaXplIGEgY2xpZW50XG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuaW9dIEJ5IGRlZmF1bHQsIGEgU291bmR3b3JrcyBhcHBsaWNhdGlvbiBoYXMgYSBjbGllbnQgYW5kIGEgc2VydmVyIHNpZGUuIEZvciBhIHN0YW5kYWxvbmUgYXBwbGljYXRpb24gKGNsaWVudCBzaWRlIG9ubHkpLCB1c2UgYG9wdGlvbnMuaW8gPSBmYWxzZWAuXG4gICAqIEB0b2RvIHVzZSBkZWZhdWx0IHZhbHVlIGZvciBvcHRpb25zLmlvIGluIHRoZSBkb2N1bWVudGF0aW9uP1xuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuc29ja2V0VXJsXSBUaGUgVVJMIG9mIHRoZSBXZWJTb2NrZXQgc2VydmVyLlxuICAgKi9cbiAgaW5pdChjbGllbnRUeXBlID0gJ3BsYXllcicsIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuc2VuZCA9IHRoaXMuc2VuZC5iaW5kKHRoaXMpO1xuICAgIHRoaXMucmVjZWl2ZSA9IHRoaXMucmVjZWl2ZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIgPSB0aGlzLnJlbW92ZUxpc3RlbmVyLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLnR5cGUgPSBjbGllbnRUeXBlO1xuXG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgaW86IHRydWUsXG4gICAgICBzb2NrZXRVcmw6ICcnLFxuICAgICAgdHJhbnNwb3J0czogWyd3ZWJzb2NrZXQnXSxcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIGlmIChvcHRpb25zLmlvICE9PSBmYWxzZSkge1xuICAgICAgLy8gaW5pdGlhbGl6ZSBzb2NrZXQgY29tbXVuaWNhdGlvbnNcbiAgICAgIHRoaXMuY29tID0gY29tLmluaXRpYWxpemUoY2xpZW50VHlwZSwgb3B0aW9ucyk7XG5cbiAgICAgIHRoaXMucmVhZHkgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnPz8/PycpO1xuICAgICAgICB0aGlzLmNvbS5yZWNlaXZlKCdjbGllbnQ6c3RhcnQnLCAoaW5kZXgpID0+IHtcbiAgICAgICAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlYWR5ID0gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gQG5vdGU6IG1vdmUgaW50byBQbGF0Zm9ybSA/IGNyZWF0ZSBhIGRlZGljYXRlZCBzZXJ2aWNlID9cbiAgICAvLyBnZXQgaW5mb3JtYXRpb25zIGFib3V0IGNsaWVudFxuICAgIGNvbnN0IHVhID0gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnRcbiAgICBjb25zdCBtZCA9IG5ldyBNb2JpbGVEZXRlY3QodWEpO1xuICAgIHRoaXMucGxhdGZvcm0uaXNNb2JpbGUgPSAobWQubW9iaWxlKCkgIT09IG51bGwpOyAvLyB0cnVlIGlmIHBob25lIG9yIHRhYmxldFxuICAgIHRoaXMucGxhdGZvcm0ub3MgPSAoKCkgPT4ge1xuICAgICAgbGV0IG9zID0gbWQub3MoKTtcblxuICAgICAgaWYgKG9zID09PSAnQW5kcm9pZE9TJykge1xuICAgICAgICByZXR1cm4gJ2FuZHJvaWQnO1xuICAgICAgfSBlbHNlIGlmIChvcyA9PT0gJ2lPUycpIHtcbiAgICAgICAgcmV0dXJuICdpb3MnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuICdvdGhlcic7XG4gICAgICB9XG4gICAgfSkoKTtcblxuICAgIC8vIGF1ZGlvIGZpbGUgZXh0ZW50aW9uIGNoZWNrXG4gICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2F1ZGlvJyk7XG4gICAgLy8gaHR0cDovL2RpdmVpbnRvaHRtbDUuaW5mby9ldmVyeXRoaW5nLmh0bWxcbiAgICBpZiAoISEoYS5jYW5QbGF5VHlwZSAmJiBhLmNhblBsYXlUeXBlKCdhdWRpby9tcGVnOycpKSkge1xuICAgICAgdGhpcy5wbGF0Zm9ybS5hdWRpb0ZpbGVFeHQgPSAnLm1wMyc7XG4gICAgfSBlbHNlIGlmICghIShhLmNhblBsYXlUeXBlICYmIGEuY2FuUGxheVR5cGUoJ2F1ZGlvL29nZzsgY29kZWNzPVwidm9yYmlzXCInKSkpIHtcbiAgICAgIHRoaXMucGxhdGZvcm0uYXVkaW9GaWxlRXh0ID0gJy5vZ2cnO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnBsYXRmb3JtLmF1ZGlvRmlsZUV4dCA9ICcud2F2JztcbiAgICB9XG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgfSxcblxuICAvKipcbiAgICogU3RhcnQgdGhlIG1vZHVsZSBsb2dpYyAoKmkuZS4qIHRoZSBhcHBsaWNhdGlvbikuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IHN0YXJ0RnVuIFt0b2RvXVxuICAgKiBAdG9kbyBDbGFyaWZ5IHRoZSBwYXJhbS5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gVGhlIFByb21pc2UgcmV0dXJuIHZhbHVlLlxuICAgKiBAdG9kbyBDbGFyaWZ5IHJldHVybiB2YWx1ZSAocHJvbWlzZSkuXG4gICAqIEB0b2RvIGV4YW1wbGVcbiAgICovXG4gIHN0YXJ0KHN0YXJ0RnVuKSB7XG4gICAgbGV0IG1vZHVsZSA9IHN0YXJ0RnVuOyAvLyBiZSBjb21wYXRpYmxlIHdpdGggcHJldmlvdXMgdmVyc2lvblxuXG4gICAgaWYgKHR5cGVvZiBzdGFydEZ1biA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgbW9kdWxlID0gc3RhcnRGdW4oTW9kdWxlLnNlcXVlbnRpYWwsIE1vZHVsZS5wYXJhbGxlbCk7XG4gICAgfVxuXG4gICAgbGV0IHByb21pc2UgPSBtb2R1bGUuY3JlYXRlUHJvbWlzZSgpO1xuICAgIHRoaXMucmVhZHkudGhlbigoKSA9PiBtb2R1bGUubGF1bmNoKCkpO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFRoZSBgc2VyaWFsYCBtZXRob2QgcmV0dXJucyBhIGBNb2R1bGVgIHRoYXQgc3RhcnRzIHRoZSBnaXZlbiBgLi4ubW9kdWxlc2AgaW4gc2VyaWVzLiBBZnRlciBzdGFydGluZyB0aGUgZmlyc3QgbW9kdWxlIChieSBjYWxsaW5nIGl0cyBgc3RhcnRgIG1ldGhvZCksIHRoZSBuZXh0IG1vZHVsZSBpbiB0aGUgc2VyaWVzIGlzIHN0YXJ0ZWQgKHdpdGggaXRzIGBzdGFydGAgbWV0aG9kKSB3aGVuIHRoZSBsYXN0IG1vZHVsZSBjYWxsZWQgaXRzIGBkb25lYCBtZXRob2QuIFdoZW4gdGhlIGxhc3QgbW9kdWxlIGNhbGxzIGBkb25lYCwgdGhlIHJldHVybmVkIHNlcmlhbCBtb2R1bGUgY2FsbHMgaXRzIG93biBgZG9uZWAgbWV0aG9kLlxuICAgKlxuICAgKiAqKk5vdGU6KiogeW91IGNhbiBjb21wb3VuZCBzZXJpYWwgbW9kdWxlIHNlcXVlbmNlcyB3aXRoIHBhcmFsbGVsIG1vZHVsZSBjb21iaW5hdGlvbnMgKCplLmcuKiBgY2xpZW50LnNlcmlhbChtb2R1bGUxLCBjbGllbnQucGFyYWxsZWwobW9kdWxlMiwgbW9kdWxlMyksIG1vZHVsZTQpO2ApLlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgdGhlIG5ldyBBUEkgd2l0aCB0aGUge0BsaW5rIHN0YXJ0fSBtZXRob2QuXG4gICAqIEBwYXJhbSB7Li4uTW9kdWxlfSAuLi5tb2R1bGVzIFRoZSBtb2R1bGVzIHRvIHJ1biBpbiBzZXJpYWwuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IFtkZXNjcmlwdGlvbl1cbiAgICogQHRvZG8gQ2xhcmlmeSByZXR1cm4gdmFsdWVcbiAgICogQHRvZG8gUmVtb3ZlXG4gICAqL1xuICBzZXJpYWwoLi4ubW9kdWxlcykge1xuICAgIGNvbnNvbGUubG9nKCdUaGUgZnVuY3Rpb24gXCJjbGllbnQuc2VyaWFsXCIgaXMgZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSB0aGUgbmV3IEFQSSBpbnN0ZWFkLicpO1xuICAgIHJldHVybiBNb2R1bGUuc2VxdWVudGlhbCguLi5tb2R1bGVzKTtcbiAgfSxcblxuICAvKipcbiAgICogVGhlIGBNb2R1bGVgIHJldHVybmVkIGJ5IHRoZSBgcGFyYWxsZWxgIG1ldGhvZCBzdGFydHMgdGhlIGdpdmVuIGAuLi5tb2R1bGVzYCBpbiBwYXJhbGxlbCAod2l0aCB0aGVpciBgc3RhcnRgIG1ldGhvZHMpLCBhbmQgY2FsbHMgaXRzIGBkb25lYCBtZXRob2QgYWZ0ZXIgYWxsIG1vZHVsZXMgY2FsbGVkIHRoZWlyIG93biBgZG9uZWAgbWV0aG9kcy5cbiAgICpcbiAgICogKipOb3RlOioqIHlvdSBjYW4gY29tcG91bmQgcGFyYWxsZWwgbW9kdWxlIGNvbWJpbmF0aW9ucyB3aXRoIHNlcmlhbCBtb2R1bGUgc2VxdWVuY2VzICgqZS5nLiogYGNsaWVudC5wYXJhbGxlbChtb2R1bGUxLCBjbGllbnQuc2VyaWFsKG1vZHVsZTIsIG1vZHVsZTMpLCBtb2R1bGU0KTtgKS5cbiAgICpcbiAgICogKipOb3RlOioqIHRoZSBgdmlld2Agb2YgYSBtb2R1bGUgaXMgYWx3YXlzIGZ1bGwgc2NyZWVuLCBzbyBpbiB0aGUgY2FzZSB3aGVyZSBtb2R1bGVzIHJ1biBpbiBwYXJhbGxlbCwgdGhlaXIgYHZpZXdgcyBhcmUgc3RhY2tlZCBvbiB0b3Agb2YgZWFjaCBvdGhlciB1c2luZyB0aGUgYHotaW5kZXhgIENTUyBwcm9wZXJ0eS5cbiAgICogV2UgdXNlIHRoZSBvcmRlciBvZiB0aGUgYHBhcmFsbGVsYCBtZXRob2QncyBhcmd1bWVudHMgdG8gZGV0ZXJtaW5lIHRoZSBvcmRlciBvZiB0aGUgc3RhY2sgKCplLmcuKiBpbiBgY2xpZW50LnBhcmFsbGVsKG1vZHVsZTEsIG1vZHVsZTIsIG1vZHVsZTMpYCwgdGhlIGB2aWV3YCBvZiBgbW9kdWxlMWAgaXMgZGlzcGxheWVkIG9uIHRvcCBvZiB0aGUgYHZpZXdgIG9mIGBtb2R1bGUyYCwgd2hpY2ggaXMgZGlzcGxheWVkIG9uIHRvcCBvZiB0aGUgYHZpZXdgIG9mIGBtb2R1bGUzYCkuXG4gICAqIEBkZXByZWNhdGVkIFVzZSB0aGUgbmV3IEFQSSB3aXRoIHRoZSB7QGxpbmsgc3RhcnR9IG1ldGhvZC5cbiAgICogQHBhcmFtIHsuLi5Nb2R1bGV9IG1vZHVsZXMgVGhlIG1vZHVsZXMgdG8gcnVuIGluIHBhcmFsbGVsLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBbZGVzY3JpcHRpb25dXG4gICAqIEB0b2RvIENsYXJpZnkgcmV0dXJuIHZhbHVlXG4gICAqIEB0b2RvIFJlbW92ZVxuICAgKi9cbiAgcGFyYWxsZWwoLi4ubW9kdWxlcykge1xuICAgIGNvbnNvbGUubG9nKCdUaGUgZnVuY3Rpb24gXCJjbGllbnQucGFyYWxsZWxcIiBpcyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIHRoZSBuZXcgQVBJIGluc3RlYWQuJyk7XG4gICAgcmV0dXJuIE1vZHVsZS5wYXJhbGxlbCguLi5tb2R1bGVzKTtcbiAgfSxcblxuICAvKipcbiAgICogU2VuZCBhIFdlYlNvY2tldCBtZXNzYWdlIHRvIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqICoqTm90ZToqKiBvbiB0aGUgc2VydmVyIHNpZGUsIHRoZSBzZXJ2ZXIgcmVjZWl2ZXMgdGhlIG1lc3NhZ2Ugd2l0aCB0aGUgY29tbWFuZCB7QGxpbmsgU2VydmVyQ2xpZW50I3JlY2VpdmV9LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbXNnIE5hbWUgb2YgdGhlIG1lc3NhZ2UgdG8gc2VuZC5cbiAgICogQHBhcmFtIHsuLi4qfSBhcmdzIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cbiAgICovXG4gIHNlbmQobXNnLCAuLi5hcmdzKSB7XG4gICAgaWYgKCF0aGlzLmNvbSkgeyByZXR1cm47IH1cbiAgICB0aGlzLmNvbS5zZW5kKG1zZywgLi4uYXJncyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIExpc3RlbiBmb3IgYSBXZWJTb2NrZXQgbWVzc2FnZSBmcm9tIHRoZSBzZXJ2ZXIgYW5kIGV4ZWN1dGUgYSBjYWxsYmFja1xuICAgKiBmdW5jdGlvbi5cbiAgICpcbiAgICogKipOb3RlOioqIG9uIHRoZSBzZXJ2ZXIgc2lkZSwgdGhlIHNlcnZlciBzZW5kcyB0aGUgbWVzc2FnZSB3aXRoIHRoZSBjb21tYW5kXG4gICAqIHtAbGluayBzZXJ2ZXIuc2VuZH1gLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbXNnIE5hbWUgb2YgdGhlIHJlY2VpdmVkIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIENhbGxiYWNrIGZ1bmN0aW9uIGV4ZWN1dGVkIHdoZW4gdGhlIG1lc3NhZ2UgaXNcbiAgICogcmVjZWl2ZWQuXG4gICAqL1xuICByZWNlaXZlKG1zZywgY2FsbGJhY2spIHtcbiAgICBpZiAoIXRoaXMuY29tKSB7IHJldHVybjsgfVxuICAgIHRoaXMuY29tLnJlY2VpdmUobXNnLCBjYWxsYmFjayk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIFdlYlNvY2tldCBtZXNzYWdlIGxpc3RlbmVyIChzZXQgd2l0aCB0aGUgbWV0aG9kIHtAbGlua1xuICAgKiBjbGllbnQucmVjZWl2ZX0pLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbXNnIE5hbWUgb2YgdGhlIHJlY2VpdmVkIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIENhbGxiYWNrIGZ1bmN0aW9uIGV4ZWN1dGVkIHdoZW4gdGhlIG1lc3NhZ2UgaXNcbiAgICogcmVjZWl2ZWQuXG4gICAqL1xuICByZW1vdmVMaXN0ZW5lcihtc2csIGNhbGxiYWNrKSB7XG4gICAgaWYgKCF0aGlzLmNvbSkgeyByZXR1cm47IH1cbiAgICB0aGlzLmNvbS5yZW1vdmVMaXN0ZW5lcihtc2csIGNhbGxiYWNrKTtcbiAgfVxufTtcblxuIl19