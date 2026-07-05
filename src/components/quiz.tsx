'use client';

import React, { useState } from 'react';
import { Check, X, RefreshCw, HelpCircle, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface QuizProps {
  question: string;
  options?: string[];
  answerIndex?: number;
  children?: React.ReactNode;
}

function renderOptionText(text: string) {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-mono text-sm border border-neutral-300/50 dark:border-neutral-700/50">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function Quiz({ question, options, answerIndex, children }: QuizProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const isMultipleChoice = options && options.length > 0 && typeof answerIndex === 'number';

  const handleSelect = (idx: number) => {
    if (selectedIdx !== null) return;
    setSelectedIdx(idx);
    setRevealed(true);
  };

  const handleToggleReveal = () => {
    setRevealed((prev) => !prev);
  };

  const handleReset = () => {
    setSelectedIdx(null);
    setRevealed(false);
  };

  const isCorrect = selectedIdx === answerIndex;

  return (
    <div className="relative border border-neutral-200 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-950/20 backdrop-blur-md p-6 rounded-2xl shadow-sm my-8 transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-700/80">
      {/* CSS style block for custom quiz animations */}
      <style jsx global>{`
        @keyframes quiz-shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-4px); }
          40%, 80% { transform: translateX(4px); }
        }
        @keyframes quiz-pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
        .quiz-shake {
          animation: quiz-shake 0.3s ease-in-out;
        }
        .quiz-pop {
          animation: quiz-pop 0.3s ease-in-out;
        }
      `}</style>

      {/* Header Info */}
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-kamranx-accent text-neutral-950 font-mono">
          {isMultipleChoice ? (
            <>
              <HelpCircle className="size-3.5 stroke-[2.5]" />
              Knowledge Check
            </>
          ) : (
            <>
              <Lightbulb className="size-3.5 stroke-[2.5]" />
              Concept Challenge
            </>
          )}
        </span>
        {isMultipleChoice && selectedIdx !== null && (
          <span
            className={cn(
              "text-xs font-semibold font-mono animate-fd-fade-in",
              isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
            )}
          >
            {isCorrect ? "Correct Answer!" : "Incorrect. See Explanation below."}
          </span>
        )}
      </div>

      {/* Question Text */}
      <h4 className="text-base md:text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-6 leading-relaxed">
        {renderOptionText(question)}
      </h4>

      {/* Interactive Multiple Choice Options */}
      {isMultipleChoice && options && (
        <div className="space-y-3 mb-6">
          {options.map((option, idx) => {
            const letter = String.fromCharCode(65 + idx);
            const isSelected = selectedIdx === idx;
            const isTargetCorrect = answerIndex === idx;
            
            let btnClass = "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100/50 dark:hover:bg-neutral-900/50 text-neutral-800 dark:text-neutral-200 hover:border-neutral-300 dark:hover:border-neutral-700";
            let badgeClass = "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700";
            
            if (selectedIdx !== null) {
              if (isSelected) {
                if (isCorrect) {
                  btnClass = "border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-900 dark:text-emerald-300 quiz-pop";
                  badgeClass = "bg-emerald-500 text-white dark:text-neutral-950 font-bold";
                } else {
                  btnClass = "border-red-500 bg-red-500/10 dark:bg-red-500/5 text-red-900 dark:text-red-300 quiz-shake";
                  badgeClass = "bg-red-500 text-white font-bold";
                }
              } else if (isTargetCorrect) {
                // Highlight the correct answer if the user picked wrong
                btnClass = "border-emerald-500/50 bg-emerald-500/5 text-emerald-800 dark:text-emerald-400";
                badgeClass = "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold";
              } else {
                // Dim other options
                btnClass = "border-neutral-200/50 dark:border-neutral-800/50 text-neutral-400 dark:text-neutral-600 opacity-60";
                badgeClass = "bg-neutral-100/50 dark:bg-neutral-800/50 text-neutral-400 dark:text-neutral-600";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={selectedIdx !== null}
                className={cn(
                  "w-full text-left p-4 rounded-xl border flex items-center justify-between transition-all duration-200 group font-normal text-sm md:text-base",
                  btnClass
                )}
              >
                <div className="flex items-center pr-4">
                  <span className={cn(
                    "size-7 rounded-full flex items-center justify-center text-xs font-bold mr-3.5 transition-colors shrink-0",
                    badgeClass
                  )}>
                    {letter}
                  </span>
                  <span className="leading-relaxed">{renderOptionText(option)}</span>
                </div>
                
                {/* Visual state icons */}
                {selectedIdx !== null && isSelected && (
                  <span className="shrink-0 ml-2">
                    {isCorrect ? (
                      <Check className="size-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <X className="size-5 text-red-600 dark:text-red-400" />
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Conceptual Question Button */}
      {!isMultipleChoice && (
        <button
          onClick={handleToggleReveal}
          className="mb-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 bg-transparent text-neutral-800 dark:text-neutral-200 hover:border-neutral-300 dark:hover:border-neutral-700"
        >
          {revealed ? "Hide Explanation" : "Reveal Explanation"}
        </button>
      )}

      {/* Explanation Section */}
      {revealed && (
        <div className="mt-4 pt-4 border-t border-dashed border-neutral-200 dark:border-neutral-800 animate-fd-fade-in">
          <div className="flex items-start gap-3 rounded-xl bg-neutral-100/60 dark:bg-neutral-900/30 p-4 border-l-4 border-kamranx-accent">
            <div className="size-6 rounded-full bg-kamranx-accent/20 flex items-center justify-center shrink-0 mt-0.5">
              <Lightbulb className="size-3.5 text-neutral-950 dark:text-kamranx-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                Explanation
              </h5>
              <div className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed space-y-2 prose dark:prose-invert max-w-none">
                {children}
              </div>
            </div>
          </div>
          
          {/* Try Again Button for Multiple Choice */}
          {isMultipleChoice && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400 transition-colors"
              >
                <RefreshCw className="size-3" />
                Reset & Try Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
