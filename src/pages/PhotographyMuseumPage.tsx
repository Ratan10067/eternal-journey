import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useJourney } from '../context/JourneyContext';
import { Photo } from '../types';
import { 
  Heart, 
  Maximize2, 
  Filter, 
  Calendar, 
  MapPin, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  Sparkles 
} from 'lucide-react';

export const PhotographyMuseumPage: React.FC = () => {
  const { photos, favorites, toggleFavorite, isFavorite } = useJourney();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeFilter, setActiveFilter] = useState<string>(searchParams.get('filter') || 'all');
  const [activeCity, setActiveCity] = useState<string>('all');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  // Synchronize URL query params
  useEffect(() => {
    const filterFromUrl = searchParams.get('filter');
    if (filterFromUrl) {
      setActiveFilter(filterFromUrl);
    }
  }, [searchParams]);

  // Filter photos
  const filteredPhotos = photos.filter(p => {
    if (activeFilter === 'favorites') {
      return favorites.includes(p.id);
    }
    if (activeCity !== 'all' && p.city !== activeCity) {
      return false;
    }
    return true;
  });

  const openLightbox = (index: number) => {
    setActivePhotoIndex(index);
  };

  const closeLightbox = () => {
    setActivePhotoIndex(null);
  };

  const nextPhoto = () => {
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((activePhotoIndex + 1) % filteredPhotos.length);
    }
  };

  const prevPhoto = () => {
    if (activePhotoIndex !== null) {
      setActivePhotoIndex((activePhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePhotoIndex === null) return;
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIndex, filteredPhotos.length]);

  const currentLightboxPhoto = activePhotoIndex !== null ? filteredPhotos[activePhotoIndex] : null;

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f7f4ee] pt-28 pb-24">
      
      {/* Museum Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-[#d4af37]/30 text-xs text-[#d4af37] uppercase tracking-widest mb-3">
          <Sparkles size={13} />
          <span>Curated Exhibition Archive</span>
        </div>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-black tracking-tight text-[#f7f4ee]">
          THE PHOTOGRAPHY MUSEUM
        </h1>
        <div className="font-devanagari text-xl text-[#c5a059] mt-1 mb-4">
          चित्रशाला — काशी एवं अयोध्या के दृश्य
        </div>
        <p className="font-serif-editorial text-base sm:text-lg text-[#b8b3a5] max-w-xl mx-auto italic">
          "Every photograph is a fragment of eternity frozen in silver and light. Browse the complete collection or filter by sacred city and personal favorites."
        </p>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          
          {/* Main Filter buttons */}
          <div className="inline-flex p-1 rounded-full bg-[#141418] border border-white/10">
            <button
              onClick={() => {
                setActiveFilter('all');
                setSearchParams({});
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all ${
                activeFilter === 'all'
                  ? 'bg-[#d4af37] text-[#09090b]'
                  : 'text-[#b8b3a5] hover:text-[#f7f4ee]'
              }`}
            >
              All Photographs ({photos.length})
            </button>

            <button
              onClick={() => {
                setActiveFilter('favorites');
                setSearchParams({ filter: 'favorites' });
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all flex items-center gap-1.5 ${
                activeFilter === 'favorites'
                  ? 'bg-[#c86d51] text-[#f7f4ee]'
                  : 'text-[#b8b3a5] hover:text-[#f7f4ee]'
              }`}
            >
              <Heart size={12} className={favorites.length > 0 ? 'fill-current' : ''} />
              <span>Bookmarked ({favorites.length})</span>
            </button>
          </div>

          {/* City filter */}
          {activeFilter !== 'favorites' && (
            <div className="inline-flex p-1 rounded-full bg-[#141418] border border-white/10 text-xs">
              {(['all', 'Varanasi', 'Ayodhya'] as const).map(c => (
                <button
                  key={c}
                  onClick={() => setActiveCity(c)}
                  className={`px-3 py-1 rounded-full transition-all ${
                    activeCity === c
                      ? 'bg-white/10 text-[#d4af37] font-semibold'
                      : 'text-[#b8b3a5] hover:text-[#f7f4ee]'
                  }`}
                >
                  {c === 'all' ? 'Both Cities' : c}
                </button>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* GALLERY MASONRY GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredPhotos.length === 0 ? (
          <div className="text-center py-20 bg-[#121216] border border-white/5 rounded-3xl p-10 max-w-md mx-auto">
            <Heart size={36} className="text-[#c86d51] mx-auto mb-4 opacity-50" />
            <h3 className="font-cinzel text-lg font-bold text-[#f7f4ee]">No Bookmarked Memories</h3>
            <p className="text-xs text-[#b8b3a5] mt-2 mb-6">
              You haven't bookmarked any photographs yet. Click the heart icon on any photograph to save your personal favorites.
            </p>
            <button
              onClick={() => {
                setActiveFilter('all');
                setSearchParams({});
              }}
              className="px-5 py-2 rounded-full bg-[#d4af37] text-[#09090b] text-xs font-cinzel uppercase tracking-wider font-bold"
            >
              Browse All Photographs
            </button>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {filteredPhotos.map((photo, index) => (
              <div
                key={photo.id}
                className="group relative break-inside-avoid rounded-2xl overflow-hidden bg-[#141418] border border-white/10 hover:border-[#d4af37]/40 transition-all duration-300 shadow-xl"
              >
                <img
                  src={photo.src}
                  alt={photo.caption}
                  className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-500 cursor-pointer"
                  onClick={() => openLightbox(index)}
                  loading="lazy"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between pointer-events-none">
                  <div className="flex justify-between items-center pointer-events-auto">
                    <span className="text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold bg-black/60 px-2 py-0.5 rounded-full border border-white/10">
                      {photo.city}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(photo.id);
                      }}
                      className="p-2 rounded-full bg-black/60 text-white hover:text-[#c86d51] backdrop-blur-md transition-colors"
                      title={isFavorite(photo.id) ? 'Remove bookmark' : 'Bookmark'}
                    >
                      <Heart size={15} className={isFavorite(photo.id) ? 'text-[#c86d51] fill-[#c86d51]' : ''} />
                    </button>
                  </div>

                  <div className="pointer-events-auto cursor-pointer" onClick={() => openLightbox(index)}>
                    <p className="font-serif-editorial text-sm italic text-[#f7f4ee] line-clamp-2">
                      "{photo.caption}"
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-[#b8b3a5] mt-2 pt-2 border-t border-white/10">
                      <span>October 2026</span>
                      <span className="flex items-center gap-1 text-[#d4af37]">
                        <Maximize2 size={11} /> Inspect
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FULLSCREEN LIGHTBOX WITH FILMSTRIP */}
      {currentLightboxPhoto && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <span className="font-cinzel text-sm text-[#d4af37] font-bold">
                Photo {activePhotoIndex! + 1} of {filteredPhotos.length}
              </span>
              <span className="text-xs text-[#b8b3a5]">
                • {currentLightboxPhoto.city}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleFavorite(currentLightboxPhoto.id)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title={isFavorite(currentLightboxPhoto.id) ? 'Remove bookmark' : 'Bookmark'}
              >
                <Heart size={18} className={isFavorite(currentLightboxPhoto.id) ? 'text-[#c86d51] fill-[#c86d51]' : ''} />
              </button>
              <button
                onClick={closeLightbox}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Close Lightbox (Esc)"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Central Photo View with Prev/Next buttons */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <button
              onClick={prevPhoto}
              className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-black/60 hover:bg-[#d4af37] text-white hover:text-[#09090b] transition-all"
              aria-label="Previous photo"
            >
              <ChevronLeft size={24} />
            </button>

            <img
              src={currentLightboxPhoto.src}
              alt={currentLightboxPhoto.caption}
              className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-2xl transition-all"
            />

            <button
              onClick={nextPhoto}
              className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-black/60 hover:bg-[#d4af37] text-white hover:text-[#09090b] transition-all"
              aria-label="Next photo"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Caption & Filmstrip Bottom Bar */}
          <div className="max-w-4xl mx-auto w-full text-center">
            <p className="font-serif-editorial text-lg sm:text-xl italic text-[#f7f4ee] max-w-2xl mx-auto">
              "{currentLightboxPhoto.caption}"
            </p>

            {/* Filmstrip thumbnails */}
            <div className="flex justify-center gap-2 mt-4 overflow-x-auto py-2 scrollbar-none">
              {filteredPhotos.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === activePhotoIndex
                      ? 'border-[#d4af37] scale-110 shadow-[0_0_10px_rgba(212,175,55,0.5)]'
                      : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={p.thumbnail || p.src} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
