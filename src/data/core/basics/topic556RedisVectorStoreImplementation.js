export default {
  id: 'redis-vector-store-implementation',
  title: '556. Redis Vector Store Implementation',
  explanation: `With Redis Stack running and configured (see [[redis-vector-store-config]]), this topic writes actual application code against it — and, just like the move from \`SimpleVectorStore\` to \`PgVectorStore\` (see [[pgvector-implementation]]), the payoff of Spring AI's \`VectorStore\` abstraction shows up again as "barely anything changes."

**Ingesting job postings into Redis — identical shape to every earlier \`VectorStore\` example in this chapter:**
\`\`\`java
@Service
public class JobIngestionService {

    private final VectorStore vectorStore;   // now backed by Redis, not PGvector or memory

    public JobIngestionService(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    public void ingestAllJobs(List<Job> jobs) {
        List<Document> documents = jobs.stream()
            .map(job -> new Document(job.getDescription(), Map.of(
                "jobId", job.getId(),
                "title", job.getTitle()
            )))
            .toList();
        vectorStore.add(documents);
    }
}
\`\`\`
This is not merely similar to the PGvector version — it is the exact same code, character for character, only the \`@Bean\` producing \`VectorStore\` differs (auto-configured to \`RedisVectorStore\` instead of \`PgVectorStore\`, based purely on which starter dependency and \`spring.ai.vectorstore.*\` properties are present).

**Searching, equally unchanged:**
\`\`\`java
public List<Job> searchJobs(String query) {
    List<Document> results = vectorStore.similaritySearch(
        SearchRequest.query(query).topK(5)
    );
    return results.stream()
        .map(doc -> jobRepository.findById((Integer) doc.getMetadata().get("jobId")).orElseThrow())
        .toList();
}
\`\`\`
The same "vector store finds *which* jobs are relevant, JPA repository retrieves *what* they actually contain" division of responsibility from the PGvector topic applies unchanged here.

**So what, concretely, is actually different, if the application code is identical?** Only two things, both operational rather than something visible in this code: which Docker image is running (Redis Stack vs PostgreSQL with the PGvector extension, see [[redis-vector-store-config]]), and the underlying similarity search performance characteristics — Redis's in-memory RediSearch index is typically faster for pure vector lookups at scale than PGvector's disk-backed HNSW index, at the cost of running a genuinely separate store from the Job app's primary PostgreSQL database, with the data synchronization considerations that separation reintroduces.

**The concrete decision this leaves for a real deployment — restated plainly, now that both options have actual code behind them.** Choose PGvector when minimizing new infrastructure matters most (the Job app already runs PostgreSQL); choose Redis when raw vector search speed at meaningful scale matters more than that simplicity, or when Redis is already part of the stack for other reasons (as a cache, exactly as configured in the Docker chapter, see [[running-multiple-containers]]) and can be upgraded to Redis Stack without adding a brand-new system.`,
  code: `@Service
public class JobIngestionService {

    private final VectorStore vectorStore;

    public JobIngestionService(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }

    public void ingestAllJobs(List<Job> jobs) {
        List<Document> documents = jobs.stream()
            .map(job -> new Document(job.getDescription(),
                Map.of("jobId", job.getId(), "title", job.getTitle())))
            .toList();
        vectorStore.add(documents);
    }

    public List<Job> searchJobs(String query, JobRepository jobRepository) {
        return vectorStore.similaritySearch(SearchRequest.query(query).topK(5))
            .stream()
            .map(doc -> jobRepository.findById((Integer) doc.getMetadata().get("jobId")).orElseThrow())
            .toList();
    }
}`,
  codeTitle: 'Ingesting and searching job postings via Redis - identical code to the PGvector version',
  points: [
    'Application code for ingestion and search against a Redis-backed VectorStore is character-for-character identical to the PGvector version - only the underlying @Bean auto-configuration differs.',
    'Spring AI selects RedisVectorStore vs PgVectorStore automatically based on which starter dependency and spring.ai.vectorstore.* properties are present, not on anything the application code specifies.',
    'The only real differences between Redis and PGvector are operational: which Docker image runs, and the underlying performance characteristics of the similarity search implementation each store uses.',
    'Redis (via RediSearch) is typically faster for pure vector lookups at scale, an in-memory index, at the cost of running a genuinely separate store from the primary PostgreSQL database the Job app uses.',
    'The practical choice is PGvector for minimal new infrastructure, or Redis for raw search speed or when Redis already exists in the stack for other purposes, such as caching.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Assuming a performance difference between Redis and PGvector will always favor Redis regardless of scale is a mistake - at the modest data volumes typical of a learning project like the Job app, the difference is negligible, and the deciding factor in practice is usually existing infrastructure and operational simplicity, not raw speed.' },
    { type: 'interview', content: 'Q: If the ingestion and search code is character-for-character identical between PGvector and Redis, what actually determines which VectorStore implementation Spring AI wires into the application?\nA: Spring AI auto-configures the VectorStore bean based purely on which vector store starter dependency is on the classpath and which spring.ai.vectorstore.* properties are set - the application code itself, written entirely against the VectorStore interface, has no dependency on either specific implementation and does not change regardless of which one is selected.' },
  ],
}
