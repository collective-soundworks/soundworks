'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

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
   * @see {@link module:soundworks/client.client~init}
   * @see {@link module:soundworks/client.SharedConfig}
   */
  config: {},

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
   * @property {String} interaction - Type of interaction allowed by the
   *  viewport, `touch` or `mouse`
   *
   * @see {@link module:soundworks/client.Platform}
   */
  platform: {
    os: null,
    isMobile: null,
    audioFileExt: '',
    interaction: null
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
   * @see {@link module:soundworks/client.Geolocation}
   */
  coordinates: null,

  /**
   * Full `geoposition` object as returned by `navigator.geolocation`, when
   * using the `geolocation` service.
   *
   * @type {Object}
   * @see {@link module:soundworks/client.Geolocation}
   */
  geoposition: null,

  /**
   * Socket object that handle communications with the server, if any.
   * This object is automatically created if the experience requires any service
   * having a server-side counterpart.
   *
   * @type {module:soundworks/client.socket}
   * @private
   */
  socket: _socket2.default,

  /**
   * Initialize the application.
   *
   * @param {String} [clientType='player'] - The type of the client, defines the
   *  socket connection namespace. Should match a client type defined server side.
   * @param {Object} [config={}]
   * @param {Object} [config.appContainer='#container'] - A css selector
   *  matching a DOM element where the views should be inserted.
   * @param {Object} [config.websockets.url=''] - The url where the socket should
   *  connect _(unstable)_.
   * @param {Object} [config.websockets.transports=['websocket']] - The transport
   *  used to create the url (overrides default socket.io mecanism) _(unstable)_.
   */
  init: function init() {
    var clientType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'player';
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    this.type = clientType;

    this._parseUrlParams();
    // if socket config given, mix it with defaults
    var websockets = (0, _assign2.default)({
      url: '',
      transports: ['websocket'],
      path: ''
    }, config.websockets);

    // mix all other config and override with defined socket config
    (0, _assign2.default)(this.config, config, { websockets: websockets });

    _serviceManager2.default.init();
    _viewport2.default.init();

    var el = config.appContainer;
    var $container = el instanceof Element ? el : document.querySelector(el);
    _viewManager2.default.setAppContainer($container);

    return _promise2.default.resolve();
  },


  /**
   * Register a function to be executed when a service is instanciated.
   *
   * @param {serviceManager~serviceInstanciationHook} func - Function to
   *  register has a hook to be execute when a service is created.
   */
  /**
   * @callback serviceManager~serviceInstanciationHook
   * @param {String} id - id of the instanciated service.
   * @param {Service} instance - instance of the service.
   */
  setServiceInstanciationHook: function setServiceInstanciationHook(func) {
    _serviceManager2.default.setServiceInstanciationHook(func);
  },


  /**
   * Start the application.
   */
  start: function start() {
    if (_socket2.default.required) this._initSocket(function () {
      return _serviceManager2.default.start();
    });else _serviceManager2.default.start();
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
   * and store it in `this.urlParams`.
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
    var _this = this;

    var pathParams = null;
    var hashParams = null;
    // handle path name first
    var pathname = window.location.pathname;
    // sanitize
    pathname = pathname.replace(/^\//, '') // leading slash
    .replace(new RegExp('^' + this.type + '/?'), '') // remove clientType
    .replace(/\/$/, ''); // trailing slash

    if (pathname.length > 0) pathParams = pathname.split('/');

    // handle hash
    var hash = window.location.hash;
    hash = hash.replace(/^#/, '');

    if (hash.length > 0) hashParams = hash.split('-');

    if (pathParams || hashParams) {
      this.urlParams = [];

      if (pathParams) pathParams.forEach(function (param) {
        return _this.urlParams.push(param);
      });

      if (hashParams) hashParams.forEach(function (param) {
        return _this.urlParams.push(param);
      });
    }
  },


  /**
   * Initialize socket connection and perform handshake with the server.
   * @todo - refactor handshake.
   * @private
   */
  _initSocket: function _initSocket(callback) {
    var _this2 = this;

    _socket2.default.init(this.type, this.config.websockets);

    // see: http://socket.io/docs/client-api/#socket
    this.socket.addStateListener(function (eventName) {
      switch (eventName) {
        case 'connect':
          var payload = { urlParams: _this2.urlParams };

          if (_this2.config.env !== 'production') {
            (0, _assign2.default)(payload, {
              requiredServices: _serviceManager2.default.getRequiredServices()
            });
          }

          _this2.socket.send('handshake', payload);
          // wait for handshake response to mark client as `ready`
          _this2.socket.receive('client:start', function (uuid) {
            _this2.uuid = uuid;
            callback();
          });

          _this2.socket.receive('client:error', function (err) {
            switch (err.type) {
              case 'services':
                // can only append if env !== 'production'
                var msg = '"' + err.data.join(', ') + '" required client-side but not server-side';
                throw new Error(msg);
                break;
            }
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
  }
};
// import defaultViewContent from '../config/defaultViewContent';
// import defaultViewTemplates from '../config/defaultViewTemplates';
exports.default = client;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsaWVudC5qcyJdLCJuYW1lcyI6WyJjbGllbnQiLCJ1dWlkIiwidHlwZSIsImNvbmZpZyIsInVybFBhcmFtcyIsInBsYXRmb3JtIiwib3MiLCJpc01vYmlsZSIsImF1ZGlvRmlsZUV4dCIsImludGVyYWN0aW9uIiwiY29tcGF0aWJsZSIsImluZGV4IiwibGFiZWwiLCJjb29yZGluYXRlcyIsImdlb3Bvc2l0aW9uIiwic29ja2V0IiwiaW5pdCIsImNsaWVudFR5cGUiLCJfcGFyc2VVcmxQYXJhbXMiLCJ3ZWJzb2NrZXRzIiwidXJsIiwidHJhbnNwb3J0cyIsInBhdGgiLCJlbCIsImFwcENvbnRhaW5lciIsIiRjb250YWluZXIiLCJFbGVtZW50IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwic2V0QXBwQ29udGFpbmVyIiwicmVzb2x2ZSIsInNldFNlcnZpY2VJbnN0YW5jaWF0aW9uSG9vayIsImZ1bmMiLCJzdGFydCIsInJlcXVpcmVkIiwiX2luaXRTb2NrZXQiLCJyZXF1aXJlIiwiaWQiLCJvcHRpb25zIiwicGF0aFBhcmFtcyIsImhhc2hQYXJhbXMiLCJwYXRobmFtZSIsIndpbmRvdyIsImxvY2F0aW9uIiwicmVwbGFjZSIsIlJlZ0V4cCIsImxlbmd0aCIsInNwbGl0IiwiaGFzaCIsImZvckVhY2giLCJwYXJhbSIsInB1c2giLCJjYWxsYmFjayIsImFkZFN0YXRlTGlzdGVuZXIiLCJldmVudE5hbWUiLCJwYXlsb2FkIiwiZW52IiwicmVxdWlyZWRTZXJ2aWNlcyIsImdldFJlcXVpcmVkU2VydmljZXMiLCJzZW5kIiwicmVjZWl2ZSIsImVyciIsIm1zZyIsImRhdGEiLCJqb2luIiwiRXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFHQTs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLElBQU1BLFNBQVM7QUFDYjs7Ozs7QUFLQUMsUUFBTSxJQU5POztBQVFiOzs7Ozs7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RCxXQUhEOztBQUtBLGlCQUFLckMsTUFBTCxDQUFZNkMsT0FBWixDQUFvQixjQUFwQixFQUFvQyxVQUFDQyxHQUFELEVBQVM7QUFDM0Msb0JBQVFBLElBQUkzRCxJQUFaO0FBQ0UsbUJBQUssVUFBTDtBQUNFO0FBQ0Esb0JBQU00RCxZQUFVRCxJQUFJRSxJQUFKLENBQVNDLElBQVQsQ0FBYyxJQUFkLENBQVYsK0NBQU47QUFDQSxzQkFBTSxJQUFJQyxLQUFKLENBQVVILEdBQVYsQ0FBTjtBQUNBO0FBTEo7QUFPRCxXQVJEO0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXZDSjtBQXlDRCxLQTFDRDtBQTJDRDtBQTlSWSxDQUFmO0FBckJBO0FBQ0E7a0JBcVRlOUQsTSIsImZpbGUiOiJjbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWN0aXZpdHkgZnJvbSAnLi9BY3Rpdml0eSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgdmlld01hbmFnZXIgZnJvbSAnLi92aWV3TWFuYWdlcic7XG5pbXBvcnQgc29ja2V0IGZyb20gJy4vc29ja2V0Jztcbi8vIGltcG9ydCBkZWZhdWx0Vmlld0NvbnRlbnQgZnJvbSAnLi4vY29uZmlnL2RlZmF1bHRWaWV3Q29udGVudCc7XG4vLyBpbXBvcnQgZGVmYXVsdFZpZXdUZW1wbGF0ZXMgZnJvbSAnLi4vY29uZmlnL2RlZmF1bHRWaWV3VGVtcGxhdGVzJztcbmltcG9ydCB2aWV3cG9ydCBmcm9tICcuLi92aWV3cy92aWV3cG9ydCc7XG5cbi8qKlxuICogQ2xpZW50IHNpZGUgZW50cnkgcG9pbnQgZm9yIGEgYHNvdW5kd29ya3NgIGFwcGxpY2F0aW9uLlxuICpcbiAqIFRoaXMgb2JqZWN0IGhvc3RzIGdlbmVyYWwgaW5mb3JtYXRpb25zIGFib3V0IHRoZSB1c2VyLCBhcyB3ZWxsIGFzIG1ldGhvZHNcbiAqIHRvIGluaXRpYWxpemUgYW5kIHN0YXJ0IHRoZSBhcHBsaWNhdGlvbi5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAbmFtZXNwYWNlXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIHNvdW5kd29ya3MgZnJvbSAnc291bmR3b3Jrcy9jbGllbnQnO1xuICogaW1wb3J0IE15RXhwZXJpZW5jZSBmcm9tICcuL015RXhwZXJpZW5jZSc7XG4gKlxuICogc291bmR3b3Jrcy5jbGllbnQuaW5pdCgncGxheWVyJyk7XG4gKiBjb25zdCBteUV4cGVyaWVuY2UgPSBuZXcgTXlFeHBlcmllbmNlKCk7XG4gKiBzb3VuZHdvcmtzLmNsaWVudC5zdGFydCgpO1xuICovXG5jb25zdCBjbGllbnQgPSB7XG4gIC8qKlxuICAgKiBVbmlxdWUgaWQgb2YgdGhlIGNsaWVudCwgZ2VuZXJhdGVkIGFuZCByZXRyaWV2ZWQgYnkgdGhlIHNlcnZlci5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHV1aWQ6IG51bGwsXG5cbiAgLyoqXG4gICAqIFRoZSB0eXBlIG9mIHRoZSBjbGllbnQsIHRoaXMgY2FuIGdlbmVyYWxseSBiZSBjb25zaWRlcmVkIGFzIHRoZSByb2xlIG9mIHRoZVxuICAgKiBjbGllbnQgaW4gdGhlIGFwcGxpY2F0aW9uLiBUaGlzIHZhbHVlIGlzIGRlZmluZWQgaW4gdGhlXG4gICAqIFtgY2xpZW50LmluaXRgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuc2VydmVyfnNlcnZlckNvbmZpZ30gb2JqZWN0XG4gICAqIGFuZCBkZWZhdWx0cyB0byBgJ3BsYXllcidgLlxuICAgKlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgdHlwZTogbnVsbCxcblxuICAvKipcbiAgICogQ29uZmlndXJhdGlvbiBpbmZvcm1hdGlvbnMgZnJvbSB0aGUgc2VydmVyIGNvbmZpZ3VyYXRpb24gaWYgYW55LlxuICAgKlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuY2xpZW50fmluaXR9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5TaGFyZWRDb25maWd9XG4gICAqL1xuICBjb25maWc6IHt9LFxuXG4gIC8qKlxuICAgKiBBcnJheSBvZiBvcHRpb25uYWwgcGFyYW1ldGVycyBwYXNzZWQgdGhyb3VnaCB0aGUgdXJsXG4gICAqXG4gICAqIEB0eXBlIHtBcnJheX1cbiAgICovXG4gICB1cmxQYXJhbXM6IG51bGwsXG5cbiAgLyoqXG4gICAqIEluZm9ybWF0aW9uIGFib3V0IHRoZSBjbGllbnQgcGxhdGZvcm0uIFRoZSBwcm9wZXJ0aWVzIGFyZSBzZXQgYnkgdGhlXG4gICAqIFtgcGxhdGZvcm1gXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhdGZvcm19IHNlcnZpY2UuXG4gICAqXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBvcyAtIE9wZXJhdGluZyBzeXN0ZW0uXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gaXNNb2JpbGUgLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgY2xpZW50IGlzIHJ1bm5pbmcgb24gYVxuICAgKiAgbW9iaWxlIHBsYXRmb3JtIG9yIG5vdC5cbiAgICogQHByb3BlcnR5IHtTdHJpbmd9IGF1ZGlvRmlsZUV4dCAtIEF1ZGlvIGZpbGUgZXh0ZW5zaW9uIHRvIHVzZSwgZGVwZW5kaW5nIG9uXG4gICAqICB0aGUgcGxhdGZvcm0uXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBpbnRlcmFjdGlvbiAtIFR5cGUgb2YgaW50ZXJhY3Rpb24gYWxsb3dlZCBieSB0aGVcbiAgICogIHZpZXdwb3J0LCBgdG91Y2hgIG9yIGBtb3VzZWBcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYXRmb3JtfVxuICAgKi9cbiAgcGxhdGZvcm06IHtcbiAgICBvczogbnVsbCxcbiAgICBpc01vYmlsZTogbnVsbCxcbiAgICBhdWRpb0ZpbGVFeHQ6ICcnLFxuICAgIGludGVyYWN0aW9uOiBudWxsLFxuICB9LFxuXG4gIC8qKlxuICAgKiBEZWZpbmVzIHdoZXRoZXIgdGhlIHVzZXIncyBkZXZpY2UgaXMgY29tcGF0aWJsZSB3aXRoIHRoZSBhcHBsaWNhdGlvblxuICAgKiByZXF1aXJlbWVudHMuXG4gICAqXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhdGZvcm19XG4gICAqL1xuICBjb21wYXRpYmxlOiBudWxsLFxuXG4gIC8qKlxuICAgKiBJbmRleCAoaWYgYW55KSBnaXZlbiBieSBhIFtgcGxhY2VyYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYWNlcn1cbiAgICogb3IgW2BjaGVja2luYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNoZWNraW59IHNlcnZpY2UuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DaGVja2lufVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhY2VyfVxuICAgKi9cbiAgaW5kZXg6IG51bGwsXG5cbiAgLyoqXG4gICAqIFRpY2tldCBsYWJlbCAoaWYgYW55KSBnaXZlbiBieSBhIFtgcGxhY2VyYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYWNlcn1cbiAgICogb3IgW2BjaGVja2luYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNoZWNraW59IHNlcnZpY2UuXG4gICAqXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DaGVja2lufVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhY2VyfVxuICAgKi9cbiAgbGFiZWw6IG51bGwsXG5cbiAgLyoqXG4gICAqIENsaWVudCBjb29yZGluYXRlcyAoaWYgYW55KSBnaXZlbiBieSBhXG4gICAqIFtgbG9jYXRvcmBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5Mb2NhdG9yfSxcbiAgICogW2BwbGFjZXJgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhY2VyfSBvclxuICAgKiBbYGNoZWNraW5gXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQ2hlY2tpbn0gc2VydmljZS5cbiAgICogKEZvcm1hdDogYFt4Ok51bWJlciwgeTpOdW1iZXJdYC4pXG4gICAqXG4gICAqIEB0eXBlIHtBcnJheTxOdW1iZXI+fVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQ2hlY2tpbn1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkxvY2F0b3J9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGFjZXJ9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5HZW9sb2NhdGlvbn1cbiAgICovXG4gIGNvb3JkaW5hdGVzOiBudWxsLFxuXG4gIC8qKlxuICAgKiBGdWxsIGBnZW9wb3NpdGlvbmAgb2JqZWN0IGFzIHJldHVybmVkIGJ5IGBuYXZpZ2F0b3IuZ2VvbG9jYXRpb25gLCB3aGVuXG4gICAqIHVzaW5nIHRoZSBgZ2VvbG9jYXRpb25gIHNlcnZpY2UuXG4gICAqXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5HZW9sb2NhdGlvbn1cbiAgICovXG4gIGdlb3Bvc2l0aW9uOiBudWxsLFxuXG4gIC8qKlxuICAgKiBTb2NrZXQgb2JqZWN0IHRoYXQgaGFuZGxlIGNvbW11bmljYXRpb25zIHdpdGggdGhlIHNlcnZlciwgaWYgYW55LlxuICAgKiBUaGlzIG9iamVjdCBpcyBhdXRvbWF0aWNhbGx5IGNyZWF0ZWQgaWYgdGhlIGV4cGVyaWVuY2UgcmVxdWlyZXMgYW55IHNlcnZpY2VcbiAgICogaGF2aW5nIGEgc2VydmVyLXNpZGUgY291bnRlcnBhcnQuXG4gICAqXG4gICAqIEB0eXBlIHttb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuc29ja2V0fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc29ja2V0OiBzb2NrZXQsXG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIGFwcGxpY2F0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW2NsaWVudFR5cGU9J3BsYXllciddIC0gVGhlIHR5cGUgb2YgdGhlIGNsaWVudCwgZGVmaW5lcyB0aGVcbiAgICogIHNvY2tldCBjb25uZWN0aW9uIG5hbWVzcGFjZS4gU2hvdWxkIG1hdGNoIGEgY2xpZW50IHR5cGUgZGVmaW5lZCBzZXJ2ZXIgc2lkZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtjb25maWc9e31dXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbY29uZmlnLmFwcENvbnRhaW5lcj0nI2NvbnRhaW5lciddIC0gQSBjc3Mgc2VsZWN0b3JcbiAgICogIG1hdGNoaW5nIGEgRE9NIGVsZW1lbnQgd2hlcmUgdGhlIHZpZXdzIHNob3VsZCBiZSBpbnNlcnRlZC5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtjb25maWcud2Vic29ja2V0cy51cmw9JyddIC0gVGhlIHVybCB3aGVyZSB0aGUgc29ja2V0IHNob3VsZFxuICAgKiAgY29ubmVjdCBfKHVuc3RhYmxlKV8uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbY29uZmlnLndlYnNvY2tldHMudHJhbnNwb3J0cz1bJ3dlYnNvY2tldCddXSAtIFRoZSB0cmFuc3BvcnRcbiAgICogIHVzZWQgdG8gY3JlYXRlIHRoZSB1cmwgKG92ZXJyaWRlcyBkZWZhdWx0IHNvY2tldC5pbyBtZWNhbmlzbSkgXyh1bnN0YWJsZSlfLlxuICAgKi9cbiAgaW5pdChjbGllbnRUeXBlID0gJ3BsYXllcicsIGNvbmZpZyA9IHt9KSB7XG4gICAgdGhpcy50eXBlID0gY2xpZW50VHlwZTtcblxuICAgIHRoaXMuX3BhcnNlVXJsUGFyYW1zKCk7XG4gICAgLy8gaWYgc29ja2V0IGNvbmZpZyBnaXZlbiwgbWl4IGl0IHdpdGggZGVmYXVsdHNcbiAgICBjb25zdCB3ZWJzb2NrZXRzID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICB1cmw6ICcnLFxuICAgICAgdHJhbnNwb3J0czogWyd3ZWJzb2NrZXQnXSxcbiAgICAgIHBhdGg6ICcnLFxuICAgIH0sIGNvbmZpZy53ZWJzb2NrZXRzKTtcblxuICAgIC8vIG1peCBhbGwgb3RoZXIgY29uZmlnIGFuZCBvdmVycmlkZSB3aXRoIGRlZmluZWQgc29ja2V0IGNvbmZpZ1xuICAgIE9iamVjdC5hc3NpZ24odGhpcy5jb25maWcsIGNvbmZpZywgeyB3ZWJzb2NrZXRzIH0pO1xuXG4gICAgc2VydmljZU1hbmFnZXIuaW5pdCgpO1xuICAgIHZpZXdwb3J0LmluaXQoKTtcblxuICAgIGNvbnN0IGVsID0gY29uZmlnLmFwcENvbnRhaW5lcjtcbiAgICBjb25zdCAkY29udGFpbmVyID0gZWwgaW5zdGFuY2VvZiBFbGVtZW50ID8gZWwgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsKTtcbiAgICB2aWV3TWFuYWdlci5zZXRBcHBDb250YWluZXIoJGNvbnRhaW5lcik7XG5cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgZnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWQgd2hlbiBhIHNlcnZpY2UgaXMgaW5zdGFuY2lhdGVkLlxuICAgKlxuICAgKiBAcGFyYW0ge3NlcnZpY2VNYW5hZ2VyfnNlcnZpY2VJbnN0YW5jaWF0aW9uSG9va30gZnVuYyAtIEZ1bmN0aW9uIHRvXG4gICAqICByZWdpc3RlciBoYXMgYSBob29rIHRvIGJlIGV4ZWN1dGUgd2hlbiBhIHNlcnZpY2UgaXMgY3JlYXRlZC5cbiAgICovXG4gIC8qKlxuICAgKiBAY2FsbGJhY2sgc2VydmljZU1hbmFnZXJ+c2VydmljZUluc3RhbmNpYXRpb25Ib29rXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIGlkIG9mIHRoZSBpbnN0YW5jaWF0ZWQgc2VydmljZS5cbiAgICogQHBhcmFtIHtTZXJ2aWNlfSBpbnN0YW5jZSAtIGluc3RhbmNlIG9mIHRoZSBzZXJ2aWNlLlxuICAgKi9cbiAgc2V0U2VydmljZUluc3RhbmNpYXRpb25Ib29rKGZ1bmMpIHtcbiAgICBzZXJ2aWNlTWFuYWdlci5zZXRTZXJ2aWNlSW5zdGFuY2lhdGlvbkhvb2soZnVuYyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBhcHBsaWNhdGlvbi5cbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIGlmIChzb2NrZXQucmVxdWlyZWQpXG4gICAgICB0aGlzLl9pbml0U29ja2V0KCgpID0+IHNlcnZpY2VNYW5hZ2VyLnN0YXJ0KCkpO1xuICAgIGVsc2VcbiAgICAgIHNlcnZpY2VNYW5hZ2VyLnN0YXJ0KCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzZXJ2aWNlIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gSWRlbnRpZmllciBvZiB0aGUgc2VydmljZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPcHRpb25zIHRvIGNvbmZpZ3VyZSB0aGUgc2VydmljZS5cbiAgICovXG4gIHJlcXVpcmUoaWQsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gc2VydmljZU1hbmFnZXIucmVxdWlyZShpZCwgb3B0aW9ucyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIGFuIGFycmF5IG9mIG9wdGlvbm5hbCBwYXJhbWV0ZXJzIGZyb20gdGhlIHVybCBleGNsdWRpbmcgdGhlIGNsaWVudCB0eXBlXG4gICAqIGFuZCBzdG9yZSBpdCBpbiBgdGhpcy51cmxQYXJhbXNgLlxuICAgKiBQYXJhbWV0ZXJzIGNhbiBiZSBkZWZpbmVkIGluIHR3byB3YXlzIDpcbiAgICogLSBhcyBhIHJlZ3VsYXIgcm91dGUgKGV4OiBgL3BsYXllci9wYXJhbTEvcGFyYW0yYClcbiAgICogLSBhcyBhIGhhc2ggKGV4OiBgL3BsYXllciNwYXJhbTEtcGFyYW0yYClcbiAgICogVGhlIHBhcmFtZXRlcnMgYXJlIHNlbmQgYWxvbmcgd2l0aCB0aGUgc29ja2V0IGNvbm5lY3Rpb25cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LnNvY2tldH1cbiAgICogQHByaXZhdGVcbiAgICogQHRvZG8gLSBXaGVuIGhhbmRzaGFrZSBpbXBsZW1lbnRlZCwgZGVmaW5lIGlmIHRoZXNlIGluZm9ybWF0aW9ucyBzaG91bGQgYmUgcGFydCBvZiBpdFxuICAgKi9cbiAgX3BhcnNlVXJsUGFyYW1zKCkge1xuICAgIGxldCBwYXRoUGFyYW1zID0gbnVsbDtcbiAgICBsZXQgaGFzaFBhcmFtcyA9IG51bGw7XG4gICAgLy8gaGFuZGxlIHBhdGggbmFtZSBmaXJzdFxuICAgIGxldCBwYXRobmFtZSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcbiAgICAvLyBzYW5pdGl6ZVxuICAgIHBhdGhuYW1lID0gcGF0aG5hbWVcbiAgICAgIC5yZXBsYWNlKC9eXFwvLywgJycpICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxlYWRpbmcgc2xhc2hcbiAgICAgIC5yZXBsYWNlKG5ldyBSZWdFeHAoJ14nICsgdGhpcy50eXBlICsgJy8/JyksICcnKSAgLy8gcmVtb3ZlIGNsaWVudFR5cGVcbiAgICAgIC5yZXBsYWNlKC9cXC8kLywgJycpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRyYWlsaW5nIHNsYXNoXG5cbiAgICBpZiAocGF0aG5hbWUubGVuZ3RoID4gMClcbiAgICAgIHBhdGhQYXJhbXMgPSBwYXRobmFtZS5zcGxpdCgnLycpO1xuXG4gICAgLy8gaGFuZGxlIGhhc2hcbiAgICBsZXQgaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoO1xuICAgIGhhc2ggPSBoYXNoLnJlcGxhY2UoL14jLywgJycpO1xuXG4gICAgaWYgKGhhc2gubGVuZ3RoID4gMClcbiAgICAgIGhhc2hQYXJhbXMgPSBoYXNoLnNwbGl0KCctJyk7XG5cbiAgICBpZiAocGF0aFBhcmFtcyB8fMKgaGFzaFBhcmFtcykge1xuICAgICAgdGhpcy51cmxQYXJhbXMgPSBbXTtcblxuICAgICAgaWYgKHBhdGhQYXJhbXMpXG4gICAgICAgIHBhdGhQYXJhbXMuZm9yRWFjaCgocGFyYW0pID0+IHRoaXMudXJsUGFyYW1zLnB1c2gocGFyYW0pKTtcblxuICAgICAgaWYgKGhhc2hQYXJhbXMpXG4gICAgICAgIGhhc2hQYXJhbXMuZm9yRWFjaCgocGFyYW0pID0+IHRoaXMudXJsUGFyYW1zLnB1c2gocGFyYW0pKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgc29ja2V0IGNvbm5lY3Rpb24gYW5kIHBlcmZvcm0gaGFuZHNoYWtlIHdpdGggdGhlIHNlcnZlci5cbiAgICogQHRvZG8gLSByZWZhY3RvciBoYW5kc2hha2UuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfaW5pdFNvY2tldChjYWxsYmFjaykge1xuICAgIHNvY2tldC5pbml0KHRoaXMudHlwZSwgdGhpcy5jb25maWcud2Vic29ja2V0cyk7XG5cbiAgICAvLyBzZWU6IGh0dHA6Ly9zb2NrZXQuaW8vZG9jcy9jbGllbnQtYXBpLyNzb2NrZXRcbiAgICB0aGlzLnNvY2tldC5hZGRTdGF0ZUxpc3RlbmVyKChldmVudE5hbWUpID0+IHtcbiAgICAgIHN3aXRjaCAoZXZlbnROYW1lKSB7XG4gICAgICAgIGNhc2UgJ2Nvbm5lY3QnOlxuICAgICAgICAgIGNvbnN0IHBheWxvYWQgPSB7IHVybFBhcmFtczogdGhpcy51cmxQYXJhbXMgfTtcblxuICAgICAgICAgIGlmICh0aGlzLmNvbmZpZy5lbnYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihwYXlsb2FkLCB7XG4gICAgICAgICAgICAgIHJlcXVpcmVkU2VydmljZXM6IHNlcnZpY2VNYW5hZ2VyLmdldFJlcXVpcmVkU2VydmljZXMoKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5zb2NrZXQuc2VuZCgnaGFuZHNoYWtlJywgcGF5bG9hZCk7XG4gICAgICAgICAgLy8gd2FpdCBmb3IgaGFuZHNoYWtlIHJlc3BvbnNlIHRvIG1hcmsgY2xpZW50IGFzIGByZWFkeWBcbiAgICAgICAgICB0aGlzLnNvY2tldC5yZWNlaXZlKCdjbGllbnQ6c3RhcnQnLCAodXVpZCkgPT4ge1xuICAgICAgICAgICAgdGhpcy51dWlkID0gdXVpZDtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB0aGlzLnNvY2tldC5yZWNlaXZlKCdjbGllbnQ6ZXJyb3InLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKGVyci50eXBlKSB7XG4gICAgICAgICAgICAgIGNhc2UgJ3NlcnZpY2VzJzpcbiAgICAgICAgICAgICAgICAvLyBjYW4gb25seSBhcHBlbmQgaWYgZW52ICE9PSAncHJvZHVjdGlvbidcbiAgICAgICAgICAgICAgICBjb25zdCBtc2cgPSBgXCIke2Vyci5kYXRhLmpvaW4oJywgJyl9XCIgcmVxdWlyZWQgY2xpZW50LXNpZGUgYnV0IG5vdCBzZXJ2ZXItc2lkZWA7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgLy8gY2FzZSAncmVjb25uZWN0JzpcbiAgICAgICAgICAvLyAgIC8vIHNlcnZpY2VNYW5hZ2VyLnN0YXJ0KCk7XG4gICAgICAgICAgLy8gICBicmVhaztcbiAgICAgICAgICAvLyBjYXNlICdkaXNjb25uZWN0JzpcbiAgICAgICAgICAvLyAgIC8vIGNhbiByZWxhdW5jaCBzZXJ2aWNlTWFuYWdlciBvbiByZWNvbm5lY3Rpb25cbiAgICAgICAgICAvLyAgIC8vIHNlcnZpY2VNYW5hZ2VyLnJlc2V0KCk7XG4gICAgICAgICAgLy8gICBicmVhaztcbiAgICAgICAgICAvLyBjYXNlICdjb25uZWN0X2Vycm9yJzpcbiAgICAgICAgICAvLyBjYXNlICdyZWNvbm5lY3RfYXR0ZW1wdCc6XG4gICAgICAgICAgLy8gY2FzZSAncmVjb25uZWN0aW5nJzpcbiAgICAgICAgICAvLyBjYXNlICdyZWNvbm5lY3RfZXJyb3InOlxuICAgICAgICAgIC8vIGNhc2UgJ3JlY29ubmVjdF9mYWlsZWQnOlxuICAgICAgICAgIC8vICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGllbnQ7XG4iXX0=