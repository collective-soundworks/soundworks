var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var audioContext = require('audio-context');
var scheduler = require('simple-scheduler');
var loaders = require('loaders');
var GranularEngine = require('granular-engine');
var filters = require('../components.TODO/filters');

'use strict';

var Electric = (function(){"use strict";var proto$0={};
  function Electric() {
    this.minCutoff = 1000;
    this.maxCutoff = 44100;
    this.logCutoffRatio = Math.log(this.maxCutoff / this.minCutoff);

    this.output = audioContext.createGain();

    this.gain = audioContext.createGain();
    this.gain.connect(this.output);
    this.gain.gain.value = 0.0;

    this.lowpass = audioContext.createBiquadFilter();
    this.gain.connect(this.gain);
    this.lowpass.type = 0;
    this.lowpass.frequency.value = 0;
    this.lowpass.Q.value = 3;
    this.lowpass.connect(this.gain);

    this.synth = new GranularEngine();
    this.synth.connect(this.lowpass);
    this.synth.positionVar = 0.05;
    this.synth.periodAbs = 0.04;
    this.synth.periodRel = 0.0;
    this.synth.periodVar = 0.5;
    this.synth.durationAbs = 0.16;
    this.synth.durationRel = 0.0;
    this.synth.attackRel = 0.5;
    this.synth.releaseRel = 0.5;
    this.synth.gain = 2.0;

    this.filter = new filters.Mvavrg(2);
    this.lastLevel = 0.0;
  }DP$0(Electric,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  proto$0.load = function(callback) {
    var that = this;

    new loaders.AudioBufferLoader()
      .load("sounds/electric.mp3")
      .then(function(audioBuffer) {
        that.synth.buffer = audioBuffer;
        if (callback)
          callback();
      });
  };

  proto$0.start = function() {
    this.lastLevel = 0.0;
    scheduler.add(this.synth);
  };

  proto$0.stop = function() {
    scheduler.remove(this.synth);
  };

  proto$0.setLevel = function(value) {
    var level = this.filter.input(value);

    if (level > 0.2)
      level = 1.25 * (level - 0.2);
    else
      level = 0.0;

    if (level < this.lastLevel)
      level = 0.75 * this.lastLevel;

    this.lastLevel = level;

    var gain = 1.0;

    if (level > 1.0)
      gain = 1.0;
    else if (level < 0.33)
      gain = 3 * level;

    this.gain.gain.value = gain;

    var margin = 0.5 * this.synth.durationAbs + this.synth.positionVar;
    var range = this.synth.buffer.duration - 2 * margin;

    this.synth.position = margin + level * range;
    this.lowpass.frequency.value = this.minCutoff * Math.exp(this.logCutoffRatio * level);
  };
MIXIN$0(Electric.prototype,proto$0);proto$0=void 0;return Electric;})();

var SynthElectric = (function(){"use strict";var proto$0={};
  function SynthElectric() {
    this.synth = new Electric();
    this.synth.load();
    this.synth.output.connect(audioContext.destination);

    this.inZone = false;
  }DP$0(SynthElectric,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  proto$0.update = function(distance, speed) {
    var inZone = (distance < 1);

    if (inZone) {
      if (!this.inZone) {
        this.synth.start();
      }

      this.synth.setLevel(speed * 0.4);
    } else if (this.inZone) {
      this.synth.stop();
    }

    var now = audioContext.currentTime;
    var currentGain = this.synth.output.gain.value;
    this.synth.output.gain.cancelScheduledValues(now);
    this.synth.output.gain.setValueAtTime(currentGain, now);
    this.synth.output.gain.linearRampToValueAtTime(1 - distance, now + 0.050);

    this.inZone = inZone;
  };
MIXIN$0(SynthElectric.prototype,proto$0);proto$0=void 0;return SynthElectric;})();

module.exports = SynthElectric;