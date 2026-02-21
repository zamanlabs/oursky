import React, { useMemo } from 'react';

// ═══════════════════════════════════════════════════════════════
// CSS ANIMATIONS
// ═══════════════════════════════════════════════════════════════
export function WallpaperStyles() {
  return (
    <style>{`
      @keyframes twinkle {
        0%, 100% { opacity: 0.2; transform: scale(0.8); }
        50% { opacity: 1; transform: scale(1.3); }
      }
      @keyframes shootingStar {
        0% { transform: translateX(0) translateY(0); opacity: 1; }
        70% { opacity: 1; }
        100% { transform: translateX(300px) translateY(300px); opacity: 0; }
      }
      @keyframes firefly {
        0%, 100% { opacity: 0; transform: translate(0, 0) scale(0.5); }
        20% { opacity: 1; transform: translate(15px, -20px) scale(1); }
        40% { opacity: 0.7; transform: translate(-10px, -35px) scale(0.8); }
        60% { opacity: 1; transform: translate(20px, -15px) scale(1.1); }
        80% { opacity: 0.5; transform: translate(-5px, -40px) scale(0.7); }
      }
      @keyframes birdFly {
        0% { transform: translateX(-60px) translateY(0) scaleX(1); }
        25% { transform: translateX(25vw) translateY(-20px) scaleX(1); }
        50% { transform: translateX(50vw) translateY(10px) scaleX(1); }
        75% { transform: translateX(75vw) translateY(-15px) scaleX(1); }
        100% { transform: translateX(105vw) translateY(5px) scaleX(1); }
      }
      @keyframes whaleBreach {
        0% { transform: translateY(100%) rotate(0deg); opacity: 0; }
        15% { opacity: 1; }
        40% { transform: translateY(-30%) rotate(-8deg); opacity: 1; }
        60% { transform: translateY(-20%) rotate(-5deg); opacity: 1; }
        85% { opacity: 0.5; }
        100% { transform: translateY(100%) rotate(5deg); opacity: 0; }
      }
      @keyframes jellyfishDrift {
        0%, 100% { transform: translateY(0) translateX(0); }
        25% { transform: translateY(-30px) translateX(15px); }
        50% { transform: translateY(-10px) translateX(-10px); }
        75% { transform: translateY(-40px) translateX(20px); }
      }
      @keyframes jellyfishPulse {
        0%, 100% { transform: scaleX(1) scaleY(1); }
        50% { transform: scaleX(1.1) scaleY(0.9); }
      }
      @keyframes tentacleWave {
        0%, 100% { d: path("M0,0 Q5,15 0,30 Q-5,45 0,60"); }
        50% { d: path("M0,0 Q-5,15 0,30 Q5,45 0,60"); }
      }
      @keyframes constellationGlow {
        0%, 100% { opacity: 0.4; filter: drop-shadow(0 0 2px currentColor); }
        50% { opacity: 0.9; filter: drop-shadow(0 0 6px currentColor); }
      }
      @keyframes orbitParticle {
        0% { transform: rotate(0deg) translateX(var(--orbit-r)) rotate(0deg); opacity: 0.6; }
        50% { opacity: 1; }
        100% { transform: rotate(360deg) translateX(var(--orbit-r)) rotate(-360deg); opacity: 0.6; }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
      }
      @keyframes auroraWave1 {
        0%, 100% { transform: translateX(-10%) skewX(-5deg) scaleY(1); opacity: 0.3; }
        33% { transform: translateX(5%) skewX(3deg) scaleY(1.3); opacity: 0.5; }
        66% { transform: translateX(-5%) skewX(-8deg) scaleY(0.8); opacity: 0.4; }
      }
      @keyframes auroraWave2 {
        0%, 100% { transform: translateX(5%) skewX(3deg) scaleY(0.9); opacity: 0.25; }
        50% { transform: translateX(-8%) skewX(-5deg) scaleY(1.2); opacity: 0.45; }
      }
      @keyframes shimmer {
        0%, 100% { opacity: 0.1; }
        50% { opacity: 0.4; }
      }
      @keyframes slowRotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes nebulaPulse {
        0%, 100% { opacity: 0.15; transform: scale(1); }
        50% { opacity: 0.3; transform: scale(1.08); }
      }
      @keyframes cometTrail {
        0% { transform: translateX(0) translateY(0); opacity: 0; }
        10% { opacity: 1; }
        80% { opacity: 0.8; }
        100% { transform: translateX(500px) translateY(200px); opacity: 0; }
      }
      @keyframes ringPulse {
        0%, 100% { opacity: 0.3; transform: rotateX(75deg) scale(1); }
        50% { opacity: 0.6; transform: rotateX(75deg) scale(1.05); }
      }
      @keyframes planetEmerge {
        from { opacity: 0; transform: scale(0.8); }
        to { opacity: 1; transform: scale(1); }
      }
      @keyframes moonGlow {
        0%, 100% { filter: drop-shadow(0 0 20px rgba(255,255,200,0.3)); }
        50% { filter: drop-shadow(0 0 40px rgba(255,255,200,0.6)); }
      }
      @keyframes waterShimmer {
        0%, 100% { opacity: 0.15; transform: scaleX(1); }
        50% { opacity: 0.4; transform: scaleX(1.1); }
      }
      @keyframes lighthouseBeam {
        0% { transform: rotate(-30deg); opacity: 0.3; }
        50% { transform: rotate(30deg); opacity: 0.6; }
        100% { transform: rotate(-30deg); opacity: 0.3; }
      }
      @keyframes bioluminescence {
        0%, 100% { opacity: 0; transform: scale(0.5); }
        30% { opacity: 0.8; transform: scale(1.2); }
        70% { opacity: 0.6; transform: scale(1); }
      }
      @keyframes dustFloat {
        0% { transform: translateY(0) translateX(0); opacity: 0; }
        20% { opacity: 0.6; }
        80% { opacity: 0.4; }
        100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
      }
      @keyframes energyThread {
        0%, 100% { opacity: 0; }
        30% { opacity: 0.6; }
        50% { opacity: 1; }
        70% { opacity: 0.5; }
      }
      @keyframes heartBeat {
        0%, 100% { transform: scale(1); }
        15% { transform: scale(1.15); }
        30% { transform: scale(1); }
        45% { transform: scale(1.1); }
      }
      @keyframes goldenRise {
        0% { transform: translateY(100vh); opacity: 0; }
        10% { opacity: 0.8; }
        90% { opacity: 0.6; }
        100% { transform: translateY(-20vh); opacity: 0; }
      }
      @keyframes coastMist {
        0%, 100% { transform: translateX(-5%) scaleY(1); opacity: 0.2; }
        50% { transform: translateX(5%) scaleY(1.3); opacity: 0.35; }
      }
    `}</style>
  );
}

