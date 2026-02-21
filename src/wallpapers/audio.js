import * as Tone from 'tone';

let audioStarted = false;
let currentCleanup = null;

// ─── Auto-start handler ───────────────────────────────────────
export async function ensureAudioStarted() {
  if (audioStarted) return true;
  try {
    await Tone.start();
    audioStarted = true;
    return true;
  } catch {
    return false;
  }
}

export function registerAutoStart(callback) {
  const handler = async () => {
    const ok = await ensureAudioStarted();
    if (ok) {
      events.forEach(e => window.removeEventListener(e, handler));
      callback();
    }
  };
  const events = ['pointerdown', 'click', 'touchstart', 'keydown'];
  events.forEach(e => window.addEventListener(e, handler, { once: false }));
  // Also try immediately (works in wallpaper engine contexts)
  ensureAudioStarted().then(ok => {
    if (ok) {
      events.forEach(e => window.removeEventListener(e, handler));
      callback();
    }
  });
  return () => events.forEach(e => window.removeEventListener(e, handler));
}

// ─── Utility: create filtered noise ───────────────────────────
function makeNoise(type, filterFreq, filterType, vol = -20) {
  const noise = new Tone.Noise(type);
  const filter = new Tone.Filter(filterFreq, filterType);
  const autoFilter = new Tone.AutoFilter({
    frequency: 0.05 + Math.random() * 0.1,
    baseFrequency: filterFreq * 0.5,
    octaves: 2,
    depth: 0.4,
  }).start();
  const volume = new Tone.Volume(vol);
  noise.connect(filter);
  filter.connect(autoFilter);
  autoFilter.connect(volume);
  noise.start();
  return { noise, filter, autoFilter, volume };
}

// ─── Utility: create pad synth ────────────────────────────────
function makePad(notes, options = {}) {
  const {
    vol = -18,
    attack = 6,
    release = 8,
    type = 'fatsine',
    chorusFreq = 1.5,
    chorusDepth = 0.7,
    reverbDecay = 12,
    reverbWet = 0.6,
    filterFreq = 1200,
  } = options;

  const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type, spread: 30, count: 3 },
    envelope: { attack, decay: 2, sustain: 1, release },
  });
  const filter = new Tone.Filter(filterFreq, 'lowpass');
  const chorus = new Tone.Chorus(chorusFreq, 2.5, chorusDepth).start();
  const reverb = new Tone.Reverb({ decay: reverbDecay, wet: reverbWet });
  const volume = new Tone.Volume(vol);

  synth.connect(filter);
  filter.connect(chorus);
  chorus.connect(reverb);
  reverb.connect(volume);

  // Stagger note attacks for organic feel
  notes.forEach((note, i) => {
    setTimeout(() => synth.triggerAttack(note), i * 800 + Math.random() * 500);
  });

  return { synth, filter, chorus, reverb, volume };
}

// ─── Utility: create shimmer / bell layer ─────────────────────
function makeShimmer(notes, interval = 8000, options = {}) {
  const {
    vol = -26,
    attack = 2,
    release = 6,
    reverbDecay = 15,
  } = options;

  const synth = new Tone.FMSynth({
    harmonicity: 3.01,
    modulationIndex: 8,
    oscillator: { type: 'sine' },
    envelope: { attack, decay: 3, sustain: 0.3, release },
    modulation: { type: 'triangle' },
    modulationEnvelope: { attack: 0.5, decay: 1, sustain: 0.5, release: 4 },
  });
  const reverb = new Tone.Reverb({ decay: reverbDecay, wet: 0.8 });
  const delay = new Tone.FeedbackDelay('4n', 0.3);
  delay.wet.value = 0.25;
  const volume = new Tone.Volume(vol);

  synth.connect(delay);
  delay.connect(reverb);
  reverb.connect(volume);

  let idx = 0;
  const play = () => {
    const note = notes[idx % notes.length];
    synth.triggerAttackRelease(note, '2n');
    idx++;
  };
  play();
  const timer = setInterval(play, interval + Math.random() * 2000);

  return { synth, reverb, delay, volume, timer };
}

// ─── Utility: create sub-bass pulse ───────────────────────────
function makeSubBass(freq = 40, vol = -28) {
  const synth = new Tone.Synth({
    oscillator: { type: 'sine' },
    envelope: { attack: 4, decay: 0, sustain: 1, release: 6 },
  });
  const lfo = new Tone.LFO(0.08, vol - 6, vol);
  const volume = new Tone.Volume(vol);

  synth.connect(volume);
  lfo.connect(volume.volume);
  lfo.start();
  synth.triggerAttack(freq);

  return { synth, lfo, volume };
}

