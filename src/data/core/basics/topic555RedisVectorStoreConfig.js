export default {
  id: 'redis-vector-store-config',
  title: '555. Redis Vector Store Config',
  explanation: `With PGvector fully wired in (see [[pgvector-implementation]]), this topic covers the second vector store option flagged back in the introduction (see [[vector-database-introduction]]) — **Redis** — and specifically why setting it up is not as simple as reusing the \`redis:7-alpine\` container already running in this course's Docker Compose setup (see [[running-multiple-containers]]).

**The one critical requirement, stated up front because it is easy to miss.** Plain Redis — including the exact \`redis:7-alpine\` image already used earlier in this course for caching — does **not** support vector search at all. Vector search requires the **RediSearch** module, which ships in the separate **Redis Stack** distribution, not in vanilla Redis. Reusing the existing Redis container for vector storage without switching images fails outright, not with a subtle bug but with clear "unknown command" errors the moment vector operations are attempted.

**The Docker image that actually needs to run instead:**
\`\`\`yaml
redis:
  image: redis/redis-stack-server:latest   # NOT redis:7-alpine - RediSearch required
  ports:
    - "6379:6379"
\`\`\`
This is a genuinely different image, not a configuration flag on the existing one — a caching-only Redis deployment and a vector-search-capable Redis deployment are two different Docker images, even though both speak the same Redis protocol on the same port.

**Adding the Maven dependency for Spring AI's Redis integration:**
\`\`\`xml
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-redis-store-spring-boot-starter</artifactId>
</dependency>
\`\`\`

**Configuring it in \`application.properties\` — notice this looks nothing like the PGvector configuration, because Redis genuinely is a separate connection, not an extension of an existing one:**
\`\`\`properties
spring.ai.vectorstore.redis.uri=redis://localhost:6379
spring.ai.vectorstore.redis.index-name=job_embeddings_index
spring.ai.vectorstore.redis.prefix=job:
\`\`\`
Unlike PGvector, which quietly reused the Job app's existing \`spring.datasource.*\` properties (see [[pgvector-setup]]), Redis needs its own \`uri\` here — a direct, visible consequence of it being a genuinely separate store rather than an extension of PostgreSQL.

**Why this chapter still bothers covering Redis at all, given PGvector already works.** Redis is a purpose-built in-memory store, and its vector search is typically faster than PGvector's for pure similarity lookups at scale — the real tradeoff this topic sets up, resolved concretely once actual code is written against it in the next topic (see [[redis-vector-store-implementation]]), is raw speed and an extra piece of infrastructure to run, versus PGvector's "no new infrastructure" simplicity.`,
  code: `# docker-compose.yml - Redis Stack, not plain Redis, for vector search
redis:
  image: redis/redis-stack-server:latest
  ports:
    - "6379:6379"

<!-- pom.xml -->
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-redis-store-spring-boot-starter</artifactId>
</dependency>

# application.properties
spring.ai.vectorstore.redis.uri=redis://localhost:6379
spring.ai.vectorstore.redis.index-name=job_embeddings_index
spring.ai.vectorstore.redis.prefix=job:`,
  codeTitle: 'Redis Stack (not plain Redis) plus Spring AI Redis vector store configuration',
  points: [
    'Plain Redis, including the redis:7-alpine image already used for caching in this course, does not support vector search - the RediSearch module, shipped only in Redis Stack, is required.',
    'redis/redis-stack-server is a genuinely different Docker image from redis:7-alpine, not a configuration flag on the same one, even though both speak the Redis protocol on the same port.',
    'Redis vector store configuration needs its own uri property, unlike PGvector, which quietly reused the existing spring.datasource.* connection - a direct consequence of Redis being a separate system, not a PostgreSQL extension.',
    'index-name and prefix control how vector data is organized within Redis itself, conceptually similar to a table name for the PGvector setup.',
    'Redis is typically faster than PGvector for pure similarity search at scale, at the cost of running a genuinely separate piece of infrastructure alongside the existing PostgreSQL database.',
  ],
  callouts: [
    { type: 'gotcha', content: 'Pointing Spring AI’s Redis vector store configuration at the existing redis:7-alpine container from the Docker Compose chapter, without switching to redis/redis-stack-server, produces clear command-not-supported errors the moment vector operations run - RediSearch is a separate module only bundled in Redis Stack, not something a configuration property can enable on plain Redis.' },
    { type: 'interview', content: 'Q: Why does using Redis as a Spring AI vector store require a different Docker image than the plain Redis already used for caching earlier in this course?\nA: Vector search in Redis depends on the RediSearch module, which is only bundled in the separate Redis Stack distribution (redis/redis-stack-server), not in vanilla Redis images like redis:7-alpine. Both speak the same Redis protocol on the same port, but only Redis Stack actually understands the vector-indexing commands Spring AI’s Redis vector store issues, so reusing the existing caching container without switching images fails outright.' },
  ],
}
