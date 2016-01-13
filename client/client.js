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
   * Client unique id, given by the server.
   * @type {Number}
   */
  uid: null,

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

    var socketIO = window.CONFIG.SOCKET_CONFIG; // shared by server (cf .ejs template)
    // @todo harmonize io config with server
    options = _Object$assign({
      io: true,
      debugIO: false,
      socketUrl: socketIO ? socketIO.url : '',
      transports: socketIO ? socketIO.transports : ['websocket'],
      appContainer: '#container'
    }, options);

    // initialize modules views with default texts and templates
    this.textContents = {};
    this.templates = {};

    var textContents = _Object$assign(_displayDefaultTextContents2['default'], {
      globals: { appName: window.CONFIG.APP_NAME }
    });

    this.setViewContentDefinitions(textContents);
    this.setViewTemplateDefinitions(_displayDefaultTemplates2['default']);
    this.setAppContainer(options.appContainer);

    if (options.io !== false) {
      // initialize socket communications
      this.comm = _comm2['default'].initialize(clientType, options);
      // wait for socket being ready to resolve this module
      this.ready = new _Promise(function (resolve) {
        _this.comm.receive('client:start', function (uid) {
          _this.uid = uid;
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
   * @param {Function} startFun - [@todo Clarify the param]
   * @return {Promise} - The Promise return value [@todo Clarify the param].
   * @todo example
   */
  start: function start(startFun) {
    var module = startFun; // facade in case of one module only

    if (typeof startFun === 'function') {
      module = startFun(_ClientModule2['default'].sequential, _ClientModule2['default'].parallel);
    }

    var promise = module.createPromise();
    this.ready.then(function () {
      return module.launch();
    });

    return promise;
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
  }

};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvY2xpZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs0QkFBeUIsZ0JBQWdCOzs7O29CQUN4QixRQUFROzs7OzBDQUNPLCtCQUErQjs7Ozt1Q0FDbEMsNEJBQTRCOzs7Ozs7OztxQkFPMUM7Ozs7OztBQU1iLE1BQUksRUFBRSxJQUFJOzs7Ozs7Ozs7OztBQVdWLFVBQVEsRUFBRTtBQUNSLE1BQUUsRUFBRSxJQUFJO0FBQ1IsWUFBUSxFQUFFLElBQUk7QUFDZCxnQkFBWSxFQUFFLEVBQUU7R0FDakI7Ozs7Ozs7O0FBUUQsTUFBSSxFQUFFLElBQUk7Ozs7Ozs7O0FBUVYsT0FBSyxFQUFFLElBQUk7Ozs7OztBQU1YLEtBQUcsRUFBRSxJQUFJOzs7Ozs7O0FBT1QsYUFBVyxFQUFFLElBQUk7Ozs7Ozs7Ozs7O0FBV2pCLE1BQUksRUFBQSxnQkFBc0M7OztRQUFyQyxVQUFVLHlEQUFHLFFBQVE7UUFBRSxPQUFPLHlEQUFHLEVBQUU7O0FBQ3RDLFFBQUksQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDOztBQUV2QixRQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQzs7QUFFN0MsV0FBTyxHQUFHLGVBQWM7QUFDdEIsUUFBRSxFQUFFLElBQUk7QUFDUixhQUFPLEVBQUUsS0FBSztBQUNkLGVBQVMsRUFBRSxRQUFRLEdBQUcsUUFBUSxDQUFDLEdBQUcsR0FBRyxFQUFFO0FBQ3ZDLGdCQUFVLEVBQUUsUUFBUSxHQUFHLFFBQVEsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxXQUFXLENBQUM7QUFDMUQsa0JBQVksRUFBRSxZQUFZO0tBQzNCLEVBQUUsT0FBTyxDQUFDLENBQUM7OztBQUdaLFFBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLFFBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDOztBQUVwQixRQUFNLFlBQVksR0FBRyx3REFBbUM7QUFDdEQsYUFBTyxFQUFFLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFO0tBQzdDLENBQUMsQ0FBQzs7QUFFSCxRQUFJLENBQUMseUJBQXlCLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDN0MsUUFBSSxDQUFDLDBCQUEwQixzQ0FBa0IsQ0FBQztBQUNsRCxRQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQzs7QUFFM0MsUUFBSSxPQUFPLENBQUMsRUFBRSxLQUFLLEtBQUssRUFBRTs7QUFFeEIsVUFBSSxDQUFDLElBQUksR0FBRyxrQkFBSyxVQUFVLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDOztBQUVqRCxVQUFJLENBQUMsS0FBSyxHQUFHLGFBQVksVUFBQyxPQUFPLEVBQUs7QUFDcEMsY0FBSyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxVQUFDLEdBQUcsRUFBSztBQUN6QyxnQkFBSyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ2YsaUJBQU8sRUFBRSxDQUFDO1NBQ1gsQ0FBQyxDQUFDO09BQ0osQ0FBQyxDQUFDO0tBQ0osTUFBTTtBQUNMLFVBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDcEM7OztBQUdELFFBQUksT0FBTyxDQUFDLE9BQU8sRUFBRTtBQUNuQixrQkFBWSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7S0FDMUI7R0FDRjs7Ozs7Ozs7QUFRRCxPQUFLLEVBQUEsZUFBQyxRQUFRLEVBQUU7QUFDZCxRQUFJLE1BQU0sR0FBRyxRQUFRLENBQUM7O0FBRXRCLFFBQUksT0FBTyxRQUFRLEtBQUssVUFBVSxFQUFFO0FBQ2xDLFlBQU0sR0FBRyxRQUFRLENBQUMsMEJBQWEsVUFBVSxFQUFFLDBCQUFhLFFBQVEsQ0FBQyxDQUFDO0tBQ25FOztBQUVELFFBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQztBQUNyQyxRQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQzthQUFNLE1BQU0sQ0FBQyxNQUFNLEVBQUU7S0FBQSxDQUFDLENBQUM7O0FBRXZDLFdBQU8sT0FBTyxDQUFDO0dBQ2hCOzs7Ozs7QUFNRCwyQkFBeUIsRUFBQSxtQ0FBQyxJQUFJLEVBQUU7QUFDOUIsUUFBSSxDQUFDLFlBQVksR0FBRyxlQUFjLElBQUksQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDM0QsOEJBQWEseUJBQXlCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0dBQzNEOzs7Ozs7QUFNRCw0QkFBMEIsRUFBQSxvQ0FBQyxJQUFJLEVBQUU7QUFDL0IsUUFBSSxDQUFDLFNBQVMsR0FBRyxlQUFjLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDckQsOEJBQWEsMEJBQTBCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0dBQ3pEOzs7Ozs7QUFNRCxpQkFBZSxFQUFBLHlCQUFDLEVBQUUsRUFBRTtBQUNsQixRQUFNLFVBQVUsR0FBRyxFQUFFLFlBQVksT0FBTyxHQUFHLEVBQUUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzNFLDhCQUFhLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0dBQzNDOztDQUVGIiwiZmlsZSI6InNyYy9jbGllbnQvY2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENsaWVudE1vZHVsZSBmcm9tICcuL0NsaWVudE1vZHVsZSc7XG5pbXBvcnQgY29tbSBmcm9tICcuL2NvbW0nO1xuaW1wb3J0IGRlZmF1bHRUZXh0Q29udGVudHMgZnJvbSAnLi9kaXNwbGF5L2RlZmF1bHRUZXh0Q29udGVudHMnO1xuaW1wb3J0IGRlZmF1bHRUZW1wbGF0ZXMgZnJvbSAnLi9kaXNwbGF5L2RlZmF1bHRUZW1wbGF0ZXMnO1xuXG5cbi8qKlxuICogVGhlIGBjbGllbnRgIG9iamVjdCBjb250YWlucyB0aGUgYmFzaWMgbWV0aG9kcyBhbmQgYXR0cmlidXRlcyBvZiB0aGUgY2xpZW50LlxuICogQHR5cGUge09iamVjdH1cbiAqL1xuZXhwb3J0IGRlZmF1bHQge1xuICAvKipcbiAgICogU29ja2V0IHVzZWQgdG8gY29tbXVuaWNhdGUgd2l0aCB0aGUgc2VydmVyLCBpZiBhbnkuXG4gICAqIEB0eXBlIHtTb2NrZXR9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjb21tOiBudWxsLFxuXG4gIC8qKlxuICAgKiBJbmZvcm1hdGlvbiBhYm91dCB0aGUgY2xpZW50IHBsYXRmb3JtLlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gb3MgT3BlcmF0aW5nIHN5c3RlbS5cbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBpc01vYmlsZSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgY2xpZW50IGlzIHJ1bm5pbmcgb24gYVxuICAgKiBtb2JpbGUgcGxhdGZvcm0gb3Igbm90LlxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gYXVkaW9GaWxlRXh0IEF1ZGlvIGZpbGUgZXh0ZW5zaW9uIHRvIHVzZSwgZGVwZW5kaW5nIG9uXG4gICAqIHRoZSBwbGF0Zm9ybSAoKVxuICAgKi9cbiAgcGxhdGZvcm06IHtcbiAgICBvczogbnVsbCxcbiAgICBpc01vYmlsZTogbnVsbCxcbiAgICBhdWRpb0ZpbGVFeHQ6ICcnLFxuICB9LFxuXG4gIC8qKlxuICAgKiBDbGllbnQgdHlwZS5cbiAgICogVGhlIGNsaWVudCB0eXBlIGlzIHNwZWZpY2llZCBpbiB0aGUgYXJndW1lbnQgb2YgdGhlIGBpbml0YCBtZXRob2QuIEZvclxuICAgKiBpbnN0YW5jZSwgYCdwbGF5ZXInYCBpcyB0aGUgY2xpZW50IHR5cGUgeW91IHNob3VsZCBiZSB1c2luZyBieSBkZWZhdWx0LlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgdHlwZTogbnVsbCxcblxuICAvKipcbiAgICogUHJvbWlzZSByZXNvbHZlZCB3aGVuIHRoZSBzZXJ2ZXIgc2VuZHMgYSBtZXNzYWdlIGluZGljYXRpbmcgdGhhdCB0aGUgY2xpZW50XG4gICAqIGNhbiBzdGFydCB0aGUgZmlyc3QgbWR1bGUuXG4gICAqIEB0eXBlIHtQcm9taXNlfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVhZHk6IG51bGwsXG5cbiAgLyoqXG4gICAqIENsaWVudCB1bmlxdWUgaWQsIGdpdmVuIGJ5IHRoZSBzZXJ2ZXIuXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICB1aWQ6IG51bGwsXG5cbiAgLyoqXG4gICAqIENsaWVudCBjb29yZGluYXRlcyAoaWYgYW55KSBnaXZlbiBieSBhIHtAbGluayBMb2NhdG9yfSwge0BsaW5rIFBsYWNlcn0gb3JcbiAgICoge0BsaW5rIENoZWNraW59IG1vZHVsZS4gKEZvcm1hdDogYFt4Ok51bWJlciwgeTpOdW1iZXJdYC4pXG4gICAqIEB0eXBlIHtOdW1iZXJbXX1cbiAgICovXG4gIGNvb3JkaW5hdGVzOiBudWxsLFxuXG4gIC8qKlxuICAgKiBUaGUgYGluaXRgIG1ldGhvZCBzZXRzIHRoZSBjbGllbnQgdHlwZSBhbmQgaW5pdGlhbGl6ZXMgYSBXZWJTb2NrZXQgY29ubmVjdGlvbiBhc3NvY2lhdGVkIHdpdGggdGhlIGdpdmVuIHR5cGUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbY2xpZW50VHlwZSA9ICdwbGF5ZXInXSBUaGUgY2xpZW50IHR5cGUuXG4gICAqIEB0b2RvIGNsYXJpZnkgY2xpZW50VHlwZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zID0ge31dIFRoZSBvcHRpb25zIHRvIGluaXRpYWxpemUgYSBjbGllbnRcbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5pb10gQnkgZGVmYXVsdCwgYSBTb3VuZHdvcmtzIGFwcGxpY2F0aW9uIGhhcyBhIGNsaWVudCBhbmQgYSBzZXJ2ZXIgc2lkZS4gRm9yIGEgc3RhbmRhbG9uZSBhcHBsaWNhdGlvbiAoY2xpZW50IHNpZGUgb25seSksIHVzZSBgb3B0aW9ucy5pbyA9IGZhbHNlYC5cbiAgICogQHRvZG8gdXNlIGRlZmF1bHQgdmFsdWUgZm9yIG9wdGlvbnMuaW8gaW4gdGhlIGRvY3VtZW50YXRpb24/XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9uZGVmYXVsdFRleHRDb250ZW50c3Muc29ja2V0VXJsXSBUaGUgVVJMIG9mIHRoZSBXZWJTb2NrZXQgc2VydmVyLlxuICAgKi9cbiAgaW5pdChjbGllbnRUeXBlID0gJ3BsYXllcicsIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMudHlwZSA9IGNsaWVudFR5cGU7XG5cbiAgICBjb25zdCBzb2NrZXRJTyA9IHdpbmRvdy5DT05GSUcuU09DS0VUX0NPTkZJRzsgLy8gc2hhcmVkIGJ5IHNlcnZlciAoY2YgLmVqcyB0ZW1wbGF0ZSlcbiAgICAvLyBAdG9kbyBoYXJtb25pemUgaW8gY29uZmlnIHdpdGggc2VydmVyXG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgaW86IHRydWUsXG4gICAgICBkZWJ1Z0lPOiBmYWxzZSxcbiAgICAgIHNvY2tldFVybDogc29ja2V0SU8gPyBzb2NrZXRJTy51cmwgOsKgJycsXG4gICAgICB0cmFuc3BvcnRzOiBzb2NrZXRJTyA/IHNvY2tldElPLnRyYW5zcG9ydHMgOsKgWyd3ZWJzb2NrZXQnXSxcbiAgICAgIGFwcENvbnRhaW5lcjogJyNjb250YWluZXInLFxuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgLy8gaW5pdGlhbGl6ZSBtb2R1bGVzIHZpZXdzIHdpdGggZGVmYXVsdCB0ZXh0cyBhbmQgdGVtcGxhdGVzXG4gICAgdGhpcy50ZXh0Q29udGVudHMgPSB7fTtcbiAgICB0aGlzLnRlbXBsYXRlcyA9IHt9O1xuXG4gICAgY29uc3QgdGV4dENvbnRlbnRzID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0VGV4dENvbnRlbnRzLCB7XG4gICAgICBnbG9iYWxzOiB7IGFwcE5hbWU6IHdpbmRvdy5DT05GSUcuQVBQX05BTUUgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5zZXRWaWV3Q29udGVudERlZmluaXRpb25zKHRleHRDb250ZW50cyk7XG4gICAgdGhpcy5zZXRWaWV3VGVtcGxhdGVEZWZpbml0aW9ucyhkZWZhdWx0VGVtcGxhdGVzKTtcbiAgICB0aGlzLnNldEFwcENvbnRhaW5lcihvcHRpb25zLmFwcENvbnRhaW5lcik7XG5cbiAgICBpZiAob3B0aW9ucy5pbyAhPT0gZmFsc2UpIHtcbiAgICAgIC8vIGluaXRpYWxpemUgc29ja2V0IGNvbW11bmljYXRpb25zXG4gICAgICB0aGlzLmNvbW0gPSBjb21tLmluaXRpYWxpemUoY2xpZW50VHlwZSwgb3B0aW9ucyk7XG4gICAgICAvLyB3YWl0IGZvciBzb2NrZXQgYmVpbmcgcmVhZHkgdG8gcmVzb2x2ZSB0aGlzIG1vZHVsZVxuICAgICAgdGhpcy5yZWFkeSA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIHRoaXMuY29tbS5yZWNlaXZlKCdjbGllbnQ6c3RhcnQnLCAodWlkKSA9PiB7XG4gICAgICAgICAgdGhpcy51aWQgPSB1aWQ7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlYWR5ID0gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuICAgIH1cblxuICAgIC8vIGRlYnVnIC0gaHR0cDovL3NvY2tldC5pby9kb2NzL2xvZ2dpbmctYW5kLWRlYnVnZ2luZy8jYXZhaWxhYmxlLWRlYnVnZ2luZy1zY29wZXNcbiAgICBpZiAob3B0aW9ucy5kZWJ1Z0lPKSB7XG4gICAgICBsb2NhbFN0b3JhZ2UuZGVidWcgPSAnKic7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgbW9kdWxlIGxvZ2ljICgqaS5lLiogdGhlIGFwcGxpY2F0aW9uKS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gc3RhcnRGdW4gLSBbQHRvZG8gQ2xhcmlmeSB0aGUgcGFyYW1dXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IC0gVGhlIFByb21pc2UgcmV0dXJuIHZhbHVlIFtAdG9kbyBDbGFyaWZ5IHRoZSBwYXJhbV0uXG4gICAqIEB0b2RvIGV4YW1wbGVcbiAgICovXG4gIHN0YXJ0KHN0YXJ0RnVuKSB7XG4gICAgbGV0IG1vZHVsZSA9IHN0YXJ0RnVuOyAvLyBmYWNhZGUgaW4gY2FzZSBvZiBvbmUgbW9kdWxlIG9ubHlcblxuICAgIGlmICh0eXBlb2Ygc3RhcnRGdW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIG1vZHVsZSA9IHN0YXJ0RnVuKENsaWVudE1vZHVsZS5zZXF1ZW50aWFsLCBDbGllbnRNb2R1bGUucGFyYWxsZWwpO1xuICAgIH1cblxuICAgIGxldCBwcm9taXNlID0gbW9kdWxlLmNyZWF0ZVByb21pc2UoKTtcbiAgICB0aGlzLnJlYWR5LnRoZW4oKCkgPT4gbW9kdWxlLmxhdW5jaCgpKTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBFeHRlbmQgYXBwbGljYXRpb24gdGV4dCBjb250ZW50cyB3aXRoIHRoZSBnaXZlbiBvYmplY3QuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZW50cyAtIFRoZSB0ZXh0IGNvbnRlbnRzIHRvIHByb3BhZ2F0ZSB0byBtb2R1bGVzLlxuICAgKi9cbiAgc2V0Vmlld0NvbnRlbnREZWZpbml0aW9ucyhkZWZzKSB7XG4gICAgdGhpcy50ZXh0Q29udGVudHMgPSBPYmplY3QuYXNzaWduKHRoaXMudGV4dENvbnRlbnRzLCBkZWZzKTtcbiAgICBDbGllbnRNb2R1bGUuc2V0Vmlld0NvbnRlbnREZWZpbml0aW9ucyh0aGlzLnRleHRDb250ZW50cyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEV4dGVuZCBhcHBsaWNhdGlvbiB0ZW1wbGF0ZXMgd2l0aCB0aGUgZ2l2ZW4gb2JqZWN0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gdGVtcGxhdGVzIC0gVGhlIHRlbXBsYXRlcyB0byBwcm9wYWdhdGUgdG8gbW9kdWxlcy5cbiAgICovXG4gIHNldFZpZXdUZW1wbGF0ZURlZmluaXRpb25zKGRlZnMpIHtcbiAgICB0aGlzLnRlbXBsYXRlcyA9IE9iamVjdC5hc3NpZ24odGhpcy50ZW1wbGF0ZXMsIGRlZnMpO1xuICAgIENsaWVudE1vZHVsZS5zZXRWaWV3VGVtcGxhdGVEZWZpbml0aW9ucyh0aGlzLnRlbXBsYXRlcyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGRlZmF1bHQgdmlldyBjb250YWluZXIgZm9yIGFsbCBgQ2xpZW50TW9kdWxlYHNcbiAgICogQHBhcmFtIHtTdHJpbmd8RWxlbWVudH0gZWwgLSBBIERPTSBlbGVtZW50IG9yIGEgY3NzIHNlbGVjdG9yIG1hdGNoaW5nIHRoZSBlbGVtZW50IHRvIHVzZSBhcyBhIGNvbnRhaW5lci5cbiAgICovXG4gIHNldEFwcENvbnRhaW5lcihlbCkge1xuICAgIGNvbnN0ICRjb250YWluZXIgPSBlbCBpbnN0YW5jZW9mIEVsZW1lbnQgPyBlbCA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWwpO1xuICAgIENsaWVudE1vZHVsZS5zZXRWaWV3Q29udGFpbmVyKCRjb250YWluZXIpO1xuICB9LFxuXG59O1xuXG4iXX0=