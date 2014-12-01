var audioContext = require('audio-context');
var filters = require('../components.TODO/filters');
require('./noise.js');

'use strict';

var SynthNoise = (function(){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var proto$0={};
  function SynthNoise() {
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
  }DP$0(SynthNoise,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  proto$0.update = function(distance, speed) {
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
  };

  /*
   * Utils methods
   */

  proto$0.calculateFrequency = function(s, fMin, fMax) {
    if (s < 0.05)
      return fMin;
    else if (s > 1)
      return fMax;
    return fMin + s * (fMax - fMin);
  };

MIXIN$0(SynthNoise.prototype,proto$0);proto$0=void 0;return SynthNoise;})();

module.exports = SynthNoise;