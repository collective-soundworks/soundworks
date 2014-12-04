var audioContext = require('audio-context');
var ioClient = require('./ioClient');
var EventEmitter = require('events').EventEmitter;

'use strict';

function activateWebAudioAPI() {
  var o = audioContext.createOscillator();
  var g = audioContext.createGain();
  g.gain.value = 0;
  o.connect(g);
  g.connect(audioContext.destination);
  o.start(0);
  o.stop(audioContext.currentTime + 0.000001);
}

function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
}

class SyncProcess extends EventEmitter { // TODO: change EventEmitter to CustomEvent?
  constructor(iterations) {
    this.__id = Math.floor(Math.random() * 1000000);

    this.__count = 0;
    this.__iterations = iterations;

    this.__timeOffsets = [];
    this.__travelTimes = [];
    this.__avgTimeOffset = 0;
    this.__avgTravelTime = 0;
    this.__maxTravelTime = 0;

    // Send first ping
    this.sendPing();

    // When the client receives a 'pong' from the
    // server, calculate the travel time and the
    // time offset.
    // Repeat as many times as needed (__iterations).
    var socket = ioClient.socket;
    socket.on('sync_pong', (id, pingTime_clientTime, pongTime_serverTime) => {
      if (id === this.__id) {
        console.log("pong");
        var now = audioContext.currentTime,
          travelTime = now - pingTime_clientTime,
          timeOffset = pongTime_serverTime - (now - travelTime / 2);

        this.__travelTimes.push(travelTime);
        this.__timeOffsets.push(timeOffset);

        if (this.__count < this.__iterations) {
          this.sendPing();
        } else {
          this.__avgTravelTime = this.__travelTimes.reduce((p, q) => p + q) / this.__travelTimes.length;
          this.__avgTimeOffset = this.__timeOffsets.reduce((p, q) => p + q) / this.__timeOffsets.length;
          this.__maxTravelTime = getMaxOfArray(this.__travelTimes);

          socket.emit('sync_stats', this.__maxTravelTime, this.__avgTravelTime, this.__avgTimeOffset);
          this.emit('sync_stats', this.__maxTravelTime, this.__avgTravelTime, this.__avgTimeOffset);
        }
      }
    });
  }

  sendPing() {
    var socket = ioClient.socket;
    this.__count++;
    socket.emit('sync_ping', this.__id, audioContext.currentTime);
  }
}

class ClientSyncManager extends EventEmitter { // TODO: change to CustomEvent?
  constructor() {
    this.__maxTravelTimes = [];
    this.__avgTravelTimes = [];
    this.__avgTimeOffsets = [];

    this.__syncDiv = this.createSyncDiv();

    this.__serverReady = false

    // Get sync parameters from the server.
    var socket = ioClient.socket;

    socket.on('init_sync', () => {
      this.__serverReady = true;
    });

    socket.on('start_sync', () => {
      this.startNewSyncProcess();
    });

    // Required to start audioContext timer in Safari.
    // Otherwise, audioContext.currentTime is stuck
    // to 0.
    audioContext.createGain();
  }

  /*
   * Sync process
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   */

  startNewSyncProcess(iterations = 10) {
    if (this.__serverReady) {
      var socket = ioClient.socket;
      var sync = new SyncProcess(iterations);

      this.emit('sync_started');

      sync.on('sync_stats', (maxTravelTime, avgTimeOffset, avgTravelTime) => {
        var firstSync = (this.__maxTravelTimes.length === 0);

        this.__maxTravelTimes.push(maxTravelTime);
        this.__avgTimeOffsets.push(avgTimeOffset);
        this.__avgTravelTimes.push(avgTravelTime);

        //  Send 'sync_ready' event after the first sync process only
        if (firstSync)
          this.emit('sync_ready');

        console.log("Sync process done!");
      });
    }
  }

  /*
   * Preparation '#sync' div (HTML)
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   */

  createSyncDiv() {
    var syncDiv = document.createElement('div');

    syncDiv.setAttribute('id', 'sync');
    syncDiv.classList.add('info');
    syncDiv.classList.add('hidden');

    syncDiv.innerHTML = "<p>Before we start, we'll go through a little preparation process.</p>" +
      "<p>Touch the screen to start!</p>";

    syncDiv.addEventListener('click', () => {
      activateWebAudioAPI();
      this.startNewSyncProcess();
    })

    return syncDiv;
  }

  displaySyncDiv() {
    this.__syncDiv.classList.remove('hidden');
  }

  hideSyncDiv() {
    this.__syncDiv.classList.add('hidden');
  }
}

module.exports = ClientSyncManager;