export default {
  id: 'an-overview-of-mysql-workbench-and-the-cli-client',
  title: '196. An Overview of MySQL Workbench and the CLI Client',
  explanation: `MySQL Workbench is the official GUI tool for MySQL. The CLI client (mysql) is the command-line alternative. Both give you full access to MySQL — choose based on the task.

**MySQL Workbench — GUI Tool:**

**Connection Panel:**
Saved connections to local and remote MySQL servers. Click to connect, enter password.

**SQL Editor:**
The main query area where you write and execute SQL:
- Ctrl+Enter (or lightning bolt) → Execute current statement
- Ctrl+Shift+Enter → Execute all statements
- Query results appear below with row count and execution time

**Schema Panel (Navigator):**
Left sidebar shows all databases and their tables, views, functions. Right-click to inspect or modify.

**Output Panel:**
Shows query output, error messages, and execution info.

**Export/Import:**
Server → Data Export / Data Import — creates SQL dump files (backups).

**EER Diagram:**
Visual entity-relationship diagram builder for designing schemas.

---

**MySQL CLI Client:**
Command-line access — available in any terminal after MySQL is installed:
  mysql -u root -p               — connect as root
  mysql -u root -p mydb          — connect and use mydb database
  mysql -h 192.168.1.100 -P 3306 -u user -p  — remote connection

**CLI shortcuts:**
  \\c    — cancel current input (clear)
  \\G    — display result vertically (instead of table)
  \\q or exit or quit — exit
  \\h    — help
  source /path/to/file.sql — run a SQL file

**When to use which:**
- Workbench: schema design, visual exploration, beginners, complex multi-query sessions
- CLI: quick queries, scripts, remote SSH connections, batch execution`,
  code: `-- ===== MySQL Workbench and CLI Overview =====

-- WORKBENCH TIPS:
-- 1. Ctrl+Enter: execute statement at cursor
-- 2. Ctrl+Space: auto-complete SQL keywords and table/column names
-- 3. Click column headers in results to sort
-- 4. Right-click result row → Copy Row (for quick data inspection)
-- 5. Format query: Edit → Format → Beautify Query

-- CLI CLIENT TIPS:
-- Connect:
-- mysql -u root -p
-- mysql -u appuser -p mydb

-- CLI special commands (no semicolons needed):
-- \\G   — vertical output (great for wide rows)
-- \\c   — cancel current incomplete statement
-- \\s   — status (version, uptime, charset)
-- \\!   — shell command: \\! ls
-- source backup.sql  — run a SQL file

-- 1. Show databases and current selection
SHOW DATABASES;
SELECT DATABASE();

-- 2. Switch databases
USE java_course;

-- 3. Create a test table to explore Workbench
CREATE TABLE products (
    product_id  INT PRIMARY KEY AUTO_INCREMENT,
    name        VARCHAR(100) NOT NULL,
    price       DECIMAL(8,2) NOT NULL,
    stock_qty   INT DEFAULT 0,
    category    VARCHAR(50)
);

INSERT INTO products (name, price, stock_qty, category) VALUES
    ('Java Bible',     29.99, 100, 'Books'),
    ('IntelliJ IDEA',  49.99,  50, 'Software'),
    ('Mechanical Keyboard', 89.99, 30, 'Hardware'),
    ('USB Hub',        19.99, 200, 'Hardware');

-- 4. In Workbench — right-click the products table in the Schema panel
-- → Select Rows (auto-generates SELECT * FROM products LIMIT 1000)
-- → Alter Table (visual column editor)
-- → Table Inspector (index info, row stats)

-- 5. Vertical output with \\G in CLI:
-- SELECT * FROM products LIMIT 1\\G
-- Output:
-- *************************** 1. row ***************************
--  product_id: 1
--        name: Java Bible
--       price: 29.99
--   stock_qty: 100
--    category: Books

-- 6. Run a SQL file from CLI:
-- source /home/user/setup.sql
-- OR:
-- mysql -u root -p mydb < setup.sql    (from OS terminal)

-- 7. Export via CLI (mysqldump):
-- mysqldump -u root -p mydb > backup.sql
-- mysqldump -u root -p --all-databases > full_backup.sql`,
  codeTitle: 'MySQL Workbench and CLI Client Usage',
  points: [
    'MySQL Workbench is the official GUI — SQL editor, schema browser, ERR diagram, export/import tools',
    'Ctrl+Enter executes the statement at the cursor in Workbench; Ctrl+Shift+Enter runs all statements',
    'The CLI client (mysql) connects with: mysql -u username -p (then type password at prompt)',
    '\\G in the CLI client prints results vertically — invaluable for rows with many columns',
    'source filename.sql runs a SQL script file from within the CLI client',
    'mysqldump exports a database to a .sql file for backup or migration',
    'Workbench is better for visual exploration; CLI is better for remote SSH sessions, scripts, and automation',
  ],
  callouts: [
    {
      type: 'gotcha',
      content: 'In the MySQL CLI, if you forget a semicolon and press Enter, MySQL waits for more input (shows -> instead of mysql>). Type ; and press Enter to complete the statement, or \\c to cancel and start over.',
    },
    {
      type: 'interview',
      content: 'Q: How do you run a SQL file in MySQL from the command line?\nA: Two ways. From inside MySQL CLI: source /path/to/file.sql. From the OS terminal: mysql -u root -p database_name < /path/to/file.sql. The second form is better for automation and CI scripts.',
    },
    {
      type: 'tip',
      content: 'In MySQL Workbench, use the "Query Stats" tab after running a query to see execution time, rows read, and whether indexes were used. This is faster than running EXPLAIN manually when you are in the GUI. Always check execution stats for queries on large tables.',
    },
  ],
}
