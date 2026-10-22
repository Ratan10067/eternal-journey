import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FIVE_DAY_TIMELINE } from '../data/timeline';
import { VERIFIED_LOCATIONS } from '../data/locations';
import { Calendar, MapPin, ArrowRight, Quote, Sparkles } from 'lucide-react';

export const JourneyTimelinePage: React.FC = () => {
  const [filterCity, setFilterCity] = useState<'All' | 'Varanasi' | 'Ayodhya'>('All');

  const filteredChapters = FIVE_DAY_TIMELINE.filter(c => {
    if (filterCity === 'All') return true;
    return c.city === filterCity;
  });

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f7f4ee] pt-28 pb-20">
      
      {/* Header Banner */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-[#d4af37]/30 text-xs text-[#d4af37] uppercase tracking-widest mb-4">
          <Calendar size={13} />
          <span>October 16 – 20, 2026</span>
        </div>
        <h1 className="font-cinzel text-4xl sm:text-6xl font-bold tracking-tight text-[#f7f4ee]">
          THE FIVE CHAPTERS
        </h1>
        <div className="font-devanagari text-2xl text-[#c5a059] mt-2 mb-4">
          पाँच दिवसीय आध्यात्मिक यात्रा संस्मरण
        </div>
        <p className="font-serif-editorial text-lg sm:text-xl text-[#b8b3a5] max-w-2xl mx-auto italic">
          "Each dawn unveiled a new threshold of reverence. Trace the daily odyssey from the eternal steps of Kashi to the sacred birthplace in Ayodhya."
        </p>

        {/* Filter Tabs */}
        <div className="inline-flex p-1.5 rounded-full bg-[#141418] border border-white/10 mt-8">
          {(['All', 'Varanasi', 'Ayodhya'] as const).map(city => (
            <button
              key={city}
              onClick={() => setFilterCity(city)}
              className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all ${
                filterCity === city
                  ? 'bg-[#d4af37] text-[#09090b] shadow-lg'
                  : 'text-[#b8b3a5] hover:text-[#f7f4ee]'
              }`}
            >
              {city === 'All' ? 'All Five Days' : city}
            </button>
          ))}
        </div>
      </div>

      {/* Chapters Scroll Story */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {filteredChapters.map((chapter, index) => {
          const visitedLocations = VERIFIED_LOCATIONS.filter(l => chapter.locationIds.includes(l.id));

          return (
            <div
              key={chapter.day}
              className="relative bg-[#121216] border border-white/10 hover:border-[#d4af37]/40 rounded-3xl overflow-hidden transition-all duration-500 shadow-2xl"
            >
              {/* Day Header Bar */}
              <div className="p-6 sm:p-8 bg-gradient-to-r from-black/60 to-transparent border-b border-white/5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#d4af37] font-cinzel font-bold text-sm flex items-center justify-center">
                    0{chapter.day}
                  </span>
                  <div>
                    <div className="text-xs text-[#c5a059] font-medium tracking-widest uppercase">
                      {chapter.date}
                    </div>
                    <div className="text-sm font-semibold text-[#f7f4ee]">
                      {chapter.city}
                    </div>
                  </div>
                </div>

                <Link
                  to={`/journey/${chapter.day}`}
                  className="px-5 py-2 rounded-full bg-white/5 hover:bg-[#d4af37] hover:text-[#09090b] text-xs font-cinzel tracking-widest uppercase text-[#d4af37] border border-[#d4af37]/40 transition-all flex items-center gap-2"
                >
                  <span>Open Day Diary</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8">
                
                {/* Hero Photo Column */}
                <div className="lg:col-span-5 flex flex-col">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 group">
                    <img
                      src={chapter.heroPhoto}
                      alt={chapter.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 text-[11px] text-[#f7f4ee] font-medium bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                      Day {chapter.day} Featured Scene
                    </div>
                  </div>
                </div>

                {/* Narrative & Places Column */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div>
                    <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#f7f4ee]">
                      {chapter.title}
                    </h2>
                    <div className="font-devanagari text-lg text-[#c5a059] mt-1 mb-3">
                      {chapter.hindiTitle}
                    </div>

                    <p className="font-serif-editorial text-base sm:text-lg text-[#f7f4ee]/90 italic mb-4 leading-relaxed">
                      "{chapter.tagline}"
                    </p>

                    <p className="text-sm text-[#b8b3a5] leading-relaxed line-clamp-3">
                      {chapter.story}
                    </p>
                  </div>

                  {/* Confirmed Locations Visited Pills */}
                  <div className="pt-6 mt-6 border-t border-white/5">
                    <div className="text-[11px] uppercase tracking-wider text-[#c5a059] font-semibold mb-2 flex items-center gap-1.5">
                      <MapPin size={13} />
                      <span>Confirmed Locations Visited:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {visitedLocations.map(loc => (
                        <Link
                          key={loc.id}
                          to={`/places/${loc.slug}`}
                          className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-[#f7f4ee] hover:text-[#d4af37] transition-colors"
                        >
                          {loc.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
