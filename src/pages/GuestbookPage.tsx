import React, { useState } from 'react';
import { useJourney } from '../context/JourneyContext';
import { PenTool, Heart, Sparkles, Send, MessageCircle, MapPin } from 'lucide-react';

export const GuestbookPage: React.FC = () => {
  const { guestbook, addGuestbookEntry } = useJourney();

  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [message, setMessage] = useState('');
  const [favoriteMoment, setFavoriteMoment] = useState('');
  const [reaction, setReaction] = useState('🙏');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    await addGuestbookEntry(name, city, message, reaction, favoriteMoment);
    setMessage('');
    setFavoriteMoment('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f7f4ee] pt-28 pb-24">
      
      {/* Header Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-[#d4af37]/30 text-xs text-[#d4af37] uppercase tracking-widest mb-3">
          <PenTool size={13} />
          <span>Friends & Fellow Pilgrims</span>
        </div>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-black tracking-tight text-[#f7f4ee]">
          THE PILGRIM GUESTBOOK
        </h1>
        <div className="font-devanagari text-xl text-[#c5a059] mt-1 mb-4">
          यात्री संदेश पट्ट — स्मृतियों की गूँज
        </div>
        <p className="font-serif-editorial text-base sm:text-lg text-[#b8b3a5] max-w-xl mx-auto italic">
          "Leave a handwritten postcard for the journey. Share your favorite memory, a blessing, or your thoughts on Kashi and Ayodhya."
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* POSTCARD SUBMISSION FORM (Left / Top Column) */}
        <div className="lg:col-span-5">
          <div className="bg-[#141418] border border-[#d4af37]/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative sticky top-28">
            <h2 className="font-cinzel text-xl font-bold text-[#f7f4ee] mb-1">
              Send a Pilgrim Postcard
            </h2>
            <p className="text-xs text-[#b8b3a5] mb-6">
              New messages are reviewed before they appear on the collective memory wall.
            </p>

            {submitted && (
              <div className="mb-6 p-4 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37] text-xs text-[#d4af37] font-semibold animate-in fade-in">
                ✨ Thank you! Your postcard has been received for review.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#c5a059] font-semibold mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aditi & Siddharth"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-[#f7f4ee] focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#c5a059] font-semibold mb-1">
                  Your City / Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Varanasi / New Delhi / London"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-[#f7f4ee] focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#c5a059] font-semibold mb-1">
                  Pick a Reaction
                </label>
                <div className="flex justify-between bg-black/40 p-2 rounded-xl border border-white/5">
                  {['🙏', '✨', '📸', '🔥', '🪷', '🕉️'].map((emoji) => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => setReaction(emoji)}
                      className={`text-xl p-2 rounded-lg transition-transform ${
                        reaction === emoji ? 'scale-125 bg-white/10 shadow' : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#c5a059] font-semibold mb-1">
                  Favorite Moment / Scene
                </label>
                <input
                  type="text"
                  placeholder="e.g. Saryu Sunset at Ram Ki Paidi"
                  value={favoriteMoment}
                  onChange={(e) => setFavoriteMoment(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-[#f7f4ee] focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#c5a059] font-semibold mb-1">
                  Your Note or Blessing *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write a message, reflection, or note for the travelers..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-[#f7f4ee] focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full btn-shimmer-gold text-[#09090b] font-cinzel font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
              >
                <Send size={14} />
                <span>Pin Postcard to Wall</span>
              </button>
            </form>
          </div>
        </div>

        {/* POSTCARD MEMORY WALL (Right Column) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-cinzel uppercase tracking-widest text-[#d4af37] font-bold">
              Postcard Wall ({guestbook.length})
            </span>
            <span className="text-xs text-[#b8b3a5]">
              Arranged by time
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {guestbook.map((entry) => (
              <div
                key={entry.id}
                className="relative bg-[#faf7f2] text-[#292524] p-5 rounded-2xl shadow-xl border border-[#e7e2d6] hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between"
              >
                {/* Stamp Accent */}
                <div className="absolute top-3 right-3 w-10 h-10 rounded border-2 border-dashed border-[#8c5036]/50 flex items-center justify-center text-lg bg-[#f0ebd9]">
                  {entry.reaction}
                </div>

                <div>
                  <div className="text-xs font-serif-editorial text-[#8c5036] font-semibold flex items-center gap-1 mb-1">
                    <MapPin size={12} />
                    <span>{entry.city || 'Sacred Pilgrim'}</span>
                  </div>

                  <h3 className="font-serif-editorial font-bold text-base text-[#1c1917]">
                    {entry.name}
                  </h3>

                  {entry.favoriteMoment && (
                    <div className="text-[11px] text-[#78716c] font-medium bg-[#f2ede4] px-2 py-0.5 rounded-md inline-block my-2">
                      Moment: {entry.favoriteMoment}
                    </div>
                  )}

                  <p className="font-serif-editorial text-sm italic text-[#44403c] mt-2 leading-relaxed">
                    "{entry.message}"
                  </p>
                </div>

                <div className="pt-3 mt-4 border-t border-[#e7e2d6] text-[10px] text-[#a8a29e] flex justify-between">
                  <span>Varanasi × Ayodhya 2026</span>
                  <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
