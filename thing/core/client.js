'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _serviceManager = require('../../client/core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

var _socket = require('../../client/core/socket');

var _socket2 = _interopRequireDefault(_socket);

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
    os: 'raspbian'
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
    var clientType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'thing';
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    this.type = clientType;

    // if socket config given, mix it with defaults
    var websockets = (0, _assign2.default)({
      url: '',
      transports: ['websocket'],
      path: ''
    }, config.websockets);

    // mix all other config and override with defined socket config
    (0, _assign2.default)(this.config, config, { websockets: websockets });

    _serviceManager2.default.init();

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
    this._initSocket(function () {
      return _serviceManager2.default.start();
    });
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
  _initSocket: function _initSocket(callback) {
    var _this = this;

    _socket2.default.init(this.type, this.config.websockets);

    // see: http://socket.io/docs/client-api/#socket
    this.socket.addStateListener(function (eventName) {
      switch (eventName) {
        case 'connect':
          var payload = { urlParams: _this.urlParams };

          if (_this.config.env !== 'production') {
            (0, _assign2.default)(payload, {
              requiredServices: _serviceManager2.default.getRequiredServices()
            });
          }

          _this.socket.send('handshake', payload);

          // wait for handshake response to mark client as `ready`
          _this.socket.receive('client:start', function (uuid) {
            _this.uuid = uuid;
            callback();
          });

          _this.socket.receive('client:error', function (err) {
            switch (err.type) {
              case 'services':
                // can only append if env !== 'production'
                var msg = '"' + err.data.join(', ') + '" required client-side but not server-side';
                throw new Error(msg);
                break;
            }
          });
          break;
      }
    });
  }
};

