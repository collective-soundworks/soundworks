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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvY2xpZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs0QkFBeUIsZ0JBQWdCOzs7O29CQUN4QixRQUFROzs7OzBDQUNPLCtCQUErQjs7Ozt1Q0FDbEMsNEJBQTRCOzs7Ozs7OztxQkFPMUM7Ozs7OztBQU1iLE1BQUksRUFBRSxJQUFJOzs7Ozs7Ozs7OztBQVdWLFVBQVEsRUFBRTtBQUNSLE1BQUUsRUFBRSxJQUFJO0FBQ1IsWUFBUSxFQUFFLElBQUk7QUFDZCxnQkFBWSxFQUFFLEVBQUU7R0FDakI7Ozs7Ozs7O0FBUUQsTUFBSSxFQUFFLElBQUk7Ozs7Ozs7O0FBUVYsT0FBSyxFQUFFLElBQUk7Ozs7OztBQU1YLEtBQUcsRUFBRSxJQUFJOzs7Ozs7O0FBT1QsYUFBVyxFQUFFLElBQUk7Ozs7Ozs7Ozs7O0FBV2pCLE1BQUksRUFBQSxnQkFBc0M7OztRQUFyQyxVQUFVLHlEQUFHLFFBQVE7UUFBRSxPQUFPLHlEQUFHLEVBQUU7O0FBQ3RDLFFBQUksQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDOztBQUV2QixRQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDOztBQUV0QyxXQUFPLEdBQUcsZUFBYztBQUN0QixRQUFFLEVBQUUsSUFBSTtBQUNSLGFBQU8sRUFBRSxLQUFLO0FBQ2QsZUFBUyxFQUFFLFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxHQUFHLEVBQUU7QUFDdkMsZ0JBQVUsRUFBRSxRQUFRLEdBQUcsUUFBUSxDQUFDLFVBQVUsR0FBRyxDQUFDLFdBQVcsQ0FBQztBQUMxRCxrQkFBWSxFQUFFLFlBQVk7S0FDM0IsRUFBRSxPQUFPLENBQUMsQ0FBQzs7O0FBR1osUUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7QUFDdkIsUUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7QUFDcEIsUUFBSSxDQUFDLHlCQUF5Qix5Q0FBcUIsQ0FBQztBQUNwRCxRQUFJLENBQUMsMEJBQTBCLHNDQUFrQixDQUFDO0FBQ2xELFFBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDOztBQUUzQyxRQUFJLE9BQU8sQ0FBQyxFQUFFLEtBQUssS0FBSyxFQUFFOztBQUV4QixVQUFJLENBQUMsSUFBSSxHQUFHLGtCQUFLLFVBQVUsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7O0FBRWpELFVBQUksQ0FBQyxLQUFLLEdBQUcsYUFBWSxVQUFDLE9BQU8sRUFBSztBQUNwQyxjQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLFVBQUMsR0FBRyxFQUFLO0FBQ3pDLGdCQUFLLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDZixpQkFBTyxFQUFFLENBQUM7U0FDWCxDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7S0FDSixNQUFNO0FBQ0wsVUFBSSxDQUFDLEtBQUssR0FBRyxTQUFRLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNwQzs7O0FBR0QsUUFBSSxPQUFPLENBQUMsT0FBTyxFQUFFO0FBQ25CLGtCQUFZLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztLQUMxQjtHQUNGOzs7Ozs7OztBQVFELE9BQUssRUFBQSxlQUFDLFFBQVEsRUFBRTtBQUNkLFFBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQzs7QUFFdEIsUUFBSSxPQUFPLFFBQVEsS0FBSyxVQUFVLEVBQUU7QUFDbEMsWUFBTSxHQUFHLFFBQVEsQ0FBQywwQkFBYSxVQUFVLEVBQUUsMEJBQWEsUUFBUSxDQUFDLENBQUM7S0FDbkU7O0FBRUQsUUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDO0FBQ3JDLFFBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO2FBQU0sTUFBTSxDQUFDLE1BQU0sRUFBRTtLQUFBLENBQUMsQ0FBQzs7QUFFdkMsV0FBTyxPQUFPLENBQUM7R0FDaEI7Ozs7OztBQU1ELDJCQUF5QixFQUFBLG1DQUFDLElBQUksRUFBRTtBQUM5QixRQUFJLENBQUMsWUFBWSxHQUFHLGVBQWMsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUMzRCw4QkFBYSx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7R0FDM0Q7Ozs7OztBQU1ELDRCQUEwQixFQUFBLG9DQUFDLElBQUksRUFBRTtBQUMvQixRQUFJLENBQUMsU0FBUyxHQUFHLGVBQWMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNyRCw4QkFBYSwwQkFBMEIsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7R0FDekQ7Ozs7OztBQU1ELGlCQUFlLEVBQUEseUJBQUMsRUFBRSxFQUFFO0FBQ2xCLFFBQU0sVUFBVSxHQUFHLEVBQUUsWUFBWSxPQUFPLEdBQUcsRUFBRSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDM0UsOEJBQWEsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQUM7R0FDM0M7O0NBRUYiLCJmaWxlIjoic3JjL2NsaWVudC9jbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ2xpZW50TW9kdWxlIGZyb20gJy4vQ2xpZW50TW9kdWxlJztcbmltcG9ydCBjb21tIGZyb20gJy4vY29tbSc7XG5pbXBvcnQgZGVmYXVsdFRleHRDb250ZW50cyBmcm9tICcuL2Rpc3BsYXkvZGVmYXVsdFRleHRDb250ZW50cyc7XG5pbXBvcnQgZGVmYXVsdFRlbXBsYXRlcyBmcm9tICcuL2Rpc3BsYXkvZGVmYXVsdFRlbXBsYXRlcyc7XG5cblxuLyoqXG4gKiBUaGUgYGNsaWVudGAgb2JqZWN0IGNvbnRhaW5zIHRoZSBiYXNpYyBtZXRob2RzIGFuZCBhdHRyaWJ1dGVzIG9mIHRoZSBjbGllbnQuXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8qKlxuICAgKiBTb2NrZXQgdXNlZCB0byBjb21tdW5pY2F0ZSB3aXRoIHRoZSBzZXJ2ZXIsIGlmIGFueS5cbiAgICogQHR5cGUge1NvY2tldH1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNvbW06IG51bGwsXG5cbiAgLyoqXG4gICAqIEluZm9ybWF0aW9uIGFib3V0IHRoZSBjbGllbnQgcGxhdGZvcm0uXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBvcyBPcGVyYXRpbmcgc3lzdGVtLlxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGlzTW9iaWxlIEluZGljYXRlcyB3aGV0aGVyIHRoZSBjbGllbnQgaXMgcnVubmluZyBvbiBhXG4gICAqIG1vYmlsZSBwbGF0Zm9ybSBvciBub3QuXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBhdWRpb0ZpbGVFeHQgQXVkaW8gZmlsZSBleHRlbnNpb24gdG8gdXNlLCBkZXBlbmRpbmcgb25cbiAgICogdGhlIHBsYXRmb3JtICgpXG4gICAqL1xuICBwbGF0Zm9ybToge1xuICAgIG9zOiBudWxsLFxuICAgIGlzTW9iaWxlOiBudWxsLFxuICAgIGF1ZGlvRmlsZUV4dDogJycsXG4gIH0sXG5cbiAgLyoqXG4gICAqIENsaWVudCB0eXBlLlxuICAgKiBUaGUgY2xpZW50IHR5cGUgaXMgc3BlZmljaWVkIGluIHRoZSBhcmd1bWVudCBvZiB0aGUgYGluaXRgIG1ldGhvZC4gRm9yXG4gICAqIGluc3RhbmNlLCBgJ3BsYXllcidgIGlzIHRoZSBjbGllbnQgdHlwZSB5b3Ugc2hvdWxkIGJlIHVzaW5nIGJ5IGRlZmF1bHQuXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICB0eXBlOiBudWxsLFxuXG4gIC8qKlxuICAgKiBQcm9taXNlIHJlc29sdmVkIHdoZW4gdGhlIHNlcnZlciBzZW5kcyBhIG1lc3NhZ2UgaW5kaWNhdGluZyB0aGF0IHRoZSBjbGllbnRcbiAgICogY2FuIHN0YXJ0IHRoZSBmaXJzdCBtZHVsZS5cbiAgICogQHR5cGUge1Byb21pc2V9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZWFkeTogbnVsbCxcblxuICAvKipcbiAgICogQ2xpZW50IHVuaXF1ZSBpZCwgZ2l2ZW4gYnkgdGhlIHNlcnZlci5cbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHVpZDogbnVsbCxcblxuICAvKipcbiAgICogQ2xpZW50IGNvb3JkaW5hdGVzIChpZiBhbnkpIGdpdmVuIGJ5IGEge0BsaW5rIExvY2F0b3J9LCB7QGxpbmsgUGxhY2VyfSBvclxuICAgKiB7QGxpbmsgQ2hlY2tpbn0gbW9kdWxlLiAoRm9ybWF0OiBgW3g6TnVtYmVyLCB5Ok51bWJlcl1gLilcbiAgICogQHR5cGUge051bWJlcltdfVxuICAgKi9cbiAgY29vcmRpbmF0ZXM6IG51bGwsXG5cbiAgLyoqXG4gICAqIFRoZSBgaW5pdGAgbWV0aG9kIHNldHMgdGhlIGNsaWVudCB0eXBlIGFuZCBpbml0aWFsaXplcyBhIFdlYlNvY2tldCBjb25uZWN0aW9uIGFzc29jaWF0ZWQgd2l0aCB0aGUgZ2l2ZW4gdHlwZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtjbGllbnRUeXBlID0gJ3BsYXllciddIFRoZSBjbGllbnQgdHlwZS5cbiAgICogQHRvZG8gY2xhcmlmeSBjbGllbnRUeXBlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMgPSB7fV0gVGhlIG9wdGlvbnMgdG8gaW5pdGlhbGl6ZSBhIGNsaWVudFxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmlvXSBCeSBkZWZhdWx0LCBhIFNvdW5kd29ya3MgYXBwbGljYXRpb24gaGFzIGEgY2xpZW50IGFuZCBhIHNlcnZlciBzaWRlLiBGb3IgYSBzdGFuZGFsb25lIGFwcGxpY2F0aW9uIChjbGllbnQgc2lkZSBvbmx5KSwgdXNlIGBvcHRpb25zLmlvID0gZmFsc2VgLlxuICAgKiBAdG9kbyB1c2UgZGVmYXVsdCB2YWx1ZSBmb3Igb3B0aW9ucy5pbyBpbiB0aGUgZG9jdW1lbnRhdGlvbj9cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25kZWZhdWx0VGV4dENvbnRlbnRzcy5zb2NrZXRVcmxdIFRoZSBVUkwgb2YgdGhlIFdlYlNvY2tldCBzZXJ2ZXIuXG4gICAqL1xuICBpbml0KGNsaWVudFR5cGUgPSAncGxheWVyJywgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy50eXBlID0gY2xpZW50VHlwZTtcblxuICAgIGNvbnN0IHNvY2tldElPID0gd2luZG93LlNPQ0tFVF9DT05GSUc7IC8vIHNoYXJlZCBieSBzZXJ2ZXIgKGNmIC5lanMgdGVtcGxhdGUpXG4gICAgLy8gQHRvZG8gaGFybW9uaXplIGlvIGNvbmZpZyB3aXRoIHNlcnZlclxuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIGlvOiB0cnVlLFxuICAgICAgZGVidWdJTzogZmFsc2UsXG4gICAgICBzb2NrZXRVcmw6IHNvY2tldElPID8gc29ja2V0SU8udXJsIDrCoCcnLFxuICAgICAgdHJhbnNwb3J0czogc29ja2V0SU8gPyBzb2NrZXRJTy50cmFuc3BvcnRzIDrCoFsnd2Vic29ja2V0J10sXG4gICAgICBhcHBDb250YWluZXI6ICcjY29udGFpbmVyJyxcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIC8vIGluaXRpYWxpemUgbW9kdWxlcyB2aWV3cyB3aXRoIGRlZmF1bHQgdGV4dHMgYW5kIHRlbXBsYXRlc1xuICAgIHRoaXMudGV4dENvbnRlbnRzID0ge307XG4gICAgdGhpcy50ZW1wbGF0ZXMgPSB7fTtcbiAgICB0aGlzLnNldFZpZXdDb250ZW50RGVmaW5pdGlvbnMoZGVmYXVsdFRleHRDb250ZW50cyk7XG4gICAgdGhpcy5zZXRWaWV3VGVtcGxhdGVEZWZpbml0aW9ucyhkZWZhdWx0VGVtcGxhdGVzKTtcbiAgICB0aGlzLnNldEFwcENvbnRhaW5lcihvcHRpb25zLmFwcENvbnRhaW5lcik7XG5cbiAgICBpZiAob3B0aW9ucy5pbyAhPT0gZmFsc2UpIHtcbiAgICAgIC8vIGluaXRpYWxpemUgc29ja2V0IGNvbW11bmljYXRpb25zXG4gICAgICB0aGlzLmNvbW0gPSBjb21tLmluaXRpYWxpemUoY2xpZW50VHlwZSwgb3B0aW9ucyk7XG4gICAgICAvLyB3YWl0IGZvciBzb2NrZXQgYmVpbmcgcmVhZHkgdG8gcmVzb2x2ZSB0aGlzIG1vZHVsZVxuICAgICAgdGhpcy5yZWFkeSA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIHRoaXMuY29tbS5yZWNlaXZlKCdjbGllbnQ6c3RhcnQnLCAodWlkKSA9PiB7XG4gICAgICAgICAgdGhpcy51aWQgPSB1aWQ7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlYWR5ID0gUHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuICAgIH1cblxuICAgIC8vIGRlYnVnIC0gaHR0cDovL3NvY2tldC5pby9kb2NzL2xvZ2dpbmctYW5kLWRlYnVnZ2luZy8jYXZhaWxhYmxlLWRlYnVnZ2luZy1zY29wZXNcbiAgICBpZiAob3B0aW9ucy5kZWJ1Z0lPKSB7XG4gICAgICBsb2NhbFN0b3JhZ2UuZGVidWcgPSAnKic7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgbW9kdWxlIGxvZ2ljICgqaS5lLiogdGhlIGFwcGxpY2F0aW9uKS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gc3RhcnRGdW4gLSBbQHRvZG8gQ2xhcmlmeSB0aGUgcGFyYW1dXG4gICAqIEByZXR1cm4ge1Byb21pc2V9IC0gVGhlIFByb21pc2UgcmV0dXJuIHZhbHVlIFtAdG9kbyBDbGFyaWZ5IHRoZSBwYXJhbV0uXG4gICAqIEB0b2RvIGV4YW1wbGVcbiAgICovXG4gIHN0YXJ0KHN0YXJ0RnVuKSB7XG4gICAgbGV0IG1vZHVsZSA9IHN0YXJ0RnVuOyAvLyBmYWNhZGUgaW4gY2FzZSBvZiBvbmUgbW9kdWxlIG9ubHlcblxuICAgIGlmICh0eXBlb2Ygc3RhcnRGdW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIG1vZHVsZSA9IHN0YXJ0RnVuKENsaWVudE1vZHVsZS5zZXF1ZW50aWFsLCBDbGllbnRNb2R1bGUucGFyYWxsZWwpO1xuICAgIH1cblxuICAgIGxldCBwcm9taXNlID0gbW9kdWxlLmNyZWF0ZVByb21pc2UoKTtcbiAgICB0aGlzLnJlYWR5LnRoZW4oKCkgPT4gbW9kdWxlLmxhdW5jaCgpKTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBFeHRlbmQgYXBwbGljYXRpb24gdGV4dCBjb250ZW50cyB3aXRoIHRoZSBnaXZlbiBvYmplY3QuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZW50cyAtIFRoZSB0ZXh0IGNvbnRlbnRzIHRvIHByb3BhZ2F0ZSB0byBtb2R1bGVzLlxuICAgKi9cbiAgc2V0Vmlld0NvbnRlbnREZWZpbml0aW9ucyhkZWZzKSB7XG4gICAgdGhpcy50ZXh0Q29udGVudHMgPSBPYmplY3QuYXNzaWduKHRoaXMudGV4dENvbnRlbnRzLCBkZWZzKTtcbiAgICBDbGllbnRNb2R1bGUuc2V0Vmlld0NvbnRlbnREZWZpbml0aW9ucyh0aGlzLnRleHRDb250ZW50cyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEV4dGVuZCBhcHBsaWNhdGlvbiB0ZW1wbGF0ZXMgd2l0aCB0aGUgZ2l2ZW4gb2JqZWN0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gdGVtcGxhdGVzIC0gVGhlIHRlbXBsYXRlcyB0byBwcm9wYWdhdGUgdG8gbW9kdWxlcy5cbiAgICovXG4gIHNldFZpZXdUZW1wbGF0ZURlZmluaXRpb25zKGRlZnMpIHtcbiAgICB0aGlzLnRlbXBsYXRlcyA9IE9iamVjdC5hc3NpZ24odGhpcy50ZW1wbGF0ZXMsIGRlZnMpO1xuICAgIENsaWVudE1vZHVsZS5zZXRWaWV3VGVtcGxhdGVEZWZpbml0aW9ucyh0aGlzLnRlbXBsYXRlcyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGRlZmF1bHQgdmlldyBjb250YWluZXIgZm9yIGFsbCBgQ2xpZW50TW9kdWxlYHNcbiAgICogQHBhcmFtIHtTdHJpbmd8RWxlbWVudH0gZWwgLSBBIERPTSBlbGVtZW50IG9yIGEgY3NzIHNlbGVjdG9yIG1hdGNoaW5nIHRoZSBlbGVtZW50IHRvIHVzZSBhcyBhIGNvbnRhaW5lci5cbiAgICovXG4gIHNldEFwcENvbnRhaW5lcihlbCkge1xuICAgIGNvbnN0ICRjb250YWluZXIgPSBlbCBpbnN0YW5jZW9mIEVsZW1lbnQgPyBlbCA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWwpO1xuICAgIENsaWVudE1vZHVsZS5zZXRWaWV3Q29udGFpbmVyKCRjb250YWluZXIpO1xuICB9LFxuXG59O1xuXG4iXX0=