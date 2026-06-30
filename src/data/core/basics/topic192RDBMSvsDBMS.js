export default {
  id: 'rdbms-vs-dbms',
  title: '192. RDBMS vs DBMS',
  explanation: `RDBMS is a specific type of DBMS that stores and manages data in a relational model — organized as tables with rows, columns, and defined relationships.

**DBMS (Database Management System):**
Generic term for any software that manages a database, regardless of the data model.
Examples include: flat-file systems, hierarchical databases, network databases, object databases, relational databases, NoSQL databases.

**RDBMS (Relational Database Management System):**
A DBMS that specifically implements E.F. Codd's relational model (1970):
- Data stored in tables (relations)
- Rows (tuples) and columns (attributes)
- Primary keys uniquely identify each row
- Foreign keys link tables together
- Normalization eliminates data redundancy
- SQL is the standard query language

**Key differences:**

| Feature | DBMS (general) | RDBMS |
|---------|---------------|-------|
| Data model | Any (hierarchical, network, document) | Relational (tables) |
| Relationships | Not enforced | Enforced via FK constraints |
| SQL support | Varies | Standard (SQL-92 and beyond) |
| ACID support | Partial or none | Full ACID |
| Normalization | Not required | 1NF, 2NF, 3NF enforced |
| Examples | MongoDB, Redis, LDAP, IMS | MySQL, PostgreSQL, Oracle |

**Relational model pillars (E.F. Codd's rules):**
1. Data stored in tables (relations)
2. Each row is uniquely identified (primary key)
3. Data is accessed by value, not by memory address
4. Relationships via shared columns (foreign keys)
5. Set-based operations (SQL processes sets of rows at once)

**RDBMS in Java:**
Java connects to RDBMS via:
  - JDBC (Java Database Connectivity) — low level, direct SQL
  - JPA/Hibernate — ORM that maps Java objects to tables
  - Spring Data JPA — abstracts JPA with repository pattern`,
  code: `-- ===== RDBMS vs DBMS Concepts in SQL =====

-- RDBMS: data organized as tables (relations)

-- TABLE 1: customers
CREATE TABLE customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,  -- primary key
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(255) UNIQUE NOT NULL
);

-- TABLE 2: orders (references customers — relationship)
CREATE TABLE orders (
    order_id    INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    amount      DECIMAL(10,2),
    order_date  DATE,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
    -- RDBMS enforces referential integrity!
    -- You cannot insert an order for a customer_id that does not exist.
);

-- Insert customers
INSERT INTO customers (name, email) VALUES
    ('Alice', 'alice@example.com'),
    ('Bob', 'bob@example.com');

-- Insert orders — RDBMS enforces the FK
INSERT INTO orders (customer_id, amount, order_date) VALUES
    (1, 99.99, '2024-01-15'),   -- references Alice (customer_id = 1)
    (1, 49.50, '2024-02-10'),   -- another order for Alice
    (2, 200.00, '2024-01-20');  -- references Bob (customer_id = 2)

-- RDBMS enforces referential integrity:
-- INSERT INTO orders (customer_id, amount) VALUES (999, 10.00);
-- ERROR: Cannot add or update a child row — a foreign key constraint fails

-- ACID transaction in RDBMS:
START TRANSACTION;
INSERT INTO orders (customer_id, amount, order_date) VALUES (1, 75.00, NOW());
UPDATE customers SET email = 'alice2@example.com' WHERE customer_id = 1;
COMMIT;  -- Both changes committed atomically

-- JOIN — the power of RDBMS relationships
SELECT
    c.name AS customer_name,
    o.order_id,
    o.amount,
    o.order_date
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
ORDER BY o.order_date;`,
  codeTitle: 'RDBMS — Relational Model and Constraints',
  points: [
    'RDBMS is a DBMS that uses the relational model: data in tables, rows with primary keys, relationships via foreign keys',
    'Foreign key constraints enforce referential integrity — you cannot reference a non-existent row',
    'ACID (Atomicity, Consistency, Isolation, Durability) is the core transaction guarantee of RDBMS',
    'SQL is the standard language for all RDBMS — SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER',
    'Normalization (1NF, 2NF, 3NF) eliminates data redundancy and ensures each piece of data has one home',
    'RDBMS supports JOINs — combining data from multiple tables using shared column values',
    'Java accesses RDBMS via JDBC (raw SQL), Hibernate/JPA (ORM), or Spring Data JPA (repositories)',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'NoSQL databases (MongoDB, Redis) are also DBMS — but they are NOT RDBMS. They do not enforce referential integrity, schemas, or ACID by default. Choosing between RDBMS and NoSQL depends on your data model, consistency requirements, and query patterns.',
    },
    {
      type: 'interview',
      content: 'Q: What makes an RDBMS different from a general DBMS?\nA: An RDBMS implements the relational model — data in tables, primary/foreign keys, enforced relationships, full ACID transactions, and SQL as the query language. A general DBMS can use any data model (documents, key-value, hierarchical). RDBMS is the standard for structured business data.',
    },
    {
      type: 'tip',
      content: 'The relational model matters most when data has natural relationships. An e-commerce database (customers → orders → products) is a perfect fit for RDBMS. A logging system that just writes millions of events with no relationships might be better served by a time-series DB or NoSQL.',
    },
  ],
}
