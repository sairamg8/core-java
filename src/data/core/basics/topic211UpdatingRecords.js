export default {
  id: 'updating-records',
  title: '211. Updating Records',
  explanation: `UPDATE modifies existing rows in a table. It is one of the four DML (Data Manipulation Language) operations alongside INSERT, SELECT, and DELETE.

**Syntax:**
\`\`\`sql
UPDATE table_name
SET    column1 = value1, column2 = value2, ...
WHERE  condition;
\`\`\`

**Always include WHERE:**
Without WHERE, UPDATE changes every row in the table. This is one of the most dangerous SQL mistakes.
\`\`\`sql
-- Safe: updates one row
UPDATE employees SET salary = 95000 WHERE id = 3;

-- DANGEROUS: updates every employee's salary
UPDATE employees SET salary = 95000;
\`\`\`

**Updating multiple columns:**
\`\`\`sql
UPDATE users
SET email = 'new@email.com', updated_at = NOW()
WHERE id = 42;
\`\`\`

**Using expressions:**
\`\`\`sql
UPDATE products SET price = price * 1.10;                   -- 10% price increase (all rows)
UPDATE employees SET salary = salary + 5000 WHERE dept = 'Engineering';
\`\`\`

**UPDATE with JOIN (MySQL extension):**
\`\`\`sql
UPDATE orders o
JOIN customers c ON o.customer_id = c.id
SET o.priority = 'high'
WHERE c.tier = 'VIP';
\`\`\`

**Row count:**
\`ROW_COUNT()\` after an UPDATE returns how many rows were actually changed (not just matched):
\`\`\`sql
UPDATE employees SET salary = 90000 WHERE id = 5;
SELECT ROW_COUNT();   -- 0 if salary was already 90000, 1 if it changed
\`\`\``,
  code: `-- ===== Updating Records =====

-- Setup
CREATE TABLE IF NOT EXISTS employees (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    department VARCHAR(50),
    salary     DECIMAL(10,2),
    is_active  BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
INSERT INTO employees (name, department, salary) VALUES
    ('Alice',   'Engineering', 80000),
    ('Bob',     'Marketing',   65000),
    ('Carol',   'Engineering', 90000),
    ('David',   'HR',          62000),
    ('Eve',     'Marketing',   70000);

-- 1. Update a single column for one row
UPDATE employees SET salary = 85000 WHERE id = 1;

-- 2. Update multiple columns at once
UPDATE employees
SET department = 'Product', salary = 88000, updated_at = NOW()
WHERE id = 2;

-- 3. Update using an expression (relative change)
UPDATE employees SET salary = salary * 1.10 WHERE department = 'Engineering'; -- 10% raise

-- 4. Update all rows (no WHERE) — give entire company a $1000 bonus
UPDATE employees SET salary = salary + 1000;

-- 5. Check how many rows were affected
SELECT ROW_COUNT() AS rows_changed;

-- 6. Conditional update with CASE
UPDATE employees
SET salary = CASE
    WHEN department = 'Engineering' THEN salary * 1.15
    WHEN department = 'Marketing'   THEN salary * 1.08
    ELSE                                 salary * 1.05
END;

-- 7. UPDATE with JOIN (MySQL-specific syntax)
CREATE TABLE IF NOT EXISTS departments (
    name   VARCHAR(50) PRIMARY KEY,
    budget DECIMAL(12,2)
);
INSERT INTO departments VALUES ('Engineering', 500000), ('Marketing', 300000), ('HR', 150000);

UPDATE employees e
JOIN departments d ON e.department = d.name
SET e.salary = e.salary * 1.05
WHERE d.budget > 400000;   -- raise only employees in high-budget departments

-- 8. Verify changes
SELECT name, department, salary, updated_at FROM employees ORDER BY id;

-- 9. Safe UPDATE habit: test with SELECT first
SELECT * FROM employees WHERE department = 'HR';   -- confirm which rows will change
UPDATE employees SET is_active = FALSE WHERE department = 'HR';`,
  codeTitle: 'Updating Records with UPDATE',
  points: [
    'UPDATE without WHERE modifies every row in the table — always write and test the WHERE clause first',
    'SET can update multiple columns in one statement — they all change atomically',
    'Expressions in SET are relative: SET salary = salary * 1.1 increases current value by 10%',
    'CASE inside SET applies different values to different rows in one UPDATE statement',
    'ON UPDATE CURRENT_TIMESTAMP on a TIMESTAMP column auto-updates it on every UPDATE',
    'ROW_COUNT() after UPDATE returns rows changed (value actually different), not rows matched',
    'MySQL allows UPDATE with JOIN to update one table based on conditions from another',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "Before any UPDATE, run the equivalent SELECT with the same WHERE clause to confirm you're targeting the right rows. Only then change SELECT * to UPDATE ... SET. This single habit prevents accidental mass updates that are hard or impossible to reverse.",
    },
    {
      type: 'tip',
      content: "ROW_COUNT() returns 0 if no rows were changed — either no rows matched WHERE, or the rows matched but the new value equals the old value. This distinction matters: rows_matched != rows_changed. Use CLIENT_FOUND_ROWS flag in the connection string if you need matched count instead.",
    },
    {
      type: 'interview',
      content: "Q: What is the difference between rows matched and rows changed in an UPDATE?\nA: Rows matched is how many rows satisfy the WHERE condition. Rows changed is how many of those rows actually had a column value changed. If you SET salary = 50000 for a row that already has salary = 50000, it matches but does not change. ROW_COUNT() returns rows changed, not matched.",
    },
  ],
}
