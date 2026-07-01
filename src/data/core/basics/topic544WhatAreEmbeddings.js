export default {
  id: 'what-are-embeddings',
  title: '544. What Are Embeddings?',
  explanation: `Every topic so far has been about generating text — a question in, an answer out. This topic introduces a genuinely different kind of model output: **embeddings**, the foundation every remaining topic in this chapter builds toward (vector stores, similarity search, and eventually RAG).

**What an embedding actually is: a numerical representation of text that captures its meaning.** An embedding model takes a piece of text — a word, a sentence, a whole paragraph — and converts it into a **vector**: a fixed-length list of numbers (floating-point values), typically hundreds or thousands of dimensions long. This is a fundamentally different kind of model output than everything covered so far — not more text, but a list of numbers representing that text's meaning in a mathematical space.

**Why "meaning" and "numbers" belong in the same sentence at all — the actual, load-bearing property that makes embeddings useful.** Embedding models are trained specifically so that **texts with similar meaning produce similar vectors** — "a happy dog" and "a joyful puppy" produce vectors that are mathematically close to each other, while "a happy dog" and "quarterly tax filing" produce vectors that are mathematically far apart. This is the entire reason embeddings are useful at all: meaning has been translated into something that can be compared *mathematically*, not just read by a human.

**A concrete, simplified example, to make "vector" and "similar" less abstract.** Imagine (heavily simplified, real embeddings have hundreds of dimensions, not two) a 2D embedding space where the x-axis roughly tracks "formality" and the y-axis roughly tracks "positivity": \`"a joyful puppy"\` might land at \`(0.2, 0.9)\`, \`"a happy dog"\` at \`(0.3, 0.85)\` — close together — while \`"quarterly tax filing"\` lands at \`(0.9, 0.1)\` — far away on both axes. Real embeddings work exactly this way, just with hundreds of dimensions capturing far more nuanced aspects of meaning than two simple axes could.

**Why this matters concretely for the Job app, previewing where this chapter is headed.** A job seeker's search query ("remote backend roles using Spring") and an actual job posting's description don't need to share exact keywords to be a good match — if their embeddings are close together in this mathematical space, they're *semantically* similar, even with completely different wording. This is precisely the capability traditional keyword search (like the \`LIKE\`-based search built earlier in this course, see [[search-by-keyword]]) cannot provide — and exactly what the rest of this chapter builds toward using.`,
  code: `// Conceptually, what an embedding model does:

// Input: "a happy dog"
// Output: [0.023, -0.451, 0.892, ..., 0.104]  (a vector, e.g. 1536 numbers long)

// Input: "a joyful puppy"
// Output: [0.031, -0.438, 0.875, ..., 0.098]  (a DIFFERENT but MATHEMATICALLY CLOSE vector)

// Input: "quarterly tax filing"
// Output: [0.812, 0.203, -0.334, ..., 0.667]  (a vector FAR from both of the above)

// "Closeness" between vectors is measured mathematically (covered next: cosine similarity),
// which is what lets a computer detect that the first two are semantically related.`,
  codeTitle: 'Conceptually: similar meaning produces mathematically close embedding vectors',
  points: [
    'An embedding is a numerical vector (a fixed-length list of numbers, typically hundreds or thousands long) that represents the meaning of a piece of text.',
    'Embedding models are trained so that texts with similar meaning produce mathematically close vectors, and texts with dissimilar meaning produce mathematically distant vectors.',
    'This is a fundamentally different kind of model output than chat/text generation covered in every earlier topic - a list of numbers, not more text.',
    'Real embeddings have hundreds or thousands of dimensions capturing nuanced aspects of meaning, far beyond any simple two-axis analogy.',
    'This directly enables semantic search - matching a job search query to a relevant posting based on meaning, even with completely different wording, something keyword-based search (like earlier LIKE-based search) cannot do.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Assuming embeddings only capture exact synonyms or keyword overlap undersells what they actually represent - two texts about the same underlying concept, phrased in genuinely different ways with no shared vocabulary at all, can still produce close embedding vectors, since the model captures semantic meaning, not surface-level word overlap.' },
    { type: 'interview', content: 'Q: What is an embedding, and what property of embeddings makes them useful for tasks like semantic search?\nA: An embedding is a numerical vector representing the meaning of a piece of text, produced by an embedding model. The key property is that texts with similar meaning produce mathematically close vectors, while dissimilar texts produce distant vectors - this lets a computer detect semantic relatedness between two pieces of text mathematically, even when they share no exact keywords, which is exactly what enables semantic search over traditional keyword matching.' },
  ],
}
