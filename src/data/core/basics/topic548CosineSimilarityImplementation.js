export default {
  id: 'cosine-similarity-implementation',
  title: '548. Cosine Similarity Implementation',
  explanation: `The formula from the previous topic (see [[what-is-cosine-similarity]]) is now implemented directly in Java — deliberately by hand, once, even though a real vector store computes this internally, for exactly the same "see the raw mechanics once" reason already applied to the embeddings API call a few topics ago (see [[embedding-using-api-client]]).

**A direct, literal translation of the formula into Java:**
\`\`\`java
public static double cosineSimilarity(float[] a, float[] b) {
    double dotProduct = 0.0;
    double normA = 0.0;
    double normB = 0.0;

    for (int i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
\`\`\`

**Reading each accumulated value back against the formula from the previous topic, term by term.** \`dotProduct\` is \`A · B\` — the sum of each pair of corresponding components multiplied together. \`normA\` and \`normB\` accumulate the sum of squares for each vector; \`Math.sqrt(normA)\` is \`||A||\` (the magnitude/length of vector \`A\`) — a single loop computes all three running totals simultaneously, since each iteration only needs to look at index \`i\` of both vectors once.

**A quick sanity check with simple numbers, to confirm the implementation behaves as expected before trusting it on real embeddings.**
\`\`\`java
float[] identical1 = {1.0f, 0.0f};
float[] identical2 = {2.0f, 0.0f};   // same direction, different magnitude
cosineSimilarity(identical1, identical2);  // 1.0 - same direction = maximal similarity

float[] perpendicular1 = {1.0f, 0.0f};
float[] perpendicular2 = {0.0f, 1.0f};
cosineSimilarity(perpendicular1, perpendicular2);  // 0.0 - right angle = unrelated
\`\`\`
The first pair confirms magnitude genuinely doesn't affect the result (exactly the property the previous topic explained); the second confirms a right angle correctly produces \`0.0\`.

**Why a real production system doesn't actually call this hand-written method directly, on every job posting, for every search — the honest limitation this implementation exposes.** Computing cosine similarity against *every single* stored embedding, one at a time in a loop, is a **linear scan** — perfectly fine for a handful of job postings, but genuinely too slow to compute fresh for every search once there are thousands or millions of stored vectors. This is exactly the performance gap a **vector database** (the very next topic, see [[vector-database-introduction]]) is built to close — using specialized indexing structures to find approximately-nearest vectors far faster than comparing against every single one.`,
  code: `public static double cosineSimilarity(float[] a, float[] b) {
    double dotProduct = 0.0;
    double normA = 0.0;
    double normB = 0.0;

    for (int i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Sanity checks:
// cosineSimilarity({1,0}, {2,0}) -> 1.0  (same direction, magnitude ignored)
// cosineSimilarity({1,0}, {0,1}) -> 0.0  (right angle, unrelated)`,
  codeTitle: 'A hand-written cosineSimilarity(), verified with simple sanity-check vectors',
  points: [
    'The Java implementation directly mirrors the formula: dotProduct accumulates A·B, normA/normB accumulate sum-of-squares (used to compute the magnitude of each vector via Math.sqrt).',
    'A single loop computes all three running totals simultaneously, since each pair of corresponding vector components is only needed once per iteration.',
    'Sanity-checking with simple vectors (same direction but different magnitude producing 1.0; a right angle producing 0.0) confirms the implementation behaves as predicted by the formula from the previous topic.',
    'Comparing a query vector against every stored embedding in a loop (a linear scan) is fine for a handful of items but too slow once there are thousands or millions of stored vectors.',
    'This performance gap is exactly what a vector database, covered in the very next topic, is built to solve using specialized indexing rather than brute-force comparison.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Calling a hand-written cosineSimilarity() method like this one in a loop against every row in a large, real job postings table on every search request works correctly but does not scale - this linear-scan approach is exactly what a proper vector database replaces with indexed similarity search, covered in the next topic.' },
    { type: 'interview', content: 'Q: Why would a real production application use a vector database instead of computing cosine similarity by hand against every stored embedding for each search?\nA: Computing cosine similarity against every single stored vector one at a time (a linear scan) is correct but does not scale - it becomes too slow once there are thousands or millions of stored embeddings, since search time grows linearly with the number of stored items. A vector database uses specialized indexing structures to find approximately-nearest vectors far faster than comparing against every one individually, which is essential for real-world scale.' },
  ],
}
