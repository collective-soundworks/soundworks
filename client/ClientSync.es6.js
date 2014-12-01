var audioContext = require('audio-context');

'use strict';

class ClientSync {
  constructor() {
    this.__pingCount = 0;
    this.__pongCount = 0;
    this.__pingLimit = 0;
    this.__serverStartTime = 0;
    this.__timeOffset = 0;
    this.__timeOffsets = [];
    this.__travelTimes = [];
  }

  resetPingCount() {
    this.__pingCount = 0;
  }

  sendPing() {
    this.__pingCount++;
    socket.emit('ping', audioContext.currentTime);
  }

  setup() {
    // Required to start audioContext timer in Safari.
    // Otherwise, audioContext.currentTime is stuck
    // at 0.
    audioContext.createGain();

    // Gets parameters from the server.
    socket.on('init_sync', (data) => {
      this.__pingLimit = data.pingLimit;
      this.__serverStartTime = data.serverStartTime;
    });

    // When the client receives a ping request from
    // the server, start the ping/pong exchange.
    socket.on('ping_request', () => {
      console.log('Ping request from the server.');
      this.resetPingCount();
      this.sendPing();
    });

    // When the client receives a 'pong' from the
    // server, calculate the travel time and the
    // time offset.
    // Repeat as many times as needed (__pingLimit).
    socket.on('pong', (time) => {
      console.log('\'pong\'.');
      this.__pongCount++;
      var now = audioContext.currentTime,
          travelTime = now - time.pingTime_clientTime,
          timeOffset = time.pongTime_serverTime - (now - travelTime / 2);
      this.__travelTimes.push(travelTime);
      this.__timeOffsets.push(timeOffset);
      if (this.__pingCount < this.__pingLimit) {
        this.sendPing();
      } else {
        this.__timeOffset = this.__timeOffsets.reduce((p, q) => p + q) / this.__timeOffsets.length;
      }
    });
  }
}

module.exports = new ClientSync();