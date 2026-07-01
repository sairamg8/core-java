export default {
  id: 'level-2-cache-in-hibernate-ehcache',
  title: '299. Level 2 Cache in Hibernate (EhCache)',
  explanation: `The **second-level cache** (L2 cache) is an optional, **SessionFactory-scoped** cache shared across all sessions. Where the first-level cache lives only inside one session, the L2 cache lets entities loaded in one session be served to another — reducing database hits application-wide. **EhCache** is a popular L2 cache provider.

**Key characteristics:**
- **Scope: SessionFactory** (the whole application), so it survives individual sessions.
- **Optional and off by default** — you must explicitly enable and configure it.
- **Per-entity opt-in** — you mark which entities are cacheable with \`@Cacheable\` / \`@Cache\`.
- **Provider-based** — Hibernate delegates storage to a provider like EhCache, Infinispan, or Caffeine (usually via the JCache/\`hibernate-jcache\` bridge).

**Setup steps (with EhCache via JCache):**
1. Add dependencies: \`hibernate-jcache\` + an EhCache implementation.
2. Enable L2 in configuration: \`hibernate.cache.use_second_level_cache=true\` and set the region factory to the JCache factory.
3. Provide an EhCache config file (\`ehcache.xml\`) defining cache regions and eviction/TTL policies.
4. Annotate cacheable entities with \`@Cache(usage = ...)\`.

**Concurrency strategies (\`CacheConcurrencyStrategy\`):**
- \`READ_ONLY\` — fastest; for data that never changes after insert.
- \`NONSTRICT_READ_WRITE\` — for rarely-updated data; small chance of stale reads.
- \`READ_WRITE\` — for updatable data; uses soft locks to stay consistent.
- \`TRANSACTIONAL\` — for JTA environments.

**Query cache (separate):**
The L2 cache stores *entities*. Caching *query results* requires the separate **query cache** (\`hibernate.cache.use_query_cache=true\` plus \`setCacheable(true)\` on the query).

**When to use it:**
Great for **read-mostly reference data** (countries, categories, config) accessed frequently across many sessions. For write-heavy data it adds overhead and staleness risk, so use it selectively — not on every entity.`,
  code: `<!-- 1) pom.xml: JCache bridge + EhCache implementation -->
<dependency>
    <groupId>org.hibernate.orm</groupId>
    <artifactId>hibernate-jcache</artifactId>
    <version>6.4.4.Final</version>
</dependency>
<dependency>
    <groupId>org.ehcache</groupId>
    <artifactId>ehcache</artifactId>
    <version>3.10.8</version>
</dependency>

<!-- 2) Enable L2 cache in hibernate.cfg.xml -->
<property name="hibernate.cache.use_second_level_cache">true</property>
<property name="hibernate.cache.region.factory_class">jcache</property>

// 3) Mark an entity as cacheable in the L2 cache (Java)
import jakarta.persistence.Cacheable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Country {
    @Id private int id;
    private String name;   // read-mostly reference data — ideal for L2
}

/* Now: entity loaded in session A is served from L2 to session B
   -> no second SELECT across sessions.

   Query cache is separate (stores query results, not entities):
     hibernate.cache.use_query_cache = true
     query.setCacheable(true);
*/`,
  codeTitle: 'Enabling the EhCache second-level cache',
  points: [
    'The second-level cache is SessionFactory-scoped and shared across sessions, unlike the per-session L1 cache',
    'It is optional, off by default, and enabled via configuration with a provider such as EhCache (through hibernate-jcache)',
    'Entities opt in with @Cacheable/@Cache, and a concurrency strategy (READ_ONLY, READ_WRITE, etc.) controls consistency',
    'The L2 cache stores entities; caching query results requires the separate query cache',
    'It is best for read-mostly reference data accessed across many sessions, not for write-heavy entities',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'The second-level cache can serve stale data if the database is modified outside Hibernate (e.g. by a raw SQL script, another application, or an HQL bulk update). Hibernate only invalidates L2 entries for changes it makes itself. For data that external processes can change, either avoid L2 caching or use short TTLs.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between the first-level and second-level cache in Hibernate?\nA: The first-level cache is Session-scoped, always on, and not shared between sessions. The second-level cache is SessionFactory-scoped, optional, and shared across all sessions, backed by a provider like EhCache. L1 avoids duplicate queries within one session, while L2 avoids them across sessions — best used for read-mostly reference data that multiple sessions access.',
    },
  ],
}
