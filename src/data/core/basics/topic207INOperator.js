export default {
  id: 'in-operator',
  title: '207. IN Operator',
  explanation: `IN tests whether a column value matches any value in a list. It is a clean alternative to multiple OR conditions.

**Syntax:**
\`\`\`sql
WHERE column IN (val1, val2, val3, ...)
WHERE column NOT IN (val1, val2, val3, ...)
\`\`\`

**Equivalent to OR:**
\`\`\`sql
-- These are identical:
WHERE dept = 'HR' OR dept = 'Marketing' OR dept = 'Finance'
WHERE dept IN ('HR', 'Marketing', 'Finance')
\`\`\`
IN is cleaner to read and easier to maintain — just add/remove values from the list.

**IN with a subquery:**
The real power of IN is matching against a dynamic list from a query:
\`\`\`sql
SELECT name FROM employees
WHERE department_id IN (
    SELECT id FROM departments WHERE location = 'New York'
);
\`\`\`
This is called a subquery. The inner SELECT produces the list; the outer SELECT filters against it.

**NOT IN:**
\`\`\`sql
WHERE status NOT IN ('cancelled', 'refunded')
\`\`\`

**NULL trap with NOT IN:**
If any value in the list is NULL, NOT IN returns no rows at all. This is a notorious SQL gotcha:
\`\`\`sql
-- If the subquery returns NULL among results, this matches NOTHING
WHERE id NOT IN (SELECT manager_id FROM employees)   -- dangerous if manager_id can be NULL
\`\`\`
Use NOT EXISTS or filter out NULLs in the subquery to avoid this.`,
  code: `-- ===== IN Operator =====

-- Setup
CREATE TABLE IF NOT EXISTS orders (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer   VARCHAR(100) NOT NULL,
    status     VARCHAR(20) NOT NULL,
    total      DECIMAL(10,2),
    country    VARCHAR(50)
);
INSERT INTO orders (customer, status, total, country) VALUES
    ('Alice',  'pending',   250.00, 'US'),
    ('Bob',    'shipped',   89.99,  'UK'),
    ('Carol',  'delivered', 499.00, 'US'),
    ('David',  'cancelled', 15.00,  'IN'),
    ('Eve',    'pending',   320.50, 'IN'),
    ('Frank',  'refunded',  75.00,  'UK');

-- 1. Basic IN — matches any value in the list
SELECT * FROM orders WHERE status IN ('pending', 'shipped');

-- 2. NOT IN — matches none of the values
SELECT * FROM orders WHERE status NOT IN ('cancelled', 'refunded');

-- 3. IN with numbers
SELECT * FROM orders WHERE id IN (1, 3, 5);

-- 4. Multiple countries
SELECT * FROM orders WHERE country IN ('US', 'IN');

-- 5. Clean vs. verbose — these are identical:
SELECT * FROM orders
WHERE status = 'pending' OR status = 'shipped';   -- verbose

SELECT * FROM orders
WHERE status IN ('pending', 'shipped');             -- clean

-- 6. IN with a subquery
CREATE TABLE IF NOT EXISTS vip_customers (
    customer VARCHAR(100) PRIMARY KEY
);
INSERT INTO vip_customers VALUES ('Alice'), ('Carol');

-- Return orders from VIP customers:
SELECT * FROM orders
WHERE customer IN (SELECT customer FROM vip_customers);

-- 7. NOT IN with NULL trap (dangerous)
-- Suppose some manager_id rows are NULL:
CREATE TABLE IF NOT EXISTS staff (id INT PRIMARY KEY, manager_id INT);
INSERT INTO staff VALUES (1, NULL), (2, 1), (3, 2);

-- This returns NOTHING because manager_id contains NULL:
SELECT * FROM staff WHERE id NOT IN (SELECT manager_id FROM staff);
-- Fix: exclude NULLs from the subquery
SELECT * FROM staff
WHERE id NOT IN (SELECT manager_id FROM staff WHERE manager_id IS NOT NULL);`,
  codeTitle: 'IN and NOT IN — Matching Against a List',
  points: [
    'IN (val1, val2, ...) is cleaner and more maintainable than chaining multiple OR conditions',
    'NOT IN (val1, val2, ...) excludes rows matching any value in the list',
    'IN works with a subquery: IN (SELECT ...) — the inner query produces the list dynamically',
    'The optimizer typically converts small IN lists to equivalent OR conditions internally',
    'NOT IN with a subquery that returns any NULL value silently returns zero rows — a notorious gotcha',
    'To safely negate a subquery with possible NULLs, use NOT EXISTS instead of NOT IN',
    'IN is exact match only — for pattern matching use LIKE, for ranges use BETWEEN',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "NOT IN breaks silently when the list (or subquery) contains any NULL value. Because NULL means 'unknown', the condition 'id NOT IN (1, 2, NULL)' evaluates to NULL for every row — and WHERE only keeps TRUE results. Use NOT EXISTS or add WHERE col IS NOT NULL to the subquery.",
    },
    {
      type: 'tip',
      content: 'For very large IN lists (hundreds of values), consider loading them into a temporary table and using a JOIN instead. Large IN lists can prevent the optimizer from using indexes efficiently, while a JOIN on an indexed column stays fast.',
    },
    {
      type: 'interview',
      content: "Q: What's the difference between IN and EXISTS in SQL?\nA: IN retrieves all values from the subquery first, then checks each outer row against the whole list — if the subquery returns a large result set, this is memory-intensive. EXISTS stops at the first match — it's a short-circuit check. For large subqueries, EXISTS is often faster. For small lists, IN is simpler and equally fast.",
    },
  ],
}
