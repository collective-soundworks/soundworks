import Service from '../core/Service';
import { getOpt } from '../../utils/helpers';
import serviceManager from '../core/serviceManager';

const SERVICE_ID = 'service:checkin';


/**
 * Interface of the server `'checkin'` service.
 *
 * This service is one of the provided services aimed at identifying clients inside
 * the experience along with the [`'locator'`]{@link module:soundworks/server.Locator}
 * and [`'placer'`]{@link module:soundworks/server.Placer} services.
 *
 * The `'checkin'` service is the more simple among these services as the server
 * simply assign a ticket to the client among the available ones. The ticket can
 * optionnaly be associated with coordinates or label according to the server
 * `setup` configuration.
 *
 * __*The service must be used with its [client-side counterpart]{@link module:soundworks/client.Checkin}*__
 *
 * @see {@link module:soundworks/server.Locator}
 * @see {@link module:soundworks/server.Placer}
 *
 * @param {Object} options
 * @param {Boolean}  [options.order='ascending'] - The order in which indices
 * are assigned. Currently supported values are:
 * - `'ascending'`: indices are assigned in ascending order
 * - `'random'`: indices are assigned in random order
 *
 * @memberof module:soundworks/server
 * @example
 * // inside the experience constructor
 * this.checkin = this.require('checkin');
 */
class Checkin extends Service {
  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  constructor() {
    super(SERVICE_ID);

    const defaults = {
      configItem: 'setup',
    }

    this.configure(defaults);
    // use shared config service to share the setup
    this._sharedConfig = this.require('shared-config');
  }

  /** @private */
  start() {
    super.start();

    /**
     * Setup retrieved from server configuration.
     * @type {Object}
     */
    this.setup = this._sharedConfig.get(this.options.configItem);

    /**
     * Maximum number of clients checked in (may limit or be limited by the
     * number of predefined labels and/or coordinates).
     * @type {Number}
     */
    this.capacity = getOpt(this.setup.capacity, Infinity, 1);

    /**
     * List of the clients checked in at their corresponding indices.
     * @type {Client[]}
     */
    this.clients = [];

    /** @private */
    this._availableIndices = []; // array of available indices
    this._nextAscendingIndex = 0; // next index when _availableIndices is empty

    const setup = this.options.setup;

    if (setup) {
      const numLabels = setup.labels ? setup.labels.length : Infinity;
      const numCoordinates = setup.coordinates ? setup.coordinates.length : Infinity;
      const numPositions = Math.min(numLabels, numCoordinates);

      if (this.capacity > numPositions)
        this.capacity = numPositions;
    }
  }

  /** @private */
  _getRandomIndex() {
    for (let i = this._nextAscendingIndex; i < this.capacity; i++)
      this._availableIndices.push(i);

    this._nextAscendingIndex = this.capacity;
    const numAvailable = this._availableIndices.length;

    if (numAvailable > 0) {
      const random = Math.floor(Math.random() * numAvailable);
      return this._availableIndices.splice(random, 1)[0];
    }

    return -1;
  }

  /** @private */
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

  /** @private */
  _releaseIndex(index) {
    if (Number.isInteger(index))
      this._availableIndices.push(index);
  }

  /** @private */
  _onRequest(client) {
    return (order) => {
      let index = -1;

      if (order === 'random' && this.capacity !== Infinity)
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

  /** @private */
  connect(client) {
    super.connect(client);

    this.receive(client, 'request', this._onRequest(client));
  }

  /** @private */
  disconnect(client) {
    super.disconnect(client);

    const index = client.index;

    if (index >= 0) {
      delete this.clients[index];
      this._releaseIndex(index);
    }
  }
}

serviceManager.register(SERVICE_ID, Checkin);

export default Checkin;
