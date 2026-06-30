export default {
  id: 'creating-tables-in-the-database',
  title: '199. Creating Tables in the Database',
  explanation: `Tables are the core structure in a relational database — every piece of data lives in a table. You define a table's structure with CREATE TABLE, specifying columns, types, and constraints.

**Basic Syntax:**
\`\`\`sql
CREATE TABLE table_name (
    column1  DATATYPE  CONSTRAINTS,
    column2  DATATYPE  CONSTRAINTS,
    ...
);
\`\`\`

**Common Column Constraints:**
- \`NOT NULL\` — column must have a value; never null
- \`DEFAULT value\` — value used when not specified on INSERT
- \`UNIQUE\` — no two rows can have the same value in this column
- \`PRIMARY KEY\` — uniquely identifies each row; implies NOT NULL + UNIQUE
- \`AUTO_INCREMENT\` — integer increments automatically on INSERT
- \`CHECK (condition)\` — validates values against a condition (MySQL 8.0+)

**Primary Keys:**
Every table should have a primary key. The most common pattern is a surrogate key:
\`\`\`sql
id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY
\`\`\`

**Viewing and Modifying Tables:**
\`\`\`sql
SHOW TABLES;                         -- list all tables in current database
DESCRIBE table_name;                 -- show column structure
SHOW CREATE TABLE table_name;        -- show the full CREATE TABLE statement

ALTER TABLE table_name ADD COLUMN email VARCHAR(100);
ALTER TABLE table_name DROP COLUMN email;
ALTER TABLE table_name MODIFY COLUMN name VARCHAR(200) NOT NULL;

DROP TABLE table_name;               -- delete table and all its data
DROP TABLE IF EXISTS table_name;     -- safe version
TRUNCATE TABLE table_name;           -- delete all rows but keep structure
\`\`\`

**Naming conventions:**
- Use lowercase with underscores: \`user_orders\`, not \`UserOrders\`
- Table names are typically plural: \`users\`, \`products\`, \`orders\`
- Column names are singular: \`user_id\`, \`email\`, \`created_at\``,
  code: `-- ===== Creating Tables in MySQL =====

-- 1. Simple table
CREATE TABLE users (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username   VARCHAR(50)  NOT NULL UNIQUE,
    email      VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table with more constraints and a CHECK
CREATE TABLE products (
    id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(100)   NOT NULL,
    price        DECIMAL(10, 2) NOT NULL,
    stock_qty    INT            NOT NULL DEFAULT 0,
    category     VARCHAR(50),
    is_active    BOOLEAN        DEFAULT TRUE,
    created_at   TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_price   CHECK (price >= 0),
    CONSTRAINT chk_stock   CHECK (stock_qty >= 0),
    CONSTRAINT uq_name     UNIQUE (name)
);

-- 3. IF NOT EXISTS (safe creation, no error if table already exists)
CREATE TABLE IF NOT EXISTS products ( ... );

-- 4. View all tables in the active database
SHOW TABLES;

-- 5. Describe column structure
DESCRIBE users;
-- Output:
-- +-----------+--------------+------+-----+-------------------+...
-- | Field     | Type         | Null | Key | Default           |...
-- +-----------+--------------+------+-----+-------------------+...
-- | id        | int unsigned | NO   | PRI | NULL              |...
-- | username  | varchar(50)  | NO   | UNI | NULL              |...
-- | email     | varchar(100) | NO   | UNI | NULL              |...
-- | created_at| timestamp    | YES  |     | CURRENT_TIMESTAMP |...

-- 6. Show the full CREATE statement (useful for backups/migration)
SHOW CREATE TABLE users;

-- 7. Modify an existing table
ALTER TABLE users ADD COLUMN full_name VARCHAR(150);
ALTER TABLE users MODIFY COLUMN full_name VARCHAR(200) NOT NULL;
ALTER TABLE users DROP COLUMN full_name;

-- 8. Rename a table
RENAME TABLE users TO app_users;

-- 9. Drop the table (permanent)
DROP TABLE products;
DROP TABLE IF EXISTS products;

-- 10. Remove all rows but keep structure
TRUNCATE TABLE products;`,
  codeTitle: 'Creating and Managing MySQL Tables',
  points: [
    'CREATE TABLE defines columns with their data types and constraints — always include a PRIMARY KEY',
    'AUTO_INCREMENT on an INT PRIMARY KEY is the standard pattern for surrogate keys in MySQL',
    'NOT NULL prevents nulls; DEFAULT provides a fallback value; UNIQUE blocks duplicates in a column',
    'DESCRIBE table_name shows column structure: name, type, nullable, key type, and default value',
    'ALTER TABLE lets you add, modify, or drop columns on an existing table without recreating it',
    'DROP TABLE permanently deletes the table and all its data; TRUNCATE deletes rows but keeps the structure',
    'Use IF NOT EXISTS in CREATE and IF EXISTS in DROP to write idempotent scripts that can be safely re-run',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'TRUNCATE TABLE is faster than DELETE FROM table because it does not log individual row deletions, but it cannot be rolled back in most storage engines and does not fire DELETE triggers. Use DELETE FROM if you need transactions or triggers.',
    },
    {
      type: 'tip',
      content: 'Always define a primary key — even if you don\'t think you need one now. Without a primary key, InnoDB (MySQL\'s default engine) creates a hidden one internally, which you cannot use in JOINs or application queries. Make it explicit.',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between DROP TABLE and TRUNCATE TABLE?\nA: DROP TABLE removes the table definition and all its data permanently — the table no longer exists. TRUNCATE TABLE removes all rows but keeps the table structure intact and resets AUTO_INCREMENT counters. TRUNCATE is faster than DELETE for clearing large tables.',
    },
  ],
}
