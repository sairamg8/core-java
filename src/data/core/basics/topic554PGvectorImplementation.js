export default {
  id: 'pgvector-implementation',
  title: '554. PGvector Implementation',
  explanation: `With PGvector enabled and configured (see [[pgvector-setup]]), this topic writes actual Job app code against it — and the most important thing to notice is exactly how little changes compared to \`SimpleVectorStore\` (see [[simple-vector-store]]), the concrete payoff of Spring AI's \`VectorStore\` abstraction.

**Ingesting real job postings into PGvector — literally identical code to the \`SimpleVectorStore\` example from earlier in this chapter:**
\`\`\`java
@Service
public class JobIngestionService {

    private final VectorStore vectorStore;   // now backed by PGvector, not memory

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
Not one line differs from the \`SimpleVectorStore\` version — only the \`@Bean\` definition producing the \`VectorStore\` changed (from \`SimpleVectorStore.builder(...)\` to the auto-configured \`PgVectorStore\`), exactly the same "swap the implementation, keep the interface" pattern already demonstrated concretely with Ollama (see [[spring-ai-with-ollama]]) earlier in this chapter.

**Semantic search over real job postings — now genuinely persistent, surviving application restarts, unlike \`SimpleVectorStore\`:**
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
This reads the \`jobId\` metadata attached at ingestion time (see the \`Map.of("jobId", ...)\` above) to look up the actual, full \`Job\` entity from \`JobRepository\` (see [[user-repository]] for the same repository pattern applied to a different entity) — the vector store finds *which* jobs are semantically relevant; the existing JPA repository still owns retrieving the actual, complete entity data.

**Why this two-step pattern — vector store for "which," JPA repository for "what" — is the right division of responsibility, not an awkward workaround.** The vector store's \`Document\` only needs enough text to embed meaningfully and enough metadata to identify the original record — it deliberately doesn't duplicate the entire \`Job\` entity. This keeps the vector store focused on its one job (semantic matching) while the existing, already-correct JPA layer remains the single source of truth for actual job data — avoiding the exact kind of data-duplication-and-drift problem two separate stores of the same data could otherwise create.`,
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
  codeTitle: 'Ingesting and searching real job postings via PGvector - unchanged from SimpleVectorStore code',
  points: [
    'Application code (ingestion, search) is identical whether the underlying VectorStore is SimpleVectorStore or PgVectorStore - only the @Bean definition changes.',
    'This is the same "swap implementation, keep interface" pattern already demonstrated concretely with switching between OpenAI and Ollama earlier in this chapter.',
    'Unlike SimpleVectorStore, PGvector-backed storage is genuinely persistent, surviving application restarts.',
    'Metadata (like jobId) attached at ingestion time is what connects a vector store search result back to the full entity, retrieved via the existing JobRepository.',
    'The vector store handles "which jobs are semantically relevant"; the JPA repository remains the single source of truth for actual job data - avoiding duplicated, potentially drifting copies of the same information.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Storing the entire data of a Job entity as vector store metadata, rather than just enough to identify and look up the original record (like jobId), duplicates data across two systems that can drift out of sync if a job is later updated only in the database - keeping the vector store metadata minimal and treating JPA as the single source of truth avoids this.' },
    { type: 'interview', content: 'Q: Why does the job search implementation store only a jobId in the vector store metadata rather than the full Job entity data, and look up the actual Job separately via JobRepository?\nA: Storing only enough metadata to identify the original record avoids duplicating full entity data across two separate storage systems (the vector store and the relational database), which would risk the two drifting out of sync if a job is updated in one place but not the other. The responsibility of the vector store is narrowly semantic matching; the JPA repository remains the single, authoritative source of truth for actual job data.' },
  ],
}
