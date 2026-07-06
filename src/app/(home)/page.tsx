import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Kamran Khan's Technical Notes - Web, Mobile, Databases & Systems",
  description: "A detailed repository of reference guides, syntax cheat sheets, and technical writeups. Every explanation focuses on the \"why\" behind concepts.",
};

import { source } from '@/lib/source';
import Terminal from '@/components/Terminal';
import {
  BookOpen,
  Globe,
  Cpu,
  Database,
  Smartphone,
  Layers,
  ArrowRight,
  ChevronRight,
  Sparkles,
  FileText,
  Code2
} from 'lucide-react';

export default function HomePage() {
  const pages = source.getPages();
  const totalNotes = pages.length;

  // Group pages count and define category details
  const categoriesList = [
    {
      slug: 'web-fundamentals',
      title: 'Web Fundamentals',
      description: 'HTML5, CSS layout systems, Core JavaScript, Web API architectures.',
      bgClass: 'bg-rose-500/5 dark:bg-rose-500/10 border-rose-500/30 dark:border-rose-500/20 text-rose-600 dark:text-rose-400',
      tagColor: 'bg-rose-500 text-white',
      icon: FileText,
      count: pages.filter(p => p.url.includes('/web-fundamentals')).length
    },
    {
      slug: 'web-frameworks',
      title: 'Web Frameworks',
      description: 'React component designs, Angular reactivity, modern frameworks.',
      bgClass: 'bg-sky-500/5 dark:bg-sky-500/10 border-sky-500/30 dark:border-sky-500/20 text-sky-600 dark:text-sky-400',
      tagColor: 'bg-sky-500 text-white',
      icon: Code2,
      count: pages.filter(p => p.url.includes('/web-frameworks')).length
    },
    {
      slug: 'mobile-development',
      title: 'Mobile Development',
      description: 'Flutter state management, React Native modules, cross-platform engines.',
      bgClass: 'bg-purple-500/5 dark:bg-purple-500/10 border-purple-500/30 dark:border-purple-500/20 text-purple-600 dark:text-purple-400',
      tagColor: 'bg-purple-500 text-white',
      icon: Smartphone,
      count: pages.filter(p => p.url.includes('/mobile-development')).length
    },
    {
      slug: 'database',
      title: 'Databases & SQL',
      description: 'Relational design, indexing, custom triggers, advanced PL/SQL engines.',
      bgClass: 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/30 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
      tagColor: 'bg-emerald-500 text-white',
      icon: Database,
      count: pages.filter(p => p.url.includes('/database')).length
    },
    {
      slug: 'programming',
      title: 'Programming Languages',
      description: 'Java OOP models, memory management, compile-time systems.',
      bgClass: 'bg-orange-500/5 dark:bg-orange-500/10 border-orange-500/30 dark:border-orange-500/20 text-orange-600 dark:text-orange-400',
      tagColor: 'bg-orange-500 text-white',
      icon: Cpu,
      count: pages.filter(p => p.url.includes('/programming')).length
    },
  ];

  // Systems and Integration has standalone root notes
  const systemsCount = pages.filter(p => p.url.endsWith('unix-linux') || p.url.endsWith('rest-json-xml')).length;

  categoriesList.push({
    slug: 'systems',
    title: 'Systems & Integrations',
    description: 'Unix shell syntax, Linux fundamentals, REST API specs, JSON/XML pipelines.',
    bgClass: 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/30 dark:border-amber-500/20 text-amber-600 dark:text-amber-400',
    tagColor: 'bg-amber-500 text-black font-bold',
    icon: Layers,
    count: systemsCount
  });

  const totalCategories = categoriesList.length;

  // Filter core featured notes for showcase (Overview page has slug empty or overview)
  const featuredNotes = pages.filter(p =>
    p.url.endsWith('unix-linux') ||
    p.url.endsWith('database/sql') ||
    p.url.endsWith('web-frameworks/react') ||
    p.url.endsWith('web-fundamentals/javascript')
  ).slice(0, 4);

  return (
    <div className="flex flex-col flex-1 w-full bg-background text-foreground py-12 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto space-y-20">

      {/* 1. Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8">

        {/* Left Column - Hero Text */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8 flex flex-col justify-center text-center lg:text-left relative">

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-foreground leading-none">
              <span className="block text-muted-foreground text-lg sm:text-xl font-bold uppercase tracking-widest mb-2">
                Knowledge Base & Documentation
              </span>
              <span className="block mb-2">Kamran Khan's</span>
              <span className="block bg-kamranx-accent text-black border-4 border-black px-5 py-2 inline-block rounded-2xl neo-shadow rotate-[-1deg] select-none text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                Technical Notes
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal text-base sm:text-lg md:text-xl">
            A detailed repository of reference guides, syntax cheat sheets, and technical writeups. Every explanation focuses on the <span className="text-foreground font-black underline decoration-kamranx-accent decoration-3">"why"</span> behind concepts, using clear analogies and production-grade examples.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2 w-full sm:w-auto flex-wrap">
            <Link
              href="/docs"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FFD700] hover:bg-[#FFD700]/95 text-black border-2 border-black px-8 py-4 rounded-full font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:scale-95 transition-all duration-150 text-base"
            >
              <BookOpen className="w-5 h-5 shrink-0" />
              Explore Notes
            </Link>
            <a
              href="https://kamranx.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-background hover:bg-zinc-100 dark:hover:bg-zinc-800 text-foreground border-2 border-black dark:border-zinc-700 px-8 py-4 rounded-full font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.05)] hover:translate-x-[2px] hover:translate-y-[2px] active:scale-95 transition-all duration-150 text-base"
            >
              <Globe className="w-5 h-5 shrink-0" />
              Main Portfolio
            </a>
          </div>
        </div>

        {/* Right Column - Terminal Sandbox & Badges */}
        <div className="lg:col-span-5 w-full flex flex-col justify-center relative mt-8 lg:mt-0 px-2 sm:px-4">

          {/* Interactive Terminal */}
          <Terminal totalNotes={totalNotes} totalCategories={totalCategories} />
        </div>
      </section>

      {/* 2. Hot Search Terms Suggestion bar */}
      <section className="bg-card border-4 border-black dark:border-zinc-800 p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.03)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 shrink-0">
          <span className="p-2 rounded-lg bg-kamranx-accent text-black border-2 border-black font-bold text-xs select-none">HOT TOPICS</span>
          <p className="font-bold text-sm">Commonly Searched Guides:</p>
        </div>
        <div className="flex flex-wrap gap-2 justify-center md:justify-end">
          {[
            { label: 'Linux Shell Commands', link: '/docs/unix-linux' },
            { label: 'React Architecture', link: '/docs/web-frameworks/react' },
            { label: 'SQL Deep Dive', link: '/docs/database/sql' },
            { label: 'Flutter Basics', link: '/docs/mobile-development/flutter' },
            { label: 'JavaScript Closures', link: '/docs/web-fundamentals/javascript' }
          ].map((topic) => (
            <Link
              key={topic.label}
              href={topic.link}
              className="px-3.5 py-1.5 text-xs font-mono border-2 border-black dark:border-zinc-700 bg-background hover:bg-kamranx-accent hover:text-black transition-colors rounded-lg font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"
            >
              #{topic.label}
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Categories Grid */}
      <section className="space-y-8">
        <div className="text-center lg:text-left">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
            Explore Categories
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
            Browse through organized folders, featuring visual examples, key concepts, quizzes, and code definitions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesList.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={`/docs/${cat.slug === 'systems' ? 'unix-linux' : cat.slug}`}
                className="group flex flex-col bg-card border-4 border-black dark:border-zinc-800 rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.03)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.06)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200"
              >
                {/* Header Banner */}
                <div className={`p-4 border-b-4 border-black dark:border-zinc-800 flex items-center justify-between ${cat.bgClass}`}>
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="font-black text-sm uppercase tracking-wider">{cat.title}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-lg font-bold border-2 border-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] select-none shrink-0 ${cat.tagColor}`}>
                    {cat.count} {cat.count === 1 ? 'Note' : 'Notes'}
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {cat.description}
                  </p>

                  <span className="inline-flex items-center text-xs font-black uppercase text-foreground group-hover:text-kamranx-accent transition-colors gap-1.5 self-start pt-2">
                    View Notes
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Featured Updates & Cheat Sheets */}
      {featuredNotes.length > 0 && (
        <section className="space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
              Featured Study Sheets
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
              Quick access to some of the most comprehensive reference notes available in this knowledge base.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredNotes.map((note) => (
              <Link
                key={note.url}
                href={note.url}
                className="group p-6 bg-card border-4 border-black dark:border-zinc-800 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.03)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.06)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-muted-foreground uppercase">
                    <span>Note Page</span>
                    <span>•</span>
                    <span className="text-kamranx-accent font-black">Ready</span>
                  </div>
                  <h3 className="text-xl font-black group-hover:text-kamranx-accent transition-colors">
                    {note.data.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {note.data.description || "Interactive deep dive with code explanations, diagrams, common pitfalls, and review quizzes."}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t-2 border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs font-black uppercase text-foreground">
                  <span>Open Cheat Sheet</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 5. CTA / Ecosystem Bridge */}
      <section className="relative rounded-2xl bg-kamranx-accent dark:bg-[#161b22] text-black dark:text-zinc-100 p-8 md:p-12 overflow-hidden border-4 border-black dark:border-zinc-800 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.05)] transition-all duration-300">
        
        {/* Decorative Grid Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
          {/* Left Column: Content */}
          <div className="lg:col-span-8 space-y-5 text-left">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black dark:bg-kamranx-accent text-kamranx-accent dark:text-black font-black uppercase tracking-wider text-[10px] sm:text-xs select-none border-2 border-black">
              ⚡ GET IN TOUCH
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none text-black dark:text-white">
              Need custom solutions or want to collaborate?
            </h2>
            <p className="text-black/80 dark:text-zinc-400 text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
              Head back to my main portfolio at <a href="https://kamranx.dev" target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-black/70 dark:hover:text-white">kamranx.dev</a> to review my project work timeline, see detailed summaries, or interact with my custom AI agent. I am always open to discussing new projects, system architectures, or full-stack engineering collaborations.
            </p>
          </div>

          {/* Right Column: Actions */}
          <div className="lg:col-span-4 flex flex-col gap-3.5 w-full">
            <a 
              href="https://kamranx.dev" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-black dark:bg-kamranx-accent text-kamranx-accent dark:text-black hover:opacity-90 border-2 border-black px-6 py-3.5 rounded-xl font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.08)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] active:scale-95 transition-all text-sm"
            >
              <Globe className="w-4 h-4 shrink-0" />
              Visit Portfolio Website
            </a>
            <a 
              href="https://kamranx.dev/chat" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#FFD700] hover:bg-[#FFD700]/95 text-black border-2 border-black px-6 py-3.5 rounded-xl font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] active:scale-95 transition-all text-sm"
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              Chat with K-Dev AI
            </a>
            <a 
              href="https://github.com/kamranxdev" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-white dark:bg-zinc-800 text-black dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-700/80 border-2 border-black dark:border-zinc-700 px-6 py-3.5 rounded-xl font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.05)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] active:scale-95 transition-all text-sm"
            >
              View GitHub Profile
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
