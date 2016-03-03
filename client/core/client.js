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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L2NvcmUvY2xpZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7c0JBQW1CLFVBQVU7Ozs7d0JBQ1IsWUFBWTs7Ozs4QkFDTixrQkFBa0I7Ozs7MkJBQ3JCLGVBQWU7Ozs7c0JBQ3BCLFVBQVU7Ozs7MENBQ0csZ0NBQWdDOzs7O3VDQUNuQyw2QkFBNkI7Ozs7QUFHMUQsSUFBTSxNQUFNLEdBQUc7Ozs7O0FBS2IsTUFBSSxFQUFFLElBQUk7Ozs7Ozs7O0FBUVYsTUFBSSxFQUFFLElBQUk7Ozs7Ozs7QUFPVixRQUFNLEVBQUUsSUFBSTs7Ozs7Ozs7Ozs7QUFXWixVQUFRLEVBQUU7QUFDUixNQUFFLEVBQUUsSUFBSTtBQUNSLFlBQVEsRUFBRSxJQUFJO0FBQ2QsZ0JBQVksRUFBRSxFQUFFO0dBQ2pCOzs7Ozs7O0FBT0QsYUFBVyxFQUFFLElBQUk7Ozs7Ozs7QUFPakIsT0FBSyxFQUFFLElBQUk7Ozs7Ozs7QUFPWCxPQUFLLEVBQUUsSUFBSTs7Ozs7Ozs7QUFRWCxZQUFVLEVBQUUsSUFBSTs7Ozs7Ozs7Ozs7QUFXaEIsTUFBSSxFQUFBLGdCQUFxQztRQUFwQyxVQUFVLHlEQUFHLFFBQVE7UUFBRSxNQUFNLHlEQUFHLEVBQUU7O0FBQ3JDLFFBQUksQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDOzs7QUFHdkIsUUFBTSxRQUFRLEdBQUcsZUFBYztBQUM3QixTQUFHLEVBQUUsRUFBRTtBQUNQLGdCQUFVLEVBQUUsQ0FBQyxXQUFXLENBQUM7S0FDMUIsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7OztBQUdwQixRQUFJLENBQUMsTUFBTSxHQUFHLGVBQWM7QUFDMUIsYUFBTyxFQUFFLEtBQUs7QUFDZCxrQkFBWSxFQUFFLFlBQVk7S0FDM0IsRUFBRSxNQUFNLEVBQUUsRUFBRSxRQUFRLEVBQVIsUUFBUSxFQUFFLENBQUMsQ0FBQzs7QUFFekIsZ0NBQWUsSUFBSSxFQUFFLENBQUM7QUFDdEIsUUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0dBQ25COzs7OztBQUtELE9BQUssRUFBQSxpQkFBRztBQUNOLFFBQUksb0JBQU8sUUFBUSxFQUNqQixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsS0FFbkIsNEJBQWUsS0FBSyxFQUFFLENBQUM7R0FDMUI7Ozs7Ozs7QUFPRCxTQUFPLEVBQUEsaUJBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRTtBQUNuQixXQUFPLDRCQUFlLE9BQU8sQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7R0FDNUM7Ozs7OztBQU1ELGFBQVcsRUFBQSx1QkFBRzs7O0FBQ1osUUFBSSxDQUFDLE1BQU0sR0FBRyxvQkFBTyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUVqRSxRQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsVUFBQyxJQUFJLEVBQUs7O0FBRTVDLFlBQUssSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixrQ0FBZSxLQUFLLEVBQUUsQ0FBQzs7Ozs7Ozs7S0FReEIsQ0FBQyxDQUFDO0dBQ0o7Ozs7O0FBS0QsWUFBVSxFQUFBLHNCQUFHOztBQUVYLFFBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO0FBQ3ZCLFFBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDOztBQUVwQixRQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sSUFBSSx3Q0FBb0IsT0FBTyxDQUFDLE9BQU8sQ0FBQztBQUMzRSxRQUFNLFlBQVksR0FBRyx3REFBbUMsRUFBRSxPQUFPLEVBQUUsRUFBRSxPQUFPLEVBQVAsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDOztBQUVsRixRQUFJLENBQUMseUJBQXlCLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDN0MsUUFBSSxDQUFDLDBCQUEwQixzQ0FBa0IsQ0FBQztBQUNsRCxRQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7R0FDaEQ7Ozs7OztBQU1ELDJCQUF5QixFQUFBLG1DQUFDLElBQUksRUFBRTtBQUM5QixRQUFJLENBQUMsWUFBWSxHQUFHLGVBQWMsSUFBSSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUMzRCwwQkFBUyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7R0FDdkQ7Ozs7OztBQU1ELDRCQUEwQixFQUFBLG9DQUFDLElBQUksRUFBRTtBQUMvQixRQUFJLENBQUMsU0FBUyxHQUFHLGVBQWMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNyRCwwQkFBUywwQkFBMEIsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7R0FDckQ7Ozs7Ozs7QUFPRCxpQkFBZSxFQUFBLHlCQUFDLEVBQUUsRUFBRTtBQUNsQixRQUFNLFVBQVUsR0FBRyxFQUFFLFlBQVksT0FBTyxHQUFHLEVBQUUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzNFLDZCQUFZLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0dBQzFDOztDQUVGLENBQUM7O3FCQUVhLE1BQU0iLCJmaWxlIjoiL1VzZXJzL3NjaG5lbGwvRGV2ZWxvcG1lbnQvd2ViL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9zb3VuZHdvcmtzL3NyYy9jbGllbnQvY29yZS9jbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2lnbmFsIGZyb20gJy4vU2lnbmFsJztcbmltcG9ydCBBY3Rpdml0eSBmcm9tICcuL0FjdGl2aXR5JztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCB2aWV3TWFuYWdlciBmcm9tICcuL3ZpZXdNYW5hZ2VyJztcbmltcG9ydCBzb2NrZXQgZnJvbSAnLi9zb2NrZXQnO1xuaW1wb3J0IGRlZmF1bHRUZXh0Q29udGVudHMgZnJvbSAnLi4vZGlzcGxheS9kZWZhdWx0VGV4dENvbnRlbnRzJztcbmltcG9ydCBkZWZhdWx0VGVtcGxhdGVzIGZyb20gJy4uL2Rpc3BsYXkvZGVmYXVsdFRlbXBsYXRlcyc7XG5cblxuY29uc3QgY2xpZW50ID0ge1xuICAvKipcbiAgICogQ2xpZW50IHVuaXF1ZSBpZCwgZ2l2ZW4gYnkgdGhlIHNlcnZlci5cbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHV1aWQ6IG51bGwsXG5cbiAgLyoqXG4gICAqIENsaWVudCB0eXBlLlxuICAgKiBUaGUgY2xpZW50IHR5cGUgaXMgc3BlZmljaWVkIGluIHRoZSBhcmd1bWVudCBvZiB0aGUgYGluaXRgIG1ldGhvZC4gRm9yXG4gICAqIGluc3RhbmNlLCBgJ3BsYXllcidgIGlzIHRoZSBjbGllbnQgdHlwZSB5b3Ugc2hvdWxkIGJlIHVzaW5nIGJ5IGRlZmF1bHQuXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICB0eXBlOiBudWxsLFxuXG4gICAvKipcbiAgICogU29ja2V0LmlvIHdyYXBwZXIgdXNlZCB0byBjb21tdW5pY2F0ZSB3aXRoIHRoZSBzZXJ2ZXIsIGlmIGFueSAoc2VlIHtAbGluayBzb2NrZXR9LlxuICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc29ja2V0OiBudWxsLFxuXG4gIC8qKlxuICAgKiBJbmZvcm1hdGlvbiBhYm91dCB0aGUgY2xpZW50IHBsYXRmb3JtLlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gb3MgT3BlcmF0aW5nIHN5c3RlbS5cbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBpc01vYmlsZSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgY2xpZW50IGlzIHJ1bm5pbmcgb24gYVxuICAgKiBtb2JpbGUgcGxhdGZvcm0gb3Igbm90LlxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gYXVkaW9GaWxlRXh0IEF1ZGlvIGZpbGUgZXh0ZW5zaW9uIHRvIHVzZSwgZGVwZW5kaW5nIG9uXG4gICAqIHRoZSBwbGF0Zm9ybSAoKVxuICAgKi9cbiAgcGxhdGZvcm06IHtcbiAgICBvczogbnVsbCxcbiAgICBpc01vYmlsZTogbnVsbCxcbiAgICBhdWRpb0ZpbGVFeHQ6ICcnLFxuICB9LFxuXG4gIC8qKlxuICAgKiBDbGllbnQgY29vcmRpbmF0ZXMgKGlmIGFueSkgZ2l2ZW4gYnkgYSB7QGxpbmsgTG9jYXRvcn0sIHtAbGluayBQbGFjZXJ9IG9yXG4gICAqIHtAbGluayBDaGVja2lufSBtb2R1bGUuIChGb3JtYXQ6IGBbeDpOdW1iZXIsIHk6TnVtYmVyXWAuKVxuICAgKiBAdHlwZSB7QXJyYXk8TnVtYmVyPn1cbiAgICovXG4gIGNvb3JkaW5hdGVzOiBudWxsLFxuXG4gIC8qKlxuICAgKiBUaWNrZXQgaW5kZXggKGlmIGFueSkgZ2l2ZW4gYnkgYSB7QGxpbmsgUGxhY2VyfSBvclxuICAgKiB7QGxpbmsgQ2hlY2tpbn0gbW9kdWxlLlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgaW5kZXg6IG51bGwsXG5cbiAgLyoqXG4gICAqIFRpY2tldCBsYWJlbCAoaWYgYW55KSBnaXZlbiBieSBhIHtAbGluayBQbGFjZXJ9IG9yXG4gICAqIHtAbGluayBDaGVja2lufSBtb2R1bGUuXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICBsYWJlbDogbnVsbCxcblxuICAvKipcbiAgICogSXMgc2V0IHRvIGB0cnVlYCBvciBgZmFsc2VgIGJ5IHRoZSBgV2VsY29tZWAgc2VydmljZSBhbmQgZGVmaW5lcyBpZiB0aGVcbiAgICogY2xpZW50IG1lZXRzIHRoZSByZXF1aXJlbWVudHMgb2YgdGhlIGFwcGxpY2F0aW9uLiAoU2hvdWxkIGJlIHVzZWZ1bGwgd2hlblxuICAgKiB0aGUgYFdlbGNvbWVgIHNlcnZpY2UgaXMgdXNlZCB3aXRob3V0IGEgdmlldyBhbmQgYWN0aXZhdGVkIG1hbnVhbGx5KVxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICovXG4gIGNvbXBhdGlibGU6IG51bGwsXG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIGFwcGxpY2F0aW9uLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW2NsaWVudFR5cGUgPSAncGxheWVyJ10gLSBUaGUgY2xpZW50IHR5cGUgdG8gZGVmaW5lIHRoZSBzb2NrZXQgbmFtZXNwYWNlLCBzaG91bGQgbWF0Y2ggYSBjbGllbnQgdHlwZSBkZWZpbmVkIHNlcnZlciBzaWRlIChpZiBhbnkpLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW2NvbmZpZz17fV0gLSBUaGUgY29uZmlnIHRvIGluaXRpYWxpemUgYSBjbGllbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IFtjb25maWcuc29ja2V0SU8udXJsPScnXSAtIFRoZSB1cmwgd2hlcmUgdGhlIHNvY2tldCBzaG91bGQgY29ubmVjdC5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtjb25maWcuc29ja2V0SU8udHJhbnNwb3J0cz1bJ3dlYnNvY2tldCddXSAtIFRoZSB0cmFuc3BvcnQgdXNlZCB0byBjcmVhdGUgdGhlIHVybCAob3ZlcnJpZGVzIGRlZmF1bHQgc29ja2V0LmlvIG1lY2FuaXNtKS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtjb25maWcuYXBwQ29udGFpbmVyPScjY29udGFpbmVyJ10gLSBBIHNlbGVjdG9yIG1hdGNoaW5nIGEgRE9NIGVsZW1lbnQgd2hlcmUgdGhlIHZpZXdzIHNob3VsZCBiZSBpbnNlcnRlZC5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtjb25maWcuZGVidWdJTz1mYWxzZV0gLSBJZiBzZXQgdG8gYHRydWVgLCBzaG93IHNvY2tldC5pbyBkZWJ1ZyBpbmZvcm1hdGlvbnMuXG4gICAqL1xuICBpbml0KGNsaWVudFR5cGUgPSAncGxheWVyJywgY29uZmlnID0ge30pIHtcbiAgICB0aGlzLnR5cGUgPSBjbGllbnRUeXBlO1xuXG4gICAgLy8gMS4gaWYgc29ja2V0IGNvbmZpZyBnaXZlbiwgbWl4IGl0IHdpdGggZGVmYXVsdHMuXG4gICAgY29uc3Qgc29ja2V0SU8gPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIHVybDogJycsXG4gICAgICB0cmFuc3BvcnRzOiBbJ3dlYnNvY2tldCddXG4gICAgfSwgY29uZmlnLnNvY2tldElPKTtcblxuICAgIC8vIDIuIG1peCBhbGwgb3RoZXIgY29uZmlnIGFuZCBvdmVycmlkZSB3aXRoIGRlZmluZWQgc29ja2V0IGNvbmZpZy5cbiAgICB0aGlzLmNvbmZpZyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgZGVidWdJTzogZmFsc2UsXG4gICAgICBhcHBDb250YWluZXI6ICcjY29udGFpbmVyJyxcbiAgICB9LCBjb25maWcsIHsgc29ja2V0SU8gfSk7XG5cbiAgICBzZXJ2aWNlTWFuYWdlci5pbml0KCk7XG4gICAgdGhpcy5faW5pdFZpZXdzKCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBhcHBsaWNhdGlvbi5cbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIGlmIChzb2NrZXQucmVxdWlyZWQpXG4gICAgICB0aGlzLl9pbml0U29ja2V0KCk7XG4gICAgZWxzZVxuICAgICAgc2VydmljZU1hbmFnZXIuc3RhcnQoKTtcbiAgfSxcblxuICAvKipcbiAgICogUmV0dXJucyBhIHNlcnZpY2UgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBUaGUgaWRlbnRpZmllciBvZiB0aGUgc2VydmljZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBUaGUgb3B0aW9ucyB0byBjb25maWd1cmUgdGhlIHNlcnZpY2UuXG4gICAqL1xuICByZXF1aXJlKGlkLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIHNlcnZpY2VNYW5hZ2VyLnJlcXVpcmUoaWQsIG9wdGlvbnMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBAdG9kbyAtIHJlZmFjdG9yIGhhbmRzaGFrZS5cbiAgICogSW5pdGlhbGl6ZSBzb2NrZXQgY29ubmVjdGlvbiBhbmQgcGVyZm9ybSBoYW5kc2hha2Ugd2l0aCB0aGUgc2VydmVyLlxuICAgKi9cbiAgX2luaXRTb2NrZXQoKSB7XG4gICAgdGhpcy5zb2NrZXQgPSBzb2NrZXQuaW5pdGlhbGl6ZSh0aGlzLnR5cGUsIHRoaXMuY29uZmlnLnNvY2tldElPKTtcbiAgICAvLyB3YWl0IGZvciBoYW5kc2hha2UgdG8gbWFyayBjbGllbnQgYXMgYHJlYWR5YFxuICAgIHRoaXMuc29ja2V0LnJlY2VpdmUoJ2NsaWVudDpzdGFydCcsICh1dWlkKSA9PiB7XG4gICAgICAvLyBkb24ndCBoYW5kbGUgc2VydmVyIHJlc3RhcnQgZm9yIG5vdy5cbiAgICAgIHRoaXMudXVpZCA9IHV1aWQ7XG4gICAgICBzZXJ2aWNlTWFuYWdlci5zdGFydCgpO1xuXG4gICAgICAvLyB0aGlzLmNvbW0ucmVjZWl2ZSgncmVjb25uZWN0JywgKCkgPT4gY29uc29sZS5pbmZvKCdyZWNvbm5lY3QnKSk7XG4gICAgICAvLyB0aGlzLmNvbW0ucmVjZWl2ZSgnZGlzY29ubmVjdCcsICgpID0+IHtcbiAgICAgIC8vICAgY29uc29sZS5pbmZvKCdkaXNjb25uZWN0JylcbiAgICAgIC8vICAgc2VydmljZU1hbmFnZXIucmVzZXQoKTsgLy8gY2FuIHJlbGF1bmNoIHNlcnZpY2VNYW5hZ2VyIG9uIHJlY29ubmVjdGlvbi5cbiAgICAgIC8vIH0pO1xuICAgICAgLy8gdGhpcy5jb21tLnJlY2VpdmUoJ2Vycm9yJywgKGVycikgPT4gY29uc29sZS5lcnJvcihlcnIpKTtcbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0ZW1wbGF0ZXMgZm9yIGFsbFxuICAgKi9cbiAgX2luaXRWaWV3cygpIHtcbiAgICAvLyBpbml0aWFsaXplIG1vZHVsZXMgdmlld3Mgd2l0aCBkZWZhdWx0IHRleHRzIGFuZCB0ZW1wbGF0ZXNcbiAgICB0aGlzLnRleHRDb250ZW50cyA9IHt9O1xuICAgIHRoaXMudGVtcGxhdGVzID0ge307XG5cbiAgICBjb25zdCBhcHBOYW1lID0gdGhpcy5jb25maWcuYXBwTmFtZSB8fMKgZGVmYXVsdFRleHRDb250ZW50cy5nbG9iYWxzLmFwcE5hbWU7XG4gICAgY29uc3QgdGV4dENvbnRlbnRzID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0VGV4dENvbnRlbnRzLCB7IGdsb2JhbHM6IHsgYXBwTmFtZSB9IH0pO1xuXG4gICAgdGhpcy5zZXRWaWV3Q29udGVudERlZmluaXRpb25zKHRleHRDb250ZW50cyk7XG4gICAgdGhpcy5zZXRWaWV3VGVtcGxhdGVEZWZpbml0aW9ucyhkZWZhdWx0VGVtcGxhdGVzKTtcbiAgICB0aGlzLnNldEFwcENvbnRhaW5lcih0aGlzLmNvbmZpZy5hcHBDb250YWluZXIpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBFeHRlbmQgYXBwbGljYXRpb24gdGV4dCBjb250ZW50cyB3aXRoIHRoZSBnaXZlbiBvYmplY3QuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZW50cyAtIFRoZSB0ZXh0IGNvbnRlbnRzIHRvIHByb3BhZ2F0ZSB0byBtb2R1bGVzLlxuICAgKi9cbiAgc2V0Vmlld0NvbnRlbnREZWZpbml0aW9ucyhkZWZzKSB7XG4gICAgdGhpcy50ZXh0Q29udGVudHMgPSBPYmplY3QuYXNzaWduKHRoaXMudGV4dENvbnRlbnRzLCBkZWZzKTtcbiAgICBBY3Rpdml0eS5zZXRWaWV3Q29udGVudERlZmluaXRpb25zKHRoaXMudGV4dENvbnRlbnRzKTtcbiAgfSxcblxuICAvKipcbiAgICogRXh0ZW5kIGFwcGxpY2F0aW9uIHRlbXBsYXRlcyB3aXRoIHRoZSBnaXZlbiBvYmplY3QuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB0ZW1wbGF0ZXMgLSBUaGUgdGVtcGxhdGVzIHRvIHByb3BhZ2F0ZSB0byBtb2R1bGVzLlxuICAgKi9cbiAgc2V0Vmlld1RlbXBsYXRlRGVmaW5pdGlvbnMoZGVmcykge1xuICAgIHRoaXMudGVtcGxhdGVzID0gT2JqZWN0LmFzc2lnbih0aGlzLnRlbXBsYXRlcywgZGVmcyk7XG4gICAgQWN0aXZpdHkuc2V0Vmlld1RlbXBsYXRlRGVmaW5pdGlvbnModGhpcy50ZW1wbGF0ZXMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBkZWZhdWx0IHZpZXcgY29udGFpbmVyIGZvciBhbGwgYENsaWVudE1vZHVsZWBzXG4gICAqIEBwYXJhbSB7U3RyaW5nfEVsZW1lbnR9IGVsIC0gRE9NIGVsZW1lbnQgKG9yIGNzcyBzZWxlY3RvciBtYXRjaGluZ1xuICAgKiAgYW4gZXhpc3RpbmcgZWxlbWVudCkgdG8gYmUgdXNlZCBhcyB0aGUgY29udGFpbmVyIG9mIHRoZSBhcHBsaWNhdGlvbi5cbiAgICovXG4gIHNldEFwcENvbnRhaW5lcihlbCkge1xuICAgIGNvbnN0ICRjb250YWluZXIgPSBlbCBpbnN0YW5jZW9mIEVsZW1lbnQgPyBlbCA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWwpO1xuICAgIHZpZXdNYW5hZ2VyLnNldFZpZXdDb250YWluZXIoJGNvbnRhaW5lcik7XG4gIH0sXG5cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsaWVudDtcbiJdfQ==