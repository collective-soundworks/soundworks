import Service from '../core/Service';
import serviceManager from '../core/serviceManager';
import { Server } from 'uws';

const SERVICE_ID = 'service:raw-socket';


/**
 * Protocol defined in configuration is added to these two entry that manage
 * the handshake at the creation of the socket.
 * @private
 */
const baseProtocol = [
  { channel: 'service:handshake', type: 'Uint32' },
  { channel: 'service:handshake-ack', type: 'Uint8' },
];

/**
 * Counter that create tokens in order to match sockets and clients.
 * @private
 */
let counter = 0;

/**
 * Interface for the `raw-socket` service.
 *
 * This service creates an additionnal native socket with its binary type set
 * to `arraybuffer` and focused on performances.
 * It allows the transfert of `TypedArray` data wrapped with a minimal channel
 * mechanism (up to 256 channels).
 *
 * __*The service must be used with its [client-side counterpart]{@link module:soundworks/client.RawSocket}*__
 *
 * @memberof module:soundworks/server
 */
class RawSocket extends Service {
  constructor() {
    super(SERVICE_ID);

    const defaults = {
      configItem: 'rawSocket',
    };

    this.configure(defaults);

    this._port = null;
    this._protocol = null;
    this._channels = null;

    /**
     * Listeners for the incomming messages.
     *
     * @type {Map<client, Set<Function>>}
     * @name _listeners
     * @memberof module:soundworks/server.RawSocket
     * @instance
     * @private
     */
    this._listeners = new Map();

    this._tokenClientMap = new Map();
    this._clientSocketMap = new Map();
    this._socketClientMap = new Map();

    // retrieve service config + useHttps
    this._sharedConfig = this.require('shared-config');

    this._onConnection = this._onConnection.bind(this);
  }

  /** @private */
  start() {
    super.start();

    const configItem = this.options.configItem;
    const config = this._sharedConfig.get(configItem);

    this._port = config.port;
    this._protocol = baseProtocol.concat(config.protocol);
    this._channels = this._protocol.map((def) => def.channel);;
    // retrieve socket configuration
    this._wss = new Server({ port: this._port });
    this._wss.on('connection', this._onConnection);
  }

  /** @private */
  connect(client) {
    // send infos to create the socket to the client
    super.receive(client, 'request', () => {
      const token = counter += 1;
      this._tokenClientMap.set(token, client);

      super.send(client, 'infos', this._port, this._protocol, token);
    });
  }

  /** @private */
  _onConnection(socket) {
    socket.on('message', (buffer) => {
      const index = new Uint8Array(buffer)[0];

      if (!this._protocol[index])
        throw new Error('Invalid protocol index: ${index}');

      const { channel, type } = this._protocol[index];
      const viewCtor = global[`${type}Array`];
      const data = new viewCtor(buffer, viewCtor.BYTES_PER_ELEMENT);

      if (channel === 'service:handshake')
        this._pairClientSocket(socket, data[0]);
      else
        this._propagateEvent(socket, channel, data);
    });
  }

  /**
   * Associate the socket with the corresponding client according to the `token`
   *
   * @param {Socket} socket - Socket which receive the message.
   * @param {Number} token - Token to match the client associated to the socket.
   * @private
   */
  _pairClientSocket(socket, token) {
    const client = this._tokenClientMap.get(token);
    this._clientSocketMap.set(client, socket);
    this._socketClientMap.set(socket, client);
    this._tokenClientMap.delete(token);

    this.send(client, 'service:handshake-ack');
  }

  /**
   * Call all the registered listener associated to a client.
   *
   * @param {Socket} socket - Socket which received the message.
   * @param {String} channel - Channel of the message.
   * @param {TypedArray} data - Received data.
   * @private
   */
  _propagateEvent(socket, channel, data) {
    const client = this._socketClientMap.get(socket);
    const clientListeners = this._listeners.get(client);
    const callbacks = clientListeners[channel];

    callbacks.forEach((callback) => callback(data));
  }

  /**
   * Register a callback function on a specific channel.
   *
   * @param {client} client - Client to listen the message from.
   * @param {String} channel - Channel of the message.
   * @param {Function} callback - Callback function.
   */
  receive(client, channel, callback) {
    const listeners = this._listeners;

    if (!listeners.has(client))
      listeners.set(client, {});

    const clientListeners = listeners.get(client);

    if (!clientListeners[channel])
      clientListeners[channel] = new Set();

    clientListeners[channel].add(callback);
  }

  /**
   * Send data to a specific client, on a given channel.
   *
   * @param {client} client - Client to send the message to.
   * @param {String} channel - Channel of the message.
   * @param {TypedArray} data - Data.
   */
  send(client, channel, data) {
    const socket = this._clientSocketMap.get(client);
    const index = this._channels.indexOf(channel);

    if (index === -1)
      throw new Error(`Undefined channel "${channel}"`);

    const { type } = this._protocol[index];
    const viewCtor = global[`${type}Array`];
    const size = data ? 1 + data.length : 1;
    const view = new viewCtor(size);

    const channelView = new Uint8Array(viewCtor.BYTES_PER_ELEMENT);
    channelView[0] = index;
    // populate final buffer
    view.set(new viewCtor(channelView.buffer), 0);

    if (data)
      view.set(data, 1);

    socket.send(view.buffer);
  }

  /**
   * Broadcast data to several client at once.
   *
   * @param {String|Array} clientType - Type or types of client to send the
   *  message to.
   * @param {client} excludeClient - Client to exclude from the broadcast.
   * @param {String} channel - Channel of the message.
   * @param {TypedArray} data - Data.
   */
  broadcast(clientType, excludeClient, channel, data) {
    if (!Array.isArray(clientType))
      clientType = [clientType];

    for (let client of this._clientSocketMap.keys()) {
      if (clientType.indexOf(client.type) !== -1 && client !== excludeClient)
        this.send(client, channel, data);
    }
  }
}

serviceManager.register(SERVICE_ID, RawSocket);

export default RawSocket;
