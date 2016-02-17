import ServerActivity from '../core/ServerActivity';
import { getOpt } from '../../utils/helpers';
import serverServiceManager from '../core/serverServiceManager';

const SERVICE_ID = 'service:checkin';

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
class ServerCheckin extends ServerActivity {
  /**
   * @param {Object} [options={}] Options.
   * @attribute {String} [defaults.setupPath='setup'] - The path to the server's setup
   *  configuration entry (see {@link src/server/core/server.js~appConfig} for details).
   * @param {Object} [options.order='ascending'] Order in which indices are assigned. Currently spported values are:
   * - `'ascending'`: indices are assigned in ascending order
   * - `'random'`: indices are assigned in random order
   */
  constructor() {
    super(SERVICE_ID);

    const defaults = {
      order: 'ascending',
      setupPath: 'setup',
    }

    this.configure(defaults);

    // use shared config service to share the setup
    this._sharedConfigService = this.require('shared-config');
  }

  start() {
    super.start();

    const setupPath = this.options.setupPath;
    const setupConfig = this._sharedConfigService.get(setupPath);

    /**
     * Setup defining predefined positions (labels and/or coordinates).
     * @type {Object}
     */
    this.setup = setupConfig && setupConfig[setupPath];

    /**
     * Maximum number of clients checked in (may limit or be limited by the number of predefined labels and/or coordinates).
     * @type {Number}
     */
    this.capacity = getOpt(this.setup.capacity, Infinity, 1);

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
    this.order = this.options; // 'ascending' | 'random'

    this._availableIndices = [];
    this._nextAscendingIndex = 0;

    const setup = this.options.setup;

    if (setup) {
      const numLabels = setup.labels ? setup.labels.length : Infinity;
      const numCoordinates = setup.coordinates ? setup.coordinates.length : Infinity;
      const numPositions = Math.min(numLabels, numCoordinates);

      if (this.capacity > numPositions)
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
    if (Number.isInteger(index))
      this._availableIndices.push(index);
  }

  _onRequest(client) {
    return () => {
      let index = -1;

      if (this.order === 'random')
        index = this._getRandomIndex();
      else // if (order === 'acsending')
        index = this._getAscendingIndex();

      client.index = index;

      if (index >= 0) {
        const setup = this.setup;
        let label;
        let coordinates;

        if (setup) {
          label = setup.labels ? setup.labels[index] : undefined;
          coordinates = setup.coordinates ? setup.coordinates[index] : undefined;

          client.label = label;
          client.coordinates = coordinates;
        }

        this.clients[index] = client;
        this.send(client, 'position', index, label, coordinates);
      } else {
        this.send(client, 'unavailable');
      }
    }
  }


  /** @inheritdoc */
  connect(client) {
    super.connect(client);

    this.receive(client, 'request', this._onRequest(client));
  }

  /** @inheritdoc */
  disconnect(client) {
    super.disconnect(client);

    const index = client.index;

    if (index >= 0) {
      delete this.clients[index];
      this._releaseIndex(index);
    }
  }
}

serverServiceManager.register(SERVICE_ID, ServerCheckin);

export default ServerCheckin;
