import React, { useState, useEffect } from 'react';
import { FLIP_CARDS_DATA, FlipCardItem } from '../data/flipCardsData';
import { CharacterAvatar } from './CharacterAvatar';
import { playCorrectAnswerSound, playPlayfulPop } from '../utils/audio';
import {
  Layers,
  RotateCw,
  Copy,
  Check,
  Search,
  BookOpen,
  Sparkles,
  CheckCircle2,
  BookmarkCheck,
  ArrowRight
} from 'lucide-react';

interface FlipCardsViewProps {
  onReturnHome?: () => void;
}

const STORAGE_KEY = 'mastered_python_flip_cards';

export const FlipCardsView: React.FC<FlipCardsViewProps> = ({ onReturnHome }) => {
  const [cards] = useState<FlipCardItem[]>(FLIP_CARDS_DATA);
  const [selectedLibrary, setSelectedLibrary] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [masteredCards, setMasteredCards] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleFlip = (id: string) => {
    playPlayfulPop();
    setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleMastered = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setMasteredCards(prev => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      if (next[id]) {
        playCorrectAnswerSound();
      } else {
        playPlayfulPop();
      }
      return next;
    });
  };

  const handleCopy = (e: React.MouseEvent, id: string, text: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    playPlayfulPop();
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const libraries = ['All', 'Pandas', 'PyTorch', 'NumPy', 'Polars', 'FastAPI', 'Seaborn'];

  const filteredCards = cards.filter(c => {
    const matchesLib = selectedLibrary === 'All' || c.library === selectedLibrary;
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      c.title.toLowerCase().includes(query) ||
      c.confusionBadge.toLowerCase().includes(query) ||
      c.conceptA.name.toLowerCase().includes(query) ||
      c.conceptB.name.toLowerCase().includes(query);
    return matchesLib && matchesQuery;
  });

  const masteredCount = Object.values(masteredCards).filter(Boolean).length;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-10 space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#FFF5F7] via-[#FFFDFB] to-[#FFF7ED] dark:from-[#261520] dark:via-[#191920] dark:to-[#281813] border-2 border-[#FED7AA]/80 dark:border-[#52291B]/80 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EC4899] text-white text-xs font-bold font-serif shadow-xs">
              <Layers className="w-3.5 h-3.5" />
              <span>Ayushi's Quick-Reference Cards</span>
            </span>
            <span className="text-xs font-mono font-bold text-[#16A34A] dark:text-[#4ADE80] bg-[#DCFCE7] dark:bg-[#132B1A] px-2.5 py-0.5 rounded-full border border-[#BBF7D0] dark:border-[#22542B]">
              {masteredCount} of {cards.length} Mastered
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#1A1A1A] dark:text-[#F4F4F5] tracking-tight">
            Mental Model Flip Cards
          </h1>
          <p className="text-xs sm:text-sm font-serif text-[#666] dark:text-[#A1A1AA] max-w-2xl">
            Never mix up <code className="text-[#EA580C] dark:text-[#FB923C] font-mono">.loc</code> vs <code className="text-[#0284C7] dark:text-[#38BDF8] font-mono">.iloc</code> or <code className="text-[#DB2777] dark:text-[#F472B6] font-mono">view()</code> vs <code className="text-[#10B981] dark:text-[#34D399] font-mono">reshape()</code> again. Click any card to flip it over for production code & mnemonics.
          </p>
        </div>
      </div>

      {/* Filter Chips & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1">
          {libraries.map(lib => (
            <button
              key={lib}
              onClick={() => {
                playPlayfulPop();
                setSelectedLibrary(lib);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer shrink-0 border ${
                selectedLibrary === lib
                  ? 'bg-gradient-to-r from-[#F97316] to-[#EC4899] text-white border-transparent shadow-xs'
                  : 'bg-[#FFFDFB] dark:bg-[#1E1E24] text-[#666] dark:text-[#A1A1AA] border-[#E5DFD0] dark:border-[#383846] hover:border-[#F97316]'
              }`}
            >
              {lib}
            </button>
          ))}
        </div>

        <div className="w-full md:w-64 relative">
          <Search className="w-4 h-4 text-[#888] dark:text-[#A1A1AA] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search mental models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FFFDFB] dark:bg-[#1E1E24] border border-[#FED7AA]/80 dark:border-[#383846] text-xs font-serif text-[#1A1A1A] dark:text-[#F4F4F5] focus:outline-none focus:border-[#EC4899] shadow-xs"
          />
        </div>
      </div>

      {/* Flip Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCards.map((card) => {
          const isFlipped = Boolean(flippedCards[card.id]);
          const isMastered = Boolean(masteredCards[card.id]);

          return (
            <div
              key={card.id}
              onClick={() => toggleFlip(card.id)}
              className="relative min-h-[360px] rounded-3xl cursor-pointer group select-none transition-transform duration-200 hover:-translate-y-1"
            >
              <div
                className={`w-full h-full p-6 sm:p-7 rounded-3xl border-2 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-md ${
                  isFlipped
                    ? 'bg-[#1E1E24] text-[#F4F4F5] border-[#3E3E4C]'
                    : isMastered
                    ? 'bg-[#FCFDF9] dark:bg-[#161D17] border-[#86EFAC] dark:border-[#22542B]'
                    : 'bg-[#FFFDFB] dark:bg-[#18181D] border-[#FED7AA]/80 dark:border-[#4B291D]'
                }`}
              >
                {/* Card Top Action Bar */}
                <div className="flex items-center justify-between gap-2 border-b border-black/5 dark:border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono uppercase font-bold tracking-wider px-2.5 py-1 rounded-md ${
                      isFlipped
                        ? 'bg-[#2E2E38] text-[#38BDF8]'
                        : 'bg-[#FFF0E6] dark:bg-[#341F16] text-[#EA580C] dark:text-[#FB923C]'
                    }`}>
                      {card.library}
                    </span>
                    <span className={`text-[11px] font-serif italic ${isFlipped ? 'text-[#AAA]' : 'text-[#666] dark:text-[#A1A1AA]'}`}>
                      {card.confusionBadge}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Mastered Checkmark Toggle */}
                    <button
                      onClick={(e) => toggleMastered(e, card.id)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer ${
                        isMastered
                          ? 'bg-[#DCFCE7] dark:bg-[#15341D] text-[#16A34A] dark:text-[#4ADE80] border border-[#86EFAC]'
                          : 'bg-black/5 dark:bg-white/5 text-[#888] hover:text-[#16A34A]'
                      }`}
                      title="Mark as Mastered"
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isMastered ? 'fill-current' : ''}`} />
                      <span className="text-[10px]">{isMastered ? 'Mastered' : 'Mark'}</span>
                    </button>

                    {/* Flip Indicator */}
                    <span className="flex items-center gap-1 text-[11px] font-serif text-[#888] group-hover:text-[#EC4899] transition-colors">
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>{isFlipped ? 'Front' : 'Flip'}</span>
                    </span>
                  </div>
                </div>

                {/* Card Body: FRONT vs BACK */}
                {!isFlipped ? (
                  /* FRONT: Concepts Breakdown */
                  <div className="my-auto space-y-4 py-2">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">
                      {card.title}
                    </h3>

                    {/* Side-by-side or stacked concepts */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-2xl bg-[#FFF9F2] dark:bg-[#201814] border border-[#FED7AA]/60 dark:border-[#3E2419] space-y-1 text-left">
                        <span className="font-mono text-xs font-bold text-[#EA580C] dark:text-[#FB923C] block">
                          {card.conceptA.name}
                        </span>
                        <p className="font-serif text-xs text-[#555] dark:text-[#BBB] leading-relaxed">
                          {card.conceptA.summary}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#F0F9FF] dark:bg-[#10212E] border border-[#BAE6FD]/60 dark:border-[#1E4E79] space-y-1 text-left">
                        <span className="font-mono text-xs font-bold text-[#0284C7] dark:text-[#38BDF8] block">
                          {card.conceptB.name}
                        </span>
                        <p className="font-serif text-xs text-[#555] dark:text-[#BBB] leading-relaxed">
                          {card.conceptB.summary}
                        </p>
                      </div>
                    </div>

                    {/* Ayushi's Mnemonic */}
                    <div className="p-3 rounded-2xl bg-[#FFF5F7] dark:bg-[#241520] border border-[#FCE7F3] dark:border-[#4B1E37] flex items-center gap-2.5 text-left">
                      <CharacterAvatar character="Ayushi" size="xs" className="shrink-0" />
                      <p className="text-xs font-serif text-[#DB2777] dark:text-[#F472B6] italic">
                        <strong>Ayushi's Mnemonic:</strong> {card.ayushiMnemonic}
                      </p>
                    </div>
                  </div>
                ) : (
                  /* BACK: Code Snippet & Ayush's Rule of Thumb */
                  <div className="my-auto space-y-4 py-2 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#38BDF8] uppercase tracking-wider">
                        Production Code Example
                      </span>
                      <button
                        onClick={(e) => handleCopy(e, card.id, card.practicalExample)}
                        className="flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-[#DDD] transition-colors cursor-pointer"
                      >
                        {copiedId === card.id ? (
                          <>
                            <Check className="w-3 h-3 text-[#4ADE80]" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="p-3.5 rounded-2xl bg-[#141418] border border-[#2C2C36] font-mono text-xs text-[#86EFAC] overflow-x-auto whitespace-pre leading-relaxed">
                      {card.practicalExample}
                    </pre>

                    {/* Ayush's Rule of Thumb */}
                    <div className="p-3 rounded-2xl bg-[#281C16] border border-[#52291B] flex items-start gap-2.5 text-left">
                      <CharacterAvatar character="Ayush" size="xs" className="shrink-0 ring-1 ring-[#F97316]" />
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold text-[#FB923C] uppercase tracking-wider block">
                          Ayush's Golden Rule:
                        </span>
                        <p className="text-xs font-serif text-[#E4E4E7] leading-relaxed">
                          {card.ayushRuleOfThumb}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card Footer Hint */}
                <div className="pt-2 text-center text-[10px] font-serif text-[#888] dark:text-[#A1A1AA]">
                  {isFlipped ? 'Click card to return to concepts' : 'Click card to see production code & rule of thumb'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
