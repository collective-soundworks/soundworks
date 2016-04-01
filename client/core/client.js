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

var _defaultViewContent = require('../config/defaultViewContent');

var _defaultViewContent2 = _interopRequireDefault(_defaultViewContent);

var _defaultViewTemplates = require('../config/defaultViewTemplates');

var _defaultViewTemplates2 = _interopRequireDefault(_defaultViewTemplates);

var _viewport = require('../views/viewport');

var _viewport2 = _interopRequireDefault(_viewport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Client side entry point for a `soundworks` application.
 *
 * This object host general informations about the user, as well as methods
 * to initialize and start the application.
 *
 * @memberof module:soundworks/client
 * @namespace
 *
 * @example
 * import * as soundworks from 'soundworks/client';
 * import MyExperience from './MyExperience';
 *
 * soundworks.client.init('player');
 * const myExperience = new MyExperience();
 * soundworks.client.start();
 */
var client = {
  /**
   * Unique id of the client, generated and retrieved by the server.
   *
   * @type {Number}
   */
  uuid: null,

  /**
   * The type of the client, this can generally be considered as the role of the
   * client in the application. This value is defined as argument of the
   * [`client.init`]{@link module:soundworks/client.client.init} method and
   * defaults to `'player'`.
   *
   * @type {String}
   */
  type: null,

  /**
   * Configuration informations retrieved from the server configuration.
   *
   * @type {Object}
   * @see {@link module:soundworks/client.SharedConfig}
   */
  config: null,

  /**
   * Information about the client platform. The properties are set by the
   * [`platform`]{@link module:soundworks/client.Platform} service.
   *
   * @type {Object}
   * @property {String} os - Operating system.
   * @property {Boolean} isMobile - Indicates whether the client is running on a
   *  mobile platform or not.
   * @property {String} audioFileExt - Audio file extension to use, depending on
   *  the platform.
   *
   * @see {@link module:soundworks/client.Platform}
   */
  platform: {
    os: null,
    isMobile: null,
    audioFileExt: ''
  },

  /**
   * Defines whether the user's device is compatible with the application
   * requirements.
   *
   * @type {Boolean}
   * @see {@link module:soundworks/client.Platform}
   */
  compatible: null,

  /**
   * Index (if any) given by a [`placer`]{@link module:soundworks/client.Placer}
   * or [`checkin`]{@link module:soundworks/client.Checkin} service.
   *
   * @type {Number}
   * @see {@link module:soundworks/client.Checkin}
   * @see {@link module:soundworks/client.Placer}
   */
  index: null,

  /**
   * Ticket label (if any) given by a [`placer`]{@link module:soundworks/client.Placer}
   * or [`checkin`]{@link module:soundworks/client.Checkin} service.
   *
   * @type {String}
   * @see {@link module:soundworks/client.Checkin}
   * @see {@link module:soundworks/client.Placer}
   */
  label: null,

  /**
   * Client coordinates (if any) given by a
   * [`locator`]{@link module:soundworks/client.Locator},
   * [`placer`]{@link module:soundworks/client.Placer} or
   * [`checkin`]{@link module:soundworks/client.Checkin} service.
   * (Format: `[x:Number, y:Number]`.)
   *
   * @type {Array<Number>}
   * @see {@link module:soundworks/client.Checkin}
   * @see {@link module:soundworks/client.Locator}
   * @see {@link module:soundworks/client.Placer}
   */
  coordinates: null,

  /**
   * Socket object that handle communications with the server, if any.
   * This object is automatically created if the experience requires any service
   * having a server-side counterpart.
   *
   * @type {module:soundworks/client.socket}
   * @private
   */
  socket: null,

  /**
   * Initialize the application.
   *
   * @param {String} [clientType='player'] - The type of the client, defines the
   *  socket connection namespace. Should match a client type defined server side.
   * @param {Object} [config={}]
   * @param {Object} [config.appContainer='#container'] - A css selector
   *  matching a DOM element where the views should be inserted.
   * @param {Object} [config.socketIO.url=''] - The url where the socket should
   *  connect _(unstable)_.
   * @param {Object} [config.socketIO.transports=['websocket']] - The transport
   *  used to create the url (overrides default socket.io mecanism) _(unstable)_.
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
   * @param {String} id - Identifier of the service.
   * @param {Object} options - Options to configure the service.
   */
  require: function require(id, options) {
    return _serviceManager2.default.require(id, options);
  },


  /**
   * Initialize socket connection and perform handshake with the server.
   * @todo - refactor handshake.
   * @private
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
   * Initialize view templates for all activities.
   * @private
   */
  _initViews: function _initViews() {
    _viewport2.default.init();
    // initialize views with default view content and templates
    this.viewContent = {};
    this.viewTemplates = {};

    var appName = this.config.appName || _defaultViewContent2.default.globals.appName;
    var viewContent = (0, _assign2.default)(_defaultViewContent2.default, { globals: { appName: appName } });

    this.setViewContentDefinitions(viewContent);
    this.setViewTemplateDefinitions(_defaultViewTemplates2.default);
    this.setAppContainer(this.config.appContainer);
  },


  /**
   * Extend or override application view contents with the given object.
   * @param {Object} defs - Content to be used by activities.
   */
  setViewContentDefinitions: function setViewContentDefinitions(defs) {
    this.viewContent = (0, _assign2.default)(this.viewContent, defs);
    _Activity2.default.setViewContentDefinitions(this.viewContent);
  },


  /**
   * Extend or override application view templates with the given object.
   * @param {Object} defs - Templates to be used by activities.
   */
  setViewTemplateDefinitions: function setViewTemplateDefinitions(defs) {
    this.viewTemplates = (0, _assign2.default)(this.viewTemplates, defs);
    _Activity2.default.setViewTemplateDefinitions(this.viewTemplates);
  },


  /**
   * Set the DOM elemnt that will be the container for all views.
   * @private
   * @param {String|Element} el - DOM element (or css selector matching
   *  an existing element) to be used as the container of the application.
   */
  setAppContainer: function setAppContainer(el) {
    var $container = el instanceof Element ? el : document.querySelector(el);
    _viewManager2.default.setViewContainer($container);
  }
};

exports.default = client;
//# sourceMappingURL=data:application/json;base64,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YUFBTCxDQUFwQyxDQUYrQjtHQXpNcEI7Ozs7Ozs7OztBQW9OYiw0Q0FBZ0IsSUFBSTtBQUNsQixRQUFNLGFBQWEsY0FBYyxPQUFkLEdBQXdCLEVBQXhCLEdBQTZCLFNBQVMsYUFBVCxDQUF1QixFQUF2QixDQUE3QixDQUREO0FBRWxCLDBCQUFZLGdCQUFaLENBQTZCLFVBQTdCLEVBRmtCO0dBcE5QO0NBQVQ7O2tCQTJOUyIsImZpbGUiOiJjbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2lnbmFsIGZyb20gJy4vU2lnbmFsJztcbmltcG9ydCBBY3Rpdml0eSBmcm9tICcuL0FjdGl2aXR5JztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCB2aWV3TWFuYWdlciBmcm9tICcuL3ZpZXdNYW5hZ2VyJztcbmltcG9ydCBzb2NrZXQgZnJvbSAnLi9zb2NrZXQnO1xuaW1wb3J0IGRlZmF1bHRWaWV3Q29udGVudCBmcm9tICcuLi9jb25maWcvZGVmYXVsdFZpZXdDb250ZW50JztcbmltcG9ydCBkZWZhdWx0Vmlld1RlbXBsYXRlcyBmcm9tICcuLi9jb25maWcvZGVmYXVsdFZpZXdUZW1wbGF0ZXMnO1xuaW1wb3J0IHZpZXdwb3J0IGZyb20gJy4uL3ZpZXdzL3ZpZXdwb3J0JztcblxuLyoqXG4gKiBDbGllbnQgc2lkZSBlbnRyeSBwb2ludCBmb3IgYSBgc291bmR3b3Jrc2AgYXBwbGljYXRpb24uXG4gKlxuICogVGhpcyBvYmplY3QgaG9zdCBnZW5lcmFsIGluZm9ybWF0aW9ucyBhYm91dCB0aGUgdXNlciwgYXMgd2VsbCBhcyBtZXRob2RzXG4gKiB0byBpbml0aWFsaXplIGFuZCBzdGFydCB0aGUgYXBwbGljYXRpb24uXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQG5hbWVzcGFjZVxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBzb3VuZHdvcmtzIGZyb20gJ3NvdW5kd29ya3MvY2xpZW50JztcbiAqIGltcG9ydCBNeUV4cGVyaWVuY2UgZnJvbSAnLi9NeUV4cGVyaWVuY2UnO1xuICpcbiAqIHNvdW5kd29ya3MuY2xpZW50LmluaXQoJ3BsYXllcicpO1xuICogY29uc3QgbXlFeHBlcmllbmNlID0gbmV3IE15RXhwZXJpZW5jZSgpO1xuICogc291bmR3b3Jrcy5jbGllbnQuc3RhcnQoKTtcbiAqL1xuY29uc3QgY2xpZW50ID0ge1xuICAvKipcbiAgICogVW5pcXVlIGlkIG9mIHRoZSBjbGllbnQsIGdlbmVyYXRlZCBhbmQgcmV0cmlldmVkIGJ5IHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICB1dWlkOiBudWxsLFxuXG4gIC8qKlxuICAgKiBUaGUgdHlwZSBvZiB0aGUgY2xpZW50LCB0aGlzIGNhbiBnZW5lcmFsbHkgYmUgY29uc2lkZXJlZCBhcyB0aGUgcm9sZSBvZiB0aGVcbiAgICogY2xpZW50IGluIHRoZSBhcHBsaWNhdGlvbi4gVGhpcyB2YWx1ZSBpcyBkZWZpbmVkIGFzIGFyZ3VtZW50IG9mIHRoZVxuICAgKiBbYGNsaWVudC5pbml0YF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LmNsaWVudC5pbml0fSBtZXRob2QgYW5kXG4gICAqIGRlZmF1bHRzIHRvIGAncGxheWVyJ2AuXG4gICAqXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICB0eXBlOiBudWxsLFxuXG4gIC8qKlxuICAgKiBDb25maWd1cmF0aW9uIGluZm9ybWF0aW9ucyByZXRyaWV2ZWQgZnJvbSB0aGUgc2VydmVyIGNvbmZpZ3VyYXRpb24uXG4gICAqXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5TaGFyZWRDb25maWd9XG4gICAqL1xuICBjb25maWc6IG51bGwsXG5cbiAgLyoqXG4gICAqIEluZm9ybWF0aW9uIGFib3V0IHRoZSBjbGllbnQgcGxhdGZvcm0uIFRoZSBwcm9wZXJ0aWVzIGFyZSBzZXQgYnkgdGhlXG4gICAqIFtgcGxhdGZvcm1gXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhdGZvcm19IHNlcnZpY2UuXG4gICAqXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBvcyAtIE9wZXJhdGluZyBzeXN0ZW0uXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gaXNNb2JpbGUgLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgY2xpZW50IGlzIHJ1bm5pbmcgb24gYVxuICAgKiAgbW9iaWxlIHBsYXRmb3JtIG9yIG5vdC5cbiAgICogQHByb3BlcnR5IHtTdHJpbmd9IGF1ZGlvRmlsZUV4dCAtIEF1ZGlvIGZpbGUgZXh0ZW5zaW9uIHRvIHVzZSwgZGVwZW5kaW5nIG9uXG4gICAqICB0aGUgcGxhdGZvcm0uXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGF0Zm9ybX1cbiAgICovXG4gIHBsYXRmb3JtOiB7XG4gICAgb3M6IG51bGwsXG4gICAgaXNNb2JpbGU6IG51bGwsXG4gICAgYXVkaW9GaWxlRXh0OiAnJyxcbiAgfSxcblxuICAvKipcbiAgICogRGVmaW5lcyB3aGV0aGVyIHRoZSB1c2VyJ3MgZGV2aWNlIGlzIGNvbXBhdGlibGUgd2l0aCB0aGUgYXBwbGljYXRpb25cbiAgICogcmVxdWlyZW1lbnRzLlxuICAgKlxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYXRmb3JtfVxuICAgKi9cbiAgY29tcGF0aWJsZTogbnVsbCxcblxuICAvKipcbiAgICogSW5kZXggKGlmIGFueSkgZ2l2ZW4gYnkgYSBbYHBsYWNlcmBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGFjZXJ9XG4gICAqIG9yIFtgY2hlY2tpbmBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DaGVja2lufSBzZXJ2aWNlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQ2hlY2tpbn1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYWNlcn1cbiAgICovXG4gIGluZGV4OiBudWxsLFxuXG4gIC8qKlxuICAgKiBUaWNrZXQgbGFiZWwgKGlmIGFueSkgZ2l2ZW4gYnkgYSBbYHBsYWNlcmBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGFjZXJ9XG4gICAqIG9yIFtgY2hlY2tpbmBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DaGVja2lufSBzZXJ2aWNlLlxuICAgKlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQ2hlY2tpbn1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYWNlcn1cbiAgICovXG4gIGxhYmVsOiBudWxsLFxuXG4gIC8qKlxuICAgKiBDbGllbnQgY29vcmRpbmF0ZXMgKGlmIGFueSkgZ2l2ZW4gYnkgYVxuICAgKiBbYGxvY2F0b3JgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuTG9jYXRvcn0sXG4gICAqIFtgcGxhY2VyYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYWNlcn0gb3JcbiAgICogW2BjaGVja2luYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNoZWNraW59IHNlcnZpY2UuXG4gICAqIChGb3JtYXQ6IGBbeDpOdW1iZXIsIHk6TnVtYmVyXWAuKVxuICAgKlxuICAgKiBAdHlwZSB7QXJyYXk8TnVtYmVyPn1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNoZWNraW59XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5Mb2NhdG9yfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhY2VyfVxuICAgKi9cbiAgY29vcmRpbmF0ZXM6IG51bGwsXG5cbiAgLyoqXG4gICAqIFNvY2tldCBvYmplY3QgdGhhdCBoYW5kbGUgY29tbXVuaWNhdGlvbnMgd2l0aCB0aGUgc2VydmVyLCBpZiBhbnkuXG4gICAqIFRoaXMgb2JqZWN0IGlzIGF1dG9tYXRpY2FsbHkgY3JlYXRlZCBpZiB0aGUgZXhwZXJpZW5jZSByZXF1aXJlcyBhbnkgc2VydmljZVxuICAgKiBoYXZpbmcgYSBzZXJ2ZXItc2lkZSBjb3VudGVycGFydC5cbiAgICpcbiAgICogQHR5cGUge21vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5zb2NrZXR9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzb2NrZXQ6IG51bGwsXG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIGFwcGxpY2F0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW2NsaWVudFR5cGU9J3BsYXllciddIC0gVGhlIHR5cGUgb2YgdGhlIGNsaWVudCwgZGVmaW5lcyB0aGVcbiAgICogIHNvY2tldCBjb25uZWN0aW9uIG5hbWVzcGFjZS4gU2hvdWxkIG1hdGNoIGEgY2xpZW50IHR5cGUgZGVmaW5lZCBzZXJ2ZXIgc2lkZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtjb25maWc9e31dXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbY29uZmlnLmFwcENvbnRhaW5lcj0nI2NvbnRhaW5lciddIC0gQSBjc3Mgc2VsZWN0b3JcbiAgICogIG1hdGNoaW5nIGEgRE9NIGVsZW1lbnQgd2hlcmUgdGhlIHZpZXdzIHNob3VsZCBiZSBpbnNlcnRlZC5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtjb25maWcuc29ja2V0SU8udXJsPScnXSAtIFRoZSB1cmwgd2hlcmUgdGhlIHNvY2tldCBzaG91bGRcbiAgICogIGNvbm5lY3QgXyh1bnN0YWJsZSlfLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW2NvbmZpZy5zb2NrZXRJTy50cmFuc3BvcnRzPVsnd2Vic29ja2V0J11dIC0gVGhlIHRyYW5zcG9ydFxuICAgKiAgdXNlZCB0byBjcmVhdGUgdGhlIHVybCAob3ZlcnJpZGVzIGRlZmF1bHQgc29ja2V0LmlvIG1lY2FuaXNtKSBfKHVuc3RhYmxlKV8uXG4gICAqL1xuICBpbml0KGNsaWVudFR5cGUgPSAncGxheWVyJywgY29uZmlnID0ge30pIHtcbiAgICB0aGlzLnR5cGUgPSBjbGllbnRUeXBlO1xuXG4gICAgLy8gMS4gaWYgc29ja2V0IGNvbmZpZyBnaXZlbiwgbWl4IGl0IHdpdGggZGVmYXVsdHNcbiAgICBjb25zdCBzb2NrZXRJTyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgdXJsOiAnJyxcbiAgICAgIHRyYW5zcG9ydHM6IFsnd2Vic29ja2V0J11cbiAgICB9LCBjb25maWcuc29ja2V0SU8pO1xuXG4gICAgLy8gMi4gbWl4IGFsbCBvdGhlciBjb25maWcgYW5kIG92ZXJyaWRlIHdpdGggZGVmaW5lZCBzb2NrZXQgY29uZmlnXG4gICAgdGhpcy5jb25maWcgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIGFwcENvbnRhaW5lcjogJyNjb250YWluZXInLFxuICAgIH0sIGNvbmZpZywgeyBzb2NrZXRJTyB9KTtcblxuICAgIHNlcnZpY2VNYW5hZ2VyLmluaXQoKTtcbiAgICB0aGlzLl9pbml0Vmlld3MoKTtcbiAgfSxcblxuICAvKipcbiAgICogU3RhcnQgdGhlIGFwcGxpY2F0aW9uLlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgaWYgKHNvY2tldC5yZXF1aXJlZClcbiAgICAgIHRoaXMuX2luaXRTb2NrZXQoKTtcbiAgICBlbHNlXG4gICAgICBzZXJ2aWNlTWFuYWdlci5zdGFydCgpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc2VydmljZSBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIElkZW50aWZpZXIgb2YgdGhlIHNlcnZpY2UuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3B0aW9ucyB0byBjb25maWd1cmUgdGhlIHNlcnZpY2UuXG4gICAqL1xuICByZXF1aXJlKGlkLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIHNlcnZpY2VNYW5hZ2VyLnJlcXVpcmUoaWQsIG9wdGlvbnMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHNvY2tldCBjb25uZWN0aW9uIGFuZCBwZXJmb3JtIGhhbmRzaGFrZSB3aXRoIHRoZSBzZXJ2ZXIuXG4gICAqIEB0b2RvIC0gcmVmYWN0b3IgaGFuZHNoYWtlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2luaXRTb2NrZXQoKSB7XG4gICAgdGhpcy5zb2NrZXQgPSBzb2NrZXQuaW5pdGlhbGl6ZSh0aGlzLnR5cGUsIHRoaXMuY29uZmlnLnNvY2tldElPKTtcbiAgICAvLyB3YWl0IGZvciBoYW5kc2hha2UgdG8gbWFyayBjbGllbnQgYXMgYHJlYWR5YFxuICAgIHRoaXMuc29ja2V0LnJlY2VpdmUoJ2NsaWVudDpzdGFydCcsICh1dWlkKSA9PiB7XG4gICAgICAvLyBkb24ndCBoYW5kbGUgc2VydmVyIHJlc3RhcnQgZm9yIG5vdy5cbiAgICAgIHRoaXMudXVpZCA9IHV1aWQ7XG4gICAgICBzZXJ2aWNlTWFuYWdlci5zdGFydCgpO1xuXG4gICAgICAvLyB0aGlzLmNvbW0ucmVjZWl2ZSgncmVjb25uZWN0JywgKCkgPT4gY29uc29sZS5pbmZvKCdyZWNvbm5lY3QnKSk7XG4gICAgICAvLyB0aGlzLmNvbW0ucmVjZWl2ZSgnZGlzY29ubmVjdCcsICgpID0+IHtcbiAgICAgIC8vICAgY29uc29sZS5pbmZvKCdkaXNjb25uZWN0JylcbiAgICAgIC8vICAgc2VydmljZU1hbmFnZXIucmVzZXQoKTsgLy8gY2FuIHJlbGF1bmNoIHNlcnZpY2VNYW5hZ2VyIG9uIHJlY29ubmVjdGlvbi5cbiAgICAgIC8vIH0pO1xuICAgICAgLy8gdGhpcy5jb21tLnJlY2VpdmUoJ2Vycm9yJywgKGVycikgPT4gY29uc29sZS5lcnJvcihlcnIpKTtcbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSB2aWV3IHRlbXBsYXRlcyBmb3IgYWxsIGFjdGl2aXRpZXMuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfaW5pdFZpZXdzKCkge1xuICAgIHZpZXdwb3J0LmluaXQoKTtcbiAgICAvLyBpbml0aWFsaXplIHZpZXdzIHdpdGggZGVmYXVsdCB2aWV3IGNvbnRlbnQgYW5kIHRlbXBsYXRlc1xuICAgIHRoaXMudmlld0NvbnRlbnQgPSB7fTtcbiAgICB0aGlzLnZpZXdUZW1wbGF0ZXMgPSB7fTtcblxuICAgIGNvbnN0IGFwcE5hbWUgPSB0aGlzLmNvbmZpZy5hcHBOYW1lIHx8wqBkZWZhdWx0Vmlld0NvbnRlbnQuZ2xvYmFscy5hcHBOYW1lO1xuICAgIGNvbnN0IHZpZXdDb250ZW50ID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0Vmlld0NvbnRlbnQsIHsgZ2xvYmFsczogeyBhcHBOYW1lIH0gfSk7XG5cbiAgICB0aGlzLnNldFZpZXdDb250ZW50RGVmaW5pdGlvbnModmlld0NvbnRlbnQpO1xuICAgIHRoaXMuc2V0Vmlld1RlbXBsYXRlRGVmaW5pdGlvbnMoZGVmYXVsdFZpZXdUZW1wbGF0ZXMpO1xuICAgIHRoaXMuc2V0QXBwQ29udGFpbmVyKHRoaXMuY29uZmlnLmFwcENvbnRhaW5lcik7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEV4dGVuZCBvciBvdmVycmlkZSBhcHBsaWNhdGlvbiB2aWV3IGNvbnRlbnRzIHdpdGggdGhlIGdpdmVuIG9iamVjdC5cbiAgICogQHBhcmFtIHtPYmplY3R9IGRlZnMgLSBDb250ZW50IHRvIGJlIHVzZWQgYnkgYWN0aXZpdGllcy5cbiAgICovXG4gIHNldFZpZXdDb250ZW50RGVmaW5pdGlvbnMoZGVmcykge1xuICAgIHRoaXMudmlld0NvbnRlbnQgPSBPYmplY3QuYXNzaWduKHRoaXMudmlld0NvbnRlbnQsIGRlZnMpO1xuICAgIEFjdGl2aXR5LnNldFZpZXdDb250ZW50RGVmaW5pdGlvbnModGhpcy52aWV3Q29udGVudCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEV4dGVuZCBvciBvdmVycmlkZSBhcHBsaWNhdGlvbiB2aWV3IHRlbXBsYXRlcyB3aXRoIHRoZSBnaXZlbiBvYmplY3QuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkZWZzIC0gVGVtcGxhdGVzIHRvIGJlIHVzZWQgYnkgYWN0aXZpdGllcy5cbiAgICovXG4gIHNldFZpZXdUZW1wbGF0ZURlZmluaXRpb25zKGRlZnMpIHtcbiAgICB0aGlzLnZpZXdUZW1wbGF0ZXMgPSBPYmplY3QuYXNzaWduKHRoaXMudmlld1RlbXBsYXRlcywgZGVmcyk7XG4gICAgQWN0aXZpdHkuc2V0Vmlld1RlbXBsYXRlRGVmaW5pdGlvbnModGhpcy52aWV3VGVtcGxhdGVzKTtcbiAgfSxcblxuICAvKipcbiAgICogU2V0IHRoZSBET00gZWxlbW50IHRoYXQgd2lsbCBiZSB0aGUgY29udGFpbmVyIGZvciBhbGwgdmlld3MuXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7U3RyaW5nfEVsZW1lbnR9IGVsIC0gRE9NIGVsZW1lbnQgKG9yIGNzcyBzZWxlY3RvciBtYXRjaGluZ1xuICAgKiAgYW4gZXhpc3RpbmcgZWxlbWVudCkgdG8gYmUgdXNlZCBhcyB0aGUgY29udGFpbmVyIG9mIHRoZSBhcHBsaWNhdGlvbi5cbiAgICovXG4gIHNldEFwcENvbnRhaW5lcihlbCkge1xuICAgIGNvbnN0ICRjb250YWluZXIgPSBlbCBpbnN0YW5jZW9mIEVsZW1lbnQgPyBlbCA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWwpO1xuICAgIHZpZXdNYW5hZ2VyLnNldFZpZXdDb250YWluZXIoJGNvbnRhaW5lcik7XG4gIH0sXG5cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsaWVudDtcbiJdfQ==