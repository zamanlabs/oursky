import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { WALLPAPERS } from './scenes';
import { WallpaperStyles } from './shared';

function GalleryCard({ wallpaper, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={`/${wallpaper.id}`}
      className="block group relative rounded-2xl overflow-hidden transition-all duration-500"
      style={{
        animationDelay: `${index * 120}ms`,
        animation: 'cardAppear 0.6s ease-out both',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Preview background */}
      <div
        className="relative overflow-hidden"
        style={{ height: 220, background: wallpaper.previewBg }}
      >
        {/* Animated preview elements */}
        <div className="absolute inset-0 opacity-60">
          {Array.from({ length: 25 }, (_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: 1 + Math.random() * 2,
                height: 1 + Math.random() * 2,
                opacity: 0.3 + Math.random() * 0.7,
                animation: `twinkle ${3 + Math.random() * 4}s ease-in-out ${Math.random() * 5}s infinite`,
              }}
            />
          ))}
        </div>

        {/* Accent glow */}
        <div
          className="absolute transition-all duration-700"
          style={{
            bottom: -20,
            left: '50%',
            transform: 'translateX(-50%)',
            width: hovered ? 200 : 100,
            height: hovered ? 200 : 100,
            background: `radial-gradient(circle, ${wallpaper.previewAccent}40, transparent 70%)`,
            filter: 'blur(20px)',
          }}
        />

        {/* Category badge */}
        <div
          className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium"
          style={{
            background: `${wallpaper.previewAccent}20`,
            color: wallpaper.previewAccent,
            border: `1px solid ${wallpaper.previewAccent}30`,
            backdropFilter: 'blur(8px)',
          }}
        >
          {wallpaper.category}
        </div>

        {/* Play icon on hover */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
          style={{ opacity: hovered ? 1 : 0 }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background: `${wallpaper.previewAccent}20`,
              border: `2px solid ${wallpaper.previewAccent}50`,
              backdropFilter: 'blur(12px)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={wallpaper.previewAccent}>
              <polygon points="8,4 20,12 8,20" />
            </svg>
          </div>
        </div>
      </div>

      {/* Info section */}
      <div
        className="p-4 transition-colors duration-300"
        style={{
          background: hovered ? 'rgba(20,25,35,0.95)' : 'rgba(15,20,30,0.9)',
          borderTop: `1px solid ${wallpaper.previewAccent}15`,
        }}
      >
        <h3
          className="text-base font-semibold mb-1 transition-colors duration-300"
          style={{ color: hovered ? wallpaper.previewAccent : '#e0e0e0' }}
        >
          {wallpaper.name}
        </h3>
        <p className="text-xs leading-relaxed" style={{ color: 'rgba(180,190,210,0.7)' }}>
          {wallpaper.description}
        </p>
      </div>
    </Link>
  );
}

export default function Gallery() {
  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: 'linear-gradient(180deg, #060810 0%, #0a0e18 50%, #060810 100%)',
      }}
    >
      <WallpaperStyles />

      <style>{`
        @keyframes cardAppear {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes titleGlow {
          0%, 100% { text-shadow: 0 0 30px rgba(100,200,255,0.15); }
          50% { text-shadow: 0 0 60px rgba(100,200,255,0.3); }
        }
        @keyframes subtitleFade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Background stars */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 80 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: 1 + Math.random() * 1.5,
              height: 1 + Math.random() * 1.5,
              opacity: 0.2 + Math.random() * 0.4,
              animation: `twinkle ${4 + Math.random() * 6}s ease-in-out ${Math.random() * 8}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-14">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
            style={{
              color: '#e8eaf0',
              animation: 'titleGlow 6s ease-in-out infinite',
            }}
          >
            Live Wallpapers
          </h1>
          <p
            className="text-sm md:text-base max-w-lg mx-auto"
            style={{
              color: 'rgba(160,180,220,0.6)',
              animation: 'subtitleFade 1s ease-out 0.3s both',
            }}
          >
            Choose a scene to immerse yourself in. Each wallpaper features
            unique ambient visuals and generative audio.
          </p>
        </div>

        {/* Wallpaper grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {WALLPAPERS.map((wp, i) => (
            <GalleryCard key={wp.id} wallpaper={wp} index={i} />
          ))}
        </div>

        {/* Footer hint */}
        <p
          className="text-center mt-12 text-xs"
          style={{ color: 'rgba(120,140,180,0.4)' }}
        >
          Audio starts automatically on interaction. Best experienced fullscreen.
        </p>
      </div>
    </div>
  );
}
