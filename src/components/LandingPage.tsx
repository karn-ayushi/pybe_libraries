import React, { useState, useMemo, useEffect } from 'react';
import { ConversationLesson, RecentConversation } from '../types';
import { CharacterAvatar } from './CharacterAvatar';
import { DashboardPlayground } from './DashboardPlayground';
import { RecentConversationsSection } from './RecentConversationsSection';
import { StreakBadge } from './StreakBadge';
import { WeeklyActivityChart } from './WeeklyActivityChart';
import { StudyCorner } from './StudyCorner';
import { StreakData, getStreakData, subscribeToStreak } from '../utils/streak';
import { playPlayfulPop } from '../utils/audio';
import {
  Sparkles,
  ArrowRight,
  Play,
  BookOpen,
  Clock,
  Code,
  Layers,
  Zap,
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  Compass,
  Cpu,
  BarChart3,
  Table,
  Terminal,
  Bug,
  Grid3X3
} from 'lucide-react';
import { AppView } from './ConversationHeader';

interface LandingPageProps {
  lessons: ConversationLesson[];
  recentConversations: RecentConversation[];
  onResumeConversation: (lesson: ConversationLesson, turnIndex: number) => void;
  onRestartConversation: (lesson: ConversationLesson) => void;
  onRemoveRecent: (lessonId: string) => void;
  onClearAllRecents: () => void;
  onStartConversation: (lesson: ConversationLesson) => void;
  onOpenGenerator: () => void;
  onOpenTopicPicker: () => void;
  streakData?: StreakData;
  onNavigateView?: (view: AppView) => void;
}

interface MatchmakerProblem {
  id: string;
  icon: string;
  label: string;
  targetTopic: string;
  ayushiProblem: string;
  ayushSolution: string;
  sampleCode: string;
}

const MATCHMAKER_PROBLEMS: MatchmakerProblem[] = [
  {
    id: 'math',
    icon: '⚡',
    label: 'Compute 1M matrix operations in milliseconds',
    targetTopic: 'NumPy',
    ayushiProblem: "My nested loops across 1M numbers freeze my CPU for 4 seconds.",
    ayushSolution: "Use NumPy! Contiguous C-memory and SIMD vectorization run it in 2ms.",
    sampleCode: "import numpy as np\ny = (x - x.mean()) / x.std()"
  },
  {
    id: 'data',
    icon: '🐼',
    label: 'Filter 50,000 messy customer spreadsheet rows',
    targetTopic: 'Pandas',
    ayushiProblem: "Excel keeps crashing when I filter 50,000 order rows.",
    ayushSolution: "Load it into a Pandas DataFrame and use Boolean Masking in one line.",
    sampleCode: "df_vip = df[df['spend'] > 10000]"
  },
  {
    id: 'viz',
    icon: '📈',
    label: 'Plot publication-ready research graphs',
    targetTopic: 'Matplotlib',
    ayushiProblem: "All I have are terminal numbers; stakeholders need clean graphs.",
    ayushSolution: "Use Matplotlib's Figure and Axes to plot reproducible charts with DPI 300.",
    sampleCode: "fig, ax = plt.subplots()\nax.plot(epochs, loss)"
  },
  {
    id: 'stats',
    icon: '🎨',
    label: 'Visualize multi-column statistical correlation heatmaps',
    targetTopic: 'Seaborn',
    ayushiProblem: "I have 20 columns and need to spot correlations without 50 scatter plots.",
    ayushSolution: "Seaborn's `heatmap(df.corr())` renders color-coded correlations instantly.",
    sampleCode: "sns.heatmap(df.corr(), annot=True)"
  },
  {
    id: 'ml',
    icon: '🤖',
    label: 'Predict customer churn with machine learning',
    targetTopic: 'Scikit-Learn',
    ayushiProblem: "Do I have to hand-code decision trees and split arrays manually?",
    ayushSolution: "Scikit-Learn gives you a unified API: train_test_split, .fit(), and .predict().",
    sampleCode: "model = RandomForestClassifier()\nmodel.fit(X_train, y_train)"
  },
  {
    id: 'ai',
    icon: '🧠',
    label: 'Train deep neural networks on GPU accelerators',
    targetTopic: 'PyTorch',
    ayushiProblem: "Calculating manual calculus derivatives across layers is impossible.",
    ayushSolution: "PyTorch Autograd records the computational graph and calculates gradients in one backward() call.",
    sampleCode: "loss = criterion(out, y)\nloss.backward()\noptimizer.step()"
  },
  {
    id: 'bigdata',
    icon: '⚡',
    label: 'Query a 15GB log file without RAM MemoryError',
    targetTopic: 'Polars',
    ayushiProblem: "Pandas runs out of memory on my 8GB laptop for our 15GB log file.",
    ayushSolution: "Polars runs on Rust with Lazy execution and multi-core query optimization.",
    sampleCode: "pl.scan_csv('logs.csv').filter(pl.col('err') > 0).collect()"
  },
  {
    id: 'api',
    icon: '🚀',
    label: 'Build an async backend API with auto-generated Swagger docs',
    targetTopic: 'FastAPI',
    ayushiProblem: "Writing manual type validation and Swagger markdown takes days.",
    ayushSolution: "FastAPI uses Python type hints for instant request validation and generates /docs for free.",
    sampleCode: "@app.post('/items')\nasync def create(item: ItemModel): ..."
  }
];

