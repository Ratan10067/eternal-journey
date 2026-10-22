import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getDiaryByDay, JOURNEY_DIARIES } from '../data/diaries';
import { VERIFIED_LOCATIONS } from '../data/locations';
import { useJourney } from '../context/JourneyContext';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Quote, 
  Smile, 
  MessageSquare, 
  ChevronLeft, 
  ChevronRight, 
  Compass, 
  Heart,
  ArrowLeft
} from 'lucide-react';

export const JourneyDayPage: React.FC = () => {
  const { day } = useParams<{ day: string }>();
  const navigate = useNavigate();
  const dayNumber = parseInt(day || '1', 10);
  const diary = getDiaryByDay(dayNumber);
  const { photos, isFavorite, toggleFavorite } = useJourney();

  if (!diary) {
    return (
      <div className="min-h-screen bg-[#09090b] text-[#f7f4ee] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-cinzel text-3xl mb-4">Chapter Not Found</h2>
        <p className="text-[#b8b3a5] mb-6">The requested journey chapter does not exist.</p>
        <Link
          to="/journey"
          className="px-6 py-2.5 rounded-full bg-[#d4af37] text-[#09090b] font-cinzel text-xs uppercase tracking-widest font-bold"
        >
          Return to All Chapters
        </Link>
      </div>
    );
  }

  const prevDay = dayNumber > 1 ? dayNumber - 1 : null;
  const nextDay = dayNumber < 5 ? dayNumber + 1 : null;
  const visitedPlaces = VERIFIED_LOCATIONS.filter(l => diary.locationsVisited.includes(l.id));
  const chapterPhotos = photos.filter(p => diary.photoIds.includes(p.id));

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f7f4ee] pb-24">
      
      {/* 1. CINEMATIC CHAPTER HERO */}
      <div className="relative h-[75vh] min-h-[550px] w-full flex items-end overflow-hidden">
        <img
          src={diary.coverPhoto}
          alt={diary.title}
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/50 to-black/60" />

        {/* Back Link */}
        <div className="absolute top-24 left-6 z-20">
          <Link
            to="/journey"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 border border-white/10 hover:border-[#d4af37]/40 text-xs text-[#f7f4ee] backdrop-blur-md transition-all"
          >
            <ArrowLeft size={14} />
            <span>All Chapters</span>
          </Link>
        </div>

        {/* Hero Title Container */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 pb-16 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-xs text-[#d4af37] font-cinzel font-bold tracking-widest uppercase mb-4 backdrop-blur-md">
            <span>Chapter 0{diary.day}</span>
            <span>•</span>
            <span>{diary.date}</span>
            <span>•</span>
            <span>{diary.city}</span>
          </div>

          <h1 className="font-cinzel text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#f7f4ee] drop-shadow-lg">
            {diary.title}
          </h1>

          <div className="font-devanagari text-2xl sm:text-3xl text-[#c5a059] mt-2 mb-4 font-semibold">
            {diary.hindiTitle}
          </div>

          <p className="font-serif-editorial text-lg sm:text-2xl italic text-[#f7f4ee]/90 max-w-3xl leading-relaxed">
            "{diary.subtitle}"
          </p>
        </div>
      </div>

      {/* 2. BODY CONTAINER */}
      <div className="max-w-4xl mx-auto px-6 pt-12 space-y-16">
        
        {/* Personal Narrative */}
        <section className="bg-[#121216] border border-white/10 rounded-3xl p-8 sm:p-12 relative shadow-2xl">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
            <span className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
              Personal Diary & Memoir
            </span>
            <span className="text-xs text-[#b8b3a5]">
              Varanasi × Ayodhya 2026
            </span>
          </div>

          <div className="prose prose-invert max-w-none">
            {diary.personalNarrative.split('\n\n').map((para, i) => (
              <p key={i} className="text-base sm:text-lg text-[#b8b3a5] leading-relaxed font-light mb-6">
                {para}
              </p>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-xs text-[#c5a059] italic">
            <span>Author's Travel Memoir Note</span>
            <span className="text-[11px] text-[#b8b3a5] not-italic">October {diary.day + 15}, 2026</span>
          </div>
        </section>

        {/* Timeline of the Day */}
        <section>
          <div className="flex items-center gap-2 mb-8">
            <Clock size={18} className="text-[#d4af37]" />
            <h2 className="font-cinzel text-2xl font-bold text-[#f7f4ee]">
              Chronology of Events
            </h2>
          </div>

          <div className="relative border-l border-[#d4af37]/30 pl-6 sm:pl-8 ml-3 space-y-10">
            {diary.timeline.map((event, idx) => (
              <div key={idx} className="relative group">
                {/* Marker point */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#09090b] border-2 border-[#d4af37] group-hover:scale-125 transition-transform" />

                <div className="bg-[#141418] border border-white/10 rounded-2xl p-5 hover:border-[#d4af37]/40 transition-colors">
                  <div className="text-xs font-semibold text-[#c5a059] tracking-wider uppercase mb-1">
                    {event.time}
                  </div>
                  <h3 className="font-cinzel text-lg text-[#f7f4ee] font-semibold">
                    {event.title}
                  </h3>
                  <p className="text-sm text-[#b8b3a5] mt-1">
                    {event.note}
                  </p>

                  {event.locationId && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <Link
                        to={`/places/${event.locationId}`}
                        className="inline-flex items-center gap-1.5 text-xs text-[#d4af37] hover:underline"
                      >
                        <Compass size={12} />
                        <span>View sacred site details</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Embedded Photographs */}
        {chapterPhotos.length > 0 && (
          <section>
            <h2 className="font-cinzel text-2xl font-bold text-[#f7f4ee] mb-6">
              Photographs From This Day
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {chapterPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative rounded-2xl overflow-hidden bg-[#141418] border border-white/10 hover:border-[#d4af37]/40 transition-all"
                >
                  <img
                    src={photo.src}
                    alt={photo.caption}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="p-4 bg-[#141418]">
                    <div className="flex items-center justify-between text-[11px] text-[#c5a059] mb-1">
                      <span>{photo.city}</span>
                      <button
                        onClick={() => toggleFavorite(photo.id)}
                        className="text-[#b8b3a5] hover:text-[#c86d51]"
                      >
                        <Heart size={14} className={isFavorite(photo.id) ? 'text-[#c86d51] fill-[#c86d51]' : ''} />
                      </button>
                    </div>
                    <p className="text-xs text-[#f7f4ee] line-clamp-2 leading-relaxed">
                      {photo.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Funny Incidents & Memorable Conversations */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Funny Moments */}
          <div className="bg-[#121216] border border-white/10 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-2 text-[#c5a059] mb-4">
              <Smile size={18} />
              <h3 className="font-cinzel text-lg font-bold text-[#f7f4ee]">
                Funny Incidents
              </h3>
            </div>
            <ul className="space-y-4 text-sm text-[#b8b3a5] leading-relaxed">
              {diary.funnyIncidents.map((incident, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="text-[#d4af37] font-bold">•</span>
                  <span>{incident}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Conversations */}
          <div className="bg-[#121216] border border-white/10 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-2 text-[#c5a059] mb-4">
              <MessageSquare size={18} />
              <h3 className="font-cinzel text-lg font-bold text-[#f7f4ee]">
                Conversations Overheard
              </h3>
            </div>
            <div className="space-y-4">
              {diary.memorableConversations.map((conv, i) => (
                <div key={i} className="bg-black/30 p-4 rounded-xl border border-white/5">
                  <div className="text-xs font-semibold text-[#d4af37]">
                    {conv.speaker} {conv.context && <span className="text-[#b8b3a5] font-normal">({conv.context})</span>}
                  </div>
                  <p className="text-sm italic text-[#f7f4ee] mt-1.5 font-serif-editorial">
                    "{conv.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* Highlight Quotes */}
        <section className="bg-gradient-to-r from-[#18181f] via-[#14141a] to-[#18181f] border border-[#d4af37]/30 rounded-3xl p-8 text-center relative overflow-hidden">
          <Quote size={40} className="text-[#d4af37]/20 mx-auto mb-4" />
          <div className="space-y-4">
            {diary.highlightQuotes.map((q, i) => (
              <p key={i} className="font-serif-editorial text-xl sm:text-2xl italic text-[#f7f4ee]">
                {q}
              </p>
            ))}
          </div>
        </section>

        {/* Confirmed Locations in this Chapter */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <MapPin size={18} className="text-[#d4af37]" />
            <h2 className="font-cinzel text-2xl font-bold text-[#f7f4ee]">
              Confirmed Sites Explored
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {visitedPlaces.map((place) => (
              <Link
                key={place.id}
                to={`/places/${place.slug}`}
                className="group flex gap-4 p-4 rounded-2xl bg-[#141418] border border-white/10 hover:border-[#d4af37]/40 transition-colors"
              >
                <img
                  src={place.coverImage}
                  alt={place.name}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-cinzel text-sm font-bold text-[#f7f4ee] group-hover:text-[#d4af37] transition-colors">
                    {place.name}
                  </h4>
                  <div className="font-devanagari text-xs text-[#c5a059] mt-0.5">
                    {place.hindiName}
                  </div>
                  <p className="text-xs text-[#b8b3a5] line-clamp-2 mt-1">
                    {place.summary}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Chapter Navigation Controls */}
        <div className="pt-10 border-t border-white/10 flex items-center justify-between">
          {prevDay ? (
            <Link
              to={`/journey/${prevDay}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-cinzel uppercase tracking-wider text-[#f7f4ee] hover:text-[#d4af37] transition-all"
            >
              <ChevronLeft size={16} />
              <span>Day 0{prevDay}</span>
            </Link>
          ) : (
            <div />
          )}

          <Link
            to="/journey"
            className="text-xs uppercase tracking-widest text-[#d4af37] hover:underline"
          >
            All 5 Days
          </Link>

          {nextDay ? (
            <Link
              to={`/journey/${nextDay}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-cinzel uppercase tracking-wider text-[#f7f4ee] hover:text-[#d4af37] transition-all"
            >
              <span>Day 0{nextDay}</span>
              <ChevronRight size={16} />
            </Link>
          ) : (
            <div />
          )}
        </div>

      </div>

    </div>
  );
};
