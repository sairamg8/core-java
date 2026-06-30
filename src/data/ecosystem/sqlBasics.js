export default {
  id: 'sql-basics',
  title: '1. SQL Fundamentals — DDL & Basic Queries',
  explanation: `**SQL (Structured Query Language)** is the language for relational databases (MySQL, PostgreSQL, Oracle, SQLite). SQL is divided into sub-languages:

| Sub-language | Commands | Purpose |
|---|---|---|
| **DDL** (Data Definition) | CREATE, ALTER, DROP, TRUNCATE | Define schema |
| **DML** (Data Manipulation) | INSERT, UPDATE, DELETE, SELECT | Manipulate data |
| **DCL** (Data Control) | GRANT, REVOKE | Manage permissions |
| **TCL** (Transaction Control) | COMMIT, ROLLBACK, SAVEPOINT | Manage transactions |

**Data types (MySQL):**
- Numeric: INT, BIGINT, DECIMAL(p,s), FLOAT, DOUBLE
- String: VARCHAR(n), CHAR(n), TEXT
- Date/Time: DATE, TIME, DATETIME, TIMESTAMP
- Boolean: TINYINT(1) or BOOLEAN`,
  code: `-- === DDL — Create tables ===
CREATE DATABASE company;
USE company;

CREATE TABLE employees (
    id          INT PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) UNIQUE,
    department  VARCHAR(50),
    salary      DECIMAL(10, 2) DEFAULT 0.00,
    hired_date  DATE,
    manager_id  INT,
    FOREIGN KEY (manager_id) REFERENCES employees(id)
);

-- Add a column
ALTER TABLE employees ADD COLUMN phone VARCHAR(20);

-- Drop a table (irreversible!)
DROP TABLE IF EXISTS temp_table;

-- === DML — Insert data ===
INSERT INTO employees (name, email, department, salary, hired_date)
VALUES ('Alice', 'alice@co.com', 'Engineering', 95000, '2022-03-15');

INSERT INTO employees (name, email, department, salary, hired_date) VALUES
('Bob',   'bob@co.com',   'Marketing',   72000, '2021-06-01'),
('Carol', 'carol@co.com', 'Engineering', 105000, '2020-01-10');

-- === SELECT — Basic Queries ===
SELECT * FROM employees;                          -- all columns
SELECT name, salary FROM employees;               -- specific columns
SELECT name, salary * 1.1 AS new_salary          -- calculated column
FROM employees;

-- WHERE — filter rows
SELECT * FROM employees WHERE department = 'Engineering';
SELECT * FROM employees WHERE salary > 80000 AND department = 'Engineering';
SELECT * FROM employees WHERE department IN ('Engineering', 'Marketing');
SELECT * FROM employees WHERE name LIKE 'A%';     -- starts with A
SELECT * FROM employees WHERE manager_id IS NULL; -- no manager

-- ORDER BY
SELECT * FROM employees ORDER BY salary DESC;
SELECT * FROM employees ORDER BY department ASC, salary DESC;

-- LIMIT & OFFSET (pagination)
SELECT * FROM employees ORDER BY salary DESC LIMIT 10;
SELECT * FROM employees ORDER BY salary DESC LIMIT 10 OFFSET 20; -- page 3`,
  points: [
    'PRIMARY KEY = NOT NULL + UNIQUE combined; AUTO_INCREMENT generates the next integer automatically',
    'VARCHAR(n) stores up to n characters; CHAR(n) always pads to exactly n characters (less efficient for variable-length)',
    'LIKE patterns: % matches any sequence of characters, _ matches exactly one character',
    'IS NULL and IS NOT NULL are the correct syntax — = NULL always returns false in SQL',
    'ORDER BY with LIMIT is required for meaningful pagination — without ORDER BY the row order is undefined',
  ],
  callouts: [
    {
      type: 'interview',
      content: 'Q: What is the difference between DELETE, TRUNCATE, and DROP?\nA: DELETE removes specific rows (can be rolled back, fires triggers, slow on large tables). TRUNCATE removes ALL rows by resetting the table (faster, resets AUTO_INCREMENT, cannot be rolled back in most databases). DROP removes the entire table and its definition — there is nothing left.',
    },
    {
      type: 'gotcha',
      content: 'Running UPDATE or DELETE without a WHERE clause modifies EVERY row in the table. Always write the WHERE clause first, test it with a SELECT to confirm the right rows are targeted, then change SELECT to UPDATE/DELETE.',
    },
  ],
}
