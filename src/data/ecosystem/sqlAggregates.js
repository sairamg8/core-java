export default {
  id: 'sql-aggregates',
  title: '3. Aggregation, GROUP BY & Subqueries',
  explanation: `**Aggregate functions** collapse multiple rows into a single value.

| Function | Purpose |
|---|---|
| \`COUNT(*)\` | Number of rows |
| \`SUM(col)\` | Total |
| \`AVG(col)\` | Average |
| \`MIN(col)\` / \`MAX(col)\` | Extremes |
| \`COUNT(DISTINCT col)\` | Unique non-null values |

**GROUP BY** splits rows into groups, then applies an aggregate to each group.

**HAVING** filters groups after aggregation (like WHERE but for groups). WHERE filters rows before grouping.

**Order of SQL clause execution:**
\`FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT\`

**Subquery types:**
- Scalar — returns one value, used in SELECT or WHERE
- Inline view — subquery in FROM clause treated as a table
- Correlated — references the outer query's columns (executes once per outer row)`,
  code: `-- === Aggregate functions ===
SELECT COUNT(*)         AS total_employees   FROM employees;
SELECT AVG(salary)      AS avg_salary        FROM employees;
SELECT MAX(salary)      AS highest_salary    FROM employees;
SELECT MIN(salary)      AS lowest_salary     FROM employees;
SELECT SUM(salary)      AS payroll           FROM employees;
SELECT COUNT(DISTINCT department) AS dept_count FROM employees;

-- === GROUP BY — aggregate per group ===
SELECT department, COUNT(*) AS headcount, AVG(salary) AS avg_salary
FROM employees
GROUP BY department;

-- GROUP BY with ORDER BY
SELECT department, COUNT(*) AS headcount
FROM employees
GROUP BY department
ORDER BY headcount DESC;

-- === HAVING — filter groups (cannot use WHERE here) ===
SELECT department, AVG(salary) AS avg_salary
FROM employees
GROUP BY department
HAVING AVG(salary) > 80000;   -- only departments with avg salary > 80k

-- Combine WHERE (filter rows) + HAVING (filter groups)
SELECT department, COUNT(*) AS headcount
FROM employees
WHERE hired_date > '2020-01-01'   -- filter individual rows first
GROUP BY department
HAVING COUNT(*) >= 2;              -- then filter groups

-- === Subqueries ===
-- Scalar subquery: find employees earning more than average
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);

-- Subquery in FROM (inline view / derived table)
SELECT dept, avg_sal
FROM (
    SELECT department AS dept, AVG(salary) AS avg_sal
    FROM employees
    GROUP BY department
) AS dept_stats
WHERE avg_sal > 85000;

-- EXISTS (correlated subquery)
SELECT name FROM employees e
WHERE EXISTS (
    SELECT 1 FROM projects p WHERE p.lead_id = e.id
);`,
  points: [
    'COUNT(*) counts all rows including NULLs; COUNT(col) counts only non-NULL values in that column',
    'Every column in SELECT that is NOT inside an aggregate function MUST appear in GROUP BY',
    'WHERE filters before grouping, HAVING filters after — you cannot use aggregate functions in WHERE',
    'Subqueries can be slow; often a JOIN performs the same logic faster',
    'The order of clause execution matters: WHERE runs before GROUP BY, so you cannot filter on an alias created in SELECT',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the difference between WHERE and HAVING?\nA: WHERE filters individual rows BEFORE they are grouped. HAVING filters groups AFTER aggregation. You use WHERE to exclude rows from participating in the aggregation, and HAVING to exclude results based on aggregate values. WHERE cannot reference aggregate functions (like AVG, SUM) because aggregation has not happened yet at that point.',
    },
    {
      type: 'gotcha',
      content: 'A common mistake: SELECT department, name, COUNT(*) FROM employees GROUP BY department — this causes an error (or unpredictable results in MySQL) because "name" is not in the GROUP BY clause and is not an aggregate. Every non-aggregate column in SELECT must be in GROUP BY.',
    },
  ],
}
