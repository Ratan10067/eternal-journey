import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, Swords, BookOpen, ChevronDown, MapPin, Heart, ArrowRight } from 'lucide-react';
import { useJourney } from '../context/JourneyContext';
import { FIVE_DAY_TIMELINE } from '../data/timeline';
import { VERIFIED_LOCATIONS } from '../data/locations';
import { INITIAL_BATTLES } from '../data/camera-wars';

export const HomePage: React.FC = () => {
  const { photos, isFavorite, toggleFavorite } = useJourney();

  return (
    <div className="relative min-h-screen bg-[#09090b] text-[#f7f4ee]">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative h-screen min-h-[700px] w-full flex items-center justify-center overflow-hidden">
        {/* Background Hero Image with Slow Ken Burns */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/optimized/kashi-dawn-ghat-a0629a05.webp"
            alt="Varanasi Kashi Ghats at Dawn"
            className="w-full h-full object-cover object-center animate-ken-burns scale-105"
          />
          {/* Multi-layered cinematic vignette & gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-black/60" />
          <div className="absolute inset-0 radial-vignette opacity-80" />
          <div className="absolute inset-0 bg-[#09090b]/25 backdrop-grayscale-[15%]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
          
          {/* Date Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 border border-[#d4af37]/30 backdrop-blur-md mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-ping" />
            <span className="text-[11px] sm:text-xs tracking-[0.25em] uppercase text-[#d4af37] font-medium">
              October 16 – 20, 2026 • Uttar Pradesh, India
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-cinzel text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[0.12em] text-[#f7f4ee] uppercase drop-shadow-2xl">
            THE ETERNAL <br className="hidden sm:inline" />
            <span className="text-gold-gradient">JOURNEY</span>
          </h1>

          {/* Hindi Subtitle */}
          <div className="font-devanagari text-2xl sm:text-3xl md:text-4xl text-[#c5a059] tracking-widest mt-2 mb-6 font-semibold drop-shadow-lg">
            काशी से अयोध्या
          </div>

          {/* Tagline */}
          <p className="font-serif-editorial text-lg sm:text-2xl md:text-3xl italic text-[#f7f4ee]/90 max-w-2xl mx-auto leading-relaxed font-light mb-10">
            "Five Days. Two Sacred Cities. A Thousand Memories."
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              to="/journey"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full btn-shimmer-gold text-[#09090b] font-cinzel font-bold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 shadow-[0_0_30px_rgba(212,175,55,0.35)] hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Enter the Journey</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/atlas"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-black/50 hover:bg-white/10 border border-[#d4af37]/40 text-[#f7f4ee] font-cinzel font-semibold text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 backdrop-blur-md flex items-center justify-center gap-2"
            >
              <Compass size={16} className="text-[#d4af37]" />
              <span>Explore Atlas Map</span>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-[#b8b3a5] opacity-75 hover:opacity-100 transition-opacity">
          <span className="text-[10px] uppercase tracking-[0.2em]">Scroll to Discover</span>
          <ChevronDown size={18} className="animate-bounce text-[#d4af37]" />
        </div>
      </section>

      {/* 2. PROLOGUE / MANIFESTO */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center relative">
        <div className="w-12 h-[1px] bg-[#d4af37]/50 mx-auto mb-8" />
        <span className="text-xs uppercase tracking-[0.3em] text-[#d4af37] font-semibold">
          The Memoir
        </span>
        <h2 className="font-cinzel text-2xl sm:text-4xl text-[#f7f4ee] font-normal tracking-wide mt-3 mb-6">
          A Pilgrimage Between Eternity and Light
        </h2>
        <p className="font-serif-editorial text-lg sm:text-2xl text-[#b8b3a5] leading-relaxed italic">
          "From the immortal cremation pyres and evening aarti of Varanasi to the pink sandstone towers of Shri Ram Janmabhoomi in Ayodhya, this archive documents an extraordinary personal expedition of five days that transformed how we look through the camera lens and into our own hearts."
        </p>
        <div className="w-12 h-[1px] bg-[#d4af37]/50 mx-auto mt-8" />
      </section>

      {/* 3. FIVE-DAY TIMELINE TEASER */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
              The Chronicle
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl text-[#f7f4ee] mt-1">
              Five Chapters of Sacred Memory
            </h2>
          </div>
          <Link
            to="/journey"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#d4af37] hover:text-[#f7f4ee] transition-colors"
          >
            <span>Read Complete Diaries</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {FIVE_DAY_TIMELINE.map((chapter) => (
            <Link
              key={chapter.day}
              to={`/journey/${chapter.day}`}
              className="group relative rounded-2xl overflow-hidden bg-[#141418] border border-white/10 hover:border-[#d4af37]/50 transition-all duration-500 hover:-translate-y-1.5 flex flex-col shadow-xl"
            >
              {/* Photo */}
              <div className="aspect-[4/3] w-full overflow-hidden relative">
                <img
                  src={chapter.heroPhoto}
                  alt={chapter.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141418] via-transparent to-black/30" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-[#d4af37]/30 text-[10px] font-bold text-[#d4af37] uppercase tracking-wider">
                  Day 0{chapter.day}
                </div>
              </div>

              {/* Text */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] text-[#c5a059] uppercase tracking-wider font-semibold">
                    {chapter.date} • {chapter.city}
                  </div>
                  <h3 className="font-cinzel text-base text-[#f7f4ee] mt-1 group-hover:text-[#d4af37] transition-colors line-clamp-1">
                    {chapter.title}
                  </h3>
                  <div className="font-devanagari text-xs text-[#b8b3a5] mt-0.5 line-clamp-1">
                    {chapter.hindiTitle}
                  </div>
                  <p className="text-xs text-[#b8b3a5] mt-2 line-clamp-2 leading-relaxed">
                    {chapter.tagline}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-[#d4af37]">
                  <span>Explore chapter</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. DUAL PILLARS: INTERACTIVE MAP & MEMORY MACHINE */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Pillar 1: The Interactive Journey Map */}
          <div className="relative rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-[#18181f] to-[#0f0f13] border border-[#d4af37]/30 overflow-hidden flex flex-col justify-between group">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#d4af37]/10 blur-[80px] pointer-events-none" />
            
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center mb-6 text-[#d4af37]">
                <Compass size={24} />
              </div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
                Core Feature 01
              </span>
              <h3 className="font-cinzel text-2xl sm:text-3xl text-[#f7f4ee] font-bold mt-2 mb-3">
                The Interactive Journey Map
              </h3>
              <p className="text-sm text-[#b8b3a5] leading-relaxed max-w-md">
                Trace the pilgrimage route between Varanasi and Ayodhya using custom dark-cinematic MapLibre GL. Replay our journey chronologically, inspect verified coordinates, and unveil photos from Kaal Bhairav, Manikarnika, Sarnath, and Ram Janmabhoomi.
              </p>
            </div>

            <div className="relative z-10 pt-8 mt-6 border-t border-white/10 flex items-center justify-between">
              <div className="text-xs text-[#b8b3a5]">
                {VERIFIED_LOCATIONS.length} Confirmed Sacred Sites
              </div>
              <Link
                to="/atlas"
                className="px-6 py-2.5 rounded-full bg-[#d4af37] hover:bg-[#e5c378] text-[#09090b] font-cinzel font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <span>Launch Atlas</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Pillar 2: The Memory Machine */}
          <div className="relative rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-[#18181f] to-[#0f0f13] border border-[#c86d51]/40 overflow-hidden flex flex-col justify-between group">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#c86d51]/15 blur-[80px] pointer-events-none" />
            
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-[#c86d51]/20 border border-[#c86d51]/50 flex items-center justify-center mb-6 text-[#c86d51]">
                <Sparkles size={24} />
              </div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#c86d51] font-semibold">
                Core Feature 02
              </span>
              <h3 className="font-cinzel text-2xl sm:text-3xl text-[#f7f4ee] font-bold mt-2 mb-3">
                The Memory Machine
              </h3>
              <p className="text-sm text-[#b8b3a5] leading-relaxed max-w-md">
                An analog photography discovery simulator. Press "Take Me Back" to trigger authentic mechanical camera shutter clicks, watch vintage Polaroids develop before your eyes, and explore the interactive 3D Memory Constellation.
              </p>
            </div>

            <div className="relative z-10 pt-8 mt-6 border-t border-white/10 flex items-center justify-between">
              <div className="text-xs text-[#b8b3a5]">
                Randomized Instant Recall
              </div>
              <Link
                to="/memories"
                className="px-6 py-2.5 rounded-full bg-[#c86d51] hover:bg-[#e07f62] text-[#f7f4ee] font-cinzel font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <span>Discover Memory</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 5. CAMERA WARS SPOTLIGHT BANNER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-[#181216] via-[#15151c] to-[#0e171b] border border-white/10 overflow-hidden shadow-2xl">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#c5a059] mb-4">
              <Swords size={14} className="text-[#d4af37]" />
              <span>Friendly Photography Rivalry</span>
            </div>
            <h2 className="font-cinzel text-3xl sm:text-5xl font-black text-[#f7f4ee] tracking-tight">
              THE CAMERA WARS
            </h2>
            <div className="text-lg sm:text-xl text-[#c5a059] font-medium mt-1 mb-4">
              Samsung Galaxy S25 <span className="text-[#b8b3a5] font-light">vs</span> Apple iPhone 17
            </div>
            <p className="text-sm text-[#b8b3a5] leading-relaxed mb-8">
              Throughout our journey from the foggy ghats of Kashi to the glowing sandstone of Ayodhya, my friend and I battled over who took the superior shot. Cast blind votes, drag our before/after comparison slider, and see who won each round.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/camera-wars"
                className="px-6 py-3 rounded-full bg-[#d4af37] hover:bg-[#e5c378] text-[#09090b] font-cinzel font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center gap-2"
              >
                <span>Enter Battle Arena</span>
                <ArrowRight size={14} />
              </Link>
              <div className="text-xs text-[#b8b3a5]">
                {INITIAL_BATTLES.length} Active Rounds • Blind Voting Enabled
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CURATED EDITORIAL PHOTOGRAPHY PREVIEW */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
              The Exhibition
            </span>
            <h2 className="font-cinzel text-3xl text-[#f7f4ee] mt-1">
              Photographic Artifacts
            </h2>
          </div>
          <Link
            to="/gallery"
            className="text-xs uppercase tracking-widest text-[#d4af37] hover:text-[#f7f4ee] flex items-center gap-1.5 transition-colors"
          >
            <span>Visit Full Museum</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.slice(0, 6).map((photo) => (
            <div
              key={photo.id}
              className="group relative rounded-2xl overflow-hidden bg-[#141418] border border-white/10 hover:border-[#d4af37]/40 transition-all duration-300"
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                <img
                  src={photo.src}
                  alt={photo.caption}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                  <div className="flex justify-end">
                    <button
                      onClick={() => toggleFavorite(photo.id)}
                      className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:text-[#c86d51] transition-colors"
                      title={isFavorite(photo.id) ? 'Remove from favorites' : 'Save to favorites'}
                    >
                      <Heart size={16} className={isFavorite(photo.id) ? 'text-[#c86d51] fill-[#c86d51]' : ''} />
                    </button>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold">
                      {photo.city}
                    </span>
                    <p className="text-xs text-[#f7f4ee] line-clamp-2 mt-1">
                      {photo.caption}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CLOSING REFLECTION */}
      <section className="py-24 px-6 text-center bg-gradient-to-t from-[#070708] to-transparent">
        <div className="max-w-2xl mx-auto">
          <p className="font-serif-editorial text-2xl sm:text-3xl italic text-[#f7f4ee] mb-6">
            "The journey lasted five days. The memories will last a lifetime."
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/guestbook"
              className="px-6 py-2.5 rounded-full bg-white/5 border border-[#d4af37]/40 hover:border-[#d4af37] text-xs font-cinzel uppercase tracking-widest text-[#d4af37] hover:text-[#f7f4ee] transition-all"
            >
              Sign Pilgrim Postcard
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