// ═══════════════════════════════════════════════════════════════
// STAR FIELD
// ═══════════════════════════════════════════════════════════════
export function StarField({ count = 200, brightness = 1 }) {
  const stars = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2.5,
      delay: Math.random() * 8,
      dur: 3 + Math.random() * 5,
      opacity: (0.3 + Math.random() * 0.7) * brightness,
    })),
  [count, brightness]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {stars.map(s => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`, top: `${s.y}%`,
            width: s.size, height: s.size,
            opacity: s.opacity,
            animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SHOOTING STARS
// ═══════════════════════════════════════════════════════════════
export function ShootingStars({ count = 6, color = 'white' }) {
  const stars = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 80,
      y: Math.random() * 50,
      delay: Math.random() * 15 + i * 3,
      dur: 1.5 + Math.random() * 1.5,
      size: 2 + Math.random() * 2,
    })),
  [count, color]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map(s => (
        <div
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: `${s.x}%`, top: `${s.y}%`,
            width: s.size, height: s.size,
            background: color,
            boxShadow: `0 0 ${s.size * 3}px ${color}, 0 0 ${s.size * 6}px ${color}`,
            animation: `shootingStar ${s.dur}s linear ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// FIREFLIES
// ═══════════════════════════════════════════════════════════════
export function Fireflies({ count = 20, color = '#FFE87C', spread = 'full' }) {
  const flies = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: spread === 'bottom' ? 10 + Math.random() * 80 : Math.random() * 100,
      y: spread === 'bottom' ? 55 + Math.random() * 40 : 20 + Math.random() * 70,
      size: 3 + Math.random() * 4,
      delay: Math.random() * 10,
      dur: 5 + Math.random() * 8,
    })),
  [count, color, spread]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {flies.map(f => (
        <div
          key={f.id}
          className="absolute rounded-full"
          style={{
            left: `${f.x}%`, top: `${f.y}%`,
            width: f.size, height: f.size,
            background: color,
            boxShadow: `0 0 ${f.size * 2}px ${color}, 0 0 ${f.size * 4}px ${color}`,
            animation: `firefly ${f.dur}s ease-in-out ${f.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// BIRDS
// ═══════════════════════════════════════════════════════════════
export function Birds({ count = 4 }) {
  const birds = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      y: 10 + Math.random() * 25,
      delay: i * 6 + Math.random() * 4,
      dur: 12 + Math.random() * 8,
      size: 15 + Math.random() * 10,
    })),
  [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {birds.map(b => (
        <svg
          key={b.id}
          className="absolute"
          style={{
            top: `${b.y}%`,
            left: '-60px',
            width: b.size, height: b.size,
            animation: `birdFly ${b.dur}s linear ${b.delay}s infinite`,
            opacity: 0.6,
          }}
          viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"
        >
          <path d="M2 12 C6 6, 10 8, 12 12 C14 8, 18 6, 22 12" />
        </svg>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// WHALE
// ═══════════════════════════════════════════════════════════════
export function Whale() {
  return (
    <div
      className="absolute"
      style={{
        right: '15%', bottom: '25%', width: 120, height: 80,
        animation: 'whaleBreach 20s ease-in-out 8s infinite',
        opacity: 0,
      }}
    >
      <svg viewBox="0 0 120 80" fill="none">
        <path
          d="M10 50 Q20 20 50 25 Q80 15 100 30 Q115 40 110 50 Q100 65 70 60 Q50 70 30 65 Q15 60 10 50Z"
          fill="rgba(100,150,200,0.5)" stroke="rgba(150,200,255,0.6)" strokeWidth="1"
        />
        <circle cx="35" cy="38" r="3" fill="rgba(200,230,255,0.8)" />
        <path d="M100 30 Q108 15 115 20 Q112 28 105 32" fill="rgba(100,150,200,0.4)" />
        <path d="M50 60 Q55 68 60 60" stroke="rgba(150,200,255,0.3)" strokeWidth="1" fill="none" />
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SPACE JELLYFISH
// ═══════════════════════════════════════════════════════════════
export function SpaceJellyfish({ count = 3, colorHue = 280 }) {
  const jellies = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: 15 + Math.random() * 70,
      y: 15 + Math.random() * 60,
      size: 40 + Math.random() * 40,
      driftDur: 15 + Math.random() * 15,
      pulseDur: 3 + Math.random() * 2,
      delay: i * 5 + Math.random() * 5,
      hue: colorHue + (Math.random() - 0.5) * 40,
    })),
  [count, colorHue]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {jellies.map(j => (
        <div
          key={j.id}
          className="absolute"
          style={{
            left: `${j.x}%`, top: `${j.y}%`,
            width: j.size, height: j.size * 1.6,
            animation: `jellyfishDrift ${j.driftDur}s ease-in-out ${j.delay}s infinite`,
            opacity: 0.4,
          }}
        >
          <svg viewBox="0 0 60 96" fill="none" style={{ animation: `jellyfishPulse ${j.pulseDur}s ease-in-out infinite` }}>
            <ellipse cx="30" cy="25" rx="22" ry="18"
              fill={`hsla(${j.hue}, 70%, 60%, 0.3)`}
              stroke={`hsla(${j.hue}, 80%, 70%, 0.5)`}
              strokeWidth="1"
              filter={`drop-shadow(0 0 8px hsla(${j.hue}, 80%, 60%, 0.4))`}
            />
            <ellipse cx="30" cy="22" rx="14" ry="10" fill={`hsla(${j.hue}, 60%, 80%, 0.15)`} />
            {[18, 24, 30, 36, 42].map((x, ti) => (
              <path
                key={ti}
                d={`M${x},40 Q${x + 3},55 ${x},70 Q${x - 3},85 ${x},96`}
                stroke={`hsla(${j.hue}, 70%, 65%, 0.3)`}
                strokeWidth="1.5"
                fill="none"
                style={{ animation: `tentacleWave ${2 + ti * 0.3}s ease-in-out ${ti * 0.2}s infinite` }}
              />
            ))}
          </svg>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CONSTELLATIONS
// ═══════════════════════════════════════════════════════════════
const CONSTELLATION_DATA = [
  { name: 'Big Dipper', stars: [[10,20],[25,18],[40,22],[55,15],[55,35],[70,32],[70,18]], lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,3]] },
  { name: 'Orion', stars: [[30,10],[50,10],[20,30],[60,30],[40,40],[25,55],[55,55],[40,70]], lines: [[0,1],[0,2],[1,3],[2,4],[3,4],[2,5],[3,6],[5,7],[6,7]] },
  { name: 'Triangle', stars: [[30,20],[70,20],[50,60]], lines: [[0,1],[1,2],[2,0]] },
  { name: 'Cassiopeia', stars: [[10,40],[25,20],[45,35],[65,15],[80,30]], lines: [[0,1],[1,2],[2,3],[3,4]] },
  { name: 'Southern Cross', stars: [[40,10],[40,60],[20,35],[60,35]], lines: [[0,1],[2,3]] },
  { name: 'Arrow', stars: [[20,50],[40,35],[60,20],[80,35],[60,50]], lines: [[0,1],[1,2],[2,3],[3,4]] },
  { name: 'Lyra', stars: [[40,10],[30,30],[50,30],[25,55],[55,55]], lines: [[0,1],[0,2],[1,2],[1,3],[2,4],[3,4]] },
  { name: 'Heart', stars: [[50,55],[35,25],[25,15],[15,25],[20,40],[50,65],[80,40],[85,25],[75,15],[65,25]], lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,0]] },
];

export function Constellations({ indices = [0,1,2,3,4,5,6], color = 'rgba(150,200,255,0.6)', scale = 1 }) {
  const placements = useMemo(() =>
    indices.map((idx, i) => ({
      data: CONSTELLATION_DATA[idx % CONSTELLATION_DATA.length],
      x: 5 + (i * 13) % 75,
      y: 5 + ((i * 17 + 7) % 60),
      size: (60 + Math.random() * 40) * scale,
      delay: i * 1.5,
    })),
  [indices, color, scale]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {placements.map((p, pi) => (
        <svg
          key={pi}
          className="absolute"
          style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            animation: `constellationGlow 6s ease-in-out ${p.delay}s infinite`,
            color,
          }}
          viewBox="0 0 100 80"
        >
          {p.data.lines.map(([a, b], li) => (
            <line
              key={li}
              x1={p.data.stars[a][0]} y1={p.data.stars[a][1]}
              x2={p.data.stars[b][0]} y2={p.data.stars[b][1]}
              stroke="currentColor" strokeWidth="0.8" opacity="0.5"
            />
          ))}
          {p.data.stars.map(([x, y], si) => (
            <circle key={si} cx={x} cy={y} r="2"
              fill="currentColor"
              filter="url(#constellationBlur)"
            />
          ))}
          <defs>
            <filter id="constellationBlur">
              <feGaussianBlur stdDeviation="1" />
            </filter>
          </defs>
        </svg>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// BACKGROUND PLANETS
// ═══════════════════════════════════════════════════════════════
const PLANETS_CONFIG = [
  { gradient: ['#4a1942', '#8b3a62'], ringColor: 'rgba(200,150,255,0.3)', hasRing: true },
  { gradient: ['#1a3a5c', '#3a7cbd'], ringColor: null, hasRing: false },
  { gradient: ['#5c3a1a', '#bd7a3a'], ringColor: 'rgba(255,200,150,0.25)', hasRing: true },
  { gradient: ['#1a4a3a', '#3abd8b'], ringColor: null, hasRing: false },
  { gradient: ['#3a1a5c', '#7a3abd'], ringColor: 'rgba(180,150,255,0.2)', hasRing: true },
  { gradient: ['#4a3a1a', '#8b7a3a'], ringColor: null, hasRing: false },
  { gradient: ['#1a1a4a', '#3a3abd'], ringColor: 'rgba(150,150,255,0.3)', hasRing: true },
  { gradient: ['#5c1a3a', '#bd3a7a'], ringColor: null, hasRing: false },
];

export function BackgroundPlanets({ count = 8, brightness = 1 }) {
  const planets = useMemo(() =>
    Array.from({ length: Math.min(count, PLANETS_CONFIG.length) }, (_, i) => ({
      ...PLANETS_CONFIG[i],
      id: i,
      x: 8 + (i * 12.5) % 85,
      y: 10 + ((i * 19 + 5) % 70),
      size: 12 + Math.random() * 20,
      delay: i * 0.5,
    })),
  [count, brightness]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {planets.map(p => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            animation: `planetEmerge 3s ease-out ${p.delay}s both`,
            opacity: 0.7 * brightness,
          }}
        >
          <svg viewBox="0 0 40 40" overflow="visible">
            <defs>
              <radialGradient id={`planet-${p.id}`} cx="35%" cy="35%">
                <stop offset="0%" stopColor={p.gradient[1]} />
                <stop offset="100%" stopColor={p.gradient[0]} />
              </radialGradient>
            </defs>
            <circle cx="20" cy="20" r="18" fill={`url(#planet-${p.id})`} />
            <circle cx="20" cy="20" r="18" fill="url(#planetShine)" opacity="0.3" />
            {p.hasRing && (
              <ellipse cx="20" cy="20" rx="28" ry="6"
                fill="none" stroke={p.ringColor} strokeWidth="2"
                style={{ animation: `ringPulse 8s ease-in-out ${p.delay}s infinite` }}
                transform="rotate(-15 20 20)"
              />
            )}
            <defs>
              <radialGradient id="planetShine" cx="30%" cy="30%">
                <stop offset="0%" stopColor="white" stopOpacity="0.4" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// COMETS
// ═══════════════════════════════════════════════════════════════
export function Comets({ count = 3, color = '#88ccff' }) {
  const comets = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 60,
      y: Math.random() * 40,
      delay: i * 12 + Math.random() * 8,
      dur: 4 + Math.random() * 3,
    })),
  [count, color]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {comets.map(c => (
        <div
          key={c.id}
          className="absolute"
          style={{
            left: `${c.x}%`, top: `${c.y}%`,
            width: 6, height: 6,
            background: `radial-gradient(circle, ${color}, transparent)`,
            boxShadow: `
              -20px 0 15px ${color}44,
              -40px 0 25px ${color}22,
              -60px 0 35px ${color}11,
              0 0 10px ${color}
            `,
            borderRadius: '50%',
            animation: `cometTrail ${c.dur}s linear ${c.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// NEBULA CLOUDS
// ═══════════════════════════════════════════════════════════════
export function NebulaClouds({ colors = ['rgba(60,20,120,0.2)', 'rgba(20,60,120,0.15)', 'rgba(120,20,60,0.1)'] }) {
  const clouds = useMemo(() =>
    colors.map((color, i) => ({
      id: i,
      x: 10 + i * 30,
      y: 20 + (i * 25) % 50,
      size: 250 + Math.random() * 200,
      delay: i * 3,
      dur: 12 + Math.random() * 8,
      color,
    })),
  [colors]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {clouds.map(c => (
        <div
          key={c.id}
          className="absolute rounded-full"
          style={{
            left: `${c.x}%`, top: `${c.y}%`,
            width: c.size, height: c.size,
            background: `radial-gradient(ellipse, ${c.color}, transparent 70%)`,
            animation: `nebulaPulse ${c.dur}s ease-in-out ${c.delay}s infinite`,
            transform: 'translate(-50%, -50%)',
            filter: 'blur(40px)',
          }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CENTER PLANET (for space scenes)
// ═══════════════════════════════════════════════════════════════
export function CenterPlanet({ gradient = ['#0a2a4a', '#1a4a6a', '#0a3a5a'], glowColor = 'rgba(100,200,255,0.3)', ringColor, showAstronauts = true }) {
  return (
    <div className="absolute" style={{ bottom: '8%', left: '50%', transform: 'translateX(-50%)', width: 320, height: 320, animation: 'float 10s ease-in-out infinite' }}>
      <svg viewBox="0 0 320 320" overflow="visible">
        <defs>
          <radialGradient id="centerPlanetGrad" cx="40%" cy="40%">
            <stop offset="0%" stopColor={gradient[1]} />
            <stop offset="50%" stopColor={gradient[2]} />
            <stop offset="100%" stopColor={gradient[0]} />
          </radialGradient>
          <filter id="planetGlow">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>
        <circle cx="160" cy="160" r="145" fill={glowColor} filter="url(#planetGlow)" />
        <circle cx="160" cy="160" r="120" fill="url(#centerPlanetGrad)" />
        <circle cx="140" cy="140" r="120" fill="rgba(255,255,255,0.05)" />
        <ellipse cx="130" cy="130" rx="40" ry="25" fill="rgba(255,255,255,0.04)" transform="rotate(-20 130 130)" />
        <ellipse cx="190" cy="180" rx="30" ry="20" fill="rgba(0,0,0,0.1)" transform="rotate(15 190 180)" />
        {ringColor && (
          <ellipse cx="160" cy="160" rx="180" ry="30" fill="none"
            stroke={ringColor} strokeWidth="3"
            style={{ animation: 'ringPulse 8s ease-in-out infinite' }}
            transform="rotate(-10 160 160)"
          />
        )}
        {showAstronauts && (
          <>
            {/* Left astronaut */}
            <g transform="translate(110, 55)">
              <ellipse cx="12" cy="8" rx="8" ry="9" fill="#ddd" stroke="#999" strokeWidth="0.8" />
              <rect x="4" y="15" width="16" height="20" rx="4" fill="#ccc" stroke="#999" strokeWidth="0.8" />
              <rect x="6" y="6" width="12" height="8" rx="2" fill="rgba(100,200,255,0.3)" stroke="#aaa" strokeWidth="0.5" />
              <rect x="0" y="18" width="6" height="12" rx="2" fill="#bbb" />
              <rect x="18" y="18" width="6" height="12" rx="2" fill="#bbb" />
              <rect x="5" y="33" width="6" height="10" rx="2" fill="#bbb" />
              <rect x="13" y="33" width="6" height="10" rx="2" fill="#bbb" />
            </g>
            {/* Right astronaut */}
            <g transform="translate(190, 50)">
              <ellipse cx="12" cy="8" rx="8" ry="9" fill="#ddd" stroke="#999" strokeWidth="0.8" />
              <rect x="4" y="15" width="16" height="20" rx="4" fill="#ccc" stroke="#999" strokeWidth="0.8" />
              <rect x="6" y="6" width="12" height="8" rx="2" fill="rgba(255,150,200,0.3)" stroke="#aaa" strokeWidth="0.5" />
              <rect x="0" y="18" width="6" height="12" rx="2" fill="#bbb" />
              <rect x="18" y="18" width="6" height="12" rx="2" fill="#bbb" />
              <rect x="5" y="33" width="6" height="10" rx="2" fill="#bbb" />
              <rect x="13" y="33" width="6" height="10" rx="2" fill="#bbb" />
            </g>
          </>
        )}
      </svg>
      <OrbitingParticles count={20} radius={160} color={glowColor.replace('0.3', '0.8')} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ORBITING PARTICLES
// ═══════════════════════════════════════════════════════════════
export function OrbitingParticles({ count = 15, radius = 150, color = 'rgba(100,200,255,0.8)' }) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      size: 2 + Math.random() * 3,
      dur: 8 + Math.random() * 12,
      delay: i * 0.7,
      r: radius + (Math.random() - 0.5) * 40,
    })),
  [count, radius, color]);

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ left: '50%', top: '50%' }}>
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size, height: p.size,
            background: color,
            boxShadow: `0 0 ${p.size * 2}px ${color}`,
            '--orbit-r': `${p.r}px`,
            animation: `orbitParticle ${p.dur}s linear ${p.delay}s infinite`,
            left: 0, top: 0,
            transformOrigin: '0 0',
          }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// AURORA
// ═══════════════════════════════════════════════════════════════
export function Aurora({ colors = ['rgba(0,255,180,0.15)', 'rgba(0,180,255,0.12)', 'rgba(120,0,255,0.1)'], intensity = 1 }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {colors.map((color, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: `${5 + i * 8}%`,
            left: '-10%',
            right: '-10%',
            height: `${18 + i * 4}%`,
            background: `linear-gradient(180deg, transparent, ${color}, transparent)`,
            animation: `${i % 2 === 0 ? 'auroraWave1' : 'auroraWave2'} ${12 + i * 3}s ease-in-out infinite`,
            filter: `blur(${20 + i * 10}px)`,
            opacity: intensity,
          }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MOON
// ═══════════════════════════════════════════════════════════════
export function Moon({ x = 75, y = 12, size = 70, color = '#fffde0', glowSize = 3 }) {
  return (
    <div
      className="absolute rounded-full"
      style={{
        left: `${x}%`, top: `${y}%`,
        width: size, height: size,
        background: `radial-gradient(circle at 35% 35%, ${color}, #e8e4b0)`,
        boxShadow: `
          0 0 ${20 * glowSize}px rgba(255,255,200,0.3),
          0 0 ${40 * glowSize}px rgba(255,255,200,0.15),
          0 0 ${80 * glowSize}px rgba(255,255,200,0.08)
        `,
        animation: 'moonGlow 8s ease-in-out infinite',
      }}
    >
      <div className="absolute rounded-full" style={{ top: '20%', left: '25%', width: '15%', height: '15%', background: 'rgba(200,195,160,0.4)' }} />
      <div className="absolute rounded-full" style={{ top: '45%', left: '55%', width: '20%', height: '18%', background: 'rgba(200,195,160,0.3)' }} />
      <div className="absolute rounded-full" style={{ top: '65%', left: '30%', width: '12%', height: '12%', background: 'rgba(200,195,160,0.35)' }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ISLAND SILHOUETTE
// ═══════════════════════════════════════════════════════════════
export function IslandSilhouette({ color = '#0a1520' }) {
  return (
    <div className="absolute bottom-0 left-0 right-0" style={{ height: '45%' }}>
      <svg viewBox="0 0 1200 400" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full">
        <path
          d="M0 400 L0 280 Q50 260 100 270 Q150 250 200 260 Q250 220 300 230
             Q350 200 400 190 Q420 180 440 175 Q460 160 480 155 Q500 145 520 150
             Q540 140 560 145 Q580 150 600 155 Q620 165 640 170 Q660 180 680 185
             Q720 195 760 210 Q800 225 850 240 Q900 250 950 260
             Q1000 265 1050 270 Q1100 275 1150 280 L1200 285 L1200 400Z"
          fill={color}
        />
        {/* Trees */}
        <g opacity="0.7">
          <path d="M420 175 L420 140 Q415 120 420 100 Q425 120 420 140" fill="#0d1d2a" />
          <circle cx="420" cy="100" r="18" fill="#0d2520" />
          <path d="M480 155 L480 115 Q475 95 480 75 Q485 95 480 115" fill="#0d1d2a" />
          <circle cx="480" cy="75" r="22" fill="#0d2520" />
          <path d="M540 145 L540 110 Q535 90 540 70 Q545 90 540 110" fill="#0d1d2a" />
          <circle cx="540" cy="70" r="20" fill="#0d2520" />
          <path d="M600 155 L600 120 Q595 100 600 85 Q605 100 600 120" fill="#0d1d2a" />
          <circle cx="600" cy="85" r="16" fill="#0d2520" />
        </g>
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// OCEAN
// ═══════════════════════════════════════════════════════════════
export function Ocean({ color = 'rgba(10,30,60,0.9)', shimmerColor = 'rgba(100,200,255,0.1)' }) {
  const shimmers = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      w: 20 + Math.random() * 60,
      delay: Math.random() * 8,
      dur: 4 + Math.random() * 4,
    })),
  []);

  return (
    <div className="absolute bottom-0 left-0 right-0" style={{ height: '30%', background: `linear-gradient(180deg, transparent, ${color})` }}>
      {shimmers.map(s => (
        <div
          key={s.id}
          className="absolute"
          style={{
            left: `${s.x}%`, top: `${s.y}%`,
            width: s.w, height: 1.5,
            background: shimmerColor,
            animation: `waterShimmer ${s.dur}s ease-in-out ${s.delay}s infinite`,
            borderRadius: '50%',
          }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MOON REFLECTION (on water)
// ═══════════════════════════════════════════════════════════════
export function MoonReflection({ x = 75 }) {
  const rays = useMemo(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      offset: (i - 7) * 1.2,
      width: 2 + Math.random() * 4,
      height: 15 + Math.random() * 30,
      delay: Math.random() * 4,
      dur: 3 + Math.random() * 3,
      opacity: 0.1 + Math.random() * 0.2,
    })),
  [x]);

  return (
    <div className="absolute pointer-events-none" style={{ left: `${x}%`, bottom: '5%', transform: 'translateX(-50%)', width: 80, height: 120 }}>
      {rays.map(r => (
        <div
          key={r.id}
          className="absolute rounded-full"
          style={{
            left: `calc(50% + ${r.offset}px)`,
            top: `${r.id * 7}%`,
            width: r.width,
            height: r.height,
            background: 'rgba(255,255,200,0.3)',
            animation: `waterShimmer ${r.dur}s ease-in-out ${r.delay}s infinite`,
            opacity: r.opacity,
            filter: 'blur(1px)',
          }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LIGHTHOUSE
// ═══════════════════════════════════════════════════════════════
export function Lighthouse() {
  return (
    <div className="absolute" style={{ left: '18%', bottom: '32%', width: 40, height: 100 }}>
      {/* Tower */}
      <div style={{
        position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: 14, height: 60, background: 'linear-gradient(90deg, #2a2a3a, #3a3a4a, #2a2a3a)',
        borderRadius: '4px 4px 0 0',
      }} />
      {/* Light housing */}
      <div style={{
        position: 'absolute', bottom: 60, left: '50%', transform: 'translateX(-50%)',
        width: 20, height: 15, background: '#3a3a4a', borderRadius: '3px 3px 0 0',
      }} />
      {/* Light */}
      <div style={{
        position: 'absolute', bottom: 65, left: '50%', transform: 'translateX(-50%)',
        width: 10, height: 8,
        background: 'rgba(255,255,200,0.9)',
        boxShadow: '0 0 20px rgba(255,255,200,0.5)',
        borderRadius: '50%',
      }} />
      {/* Beam */}
      <div style={{
        position: 'absolute', bottom: 67, left: '50%',
        width: 300, height: 4,
        background: 'linear-gradient(90deg, rgba(255,255,200,0.4), transparent)',
        transformOrigin: '0 50%',
        animation: 'lighthouseBeam 8s ease-in-out infinite',
        filter: 'blur(2px)',
      }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// BIOLUMINESCENT WAVES
// ═══════════════════════════════════════════════════════════════
export function BioluminescentWaves({ count = 40, color = 'rgba(0,200,255,0.6)' }) {
  const dots = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 75 + Math.random() * 25,
      size: 2 + Math.random() * 4,
      delay: Math.random() * 12,
      dur: 4 + Math.random() * 6,
    })),
  [count, color]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map(d => (
        <div
          key={d.id}
          className="absolute rounded-full"
          style={{
            left: `${d.x}%`, top: `${d.y}%`,
            width: d.size, height: d.size,
            background: color,
            boxShadow: `0 0 ${d.size * 3}px ${color}`,
            animation: `bioluminescence ${d.dur}s ease-in-out ${d.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// COASTAL MIST
// ═══════════════════════════════════════════════════════════════
export function CoastalMist({ color = 'rgba(150,180,200,0.12)' }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="absolute"
          style={{
            bottom: `${20 + i * 5}%`,
            left: '-10%', right: '-10%',
            height: `${12 + i * 4}%`,
            background: `linear-gradient(180deg, transparent, ${color}, transparent)`,
            animation: `coastMist ${15 + i * 5}s ease-in-out ${i * 3}s infinite`,
            filter: `blur(${25 + i * 10}px)`,
          }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// GOLDEN DUST
// ═══════════════════════════════════════════════════════════════
export function GoldenDust({ count = 40, color = 'rgba(255,215,100,0.6)' }) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 2 + Math.random() * 3,
      delay: Math.random() * 20,
      dur: 12 + Math.random() * 10,
    })),
  [count, color]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`, bottom: 0,
            width: p.size, height: p.size,
            background: color,
            boxShadow: `0 0 ${p.size * 2}px ${color}`,
            animation: `goldenRise ${p.dur}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ENERGY THREADS (for eclipse scene)
// ═══════════════════════════════════════════════════════════════
export function EnergyThreads({ count = 5, color = 'rgba(200,50,80,0.4)' }) {
  const threads = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x1: 35 + Math.random() * 10,
      y1: 20 + Math.random() * 30,
      x2: 55 + Math.random() * 10,
      y2: 20 + Math.random() * 30,
      delay: i * 4 + Math.random() * 3,
      dur: 3 + Math.random() * 4,
    })),
  [count, color]);

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
      {threads.map(t => (
        <g key={t.id} style={{ animation: `energyThread ${t.dur}s ease-in-out ${t.delay}s infinite` }}>
          <line
            x1={`${t.x1}%`} y1={`${t.y1}%`}
            x2={`${t.x2}%`} y2={`${t.y2}%`}
            stroke={color} strokeWidth="0.3"
            filter="url(#energyBlur)"
          />
        </g>
      ))}
      <defs>
        <filter id="energyBlur">
          <feGaussianBlur stdDeviation="0.5" />
        </filter>
      </defs>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════
// HEALING LIGHT (for reunion scene)
// ═══════════════════════════════════════════════════════════════
export function HealingLight() {
  return (
    <div className="absolute pointer-events-none" style={{
      left: '50%', bottom: '25%', transform: 'translateX(-50%)',
      width: 200, height: 300,
    }}>
      <div className="absolute" style={{
        left: '50%', top: 0, transform: 'translateX(-50%)',
        width: 4, height: '100%',
        background: 'linear-gradient(180deg, rgba(100,255,200,0.5), rgba(100,255,200,0.1), transparent)',
        filter: 'blur(3px)',
        animation: 'shimmer 4s ease-in-out infinite',
      }} />
      <div className="absolute" style={{
        left: '50%', top: '10%', transform: 'translateX(-50%)',
        width: 40, height: 40,
        background: 'radial-gradient(circle, rgba(100,255,200,0.4), transparent)',
        animation: 'heartBeat 3s ease-in-out infinite',
        borderRadius: '50%',
      }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DARK VIGNETTE
// ═══════════════════════════════════════════════════════════════
export function DarkVignette({ intensity = 0.6 }) {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{
      background: `radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,${intensity}) 100%)`,
    }} />
  );
}

// ═══════════════════════════════════════════════════════════════
// SPIRAL GALAXY
// ═══════════════════════════════════════════════════════════════
export function SpiralGalaxy({ x = 80, y = 15, size = 80, color = 'rgba(150,120,255,0.3)' }) {
  return (
    <div
      className="absolute"
      style={{
        left: `${x}%`, top: `${y}%`,
        width: size, height: size,
        animation: 'slowRotate 120s linear infinite',
      }}
    >
      <div className="absolute inset-0 rounded-full" style={{
        background: `radial-gradient(ellipse at center, ${color}, transparent 70%)`,
        transform: 'rotate(30deg) scaleY(0.6)',
        filter: 'blur(4px)',
      }} />
      <div className="absolute inset-0 rounded-full" style={{
        background: `radial-gradient(ellipse at center, ${color.replace('0.3', '0.15')}, transparent 60%)`,
        transform: 'rotate(-30deg) scaleY(0.5)',
        filter: 'blur(6px)',
      }} />
      <div className="absolute rounded-full" style={{
        left: '40%', top: '40%', width: '20%', height: '20%',
        background: `radial-gradient(circle, rgba(255,255,255,0.3), transparent)`,
      }} />
    </div>
  );
}
