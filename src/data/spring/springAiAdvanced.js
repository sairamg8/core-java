export default {
  id: 'spring-ai-advanced',
  title: '2. Spring AI — RAG, Vector Stores & Function Calling',
  explanation: `**RAG (Retrieval-Augmented Generation)** is the most important AI pattern for enterprise applications. Instead of relying on the model's training data (which has a knowledge cutoff and no access to your private data), you:
1. Store your documents in a **vector store** (documents embedded as semantic vectors)
2. At query time, find the most relevant document chunks via **similarity search**
3. Inject those chunks into the prompt as context
4. The model answers using your data, not just its training

**Vector store** stores and searches high-dimensional vectors (embeddings). Embeddings are numerical representations of text that capture semantic meaning — similar text has similar vectors.

**Function Calling (Tool Use)** lets the model call your Java methods. The model decides when to call a tool (e.g., "get current weather", "query database") and Spring AI handles the invocation.`,
  code: `// === RAG Pipeline with Spring AI ===

// pom.xml: spring-ai-openai-spring-boot-starter + spring-ai-pgvector-store-spring-boot-starter

// Step 1: Ingest documents into the vector store (do this once or on update)
@Service
@RequiredArgsConstructor
public class DocumentIngestionService {

    private final VectorStore vectorStore;
    private final TokenTextSplitter textSplitter;

    public void ingestDocuments(List<Resource> resources) {
        // Load, split, embed, and store all in one pipeline
        for (Resource resource : resources) {
            List<Document> docs = new TokenTextSplitter()
                .apply(new TikaDocumentReader(resource).get());

            // Embed and store (Spring AI calls the embedding model automatically)
            vectorStore.add(docs);
        }
    }
}

// Step 2: RAG query — retrieve relevant chunks, then generate answer
@Service
@RequiredArgsConstructor
public class RagService {

    private final ChatClient chatClient;
    private final VectorStore vectorStore;

    public String answer(String question) {
        // Retrieve top-5 most similar document chunks
        List<Document> relevantDocs = vectorStore.similaritySearch(
            SearchRequest.defaults()
                .query(question)
                .topK(5)
                .similarityThreshold(0.7)
        );

        // Build context from retrieved docs
        String context = relevantDocs.stream()
            .map(Document::getContent)
            .collect(Collectors.joining("\n\n---\n\n"));

        // Inject context into the prompt
        return chatClient.prompt()
            .system("""
                You are a helpful assistant. Answer the question using ONLY the
                provided context. If the answer is not in the context, say so.
                """)
            .user("Context:\n" + context + "\n\nQuestion: " + question)
            .call()
            .content();
    }
}

// === Function Calling / Tool Use ===
@Service
public class WeatherService {

    // Mark this method as a tool the AI can call
    @Tool(description = "Get the current weather for a given city")
    public WeatherInfo getWeather(
            @ToolParam(description = "City name, e.g. 'London'") String city) {
        // In real code, call a weather API
        return new WeatherInfo(city, 22.5, "Partly cloudy");
    }
}

record WeatherInfo(String city, double temperatureC, String condition) {}

// Wire the tool into the ChatClient
@RestController
@RequiredArgsConstructor
public class WeatherChatController {

    private final ChatClient chatClient;
    private final WeatherService weatherService;

    @GetMapping("/weather-chat")
    public String chat(@RequestParam String question) {
        return chatClient.prompt()
            .tools(weatherService)   // register the tool
            .user(question)
            .call()
            .content();
        // If the user asks "What's the weather in Tokyo?",
        // the model calls getWeather("Tokyo"), gets the result,
        // and incorporates it into the response automatically.
    }
}`,
  points: [
    'RAG solves the knowledge cutoff problem — your vector store is always up to date, the model is not',
    'Chunk size matters: too large = irrelevant context; too small = lost context. 256-512 tokens per chunk is a common starting point',
    'PGVector (PostgreSQL extension) is the simplest vector store for existing PostgreSQL users; Pinecone and Weaviate are purpose-built alternatives',
    'Function calling is powerful but expensive — each tool call costs extra tokens and latency. Design tools to be specific and coarse-grained',
    'Always validate and sanitize inputs when using RAG or function calling with user-supplied text — prompt injection is a real attack vector',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is RAG and why is it better than fine-tuning for private data?\nA: RAG (Retrieval-Augmented Generation) retrieves relevant documents at query time and injects them into the prompt. Fine-tuning trains the model weights on your data. RAG is better for private/dynamic data because: data can be updated without retraining, the model stays current, it is cheaper (no GPU training cost), and you can see exactly which documents were used (explainability). Fine-tuning is better for changing the model\'s style or behavior patterns.',
    },
    {
      type: 'gotcha',
      content: 'Without a similarity threshold filter, vector search returns results even when nothing relevant exists — the model will hallucinate answers from irrelevant chunks. Always set a minimum threshold (0.6-0.75 is typical) and handle the case where no relevant documents are found.',
    },
  ],
}
