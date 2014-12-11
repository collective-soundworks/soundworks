/**
 * @fileoverview Matrix client side syncronization manager
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var audioContext = require('audio-context');
var ioClient = require('./ioClient');
var EventEmitter = require('events').EventEmitter;

function getMinOfArray(numArray) {
  return Math.min.apply(null, numArray);
}

function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
}

class SyncProcess extends EventEmitter { // TODO: change EventEmitter to CustomEvent?
  constructor(iterations) {
    this.id = Math.floor(Math.random() * 1000000);

    this.count = 0;
    this.iterations = iterations;

    this.timeOffsets = [];
    this.travelTimes = [];
    this.avgTimeOffset = 0;
    this.avgTravelTime = 0;
    this.minTravelTime = 0;
    this.maxTravelTime = 0;

    // Send first ping
    this.sendPing();

    // When the client receives a 'pong' from the
    // server, calculate the travel time and the
    // time offset.
    // Repeat as many times as needed (__iterations).
    var socket = ioClient.socket;
    socket.on('sync_pong', (id, pingTime_clientTime, pongTime_serverTime) => {
      if (id === this.id) {
        var now = audioContext.currentTime,
          travelTime = now - pingTime_clientTime,
          timeOffset = pongTime_serverTime - (now - travelTime / 2);

        this.travelTimes.push(travelTime);
        this.timeOffsets.push(timeOffset);

        if (this.count < this.iterations) {
          this.sendPing();
        } else {
          this.avgTravelTime = this.travelTimes.reduce((p, q) => p + q) / this.travelTimes.length;
          this.avgTimeOffset = this.timeOffsets.reduce((p, q) => p + q) / this.timeOffsets.length;
          this.minTravelTime = getMinOfArray(this.travelTimes);
          this.maxTravelTime = getMaxOfArray(this.travelTimes);

          socket.emit('sync_stats', this.minTravelTime, this.maxTravelTime, this.avgTravelTime, this.avgTimeOffset);
          this.emit('sync_stats', this.minTravelTime, this.maxTravelTime, this.avgTravelTime, this.avgTimeOffset);
        }
      }
    });
  }

  sendPing() {
    var socket = ioClient.socket;
    this.count++;
    socket.emit('sync_ping', this.id, audioContext.currentTime);
  }
}

class ClientSyncManager extends EventEmitter { // TODO: change to CustomEvent?
  constructor() {
    this.minTravelTimes = [];
    this.maxTravelTimes = [];
    this.avgTravelTimes = [];
    this.avgTimeOffsets = [];

    this.timeOffset = 0;

    this.serverReady = false;

    // Get sync parameters from the server.
    var socket = ioClient.socket;

    socket.on('sync_init', () => {
      this.serverReady = true;
    });

    socket.on('sync_start', () => {
      this.startNewSyncProcess();
    });

    // Required to start audioContext timer in Safari.
    // Otherwise, audioContext.currentTime is stuck
    // to 0.
    audioContext.createGain();
  }

  start() {
    this.startNewSyncProcess();
  }

  startNewSyncProcess(iterations = 10) {
    if (this.serverReady) {
      var socket = ioClient.socket;
      var sync = new SyncProcess(iterations);

      this.emit('sync_started');

      sync.on('sync_stats', (minTravelTime, maxTravelTime, avgTravelTime, avgTimeOffset) => {
        var firstSync = (this.maxTravelTimes.length === 0);

        this.minTravelTimes.push(minTravelTime);
        this.maxTravelTimes.push(maxTravelTime);
        this.avgTimeOffsets.push(avgTimeOffset);
        this.avgTravelTimes.push(avgTravelTime);

        this.timeOffset = avgTimeOffset;

        //  Send 'sync_ready' event after the first sync process only
        if (firstSync)
          this.emit('sync_ready');

        console.log("Sync process done!");
      });
    }
  }

  getLocalTime(serverTime) {
    return serverTime - this.timeOffset;
  }

  getServerTime(localTime = audioContext.currentTime) {
    return localTime + this.timeOffset;
  }
}

module.exports = ClientSyncManager;