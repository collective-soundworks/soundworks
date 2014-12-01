var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var audioContext = require('audio-context');
var scheduler = require('simple-scheduler');
var loaders = require('loaders');
var SegmentEngine = require('segment-engine');

'use strict';

var Birds = (function(){"use strict";var proto$0={};
  function Birds(buffer) {
    this.audioBuffers = [];
    this.markerBuffers = [];
    this.sortedMarkerIndices = [];
    this.bufferIndex = -1;

    this.minCutoff = 20;
    this.maxCutoff = 20000;
    this.logCutoffRatio = Math.log(this.maxCutoff / this.minCutoff);

    this.engine = new SegmentEngine();

    this.engine.periodAbs = 0;
    this.engine.periodRel = 0.5;
    this.engine.durationAbs = 0;
    this.engine.durationRel = 1;
    this.engine.offset = 0;
    this.engine.attackAbs = 0.005;
    this.engine.attackRel = 0.0;
    this.engine.releaseAbs = 0.0;
    this.engine.releaseRel = 0.25;
    this.engine.resamplingVar = 100;
    this.engine.gain = 1.0;

    this.level = audioContext.createGain();
    this.engine.connect(this.level);

    // audio i/o
    this.input = null;
    this.output = this.level;
  }DP$0(Birds,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  proto$0.setIntensity = function(value) {
    function getNearestIndexByValue(sortedArray, value, randomVar) {
      var size = sortedArray.length;
      var index = 0;

      if (size > 0) {
        var firstVal = sortedArray[randomVar].value;
        var lastVal = sortedArray[size - 1 - randomVar].value;

        if (value <= firstVal)
          index = randomVar;
        else if (value >= lastVal)
          index = size - 1 - randomVar;
        else {
          if (index < 0 || index >= size)
            index = Math.floor((size - 1) * (value - firstVal) / (lastVal - firstVal) + 0.5);

          while (sortedArray[index].value > value)
            index--;

          while (sortedArray[index + 1].value <= value)
            index++;

          if ((value - sortedArray[index].value) >= (sortedArray[index + 1].value - value))
            index++;
        }
      }

      index += (Math.floor(2 * randomVar * Math.random()) - randomVar);

      return sortedArray[index].index;
    }

    this.engine.gain = value;
    this.engine.segmentIndex = getNearestIndexByValue(this.sortedMarkerIndices[this.bufferIndex], value, 3);
  };

  proto$0.trigger = function() {
    this.engine.segmentIndex = segmentIndex;
    this.engine.trigger();
  };

  proto$0.start = function(index) {
    var audioBuffer = this.audioBuffers[index];
    var markerBuffer = this.markerBuffers[index];

    if (audioBuffer && markerBuffer) {
      this.engine.buffer = audioBuffer;
      this.engine.positionArray = markerBuffer.time;
      this.engine.durationArray = markerBuffer.duration;

      this.bufferDuration = audioBuffer.duration;

      if (this.bufferIndex < 0)
        scheduler.add(this.engine);

      this.bufferIndex = index;
    }
  };

  proto$0.stop = function() {
    if (this.bufferIndex >= 0) {
      scheduler.remove(this.engine);
      this.bufferIndex = -1;
    }
  };
MIXIN$0(Birds.prototype,proto$0);proto$0=void 0;return Birds;})();

var SynthBirds = (function(){"use strict";var proto$0={};
  function SynthBirds(soundFileName, markerFileName) {
    this.synth = new Birds();
    this.synth.periodRel = 0.25;
    this.synth.periodAbs = 0;
    this.synth.durationRel = 1;
    this.synth.durationAbs = 0;
    this.synth.output.connect(audioContext.destination);

    var that = this;

    new loaders.AudioBufferLoader()
      .load(soundFileName)
      .then(function(audioBuffer) {
        that.synth.audioBuffers[0] = audioBuffer; // store audio buffer
      });

    new loaders.Loader("json")
      .load(markerFileName)
      .then(function(markerArray) {
        if (typeof markerArray === "string")
          markerArray = JSON.parse(markerArray);

        that.synth.markerBuffers[0] = markerArray;
        that.synth.sortedMarkerIndices[0] = [];

        for (var i = 0; i < markerArray.energy.length; i++) {
          var pair = {
            "value": markerArray.energy[i],
            "index": i
          };

          that.synth.sortedMarkerIndices[0].push(pair);
        }

        that.synth.sortedMarkerIndices[0].sort(function(a, b) {
          return a.value - b.value;
        });
      });

    this.inZone = false;
  }DP$0(SynthBirds,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  proto$0.update = function(distance, speed) {
    var inZone = (distance < 1);

    if (inZone) {
      if (!this.inZone) {
        this.synth.start(0);
      }

      this.synth.setIntensity(speed);
    } else if (this.inZone) {
      this.synth.stop();
    }

    var now = audioContext.currentTime;
    var currentGain = this.synth.output.gain.value;
    this.synth.output.gain.cancelScheduledValues(now);
    this.synth.output.gain.setValueAtTime(currentGain, now);

    var gain = 1 - distance;
    var duration = 0.050;

    if (gain < 0.25)
      gain = 0.25;

    if (gain < currentGain)
      duration = 0.4;

    this.synth.output.gain.linearRampToValueAtTime(gain, now + duration);

    this.inZone = inZone;
  };
MIXIN$0(SynthBirds.prototype,proto$0);proto$0=void 0;return SynthBirds;})();

module.exports = SynthBirds;