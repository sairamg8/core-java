export default {
  id: 'data-retrieval-with-hql',
  title: '309. Data Retrieval with HQL',
  explanation: `This topic focuses on the most common use of HQL: **retrieving data** — fetching entities, filtering, ordering, and getting single vs. multiple results. These are the queries you write every day.

**Fetching all entities:**
\`\`\`
List<Student> all = session.createQuery("FROM Student", Student.class).getResultList();
\`\`\`
\`FROM Student\` (or \`SELECT s FROM Student s\`) returns every Student.

**Filtering with WHERE:**
\`\`\`
FROM Student s WHERE s.age > :minAge AND s.active = true
\`\`\`
HQL supports the usual operators: \`=\`, \`<>\`, \`<\`, \`>\`, \`LIKE\`, \`IN\`, \`BETWEEN\`, \`IS NULL\`.

**Ordering:**
\`\`\`
FROM Student s ORDER BY s.name ASC, s.age DESC
\`\`\`

**Single result vs. list:**
- \`getResultList()\` — returns a \`List\` (empty if nothing matches).
- \`getSingleResult()\` — returns exactly one; throws \`NoResultException\` if none and \`NonUniqueResultException\` if more than one.
- \`getSingleResultOrNull()\` — returns one or null (safer than getSingleResult).
- \`uniqueResult()\` (Hibernate-native) — returns one or null.

**Parameter binding:**
Always bind values with \`setParameter\`, never concatenate:
\`\`\`
createQuery("FROM Student s WHERE s.name = :n", Student.class).setParameter("n", name)
\`\`\`

**LIKE for partial matches:**
\`\`\`
FROM Student s WHERE s.name LIKE :pattern
q.setParameter("pattern", "A%");   // names starting with A
\`\`\`

**IN for a set of values:**
\`\`\`
FROM Student s WHERE s.id IN (:ids)
q.setParameter("ids", List.of(1, 2, 3));
\`\`\`

**TypedQuery for type safety:**
Passing the result class (\`Student.class\`) to \`createQuery\` gives a typed query, so \`getResultList()\` returns \`List<Student>\` without casting.

These building blocks — FROM, WHERE, ORDER BY, parameters, and result methods — cover the vast majority of read queries you will write.`,
  code: `// Fetch all
List<Student> all = session.createQuery(
        "FROM Student", Student.class).getResultList();

// Filter + order, with named parameters
List<Student> adults = session.createQuery(
        "FROM Student s WHERE s.age >= :min ORDER BY s.name ASC", Student.class)
        .setParameter("min", 18)
        .getResultList();

// LIKE for partial match
List<Student> aNames = session.createQuery(
        "FROM Student s WHERE s.name LIKE :p", Student.class)
        .setParameter("p", "A%")
        .getResultList();

// IN for a set of ids
List<Student> some = session.createQuery(
        "FROM Student s WHERE s.id IN (:ids)", Student.class)
        .setParameter("ids", List.of(1L, 2L, 3L))
        .getResultList();

// Single result — use OrNull to avoid NoResultException
Student one = session.createQuery(
        "FROM Student s WHERE s.email = :e", Student.class)
        .setParameter("e", "ravi@example.com")
        .getSingleResultOrNull();

/* getResultList()      -> List (empty if none)
   getSingleResult()    -> exactly one, else throws
   getSingleResultOrNull() -> one or null (safer) */`,
  codeTitle: 'Filtering, ordering, and result methods in HQL',
  points: [
    'FROM Student (or SELECT s FROM Student s) retrieves all entities of a type as a typed list',
    'WHERE supports =, <>, <, >, LIKE, IN, BETWEEN, and IS NULL; ORDER BY sorts ascending or descending',
    'getResultList() returns a list; getSingleResult() throws if not exactly one; getSingleResultOrNull() is safer',
    'Always bind values with setParameter using named (:x) or positional parameters, never string concatenation',
    'Passing the result class to createQuery yields a TypedQuery, so results need no casting',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'getSingleResult() throws NoResultException when nothing matches — not returning null. Wrapping it in try/catch for the "not found" case is clumsy; prefer getSingleResultOrNull() (Hibernate 6+) or uniqueResult(), which return null instead of throwing when there is no match.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between getResultList() and getSingleResult() in HQL/JPQL?\nA: getResultList() returns a List of matching entities, which is empty when nothing matches. getSingleResult() expects exactly one result — it throws NoResultException if there are none and NonUniqueResultException if there is more than one. When a query may return zero or one row, getSingleResultOrNull() (or Hibernate-native uniqueResult()) is safer because it returns null instead of throwing.',
    },
  ],
}
