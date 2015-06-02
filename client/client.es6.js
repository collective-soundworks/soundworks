/**
 * @fileoverview Soundworks client side
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
"use strict";

var EventEmitter = require('events').EventEmitter;
const MobileDetect = require('mobile-detect');
// debug - http://socket.io/docs/logging-and-debugging/#available-debugging-scopes
// localStorage.debug = '*';

var client = {
  type: null,
  index: -1,
  coordinates: null,
  init: init,
  start: start,
  serial: serial,
  parallel: parallel,
  io: null,
  socket: null,
  modulesStarted: false,
  send: send,
  receive: receive,
  removeListener: removeListener,
  platform: {
    os: null,
    isMobile: null,
    audioFileExt: ''
  }
};

// get informations about client
const md = new MobileDetect(window.navigator.userAgent);
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
// soudn file extention
const a = document.createElement('audio');
// http://diveintohtml5.info/everything.html
if (!!(a.canPlayType && a.canPlayType('audio/mpeg;'))) {
  client.platform.audioFileExt = '.mp3';
} else if (!!(a.canPlayType && a.canPlayType('audio/ogg; codecs="vorbis"'))) {
  client.platform.audioFileExt = '.ogg';
} else {
  client.platform.audioFileExt = '.wav';
}

console.log(client.platform);

class ParallelModule extends EventEmitter {
  constructor(modules) {
    super();
    this.modules = modules;
    this.doneCount = 0;
  }

  start() {
    var zIndex = this.modules.length * 100;

    // start all setups
    for (let mod of this.modules) {
      mod.on('done', () => {
        this.doneCount++;

        if (this.doneCount === this.modules.length)
          this.done();
      });

      if (mod.view) {
        mod.setZIndex(zIndex);
        zIndex -= 100;
      }

      mod.start();
    }
  }

  done() {
    this.emit('done', this);
  }

  setZIndex(zIndex) {
    for (let mod of this.modules)
      mod.view.style.zIndex = zIndex;
  }
}

class SerialModule extends EventEmitter {
  constructor(modules) {
    super();
    this.modules = modules;
  }

  start() {
    var prevModule = null;

    // start all module listeners
    for (let mod of this.modules) {
      if (prevModule) {
        prevModule.on('done', () => {
          mod.start();
        });
      }

      prevModule = mod;
    }

    // when last module of sequence is done, the sequence is done
    prevModule.on('done', () => {
      this.done();
    });

    // start first module of the sequence
    this.modules[0].start();
  }

  done() {
    this.emit('done', this);
  }

  setZIndex(zIndex) {
    for (let mod of this.modules)
      mod.view.style.zIndex = zIndex;
  }
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

    client.receive('client:start', (index) => {
      client.index = index;
    });
  }
}

function startModules(theModules) {
  if (!client.modulesStarted) {
    theModules.start();
    client.modulesStarted = true;
  } else {
    // client reconnection

    console.log('reconnection');
  }
}

function start(theModules) {
  if (client.io) {
    if (client.index >= 0) {
      // server is already ready
      startModules(theModules);
    } else {
      // wait for server ready
      client.receive('client:start', (index) => {
        client.index = index;
        startModules(theModules);
      });
    }

    client.receive('disconnect', () => {});
  } else {
    // no server
    startModules(theModules);
  }
}

function serial(...modules) {
  return new SerialModule(modules);
}

function parallel(...modules) {
  return new ParallelModule(modules);
}

function send(msg, ...args) {
  if (client.socket)
    client.socket.emit(msg, ...args);
}

function receive(msg, callback, module = null) {
  if (client.socket) {
    client.socket.on(msg, callback);

    if (module)
      module.addClientListener(msg, callback);
  }
}

function removeListener(msg, callback) {
  if (client.socket)
    client.socket.removeListener(msg, callback);
}

module.exports = client;