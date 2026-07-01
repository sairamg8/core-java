export default {
  id: 'data-retrieval-with-get-method',
  title: '296. Data Retrieval with get() Method',
  explanation: `Retrieving a single entity by its primary key is the most common read operation. Hibernate offers two methods: the native \`get()\` and the lazy \`load()\` (JPA's equivalent of get() is \`find()\`). Understanding how \`get()\` behaves — and how it differs from \`load()\` — is essential.

**session.get(Class, id):**
- Immediately hits the database (or first-level cache) and returns the fully-initialized entity.
- Returns \`null\` if no row with that id exists.
- This "eager" behavior makes it safe and predictable.

**session.load(Class, id):**
- Returns a **proxy** without hitting the database immediately; the SELECT is deferred until you access a property.
- Throws \`ObjectNotFoundException\` (lazily) if the id does not exist.
- Use only when you are sure the entity exists and you might not need its data (e.g. to set a foreign-key reference).

**JPA equivalent — find():**
\`entityManager.find(Student.class, id)\` behaves like \`get()\`: eager fetch, returns null if absent. In JPA code, \`find()\` is the standard.

**get() and the first-level cache:**
If the entity is already in the current Session's persistence context, \`get()\` returns the cached instance without a database round trip. Two \`get()\` calls for the same id in one session return the **same object** and issue only one SELECT.

**The safe default:**
Use \`get()\`/\`find()\` unless you have a specific reason to defer loading. Its null-on-missing behavior is easy to handle with a simple null check, and its eager fetch avoids the \`LazyInitializationException\` surprises that \`load()\` proxies can cause after the session closes.

**Choosing between them:**
- Need the data now, or unsure it exists → \`get()\` / \`find()\`.
- Only need a reference (e.g. to build an association) and know it exists → \`load()\` / \`getReference()\`.`,
  code: `try (Session session = factory.openSession()) {

    // get(): eager — hits DB now, returns null if not found
    Student s = session.get(Student.class, 101);
    if (s != null) {
        System.out.println(s.getName());
    } else {
        System.out.println("No student with id 101");
    }

    // First-level cache: second get() in the SAME session -> no new SELECT
    Student again = session.get(Student.class, 101);
    System.out.println(s == again);   // true — same cached instance

    // load(): lazy — returns a proxy, SELECT deferred until a field is used
    Student proxy = session.load(Student.class, 102);
    System.out.println(proxy.getName());  // NOW the SELECT fires
}

// JPA equivalent of get():
Student s = entityManager.find(Student.class, 101);  // eager, null if absent

/* show_sql: get() prints
   Hibernate: select ... from Student where id=?    */`,
  codeTitle: 'get() vs. load() vs. find()',
  points: [
    'get() eagerly hits the database (or first-level cache) and returns the entity, or null if the id does not exist',
    'load() returns a proxy and defers the SELECT until a property is accessed, throwing lazily if the row is missing',
    "JPA's find() behaves like get(): eager fetch, returns null when absent",
    'Within one session, repeated get() calls for the same id return the same cached instance and run only one SELECT',
    'Prefer get()/find() by default; use load()/getReference() only for a known-existing reference you may not need to read',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'load() returning a proxy is a trap after the session closes: if you access the proxy outside the session, Hibernate can no longer run the deferred SELECT and throws LazyInitializationException. When in doubt, use get()/find() so the entity is fully loaded while the session is still open.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between get() and load() in Hibernate?\nA: get() fetches the entity eagerly and returns null if no matching row exists, while load() returns a proxy and defers the database hit until a property is accessed, throwing ObjectNotFoundException lazily if the id is invalid. get() is the safe default; load() is an optimization used when you only need a reference to a known-existing entity.',
    },
  ],
}
