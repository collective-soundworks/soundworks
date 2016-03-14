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

var _defaultContent = require('../config/defaultContent');

var _defaultContent2 = _interopRequireDefault(_defaultContent);

var _defaultTemplates = require('../config/defaultTemplates');

var _defaultTemplates2 = _interopRequireDefault(_defaultTemplates);

var _viewport = require('../views/viewport');

var _viewport2 = _interopRequireDefault(_viewport);

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
   * {@link Checkin} service. (Format: `[x:Number, y:Number]`.)
   * @type {Array<Number>}
   */
  coordinates: null,

  /**
   * Ticket index (if any) given by a {@link Placer} or
   * {@link Checkin} service.
   * @type {Number}
   */
  index: null,

  /**
   * Ticket label (if any) given by a {@link Placer} or
   * {@link Checkin} service.
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

    // 1. if socket config given, mix it with defaults
    var socketIO = (0, _assign2.default)({
      url: '',
      transports: ['websocket']
    }, config.socketIO);

    // 2. mix all other config and override with defined socket config
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
   * Initialize view templates for all
   */
  _initViews: function _initViews() {
    _viewport2.default.init();
    // initialize views with default view content and templates
    this.viewContent = {};
    this.viewTemplates = {};

    var appName = this.config.appName || _defaultContent2.default.globals.appName;
    var viewContent = (0, _assign2.default)(_defaultContent2.default, { globals: { appName: appName } });

    this.setViewContentDefinitions(viewContent);
    this.setViewTemplateDefinitions(_defaultTemplates2.default);
    this.setAppContainer(this.config.appContainer);
  },


  /**
   * Extend application view contents with the given object.
   * @param {Object} content - The view content to propagate to activities.
   */
  setViewContentDefinitions: function setViewContentDefinitions(defs) {
    this.viewContent = (0, _assign2.default)(this.viewContent, defs);
    _Activity2.default.setViewContentDefinitions(this.viewContent);
  },


  /**
   * Extend application view templates with the given object.
   * @param {Object} view templates - The view templates to propagate to activities.
   */
  setViewTemplateDefinitions: function setViewTemplateDefinitions(defs) {
    this.viewTemplates = (0, _assign2.default)(this.viewTemplates, defs);
    _Activity2.default.setViewTemplateDefinitions(this.viewTemplates);
  },


  /**
   * Set the default container for all views.
   * @param {String|Element} el - DOM element (or css selector matching
   *  an existing element) to be used as the container of the application.
   */
  setAppContainer: function setAppContainer(el) {
    var $container = el instanceof Element ? el : document.querySelector(el);
    _viewManager2.default.setViewContainer($container);
  }
};

