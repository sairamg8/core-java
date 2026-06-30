export default {
  id: 'inner-join',
  title: '215. INNER JOIN',
  explanation: `INNER JOIN combines rows from two tables where a matching row exists in both. Rows with no match in either table are excluded from the result.

**Syntax:**
\`\`\`sql
SELECT columns
FROM   table1
INNER JOIN table2 ON table1.key = table2.key;
\`\`\`

**How it works:**
For each row in table1, MySQL looks for rows in table2 where the ON condition is true. Only matching pairs are included. Non-matching rows from either table are discarded.

\`\`\`
customers:          orders:
id | name           id | customer_id | total
1  | Alice          1  | 1           | 250
2  | Bob            2  | 1           | 89
3  | Carol          3  | 2           | 50

INNER JOIN result (Carol has no orders — excluded):
customer_id | name  | total
1           | Alice | 250
1           | Alice | 89
2           | Bob   | 50
\`\`\`

**Table aliases:**
\`\`\`sql
SELECT c.name, o.total
FROM customers c
INNER JOIN orders o ON c.id = o.customer_id;
\`\`\`
Aliases (c, o) make queries shorter and essential when joining a table to itself.

**Joining more than two tables:**
\`\`\`sql
SELECT c.name, o.id AS order_id, p.name AS product
FROM customers c
INNER JOIN orders o      ON c.id = o.customer_id
INNER JOIN order_items i ON o.id = i.order_id
INNER JOIN products p    ON i.product_id = p.id;
\`\`\`

**JOIN is INNER JOIN:**
\`JOIN\` without a modifier defaults to INNER JOIN.`,
  code: `-- ===== INNER JOIN =====

-- Setup
CREATE TABLE IF NOT EXISTS customers (
    id   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    city VARCHAR(50)
);
CREATE TABLE IF NOT EXISTS orders (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_id INT UNSIGNED,
    product     VARCHAR(100),
    total       DECIMAL(10,2),
    status      VARCHAR(20)
);
INSERT INTO customers (name, city) VALUES
    ('Alice', 'New York'),
    ('Bob',   'London'),
    ('Carol', 'Paris');     -- Carol has no orders
INSERT INTO orders (customer_id, product, total, status) VALUES
    (1, 'Java Bible',   49.99, 'delivered'),
    (1, 'IntelliJ',    199.00, 'delivered'),
    (2, 'USB Hub',      19.99, 'pending'),
    (99, 'Unknown',     0.00, 'error');   -- orphan row: customer 99 doesn't exist

-- 1. Basic INNER JOIN — only matching rows (Carol excluded, id=99 excluded)
SELECT c.name, o.product, o.total
FROM customers c
INNER JOIN orders o ON c.id = o.customer_id;

-- 2. JOIN without INNER keyword (same result — INNER is the default)
SELECT c.name, o.product, o.total
FROM customers c
JOIN orders o ON c.id = o.customer_id;

-- 3. Filter after JOIN
SELECT c.name, o.product, o.total
FROM customers c
JOIN orders o ON c.id = o.customer_id
WHERE o.status = 'delivered';

-- 4. Aggregation with JOIN
SELECT c.name, COUNT(o.id) AS order_count, SUM(o.total) AS total_spent
FROM customers c
JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name
ORDER BY total_spent DESC;

-- 5. Three-table JOIN
CREATE TABLE IF NOT EXISTS order_items (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id   INT UNSIGNED,
    product_id INT UNSIGNED,
    qty        INT
);
CREATE TABLE IF NOT EXISTS products (
    id    INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name  VARCHAR(100),
    price DECIMAL(10,2)
);

SELECT c.name AS customer, p.name AS product, oi.qty
FROM customers c
JOIN orders o      ON c.id = o.customer_id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p    ON oi.product_id = p.id;

-- 6. Self JOIN — find employees and their managers (same table twice)
CREATE TABLE IF NOT EXISTS staff (
    id        INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name      VARCHAR(100),
    manager_id INT UNSIGNED
);
INSERT INTO staff (name, manager_id) VALUES ('CEO', NULL), ('Alice', 1), ('Bob', 1);

SELECT e.name AS employee, m.name AS manager
FROM staff e
JOIN staff m ON e.manager_id = m.id;   -- self join with aliases`,
  codeTitle: 'INNER JOIN — Combining Rows from Two Tables',
  points: [
    'INNER JOIN returns only rows where the ON condition matches in both tables',
    'Rows with no match in either table are silently excluded — this is the key difference from LEFT/RIGHT JOIN',
    'JOIN without a qualifier defaults to INNER JOIN — they are identical',
    'Always use table aliases (c, o) in multi-table queries to avoid ambiguous column names',
    'Multiple JOINs chain left to right — each JOIN adds one more table to the result',
    'A self JOIN joins a table to itself with two different aliases — used for hierarchical data (employees and managers)',
    'The ON clause is where you specify the join key — it does not need to be a foreign key, but usually is',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "If you join two tables without an ON condition (accidental cartesian join), you get every row from table1 paired with every row from table2 — 1000 rows × 1000 rows = 1,000,000 result rows. Always verify your JOIN has a meaningful ON condition. EXPLAIN SELECT can reveal a cartesian join by showing a very large row estimate.",
    },
    {
      type: 'tip',
      content: "Always join on indexed columns — typically primary keys and foreign keys. A join on a non-indexed column requires a full table scan for every row in the driving table, turning an O(n) operation into O(n²). Check EXPLAIN output to confirm indexes are being used.",
    },
    {
      type: 'interview',
      content: "Q: What is the difference between INNER JOIN and OUTER JOIN?\nA: INNER JOIN returns only rows where both tables have a match. OUTER JOINs (LEFT, RIGHT, FULL) return all rows from one or both tables, filling in NULLs for columns where no match exists. INNER JOIN is exclusive (intersection); OUTER JOINs are inclusive for the specified side.",
    },
  ],
}
