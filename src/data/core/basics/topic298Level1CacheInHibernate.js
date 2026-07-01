export default {
  id: 'level-1-cache-in-hibernate',
  title: '298. Level 1 Cache in Hibernate',
  explanation: `The **first-level cache** (L1 cache) is Hibernate's built-in, always-on cache scoped to a single **Session**. Every Session maintains a persistence context that remembers the entities it has loaded or saved, so repeated access to the same entity within that session does not hit the database again.

**Key characteristics:**
- **Scope: one Session.** The cache lives and dies with the Session. Close the session and the L1 cache is gone.
- **Always on.** You cannot disable it; it is fundamental to how Hibernate works.
- **Per-entity identity.** Within a session, requesting the same entity (same class + id) twice returns the **same Java object** and runs only **one** SELECT.

**How it helps:**
- Avoids duplicate SELECTs for the same row in a unit of work.
- Guarantees object identity: \`get(id) == get(id)\` inside one session.
- Backs dirty checking — Hibernate compares current state to the snapshot it holds in the persistence context.

**Illustration:**
Calling \`session.get(Student.class, 1)\` twice issues only one SQL SELECT; the second call is served from the L1 cache.

**Controlling the L1 cache:**
- \`session.evict(entity)\` — removes a single entity from the cache (it becomes detached).
- \`session.clear()\` — empties the entire persistence context.
- \`session.refresh(entity)\` — reloads the entity from the database, overwriting cached state.

**Scope boundary — different sessions do NOT share L1:**
Two different Sessions each have their **own** first-level cache. An entity loaded in session A is not visible in session B's cache; session B will run its own SELECT. Cross-session sharing is the job of the **second-level cache** (next topic).

**Why it matters:**
The L1 cache is why loops that repeatedly access the same loaded entities are cheap, and why long-running sessions can accumulate memory (every loaded entity is retained). For large batch jobs, periodically \`clear()\` the session to avoid memory bloat.`,
  code: `try (Session session = factory.openSession()) {

    // First call: hits the database
    Student a = session.get(Student.class, 1);   // SELECT ... where id=1

    // Second call, SAME session: served from L1 cache — NO new SELECT
    Student b = session.get(Student.class, 1);   // (no SQL)

    System.out.println(a == b);   // true — same cached instance

    // Evict one entity: it becomes detached, next get() hits DB again
    session.evict(a);
    Student c = session.get(Student.class, 1);   // SELECT runs again

    // Clear the whole persistence context (useful in big batch loops)
    session.clear();
}

// ---- Different sessions have SEPARATE L1 caches ----
Student x, y;
try (Session s1 = factory.openSession()) { x = s1.get(Student.class, 1); } // SELECT
try (Session s2 = factory.openSession()) { y = s2.get(Student.class, 1); } // SELECT again
// s1 and s2 do not share the first-level cache`,
  codeTitle: 'First-level cache behavior within a session',
  points: [
    'The first-level cache is the Session-scoped persistence context; it is always on and cannot be disabled',
    'Within one session, repeated access to the same entity returns the same object and runs only one SELECT',
    'It guarantees object identity within a session and underpins automatic dirty checking',
    'evict() removes one entity, clear() empties the context, and refresh() reloads an entity from the database',
    'Each Session has its own L1 cache — different sessions do not share it; cross-session sharing needs the L2 cache',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'In large batch operations, the first-level cache can silently exhaust memory: every entity you load or persist is retained in the persistence context for the life of the session. When processing thousands of rows, periodically call session.flush() and session.clear() to release them, or use a StatelessSession which has no L1 cache.',
    },
    {
      type: 'interview',
      content: 'Q: What is the first-level cache in Hibernate and what is its scope?\nA: The first-level cache is the Session-level persistence context. It is always enabled and scoped to a single Session, so repeated access to the same entity within that session returns the same object and issues only one SELECT. It guarantees object identity and supports dirty checking. Different sessions have separate first-level caches; sharing across sessions requires the second-level cache.',
    },
  ],
}
