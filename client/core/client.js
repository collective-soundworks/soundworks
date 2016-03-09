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

var _defaultTextContent = require('../views/defaultTextContent');

var _defaultTextContent2 = _interopRequireDefault(_defaultTextContent);

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
    this.textContent = {};
    this.templates = {};

    var appName = this.config.appName || _defaultTextContent2.default.globals.appName;
    var textContent = (0, _assign2.default)(_defaultTextContent2.default, { globals: { appName: appName } });

    this.setViewContentDefinitions(textContent);
    this.setViewTemplateDefinitions(_defaultTemplates2.default);
    this.setAppContainer(this.config.appContainer);
  },


  /**
   * Extend application text contents with the given object.
   * @param {Object} contents - The text contents to propagate to modules.
   */
  setViewContentDefinitions: function setViewContentDefinitions(defs) {
    this.textContent = (0, _assign2.default)(this.textContent, defs);
    _Activity2.default.setViewContentDefinitions(this.textContent);
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
//# sourceMappingURL=data:application/json;base64,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QUFhLGNBQWMsT0FBZCxHQUF3QixFQUF4QixHQUE2QixTQUFTLGFBQVQsQ0FBdUIsRUFBdkIsQ0FBN0IsQ0FERDtBQUVsQiwwQkFBWSxnQkFBWixDQUE2QixVQUE3QixFQUZrQjtHQXBMUDtDQUFUOztrQkEyTFMiLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNpZ25hbCBmcm9tICcuL1NpZ25hbCc7XG5pbXBvcnQgQWN0aXZpdHkgZnJvbSAnLi9BY3Rpdml0eSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgdmlld01hbmFnZXIgZnJvbSAnLi92aWV3TWFuYWdlcic7XG5pbXBvcnQgc29ja2V0IGZyb20gJy4vc29ja2V0JztcbmltcG9ydCBkZWZhdWx0VGV4dENvbnRlbnQgZnJvbSAnLi4vdmlld3MvZGVmYXVsdFRleHRDb250ZW50JztcbmltcG9ydCBkZWZhdWx0VGVtcGxhdGVzIGZyb20gJy4uL3ZpZXdzL2RlZmF1bHRUZW1wbGF0ZXMnO1xuXG5cbmNvbnN0IGNsaWVudCA9IHtcbiAgLyoqXG4gICAqIENsaWVudCB1bmlxdWUgaWQsIGdpdmVuIGJ5IHRoZSBzZXJ2ZXIuXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICB1dWlkOiBudWxsLFxuXG4gIC8qKlxuICAgKiBDbGllbnQgdHlwZS5cbiAgICogVGhlIGNsaWVudCB0eXBlIGlzIHNwZWZpY2llZCBpbiB0aGUgYXJndW1lbnQgb2YgdGhlIGBpbml0YCBtZXRob2QuIEZvclxuICAgKiBpbnN0YW5jZSwgYCdwbGF5ZXInYCBpcyB0aGUgY2xpZW50IHR5cGUgeW91IHNob3VsZCBiZSB1c2luZyBieSBkZWZhdWx0LlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgdHlwZTogbnVsbCxcblxuICAgLyoqXG4gICAqIFNvY2tldC5pbyB3cmFwcGVyIHVzZWQgdG8gY29tbXVuaWNhdGUgd2l0aCB0aGUgc2VydmVyLCBpZiBhbnkgKHNlZSB7QGxpbmsgc29ja2V0fS5cbiAgICogQHR5cGUge29iamVjdH1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNvY2tldDogbnVsbCxcblxuICAvKipcbiAgICogSW5mb3JtYXRpb24gYWJvdXQgdGhlIGNsaWVudCBwbGF0Zm9ybS5cbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtTdHJpbmd9IG9zIE9wZXJhdGluZyBzeXN0ZW0uXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gaXNNb2JpbGUgSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGNsaWVudCBpcyBydW5uaW5nIG9uIGFcbiAgICogbW9iaWxlIHBsYXRmb3JtIG9yIG5vdC5cbiAgICogQHByb3BlcnR5IHtTdHJpbmd9IGF1ZGlvRmlsZUV4dCBBdWRpbyBmaWxlIGV4dGVuc2lvbiB0byB1c2UsIGRlcGVuZGluZyBvblxuICAgKiB0aGUgcGxhdGZvcm0gKClcbiAgICovXG4gIHBsYXRmb3JtOiB7XG4gICAgb3M6IG51bGwsXG4gICAgaXNNb2JpbGU6IG51bGwsXG4gICAgYXVkaW9GaWxlRXh0OiAnJyxcbiAgfSxcblxuICAvKipcbiAgICogQ2xpZW50IGNvb3JkaW5hdGVzIChpZiBhbnkpIGdpdmVuIGJ5IGEge0BsaW5rIExvY2F0b3J9LCB7QGxpbmsgUGxhY2VyfSBvclxuICAgKiB7QGxpbmsgQ2hlY2tpbn0gbW9kdWxlLiAoRm9ybWF0OiBgW3g6TnVtYmVyLCB5Ok51bWJlcl1gLilcbiAgICogQHR5cGUge0FycmF5PE51bWJlcj59XG4gICAqL1xuICBjb29yZGluYXRlczogbnVsbCxcblxuICAvKipcbiAgICogVGlja2V0IGluZGV4IChpZiBhbnkpIGdpdmVuIGJ5IGEge0BsaW5rIFBsYWNlcn0gb3JcbiAgICoge0BsaW5rIENoZWNraW59IG1vZHVsZS5cbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGluZGV4OiBudWxsLFxuXG4gIC8qKlxuICAgKiBUaWNrZXQgbGFiZWwgKGlmIGFueSkgZ2l2ZW4gYnkgYSB7QGxpbmsgUGxhY2VyfSBvclxuICAgKiB7QGxpbmsgQ2hlY2tpbn0gbW9kdWxlLlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgbGFiZWw6IG51bGwsXG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyYXRpb24gaW5mb3JtYXRpb25zIHJldHJpZXZlZCBmcm9tIHRoZSBzZXJ2ZXIgY29uZmlndXJhdGlvbiBieVxuICAgKiB0aGUgYFNoYXJlZENvbmZpZ2Agc2VydmljZS5cbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG4gIGNvbmZpZzogbnVsbCxcblxuICAvKipcbiAgICogSXMgc2V0IHRvIGB0cnVlYCBvciBgZmFsc2VgIGJ5IHRoZSBgV2VsY29tZWAgc2VydmljZSBhbmQgZGVmaW5lcyBpZiB0aGVcbiAgICogY2xpZW50IG1lZXRzIHRoZSByZXF1aXJlbWVudHMgb2YgdGhlIGFwcGxpY2F0aW9uLiAoU2hvdWxkIGJlIHVzZWZ1bGwgd2hlblxuICAgKiB0aGUgYFdlbGNvbWVgIHNlcnZpY2UgaXMgdXNlZCB3aXRob3V0IGEgdmlldyBhbmQgYWN0aXZhdGVkIG1hbnVhbGx5KVxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICovXG4gIGNvbXBhdGlibGU6IG51bGwsXG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIGFwcGxpY2F0aW9uLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW2NsaWVudFR5cGUgPSAncGxheWVyJ10gLSBUaGUgY2xpZW50IHR5cGUgdG8gZGVmaW5lIHRoZSBzb2NrZXQgbmFtZXNwYWNlLCBzaG91bGQgbWF0Y2ggYSBjbGllbnQgdHlwZSBkZWZpbmVkIHNlcnZlciBzaWRlIChpZiBhbnkpLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW2NvbmZpZz17fV0gLSBUaGUgY29uZmlnIHRvIGluaXRpYWxpemUgYSBjbGllbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IFtjb25maWcuc29ja2V0SU8udXJsPScnXSAtIFRoZSB1cmwgd2hlcmUgdGhlIHNvY2tldCBzaG91bGQgY29ubmVjdC5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtjb25maWcuc29ja2V0SU8udHJhbnNwb3J0cz1bJ3dlYnNvY2tldCddXSAtIFRoZSB0cmFuc3BvcnQgdXNlZCB0byBjcmVhdGUgdGhlIHVybCAob3ZlcnJpZGVzIGRlZmF1bHQgc29ja2V0LmlvIG1lY2FuaXNtKS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtjb25maWcuYXBwQ29udGFpbmVyPScjY29udGFpbmVyJ10gLSBBIHNlbGVjdG9yIG1hdGNoaW5nIGEgRE9NIGVsZW1lbnQgd2hlcmUgdGhlIHZpZXdzIHNob3VsZCBiZSBpbnNlcnRlZC5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtjb25maWcuZGVidWdJTz1mYWxzZV0gLSBJZiBzZXQgdG8gYHRydWVgLCBzaG93IHNvY2tldC5pbyBkZWJ1ZyBpbmZvcm1hdGlvbnMuXG4gICAqL1xuICBpbml0KGNsaWVudFR5cGUgPSAncGxheWVyJywgY29uZmlnID0ge30pIHtcbiAgICB0aGlzLnR5cGUgPSBjbGllbnRUeXBlO1xuXG4gICAgLy8gMS4gaWYgc29ja2V0IGNvbmZpZyBnaXZlbiwgbWl4IGl0IHdpdGggZGVmYXVsdHMuXG4gICAgY29uc3Qgc29ja2V0SU8gPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIHVybDogJycsXG4gICAgICB0cmFuc3BvcnRzOiBbJ3dlYnNvY2tldCddXG4gICAgfSwgY29uZmlnLnNvY2tldElPKTtcblxuICAgIC8vIDIuIG1peCBhbGwgb3RoZXIgY29uZmlnIGFuZCBvdmVycmlkZSB3aXRoIGRlZmluZWQgc29ja2V0IGNvbmZpZy5cbiAgICB0aGlzLmNvbmZpZyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgZGVidWdJTzogZmFsc2UsXG4gICAgICBhcHBDb250YWluZXI6ICcjY29udGFpbmVyJyxcbiAgICB9LCBjb25maWcsIHsgc29ja2V0SU8gfSk7XG5cbiAgICBzZXJ2aWNlTWFuYWdlci5pbml0KCk7XG4gICAgdGhpcy5faW5pdFZpZXdzKCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBhcHBsaWNhdGlvbi5cbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIGlmIChzb2NrZXQucmVxdWlyZWQpXG4gICAgICB0aGlzLl9pbml0U29ja2V0KCk7XG4gICAgZWxzZVxuICAgICAgc2VydmljZU1hbmFnZXIuc3RhcnQoKTtcbiAgfSxcblxuICAvKipcbiAgICogUmV0dXJucyBhIHNlcnZpY2UgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBUaGUgaWRlbnRpZmllciBvZiB0aGUgc2VydmljZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBUaGUgb3B0aW9ucyB0byBjb25maWd1cmUgdGhlIHNlcnZpY2UuXG4gICAqL1xuICByZXF1aXJlKGlkLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIHNlcnZpY2VNYW5hZ2VyLnJlcXVpcmUoaWQsIG9wdGlvbnMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBAdG9kbyAtIHJlZmFjdG9yIGhhbmRzaGFrZS5cbiAgICogSW5pdGlhbGl6ZSBzb2NrZXQgY29ubmVjdGlvbiBhbmQgcGVyZm9ybSBoYW5kc2hha2Ugd2l0aCB0aGUgc2VydmVyLlxuICAgKi9cbiAgX2luaXRTb2NrZXQoKSB7XG4gICAgdGhpcy5zb2NrZXQgPSBzb2NrZXQuaW5pdGlhbGl6ZSh0aGlzLnR5cGUsIHRoaXMuY29uZmlnLnNvY2tldElPKTtcbiAgICAvLyB3YWl0IGZvciBoYW5kc2hha2UgdG8gbWFyayBjbGllbnQgYXMgYHJlYWR5YFxuICAgIHRoaXMuc29ja2V0LnJlY2VpdmUoJ2NsaWVudDpzdGFydCcsICh1dWlkKSA9PiB7XG4gICAgICAvLyBkb24ndCBoYW5kbGUgc2VydmVyIHJlc3RhcnQgZm9yIG5vdy5cbiAgICAgIHRoaXMudXVpZCA9IHV1aWQ7XG4gICAgICBzZXJ2aWNlTWFuYWdlci5zdGFydCgpO1xuXG4gICAgICAvLyB0aGlzLmNvbW0ucmVjZWl2ZSgncmVjb25uZWN0JywgKCkgPT4gY29uc29sZS5pbmZvKCdyZWNvbm5lY3QnKSk7XG4gICAgICAvLyB0aGlzLmNvbW0ucmVjZWl2ZSgnZGlzY29ubmVjdCcsICgpID0+IHtcbiAgICAgIC8vICAgY29uc29sZS5pbmZvKCdkaXNjb25uZWN0JylcbiAgICAgIC8vICAgc2VydmljZU1hbmFnZXIucmVzZXQoKTsgLy8gY2FuIHJlbGF1bmNoIHNlcnZpY2VNYW5hZ2VyIG9uIHJlY29ubmVjdGlvbi5cbiAgICAgIC8vIH0pO1xuICAgICAgLy8gdGhpcy5jb21tLnJlY2VpdmUoJ2Vycm9yJywgKGVycikgPT4gY29uc29sZS5lcnJvcihlcnIpKTtcbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0ZW1wbGF0ZXMgZm9yIGFsbFxuICAgKi9cbiAgX2luaXRWaWV3cygpIHtcbiAgICAvLyBpbml0aWFsaXplIG1vZHVsZXMgdmlld3Mgd2l0aCBkZWZhdWx0IHRleHRzIGFuZCB0ZW1wbGF0ZXNcbiAgICB0aGlzLnRleHRDb250ZW50ID0ge307XG4gICAgdGhpcy50ZW1wbGF0ZXMgPSB7fTtcblxuICAgIGNvbnN0IGFwcE5hbWUgPSB0aGlzLmNvbmZpZy5hcHBOYW1lIHx8wqBkZWZhdWx0VGV4dENvbnRlbnQuZ2xvYmFscy5hcHBOYW1lO1xuICAgIGNvbnN0IHRleHRDb250ZW50ID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0VGV4dENvbnRlbnQsIHsgZ2xvYmFsczogeyBhcHBOYW1lIH0gfSk7XG5cbiAgICB0aGlzLnNldFZpZXdDb250ZW50RGVmaW5pdGlvbnModGV4dENvbnRlbnQpO1xuICAgIHRoaXMuc2V0Vmlld1RlbXBsYXRlRGVmaW5pdGlvbnMoZGVmYXVsdFRlbXBsYXRlcyk7XG4gICAgdGhpcy5zZXRBcHBDb250YWluZXIodGhpcy5jb25maWcuYXBwQ29udGFpbmVyKTtcbiAgfSxcblxuICAvKipcbiAgICogRXh0ZW5kIGFwcGxpY2F0aW9uIHRleHQgY29udGVudHMgd2l0aCB0aGUgZ2l2ZW4gb2JqZWN0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGVudHMgLSBUaGUgdGV4dCBjb250ZW50cyB0byBwcm9wYWdhdGUgdG8gbW9kdWxlcy5cbiAgICovXG4gIHNldFZpZXdDb250ZW50RGVmaW5pdGlvbnMoZGVmcykge1xuICAgIHRoaXMudGV4dENvbnRlbnQgPSBPYmplY3QuYXNzaWduKHRoaXMudGV4dENvbnRlbnQsIGRlZnMpO1xuICAgIEFjdGl2aXR5LnNldFZpZXdDb250ZW50RGVmaW5pdGlvbnModGhpcy50ZXh0Q29udGVudCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEV4dGVuZCBhcHBsaWNhdGlvbiB0ZW1wbGF0ZXMgd2l0aCB0aGUgZ2l2ZW4gb2JqZWN0LlxuICAgKiBAcGFyYW0ge09iamVjdH0gdGVtcGxhdGVzIC0gVGhlIHRlbXBsYXRlcyB0byBwcm9wYWdhdGUgdG8gbW9kdWxlcy5cbiAgICovXG4gIHNldFZpZXdUZW1wbGF0ZURlZmluaXRpb25zKGRlZnMpIHtcbiAgICB0aGlzLnRlbXBsYXRlcyA9IE9iamVjdC5hc3NpZ24odGhpcy50ZW1wbGF0ZXMsIGRlZnMpO1xuICAgIEFjdGl2aXR5LnNldFZpZXdUZW1wbGF0ZURlZmluaXRpb25zKHRoaXMudGVtcGxhdGVzKTtcbiAgfSxcblxuICAvKipcbiAgICogU2V0cyB0aGUgZGVmYXVsdCB2aWV3IGNvbnRhaW5lciBmb3IgYWxsIGBDbGllbnRNb2R1bGVgc1xuICAgKiBAcGFyYW0ge1N0cmluZ3xFbGVtZW50fSBlbCAtIERPTSBlbGVtZW50IChvciBjc3Mgc2VsZWN0b3IgbWF0Y2hpbmdcbiAgICogIGFuIGV4aXN0aW5nIGVsZW1lbnQpIHRvIGJlIHVzZWQgYXMgdGhlIGNvbnRhaW5lciBvZiB0aGUgYXBwbGljYXRpb24uXG4gICAqL1xuICBzZXRBcHBDb250YWluZXIoZWwpIHtcbiAgICBjb25zdCAkY29udGFpbmVyID0gZWwgaW5zdGFuY2VvZiBFbGVtZW50ID8gZWwgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsKTtcbiAgICB2aWV3TWFuYWdlci5zZXRWaWV3Q29udGFpbmVyKCRjb250YWluZXIpO1xuICB9LFxuXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGllbnQ7XG4iXX0=