# 🛠️ Kamran Khan's Technical Notes (The Engineering Sandbox)

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Fumadocs](https://img.shields.io/badge/Fumadocs-v16.10-blue?style=flat)](https://fumadocs.dev/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat&logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.0-38B2AC?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)

An analogy-driven, curated engineering portal designed to translate complex computer science specifications into clear, intuitive mental models. Built on Next.js 16, React 19, and powered by Fumadocs, this repository contains syntax cheat sheets, reference guides, interactive quizzes, and visual diagrams.

---

## 🚀 Key Features

*   **Analogy-First Explanations:** Core concepts explained using real-world mental models (e.g., the JVM stack as a chef's clipboard, CSS specificity as an auction).
*   **Interactive Terminal Shell:** A custom-built client-side Terminal component featured on the homepage. Users can type interactive commands like `help`, `note-stats`, `skills`, `about-kamran`, or trigger quick-actions.
*   **Interactive Custom MDX Components:**
    *   `<Quiz>`: Renders interactive multiple-choice or single-answer review checkups with inline explanations and scoring logic.
    *   `<Problem>`: Collapsible structure for practice problems separating description (`<ProblemDescription>`) and explanation/solution (`<ProblemSolution>`).
    *   `<Mermaid>`: Supports inline rendering of diagrams and flowcharts for visual learning.
    *   `<Callout>`: Tailored alert/notification banners.
*   **PWA Support:** Configured for offline access and native app feel.
*   **Automatic Content Parsers:** Built-in automation scripts for migrating raw notes, quizzes, and practice exercises into fully formatted MDX files.

---

## 📁 Repository Structure

```
.
├── content/
│   └── docs/                        # Raw documentation files & meta layouts
│       ├── (mobile-development)/    # Flutter, Android development notes
│       ├── database/                # SQL, PL/SQL, indexing, triggers
│       ├── programming/             # Java OOP, JVM memory management
│       ├── rest-json-xml/           # REST APIs, payloads
│       ├── unix-linux/              # Shell commands, Linux kernel space
│       ├── web-frameworks/          # React components, Angular reactivity
│       └── web-fundamentals/        # DOM rendering, CSS specificity, JS event loops
├── src/
│   ├── app/                         # Next.js app router pages and routes
│   ├── components/                  # Custom React & MDX components (Quiz, Problem, Terminal, etc.)
│   ├── layouts/                     # Site layouts and navigation sidebars
│   └── lib/                         # Utility helpers, shared configurations, and Fumadocs loaders
├── html-to-mdx.js                   # Script: HTML source code converter to MDX
├── problem-to-mdx.js                # Script: Raw questions converter to <Problem> markup
├── quiz-to-mdx.js                   # Script: Standard Q&As converter to interactive <Quiz>
├── source.config.ts                 # Fumadocs collection schema definition
└── package.json                     # Node.js dependencies and run scripts
```

---

## ⚙️ Content Parsing Scripts

This repository includes custom utilities to convert static study guides into rich, interactive MDX pages:

### 1. HTML to MDX (`html-to-mdx.js`)
Converts raw HTML logs or scraped pages into MDX. It handles proper escaping for MDX/JSX syntax (`{`, `}`, `<`, `>`) and automatically maps styled `.box` components to Fumadocs `<Callout>` nodes.
```bash
node html-to-mdx.js <input.html> [output.mdx]
```

### 2. Practice Problem Formatter (`problem-to-mdx.js`)
Parses practice questions within markdown and rewrites them into interactive `<Problem>` components, automatically splitting content into description and solution layers.
```bash
node problem-to-mdx.js <input.mdx> [output.mdx] # Leave output blank for in-place edit
```

### 3. Quiz Injector (`quiz-to-mdx.js`)
Detects standard multiple-choice questions (e.g. labeled with `A)`, `B)`, `C)`, `D)` or `1.`, `2.`, `3.`, `4.`) and answers/explanations. It uses text-matching algorithms to determine the correct index and packs them into client-side `<Quiz>` elements.
```bash
node quiz-to-mdx.js <input.mdx> [output.mdx] # Leave output blank for in-place edit
```

---

## 🛠️ Tech Stack & Libraries

*   **Next.js 16 & React 19** – Leading-edge app router framework.
*   **Fumadocs** – Flexible and high-performance developer documentation generator.
*   **Tailwind CSS v4** – Utility-first CSS processing.
*   **Radix UI** – Unstyled, accessible component primitives.
*   **Vercel AI SDK & OpenRouter** – Support for integrating smart LLM-guided widgets.
*   **Turndown & Turndown GFM** – HTML-to-markdown conversion pipeline.
*   **Beautiful Mermaid** – Visual diagram rendering.

---

## 🏁 Getting Started

### Prerequisites

Make sure you have Node.js (version 18 or above recommended) installed on your system.

### Installation

Clone the repository and install the dependencies:
```bash
npm install
# or
pnpm install
# or
yarn install
```

### Run the Development Server

Start the local server:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to inspect the application.

### Building for Production

To create an optimized production build:
```bash
npm run build
```

### Type Checking and Linting

Validate TypeScript types:
```bash
npm run types:check
```

Lint files using ESLint:
```bash
npm run lint
```
