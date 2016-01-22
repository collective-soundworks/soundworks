'use strict';

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

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
   * Is set to `true` by the `Welcome` module when the client does not meet the requirements.
   * Especially usefull when the module is used without a view and activated manually.
   * @type {Boolean}
   */
  rejected: false,

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
    var clientType = arguments.length <= 0 || arguments[0] === undefined ? 'player' : arguments[0];
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    this.type = clientType;

    var socketIO = window.CONFIG.SOCKET_CONFIG; // shared by server (cf .ejs template)
    // @todo harmonize io config with server
    this.options = _Object$assign({
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
    this.setAppContainer(this.options.appContainer);

    // debug - http://socket.io/docs/logging-and-debugging/#available-debugging-scopes
    if (this.options.debugIO) {
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
    var _this = this;

    var module = startFun; // facade in case of one module only

    if (typeof startFun === 'function') {
      module = startFun(_ClientModule2['default'].sequential, _ClientModule2['default'].parallel);
    }

    var promise = module.createPromise();

    if (this.options.io !== false) {
      // initialize socket communications
      this.comm = _comm2['default'].initialize(this.type, this.options);
      // wait for socket being ready to resolve this module
      this.comm.receive('client:start', function (uid) {
        if (_this.uid) {
          console.info('=========> reconnect:reload');
          // window.location.reload(false);
        }

        _this.uid = uid;
        module.launch();
      });

      this.comm.receive('reconnect', function () {
        console.info('=========> reconnect');
      });

      this.comm.receive('disconnect', function () {
        console.info('=========> disconnect');
      });

      this.comm.receive('error', function (err) {
        console.error(err);
      });
    } else {
      module.launch();
    }

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvY2xpZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7NEJBQXlCLGdCQUFnQjs7OztvQkFDeEIsUUFBUTs7OzswQ0FDTywrQkFBK0I7Ozs7dUNBQ2xDLDRCQUE0Qjs7Ozs7Ozs7cUJBTzFDOzs7Ozs7QUFNYixNQUFJLEVBQUUsSUFBSTs7Ozs7Ozs7Ozs7QUFXVixVQUFRLEVBQUU7QUFDUixNQUFFLEVBQUUsSUFBSTtBQUNSLFlBQVEsRUFBRSxJQUFJO0FBQ2QsZ0JBQVksRUFBRSxFQUFFO0dBQ2pCOzs7Ozs7OztBQVFELE1BQUksRUFBRSxJQUFJOzs7Ozs7OztBQVFWLE9BQUssRUFBRSxJQUFJOzs7Ozs7QUFNWCxLQUFHLEVBQUUsSUFBSTs7Ozs7OztBQU9ULGFBQVcsRUFBRSxJQUFJOzs7Ozs7O0FBT2pCLFVBQVEsRUFBRSxLQUFLOzs7Ozs7Ozs7OztBQVdmLE1BQUksRUFBQSxnQkFBc0M7UUFBckMsVUFBVSx5REFBRyxRQUFRO1FBQUUsT0FBTyx5REFBRyxFQUFFOztBQUN0QyxRQUFJLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQzs7QUFFdkIsUUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUM7O0FBRTdDLFFBQUksQ0FBQyxPQUFPLEdBQUcsZUFBYztBQUMzQixRQUFFLEVBQUUsSUFBSTtBQUNSLGFBQU8sRUFBRSxLQUFLO0FBQ2QsZUFBUyxFQUFFLFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxHQUFHLEVBQUU7QUFDdkMsZ0JBQVUsRUFBRSxRQUFRLEdBQUcsUUFBUSxDQUFDLFVBQVUsR0FBRyxDQUFDLFdBQVcsQ0FBQztBQUMxRCxrQkFBWSxFQUFFLFlBQVk7S0FDM0IsRUFBRSxPQUFPLENBQUMsQ0FBQzs7O0FBR1osUUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7QUFDdkIsUUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7O0FBRXBCLFFBQU0sWUFBWSxHQUFHLHdE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c3JjL2NsaWVudC9jbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQ2xpZW50TW9kdWxlIGZyb20gJy4vQ2xpZW50TW9kdWxlJztcbmltcG9ydCBjb21tIGZyb20gJy4vY29tbSc7XG5pbXBvcnQgZGVmYXVsdFRleHRDb250ZW50cyBmcm9tICcuL2Rpc3BsYXkvZGVmYXVsdFRleHRDb250ZW50cyc7XG5pbXBvcnQgZGVmYXVsdFRlbXBsYXRlcyBmcm9tICcuL2Rpc3BsYXkvZGVmYXVsdFRlbXBsYXRlcyc7XG5cblxuLyoqXG4gKiBUaGUgYGNsaWVudGAgb2JqZWN0IGNvbnRhaW5zIHRoZSBiYXNpYyBtZXRob2RzIGFuZCBhdHRyaWJ1dGVzIG9mIHRoZSBjbGllbnQuXG4gKiBAdHlwZSB7T2JqZWN0fVxuICovXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8qKlxuICAgKiBTb2NrZXQgdXNlZCB0byBjb21tdW5pY2F0ZSB3aXRoIHRoZSBzZXJ2ZXIsIGlmIGFueS5cbiAgICogQHR5cGUge1NvY2tldH1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNvbW06IG51bGwsXG5cbiAgLyoqXG4gICAqIEluZm9ybWF0aW9uIGFib3V0IHRoZSBjbGllbnQgcGxhdGZvcm0uXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBvcyBPcGVyYXRpbmcgc3lzdGVtLlxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGlzTW9iaWxlIEluZGljYXRlcyB3aGV0aGVyIHRoZSBjbGllbnQgaXMgcnVubmluZyBvbiBhXG4gICAqIG1vYmlsZSBwbGF0Zm9ybSBvciBub3QuXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBhdWRpb0ZpbGVFeHQgQXVkaW8gZmlsZSBleHRlbnNpb24gdG8gdXNlLCBkZXBlbmRpbmcgb25cbiAgICogdGhlIHBsYXRmb3JtICgpXG4gICAqL1xuICBwbGF0Zm9ybToge1xuICAgIG9zOiBudWxsLFxuICAgIGlzTW9iaWxlOiBudWxsLFxuICAgIGF1ZGlvRmlsZUV4dDogJycsXG4gIH0sXG5cbiAgLyoqXG4gICAqIENsaWVudCB0eXBlLlxuICAgKiBUaGUgY2xpZW50IHR5cGUgaXMgc3BlZmljaWVkIGluIHRoZSBhcmd1bWVudCBvZiB0aGUgYGluaXRgIG1ldGhvZC4gRm9yXG4gICAqIGluc3RhbmNlLCBgJ3BsYXllcidgIGlzIHRoZSBjbGllbnQgdHlwZSB5b3Ugc2hvdWxkIGJlIHVzaW5nIGJ5IGRlZmF1bHQuXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICB0eXBlOiBudWxsLFxuXG4gIC8qKlxuICAgKiBQcm9taXNlIHJlc29sdmVkIHdoZW4gdGhlIHNlcnZlciBzZW5kcyBhIG1lc3NhZ2UgaW5kaWNhdGluZyB0aGF0IHRoZSBjbGllbnRcbiAgICogY2FuIHN0YXJ0IHRoZSBmaXJzdCBtZHVsZS5cbiAgICogQHR5cGUge1Byb21pc2V9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZWFkeTogbnVsbCxcblxuICAvKipcbiAgICogQ2xpZW50IHVuaXF1ZSBpZCwgZ2l2ZW4gYnkgdGhlIHNlcnZlci5cbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHVpZDogbnVsbCxcblxuICAvKipcbiAgICogQ2xpZW50IGNvb3JkaW5hdGVzIChpZiBhbnkpIGdpdmVuIGJ5IGEge0BsaW5rIExvY2F0b3J9LCB7QGxpbmsgUGxhY2VyfSBvclxuICAgKiB7QGxpbmsgQ2hlY2tpbn0gbW9kdWxlLiAoRm9ybWF0OiBgW3g6TnVtYmVyLCB5Ok51bWJlcl1gLilcbiAgICogQHR5cGUge051bWJlcltdfVxuICAgKi9cbiAgY29vcmRpbmF0ZXM6IG51bGwsXG5cbiAgLyoqXG4gICAqIElzIHNldCB0byBgdHJ1ZWAgYnkgdGhlIGBXZWxjb21lYCBtb2R1bGUgd2hlbiB0aGUgY2xpZW50IGRvZXMgbm90IG1lZXQgdGhlIHJlcXVpcmVtZW50cy5cbiAgICogRXNwZWNpYWxseSB1c2VmdWxsIHdoZW4gdGhlIG1vZHVsZSBpcyB1c2VkIHdpdGhvdXQgYSB2aWV3IGFuZCBhY3RpdmF0ZWQgbWFudWFsbHkuXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKi9cbiAgcmVqZWN0ZWQ6IGZhbHNlLFxuXG4gIC8qKlxuICAgKiBUaGUgYGluaXRgIG1ldGhvZCBzZXRzIHRoZSBjbGllbnQgdHlwZSBhbmQgaW5pdGlhbGl6ZXMgYSBXZWJTb2NrZXQgY29ubmVjdGlvbiBhc3NvY2lhdGVkIHdpdGggdGhlIGdpdmVuIHR5cGUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbY2xpZW50VHlwZSA9ICdwbGF5ZXInXSBUaGUgY2xpZW50IHR5cGUuXG4gICAqIEB0b2RvIGNsYXJpZnkgY2xpZW50VHlwZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zID0ge31dIFRoZSBvcHRpb25zIHRvIGluaXRpYWxpemUgYSBjbGllbnRcbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5pb10gQnkgZGVmYXVsdCwgYSBTb3VuZHdvcmtzIGFwcGxpY2F0aW9uIGhhcyBhIGNsaWVudCBhbmQgYSBzZXJ2ZXIgc2lkZS4gRm9yIGEgc3RhbmRhbG9uZSBhcHBsaWNhdGlvbiAoY2xpZW50IHNpZGUgb25seSksIHVzZSBgb3B0aW9ucy5pbyA9IGZhbHNlYC5cbiAgICogQHRvZG8gdXNlIGRlZmF1bHQgdmFsdWUgZm9yIG9wdGlvbnMuaW8gaW4gdGhlIGRvY3VtZW50YXRpb24/XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9uZGVmYXVsdFRleHRDb250ZW50c3Muc29ja2V0VXJsXSBUaGUgVVJMIG9mIHRoZSBXZWJTb2NrZXQgc2VydmVyLlxuICAgKi9cbiAgaW5pdChjbGllbnRUeXBlID0gJ3BsYXllcicsIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMudHlwZSA9IGNsaWVudFR5cGU7XG5cbiAgICBjb25zdCBzb2NrZXRJTyA9IHdpbmRvdy5DT05GSUcuU09DS0VUX0NPTkZJRzsgLy8gc2hhcmVkIGJ5IHNlcnZlciAoY2YgLmVqcyB0ZW1wbGF0ZSlcbiAgICAvLyBAdG9kbyBoYXJtb25pemUgaW8gY29uZmlnIHdpdGggc2VydmVyXG4gICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICBpbzogdHJ1ZSxcbiAgICAgIGRlYnVnSU86IGZhbHNlLFxuICAgICAgc29ja2V0VXJsOiBzb2NrZXRJTyA/IHNvY2tldElPLnVybCA6wqAnJyxcbiAgICAgIHRyYW5zcG9ydHM6IHNvY2tldElPID8gc29ja2V0SU8udHJhbnNwb3J0cyA6wqBbJ3dlYnNvY2tldCddLFxuICAgICAgYXBwQ29udGFpbmVyOiAnI2NvbnRhaW5lcicsXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICAvLyBpbml0aWFsaXplIG1vZHVsZXMgdmlld3Mgd2l0aCBkZWZhdWx0IHRleHRzIGFuZCB0ZW1wbGF0ZXNcbiAgICB0aGlzLnRleHRDb250ZW50cyA9IHt9O1xuICAgIHRoaXMudGVtcGxhdGVzID0ge307XG5cbiAgICBjb25zdCB0ZXh0Q29udGVudHMgPSBPYmplY3QuYXNzaWduKGRlZmF1bHRUZXh0Q29udGVudHMsIHtcbiAgICAgIGdsb2JhbHM6IHsgYXBwTmFtZTogd2luZG93LkNPTkZJRy5BUFBfTkFNRSB9XG4gICAgfSk7XG5cbiAgICB0aGlzLnNldFZpZXdDb250ZW50RGVmaW5pdGlvbnModGV4dENvbnRlbnRzKTtcbiAgICB0aGlzLnNldFZpZXdUZW1wbGF0ZURlZmluaXRpb25zKGRlZmF1bHRUZW1wbGF0ZXMpO1xuICAgIHRoaXMuc2V0QXBwQ29udGFpbmVyKHRoaXMub3B0aW9ucy5hcHBDb250YWluZXIpO1xuXG4gICAgLy8gZGVidWcgLSBodHRwOi8vc29ja2V0LmlvL2RvY3MvbG9nZ2luZy1hbmQtZGVidWdnaW5nLyNhdmFpbGFibGUtZGVidWdnaW5nLXNjb3Blc1xuICAgIGlmICh0aGlzLm9wdGlvbnMuZGVidWdJTykge1xuICAgICAgbG9jYWxTdG9yYWdlLmRlYnVnID0gJyonO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogU3RhcnQgdGhlIG1vZHVsZSBsb2dpYyAoKmkuZS4qIHRoZSBhcHBsaWNhdGlvbikuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IHN0YXJ0RnVuIC0gW0B0b2RvIENsYXJpZnkgdGhlIHBhcmFtXVxuICAgKiBAcmV0dXJuIHtQcm9taXNlfSAtIFRoZSBQcm9taXNlIHJldHVybiB2YWx1ZSBbQHRvZG8gQ2xhcmlmeSB0aGUgcGFyYW1dLlxuICAgKiBAdG9kbyBleGFtcGxlXG4gICAqL1xuICBzdGFydChzdGFydEZ1bikge1xuICAgIGxldCBtb2R1bGUgPSBzdGFydEZ1bjsgLy8gZmFjYWRlIGluIGNhc2Ugb2Ygb25lIG1vZHVsZSBvbmx5XG5cbiAgICBpZiAodHlwZW9mIHN0YXJ0RnVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBtb2R1bGUgPSBzdGFydEZ1bihDbGllbnRNb2R1bGUuc2VxdWVudGlhbCwgQ2xpZW50TW9kdWxlLnBhcmFsbGVsKTtcbiAgICB9XG5cbiAgICBsZXQgcHJvbWlzZSA9IG1vZHVsZS5jcmVhdGVQcm9taXNlKCk7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmlvICE9PSBmYWxzZSkge1xuICAgICAgLy8gaW5pdGlhbGl6ZSBzb2NrZXQgY29tbXVuaWNhdGlvbnNcbiAgICAgIHRoaXMuY29tbSA9IGNvbW0uaW5pdGlhbGl6ZSh0aGlzLnR5cGUsIHRoaXMub3B0aW9ucyk7XG4gICAgICAvLyB3YWl0IGZvciBzb2NrZXQgYmVpbmcgcmVhZHkgdG8gcmVzb2x2ZSB0aGlzIG1vZHVsZVxuICAgICAgdGhpcy5jb21tLnJlY2VpdmUoJ2NsaWVudDpzdGFydCcsICh1aWQpID0+IHtcbiAgICAgICAgaWYgKHRoaXMudWlkKSB7XG4gICAgICAgICAgY29uc29sZS5pbmZvKCc9PT09PT09PT0+IHJlY29ubmVjdDpyZWxvYWQnKTtcbiAgICAgICAgICAvLyB3aW5kb3cubG9jYXRpb24ucmVsb2FkKGZhbHNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudWlkID0gdWlkO1xuICAgICAgICBtb2R1bGUubGF1bmNoKCk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5jb21tLnJlY2VpdmUoJ3JlY29ubmVjdCcsICgpID0+IHtcbiAgICAgICAgY29uc29sZS5pbmZvKCc9PT09PT09PT0+IHJlY29ubmVjdCcpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuY29tbS5yZWNlaXZlKCdkaXNjb25uZWN0JywgKCkgPT4ge1xuICAgICAgICBjb25zb2xlLmluZm8oJz09PT09PT09PT4gZGlzY29ubmVjdCcpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuY29tbS5yZWNlaXZlKCdlcnJvcicsIChlcnIpID0+IHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1vZHVsZS5sYXVuY2goKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfSxcblxuICAvKipcbiAgICogRXh0ZW5kIGFwcGxpY2F0aW9uIHRleHQgY29udGVudHMgd2l0aCB0aGUgZ2l2ZW4gb2JqZWN0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGVudHMgLSBUaGUgdGV4dCBjb250ZW50cyB0byBwcm9wYWdhdGUgdG8gbW9kdWxlcy5cbiAgICovXG4gIHNldFZpZXdDb250ZW50RGVmaW5pdGlvbnMoZGVmcykge1xuICAgIHRoaXMudGV4dENvbnRlbnRzID0gT2JqZWN0LmFzc2lnbih0aGlzLnRleHRDb250ZW50cywgZGVmcyk7XG4gICAgQ2xpZW50TW9kdWxlLnNldFZpZXdDb250ZW50RGVmaW5pdGlvbnModGhpcy50ZXh0Q29udGVudHMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBFeHRlbmQgYXBwbGljYXRpb24gdGVtcGxhdGVzIHdpdGggdGhlIGdpdmVuIG9iamVjdC5cbiAgICogQHBhcmFtIHtPYmplY3R9IHRlbXBsYXRlcyAtIFRoZSB0ZW1wbGF0ZXMgdG8gcHJvcGFnYXRlIHRvIG1vZHVsZXMuXG4gICAqL1xuICBzZXRWaWV3VGVtcGxhdGVEZWZpbml0aW9ucyhkZWZzKSB7XG4gICAgdGhpcy50ZW1wbGF0ZXMgPSBPYmplY3QuYXNzaWduKHRoaXMudGVtcGxhdGVzLCBkZWZzKTtcbiAgICBDbGllbnRNb2R1bGUuc2V0Vmlld1RlbXBsYXRlRGVmaW5pdGlvbnModGhpcy50ZW1wbGF0ZXMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBkZWZhdWx0IHZpZXcgY29udGFpbmVyIGZvciBhbGwgYENsaWVudE1vZHVsZWBzXG4gICAqIEBwYXJhbSB7U3RyaW5nfEVsZW1lbnR9IGVsIC0gQSBET00gZWxlbWVudCBvciBhIGNzcyBzZWxlY3RvciBtYXRjaGluZyB0aGUgZWxlbWVudCB0byB1c2UgYXMgYSBjb250YWluZXIuXG4gICAqL1xuICBzZXRBcHBDb250YWluZXIoZWwpIHtcbiAgICBjb25zdCAkY29udGFpbmVyID0gZWwgaW5zdGFuY2VvZiBFbGVtZW50ID8gZWwgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsKTtcbiAgICBDbGllbnRNb2R1bGUuc2V0Vmlld0NvbnRhaW5lcigkY29udGFpbmVyKTtcbiAgfSxcblxufTtcblxuIl19