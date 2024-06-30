import { isBrowser } from '@ircam/sc-utils';
import WebSocket from 'isomorphic-ws';

import {
  PING_MESSAGE,
  PONG_MESSAGE,
} from '../common/constants.js';
import logger from '../common/logger.js';
import {
  packStringMessage,
  unpackStringMessage,
} from '../common/sockets-utils.js';

export const kSocketTerminate = Symbol('soundworks:socket-terminate');

/**
 * The ClientSocket class is a simple publish / subscribe wrapper built on top of the
 * [isomorphic-ws](https://github.com/heineiuo/isomorphic-ws) library.
 * An instance of `ClientSocket` is automatically created by the `soundworks.Client`
 * (see {@link Client#socket}).
 *
 * _Important: In most cases, you should consider using a {@link SharedState}
 * rather than directly using the sockets._
 *
 * The ClientSocket class concurrently opens two different WebSockets:
 * - a socket configured with `binaryType = 'blob'` for JSON compatible data
 *  types (i.e. string, number, boolean, object, array and null).
 * - a socket configured with `binaryType= 'arraybuffer'` for efficient streaming
 *  of binary data.
 *
 * Both sockets re-emits all "native" ws events ('open', 'upgrade', 'close', 'error'
 *  and 'message'.
 *
 * @hideconstructor
 */
class ClientSocket {
  #role = null;
  #config = null;
  #socketOptions = null;
  #socket = null;
  #listeners = new Map();

  constructor(role, config, socketOptions) {
    this.#role = role;
    this.#config = config;
    this.#socketOptions = socketOptions;
  }

  /**
   * Initialize a websocket connection with the server. Automatically called
   * during {@link Client#init}
   *
   * @param {string} role - Role of the client (see {@link Client#role})
   * @param {object} config - Configuration of the sockets
   * @private
   */
  async init() {
    let { path } = this.#socketOptions;
    // cf. https://github.com/collective-soundworks/soundworks/issues/35
    if (this.#config.env.subpath) {
      path = `${this.#config.env.subpath}/${path}`;
    }

    const protocol = this.#config.env.useHttps ? 'wss:' : 'ws:';
    const port = this.#config.env.port;
    let serverAddress;
    let webSocketOptions;

    if (isBrowser()) {
      const hostname = window.location.hostname;

      if (this.#config.env.serverAddress === '') {
        serverAddress = hostname;
      } else {
        serverAddress = this.#config.env.serverAddress;
      }

      // when in https with self-signed certificates, we don't want to use
      // the serverAddress defined in config as the socket would be blocked, so we
      // just override serverAddress with hostname in this case
      const localhosts = ['127.0.0.1', 'localhost'];

      if (this.#config.env.useHttps && localhosts.includes(hostname)) {
        serverAddress = window.location.hostname;
      }

      if (this.#config.env.useHttps && window.location.hostname !== serverAddress) {
        console.warn(`The WebSocket will try to connect at ${serverAddress} while the page is accessed from ${hostname}. This can lead to socket errors, e.g. If you run the application with self-signed certificates as the certificate may not have been accepted for ${serverAddress}. In such case you should rather access the page from ${serverAddress}.`);
      }

      webSocketOptions = [];
    } else {
      if (this.#config.env.serverAddress === '') {
        serverAddress = '127.0.0.1';
      } else {
        serverAddress = this.#config.env.serverAddress;
      }

      webSocketOptions = {
        rejectUnauthorized: false,
      };
    }

    let queryParams = `role=${this.#role}`;

    if (this.#config.token) {
      queryParams += `&token=${this.#config.token}`;
    }

    const url = `${protocol}//${serverAddress}:${port}/${path}?${queryParams}`;

    // ----------------------------------------------------------
    // Init socket
    // ----------------------------------------------------------
    return new Promise(resolve => {
      let connectionRefusedLogged = false;

      const trySocket = async () => {
        const ws = new WebSocket(url, webSocketOptions);

        ws.addEventListener('open', openEvent => {
          // parse incoming messages for pubsub
          this.#socket = ws;

          this.#socket.addEventListener('message', e => {
            if (e.data === PING_MESSAGE) {
              // heartbeat();
              this.#socket.send(PONG_MESSAGE);
              // do not propagate ping / pong messages
              return;
            }

            const [channel, args] = unpackStringMessage(e.data);
            this.#dispatchEvent(channel, ...args);
          });

          // propagate "native" events
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
          [
            'close',
            'error',
            'upgrade',
            'message',
          ].forEach(eventName => {
            this.#socket.addEventListener(eventName, e => {
              this.#dispatchEvent(eventName, e);
            });
          })

          // forward open event
          this.#dispatchEvent('open', openEvent);
          // continue with raw socket
          resolve();
        });

