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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvY29yZS9jbGllbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztzQkFBbUIsVUFBVTs7Ozt3QkFDUixZQUFZOzs7OzhCQUNOLGtCQUFrQjs7OzsyQkFDckIsZUFBZTs7OztzQkFDcEIsVUFBVTs7OzswQ0FDRyxnQ0FBZ0M7Ozs7dUNBQ25DLDZCQUE2Qjs7OztBQUcxRCxJQUFNLE1BQU0sR0FBRzs7Ozs7QUFLYixNQUFJLEVBQUUsSUFBSTs7Ozs7Ozs7QUFRVixNQUFJLEVBQUUsSUFBSTs7Ozs7OztBQU9WLFFBQU0sRUFBRSxJQUFJOzs7Ozs7Ozs7OztBQVdaLFVBQVEsRUFBRTtBQUNSLE1BQUUsRUFBRSxJQUFJO0FBQ1IsWUFBUSxFQUFFLElBQUk7QUFDZCxnQkFBWSxFQUFFLEVBQUU7R0FDakI7Ozs7Ozs7QUFPRCxhQUFXLEVBQUUsSUFBSTs7Ozs7OztBQU9qQixPQUFLLEVBQUUsSUFBSTs7Ozs7OztBQU9YLE9BQUssRUFBRSxJQUFJOzs7Ozs7OztBQVFYLFlBQVUsRUFBRSxJQUFJOzs7Ozs7Ozs7OztBQVdoQixNQUFJLEVBQUEsZ0JBQXFDO1FBQXBDLFVBQVUseURBQUcsUUFBUTtRQUFFLE1BQU0seURBQUcsRUFBRTs7QUFDckMsUUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7OztBQUd2QixRQUFNLFFBQVEsR0FBRyxlQUFjO0FBQzdCLFNBQUcsRUFBRSxFQUFFO0FBQ1AsZ0JBQVUsRUFBRSxDQUFDLFdBQVcsQ0FBQztLQUMxQixFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQzs7O0FBR3BCLFFBQUksQ0FBQyxNQUFNLEdBQUcsZUFBYztBQUMxQixhQUFPLEVBQUUsS0FBSztBQUNkLGtCQUFZLEVBQUUsWUFBWTtLQUMzQixFQUFFLE1BQU0sRUFBRSxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsQ0FBQyxDQUFDOztBQUV6QixnQ0FBZSxJQUFJLEVBQUUsQ0FBQztBQUN0QixRQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7R0FDbkI7Ozs7O0FBS0QsT0FBSyxFQUFBLGlCQUFHO0FBQ04sUUFBSSxvQkFBTyxRQUFRLEVBQ2pCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxLQUVuQiw0QkFBZSxLQUFLLEVBQUUsQ0FBQztHQUMxQjs7Ozs7OztBQU9ELFNBQU8sRUFBQSxpQkFBQyxFQUFFLEVBQUUsT0FBTyxFQUFFO0FBQ25CLFdBQU8sNEJBQWUsT0FBTyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztHQUM1Qzs7Ozs7O0FBTUQsYUFBVyxFQUFBLHVCQUFHOzs7QUFDWixRQUFJLENBQUMsTUFBTSxHQUFHLG9CQUFPLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRWpFLFFBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxVQUFDLElBQUksRUFBSzs7QUFFNUMsWUFBSyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLGtDQUFlLEtBQUssRUFBRSxDQUFDOzs7Ozs7OztLQVF4QixDQUFDLENBQUM7R0FDSjs7Ozs7QUFLRCxZQUFVLEVBQUEsc0JBQUc7O0FBRVgsUUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7QUFDdkIsUUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7O0FBRXBCLFFBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxJQUFJLHdDQUFvQixPQUFPLENBQUMsT0FBTyxDQUFDO0FBQzNFLFFBQU0sWUFBWSxHQUFHLHdEQUFtQyxFQUFFLE9BQU8sRUFBRSxFQUFFLE9BQU8sRUFBUCxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUM7O0FBRWxGLFFBQUksQ0FBQyx5QkFBeUIsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUM3QyxRQUFJLENBQUMsMEJBQTBCLHNDQUFrQixDQUFDO0FBQ2xELFFBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztHQUNoRDs7Ozs7O0FBTUQsMkJBQXlCLEVBQUEsbUNBQUMsSUFBSSxFQUFFO0FBQzlCLFFBQUksQ0FBQyxZQUFZLEdBQUcsZUFBYyxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzNELDBCQUFTLHlCQUF5QixDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztHQUN2RDs7Ozs7O0FBTUQsNEJBQTBCLEVBQUEsb0NBQUMsSUFBSSxFQUFFO0FBQy9CLFFBQUksQ0FBQyxTQUFTLEdBQUcsZUFBYyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3JELDBCQUFTLDBCQUEwQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztHQUNyRDs7Ozs7OztBQU9ELGlCQUFlLEVBQUEseUJBQUMsRUFBRSxFQUFFO0FBQ2xCLFFBQU0sVUFBVSxHQUFHLEVBQUUsWUFBWSxPQUFPLEdBQUcsRUFBRSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDM0UsNkJBQVksZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQUM7R0FDMUM7O0NBRUYsQ0FBQzs7cUJBRWEsTUFBTSIsImZpbGUiOiJzcmMvY2xpZW50L2NvcmUvY2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNpZ25hbCBmcm9tICcuL1NpZ25hbCc7XG5pbXBvcnQgQWN0aXZpdHkgZnJvbSAnLi9BY3Rpdml0eSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgdmlld01hbmFnZXIgZnJvbSAnLi92aWV3TWFuYWdlcic7XG5pbXBvcnQgc29ja2V0IGZyb20gJy4vc29ja2V0JztcbmltcG9ydCBkZWZhdWx0VGV4dENvbnRlbnRzIGZyb20gJy4uL2Rpc3BsYXkvZGVmYXVsdFRleHRDb250ZW50cyc7XG5pbXBvcnQgZGVmYXVsdFRlbXBsYXRlcyBmcm9tICcuLi9kaXNwbGF5L2RlZmF1bHRUZW1wbGF0ZXMnO1xuXG5cbmNvbnN0IGNsaWVudCA9IHtcbiAgLyoqXG4gICAqIENsaWVudCB1bmlxdWUgaWQsIGdpdmVuIGJ5IHRoZSBzZXJ2ZXIuXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICB1dWlkOiBudWxsLFxuXG4gIC8qKlxuICAgKiBDbGllbnQgdHlwZS5cbiAgICogVGhlIGNsaWVudCB0eXBlIGlzIHNwZWZpY2llZCBpbiB0aGUgYXJndW1lbnQgb2YgdGhlIGBpbml0YCBtZXRob2QuIEZvclxuICAgKiBpbnN0YW5jZSwgYCdwbGF5ZXInYCBpcyB0aGUgY2xpZW50IHR5cGUgeW91IHNob3VsZCBiZSB1c2luZyBieSBkZWZhdWx0LlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgdHlwZTogbnVsbCxcblxuICAgLyoqXG4gICAqIFNvY2tldC5pbyB3cmFwcGVyIHVzZWQgdG8gY29tbXVuaWNhdGUgd2l0aCB0aGUgc2VydmVyLCBpZiBhbnkgKHNlZSB7QGxpbmsgc29ja2V0fS5cbiAgICogQHR5cGUge29iamVjdH1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNvY2tldDogbnVsbCxcblxuICAvKipcbiAgICogSW5mb3JtYXRpb24gYWJvdXQgdGhlIGNsaWVudCBwbGF0Zm9ybS5cbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtTdHJpbmd9IG9zIE9wZXJhdGluZyBzeXN0ZW0uXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gaXNNb2JpbGUgSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGNsaWVudCBpcyBydW5uaW5nIG9uIGFcbiAgICogbW9iaWxlIHBsYXRmb3JtIG9yIG5vdC5cbiAgICogQHByb3BlcnR5IHtTdHJpbmd9IGF1ZGlvRmlsZUV4dCBBdWRpbyBmaWxlIGV4dGVuc2lvbiB0byB1c2UsIGRlcGVuZGluZyBvblxuICAgKiB0aGUgcGxhdGZvcm0gKClcbiAgICovXG4gIHBsYXRmb3JtOiB7XG4gICAgb3M6IG51bGwsXG4gICAgaXNNb2JpbGU6IG51bGwsXG4gICAgYXVkaW9GaWxlRXh0OiAnJyxcbiAgfSxcblxuICAvKipcbiAgICogQ2xpZW50IGNvb3JkaW5hdGVzIChpZiBhbnkpIGdpdmVuIGJ5IGEge0BsaW5rIExvY2F0b3J9LCB7QGxpbmsgUGxhY2VyfSBvclxuICAgKiB7QGxpbmsgQ2hlY2tpbn0gbW9kdWxlLiAoRm9ybWF0OiBgW3g6TnVtYmVyLCB5Ok51bWJlcl1gLilcbiAgICogQHR5cGUge0FycmF5PE51bWJlcj59XG4gICAqL1xuICBjb29yZGluYXRlczogbnVsbCxcblxuICAvKipcbiAgICogVGlja2V0IGluZGV4IChpZiBhbnkpIGdpdmVuIGJ5IGEge0BsaW5rIFBsYWNlcn0gb3JcbiAgICoge0BsaW5rIENoZWNraW59IG1vZHVsZS5cbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGluZGV4OiBudWxsLFxuXG4gIC8qKlxuICAgKiBUaWNrZXQgbGFiZWwgKGlmIGFueSkgZ2l2ZW4gYnkgYSB7QGxpbmsgUGxhY2VyfSBvclxuICAgKiB7QGxpbmsgQ2hlY2tpbn0gbW9kdWxlLlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgbGFiZWw6IG51bGwsXG5cbiAgLyoqXG4gICAqIElzIHNldCB0byBgdHJ1ZWAgb3IgYGZhbHNlYCBieSB0aGUgYFdlbGNvbWVgIHNlcnZpY2UgYW5kIGRlZmluZXMgaWYgdGhlXG4gICAqIGNsaWVudCBtZWV0cyB0aGUgcmVxdWlyZW1lbnRzIG9mIHRoZSBhcHBsaWNhdGlvbi4gKFNob3VsZCBiZSB1c2VmdWxsIHdoZW5cbiAgICogdGhlIGBXZWxjb21lYCBzZXJ2aWNlIGlzIHVzZWQgd2l0aG91dCBhIHZpZXcgYW5kIGFjdGl2YXRlZCBtYW51YWxseSlcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuICBjb21wYXRpYmxlOiBudWxsLFxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSBhcHBsaWNhdGlvbi5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtjbGllbnRUeXBlID0gJ3BsYXllciddIC0gVGhlIGNsaWVudCB0eXBlIHRvIGRlZmluZSB0aGUgc29ja2V0IG5hbWVzcGFjZSwgc2hvdWxkIG1hdGNoIGEgY2xpZW50IHR5cGUgZGVmaW5lZCBzZXJ2ZXIgc2lkZSAoaWYgYW55KS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtjb25maWc9e31dIC0gVGhlIGNvbmZpZyB0byBpbml0aWFsaXplIGEgY2xpZW50XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbY29uZmlnLnNvY2tldElPLnVybD0nJ10gLSBUaGUgdXJsIHdoZXJlIHRoZSBzb2NrZXQgc2hvdWxkIGNvbm5lY3QuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbY29uZmlnLnNvY2tldElPLnRyYW5zcG9ydHM9Wyd3ZWJzb2NrZXQnXV0gLSBUaGUgdHJhbnNwb3J0IHVzZWQgdG8gY3JlYXRlIHRoZSB1cmwgKG92ZXJyaWRlcyBkZWZhdWx0IHNvY2tldC5pbyBtZWNhbmlzbSkuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbY29uZmlnLmFwcENvbnRhaW5lcj0nI2NvbnRhaW5lciddIC0gQSBzZWxlY3RvciBtYXRjaGluZyBhIERPTSBlbGVtZW50IHdoZXJlIHRoZSB2aWV3cyBzaG91bGQgYmUgaW5zZXJ0ZWQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbY29uZmlnLmRlYnVnSU89ZmFsc2VdIC0gSWYgc2V0IHRvIGB0cnVlYCwgc2hvdyBzb2NrZXQuaW8gZGVidWcgaW5mb3JtYXRpb25zLlxuICAgKi9cbiAgaW5pdChjbGllbnRUeXBlID0gJ3BsYXllcicsIGNvbmZpZyA9IHt9KSB7XG4gICAgdGhpcy50eXBlID0gY2xpZW50VHlwZTtcblxuICAgIC8vIDEuIGlmIHNvY2tldCBjb25maWcgZ2l2ZW4sIG1peCBpdCB3aXRoIGRlZmF1bHRzLlxuICAgIGNvbnN0IHNvY2tldElPID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICB1cmw6ICcnLFxuICAgICAgdHJhbnNwb3J0czogWyd3ZWJzb2NrZXQnXVxuICAgIH0sIGNvbmZpZy5zb2NrZXRJTyk7XG5cbiAgICAvLyAyLiBtaXggYWxsIG90aGVyIGNvbmZpZyBhbmQgb3ZlcnJpZGUgd2l0aCBkZWZpbmVkIHNvY2tldCBjb25maWcuXG4gICAgdGhpcy5jb25maWcgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIGRlYnVnSU86IGZhbHNlLFxuICAgICAgYXBwQ29udGFpbmVyOiAnI2NvbnRhaW5lcicsXG4gICAgfSwgY29uZmlnLCB7IHNvY2tldElPIH0pO1xuXG4gICAgc2VydmljZU1hbmFnZXIuaW5pdCgpO1xuICAgIHRoaXMuX2luaXRWaWV3cygpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgYXBwbGljYXRpb24uXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBpZiAoc29ja2V0LnJlcXVpcmVkKVxuICAgICAgdGhpcy5faW5pdFNvY2tldCgpO1xuICAgIGVsc2VcbiAgICAgIHNlcnZpY2VNYW5hZ2VyLnN0YXJ0KCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzZXJ2aWNlIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gVGhlIGlkZW50aWZpZXIgb2YgdGhlIHNlcnZpY2UuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gVGhlIG9wdGlvbnMgdG8gY29uZmlndXJlIHRoZSBzZXJ2aWNlLlxuICAgKi9cbiAgcmVxdWlyZShpZCwgb3B0aW9ucykge1xuICAgIHJldHVybiBzZXJ2aWNlTWFuYWdlci5yZXF1aXJlKGlkLCBvcHRpb25zKTtcbiAgfSxcblxuICAvKipcbiAgICogQHRvZG8gLSByZWZhY3RvciBoYW5kc2hha2UuXG4gICAqIEluaXRpYWxpemUgc29ja2V0IGNvbm5lY3Rpb24gYW5kIHBlcmZvcm0gaGFuZHNoYWtlIHdpdGggdGhlIHNlcnZlci5cbiAgICovXG4gIF9pbml0U29ja2V0KCkge1xuICAgIHRoaXMuc29ja2V0ID0gc29ja2V0LmluaXRpYWxpemUodGhpcy50eXBlLCB0aGlzLmNvbmZpZy5zb2NrZXRJTyk7XG4gICAgLy8gd2FpdCBmb3IgaGFuZHNoYWtlIHRvIG1hcmsgY2xpZW50IGFzIGByZWFkeWBcbiAgICB0aGlzLnNvY2tldC5yZWNlaXZlKCdjbGllbnQ6c3RhcnQnLCAodXVpZCkgPT4ge1xuICAgICAgLy8gZG9uJ3QgaGFuZGxlIHNlcnZlciByZXN0YXJ0IGZvciBub3cuXG4gICAgICB0aGlzLnV1aWQgPSB1dWlkO1xuICAgICAgc2VydmljZU1hbmFnZXIuc3RhcnQoKTtcblxuICAgICAgLy8gdGhpcy5jb21tLnJlY2VpdmUoJ3JlY29ubmVjdCcsICgpID0+IGNvbnNvbGUuaW5mbygncmVjb25uZWN0JykpO1xuICAgICAgLy8gdGhpcy5jb21tLnJlY2VpdmUoJ2Rpc2Nvbm5lY3QnLCAoKSA9PiB7XG4gICAgICAvLyAgIGNvbnNvbGUuaW5mbygnZGlzY29ubmVjdCcpXG4gICAgICAvLyAgIHNlcnZpY2VNYW5hZ2VyLnJlc2V0KCk7IC8vIGNhbiByZWxhdW5jaCBzZXJ2aWNlTWFuYWdlciBvbiByZWNvbm5lY3Rpb24uXG4gICAgICAvLyB9KTtcbiAgICAgIC8vIHRoaXMuY29tbS5yZWNlaXZlKCdlcnJvcicsIChlcnIpID0+IGNvbnNvbGUuZXJyb3IoZXJyKSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGVtcGxhdGVzIGZvciBhbGxcbiAgICovXG4gIF9pbml0Vmlld3MoKSB7XG4gICAgLy8gaW5pdGlhbGl6ZSBtb2R1bGVzIHZpZXdzIHdpdGggZGVmYXVsdCB0ZXh0cyBhbmQgdGVtcGxhdGVzXG4gICAgdGhpcy50ZXh0Q29udGVudHMgPSB7fTtcbiAgICB0aGlzLnRlbXBsYXRlcyA9IHt9O1xuXG4gICAgY29uc3QgYXBwTmFtZSA9IHRoaXMuY29uZmlnLmFwcE5hbWUgfHzCoGRlZmF1bHRUZXh0Q29udGVudHMuZ2xvYmFscy5hcHBOYW1lO1xuICAgIGNvbnN0IHRleHRDb250ZW50cyA9IE9iamVjdC5hc3NpZ24oZGVmYXVsdFRleHRDb250ZW50cywgeyBnbG9iYWxzOiB7IGFwcE5hbWUgfSB9KTtcblxuICAgIHRoaXMuc2V0Vmlld0NvbnRlbnREZWZpbml0aW9ucyh0ZXh0Q29udGVudHMpO1xuICAgIHRoaXMuc2V0Vmlld1RlbXBsYXRlRGVmaW5pdGlvbnMoZGVmYXVsdFRlbXBsYXRlcyk7XG4gICAgdGhpcy5zZXRBcHBDb250YWluZXIodGhpcy5jb25maWcuYXBwQ29udGFpbmVyKTtcbiAgfSxcblxuICAvKipcbiAgICogRXh0ZW5kIGFwcGxpY2F0aW9uIHRleHQgY29udGVudHMgd2l0aCB0aGUgZ2l2ZW4gb2JqZWN0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGVudHMgLSBUaGUgdGV4dCBjb250ZW50cyB0byBwcm9wYWdhdGUgdG8gbW9kdWxlcy5cbiAgICovXG4gIHNldFZpZXdDb250ZW50RGVmaW5pdGlvbnMoZGVmcykge1xuICAgIHRoaXMudGV4dENvbnRlbnRzID0gT2JqZWN0LmFzc2lnbih0aGlzLnRleHRDb250ZW50cywgZGVmcyk7XG4gICAgQWN0aXZpdHkuc2V0Vmlld0NvbnRlbnREZWZpbml0aW9ucyh0aGlzLnRleHRDb250ZW50cyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEV4dGVuZCBhcHBsaWNhdGlvbiB0ZW1wbGF0ZXMgd2l0aCB0aGUgZ2l2ZW4gb2JqZWN0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gdGVtcGxhdGVzIC0gVGhlIHRlbXBsYXRlcyB0byBwcm9wYWdhdGUgdG8gbW9kdWxlcy5cbiAgICovXG4gIHNldFZpZXdUZW1wbGF0ZURlZmluaXRpb25zKGRlZnMpIHtcbiAgICB0aGlzLnRlbXBsYXRlcyA9IE9iamVjdC5hc3NpZ24odGhpcy50ZW1wbGF0ZXMsIGRlZnMpO1xuICAgIEFjdGl2aXR5LnNldFZpZXdUZW1wbGF0ZURlZmluaXRpb25zKHRoaXMudGVtcGxhdGVzKTtcbiAgfSxcblxuICAvKipcbiAgICogU2V0cyB0aGUgZGVmYXVsdCB2aWV3IGNvbnRhaW5lciBmb3IgYWxsIGBDbGllbnRNb2R1bGVgc1xuICAgKiBAcGFyYW0ge1N0cmluZ3xFbGVtZW50fSBlbCAtIERPTSBlbGVtZW50IChvciBjc3Mgc2VsZWN0b3IgbWF0Y2hpbmdcbiAgICogIGFuIGV4aXN0aW5nIGVsZW1lbnQpIHRvIGJlIHVzZWQgYXMgdGhlIGNvbnRhaW5lciBvZiB0aGUgYXBwbGljYXRpb24uXG4gICAqL1xuICBzZXRBcHBDb250YWluZXIoZWwpIHtcbiAgICBjb25zdCAkY29udGFpbmVyID0gZWwgaW5zdGFuY2VvZiBFbGVtZW50ID8gZWwgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsKTtcbiAgICB2aWV3TWFuYWdlci5zZXRWaWV3Q29udGFpbmVyKCRjb250YWluZXIpO1xuICB9LFxuXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGllbnQ7XG4iXX0=