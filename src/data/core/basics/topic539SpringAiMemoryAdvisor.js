export default {
  id: 'spring-ai-memory-advisor',
  title: '539. Spring AI Memory Advisor',
  explanation: `Every call so far in this chapter is completely independent, with no memory of previous questions — a gap explicitly flagged early on (see [[asking-questions-to-openai-models]]). This topic closes that gap using Spring AI's **Advisor** mechanism, specifically a memory advisor that tracks conversation history automatically.

**What an \`Advisor\` actually is — a familiar concept from elsewhere in this course, applied to LLM calls.** An advisor intercepts a \`ChatClient\` request/response cycle to add cross-cutting behavior around it, without the calling code needing to manage that behavior itself — conceptually the same idea as an \`@Around\` advice in Spring AOP (see [[performance-monitoring-using-around-advice]]) wrapping a method call, just applied here to a prompt/response cycle instead of a Java method call.

**Adding a memory advisor to the \`ChatClient\`:**
\`\`\`java
@Bean
public ChatClient chatClient(ChatClient.Builder builder, ChatMemory chatMemory) {
    return builder
        .defaultAdvisors(MessageChatMemoryAdvisor.builder(chatMemory).build())
        .build();
}

@Bean
public ChatMemory chatMemory() {
    return MessageWindowChatMemory.builder().maxMessages(20).build();
}
\`\`\`

**How this actually solves the earlier problem, concretely.** With this advisor attached, every call through this \`ChatClient\` automatically has its user message and the model's response appended to a tracked conversation history, associated with a **conversation ID** — and that accumulated history is automatically included as context on every subsequent call using the same ID, without the calling code needing to manually resend previous messages itself.

**Using it in a controller, with a conversation ID identifying which conversation a given request belongs to:**
\`\`\`java
@GetMapping("/chat")
public String chat(@RequestParam String message, @RequestParam String conversationId) {
    return chatClient.prompt()
        .user(message)
        .advisors(a -> a.param(ChatMemory.CONVERSATION_ID, conversationId))
        .call()
        .content();
}
\`\`\`
Now \`"What is the capital of France?"\` followed by \`"What's its population?"\`, sent with the *same* \`conversationId\`, correctly resolves \`"its"\` — the memory advisor has already included the first exchange as context for the second call.

**\`maxMessages(20)\` — why a memory window has a limit, not unbounded history.** Every message in the conversation history gets resent as context on every subsequent call, which costs tokens (and therefore money, see [[chatresponse-and-metadata]]) — an unbounded, ever-growing conversation would make every later call in a long conversation progressively more expensive, which is exactly why a bounded window (keeping only the most recent N messages) is the practical default.`,
  code: `@Bean
public ChatMemory chatMemory() {
    return MessageWindowChatMemory.builder().maxMessages(20).build();
}

@Bean
public ChatClient chatClient(ChatClient.Builder builder, ChatMemory chatMemory) {
    return builder
        .defaultAdvisors(MessageChatMemoryAdvisor.builder(chatMemory).build())
        .build();
}

@GetMapping("/chat")
public String chat(@RequestParam String message, @RequestParam String conversationId) {
    return chatClient.prompt()
        .user(message)
        .advisors(a -> a.param(ChatMemory.CONVERSATION_ID, conversationId))
        .call()
        .content();
}`,
  codeTitle: 'Wiring a memory advisor so ChatClient remembers conversation history',
  points: [
    'An Advisor intercepts the ChatClient request/response cycle to add cross-cutting behavior, conceptually similar to @Around advice in Spring AOP wrapping a method call.',
    'MessageChatMemoryAdvisor, attached via defaultAdvisors, automatically tracks and resends prior conversation turns for a given conversation ID, without the calling code manually resending messages.',
    'A conversation ID (ChatMemory.CONVERSATION_ID) identifies which specific conversation a request belongs to, so multiple independent conversations can be tracked simultaneously.',
    'This directly solves the earlier "each call is independent" limitation - follow-up questions relying on prior context now resolve correctly when using the same conversation ID.',
    'MessageWindowChatMemory.maxMessages(20) bounds the conversation history, since every stored message gets resent as context (and billed) on every subsequent call - unbounded history would make long conversations progressively more expensive.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Forgetting to pass a conversationId (or accidentally reusing the same ID across genuinely unrelated conversations from different users) either loses memory entirely or mixes unrelated conversation histories together - the conversation ID must be generated and tracked per actual user session, not left as a hardcoded constant.' },
    { type: 'interview', content: 'Q: How does adding a MessageChatMemoryAdvisor to a ChatClient solve the "each call is independent" limitation covered earlier in this chapter?\nA: The advisor automatically appends each user message and model response to a tracked conversation history, keyed by a conversation ID, and automatically includes that accumulated history as context on every subsequent call using the same ID. This means a follow-up question that depends on earlier context now resolves correctly, without the application needing to manually track and resend prior messages itself.' },
  ],
}
