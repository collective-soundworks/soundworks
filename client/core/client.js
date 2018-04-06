'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsaWVudC5qcyJdLCJuYW1lcyI6WyJjbGllbnQiLCJ1dWlkIiwidHlwZSIsImNvbmZpZyIsInVybFBhcmFtcyIsInBsYXRmb3JtIiwib3MiLCJpc01vYmlsZSIsImF1ZGlvRmlsZUV4dCIsImludGVyYWN0aW9uIiwiY29tcGF0aWJsZSIsImluZGV4IiwibGFiZWwiLCJjb29yZGluYXRlcyIsImdlb3Bvc2l0aW9uIiwic29ja2V0IiwiaW5pdCIsImNsaWVudFR5cGUiLCJfcGFyc2VVcmxQYXJhbXMiLCJ3ZWJzb2NrZXRzIiwidXJsIiwidHJhbnNwb3J0cyIsInBhdGgiLCJlbCIsImFwcENvbnRhaW5lciIsIiRjb250YWluZXIiLCJFbGVtZW50IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwic2V0QXBwQ29udGFpbmVyIiwicmVzb2x2ZSIsInNldFNlcnZpY2VJbnN0YW5jaWF0aW9uSG9vayIsImZ1bmMiLCJzdGFydCIsInJlcXVpcmVkIiwiX2luaXRTb2NrZXQiLCJyZXF1aXJlIiwiaWQiLCJvcHRpb25zIiwicGF0aFBhcmFtcyIsImhhc2hQYXJhbXMiLCJwYXRobmFtZSIsIndpbmRvdyIsImxvY2F0aW9uIiwicmVwbGFjZSIsIlJlZ0V4cCIsImxlbmd0aCIsInNwbGl0IiwiaGFzaCIsImZvckVhY2giLCJwYXJhbSIsInB1c2giLCJjYWxsYmFjayIsImFkZFN0YXRlTGlzdGVuZXIiLCJldmVudE5hbWUiLCJwYXlsb2FkIiwiZW52IiwicmVxdWlyZWRTZXJ2aWNlcyIsImdldFJlcXVpcmVkU2VydmljZXMiLCJzZW5kIiwicmVjZWl2ZSIsImVyciIsIm1zZyIsImRhdGEiLCJqb2luIiwiRXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxJQUFNQSxTQUFTO0FBQ2I7Ozs7O0FBS0FDLFFBQU0sSUFOTzs7QUFRYjs7Ozs7Ozs7QUFRQUMs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QUFLQSxpQkFBS3JDLE1BQUwsQ0FBWTZDLE9BQVosQ0FBb0IsY0FBcEIsRUFBb0MsVUFBQ0MsR0FBRCxFQUFTO0FBQzNDLG9CQUFRQSxJQUFJM0QsSUFBWjtBQUNFLG1CQUFLLFVBQUw7QUFDRTtBQUNBLG9CQUFNNEQsWUFBVUQsSUFBSUUsSUFBSixDQUFTQyxJQUFULENBQWMsSUFBZCxDQUFWLCtDQUFOO0FBQ0Esc0JBQU0sSUFBSUMsS0FBSixDQUFVSCxHQUFWLENBQU47QUFDQTtBQUxKO0FBT0QsV0FSRDtBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF2Q0o7QUF5Q0QsS0ExQ0Q7QUEyQ0Q7QUE5UlksQ0FBZjs7a0JBaVNlOUQsTSIsImZpbGUiOiJjbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgc29ja2V0IGZyb20gJy4vc29ja2V0JztcbmltcG9ydCB2aWV3TWFuYWdlciBmcm9tICcuL3ZpZXdNYW5hZ2VyJztcbmltcG9ydCB2aWV3cG9ydCBmcm9tICcuLi92aWV3cy92aWV3cG9ydCc7XG5cbi8qKlxuICogQ2xpZW50IHNpZGUgZW50cnkgcG9pbnQgZm9yIGEgYHNvdW5kd29ya3NgIGFwcGxpY2F0aW9uLlxuICpcbiAqIFRoaXMgb2JqZWN0IGhvc3RzIGdlbmVyYWwgaW5mb3JtYXRpb25zIGFib3V0IHRoZSB1c2VyLCBhcyB3ZWxsIGFzIG1ldGhvZHNcbiAqIHRvIGluaXRpYWxpemUgYW5kIHN0YXJ0IHRoZSBhcHBsaWNhdGlvbi5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAbmFtZXNwYWNlXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIHNvdW5kd29ya3MgZnJvbSAnc291bmR3b3Jrcy9jbGllbnQnO1xuICogaW1wb3J0IE15RXhwZXJpZW5jZSBmcm9tICcuL015RXhwZXJpZW5jZSc7XG4gKlxuICogc291bmR3b3Jrcy5jbGllbnQuaW5pdCgncGxheWVyJyk7XG4gKiBjb25zdCBteUV4cGVyaWVuY2UgPSBuZXcgTXlFeHBlcmllbmNlKCk7XG4gKiBzb3VuZHdvcmtzLmNsaWVudC5zdGFydCgpO1xuICovXG5jb25zdCBjbGllbnQgPSB7XG4gIC8qKlxuICAgKiBVbmlxdWUgaWQgb2YgdGhlIGNsaWVudCwgZ2VuZXJhdGVkIGFuZCByZXRyaWV2ZWQgYnkgdGhlIHNlcnZlci5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHV1aWQ6IG51bGwsXG5cbiAgLyoqXG4gICAqIFRoZSB0eXBlIG9mIHRoZSBjbGllbnQsIHRoaXMgY2FuIGdlbmVyYWxseSBiZSBjb25zaWRlcmVkIGFzIHRoZSByb2xlIG9mIHRoZVxuICAgKiBjbGllbnQgaW4gdGhlIGFwcGxpY2F0aW9uLiBUaGlzIHZhbHVlIGlzIGRlZmluZWQgaW4gdGhlXG4gICAqIFtgY2xpZW50LmluaXRgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuc2VydmVyfnNlcnZlckNvbmZpZ30gb2JqZWN0XG4gICAqIGFuZCBkZWZhdWx0cyB0byBgJ3BsYXllcidgLlxuICAgKlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgdHlwZTogbnVsbCxcblxuICAvKipcbiAgICogQ29uZmlndXJhdGlvbiBpbmZvcm1hdGlvbnMgZnJvbSB0aGUgc2VydmVyIGNvbmZpZ3VyYXRpb24gaWYgYW55LlxuICAgKlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuY2xpZW50fmluaXR9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5TaGFyZWRDb25maWd9XG4gICAqL1xuICBjb25maWc6IHt9LFxuXG4gIC8qKlxuICAgKiBBcnJheSBvZiBvcHRpb25uYWwgcGFyYW1ldGVycyBwYXNzZWQgdGhyb3VnaCB0aGUgdXJsXG4gICAqXG4gICAqIEB0eXBlIHtBcnJheX1cbiAgICovXG4gIHVybFBhcmFtczogbnVsbCxcblxuICAvKipcbiAgICogSW5mb3JtYXRpb24gYWJvdXQgdGhlIGNsaWVudCBwbGF0Zm9ybS4gVGhlIHByb3BlcnRpZXMgYXJlIHNldCBieSB0aGVcbiAgICogW2BwbGF0Zm9ybWBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGF0Zm9ybX0gc2VydmljZS5cbiAgICpcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtTdHJpbmd9IG9zIC0gT3BlcmF0aW5nIHN5c3RlbS5cbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBpc01vYmlsZSAtIEluZGljYXRlcyB3aGV0aGVyIHRoZSBjbGllbnQgaXMgcnVubmluZyBvbiBhXG4gICAqICBtb2JpbGUgcGxhdGZvcm0gb3Igbm90LlxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gYXVkaW9GaWxlRXh0IC0gQXVkaW8gZmlsZSBleHRlbnNpb24gdG8gdXNlLCBkZXBlbmRpbmcgb25cbiAgICogIHRoZSBwbGF0Zm9ybS5cbiAgICogQHByb3BlcnR5IHtTdHJpbmd9IGludGVyYWN0aW9uIC0gVHlwZSBvZiBpbnRlcmFjdGlvbiBhbGxvd2VkIGJ5IHRoZVxuICAgKiAgdmlld3BvcnQsIGB0b3VjaGAgb3IgYG1vdXNlYFxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhdGZvcm19XG4gICAqL1xuICBwbGF0Zm9ybToge1xuICAgIG9zOiBudWxsLFxuICAgIGlzTW9iaWxlOiBudWxsLFxuICAgIGF1ZGlvRmlsZUV4dDogJycsXG4gICAgaW50ZXJhY3Rpb246IG51bGwsXG4gIH0sXG5cbiAgLyoqXG4gICAqIERlZmluZXMgd2hldGhlciB0aGUgdXNlcidzIGRldmljZSBpcyBjb21wYXRpYmxlIHdpdGggdGhlIGFwcGxpY2F0aW9uXG4gICAqIHJlcXVpcmVtZW50cy5cbiAgICpcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGF0Zm9ybX1cbiAgICovXG4gIGNvbXBhdGlibGU6IG51bGwsXG5cbiAgLyoqXG4gICAqIEluZGV4IChpZiBhbnkpIGdpdmVuIGJ5IGEgW2BwbGFjZXJgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhY2VyfVxuICAgKiBvciBbYGNoZWNraW5gXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQ2hlY2tpbn0gc2VydmljZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNoZWNraW59XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGFjZXJ9XG4gICAqL1xuICBpbmRleDogbnVsbCxcblxuICAvKipcbiAgICogVGlja2V0IGxhYmVsIChpZiBhbnkpIGdpdmVuIGJ5IGEgW2BwbGFjZXJgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhY2VyfVxuICAgKiBvciBbYGNoZWNraW5gXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQ2hlY2tpbn0gc2VydmljZS5cbiAgICpcbiAgICogQHR5cGUge1N0cmluZ31cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNoZWNraW59XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGFjZXJ9XG4gICAqL1xuICBsYWJlbDogbnVsbCxcblxuICAvKipcbiAgICogQ2xpZW50IGNvb3JkaW5hdGVzIChpZiBhbnkpIGdpdmVuIGJ5IGFcbiAgICogW2Bsb2NhdG9yYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkxvY2F0b3J9LFxuICAgKiBbYHBsYWNlcmBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGFjZXJ9IG9yXG4gICAqIFtgY2hlY2tpbmBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DaGVja2lufSBzZXJ2aWNlLlxuICAgKiAoRm9ybWF0OiBgW3g6TnVtYmVyLCB5Ok51bWJlcl1gLilcbiAgICpcbiAgICogQHR5cGUge0FycmF5PE51bWJlcj59XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DaGVja2lufVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuTG9jYXRvcn1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYWNlcn1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50Lkdlb2xvY2F0aW9ufVxuICAgKi9cbiAgY29vcmRpbmF0ZXM6IG51bGwsXG5cbiAgLyoqXG4gICAqIEZ1bGwgYGdlb3Bvc2l0aW9uYCBvYmplY3QgYXMgcmV0dXJuZWQgYnkgYG5hdmlnYXRvci5nZW9sb2NhdGlvbmAsIHdoZW5cbiAgICogdXNpbmcgdGhlIGBnZW9sb2NhdGlvbmAgc2VydmljZS5cbiAgICpcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50Lkdlb2xvY2F0aW9ufVxuICAgKi9cbiAgZ2VvcG9zaXRpb246IG51bGwsXG5cbiAgLyoqXG4gICAqIFNvY2tldCBvYmplY3QgdGhhdCBoYW5kbGUgY29tbXVuaWNhdGlvbnMgd2l0aCB0aGUgc2VydmVyLCBpZiBhbnkuXG4gICAqIFRoaXMgb2JqZWN0IGlzIGF1dG9tYXRpY2FsbHkgY3JlYXRlZCBpZiB0aGUgZXhwZXJpZW5jZSByZXF1aXJlcyBhbnkgc2VydmljZVxuICAgKiBoYXZpbmcgYSBzZXJ2ZXItc2lkZSBjb3VudGVycGFydC5cbiAgICpcbiAgICogQHR5cGUge21vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5zb2NrZXR9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzb2NrZXQ6IHNvY2tldCxcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0aGUgYXBwbGljYXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbY2xpZW50VHlwZT0ncGxheWVyJ10gLSBUaGUgdHlwZSBvZiB0aGUgY2xpZW50LCBkZWZpbmVzIHRoZVxuICAgKiAgc29ja2V0IGNvbm5lY3Rpb24gbmFtZXNwYWNlLiBTaG91bGQgbWF0Y2ggYSBjbGllbnQgdHlwZSBkZWZpbmVkIHNlcnZlciBzaWRlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW2NvbmZpZz17fV1cbiAgICogQHBhcmFtIHtPYmplY3R9IFtjb25maWcuYXBwQ29udGFpbmVyPScjY29udGFpbmVyJ10gLSBBIGNzcyBzZWxlY3RvclxuICAgKiAgbWF0Y2hpbmcgYSBET00gZWxlbWVudCB3aGVyZSB0aGUgdmlld3Mgc2hvdWxkIGJlIGluc2VydGVkLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW2NvbmZpZy53ZWJzb2NrZXRzLnVybD0nJ10gLSBUaGUgdXJsIHdoZXJlIHRoZSBzb2NrZXQgc2hvdWxkXG4gICAqICBjb25uZWN0IF8odW5zdGFibGUpXy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtjb25maWcud2Vic29ja2V0cy50cmFuc3BvcnRzPVsnd2Vic29ja2V0J11dIC0gVGhlIHRyYW5zcG9ydFxuICAgKiAgdXNlZCB0byBjcmVhdGUgdGhlIHVybCAob3ZlcnJpZGVzIGRlZmF1bHQgc29ja2V0LmlvIG1lY2FuaXNtKSBfKHVuc3RhYmxlKV8uXG4gICAqL1xuICBpbml0KGNsaWVudFR5cGUgPSAncGxheWVyJywgY29uZmlnID0ge30pIHtcbiAgICB0aGlzLnR5cGUgPSBjbGllbnRUeXBlO1xuXG4gICAgdGhpcy5fcGFyc2VVcmxQYXJhbXMoKTtcbiAgICAvLyBpZiBzb2NrZXQgY29uZmlnIGdpdmVuLCBtaXggaXQgd2l0aCBkZWZhdWx0c1xuICAgIGNvbnN0IHdlYnNvY2tldHMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIHVybDogJycsXG4gICAgICB0cmFuc3BvcnRzOiBbJ3dlYnNvY2tldCddLFxuICAgICAgcGF0aDogJycsXG4gICAgfSwgY29uZmlnLndlYnNvY2tldHMpO1xuXG4gICAgLy8gbWl4IGFsbCBvdGhlciBjb25maWcgYW5kIG92ZXJyaWRlIHdpdGggZGVmaW5lZCBzb2NrZXQgY29uZmlnXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLmNvbmZpZywgY29uZmlnLCB7IHdlYnNvY2tldHMgfSk7XG5cbiAgICBzZXJ2aWNlTWFuYWdlci5pbml0KCk7XG4gICAgdmlld3BvcnQuaW5pdCgpO1xuXG4gICAgY29uc3QgZWwgPSBjb25maWcuYXBwQ29udGFpbmVyO1xuICAgIGNvbnN0ICRjb250YWluZXIgPSBlbCBpbnN0YW5jZW9mIEVsZW1lbnQgPyBlbCA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWwpO1xuICAgIHZpZXdNYW5hZ2VyLnNldEFwcENvbnRhaW5lcigkY29udGFpbmVyKTtcblxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgfSxcblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSBmdW5jdGlvbiB0byBiZSBleGVjdXRlZCB3aGVuIGEgc2VydmljZSBpcyBpbnN0YW5jaWF0ZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7c2VydmljZU1hbmFnZXJ+c2VydmljZUluc3RhbmNpYXRpb25Ib29rfSBmdW5jIC0gRnVuY3Rpb24gdG9cbiAgICogIHJlZ2lzdGVyIGhhcyBhIGhvb2sgdG8gYmUgZXhlY3V0ZSB3aGVuIGEgc2VydmljZSBpcyBjcmVhdGVkLlxuICAgKi9cbiAgLyoqXG4gICAqIEBjYWxsYmFjayBzZXJ2aWNlTWFuYWdlcn5zZXJ2aWNlSW5zdGFuY2lhdGlvbkhvb2tcbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gaWQgb2YgdGhlIGluc3RhbmNpYXRlZCBzZXJ2aWNlLlxuICAgKiBAcGFyYW0ge1NlcnZpY2V9IGluc3RhbmNlIC0gaW5zdGFuY2Ugb2YgdGhlIHNlcnZpY2UuXG4gICAqL1xuICBzZXRTZXJ2aWNlSW5zdGFuY2lhdGlvbkhvb2soZnVuYykge1xuICAgIHNlcnZpY2VNYW5hZ2VyLnNldFNlcnZpY2VJbnN0YW5jaWF0aW9uSG9vayhmdW5jKTtcbiAgfSxcblxuICAvKipcbiAgICogU3RhcnQgdGhlIGFwcGxpY2F0aW9uLlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgaWYgKHNvY2tldC5yZXF1aXJlZClcbiAgICAgIHRoaXMuX2luaXRTb2NrZXQoKCkgPT4gc2VydmljZU1hbmFnZXIuc3RhcnQoKSk7XG4gICAgZWxzZVxuICAgICAgc2VydmljZU1hbmFnZXIuc3RhcnQoKTtcbiAgfSxcblxuICAvKipcbiAgICogUmV0dXJucyBhIHNlcnZpY2UgY29uZmlndXJlZCB3aXRoIHRoZSBnaXZlbiBvcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBJZGVudGlmaWVyIG9mIHRoZSBzZXJ2aWNlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE9wdGlvbnMgdG8gY29uZmlndXJlIHRoZSBzZXJ2aWNlLlxuICAgKi9cbiAgcmVxdWlyZShpZCwgb3B0aW9ucykge1xuICAgIHJldHVybiBzZXJ2aWNlTWFuYWdlci5yZXF1aXJlKGlkLCBvcHRpb25zKTtcbiAgfSxcblxuICAvKipcbiAgICogUmV0cmlldmUgYW4gYXJyYXkgb2Ygb3B0aW9ubmFsIHBhcmFtZXRlcnMgZnJvbSB0aGUgdXJsIGV4Y2x1ZGluZyB0aGUgY2xpZW50IHR5cGVcbiAgICogYW5kIHN0b3JlIGl0IGluIGB0aGlzLnVybFBhcmFtc2AuXG4gICAqIFBhcmFtZXRlcnMgY2FuIGJlIGRlZmluZWQgaW4gdHdvIHdheXMgOlxuICAgKiAtIGFzIGEgcmVndWxhciByb3V0ZSAoZXg6IGAvcGxheWVyL3BhcmFtMS9wYXJhbTJgKVxuICAgKiAtIGFzIGEgaGFzaCAoZXg6IGAvcGxheWVyI3BhcmFtMS1wYXJhbTJgKVxuICAgKiBUaGUgcGFyYW1ldGVycyBhcmUgc2VuZCBhbG9uZyB3aXRoIHRoZSBzb2NrZXQgY29ubmVjdGlvblxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuc29ja2V0fVxuICAgKiBAcHJpdmF0ZVxuICAgKiBAdG9kbyAtIFdoZW4gaGFuZHNoYWtlIGltcGxlbWVudGVkLCBkZWZpbmUgaWYgdGhlc2UgaW5mb3JtYXRpb25zIHNob3VsZCBiZSBwYXJ0IG9mIGl0XG4gICAqL1xuICBfcGFyc2VVcmxQYXJhbXMoKSB7XG4gICAgbGV0IHBhdGhQYXJhbXMgPSBudWxsO1xuICAgIGxldCBoYXNoUGFyYW1zID0gbnVsbDtcbiAgICAvLyBoYW5kbGUgcGF0aCBuYW1lIGZpcnN0XG4gICAgbGV0IHBhdGhuYW1lID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xuICAgIC8vIHNhbml0aXplXG4gICAgcGF0aG5hbWUgPSBwYXRobmFtZVxuICAgICAgLnJlcGxhY2UoL15cXC8vLCAnJykgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbGVhZGluZyBzbGFzaFxuICAgICAgLnJlcGxhY2UobmV3IFJlZ0V4cCgnXicgKyB0aGlzLnR5cGUgKyAnLz8nKSwgJycpICAvLyByZW1vdmUgY2xpZW50VHlwZVxuICAgICAgLnJlcGxhY2UoL1xcLyQvLCAnJyk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdHJhaWxpbmcgc2xhc2hcblxuICAgIGlmIChwYXRobmFtZS5sZW5ndGggPiAwKVxuICAgICAgcGF0aFBhcmFtcyA9IHBhdGhuYW1lLnNwbGl0KCcvJyk7XG5cbiAgICAvLyBoYW5kbGUgaGFzaFxuICAgIGxldCBoYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2g7XG4gICAgaGFzaCA9IGhhc2gucmVwbGFjZSgvXiMvLCAnJyk7XG5cbiAgICBpZiAoaGFzaC5sZW5ndGggPiAwKVxuICAgICAgaGFzaFBhcmFtcyA9IGhhc2guc3BsaXQoJy0nKTtcblxuICAgIGlmIChwYXRoUGFyYW1zIHx8wqBoYXNoUGFyYW1zKSB7XG4gICAgICB0aGlzLnVybFBhcmFtcyA9IFtdO1xuXG4gICAgICBpZiAocGF0aFBhcmFtcylcbiAgICAgICAgcGF0aFBhcmFtcy5mb3JFYWNoKChwYXJhbSkgPT4gdGhpcy51cmxQYXJhbXMucHVzaChwYXJhbSkpO1xuXG4gICAgICBpZiAoaGFzaFBhcmFtcylcbiAgICAgICAgaGFzaFBhcmFtcy5mb3JFYWNoKChwYXJhbSkgPT4gdGhpcy51cmxQYXJhbXMucHVzaChwYXJhbSkpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBzb2NrZXQgY29ubmVjdGlvbiBhbmQgcGVyZm9ybSBoYW5kc2hha2Ugd2l0aCB0aGUgc2VydmVyLlxuICAgKiBAdG9kbyAtIHJlZmFjdG9yIGhhbmRzaGFrZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9pbml0U29ja2V0KGNhbGxiYWNrKSB7XG4gICAgc29ja2V0LmluaXQodGhpcy50eXBlLCB0aGlzLmNvbmZpZy53ZWJzb2NrZXRzKTtcblxuICAgIC8vIHNlZTogaHR0cDovL3NvY2tldC5pby9kb2NzL2NsaWVudC1hcGkvI3NvY2tldFxuICAgIHRoaXMuc29ja2V0LmFkZFN0YXRlTGlzdGVuZXIoKGV2ZW50TmFtZSkgPT4ge1xuICAgICAgc3dpdGNoIChldmVudE5hbWUpIHtcbiAgICAgICAgY2FzZSAnY29ubmVjdCc6XG4gICAgICAgICAgY29uc3QgcGF5bG9hZCA9IHsgdXJsUGFyYW1zOiB0aGlzLnVybFBhcmFtcyB9O1xuXG4gICAgICAgICAgaWYgKHRoaXMuY29uZmlnLmVudiAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKHBheWxvYWQsIHtcbiAgICAgICAgICAgICAgcmVxdWlyZWRTZXJ2aWNlczogc2VydmljZU1hbmFnZXIuZ2V0UmVxdWlyZWRTZXJ2aWNlcygpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLnNvY2tldC5zZW5kKCdoYW5kc2hha2UnLCBwYXlsb2FkKTtcbiAgICAgICAgICAvLyB3YWl0IGZvciBoYW5kc2hha2UgcmVzcG9uc2UgdG8gbWFyayBjbGllbnQgYXMgYHJlYWR5YFxuICAgICAgICAgIHRoaXMuc29ja2V0LnJlY2VpdmUoJ2NsaWVudDpzdGFydCcsICh1dWlkKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnV1aWQgPSB1dWlkO1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHRoaXMuc29ja2V0LnJlY2VpdmUoJ2NsaWVudDplcnJvcicsIChlcnIpID0+IHtcbiAgICAgICAgICAgIHN3aXRjaCAoZXJyLnR5cGUpIHtcbiAgICAgICAgICAgICAgY2FzZSAnc2VydmljZXMnOlxuICAgICAgICAgICAgICAgIC8vIGNhbiBvbmx5IGFwcGVuZCBpZiBlbnYgIT09ICdwcm9kdWN0aW9uJ1xuICAgICAgICAgICAgICAgIGNvbnN0IG1zZyA9IGBcIiR7ZXJyLmRhdGEuam9pbignLCAnKX1cIiByZXF1aXJlZCBjbGllbnQtc2lkZSBidXQgbm90IHNlcnZlci1zaWRlYDtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgICAvLyBjYXNlICdyZWNvbm5lY3QnOlxuICAgICAgICAgIC8vICAgLy8gc2VydmljZU1hbmFnZXIuc3RhcnQoKTtcbiAgICAgICAgICAvLyAgIGJyZWFrO1xuICAgICAgICAgIC8vIGNhc2UgJ2Rpc2Nvbm5lY3QnOlxuICAgICAgICAgIC8vICAgLy8gY2FuIHJlbGF1bmNoIHNlcnZpY2VNYW5hZ2VyIG9uIHJlY29ubmVjdGlvblxuICAgICAgICAgIC8vICAgLy8gc2VydmljZU1hbmFnZXIucmVzZXQoKTtcbiAgICAgICAgICAvLyAgIGJyZWFrO1xuICAgICAgICAgIC8vIGNhc2UgJ2Nvbm5lY3RfZXJyb3InOlxuICAgICAgICAgIC8vIGNhc2UgJ3JlY29ubmVjdF9hdHRlbXB0JzpcbiAgICAgICAgICAvLyBjYXNlICdyZWNvbm5lY3RpbmcnOlxuICAgICAgICAgIC8vIGNhc2UgJ3JlY29ubmVjdF9lcnJvcic6XG4gICAgICAgICAgLy8gY2FzZSAncmVjb25uZWN0X2ZhaWxlZCc6XG4gICAgICAgICAgLy8gICBicmVhaztcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsaWVudDtcbiJdfQ==