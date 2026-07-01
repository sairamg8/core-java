export default {
  id: 'embedding-using-spring-ai',
  title: '546. Embedding Using Spring AI',
  explanation: `The raw HTTP call from the previous topic (see [[embedding-using-api-client]]) works, but manually building JSON, sending HTTP requests, and parsing responses for every embedding call would be exactly the kind of boilerplate Spring AI exists to eliminate (see [[why-spring-ai]]) — this topic does the same thing through Spring AI's \`EmbeddingModel\` abstraction instead.

**Adding embedding support — the same OpenAI starter already added earlier in this chapter already includes it:**
\`\`\`java
@Autowired
private EmbeddingModel embeddingModel;

public float[] embed(String text) {
    return embeddingModel.embed(text);
}
\`\`\`
No new dependency needed — \`spring-ai-openai-spring-boot-starter\` (see [[creating-a-spring-ai-project]]) auto-configures both \`ChatModel\` (for chat) and \`EmbeddingModel\` (for embeddings) from the same starter, since both are capabilities of the same underlying OpenAI integration.

**Comparing this one line, \`embeddingModel.embed(text)\`, against the entire raw HTTP call from the previous topic.** No manual JSON construction, no HTTP client setup, no response parsing — \`embed(String)\` takes a plain string and returns a plain \`float[]\` array directly, the exact same vector concept from two topics ago (see [[what-are-embeddings]]), with every mechanical step from the previous topic handled internally.

**Embedding multiple texts at once — a genuinely more efficient batch operation, not just a convenience method:**
\`\`\`java
EmbeddingResponse response = embeddingModel.embedForResponse(
    List.of("Backend Engineer role", "Frontend Developer role", "Data Scientist role")
);
List<float[]> vectors = response.getResults().stream()
    .map(Embedding::getOutput)
    .toList();
\`\`\`
Batching multiple texts into one call is typically more efficient than making separate calls per text — fewer network round trips, and often better pricing per item — directly relevant to the next major topic in this chapter, ingesting many job postings into a vector store at once (see [[vector-database-introduction]]).

**Why this same "raw API first, then framework abstraction" comparison matters as a recurring habit, not just for this one topic.** Having seen the actual JSON shape underneath in the previous topic, \`embeddingModel.embed(text)\` isn't a black box — it's now understood exactly what work that one line is doing on the calling code's behalf, the same habit of understanding what an abstraction replaces (not just that it exists) already emphasized for \`UserDetailsService\` and \`AuthenticationProvider\` much earlier in this course.`,
  code: `@Service
public class EmbeddingService {

    private final EmbeddingModel embeddingModel;

    public EmbeddingService(EmbeddingModel embeddingModel) {
        this.embeddingModel = embeddingModel;
    }

    public float[] embed(String text) {
        return embeddingModel.embed(text);
    }

    public List<float[]> embedBatch(List<String> texts) {
        EmbeddingResponse response = embeddingModel.embedForResponse(texts);
        return response.getResults().stream()
            .map(Embedding::getOutput)
            .toList();
    }
}`,
  codeTitle: 'EmbeddingModel - the same one line replacing the entire raw HTTP call',
  points: [
    'EmbeddingModel is auto-configured by the same spring-ai-openai-spring-boot-starter already added earlier in this chapter - no new dependency is needed.',
    'embeddingModel.embed(String) returns a plain float[] vector directly, replacing every manual step (JSON building, HTTP call, response parsing) from the raw approach in the previous topic.',
    'embedForResponse(List<String>) batches multiple texts into one call, which is typically more efficient (fewer round trips, often better pricing) than embedding each text separately.',
    'Batch embedding becomes directly relevant to the upcoming topic on ingesting many job postings into a vector store at once.',
    'Having seen the raw HTTP mechanics in the previous topic first makes this abstraction genuinely understood, not just used - the same "see the mechanics, then the abstraction" habit already applied to UserDetailsService and AuthenticationProvider earlier in this course.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Calling embeddingModel.embed(text) separately in a loop for a large batch of texts (like ingesting hundreds of job postings) works but is meaningfully less efficient than a single embedForResponse(List<String>) call - batching should be used whenever multiple texts need embedding at once, rather than looping over individual embed() calls.' },
    { type: 'interview', content: 'Q: What does embeddingModel.embed(text) in Spring AI actually replace, in terms of the work done underneath it?\nA: It replaces the entire manual process of building a JSON request body, making an authenticated HTTP POST to the embeddings endpoint of the provider, and parsing the JSON response to extract the embedding array - all of which was done explicitly with a raw HTTP client in the previous topic. The EmbeddingModel in Spring AI handles all of that internally, returning a plain float[] vector directly from a single method call.' },
  ],
}
