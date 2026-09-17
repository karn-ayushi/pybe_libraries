export type ConversationPhase = 'problem' | 'discovery' | 'explanation' | 'code' | 'practice';

export interface DialogueChoiceOption {
  id: string;
  label: string;
  learnerSpeechAfter?: string;
  guideReaction?: string;
  isOptimal?: boolean;
}

export interface InteractiveChoice {
  prompt: string;
  options: DialogueChoiceOption[];
}

export interface CodeSnippet {
  code: string;
  language?: string;
  filename?: string;
  caption?: string;
  explanation?: string;
  output?: string;
  runnable?: boolean;
}

export interface ConversationTurn {
  id: string;
  speaker: 'learner' | 'guide';
  phase: ConversationPhase;
  level?: 1 | 2 | 3 | 4; // 1: Human problem, 2: Analogy/Intuition, 3: Technical concept, 4: Code & execution
  text: string;
  secondaryNote?: string;
  codeSnippet?: CodeSnippet;
  interactiveChoice?: InteractiveChoice;
  reactionMood?: 'thinking' | 'confused' | 'curious' | 'aha' | 'explaining' | 'encouraging' | 'satisfied' | 'worried';
}

export interface PracticeQuestion {
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  takeaway: string;
}

export interface CharacterProfile {
  name: string;
  role: string;
  avatarEmoji: string;
  avatarBg?: string;
  bio?: string;
}

export interface ConversationLesson {
  id: string;
  slug: string;
  topic: string;
  title: string;
  tagline: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedMinutes: number;
  
  learner: CharacterProfile;
  guide: CharacterProfile;

  turns: ConversationTurn[];
  practiceQuestion?: PracticeQuestion;
  summaryTakeaway: {
    problem: string;
    intuition: string;
    technicalConcept: string;
    codePattern: string;
  };
}

export interface RecentConversation {
  lessonId: string;
  topic: string;
  title: string;
  tagline: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedMinutes: number;
  currentTurnIndex: number;
  totalTurns: number;
  isFinished: boolean;
  lastAccessedAt: number;
  customLesson?: ConversationLesson;
}

export interface UserConversationProgress {
  completedTopics: string[];
  currentTopicId: string;
  currentTurnIndex: number;
  userChoices: Record<string, string>; // turnId -> selected option id
  completedPractice: Record<string, boolean>; // topicId -> correct
}

export type SoundEffectType = 'soft-pop' | 'typewriter' | 'soft-chime';

export type ThemeMode = 'light' | 'dark';

export interface SoundSettings {
  enabled: boolean;
  soundEffect: SoundEffectType;
  volume: number; // 0.0 to 1.0
}

// Backward compatibility types for legacy components if referenced
export type CategoryType = string;
export type LessonCategory = string;
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type SceneType = string;

export interface Character {
  id: string;
  name: string;
  role: string;
  represents: string;
  whatTheyNeedToAccomplish: string;
  avatarEmoji: string;
  badgeColor?: string;
  quote?: string;
}

export interface TechnicalTranslation {
  storyCharacter: string;
  technicalConcept: string;
  storyExplanation: string;
  technicalExplanation: string;
  codeSnippet: string;
}

export interface StoryToCodeMapping {
  id: string;
  storyAction: string;
  programmingConcept: string;
  codeSnippet: string;
  highlightLineNumbers: number[];
  storyNote: string;
  technicalNote: string;
}

export interface Scene {
  id: string;
  sceneNumber: number;
  type: string;
  title: string;
  subtitle: string;
  storyText: string;
  technicalText: string;
  characterFocusId?: string;
  dialogue?: any[];
  decision?: any;
  visualMetaphor?: any;
  highlightCodeLines?: number[];
}

export interface InteractiveSimulatorConfig {
  title: string;
  description: string;
  sampleDatasetName: string;
  columns: any[];
  initialData: any[];
  controls: any[];
  pythonCodeTemplate: (params: Record<string, any>) => string;
  simulationLogic: (params: Record<string, any>, rawData: any[]) => any;
}

export interface LessonChallenge {
  question: string;
  scenarioContext: string;
  options: any[];
  conceptualTakeaway: string;
}

export interface Lesson {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  topic: string;
  category: string;
  difficulty: DifficultyLevel;
  estimatedMinutes: number;
  icon: string;
  jobRole?: any;
  realWorldProblem: any;
  characters: Character[];
  technicalTranslations: TechnicalTranslation[];
  fullPythonCode: string;
  storyToCodeMappings: StoryToCodeMapping[];
  scenes: Scene[];
  interactiveSimulator?: any;
  challenge?: any;
  recapSummary?: any;
}

export interface UserProgress {
  completedLessonIds: string[];
  currentLessonId?: string;
  currentSceneIndex?: number;
  storyMode: 'story' | 'technical';
  challengeScores: Record<string, { correct: boolean; attempts: number; timestamp: number }>;
  bookmarkedLessonIds: string[];
  completedCustomTopics: string[];
  streakDays: number;
}
