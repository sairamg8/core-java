export default {
  id: 'spring-ai-with-ollama',
  title: '541. Spring AI With Ollama',
  explanation: `With Ollama running a model locally (see [[running-model-locally-with-ollama]]), this topic wires it into Spring AI — and the result is the clearest, most concrete demonstration yet of the abstraction argument made earlier in this chapter (see [[why-spring-ai]]): switching the entire underlying AI provider really is just a dependency and configuration change.

**Swapping the Maven dependency — OpenAI's starter out, Ollama's starter in:**
\`\`\`xml
<!-- Instead of spring-ai-openai-spring-boot-starter -->
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-ollama-spring-boot-starter</artifactId>
</dependency>
\`\`\`

**Configuring it — pointing at the local Ollama instance instead of an API key:**
\`\`\`properties
spring.ai.ollama.base-url=http://localhost:11434
spring.ai.ollama.chat.options.model=llama3.2
\`\`\`
No \`api-key\` property at all — there's no external provider to authenticate with; \`base-url\` points at Ollama's local REST API (see [[running-model-locally-with-ollama]]) instead.

**The actual application code — identical, unchanged, to every \`ChatClient\` example already written in this chapter:**
\`\`\`java
@GetMapping("/ask")
public String ask(@RequestParam String question) {
    return chatClient.prompt()
        .user(question)
        .call()
        .content();
}
\`\`\`
Not one line of this controller changed. The exact same code that called OpenAI a few topics ago now calls a locally-running Llama model instead — the dependency and configuration changes above are the *entire* migration.

**Why this matters as more than a neat trick — connecting back to the actual argument, not just demonstrating it works.** This is the concrete payoff of every abstraction argument made throughout this course: \`JpaRepository\` decoupling from a specific SQL dialect, \`UserDetailsService\` decoupling from a specific user store, and now \`ChatClient\` decoupling from a specific AI provider — in every case, application code written against the abstraction survives a change to the underlying implementation completely unchanged.

**A practical reason this specific swap matters for real development workflows, not just an academic point.** Developing and testing AI features against a local Ollama model, then switching to OpenAI (or another hosted provider) only for production via configuration, avoids incurring real API costs during every local test run and iteration cycle — directly addressing the cost concern already flagged earlier in this chapter (see [[create-openai-api-key]]).`,
  code: `<!-- pom.xml - swap the starter -->
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-ollama-spring-boot-starter</artifactId>
</dependency>

# application.properties - no api-key, point at local Ollama instead
# spring.ai.ollama.base-url=http://localhost:11434
# spring.ai.ollama.chat.options.model=llama3.2

// Application code - completely unchanged from every OpenAI example so far
@GetMapping("/ask")
public String ask(@RequestParam String question) {
    return chatClient.prompt().user(question).call().content();
}`,
  codeTitle: 'Switching from OpenAI to Ollama - dependency and config only, zero code change',
  points: [
    'Switching from OpenAI to Ollama requires only a Maven dependency swap and application.properties changes - zero application code changes.',
    'Ollama configuration points at a local base-url instead of an api-key, since there is no external provider to authenticate with.',
    'Every ChatClient-based controller written earlier in this chapter works identically against Ollama with no code modification at all.',
    'This is the concrete, working proof of the abstraction argument made earlier in this chapter, and the same pattern already seen with JpaRepository and UserDetailsService elsewhere in this course.',
    'A practical real workflow: develop and test locally against Ollama at zero API cost, then switch to a hosted provider for production via configuration only.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Assuming a small local model configured via Ollama will produce identical quality responses to GPT-4 just because the calling code is unchanged is a mistake - the abstraction guarantees the same API shape and code path work, not that response quality is equivalent across genuinely different models with different capabilities.' },
    { type: 'interview', content: 'Q: What specifically has to change in a Spring AI application to switch from calling OpenAI to calling a local model via Ollama, and what does not need to change?\nA: Only the Maven dependency (swapping the OpenAI starter for the Ollama starter) and application.properties (pointing at a local base-url instead of an API key) need to change. Every piece of application code using ChatClient stays completely unchanged, since ChatClient is the same abstraction regardless of the underlying provider - this is the concrete demonstration of why the provider-agnostic design of Spring AI matters in practice, not just in theory.' },
  ],
}
