import React, { useState } from 'react';
import { ConversationLesson } from '../types';
import { Sparkles, X, Loader2, BookOpen } from 'lucide-react';
import { CharacterAvatar } from './CharacterAvatar';

interface GenerateTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConversationGenerated: (lesson: ConversationLesson) => void;
}

const SAMPLE_TOPICS = [
  'Polars & Lazy DataFrames',
  'PyTorch & GPU Tensors',
  'FastAPI & Async Endpoints',
  'Scikit-Learn ML Models',
  'BeautifulSoup & Web Scraping',
  'SQLAlchemy 2.0 ORM',
  'Pydantic Data Schemas',
  'SciPy Optimization'
];

export const GenerateTopicModal: React.FC<GenerateTopicModalProps> = ({
  isOpen,
  onClose,
  onConversationGenerated
}) => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/generate-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim(), difficulty })
      });

      if (!response.ok) {
        throw new Error('Failed to generate conversation');
      }

      const data = await response.json();
      if (data.lesson) {
        onConversationGenerated(data.lesson);
        onClose();
      } else {
        throw new Error('Invalid conversation data received');
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      setErrorMsg(err.message || 'Could not generate conversation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        id="generate-topic-modal"
        className="relative w-full max-w-lg bg-[#FDFCF7] dark:bg-[#16161A] rounded-3xl border border-[#DDD7C8] dark:border-[#2D2D38] shadow-2xl overflow-hidden p-6 sm:p-8 transition-colors"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#EAE4D5] dark:border-[#2A2A34]">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <CharacterAvatar character="Ayushi" size="sm" className="ring-2 ring-[#FDFCF7] dark:ring-[#16161A]" />
              <CharacterAvatar character="Ayush" size="sm" className="ring-2 ring-[#FDFCF7] dark:ring-[#16161A]" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">
                Generate New Conversation
              </h2>
              <p className="text-xs text-[#666] dark:text-[#A1A1AA] font-serif italic">
                Turn any Python topic into an Ayushi & Ayush dialogue
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 rounded-xl text-[#777] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-white hover:bg-[#EAE4D5] dark:hover:bg-[#25252E] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8C6D4F] dark:text-[#FB923C] mb-1.5 font-serif">
              Python Library Name
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Polars, PyTorch, FastAPI, SciPy, BeautifulSoup, Seaborn..."
              required
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-2xl bg-[#F9F6F0] dark:bg-[#1C1C22] border border-[#DDD7C8] dark:border-[#2D2D38] text-sm text-[#1A1A1A] dark:text-[#F4F4F5] placeholder-[#999] dark:placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#F97316] transition-all font-serif"
            />
          </div>

          {/* Sample Chips */}
          <div>
            <span className="block text-[11px] text-[#777] dark:text-[#A1A1AA] font-serif mb-2 italic">
              Or pick an idea:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_TOPICS.map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => setTopic(sample)}
                  disabled={isLoading}
                  className="px-2.5 py-1 rounded-xl bg-[#F2ECE1] dark:bg-[#1E1E24] hover:bg-[#EAE4D5] dark:hover:bg-[#282832] border border-[#DDD7C8] dark:border-[#32323E] text-[11px] text-[#333] dark:text-[#DDD] transition-colors cursor-pointer"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8C6D4F] dark:text-[#FB923C] mb-1.5 font-serif">
              Difficulty
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setDifficulty(lvl)}
                  disabled={isLoading}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    difficulty === lvl
                      ? 'bg-gradient-to-r from-[#F97316] to-[#EC4899] text-white border-transparent shadow-xs'
                      : 'bg-[#F9F6F0] dark:bg-[#1C1C22] text-[#555] dark:text-[#AAA] border-[#DDD7C8] dark:border-[#2D2D38] hover:bg-[#F2ECE1] dark:hover:bg-[#25252E]'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs text-[#DC2626] dark:text-[#F87171] font-serif">{errorMsg}</p>
          )}

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl border border-[#DDD7C8] dark:border-[#2D2D38] text-xs font-semibold text-[#555] dark:text-[#AAA] hover:bg-[#EAE4D5] dark:hover:bg-[#25252E] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !topic.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F97316] to-[#EC4899] hover:from-[#EA580C] hover:to-[#DB2777] text-white text-xs font-bold transition-all cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Drafting Dialogue...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <span>Create Conversation</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
