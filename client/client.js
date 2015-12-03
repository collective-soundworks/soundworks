'use strict';

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _comm = require('./comm');

var _comm2 = _interopRequireDefault(_comm);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvY2xpZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztvQkFBaUIsUUFBUTs7OztzQkFDTixVQUFVOzs7Ozs7OztxQkFPZDs7Ozs7O0FBTWIsTUFBSSxFQUFFLElBQUk7Ozs7Ozs7Ozs7O0FBV1YsVUFBUSxFQUFFO0FBQ1IsTUFBRSxFQUFFLElBQUk7QUFDUixZQUFRLEVBQUUsSUFBSTtBQUNkLGdCQUFZLEVBQUUsRUFBRTtBQUNoQixlQUFXLEVBQUUsS0FBSztHQUNuQjs7Ozs7Ozs7QUFRRCxNQUFJLEVBQUUsSUFBSTs7Ozs7Ozs7QUFRVixPQUFLLEVBQUUsSUFBSTs7Ozs7O0FBTVgsT0FBSyxFQUFFLENBQUMsQ0FBQzs7Ozs7OztBQU9ULGFBQVcsRUFBRSxJQUFJOzs7Ozs7Ozs7OztBQVdqQixNQUFJLEVBQUEsZ0JBQXNDOzs7UUFBckMsVUFBVSx5REFBRyxRQUFRO1FBQUUsT0FBTyx5REFBRyxFQUFFOzs7Ozs7QUFLdEMsUUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7OztBQUd2QixXQUFPLEdBQUcsZUFBYztBQUN0QixRQUFFLEVBQUUsSUFBSTtBQUNSLGFBQU8sRUFBRSxLQUFLO0FBQ2QsZUFBUyxFQUFFLEVBQUU7QUFDYixnQkFBVSxFQUFFLENBQUMsV0FBVyxDQUFDO0tBQzFCLEVBQUUsT0FBTyxDQUFDLENBQUM7O0FBRVosUUFBSSxPQUFPLENBQUMsRUFBRSxLQUFLLEtBQUssRUFBRTs7QUFFeEIsVUFBSSxDQUFDLElBQUksR0FBRyxrQkFBSyxVQUFVLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDOztBQUVqRCxVQUFJLENBQUMsS0FBSyxHQUFHLGFBQVksVUFBQyxPQUFPLEVBQUs7QUFDcEMsY0FBSyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxVQUFDLEtBQUssRUFBSztBQUMzQyxnQkFBSyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ25CLGlCQUFPLEVBQUUsQ0FBQztTQUNYLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUNKLE1BQU07QUFDTCxVQUFJLENBQUMsS0FBSyxHQUFHLFNBQVEsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3BDOzs7QUFHRCxRQUFJLE9BQU8sQ0FBQyxPQUFPLEVBQUU7QUFDbkIsa0JBQVksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO0tBQzFCO0dBQ0Y7Ozs7Ozs7Ozs7QUFVRCxPQUFLLEVBQUEsZUFBQyxRQUFRLEVBQUU7QUFDZCxRQUFJLE1BQU0sR0FBRyxRQUFRLENBQUM7O0FBRXRCLFFBQUksT0FBTyxRQUFRLEtBQUssVUFBVSxFQUFFO0FBQ2xDLFlBQU0sR0FBRyxRQUFRLENBQUMsb0JBQU8sVUFBVSxFQUFFLG9CQUFPLFFBQVEsQ0FBQyxDQUFDO0tBQ3ZEOztBQUVELFFBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQztBQUNyQyxRQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQzthQUFNLE1BQU0sQ0FBQyxNQUFNLEVBQUU7S0FBQSxDQUFDLENBQUM7O0FBRXZDLFdBQU8sT0FBTyxDQUFDO0dBQ2hCOztDQW1DRiIsImZpbGUiOiJzcmMvY2xpZW50L2NsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjb21tIGZyb20gJy4vY29tbSc7XG5pbXBvcnQgTW9kdWxlIGZyb20gJy4vTW9kdWxlJztcblxuXG4vKipcbiAqIFRoZSBgY2xpZW50YCBvYmplY3QgY29udGFpbnMgdGhlIGJhc2ljIG1ldGhvZHMgYW5kIGF0dHJpYnV0ZXMgb2YgdGhlIGNsaWVudC5cbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IHtcbiAgLyoqXG4gICAqIFNvY2tldCB1c2VkIHRvIGNvbW11bmljYXRlIHdpdGggdGhlIHNlcnZlciwgaWYgYW55LlxuICAgKiBAdHlwZSB7U29ja2V0fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY29tbTogbnVsbCxcblxuICAvKipcbiAgICogSW5mb3JtYXRpb24gYWJvdXQgdGhlIGNsaWVudCBwbGF0Zm9ybS5cbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtTdHJpbmd9IG9zIE9wZXJhdGluZyBzeXN0ZW0uXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gaXNNb2JpbGUgSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGNsaWVudCBpcyBydW5uaW5nIG9uIGFcbiAgICogbW9iaWxlIHBsYXRmb3JtIG9yIG5vdC5cbiAgICogQHByb3BlcnR5IHtTdHJpbmd9IGF1ZGlvRmlsZUV4dCBBdWRpbyBmaWxlIGV4dGVuc2lvbiB0byB1c2UsIGRlcGVuZGluZyBvblxuICAgKiB0aGUgcGxhdGZvcm0gKClcbiAgICovXG4gIHBsYXRmb3JtOiB7XG4gICAgb3M6IG51bGwsXG4gICAgaXNNb2JpbGU6IG51bGwsXG4gICAgYXVkaW9GaWxlRXh0OiAnJyxcbiAgICBpc0ZvcmJpZGRlbjogZmFsc2VcbiAgfSxcblxuICAvKipcbiAgICogQ2xpZW50IHR5cGUuXG4gICAqIFRoZSBjbGllbnQgdHlwZSBpcyBzcGVmaWNpZWQgaW4gdGhlIGFyZ3VtZW50IG9mIHRoZSBgaW5pdGAgbWV0aG9kLiBGb3JcbiAgICogaW5zdGFuY2UsIGAncGxheWVyJ2AgaXMgdGhlIGNsaWVudCB0eXBlIHlvdSBzaG91bGQgYmUgdXNpbmcgYnkgZGVmYXVsdC5cbiAgICogQHR5cGUge1N0cmluZ31cbiAgICovXG4gIHR5cGU6IG51bGwsXG5cbiAgLyoqXG4gICAqIFByb21pc2UgcmVzb2x2ZWQgd2hlbiB0aGUgc2VydmVyIHNlbmRzIGEgbWVzc2FnZSBpbmRpY2F0aW5nIHRoYXQgdGhlIGNsaWVudFxuICAgKiBjYW4gc3RhcnQgdGhlIGZpcnN0IG1kdWxlLlxuICAgKiBAdHlwZSB7UHJvbWlzZX1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlYWR5OiBudWxsLFxuXG4gIC8qKlxuICAgKiBDbGllbnQgaW5kZXgsIGdpdmVuIGJ5IHRoZSBzZXJ2ZXIuXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBpbmRleDogLTEsXG5cbiAgLyoqXG4gICAqIENsaWVudCBjb29yZGluYXRlcyAoaWYgYW55KSBnaXZlbiBieSBhIHtAbGluayBMb2NhdG9yfSwge0BsaW5rIFBsYWNlcn0gb3JcbiAgICoge0BsaW5rIENoZWNraW59IG1vZHVsZS4gKEZvcm1hdDogYFt4Ok51bWJlciwgeTpOdW1iZXJdYC4pXG4gICAqIEB0eXBlIHtOdW1iZXJbXX1cbiAgICovXG4gIGNvb3JkaW5hdGVzOiBudWxsLFxuXG4gIC8qKlxuICAgKiBUaGUgYGluaXRgIG1ldGhvZCBzZXRzIHRoZSBjbGllbnQgdHlwZSBhbmQgaW5pdGlhbGl6ZXMgYSBXZWJTb2NrZXQgY29ubmVjdGlvbiBhc3NvY2lhdGVkIHdpdGggdGhlIGdpdmVuIHR5cGUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbY2xpZW50VHlwZSA9ICdwbGF5ZXInXSBUaGUgY2xpZW50IHR5cGUuXG4gICAqIEB0b2RvIGNsYXJpZnkgY2xpZW50VHlwZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zID0ge31dIFRoZSBvcHRpb25zIHRvIGluaXRpYWxpemUgYSBjbGllbnRcbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5pb10gQnkgZGVmYXVsdCwgYSBTb3VuZHdvcmtzIGFwcGxpY2F0aW9uIGhhcyBhIGNsaWVudCBhbmQgYSBzZXJ2ZXIgc2lkZS4gRm9yIGEgc3RhbmRhbG9uZSBhcHBsaWNhdGlvbiAoY2xpZW50IHNpZGUgb25seSksIHVzZSBgb3B0aW9ucy5pbyA9IGZhbHNlYC5cbiAgICogQHRvZG8gdXNlIGRlZmF1bHQgdmFsdWUgZm9yIG9wdGlvbnMuaW8gaW4gdGhlIGRvY3VtZW50YXRpb24/XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5zb2NrZXRVcmxdIFRoZSBVUkwgb2YgdGhlIFdlYlNvY2tldCBzZXJ2ZXIuXG4gICAqL1xuICBpbml0KGNsaWVudFR5cGUgPSAncGxheWVyJywgb3B0aW9ucyA9IHt9KSB7XG4gICAgLy8gdGhpcy5zZW5kID0gdGhpcy5zZW5kLmJpbmQodGhpcyk7XG4gICAgLy8gdGhpcy5yZWNlaXZlID0gdGhpcy5yZWNlaXZlLmJpbmQodGhpcyk7XG4gICAgLy8gdGhpcy5yZW1vdmVMaXN0ZW5lciA9IHRoaXMucmVtb3ZlTGlzdGVuZXIuYmluZCh0aGlzKTtcblxuICAgIHRoaXMudHlwZSA9IGNsaWVudFR5cGU7XG5cbiAgICAvLyBAdG9kbyBoYXJtb25pemUgaW8gY29uZmlnIHdpdGggc2VydmVyXG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgaW86IHRydWUsXG4gICAgICBkZWJ1Z0lPOiBmYWxzZSxcbiAgICAgIHNvY2tldFVybDogJycsXG4gICAgICB0cmFuc3BvcnRzOiBbJ3dlYnNvY2tldCddLFxuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgaWYgKG9wdGlvbnMuaW8gIT09IGZhbHNlKSB7XG4gICAgICAvLyBpbml0aWFsaXplIHNvY2tldCBjb21tdW5pY2F0aW9uc1xuICAgICAgdGhpcy5jb21tID0gY29tbS5pbml0aWFsaXplKGNsaWVudFR5cGUsIG9wdGlvbnMpO1xuICAgICAgLy8gd2FpdCBmb3Igc29ja2V0IGJlaW5nIHJlYWR5IHRvIHJlc29sdmUgdGhpcyBtb2R1bGVcbiAgICAgIHRoaXMucmVhZHkgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICB0aGlzLmNvbW0ucmVjZWl2ZSgnY2xpZW50OnN0YXJ0JywgKGluZGV4KSA9PiB7XG4gICAgICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZWFkeSA9IFByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgICB9XG5cbiAgICAvLyBkZWJ1ZyAtIGh0dHA6Ly9zb2NrZXQuaW8vZG9jcy9sb2dnaW5nLWFuZC1kZWJ1Z2dpbmcvI2F2YWlsYWJsZS1kZWJ1Z2dpbmctc2NvcGVzXG4gICAgaWYgKG9wdGlvbnMuZGVidWdJTykge1xuICAgICAgbG9jYWxTdG9yYWdlLmRlYnVnID0gJyonO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogU3RhcnQgdGhlIG1vZHVsZSBsb2dpYyAoKmkuZS4qIHRoZSBhcHBsaWNhdGlvbikuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IHN0YXJ0RnVuIFt0b2RvXVxuICAgKiBAdG9kbyBDbGFyaWZ5IHRoZSBwYXJhbS5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gVGhlIFByb21pc2UgcmV0dXJuIHZhbHVlLlxuICAgKiBAdG9kbyBDbGFyaWZ5IHJldHVybiB2YWx1ZSAocHJvbWlzZSkuXG4gICAqIEB0b2RvIGV4YW1wbGVcbiAgICovXG4gIHN0YXJ0KHN0YXJ0RnVuKSB7XG4gICAgbGV0IG1vZHVsZSA9IHN0YXJ0RnVuOyAvLyBiZSBjb21wYXRpYmxlIHdpdGggcHJldmlvdXMgdmVyc2lvblxuXG4gICAgaWYgKHR5cGVvZiBzdGFydEZ1biA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgbW9kdWxlID0gc3RhcnRGdW4oTW9kdWxlLnNlcXVlbnRpYWwsIE1vZHVsZS5wYXJhbGxlbCk7XG4gICAgfVxuXG4gICAgbGV0IHByb21pc2UgPSBtb2R1bGUuY3JlYXRlUHJvbWlzZSgpO1xuICAgIHRoaXMucmVhZHkudGhlbigoKSA9PiBtb2R1bGUubGF1bmNoKCkpO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFRoZSBgc2VyaWFsYCBtZXRob2QgcmV0dXJucyBhIGBNb2R1bGVgIHRoYXQgc3RhcnRzIHRoZSBnaXZlbiBgLi4ubW9kdWxlc2AgaW4gc2VyaWVzLiBBZnRlciBzdGFydGluZyB0aGUgZmlyc3QgbW9kdWxlIChieSBjYWxsaW5nIGl0cyBgc3RhcnRgIG1ldGhvZCksIHRoZSBuZXh0IG1vZHVsZSBpbiB0aGUgc2VyaWVzIGlzIHN0YXJ0ZWQgKHdpdGggaXRzIGBzdGFydGAgbWV0aG9kKSB3aGVuIHRoZSBsYXN0IG1vZHVsZSBjYWxsZWQgaXRzIGBkb25lYCBtZXRob2QuIFdoZW4gdGhlIGxhc3QgbW9kdWxlIGNhbGxzIGBkb25lYCwgdGhlIHJldHVybmVkIHNlcmlhbCBtb2R1bGUgY2FsbHMgaXRzIG93biBgZG9uZWAgbWV0aG9kLlxuICAgKlxuICAgKiAqKk5vdGU6KiogeW91IGNhbiBjb21wb3VuZCBzZXJpYWwgbW9kdWxlIHNlcXVlbmNlcyB3aXRoIHBhcmFsbGVsIG1vZHVsZSBjb21iaW5hdGlvbnMgKCplLmcuKiBgY2xpZW50LnNlcmlhbChtb2R1bGUxLCBjbGllbnQucGFyYWxsZWwobW9kdWxlMiwgbW9kdWxlMyksIG1vZHVsZTQpO2ApLlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgdGhlIG5ldyBBUEkgd2l0aCB0aGUge0BsaW5rIHN0YXJ0fSBtZXRob2QuXG4gICAqIEBwYXJhbSB7Li4uTW9kdWxlfSAuLi5tb2R1bGVzIFRoZSBtb2R1bGVzIHRvIHJ1biBpbiBzZXJpYWwuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IFtkZXNjcmlwdGlvbl1cbiAgICogQHRvZG8gQ2xhcmlmeSByZXR1cm4gdmFsdWVcbiAgICogQHRvZG8gUmVtb3ZlXG4gICAqL1xuICAvLyBzZXJpYWwoLi4ubW9kdWxlcykge1xuICAvLyAgIGNvbnNvbGUubG9nKCdUaGUgZnVuY3Rpb24gXCJjbGllbnQuc2VyaWFsXCIgaXMgZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSB0aGUgbmV3IEFQSSBpbnN0ZWFkLicpO1xuICAvLyAgIHJldHVybiBNb2R1bGUuc2VxdWVudGlhbCguLi5tb2R1bGVzKTtcbiAgLy8gfSxcblxuICAvKipcbiAgICogVGhlIGBNb2R1bGVgIHJldHVybmVkIGJ5IHRoZSBgcGFyYWxsZWxgIG1ldGhvZCBzdGFydHMgdGhlIGdpdmVuIGAuLi5tb2R1bGVzYCBpbiBwYXJhbGxlbCAod2l0aCB0aGVpciBgc3RhcnRgIG1ldGhvZHMpLCBhbmQgY2FsbHMgaXRzIGBkb25lYCBtZXRob2QgYWZ0ZXIgYWxsIG1vZHVsZXMgY2FsbGVkIHRoZWlyIG93biBgZG9uZWAgbWV0aG9kcy5cbiAgICpcbiAgICogKipOb3RlOioqIHlvdSBjYW4gY29tcG91bmQgcGFyYWxsZWwgbW9kdWxlIGNvbWJpbmF0aW9ucyB3aXRoIHNlcmlhbCBtb2R1bGUgc2VxdWVuY2VzICgqZS5nLiogYGNsaWVudC5wYXJhbGxlbChtb2R1bGUxLCBjbGllbnQuc2VyaWFsKG1vZHVsZTIsIG1vZHVsZTMpLCBtb2R1bGU0KTtgKS5cbiAgICpcbiAgICogKipOb3RlOioqIHRoZSBgdmlld2Agb2YgYSBtb2R1bGUgaXMgYWx3YXlzIGZ1bGwgc2NyZWVuLCBzbyBpbiB0aGUgY2FzZSB3aGVyZSBtb2R1bGVzIHJ1biBpbiBwYXJhbGxlbCwgdGhlaXIgYHZpZXdgcyBhcmUgc3RhY2tlZCBvbiB0b3Agb2YgZWFjaCBvdGhlciB1c2luZyB0aGUgYHotaW5kZXhgIENTUyBwcm9wZXJ0eS5cbiAgICogV2UgdXNlIHRoZSBvcmRlciBvZiB0aGUgYHBhcmFsbGVsYCBtZXRob2QncyBhcmd1bWVudHMgdG8gZGV0ZXJtaW5lIHRoZSBvcmRlciBvZiB0aGUgc3RhY2sgKCplLmcuKiBpbiBgY2xpZW50LnBhcmFsbGVsKG1vZHVsZTEsIG1vZHVsZTIsIG1vZHVsZTMpYCwgdGhlIGB2aWV3YCBvZiBgbW9kdWxlMWAgaXMgZGlzcGxheWVkIG9uIHRvcCBvZiB0aGUgYHZpZXdgIG9mIGBtb2R1bGUyYCwgd2hpY2ggaXMgZGlzcGxheWVkIG9uIHRvcCBvZiB0aGUgYHZpZXdgIG9mIGBtb2R1bGUzYCkuXG4gICAqIEBkZXByZWNhdGVkIFVzZSB0aGUgbmV3IEFQSSB3aXRoIHRoZSB7QGxpbmsgc3RhcnR9IG1ldGhvZC5cbiAgICogQHBhcmFtIHsuLi5Nb2R1bGV9IG1vZHVsZXMgVGhlIG1vZHVsZXMgdG8gcnVuIGluIHBhcmFsbGVsLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBbZGVzY3JpcHRpb25dXG4gICAqIEB0b2RvIENsYXJpZnkgcmV0dXJuIHZhbHVlXG4gICAqIEB0b2RvIFJlbW92ZVxuICAgKi9cbiAgLy8gcGFyYWxsZWwoLi4ubW9kdWxlcykge1xuICAvLyAgIGNvbnNvbGUubG9nKCdUaGUgZnVuY3Rpb24gXCJjbGllbnQucGFyYWxsZWxcIiBpcyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIHRoZSBuZXcgQVBJIGluc3RlYWQuJyk7XG4gIC8vICAgcmV0dXJuIE1vZHVsZS5wYXJhbGxlbCguLi5tb2R1bGVzKTtcbiAgLy8gfSxcblxufTtcblxuIl19