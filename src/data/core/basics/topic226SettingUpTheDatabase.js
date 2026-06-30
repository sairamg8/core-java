export default {
  id: 'setting-up-the-database',
  title: '226. Setting Up the Database',
  explanation: `Before writing JDBC code, you need a database and tables to work with. This setup is done once — typically through the MySQL CLI or Workbench — and then your Java code connects to it.

**Database setup checklist:**
1. Create a database (schema)
2. Create a user with appropriate privileges
3. Select the database and create tables
4. (Optional) Insert seed data for testing

**Creating the database and user (MySQL):**
\`\`\`sql
-- Connect as root
CREATE DATABASE jdbc_demo;
CREATE USER 'javaapp'@'localhost' IDENTIFIED BY 'SecurePass123';
GRANT ALL PRIVILEGES ON jdbc_demo.* TO 'javaapp'@'localhost';
FLUSH PRIVILEGES;
\`\`\`

**Creating the table:**
\`\`\`sql
USE jdbc_demo;
CREATE TABLE employees (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    department VARCHAR(50),
    salary     DECIMAL(10,2) NOT NULL,
    hire_date  DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

**Inserting seed data:**
\`\`\`sql
INSERT INTO employees (name, department, salary, hire_date) VALUES
    ('Alice Johnson', 'Engineering', 95000, '2020-01-15'),
    ('Bob Smith',     'Marketing',   72000, '2021-06-01'),
    ('Carol White',   'Engineering', 105000,'2019-03-10');
\`\`\`

**Connection string for javaapp user:**
\`\`\`
jdbc:mysql://localhost:3306/jdbc_demo?useSSL=false&serverTimezone=UTC
user: javaapp
pass: SecurePass123
\`\`\`

This is the database your JDBC code will connect to in the next topics.`,
  code: `-- ===== Database Setup SQL (run in MySQL CLI or Workbench) =====

-- 1. Create database
CREATE DATABASE IF NOT EXISTS jdbc_demo
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- 2. Create dedicated app user (never use root in application code)
CREATE USER IF NOT EXISTS 'javaapp'@'localhost' IDENTIFIED BY 'SecurePass123';
GRANT ALL PRIVILEGES ON jdbc_demo.* TO 'javaapp'@'localhost';
FLUSH PRIVILEGES;

-- 3. Switch to the new database
USE jdbc_demo;

-- 4. Create employees table
CREATE TABLE IF NOT EXISTS employees (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100)   NOT NULL,
    department VARCHAR(50)    NOT NULL DEFAULT 'General',
    salary     DECIMAL(10,2)  NOT NULL,
    hire_date  DATE,
    is_active  BOOLEAN        DEFAULT TRUE,
    created_at TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_salary CHECK (salary > 0)
);

-- 5. Create products table (for later CRUD examples)
CREATE TABLE IF NOT EXISTS products (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100)   NOT NULL UNIQUE,
    category   VARCHAR(50),
    price      DECIMAL(10,2)  NOT NULL,
    stock      INT            NOT NULL DEFAULT 0,
    created_at TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
);

-- 6. Seed data
INSERT INTO employees (name, department, salary, hire_date) VALUES
    ('Alice Johnson', 'Engineering', 95000.00, '2020-01-15'),
    ('Bob Smith',     'Marketing',   72000.00, '2021-06-01'),
    ('Carol White',   'Engineering', 105000.00,'2019-03-10'),
    ('David Lee',     'HR',          68000.00, '2022-09-20'),
    ('Eve Kim',       'Marketing',   78000.00, '2021-11-05');

INSERT INTO products (name, category, price, stock) VALUES
    ('Java Bible',      'Books',    29.99, 100),
    ('Spring Guide',    'Books',    24.99, 85),
    ('USB Hub',         'Hardware', 19.99, 200),
    ('Mechanical Kbd',  'Hardware', 89.99, 40),
    ('IntelliJ IDEA',   'Software', 49.99, 500);

-- 7. Verify setup
SELECT * FROM employees;
SELECT * FROM products;
SHOW TABLES;

-- In Java, connect with:
// String url  = "jdbc:mysql://localhost:3306/jdbc_demo?useSSL=false&serverTimezone=UTC";
// String user = "javaapp";
// String pass = "SecurePass123";
// Connection conn = DriverManager.getConnection(url, user, pass);`,
  codeTitle: 'Setting Up the Database for JDBC Practice',
  points: [
    'Create the database with utf8mb4 charset to support full Unicode including emojis',
    'Always create a dedicated application user — never connect as root from application code',
    'Grant only the privileges the app needs — typically ALL PRIVILEGES on just its own database',
    'Seed data lets you test SELECT queries immediately without writing INSERT code first',
    'The employees and products tables will be used throughout the JDBC chapter examples',
    'FLUSH PRIVILEGES refreshes the grant tables — needed after GRANT statements',
    'Save the connection string (URL, user, pass) — you will use it in every JDBC example',
  ],
  callouts: [
    {
      type: 'tip',
      content: "Create a DbConfig class or a properties file to hold your connection constants (URL, user, password). Never hardcode credentials in every class — change them in one place and every class picks up the update. In production, load from environment variables, not source code.",
    },
    {
      type: 'gotcha',
      content: "If you get 'Access denied for user javaapp@localhost', check two things: (1) the GRANT statement used the exact hostname ('localhost' vs '127.0.0.1' vs '%'), and (2) you ran FLUSH PRIVILEGES after the GRANT. MySQL resolves hostnames literally — 'localhost' and '127.0.0.1' are treated as different hosts.",
    },
    {
      type: 'interview',
      content: "Q: Why should you never use the root database user in application code?\nA: root has GRANT OPTION and can drop databases, create users, and read any table in the server. If your application's connection string is leaked (in logs, error messages, or a code repository), an attacker gains full administrative access. A least-privilege application user can only access its own database and nothing else.",
    },
  ],
}
