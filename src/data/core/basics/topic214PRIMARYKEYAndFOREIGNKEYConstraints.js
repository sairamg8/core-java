export default {
  id: 'primary-key-and-foreign-key-constraints',
  title: '214. PRIMARY KEY and FOREIGN KEY Constraints',
  explanation: `PRIMARY KEY and FOREIGN KEY together are the foundation of relational database design. They link tables together and enforce referential integrity.

**PRIMARY KEY** (recap):
- Uniquely identifies each row in a table
- NOT NULL + UNIQUE, one per table
- In InnoDB, it is the clustered index — rows are physically stored in PK order

**FOREIGN KEY:**
A foreign key is a column in one table that references the PRIMARY KEY (or UNIQUE key) of another table. It enforces that referenced rows must exist.

\`\`\`sql
CREATE TABLE orders (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_id INT UNSIGNED NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);
\`\`\`
You cannot insert an order for a customer that doesn't exist. And you cannot delete a customer who has orders — unless you configure a cascade action.

**Referential actions (ON DELETE / ON UPDATE):**
| Action | Behavior |
|--------|----------|
| RESTRICT (default) | Block parent delete/update if child rows exist |
| CASCADE | Delete/update child rows automatically |
| SET NULL | Set FK column to NULL in child rows |
| SET DEFAULT | Set FK to default value (rarely used) |
| NO ACTION | Like RESTRICT, checked at end of transaction |

**Many-to-many via junction table:**
\`\`\`sql
CREATE TABLE student_courses (
    student_id INT UNSIGNED NOT NULL,
    course_id  INT UNSIGNED NOT NULL,
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id)  REFERENCES courses(id)  ON DELETE CASCADE
);
\`\`\`

**Checking FK constraints:**
\`\`\`sql
SET FOREIGN_KEY_CHECKS = 0;  -- disable (bulk loads, migrations)
SET FOREIGN_KEY_CHECKS = 1;  -- re-enable
\`\`\``,
  code: `-- ===== PRIMARY KEY and FOREIGN KEY Constraints =====

-- Parent table — customers
CREATE TABLE IF NOT EXISTS customers (
    id       INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name     VARCHAR(100) NOT NULL,
    email    VARCHAR(100) NOT NULL UNIQUE
);

-- Child table — orders (FK references customers)
CREATE TABLE IF NOT EXISTS orders (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    customer_id INT UNSIGNED NOT NULL,
    total       DECIMAL(10,2) NOT NULL,
    status      VARCHAR(20) DEFAULT 'pending',
    CONSTRAINT fk_orders_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(id)
        ON DELETE RESTRICT    -- block delete of customer with orders
        ON UPDATE CASCADE     -- if customer.id changes, update here too
);

-- Insert parent rows first
INSERT INTO customers (name, email) VALUES
    ('Alice', 'alice@example.com'),
    ('Bob',   'bob@example.com');

-- Insert child rows (must reference valid customer_id)
INSERT INTO orders (customer_id, total) VALUES (1, 250.00);  -- Alice
INSERT INTO orders (customer_id, total) VALUES (2, 89.99);   -- Bob

-- FK VIOLATION: referencing non-existent customer
INSERT INTO orders (customer_id, total) VALUES (99, 50.00);
-- ERROR 1452: Cannot add or update a child row: foreign key constraint fails

-- FK VIOLATION: deleting parent with child rows (RESTRICT)
DELETE FROM customers WHERE id = 1;
-- ERROR 1451: Cannot delete a parent row: foreign key constraint fails

-- CASCADE example
CREATE TABLE IF NOT EXISTS order_items (
    id       INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id INT UNSIGNED NOT NULL,
    product  VARCHAR(100),
    qty      INT,
    CONSTRAINT fk_items_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE   -- delete items when order is deleted
);
INSERT INTO order_items (order_id, product, qty) VALUES (1, 'Java Bible', 2);
DELETE FROM orders WHERE id = 1;  -- also deletes order_items rows with order_id=1

-- Many-to-many junction table
CREATE TABLE IF NOT EXISTS tags (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, label VARCHAR(50));
CREATE TABLE IF NOT EXISTS order_tags (
    order_id INT UNSIGNED NOT NULL,
    tag_id   INT UNSIGNED NOT NULL,
    PRIMARY KEY (order_id, tag_id),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id)   REFERENCES tags(id)   ON DELETE CASCADE
);

-- Inspect FK relationships
SELECT
    CONSTRAINT_NAME, TABLE_NAME, COLUMN_NAME,
    REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = DATABASE() AND REFERENCED_TABLE_NAME IS NOT NULL;`,
  codeTitle: 'PRIMARY KEY and FOREIGN KEY — Referential Integrity',
  points: [
    'FOREIGN KEY links a column in one table to the PRIMARY KEY of another — enforcing referential integrity',
    'You cannot insert a child row referencing a parent that does not exist',
    'ON DELETE RESTRICT (default) blocks deleting a parent with existing child rows',
    'ON DELETE CASCADE auto-deletes child rows when the parent is deleted',
    'ON DELETE SET NULL sets the FK column to NULL when the parent is deleted — requires the column to be nullable',
    'Many-to-many relationships use a junction (bridge) table with composite PK and two FKs',
    'SET FOREIGN_KEY_CHECKS = 0 disables FK enforcement — use only during migrations; always re-enable after',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: "For foreign keys to work in MySQL, both tables must use the InnoDB storage engine. MyISAM (older default) parses FK syntax without enforcing it — constraints are silently ignored. Always ensure tables are InnoDB: CREATE TABLE ... ENGINE=InnoDB; (InnoDB is the default since MySQL 5.5).",
    },
    {
      type: 'tip',
      content: "Always name your foreign key constraints: CONSTRAINT fk_orders_customer FOREIGN KEY ... A named constraint produces a readable error message and is easy to drop with ALTER TABLE orders DROP FOREIGN KEY fk_orders_customer. Auto-generated names like orders_ibfk_1 are opaque and hard to reference.",
    },
    {
      type: 'interview',
      content: "Q: What is the difference between ON DELETE RESTRICT and ON DELETE CASCADE?\nA: RESTRICT blocks the delete of a parent row if any child rows reference it — you must delete the children first. CASCADE automatically deletes all matching child rows when the parent is deleted. RESTRICT is safer for critical business data (prevents accidental mass deletes); CASCADE is convenient when child rows have no meaning without their parent (e.g., order items).",
    },
  ],
}
