/**
 * @fileoverview Soundworks client side
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
"use strict";

const MobileDetect = require('mobile-detect');
const ClientModule = require('./ClientModule');

// debug - http://socket.io/docs/logging-and-debugging/#available-debugging-scopes
// localStorage.debug = '*';

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

// audio file extention
const a = document.createElement('audio');
// http://diveintohtml5.info/everything.html
if (!!(a.canPlayType && a.canPlayType('audio/mpeg;'))) {
  client.platform.audioFileExt = '.mp3';
} else if (!!(a.canPlayType && a.canPlayType('audio/ogg; codecs="vorbis"'))) {
  client.platform.audioFileExt = '.ogg';
} else {
  client.platform.audioFileExt = '.wav';
}

function init(clientType = 'player', options = {}) {
  client.type = clientType;
  client.io = null;

  if (options.io !== false) {
    var io = require('socket.io-client');

    client.io = io;
    client.socket = client.io('/' + clientType, {
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

function start(startFun) {
  let module = startFun; // be compatible with previous version

  if(typeof startFun === 'function')
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

function serial(...modules) {
  console.log('The function "client.serial" is deprecated. Please use the new API instead.');
  return ClientModule.sequential(...modules);
}

function parallel(...modules) {
  console.log('The function "client.parallel" is deprecated. Please use the new API instead.');
  return ClientModule.parallel(...modules);
}

function send(msg, ...args) {
  if (client.socket)
    client.socket.emit(msg, ...args);
}

function receive(msg, callback) {
  if (client.socket) {
    client.socket.removeListener(msg, callback);
    client.socket.on(msg, callback);
  }
}

function removeListener(msg, callback) {
  if (client.socket)
    client.socket.removeListener(msg, callback);
}

module.exports = client;