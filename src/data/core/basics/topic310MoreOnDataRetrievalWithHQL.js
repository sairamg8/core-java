export default {
  id: 'more-on-data-retrieval-with-hql',
  title: '310. More on Data Retrieval with HQL',
  explanation: `Beyond simple filters, HQL supports the richer retrieval features you need for real applications: joins, aggregate functions with GROUP BY, pagination, projections into DTOs, and fetch joins to avoid the N+1 problem.

**Joins:**
HQL joins navigate **associations**, not raw columns:
\`\`\`
SELECT e FROM Employee e JOIN e.department d WHERE d.name = :dn
\`\`\`
Because \`Employee\` has a \`department\` association, you join on \`e.department\` — no ON clause needed; Hibernate knows the foreign key.

**Fetch join (solve N+1):**
\`JOIN FETCH\` loads the association in the same query, avoiding lazy-loading round trips:
\`\`\`
SELECT DISTINCT d FROM Department d JOIN FETCH d.employees
\`\`\`
Use \`DISTINCT\` to remove duplicate parents caused by the join.

**Aggregates and GROUP BY:**
\`\`\`
SELECT d.name, COUNT(e) FROM Employee e JOIN e.department d
GROUP BY d.name HAVING COUNT(e) > 5
\`\`\`
Supports \`COUNT\`, \`SUM\`, \`AVG\`, \`MIN\`, \`MAX\`, with \`GROUP BY\` and \`HAVING\`.

**Pagination:**
Do not load thousands of rows — page them:
\`\`\`
query.setFirstResult(20).setMaxResults(10);   // rows 21–30
\`\`\`
Hibernate generates the database-specific LIMIT/OFFSET.

**Projections into DTOs:**
Select specific columns straight into a DTO with the constructor expression:
\`\`\`
SELECT new com.example.StudentDTO(s.id, s.name) FROM Student s
\`\`\`
This fetches only the columns you need — lighter than loading full entities.

**Named queries:**
Define reusable queries with \`@NamedQuery\` on the entity, then run them by name. They are validated at startup, catching HQL errors early.

**Scalar vs. entity results:**
- Selecting the entity (\`SELECT s FROM Student s\`) returns managed entities.
- Selecting fields (\`SELECT s.name, s.email\`) returns \`Object[]\` rows (or a DTO with a constructor expression).

Together these features let HQL express almost any read you would write in SQL, while staying on the object model.`,
  code: `// ---- Join across an association ----
List<Employee> engs = session.createQuery(
        "SELECT e FROM Employee e JOIN e.department d WHERE d.name = :dn",
        Employee.class).setParameter("dn", "Engineering").getResultList();

// ---- Fetch join to avoid N+1 (DISTINCT removes duplicate parents) ----
List<Department> depts = session.createQuery(
        "SELECT DISTINCT d FROM Department d JOIN FETCH d.employees",
        Department.class).getResultList();

// ---- Aggregate + GROUP BY + HAVING (returns Object[] rows) ----
List<Object[]> counts = session.createQuery(
        "SELECT d.name, COUNT(e) FROM Employee e JOIN e.department d " +
        "GROUP BY d.name HAVING COUNT(e) > 5", Object[].class).getResultList();

// ---- Pagination ----
List<Student> page = session.createQuery("FROM Student ORDER BY id", Student.class)
        .setFirstResult(20)   // skip first 20
        .setMaxResults(10)    // take 10  -> rows 21..30
        .getResultList();

// ---- Projection straight into a DTO ----
List<StudentDTO> dtos = session.createQuery(
        "SELECT new com.example.StudentDTO(s.id, s.name) FROM Student s",
        StudentDTO.class).getResultList();`,
  codeTitle: 'Joins, fetch joins, aggregates, paging, and DTO projections',
  points: [
    'HQL joins navigate associations (JOIN e.department) rather than raw columns with ON clauses',
    'JOIN FETCH loads an association in the same query to avoid the N+1 problem; use DISTINCT to dedupe parents',
    'Aggregates (COUNT, SUM, AVG, MIN, MAX) work with GROUP BY and HAVING and return Object[] rows',
    'setFirstResult and setMaxResults paginate results, generating database-specific LIMIT/OFFSET',
    'Constructor-expression projections (SELECT new DTO(...)) fetch only needed columns into a DTO',
  ],
  callouts: [
    {
      type: 'tip',
      content: 'For read-only screens that show only a few fields, prefer DTO projections (SELECT new DTO(...)) over loading full entities. You fetch fewer columns, skip the persistence-context overhead of managing entities, and avoid accidentally triggering lazy loads — a meaningful performance win on list and report pages.',
    },
    {
      type: 'interview',
      content: 'Q: How do you avoid the N+1 problem in HQL, and how do you paginate results?\nA: To avoid N+1, use JOIN FETCH so the association is loaded in the same query as the parent (with DISTINCT to remove duplicate parents), instead of relying on lazy loading per row. For pagination, use setFirstResult (offset) and setMaxResults (page size) on the query, and Hibernate generates the appropriate database-specific LIMIT/OFFSET SQL.',
    },
  ],
}