        // cf. https://github.com/collective-soundworks/soundworks/issues/17
        ws.addEventListener('error', e => {
          if (e.type === 'error') {
            if (ws.terminate) {
              ws.terminate();
            } else {
              ws.close();
            }

            // for node clients, retry connection
            if (e.error && e.error.code === 'ECONNREFUSED') {
              // we want to log the warning just once
              if (!connectionRefusedLogged) {
                logger.log('[soundworks.Socket] Connection refused, waiting for the server to start');
                // console.log(e.error);
                connectionRefusedLogged = true;
              }

              // retry in 1 second
              setTimeout(trySocket, 1000);
            }
          }
        });
      };

      trySocket();
    });
  }

  /**
   * Removes all listeners and immediately close the two sockets. Is automatically
   * called on `client.stop()`
   *
   * Is also called when a disconnection is detected by the heartbeat (note that
   * in this case, the launcher will call `client.stop()` but the listeners are
   * already cleared so the event will be trigerred only once.
   */
  async [kSocketTerminate]() {
    const closeListeners = this.#listeners.get('close');
    this.removeAllListeners();

    this.#socket.close();

    if (closeListeners) {
      closeListeners.forEach(listener => listener());
    }

    return Promise.resolve();
  }

  /**
   * @param {string} channel - Channel name.
   * @param {...*} args - Content of the message.
   */
  #dispatchEvent(channel, ...args) {
    if (this.#listeners.has(channel)) {
      const callbacks = this.#listeners.get(channel);
      callbacks.forEach(callback => callback(...args));
    }
  }

  /**
   * Send messages with JSON compatible data types on a given channel.
   *
   * @param {string} channel - Channel name.
   * @param {...*} args - Payload of the message. As many arguments as needed, of
   *  JSON compatible data types (i.e. string, number, boolean, object, array and null).
   */
  send(channel, ...args) {
    if (this.#socket.readyState === 1) {
      const msg = packStringMessage(channel, ...args);
      this.#socket.send(msg);
    }
  }

  /**
   * Listen messages with JSON compatible data types on a given channel.
   *
   * @param {string} channel - Channel name.
   * @param {Function} callback - Callback to execute when a message is received,
   *  arguments of the callback function will match the arguments sent using the
   *  {@link ServerSocket#send} method.
   */
  addListener(channel, callback) {
    if (!this.#listeners.has(channel)) {
      this.#listeners.set(channel, new Set());
    }

    const callbacks = this.#listeners.get(channel);
    callbacks.add(callback);
  }

  /**
   * Remove a listener from JSON compatible messages on a given channel.
   *
   * @param {string} channel - Channel name.
   * @param {Function} callback - Callback to remove.
   */
  removeListener(channel, callback) {
    if (this.#listeners.has(channel)) {
      const callbacks = this.#listeners.get(channel);
      callbacks.delete(callback);

      if (callbacks.size === 0) {
        this.#listeners.delete(channel);
      }
    }
  }

  /**
   * Remove all listeners of messages with JSON compatible data types.
   *
   * @param {string} channel - Channel name.
   */
  removeAllListeners(channel = null) {
    if (channel === null) {
      this.#listeners.clear();
    } else if (this.#listeners.has(channel)) {
      this.#listeners.delete(channel);
    }
  }
}

export default ClientSocket;
