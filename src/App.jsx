import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- AMBIENT AUDIO ENGINE (Web Audio API) ---

class AmbientAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.activeNodes = [];
    this.currentScene = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0;
    this.masterGain.connect(this.ctx.destination);
    // Fade master in smoothly
    this.masterGain.gain.linearRampToValueAtTime(0.6, this.ctx.currentTime + 2);
    this.initialized = true;
  }

  _createNoise(duration = 2) {
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    return source;
  }

  _fadeOut(gainNode, time = 3) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(gainNode.gain.value, now);
    gainNode.gain.linearRampToValueAtTime(0, now + time);
  }

  _fadeIn(gainNode, target, time = 3) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(gainNode.gain.value, now);
    gainNode.gain.linearRampToValueAtTime(target, now + time);
  }

  stopAll(fadeTime = 3) {
    this.activeNodes.forEach(({ gains }) => {
      gains.forEach(g => this._fadeOut(g, fadeTime));
    });
    setTimeout(() => {
      this.activeNodes.forEach(({ sources }) => {
        sources.forEach(s => { try { s.stop(); } catch(e) {} });
      });
      this.activeNodes = [];
    }, fadeTime * 1000 + 200);
  }

  // --- SCENE: Coastline (ocean waves + distant wind) ---
  playCoastline(bright = false) {
    if (!this.ctx) return;
    this.stopAll(2);
    this.currentScene = 'coastline';

    const sources = [];
    const gains = [];

    // Ocean rumble: filtered noise with slow LFO modulation
    const ocean = this._createNoise(4);
    const oceanFilter = this.ctx.createBiquadFilter();
    oceanFilter.type = 'lowpass';
    oceanFilter.frequency.value = bright ? 350 : 250;
    oceanFilter.Q.value = 1;

    const oceanGain = this.ctx.createGain();
    oceanGain.gain.value = 0;

    // LFO for wave-like volume swell
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.value = 0.12; // slow breathing rhythm
    lfoGain.gain.value = bright ? 0.06 : 0.04;
    lfo.connect(lfoGain);
    lfoGain.connect(oceanGain.gain);
    lfo.start();

    ocean.connect(oceanFilter);
    oceanFilter.connect(oceanGain);
    oceanGain.connect(this.masterGain);
    ocean.start();
    this._fadeIn(oceanGain, bright ? 0.15 : 0.1, 3);
    sources.push(ocean, lfo);
    gains.push(oceanGain);

    // Wind layer: higher-filtered noise, very soft
    const wind = this._createNoise(3);
    const windFilter = this.ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.frequency.value = bright ? 1200 : 800;
    windFilter.Q.value = 0.5;

    const windGain = this.ctx.createGain();
    windGain.gain.value = 0;

    wind.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(this.masterGain);
    wind.start();
    this._fadeIn(windGain, 0.03, 5);
    sources.push(wind);
    gains.push(windGain);

    // Gentle tonal pad (two detuned oscillators)
    const pad1 = this.ctx.createOscillator();
    const pad2 = this.ctx.createOscillator();
    pad1.type = 'sine';
    pad2.type = 'sine';
    pad1.frequency.value = bright ? 220 : 174.6; // F3 or A3
    pad2.frequency.value = bright ? 330 : 261.6; // E4 or C4

    const padGain = this.ctx.createGain();
    padGain.gain.value = 0;

    const padFilter = this.ctx.createBiquadFilter();
    padFilter.type = 'lowpass';
    padFilter.frequency.value = 600;

    pad1.connect(padFilter);
    pad2.connect(padFilter);
    padFilter.connect(padGain);
    padGain.connect(this.masterGain);
    pad1.start();
    pad2.start();
    this._fadeIn(padGain, bright ? 0.07 : 0.05, 4);
    sources.push(pad1, pad2);
    gains.push(padGain);

    this.activeNodes.push({ sources, gains });
  }

  // --- SCENE: Deep Space (ethereal drone + shimmer) ---
  playSpace(tense = false, reconciled = false) {
    if (!this.ctx) return;
    this.stopAll(2.5);
    this.currentScene = 'space';

    const sources = [];
    const gains = [];

    // Base frequency shifts with mood
    const baseFreq = tense ? 100 : reconciled ? 196 : 130.8; // C3, G3, or lower
    const thirdFreq = tense ? 119 : reconciled ? 247 : 164.8; // minor or major third

    // Deep drone pad
    const drone1 = this.ctx.createOscillator();
    const drone2 = this.ctx.createOscillator();
    drone1.type = 'sine';
    drone2.type = 'triangle';
    drone1.frequency.value = baseFreq;
    drone2.frequency.value = thirdFreq;

    const droneGain = this.ctx.createGain();
    droneGain.gain.value = 0;

    const droneFilter = this.ctx.createBiquadFilter();
    droneFilter.type = 'lowpass';
    droneFilter.frequency.value = tense ? 400 : 800;

    drone1.connect(droneFilter);
    drone2.connect(droneFilter);
    droneFilter.connect(droneGain);
    droneGain.connect(this.masterGain);
    drone1.start();
    drone2.start();
    this._fadeIn(droneGain, tense ? 0.06 : 0.08, 3);
    sources.push(drone1, drone2);
    gains.push(droneGain);

    // Cosmic shimmer: very high, quiet sine with slow vibrato
    const shimmer = this.ctx.createOscillator();
    shimmer.type = 'sine';
    shimmer.frequency.value = reconciled ? 880 : 660;

    const shimmerVibrato = this.ctx.createOscillator();
    const shimmerVibratoGain = this.ctx.createGain();
    shimmerVibrato.frequency.value = 0.3;
    shimmerVibratoGain.gain.value = 4;
    shimmerVibrato.connect(shimmerVibratoGain);
    shimmerVibratoGain.connect(shimmer.frequency);
    shimmerVibrato.start();

    const shimmerGain = this.ctx.createGain();
    shimmerGain.gain.value = 0;

    shimmer.connect(shimmerGain);
    shimmerGain.connect(this.masterGain);
    shimmer.start();
    this._fadeIn(shimmerGain, tense ? 0.01 : 0.025, 4);
    sources.push(shimmer, shimmerVibrato);
    gains.push(shimmerGain);

    // Space dust: very faint filtered noise
    const dust = this._createNoise(3);
    const dustFilter = this.ctx.createBiquadFilter();
    dustFilter.type = 'bandpass';
    dustFilter.frequency.value = tense ? 500 : 1500;
    dustFilter.Q.value = 2;

    const dustGain = this.ctx.createGain();
    dustGain.gain.value = 0;

    dust.connect(dustFilter);
    dustFilter.connect(dustGain);
    dustGain.connect(this.masterGain);
    dust.start();
    this._fadeIn(dustGain, 0.015, 5);
    sources.push(dust);
    gains.push(dustGain);

    // Reconciliation warmth: extra harmonic layer
    if (reconciled) {
      const warm = this.ctx.createOscillator();
      warm.type = 'sine';
      warm.frequency.value = 392; // G4

      const warm2 = this.ctx.createOscillator();
      warm2.type = 'sine';
      warm2.frequency.value = 494; // B4

      const warmGain = this.ctx.createGain();
      warmGain.gain.value = 0;

      warm.connect(warmGain);
      warm2.connect(warmGain);
      warmGain.connect(this.masterGain);
      warm.start();
      warm2.start();
      this._fadeIn(warmGain, 0.04, 5);
      sources.push(warm, warm2);
      gains.push(warmGain);
    }

    this.activeNodes.push({ sources, gains });
  }

  // --- SFX: Soft chime on click/advance ---
  playChime(note = 'default') {
    if (!this.ctx) return;

    const freqMap = {
      default: 523.25,  // C5
      moon: 659.25,     // E5
      tender: 440,      // A4
      resolve: 784,     // G5
    };
    const freq = freqMap[note] || freqMap.default;

    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;

    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = freq * 1.5; // perfect fifth

    const gain = this.ctx.createGain();
    gain.gain.value = 0.12;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2000;

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc2.start();

    // Quick attack, slow decay
    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

    osc.stop(now + 3);
    osc2.stop(now + 3);
  }

  // --- SFX: Transition whoosh ---
  playWhoosh() {
    if (!this.ctx) return;

    const noise = this._createNoise(2);
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 5;

    const gain = this.ctx.createGain();
    gain.gain.value = 0;

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start();

    const now = this.ctx.currentTime;
    // Sweep filter frequency up then down
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.exponentialRampToValueAtTime(2000, now + 0.8);
    filter.frequency.exponentialRampToValueAtTime(300, now + 2);

    gain.gain.linearRampToValueAtTime(0.08, now + 0.3);
    gain.gain.linearRampToValueAtTime(0, now + 2.2);

    noise.stop(now + 2.5);
  }

  destroy() {
    this.stopAll(0.5);
    setTimeout(() => {
      if (this.ctx && this.ctx.state !== 'closed') {
        this.ctx.close();
      }
      this.initialized = false;
    }, 1000);
  }
}

