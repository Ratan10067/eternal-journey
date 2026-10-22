import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useJourney } from '../context/JourneyContext';
import { 
  Swords, 
  Trophy, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  MessageSquare, 
  Share2, 
  Sparkles, 
  ArrowRight,
  Flame
} from 'lucide-react';

export const CameraWarsPage: React.FC = () => {
  const { battles, userVotes, castVote, comments } = useJourney();
  const [blindMode, setBlindMode] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Compute live scoreboard statistics
  let totalVotesS25 = 0;
  let totalVotesIPhone = 0;
  let battlesWonS25 = 0;
  let battlesWonIPhone = 0;

  battles.forEach(battle => {
    totalVotesS25 += battle.votesS25;
    totalVotesIPhone += battle.votesIPhone;

    if (battle.votesS25 > battle.votesIPhone) battlesWonS25 += 1;
    else if (battle.votesIPhone > battle.votesS25) battlesWonIPhone += 1;
  });

  const grandTotal = totalVotesS25 + totalVotesIPhone || 1;
  const pctS25 = Math.round((totalVotesS25 / grandTotal) * 100);
  const pctIPhone = 100 - pctS25;

  const copyShareLink = (battleId: string) => {
    const url = `${window.location.origin}/camera-wars/${battleId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(battleId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f7f4ee] pt-28 pb-24">
      
      {/* 1. ARENA HEADER */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#c5a059] uppercase tracking-widest mb-3">
          <Swords size={13} className="text-[#d4af37]" />
          <span>The Ultimate Pilgrimage Shootout</span>
        </div>
        <h1 className="font-cinzel text-3xl sm:text-6xl font-black tracking-tight text-[#f7f4ee]">
          THE CAMERA WARS
        </h1>
        <div className="text-xl sm:text-2xl font-bold text-[#c5a059] mt-2 mb-3">
          Samsung Galaxy S25 <span className="text-[#b8b3a5] font-light">vs</span> Apple iPhone 17
        </div>
        <p className="font-serif-editorial text-base sm:text-lg text-[#b8b3a5] max-w-2xl mx-auto italic">
          "Two flagship phones. Five days across Kashi and Ayodhya. Endless friendly arguments on boats, ghats, and temple steps. You be the judge."
        </p>

        {/* Blind voting mode toggle */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setBlindMode(!blindMode)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold tracking-wider transition-all ${
              blindMode
                ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]'
                : 'bg-white/5 border-white/10 text-[#b8b3a5] hover:text-[#f7f4ee]'
            }`}
          >
            {blindMode ? <EyeOff size={14} /> : <Eye size={14} />}
            <span>Blind Voting Mode: {blindMode ? 'Enabled (Photos labeled A & B)' : 'Disabled (Brands Visible)'}</span>
          </button>
        </div>
      </div>

      {/* 2. LIVE SCOREBOARD BANNER */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-gradient-to-r from-[#181822] via-[#141418] to-[#22181a] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
            <div className="flex items-center gap-2 text-xs font-cinzel tracking-widest uppercase text-[#d4af37] font-bold">
              <Trophy size={16} />
              <span>Live Tournament Standings</span>
            </div>
            <div className="text-xs text-[#b8b3a5]">
              {grandTotal} Verified Votes Cast
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 text-center">
            {/* Galaxy S25 Score */}
            <div className="p-4 rounded-2xl bg-black/40 border border-[#3b82f6]/30">
              <span className="text-xs uppercase tracking-wider text-[#60a5fa] font-bold">Galaxy S25</span>
              <div className="text-3xl sm:text-5xl font-cinzel font-black text-[#f7f4ee] mt-1">
                {totalVotesS25}
              </div>
              <div className="text-xs text-[#b8b3a5] mt-1">
                {battlesWonS25} Rounds Won ({pctS25}%)
              </div>
            </div>

            {/* iPhone 17 Score */}
            <div className="p-4 rounded-2xl bg-black/40 border border-[#ec4899]/30">
              <span className="text-xs uppercase tracking-wider text-[#f472b6] font-bold">iPhone 17</span>
              <div className="text-3xl sm:text-5xl font-cinzel font-black text-[#f7f4ee] mt-1">
                {totalVotesIPhone}
              </div>
              <div className="text-xs text-[#b8b3a5] mt-1">
                {battlesWonIPhone} Rounds Won ({pctIPhone}%)
              </div>
            </div>
          </div>

          {/* Animated score bar */}
          <div className="w-full h-3 rounded-full bg-black/60 overflow-hidden flex mt-6 border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-[#2563eb] to-[#60a5fa] transition-all duration-700"
              style={{ width: `${pctS25}%` }}
            />
            <div
              className="h-full bg-gradient-to-r from-[#ec4899] to-[#f43f5e] transition-all duration-700"
              style={{ width: `${pctIPhone}%` }}
            />
          </div>

        </div>
      </div>

      {/* 3. BATTLE ROUNDS LIST */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {battles.map((battle, index) => {
          const userVote = userVotes[battle.id];
          const hasVoted = Boolean(userVote);
          const battleTotal = battle.votesS25 + battle.votesIPhone || 1;
          const s25Pct = Math.round((battle.votesS25 / battleTotal) * 100);
          const iPhonePct = 100 - s25Pct;
          const battleComments = comments[battle.id] || [];

          // Label A and B for blind mode
          const labelLeft = blindMode && !hasVoted ? 'Photograph A' : 'Samsung Galaxy S25';
          const labelRight = blindMode && !hasVoted ? 'Photograph B' : 'Apple iPhone 17';

          return (
            <div
              key={battle.id}
              className="bg-[#121216] border border-white/10 hover:border-[#d4af37]/40 rounded-3xl p-6 sm:p-8 shadow-2xl transition-all"
            >
              {/* Battle Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/5">
                <div>
                  <div className="text-xs text-[#c5a059] font-medium tracking-widest uppercase">
                    {battle.locationName} • {battle.date}
                  </div>
                  <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#f7f4ee] mt-0.5">
                    {battle.title}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => copyShareLink(battle.id)}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#b8b3a5] hover:text-white transition-colors"
                    title="Share Battle Link"
                  >
                    <Share2 size={16} />
                  </button>
                  {copiedId === battle.id && (
                    <span className="text-[10px] text-[#d4af37] animate-in fade-in">Link Copied!</span>
                  )}
                  <Link
                    to={`/camera-wars/${battle.id}`}
                    className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-[#d4af37] hover:text-[#09090b] text-xs font-cinzel uppercase tracking-wider text-[#d4af37] border border-[#d4af37]/30 transition-all flex items-center gap-1.5"
                  >
                    <span>Slider & Discussion</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#b8b3a5] mb-6">
                {battle.description}
              </p>

              {/* Side-by-Side Photos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Photo 1 (S25 / Option A) */}
                <div className="flex flex-col">
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-black border border-white/10 group">
                    <img
                      src={battle.photoS25.src}
                      alt={battle.photoS25.caption}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs font-bold text-[#60a5fa]">
                      {labelLeft}
                    </div>
                    {userVote === 'Galaxy S25' && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#3b82f6] text-white text-[11px] font-bold flex items-center gap-1 shadow-lg">
                        <CheckCircle2 size={12} />
                        <span>Your Vote</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-[#b8b3a5] mt-2 italic">
                    {hasVoted || !blindMode ? battle.photoS25.caption : 'Inspect tones, dynamic range, and texture.'}
                  </p>

                  {/* Vote Button */}
                  <button
                    onClick={() => castVote(battle.id, 'Galaxy S25')}
                    className={`mt-4 w-full py-2.5 rounded-xl text-xs font-cinzel uppercase tracking-wider font-bold transition-all ${
                      userVote === 'Galaxy S25'
                        ? 'bg-[#2563eb] text-white shadow-lg'
                        : 'bg-white/5 hover:bg-[#2563eb]/30 border border-white/10 text-[#f7f4ee]'
                    }`}
                  >
                    {userVote === 'Galaxy S25' ? 'Voted' : `Vote for ${labelLeft}`}
                  </button>
                </div>

                {/* Photo 2 (iPhone 17 / Option B) */}
                <div className="flex flex-col">
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-black border border-white/10 group">
                    <img
                      src={battle.photoIPhone.src}
                      alt={battle.photoIPhone.caption}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs font-bold text-[#f472b6]">
                      {labelRight}
                    </div>
                    {userVote === 'iPhone 17' && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#ec4899] text-white text-[11px] font-bold flex items-center gap-1 shadow-lg">
                        <CheckCircle2 size={12} />
                        <span>Your Vote</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-[#b8b3a5] mt-2 italic">
                    {hasVoted || !blindMode ? battle.photoIPhone.caption : 'Inspect highlight roll-off and color rendition.'}
                  </p>

                  {/* Vote Button */}
                  <button
                    onClick={() => castVote(battle.id, 'iPhone 17')}
                    className={`mt-4 w-full py-2.5 rounded-xl text-xs font-cinzel uppercase tracking-wider font-bold transition-all ${
                      userVote === 'iPhone 17'
                        ? 'bg-[#db2777] text-white shadow-lg'
                        : 'bg-white/5 hover:bg-[#db2777]/30 border border-white/10 text-[#f7f4ee]'
                    }`}
                  >
                    {userVote === 'iPhone 17' ? 'Voted' : `Vote for ${labelRight}`}
                  </button>
                </div>

              </div>

              {/* Vote result stats (shown after voting or in unblind mode) */}
              {(hasVoted || !blindMode) && (
                <div className="mt-6 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between text-xs text-[#b8b3a5] mb-2 font-mono">
                    <span className="text-[#60a5fa] font-bold">Galaxy S25: {battle.votesS25} ({s25Pct}%)</span>
                    <span className="text-[#f472b6] font-bold">iPhone 17: {battle.votesIPhone} ({iPhonePct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-black/50 overflow-hidden flex">
                    <div className="h-full bg-[#2563eb]" style={{ width: `${s25Pct}%` }} />
                    <div className="h-full bg-[#db2777]" style={{ width: `${iPhonePct}%` }} />
                  </div>
                </div>
              )}

              {/* Comments footer teaser */}
              <div className="mt-4 pt-3 flex items-center justify-between text-[11px] text-[#b8b3a5]">
                <span className="flex items-center gap-1.5">
                  <MessageSquare size={13} className="text-[#c5a059]" />
                  <span>{battleComments.length} Pilgrim reactions & debates</span>
                </span>
                <Link to={`/camera-wars/${battle.id}`} className="text-[#d4af37] hover:underline">
                  Join discussion →
                </Link>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
