import WebSocket from 'isomorphic-ws';

import {
  packBinaryMessage,
  unpackBinaryMessage,
  packStringMessage,
  unpackStringMessage,
} from '../common/sockets-utils.js';
import logger from '../common/logger.js';
import { isBrowser } from '../common/utils.js';

// close
//   Fired when a connection with a websocket is closed.
//   Also available via the onclose property
// error
//   Fired when a connection with a websocket has been closed because of an error, such as whensome data couldn't be sent.
//   Also available via the onerror property.
// message
//   Fired when data is received through a websocket.
//   Also available via the onmessage property.
// open
//   Fired when a connection with a websocket is opened.
//   Also available via the onopen property.

// @todo - use isomorphic ws ? (does seems like a perfect idea)

/**
 * Simple wrapper with simple pubsub system built on top of `ws` socket.
 * The abstraction actually open two different sockets:
 * - one configured for string (JSON compatible) messages
 * - one configured with `binaryType=arraybuffer` for streaming data more
 *   efficiently.
 * The sockets also re-emits all "native" ws events.
 *
 * An instance of `Socket` is automatically created by the `soundworks.Client`.
 * @see {@link client.Client#socket}
 *
 * @see https://github.com/websockets/ws
 *
 * @memberof client
 */
class Socket {
  constructor() {
    /**
     * WebSocket instance (string protocol - binaryType = 'string').
     */
    /** @private */
    this.ws = null;
    /**
     * WebSocket instance (binary protocol - binaryType = 'arraybuffer').
     */
    /** @private */
    this.binaryWs = null;

    this._stringListeners = new Map();
    this._binaryListeners = new Map();
  }

  /**
   * Initialize a websocket connection with the server. This is automatically
   * called in `client.init()`
   * @param {String} clientType - `client.type` {@link client}
   * @param {Object} options - Options of the socket
   * @param {Array<String>} options.path - Defines where socket should find the `socket.io` file
   */
  /** @private */
  async init(clientType, config) {
    // unique key that allows to associate the two sockets to the same client.
    // note: the key is only used to pair to two sockets, so its usage is very
    // limited in time therefore a random number should hopefully be sufficient.
    const key = (Math.random() + '').replace(/^0\./, '');

    // open web sockets
    let { path } = config.env.websockets;

    // @note: keep this check
    // backward compatibility w/ assetsDomain and websocket old config way
    // cf. https://github.com/collective-soundworks/soundworks/issues/35
    if (config.env.subpath) {
      path = `${config.env.subpath}/${path}`;
    }

    let url;
    let webSocketOptions;

    if (isBrowser()) {
      const protocol = window.location.protocol.replace(/^http?/, 'ws');
      const { hostname, port } = window.location;

      url = `${protocol}//${hostname}:${port}/${path}`;
      webSocketOptions = [];
    } else {
      const protocol = config.env.useHttps ? 'wss:' : 'ws:';
      const { serverIp, port } = config.env;

      url = `${protocol}//${serverIp}:${port}/${path}`;
      webSocketOptions = {
        rejectUnauthorized: false,
      };
    }

    const queryParams = `clientType=${clientType}&key=${key}`;

    // ----------------------------------------------------------
    // init string socket
    // ----------------------------------------------------------
    const stringSocketUrl = `${url}?binary=0&${queryParams}`;

    await new Promise(resolve => {
      let connectionRefusedLogged = false;

      const trySocket = async () => {
        const ws = new WebSocket(stringSocketUrl, webSocketOptions);

        ws.addEventListener('open', connectEvent => {
          // parse incoming messages for pubsub
          this.ws = ws;
          this.ws.addEventListener('message', e => {
            const [channel, args] = unpackStringMessage(e.data);
            this._emit(false, channel, ...args);
          });

          // broadcast all `WebSocket` native events
          ['close', 'error', 'upgrade', 'message'].forEach(eventName => {
            this.ws.addEventListener(eventName, (e) => {
              this._emit(false, eventName, e);
            });
          });

          // forward open event
          this._emit(false, 'open', connectEvent);
          // continue with raw socket
          resolve();
        });

        // cf. https://github.com/collective-soundworks/soundworks/issues/17
        ws.addEventListener('error', e => {
          if (e.type === 'error' && e.error.code === 'ECONNREFUSED') {
            if (!connectionRefusedLogged) {
              logger.log('[soundworks.Socket] Connection refused, waiting for the server to start');
              connectionRefusedLogged = true;
            }

            if (ws.terminate) {
              ws.terminate();
            } else {
              ws.close();
            }

            setTimeout(trySocket, 1000);
          }
        });
      };

      trySocket();
    });

    // ----------------------------------------------------------
    // init binary socket
    // ----------------------------------------------------------
    const binarySocketUrl = `${url}?binary=1&${queryParams}`;

    await new Promise(resolve => {
      const ws = new WebSocket(binarySocketUrl, webSocketOptions);
      ws.binaryType = 'arraybuffer';

      ws.addEventListener('open', connectEvent => {
        // parse incoming messages for pubsub
        this.binaryWs = ws;
        this.binaryWs.addEventListener('message', e => {
          const [channel, data] = unpackBinaryMessage(e.data);
          this._emit(true, channel, data);
        });

        // broadcast all `WebSocket` native events
        ['close', 'error', 'upgrade', 'message'].forEach(eventName => {
          this.binaryWs.addEventListener(eventName, (e) => {
            this._emit(true, eventName, e);
          });
        });

        // forward open event
        this._emit(true, 'open', connectEvent);
        resolve();
      });
    });

    // wait for both sockets connected
    return Promise.resolve();
  }

