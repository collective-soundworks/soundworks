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
   * @type {Array<Number>}
   */
  coordinates: null,

  /**
   * Ticket index (if any) given by a {@link Placer} or
   * {@link Checkin} module.
   * @type {Number}
   */
  index: null,

  /**
   * Ticket label (if any) given by a {@link Placer} or
   * {@link Checkin} module.
   * @type {String}
   */
  label: null,

  /**
   * Is set to `true` or `false` by the `Welcome` service and defines if the client meet the requirements of the application.
   * Especially usefull when the `Welcome` service is used without a view and activated manually.
   * @type {Boolean}
   */
  compatible: null,

  /**
   * Initialize the application.
   * @param {String} [clientType = 'player'] - The client type to define the socket namespace, should match a client type defined server side (if any).
   * @param {Object} [config={}] - The config to initialize a client
   * @param {Object} [config.socketIO.url=''] - The url where the socket should connect.
   * @param {Object} [config.socketIO.transports=['websocket']] - The transport used to create the url (overrides default socket.io mecanism).
   * @param {Object} [config.appContainer='#container'] - A selector matching a DOM element where the views should be inserted.
   * @param {Object} [config.debugIO=false] - If set to `true`, show socket.io debug informations.
   */
  init: function init() {
    var clientType = arguments.length <= 0 || arguments[0] === undefined ? 'player' : arguments[0];
    var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    this.type = clientType;

    // 1. if socket config given, mix it with defaults.
    var socketIO = _Object$assign({
      url: '',
      transports: ['websocket']
    }, config.socketIO);

    // 2. mix all other config and override with defined socket config.
    this.config = _Object$assign({
      debugIO: false,
      appContainer: '#container'
    }, config, { socketIO: socketIO });

    _serviceManager2['default'].init();
    this._initViews();
  },

  /**
   * * Initialize the application.
   */
  start: function start() {
    // init socket
    if (_socket2['default'].required) this._initSocket();else _serviceManager2['default'].start();
  },

  /**
   * Returns a service configured with the given options.
   * @param {String} id - The identifier of the service.
   * @param {Object} options - The options to configure the service.
   */
  require: function require(id, options) {
    return _serviceManager2['default'].require(id, options);
  },

  /**
   * @todo - refactor handshake.
   * Initialize socket connection and perform handshake with the server.
   */
  _initSocket: function _initSocket() {
    var _this = this;

    // initialize socket communications
    this.socket = _socket2['default'].initialize(this.type, this.config.socketIO);
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

    var appName = this.config.appName || _displayDefaultTextContents2['default'].globals.appName;
    var textContents = _Object$assign(_displayDefaultTextContents2['default'], {
      globals: { appName: appName }
    });

    this.setViewContentDefinitions(textContents);
    this.setViewTemplateDefinitions(_displayDefaultTemplates2['default']);
    this.setAppContainer(this.config.appContainer);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvY29yZS9jbGllbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztzQkFBbUIsVUFBVTs7Ozt3QkFDUixZQUFZOzs7OzhCQUNOLGtCQUFrQjs7OzsyQkFDckIsZUFBZTs7OztzQkFDcEIsVUFBVTs7OzswQ0FDRyxnQ0FBZ0M7Ozs7dUNBQ25DLDZCQUE2Qjs7OztBQUcxRCxJQUFNLE1BQU0sR0FBRzs7Ozs7Ozs7Ozs7OztBQWFiLFFBQU0sRUFBRSxJQUFJOzs7Ozs7Ozs7OztBQVdaLFVBQVEsRUFBRTtBQUNSLE1BQUUsRUFBRSxJQUFJO0FBQ1IsWUFBUSxFQUFFLElBQUk7QUFDZCxnQkFBWSxFQUFFLEVBQUU7R0FDakI7Ozs7Ozs7O0FBUUQsTUFBSSxFQUFFLElBQUk7Ozs7Ozs7O0FBUVYsT0FBSyxFQUFFLElBQUk7Ozs7OztBQU1YLEtBQUcsRUFBRSxJQUFJOzs7Ozs7O0FBT1QsYUFBVyxFQUFFLElBQUk7Ozs7Ozs7QUFPakIsT0FBSyxFQUFFLElBQUk7Ozs7Ozs7QUFPWCxPQUFLLEVBQUUsSUFBSTs7Ozs7OztBQU9YLFlBQVUsRUFBRSxJQUFJOzs7Ozs7Ozs7OztBQVdoQixNQUFJLEVBQUEsZ0JBQXFDO1FBQXBDLFVBQVUseURBQUcsUUFBUTtRQUFFLE1BQU0seURBQUcsRUFBRTs7QUFDckMsUUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7OztBQUd2QixRQUFNLFFBQVEsR0FBRyxlQUFjO0FBQzdCLFNBQUcsRUFBRSxFQUFFO0FBQ1AsZ0JBQVUsRUFBRSxDQUFDLFdBQVcsQ0FBQztLQUMxQixFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQzs7O0FBR3BCLFFBQUksQ0FBQyxNQUFNLEdBQUcsZUFBYztBQUMxQixhQUFPLEVBQUUsS0FBSztBQUNkLGtCQUFZLEVBQUUsWUFBWTtLQUMzQixFQUFFLE1BQU0sRUFBRSxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsQ0FBQyxDQUFDOztBQUV6QixnQ0FBZSxJQUFJLEVBQUUsQ0FBQztBQUN0QixRQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7R0FDbkI7Ozs7O0FBS0QsT0FBSyxFQUFBLGlCQUFHOztBQUVOLFFBQUksb0JBQU8sUUFBUSxFQUNqQixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsS0FFbkIsNEJBQWUsS0FBSyxFQUFFLENBQUM7R0FDMUI7Ozs7Ozs7QUFPRCxTQUFPLEVBQUEsaUJBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRTtBQUNuQixXQUFPLDRCQUFlLE9BQU8sQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7R0FDNUM7Ozs7OztBQU1ELGFBQVcsRUFBQSx1QkFBRzs7OztBQUVaLFFBQUksQ0FBQyxNQUFNLEdBQUcsb0JBQU8sVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFakUsUUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLFVBQUMsR0FBRyxFQUFLOztBQUUzQyxZQUFLLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDZixrQ0FBZSxLQUFLLEVBQUUsQ0FBQzs7Ozs7Ozs7S0FReEIsQ0FBQyxDQUFDO0dBQ0o7Ozs7O0FBS0QsWUFBVSxFQUFBLHNCQUFHOztBQUVYLFFBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLFFBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDOztBQUVwQixRQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sSUFBSSx3Q0FBb0IsT0FBTyxDQUFDLE9BQU8sQ0FBQztBQUMzRSxRQUFNLFlBQVksR0FBRyx3REFBbUM7QUFDdEQsYUFBTyxFQUFFLEVBQUUsT0FBTyxFQUFQLE9BQU8sRUFBRTtLQUNyQixDQUFDLENBQUM7O0FBRUgsUUFBSSxDQUFDLHlCQUF5QixDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzdDLFFBQUksQ0FBQywwQkFBMEIsc0NBQWtCLENBQUM7QUFDbEQsUUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO0dBQ2hEOzs7Ozs7QUFNRCwyQkFBeUIsRUFBQSxtQ0FBQyxJQUFJLEVBQUU7QUFDOUIsUUFBSSxDQUFDLFlBQVksR0FBRyxlQUFjLElBQUksQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDM0QsMEJBQVMseUJBQXlCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0dBQ3ZEOzs7Ozs7QUFNRCw0QkFBMEIsRUFBQSxvQ0FBQyxJQUFJLEVBQUU7QUFDL0IsUUFBSSxDQUFDLFNBQVMsR0FBRyxlQUFjLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDckQsMEJBQVMsMEJBQTBCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0dBQ3JEOzs7Ozs7QUFNRCxpQkFBZSxFQUFBLHlCQUFDLEVBQUUsRUFBRTtBQUNsQixRQUFNLFVBQVUsR0FBRyxFQUFFLFlBQVksT0FBTyxHQUFHLEVBQUUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzNFLDZCQUFZLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0dBQzFDOztDQUVGLENBQUM7O3FCQUVhLE1BQU0iLCJmaWxlIjoic3JjL2NsaWVudC9jb3JlL2NsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTaWduYWwgZnJvbSAnLi9TaWduYWwnO1xuaW1wb3J0IEFjdGl2aXR5IGZyb20gJy4vQWN0aXZpdHknO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4vc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IHZpZXdNYW5hZ2VyIGZyb20gJy4vdmlld01hbmFnZXInO1xuaW1wb3J0IHNvY2tldCBmcm9tICcuL3NvY2tldCc7XG5pbXBvcnQgZGVmYXVsdFRleHRDb250ZW50cyBmcm9tICcuLi9kaXNwbGF5L2RlZmF1bHRUZXh0Q29udGVudHMnO1xuaW1wb3J0IGRlZmF1bHRUZW1wbGF0ZXMgZnJvbSAnLi4vZGlzcGxheS9kZWZhdWx0VGVtcGxhdGVzJztcblxuXG5jb25zdCBjbGllbnQgPSB7XG4gIC8qKlxuICAgKiBUaGUge0BsaW5rIFNpZ25hbH0gdXNlZCB0byBib290c3RyYXAgdGhlIHdob2xlIGFwcGxpY2F0aW9uLlxuICAgKiBAdHlwZSB7U2lnbmFsfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgLy8gc2lnbmFsczogeyByZWFkeTogbmV3IFNpZ25hbCgpIH0sXG5cbiAgIC8qKlxuICAgKiBTb2NrZXQuaW8gd3JhcHBlciB1c2VkIHRvIGNvbW11bmljYXRlIHdpdGggdGhlIHNlcnZlciwgaWYgYW55IChzZWUge0BsaW5rIHNvY2tldH0uXG4gICAqIEB0eXBlIHtvYmplY3R9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzb2NrZXQ6IG51bGwsXG5cbiAgLyoqXG4gICAqIEluZm9ybWF0aW9uIGFib3V0IHRoZSBjbGllbnQgcGxhdGZvcm0uXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBvcyBPcGVyYXRpbmcgc3lzdGVtLlxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGlzTW9iaWxlIEluZGljYXRlcyB3aGV0aGVyIHRoZSBjbGllbnQgaXMgcnVubmluZyBvbiBhXG4gICAqIG1vYmlsZSBwbGF0Zm9ybSBvciBub3QuXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBhdWRpb0ZpbGVFeHQgQXVkaW8gZmlsZSBleHRlbnNpb24gdG8gdXNlLCBkZXBlbmRpbmcgb25cbiAgICogdGhlIHBsYXRmb3JtICgpXG4gICAqL1xuICBwbGF0Zm9ybToge1xuICAgIG9zOiBudWxsLFxuICAgIGlzTW9iaWxlOiBudWxsLFxuICAgIGF1ZGlvRmlsZUV4dDogJycsXG4gIH0sXG5cbiAgLyoqXG4gICAqIENsaWVudCB0eXBlLlxuICAgKiBUaGUgY2xpZW50IHR5cGUgaXMgc3BlZmljaWVkIGluIHRoZSBhcmd1bWVudCBvZiB0aGUgYGluaXRgIG1ldGhvZC4gRm9yXG4gICAqIGluc3RhbmNlLCBgJ3BsYXllcidgIGlzIHRoZSBjbGllbnQgdHlwZSB5b3Ugc2hvdWxkIGJlIHVzaW5nIGJ5IGRlZmF1bHQuXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICB0eXBlOiBudWxsLFxuXG4gIC8qKlxuICAgKiBQcm9taXNlIHJlc29sdmVkIHdoZW4gdGhlIHNlcnZlciBzZW5kcyBhIG1lc3NhZ2UgaW5kaWNhdGluZyB0aGF0IHRoZSBjbGllbnRcbiAgICogY2FuIHN0YXJ0IHRoZSBmaXJzdCBtZHVsZS5cbiAgICogQHR5cGUge1Byb21pc2V9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZWFkeTogbnVsbCxcblxuICAvKipcbiAgICogQ2xpZW50IHVuaXF1ZSBpZCwgZ2l2ZW4gYnkgdGhlIHNlcnZlci5cbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHVpZDogbnVsbCxcblxuICAvKipcbiAgICogQ2xpZW50IGNvb3JkaW5hdGVzIChpZiBhbnkpIGdpdmVuIGJ5IGEge0BsaW5rIExvY2F0b3J9LCB7QGxpbmsgUGxhY2VyfSBvclxuICAgKiB7QGxpbmsgQ2hlY2tpbn0gbW9kdWxlLiAoRm9ybWF0OiBgW3g6TnVtYmVyLCB5Ok51bWJlcl1gLilcbiAgICogQHR5cGUge0FycmF5PE51bWJlcj59XG4gICAqL1xuICBjb29yZGluYXRlczogbnVsbCxcblxuICAvKipcbiAgICogVGlja2V0IGluZGV4IChpZiBhbnkpIGdpdmVuIGJ5IGEge0BsaW5rIFBsYWNlcn0gb3JcbiAgICoge0BsaW5rIENoZWNraW59IG1vZHVsZS5cbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGluZGV4OiBudWxsLFxuXG4gIC8qKlxuICAgKiBUaWNrZXQgbGFiZWwgKGlmIGFueSkgZ2l2ZW4gYnkgYSB7QGxpbmsgUGxhY2VyfSBvclxuICAgKiB7QGxpbmsgQ2hlY2tpbn0gbW9kdWxlLlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgbGFiZWw6IG51bGwsXG5cbiAgLyoqXG4gICAqIElzIHNldCB0byBgdHJ1ZWAgb3IgYGZhbHNlYCBieSB0aGUgYFdlbGNvbWVgIHNlcnZpY2UgYW5kIGRlZmluZXMgaWYgdGhlIGNsaWVudCBtZWV0IHRoZSByZXF1aXJlbWVudHMgb2YgdGhlIGFwcGxpY2F0aW9uLlxuICAgKiBFc3BlY2lhbGx5IHVzZWZ1bGwgd2hlbiB0aGUgYFdlbGNvbWVgIHNlcnZpY2UgaXMgdXNlZCB3aXRob3V0IGEgdmlldyBhbmQgYWN0aXZhdGVkIG1hbnVhbGx5LlxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICovXG4gIGNvbXBhdGlibGU6IG51bGwsXG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIGFwcGxpY2F0aW9uLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW2NsaWVudFR5cGUgPSAncGxheWVyJ10gLSBUaGUgY2xpZW50IHR5cGUgdG8gZGVmaW5lIHRoZSBzb2NrZXQgbmFtZXNwYWNlLCBzaG91bGQgbWF0Y2ggYSBjbGllbnQgdHlwZSBkZWZpbmVkIHNlcnZlciBzaWRlIChpZiBhbnkpLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW2NvbmZpZz17fV0gLSBUaGUgY29uZmlnIHRvIGluaXRpYWxpemUgYSBjbGllbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IFtjb25maWcuc29ja2V0SU8udXJsPScnXSAtIFRoZSB1cmwgd2hlcmUgdGhlIHNvY2tldCBzaG91bGQgY29ubmVjdC5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtjb25maWcuc29ja2V0SU8udHJhbnNwb3J0cz1bJ3dlYnNvY2tldCddXSAtIFRoZSB0cmFuc3BvcnQgdXNlZCB0byBjcmVhdGUgdGhlIHVybCAob3ZlcnJpZGVzIGRlZmF1bHQgc29ja2V0LmlvIG1lY2FuaXNtKS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtjb25maWcuYXBwQ29udGFpbmVyPScjY29udGFpbmVyJ10gLSBBIHNlbGVjdG9yIG1hdGNoaW5nIGEgRE9NIGVsZW1lbnQgd2hlcmUgdGhlIHZpZXdzIHNob3VsZCBiZSBpbnNlcnRlZC5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtjb25maWcuZGVidWdJTz1mYWxzZV0gLSBJZiBzZXQgdG8gYHRydWVgLCBzaG93IHNvY2tldC5pbyBkZWJ1ZyBpbmZvcm1hdGlvbnMuXG4gICAqL1xuICBpbml0KGNsaWVudFR5cGUgPSAncGxheWVyJywgY29uZmlnID0ge30pIHtcbiAgICB0aGlzLnR5cGUgPSBjbGllbnRUeXBlO1xuXG4gICAgLy8gMS4gaWYgc29ja2V0IGNvbmZpZyBnaXZlbiwgbWl4IGl0IHdpdGggZGVmYXVsdHMuXG4gICAgY29uc3Qgc29ja2V0SU8gPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIHVybDogJycsXG4gICAgICB0cmFuc3BvcnRzOiBbJ3dlYnNvY2tldCddXG4gICAgfSwgY29uZmlnLnNvY2tldElPKTtcblxuICAgIC8vIDIuIG1peCBhbGwgb3RoZXIgY29uZmlnIGFuZCBvdmVycmlkZSB3aXRoIGRlZmluZWQgc29ja2V0IGNvbmZpZy5cbiAgICB0aGlzLmNvbmZpZyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgZGVidWdJTzogZmFsc2UsXG4gICAgICBhcHBDb250YWluZXI6ICcjY29udGFpbmVyJyxcbiAgICB9LCBjb25maWcsIHsgc29ja2V0SU8gfSk7XG5cbiAgICBzZXJ2aWNlTWFuYWdlci5pbml0KCk7XG4gICAgdGhpcy5faW5pdFZpZXdzKCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqICogSW5pdGlhbGl6ZSB0aGUgYXBwbGljYXRpb24uXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICAvLyBpbml0IHNvY2tldFxuICAgIGlmIChzb2NrZXQucmVxdWlyZWQpXG4gICAgICB0aGlzLl9pbml0U29ja2V0KCk7XG4gICAgZWxzZVxuICAgICAgc2VydmljZU1hbmFnZXIuc3RhcnQoKTtcbiAgfSxcblxuICAvKipcbiAgICogUmV0dXJucyBhIHNlcnZpY2UgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBUaGUgaWRlbnRpZmllciBvZiB0aGUgc2VydmljZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBUaGUgb3B0aW9ucyB0byBjb25maWd1cmUgdGhlIHNlcnZpY2UuXG4gICAqL1xuICByZXF1aXJlKGlkLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIHNlcnZpY2VNYW5hZ2VyLnJlcXVpcmUoaWQsIG9wdGlvbnMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBAdG9kbyAtIHJlZmFjdG9yIGhhbmRzaGFrZS5cbiAgICogSW5pdGlhbGl6ZSBzb2NrZXQgY29ubmVjdGlvbiBhbmQgcGVyZm9ybSBoYW5kc2hha2Ugd2l0aCB0aGUgc2VydmVyLlxuICAgKi9cbiAgX2luaXRTb2NrZXQoKSB7XG4gICAgLy8gaW5pdGlhbGl6ZSBzb2NrZXQgY29tbXVuaWNhdGlvbnNcbiAgICB0aGlzLnNvY2tldCA9IHNvY2tldC5pbml0aWFsaXplKHRoaXMudHlwZSwgdGhpcy5jb25maWcuc29ja2V0SU8pO1xuICAgIC8vIHdhaXQgZm9yIGhhbmRzaGFrZSB0byBtYXJrIGNsaWVudCBhcyBgcmVhZHlgXG4gICAgdGhpcy5zb2NrZXQucmVjZWl2ZSgnY2xpZW50OnN0YXJ0JywgKHVpZCkgPT4ge1xuICAgICAgLy8gZG9uJ3QgaGFuZGxlIHNlcnZlciByZXN0YXJ0IGZvciBub3cuXG4gICAgICB0aGlzLnVpZCA9IHVpZDtcbiAgICAgIHNlcnZpY2VNYW5hZ2VyLnN0YXJ0KCk7XG5cbiAgICAgIC8vIHRoaXMuY29tbS5yZWNlaXZlKCdyZWNvbm5lY3QnLCAoKSA9PiBjb25zb2xlLmluZm8oJ3JlY29ubmVjdCcpKTtcbiAgICAgIC8vIHRoaXMuY29tbS5yZWNlaXZlKCdkaXNjb25uZWN0JywgKCkgPT4ge1xuICAgICAgLy8gICBjb25zb2xlLmluZm8oJ2Rpc2Nvbm5lY3QnKVxuICAgICAgLy8gICBzZXJ2aWNlTWFuYWdlci5yZXNldCgpOyAvLyBjYW4gcmVsYXVuY2ggc2VydmljZU1hbmFnZXIgb24gcmVjb25uZWN0aW9uLlxuICAgICAgLy8gfSk7XG4gICAgICAvLyB0aGlzLmNvbW0ucmVjZWl2ZSgnZXJyb3InLCAoZXJyKSA9PiBjb25zb2xlLmVycm9yKGVycikpO1xuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRlbXBsYXRlcyBmb3IgYWxsXG4gICAqL1xuICBfaW5pdFZpZXdzKCkge1xuICAgIC8vIGluaXRpYWxpemUgbW9kdWxlcyB2aWV3cyB3aXRoIGRlZmF1bHQgdGV4dHMgYW5kIHRlbXBsYXRlc1xuICAgIHRoaXMudGV4dENvbnRlbnRzID0ge307XG4gICAgdGhpcy50ZW1wbGF0ZXMgPSB7fTtcblxuICAgIGNvbnN0IGFwcE5hbWUgPSB0aGlzLmNvbmZpZy5hcHBOYW1lIHx8wqBkZWZhdWx0VGV4dENvbnRlbnRzLmdsb2JhbHMuYXBwTmFtZTtcbiAgICBjb25zdCB0ZXh0Q29udGVudHMgPSBPYmplY3QuYXNzaWduKGRlZmF1bHRUZXh0Q29udGVudHMsIHtcbiAgICAgIGdsb2JhbHM6IHsgYXBwTmFtZSB9XG4gICAgfSk7XG5cbiAgICB0aGlzLnNldFZpZXdDb250ZW50RGVmaW5pdGlvbnModGV4dENvbnRlbnRzKTtcbiAgICB0aGlzLnNldFZpZXdUZW1wbGF0ZURlZmluaXRpb25zKGRlZmF1bHRUZW1wbGF0ZXMpO1xuICAgIHRoaXMuc2V0QXBwQ29udGFpbmVyKHRoaXMuY29uZmlnLmFwcENvbnRhaW5lcik7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEV4dGVuZCBhcHBsaWNhdGlvbiB0ZXh0IGNvbnRlbnRzIHdpdGggdGhlIGdpdmVuIG9iamVjdC5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRlbnRzIC0gVGhlIHRleHQgY29udGVudHMgdG8gcHJvcGFnYXRlIHRvIG1vZHVsZXMuXG4gICAqL1xuICBzZXRWaWV3Q29udGVudERlZmluaXRpb25zKGRlZnMpIHtcbiAgICB0aGlzLnRleHRDb250ZW50cyA9IE9iamVjdC5hc3NpZ24odGhpcy50ZXh0Q29udGVudHMsIGRlZnMpO1xuICAgIEFjdGl2aXR5LnNldFZpZXdDb250ZW50RGVmaW5pdGlvbnModGhpcy50ZXh0Q29udGVudHMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBFeHRlbmQgYXBwbGljYXRpb24gdGVtcGxhdGVzIHdpdGggdGhlIGdpdmVuIG9iamVjdC5cbiAgICogQHBhcmFtIHtPYmplY3R9IHRlbXBsYXRlcyAtIFRoZSB0ZW1wbGF0ZXMgdG8gcHJvcGFnYXRlIHRvIG1vZHVsZXMuXG4gICAqL1xuICBzZXRWaWV3VGVtcGxhdGVEZWZpbml0aW9ucyhkZWZzKSB7XG4gICAgdGhpcy50ZW1wbGF0ZXMgPSBPYmplY3QuYXNzaWduKHRoaXMudGVtcGxhdGVzLCBkZWZzKTtcbiAgICBBY3Rpdml0eS5zZXRWaWV3VGVtcGxhdGVEZWZpbml0aW9ucyh0aGlzLnRlbXBsYXRlcyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGRlZmF1bHQgdmlldyBjb250YWluZXIgZm9yIGFsbCBgQ2xpZW50TW9kdWxlYHNcbiAgICogQHBhcmFtIHtTdHJpbmd8RWxlbWVudH0gZWwgLSBBIERPTSBlbGVtZW50IG9yIGEgY3NzIHNlbGVjdG9yIG1hdGNoaW5nIHRoZSBlbGVtZW50IHRvIHVzZSBhcyBhIGNvbnRhaW5lci5cbiAgICovXG4gIHNldEFwcENvbnRhaW5lcihlbCkge1xuICAgIGNvbnN0ICRjb250YWluZXIgPSBlbCBpbnN0YW5jZW9mIEVsZW1lbnQgPyBlbCA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWwpO1xuICAgIHZpZXdNYW5hZ2VyLnNldFZpZXdDb250YWluZXIoJGNvbnRhaW5lcik7XG4gIH0sXG5cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsaWVudDtcbiJdfQ==