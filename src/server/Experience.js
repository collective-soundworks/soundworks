import Activity from './Activity';
import serviceManager from './serviceManager';
import debug from 'debug';

const log = debug('soundworks:lifecycle');

/**
 * @todo
 *
 *
 */
class Experience extends Activity {
  constructor(soundworks, clientTypes) {
    super();

    // @todo - check that it's a soundworks instance
    if (!soundworks) {
      throw new Error('Experience should receive `soundworks` instance as first argument');
    }

    this.soundworks = soundworks;

    /**
     * List of the clients who are currently in the performance.
     * @type {Client[]}
     */
    this.clients = new Set();

    /**
     * List of client types associated with this server-side experience.
     */
    clientTypes = Array.isArray(clientTypes) ? clientTypes : [clientTypes];
    this.clientTypes = new Set(clientTypes);
  }

  /**
   * Require a registered service, all client types associated to the experience
   * will also be associated to the required service. Requiring a service should
   * always be done between `soundworks.init` and `soundworks.start`.
   * In most case this method is called in the constructor the Experience.
   *
   * @param {String} name - Name of the service as given when registered
   */
  require(name) {
    return this.soundworks.serviceManager.get(name, this);
  }

  start() {
    log(`> experience "${this.constructor.name}" start`);
    super.start();
  }

  /**
   * Called when the client connects to the server.
   * @param {Client} client Connected client.
   * @private
   */
  connect(client) {
    super.connect(client);
    // log(`+ private + experience "${this.constructor.name}" connect: client ${client.id}`);

    this.soundworks.stateManager.addClient(client);
    // listen for the `'enter' socket message from the client, the message is
    // sent when the client `enters` the Experience client side, i.e. when all
    // required services are ready
    return new Promise((resolve, reject) => {
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
    super.disconnect(client);
    // log(`+ private + experience "${this.constructor.name}" disconnect: client ${client.id}`);

    // only call exit if the client has fully entered
    // (i.e. has finished the its initialization phase)
    if (this.clients.has(client)) {
      this.clients.delete(client);
      this.exit(client);
    }

    this.soundworks.stateManager.removeClient(client);
  }

  /**
   * Called when the client started the client
   */
  enter(client) {
    log(`> [client ${client.id}] enter service experience "${this.constructor.name}"`);
  }

  exit(client) {
    log(`> [client ${client.id}] exit service experience "${this.constructor.name}"`);
  }
}

export default Experience;
