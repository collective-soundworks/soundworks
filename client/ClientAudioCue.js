var audioContext = require('audio-context');

'use strict';

var ClientAudioCue = (function(){"use strict";var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var proto$0={};
  function ClientAudioCue() {}DP$0(ClientAudioCue,"prototype",{"configurable":false,"enumerable":false,"writable":false});

  proto$0.beep = function() {var frequency = arguments[0];if(frequency === void 0)frequency = 600;var gain = arguments[1];if(gain === void 0)gain = 1;var duration = arguments[2];if(duration === void 0)duration = 0.2;
    var time = audioContext.currentTime;
    var clickAttack = 0.001
    var clickRelease = duration - clickAttack;
    var o = audioContext.createOscillator();
    var g = audioContext.createGain();

    if(clickRelease < clickAttack)
      clickRelease = clickAttack;

    g.gain.value = 0;
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(0.5, time + clickAttack);
    g.gain.exponentialRampToValueAtTime(0.0000001, time + clickAttack + clickRelease);
    g.gain.setValueAtTime(0, time);
    g.connect(audioContext.destination);

    o.connect(g);
    o.frequency.value = frequency;
    o.start(time);
    o.stop(time + clickAttack + clickRelease);
  };
MIXIN$0(ClientAudioCue.prototype,proto$0);proto$0=void 0;return ClientAudioCue;})();

module.exports = new ClientAudioCue();