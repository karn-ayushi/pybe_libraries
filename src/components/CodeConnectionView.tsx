import React, { useState } from 'react';
import { StoryToCodeMapping } from '../types';
import { Sparkles, Code2, ArrowRight, Check, Copy } from 'lucide-react';
import { sound } from '../utils/audio';

interface CodeConnectionViewProps {
  fullPythonCode: string;
  mappings: StoryToCodeMapping[];
  storyMode: 'story' | 'technical';
}

export const CodeConnectionView: React.FC<CodeConnectionViewProps> = ({
  fullPythonCode,
  mappings,
  storyMode
}) => {
  const [selectedMappingId, setSelectedMappingId] = useState<string>(mappings[0]?.id || '');
  const [copied, setCopied] = useState(false);

  const activeMapping = mappings.find(m => m.id === selectedMappingId) || mappings[0];
  const highlightedLines = activeMapping?.highlightLineNumbers || [];

  const codeLines = fullPythonCode.split('\n');

  const copyCode = () => {
    sound.playClick();
    navigator.clipboard.writeText(fullPythonCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="code-connection-container" className="space-y-6">
      {/* Header instructions */}
      <div className="p-5 rounded-3xl bg-[#F7F5EE] border border-[#E9E5D9] shadow-xs flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-[#D4A373] shrink-0" />
          <p className="text-xs text-[#1A1A1A] font-medium font-serif">
            <strong className="font-sans uppercase tracking-wider text-[11px] text-[#8C6D4F] block">Interactive Code Synchronization</strong>
            Click any narrative action on the left to illuminate the exact lines of Python code on the right.
          </p>
        </div>
        <button
          onClick={copyCode}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1A1A1A] hover:bg-[#D4A373] text-[#FDFCF6] hover:text-[#1A1A1A] border border-[#1A1A1A] text-xs font-bold transition-all shrink-0 cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#72B37E]" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied!' : 'Copy Code'}</span>
        </button>
      </div>

      {/* Two-column layout: Story Actions on Left, Code on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Story Actions & Concepts */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8C6D4F] block px-1">
            Story Actions (Click to Highlight)
          </span>

          {mappings.map((mapping, idx) => {
            const isSelected = mapping.id === selectedMappingId;
            return (
              <div
                key={mapping.id}
                id={`mapping-card-${mapping.id}`}
                onClick={() => {
                  sound.playClick();
                  setSelectedMappingId(mapping.id);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#FDFCF6] border-[#D4A373] shadow-md ring-2 ring-[#D4A373]/30'
                    : 'bg-[#F7F5EE] border-[#E9E5D9] hover:border-[#D4A373] hover:bg-[#FDFCF6]'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center font-serif ${
                      isSelected ? 'bg-[#1A1A1A] text-[#FDFCF6]' : 'bg-[#E9E5D9] text-[#1A1A1A]'
                    }`}>
                      {idx + 1}
                    </span>
                    <h4 className="font-serif text-xs font-bold text-[#1A1A1A]">{mapping.storyAction}</h4>
                  </div>
                  <span className="text-[10px] font-bold text-[#8C6D4F] bg-[#FAF4EB] px-2 py-0.5 rounded-md border border-[#E8D7C2] whitespace-nowrap">
                    {mapping.programmingConcept}
                  </span>
                </div>

                <p className="text-xs text-[#555] mt-2 leading-relaxed font-serif italic">
                  {storyMode === 'story' ? `"${mapping.storyNote}"` : mapping.technicalNote}
                </p>

                {isSelected && (
                  <div className="mt-3 pt-2.5 border-t border-[#E9E5D9] flex items-center justify-between text-[11px] text-[#8C6D4F] font-semibold">
                    <span>Highlighted Line(s): {mapping.highlightLineNumbers.join(', ')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Synced Code Window */}
        <div className="lg:col-span-7 bg-[#1A1A1A] rounded-3xl border border-[#3E3E3E] shadow-xl overflow-hidden">
          {/* Code Window Header */}
          <div className="bg-[#141414] px-4 py-3 border-b border-[#2E2E2E] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8C3A32]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4A373]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#486B4F]" />
              <span className="text-xs font-mono text-[#AAA] ml-2">solution.py</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#AAA]">
              <Code2 className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>Python 3.12</span>
            </div>
          </div>

          {/* Code Content */}
          <div className="p-4 font-mono text-xs leading-6 overflow-x-auto text-[#E5E0D5]">
            {codeLines.map((line, idx) => {
              const lineNum = idx + 1;
              const isHighlighted = highlightedLines.includes(lineNum);

              return (
                <div
                  key={idx}
                  className={`flex items-start transition-colors px-2 py-0.5 rounded ${
                    isHighlighted
                      ? 'bg-[#D4A373]/20 text-[#FDFCF6] font-medium ring-1 ring-[#D4A373]/40'
                      : 'hover:bg-[#252525]'
                  }`}
                >
                  <span className={`w-8 shrink-0 select-none text-right pr-4 text-[11px] ${
                    isHighlighted ? 'text-[#D4A373] font-bold' : 'text-[#666]'
                  }`}>
                    {lineNum}
                  </span>
                  <span className={`flex-1 whitespace-pre ${
                    line.trim().startsWith('#') 
                      ? 'text-[#777] italic' 
                      : line.includes('import ') || line.includes('def ') || line.includes('for ') || line.includes('if ') || line.includes('return')
                      ? 'text-[#D4A373] font-semibold'
                      : line.includes('print(')
                      ? 'text-[#C9A96E]'
                      : isHighlighted 
                      ? 'text-[#FDFCF6]' 
                      : 'text-[#DCD6C8]'
                  }`}>
                    {line || ' '}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Active explanation banner below code */}
          {activeMapping && (
            <div className="bg-[#141414] border-t border-[#2E2E2E] p-3.5 text-xs text-[#DCD6C8] flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#D4A373] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#FDFCF6] block mb-0.5 font-serif">
                  Action: {activeMapping.storyAction}
                </strong>
                <span className="text-[#AAA] text-[11px]">
                  Concept: {activeMapping.programmingConcept} — Lines {activeMapping.highlightLineNumbers.join(', ')}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
