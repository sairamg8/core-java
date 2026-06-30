export default {
  id: 'sql-constraints',
  title: '203. SQL Constraints',
  explanation: `Constraints are rules enforced by the database engine on column values. They prevent bad data from entering the database — catching errors at the storage layer rather than relying on application code.

**The 6 core SQL constraints:**

**1. NOT NULL**
Ensures a column always has a value. Without it, the column accepts NULL (unknown/missing).
\`\`\`sql
name VARCHAR(100) NOT NULL
\`\`\`

**2. UNIQUE**
No two rows may share the same value. NULLs do not count as duplicates — a UNIQUE column can have many NULLs.
\`\`\`sql
email VARCHAR(100) UNIQUE
\`\`\`

**3. PRIMARY KEY**
The unique row identifier. Combines NOT NULL + UNIQUE. One per table.

**4. FOREIGN KEY**
Links a column to the primary key of another table, enforcing referential integrity — you cannot reference a row that doesn't exist.
\`\`\`sql
FOREIGN KEY (user_id) REFERENCES users(id)
\`\`\`

**5. CHECK** (MySQL 8.0+)
Validates column values against a condition. Rows that fail the check are rejected.
\`\`\`sql
CHECK (age >= 0 AND age <= 150)
CHECK (status IN ('active', 'inactive'))
\`\`\`

**6. DEFAULT**
Provides a fallback value when none is supplied on INSERT.
\`\`\`sql
is_active BOOLEAN DEFAULT TRUE
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
\`\`\`

Constraints can be added inline (on the column) or as named table-level declarations. Named constraints are easier to drop or reference in error messages.`,
  code: `-- ===== SQL Constraints =====

-- All 6 constraints in one table
CREATE TABLE employees (
    id          INT UNSIGNED AUTO_INCREMENT,
    name        VARCHAR(100) NOT NULL,                       -- NOT NULL
    email       VARCHAR(100) NOT NULL UNIQUE,                -- UNIQUE
    department  VARCHAR(50)  NOT NULL DEFAULT 'General',     -- DEFAULT
    salary      DECIMAL(10,2) NOT NULL,
    age         TINYINT UNSIGNED,
    status      ENUM('active','inactive','on_leave') DEFAULT 'active',

    -- Table-level constraints (named — easy to drop/reference later)
    CONSTRAINT pk_employees  PRIMARY KEY (id),               -- PRIMARY KEY
    CONSTRAINT chk_salary    CHECK (salary > 0),             -- CHECK
    CONSTRAINT chk_age       CHECK (age IS NULL OR age BETWEEN 18 AND 70)
);

-- Foreign key in a separate table
CREATE TABLE projects (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,
    lead_id     INT UNSIGNED NOT NULL,
    CONSTRAINT fk_project_lead
        FOREIGN KEY (lead_id) REFERENCES employees(id)
        ON DELETE RESTRICT    -- prevent deleting an employee who leads a project
        ON UPDATE CASCADE     -- if employee id changes, update here too
);

-- 1. NOT NULL violation
INSERT INTO employees (name, email, salary) VALUES (NULL, 'x@x.com', 5000);
-- ERROR: Column 'name' cannot be null

-- 2. UNIQUE violation
INSERT INTO employees (name, email, salary) VALUES ('Alice', 'same@email.com', 5000);
INSERT INTO employees (name, email, salary) VALUES ('Bob',   'same@email.com', 6000);
-- ERROR: Duplicate entry 'same@email.com' for key 'email'

-- 3. CHECK violation
INSERT INTO employees (name, email, salary) VALUES ('Carol', 'c@x.com', -500);
-- ERROR: Check constraint 'chk_salary' is violated

-- 4. DEFAULT in action
INSERT INTO employees (name, email, salary) VALUES ('Dave', 'd@x.com', 75000);
SELECT department, status FROM employees WHERE name = 'Dave';
-- department: 'General', status: 'active'  (both from DEFAULT)

-- 5. FOREIGN KEY violation
INSERT INTO projects (title, lead_id) VALUES ('Apollo', 9999);
-- ERROR: foreign key constraint fails — employee 9999 does not exist

-- 6. Drop a named constraint
ALTER TABLE employees DROP CHECK chk_age;
ALTER TABLE employees DROP FOREIGN KEY fk_project_lead;

-- 7. Add a constraint after table creation
ALTER TABLE employees ADD CONSTRAINT chk_age CHECK (age BETWEEN 18 AND 70);`,
  codeTitle: 'All 6 SQL Constraints in MySQL',
  points: [
    'NOT NULL ensures a column always contains a value — without it, NULL (unknown) is allowed',
    'UNIQUE prevents duplicate values but allows multiple NULLs (NULLs are not considered equal)',
    'PRIMARY KEY = NOT NULL + UNIQUE + clustered index; only one per table',
    'FOREIGN KEY enforces referential integrity — the referenced row must exist in the parent table',
    'CHECK (MySQL 8.0+) validates column values; inserts/updates that fail the condition are rejected',
    'DEFAULT provides a fallback value when a column is omitted from an INSERT statement',
    'Named constraints (CONSTRAINT name ...) are easier to reference in ALTER TABLE and in error messages',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'MySQL silently ignored CHECK constraints before version 8.0.16 — they were parsed but not enforced. If your team uses MySQL 5.x, CHECK constraints give false security. In that case, enforce validation in application code or use triggers.',
    },
    {
      type: 'tip',
      content: 'Always name your foreign key constraints. Without a name, MySQL auto-generates one like "employees_ibfk_1" which is hard to reference in ALTER TABLE or interpret in error messages. CONSTRAINT fk_project_lead FOREIGN KEY ... is self-documenting.',
    },
    {
      type: 'interview',
      content: 'Q: What happens when you try to delete a parent row that has child rows referencing it via a FOREIGN KEY?\nA: By default (ON DELETE RESTRICT), the delete is rejected with a foreign key constraint error. You can change this behavior: ON DELETE CASCADE deletes the child rows too; ON DELETE SET NULL sets the FK column to NULL; ON DELETE NO ACTION is like RESTRICT but checked at the end of the transaction.',
    },
  ],
}
