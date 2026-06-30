export default {
  id: 'cross-join',
  title: '218. CROSS JOIN',
  explanation: `CROSS JOIN produces the Cartesian product of two tables — every row from the left table paired with every row from the right table. It has no ON condition.

**Syntax:**
\`\`\`sql
SELECT * FROM table1 CROSS JOIN table2;
\`\`\`

**Result size:**
If table1 has M rows and table2 has N rows, the result has M × N rows.
- 3 sizes × 4 colors = 12 combinations
- 100 rows × 100 rows = 10,000 rows
- 1000 rows × 1000 rows = 1,000,000 rows — be careful with large tables

**When CROSS JOIN is intentional:**
1. **Generating all combinations**: sizes vs colors, test scenarios vs environments
2. **Building a date table**: all dates in a range combined with categories
3. **Seeding test data**: generate many fake rows from small lookup tables

\`\`\`sql
-- All size × color combinations for a product catalog
SELECT s.size, c.color FROM sizes s CROSS JOIN colors c;
\`\`\`

**Accidental Cartesian join:**
An INNER JOIN or other JOIN without a proper ON condition produces an accidental Cartesian join:
\`\`\`sql
-- MISTAKE: no ON condition, or wrong ON condition
SELECT * FROM employees, departments;            -- old implicit join syntax, Cartesian
SELECT * FROM employees JOIN departments;        -- ERROR in MySQL (ON required)
SELECT * FROM employees JOIN departments ON 1=1; -- explicit but silly — all combos
\`\`\`

**CROSS JOIN vs INNER JOIN with a TRUE condition:**
\`\`\`sql
SELECT * FROM a CROSS JOIN b
-- is identical to:
SELECT * FROM a INNER JOIN b ON TRUE
\`\`\``,
  code: `-- ===== CROSS JOIN =====

-- Setup: small lookup tables
CREATE TABLE IF NOT EXISTS sizes  (size  VARCHAR(10));
CREATE TABLE IF NOT EXISTS colors (color VARCHAR(20));
INSERT INTO sizes  VALUES ('S'), ('M'), ('L'), ('XL');
INSERT INTO colors VALUES ('Red'), ('Blue'), ('Green');

-- 1. CROSS JOIN — all size × color combinations (4 × 3 = 12 rows)
SELECT s.size, c.color
FROM sizes s
CROSS JOIN colors c
ORDER BY s.size, c.color;

-- 2. Old comma syntax (implicit CROSS JOIN — avoid this style)
SELECT s.size, c.color FROM sizes s, colors c ORDER BY s.size;  -- same result, old way

-- 3. Real use case: generate a price matrix (product × tier)
CREATE TABLE IF NOT EXISTS products  (name VARCHAR(50), base_price DECIMAL(10,2));
CREATE TABLE IF NOT EXISTS tiers     (tier VARCHAR(20), multiplier DECIMAL(4,2));
INSERT INTO products VALUES ('Widget', 10.00), ('Gadget', 25.00);
INSERT INTO tiers    VALUES ('Basic', 1.00), ('Pro', 1.5), ('Enterprise', 2.5);

SELECT
    p.name,
    t.tier,
    ROUND(p.base_price * t.multiplier, 2) AS tier_price
FROM products p
CROSS JOIN tiers t
ORDER BY p.name, t.tier;
-- Widget/Basic: 10.00, Widget/Pro: 15.00, Widget/Enterprise: 25.00 ...

-- 4. Generate a sequence of numbers using CROSS JOIN (useful for date tables)
CREATE TABLE IF NOT EXISTS digits (n INT);
INSERT INTO digits VALUES (0),(1),(2),(3),(4),(5),(6),(7),(8),(9);

SELECT d1.n * 10 + d0.n AS num
FROM digits d1
CROSS JOIN digits d0
ORDER BY num;
-- Generates 0–99

-- 5. Accidental Cartesian join (the bug to avoid)
-- If you forget ON in a regular JOIN:
CREATE TABLE IF NOT EXISTS a_table (x INT);
CREATE TABLE IF NOT EXISTS b_table (y INT);
INSERT INTO a_table VALUES (1),(2),(3);
INSERT INTO b_table VALUES (10),(20);

-- This is a cartesian product disguised as a regular query — 3 × 2 = 6 rows
SELECT * FROM a_table, b_table;   -- implicit cross join — usually a mistake

-- Detect with EXPLAIN — look for "Using join buffer (flat, BNL join)" with no key`,
  codeTitle: 'CROSS JOIN — Cartesian Product of Two Tables',
  points: [
    'CROSS JOIN produces M × N rows — every row from the left paired with every row from the right',
    'CROSS JOIN has no ON condition — it is intentionally without a join key',
    'Intentional uses: generating all combinations (sizes × colors, products × pricing tiers)',
    'Two small tables (e.g., 10 × 10 = 100 rows) are fine; CROSS JOIN on large tables can blow up the result',
    'Accidental CROSS JOINs happen when you forget an ON condition or use old comma-style implicit joins',
    'The old syntax SELECT * FROM a, b without a WHERE is an implicit CROSS JOIN — avoid it',
    'EXPLAIN reveals accidental cartesian joins by showing very high estimated row counts with no key used',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "Never run an accidental CROSS JOIN on production tables. SELECT * FROM orders, customers (no WHERE) with 10,000 orders and 5,000 customers returns 50,000,000 rows, likely crashing the query. Always add a join condition or explicit WHERE clause when querying multiple tables.",
    },
    {
      type: 'tip',
      content: "CROSS JOIN is excellent for generating test data. Combine a small set of names with a small set of values and you can insert thousands of varied rows: INSERT INTO test_orders SELECT c.name, p.name, RAND()*100 FROM customers c CROSS JOIN products p.",
    },
    {
      type: 'interview',
      content: "Q: When would you intentionally use a CROSS JOIN?\nA: Three common use cases: (1) generating all combinations of attributes (e.g., all clothing sizes × colors for a product catalog); (2) building a numbers or dates table by crossing digit tables; (3) seeding test data by combining small reference tables. Outside these cases, a CROSS JOIN in a production query usually indicates a missing ON clause.",
    },
  ],
}
