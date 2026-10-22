import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useJourney } from '../context/JourneyContext';
import { 
  Swords, 
  ArrowLeft, 
  Share2, 
  CheckCircle2, 
  MessageSquare, 
  Send, 
  Sparkles, 
  Sliders 
} from 'lucide-react';

export const CameraBattleDetailPage: React.FC = () => {
  const { battleId } = useParams<{ battleId: string }>();
  const { battles, userVotes, castVote, comments, addComment } = useJourney();

  const battle = battles.find(b => b.id === battleId);
  const battleComments = comments[battleId || ''] || [];

  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Comment form state
  const [authorName, setAuthorName] = useState<string>('');
  const [commentText, setCommentText] = useState<string>('');
  const [selectedEmoji, setSelectedEmoji] = useState<string>('🔥');
  const [copied, setCopied] = useState<boolean>(false);

  if (!battle) {
    return (
      <div className="min-h-screen bg-[#09090b] text-[#f7f4ee] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="font-cinzel text-3xl mb-4">Battle Round Not Found</h2>
        <Link
          to="/camera-wars"
          className="px-6 py-2.5 rounded-full bg-[#d4af37] text-[#09090b] font-cinzel text-xs uppercase tracking-widest font-bold"
        >
          Return to Camera Wars
        </Link>
      </div>
    );
  }

  const userVote = userVotes[battle.id];
  const battleTotal = battle.votesS25 + battle.votesIPhone || 1;
  const s25Pct = Math.round((battle.votesS25 / battleTotal) * 100);
  const iPhonePct = 100 - s25Pct;

  // Slider drag handling
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  const handlePointerDown = () => setIsDragging(true);
  const handlePointerUp = () => setIsDragging(false);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(battle.id, authorName, commentText, selectedEmoji);
    setCommentText('');
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f7f4ee] pt-28 pb-24">
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/camera-wars"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs text-[#b8b3a5] hover:text-[#f7f4ee] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>All Battles</span>
          </Link>

          <button
            onClick={copyShareLink}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-[#d4af37] transition-colors"
          >
            <Share2 size={14} />
            <span>{copied ? 'Link Copied!' : 'Share Round'}</span>
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-[#c5a059] font-semibold">
            {battle.locationName} • {battle.date}
          </span>
          <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-[#f7f4ee] mt-1 mb-3">
            {battle.title}
          </h1>
          <p className="font-serif-editorial text-base sm:text-lg text-[#b8b3a5] max-w-2xl mx-auto italic">
            "{battle.description}"
          </p>
        </div>

        {/* 1. INTERACTIVE BEFORE / AFTER SLIDER */}
        <div className="bg-[#121216] border border-white/10 rounded-3xl p-4 sm:p-6 shadow-2xl mb-12">
          
          <div className="flex items-center justify-between mb-4 px-2">
            <span className="text-xs font-cinzel text-[#60a5fa] font-bold">
              ← Samsung Galaxy S25
            </span>
            <span className="text-xs text-[#b8b3a5] flex items-center gap-1">
              <Sliders size={13} className="text-[#d4af37]" />
              <span>Drag slider to compare</span>
            </span>
            <span className="text-xs font-cinzel text-[#f472b6] font-bold">
              Apple iPhone 17 →
            </span>
          </div>

          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden cursor-ew-resize select-none bg-black"
          >
            {/* Background image: iPhone 17 */}
            <img
              src={battle.photoIPhone.src}
              alt="iPhone 17"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />

            {/* Foreground image (clipped by slider): Galaxy S25 */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src={battle.photoS25.src}
                alt="Galaxy S25"
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{ width: containerRef.current?.clientWidth || '100%' }}
              />
            </div>

            {/* Divider line & handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.8)] pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#09090b] border-2 border-[#d4af37] flex items-center justify-center text-[#d4af37] text-[10px] shadow-xl">
                ⇄
              </div>
            </div>
          </div>

          {/* Device settings captions */}
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/5 text-xs text-[#b8b3a5]">
            <div>
              <div className="font-semibold text-[#60a5fa]">Galaxy S25 Settings:</div>
              <div className="font-mono text-[11px] text-[#f7f4ee]">{battle.photoS25.settings}</div>
              <p className="mt-1 italic">{battle.photoS25.caption}</p>
            </div>
            <div>
              <div className="font-semibold text-[#f472b6]">iPhone 17 Settings:</div>
              <div className="font-mono text-[11px] text-[#f7f4ee]">{battle.photoIPhone.settings}</div>
              <p className="mt-1 italic">{battle.photoIPhone.caption}</p>
            </div>
          </div>

        </div>

        {/* 2. VOTING & LIVE STATS CARD */}
        <div className="bg-[#141418] border border-white/10 rounded-3xl p-6 sm:p-8 mb-16 text-center">
          <h2 className="font-cinzel text-xl font-bold text-[#f7f4ee] mb-2">
            Cast Your Verified Vote
          </h2>
          <p className="text-xs text-[#b8b3a5] mb-6">
            Which phone rendered the colors, light, and sacred mood best?
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto mb-8">
            <button
              onClick={() => castVote(battle.id, 'Galaxy S25')}
              className={`flex-1 py-3 px-6 rounded-xl font-cinzel text-xs uppercase tracking-wider font-bold transition-all ${
                userVote === 'Galaxy S25'
                  ? 'bg-[#2563eb] text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                  : 'bg-white/5 hover:bg-[#2563eb]/20 border border-white/10 text-[#f7f4ee]'
              }`}
            >
              {userVote === 'Galaxy S25' ? '✓ Voted Galaxy S25' : 'Vote Galaxy S25'}
            </button>

            <button
              onClick={() => castVote(battle.id, 'iPhone 17')}
              className={`flex-1 py-3 px-6 rounded-xl font-cinzel text-xs uppercase tracking-wider font-bold transition-all ${
                userVote === 'iPhone 17'
                  ? 'bg-[#db2777] text-white shadow-[0_0_20px_rgba(219,39,119,0.4)]'
                  : 'bg-white/5 hover:bg-[#db2777]/20 border border-white/10 text-[#f7f4ee]'
              }`}
            >
              {userVote === 'iPhone 17' ? '✓ Voted iPhone 17' : 'Vote iPhone 17'}
            </button>
          </div>

          {/* Results bar */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-xs font-mono text-[#b8b3a5] mb-2">
              <span className="text-[#60a5fa] font-bold">Galaxy S25: {battle.votesS25} ({s25Pct}%)</span>
              <span className="text-[#f472b6] font-bold">iPhone 17: {battle.votesIPhone} ({iPhonePct}%)</span>
            </div>
            <div className="w-full h-3 rounded-full bg-black/60 overflow-hidden flex border border-white/10">
              <div className="h-full bg-[#2563eb] transition-all duration-700" style={{ width: `${s25Pct}%` }} />
              <div className="h-full bg-[#db2777] transition-all duration-700" style={{ width: `${iPhonePct}%` }} />
            </div>
          </div>
        </div>

        {/* 3. DISCUSSION & COMMENTS */}
        <div className="bg-[#121216] border border-white/10 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare size={18} className="text-[#d4af37]" />
            <h2 className="font-cinzel text-xl font-bold text-[#f7f4ee]">
              Pilgrim Discussions & Opinions ({battleComments.length})
            </h2>
          </div>

          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="mb-10 p-5 rounded-2xl bg-black/40 border border-white/5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                placeholder="Your Name / Handle"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="col-span-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-[#f7f4ee] focus:border-[#d4af37] focus:outline-none"
              />

              {/* Reaction selector */}
              <div className="flex items-center justify-around bg-white/5 border border-white/10 rounded-xl px-2">
                {['🔥', '✨', '📸', '🙏', '⚡'].map((emoji) => (
                  <button
                    type="button"
                    key={emoji}
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`text-base p-1 rounded transition-transform ${selectedEmoji === emoji ? 'scale-125 bg-white/10' : 'opacity-60'}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              placeholder="What do you think about the dynamic range, colors, and textures in this round?"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-[#f7f4ee] focus:border-[#d4af37] focus:outline-none mb-4"
              required
            />

            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-[#d4af37] hover:bg-[#e5c378] text-[#09090b] font-cinzel text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all"
            >
              <Send size={13} />
              <span>Post Opinion</span>
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {battleComments.map((comm) => (
              <div key={comm.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-3">
                <span className="text-xl">{comm.reaction}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-[#d4af37]">{comm.author}</span>
                    <span className="text-[#b8b3a5] text-[10px]">
                      {new Date(comm.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#b8b3a5] leading-relaxed">
                    {comm.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
