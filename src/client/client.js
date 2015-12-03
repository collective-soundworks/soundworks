import comm from './comm';
import io from 'socket.io-client';
import MobileDetect from 'mobile-detect';
import Module from './Module';


/**
 * The `client` object contains the basic methods and attributes of the client.
 * @type {Object}
 */
export default {

  /**
   * socket.io library client object, if any.
   * @type {Object}
   * @private
   */
  // io: null,

  /**
   * Socket used to communicate with the server, if any.
   * @type {Socket}
   * @private
   */
  // socket: null,

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
    isForbidden: false
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
   * Client index, given by the server.
   * @type {Number}
   */
  index: -1,

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
   * @param {String} [options.socketUrl] The URL of the WebSocket server.
   */
  init(clientType = 'player', options = {}) {
    // this.send = this.send.bind(this);
    // this.receive = this.receive.bind(this);
    // this.removeListener = this.removeListener.bind(this);

    this.type = clientType;

    // @todo harmonize io config with server
    options = Object.assign({
      io: true,
      debugIO: false,
      socketUrl: '',
      transports: ['websocket'],
    }, options);

    if (options.io !== false) {
      // initialize socket communications
      this.comm = comm.initialize(clientType, options);
      // wait for socket being ready to resolve this module
      this.ready = new Promise((resolve) => {
        this.comm.receive('client:start', (index) => {
          this.index = index;
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

    // --------------------------------------------------------------------
    // @note: move into Platform ? create a dedicated service ?
    // get informations about client
    const ua = window.navigator.userAgent
    const md = new MobileDetect(ua);
    this.platform.isMobile = (md.mobile() !== null); // true if phone or tablet
    this.platform.os = (() => {
      let os = md.os();

      if (os === 'AndroidOS') {
        return 'android';
      } else if (os === 'iOS') {
        return 'ios';
      } else {
        return 'other';
      }
    })();

    // audio file extention check
    const a = document.createElement('audio');
    // http://diveintohtml5.info/everything.html
    if (!!(a.canPlayType && a.canPlayType('audio/mpeg;'))) {
      this.platform.audioFileExt = '.mp3';
    } else if (!!(a.canPlayType && a.canPlayType('audio/ogg; codecs="vorbis"'))) {
      this.platform.audioFileExt = '.ogg';
    } else {
      this.platform.audioFileExt = '.wav';
    }
    // --------------------------------------------------------------------
  },

  /**
   * Start the module logic (*i.e.* the application).
   * @param {Function} startFun [todo]
   * @todo Clarify the param.
   * @return {Promise} The Promise return value.
   * @todo Clarify return value (promise).
   * @todo example
   */
  start(startFun) {
    let module = startFun; // be compatible with previous version

    if (typeof startFun === 'function') {
      module = startFun(Module.sequential, Module.parallel);
    }

    let promise = module.createPromise();
    this.ready.then(() => module.launch());

    return promise;
  },

  /**
   * The `serial` method returns a `Module` that starts the given `...modules` in series. After starting the first module (by calling its `start` method), the next module in the series is started (with its `start` method) when the last module called its `done` method. When the last module calls `done`, the returned serial module calls its own `done` method.
   *
   * **Note:** you can compound serial module sequences with parallel module combinations (*e.g.* `client.serial(module1, client.parallel(module2, module3), module4);`).
   * @deprecated Use the new API with the {@link start} method.
   * @param {...Module} ...modules The modules to run in serial.
   * @return {Promise} [description]
   * @todo Clarify return value
   * @todo Remove
   */
  // serial(...modules) {
  //   console.log('The function "client.serial" is deprecated. Please use the new API instead.');
  //   return Module.sequential(...modules);
  // },

  /**
   * The `Module` returned by the `parallel` method starts the given `...modules` in parallel (with their `start` methods), and calls its `done` method after all modules called their own `done` methods.
   *
   * **Note:** you can compound parallel module combinations with serial module sequences (*e.g.* `client.parallel(module1, client.serial(module2, module3), module4);`).
   *
   * **Note:** the `view` of a module is always full screen, so in the case where modules run in parallel, their `view`s are stacked on top of each other using the `z-index` CSS property.
   * We use the order of the `parallel` method's arguments to determine the order of the stack (*e.g.* in `client.parallel(module1, module2, module3)`, the `view` of `module1` is displayed on top of the `view` of `module2`, which is displayed on top of the `view` of `module3`).
   * @deprecated Use the new API with the {@link start} method.
   * @param {...Module} modules The modules to run in parallel.
   * @return {Promise} [description]
   * @todo Clarify return value
   * @todo Remove
   */
  // parallel(...modules) {
  //   console.log('The function "client.parallel" is deprecated. Please use the new API instead.');
  //   return Module.parallel(...modules);
  // },

  /**
   * Send a WebSocket message to the server.
   *
   * **Note:** on the server side, the server receives the message with the command {@link ServerClient#receive}.
   * @param {String} msg Name of the message to send.
   * @param {...*} args Arguments of the message (as many as needed, of any type).
   */
  // send(msg, ...args) {
  //   if (!this.com) { return; }
  //   this.com.send(msg, ...args);
  // },

  /**
   * Listen for a WebSocket message from the server and execute a callback
   * function.
   *
   * **Note:** on the server side, the server sends the message with the command
   * {@link server.send}`.
   * @param {String} msg Name of the received message.
   * @param {Function} callback Callback function executed when the message is
   * received.
   */
  // receive(msg, callback) {
  //   if (!this.com) { return; }
  //   this.com.receive(msg, callback);
  // },

  /**
   * Remove a WebSocket message listener (set with the method {@link
   * client.receive}).
   * @param {String} msg Name of the received message.
   * @param {Function} callback Callback function executed when the message is
   * received.
   */
  // removeListener(msg, callback) {
  //   if (!this.com) { return; }
  //   this.com.removeListener(msg, callback);
  // }
};

