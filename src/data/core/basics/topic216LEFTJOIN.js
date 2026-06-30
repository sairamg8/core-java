export default {
  id: 'left-join',
  title: '216. LEFT JOIN',
  explanation: `LEFT JOIN (also called LEFT OUTER JOIN) returns all rows from the left table, plus any matching rows from the right table. When there is no match in the right table, the right-side columns are NULL.

**Syntax:**
\`\`\`sql
SELECT columns
FROM   left_table
LEFT JOIN right_table ON left_table.key = right_table.key;
\`\`\`

**Visual comparison:**
\`\`\`
customers (left):    orders (right):
id | name            id | customer_id
1  | Alice           1  | 1
2  | Bob             2  | 1
3  | Carol           (Carol has no orders)

LEFT JOIN result:
name  | order_id
Alice | 1
Alice | 2
Bob   | NULL    ← Bob has no orders — NULL on right side
Carol | NULL    ← Carol has no orders — NULL on right side
\`\`\`

**Finding rows with NO match (anti-join):**
\`\`\`sql
SELECT c.name
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.id IS NULL;   -- customers with no orders at all
\`\`\`
This is the "find all X that have no Y" pattern — extremely common.

**LEFT JOIN vs INNER JOIN:**
- INNER JOIN: only customers who have orders (Alice)
- LEFT JOIN: all customers, NULL for those without orders (Alice, Bob, Carol)

**Key rules:**
- "Left" = the table before LEFT JOIN
- "Right" = the table after LEFT JOIN
- All left rows appear; right columns are NULL when no match
- LEFT OUTER JOIN and LEFT JOIN are identical`,
  code: `-- ===== LEFT JOIN =====

-- Setup
CREATE TABLE IF NOT EXISTS customers (
    id   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);
CREATE TABLE IF NOT EXISTS orders (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_id INT UNSIGNED,
    total       DECIMAL(10,2),
    status      VARCHAR(20)
);
INSERT INTO customers (name) VALUES ('Alice'), ('Bob'), ('Carol'), ('David');
INSERT INTO orders (customer_id, total, status) VALUES
    (1, 250.00, 'delivered'),
    (1,  89.99, 'pending'),
    (2,  45.00, 'delivered');
-- Carol and David have no orders

-- 1. LEFT JOIN — all customers, NULL for those without orders
SELECT c.name, o.id AS order_id, o.total
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id;
-- Alice: 2 rows, Bob: 2 rows (wait — actually Bob has 1 order)
-- Carol: 1 row with NULL, David: 1 row with NULL

-- 2. INNER JOIN for comparison — excludes customers with no orders
SELECT c.name, o.id AS order_id, o.total
FROM customers c
INNER JOIN orders o ON c.id = o.customer_id;
-- Only Alice and Bob

-- 3. Find customers with NO orders (anti-join pattern)
SELECT c.name
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.id IS NULL;
-- Carol, David

-- 4. Aggregate with LEFT JOIN — include customers with 0 orders
SELECT
    c.name,
    COUNT(o.id)   AS order_count,
    COALESCE(SUM(o.total), 0) AS total_spent
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
GROUP BY c.id, c.name
ORDER BY total_spent DESC;
-- Includes Carol and David with count=0, total=0.00

-- 5. Filter on the right table (changes LEFT JOIN to an INNER JOIN effectively)
-- Put filters in the ON clause, not WHERE, to preserve left-table rows
SELECT c.name, o.total
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id AND o.status = 'delivered';
-- All customers shown; only delivered orders matched

-- Compare with WHERE (excludes customers with no delivered orders):
SELECT c.name, o.total
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.status = 'delivered';   -- turns LEFT JOIN into INNER JOIN!`,
  codeTitle: 'LEFT JOIN — All Left Rows, NULL Where No Match',
  points: [
    'LEFT JOIN returns every row from the left table; right-side columns are NULL when no match exists',
    'Use LEFT JOIN when you need all rows from the primary table regardless of whether they have related rows',
    'Anti-join pattern: LEFT JOIN + WHERE right.id IS NULL finds left-side rows with no match on the right',
    'COUNT(o.id) counts matched rows (NULL not counted); COUNT(*) would count all rows including NULLs',
    'Filters in the WHERE clause on right-table columns effectively convert LEFT JOIN to INNER JOIN',
    'Put right-table filters in the ON clause to preserve all left rows while filtering right matches',
    'LEFT OUTER JOIN and LEFT JOIN are identical — OUTER is optional noise',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "Putting a WHERE filter on the right-table column silently converts your LEFT JOIN to an INNER JOIN. WHERE o.status = 'delivered' excludes rows where o.status is NULL — which is every customer without a delivered order. Move that filter to the ON clause: ON c.id = o.customer_id AND o.status = 'delivered' to keep all customers.",
    },
    {
      type: 'tip',
      content: "Use COALESCE(SUM(col), 0) instead of SUM(col) when aggregating with LEFT JOIN. SUM returns NULL when there are no matching rows (e.g., a customer with no orders). COALESCE converts NULL to 0, giving you a cleaner result for reporting.",
    },
    {
      type: 'interview',
      content: "Q: How would you find all customers who have never placed an order?\nA: Use LEFT JOIN + IS NULL: SELECT c.name FROM customers c LEFT JOIN orders o ON c.id = o.customer_id WHERE o.id IS NULL. This is called an anti-join. LEFT JOIN includes all customers; WHERE o.id IS NULL keeps only those where no order row matched.",
    },
  ],
}
