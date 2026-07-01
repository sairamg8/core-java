export default {
  id: 'what-is-rag',
  title: '557. What Is RAG?',
  explanation: `Every piece built across this chapter so far — embeddings (see [[embedding-using-spring-ai]]), chunking (see [[token-text-splitter]]), and a working vector store, PGvector or Redis — has been in service of one specific goal, named explicitly for the first time in this topic: **RAG**, Retrieval-Augmented Generation.

**The problem RAG actually solves — stated concretely, not abstractly.** An LLM like GPT-4 knows nothing about this course's Job app's specific job postings, because that data was never part of its training data and cannot be, since it changes constantly. Asking \`chatClient.prompt().user("What remote jobs mention a 4-day work week?").call()\` directly, with no further help, produces either a confident-sounding but fabricated answer (a hallucination) or an honest "I don't have that information" — neither is useful.

**What RAG actually does, as a sequence of concrete steps, not a vague "AI understands your data" claim.**
\`\`\`text
1. RETRIEVE - embed the user's question, run vectorStore.similaritySearch() against it
             (exactly the operations already built in earlier topics)
2. AUGMENT  - take the retrieved Documents (actual job postings, or relevant chunks of them)
             and insert their text directly into the prompt sent to the LLM
3. GENERATE - the LLM answers the original question, but now with the actual retrieved
             job data available as context in its own prompt
\`\`\`
The LLM is never retrained and never "learns" the Job app's data permanently — every single call retrieves fresh, current data and includes it as prompt context, which is exactly why RAG naturally handles data that changes constantly, unlike training a model on a fixed snapshot.

**Why this specific combination — retrieval, then generation — beats either piece alone.** Plain vector search (everything built so far in this chapter) can find the relevant job postings but cannot write a natural-language answer synthesizing them. Plain LLM generation, with no retrieval, can write fluent prose but has no actual access to the Job app's real, current data, and will confidently invent details rather than admit it does not know. RAG combines both: retrieval supplies the actual facts, generation supplies the natural-language synthesis of those facts.

**Connecting this directly back to the concrete building blocks already in place before this topic named the overall pattern.** The vector store (see [[simple-vector-store]]) already answers "which job postings are relevant to this question." Chunking (see [[token-text-splitter]]) already ensures long postings retrieve as focused, specific sections rather than entire diluted documents. This topic's only new contribution is naming the pattern that ties retrieval and generation together, and setting up what the next topic actually implements in code, using Spring AI's dedicated advisor for exactly this purpose (see [[rag-implementation]]).`,
  code: `// RAG as three explicit steps, before Spring AI automates the wiring in the next topic

// 1. RETRIEVE - reuse the exact vectorStore already built earlier in this chapter
List<Document> relevantJobs = vectorStore.similaritySearch(
    SearchRequest.query(userQuestion).topK(3)
);

// 2. AUGMENT - build a prompt that includes the retrieved data as context
String context = relevantJobs.stream()
    .map(Document::getText)
    .collect(Collectors.joining("\\n---\\n"));

String augmentedPrompt = """
    Answer the question using ONLY the job postings below.
    If the postings don't contain the answer, say so.

    Job postings:
    %s

    Question: %s
    """.formatted(context, userQuestion);

// 3. GENERATE - the LLM now answers with real Job app data as context
String answer = chatClient.prompt(augmentedPrompt).call().content();`,
  codeTitle: 'RAG as three explicit steps: retrieve, augment, generate',
  points: [
    'RAG (Retrieval-Augmented Generation) solves the problem that an LLM has no knowledge of an application’s own private, constantly-changing data, such as this course’s Job app postings.',
    'RAG works as three steps: retrieve relevant documents via vector similarity search, augment the prompt by inserting their text as context, then generate an answer using the LLM with that context available.',
    'The LLM is never retrained - every call retrieves fresh, current data and includes it in that specific prompt, which is exactly why RAG naturally handles data that changes constantly.',
    'Plain vector search alone can find relevant documents but cannot synthesize a natural-language answer; plain LLM generation alone can write fluent prose but has no access to real, current application data and will hallucinate rather than admit it does not know.',
    'Every building block needed for RAG (embeddings, chunking, a vector store) was already built earlier in this chapter - this topic names the overall pattern those pieces combine into.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Believing RAG means the LLM has "learned" or been retrained on the application’s data is a common misconception - the model itself is completely unchanged; each individual call simply retrieves relevant data fresh and includes it as prompt context for that one call, which is exactly why newly added job postings are immediately available with no retraining step.' },
    { type: 'interview', content: 'Q: What specific problem does RAG (Retrieval-Augmented Generation) solve, and why can neither plain vector search nor plain LLM generation solve it alone?\nA: RAG solves the problem that an LLM has no knowledge of an application’s own private, constantly-changing data. Plain vector search can find which documents are relevant but cannot generate a natural-language answer synthesizing them; plain LLM generation can write fluent prose but has no access to that real data and will hallucinate rather than admit it does not know. RAG combines both: retrieval supplies the actual facts as prompt context, and generation supplies the natural-language answer built from those facts.' },
  ],
}
