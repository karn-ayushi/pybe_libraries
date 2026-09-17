import React from 'react';
import { Check, Circle, Dot } from 'lucide-react';
import { Scene } from '../types';
import { sound } from '../utils/audio';

interface StoryMapProps {
  scenes: Scene[];
  currentSceneIndex: number;
  onSelectScene: (index: number) => void;
}

export const StoryMap: React.FC<StoryMapProps> = ({
  scenes,
  currentSceneIndex,
  onSelectScene
}) => {
  return (
    <div id="story-map-container" className="w-full bg-[#FDFCF6] border-b border-[#E9E5D9] py-2.5 px-4 overflow-x-auto shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-start sm:justify-between gap-1.5 min-w-max">
        {scenes.map((scene, idx) => {
          const isDone = idx < currentSceneIndex;
          const isActive = idx === currentSceneIndex;
          const isUpcoming = idx > currentSceneIndex;

          return (
            <button
              key={scene.id}
              id={`story-step-${idx}`}
              onClick={() => {
                sound.playClick();
                onSelectScene(idx);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#1A1A1A] text-[#FDFCF6] shadow-xs scale-105 border border-[#1A1A1A]'
                  : isDone
                  ? 'bg-[#EBF2EC] text-[#486B4F] hover:bg-[#DEEADC] border border-[#C8DEC9]'
                  : 'text-[#777] hover:text-[#1A1A1A] hover:bg-[#E9E5D9]/50'
              }`}
              title={`${scene.sceneNumber}. ${scene.title}`}
            >
              <span className="flex items-center justify-center">
                {isDone ? (
                  <Check className="w-3 h-3 text-[#486B4F] stroke-[3]" />
                ) : isActive ? (
                  <span className="w-2 h-2 rounded-full bg-[#D4A373] animate-pulse" />
                ) : (
                  <Circle className="w-2.5 h-2.5 text-[#AAA]" />
                )}
              </span>
              <span className="tracking-tight font-medium">
                {scene.type === 'problem' && 'Problem'}
                {scene.type === 'characters' && 'Characters'}
                {scene.type === 'conflict' && 'Conflict'}
                {scene.type === 'discovery' && 'Discovery'}
                {scene.type === 'solution' && 'Solution'}
                {scene.type === 'translation' && 'Translation'}
                {scene.type === 'code' && 'Python Code'}
                {scene.type === 'interactive' && 'Interactive Demo'}
                {scene.type === 'result' && 'Result'}
                {scene.type === 'recap' && 'Recap'}
                {scene.type === 'challenge' && 'Mini Challenge'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
