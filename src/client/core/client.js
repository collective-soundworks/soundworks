import Signal from './Signal';
import Activity from './Activity';
import serviceManager from './serviceManager';
import viewManager from './viewManager';
import socket from './socket';
import defaultViewContent from '../config/defaultContent';
import defaultViewTemplates from '../config/defaultTemplates';
import viewport from '../views/viewport';

/**
 * Client side entry point for a `soundworks` application. This object host general
 * informations about the user, as well as methods to initialize and start the
 * application.
 *
 * @memberof module:soundworks/client
 * @namespace
 *
 * @example
 * import {client} from 'soundworks/client';
 * client.init('player');
 * // instanciate your experience
 * client.start();
 */
const client = {
  /**
   * Unique id of the client, generated and retrieved by the server.
   * @type {Number}
   */
  uuid: null,

  /**
   * The type of the client, this can generally be considered as the role the
   * specific client has in the application. This value is speficied as an
   * argument of the {@link module:soundworks/client.client.init} method and defaults to
   * `'player'`.
   * @type {String}
   */
  type: null,

  /**
   * Socket object to handle communications with the server, if any.
   * This object is automatically created if the experience requires any service
   * having a server-side counterpart.
   * @type {object}
   * @private
   */
  socket: null,

  /**
   * Information about the client platform.
   * @type {Object}
   * @property {String} os - Operating system.
   * @property {Boolean} isMobile - Indicates whether the client is running on a
   *  mobile platform or not.
   * @property {String} audioFileExt - Audio file extension to use, depending on
   *  the platform.
   */
  platform: {
    os: null,
    isMobile: null,
    audioFileExt: '',
  },

  /**
   * Client coordinates (if any) given by a {@link Locator}, {@link Placer} or
   * {@link Checkin} service. (Format: `[x:Number, y:Number]`.)
   * @type {Array<Number>}
   */
  coordinates: null,

  /**
   * Ticket index (if any) given by a {@link Placer} or
   * {@link Checkin} service.
   * @type {Number}
   */
  index: null,

  /**
   * Ticket label (if any) given by a {@link Placer} or
   * {@link Checkin} service.
   * @type {String}
   */
  label: null,

  /**
   * Configuration informations retrieved from the server configuration
   * (@see `service:shared-config`).
   * @type {Object}
   */
  config: null,

  /**
   * Defines if the user's device is compatible with the application requirements
   * (see 'service:platfrom' and 'service:welcome').
   * @type {Boolean}
   */
  compatible: null,

  /**
   * Initialize the application.
   * @param {String} [clientType = 'player'] - The client type to define the socket namespace, should match a client type defined server side (if any).
   * @param {Object} [config={}] - The config to initialize a client
   * @param {Object} [config.socketIO.url=''] - The url where the socket should connect.
   * @param {Object} [config.socketIO.transports=['websocket']] - The transport used to create the url (overrides default socket.io mecanism).
   * @param {Object} [config.appContainer='#container'] - A selector matching a DOM element where the views should be inserted.
   * @param {Object} [config.debugIO=false] - If set to `true`, show socket.io debug informations.
   */
  init(clientType = 'player', config = {}) {
    this.type = clientType;

    // 1. if socket config given, mix it with defaults
    const socketIO = Object.assign({
      url: '',
      transports: ['websocket']
    }, config.socketIO);

    // 2. mix all other config and override with defined socket config
    this.config = Object.assign({
      debugIO: false,
      appContainer: '#container',
    }, config, { socketIO });

    serviceManager.init();
    this._initViews();
  },

  /**
   * Start the application.
   */
  start() {
    if (socket.required)
      this._initSocket();
    else
      serviceManager.start();
  },

  /**
   * Returns a service configured with the given options.
   * @param {String} id - The identifier of the service.
   * @param {Object} options - The options to configure the service.
   */
  require(id, options) {
    return serviceManager.require(id, options);
  },

  /**
   * @todo - refactor handshake.
   * Initialize socket connection and perform handshake with the server.
   * @private
   */
  _initSocket() {
    this.socket = socket.initialize(this.type, this.config.socketIO);
    // wait for handshake to mark client as `ready`
    this.socket.receive('client:start', (uuid) => {
      // don't handle server restart for now.
      this.uuid = uuid;
      serviceManager.start();

      // this.comm.receive('reconnect', () => console.info('reconnect'));
      // this.comm.receive('disconnect', () => {
      //   console.info('disconnect')
      //   serviceManager.reset(); // can relaunch serviceManager on reconnection.
      // });
      // this.comm.receive('error', (err) => console.error(err));
    });
  },

  /**
   * Initialize view templates for all
   * @private
   */
  _initViews() {
    viewport.init();
    // initialize views with default view content and templates
    this.viewContent = {};
    this.viewTemplates = {};

    const appName = this.config.appName || defaultViewContent.globals.appName;
    const viewContent = Object.assign(defaultViewContent, { globals: { appName } });

    this.setViewContentDefinitions(viewContent);
    this.setViewTemplateDefinitions(defaultViewTemplates);
    this.setAppContainer(this.config.appContainer);
  },

  /**
   * Extend application view contents with the given object.
   * @param {Object} content - The view content to propagate to activities.
   */
  setViewContentDefinitions(defs) {
    this.viewContent = Object.assign(this.viewContent, defs);
    Activity.setViewContentDefinitions(this.viewContent);
  },

  /**
   * Extend application view templates with the given object.
   * @param {Object} view templates - The view templates to propagate to activities.
   */
  setViewTemplateDefinitions(defs) {
    this.viewTemplates = Object.assign(this.viewTemplates, defs);
    Activity.setViewTemplateDefinitions(this.viewTemplates);
  },

  /**
   * Set the default container for all views.
   * @param {String|Element} el - DOM element (or css selector matching
   *  an existing element) to be used as the container of the application.
   */
  setAppContainer(el) {
    const $container = el instanceof Element ? el : document.querySelector(el);
    viewManager.setViewContainer($container);
  },

};

export default client;

