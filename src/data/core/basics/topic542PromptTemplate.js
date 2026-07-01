export default {
  id: 'prompt-template-concept',
  title: '542. Prompt Template',
  explanation: `Every prompt sent so far has been either a plain string or simple string concatenation (see [[working-with-chatclient]]) — this topic introduces \`PromptTemplate\`, Spring AI's tool for building prompts with **parameterized placeholders**, and explains why that matters beyond just tidier code.

**The problem with plain string concatenation for anything beyond the simplest prompt, made concrete.**
\`\`\`java
String prompt = "You are a job search assistant. The user's name is " + userName
    + ". Answer this question about job \\"" + jobTitle + "\\": " + question;
\`\`\`
This works, but it tangles the actual prompt *structure* (what the model is told to do) with Java string-building mechanics (quoting, escaping, concatenation operators) — becoming genuinely hard to read and error-prone as prompts grow more complex, exactly the same readability problem string concatenation always causes, just applied here to prompt text instead of application logic.

**\`PromptTemplate\` — separating the prompt's fixed structure from its variable parts, using \`{placeholder}\` syntax:**
\`\`\`java
PromptTemplate template = new PromptTemplate("""
    You are a job search assistant. The user's name is {userName}.
    Answer this question about job "{jobTitle}": {question}
    """);

Prompt prompt = template.create(Map.of(
    "userName", userName,
    "jobTitle", jobTitle,
    "question", question
));
\`\`\`
The template string is now purely about prompt *content and structure* — readable as what it actually is, a piece of text meant for a human (well, a model) to read — with the *values* supplied separately as a \`Map\`, the same separation of template and data already familiar from any templating system.

**Why this separation matters for more than readability alone — a genuinely practical reason, not just style.** Prompt templates can be defined as constants, stored in separate resource files, or even externalized to configuration — meaning a prompt's wording can be refined or A/B tested without touching the Java code that builds and sends it, exactly the same "content separate from code" principle that motivates keeping SQL queries or email templates outside of application logic in other contexts.

**Where \`PromptTemplate\` fits relative to \`ChatClient\`'s own \`.user(...)\` method already used throughout this chapter.** \`ChatClient\` actually accepts a template string directly in some of its overloads too — \`PromptTemplate\` as a standalone class becomes most valuable specifically when a prompt is complex, reused across multiple call sites, or needs to be built and inspected independently of any specific \`ChatClient\` call — covered concretely in the next topic.`,
  code: `PromptTemplate template = new PromptTemplate("""
    You are a job search assistant. The user's name is {userName}.
    Answer this question about job "{jobTitle}": {question}
    """);

Prompt prompt = template.create(Map.of(
    "userName", "Alice",
    "jobTitle", "Backend Engineer",
    "question", "What skills does this role require?"
));
// The template's structure stays readable, values are supplied separately`,
  codeTitle: 'PromptTemplate separating fixed prompt structure from variable values',
  points: [
    'Plain string concatenation for prompts tangles prompt structure with Java string-building mechanics (quoting, escaping), becoming hard to read as prompts grow more complex.',
    'PromptTemplate uses {placeholder} syntax, with actual values supplied separately via a Map, keeping the template readable as prompt content rather than as string-building code.',
    'This mirrors the general "separate content/template from code" principle already familiar from other templating contexts, applied here specifically to prompt text.',
    'Templates defined as constants or external resources can be refined without touching the Java code that builds and sends them.',
    'PromptTemplate as a standalone class is most valuable for complex or reused prompts; the .user(...) method already built into ChatClient handles simpler inline cases adequately.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Building a complex, multi-variable prompt through nested string concatenation with manual quote-escaping is a common source of hard-to-spot bugs (a missing space, an unescaped quote) that the placeholder syntax of PromptTemplate avoids entirely by keeping the literal template text separate from the Java code assembling it.' },
    { type: 'interview', content: 'Q: What specific problem does PromptTemplate solve compared to building a prompt via plain Java string concatenation?\nA: String concatenation mixes the actual prompt content and structure with Java string-building mechanics like quoting and escaping, making complex prompts hard to read and error-prone to modify. PromptTemplate separates the fixed template text (using {placeholder} syntax) from the actual values (supplied via a Map), keeping the prompt readable as prompt content and making it easier to refine, reuse, or externalize independently of the Java code that uses it.' },
  ],
}
