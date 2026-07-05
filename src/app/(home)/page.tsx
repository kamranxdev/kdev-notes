import Link from 'next/link';
import { BookOpen, Globe } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center flex-1 py-24 px-6">
      <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-sm font-semibold text-emerald-800 dark:text-emerald-300 shadow-sm neo-shadow">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Knowledge Base
        </span>
      </div>
      
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-tight mb-6 max-w-4xl">
        <span className="block mb-2">Kamran's</span>
        <span className="block text-foreground border-b-4 border-kamranx-accent inline-block">
          Digital Garden
        </span>
      </h1>
      
      <p className="text-lg md:text-xl text-fd-muted-foreground mb-10 max-w-2xl font-medium leading-relaxed">
        Welcome to my personal notes. This is an extension of my portfolio where I document my learnings, system architectures, and deep dives into modern web technologies.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
        <Link 
          href="/docs" 
          className="inline-flex items-center justify-center gap-2 bg-kamranx-accent text-black border-2 border-black px-8 py-4 rounded-full font-bold transition-all duration-300 neo-shadow neo-shadow-hover hover:-translate-y-1 active:translate-y-1 active:shadow-none text-lg"
        >
          <BookOpen className="w-5 h-5" />
          Explore Notes
        </Link>
        <a 
          href="https://kamranx.dev" 
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-background text-foreground border-2 border-black dark:border-white px-8 py-4 rounded-full font-bold transition-all duration-300 neo-shadow neo-shadow-dark neo-shadow-hover neo-shadow-hover-dark hover:-translate-y-1 active:translate-y-1 active:shadow-none text-lg"
        >
          <Globe className="w-5 h-5" />
          My Portfolio
        </a>
      </div>
    </div>
  );
}
