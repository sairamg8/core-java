# Graph Report - /home/gudiputi/Documents/core-java  (2026-07-01)

## Corpus Check
- 351 files · ~281,623 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 509 nodes · 519 edges · 40 communities
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.78)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Core & Collections Data|Core & Collections Data]]
- [[_COMMUNITY_Navigation & App Pages|Navigation & App Pages]]
- [[_COMMUNITY_Package Dependencies|Package Dependencies]]
- [[_COMMUNITY_Improvement Ideas Doc|Improvement Ideas Doc]]
- [[_COMMUNITY_UI Components (CalloutCode)|UI Components (Callout/Code)]]
- [[_COMMUNITY_Search|Search]]
- [[_COMMUNITY_Progress Tracking|Progress Tracking]]

## God Nodes (most connected - your core abstractions)
1. `Beginner Safety Theme (Make It Beginner-Safe)` - 8 edges
2. `Java Bible — Improvement Ideas (Opus Review)` - 7 edges
3. `Idea 14 — Extend Section Data Format (hook, blocks, output, quiz fields)` - 7 edges
4. `renderInline()` - 5 edges
5. `scripts` - 4 edges
6. `load()` - 4 edges
7. `Active Learning Theme (Turn Readers into Doers)` - 4 edges
8. `Navigation and Findability Theme` - 4 edges
9. `Idea 2 — Section What and Why Hook Opener` - 4 edges
10. `Idea 8 — Check Yourself Mini-Quiz per Step` - 4 edges

## Surprising Connections (you probably didn't know these)
- `QCard()` --calls--> `renderInline()`  [EXTRACTED]
  src/pages/InterviewQuestionsPage.jsx → src/utils/renderText.jsx
- `TopicPage()` --calls--> `getTopic()`  [EXTRACTED]
  src/pages/TopicPage.jsx → src/data/registry.js
- `SectionView()` --calls--> `renderExplanation()`  [EXTRACTED]
  src/pages/TopicPage.jsx → src/utils/renderText.jsx
- `SectionView()` --calls--> `renderInline()`  [EXTRACTED]
  src/pages/TopicPage.jsx → src/utils/renderText.jsx
- `StepPage()` --calls--> `getStep()`  [EXTRACTED]
  src/pages/StepPage.jsx → src/data/roadmap.js

## Import Cycles
- None detected.

## Communities (40 total, 0 thin omitted)

### Community 1 - "Core & Collections Data"
Cohesion: 0.07
Nodes (3): advancedTopics, allTopics, coreTopics

### Community 2 - "Navigation & App Pages"
Cohesion: 0.10
Nodes (18): Idea 12 — Keyboard Arrow Navigation Between Steps, Navigation and Findability Theme, Idea 11 — Client-Side Search Command Palette (Ctrl+K), Idea 13 — Stage-Level Progress Counter and Reset Button, index.html — React App Entry Point, App(), Layout(), COLOR (+10 more)

### Community 3 - "Package Dependencies"
Cohesion: 0.10
Nodes (19): dependencies, lucide-react, react, react-dom, react-router-dom, react-syntax-highlighter, devDependencies, autoprefixer (+11 more)

### Community 4 - "Improvement Ideas Doc"
Cohesion: 0.18
Nodes (17): Java Bible — Improvement Ideas (Opus Review), 50+ LPA Content Roadmap (Ideas 19-27), Active Learning Theme (Turn Readers into Doers), Idea 1 — Analogy Callout Type for Callout.jsx, Beginner Safety Theme (Make It Beginner-Safe), Idea 17 — Remove Dead Parallel Content System (TopicPage, registry, aggregates), Idea 5 — Difficulty Badges and Don't Panic Signposting, DSA Bible App Cross-Reference (+9 more)

### Community 5 - "UI Components (Callout/Code)"
Cohesion: 0.20
Nodes (11): Callout(), TYPES, CodeBlock(), getTopic(), InterviewQuestionsPage(), PLACEHOLDER, QCard(), SectionView() (+3 more)

### Community 6 - "Search"
Cohesion: 0.28
Nodes (5): STAGE_COLOR, buildIndex(), INDEX, searchSections(), strip()

### Community 7 - "Progress Tracking"
Cohesion: 0.33
Nodes (5): getAllProgress(), getStatus(), load(), save(), setStatus()

## Knowledge Gaps
- **31 isolated node(s):** `name`, `version`, `type`, `dev`, `build` (+26 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Idea 2 — Section What and Why Hook Opener` connect `Improvement Ideas Doc` to `Navigation & App Pages`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Why does `Idea 1 — Analogy Callout Type for Callout.jsx` connect `Improvement Ideas Doc` to `UI Components (Callout/Code)`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **What connects `name`, `version`, `type` to the rest of the system?**
  _34 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Core Java Topic Content` be split into smaller, more focused modules?**
  _Cohesion score 0.005763688760806916 - nodes in this community are weakly interconnected._
- **Should `Core & Collections Data` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Should `Navigation & App Pages` be split into smaller, more focused modules?**
  _Cohesion score 0.09788359788359788 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._