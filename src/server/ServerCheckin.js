import ServerModule from './ServerModule';
import { getOpt } from '../utils/helpers';

/**
 * Assign places among a set of predefined positions (i.e. labels and/or coordinates).
 *
 * The module assigns a position to a client upon request of the client-side module.
 *
 * (See also {@link src/client/ClientCheckin.js~ClientCheckin} on the client side.)
 *
 * @example
 * const checkin = new ServerCheckin({ capacity: 100, order: 'random' });
 */
export default class ServerCheckin extends ServerModule {
  /**
   * @param {Object} [options={}] Options.
   * @param {Object} [options.name='checkin'] Name of the module.
   * @param {Object} [options.setup] Setup defining predefined positions (labels and/or coordinates).
   * @param {String[]} [options.setup.labels] List of predefined labels.
   * @param {Array[]} [options.setup.coordinates] List of predefined coordinates given as an array `[x:Number, y:Number]`.
   * @param {Number} [options.capacity=Infinity] Maximum number of places (may limit or be limited by the number of labels and/or coordinates defined by the setup).
   * @param {Object} [options.order='ascending'] Order in which indices are assigned. Currently spported values are:
   * - `'ascending'`: indices are assigned in ascending order
   * - `'random'`: indices are assigned in random order
   */
  constructor(options = {}) {
    super(options.name || 'checkin');

    /**
     * Setup defining predefined positions (labels and/or coordinates).
     * @type {Object}
     */
    this.setup = options.setup;

    /**
     * Maximum number of clients checked in (may limit or be limited by the number of predefined labels and/or coordinates).
     * @type {Number}
     */
    this.capacity = getOpt(options.capacity, Infinity, 1);

    /**
     * List of the clients checked in with corresponing indices.
     * @type {Client[]}
     */
    this.clients = [];

    /**
     * Order in which indices are assigned. Currently supported values are:
     * - `'ascending'`: assigns indices in ascending order;
     * - `'random'`: assigns indices in random order.
     * @type {[type]}
     */
    this.order = options.order || 'ascending'; // 'ascending' | 'random'

    this._availableIndices = [];
    this._nextAscendingIndex = 0;

    const setup = options.setup;

    if(setup) {
      const numLabels = setup.labels ? setup.labels.length : Infinity;
      const numCoordinates = setup.coordinates ? setup.coordinates.length : Infinity;
      const numPositions = Math.min(numLabels, numCoordinates);

      if(this.capacity > numPositions)
        this.capacity = numPositions;
    }

    if (this.capacity === Infinity)
      this.order = 'ascending';
    else if (this.order === 'random') {
      this._nextAscendingIndex = this.capacity;

      for (let i = 0; i < this.capacity; i++)
        this._availableIndices.push(i);
    }
  }

  _getRandomIndex() {
    const numAvailable = this._availableIndices.length;

    if (numAvailable > 0) {
      const random = Math.floor(Math.random() * numAvailable);
      return this._availableIndices.splice(random, 1)[0];
    }

    return -1;
  }

  _getAscendingIndex() {
    if (this._availableIndices.length > 0) {
      this._availableIndices.sort(function(a, b) {
        return a - b;
      });

      return this._availableIndices.splice(0, 1)[0];
    } else if (this._nextAscendingIndex < this.capacity) {
      return this._nextAscendingIndex++;
    }

    return -1;
  }

  _releaseIndex(index) {
    this._availableIndices.push(index);
  }

  _onRequest(client) {
    return () => {
      let index = -1;

      if (this.order === 'random')
        index = this._getRandomIndex();
      else // if (order === 'acsending')
        index = this._getAscendingIndex();

      client.modules[this.name].index = index;

      if (index >= 0) {
        const setup = this.setup;
        let label;
        let coordinates;

        if (setup) {
          label = setup.labels ? setup.labels[index] : undefined;
          coordinates = setup.coordinates ? setup.coordinates[index] : undefined;

          client.modules[this.name].label = label;
          client.coordinates = coordinates;
        }

        this.clients[index] = client;
        this.send(client, 'position', index, label, coordinates);
      } else {
        this.send(client, 'unavailable');
      }
    }
  }

  _onRestart(client) {
    return (index, label, coordinates) => {
      // TODO: check if that's ok on random mode
      if (index > this._nextAscendingIndex) {
        for (let i = this._nextAscendingIndex; i < index; i++)
          this._availableIndices.push(i);

        this._nextAscendingIndex = index + 1;
      } else if (index === this._nextAscendingIndex) {
        this._nextAscendingIndex++;
      } else {
        let i = this._availableIndices.indexOf(index);

        if (i >= 0)
          this._availableIndices.splice(i, 1);
      }

      client.modules[this.name].index = index;
      this.clients[index] = client;

      if (label !== null)
        client.modules[this.name].label = label;

      if(coordinates !== null)
        client.coordinates = coordinates;
    }
  }

  /**
   * @private
   */
  connect(client) {
    super.connect(client);

    this.receive(client, 'request', this._onRequest(client));
    this.receive(client, 'restart', this._onRestart(client));
  }

  /**
   * @private
   */
  disconnect(client) {
    super.disconnect(client);

    const index = client.modules[this.name].index;

    if (index >= 0) {
      delete this.clients[index];
      this._releaseIndex(index);
    }
  }
}
