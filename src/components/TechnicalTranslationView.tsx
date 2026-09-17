import React from 'react';
import { TechnicalTranslation } from '../types';
import { ArrowRight, Code2, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';

interface TechnicalTranslationViewProps {
  translations: TechnicalTranslation[];
  storyMode: 'story' | 'technical';
  onToggleMode: () => void;
}

export const TechnicalTranslationView: React.FC<TechnicalTranslationViewProps> = ({
  translations,
  storyMode,
  onToggleMode
}) => {
  return (
    <div id="technical-translation-container" className="space-y-6">
      {/* Introduction banner with mode switch */}
      <div className="p-6 rounded-3xl bg-[#F7F5EE] border border-[#E9E5D9] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-[#D4A373]" />
            <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">The Story-to-Code Rosetta Stone</h3>
          </div>
          <p className="text-xs text-[#555] font-serif italic">
            Translating everyday narrative roles into concrete computer science concepts and Python syntax.
          </p>
        </div>

        <button
          onClick={onToggleMode}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1A1A1A] hover:bg-[#D4A373] text-[#FDFCF6] hover:text-[#1A1A1A] border border-[#1A1A1A] text-xs font-bold shadow-xs transition-all cursor-pointer whitespace-nowrap"
        >
          {storyMode === 'story' ? (
            <>
              <Code2 className="w-4 h-4 text-[#D4A373]" />
              <span>Switch to Technical Mode</span>
            </>
          ) : (
            <>
              <BookOpen className="w-4 h-4 text-[#D4A373]" />
              <span>Switch to Story Mode</span>
            </>
          )}
        </button>
      </div>

      {/* Grid of translation cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {translations.map((item, idx) => (
          <div
            key={idx}
            className="p-6 rounded-3xl bg-[#F7F5EE] border border-[#E9E5D9] shadow-xs hover:border-[#D4A373] hover:shadow-md transition-all flex flex-col justify-between gap-4"
          >
            <div>
              {/* Header: Story Character -> Tech Concept */}
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#E9E5D9] flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#E9E5D9] text-[#1A1A1A] text-xs font-bold flex items-center justify-center font-serif">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-[#1A1A1A] font-serif">{item.storyCharacter}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#D4A373]" />
                <span className="text-xs font-bold text-[#8C6D4F] bg-[#FAF4EB] px-2.5 py-1 rounded-lg border border-[#E8D7C2]">
                  {item.technicalConcept}
                </span>
              </div>

              {/* Explanation according to mode */}
              <div className="mt-3 text-xs leading-relaxed">
                {storyMode === 'story' ? (
                  <div className="flex items-start gap-2 bg-[#FDFCF6] p-3.5 rounded-2xl border border-[#E9E5D9]">
                    <BookOpen className="w-4 h-4 text-[#8C6D4F] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#1A1A1A] block mb-0.5 font-serif">Intuitive Narrative Meaning:</strong>
                      <p className="text-[#555] font-serif leading-relaxed italic">{item.storyExplanation}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 bg-[#1A1A1A] text-[#E5E0D5] p-3.5 rounded-2xl border border-[#D4A373]/30">
                    <Code2 className="w-4 h-4 text-[#D4A373] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-[#FDFCF6] block mb-0.5">Technical Specification:</strong>
                      <p className="text-[#D0C9BD] leading-relaxed">{item.technicalExplanation}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Code snippet pill */}
            <div className="pt-2">
              <div className="bg-[#1A1A1A] text-[#D4A373] font-mono text-[11px] px-3.5 py-2.5 rounded-xl border border-[#3E3E3E] overflow-x-auto flex items-center justify-between gap-2">
                <code>{item.codeSnippet}</code>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#72B37E] shrink-0" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
