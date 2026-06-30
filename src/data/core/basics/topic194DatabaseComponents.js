export default {
  id: 'database-components',
  title: '194. Database Components',
  explanation: `A relational database is composed of several building blocks. Understanding each component is essential for designing and querying databases effectively.

**Core Components:**

**1. Tables (Relations):**
The fundamental storage unit. A table has a name, columns (schema), and rows (data).
  CREATE TABLE employees (...)

**2. Columns (Fields/Attributes):**
Each column has a name, data type, and constraints. Columns define what kind of data the table holds.

**3. Rows (Records/Tuples):**
Each row is one instance of the entity. A table with 1,000 rows has 1,000 employee records.

**4. Primary Key (PK):**
A column (or combination) that uniquely identifies each row. Cannot be NULL. Usually auto-incremented.

**5. Foreign Key (FK):**
A column that references the primary key of another table, establishing a relationship.

**6. Indexes:**
Data structures that speed up queries. A B-tree index on email allows O(log n) lookup instead of O(n) full table scan.

**7. Views:**
Virtual tables defined by a SELECT query. The data is not stored — it is computed on demand.
  CREATE VIEW active_users AS SELECT * FROM users WHERE is_active = 1;

**8. Stored Procedures:**
Pre-compiled SQL code stored in the database and executed by name.

**9. Triggers:**
Automatic actions that execute when data is modified (INSERT, UPDATE, DELETE).

**10. Constraints:**
Rules enforced by the DBMS:
  - NOT NULL: column must have a value
  - UNIQUE: no duplicate values in column
  - PRIMARY KEY: unique + not null
  - FOREIGN KEY: references another table
  - CHECK: value must satisfy a condition
  - DEFAULT: value if none provided`,
  code: `-- ===== Database Components =====

-- 1. TABLE
CREATE TABLE departments (
    dept_id   INT PRIMARY KEY AUTO_INCREMENT,
    dept_name VARCHAR(100) NOT NULL UNIQUE
);

-- 2. TABLE with all common components
CREATE TABLE employees (
    -- Columns with data types and constraints:
    emp_id      INT PRIMARY KEY AUTO_INCREMENT,   -- PRIMARY KEY
    first_name  VARCHAR(50) NOT NULL,              -- NOT NULL constraint
    last_name   VARCHAR(50) NOT NULL,
    email       VARCHAR(255) UNIQUE NOT NULL,      -- UNIQUE constraint
    salary      DECIMAL(10,2) DEFAULT 0.00,        -- DEFAULT constraint
    hire_date   DATE NOT NULL,
    dept_id     INT,                               -- FK column
    is_active   BOOLEAN DEFAULT TRUE,

    -- FOREIGN KEY constraint
    CONSTRAINT fk_dept FOREIGN KEY (dept_id)
        REFERENCES departments(dept_id)
        ON DELETE SET NULL                         -- behavior on parent delete

    -- CHECK constraint (MySQL 8.0+):
    -- CONSTRAINT chk_salary CHECK (salary >= 0)
);

-- 3. INDEX — speeds up queries on commonly searched columns
CREATE INDEX idx_last_name ON employees(last_name);
CREATE INDEX idx_dept_hire ON employees(dept_id, hire_date); -- composite index

-- 4. VIEW — virtual table
CREATE VIEW active_employees AS
    SELECT emp_id, first_name, last_name, email, dept_id
    FROM employees
    WHERE is_active = TRUE;

-- Querying a view (same as querying a table):
SELECT * FROM active_employees WHERE dept_id = 2;

-- 5. Insert sample data
INSERT INTO departments (dept_name) VALUES ('Engineering'), ('HR'), ('Finance');

INSERT INTO employees (first_name, last_name, email, salary, hire_date, dept_id)
VALUES
    ('Alice', 'Smith',  'alice@co.com', 85000.00, '2022-01-10', 1),
    ('Bob',   'Jones',  'bob@co.com',   72000.00, '2021-06-15', 2),
    ('Carol', 'White',  'carol@co.com', 95000.00, '2020-03-20', 1);

-- 6. Verify constraints in action
-- This will FAIL — dept_id 99 does not exist in departments:
-- INSERT INTO employees (first_name, last_name, email, hire_date, dept_id)
-- VALUES ('Dave', 'Black', 'd@co.com', NOW(), 99);
-- ERROR 1452: Cannot add or update a child row: a foreign key constraint fails`,
  codeTitle: 'Database Components — Tables, Keys, Indexes, Views',
  points: [
    'A table stores data as rows (records) and columns (fields) — the fundamental unit of an RDBMS',
    'Primary Key (PK): uniquely identifies each row, must be NOT NULL — usually an auto-incremented integer',
    'Foreign Key (FK): references a PK in another table — enforces referential integrity between tables',
    'Index: a data structure (B-tree) that speeds up row lookups — create indexes on frequently queried columns',
    'View: a stored SELECT query — behaves like a table but stores no data, computed on each access',
    'Constraints (NOT NULL, UNIQUE, CHECK, DEFAULT) are enforced by the DBMS, not the application',
    'Composite index: index on multiple columns — useful for queries that filter on multiple columns together',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'Adding too many indexes slows down INSERT/UPDATE/DELETE — every write must update all indexes. Index the columns you actually query in WHERE, JOIN, and ORDER BY clauses. Do not index every column "just in case" — use EXPLAIN to identify which queries need indexes.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between a PRIMARY KEY and a UNIQUE constraint?\nA: Both enforce uniqueness. PRIMARY KEY also disallows NULL and can only appear once per table. A table can have multiple UNIQUE columns. PK is the main identifier of a row; UNIQUE protects other columns (like email) from duplicates.',
    },
    {
      type: 'tip',
      content: 'Use views to simplify complex queries that your application uses repeatedly. Instead of joining 4 tables in every query, create a view with the join and query the view. This also adds a layer of abstraction — you can change the underlying tables without changing application code (as long as the view columns stay the same).',
    },
  ],
}
