import Signal from './Signal';
import Activity from './Activity';
import serviceManager from './serviceManager';
import viewManager from './viewManager';
import socket from './socket';
import defaultTextContents from '../display/defaultTextContents';
import defaultTemplates from '../display/defaultTemplates';


const client = {
  /**
   * Client unique id, given by the server.
   * @type {Number}
   */
  uuid: null,

  /**
   * Client type.
   * The client type is speficied in the argument of the `init` method. For
   * instance, `'player'` is the client type you should be using by default.
   * @type {String}
   */
  type: null,

   /**
   * Socket.io wrapper used to communicate with the server, if any (see {@link socket}.
   * @type {object}
   * @private
   */
  socket: null,

  /**
   * Information about the client platform.
   * @type {Object}
   * @property {String} os Operating system.
   * @property {Boolean} isMobile Indicates whether the client is running on a
   * mobile platform or not.
   * @property {String} audioFileExt Audio file extension to use, depending on
   * the platform ()
   */
  platform: {
    os: null,
    isMobile: null,
    audioFileExt: '',
  },

  /**
   * Client coordinates (if any) given by a {@link Locator}, {@link Placer} or
   * {@link Checkin} module. (Format: `[x:Number, y:Number]`.)
   * @type {Array<Number>}
   */
  coordinates: null,

  /**
   * Ticket index (if any) given by a {@link Placer} or
   * {@link Checkin} module.
   * @type {Number}
   */
  index: null,

  /**
   * Ticket label (if any) given by a {@link Placer} or
   * {@link Checkin} module.
   * @type {String}
   */
  label: null,

  /**
   * Configuration informations retrieved from the server configuration by
   * the `SharedConfig` service.
   * @type {Object}
   */
  config: null,

  /**
   * Is set to `true` or `false` by the `Welcome` service and defines if the
   * client meets the requirements of the application. (Should be usefull when
   * the `Welcome` service is used without a view and activated manually)
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

    // 1. if socket config given, mix it with defaults.
    const socketIO = Object.assign({
      url: '',
      transports: ['websocket']
    }, config.socketIO);

    // 2. mix all other config and override with defined socket config.
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
   * Initialize templates for all
   */
  _initViews() {
    // initialize modules views with default texts and templates
    this.textContents = {};
    this.templates = {};

    const appName = this.config.appName || defaultTextContents.globals.appName;
    const textContents = Object.assign(defaultTextContents, { globals: { appName } });

    this.setViewContentDefinitions(textContents);
    this.setViewTemplateDefinitions(defaultTemplates);
    this.setAppContainer(this.config.appContainer);
  },

  /**
   * Extend application text contents with the given object.
   * @param {Object} contents - The text contents to propagate to modules.
   */
  setViewContentDefinitions(defs) {
    this.textContents = Object.assign(this.textContents, defs);
    Activity.setViewContentDefinitions(this.textContents);
  },

  /**
   * Extend application templates with the given object.
   * @param {Object} templates - The templates to propagate to modules.
   */
  setViewTemplateDefinitions(defs) {
    this.templates = Object.assign(this.templates, defs);
    Activity.setViewTemplateDefinitions(this.templates);
  },

  /**
   * Sets the default view container for all `ClientModule`s
   * @param {String|Element} el - DOM element (or css selector matching
   *  an existing element) to be used as the container of the application.
   */
  setAppContainer(el) {
    const $container = el instanceof Element ? el : document.querySelector(el);
    viewManager.setViewContainer($container);
  },

};

export default client;
