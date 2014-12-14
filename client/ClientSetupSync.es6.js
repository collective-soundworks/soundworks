/**
 * @fileoverview Matrix client side syncronization manager
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var EventEmitter = require('events').EventEmitter;
var audioContext = require('audio-context');
var ClientSetup = require('./ClientSetup');
var ioClient = require('./ioClient');

function getMinOfArray(numArray) {
  return Math.min.apply(null, numArray);
}

function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
}

class SyncProcess extends EventEmitter { // TODO: change EventEmitter to CustomEvent?
  constructor(params = {}) {
    this.id = Math.floor(Math.random() * 1000000);

    this.iterations = params.iterations || 10;
    this.count = 0;

    this.timeOffsets = [];
    this.travelTimes = [];
    this.avgTimeOffset = 0;
    this.avgTravelTime = 0;
    this.minTravelTime = 0;
    this.maxTravelTime = 0;

    // Send first ping
    this.__sendPing();

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
          this.__sendPing();
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

  __sendPing() {
    this.count++;

    var socket = ioClient.socket;
    socket.emit('sync_ping', this.id, audioContext.currentTime);
  }
}

class ClientSetupSync extends ClientSetup {
  constructor(params) {
    super(params);

    this.minTravelTimes = [];
    this.maxTravelTimes = [];
    this.avgTravelTimes = [];
    this.avgTimeOffsets = [];

    this.timeOffset = 0;
    this.serverReady = false;

    if (this.displayDiv) {
      this.displayDiv.setAttribute('id', 'sync');
      this.displayDiv.classList.add('sync');
      this.displayDiv.style.zIndex = -10;
      this.displayDiv.innerHTML = "<p>Synchronization in progress...</p>";
    }
  }

  start() {
    super.start();

    var sync = new SyncProcess(this.iterations);

    sync.on('sync_stats', (minTravelTime, maxTravelTime, avgTimeOffset, avgTravelTime) => {
      var firstSync = (this.maxTravelTimes.length === 0);

      this.minTravelTimes.push(minTravelTime);
      this.maxTravelTimes.push(maxTravelTime);
      this.avgTimeOffsets.push(avgTimeOffset);
      this.avgTravelTimes.push(avgTravelTime);

      this.timeOffset = avgTimeOffset;

      // is done after the first sync process only
      if (firstSync)
        this.done();
    });
  }

  getLocalTime(serverTime) {
    return serverTime - this.timeOffset;
  }

  getServerTime(localTime = audioContext.currentTime) {
    return localTime + this.timeOffset;
  }
}

module.exports = ClientSetupSync;