// --- NARRATIVE DATA ---
const STORY = {
  0: { text: "Every story begins with a moment… ours begins with a click.", hint: "Click the moon to let the story unfold." },
  1: { text: "" }, // Transition
  2: { text: "Two travelers crossed endless space… not knowing their orbits were meant to meet." },
  3: { text: "They laughed in zero gravity." },
  4: { text: "They built constellations out of memories." },
  5: { text: "They learned each other's silences." },
  6: { text: "But sometimes, even stars pull too close." },
  7: { text: "Sometimes love tries too hard to protect… and forgets to trust." },
  8: { text: "Love is not a cage. Love is a sky." },
  9: { text: "I thought guarding you meant loving you.", isDialogue: true },
  10: { text: "But loving you means standing beside you.", isDialogue: true },
  11: { text: "I'm sorry… not just for holding too tight, but for forgetting how strong you are.", isDialogue: true },
  12: { text: "Some stories don't end with grand gestures…" },
  13: { text: "They end with understanding.", hint: "Press anywhere to return to our sky." },
  14: { text: "" }
};

// --- CUSTOM STYLES (Animations & Keyframes) ---
const CustomStyles = () => (
  <style dangerouslySetInnerHTML={{__html: `
    @keyframes twinkle {
      0%, 100% { opacity: 0.2; transform: scale(0.8); }
      50% { opacity: 1; transform: scale(1.2); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
    @keyframes auroraWave1 {
      0% { transform: translateX(-5%) skewX(-5deg); opacity: 0.4; }
      50% { transform: translateX(5%) skewX(5deg); opacity: 0.7; }
      100% { transform: translateX(-5%) skewX(-5deg); opacity: 0.4; }
    }
    @keyframes auroraWave2 {
      0% { transform: translateX(5%) skewX(5deg); opacity: 0.3; }
      50% { transform: translateX(-5%) skewX(-5deg); opacity: 0.6; }
      100% { transform: translateX(5%) skewX(5deg); opacity: 0.3; }
    }
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    @keyframes planetEmerge {
      0% { transform: scale(0) translateY(100px); opacity: 0; filter: blur(10px); }
      100% { transform: scale(1) translateY(0); opacity: 1; filter: blur(0px); }
    }
    .star { animation: twinkle linear infinite; }
    .float { animation: float 6s ease-in-out infinite; }
    .aurora-1 { animation: auroraWave1 15s ease-in-out infinite; }
    .aurora-2 { animation: auroraWave2 20s ease-in-out infinite reverse; }
    .shimmer-line { animation: shimmer 8s linear infinite; }
    
    .planet-enter { animation: planetEmerge 4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    
    .text-shadow-glow { text-shadow: 0 0 15px rgba(255,255,255,0.4); }

    /* Shooting stars */
    @keyframes shootingStar {
      0% { transform: translateX(0) translateY(0); opacity: 1; }
      70% { opacity: 1; }
      100% { transform: translateX(300px) translateY(300px); opacity: 0; }
    }
    .shooting-star {
      animation: shootingStar linear forwards;
    }

    /* Fireflies */
    @keyframes firefly {
      0%, 100% { opacity: 0; transform: translate(0, 0) scale(0.5); }
      10% { opacity: 1; transform: translate(5px, -8px) scale(1); }
      30% { opacity: 0.6; transform: translate(-3px, -15px) scale(0.8); }
      50% { opacity: 1; transform: translate(8px, -5px) scale(1.1); }
      70% { opacity: 0.4; transform: translate(-5px, -12px) scale(0.7); }
      90% { opacity: 0.8; transform: translate(3px, -3px) scale(0.9); }
    }
    .firefly { animation: firefly ease-in-out infinite; }

    /* Whale breach */
    @keyframes whaleBreach {
      0% { transform: translateY(60px) rotate(0deg); opacity: 0; }
      15% { transform: translateY(0px) rotate(-15deg); opacity: 0.7; }
      30% { transform: translateY(-20px) rotate(-25deg); opacity: 0.7; }
      50% { transform: translateY(0px) rotate(-10deg); opacity: 0.5; }
      70% { transform: translateY(30px) rotate(5deg); opacity: 0.3; }
      100% { transform: translateY(60px) rotate(10deg); opacity: 0; }
    }
    .whale-breach { animation: whaleBreach 12s ease-in-out infinite; }

    /* Bird flight */
    @keyframes birdFly {
      0% { transform: translateX(-100px) translateY(0); opacity: 0; }
      10% { opacity: 0.6; }
      50% { transform: translateX(50vw) translateY(-30px); opacity: 0.5; }
      90% { opacity: 0.3; }
      100% { transform: translateX(110vw) translateY(-10px); opacity: 0; }
    }
    @keyframes wingFlap {
      0%, 100% { d: path("M0 4 Q5 0 10 4 Q15 0 20 4"); }
      50% { d: path("M0 4 Q5 8 10 4 Q15 8 20 4"); }
    }
    .bird-fly { animation: birdFly linear infinite; }

    /* Space jellyfish */
    @keyframes jellyfishDrift {
      0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
      25% { transform: translateY(-15px) translateX(10px) rotate(3deg); }
      50% { transform: translateY(-5px) translateX(-5px) rotate(-2deg); }
      75% { transform: translateY(-20px) translateX(5px) rotate(2deg); }
    }
    @keyframes jellyfishPulse {
      0%, 100% { transform: scaleY(1) scaleX(1); }
      50% { transform: scaleY(0.85) scaleX(1.1); }
    }
    @keyframes tentacleWave {
      0%, 100% { transform: rotate(0deg); }
      33% { transform: rotate(5deg); }
      66% { transform: rotate(-5deg); }
    }
    .jellyfish-drift { animation: jellyfishDrift 10s ease-in-out infinite; }
    .jellyfish-pulse { animation: jellyfishPulse 3s ease-in-out infinite; }
    .tentacle-wave { animation: tentacleWave 4s ease-in-out infinite; transform-origin: top center; }

    /* Constellation twinkle */
    @keyframes constellationGlow {
      0%, 100% { opacity: 0.3; filter: drop-shadow(0 0 2px rgba(255,255,255,0.3)); }
      50% { opacity: 0.8; filter: drop-shadow(0 0 6px rgba(200,220,255,0.6)); }
    }
    .constellation-glow { animation: constellationGlow 5s ease-in-out infinite; }

    /* Orbiting particles */
    @keyframes orbitParticle {
      0% { transform: rotate(0deg) translateX(var(--orbit-radius)) rotate(0deg); }
      100% { transform: rotate(360deg) translateX(var(--orbit-radius)) rotate(-360deg); }
    }
    .orbit-particle { animation: orbitParticle linear infinite; }
  `}} />
);

