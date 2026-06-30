export default {
  id: 'introduction-sql',
  title: '190. Introduction',
  explanation: `SQL (Structured Query Language) is the standard language for managing and querying relational databases. Understanding SQL is essential for any Java backend developer.

**What is SQL?**
SQL is a domain-specific language designed for:
- **Querying data:** SELECT statements to retrieve information
- **Manipulating data:** INSERT, UPDATE, DELETE
- **Defining structure:** CREATE TABLE, ALTER TABLE, DROP
- **Controlling access:** GRANT, REVOKE

**History:**
SQL was developed at IBM in the early 1970s by Donald Chamberlin and Raymond Boyce, based on Edgar Codd's relational model. The first SQL standard (SQL-86) was published in 1986 by ANSI/ISO. SQL has been continuously updated: SQL-92, SQL:1999, SQL:2003, SQL:2011, SQL:2016.

**SQL vs NoSQL:**
- SQL (relational): structured tables, strict schema, ACID transactions — MySQL, PostgreSQL, Oracle
- NoSQL: flexible schemas, horizontal scaling — MongoDB (documents), Redis (key-value), Cassandra (wide column)

**SQL categories (sublanguages):**
- **DDL** (Data Definition Language): CREATE, ALTER, DROP, TRUNCATE
- **DML** (Data Manipulation Language): SELECT, INSERT, UPDATE, DELETE
- **DCL** (Data Control Language): GRANT, REVOKE
- **TCL** (Transaction Control Language): COMMIT, ROLLBACK, SAVEPOINT

**Why Java developers must know SQL:**
- Spring Data JPA generates SQL under the hood — understanding SQL helps debug generated queries
- Performance tuning requires reading query execution plans
- Not all queries map well to ORM — sometimes raw SQL is the right tool
- Data migrations, reporting, analytics all require SQL

**SQL Dialects:**
Each database has its own SQL dialect (slight differences in syntax):
  MySQL, PostgreSQL, SQLite, Oracle, SQL Server — all slightly different.`,
  code: `-- ===== SQL Introduction — Key Concepts =====

-- 1. SQL is NOT case-sensitive for keywords
-- These are identical:
SELECT * FROM users;
select * from users;
SELECT * FROM USERS;

-- 2. SQL statements end with semicolons (;)

-- 3. SQL Comments
-- This is a single-line comment
/* This is a
   multi-line comment */

-- 4. The four DML operations (CRUD)
-- CREATE data:
INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com');

-- READ data:
SELECT name, email FROM users WHERE age > 18;

-- UPDATE data:
UPDATE users SET email = 'new@example.com' WHERE id = 1;

-- DELETE data:
DELETE FROM users WHERE id = 1;

-- 5. DDL — structure management
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE products ADD COLUMN category VARCHAR(50);

DROP TABLE products;

-- 6. SELECT is the most common SQL statement
SELECT
    p.name,
    p.price,
    c.name AS category_name
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE p.price > 10.00
ORDER BY p.price DESC
LIMIT 10;

-- 7. Aggregate functions
SELECT
    category_id,
    COUNT(*) AS product_count,
    AVG(price) AS avg_price,
    MAX(price) AS max_price
FROM products
GROUP BY category_id
HAVING COUNT(*) > 5;`,
  codeTitle: 'SQL Introduction — Core Language Overview',
  points: [
    'SQL stands for Structured Query Language — the standard for communicating with relational databases',
    'SQL sublanguages: DDL (structure), DML (data: SELECT/INSERT/UPDATE/DELETE), DCL (access), TCL (transactions)',
    'SQL keywords are NOT case-sensitive, but convention is to write them in UPPERCASE for readability',
    'SELECT retrieves data; INSERT adds rows; UPDATE modifies rows; DELETE removes rows',
    'SQL is declarative — you describe WHAT you want, not HOW to get it (the database engine decides)',
    'Every SQL database (MySQL, PostgreSQL, Oracle, SQLite) has its own dialect with slight syntax differences',
    'Java developers use SQL through JDBC directly, JPA/Hibernate ORM, or Spring Data — understanding SQL is essential for all three',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'SQL is declarative but performance is NOT automatic. Writing SELECT * FROM orders JOIN users ON ... can be fast or painfully slow depending on indexes and data volume. Always test queries with realistic data sizes and use EXPLAIN to understand execution plans.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between SQL and NoSQL databases?\nA: SQL databases store data in structured tables with a fixed schema and support ACID transactions. NoSQL databases (MongoDB, Redis, Cassandra) use flexible schemas (documents, key-value, columns, graphs) and prioritize horizontal scalability. Most applications use both — SQL for structured business data, NoSQL for caching, sessions, or large unstructured data.',
    },
    {
      type: 'tip',
      content: 'Learn SQL in this order: SELECT (querying), WHERE (filtering), JOINs (combining tables), GROUP BY (aggregation), then DDL (creating structure). Querying is 80% of day-to-day SQL work — master SELECT before anything else.',
    },
  ],
}
