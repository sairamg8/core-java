export default {
  id: 'entity-insertion-with-persist-method',
  title: '291. Entity Insertion with persist() Method',
  explanation: `Inserting a new row in Hibernate means making a transient object *persistent*. The standard JPA way to do this is the \`persist()\` method. Understanding what \`persist()\` does — and how it differs from the older \`save()\` — is fundamental.

**Entity states:**
- **Transient** — a plain \`new\` object Hibernate does not know about. Not associated with any Session, not in the database.
- **Persistent (managed)** — associated with a Session and tracked; changes are automatically synchronized to the database on flush.
- **Detached** — was persistent, but its Session is closed.

\`persist()\` moves an object from **transient** to **persistent**.

**What persist() does:**
- Adds the entity to the Session's persistence context.
- Schedules an INSERT to run at flush/commit time.
- Returns \`void\` (it does not return the id).
- Is defined by JPA, so it is portable across providers.

**persist() vs. save():**
- \`save()\` is a legacy **Hibernate-native** method; it returns the generated identifier (a \`Serializable\`) and can insert immediately.
- \`persist()\` is the **JPA-standard** method; returns void, and the INSERT may be deferred until flush.
- Modern code should prefer \`persist()\` for portability.

**Transaction requirement:**
\`persist()\` must run inside an active transaction. The actual SQL INSERT is executed when the persistence context is flushed — typically at \`commit()\`.

**Batch inserts:**
You can persist many objects in one transaction; Hibernate batches the INSERTs and flushes them together at commit, which is far more efficient than committing each one separately.

After \`persist()\`, the object is *managed*: if you change a field before commit, Hibernate will include that value — you do not need to call any "update" method.`,
  code: `try (Session session = factory.openSession()) {
    Transaction tx = session.beginTransaction();

    // Transient object: Hibernate does not know about it yet
    Student s = new Student(101, "Nisha", "nisha@example.com");

    // persist() -> object becomes PERSISTENT (managed), INSERT scheduled
    session.persist(s);

    // Because it is now managed, this change is tracked automatically:
    s.setEmail("nisha.k@example.com");   // no update() call needed

    tx.commit();   // flush: INSERT runs with the UPDATED email
}

// ---- Batch insert: many objects, one transaction ----
try (Session session = factory.openSession()) {
    Transaction tx = session.beginTransaction();
    for (int i = 1; i <= 100; i++) {
        session.persist(new Student(i, "Student " + i, "s" + i + "@ex.com"));
    }
    tx.commit();   // Hibernate flushes the batch together
}

/* persist() vs save():
   session.persist(s);              // JPA, returns void  (preferred)
   Serializable id = session.save(s); // Hibernate-native, returns the id (legacy) */`,
  codeTitle: 'Inserting entities with persist()',
  points: [
    'persist() moves an object from the transient state to the persistent (managed) state within a Session',
    'It schedules an INSERT that Hibernate executes at flush/commit time and returns void',
    'persist() is the JPA-standard method; save() is the legacy Hibernate-native method that returns the generated id',
    'persist() must run inside an active transaction, and the INSERT typically fires on commit',
    'Once an entity is managed, later field changes before commit are tracked automatically with no update call',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'persist() and save() differ subtly with detached entities and id generation. persist() may throw if you call it on a detached entity with an assigned id, while save() will try to insert. For new code, standardize on persist() (JPA) and use merge() for detached entities, rather than mixing the two APIs.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between save() and persist() in Hibernate?\nA: save() is a Hibernate-native method that returns the generated identifier and may insert immediately. persist() is the JPA-standard method that returns void and may defer the INSERT until flush. Both make a transient entity persistent, but persist() is preferred in modern code because it is portable across JPA providers.',
    },
  ],
}
