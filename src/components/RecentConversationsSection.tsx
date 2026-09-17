import React from 'react';
import { RecentConversation, ConversationLesson } from '../types';
import {
  Clock,
  ArrowRight,
  RotateCcw,
  Trash2,
  CheckCircle2,
  Sparkles,
  Play,
  X,
  BookmarkCheck
} from 'lucide-react';

interface RecentConversationsSectionProps {
  recentConversations: RecentConversation[];
  allLessons: ConversationLesson[];
  onResumeConversation: (lesson: ConversationLesson, turnIndex: number) => void;
  onRestartConversation: (lesson: ConversationLesson) => void;
  onRemoveRecent: (lessonId: string) => void;
  onClearAll: () => void;
  onQuickStart: (topicName: string) => void;
}

function formatRelativeTime(timestamp: number): string {
  if (!timestamp) return 'Recently';
  const diffMs = Date.now() - timestamp;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 45) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays}d ago`;
}

export const RecentConversationsSection: React.FC<RecentConversationsSectionProps> = ({
  recentConversations,
  allLessons,
  onResumeConversation,
  onRestartConversation,
  onRemoveRecent,
  onClearAll,
  onQuickStart
}) => {
  // Find full lesson object by ID or topic
  const resolveLesson = (recent: RecentConversation): ConversationLesson | null => {
    if (recent.customLesson) return recent.customLesson;
    const directMatch = allLessons.find(l => l.id === recent.lessonId);
    if (directMatch) return directMatch;
    const topicMatch = allLessons.find(
      l => l.topic.toLowerCase() === recent.topic.toLowerCase()
    );
    return topicMatch || null;
  };

  const hasRecents = recentConversations.length > 0;

  return (
    <section
      id="recent-conversations-section"
      aria-label="Recent Conversations"
      className="w-full max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-8"
    >
      <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF7F0] border border-[#E2DAC9] shadow-sm">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF4EB] border border-[#E8DCCB] text-xs font-serif text-[#8C6D4F]">
                <Clock className="w-3.5 h-3.5 text-[#D4A373]" />
                <span>Auto-Saved in Local Storage</span>
              </div>
              {hasRecents && (
                <span className="text-xs font-serif text-[#777]">
                  • {recentConversations.length} dialogue{recentConversations.length === 1 ? '' : 's'} on record
                </span>
              )}
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
              Recent Conversations
            </h2>
            <p className="font-serif text-xs sm:text-sm text-[#666] mt-0.5">
              Pick up right where you left off without searching.
            </p>
          </div>

          {/* Action buttons on header */}
          {hasRecents && (
            <div className="flex items-center gap-2 self-start sm:self-center">
              <button
                onClick={onClearAll}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FDFCF7] hover:bg-[#F2ECE1] border border-[#DDD7C8] text-[#888] hover:text-[#555] text-xs font-serif transition-colors cursor-pointer"
                title="Clear recent history"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear History</span>
              </button>
            </div>
          )}
        </div>

        {/* Card Grid */}
        {hasRecents ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentConversations.map((recent) => {
              const fullLesson = resolveLesson(recent);
              const totalTurns = recent.totalTurns || (fullLesson ? fullLesson.turns.length : 6);
              const turnIndex = typeof recent.currentTurnIndex === 'number' ? recent.currentTurnIndex : 0;
              const isFinished = recent.isFinished || turnIndex >= totalTurns;
              const completedCount = isFinished ? totalTurns : turnIndex;
              const percent = totalTurns > 0 ? Math.min(100, Math.round((completedCount / totalTurns) * 100)) : 0;

              return (
                <div
                  key={recent.lessonId}
                  className="p-5 rounded-2xl bg-[#FDFCF7] border border-[#E2DAC9] hover:border-[#D4A373] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group relative"
                >
                  {/* Top Bar: Category, Difficulty, Remove Button */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C6D4F] bg-[#FAF4EB] px-2 py-0.5 rounded border border-[#E8DCCB]">
                        {recent.category || 'Python'}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-medium font-serif text-[#888]">
                          {formatRelativeTime(recent.lastAccessedAt)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveRecent(recent.lessonId);
                          }}
                          className="p-1 rounded-md text-[#AAA] hover:text-[#C44] hover:bg-[#FEE] transition-colors cursor-pointer"
                          title="Remove from recents"
                          aria-label={`Remove ${recent.topic} from recents`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Topic Title */}
                    <div className="mb-2">
                      <h3 className="font-serif text-lg font-bold text-[#1A1A1A] group-hover:text-[#8C6D4F] transition-colors">
                        {recent.topic}
                      </h3>
                      <p className="text-xs font-serif text-[#666] line-clamp-1">
                        {recent.title}
                      </p>
                    </div>

                    {/* Progress Bar and Status */}
                    <div className="my-3 space-y-1.5 bg-[#FAF6EE] p-2.5 rounded-xl border border-[#ECE2D2]">
                      <div className="flex items-center justify-between text-[11px] font-serif">
                        <span className="font-medium text-[#555] flex items-center gap-1">
                          {isFinished ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#486B4F]" />
                              <span className="text-[#2F5236] font-bold">Dialogue Completed</span>
                            </>
                          ) : (
                            <>
                              <span className="w-2 h-2 rounded-full bg-[#D4A373] animate-pulse" />
                              <span className="font-semibold text-[#1A1A1A]">
                                Turn {turnIndex + 1} of {totalTurns}
                              </span>
                            </>
                          )}
                        </span>
                        <span className="font-mono text-[10px] font-bold text-[#8C6D4F]">
                          {percent}%
                        </span>
                      </div>

                      {/* Visual progress track */}
                      <div className="w-full h-2 bg-[#EAE4D5] rounded-full overflow-hidden shadow-inner">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isFinished
                              ? 'bg-[#486B4F]'
                              : 'bg-gradient-to-r from-[#D4A373] to-[#8C6D4F]'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions: Resume vs Restart */}
                  <div className="pt-3 border-t border-[#EFE8DA] flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        if (fullLesson) {
                          onRestartConversation(fullLesson);
                        } else {
                          onQuickStart(recent.topic);
                        }
                      }}
                      className="flex items-center gap-1 text-[11px] font-serif text-[#777] hover:text-[#1A1A1A] transition-colors cursor-pointer py-1 px-1.5 rounded hover:bg-[#F2ECE1]"
                      title="Start over from Turn 1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Restart</span>
                    </button>

                    <button
                      onClick={() => {
                        if (fullLesson) {
                          onResumeConversation(fullLesson, turnIndex);
                        } else {
                          onQuickStart(recent.topic);
                        }
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1A1A1A] hover:bg-[#D4A373] text-[#FDFCF7] hover:text-[#1A1A1A] text-xs font-serif font-bold transition-all shadow-xs cursor-pointer active:scale-98"
                    >
                      <span>{isFinished ? 'Review' : `Resume (Turn ${turnIndex + 1})`}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Clean Empty State */
          <div className="p-8 text-center bg-[#FDFCF7] border border-[#E5DFD0] rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF4EB] border border-[#E8DCCB] text-[#8C6D4F] flex items-center justify-center mx-auto">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="font-serif text-sm font-bold text-[#1A1A1A]">
                No recent conversations saved yet
              </p>
              <p className="font-serif text-xs text-[#666] max-w-md mx-auto leading-relaxed">
                As soon as you start a dialogue with Ayushi & Ayush, your active turn progress is automatically saved to your browser so you can jump back in anytime.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-serif text-[#777]">Quick start with:</span>
              {['Pandas', 'NumPy', 'PyTorch', 'Polars'].map((topic) => (
                <button
                  key={topic}
                  onClick={() => onQuickStart(topic)}
                  className="px-3 py-1 rounded-lg bg-[#FAF4EB] hover:bg-[#F2E8D7] text-[#8C6D4F] border border-[#E0D2C0] text-xs font-serif font-bold transition-all cursor-pointer shadow-2xs"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
