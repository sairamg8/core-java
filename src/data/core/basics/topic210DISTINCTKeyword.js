export default {
  id: 'distinct-keyword',
  title: '210. DISTINCT Keyword',
  explanation: `DISTINCT removes duplicate rows from a query result. It applies to the entire row — two rows are duplicates only if every selected column value is identical.

**Syntax:**
\`\`\`sql
SELECT DISTINCT column1, column2 FROM table;
\`\`\`

**Single column:**
\`\`\`sql
SELECT DISTINCT department FROM employees;
\`\`\`
Returns each department name exactly once, no matter how many employees are in it.

**Multiple columns:**
\`\`\`sql
SELECT DISTINCT department, job_title FROM employees;
\`\`\`
Returns unique (department, job_title) combinations — two rows are considered duplicates only if both columns match.

**DISTINCT vs GROUP BY:**
For simple deduplication, both give the same result:
\`\`\`sql
SELECT DISTINCT department FROM employees;
SELECT department FROM employees GROUP BY department;
\`\`\`
GROUP BY is preferred when you also need aggregates (COUNT, SUM, etc.). DISTINCT is cleaner for pure deduplication.

**COUNT(DISTINCT column):**
\`\`\`sql
SELECT COUNT(DISTINCT department) FROM employees;
\`\`\`
Counts how many unique departments exist — a very common pattern.

**Performance note:**
DISTINCT requires sorting or hashing all rows to identify duplicates. On large tables, it can be expensive. If you find yourself using DISTINCT a lot on a query that should return unique data, investigate whether the query or data model needs to be fixed — DISTINCT is often masking a schema issue like a missing GROUP BY or an accidental cartesian join.`,
  code: `-- ===== DISTINCT Keyword =====

-- Setup
CREATE TABLE IF NOT EXISTS orders (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer   VARCHAR(100) NOT NULL,
    country    VARCHAR(50),
    status     VARCHAR(20),
    category   VARCHAR(50),
    total      DECIMAL(10,2)
);
INSERT INTO orders (customer, country, status, category, total) VALUES
    ('Alice',  'US',  'delivered', 'Books',    49.99),
    ('Alice',  'US',  'pending',   'Hardware', 89.99),
    ('Bob',    'UK',  'shipped',   'Books',    24.99),
    ('Carol',  'US',  'delivered', 'Software', 199.99),
    ('Carol',  'IN',  'pending',   'Books',    34.99),
    ('David',  'IN',  'cancelled', 'Hardware', 15.00),
    ('Eve',    'UK',  'delivered', 'Software', 99.99);

-- 1. Single column DISTINCT
SELECT DISTINCT country FROM orders;     -- US, UK, IN
SELECT DISTINCT status  FROM orders;     -- delivered, pending, shipped, cancelled
SELECT DISTINCT category FROM orders;   -- Books, Hardware, Software

-- 2. Multi-column DISTINCT (unique combinations)
SELECT DISTINCT country, status FROM orders;
-- US/delivered, US/pending, UK/shipped, UK/delivered, IN/pending, IN/cancelled

-- 3. DISTINCT vs. duplicates side by side
SELECT country FROM orders;              -- 7 rows (with duplicates)
SELECT DISTINCT country FROM orders;    -- 3 rows (unique only)

-- 4. COUNT(DISTINCT col) — how many unique values?
SELECT COUNT(DISTINCT country)  AS unique_countries FROM orders;   -- 3
SELECT COUNT(DISTINCT customer) AS unique_customers FROM orders;   -- 4
SELECT COUNT(DISTINCT category) AS unique_categories FROM orders;  -- 3

-- 5. DISTINCT with ORDER BY
SELECT DISTINCT country FROM orders ORDER BY country ASC;

-- 6. DISTINCT with WHERE (filter first, then deduplicate)
SELECT DISTINCT customer FROM orders WHERE status = 'delivered';

-- 7. GROUP BY vs DISTINCT (same result for deduplication)
SELECT DISTINCT department FROM employees;
SELECT department FROM employees GROUP BY department;

-- 8. Aggregation with DISTINCT inside COUNT
SELECT
    COUNT(*)                     AS total_orders,
    COUNT(DISTINCT customer)     AS unique_customers,
    COUNT(DISTINCT country)      AS unique_countries
FROM orders;`,
  codeTitle: 'DISTINCT — Removing Duplicate Rows',
  points: [
    'DISTINCT applies to the entire selected row — a duplicate is where every column in SELECT matches',
    'SELECT DISTINCT col returns each unique value once, regardless of how many times it appears',
    'Multi-column DISTINCT: SELECT DISTINCT a, b returns unique (a, b) pairs, not unique a or b individually',
    'COUNT(DISTINCT col) counts how many distinct values a column has — very common in analytics queries',
    'DISTINCT requires sorting or hashing all rows — it can be slow on large tables without indexes',
    'If you use DISTINCT often to clean up results, investigate the query — it may mask a cartesian JOIN or missing GROUP BY',
    'GROUP BY gives the same result as DISTINCT for pure deduplication; use GROUP BY when you also need aggregates',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "DISTINCT operates on the entire row, not just one column. SELECT DISTINCT a, b FROM t returns unique (a, b) pairs — if you need unique a values only, use SELECT DISTINCT a FROM t. A common mistake is writing SELECT DISTINCT a, b expecting unique a's but getting duplicate a's paired with different b's.",
    },
    {
      type: 'tip',
      content: "Using DISTINCT to remove duplicates from a JOIN result often signals a schema or query problem. If your JOIN produces duplicate rows and you're hiding them with DISTINCT, check: are you missing a WHERE condition? Is the JOIN accidentally creating a Cartesian product? Fix the root cause rather than masking it.",
    },
    {
      type: 'interview',
      content: "Q: What is the difference between DISTINCT and GROUP BY?\nA: For pure deduplication with no aggregation, they produce identical results. The difference is intent and capability: DISTINCT is for removing duplicate rows from a SELECT. GROUP BY is for grouping rows for aggregation (COUNT, SUM, AVG, etc.) — it can also deduplicate as a side effect. Always use GROUP BY when you need aggregate functions.",
    },
  ],
}
