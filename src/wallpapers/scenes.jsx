import React, { useEffect, useRef } from 'react';
import {
  WallpaperStyles, StarField, ShootingStars, Fireflies, Birds, Whale,
  SpaceJellyfish, Constellations, BackgroundPlanets, Comets, NebulaClouds,
  CenterPlanet, Aurora, Moon, IslandSilhouette, Ocean, MoonReflection,
  Lighthouse, BioluminescentWaves, CoastalMist, GoldenDust, EnergyThreads,
  HealingLight, DarkVignette, SpiralGalaxy, OrbitingParticles,
} from './shared';
import { registerAutoStart, startSceneAudio, stopAllAudio } from './audio';

// ─── Audio hook for each scene ────────────────────────────────
function useSceneAudio(sceneId) {
  const cleanupRef = useRef(null);

  useEffect(() => {
    let disposed = false;
    const removeListeners = registerAutoStart(() => {
      if (disposed) return;
      cleanupRef.current = startSceneAudio(sceneId);
    });

    return () => {
      disposed = true;
      removeListeners();
      stopAllAudio();
    };
  }, [sceneId]);
}

// ═══════════════════════════════════════════════════════════════
// 1. MIDNIGHT SHORE
// ═══════════════════════════════════════════════════════════════
export function MidnightShore() {
  useSceneAudio('midnight-shore');

  return (
    <div className="relative w-full h-full overflow-hidden" style={{
      background: 'linear-gradient(180deg, #020810 0%, #081828 30%, #0a2040 60%, #0d2a50 100%)',
    }}>
      <WallpaperStyles />
      <StarField count={250} brightness={0.8} />
      <ShootingStars count={4} color="#a0c8ff" />

      {/* Aurora - cool tones */}
      <Aurora
        colors={['rgba(0,200,180,0.12)', 'rgba(0,120,200,0.1)', 'rgba(60,0,180,0.08)']}
        intensity={0.8}
      />

      {/* Moon */}
      <Moon x={78} y={8} size={65} glowSize={2.5} />

      {/* Moon reflection on water */}
      <MoonReflection x={78} />

      {/* Lighthouse */}
      <Lighthouse />

      {/* Island silhouette */}
      <IslandSilhouette color="#060e18" />

      {/* Coastal mist */}
      <CoastalMist color="rgba(100,150,200,0.08)" />

      {/* Ocean */}
      <Ocean color="rgba(5,15,35,0.95)" shimmerColor="rgba(80,160,220,0.08)" />

      {/* Bioluminescent plankton */}
      <BioluminescentWaves count={30} color="rgba(0,180,255,0.5)" />

      {/* Fireflies near island */}
      <Fireflies count={18} color="#80c8ff" spread="bottom" />

      {/* Birds */}
      <Birds count={3} />

      {/* Whale */}
      <Whale />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 2. AURORA'S EMBRACE
// ═══════════════════════════════════════════════════════════════
export function AurorasEmbrace() {
  useSceneAudio('auroras-embrace');

  return (
    <div className="relative w-full h-full overflow-hidden" style={{
      background: 'linear-gradient(180deg, #05101a 0%, #0a2035 25%, #102a45 50%, #0d2a50 75%, #081a30 100%)',
    }}>
      <WallpaperStyles />
      <StarField count={300} brightness={1} />
      <ShootingStars count={8} color="#ffcc80" />

      {/* Vibrant multi-color aurora */}
      <Aurora
        colors={[
          'rgba(0,255,180,0.18)',
          'rgba(0,200,255,0.15)',
          'rgba(180,0,255,0.12)',
          'rgba(255,100,200,0.08)',
          'rgba(0,255,120,0.1)',
        ]}
        intensity={1.2}
      />

      {/* Warm bright moon */}
      <Moon x={72} y={10} size={80} color="#fff5d0" glowSize={4} />

      {/* Moon path on water */}
      <MoonReflection x={72} />

      {/* Constellations visible from coast */}
      <Constellations indices={[0, 3, 6]} color="rgba(200,220,255,0.4)" scale={0.7} />

      {/* Island */}
      <IslandSilhouette color="#081520" />

      {/* Rich mist */}
      <CoastalMist color="rgba(150,200,180,0.1)" />

      {/* Ocean */}
      <Ocean color="rgba(5,20,40,0.9)" shimmerColor="rgba(0,200,180,0.12)" />

      {/* Vivid bioluminescent waves */}
      <BioluminescentWaves count={60} color="rgba(0,255,200,0.5)" />

      {/* Warm fireflies */}
      <Fireflies count={30} color="#FFD070" spread="bottom" />
      <Fireflies count={10} color="#80FFD0" spread="full" />

      {/* Birds */}
      <Birds count={5} />

      {/* Whale */}
      <Whale />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 3. CELESTIAL WANDERERS
// ═══════════════════════════════════════════════════════════════
export function CelestialWanderers() {
  useSceneAudio('celestial-wanderers');

  return (
    <div className="relative w-full h-full overflow-hidden" style={{
      background: 'radial-gradient(ellipse at 50% 80%, #0a1a2a 0%, #050d18 40%, #020408 100%)',
    }}>
      <WallpaperStyles />
      <StarField count={350} brightness={1.1} />
      <ShootingStars count={10} color="#88ccff" />

      {/* Nebula clouds */}
      <NebulaClouds colors={[
        'rgba(40,20,100,0.2)',
        'rgba(20,50,120,0.18)',
        'rgba(80,20,80,0.12)',
        'rgba(20,80,100,0.1)',
      ]} />

      {/* Spiral galaxy */}
      <SpiralGalaxy x={82} y={10} size={90} color="rgba(130,100,255,0.25)" />
      <SpiralGalaxy x={12} y={5} size={50} color="rgba(100,150,255,0.15)" />

      {/* All constellations */}
      <Constellations indices={[0, 1, 2, 3, 4, 5, 6]} color="rgba(150,200,255,0.6)" scale={1} />

      {/* Background planets */}
      <BackgroundPlanets count={8} brightness={1} />

      {/* Comets */}
      <Comets count={4} color="#88ddff" />

      {/* Space jellyfish */}
      <SpaceJellyfish count={4} colorHue={220} />

      {/* Center planet with astronauts */}
      <CenterPlanet
        gradient={['#0a2a4a', '#1a5a8a', '#0a3a5a']}
        glowColor="rgba(80,180,255,0.3)"
        showAstronauts={true}
      />

      {/* Dust motes */}
      <GoldenDust count={25} color="rgba(150,200,255,0.4)" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 4. ECLIPSE OF HEARTS
// ═══════════════════════════════════════════════════════════════
export function EclipseOfHearts() {
  useSceneAudio('eclipse-of-hearts');

  return (
    <div className="relative w-full h-full overflow-hidden" style={{
      background: 'radial-gradient(ellipse at 50% 80%, #120a1a 0%, #0a0510 40%, #020204 100%)',
    }}>
      <WallpaperStyles />
      <StarField count={120} brightness={0.4} />

      {/* Dark nebula hints */}
      <NebulaClouds colors={[
        'rgba(120,20,40,0.15)',
        'rgba(60,10,80,0.12)',
        'rgba(20,10,40,0.2)',
      ]} />

      {/* Very few dim constellations */}
      <Constellations indices={[4, 2]} color="rgba(150,100,120,0.25)" scale={0.8} />

      {/* Sparse background planets */}
      <BackgroundPlanets count={3} brightness={0.4} />

      {/* Energy threads between astronauts */}
      <EnergyThreads count={7} color="rgba(200,50,80,0.35)" />

      {/* Dimmed jellyfish */}
      <SpaceJellyfish count={2} colorHue={320} />

      {/* Dark pulsing particles */}
      <GoldenDust count={15} color="rgba(200,80,100,0.3)" />

      {/* Center planet - darker, eclipsed feel */}
      <CenterPlanet
        gradient={['#1a0a1a', '#2a1030', '#150818']}
        glowColor="rgba(200,50,80,0.25)"
        ringColor="rgba(200,80,100,0.15)"
        showAstronauts={true}
      />

      {/* Heavy vignette */}
      <DarkVignette intensity={0.7} />

      {/* Sparse tense comets */}
      <Comets count={2} color="#cc4466" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 5. STARBORN REUNION
// ═══════════════════════════════════════════════════════════════
export function StarbornReunion() {
  useSceneAudio('starborn-reunion');

  return (
    <div className="relative w-full h-full overflow-hidden" style={{
      background: 'radial-gradient(ellipse at 50% 80%, #0a1a15 0%, #050d18 40%, #020408 100%)',
    }}>
      <WallpaperStyles />
      <StarField count={400} brightness={1.3} />
      <ShootingStars count={12} color="#88ffcc" />

      {/* Warm golden nebula */}
      <NebulaClouds colors={[
        'rgba(40,80,60,0.2)',
        'rgba(20,60,80,0.18)',
        'rgba(80,60,20,0.15)',
        'rgba(60,100,80,0.12)',
      ]} />

      {/* Spiral galaxies */}
      <SpiralGalaxy x={85} y={8} size={70} color="rgba(100,200,150,0.2)" />

      {/* All constellations bright, plus heart */}
      <Constellations indices={[0, 1, 2, 3, 4, 5, 6, 7]} color="rgba(150,255,200,0.7)" scale={1.1} />

      {/* Background planets bright */}
      <BackgroundPlanets count={8} brightness={1.2} />

      {/* Comets */}
      <Comets count={5} color="#80ffd0" />

      {/* Bright jellyfish */}
      <SpaceJellyfish count={5} colorHue={160} />

      {/* Healing light */}
      <HealingLight />

      {/* Center planet - warm glow */}
      <CenterPlanet
        gradient={['#0a2a1a', '#1a5a4a', '#0a3a2a']}
        glowColor="rgba(80,255,180,0.35)"
        showAstronauts={true}
      />

      {/* Golden rising dust */}
      <GoldenDust count={50} color="rgba(255,215,100,0.5)" />
      <GoldenDust count={30} color="rgba(100,255,200,0.4)" />

      {/* Rainbow shimmer at edges */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(135deg, rgba(255,100,100,0.03), rgba(255,200,100,0.03), rgba(100,255,100,0.03), rgba(100,200,255,0.03), rgba(200,100,255,0.03))',
        animation: 'shimmer 6s ease-in-out infinite',
      }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// WALLPAPER REGISTRY
// ═══════════════════════════════════════════════════════════════
export const WALLPAPERS = [
  {
    id: 'midnight-shore',
    name: 'Midnight Shore',
    description: 'A tranquil coastline under moonlight where fireflies dance above ancient trees and a lone lighthouse guides wanderers home.',
    component: MidnightShore,
    previewBg: 'linear-gradient(135deg, #020810, #081828, #0a2040)',
    previewAccent: '#80c8ff',
    category: 'Coastline',
  },
  {
    id: 'auroras-embrace',
    name: "Aurora's Embrace",
    description: 'A radiant coastline illuminated by ethereal auroras and bioluminescent tides, where the sky ignites with impossible colors.',
    component: AurorasEmbrace,
    previewBg: 'linear-gradient(135deg, #05101a, #0a2035, #102a45)',
    previewAccent: '#80ffd0',
    category: 'Coastline',
  },
  {
    id: 'celestial-wanderers',
    name: 'Celestial Wanderers',
    description: 'Two souls exploring the infinite cosmos among ancient constellations, drifting jellyfish, and swirling galaxies.',
    component: CelestialWanderers,
    previewBg: 'linear-gradient(135deg, #050d18, #0a1a2a, #020408)',
    previewAccent: '#88ccff',
    category: 'Space',
  },
  {
    id: 'eclipse-of-hearts',
    name: 'Eclipse of Hearts',
    description: 'A tense celestial moment shrouded in crimson energy, where even the stars hold their breath and space itself trembles.',
    component: EclipseOfHearts,
    previewBg: 'linear-gradient(135deg, #120a1a, #0a0510, #020204)',
    previewAccent: '#cc4466',
    category: 'Space',
  },
  {
    id: 'starborn-reunion',
    name: 'Starborn Reunion',
    description: 'The cosmos celebrates in golden light as two wanderers find their way back, the universe abloom with healing radiance.',
    component: StarbornReunion,
    previewBg: 'linear-gradient(135deg, #0a1a15, #050d18, #020408)',
    previewAccent: '#80ffd0',
    category: 'Space',
  },
];
