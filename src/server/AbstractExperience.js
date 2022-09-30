import debug from 'debug';

const log = debug('soundworks:lifecycle');

/**
 * Base class to extend in order to create the server-side counterpert of
 * a soundworks client.
 *
 * The user defined `Experience`s are the main components of a soundworks application.
 *
 * @memberof server
 */
class AbstractExperience {
  constructor(server, clientTypes = []) {
    // @todo - check that it's a soundworks instance
    if (!server) {
      throw new Error(`${this.constructor.name} should receive the "Server" instance as first argument`);
    }

    if (clientTypes === null) {
      throw new Error('Invalid client types');
    }

    this.server = server;

    /**
     * List of connected clients
     * @instance
     * @type {Client[]}
     */
    this.clients = new Set();

    /**
     * List of client types associated with this server-side experience.
     */
    clientTypes = Array.isArray(clientTypes) ? clientTypes : [clientTypes];
    this.clientTypes = new Set(clientTypes);

    // register in the server
    this.server.activities.add(this);
  }

  /**
   * Require a registered plugin, all client types associated to the experience
   * will also be associated to the required plugin. Requiring a plugin should
   * always be done between `soundworks.init` and `soundworks.start`.
   * In most case this method is called in the constructor the Experience.
   *
   * @param {String} name - Name of the registered plugin
   */
  require(name) {
    return this.server.pluginManager.get(name, this);
  }

  start() {
    log(`> experience "${this.constructor.name}" start`);
  }

  /**
   * Called when the client connects to the server.
   * @param {Client} client Connected client.
   * @private
   */
  connect(client) {
    const nodeId = client.id;
    const transport = {
      emit: client.socket.send.bind(client.socket),
      addListener: client.socket.addListener.bind(client.socket),
      // removeListener: client.socket.removeListener.bind(client.socket),
      removeAllListeners: client.socket.removeAllListeners.bind(client.socket),
    };

    this.server.stateManager.addClient(nodeId, transport);
    // listen for the `'enter' socket message from the client, the message is
    // sent when the client `enters` the Experience client side, i.e. when all
    // required plugins are ready
    return new Promise(() => {
      client.socket.addListener('s:exp:enter', () => {
        this.clients.add(client);
        this.enter(client);
      });
    });
  }

  /**
   * Called when the client disconnects from the server.
   * @param {Client} client Disconnected client.
   * @private
   */
  disconnect(client) {
    const nodeId = client.id;
    this.server.stateManager.removeClient(nodeId);
    // only call exit if the client has fully entered
    // (i.e. has finished the its initialization phase)
    if (this.clients.has(client)) {
      this.clients.delete(client);
      this.exit(client);
    }
  }

  /**
   * Called when the client started the client
   */
  enter(client) {
    log(`> [client ${client.id}] enter experience "${this.constructor.name}"`);
  }

  exit(client) {
    log(`> [client ${client.id}] exit experience "${this.constructor.name}"`);
  }
}

export default AbstractExperience;
