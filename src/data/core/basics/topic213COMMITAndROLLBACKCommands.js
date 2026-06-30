export default {
  id: 'commit-and-rollback-commands',
  title: '213. COMMIT and ROLLBACK Commands',
  explanation: `COMMIT and ROLLBACK are transaction control commands. A transaction groups multiple SQL statements into one atomic unit — either all succeed or all fail together.

**The ACID guarantee:**
- **Atomicity**: all statements in a transaction succeed or none do
- **Consistency**: the database moves from one valid state to another
- **Isolation**: concurrent transactions don't interfere with each other
- **Durability**: committed changes survive crashes

**Transaction syntax:**
\`\`\`sql
START TRANSACTION;   -- or BEGIN;
  UPDATE accounts SET balance = balance - 500 WHERE id = 1;
  UPDATE accounts SET balance = balance + 500 WHERE id = 2;
COMMIT;              -- make both changes permanent
\`\`\`

**ROLLBACK:**
\`\`\`sql
START TRANSACTION;
  DELETE FROM orders WHERE id = 42;
ROLLBACK;            -- undo the delete — row is still there
\`\`\`

**AUTOCOMMIT:**
By default, MySQL runs in AUTOCOMMIT mode — every statement is its own transaction and is immediately committed. To group statements, you must explicitly START TRANSACTION (which disables AUTOCOMMIT for that session until COMMIT or ROLLBACK).
\`\`\`sql
SET AUTOCOMMIT = 0;   -- disable for the session
-- all subsequent statements are in a transaction until COMMIT/ROLLBACK
\`\`\`

**SAVEPOINT:**
\`\`\`sql
START TRANSACTION;
  INSERT INTO orders ...;
  SAVEPOINT after_insert;
  UPDATE inventory ...;
  ROLLBACK TO after_insert;  -- undo UPDATE but keep INSERT
COMMIT;
\`\`\`

Note: DDL statements (CREATE, ALTER, DROP) implicitly commit in MySQL — they cannot be rolled back.`,
  code: `-- ===== COMMIT and ROLLBACK =====

-- Setup
CREATE TABLE IF NOT EXISTS accounts (
    id      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    owner   VARCHAR(100) NOT NULL,
    balance DECIMAL(12,2) NOT NULL DEFAULT 0,
    CONSTRAINT chk_balance CHECK (balance >= 0)
);
INSERT INTO accounts (owner, balance) VALUES
    ('Alice', 1000.00),
    ('Bob',   500.00);

-- 1. Successful transaction — bank transfer
START TRANSACTION;
    UPDATE accounts SET balance = balance - 200 WHERE owner = 'Alice';
    UPDATE accounts SET balance = balance + 200 WHERE owner = 'Bob';
COMMIT;
-- Both changes are permanent now

SELECT owner, balance FROM accounts;
-- Alice: 800, Bob: 700

-- 2. ROLLBACK — undo a failed or unwanted operation
START TRANSACTION;
    UPDATE accounts SET balance = balance - 900 WHERE owner = 'Alice';
    -- Alice only has 800, this would make her -100 — we want to undo
    SELECT balance FROM accounts WHERE owner = 'Alice';
ROLLBACK;
-- Alice still has 800.00

-- 3. SAVEPOINT — partial rollback
START TRANSACTION;
    INSERT INTO accounts (owner, balance) VALUES ('Carol', 300.00);
    SAVEPOINT after_insert;

    UPDATE accounts SET balance = balance - 500 WHERE owner = 'Bob';
    -- Oops — we changed our mind on this update

    ROLLBACK TO after_insert;  -- undo UPDATE, keep INSERT
COMMIT;
-- Carol row exists, Bob unchanged

SELECT * FROM accounts;

-- 4. CHECK constraint + ROLLBACK (constraint violation auto-rolls back the statement)
START TRANSACTION;
    UPDATE accounts SET balance = -100 WHERE owner = 'Alice';  -- violates CHECK
    -- ERROR: check constraint fails → statement rolled back automatically
ROLLBACK;   -- roll back anything else in the transaction too

-- 5. AUTOCOMMIT mode
SET AUTOCOMMIT = 0;   -- every statement is now in a transaction until explicit COMMIT
UPDATE accounts SET balance = balance + 50 WHERE owner = 'Alice';
COMMIT;               -- now permanent
SET AUTOCOMMIT = 1;   -- restore

-- 6. DDL auto-commits (cannot be rolled back)
START TRANSACTION;
    ALTER TABLE accounts ADD COLUMN notes VARCHAR(255);
    -- implicit COMMIT happens here — you cannot roll back DDL in MySQL
ROLLBACK;  -- too late — the column is already there`,
  codeTitle: 'Transactions: COMMIT, ROLLBACK, and SAVEPOINT',
  points: [
    'A transaction groups SQL statements into an atomic unit — all succeed together or all fail together',
    'START TRANSACTION (or BEGIN) starts a transaction; COMMIT makes it permanent; ROLLBACK undoes it',
    'MySQL is in AUTOCOMMIT mode by default — every statement auto-commits unless inside START TRANSACTION',
    'SAVEPOINT marks a point you can roll back to while keeping earlier changes in the transaction',
    'DDL statements (CREATE TABLE, ALTER, DROP) implicitly commit in MySQL — they cannot be rolled back',
    'The CHECK constraint violation or any error during a statement rolls back just that statement, not the whole transaction',
    'ACID properties ensure data integrity: Atomicity, Consistency, Isolation, Durability',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "MySQL's AUTOCOMMIT is ON by default — every INSERT, UPDATE, and DELETE is immediately and permanently committed unless you explicitly start a transaction. This surprises developers coming from PostgreSQL or Oracle where statements are inside a transaction by default. Always wrap multi-step operations in START TRANSACTION ... COMMIT.",
    },
    {
      type: 'tip',
      content: "Use transactions for any multi-step operation where partial completion would leave data in an inconsistent state — bank transfers, order placement, inventory updates. If one step fails, ROLLBACK restores the database to the state before the transaction started.",
    },
    {
      type: 'interview',
      content: "Q: What does ACID stand for and why does it matter?\nA: Atomicity (all-or-nothing), Consistency (valid state before and after), Isolation (concurrent transactions don't interfere), Durability (committed data survives crashes). ACID is what makes databases reliable for financial and business-critical data. Without it, a crash mid-transfer could debit one account without crediting the other.",
    },
  ],
}
