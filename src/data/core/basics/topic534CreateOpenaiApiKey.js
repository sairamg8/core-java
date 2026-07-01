export default {
  id: 'create-openai-api-key',
  title: '534. Create OpenAI API Key',
  explanation: `The project from the previous topic (see [[creating-a-spring-ai-project]]) has everything wired except one thing: an actual credential. This topic obtains an OpenAI API key and wires it in — following exactly the same externalized-secret discipline already established for the JWT signing secret (see [[project-setup-for-jwt]]) and database credentials (see [[spring-project-with-database]]) earlier in this course.

**Obtaining the key — a one-time step in OpenAI's own developer platform (platform.openai.com), outside of any code.** Creating an API key there requires an OpenAI account with billing configured — API usage is metered and billed separately from any ChatGPT consumer subscription, a distinction worth being explicit about since it's a common point of confusion.

**Configuring it in \`application.properties\`, using the exact same environment-variable pattern already used throughout this course for every other secret:**
\`\`\`properties
spring.ai.openai.api-key=\${OPENAI_API_KEY}
\`\`\`
The actual key value is set as an environment variable (\`export OPENAI_API_KEY=sk-...\`) or in an IDE run configuration — never typed directly into \`application.properties\` and committed.

**Why this specific credential deserves the exact same seriousness as every other secret flagged throughout this course, restated because it's easy to underweight for a "just experimenting" API key.** A leaked OpenAI API key isn't just a security concern in the abstract — it results in **direct, real monetary charges** if used by someone else, since API calls are billed per-token to whichever account owns the key. This is a more immediately costly leak than most of the other secrets covered earlier in this course, not a lesser one.

**Verifying the key actually works, with the simplest possible call — the direct predecessor to the next topic's proper \`ChatClient\` usage:**
\`\`\`java
@Autowired
private ChatModel chatModel;

// A one-off smoke test, e.g. in a CommandLineRunner or a temporary endpoint
System.out.println(chatModel.call("Say hello in one word"));
\`\`\`
A successful response confirms the key, the starter, and the network path to OpenAI are all working correctly — the actual milestone this topic and the entire project setup so far have been building toward.`,
  code: `# application.properties - the key is referenced, never hardcoded
# spring.ai.openai.api-key=\${OPENAI_API_KEY}

# Set the actual value as an environment variable, never in a committed file:
# export OPENAI_API_KEY=sk-...

@Autowired
private ChatModel chatModel;

// Simplest possible smoke test that the key and wiring actually work:
String result = chatModel.call("Say hello in one word");
System.out.println(result);  // "Hello!"`,
  codeTitle: 'Referencing the OpenAI API key via environment variable, then a smoke test call',
  points: [
    'An OpenAI API key is created in the developer platform run by OpenAI itself, requiring an account with billing configured - API usage is metered and billed separately from any ChatGPT consumer subscription.',
    'The key is referenced via ${OPENAI_API_KEY} in application.properties and set as an actual environment variable, never hardcoded or committed - the same discipline already established for the JWT secret and database credentials.',
    'A leaked OpenAI API key results in direct monetary charges if misused, since API calls are billed per-token to the account owning the key - arguably a more immediately costly leak than several other secrets covered earlier in this course.',
    'A simple chatModel.call("...") smoke test is the fastest way to confirm the key, starter, and network path to OpenAI are all correctly wired before writing any real feature code.',
    'This credential handling is not a special case - it is the same pattern (externalized secrets, environment variables, never committed) applied consistently to every sensitive value throughout this entire course.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Committing an OpenAI API key to a public GitHub repository, even briefly, is routinely detected by automated scanners within minutes and can result in the key being used by unauthorized parties before it is even manually revoked - OpenAI and GitHub both run active secret-scanning specifically for this, but revoking a leaked key immediately is still the right first response, not waiting to see if it gets flagged.' },
    { type: 'interview', content: 'Q: Why is a leaked OpenAI API key arguably a more urgent security concern than some other secrets covered earlier in this course, like a JWT signing secret in a small demo app?\nA: An OpenAI API key directly authorizes billed usage - anyone holding a leaked key can make API calls that are charged to the account owning that key, resulting in immediate, real monetary cost with no additional exploitation step required. This is different from many other leaked secrets, which typically require an additional step (like actually being used to forge a token or access a specific resource) before causing direct financial harm.' },
  ],
}
