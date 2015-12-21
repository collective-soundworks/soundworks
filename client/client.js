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
    audioFileExt: ''
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
      socketUrl: window.SOCKET_CONFIG.url,
      transports: window.SOCKET_CONFIG.transports,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvY2xpZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs0QkFBeUIsZ0JBQWdCOzs7O29CQUN4QixRQUFROzs7OzBDQUNPLCtCQUErQjs7Ozt1Q0FDbEMsNEJBQTRCOzs7Ozs7OztxQkFPMUM7Ozs7OztBQU1iLE1BQUksRUFBRSxJQUFJOzs7Ozs7Ozs7OztBQVdWLFVBQVEsRUFBRTtBQUNSLE1BQUUsRUFBRSxJQUFJO0FBQ1IsWUFBUSxFQUFFLElBQUk7QUFDZCxnQkFBWSxFQUFFLEVBQUU7R0FDakI7Ozs7Ozs7O0FBUUQsTUFBSSxFQUFFLElBQUk7Ozs7Ozs7O0FBUVYsT0FBSyxFQUFFLElBQUk7Ozs7OztBQU1YLE9BQUssRUFBRSxDQUFDLENBQUM7Ozs7Ozs7QUFPVCxhQUFXLEVBQUUsSUFBSTs7Ozs7Ozs7Ozs7QUFXakIsTUFBSSxFQUFBLGdCQUFzQzs7O1FBQXJDLFVBQVUseURBQUcsUUFBUTtRQUFFLE9BQU8seURBQUcsRUFBRTs7QUFDdEMsUUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7OztBQUd2QixXQUFPLEdBQUcsZUFBYztBQUN0QixRQUFFLEVBQUUsSUFBSTtBQUNSLGFBQU8sRUFBRSxLQUFLO0FBQ2QsZUFBUyxFQUFFLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRztBQUNuQyxnQkFBVSxFQUFFLE1BQU0sQ0FBQyxhQUFhLENBQUMsVUFBVTtBQUMzQyxrQkFBWSxFQUFFLFlBQVk7S0FDM0IsRUFBRSxPQUFPLENBQUMsQ0FBQzs7O0FBR1osUUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7QUFDdkIsUUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7QUFDcEIsUUFBSSxDQUFDLHlCQUF5Qix5Q0FBcUIsQ0FBQztBQUNwRCxRQUFJLENBQUMsMEJBQTBCLHNDQUFrQixDQUFDO0FBQ2xELFFBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDOztBQUUzQyxRQUFJLE9BQU8sQ0FBQyxFQUFFLEtBQUssS0FBSyxFQUFFOztBQUV4QixVQUFJLENBQUMsSUFBSSxHQUFHLGtCQUFLLFVBQVUsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7O0FBRWpELFVBQUksQ0FBQyxLQUFLLEdBQUcsYUFBWSxVQUFDLE9BQU8sRUFBSztBQUNwQyxjQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQzNDLGdCQUFLLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDbkIsaUJBQU8sRUFBRSxDQUFDO1NBQ1gsQ0FBQyxDQUFDO09BQ0osQ0FBQyxDQUFDO0tBQ0osTUFBTTtBQUNMLFVBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDcEM7OztBQUdELFFBQUksT0FBTyxDQUFDLE9BQU8sRUFBRTtBQUNuQixrQkFBWSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7S0FDMUI7R0FDRjs7Ozs7O0FBTUQsMkJBQXlCLEVBQUEsbUNBQUMsSUFBSSxFQUFFO0FBQzlCLFFBQUksQ0FBQyxZQUFZLEdBQUcsZUFBYyxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzNELDhCQUFhLHlCQUF5QixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztHQUMzRDs7Ozs7O0FBTUQsNEJBQTBCLEVBQUEsb0NBQUMsSUFBSSxFQUFFO0FBQy9CLFFBQUksQ0FBQyxTQUFTLEdBQUcsZUFBYyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3JELDhCQUFhLDBCQUEwQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztHQUN6RDs7Ozs7O0FBTUQsaUJBQWUsRUFBQSx5QkFBQyxFQUFFLEVBQUU7QUFDbEIsUUFBTSxVQUFVLEdBQUcsRUFBRSxZQUFZLE9BQU8sR0FBRyxFQUFFLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUMzRSw4QkFBYSxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztHQUMzQzs7Ozs7Ozs7OztBQVVELE9BQUssRUFBQSxlQUFDLFFBQVEsRUFBRTtBQUNkLFFBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQzs7QUFFdEIsUUFBSSxPQUFPLFFBQVEsS0FBSyxVQUFVLEVBQUU7QUFDbEMsWUFBTSxHQUFHLFFBQVEsQ0FBQywwQkFBYSxVQUFVLEVBQUUsMEJBQWEsUUFBUSxDQUFDLENBQUM7S0FDbkU7O0FBRUQsUUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDO0FBQ3JDLFFBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO2FBQU0sTUFBTSxDQUFDLE1BQU0sRUFBRTtLQUFBLENBQUMsQ0FBQzs7QUFFdkMsV0FBTyxPQUFPLENBQUM7R0FDaEI7O0NBbUNGIiwiZmlsZSI6InNyYy9jbGllbnQvY2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENsaWVudE1vZHVsZSBmcm9tICcuL0NsaWVudE1vZHVsZSc7XG5pbXBvcnQgY29tbSBmcm9tICcuL2NvbW0nO1xuaW1wb3J0IGRlZmF1bHRUZXh0Q29udGVudHMgZnJvbSAnLi9kaXNwbGF5L2RlZmF1bHRUZXh0Q29udGVudHMnO1xuaW1wb3J0IGRlZmF1bHRUZW1wbGF0ZXMgZnJvbSAnLi9kaXNwbGF5L2RlZmF1bHRUZW1wbGF0ZXMnO1xuXG5cbi8qKlxuICogVGhlIGBjbGllbnRgIG9iamVjdCBjb250YWlucyB0aGUgYmFzaWMgbWV0aG9kcyBhbmQgYXR0cmlidXRlcyBvZiB0aGUgY2xpZW50LlxuICogQHR5cGUge09iamVjdH1cbiAqL1xuZXhwb3J0IGRlZmF1bHQge1xuICAvKipcbiAgICogU29ja2V0IHVzZWQgdG8gY29tbXVuaWNhdGUgd2l0aCB0aGUgc2VydmVyLCBpZiBhbnkuXG4gICAqIEB0eXBlIHtTb2NrZXR9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjb21tOiBudWxsLFxuXG4gIC8qKlxuICAgKiBJbmZvcm1hdGlvbiBhYm91dCB0aGUgY2xpZW50IHBsYXRmb3JtLlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gb3MgT3BlcmF0aW5nIHN5c3RlbS5cbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBpc01vYmlsZSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgY2xpZW50IGlzIHJ1bm5pbmcgb24gYVxuICAgKiBtb2JpbGUgcGxhdGZvcm0gb3Igbm90LlxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gYXVkaW9GaWxlRXh0IEF1ZGlvIGZpbGUgZXh0ZW5zaW9uIHRvIHVzZSwgZGVwZW5kaW5nIG9uXG4gICAqIHRoZSBwbGF0Zm9ybSAoKVxuICAgKi9cbiAgcGxhdGZvcm06IHtcbiAgICBvczogbnVsbCxcbiAgICBpc01vYmlsZTogbnVsbCxcbiAgICBhdWRpb0ZpbGVFeHQ6ICcnLFxuICB9LFxuXG4gIC8qKlxuICAgKiBDbGllbnQgdHlwZS5cbiAgICogVGhlIGNsaWVudCB0eXBlIGlzIHNwZWZpY2llZCBpbiB0aGUgYXJndW1lbnQgb2YgdGhlIGBpbml0YCBtZXRob2QuIEZvclxuICAgKiBpbnN0YW5jZSwgYCdwbGF5ZXInYCBpcyB0aGUgY2xpZW50IHR5cGUgeW91IHNob3VsZCBiZSB1c2luZyBieSBkZWZhdWx0LlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgdHlwZTogbnVsbCxcblxuICAvKipcbiAgICogUHJvbWlzZSByZXNvbHZlZCB3aGVuIHRoZSBzZXJ2ZXIgc2VuZHMgYSBtZXNzYWdlIGluZGljYXRpbmcgdGhhdCB0aGUgY2xpZW50XG4gICAqIGNhbiBzdGFydCB0aGUgZmlyc3QgbWR1bGUuXG4gICAqIEB0eXBlIHtQcm9taXNlfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVhZHk6IG51bGwsXG5cbiAgLyoqXG4gICAqIENsaWVudCBpbmRleCwgZ2l2ZW4gYnkgdGhlIHNlcnZlci5cbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGluZGV4OiAtMSxcblxuICAvKipcbiAgICogQ2xpZW50IGNvb3JkaW5hdGVzIChpZiBhbnkpIGdpdmVuIGJ5IGEge0BsaW5rIExvY2F0b3J9LCB7QGxpbmsgUGxhY2VyfSBvclxuICAgKiB7QGxpbmsgQ2hlY2tpbn0gbW9kdWxlLiAoRm9ybWF0OiBgW3g6TnVtYmVyLCB5Ok51bWJlcl1gLilcbiAgICogQHR5cGUge051bWJlcltdfVxuICAgKi9cbiAgY29vcmRpbmF0ZXM6IG51bGwsXG5cbiAgLyoqXG4gICAqIFRoZSBgaW5pdGAgbWV0aG9kIHNldHMgdGhlIGNsaWVudCB0eXBlIGFuZCBpbml0aWFsaXplcyBhIFdlYlNvY2tldCBjb25uZWN0aW9uIGFzc29jaWF0ZWQgd2l0aCB0aGUgZ2l2ZW4gdHlwZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtjbGllbnRUeXBlID0gJ3BsYXllciddIFRoZSBjbGllbnQgdHlwZS5cbiAgICogQHRvZG8gY2xhcmlmeSBjbGllbnRUeXBlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMgPSB7fV0gVGhlIG9wdGlvbnMgdG8gaW5pdGlhbGl6ZSBhIGNsaWVudFxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmlvXSBCeSBkZWZhdWx0LCBhIFNvdW5kd29ya3MgYXBwbGljYXRpb24gaGFzIGEgY2xpZW50IGFuZCBhIHNlcnZlciBzaWRlLiBGb3IgYSBzdGFuZGFsb25lIGFwcGxpY2F0aW9uIChjbGllbnQgc2lkZSBvbmx5KSwgdXNlIGBvcHRpb25zLmlvID0gZmFsc2VgLlxuICAgKiBAdG9kbyB1c2UgZGVmYXVsdCB2YWx1ZSBmb3Igb3B0aW9ucy5pbyBpbiB0aGUgZG9jdW1lbnRhdGlvbj9cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25kZWZhdWx0VGV4dENvbnRlbnRzcy5zb2NrZXRVcmxdIFRoZSBVUkwgb2YgdGhlIFdlYlNvY2tldCBzZXJ2ZXIuXG4gICAqL1xuICBpbml0KGNsaWVudFR5cGUgPSAncGxheWVyJywgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy50eXBlID0gY2xpZW50VHlwZTtcblxuICAgIC8vIEB0b2RvIGhhcm1vbml6ZSBpbyBjb25maWcgd2l0aCBzZXJ2ZXJcbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICBpbzogdHJ1ZSxcbiAgICAgIGRlYnVnSU86IGZhbHNlLFxuICAgICAgc29ja2V0VXJsOiB3aW5kb3cuU09DS0VUX0NPTkZJRy51cmwsXG4gICAgICB0cmFuc3BvcnRzOiB3aW5kb3cuU09DS0VUX0NPTkZJRy50cmFuc3BvcnRzLFxuICAgICAgYXBwQ29udGFpbmVyOiAnI2NvbnRhaW5lcicsXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICAvLyBpbml0aWFsaXplIG1vZHVsZXMgdmlld3Mgd2l0aCBkZWZhdWx0IHRleHRzIGFuZCB0ZW1wbGF0ZXNcbiAgICB0aGlzLnRleHRDb250ZW50cyA9IHt9O1xuICAgIHRoaXMudGVtcGxhdGVzID0ge307XG4gICAgdGhpcy5zZXRWaWV3Q29udGVudERlZmluaXRpb25zKGRlZmF1bHRUZXh0Q29udGVudHMpO1xuICAgIHRoaXMuc2V0Vmlld1RlbXBsYXRlRGVmaW5pdGlvbnMoZGVmYXVsdFRlbXBsYXRlcyk7XG4gICAgdGhpcy5zZXRBcHBDb250YWluZXIob3B0aW9ucy5hcHBDb250YWluZXIpO1xuXG4gICAgaWYgKG9wdGlvbnMuaW8gIT09IGZhbHNlKSB7XG4gICAgICAvLyBpbml0aWFsaXplIHNvY2tldCBjb21tdW5pY2F0aW9uc1xuICAgICAgdGhpcy5jb21tID0gY29tbS5pbml0aWFsaXplKGNsaWVudFR5cGUsIG9wdGlvbnMpO1xuICAgICAgLy8gd2FpdCBmb3Igc29ja2V0IGJlaW5nIHJlYWR5IHRvIHJlc29sdmUgdGhpcyBtb2R1bGVcbiAgICAgIHRoaXMucmVhZHkgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICB0aGlzLmNvbW0ucmVjZWl2ZSgnY2xpZW50OnN0YXJ0JywgKGluZGV4KSA9PiB7XG4gICAgICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZWFkeSA9IFByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgICB9XG5cbiAgICAvLyBkZWJ1ZyAtIGh0dHA6Ly9zb2NrZXQuaW8vZG9jcy9sb2dnaW5nLWFuZC1kZWJ1Z2dpbmcvI2F2YWlsYWJsZS1kZWJ1Z2dpbmctc2NvcGVzXG4gICAgaWYgKG9wdGlvbnMuZGVidWdJTykge1xuICAgICAgbG9jYWxTdG9yYWdlLmRlYnVnID0gJyonO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogRXh0ZW5kIGFwcGxpY2F0aW9uIHRleHQgY29udGVudHMgd2l0aCB0aGUgZ2l2ZW4gb2JqZWN0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGVudHMgLSBUaGUgdGV4dCBjb250ZW50cyB0byBwcm9wYWdhdGUgdG8gbW9kdWxlcy5cbiAgICovXG4gIHNldFZpZXdDb250ZW50RGVmaW5pdGlvbnMoZGVmcykge1xuICAgIHRoaXMudGV4dENvbnRlbnRzID0gT2JqZWN0LmFzc2lnbih0aGlzLnRleHRDb250ZW50cywgZGVmcyk7XG4gICAgQ2xpZW50TW9kdWxlLnNldFZpZXdDb250ZW50RGVmaW5pdGlvbnModGhpcy50ZXh0Q29udGVudHMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBFeHRlbmQgYXBwbGljYXRpb24gdGVtcGxhdGVzIHdpdGggdGhlIGdpdmVuIG9iamVjdC5cbiAgICogQHBhcmFtIHtPYmplY3R9IHRlbXBsYXRlcyAtIFRoZSB0ZW1wbGF0ZXMgdG8gcHJvcGFnYXRlIHRvIG1vZHVsZXMuXG4gICAqL1xuICBzZXRWaWV3VGVtcGxhdGVEZWZpbml0aW9ucyhkZWZzKSB7XG4gICAgdGhpcy50ZW1wbGF0ZXMgPSBPYmplY3QuYXNzaWduKHRoaXMudGVtcGxhdGVzLCBkZWZzKTtcbiAgICBDbGllbnRNb2R1bGUuc2V0Vmlld1RlbXBsYXRlRGVmaW5pdGlvbnModGhpcy50ZW1wbGF0ZXMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBkZWZhdWx0IHZpZXcgY29udGFpbmVyIGZvciBhbGwgYENsaWVudE1vZHVsZWBzXG4gICAqIEBwYXJhbSB7U3RyaW5nfEVsZW1lbnR9IGVsIC0gQSBET00gZWxlbWVudCBvciBhIGNzcyBzZWxlY3RvciBtYXRjaGluZyB0aGUgZWxlbWVudCB0byB1c2UgYXMgYSBjb250YWluZXIuXG4gICAqL1xuICBzZXRBcHBDb250YWluZXIoZWwpIHtcbiAgICBjb25zdCAkY29udGFpbmVyID0gZWwgaW5zdGFuY2VvZiBFbGVtZW50ID8gZWwgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsKTtcbiAgICBDbGllbnRNb2R1bGUuc2V0Vmlld0NvbnRhaW5lcigkY29udGFpbmVyKTtcbiAgfSxcblxuICAvKipcbiAgICogU3RhcnQgdGhlIG1vZHVsZSBsb2dpYyAoKmkuZS4qIHRoZSBhcHBsaWNhdGlvbikuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IHN0YXJ0RnVuIFt0b2RvXVxuICAgKiBAdG9kbyBDbGFyaWZ5IHRoZSBwYXJhbS5cbiAgICogQHJldHVybiB7UHJvbWlzZX0gVGhlIFByb21pc2UgcmV0dXJuIHZhbHVlLlxuICAgKiBAdG9kbyBDbGFyaWZ5IHJldHVybiB2YWx1ZSAocHJvbWlzZSkuXG4gICAqIEB0b2RvIGV4YW1wbGVcbiAgICovXG4gIHN0YXJ0KHN0YXJ0RnVuKSB7XG4gICAgbGV0IG1vZHVsZSA9IHN0YXJ0RnVuOyAvLyBiZSBjb21wYXRpYmxlIHdpdGggcHJldmlvdXMgdmVyc2lvblxuXG4gICAgaWYgKHR5cGVvZiBzdGFydEZ1biA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgbW9kdWxlID0gc3RhcnRGdW4oQ2xpZW50TW9kdWxlLnNlcXVlbnRpYWwsIENsaWVudE1vZHVsZS5wYXJhbGxlbCk7XG4gICAgfVxuXG4gICAgbGV0IHByb21pc2UgPSBtb2R1bGUuY3JlYXRlUHJvbWlzZSgpO1xuICAgIHRoaXMucmVhZHkudGhlbigoKSA9PiBtb2R1bGUubGF1bmNoKCkpO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFRoZSBgc2VyaWFsYCBtZXRob2QgcmV0dXJucyBhIGBDbGllbnRNb2R1bGVgIHRoYXQgc3RhcnRzIHRoZSBnaXZlbiBgLi4ubW9kdWxlc2AgaW4gc2VyaWVzLiBBZnRlciBzdGFydGluZyB0aGUgZmlyc3QgbW9kdWxlIChieSBjYWxsaW5nIGl0cyBgc3RhcnRgIG1ldGhvZCksIHRoZSBuZXh0IG1vZHVsZSBpbiB0aGUgc2VyaWVzIGlzIHN0YXJ0ZWQgKHdpdGggaXRzIGBzdGFydGAgbWV0aG9kKSB3aGVuIHRoZSBsYXN0IG1vZHVsZSBjYWxsZWQgaXRzIGBkb25lYCBtZXRob2QuIFdoZW4gdGhlIGxhc3QgbW9kdWxlIGNhbGxzIGBkb25lYCwgdGhlIHJldHVybmVkIHNlcmlhbCBtb2R1bGUgY2FsbHMgaXRzIG93biBgZG9uZWAgbWV0aG9kLlxuICAgKlxuICAgKiAqKk5vdGU6KiogeW91IGNhbiBjb21wb3VuZCBzZXJpYWwgbW9kdWxlIHNlcXVlbmNlcyB3aXRoIHBhcmFsbGVsIG1vZHVsZSBjb21iaW5hdGlvbnMgKCplLmcuKiBgY2xpZW50LnNlcmlhbChtb2R1bGUxLCBjbGllbnQucGFyYWxsZWwobW9kdWxlMiwgbW9kdWxlMyksIG1vZHVsZTQpO2ApLlxuICAgKiBAZGVwcmVjYXRlZCBVc2UgdGhlIG5ldyBBUEkgd2l0aCB0aGUge0BsaW5rIHN0YXJ0fSBtZXRob2QuXG4gICAqIEBwYXJhbSB7Li4uQ2xpZW50TW9kdWxlfSAuLi5tb2R1bGVzIFRoZSBtb2R1bGVzIHRvIHJ1biBpbiBzZXJpYWwuXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IFtkZXNjcmlwdGlvbl1cbiAgICogQHRvZG8gQ2xhcmlmeSByZXR1cm4gdmFsdWVcbiAgICogQHRvZG8gUmVtb3ZlXG4gICAqL1xuICAvLyBzZXJpYWwoLi4ubW9kdWxlcykge1xuICAvLyAgIGNvbnNvbGUubG9nKCdUaGUgZnVuY3Rpb24gXCJjbGllbnQuc2VyaWFsXCIgaXMgZGVwcmVjYXRlZC4gUGxlYXNlIHVzZSB0aGUgbmV3IEFQSSBpbnN0ZWFkLicpO1xuICAvLyAgIHJldHVybiBDbGllbnRNb2R1bGUuc2VxdWVudGlhbCguLi5tb2R1bGVzKTtcbiAgLy8gfSxcblxuICAvKipcbiAgICogVGhlIGBDbGllbnRNb2R1bGVgIHJldHVybmVkIGJ5IHRoZSBgcGFyYWxsZWxgIG1ldGhvZCBzdGFydHMgdGhlIGdpdmVuIGAuLi5tb2R1bGVzYCBpbiBwYXJhbGxlbCAod2l0aCB0aGVpciBgc3RhcnRgIG1ldGhvZHMpLCBhbmQgY2FsbHMgaXRzIGBkb25lYCBtZXRob2QgYWZ0ZXIgYWxsIG1vZHVsZXMgY2FsbGVkIHRoZWlyIG93biBgZG9uZWAgbWV0aG9kcy5cbiAgICpcbiAgICogKipOb3RlOioqIHlvdSBjYW4gY29tcG91bmQgcGFyYWxsZWwgbW9kdWxlIGNvbWJpbmF0aW9ucyB3aXRoIHNlcmlhbCBtb2R1bGUgc2VxdWVuY2VzICgqZS5nLiogYGNsaWVudC5wYXJhbGxlbChtb2R1bGUxLCBjbGllbnQuc2VyaWFsKG1vZHVsZTIsIG1vZHVsZTMpLCBtb2R1bGU0KTtgKS5cbiAgICpcbiAgICogKipOb3RlOioqIHRoZSBgdmlld2Agb2YgYSBtb2R1bGUgaXMgYWx3YXlzIGZ1bGwgc2NyZWVuLCBzbyBpbiB0aGUgY2FzZSB3aGVyZSBtb2R1bGVzIHJ1biBpbiBwYXJhbGxlbCwgdGhlaXIgYHZpZXdgcyBhcmUgc3RhY2tlZCBvbiB0b3Agb2YgZWFjaCBvdGhlciB1c2luZyB0aGUgYHotaW5kZXhgIENTUyBwcm9wZXJ0eS5cbiAgICogV2UgdXNlIHRoZSBvcmRlciBvZiB0aGUgYHBhcmFsbGVsYCBtZXRob2QncyBhcmd1bWVudHMgdG8gZGV0ZXJtaW5lIHRoZSBvcmRlciBvZiB0aGUgc3RhY2sgKCplLmcuKiBpbiBgY2xpZW50LnBhcmFsbGVsKG1vZHVsZTEsIG1vZHVsZTIsIG1vZHVsZTMpYCwgdGhlIGB2aWV3YCBvZiBgbW9kdWxlMWAgaXMgZGlzcGxheWVkIG9uIHRvcCBvZiB0aGUgYHZpZXdgIG9mIGBtb2R1bGUyYCwgd2hpY2ggaXMgZGlzcGxheWVkIG9uIHRvcCBvZiB0aGUgYHZpZXdgIG9mIGBtb2R1bGUzYCkuXG4gICAqIEBkZXByZWNhdGVkIFVzZSB0aGUgbmV3IEFQSSB3aXRoIHRoZSB7QGxpbmsgc3RhcnR9IG1ldGhvZC5cbiAgICogQHBhcmFtIHsuLi5DbGllbnRNb2R1bGV9IG1vZHVsZXMgVGhlIG1vZHVsZXMgdG8gcnVuIGluIHBhcmFsbGVsLlxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSBbZGVzY3JpcHRpb25dXG4gICAqIEB0b2RvIENsYXJpZnkgcmV0dXJuIHZhbHVlXG4gICAqIEB0b2RvIFJlbW92ZVxuICAgKi9cbiAgLy8gcGFyYWxsZWwoLi4ubW9kdWxlcykge1xuICAvLyAgIGNvbnNvbGUubG9nKCdUaGUgZnVuY3Rpb24gXCJjbGllbnQucGFyYWxsZWxcIiBpcyBkZXByZWNhdGVkLiBQbGVhc2UgdXNlIHRoZSBuZXcgQVBJIGluc3RlYWQuJyk7XG4gIC8vICAgcmV0dXJuIENsaWVudE1vZHVsZS5wYXJhbGxlbCguLi5tb2R1bGVzKTtcbiAgLy8gfSxcblxufTtcblxuIl19