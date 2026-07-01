export default {
  id: 'rag-implementation',
  title: '558. RAG Implementation',
  explanation: `The previous topic (see [[what-is-rag]]) built RAG manually, three explicit steps in application code. Spring AI provides a dedicated **Advisor** — the exact same cross-cutting interception mechanism already used for conversation memory (see [[spring-ai-memory-advisor]]) — that automates all three steps into a single line of configuration: \`QuestionAnswerAdvisor\`.

**Wiring \`QuestionAnswerAdvisor\` into the \`ChatClient\`:**
\`\`\`java
@Bean
public ChatClient chatClient(ChatClient.Builder builder, VectorStore vectorStore) {
    return builder
        .defaultAdvisors(QuestionAnswerAdvisor.builder(vectorStore).build())
        .build();
}
\`\`\`
That single \`QuestionAnswerAdvisor.builder(vectorStore)\` line replaces the entire manual retrieve-augment-generate sequence written out explicitly in the previous topic — the advisor intercepts every request through this \`ChatClient\`, automatically runs a similarity search against \`vectorStore\` using the user's own question, and inserts the retrieved documents into the prompt before it ever reaches the LLM.

**Using it — the calling code looks exactly like any other \`ChatClient\` call, with no visible RAG-specific logic at all:**
\`\`\`java
@GetMapping("/ask")
public String askAboutJobs(@RequestParam String question) {
    return chatClient.prompt()
        .user(question)
        .call()
        .content();
}
\`\`\`
This is the concrete payoff of the Advisor pattern already established with conversation memory — RAG becomes an aspect of the \`ChatClient\` itself, configured once, rather than logic every controller method needs to repeat.

**Customizing what gets retrieved and how it is presented to the model — the two parameters worth tuning beyond the defaults:**
\`\`\`java
QuestionAnswerAdvisor.builder(vectorStore)
    .searchRequest(SearchRequest.builder().topK(3).similarityThreshold(0.7).build())
    .build();
\`\`\`
\`topK(3)\` bounds how many job postings get retrieved and inserted as context per question (too many wastes tokens and dilutes relevance, too few risks missing the actually relevant posting). \`similarityThreshold(0.7)\` discards retrieved documents below that similarity score entirely, rather than always inserting the top-K results even when none are genuinely relevant to the question asked — directly addressing the "confidently answers from irrelevant context" failure mode a naive RAG setup without a threshold can produce.

**Bringing the entire vector store chapter together, concretely, in this one feature.** Every piece built across this chapter — embeddings, chunking for long postings, a working PGvector or Redis-backed \`VectorStore\` — feeds directly into this single advisor. A user asking \`"What remote jobs mention flexible hours?"\` through this \`/ask\` endpoint now gets an answer genuinely grounded in the Job app's actual, current job postings, not a fabricated guess, using data ingested and embedded by application code already written earlier in this chapter, with zero further vector-search logic duplicated at the controller level.`,
  code: `@Bean
public ChatClient chatClient(ChatClient.Builder builder, VectorStore vectorStore) {
    return builder
        .defaultAdvisors(
            QuestionAnswerAdvisor.builder(vectorStore)
                .searchRequest(SearchRequest.builder().topK(3).similarityThreshold(0.7).build())
                .build())
        .build();
}

@RestController
public class JobQaController {

    private final ChatClient chatClient;

    public JobQaController(ChatClient chatClient) {
        this.chatClient = chatClient;
    }

    @GetMapping("/ask")
    public String askAboutJobs(@RequestParam String question) {
        return chatClient.prompt()
            .user(question)
            .call()
            .content();
    }
}`,
  codeTitle: 'QuestionAnswerAdvisor - RAG as one line of ChatClient configuration',
  points: [
    'QuestionAnswerAdvisor automates the entire manual retrieve-augment-generate sequence from the previous topic into a single defaultAdvisors(...) configuration line.',
    'It uses the same Advisor mechanism already established for conversation memory - RAG becomes an aspect of the ChatClient itself, not logic repeated in every controller method.',
    'Calling code (chatClient.prompt().user(question).call()) looks identical to a plain, non-RAG ChatClient call - there is no RAG-specific logic visible at the call site at all.',
    'topK bounds how many documents get retrieved and inserted as context per question; similarityThreshold discards retrieved results below a set relevance score, preventing genuinely irrelevant documents from being inserted just because they were the closest available match.',
    'This single advisor is the concrete point where every earlier piece of this chapter - embeddings, chunking, a working PGvector or Redis VectorStore - actually comes together into a working, grounded question-answering feature over the Job app’s real data.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Omitting similarityThreshold means QuestionAnswerAdvisor always inserts the top-K nearest documents as context, even when none of them are actually relevant to the question asked - the LLM will then often still generate a confident-sounding answer grounded in irrelevant context rather than admitting no relevant data was found, which a similarity threshold cutoff directly prevents.' },
    { type: 'interview', content: 'Q: What does adding QuestionAnswerAdvisor to a ChatClient actually automate, compared to the manual retrieve-augment-generate steps written out explicitly in the previous topic?\nA: QuestionAnswerAdvisor automatically runs a similarity search against the configured VectorStore using the user’s own question, then inserts the retrieved documents into the prompt before it reaches the LLM - all three manual steps (retrieve, augment, generate) become a single configuration line on the ChatClient. The calling code at the controller level looks identical to any other ChatClient call, with no RAG-specific logic visible at the call site.' },
  ],
}