// ─── Utility: cricket chirps ──────────────────────────────────
function makeCrickets(vol = -32) {
  const synth = new Tone.FMSynth({
    harmonicity: 5,
    modulationIndex: 20,
    oscillator: { type: 'square' },
    envelope: { attack: 0.003, decay: 0.08, sustain: 0, release: 0.05 },
    modulation: { type: 'square' },
    modulationEnvelope: { attack: 0.002, decay: 0.05, sustain: 0, release: 0.02 },
  });
  const filter = new Tone.Filter(4000, 'bandpass');
  const reverb = new Tone.Reverb({ decay: 3, wet: 0.4 });
  const volume = new Tone.Volume(vol);

  synth.connect(filter);
  filter.connect(reverb);
  reverb.connect(volume);

  const chirp = () => {
    const count = 2 + Math.floor(Math.random() * 4);
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        synth.triggerAttackRelease(4200 + Math.random() * 800, 0.04);
      }, i * 60);
    }
  };
  chirp();
  const timer = setInterval(chirp, 3000 + Math.random() * 5000);

  return { synth, filter, reverb, volume, timer };
}

// ─── Utility: wind gusts ─────────────────────────────────────
function makeWind(vol = -22) {
  const noise = new Tone.Noise('white');
  const filter = new Tone.Filter(600, 'bandpass');
  const autoFilter = new Tone.AutoFilter({
    frequency: 0.03,
    baseFrequency: 300,
    octaves: 3,
    depth: 0.8,
  }).start();
  const volume = new Tone.Volume(vol);
  const lfo = new Tone.LFO(0.02, vol - 10, vol);
  lfo.connect(volume.volume);
  lfo.start();

  noise.connect(filter);
  filter.connect(autoFilter);
  autoFilter.connect(volume);
  noise.start();

  return { noise, filter, autoFilter, volume, lfo };
}

// ─── Dispose helper ──────────────────────────────────────────
function disposeAll(nodes) {
  if (!nodes) return;
  Object.values(nodes).flat().forEach(node => {
    if (!node) return;
    if (typeof node === 'number') { clearInterval(node); return; }
    if (node.timer) clearInterval(node.timer);
    try {
      if (node.stop) node.stop();
    } catch {}
    try {
      if (node.dispose) node.dispose();
    } catch {}
  });
}

function connectToMaster(...volumes) {
  volumes.forEach(v => v.toDestination());
}

// ═══════════════════════════════════════════════════════════════
// SCENE AUDIO SETUPS
// ═══════════════════════════════════════════════════════════════

export function startMidnightShore() {
  const ocean = makeNoise('brown', 180, 'lowpass', -16);
  const wind = makeWind(-24);
  const pad = makePad(['F2', 'C3', 'Ab3'], {
    vol: -22, type: 'fatsine', filterFreq: 800,
    reverbDecay: 18, reverbWet: 0.7, chorusFreq: 0.8,
  });
  const shimmer = makeShimmer(['C5', 'F5', 'Ab5', 'C6'], 10000, {
    vol: -30, reverbDecay: 20,
  });
  const subBass = makeSubBass(35, -30);

  connectToMaster(ocean.volume, wind.volume, pad.volume, shimmer.volume, subBass.volume);

  return () => disposeAll({ ocean, wind, pad, shimmer, subBass });
}

export function startAurorasEmbrace() {
  const ocean = makeNoise('brown', 220, 'lowpass', -18);
  const wind = makeWind(-26);
  const pad = makePad(['A2', 'E3', 'C#4', 'A4'], {
    vol: -20, type: 'fatsine', filterFreq: 1400,
    reverbDecay: 15, reverbWet: 0.65, attack: 8,
  });
  const shimmer = makeShimmer(['E5', 'A5', 'C#6', 'E6'], 7000, {
    vol: -28, reverbDecay: 18,
  });
  const crickets = makeCrickets(-30);
  const subBass = makeSubBass(45, -32);

  // Warm drone layer
  const drone = new Tone.AMSynth({
    harmonicity: 2,
    oscillator: { type: 'sine' },
    envelope: { attack: 8, decay: 0, sustain: 1, release: 8 },
    modulation: { type: 'triangle' },
    modulationEnvelope: { attack: 4, decay: 0, sustain: 1, release: 6 },
  });
  const droneReverb = new Tone.Reverb({ decay: 20, wet: 0.7 });
  const droneVol = new Tone.Volume(-26);
  drone.connect(droneReverb);
  droneReverb.connect(droneVol);
  droneVol.toDestination();
  drone.triggerAttack('A2');

  connectToMaster(ocean.volume, wind.volume, pad.volume, shimmer.volume, crickets.volume, subBass.volume);

  return () => {
    disposeAll({ ocean, wind, pad, shimmer, crickets, subBass });
    try { drone.triggerRelease(); } catch {}
    setTimeout(() => {
      try { drone.dispose(); droneReverb.dispose(); droneVol.dispose(); } catch {}
    }, 500);
  };
}

