import WebSocket from 'isomorphic-ws';

import {
  packBinaryMessage,
  unpackBinaryMessage,
  packStringMessage,
  unpackStringMessage,
} from '../common/sockets-utils.js';
import logger from '../common/logger.js';
import { isBrowser } from '../common/utils.js';

// WebSocket events:
//
// `close`:
//   Fired when a connection with a websocket is closed.
//   Also available via the onclose property
// `error`:
//   Fired when a connection with a websocket has been closed because of an error,
//   such as whensome data couldn't be sent.
//   Also available via the onerror property.
// `message`:
//   Fired when data is received through a websocket.
//   Also available via the onmessage property.
// `open`:
//   Fired when a connection with a websocket is opened.
//   Also available via the onopen property.

/**
 * The Socket class is a simple publish / subscribe wrapper built on top of the
 * [isomorphic-ws](https://github.com/heineiuo/isomorphic-ws) library.
 * An instance of `Socket` is automatically created by the `soundworks.Client`.
 *
 * _Important: In most cases, you should consider using a {@link client.SharedState} rather than
 * sending messages directly through the sockets._
 *
 * The Socket class concurrently opens two different WebSockets:
 * - a socket configured with `binaryType = 'string'` for JSON compatible string
 *  messages.
 * - a socket configured with `binaryType=arraybuffer` for efficient streaming
 *  of binary data.
 *
 * Both sockets re-emits all "native" ws events ('open', 'upgrade', 'close', 'error'
 *  and 'message'.
 *
 * See {@link client.Client#socket}
 *
 * @memberof client
 * @hideconstructor
 */
class Socket {
  constructor() {
    /**
     * WebSocket instance w/ string protocol, i.e. `binaryType = 'string'`.
     *
     * @private
     */
    this.ws = null;
    /**
     * WebSocket instance w/ binary protocol, i.e. `binaryType = 'arraybuffer'`.
     *
     * @private
     */
    this.binaryWs = null;
    /** @private */
    this._stringListeners = new Map();
    /** @private */
    this._binaryListeners = new Map();
  }

  /**
   * Initialize a websocket connection with the server. Automatically called
   * during `client.init()`
   *
   * @param {string} role - Role of the client (see {@link client.Client#role})
   * @param {object} config - Configuration of the sockets
   * @protected
   * @ignore
   */
  async init(role, config) {
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
      const { serverAddress, port } = config.env;

      url = `${protocol}//${serverAddress}:${port}/${path}`;
      webSocketOptions = {
        rejectUnauthorized: false,
      };
    }

    const queryParams = `role=${role}&key=${key}`;

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

    // @todo - review/fix
    // - the `ws.on` method only exists on node implementation, and the 'ping'
    //   message is not received on addEventListener
    // - there seems to be no way to access the ping event in browsers...
    //
    // let pingTimeoutId = null;
    // const pingInterval = config.env.websockets.pingInterval;
    // // detect broken connection
    // // cf. https://github.com/websockets/ws#how-to-detect-and-close-broken-connections
    // const heartbeat = () => {
    //   try {
    //     console.log('ping received');
    //     clearTimeout(pingTimeoutId);

    //   // pingTimeoutId = setTimeout(() => {
    //   //   console.log('terminate');
    //   //   this.terminate();
    //   // }, pingInterval + 2000);
    //   } catch (err) {
    //     console.error(err);
    //   }
    // };
    //
    // this.ws.on('ping', heartbeat);
    // this.ws.addEventListener('close', () => {
    //   clearTimeout(pingTimeoutId);
    // });

    // heartbeat();

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

  /**
   * @param {boolean} binary - Emit to either the string or binary socket.
   * @param {string} channel - Channel name.
   * @param {...*} args - Content of the message.
   * @private
   */
  _emit(binary, channel, ...args) {
    const listeners = binary ? this._binaryListeners : this._stringListeners;

    if (listeners.has(channel)) {
      const callbacks = listeners.get(channel);
      callbacks.forEach(callback => callback(...args));
    }
  }

