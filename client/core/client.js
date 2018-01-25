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

var _socket = require('./socket');

var _socket2 = _interopRequireDefault(_socket);

var _viewManager = require('./viewManager');

var _viewManager2 = _interopRequireDefault(_viewManager);

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

exports.default = client;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsaWVudC5qcyJdLCJuYW1lcyI6WyJjbGllbnQiLCJ1dWlkIiwidHlwZSIsImNvbmZpZyIsInVybFBhcmFtcyIsInBsYXRmb3JtIiwib3MiLCJpc01vYmlsZSIsImF1ZGlvRmlsZUV4dCIsImludGVyYWN0aW9uIiwiY29tcGF0aWJsZSIsImluZGV4IiwibGFiZWwiLCJjb29yZGluYXRlcyIsImdlb3Bvc2l0aW9uIiwic29ja2V0IiwiaW5pdCIsImNsaWVudFR5cGUiLCJfcGFyc2VVcmxQYXJhbXMiLCJ3ZWJzb2NrZXRzIiwidXJsIiwidHJhbnNwb3J0cyIsInBhdGgiLCJlbCIsImFwcENvbnRhaW5lciIsIiRjb250YWluZXIiLCJFbGVtZW50IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwic2V0QXBwQ29udGFpbmVyIiwicmVzb2x2ZSIsInNldFNlcnZpY2VJbnN0YW5jaWF0aW9uSG9vayIsImZ1bmMiLCJzdGFydCIsInJlcXVpcmVkIiwiX2luaXRTb2NrZXQiLCJyZXF1aXJlIiwiaWQiLCJvcHRpb25zIiwicGF0aFBhcmFtcyIsImhhc2hQYXJhbXMiLCJwYXRobmFtZSIsIndpbmRvdyIsImxvY2F0aW9uIiwicmVwbGFjZSIsIlJlZ0V4cCIsImxlbmd0aCIsInNwbGl0IiwiaGFzaCIsImZvckVhY2giLCJwYXJhbSIsInB1c2giLCJjYWxsYmFjayIsImFkZFN0YXRlTGlzdGVuZXIiLCJldmVudE5hbWUiLCJwYXlsb2FkIiwiZW52IiwicmVxdWlyZWRTZXJ2aWNlcyIsImdldFJlcXVpcmVkU2VydmljZXMiLCJzZW5kIiwicmVjZWl2ZSIsImVyciIsIm1zZyIsImRhdGEiLCJqb2luIiwiRXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLElBQU1BLFNBQVM7QUFDYjs7Ozs7QUFLQUMsUUFBTSxJQU5POztBQVFiOzs7Ozs7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RCxXQUhEOztBQUtBLGlCQUFLckMsTUFBTCxDQUFZNkMsT0FBWixDQUFvQixjQUFwQixFQUFvQyxVQUFDQyxHQUFELEVBQVM7QUFDM0Msb0JBQVFBLElBQUkzRCxJQUFaO0FBQ0UsbUJBQUssVUFBTDtBQUNFO0FBQ0Esb0JBQU00RCxZQUFVRCxJQUFJRSxJQUFKLENBQVNDLElBQVQsQ0FBYyxJQUFkLENBQVYsK0NBQU47QUFDQSxzQkFBTSxJQUFJQyxLQUFKLENBQVVILEdBQVYsQ0FBTjtBQUNBO0FBTEo7QUFPRCxXQVJEO0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXZDSjtBQXlDRCxLQTFDRDtBQTJDRDtBQTlSWSxDQUFmOztrQkFpU2U5RCxNIiwiZmlsZSI6ImNsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBY3Rpdml0eSBmcm9tICcuL0FjdGl2aXR5JztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCBzb2NrZXQgZnJvbSAnLi9zb2NrZXQnO1xuaW1wb3J0IHZpZXdNYW5hZ2VyIGZyb20gJy4vdmlld01hbmFnZXInO1xuaW1wb3J0IHZpZXdwb3J0IGZyb20gJy4uL3ZpZXdzL3ZpZXdwb3J0JztcblxuLyoqXG4gKiBDbGllbnQgc2lkZSBlbnRyeSBwb2ludCBmb3IgYSBgc291bmR3b3Jrc2AgYXBwbGljYXRpb24uXG4gKlxuICogVGhpcyBvYmplY3QgaG9zdHMgZ2VuZXJhbCBpbmZvcm1hdGlvbnMgYWJvdXQgdGhlIHVzZXIsIGFzIHdlbGwgYXMgbWV0aG9kc1xuICogdG8gaW5pdGlhbGl6ZSBhbmQgc3RhcnQgdGhlIGFwcGxpY2F0aW9uLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBuYW1lc3BhY2VcbiAqXG4gKiBAZXhhbXBsZVxuICogaW1wb3J0ICogYXMgc291bmR3b3JrcyBmcm9tICdzb3VuZHdvcmtzL2NsaWVudCc7XG4gKiBpbXBvcnQgTXlFeHBlcmllbmNlIGZyb20gJy4vTXlFeHBlcmllbmNlJztcbiAqXG4gKiBzb3VuZHdvcmtzLmNsaWVudC5pbml0KCdwbGF5ZXInKTtcbiAqIGNvbnN0IG15RXhwZXJpZW5jZSA9IG5ldyBNeUV4cGVyaWVuY2UoKTtcbiAqIHNvdW5kd29ya3MuY2xpZW50LnN0YXJ0KCk7XG4gKi9cbmNvbnN0IGNsaWVudCA9IHtcbiAgLyoqXG4gICAqIFVuaXF1ZSBpZCBvZiB0aGUgY2xpZW50LCBnZW5lcmF0ZWQgYW5kIHJldHJpZXZlZCBieSB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgdXVpZDogbnVsbCxcblxuICAvKipcbiAgICogVGhlIHR5cGUgb2YgdGhlIGNsaWVudCwgdGhpcyBjYW4gZ2VuZXJhbGx5IGJlIGNvbnNpZGVyZWQgYXMgdGhlIHJvbGUgb2YgdGhlXG4gICAqIGNsaWVudCBpbiB0aGUgYXBwbGljYXRpb24uIFRoaXMgdmFsdWUgaXMgZGVmaW5lZCBpbiB0aGVcbiAgICogW2BjbGllbnQuaW5pdGBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5zZXJ2ZXJ+c2VydmVyQ29uZmlnfSBvYmplY3RcbiAgICogYW5kIGRlZmF1bHRzIHRvIGAncGxheWVyJ2AuXG4gICAqXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICB0eXBlOiBudWxsLFxuXG4gIC8qKlxuICAgKiBDb25maWd1cmF0aW9uIGluZm9ybWF0aW9ucyBmcm9tIHRoZSBzZXJ2ZXIgY29uZmlndXJhdGlvbiBpZiBhbnkuXG4gICAqXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5jbGllbnR+aW5pdH1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlNoYXJlZENvbmZpZ31cbiAgICovXG4gIGNvbmZpZzoge30sXG5cbiAgLyoqXG4gICAqIEFycmF5IG9mIG9wdGlvbm5hbCBwYXJhbWV0ZXJzIHBhc3NlZCB0aHJvdWdoIHRoZSB1cmxcbiAgICpcbiAgICogQHR5cGUge0FycmF5fVxuICAgKi9cbiAgIHVybFBhcmFtczogbnVsbCxcblxuICAvKipcbiAgICogSW5mb3JtYXRpb24gYWJvdXQgdGhlIGNsaWVudCBwbGF0Zm9ybS4gVGhlIHByb3BlcnRpZXMgYXJlIHNldCBieSB0aGVcbiAgICogW2BwbGF0Zm9ybWBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGF0Zm9ybX0gc2VydmljZS5cbiAgICpcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtTdHJpbmd9IG9zIC0gT3BlcmF0aW5nIHN5c3RlbS5cbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBpc01vYmlsZSAtIEluZGljYXRlcyB3aGV0aGVyIHRoZSBjbGllbnQgaXMgcnVubmluZyBvbiBhXG4gICAqICBtb2JpbGUgcGxhdGZvcm0gb3Igbm90LlxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gYXVkaW9GaWxlRXh0IC0gQXVkaW8gZmlsZSBleHRlbnNpb24gdG8gdXNlLCBkZXBlbmRpbmcgb25cbiAgICogIHRoZSBwbGF0Zm9ybS5cbiAgICogQHByb3BlcnR5IHtTdHJpbmd9IGludGVyYWN0aW9uIC0gVHlwZSBvZiBpbnRlcmFjdGlvbiBhbGxvd2VkIGJ5IHRoZVxuICAgKiAgdmlld3BvcnQsIGB0b3VjaGAgb3IgYG1vdXNlYFxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhdGZvcm19XG4gICAqL1xuICBwbGF0Zm9ybToge1xuICAgIG9zOiBudWxsLFxuICAgIGlzTW9iaWxlOiBudWxsLFxuICAgIGF1ZGlvRmlsZUV4dDogJycsXG4gICAgaW50ZXJhY3Rpb246IG51bGwsXG4gIH0sXG5cbiAgLyoqXG4gICAqIERlZmluZXMgd2hldGhlciB0aGUgdXNlcidzIGRldmljZSBpcyBjb21wYXRpYmxlIHdpdGggdGhlIGFwcGxpY2F0aW9uXG4gICAqIHJlcXVpcmVtZW50cy5cbiAgICpcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGF0Zm9ybX1cbiAgICovXG4gIGNvbXBhdGlibGU6IG51bGwsXG5cbiAgLyoqXG4gICAqIEluZGV4IChpZiBhbnkpIGdpdmVuIGJ5IGEgW2BwbGFjZXJgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhY2VyfVxuICAgKiBvciBbYGNoZWNraW5gXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQ2hlY2tpbn0gc2VydmljZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNoZWNraW59XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGFjZXJ9XG4gICAqL1xuICBpbmRleDogbnVsbCxcblxuICAvKipcbiAgICogVGlja2V0IGxhYmVsIChpZiBhbnkpIGdpdmVuIGJ5IGEgW2BwbGFjZXJgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhY2VyfVxuICAgKiBvciBbYGNoZWNraW5gXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQ2hlY2tpbn0gc2VydmljZS5cbiAgICpcbiAgICogQHR5cGUge1N0cmluZ31cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNoZWNraW59XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGFjZXJ9XG4gICAqL1xuICBsYWJlbDogbnVsbCxcblxuICAvKipcbiAgICogQ2xpZW50IGNvb3JkaW5hdGVzIChpZiBhbnkpIGdpdmVuIGJ5IGFcbiAgICogW2Bsb2NhdG9yYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkxvY2F0b3J9LFxuICAgKiBbYHBsYWNlcmBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGFjZXJ9IG9yXG4gICAqIFtgY2hlY2tpbmBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DaGVja2lufSBzZXJ2aWNlLlxuICAgKiAoRm9ybWF0OiBgW3g6TnVtYmVyLCB5Ok51bWJlcl1gLilcbiAgICpcbiAgICogQHR5cGUge0FycmF5PE51bWJlcj59XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DaGVja2lufVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuTG9jYXRvcn1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYWNlcn1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50Lkdlb2xvY2F0aW9ufVxuICAgKi9cbiAgY29vcmRpbmF0ZXM6IG51bGwsXG5cbiAgLyoqXG4gICAqIEZ1bGwgYGdlb3Bvc2l0aW9uYCBvYmplY3QgYXMgcmV0dXJuZWQgYnkgYG5hdmlnYXRvci5nZW9sb2NhdGlvbmAsIHdoZW5cbiAgICogdXNpbmcgdGhlIGBnZW9sb2NhdGlvbmAgc2VydmljZS5cbiAgICpcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50Lkdlb2xvY2F0aW9ufVxuICAgKi9cbiAgZ2VvcG9zaXRpb246IG51bGwsXG5cbiAgLyoqXG4gICAqIFNvY2tldCBvYmplY3QgdGhhdCBoYW5kbGUgY29tbXVuaWNhdGlvbnMgd2l0aCB0aGUgc2VydmVyLCBpZiBhbnkuXG4gICAqIFRoaXMgb2JqZWN0IGlzIGF1dG9tYXRpY2FsbHkgY3JlYXRlZCBpZiB0aGUgZXhwZXJpZW5jZSByZXF1aXJlcyBhbnkgc2VydmljZVxuICAgKiBoYXZpbmcgYSBzZXJ2ZXItc2lkZSBjb3VudGVycGFydC5cbiAgICpcbiAgICogQHR5cGUge21vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5zb2NrZXR9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzb2NrZXQ6IHNvY2tldCxcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0aGUgYXBwbGljYXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbY2xpZW50VHlwZT0ncGxheWVyJ10gLSBUaGUgdHlwZSBvZiB0aGUgY2xpZW50LCBkZWZpbmVzIHRoZVxuICAgKiAgc29ja2V0IGNvbm5lY3Rpb24gbmFtZXNwYWNlLiBTaG91bGQgbWF0Y2ggYSBjbGllbnQgdHlwZSBkZWZpbmVkIHNlcnZlciBzaWRlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW2NvbmZpZz17fV1cbiAgICogQHBhcmFtIHtPYmplY3R9IFtjb25maWcuYXBwQ29udGFpbmVyPScjY29udGFpbmVyJ10gLSBBIGNzcyBzZWxlY3RvclxuICAgKiAgbWF0Y2hpbmcgYSBET00gZWxlbWVudCB3aGVyZSB0aGUgdmlld3Mgc2hvdWxkIGJlIGluc2VydGVkLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW2NvbmZpZy53ZWJzb2NrZXRzLnVybD0nJ10gLSBUaGUgdXJsIHdoZXJlIHRoZSBzb2NrZXQgc2hvdWxkXG4gICAqICBjb25uZWN0IF8odW5zdGFibGUpXy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtjb25maWcud2Vic29ja2V0cy50cmFuc3BvcnRzPVsnd2Vic29ja2V0J11dIC0gVGhlIHRyYW5zcG9ydFxuICAgKiAgdXNlZCB0byBjcmVhdGUgdGhlIHVybCAob3ZlcnJpZGVzIGRlZmF1bHQgc29ja2V0LmlvIG1lY2FuaXNtKSBfKHVuc3RhYmxlKV8uXG4gICAqL1xuICBpbml0KGNsaWVudFR5cGUgPSAncGxheWVyJywgY29uZmlnID0ge30pIHtcbiAgICB0aGlzLnR5cGUgPSBjbGllbnRUeXBlO1xuXG4gICAgdGhpcy5fcGFyc2VVcmxQYXJhbXMoKTtcbiAgICAvLyBpZiBzb2NrZXQgY29uZmlnIGdpdmVuLCBtaXggaXQgd2l0aCBkZWZhdWx0c1xuICAgIGNvbnN0IHdlYnNvY2tldHMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIHVybDogJycsXG4gICAgICB0cmFuc3BvcnRzOiBbJ3dlYnNvY2tldCddLFxuICAgICAgcGF0aDogJycsXG4gICAgfSwgY29uZmlnLndlYnNvY2tldHMpO1xuXG4gICAgLy8gbWl4IGFsbCBvdGhlciBjb25maWcgYW5kIG92ZXJyaWRlIHdpdGggZGVmaW5lZCBzb2NrZXQgY29uZmlnXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLmNvbmZpZywgY29uZmlnLCB7IHdlYnNvY2tldHMgfSk7XG5cbiAgICBzZXJ2aWNlTWFuYWdlci5pbml0KCk7XG4gICAgdmlld3BvcnQuaW5pdCgpO1xuXG4gICAgY29uc3QgZWwgPSBjb25maWcuYXBwQ29udGFpbmVyO1xuICAgIGNvbnN0ICRjb250YWluZXIgPSBlbCBpbnN0YW5jZW9mIEVsZW1lbnQgPyBlbCA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWwpO1xuICAgIHZpZXdNYW5hZ2VyLnNldEFwcENvbnRhaW5lcigkY29udGFpbmVyKTtcblxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfSxcblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSBmdW5jdGlvbiB0byBiZSBleGVjdXRlZCB3aGVuIGEgc2VydmljZSBpcyBpbnN0YW5jaWF0ZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7c2VydmljZU1hbmFnZXJ+c2VydmljZUluc3RhbmNpYXRpb25Ib29rfSBmdW5jIC0gRnVuY3Rpb24gdG9cbiAgICogIHJlZ2lzdGVyIGhhcyBhIGhvb2sgdG8gYmUgZXhlY3V0ZSB3aGVuIGEgc2VydmljZSBpcyBjcmVhdGVkLlxuICAgKi9cbiAgLyoqXG4gICAqIEBjYWxsYmFjayBzZXJ2aWNlTWFuYWdlcn5zZXJ2aWNlSW5zdGFuY2lhdGlvbkhvb2tcbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gaWQgb2YgdGhlIGluc3RhbmNpYXRlZCBzZXJ2aWNlLlxuICAgKiBAcGFyYW0ge1NlcnZpY2V9IGluc3RhbmNlIC0gaW5zdGFuY2Ugb2YgdGhlIHNlcnZpY2UuXG4gICAqL1xuICBzZXRTZXJ2aWNlSW5zdGFuY2lhdGlvbkhvb2soZnVuYykge1xuICAgIHNlcnZpY2VNYW5hZ2VyLnNldFNlcnZpY2VJbnN0YW5jaWF0aW9uSG9vayhmdW5jKTtcbiAgfSxcblxuICAvKipcbiAgICogU3RhcnQgdGhlIGFwcGxpY2F0aW9uLlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgaWYgKHNvY2tldC5yZXF1aXJlZClcbiAgICAgIHRoaXMuX2luaXRTb2NrZXQoKCkgPT4gc2VydmljZU1hbmFnZXIuc3RhcnQoKSk7XG4gICAgZWxzZVxuICAgICAgc2VydmljZU1hbmFnZXIuc3RhcnQoKTtcbiAgfSxcblxuICAvKipcbiAgICogUmV0dXJucyBhIHNlcnZpY2UgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBJZGVudGlmaWVyIG9mIHRoZSBzZXJ2aWNlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE9wdGlvbnMgdG8gY29uZmlndXJlIHRoZSBzZXJ2aWNlLlxuICAgKi9cbiAgcmVxdWlyZShpZCwgb3B0aW9ucykge1xuICAgIHJldHVybiBzZXJ2aWNlTWFuYWdlci5yZXF1aXJlKGlkLCBvcHRpb25zKTtcbiAgfSxcblxuICAvKipcbiAgICogUmV0cmlldmUgYW4gYXJyYXkgb2Ygb3B0aW9ubmFsIHBhcmFtZXRlcnMgZnJvbSB0aGUgdXJsIGV4Y2x1ZGluZyB0aGUgY2xpZW50IHR5cGVcbiAgICogYW5kIHN0b3JlIGl0IGluIGB0aGlzLnVybFBhcmFtc2AuXG4gICAqIFBhcmFtZXRlcnMgY2FuIGJlIGRlZmluZWQgaW4gdHdvIHdheXMgOlxuICAgKiAtIGFzIGEgcmVndWxhciByb3V0ZSAoZXg6IGAvcGxheWVyL3BhcmFtMS9wYXJhbTJgKVxuICAgKiAtIGFzIGEgaGFzaCAoZXg6IGAvcGxheWVyI3BhcmFtMS1wYXJhbTJgKVxuICAgKiBUaGUgcGFyYW1ldGVycyBhcmUgc2VuZCBhbG9uZyB3aXRoIHRoZSBzb2NrZXQgY29ubmVjdGlvblxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuc29ja2V0fVxuICAgKiBAcHJpdmF0ZVxuICAgKiBAdG9kbyAtIFdoZW4gaGFuZHNoYWtlIGltcGxlbWVudGVkLCBkZWZpbmUgaWYgdGhlc2UgaW5mb3JtYXRpb25zIHNob3VsZCBiZSBwYXJ0IG9mIGl0XG4gICAqL1xuICBfcGFyc2VVcmxQYXJhbXMoKSB7XG4gICAgbGV0IHBhdGhQYXJhbXMgPSBudWxsO1xuICAgIGxldCBoYXNoUGFyYW1zID0gbnVsbDtcbiAgICAvLyBoYW5kbGUgcGF0aCBuYW1lIGZpcnN0XG4gICAgbGV0IHBhdGhuYW1lID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xuICAgIC8vIHNhbml0aXplXG4gICAgcGF0aG5hbWUgPSBwYXRobmFtZVxuICAgICAgLnJlcGxhY2UoL15cXC8vLCAnJykgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbGVhZGluZyBzbGFzaFxuICAgICAgLnJlcGxhY2UobmV3IFJlZ0V4cCgnXicgKyB0aGlzLnR5cGUgKyAnLz8nKSwgJycpICAvLyByZW1vdmUgY2xpZW50VHlwZVxuICAgICAgLnJlcGxhY2UoL1xcLyQvLCAnJyk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHJhaWxpbmcgc2xhc2hcblxuICAgIGlmIChwYXRobmFtZS5sZW5ndGggPiAwKVxuICAgICAgcGF0aFBhcmFtcyA9IHBhdGhuYW1lLnNwbGl0KCcvJyk7XG5cbiAgICAvLyBoYW5kbGUgaGFzaFxuICAgIGxldCBoYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2g7XG4gICAgaGFzaCA9IGhhc2gucmVwbGFjZSgvXiMvLCAnJyk7XG5cbiAgICBpZiAoaGFzaC5sZW5ndGggPiAwKVxuICAgICAgaGFzaFBhcmFtcyA9IGhhc2guc3BsaXQoJy0nKTtcblxuICAgIGlmIChwYXRoUGFyYW1zIHx8wqBoYXNoUGFyYW1zKSB7XG4gICAgICB0aGlzLnVybFBhcmFtcyA9IFtdO1xuXG4gICAgICBpZiAocGF0aFBhcmFtcylcbiAgICAgICAgcGF0aFBhcmFtcy5mb3JFYWNoKChwYXJhbSkgPT4gdGhpcy51cmxQYXJhbXMucHVzaChwYXJhbSkpO1xuXG4gICAgICBpZiAoaGFzaFBhcmFtcylcbiAgICAgICAgaGFzaFBhcmFtcy5mb3JFYWNoKChwYXJhbSkgPT4gdGhpcy51cmxQYXJhbXMucHVzaChwYXJhbSkpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBzb2NrZXQgY29ubmVjdGlvbiBhbmQgcGVyZm9ybSBoYW5kc2hha2Ugd2l0aCB0aGUgc2VydmVyLlxuICAgKiBAdG9kbyAtIHJlZmFjdG9yIGhhbmRzaGFrZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9pbml0U29ja2V0KGNhbGxiYWNrKSB7XG4gICAgc29ja2V0LmluaXQodGhpcy50eXBlLCB0aGlzLmNvbmZpZy53ZWJzb2NrZXRzKTtcblxuICAgIC8vIHNlZTogaHR0cDovL3NvY2tldC5pby9kb2NzL2NsaWVudC1hcGkvI3NvY2tldFxuICAgIHRoaXMuc29ja2V0LmFkZFN0YXRlTGlzdGVuZXIoKGV2ZW50TmFtZSkgPT4ge1xuICAgICAgc3dpdGNoIChldmVudE5hbWUpIHtcbiAgICAgICAgY2FzZSAnY29ubmVjdCc6XG4gICAgICAgICAgY29uc3QgcGF5bG9hZCA9IHsgdXJsUGFyYW1zOiB0aGlzLnVybFBhcmFtcyB9O1xuXG4gICAgICAgICAgaWYgKHRoaXMuY29uZmlnLmVudiAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKHBheWxvYWQsIHtcbiAgICAgICAgICAgICAgcmVxdWlyZWRTZXJ2aWNlczogc2VydmljZU1hbmFnZXIuZ2V0UmVxdWlyZWRTZXJ2aWNlcygpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnNvY2tldC5zZW5kKCdoYW5kc2hha2UnLCBwYXlsb2FkKTtcbiAgICAgICAgICAvLyB3YWl0IGZvciBoYW5kc2hha2UgcmVzcG9uc2UgdG8gbWFyayBjbGllbnQgYXMgYHJlYWR5YFxuICAgICAgICAgIHRoaXMuc29ja2V0LnJlY2VpdmUoJ2NsaWVudDpzdGFydCcsICh1dWlkKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnV1aWQgPSB1dWlkO1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHRoaXMuc29ja2V0LnJlY2VpdmUoJ2NsaWVudDplcnJvcicsIChlcnIpID0+IHtcbiAgICAgICAgICAgIHN3aXRjaCAoZXJyLnR5cGUpIHtcbiAgICAgICAgICAgICAgY2FzZSAnc2VydmljZXMnOlxuICAgICAgICAgICAgICAgIC8vIGNhbiBvbmx5IGFwcGVuZCBpZiBlbnYgIT09ICdwcm9kdWN0aW9uJ1xuICAgICAgICAgICAgICAgIGNvbnN0IG1zZyA9IGBcIiR7ZXJyLmRhdGEuam9pbignLCAnKX1cIiByZXF1aXJlZCBjbGllbnQtc2lkZSBidXQgbm90IHNlcnZlci1zaWRlYDtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgICAvLyBjYXNlICdyZWNvbm5lY3QnOlxuICAgICAgICAgIC8vICAgLy8gc2VydmljZU1hbmFnZXIuc3RhcnQoKTtcbiAgICAgICAgICAvLyAgIGJyZWFrO1xuICAgICAgICAgIC8vIGNhc2UgJ2Rpc2Nvbm5lY3QnOlxuICAgICAgICAgIC8vICAgLy8gY2FuIHJlbGF1bmNoIHNlcnZpY2VNYW5hZ2VyIG9uIHJlY29ubmVjdGlvblxuICAgICAgICAgIC8vICAgLy8gc2VydmljZU1hbmFnZXIucmVzZXQoKTtcbiAgICAgICAgICAvLyAgIGJyZWFrO1xuICAgICAgICAgIC8vIGNhc2UgJ2Nvbm5lY3RfZXJyb3InOlxuICAgICAgICAgIC8vIGNhc2UgJ3JlY29ubmVjdF9hdHRlbXB0JzpcbiAgICAgICAgICAvLyBjYXNlICdyZWNvbm5lY3RpbmcnOlxuICAgICAgICAgIC8vIGNhc2UgJ3JlY29ubmVjdF9lcnJvcic6XG4gICAgICAgICAgLy8gY2FzZSAncmVjb25uZWN0X2ZhaWxlZCc6XG4gICAgICAgICAgLy8gICBicmVhaztcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsaWVudDtcbiJdfQ==