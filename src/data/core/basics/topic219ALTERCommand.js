export default {
  id: 'alter-command',
  title: '219. ALTER Command',
  explanation: `ALTER TABLE modifies an existing table's structure — adding, changing, or dropping columns, indexes, and constraints without recreating the table.

**Adding a column:**
\`\`\`sql
ALTER TABLE users ADD COLUMN phone VARCHAR(20);
ALTER TABLE users ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER email;
\`\`\`
AFTER column_name places the new column after a specific existing column.

**Modifying a column:**
\`\`\`sql
ALTER TABLE users MODIFY COLUMN phone VARCHAR(30) NOT NULL;
-- CHANGE renames AND modifies:
ALTER TABLE users CHANGE COLUMN phone mobile_number VARCHAR(30);
\`\`\`

**Dropping a column:**
\`\`\`sql
ALTER TABLE users DROP COLUMN phone;
\`\`\`

**Renaming a table:**
\`\`\`sql
ALTER TABLE users RENAME TO app_users;
-- Or: RENAME TABLE users TO app_users;
\`\`\`

**Adding / dropping indexes and constraints:**
\`\`\`sql
ALTER TABLE orders ADD INDEX idx_status (status);
ALTER TABLE orders DROP INDEX idx_status;
ALTER TABLE orders ADD CONSTRAINT fk_customer FOREIGN KEY (customer_id) REFERENCES customers(id);
ALTER TABLE orders DROP FOREIGN KEY fk_customer;
\`\`\`

**Changing the primary key:**
\`\`\`sql
ALTER TABLE orders DROP PRIMARY KEY, ADD PRIMARY KEY (new_id);
\`\`\`

**Performance note:**
On large production tables, many ALTER TABLE operations rebuild the entire table (copy all rows, then swap). This can lock the table for minutes or hours. Use tools like pt-online-schema-change or gh-ost for zero-downtime schema changes on large tables.`,
  code: `-- ===== ALTER TABLE Command =====

-- Starting table
CREATE TABLE IF NOT EXISTS employees (
    id     INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name   VARCHAR(100) NOT NULL,
    salary DECIMAL(10,2)
);

-- 1. Add a single column
ALTER TABLE employees ADD COLUMN department VARCHAR(50);

-- 2. Add column at a specific position
ALTER TABLE employees ADD COLUMN email VARCHAR(100) AFTER name;

-- 3. Add column at the beginning
ALTER TABLE employees ADD COLUMN emp_code CHAR(8) FIRST;

-- 4. Modify column type/constraints
ALTER TABLE employees MODIFY COLUMN salary DECIMAL(12,2) NOT NULL DEFAULT 0.00;

-- 5. Rename a column AND change its definition (CHANGE)
ALTER TABLE employees CHANGE COLUMN department dept_name VARCHAR(80);

-- 6. Drop a column
ALTER TABLE employees DROP COLUMN emp_code;

-- 7. Add a DEFAULT to an existing column
ALTER TABLE employees MODIFY COLUMN dept_name VARCHAR(80) DEFAULT 'General';

-- 8. Multiple changes in one ALTER (more efficient — one table rebuild)
ALTER TABLE employees
    ADD COLUMN is_active BOOLEAN DEFAULT TRUE,
    ADD COLUMN hire_date DATE,
    MODIFY COLUMN email VARCHAR(150) NOT NULL UNIQUE;

-- 9. Rename the table
ALTER TABLE employees RENAME TO staff;
-- Or: RENAME TABLE staff TO employees;  -- back

-- 10. Add an index
ALTER TABLE employees ADD INDEX idx_dept (department);
ALTER TABLE employees ADD UNIQUE INDEX uidx_email (email);

-- 11. Drop an index
ALTER TABLE employees DROP INDEX idx_dept;

-- 12. Change primary key (rare — be careful with foreign keys)
-- ALTER TABLE employees DROP PRIMARY KEY, ADD PRIMARY KEY (id, emp_code);

-- 13. View current table structure
DESCRIBE employees;
SHOW CREATE TABLE employees;

-- 14. Add a CHECK constraint
ALTER TABLE employees ADD CONSTRAINT chk_salary CHECK (salary >= 0);`,
  codeTitle: 'ALTER TABLE — Modifying Table Structure',
  points: [
    'ALTER TABLE modifies structure without losing data — adds, changes, drops columns, indexes, constraints',
    'ADD COLUMN appends at the end; AFTER col or FIRST controls placement',
    'MODIFY COLUMN changes type and constraints; CHANGE COLUMN also renames the column',
    'Multiple changes in one ALTER TABLE are more efficient — the table is rebuilt once instead of N times',
    'ALTER TABLE on large tables can lock the table for a long time — plan changes during maintenance windows',
    'Always test ALTER TABLE on a copy of production data first to estimate duration and confirm no data loss',
    'RENAME TABLE is an instant metadata-only operation — no row copying',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "ALTER TABLE ... ADD COLUMN ... NOT NULL without a DEFAULT fails if the table already has rows — MySQL can't fill the existing rows with a value. Either add a DEFAULT (ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'active') or run a backfill UPDATE before making it NOT NULL.",
    },
    {
      type: 'tip',
      content: "Batch multiple ALTER TABLE changes into one statement. ALTER TABLE t ADD COLUMN a INT, ADD COLUMN b VARCHAR(50), ADD INDEX idx_a (a) rebuilds the table once. Three separate ALTER TABLE statements rebuild it three times — 3x slower on large tables.",
    },
    {
      type: 'interview',
      content: "Q: Why can ALTER TABLE be risky on a production database?\nA: Most ALTER TABLE operations (adding a NOT NULL column, changing a column type, adding an index) require rebuilding the entire table — copying all rows to a new table with the new structure, then swapping. During this copy, the table may be locked for reads or writes. On a 100M-row table, this can take hours. Tools like pt-online-schema-change perform the change online without downtime.",
    },
  ],
}
