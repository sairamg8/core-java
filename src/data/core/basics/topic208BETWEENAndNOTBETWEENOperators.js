export default {
  id: 'between-and-not-between-operators',
  title: '208. BETWEEN and NOT BETWEEN Operators',
  explanation: `BETWEEN tests whether a value falls within a range. It works on numbers, dates, and strings.

**Syntax:**
\`\`\`sql
WHERE column BETWEEN low AND high
WHERE column NOT BETWEEN low AND high
\`\`\`

**Important: BETWEEN is inclusive on both ends.**
\`\`\`sql
WHERE salary BETWEEN 50000 AND 80000
\`\`\`
This is exactly equivalent to:
\`\`\`sql
WHERE salary >= 50000 AND salary <= 80000
\`\`\`
Both endpoints are included.

**Numeric ranges:**
\`\`\`sql
WHERE age BETWEEN 18 AND 65
WHERE price BETWEEN 10.00 AND 49.99
\`\`\`

**Date ranges:**
\`\`\`sql
WHERE hire_date BETWEEN '2020-01-01' AND '2022-12-31'
\`\`\`
With DATETIME columns, BETWEEN '2020-01-01' AND '2020-12-31' only goes up to midnight on Dec 31. To include the full day, use: \`< '2021-01-01'\` instead.

**String ranges:**
BETWEEN on strings uses alphabetical (collation) order:
\`\`\`sql
WHERE last_name BETWEEN 'A' AND 'M'   -- last names starting A through M
\`\`\`

**NOT BETWEEN:**
\`\`\`sql
WHERE salary NOT BETWEEN 50000 AND 80000
-- same as: salary < 50000 OR salary > 80000
\`\`\`

BETWEEN reads more naturally and is generally clearer than its equivalent AND/OR form.`,
  code: `-- ===== BETWEEN and NOT BETWEEN =====

-- Setup
CREATE TABLE IF NOT EXISTS products (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    price      DECIMAL(10,2) NOT NULL,
    stock      INT DEFAULT 0,
    created    DATE
);
INSERT INTO products (name, price, stock, created) VALUES
    ('Budget Mouse',   9.99,  500, '2022-03-01'),
    ('Mechanical Kbd', 89.99, 40,  '2021-06-15'),
    ('USB Hub',        19.99, 200, '2023-01-10'),
    ('Monitor 27"',   299.99, 15,  '2022-11-20'),
    ('Webcam HD',      49.99, 75,  '2023-05-05'),
    ('Laptop Stand',   34.99, 120, '2021-09-30');

-- 1. Numeric BETWEEN (inclusive both ends)
SELECT name, price FROM products WHERE price BETWEEN 20.00 AND 100.00;
-- Mechanical Kbd (89.99), Webcam HD (49.99), Laptop Stand (34.99)

-- 2. Equivalent with >= and <=
SELECT name, price FROM products WHERE price >= 20.00 AND price <= 100.00;
-- Identical result

-- 3. NOT BETWEEN
SELECT name, price FROM products WHERE price NOT BETWEEN 20.00 AND 100.00;
-- Budget Mouse (9.99), Monitor 27" (299.99)

-- 4. BETWEEN on stock count
SELECT name, stock FROM products WHERE stock BETWEEN 50 AND 200;

-- 5. Date BETWEEN (inclusive)
SELECT name, created FROM products
WHERE created BETWEEN '2022-01-01' AND '2022-12-31';

-- 6. DATETIME range tip: use < next-day for full-day inclusion
-- For DATETIME columns, don't use BETWEEN for daily ranges:
-- BETWEEN '2023-05-05' AND '2023-05-05' misses any time after midnight
-- Better:
-- WHERE created_at >= '2023-05-05' AND created_at < '2023-05-06'

-- 7. String BETWEEN (alphabetical order)
SELECT name FROM products WHERE name BETWEEN 'B' AND 'M';
-- Budget Mouse, Laptop Stand, Mechanical Kbd (alphabetically between B and M)

-- 8. Combining BETWEEN with AND
SELECT name, price, stock FROM products
WHERE price BETWEEN 10.00 AND 60.00
  AND stock BETWEEN 50 AND 300;`,
  codeTitle: 'BETWEEN and NOT BETWEEN for Range Queries',
  points: [
    'BETWEEN low AND high is inclusive on both ends — equivalent to >= low AND <= high',
    'NOT BETWEEN is exclusive on both endpoints — equivalent to < low OR > high',
    'BETWEEN works on numbers, dates, and strings (strings use alphabetical/collation order)',
    'For DATETIME columns, BETWEEN on date strings may miss time components — prefer >= and < instead',
    'BETWEEN makes range intent clearer than equivalent AND/OR — prefer it for readability',
    'The order matters: BETWEEN 10 AND 50 is valid; BETWEEN 50 AND 10 returns no rows',
    'BETWEEN is syntactic sugar — the query optimizer treats it identically to >= AND <=',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "BETWEEN is inclusive on both ends. If you write WHERE hire_date BETWEEN '2023-01-01' AND '2023-01-31' with a DATETIME column, it only catches rows with time exactly 00:00:00 on Jan 31. Use WHERE hire_date >= '2023-01-01' AND hire_date < '2023-02-01' to capture the full day.",
    },
    {
      type: 'tip',
      content: 'If the low value is greater than the high value — BETWEEN 100 AND 10 — MySQL returns no rows without an error. This is a common bug when dynamically building queries from user input. Always validate that min <= max before executing the query.',
    },
    {
      type: 'interview',
      content: "Q: Is BETWEEN inclusive or exclusive?\nA: Inclusive on both ends. BETWEEN 10 AND 20 is exactly equivalent to >= 10 AND <= 20. Both 10 and 20 are included in the result. This is different from Python's range() which is exclusive on the upper bound — a common confusion for developers switching between languages.",
    },
  ],
}
