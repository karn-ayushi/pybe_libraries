import React, { useState, useEffect } from 'react';
import { ConversationLesson, RecentConversation, SoundSettings, ThemeMode } from './types';
import { MASTER_CONVERSATIONS, PANDAS_CONVERSATION } from './data/conversations';
import { ConversationHeader, AppView } from './components/ConversationHeader';
import { ConversationView } from './components/ConversationView';
import { LandingPage } from './components/LandingPage';
import { BugHuntView } from './components/BugHuntView';
import { PerformanceDuelView } from './components/PerformanceDuelView';
import { FlipCardsView } from './components/FlipCardsView';
import { InspectorView } from './components/InspectorView';
import { TopicPickerModal } from './components/TopicPickerModal';
import { GenerateTopicModal } from './components/GenerateTopicModal';
import { SettingsModal } from './components/SettingsModal';
import { getSoundSettings, toggleSoundEnabled, playSpeechSound } from './utils/audio';
import { getInitialTheme, applyTheme, toggleThemeMode } from './utils/theme';
import { StreakData, getStreakData, recordPractice, subscribeToStreak } from './utils/streak';
import {
  loadRecentConversations,
  saveRecentConversation,
  removeRecentConversation,
  clearRecentConversations,
  loadCustomLessons,
  saveCustomLesson
} from './utils/storage';

