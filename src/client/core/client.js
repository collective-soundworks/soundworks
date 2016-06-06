import Signal from './Signal';
import Activity from './Activity';
import serviceManager from './serviceManager';
import viewManager from './viewManager';
import socket from './socket';
import defaultViewContent from '../config/defaultViewContent';
import defaultViewTemplates from '../config/defaultViewTemplates';
import viewport from '../views/viewport';

/**
 * Client side entry point for a `soundworks` application.
 *
 * This object host general informations about the user, as well as methods
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
   * client in the application. This value is defined as argument of the
   * [`client.init`]{@link module:soundworks/client.client.init} method and
   * defaults to `'player'`.
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
    audioFileExt: '',
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
  init(clientType = 'player', config = {}) {
    this.type = clientType;

    // retrieve
    this._parseUrlParams();
    // if socket config given, mix it with defaults
    const socketIO = Object.assign({
      url: '',
      transports: ['websocket']
    }, config.socketIO);

    // mix all other config and override with defined socket config
    this.config = Object.assign({
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
   * @param {String} id - Identifier of the service.
   * @param {Object} options - Options to configure the service.
   */
  require(id, options) {
    return serviceManager.require(id, options);
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
  _parseUrlParams() {
    // handle path name first
    let pathname = window.location.pathname;
    // sanitize
    pathname = pathname
      .replace(/^\//, '')                               // leading slash
      .replace(new RegExp('^' + this.type + '/?'), '')  // remove clientType
      .replace(/\/$/, '');                              // trailing slash

    if (pathname.length > 0)
      this.urlParams = pathname.split('/');
  },

  /**
   * Initialize socket connection and perform handshake with the server.
   * @todo - refactor handshake.
   * @private
   */
  _initSocket() {
    this.socket = socket.initialize(this.type, this.config.socketIO);

    // see: http://socket.io/docs/client-api/#socket
    this.socket.addStateListener((eventName) => {
      switch (eventName) {
        case 'connect':
          this.socket.send('handshake', { urlParams: this.urlParams });
          // wait for handshake to mark client as `ready`
          this.socket.receive('client:start', (uuid) => {
            // don't handle server restart for now.
            this.uuid = uuid;
            serviceManager.start();
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
   * Extend or override application view contents with the given object.
   * @param {Object} defs - Content to be used by activities.
   * @see {@link module:soundworks/client.setViewTemplateDefinitions}
   * @example
   * client.setViewTemplateDefinitions({
   *   'service:platform': { myValue: 'Welcome to the application' }
   * });
   */
  setViewContentDefinitions(defs) {
    this.viewContent = Object.assign(this.viewContent, defs);
    Activity.setViewContentDefinitions(this.viewContent);
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
  setViewTemplateDefinitions(defs) {
    this.viewTemplates = Object.assign(this.viewTemplates, defs);
    Activity.setViewTemplateDefinitions(this.viewTemplates);
  },

  /**
   * Set the DOM elemnt that will be the container for all views.
   * @private
   * @param {String|Element} el - DOM element (or css selector matching
   *  an existing element) to be used as the container of the application.
   */
  setAppContainer(el) {
    const $container = el instanceof Element ? el : document.querySelector(el);
    viewManager.setViewContainer($container);
  },

};

export default client;
