var audioContext = require('audio-context');

'use strict';

class ClientAudioCue {
  constructor() {}

  beep(frequency = 600, gain = 1, duration = 0.2) {
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
  }
}

module.exports = new ClientAudioCue();