export function startCelestialWanderers() {
  const cosmicDust = makeNoise('pink', 400, 'bandpass', -26);
  const pad = makePad(['D3', 'A3', 'F#4'], {
    vol: -18, type: 'fatsawtooth', filterFreq: 600,
    reverbDecay: 22, reverbWet: 0.8, chorusFreq: 2, chorusDepth: 0.9,
    attack: 10,
  });
  const shimmer = makeShimmer(['F#5', 'A5', 'D6', 'F#6', 'A6'], 6000, {
    vol: -26, reverbDecay: 25, attack: 1.5,
  });
  const subBass = makeSubBass(30, -28);

  // Ethereal arpeggio layer
  const arp = new Tone.FMSynth({
    harmonicity: 5,
    modulationIndex: 3,
    oscillator: { type: 'sine' },
    envelope: { attack: 0.5, decay: 2, sustain: 0.1, release: 4 },
    modulation: { type: 'triangle' },
    modulationEnvelope: { attack: 0.3, decay: 1, sustain: 0.3, release: 3 },
  });
  const arpReverb = new Tone.Reverb({ decay: 20, wet: 0.85 });
  const arpDelay = new Tone.FeedbackDelay('8n.', 0.4);
  arpDelay.wet.value = 0.35;
  const arpVol = new Tone.Volume(-30);
  arp.connect(arpDelay);
  arpDelay.connect(arpReverb);
  arpReverb.connect(arpVol);
  arpVol.toDestination();

  const arpNotes = ['D5', 'F#5', 'A5', 'D6', 'A5', 'F#5'];
  let arpIdx = 0;
  const arpTimer = setInterval(() => {
    arp.triggerAttackRelease(arpNotes[arpIdx % arpNotes.length], '4n');
    arpIdx++;
  }, 4000 + Math.random() * 3000);

  connectToMaster(cosmicDust.volume, pad.volume, shimmer.volume, subBass.volume);

  return () => {
    clearInterval(arpTimer);
    disposeAll({ cosmicDust, pad, shimmer, subBass });
    try { arp.dispose(); arpReverb.dispose(); arpDelay.dispose(); arpVol.dispose(); } catch {}
  };
}

export function startEclipseOfHearts() {
  const rumble = makeNoise('brown', 100, 'lowpass', -14);
  const pad = makePad(['Eb2', 'Bb2', 'Gb3'], {
    vol: -18, type: 'fatsawtooth', filterFreq: 400,
    reverbDecay: 12, reverbWet: 0.5, chorusDepth: 0.3,
    attack: 8,
  });
  const subBass = makeSubBass(25, -22);

  // Dissonant tension layer
  const tension = new Tone.Synth({
    oscillator: { type: 'sawtooth' },
    envelope: { attack: 6, decay: 0, sustain: 1, release: 8 },
  });
  const tensionFilter = new Tone.Filter(300, 'lowpass');
  const tensionReverb = new Tone.Reverb({ decay: 8, wet: 0.4 });
  const tensionVol = new Tone.Volume(-24);
  tension.connect(tensionFilter);
  tensionFilter.connect(tensionReverb);
  tensionReverb.connect(tensionVol);
  tensionVol.toDestination();
  tension.triggerAttack('Eb2');

  // Detuned secondary
  const detune = new Tone.Synth({
    oscillator: { type: 'sine', detune: 15 },
    envelope: { attack: 8, decay: 0, sustain: 1, release: 8 },
  });
  const detuneVol = new Tone.Volume(-28);
  detune.connect(detuneVol);
  detuneVol.toDestination();
  detune.triggerAttack('E2');

  // Sparse unsettling tones
  const bell = new Tone.FMSynth({
    harmonicity: 7,
    modulationIndex: 12,
    oscillator: { type: 'sine' },
    envelope: { attack: 0.01, decay: 4, sustain: 0, release: 3 },
  });
  const bellReverb = new Tone.Reverb({ decay: 10, wet: 0.7 });
  const bellVol = new Tone.Volume(-32);
  bell.connect(bellReverb);
  bellReverb.connect(bellVol);
  bellVol.toDestination();

  const bellTimer = setInterval(() => {
    if (Math.random() > 0.4) {
      bell.triggerAttackRelease(['Gb4', 'A4', 'Db5', 'E5'][Math.floor(Math.random() * 4)], '8n');
    }
  }, 6000 + Math.random() * 4000);

  connectToMaster(rumble.volume, pad.volume, subBass.volume);

  return () => {
    clearInterval(bellTimer);
    disposeAll({ rumble, pad, subBass });
    try { tension.triggerRelease(); detune.triggerRelease(); } catch {}
    setTimeout(() => {
      try {
        tension.dispose(); tensionFilter.dispose(); tensionReverb.dispose(); tensionVol.dispose();
        detune.dispose(); detuneVol.dispose();
        bell.dispose(); bellReverb.dispose(); bellVol.dispose();
      } catch {}
    }, 500);
  };
}

