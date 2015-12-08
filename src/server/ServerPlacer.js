import ServerModule from './ServerModule';

const maxCapacity = 9999;

/**
 * [server] Allow to select a place within a set of predefined positions (i.e. labels and/or coordinates).
 *
 * (See also {@link src/client/ClientPlacer.js~ClientPlacer} on the client side.)
 */
export default class ServerPlacer extends ServerModule {
  /**
   * Creates an instance of the class.
   * @param {Object} [options={}] Options.
   * @param {Object} [options.name='placer'] Name of the module.
   * @param {String[]} [options.labels=null] List of predefined labels).
   * @param {Array[]} [options.coordinates=null] List of predefined coordinates given as [x:Number, y:Number].
   * @param {Number} [options.capacity=Infinity] Maximum number of places allowed (may be limited by the number of predefined labels and/or coordinates).
   */
  constructor(options) {
    super(options.name || 'placer');

    /**
     * List of predefined labels.
     * @type {String[]}
     */
    this.labels = options.labels;

    /**
     * List of predefined coordinates.
     * @type {Array[]}
     */
    this.coordinates = options.coordinates;

    /**
     * Maximum number of clients supported.
     * @type {Number}
     */
    this.capacity = options.capacity || maxCapacity;

    if(this.capacity > maxCapacity)
      this.capacity = maxCapacity;

    /**
     * List of the clients checked in with corresponing indices.
     * @type {Client[]}
     */
    this.clients = [];
  }

  /**
   * @private
   */
  connect(client) {
    super.connect(client);

    this.receive(client, 'request', (mode) => {
      let labels = this.labels;
      let coordinates = (mode === 'graphic')? this.coordinates: undefined;
      let capacity = this.capacity;
      this.send(client, 'acknowledge', labels, coordinates, capacity);
    });

    this.receive(client, 'position', (index, label, coords) => {
      client.modules[this.name].index = index;
      client.modules[this.name].label = label;
      client.coordinates = coords;

      this.clients[index] = client;
    });
  }

  /**
   * @private
   */
  disconnect(client) {
    super.disconnect(client);

    const index = client.modules[this.name].index;

    if (index >= 0)
      delete this.clients[index];
  }
}
