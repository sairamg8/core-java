export default {
  id: 'and-or-not-operators',
  title: '206. AND, OR, NOT Operators',
  explanation: `AND, OR, and NOT combine multiple conditions in a WHERE clause to filter data precisely.

**AND** — all conditions must be true:
\`\`\`sql
WHERE department = 'Engineering' AND salary > 90000
\`\`\`
Only rows where both are true pass through.

**OR** — at least one condition must be true:
\`\`\`sql
WHERE department = 'HR' OR department = 'Marketing'
\`\`\`
Rows pass if either condition is true.

**NOT** — inverts a condition:
\`\`\`sql
WHERE NOT department = 'HR'      -- same as department != 'HR'
WHERE NOT salary BETWEEN 50000 AND 80000
WHERE NOT name LIKE 'A%'
\`\`\`

**Operator precedence (important):**
NOT > AND > OR

This means AND binds tighter than OR. Without parentheses:
\`\`\`sql
WHERE a OR b AND c
\`\`\`
is parsed as:
\`\`\`sql
WHERE a OR (b AND c)
\`\`\`
Always use parentheses to make intent explicit:
\`\`\`sql
WHERE (a OR b) AND c
\`\`\`

**Combining with LIKE, BETWEEN, IS NULL:**
AND/OR work with any condition — LIKE, BETWEEN, IN, IS NULL, and subqueries all compose cleanly.

\`\`\`sql
WHERE (department = 'Engineering' OR department = 'Product')
  AND salary > 85000
  AND manager_id IS NOT NULL
\`\`\``,
  code: `-- ===== AND, OR, NOT Operators =====

-- Setup
CREATE TABLE IF NOT EXISTS employees (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    department VARCHAR(50),
    salary     DECIMAL(10,2),
    hire_date  DATE,
    is_active  BOOLEAN DEFAULT TRUE
);
INSERT INTO employees (name, department, salary, hire_date, is_active) VALUES
    ('Alice',   'Engineering', 95000, '2020-01-15', TRUE),
    ('Bob',     'Marketing',   72000, '2021-06-01', TRUE),
    ('Carol',   'Engineering', 105000,'2019-03-10', FALSE),
    ('David',   'HR',          68000, '2022-09-20', TRUE),
    ('Eve',     'Marketing',   78000, '2021-11-05', TRUE),
    ('Frank',   'Engineering', 88000, '2023-01-01', TRUE);

-- 1. AND — both must be true
SELECT name FROM employees
WHERE department = 'Engineering' AND salary > 90000;
-- Alice (95k), Carol (105k)

-- 2. OR — either is enough
SELECT name FROM employees
WHERE department = 'HR' OR department = 'Marketing';
-- Bob, David, Eve

-- 3. NOT
SELECT name FROM employees
WHERE NOT department = 'Engineering';       -- same as department != 'Engineering'

SELECT name FROM employees
WHERE NOT salary BETWEEN 70000 AND 95000;   -- outside that range

-- 4. Combining AND + OR — ALWAYS use parentheses
-- Without parentheses (AND binds before OR — likely wrong):
SELECT name FROM employees
WHERE department = 'Engineering' OR department = 'Marketing' AND salary > 75000;
-- Parsed as: Engineering OR (Marketing AND salary > 75000)
-- Returns ALL engineers, plus marketing people with salary > 75000

-- With parentheses (correct intent):
SELECT name FROM employees
WHERE (department = 'Engineering' OR department = 'Marketing') AND salary > 75000;
-- Returns Engineers AND Marketers, both with salary > 75000

-- 5. Complex multi-condition filter
SELECT name, department, salary FROM employees
WHERE (department IN ('Engineering', 'Marketing'))
  AND salary > 80000
  AND is_active = TRUE
ORDER BY salary DESC;

-- 6. NOT with LIKE
SELECT name FROM employees WHERE NOT name LIKE 'A%';   -- names not starting with A

-- 7. NOT with IS NULL
SELECT name FROM employees WHERE NOT (hire_date IS NULL);  -- = IS NOT NULL`,
  codeTitle: 'AND, OR, NOT — Combining WHERE Conditions',
  points: [
    'AND requires all conditions to be true; OR requires at least one; NOT inverts a condition',
    'Operator precedence: NOT > AND > OR — AND binds tighter than OR without parentheses',
    'Always use parentheses when mixing AND and OR to make intent explicit and avoid logic bugs',
    'NOT LIKE, NOT BETWEEN, NOT IN, NOT NULL are all valid — NOT composes with any condition',
    'Multiple OR conditions on the same column are often cleaner with IN: WHERE dept IN (\'A\',\'B\')',
    'All three operators work equally in WHERE clauses of SELECT, UPDATE, and DELETE',
    'Short-circuit evaluation: MySQL stops evaluating AND as soon as one condition is false',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'The most common AND/OR bug: WHERE a OR b AND c is parsed as WHERE a OR (b AND c), not (a OR b) AND c. If you forget this, your filter silently returns too many rows. Rule: whenever you mix AND and OR in one WHERE clause, always add parentheses.',
    },
    {
      type: 'tip',
      content: 'Instead of WHERE dept = "HR" OR dept = "Marketing" OR dept = "Finance", use WHERE dept IN ("HR", "Marketing", "Finance"). IN is cleaner, easier to read, and extensible. It also performs equivalently — the optimizer treats them the same way.',
    },
    {
      type: 'interview',
      content: 'Q: What is the operator precedence for AND and OR in SQL?\nA: NOT has the highest precedence, then AND, then OR. This means AND binds more tightly than OR — just like multiplication binds before addition in math. The practical consequence: always parenthesize mixed AND/OR conditions so your intent is explicit, not assumed.',
    },
  ],
}