export function startStarbornReunion() {
  const cosmicDust = makeNoise('pink', 500, 'bandpass', -28);
  const pad = makePad(['C3', 'G3', 'E4', 'B4'], {
    vol: -16, type: 'fatsine', filterFreq: 1800,
    reverbDecay: 25, reverbWet: 0.8, chorusFreq: 1.2, chorusDepth: 0.8,
    attack: 10,
  });
  const shimmer = makeShimmer(['G5', 'B5', 'E6', 'G6', 'B6'], 5000, {
    vol: -24, reverbDecay: 28, attack: 1,
  });
  const subBass = makeSubBass(40, -30);

  // Warm choir-like layer
  const choir = new Tone.PolySynth(Tone.AMSynth, {
    harmonicity: 2,
    oscillator: { type: 'sine' },
    envelope: { attack: 8, decay: 2, sustain: 1, release: 10 },
    modulation: { type: 'sine' },
    modulationEnvelope: { attack: 4, decay: 0, sustain: 1, release: 8 },
  });
  const choirChorus = new Tone.Chorus(0.5, 3, 0.6).start();
  const choirReverb = new Tone.Reverb({ decay: 30, wet: 0.85 });
  const choirVol = new Tone.Volume(-22);
  choir.connect(choirChorus);
  choirChorus.connect(choirReverb);
  choirReverb.connect(choirVol);
  choirVol.toDestination();
  setTimeout(() => choir.triggerAttack(['E3', 'G3', 'B3']), 2000);

  // Golden bell chimes
  const bell = new Tone.FMSynth({
    harmonicity: 4,
    modulationIndex: 2,
    oscillator: { type: 'sine' },
    envelope: { attack: 0.01, decay: 6, sustain: 0, release: 5 },
    modulation: { type: 'sine' },
    modulationEnvelope: { attack: 0.2, decay: 2, sustain: 0.2, release: 4 },
  });
  const bellReverb = new Tone.Reverb({ decay: 20, wet: 0.8 });
  const bellDelay = new Tone.FeedbackDelay('4n', 0.35);
  bellDelay.wet.value = 0.3;
  const bellVol = new Tone.Volume(-28);
  bell.connect(bellDelay);
  bellDelay.connect(bellReverb);
  bellReverb.connect(bellVol);
  bellVol.toDestination();

  const bellNotes = ['E5', 'G5', 'B5', 'E6', 'B5', 'G5', 'D6', 'B5'];
  let bellIdx = 0;
  const bellTimer = setInterval(() => {
    bell.triggerAttackRelease(bellNotes[bellIdx % bellNotes.length], '2n');
    bellIdx++;
  }, 3500 + Math.random() * 2000);

  connectToMaster(cosmicDust.volume, pad.volume, shimmer.volume, subBass.volume);

  return () => {
    clearInterval(bellTimer);
    disposeAll({ cosmicDust, pad, shimmer, subBass });
    try { choir.triggerRelease(); } catch {}
    setTimeout(() => {
      try {
        choir.dispose(); choirChorus.dispose(); choirReverb.dispose(); choirVol.dispose();
        bell.dispose(); bellReverb.dispose(); bellDelay.dispose(); bellVol.dispose();
      } catch {}
    }, 500);
  };
}

// ─── Scene audio map ──────────────────────────────────────────
const AUDIO_MAP = {
  'midnight-shore': startMidnightShore,
  'auroras-embrace': startAurorasEmbrace,
  'celestial-wanderers': startCelestialWanderers,
  'eclipse-of-hearts': startEclipseOfHearts,
  'starborn-reunion': startStarbornReunion,
};

export function startSceneAudio(sceneId) {
  if (currentCleanup) {
    currentCleanup();
    currentCleanup = null;
  }
  const startFn = AUDIO_MAP[sceneId];
  if (startFn) {
    currentCleanup = startFn();
  }
  return () => {
    if (currentCleanup) {
      currentCleanup();
      currentCleanup = null;
    }
  };
}

export function stopAllAudio() {
  if (currentCleanup) {
    currentCleanup();
    currentCleanup = null;
  }
}