export function App() {
  const [lessons, setLessons] = useState<ConversationLesson[]>(MASTER_CONVERSATIONS);
  const [activeLesson, setActiveLesson] = useState<ConversationLesson>(PANDAS_CONVERSATION);
  const [activeTurnIndex, setActiveTurnIndex] = useState<number>(0);
  const [currentPhase, setCurrentPhase] = useState<import('./types').ConversationPhase>('problem');
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [recentConversations, setRecentConversations] = useState<RecentConversation[]>(() =>
    loadRecentConversations()
  );
  const [isTopicPickerOpen, setIsTopicPickerOpen] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [soundSettings, setSoundSettings] = useState<SoundSettings>(() => getSoundSettings());
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => getInitialTheme());
  const [streakData, setStreakData] = useState<StreakData>(() => getStreakData());

  // Apply theme class to documentElement whenever themeMode changes
  useEffect(() => {
    applyTheme(themeMode);
  }, [themeMode]);

  // Synchronize streak changes
  useEffect(() => {
    const unsubscribe = subscribeToStreak((updated) => {
      setStreakData(updated);
    });
    return () => unsubscribe();
  }, []);

  // Restore any persisted custom-generated lessons on load
  useEffect(() => {
    const savedCustoms = loadCustomLessons();
    if (savedCustoms.length > 0) {
      setLessons(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const toAdd = savedCustoms.filter(c => !existingIds.has(c.id));
        return [...toAdd, ...prev];
      });
    }
    setRecentConversations(loadRecentConversations());
  }, []);

  const handleStartConversation = (lesson: ConversationLesson, turnIndex: number = 0) => {
    setActiveLesson(lesson);
    setActiveTurnIndex(turnIndex);
    const validTurnIndex = Math.min(turnIndex, lesson.turns.length - 1);
    setCurrentPhase(lesson.turns[validTurnIndex]?.phase || 'problem');
    setCurrentView('conversation');
    const updated = saveRecentConversation(lesson, turnIndex);
    setRecentConversations(updated);
    // Record streak practice when entering a lesson
    recordPractice(lesson.topic);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResumeConversation = (lesson: ConversationLesson, turnIndex: number) => {
    handleStartConversation(lesson, turnIndex);
  };

  const handleRestartConversation = (lesson: ConversationLesson) => {
    handleStartConversation(lesson, 0);
  };

  const handleRemoveRecent = (lessonId: string) => {
    const updated = removeRecentConversation(lessonId);
    setRecentConversations(updated);
  };

  const handleClearAllRecents = () => {
    clearRecentConversations();
    setRecentConversations([]);
  };

  const handleSelectLesson = (lesson: ConversationLesson) => {
    handleStartConversation(lesson, 0);
  };

  const handleConversationGenerated = (newLesson: ConversationLesson) => {
    saveCustomLesson(newLesson);
    setLessons(prev => [newLesson, ...prev]);
    handleStartConversation(newLesson, 0);
  };

  const handleReturnToLanding = () => {
    setRecentConversations(loadRecentConversations());
    setCurrentView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateView = (view: AppView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTopicFromLab = (topicName: string) => {
    const match = lessons.find(
      l => l.topic.toLowerCase().includes(topicName.toLowerCase()) || 
           topicName.toLowerCase().includes(l.topic.toLowerCase())
    );
    if (match) {
      handleStartConversation(match, 0);
    } else {
      setIsTopicPickerOpen(true);
    }
  };

  const handleToggleSound = () => {
    const updated = toggleSoundEnabled();
    setSoundSettings({ ...updated });
    if (updated?.enabled) {
      playSpeechSound();
    }
  };

  const handleToggleTheme = () => {
    const next = toggleThemeMode(themeMode);
    setThemeMode(next);
  };

  return (
    <div className="min-h-screen bg-[#FDFCF7] dark:bg-[#121214] text-[#1A1A1A] dark:text-[#F4F4F5] flex flex-col font-sans antialiased selection:bg-[#F97316]/20 selection:text-[#EA580C] transition-colors duration-200">
      {/* Top Header */}
      <ConversationHeader
        currentTopicTitle={activeLesson.topic}
        currentPhase={currentPhase}
        onOpenTopicPicker={() => setIsTopicPickerOpen(true)}
        onOpenGenerator={() => setIsGeneratorOpen(true)}
        onGoHome={handleReturnToLanding}
        onOpenSettings={() => setIsSettingsOpen(true)}
        soundEnabled={Boolean(soundSettings?.enabled)}
        onToggleSound={handleToggleSound}
        themeMode={themeMode}
        onToggleTheme={handleToggleTheme}
        streakData={streakData}
        onPracticeClick={() => handleStartConversation(activeLesson, 0)}
        currentView={currentView}
        onNavigateView={handleNavigateView}
      />

      {/* Main Content Area: Landing Page, Conversation, or Interactive Practice Labs */}
      <main className="flex-1 flex flex-col justify-start">
        {currentView === 'landing' && (
          <LandingPage
            lessons={lessons}
            recentConversations={recentConversations}
            onResumeConversation={handleResumeConversation}
            onRestartConversation={handleRestartConversation}
            onRemoveRecent={handleRemoveRecent}
            onClearAllRecents={handleClearAllRecents}
            onStartConversation={(lesson) => handleStartConversation(lesson, 0)}
            onOpenGenerator={() => setIsGeneratorOpen(true)}
            onOpenTopicPicker={() => setIsTopicPickerOpen(true)}
            streakData={streakData}
            onNavigateView={handleNavigateView}
          />
        )}

        {currentView === 'conversation' && (
          <ConversationView
            lesson={activeLesson}
            initialTurnIndex={activeTurnIndex}
            onOpenTopicPicker={() => setIsTopicPickerOpen(true)}
            onOpenGenerator={() => setIsGeneratorOpen(true)}
            onPhaseChange={setCurrentPhase}
          />
        )}

        {currentView === 'bug-hunt' && (
          <BugHuntView
            onReturnHome={handleReturnToLanding}
            onSelectTopic={handleSelectTopicFromLab}
          />
        )}

        {currentView === 'performance-duel' && (
          <PerformanceDuelView
            onReturnHome={handleReturnToLanding}
          />
        )}

        {currentView === 'flip-cards' && (
          <FlipCardsView
            onReturnHome={handleReturnToLanding}
          />
        )}

        {currentView === 'inspector' && (
          <InspectorView
            onReturnHome={handleReturnToLanding}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#EAE4D5] dark:border-[#262630] py-6 px-4 text-center text-xs font-serif text-[#888] dark:text-[#A1A1AA] transition-colors">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-1.5 justify-center">
            <span>Made with patience, tea ☕ & care for Python friends</span>
            <span className="text-[#EA580C] dark:text-[#FB923C]">•</span>
            <span>Ayushi & Ayush are always discussing with you 🌸</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-[#666] dark:text-[#A1A1AA]">
            <button
              onClick={handleReturnToLanding}
              className="hover:text-[#EA580C] transition-colors cursor-pointer"
            >
              Lessons
            </button>
            <button
              onClick={() => handleNavigateView('bug-hunt')}
              className="hover:text-[#BE123C] transition-colors cursor-pointer"
            >
              Bug Hunt
            </button>
            <button
              onClick={() => handleNavigateView('performance-duel')}
              className="hover:text-[#EA580C] transition-colors cursor-pointer"
            >
              Speed Duel
            </button>
            <button
              onClick={() => handleNavigateView('flip-cards')}
              className="hover:text-[#DB2777] transition-colors cursor-pointer"
            >
              Flip Cards
            </button>
            <button
              onClick={() => handleNavigateView('inspector')}
              className="hover:text-[#7C3AED] transition-colors cursor-pointer"
            >
              Inspector
            </button>
            <button
              onClick={() => setIsTopicPickerOpen(true)}
              className="hover:text-[#EA580C] transition-colors cursor-pointer"
            >
              Topics ({lessons.length})
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-[#EC4899] transition-colors cursor-pointer"
            >
              Settings
            </button>
          </div>
        </div>
      </footer>

      {/* Sound Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => {
          setIsSettingsOpen(false);
          setSoundSettings(getSoundSettings());
          setThemeMode(getInitialTheme());
        }}
        settings={soundSettings}
        onUpdateSettings={(newSettings) => setSoundSettings(newSettings)}
        themeMode={themeMode}
        onToggleTheme={handleToggleTheme}
      />

      {/* Topic Switcher Modal */}
      <TopicPickerModal
        isOpen={isTopicPickerOpen}
        onClose={() => setIsTopicPickerOpen(false)}
        lessons={lessons}
        activeLessonId={activeLesson.id}
        onSelectLesson={handleSelectLesson}
        onOpenGenerator={() => setIsGeneratorOpen(true)}
      />

      {/* Custom Topic Generator Modal */}
      <GenerateTopicModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onConversationGenerated={handleConversationGenerated}
      />
    </div>
  );
}

export default App;

