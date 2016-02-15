import ServerActivity from '../core/ServerActivity';
import serverServiceManager from '../core/serverServiceManager';
import { getOpt } from '../../utils/helpers';

const SERVICE_ID = 'service:placer';
const maxCapacity = 9999;

/**
 * Allow to select a place within a set of predefined positions (i.e. labels and/or coordinates).
 *
 * (See also {@link src/client/services/ClientPlacer.js~ClientPlacer} on the client side.)
 */
class ServerPlacer extends ServerActivity {
  /**
   * Creates an instance of the class.
   *
   * @todo move this doc somewhere else.
   * @param {Object} [options.setup] Setup defining dimensions and predefined positions (labels and/or coordinates).
   * @param {String[]} [options.setup.width] Width of the setup.
   * @param {String[]} [options.setup.height] Height of the setup.
   * @param {String[]} [options.setup.background] Background (image) of the setup.
   * @param {String[]} [options.setup.labels] List of predefined labels.
   * @param {Array[]} [options.setup.coordinates] List of predefined coordinates given as an array `[x:Number, y:Number]`.
   * @param {Number} [options.capacity=Infinity] Maximum number of places (may limit or be limited by the number of labels and/or coordinates defined by the setup).
   */
  constructor() {
    super(SERVICE_ID);

    const defaults = {
      setup: {},
      capacity: maxCapacity,
      maxClientsPerPosition: 1,
    }

    this.configure(defaults);
  }

  start() {
    super.start();
    /**
     * Setup defining dimensions and predefined positions (labels and/or coordinates).
     * @type {Object}
     */
    this.setup = this.options.setup;

    /**
     * Maximum number of places.
     * @type {Number}
     */
    this.capacity = getOpt(this.options.capacity, Infinity, 1);

    if (this.setup) {
      const setup = this.setup;
      const maxClientsPerPosition = this.options.maxClientsPerPosition;
      const numLabels = setup.labels ? setup.labels.length : Infinity;
      const numCoordinates = setup.coordinates ? setup.coordinates.length : Infinity;
      const numPositions = Math.min(numLabels, numCoordinates) * maxClientsPerPosition;

      if (this.capacity > numPositions)
        this.capacity = numPositions;
    }

    if (this.capacity > maxCapacity)
      this.capacity = maxCapacity;

    /**
     * List of clients checked in with corresponing indices.
     * @type {Object<Number, Array>}
     */
    this.clients = {};

    /**
     * Number of connected clients.
     * @type {Number}
     */
    this.numClients = 0;

    /**
     * List of the indexes of the disabled positions.
     * @type {Array}
     */
    this.disabledPositions = [];
  }

  /**
   * Store the client in a given position.
   * @returns {Boolean} - `true` if succeed, `false` if not
   */
  _storeClientPosition(positionIndex, client) {
    if (!this.clients[positionIndex])
      this.clients[positionIndex] = [];

    const list = this.clients[positionIndex];

    if (list.length < this.options.maxClientsPerPosition &&
        this.numClients < this.capacity
    ) {
      list.push(client);
      this.numClients += 1;
      // if last available place for this position, lock it
      if (list.length >= this.options.maxClientsPerPosition)
        this.disabledPositions.push(positionIndex);

      return true;
    }

    return false;
  }

  /**
   * Remove the client from a given position.
   */
  _removeClientPosition(positionIndex, client) {
    const list = this.clients[positionIndex] || [];
    const clientIndex = list.indexOf(client);

    if (clientIndex !== -1) {
      list.splice(clientIndex, 1);
      // check if the list was marked as disabled
      if (list.length < this.options.maxClientsPerPosition) {
        const disabledIndex = this.disabledPositions.indexOf(positionIndex);

        if (disabledIndex !== -1)
          this.disabledPositions.splice(disabledIndex, 1);
      }

      this.numClients -= 1;
    }
  }

  _onRequest(client) {
    return () => {
      const capacity = this.capacity;
      const setup = this.setup;
      let area = undefined;
      let labels = undefined;
      let coordinates = undefined;

      if (setup) {
        labels = setup.labels;
        coordinates = setup.coordinates;
        area = {
          width: setup.width,
          height: setup.height,
          background: setup.background,
        }
      }

      if (this.numClients < capacity)
        this.send(client, 'setup', capacity, labels, coordinates, area, this.disabledPositions);
      else
        this.send('reject', this.disabledPositions);
    }
  }

  _onPosition(client) {
    return (index, label, coords) => {
      const success = this._storeClientPosition(index, client);

      if (success) {
        client.index = index;
        client.label = label;
        client.coordinates = coords;

        this.send(client, 'confirm');
        // @todo - check if something more subtile than a broadcast can be done
        this.broadcast(null, client, 'disable-index', index);
      } else {
        this.send(client, 'reject', this.disabledPositions);
      }
    }
  }

  /**
   * @private
   */
  connect(client) {
    super.connect(client);

    this.receive(client, 'request', this._onRequest(client));
    this.receive(client, 'position', this._onPosition(client));
  }

  /**
   * @private
   */
  disconnect(client) {
    super.disconnect(client);

    this._removeClientPosition(client.index, client);
    // @todo - check if something more subtile than a broadcast can be done
    this.broadcast(null, client, 'enable-index', client.index);
  }
}

serverServiceManager.register(SERVICE_ID, ServerPlacer);
