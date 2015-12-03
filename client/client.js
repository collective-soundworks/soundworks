'use strict';

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _comm = require('./comm');

var _comm2 = _interopRequireDefault(_comm);

var _mobileDetect = require('mobile-detect');

var _mobileDetect2 = _interopRequireDefault(_mobileDetect);

var _Module = require('./Module');

var _Module2 = _interopRequireDefault(_Module);

/**
 * The `client` object contains the basic methods and attributes of the client.
 * @type {Object}
 */
exports['default'] = {
  /**
   * Socket used to communicate with the server, if any.
   * @type {Socket}
   * @private
   */
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
      debugIO: false,
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

    // debug - http://socket.io/docs/logging-and-debugging/#available-debugging-scopes
    if (options.debugIO) {
      localStorage.debug = '*';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvY2xpZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztvQkFBaUIsUUFBUTs7Ozs0QkFDQSxlQUFlOzs7O3NCQUNyQixVQUFVOzs7Ozs7OztxQkFPZDs7Ozs7O0FBTWIsTUFBSSxFQUFFLElBQUk7Ozs7Ozs7Ozs7O0FBV1YsVUFBUSxFQUFFO0FBQ1IsTUFBRSxFQUFFLElBQUk7QUFDUixZQUFRLEVBQUUsSUFBSTtBQUNkLGdCQUFZLEVBQUUsRUFBRTtBQUNoQixlQUFXLEVBQUUsS0FBSztHQUNuQjs7Ozs7Ozs7QUFRRCxNQUFJLEVBQUUsSUFBSTs7Ozs7Ozs7QUFRVixPQUFLLEVBQUUsSUFBSTs7Ozs7O0FBTVgsT0FBSyxFQUFFLENBQUMsQ0FBQzs7Ozs7OztBQU9ULGFBQVcsRUFBRSxJQUFJOzs7Ozs7Ozs7OztBQVdqQixNQUFJLEVBQUEsZ0JBQXNDOzs7UUFBckMsVUFBVSx5REFBRyxRQUFRO1FBQUUsT0FBTyx5REFBRyxFQUFFOzs7Ozs7QUFLdEMsUUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7OztBQUd2QixXQUFPLEdBQUcsZUFBYztBQUN0QixRQUFFLEVBQUUsSUFBSTtBQUNSLGFBQU8sRUFBRSxLQUFLO0FBQ2QsZUFBUyxFQUFFLEVBQUU7QUFDYixnQkFBVSxFQUFFLENBQUMsV0FBVyxDQUFDO0tBQzFCLEVBQUUsT0FBTyxDQUFDLENBQUM7O0FBRVosUUFBSSxPQUFPLENBQUMsRUFBRSxLQUFLLEtBQUssRUFBRTs7QUFFeEIsVUFBSSxDQUFDLElBQUksR0FBRyxrQkFBSyxVQUFVLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDOztBQUVqRCxVQUFJLENBQUMsS0FBSyxHQUFHLGFBQVksVUFBQyxPQUFPLEVBQUs7QUFDcEMsY0FBSyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxVQUFDLEtBQUssRUFBSztBQUMzQyxnQkFBSyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ25CLGlCQUFPLEVBQUUsQ0FBQztTQUNYLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUNKLE1BQU07QUFDTCxVQUFJLENBQUMsS0FBSyxHQUFHLFNBQVEsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3BDOzs7QUFHRCxRQUFJLE9BQU8sQ0FBQyxPQUFPLEVBQUU7QUFDbkIsa0JBQVksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO0tBQzFCO0dBQ0Y7Ozs7Ozs7Ozs7QUFVRCxPQUFLLEVBQUEsZUFBQyxRQUFRLEVBQUU7QUFDZCxRQUFJLE1BQU0sR0FBRyxRQUFRLENBQUM7O0FBRXRCLFFBQUksT0FBTyxRQUFRLEtBQUssVUFBVSxFQUFFO0FBQ2xDLFlBQU0sR0FBRyxRQUFRLENBQUMsb0JBQU8sVUFBVSxFQUFFLG9CQUFPLFFBQVEsQ0FBQyxDQUFDO0tBQ3ZEOztBQUVELFFBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQztBQUNyQyxRQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQzthQUFNLE1BQU0sQ0FBQyxNQUFNLEVBQUU7S0FBQSxDQUFDLENBQUM7O0FBRXZDLFdBQU8sT0FBTyxDQUFDO0dBQ2hCOztDQW1DRiIsImZpbGUiOiJzcmMvY2xpZW50L2NsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjb21tIGZyb20gJy4vY29tbSc7XG5pbXBvcnQgTW9iaWxlRGV0ZWN0IGZyb20gJ21vYmlsZS1kZXRlY3QnO1xuaW1wb3J0IE1vZHVsZSBmcm9tICcuL01vZHVsZSc7XG5cblxuLyoqXG4gKiBUaGUgYGNsaWVudGAgb2JqZWN0IGNvbnRhaW5zIHRoZSBiYXNpYyBtZXRob2RzIGFuZCBhdHRyaWJ1dGVzIG9mIHRoZSBjbGllbnQuXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8qKlxuICAgKiBTb2NrZXQgdXNlZCB0byBjb21tdW5pY2F0ZSB3aXRoIHRoZSBzZXJ2ZXIsIGlmIGFueS5cbiAgICogQHR5cGUge1NvY2tldH1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNvbW06IG51bGwsXG5cbiAgLyoqXG4gICAqIEluZm9ybWF0aW9uIGFib3V0IHRoZSBjbGllbnQgcGxhdGZvcm0uXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBvcyBPcGVyYXRpbmcgc3lzdGVtLlxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGlzTW9iaWxlIEluZGljYXRlcyB3aGV0aGVyIHRoZSBjbGllbnQgaXMgcnVubmluZyBvbiBhXG4gICAqIG1vYmlsZSBwbGF0Zm9ybSBvciBub3QuXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBhdWRpb0ZpbGVFeHQgQXVkaW8gZmlsZSBleHRlbnNpb24gdG8gdXNlLCBkZXBlbmRpbmcgb25cbiAgICogdGhlIHBsYXRmb3JtICgpXG4gICAqL1xuICBwbGF0Zm9ybToge1xuICAgIG9zOiBudWxsLFxuICAgIGlzTW9iaWxlOiBudWxsLFxuICAgIGF1ZGlvRmlsZUV4dDogJycsXG4gICAgaXNGb3JiaWRkZW46IGZhbHNlXG4gIH0sXG5cbiAgLyoqXG4gICAqIENsaWVudCB0eXBlLlxuICAgKiBUaGUgY2xpZW50IHR5cGUgaXMgc3BlZmljaWVkIGluIHRoZSBhcmd1bWVudCBvZiB0aGUgYGluaXRgIG1ldGhvZC4gRm9yXG4gICAqIGluc3RhbmNlLCBgJ3BsYXllcidgIGlzIHRoZSBjbGllbnQgdHlwZSB5b3Ugc2hvdWxkIGJlIHVzaW5nIGJ5IGRlZmF1bHQuXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICB0eXBlOiBudWxsLFxuXG4gIC8qKlxuICAgKiBQcm9taXNlIHJlc29sdmVkIHdoZW4gdGhlIHNlcnZlciBzZW5kcyBhIG1lc3NhZ2UgaW5kaWNhdGluZyB0aGF0IHRoZSBjbGllbnRcbiAgICogY2FuIHN0YXJ0IHRoZSBmaXJzdCBtZHVsZS5cbiAgICogQHR5cGUge1Byb21pc2V9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZWFkeTogbnVsbCxcblxuICAvKipcbiAgICogQ2xpZW50IGluZGV4LCBnaXZlbiBieSB0aGUgc2VydmVyLlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgaW5kZXg6IC0xLFxuXG4gIC8qKlxuICAgKiBDbGllbnQgY29vcmRpbmF0ZXMgKGlmIGFueSkgZ2l2ZW4gYnkgYSB7QGxpbmsgTG9jYXRvcn0sIHtAbGluayBQbGFjZXJ9IG9yXG4gICAqIHtAbGluayBDaGVja2lufSBtb2R1bGUuIChGb3JtYXQ6IGBbeDpOdW1iZXIsIHk6TnVtYmVyXWAuKVxuICAgKiBAdHlwZSB7TnVtYmVyW119XG4gICAqL1xuICBjb29yZGluYXRlczogbnVsbCxcblxuICAvKipcbiAgICogVGhlIGBpbml0YCBtZXRob2Qgc2V0cyB0aGUgY2xpZW50IHR5cGUgYW5kIGluaXRpYWxpemVzIGEgV2ViU29ja2V0IGNvbm5lY3Rpb24gYXNzb2NpYXRlZCB3aXRoIHRoZSBnaXZlbiB0eXBlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW2NsaWVudFR5cGUgPSAncGxheWVyJ10gVGhlIGNsaWVudCB0eXBlLlxuICAgKiBAdG9kbyBjbGFyaWZ5IGNsaWVudFR5cGUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucyA9IHt9XSBUaGUgb3B0aW9ucyB0byBpbml0aWFsaXplIGEgY2xpZW50XG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuaW9dIEJ5IGRlZmF1bHQsIGEgU291bmR3b3JrcyBhcHBsaWNhdGlvbiBoYXMgYSBjbGllbnQgYW5kIGEgc2VydmVyIHNpZGUuIEZvciBhIHN0YW5kYWxvbmUgYXBwbGljYXRpb24gKGNsaWVudCBzaWRlIG9ubHkpLCB1c2UgYG9wdGlvbnMuaW8gPSBmYWxzZWAuXG4gICAqIEB0b2RvIHVzZSBkZWZhdWx0IHZhbHVlIGZvciBvcHRpb25zLmlvIGluIHRoZSBkb2N1bWVudGF0aW9uP1xuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuc29ja2V0VXJsXSBUaGUgVVJMIG9mIHRoZSBXZWJTb2NrZXQgc2VydmVyLlxuICAgKi9cbiAgaW5pdChjbGllbnRUeXBlID0gJ3BsYXllcicsIG9wdGlvbnMgPSB7fSkge1xuICAgIC8vIHRoaXMuc2VuZCA9IHRoaXMuc2VuZC5iaW5kKHRoaXMpO1xuICAgIC8vIHRoaXMucmVjZWl2ZSA9IHRoaXMucmVjZWl2ZS5iaW5kKHRoaXMpO1xuICAgIC8vIHRoaXMucmVtb3ZlTGlzdGVuZXIgPSB0aGlzLnJlbW92ZUxpc3RlbmVyLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLnR5cGUgPSBjbGllbnRUeXBlO1xuXG4gICAgLy8gQHRvZG8gaGFybW9uaXplIGlvIGNvbmZpZyB3aXRoIHNlcnZlclxuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIGlvOiB0cnVlLFxuICAgICAgZGVidWdJTzogZmFsc2UsXG4gICAgICBzb2NrZXRVcmw6ICcnLFxuICAgICAgdHJhbnNwb3J0czogWyd3ZWJzb2NrZXQnXSxcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIGlmIChvcHRpb25zLmlvICE9PSBmYWxzZSkge1xuICAgICAgLy8gaW5pdGlhbGl6ZSBzb2NrZXQgY29tbXVuaWNhdGlvbnNcbiAgICAgIHRoaXMuY29tbSA9IGNvbW0uaW5pdGlhbGl6ZShjbGllbnRUeXBlLCBvcHRpb25zKTtcbiAgICAgIC8vIHdhaXQgZm9yIHNvY2tldCBiZWluZyByZWFkeSB0byByZXNvbHZlIHRoaXMgbW9kdWxlXG4gICAgICB0aGlzLnJlYWR5ID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgdGhpcy5jb21tLnJlY2VpdmUoJ2NsaWVudDpzdGFydCcsIChpbmRleCkgPT4ge1xuICAgICAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVhZHkgPSBQcm9taXNlLnJlc29sdmUodHJ1ZSk7XG4gICAgfVxuXG4gICAgLy8gZGVidWcgLSBodHRwOi8vc29ja2V0LmlvL2RvY3MvbG9nZ2luZy1hbmQtZGVidWdnaW5nLyNhdmFpbGFibGUtZGVidWdnaW5nLXNjb3Blc1xuICAgIGlmIChvcHRpb25zLmRlYnVnSU8pIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5kZWJ1ZyA9ICcqJztcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBtb2R1bGUgbG9naWMgKCppLmUuKiB0aGUgYXBwbGljYXRpb24pLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdGFydEZ1biBbdG9kb11cbiAgICogQHRvZG8gQ2xhcmlmeSB0aGUgcGFyYW0uXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IFRoZSBQcm9taXNlIHJldHVybiB2YWx1ZS5cbiAgICogQHRvZG8gQ2xhcmlmeSByZXR1cm4gdmFsdWUgKHByb21pc2UpLlxuICAgKiBAdG9kbyBleGFtcGxlXG4gICAqL1xuICBzdGFydChzdGFydEZ1bikge1xuICAgIGxldCBtb2R1bGUgPSBzdGFydEZ1bjsgLy8gYmUgY29tcGF0aWJsZSB3aXRoIHByZXZpb3VzIHZlcnNpb25cblxuICAgIGlmICh0eXBlb2Ygc3RhcnRGdW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIG1vZHVsZSA9IHN0YXJ0RnVuKE1vZHVsZS5zZXF1ZW50aWFsLCBNb2R1bGUucGFyYWxsZWwpO1xuICAgIH1cblxuICAgIGxldCBwcm9taXNlID0gbW9kdWxlLmNyZWF0ZVByb21pc2UoKTtcbiAgICB0aGlzLnJlYWR5LnRoZW4oKCkgPT4gbW9kdWxlLmxhdW5jaCgpKTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBUaGUgYHNlcmlhbGAgbWV0aG9kIHJldHVybnMgYSBgTW9kdWxlYCB0aGF0IHN0YXJ0cyB0aGUgZ2l2ZW4gYC4uLm1vZHVsZXNgIGluIHNlcmllcy4gQWZ0ZXIgc3RhcnRpbmcgdGhlIGZpcnN0IG1vZHVsZSAoYnkgY2FsbGluZyBpdHMgYHN0YXJ0YCBtZXRob2QpLCB0aGUgbmV4dCBtb2R1bGUgaW4gdGhlIHNlcmllcyBpcyBzdGFydGVkICh3aXRoIGl0cyBgc3RhcnRgIG1ldGhvZCkgd2hlbiB0aGUgbGFzdCBtb2R1bGUgY2FsbGVkIGl0cyBgZG9uZWAgbWV0aG9kLiBXaGVuIHRoZSBsYXN0IG1vZHVsZSBjYWxscyBgZG9uZWAsIHRoZSByZXR1cm5lZCBzZXJpYWwgbW9kdWxlIGNhbGxzIGl0cyBvd24gYGRvbmVgIG1ldGhvZC5cbiAgICpcbiAgICogKipOb3RlOioqIHlvdSBjYW4gY29tcG91bmQgc2VyaWFsIG1vZHVsZSBzZXF1ZW5jZXMgd2l0aCBwYXJhbGxlbCBtb2R1bGUgY29tYmluYXRpb25zICgqZS5nLiogYGNsaWVudC5zZXJpYWwobW9kdWxlMSwgY2xpZW50LnBhcmFsbGVsKG1vZHVsZTIsIG1vZHVsZTMpLCBtb2R1bGU0KTtgKS5cbiAgICogQGRlcHJlY2F0ZWQgVXNlIHRoZSBuZXcgQVBJIHdpdGggdGhlIHtAbGluayBzdGFydH0gbWV0aG9kLlxuICAgKiBAcGFyYW0gey4uLk1vZHVsZX0gLi4ubW9kdWxlcyBUaGUgbW9kdWxlcyB0byBydW4gaW4gc2VyaWFsLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBbZGVzY3JpcHRpb25dXG4gICAqIEB0b2RvIENsYXJpZnkgcmV0dXJuIHZhbHVlXG4gICAqIEB0b2RvIFJlbW92ZVxuICAgKi9cbiAgLy8gc2VyaWFsKC4uLm1vZHVsZXMpIHtcbiAgLy8gICBjb25zb2xlLmxvZygnVGhlIGZ1bmN0aW9uIFwiY2xpZW50LnNlcmlhbFwiIGlzIGRlcHJlY2F0ZWQuIFBsZWFzZSB1c2UgdGhlIG5ldyBBUEkgaW5zdGVhZC4nKTtcbiAgLy8gICByZXR1cm4gTW9kdWxlLnNlcXVlbnRpYWwoLi4ubW9kdWxlcyk7XG4gIC8vIH0sXG5cbiAgLyoqXG4gICAqIFRoZSBgTW9kdWxlYCByZXR1cm5lZCBieSB0aGUgYHBhcmFsbGVsYCBtZXRob2Qgc3RhcnRzIHRoZSBnaXZlbiBgLi4ubW9kdWxlc2AgaW4gcGFyYWxsZWwgKHdpdGggdGhlaXIgYHN0YXJ0YCBtZXRob2RzKSwgYW5kIGNhbGxzIGl0cyBgZG9uZWAgbWV0aG9kIGFmdGVyIGFsbCBtb2R1bGVzIGNhbGxlZCB0aGVpciBvd24gYGRvbmVgIG1ldGhvZHMuXG4gICAqXG4gICAqICoqTm90ZToqKiB5b3UgY2FuIGNvbXBvdW5kIHBhcmFsbGVsIG1vZHVsZSBjb21iaW5hdGlvbnMgd2l0aCBzZXJpYWwgbW9kdWxlIHNlcXVlbmNlcyAoKmUuZy4qIGBjbGllbnQucGFyYWxsZWwobW9kdWxlMSwgY2xpZW50LnNlcmlhbChtb2R1bGUyLCBtb2R1bGUzKSwgbW9kdWxlNCk7YCkuXG4gICAqXG4gICAqICoqTm90ZToqKiB0aGUgYHZpZXdgIG9mIGEgbW9kdWxlIGlzIGFsd2F5cyBmdWxsIHNjcmVlbiwgc28gaW4gdGhlIGNhc2Ugd2hlcmUgbW9kdWxlcyBydW4gaW4gcGFyYWxsZWwsIHRoZWlyIGB2aWV3YHMgYXJlIHN0YWNrZWQgb24gdG9wIG9mIGVhY2ggb3RoZXIgdXNpbmcgdGhlIGB6LWluZGV4YCBDU1MgcHJvcGVydHkuXG4gICAqIFdlIHVzZSB0aGUgb3JkZXIgb2YgdGhlIGBwYXJhbGxlbGAgbWV0aG9kJ3MgYXJndW1lbnRzIHRvIGRldGVybWluZSB0aGUgb3JkZXIgb2YgdGhlIHN0YWNrICgqZS5nLiogaW4gYGNsaWVudC5wYXJhbGxlbChtb2R1bGUxLCBtb2R1bGUyLCBtb2R1bGUzKWAsIHRoZSBgdmlld2Agb2YgYG1vZHVsZTFgIGlzIGRpc3BsYXllZCBvbiB0b3Agb2YgdGhlIGB2aWV3YCBvZiBgbW9kdWxlMmAsIHdoaWNoIGlzIGRpc3BsYXllZCBvbiB0b3Agb2YgdGhlIGB2aWV3YCBvZiBgbW9kdWxlM2ApLlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgdGhlIG5ldyBBUEkgd2l0aCB0aGUge0BsaW5rIHN0YXJ0fSBtZXRob2QuXG4gICAqIEBwYXJhbSB7Li4uTW9kdWxlfSBtb2R1bGVzIFRoZSBtb2R1bGVzIHRvIHJ1biBpbiBwYXJhbGxlbC5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gW2Rlc2NyaXB0aW9uXVxuICAgKiBAdG9kbyBDbGFyaWZ5IHJldHVybiB2YWx1ZVxuICAgKiBAdG9kbyBSZW1vdmVcbiAgICovXG4gIC8vIHBhcmFsbGVsKC4uLm1vZHVsZXMpIHtcbiAgLy8gICBjb25zb2xlLmxvZygnVGhlIGZ1bmN0aW9uIFwiY2xpZW50LnBhcmFsbGVsXCIgaXMgZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSB0aGUgbmV3IEFQSSBpbnN0ZWFkLicpO1xuICAvLyAgIHJldHVybiBNb2R1bGUucGFyYWxsZWwoLi4ubW9kdWxlcyk7XG4gIC8vIH0sXG5cbn07XG5cbiJdfQ==