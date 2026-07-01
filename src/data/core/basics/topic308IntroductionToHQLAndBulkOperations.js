export default {
  id: 'introduction-to-hql-jpql-and-bulk-operations',
  title: '308. Introduction to HQL (JPQL) and Bulk Operations in Hibernate',
  explanation: `**HQL (Hibernate Query Language)** is an object-oriented query language that looks like SQL but operates on **entities and their fields** rather than tables and columns. Its JPA-standard equivalent is **JPQL** — they are nearly identical, and Hibernate implements both.

**The key difference from SQL:**
- SQL: \`SELECT * FROM student WHERE email = ?\` (table and column names).
- HQL: \`FROM Student WHERE email = :email\` (entity class name \`Student\` and field name \`email\`).

HQL is database-independent: Hibernate translates it into the correct SQL dialect for your database.

**Basic HQL forms:**
- \`FROM Student\` — all Student entities.
- \`SELECT s FROM Student s WHERE s.name = :name\` — filtered.
- \`SELECT s.name FROM Student s\` — a single field (projection).
- \`SELECT COUNT(s) FROM Student s\` — aggregate.

**Parameters:**
- **Named parameters** (\`:name\`) — preferred; readable and safe.
- **Positional parameters** (\`?1\`) — also supported.
Always use parameters, never string concatenation — HQL parameters prevent injection just like PreparedStatement.

**Running a query:**
\`\`\`
Query<Student> q = session.createQuery("FROM Student WHERE name = :n", Student.class);
q.setParameter("n", "Ravi");
List<Student> result = q.getResultList();
\`\`\`

**Bulk operations (UPDATE / DELETE):**
HQL can update or delete **many rows in one statement** without loading them into memory:
- \`UPDATE Student s SET s.active = false WHERE s.lastLogin < :cutoff\`
- \`DELETE FROM Student s WHERE s.email IS NULL\`
Run these with \`createMutationQuery(...).executeUpdate()\`, which returns the number of affected rows.

**Bulk operation caveats:**
Bulk UPDATE/DELETE run directly against the database. They **bypass the persistence context and caches** — they do not trigger dirty checking, cascade, or update already-loaded entities. After a bulk operation, entities in the session may be stale, so clear the session if you continue to use them.

HQL/JPQL is the workhorse for querying in Hibernate; the following topics dig into retrieval in detail.`,
  code: `// ---- Basic HQL query with a named parameter ----
Query<Student> q = session.createQuery(
        "FROM Student s WHERE s.name = :name", Student.class);
q.setParameter("name", "Ravi");
List<Student> students = q.getResultList();

// ---- Projection: select specific fields ----
List<String> names = session.createQuery(
        "SELECT s.name FROM Student s", String.class).getResultList();

// ---- Aggregate ----
Long count = session.createQuery(
        "SELECT COUNT(s) FROM Student s", Long.class).getSingleResult();

// ---- Bulk UPDATE: many rows, one statement, no loading ----
int updated = session.createMutationQuery(
        "UPDATE Student s SET s.active = false WHERE s.lastLogin < :cutoff")
        .setParameter("cutoff", cutoffDate)
        .executeUpdate();

// ---- Bulk DELETE ----
int deleted = session.createMutationQuery(
        "DELETE FROM Student s WHERE s.email IS NULL")
        .executeUpdate();

/* HQL uses ENTITY and FIELD names (Student, s.name), not table/column names.
   Bulk UPDATE/DELETE bypass the persistence context and caches — clear the
   session afterward if you keep using loaded entities. */`,
  codeTitle: 'HQL queries and bulk update/delete',
  points: [
    'HQL/JPQL is object-oriented: it queries entity classes and fields, not database tables and columns',
    'Hibernate translates HQL into the correct SQL dialect, keeping queries database-independent',
    'Use named (:name) or positional (?1) parameters — never string concatenation — to stay safe from injection',
    'Bulk UPDATE and DELETE modify many rows in one statement via createMutationQuery(...).executeUpdate()',
    'Bulk operations bypass the persistence context and caches, so loaded entities can become stale afterward',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Bulk HQL UPDATE/DELETE do not update the first- or second-level cache and do not run dirty checking or cascades. If you bulk-update rows and then read those entities from the same session, you may get stale cached versions. Call session.clear() (or run the bulk operation in its own session) to avoid working with outdated data.',
    },
    {
      type: 'interview',
      content: 'Q: What is HQL and how does it differ from SQL?\nA: HQL (Hibernate Query Language) is an object-oriented query language that operates on entity classes and their fields rather than tables and columns, and Hibernate translates it into the appropriate SQL dialect. JPQL is its JPA-standard equivalent. Unlike raw SQL, HQL is database-independent and works with the object model, though for bulk UPDATE/DELETE it bypasses the persistence context and caches.',
    },
  ],
}
