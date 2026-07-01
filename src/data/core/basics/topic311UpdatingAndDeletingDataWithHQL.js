export default {
  id: 'updating-and-deleting-data-with-hql',
  title: '311. Updating and Deleting Data with HQL',
  explanation: `HQL is not only for reading — it can **update** and **delete** rows in bulk, directly in the database, without loading entities into memory. These are called **bulk operations**, and they are the efficient way to change or remove many rows at once.

**Bulk UPDATE:**
\`\`\`
UPDATE Student s SET s.active = false WHERE s.lastLogin < :cutoff
\`\`\`
This issues a single SQL UPDATE affecting all matching rows.

**Bulk DELETE:**
\`\`\`
DELETE FROM Student s WHERE s.email IS NULL
\`\`\`
A single SQL DELETE removing all matching rows.

**Running them:**
Use \`createMutationQuery(...)\` (Hibernate 6+) and call \`executeUpdate()\`, which returns the **number of rows affected**. Bulk operations must run inside a transaction.
\`\`\`
int n = session.createMutationQuery(
        "UPDATE Student s SET s.active = false WHERE s.lastLogin < :c")
        .setParameter("c", cutoff)
        .executeUpdate();
\`\`\`

**Updating multiple fields:**
\`\`\`
UPDATE Product p SET p.price = p.price * 1.1, p.updatedOn = :now WHERE p.category = :cat
\`\`\`

**Bulk vs. entity update — when to use which:**
- **Entity update (dirty checking):** load an entity, change fields, commit. Good for one or a few records; respects cascade, versioning, and cache.
- **Bulk HQL update:** one statement for many rows; fast; but **bypasses the persistence context, caches, dirty checking, cascade, and @Version optimistic locking.**

**Critical caveats of bulk operations:**
- They do **not** update the first- or second-level cache — cached entities become stale.
- They do **not** cascade to associations.
- They do **not** increment \`@Version\` (optimistic-lock) columns automatically unless you set them explicitly (\`SET s.version = s.version + 1\` or use \`VERSIONED\` update in HQL).
- Entities already loaded in the session are **not** refreshed — call \`session.clear()\` afterward if you keep using them.

**Rule of thumb:**
Use bulk HQL UPDATE/DELETE for mass changes (deactivate stale accounts, purge old logs, apply a price increase). Use entity-level dirty checking for ordinary, per-record edits where cascade, cache, and versioning matter.`,
  code: `try (Session session = factory.openSession()) {
    Transaction tx = session.beginTransaction();

    // ---- Bulk UPDATE: one statement, many rows ----
    int deactivated = session.createMutationQuery(
            "UPDATE Student s SET s.active = false WHERE s.lastLogin < :cutoff")
            .setParameter("cutoff", cutoffDate)
            .executeUpdate();
    System.out.println(deactivated + " students deactivated");

    // ---- Update multiple fields at once ----
    session.createMutationQuery(
            "UPDATE Product p SET p.price = p.price * 1.1 WHERE p.category = :cat")
            .setParameter("cat", "books")
            .executeUpdate();

    // ---- Bulk DELETE ----
    int purged = session.createMutationQuery(
            "DELETE FROM AuditLog a WHERE a.createdOn < :old")
            .setParameter("old", oneYearAgo)
            .executeUpdate();
    System.out.println(purged + " audit logs purged");

    tx.commit();

    // Loaded entities may now be stale — clear if you keep using this session
    session.clear();
}

/* Bulk ops bypass the persistence context, caches, cascade, dirty checking,
   and @Version. Use them for mass changes; use entity dirty checking for
   ordinary per-record edits. */`,
  codeTitle: 'Bulk UPDATE and DELETE with HQL',
  points: [
    'HQL bulk UPDATE and DELETE modify many rows in a single SQL statement without loading entities',
    'Run them with createMutationQuery(...).executeUpdate(), which returns the number of affected rows, inside a transaction',
    'Bulk operations bypass the persistence context, first/second-level caches, cascade, dirty checking, and @Version',
    'After a bulk operation, already-loaded entities can be stale — call session.clear() if you keep using the session',
    'Use bulk HQL for mass changes; use entity-level dirty checking for ordinary per-record edits that need cascade/cache/versioning',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Bulk HQL updates do not increment @Version columns by default, which can silently break optimistic locking — other sessions will not detect that rows changed. If your entity uses @Version, either handle the version column explicitly in the UPDATE (SET s.version = s.version + 1) or use a versioned bulk update so concurrent edits are still detected.',
    },
    {
      type: 'interview',
      content: 'Q: When would you use an HQL bulk update instead of loading and modifying an entity?\nA: Use a bulk HQL UPDATE/DELETE when you need to change or remove many rows efficiently in one statement — for example deactivating all stale accounts or purging old logs — because it avoids loading each entity into memory. For ordinary edits of one or a few records, entity-level dirty checking is better since it respects cascade, caching, and @Version optimistic locking, which bulk operations bypass.',
    },
  ],
}
