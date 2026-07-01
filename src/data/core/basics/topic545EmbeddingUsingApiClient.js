export default {
  id: 'embedding-using-api-client',
  title: '545. Embedding Using API Client',
  explanation: `With embeddings understood conceptually (see [[what-are-embeddings]]), this topic calls OpenAI's embedding API directly, using a raw HTTP client — deliberately bypassing Spring AI for one topic, to see the actual request/response shape underneath before the next topic reintroduces Spring AI's abstraction on top of it.

**A raw HTTP call to OpenAI's embeddings endpoint, using Java's built-in HTTP client — no Spring AI dependency involved at all:**
\`\`\`java
HttpClient client = HttpClient.newHttpClient();

String requestBody = """
    {
      "model": "text-embedding-3-small",
      "input": "a happy dog"
    }
    """;

HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.openai.com/v1/embeddings"))
    .header("Authorization", "Bearer " + apiKey)
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
    .build();

HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
\`\`\`

**The actual raw JSON response — the exact shape "embedding" has been an abstraction for until this point:**
\`\`\`json
{
  "data": [
    { "embedding": [0.023, -0.451, 0.892, "... 1536 numbers total"], "index": 0 }
  ],
  "model": "text-embedding-3-small",
  "usage": { "prompt_tokens": 3, "total_tokens": 3 }
}
\`\`\`
The \`embedding\` field is a plain JSON array of 1536 floating-point numbers, for this specific model — exactly the vector described conceptually in the previous topic, now seen as it actually travels over the wire.

**Why deliberately doing this the "hard way" once, with a raw HTTP client, is worth the detour before the next topic shows the much simpler Spring AI equivalent.** Seeing the literal JSON response — a \`data\` array, an \`embedding\` field holding a flat array of numbers, a \`usage\` field tracking token cost exactly like chat completions did (see [[chatresponse-and-metadata]]) — makes concrete exactly what Spring AI's embedding abstraction, covered next, is actually wrapping. This mirrors the same "see the raw mechanics once, then use the framework abstraction" approach already used earlier in this course for BCrypt (see [[what-is-bcrypt]]) and JWT (see [[what-is-jwt]]).

**Why \`text-embedding-3-small\` specifically, and what the model name choice affects.** Different embedding models produce vectors of different lengths (dimensions) and different quality/cost tradeoffs — \`text-embedding-3-small\` is OpenAI's efficient, lower-cost option, appropriate for most applications; larger embedding models produce more nuanced vectors at higher cost, mirroring the same cost/capability tradeoff already covered for chat models (see [[chatclient-builder]]).`,
  code: `HttpClient client = HttpClient.newHttpClient();

String requestBody = """
    {"model": "text-embedding-3-small", "input": "a happy dog"}
    """;

HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.openai.com/v1/embeddings"))
    .header("Authorization", "Bearer " + apiKey)
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
    .build();

HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

// Raw response shape:
// { "data": [{ "embedding": [0.023, -0.451, ...], "index": 0 }],
//   "model": "text-embedding-3-small", "usage": {...} }`,
  codeTitle: 'Calling the raw OpenAI embeddings API directly, no Spring AI involved',
  points: [
    'The raw OpenAI embeddings API returns a JSON response with a data array containing an embedding field - a flat array of floating-point numbers (1536 for text-embedding-3-small).',
    'This is exactly the vector concept from the previous topic, now seen in its actual over-the-wire JSON shape.',
    'Seeing the raw request/response once, before the framework abstraction, mirrors the same approach already used for BCrypt and JWT earlier in this course.',
    'The usage field tracks token cost for embedding calls exactly the same way it did for chat completions, since embedding calls are also billed per token.',
    'Different embedding models (like text-embedding-3-small vs. larger variants) trade off vector quality/nuance against cost, the same tradeoff already covered for chat model selection.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Assuming embedding vectors from different models are directly comparable to each other is a mistake - a vector produced by one embedding model has no meaningful relationship to a vector produced by a different model, even for the same input text; similarity comparisons only make sense between vectors produced by the same model.' },
    { type: 'interview', content: 'Q: What does the raw JSON response from the OpenAI embeddings API actually contain, and how does its usage field relate to billing?\nA: The response contains a data array, each entry holding an embedding field - a flat array of floating-point numbers representing the input text as a vector - along with the model name and a usage field. The usage field reports prompt_tokens and total_tokens, since embedding calls are billed per token exactly like chat completion calls, just typically at a much lower per-token cost.' },
  ],
}
