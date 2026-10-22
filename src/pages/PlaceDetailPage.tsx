import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLocationById } from '../data/locations';
import { useJourney } from '../context/JourneyContext';
import { 
  Compass, 
  Calendar, 
  MapPin, 
  BookOpen, 
  Heart, 
  ArrowLeft, 
  Clock, 
  Sparkles 
} from 'lucide-react';

export const PlaceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = getLocationById(slug || '');
  const { photos, isFavorite, toggleFavorite } = useJourney();

  if (!location) {
    return (
      <div className="min-h-screen bg-[#09090b] text-[#f7f4ee] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-cinzel text-3xl mb-4">Location Not Found</h2>
        <p className="text-[#b8b3a5] mb-6">The requested sacred location could not be located in our verified directory.</p>
        <Link
          to="/atlas"
          className="px-6 py-2.5 rounded-full bg-[#d4af37] text-[#09090b] font-cinzel text-xs uppercase tracking-widest font-bold"
        >
          Return to Atlas Map
        </Link>
      </div>
    );
  }

  const relatedPhotos = photos.filter(p => location.photoIds.includes(p.id) || p.locationId === location.id);

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f7f4ee] pb-24">
      
      {/* 1. CINEMATIC HERO */}
      <div className="relative h-[65vh] min-h-[480px] w-full flex items-end overflow-hidden">
        <img
          src={location.coverImage}
          alt={location.name}
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/50 to-black/60" />

        {/* Back Link */}
        <div className="absolute top-24 left-6 z-20">
          <Link
            to="/atlas"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 border border-white/10 hover:border-[#d4af37]/40 text-xs text-[#f7f4ee] backdrop-blur-md transition-all"
          >
            <ArrowLeft size={14} />
            <span>Atlas Map</span>
          </Link>
        </div>

        {/* Hero Title */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 pb-12 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 text-xs text-[#d4af37] font-cinzel font-bold tracking-widest uppercase mb-3 backdrop-blur-md">
            <span>{location.city}</span>
            <span>•</span>
            <span>Day 0{location.dayNumber}</span>
            {location.timeOfDay && (
              <>
                <span>•</span>
                <span>{location.timeOfDay}</span>
              </>
            )}
          </div>

          <h1 className="font-cinzel text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#f7f4ee]">
            {location.name}
          </h1>

          <div className="font-devanagari text-2xl sm:text-3xl text-[#c5a059] mt-2 mb-4 font-semibold">
            {location.hindiName}
          </div>

          {/* Coordinates */}
          <div className="flex items-center gap-4 text-xs text-[#b8b3a5] font-mono">
            <span className="flex items-center gap-1.5 text-[#c5a059]">
              <MapPin size={14} />
              <span>{location.coordinates[1].toFixed(5)}° N, {location.coordinates[0].toFixed(5)}° E</span>
            </span>
            <span>•</span>
            <span>{location.date}</span>
          </div>
        </div>
      </div>

      {/* 2. BODY CONTENT */}
      <div className="max-w-4xl mx-auto px-6 pt-12 space-y-12">
        
        {/* Summary Card */}
        <section className="bg-[#121216] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">
          <h2 className="text-xs uppercase tracking-[0.25em] text-[#d4af37] font-semibold mb-4">
            Pilgrim Memoir Note
          </h2>
          <p className="font-serif-editorial text-xl sm:text-2xl text-[#f7f4ee] leading-relaxed italic mb-6">
            "{location.summary}"
          </p>

          {location.culturalNote && (
            <div className="pt-6 border-t border-white/5">
              <h3 className="text-xs uppercase tracking-wider text-[#c5a059] font-bold mb-2">
                Spiritual & Historical Context
              </h3>
              <p className="text-sm text-[#b8b3a5] leading-relaxed">
                {location.culturalNote}
              </p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap gap-4">
            <Link
              to={`/journey/${location.dayNumber}`}
              className="px-5 py-2.5 rounded-full bg-[#d4af37] text-[#09090b] font-cinzel text-xs uppercase tracking-wider font-bold hover:bg-[#e5c378] transition-all flex items-center gap-2"
            >
              <BookOpen size={14} />
              <span>Read Day 0{location.dayNumber} Story</span>
            </Link>

            <Link
              to="/atlas"
              className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-cinzel uppercase tracking-wider text-[#f7f4ee] hover:border-[#d4af37]/40 transition-all flex items-center gap-2"
            >
              <Compass size={14} className="text-[#d4af37]" />
              <span>Locate on Map</span>
            </Link>
          </div>
        </section>

        {/* Gallery for this location */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#c5a059] font-semibold">
                Visual Archive
              </span>
              <h2 className="font-cinzel text-2xl font-bold text-[#f7f4ee]">
                Photographs of {location.name}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedPhotos.map((photo) => (
              <div
                key={photo.id}
                className="group relative rounded-2xl overflow-hidden bg-[#141418] border border-white/10 hover:border-[#d4af37]/40 transition-all shadow-xl"
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

      </div>

    </div>
  );
};
