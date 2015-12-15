import ServerModule from './ServerModule';
import { getOpt } from '../utils/helpers';

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
   * @param {Object} [options.setup] Setup defining dimensions and predefined positions (labels and/or coordinates).
   * @param {String[]} [options.setup.width] Width of the setup.
   * @param {String[]} [options.setup.height] Height of the setup.
   * @param {String[]} [options.setup.background] Background (image) of the setup.
   * @param {String[]} [options.setup.labels] List of predefined labels.
   * @param {Array[]} [options.setup.coordinates] List of predefined coordinates given as an array `[x:Number, y:Number]`.
   * @param {Number} [options.capacity=Infinity] Maximum number of places (may limit or be limited by the number of labels and/or coordinates defined by the setup).
   */
  constructor(options = {}) {
    super(options.name || 'placer');

    /**
     * Setup defining dimensions and predefined positions (labels and/or coordinates).
     * @type {Object}
     */
    this.setup = options.setup;

    /**
     * Maximum number of places.
     * @type {Number}
     */
    this.capacity = getOpt(options.capacity, Infinity, 1);

    const setup = options.setup;

    if(setup) {
      const numLabels = setup.labels ? setup.labels.length : Infinity;
      const numCoordinates = setup.coordinates ? setup.coordinates.length : Infinity;
      const numPositions = Math.min(numLabels, numCoordinates);

      if(this.capacity > numPositions)
        this.capacity = numPositions;
    }

    if(this.capacity > maxCapacity)
      this.capacity = maxCapacity;

    /**
     * List of clients checked in with corresponing indices.
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
      const capacity = this.capacity;
      const setup = this.setup;
      let area = undefined;
      let labels = undefined;
      let coordinates = undefined;

      if (setup) {
        labels = setup.labels;

        if (mode === 'graphic') {
          coordinates = setup.coordinates;

          area = {
            width: setup.width,
            height: setup.height,
            background: setup.background,
          }
        }
      }

      this.send(client, 'setup', capacity, labels, coordinates, area);
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
