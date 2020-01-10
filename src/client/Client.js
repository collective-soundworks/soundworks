import ServiceManager from './ServiceManager';
import StateManager from './StateManager';
import Socket from './Socket';
import Service from './Service';

/**
 * Create a new client of *soundworks* application.
 * The `Client` is the main entry point to access *soundworks* components
 * such as `serviceManager` or `stateManager`. It is also responsible for
 * handling initialization lifecycle (e.g. communication,
 * initialization of services)
 *
 * @memberof @soundworks/core/client
 *
 * @example
 * import soundworks from '@soundworks/core/client';
 *
 * // create a new `soundworks.Client` instance
 * const client = new soundworks.Client();
 * // initialize the client (mainly connect and initialize WebSockets)
 * await client.init(config);
 * // create application specific experience
 * // must extends `soundworks.Experience`
 * const playerExperience = new PlayerExperience(client);
 * // start the client
 * await client.start();
 * // when everything is ready, start the experience
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
     * Unique session id of the client (incremeted positive number),
     * generated and retrieved by the server on start.
     * @type {Number}
     */
    this.id = null;

    /**
     * Unique session uuid of the client (uuidv4),
     * generated and retrieved by the server on start.
     * @type {String}
     */
    this.uuid = null;

    this.config = {};

    /**
     * Socket object that handle communications with the server, if any.
     * This object is automatically created if the experience requires any service
     * having a server-side counterpart.
     *
     * @type {module:soundworks/core/client.Socket}
     */
    this.socket = new Socket();

    /**
     * @todo - serviceManager
     *
     * @type {module:soundworks/core/client.ServiceManager}
     */
    this.serviceManager = new ServiceManager(this);

    /**
     * @todo - stateManager
     *
     * @type {module:soundworks/core/client.StateManager}
     */
    this.stateManager = null;
  }

  /**
   * @todo - init
   */
  async init(config) {
    if (!('clientType' in config)) {
      throw new Error('soundworks.init config object "must" define a `clientType`');
    }

    // handle config
    this.type = config.clientType;
    // @todo - review that to adapt to ws options
    const websockets = Object.assign({
      url: '',
      path: 'socket',
      // pingInterval: 5 * 1000,
    }, config.websockets);

    this.config = Object.assign({}, config, { websockets });

    // init communications
    await this.socket.init(this.type, this.config);

    return Promise.resolve();
  }

  /**
   * @todo - start
   */
  async start() {
    this._ready = new Promise((resolve, reject) => {
      const payload = {};

      if (this.config.env !== 'production') {
        Object.assign(payload, {
          requiredServices: Object.keys(this.serviceManager.getValues()),
        });
      }

      // wait for handshake response to mark client as `ready`
      this.socket.addListener('s:client:start', ({ id, uuid }) => {
        this.id = id;
        this.uuid = uuid;

        this.stateManager = new StateManager(this.id, this.socket);
        // everything is ready start service manager
        this.serviceManager.start().then(() => resolve());
      });

      this.socket.addListener('s:client:error', (err) => {
        switch (err.type) {
          case 'services':
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

  /**
   * @example
   * ```js
   * soundworks.registerService('user-defined-name', serviceFactory);
   * ```
   */
  registerService(name, factory = null, options = {}, dependencies = []) {
    const ctor = factory(Service);
    this.serviceManager.register(name, ctor, options, dependencies);
  }
};

export default Client;
