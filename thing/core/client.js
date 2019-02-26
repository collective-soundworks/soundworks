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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsaWVudC5qcyJdLCJuYW1lcyI6WyJjbGllbnQiLCJ1dWlkIiwidHlwZSIsImNvbmZpZyIsInBsYXRmb3JtIiwib3MiLCJjb21wYXRpYmxlIiwiaW5kZXgiLCJsYWJlbCIsImNvb3JkaW5hdGVzIiwiZ2VvcG9zaXRpb24iLCJzb2NrZXQiLCJpbml0IiwiY2xpZW50VHlwZSIsIndlYnNvY2tldHMiLCJ1cmwiLCJ0cmFuc3BvcnRzIiwicGF0aCIsInNlcnZpY2VNYW5hZ2VyIiwicmVzb2x2ZSIsInNldFNlcnZpY2VJbnN0YW5jaWF0aW9uSG9vayIsImZ1bmMiLCJzdGFydCIsIl9pbml0U29ja2V0IiwicmVxdWlyZSIsImlkIiwib3B0aW9ucyIsImNhbGxiYWNrIiwiYWRkU3RhdGVMaXN0ZW5lciIsImV2ZW50TmFtZSIsInBheWxvYWQiLCJ1cmxQYXJhbXMiLCJlbnYiLCJyZXF1aXJlZFNlcnZpY2VzIiwiZ2V0UmVxdWlyZWRTZXJ2aWNlcyIsInNlbmQiLCJyZWNlaXZlIiwiZXJyIiwibXNnIiwiZGF0YSIsImpvaW4iLCJFcnJvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsSUFBTUEsU0FBUztBQUNiOzs7OztBQUtBQyxRQUFNLElBTk87O0FBUWI7Ozs7Ozs7O0FBUUFDLFFBQU0sSUFoQk87O0FBa0JiOzs7Ozs7O0FBT0FDLFVBQVEsRUF6Qks7O0FBMkJiOzs7Ozs7Ozs7Ozs7Ozs7QUFlQUMsWUFBVTtBQUNSQyxRQUFJO0FBREksR0ExQ0c7O0FBOENiOzs7Ozs7O0FBT0FDLGNBQVksSUFyREM7O0FBdURiOzs7Ozs7OztBQVFBQyxTQUFPLElBL0RNOztBQWlFYjs7Ozs7Ozs7QUFRQUMsU0FBTyxJQXpFTTs7QUEyRWI7Ozs7Ozs7Ozs7Ozs7QUFhQUMsZUFBYSxJQXhGQTs7QUEwRmI7Ozs7Ozs7QUFPQUMsZUFBYSxJQWpHQTs7QUFtR2I7Ozs7Ozs7O0FBUUFDLFVBQVFBLGdCQTNHSzs7QUE2R2I7Ozs7Ozs7Ozs7Ozs7QUFhQUMsTUExSGEsa0JBMEgyQjtBQUFBLFFBQW5DQyxVQUFtQyx1RUFBdEIsT0FBc0I7QUFBQSxRQUFiVixNQUFhLHVFQUFKLEVBQUk7O0FBQ3RDLFNBQUtELElBQUwsR0FBWVcsVUFBWjs7QUFFQTtBQUNBLFFBQU1DLGFBQWEsc0JBQWM7QUFDL0JDLFdBQUssRUFEMEI7QUFFL0JDLGtCQUFZLENBQUMsV0FBRCxDQUZtQjtBQUcvQkMsWUFBTTtBQUh5QixLQUFkLEVBSWhCZCxPQUFPVyxVQUpTLENBQW5COztBQU1BO0FBQ0EsMEJBQWMsS0FBS1gsTUFBbkIsRUFBMkJBLE1BQTNCLEVBQW1DLEVBQUVXLHNCQUFGLEVBQW5DOztBQUVBSSw2QkFBZU4sSUFBZjs7QUFFQSxXQUFPLGtCQUFRTyxPQUFSLEVBQVA7QUFDRCxHQTFJWTs7O0FBNEliOzs7Ozs7QUFNQTs7Ozs7QUFLQUMsNkJBdkphLHVDQXVKZUMsSUF2SmYsRUF1SnFCO0FBQ2hDSCw2QkFBZUUsMkJBQWYsQ0FBMkNDLElBQTNDO0FBQ0QsR0F6Slk7OztBQTJKYjs7O0FBR0FDLE9BOUphLG1CQThKTDtBQUNOLFNBQUtDLFdBQUwsQ0FBaUI7QUFBQSxhQUFNTCx5QkFBZUksS0FBZixFQUFOO0FBQUEsS0FBakI7QUFDRCxHQWhLWTs7O0FBa0tiOzs7OztBQUtBRSxTQXZLYSxtQkF1S0xDLEVBdktLLEVBdUtEQyxPQXZLQyxFQXVLUTtBQUNuQixXQUFPUix5QkFBZU0sT0FBZixDQUF1QkMsRUFBdkIsRUFBMkJDLE9BQTNCLENBQVA7QUFDRCxHQXpLWTs7O0FBMktiOzs7OztBQUtBSCxhQWhMYSx1QkFnTERJLFFBaExDLEVBZ0xTO0FBQUE7O0FBQ3BCaEIscUJBQU9DLElBQVAsQ0FBWSxLQUFLVixJQUFqQixFQUF1QixLQUFLQyxNQUFMLENBQVlXLFVBQW5DOztBQUVBO0FBQ0EsU0FBS0gsTUFBTCxDQUFZaUIsZ0JBQVosQ0FBNkIscUJBQWE7QUFDeEMsY0FBUUMsU0FBUjtBQUNFLGFBQUssU0FBTDtBQUNFLGNBQU1DLFVBQVUsRUFBRUMsV0FBVyxNQUFLQSxTQUFsQixFQUFoQjs7QUFFQSxjQUFJLE1BQUs1QixNQUFMLENBQVk2QixHQUFaLEtBQW9CLFlBQXhCLEVBQXNDO0FBQ3BDLGtDQUFjRixPQUFkLEVBQXVCO0FBQ3JCRyxnQ0FBa0JmLHlCQUFlZ0IsbUJBQWY7QUFERyxhQUF2QjtBQUdEOztBQUVELGdCQUFLdkIsTUFBTCxDQUFZd0IsSUFBWixDQUFpQixXQUFqQixFQUE4QkwsT0FBOUI7O0FBRUE7QUFDQSxnQkFBS25CLE1BQUwsQ0FBWXlCLE9BQVosQ0FBb0IsY0FBcEIsRUFBb0MsVUFBQ25DLElBQUQsRUFBVTtBQUM1QyxrQkFBS0EsSUFBTCxHQUFZQSxJQUFaO0FBQ0EwQjtBQUNELFdBSEQ7O0FBS0EsZ0JBQUtoQixNQUFMLENBQVl5QixPQUFaLENBQW9CLGNBQXBCLEVBQW9DLFVBQUNDLEdBQUQsRUFBUztBQUMzQyxvQkFBUUEsSUFBSW5DLElBQVo7QUFDRSxtQkFBSyxVQUFMO0FBQ0U7QUFDQSxvQkFBTW9DLFlBQVVELElBQUlFLElBQUosQ0FBU0MsSUFBVCxDQUFjLElBQWQsQ0FBViwrQ0FBTjtBQUNBLHNCQUFNLElBQUlDLEtBQUosQ0FBVUgsR0FBVixDQUFOO0FBQ0E7QUFMSjtBQU9ELFdBUkQ7QUFTQTtBQTNCSjtBQTZCRCxLQTlCRDtBQStCRDtBQW5OWSxDQUFmOztrQkFzTmV0QyxNIiwiZmlsZSI6ImNsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi8uLi9jbGllbnQvY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgc29ja2V0IGZyb20gJy4uLy4uL2NsaWVudC9jb3JlL3NvY2tldCc7XG5cbi8qKlxuICogQ2xpZW50IHNpZGUgZW50cnkgcG9pbnQgZm9yIGEgYHNvdW5kd29ya3NgIGFwcGxpY2F0aW9uLlxuICpcbiAqIFRoaXMgb2JqZWN0IGhvc3RzIGdlbmVyYWwgaW5mb3JtYXRpb25zIGFib3V0IHRoZSB1c2VyLCBhcyB3ZWxsIGFzIG1ldGhvZHNcbiAqIHRvIGluaXRpYWxpemUgYW5kIHN0YXJ0IHRoZSBhcHBsaWNhdGlvbi5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAbmFtZXNwYWNlXG4gKlxuICogQGV4YW1wbGVcbiAqIGltcG9ydCAqIGFzIHNvdW5kd29ya3MgZnJvbSAnc291bmR3b3Jrcy9jbGllbnQnO1xuICogaW1wb3J0IE15RXhwZXJpZW5jZSBmcm9tICcuL015RXhwZXJpZW5jZSc7XG4gKlxuICogc291bmR3b3Jrcy5jbGllbnQuaW5pdCgncGxheWVyJyk7XG4gKiBjb25zdCBteUV4cGVyaWVuY2UgPSBuZXcgTXlFeHBlcmllbmNlKCk7XG4gKiBzb3VuZHdvcmtzLmNsaWVudC5zdGFydCgpO1xuICovXG5jb25zdCBjbGllbnQgPSB7XG4gIC8qKlxuICAgKiBVbmlxdWUgaWQgb2YgdGhlIGNsaWVudCwgZ2VuZXJhdGVkIGFuZCByZXRyaWV2ZWQgYnkgdGhlIHNlcnZlci5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHV1aWQ6IG51bGwsXG5cbiAgLyoqXG4gICAqIFRoZSB0eXBlIG9mIHRoZSBjbGllbnQsIHRoaXMgY2FuIGdlbmVyYWxseSBiZSBjb25zaWRlcmVkIGFzIHRoZSByb2xlIG9mIHRoZVxuICAgKiBjbGllbnQgaW4gdGhlIGFwcGxpY2F0aW9uLiBUaGlzIHZhbHVlIGlzIGRlZmluZWQgaW4gdGhlXG4gICAqIFtgY2xpZW50LmluaXRgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuc2VydmVyfnNlcnZlckNvbmZpZ30gb2JqZWN0XG4gICAqIGFuZCBkZWZhdWx0cyB0byBgJ3BsYXllcidgLlxuICAgKlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgdHlwZTogbnVsbCxcblxuICAvKipcbiAgICogQ29uZmlndXJhdGlvbiBpbmZvcm1hdGlvbnMgZnJvbSB0aGUgc2VydmVyIGNvbmZpZ3VyYXRpb24gaWYgYW55LlxuICAgKlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuY2xpZW50fmluaXR9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5TaGFyZWRDb25maWd9XG4gICAqL1xuICBjb25maWc6IHt9LFxuXG4gIC8qKlxuICAgKiBJbmZvcm1hdGlvbiBhYm91dCB0aGUgY2xpZW50IHBsYXRmb3JtLiBUaGUgcHJvcGVydGllcyBhcmUgc2V0IGJ5IHRoZVxuICAgKiBbYHBsYXRmb3JtYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYXRmb3JtfSBzZXJ2aWNlLlxuICAgKlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gb3MgLSBPcGVyYXRpbmcgc3lzdGVtLlxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGlzTW9iaWxlIC0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGNsaWVudCBpcyBydW5uaW5nIG9uIGFcbiAgICogIG1vYmlsZSBwbGF0Zm9ybSBvciBub3QuXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBhdWRpb0ZpbGVFeHQgLSBBdWRpbyBmaWxlIGV4dGVuc2lvbiB0byB1c2UsIGRlcGVuZGluZyBvblxuICAgKiAgdGhlIHBsYXRmb3JtLlxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gaW50ZXJhY3Rpb24gLSBUeXBlIG9mIGludGVyYWN0aW9uIGFsbG93ZWQgYnkgdGhlXG4gICAqICB2aWV3cG9ydCwgYHRvdWNoYCBvciBgbW91c2VgXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGF0Zm9ybX1cbiAgICovXG4gIHBsYXRmb3JtOiB7XG4gICAgb3M6ICdyYXNwYmlhbicsXG4gIH0sXG5cbiAgLyoqXG4gICAqIERlZmluZXMgd2hldGhlciB0aGUgdXNlcidzIGRldmljZSBpcyBjb21wYXRpYmxlIHdpdGggdGhlIGFwcGxpY2F0aW9uXG4gICAqIHJlcXVpcmVtZW50cy5cbiAgICpcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGF0Zm9ybX1cbiAgICovXG4gIGNvbXBhdGlibGU6IG51bGwsXG5cbiAgLyoqXG4gICAqIEluZGV4IChpZiBhbnkpIGdpdmVuIGJ5IGEgW2BwbGFjZXJgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhY2VyfVxuICAgKiBvciBbYGNoZWNraW5gXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQ2hlY2tpbn0gc2VydmljZS5cbiAgICpcbiAgICogQHR5cGUge051bWJlcn1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNoZWNraW59XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGFjZXJ9XG4gICAqL1xuICBpbmRleDogbnVsbCxcblxuICAvKipcbiAgICogVGlja2V0IGxhYmVsIChpZiBhbnkpIGdpdmVuIGJ5IGEgW2BwbGFjZXJgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhY2VyfVxuICAgKiBvciBbYGNoZWNraW5gXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQ2hlY2tpbn0gc2VydmljZS5cbiAgICpcbiAgICogQHR5cGUge1N0cmluZ31cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNoZWNraW59XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGFjZXJ9XG4gICAqL1xuICBsYWJlbDogbnVsbCxcblxuICAvKipcbiAgICogQ2xpZW50IGNvb3JkaW5hdGVzIChpZiBhbnkpIGdpdmVuIGJ5IGFcbiAgICogW2Bsb2NhdG9yYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkxvY2F0b3J9LFxuICAgKiBbYHBsYWNlcmBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGFjZXJ9IG9yXG4gICAqIFtgY2hlY2tpbmBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DaGVja2lufSBzZXJ2aWNlLlxuICAgKiAoRm9ybWF0OiBgW3g6TnVtYmVyLCB5Ok51bWJlcl1gLilcbiAgICpcbiAgICogQHR5cGUge0FycmF5PE51bWJlcj59XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DaGVja2lufVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuTG9jYXRvcn1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYWNlcn1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50Lkdlb2xvY2F0aW9ufVxuICAgKi9cbiAgY29vcmRpbmF0ZXM6IG51bGwsXG5cbiAgLyoqXG4gICAqIEZ1bGwgYGdlb3Bvc2l0aW9uYCBvYmplY3QgYXMgcmV0dXJuZWQgYnkgYG5hdmlnYXRvci5nZW9sb2NhdGlvbmAsIHdoZW5cbiAgICogdXNpbmcgdGhlIGBnZW9sb2NhdGlvbmAgc2VydmljZS5cbiAgICpcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50Lkdlb2xvY2F0aW9ufVxuICAgKi9cbiAgZ2VvcG9zaXRpb246IG51bGwsXG5cbiAgLyoqXG4gICAqIFNvY2tldCBvYmplY3QgdGhhdCBoYW5kbGUgY29tbXVuaWNhdGlvbnMgd2l0aCB0aGUgc2VydmVyLCBpZiBhbnkuXG4gICAqIFRoaXMgb2JqZWN0IGlzIGF1dG9tYXRpY2FsbHkgY3JlYXRlZCBpZiB0aGUgZXhwZXJpZW5jZSByZXF1aXJlcyBhbnkgc2VydmljZVxuICAgKiBoYXZpbmcgYSBzZXJ2ZXItc2lkZSBjb3VudGVycGFydC5cbiAgICpcbiAgICogQHR5cGUge21vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5zb2NrZXR9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzb2NrZXQ6IHNvY2tldCxcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0aGUgYXBwbGljYXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbY2xpZW50VHlwZT0ncGxheWVyJ10gLSBUaGUgdHlwZSBvZiB0aGUgY2xpZW50LCBkZWZpbmVzIHRoZVxuICAgKiAgc29ja2V0IGNvbm5lY3Rpb24gbmFtZXNwYWNlLiBTaG91bGQgbWF0Y2ggYSBjbGllbnQgdHlwZSBkZWZpbmVkIHNlcnZlciBzaWRlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW2NvbmZpZz17fV1cbiAgICogQHBhcmFtIHtPYmplY3R9IFtjb25maWcuYXBwQ29udGFpbmVyPScjY29udGFpbmVyJ10gLSBBIGNzcyBzZWxlY3RvclxuICAgKiAgbWF0Y2hpbmcgYSBET00gZWxlbWVudCB3aGVyZSB0aGUgdmlld3Mgc2hvdWxkIGJlIGluc2VydGVkLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW2NvbmZpZy53ZWJzb2NrZXRzLnVybD0nJ10gLSBUaGUgdXJsIHdoZXJlIHRoZSBzb2NrZXQgc2hvdWxkXG4gICAqICBjb25uZWN0IF8odW5zdGFibGUpXy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtjb25maWcud2Vic29ja2V0cy50cmFuc3BvcnRzPVsnd2Vic29ja2V0J11dIC0gVGhlIHRyYW5zcG9ydFxuICAgKiAgdXNlZCB0byBjcmVhdGUgdGhlIHVybCAob3ZlcnJpZGVzIGRlZmF1bHQgc29ja2V0LmlvIG1lY2FuaXNtKSBfKHVuc3RhYmxlKV8uXG4gICAqL1xuICBpbml0KGNsaWVudFR5cGUgPSAndGhpbmcnLCBjb25maWcgPSB7fSkge1xuICAgIHRoaXMudHlwZSA9IGNsaWVudFR5cGU7XG5cbiAgICAvLyBpZiBzb2NrZXQgY29uZmlnIGdpdmVuLCBtaXggaXQgd2l0aCBkZWZhdWx0c1xuICAgIGNvbnN0IHdlYnNvY2tldHMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIHVybDogJycsXG4gICAgICB0cmFuc3BvcnRzOiBbJ3dlYnNvY2tldCddLFxuICAgICAgcGF0aDogJycsXG4gICAgfSwgY29uZmlnLndlYnNvY2tldHMpO1xuXG4gICAgLy8gbWl4IGFsbCBvdGhlciBjb25maWcgYW5kIG92ZXJyaWRlIHdpdGggZGVmaW5lZCBzb2NrZXQgY29uZmlnXG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLmNvbmZpZywgY29uZmlnLCB7IHdlYnNvY2tldHMgfSk7XG5cbiAgICBzZXJ2aWNlTWFuYWdlci5pbml0KCk7XG5cbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgZnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWQgd2hlbiBhIHNlcnZpY2UgaXMgaW5zdGFuY2lhdGVkLlxuICAgKlxuICAgKiBAcGFyYW0ge3NlcnZpY2VNYW5hZ2VyfnNlcnZpY2VJbnN0YW5jaWF0aW9uSG9va30gZnVuYyAtIEZ1bmN0aW9uIHRvXG4gICAqICByZWdpc3RlciBoYXMgYSBob29rIHRvIGJlIGV4ZWN1dGUgd2hlbiBhIHNlcnZpY2UgaXMgY3JlYXRlZC5cbiAgICovXG4gIC8qKlxuICAgKiBAY2FsbGJhY2sgc2VydmljZU1hbmFnZXJ+c2VydmljZUluc3RhbmNpYXRpb25Ib29rXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIGlkIG9mIHRoZSBpbnN0YW5jaWF0ZWQgc2VydmljZS5cbiAgICogQHBhcmFtIHtTZXJ2aWNlfSBpbnN0YW5jZSAtIGluc3RhbmNlIG9mIHRoZSBzZXJ2aWNlLlxuICAgKi9cbiAgc2V0U2VydmljZUluc3RhbmNpYXRpb25Ib29rKGZ1bmMpIHtcbiAgICBzZXJ2aWNlTWFuYWdlci5zZXRTZXJ2aWNlSW5zdGFuY2lhdGlvbkhvb2soZnVuYyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBhcHBsaWNhdGlvbi5cbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMuX2luaXRTb2NrZXQoKCkgPT4gc2VydmljZU1hbmFnZXIuc3RhcnQoKSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzZXJ2aWNlIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gSWRlbnRpZmllciBvZiB0aGUgc2VydmljZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPcHRpb25zIHRvIGNvbmZpZ3VyZSB0aGUgc2VydmljZS5cbiAgICovXG4gIHJlcXVpcmUoaWQsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gc2VydmljZU1hbmFnZXIucmVxdWlyZShpZCwgb3B0aW9ucyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgc29ja2V0IGNvbm5lY3Rpb24gYW5kIHBlcmZvcm0gaGFuZHNoYWtlIHdpdGggdGhlIHNlcnZlci5cbiAgICogQHRvZG8gLSByZWZhY3RvciBoYW5kc2hha2UuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfaW5pdFNvY2tldChjYWxsYmFjaykge1xuICAgIHNvY2tldC5pbml0KHRoaXMudHlwZSwgdGhpcy5jb25maWcud2Vic29ja2V0cyk7XG5cbiAgICAvLyBzZWU6IGh0dHA6Ly9zb2NrZXQuaW8vZG9jcy9jbGllbnQtYXBpLyNzb2NrZXRcbiAgICB0aGlzLnNvY2tldC5hZGRTdGF0ZUxpc3RlbmVyKGV2ZW50TmFtZSA9PiB7XG4gICAgICBzd2l0Y2ggKGV2ZW50TmFtZSkge1xuICAgICAgICBjYXNlICdjb25uZWN0JzpcbiAgICAgICAgICBjb25zdCBwYXlsb2FkID0geyB1cmxQYXJhbXM6IHRoaXMudXJsUGFyYW1zIH07XG5cbiAgICAgICAgICBpZiAodGhpcy5jb25maWcuZW52ICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ocGF5bG9hZCwge1xuICAgICAgICAgICAgICByZXF1aXJlZFNlcnZpY2VzOiBzZXJ2aWNlTWFuYWdlci5nZXRSZXF1aXJlZFNlcnZpY2VzKClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuc29ja2V0LnNlbmQoJ2hhbmRzaGFrZScsIHBheWxvYWQpO1xuXG4gICAgICAgICAgLy8gd2FpdCBmb3IgaGFuZHNoYWtlIHJlc3BvbnNlIHRvIG1hcmsgY2xpZW50IGFzIGByZWFkeWBcbiAgICAgICAgICB0aGlzLnNvY2tldC5yZWNlaXZlKCdjbGllbnQ6c3RhcnQnLCAodXVpZCkgPT4ge1xuICAgICAgICAgICAgdGhpcy51dWlkID0gdXVpZDtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB0aGlzLnNvY2tldC5yZWNlaXZlKCdjbGllbnQ6ZXJyb3InLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKGVyci50eXBlKSB7XG4gICAgICAgICAgICAgIGNhc2UgJ3NlcnZpY2VzJzpcbiAgICAgICAgICAgICAgICAvLyBjYW4gb25seSBhcHBlbmQgaWYgZW52ICE9PSAncHJvZHVjdGlvbidcbiAgICAgICAgICAgICAgICBjb25zdCBtc2cgPSBgXCIke2Vyci5kYXRhLmpvaW4oJywgJyl9XCIgcmVxdWlyZWQgY2xpZW50LXNpZGUgYnV0IG5vdCBzZXJ2ZXItc2lkZWA7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGllbnQ7XG4iXX0=