import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Compass, 
  BookOpen, 
  Sparkles, 
  Image as ImageIcon, 
  Swords, 
  PenTool, 
  ShieldCheck, 
  Volume2, 
  VolumeX, 
  Heart, 
  Menu, 
  X 
} from 'lucide-react';
import { useJourney } from '../../context/JourneyContext';

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const {
    favorites,
    isAudioPlaying,
    toggleAudio,
    audioVolume,
    setAudioVolume,
    audioError
  } = useJourney();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/journey', label: 'Diaries', icon: BookOpen, desc: '5-Day Memoir' },
    { to: '/atlas', label: 'Atlas Map', icon: Compass, desc: 'Interactive Route' },
    { to: '/memories', label: 'Memory Machine', icon: Sparkles, desc: 'Vintage Shutter' },
    { to: '/gallery', label: 'Museum', icon: ImageIcon, desc: 'Exhibition' },
    { to: '/camera-wars', label: 'Camera Wars', icon: Swords, desc: 'S25 vs iPhone 17' },
    { to: '/guestbook', label: 'Guestbook', icon: PenTool, desc: 'Postcards' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-[#09090b]/85 backdrop-blur-md border-b border-[#d4af37]/20 py-3 shadow-2xl' 
          : 'bg-gradient-to-b from-[#09090b]/90 via-[#09090b]/40 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <Link to="/" className="group flex flex-col items-start focus:outline-none">
          <span className="font-cinzel text-base sm:text-lg md:text-xl font-bold tracking-[0.2em] text-[#f7f4ee] group-hover:text-[#d4af37] transition-colors duration-300">
            THE ETERNAL JOURNEY
          </span>
          <span className="font-devanagari text-[11px] sm:text-xs text-[#c5a059] tracking-wider opacity-90 group-hover:opacity-100 transition-opacity">
            काशी से अयोध्या • OCT 16–20, 2026
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center space-x-1 xl:space-x-2 whitespace-nowrap">
          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-3 py-2 rounded-full text-xs xl:text-sm font-medium tracking-wide transition-all duration-300 flex items-center gap-1.5 ${
                  isActive
                    ? 'text-[#d4af37] bg-[#d4af37]/10 border border-[#d4af37]/40 shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                    : 'text-[#b8b3a5] hover:text-[#f7f4ee] hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-[#d4af37]' : 'text-[#b8b3a5]'} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Controls (Audio, Favorites, Admin, Mobile Toggle) */}
        <div className="relative flex items-center space-x-2 sm:space-x-3">
          {/* Ambient Sound Toggle */}
          <button
            onClick={toggleAudio}
            title={isAudioPlaying ? 'Mute ambient soundscape' : 'Play sacred ambient soundscape'}
            className={`p-2 rounded-full border transition-all duration-300 ${
              isAudioPlaying
                ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.3)] animate-pulse'
                : 'bg-white/5 border-white/10 text-[#b8b3a5] hover:text-[#f7f4ee] hover:border-[#d4af37]/40'
            }`}
            aria-label="Toggle ambient sound"
          >
            {isAudioPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* The range remains secondary to the existing toggle and is available on larger screens. */}
          <label className="hidden sm:flex items-center" title={`Soundscape volume: ${Math.round(audioVolume * 100)}%`}>
            <span className="sr-only">Soundscape volume</span>
            <input
              type="range"
              min="0"
              max="100"
              value={Math.round(audioVolume * 100)}
              onChange={(event) => setAudioVolume(Number(event.target.value) / 100)}
              className="w-16 lg:w-20 h-1 cursor-pointer accent-[#d4af37]"
              aria-label="Soundscape volume"
              aria-valuetext={`${Math.round(audioVolume * 100)} percent`}
            />
          </label>

          {/* Bookmarked Favorites Link */}
          <Link
            to="/gallery?filter=favorites"
            title={`${favorites.length} saved memories`}
            className="relative p-2 rounded-full bg-white/5 border border-white/10 text-[#b8b3a5] hover:text-[#d4af37] hover:border-[#d4af37]/40 transition-colors"
          >
            <Heart size={16} className={favorites.length > 0 ? 'text-[#c86d51] fill-[#c86d51]' : ''} />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#d4af37] text-[#09090b] text-[10px] font-bold flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </Link>

          {/* Admin link */}
          <Link
            to="/admin"
            title="Curator & Admin Portal"
            className="hidden sm:flex items-center p-2 rounded-full bg-white/5 border border-white/10 text-[#b8b3a5] hover:text-[#d4af37] hover:border-[#d4af37]/40 transition-colors"
          >
            <ShieldCheck size={16} />
          </Link>

          {/* Mobile menu hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-[#f7f4ee] hover:border-[#d4af37]/50"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <span className="sr-only" role="status" aria-live="polite">
            {audioError || (isAudioPlaying ? 'Sacred soundscape is playing' : 'Sacred soundscape is muted')}
          </span>

          {audioError && (
            <span
              role="alert"
              className="absolute right-0 top-full mt-2 w-56 rounded-md border border-[#c86d51]/60 bg-[#09090b]/95 px-3 py-2 text-[11px] leading-snug text-[#f4b4a1] shadow-xl"
            >
              Soundtrack unavailable. Please try again after checking your connection.
            </span>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-x-0 top-[60px] bg-[#09090b]/98 backdrop-blur-xl border-b border-[#d4af37]/30 px-6 py-6 shadow-2xl animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col space-y-2">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = location.pathname.startsWith(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    isActive
                      ? 'bg-[#d4af37]/15 border-[#d4af37]/50 text-[#d4af37]'
                      : 'bg-white/5 border-white/5 text-[#f7f4ee] hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? 'text-[#d4af37]' : 'text-[#c5a059]'} />
                    <div>
                      <div className="text-sm font-medium">{link.label}</div>
                      <div className="text-[11px] text-[#b8b3a5]">{link.desc}</div>
                    </div>
                  </div>
                  <span className="text-xs text-[#c5a059]">→</span>
                </Link>
              );
            })}

            <Link
              to="/admin"
              className="flex items-center justify-between p-3 rounded-xl border bg-white/5 border-white/5 text-[#f7f4ee] hover:bg-white/10"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-[#c5a059]" />
                <div>
                  <div className="text-sm font-medium">Curator Admin</div>
                  <div className="text-[11px] text-[#b8b3a5]">Manage content & moderation</div>
                </div>
              </div>
              <span className="text-xs text-[#c5a059]">→</span>
            </Link>

            <label className="mt-2 flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/5 px-3 py-3 text-sm text-[#f7f4ee]">
              <span>Soundscape volume</span>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(audioVolume * 100)}
                onChange={(event) => setAudioVolume(Number(event.target.value) / 100)}
                className="w-28 h-1 cursor-pointer accent-[#d4af37]"
                aria-label="Soundscape volume"
                aria-valuetext={`${Math.round(audioVolume * 100)} percent`}
              />
            </label>
          </nav>
        </div>
      )}
    </header>
  );
};
