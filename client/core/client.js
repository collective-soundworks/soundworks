'use strict';

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _Signal = require('./Signal');

var _Signal2 = _interopRequireDefault(_Signal);

var _Activity = require('./Activity');

var _Activity2 = _interopRequireDefault(_Activity);

var _serviceManager = require('./serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

var _viewManager = require('./viewManager');

var _viewManager2 = _interopRequireDefault(_viewManager);

var _socket = require('./socket');

var _socket2 = _interopRequireDefault(_socket);

var _displayDefaultTextContents = require('../display/defaultTextContents');

var _displayDefaultTextContents2 = _interopRequireDefault(_displayDefaultTextContents);

var _displayDefaultTemplates = require('../display/defaultTemplates');

var _displayDefaultTemplates2 = _interopRequireDefault(_displayDefaultTemplates);

var client = {
  /**
   * The {@link Signal} used to bootstrap the whole application.
   * @type {Signal}
   * @private
   */
  // signals: { ready: new Signal() },

  /**
  * Socket.io wrapper used to communicate with the server, if any (see {@link socket}.
  * @type {object}
  * @private
  */
  socket: null,

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
   * Is set to `true` or `false` by the `Welcome` service and defines if the client meet the requirements of the application.
   * Especially usefull when the `Welcome` service is used without a view and activated manually.
   * @type {Boolean}
   */
  compatible: null,

  /**
   * Initialize the application.
   * @param {String} [clientType = 'player'] - The client type to define the socket namespace, should match a client type defined server side (if any).
   * @param {Object} [options={}] - The options to initialize a client
   * @param {Object} [options.socketIO.url=''] - The url where the socket should connect.
   * @param {Object} [options.socketIO.transports=['websocket']] - The transport used to create the url (overrides default socket.io mecanism).
   * @param {Object} [options.appContainer='#container'] - A selector matching a DOM element where the views should be inserted.
   * @param {Object} [options.debugIO=false] - If set to `true`, show socket.io debug informations.
   */
  init: function init() {
    var clientType = arguments.length <= 0 || arguments[0] === undefined ? 'player' : arguments[0];
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    console.log('client:init');
    this.type = clientType;

    // 1. if socket options given, mix it with defaults.
    var socketIO = _Object$assign({
      url: '',
      transports: ['websocket']
    }, options.socketIO);

    // 2. mix all other options and override with defined socket options.
    this.options = _Object$assign({
      debugIO: false,
      appContainer: '#container'
    }, options, { socketIO: socketIO });

    _serviceManager2['default'].init();
    this._initViews();
  },

  /**
   * * Initialize the application.
   */
  start: function start() {
    console.log('client:start', '--- socket: ' + _socket2['default'].required);
    // init socket
    if (_socket2['default'].required) this._initSocket();else _serviceManager2['default'].start();
  },

  /**
   * @todo - refactor handshake.
   * Initialize socket connection and perform handshake with the server.
   */
  _initSocket: function _initSocket() {
    var _this = this;

    // initialize socket communications
    this.socket = _socket2['default'].initialize(this.type, this.options.socketIO);
    // wait for handshake to mark client as `ready`
    this.socket.receive('client:start', function (uid) {
      // don't handle server restart for now.
      _this.uid = uid;
      _serviceManager2['default'].start();

      // this.comm.receive('reconnect', () => console.info('reconnect'));
      // this.comm.receive('disconnect', () => {
      //   console.info('disconnect')
      //   serviceManager.reset(); // can relaunch serviceManager on reconnection.
      // });
      // this.comm.receive('error', (err) => console.error(err));
    });
  },

  /**
   * Initialize templates for all
   */
  _initViews: function _initViews() {
    // initialize modules views with default texts and templates
    this.textContents = {};
    this.templates = {};

    var appName = this.options.appName || _displayDefaultTextContents2['default'].globals.appName;
    var textContents = _Object$assign(_displayDefaultTextContents2['default'], {
      globals: { appName: appName }
    });

    this.setViewContentDefinitions(textContents);
    this.setViewTemplateDefinitions(_displayDefaultTemplates2['default']);
    this.setAppContainer(this.options.appContainer);
  },

  /**
   * Extend application text contents with the given object.
   * @param {Object} contents - The text contents to propagate to modules.
   */
  setViewContentDefinitions: function setViewContentDefinitions(defs) {
    this.textContents = _Object$assign(this.textContents, defs);
    _Activity2['default'].setViewContentDefinitions(this.textContents);
  },

  /**
   * Extend application templates with the given object.
   * @param {Object} templates - The templates to propagate to modules.
   */
  setViewTemplateDefinitions: function setViewTemplateDefinitions(defs) {
    this.templates = _Object$assign(this.templates, defs);
    _Activity2['default'].setViewTemplateDefinitions(this.templates);
  },

  /**
   * Sets the default view container for all `ClientModule`s
   * @param {String|Element} el - A DOM element or a css selector matching the element to use as a container.
   */
  setAppContainer: function setAppContainer(el) {
    var $container = el instanceof Element ? el : document.querySelector(el);
    _viewManager2['default'].setViewContainer($container);
  }

};

exports['default'] = client;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvY29yZS9jbGllbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztzQkFBbUIsVUFBVTs7Ozt3QkFDUixZQUFZOzs7OzhCQUNOLGtCQUFrQjs7OzsyQkFDckIsZUFBZTs7OztzQkFDcEIsVUFBVTs7OzswQ0FDRyxnQ0FBZ0M7Ozs7dUNBQ25DLDZCQUE2Qjs7OztBQUcxRCxJQUFNLE1BQU0sR0FBRzs7Ozs7Ozs7Ozs7OztBQWFiLFFBQU0sRUFBRSxJQUFJOzs7Ozs7Ozs7OztBQVdaLFVBQVEsRUFBRTtBQUNSLE1BQUUsRUFBRSxJQUFJO0FBQ1IsWUFBUSxFQUFFLElBQUk7QUFDZCxnQkFBWSxFQUFFLEVBQUU7R0FDakI7Ozs7Ozs7O0FBUUQsTUFBSSxFQUFFLElBQUk7Ozs7Ozs7O0FBUVYsT0FBSyxFQUFFLElBQUk7Ozs7OztBQU1YLEtBQUcsRUFBRSxJQUFJOzs7Ozs7O0FBT1QsYUFBVyxFQUFFLElBQUk7Ozs7Ozs7QUFPakIsWUFBVSxFQUFFLElBQUk7Ozs7Ozs7Ozs7O0FBV2hCLE1BQUksRUFBQSxnQkFBc0M7UUFBckMsVUFBVSx5REFBRyxRQUFRO1FBQUUsT0FBTyx5REFBRyxFQUFFOztBQUN0QyxXQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQzNCLFFBQUksQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDOzs7QUFHdkIsUUFBTSxRQUFRLEdBQUcsZUFBYztBQUM3QixTQUFHLEVBQUUsRUFBRTtBQUNQLGdCQUFVLEVBQUUsQ0FBQyxXQUFXLENBQUM7S0FDMUIsRUFBRSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7OztBQUdyQixRQUFJLENBQUMsT0FBTyxHQUFHLGVBQWM7QUFDM0IsYUFBTyxFQUFFLEtBQUs7QUFDZCxrQkFBWSxFQUFFLFlBQVk7S0FDM0IsRUFBRSxPQUFPLEVBQUUsRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLENBQUMsQ0FBQzs7QUFFMUIsZ0NBQWUsSUFBSSxFQUFFLENBQUM7QUFDdEIsUUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0dBQ25COzs7OztBQUtELE9BQUssRUFBQSxpQkFBRztBQUNOLFdBQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxtQkFBaUIsb0JBQU8sUUFBUSxDQUFHLENBQUM7O0FBRTlELFFBQUksb0JBQU8sUUFBUSxFQUNqQixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsS0FFbkIsNEJBQWUsS0FBSyxFQUFFLENBQUM7R0FDMUI7Ozs7OztBQU1ELGFBQVcsRUFBQSx1QkFBRzs7OztBQUVaLFFBQUksQ0FBQyxNQUFNLEdBQUcsb0JBQU8sVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFbEUsUUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLFVBQUMsR0FBRyxFQUFLOztBQUUzQyxZQUFLLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDZixrQ0FBZSxLQUFLLEVBQUUsQ0FBQzs7Ozs7Ozs7S0FReEIsQ0FBQyxDQUFDO0dBQ0o7Ozs7O0FBS0QsWUFBVSxFQUFBLHNCQUFHOztBQUVYLFFBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLFFBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDOztBQUVwQixRQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sSUFBSSx3Q0FBb0IsT0FBTyxDQUFDLE9BQU8sQ0FBQztBQUM1RSxRQUFNLFlBQVksR0FBRyx3REFBbUM7QUFDdEQsYUFBTyxFQUFFLEVBQUUsT0FBTyxFQUFQLE9BQU8sRUFBRTtLQUNyQixDQUFDLENBQUM7O0FBRUgsUUFBSSxDQUFDLHlCQUF5QixDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzdDLFFBQUksQ0FBQywwQkFBMEIsc0NBQWtCLENBQUM7QUFDbEQsUUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0dBQ2pEOzs7Ozs7QUFNRCwyQkFBeUIsRUFBQSxtQ0FBQyxJQUFJLEVBQUU7QUFDOUIsUUFBSSxDQUFDLFlBQVksR0FBRyxlQUFjLElBQUksQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDM0QsMEJBQVMseUJBQXlCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0dBQ3ZEOzs7Ozs7QUFNRCw0QkFBMEIsRUFBQSxvQ0FBQyxJQUFJLEVBQUU7QUFDL0IsUUFBSSxDQUFDLFNBQVMsR0FBRyxlQUFjLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDckQsMEJBQVMsMEJBQTBCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0dBQ3JEOzs7Ozs7QUFNRCxpQkFBZSxFQUFBLHlCQUFDLEVBQUUsRUFBRTtBQUNsQixRQUFNLFVBQVUsR0FBRyxFQUFFLFlBQVksT0FBTyxHQUFHLEVBQUUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzNFLDZCQUFZLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0dBQzFDOztDQUVGLENBQUM7O3FCQUVhLE1BQU0iLCJmaWxlIjoic3JjL2NsaWVudC9jb3JlL2NsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTaWduYWwgZnJvbSAnLi9TaWduYWwnO1xuaW1wb3J0IEFjdGl2aXR5IGZyb20gJy4vQWN0aXZpdHknO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4vc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IHZpZXdNYW5hZ2VyIGZyb20gJy4vdmlld01hbmFnZXInO1xuaW1wb3J0IHNvY2tldCBmcm9tICcuL3NvY2tldCc7XG5pbXBvcnQgZGVmYXVsdFRleHRDb250ZW50cyBmcm9tICcuLi9kaXNwbGF5L2RlZmF1bHRUZXh0Q29udGVudHMnO1xuaW1wb3J0IGRlZmF1bHRUZW1wbGF0ZXMgZnJvbSAnLi4vZGlzcGxheS9kZWZhdWx0VGVtcGxhdGVzJztcblxuXG5jb25zdCBjbGllbnQgPSB7XG4gIC8qKlxuICAgKiBUaGUge0BsaW5rIFNpZ25hbH0gdXNlZCB0byBib290c3RyYXAgdGhlIHdob2xlIGFwcGxpY2F0aW9uLlxuICAgKiBAdHlwZSB7U2lnbmFsfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgLy8gc2lnbmFsczogeyByZWFkeTogbmV3IFNpZ25hbCgpIH0sXG5cbiAgIC8qKlxuICAgKiBTb2NrZXQuaW8gd3JhcHBlciB1c2VkIHRvIGNvbW11bmljYXRlIHdpdGggdGhlIHNlcnZlciwgaWYgYW55IChzZWUge0BsaW5rIHNvY2tldH0uXG4gICAqIEB0eXBlIHtvYmplY3R9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzb2NrZXQ6IG51bGwsXG5cbiAgLyoqXG4gICAqIEluZm9ybWF0aW9uIGFib3V0IHRoZSBjbGllbnQgcGxhdGZvcm0uXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBvcyBPcGVyYXRpbmcgc3lzdGVtLlxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGlzTW9iaWxlIEluZGljYXRlcyB3aGV0aGVyIHRoZSBjbGllbnQgaXMgcnVubmluZyBvbiBhXG4gICAqIG1vYmlsZSBwbGF0Zm9ybSBvciBub3QuXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBhdWRpb0ZpbGVFeHQgQXVkaW8gZmlsZSBleHRlbnNpb24gdG8gdXNlLCBkZXBlbmRpbmcgb25cbiAgICogdGhlIHBsYXRmb3JtICgpXG4gICAqL1xuICBwbGF0Zm9ybToge1xuICAgIG9zOiBudWxsLFxuICAgIGlzTW9iaWxlOiBudWxsLFxuICAgIGF1ZGlvRmlsZUV4dDogJycsXG4gIH0sXG5cbiAgLyoqXG4gICAqIENsaWVudCB0eXBlLlxuICAgKiBUaGUgY2xpZW50IHR5cGUgaXMgc3BlZmljaWVkIGluIHRoZSBhcmd1bWVudCBvZiB0aGUgYGluaXRgIG1ldGhvZC4gRm9yXG4gICAqIGluc3RhbmNlLCBgJ3BsYXllcidgIGlzIHRoZSBjbGllbnQgdHlwZSB5b3Ugc2hvdWxkIGJlIHVzaW5nIGJ5IGRlZmF1bHQuXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICB0eXBlOiBudWxsLFxuXG4gIC8qKlxuICAgKiBQcm9taXNlIHJlc29sdmVkIHdoZW4gdGhlIHNlcnZlciBzZW5kcyBhIG1lc3NhZ2UgaW5kaWNhdGluZyB0aGF0IHRoZSBjbGllbnRcbiAgICogY2FuIHN0YXJ0IHRoZSBmaXJzdCBtZHVsZS5cbiAgICogQHR5cGUge1Byb21pc2V9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZWFkeTogbnVsbCxcblxuICAvKipcbiAgICogQ2xpZW50IHVuaXF1ZSBpZCwgZ2l2ZW4gYnkgdGhlIHNlcnZlci5cbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHVpZDogbnVsbCxcblxuICAvKipcbiAgICogQ2xpZW50IGNvb3JkaW5hdGVzIChpZiBhbnkpIGdpdmVuIGJ5IGEge0BsaW5rIExvY2F0b3J9LCB7QGxpbmsgUGxhY2VyfSBvclxuICAgKiB7QGxpbmsgQ2hlY2tpbn0gbW9kdWxlLiAoRm9ybWF0OiBgW3g6TnVtYmVyLCB5Ok51bWJlcl1gLilcbiAgICogQHR5cGUge051bWJlcltdfVxuICAgKi9cbiAgY29vcmRpbmF0ZXM6IG51bGwsXG5cbiAgLyoqXG4gICAqIElzIHNldCB0byBgdHJ1ZWAgb3IgYGZhbHNlYCBieSB0aGUgYFdlbGNvbWVgIHNlcnZpY2UgYW5kIGRlZmluZXMgaWYgdGhlIGNsaWVudCBtZWV0IHRoZSByZXF1aXJlbWVudHMgb2YgdGhlIGFwcGxpY2F0aW9uLlxuICAgKiBFc3BlY2lhbGx5IHVzZWZ1bGwgd2hlbiB0aGUgYFdlbGNvbWVgIHNlcnZpY2UgaXMgdXNlZCB3aXRob3V0IGEgdmlldyBhbmQgYWN0aXZhdGVkIG1hbnVhbGx5LlxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICovXG4gIGNvbXBhdGlibGU6IG51bGwsXG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIGFwcGxpY2F0aW9uLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW2NsaWVudFR5cGUgPSAncGxheWVyJ10gLSBUaGUgY2xpZW50IHR5cGUgdG8gZGVmaW5lIHRoZSBzb2NrZXQgbmFtZXNwYWNlLCBzaG91bGQgbWF0Y2ggYSBjbGllbnQgdHlwZSBkZWZpbmVkIHNlcnZlciBzaWRlIChpZiBhbnkpLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIC0gVGhlIG9wdGlvbnMgdG8gaW5pdGlhbGl6ZSBhIGNsaWVudFxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMuc29ja2V0SU8udXJsPScnXSAtIFRoZSB1cmwgd2hlcmUgdGhlIHNvY2tldCBzaG91bGQgY29ubmVjdC5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLnNvY2tldElPLnRyYW5zcG9ydHM9Wyd3ZWJzb2NrZXQnXV0gLSBUaGUgdHJhbnNwb3J0IHVzZWQgdG8gY3JlYXRlIHRoZSB1cmwgKG92ZXJyaWRlcyBkZWZhdWx0IHNvY2tldC5pbyBtZWNhbmlzbSkuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5hcHBDb250YWluZXI9JyNjb250YWluZXInXSAtIEEgc2VsZWN0b3IgbWF0Y2hpbmcgYSBET00gZWxlbWVudCB3aGVyZSB0aGUgdmlld3Mgc2hvdWxkIGJlIGluc2VydGVkLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMuZGVidWdJTz1mYWxzZV0gLSBJZiBzZXQgdG8gYHRydWVgLCBzaG93IHNvY2tldC5pbyBkZWJ1ZyBpbmZvcm1hdGlvbnMuXG4gICAqL1xuICBpbml0KGNsaWVudFR5cGUgPSAncGxheWVyJywgb3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc29sZS5sb2coJ2NsaWVudDppbml0Jyk7XG4gICAgdGhpcy50eXBlID0gY2xpZW50VHlwZTtcblxuICAgIC8vIDEuIGlmIHNvY2tldCBvcHRpb25zIGdpdmVuLCBtaXggaXQgd2l0aCBkZWZhdWx0cy5cbiAgICBjb25zdCBzb2NrZXRJTyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgdXJsOiAnJyxcbiAgICAgIHRyYW5zcG9ydHM6IFsnd2Vic29ja2V0J11cbiAgICB9LCBvcHRpb25zLnNvY2tldElPKTtcblxuICAgIC8vIDIuIG1peCBhbGwgb3RoZXIgb3B0aW9ucyBhbmQgb3ZlcnJpZGUgd2l0aCBkZWZpbmVkIHNvY2tldCBvcHRpb25zLlxuICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgZGVidWdJTzogZmFsc2UsXG4gICAgICBhcHBDb250YWluZXI6ICcjY29udGFpbmVyJyxcbiAgICB9LCBvcHRpb25zLCB7IHNvY2tldElPIH0pO1xuXG4gICAgc2VydmljZU1hbmFnZXIuaW5pdCgpO1xuICAgIHRoaXMuX2luaXRWaWV3cygpO1xuICB9LFxuXG4gIC8qKlxuICAgKiAqIEluaXRpYWxpemUgdGhlIGFwcGxpY2F0aW9uLlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgY29uc29sZS5sb2coJ2NsaWVudDpzdGFydCcsIGAtLS0gc29ja2V0OiAke3NvY2tldC5yZXF1aXJlZH1gKTtcbiAgICAvLyBpbml0IHNvY2tldFxuICAgIGlmIChzb2NrZXQucmVxdWlyZWQpXG4gICAgICB0aGlzLl9pbml0U29ja2V0KCk7XG4gICAgZWxzZVxuICAgICAgc2VydmljZU1hbmFnZXIuc3RhcnQoKTtcbiAgfSxcblxuICAvKipcbiAgICogQHRvZG8gLSByZWZhY3RvciBoYW5kc2hha2UuXG4gICAqIEluaXRpYWxpemUgc29ja2V0IGNvbm5lY3Rpb24gYW5kIHBlcmZvcm0gaGFuZHNoYWtlIHdpdGggdGhlIHNlcnZlci5cbiAgICovXG4gIF9pbml0U29ja2V0KCkge1xuICAgIC8vIGluaXRpYWxpemUgc29ja2V0IGNvbW11bmljYXRpb25zXG4gICAgdGhpcy5zb2NrZXQgPSBzb2NrZXQuaW5pdGlhbGl6ZSh0aGlzLnR5cGUsIHRoaXMub3B0aW9ucy5zb2NrZXRJTyk7XG4gICAgLy8gd2FpdCBmb3IgaGFuZHNoYWtlIHRvIG1hcmsgY2xpZW50IGFzIGByZWFkeWBcbiAgICB0aGlzLnNvY2tldC5yZWNlaXZlKCdjbGllbnQ6c3RhcnQnLCAodWlkKSA9PiB7XG4gICAgICAvLyBkb24ndCBoYW5kbGUgc2VydmVyIHJlc3RhcnQgZm9yIG5vdy5cbiAgICAgIHRoaXMudWlkID0gdWlkO1xuICAgICAgc2VydmljZU1hbmFnZXIuc3RhcnQoKTtcblxuICAgICAgLy8gdGhpcy5jb21tLnJlY2VpdmUoJ3JlY29ubmVjdCcsICgpID0+IGNvbnNvbGUuaW5mbygncmVjb25uZWN0JykpO1xuICAgICAgLy8gdGhpcy5jb21tLnJlY2VpdmUoJ2Rpc2Nvbm5lY3QnLCAoKSA9PiB7XG4gICAgICAvLyAgIGNvbnNvbGUuaW5mbygnZGlzY29ubmVjdCcpXG4gICAgICAvLyAgIHNlcnZpY2VNYW5hZ2VyLnJlc2V0KCk7IC8vIGNhbiByZWxhdW5jaCBzZXJ2aWNlTWFuYWdlciBvbiByZWNvbm5lY3Rpb24uXG4gICAgICAvLyB9KTtcbiAgICAgIC8vIHRoaXMuY29tbS5yZWNlaXZlKCdlcnJvcicsIChlcnIpID0+IGNvbnNvbGUuZXJyb3IoZXJyKSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGVtcGxhdGVzIGZvciBhbGxcbiAgICovXG4gIF9pbml0Vmlld3MoKSB7XG4gICAgLy8gaW5pdGlhbGl6ZSBtb2R1bGVzIHZpZXdzIHdpdGggZGVmYXVsdCB0ZXh0cyBhbmQgdGVtcGxhdGVzXG4gICAgdGhpcy50ZXh0Q29udGVudHMgPSB7fTtcbiAgICB0aGlzLnRlbXBsYXRlcyA9IHt9O1xuXG4gICAgY29uc3QgYXBwTmFtZSA9IHRoaXMub3B0aW9ucy5hcHBOYW1lIHx8wqBkZWZhdWx0VGV4dENvbnRlbnRzLmdsb2JhbHMuYXBwTmFtZTtcbiAgICBjb25zdCB0ZXh0Q29udGVudHMgPSBPYmplY3QuYXNzaWduKGRlZmF1bHRUZXh0Q29udGVudHMsIHtcbiAgICAgIGdsb2JhbHM6IHsgYXBwTmFtZSB9XG4gICAgfSk7XG5cbiAgICB0aGlzLnNldFZpZXdDb250ZW50RGVmaW5pdGlvbnModGV4dENvbnRlbnRzKTtcbiAgICB0aGlzLnNldFZpZXdUZW1wbGF0ZURlZmluaXRpb25zKGRlZmF1bHRUZW1wbGF0ZXMpO1xuICAgIHRoaXMuc2V0QXBwQ29udGFpbmVyKHRoaXMub3B0aW9ucy5hcHBDb250YWluZXIpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBFeHRlbmQgYXBwbGljYXRpb24gdGV4dCBjb250ZW50cyB3aXRoIHRoZSBnaXZlbiBvYmplY3QuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZW50cyAtIFRoZSB0ZXh0IGNvbnRlbnRzIHRvIHByb3BhZ2F0ZSB0byBtb2R1bGVzLlxuICAgKi9cbiAgc2V0Vmlld0NvbnRlbnREZWZpbml0aW9ucyhkZWZzKSB7XG4gICAgdGhpcy50ZXh0Q29udGVudHMgPSBPYmplY3QuYXNzaWduKHRoaXMudGV4dENvbnRlbnRzLCBkZWZzKTtcbiAgICBBY3Rpdml0eS5zZXRWaWV3Q29udGVudERlZmluaXRpb25zKHRoaXMudGV4dENvbnRlbnRzKTtcbiAgfSxcblxuICAvKipcbiAgICogRXh0ZW5kIGFwcGxpY2F0aW9uIHRlbXBsYXRlcyB3aXRoIHRoZSBnaXZlbiBvYmplY3QuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB0ZW1wbGF0ZXMgLSBUaGUgdGVtcGxhdGVzIHRvIHByb3BhZ2F0ZSB0byBtb2R1bGVzLlxuICAgKi9cbiAgc2V0Vmlld1RlbXBsYXRlRGVmaW5pdGlvbnMoZGVmcykge1xuICAgIHRoaXMudGVtcGxhdGVzID0gT2JqZWN0LmFzc2lnbih0aGlzLnRlbXBsYXRlcywgZGVmcyk7XG4gICAgQWN0aXZpdHkuc2V0Vmlld1RlbXBsYXRlRGVmaW5pdGlvbnModGhpcy50ZW1wbGF0ZXMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBkZWZhdWx0IHZpZXcgY29udGFpbmVyIGZvciBhbGwgYENsaWVudE1vZHVsZWBzXG4gICAqIEBwYXJhbSB7U3RyaW5nfEVsZW1lbnR9IGVsIC0gQSBET00gZWxlbWVudCBvciBhIGNzcyBzZWxlY3RvciBtYXRjaGluZyB0aGUgZWxlbWVudCB0byB1c2UgYXMgYSBjb250YWluZXIuXG4gICAqL1xuICBzZXRBcHBDb250YWluZXIoZWwpIHtcbiAgICBjb25zdCAkY29udGFpbmVyID0gZWwgaW5zdGFuY2VvZiBFbGVtZW50ID8gZWwgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsKTtcbiAgICB2aWV3TWFuYWdlci5zZXRWaWV3Q29udGFpbmVyKCRjb250YWluZXIpO1xuICB9LFxuXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGllbnQ7XG4iXX0=