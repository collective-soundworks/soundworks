'use strict';

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _ClientModule = require('./ClientModule');

var _ClientModule2 = _interopRequireDefault(_ClientModule);

var _comm = require('./comm');

var _comm2 = _interopRequireDefault(_comm);

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
      module = startFun(_ClientModule2['default'].sequential, _ClientModule2['default'].parallel);
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
 * The `serial` method returns a `ClientModule` that starts the given `...modules` in series. After starting the first module (by calling its `start` method), the next module in the series is started (with its `start` method) when the last module called its `done` method. When the last module calls `done`, the returned serial module calls its own `done` method.
 *
 * **Note:** you can compound serial module sequences with parallel module combinations (*e.g.* `client.serial(module1, client.parallel(module2, module3), module4);`).
 * @deprecated Use the new API with the {@link start} method.
 * @param {...ClientModule} ...modules The modules to run in serial.
 * @return {Promise} [description]
 * @todo Clarify return value
 * @todo Remove
 */
// serial(...modules) {
//   console.log('The function "client.serial" is deprecated. Please use the new API instead.');
//   return ClientModule.sequential(...modules);
// },

/**
 * The `ClientModule` returned by the `parallel` method starts the given `...modules` in parallel (with their `start` methods), and calls its `done` method after all modules called their own `done` methods.
 *
 * **Note:** you can compound parallel module combinations with serial module sequences (*e.g.* `client.parallel(module1, client.serial(module2, module3), module4);`).
 *
 * **Note:** the `view` of a module is always full screen, so in the case where modules run in parallel, their `view`s are stacked on top of each other using the `z-index` CSS property.
 * We use the order of the `parallel` method's arguments to determine the order of the stack (*e.g.* in `client.parallel(module1, module2, module3)`, the `view` of `module1` is displayed on top of the `view` of `module2`, which is displayed on top of the `view` of `module3`).
 * @deprecated Use the new API with the {@link start} method.
 * @param {...ClientModule} modules The modules to run in parallel.
 * @return {Promise} [description]
 * @todo Clarify return value
 * @todo Remove
 */
