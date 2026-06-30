export default {
  id: 'primary-key-constraint',
  title: '202. Primary Key Constraint',
  explanation: `A PRIMARY KEY uniquely identifies each row in a table. It is the most important constraint in relational database design — without it, you cannot reliably reference a row from another table or update/delete a specific record.

**Rules of a Primary Key:**
- Must be UNIQUE — no two rows can share the same primary key value
- Must be NOT NULL — a primary key cannot be missing or unknown
- A table can have only ONE primary key (though it can span multiple columns — composite key)

**Surrogate vs. Natural Key:**
- **Surrogate key**: an artificial ID (usually AUTO_INCREMENT INT) that has no business meaning — just identifies the row
- **Natural key**: a real-world attribute like an email address, SSN, or ISBN — has inherent meaning

Surrogate keys are almost always preferred: they never change, have no business logic, and are always compact integers.

**Defining a Primary Key:**
\`\`\`sql
-- Inline
id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY

-- Separate constraint (lets you name it)
CONSTRAINT pk_users PRIMARY KEY (id)

-- Composite key (spans 2 columns)
PRIMARY KEY (order_id, product_id)
\`\`\`

**Adding/Dropping later:**
\`\`\`sql
ALTER TABLE orders ADD PRIMARY KEY (id);
ALTER TABLE orders DROP PRIMARY KEY;
\`\`\`

Under InnoDB (MySQL default), the primary key is the clustered index — data rows are physically stored in primary key order. This means primary key choice directly affects storage layout and read performance.`,
  code: `-- ===== Primary Key Constraint =====

-- 1. Surrogate key (recommended — simple, stable, no business logic)
CREATE TABLE users (
    id       INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email    VARCHAR(100) NOT NULL UNIQUE
);

-- 2. Natural key (only if the value is truly immutable and always present)
CREATE TABLE countries (
    iso_code CHAR(2)      PRIMARY KEY,   -- 'US', 'IN', 'GB' — will never change
    name     VARCHAR(100) NOT NULL
);

-- 3. Composite primary key (order_items needs both columns to identify a row)
CREATE TABLE order_items (
    order_id   INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    quantity   INT          NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (order_id, product_id)   -- combination must be unique
);

-- 4. Named constraint (easier to reference in ALTER statements later)
CREATE TABLE sessions (
    token     CHAR(64) NOT NULL,
    user_id   INT UNSIGNED NOT NULL,
    expires   DATETIME NOT NULL,
    CONSTRAINT pk_sessions PRIMARY KEY (token)
);

-- 5. What happens if you violate the primary key?
INSERT INTO users (username, email) VALUES ('alice', 'alice@example.com');
INSERT INTO users (id, username, email) VALUES (1, 'bob', 'bob@example.com');
-- ERROR 1062 (23000): Duplicate entry '1' for key 'PRIMARY'

-- 6. Auto-assigned IDs
INSERT INTO users (username, email) VALUES
    ('alice', 'alice@example.com'),
    ('bob',   'bob@example.com'),
    ('carol', 'carol@example.com');
SELECT * FROM users;
-- id: 1, 2, 3  (assigned automatically)

-- 7. See primary key info
SHOW INDEX FROM users WHERE Key_name = 'PRIMARY';

-- 8. Add PK after creation (table must have no data, or data must already be unique+non-null)
ALTER TABLE users DROP PRIMARY KEY;
ALTER TABLE users ADD PRIMARY KEY (id);`,
  codeTitle: 'Defining and Using Primary Keys in MySQL',
  points: [
    'Every table should have a PRIMARY KEY — InnoDB creates a hidden one if you don\'t, which you can\'t reference',
    'A primary key is automatically NOT NULL and UNIQUE — MySQL enforces this even if you don\'t write it',
    'AUTO_INCREMENT INT UNSIGNED PRIMARY KEY is the standard surrogate key pattern in MySQL',
    'Composite keys (multi-column) are used in junction tables where no single column uniquely identifies a row',
    'In InnoDB, the primary key IS the clustered index — rows are stored in primary key order on disk',
    'A natural key is only appropriate if the value is permanent, always present, and never updated',
    'You cannot have more than one PRIMARY KEY per table, but a key can span multiple columns',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'If you define a table without a PRIMARY KEY in InnoDB, MySQL creates a hidden 6-byte row ID internally. This wastes space and makes it impossible to reference individual rows via a stable key from other tables. Always define a primary key explicitly.',
    },
    {
      type: 'tip',
      content: 'Prefer INT UNSIGNED over INT for surrogate keys — it doubles the positive range (0 to 4.2 billion) at no storage cost. If you genuinely need more than 4.2 billion rows, use BIGINT UNSIGNED (up to 18.4 quintillion).',
    },
    {
      type: 'interview',
      content: 'Q: What is the difference between a PRIMARY KEY and a UNIQUE constraint?\nA: Both enforce uniqueness, but a table can have only one PRIMARY KEY while it can have many UNIQUE constraints. A primary key also implicitly requires NOT NULL; a UNIQUE column can contain multiple NULL values (NULLs are not considered equal in SQL, so they do not violate UNIQUE). The primary key is also the clustered index in InnoDB.',
    },
  ],
}
