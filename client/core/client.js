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
    var clientType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'player';
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsaWVudC5qcyJdLCJuYW1lcyI6WyJjbGllbnQiLCJ1dWlkIiwidHlwZSIsImNvbmZpZyIsInVybFBhcmFtcyIsInBsYXRmb3JtIiwib3MiLCJpc01vYmlsZSIsImF1ZGlvRmlsZUV4dCIsImNvbXBhdGlibGUiLCJpbmRleCIsImxhYmVsIiwiY29vcmRpbmF0ZXMiLCJzb2NrZXQiLCJpbml0IiwiY2xpZW50VHlwZSIsIl9wYXJzZVVybFBhcmFtcyIsInNvY2tldElPIiwidXJsIiwidHJhbnNwb3J0cyIsImFwcENvbnRhaW5lciIsIl9pbml0Vmlld3MiLCJzdGFydCIsInJlcXVpcmVkIiwiX2luaXRTb2NrZXQiLCJyZXF1aXJlIiwiaWQiLCJvcHRpb25zIiwicGF0aG5hbWUiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInJlcGxhY2UiLCJSZWdFeHAiLCJsZW5ndGgiLCJzcGxpdCIsImluaXRpYWxpemUiLCJhZGRTdGF0ZUxpc3RlbmVyIiwiZXZlbnROYW1lIiwic2VuZCIsInJlY2VpdmUiLCJ2aWV3Q29udGVudCIsInZpZXdUZW1wbGF0ZXMiLCJhcHBOYW1lIiwic2V0Vmlld0NvbnRlbnREZWZpbml0aW9ucyIsImdsb2JhbHMiLCJzZXRBcHBDb250YWluZXIiLCJkZWZzIiwia2V5IiwiZGVmIiwic2V0Vmlld1RlbXBsYXRlRGVmaW5pdGlvbnMiLCJlbCIsIiRjb250YWluZXIiLCJFbGVtZW50IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwic2V0Vmlld0NvbnRhaW5lciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFHQTs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLElBQU1BLFNBQVM7QUFDYjs7Ozs7QUFLQUMsUUFBTSxJQU5POztBQVFiOzs7Ozs7OztBQVFBQyxRQUFNLElBaEJPOztBQWtCYjs7Ozs7O0FBTUFDLFVBQVEsSUF4Qks7O0FBMEJiOzs7OztBQUtDQyxhQUFX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QXJCQTtBQUNBO2tCQW1UZW5ELE0iLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNpZ25hbCBmcm9tICcuL1NpZ25hbCc7XG5pbXBvcnQgQWN0aXZpdHkgZnJvbSAnLi9BY3Rpdml0eSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgdmlld01hbmFnZXIgZnJvbSAnLi92aWV3TWFuYWdlcic7XG5pbXBvcnQgc29ja2V0IGZyb20gJy4vc29ja2V0Jztcbi8vIGltcG9ydCBkZWZhdWx0Vmlld0NvbnRlbnQgZnJvbSAnLi4vY29uZmlnL2RlZmF1bHRWaWV3Q29udGVudCc7XG4vLyBpbXBvcnQgZGVmYXVsdFZpZXdUZW1wbGF0ZXMgZnJvbSAnLi4vY29uZmlnL2RlZmF1bHRWaWV3VGVtcGxhdGVzJztcbmltcG9ydCB2aWV3cG9ydCBmcm9tICcuLi92aWV3cy92aWV3cG9ydCc7XG5cbi8qKlxuICogQ2xpZW50IHNpZGUgZW50cnkgcG9pbnQgZm9yIGEgYHNvdW5kd29ya3NgIGFwcGxpY2F0aW9uLlxuICpcbiAqIFRoaXMgb2JqZWN0IGhvc3RzIGdlbmVyYWwgaW5mb3JtYXRpb25zIGFib3V0IHRoZSB1c2VyLCBhcyB3ZWxsIGFzIG1ldGhvZHNcbiAqIHRvIGluaXRpYWxpemUgYW5kIHN0YXJ0IHRoZSBhcHBsaWNhdGlvbi5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAbmFtZXNwYWNlXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIHNvdW5kd29ya3MgZnJvbSAnc291bmR3b3Jrcy9jbGllbnQnO1xuICogaW1wb3J0IE15RXhwZXJpZW5jZSBmcm9tICcuL015RXhwZXJpZW5jZSc7XG4gKlxuICogc291bmR3b3Jrcy5jbGllbnQuaW5pdCgncGxheWVyJyk7XG4gKiBjb25zdCBteUV4cGVyaWVuY2UgPSBuZXcgTXlFeHBlcmllbmNlKCk7XG4gKiBzb3VuZHdvcmtzLmNsaWVudC5zdGFydCgpO1xuICovXG5jb25zdCBjbGllbnQgPSB7XG4gIC8qKlxuICAgKiBVbmlxdWUgaWQgb2YgdGhlIGNsaWVudCwgZ2VuZXJhdGVkIGFuZCByZXRyaWV2ZWQgYnkgdGhlIHNlcnZlci5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHV1aWQ6IG51bGwsXG5cbiAgLyoqXG4gICAqIFRoZSB0eXBlIG9mIHRoZSBjbGllbnQsIHRoaXMgY2FuIGdlbmVyYWxseSBiZSBjb25zaWRlcmVkIGFzIHRoZSByb2xlIG9mIHRoZVxuICAgKiBjbGllbnQgaW4gdGhlIGFwcGxpY2F0aW9uLiBUaGlzIHZhbHVlIGlzIGRlZmluZWQgaW4gdGhlXG4gICAqIFtgY2xpZW50LmluaXRgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuc2VydmVyfnNlcnZlckNvbmZpZ30gb2JqZWN0XG4gICAqIGFuZCBkZWZhdWx0cyB0byBgJ3BsYXllcidgLlxuICAgKlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgdHlwZTogbnVsbCxcblxuICAvKipcbiAgICogQ29uZmlndXJhdGlvbiBpbmZvcm1hdGlvbnMgZnJvbSB0aGUgc2VydmVyIGNvbmZpZ3VyYXRpb24gaWYgYW55LlxuICAgKlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuU2hhcmVkQ29uZmlnfVxuICAgKi9cbiAgY29uZmlnOiBudWxsLFxuXG4gIC8qKlxuICAgKiBBcnJheSBvZiBvcHRpb25uYWwgcGFyYW1ldGVycyBwYXNzZWQgdGhyb3VnaCB0aGUgdXJsXG4gICAqXG4gICAqIEB0eXBlIHtBcnJheX1cbiAgICovXG4gICB1cmxQYXJhbXM6IG51bGwsXG5cbiAgLyoqXG4gICAqIEluZm9ybWF0aW9uIGFib3V0IHRoZSBjbGllbnQgcGxhdGZvcm0uIFRoZSBwcm9wZXJ0aWVzIGFyZSBzZXQgYnkgdGhlXG4gICAqIFtgcGxhdGZvcm1gXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhdGZvcm19IHNlcnZpY2UuXG4gICAqXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBvcyAtIE9wZXJhdGluZyBzeXN0ZW0uXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gaXNNb2JpbGUgLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgY2xpZW50IGlzIHJ1bm5pbmcgb24gYVxuICAgKiAgbW9iaWxlIHBsYXRmb3JtIG9yIG5vdC5cbiAgICogQHByb3BlcnR5IHtTdHJpbmd9IGF1ZGlvRmlsZUV4dCAtIEF1ZGlvIGZpbGUgZXh0ZW5zaW9uIHRvIHVzZSwgZGVwZW5kaW5nIG9uXG4gICAqICB0aGUgcGxhdGZvcm0uXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGF0Zm9ybX1cbiAgICovXG4gIHBsYXRmb3JtOiB7XG4gICAgb3M6IG51bGwsXG4gICAgaXNNb2JpbGU6IG51bGwsXG4gICAgYXVkaW9GaWxlRXh0OiAnJyxcbiAgfSxcblxuICAvKipcbiAgICogRGVmaW5lcyB3aGV0aGVyIHRoZSB1c2VyJ3MgZGV2aWNlIGlzIGNvbXBhdGlibGUgd2l0aCB0aGUgYXBwbGljYXRpb25cbiAgICogcmVxdWlyZW1lbnRzLlxuICAgKlxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYXRmb3JtfVxuICAgKi9cbiAgY29tcGF0aWJsZTogbnVsbCxcblxuICAvKipcbiAgICogSW5kZXggKGlmIGFueSkgZ2l2ZW4gYnkgYSBbYHBsYWNlcmBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGFjZXJ9XG4gICAqIG9yIFtgY2hlY2tpbmBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DaGVja2lufSBzZXJ2aWNlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQ2hlY2tpbn1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYWNlcn1cbiAgICovXG4gIGluZGV4OiBudWxsLFxuXG4gIC8qKlxuICAgKiBUaWNrZXQgbGFiZWwgKGlmIGFueSkgZ2l2ZW4gYnkgYSBbYHBsYWNlcmBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGFjZXJ9XG4gICAqIG9yIFtgY2hlY2tpbmBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DaGVja2lufSBzZXJ2aWNlLlxuICAgKlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQ2hlY2tpbn1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYWNlcn1cbiAgICovXG4gIGxhYmVsOiBudWxsLFxuXG4gIC8qKlxuICAgKiBDbGllbnQgY29vcmRpbmF0ZXMgKGlmIGFueSkgZ2l2ZW4gYnkgYVxuICAgKiBbYGxvY2F0b3JgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuTG9jYXRvcn0sXG4gICAqIFtgcGxhY2VyYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYWNlcn0gb3JcbiAgICogW2BjaGVja2luYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNoZWNraW59IHNlcnZpY2UuXG4gICAqIChGb3JtYXQ6IGBbeDpOdW1iZXIsIHk6TnVtYmVyXWAuKVxuICAgKlxuICAgKiBAdHlwZSB7QXJyYXk8TnVtYmVyPn1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNoZWNraW59XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5Mb2NhdG9yfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhY2VyfVxuICAgKi9cbiAgY29vcmRpbmF0ZXM6IG51bGwsXG5cbiAgLyoqXG4gICAqIFNvY2tldCBvYmplY3QgdGhhdCBoYW5kbGUgY29tbXVuaWNhdGlvbnMgd2l0aCB0aGUgc2VydmVyLCBpZiBhbnkuXG4gICAqIFRoaXMgb2JqZWN0IGlzIGF1dG9tYXRpY2FsbHkgY3JlYXRlZCBpZiB0aGUgZXhwZXJpZW5jZSByZXF1aXJlcyBhbnkgc2VydmljZVxuICAgKiBoYXZpbmcgYSBzZXJ2ZXItc2lkZSBjb3VudGVycGFydC5cbiAgICpcbiAgICogQHR5cGUge21vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5zb2NrZXR9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzb2NrZXQ6IG51bGwsXG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIGFwcGxpY2F0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW2NsaWVudFR5cGU9J3BsYXllciddIC0gVGhlIHR5cGUgb2YgdGhlIGNsaWVudCwgZGVmaW5lcyB0aGVcbiAgICogIHNvY2tldCBjb25uZWN0aW9uIG5hbWVzcGFjZS4gU2hvdWxkIG1hdGNoIGEgY2xpZW50IHR5cGUgZGVmaW5lZCBzZXJ2ZXIgc2lkZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtjb25maWc9e31dXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbY29uZmlnLmFwcENvbnRhaW5lcj0nI2NvbnRhaW5lciddIC0gQSBjc3Mgc2VsZWN0b3JcbiAgICogIG1hdGNoaW5nIGEgRE9NIGVsZW1lbnQgd2hlcmUgdGhlIHZpZXdzIHNob3VsZCBiZSBpbnNlcnRlZC5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtjb25maWcuc29ja2V0SU8udXJsPScnXSAtIFRoZSB1cmwgd2hlcmUgdGhlIHNvY2tldCBzaG91bGRcbiAgICogIGNvbm5lY3QgXyh1bnN0YWJsZSlfLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW2NvbmZpZy5zb2NrZXRJTy50cmFuc3BvcnRzPVsnd2Vic29ja2V0J11dIC0gVGhlIHRyYW5zcG9ydFxuICAgKiAgdXNlZCB0byBjcmVhdGUgdGhlIHVybCAob3ZlcnJpZGVzIGRlZmF1bHQgc29ja2V0LmlvIG1lY2FuaXNtKSBfKHVuc3RhYmxlKV8uXG4gICAqL1xuICBpbml0KGNsaWVudFR5cGUgPSAncGxheWVyJywgY29uZmlnID0ge30pIHtcbiAgICB0aGlzLnR5cGUgPSBjbGllbnRUeXBlO1xuXG4gICAgLy8gcmV0cmlldmVcbiAgICB0aGlzLl9wYXJzZVVybFBhcmFtcygpO1xuICAgIC8vIGlmIHNvY2tldCBjb25maWcgZ2l2ZW4sIG1peCBpdCB3aXRoIGRlZmF1bHRzXG4gICAgY29uc3Qgc29ja2V0SU8gPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIHVybDogJycsXG4gICAgICB0cmFuc3BvcnRzOiBbJ3dlYnNvY2tldCddXG4gICAgfSwgY29uZmlnLnNvY2tldElPKTtcblxuICAgIC8vIG1peCBhbGwgb3RoZXIgY29uZmlnIGFuZCBvdmVycmlkZSB3aXRoIGRlZmluZWQgc29ja2V0IGNvbmZpZ1xuICAgIHRoaXMuY29uZmlnID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICBhcHBDb250YWluZXI6ICcjY29udGFpbmVyJyxcbiAgICB9LCBjb25maWcsIHsgc29ja2V0SU8gfSk7XG5cbiAgICBzZXJ2aWNlTWFuYWdlci5pbml0KCk7XG5cbiAgICB0aGlzLl9pbml0Vmlld3MoKTtcbiAgfSxcblxuICAvKipcbiAgICogU3RhcnQgdGhlIGFwcGxpY2F0aW9uLlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgaWYgKHNvY2tldC5yZXF1aXJlZClcbiAgICAgIHRoaXMuX2luaXRTb2NrZXQoKTtcbiAgICBlbHNlXG4gICAgICBzZXJ2aWNlTWFuYWdlci5zdGFydCgpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc2VydmljZSBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIElkZW50aWZpZXIgb2YgdGhlIHNlcnZpY2UuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3B0aW9ucyB0byBjb25maWd1cmUgdGhlIHNlcnZpY2UuXG4gICAqL1xuICByZXF1aXJlKGlkLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIHNlcnZpY2VNYW5hZ2VyLnJlcXVpcmUoaWQsIG9wdGlvbnMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBhbiBhcnJheSBvZiBvcHRpb25uYWwgcGFyYW1ldGVycyBmcm9tIHRoZSB1cmwgZXhjbHVkaW5nIHRoZSBjbGllbnQgdHlwZVxuICAgKiBhbmQgc3RvcmUgaXQgaW4gYHRoaXMuY29uZmlnLnVybFBhcmFtZXRlcnNgLlxuICAgKiBQYXJhbWV0ZXJzIGNhbiBiZSBkZWZpbmVkIGluIHR3byB3YXlzIDpcbiAgICogLSBhcyBhIHJlZ3VsYXIgcm91dGUgKGV4OiBgL3BsYXllci9wYXJhbTEvcGFyYW0yYClcbiAgICogLSBhcyBhIGhhc2ggKGV4OiBgL3BsYXllciNwYXJhbTEtcGFyYW0yYClcbiAgICogVGhlIHBhcmFtZXRlcnMgYXJlIHNlbmQgYWxvbmcgd2l0aCB0aGUgc29ja2V0IGNvbm5lY3Rpb25cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LnNvY2tldH1cbiAgICogQHByaXZhdGVcbiAgICogQHRvZG8gLSBXaGVuIGhhbmRzaGFrZSBpbXBsZW1lbnRlZCwgZGVmaW5lIGlmIHRoZXNlIGluZm9ybWF0aW9ucyBzaG91bGQgYmUgcGFydCBvZiBpdFxuICAgKi9cbiAgX3BhcnNlVXJsUGFyYW1zKCkge1xuICAgIC8vIGhhbmRsZSBwYXRoIG5hbWUgZmlyc3RcbiAgICBsZXQgcGF0aG5hbWUgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG4gICAgLy8gc2FuaXRpemVcbiAgICBwYXRobmFtZSA9IHBhdGhuYW1lXG4gICAgICAucmVwbGFjZSgvXlxcLy8sICcnKSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBsZWFkaW5nIHNsYXNoXG4gICAgICAucmVwbGFjZShuZXcgUmVnRXhwKCdeJyArIHRoaXMudHlwZSArICcvPycpLCAnJykgIC8vIHJlbW92ZSBjbGllbnRUeXBlXG4gICAgICAucmVwbGFjZSgvXFwvJC8sICcnKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0cmFpbGluZyBzbGFzaFxuXG4gICAgaWYgKHBhdGhuYW1lLmxlbmd0aCA+IDApXG4gICAgICB0aGlzLnVybFBhcmFtcyA9IHBhdGhuYW1lLnNwbGl0KCcvJyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgc29ja2V0IGNvbm5lY3Rpb24gYW5kIHBlcmZvcm0gaGFuZHNoYWtlIHdpdGggdGhlIHNlcnZlci5cbiAgICogQHRvZG8gLSByZWZhY3RvciBoYW5kc2hha2UuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfaW5pdFNvY2tldCgpIHtcbiAgICB0aGlzLnNvY2tldCA9IHNvY2tldC5pbml0aWFsaXplKHRoaXMudHlwZSwgdGhpcy5jb25maWcuc29ja2V0SU8pO1xuXG4gICAgLy8gc2VlOiBodHRwOi8vc29ja2V0LmlvL2RvY3MvY2xpZW50LWFwaS8jc29ja2V0XG4gICAgdGhpcy5zb2NrZXQuYWRkU3RhdGVMaXN0ZW5lcigoZXZlbnROYW1lKSA9PiB7XG4gICAgICBzd2l0Y2ggKGV2ZW50TmFtZSkge1xuICAgICAgICBjYXNlICdjb25uZWN0JzpcbiAgICAgICAgICB0aGlzLnNvY2tldC5zZW5kKCdoYW5kc2hha2UnLCB7IHVybFBhcmFtczogdGhpcy51cmxQYXJhbXMgfSk7XG4gICAgICAgICAgLy8gd2FpdCBmb3IgaGFuZHNoYWtlIHRvIG1hcmsgY2xpZW50IGFzIGByZWFkeWBcbiAgICAgICAgICB0aGlzLnNvY2tldC5yZWNlaXZlKCdjbGllbnQ6c3RhcnQnLCAodXVpZCkgPT4ge1xuICAgICAgICAgICAgLy8gZG9uJ3QgaGFuZGxlIHNlcnZlciByZXN0YXJ0IGZvciBub3cuXG4gICAgICAgICAgICB0aGlzLnV1aWQgPSB1dWlkO1xuICAgICAgICAgICAgc2VydmljZU1hbmFnZXIuc3RhcnQoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgICAvLyBjYXNlICdyZWNvbm5lY3QnOlxuICAgICAgICAgIC8vICAgLy8gc2VydmljZU1hbmFnZXIuc3RhcnQoKTtcbiAgICAgICAgICAvLyAgIGJyZWFrO1xuICAgICAgICAgIC8vIGNhc2UgJ2Rpc2Nvbm5lY3QnOlxuICAgICAgICAgIC8vICAgLy8gY2FuIHJlbGF1bmNoIHNlcnZpY2VNYW5hZ2VyIG9uIHJlY29ubmVjdGlvblxuICAgICAgICAgIC8vICAgLy8gc2VydmljZU1hbmFnZXIucmVzZXQoKTtcbiAgICAgICAgICAvLyAgIGJyZWFrO1xuICAgICAgICAgIC8vIGNhc2UgJ2Nvbm5lY3RfZXJyb3InOlxuICAgICAgICAgIC8vIGNhc2UgJ3JlY29ubmVjdF9hdHRlbXB0JzpcbiAgICAgICAgICAvLyBjYXNlICdyZWNvbm5lY3RpbmcnOlxuICAgICAgICAgIC8vIGNhc2UgJ3JlY29ubmVjdF9lcnJvcic6XG4gICAgICAgICAgLy8gY2FzZSAncmVjb25uZWN0X2ZhaWxlZCc6XG4gICAgICAgICAgLy8gICBicmVhaztcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSB2aWV3IHRlbXBsYXRlcyBmb3IgYWxsIGFjdGl2aXRpZXMuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfaW5pdFZpZXdzKCkge1xuICAgIHZpZXdwb3J0LmluaXQoKTtcbiAgICAvLyBpbml0aWFsaXplIHZpZXdzIHdpdGggZGVmYXVsdCB2aWV3IGNvbnRlbnQgYW5kIHRlbXBsYXRlc1xuICAgIHRoaXMudmlld0NvbnRlbnQgPSB7fTtcbiAgICB0aGlzLnZpZXdUZW1wbGF0ZXMgPSB7fTtcblxuICAgIGNvbnN0IGFwcE5hbWUgPSB0aGlzLmNvbmZpZy5hcHBOYW1lIHx8wqAnU291bmR3b3Jrcyc7XG4gICAgdGhpcy5zZXRWaWV3Q29udGVudERlZmluaXRpb25zKHsgZ2xvYmFsczogeyBhcHBOYW1lIH19KTtcblxuICAgIHRoaXMuc2V0QXBwQ29udGFpbmVyKHRoaXMuY29uZmlnLmFwcENvbnRhaW5lcik7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEV4dGVuZCBvciBvdmVycmlkZSBhcHBsaWNhdGlvbiB2aWV3IGNvbnRlbnRzIHdpdGggdGhlIGdpdmVuIG9iamVjdC5cbiAgICogQHBhcmFtIHtPYmplY3R9IGRlZnMgLSBDb250ZW50IHRvIGJlIHVzZWQgYnkgYWN0aXZpdGllcy5cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LnNldFZpZXdUZW1wbGF0ZURlZmluaXRpb25zfVxuICAgKiBAZXhhbXBsZVxuICAgKiBjbGllbnQuc2V0Vmlld0NvbnRlbnREZWZpbml0aW9ucyh7XG4gICAqICAgJ3NlcnZpY2U6cGxhdGZvcm0nOiB7IG15VmFsdWU6ICdXZWxjb21lIHRvIHRoZSBhcHBsaWNhdGlvbicgfVxuICAgKiB9KTtcbiAgICovXG4gIHNldFZpZXdDb250ZW50RGVmaW5pdGlvbnMoZGVmcykge1xuICAgIGZvciAobGV0IGtleSBpbiBkZWZzKSB7XG4gICAgICBjb25zdCBkZWYgPSBkZWZzW2tleV07XG5cbiAgICAgIGlmICh0aGlzLnZpZXdDb250ZW50W2tleV0pXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcy52aWV3Q29udGVudFtrZXldLCBkZWYpO1xuICAgICAgZWxzZVxuICAgICAgICB0aGlzLnZpZXdDb250ZW50W2tleV0gPSBkZWY7XG4gICAgfVxuXG4gICAgQWN0aXZpdHkuc2V0Vmlld0NvbnRlbnREZWZpbml0aW9ucyh0aGlzLnZpZXdDb250ZW50KTtcbiAgfSxcblxuICAvKipcbiAgICogRXh0ZW5kIG9yIG92ZXJyaWRlIGFwcGxpY2F0aW9uIHZpZXcgdGVtcGxhdGVzIHdpdGggdGhlIGdpdmVuIG9iamVjdC5cbiAgICogQHBhcmFtIHtPYmplY3R9IGRlZnMgLSBUZW1wbGF0ZXMgdG8gYmUgdXNlZCBieSBhY3Rpdml0aWVzLlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuc2V0Vmlld0NvbnRlbnREZWZpbml0aW9uc31cbiAgICogQGV4YW1wbGVcbiAgICogY2xpZW50LnNldFZpZXdUZW1wbGF0ZURlZmluaXRpb25zKHtcbiAgICogICAnc2VydmljZTpwbGF0Zm9ybSc6IGBcbiAgICogICAgIDxwPjwlPSBteVZhbHVlICU+PC9wPlxuICAgKiAgIGAsXG4gICAqIH0pO1xuICAgKi9cbiAgc2V0Vmlld1RlbXBsYXRlRGVmaW5pdGlvbnMoZGVmcykge1xuICAgIHRoaXMudmlld1RlbXBsYXRlcyA9IE9iamVjdC5hc3NpZ24odGhpcy52aWV3VGVtcGxhdGVzLCBkZWZzKTtcbiAgICBBY3Rpdml0eS5zZXRWaWV3VGVtcGxhdGVEZWZpbml0aW9ucyh0aGlzLnZpZXdUZW1wbGF0ZXMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIERPTSBlbGVtbnQgdGhhdCB3aWxsIGJlIHRoZSBjb250YWluZXIgZm9yIGFsbCB2aWV3cy5cbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtTdHJpbmd8RWxlbWVudH0gZWwgLSBET00gZWxlbWVudCAob3IgY3NzIHNlbGVjdG9yIG1hdGNoaW5nXG4gICAqICBhbiBleGlzdGluZyBlbGVtZW50KSB0byBiZSB1c2VkIGFzIHRoZSBjb250YWluZXIgb2YgdGhlIGFwcGxpY2F0aW9uLlxuICAgKi9cbiAgc2V0QXBwQ29udGFpbmVyKGVsKSB7XG4gICAgY29uc3QgJGNvbnRhaW5lciA9IGVsIGluc3RhbmNlb2YgRWxlbWVudCA/IGVsIDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbCk7XG4gICAgdmlld01hbmFnZXIuc2V0Vmlld0NvbnRhaW5lcigkY29udGFpbmVyKTtcbiAgfSxcblxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xpZW50O1xuIl19