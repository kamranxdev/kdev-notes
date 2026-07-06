'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, ChevronRight, CornerDownLeft, Play } from 'lucide-react';

interface TerminalProps {
  totalNotes: number;
  totalCategories: number;
}

interface CommandHistoryItem {
  command: string;
  output: React.ReactNode;
}

export default function Terminal({ totalNotes, totalCategories }: TerminalProps) {
  const [history, setHistory] = useState<CommandHistoryItem[]>([
    {
      command: 'welcome',
      output: (
        <div className="space-y-1">
          <p className="text-kamranx-accent font-bold">Kamran's Notes Shell [Version 1.0.0]</p>
          <p className="text-muted-foreground text-xs">(c) 2026 Kamran Khan. All rights reserved.</p>
          <p className="text-xs mt-2">
            Type <span className="text-yellow-400 font-bold">help</span> or click the quick commands below to explore.
          </p>
        </div>
      ),
    },
  ]);
  const [input, setInput] = useState('');
  const displayRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickCommands = ['help', 'note-stats', 'skills', 'about-kamran', 'clear'];

  const scrollToBottom = () => {
    if (displayRef.current) {
      displayRef.current.scrollTo({
        top: displayRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleCommand = (cmdText: string) => {
    const trimmedCmd = cmdText.trim().toLowerCase();
    if (!trimmedCmd) return;

    let output: React.ReactNode = null;

    switch (trimmedCmd) {
      case 'help':
        output = (
          <div className="grid grid-cols-1 gap-1 text-xs">
            <p className="text-kamranx-accent font-bold mb-1">Available commands:</p>
            <p><span className="text-yellow-400 font-bold w-28 inline-block">help</span> - Show this help menu</p>
            <p><span className="text-yellow-400 font-bold w-28 inline-block">note-stats</span> - Display current notes statistics</p>
            <p><span className="text-yellow-400 font-bold w-28 inline-block">skills</span> - List Kamran's core technologies</p>
            <p><span className="text-yellow-400 font-bold w-28 inline-block">about-kamran</span> - Learn more about the author</p>
            <p><span className="text-yellow-400 font-bold w-28 inline-block">clear</span> - Clear the terminal screen</p>
          </div>
        );
        break;

      case 'note-stats':
        output = (
          <div className="space-y-1 text-xs">
            <p className="text-emerald-400 font-bold">📋 Knowledge Base Stats:</p>
            <p>• Total Categories : <span className="text-white font-bold">{totalCategories} Sections</span></p>
            <p>• Total Note Pages : <span className="text-white font-bold">{totalNotes} Pages</span></p>
            <p>• Source Status    : <span className="text-emerald-400 font-bold">Active & Open Source</span></p>
            <p>• Content Quality  : <span className="text-emerald-400 font-bold">High (Analogy-Driven)</span></p>
          </div>
        );
        break;

      case 'skills':
        output = (
          <div className="space-y-1 text-xs">
            <p className="text-[#38bdf8] font-bold">⚡ Core Technologies:</p>
            <p>• <span className="text-white font-semibold">Languages:</span> TypeScript, JavaScript, Python, Java, SQL, HTML/CSS</p>
            <p>• <span className="text-white font-semibold">Frameworks:</span> React, Next.js, Node.js, Angular, Flutter, Tailwind</p>
            <p>• <span className="text-white font-semibold">Infrastructure:</span> AWS, Docker, Kubernetes, DevOps, CI/CD pipelines</p>
          </div>
        );
        break;

      case 'about-kamran':
        output = (
          <div className="space-y-1 text-xs leading-relaxed">
            <p className="text-[#c084fc] font-bold">👤 About Kamran Khan:</p>
            <p>Experienced Software Engineer & Full Stack Developer specializing in crafting premium, high-performance web applications, DevOps solutions, and scalable cloud architecture.</p>
            <div className="mt-2 flex flex-wrap gap-x-4 text-muted-foreground">
              <span>Portfolio: <a href="https://kamranx.dev" target="_blank" rel="noopener noreferrer" className="text-kamranx-accent underline hover:text-[#c9fd74]/80">kamranx.dev</a></span>
              <span>GitHub: <a href="https://github.com/kamranxdev" target="_blank" rel="noopener noreferrer" className="text-kamranx-accent underline hover:text-[#c9fd74]/80">@kamranxdev</a></span>
            </div>
          </div>
        );
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      default:
        output = (
          <p className="text-red-400 text-xs">
            Command not found: '{trimmedCmd}'. Type <span className="text-yellow-400 font-bold font-mono">help</span> for a list of commands.
          </p>
        );
    }

    setHistory((prev) => [...prev, { command: cmdText, output }]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    }
  };

  return (
    <div className="w-full flex flex-col rounded-2xl border-4 border-black dark:border-zinc-800 bg-[#0c1017] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.05)] overflow-hidden transition-all duration-300 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.08)]">
      {/* Terminal Title Bar */}
      <div className="bg-[#161b22] px-4 py-3 border-b-2 border-black dark:border-zinc-800 flex items-center justify-between select-none">
        <div className="flex gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] border border-black/10"></div>
          <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-black/10"></div>
          <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f] border border-black/10"></div>
        </div>
        <span className="font-mono text-xs text-zinc-400 font-bold flex items-center gap-1.5">
          <TerminalIcon className="w-3.5 h-3.5 text-kamranx-accent" />
          kamran@kamranxdev:~
        </span>
        <div className="w-14"></div> {/* spacer for centering */}
      </div>

      {/* Terminal Display */}
      <div 
        ref={displayRef}
        onClick={focusInput}
        className="flex-1 p-4 min-h-[220px] max-h-[300px] overflow-y-auto font-mono text-sm text-zinc-300 space-y-3 cursor-text scrollbar-thin scrollbar-thumb-zinc-800"
      >
        {history.map((item, idx) => (
          <div key={idx} className="space-y-1">
            {item.command !== 'welcome' && (
              <div className="flex items-center text-zinc-400">
                <ChevronRight className="w-4 h-4 text-emerald-500 mr-1 shrink-0" />
                <span className="text-kamranx-accent mr-2">kamranxdev</span>
                <span className="text-white">{item.command}</span>
              </div>
            )}
            <div className="pl-1">{item.output}</div>
          </div>
        ))}
      </div>

      {/* Terminal Input Bar */}
      <div className="bg-[#0c1017] px-4 py-2 border-t-2 border-black dark:border-zinc-800 flex items-center gap-2">
        <ChevronRight className="w-4 h-4 text-emerald-500 shrink-0" />
        <span className="text-kamranx-accent font-mono text-sm shrink-0">kamranxdev</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-white caret-kamranx-accent placeholder-zinc-600 focus:ring-0 focus:border-none py-1 px-0"
          placeholder="Type a command..."
          aria-label="Terminal input"
        />
        <button
          onClick={() => handleCommand(input)}
          className="p-1.5 rounded-lg bg-zinc-800 border border-zinc-700 hover:bg-kamranx-accent hover:text-black transition-colors"
          title="Run command"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Terminal Quick Actions */}
      <div className="bg-[#161b22] px-4 py-2 border-t-2 border-black dark:border-zinc-800 flex flex-wrap items-center gap-2 select-none">
        <span className="text-zinc-500 text-xs font-bold font-mono">Quick:</span>
        {quickCommands.map((cmd) => (
          <button
            key={cmd}
            onClick={() => handleCommand(cmd)}
            className="px-2.5 py-1 text-xs font-mono font-bold rounded bg-[#0c1017] hover:bg-[#c9fd74] hover:text-black border border-black text-zinc-300 dark:border-zinc-700 dark:hover:border-black transition-all flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"
          >
            <Play className="w-2.5 h-2.5 shrink-0 fill-current" />
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
}
