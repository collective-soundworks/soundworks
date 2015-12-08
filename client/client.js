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

var _displayDefaultTextContents = require('./display/defaultTextContents');

var _displayDefaultTextContents2 = _interopRequireDefault(_displayDefaultTextContents);

var _displayDefaultTemplates = require('./display/defaultTemplates');

var _displayDefaultTemplates2 = _interopRequireDefault(_displayDefaultTemplates);

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
   * @param {String} [optiondefaultTextContentss.socketUrl] The URL of the WebSocket server.
   */
  init: function init() {
    var _this = this;

    var clientType = arguments.length <= 0 || arguments[0] === undefined ? 'player' : arguments[0];
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    this.type = clientType;

    // @todo harmonize io config with server
    options = _Object$assign({
      io: true,
      debugIO: false,
      socketUrl: '',
      transports: ['websocket'],
      appContainer: '#container'
    }, options);

    // initialize modules views with default texts and templates
    this.textContents = {};
    this.templates = {};
    this.setViewContentDefinitions(_displayDefaultTextContents2['default']);
    this.setViewTemplateDefinitions(_displayDefaultTemplates2['default']);
    this.setAppContainer(options.appContainer);

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
   * Extend application text contents with the given object.
   * @param {Object} contents - The text contents to propagate to modules.
   */
  setViewContentDefinitions: function setViewContentDefinitions(defs) {
    this.textContents = _Object$assign(this.textContents, defs);
    _ClientModule2['default'].setViewContentDefinitions(this.textContents);
  },

  /**
   * Extend application templates with the given object.
   * @param {Object} templates - The templates to propagate to modules.
   */
  setViewTemplateDefinitions: function setViewTemplateDefinitions(defs) {
    this.templates = _Object$assign(this.templates, defs);
    _ClientModule2['default'].setViewTemplateDefinitions(this.templates);
  },

  /**
   * Sets the default view container for all `ClientModule`s
   * @param {String|Element} el - A DOM element or a css selector matching the element to use as a container.
   */
  setAppContainer: function setAppContainer(el) {
    var $container = el instanceof Element ? el : document.querySelector(el);
    _ClientModule2['default'].setViewContainer($container);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvY2xpZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs0QkFBeUIsZ0JBQWdCOzs7O29CQUN4QixRQUFROzs7OzBDQUNPLCtCQUErQjs7Ozt1Q0FDbEMsNEJBQTRCOzs7Ozs7OztxQkFPMUM7Ozs7OztBQU1iLE1BQUksRUFBRSxJQUFJOzs7Ozs7Ozs7OztBQVdWLFVBQVEsRUFBRTtBQUNSLE1BQUUsRUFBRSxJQUFJO0FBQ1IsWUFBUSxFQUFFLElBQUk7QUFDZCxnQkFBWSxFQUFFLEVBQUU7QUFDaEIsZUFBVyxFQUFFLEtBQUs7R0FDbkI7Ozs7Ozs7O0FBUUQsTUFBSSxFQUFFLElBQUk7Ozs7Ozs7O0FBUVYsT0FBSyxFQUFFLElBQUk7Ozs7OztBQU1YLE9BQUssRUFBRSxDQUFDLENBQUM7Ozs7Ozs7QUFPVCxhQUFXLEVBQUUsSUFBSTs7Ozs7Ozs7Ozs7QUFXakIsTUFBSSxFQUFBLGdCQUFzQzs7O1FBQXJDLFVBQVUseURBQUcsUUFBUTtRQUFFLE9BQU8seURBQUcsRUFBRTs7QUFDdEMsUUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7OztBQUd2QixXQUFPLEdBQUcsZUFBYztBQUN0QixRQUFFLEVBQUUsSUFBSTtBQUNSLGFBQU8sRUFBRSxLQUFLO0FBQ2QsZUFBUyxFQUFFLEVBQUU7QUFDYixnQkFBVSxFQUFFLENBQUMsV0FBVyxDQUFDO0FBQ3pCLGtCQUFZLEVBQUUsWUFBWTtLQUMzQixFQUFFLE9BQU8sQ0FBQyxDQUFDOzs7QUFHWixRQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztBQUN2QixRQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztBQUNwQixRQUFJLENBQUMseUJBQXlCLHlDQUFxQixDQUFDO0FBQ3BELFFBQUksQ0FBQywwQkFBMEIsc0NBQWtCLENBQUM7QUFDbEQsUUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7O0FBRTNDLFFBQUksT0FBTyxDQUFDLEVBQUUsS0FBSyxLQUFLLEVBQUU7O0FBRXhCLFVBQUksQ0FBQyxJQUFJLEdBQUcsa0JBQUssVUFBVSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQzs7QUFFakQsVUFBSSxDQUFDLEtBQUssR0FBRyxhQUFZLFVBQUMsT0FBTyxFQUFLO0FBQ3BDLGNBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDM0MsZ0JBQUssS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNuQixpQkFBTyxFQUFFLENBQUM7U0FDWCxDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7S0FDSixNQUFNO0FBQ0wsVUFBSSxDQUFDLEtBQUssR0FBRyxTQUFRLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNwQzs7O0FBR0QsUUFBSSxPQUFPLENBQUMsT0FBTyxFQUFFO0FBQ25CLGtCQUFZLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztLQUMxQjtHQUNGOzs7Ozs7QUFNRCwyQkFBeUIsRUFBQSxtQ0FBQyxJQUFJLEVBQUU7QUFDOUIsUUFBSSxDQUFDLFlBQVksR0FBRyxlQUFjLElBQUksQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDM0QsOEJBQWEseUJBQXlCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0dBQzNEOzs7Ozs7QUFNRCw0QkFBMEIsRUFBQSxvQ0FBQyxJQUFJLEVBQUU7QUFDL0IsUUFBSSxDQUFDLFNBQVMsR0FBRyxlQUFjLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDckQsOEJBQWEsMEJBQTBCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0dBQ3pEOzs7Ozs7QUFNRCxpQkFBZSxFQUFBLHlCQUFDLEVBQUUsRUFBRTtBQUNsQixRQUFNLFVBQVUsR0FBRyxFQUFFLFlBQVksT0FBTyxHQUFHLEVBQUUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzNFLDhCQUFhLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0dBQzNDOzs7Ozs7Ozs7O0FBVUQsT0FBSyxFQUFBLGVBQUMsUUFBUSxFQUFFO0FBQ2QsUUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDOztBQUV0QixRQUFJLE9BQU8sUUFBUSxLQUFLLFVBQVUsRUFBRTtBQUNsQyxZQUFNLEdBQUcsUUFBUSxDQUFDLDBCQUFhLFVBQVUsRUFBRSwwQkFBYSxRQUFRLENBQUMsQ0FBQztLQUNuRTs7QUFFRCxRQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7QUFDckMsUUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7YUFBTSxNQUFNLENBQUMsTUFBTSxFQUFFO0tBQUEsQ0FBQyxDQUFDOztBQUV2QyxXQUFPLE9BQU8sQ0FBQztHQUNoQjs7Q0FtQ0YiLCJmaWxlIjoic3JjL2NsaWVudC9jbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ2xpZW50TW9kdWxlIGZyb20gJy4vQ2xpZW50TW9kdWxlJztcbmltcG9ydCBjb21tIGZyb20gJy4vY29tbSc7XG5pbXBvcnQgZGVmYXVsdFRleHRDb250ZW50cyBmcm9tICcuL2Rpc3BsYXkvZGVmYXVsdFRleHRDb250ZW50cyc7XG5pbXBvcnQgZGVmYXVsdFRlbXBsYXRlcyBmcm9tICcuL2Rpc3BsYXkvZGVmYXVsdFRlbXBsYXRlcyc7XG5cblxuLyoqXG4gKiBUaGUgYGNsaWVudGAgb2JqZWN0IGNvbnRhaW5zIHRoZSBiYXNpYyBtZXRob2RzIGFuZCBhdHRyaWJ1dGVzIG9mIHRoZSBjbGllbnQuXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8qKlxuICAgKiBTb2NrZXQgdXNlZCB0byBjb21tdW5pY2F0ZSB3aXRoIHRoZSBzZXJ2ZXIsIGlmIGFueS5cbiAgICogQHR5cGUge1NvY2tldH1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNvbW06IG51bGwsXG5cbiAgLyoqXG4gICAqIEluZm9ybWF0aW9uIGFib3V0IHRoZSBjbGllbnQgcGxhdGZvcm0uXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBvcyBPcGVyYXRpbmcgc3lzdGVtLlxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGlzTW9iaWxlIEluZGljYXRlcyB3aGV0aGVyIHRoZSBjbGllbnQgaXMgcnVubmluZyBvbiBhXG4gICAqIG1vYmlsZSBwbGF0Zm9ybSBvciBub3QuXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBhdWRpb0ZpbGVFeHQgQXVkaW8gZmlsZSBleHRlbnNpb24gdG8gdXNlLCBkZXBlbmRpbmcgb25cbiAgICogdGhlIHBsYXRmb3JtICgpXG4gICAqL1xuICBwbGF0Zm9ybToge1xuICAgIG9zOiBudWxsLFxuICAgIGlzTW9iaWxlOiBudWxsLFxuICAgIGF1ZGlvRmlsZUV4dDogJycsXG4gICAgaXNGb3JiaWRkZW46IGZhbHNlXG4gIH0sXG5cbiAgLyoqXG4gICAqIENsaWVudCB0eXBlLlxuICAgKiBUaGUgY2xpZW50IHR5cGUgaXMgc3BlZmljaWVkIGluIHRoZSBhcmd1bWVudCBvZiB0aGUgYGluaXRgIG1ldGhvZC4gRm9yXG4gICAqIGluc3RhbmNlLCBgJ3BsYXllcidgIGlzIHRoZSBjbGllbnQgdHlwZSB5b3Ugc2hvdWxkIGJlIHVzaW5nIGJ5IGRlZmF1bHQuXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICB0eXBlOiBudWxsLFxuXG4gIC8qKlxuICAgKiBQcm9taXNlIHJlc29sdmVkIHdoZW4gdGhlIHNlcnZlciBzZW5kcyBhIG1lc3NhZ2UgaW5kaWNhdGluZyB0aGF0IHRoZSBjbGllbnRcbiAgICogY2FuIHN0YXJ0IHRoZSBmaXJzdCBtZHVsZS5cbiAgICogQHR5cGUge1Byb21pc2V9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZWFkeTogbnVsbCxcblxuICAvKipcbiAgICogQ2xpZW50IGluZGV4LCBnaXZlbiBieSB0aGUgc2VydmVyLlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgaW5kZXg6IC0xLFxuXG4gIC8qKlxuICAgKiBDbGllbnQgY29vcmRpbmF0ZXMgKGlmIGFueSkgZ2l2ZW4gYnkgYSB7QGxpbmsgTG9jYXRvcn0sIHtAbGluayBQbGFjZXJ9IG9yXG4gICAqIHtAbGluayBDaGVja2lufSBtb2R1bGUuIChGb3JtYXQ6IGBbeDpOdW1iZXIsIHk6TnVtYmVyXWAuKVxuICAgKiBAdHlwZSB7TnVtYmVyW119XG4gICAqL1xuICBjb29yZGluYXRlczogbnVsbCxcblxuICAvKipcbiAgICogVGhlIGBpbml0YCBtZXRob2Qgc2V0cyB0aGUgY2xpZW50IHR5cGUgYW5kIGluaXRpYWxpemVzIGEgV2ViU29ja2V0IGNvbm5lY3Rpb24gYXNzb2NpYXRlZCB3aXRoIHRoZSBnaXZlbiB0eXBlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW2NsaWVudFR5cGUgPSAncGxheWVyJ10gVGhlIGNsaWVudCB0eXBlLlxuICAgKiBAdG9kbyBjbGFyaWZ5IGNsaWVudFR5cGUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucyA9IHt9XSBUaGUgb3B0aW9ucyB0byBpbml0aWFsaXplIGEgY2xpZW50XG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuaW9dIEJ5IGRlZmF1bHQsIGEgU291bmR3b3JrcyBhcHBsaWNhdGlvbiBoYXMgYSBjbGllbnQgYW5kIGEgc2VydmVyIHNpZGUuIEZvciBhIHN0YW5kYWxvbmUgYXBwbGljYXRpb24gKGNsaWVudCBzaWRlIG9ubHkpLCB1c2UgYG9wdGlvbnMuaW8gPSBmYWxzZWAuXG4gICAqIEB0b2RvIHVzZSBkZWZhdWx0IHZhbHVlIGZvciBvcHRpb25zLmlvIGluIHRoZSBkb2N1bWVudGF0aW9uP1xuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbmRlZmF1bHRUZXh0Q29udGVudHNzLnNvY2tldFVybF0gVGhlIFVSTCBvZiB0aGUgV2ViU29ja2V0IHNlcnZlci5cbiAgICovXG4gIGluaXQoY2xpZW50VHlwZSA9ICdwbGF5ZXInLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLnR5cGUgPSBjbGllbnRUeXBlO1xuXG4gICAgLy8gQHRvZG8gaGFybW9uaXplIGlvIGNvbmZpZyB3aXRoIHNlcnZlclxuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIGlvOiB0cnVlLFxuICAgICAgZGVidWdJTzogZmFsc2UsXG4gICAgICBzb2NrZXRVcmw6ICcnLFxuICAgICAgdHJhbnNwb3J0czogWyd3ZWJzb2NrZXQnXSxcbiAgICAgIGFwcENvbnRhaW5lcjogJyNjb250YWluZXInLFxuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgLy8gaW5pdGlhbGl6ZSBtb2R1bGVzIHZpZXdzIHdpdGggZGVmYXVsdCB0ZXh0cyBhbmQgdGVtcGxhdGVzXG4gICAgdGhpcy50ZXh0Q29udGVudHMgPSB7fTtcbiAgICB0aGlzLnRlbXBsYXRlcyA9IHt9O1xuICAgIHRoaXMuc2V0Vmlld0NvbnRlbnREZWZpbml0aW9ucyhkZWZhdWx0VGV4dENvbnRlbnRzKTtcbiAgICB0aGlzLnNldFZpZXdUZW1wbGF0ZURlZmluaXRpb25zKGRlZmF1bHRUZW1wbGF0ZXMpO1xuICAgIHRoaXMuc2V0QXBwQ29udGFpbmVyKG9wdGlvbnMuYXBwQ29udGFpbmVyKTtcblxuICAgIGlmIChvcHRpb25zLmlvICE9PSBmYWxzZSkge1xuICAgICAgLy8gaW5pdGlhbGl6ZSBzb2NrZXQgY29tbXVuaWNhdGlvbnNcbiAgICAgIHRoaXMuY29tbSA9IGNvbW0uaW5pdGlhbGl6ZShjbGllbnRUeXBlLCBvcHRpb25zKTtcbiAgICAgIC8vIHdhaXQgZm9yIHNvY2tldCBiZWluZyByZWFkeSB0byByZXNvbHZlIHRoaXMgbW9kdWxlXG4gICAgICB0aGlzLnJlYWR5ID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgdGhpcy5jb21tLnJlY2VpdmUoJ2NsaWVudDpzdGFydCcsIChpbmRleCkgPT4ge1xuICAgICAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVhZHkgPSBQcm9taXNlLnJlc29sdmUodHJ1ZSk7XG4gICAgfVxuXG4gICAgLy8gZGVidWcgLSBodHRwOi8vc29ja2V0LmlvL2RvY3MvbG9nZ2luZy1hbmQtZGVidWdnaW5nLyNhdmFpbGFibGUtZGVidWdnaW5nLXNjb3Blc1xuICAgIGlmIChvcHRpb25zLmRlYnVnSU8pIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5kZWJ1ZyA9ICcqJztcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEV4dGVuZCBhcHBsaWNhdGlvbiB0ZXh0IGNvbnRlbnRzIHdpdGggdGhlIGdpdmVuIG9iamVjdC5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRlbnRzIC0gVGhlIHRleHQgY29udGVudHMgdG8gcHJvcGFnYXRlIHRvIG1vZHVsZXMuXG4gICAqL1xuICBzZXRWaWV3Q29udGVudERlZmluaXRpb25zKGRlZnMpIHtcbiAgICB0aGlzLnRleHRDb250ZW50cyA9IE9iamVjdC5hc3NpZ24odGhpcy50ZXh0Q29udGVudHMsIGRlZnMpO1xuICAgIENsaWVudE1vZHVsZS5zZXRWaWV3Q29udGVudERlZmluaXRpb25zKHRoaXMudGV4dENvbnRlbnRzKTtcbiAgfSxcblxuICAvKipcbiAgICogRXh0ZW5kIGFwcGxpY2F0aW9uIHRlbXBsYXRlcyB3aXRoIHRoZSBnaXZlbiBvYmplY3QuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB0ZW1wbGF0ZXMgLSBUaGUgdGVtcGxhdGVzIHRvIHByb3BhZ2F0ZSB0byBtb2R1bGVzLlxuICAgKi9cbiAgc2V0Vmlld1RlbXBsYXRlRGVmaW5pdGlvbnMoZGVmcykge1xuICAgIHRoaXMudGVtcGxhdGVzID0gT2JqZWN0LmFzc2lnbih0aGlzLnRlbXBsYXRlcywgZGVmcyk7XG4gICAgQ2xpZW50TW9kdWxlLnNldFZpZXdUZW1wbGF0ZURlZmluaXRpb25zKHRoaXMudGVtcGxhdGVzKTtcbiAgfSxcblxuICAvKipcbiAgICogU2V0cyB0aGUgZGVmYXVsdCB2aWV3IGNvbnRhaW5lciBmb3IgYWxsIGBDbGllbnRNb2R1bGVgc1xuICAgKiBAcGFyYW0ge1N0cmluZ3xFbGVtZW50fSBlbCAtIEEgRE9NIGVsZW1lbnQgb3IgYSBjc3Mgc2VsZWN0b3IgbWF0Y2hpbmcgdGhlIGVsZW1lbnQgdG8gdXNlIGFzIGEgY29udGFpbmVyLlxuICAgKi9cbiAgc2V0QXBwQ29udGFpbmVyKGVsKSB7XG4gICAgY29uc3QgJGNvbnRhaW5lciA9IGVsIGluc3RhbmNlb2YgRWxlbWVudCA/IGVsIDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbCk7XG4gICAgQ2xpZW50TW9kdWxlLnNldFZpZXdDb250YWluZXIoJGNvbnRhaW5lcik7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBtb2R1bGUgbG9naWMgKCppLmUuKiB0aGUgYXBwbGljYXRpb24pLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdGFydEZ1biBbdG9kb11cbiAgICogQHRvZG8gQ2xhcmlmeSB0aGUgcGFyYW0uXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IFRoZSBQcm9taXNlIHJldHVybiB2YWx1ZS5cbiAgICogQHRvZG8gQ2xhcmlmeSByZXR1cm4gdmFsdWUgKHByb21pc2UpLlxuICAgKiBAdG9kbyBleGFtcGxlXG4gICAqL1xuICBzdGFydChzdGFydEZ1bikge1xuICAgIGxldCBtb2R1bGUgPSBzdGFydEZ1bjsgLy8gYmUgY29tcGF0aWJsZSB3aXRoIHByZXZpb3VzIHZlcnNpb25cblxuICAgIGlmICh0eXBlb2Ygc3RhcnRGdW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIG1vZHVsZSA9IHN0YXJ0RnVuKENsaWVudE1vZHVsZS5zZXF1ZW50aWFsLCBDbGllbnRNb2R1bGUucGFyYWxsZWwpO1xuICAgIH1cblxuICAgIGxldCBwcm9taXNlID0gbW9kdWxlLmNyZWF0ZVByb21pc2UoKTtcbiAgICB0aGlzLnJlYWR5LnRoZW4oKCkgPT4gbW9kdWxlLmxhdW5jaCgpKTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBUaGUgYHNlcmlhbGAgbWV0aG9kIHJldHVybnMgYSBgQ2xpZW50TW9kdWxlYCB0aGF0IHN0YXJ0cyB0aGUgZ2l2ZW4gYC4uLm1vZHVsZXNgIGluIHNlcmllcy4gQWZ0ZXIgc3RhcnRpbmcgdGhlIGZpcnN0IG1vZHVsZSAoYnkgY2FsbGluZyBpdHMgYHN0YXJ0YCBtZXRob2QpLCB0aGUgbmV4dCBtb2R1bGUgaW4gdGhlIHNlcmllcyBpcyBzdGFydGVkICh3aXRoIGl0cyBgc3RhcnRgIG1ldGhvZCkgd2hlbiB0aGUgbGFzdCBtb2R1bGUgY2FsbGVkIGl0cyBgZG9uZWAgbWV0aG9kLiBXaGVuIHRoZSBsYXN0IG1vZHVsZSBjYWxscyBgZG9uZWAsIHRoZSByZXR1cm5lZCBzZXJpYWwgbW9kdWxlIGNhbGxzIGl0cyBvd24gYGRvbmVgIG1ldGhvZC5cbiAgICpcbiAgICogKipOb3RlOioqIHlvdSBjYW4gY29tcG91bmQgc2VyaWFsIG1vZHVsZSBzZXF1ZW5jZXMgd2l0aCBwYXJhbGxlbCBtb2R1bGUgY29tYmluYXRpb25zICgqZS5nLiogYGNsaWVudC5zZXJpYWwobW9kdWxlMSwgY2xpZW50LnBhcmFsbGVsKG1vZHVsZTIsIG1vZHVsZTMpLCBtb2R1bGU0KTtgKS5cbiAgICogQGRlcHJlY2F0ZWQgVXNlIHRoZSBuZXcgQVBJIHdpdGggdGhlIHtAbGluayBzdGFydH0gbWV0aG9kLlxuICAgKiBAcGFyYW0gey4uLkNsaWVudE1vZHVsZX0gLi4ubW9kdWxlcyBUaGUgbW9kdWxlcyB0byBydW4gaW4gc2VyaWFsLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBbZGVzY3JpcHRpb25dXG4gICAqIEB0b2RvIENsYXJpZnkgcmV0dXJuIHZhbHVlXG4gICAqIEB0b2RvIFJlbW92ZVxuICAgKi9cbiAgLy8gc2VyaWFsKC4uLm1vZHVsZXMpIHtcbiAgLy8gICBjb25zb2xlLmxvZygnVGhlIGZ1bmN0aW9uIFwiY2xpZW50LnNlcmlhbFwiIGlzIGRlcHJlY2F0ZWQuIFBsZWFzZSB1c2UgdGhlIG5ldyBBUEkgaW5zdGVhZC4nKTtcbiAgLy8gICByZXR1cm4gQ2xpZW50TW9kdWxlLnNlcXVlbnRpYWwoLi4ubW9kdWxlcyk7XG4gIC8vIH0sXG5cbiAgLyoqXG4gICAqIFRoZSBgQ2xpZW50TW9kdWxlYCByZXR1cm5lZCBieSB0aGUgYHBhcmFsbGVsYCBtZXRob2Qgc3RhcnRzIHRoZSBnaXZlbiBgLi4ubW9kdWxlc2AgaW4gcGFyYWxsZWwgKHdpdGggdGhlaXIgYHN0YXJ0YCBtZXRob2RzKSwgYW5kIGNhbGxzIGl0cyBgZG9uZWAgbWV0aG9kIGFmdGVyIGFsbCBtb2R1bGVzIGNhbGxlZCB0aGVpciBvd24gYGRvbmVgIG1ldGhvZHMuXG4gICAqXG4gICAqICoqTm90ZToqKiB5b3UgY2FuIGNvbXBvdW5kIHBhcmFsbGVsIG1vZHVsZSBjb21iaW5hdGlvbnMgd2l0aCBzZXJpYWwgbW9kdWxlIHNlcXVlbmNlcyAoKmUuZy4qIGBjbGllbnQucGFyYWxsZWwobW9kdWxlMSwgY2xpZW50LnNlcmlhbChtb2R1bGUyLCBtb2R1bGUzKSwgbW9kdWxlNCk7YCkuXG4gICAqXG4gICAqICoqTm90ZToqKiB0aGUgYHZpZXdgIG9mIGEgbW9kdWxlIGlzIGFsd2F5cyBmdWxsIHNjcmVlbiwgc28gaW4gdGhlIGNhc2Ugd2hlcmUgbW9kdWxlcyBydW4gaW4gcGFyYWxsZWwsIHRoZWlyIGB2aWV3YHMgYXJlIHN0YWNrZWQgb24gdG9wIG9mIGVhY2ggb3RoZXIgdXNpbmcgdGhlIGB6LWluZGV4YCBDU1MgcHJvcGVydHkuXG4gICAqIFdlIHVzZSB0aGUgb3JkZXIgb2YgdGhlIGBwYXJhbGxlbGAgbWV0aG9kJ3MgYXJndW1lbnRzIHRvIGRldGVybWluZSB0aGUgb3JkZXIgb2YgdGhlIHN0YWNrICgqZS5nLiogaW4gYGNsaWVudC5wYXJhbGxlbChtb2R1bGUxLCBtb2R1bGUyLCBtb2R1bGUzKWAsIHRoZSBgdmlld2Agb2YgYG1vZHVsZTFgIGlzIGRpc3BsYXllZCBvbiB0b3Agb2YgdGhlIGB2aWV3YCBvZiBgbW9kdWxlMmAsIHdoaWNoIGlzIGRpc3BsYXllZCBvbiB0b3Agb2YgdGhlIGB2aWV3YCBvZiBgbW9kdWxlM2ApLlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgdGhlIG5ldyBBUEkgd2l0aCB0aGUge0BsaW5rIHN0YXJ0fSBtZXRob2QuXG4gICAqIEBwYXJhbSB7Li4uQ2xpZW50TW9kdWxlfSBtb2R1bGVzIFRoZSBtb2R1bGVzIHRvIHJ1biBpbiBwYXJhbGxlbC5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gW2Rlc2NyaXB0aW9uXVxuICAgKiBAdG9kbyBDbGFyaWZ5IHJldHVybiB2YWx1ZVxuICAgKiBAdG9kbyBSZW1vdmVcbiAgICovXG4gIC8vIHBhcmFsbGVsKC4uLm1vZHVsZXMpIHtcbiAgLy8gICBjb25zb2xlLmxvZygnVGhlIGZ1bmN0aW9uIFwiY2xpZW50LnBhcmFsbGVsXCIgaXMgZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSB0aGUgbmV3IEFQSSBpbnN0ZWFkLicpO1xuICAvLyAgIHJldHVybiBDbGllbnRNb2R1bGUucGFyYWxsZWwoLi4ubW9kdWxlcyk7XG4gIC8vIH0sXG5cbn07XG5cbiJdfQ==