'use client';

import React, { createContext, useContext, useState } from 'react';
import { Code, FileText, Lock, Unlock, Eye } from 'lucide-react';
import { cn } from '@/lib/cn';

interface ProblemContextType {
  activeTab: 'problem' | 'solution';
  setActiveTab: (tab: 'problem' | 'solution') => void;
  revealed: boolean;
  setRevealed: (revealed: boolean) => void;
}

const ProblemContext = createContext<ProblemContextType | null>(null);

export interface ProblemProps {
  title: string;
  children?: React.ReactNode;
}

export function Problem({ title, children }: ProblemProps) {
  const [activeTab, setActiveTab] = useState<'problem' | 'solution'>('problem');
  const [revealed, setRevealed] = useState(false);

  return (
    <ProblemContext.Provider value={{ activeTab, setActiveTab, revealed, setRevealed }}>
      <div className="my-8 border border-neutral-200 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-950/20 backdrop-blur-md rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-700/80">
        
        {/* Header Section */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-neutral-100/40 dark:bg-neutral-900/10">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-kamranx-accent/15 flex items-center justify-center text-neutral-950 dark:text-kamranx-accent shrink-0 border border-kamranx-accent/20">
              <Code className="size-5" />
            </div>
            <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100 m-0">
              {title}
            </h4>
          </div>

          {/* Tabs */}
          <div className="flex items-center p-0.5 rounded-xl bg-neutral-200/50 dark:bg-neutral-800/50 border border-neutral-200/10 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('problem')}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-1.5",
                activeTab === 'problem'
                  ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-sm border border-neutral-200/50 dark:border-neutral-800/50"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
              )}
            >
              <FileText className="size-3.5" />
              Problem
            </button>
            <button
              onClick={() => setActiveTab('solution')}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-1.5",
                activeTab === 'solution'
                  ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-sm border border-neutral-200/50 dark:border-neutral-800/50"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
              )}
            >
              {revealed ? (
                <Unlock className="size-3.5 text-emerald-500" />
              ) : (
                <Lock className="size-3.5" />
              )}
              Solution
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </ProblemContext.Provider>
  );
}

export function ProblemDescription({ children }: { children: React.ReactNode }) {
  const context = useContext(ProblemContext);
  if (!context) return <>{children}</>;
  if (context.activeTab !== 'problem') return null;
  return <div className="animate-fd-fade-in">{children}</div>;
}

export function ProblemSolution({ children }: { children: React.ReactNode }) {
  const context = useContext(ProblemContext);
  if (!context) return <>{children}</>;
  if (context.activeTab !== 'solution') return null;
  
  if (!context.revealed) {
    return (
      <div className="mt-2 flex flex-col items-center justify-center p-8 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-100/30 dark:bg-neutral-900/10 text-center animate-fd-fade-in">
        <div className="size-12 rounded-full bg-kamranx-accent/10 dark:bg-kamranx-accent/5 flex items-center justify-center text-kamranx-accent mb-4 border border-kamranx-accent/20">
          <Lock className="size-6 text-neutral-950 dark:text-kamranx-accent" />
        </div>
        <h5 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          Solution is Locked
        </h5>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mb-6 leading-relaxed">
          Try to solve the challenge on your own first! When you are ready, reveal the solution.
        </p>
        <button
          onClick={() => context.setRevealed(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-kamranx-accent text-neutral-950 hover:bg-[#c9fd74]/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md shadow-kamranx-accent/10 border-2 border-black"
        >
          <Eye className="size-4" />
          Reveal Solution
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fd-fade-in space-y-4">
      {children}
      
      {/* Reset & Lock Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => {
            context.setRevealed(false);
            context.setActiveTab('problem');
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400 transition-colors"
        >
          <Lock className="size-3" />
          Lock & Return to Problem
        </button>
      </div>
    </div>
  );
}
