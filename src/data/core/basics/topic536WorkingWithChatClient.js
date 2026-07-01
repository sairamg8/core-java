export default {
  id: 'working-with-chatclient',
  title: '536. Working with ChatClient',
  explanation: `\`ChatModel.call(String)\` (see [[asking-questions-to-openai-models]]) is deliberately minimal — this topic introduces **\`ChatClient\`**, the richer, fluent API most real Spring AI code actually uses, and the API every remaining topic in this chapter builds on.

**The same "ask a question" endpoint, rewritten using \`ChatClient\`'s fluent builder-style API:**
\`\`\`java
@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final ChatClient chatClient;

    public AiController(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    @GetMapping("/ask")
    public String ask(@RequestParam String question) {
        return chatClient.prompt()
            .user(question)
            .call()
            .content();
    }
}
\`\`\`

**Reading the fluent chain, piece by piece.** \`.prompt()\` starts building a new request; \`.user(question)\` sets the user message (the equivalent of the plain string passed to \`ChatModel.call()\` before); \`.call()\` actually sends the request to OpenAI; \`.content()\` extracts just the plain text response — the simplest possible way to get an answer back, functionally identical to the previous topic's result for this specific case.

**What \`ChatClient\` offers that \`ChatModel.call(String)\` alone doesn't — the actual reason to prefer it, not just a stylistic alternative.** A **system message** — instructions to the model about *how* to behave, separate from the user's actual question:
\`\`\`java
chatClient.prompt()
    .system("You are a helpful assistant for a job search platform. Keep answers under 50 words.")
    .user(question)
    .call()
    .content();
\`\`\`
\`ChatModel.call(String)\` has no equivalent way to express this distinction at all — everything is just "the prompt." \`ChatClient\`'s separate \`.system()\` and \`.user()\` methods make the difference between "instructions the model should always follow" and "what the user is actually asking" explicit and structured, rather than concatenated together as one undifferentiated string.

**Why \`ChatClient.Builder\` is injected, rather than \`ChatClient\` itself, directly.** Spring Boot auto-configures a \`ChatClient.Builder\` bean (not a ready-made \`ChatClient\`) specifically so application code can customize it — adding a default system message, attaching an **advisor** (covered in a later topic on memory) — before calling \`.build()\` to produce the actual, immutable \`ChatClient\` instance used for every request.`,
  code: `@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final ChatClient chatClient;

    public AiController(ChatClient.Builder builder) {
        this.chatClient = builder
            .defaultSystem("You are a helpful assistant for a job search platform.")
            .build();
    }

    @GetMapping("/ask")
    public String ask(@RequestParam String question) {
        return chatClient.prompt()
            .user(question)
            .call()
            .content();
    }
}`,
  codeTitle: 'ChatClient with a default system message, built from the injected Builder',
  points: [
    'ChatClient.prompt().user(...).call().content() is the fluent API most real Spring AI code uses, functionally equivalent to ChatModel.call(String) for the simplest case.',
    'ChatClient adds a genuine capability ChatModel.call(String) lacks entirely: a separate system message expressing instructions to the model, distinct from the actual question of the user.',
    'A system message and user message are structurally separate in ChatClient, rather than being concatenated together as one undifferentiated string.',
    'Spring Boot auto-configures a ChatClient.Builder bean (not a ready-made ChatClient), specifically so application code can customize defaults (like a default system message) before calling .build().',
    'ChatClient is the API every remaining Spring AI topic in this chapter builds on - memory, RAG, structured output, and more all extend this same fluent request-building pattern.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Concatenating instructions and the actual question of the user into one plain string passed to ChatModel.call() (instead of using the separate system/user messages of ChatClient) makes it easy for a question from the user to accidentally override or confuse the intended instructions - keeping them structurally separate via ChatClient is the more reliable pattern.' },
    { type: 'interview', content: 'Q: What does ChatClient provide that the simpler ChatModel.call(String) does not, and why does that matter?\nA: ChatClient provides a fluent API with a structural distinction between a system message (instructions governing how the model should behave) and a user message (the actual question or request) - ChatModel.call(String) has no equivalent, treating everything as one undifferentiated prompt string. Keeping instructions and user input structurally separate is more reliable and is the foundation every later Spring AI capability in this chapter (memory, RAG, structured output) builds on.' },
  ],
}
