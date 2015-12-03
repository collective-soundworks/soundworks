import ServerModule from './ServerModule';


/**
 * [server] Base class used to build a performance on the client side.
 *
 * Along with the classic {@link Performance#connect} and {@link Performance#disconnect} methods, the base class has two additional methods:
 * - {@link Performance#enter}: called when the client enters the performance (*i.e.* when the {@link src/client/Performance.js~Performance} on the client side calls its {@link src/client/Performance.js~Performance#start} method);
 * - {@link Performance#exit}: called when the client leaves the performance (*i.e.* when the {@link src/client/Performance.js~Performance} on the client side calls its {@link src/client/Performance.js~Performance#done} method, or if the client disconnected from the server).
 *
 * The base class also keeps track of the clients who are currently in the performance (*i.e.* who entered but not exited yet) in the array `this.clients`.
 *
 * (See also {@link src/client/ClientPerformance.js~ClientPerformance} on the client side.)
 */
export default class ServerPerformance extends ServerModule {
  /**
    * Creates an instance of the class.
    * @param {Object} [options={}] Options.
    * @param {string} [options.name='performance'] Name of the module.
   */
  constructor(options = {}) {
    super(options.name || 'performance');

    /**
     * List of the clients who are currently in the performance (*i.e.* who entered the performance and have not exited it yet).
     * @type {Client[]}
     */
    this.clients = [];
  }

  /**
   * Called when the client connects to the server.
   * @param {Client} client Connected client.
   */
  connect(client) {
    super.connect(client);

    // Listen for the `'performance:start'` socket message from the client.
    this.receive(client, 'start', () => {
      this.enter(client);
    });

    // Listen for the `'performance:done'` socket message from the client.
    this.receive(client, 'done', () => {
      this.exit(client);
    });
  }

  /**
   * Called when the client disconnects from the server.
   * @param {Client} client Disconnected client.
   */
  disconnect(client) {
    super.disconnect(client);

    // Call the `exit` method if the client previously entered the performance.
    if (client.modules[this.name].entered)
      this.exit(client);
  }

  /**
   * Called when the client starts the performance on the client side.
   * @param {Client} client Client who enters the performance.
   */
  enter(client) {
    // Add the client to the `this.clients` array.
    this.clients.push(client);

    // Set flag.
    client.modules[this.name].entered = true;
  }

  /**
   * Called when the client exits the performance on the client side (*i.e.* when the `done` method of the client side module is called, or when the client disconnects from the server).
   * @param {Client} client Client who exits the performance.
   */
  exit(client) {
    // Remove the client from the `this.clients` array.
    const index = this.clients.indexOf(client);
    if (index >= 0)
      this.clients.splice(index, 1);

    // Remove flag.
    client.modules[this.name].entered = false;
  }
}