exports.default = client;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsaWVudC5qcyJdLCJuYW1lcyI6WyJjbGllbnQiLCJ1dWlkIiwidHlwZSIsImNvbmZpZyIsInBsYXRmb3JtIiwib3MiLCJjb21wYXRpYmxlIiwiaW5kZXgiLCJsYWJlbCIsImNvb3JkaW5hdGVzIiwiZ2VvcG9zaXRpb24iLCJzb2NrZXQiLCJpbml0IiwiY2xpZW50VHlwZSIsIndlYnNvY2tldHMiLCJ1cmwiLCJ0cmFuc3BvcnRzIiwicGF0aCIsInNlcnZpY2VNYW5hZ2VyIiwicmVzb2x2ZSIsInNldFNlcnZpY2VJbnN0YW5jaWF0aW9uSG9vayIsImZ1bmMiLCJzdGFydCIsIl9pbml0U29ja2V0IiwicmVxdWlyZSIsImlkIiwib3B0aW9ucyIsImNhbGxiYWNrIiwiYWRkU3RhdGVMaXN0ZW5lciIsImV2ZW50TmFtZSIsInBheWxvYWQiLCJ1cmxQYXJhbXMiLCJlbnYiLCJyZXF1aXJlZFNlcnZpY2VzIiwiZ2V0UmVxdWlyZWRTZXJ2aWNlcyIsInNlbmQiLCJyZWNlaXZlIiwiZXJyIiwibXNnIiwiZGF0YSIsImpvaW4iLCJFcnJvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsSUFBTUEsU0FBUztBQUNiOzs7OztBQUtBQyxRQUFNLElBTk87O0FBUWI7Ozs7Ozs7O0FBUUFDLFFBQU0sSUFoQk87O0FBa0JiOzs7Ozs7O0FBT0FDLFVBQVEsRUF6Qks7O0FBMkJiOzs7Ozs7Ozs7Ozs7Ozs7QUFlQUMsWUFBVTtBQUNSQyxRQUFJO0FBREksR0ExQ0c7O0FBOENiOzs7Ozs7O0FBT0FDLGNBQVksSUFyREM7O0FBdURiOzs7Ozs7OztBQVFBQyxTQUFPLElBL0RNOztBQWlFYjs7Ozs7Ozs7QUFRQUMsU0FBTyxJQXpFTTs7QUEyRWI7Ozs7Ozs7Ozs7Ozs7QUFhQUMsZUFBYSxJQXhGQTs7QUEwRmI7Ozs7Ozs7QUFPQUMsZUFBYSxJQWpHQTs7QUFtR2I7Ozs7Ozs7O0FBUUFDLFVBQVFBLGdCQTNHSzs7QUE2R2I7Ozs7Ozs7Ozs7Ozs7QUFhQUMsTUExSGEsa0JBMEgyQjtBQUFBLFFBQW5DQyxVQUFtQyx1RUFBdEIsT0FBc0I7QUFBQSxRQUFiVixNQUFhLHVFQUFKLEVBQUk7O0FBQ3RDLFNBQUtELElBQUwsR0FBWVcsVUFBWjs7QUFFQTtBQUNBLFFBQU1DLGFBQWEsc0JBQWM7QUFDL0JDLFdBQUssRUFEMEI7QUFFL0JDLGtCQUFZLENBQUMsV0FBRCxDQUZtQjtBQUcvQkMsWUFBTTtBQUh5QixLQUFkLEVBSWhCZCxPQUFPVyxVQUpTLENBQW5COztBQU1BO0FBQ0EsMEJBQWMsS0FBS1gsTUFBbkIsRUFBMkJBLE1BQTNCLEVBQW1DLEVBQUVXLHNCQUFGLEVBQW5DOztBQUVBSSw2QkFBZU4sSUFBZjs7QUFFQSxXQUFPLGtCQUFRTyxPQUFSLEVBQVA7QUFDRCxHQTFJWTs7O0FBNEliOzs7Ozs7QUFNQTs7Ozs7QUFLQUMsNkJBdkphLHVDQXVKZUMsSUF2SmYsRUF1SnFCO0FBQ2hDSCw2QkFBZUUsMkJBQWYsQ0FBMkNDLElBQTNDO0FBQ0QsR0F6Slk7OztBQTJKYjs7O0FBR0FDLE9BOUphLG1CQThKTDtBQUNOLFNBQUtDLFdBQUwsQ0FBaUI7QUFBQSxhQUFNTCx5QkFBZUksS0FBZixFQUFOO0FBQUEsS0FBakI7QUFDRCxHQWhLWTs7O0FBa0tiOzs7OztBQUtBRSxTQXZLYSxtQkF1S0xDLEVBdktLLEVBdUtEQyxPQXZLQyxFQXVLUTtBQUNuQixXQUFPUix5QkFBZU0sT0FBZixDQUF1QkMsRUFBdkIsRUFBMkJDLE9BQTNCLENBQVA7QUFDRCxHQXpLWTs7O0FBMktiOzs7OztBQUtBSCxhQWhMYSx1QkFnTERJLFFBaExDLEVBZ0xTO0FBQUE7O0FBQ3BCaEIscUJBQU9DLElBQVAsQ0FBWSxLQUFLVixJQUFqQixFQUF1QixLQUFLQyxNQUFMLENBQVlXLFVBQW5DOztBQUVBO0FBQ0EsU0FBS0gsTUFBTCxDQUFZaUIsZ0JBQVosQ0FBNkIsVUFBQ0MsU0FBRCxFQUFlO0FBQzFDLGNBQVFBLFNBQVI7QUFDRSxhQUFLLFNBQUw7QUFDRSxjQUFNQyxVQUFVLEVBQUVDLFdBQVcsTUFBS0EsU0FBbEIsRUFBaEI7O0FBRUEsY0FBSSxNQUFLNUIsTUFBTCxDQUFZNkIsR0FBWixLQUFvQixZQUF4QixFQUFzQztBQUNwQyxrQ0FBY0YsT0FBZCxFQUF1QjtBQUNyQkcsZ0NBQWtCZix5QkFBZWdCLG1CQUFmO0FBREcsYUFBdkI7QUFHRDs7QUFFRCxnQkFBS3ZCLE1BQUwsQ0FBWXdCLElBQVosQ0FBaUIsV0FBakIsRUFBOEJMLE9BQTlCOztBQUVBO0FBQ0EsZ0JBQUtuQixNQUFMLENBQVl5QixPQUFaLENBQW9CLGNBQXBCLEVBQW9DLFVBQUNuQyxJQUFELEVBQVU7QUFDNUMsa0JBQUtBLElBQUwsR0FBWUEsSUFBWjtBQUNBMEI7QUFDRCxXQUhEOztBQUtBLGdCQUFLaEIsTUFBTCxDQUFZeUIsT0FBWixDQUFvQixjQUFwQixFQUFvQyxVQUFDQyxHQUFELEVBQVM7QUFDM0Msb0JBQVFBLElBQUluQyxJQUFaO0FBQ0UsbUJBQUssVUFBTDtBQUNFO0FBQ0Esb0JBQU1vQyxZQUFVRCxJQUFJRSxJQUFKLENBQVNDLElBQVQsQ0FBYyxJQUFkLENBQVYsK0NBQU47QUFDQSxzQkFBTSxJQUFJQyxLQUFKLENBQVVILEdBQVYsQ0FBTjtBQUNBO0FBTEo7QUFPRCxXQVJEO0FBU0E7QUEzQko7QUE2QkQsS0E5QkQ7QUErQkQ7QUFuTlksQ0FBZjs7a0JBc05ldEMsTSIsImZpbGUiOiJjbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vLi4vY2xpZW50L2NvcmUvc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IHNvY2tldCBmcm9tICcuLi8uLi9jbGllbnQvY29yZS9zb2NrZXQnO1xuXG4vKipcbiAqIENsaWVudCBzaWRlIGVudHJ5IHBvaW50IGZvciBhIGBzb3VuZHdvcmtzYCBhcHBsaWNhdGlvbi5cbiAqXG4gKiBUaGlzIG9iamVjdCBob3N0cyBnZW5lcmFsIGluZm9ybWF0aW9ucyBhYm91dCB0aGUgdXNlciwgYXMgd2VsbCBhcyBtZXRob2RzXG4gKiB0byBpbml0aWFsaXplIGFuZCBzdGFydCB0aGUgYXBwbGljYXRpb24uXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQG5hbWVzcGFjZVxuICpcbiAqIEBleGFtcGxlXG4gKiBpbXBvcnQgKiBhcyBzb3VuZHdvcmtzIGZyb20gJ3NvdW5kd29ya3MvY2xpZW50JztcbiAqIGltcG9ydCBNeUV4cGVyaWVuY2UgZnJvbSAnLi9NeUV4cGVyaWVuY2UnO1xuICpcbiAqIHNvdW5kd29ya3MuY2xpZW50LmluaXQoJ3BsYXllcicpO1xuICogY29uc3QgbXlFeHBlcmllbmNlID0gbmV3IE15RXhwZXJpZW5jZSgpO1xuICogc291bmR3b3Jrcy5jbGllbnQuc3RhcnQoKTtcbiAqL1xuY29uc3QgY2xpZW50ID0ge1xuICAvKipcbiAgICogVW5pcXVlIGlkIG9mIHRoZSBjbGllbnQsIGdlbmVyYXRlZCBhbmQgcmV0cmlldmVkIGJ5IHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICB1dWlkOiBudWxsLFxuXG4gIC8qKlxuICAgKiBUaGUgdHlwZSBvZiB0aGUgY2xpZW50LCB0aGlzIGNhbiBnZW5lcmFsbHkgYmUgY29uc2lkZXJlZCBhcyB0aGUgcm9sZSBvZiB0aGVcbiAgICogY2xpZW50IGluIHRoZSBhcHBsaWNhdGlvbi4gVGhpcyB2YWx1ZSBpcyBkZWZpbmVkIGluIHRoZVxuICAgKiBbYGNsaWVudC5pbml0YF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLnNlcnZlcn5zZXJ2ZXJDb25maWd9IG9iamVjdFxuICAgKiBhbmQgZGVmYXVsdHMgdG8gYCdwbGF5ZXInYC5cbiAgICpcbiAgICogQHR5cGUge1N0cmluZ31cbiAgICovXG4gIHR5cGU6IG51bGwsXG5cbiAgLyoqXG4gICAqIENvbmZpZ3VyYXRpb24gaW5mb3JtYXRpb25zIGZyb20gdGhlIHNlcnZlciBjb25maWd1cmF0aW9uIGlmIGFueS5cbiAgICpcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LmNsaWVudH5pbml0fVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuU2hhcmVkQ29uZmlnfVxuICAgKi9cbiAgY29uZmlnOiB7fSxcblxuICAvKipcbiAgICogSW5mb3JtYXRpb24gYWJvdXQgdGhlIGNsaWVudCBwbGF0Zm9ybS4gVGhlIHByb3BlcnRpZXMgYXJlIHNldCBieSB0aGVcbiAgICogW2BwbGF0Zm9ybWBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGF0Zm9ybX0gc2VydmljZS5cbiAgICpcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtTdHJpbmd9IG9zIC0gT3BlcmF0aW5nIHN5c3RlbS5cbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBpc01vYmlsZSAtIEluZGljYXRlcyB3aGV0aGVyIHRoZSBjbGllbnQgaXMgcnVubmluZyBvbiBhXG4gICAqICBtb2JpbGUgcGxhdGZvcm0gb3Igbm90LlxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gYXVkaW9GaWxlRXh0IC0gQXVkaW8gZmlsZSBleHRlbnNpb24gdG8gdXNlLCBkZXBlbmRpbmcgb25cbiAgICogIHRoZSBwbGF0Zm9ybS5cbiAgICogQHByb3BlcnR5IHtTdHJpbmd9IGludGVyYWN0aW9uIC0gVHlwZSBvZiBpbnRlcmFjdGlvbiBhbGxvd2VkIGJ5IHRoZVxuICAgKiAgdmlld3BvcnQsIGB0b3VjaGAgb3IgYG1vdXNlYFxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhdGZvcm19XG4gICAqL1xuICBwbGF0Zm9ybToge1xuICAgIG9zOiAncmFzcGJpYW4nLFxuICB9LFxuXG4gIC8qKlxuICAgKiBEZWZpbmVzIHdoZXRoZXIgdGhlIHVzZXIncyBkZXZpY2UgaXMgY29tcGF0aWJsZSB3aXRoIHRoZSBhcHBsaWNhdGlvblxuICAgKiByZXF1aXJlbWVudHMuXG4gICAqXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhdGZvcm19XG4gICAqL1xuICBjb21wYXRpYmxlOiBudWxsLFxuXG4gIC8qKlxuICAgKiBJbmRleCAoaWYgYW55KSBnaXZlbiBieSBhIFtgcGxhY2VyYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYWNlcn1cbiAgICogb3IgW2BjaGVja2luYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNoZWNraW59IHNlcnZpY2UuXG4gICAqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DaGVja2lufVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhY2VyfVxuICAgKi9cbiAgaW5kZXg6IG51bGwsXG5cbiAgLyoqXG4gICAqIFRpY2tldCBsYWJlbCAoaWYgYW55KSBnaXZlbiBieSBhIFtgcGxhY2VyYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYWNlcn1cbiAgICogb3IgW2BjaGVja2luYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNoZWNraW59IHNlcnZpY2UuXG4gICAqXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DaGVja2lufVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhY2VyfVxuICAgKi9cbiAgbGFiZWw6IG51bGwsXG5cbiAgLyoqXG4gICAqIENsaWVudCBjb29yZGluYXRlcyAoaWYgYW55KSBnaXZlbiBieSBhXG4gICAqIFtgbG9jYXRvcmBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5Mb2NhdG9yfSxcbiAgICogW2BwbGFjZXJgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhY2VyfSBvclxuICAgKiBbYGNoZWNraW5gXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQ2hlY2tpbn0gc2VydmljZS5cbiAgICogKEZvcm1hdDogYFt4Ok51bWJlciwgeTpOdW1iZXJdYC4pXG4gICAqXG4gICAqIEB0eXBlIHtBcnJheTxOdW1iZXI+fVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQ2hlY2tpbn1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkxvY2F0b3J9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGFjZXJ9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5HZW9sb2NhdGlvbn1cbiAgICovXG4gIGNvb3JkaW5hdGVzOiBudWxsLFxuXG4gIC8qKlxuICAgKiBGdWxsIGBnZW9wb3NpdGlvbmAgb2JqZWN0IGFzIHJldHVybmVkIGJ5IGBuYXZpZ2F0b3IuZ2VvbG9jYXRpb25gLCB3aGVuXG4gICAqIHVzaW5nIHRoZSBgZ2VvbG9jYXRpb25gIHNlcnZpY2UuXG4gICAqXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5HZW9sb2NhdGlvbn1cbiAgICovXG4gIGdlb3Bvc2l0aW9uOiBudWxsLFxuXG4gIC8qKlxuICAgKiBTb2NrZXQgb2JqZWN0IHRoYXQgaGFuZGxlIGNvbW11bmljYXRpb25zIHdpdGggdGhlIHNlcnZlciwgaWYgYW55LlxuICAgKiBUaGlzIG9iamVjdCBpcyBhdXRvbWF0aWNhbGx5IGNyZWF0ZWQgaWYgdGhlIGV4cGVyaWVuY2UgcmVxdWlyZXMgYW55IHNlcnZpY2VcbiAgICogaGF2aW5nIGEgc2VydmVyLXNpZGUgY291bnRlcnBhcnQuXG4gICAqXG4gICAqIEB0eXBlIHttb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuc29ja2V0fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc29ja2V0OiBzb2NrZXQsXG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIGFwcGxpY2F0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW2NsaWVudFR5cGU9J3BsYXllciddIC0gVGhlIHR5cGUgb2YgdGhlIGNsaWVudCwgZGVmaW5lcyB0aGVcbiAgICogIHNvY2tldCBjb25uZWN0aW9uIG5hbWVzcGFjZS4gU2hvdWxkIG1hdGNoIGEgY2xpZW50IHR5cGUgZGVmaW5lZCBzZXJ2ZXIgc2lkZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtjb25maWc9e31dXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbY29uZmlnLmFwcENvbnRhaW5lcj0nI2NvbnRhaW5lciddIC0gQSBjc3Mgc2VsZWN0b3JcbiAgICogIG1hdGNoaW5nIGEgRE9NIGVsZW1lbnQgd2hlcmUgdGhlIHZpZXdzIHNob3VsZCBiZSBpbnNlcnRlZC5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtjb25maWcud2Vic29ja2V0cy51cmw9JyddIC0gVGhlIHVybCB3aGVyZSB0aGUgc29ja2V0IHNob3VsZFxuICAgKiAgY29ubmVjdCBfKHVuc3RhYmxlKV8uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbY29uZmlnLndlYnNvY2tldHMudHJhbnNwb3J0cz1bJ3dlYnNvY2tldCddXSAtIFRoZSB0cmFuc3BvcnRcbiAgICogIHVzZWQgdG8gY3JlYXRlIHRoZSB1cmwgKG92ZXJyaWRlcyBkZWZhdWx0IHNvY2tldC5pbyBtZWNhbmlzbSkgXyh1bnN0YWJsZSlfLlxuICAgKi9cbiAgaW5pdChjbGllbnRUeXBlID0gJ3RoaW5nJywgY29uZmlnID0ge30pIHtcbiAgICB0aGlzLnR5cGUgPSBjbGllbnRUeXBlO1xuXG4gICAgLy8gaWYgc29ja2V0IGNvbmZpZyBnaXZlbiwgbWl4IGl0IHdpdGggZGVmYXVsdHNcbiAgICBjb25zdCB3ZWJzb2NrZXRzID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICB1cmw6ICcnLFxuICAgICAgdHJhbnNwb3J0czogWyd3ZWJzb2NrZXQnXSxcbiAgICAgIHBhdGg6ICcnLFxuICAgIH0sIGNvbmZpZy53ZWJzb2NrZXRzKTtcblxuICAgIC8vIG1peCBhbGwgb3RoZXIgY29uZmlnIGFuZCBvdmVycmlkZSB3aXRoIGRlZmluZWQgc29ja2V0IGNvbmZpZ1xuICAgIE9iamVjdC5hc3NpZ24odGhpcy5jb25maWcsIGNvbmZpZywgeyB3ZWJzb2NrZXRzIH0pO1xuXG4gICAgc2VydmljZU1hbmFnZXIuaW5pdCgpO1xuXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIGZ1bmN0aW9uIHRvIGJlIGV4ZWN1dGVkIHdoZW4gYSBzZXJ2aWNlIGlzIGluc3RhbmNpYXRlZC5cbiAgICpcbiAgICogQHBhcmFtIHtzZXJ2aWNlTWFuYWdlcn5zZXJ2aWNlSW5zdGFuY2lhdGlvbkhvb2t9IGZ1bmMgLSBGdW5jdGlvbiB0b1xuICAgKiAgcmVnaXN0ZXIgaGFzIGEgaG9vayB0byBiZSBleGVjdXRlIHdoZW4gYSBzZXJ2aWNlIGlzIGNyZWF0ZWQuXG4gICAqL1xuICAvKipcbiAgICogQGNhbGxiYWNrIHNlcnZpY2VNYW5hZ2VyfnNlcnZpY2VJbnN0YW5jaWF0aW9uSG9va1xuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBpZCBvZiB0aGUgaW5zdGFuY2lhdGVkIHNlcnZpY2UuXG4gICAqIEBwYXJhbSB7U2VydmljZX0gaW5zdGFuY2UgLSBpbnN0YW5jZSBvZiB0aGUgc2VydmljZS5cbiAgICovXG4gIHNldFNlcnZpY2VJbnN0YW5jaWF0aW9uSG9vayhmdW5jKSB7XG4gICAgc2VydmljZU1hbmFnZXIuc2V0U2VydmljZUluc3RhbmNpYXRpb25Ib29rKGZ1bmMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgYXBwbGljYXRpb24uXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICB0aGlzLl9pbml0U29ja2V0KCgpID0+IHNlcnZpY2VNYW5hZ2VyLnN0YXJ0KCkpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc2VydmljZSBjb25maWd1cmVkIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIElkZW50aWZpZXIgb2YgdGhlIHNlcnZpY2UuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3B0aW9ucyB0byBjb25maWd1cmUgdGhlIHNlcnZpY2UuXG4gICAqL1xuICByZXF1aXJlKGlkLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIHNlcnZpY2VNYW5hZ2VyLnJlcXVpcmUoaWQsIG9wdGlvbnMpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHNvY2tldCBjb25uZWN0aW9uIGFuZCBwZXJmb3JtIGhhbmRzaGFrZSB3aXRoIHRoZSBzZXJ2ZXIuXG4gICAqIEB0b2RvIC0gcmVmYWN0b3IgaGFuZHNoYWtlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2luaXRTb2NrZXQoY2FsbGJhY2spIHtcbiAgICBzb2NrZXQuaW5pdCh0aGlzLnR5cGUsIHRoaXMuY29uZmlnLndlYnNvY2tldHMpO1xuXG4gICAgLy8gc2VlOiBodHRwOi8vc29ja2V0LmlvL2RvY3MvY2xpZW50LWFwaS8jc29ja2V0XG4gICAgdGhpcy5zb2NrZXQuYWRkU3RhdGVMaXN0ZW5lcigoZXZlbnROYW1lKSA9PiB7XG4gICAgICBzd2l0Y2ggKGV2ZW50TmFtZSkge1xuICAgICAgICBjYXNlICdjb25uZWN0JzpcbiAgICAgICAgICBjb25zdCBwYXlsb2FkID0geyB1cmxQYXJhbXM6IHRoaXMudXJsUGFyYW1zIH07XG5cbiAgICAgICAgICBpZiAodGhpcy5jb25maWcuZW52ICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ocGF5bG9hZCwge1xuICAgICAgICAgICAgICByZXF1aXJlZFNlcnZpY2VzOiBzZXJ2aWNlTWFuYWdlci5nZXRSZXF1aXJlZFNlcnZpY2VzKClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuc29ja2V0LnNlbmQoJ2hhbmRzaGFrZScsIHBheWxvYWQpO1xuXG4gICAgICAgICAgLy8gd2FpdCBmb3IgaGFuZHNoYWtlIHJlc3BvbnNlIHRvIG1hcmsgY2xpZW50IGFzIGByZWFkeWBcbiAgICAgICAgICB0aGlzLnNvY2tldC5yZWNlaXZlKCdjbGllbnQ6c3RhcnQnLCAodXVpZCkgPT4ge1xuICAgICAgICAgICAgdGhpcy51dWlkID0gdXVpZDtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB0aGlzLnNvY2tldC5yZWNlaXZlKCdjbGllbnQ6ZXJyb3InLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKGVyci50eXBlKSB7XG4gICAgICAgICAgICAgIGNhc2UgJ3NlcnZpY2VzJzpcbiAgICAgICAgICAgICAgICAvLyBjYW4gb25seSBhcHBlbmQgaWYgZW52ICE9PSAncHJvZHVjdGlvbidcbiAgICAgICAgICAgICAgICBjb25zdCBtc2cgPSBgXCIke2Vyci5kYXRhLmpvaW4oJywgJyl9XCIgcmVxdWlyZWQgY2xpZW50LXNpZGUgYnV0IG5vdCBzZXJ2ZXItc2lkZWA7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGllbnQ7XG4iXX0=