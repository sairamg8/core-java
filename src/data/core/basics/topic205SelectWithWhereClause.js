export default {
  id: 'select-with-where-clause',
  title: '205. SELECT with WHERE Clause',
  explanation: `WHERE filters rows before they are returned. Without WHERE, every row in the table is returned. WHERE is the most important clause for controlling which data you retrieve or modify.

**Syntax:**
\`\`\`sql
SELECT columns FROM table WHERE condition;
\`\`\`

**Comparison operators in WHERE:**
| Operator | Meaning |
|----------|---------|
| = | Equal to |
| != or <> | Not equal |
| < , > | Less / greater than |
| <= , >= | Less / greater than or equal |
| IS NULL | Value is NULL |
| IS NOT NULL | Value is not NULL |

**String matching:**
\`\`\`sql
WHERE name = 'Alice'           -- exact match (case-insensitive in MySQL by default)
WHERE name LIKE 'A%'           -- starts with A
WHERE name LIKE '%son'         -- ends with son
WHERE name LIKE '%ali%'        -- contains ali
WHERE name LIKE '_ob'          -- second and third char are 'ob' (any first char)
\`\`\`

**NULL handling:**
NULL means "unknown" — comparing with = never matches NULL. Always use IS NULL / IS NOT NULL.
\`\`\`sql
WHERE manager_id IS NULL       -- correct
WHERE manager_id = NULL        -- WRONG — always evaluates to NULL (never matches)
\`\`\`

**WHERE with UPDATE and DELETE:**
WHERE is not just for SELECT — it's equally critical for UPDATE and DELETE:
\`\`\`sql
UPDATE employees SET salary = 90000 WHERE id = 5;
DELETE FROM orders WHERE status = 'cancelled';
\`\`\`
Forgetting WHERE in an UPDATE or DELETE affects every row in the table.`,
  code: `-- ===== SELECT with WHERE Clause =====

-- Setup
CREATE TABLE IF NOT EXISTS employees (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    department VARCHAR(50),
    salary     DECIMAL(10,2),
    hire_date  DATE,
    manager_id INT UNSIGNED
);
INSERT INTO employees (name, department, salary, hire_date, manager_id) VALUES
    ('Alice',   'Engineering', 95000, '2020-01-15', NULL),
    ('Bob',     'Marketing',   72000, '2021-06-01', 1),
    ('Carol',   'Engineering', 105000, '2019-03-10', 1),
    ('David',   'HR',          68000, '2022-09-20', NULL),
    ('Eve',     'Marketing',   78000, '2021-11-05', 2);

-- 1. Exact match
SELECT * FROM employees WHERE department = 'Engineering';

-- 2. Numeric comparison
SELECT name, salary FROM employees WHERE salary > 80000;
SELECT name, salary FROM employees WHERE salary BETWEEN 70000 AND 100000;

-- 3. Not equal
SELECT * FROM employees WHERE department != 'HR';
SELECT * FROM employees WHERE department <> 'HR';  -- same thing

-- 4. NULL checks (use IS NULL / IS NOT NULL — never =)
SELECT name FROM employees WHERE manager_id IS NULL;     -- top-level managers
SELECT name FROM employees WHERE manager_id IS NOT NULL; -- non-managers

-- 5. String matching with LIKE
SELECT * FROM employees WHERE name LIKE 'A%';      -- starts with A
SELECT * FROM employees WHERE name LIKE '%e';      -- ends with e
SELECT * FROM employees WHERE name LIKE '%ar%';    -- contains 'ar'
SELECT * FROM employees WHERE name LIKE '_ob';     -- 3 chars, ends in 'ob'

-- 6. Date comparison
SELECT * FROM employees WHERE hire_date < '2021-01-01';

-- 7. WHERE in UPDATE (critical — omitting WHERE updates ALL rows)
UPDATE employees SET salary = salary * 1.10 WHERE department = 'Engineering';

-- 8. WHERE in DELETE (critical — omitting WHERE deletes ALL rows)
DELETE FROM employees WHERE hire_date < '2020-01-01';

-- 9. Verify
SELECT name, department, salary FROM employees ORDER BY salary DESC;`,
  codeTitle: 'Filtering Rows with WHERE',
  points: [
    'WHERE filters rows; without it, every row in the table is returned, updated, or deleted',
    'Always use IS NULL or IS NOT NULL to check for NULL — comparing with = NULL never matches anything',
    'LIKE with % (any sequence) and _ (single character) enables pattern matching on strings',
    'MySQL string comparisons are case-insensitive by default with the utf8mb4_unicode_ci collation',
    'WHERE is equally critical in UPDATE and DELETE — omitting it modifies every row in the table',
    'BETWEEN n AND m is inclusive on both ends — equivalent to >= n AND <= m',
    'The database evaluates WHERE before SELECT — you cannot use a SELECT alias in a WHERE clause',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Never run UPDATE or DELETE without first testing your WHERE clause with a SELECT. Write SELECT * FROM table WHERE <your condition> first, confirm you see exactly the rows you want to modify, then replace SELECT * with UPDATE ... SET or DELETE. This one habit prevents accidental mass data changes.',
    },
    {
      type: 'tip',
      content: 'MySQL string comparisons are case-insensitive by default (with the standard collation). WHERE name = "alice" matches "Alice", "ALICE", and "alice". If you need case-sensitive matching, use BINARY: WHERE BINARY name = "Alice".',
    },
    {
      type: 'interview',
      content: 'Q: Why does WHERE column = NULL never match any rows?\nA: In SQL, NULL means "unknown." Any comparison with NULL (including = NULL) evaluates to NULL (unknown), not TRUE or FALSE. The WHERE clause only keeps rows where the condition is TRUE — so NULL conditions always filter out every row. Use IS NULL or IS NOT NULL instead.',
    },
  ],
}
