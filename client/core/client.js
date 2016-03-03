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
   * Client unique id, given by the server.
   * @type {Number}
   */
  uuid: null,

  /**
   * Client type.
   * The client type is speficied in the argument of the `init` method. For
   * instance, `'player'` is the client type you should be using by default.
   * @type {String}
   */
  type: null,

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
   * Configuration informations retrieved from the server configuration by
   * the `SharedConfig` service.
   * @type {Object}
   */
  config: null,

  /**
   * Is set to `true` or `false` by the `Welcome` service and defines if the
   * client meets the requirements of the application. (Should be usefull when
   * the `Welcome` service is used without a view and activated manually)
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
   * Start the application.
   */
  start: function start() {
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

    this.socket = _socket2['default'].initialize(this.type, this.config.socketIO);
    // wait for handshake to mark client as `ready`
    this.socket.receive('client:start', function (uuid) {
      // don't handle server restart for now.
      _this.uuid = uuid;
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
    var textContents = _Object$assign(_displayDefaultTextContents2['default'], { globals: { appName: appName } });

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
   * @param {String|Element} el - DOM element (or css selector matching
   *  an existing element) to be used as the container of the application.
   */
  setAppContainer: function setAppContainer(el) {
    var $container = el instanceof Element ? el : document.querySelector(el);
    _viewManager2['default'].setViewContainer($container);
  }

};

exports['default'] = client;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L2NvcmUvY2xpZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7c0JBQW1CLFVBQVU7Ozs7d0JBQ1IsWUFBWTs7Ozs4QkFDTixrQkFBa0I7Ozs7MkJBQ3JCLGVBQWU7Ozs7c0JBQ3BCLFVBQVU7Ozs7MENBQ0csZ0NBQWdDOzs7O3VDQUNuQyw2QkFBNkI7Ozs7QUFHMUQsSUFBTSxNQUFNLEdBQUc7Ozs7O0FBS2IsTUFBSSxFQUFFLElBQUk7Ozs7Ozs7O0FBUVYsTUFBSSxFQUFFLElBQUk7Ozs7Ozs7QUFPVixRQUFNLEVBQUUsSUFBSTs7Ozs7Ozs7Ozs7QUFXWixVQUFRLEVBQUU7QUFDUixNQUFFLEVBQUUsSUFBSTtBQUNSLFlBQVEsRUFBRSxJQUFJO0FBQ2QsZ0JBQVksRUFBRSxFQUFFO0dBQ2pCOzs7Ozs7O0FBT0QsYUFBVyxFQUFFLElBQUk7Ozs7Ozs7QUFPakIsT0FBSyxFQUFFLElBQUk7Ozs7Ozs7QUFPWCxPQUFLLEVBQUUsSUFBSTs7Ozs7OztBQU9YLFFBQU0sRUFBRSxJQUFJOzs7Ozs7OztBQVFaLFlBQVUsRUFBRSxJQUFJOzs7Ozs7Ozs7OztBQVdoQixNQUFJLEVBQUEsZ0JBQXFDO1FBQXBDLFVBQVUseURBQUcsUUFBUTtRQUFFLE1BQU0seURBQUcsRUFBRTs7QUFDckMsUUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7OztBQUd2QixRQUFNLFFBQVEsR0FBRyxlQUFjO0FBQzdCLFNBQUcsRUFBRSxFQUFFO0FBQ1AsZ0JBQVUsRUFBRSxDQUFDLFdBQVcsQ0FBQztLQUMxQixFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQzs7O0FBR3BCLFFBQUksQ0FBQyxNQUFNLEdBQUcsZUFBYztBQUMxQixhQUFPLEVBQUUsS0FBSztBQUNkLGtCQUFZLEVBQUUsWUFBWTtLQUMzQixFQUFFLE1BQU0sRUFBRSxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsQ0FBQyxDQUFDOztBQUV6QixnQ0FBZSxJQUFJLEVBQUUsQ0FBQztBQUN0QixRQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7R0FDbkI7Ozs7O0FBS0QsT0FBSyxFQUFBLGlCQUFHO0FBQ04sUUFBSSxvQkFBTyxRQUFRLEVBQ2pCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxLQUVuQiw0QkFBZSxLQUFLLEVBQUUsQ0FBQztHQUMxQjs7Ozs7OztBQU9ELFNBQU8sRUFBQSxpQkFBQyxFQUFFLEVBQUUsT0FBTyxFQUFFO0FBQ25CLFdBQU8sNEJBQWUsT0FBTyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztHQUM1Qzs7Ozs7O0FBTUQsYUFBVyxFQUFBLHVCQUFHOzs7QUFDWixRQUFJLENBQUMsTUFBTSxHQUFHLG9CQUFPLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRWpFLFFBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxVQUFDLElBQUksRUFBSzs7QUFFNUMsWUFBSyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLGtDQUFlLEtBQUssRUFBRSxDQUFDOzs7Ozs7OztLQVF4QixDQUFDLENBQUM7R0FDSjs7Ozs7QUFLRCxZQUFVLEVBQUEsc0JBQUc7O0FBRVgsUUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7QUFDdkIsUUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7O0FBRXBCLFFBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxJQUFJLHdDQUFvQixPQUFPLENBQUMsT0FBTyxDQUFDO0FBQzNFLFFBQU0sWUFBWSxHQUFHLHdEQUFtQyxFQUFFLE9BQU8sRUFBRSxFQUFFLE9BQU8sRUFBUCxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7O0FBRWxGLFFBQUksQ0FBQyx5QkFBeUIsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUM3QyxRQUFJLENBQUMsMEJBQTBCLHNDQUFrQixDQUFDO0FBQ2xELFFBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztHQUNoRDs7Ozs7O0FBTUQsMkJBQXlCLEVBQUEsbUNBQUMsSUFBSSxFQUFFO0FBQzlCLFFBQUksQ0FBQyxZQUFZLEdBQUcsZUFBYyxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzNELDBCQUFTLHlCQUF5QixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztHQUN2RDs7Ozs7O0FBTUQsNEJBQTBCLEVBQUEsb0NBQUMsSUFBSSxFQUFFO0FBQy9CLFFBQUksQ0FBQyxTQUFTLEdBQUcsZUFBYyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3JELDBCQUFTLDBCQUEwQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztHQUNyRDs7Ozs7OztBQU9ELGlCQUFlLEVBQUEseUJBQUMsRUFBRSxFQUFFO0FBQ2xCLFFBQU0sVUFBVSxHQUFHLEVBQUUsWUFBWSxPQUFPLEdBQUcsRUFBRSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDM0UsNkJBQVksZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQUM7R0FDMUM7O0NBRUYsQ0FBQzs7cUJBRWEsTUFBTSIsImZpbGUiOiIvVXNlcnMvc2NobmVsbC9EZXZlbG9wbWVudC93ZWIvY29sbGVjdGl2ZS1zb3VuZHdvcmtzL3NvdW5kd29ya3Mvc3JjL2NsaWVudC9jb3JlL2NsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTaWduYWwgZnJvbSAnLi9TaWduYWwnO1xuaW1wb3J0IEFjdGl2aXR5IGZyb20gJy4vQWN0aXZpdHknO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4vc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IHZpZXdNYW5hZ2VyIGZyb20gJy4vdmlld01hbmFnZXInO1xuaW1wb3J0IHNvY2tldCBmcm9tICcuL3NvY2tldCc7XG5pbXBvcnQgZGVmYXVsdFRleHRDb250ZW50cyBmcm9tICcuLi9kaXNwbGF5L2RlZmF1bHRUZXh0Q29udGVudHMnO1xuaW1wb3J0IGRlZmF1bHRUZW1wbGF0ZXMgZnJvbSAnLi4vZGlzcGxheS9kZWZhdWx0VGVtcGxhdGVzJztcblxuXG5jb25zdCBjbGllbnQgPSB7XG4gIC8qKlxuICAgKiBDbGllbnQgdW5pcXVlIGlkLCBnaXZlbiBieSB0aGUgc2VydmVyLlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgdXVpZDogbnVsbCxcblxuICAvKipcbiAgICogQ2xpZW50IHR5cGUuXG4gICAqIFRoZSBjbGllbnQgdHlwZSBpcyBzcGVmaWNpZWQgaW4gdGhlIGFyZ3VtZW50IG9mIHRoZSBgaW5pdGAgbWV0aG9kLiBGb3JcbiAgICogaW5zdGFuY2UsIGAncGxheWVyJ2AgaXMgdGhlIGNsaWVudCB0eXBlIHlvdSBzaG91bGQgYmUgdXNpbmcgYnkgZGVmYXVsdC5cbiAgICogQHR5cGUge1N0cmluZ31cbiAgICovXG4gIHR5cGU6IG51bGwsXG5cbiAgIC8qKlxuICAgKiBTb2NrZXQuaW8gd3JhcHBlciB1c2VkIHRvIGNvbW11bmljYXRlIHdpdGggdGhlIHNlcnZlciwgaWYgYW55IChzZWUge0BsaW5rIHNvY2tldH0uXG4gICAqIEB0eXBlIHtvYmplY3R9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzb2NrZXQ6IG51bGwsXG5cbiAgLyoqXG4gICAqIEluZm9ybWF0aW9uIGFib3V0IHRoZSBjbGllbnQgcGxhdGZvcm0uXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBvcyBPcGVyYXRpbmcgc3lzdGVtLlxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGlzTW9iaWxlIEluZGljYXRlcyB3aGV0aGVyIHRoZSBjbGllbnQgaXMgcnVubmluZyBvbiBhXG4gICAqIG1vYmlsZSBwbGF0Zm9ybSBvciBub3QuXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBhdWRpb0ZpbGVFeHQgQXVkaW8gZmlsZSBleHRlbnNpb24gdG8gdXNlLCBkZXBlbmRpbmcgb25cbiAgICogdGhlIHBsYXRmb3JtICgpXG4gICAqL1xuICBwbGF0Zm9ybToge1xuICAgIG9zOiBudWxsLFxuICAgIGlzTW9iaWxlOiBudWxsLFxuICAgIGF1ZGlvRmlsZUV4dDogJycsXG4gIH0sXG5cbiAgLyoqXG4gICAqIENsaWVudCBjb29yZGluYXRlcyAoaWYgYW55KSBnaXZlbiBieSBhIHtAbGluayBMb2NhdG9yfSwge0BsaW5rIFBsYWNlcn0gb3JcbiAgICoge0BsaW5rIENoZWNraW59IG1vZHVsZS4gKEZvcm1hdDogYFt4Ok51bWJlciwgeTpOdW1iZXJdYC4pXG4gICAqIEB0eXBlIHtBcnJheTxOdW1iZXI+fVxuICAgKi9cbiAgY29vcmRpbmF0ZXM6IG51bGwsXG5cbiAgLyoqXG4gICAqIFRpY2tldCBpbmRleCAoaWYgYW55KSBnaXZlbiBieSBhIHtAbGluayBQbGFjZXJ9IG9yXG4gICAqIHtAbGluayBDaGVja2lufSBtb2R1bGUuXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBpbmRleDogbnVsbCxcblxuICAvKipcbiAgICogVGlja2V0IGxhYmVsIChpZiBhbnkpIGdpdmVuIGJ5IGEge0BsaW5rIFBsYWNlcn0gb3JcbiAgICoge0BsaW5rIENoZWNraW59IG1vZHVsZS5cbiAgICogQHR5cGUge1N0cmluZ31cbiAgICovXG4gIGxhYmVsOiBudWxsLFxuXG4gIC8qKlxuICAgKiBDb25maWd1cmF0aW9uIGluZm9ybWF0aW9ucyByZXRyaWV2ZWQgZnJvbSB0aGUgc2VydmVyIGNvbmZpZ3VyYXRpb24gYnlcbiAgICogdGhlIGBTaGFyZWRDb25maWdgIHNlcnZpY2UuXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqL1xuICBjb25maWc6IG51bGwsXG5cbiAgLyoqXG4gICAqIElzIHNldCB0byBgdHJ1ZWAgb3IgYGZhbHNlYCBieSB0aGUgYFdlbGNvbWVgIHNlcnZpY2UgYW5kIGRlZmluZXMgaWYgdGhlXG4gICAqIGNsaWVudCBtZWV0cyB0aGUgcmVxdWlyZW1lbnRzIG9mIHRoZSBhcHBsaWNhdGlvbi4gKFNob3VsZCBiZSB1c2VmdWxsIHdoZW5cbiAgICogdGhlIGBXZWxjb21lYCBzZXJ2aWNlIGlzIHVzZWQgd2l0aG91dCBhIHZpZXcgYW5kIGFjdGl2YXRlZCBtYW51YWxseSlcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuICBjb21wYXRpYmxlOiBudWxsLFxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSBhcHBsaWNhdGlvbi5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtjbGllbnRUeXBlID0gJ3BsYXllciddIC0gVGhlIGNsaWVudCB0eXBlIHRvIGRlZmluZSB0aGUgc29ja2V0IG5hbWVzcGFjZSwgc2hvdWxkIG1hdGNoIGEgY2xpZW50IHR5cGUgZGVmaW5lZCBzZXJ2ZXIgc2lkZSAoaWYgYW55KS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtjb25maWc9e31dIC0gVGhlIGNvbmZpZyB0byBpbml0aWFsaXplIGEgY2xpZW50XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbY29uZmlnLnNvY2tldElPLnVybD0nJ10gLSBUaGUgdXJsIHdoZXJlIHRoZSBzb2NrZXQgc2hvdWxkIGNvbm5lY3QuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbY29uZmlnLnNvY2tldElPLnRyYW5zcG9ydHM9Wyd3ZWJzb2NrZXQnXV0gLSBUaGUgdHJhbnNwb3J0IHVzZWQgdG8gY3JlYXRlIHRoZSB1cmwgKG92ZXJyaWRlcyBkZWZhdWx0IHNvY2tldC5pbyBtZWNhbmlzbSkuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbY29uZmlnLmFwcENvbnRhaW5lcj0nI2NvbnRhaW5lciddIC0gQSBzZWxlY3RvciBtYXRjaGluZyBhIERPTSBlbGVtZW50IHdoZXJlIHRoZSB2aWV3cyBzaG91bGQgYmUgaW5zZXJ0ZWQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbY29uZmlnLmRlYnVnSU89ZmFsc2VdIC0gSWYgc2V0IHRvIGB0cnVlYCwgc2hvdyBzb2NrZXQuaW8gZGVidWcgaW5mb3JtYXRpb25zLlxuICAgKi9cbiAgaW5pdChjbGllbnRUeXBlID0gJ3BsYXllcicsIGNvbmZpZyA9IHt9KSB7XG4gICAgdGhpcy50eXBlID0gY2xpZW50VHlwZTtcblxuICAgIC8vIDEuIGlmIHNvY2tldCBjb25maWcgZ2l2ZW4sIG1peCBpdCB3aXRoIGRlZmF1bHRzLlxuICAgIGNvbnN0IHNvY2tldElPID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICB1cmw6ICcnLFxuICAgICAgdHJhbnNwb3J0czogWyd3ZWJzb2NrZXQnXVxuICAgIH0sIGNvbmZpZy5zb2NrZXRJTyk7XG5cbiAgICAvLyAyLiBtaXggYWxsIG90aGVyIGNvbmZpZyBhbmQgb3ZlcnJpZGUgd2l0aCBkZWZpbmVkIHNvY2tldCBjb25maWcuXG4gICAgdGhpcy5jb25maWcgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIGRlYnVnSU86IGZhbHNlLFxuICAgICAgYXBwQ29udGFpbmVyOiAnI2NvbnRhaW5lcicsXG4gICAgfSwgY29uZmlnLCB7IHNvY2tldElPIH0pO1xuXG4gICAgc2VydmljZU1hbmFnZXIuaW5pdCgpO1xuICAgIHRoaXMuX2luaXRWaWV3cygpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgYXBwbGljYXRpb24uXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBpZiAoc29ja2V0LnJlcXVpcmVkKVxuICAgICAgdGhpcy5faW5pdFNvY2tldCgpO1xuICAgIGVsc2VcbiAgICAgIHNlcnZpY2VNYW5hZ2VyLnN0YXJ0KCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzZXJ2aWNlIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gVGhlIGlkZW50aWZpZXIgb2YgdGhlIHNlcnZpY2UuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gVGhlIG9wdGlvbnMgdG8gY29uZmlndXJlIHRoZSBzZXJ2aWNlLlxuICAgKi9cbiAgcmVxdWlyZShpZCwgb3B0aW9ucykge1xuICAgIHJldHVybiBzZXJ2aWNlTWFuYWdlci5yZXF1aXJlKGlkLCBvcHRpb25zKTtcbiAgfSxcblxuICAvKipcbiAgICogQHRvZG8gLSByZWZhY3RvciBoYW5kc2hha2UuXG4gICAqIEluaXRpYWxpemUgc29ja2V0IGNvbm5lY3Rpb24gYW5kIHBlcmZvcm0gaGFuZHNoYWtlIHdpdGggdGhlIHNlcnZlci5cbiAgICovXG4gIF9pbml0U29ja2V0KCkge1xuICAgIHRoaXMuc29ja2V0ID0gc29ja2V0LmluaXRpYWxpemUodGhpcy50eXBlLCB0aGlzLmNvbmZpZy5zb2NrZXRJTyk7XG4gICAgLy8gd2FpdCBmb3IgaGFuZHNoYWtlIHRvIG1hcmsgY2xpZW50IGFzIGByZWFkeWBcbiAgICB0aGlzLnNvY2tldC5yZWNlaXZlKCdjbGllbnQ6c3RhcnQnLCAodXVpZCkgPT4ge1xuICAgICAgLy8gZG9uJ3QgaGFuZGxlIHNlcnZlciByZXN0YXJ0IGZvciBub3cuXG4gICAgICB0aGlzLnV1aWQgPSB1dWlkO1xuICAgICAgc2VydmljZU1hbmFnZXIuc3RhcnQoKTtcblxuICAgICAgLy8gdGhpcy5jb21tLnJlY2VpdmUoJ3JlY29ubmVjdCcsICgpID0+IGNvbnNvbGUuaW5mbygncmVjb25uZWN0JykpO1xuICAgICAgLy8gdGhpcy5jb21tLnJlY2VpdmUoJ2Rpc2Nvbm5lY3QnLCAoKSA9PiB7XG4gICAgICAvLyAgIGNvbnNvbGUuaW5mbygnZGlzY29ubmVjdCcpXG4gICAgICAvLyAgIHNlcnZpY2VNYW5hZ2VyLnJlc2V0KCk7IC8vIGNhbiByZWxhdW5jaCBzZXJ2aWNlTWFuYWdlciBvbiByZWNvbm5lY3Rpb24uXG4gICAgICAvLyB9KTtcbiAgICAgIC8vIHRoaXMuY29tbS5yZWNlaXZlKCdlcnJvcicsIChlcnIpID0+IGNvbnNvbGUuZXJyb3IoZXJyKSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGVtcGxhdGVzIGZvciBhbGxcbiAgICovXG4gIF9pbml0Vmlld3MoKSB7XG4gICAgLy8gaW5pdGlhbGl6ZSBtb2R1bGVzIHZpZXdzIHdpdGggZGVmYXVsdCB0ZXh0cyBhbmQgdGVtcGxhdGVzXG4gICAgdGhpcy50ZXh0Q29udGVudHMgPSB7fTtcbiAgICB0aGlzLnRlbXBsYXRlcyA9IHt9O1xuXG4gICAgY29uc3QgYXBwTmFtZSA9IHRoaXMuY29uZmlnLmFwcE5hbWUgfHzCoGRlZmF1bHRUZXh0Q29udGVudHMuZ2xvYmFscy5hcHBOYW1lO1xuICAgIGNvbnN0IHRleHRDb250ZW50cyA9IE9iamVjdC5hc3NpZ24oZGVmYXVsdFRleHRDb250ZW50cywgeyBnbG9iYWxzOiB7IGFwcE5hbWUgfSB9KTtcblxuICAgIHRoaXMuc2V0Vmlld0NvbnRlbnREZWZpbml0aW9ucyh0ZXh0Q29udGVudHMpO1xuICAgIHRoaXMuc2V0Vmlld1RlbXBsYXRlRGVmaW5pdGlvbnMoZGVmYXVsdFRlbXBsYXRlcyk7XG4gICAgdGhpcy5zZXRBcHBDb250YWluZXIodGhpcy5jb25maWcuYXBwQ29udGFpbmVyKTtcbiAgfSxcblxuICAvKipcbiAgICogRXh0ZW5kIGFwcGxpY2F0aW9uIHRleHQgY29udGVudHMgd2l0aCB0aGUgZ2l2ZW4gb2JqZWN0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGVudHMgLSBUaGUgdGV4dCBjb250ZW50cyB0byBwcm9wYWdhdGUgdG8gbW9kdWxlcy5cbiAgICovXG4gIHNldFZpZXdDb250ZW50RGVmaW5pdGlvbnMoZGVmcykge1xuICAgIHRoaXMudGV4dENvbnRlbnRzID0gT2JqZWN0LmFzc2lnbih0aGlzLnRleHRDb250ZW50cywgZGVmcyk7XG4gICAgQWN0aXZpdHkuc2V0Vmlld0NvbnRlbnREZWZpbml0aW9ucyh0aGlzLnRleHRDb250ZW50cyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEV4dGVuZCBhcHBsaWNhdGlvbiB0ZW1wbGF0ZXMgd2l0aCB0aGUgZ2l2ZW4gb2JqZWN0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gdGVtcGxhdGVzIC0gVGhlIHRlbXBsYXRlcyB0byBwcm9wYWdhdGUgdG8gbW9kdWxlcy5cbiAgICovXG4gIHNldFZpZXdUZW1wbGF0ZURlZmluaXRpb25zKGRlZnMpIHtcbiAgICB0aGlzLnRlbXBsYXRlcyA9IE9iamVjdC5hc3NpZ24odGhpcy50ZW1wbGF0ZXMsIGRlZnMpO1xuICAgIEFjdGl2aXR5LnNldFZpZXdUZW1wbGF0ZURlZmluaXRpb25zKHRoaXMudGVtcGxhdGVzKTtcbiAgfSxcblxuICAvKipcbiAgICogU2V0cyB0aGUgZGVmYXVsdCB2aWV3IGNvbnRhaW5lciBmb3IgYWxsIGBDbGllbnRNb2R1bGVgc1xuICAgKiBAcGFyYW0ge1N0cmluZ3xFbGVtZW50fSBlbCAtIERPTSBlbGVtZW50IChvciBjc3Mgc2VsZWN0b3IgbWF0Y2hpbmdcbiAgICogIGFuIGV4aXN0aW5nIGVsZW1lbnQpIHRvIGJlIHVzZWQgYXMgdGhlIGNvbnRhaW5lciBvZiB0aGUgYXBwbGljYXRpb24uXG4gICAqL1xuICBzZXRBcHBDb250YWluZXIoZWwpIHtcbiAgICBjb25zdCAkY29udGFpbmVyID0gZWwgaW5zdGFuY2VvZiBFbGVtZW50ID8gZWwgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsKTtcbiAgICB2aWV3TWFuYWdlci5zZXRWaWV3Q29udGFpbmVyKCRjb250YWluZXIpO1xuICB9LFxuXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGllbnQ7XG4iXX0=