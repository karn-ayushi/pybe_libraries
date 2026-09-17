import React, { useState } from 'react';
import { Scene, Lesson, Character } from '../types';
import { DialogueBubble } from './DialogueBubble';
import { CharacterCard } from './CharacterCard';
import { TechnicalTranslationView } from './TechnicalTranslationView';
import { CodeConnectionView } from './CodeConnectionView';
import { InteractiveSimulatorView } from './InteractiveSimulatorView';
import { RecapView } from './RecapView';
import { ChallengeView } from './ChallengeView';
import { Sparkles, AlertTriangle, Lightbulb, CheckCircle2, ArrowRight, Briefcase, Zap } from 'lucide-react';
import { sound } from '../utils/audio';

interface SceneContainerProps {
  scene: Scene;
  lesson: Lesson;
  storyMode: 'story' | 'technical';
  onToggleMode: () => void;
  onLessonCompleted: () => void;
  isLessonCompleted?: boolean;
}

export const SceneContainer: React.FC<SceneContainerProps> = ({
  scene,
  lesson,
  storyMode,
  onToggleMode,
  onLessonCompleted,
  isLessonCompleted
}) => {
  const [selectedDecisionId, setSelectedDecisionId] = useState<string | null>(null);

  const characterMap: Record<string, Character> = {};
  lesson.characters.forEach(c => {
    characterMap[c.id] = c;
  });

  const handleDecision = (optId: string) => {
    sound.playClick();
    setSelectedDecisionId(optId);
  };

  const selectedDecision = scene.decision?.options.find(o => o.id === selectedDecisionId);

  return (
    <div id={`scene-container-${scene.sceneNumber}`} className="space-y-6">
      {/* Scene Header */}
      <div className="border-b border-[#E9E5D9] pb-4">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#E9E5D9] text-[#1A1A1A] border border-[#D4A373]/30">
            Scene {scene.sceneNumber} of {lesson.scenes.length}
          </span>
          <span className="text-xs text-[#AAA] font-medium">|</span>
          <span className="text-xs font-semibold text-[#8C6D4F] uppercase tracking-wider">{scene.type}</span>
          {lesson.jobRole && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-[#666] font-medium ml-auto">
              <Briefcase className="w-3.5 h-3.5 text-[#8C6D4F]" />
              <span>Role: {lesson.jobRole.title}</span>
            </span>
          )}
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">
          {scene.title}
        </h2>
        <p className="text-sm text-[#555] font-serif italic mt-1">
          {scene.subtitle}
        </p>
      </div>

      {/* Main Narrative Text (Switches smoothly between Story Mode and Technical Mode) */}
      {scene.type !== 'translation' && scene.type !== 'code' && scene.type !== 'interactive' && scene.type !== 'recap' && scene.type !== 'challenge' && (
        <div className={`p-6 sm:p-8 rounded-3xl transition-all border ${
          storyMode === 'story'
            ? 'bg-[#F7F5EE] border-[#E9E5D9] shadow-xs text-[#1A1A1A]'
            : 'bg-[#1A1A1A] text-[#FDFCF6] border-[#D4A373]/30 shadow-md'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg ${
              storyMode === 'story'
                ? 'bg-[#E9E5D9] text-[#1A1A1A] border border-[#D4A373]/30 font-serif'
                : 'bg-[#2A2A2A] text-[#D4A373] border border-[#D4A373]/30'
            }`}>
              {storyMode === 'story' ? '📖 Narrative Scene' : '⚙️ Architectural Mechanics'}
            </span>
          </div>

          <p className={`text-base sm:text-lg leading-relaxed whitespace-pre-line ${
            storyMode === 'story' ? 'font-serif text-[#222]' : 'font-sans text-[#E5E0D5]'
          }`}>
            {storyMode === 'story' ? scene.storyText : scene.technicalText}
          </p>

          {/* Scene 1 Problem Breakdown Callout */}
          {scene.type === 'problem' && lesson.realWorldProblem && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 pt-5 border-t border-[#E9E5D9]">
              <div className="p-4 rounded-2xl bg-[#FAF4EB] border border-[#E8D7C2] text-xs text-[#8C6D4F]">
                <div className="flex items-center gap-2 font-bold mb-1.5 uppercase tracking-wider text-[11px]">
                  <AlertTriangle className="w-4 h-4 text-[#D4A373]" />
                  <span>The Scale Bottleneck</span>
                </div>
                <p className="leading-relaxed text-[#5A4532]">{lesson.realWorldProblem.scaleMetric}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#FDF2F0] border border-[#F0CEC7] text-xs text-[#8C3A32]">
                <div className="flex items-center gap-2 font-bold mb-1.5 uppercase tracking-wider text-[11px]">
                  <AlertTriangle className="w-4 h-4 text-[#C25B4F]" />
                  <span>Why Manual Spreadsheets Fail</span>
                </div>
                <p className="leading-relaxed text-[#6E2A24]">{lesson.realWorldProblem.failureOfManualWork}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Character Roster on Scene 2 */}
      {scene.type === 'characters' && (
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8C6D4F] block">
            The Purposeful Cast: Who, What, Why & How
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lesson.characters.map(char => (
              <CharacterCard key={char.id} character={char} />
            ))}
          </div>
        </div>
      )}

      {/* Dialogues */}
      {scene.dialogue && scene.dialogue.length > 0 && (
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8C6D4F] block px-1">
            Character Conversation
          </span>
          {scene.dialogue.map((dlg, idx) => (
            <DialogueBubble
              key={idx}
              dialogue={dlg}
              character={characterMap[dlg.characterId]}
            />
          ))}
        </div>
      )}

      {/* Scene 3 Interactive Decision / Conflict Branch */}
      {scene.decision && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#1A1A1A] text-[#FDFCF6] border border-[#D4A373]/30 shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#D4A373]" />
            <h4 className="font-serif text-base font-bold text-[#FDFCF6] tracking-wide">
              {scene.decision.prompt}
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {scene.decision.options.map(opt => {
              const isSelected = selectedDecisionId === opt.id;
              return (
                <button
                  key={opt.id}
                  id={`decision-btn-${opt.id}`}
                  onClick={() => handleDecision(opt.id)}
                  className={`p-4 rounded-2xl text-left text-xs font-semibold transition-all border cursor-pointer ${
                    isSelected
                      ? opt.isOptimal
                        ? 'bg-[#243528] border-[#486B4F] text-[#D8EADB] ring-2 ring-[#486B4F]/40'
                        : 'bg-[#3E2424] border-[#8C3A32] text-[#EAD8D8] ring-2 ring-[#8C3A32]/40'
                      : 'bg-[#262626] border-[#3E3E3E] text-[#E0DDD5] hover:bg-[#303030] hover:border-[#D4A373]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span>{opt.label}</span>
                    {isSelected && (
                      <CheckCircle2 className={`w-4 h-4 ${opt.isOptimal ? 'text-[#72B37E]' : 'text-[#E07A70]'}`} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Reaction display */}
          {selectedDecision && (
            <div className={`p-4 rounded-2xl border text-xs leading-relaxed transition-all ${
              selectedDecision.isOptimal
                ? 'bg-[#243528]/60 border-[#486B4F]/60 text-[#D8EADB]'
                : 'bg-[#3E2D20]/60 border-[#8C6D4F]/60 text-[#EADBCE]'
            }`}>
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-[#D4A373]" />
                <div className="space-y-1">
                  <p className="font-semibold">{selectedDecision.reactionText}</p>
                  {selectedDecision.characterReaction && (
                    <p className="italic text-[#C5BDB0] font-mono text-[11px]">
                      {selectedDecision.characterReaction}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Scene 6: Technical Translation Component */}
      {scene.type === 'translation' && (
        <TechnicalTranslationView
          translations={lesson.technicalTranslations}
          storyMode={storyMode}
          onToggleMode={onToggleMode}
        />
      )}

      {/* Scene 7: Code Connection Component */}
      {scene.type === 'code' && (
        <CodeConnectionView
          fullPythonCode={lesson.fullPythonCode}
          mappings={lesson.storyToCodeMappings}
          storyMode={storyMode}
        />
      )}

      {/* Scene 8: Interactive Simulator Component */}
      {scene.type === 'interactive' && (
        <InteractiveSimulatorView simulator={lesson.interactiveSimulator} />
      )}

      {/* Scene 10: Recap Component */}
      {scene.type === 'recap' && (
        <RecapView recap={lesson.recapSummary} />
      )}

      {/* Scene 11: Challenge Component */}
      {scene.type === 'challenge' && (
        <ChallengeView
          challenge={lesson.challenge}
          onLessonCompleted={onLessonCompleted}
          isAlreadyCompleted={isLessonCompleted}
        />
      )}
    </div>
  );
};
