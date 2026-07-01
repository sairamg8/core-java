export default {
  id: 'updating-the-data',
  title: '292. Updating the Data',
  explanation: `Updating data in Hibernate is often surprisingly automatic. If an entity is **managed** (persistent), you simply change its fields and Hibernate detects the change and issues an UPDATE at flush time — a mechanism called **automatic dirty checking**. You rarely need an explicit "update" call for managed entities.

**Three scenarios:**

**1. Updating a managed entity (dirty checking)**
Load an entity with \`get()\` or \`find()\` inside a transaction, change a field, and commit. Hibernate compares the entity's current state to its original snapshot, notices the "dirty" field, and generates an UPDATE automatically. No method call needed.

**2. Updating a detached entity (merge)**
If the entity came from a *previous* session (detached) and you modified it outside a transaction, you reattach it with \`merge()\`. \`merge()\` copies the detached object's state onto a managed instance and returns that managed instance.

**3. The legacy update() method**
Hibernate's native \`update()\` reattaches a detached entity to the session. It is less safe than \`merge()\` (it throws if an entity with the same id is already managed), so prefer \`merge()\` in modern code.

**Key rule — dirty checking only tracks managed entities:**
Changes to a *transient* or *detached* object are invisible to Hibernate until you make it managed (via persist/merge). Inside a session, though, any change to a loaded entity is picked up automatically.

**merge() vs. update():**
- \`merge()\` (JPA) — returns a managed copy; safe if another instance is already managed; works on transient or detached objects.
- \`update()\` (Hibernate-native) — reattaches the *same* instance; throws if a duplicate id is already in the session.

Prefer \`merge()\`. The typical modern pattern is: load-modify-commit for managed entities (dirty checking), and \`merge()\` for anything detached.`,
  code: `// ---- 1) Managed entity: automatic dirty checking (no update call) ----
try (Session session = factory.openSession()) {
    Transaction tx = session.beginTransaction();

    Student s = session.get(Student.class, 101);  // now MANAGED
    s.setEmail("updated@example.com");             // just change the field

    tx.commit();   // Hibernate detects the dirty field -> issues UPDATE
}

// ---- 2) Detached entity: reattach with merge() ----
Student detached;
try (Session s1 = factory.openSession()) {
    detached = s1.get(Student.class, 101);         // loaded...
}                                                  // ...session closed -> DETACHED

detached.setName("Renamed Offline");               // change outside any session

try (Session s2 = factory.openSession()) {
    Transaction tx = s2.beginTransaction();
    Student managed = s2.merge(detached);           // merge copies state in
    tx.commit();                                    // UPDATE runs
}

/* With show_sql=true both cases print:
   Hibernate: update Student set email=?, name=? where id=?  */`,
  codeTitle: 'Dirty checking vs. merge() for updates',
  points: [
    'A managed (persistent) entity is updated automatically: change a field and Hibernate issues an UPDATE on commit',
    'This automatic detection is called dirty checking — Hibernate compares current state to the loaded snapshot',
    'Detached entities are reattached and updated with merge(), which returns a managed copy of the object',
    'Prefer merge() (JPA) over the legacy Hibernate-native update(), which throws if the id is already managed',
    'Changes to transient or detached objects are invisible until you make them managed via persist or merge',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'merge() does not make the object you passed in managed — it returns a different managed instance. A common bug is calling merge(detached) and then continuing to modify the original detached object, expecting changes to persist. Always use the returned instance: Student managed = session.merge(detached); and work with managed.',
    },
    {
      type: 'interview',
      content: 'Q: How do you update an entity in Hibernate, and what is dirty checking?\nA: For a managed entity, you simply load it in a transaction, change its fields, and commit — Hibernate performs dirty checking by comparing the entity to its loaded snapshot and automatically generates an UPDATE for changed fields. For a detached entity, you reattach it with merge(), which copies its state onto a managed instance and returns that instance.',
    },
  ],
}