// --- COMPONENTS ---

const StarField = ({ count = 50, opacity = 1 }) => {
  const stars = useRef([...Array(count)].map(() => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    dur: Math.random() * 3 + 2,
    delay: Math.random() * 5
  })));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity, transition: 'opacity 3s ease' }}>
      {stars.current.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDuration: `${star.dur}s`,
            animationDelay: `${star.delay}s`
          }}
        />
      ))}
    </div>
  );
};

// --- SHOOTING / WISHING STARS ---
const ShootingStars = ({ active = true }) => {
  const [stars, setStars] = useState([]);
  const idCounter = useRef(0);

  useEffect(() => {
    if (!active) return;
    const spawn = () => {
      const id = idCounter.current++;
      const star = {
        id,
        x: Math.random() * 60 + 5,
        y: Math.random() * 40 + 5,
        duration: Math.random() * 1.5 + 0.8,
        angle: Math.random() * 20 + 25, // 25-45 degrees
        length: Math.random() * 80 + 60,
      };
      setStars(prev => [...prev, star]);
      setTimeout(() => {
        setStars(prev => prev.filter(s => s.id !== id));
      }, star.duration * 1000 + 200);
    };
    // Spawn at random intervals
    const interval = setInterval(() => {
      if (Math.random() > 0.4) spawn(); // 60% chance each tick
    }, 3000);
    // Spawn one immediately
    spawn();
    return () => clearInterval(interval);
  }, [active]);

  if (!active) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-5 overflow-hidden">
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute shooting-star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            animationDuration: `${star.duration}s`,
            transform: `rotate(${star.angle}deg)`,
          }}
        >
          {/* Star head */}
          <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_2px_rgba(255,255,255,0.8)]" />
          {/* Trail */}
          <div
            className="absolute top-0.5 right-1.5 h-[1px] bg-gradient-to-l from-white/80 to-transparent"
            style={{ width: `${star.length}px` }}
          />
        </div>
      ))}
    </div>
  );
};