  /** @private */
  _emit(binary, channel, ...args) {
    const listeners = binary ? this._binaryListeners : this._stringListeners;

    if (listeners.has(channel)) {
      const callbacks = listeners.get(channel);
      callbacks.forEach(callback => callback(...args));
    }
  }

  /** @private */
  _addListener(listeners, channel, callback) {
    if (!listeners.has(channel)) {
      listeners.set(channel, new Set());
    }

    const callbacks = listeners.get(channel);
    callbacks.add(callback);
  }

  /** @private */
  _removeListener(listeners, channel, callback) {
    if (listeners.has(channel)) {
      const callbacks = listeners.get(channel);
      callbacks.delete(callback);

      if (callbacks.size === 0) {
        listeners.delete(channel);
      }
    }
  }

  /** @private */
  _removeAllListeners(listeners, channel = null) {
    if (channel === null) {
      listeners.clear();
    } else if (listeners.has(channel)) {
      listeners.delete(channel);
    }
  }

  /**
   * Send JSON compatible messages on a given channel
   *
   * @param {String} channel - The channel of the message
   * @param {...*} args - Arguments of the message (as many as needed, of any type)
   */
  send(channel, ...args) {
    const msg = packStringMessage(channel, ...args);
    this.ws.send(msg);
  }

  /**
   * Listen JSON compatible messages on a given channel
   *
   * @param {String} channel - Channel of the message
   * @param {Function} callback - Callback to execute when a message is received
   */
  addListener(channel, callback) {
    this._addListener(this._stringListeners, channel, callback);
  }

  /**
   * Remove a listener from JSON compatible messages on a given channel
   *
   * @param {String} channel - Channel of the message
   * @param {Function} callback - Callback to remove
   */
  removeListener(channel, callback) {
    this._removeListener(this._stringListeners, channel, callback);
  }

  /**
   * Remove all listeners from JSON compatible messages on a given channel
   *
   * @param {String} channel - Channel of the message
   */
  removeAllListeners(channel = null) {
    this._removeAllListeners(this._stringListeners, channel);
  }

  /**
   * Send binary messages on a given channel
   *
   * @param {String} channel - Channel of the message
   * @param {TypedArray} typedArray - Data to send
   */
  sendBinary(channel, typedArray) {
    const msg = packBinaryMessage(channel, typedArray);
    this.binaryWs.send(msg);
  }

  /**
   * Listen binary messages on a given channel
   *
   * @param {String} channel - Channel of the message
   * @param {Function} callback - Callback to execute when a message is received
   */
  addBinaryListener(channel, callback) {
    this._addListener(this._binaryListeners, channel, callback);
  }

  /**
   * Remove a listener from binary compatible messages on a given channel
   *
   * @param {String} channel - Channel of the message
   * @param {Function} callback - Callback to cancel
   */
  removeBinaryListener(channel, callback) {
    this._removeListener(this._binaryListeners, channel, callback);
  }

  /**
   * Remove all listeners from binary compatible messages on a given channel
   *
   * @param {String} channel - Channel of the message
   */
  removeAllBinaryListeners(channel = null) {
    this._removeAllListeners(this._binaryListeners, channel);
  }

  /**
   * Immediately close the 2 sockets
   */
  async terminate() {
    this.removeAllListeners();
    this.removeAllBinaryListeners();

    this.ws.close();
    this.binaryWs.close();

    // return Promise.all([this._wsClosePromise, this._binaryWsClosePromise]);
    return Promise.resolve();
  }
}

export default Socket;
