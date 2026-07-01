export default {
  id: 'token-text-splitter',
  title: '551. Token Text Splitter',
  explanation: `Every \`Document\` embedded so far in this chapter (see [[simple-vector-store]]) has been small — a short job description. This topic addresses what happens with genuinely large text — a long document, a full policy PDF, an entire job posting with extensive requirements — and why it needs to be **split** before being embedded, using \`TokenTextSplitter\`.

**Why large documents can't just be embedded whole, as a single vector — a real, hard constraint, not a design preference.** Every embedding model has a maximum input length (a **token limit**) — text beyond that limit either gets silently truncated (losing information) or the call fails outright. Beyond that hard limit, there's a subtler problem: a single embedding vector for an entire long document blends together many different topics and ideas into one vector — search results become less precise, since the resulting single vector is really an average of everything the document discusses, not a focused representation of any one part.

**\`TokenTextSplitter\` — breaking a large document into smaller, focused chunks, each embedded and stored separately:**
\`\`\`java
TokenTextSplitter splitter = new TokenTextSplitter(500, 100, 5, 10000, true);
// chunkSize=500 tokens, minChunkSizeChars=100, minChunkLengthToEmbed=5,
// maxNumChunks=10000, keepSeparator=true

List<Document> chunks = splitter.apply(List.of(largeDocument));
vectorStore.add(chunks);
\`\`\`
Each resulting chunk becomes its own \`Document\`, embedded and stored independently — a similarity search now can match against a *specific, focused section* of a large document, rather than the entire document as one undifferentiated blob.

**Why chunk size is a genuine tuning tradeoff, not an arbitrary number to copy from an example.** Chunks too small lose surrounding context (a sentence about "salary range" without the paragraph that clarifies which role it refers to becomes ambiguous once retrieved in isolation); chunks too large drift back toward the original "one vector represents many topics" imprecision problem. The right chunk size genuinely depends on the specific document type and how the results will be used — again, no universal correct answer to copy blindly.

**Connecting this directly to the Job app's realistic use case, looking ahead to RAG (covered in a few topics, see [[what-is-rag]]).** A long, detailed job posting — responsibilities, requirements, benefits, company description — split into focused chunks means a query about "remote work policy" can retrieve specifically the chunk discussing remote work, rather than the entire posting diluted by everything else it also covers — directly improving the precision of retrieval-augmented answers built later in this chapter.`,
  code: `TokenTextSplitter splitter = new TokenTextSplitter(
    500,    // target chunk size, in tokens
    100,    // minimum chunk size, in characters
    5,      // minimum chunk length to embed at all
    10000,  // max number of chunks per document
    true    // keep the original separator characters
);

List<Document> chunks = splitter.apply(List.of(largeJobPostingDocument));
vectorStore.add(chunks);
// Each chunk is now its own independently searchable Document`,
  codeTitle: 'Splitting a large document into focused, independently embedded chunks',
  points: [
    'Every embedding model has a maximum input token limit - text beyond it is truncated or rejected, which is a hard technical constraint, not just a best practice.',
    'A single embedding vector for a long, multi-topic document blends everything together into one imprecise vector, reducing search result precision.',
    'TokenTextSplitter breaks a large document into smaller chunks, each becoming its own independently embedded and searchable Document.',
    'Chunk size is a genuine tuning tradeoff: too small loses surrounding context, too large drifts back toward the original multi-topic imprecision problem.',
    'Chunking directly improves the precision of retrieval-augmented generation (covered a few topics later), since a query can retrieve the specific relevant chunk rather than an entire diluted document.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Embedding a large document as a single unsplit Document either silently truncates content beyond the token limit of the model or produces one imprecise, multi-topic vector that matches poorly against focused queries - splitting into chunks first avoids both problems, and skipping this step is a common oversight when ingesting real long-form documents.' },
    { type: 'interview', content: 'Q: Why does a large document need to be split into chunks before being embedded and stored in a vector store, rather than embedding the whole document as a single vector?\nA: Every embedding model has a maximum input token limit, so a large document risks truncation or outright failure if embedded whole. Beyond that hard limit, a single vector for a long, multi-topic document blends everything into one imprecise representation, reducing search precision - splitting into focused chunks, each embedded and stored independently, lets a search match against the specific relevant section rather than an entire diluted document.' },
  ],
}
