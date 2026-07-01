export default {
  id: 'simple-vector-store',
  title: '550. Simple Vector Store',
  explanation: `Before wiring in a real vector database like PGvector or Redis (both covered in the next few topics), this topic uses Spring AI's \`SimpleVectorStore\` — an in-memory, no-external-dependency implementation of the exact \`VectorStore\` interface introduced conceptually in the previous topic (see [[vector-database-introduction]]) — the same "simplest possible version first" approach used consistently throughout this entire course.

**Setting it up — genuinely no new infrastructure at all, just a bean definition:**
\`\`\`java
@Bean
public VectorStore vectorStore(EmbeddingModel embeddingModel) {
    return SimpleVectorStore.builder(embeddingModel).build();
}
\`\`\`
No database, no Docker container, no connection string — \`SimpleVectorStore\` keeps everything in memory, in the running Java process itself.

**Using it — the exact same \`VectorStore\` interface every other vector store implementation in this chapter shares:**
\`\`\`java
@Autowired
private VectorStore vectorStore;

public void ingestJobs(List<Job> jobs) {
    List<Document> documents = jobs.stream()
        .map(job -> new Document(job.getDescription(), Map.of("jobId", job.getId())))
        .toList();
    vectorStore.add(documents);
}

public List<Document> search(String query) {
    return vectorStore.similaritySearch(SearchRequest.query(query).topK(5));
}
\`\`\`
\`vectorStore.add(...)\` automatically calls the embedding model on each \`Document\`'s text internally — the embedding step from earlier topics (see [[embedding-using-spring-ai]]) happens transparently, not as a separate manual step the calling code needs to perform.

**Why \`SimpleVectorStore\`'s two real limitations — stated honestly, not glossed over — matter, and why they're acceptable for this topic's purpose anyway.** It's **not persistent** (every stored vector is lost when the application restarts) and it's **not efficient at scale** (it performs a linear scan internally, exactly the same limitation flagged for the hand-written implementation two topics ago, see [[cosine-similarity-implementation]]) — genuinely unsuitable for production use with any meaningful amount of data.

**Why this topic exists anyway, despite those real limitations — the same "isolate one variable" principle already applied throughout this course.** \`SimpleVectorStore\` lets the \`VectorStore\` interface itself — \`add()\`, \`similaritySearch()\`, the \`Document\` shape — be learned and tested with zero infrastructure setup, before the next several topics introduce the genuine complexity of a real, persistent, production-capable vector store (PGvector, then Redis) on top of an already-familiar interface.`,
  code: `@Bean
public VectorStore vectorStore(EmbeddingModel embeddingModel) {
    return SimpleVectorStore.builder(embeddingModel).build();
}

@Service
public class JobSearchService {

    private final VectorStore vectorStore;

    public JobSearchService(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    public void ingestJobs(List<Job> jobs) {
        List<Document> documents = jobs.stream()
            .map(job -> new Document(job.getDescription(), Map.of("jobId", job.getId())))
            .toList();
        vectorStore.add(documents);
    }

    public List<Document> search(String query) {
        return vectorStore.similaritySearch(SearchRequest.query(query).topK(5));
    }
}`,
  codeTitle: 'SimpleVectorStore - the VectorStore interface with zero external infrastructure',
  points: [
    'SimpleVectorStore is an in-memory VectorStore implementation requiring no database or Docker container - just a bean definition.',
    'vectorStore.add(documents) calls the embedding model internally on the text of each document automatically - embedding happens transparently, not as a separate manual step.',
    'SimpleVectorStore is not persistent (data is lost on restart) and not efficient at scale (it performs a linear scan internally), making it genuinely unsuitable for production.',
    'These limitations are acceptable here specifically because this topic exists to learn the VectorStore interface (add, similaritySearch, Document) with zero infrastructure setup.',
    'Every real vector store covered in the following topics (PGvector, Redis) implements this exact same VectorStore interface - the application code barely changes when swapping the underlying implementation.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Using SimpleVectorStore in a real deployed application, expecting ingested data to survive a restart or scale to a large number of documents, will fail on both counts - it exists specifically for learning and local testing, not production use; the next several topics cover the actual production-capable alternatives.' },
    { type: 'interview', content: 'Q: What is SimpleVectorStore useful for, and what are its two main limitations that make it unsuitable for production?\nA: SimpleVectorStore lets the VectorStore interface (add, similaritySearch, Document) be learned and tested with zero external infrastructure, since it stores everything in memory within the running Java process. Its two limitations are that it is not persistent (all data is lost when the application restarts) and not efficient at scale (it performs a linear scan internally rather than using proper indexing), making it appropriate only for learning and local testing, not production.' },
  ],
}
