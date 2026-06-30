export default {
  id: 'sql-joins',
  title: '2. SQL JOINs',
  explanation: `A **JOIN** combines rows from two or more tables based on a related column (usually a foreign key relationship).

| JOIN Type | Returns |
|---|---|
| INNER JOIN | Only rows with a match in BOTH tables |
| LEFT JOIN | All rows from the left table + matched rows from the right (NULL if no match) |
| RIGHT JOIN | All rows from the right table + matched rows from the left |
| FULL OUTER JOIN | All rows from both tables (NULL where no match) |
| CROSS JOIN | Cartesian product — every combination of rows |
| SELF JOIN | Table joined to itself (for hierarchical data like manager→employee) |

**Key insight:** LEFT JOIN is by far the most common after INNER JOIN. Right JOIN can always be rewritten as a LEFT JOIN by swapping the tables.`,
  code: `-- Setup for examples
CREATE TABLE departments (
    dept_id   INT PRIMARY KEY AUTO_INCREMENT,
    dept_name VARCHAR(50) NOT NULL
);

INSERT INTO departments (dept_name) VALUES
('Engineering'), ('Marketing'), ('HR'), ('Legal');

-- employees table from previous section has department as a name (VARCHAR)
-- For JOIN examples, assume a foreign key setup:

-- INNER JOIN — only employees who have a valid department
SELECT e.name, e.salary, d.dept_name
FROM employees e
INNER JOIN departments d ON e.department = d.dept_name;
-- employees without a matching department do NOT appear

-- LEFT JOIN — all employees, even those without a matching department
SELECT e.name, e.salary, d.dept_name
FROM employees e
LEFT JOIN departments d ON e.department = d.dept_name;
-- employees without a department show NULL for dept_name

-- Find employees who have NO department assigned
SELECT e.name
FROM employees e
LEFT JOIN departments d ON e.department = d.dept_name
WHERE d.dept_id IS NULL;  -- the "anti-join" pattern

-- RIGHT JOIN — all departments, even those with no employees
SELECT e.name, d.dept_name
FROM employees e
RIGHT JOIN departments d ON e.department = d.dept_name;

-- SELF JOIN — find each employee and their manager's name
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;

-- Multi-table JOIN
CREATE TABLE projects (id INT PRIMARY KEY, name VARCHAR(100), lead_id INT);
SELECT e.name, p.name AS project
FROM employees e
INNER JOIN projects p ON e.id = p.lead_id
INNER JOIN departments d ON e.department = d.dept_name
WHERE d.dept_name = 'Engineering';`,
  points: [
    'Think of INNER JOIN as "only where both tables have a record" — the intersection',
    'LEFT JOIN is "all of the left table, plus whatever matches from the right"',
    'The anti-join pattern (LEFT JOIN + WHERE right.id IS NULL) finds rows with no match — very common in data cleanup',
    'Always alias tables when joining (e for employees, d for departments) — it prevents ambiguity and reduces typing',
    'CROSS JOIN on large tables is dangerous — two 10,000-row tables produce 100 million rows',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the difference between INNER JOIN and LEFT JOIN?\nA: INNER JOIN returns rows only when both tables have a matching record. If an employee has no department, they are excluded. LEFT JOIN returns ALL rows from the left table regardless — rows with no match in the right table get NULL values for the right table columns. LEFT JOIN is used when you want to include records even when the related data is missing.',
    },
    {
      type: 'tip',
      content: 'When JOINing multiple tables, follow the data: start from the main entity (employees), join to related tables (departments, projects) using foreign keys. Read the ON clause as "connect these two tables where this key matches that key".',
    },
  ],
}
