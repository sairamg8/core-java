export default {
  id: 'asking-questions-to-openai-models',
  title: '535. Asking Questions to OpenAI Models',
  explanation: `With a working key confirmed via the smoke test (see [[create-openai-api-key]]), this topic builds an actual, real REST endpoint on the Job app's own pattern — a genuine feature, not just a one-off test call.

**A real endpoint, following the exact \`@RestController\` conventions already established throughout this entire course:**
\`\`\`java
@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final ChatModel chatModel;

    public AiController(ChatModel chatModel) {
        this.chatModel = chatModel;
    }

    @GetMapping("/ask")
    public String ask(@RequestParam String question) {
        return chatModel.call(question);
    }
}
\`\`\`
\`GET /api/ai/ask?question=What is Spring Boot?\` now returns a real, live LLM-generated answer — wired into the Job app exactly the way any other endpoint in this course has been.

**Why \`ChatModel.call(String)\` is the *simplest possible* interaction, and exactly why that simplicity is both its strength and its limit.** It takes a plain string prompt and returns a plain string response — no conversation history, no system instructions, no structured output. This is intentionally the absolute floor of what Spring AI can do, the equivalent of the very first \`@GetMapping\` ever written in this course (see [[creating-a-rest-controller]]) — correct, working, and deliberately minimal, with every additional capability layered on in later topics.

**What a "question" actually becomes, underneath this one call — connecting back to the JWT/token structure already covered elsewhere in this course as a useful mental model.** The string passed to \`call()\` becomes the **user message** in a \`Prompt\` sent to OpenAI's chat completions API — the exact request/response shape covered more explicitly in the very next topic (see [[working-with-chatclient]]), which introduces \`ChatClient\`, the richer, more commonly used API this simpler \`ChatModel.call()\` form sits underneath.

**A genuinely important limitation worth stating honestly here, before any further topic makes it easy to forget.** Every call to this endpoint is **completely independent** — the model has no memory of any previous question asked through it. Asking "what's the capital of France?" followed by "what's its population?" fails, since "its" has no antecedent the model can see — this specific gap (conversation memory) is addressed later in this chapter, once the more capable \`ChatClient\` API is introduced.`,
  code: `@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final ChatModel chatModel;

    public AiController(ChatModel chatModel) {
        this.chatModel = chatModel;
    }

    @GetMapping("/ask")
    public String ask(@RequestParam String question) {
        return chatModel.call(question);
    }
}

// GET /api/ai/ask?question=What is Spring Boot?
// -> "Spring Boot is a framework that simplifies building Spring applications..."`,
  codeTitle: 'A real REST endpoint answering questions via ChatModel.call()',
  points: [
    'ChatModel.call(String) is the simplest possible Spring AI interaction - a plain string prompt in, a plain string response out, no conversation history or structured output.',
    'This mirrors the deliberate minimalism of the very first @RestController written in this course - correct and working, with capability layered on in later topics.',
    'The string passed to call() becomes the user message in a Prompt sent to the underlying provider, the exact concept the next topic covers more explicitly via ChatClient.',
    'Every call to chatModel.call() is completely independent - the model retains no memory of previous questions asked through the same endpoint.',
    'Follow-up questions relying on context from a previous call (like "what is its population?" after asking about a country) fail with this simple form - conversation memory is addressed in a later topic once ChatClient is introduced.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Expecting chatModel.call() to remember a previous question asked through the same endpoint is a common early misunderstanding - each call is entirely independent with no conversation state carried between requests; building actual multi-turn conversation requires explicitly managing and resending prior messages, covered in a later topic.' },
    { type: 'interview', content: 'Q: Why does calling GET /api/ai/ask twice in a row, with the second question depending on context from the first (like "what is its population?"), not work correctly with a simple ChatModel.call() endpoint?\nA: Each call to chatModel.call() is completely independent and stateless - the model has no memory of any previous request, since no conversation history is being tracked or resent. For the model to correctly resolve a reference like "its" from an earlier message, the application itself must explicitly track and resend the prior conversation turns as part of the prompt, which is exactly what a later topic on chat memory addresses.' },
  ],
}
