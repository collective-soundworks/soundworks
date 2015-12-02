'use strict';

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _comm = require('./comm');

var _comm2 = _interopRequireDefault(_comm);

var _socketIoClient = require('socket.io-client');

var _socketIoClient2 = _interopRequireDefault(_socketIoClient);

var _mobileDetect = require('mobile-detect');

var _mobileDetect2 = _interopRequireDefault(_mobileDetect);

var _Module = require('./Module');

var _Module2 = _interopRequireDefault(_Module);

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

  comm: null,

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

    // this.send = this.send.bind(this);
    // this.receive = this.receive.bind(this);
    // this.removeListener = this.removeListener.bind(this);

    this.type = clientType;

    // @todo harmonize io config with server
    options = _Object$assign({
      io: true,
      socketUrl: '',
      transports: ['websocket']
    }, options);

    if (options.io !== false) {
      // initialize socket communications
      this.comm = _comm2['default'].initialize(clientType, options);
      // wait for socket being ready to resolve this module
      this.ready = new _Promise(function (resolve) {
        _this.comm.receive('client:start', function (index) {
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
  }

};
module.exports = exports['default'];
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
// serial(...modules) {
//   console.log('The function "client.serial" is deprecated. Please use the new API instead.');
//   return Module.sequential(...modules);
// },

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
// parallel(...modules) {
//   console.log('The function "client.parallel" is deprecated. Please use the new API instead.');
//   return Module.parallel(...modules);
// },

/**
 * Send a WebSocket message to the server.
 *
 * **Note:** on the server side, the server receives the message with the command {@link ServerClient#receive}.
 * @param {String} msg Name of the message to send.
 * @param {...*} args Arguments of the message (as many as needed, of any type).
 */
// send(msg, ...args) {
//   if (!this.com) { return; }
//   this.com.send(msg, ...args);
// },

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
// receive(msg, callback) {
//   if (!this.com) { return; }
//   this.com.receive(msg, callback);
// },

/**
 * Remove a WebSocket message listener (set with the method {@link
 * client.receive}).
 * @param {String} msg Name of the received message.
 * @param {Function} callback Callback function executed when the message is
 * received.
 */
// removeListener(msg, callback) {
//   if (!this.com) { return; }
//   this.com.removeListener(msg, callback);
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvY2xpZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztvQkFBaUIsUUFBUTs7Ozs4QkFDVixrQkFBa0I7Ozs7NEJBQ1IsZUFBZTs7OztzQkFDckIsVUFBVTs7Ozs7Ozs7Ozs7cUJBVWQ7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQmIsTUFBSSxFQUFFLElBQUk7Ozs7Ozs7Ozs7O0FBV1YsVUFBUSxFQUFFO0FBQ1IsTUFBRSxFQUFFLElBQUk7QUFDUixZQUFRLEVBQUUsSUFBSTtBQUNkLGdCQUFZLEVBQUUsRUFBRTtBQUNoQixlQUFXLEVBQUUsS0FBSztHQUNuQjs7Ozs7Ozs7QUFRRCxNQUFJLEVBQUUsSUFBSTs7Ozs7Ozs7QUFRVixPQUFLLEVBQUUsSUFBSTs7Ozs7O0FBTVgsT0FBSyxFQUFFLENBQUMsQ0FBQzs7Ozs7OztBQU9ULGFBQVcsRUFBRSxJQUFJOzs7Ozs7Ozs7OztBQVdqQixNQUFJLEVBQUEsZ0JBQXNDOzs7UUFBckMsVUFBVSx5REFBRyxRQUFRO1FBQUUsT0FBTyx5REFBRyxFQUFFOzs7Ozs7QUFLdEMsUUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7OztBQUd2QixXQUFPLEdBQUcsZUFBYztBQUN0QixRQUFFLEVBQUUsSUFBSTtBQUNSLGVBQVMsRUFBRSxFQUFFO0FBQ2IsZ0JBQVUsRUFBRSxDQUFDLFdBQVcsQ0FBQztLQUMxQixFQUFFLE9BQU8sQ0FBQyxDQUFDOztBQUVaLFFBQUksT0FBTyxDQUFDLEVBQUUsS0FBSyxLQUFLLEVBQUU7O0FBRXhCLFVBQUksQ0FBQyxJQUFJLEdBQUcsa0JBQUssVUFBVSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQzs7QUFFakQsVUFBSSxDQUFDLEtBQUssR0FBRyxhQUFZLFVBQUMsT0FBTyxFQUFLO0FBQ3BDLGNBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDM0MsZ0JBQUssS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNuQixpQkFBTyxFQUFFLENBQUM7U0FDWCxDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7S0FDSixNQUFNO0FBQ0wsVUFBSSxDQUFDLEtBQUssR0FBRyxTQUFRLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNwQzs7Ozs7QUFLRCxRQUFNLEVBQUUsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQTtBQUNyQyxRQUFNLEVBQUUsR0FBRyw4QkFBaUIsRUFBRSxDQUFDLENBQUM7QUFDaEMsUUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEdBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLElBQUksQUFBQyxDQUFDO0FBQ2hELFFBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxHQUFHLENBQUMsWUFBTTtBQUN4QixVQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7O0FBRWpCLFVBQUksRUFBRSxLQUFLLFdBQVcsRUFBRTtBQUN0QixlQUFPLFNBQVMsQ0FBQztPQUNsQixNQUFNLElBQUksRUFBRSxLQUFLLEtBQUssRUFBRTtBQUN2QixlQUFPLEtBQUssQ0FBQztPQUNkLE1BQU07QUFDTCxlQUFPLE9BQU8sQ0FBQztPQUNoQjtLQUNGLENBQUEsRUFBRyxDQUFDOzs7QUFHTCxRQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUUxQyxRQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsV0FBVyxJQUFJLENBQUMsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUEsQUFBQyxFQUFFO0FBQ3JELFVBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQztLQUNyQyxNQUFNLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxXQUFXLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFBLEFBQUMsRUFBRTtBQUMzRSxVQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUM7S0FDckMsTUFBTTtBQUNMLFVBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQztLQUNyQzs7R0FFRjs7Ozs7Ozs7OztBQVVELE9BQUssRUFBQSxlQUFDLFFBQVEsRUFBRTtBQUNkLFFBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQzs7QUFFdEIsUUFBSSxPQUFPLFFBQVEsS0FBSyxVQUFVLEVBQUU7QUFDbEMsWUFBTSxHQUFHLFFBQVEsQ0FBQyxvQkFBTyxVQUFVLEVBQUUsb0JBQU8sUUFBUSxDQUFDLENBQUM7S0FDdkQ7O0FBRUQsUUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDO0FBQ3JDLFFBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO2FBQU0sTUFBTSxDQUFDLE1BQU0sRUFBRTtLQUFBLENBQUMsQ0FBQzs7QUFFdkMsV0FBTyxPQUFPLENBQUM7R0FDaEI7O0NBeUVGIiwiZmlsZSI6InNyYy9jbGllbnQvY2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNvbW0gZnJvbSAnLi9jb21tJztcbmltcG9ydCBpbyBmcm9tICdzb2NrZXQuaW8tY2xpZW50JztcbmltcG9ydCBNb2JpbGVEZXRlY3QgZnJvbSAnbW9iaWxlLWRldGVjdCc7XG5pbXBvcnQgTW9kdWxlIGZyb20gJy4vTW9kdWxlJztcblxuLy8gZGVidWcgLSBodHRwOi8vc29ja2V0LmlvL2RvY3MvbG9nZ2luZy1hbmQtZGVidWdnaW5nLyNhdmFpbGFibGUtZGVidWdnaW5nLXNjb3Blc1xuLy8gbG9jYWxTdG9yYWdlLmRlYnVnID0gJyonO1xuXG5cbi8qKlxuICogVGhlIGBjbGllbnRgIG9iamVjdCBjb250YWlucyB0aGUgYmFzaWMgbWV0aG9kcyBhbmQgYXR0cmlidXRlcyBvZiB0aGUgY2xpZW50LlxuICogQHR5cGUge09iamVjdH1cbiAqL1xuZXhwb3J0IGRlZmF1bHQge1xuXG4gIC8qKlxuICAgKiBzb2NrZXQuaW8gbGlicmFyeSBjbGllbnQgb2JqZWN0LCBpZiBhbnkuXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICAvLyBpbzogbnVsbCxcblxuICAvKipcbiAgICogU29ja2V0IHVzZWQgdG8gY29tbXVuaWNhdGUgd2l0aCB0aGUgc2VydmVyLCBpZiBhbnkuXG4gICAqIEB0eXBlIHtTb2NrZXR9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICAvLyBzb2NrZXQ6IG51bGwsXG5cbiAgY29tbTogbnVsbCxcblxuICAvKipcbiAgICogSW5mb3JtYXRpb24gYWJvdXQgdGhlIGNsaWVudCBwbGF0Zm9ybS5cbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtTdHJpbmd9IG9zIE9wZXJhdGluZyBzeXN0ZW0uXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gaXNNb2JpbGUgSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGNsaWVudCBpcyBydW5uaW5nIG9uIGFcbiAgICogbW9iaWxlIHBsYXRmb3JtIG9yIG5vdC5cbiAgICogQHByb3BlcnR5IHtTdHJpbmd9IGF1ZGlvRmlsZUV4dCBBdWRpbyBmaWxlIGV4dGVuc2lvbiB0byB1c2UsIGRlcGVuZGluZyBvblxuICAgKiB0aGUgcGxhdGZvcm0gKClcbiAgICovXG4gIHBsYXRmb3JtOiB7XG4gICAgb3M6IG51bGwsXG4gICAgaXNNb2JpbGU6IG51bGwsXG4gICAgYXVkaW9GaWxlRXh0OiAnJyxcbiAgICBpc0ZvcmJpZGRlbjogZmFsc2VcbiAgfSxcblxuICAvKipcbiAgICogQ2xpZW50IHR5cGUuXG4gICAqIFRoZSBjbGllbnQgdHlwZSBpcyBzcGVmaWNpZWQgaW4gdGhlIGFyZ3VtZW50IG9mIHRoZSBgaW5pdGAgbWV0aG9kLiBGb3JcbiAgICogaW5zdGFuY2UsIGAncGxheWVyJ2AgaXMgdGhlIGNsaWVudCB0eXBlIHlvdSBzaG91bGQgYmUgdXNpbmcgYnkgZGVmYXVsdC5cbiAgICogQHR5cGUge1N0cmluZ31cbiAgICovXG4gIHR5cGU6IG51bGwsXG5cbiAgLyoqXG4gICAqIFByb21pc2UgcmVzb2x2ZWQgd2hlbiB0aGUgc2VydmVyIHNlbmRzIGEgbWVzc2FnZSBpbmRpY2F0aW5nIHRoYXQgdGhlIGNsaWVudFxuICAgKiBjYW4gc3RhcnQgdGhlIGZpcnN0IG1kdWxlLlxuICAgKiBAdHlwZSB7UHJvbWlzZX1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlYWR5OiBudWxsLFxuXG4gIC8qKlxuICAgKiBDbGllbnQgaW5kZXgsIGdpdmVuIGJ5IHRoZSBzZXJ2ZXIuXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBpbmRleDogLTEsXG5cbiAgLyoqXG4gICAqIENsaWVudCBjb29yZGluYXRlcyAoaWYgYW55KSBnaXZlbiBieSBhIHtAbGluayBMb2NhdG9yfSwge0BsaW5rIFBsYWNlcn0gb3JcbiAgICoge0BsaW5rIENoZWNraW59IG1vZHVsZS4gKEZvcm1hdDogYFt4Ok51bWJlciwgeTpOdW1iZXJdYC4pXG4gICAqIEB0eXBlIHtOdW1iZXJbXX1cbiAgICovXG4gIGNvb3JkaW5hdGVzOiBudWxsLFxuXG4gIC8qKlxuICAgKiBUaGUgYGluaXRgIG1ldGhvZCBzZXRzIHRoZSBjbGllbnQgdHlwZSBhbmQgaW5pdGlhbGl6ZXMgYSBXZWJTb2NrZXQgY29ubmVjdGlvbiBhc3NvY2lhdGVkIHdpdGggdGhlIGdpdmVuIHR5cGUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbY2xpZW50VHlwZSA9ICdwbGF5ZXInXSBUaGUgY2xpZW50IHR5cGUuXG4gICAqIEB0b2RvIGNsYXJpZnkgY2xpZW50VHlwZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zID0ge31dIFRoZSBvcHRpb25zIHRvIGluaXRpYWxpemUgYSBjbGllbnRcbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5pb10gQnkgZGVmYXVsdCwgYSBTb3VuZHdvcmtzIGFwcGxpY2F0aW9uIGhhcyBhIGNsaWVudCBhbmQgYSBzZXJ2ZXIgc2lkZS4gRm9yIGEgc3RhbmRhbG9uZSBhcHBsaWNhdGlvbiAoY2xpZW50IHNpZGUgb25seSksIHVzZSBgb3B0aW9ucy5pbyA9IGZhbHNlYC5cbiAgICogQHRvZG8gdXNlIGRlZmF1bHQgdmFsdWUgZm9yIG9wdGlvbnMuaW8gaW4gdGhlIGRvY3VtZW50YXRpb24/XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5zb2NrZXRVcmxdIFRoZSBVUkwgb2YgdGhlIFdlYlNvY2tldCBzZXJ2ZXIuXG4gICAqL1xuICBpbml0KGNsaWVudFR5cGUgPSAncGxheWVyJywgb3B0aW9ucyA9IHt9KSB7XG4gICAgLy8gdGhpcy5zZW5kID0gdGhpcy5zZW5kLmJpbmQodGhpcyk7XG4gICAgLy8gdGhpcy5yZWNlaXZlID0gdGhpcy5yZWNlaXZlLmJpbmQodGhpcyk7XG4gICAgLy8gdGhpcy5yZW1vdmVMaXN0ZW5lciA9IHRoaXMucmVtb3ZlTGlzdGVuZXIuYmluZCh0aGlzKTtcblxuICAgIHRoaXMudHlwZSA9IGNsaWVudFR5cGU7XG5cbiAgICAvLyBAdG9kbyBoYXJtb25pemUgaW8gY29uZmlnIHdpdGggc2VydmVyXG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgaW86IHRydWUsXG4gICAgICBzb2NrZXRVcmw6ICcnLFxuICAgICAgdHJhbnNwb3J0czogWyd3ZWJzb2NrZXQnXSxcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIGlmIChvcHRpb25zLmlvICE9PSBmYWxzZSkge1xuICAgICAgLy8gaW5pdGlhbGl6ZSBzb2NrZXQgY29tbXVuaWNhdGlvbnNcbiAgICAgIHRoaXMuY29tbSA9IGNvbW0uaW5pdGlhbGl6ZShjbGllbnRUeXBlLCBvcHRpb25zKTtcbiAgICAgIC8vIHdhaXQgZm9yIHNvY2tldCBiZWluZyByZWFkeSB0byByZXNvbHZlIHRoaXMgbW9kdWxlXG4gICAgICB0aGlzLnJlYWR5ID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgdGhpcy5jb21tLnJlY2VpdmUoJ2NsaWVudDpzdGFydCcsIChpbmRleCkgPT4ge1xuICAgICAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVhZHkgPSBQcm9taXNlLnJlc29sdmUodHJ1ZSk7XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBAbm90ZTogbW92ZSBpbnRvIFBsYXRmb3JtID8gY3JlYXRlIGEgZGVkaWNhdGVkIHNlcnZpY2UgP1xuICAgIC8vIGdldCBpbmZvcm1hdGlvbnMgYWJvdXQgY2xpZW50XG4gICAgY29uc3QgdWEgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudFxuICAgIGNvbnN0IG1kID0gbmV3IE1vYmlsZURldGVjdCh1YSk7XG4gICAgdGhpcy5wbGF0Zm9ybS5pc01vYmlsZSA9IChtZC5tb2JpbGUoKSAhPT0gbnVsbCk7IC8vIHRydWUgaWYgcGhvbmUgb3IgdGFibGV0XG4gICAgdGhpcy5wbGF0Zm9ybS5vcyA9ICgoKSA9PiB7XG4gICAgICBsZXQgb3MgPSBtZC5vcygpO1xuXG4gICAgICBpZiAob3MgPT09ICdBbmRyb2lkT1MnKSB7XG4gICAgICAgIHJldHVybiAnYW5kcm9pZCc7XG4gICAgICB9IGVsc2UgaWYgKG9zID09PSAnaU9TJykge1xuICAgICAgICByZXR1cm4gJ2lvcyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gJ290aGVyJztcbiAgICAgIH1cbiAgICB9KSgpO1xuXG4gICAgLy8gYXVkaW8gZmlsZSBleHRlbnRpb24gY2hlY2tcbiAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYXVkaW8nKTtcbiAgICAvLyBodHRwOi8vZGl2ZWludG9odG1sNS5pbmZvL2V2ZXJ5dGhpbmcuaHRtbFxuICAgIGlmICghIShhLmNhblBsYXlUeXBlICYmIGEuY2FuUGxheVR5cGUoJ2F1ZGlvL21wZWc7JykpKSB7XG4gICAgICB0aGlzLnBsYXRmb3JtLmF1ZGlvRmlsZUV4dCA9ICcubXAzJztcbiAgICB9IGVsc2UgaWYgKCEhKGEuY2FuUGxheVR5cGUgJiYgYS5jYW5QbGF5VHlwZSgnYXVkaW8vb2dnOyBjb2RlY3M9XCJ2b3JiaXNcIicpKSkge1xuICAgICAgdGhpcy5wbGF0Zm9ybS5hdWRpb0ZpbGVFeHQgPSAnLm9nZyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucGxhdGZvcm0uYXVkaW9GaWxlRXh0ID0gJy53YXYnO1xuICAgIH1cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICB9LFxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgbW9kdWxlIGxvZ2ljICgqaS5lLiogdGhlIGFwcGxpY2F0aW9uKS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gc3RhcnRGdW4gW3RvZG9dXG4gICAqIEB0b2RvIENsYXJpZnkgdGhlIHBhcmFtLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBUaGUgUHJvbWlzZSByZXR1cm4gdmFsdWUuXG4gICAqIEB0b2RvIENsYXJpZnkgcmV0dXJuIHZhbHVlIChwcm9taXNlKS5cbiAgICogQHRvZG8gZXhhbXBsZVxuICAgKi9cbiAgc3RhcnQoc3RhcnRGdW4pIHtcbiAgICBsZXQgbW9kdWxlID0gc3RhcnRGdW47IC8vIGJlIGNvbXBhdGlibGUgd2l0aCBwcmV2aW91cyB2ZXJzaW9uXG5cbiAgICBpZiAodHlwZW9mIHN0YXJ0RnVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBtb2R1bGUgPSBzdGFydEZ1bihNb2R1bGUuc2VxdWVudGlhbCwgTW9kdWxlLnBhcmFsbGVsKTtcbiAgICB9XG5cbiAgICBsZXQgcHJvbWlzZSA9IG1vZHVsZS5jcmVhdGVQcm9taXNlKCk7XG4gICAgdGhpcy5yZWFkeS50aGVuKCgpID0+IG1vZHVsZS5sYXVuY2goKSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfSxcblxuICAvKipcbiAgICogVGhlIGBzZXJpYWxgIG1ldGhvZCByZXR1cm5zIGEgYE1vZHVsZWAgdGhhdCBzdGFydHMgdGhlIGdpdmVuIGAuLi5tb2R1bGVzYCBpbiBzZXJpZXMuIEFmdGVyIHN0YXJ0aW5nIHRoZSBmaXJzdCBtb2R1bGUgKGJ5IGNhbGxpbmcgaXRzIGBzdGFydGAgbWV0aG9kKSwgdGhlIG5leHQgbW9kdWxlIGluIHRoZSBzZXJpZXMgaXMgc3RhcnRlZCAod2l0aCBpdHMgYHN0YXJ0YCBtZXRob2QpIHdoZW4gdGhlIGxhc3QgbW9kdWxlIGNhbGxlZCBpdHMgYGRvbmVgIG1ldGhvZC4gV2hlbiB0aGUgbGFzdCBtb2R1bGUgY2FsbHMgYGRvbmVgLCB0aGUgcmV0dXJuZWQgc2VyaWFsIG1vZHVsZSBjYWxscyBpdHMgb3duIGBkb25lYCBtZXRob2QuXG4gICAqXG4gICAqICoqTm90ZToqKiB5b3UgY2FuIGNvbXBvdW5kIHNlcmlhbCBtb2R1bGUgc2VxdWVuY2VzIHdpdGggcGFyYWxsZWwgbW9kdWxlIGNvbWJpbmF0aW9ucyAoKmUuZy4qIGBjbGllbnQuc2VyaWFsKG1vZHVsZTEsIGNsaWVudC5wYXJhbGxlbChtb2R1bGUyLCBtb2R1bGUzKSwgbW9kdWxlNCk7YCkuXG4gICAqIEBkZXByZWNhdGVkIFVzZSB0aGUgbmV3IEFQSSB3aXRoIHRoZSB7QGxpbmsgc3RhcnR9IG1ldGhvZC5cbiAgICogQHBhcmFtIHsuLi5Nb2R1bGV9IC4uLm1vZHVsZXMgVGhlIG1vZHVsZXMgdG8gcnVuIGluIHNlcmlhbC5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gW2Rlc2NyaXB0aW9uXVxuICAgKiBAdG9kbyBDbGFyaWZ5IHJldHVybiB2YWx1ZVxuICAgKiBAdG9kbyBSZW1vdmVcbiAgICovXG4gIC8vIHNlcmlhbCguLi5tb2R1bGVzKSB7XG4gIC8vICAgY29uc29sZS5sb2coJ1RoZSBmdW5jdGlvbiBcImNsaWVudC5zZXJpYWxcIiBpcyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIHRoZSBuZXcgQVBJIGluc3RlYWQuJyk7XG4gIC8vICAgcmV0dXJuIE1vZHVsZS5zZXF1ZW50aWFsKC4uLm1vZHVsZXMpO1xuICAvLyB9LFxuXG4gIC8qKlxuICAgKiBUaGUgYE1vZHVsZWAgcmV0dXJuZWQgYnkgdGhlIGBwYXJhbGxlbGAgbWV0aG9kIHN0YXJ0cyB0aGUgZ2l2ZW4gYC4uLm1vZHVsZXNgIGluIHBhcmFsbGVsICh3aXRoIHRoZWlyIGBzdGFydGAgbWV0aG9kcyksIGFuZCBjYWxscyBpdHMgYGRvbmVgIG1ldGhvZCBhZnRlciBhbGwgbW9kdWxlcyBjYWxsZWQgdGhlaXIgb3duIGBkb25lYCBtZXRob2RzLlxuICAgKlxuICAgKiAqKk5vdGU6KiogeW91IGNhbiBjb21wb3VuZCBwYXJhbGxlbCBtb2R1bGUgY29tYmluYXRpb25zIHdpdGggc2VyaWFsIG1vZHVsZSBzZXF1ZW5jZXMgKCplLmcuKiBgY2xpZW50LnBhcmFsbGVsKG1vZHVsZTEsIGNsaWVudC5zZXJpYWwobW9kdWxlMiwgbW9kdWxlMyksIG1vZHVsZTQpO2ApLlxuICAgKlxuICAgKiAqKk5vdGU6KiogdGhlIGB2aWV3YCBvZiBhIG1vZHVsZSBpcyBhbHdheXMgZnVsbCBzY3JlZW4sIHNvIGluIHRoZSBjYXNlIHdoZXJlIG1vZHVsZXMgcnVuIGluIHBhcmFsbGVsLCB0aGVpciBgdmlld2BzIGFyZSBzdGFja2VkIG9uIHRvcCBvZiBlYWNoIG90aGVyIHVzaW5nIHRoZSBgei1pbmRleGAgQ1NTIHByb3BlcnR5LlxuICAgKiBXZSB1c2UgdGhlIG9yZGVyIG9mIHRoZSBgcGFyYWxsZWxgIG1ldGhvZCdzIGFyZ3VtZW50cyB0byBkZXRlcm1pbmUgdGhlIG9yZGVyIG9mIHRoZSBzdGFjayAoKmUuZy4qIGluIGBjbGllbnQucGFyYWxsZWwobW9kdWxlMSwgbW9kdWxlMiwgbW9kdWxlMylgLCB0aGUgYHZpZXdgIG9mIGBtb2R1bGUxYCBpcyBkaXNwbGF5ZWQgb24gdG9wIG9mIHRoZSBgdmlld2Agb2YgYG1vZHVsZTJgLCB3aGljaCBpcyBkaXNwbGF5ZWQgb24gdG9wIG9mIHRoZSBgdmlld2Agb2YgYG1vZHVsZTNgKS5cbiAgICogQGRlcHJlY2F0ZWQgVXNlIHRoZSBuZXcgQVBJIHdpdGggdGhlIHtAbGluayBzdGFydH0gbWV0aG9kLlxuICAgKiBAcGFyYW0gey4uLk1vZHVsZX0gbW9kdWxlcyBUaGUgbW9kdWxlcyB0byBydW4gaW4gcGFyYWxsZWwuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IFtkZXNjcmlwdGlvbl1cbiAgICogQHRvZG8gQ2xhcmlmeSByZXR1cm4gdmFsdWVcbiAgICogQHRvZG8gUmVtb3ZlXG4gICAqL1xuICAvLyBwYXJhbGxlbCguLi5tb2R1bGVzKSB7XG4gIC8vICAgY29uc29sZS5sb2coJ1RoZSBmdW5jdGlvbiBcImNsaWVudC5wYXJhbGxlbFwiIGlzIGRlcHJlY2F0ZWQuIFBsZWFzZSB1c2UgdGhlIG5ldyBBUEkgaW5zdGVhZC4nKTtcbiAgLy8gICByZXR1cm4gTW9kdWxlLnBhcmFsbGVsKC4uLm1vZHVsZXMpO1xuICAvLyB9LFxuXG4gIC8qKlxuICAgKiBTZW5kIGEgV2ViU29ja2V0IG1lc3NhZ2UgdG8gdGhlIHNlcnZlci5cbiAgICpcbiAgICogKipOb3RlOioqIG9uIHRoZSBzZXJ2ZXIgc2lkZSwgdGhlIHNlcnZlciByZWNlaXZlcyB0aGUgbWVzc2FnZSB3aXRoIHRoZSBjb21tYW5kIHtAbGluayBTZXJ2ZXJDbGllbnQjcmVjZWl2ZX0uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBtc2cgTmFtZSBvZiB0aGUgbWVzc2FnZSB0byBzZW5kLlxuICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgQXJndW1lbnRzIG9mIHRoZSBtZXNzYWdlIChhcyBtYW55IGFzIG5lZWRlZCwgb2YgYW55IHR5cGUpLlxuICAgKi9cbiAgLy8gc2VuZChtc2csIC4uLmFyZ3MpIHtcbiAgLy8gICBpZiAoIXRoaXMuY29tKSB7IHJldHVybjsgfVxuICAvLyAgIHRoaXMuY29tLnNlbmQobXNnLCAuLi5hcmdzKTtcbiAgLy8gfSxcblxuICAvKipcbiAgICogTGlzdGVuIGZvciBhIFdlYlNvY2tldCBtZXNzYWdlIGZyb20gdGhlIHNlcnZlciBhbmQgZXhlY3V0ZSBhIGNhbGxiYWNrXG4gICAqIGZ1bmN0aW9uLlxuICAgKlxuICAgKiAqKk5vdGU6Kiogb24gdGhlIHNlcnZlciBzaWRlLCB0aGUgc2VydmVyIHNlbmRzIHRoZSBtZXNzYWdlIHdpdGggdGhlIGNvbW1hbmRcbiAgICoge0BsaW5rIHNlcnZlci5zZW5kfWAuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBtc2cgTmFtZSBvZiB0aGUgcmVjZWl2ZWQgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGJhY2sgZnVuY3Rpb24gZXhlY3V0ZWQgd2hlbiB0aGUgbWVzc2FnZSBpc1xuICAgKiByZWNlaXZlZC5cbiAgICovXG4gIC8vIHJlY2VpdmUobXNnLCBjYWxsYmFjaykge1xuICAvLyAgIGlmICghdGhpcy5jb20pIHsgcmV0dXJuOyB9XG4gIC8vICAgdGhpcy5jb20ucmVjZWl2ZShtc2csIGNhbGxiYWNrKTtcbiAgLy8gfSxcblxuICAvKipcbiAgICogUmVtb3ZlIGEgV2ViU29ja2V0IG1lc3NhZ2UgbGlzdGVuZXIgKHNldCB3aXRoIHRoZSBtZXRob2Qge0BsaW5rXG4gICAqIGNsaWVudC5yZWNlaXZlfSkuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBtc2cgTmFtZSBvZiB0aGUgcmVjZWl2ZWQgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGJhY2sgZnVuY3Rpb24gZXhlY3V0ZWQgd2hlbiB0aGUgbWVzc2FnZSBpc1xuICAgKiByZWNlaXZlZC5cbiAgICovXG4gIC8vIHJlbW92ZUxpc3RlbmVyKG1zZywgY2FsbGJhY2spIHtcbiAgLy8gICBpZiAoIXRoaXMuY29tKSB7IHJldHVybjsgfVxuICAvLyAgIHRoaXMuY29tLnJlbW92ZUxpc3RlbmVyKG1zZywgY2FsbGJhY2spO1xuICAvLyB9XG59O1xuXG4iXX0=