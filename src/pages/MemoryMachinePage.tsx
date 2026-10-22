import React, { useState, useEffect } from 'react';
import { useJourney } from '../context/JourneyContext';
import { Photo } from '../types';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  RotateCw, 
  Heart, 
  Maximize2, 
  Camera, 
  Layers, 
  MapPin, 
  Calendar, 
  BookOpen, 
  Compass, 
  X 
} from 'lucide-react';

export const MemoryMachinePage: React.FC = () => {
  const { photos, isFavorite, toggleFavorite } = useJourney();

  const [currentPhoto, setCurrentPhoto] = useState<Photo | null>(null);
  const [isShutterActive, setIsShutterActive] = useState<boolean>(false);
  const [isDeveloping, setIsDeveloping] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<'All' | 'Varanasi' | 'Ayodhya'>('All');
  const [viewMode, setViewMode] = useState<'polaroid' | 'constellation'>('polaroid');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Filtered photo pool based on city
  const pool = photos.filter(p => selectedCity === 'All' || p.city === selectedCity);

  // Play synthetic camera shutter click
  const playShutterSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {
      // AudioContext unavailable
    }
  };

  // Trigger Memory Recall
  const triggerTakeMeBack = () => {
    if (pool.length === 0) return;

    // Trigger visual shutter flash & sound
    setIsShutterActive(true);
    playShutterSound();

    setTimeout(() => {
      // Select random photo different from current
      let nextIndex = Math.floor(Math.random() * pool.length);
      if (pool.length > 1 && currentPhoto && pool[nextIndex].id === currentPhoto.id) {
        nextIndex = (nextIndex + 1) % pool.length;
      }
      setCurrentPhoto(pool[nextIndex]);
      setIsShutterActive(false);

      // Start photo development animation
      setIsDeveloping(true);
      setTimeout(() => {
        setIsDeveloping(false);
      }, 1400);
    }, 280);
  };

  // Select initial photo on mount
  useEffect(() => {
    if (!currentPhoto && photos.length > 0) {
      setCurrentPhoto(photos[0]);
    }
  }, [photos, currentPhoto]);

  // Keyboard navigation (Spacebar or Enter to take photo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && viewMode === 'polaroid' && !isFullscreen) {
        e.preventDefault();
        triggerTakeMeBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pool, currentPhoto, viewMode, isFullscreen]);

  return (
    <div className="min-h-screen bg-[#08080a] text-[#f7f4ee] pt-28 pb-20 overflow-x-hidden">
      
      {/* Visual Shutter Flash Overlay */}
      {isShutterActive && (
        <div className="fixed inset-0 z-50 bg-white pointer-events-none transition-opacity duration-300" />
      )}

      {/* Header Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-[#c86d51]/40 text-xs text-[#c86d51] uppercase tracking-widest mb-3">
          <Camera size={13} />
          <span>Analog Discovery Simulator</span>
        </div>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-black tracking-tight text-[#f7f4ee]">
          THE MEMORY MACHINE
        </h1>
        <div className="font-devanagari text-xl text-[#c5a059] mt-1 mb-3">
          स्मृति यंत्र — काशिका एवं अवध के क्षण
        </div>
        <p className="font-serif-editorial text-base sm:text-lg text-[#b8b3a5] max-w-xl mx-auto italic">
          "Press the shutter to reach back across time. Watch the memory develop into light, grain, and gold."
        </p>

        {/* View mode toggle (Polaroid vs Constellation) */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <div className="inline-flex p-1 rounded-full bg-[#141418] border border-white/10">
            <button
              onClick={() => setViewMode('polaroid')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all flex items-center gap-1.5 ${
                viewMode === 'polaroid'
                  ? 'bg-[#d4af37] text-[#09090b]'
                  : 'text-[#b8b3a5] hover:text-[#f7f4ee]'
              }`}
            >
              <Camera size={13} />
              <span>Vintage Shutter</span>
            </button>
            <button
              onClick={() => setViewMode('constellation')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all flex items-center gap-1.5 ${
                viewMode === 'constellation'
                  ? 'bg-[#d4af37] text-[#09090b]'
                  : 'text-[#b8b3a5] hover:text-[#f7f4ee]'
              }`}
            >
              <Sparkles size={13} />
              <span>Memory Constellation</span>
            </button>
          </div>
        </div>

        {/* City Filter Pills */}
        <div className="flex justify-center gap-2 mt-4 text-xs">
          {(['All', 'Varanasi', 'Ayodhya'] as const).map(city => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1 rounded-full transition-all ${
                selectedCity === city
                  ? 'bg-white/10 text-[#d4af37] border border-[#d4af37]/40 font-semibold'
                  : 'text-[#b8b3a5] hover:text-[#f7f4ee]'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* MODE 1: POLAROID CAMERA INTERFACE */}
      {viewMode === 'polaroid' && currentPhoto && (
        <div className="max-w-2xl mx-auto px-4 flex flex-col items-center">
          
          {/* Main Shutter CTA Button */}
          <button
            onClick={triggerTakeMeBack}
            className="group relative mb-8 px-8 py-4 rounded-full btn-shimmer-gold text-[#09090b] font-cinzel font-black text-sm tracking-widest uppercase transition-all duration-300 shadow-[0_0_35px_rgba(212,175,55,0.4)] hover:scale-105 active:scale-95 flex items-center gap-3 cursor-pointer"
          >
            <div className="w-4 h-4 rounded-full bg-[#09090b] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
            </div>
            <span>Take Me Back</span>
            <RotateCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
          </button>

          {/* The Polaroid Card */}
          <div className="relative bg-[#faf7f2] text-[#1c1917] p-4 sm:p-6 pb-8 rounded-lg shadow-[0_20px_60px_rgba(0,0,0,0.9)] max-w-lg w-full transition-all duration-700 hover:rotate-0 rotate-[-1deg] border border-[#e5e0d3]">
            
            {/* Top Tape Accent */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-white/40 backdrop-blur-sm border border-black/5 rotate-1 opacity-80 pointer-events-none" />

            {/* Photo Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#242428] rounded shadow-inner">
              <img
                src={currentPhoto.src}
                alt={currentPhoto.caption}
                className={`w-full h-full object-cover transition-all duration-1000 ${
                  isDeveloping 
                    ? 'filter blur-sm brightness-125 sepia-50 scale-105' 
                    : 'filter blur-0 brightness-100 sepia-0 scale-100'
                }`}
              />

              {/* Development Shimmer Bar */}
              {isDeveloping && (
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent animate-pulse" />
              )}

              {/* Quick Actions overlay */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <button
                  onClick={() => toggleFavorite(currentPhoto.id)}
                  className="p-2 rounded-full bg-black/50 text-white hover:text-[#c86d51] backdrop-blur-md transition-colors"
                  title={isFavorite(currentPhoto.id) ? 'Saved' : 'Bookmark'}
                >
                  <Heart size={15} className={isFavorite(currentPhoto.id) ? 'text-[#c86d51] fill-[#c86d51]' : ''} />
                </button>
                <button
                  onClick={() => setIsFullscreen(true)}
                  className="p-2 rounded-full bg-black/50 text-white hover:text-[#d4af37] backdrop-blur-md transition-colors"
                  title="Fullscreen"
                >
                  <Maximize2 size={15} />
                </button>
              </div>
            </div>

            {/* Polaroid Handwriting / Editorial Caption */}
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between text-xs font-serif-editorial text-[#78716c]">
                <span className="flex items-center gap-1 font-semibold text-[#8c5036]">
                  <MapPin size={13} />
                  <span>{currentPhoto.city || 'Sacred Journey'}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={13} />
                  <span>{currentPhoto.date ? new Date(currentPhoto.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'October 2026'}</span>
                </span>
              </div>

              <p className="font-serif-editorial text-base sm:text-lg text-[#292524] italic leading-snug">
                "{currentPhoto.caption}"
              </p>

              {/* Related links */}
              {currentPhoto.locationId && (
                <div className="pt-3 border-t border-[#e5e0d3] flex items-center justify-between text-xs font-cinzel text-[#8c5036]">
                  <Link to={`/places/${currentPhoto.locationId}`} className="hover:underline flex items-center gap-1">
                    <Compass size={12} />
                    <span>View Location</span>
                  </Link>
                  <Link to="/journey" className="hover:underline flex items-center gap-1">
                    <BookOpen size={12} />
                    <span>Read Diary</span>
                  </Link>
                </div>
              )}
            </div>

          </div>

          <div className="text-[11px] text-[#b8b3a5] mt-6 italic">
            Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono">Space</kbd> on your keyboard to reveal another memory.
          </div>

        </div>
      )}

      {/* MODE 2: MEMORY CONSTELLATION (SPATIAL FLOATING TILES) */}
      {viewMode === 'constellation' && (
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-widest text-[#d4af37]">Spatial Cloud</span>
            <h2 className="font-cinzel text-xl text-[#f7f4ee] mt-1">Floating Memory Stars</h2>
            <p className="text-xs text-[#b8b3a5] mt-1">Click any memory star to bring it into focus.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {photos.map((p, idx) => (
              <div
                key={p.id}
                onClick={() => {
                  setCurrentPhoto(p);
                  setViewMode('polaroid');
                }}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-[#141418] border border-white/10 hover:border-[#d4af37] cursor-pointer transition-all duration-300 hover:scale-105 hover:z-10 shadow-lg"
                style={{
                  transform: `translateY(${(idx % 3) * 6}px)`
                }}
              >
                <img
                  src={p.thumbnail || p.src}
                  alt={p.caption}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                  <span className="text-[9px] font-bold text-[#d4af37] uppercase">{p.city}</span>
                  <span className="text-[10px] text-white line-clamp-1">{p.caption}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {isFullscreen && currentPhoto && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <X size={24} />
          </button>
          <div className="max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
            <img
              src={currentPhoto.src}
              alt={currentPhoto.caption}
              className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
            />
            <div className="text-center mt-4">
              <p className="font-serif-editorial text-xl italic text-[#f7f4ee] max-w-xl">
                "{currentPhoto.caption}"
              </p>
              <div className="text-xs text-[#c5a059] mt-1 font-mono">
                {currentPhoto.city} • October 2026
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
