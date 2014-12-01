var audioContext = require('audio-context');
var scheduler = require('simple-scheduler');
var loaders = require('loaders');
var GranularEngine = require('granular-engine');
var filters = require('../components.TODO/filters');

'use strict';

class Electric {
  constructor() {
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
  }

  load(callback) {
    var that = this;

    new loaders.AudioBufferLoader()
      .load("sounds/electric.mp3")
      .then(function(audioBuffer) {
        that.synth.buffer = audioBuffer;
        if (callback)
          callback();
      });
  }

  start() {
    this.lastLevel = 0.0;
    scheduler.add(this.synth);
  }

  stop() {
    scheduler.remove(this.synth);
  }

  setLevel(value) {
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
  }
}

class SynthElectric {
  constructor() {
    this.synth = new Electric();
    this.synth.load();
    this.synth.output.connect(audioContext.destination);

    this.inZone = false;
  }

  update(distance, speed) {
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
  }
}

module.exports = SynthElectric;