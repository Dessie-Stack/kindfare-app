/* KindFare Sound System — synthesized entirely in-browser via Web Audio API, no external audio files.
   Ported from the original KindFare prototype build (2026-08-08). One shared pentatonic voice
   (C5 D5 E5 G5 A5 C6) reused across every event; each tone layers a quiet triangle-wave harmonic
   so a single tap has body instead of reading as a flat beep. Muteable via KindFareSound.setEnabled. */
(function(){
  "use strict";
  var AudioCtxClass = window.AudioContext || window.webkitAudioContext;
  var audioCtx = null;
  var soundOn = true;
  try {
    var raw = localStorage.getItem('kf-sound-on');
    if (raw !== null) soundOn = raw === '1';
  } catch(e){}

  function ensureCtx(){
    if(!AudioCtxClass) return null;
    if(!audioCtx){
      try { audioCtx = new AudioCtxClass(); } catch(e){ return null; }
    }
    if(audioCtx.state === 'suspended'){ audioCtx.resume(); }
    return audioCtx;
  }

  function playTone(freq, dur, vol, cutoff, delay, layerRatio, layerDelay){
    if(!soundOn) return;
    var ctx = ensureCtx();
    if(!ctx) return;
    var t0 = ctx.currentTime + (delay || 0);
    var endAt = t0 + (dur || 0.15);
    var filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = cutoff || 3000;
    filter.connect(ctx.destination);

    function addLayer(f, gainMul, wave, startOffset){
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = wave;
      osc.frequency.value = f;
      var peak = Math.max((vol || 0.04) * gainMul, 0.0002);
      var start = t0 + (startOffset || 0);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(peak, start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, endAt);
      osc.connect(gain);
      gain.connect(filter);
      osc.start(start);
      osc.stop(endAt + 0.03);
    }
    addLayer(freq, 1, 'sine', 0);
    if(layerRatio){ addLayer(freq * layerRatio, 0.32, 'triangle', layerDelay || 0.008); }
  }

  function playSequence(freqs, dur, vol, cutoff, gap, layerRatio){
    for(var i = 0; i < freqs.length; i++){
      playTone(freqs[i], dur, vol, cutoff, i * (gap || 0.07), layerRatio);
    }
  }

  var NOTE = { C5:523.25, D5:587.33, E5:659.25, G5:783.99, A5:880.00, C6:1046.50 };

  window.KindFareSound = {
    setEnabled: function(v){
      soundOn = !!v;
      try { localStorage.setItem('kf-sound-on', soundOn ? '1' : '0'); } catch(e){}
    },
    isEnabled: function(){ return soundOn; },
    tabSwitch: function(){ playTone(NOTE.C5, 0.09, 0.026, 2200); },
    tap: function(){ playTone(NOTE.D5, 0.08, 0.03, 2600, 0, 2); },
    success: function(){ playSequence([NOTE.E5, NOTE.G5], 0.16, 0.045, 3400, 0.07, 2); },
    overlayIn: function(){ playSequence([NOTE.C5, NOTE.G5], 0.18, 0.035, 3000, 0.06); },
    overlayOut: function(){ playSequence([NOTE.G5, NOTE.C5], 0.16, 0.03, 2400, 0.05); },
    streak: function(){ playSequence([NOTE.C5, NOTE.E5, NOTE.G5], 0.22, 0.05, 3600, 0.09, 2); },
    miaMessage: function(){ playSequence([NOTE.A5, NOTE.C6], 0.15, 0.04, 3200, 0.06, 2); },
    notify: function(){ playTone(NOTE.G5, 0.14, 0.038, 2800, 0, 1.5); }
  };
})();
