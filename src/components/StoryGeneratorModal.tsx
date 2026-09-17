import React, { useState } from 'react';
import { Sparkles, X, Loader2, BookOpen, Layers, CheckCircle2, AlertCircle } from 'lucide-react';
import { Lesson } from '../types';
import { sound } from '../utils/audio';

interface StoryGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStoryGenerated: (lesson: Lesson) => void;
}

const POPULAR_SUGGESTIONS = [
  'FastAPI & Microservices',
  'List Comprehensions',
  'Object-Oriented Programming (Classes)',
  'Matplotlib Data Visualizations',
  'Try-Except Error Handling',
  'Python Generators & Yield',
  'Asyncio & Concurrency',
  'SQLAlchemy Database ORM'
];

export const StoryGeneratorModal: React.FC<StoryGeneratorModalProps> = ({
  isOpen,
  onClose,
  onStoryGenerated
}) => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [domain, setDomain] = useState('E-Commerce and Logistics');
  const [isLoading, setIsLoading] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (selectedTopic?: string) => {
    const topicToUse = (selectedTopic || topic).trim();
    if (!topicToUse) return;

    sound.playClick();
    setIsLoading(true);
    setErrorMsg(null);
    setGenerationStep(1);

    const stepTimer1 = setTimeout(() => setGenerationStep(2), 1200);
    const stepTimer2 = setTimeout(() => setGenerationStep(3), 2600);

    try {
      const res = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicToUse,
          difficulty,
          domain
        })
      });

      if (!res.ok) {
        throw new Error('Server returned an error while crafting the story.');
      }

      const data = await res.json();
      if (data.lesson) {
        sound.playSuccess();
        onStoryGenerated(data.lesson);
        onClose();
      } else {
        throw new Error('Could not parse generated story structure.');
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      sound.playError();
      setErrorMsg(err.message || 'Failed to craft story. Please check your topic and try again.');
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setIsLoading(false);
      setGenerationStep(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/70 backdrop-blur-xs">
      <div
        id="story-generator-modal"
        className="relative w-full max-w-xl bg-[#FDFCF6] rounded-3xl border border-[#D4A373]/30 shadow-2xl overflow-hidden p-6 sm:p-8"
      >
        {/* Close button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          disabled={isLoading}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#777] hover:text-[#1A1A1A] hover:bg-[#E9E5D9] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#1A1A1A] text-[#D4A373] flex items-center justify-center border border-[#1A1A1A] shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">AI Story Studio</h3>
            <p className="text-xs text-[#666] font-serif italic">Transform any Python topic into an 11-scene visual story</p>
          </div>
        </div>

        {!isLoading ? (
          <div className="space-y-4">
            {/* Topic Input */}
            <div>
              <label htmlFor="topic-input" className="block text-[10px] font-bold text-[#8C6D4F] uppercase tracking-widest mb-1.5">
                Python Concept or Library
              </label>
              <input
                id="topic-input"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleGenerate();
                }}
                placeholder="e.g. FastAPI, Recursion, Matplotlib, Decorators..."
                className="w-full px-4 py-3 rounded-2xl border border-[#E9E5D9] text-sm font-medium text-[#1A1A1A] placeholder:text-[#999] focus:outline-hidden focus:ring-2 focus:ring-[#D4A373]/30 focus:border-[#D4A373] transition-all bg-[#F7F5EE]"
              />
            </div>

            {/* Quick Suggestions */}
            <div>
              <span className="text-[10px] font-bold text-[#8C6D4F] uppercase tracking-widest block mb-2">
                Popular Requests (Click to Generate)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_SUGGESTIONS.map((sug) => (
                  <button
                    key={sug}
                    onClick={() => {
                      setTopic(sug);
                      handleGenerate(sug);
                    }}
                    className="px-3 py-1 rounded-xl text-xs font-serif bg-[#E9E5D9] text-[#1A1A1A] hover:bg-[#D4A373] hover:text-[#1A1A1A] border border-[#D4A373]/20 transition-all cursor-pointer"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty & Domain */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[10px] font-bold text-[#8C6D4F] uppercase tracking-widest mb-1">Target Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-[#E9E5D9] bg-[#F7F5EE] text-[#1A1A1A] focus:outline-hidden focus:border-[#D4A373]"
                >
                  <option value="Beginner">Beginner (Intuition-first)</option>
                  <option value="Intermediate">Intermediate (Real patterns)</option>
                  <option value="Advanced">Advanced (Deep mechanics)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#8C6D4F] uppercase tracking-widest mb-1">Real-World Domain</label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-[#E9E5D9] bg-[#F7F5EE] text-[#1A1A1A] focus:outline-hidden focus:border-[#D4A373]"
                >
                  <option value="E-Commerce and Logistics">E-Commerce & Logistics</option>
                  <option value="Healthcare & Genomics">Healthcare & Genomics</option>
                  <option value="Finance & Trading">Finance & Fintech</option>
                  <option value="Smart City Transportation">Smart Transportation</option>
                  <option value="Aerospace Satellite Telemetry">Aerospace & Satellite</option>
                </select>
              </div>
            </div>

            {/* Error notice */}
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-[#FDF2F0] border border-[#F0CEC7] text-xs text-[#8C3A32] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit button */}
            <button
              id="generate-story-submit-btn"
              disabled={!topic.trim()}
              onClick={() => handleGenerate()}
              className={`w-full py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer ${
                topic.trim()
                  ? 'bg-[#1A1A1A] hover:bg-[#D4A373] text-[#FDFCF6] hover:text-[#1A1A1A] border border-[#1A1A1A] shadow-md'
                  : 'bg-[#E9E5D9] text-[#AAA] cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Interactive Story</span>
            </button>
          </div>
        ) : (
          /* Animated Loading State */
          <div className="py-10 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-3xl bg-[#F7F5EE] border border-[#E9E5D9] flex items-center justify-center text-[#D4A373] shadow-xs">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            </div>

            <div className="space-y-1.5 max-w-sm">
              <h4 className="font-serif text-base font-bold text-[#1A1A1A]">
                Crafting "{topic}"
              </h4>
              <p className="text-xs text-[#8C6D4F] font-serif italic animate-pulse">
                {generationStep === 1 && '1/3 Architecting real-world scale bottleneck & character cast...'}
                {generationStep === 2 && '2/3 Mapping story actions directly into idiomatic Python code...'}
                {generationStep === 3 && '3/3 Preparing interactive live sandbox and challenge quiz...'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
