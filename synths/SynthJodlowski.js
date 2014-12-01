var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var audioContext = require('audio-context');
var scheduler = require('simple-scheduler');
var loaders = require('loaders');
var GranularEngine = require('granular-engine');

'use strict';

var Jodlowski = (function(){"use strict";var proto$0={};
  function Jodlowski() {
    this.buffers = [];
    this.bufferIndex = -1;
    this.bufferDuration = 0;

    this.minCutoff = 20;
    this.maxCutoff = 20000;
    this.logCutoffRatio = Math.log(this.maxCutoff / this.minCutoff);

    this.granular = new GranularEngine();

    this.granular.centered = false;
    this.granular.positionVar = 0.200;
    this.granular.periodAbs = 0.050;
    this.granular.periodRel = 0.0;
    this.granular.durationAbs = 1.000;
    this.granular.durationRel = 0.0;
    this.granular.resamplingVar = 500;
    this.granular.gain = 1.0;

    this.level = audioContext.createGain();
    this.granular.connect(this.level);

    // audio i/o
    this.input = null;
    this.output = this.level;
  }DP$0(Jodlowski,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  proto$0.setPosition = function(value) {
    this.granular.position = value;
  };

  proto$0.setPitch = function(value) {
    this.granular.resampling = value;
  };

  proto$0.setGain = function(value) {
    this.granular.gain = value;
  };

  proto$0.setIntensity = function(value) {
    var position = value * 30 + Math.random() * 10;

    if (position < 0.200)
      position = 0.200;
    else if (position > 39.800)
      position = 39.800;

    this.granular.position = position;
    this.granular.gain = value;
  };

  proto$0.start = function(index) {
    var buffer = this.buffers[index];

    if (buffer) {
      this.granular.buffer = buffer;
      this.bufferDuration = buffer.duration;

      if (this.bufferIndex < 0)
        scheduler.add(this.granular);

      this.bufferIndex = index;
    }
  };

  proto$0.stop = function() {
    if (this.bufferIndex >= 0) {
      scheduler.remove(this.granular);
      this.bufferIndex = -1;
    }
  };
MIXIN$0(Jodlowski.prototype,proto$0);proto$0=void 0;return Jodlowski;})();

var SynthJodlowski = (function(){"use strict";var proto$0={};
  function SynthJodlowski(fileName) {
    this.synth = new Jodlowski();
    this.synth.output.connect(audioContext.destination);

    var that = this;

    new loaders.AudioBufferLoader()
      .load(fileName)
      .then(function(audioBuffer) {
        that.synth.buffers[0] = audioBuffer;
      });

    this.inZone = false;
  }DP$0(SynthJodlowski,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  proto$0.update = function(distance, speed) {
    var inZone = (distance < 1);

    if (inZone) {
      if (!this.inZone) {
        this.synth.start(0);
      }

      var intensity = Math.max(speed, 0.25);
      this.synth.setIntensity(intensity);
    } else if (this.inZone) {
      this.synth.stop();
    }

    var now = audioContext.currentTime;
    var currentGain = this.synth.output.gain.value;
    this.synth.output.gain.cancelScheduledValues(now);
    this.synth.output.gain.setValueAtTime(currentGain, now);

    var gain = 1 - distance;
    var duration = 0.050;

    if(gain < currentGain)
      duration = 0.4;

    this.synth.output.gain.linearRampToValueAtTime(gain, now + duration);

    this.inZone = inZone;
  };
MIXIN$0(SynthJodlowski.prototype,proto$0);proto$0=void 0;return SynthJodlowski;})();

module.exports = SynthJodlowski;