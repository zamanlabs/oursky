import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route, useParams } from 'react-router-dom';
import Gallery from './wallpapers/Gallery';
import { WALLPAPERS } from './wallpapers/scenes';
import './index.css';

function WallpaperPage() {
  const { id } = useParams();
  const wallpaper = WALLPAPERS.find(w => w.id === id);

  if (!wallpaper) {
    return (
      <div className="w-full h-screen flex items-center justify-center"
        style={{ background: '#060810', color: '#666' }}>
        <div className="text-center">
          <p className="text-xl mb-4">Wallpaper not found</p>
          <a href="#/" className="text-blue-400 underline text-sm">Back to gallery</a>
        </div>
      </div>
    );
  }

  const Scene = wallpaper.component;
  return (
    <div className="w-full h-screen overflow-hidden">
      <Scene />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Gallery />} />
        <Route path="/:id" element={<WallpaperPage />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);