// --- FIREFLIES (for coastline) ---
const Fireflies = ({ count = 12, active = true }) => {
  const flies = useRef([...Array(count)].map(() => ({
    x: Math.random() * 50 + 40, // cluster near island (right side)
    y: Math.random() * 25 + 35, // near tree line
    dur: Math.random() * 4 + 5,
    delay: Math.random() * 8,
    size: Math.random() * 3 + 2,
  })));

  if (!active) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {flies.current.map((fly, i) => (
        <div
          key={i}
          className="absolute rounded-full firefly"
          style={{
            left: `${fly.x}%`,
            top: `${fly.y}%`,
            width: `${fly.size}px`,
            height: `${fly.size}px`,
            backgroundColor: '#fef08a',
            boxShadow: `0 0 ${fly.size * 3}px ${fly.size}px rgba(254, 240, 138, 0.6)`,
            animationDuration: `${fly.dur}s`,
            animationDelay: `${fly.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

// --- BIRDS (for coastline) ---
const Birds = ({ active = true }) => {
  const birds = useRef([
    { delay: 0, y: 28, dur: 18, scale: 0.6 },
    { delay: 6, y: 22, dur: 22, scale: 0.4 },
    { delay: 12, y: 32, dur: 16, scale: 0.5 },
  ]);

  if (!active) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-25">
      {birds.current.map((bird, i) => (
        <svg
          key={i}
          className="absolute bird-fly"
          style={{
            top: `${bird.y}%`,
            left: '-40px',
            animationDuration: `${bird.dur}s`,
            animationDelay: `${bird.delay}s`,
            transform: `scale(${bird.scale})`,
          }}
          width="24" height="10" viewBox="0 0 24 10"
        >
          <path d="M0 5 Q4 0 8 5 M8 5 Q12 0 16 5 M16 5 Q20 0 24 5" stroke="rgba(200,210,230,0.5)" fill="none" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ))}
    </div>
  );
};

// --- WHALE (for coastline ocean) ---
const Whale = ({ active = true, bright = false }) => {
  if (!active) return null;

  return (
    <div className="absolute bottom-[12%] left-[15%] z-15 pointer-events-none">
      <svg className="whale-breach" width="60" height="40" viewBox="0 0 60 40" style={{ animationDelay: '4s' }}>
        {/* Whale body */}
        <ellipse cx="30" cy="22" rx="22" ry="12" fill={bright ? "#1a3050" : "#0a1525"} />
        {/* Whale head */}
        <ellipse cx="48" cy="20" rx="10" ry="9" fill={bright ? "#1e3a5c" : "#0d1e30"} />
        {/* Tail fluke */}
        <path d="M5 20 Q0 10 8 8 L12 18 Z" fill={bright ? "#1a3050" : "#0a1525"} />
        <path d="M5 24 Q0 34 8 36 L12 26 Z" fill={bright ? "#1a3050" : "#0a1525"} />
        {/* Eye */}
        <circle cx="50" cy="18" r="1.5" fill={bright ? "#a0c4e8" : "#4a6a8a"} />
        {/* Belly highlight */}
        <ellipse cx="32" cy="28" rx="16" ry="5" fill={bright ? "#1e3a5c" : "#0d1e30"} opacity="0.5" />
        {/* Water splash */}
        <circle cx="52" cy="10" r="1" fill="rgba(150,200,255,0.4)" />
        <circle cx="55" cy="8" r="0.7" fill="rgba(150,200,255,0.3)" />
        <circle cx="49" cy="7" r="0.5" fill="rgba(150,200,255,0.2)" />
      </svg>
    </div>
  );
};

// --- SPACE JELLYFISH (ethereal cosmic creature) ---
const SpaceJellyfish = ({ active = true, tense = false }) => {
  if (!active) return null;

  return (
    <div className={`absolute pointer-events-none transition-opacity duration-[3000ms] ${tense ? 'opacity-20' : 'opacity-60'}`}>
      {/* Jellyfish 1 - upper left */}
      <div className="absolute top-[15%] left-[12%] jellyfish-drift" style={{ animationDelay: '0s' }}>
        <svg width="40" height="60" viewBox="0 0 40 60">
          {/* Bell/dome */}
          <g className="jellyfish-pulse">
            <ellipse cx="20" cy="15" rx="16" ry="14" fill="rgba(120,180,220,0.15)" stroke="rgba(120,180,220,0.3)" strokeWidth="0.5" />
            <ellipse cx="20" cy="15" rx="10" ry="9" fill="rgba(150,200,240,0.1)" />
            {/* Inner glow */}
            <circle cx="20" cy="13" r="4" fill="rgba(180,220,255,0.15)" />
          </g>
          {/* Tentacles */}
          <g className="tentacle-wave">
            <path d="M10 26 Q8 38 12 50" stroke="rgba(120,180,220,0.2)" fill="none" strokeWidth="0.8" />
            <path d="M15 28 Q13 42 16 55" stroke="rgba(150,200,240,0.15)" fill="none" strokeWidth="0.6" />
            <path d="M20 29 Q20 43 20 58" stroke="rgba(120,180,220,0.2)" fill="none" strokeWidth="0.8" />
            <path d="M25 28 Q27 42 24 55" stroke="rgba(150,200,240,0.15)" fill="none" strokeWidth="0.6" />
            <path d="M30 26 Q32 38 28 50" stroke="rgba(120,180,220,0.2)" fill="none" strokeWidth="0.8" />
          </g>
          {/* Bioluminescent dots */}
          <circle cx="15" cy="35" r="0.8" fill="rgba(100,220,255,0.5)" className="star" style={{ animationDuration: '2s' }} />
          <circle cx="22" cy="42" r="0.6" fill="rgba(100,220,255,0.4)" className="star" style={{ animationDuration: '3s', animationDelay: '1s' }} />
          <circle cx="18" cy="48" r="0.7" fill="rgba(100,220,255,0.3)" className="star" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
        </svg>
      </div>

      {/* Jellyfish 2 - upper right, smaller */}
      <div className="absolute top-[25%] right-[15%] jellyfish-drift" style={{ animationDelay: '-5s', transform: 'scale(0.6)' }}>
        <svg width="40" height="60" viewBox="0 0 40 60">
          <g className="jellyfish-pulse" style={{ animationDelay: '-1.5s' }}>
            <ellipse cx="20" cy="15" rx="16" ry="14" fill="rgba(180,140,220,0.12)" stroke="rgba(180,140,220,0.25)" strokeWidth="0.5" />
            <ellipse cx="20" cy="15" rx="10" ry="9" fill="rgba(200,160,240,0.08)" />
            <circle cx="20" cy="13" r="4" fill="rgba(220,180,255,0.12)" />
          </g>
          <g className="tentacle-wave" style={{ animationDelay: '-2s' }}>
            <path d="M10 26 Q8 38 12 50" stroke="rgba(180,140,220,0.15)" fill="none" strokeWidth="0.8" />
            <path d="M15 28 Q13 42 16 55" stroke="rgba(200,160,240,0.12)" fill="none" strokeWidth="0.6" />
            <path d="M20 29 Q20 43 20 58" stroke="rgba(180,140,220,0.15)" fill="none" strokeWidth="0.8" />
            <path d="M25 28 Q27 42 24 55" stroke="rgba(200,160,240,0.12)" fill="none" strokeWidth="0.6" />
            <path d="M30 26 Q32 38 28 50" stroke="rgba(180,140,220,0.15)" fill="none" strokeWidth="0.8" />
          </g>
          <circle cx="14" cy="36" r="0.8" fill="rgba(200,150,255,0.4)" className="star" style={{ animationDuration: '2.2s' }} />
          <circle cx="24" cy="44" r="0.5" fill="rgba(200,150,255,0.3)" className="star" style={{ animationDuration: '2.8s', animationDelay: '0.8s' }} />
        </svg>
      </div>
    </div>
  );
};

// --- CONSTELLATION (connected star pattern) ---
const Constellation = ({ active = true }) => {
  if (!active) return null;

  return (
    <div className="absolute top-[8%] right-[8%] pointer-events-none z-5 constellation-glow">
      <svg width="120" height="100" viewBox="0 0 120 100">
        {/* Connection lines */}
        <line x1="10" y1="30" x2="40" y2="15" stroke="rgba(200,220,255,0.2)" strokeWidth="0.5" />
        <line x1="40" y1="15" x2="70" y2="25" stroke="rgba(200,220,255,0.2)" strokeWidth="0.5" />
        <line x1="70" y1="25" x2="60" y2="55" stroke="rgba(200,220,255,0.2)" strokeWidth="0.5" />
        <line x1="60" y1="55" x2="90" y2="70" stroke="rgba(200,220,255,0.2)" strokeWidth="0.5" />
        <line x1="70" y1="25" x2="105" y2="20" stroke="rgba(200,220,255,0.2)" strokeWidth="0.5" />
        <line x1="40" y1="15" x2="35" y2="50" stroke="rgba(200,220,255,0.2)" strokeWidth="0.5" />
        <line x1="35" y1="50" x2="60" y2="55" stroke="rgba(200,220,255,0.2)" strokeWidth="0.5" />
        {/* Star points */}
        <circle cx="10" cy="30" r="2" fill="rgba(220,235,255,0.8)" className="star" style={{ animationDuration: '3s' }} />
        <circle cx="40" cy="15" r="2.5" fill="rgba(220,235,255,0.9)" className="star" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
        <circle cx="70" cy="25" r="2" fill="rgba(220,235,255,0.8)" className="star" style={{ animationDuration: '3.5s', animationDelay: '1s' }} />
        <circle cx="60" cy="55" r="1.8" fill="rgba(220,235,255,0.7)" className="star" style={{ animationDuration: '2.8s', animationDelay: '1.5s' }} />
        <circle cx="90" cy="70" r="2.2" fill="rgba(220,235,255,0.8)" className="star" style={{ animationDuration: '3.2s', animationDelay: '0.8s' }} />
        <circle cx="105" cy="20" r="1.5" fill="rgba(220,235,255,0.6)" className="star" style={{ animationDuration: '4s', animationDelay: '2s' }} />
        <circle cx="35" cy="50" r="1.8" fill="rgba(220,235,255,0.7)" className="star" style={{ animationDuration: '3s', animationDelay: '0.3s' }} />
      </svg>
    </div>
  );
};

// --- ORBITING PARTICLES (around planet) ---
const OrbitingParticles = ({ active = true, reconciled = false }) => {
  if (!active) return null;

  const particles = [
    { radius: 230, size: 3, dur: 20, delay: 0, color: reconciled ? 'rgba(72,181,163,0.6)' : 'rgba(100,180,255,0.4)' },
    { radius: 240, size: 2, dur: 25, delay: -8, color: reconciled ? 'rgba(72,181,163,0.4)' : 'rgba(150,200,255,0.3)' },
    { radius: 220, size: 2.5, dur: 18, delay: -12, color: reconciled ? 'rgba(100,220,200,0.5)' : 'rgba(120,160,255,0.35)' },
    { radius: 250, size: 1.5, dur: 30, delay: -5, color: 'rgba(255,255,255,0.2)' },
    { radius: 235, size: 2, dur: 22, delay: -15, color: reconciled ? 'rgba(130,220,200,0.4)' : 'rgba(100,140,220,0.3)' },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute top-1/2 left-1/2 orbit-particle"
          style={{
            '--orbit-radius': `${p.radius}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: '50%',
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
            marginLeft: `-${p.size / 2}px`,
            marginTop: `-${p.size / 2}px`,
          }}
        />
      ))}
    </div>
  );
};