export const LandingPage: React.FC<LandingPageProps> = ({
  lessons,
  recentConversations,
  onResumeConversation,
  onRestartConversation,
  onRemoveRecent,
  onClearAllRecents,
  onStartConversation,
  onOpenGenerator,
  onOpenTopicPicker,
  streakData,
  onNavigateView
}) => {
  const featuredLesson = lessons[0]; // Pandas by default

  // Synchronize streak state
  const [currentStreak, setCurrentStreak] = useState<StreakData>(() => streakData || getStreakData());

  useEffect(() => {
    if (streakData) {
      setCurrentStreak(streakData);
    }
  }, [streakData]);

  useEffect(() => {
    const unsubscribe = subscribeToStreak((updated) => {
      setCurrentStreak(updated);
    });
    return () => unsubscribe();
  }, []);

  const handleQuickStartTopic = (topicName: string) => {
    const matched = lessons.find(
      l => l.topic.toLowerCase() === topicName.toLowerCase()
    );
    if (matched) {
      onStartConversation(matched);
    } else {
      onOpenTopicPicker();
    }
  };

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Matchmaker active problem state
  const [selectedMatchProblem, setSelectedMatchProblem] = useState<MatchmakerProblem>(MATCHMAKER_PROBLEMS[0]);

  // Interactive Avatar Click in Hero
  const [heroQuote, setHeroQuote] = useState<{ speaker: 'Ayushi' | 'Ayush'; quote: string } | null>(null);

  // Filter lessons
  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      const matchSearch =
        lesson.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory =
        selectedCategory === 'All' ||
        (selectedCategory === 'Data & Math' && ['Data Science', 'Scientific Computing', 'Advanced Data'].includes(lesson.category)) ||
        (selectedCategory === 'Visualization' && lesson.category === 'Visualization') ||
        (selectedCategory === 'Machine Learning & AI' && ['Machine Learning', 'Advanced AI'].includes(lesson.category)) ||
        (selectedCategory === 'Web & APIs' && lesson.category === 'Web & APIs');

      return matchSearch && matchCategory;
    });
  }, [lessons, searchQuery, selectedCategory]);

  // Find matchmaker lesson
  const matchedLesson = useMemo(() => {
    return lessons.find(l => l.topic.toLowerCase().includes(selectedMatchProblem.targetTopic.toLowerCase())) || lessons[0];
  }, [selectedMatchProblem, lessons]);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Section / Landing Page Header */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-8 pt-8 sm:pt-14 pb-8 sm:pb-12 flex flex-col items-center text-center">
        {/* Landing Page Header Top Row: Category Tag & Streak Tracker */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF5F7] dark:bg-[#251520] border border-[#FCE7F3] dark:border-[#521B3A] text-xs font-serif text-[#DB2777] dark:text-[#F472B6] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#EC4899]" />
            <span>Interactive Python Libraries Explorer</span>
          </div>

          {/* Simple Streak Tracker Badge in Landing Page Header */}
          <StreakBadge
            streakData={currentStreak}
            onPracticeClick={() => onStartConversation(featuredLesson)}
          />
        </div>

        {/* Display Headline */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#1A1A1A] dark:text-[#F4F4F5] tracking-tight max-w-3xl leading-[1.15] mb-5">
          Learn Python Through Real Conversations.
        </h1>

        {/* Subtitle */}
        <p className="font-serif text-base sm:text-lg md:text-xl text-[#666] dark:text-[#A1A1AA] max-w-2xl leading-relaxed mb-6">
          Follow friends <strong className="text-[#EC4899] dark:text-[#F472B6]">Ayushi</strong> and <strong className="text-[#F97316] dark:text-[#FB923C]">Ayush</strong> as they discuss real Python code, tracebacks, tensor dimensions, and library optimizations step by step.
        </p>

        {/* Playful Library Topic Quick Jump Chips */}
        <div className="w-full max-w-3xl flex flex-wrap items-center justify-center gap-2 mb-8">
          {[
            { topic: 'Pandas', emoji: '🐼' },
            { topic: 'NumPy', emoji: '⚡' },
            { topic: 'Matplotlib', emoji: '📊' },
            { topic: 'Seaborn', emoji: '🌊' },
            { topic: 'PyTorch', emoji: '🔥' },
            { topic: 'Polars', emoji: '🐻‍❄️' },
            { topic: 'FastAPI', emoji: '🚀' }
          ].map((item) => {
            const lessonMatch = lessons.find(l => l.topic.toLowerCase() === item.topic.toLowerCase());
            return (
              <button
                key={item.topic}
                onClick={() => {
                  playPlayfulPop();
                  if (lessonMatch) {
                    onStartConversation(lessonMatch);
                  } else {
                    onOpenTopicPicker();
                  }
                }}
                className="group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-[#FFFDFB] dark:bg-[#1E1E24] border border-[#FED7AA]/80 dark:border-[#4B291D] hover:border-[#F97316] dark:hover:border-[#EA580C] text-xs font-serif font-bold text-[#1A1A1A] dark:text-[#F4F4F5] transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
                title={`Jump into ${item.topic} dialogue`}
              >
                <span className="text-base group-hover:scale-125 transition-transform">{item.emoji}</span>
                <span>{item.topic}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Character Speech Trigger Hero Card */}
        <div className="w-full max-w-3xl rounded-3xl bg-[#FDFCF7] dark:bg-[#16161A] border border-[#FED7AA]/60 dark:border-[#52291B]/60 shadow-xl p-6 sm:p-8 mb-8 text-left relative overflow-hidden transition-colors">
          <div className="flex items-center justify-between border-b border-[#FCE7F3] dark:border-[#2E1D27] pb-4 mb-5">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#F97316] to-[#EC4899]" />
              <span className="font-serif text-xs uppercase tracking-widest font-bold text-[#EA580C] dark:text-[#FB923C]">
                Featured Dialogue: {featuredLesson.topic}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-serif text-[#777] dark:text-[#A1A1AA]">
              <Clock className="w-3.5 h-3.5" />
              <span>{featuredLesson.estimatedMinutes} min dialogue</span>
            </div>
          </div>

          {/* Dialogue Snippet with Clickable Avatars */}
          <div className="space-y-4">
            {/* Ayushi's line */}
            <div className="flex items-start gap-3.5">
              <div
                className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
                onClick={() => {
                  playPlayfulPop();
                  setHeroQuote({
                    speaker: 'Ayushi',
                    quote: "I used to write 40-line nested loops that froze my machine. Learning these libraries changed my whole workflow!"
                  });
                }}
                title="Click Ayushi for her personal thought"
              >
                <CharacterAvatar character="Ayushi" size="md" className="shrink-0 shadow-xs ring-2 ring-[#EC4899]/30" />
              </div>
              <div className="flex-1 bg-[#FFF5F7] dark:bg-[#23151F] border border-[#FCE7F3] dark:border-[#4B1E37] rounded-2xl rounded-tl-sm p-3.5 sm:p-4 text-sm font-serif text-[#1A1A1A] dark:text-[#F4F4F5] leading-relaxed transition-colors">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs">Ayushi</span>
                    <span className="text-xs">🌸</span>
                  </div>
                  <span className="text-[10px] text-[#999] dark:text-[#71717A] italic font-sans">Click avatar to chat</span>
                </div>
                "{featuredLesson.turns[0]?.text || 'Ayush, I have thousands of customer records. I need to find which customers spent more than ₹10,000.'}"
              </div>
            </div>

            {/* Ayush's line */}
            <div className="flex items-start gap-3.5 flex-row-reverse text-right">
              <div
                className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
                onClick={() => {
                  playPlayfulPop();
                  setHeroQuote({
                    speaker: 'Ayush',
                    quote: "The secret to Python speed is letting C-backed libraries like NumPy and Pandas handle the bulk memory layout."
                  });
                }}
                title="Click Ayush for his engineering tip"
              >
                <CharacterAvatar character="Ayush" size="md" className="shrink-0 shadow-xs ring-2 ring-[#F97316]/30" />
              </div>
              <div className="flex-1 bg-[#FFF7ED] dark:bg-[#241712] border border-[#FED7AA] dark:border-[#52291B] rounded-2xl rounded-tr-sm p-3.5 sm:p-4 text-sm font-serif text-[#1A1A1A] dark:text-[#F4F4F5] leading-relaxed text-left transition-colors">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] text-[#999] dark:text-[#71717A] italic font-sans">Click avatar to chat</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">☕</span>
                    <span className="font-bold text-xs">Ayush</span>
                  </div>
                </div>
                "{featuredLesson.turns[1]?.text || 'How are you doing it right now?'}"
              </div>
            </div>
          </div>

          {/* Interactive Pop Quote if avatar clicked */}
          {heroQuote && (
            <div className="mt-4 p-3 rounded-xl bg-[#FFF7ED] dark:bg-[#241712] border border-[#FED7AA] dark:border-[#52291B] text-xs font-serif text-[#C2410C] dark:text-[#FB923C] flex items-center justify-between gap-3 animate-fade-in">
              <div>
                <strong>{heroQuote.speaker}:</strong> "{heroQuote.quote}"
              </div>
              <button
                onClick={() => setHeroQuote(null)}
                className="text-[#EA580C] hover:text-[#C2410C] dark:text-[#FB923C] text-[10px] font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Call to action bar inside hero */}
          <div className="mt-6 pt-5 border-t border-[#FCE7F3] dark:border-[#2E1D27] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-serif text-[#666] dark:text-[#A1A1AA]">
              <MessageSquare className="w-4 h-4 text-[#F97316]" />
              <span>Step-by-step intuition → live runnable Python code</span>
            </div>
            <button
              onClick={() => onStartConversation(featuredLesson)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#F97316] to-[#EC4899] hover:from-[#EA580C] hover:to-[#DB2777] text-white font-serif text-sm font-bold transition-all shadow-md cursor-pointer active:scale-98"
            >
              <span>Join this Conversation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onStartConversation(featuredLesson)}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#F97316] to-[#EC4899] hover:from-[#EA580C] hover:to-[#DB2777] text-white font-serif text-sm font-bold transition-all shadow-lg cursor-pointer active:scale-98"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start with Pandas</span>
          </button>

          <button
            onClick={onOpenGenerator}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#FFF5F7] dark:bg-[#251520] hover:bg-[#FCE7F3] dark:hover:bg-[#34162B] text-[#DB2777] dark:text-[#F472B6] border border-[#FCE7F3] dark:border-[#4B1E37] font-serif text-sm font-bold transition-all cursor-pointer shadow-xs active:scale-98"
          >
            <Sparkles className="w-4 h-4 text-[#EC4899]" />
            <span>Generate Custom Library Topic</span>
          </button>
        </div>
      </section>

      {/* STUDY CORNER */}
      <StudyCorner />

      {/* WEEKLY ACTIVITY CONSISTENCY & LEARNING JOURNEY CHART */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-2 sm:py-4">
        <WeeklyActivityChart
          streakData={currentStreak}
          onPracticeClick={() => onStartConversation(featuredLesson)}
        />
      </section>

      {/* INTERACTIVE PRACTICE LABS & MENTAL MODELS HUBS (1, 2, 3, 4) */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF5F7] dark:bg-[#251520] border border-[#FCE7F3] dark:border-[#521B3A] text-xs font-serif text-[#DB2777] dark:text-[#F472B6] mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-[#EC4899]" />
              <span>Interactive Superpowers</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1A1A1A] dark:text-[#F4F4F5] tracking-tight">
              Interactive Practice Labs & Toolkits
            </h2>
            <p className="font-serif text-xs sm:text-sm text-[#666] dark:text-[#A1A1AA] mt-1 max-w-xl">
              Go beyond reading dialogues: diagnose production bugs, race vectorized algorithms in real time, flip cheat-sheet mental models, and reshape multidimensional tensors.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Bug Hunt */}
          <div
            onClick={() => {
              playPlayfulPop();
              onNavigateView?.('bug-hunt');
            }}
            className="p-5 rounded-3xl bg-[#FFFDFB] dark:bg-[#18181D] border-2 border-[#FED7AA]/80 dark:border-[#4B291D] hover:border-[#EF4444] dark:hover:border-[#EF4444] transition-all hover:-translate-y-1.5 shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFE4E6] dark:bg-[#3E161C] flex items-center justify-center text-[#BE123C] dark:text-[#FDA4AF] group-hover:scale-110 transition-transform">
                <Bug className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#BE123C] dark:text-[#FDA4AF] tracking-wider block">
                Diagnostic Mode
              </span>
              <h3 className="font-serif text-base font-bold text-[#1A1A1A] dark:text-[#F4F4F5] group-hover:text-[#BE123C] dark:group-hover:text-[#FDA4AF] transition-colors">
                Bug Hunt with Ayushi
              </h3>
              <p className="font-serif text-xs text-[#666] dark:text-[#A1A1AA] leading-relaxed">
                Ayushi hit classic Python library crashes! Diagnose the faulty line, select the fix, and test it in the terminal.
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs font-serif font-bold text-[#BE123C] dark:text-[#FDA4AF]">
              <span>Squash 5 Bugs</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Performance Duel */}
          <div
            onClick={() => {
              playPlayfulPop();
              onNavigateView?.('performance-duel');
            }}
            className="p-5 rounded-3xl bg-[#FFFDFB] dark:bg-[#18181D] border-2 border-[#FED7AA]/80 dark:border-[#4B291D] hover:border-[#EA580C] dark:hover:border-[#FB923C] transition-all hover:-translate-y-1.5 shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF0E6] dark:bg-[#341F16] flex items-center justify-center text-[#EA580C] dark:text-[#FB923C] group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#EA580C] dark:text-[#FB923C] tracking-wider block">
                Live Benchmark Lab
              </span>
              <h3 className="font-serif text-base font-bold text-[#1A1A1A] dark:text-[#F4F4F5] group-hover:text-[#EA580C] dark:group-hover:text-[#FB923C] transition-colors">
                Vectorized vs Loops
              </h3>
              <p className="font-serif text-xs text-[#666] dark:text-[#A1A1AA] leading-relaxed">
                Race interpreted Python loops against SIMD NumPy, Polars, and PyTorch GEMM on 100,000 synthetic elements!
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs font-serif font-bold text-[#EA580C] dark:text-[#FB923C]">
              <span>Launch Duel Arena</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Mental Model Flip Cards */}
          <div
            onClick={() => {
              playPlayfulPop();
              onNavigateView?.('flip-cards');
            }}
            className="p-5 rounded-3xl bg-[#FFFDFB] dark:bg-[#18181D] border-2 border-[#FED7AA]/80 dark:border-[#4B291D] hover:border-[#EC4899] dark:hover:border-[#F472B6] transition-all hover:-translate-y-1.5 shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FDF2F8] dark:bg-[#351525] flex items-center justify-center text-[#DB2777] dark:text-[#F472B6] group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#DB2777] dark:text-[#F472B6] tracking-wider block">
                Cheat Sheet Cards
              </span>
              <h3 className="font-serif text-base font-bold text-[#1A1A1A] dark:text-[#F4F4F5] group-hover:text-[#DB2777] dark:group-hover:text-[#F472B6] transition-colors">
                Mental Model Cards
              </h3>
              <p className="font-serif text-xs text-[#666] dark:text-[#A1A1AA] leading-relaxed">
                Master confusing pairs: <code className="font-mono">.loc</code> vs <code className="font-mono">.iloc</code>, <code className="font-mono">view()</code> vs <code className="font-mono">reshape()</code>, and <code className="font-mono">axis=0</code> vs <code className="font-mono">axis=1</code>.
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs font-serif font-bold text-[#DB2777] dark:text-[#F472B6]">
              <span>Explore Flip Cards</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Tensor & DataFrame Inspector */}
          <div
            onClick={() => {
              playPlayfulPop();
              onNavigateView?.('inspector');
            }}
            className="p-5 rounded-3xl bg-[#FFFDFB] dark:bg-[#18181D] border-2 border-[#FED7AA]/80 dark:border-[#4B291D] hover:border-[#8B5CF6] dark:hover:border-[#A78BFA] transition-all hover:-translate-y-1.5 shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F5F3FF] dark:bg-[#25183E] flex items-center justify-center text-[#7C3AED] dark:text-[#C084FC] group-hover:scale-110 transition-transform">
                <Grid3X3 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#7C3AED] dark:text-[#C084FC] tracking-wider block">
                Visual Matrix Lab
              </span>
              <h3 className="font-serif text-base font-bold text-[#1A1A1A] dark:text-[#F4F4F5] group-hover:text-[#7C3AED] dark:group-hover:text-[#C084FC] transition-colors">
                Tensor & Data Slicer
              </h3>
              <p className="font-serif text-xs text-[#666] dark:text-[#A1A1AA] leading-relaxed">
                Tactile sliders for 4D PyTorch tensor shapes, memory strides, and interactive Pandas DataFrame row/column slicing.
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs font-serif font-bold text-[#7C3AED] dark:text-[#C084FC]">
              <span>Open Inspector</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* RECENT CONVERSATIONS (PERSISTED IN LOCAL STORAGE) */}
      <RecentConversationsSection
        recentConversations={recentConversations}
        allLessons={lessons}
        onResumeConversation={onResumeConversation}
        onRestartConversation={onRestartConversation}
        onRemoveRecent={onRemoveRecent}
        onClearAll={onClearAllRecents}
        onQuickStart={handleQuickStartTopic}
      />

      {/* PLAYFUL INTERACTIVE TOY: DASHBOARD PLAYGROUND */}
      <DashboardPlayground
        lessons={lessons}
        onStartLesson={onStartConversation}
      />

      {/* PLAYFUL FEATURE 2: PYTHON LIBRARY MATCHMAKER */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <div className="p-6 sm:p-10 rounded-3xl bg-[#FFFDFB] dark:bg-[#18181D] border-2 border-[#FED7AA]/70 dark:border-[#52291B]/80 shadow-md">
          <div className="max-w-2xl mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF5F7] dark:bg-[#251520] border border-[#FCE7F3] dark:border-[#521B3A] text-xs font-serif text-[#DB2777] dark:text-[#F472B6] mb-3">
              <Compass className="w-3.5 h-3.5 text-[#EC4899]" />
              <span>Interactive Decision Matchmaker</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">
              What real problem are you trying to solve?
            </h2>
            <p className="font-serif text-xs sm:text-sm text-[#666] dark:text-[#A1A1AA] mt-1">
              Select your immediate coding bottleneck below to see which Python library Ayush recommends:
            </p>
          </div>

          {/* Interactive Problem Buttons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mb-8">
            {MATCHMAKER_PROBLEMS.map((prob) => {
              const isSelected = selectedMatchProblem.id === prob.id;
              return (
                <button
                  key={prob.id}
                  onClick={() => {
                    playPlayfulPop();
                    setSelectedMatchProblem(prob);
                  }}
                  className={`p-3.5 rounded-2xl text-left font-serif transition-all cursor-pointer border flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#F97316] to-[#EC4899] text-white border-transparent shadow-md scale-[1.02]'
                      : 'bg-[#FFFDFE] dark:bg-[#202028] hover:bg-[#FFF7ED] dark:hover:bg-[#29221D] text-[#1A1A1A] dark:text-[#F4F4F5] border-[#FED7AA]/60 dark:border-[#383846]'
                  }`}
                >
                  <span className="text-lg">{prob.icon}</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold block leading-snug truncate">
                      {prob.targetTopic}
                    </span>
                    <span className={`text-[11px] block mt-0.5 line-clamp-2 ${isSelected ? 'text-white/90' : 'text-[#666] dark:text-[#A1A1AA]'}`}>
                      {prob.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Matchmaker Recommendation Detail Card */}
          <div className="p-6 rounded-2xl bg-[#FFFDFE] dark:bg-[#202028] border border-[#FED7AA] dark:border-[#3E2419] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase font-bold tracking-widest bg-[#FFF7ED] dark:bg-[#341F16] text-[#EA580C] dark:text-[#FB923C] px-3 py-1 rounded-md border border-[#FED7AA] dark:border-[#5A2C1B]">
                  Recommended: {selectedMatchProblem.targetTopic}
                </span>
                <span className="text-xs font-serif text-[#777] dark:text-[#A1A1AA]">
                  {matchedLesson.difficulty} • {matchedLesson.estimatedMinutes} min dialogue
                </span>
              </div>

              {/* Quotes */}
              <div className="space-y-1.5 text-xs sm:text-sm font-serif">
                <p className="text-[#666] dark:text-[#A1A1AA]">
                  <strong className="text-[#DB2777] dark:text-[#F472B6]">Ayushi's Hurdle:</strong> "{selectedMatchProblem.ayushiProblem}"
                </p>
                <p className="text-[#1A1A1A] dark:text-[#F4F4F5]">
                  <strong className="text-[#EA580C] dark:text-[#FB923C]">Ayush's Advice:</strong> "{selectedMatchProblem.ayushSolution}"
                </p>
              </div>

              {/* Code preview */}
              <div className="p-2.5 rounded-xl bg-[#1A1A1A] text-[#FDFCF7] font-mono text-xs border border-[#333]">
                {selectedMatchProblem.sampleCode}
              </div>
            </div>

            <div className="w-full md:w-auto shrink-0 flex flex-col items-stretch md:items-end gap-2">
              <button
                onClick={() => onStartConversation(matchedLesson)}
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#F97316] to-[#EC4899] hover:from-[#EA580C] hover:to-[#DB2777] text-white font-serif text-xs font-bold transition-all shadow-md cursor-pointer active:scale-98"
              >
                <span>Launch {matchedLesson.topic} Dialogue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <span className="text-[10px] text-[#888] dark:text-[#A1A1AA] font-serif text-center md:text-right">
                Includes interactive choice & runnable code
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CURATED PYTHON LIBRARIES DIRECTORY */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        {/* Header and Filter Controls */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF7ED] dark:bg-[#2A1B14] border border-[#FED7AA] dark:border-[#4B291D] text-xs font-serif text-[#EA580C] dark:text-[#FB923C] mb-3">
              <BookOpen className="w-3.5 h-3.5 text-[#F97316]" />
              <span>Core & Advanced Libraries</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] dark:text-[#F4F4F5]">
              Explore Python Libraries
            </h2>
            <p className="text-xs sm:text-sm text-[#666] dark:text-[#A1A1AA] font-serif italic mt-1">
              Select any library dialogue to start learning with Ayushi & Ayush.
            </p>
          </div>

          {/* Search bar */}
          <div className="w-full md:w-72 relative">
            <Search className="w-4 h-4 text-[#888] dark:text-[#A1A1AA] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search library (e.g. PyTorch, Polars)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#FDFCF7] dark:bg-[#1E1E24] border border-[#FED7AA]/60 dark:border-[#383846] text-xs font-serif text-[#1A1A1A] dark:text-[#F4F4F5] focus:outline-none focus:border-[#EC4899] shadow-xs"
            />
          </div>
        </div>

        {/* Ecosystem Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
          {[
            'All',
            'Data & Math',
            'Visualization',
            'Machine Learning & AI',
            'Web & APIs'
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                playPlayfulPop();
                setSelectedCategory(cat);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-serif font-bold transition-all cursor-pointer shrink-0 border ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-[#F97316] to-[#EC4899] text-white border-transparent shadow-xs'
                  : 'bg-[#FDFCF7] dark:bg-[#1E1E24] hover:bg-[#FFF7ED] dark:hover:bg-[#28221D] text-[#666] dark:text-[#A1A1AA] border-[#E5DFD0] dark:border-[#383846]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Library Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredLessons.map((lesson) => (
            <div
              key={lesson.id}
              onClick={() => onStartConversation(lesson)}
              className="group p-6 rounded-3xl bg-[#FFFDFB] dark:bg-[#18181D] hover:bg-[#FFF9F2] dark:hover:bg-[#221C18] border border-[#E2DAC9] dark:border-[#32323E] hover:border-[#F97316]/60 dark:hover:border-[#EA580C]/70 shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Top badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#EA580C] dark:text-[#FB923C] bg-[#FFF7ED] dark:bg-[#341F16] px-2.5 py-1 rounded-md border border-[#FED7AA] dark:border-[#52291B]">
                    {lesson.category}
                  </span>
                  <div className="flex items-center gap-2 text-xs font-serif text-[#777] dark:text-[#A1A1AA]">
                    <span className="px-2 py-0.5 rounded-md bg-[#FFF0E6] dark:bg-[#2E1810] text-[#C2410C] dark:text-[#FB923C] text-[10px] font-semibold">
                      {lesson.difficulty}
                    </span>
                    <span>{lesson.estimatedMinutes} min</span>
                  </div>
                </div>

                {/* Title and Tagline */}
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1A1A1A] dark:text-[#F4F4F5] group-hover:text-[#EA580C] dark:group-hover:text-[#FB923C] transition-colors mb-2">
                  {lesson.topic}
                </h3>
                <p className="font-serif text-xs sm:text-sm text-[#555] dark:text-[#A1A1AA] leading-relaxed line-clamp-2 mb-4">
                  {lesson.tagline}
                </p>
              </div>

              {/* Card Footer with Avatars and Action */}
              <div className="pt-4 border-t border-[#EAE4D5] dark:border-[#2C2C36] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <CharacterAvatar character="Ayushi" size="xs" className="ring-2 ring-[#FFFDFB] dark:ring-[#18181D]" />
                    <CharacterAvatar character="Ayush" size="xs" className="ring-2 ring-[#FFFDFB] dark:ring-[#18181D]" />
                  </div>
                  <span className="text-xs font-serif text-[#777] dark:text-[#A1A1AA] italic">
                    Ayushi & Ayush
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-[#1A1A1A] dark:text-[#F4F4F5] group-hover:text-[#EC4899] dark:group-hover:text-[#F472B6] transition-colors">
                  <span>Start dialogue</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredLessons.length === 0 && (
          <div className="p-12 text-center bg-[#FDFCF7] border border-[#E5DFD0] rounded-3xl space-y-3">
            <p className="font-serif text-sm text-[#666]">
              No Python libraries found matching "<strong>{searchQuery}</strong>".
            </p>
            <button
              onClick={onOpenGenerator}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F97316] to-[#EC4899] hover:from-[#EA580C] hover:to-[#DB2777] text-white text-xs font-bold font-serif cursor-pointer shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Generate Dialogue for "{searchQuery}"</span>
            </button>
          </div>
        )}
      </section>

      {/* AI CUSTOM LIBRARY SYNTHESIZER */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-8 pb-16">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#1A1A1A] text-[#FDFCF7] border border-[#333] shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2A2A2A] border border-[#444] text-xs font-serif text-[#F472B6]">
              <Sparkles className="w-3.5 h-3.5 text-[#EC4899]" />
              <span>AI Python Library Synthesizer</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FDFCF7]">
              Want to learn any other Python library?
            </h2>

            <p className="text-xs sm:text-sm font-serif text-[#BBB] leading-relaxed">
              Type in any specialized Python library (e.g. <em>Beautiful Soup, SciPy, Pydantic, SQLAlchemy, Celery, OpenCV, Altair, Typer, Transformers</em>). We'll generate an interactive technical dialogue between Ayushi and Ayush with runnable code in seconds.
            </p>

            <div className="pt-2">
              <button
                onClick={onOpenGenerator}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#F97316] to-[#EC4899] hover:from-[#EA580C] hover:to-[#DB2777] text-white font-bold font-serif text-sm transition-all cursor-pointer shadow-md active:scale-98"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Generate Custom Library Conversation</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
