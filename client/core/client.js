'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
  _initSocket: function _initSocket() {
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
            _serviceManager2.default.start();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsaWVudC5qcyJdLCJuYW1lcyI6WyJjbGllbnQiLCJ1dWlkIiwidHlwZSIsImNvbmZpZyIsInVybFBhcmFtcyIsInBsYXRmb3JtIiwib3MiLCJpc01vYmlsZSIsImF1ZGlvRmlsZUV4dCIsImludGVyYWN0aW9uIiwiY29tcGF0aWJsZSIsImluZGV4IiwibGFiZWwiLCJjb29yZGluYXRlcyIsImdlb3Bvc2l0aW9uIiwic29ja2V0IiwiaW5pdCIsImNsaWVudFR5cGUiLCJfcGFyc2VVcmxQYXJhbXMiLCJ3ZWJzb2NrZXRzIiwidXJsIiwidHJhbnNwb3J0cyIsInBhdGgiLCJlbCIsImFwcENvbnRhaW5lciIsIiRjb250YWluZXIiLCJFbGVtZW50IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwic2V0QXBwQ29udGFpbmVyIiwic2V0U2VydmljZUluc3RhbmNpYXRpb25Ib29rIiwiZnVuYyIsInN0YXJ0IiwicmVxdWlyZWQiLCJfaW5pdFNvY2tldCIsInJlcXVpcmUiLCJpZCIsIm9wdGlvbnMiLCJwYXRoUGFyYW1zIiwiaGFzaFBhcmFtcyIsInBhdGhuYW1lIiwid2luZG93IiwibG9jYXRpb24iLCJyZXBsYWNlIiwiUmVnRXhwIiwibGVuZ3RoIiwic3BsaXQiLCJoYXNoIiwiZm9yRWFjaCIsInBhcmFtIiwicHVzaCIsImFkZFN0YXRlTGlzdGVuZXIiLCJldmVudE5hbWUiLCJwYXlsb2FkIiwiZW52IiwicmVxdWlyZWRTZXJ2aWNlcyIsImdldFJlcXVpcmVkU2VydmljZXMiLCJzZW5kIiwicmVjZWl2ZSIsImVyciIsIm1zZyIsImRhdGEiLCJqb2luIiwiRXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUdBOzs7Ozs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsSUFBTUEsU0FBUztBQUNiOzs7OztBQUtBQyxRQUFNLElBTk87O0FBUWI7Ozs7Ozs7O0FBUUFDLFFBQU0sSUFoQk87O0FBa0Ji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LG1CQUFLLFVBQUw7QUFDRTtBQUNBLG9CQUFNMEQsWUFBVUQsSUFBSUUsSUFBSixDQUFTQyxJQUFULENBQWMsSUFBZCxDQUFWLCtDQUFOO0FBQ0Esc0JBQU0sSUFBSUMsS0FBSixDQUFVSCxHQUFWLENBQU47QUFDQTtBQUxKO0FBT0QsV0FSRDtBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF2Q0o7QUF5Q0QsS0ExQ0Q7QUEyQ0Q7QUE1UlksQ0FBZjtBQXJCQTtBQUNBO2tCQW1UZTVELE0iLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFjdGl2aXR5IGZyb20gJy4vQWN0aXZpdHknO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4vc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IHZpZXdNYW5hZ2VyIGZyb20gJy4vdmlld01hbmFnZXInO1xuaW1wb3J0IHNvY2tldCBmcm9tICcuL3NvY2tldCc7XG4vLyBpbXBvcnQgZGVmYXVsdFZpZXdDb250ZW50IGZyb20gJy4uL2NvbmZpZy9kZWZhdWx0Vmlld0NvbnRlbnQnO1xuLy8gaW1wb3J0IGRlZmF1bHRWaWV3VGVtcGxhdGVzIGZyb20gJy4uL2NvbmZpZy9kZWZhdWx0Vmlld1RlbXBsYXRlcyc7XG5pbXBvcnQgdmlld3BvcnQgZnJvbSAnLi4vdmlld3Mvdmlld3BvcnQnO1xuXG4vKipcbiAqIENsaWVudCBzaWRlIGVudHJ5IHBvaW50IGZvciBhIGBzb3VuZHdvcmtzYCBhcHBsaWNhdGlvbi5cbiAqXG4gKiBUaGlzIG9iamVjdCBob3N0cyBnZW5lcmFsIGluZm9ybWF0aW9ucyBhYm91dCB0aGUgdXNlciwgYXMgd2VsbCBhcyBtZXRob2RzXG4gKiB0byBpbml0aWFsaXplIGFuZCBzdGFydCB0aGUgYXBwbGljYXRpb24uXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQG5hbWVzcGFjZVxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBzb3VuZHdvcmtzIGZyb20gJ3NvdW5kd29ya3MvY2xpZW50JztcbiAqIGltcG9ydCBNeUV4cGVyaWVuY2UgZnJvbSAnLi9NeUV4cGVyaWVuY2UnO1xuICpcbiAqIHNvdW5kd29ya3MuY2xpZW50LmluaXQoJ3BsYXllcicpO1xuICogY29uc3QgbXlFeHBlcmllbmNlID0gbmV3IE15RXhwZXJpZW5jZSgpO1xuICogc291bmR3b3Jrcy5jbGllbnQuc3RhcnQoKTtcbiAqL1xuY29uc3QgY2xpZW50ID0ge1xuICAvKipcbiAgICogVW5pcXVlIGlkIG9mIHRoZSBjbGllbnQsIGdlbmVyYXRlZCBhbmQgcmV0cmlldmVkIGJ5IHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICB1dWlkOiBudWxsLFxuXG4gIC8qKlxuICAgKiBUaGUgdHlwZSBvZiB0aGUgY2xpZW50LCB0aGlzIGNhbiBnZW5lcmFsbHkgYmUgY29uc2lkZXJlZCBhcyB0aGUgcm9sZSBvZiB0aGVcbiAgICogY2xpZW50IGluIHRoZSBhcHBsaWNhdGlvbi4gVGhpcyB2YWx1ZSBpcyBkZWZpbmVkIGluIHRoZVxuICAgKiBbYGNsaWVudC5pbml0YF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLnNlcnZlcn5zZXJ2ZXJDb25maWd9IG9iamVjdFxuICAgKiBhbmQgZGVmYXVsdHMgdG8gYCdwbGF5ZXInYC5cbiAgICpcbiAgICogQHR5cGUge1N0cmluZ31cbiAgICovXG4gIHR5cGU6IG51bGwsXG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyYXRpb24gaW5mb3JtYXRpb25zIGZyb20gdGhlIHNlcnZlciBjb25maWd1cmF0aW9uIGlmIGFueS5cbiAgICpcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LmNsaWVudH5pbml0fVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuU2hhcmVkQ29uZmlnfVxuICAgKi9cbiAgY29uZmlnOiB7fSxcblxuICAvKipcbiAgICogQXJyYXkgb2Ygb3B0aW9ubmFsIHBhcmFtZXRlcnMgcGFzc2VkIHRocm91Z2ggdGhlIHVybFxuICAgKlxuICAgKiBAdHlwZSB7QXJyYXl9XG4gICAqL1xuICAgdXJsUGFyYW1zOiBudWxsLFxuXG4gIC8qKlxuICAgKiBJbmZvcm1hdGlvbiBhYm91dCB0aGUgY2xpZW50IHBsYXRmb3JtLiBUaGUgcHJvcGVydGllcyBhcmUgc2V0IGJ5IHRoZVxuICAgKiBbYHBsYXRmb3JtYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYXRmb3JtfSBzZXJ2aWNlLlxuICAgKlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gb3MgLSBPcGVyYXRpbmcgc3lzdGVtLlxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGlzTW9iaWxlIC0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGNsaWVudCBpcyBydW5uaW5nIG9uIGFcbiAgICogIG1vYmlsZSBwbGF0Zm9ybSBvciBub3QuXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBhdWRpb0ZpbGVFeHQgLSBBdWRpbyBmaWxlIGV4dGVuc2lvbiB0byB1c2UsIGRlcGVuZGluZyBvblxuICAgKiAgdGhlIHBsYXRmb3JtLlxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gaW50ZXJhY3Rpb24gLSBUeXBlIG9mIGludGVyYWN0aW9uIGFsbG93ZWQgYnkgdGhlXG4gICAqICB2aWV3cG9ydCwgYHRvdWNoYCBvciBgbW91c2VgXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGF0Zm9ybX1cbiAgICovXG4gIHBsYXRmb3JtOiB7XG4gICAgb3M6IG51bGwsXG4gICAgaXNNb2JpbGU6IG51bGwsXG4gICAgYXVkaW9GaWxlRXh0OiAnJyxcbiAgICBpbnRlcmFjdGlvbjogbnVsbCxcbiAgfSxcblxuICAvKipcbiAgICogRGVmaW5lcyB3aGV0aGVyIHRoZSB1c2VyJ3MgZGV2aWNlIGlzIGNvbXBhdGlibGUgd2l0aCB0aGUgYXBwbGljYXRpb25cbiAgICogcmVxdWlyZW1lbnRzLlxuICAgKlxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYXRmb3JtfVxuICAgKi9cbiAgY29tcGF0aWJsZTogbnVsbCxcblxuICAvKipcbiAgICogSW5kZXggKGlmIGFueSkgZ2l2ZW4gYnkgYSBbYHBsYWNlcmBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGFjZXJ9XG4gICAqIG9yIFtgY2hlY2tpbmBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DaGVja2lufSBzZXJ2aWNlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQ2hlY2tpbn1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYWNlcn1cbiAgICovXG4gIGluZGV4OiBudWxsLFxuXG4gIC8qKlxuICAgKiBUaWNrZXQgbGFiZWwgKGlmIGFueSkgZ2l2ZW4gYnkgYSBbYHBsYWNlcmBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGFjZXJ9XG4gICAqIG9yIFtgY2hlY2tpbmBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DaGVja2lufSBzZXJ2aWNlLlxuICAgKlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQ2hlY2tpbn1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYWNlcn1cbiAgICovXG4gIGxhYmVsOiBudWxsLFxuXG4gIC8qKlxuICAgKiBDbGllbnQgY29vcmRpbmF0ZXMgKGlmIGFueSkgZ2l2ZW4gYnkgYVxuICAgKiBbYGxvY2F0b3JgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuTG9jYXRvcn0sXG4gICAqIFtgcGxhY2VyYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYWNlcn0gb3JcbiAgICogW2BjaGVja2luYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNoZWNraW59IHNlcnZpY2UuXG4gICAqIChGb3JtYXQ6IGBbeDpOdW1iZXIsIHk6TnVtYmVyXWAuKVxuICAgKlxuICAgKiBAdHlwZSB7QXJyYXk8TnVtYmVyPn1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNoZWNraW59XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5Mb2NhdG9yfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhY2VyfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuR2VvbG9jYXRpb259XG4gICAqL1xuICBjb29yZGluYXRlczogbnVsbCxcblxuICAvKipcbiAgICogRnVsbCBgZ2VvcG9zaXRpb25gIG9iamVjdCBhcyByZXR1cm5lZCBieSBgbmF2aWdhdG9yLmdlb2xvY2F0aW9uYCwgd2hlblxuICAgKiB1c2luZyB0aGUgYGdlb2xvY2F0aW9uYCBzZXJ2aWNlLlxuICAgKlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuR2VvbG9jYXRpb259XG4gICAqL1xuICBnZW9wb3NpdGlvbjogbnVsbCxcblxuICAvKipcbiAgICogU29ja2V0IG9iamVjdCB0aGF0IGhhbmRsZSBjb21tdW5pY2F0aW9ucyB3aXRoIHRoZSBzZXJ2ZXIsIGlmIGFueS5cbiAgICogVGhpcyBvYmplY3QgaXMgYXV0b21hdGljYWxseSBjcmVhdGVkIGlmIHRoZSBleHBlcmllbmNlIHJlcXVpcmVzIGFueSBzZXJ2aWNlXG4gICAqIGhhdmluZyBhIHNlcnZlci1zaWRlIGNvdW50ZXJwYXJ0LlxuICAgKlxuICAgKiBAdHlwZSB7bW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LnNvY2tldH1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNvY2tldDogc29ja2V0LFxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSBhcHBsaWNhdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IFtjbGllbnRUeXBlPSdwbGF5ZXInXSAtIFRoZSB0eXBlIG9mIHRoZSBjbGllbnQsIGRlZmluZXMgdGhlXG4gICAqICBzb2NrZXQgY29ubmVjdGlvbiBuYW1lc3BhY2UuIFNob3VsZCBtYXRjaCBhIGNsaWVudCB0eXBlIGRlZmluZWQgc2VydmVyIHNpZGUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbY29uZmlnPXt9XVxuICAgKiBAcGFyYW0ge09iamVjdH0gW2NvbmZpZy5hcHBDb250YWluZXI9JyNjb250YWluZXInXSAtIEEgY3NzIHNlbGVjdG9yXG4gICAqICBtYXRjaGluZyBhIERPTSBlbGVtZW50IHdoZXJlIHRoZSB2aWV3cyBzaG91bGQgYmUgaW5zZXJ0ZWQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbY29uZmlnLndlYnNvY2tldHMudXJsPScnXSAtIFRoZSB1cmwgd2hlcmUgdGhlIHNvY2tldCBzaG91bGRcbiAgICogIGNvbm5lY3QgXyh1bnN0YWJsZSlfLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW2NvbmZpZy53ZWJzb2NrZXRzLnRyYW5zcG9ydHM9Wyd3ZWJzb2NrZXQnXV0gLSBUaGUgdHJhbnNwb3J0XG4gICAqICB1c2VkIHRvIGNyZWF0ZSB0aGUgdXJsIChvdmVycmlkZXMgZGVmYXVsdCBzb2NrZXQuaW8gbWVjYW5pc20pIF8odW5zdGFibGUpXy5cbiAgICovXG4gIGluaXQoY2xpZW50VHlwZSA9ICdwbGF5ZXInLCBjb25maWcgPSB7fSkge1xuICAgIHRoaXMudHlwZSA9IGNsaWVudFR5cGU7XG5cbiAgICB0aGlzLl9wYXJzZVVybFBhcmFtcygpO1xuICAgIC8vIGlmIHNvY2tldCBjb25maWcgZ2l2ZW4sIG1peCBpdCB3aXRoIGRlZmF1bHRzXG4gICAgY29uc3Qgd2Vic29ja2V0cyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgdXJsOiAnJyxcbiAgICAgIHRyYW5zcG9ydHM6IFsnd2Vic29ja2V0J10sXG4gICAgICBwYXRoOiAnJyxcbiAgICB9LCBjb25maWcud2Vic29ja2V0cyk7XG5cbiAgICAvLyBtaXggYWxsIG90aGVyIGNvbmZpZyBhbmQgb3ZlcnJpZGUgd2l0aCBkZWZpbmVkIHNvY2tldCBjb25maWdcbiAgICBPYmplY3QuYXNzaWduKHRoaXMuY29uZmlnLCBjb25maWcsIHsgd2Vic29ja2V0cyB9KTtcblxuICAgIHNlcnZpY2VNYW5hZ2VyLmluaXQoKTtcbiAgICB2aWV3cG9ydC5pbml0KCk7XG5cbiAgICBjb25zdCBlbCA9IGNvbmZpZy5hcHBDb250YWluZXI7XG4gICAgY29uc3QgJGNvbnRhaW5lciA9IGVsIGluc3RhbmNlb2YgRWxlbWVudCA/IGVsIDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbCk7XG4gICAgdmlld01hbmFnZXIuc2V0QXBwQ29udGFpbmVyKCRjb250YWluZXIpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIGZ1bmN0aW9uIHRvIGJlIGV4ZWN1dGVkIHdoZW4gYSBzZXJ2aWNlIGlzIGluc3RhbmNpYXRlZC5cbiAgICpcbiAgICogQHBhcmFtIHtzZXJ2aWNlTWFuYWdlcn5zZXJ2aWNlSW5zdGFuY2lhdGlvbkhvb2t9IGZ1bmMgLSBGdW5jdGlvbiB0b1xuICAgKiAgcmVnaXN0ZXIgaGFzIGEgaG9vayB0byBiZSBleGVjdXRlIHdoZW4gYSBzZXJ2aWNlIGlzIGNyZWF0ZWQuXG4gICAqL1xuICAvKipcbiAgICogQGNhbGxiYWNrIHNlcnZpY2VNYW5hZ2VyfnNlcnZpY2VJbnN0YW5jaWF0aW9uSG9va1xuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBpZCBvZiB0aGUgaW5zdGFuY2lhdGVkIHNlcnZpY2UuXG4gICAqIEBwYXJhbSB7U2VydmljZX0gaW5zdGFuY2UgLSBpbnN0YW5jZSBvZiB0aGUgc2VydmljZS5cbiAgICovXG4gIHNldFNlcnZpY2VJbnN0YW5jaWF0aW9uSG9vayhmdW5jKSB7XG4gICAgc2VydmljZU1hbmFnZXIuc2V0U2VydmljZUluc3RhbmNpYXRpb25Ib29rKGZ1bmMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgYXBwbGljYXRpb24uXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBpZiAoc29ja2V0LnJlcXVpcmVkKVxuICAgICAgdGhpcy5faW5pdFNvY2tldCgpO1xuICAgIGVsc2VcbiAgICAgIHNlcnZpY2VNYW5hZ2VyLnN0YXJ0KCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzZXJ2aWNlIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gSWRlbnRpZmllciBvZiB0aGUgc2VydmljZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPcHRpb25zIHRvIGNvbmZpZ3VyZSB0aGUgc2VydmljZS5cbiAgICovXG4gIHJlcXVpcmUoaWQsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gc2VydmljZU1hbmFnZXIucmVxdWlyZShpZCwgb3B0aW9ucyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIGFuIGFycmF5IG9mIG9wdGlvbm5hbCBwYXJhbWV0ZXJzIGZyb20gdGhlIHVybCBleGNsdWRpbmcgdGhlIGNsaWVudCB0eXBlXG4gICAqIGFuZCBzdG9yZSBpdCBpbiBgdGhpcy51cmxQYXJhbXNgLlxuICAgKiBQYXJhbWV0ZXJzIGNhbiBiZSBkZWZpbmVkIGluIHR3byB3YXlzIDpcbiAgICogLSBhcyBhIHJlZ3VsYXIgcm91dGUgKGV4OiBgL3BsYXllci9wYXJhbTEvcGFyYW0yYClcbiAgICogLSBhcyBhIGhhc2ggKGV4OiBgL3BsYXllciNwYXJhbTEtcGFyYW0yYClcbiAgICogVGhlIHBhcmFtZXRlcnMgYXJlIHNlbmQgYWxvbmcgd2l0aCB0aGUgc29ja2V0IGNvbm5lY3Rpb25cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LnNvY2tldH1cbiAgICogQHByaXZhdGVcbiAgICogQHRvZG8gLSBXaGVuIGhhbmRzaGFrZSBpbXBsZW1lbnRlZCwgZGVmaW5lIGlmIHRoZXNlIGluZm9ybWF0aW9ucyBzaG91bGQgYmUgcGFydCBvZiBpdFxuICAgKi9cbiAgX3BhcnNlVXJsUGFyYW1zKCkge1xuICAgIGxldCBwYXRoUGFyYW1zID0gbnVsbDtcbiAgICBsZXQgaGFzaFBhcmFtcyA9IG51bGw7XG4gICAgLy8gaGFuZGxlIHBhdGggbmFtZSBmaXJzdFxuICAgIGxldCBwYXRobmFtZSA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcbiAgICAvLyBzYW5pdGl6ZVxuICAgIHBhdGhuYW1lID0gcGF0aG5hbWVcbiAgICAgIC5yZXBsYWNlKC9eXFwvLywgJycpICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxlYWRpbmcgc2xhc2hcbiAgICAgIC5yZXBsYWNlKG5ldyBSZWdFeHAoJ14nICsgdGhpcy50eXBlICsgJy8/JyksICcnKSAgLy8gcmVtb3ZlIGNsaWVudFR5cGVcbiAgICAgIC5yZXBsYWNlKC9cXC8kLywgJycpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRyYWlsaW5nIHNsYXNoXG5cbiAgICBpZiAocGF0aG5hbWUubGVuZ3RoID4gMClcbiAgICAgIHBhdGhQYXJhbXMgPSBwYXRobmFtZS5zcGxpdCgnLycpO1xuXG4gICAgLy8gaGFuZGxlIGhhc2hcbiAgICBsZXQgaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoO1xuICAgIGhhc2ggPSBoYXNoLnJlcGxhY2UoL14jLywgJycpO1xuXG4gICAgaWYgKGhhc2gubGVuZ3RoID4gMClcbiAgICAgIGhhc2hQYXJhbXMgPSBoYXNoLnNwbGl0KCctJyk7XG5cbiAgICBpZiAocGF0aFBhcmFtcyB8fMKgaGFzaFBhcmFtcykge1xuICAgICAgdGhpcy51cmxQYXJhbXMgPSBbXTtcblxuICAgICAgaWYgKHBhdGhQYXJhbXMpXG4gICAgICAgIHBhdGhQYXJhbXMuZm9yRWFjaCgocGFyYW0pID0+IHRoaXMudXJsUGFyYW1zLnB1c2gocGFyYW0pKTtcblxuICAgICAgaWYgKGhhc2hQYXJhbXMpXG4gICAgICAgIGhhc2hQYXJhbXMuZm9yRWFjaCgocGFyYW0pID0+IHRoaXMudXJsUGFyYW1zLnB1c2gocGFyYW0pKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgc29ja2V0IGNvbm5lY3Rpb24gYW5kIHBlcmZvcm0gaGFuZHNoYWtlIHdpdGggdGhlIHNlcnZlci5cbiAgICogQHRvZG8gLSByZWZhY3RvciBoYW5kc2hha2UuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfaW5pdFNvY2tldCgpIHtcbiAgICBzb2NrZXQuaW5pdCh0aGlzLnR5cGUsIHRoaXMuY29uZmlnLndlYnNvY2tldHMpO1xuXG4gICAgLy8gc2VlOiBodHRwOi8vc29ja2V0LmlvL2RvY3MvY2xpZW50LWFwaS8jc29ja2V0XG4gICAgdGhpcy5zb2NrZXQuYWRkU3RhdGVMaXN0ZW5lcigoZXZlbnROYW1lKSA9PiB7XG4gICAgICBzd2l0Y2ggKGV2ZW50TmFtZSkge1xuICAgICAgICBjYXNlICdjb25uZWN0JzpcbiAgICAgICAgICBjb25zdCBwYXlsb2FkID0geyB1cmxQYXJhbXM6IHRoaXMudXJsUGFyYW1zIH07XG5cbiAgICAgICAgICBpZiAodGhpcy5jb25maWcuZW52ICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ocGF5bG9hZCwge1xuICAgICAgICAgICAgICByZXF1aXJlZFNlcnZpY2VzOiBzZXJ2aWNlTWFuYWdlci5nZXRSZXF1aXJlZFNlcnZpY2VzKClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuc29ja2V0LnNlbmQoJ2hhbmRzaGFrZScsIHBheWxvYWQpO1xuICAgICAgICAgIC8vIHdhaXQgZm9yIGhhbmRzaGFrZSByZXNwb25zZSB0byBtYXJrIGNsaWVudCBhcyBgcmVhZHlgXG4gICAgICAgICAgdGhpcy5zb2NrZXQucmVjZWl2ZSgnY2xpZW50OnN0YXJ0JywgKHV1aWQpID0+IHtcbiAgICAgICAgICAgIHRoaXMudXVpZCA9IHV1aWQ7XG4gICAgICAgICAgICBzZXJ2aWNlTWFuYWdlci5zdGFydCgpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdGhpcy5zb2NrZXQucmVjZWl2ZSgnY2xpZW50OmVycm9yJywgKGVycikgPT4ge1xuICAgICAgICAgICAgc3dpdGNoIChlcnIudHlwZSkge1xuICAgICAgICAgICAgICBjYXNlICdzZXJ2aWNlcyc6XG4gICAgICAgICAgICAgICAgLy8gY2FuIG9ubHkgYXBwZW5kIGlmIGVudiAhPT0gJ3Byb2R1Y3Rpb24nXG4gICAgICAgICAgICAgICAgY29uc3QgbXNnID0gYFwiJHtlcnIuZGF0YS5qb2luKCcsICcpfVwiIHJlcXVpcmVkIGNsaWVudC1zaWRlIGJ1dCBub3Qgc2VydmVyLXNpZGVgO1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIC8vIGNhc2UgJ3JlY29ubmVjdCc6XG4gICAgICAgICAgLy8gICAvLyBzZXJ2aWNlTWFuYWdlci5zdGFydCgpO1xuICAgICAgICAgIC8vICAgYnJlYWs7XG4gICAgICAgICAgLy8gY2FzZSAnZGlzY29ubmVjdCc6XG4gICAgICAgICAgLy8gICAvLyBjYW4gcmVsYXVuY2ggc2VydmljZU1hbmFnZXIgb24gcmVjb25uZWN0aW9uXG4gICAgICAgICAgLy8gICAvLyBzZXJ2aWNlTWFuYWdlci5yZXNldCgpO1xuICAgICAgICAgIC8vICAgYnJlYWs7XG4gICAgICAgICAgLy8gY2FzZSAnY29ubmVjdF9lcnJvcic6XG4gICAgICAgICAgLy8gY2FzZSAncmVjb25uZWN0X2F0dGVtcHQnOlxuICAgICAgICAgIC8vIGNhc2UgJ3JlY29ubmVjdGluZyc6XG4gICAgICAgICAgLy8gY2FzZSAncmVjb25uZWN0X2Vycm9yJzpcbiAgICAgICAgICAvLyBjYXNlICdyZWNvbm5lY3RfZmFpbGVkJzpcbiAgICAgICAgICAvLyAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xpZW50O1xuIl19