import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, BookOpen, Heart, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#070708] border-t border-[#d4af37]/20 pt-16 pb-12 overflow-hidden text-[#b8b3a5]">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-[#c5a059]/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand & Manifesto */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-cinzel text-xl text-[#f7f4ee] font-bold tracking-widest">
              THE ETERNAL JOURNEY
            </h3>
            <p className="font-devanagari text-[#c5a059] text-base">
              काशी से अयोध्या — पाँच दिव्य दिवस
            </p>
            <p className="text-sm text-[#b8b3a5] max-w-md leading-relaxed">
              A deeply personal interactive travel memoir documenting a sacred journey across Varanasi and Ayodhya from October 16–20, 2026. Captured through photography, memory, and reflection.
            </p>
            <div className="pt-2 text-xs font-serif-editorial italic text-[#c5a059] text-base">
              "The journey lasted five days. The memories will last a lifetime."
            </div>
          </div>

          {/* Chapters Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#f7f4ee]">
              Five-Day Story
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/journey/1" className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5">
                  <span className="text-[#d4af37]">Day 1:</span> Arrival & Maha Aarti (Varanasi)
                </Link>
              </li>
              <li>
                <Link to="/journey/2" className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5">
                  <span className="text-[#d4af37]">Day 2:</span> Kaal Bhairav & Manikarnika
                </Link>
              </li>
              <li>
                <Link to="/journey/3" className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5">
                  <span className="text-[#d4af37]">Day 3:</span> Sarnath & Sacred Verses
                </Link>
              </li>
              <li>
                <Link to="/journey/4" className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5">
                  <span className="text-[#d4af37]">Day 4:</span> Ayodhya & Ram Janmabhoomi
                </Link>
              </li>
              <li>
                <Link to="/journey/5" className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5">
                  <span className="text-[#d4af37]">Day 5:</span> Kanak Bhawan & Saryu Sunset
                </Link>
              </li>
            </ul>
          </div>

          {/* Interactive Experiences */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-[#f7f4ee]">
              Interactive Archives
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/atlas" className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5">
                  <Compass size={13} className="text-[#c5a059]" /> Interactive Journey Map
                </Link>
              </li>
              <li>
                <Link to="/memories" className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5">
                  <Sparkles size={13} className="text-[#c5a059]" /> The Memory Machine
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5">
                  <BookOpen size={13} className="text-[#c5a059]" /> Photography Museum
                </Link>
              </li>
              <li>
                <Link to="/camera-wars" className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5">
                  <span className="text-[#c5a059]">⚔️</span> Camera Wars: S25 vs iPhone 17
                </Link>
              </li>
              <li>
                <Link to="/guestbook" className="hover:text-[#d4af37] transition-colors flex items-center gap-1.5">
                  <Heart size={13} className="text-[#c5a059]" /> Pilgrim Postcards & Guestbook
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#b8b3a5] gap-4">
          <div>
            October 16–20, 2026 • Crafted with devotion, analog nostalgia, and modern engineering.
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-[#d4af37]/40 hover:text-[#d4af37] transition-all"
            aria-label="Scroll back to top"
          >
            <span>Back to top</span>
            <ArrowUp size={13} />
          </button>
        </div>
      </div>
    </footer>
  );
};
