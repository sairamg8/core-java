export default {
  id: 'deleting-records-using-delete-and-remove',
  title: '293. Deleting Records in a Table Using delete() and remove()',
  explanation: `Deleting an entity removes its row from the database. Hibernate offers two methods: the JPA-standard \`remove()\` and the legacy Hibernate-native \`delete()\`. Both schedule a DELETE, but there are important differences in how they treat the entity's state.

**remove() (JPA standard):**
- Requires a **managed** entity. You typically \`get()\`/\`find()\` the entity first, then call \`remove()\`.
- Marks the entity for deletion; the DELETE runs at flush/commit.
- Passing a detached or transient entity is technically illegal per the spec (though Hibernate is often lenient).

**delete() (Hibernate-native):**
- Works on managed *or* detached entities. If detached, Hibernate reattaches it first, then deletes.
- Also schedules the DELETE for flush time.

**The standard pattern — load then delete:**
The safest and clearest approach is to load the entity by id, confirm it exists, then remove it:
\`\`\`
Student s = session.get(Student.class, id);
if (s != null) session.remove(s);
\`\`\`
This guarantees the entity is managed and avoids deleting something that does not exist.

**After deletion:**
- The row is gone from the database after commit.
- The object becomes **transient** again (no longer associated with any row).

**Bulk delete (for many rows):**
Deleting entities one by one loads each into memory. To delete many rows efficiently, use an HQL bulk delete (\`DELETE FROM Student WHERE ...\`), covered in later HQL topics. Bulk delete bypasses loading and the persistence context, so it is fast but does not cascade or update the cache.

**Cascade delete:**
If a relationship is mapped with \`cascade = CascadeType.REMOVE\` (or ALL), deleting a parent also deletes its children — useful, but powerful enough to cause accidental data loss if misconfigured.

Prefer \`remove()\` for new code (JPA), using the load-then-delete pattern, and reserve HQL bulk deletes for high-volume cases.`,
  code: `// ---- Standard pattern: load, then remove() (JPA) ----
try (Session session = factory.openSession()) {
    Transaction tx = session.beginTransaction();

    Student s = session.get(Student.class, 101);   // load -> managed
    if (s != null) {
        session.remove(s);                          // schedule DELETE
    }
    tx.commit();   // DELETE runs here
}

// ---- Legacy Hibernate-native delete() (works on detached too) ----
try (Session session = factory.openSession()) {
    Transaction tx = session.beginTransaction();
    Student ref = new Student();
    ref.setId(102);                 // detached, only id set
    session.delete(ref);            // Hibernate reattaches, then deletes
    tx.commit();
}

// ---- Bulk delete via HQL (fast, no per-row loading) ----
try (Session session = factory.openSession()) {
    Transaction tx = session.beginTransaction();
    int deleted = session.createMutationQuery(
            "DELETE FROM Student WHERE email IS NULL").executeUpdate();
    tx.commit();
    System.out.println(deleted + " rows deleted");
}

/* show_sql: Hibernate: delete from Student where id=? */`,
  codeTitle: 'remove(), delete(), and bulk HQL delete',
  points: [
    'remove() is the JPA-standard delete and expects a managed entity — load it first, then remove()',
    'delete() is the Hibernate-native method and can delete detached entities by reattaching them first',
    'The safe pattern is load-then-delete: get() the entity, null-check it, then remove() and commit',
    'After a committed delete, the row is gone and the object returns to the transient state',
    'For many rows, an HQL bulk delete (DELETE FROM Entity WHERE ...) is far more efficient than per-row deletion',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'HQL bulk delete (DELETE FROM ...) does NOT respect cascade settings and does NOT update the first- or second-level cache. If you bulk-delete parents, orphaned children are left behind unless the database has ON DELETE CASCADE, and cached entities may become stale. Use bulk delete deliberately, and clear the cache if needed.',
    },
    {
      type: 'interview',
      content: 'Q: How do you delete an entity in Hibernate, and what is the difference between remove() and delete()?\nA: The standard approach is to load the entity by id so it is managed, then call remove() (the JPA method) and commit, which issues the DELETE. delete() is the Hibernate-native equivalent that also accepts detached entities by reattaching them first. For deleting many rows, an HQL bulk delete is more efficient but skips cascading and cache updates.',
    },
  ],
}
