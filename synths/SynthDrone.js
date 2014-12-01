var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var audioContext = require('audio-context');
var filters = require('../components.TODO/filters');

'use strict';

var Drone = (function(){"use strict";var proto$0={};
  function Drone() {
    this.freq = 40;

    this.minCutoffLow = 200;
    this.maxCutoffLow = 400;
    this.logCutoffRatioLow = Math.log(this.maxCutoffLow / this.minCutoffLow);

    this.minCutoffHigh = 400;
    this.maxCutoffHigh = 800;
    this.logCutoffRatioHigh = Math.log(this.maxCutoffHigh / this.minCutoffHigh);

    this.output = audioContext.createGain();

    // low 1
    this.levelLow1 = audioContext.createGain();
    this.levelLow1.connect(this.output);
    this.levelLow1.gain.value = 0.0;

    this.lowpassLow1 = audioContext.createBiquadFilter();
    this.lowpassLow1.type = 0;
    this.lowpassLow1.frequency.value = 0;
    this.lowpassLow1.Q.value = 0;
    this.lowpassLow1.connect(this.levelLow1);

    this.oscLow1 = audioContext.createOscillator();
    this.oscLow1.type = 1;
    this.oscLow1.frequency.value = this.freq;
    this.oscLow1.connect(this.lowpassLow1);
    this.oscLow1.start(0);

    // low 2
    this.levelLow2 = audioContext.createGain();
    this.levelLow2.connect(this.output);
    this.levelLow2.gain.value = 0.0;

    this.lowpassLow2 = audioContext.createBiquadFilter();
    this.lowpassLow2.type = 0;
    this.lowpassLow2.frequency.value = 0;
    this.lowpassLow2.Q.value = 0;
    this.lowpassLow2.connect(this.levelLow2);

    this.oscLow2 = audioContext.createOscillator();
    this.oscLow2.type = 1;
    this.oscLow2.frequency.value = this.freq;
    this.oscLow2.connect(this.lowpassLow2);
    this.oscLow2.start(0);

    // high 1
    this.levelHigh1 = audioContext.createGain();
    this.levelHigh1.connect(this.output);
    this.levelHigh1.gain.value = 0.0;

    this.lowpassHigh1 = audioContext.createBiquadFilter();
    this.lowpassHigh1.type = 0;
    this.lowpassHigh1.frequency.value = 0;
    this.lowpassHigh1.Q.value = 0;
    this.lowpassHigh1.connect(this.levelHigh1);

    this.oscHigh1 = audioContext.createOscillator();
    this.oscHigh1.type = 1;
    this.oscHigh1.frequency.value = 2 * this.freq;
    this.oscHigh1.connect(this.lowpassHigh1);
    this.oscHigh1.start(0);

    // high 2
    this.levelHigh2 = audioContext.createGain();
    this.levelHigh2.connect(this.output);
    this.levelHigh2.gain.value = 0.0;

    this.lowpassHigh2 = audioContext.createBiquadFilter();
    this.lowpassHigh2.type = 0;
    this.lowpassHigh2.frequency.value = 0;
    this.lowpassHigh2.Q.value = 0;
    this.lowpassHigh2.connect(this.levelHigh2);

    this.oscHigh2 = audioContext.createOscillator();
    this.oscHigh2.type = 1;
    this.oscHigh2.frequency.value = 2 * this.freq;
    this.oscHigh2.connect(this.lowpassHigh1);
    this.oscHigh2.start(0);

    this.filterLow = new filters.Mvavrg(16);
    this.filterHigh = new filters.Mvavrg(4);
  }DP$0(Drone,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  proto$0.setLevel = function(value) {
    var low = this.filterLow.input(value);
    var high = this.filterHigh.input(value);

    var gainLow = 0.05 + 0.02 * low;
    var gainHigh = 0.05 + 0.2 * high;

    // set gains
    if (gainLow > 1.0)
      gainLow = 1.0;

    if (gainHigh > 1.0)
      gainHigh = 1.0;

    this.levelLow1.gain.value = gainLow;
    this.levelLow2.gain.value = gainLow;
    this.levelHigh1.gain.value = gainHigh;
    this.levelHigh2.gain.value = gainHigh;

    // set detune
    var transLow = 12 + 12 * low;
    var transHigh = 24 * high;

    this.oscLow1.detune.value = transLow;
    this.oscLow2.detune.value = 1.5 * transLow;
    this.oscHigh1.detune.value = transHigh;
    this.oscHigh2.detune.value = 1.5 * transHigh;

    if (low > 1.0)
      low = 1.0;

    if (high > 1.0)
      high = 1.0;

    this.lowpassLow1.frequency.value = this.minCutoffLow * Math.exp(this.logCutoffRatioLow * low);
    this.lowpassLow2.frequency.value = this.minCutoffLow * Math.exp(this.logCutoffRatioLow * low);
    this.lowpassHigh1.frequency.value = this.minCutoffHigh * Math.exp(this.logCutoffRatioHigh * high);
    this.lowpassHigh2.frequency.value = this.minCutoffHigh * Math.exp(this.logCutoffRatioHigh * high);
  };
MIXIN$0(Drone.prototype,proto$0);proto$0=void 0;return Drone;})();

var SynthDrone = (function(){"use strict";var proto$0={};
  function SynthDrone() {
    this.synth = new Drone();
    this.synth.output.connect(audioContext.destination);

    this.inZone = false;
  }DP$0(SynthDrone,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  proto$0.update = function(distance, speed) {
    var inZone = (distance < 1);

    if (inZone)
      this.synth.setLevel(speed * 2);

    var now = audioContext.currentTime;
    var currentGain = this.synth.output.gain.value;
    this.synth.output.gain.cancelScheduledValues(now);
    this.synth.output.gain.setValueAtTime(currentGain, now);
    this.synth.output.gain.linearRampToValueAtTime( 1 - distance, now + 0.050);

    this.inZone = inZone;
  };
MIXIN$0(SynthDrone.prototype,proto$0);proto$0=void 0;return SynthDrone;})();

module.exports = SynthDrone;