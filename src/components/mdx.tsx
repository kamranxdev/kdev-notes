import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { Quiz } from './quiz';
import { Mermaid } from './mermaid';
import { Problem, ProblemDescription, ProblemSolution } from './problem';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Quiz,
    Mermaid,
    Problem,
    ProblemDescription,
    ProblemSolution,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}

