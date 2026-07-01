/**
 * React Bible — Part Definitions
 *
 * Each "part" is a named grouping of related chapters.
 * Parts are used for navigation, grouping, and progress tracking.
 *
 * Separation of concern: This file is ONLY data — no UI, no logic.
 */

export const PARTS = [
  {
    id: 'foundations',
    number: 1,
    label: 'Foundations',
    description: 'The mental model, JSX, and what components actually are.',
    color: 'blue',
    icon: '🧱',
    chapterIds: ['mental-model', 'jsx-deep-dive', 'components'],
  },
  {
    id: 'hooks',
    number: 2,
    label: 'Hooks — Complete Reference',
    description: 'Every built-in hook. No shortcuts. No hand-waving.',
    color: 'violet',
    icon: '🪝',
    chapterIds: [
      'use-state', 'use-effect', 'use-context', 'use-ref',
      'use-reducer', 'use-memo-callback', 'use-transition-deferred',
      'use-id', 'use-sync-external-store', 'use-debug-value',
    ],
  },
  {
    id: 'react19-apis',
    number: 3,
    label: 'React 19 — New APIs',
    description: 'use(), useActionState, useFormStatus, useOptimistic.',
    color: 'emerald',
    icon: '🆕',
    chapterIds: ['use-api', 'use-action-state', 'use-form-status', 'use-optimistic'],
  },
  {
    id: 'react19-architecture',
    number: 4,
    label: 'React 19 — Architecture Changes',
    description: 'Actions, ref as prop, Context as provider, document metadata.',
    color: 'orange',
    icon: '🏗️',
    chapterIds: [
      'actions', 'ref-as-prop', 'context-as-provider',
      'document-metadata', 'resource-preloading', 'custom-elements',
    ],
  },
  {
    id: 'react19-2-plus',
    number: 5,
    label: 'React 19.2+ — Latest',
    description: 'Activity component, ViewTransition, addTransitionType.',
    color: 'rose',
    icon: '⚡',
    chapterIds: ['activity-component', 'view-transition', 'add-transition-type'],
  },
  {
    id: 'server',
    number: 6,
    label: 'Server Components & Actions',
    description: 'The paradigm shift: RSC, Server Actions, streaming.',
    color: 'teal',
    icon: '🖥️',
    chapterIds: ['react-server-components', 'server-actions', 'streaming-ssr'],
  },
  {
    id: 'compiler',
    number: 7,
    label: 'React Compiler',
    description: 'Automatic memoization. Stable v1.0 (Oct 2025).',
    color: 'amber',
    icon: '⚙️',
    chapterIds: ['react-compiler'],
  },
  {
    id: 'concurrent',
    number: 8,
    label: 'Concurrent React — Deep Dive',
    description: 'Fiber, lanes, Suspense internals, Error Boundaries.',
    color: 'indigo',
    icon: '🔀',
    chapterIds: ['concurrent-rendering', 'suspense-complete', 'error-boundaries'],
  },
  {
    id: 'custom-hooks',
    number: 9,
    label: 'Custom Hooks — Industry Grade',
    description: 'Real-world hooks: problem analysis, limitations, production improvements.',
    color: 'cyan',
    icon: '🎣',
    chapterIds: ['custom-hooks-foundations', 'custom-hooks-catalog'],
  },
  {
    id: 'patterns',
    number: 10,
    label: 'Patterns & Architecture',
    description: 'Compound components, state management, performance, scale.',
    color: 'purple',
    icon: '🎨',
    chapterIds: [
      'component-patterns', 'state-management-2026',
      'performance-guide', 'scalable-architecture',
    ],
  },
  {
    id: 'testing',
    number: 11,
    label: 'Testing',
    description: 'Test behavior, not implementation. RTL, MSW, Vitest.',
    color: 'green',
    icon: '🧪',
    chapterIds: ['testing-react'],
  },
  {
    id: 'accessibility',
    number: 12,
    label: 'Accessibility',
    description: 'ARIA, focus management, keyboard navigation, useId.',
    color: 'sky',
    icon: '♿',
    chapterIds: ['accessibility'],
  },
  {
    id: 'ecosystem',
    number: 13,
    label: 'Ecosystem & Tooling',
    description: 'TypeScript, Next.js, Vite, React DevTools, 2026 landscape.',
    color: 'stone',
    icon: '🔧',
    chapterIds: ['typescript-react', 'ecosystem-2026'],
  },
]

/** Lookup a part by id */
export function getPartById(id) {
  return PARTS.find(p => p.id === id) || null
}

/** Get the part that owns a given chapterId */
export function getPartForChapter(chapterId) {
  return PARTS.find(p => p.chapterIds.includes(chapterId)) || null
}
