import serviceManager from '../../client/core/serviceManager';
import socket from '../../client/core/socket';

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
const client = {
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
    os: 'raspbian',
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
  socket: socket,

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
  init(clientType = 'thing', config = {}) {
    this.type = clientType;

    // if socket config given, mix it with defaults
    const websockets = Object.assign({
      url: '',
      transports: ['websocket'],
      path: '',
    }, config.websockets);

    // mix all other config and override with defined socket config
    Object.assign(this.config, config, { websockets });

    serviceManager.init();

    return Promise.resolve();
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
  setServiceInstanciationHook(func) {
    serviceManager.setServiceInstanciationHook(func);
  },

  /**
   * Start the application.
   */
  start() {
    this._initSocket(() => serviceManager.start());
  },

  /**
   * Returns a service configured with the given options.
   * @param {String} id - Identifier of the service.
   * @param {Object} options - Options to configure the service.
   */
  require(id, options) {
    return serviceManager.require(id, options);
  },

  /**
   * Initialize socket connection and perform handshake with the server.
   * @todo - refactor handshake.
   * @private
   */
  _initSocket(callback) {
    socket.init(this.type, this.config.websockets);

    // see: http://socket.io/docs/client-api/#socket
    this.socket.addStateListener(eventName => {
      switch (eventName) {
        case 'connect':
          const payload = { urlParams: this.urlParams };

          if (this.config.env !== 'production') {
            Object.assign(payload, {
              requiredServices: serviceManager.getRequiredServices()
            });
          }

          this.socket.send('handshake', payload);

          // wait for handshake response to mark client as `ready`
          this.socket.receive('client:start', (uuid) => {
            this.uuid = uuid;
            callback();
          });

          this.socket.receive('client:error', (err) => {
            switch (err.type) {
              case 'services':
                // can only append if env !== 'production'
                const msg = `"${err.data.join(', ')}" required client-side but not server-side`;
                throw new Error(msg);
                break;
            }
          });
          break;
      }
    });
  },
};

export default client;
