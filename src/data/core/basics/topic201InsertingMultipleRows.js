export default {
  id: 'inserting-multiple-rows',
  title: '201. Inserting Multiple Rows',
  explanation: `Inserting rows one at a time is inefficient when you have many records to add. MySQL lets you insert multiple rows in a single INSERT statement, dramatically reducing the number of round-trips to the database.

**Single vs. Multi-row Insert:**
\`\`\`sql
-- Slow: 3 separate round-trips
INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com');
INSERT INTO users (name, email) VALUES ('Bob', 'bob@example.com');
INSERT INTO users (name, email) VALUES ('Carol', 'carol@example.com');

-- Fast: 1 round-trip
INSERT INTO users (name, email) VALUES
    ('Alice', 'alice@example.com'),
    ('Bob',   'bob@example.com'),
    ('Carol', 'carol@example.com');
\`\`\`

**Why it's faster:**
Each SQL statement involves a network round-trip (client → server → client), parsing, optimization, and transaction overhead. A multi-row INSERT amortizes all of that across all rows — the server processes the entire batch in one go.

**Practical batch size:**
For very large datasets (thousands+ rows), chunk your inserts into batches of 500–1000 rows per statement. Extremely large single inserts can consume too much memory or hit packet size limits (\`max_allowed_packet\`).

**With SELECT (copy rows):**
\`\`\`sql
INSERT INTO archived_orders (id, customer_id, total)
SELECT id, customer_id, total FROM orders WHERE status = 'completed';
\`\`\`

**INSERT with DEFAULT values:**
If a column has a DEFAULT, you can omit it entirely or use the DEFAULT keyword:
\`\`\`sql
INSERT INTO products (name, price) VALUES
    ('Widget', 9.99),
    ('Gadget', 19.99);   -- stock_qty defaults to 0, is_active defaults to TRUE
\`\`\``,
  code: `-- ===== Inserting Multiple Rows =====

-- Setup
CREATE TABLE IF NOT EXISTS students (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    course     VARCHAR(50)  NOT NULL,
    grade      CHAR(1),
    enrolled   DATE         DEFAULT (CURRENT_DATE)
);

-- 1. Bad: 4 separate statements (4 round-trips)
INSERT INTO students (name, course, grade) VALUES ('Alice',   'Java', 'A');
INSERT INTO students (name, course, grade) VALUES ('Bob',     'Java', 'B');
INSERT INTO students (name, course, grade) VALUES ('Carol',   'SQL',  'A');
INSERT INTO students (name, course, grade) VALUES ('David',   'SQL',  'C');

-- 2. Good: single statement (1 round-trip, same result)
INSERT INTO students (name, course, grade) VALUES
    ('Alice',   'Java', 'A'),
    ('Bob',     'Java', 'B'),
    ('Carol',   'SQL',  'A'),
    ('David',   'SQL',  'C');

-- 3. Omitting columns that have defaults
INSERT INTO students (name, course) VALUES
    ('Eve',   'Docker'),     -- grade is NULL, enrolled is today
    ('Frank', 'Spring');     -- grade is NULL, enrolled is today

-- 4. INSERT ... SELECT (copy from another table)
CREATE TABLE IF NOT EXISTS java_students AS
SELECT * FROM students WHERE course = 'Java';

INSERT INTO java_students (name, course, grade)
SELECT name, course, grade FROM students WHERE course = 'Java';

-- 5. Confirm all rows
SELECT * FROM students ORDER BY id;

-- 6. Row count
SELECT COUNT(*) AS total FROM students;`,
  codeTitle: 'Inserting Multiple Rows Efficiently',
  points: [
    'Multi-row INSERT is a single round-trip — far faster than N separate INSERT statements for N rows',
    'All rows in one INSERT are part of the same implicit transaction — either all succeed or all fail',
    'Batch your inserts into 500–1000 rows per statement to avoid hitting max_allowed_packet limits',
    'Columns with DEFAULT values can be omitted — MySQL fills them automatically',
    'INSERT INTO ... SELECT copies rows from a query result directly, without any application-layer loop',
    'LAST_INSERT_ID() after a multi-row insert returns the ID of the first row inserted in that batch',
    'For very large data loads, LOAD DATA INFILE is even faster — it reads directly from a CSV file',
  ],
  callouts: [
    {
      type: 'tip',
      content: 'When migrating or seeding data, use INSERT INTO ... SELECT to copy rows between tables directly in SQL. This is orders of magnitude faster than reading rows in application code and re-inserting them, because no data leaves the database server.',
    },
    {
      type: 'gotcha',
      content: 'LAST_INSERT_ID() after a multi-row INSERT returns the ID of the FIRST newly inserted row, not the last. If you inserted 3 rows and the first got id=5, LAST_INSERT_ID() returns 5, even though the last row is id=7. Plan accordingly if you need all generated IDs.',
    },
    {
      type: 'interview',
      content: 'Q: Why is a single multi-row INSERT faster than multiple single-row inserts?\nA: Three reasons: (1) fewer network round-trips — one statement instead of N; (2) the query is parsed and optimized once; (3) all rows are written in one atomic transaction with a single redo log flush. The difference matters at scale — inserting 10,000 rows takes seconds as a batch vs. minutes one-by-one.',
    },
  ],
}
