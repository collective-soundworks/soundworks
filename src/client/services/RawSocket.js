import SegmentedView from '../views/SegmentedView';
import Service from '../core/Service';
import serviceManager from '../core/serviceManager';

const SERVICE_ID = 'service:raw-socket';

/**
 * Interface for the `raw-socket` service.
 *
 * This service creates an additionnal native socket with its binary type set
 * to `arraybuffer` and focused on performances.
 * It allows the transfert of `TypedArray` data wrapped with a minimal channel
 * mechanism (up to 256 channels).
 *
 * __*The service must be used with its [server-side counterpart]{@link module:soundworks/server.RawSocket}*__
 *
 * @memberof module:soundworks/client
 */
class RawSocket extends Service {
  constructor() {
    super(SERVICE_ID);

    console.error('[deprecated] RawSocket service is deprecated and will be removed in soundworks#v3.0.0. Please update your application to use `client.socket.[sendBinary|receiveBinary]` instead');

    const defaults = {
      viewCtor: SegmentedView,
      viewPriority: 5,
    };

    this.configure(defaults);

    /**
     * Listeners for the incomming messages.
     *
     * @type {Object<String, Set<Function>>}
     * @name _listeners
     * @memberof module:soundworks/server.RawSocket
     * @instance
     * @private
     */
    this._listeners = {};

    this._protocol = null;
    this._onReceiveConnectionInfos = this._onReceiveConnectionInfos.bind(this);
    this._onReceiveAcknowledgement = this._onReceiveAcknowledgement.bind(this);
    this._onMessage = this._onMessage.bind(this);
  }

  /** @private */
  start() {
    super.start();
    this.show();

    super.send('request');
    super.receive('infos', this._onReceiveConnectionInfos);
  }

  /** @private */
  stop() {
    this.hide();
    super.stop();
  }

  /**
   * Method executed when the service receive connection informations from the
   * server.
   *
   * @param {Number} port - Port on which open the new socket.
   * @param {Object} protocol - User-defined protocol to be used in raw socket
   *  exchanges.
   * @param {Number} token - Unique token to retrieve in the first message to
   *  identy the client server-side, allow to match the socket with its
   *  corresponding client.
   *
   * @private
   */
  _onReceiveConnectionInfos(port, protocol, token) {
    this._protocol = protocol;
    this._channels = protocol.map((entry) => entry.channel);

    this.removeListener('connection-infos', this._onReceiveConnectionInfos);

    const socketProtocol = window.location.protocol.replace(/^http?/, 'ws');
    const socketHostname = window.location.hostname;
    const url = `${socketProtocol}//${socketHostname}:${port}`;

    this.socket = new WebSocket(url);
    this.socket.binaryType = 'arraybuffer';
    // send token back to the server and wait for acknoledgement
    const data = new Uint32Array(1);
    data[0] = token;

    this.socket.addEventListener('open', () => {
      this.send('service:handshake', data);
    });

    this.socket.addEventListener('message', this._onReceiveAcknowledgement);
  }

  /**
   * Callback executed when the server acknoledges the matching between a
   * client and a socket.
   *
   * @private
   */
  _onReceiveAcknowledgement(e) {
    const index = new Uint8Array(e.data)[0];
    const { channel, type } = this._protocol[index];

    // ignore incomming messages that could occur if
    // acknoledgement was not yet received
    if (channel === 'service:handshake-ack') {
      this.socket.removeEventListener('message', this._onReceiveAcknowledgement);
      this.socket.addEventListener('message', this._onMessage);
      this.ready();
    }
  }

  /**
   * Callback function of the socket `message` event. Unwrap the channel and
   * the data contained in the payload and execute the registered callback.
   *
   * @private
   */
  _onMessage(e) {
    const index = new Uint8Array(e.data)[0];

    if (!this._protocol[index])
      throw new Error(`Invalid protocol index: ${index}`);

    const { channel, type } = this._protocol[index];
    const viewCtor = window[`${type}Array`];
    const data = new viewCtor(e.data, viewCtor.BYTES_PER_ELEMENT);
    const callbacks = this._listeners[channel];

    if (callbacks)
      callbacks.forEach((callback) => callback(data));
  }

  /**
   * Register a callback to be executed when receiving a message on a specific
   * channel.
   *
   * @param {String} channel - Channel of the message.
   * @param {Function} callback - Callback function.
   */
  receive(channel, callback) {
    const listeners = this._listeners;

    if (!listeners[channel])
      listeners[channel] = new Set();

    listeners[channel].add(callback);
  }

  /**
   * Send data on a specific channel.
   *
   * @param {String} channel - Channel of the message.
   * @param {TypedArray} data - Data.
   */
  send(channel, data) {
    const index = this._channels.indexOf(channel);

    if (index === -1)
      throw new Error(`Undefined channel "${channel}"`);

    const { type } = this._protocol[index];
    const viewCtor = window[`${type}Array`];
    const size = data ? 1 + data.length : 1;
    const view = new viewCtor(size);

    const channelView = new Uint8Array(viewCtor.BYTES_PER_ELEMENT);
    channelView[0] = index;
    // populate buffer
    view.set(new viewCtor(channelView.buffer), 0);

    if (data)
      view.set(data, 1);

    this.socket.send(view.buffer);
  }
}

serviceManager.register(SERVICE_ID, RawSocket);

export default RawSocket;
