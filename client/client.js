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

    var socketIO = window.SOCKET_CONFIG; // shared by server (cf .ejs template)
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
   * Start the module logic (*i.e.* the application).
   * @param {Function} startFun [todo]
   * @todo Clarify the param.
   * @return {Promise} The Promise return value.
   * @todo Clarify return value (promise).
   * @todo example
   * @todo remove old version compatibility
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvY2xpZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs0QkFBeUIsZ0JBQWdCOzs7O29CQUN4QixRQUFROzs7OzBDQUNPLCtCQUErQjs7Ozt1Q0FDbEMsNEJBQTRCOzs7Ozs7OztxQkFPMUM7Ozs7OztBQU1iLE1BQUksRUFBRSxJQUFJOzs7Ozs7Ozs7OztBQVdWLFVBQVEsRUFBRTtBQUNSLE1BQUUsRUFBRSxJQUFJO0FBQ1IsWUFBUSxFQUFFLElBQUk7QUFDZCxnQkFBWSxFQUFFLEVBQUU7R0FDakI7Ozs7Ozs7O0FBUUQsTUFBSSxFQUFFLElBQUk7Ozs7Ozs7O0FBUVYsT0FBSyxFQUFFLElBQUk7Ozs7OztBQU1YLE9BQUssRUFBRSxDQUFDLENBQUM7Ozs7Ozs7QUFPVCxhQUFXLEVBQUUsSUFBSTs7Ozs7Ozs7Ozs7QUFXakIsTUFBSSxFQUFBLGdCQUFzQzs7O1FBQXJDLFVBQVUseURBQUcsUUFBUTtRQUFFLE9BQU8seURBQUcsRUFBRTs7QUFDdEMsUUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7O0FBRXZCLFFBQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUM7O0FBRXRDLFdBQU8sR0FBRyxlQUFjO0FBQ3RCLFFBQUUsRUFBRSxJQUFJO0FBQ1IsYUFBTyxFQUFFLEtBQUs7QUFDZCxlQUFTLEVBQUUsUUFBUSxHQUFHLFFBQVEsQ0FBQyxHQUFHLEdBQUcsRUFBRTtBQUN2QyxnQkFBVSxFQUFFLFFBQVEsR0FBRyxRQUFRLENBQUMsVUFBVSxHQUFHLENBQUMsV0FBVyxDQUFDO0FBQzFELGtCQUFZLEVBQUUsWUFBWTtLQUMzQixFQUFFLE9BQU8sQ0FBQyxDQUFDOzs7QUFHWixRQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztBQUN2QixRQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztBQUNwQixRQUFJLENBQUMseUJBQXlCLHlDQUFxQixDQUFDO0FBQ3BELFFBQUksQ0FBQywwQkFBMEIsc0NBQWtCLENBQUM7QUFDbEQsUUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7O0FBRTNDLFFBQUksT0FBTyxDQUFDLEVBQUUsS0FBSyxLQUFLLEVBQUU7O0FBRXhCLFVBQUksQ0FBQyxJQUFJLEdBQUcsa0JBQUssVUFBVSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQzs7QUFFakQsVUFBSSxDQUFDLEtBQUssR0FBRyxhQUFZLFVBQUMsT0FBTyxFQUFLO0FBQ3BDLGNBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDM0MsZ0JBQUssS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNuQixpQkFBTyxFQUFFLENBQUM7U0FDWCxDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7S0FDSixNQUFNO0FBQ0wsVUFBSSxDQUFDLEtBQUssR0FBRyxTQUFRLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNwQzs7O0FBR0QsUUFBSSxPQUFPLENBQUMsT0FBTyxFQUFFO0FBQ25CLGtCQUFZLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztLQUMxQjtHQUNGOzs7Ozs7Ozs7OztBQVdELE9BQUssRUFBQSxlQUFDLFFBQVEsRUFBRTtBQUNkLFFBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQzs7QUFFdEIsUUFBSSxPQUFPLFFBQVEsS0FBSyxVQUFVLEVBQUU7QUFDbEMsWUFBTSxHQUFHLFFBQVEsQ0FBQywwQkFBYSxVQUFVLEVBQUUsMEJBQWEsUUFBUSxDQUFDLENBQUM7S0FDbkU7O0FBRUQsUUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDO0FBQ3JDLFFBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO2FBQU0sTUFBTSxDQUFDLE1BQU0sRUFBRTtLQUFBLENBQUMsQ0FBQzs7QUFFdkMsV0FBTyxPQUFPLENBQUM7R0FDaEI7Ozs7OztBQU1ELDJCQUF5QixFQUFBLG1DQUFDLElBQUksRUFBRTtBQUM5QixRQUFJLENBQUMsWUFBWSxHQUFHLGVBQWMsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUMzRCw4QkFBYSx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7R0FDM0Q7Ozs7OztBQU1ELDRCQUEwQixFQUFBLG9DQUFDLElBQUksRUFBRTtBQUMvQixRQUFJLENBQUMsU0FBUyxHQUFHLGVBQWMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNyRCw4QkFBYSwwQkFBMEIsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7R0FDekQ7Ozs7OztBQU1ELGlCQUFlLEVBQUEseUJBQUMsRUFBRSxFQUFFO0FBQ2xCLFFBQU0sVUFBVSxHQUFHLEVBQUUsWUFBWSxPQUFPLEdBQUcsRUFBRSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDM0UsOEJBQWEsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQUM7R0FDM0M7O0NBRUYiLCJmaWxlIjoic3JjL2NsaWVudC9jbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ2xpZW50TW9kdWxlIGZyb20gJy4vQ2xpZW50TW9kdWxlJztcbmltcG9ydCBjb21tIGZyb20gJy4vY29tbSc7XG5pbXBvcnQgZGVmYXVsdFRleHRDb250ZW50cyBmcm9tICcuL2Rpc3BsYXkvZGVmYXVsdFRleHRDb250ZW50cyc7XG5pbXBvcnQgZGVmYXVsdFRlbXBsYXRlcyBmcm9tICcuL2Rpc3BsYXkvZGVmYXVsdFRlbXBsYXRlcyc7XG5cblxuLyoqXG4gKiBUaGUgYGNsaWVudGAgb2JqZWN0IGNvbnRhaW5zIHRoZSBiYXNpYyBtZXRob2RzIGFuZCBhdHRyaWJ1dGVzIG9mIHRoZSBjbGllbnQuXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8qKlxuICAgKiBTb2NrZXQgdXNlZCB0byBjb21tdW5pY2F0ZSB3aXRoIHRoZSBzZXJ2ZXIsIGlmIGFueS5cbiAgICogQHR5cGUge1NvY2tldH1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNvbW06IG51bGwsXG5cbiAgLyoqXG4gICAqIEluZm9ybWF0aW9uIGFib3V0IHRoZSBjbGllbnQgcGxhdGZvcm0uXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBvcyBPcGVyYXRpbmcgc3lzdGVtLlxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGlzTW9iaWxlIEluZGljYXRlcyB3aGV0aGVyIHRoZSBjbGllbnQgaXMgcnVubmluZyBvbiBhXG4gICAqIG1vYmlsZSBwbGF0Zm9ybSBvciBub3QuXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBhdWRpb0ZpbGVFeHQgQXVkaW8gZmlsZSBleHRlbnNpb24gdG8gdXNlLCBkZXBlbmRpbmcgb25cbiAgICogdGhlIHBsYXRmb3JtICgpXG4gICAqL1xuICBwbGF0Zm9ybToge1xuICAgIG9zOiBudWxsLFxuICAgIGlzTW9iaWxlOiBudWxsLFxuICAgIGF1ZGlvRmlsZUV4dDogJycsXG4gIH0sXG5cbiAgLyoqXG4gICAqIENsaWVudCB0eXBlLlxuICAgKiBUaGUgY2xpZW50IHR5cGUgaXMgc3BlZmljaWVkIGluIHRoZSBhcmd1bWVudCBvZiB0aGUgYGluaXRgIG1ldGhvZC4gRm9yXG4gICAqIGluc3RhbmNlLCBgJ3BsYXllcidgIGlzIHRoZSBjbGllbnQgdHlwZSB5b3Ugc2hvdWxkIGJlIHVzaW5nIGJ5IGRlZmF1bHQuXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICB0eXBlOiBudWxsLFxuXG4gIC8qKlxuICAgKiBQcm9taXNlIHJlc29sdmVkIHdoZW4gdGhlIHNlcnZlciBzZW5kcyBhIG1lc3NhZ2UgaW5kaWNhdGluZyB0aGF0IHRoZSBjbGllbnRcbiAgICogY2FuIHN0YXJ0IHRoZSBmaXJzdCBtZHVsZS5cbiAgICogQHR5cGUge1Byb21pc2V9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZWFkeTogbnVsbCxcblxuICAvKipcbiAgICogQ2xpZW50IGluZGV4LCBnaXZlbiBieSB0aGUgc2VydmVyLlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgaW5kZXg6IC0xLFxuXG4gIC8qKlxuICAgKiBDbGllbnQgY29vcmRpbmF0ZXMgKGlmIGFueSkgZ2l2ZW4gYnkgYSB7QGxpbmsgTG9jYXRvcn0sIHtAbGluayBQbGFjZXJ9IG9yXG4gICAqIHtAbGluayBDaGVja2lufSBtb2R1bGUuIChGb3JtYXQ6IGBbeDpOdW1iZXIsIHk6TnVtYmVyXWAuKVxuICAgKiBAdHlwZSB7TnVtYmVyW119XG4gICAqL1xuICBjb29yZGluYXRlczogbnVsbCxcblxuICAvKipcbiAgICogVGhlIGBpbml0YCBtZXRob2Qgc2V0cyB0aGUgY2xpZW50IHR5cGUgYW5kIGluaXRpYWxpemVzIGEgV2ViU29ja2V0IGNvbm5lY3Rpb24gYXNzb2NpYXRlZCB3aXRoIHRoZSBnaXZlbiB0eXBlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW2NsaWVudFR5cGUgPSAncGxheWVyJ10gVGhlIGNsaWVudCB0eXBlLlxuICAgKiBAdG9kbyBjbGFyaWZ5IGNsaWVudFR5cGUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucyA9IHt9XSBUaGUgb3B0aW9ucyB0byBpbml0aWFsaXplIGEgY2xpZW50XG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuaW9dIEJ5IGRlZmF1bHQsIGEgU291bmR3b3JrcyBhcHBsaWNhdGlvbiBoYXMgYSBjbGllbnQgYW5kIGEgc2VydmVyIHNpZGUuIEZvciBhIHN0YW5kYWxvbmUgYXBwbGljYXRpb24gKGNsaWVudCBzaWRlIG9ubHkpLCB1c2UgYG9wdGlvbnMuaW8gPSBmYWxzZWAuXG4gICAqIEB0b2RvIHVzZSBkZWZhdWx0IHZhbHVlIGZvciBvcHRpb25zLmlvIGluIHRoZSBkb2N1bWVudGF0aW9uP1xuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbmRlZmF1bHRUZXh0Q29udGVudHNzLnNvY2tldFVybF0gVGhlIFVSTCBvZiB0aGUgV2ViU29ja2V0IHNlcnZlci5cbiAgICovXG4gIGluaXQoY2xpZW50VHlwZSA9ICdwbGF5ZXInLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLnR5cGUgPSBjbGllbnRUeXBlO1xuXG4gICAgY29uc3Qgc29ja2V0SU8gPSB3aW5kb3cuU09DS0VUX0NPTkZJRzsgLy8gc2hhcmVkIGJ5IHNlcnZlciAoY2YgLmVqcyB0ZW1wbGF0ZSlcbiAgICAvLyBAdG9kbyBoYXJtb25pemUgaW8gY29uZmlnIHdpdGggc2VydmVyXG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgaW86IHRydWUsXG4gICAgICBkZWJ1Z0lPOiBmYWxzZSxcbiAgICAgIHNvY2tldFVybDogc29ja2V0SU8gPyBzb2NrZXRJTy51cmwgOsKgJycsXG4gICAgICB0cmFuc3BvcnRzOiBzb2NrZXRJTyA/IHNvY2tldElPLnRyYW5zcG9ydHMgOsKgWyd3ZWJzb2NrZXQnXSxcbiAgICAgIGFwcENvbnRhaW5lcjogJyNjb250YWluZXInLFxuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgLy8gaW5pdGlhbGl6ZSBtb2R1bGVzIHZpZXdzIHdpdGggZGVmYXVsdCB0ZXh0cyBhbmQgdGVtcGxhdGVzXG4gICAgdGhpcy50ZXh0Q29udGVudHMgPSB7fTtcbiAgICB0aGlzLnRlbXBsYXRlcyA9IHt9O1xuICAgIHRoaXMuc2V0Vmlld0NvbnRlbnREZWZpbml0aW9ucyhkZWZhdWx0VGV4dENvbnRlbnRzKTtcbiAgICB0aGlzLnNldFZpZXdUZW1wbGF0ZURlZmluaXRpb25zKGRlZmF1bHRUZW1wbGF0ZXMpO1xuICAgIHRoaXMuc2V0QXBwQ29udGFpbmVyKG9wdGlvbnMuYXBwQ29udGFpbmVyKTtcblxuICAgIGlmIChvcHRpb25zLmlvICE9PSBmYWxzZSkge1xuICAgICAgLy8gaW5pdGlhbGl6ZSBzb2NrZXQgY29tbXVuaWNhdGlvbnNcbiAgICAgIHRoaXMuY29tbSA9IGNvbW0uaW5pdGlhbGl6ZShjbGllbnRUeXBlLCBvcHRpb25zKTtcbiAgICAgIC8vIHdhaXQgZm9yIHNvY2tldCBiZWluZyByZWFkeSB0byByZXNvbHZlIHRoaXMgbW9kdWxlXG4gICAgICB0aGlzLnJlYWR5ID0gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgdGhpcy5jb21tLnJlY2VpdmUoJ2NsaWVudDpzdGFydCcsIChpbmRleCkgPT4ge1xuICAgICAgICAgIHRoaXMuaW5kZXggPSBpbmRleDtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVhZHkgPSBQcm9taXNlLnJlc29sdmUodHJ1ZSk7XG4gICAgfVxuXG4gICAgLy8gZGVidWcgLSBodHRwOi8vc29ja2V0LmlvL2RvY3MvbG9nZ2luZy1hbmQtZGVidWdnaW5nLyNhdmFpbGFibGUtZGVidWdnaW5nLXNjb3Blc1xuICAgIGlmIChvcHRpb25zLmRlYnVnSU8pIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5kZWJ1ZyA9ICcqJztcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBtb2R1bGUgbG9naWMgKCppLmUuKiB0aGUgYXBwbGljYXRpb24pLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdGFydEZ1biBbdG9kb11cbiAgICogQHRvZG8gQ2xhcmlmeSB0aGUgcGFyYW0uXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IFRoZSBQcm9taXNlIHJldHVybiB2YWx1ZS5cbiAgICogQHRvZG8gQ2xhcmlmeSByZXR1cm4gdmFsdWUgKHByb21pc2UpLlxuICAgKiBAdG9kbyBleGFtcGxlXG4gICAqIEB0b2RvIHJlbW92ZSBvbGQgdmVyc2lvbiBjb21wYXRpYmlsaXR5XG4gICAqL1xuICBzdGFydChzdGFydEZ1bikge1xuICAgIGxldCBtb2R1bGUgPSBzdGFydEZ1bjsgLy8gYmUgY29tcGF0aWJsZSB3aXRoIHByZXZpb3VzIHZlcnNpb25cblxuICAgIGlmICh0eXBlb2Ygc3RhcnRGdW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIG1vZHVsZSA9IHN0YXJ0RnVuKENsaWVudE1vZHVsZS5zZXF1ZW50aWFsLCBDbGllbnRNb2R1bGUucGFyYWxsZWwpO1xuICAgIH1cblxuICAgIGxldCBwcm9taXNlID0gbW9kdWxlLmNyZWF0ZVByb21pc2UoKTtcbiAgICB0aGlzLnJlYWR5LnRoZW4oKCkgPT4gbW9kdWxlLmxhdW5jaCgpKTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBFeHRlbmQgYXBwbGljYXRpb24gdGV4dCBjb250ZW50cyB3aXRoIHRoZSBnaXZlbiBvYmplY3QuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZW50cyAtIFRoZSB0ZXh0IGNvbnRlbnRzIHRvIHByb3BhZ2F0ZSB0byBtb2R1bGVzLlxuICAgKi9cbiAgc2V0Vmlld0NvbnRlbnREZWZpbml0aW9ucyhkZWZzKSB7XG4gICAgdGhpcy50ZXh0Q29udGVudHMgPSBPYmplY3QuYXNzaWduKHRoaXMudGV4dENvbnRlbnRzLCBkZWZzKTtcbiAgICBDbGllbnRNb2R1bGUuc2V0Vmlld0NvbnRlbnREZWZpbml0aW9ucyh0aGlzLnRleHRDb250ZW50cyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEV4dGVuZCBhcHBsaWNhdGlvbiB0ZW1wbGF0ZXMgd2l0aCB0aGUgZ2l2ZW4gb2JqZWN0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gdGVtcGxhdGVzIC0gVGhlIHRlbXBsYXRlcyB0byBwcm9wYWdhdGUgdG8gbW9kdWxlcy5cbiAgICovXG4gIHNldFZpZXdUZW1wbGF0ZURlZmluaXRpb25zKGRlZnMpIHtcbiAgICB0aGlzLnRlbXBsYXRlcyA9IE9iamVjdC5hc3NpZ24odGhpcy50ZW1wbGF0ZXMsIGRlZnMpO1xuICAgIENsaWVudE1vZHVsZS5zZXRWaWV3VGVtcGxhdGVEZWZpbml0aW9ucyh0aGlzLnRlbXBsYXRlcyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGRlZmF1bHQgdmlldyBjb250YWluZXIgZm9yIGFsbCBgQ2xpZW50TW9kdWxlYHNcbiAgICogQHBhcmFtIHtTdHJpbmd8RWxlbWVudH0gZWwgLSBBIERPTSBlbGVtZW50IG9yIGEgY3NzIHNlbGVjdG9yIG1hdGNoaW5nIHRoZSBlbGVtZW50IHRvIHVzZSBhcyBhIGNvbnRhaW5lci5cbiAgICovXG4gIHNldEFwcENvbnRhaW5lcihlbCkge1xuICAgIGNvbnN0ICRjb250YWluZXIgPSBlbCBpbnN0YW5jZW9mIEVsZW1lbnQgPyBlbCA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWwpO1xuICAgIENsaWVudE1vZHVsZS5zZXRWaWV3Q29udGFpbmVyKCRjb250YWluZXIpO1xuICB9LFxuXG59O1xuXG4iXX0=