exports.default = client;
//# sourceMappingURL=data:application/json;base64,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QXFMYiw0Q0FBZ0IsSUFBSTtBQUNsQixRQUFNLGFBQWEsY0FBYyxPQUFkLEdBQXdCLEVBQXhCLEdBQTZCLFNBQVMsYUFBVCxDQUF1QixFQUF2QixDQUE3QixDQUREO0FBRWxCLDBCQUFZLGdCQUFaLENBQTZCLFVBQTdCLEVBRmtCO0dBckxQO0NBQVQ7O2tCQTRMUyIsImZpbGUiOiJjbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2lnbmFsIGZyb20gJy4vU2lnbmFsJztcbmltcG9ydCBBY3Rpdml0eSBmcm9tICcuL0FjdGl2aXR5JztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCB2aWV3TWFuYWdlciBmcm9tICcuL3ZpZXdNYW5hZ2VyJztcbmltcG9ydCBzb2NrZXQgZnJvbSAnLi9zb2NrZXQnO1xuaW1wb3J0IGRlZmF1bHRWaWV3Q29udGVudCBmcm9tICcuLi9jb25maWcvZGVmYXVsdENvbnRlbnQnO1xuaW1wb3J0IGRlZmF1bHRWaWV3VGVtcGxhdGVzIGZyb20gJy4uL2NvbmZpZy9kZWZhdWx0VGVtcGxhdGVzJztcbmltcG9ydCB2aWV3cG9ydCBmcm9tICcuLi92aWV3cy92aWV3cG9ydCc7XG5cbmNvbnN0IGNsaWVudCA9IHtcbiAgLyoqXG4gICAqIENsaWVudCB1bmlxdWUgaWQsIGdpdmVuIGJ5IHRoZSBzZXJ2ZXIuXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICB1dWlkOiBudWxsLFxuXG4gIC8qKlxuICAgKiBDbGllbnQgdHlwZS5cbiAgICogVGhlIGNsaWVudCB0eXBlIGlzIHNwZWZpY2llZCBpbiB0aGUgYXJndW1lbnQgb2YgdGhlIGBpbml0YCBtZXRob2QuIEZvclxuICAgKiBpbnN0YW5jZSwgYCdwbGF5ZXInYCBpcyB0aGUgY2xpZW50IHR5cGUgeW91IHNob3VsZCBiZSB1c2luZyBieSBkZWZhdWx0LlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgdHlwZTogbnVsbCxcblxuICAgLyoqXG4gICAqIFNvY2tldC5pbyB3cmFwcGVyIHVzZWQgdG8gY29tbXVuaWNhdGUgd2l0aCB0aGUgc2VydmVyLCBpZiBhbnkgKHNlZSB7QGxpbmsgc29ja2V0fS5cbiAgICogQHR5cGUge29iamVjdH1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNvY2tldDogbnVsbCxcblxuICAvKipcbiAgICogSW5mb3JtYXRpb24gYWJvdXQgdGhlIGNsaWVudCBwbGF0Zm9ybS5cbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtTdHJpbmd9IG9zIE9wZXJhdGluZyBzeXN0ZW0uXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gaXNNb2JpbGUgSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGNsaWVudCBpcyBydW5uaW5nIG9uIGFcbiAgICogbW9iaWxlIHBsYXRmb3JtIG9yIG5vdC5cbiAgICogQHByb3BlcnR5IHtTdHJpbmd9IGF1ZGlvRmlsZUV4dCBBdWRpbyBmaWxlIGV4dGVuc2lvbiB0byB1c2UsIGRlcGVuZGluZyBvblxuICAgKiB0aGUgcGxhdGZvcm0gKClcbiAgICovXG4gIHBsYXRmb3JtOiB7XG4gICAgb3M6IG51bGwsXG4gICAgaXNNb2JpbGU6IG51bGwsXG4gICAgYXVkaW9GaWxlRXh0OiAnJyxcbiAgfSxcblxuICAvKipcbiAgICogQ2xpZW50IGNvb3JkaW5hdGVzIChpZiBhbnkpIGdpdmVuIGJ5IGEge0BsaW5rIExvY2F0b3J9LCB7QGxpbmsgUGxhY2VyfSBvclxuICAgKiB7QGxpbmsgQ2hlY2tpbn0gc2VydmljZS4gKEZvcm1hdDogYFt4Ok51bWJlciwgeTpOdW1iZXJdYC4pXG4gICAqIEB0eXBlIHtBcnJheTxOdW1iZXI+fVxuICAgKi9cbiAgY29vcmRpbmF0ZXM6IG51bGwsXG5cbiAgLyoqXG4gICAqIFRpY2tldCBpbmRleCAoaWYgYW55KSBnaXZlbiBieSBhIHtAbGluayBQbGFjZXJ9IG9yXG4gICAqIHtAbGluayBDaGVja2lufSBzZXJ2aWNlLlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgaW5kZXg6IG51bGwsXG5cbiAgLyoqXG4gICAqIFRpY2tldCBsYWJlbCAoaWYgYW55KSBnaXZlbiBieSBhIHtAbGluayBQbGFjZXJ9IG9yXG4gICAqIHtAbGluayBDaGVja2lufSBzZXJ2aWNlLlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgbGFiZWw6IG51bGwsXG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyYXRpb24gaW5mb3JtYXRpb25zIHJldHJpZXZlZCBmcm9tIHRoZSBzZXJ2ZXIgY29uZmlndXJhdGlvbiBieVxuICAgKiB0aGUgYFNoYXJlZENvbmZpZ2Agc2VydmljZS5cbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG4gIGNvbmZpZzogbnVsbCxcblxuICAvKipcbiAgICogSXMgc2V0IHRvIGB0cnVlYCBvciBgZmFsc2VgIGJ5IHRoZSBgV2VsY29tZWAgc2VydmljZSBhbmQgZGVmaW5lcyBpZiB0aGVcbiAgICogY2xpZW50IG1lZXRzIHRoZSByZXF1aXJlbWVudHMgb2YgdGhlIGFwcGxpY2F0aW9uLiAoU2hvdWxkIGJlIHVzZWZ1bGwgd2hlblxuICAgKiB0aGUgYFdlbGNvbWVgIHNlcnZpY2UgaXMgdXNlZCB3aXRob3V0IGEgdmlldyBhbmQgYWN0aXZhdGVkIG1hbnVhbGx5KVxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICovXG4gIGNvbXBhdGlibGU6IG51bGwsXG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIGFwcGxpY2F0aW9uLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW2NsaWVudFR5cGUgPSAncGxheWVyJ10gLSBUaGUgY2xpZW50IHR5cGUgdG8gZGVmaW5lIHRoZSBzb2NrZXQgbmFtZXNwYWNlLCBzaG91bGQgbWF0Y2ggYSBjbGllbnQgdHlwZSBkZWZpbmVkIHNlcnZlciBzaWRlIChpZiBhbnkpLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW2NvbmZpZz17fV0gLSBUaGUgY29uZmlnIHRvIGluaXRpYWxpemUgYSBjbGllbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IFtjb25maWcuc29ja2V0SU8udXJsPScnXSAtIFRoZSB1cmwgd2hlcmUgdGhlIHNvY2tldCBzaG91bGQgY29ubmVjdC5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtjb25maWcuc29ja2V0SU8udHJhbnNwb3J0cz1bJ3dlYnNvY2tldCddXSAtIFRoZSB0cmFuc3BvcnQgdXNlZCB0byBjcmVhdGUgdGhlIHVybCAob3ZlcnJpZGVzIGRlZmF1bHQgc29ja2V0LmlvIG1lY2FuaXNtKS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtjb25maWcuYXBwQ29udGFpbmVyPScjY29udGFpbmVyJ10gLSBBIHNlbGVjdG9yIG1hdGNoaW5nIGEgRE9NIGVsZW1lbnQgd2hlcmUgdGhlIHZpZXdzIHNob3VsZCBiZSBpbnNlcnRlZC5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtjb25maWcuZGVidWdJTz1mYWxzZV0gLSBJZiBzZXQgdG8gYHRydWVgLCBzaG93IHNvY2tldC5pbyBkZWJ1ZyBpbmZvcm1hdGlvbnMuXG4gICAqL1xuICBpbml0KGNsaWVudFR5cGUgPSAncGxheWVyJywgY29uZmlnID0ge30pIHtcbiAgICB0aGlzLnR5cGUgPSBjbGllbnRUeXBlO1xuXG4gICAgLy8gMS4gaWYgc29ja2V0IGNvbmZpZyBnaXZlbiwgbWl4IGl0IHdpdGggZGVmYXVsdHNcbiAgICBjb25zdCBzb2NrZXRJTyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgdXJsOiAnJyxcbiAgICAgIHRyYW5zcG9ydHM6IFsnd2Vic29ja2V0J11cbiAgICB9LCBjb25maWcuc29ja2V0SU8pO1xuXG4gICAgLy8gMi4gbWl4IGFsbCBvdGhlciBjb25maWcgYW5kIG92ZXJyaWRlIHdpdGggZGVmaW5lZCBzb2NrZXQgY29uZmlnXG4gICAgdGhpcy5jb25maWcgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIGRlYnVnSU86IGZhbHNlLFxuICAgICAgYXBwQ29udGFpbmVyOiAnI2NvbnRhaW5lcicsXG4gICAgfSwgY29uZmlnLCB7IHNvY2tldElPIH0pO1xuXG4gICAgc2VydmljZU1hbmFnZXIuaW5pdCgpO1xuICAgIHRoaXMuX2luaXRWaWV3cygpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgYXBwbGljYXRpb24uXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBpZiAoc29ja2V0LnJlcXVpcmVkKVxuICAgICAgdGhpcy5faW5pdFNvY2tldCgpO1xuICAgIGVsc2VcbiAgICAgIHNlcnZpY2VNYW5hZ2VyLnN0YXJ0KCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzZXJ2aWNlIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gVGhlIGlkZW50aWZpZXIgb2YgdGhlIHNlcnZpY2UuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gVGhlIG9wdGlvbnMgdG8gY29uZmlndXJlIHRoZSBzZXJ2aWNlLlxuICAgKi9cbiAgcmVxdWlyZShpZCwgb3B0aW9ucykge1xuICAgIHJldHVybiBzZXJ2aWNlTWFuYWdlci5yZXF1aXJlKGlkLCBvcHRpb25zKTtcbiAgfSxcblxuICAvKipcbiAgICogQHRvZG8gLSByZWZhY3RvciBoYW5kc2hha2UuXG4gICAqIEluaXRpYWxpemUgc29ja2V0IGNvbm5lY3Rpb24gYW5kIHBlcmZvcm0gaGFuZHNoYWtlIHdpdGggdGhlIHNlcnZlci5cbiAgICovXG4gIF9pbml0U29ja2V0KCkge1xuICAgIHRoaXMuc29ja2V0ID0gc29ja2V0LmluaXRpYWxpemUodGhpcy50eXBlLCB0aGlzLmNvbmZpZy5zb2NrZXRJTyk7XG4gICAgLy8gd2FpdCBmb3IgaGFuZHNoYWtlIHRvIG1hcmsgY2xpZW50IGFzIGByZWFkeWBcbiAgICB0aGlzLnNvY2tldC5yZWNlaXZlKCdjbGllbnQ6c3RhcnQnLCAodXVpZCkgPT4ge1xuICAgICAgLy8gZG9uJ3QgaGFuZGxlIHNlcnZlciByZXN0YXJ0IGZvciBub3cuXG4gICAgICB0aGlzLnV1aWQgPSB1dWlkO1xuICAgICAgc2VydmljZU1hbmFnZXIuc3RhcnQoKTtcblxuICAgICAgLy8gdGhpcy5jb21tLnJlY2VpdmUoJ3JlY29ubmVjdCcsICgpID0+IGNvbnNvbGUuaW5mbygncmVjb25uZWN0JykpO1xuICAgICAgLy8gdGhpcy5jb21tLnJlY2VpdmUoJ2Rpc2Nvbm5lY3QnLCAoKSA9PiB7XG4gICAgICAvLyAgIGNvbnNvbGUuaW5mbygnZGlzY29ubmVjdCcpXG4gICAgICAvLyAgIHNlcnZpY2VNYW5hZ2VyLnJlc2V0KCk7IC8vIGNhbiByZWxhdW5jaCBzZXJ2aWNlTWFuYWdlciBvbiByZWNvbm5lY3Rpb24uXG4gICAgICAvLyB9KTtcbiAgICAgIC8vIHRoaXMuY29tbS5yZWNlaXZlKCdlcnJvcicsIChlcnIpID0+IGNvbnNvbGUuZXJyb3IoZXJyKSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdmlldyB0ZW1wbGF0ZXMgZm9yIGFsbFxuICAgKi9cbiAgX2luaXRWaWV3cygpIHtcbiAgICB2aWV3cG9ydC5pbml0KCk7XG4gICAgLy8gaW5pdGlhbGl6ZSB2aWV3cyB3aXRoIGRlZmF1bHQgdmlldyBjb250ZW50IGFuZCB0ZW1wbGF0ZXNcbiAgICB0aGlzLnZpZXdDb250ZW50ID0ge307XG4gICAgdGhpcy52aWV3VGVtcGxhdGVzID0ge307XG5cbiAgICBjb25zdCBhcHBOYW1lID0gdGhpcy5jb25maWcuYXBwTmFtZSB8fMKgZGVmYXVsdFZpZXdDb250ZW50Lmdsb2JhbHMuYXBwTmFtZTtcbiAgICBjb25zdCB2aWV3Q29udGVudCA9IE9iamVjdC5hc3NpZ24oZGVmYXVsdFZpZXdDb250ZW50LCB7IGdsb2JhbHM6IHsgYXBwTmFtZSB9IH0pO1xuXG4gICAgdGhpcy5zZXRWaWV3Q29udGVudERlZmluaXRpb25zKHZpZXdDb250ZW50KTtcbiAgICB0aGlzLnNldFZpZXdUZW1wbGF0ZURlZmluaXRpb25zKGRlZmF1bHRWaWV3VGVtcGxhdGVzKTtcbiAgICB0aGlzLnNldEFwcENvbnRhaW5lcih0aGlzLmNvbmZpZy5hcHBDb250YWluZXIpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBFeHRlbmQgYXBwbGljYXRpb24gdmlldyBjb250ZW50cyB3aXRoIHRoZSBnaXZlbiBvYmplY3QuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZW50IC0gVGhlIHZpZXcgY29udGVudCB0byBwcm9wYWdhdGUgdG8gYWN0aXZpdGllcy5cbiAgICovXG4gIHNldFZpZXdDb250ZW50RGVmaW5pdGlvbnMoZGVmcykge1xuICAgIHRoaXMudmlld0NvbnRlbnQgPSBPYmplY3QuYXNzaWduKHRoaXMudmlld0NvbnRlbnQsIGRlZnMpO1xuICAgIEFjdGl2aXR5LnNldFZpZXdDb250ZW50RGVmaW5pdGlvbnModGhpcy52aWV3Q29udGVudCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEV4dGVuZCBhcHBsaWNhdGlvbiB2aWV3IHRlbXBsYXRlcyB3aXRoIHRoZSBnaXZlbiBvYmplY3QuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB2aWV3IHRlbXBsYXRlcyAtIFRoZSB2aWV3IHRlbXBsYXRlcyB0byBwcm9wYWdhdGUgdG8gYWN0aXZpdGllcy5cbiAgICovXG4gIHNldFZpZXdUZW1wbGF0ZURlZmluaXRpb25zKGRlZnMpIHtcbiAgICB0aGlzLnZpZXdUZW1wbGF0ZXMgPSBPYmplY3QuYXNzaWduKHRoaXMudmlld1RlbXBsYXRlcywgZGVmcyk7XG4gICAgQWN0aXZpdHkuc2V0Vmlld1RlbXBsYXRlRGVmaW5pdGlvbnModGhpcy52aWV3VGVtcGxhdGVzKTtcbiAgfSxcblxuICAvKipcbiAgICogU2V0IHRoZSBkZWZhdWx0IGNvbnRhaW5lciBmb3IgYWxsIHZpZXdzLlxuICAgKiBAcGFyYW0ge1N0cmluZ3xFbGVtZW50fSBlbCAtIERPTSBlbGVtZW50IChvciBjc3Mgc2VsZWN0b3IgbWF0Y2hpbmdcbiAgICogIGFuIGV4aXN0aW5nIGVsZW1lbnQpIHRvIGJlIHVzZWQgYXMgdGhlIGNvbnRhaW5lciBvZiB0aGUgYXBwbGljYXRpb24uXG4gICAqL1xuICBzZXRBcHBDb250YWluZXIoZWwpIHtcbiAgICBjb25zdCAkY29udGFpbmVyID0gZWwgaW5zdGFuY2VvZiBFbGVtZW50ID8gZWwgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsKTtcbiAgICB2aWV3TWFuYWdlci5zZXRWaWV3Q29udGFpbmVyKCRjb250YWluZXIpO1xuICB9LFxuXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGllbnQ7XG5cbiJdfQ==