const CoastlineScene = ({ onMoonClick, mode = 'dark', active }) => {
  const isBright = mode === 'bright';
  
  return (
    <div className={`absolute inset-0 w-full h-full transition-all duration-[4000ms] ${active ? 'opacity-100' : 'opacity-0 scale-105 pointer-events-none'} ${isBright ? 'bg-[#0b1a30]' : 'bg-[#030712]'}`}>
      <StarField count={isBright ? 100 : 70} opacity={isBright ? 0.8 : 0.5} />
      
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0f2027]/50 to-[#203a43]/80 opacity-60"></div>

      {/* Aurora Borealis */}
      <svg className="absolute top-0 left-0 w-full h-1/2 pointer-events-none opacity-80" preserveAspectRatio="none" viewBox="0 0 1000 300">
        <defs>
          <filter id="blurAurora">
            <feGaussianBlur stdDeviation="30" />
          </filter>
        </defs>
        <path className="aurora-1" d="M -100 150 Q 200 50 500 150 T 1100 100 L 1100 -100 L -100 -100 Z" fill={isBright ? "rgba(133, 199, 242, 0.4)" : "rgba(28, 75, 82, 0.5)"} filter="url(#blurAurora)" />
        <path className="aurora-2" d="M -100 200 Q 300 250 600 100 T 1100 200 L 1100 -100 L -100 -100 Z" fill={isBright ? "rgba(72, 181, 163, 0.3)" : "rgba(31, 58, 89, 0.4)"} filter="url(#blurAurora)" />
      </svg>

      {/* Moon */}
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 flex flex-col items-center justify-center z-20">
        <div 
          onClick={onMoonClick}
          className={`rounded-full transition-all duration-1000 ${active && mode==='dark' ? 'cursor-pointer hover:scale-110' : ''}`}
          style={{
            width: isBright ? '100px' : '80px',
            height: isBright ? '100px' : '80px',
            backgroundColor: isBright ? '#fffde7' : '#e2e8f0',
            boxShadow: isBright 
              ? '0 0 60px 20px rgba(255, 250, 200, 0.6), inset 0 0 20px rgba(255,255,255,1)' 
              : '0 0 40px 10px rgba(200, 220, 255, 0.3), inset 0 0 10px rgba(255,255,255,0.8)'
          }}
        />
      </div>

      {/* Ocean */}
      <div className="absolute bottom-0 left-0 w-full h-[35%] bg-gradient-to-b from-[#081426] to-[#02050f] overflow-hidden z-10">
        {/* Ocean reflection */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-full opacity-30 flex flex-col items-center">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-1 bg-white rounded-full mt-2 shimmer-line" style={{ width: `${Math.random() * 60 + 20}%`, opacity: 0.5 - (i * 0.05), animationDelay: `${Math.random() * 2}s` }}></div>
          ))}
        </div>
      </div>

      {/* Island / Shoreline (Right Side) */}
      <svg className="absolute bottom-[34%] right-0 w-[60%] md:w-[40%] h-[30%] pointer-events-none z-20" preserveAspectRatio="none" viewBox="0 0 500 200">
        <path d="M 500 200 L 0 200 Q 50 160 150 150 Q 250 140 300 100 Q 400 60 500 80 Z" fill="#010308" />
        {/* Distant trees/details */}
        <path d="M 320 100 L 330 70 L 340 105 Z M 400 75 L 410 40 L 420 80 Z M 450 80 L 460 50 L 470 85 Z" fill="#010308" />
      </svg>

      {/* Fireflies near the island */}
      <Fireflies count={isBright ? 18 : 10} active={active} />

      {/* Birds flying across */}
      <Birds active={active} />

      {/* Whale breaching in the ocean */}
      <Whale active={active} bright={isBright} />
    </div>
  );
};

