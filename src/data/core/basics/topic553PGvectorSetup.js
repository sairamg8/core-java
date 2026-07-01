export default {
  id: 'pgvector-setup',
  title: '553. PGvector Setup',
  explanation: `With PGvector understood conceptually (see [[pgvector-store-introduction]]), this topic actually enables it — for local development, and for the RDS PostgreSQL instance already running the Job app in production (see [[creating-database-in-aws-rds]]).

**Enabling the extension locally — a one-time SQL command against the Job app's own database:**
\`\`\`sql
CREATE EXTENSION IF NOT EXISTS vector;
\`\`\`
This requires PostgreSQL 12 or later, and the \`pgvector\` extension binary must actually be installed on the PostgreSQL server itself (bundled by default in many managed offerings, including recent AWS RDS PostgreSQL versions — see the note below for the specific check this requires).

**Adding the Maven dependency for Spring AI's PGvector integration — alongside the OpenAI starter already added earlier in this chapter (see [[creating-a-spring-ai-project]]):**
\`\`\`xml
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-pgvector-store-spring-boot-starter</artifactId>
</dependency>
\`\`\`

**Configuring it in \`application.properties\` — reusing the *exact same* database connection already configured for the rest of the Job app:**
\`\`\`properties
spring.ai.vectorstore.pgvector.index-type=HNSW
spring.ai.vectorstore.pgvector.distance-type=COSINE_DISTANCE
spring.ai.vectorstore.pgvector.dimensions=1536
\`\`\`
Notice there's no separate \`url\`/\`username\`/\`password\` here at all — PGvector, being an extension of the same database, automatically uses the existing \`spring.datasource.*\` properties already set up back in the AWS chapter (see [[spring-project-with-database]]) — the concrete payoff of PGvector being "the same database, extended," not a separate system requiring its own connection configuration.

**\`index-type: HNSW\`** — Hierarchical Navigable Small World, the specific ANN indexing algorithm (see [[vector-database-introduction]]) PGvector uses to make similarity search fast without scanning every row — this is the concrete mechanism behind that earlier "approximate nearest neighbor" concept, now a configurable choice rather than an abstract idea.

**The one honest, real-world caveat worth flagging explicitly before deploying this to the Job app's actual RDS instance.** Not every managed PostgreSQL offering supports the \`pgvector\` extension by default, and even AWS RDS requires a specific engine version and, in some configurations, an explicit parameter group change to enable it — checking the specific RDS instance's supported extensions *before* assuming \`CREATE EXTENSION vector\` will simply work in production is worth doing explicitly, rather than discovering the gap only when a deployment fails.`,
  code: `-- Enable the extension (once, per database)
CREATE EXTENSION IF NOT EXISTS vector;

<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-pgvector-store-spring-boot-starter</artifactId>
</dependency>

# application.properties - reuses the existing spring.datasource.* connection
spring.ai.vectorstore.pgvector.index-type=HNSW
spring.ai.vectorstore.pgvector.distance-type=COSINE_DISTANCE
spring.ai.vectorstore.pgvector.dimensions=1536`,
  codeTitle: 'Enabling PGvector and configuring Spring AI to reuse the existing datasource',
  points: [
    'CREATE EXTENSION IF NOT EXISTS vector enables PGvector once per database, requiring PostgreSQL 12+ and the pgvector binary actually installed on the server.',
    'PGvector configuration reuses the existing spring.datasource.* connection properties already set up for the Job app - no separate url/username/password is needed.',
    'index-type=HNSW selects the specific ANN indexing algorithm PGvector uses, the concrete mechanism behind the "approximate nearest neighbor" concept introduced earlier in this chapter.',
    'dimensions must match the actual embedding model in use (1536 for text-embedding-3-small) - a mismatch here causes insert or query failures.',
    'Not every managed PostgreSQL offering supports pgvector by default - checking the supported extensions of the specific RDS instance before deploying is worth doing explicitly, rather than discovering a gap in production.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Setting dimensions in application.properties to a value that does not match the actual output size of the configured embedding model (e.g. configuring 1536 while actually using a different embedding model with a different vector length) causes insert failures the moment real embeddings are stored - this value must be kept in sync with whichever embedding model is actually configured.' },
    { type: 'interview', content: 'Q: Why does configuring the PGvector integration in Spring AI not require any separate database connection properties (url, username, password)?\nA: PGvector is an extension of the same PostgreSQL database already used by the rest of the application, not a separate system - the PGvector store in Spring AI automatically reuses the existing spring.datasource.* connection properties already configured for the application. This is the concrete practical payoff of the core design of PGvector: vector storage lives in the same database as everything else, with no separate connection to manage.' },
  ],
}