// parallel(...modules) {
//   console.log('The function "client.parallel" is deprecated. Please use the new API instead.');
//   return ClientModule.parallel(...modules);
// },
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7NEJBQXlCLGdCQUFnQjs7OztvQkFDeEIsUUFBUTs7Ozs7Ozs7cUJBT1Y7Ozs7OztBQU1iLE1BQUksRUFBRSxJQUFJOzs7Ozs7Ozs7OztBQVdWLFVBQVEsRUFBRTtBQUNSLE1BQUUsRUFBRSxJQUFJO0FBQ1IsWUFBUSxFQUFFLElBQUk7QUFDZCxnQkFBWSxFQUFFLEVBQUU7QUFDaEIsZUFBVyxFQUFFLEtBQUs7R0FDbkI7Ozs7Ozs7O0FBUUQsTUFBSSxFQUFFLElBQUk7Ozs7Ozs7O0FBUVYsT0FBSyxFQUFFLElBQUk7Ozs7OztBQU1YLE9BQUssRUFBRSxDQUFDLENBQUM7Ozs7Ozs7QUFPVCxhQUFXLEVBQUUsSUFBSTs7Ozs7Ozs7Ozs7QUFXakIsTUFBSSxFQUFBLGdCQUFzQzs7O1FBQXJDLFVBQVUseURBQUcsUUFBUTtRQUFFLE9BQU8seURBQUcsRUFBRTs7Ozs7O0FBS3RDLFFBQUksQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDOzs7QUFHdkIsV0FBTyxHQUFHLGVBQWM7QUFDdEIsUUFBRSxFQUFFLElBQUk7QUFDUixhQUFPLEVBQUUsS0FBSztBQUNkLGVBQVMsRUFBRSxFQUFFO0FBQ2IsZ0JBQVUsRUFBRSxDQUFDLFdBQVcsQ0FBQztLQUMxQixFQUFFLE9BQU8sQ0FBQyxDQUFDOztBQUVaLFFBQUksT0FBTyxDQUFDLEVBQUUsS0FBSyxLQUFLLEVBQUU7O0FBRXhCLFVBQUksQ0FBQyxJQUFJLEdBQUcsa0JBQUssVUFBVSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQzs7QUFFakQsVUFBSSxDQUFDLEtBQUssR0FBRyxhQUFZLFVBQUMsT0FBTyxFQUFLO0FBQ3BDLGNBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDM0MsZ0JBQUssS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNuQixpQkFBTyxFQUFFLENBQUM7U0FDWCxDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7S0FDSixNQUFNO0FBQ0wsVUFBSSxDQUFDLEtBQUssR0FBRyxTQUFRLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNwQzs7O0FBR0QsUUFBSSxPQUFPLENBQUMsT0FBTyxFQUFFO0FBQ25CLGtCQUFZLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztLQUMxQjtHQUNGOzs7Ozs7Ozs7O0FBVUQsT0FBSyxFQUFBLGVBQUMsUUFBUSxFQUFFO0FBQ2QsUUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDOztBQUV0QixRQUFJLE9BQU8sUUFBUSxLQUFLLFVBQVUsRUFBRTtBQUNsQyxZQUFNLEdBQUcsUUFBUSxDQUFDLDBCQUFhLFVBQVUsRUFBRSwwQkFBYSxRQUFRLENBQUMsQ0FBQztLQUNuRTs7QUFFRCxRQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7QUFDckMsUUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7YUFBTSxNQUFNLENBQUMsTUFBTSxFQUFFO0tBQUEsQ0FBQyxDQUFDOztBQUV2QyxXQUFPLE9BQU8sQ0FBQztHQUNoQjs7Q0FtQ0YiLCJmaWxlIjoic3JjL2NsaWVudC9DbGllbnRDaGVja2luLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENsaWVudE1vZHVsZSBmcm9tICcuL0NsaWVudE1vZHVsZSc7XG5pbXBvcnQgY29tbSBmcm9tICcuL2NvbW0nO1xuXG5cbi8qKlxuICogVGhlIGBjbGllbnRgIG9iamVjdCBjb250YWlucyB0aGUgYmFzaWMgbWV0aG9kcyBhbmQgYXR0cmlidXRlcyBvZiB0aGUgY2xpZW50LlxuICogQHR5cGUge09iamVjdH1cbiAqL1xuZXhwb3J0IGRlZmF1bHQge1xuICAvKipcbiAgICogU29ja2V0IHVzZWQgdG8gY29tbXVuaWNhdGUgd2l0aCB0aGUgc2VydmVyLCBpZiBhbnkuXG4gICAqIEB0eXBlIHtTb2NrZXR9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjb21tOiBudWxsLFxuXG4gIC8qKlxuICAgKiBJbmZvcm1hdGlvbiBhYm91dCB0aGUgY2xpZW50IHBsYXRmb3JtLlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gb3MgT3BlcmF0aW5nIHN5c3RlbS5cbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBpc01vYmlsZSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgY2xpZW50IGlzIHJ1bm5pbmcgb24gYVxuICAgKiBtb2JpbGUgcGxhdGZvcm0gb3Igbm90LlxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gYXVkaW9GaWxlRXh0IEF1ZGlvIGZpbGUgZXh0ZW5zaW9uIHRvIHVzZSwgZGVwZW5kaW5nIG9uXG4gICAqIHRoZSBwbGF0Zm9ybSAoKVxuICAgKi9cbiAgcGxhdGZvcm06IHtcbiAgICBvczogbnVsbCxcbiAgICBpc01vYmlsZTogbnVsbCxcbiAgICBhdWRpb0ZpbGVFeHQ6ICcnLFxuICAgIGlzRm9yYmlkZGVuOiBmYWxzZVxuICB9LFxuXG4gIC8qKlxuICAgKiBDbGllbnQgdHlwZS5cbiAgICogVGhlIGNsaWVudCB0eXBlIGlzIHNwZWZpY2llZCBpbiB0aGUgYXJndW1lbnQgb2YgdGhlIGBpbml0YCBtZXRob2QuIEZvclxuICAgKiBpbnN0YW5jZSwgYCdwbGF5ZXInYCBpcyB0aGUgY2xpZW50IHR5cGUgeW91IHNob3VsZCBiZSB1c2luZyBieSBkZWZhdWx0LlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgdHlwZTogbnVsbCxcblxuICAvKipcbiAgICogUHJvbWlzZSByZXNvbHZlZCB3aGVuIHRoZSBzZXJ2ZXIgc2VuZHMgYSBtZXNzYWdlIGluZGljYXRpbmcgdGhhdCB0aGUgY2xpZW50XG4gICAqIGNhbiBzdGFydCB0aGUgZmlyc3QgbWR1bGUuXG4gICAqIEB0eXBlIHtQcm9taXNlfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVhZHk6IG51bGwsXG5cbiAgLyoqXG4gICAqIENsaWVudCBpbmRleCwgZ2l2ZW4gYnkgdGhlIHNlcnZlci5cbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGluZGV4OiAtMSxcblxuICAvKipcbiAgICogQ2xpZW50IGNvb3JkaW5hdGVzIChpZiBhbnkpIGdpdmVuIGJ5IGEge0BsaW5rIExvY2F0b3J9LCB7QGxpbmsgUGxhY2VyfSBvclxuICAgKiB7QGxpbmsgQ2hlY2tpbn0gbW9kdWxlLiAoRm9ybWF0OiBgW3g6TnVtYmVyLCB5Ok51bWJlcl1gLilcbiAgICogQHR5cGUge051bWJlcltdfVxuICAgKi9cbiAgY29vcmRpbmF0ZXM6IG51bGwsXG5cbiAgLyoqXG4gICAqIFRoZSBgaW5pdGAgbWV0aG9kIHNldHMgdGhlIGNsaWVudCB0eXBlIGFuZCBpbml0aWFsaXplcyBhIFdlYlNvY2tldCBjb25uZWN0aW9uIGFzc29jaWF0ZWQgd2l0aCB0aGUgZ2l2ZW4gdHlwZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtjbGllbnRUeXBlID0gJ3BsYXllciddIFRoZSBjbGllbnQgdHlwZS5cbiAgICogQHRvZG8gY2xhcmlmeSBjbGllbnRUeXBlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMgPSB7fV0gVGhlIG9wdGlvbnMgdG8gaW5pdGlhbGl6ZSBhIGNsaWVudFxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmlvXSBCeSBkZWZhdWx0LCBhIFNvdW5kd29ya3MgYXBwbGljYXRpb24gaGFzIGEgY2xpZW50IGFuZCBhIHNlcnZlciBzaWRlLiBGb3IgYSBzdGFuZGFsb25lIGFwcGxpY2F0aW9uIChjbGllbnQgc2lkZSBvbmx5KSwgdXNlIGBvcHRpb25zLmlvID0gZmFsc2VgLlxuICAgKiBAdG9kbyB1c2UgZGVmYXVsdCB2YWx1ZSBmb3Igb3B0aW9ucy5pbyBpbiB0aGUgZG9jdW1lbnRhdGlvbj9cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLnNvY2tldFVybF0gVGhlIFVSTCBvZiB0aGUgV2ViU29ja2V0IHNlcnZlci5cbiAgICovXG4gIGluaXQoY2xpZW50VHlwZSA9ICdwbGF5ZXInLCBvcHRpb25zID0ge30pIHtcbiAgICAvLyB0aGlzLnNlbmQgPSB0aGlzLnNlbmQuYmluZCh0aGlzKTtcbiAgICAvLyB0aGlzLnJlY2VpdmUgPSB0aGlzLnJlY2VpdmUuYmluZCh0aGlzKTtcbiAgICAvLyB0aGlzLnJlbW92ZUxpc3RlbmVyID0gdGhpcy5yZW1vdmVMaXN0ZW5lci5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy50eXBlID0gY2xpZW50VHlwZTtcblxuICAgIC8vIEB0b2RvIGhhcm1vbml6ZSBpbyBjb25maWcgd2l0aCBzZXJ2ZXJcbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICBpbzogdHJ1ZSxcbiAgICAgIGRlYnVnSU86IGZhbHNlLFxuICAgICAgc29ja2V0VXJsOiAnJyxcbiAgICAgIHRyYW5zcG9ydHM6IFsnd2Vic29ja2V0J10sXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICBpZiAob3B0aW9ucy5pbyAhPT0gZmFsc2UpIHtcbiAgICAgIC8vIGluaXRpYWxpemUgc29ja2V0IGNvbW11bmljYXRpb25zXG4gICAgICB0aGlzLmNvbW0gPSBjb21tLmluaXRpYWxpemUoY2xpZW50VHlwZSwgb3B0aW9ucyk7XG4gICAgICAvLyB3YWl0IGZvciBzb2NrZXQgYmVpbmcgcmVhZHkgdG8gcmVzb2x2ZSB0aGlzIG1vZHVsZVxuICAgICAgdGhpcy5yZWFkeSA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIHRoaXMuY29tbS5yZWNlaXZlKCdjbGllbnQ6c3RhcnQnLCAoaW5kZXgpID0+IHtcbiAgICAgICAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlYWR5ID0gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuICAgIH1cblxuICAgIC8vIGRlYnVnIC0gaHR0cDovL3NvY2tldC5pby9kb2NzL2xvZ2dpbmctYW5kLWRlYnVnZ2luZy8jYXZhaWxhYmxlLWRlYnVnZ2luZy1zY29wZXNcbiAgICBpZiAob3B0aW9ucy5kZWJ1Z0lPKSB7XG4gICAgICBsb2NhbFN0b3JhZ2UuZGVidWcgPSAnKic7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgbW9kdWxlIGxvZ2ljICgqaS5lLiogdGhlIGFwcGxpY2F0aW9uKS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gc3RhcnRGdW4gW3RvZG9dXG4gICAqIEB0b2RvIENsYXJpZnkgdGhlIHBhcmFtLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBUaGUgUHJvbWlzZSByZXR1cm4gdmFsdWUuXG4gICAqIEB0b2RvIENsYXJpZnkgcmV0dXJuIHZhbHVlIChwcm9taXNlKS5cbiAgICogQHRvZG8gZXhhbXBsZVxuICAgKi9cbiAgc3RhcnQoc3RhcnRGdW4pIHtcbiAgICBsZXQgbW9kdWxlID0gc3RhcnRGdW47IC8vIGJlIGNvbXBhdGlibGUgd2l0aCBwcmV2aW91cyB2ZXJzaW9uXG5cbiAgICBpZiAodHlwZW9mIHN0YXJ0RnVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBtb2R1bGUgPSBzdGFydEZ1bihDbGllbnRNb2R1bGUuc2VxdWVudGlhbCwgQ2xpZW50TW9kdWxlLnBhcmFsbGVsKTtcbiAgICB9XG5cbiAgICBsZXQgcHJvbWlzZSA9IG1vZHVsZS5jcmVhdGVQcm9taXNlKCk7XG4gICAgdGhpcy5yZWFkeS50aGVuKCgpID0+IG1vZHVsZS5sYXVuY2goKSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfSxcblxuICAvKipcbiAgICogVGhlIGBzZXJpYWxgIG1ldGhvZCByZXR1cm5zIGEgYENsaWVudE1vZHVsZWAgdGhhdCBzdGFydHMgdGhlIGdpdmVuIGAuLi5tb2R1bGVzYCBpbiBzZXJpZXMuIEFmdGVyIHN0YXJ0aW5nIHRoZSBmaXJzdCBtb2R1bGUgKGJ5IGNhbGxpbmcgaXRzIGBzdGFydGAgbWV0aG9kKSwgdGhlIG5leHQgbW9kdWxlIGluIHRoZSBzZXJpZXMgaXMgc3RhcnRlZCAod2l0aCBpdHMgYHN0YXJ0YCBtZXRob2QpIHdoZW4gdGhlIGxhc3QgbW9kdWxlIGNhbGxlZCBpdHMgYGRvbmVgIG1ldGhvZC4gV2hlbiB0aGUgbGFzdCBtb2R1bGUgY2FsbHMgYGRvbmVgLCB0aGUgcmV0dXJuZWQgc2VyaWFsIG1vZHVsZSBjYWxscyBpdHMgb3duIGBkb25lYCBtZXRob2QuXG4gICAqXG4gICAqICoqTm90ZToqKiB5b3UgY2FuIGNvbXBvdW5kIHNlcmlhbCBtb2R1bGUgc2VxdWVuY2VzIHdpdGggcGFyYWxsZWwgbW9kdWxlIGNvbWJpbmF0aW9ucyAoKmUuZy4qIGBjbGllbnQuc2VyaWFsKG1vZHVsZTEsIGNsaWVudC5wYXJhbGxlbChtb2R1bGUyLCBtb2R1bGUzKSwgbW9kdWxlNCk7YCkuXG4gICAqIEBkZXByZWNhdGVkIFVzZSB0aGUgbmV3IEFQSSB3aXRoIHRoZSB7QGxpbmsgc3RhcnR9IG1ldGhvZC5cbiAgICogQHBhcmFtIHsuLi5DbGllbnRNb2R1bGV9IC4uLm1vZHVsZXMgVGhlIG1vZHVsZXMgdG8gcnVuIGluIHNlcmlhbC5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gW2Rlc2NyaXB0aW9uXVxuICAgKiBAdG9kbyBDbGFyaWZ5IHJldHVybiB2YWx1ZVxuICAgKiBAdG9kbyBSZW1vdmVcbiAgICovXG4gIC8vIHNlcmlhbCguLi5tb2R1bGVzKSB7XG4gIC8vICAgY29uc29sZS5sb2coJ1RoZSBmdW5jdGlvbiBcImNsaWVudC5zZXJpYWxcIiBpcyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIHRoZSBuZXcgQVBJIGluc3RlYWQuJyk7XG4gIC8vICAgcmV0dXJuIENsaWVudE1vZHVsZS5zZXF1ZW50aWFsKC4uLm1vZHVsZXMpO1xuICAvLyB9LFxuXG4gIC8qKlxuICAgKiBUaGUgYENsaWVudE1vZHVsZWAgcmV0dXJuZWQgYnkgdGhlIGBwYXJhbGxlbGAgbWV0aG9kIHN0YXJ0cyB0aGUgZ2l2ZW4gYC4uLm1vZHVsZXNgIGluIHBhcmFsbGVsICh3aXRoIHRoZWlyIGBzdGFydGAgbWV0aG9kcyksIGFuZCBjYWxscyBpdHMgYGRvbmVgIG1ldGhvZCBhZnRlciBhbGwgbW9kdWxlcyBjYWxsZWQgdGhlaXIgb3duIGBkb25lYCBtZXRob2RzLlxuICAgKlxuICAgKiAqKk5vdGU6KiogeW91IGNhbiBjb21wb3VuZCBwYXJhbGxlbCBtb2R1bGUgY29tYmluYXRpb25zIHdpdGggc2VyaWFsIG1vZHVsZSBzZXF1ZW5jZXMgKCplLmcuKiBgY2xpZW50LnBhcmFsbGVsKG1vZHVsZTEsIGNsaWVudC5zZXJpYWwobW9kdWxlMiwgbW9kdWxlMyksIG1vZHVsZTQpO2ApLlxuICAgKlxuICAgKiAqKk5vdGU6KiogdGhlIGB2aWV3YCBvZiBhIG1vZHVsZSBpcyBhbHdheXMgZnVsbCBzY3JlZW4sIHNvIGluIHRoZSBjYXNlIHdoZXJlIG1vZHVsZXMgcnVuIGluIHBhcmFsbGVsLCB0aGVpciBgdmlld2BzIGFyZSBzdGFja2VkIG9uIHRvcCBvZiBlYWNoIG90aGVyIHVzaW5nIHRoZSBgei1pbmRleGAgQ1NTIHByb3BlcnR5LlxuICAgKiBXZSB1c2UgdGhlIG9yZGVyIG9mIHRoZSBgcGFyYWxsZWxgIG1ldGhvZCdzIGFyZ3VtZW50cyB0byBkZXRlcm1pbmUgdGhlIG9yZGVyIG9mIHRoZSBzdGFjayAoKmUuZy4qIGluIGBjbGllbnQucGFyYWxsZWwobW9kdWxlMSwgbW9kdWxlMiwgbW9kdWxlMylgLCB0aGUgYHZpZXdgIG9mIGBtb2R1bGUxYCBpcyBkaXNwbGF5ZWQgb24gdG9wIG9mIHRoZSBgdmlld2Agb2YgYG1vZHVsZTJgLCB3aGljaCBpcyBkaXNwbGF5ZWQgb24gdG9wIG9mIHRoZSBgdmlld2Agb2YgYG1vZHVsZTNgKS5cbiAgICogQGRlcHJlY2F0ZWQgVXNlIHRoZSBuZXcgQVBJIHdpdGggdGhlIHtAbGluayBzdGFydH0gbWV0aG9kLlxuICAgKiBAcGFyYW0gey4uLkNsaWVudE1vZHVsZX0gbW9kdWxlcyBUaGUgbW9kdWxlcyB0byBydW4gaW4gcGFyYWxsZWwuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IFtkZXNjcmlwdGlvbl1cbiAgICogQHRvZG8gQ2xhcmlmeSByZXR1cm4gdmFsdWVcbiAgICogQHRvZG8gUmVtb3ZlXG4gICAqL1xuICAvLyBwYXJhbGxlbCguLi5tb2R1bGVzKSB7XG4gIC8vICAgY29uc29sZS5sb2coJ1RoZSBmdW5jdGlvbiBcImNsaWVudC5wYXJhbGxlbFwiIGlzIGRlcHJlY2F0ZWQuIFBsZWFzZSB1c2UgdGhlIG5ldyBBUEkgaW5zdGVhZC4nKTtcbiAgLy8gICByZXR1cm4gQ2xpZW50TW9kdWxlLnBhcmFsbGVsKC4uLm1vZHVsZXMpO1xuICAvLyB9LFxuXG59O1xuXG4iXX0=