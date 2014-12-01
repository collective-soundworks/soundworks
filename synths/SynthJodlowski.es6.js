var audioContext = require('audio-context');
var scheduler = require('simple-scheduler');
var loaders = require('loaders');
var GranularEngine = require('granular-engine');

'use strict';

class Jodlowski {
  constructor() {
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
  }

  setPosition(value) {
    this.granular.position = value;
  }

  setPitch(value) {
    this.granular.resampling = value;
  }

  setGain(value) {
    this.granular.gain = value;
  }

  setIntensity(value) {
    var position = value * 30 + Math.random() * 10;

    if (position < 0.200)
      position = 0.200;
    else if (position > 39.800)
      position = 39.800;

    this.granular.position = position;
    this.granular.gain = value;
  }

  start(index) {
    var buffer = this.buffers[index];

    if (buffer) {
      this.granular.buffer = buffer;
      this.bufferDuration = buffer.duration;

      if (this.bufferIndex < 0)
        scheduler.add(this.granular);

      this.bufferIndex = index;
    }
  }

  stop() {
    if (this.bufferIndex >= 0) {
      scheduler.remove(this.granular);
      this.bufferIndex = -1;
    }
  }
}

class SynthJodlowski {
  constructor(fileName) {
    this.synth = new Jodlowski();
    this.synth.output.connect(audioContext.destination);

    var that = this;

    new loaders.AudioBufferLoader()
      .load(fileName)
      .then(function(audioBuffer) {
        that.synth.buffers[0] = audioBuffer;
      });

    this.inZone = false;
  }

  update(distance, speed) {
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
  }
}

module.exports = SynthJodlowski;