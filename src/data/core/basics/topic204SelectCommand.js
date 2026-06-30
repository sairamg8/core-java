export default {
  id: 'select-command',
  title: '204. Select Command',
  explanation: `SELECT is the most used SQL statement. It retrieves rows and columns from one or more tables. Every reporting query, every data read, every JOIN starts with SELECT.

**Basic syntax:**
\`\`\`sql
SELECT column1, column2, ...
FROM   table_name;
\`\`\`

**Select all columns:**
\`\`\`sql
SELECT * FROM users;
\`\`\`
\`SELECT *\` is fine for exploration but avoid it in production queries — it fetches unnecessary columns, breaks if columns are reordered, and prevents index-only scans.

**Column aliases:**
\`\`\`sql
SELECT first_name AS name, salary * 12 AS annual_salary
FROM employees;
\`\`\`
AS renames a column in the result. You can also omit AS: \`salary * 12 annual_salary\`.

**Expressions in SELECT:**
SELECT can compute values, not just retrieve stored ones:
\`\`\`sql
SELECT name, price * 0.9 AS discounted_price FROM products;
SELECT UPPER(name), LENGTH(name) FROM users;
SELECT NOW(), VERSION(), DATABASE();
\`\`\`

**LIMIT:**
\`\`\`sql
SELECT * FROM products LIMIT 10;         -- first 10 rows
SELECT * FROM products LIMIT 10 OFFSET 20; -- rows 21–30 (pagination)
\`\`\`

**Execution order (important for writing complex queries):**
FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT

Even though SELECT appears first in the syntax, the database processes it near the end — after filtering and grouping.`,
  code: `-- ===== SELECT Command =====

-- Setup
CREATE TABLE IF NOT EXISTS products (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    category   VARCHAR(50),
    price      DECIMAL(10,2) NOT NULL,
    stock      INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO products (name, category, price, stock) VALUES
    ('Java Bible',    'Books',    29.99, 120),
    ('Spring Guide',  'Books',    24.99, 85),
    ('Keyboard',      'Hardware', 89.99, 40),
    ('USB Hub',       'Hardware', 19.99, 200),
    ('IntelliJ IDEA', 'Software', 49.99, 500);

-- 1. Select specific columns (prefer this over SELECT *)
SELECT name, price, stock FROM products;

-- 2. Select all columns (good for exploration only)
SELECT * FROM products;

-- 3. Aliases — rename columns in results
SELECT name AS product_name, price AS unit_price FROM products;

-- 4. Computed columns
SELECT name, price, price * 0.9 AS sale_price FROM products;
SELECT name, stock, price * stock AS inventory_value FROM products;

-- 5. String and date functions in SELECT
SELECT
    UPPER(name)        AS upper_name,
    LENGTH(name)       AS name_len,
    ROUND(price, 0)    AS rounded_price
FROM products;

-- 6. Database/server info (no FROM needed)
SELECT NOW()       AS current_time;
SELECT VERSION()   AS mysql_version;
SELECT DATABASE()  AS active_db;
SELECT USER()      AS current_user;

-- 7. LIMIT — useful for large tables and pagination
SELECT * FROM products LIMIT 3;                     -- first 3 rows
SELECT * FROM products LIMIT 3 OFFSET 2;            -- rows 3, 4, 5

-- 8. DISTINCT (covered more in topic 210)
SELECT DISTINCT category FROM products;

-- 9. Expression without a table
SELECT 2 + 2 AS result;
SELECT ROUND(3.14159, 2) AS pi_approx;`,
  codeTitle: 'SELECT Command — Retrieval, Aliases, Expressions',
  points: [
    'SELECT retrieves rows; list specific columns by name rather than using SELECT * in production',
    'AS creates an alias — the column appears under the new name in results but the table is unchanged',
    'SELECT can compute expressions: arithmetic, string functions, date functions — not just stored column values',
    'LIMIT n restricts result count; LIMIT n OFFSET m enables pagination through large result sets',
    'SELECT NOW(), VERSION(), DATABASE() works without a FROM clause — useful for quick server info',
    'SQL execution order: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT',
    'DISTINCT in SELECT removes duplicate rows from the result (covered more in topic 210)',
  ],
  callouts: [
    {
      type: 'tip',
      content: 'Never use SELECT * in application code or stored procedures. It fetches columns you don\'t need (wasting bandwidth), breaks if columns are added/reordered, and prevents the query optimizer from using covering indexes. Always name the columns you actually need.',
    },
    {
      type: 'gotcha',
      content: 'LIMIT without ORDER BY returns an arbitrary set of rows — MySQL makes no guarantee about which rows are returned or in what order. Always pair LIMIT with ORDER BY if you care about which rows you get (e.g., pagination, "top N" queries).',
    },
    {
      type: 'interview',
      content: 'Q: In what order does MySQL process a SELECT statement?\nA: FROM (identify tables) → JOIN (combine tables) → WHERE (filter rows) → GROUP BY (aggregate) → HAVING (filter groups) → SELECT (choose columns/expressions) → DISTINCT (remove duplicates) → ORDER BY (sort) → LIMIT (restrict count). Understanding this order explains why you cannot use a SELECT alias in a WHERE clause — WHERE runs before SELECT.',
    },
  ],
}
