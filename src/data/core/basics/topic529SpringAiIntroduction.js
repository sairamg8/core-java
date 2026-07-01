export default {
  id: 'spring-ai-introduction',
  title: '529. Spring AI Introduction',
  explanation: `Every chapter so far in this course has built conventional backend functionality — REST APIs, security, deployment. This chapter is a genuine departure: **Spring AI**, Spring's official integration for calling Large Language Models (LLMs) like OpenAI's GPT models — bringing the exact same Spring conventions already familiar from this entire course (dependency injection, auto-configuration, \`@Bean\`s, \`application.properties\`) to a fundamentally different kind of dependency: an AI model, not a database or message queue.

**What an LLM actually is, in the minimum detail needed before writing any Spring AI code.** A Large Language Model is a system trained on enormous amounts of text that, given some input text (a **prompt**), generates a continuation of that text (a **response**) — for a chat-style model, this looks like a conversational reply, but underneath, it's fundamentally a very sophisticated text-completion engine, not a database lookup or a rule-based system.

**Why this belongs in a Spring Boot course at all, rather than being a separate, standalone topic.** Real applications increasingly need to call an LLM as part of their normal request handling — summarizing text, answering questions, generating content — and doing that from inside an existing Spring Boot app (like the Job app built throughout this course) means the LLM call needs to fit into the same request/response cycle, the same dependency injection, the same configuration patterns already established. Spring AI exists specifically to make that integration feel native, rather than bolted on.

**What Spring AI is not, stated plainly to set expectations correctly.** It doesn't train or host models itself — it's a client library that calls out to an existing LLM provider's API (OpenAI, Anthropic, Google, or a locally-run model via Ollama, covered later in this chapter) over the network, the same way \`RestTemplate\` or \`WebClient\` calls any other external API — just with a purpose-built abstraction layer on top, designed around the specific shape of prompt-in/response-out interactions.

**What this chapter builds toward, concretely, mirroring how earlier chapters progressed.** Starting with the simplest possible "ask a question, get an answer" interaction, this chapter progressively adds memory (multi-turn conversations), retrieval-augmented generation (answering based on a specific document set), image and audio capabilities, and finally a full AI feature built into the Job app's e-commerce companion project — each topic adding exactly one new capability on top of what came before, the same incremental approach used throughout this entire course.`,
  code: `// The shape of what this chapter builds toward:
@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final ChatClient chatClient;   // Spring AI's core abstraction

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
// A real LLM call, wired into an ordinary Spring Boot REST endpoint`,
  codeTitle: 'The destination this Spring AI chapter builds toward',
  points: [
    'An LLM generates a text response given a text prompt - fundamentally a sophisticated text-completion engine, not a database lookup or rule-based system.',
    'Spring AI brings the same Spring conventions (DI, auto-configuration, application.properties) already used throughout this course to calling an LLM, rather than requiring an entirely separate integration approach.',
    'Spring AI does not train or host models itself - it is a client library calling out to the API of an existing LLM provider, conceptually similar to how RestTemplate calls any other external API.',
    'This chapter progressively builds from a simple question-answer interaction toward memory, retrieval-augmented generation, image/audio capabilities, and a full AI feature in the e-commerce companion project of the Job app.',
    'The same incremental, one-new-concept-at-a-time approach used throughout this entire course applies here as well, rather than introducing every AI concept at once.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Treating an LLM response as a deterministic, always-correct answer (the way a database query result is trusted) is a fundamental misunderstanding - LLMs generate plausible-sounding text based on patterns learned during training, and can produce confidently wrong answers (a phenomenon usually called "hallucination") - later topics on retrieval-augmented generation address this specific reliability gap.' },
    { type: 'interview', content: 'Q: What does Spring AI actually provide, and what does it explicitly not do?\nA: Spring AI provides a Spring-idiomatic client library and abstraction layer (ChatClient, PromptTemplate, and related APIs) for calling external LLM provider APIs like OpenAI, integrated with the dependency injection and configuration conventions of Spring. It does not train, host, or run the models itself - the actual model inference happens on the infrastructure of the provider (or locally via Ollama), and Spring AI is purely the client-side integration layer.' },
  ],
}