  /**
   * @param {Function[]} listeners - List of listeners, either for the string or binary socket.
   * @param {string} channel - Channel name.
   * @param {Function} callback - The function to be added to the listeners.
   * @private
   */
  _addListener(listeners, channel, callback) {
    if (!listeners.has(channel)) {
      listeners.set(channel, new Set());
    }

    const callbacks = listeners.get(channel);
    callbacks.add(callback);
  }

  /**
   * @param {Function[]} listeners - List of listeners, either for the string or binary socket.
   * @param {string} channel - Channel name.
   * @param {Function} callback - The function to be removed from the listeners.
   * @private
   */
  _removeListener(listeners, channel, callback) {
    if (listeners.has(channel)) {
      const callbacks = listeners.get(channel);
      callbacks.delete(callback);

      if (callbacks.size === 0) {
        listeners.delete(channel);
      }
    }
  }

  /**
   * @param {Function[]} listeners - List of listeners, either for the string or binary socket.
   * @param {string} [channel=null] - Channel name of the listeners to remove. If null
   *  all the listeners are cleared.
   * @private
   */
  _removeAllListeners(listeners, channel = null) {
    if (channel === null) {
      listeners.clear();
    } else if (listeners.has(channel)) {
      listeners.delete(channel);
    }
  }

  /**
   * Send JSON compatible messages on a given channel.
   *
   * @param {string} channel - Channel name of the message.
   * @param {...*} args - Message list, as many as needed, of any serializable type).
   */
  send(channel, ...args) {
    const msg = packStringMessage(channel, ...args);
    this.ws.send(msg);
  }

  /**
   * Listen to JSON compatible messages on a given channel.
   *
   * @param {string} channel - Channel name of the message.
   * @param {Function} callback - Callback to execute when a message is received.
   */
  addListener(channel, callback) {
    this._addListener(this._stringListeners, channel, callback);
  }

  /**
   * Remove a listener from JSON compatible messages on a given channel.
   *
   * @param {string} channel - Channel name of the message.
   * @param {Function} callback - Callback to remove.
   */
  removeListener(channel, callback) {
    this._removeListener(this._stringListeners, channel, callback);
  }

  /**
   * Remove all listeners from JSON compatible messages on a given channel.
   *
   * @param {string} channel - Channel name of the message.
   */
  removeAllListeners(channel = null) {
    this._removeAllListeners(this._stringListeners, channel);
  }

  /**
   * Send binary messages on a given channel.
   *
   * @param {string} channel - Channel name of the message.
   * @param {TypedArray} typedArray - Binary data to be sent.
   */
  sendBinary(channel, typedArray) {
    const msg = packBinaryMessage(channel, typedArray);
    this.binaryWs.send(msg);
  }

  /**
   * Listen binary messages on a given channel.
   *
   * @param {string} channel - Channel name of the message.
   * @param {Function} callback - Callback to execute when a message is received.
   */
  addBinaryListener(channel, callback) {
    this._addListener(this._binaryListeners, channel, callback);
  }

  /**
   * Remove a listener from binary compatible messages on a given channel
   *
   * @param {string} channel - Channel of the message.
   * @param {Function} callback - Callback to cancel.
   */
  removeBinaryListener(channel, callback) {
    this._removeListener(this._binaryListeners, channel, callback);
  }

  /**
   * Remove all listeners from binary compatible messages on a given channel
   *
   * @param {string} channel - Channel of the message.
   */
  removeAllBinaryListeners(channel = null) {
    this._removeAllListeners(this._binaryListeners, channel);
  }

  /**
   * Removes all listeners and immediately close the two sockets.
   */
  async terminate() {
    this.removeAllListeners();
    this.removeAllBinaryListeners();

    this.ws.close();
    this.binaryWs.close();

    return Promise.resolve();
  }
}

export default Socket;
