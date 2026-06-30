export default {
  id: 'data-vs-database-vs-dbms',
  title: '191. Data vs Database vs DBMS',
  explanation: `Understanding the distinction between raw data, a database, and a Database Management System (DBMS) is foundational before writing any SQL.

**Data:**
Raw facts and figures without context. "Alice", 25, "alice@example.com" — these are pieces of data.

Data becomes information when organized with context: "Alice is a 25-year-old user with email alice@example.com."

**Database:**
An organized collection of structured data stored electronically. It is just the container and its content — not the software that manages it.

A spreadsheet is a simple database. A collection of JSON files on disk is technically a database.

**DBMS (Database Management System):**
The software that creates, manages, and controls access to a database. The DBMS handles:
- Storing data efficiently
- Querying (finding data quickly with indexes)
- Updating and deleting data safely
- Concurrency control (multiple users at once)
- Transaction management (ACID)
- Security and access control
- Backup and recovery

Examples: MySQL, PostgreSQL, Oracle, SQL Server, SQLite, MongoDB

**Database System = Database + DBMS:**
When someone says "MySQL database," they usually mean the DBMS (MySQL) managing the database.

**Three-tier architecture:**
  Application → DBMS → Database (physical storage)
  Java App → MySQL Server → .ibd files on disk

**Types of DBMS:**
- **Relational DBMS (RDBMS):** data in tables, SQL, ACID — MySQL, PostgreSQL, Oracle
- **NoSQL:** document (MongoDB), key-value (Redis), column (Cassandra), graph (Neo4j)
- **NewSQL:** ACID + scalability — CockroachDB, Google Spanner

**Why DBMS over flat files?**
Without a DBMS: concurrency issues, no transaction support, no indexing, no security, no recovery from crashes, inefficient querying of large data.`,
  code: `-- ===== Data vs Database vs DBMS Concepts =====

-- DATA: raw facts (no software needed to represent this)
-- "Alice", 25, "alice@example.com", "2024-01-15"
-- "Bob", 30, "bob@example.com", "2024-02-20"

-- DATABASE: organized structure to hold this data
-- Think of it as a container:
CREATE DATABASE my_app_db;
USE my_app_db;

-- DATABASE = the container + the organized data inside it
-- It exists as files on disk: /var/lib/mysql/my_app_db/

-- TABLE: organized data within the database
CREATE TABLE users (
    id          INT PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(100) NOT NULL,
    age         INT,
    email       VARCHAR(255) UNIQUE NOT NULL,
    created_at  DATE
);

-- Now INSERT the raw data INTO the database structure:
INSERT INTO users (name, age, email, created_at) VALUES
    ('Alice', 25, 'alice@example.com', '2024-01-15'),
    ('Bob', 30, 'bob@example.com', '2024-02-20');

-- DBMS at work: the MySQL/PostgreSQL engine manages:
-- 1. How data is stored on disk (B-tree, heap files)
-- 2. How to find data fast (indexes)
-- 3. Concurrent access (locking, MVCC)
-- 4. Transactions (ACID guarantees)
-- 5. Security (users, roles, GRANT/REVOKE)
-- 6. Recovery (WAL logs, binlog)

-- Querying data — the DBMS translates this to disk operations:
SELECT name, email FROM users WHERE age > 20;

-- DBMS functions demonstrated:
-- Transaction management:
START TRANSACTION;
INSERT INTO users (name, age, email, created_at) VALUES ('Carol', 28, 'c@c.com', NOW());
ROLLBACK;  -- DBMS ensures this insert is completely undone

-- Security: only the DBMS enforces this, not the raw data files
-- GRANT SELECT ON users TO 'readonly_user'@'localhost';`,
  codeTitle: 'Data vs Database vs DBMS',
  points: [
    'Data is raw facts: numbers, strings, dates. A database organizes data into structured, queryable collections',
    'A DBMS is the software that creates, manages, queries, and controls a database — MySQL, PostgreSQL, SQLite',
    'Without a DBMS: no indexing (slow queries), no concurrency control, no transactions, no security, no recovery',
    'RDBMS (Relational DBMS) stores data in tables with rows and columns, enforces relationships, uses SQL',
    'The database is the physical data (files on disk); the DBMS is the engine that operates on those files',
    'Three-tier: Java Application → DBMS (MySQL Server) → Database (binary files on disk)',
    'ACID (Atomicity, Consistency, Isolation, Durability) is the core guarantee of RDBMS — the DBMS enforces it',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'When people say "MySQL database," they often mean the MySQL DBMS managing a named database. Technically: MySQL is the DBMS, "my_app_db" is the database, and the data inside tables is the actual data. The distinction matters when designing systems.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between a database and a DBMS?\nA: A database is the organized collection of data — the actual stored information. A DBMS (Database Management System) is the software that manages that database — it handles storage, querying, security, transactions, and recovery. MySQL is a DBMS; the database is what MySQL creates and manages.',
    },
    {
      type: 'tip',
      content: 'When choosing between a DBMS (MySQL vs PostgreSQL vs SQLite): SQLite for embedded/local apps (no separate server), MySQL for web apps (wide hosting support), PostgreSQL for complex queries and strong SQL standards compliance, Oracle/SQL Server for enterprise scenarios.',
    },
  ],
}
