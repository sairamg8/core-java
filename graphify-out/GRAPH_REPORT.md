# Graph Report - .  (2026-06-30)

## Corpus Check
- Corpus is ~40,273 words - fits in a single context window. You may not need a graph.

## Summary
- 163 nodes · 251 edges · 14 communities
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.78)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Learning Improvement Ideas|Learning Improvement Ideas]]
- [[_COMMUNITY_Package Dependencies|Package Dependencies]]
- [[_COMMUNITY_UI Components & Callouts|UI Components & Callouts]]
- [[_COMMUNITY_Sidebar Navigation|Sidebar Navigation]]
- [[_COMMUNITY_Layout & Search|Layout & Search]]
- [[_COMMUNITY_App Entry & Routing|App Entry & Routing]]
- [[_COMMUNITY_String Handling Data|String Handling Data]]

## God Nodes (most connected - your core abstractions)
1. `setStatus()` - 8 edges
2. `Beginner Safety Theme (Make It Beginner-Safe)` - 8 edges
3. `renderInline()` - 7 edges
4. `Java Bible — Improvement Ideas (Opus Review)` - 7 edges
5. `Idea 14 — Extend Section Data Format (hook, blocks, output, quiz fields)` - 7 edges
6. `getAllProgress()` - 5 edges
7. `renderExplanation()` - 5 edges
8. `scripts` - 4 edges
9. `ALL_STEPS` - 4 edges
10. `load()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `QCard()` --calls--> `renderInline()`  [EXTRACTED]
  src/pages/InterviewQuestionsPage.jsx → src/utils/renderText.jsx
- `StageNav()` --calls--> `setStatus()`  [EXTRACTED]
  src/components/Sidebar.jsx → src/utils/progress.js
- `Sidebar()` --calls--> `getAllProgress()`  [EXTRACTED]
  src/components/Sidebar.jsx → src/utils/progress.js
- `StageSection()` --calls--> `setStatus()`  [EXTRACTED]
  src/pages/Home.jsx → src/utils/progress.js
- `TopicPage()` --calls--> `getTopic()`  [EXTRACTED]
  src/pages/TopicPage.jsx → src/data/registry.js

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Beginner Accessibility Feature Set (Ideas 1-7)** — improvement_ideas_analogy_callout, improvement_ideas_hook_opener, improvement_ideas_expected_output, improvement_ideas_small_code_snippets, improvement_ideas_difficulty_badges, improvement_ideas_start_here_onboarding, improvement_ideas_soften_voice [EXTRACTED 1.00]
- **Active Learning Feature Set (Ideas 8-10)** — improvement_ideas_mini_quiz, improvement_ideas_try_it_prompts, improvement_ideas_glossary [EXTRACTED 1.00]
- **Section Format Extension Enables Feature Group (Idea 14 unlocks Ideas 2,3,4,8,9)** — improvement_ideas_section_format_extension, improvement_ideas_hook_opener, improvement_ideas_expected_output, improvement_ideas_small_code_snippets, improvement_ideas_mini_quiz, improvement_ideas_try_it_prompts [EXTRACTED 1.00]
- **Beginner Accessibility Feature Set (Ideas 1-7)** — improvement_ideas_analogy_callout, improvement_ideas_hook_opener, improvement_ideas_expected_output, improvement_ideas_small_code_snippets, improvement_ideas_difficulty_badges, improvement_ideas_start_here_onboarding, improvement_ideas_soften_voice [EXTRACTED 1.00]
- **Active Learning Feature Set (Ideas 8-10)** — improvement_ideas_mini_quiz, improvement_ideas_try_it_prompts, improvement_ideas_glossary [EXTRACTED 1.00]
- **Section Format Extension Enables Feature Group (Idea 14 unlocks Ideas 2,3,4,8,9)** — improvement_ideas_section_format_extension, improvement_ideas_hook_opener, improvement_ideas_expected_output, improvement_ideas_small_code_snippets, improvement_ideas_mini_quiz, improvement_ideas_try_it_prompts [EXTRACTED 1.00]

## Communities (14 total, 0 thin omitted)

### Community 1 - "Learning Improvement Ideas"
Cohesion: 0.14
Nodes (21): Java Bible — Improvement Ideas (Opus Review), 50+ LPA Content Roadmap (Ideas 19-27), Active Learning Theme (Turn Readers into Doers), Idea 1 — Analogy Callout Type for Callout.jsx, Beginner Safety Theme (Make It Beginner-Safe), Idea 17 — Remove Dead Parallel Content System (TopicPage, registry, aggregates), Idea 5 — Difficulty Badges and Don't Panic Signposting, DSA Bible App Cross-Reference (+13 more)

### Community 2 - "Package Dependencies"
Cohesion: 0.10
Nodes (19): dependencies, lucide-react, react, react-dom, react-router-dom, react-syntax-highlighter, devDependencies, autoprefixer (+11 more)

### Community 3 - "UI Components & Callouts"
Cohesion: 0.22
Nodes (13): Callout(), TYPES, CodeBlock(), getTopic(), getStep(), COLOR, SectionView(), STATUS_CONFIG (+5 more)

### Community 4 - "Sidebar Navigation"
Cohesion: 0.20
Nodes (14): COLOR, STAGE_BG, StageNav(), STAGES, COLOR, StageSection(), clearAll(), getAllProgress() (+6 more)

### Community 5 - "Layout & Search"
Cohesion: 0.19
Nodes (9): SearchBar(), STAGE_COLOR, Sidebar(), ThemeToggle(), ALL_STEPS, buildIndex(), INDEX, searchSections() (+1 more)

### Community 6 - "App Entry & Routing"
Cohesion: 0.24
Nodes (7): index.html — React App Entry Point, App(), Layout(), Home(), InterviewQuestionsPage(), PLACEHOLDER, QCard()

### Community 7 - "String Handling Data"
Cohesion: 0.22
Nodes (3): advancedTopics, allTopics, coreTopics

## Knowledge Gaps
- **31 isolated node(s):** `name`, `version`, `type`, `dev`, `build` (+26 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Idea 2 — Section What and Why Hook Opener` connect `Learning Improvement Ideas` to `UI Components & Callouts`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **What connects `name`, `version`, `type` to the rest of the system?**
  _34 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Advanced Java & Patterns` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `Learning Improvement Ideas` be split into smaller, more focused modules?**
  _Cohesion score 0.1380952380952381 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._