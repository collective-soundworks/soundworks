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

    console.log('soundworks', this.urlParams);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsaWVudC5qcyJdLCJuYW1lcyI6WyJjbGllbnQiLCJ1dWlkIiwidHlwZSIsImNvbmZpZyIsInVybFBhcmFtcyIsInBsYXRmb3JtIiwib3MiLCJpc01vYmlsZSIsImF1ZGlvRmlsZUV4dCIsImludGVyYWN0aW9uIiwiY29tcGF0aWJsZSIsImluZGV4IiwibGFiZWwiLCJjb29yZGluYXRlcyIsImdlb3Bvc2l0aW9uIiwic29ja2V0IiwiaW5pdCIsImNsaWVudFR5cGUiLCJfcGFyc2VVcmxQYXJhbXMiLCJ3ZWJzb2NrZXRzIiwidXJsIiwidHJhbnNwb3J0cyIsInBhdGgiLCJlbCIsImFwcENvbnRhaW5lciIsIiRjb250YWluZXIiLCJFbGVtZW50IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwic2V0QXBwQ29udGFpbmVyIiwicmVzb2x2ZSIsInNldFNlcnZpY2VJbnN0YW5jaWF0aW9uSG9vayIsImZ1bmMiLCJzdGFydCIsInJlcXVpcmVkIiwiX2luaXRTb2NrZXQiLCJyZXF1aXJlIiwiaWQiLCJvcHRpb25zIiwicGF0aFBhcmFtcyIsImhhc2hQYXJhbXMiLCJwYXRobmFtZSIsIndpbmRvdyIsImxvY2F0aW9uIiwicmVwbGFjZSIsIlJlZ0V4cCIsImxlbmd0aCIsInNwbGl0IiwiaGFzaCIsImZvckVhY2giLCJwYXJhbSIsInB1c2giLCJjb25zb2xlIiwibG9nIiwiY2FsbGJhY2siLCJhZGRTdGF0ZUxpc3RlbmVyIiwiZXZlbnROYW1lIiwicGF5bG9hZCIsImVudiIsInJlcXVpcmVkU2VydmljZXMiLCJnZXRSZXF1aXJlZFNlcnZpY2VzIiwic2VuZCIsInJlY2VpdmUiLCJlcnIiLCJtc2ciLCJkYXRhIiwiam9pbiIsIkVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBR0E7Ozs7OztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQSxJQUFNQSxTQUFTO0FBQ2I7Ozs7O0FBS0FDLFFBQU0s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QixFQUFvQyxVQUFDN0QsSUFBRCxFQUFVO0FBQzVDLG1CQUFLQSxJQUFMLEdBQVlBLElBQVo7QUFDQXFEO0FBQ0QsV0FIRDs7QUFLQSxpQkFBS3ZDLE1BQUwsQ0FBWStDLE9BQVosQ0FBb0IsY0FBcEIsRUFBb0MsVUFBQ0MsR0FBRCxFQUFTO0FBQzNDLG9CQUFRQSxJQUFJN0QsSUFBWjtBQUNFLG1CQUFLLFVBQUw7QUFDRTtBQUNBLG9CQUFNOEQsWUFBVUQsSUFBSUUsSUFBSixDQUFTQyxJQUFULENBQWMsSUFBZCxDQUFWLCtDQUFOO0FBQ0Esc0JBQU0sSUFBSUMsS0FBSixDQUFVSCxHQUFWLENBQU47QUFDQTtBQUxKO0FBT0QsV0FSRDtBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUF2Q0o7QUF5Q0QsS0ExQ0Q7QUEyQ0Q7QUFoU1ksQ0FBZjtBQXJCQTtBQUNBO2tCQXVUZWhFLE0iLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFjdGl2aXR5IGZyb20gJy4vQWN0aXZpdHknO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4vc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IHZpZXdNYW5hZ2VyIGZyb20gJy4vdmlld01hbmFnZXInO1xuaW1wb3J0IHNvY2tldCBmcm9tICcuL3NvY2tldCc7XG4vLyBpbXBvcnQgZGVmYXVsdFZpZXdDb250ZW50IGZyb20gJy4uL2NvbmZpZy9kZWZhdWx0Vmlld0NvbnRlbnQnO1xuLy8gaW1wb3J0IGRlZmF1bHRWaWV3VGVtcGxhdGVzIGZyb20gJy4uL2NvbmZpZy9kZWZhdWx0Vmlld1RlbXBsYXRlcyc7XG5pbXBvcnQgdmlld3BvcnQgZnJvbSAnLi4vdmlld3Mvdmlld3BvcnQnO1xuXG4vKipcbiAqIENsaWVudCBzaWRlIGVudHJ5IHBvaW50IGZvciBhIGBzb3VuZHdvcmtzYCBhcHBsaWNhdGlvbi5cbiAqXG4gKiBUaGlzIG9iamVjdCBob3N0cyBnZW5lcmFsIGluZm9ybWF0aW9ucyBhYm91dCB0aGUgdXNlciwgYXMgd2VsbCBhcyBtZXRob2RzXG4gKiB0byBpbml0aWFsaXplIGFuZCBzdGFydCB0aGUgYXBwbGljYXRpb24uXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQG5hbWVzcGFjZVxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBzb3VuZHdvcmtzIGZyb20gJ3NvdW5kd29ya3MvY2xpZW50JztcbiAqIGltcG9ydCBNeUV4cGVyaWVuY2UgZnJvbSAnLi9NeUV4cGVyaWVuY2UnO1xuICpcbiAqIHNvdW5kd29ya3MuY2xpZW50LmluaXQoJ3BsYXllcicpO1xuICogY29uc3QgbXlFeHBlcmllbmNlID0gbmV3IE15RXhwZXJpZW5jZSgpO1xuICogc291bmR3b3Jrcy5jbGllbnQuc3RhcnQoKTtcbiAqL1xuY29uc3QgY2xpZW50ID0ge1xuICAvKipcbiAgICogVW5pcXVlIGlkIG9mIHRoZSBjbGllbnQsIGdlbmVyYXRlZCBhbmQgcmV0cmlldmVkIGJ5IHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICB1dWlkOiBudWxsLFxuXG4gIC8qKlxuICAgKiBUaGUgdHlwZSBvZiB0aGUgY2xpZW50LCB0aGlzIGNhbiBnZW5lcmFsbHkgYmUgY29uc2lkZXJlZCBhcyB0aGUgcm9sZSBvZiB0aGVcbiAgICogY2xpZW50IGluIHRoZSBhcHBsaWNhdGlvbi4gVGhpcyB2YWx1ZSBpcyBkZWZpbmVkIGluIHRoZVxuICAgKiBbYGNsaWVudC5pbml0YF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLnNlcnZlcn5zZXJ2ZXJDb25maWd9IG9iamVjdFxuICAgKiBhbmQgZGVmYXVsdHMgdG8gYCdwbGF5ZXInYC5cbiAgICpcbiAgICogQHR5cGUge1N0cmluZ31cbiAgICovXG4gIHR5cGU6IG51bGwsXG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyYXRpb24gaW5mb3JtYXRpb25zIGZyb20gdGhlIHNlcnZlciBjb25maWd1cmF0aW9uIGlmIGFueS5cbiAgICpcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LmNsaWVudH5pbml0fVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuU2hhcmVkQ29uZmlnfVxuICAgKi9cbiAgY29uZmlnOiB7fSxcblxuICAvKipcbiAgICogQXJyYXkgb2Ygb3B0aW9ubmFsIHBhcmFtZXRlcnMgcGFzc2VkIHRocm91Z2ggdGhlIHVybFxuICAgKlxuICAgKiBAdHlwZSB7QXJyYXl9XG4gICAqL1xuICAgdXJsUGFyYW1zOiBudWxsLFxuXG4gIC8qKlxuICAgKiBJbmZvcm1hdGlvbiBhYm91dCB0aGUgY2xpZW50IHBsYXRmb3JtLiBUaGUgcHJvcGVydGllcyBhcmUgc2V0IGJ5IHRoZVxuICAgKiBbYHBsYXRmb3JtYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYXRmb3JtfSBzZXJ2aWNlLlxuICAgKlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gb3MgLSBPcGVyYXRpbmcgc3lzdGVtLlxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGlzTW9iaWxlIC0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGNsaWVudCBpcyBydW5uaW5nIG9uIGFcbiAgICogIG1vYmlsZSBwbGF0Zm9ybSBvciBub3QuXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBhdWRpb0ZpbGVFeHQgLSBBdWRpbyBmaWxlIGV4dGVuc2lvbiB0byB1c2UsIGRlcGVuZGluZyBvblxuICAgKiAgdGhlIHBsYXRmb3JtLlxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gaW50ZXJhY3Rpb24gLSBUeXBlIG9mIGludGVyYWN0aW9uIGFsbG93ZWQgYnkgdGhlXG4gICAqICB2aWV3cG9ydCwgYHRvdWNoYCBvciBgbW91c2VgXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGF0Zm9ybX1cbiAgICovXG4gIHBsYXRmb3JtOiB7XG4gICAgb3M6IG51bGwsXG4gICAgaXNNb2JpbGU6IG51bGwsXG4gICAgYXVkaW9GaWxlRXh0OiAnJyxcbiAgICBpbnRlcmFjdGlvbjogbnVsbCxcbiAgfSxcblxuICAvKipcbiAgICogRGVmaW5lcyB3aGV0aGVyIHRoZSB1c2VyJ3MgZGV2aWNlIGlzIGNvbXBhdGlibGUgd2l0aCB0aGUgYXBwbGljYXRpb25cbiAgICogcmVxdWlyZW1lbnRzLlxuICAgKlxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYXRmb3JtfVxuICAgKi9cbiAgY29tcGF0aWJsZTogbnVsbCxcblxuICAvKipcbiAgICogSW5kZXggKGlmIGFueSkgZ2l2ZW4gYnkgYSBbYHBsYWNlcmBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGFjZXJ9XG4gICAqIG9yIFtgY2hlY2tpbmBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DaGVja2lufSBzZXJ2aWNlLlxuICAgKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQ2hlY2tpbn1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYWNlcn1cbiAgICovXG4gIGluZGV4OiBudWxsLFxuXG4gIC8qKlxuICAgKiBUaWNrZXQgbGFiZWwgKGlmIGFueSkgZ2l2ZW4gYnkgYSBbYHBsYWNlcmBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGFjZXJ9XG4gICAqIG9yIFtgY2hlY2tpbmBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DaGVja2lufSBzZXJ2aWNlLlxuICAgKlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQ2hlY2tpbn1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYWNlcn1cbiAgICovXG4gIGxhYmVsOiBudWxsLFxuXG4gIC8qKlxuICAgKiBDbGllbnQgY29vcmRpbmF0ZXMgKGlmIGFueSkgZ2l2ZW4gYnkgYVxuICAgKiBbYGxvY2F0b3JgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuTG9jYXRvcn0sXG4gICAqIFtgcGxhY2VyYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYWNlcn0gb3JcbiAgICogW2BjaGVja2luYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNoZWNraW59IHNlcnZpY2UuXG4gICAqIChGb3JtYXQ6IGBbeDpOdW1iZXIsIHk6TnVtYmVyXWAuKVxuICAgKlxuICAgKiBAdHlwZSB7QXJyYXk8TnVtYmVyPn1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNoZWNraW59XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5Mb2NhdG9yfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhY2VyfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuR2VvbG9jYXRpb259XG4gICAqL1xuICBjb29yZGluYXRlczogbnVsbCxcblxuICAvKipcbiAgICogRnVsbCBgZ2VvcG9zaXRpb25gIG9iamVjdCBhcyByZXR1cm5lZCBieSBgbmF2aWdhdG9yLmdlb2xvY2F0aW9uYCwgd2hlblxuICAgKiB1c2luZyB0aGUgYGdlb2xvY2F0aW9uYCBzZXJ2aWNlLlxuICAgKlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuR2VvbG9jYXRpb259XG4gICAqL1xuICBnZW9wb3NpdGlvbjogbnVsbCxcblxuICAvKipcbiAgICogU29ja2V0IG9iamVjdCB0aGF0IGhhbmRsZSBjb21tdW5pY2F0aW9ucyB3aXRoIHRoZSBzZXJ2ZXIsIGlmIGFueS5cbiAgICogVGhpcyBvYmplY3QgaXMgYXV0b21hdGljYWxseSBjcmVhdGVkIGlmIHRoZSBleHBlcmllbmNlIHJlcXVpcmVzIGFueSBzZXJ2aWNlXG4gICAqIGhhdmluZyBhIHNlcnZlci1zaWRlIGNvdW50ZXJwYXJ0LlxuICAgKlxuICAgKiBAdHlwZSB7bW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LnNvY2tldH1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNvY2tldDogc29ja2V0LFxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSBhcHBsaWNhdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IFtjbGllbnRUeXBlPSdwbGF5ZXInXSAtIFRoZSB0eXBlIG9mIHRoZSBjbGllbnQsIGRlZmluZXMgdGhlXG4gICAqICBzb2NrZXQgY29ubmVjdGlvbiBuYW1lc3BhY2UuIFNob3VsZCBtYXRjaCBhIGNsaWVudCB0eXBlIGRlZmluZWQgc2VydmVyIHNpZGUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbY29uZmlnPXt9XVxuICAgKiBAcGFyYW0ge09iamVjdH0gW2NvbmZpZy5hcHBDb250YWluZXI9JyNjb250YWluZXInXSAtIEEgY3NzIHNlbGVjdG9yXG4gICAqICBtYXRjaGluZyBhIERPTSBlbGVtZW50IHdoZXJlIHRoZSB2aWV3cyBzaG91bGQgYmUgaW5zZXJ0ZWQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbY29uZmlnLndlYnNvY2tldHMudXJsPScnXSAtIFRoZSB1cmwgd2hlcmUgdGhlIHNvY2tldCBzaG91bGRcbiAgICogIGNvbm5lY3QgXyh1bnN0YWJsZSlfLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW2NvbmZpZy53ZWJzb2NrZXRzLnRyYW5zcG9ydHM9Wyd3ZWJzb2NrZXQnXV0gLSBUaGUgdHJhbnNwb3J0XG4gICAqICB1c2VkIHRvIGNyZWF0ZSB0aGUgdXJsIChvdmVycmlkZXMgZGVmYXVsdCBzb2NrZXQuaW8gbWVjYW5pc20pIF8odW5zdGFibGUpXy5cbiAgICovXG4gIGluaXQoY2xpZW50VHlwZSA9ICdwbGF5ZXInLCBjb25maWcgPSB7fSkge1xuICAgIHRoaXMudHlwZSA9IGNsaWVudFR5cGU7XG5cbiAgICB0aGlzLl9wYXJzZVVybFBhcmFtcygpO1xuICAgIC8vIGlmIHNvY2tldCBjb25maWcgZ2l2ZW4sIG1peCBpdCB3aXRoIGRlZmF1bHRzXG4gICAgY29uc3Qgd2Vic29ja2V0cyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgdXJsOiAnJyxcbiAgICAgIHRyYW5zcG9ydHM6IFsnd2Vic29ja2V0J10sXG4gICAgICBwYXRoOiAnJyxcbiAgICB9LCBjb25maWcud2Vic29ja2V0cyk7XG5cbiAgICAvLyBtaXggYWxsIG90aGVyIGNvbmZpZyBhbmQgb3ZlcnJpZGUgd2l0aCBkZWZpbmVkIHNvY2tldCBjb25maWdcbiAgICBPYmplY3QuYXNzaWduKHRoaXMuY29uZmlnLCBjb25maWcsIHsgd2Vic29ja2V0cyB9KTtcblxuICAgIHNlcnZpY2VNYW5hZ2VyLmluaXQoKTtcbiAgICB2aWV3cG9ydC5pbml0KCk7XG5cbiAgICBjb25zdCBlbCA9IGNvbmZpZy5hcHBDb250YWluZXI7XG4gICAgY29uc3QgJGNvbnRhaW5lciA9IGVsIGluc3RhbmNlb2YgRWxlbWVudCA/IGVsIDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbCk7XG4gICAgdmlld01hbmFnZXIuc2V0QXBwQ29udGFpbmVyKCRjb250YWluZXIpO1xuXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIGZ1bmN0aW9uIHRvIGJlIGV4ZWN1dGVkIHdoZW4gYSBzZXJ2aWNlIGlzIGluc3RhbmNpYXRlZC5cbiAgICpcbiAgICogQHBhcmFtIHtzZXJ2aWNlTWFuYWdlcn5zZXJ2aWNlSW5zdGFuY2lhdGlvbkhvb2t9IGZ1bmMgLSBGdW5jdGlvbiB0b1xuICAgKiAgcmVnaXN0ZXIgaGFzIGEgaG9vayB0byBiZSBleGVjdXRlIHdoZW4gYSBzZXJ2aWNlIGlzIGNyZWF0ZWQuXG4gICAqL1xuICAvKipcbiAgICogQGNhbGxiYWNrIHNlcnZpY2VNYW5hZ2VyfnNlcnZpY2VJbnN0YW5jaWF0aW9uSG9va1xuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBpZCBvZiB0aGUgaW5zdGFuY2lhdGVkIHNlcnZpY2UuXG4gICAqIEBwYXJhbSB7U2VydmljZX0gaW5zdGFuY2UgLSBpbnN0YW5jZSBvZiB0aGUgc2VydmljZS5cbiAgICovXG4gIHNldFNlcnZpY2VJbnN0YW5jaWF0aW9uSG9vayhmdW5jKSB7XG4gICAgc2VydmljZU1hbmFnZXIuc2V0U2VydmljZUluc3RhbmNpYXRpb25Ib29rKGZ1bmMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgYXBwbGljYXRpb24uXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBpZiAoc29ja2V0LnJlcXVpcmVkKVxuICAgICAgdGhpcy5faW5pdFNvY2tldCgoKSA9PiBzZXJ2aWNlTWFuYWdlci5zdGFydCgpKTtcbiAgICBlbHNlXG4gICAgICBzZXJ2aWNlTWFuYWdlci5zdGFydCgpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc2VydmljZSBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIElkZW50aWZpZXIgb2YgdGhlIHNlcnZpY2UuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3B0aW9ucyB0byBjb25maWd1cmUgdGhlIHNlcnZpY2UuXG4gICAqL1xuICByZXF1aXJlKGlkLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIHNlcnZpY2VNYW5hZ2VyLnJlcXVpcmUoaWQsIG9wdGlvbnMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBhbiBhcnJheSBvZiBvcHRpb25uYWwgcGFyYW1ldGVycyBmcm9tIHRoZSB1cmwgZXhjbHVkaW5nIHRoZSBjbGllbnQgdHlwZVxuICAgKiBhbmQgc3RvcmUgaXQgaW4gYHRoaXMudXJsUGFyYW1zYC5cbiAgICogUGFyYW1ldGVycyBjYW4gYmUgZGVmaW5lZCBpbiB0d28gd2F5cyA6XG4gICAqIC0gYXMgYSByZWd1bGFyIHJvdXRlIChleDogYC9wbGF5ZXIvcGFyYW0xL3BhcmFtMmApXG4gICAqIC0gYXMgYSBoYXNoIChleDogYC9wbGF5ZXIjcGFyYW0xLXBhcmFtMmApXG4gICAqIFRoZSBwYXJhbWV0ZXJzIGFyZSBzZW5kIGFsb25nIHdpdGggdGhlIHNvY2tldCBjb25uZWN0aW9uXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5zb2NrZXR9XG4gICAqIEBwcml2YXRlXG4gICAqIEB0b2RvIC0gV2hlbiBoYW5kc2hha2UgaW1wbGVtZW50ZWQsIGRlZmluZSBpZiB0aGVzZSBpbmZvcm1hdGlvbnMgc2hvdWxkIGJlIHBhcnQgb2YgaXRcbiAgICovXG4gIF9wYXJzZVVybFBhcmFtcygpIHtcbiAgICBsZXQgcGF0aFBhcmFtcyA9IG51bGw7XG4gICAgbGV0IGhhc2hQYXJhbXMgPSBudWxsO1xuICAgIC8vIGhhbmRsZSBwYXRoIG5hbWUgZmlyc3RcbiAgICBsZXQgcGF0aG5hbWUgPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG4gICAgLy8gc2FuaXRpemVcbiAgICBwYXRobmFtZSA9IHBhdGhuYW1lXG4gICAgICAucmVwbGFjZSgvXlxcLy8sICcnKSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBsZWFkaW5nIHNsYXNoXG4gICAgICAucmVwbGFjZShuZXcgUmVnRXhwKCdeJyArIHRoaXMudHlwZSArICcvPycpLCAnJykgIC8vIHJlbW92ZSBjbGllbnRUeXBlXG4gICAgICAucmVwbGFjZSgvXFwvJC8sICcnKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0cmFpbGluZyBzbGFzaFxuXG4gICAgaWYgKHBhdGhuYW1lLmxlbmd0aCA+IDApXG4gICAgICBwYXRoUGFyYW1zID0gcGF0aG5hbWUuc3BsaXQoJy8nKTtcblxuICAgIC8vIGhhbmRsZSBoYXNoXG4gICAgbGV0IGhhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaDtcbiAgICBoYXNoID0gaGFzaC5yZXBsYWNlKC9eIy8sICcnKTtcblxuICAgIGlmIChoYXNoLmxlbmd0aCA+IDApXG4gICAgICBoYXNoUGFyYW1zID0gaGFzaC5zcGxpdCgnLScpO1xuXG4gICAgaWYgKHBhdGhQYXJhbXMgfHzCoGhhc2hQYXJhbXMpIHtcbiAgICAgIHRoaXMudXJsUGFyYW1zID0gW107XG5cbiAgICAgIGlmIChwYXRoUGFyYW1zKVxuICAgICAgICBwYXRoUGFyYW1zLmZvckVhY2goKHBhcmFtKSA9PiB0aGlzLnVybFBhcmFtcy5wdXNoKHBhcmFtKSk7XG5cbiAgICAgIGlmIChoYXNoUGFyYW1zKVxuICAgICAgICBoYXNoUGFyYW1zLmZvckVhY2goKHBhcmFtKSA9PiB0aGlzLnVybFBhcmFtcy5wdXNoKHBhcmFtKSk7XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coJ3NvdW5kd29ya3MnLCB0aGlzLnVybFBhcmFtcyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgc29ja2V0IGNvbm5lY3Rpb24gYW5kIHBlcmZvcm0gaGFuZHNoYWtlIHdpdGggdGhlIHNlcnZlci5cbiAgICogQHRvZG8gLSByZWZhY3RvciBoYW5kc2hha2UuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfaW5pdFNvY2tldChjYWxsYmFjaykge1xuICAgIHNvY2tldC5pbml0KHRoaXMudHlwZSwgdGhpcy5jb25maWcud2Vic29ja2V0cyk7XG5cbiAgICAvLyBzZWU6IGh0dHA6Ly9zb2NrZXQuaW8vZG9jcy9jbGllbnQtYXBpLyNzb2NrZXRcbiAgICB0aGlzLnNvY2tldC5hZGRTdGF0ZUxpc3RlbmVyKChldmVudE5hbWUpID0+IHtcbiAgICAgIHN3aXRjaCAoZXZlbnROYW1lKSB7XG4gICAgICAgIGNhc2UgJ2Nvbm5lY3QnOlxuICAgICAgICAgIGNvbnN0IHBheWxvYWQgPSB7IHVybFBhcmFtczogdGhpcy51cmxQYXJhbXMgfTtcblxuICAgICAgICAgIGlmICh0aGlzLmNvbmZpZy5lbnYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihwYXlsb2FkLCB7XG4gICAgICAgICAgICAgIHJlcXVpcmVkU2VydmljZXM6IHNlcnZpY2VNYW5hZ2VyLmdldFJlcXVpcmVkU2VydmljZXMoKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5zb2NrZXQuc2VuZCgnaGFuZHNoYWtlJywgcGF5bG9hZCk7XG4gICAgICAgICAgLy8gd2FpdCBmb3IgaGFuZHNoYWtlIHJlc3BvbnNlIHRvIG1hcmsgY2xpZW50IGFzIGByZWFkeWBcbiAgICAgICAgICB0aGlzLnNvY2tldC5yZWNlaXZlKCdjbGllbnQ6c3RhcnQnLCAodXVpZCkgPT4ge1xuICAgICAgICAgICAgdGhpcy51dWlkID0gdXVpZDtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB0aGlzLnNvY2tldC5yZWNlaXZlKCdjbGllbnQ6ZXJyb3InLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKGVyci50eXBlKSB7XG4gICAgICAgICAgICAgIGNhc2UgJ3NlcnZpY2VzJzpcbiAgICAgICAgICAgICAgICAvLyBjYW4gb25seSBhcHBlbmQgaWYgZW52ICE9PSAncHJvZHVjdGlvbidcbiAgICAgICAgICAgICAgICBjb25zdCBtc2cgPSBgXCIke2Vyci5kYXRhLmpvaW4oJywgJyl9XCIgcmVxdWlyZWQgY2xpZW50LXNpZGUgYnV0IG5vdCBzZXJ2ZXItc2lkZWA7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgLy8gY2FzZSAncmVjb25uZWN0JzpcbiAgICAgICAgICAvLyAgIC8vIHNlcnZpY2VNYW5hZ2VyLnN0YXJ0KCk7XG4gICAgICAgICAgLy8gICBicmVhaztcbiAgICAgICAgICAvLyBjYXNlICdkaXNjb25uZWN0JzpcbiAgICAgICAgICAvLyAgIC8vIGNhbiByZWxhdW5jaCBzZXJ2aWNlTWFuYWdlciBvbiByZWNvbm5lY3Rpb25cbiAgICAgICAgICAvLyAgIC8vIHNlcnZpY2VNYW5hZ2VyLnJlc2V0KCk7XG4gICAgICAgICAgLy8gICBicmVhaztcbiAgICAgICAgICAvLyBjYXNlICdjb25uZWN0X2Vycm9yJzpcbiAgICAgICAgICAvLyBjYXNlICdyZWNvbm5lY3RfYXR0ZW1wdCc6XG4gICAgICAgICAgLy8gY2FzZSAncmVjb25uZWN0aW5nJzpcbiAgICAgICAgICAvLyBjYXNlICdyZWNvbm5lY3RfZXJyb3InOlxuICAgICAgICAgIC8vIGNhc2UgJ3JlY29ubmVjdF9mYWlsZWQnOlxuICAgICAgICAgIC8vICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGllbnQ7XG4iXX0=