export default {
  id: 'spring-ai-basics',
  title: '1. Spring AI — Chat Models & Prompt Templates',
  explanation: `**Spring AI** is the official Spring framework integration for AI/LLM providers (OpenAI, Anthropic, Ollama, Google Vertex AI). It provides a consistent API regardless of which model you use.

**Core concepts:**
- **ChatClient** — the main API for sending prompts and receiving responses
- **Prompt** — the input to the model (system message + user message)
- **ChatResponse** — the model's output, with metadata
- **PromptTemplate** — parameterized prompt strings with \`{placeholders}\`
- **ChatModel** — the underlying model adapter (OpenAI, Anthropic, etc.)

**Why Spring AI?**
- Swap models with a config change (no code change)
- Automatic retry, rate limiting, and error handling
- Integration with Spring's DI, @Configuration, and properties
- Built-in support for RAG, vector stores, function calling, and streaming`,
  code: `// pom.xml
// <dependency>spring-ai-openai-spring-boot-starter</dependency>

// application.properties
// spring.ai.openai.api-key=\${OPENAI_API_KEY}
// spring.ai.openai.chat.options.model=gpt-4o
// spring.ai.openai.chat.options.temperature=0.7

// 1. Simple chat with auto-configured ChatClient
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final ChatClient chatClient;  // auto-configured by starter

    @GetMapping("/joke")
    public String joke(@RequestParam(defaultValue = "programming") String topic) {
        return chatClient.prompt()
            .user("Tell me a short joke about " + topic)
            .call()
            .content();
    }

    @PostMapping("/chat")
    public String chat(@RequestBody ChatRequest req) {
        return chatClient.prompt()
            .system("You are a helpful Java tutor. Answer concisely.")
            .user(req.getMessage())
            .call()
            .content();
    }
}

// 2. PromptTemplate — parameterized prompts
@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ChatClient chatClient;

    public String reviewCode(String code, String language) {
        PromptTemplate template = new PromptTemplate("""
            Review the following {language} code for bugs, performance issues,
            and best practices. Be specific and concise.

            Code:
            {code}

            Provide your review in bullet points.
            """);

        Prompt prompt = template.create(Map.of(
            "language", language,
            "code", code
        ));

        return chatClient.prompt(prompt).call().content();
    }
}

// 3. Streaming response (for long responses)
@GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
public Flux<String> stream(@RequestParam String question) {
    return chatClient.prompt()
        .user(question)
        .stream()
        .content();          // returns Flux<String>, each item is a token
}

// 4. Structured output — parse response directly to a Java record
record ProductSummary(String name, String category, double price, String description) {}

public ProductSummary extractProduct(String rawText) {
    return chatClient.prompt()
        .user("Extract product info from this text: " + rawText)
        .call()
        .entity(ProductSummary.class);  // Spring AI parses JSON into the record
}`,
  points: [
    'ChatClient.Builder is auto-configured by the starter — inject ChatClient or ChatClient.Builder directly',
    'PromptTemplate uses {variable} placeholders — pass a Map to fill them in at call time',
    'Text blocks (""") make multi-line prompts readable — use them for system prompts and templates',
    'Streaming (Flux<String>) is essential for chat UIs — users see tokens as they arrive, not after the full response',
    '.entity(MyClass.class) lets you parse structured model output directly into a Java record or POJO',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the difference between the system message and the user message?\nA: The system message sets the AI\'s persona, constraints, and behavior for the entire conversation — it is set by the developer and the user typically cannot see or change it. The user message is the actual input from the user. In Spring AI: .system("You are a Java tutor") sets the system message; .user(req.getMessage()) sets the user message.',
    },
    {
      type: 'tip',
      content: 'Keep your API key in environment variables (OPENAI_API_KEY), never in application.properties committed to git. Spring AI reads it via spring.ai.openai.api-key=${OPENAI_API_KEY}. Use a .env file locally and environment variables or secrets managers in production.',
    },
  ],
}
