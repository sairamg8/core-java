export default {
  id: 'chatclient-builder',
  title: '538. ChatClient Builder',
  explanation: `\`ChatClient.Builder\` has been used in every example so far (see [[working-with-chatclient]]) with only a single \`.defaultSystem(...)\` customization shown — this closing topic of the batch covers the builder more completely, since it's the actual configuration surface most real Spring AI applications spend their setup time on.

**The builder's key configuration methods, beyond \`.defaultSystem(...)\` already seen:**
\`\`\`java
@Configuration
public class AiConfig {

    @Bean
    public ChatClient chatClient(ChatClient.Builder builder) {
        return builder
            .defaultSystem("You are a helpful assistant for a job search platform.")
            .defaultOptions(ChatOptions.builder()
                .temperature(0.7)
                .maxTokens(500)
                .build())
            .build();
    }
}
\`\`\`

**\`temperature\` — controlling how deterministic or varied the model's output is, a genuinely important tuning parameter, not a cosmetic setting.** A low temperature (closer to \`0\`) produces more focused, repeatable, "safe" output — appropriate for factual Q&A or structured data extraction. A higher temperature (closer to \`1\` or above) produces more varied, creative output — appropriate for brainstorming or creative writing. The right value genuinely depends on the specific feature being built, not a one-size-fits-all default.

**\`maxTokens\` — a hard ceiling on response length, directly connecting back to the \`finishReason: LENGTH\` truncation signal from the previous topic (see [[chatresponse-and-metadata]]).** Setting this too low is *precisely* what produces that truncated-response scenario — this parameter and that metadata field are two sides of the same concern: one sets the limit, the other reports when it was hit.

**Why configuring the builder once, centrally, as a \`@Bean\` — as shown above — is the better pattern than calling \`.defaultSystem(...)\`/\`.defaultOptions(...)\` inline inside every controller that needs a \`ChatClient\`.** Every controller that needs AI capabilities injects the same, consistently-configured \`ChatClient\` bean, rather than each one separately (and potentially inconsistently) setting its own system message and options — the same "configure once, inject everywhere" principle already familiar from \`PasswordEncoder\` (see [[setting-password-encoder]]) earlier in this course.

**What this topic closes out for this first Spring AI batch, and what's ahead.** Every fundamental building block — dependency setup, API key, \`ChatModel\`, \`ChatClient\`, system/user messages, response metadata, and now builder configuration — is now covered. The next batch moves to memory (multi-turn conversations), the specific gap flagged back in the "asking questions" topic (see [[asking-questions-to-openai-models]]) as still unresolved.`,
  code: `@Configuration
public class AiConfig {

    @Bean
    public ChatClient chatClient(ChatClient.Builder builder) {
        return builder
            .defaultSystem("You are a helpful assistant for a job search platform.")
            .defaultOptions(ChatOptions.builder()
                .temperature(0.7)
                .maxTokens(500)
                .build())
            .build();
    }
}
// Every controller injects this SAME, consistently-configured ChatClient bean`,
  codeTitle: 'A centrally configured ChatClient bean, injected consistently everywhere',
  points: [
    'temperature controls how deterministic vs. varied model output is - low values suit factual Q&A, higher values suit creative or varied output; the right value depends on the specific feature.',
    'maxTokens sets a hard ceiling on response length, and setting it too low is exactly what produces the finishReason: LENGTH truncation signal covered in the previous topic.',
    'Configuring the builder once as a central @Bean, rather than inline in every controller, ensures every part of the application uses the same consistent system message and options.',
    'This "configure once, inject everywhere" pattern mirrors the same principle already established for PasswordEncoder earlier in this course.',
    'This topic closes out the fundamental Spring AI building blocks - the next batch in this chapter moves to conversation memory, the specific gap left open several topics ago.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Setting maxTokens too low for a feature that genuinely needs longer responses (a detailed explanation, a multi-paragraph summary) causes silent truncation that looks like the model just "stopped answering" - checking finishReason (from the previous topic) is how this gets diagnosed, and raising maxTokens is the actual fix, not assuming the model itself is at fault.' },
    { type: 'interview', content: 'Q: Why configure ChatClient.Builder once as a central @Bean rather than calling .defaultSystem() and .defaultOptions() inline in each controller that needs AI capability?\nA: Configuring it once ensures every part of the application that injects the resulting ChatClient bean uses the exact same system message and model options consistently, avoiding drift where different controllers accidentally configure slightly different behavior. This mirrors the same centralized-bean pattern already used for PasswordEncoder earlier in this course - configure once, inject everywhere that needs it.' },
  ],
}
