import PluginManager from './PluginManager.js';
import SharedStateManagerClient from '../common/SharedStateManagerClient.js';
import Socket from './Socket.js';

/**
 * Create a new client of a *soundworks* application.
 *
 * The `Client` is the main entry point to access *soundworks* components
 * such as {@link client.Socket}, {@link client.PluginManager} or
 * {@link client.SharedStateManagerClient}. It is also responsible for the
 * initialization lifecycle.
 *
 * @memberof client
 *
 * @example
 * import soundworks from '@soundworks/core/client';
 *
 * // create a new `soundworks.Client` instance
 * const client = new soundworks.Client();
 * // initialize the client (mainly connect and initialize WebSockets)
 * await client.init(config);
 * // create application specific experience (extends `client.AbstractExperience`
 * const playerExperience = new PlayerExperience(client);
 * // start the client
 * await client.start();
 * // when everything is ready, the experience can be safely started
 * playerExperience.start();
 */
class Client {
  constructor() {
    /**
     * Type of the client, this can generally be considered as the role of the
     * client in the application.
     * @type {String}
     */
    this.type = null;

    /**
     * Session id of the client (incremeted positive number),
     * generated and retrieved by the server on start.
     * The counter is reset when the server restarts.
     * @type {Number}
     */
    this.id = null;

    /**
     * Unique session uuid of the client (uuidv4), generated and retrieved by
     * the server on start.
     * @type {String}
     */
    this.uuid = null;

    /**
     * Configuration object, typically contains the configuration sent by the
     * server (cf. {@link server.Server#init}).
     * @see {@link server.Server#init}.
     * @type {Object}
     */
    this.config = {};

    /**
     * Instance of the `Socket` class that handle communications with the server.
     * @see {@link client.Socket}
     * @type {client.Socket}
     */
    this.socket = new Socket();

    /**
     * Instance of the `PluginManager` class.
     * @see {@link client.PluginManager}
     * @type {client.PluginManager}
     */
    this.pluginManager = new PluginManager(this);

    /**
     * Instance of the `SharedStateManagerClient` class.
     * @see {@link client.SharedStateManagerClient}
     * @type {client.SharedStateManagerClient}
     */
    this.stateManager = null;
  }

  /**
   * Method to be called before {@link client.Client#start} in the
   * initialization lifecycle of the soundworks client.
   *
   * Basically waits for the socket to be connected.
   * @see {@link server.Server#init}
   *
   * @param {Object} config - Configuration object (cf. {@link server.Server#init})
   */
  async init(config) {
    if (!(Object.prototype.toString.call(config) === '[object Object]')) {
      throw new Error('[soundworks.init] must receive a config object as argument`');
    }

    if (!('clientType' in config)) {
      throw new Error('[soundworks.init] config object "must" define a `clientType`');
    }

    // handle config
    this.type = config.clientType;
    this.config = config;
    // @todo - review that to adapt to ws options
    this.config.env.websockets = Object.assign({
      // url: '',
      path: 'socket',
      // pingInterval: 5 * 1000,
    }, config.env.websockets);

    // init socket communications (string and binary)
    await this.socket.init(this.type, this.config);

    return Promise.resolve();
  }

  /**
   * Method to be called when {@link client.Client#init} has finished in the
   * initialization lifecycle of the soundworks client.
   *
   * Initilialize the {@link client.SharedStateManagerClient} and all required
   * plugins. When done, the {@link client.AbstractExperience#start} method
   * should be consider as being safely called.
   *
   * @see {@link server.Server#start}
   */
  async start() {
    this._ready = new Promise((resolve, reject) => {
      const payload = {};

      if (this.config.env !== 'production') {
        Object.assign(payload, {
          requiredPlugins: Object.keys(this.pluginManager.getValues()),
        });
      }

      // wait for handshake response to mark client as `ready`
      this.socket.addListener('s:client:start', ({ id, uuid }) => {
        this.id = id;
        this.uuid = uuid;

        // mimic eventEmitter API
        const transport = {
          emit: this.socket.send.bind(this.socket),
          addListener: this.socket.addListener.bind(this.socket),
          // removeListener: this.socket.removeListener.bind(this.socket),
          removeAllListeners: this.socket.removeAllListeners.bind(this.socket),
        };

        this.stateManager = new SharedStateManagerClient(this.id, transport);
        // everything is ready start plugin manager
        this.pluginManager.start().then(() => resolve());
      });

      this.socket.addListener('s:client:error', (err) => {
        switch (err.type) {
          case 'plugins':
            // can only append if env !== 'production'
            const msg = `"${err.data.join(', ')}" required client-side but not server-side`;
            throw new Error(msg);
            break;
        }

        reject();
      });

      this.socket.send('s:client:handshake', payload);
    });

    return this._ready;
  }
};

export default Client;
