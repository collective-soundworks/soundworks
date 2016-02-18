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
  uuid: null,

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvY29yZS9jbGllbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztzQkFBbUIsVUFBVTs7Ozt3QkFDUixZQUFZOzs7OzhCQUNOLGtCQUFrQjs7OzsyQkFDckIsZUFBZTs7OztzQkFDcEIsVUFBVTs7OzswQ0FDRyxnQ0FBZ0M7Ozs7dUNBQ25DLDZCQUE2Qjs7OztBQUcxRCxJQUFNLE1BQU0sR0FBRzs7Ozs7Ozs7Ozs7OztBQWFiLFFBQU0sRUFBRSxJQUFJOzs7Ozs7Ozs7OztBQVdaLFVBQVEsRUFBRTtBQUNSLE1BQUUsRUFBRSxJQUFJO0FBQ1IsWUFBUSxFQUFFLElBQUk7QUFDZCxnQkFBWSxFQUFFLEVBQUU7R0FDakI7Ozs7Ozs7O0FBUUQsTUFBSSxFQUFFLElBQUk7Ozs7Ozs7O0FBUVYsT0FBSyxFQUFFLElBQUk7Ozs7OztBQU1YLE1BQUksRUFBRSxJQUFJOzs7Ozs7O0FBT1YsYUFBVyxFQUFFLElBQUk7Ozs7Ozs7QUFPakIsT0FBSyxFQUFFLElBQUk7Ozs7Ozs7QUFPWCxPQUFLLEVBQUUsSUFBSTs7Ozs7OztBQU9YLFlBQVUsRUFBRSxJQUFJOzs7Ozs7Ozs7OztBQVdoQixNQUFJLEVBQUEsZ0JBQXFDO1FBQXBDLFVBQVUseURBQUcsUUFBUTtRQUFFLE1BQU0seURBQUcsRUFBRTs7QUFDckMsUUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7OztBQUd2QixRQUFNLFFBQVEsR0FBRyxlQUFjO0FBQzdCLFNBQUcsRUFBRSxFQUFFO0FBQ1AsZ0JBQVUsRUFBRSxDQUFDLFdBQVcsQ0FBQztLQUMxQixFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQzs7O0FBR3BCLFFBQUksQ0FBQyxNQUFNLEdBQUcsZUFBYztBQUMxQixhQUFPLEVBQUUsS0FBSztBQUNkLGtCQUFZLEVBQUUsWUFBWTtLQUMzQixFQUFFLE1BQU0sRUFBRSxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsQ0FBQyxDQUFDOztBQUV6QixnQ0FBZSxJQUFJLEVBQUUsQ0FBQztBQUN0QixRQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7R0FDbkI7Ozs7O0FBS0QsT0FBSyxFQUFBLGlCQUFHOztBQUVOLFFBQUksb0JBQU8sUUFBUSxFQUNqQixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsS0FFbkIsNEJBQWUsS0FBSyxFQUFFLENBQUM7R0FDMUI7Ozs7Ozs7QUFPRCxTQUFPLEVBQUEsaUJBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRTtBQUNuQixXQUFPLDRCQUFlLE9BQU8sQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7R0FDNUM7Ozs7OztBQU1ELGFBQVcsRUFBQSx1QkFBRzs7OztBQUVaLFFBQUksQ0FBQyxNQUFNLEdBQUcsb0JBQU8sVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFakUsUUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLFVBQUMsSUFBSSxFQUFLOztBQUU1QyxZQUFLLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsa0NBQWUsS0FBSyxFQUFFLENBQUM7Ozs7Ozs7O0tBUXhCLENBQUMsQ0FBQztHQUNKOzs7OztBQUtELFlBQVUsRUFBQSxzQkFBRzs7QUFFWCxRQUFJLENBQUMsWUFBWSxHQUFHLEVBQUUsQ0FBQztBQUN2QixRQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQzs7QUFFcEIsUUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLElBQUksd0NBQW9CLE9BQU8sQ0FBQyxPQUFPLENBQUM7QUFDM0UsUUFBTSxZQUFZLEdBQUcsd0RBQW1DO0FBQ3RELGFBQU8sRUFBRSxFQUFFLE9BQU8sRUFBUCxPQUFPLEVBQUU7S0FDckIsQ0FBQyxDQUFDOztBQUVILFFBQUksQ0FBQyx5QkFBeUIsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUM3QyxRQUFJLENBQUMsMEJBQTBCLHNDQUFrQixDQUFDO0FBQ2xELFFBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztHQUNoRDs7Ozs7O0FBTUQsMkJBQXlCLEVBQUEsbUNBQUMsSUFBSSxFQUFFO0FBQzlCLFFBQUksQ0FBQyxZQUFZLEdBQUcsZUFBYyxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzNELDBCQUFTLHlCQUF5QixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztHQUN2RDs7Ozs7O0FBTUQsNEJBQTBCLEVBQUEsb0NBQUMsSUFBSSxFQUFFO0FBQy9CLFFBQUksQ0FBQyxTQUFTLEdBQUcsZUFBYyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3JELDBCQUFTLDBCQUEwQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztHQUNyRDs7Ozs7O0FBTUQsaUJBQWUsRUFBQSx5QkFBQyxFQUFFLEVBQUU7QUFDbEIsUUFBTSxVQUFVLEdBQUcsRUFBRSxZQUFZLE9BQU8sR0FBRyxFQUFFLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUMzRSw2QkFBWSxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztHQUMxQzs7Q0FFRixDQUFDOztxQkFFYSxNQUFNIiwiZmlsZSI6InNyYy9jbGllbnQvY29yZS9jbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2lnbmFsIGZyb20gJy4vU2lnbmFsJztcbmltcG9ydCBBY3Rpdml0eSBmcm9tICcuL0FjdGl2aXR5JztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCB2aWV3TWFuYWdlciBmcm9tICcuL3ZpZXdNYW5hZ2VyJztcbmltcG9ydCBzb2NrZXQgZnJvbSAnLi9zb2NrZXQnO1xuaW1wb3J0IGRlZmF1bHRUZXh0Q29udGVudHMgZnJvbSAnLi4vZGlzcGxheS9kZWZhdWx0VGV4dENvbnRlbnRzJztcbmltcG9ydCBkZWZhdWx0VGVtcGxhdGVzIGZyb20gJy4uL2Rpc3BsYXkvZGVmYXVsdFRlbXBsYXRlcyc7XG5cblxuY29uc3QgY2xpZW50ID0ge1xuICAvKipcbiAgICogVGhlIHtAbGluayBTaWduYWx9IHVzZWQgdG8gYm9vdHN0cmFwIHRoZSB3aG9sZSBhcHBsaWNhdGlvbi5cbiAgICogQHR5cGUge1NpZ25hbH1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIC8vIHNpZ25hbHM6IHsgcmVhZHk6IG5ldyBTaWduYWwoKSB9LFxuXG4gICAvKipcbiAgICogU29ja2V0LmlvIHdyYXBwZXIgdXNlZCB0byBjb21tdW5pY2F0ZSB3aXRoIHRoZSBzZXJ2ZXIsIGlmIGFueSAoc2VlIHtAbGluayBzb2NrZXR9LlxuICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc29ja2V0OiBudWxsLFxuXG4gIC8qKlxuICAgKiBJbmZvcm1hdGlvbiBhYm91dCB0aGUgY2xpZW50IHBsYXRmb3JtLlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gb3MgT3BlcmF0aW5nIHN5c3RlbS5cbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBpc01vYmlsZSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgY2xpZW50IGlzIHJ1bm5pbmcgb24gYVxuICAgKiBtb2JpbGUgcGxhdGZvcm0gb3Igbm90LlxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gYXVkaW9GaWxlRXh0IEF1ZGlvIGZpbGUgZXh0ZW5zaW9uIHRvIHVzZSwgZGVwZW5kaW5nIG9uXG4gICAqIHRoZSBwbGF0Zm9ybSAoKVxuICAgKi9cbiAgcGxhdGZvcm06IHtcbiAgICBvczogbnVsbCxcbiAgICBpc01vYmlsZTogbnVsbCxcbiAgICBhdWRpb0ZpbGVFeHQ6ICcnLFxuICB9LFxuXG4gIC8qKlxuICAgKiBDbGllbnQgdHlwZS5cbiAgICogVGhlIGNsaWVudCB0eXBlIGlzIHNwZWZpY2llZCBpbiB0aGUgYXJndW1lbnQgb2YgdGhlIGBpbml0YCBtZXRob2QuIEZvclxuICAgKiBpbnN0YW5jZSwgYCdwbGF5ZXInYCBpcyB0aGUgY2xpZW50IHR5cGUgeW91IHNob3VsZCBiZSB1c2luZyBieSBkZWZhdWx0LlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgdHlwZTogbnVsbCxcblxuICAvKipcbiAgICogUHJvbWlzZSByZXNvbHZlZCB3aGVuIHRoZSBzZXJ2ZXIgc2VuZHMgYSBtZXNzYWdlIGluZGljYXRpbmcgdGhhdCB0aGUgY2xpZW50XG4gICAqIGNhbiBzdGFydCB0aGUgZmlyc3QgbWR1bGUuXG4gICAqIEB0eXBlIHtQcm9taXNlfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVhZHk6IG51bGwsXG5cbiAgLyoqXG4gICAqIENsaWVudCB1bmlxdWUgaWQsIGdpdmVuIGJ5IHRoZSBzZXJ2ZXIuXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICB1dWlkOiBudWxsLFxuXG4gIC8qKlxuICAgKiBDbGllbnQgY29vcmRpbmF0ZXMgKGlmIGFueSkgZ2l2ZW4gYnkgYSB7QGxpbmsgTG9jYXRvcn0sIHtAbGluayBQbGFjZXJ9IG9yXG4gICAqIHtAbGluayBDaGVja2lufSBtb2R1bGUuIChGb3JtYXQ6IGBbeDpOdW1iZXIsIHk6TnVtYmVyXWAuKVxuICAgKiBAdHlwZSB7QXJyYXk8TnVtYmVyPn1cbiAgICovXG4gIGNvb3JkaW5hdGVzOiBudWxsLFxuXG4gIC8qKlxuICAgKiBUaWNrZXQgaW5kZXggKGlmIGFueSkgZ2l2ZW4gYnkgYSB7QGxpbmsgUGxhY2VyfSBvclxuICAgKiB7QGxpbmsgQ2hlY2tpbn0gbW9kdWxlLlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgaW5kZXg6IG51bGwsXG5cbiAgLyoqXG4gICAqIFRpY2tldCBsYWJlbCAoaWYgYW55KSBnaXZlbiBieSBhIHtAbGluayBQbGFjZXJ9IG9yXG4gICAqIHtAbGluayBDaGVja2lufSBtb2R1bGUuXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICBsYWJlbDogbnVsbCxcblxuICAvKipcbiAgICogSXMgc2V0IHRvIGB0cnVlYCBvciBgZmFsc2VgIGJ5IHRoZSBgV2VsY29tZWAgc2VydmljZSBhbmQgZGVmaW5lcyBpZiB0aGUgY2xpZW50IG1lZXQgdGhlIHJlcXVpcmVtZW50cyBvZiB0aGUgYXBwbGljYXRpb24uXG4gICAqIEVzcGVjaWFsbHkgdXNlZnVsbCB3aGVuIHRoZSBgV2VsY29tZWAgc2VydmljZSBpcyB1c2VkIHdpdGhvdXQgYSB2aWV3IGFuZCBhY3RpdmF0ZWQgbWFudWFsbHkuXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKi9cbiAgY29tcGF0aWJsZTogbnVsbCxcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0aGUgYXBwbGljYXRpb24uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbY2xpZW50VHlwZSA9ICdwbGF5ZXInXSAtIFRoZSBjbGllbnQgdHlwZSB0byBkZWZpbmUgdGhlIHNvY2tldCBuYW1lc3BhY2UsIHNob3VsZCBtYXRjaCBhIGNsaWVudCB0eXBlIGRlZmluZWQgc2VydmVyIHNpZGUgKGlmIGFueSkuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbY29uZmlnPXt9XSAtIFRoZSBjb25maWcgdG8gaW5pdGlhbGl6ZSBhIGNsaWVudFxuICAgKiBAcGFyYW0ge09iamVjdH0gW2NvbmZpZy5zb2NrZXRJTy51cmw9JyddIC0gVGhlIHVybCB3aGVyZSB0aGUgc29ja2V0IHNob3VsZCBjb25uZWN0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gW2NvbmZpZy5zb2NrZXRJTy50cmFuc3BvcnRzPVsnd2Vic29ja2V0J11dIC0gVGhlIHRyYW5zcG9ydCB1c2VkIHRvIGNyZWF0ZSB0aGUgdXJsIChvdmVycmlkZXMgZGVmYXVsdCBzb2NrZXQuaW8gbWVjYW5pc20pLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW2NvbmZpZy5hcHBDb250YWluZXI9JyNjb250YWluZXInXSAtIEEgc2VsZWN0b3IgbWF0Y2hpbmcgYSBET00gZWxlbWVudCB3aGVyZSB0aGUgdmlld3Mgc2hvdWxkIGJlIGluc2VydGVkLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW2NvbmZpZy5kZWJ1Z0lPPWZhbHNlXSAtIElmIHNldCB0byBgdHJ1ZWAsIHNob3cgc29ja2V0LmlvIGRlYnVnIGluZm9ybWF0aW9ucy5cbiAgICovXG4gIGluaXQoY2xpZW50VHlwZSA9ICdwbGF5ZXInLCBjb25maWcgPSB7fSkge1xuICAgIHRoaXMudHlwZSA9IGNsaWVudFR5cGU7XG5cbiAgICAvLyAxLiBpZiBzb2NrZXQgY29uZmlnIGdpdmVuLCBtaXggaXQgd2l0aCBkZWZhdWx0cy5cbiAgICBjb25zdCBzb2NrZXRJTyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgdXJsOiAnJyxcbiAgICAgIHRyYW5zcG9ydHM6IFsnd2Vic29ja2V0J11cbiAgICB9LCBjb25maWcuc29ja2V0SU8pO1xuXG4gICAgLy8gMi4gbWl4IGFsbCBvdGhlciBjb25maWcgYW5kIG92ZXJyaWRlIHdpdGggZGVmaW5lZCBzb2NrZXQgY29uZmlnLlxuICAgIHRoaXMuY29uZmlnID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICBkZWJ1Z0lPOiBmYWxzZSxcbiAgICAgIGFwcENvbnRhaW5lcjogJyNjb250YWluZXInLFxuICAgIH0sIGNvbmZpZywgeyBzb2NrZXRJTyB9KTtcblxuICAgIHNlcnZpY2VNYW5hZ2VyLmluaXQoKTtcbiAgICB0aGlzLl9pbml0Vmlld3MoKTtcbiAgfSxcblxuICAvKipcbiAgICogKiBJbml0aWFsaXplIHRoZSBhcHBsaWNhdGlvbi5cbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIC8vIGluaXQgc29ja2V0XG4gICAgaWYgKHNvY2tldC5yZXF1aXJlZClcbiAgICAgIHRoaXMuX2luaXRTb2NrZXQoKTtcbiAgICBlbHNlXG4gICAgICBzZXJ2aWNlTWFuYWdlci5zdGFydCgpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc2VydmljZSBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIFRoZSBpZGVudGlmaWVyIG9mIHRoZSBzZXJ2aWNlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFRoZSBvcHRpb25zIHRvIGNvbmZpZ3VyZSB0aGUgc2VydmljZS5cbiAgICovXG4gIHJlcXVpcmUoaWQsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gc2VydmljZU1hbmFnZXIucmVxdWlyZShpZCwgb3B0aW9ucyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEB0b2RvIC0gcmVmYWN0b3IgaGFuZHNoYWtlLlxuICAgKiBJbml0aWFsaXplIHNvY2tldCBjb25uZWN0aW9uIGFuZCBwZXJmb3JtIGhhbmRzaGFrZSB3aXRoIHRoZSBzZXJ2ZXIuXG4gICAqL1xuICBfaW5pdFNvY2tldCgpIHtcbiAgICAvLyBpbml0aWFsaXplIHNvY2tldCBjb21tdW5pY2F0aW9uc1xuICAgIHRoaXMuc29ja2V0ID0gc29ja2V0LmluaXRpYWxpemUodGhpcy50eXBlLCB0aGlzLmNvbmZpZy5zb2NrZXRJTyk7XG4gICAgLy8gd2FpdCBmb3IgaGFuZHNoYWtlIHRvIG1hcmsgY2xpZW50IGFzIGByZWFkeWBcbiAgICB0aGlzLnNvY2tldC5yZWNlaXZlKCdjbGllbnQ6c3RhcnQnLCAodXVpZCkgPT4ge1xuICAgICAgLy8gZG9uJ3QgaGFuZGxlIHNlcnZlciByZXN0YXJ0IGZvciBub3cuXG4gICAgICB0aGlzLnV1aWQgPSB1dWlkO1xuICAgICAgc2VydmljZU1hbmFnZXIuc3RhcnQoKTtcblxuICAgICAgLy8gdGhpcy5jb21tLnJlY2VpdmUoJ3JlY29ubmVjdCcsICgpID0+IGNvbnNvbGUuaW5mbygncmVjb25uZWN0JykpO1xuICAgICAgLy8gdGhpcy5jb21tLnJlY2VpdmUoJ2Rpc2Nvbm5lY3QnLCAoKSA9PiB7XG4gICAgICAvLyAgIGNvbnNvbGUuaW5mbygnZGlzY29ubmVjdCcpXG4gICAgICAvLyAgIHNlcnZpY2VNYW5hZ2VyLnJlc2V0KCk7IC8vIGNhbiByZWxhdW5jaCBzZXJ2aWNlTWFuYWdlciBvbiByZWNvbm5lY3Rpb24uXG4gICAgICAvLyB9KTtcbiAgICAgIC8vIHRoaXMuY29tbS5yZWNlaXZlKCdlcnJvcicsIChlcnIpID0+IGNvbnNvbGUuZXJyb3IoZXJyKSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGVtcGxhdGVzIGZvciBhbGxcbiAgICovXG4gIF9pbml0Vmlld3MoKSB7XG4gICAgLy8gaW5pdGlhbGl6ZSBtb2R1bGVzIHZpZXdzIHdpdGggZGVmYXVsdCB0ZXh0cyBhbmQgdGVtcGxhdGVzXG4gICAgdGhpcy50ZXh0Q29udGVudHMgPSB7fTtcbiAgICB0aGlzLnRlbXBsYXRlcyA9IHt9O1xuXG4gICAgY29uc3QgYXBwTmFtZSA9IHRoaXMuY29uZmlnLmFwcE5hbWUgfHzCoGRlZmF1bHRUZXh0Q29udGVudHMuZ2xvYmFscy5hcHBOYW1lO1xuICAgIGNvbnN0IHRleHRDb250ZW50cyA9IE9iamVjdC5hc3NpZ24oZGVmYXVsdFRleHRDb250ZW50cywge1xuICAgICAgZ2xvYmFsczogeyBhcHBOYW1lIH1cbiAgICB9KTtcblxuICAgIHRoaXMuc2V0Vmlld0NvbnRlbnREZWZpbml0aW9ucyh0ZXh0Q29udGVudHMpO1xuICAgIHRoaXMuc2V0Vmlld1RlbXBsYXRlRGVmaW5pdGlvbnMoZGVmYXVsdFRlbXBsYXRlcyk7XG4gICAgdGhpcy5zZXRBcHBDb250YWluZXIodGhpcy5jb25maWcuYXBwQ29udGFpbmVyKTtcbiAgfSxcblxuICAvKipcbiAgICogRXh0ZW5kIGFwcGxpY2F0aW9uIHRleHQgY29udGVudHMgd2l0aCB0aGUgZ2l2ZW4gb2JqZWN0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGVudHMgLSBUaGUgdGV4dCBjb250ZW50cyB0byBwcm9wYWdhdGUgdG8gbW9kdWxlcy5cbiAgICovXG4gIHNldFZpZXdDb250ZW50RGVmaW5pdGlvbnMoZGVmcykge1xuICAgIHRoaXMudGV4dENvbnRlbnRzID0gT2JqZWN0LmFzc2lnbih0aGlzLnRleHRDb250ZW50cywgZGVmcyk7XG4gICAgQWN0aXZpdHkuc2V0Vmlld0NvbnRlbnREZWZpbml0aW9ucyh0aGlzLnRleHRDb250ZW50cyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEV4dGVuZCBhcHBsaWNhdGlvbiB0ZW1wbGF0ZXMgd2l0aCB0aGUgZ2l2ZW4gb2JqZWN0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gdGVtcGxhdGVzIC0gVGhlIHRlbXBsYXRlcyB0byBwcm9wYWdhdGUgdG8gbW9kdWxlcy5cbiAgICovXG4gIHNldFZpZXdUZW1wbGF0ZURlZmluaXRpb25zKGRlZnMpIHtcbiAgICB0aGlzLnRlbXBsYXRlcyA9IE9iamVjdC5hc3NpZ24odGhpcy50ZW1wbGF0ZXMsIGRlZnMpO1xuICAgIEFjdGl2aXR5LnNldFZpZXdUZW1wbGF0ZURlZmluaXRpb25zKHRoaXMudGVtcGxhdGVzKTtcbiAgfSxcblxuICAvKipcbiAgICogU2V0cyB0aGUgZGVmYXVsdCB2aWV3IGNvbnRhaW5lciBmb3IgYWxsIGBDbGllbnRNb2R1bGVgc1xuICAgKiBAcGFyYW0ge1N0cmluZ3xFbGVtZW50fSBlbCAtIEEgRE9NIGVsZW1lbnQgb3IgYSBjc3Mgc2VsZWN0b3IgbWF0Y2hpbmcgdGhlIGVsZW1lbnQgdG8gdXNlIGFzIGEgY29udGFpbmVyLlxuICAgKi9cbiAgc2V0QXBwQ29udGFpbmVyKGVsKSB7XG4gICAgY29uc3QgJGNvbnRhaW5lciA9IGVsIGluc3RhbmNlb2YgRWxlbWVudCA/IGVsIDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbCk7XG4gICAgdmlld01hbmFnZXIuc2V0Vmlld0NvbnRhaW5lcigkY29udGFpbmVyKTtcbiAgfSxcblxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xpZW50O1xuIl19