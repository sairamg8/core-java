export default {
  id: 'right-join',
  title: '217. RIGHT JOIN',
  explanation: `RIGHT JOIN (RIGHT OUTER JOIN) returns all rows from the right table plus any matching rows from the left table. When there is no match in the left table, left-side columns are NULL.

**Syntax:**
\`\`\`sql
SELECT columns
FROM   left_table
RIGHT JOIN right_table ON left_table.key = right_table.key;
\`\`\`

**Visual comparison:**
\`\`\`
employees (left):    departments (right):
id | dept_id         id | name
1  | 1               1  | Engineering
2  | 1               2  | Marketing
3  | 2               3  | HR (no employees)

RIGHT JOIN result (all departments, NULL for empty ones):
emp_id | dept_name
1      | Engineering
2      | Engineering
3      | Marketing
NULL   | HR          ← HR has no employees — NULL on left
\`\`\`

**RIGHT JOIN is the mirror of LEFT JOIN:**
Every RIGHT JOIN can be rewritten as a LEFT JOIN by swapping the table order:
\`\`\`sql
-- These are equivalent:
FROM employees RIGHT JOIN departments ON ...
FROM departments LEFT JOIN employees ON ...
\`\`\`
In practice, most developers always use LEFT JOIN and swap the table order. RIGHT JOIN exists for symmetry.

**When RIGHT JOIN is useful:**
When you're adding a table to an existing query and want all rows from the newly added table, RIGHT JOIN lets you append it without rewriting the FROM clause order.

**Anti-join with RIGHT JOIN (departments with no employees):**
\`\`\`sql
SELECT d.name
FROM employees e
RIGHT JOIN departments d ON e.dept_id = d.id
WHERE e.id IS NULL;
\`\`\``,
  code: `-- ===== RIGHT JOIN =====

-- Setup
CREATE TABLE IF NOT EXISTS departments (
    id   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);
CREATE TABLE IF NOT EXISTS employees (
    id      INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name    VARCHAR(100),
    dept_id INT UNSIGNED
);
INSERT INTO departments (name) VALUES ('Engineering'), ('Marketing'), ('HR'), ('Finance');
INSERT INTO employees (name, dept_id) VALUES
    ('Alice', 1),
    ('Bob',   1),
    ('Carol', 2);
-- HR and Finance have no employees

-- 1. RIGHT JOIN — all departments, NULL where no employees
SELECT e.name AS employee, d.name AS department
FROM employees e
RIGHT JOIN departments d ON e.dept_id = d.id;
-- Alice/Engineering, Bob/Engineering, Carol/Marketing, NULL/HR, NULL/Finance

-- 2. Equivalent LEFT JOIN (same result — just swap table order)
SELECT e.name AS employee, d.name AS department
FROM departments d
LEFT JOIN employees e ON d.id = e.dept_id;

-- 3. Find departments with no employees (anti-join)
SELECT d.name AS empty_department
FROM employees e
RIGHT JOIN departments d ON e.dept_id = d.id
WHERE e.id IS NULL;
-- HR, Finance

-- 4. Count employees per department (including empty departments)
SELECT d.name, COUNT(e.id) AS headcount
FROM employees e
RIGHT JOIN departments d ON e.dept_id = d.id
GROUP BY d.id, d.name
ORDER BY headcount DESC;
-- Engineering: 2, Marketing: 1, HR: 0, Finance: 0

-- 5. RIGHT JOIN vs INNER JOIN comparison
-- INNER JOIN (only departments that have employees):
SELECT d.name, COUNT(e.id) AS headcount
FROM employees e
INNER JOIN departments d ON e.dept_id = d.id
GROUP BY d.id, d.name;
-- Engineering: 2, Marketing: 1   (HR and Finance missing)

-- 6. Rewriting RIGHT JOIN as LEFT JOIN (preferred style)
-- Instead of:
SELECT * FROM a RIGHT JOIN b ON ...
-- Write:
SELECT * FROM b LEFT JOIN a ON ...`,
  codeTitle: 'RIGHT JOIN — All Right Rows, NULL Where No Match',
  points: [
    'RIGHT JOIN returns every row from the right table; left-side columns are NULL when no match exists',
    'RIGHT JOIN is the mirror of LEFT JOIN — every RIGHT JOIN can be rewritten as a LEFT JOIN by swapping table order',
    'Most developers prefer LEFT JOIN and reorder tables rather than mixing both in the same codebase',
    'Anti-join with RIGHT JOIN: WHERE left.id IS NULL finds right-side rows with no match on the left',
    'COUNT(e.id) correctly returns 0 for departments with no employees (NULLs are not counted)',
    'RIGHT OUTER JOIN and RIGHT JOIN are identical — OUTER is optional',
    'Use RIGHT JOIN when adding a table to an existing query and you need all rows from the new table',
  ],
  callouts: [
    {
      type: 'tip',
      content: "In practice, most SQL codebases use LEFT JOIN exclusively and swap table order when needed — it's more readable when all queries flow in the same direction. Mixing LEFT and RIGHT JOINs in one query is confusing. Pick one style and stick with it.",
    },
    {
      type: 'gotcha',
      content: "Just like LEFT JOIN, putting a WHERE filter on the left-table column of a RIGHT JOIN silently converts it to an INNER JOIN — WHERE e.id IS NOT NULL excludes the NULL rows that RIGHT JOIN was meant to preserve. Move such filters into the ON clause.",
    },
    {
      type: 'interview',
      content: "Q: Is there a meaningful difference between LEFT JOIN and RIGHT JOIN?\nA: They are functionally symmetric. Any RIGHT JOIN can be rewritten as a LEFT JOIN by reversing the table order in FROM and JOIN. The choice is stylistic — most teams standardize on LEFT JOIN. The real distinction is between inner joins (both must match) and outer joins (one side can be absent).",
    },
  ],
}
