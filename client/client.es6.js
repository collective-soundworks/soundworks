/**
 * @fileoverview Soundworks client side
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
"use strict";

const MobileDetect = require('mobile-detect');
const ClientModule = require('./ClientModule');

// debug - http://socket.io/docs/logging-and-debugging/#available-debugging-scopes
// localStorage.debug = '*';

/**
 * The `client` object contains the basic methods of the client. For instance, the object initializes the client type with `init` and establishes WebSocket communications with the server through the methods `send` and `receive`. Additionally, it starts the scenario and sequences the modules using the methods `start`, `serial` and `parallel`.
 * @type {Object}
 */
var client = {
  type: null,
  ready: null,
  index: -1,
  coordinates: null,
  init: init,
  start: start,
  // deprecated functions
  serial: serial,
  parallel: parallel,

  io: null,
  socket: null,
  send: send,
  receive: receive,
  removeListener: removeListener,
  platform: {
    os: null,
    isMobile: null,
    audioFileExt: '',
    isForbidden: false
  }
};

// get informations about client
const ua = window.navigator.userAgent
const md = new MobileDetect(ua);
client.platform.isMobile = (md.mobile() !== null); // true if phone or tablet
client.platform.os = (() => {
  let os = md.os();

  if (os === 'AndroidOS') {
    return 'android';
  } else if (os === 'iOS') {
    return 'ios';
  } else {
    return 'other';
  }
})();

// audio file extention check
const a = document.createElement('audio');
// http://diveintohtml5.info/everything.html
if (!!(a.canPlayType && a.canPlayType('audio/mpeg;'))) {
  client.platform.audioFileExt = '.mp3';
} else if (!!(a.canPlayType && a.canPlayType('audio/ogg; codecs="vorbis"'))) {
  client.platform.audioFileExt = '.ogg';
} else {
  client.platform.audioFileExt = '.wav';
}

/**
 * The `init` method sets the client type and initializes a WebSocket connection associated with the given type.
 * @param {string} [clientType = 'player'] The client type.
 * @todo clarify clientType.
 * @param {Object} [options = {}] The options to initialize a client
 * @param {boolean} [options.io] By default, a Soundworks application has a client and a server side. For a standalone application (client side only), use `options.io = false`.
 * @todo use default value for options.io in the documentation?
 * @param {string} [options.socketUrl] The URL of the WebSocket server.
 */
function init(clientType = 'player', options = {}) {
  client.type = clientType;
  client.io = null;

  if (options.io === undefined) { options.io = true; }
  if (options.socketUrl === undefined) { options.socketUrl = ''; }

  if (options.io !== false) {
    var io = require('socket.io-client');

    client.io = io;
    client.socket = client.io(options.socketUrl + '/' + clientType, {
      transports: ['websocket']
    });

    client.ready = new Promise((resolve) => {
      client.receive('client:start', (index) => {
        client.index = index;
        resolve();
      });
    });
  }
}

/**
 * Starts the module logic (*i.e.* the application).
 * @param {function} startFun [todo]
 * @todo Clarify the param.
 * @return {Promise} The Promise return value.
 * @todo Clarify return value (promise).
 * @todo example
 */
function start(startFun) {
  let module = startFun; // be compatible with previous version

  if (typeof startFun === 'function')
    module = startFun(ClientModule.sequential, ClientModule.parallel);

  let promise = module.createPromise();

  if (client.io) {
    client.ready
      .then(() => module.launch());

    client.receive('disconnect', () => {
      // console.log('disconnect', client.index);
    });

    client.receive('reconnect', () => {
      // console.log('reconnect', client.index);
    });
  } else {
    // no client i/o, no server
    module.launch();
  }

  return promise;
}

/**
 * The `serial` method returns a `ClientModule` that starts the given `...modules` in series. After starting the first module (by calling its `start` method), the next module in the series is started (with its `start` method) when the last module called its `done` method. When the last module calls `done`, the returned serial module calls its own `done` method.
 * **Note:** you can compound serial module sequences with parallel module combinations (*e.g.* `client.serial(module1, client.parallel(module2, module3), module4);`).
 * @deprecated Use the new API with the {@link start} method.
 * @param {...ClientModule} ...modules The modules to run in serial.
 * @return {Promise} [description]
 * @todo Clarify return value
 */
function serial(...modules) {
  console.log('The function "client.serial" is deprecated. Please use the new API instead.');
  return ClientModule.sequential(...modules);
}

/**
The `ClientModule` returned by the `parallel` method starts the given `...modules` in parallel (with their `start` methods), and calls its `done` method after all modules called their own `done` methods.
**Note:** you can compound parallel module combinations with serial module sequences (*e.g.* `client.parallel(module1, client.serial(module2, module3), module4);`).
**Note:** the `view` of a module is always full screen, so in the case where modules run in parallel, their `view`s are stacked on top of each other using the `z-index` CSS property. We use the order of the `parallel` method's arguments to determine the order of the stack (*e.g.* in `client.parallel(module1, module2, module3)`, the `view` of `module1` is displayed on top of the `view` of `module2`, which is displayed on top of the `view` of `module3`).
 * @deprecated Use the new API with the {@link start} method.
 * @param {...ClientModule} ...modules The modules to run in parallel.
 * @return {Promise} [description]
 * @todo Clarify return value
 */
function parallel(...modules) {
  console.log('The function "client.parallel" is deprecated. Please use the new API instead.');
  return ClientModule.parallel(...modules);
}

/**
 * Sends a message via WebSockets to the server.
 * **Note:** on the server side, the server receives the message with the command {@link ServerClient#receive}.
 * @param {string} msg The message name.
 * @param {...*} ...args The values to send with the message.
 * @todo Check how to make arguments of any type.
 */
function send(msg, ...args) {
  if (client.socket)
    client.socket.emit(msg, ...args);
}

/**
 * Executes a callback function when it receives a message from the server.
 * **Note:** on the server side, the server sends the message with the command {@link server.send}`.
 * @param {string} msg The name of the received message.
 * @param {function} callback The function called when the message is received.
 */
function receive(msg, callback) {
  if (client.socket) {
    client.socket.removeListener(msg, callback);
    client.socket.on(msg, callback);
  }
}

/**
 * [removeListener description]
 * @private
 * @param {[type]} msg [description]
 * @param {Function} callback [description]
 * @todo doc
 */
function removeListener(msg, callback) {
  if (client.socket)
    client.socket.removeListener(msg, callback);
}

export default client;
