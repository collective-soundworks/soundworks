var audioContext = require('audio-context');
var filters = require('../components.TODO/filters');
require('./noise.js');

'use strict';

class SynthNoise {
  constructor() {
    this.output = audioContext.createGain();
    this.filter = audioContext.createBiquadFilter();
    this.noise = audioContext.createPinkNoise();

    this.filter.frequency.value = 400;
    this.filter.Q.value = 12;
    this.filter.type = 0;

    this.output.gain.value = 0;

    this.noise.connect(this.filter);
    this.filter.connect(this.output);
    this.output.connect(audioContext.destination);

    this.speedFilter = new filters.Mvavrg(8);
  }

  update(distance, speed) {
    var filteredSpeed = this.speedFilter.input(speed);
    var filterFrequency = this.calculateFrequency(filteredSpeed, 200, 16000);
    this.filter.frequency.value = filterFrequency;

    var now = audioContext.currentTime;
    var currentGain = this.output.gain.value;

    this.output.gain.cancelScheduledValues(now);
    this.output.gain.setValueAtTime(currentGain, now);

    var gain = 1 - distance;
    var duration = 0.050;

    // if (gain < currentGain)
    //   duration = 0.4;

    this.output.gain.linearRampToValueAtTime(gain, now + duration);
  }

  /*
   * Utils methods
   */

  calculateFrequency(s, fMin, fMax) {
    if (s < 0.05)
      return fMin;
    else if (s > 1)
      return fMax;
    return fMin + s * (fMax - fMin);
  }

}

module.exports = SynthNoise;