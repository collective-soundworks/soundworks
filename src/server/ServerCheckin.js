import ServerModule from './ServerModule';

const maxRandomCapacity = 9999;

/**
 * [server] Assign places among a set of predefined positions (i.e. labels and/or coordinates).
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
   * @param {String[]} [options.labels=null] List of predefined labels).
   * @param {Array[]} [options.coordinates=null] List of predefined coordinates given as an array `[x:Number, y:Number]`.
   * @param {Number} [options.capacity=Infinity] Maximum number of checkins allowed (may be limited by the number of predefined labels and/or coordinates).
   * @param {Object} [options.order='ascending'] Order in which indices are assigned. Currently spported values are:
   * - `'ascending'`: indices are assigned in ascending order;
   * - `'random'`: indices are assigned in random order.
   */
  constructor(options = {}) {
    super(options.name || 'checkin');

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
     * Maximum number of clients allowed.
     * @type {Number}
     */
    this.capacity = options.capacity || Infinity;

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

    let numLabels = labels? labels.length: Infinity;
    let numCoordinates = coordinates? coordinates.length: Infinity;
    let numPositions = Math.min(numLabels, numCoordinates);

    if(this.capacity > numPositions)
      this.capacity = numPositions;

    if (this.capacity > Number.MAX_SAFE_INTEGER)
      this.capacity = Number.MAX_SAFE_INTEGER;

    if (this.capacity > maxRandomCapacity)
      this.order = 'ascending';
    else if (this.order === 'random') {
      this._nextAscendingIndex = this.capacity;

    for (let i = 0; i < this.capacity; i++)
      this._availableIndices.push(i);
  }

  _getRandomIndex() {
    const numAvailable = this._availableIndices.length;

    if (numAvailable > 0) {
      let random = Math.floor(Math.random() * numAvailable);
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

      if (index >= 0) {
        const label = this.labels[index];
        const coordinates = this.coordinates[index];

        client.modules[this.name].index = index;
        client.modules[this.name].label = label;
        client.coordinates = coordinates;

        this.clients[index] = client;

        this.send(client, 'acknowledge', index, label, coordinates);
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
