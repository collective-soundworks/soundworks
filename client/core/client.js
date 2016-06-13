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

var _viewport = require('../views/viewport');

var _viewport2 = _interopRequireDefault(_viewport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Client side entry point for a `soundworks` application.
 *
 * This object hosts general informations about the user, as well as methods
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
   * client in the application. This value is defined in the
   * [`client.init`]{@link module:soundworks/server.server~serverConfig} object
   * and defaults to `'player'`.
   *
   * @type {String}
   */
  type: null,

  /**
   * Configuration informations from the server configuration if any.
   *
   * @type {Object}
   * @see {@link module:soundworks/client.SharedConfig}
   */
  config: null,

  /**
   * Array of optionnal parameters passed through the url
   *
   * @type {Array}
   */
  urlParams: null,

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

    // retrieve
    this._parseUrlParams();
    // if socket config given, mix it with defaults
    var socketIO = (0, _assign2.default)({
      url: '',
      transports: ['websocket']
    }, config.socketIO);

    // mix all other config and override with defined socket config
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
   * Retrieve an array of optionnal parameters from the url excluding the client type
   * and store it in `this.config.urlParameters`.
   * Parameters can be defined in two ways :
   * - as a regular route (ex: `/player/param1/param2`)
   * - as a hash (ex: `/player#param1-param2`)
   * The parameters are send along with the socket connection
   *
   * @see {@link module:soundworks/client.socket}
   * @private
   * @todo - When handshake implemented, define if these informations should be part of it
   */
  _parseUrlParams: function _parseUrlParams() {
    // handle path name first
    var pathname = window.location.pathname;
    // sanitize
    pathname = pathname.replace(/^\//, '') // leading slash
    .replace(new RegExp('^' + this.type + '/?'), '') // remove clientType
    .replace(/\/$/, ''); // trailing slash

    if (pathname.length > 0) this.urlParams = pathname.split('/');
  },


  /**
   * Initialize socket connection and perform handshake with the server.
   * @todo - refactor handshake.
   * @private
   */
  _initSocket: function _initSocket() {
    var _this = this;

    this.socket = _socket2.default.initialize(this.type, this.config.socketIO);

    // see: http://socket.io/docs/client-api/#socket
    this.socket.addStateListener(function (eventName) {
      switch (eventName) {
        case 'connect':
          _this.socket.send('handshake', { urlParams: _this.urlParams });
          // wait for handshake to mark client as `ready`
          _this.socket.receive('client:start', function (uuid) {
            // don't handle server restart for now.
            _this.uuid = uuid;
            _serviceManager2.default.start();
          });
          break;
        // case 'reconnect':
        //   // serviceManager.start();
        //   break;
        // case 'disconnect':
        //   // can relaunch serviceManager on reconnection
        //   // serviceManager.reset();
        //   break;
        // case 'connect_error':
        // case 'reconnect_attempt':
        // case 'reconnecting':
        // case 'reconnect_error':
        // case 'reconnect_failed':
        //   break;
      }
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

    var appName = this.config.appName || 'Soundworks';
    this.setViewContentDefinitions({ globals: { appName: appName } });

    this.setAppContainer(this.config.appContainer);
  },


  /**
   * Extend or override application view contents with the given object.
   * @param {Object} defs - Content to be used by activities.
   * @see {@link module:soundworks/client.setViewTemplateDefinitions}
   * @example
   * client.setViewContentDefinitions({
   *   'service:platform': { myValue: 'Welcome to the application' }
   * });
   */
  setViewContentDefinitions: function setViewContentDefinitions(defs) {
    for (var key in defs) {
      var def = defs[key];

      if (this.viewContent[key]) (0, _assign2.default)(this.viewContent[key], def);else this.viewContent[key] = def;
    }

    _Activity2.default.setViewContentDefinitions(this.viewContent);
  },


  /**
   * Extend or override application view templates with the given object.
   * @param {Object} defs - Templates to be used by activities.
   * @see {@link module:soundworks/client.setViewContentDefinitions}
   * @example
   * client.setViewTemplateDefinitions({
   *   'service:platform': `
   *     <p><%= myValue %></p>
   *   `,
   * });
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
// import defaultViewContent from '../config/defaultViewContent';
// import defaultViewTemplates from '../config/defaultViewTemplates';


exports.default = client;
//# sourceMappingURL=data:application/json;base64,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aWduYWwnO1xuaW1wb3J0IEFjdGl2aXR5IGZyb20gJy4vQWN0aXZpdHknO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4vc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IHZpZXdNYW5hZ2VyIGZyb20gJy4vdmlld01hbmFnZXInO1xuaW1wb3J0IHNvY2tldCBmcm9tICcuL3NvY2tldCc7XG4vLyBpbXBvcnQgZGVmYXVsdFZpZXdDb250ZW50IGZyb20gJy4uL2NvbmZpZy9kZWZhdWx0Vmlld0NvbnRlbnQnO1xuLy8gaW1wb3J0IGRlZmF1bHRWaWV3VGVtcGxhdGVzIGZyb20gJy4uL2NvbmZpZy9kZWZhdWx0Vmlld1RlbXBsYXRlcyc7XG5pbXBvcnQgdmlld3BvcnQgZnJvbSAnLi4vdmlld3Mvdmlld3BvcnQnO1xuXG4vKipcbiAqIENsaWVudCBzaWRlIGVudHJ5IHBvaW50IGZvciBhIGBzb3VuZHdvcmtzYCBhcHBsaWNhdGlvbi5cbiAqXG4gKiBUaGlzIG9iamVjdCBob3N0cyBnZW5lcmFsIGluZm9ybWF0aW9ucyBhYm91dCB0aGUgdXNlciwgYXMgd2VsbCBhcyBtZXRob2RzXG4gKiB0byBpbml0aWFsaXplIGFuZCBzdGFydCB0aGUgYXBwbGljYXRpb24uXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQG5hbWVzcGFjZVxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBzb3VuZHdvcmtzIGZyb20gJ3NvdW5kd29ya3MvY2xpZW50JztcbiAqIGltcG9ydCBNeUV4cGVyaWVuY2UgZnJvbSAnLi9NeUV4cGVyaWVuY2UnO1xuICpcbiAqIHNvdW5kd29ya3MuY2xpZW50LmluaXQoJ3BsYXllcicpO1xuICogY29uc3QgbXlFeHBlcmllbmNlID0gbmV3IE15RXhwZXJpZW5jZSgpO1xuICogc291bmR3b3Jrcy5jbGllbnQuc3RhcnQoKTtcbiAqL1xuY29uc3QgY2xpZW50ID0ge1xuICAvKipcbiAgICogVW5pcXVlIGlkIG9mIHRoZSBjbGllbnQsIGdlbmVyYXRlZCBhbmQgcmV0cmlldmVkIGJ5IHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICB1dWlkOiBudWxsLFxuXG4gIC8qKlxuICAgKiBUaGUgdHlwZSBvZiB0aGUgY2xpZW50LCB0aGlzIGNhbiBnZW5lcmFsbHkgYmUgY29uc2lkZXJlZCBhcyB0aGUgcm9sZSBvZiB0aGVcbiAgICogY2xpZW50IGluIHRoZSBhcHBsaWNhdGlvbi4gVGhpcyB2YWx1ZSBpcyBkZWZpbmVkIGluIHRoZVxuICAgKiBbYGNsaWVudC5pbml0YF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLnNlcnZlcn5zZXJ2ZXJDb25maWd9IG9iamVjdFxuICAgKiBhbmQgZGVmYXVsdHMgdG8gYCdwbGF5ZXInYC5cbiAgICpcbiAgICogQHR5cGUge1N0cmluZ31cbiAgICovXG4gIHR5cGU6IG51bGwsXG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyYXRpb24gaW5mb3JtYXRpb25zIGZyb20gdGhlIHNlcnZlciBjb25maWd1cmF0aW9uIGlmIGFueS5cbiAgICpcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlNoYXJlZENvbmZpZ31cbiAgICovXG4gIGNvbmZpZzogbnVsbCxcblxuICAvKipcbiAgICogQXJyYXkgb2Ygb3B0aW9ubmFsIHBhcmFtZXRlcnMgcGFzc2VkIHRocm91Z2ggdGhlIHVybFxuICAgKlxuICAgKiBAdHlwZSB7QXJyYXl9XG4gICAqL1xuICAgdXJsUGFyYW1zOiBudWxsLFxuXG4gIC8qKlxuICAgKiBJbmZvcm1hdGlvbiBhYm91dCB0aGUgY2xpZW50IHBsYXRmb3JtLiBUaGUgcHJvcGVydGllcyBhcmUgc2V0IGJ5IHRoZVxuICAgKiBbYHBsYXRmb3JtYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYXRmb3JtfSBzZXJ2aWNlLlxuICAgKlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gb3MgLSBPcGVyYXRpbmcgc3lzdGVtLlxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGlzTW9iaWxlIC0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGNsaWVudCBpcyBydW5uaW5nIG9uIGFcbiAgICogIG1vYmlsZSBwbGF0Zm9ybSBvciBub3QuXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBhdWRpb0ZpbGVFeHQgLSBBdWRpbyBmaWxlIGV4dGVuc2lvbiB0byB1c2UsIGRlcGVuZGluZyBvblxuICAgKiAgdGhlIHBsYXRmb3JtLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhdGZvcm19XG4gICAqL1xuICBwbGF0Zm9ybToge1xuICAgIG9zOiBudWxsLFxuICAgIGlzTW9iaWxlOiBudWxsLFxuICAgIGF1ZGlvRmlsZUV4dDogJycsXG4gIH0sXG5cbiAgLyoqXG4gICAqIERlZmluZXMgd2hldGhlciB0aGUgdXNlcidzIGRldmljZSBpcyBjb21wYXRpYmxlIHdpdGggdGhlIGFwcGxpY2F0aW9uXG4gICAqIHJlcXVpcmVtZW50cy5cbiAgICpcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGF0Zm9ybX1cbiAgICovXG4gIGNvbXBhdGlibGU6IG51bGwsXG5cbiAgLyoqXG4gICAqIEluZGV4IChpZiBhbnkpIGdpdmVuIGJ5IGEgW2BwbGFjZXJgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhY2VyfVxuICAgKiBvciBbYGNoZWNraW5gXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQ2hlY2tpbn0gc2VydmljZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNoZWNraW59XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGFjZXJ9XG4gICAqL1xuICBpbmRleDogbnVsbCxcblxuICAvKipcbiAgICogVGlja2V0IGxhYmVsIChpZiBhbnkpIGdpdmVuIGJ5IGEgW2BwbGFjZXJgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhY2VyfVxuICAgKiBvciBbYGNoZWNraW5gXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQ2hlY2tpbn0gc2VydmljZS5cbiAgICpcbiAgICogQHR5cGUge1N0cmluZ31cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNoZWNraW59XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGFjZXJ9XG4gICAqL1xuICBsYWJlbDogbnVsbCxcblxuICAvKipcbiAgICogQ2xpZW50IGNvb3JkaW5hdGVzIChpZiBhbnkpIGdpdmVuIGJ5IGFcbiAgICogW2Bsb2NhdG9yYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkxvY2F0b3J9LFxuICAgKiBbYHBsYWNlcmBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGFjZXJ9IG9yXG4gICAqIFtgY2hlY2tpbmBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DaGVja2lufSBzZXJ2aWNlLlxuICAgKiAoRm9ybWF0OiBgW3g6TnVtYmVyLCB5Ok51bWJlcl1gLilcbiAgICpcbiAgICogQHR5cGUge0FycmF5PE51bWJlcj59XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DaGVja2lufVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuTG9jYXRvcn1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYWNlcn1cbiAgICovXG4gIGNvb3JkaW5hdGVzOiBudWxsLFxuXG4gIC8qKlxuICAgKiBTb2NrZXQgb2JqZWN0IHRoYXQgaGFuZGxlIGNvbW11bmljYXRpb25zIHdpdGggdGhlIHNlcnZlciwgaWYgYW55LlxuICAgKiBUaGlzIG9iamVjdCBpcyBhdXRvbWF0aWNhbGx5IGNyZWF0ZWQgaWYgdGhlIGV4cGVyaWVuY2UgcmVxdWlyZXMgYW55IHNlcnZpY2VcbiAgICogaGF2aW5nIGEgc2VydmVyLXNpZGUgY291bnRlcnBhcnQuXG4gICAqXG4gICAqIEB0eXBlIHttb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuc29ja2V0fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc29ja2V0OiBudWxsLFxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSBhcHBsaWNhdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IFtjbGllbnRUeXBlPSdwbGF5ZXInXSAtIFRoZSB0eXBlIG9mIHRoZSBjbGllbnQsIGRlZmluZXMgdGhlXG4gICAqICBzb2NrZXQgY29ubmVjdGlvbiBuYW1lc3BhY2UuIFNob3VsZCBtYXRjaCBhIGNsaWVudCB0eXBlIGRlZmluZWQgc2VydmVyIHNpZGUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbY29uZmlnPXt9XVxuICAgKiBAcGFyYW0ge09iamVjdH0gW2NvbmZpZy5hcHBDb250YWluZXI9JyNjb250YWluZXInXSAtIEEgY3NzIHNlbGVjdG9yXG4gICAqICBtYXRjaGluZyBhIERPTSBlbGVtZW50IHdoZXJlIHRoZSB2aWV3cyBzaG91bGQgYmUgaW5zZXJ0ZWQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbY29uZmlnLnNvY2tldElPLnVybD0nJ10gLSBUaGUgdXJsIHdoZXJlIHRoZSBzb2NrZXQgc2hvdWxkXG4gICAqICBjb25uZWN0IF8odW5zdGFibGUpXy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtjb25maWcuc29ja2V0SU8udHJhbnNwb3J0cz1bJ3dlYnNvY2tldCddXSAtIFRoZSB0cmFuc3BvcnRcbiAgICogIHVzZWQgdG8gY3JlYXRlIHRoZSB1cmwgKG92ZXJyaWRlcyBkZWZhdWx0IHNvY2tldC5pbyBtZWNhbmlzbSkgXyh1bnN0YWJsZSlfLlxuICAgKi9cbiAgaW5pdChjbGllbnRUeXBlID0gJ3BsYXllcicsIGNvbmZpZyA9IHt9KSB7XG4gICAgdGhpcy50eXBlID0gY2xpZW50VHlwZTtcblxuICAgIC8vIHJldHJpZXZlXG4gICAgdGhpcy5fcGFyc2VVcmxQYXJhbXMoKTtcbiAgICAvLyBpZiBzb2NrZXQgY29uZmlnIGdpdmVuLCBtaXggaXQgd2l0aCBkZWZhdWx0c1xuICAgIGNvbnN0IHNvY2tldElPID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICB1cmw6ICcnLFxuICAgICAgdHJhbnNwb3J0czogWyd3ZWJzb2NrZXQnXVxuICAgIH0sIGNvbmZpZy5zb2NrZXRJTyk7XG5cbiAgICAvLyBtaXggYWxsIG90aGVyIGNvbmZpZyBhbmQgb3ZlcnJpZGUgd2l0aCBkZWZpbmVkIHNvY2tldCBjb25maWdcbiAgICB0aGlzLmNvbmZpZyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgYXBwQ29udGFpbmVyOiAnI2NvbnRhaW5lcicsXG4gICAgfSwgY29uZmlnLCB7IHNvY2tldElPIH0pO1xuXG4gICAgc2VydmljZU1hbmFnZXIuaW5pdCgpO1xuXG4gICAgdGhpcy5faW5pdFZpZXdzKCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBhcHBsaWNhdGlvbi5cbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIGlmIChzb2NrZXQucmVxdWlyZWQpXG4gICAgICB0aGlzLl9pbml0U29ja2V0KCk7XG4gICAgZWxzZVxuICAgICAgc2VydmljZU1hbmFnZXIuc3RhcnQoKTtcbiAgfSxcblxuICAvKipcbiAgICogUmV0dXJucyBhIHNlcnZpY2UgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBJZGVudGlmaWVyIG9mIHRoZSBzZXJ2aWNlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE9wdGlvbnMgdG8gY29uZmlndXJlIHRoZSBzZXJ2aWNlLlxuICAgKi9cbiAgcmVxdWlyZShpZCwgb3B0aW9ucykge1xuICAgIHJldHVybiBzZXJ2aWNlTWFuYWdlci5yZXF1aXJlKGlkLCBvcHRpb25zKTtcbiAgfSxcblxuICAvKipcbiAgICogUmV0cmlldmUgYW4gYXJyYXkgb2Ygb3B0aW9ubmFsIHBhcmFtZXRlcnMgZnJvbSB0aGUgdXJsIGV4Y2x1ZGluZyB0aGUgY2xpZW50IHR5cGVcbiAgICogYW5kIHN0b3JlIGl0IGluIGB0aGlzLmNvbmZpZy51cmxQYXJhbWV0ZXJzYC5cbiAgICogUGFyYW1ldGVycyBjYW4gYmUgZGVmaW5lZCBpbiB0d28gd2F5cyA6XG4gICAqIC0gYXMgYSByZWd1bGFyIHJvdXRlIChleDogYC9wbGF5ZXIvcGFyYW0xL3BhcmFtMmApXG4gICAqIC0gYXMgYSBoYXNoIChleDogYC9wbGF5ZXIjcGFyYW0xLXBhcmFtMmApXG4gICAqIFRoZSBwYXJhbWV0ZXJzIGFyZSBzZW5kIGFsb25nIHdpdGggdGhlIHNvY2tldCBjb25uZWN0aW9uXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5zb2NrZXR9XG4gICAqIEBwcml2YXRlXG4gICAqIEB0b2RvIC0gV2hlbiBoYW5kc2hha2UgaW1wbGVtZW50ZWQsIGRlZmluZSBpZiB0aGVzZSBpbmZvcm1hdGlvbnMgc2hvdWxkIGJlIHBhcnQgb2YgaXRcbiAgICovXG4gIF9wYXJzZVVybFBhcmFtcygpIHtcbiAgICAvLyBoYW5kbGUgcGF0aCBuYW1lIGZpcnN0XG4gICAgbGV0IHBhdGhuYW1lID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xuICAgIC8vIHNhbml0aXplXG4gICAgcGF0aG5hbWUgPSBwYXRobmFtZVxuICAgICAgLnJlcGxhY2UoL15cXC8vLCAnJykgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbGVhZGluZyBzbGFzaFxuICAgICAgLnJlcGxhY2UobmV3IFJlZ0V4cCgnXicgKyB0aGlzLnR5cGUgKyAnLz8nKSwgJycpICAvLyByZW1vdmUgY2xpZW50VHlwZVxuICAgICAgLnJlcGxhY2UoL1xcLyQvLCAnJyk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHJhaWxpbmcgc2xhc2hcblxuICAgIGlmIChwYXRobmFtZS5sZW5ndGggPiAwKVxuICAgICAgdGhpcy51cmxQYXJhbXMgPSBwYXRobmFtZS5zcGxpdCgnLycpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHNvY2tldCBjb25uZWN0aW9uIGFuZCBwZXJmb3JtIGhhbmRzaGFrZSB3aXRoIHRoZSBzZXJ2ZXIuXG4gICAqIEB0b2RvIC0gcmVmYWN0b3IgaGFuZHNoYWtlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2luaXRTb2NrZXQoKSB7XG4gICAgdGhpcy5zb2NrZXQgPSBzb2NrZXQuaW5pdGlhbGl6ZSh0aGlzLnR5cGUsIHRoaXMuY29uZmlnLnNvY2tldElPKTtcblxuICAgIC8vIHNlZTogaHR0cDovL3NvY2tldC5pby9kb2NzL2NsaWVudC1hcGkvI3NvY2tldFxuICAgIHRoaXMuc29ja2V0LmFkZFN0YXRlTGlzdGVuZXIoKGV2ZW50TmFtZSkgPT4ge1xuICAgICAgc3dpdGNoIChldmVudE5hbWUpIHtcbiAgICAgICAgY2FzZSAnY29ubmVjdCc6XG4gICAgICAgICAgdGhpcy5zb2NrZXQuc2VuZCgnaGFuZHNoYWtlJywgeyB1cmxQYXJhbXM6IHRoaXMudXJsUGFyYW1zIH0pO1xuICAgICAgICAgIC8vIHdhaXQgZm9yIGhhbmRzaGFrZSB0byBtYXJrIGNsaWVudCBhcyBgcmVhZHlgXG4gICAgICAgICAgdGhpcy5zb2NrZXQucmVjZWl2ZSgnY2xpZW50OnN0YXJ0JywgKHV1aWQpID0+IHtcbiAgICAgICAgICAgIC8vIGRvbid0IGhhbmRsZSBzZXJ2ZXIgcmVzdGFydCBmb3Igbm93LlxuICAgICAgICAgICAgdGhpcy51dWlkID0gdXVpZDtcbiAgICAgICAgICAgIHNlcnZpY2VNYW5hZ2VyLnN0YXJ0KCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgLy8gY2FzZSAncmVjb25uZWN0JzpcbiAgICAgICAgICAvLyAgIC8vIHNlcnZpY2VNYW5hZ2VyLnN0YXJ0KCk7XG4gICAgICAgICAgLy8gICBicmVhaztcbiAgICAgICAgICAvLyBjYXNlICdkaXNjb25uZWN0JzpcbiAgICAgICAgICAvLyAgIC8vIGNhbiByZWxhdW5jaCBzZXJ2aWNlTWFuYWdlciBvbiByZWNvbm5lY3Rpb25cbiAgICAgICAgICAvLyAgIC8vIHNlcnZpY2VNYW5hZ2VyLnJlc2V0KCk7XG4gICAgICAgICAgLy8gICBicmVhaztcbiAgICAgICAgICAvLyBjYXNlICdjb25uZWN0X2Vycm9yJzpcbiAgICAgICAgICAvLyBjYXNlICdyZWNvbm5lY3RfYXR0ZW1wdCc6XG4gICAgICAgICAgLy8gY2FzZSAncmVjb25uZWN0aW5nJzpcbiAgICAgICAgICAvLyBjYXNlICdyZWNvbm5lY3RfZXJyb3InOlxuICAgICAgICAgIC8vIGNhc2UgJ3JlY29ubmVjdF9mYWlsZWQnOlxuICAgICAgICAgIC8vICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdmlldyB0ZW1wbGF0ZXMgZm9yIGFsbCBhY3Rpdml0aWVzLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2luaXRWaWV3cygpIHtcbiAgICB2aWV3cG9ydC5pbml0KCk7XG4gICAgLy8gaW5pdGlhbGl6ZSB2aWV3cyB3aXRoIGRlZmF1bHQgdmlldyBjb250ZW50IGFuZCB0ZW1wbGF0ZXNcbiAgICB0aGlzLnZpZXdDb250ZW50ID0ge307XG4gICAgdGhpcy52aWV3VGVtcGxhdGVzID0ge307XG5cbiAgICBjb25zdCBhcHBOYW1lID0gdGhpcy5jb25maWcuYXBwTmFtZSB8fMKgJ1NvdW5kd29ya3MnO1xuICAgIHRoaXMuc2V0Vmlld0NvbnRlbnREZWZpbml0aW9ucyh7IGdsb2JhbHM6IHsgYXBwTmFtZSB9fSk7XG5cbiAgICB0aGlzLnNldEFwcENvbnRhaW5lcih0aGlzLmNvbmZpZy5hcHBDb250YWluZXIpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBFeHRlbmQgb3Igb3ZlcnJpZGUgYXBwbGljYXRpb24gdmlldyBjb250ZW50cyB3aXRoIHRoZSBnaXZlbiBvYmplY3QuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkZWZzIC0gQ29udGVudCB0byBiZSB1c2VkIGJ5IGFjdGl2aXRpZXMuXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5zZXRWaWV3VGVtcGxhdGVEZWZpbml0aW9uc31cbiAgICogQGV4YW1wbGVcbiAgICogY2xpZW50LnNldFZpZXdDb250ZW50RGVmaW5pdGlvbnMoe1xuICAgKiAgICdzZXJ2aWNlOnBsYXRmb3JtJzogeyBteVZhbHVlOiAnV2VsY29tZSB0byB0aGUgYXBwbGljYXRpb24nIH1cbiAgICogfSk7XG4gICAqL1xuICBzZXRWaWV3Q29udGVudERlZmluaXRpb25zKGRlZnMpIHtcbiAgICBmb3IgKGxldCBrZXkgaW4gZGVmcykge1xuICAgICAgY29uc3QgZGVmID0gZGVmc1trZXldO1xuXG4gICAgICBpZiAodGhpcy52aWV3Q29udGVudFtrZXldKVxuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMudmlld0NvbnRlbnRba2V5XSwgZGVmKTtcbiAgICAgIGVsc2VcbiAgICAgICAgdGhpcy52aWV3Q29udGVudFtrZXldID0gZGVmO1xuICAgIH1cblxuICAgIEFjdGl2aXR5LnNldFZpZXdDb250ZW50RGVmaW5pdGlvbnModGhpcy52aWV3Q29udGVudCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEV4dGVuZCBvciBvdmVycmlkZSBhcHBsaWNhdGlvbiB2aWV3IHRlbXBsYXRlcyB3aXRoIHRoZSBnaXZlbiBvYmplY3QuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkZWZzIC0gVGVtcGxhdGVzIHRvIGJlIHVzZWQgYnkgYWN0aXZpdGllcy5cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LnNldFZpZXdDb250ZW50RGVmaW5pdGlvbnN9XG4gICAqIEBleGFtcGxlXG4gICAqIGNsaWVudC5zZXRWaWV3VGVtcGxhdGVEZWZpbml0aW9ucyh7XG4gICAqICAgJ3NlcnZpY2U6cGxhdGZvcm0nOiBgXG4gICAqICAgICA8cD48JT0gbXlWYWx1ZSAlPjwvcD5cbiAgICogICBgLFxuICAgKiB9KTtcbiAgICovXG4gIHNldFZpZXdUZW1wbGF0ZURlZmluaXRpb25zKGRlZnMpIHtcbiAgICB0aGlzLnZpZXdUZW1wbGF0ZXMgPSBPYmplY3QuYXNzaWduKHRoaXMudmlld1RlbXBsYXRlcywgZGVmcyk7XG4gICAgQWN0aXZpdHkuc2V0Vmlld1RlbXBsYXRlRGVmaW5pdGlvbnModGhpcy52aWV3VGVtcGxhdGVzKTtcbiAgfSxcblxuICAvKipcbiAgICogU2V0IHRoZSBET00gZWxlbW50IHRoYXQgd2lsbCBiZSB0aGUgY29udGFpbmVyIGZvciBhbGwgdmlld3MuXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7U3RyaW5nfEVsZW1lbnR9IGVsIC0gRE9NIGVsZW1lbnQgKG9yIGNzcyBzZWxlY3RvciBtYXRjaGluZ1xuICAgKiAgYW4gZXhpc3RpbmcgZWxlbWVudCkgdG8gYmUgdXNlZCBhcyB0aGUgY29udGFpbmVyIG9mIHRoZSBhcHBsaWNhdGlvbi5cbiAgICovXG4gIHNldEFwcENvbnRhaW5lcihlbCkge1xuICAgIGNvbnN0ICRjb250YWluZXIgPSBlbCBpbnN0YW5jZW9mIEVsZW1lbnQgPyBlbCA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWwpO1xuICAgIHZpZXdNYW5hZ2VyLnNldFZpZXdDb250YWluZXIoJGNvbnRhaW5lcik7XG4gIH0sXG5cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsaWVudDtcbiJdfQ==