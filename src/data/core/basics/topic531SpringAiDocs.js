export default {
  id: 'spring-ai-docs',
  title: '531. Spring AI Docs',
  explanation: `Before writing any Spring AI code, this topic covers where to actually find authoritative information about it — a genuinely practical topic, not filler, since Spring AI is evolving faster than almost anything else covered in this course, and knowing where to check for the current state of things matters more here than it did for, say, core Java syntax.

**The official Spring AI reference documentation is the primary source of truth, and should be the first place checked for anything not covered in this chapter.** Available at Spring's official docs site, it covers every supported provider (OpenAI, Anthropic, Ollama, and others), every core abstraction (\`ChatClient\`, \`PromptTemplate\`, vector stores), and includes runnable code samples for each.

**Why "evolving faster than most of this course" is not an exaggeration, and what that means practically.** Spring AI reached its \`1.0\` stable release relatively recently (covered in the next topic, see [[stable-version-update]]) — meaning APIs, configuration property names, and even core class names have changed between versions more than is typical for a mature Spring project. Code copied from an older blog post or Stack Overflow answer has a real, higher-than-usual chance of referencing an outdated API shape.

**The practical habit this topic recommends, directly informed by that fast-moving reality.** When something from this chapter doesn't compile or behave as described, checking the *version* of Spring AI actually being used, and cross-referencing the docs for that specific version, is a more productive first step than assuming the course content itself is wrong — a genuinely different debugging habit than most of this course required, where APIs were comparatively stable for years at a time.

**Where else to look, beyond the official reference docs.** The Spring AI GitHub repository's own examples directory and issue tracker are useful secondary resources — issues in particular often surface exactly the kind of "this changed between versions" gotcha relevant here, reported by other developers hitting the same friction.

**Why this topic exists at all, positioned this early in the chapter, before any actual code.** Establishing "check the current docs first" as a habit *before* hitting the first confusing error is far more useful than learning it reactively after a frustrating debugging session — exactly the same reasoning behind covering OWASP before writing any Spring Security configuration, back in that earlier chapter (see [[owasp-top-10]]).`,
  code: `# Where to check when something in this Spring AI chapter doesn't behave as expected:

# 1. Official Spring AI reference docs (primary source of truth)
#    - covers every provider, every core abstraction, with runnable examples

# 2. Confirm the actual Spring AI version in use (pom.xml)
#    - cross-reference docs for that SPECIFIC version, not just "latest"

# 3. Spring AI GitHub repo - examples directory and issue tracker
#    - useful for "this changed between versions" specific gotchas`,
  codeTitle: 'The practical checklist for Spring AI documentation, in priority order',
  points: [
    'The official Spring AI reference documentation is the primary, authoritative source for every provider and core abstraction covered in this chapter.',
    'Spring AI reached its 1.0 stable release only relatively recently, meaning APIs and configuration have changed between versions more than is typical for a mature Spring project.',
    'Code copied from an older tutorial or answer has a real, above-average chance of referencing an outdated Spring AI API shape.',
    'Checking the actual Spring AI version in use and cross-referencing docs for that specific version is a more productive debugging first step than assuming course content is wrong.',
    'The examples directory and issue tracker of the GitHub repository are useful secondary resources, often surfacing exactly the kind of version-specific gotcha relevant to a fast-moving library.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Following a Spring AI code example from an older blog post or video without checking which Spring AI version it targets is a common source of confusing compile errors in this specific chapter - class names, method signatures, and even core concepts like the builder pattern of ChatClient have changed meaningfully across pre-1.0 versions of Spring AI.' },
    { type: 'interview', content: 'Q: Why does this course specifically emphasize checking Spring AI documentation and version numbers, when earlier chapters on core Java or Spring Security did not emphasize this nearly as much?\nA: Spring AI is a much younger, faster-evolving library than core Java or Spring Security - it reached a stable 1.0 release only relatively recently, and its APIs, configuration properties, and class shapes have changed meaningfully between versions. Established, mature libraries like core Java syntax rarely have this problem, so checking the specific version in use and cross-referencing version-matched documentation is a genuinely more important habit here than it was for most of the rest of this course.' },
  ],
}
