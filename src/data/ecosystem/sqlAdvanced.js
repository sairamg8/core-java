export default {
  id: 'sql-advanced',
  title: '4. Indexes, Transactions & Views',
  explanation: `**Indexes** are auxiliary data structures (usually B-trees) that let the database find rows without scanning every row. They dramatically speed up WHERE, JOIN, and ORDER BY on indexed columns — at the cost of slower writes (every write must also update the index).

**Transactions** group multiple SQL statements into an atomic unit. Either ALL succeed (COMMIT) or ALL fail and are rolled back (ROLLBACK). The ACID properties:
- **Atomicity** — all or nothing
- **Consistency** — database moves from one valid state to another
- **Isolation** — concurrent transactions don't see each other's partial work
- **Durability** — committed data survives crashes

**Views** are named queries stored in the database. They act like virtual tables — you can SELECT from them but (in most cases) cannot INSERT/UPDATE/DELETE through them. They simplify complex queries and provide a security layer.`,
  code: `-- === INDEXES ===
-- Create an index (speeds up queries filtering by email)
CREATE INDEX idx_employee_email ON employees(email);

-- Composite index (speeds up queries filtering by department AND salary)
CREATE INDEX idx_dept_salary ON employees(department, salary);

-- Unique index (also enforces uniqueness)
CREATE UNIQUE INDEX idx_unique_email ON employees(email);

-- See existing indexes
SHOW INDEX FROM employees;

-- Drop an index
DROP INDEX idx_employee_email ON employees;

-- EXPLAIN — see the query execution plan
EXPLAIN SELECT * FROM employees WHERE email = 'alice@co.com';
-- look for "type = ref" or "type = const" — good. "type = ALL" = full table scan = slow

-- === TRANSACTIONS ===
START TRANSACTION;

UPDATE accounts SET balance = balance - 500 WHERE id = 1;  -- deduct from sender
UPDATE accounts SET balance = balance + 500 WHERE id = 2;  -- add to receiver

-- If everything looks good:
COMMIT;

-- If something went wrong (e.g. receiver doesn't exist):
ROLLBACK;  -- neither UPDATE takes effect

-- SAVEPOINT — partial rollback within a transaction
START TRANSACTION;
INSERT INTO orders (product_id, qty) VALUES (10, 2);
SAVEPOINT after_insert;
UPDATE inventory SET stock = stock - 2 WHERE id = 10;
ROLLBACK TO SAVEPOINT after_insert;  -- undo the UPDATE, keep the INSERT
COMMIT;

-- === VIEWS ===
CREATE VIEW engineering_team AS
SELECT name, salary, hired_date
FROM employees
WHERE department = 'Engineering';

-- Use like a regular table
SELECT * FROM engineering_team WHERE salary > 90000;

-- Updatable view (simple views on one table with no GROUP BY/DISTINCT can be updated)
UPDATE engineering_team SET salary = 100000 WHERE name = 'Alice';

-- Drop a view
DROP VIEW IF EXISTS engineering_team;`,
  points: [
    'Add an index on every column used in WHERE, JOIN ON, or ORDER BY that causes slow queries — start with EXPLAIN',
    'Indexes speed up reads but slow down writes — avoid over-indexing tables with frequent INSERT/UPDATE/DELETE',
    'A transaction without explicit COMMIT is automatically rolled back when the connection closes',
    'Isolation levels (READ COMMITTED, REPEATABLE READ, SERIALIZABLE) control how transactions see each other — MySQL default is REPEATABLE READ',
    'Views do not store data — they run their query every time you SELECT from them. For performance, use MATERIALIZED VIEWS (PostgreSQL) or indexed views (SQL Server)',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What are ACID properties in databases?\nA: Atomicity — a transaction is all-or-nothing (COMMIT all or ROLLBACK all). Consistency — the database remains in a valid state before and after the transaction (constraints hold). Isolation — concurrent transactions cannot see each other\'s uncommitted data. Durability — once committed, data survives even a server crash (written to disk). ACID is what makes relational databases reliable for financial and transactional systems.',
    },
    {
      type: 'gotcha',
      content: 'Adding an index on a low-cardinality column (like a boolean or "gender" with 2 values) provides little benefit — the optimizer may ignore it and do a full table scan anyway. Indexes shine on high-cardinality columns (email, order_id) where each value is nearly unique.',
    },
  ],
}
