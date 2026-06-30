export default {
  id: 'deleting-records',
  title: '212. Deleting Records',
  explanation: `DELETE removes rows from a table. Like UPDATE, it is most dangerous without a WHERE clause.

**Syntax:**
\`\`\`sql
DELETE FROM table_name WHERE condition;
\`\`\`

**Always include WHERE:**
\`\`\`sql
DELETE FROM orders WHERE id = 42;           -- deletes one row
DELETE FROM orders WHERE status = 'cancelled'; -- deletes all cancelled orders
DELETE FROM orders;                         -- DELETES ALL ROWS — no undo by default
\`\`\`

**DELETE vs TRUNCATE vs DROP:**
| Statement | Effect | Logged | Rollback | Resets AUTO_INCREMENT |
|-----------|--------|--------|----------|-----------------------|
| DELETE FROM t WHERE ... | Removes matching rows | Yes | Yes | No |
| DELETE FROM t (no WHERE) | Removes all rows | Yes | Yes | No |
| TRUNCATE TABLE t | Removes all rows | Minimal | No | Yes |
| DROP TABLE t | Removes table + all data | Minimal | No | N/A |

**DELETE with LIMIT:**
\`\`\`sql
DELETE FROM logs WHERE created_at < '2023-01-01' LIMIT 1000;
\`\`\`
Deleting in small batches avoids long-running transactions and lock contention on production tables.

**DELETE with JOIN:**
\`\`\`sql
DELETE o FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE c.status = 'fraudulent';
\`\`\`

**Soft delete pattern:**
Instead of physically deleting rows (which is irreversible and breaks foreign keys), many apps use a soft delete:
\`\`\`sql
ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP NULL;
UPDATE users SET deleted_at = NOW() WHERE id = 42;
SELECT * FROM users WHERE deleted_at IS NULL;  -- "active" users only
\`\`\`
This preserves history and allows recovery.`,
  code: `-- ===== Deleting Records =====

-- Setup
CREATE TABLE IF NOT EXISTS orders (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer   VARCHAR(100),
    status     VARCHAR(20),
    total      DECIMAL(10,2),
    created_at DATE,
    deleted_at TIMESTAMP NULL   -- for soft delete pattern
);
INSERT INTO orders (customer, status, total, created_at) VALUES
    ('Alice', 'delivered', 250.00, '2022-05-01'),
    ('Bob',   'cancelled', 89.99,  '2022-06-15'),
    ('Carol', 'cancelled', 15.00,  '2023-01-10'),
    ('David', 'pending',   500.00, '2023-07-20'),
    ('Eve',   'refunded',  75.00,  '2021-11-05');

-- 1. Delete a specific row by primary key
DELETE FROM orders WHERE id = 2;

-- 2. Delete all rows matching a condition
DELETE FROM orders WHERE status = 'cancelled';

-- 3. Delete old records (batch-friendly)
DELETE FROM orders WHERE created_at < '2022-01-01' LIMIT 100;

-- 4. Check row count before deleting (safe habit)
SELECT COUNT(*) FROM orders WHERE status = 'refunded';
DELETE FROM orders WHERE status = 'refunded';
SELECT ROW_COUNT() AS deleted_count;

-- 5. DELETE with JOIN (delete orders from fraudulent customers)
CREATE TABLE IF NOT EXISTS blacklist (customer VARCHAR(100) PRIMARY KEY);
INSERT INTO blacklist VALUES ('Eve');

DELETE o FROM orders o
JOIN blacklist b ON o.customer = b.customer;

-- 6. DELETE all rows — two approaches
DELETE FROM orders;          -- logs every row, rollback possible, no AUTO_INCREMENT reset
TRUNCATE TABLE orders;       -- fast, minimal logging, resets AUTO_INCREMENT, no rollback

-- 7. Soft delete (preferred in production — preserves history)
-- Mark as deleted instead of removing
UPDATE orders SET deleted_at = NOW() WHERE id = 4;

-- Query only "active" (non-deleted) rows
SELECT * FROM orders WHERE deleted_at IS NULL;

-- 8. Hard delete later if needed
DELETE FROM orders WHERE deleted_at < NOW() - INTERVAL 90 DAY;`,
  codeTitle: 'Deleting Records with DELETE',
  points: [
    'DELETE without WHERE removes every row in the table — always write and test WHERE first',
    'DELETE is fully logged and transaction-safe; TRUNCATE is faster but cannot be rolled back',
    'DELETE preserves AUTO_INCREMENT counter; TRUNCATE resets it to 1',
    'Delete in batches with LIMIT on large tables to avoid holding long-running locks',
    'Foreign key constraints with ON DELETE RESTRICT will block DELETE if child rows exist',
    'Soft delete (adding deleted_at column) is safer than hard delete — data is recoverable',
    'ROW_COUNT() after DELETE returns the number of rows actually removed',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "Run SELECT COUNT(*) or SELECT * with your WHERE clause before executing DELETE to confirm you're targeting the right rows. There is no undo for DELETE in standard MySQL without a transaction or binary log recovery. Verify first, delete second.",
    },
    {
      type: 'tip',
      content: "In production, prefer soft deletes over hard deletes. Add a deleted_at TIMESTAMP NULL column; mark rows with UPDATE ... SET deleted_at = NOW() instead of DELETE. This preserves audit history, allows recovery, and avoids breaking foreign key references from other tables.",
    },
    {
      type: 'interview',
      content: "Q: What is the difference between DELETE and TRUNCATE?\nA: DELETE removes rows one by one, logs each deletion, and can be rolled back inside a transaction. TRUNCATE deallocates data pages with minimal logging — it's faster for clearing entire tables — but cannot be rolled back and resets AUTO_INCREMENT to 1. For removing specific rows, use DELETE. For clearing an entire table quickly, use TRUNCATE.",
    },
  ],
}
