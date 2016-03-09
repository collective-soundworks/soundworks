'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

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

var _defaultTextContents = require('../views/defaultTextContents');

var _defaultTextContents2 = _interopRequireDefault(_defaultTextContents);

var _defaultTemplates = require('../views/defaultTemplates');

var _defaultTemplates2 = _interopRequireDefault(_defaultTemplates);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    var socketIO = (0, _assign2.default)({
      url: '',
      transports: ['websocket']
    }, config.socketIO);

    // 2. mix all other config and override with defined socket config.
    this.config = (0, _assign2.default)({
      debugIO: false,
      appContainer: '#container'
    }, config, { socketIO: socketIO });

    _serviceManager2.default.init();
    this._initViews();
  },


  /**
   * Start the application.
   */
  start: function start() {
    if (_socket2.default.required) this._initSocket();else _serviceManager2.default.start();
  },


  /**
   * Returns a service configured with the given options.
   * @param {String} id - The identifier of the service.
   * @param {Object} options - The options to configure the service.
   */
  require: function require(id, options) {
    return _serviceManager2.default.require(id, options);
  },


  /**
   * @todo - refactor handshake.
   * Initialize socket connection and perform handshake with the server.
   */
  _initSocket: function _initSocket() {
    var _this = this;

    this.socket = _socket2.default.initialize(this.type, this.config.socketIO);
    // wait for handshake to mark client as `ready`
    this.socket.receive('client:start', function (uuid) {
      // don't handle server restart for now.
      _this.uuid = uuid;
      _serviceManager2.default.start();

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

    var appName = this.config.appName || _defaultTextContents2.default.globals.appName;
    var textContents = (0, _assign2.default)(_defaultTextContents2.default, { globals: { appName: appName } });

    this.setViewContentDefinitions(textContents);
    this.setViewTemplateDefinitions(_defaultTemplates2.default);
    this.setAppContainer(this.config.appContainer);
  },


  /**
   * Extend application text contents with the given object.
   * @param {Object} contents - The text contents to propagate to modules.
   */
  setViewContentDefinitions: function setViewContentDefinitions(defs) {
    this.textContents = (0, _assign2.default)(this.textContents, defs);
    _Activity2.default.setViewContentDefinitions(this.textContents);
  },


  /**
   * Extend application templates with the given object.
   * @param {Object} templates - The templates to propagate to modules.
   */
  setViewTemplateDefinitions: function setViewTemplateDefinitions(defs) {
    this.templates = (0, _assign2.default)(this.templates, defs);
    _Activity2.default.setViewTemplateDefinitions(this.templates);
  },


  /**
   * Sets the default view container for all `ClientModule`s
   * @param {String|Element} el - DOM element (or css selector matching
   *  an existing element) to be used as the container of the application.
   */
  setAppContainer: function setAppContainer(el) {
    var $container = el instanceof Element ? el : document.querySelector(el);
    _viewManager2.default.setViewContainer($container);
  }
};

exports.default = client;
//# sourceMappingURL=data:application/json;base64,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QUFhLGNBQWMsT0FBZCxHQUF3QixFQUF4QixHQUE2QixTQUFTLGFBQVQsQ0FBdUIsRUFBdkIsQ0FBN0IsQ0FERDtBQUVsQiwwQkFBWSxnQkFBWixDQUE2QixVQUE3QixFQUZrQjtHQXBMUDtDQUFUOztrQkEyTFMiLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNpZ25hbCBmcm9tICcuL1NpZ25hbCc7XG5pbXBvcnQgQWN0aXZpdHkgZnJvbSAnLi9BY3Rpdml0eSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgdmlld01hbmFnZXIgZnJvbSAnLi92aWV3TWFuYWdlcic7XG5pbXBvcnQgc29ja2V0IGZyb20gJy4vc29ja2V0JztcbmltcG9ydCBkZWZhdWx0VGV4dENvbnRlbnRzIGZyb20gJy4uL3ZpZXdzL2RlZmF1bHRUZXh0Q29udGVudHMnO1xuaW1wb3J0IGRlZmF1bHRUZW1wbGF0ZXMgZnJvbSAnLi4vdmlld3MvZGVmYXVsdFRlbXBsYXRlcyc7XG5cblxuY29uc3QgY2xpZW50ID0ge1xuICAvKipcbiAgICogQ2xpZW50IHVuaXF1ZSBpZCwgZ2l2ZW4gYnkgdGhlIHNlcnZlci5cbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHV1aWQ6IG51bGwsXG5cbiAgLyoqXG4gICAqIENsaWVudCB0eXBlLlxuICAgKiBUaGUgY2xpZW50IHR5cGUgaXMgc3BlZmljaWVkIGluIHRoZSBhcmd1bWVudCBvZiB0aGUgYGluaXRgIG1ldGhvZC4gRm9yXG4gICAqIGluc3RhbmNlLCBgJ3BsYXllcidgIGlzIHRoZSBjbGllbnQgdHlwZSB5b3Ugc2hvdWxkIGJlIHVzaW5nIGJ5IGRlZmF1bHQuXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICB0eXBlOiBudWxsLFxuXG4gICAvKipcbiAgICogU29ja2V0LmlvIHdyYXBwZXIgdXNlZCB0byBjb21tdW5pY2F0ZSB3aXRoIHRoZSBzZXJ2ZXIsIGlmIGFueSAoc2VlIHtAbGluayBzb2NrZXR9LlxuICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc29ja2V0OiBudWxsLFxuXG4gIC8qKlxuICAgKiBJbmZvcm1hdGlvbiBhYm91dCB0aGUgY2xpZW50IHBsYXRmb3JtLlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gb3MgT3BlcmF0aW5nIHN5c3RlbS5cbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBpc01vYmlsZSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgY2xpZW50IGlzIHJ1bm5pbmcgb24gYVxuICAgKiBtb2JpbGUgcGxhdGZvcm0gb3Igbm90LlxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gYXVkaW9GaWxlRXh0IEF1ZGlvIGZpbGUgZXh0ZW5zaW9uIHRvIHVzZSwgZGVwZW5kaW5nIG9uXG4gICAqIHRoZSBwbGF0Zm9ybSAoKVxuICAgKi9cbiAgcGxhdGZvcm06IHtcbiAgICBvczogbnVsbCxcbiAgICBpc01vYmlsZTogbnVsbCxcbiAgICBhdWRpb0ZpbGVFeHQ6ICcnLFxuICB9LFxuXG4gIC8qKlxuICAgKiBDbGllbnQgY29vcmRpbmF0ZXMgKGlmIGFueSkgZ2l2ZW4gYnkgYSB7QGxpbmsgTG9jYXRvcn0sIHtAbGluayBQbGFjZXJ9IG9yXG4gICAqIHtAbGluayBDaGVja2lufSBtb2R1bGUuIChGb3JtYXQ6IGBbeDpOdW1iZXIsIHk6TnVtYmVyXWAuKVxuICAgKiBAdHlwZSB7QXJyYXk8TnVtYmVyPn1cbiAgICovXG4gIGNvb3JkaW5hdGVzOiBudWxsLFxuXG4gIC8qKlxuICAgKiBUaWNrZXQgaW5kZXggKGlmIGFueSkgZ2l2ZW4gYnkgYSB7QGxpbmsgUGxhY2VyfSBvclxuICAgKiB7QGxpbmsgQ2hlY2tpbn0gbW9kdWxlLlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgaW5kZXg6IG51bGwsXG5cbiAgLyoqXG4gICAqIFRpY2tldCBsYWJlbCAoaWYgYW55KSBnaXZlbiBieSBhIHtAbGluayBQbGFjZXJ9IG9yXG4gICAqIHtAbGluayBDaGVja2lufSBtb2R1bGUuXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICBsYWJlbDogbnVsbCxcblxuICAvKipcbiAgICogQ29uZmlndXJhdGlvbiBpbmZvcm1hdGlvbnMgcmV0cmlldmVkIGZyb20gdGhlIHNlcnZlciBjb25maWd1cmF0aW9uIGJ5XG4gICAqIHRoZSBgU2hhcmVkQ29uZmlnYCBzZXJ2aWNlLlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cbiAgY29uZmlnOiBudWxsLFxuXG4gIC8qKlxuICAgKiBJcyBzZXQgdG8gYHRydWVgIG9yIGBmYWxzZWAgYnkgdGhlIGBXZWxjb21lYCBzZXJ2aWNlIGFuZCBkZWZpbmVzIGlmIHRoZVxuICAgKiBjbGllbnQgbWVldHMgdGhlIHJlcXVpcmVtZW50cyBvZiB0aGUgYXBwbGljYXRpb24uIChTaG91bGQgYmUgdXNlZnVsbCB3aGVuXG4gICAqIHRoZSBgV2VsY29tZWAgc2VydmljZSBpcyB1c2VkIHdpdGhvdXQgYSB2aWV3IGFuZCBhY3RpdmF0ZWQgbWFudWFsbHkpXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKi9cbiAgY29tcGF0aWJsZTogbnVsbCxcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0aGUgYXBwbGljYXRpb24uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbY2xpZW50VHlwZSA9ICdwbGF5ZXInXSAtIFRoZSBjbGllbnQgdHlwZSB0byBkZWZpbmUgdGhlIHNvY2tldCBuYW1lc3BhY2UsIHNob3VsZCBtYXRjaCBhIGNsaWVudCB0eXBlIGRlZmluZWQgc2VydmVyIHNpZGUgKGlmIGFueSkuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbY29uZmlnPXt9XSAtIFRoZSBjb25maWcgdG8gaW5pdGlhbGl6ZSBhIGNsaWVudFxuICAgKiBAcGFyYW0ge09iamVjdH0gW2NvbmZpZy5zb2NrZXRJTy51cmw9JyddIC0gVGhlIHVybCB3aGVyZSB0aGUgc29ja2V0IHNob3VsZCBjb25uZWN0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gW2NvbmZpZy5zb2NrZXRJTy50cmFuc3BvcnRzPVsnd2Vic29ja2V0J11dIC0gVGhlIHRyYW5zcG9ydCB1c2VkIHRvIGNyZWF0ZSB0aGUgdXJsIChvdmVycmlkZXMgZGVmYXVsdCBzb2NrZXQuaW8gbWVjYW5pc20pLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW2NvbmZpZy5hcHBDb250YWluZXI9JyNjb250YWluZXInXSAtIEEgc2VsZWN0b3IgbWF0Y2hpbmcgYSBET00gZWxlbWVudCB3aGVyZSB0aGUgdmlld3Mgc2hvdWxkIGJlIGluc2VydGVkLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW2NvbmZpZy5kZWJ1Z0lPPWZhbHNlXSAtIElmIHNldCB0byBgdHJ1ZWAsIHNob3cgc29ja2V0LmlvIGRlYnVnIGluZm9ybWF0aW9ucy5cbiAgICovXG4gIGluaXQoY2xpZW50VHlwZSA9ICdwbGF5ZXInLCBjb25maWcgPSB7fSkge1xuICAgIHRoaXMudHlwZSA9IGNsaWVudFR5cGU7XG5cbiAgICAvLyAxLiBpZiBzb2NrZXQgY29uZmlnIGdpdmVuLCBtaXggaXQgd2l0aCBkZWZhdWx0cy5cbiAgICBjb25zdCBzb2NrZXRJTyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgdXJsOiAnJyxcbiAgICAgIHRyYW5zcG9ydHM6IFsnd2Vic29ja2V0J11cbiAgICB9LCBjb25maWcuc29ja2V0SU8pO1xuXG4gICAgLy8gMi4gbWl4IGFsbCBvdGhlciBjb25maWcgYW5kIG92ZXJyaWRlIHdpdGggZGVmaW5lZCBzb2NrZXQgY29uZmlnLlxuICAgIHRoaXMuY29uZmlnID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICBkZWJ1Z0lPOiBmYWxzZSxcbiAgICAgIGFwcENvbnRhaW5lcjogJyNjb250YWluZXInLFxuICAgIH0sIGNvbmZpZywgeyBzb2NrZXRJTyB9KTtcblxuICAgIHNlcnZpY2VNYW5hZ2VyLmluaXQoKTtcbiAgICB0aGlzLl9pbml0Vmlld3MoKTtcbiAgfSxcblxuICAvKipcbiAgICogU3RhcnQgdGhlIGFwcGxpY2F0aW9uLlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgaWYgKHNvY2tldC5yZXF1aXJlZClcbiAgICAgIHRoaXMuX2luaXRTb2NrZXQoKTtcbiAgICBlbHNlXG4gICAgICBzZXJ2aWNlTWFuYWdlci5zdGFydCgpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc2VydmljZSBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIFRoZSBpZGVudGlmaWVyIG9mIHRoZSBzZXJ2aWNlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFRoZSBvcHRpb25zIHRvIGNvbmZpZ3VyZSB0aGUgc2VydmljZS5cbiAgICovXG4gIHJlcXVpcmUoaWQsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gc2VydmljZU1hbmFnZXIucmVxdWlyZShpZCwgb3B0aW9ucyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEB0b2RvIC0gcmVmYWN0b3IgaGFuZHNoYWtlLlxuICAgKiBJbml0aWFsaXplIHNvY2tldCBjb25uZWN0aW9uIGFuZCBwZXJmb3JtIGhhbmRzaGFrZSB3aXRoIHRoZSBzZXJ2ZXIuXG4gICAqL1xuICBfaW5pdFNvY2tldCgpIHtcbiAgICB0aGlzLnNvY2tldCA9IHNvY2tldC5pbml0aWFsaXplKHRoaXMudHlwZSwgdGhpcy5jb25maWcuc29ja2V0SU8pO1xuICAgIC8vIHdhaXQgZm9yIGhhbmRzaGFrZSB0byBtYXJrIGNsaWVudCBhcyBgcmVhZHlgXG4gICAgdGhpcy5zb2NrZXQucmVjZWl2ZSgnY2xpZW50OnN0YXJ0JywgKHV1aWQpID0+IHtcbiAgICAgIC8vIGRvbid0IGhhbmRsZSBzZXJ2ZXIgcmVzdGFydCBmb3Igbm93LlxuICAgICAgdGhpcy51dWlkID0gdXVpZDtcbiAgICAgIHNlcnZpY2VNYW5hZ2VyLnN0YXJ0KCk7XG5cbiAgICAgIC8vIHRoaXMuY29tbS5yZWNlaXZlKCdyZWNvbm5lY3QnLCAoKSA9PiBjb25zb2xlLmluZm8oJ3JlY29ubmVjdCcpKTtcbiAgICAgIC8vIHRoaXMuY29tbS5yZWNlaXZlKCdkaXNjb25uZWN0JywgKCkgPT4ge1xuICAgICAgLy8gICBjb25zb2xlLmluZm8oJ2Rpc2Nvbm5lY3QnKVxuICAgICAgLy8gICBzZXJ2aWNlTWFuYWdlci5yZXNldCgpOyAvLyBjYW4gcmVsYXVuY2ggc2VydmljZU1hbmFnZXIgb24gcmVjb25uZWN0aW9uLlxuICAgICAgLy8gfSk7XG4gICAgICAvLyB0aGlzLmNvbW0ucmVjZWl2ZSgnZXJyb3InLCAoZXJyKSA9PiBjb25zb2xlLmVycm9yKGVycikpO1xuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRlbXBsYXRlcyBmb3IgYWxsXG4gICAqL1xuICBfaW5pdFZpZXdzKCkge1xuICAgIC8vIGluaXRpYWxpemUgbW9kdWxlcyB2aWV3cyB3aXRoIGRlZmF1bHQgdGV4dHMgYW5kIHRlbXBsYXRlc1xuICAgIHRoaXMudGV4dENvbnRlbnRzID0ge307XG4gICAgdGhpcy50ZW1wbGF0ZXMgPSB7fTtcblxuICAgIGNvbnN0IGFwcE5hbWUgPSB0aGlzLmNvbmZpZy5hcHBOYW1lIHx8wqBkZWZhdWx0VGV4dENvbnRlbnRzLmdsb2JhbHMuYXBwTmFtZTtcbiAgICBjb25zdCB0ZXh0Q29udGVudHMgPSBPYmplY3QuYXNzaWduKGRlZmF1bHRUZXh0Q29udGVudHMsIHsgZ2xvYmFsczogeyBhcHBOYW1lIH0gfSk7XG5cbiAgICB0aGlzLnNldFZpZXdDb250ZW50RGVmaW5pdGlvbnModGV4dENvbnRlbnRzKTtcbiAgICB0aGlzLnNldFZpZXdUZW1wbGF0ZURlZmluaXRpb25zKGRlZmF1bHRUZW1wbGF0ZXMpO1xuICAgIHRoaXMuc2V0QXBwQ29udGFpbmVyKHRoaXMuY29uZmlnLmFwcENvbnRhaW5lcik7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEV4dGVuZCBhcHBsaWNhdGlvbiB0ZXh0IGNvbnRlbnRzIHdpdGggdGhlIGdpdmVuIG9iamVjdC5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRlbnRzIC0gVGhlIHRleHQgY29udGVudHMgdG8gcHJvcGFnYXRlIHRvIG1vZHVsZXMuXG4gICAqL1xuICBzZXRWaWV3Q29udGVudERlZmluaXRpb25zKGRlZnMpIHtcbiAgICB0aGlzLnRleHRDb250ZW50cyA9IE9iamVjdC5hc3NpZ24odGhpcy50ZXh0Q29udGVudHMsIGRlZnMpO1xuICAgIEFjdGl2aXR5LnNldFZpZXdDb250ZW50RGVmaW5pdGlvbnModGhpcy50ZXh0Q29udGVudHMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBFeHRlbmQgYXBwbGljYXRpb24gdGVtcGxhdGVzIHdpdGggdGhlIGdpdmVuIG9iamVjdC5cbiAgICogQHBhcmFtIHtPYmplY3R9IHRlbXBsYXRlcyAtIFRoZSB0ZW1wbGF0ZXMgdG8gcHJvcGFnYXRlIHRvIG1vZHVsZXMuXG4gICAqL1xuICBzZXRWaWV3VGVtcGxhdGVEZWZpbml0aW9ucyhkZWZzKSB7XG4gICAgdGhpcy50ZW1wbGF0ZXMgPSBPYmplY3QuYXNzaWduKHRoaXMudGVtcGxhdGVzLCBkZWZzKTtcbiAgICBBY3Rpdml0eS5zZXRWaWV3VGVtcGxhdGVEZWZpbml0aW9ucyh0aGlzLnRlbXBsYXRlcyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGRlZmF1bHQgdmlldyBjb250YWluZXIgZm9yIGFsbCBgQ2xpZW50TW9kdWxlYHNcbiAgICogQHBhcmFtIHtTdHJpbmd8RWxlbWVudH0gZWwgLSBET00gZWxlbWVudCAob3IgY3NzIHNlbGVjdG9yIG1hdGNoaW5nXG4gICAqICBhbiBleGlzdGluZyBlbGVtZW50KSB0byBiZSB1c2VkIGFzIHRoZSBjb250YWluZXIgb2YgdGhlIGFwcGxpY2F0aW9uLlxuICAgKi9cbiAgc2V0QXBwQ29udGFpbmVyKGVsKSB7XG4gICAgY29uc3QgJGNvbnRhaW5lciA9IGVsIGluc3RhbmNlb2YgRWxlbWVudCA/IGVsIDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbCk7XG4gICAgdmlld01hbmFnZXIuc2V0Vmlld0NvbnRhaW5lcigkY29udGFpbmVyKTtcbiAgfSxcblxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xpZW50O1xuIl19