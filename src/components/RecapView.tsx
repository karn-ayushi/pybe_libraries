import React from 'react';
import { Lesson } from '../types';
import { AlertCircle, Lightbulb, HelpCircle, Cpu, Code2, Trophy } from 'lucide-react';

interface RecapViewProps {
  recap: Lesson['recapSummary'];
}

export const RecapView: React.FC<RecapViewProps> = ({ recap }) => {
  const recapItems = [
    {
      title: 'The Real-World Problem',
      content: recap.problem,
      icon: AlertCircle,
      badge: '1. The Why',
      accent: 'border-[#E9E5D9] bg-[#F7F5EE] text-[#1A1A1A]'
    },
    {
      title: 'The Python Concept / Library',
      content: recap.concept,
      icon: Lightbulb,
      badge: '2. The Tool',
      accent: 'border-[#E9E5D9] bg-[#F7F5EE] text-[#1A1A1A]'
    },
    {
      title: 'Why It Was Needed',
      content: recap.whyNeeded,
      icon: HelpCircle,
      badge: '3. The Rationale',
      accent: 'border-[#E9E5D9] bg-[#F7F5EE] text-[#1A1A1A]'
    },
    {
      title: 'How It Worked Under the Hood',
      content: recap.howItWorks,
      icon: Cpu,
      badge: '4. The Mechanics',
      accent: 'border-[#E9E5D9] bg-[#F7F5EE] text-[#1A1A1A]'
    },
    {
      title: 'Essential Syntax Pattern',
      content: recap.keySyntax,
      icon: Code2,
      badge: '5. The Code',
      accent: 'border-[#3E3E3E] bg-[#1A1A1A] text-[#FDFCF6] is-code'
    },
    {
      title: 'Final Outcome & Speedup',
      content: recap.keyResult,
      icon: Trophy,
      badge: '6. The Result',
      accent: 'border-[#E9E5D9] bg-[#F7F5EE] text-[#1A1A1A]'
    }
  ];

  return (
    <div id="recap-summary-container" className="space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-1">
        <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">The 6-Pillar Lesson Blueprint</h3>
        <p className="text-xs text-[#555] font-serif italic">
          Everything you learned connecting real-world friction to idiomatic Python execution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recapItems.map((item, idx) => {
          const Icon = item.icon;
          const isCodeCard = item.accent.includes('is-code');

          return (
            <div
              key={idx}
              className={`p-6 rounded-3xl border ${item.accent} shadow-xs flex flex-col justify-between gap-3`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-md ${
                    isCodeCard ? 'bg-[#2E2E2E] text-[#D4A373]' : 'bg-[#E9E5D9] text-[#1A1A1A]'
                  }`}>
                    {item.badge}
                  </span>
                  <Icon className={`w-4 h-4 ${isCodeCard ? 'text-[#D4A373]' : 'text-[#8C6D4F]'}`} />
                </div>

                <h4 className={`font-serif text-sm font-bold mb-2 ${isCodeCard ? 'text-[#FDFCF6]' : 'text-[#1A1A1A]'}`}>
                  {item.title}
                </h4>

                {isCodeCard ? (
                  <pre className="mt-2 bg-[#121212] p-3 rounded-2xl font-mono text-[11px] text-[#D4A373] leading-5 overflow-x-auto border border-[#2E2E2E]">
                    <code>{item.content}</code>
                  </pre>
                ) : (
                  <p className="text-xs text-[#555] font-serif leading-relaxed">
                    {item.content}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
