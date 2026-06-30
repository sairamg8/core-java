export default {
  id: 'select-with-order-by',
  title: '209. SELECT with ORDER BY',
  explanation: `ORDER BY sorts the result set. Without ORDER BY, MySQL returns rows in no guaranteed order — the order can change between queries as the database reorganizes pages internally.

**Syntax:**
\`\`\`sql
SELECT columns FROM table ORDER BY column [ASC | DESC];
\`\`\`

**ASC vs DESC:**
- ASC (ascending) — 1, 2, 3 / A, B, C / earliest first (default)
- DESC (descending) — 9, 8, 7 / Z, Y, X / latest first

**Multi-column sorting:**
\`\`\`sql
ORDER BY department ASC, salary DESC
\`\`\`
Sorts by department A→Z first; within the same department, sorts salary highest→lowest.

**Sort by column position:**
\`\`\`sql
SELECT name, salary, department FROM employees
ORDER BY 2 DESC;   -- sort by the 2nd column (salary) descending
\`\`\`
Avoid positional ordering in production — it breaks silently if you add or reorder columns.

**NULL ordering:**
In MySQL, NULLs sort before any non-NULL value in ASC (first), and after in DESC (last). To put NULLs last in ASC:
\`\`\`sql
ORDER BY (column IS NULL), column ASC
\`\`\`

**ORDER BY with aliases:**
Unlike WHERE, ORDER BY runs after SELECT and can reference column aliases:
\`\`\`sql
SELECT salary * 12 AS annual FROM employees ORDER BY annual DESC;
\`\`\`

**Performance note:**
ORDER BY without an index requires a filesort — MySQL sorts all matching rows in memory or on disk. Add an index on frequently sorted columns to make ORDER BY fast.`,
  code: `-- ===== SELECT with ORDER BY =====

-- Setup
CREATE TABLE IF NOT EXISTS employees (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    department VARCHAR(50),
    salary     DECIMAL(10,2),
    hire_date  DATE
);
INSERT INTO employees (name, department, salary, hire_date) VALUES
    ('Alice',   'Engineering', 95000,  '2020-01-15'),
    ('Bob',     'Marketing',   72000,  '2021-06-01'),
    ('Carol',   'Engineering', 105000, '2019-03-10'),
    ('David',   'HR',          68000,  '2022-09-20'),
    ('Eve',     'Marketing',   78000,  '2021-11-05'),
    ('Frank',   'Engineering', 88000,  '2023-01-01');

-- 1. Single column ascending (default)
SELECT name, salary FROM employees ORDER BY salary;
SELECT name, salary FROM employees ORDER BY salary ASC;   -- explicit ASC

-- 2. Single column descending
SELECT name, salary FROM employees ORDER BY salary DESC;

-- 3. Multi-column sort: department A→Z, then salary highest→lowest within each dept
SELECT name, department, salary FROM employees
ORDER BY department ASC, salary DESC;

-- 4. Sort by date (oldest first, then newest first)
SELECT name, hire_date FROM employees ORDER BY hire_date ASC;   -- oldest first
SELECT name, hire_date FROM employees ORDER BY hire_date DESC;  -- newest first

-- 5. Sort by computed expression
SELECT name, salary, salary * 12 AS annual_salary
FROM employees
ORDER BY annual_salary DESC;

-- 6. Sort by column alias (works in ORDER BY — unlike WHERE)
SELECT name, salary * 12 AS annual FROM employees ORDER BY annual DESC;

-- 7. NULLs sort first in ASC — push NULLs to end:
INSERT INTO employees (name, department, salary) VALUES ('Zara', NULL, 65000);
SELECT name, department FROM employees ORDER BY department ASC;              -- NULL first
SELECT name, department FROM employees ORDER BY (department IS NULL), department ASC; -- NULL last

-- 8. LIMIT + ORDER BY (top N pattern)
SELECT name, salary FROM employees ORDER BY salary DESC LIMIT 3;   -- top 3 earners`,
  codeTitle: 'Sorting Query Results with ORDER BY',
  points: [
    'Without ORDER BY, MySQL returns rows in no guaranteed order — never assume insertion order',
    'ASC (ascending) is the default; DESC (descending) reverses the sort',
    'Multi-column ORDER BY: primary sort first, then secondary within ties',
    'ORDER BY can reference column aliases defined in SELECT — unlike WHERE which runs before SELECT',
    'NULLs sort before non-NULL values in ASC order; use (col IS NULL) trick to push them last',
    'LIMIT + ORDER BY is the standard "top N" pattern — always pair them',
    'ORDER BY without an index causes a filesort — add an index on frequently sorted columns',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "Never rely on the implicit row order in MySQL. Tables are heap-organized (or clustered by PK in InnoDB), and the engine can return rows in any order depending on query plan, page layout, and partitioning. If order matters — add ORDER BY. Always.",
    },
    {
      type: 'tip',
      content: 'For pagination, always use ORDER BY with LIMIT and OFFSET to get consistent pages. Without ORDER BY, different pages may return the same row or skip rows if rows are inserted or deleted between requests.',
    },
    {
      type: 'interview',
      content: 'Q: Can you use a SELECT alias in ORDER BY?\nA: Yes, in MySQL. ORDER BY runs after SELECT in the logical execution order, so aliases defined in SELECT are available. However, you cannot use SELECT aliases in WHERE or HAVING — those clauses run before SELECT. This is a subtle but frequent interview question.',
    },
  ],
}
