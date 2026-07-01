export default {
  id: 'pgvector-store-introduction',
  title: '552. PGvector Store Introduction',
  explanation: `\`SimpleVectorStore\` (see [[simple-vector-store]]) demonstrated the \`VectorStore\` interface but isn't persistent or production-capable — this topic introduces **PGvector**, the first of the two real vector store options this chapter covers, and explains specifically why it's the natural first choice for this course given everything already built.

**What PGvector actually is: a PostgreSQL extension, not a separate database product.** It adds a new column type (\`vector\`) and new indexing/query capabilities directly to an existing PostgreSQL installation — the exact same PostgreSQL already running for the Job app since the JPA chapter (see [[spring-data-jpa-introduction]]), not a new, separate system to install, run, and operate alongside it.

**Why this specific property — "it's the same database, just extended" — is the actual reason this chapter introduces PGvector before Redis.** The Job app already has PostgreSQL configured, connected, and deployed (see [[creating-database-in-aws-rds]]) — adding vector search capability to that *same* database means job data and job embeddings can live together, queried in the same transaction if needed, with no new infrastructure, no new connection to manage, and no data synchronization concern between two separate systems.

**What PGvector adds to standard PostgreSQL, conceptually — a new column type and new similarity operators:**
\`\`\`sql
-- Enable the extension (once, per database)
CREATE EXTENSION IF NOT EXISTS vector;

-- A table with a vector column
CREATE TABLE job_embeddings (
    id SERIAL PRIMARY KEY,
    content TEXT,
    embedding VECTOR(1536)   -- 1536 dimensions, matching text-embedding-3-small
);

-- Cosine similarity search, using PGvector's own operator
SELECT content, 1 - (embedding <=> '[0.1, 0.2, ...]') AS similarity
FROM job_embeddings
ORDER BY embedding <=> '[0.1, 0.2, ...]'
LIMIT 5;
\`\`\`
\`<=>\` is PGvector's cosine distance operator — this is the exact same cosine similarity concept from several topics ago (see [[what-is-cosine-similarity]]), now expressed as a native SQL operator rather than a hand-written Java loop, with PostgreSQL's own indexing handling the "don't scan every row" performance concern from the vector database introduction (see [[vector-database-introduction]]).

**What the next two topics cover, in order.** Setting up PGvector for the Job app specifically (the actual installation and configuration), then wiring Spring AI's \`PgVectorStore\` implementation into the app — the exact same \`VectorStore\` interface already used with \`SimpleVectorStore\`, meaning application code barely changes when swapping to this real, persistent implementation.`,
  code: `-- Enable PGvector on the existing Job app database
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE job_embeddings (
    id SERIAL PRIMARY KEY,
    content TEXT,
    embedding VECTOR(1536)
);

-- Cosine similarity search using PGvector's native operator
SELECT content, 1 - (embedding <=> '[0.1, 0.2, ...]') AS similarity
FROM job_embeddings
ORDER BY embedding <=> '[0.1, 0.2, ...]'
LIMIT 5;`,
  codeTitle: 'PGvector adds a vector column type and similarity operators to PostgreSQL',
  points: [
    'PGvector is a PostgreSQL extension, not a separate database product - it adds a vector column type and similarity operators to an existing PostgreSQL installation.',
    'This is the same PostgreSQL database already used for the Job app since the JPA chapter, meaning job data and embeddings can live together with no new infrastructure to run.',
    'The <=> operator computes cosine distance natively in SQL - the exact same cosine similarity concept from earlier in this chapter, now as a database operator instead of a hand-written Java loop.',
    'The own indexing built into PostgreSQL on the vector column handles the "avoid scanning every row" performance concern flagged in the vector database introduction topic.',
    'The next two topics cover setting up PGvector for the Job app and wiring the PgVectorStore from Spring AI - the same VectorStore interface already used with SimpleVectorStore.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Forgetting to run CREATE EXTENSION IF NOT EXISTS vector before creating a table with a VECTOR column results in a clear "type vector does not exist" SQL error - a one-time setup step per database that is easy to miss when following a tutorial that assumes it was already done.' },
    { type: 'interview', content: 'Q: Why does PGvector make sense as the first vector store choice for an application that already uses PostgreSQL, compared to introducing a separate vector database?\nA: PGvector is a PostgreSQL extension, not a separate system - it adds a vector column type and similarity search operators directly to the existing database already running for the application. This avoids introducing new infrastructure, a new connection to manage, and data synchronization concerns between two separate systems, since application data and its embeddings can live in the same database, even the same transaction if needed.' },
  ],
}
