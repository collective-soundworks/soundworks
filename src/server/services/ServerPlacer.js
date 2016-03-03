import ServerActivity from '../core/ServerActivity';
import serverServiceManager from '../core/serverServiceManager';
import { getOpt } from '../../utils/helpers';

import server from '../core/server';

const SERVICE_ID = 'service:placer';
const maxCapacity = 9999;

/**
 * [server] Allow to select a place within a set of predefined positions (i.e. labels and/or coordinates).
 * This service consumme a setup as defined in the server configuration
 * (see {@link src/server/core/server.js~appConfig} for details).
 *
 * (See also {@link src/client/services/ClientPlacer.js~ClientPlacer} on the client side)
 */
class ServerPlacer extends ServerActivity {
  constructor() {
    super(SERVICE_ID);

    /**
     * @type {Object} defaults - Defaults options of the service
     * @attribute {String} [defaults.setupConfigItem='setup'] - The path to the server's setup
     *  configuration entry (see {@link src/server/core/server.js~appConfig} for details).
     */
    const defaults = {
      setupConfigItem: 'setup',
    };

    this.configure(defaults);
    this._sharedConfigService = this.require('shared-config');
  }

  /** @inheritdoc */
  start() {
    super.start();

    const setupConfigItem = this.options.setupConfigItem;

    /**
     * Setup defining dimensions and predefined positions (labels and/or coordinates).
     * @type {Object}
     */
    this.setup = this._sharedConfigService.get(setupConfigItem);

    if (!this.setup.maxClientsPerPosition)
      this.setup.maxClientsPerPosition = 1;

    /**
     * Maximum number of places.
     * @type {Number}
     */
    this.capacity = getOpt(this.setup.capacity, Infinity, 1);

    if (this.setup) {
      const setup = this.setup;
      const maxClientsPerPosition = setup.maxClientsPerPosition;
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

    // update config capacity with computed one
    this.setup.capacity = this.capacity;

    // add path to shared config requirements for all client type
    this.clientTypes.forEach((clientType) => {
      this._sharedConfigService.addItem(setupConfigItem, clientType);
    });
  }

  /**
   * Store the client in a given position.
   * @returns {Boolean} - `true` if succeed, `false` if not
   */
  _storeClientPosition(positionIndex, client) {
    if (!this.clients[positionIndex])
      this.clients[positionIndex] = [];

    const list = this.clients[positionIndex];

    if (list.length < this.setup.maxClientsPerPosition &&
        this.numClients < this.capacity
    ) {
      list.push(client);
      this.numClients += 1;

      // if last available place for this position, lock it
      if (list.length >= this.setup.maxClientsPerPosition)
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
      if (list.length < this.setup.maxClientsPerPosition) {
        const disabledIndex = this.disabledPositions.indexOf(positionIndex);

        if (disabledIndex !== -1)
          this.disabledPositions.splice(disabledIndex, 1);
      }

      this.numClients -= 1;
    }
  }

  /** @private */
  _onRequest(client) {
    return () => {
      const setupConfigItem = this.options.setupConfigItem;
      const disabledPositions = this.disabledPositions;
      // aknowledge
      if (this.numClients < this.setup.capacity)
        this.send(client, 'aknowlegde', setupConfigItem, disabledPositions);
      else
        this.send('reject', disabledPositions);
    }
  }

  /** @private */
  _onPosition(client) {
    return (index, label, coordinates) => {
      const success = this._storeClientPosition(index, client);

      if (success) {
        client.index = index;
        client.label = label;
        client.coordinates = coordinates;

        this.send(client, 'confirm', index, label, coordinates);
        // @todo - check if something more subtile than a broadcast can be done.
        this.broadcast(null, client, 'client-joined', this.disabledPositions);
      } else {
        this.send(client, 'reject', this.disabledPositions);
      }
    }
  }

  /** @inheritdoc */
  connect(client) {
    super.connect(client);

    this.receive(client, 'request', this._onRequest(client));
    this.receive(client, 'position', this._onPosition(client));
  }

  /** @inheritdoc */
  disconnect(client) {
    super.disconnect(client);

    this._removeClientPosition(client.index, client);
    // @todo - check if something more subtile than a broadcast can be done.
    this.broadcast(null, client, 'client-leaved', this.disabledPositions);
  }
}

serverServiceManager.register(SERVICE_ID, ServerPlacer);
