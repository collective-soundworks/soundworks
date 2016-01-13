import ClientModule from './ClientModule';
import comm from './comm';
import defaultTextContents from './display/defaultTextContents';
import defaultTemplates from './display/defaultTemplates';


/**
 * The `client` object contains the basic methods and attributes of the client.
 * @type {Object}
 */
export default {
  /**
   * Socket used to communicate with the server, if any.
   * @type {Socket}
   * @private
   */
  comm: null,

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
   * Client type.
   * The client type is speficied in the argument of the `init` method. For
   * instance, `'player'` is the client type you should be using by default.
   * @type {String}
   */
  type: null,

  /**
   * Promise resolved when the server sends a message indicating that the client
   * can start the first mdule.
   * @type {Promise}
   * @private
   */
  ready: null,

  /**
   * Client unique id, given by the server.
   * @type {Number}
   */
  uid: null,

  /**
   * Client coordinates (if any) given by a {@link Locator}, {@link Placer} or
   * {@link Checkin} module. (Format: `[x:Number, y:Number]`.)
   * @type {Number[]}
   */
  coordinates: null,

  /**
   * The `init` method sets the client type and initializes a WebSocket connection associated with the given type.
   * @param {String} [clientType = 'player'] The client type.
   * @todo clarify clientType.
   * @param {Object} [options = {}] The options to initialize a client
   * @param {Boolean} [options.io] By default, a Soundworks application has a client and a server side. For a standalone application (client side only), use `options.io = false`.
   * @todo use default value for options.io in the documentation?
   * @param {String} [optiondefaultTextContentss.socketUrl] The URL of the WebSocket server.
   */
  init(clientType = 'player', options = {}) {
    this.type = clientType;

    const socketIO = window.CONFIG.SOCKET_CONFIG; // shared by server (cf .ejs template)
    // @todo harmonize io config with server
    options = Object.assign({
      io: true,
      debugIO: false,
      socketUrl: socketIO ? socketIO.url : '',
      transports: socketIO ? socketIO.transports : ['websocket'],
      appContainer: '#container',
    }, options);

    // initialize modules views with default texts and templates
    this.textContents = {};
    this.templates = {};

    const textContents = Object.assign(defaultTextContents, {
      globals: { appName: window.CONFIG.APP_NAME }
    });

    this.setViewContentDefinitions(textContents);
    this.setViewTemplateDefinitions(defaultTemplates);
    this.setAppContainer(options.appContainer);

    if (options.io !== false) {
      // initialize socket communications
      this.comm = comm.initialize(clientType, options);
      // wait for socket being ready to resolve this module
      this.ready = new Promise((resolve) => {
        this.comm.receive('client:start', (uid) => {
          this.uid = uid;
          resolve();
        });
      });
    } else {
      this.ready = Promise.resolve(true);
    }

    // debug - http://socket.io/docs/logging-and-debugging/#available-debugging-scopes
    if (options.debugIO) {
      localStorage.debug = '*';
    }
  },

  /**
   * Start the module logic (*i.e.* the application).
   * @param {Function} startFun - [@todo Clarify the param]
   * @return {Promise} - The Promise return value [@todo Clarify the param].
   * @todo example
   */
  start(startFun) {
    let module = startFun; // facade in case of one module only

    if (typeof startFun === 'function') {
      module = startFun(ClientModule.sequential, ClientModule.parallel);
    }

    let promise = module.createPromise();
    this.ready.then(() => module.launch());

    return promise;
  },

  /**
   * Extend application text contents with the given object.
   * @param {Object} contents - The text contents to propagate to modules.
   */
  setViewContentDefinitions(defs) {
    this.textContents = Object.assign(this.textContents, defs);
    ClientModule.setViewContentDefinitions(this.textContents);
  },

  /**
   * Extend application templates with the given object.
   * @param {Object} templates - The templates to propagate to modules.
   */
  setViewTemplateDefinitions(defs) {
    this.templates = Object.assign(this.templates, defs);
    ClientModule.setViewTemplateDefinitions(this.templates);
  },

  /**
   * Sets the default view container for all `ClientModule`s
   * @param {String|Element} el - A DOM element or a css selector matching the element to use as a container.
   */
  setAppContainer(el) {
    const $container = el instanceof Element ? el : document.querySelector(el);
    ClientModule.setViewContainer($container);
  },

};

