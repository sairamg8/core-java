export default {
  id: 'jpa-query-dsl',
  title: '406. Query DSL',
  explanation: `Beyond \`findAll()\`/\`findById()\` (see [[jpa-findall]], [[jpa-findbyid]]), Spring Data JPA's most distinctive feature is **derived query methods** — a small DSL (domain-specific language) where the method's *name* is parsed to build the query, with no SQL or JPQL written at all.

\`\`\`java
public interface JobRepository extends JpaRepository<Job, Integer> {
    List<Job> findByProfile(String profile);
    List<Job> findByProfileAndDescriptionContaining(String profile, String keyword);
    List<Job> findByProfileOrderByDescriptionAsc(String profile);
    long countByProfile(String profile);
}
\`\`\`

**How the parsing works:** Spring Data JPA reads the method name as structured English: \`findBy\` + \`Profile\` means "find where the \`profile\` field equals the given argument." Keywords compose:
- \`And\` / \`Or\` — combine conditions (\`findByProfileAndDescriptionContaining\`).
- \`Containing\` — a \`LIKE '%value%'\` match, useful for search (see [[search-by-keyword]]).
- \`OrderBy...Asc\`/\`Desc\` — sorting.
- \`count\`/\`exists\` prefixes instead of \`find\` — different return shapes for the same query logic.

The method name literally *is* the query — get a word wrong (\`findByProfil\` instead of \`findByProfile\`) and Spring fails at **startup**, not silently at runtime, because it tries to parse the name against the entity's actual field names when building the repository proxy.

**When the naming DSL isn't enough**, drop to an explicit **JPQL** query (JPA's SQL-like language, operating on entities and fields rather than tables and columns):
\`\`\`java
@Query("SELECT j FROM Job j WHERE j.profile = :profile AND j.url IS NOT NULL")
List<Job> findWithUrlByProfile(@Param("profile") String profile);
\`\`\`

**Rule of thumb:** derived method names are great for simple, single-condition lookups; once a query needs joins, subqueries, or complex conditions, \`@Query\` with JPQL (or native SQL via \`nativeQuery = true\`) is clearer than an increasingly long method name.`,
  code: `public interface JobRepository extends JpaRepository<Job, Integer> {

    // Derived query - method name parsed into a query, no implementation written
    List<Job> findByProfile(String profile);

    List<Job> findByProfileAndDescriptionContaining(String profile, String keyword);

    // Explicit JPQL, for anything the naming DSL can't cleanly express
    @Query("SELECT j FROM Job j WHERE j.profile = :profile ORDER BY j.description")
    List<Job> findSortedByProfile(@Param("profile") String profile);
}`,
  codeTitle: 'Derived query methods vs explicit @Query/JPQL',
  points: [
    'Derived query methods let Spring Data JPA build a query directly from the method\'s name - no method body or SQL is written.',
    'Keywords like And, Or, Containing, and OrderBy compose to express conditions and sorting in the method name.',
    'A misspelled field name in a derived query method name fails fast at application startup, not silently at runtime.',
    '@Query with JPQL is used when a query is too complex to express cleanly as a method name (joins, subqueries, complex conditions).',
    'JPQL operates on entity names and fields (Job, j.profile), not table and column names, keeping queries independent of the underlying schema naming.',
  ],
  callouts: [
    { type: 'gotcha', content: 'A derived method name that grows past two or three conditions (findByProfileAndDescriptionContainingAndUrlIsNotNullOrderByDescriptionAsc) becomes unreadable - that is the signal to switch to an explicit @Query instead of continuing to extend the method name.' },
    { type: 'interview', content: 'Q: What happens if a derived query method name references a field that does not exist on the entity, like findByProfil (missing the "e")?\nA: Spring Data JPA parses and validates derived method names against the entity\'s actual fields when it builds the repository proxy at application startup. A mismatched field name causes the application to fail to start with a clear error, rather than failing silently or throwing an obscure exception later at runtime.' },
  ],
}