const SpaceScene = ({ step, active }) => {
  // Choreography logic
  const isLanded = step >= 2;
  const isWalking = step >= 3;
  const isTense = step >= 6 && step < 8;
  const isTurningAway = step >= 6 && step < 12;
  const isReconciled = step >= 12;
  const isEnding = step >= 13;

  return (
    <div className={`absolute inset-0 w-full h-full bg-[#010205] transition-opacity duration-[3000ms] ${active ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <StarField count={150} opacity={isTense ? 0.3 : 0.8} />
      
      {/* Shooting / Wishing Stars */}
      <ShootingStars active={active && !isTense} />

      {/* Constellation pattern */}
      <Constellation active={active} />

      {/* Space Jellyfish */}
      <SpaceJellyfish active={active} tense={isTense} />
      
      {/* Cosmic Dust / Nebula */}
      <div className={`absolute inset-0 transition-opacity duration-[2000ms] ${isTense ? 'opacity-20' : 'opacity-60'}`}>
         <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#1a3a5c] rounded-full mix-blend-screen blur-[100px] opacity-40 float"></div>
         <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#0d5c63] rounded-full mix-blend-screen blur-[120px] opacity-30 float" style={{animationDelay: '-3s'}}></div>
         {isReconciled && (
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#48B5A3] rounded-full mix-blend-screen blur-[150px] opacity-30 transition-opacity duration-[3000ms]"></div>
         )}
      </div>

      {/* Center Stage: Planet & Astronauts */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] transition-transform duration-[5000ms] ease-out 
        ${step === 1 ? 'scale-0 translate-y-[200px]' : ''} 
        ${step >= 2 && step <= 12 ? 'scale-100 translate-y-0' : ''}
        ${isEnding ? 'scale-[0.85] translate-y-[100px]' : ''}
      `}>
        {/* The Planet */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#2a5298] via-[#1e3c72] to-[#010314] shadow-[0_0_80px_rgba(42,82,152,0.4),inset_0_-40px_60px_rgba(0,0,0,0.8)] z-10">
           {/* Planet texture/glow */}
           <div className="absolute inset-0 rounded-full border-2 border-white/10"></div>
           <div className={`absolute inset-0 rounded-full shadow-[0_0_40px_#48B5A3] transition-opacity duration-[3000ms] ${isReconciled ? 'opacity-40' : 'opacity-0'}`}></div>
           <div className={`absolute inset-0 bg-black transition-opacity duration-[2000ms] ${isTense ? 'opacity-60 rounded-full' : 'opacity-0'}`}></div>
        </div>

        {/* Astronauts Container (Surface level) */}
        <div className="absolute top-[-30px] left-0 w-full h-[60px] z-20">
          
          {/* Male Astronaut (Left) */}
          <div className={`absolute top-0 transition-all duration-[3000ms] ease-in-out
            ${!isLanded ? '-left-[150px] opacity-0' : ''}
            ${isLanded && !isWalking ? 'left-[40px] opacity-100' : ''}
            ${isWalking && step < 6 ? 'left-[140px] opacity-100' : ''}
            ${step >= 6 && !isReconciled ? 'left-[120px] opacity-100' : ''} 
            ${isReconciled ? 'left-[150px] opacity-100' : ''}
          `}>
             <svg width="30" height="50" viewBox="0 0 30 50">
                {/* Rocket landed behind */}
                <path d="M -10 50 L -5 20 L 5 20 L 10 50 Z" fill="#112" className={`transition-opacity duration-1000 ${isWalking ? 'opacity-0' : 'opacity-50'}`} />
                {/* Astronaut */}
                <rect x="5" y="10" width="16" height="35" rx="8" fill="#e2e8f0" />
                <rect x="10" y="14" width="12" height="10" rx="3" fill="#0f172a" />
                <rect x="3" y="15" width="4" height="20" rx="2" fill="#cbd5e1" /> {/* Backpack */}
             </svg>
          </div>

          {/* Female Astronaut (Right) */}
          <div className={`absolute top-0 transition-all duration-[3000ms] ease-in-out
            ${!isLanded ? '-right-[150px] opacity-0' : ''}
            ${isLanded && !isWalking ? 'right-[40px] opacity-100' : ''}
            ${isWalking ? 'right-[140px] opacity-100' : ''}
          `}
          style={{ transform: isTurningAway ? 'scaleX(-1)' : 'scaleX(1)' }}
          >
             <svg width="30" height="48" viewBox="0 0 30 50">
                {/* Rocket landed behind */}
                <path d="M 20 50 L 25 20 L 35 20 L 40 50 Z" fill="#112" className={`transition-opacity duration-1000 ${isWalking ? 'opacity-0' : 'opacity-50'}`} />
                {/* Astronaut */}
                <rect x="9" y="12" width="14" height="33" rx="7" fill="#f8fafc" />
                <rect x="8" y="16" width="10" height="9" rx="3" fill="#0f172a" />
                <rect x="23" y="16" width="4" height="18" rx="2" fill="#cbd5e1" /> {/* Backpack */}
             </svg>
          </div>

        </div>
      </div>

      {/* Orbiting Particles around the planet */}
      <OrbitingParticles active={active && step >= 2} reconciled={isReconciled} />
    </div>
  );
};

// --- MAIN APP COMPONENT ---

export default function CinematicApology() {
  const [step, setStep] = useState(0);
  const [textState, setTextState] = useState('entering'); // entering, visible, exiting
  const [isTransitioning, setIsTransitioning] = useState(false);
  const audioRef = useRef(null);

  // Initialize audio engine lazily (must happen on user gesture)
  const ensureAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new AmbientAudioEngine();
    }
    if (!audioRef.current.initialized) {
      audioRef.current.init();
    }
    return audioRef.current;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.destroy();
    };
  }, []);

  // Scene-reactive ambient changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audio.initialized) return;

    if (step === 0) {
      audio.playCoastline(false);
    } else if (step === 1) {
      // Transition whoosh into space
      audio.playWhoosh();
    } else if (step >= 2 && step <= 5) {
      if (audio.currentScene !== 'space') {
        audio.playSpace(false, false);
      }
    } else if (step >= 6 && step < 8) {
      // Tense mood
      audio.playSpace(true, false);
    } else if (step >= 8 && step < 12) {
      // Easing tension
      audio.playSpace(false, false);
    } else if (step >= 12 && step <= 13) {
      // Reconciliation warmth
      audio.playSpace(false, true);
    } else if (step === 14) {
      // Return to bright coastline
      audio.playCoastline(true);
    }
  }, [step]);

  // Handle auto-transitions for narrative pacing
  useEffect(() => {
    if (step === 1) {
      // Step 1 is the fade to black, wait then trigger step 2
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setStep(2);
        setTextState('entering');
        setIsTransitioning(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Handle dialogue fading
  useEffect(() => {
    if (textState === 'entering') {
      const timer = setTimeout(() => setTextState('visible'), 50);
      return () => clearTimeout(timer);
    }
    if (textState === 'exiting') {
      const timer = setTimeout(() => {
        setStep(s => s + 1);
        setTextState('entering');
      }, 800); // Wait for fade out
      return () => clearTimeout(timer);
    }
  }, [textState]);

  const advanceStory = () => {
    // Prevent advance during specific states
    if (isTransitioning || step === 0 || step === 1 || step === 14 || textState !== 'visible') return;
    
    const audio = ensureAudio();

    if (step === 13) {
      // Return to coastline
      audio.playChime('resolve');
      setIsTransitioning(true);
      setTextState('exiting');
      setTimeout(() => {
        setStep(14);
        setIsTransitioning(false);
      }, 1000);
    } else {
      // Pick chime tone based on mood
      const chimeType = (step >= 9 && step <= 11) ? 'tender' : 'default';
      audio.playChime(chimeType);
      setTextState('exiting');
    }
  };

  const handleMoonClick = (e) => {
    e.stopPropagation();
    if (step === 0 && textState === 'visible') {
      const audio = ensureAudio();
      audio.playChime('moon');
      audio.playCoastline(false); // Start ambient on first interaction
      setTextState('exiting');
    }
  };

  const currentStory = STORY[step];

  return (
    <div 
      className="relative w-full h-screen bg-black overflow-hidden select-none font-serif text-[#f8fafc]"
      onClick={advanceStory}
    >
      <CustomStyles />

      {/* Scenery Layers */}
      <CoastlineScene active={step === 0} mode="dark" onMoonClick={handleMoonClick} />
      <SpaceScene active={step >= 2 && step <= 13} step={step} />
      <CoastlineScene active={step === 14} mode="bright" />

      {/* Dialogue UI Layer */}
      <div className={`absolute bottom-0 left-0 w-full h-1/3 flex flex-col items-center justify-end pb-16 md:pb-20 z-50 pointer-events-none transition-opacity duration-1000
        ${(textState === 'visible' && currentStory && currentStory.text) ? 'opacity-100' : 'opacity-0'}
      `}>
        <div className="max-w-3xl px-8 text-center space-y-4">
          
          {/* Main Narration/Dialogue Text */}
          <p className={`text-xl md:text-2xl lg:text-3xl font-light tracking-wide leading-relaxed text-shadow-glow
            ${currentStory?.isDialogue ? 'italic text-[#e0f2fe]' : ''}
            ${step === 0 ? 'whitespace-nowrap' : ''}
          `}>
            {currentStory?.isDialogue && <span className="mr-2 text-sm md:text-base font-sans font-medium opacity-50 tracking-widest uppercase"></span>}
            "{currentStory?.text}"
          </p>

          {/* Subtitle / Hint */}
          <div className="h-6 flex items-center justify-center mt-4">
            {currentStory?.hint ? (
              <p className="text-xs md:text-sm font-sans tracking-widest uppercase opacity-50 float pointer-events-auto">
                {currentStory.hint}
              </p>
            ) : (
              // Pulsing arrow for generic continuation
              (step > 1 && step < 13) && (
                <svg className="w-4 h-4 opacity-50 float" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
              )
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
