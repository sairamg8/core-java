export default {
  id: 'drop-and-truncate-commands',
  title: '220. DROP and TRUNCATE Commands',
  explanation: `DROP and TRUNCATE are destructive DDL operations. Both permanently remove data, but with important differences in scope and reversibility.

**DROP TABLE:**
Removes the table definition and all its data permanently.
\`\`\`sql
DROP TABLE orders;
DROP TABLE IF EXISTS orders;   -- safe version, no error if missing
\`\`\`
After DROP, the table does not exist at all — the schema is gone.

**TRUNCATE TABLE:**
Removes all rows but keeps the table structure intact.
\`\`\`sql
TRUNCATE TABLE logs;
\`\`\`
The table still exists with the same columns and indexes — it's just empty.

**DROP vs TRUNCATE vs DELETE (comparison):**
| Feature | DROP | TRUNCATE | DELETE (no WHERE) |
|---------|------|----------|-------------------|
| Removes rows | Yes | Yes | Yes |
| Removes table | Yes | No | No |
| Can be rolled back | No | No | Yes (in transaction) |
| Resets AUTO_INCREMENT | N/A | Yes | No |
| Fires DELETE triggers | No | No | Yes |
| Speed | Instant | Fast | Slow (row by row) |
| Foreign key safe | Blocked if FK references | Blocked if FK references | Blocked by RESTRICT |

**DROP DATABASE:**
\`\`\`sql
DROP DATABASE my_app_db;
DROP DATABASE IF EXISTS my_app_db;
\`\`\`
Removes the database and ALL its tables — truly nuclear.

**DROP INDEX:**
\`\`\`sql
DROP INDEX idx_email ON users;
ALTER TABLE users DROP INDEX idx_email;   -- equivalent
\`\`\`

**Safeguards:**
- Always backup before DROP or TRUNCATE on production
- Use \`IF EXISTS\` to avoid script errors
- Check for foreign key references before dropping — child tables block the DROP`,
  code: `-- ===== DROP and TRUNCATE Commands =====

-- Setup
CREATE DATABASE IF NOT EXISTS test_school;
USE test_school;

CREATE TABLE IF NOT EXISTS students (
    id      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name    VARCHAR(100) NOT NULL,
    grade   CHAR(1)
);
CREATE TABLE IF NOT EXISTS grades (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    student_id INT UNSIGNED,
    score      INT,
    FOREIGN KEY (student_id) REFERENCES students(id)
);

INSERT INTO students (name, grade) VALUES ('Alice','A'), ('Bob','B'), ('Carol','A');
INSERT INTO grades (student_id, score) VALUES (1, 95), (2, 82), (3, 90);

-- 1. TRUNCATE — remove all rows, keep structure, reset AUTO_INCREMENT
INSERT INTO students (name, grade) VALUES ('Dave','C');
SELECT * FROM students;  -- 4 rows

TRUNCATE TABLE grades;   -- must truncate child first (FK reference)
TRUNCATE TABLE students;
SELECT * FROM students;  -- 0 rows
-- AUTO_INCREMENT reset: next insert gets id=1

INSERT INTO students (name, grade) VALUES ('Eve','A');
SELECT id FROM students; -- id=1 (reset)

-- 2. DROP TABLE — removes table entirely
DROP TABLE IF EXISTS grades;
DROP TABLE IF EXISTS students;
SHOW TABLES;  -- neither exists anymore

-- 3. DROP blocked by foreign key
CREATE TABLE parent (id INT PRIMARY KEY);
CREATE TABLE child  (id INT, parent_id INT, FOREIGN KEY (parent_id) REFERENCES parent(id));
DROP TABLE parent;
-- ERROR 1217: Cannot delete or update a parent row: a foreign key constraint fails
-- Solution: drop child first
DROP TABLE child;
DROP TABLE parent;

-- 4. DROP DATABASE (removes everything)
CREATE DATABASE temp_db;
USE temp_db;
CREATE TABLE test (x INT);
DROP DATABASE temp_db;  -- removes temp_db and all its tables

-- 5. DROP INDEX
CREATE TABLE items (id INT PRIMARY KEY, name VARCHAR(50));
CREATE INDEX idx_name ON items (name);
DROP INDEX idx_name ON items;
-- Or: ALTER TABLE items DROP INDEX idx_name;

-- 6. TRUNCATE vs DELETE comparison
CREATE TABLE logs (id INT AUTO_INCREMENT PRIMARY KEY, msg VARCHAR(200));
INSERT INTO logs (msg) VALUES ('a'),('b'),('c');

DELETE FROM logs;    -- all rows gone, AUTO_INCREMENT still at 3
INSERT INTO logs (msg) VALUES ('x');
SELECT id FROM logs; -- id=4

TRUNCATE TABLE logs; -- all rows gone, AUTO_INCREMENT reset to 1
INSERT INTO logs (msg) VALUES ('y');
SELECT id FROM logs; -- id=1

-- 7. Safe production DROP pattern (always check first)
SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
WHERE CONSTRAINT_TYPE = 'FOREIGN KEY'
  AND TABLE_SCHEMA = DATABASE()
  AND REFERENCED_TABLE_NAME = 'students';  -- 0 before dropping`,
  codeTitle: 'DROP TABLE and TRUNCATE — Destructive DDL Operations',
  points: [
    'DROP TABLE removes the table definition and all data permanently — the table no longer exists',
    'TRUNCATE TABLE removes all rows but keeps the table structure; AUTO_INCREMENT resets to 1',
    'DELETE (no WHERE) removes all rows, preserves structure, does not reset AUTO_INCREMENT, can be rolled back',
    'TRUNCATE is faster than DELETE for clearing large tables — it deallocates data pages rather than deleting row by row',
    'TRUNCATE cannot be rolled back in MySQL (no transaction safety); DELETE inside a transaction can be',
    'DROP TABLE is blocked if another table has a FOREIGN KEY referencing it — drop child tables first',
    'Always use IF EXISTS with DROP to make scripts idempotent and error-safe',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "TRUNCATE resets AUTO_INCREMENT to 1. If other tables have foreign keys referencing the truncated table's IDs, new rows will get IDs that conflict with old references still stored in child tables. Either TRUNCATE the child tables first (in dependency order) or use DELETE instead.",
    },
    {
      type: 'tip',
      content: "Before dropping any table in production, run: SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS WHERE REFERENCED_TABLE_NAME = 'your_table'. If it returns > 0, other tables depend on it and DROP will fail. Plan the drop order: children before parents.",
    },
    {
      type: 'interview',
      content: "Q: What is the difference between DELETE, TRUNCATE, and DROP?\nA: DELETE removes specific rows (with WHERE) or all rows (without WHERE), logs each row deletion, can be rolled back, and doesn't reset AUTO_INCREMENT. TRUNCATE removes all rows instantly by deallocating pages, resets AUTO_INCREMENT, cannot be rolled back. DROP removes the entire table structure along with all data — after DROP, the table is gone.",
    },
  ],
}
